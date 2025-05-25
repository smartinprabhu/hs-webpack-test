/* eslint-disable max-len */
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
  setInitialValues,
} from '../../../purchase/purchaseService';
import {
  getPartsExport,
} from '../../../adminSetup/maintenanceConfiguration/maintenanceService';

import {
  getLocalTime, savePdfContent,
  getAllowedCompanies, getTotalCount,
  queryGeneratorV1, getDefaultNoValue, extractValueArray, getCompanyTimezoneDate, extractNameObject,
} from '../../../util/appUtils';
import {
  filterStringGeneratorTool,
} from '../../../preventiveMaintenance/utils/utils';
import { getExportFileName } from '../../../util/getDynamicClientData';
import { PantryModule } from '../../../util/field';

const appModels = require('../../../util/appModels').default;

const DataExport = (props) => {
  const {
    afterReset, fields, rows, statusValue, pantryProduct, menuType, apiFields, sortedValue,
  } = props;
  const dispatch = useDispatch();
  const exportFileName = getExportFileName(pantryProduct ? 'Products' : 'Parts')
  const [columns, setColumns] = useState(fields);
  const [dataFields, setDataFields] = useState([]);

  const { userInfo } = useSelector((state) => state.user);
  const {
    partsCount, partsExportData, partsFilters,
  } = useSelector((state) => state.maintenance);
  const companies = getAllowedCompanies(userInfo);

  useEffect(() => {
    setColumns(columns);
  }, [fields]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (partsCount && partsCount.length)) {
      const offsetValue = 0;
      const customFiltersQuery = partsFilters && partsFilters.customFilters ? queryGeneratorV1(partsFilters.customFilters) : '';
      dispatch(getPartsExport(companies, appModels.PARTS, getTotalCount(partsCount), offsetValue, PantryModule.pantryProductApiFields, statusValue, customFiltersQuery, rows, menuType, sortedValue.sortBy, sortedValue.sortField));
    }
  }, [userInfo, partsCount, sortedValue]);

  function checkFieldExists(dataColumns) {
    let dataColumnsList = dataColumns;
    if (columns.some((selectedValue) => selectedValue.includes('active'))) {
      dataColumnsList = dataColumnsList.concat(tableFields.statusFields);
    }
    if (columns.some((selectedValue) => selectedValue.includes('weight'))) {
      dataColumnsList = dataColumnsList.concat(tableFields.weightFields);
    }
    if (columns.some((selectedValue) => selectedValue.includes('volume'))) {
      dataColumnsList = dataColumnsList.concat(tableFields.volumeFields);
    }
    if (columns.some((selectedValue) => selectedValue.includes('new_until'))) {
      dataColumnsList = dataColumnsList.concat(tableFields.newUntilFields);
    }
    if (columns.some((selectedValue) => selectedValue.includes('company_id'))) {
      dataColumnsList = dataColumnsList.concat(tableFields.companyFields);
    }
    if (columns.some((selectedValue) => selectedValue.includes('uom_id.name'))) {
      dataColumnsList = dataColumnsList.concat(tableFields.Uom);
    }
    if (columns.some((selectedValue) => selectedValue.includes('uom_po_id.name'))) {
      dataColumnsList = dataColumnsList.concat(tableFields.PurchaseUOM);
    }
    if (columns.some((selectedValue) => selectedValue.includes('create_date'))) {
      dataColumnsList = dataColumnsList.concat(tableFields.dateFields);
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
  const appliedFilters = filterStringGeneratorTool(statusValue, partsFilters);

  useEffect(() => {
    if (fields && fields.length > 0 && partsExportData && partsExportData.data && partsExportData.data.length > 0) {
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
  }, [fields, partsExportData]);

  const getNewArray = (array) => {
    const resources = [];
    if (array && array.length > 0) {
      for (let i = 0; i < array.length; i += 1) {
        const val = array[i];
        val.pantry_ids = getDefaultNoValue(extractValueArray(val.pantry_ids, 'name'));
        val.active = val.active ? 'Active' : 'Inactive';
        val.minimum_order_qty = val.minimum_order_qty ? val.minimum_order_qty : '0';
        val.maximum_order_qty = val.maximum_order_qty ? val.maximum_order_qty : '0';
        val.weight = val.weight ? val.weight : '0';
        val.volume = val.volume ? val.volume : '0';
        val.create_date = getCompanyTimezoneDate(val.create_date, userInfo, 'datetime');
        val.new_until = getCompanyTimezoneDate(val.new_until, userInfo, 'datetime');
        val.categ_id = getDefaultNoValue(extractNameObject(val.categ_id, 'display_name'));
        val.company_id = getDefaultNoValue(extractNameObject(val.company_id, 'name'));
        val.uom_id = getDefaultNoValue(extractNameObject(val.uom_id, 'name'));
        val.uom_po_id = getDefaultNoValue(extractNameObject(val.uom_po_id, 'name'));
        resources.push(val);
      }
    }
    return resources;
  };

  useEffect(() => {
    if (pdfHeader && pdfHeader.__wrapped__ && pdfHeader.__wrapped__.length > 0) {
      const extractHeaderkeys = map(pdfHeader.__wrapped__, 'dataKey');
      const exportData = partsExportData && partsExportData.data && partsExportData.data.length > 0 ? getNewArray(partsExportData.data) : [];
      if (exportData && exportData.length > 0) {
        exportData.map((data) => {
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
          return null;
        });
      }
    }
  }, [pdfHeader]);

  useEffect(() => {
    const mainTitle = 'Products';
    if (exportType === 'pdf') {
      const pdfHeaders = pdfHeader && pdfHeader.__wrapped__ && pdfHeader.__wrapped__.length > 0 ? pdfHeader.__wrapped__ : [];
      savePdfContent(mainTitle, pdfHeaders, pdfBody, `${exportFileName}.pdf`, companyName, appliedFilters);
      dispatch(setInitialValues(false, false, false, false));
    } else if (exportType === 'excel') {
      exportTableToExcel('print_report_pantry_product', exportFileName);
      if (afterReset) afterReset();
      dispatch(setInitialValues(false, false, false, false));
    }
  }, [exportType]);

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

  const loading = partsExportData && partsExportData.loading;

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
            disabled={loading}
            onClick={() => {
              setExportType('pdf');
            }}
          >
            {(loading) ? (
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
            disabled={loading}
            onClick={() => {
              setExportType('excel');
            }}
          >
            {(loading) ? (
              <Spinner size="sm" color="light" className="mr-2" />
            ) : (<span />)}
            {' '}
            Download
          </Button>
        </div>
      </Col>
      {partsExportData && partsExportData.err && (
        <Col md="12" sm="12" lg="12" xs="12">
          <SuccessAndErrorFormat response={partsExportData} />
        </Col>
      )}
      <Col md="12" sm="12" lg="12" className="d-none">
        <div id="print_report_pantry_product">
          {exportType === 'excel' && (
          <table align="center">
            <tbody>
              <tr><td style={{ textAlign: 'center' }} colSpan={5}><b>Products Report</b></td></tr>
              <tr>
                <td>Company</td>
                <td><b>{userInfo && userInfo.data ? userInfo.data.company.name : 'Company'}</b></td>
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
              columns={partsExportData && partsExportData.data && partsExportData.data.length ? checkFieldExists(dataFields) : []}
              data={partsExportData && partsExportData.data ? partsExportData.data : []}
              propertyAsKey="id"
            />
          )}
        </div>
      </Col>
      <iframe name="print_frame" title="PPM_Operations_Export" id="print_frame" width="0" height="0" frameBorder="0" src="about:blank" />
    </Row>
  );
};

DataExport.propTypes = {
  afterReset: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  fields: PropTypes.array.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  rows: PropTypes.array.isRequired,
  pantryProduct: PropTypes.bool.isRequired,
  statusValue: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  menuType: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
};

export default DataExport;
