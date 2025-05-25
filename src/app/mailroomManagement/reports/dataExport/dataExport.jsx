/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
/* eslint-disable array-callback-return */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
import {
  Col,
  Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import 'jspdf-autotable';
import map from 'lodash/map';
import pick from 'lodash/pick';

import DataTable from '@shared/dataTable';
import uniqBy from 'lodash/lodash';
import tableFields from './tableFields.json';

import {
  saveMediumPdfContent, getDefaultNoValue, getCompanyTimezoneDate, extractNameObject, exportExcelTableToXlsx,
} from '../../../util/appUtils';
import { setInitialValues } from '../../../purchase/purchaseService';
import { getExportFileName } from '../../../util/getDynamicClientData';

const DataExport = (props) => {
  const {
    afterReset, assetsList, isOutbound,
    exportType, exportTrue, setExportType,
  } = props;
  const dispatch = useDispatch();
  const exportFileName = getExportFileName(isOutbound ? 'Outbound' : 'Inbound');
  const { userInfo } = useSelector((state) => state.user);
  const {
    typeId,
  } = useSelector((state) => state.ppm);

  const dataFields = isOutbound ? tableFields.outBoundfields : tableFields.inboundfields;

  function exportTableToExcel(tableID, fileTitle = '') {
    try {
      const dataType = 'application/vnd.ms-excel';
      const tableSelect = document.getElementById(tableID);
      const tableHTML = tableSelect.outerHTML;

      // Specify file name
      const fileName = fileTitle ? `${fileTitle}.xls` : 'excel_data.xls';

      // Create download link element
      const downloadLink = document.createElement('a');

      document.body.appendChild(downloadLink);

      const blob = new Blob(['\ufeff', tableHTML], { type: dataType });

      if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, fileName);
      } else {
        const elem = window.document.createElement('a');
        elem.href = window.URL.createObjectURL(blob);
        elem.download = fileName;
        document.body.appendChild(elem);
        elem.click();
        document.body.removeChild(elem);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  }

  const [pdfHeader, setPdfHeader] = useState([]);
  const [pdfBody, setPdfBody] = useState([]);
  const companyName = userInfo && userInfo.data ? userInfo.data.company.name : '';
  const dateFilter = typeId && typeId.date ? typeId.date : '';
  const status = typeId && typeId.statusValue ? typeId.statusValue : '';
  const employeeValue = typeId && typeId.employeeValue ? typeId.employeeValue : '';
  const courierValue = typeId && typeId.courierValue ? typeId.courierValue : '';
  const departmentValue = typeId && typeId.departmentValue ? typeId.departmentValue : '';

  function filterStringGenerator() {
    let filterTxt = '';

    if (dateFilter && dateFilter !== '') {
      filterTxt += 'Registered On : ';
      for (let i = 0; i < dateFilter.length; i += 1) {
        filterTxt += `${getCompanyTimezoneDate(dateFilter[i], userInfo, 'datetime')}`;
        if (i === dateFilter.length - 1) {
          filterTxt += ' ';
        } else {
          filterTxt += ', ';
        }
      }
    }

    if (status && status.length) {
      filterTxt += ' | ';
      filterTxt += 'Status: ';
      for (let i = 0; i < status.length; i += 1) {
        filterTxt += `${status[i].label}`;
        if (i === status.length - 1) {
          filterTxt += ' ';
        } else {
          filterTxt += ', ';
        }
      }
    }

    if (employeeValue && employeeValue.length) {
      filterTxt += ' | ';
      filterTxt += 'Employee :';
      for (let i = 0; i < employeeValue.length; i += 1) {
        filterTxt += `${employeeValue[i].name}`;
        if (i === employeeValue.length - 1) {
          filterTxt += ' ';
        } else {
          filterTxt += ', ';
        }
      }
    }
    if (courierValue && courierValue.length) {
      filterTxt += ' | ';
      filterTxt += 'Courier: ';
      for (let i = 0; i < courierValue.length; i += 1) {
        filterTxt += `${courierValue[i].name}`;
        if (i === courierValue.length - 1) {
          filterTxt += ' ';
        } else {
          filterTxt += ', ';
        }
      }
    }
    if (departmentValue && departmentValue.length) {
      filterTxt += ' | ';
      filterTxt += 'Department: ';
      for (let i = 0; i < departmentValue.length; i += 1) {
        filterTxt += `${departmentValue[i].display_name}`;
        if (i === departmentValue.length - 1) {
          filterTxt += ' ';
        } else {
          filterTxt += ', ';
        }
      }
    }
    return filterTxt;
  }
  const appliedFilters = filterStringGenerator();

  useEffect(() => {
    if (assetsList && assetsList.length > 0) {
      const dataFieldArray = dataFields;
      const uniqFieldsArray = [];
      dataFieldArray.map((item) => {
        const pdfHeaderObj = {
          header: item.heading,
          dataKey: item.property,
        };
        uniqFieldsArray.push(pdfHeaderObj);
      });
      setPdfHeader(uniqBy(uniqFieldsArray, 'header'));
    }
  }, [assetsList]);

  useEffect(() => {
    if (pdfHeader && pdfHeader.__wrapped__ && pdfHeader.__wrapped__.length > 0) {
      const extractHeaderkeys = map(pdfHeader.__wrapped__, 'dataKey');
      if (assetsList && assetsList.length > 0) {
        assetsList.map((data) => {
          data.received_on_export = getCompanyTimezoneDate(data.received_on, userInfo, 'datetime');
          data.delivered_on_export = getCompanyTimezoneDate(data.delivered_on, userInfo, 'datetime');
          data.collected_on_export = getCompanyTimezoneDate(data.collected_on, userInfo, 'datetime');
          data.sent_on_export = getCompanyTimezoneDate(data.sent_on, userInfo, 'datetime');
          data.employee_id_export = extractNameObject(data.employee_id, 'name');
          data.department_id_export = extractNameObject(data.department_id, 'display_name');
          data.collected_by_export = extractNameObject(data.collected_by, 'name');
          data.received_by_export = extractNameObject(data.received_by, 'name');
          data.sent_by_export = extractNameObject(data.sent_by, 'name');
          data.delivered_by_export = extractNameObject(data.delivered_by, 'name');
          data.courier_id_export = extractNameObject(data.courier_id, 'name');
          const buildBodyObj = pick(data, extractHeaderkeys);
          Object.keys(buildBodyObj).map((bodyData) => {
            if (Array.isArray(buildBodyObj[bodyData])) {
              buildBodyObj[bodyData] = buildBodyObj[bodyData][1];
            } else {
              buildBodyObj[bodyData] = getDefaultNoValue(buildBodyObj[bodyData]);
            }
            return buildBodyObj;
          });
          setPdfBody((state) => [...state, buildBodyObj]);
        });
      }
    }
  }, [pdfHeader]);

  useEffect(() => {
    if (exportType === 'pdf') {
      const pdfHeaders = pdfHeader && pdfHeader.__wrapped__ && pdfHeader.__wrapped__.length > 0 ? pdfHeader.__wrapped__ : [];
      saveMediumPdfContent(isOutbound ? 'Outbound' : 'Inbound', pdfHeaders, pdfBody, `${exportFileName}.pdf`, companyName, appliedFilters);
      dispatch(setInitialValues(false, false, false, false));
      setExportType('');
    } else if (exportType === 'excel') {
      exportExcelTableToXlsx('print_report_mail', exportFileName);
      if (afterReset) afterReset();
      dispatch(setInitialValues(false, false, false, false));
      setExportType('');
    }
  }, [exportType, exportTrue]);

  return (
    <Row>

      <Col md="12" sm="12" lg="12" xs="12">
        <div className="hidden-div" id="print_report_mail">
          {exportType === 'excel' && (
            <table align="center">
              <tbody>
                <tr>
                  <td>Company</td>
                  <td colSpan={15}><b>{userInfo && userInfo.data ? userInfo.data.company.name : 'Company'}</b></td>
                </tr>
                <tr>
                  <td>{appliedFilters && (<span>Filters</span>)}</td>
                  <td colSpan={7}><b>{appliedFilters}</b></td>
                </tr>
              </tbody>
            </table>
          )}
          <br />
          {exportType === 'excel'
            ? (
              <DataTable
                columns={assetsList && assetsList.length ? dataFields : []}
                data={assetsList && assetsList.length ? assetsList : []}
                propertyAsKey="id"
              />
            )
            : ''}
        </div>
      </Col>
      <iframe name="print_frame" title="Equipments_Export" id="print_frame" width="0" height="0" frameBorder="0" src="about:blank" />
    </Row>
  );
};

DataExport.propTypes = {
  afterReset: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  assetsList: PropTypes.array.isRequired,
  isOutbound: PropTypes.bool,
};

DataExport.defaultProps = {
  isOutbound: false,
};
export default DataExport;
