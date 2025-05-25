/* eslint-disable react/prop-types */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
/* eslint-disable prefer-destructuring */
/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react';
import {
  Button,
  Col,
  Row,
  Spinner,
} from 'reactstrap';
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
import { getReOrderingRulesExport, setInitialValues } from '../../../purchaseService';
import { filterStringGeneratorReOderingRules } from '../../../utils/utils';
import {
  getDefaultNoValue,
  getLocalTime, savePdfContent,
} from '../../../../util/appUtils';

const appModels = require('../../../../util/appModels').default;

// const dataFields = tableFields.fields;

const DataExport = (props) => {
  const {
    afterReset, fields, productId, sortedValue, apiFields,
  } = props;
  const dispatch = useDispatch();
  const [columns, setColumns] = useState(fields);
  const [dataFields, setDataFields] = useState([]);
  const { userInfo } = useSelector((state) => state.user);
  const {
    reOrderingRulesFilters, reOrderingRulesCount, reOrderingRulesExportInfo, reOrderingRulesRows,
  } = useSelector((state) => state.purchase);

  useEffect(() => {
    setColumns(columns);
  }, [fields]);
  const reOderingRulesLength = reOrderingRulesCount && reOrderingRulesCount.data && reOrderingRulesCount.data.length ? reOrderingRulesCount.data.length : 0;

  useEffect(() => {
    if ((userInfo && userInfo.data) && (reOderingRulesLength)) {
      const offsetValue = 0;
      const customFiltersQuery = reOrderingRulesFilters && reOrderingRulesFilters.customFilters ? reOrderingRulesCount(reOrderingRulesCount.customFilters) : '';
      const rows = reOrderingRulesRows.rows ? reOrderingRulesRows.rows : [];
      dispatch(getReOrderingRulesExport(appModels.REORDERINGRULES, productId, reOderingRulesLength, offsetValue, apiFields, sortedValue.sortBy, sortedValue.sortField, customFiltersQuery, rows));
    }
  }, [userInfo, reOrderingRulesCount]);

  function checkFieldExists(dataColumns) {
    let dataColumnsList = dataColumns;
    if (columns.some((selectedValue) => selectedValue.includes('create_date'))) {
      dataColumnsList = dataColumnsList.concat(tableFields.createFields);
    }
    if (columns.some((selectedValue) => selectedValue.includes('product_min_qty'))) {
      dataColumnsList = dataColumnsList.concat(tableFields.minQuantityFields);
    }
    if (columns.some((selectedValue) => selectedValue.includes('product_max_qty'))) {
      dataColumnsList = dataColumnsList.concat(tableFields.maxQuantityFields);
    }
    if (columns.some((selectedValue) => selectedValue.includes('product_alert_level_qty'))) {
      dataColumnsList = dataColumnsList.concat(tableFields.alertQunatityFields);
    }
    if (columns.some((selectedValue) => selectedValue.includes('product_uom'))) {
      dataColumnsList = dataColumnsList.concat(tableFields.uomFields);
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
  const appliedFilters = filterStringGeneratorReOderingRules(reOrderingRulesFilters);

  useEffect(() => {
    if (fields && fields.length > 0 && reOrderingRulesExportInfo && reOrderingRulesExportInfo.data && reOrderingRulesExportInfo.data.length > 0) {
      const dataFieldArray = checkFieldExists(dataFields);
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
  }, [fields, reOrderingRulesExportInfo]);

  useEffect(() => {
    if (fields && fields.length) {
      let array = [];
      fields.map((field) => {
        const exportField = tableFields.fields.find((tableField) => tableField.property === field);
        if (exportField && exportField.property === 'id') {
          array.unshift(exportField);
        }
        if (exportField) {
          array.push(exportField);
        }
        array = [...new Set(array)];
      });
      setDataFields(array);
    }
  }, []);

  useEffect(() => {
    if (pdfHeader && pdfHeader.__wrapped__ && pdfHeader.__wrapped__.length > 0) {
      const extractHeaderkeys = map(pdfHeader.__wrapped__, 'dataKey');
      if (reOrderingRulesExportInfo && reOrderingRulesExportInfo.data && reOrderingRulesExportInfo.data.length > 0) {
        reOrderingRulesExportInfo.data.map((data) => {
          const buildBodyObj = pick(data, extractHeaderkeys);
          Object.keys(buildBodyObj).map((bodyData) => {
            if (Array.isArray(buildBodyObj[bodyData])) {
              buildBodyObj[bodyData] = buildBodyObj[bodyData][1];
            }
            buildBodyObj[bodyData] = getDefaultNoValue(buildBodyObj[bodyData]);
            return buildBodyObj;
          });
          setPdfBody((state) => [...state, buildBodyObj]);
          return buildBodyObj;
        });
      }
    }
  }, [pdfHeader]);

  useEffect(() => {
    const currentDate = getLocalTime(new Date());
    const title = `ReOrderingRules_On_${currentDate}`;
    if (exportType === 'pdf') {
      const pdfHeaders = pdfHeader && pdfHeader.__wrapped__ && pdfHeader.__wrapped__.length > 0 ? pdfHeader.__wrapped__ : [];
      savePdfContent('Reordering Rules', pdfHeaders, pdfBody, `${title}.pdf`, companyName, appliedFilters);
      dispatch(setInitialValues(false, false, false, false));
    } else if (exportType === 'excel') {
      exportTableToExcel('print_report_reorder', title);
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
            disabled={reOrderingRulesExportInfo && reOrderingRulesExportInfo.loading}
            onClick={() => {
              setExportType('pdf');
            }}
          >
            {(reOrderingRulesExportInfo && reOrderingRulesExportInfo.loading) ? (
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
            disabled={reOrderingRulesExportInfo && reOrderingRulesExportInfo.loading}
            onClick={() => {
              setExportType('excel');
            }}
          >
            {(reOrderingRulesExportInfo && reOrderingRulesExportInfo.loading) ? (
              <Spinner size="sm" color="light" className="mr-2" />
            ) : (<span />)}
            {' '}
            Download
          </Button>
        </div>
      </Col>
      {reOrderingRulesExportInfo && reOrderingRulesExportInfo.err && (
        <Col md="12" sm="12" lg="12" xs="12">
          <SuccessAndErrorFormat response={reOrderingRulesExportInfo} />
        </Col>
      )}
      <Col md="12" sm="12" lg="12" className="d-none">
        <div id="print_report_reorder">
          {exportType === 'excel' && (
          <table align="center">
            <tbody>
              <tr><td style={{ textAlign: 'center' }} colSpan={5}><b>Reordering Rules Report</b></td></tr>
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
            <DataTable columns={checkFieldExists(dataFields)} data={reOrderingRulesExportInfo && reOrderingRulesExportInfo.data ? reOrderingRulesExportInfo.data : []} propertyAsKey="id" />
          )}
        </div>
      </Col>
      <iframe name="print_frame" title="Vendor_Export" id="print_frame" width="0" height="0" frameBorder="0" src="about:blank" />
    </Row>
  );
};
export default DataExport;
