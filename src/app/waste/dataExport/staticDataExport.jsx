/* eslint-disable no-unused-expressions */
/* eslint-disable no-param-reassign */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable prefer-destructuring */
/* eslint-disable array-callback-return */
/* eslint-disable react/prop-types */
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
import uniq from 'lodash/uniqBy';
import tableFields from './tableFields.json';
import {
  filterStringGenerator,
} from '../utils/utils';
import {
  saveExtraLargPdfContent,
  getDefaultNoValue, getCompanyTimezoneDate,
} from '../../util/appUtils';
import { setInitialValues } from '../../purchase/purchaseService';
import { getExportFileName } from '../../util/getDynamicClientData';

const StaticDataExport = (props) => {
  const {
    afterResets, fields, ticketData, exportType, setExportType, exportTrue,
  } = props;

  const dispatch = useDispatch();
  const exportFileName = getExportFileName('Waste Tracker');
  const [columns, setColumns] = useState(fields);
  const [dataFields, setDataFields] = useState([]);

  const { userInfo } = useSelector((state) => state.user);

  const { wasteReportFilters, wasteReportsInfo } = useSelector((state) => state.waste);

  useEffect(() => {
    if (fields && fields.length) {
      const array = [];
      tableFields.fieldsStatic && tableFields.fieldsStatic.length && tableFields.fieldsStatic.map((field) => {
        const exportField = fields.find((tableField) => tableField === field.property);
        if (exportField) {
          array.push(field);
        }
      });
      setDataFields(array, 'header');
    }
  }, [fields]);

  useEffect(() => {
    setColumns(columns);
  }, [fields]);

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
  const repData = wasteReportsInfo && wasteReportsInfo.data && wasteReportsInfo.data.length ? wasteReportsInfo.data : false;

  const [pdfHeader, setPdfHeader] = useState([]);
  const [pdfBody, setPdfBody] = useState([]);
  const companyName = userInfo && userInfo.data ? userInfo.data.company.name : '';
  const appliedFilters = filterStringGenerator(wasteReportFilters);

  useEffect(() => {
    if (fields && fields.length > 0) {
      const dataFieldArray = dataFields;
      const uniqFieldsArray = [];
      let pdfHeaderObj = '';
      if (columns.some((selectedValue) => selectedValue === 'id')) {
        pdfHeaderObj = {
          header: 'ID',
          dataKey: 'id',
        };
        uniqFieldsArray.push(pdfHeaderObj);
      }
      dataFieldArray.map((item) => {
        pdfHeaderObj = {
          header: item.heading,
          dataKey: item.property,
        };
        uniqFieldsArray.push(pdfHeaderObj);
      });
      setPdfHeader(uniqBy(uniqFieldsArray, 'header'));
    }
  }, [dataFields]);

  useEffect(() => {
    if (wasteReportsInfo && wasteReportsInfo.loading) {
      setPdfBody([]);
    }
  }, [wasteReportsInfo]);

  useEffect(() => {
    if (pdfHeader && pdfHeader.__wrapped__ && pdfHeader.__wrapped__.length > 0) {
      const extractHeaderkeys = map(pdfHeader.__wrapped__, 'dataKey');
      if (ticketData && ticketData.length > 0) {
        const exportData = JSON.parse(JSON.stringify(repData));
        exportData.map((data) => {
          data.logged_on = getCompanyTimezoneDate(data.logged_on, userInfo, 'datetime');
          data.create_date = getCompanyTimezoneDate(data.create_date, userInfo, 'datetime');
          const buildBodyObj = pick(data, extractHeaderkeys);
          buildBodyObj.id = data.id;
          Object.keys(buildBodyObj).map((bodyData) => {
            if (Array.isArray(buildBodyObj[bodyData])) {
              buildBodyObj[bodyData] = buildBodyObj[bodyData][1];
            } else {
              buildBodyObj[bodyData] = getDefaultNoValue(buildBodyObj[bodyData]);
            }
            return null;
          });
          setPdfBody((state) => [...state, buildBodyObj]);
        });
      }
    }
  }, [pdfHeader, ticketData, wasteReportFilters]);

  useEffect(() => {
    if (exportType === 'pdf') {
      const pdfHeaders = pdfHeader && pdfHeader.__wrapped__ && pdfHeader.__wrapped__.length > 0 ? pdfHeader.__wrapped__ : [];
      saveExtraLargPdfContent('Waste Tracker', pdfHeaders, uniq(pdfBody, 'id'), `${exportFileName}.pdf`, companyName, appliedFilters);
      dispatch(setInitialValues(false, false, false, false));
      if (afterResets) afterResets();
    } else if (exportType === 'excel') {
      exportTableToExcel('print_report', exportFileName);
      if (afterResets) afterResets();
      dispatch(setInitialValues(false, false, false, false));
    }
  }, [exportType, exportTrue]);

  return (
    <Row className="d-none">
      <Col md="12" sm="12" lg="12">
        <div id="print_report">
          {exportType === 'excel' && (
          <table align="center">
            <tbody>
              <tr>
                <td><b>Waste Tracker Report</b></td>
              </tr>
              <tr>
                <td>Company</td>
                <td colSpan={15}><b>{userInfo && userInfo.data ? userInfo.data.company.name : 'Company'}</b></td>
              </tr>
              <tr>
                <td>{appliedFilters && (<span>Filters</span>)}</td>
                <td colSpan={15}><b>{appliedFilters}</b></td>
              </tr>
            </tbody>
          </table>
          )}
          <br />
          {exportType === 'excel' && (
          <DataTable
            columns={ticketData && ticketData.length ? dataFields : []}
            data={ticketData && ticketData.length ? uniq(pdfBody, 'id') : []}
            propertyAsKey="id"
          />
          )}
        </div>
      </Col>
      <iframe name="print_frame" title="Waste_Tracker_Export" id="print_frame" width="0" height="0" frameBorder="0" src="about:blank" />
    </Row>
  );
};

StaticDataExport.propTypes = {
  afterResets: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  fields: PropTypes.array.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  ticketData: PropTypes.array,
};
StaticDataExport.defaultProps = {
  ticketData: [],
};

export default StaticDataExport;
