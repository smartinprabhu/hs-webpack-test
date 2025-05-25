/* eslint-disable no-param-reassign */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable prefer-destructuring */
/* eslint-disable array-callback-return */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import {
  Button,
  Col,
  Row,
  Spinner,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFilePdf, faFileExcel,
} from '@fortawesome/free-solid-svg-icons';
import 'jspdf-autotable';
import map from 'lodash/map';
import pick from 'lodash/pick';
import uniqBy from 'lodash/lodash';

import DataTable from '@shared/dataTable';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import tableFields from './tableFields.json';
import {
  getAdjustmentsExport, setInitialValues,
} from '../../inventoryService';
import { filterStringGenerator, getStateText } from '../utils/utils';
import {
  getLocalTime, getColumnArrayById, queryGeneratorV1, savePdfContent,
  getAllowedCompanies, getDefaultNoValue,
} from '../../../util/appUtils';
import { getExportFileName } from '../../../util/getDynamicClientData';
import { InventoryModule } from '../../../util/field';

const appModels = require('../../../util/appModels').default;

// const dataFields = tableFields.fields;

const DataExport = (props) => {
  const {
    afterReset, fields, apiFields, sortedValue,
  } = props;
  const dispatch = useDispatch();
  const exportFileName = getExportFileName('Stock Audits')
  const [columns, setColumns] = useState(fields);
  const [dataFields, setDataFields] = useState([]);

  const { userInfo } = useSelector((state) => state.user);
  const {
    adjustmentCount, adjustmentFilters, adjustmentExportInfo, adjustmentRows,
  } = useSelector((state) => state.inventory);
  const companies = getAllowedCompanies(userInfo);

  useEffect(() => {
    setColumns(columns);
  }, [fields]);

  useEffect(() => {
    if (fields && fields.length) {
      const array = [];
      tableFields.fields && tableFields.fields.length && tableFields.fields.map((field) => {
        const exportField = fields.find((tableField) => tableField === field.property);
        if (exportField) {
          array.push(field);
        }
      });
      setDataFields(array, 'header');
    }
  }, []);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (adjustmentCount && adjustmentCount.length)) {
      const offsetValue = 0;
      const states = adjustmentFilters.statuses ? getColumnArrayById(adjustmentFilters.statuses, 'id') : [];
      const dates = adjustmentFilters.dates ? getColumnArrayById(adjustmentFilters.dates, 'id') : [];
      const customFilters = adjustmentFilters.customFilters ? queryGeneratorV1(adjustmentFilters.customFilters) : '';
      const rows = adjustmentRows.rows ? adjustmentRows.rows : [];
      dispatch(getAdjustmentsExport(companies, appModels.INVENTORY, adjustmentCount.length, offsetValue, InventoryModule.stockAuditApiFields, customFilters, sortedValue.sortBy, sortedValue.sortField, rows));
    }
  }, [userInfo, adjustmentCount, sortedValue]);

  function checkFieldExists(dataColumns) {
    let dataColumnsList = dataColumns;
    if (columns.some((selectedValue) => selectedValue.includes('reason_id'))) {
      dataColumnsList = dataColumnsList.concat(tableFields.reasonFields);
    }
    if (columns.some((selectedValue) => selectedValue.includes('comments'))) {
      dataColumnsList = dataColumnsList.concat(tableFields.cmtFields);
    }
    if (columns.some((selectedValue) => selectedValue.includes('total_qty'))) {
      dataColumnsList = dataColumnsList.concat(tableFields.qtyFields);
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

  const [exportType, setExportType] = useState('');

  const [pdfHeader, setPdfHeader] = useState([]);
  const [pdfBody, setPdfBody] = useState([]);
  const companyName = userInfo && userInfo.data ? userInfo.data.company.name : '';
  const appliedFilters = filterStringGenerator(adjustmentFilters);

  useEffect(() => {
    if (fields && fields.length > 0 && adjustmentExportInfo && adjustmentExportInfo.data && adjustmentExportInfo.data.length > 0) {
      const dataFieldArray = checkFieldExists(dataFields);
      const uniqFieldarray = [];
      dataFieldArray.map((item) => {
        const pdfHeaderObj = {
          header: item.heading,
          dataKey: item.property,
        };
        uniqFieldarray.push(pdfHeaderObj);
      });
      setPdfHeader(uniqBy(uniqFieldarray, 'header'));
    }
  }, [fields, adjustmentExportInfo]);

  useEffect(() => {
    if (pdfHeader && pdfHeader.__wrapped__ && pdfHeader.__wrapped__.length > 0) {
      const extractHeaderkeys = map(pdfHeader.__wrapped__, 'dataKey');
      if (adjustmentExportInfo && adjustmentExportInfo.data && adjustmentExportInfo.data.length > 0) {
        adjustmentExportInfo.data.map((data) => {
          data.state = getStateText(data.state);
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
        });
      }
    }
  }, [pdfHeader]);

  useEffect(() => {
    if (exportType === 'pdf') {
      const pdfHeaders = pdfHeader && pdfHeader.__wrapped__ && pdfHeader.__wrapped__.length > 0 ? pdfHeader.__wrapped__ : [];
      savePdfContent('Inventory Adjustments', pdfHeaders, pdfBody, `${exportFileName}.pdf`, companyName, appliedFilters);
      dispatch(setInitialValues(false, false, false, false));
    } else if (exportType === 'excel') {
      exportTableToExcel('print_report', exportFileName);
      if (afterReset) afterReset();
      dispatch(setInitialValues(false, false, false, false));
    }
  }, [exportType]);

  return (
    <Row>
      <Col md="12" sm="12" lg="6">
        <div className="p-3 text-center">
          <FontAwesomeIcon className="fa-3x" size="lg" icon={faFilePdf} />
          <h5>PDF</h5>
          <Button
            type="button"
            color="dark"
            className="bg-zodiac"
            disabled={adjustmentExportInfo && adjustmentExportInfo.loading}
            onClick={() => {
              setExportType('pdf');
            }}
          >
            {(adjustmentExportInfo && adjustmentExportInfo.loading) ? (
              <Spinner size="sm" color="light" className="mr-2" />
            ) : (<span />)}
            {' '}
            Download
          </Button>
        </div>
      </Col>
      <Col md="12" sm="12" lg="6">
        <div className="p-3 text-center">
          <FontAwesomeIcon className="fa-3x" size="lg" icon={faFileExcel} />
          <h5>Excel</h5>
          <Button
            type="button"
            color="dark"
            className="bg-zodiac"
            disabled={adjustmentExportInfo && adjustmentExportInfo.loading}
            onClick={() => {
              setExportType('excel');
            }}
          >
            {(adjustmentExportInfo && adjustmentExportInfo.loading) ? (
              <Spinner size="sm" color="light" className="mr-2" />
            ) : (<span />)}
            {' '}
            Download
          </Button>
        </div>
      </Col>
      {adjustmentExportInfo && adjustmentExportInfo.err && (
        <Col md="12" sm="12" lg="12" xs="12">
          <SuccessAndErrorFormat response={adjustmentExportInfo} />
        </Col>
      )}
      <Col md="12" sm="12" lg="12" className="d-none">
        <div id="print_report">
          {exportType === 'excel' && (
            <table align="center">
              <tbody>
                <tr><td style={{ textAlign: 'center' }} colSpan={5}><b>Inventory Adjustments Report</b></td></tr>
                <tr>
                  <td>Company</td>
                  <td><b>{userInfo && userInfo.data ? userInfo.data.company.name : 'Company'}</b></td>
                </tr>
                <tr>
                  <td>{appliedFilters && (<span>Filters</span>)}</td>
                  <td><b>{appliedFilters}</b></td>
                </tr>
              </tbody>
            </table>
          )}
          <br />
          {exportType === 'excel' && (
            <DataTable columns={checkFieldExists(dataFields)} data={adjustmentExportInfo && adjustmentExportInfo.data ? adjustmentExportInfo.data : []} propertyAsKey="id" />
          )}
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
};

export default DataExport;
