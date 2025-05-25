/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
/* eslint-disable array-callback-return */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
import 'jspdf-autotable';
import map from 'lodash/map';
import pick from 'lodash/pick';
import * as PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Col,
  Row
} from 'reactstrap';

import DataTable from '@shared/dataTable';
import uniqBy from 'lodash/lodash';
import tableFields from './tableFields.json';

import { setInitialValues } from '../../../purchase/purchaseService';
import {
  extractTextObject,
  getDefaultNoValue,
  saveExtraLargPdfContent,
  exportExcelTableToXlsx,
} from '../../../util/appUtils';
import { getExportFileName } from '../../../util/getDynamicClientData';
import { groupByMultiple } from '../../../util/staticFunctions';

const DataExport = (props) => {
  const {
    afterReset, assetsList, dateFilter, groupBy, isWarrantyAge, isAuditReport, exportTrue, exportType
  } = props;
  const dispatch = useDispatch();
  const exportFileName = getExportFileName(isWarrantyAge ? 'WarrantyAgeReport' : 'AuditReport')
  const dataFields = isWarrantyAge ? tableFields.fieldsWarrentyAge : tableFields.fields;

  const { userInfo } = useSelector((state) => state.user);

  const { auditReportFiltersInfo, warrantyAgeFilterInfo } = useSelector((state) => state.equipment);


  const getFindData = (field) => {
    const result = isWarrantyAge
      ? warrantyAgeFilterInfo.customFilters && warrantyAgeFilterInfo.customFilters.length && warrantyAgeFilterInfo.customFilters.find((cFilter) => cFilter.title === field)
      : auditReportFiltersInfo.customFilters && auditReportFiltersInfo.customFilters.length && auditReportFiltersInfo.customFilters.find((cFilter) => cFilter.title === field)
    return result ? result : ''
  }


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
  const groupField = getFindData('Group By') ? getFindData('Group By').value : '';
  const groupValues = groupByMultiple(assetsList, (obj) => obj[groupField]);

  const getWarrentyValues = (array, key) => {
    let ids = '';
    if (array && array.length > 0) {
      for (let i = 0; i < array.length; i += 1) {
        if (array[i].id !== '') {
          if (array[i][key] && array[i][key].length) {
            ids += `${array[i][key]},`;
          } else {
            ids += `${array[i][key]},`;
          }
        }
      }
      ids = ids.substring(0, ids.length - 1);
    }
    return ids;
  };

  function filterStringGenerator() {
    let filterTxt = '';

    if (dateFilter && dateFilter !== '') {
      if (isAuditReport) {
        filterTxt += 'Validated On : ';
      } else {
        filterTxt += 'Custom : ';
      }
      filterTxt += dateFilter;
      filterTxt += ' | ';
    }

    if (groupBy && groupBy !== '' && isWarrantyAge) {
      filterTxt += `${groupBy} ${' : '}`;
      filterTxt += `${getWarrentyValues(warrantyAgeFilterInfo.customFilters, 'value')}`;
    } else if (groupBy && groupBy === '') {
      filterTxt += `${groupBy} ${' : '}`;
      for (let i = 0; i < groupValues.length; i += 1) {
        filterTxt += `${groupValues[i][0][groupField][1]} ${'('} ${(groupValues[i].length)} ${')'}`;
        if (i === groupValues.length - 1) {
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
      const assetNewList = assetsList.map((u) => {
        const copiedUser = Object.assign({}, u);
        copiedUser.location_id = extractTextObject(copiedUser.location_id);
        copiedUser.maintenance_team_id = extractTextObject(copiedUser.maintenance_team_id);
        return copiedUser;
      });
      saveExtraLargPdfContent(isWarrantyAge ? 'Warrenty Age' : 'Audit', pdfHeaders, assetNewList, `${exportFileName}.pdf`, companyName, appliedFilters);
      dispatch(setInitialValues(false, false, false, false));
    } else if (exportType === 'excel') {
      exportExcelTableToXlsx('print_report', exportFileName);
      if (afterReset) afterReset();
      dispatch(setInitialValues(false, false, false, false));
    }
  }, [exportType, exportTrue]);

  return (
    <Row>
      <Col md="12" sm="12" lg="12" xs="12">
        <div className="hidden-div" id="print_report">
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

DataExport.defaultProps = {
  isWarrantyAge: false,
  isAuditReport: false,
};

DataExport.propTypes = {
  afterReset: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  assetsList: PropTypes.array.isRequired,
  groupBy: PropTypes.string.isRequired,
  dateFilter: PropTypes.string.isRequired,
  isWarrantyAge: PropTypes.bool,
  isAuditReport: PropTypes.bool,
};

export default DataExport;
