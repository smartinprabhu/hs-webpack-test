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
import uniqBy from 'lodash/lodash';

import DataTable from '@shared/dataTable';
import tableFields from './tableFields.json';

import {
  setInitialValues,
} from '../../purchase/purchaseService';

import {
  getCompanyTimezoneDateLocal, saveLargPdfContent,
  getAllowedCompanies, extractNameObject,
  getDefaultNoValue, filterStringGeneratorDynamic, getCompanyTimezoneDate,
} from '../../util/appUtils';
import { getExportFileName } from '../../util/getDynamicClientData';
import { exportingFieldsArray } from '../../purchase/utils/utils';

const appModels = require('../../util/appModels').default;

const DataExport = (props) => {
  const {
    afterReset, fields, rows,
    sortBy, sortField, isTanker, sortedValue, apiFields, exportType, setExportTrue, exportTrue, tankerTransactionsExport,
  } = props;
  const dispatch = useDispatch();
  const exportFileName = getExportFileName(isTanker ? 'Tankers' : 'Transactions');
  const [columns, setColumns] = useState(fields);
  const [pdfBody, setPdfBody] = useState([]);
  const [dataFields, setDataFields] = useState([]);
  const [excelData, setExcelData] = useState(false);

  const { userInfo } = useSelector((state) => state.user);
  const {
    typeId,
  } = useSelector((state) => state.ppm);
  console.log(typeId);
  const {
    tankerTransactionFilters,
  } = useSelector((state) => state.tanker);
  const companies = getAllowedCompanies(userInfo);

  const companyName = userInfo && userInfo.data ? userInfo.data.company.name : '';
  const appliedFilters = filterStringGeneratorDynamic(tankerTransactionFilters);

  function filterDataPdfCustom() {
    let filterTxt = '';
    if (typeId?.commodityValue?.length) {
      filterTxt += 'Commodity: ';
      filterTxt += `${typeId.commodityValue.map((c) => c.name).join(', ')} | `;
    }

    if (typeId?.vendorValue?.length) {
      filterTxt += 'Vendor: ';
      filterTxt += `${typeId.vendorValue.map((v) => v.name).join(', ')} | `;
    }
    if (typeId?.date?.length && typeId.date[0] !== null && typeId.date[1] !== null) {
      filterTxt += `In Time: ${getCompanyTimezoneDateLocal(typeId.date[0].$d, userInfo, 'date')} - ${getCompanyTimezoneDateLocal(typeId.date[1].$d, userInfo, 'date')}`;

      if (typeId?.date1?.length && typeId.date1[0] !== null && typeId.date1[1] !== null) {
        filterTxt += ' | ';
      }
    }

    if (typeId?.date1?.length && typeId.date1[0] !== null && typeId.date1[1] !== null) {
      filterTxt += `Out Time: ${getCompanyTimezoneDateLocal(typeId.date1[0].$d, userInfo, 'date')} - ${getCompanyTimezoneDateLocal(typeId.date1[1].$d, userInfo, 'date')}`;
    }
    return filterTxt;
  }

  useEffect(() => {
    setColumns(columns);
  }, [fields]);

  useEffect(() => {
    if (fields && fields.length) {
      exportingFieldsArray(isTanker ? tableFields.fieldsTankers : tableFields.fields, fields, dataFields, setDataFields);
    }
  }, [fields, isTanker]);

  function checkFieldExists(dataColumns) {
    let dataColumnsList = dataColumns;
    if (columns.some((selectedValue) => selectedValue.includes('sequence'))) {
      dataColumnsList = dataColumnsList.concat(tableFields.sequenceField);
    }
    if (columns.some((selectedValue) => selectedValue.includes('location_id'))) {
      dataColumnsList = dataColumnsList.concat(tableFields.blockField);
    }
    if (columns.some((selectedValue) => selectedValue.includes('in_datetime'))) {
      dataColumnsList = dataColumnsList.concat(tableFields.inDateField);
    }
    if (columns.some((selectedValue) => selectedValue.includes('out_datetime'))) {
      dataColumnsList = dataColumnsList.concat(tableFields.outDateField);
    }
    return dataColumnsList;
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

  useEffect(() => {
    if (fields && fields.length > 0 && tankerTransactionsExport && tankerTransactionsExport.data && tankerTransactionsExport.data.length > 0) {
      const dataFieldArray = isTanker ? tableFields.fieldsTankers : tableFields.fields;
      const uniqFieldsArray = [];
      let pdfHeaderObj = '';
      dataFieldArray.map((item) => {
        pdfHeaderObj = {
          header: item.heading,
          dataKey: item.property,
        };
        uniqFieldsArray.push(pdfHeaderObj);
      });
      setPdfHeader(uniqBy(uniqFieldsArray, 'header'));
      setExcelData(JSON.stringify(tankerTransactionsExport.data));
    }
  }, [fields, tankerTransactionsExport]);

  useEffect(() => {
    if (pdfHeader && pdfHeader.__wrapped__ && pdfHeader.__wrapped__.length > 0) {
      const extractHeaderkeys = map(pdfHeader.__wrapped__, 'dataKey');
      if (tankerTransactionsExport && tankerTransactionsExport.data && tankerTransactionsExport.data.length > 0) {
        const exportData = JSON.parse(JSON.stringify(tankerTransactionsExport.data));
        exportData.map((data) => {
          data.in_datetime = getCompanyTimezoneDate(data.in_datetime, userInfo, 'datetime');
          data.out_datetime = getCompanyTimezoneDate(data.out_datetime, userInfo, 'datetime');
          data.commodity = getDefaultNoValue(extractNameObject(data.commodity, 'name'));
          data.vendor_id = getDefaultNoValue(extractNameObject(data.vendor_id, 'name'));
          data.tanker_id = getDefaultNoValue(extractNameObject(data.tanker_id, 'name'));
          data.location_id = getDefaultNoValue(extractNameObject(data.location_id, 'path_name'));
          console.log(data.tanker_id);
          const buildBodyObj = pick(data, extractHeaderkeys);
          Object.keys(buildBodyObj).map((bodyData) => {
            if (Array.isArray(buildBodyObj[bodyData])) {
              buildBodyObj[bodyData] = buildBodyObj[bodyData][1];
            } else {
              buildBodyObj[bodyData] = getDefaultNoValue(buildBodyObj[bodyData]);
            }
            return null;
          });
          setPdfBody((state) => [...state, buildBodyObj]);
          return null;
        });
      }
    }
  }, [pdfHeader]);

  useEffect(() => {
    if (exportTrue) {
      if (exportType === 'pdf') {
        const pdfHeaders = pdfHeader && pdfHeader.__wrapped__ && pdfHeader.__wrapped__.length > 0 ? pdfHeader.__wrapped__ : [];
        saveLargPdfContent(isTanker
          ? 'Tankers' : 'Transactions', pdfHeaders, pdfBody, `${exportFileName}.pdf`, companyName, filterDataPdfCustom());
        dispatch(setInitialValues(false, false, false, false));
        setExportTrue(false);
      } else if (exportType === 'excel') {
        exportTableToExcel('print_commodity_report', exportFileName);
        if (afterReset) afterReset();
        dispatch(setInitialValues(false, false, false, false));
        setExportTrue(false);
      }
    }
  }, [exportType, exportTrue]);

  const loading = tankerTransactionsExport && tankerTransactionsExport.loading;

  return (
    <Row>
      <Col md="12" sm="12" lg="12" className="d-none">
        <div id="print_commodity_report">
          <table align="center">
            <tbody>
              <tr><td style={{ textAlign: 'center' }} colSpan={5}><b>{isTanker ? 'Tankers Report' : 'Transactions Report'}</b></td></tr>
              <tr>
                <td>Company</td>
                <td><b>{userInfo && userInfo.data ? userInfo.data.company.name : 'Company'}</b></td>
              </tr>
              <tr>
                <td>{filterDataPdfCustom() && (<span>Filters</span>)}</td>
                <td colSpan={15}><b>{filterDataPdfCustom()}</b></td>
              </tr>
            </tbody>
          </table>
          <br />
          <DataTable columns={isTanker ? tableFields.fieldsTankers : tableFields.fields} data={tankerTransactionsExport && tankerTransactionsExport.data && excelData ? JSON.parse(excelData) : []} propertyAsKey="id" />
        </div>
      </Col>
      <iframe name="print_frame" title="Vendor_Export" id="print_frame" width="0" height="0" frameBorder="0" src="about:blank" />
    </Row>
  );
};

DataExport.propTypes = {
  afterReset: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  fields: PropTypes.array.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  rows: PropTypes.array.isRequired,
  sortBy: PropTypes.string.isRequired,
  sortField: PropTypes.string.isRequired,
};

export default DataExport;
