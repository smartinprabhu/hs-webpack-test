/* eslint-disable no-param-reassign */
/* eslint-disable no-lone-blocks */
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
} from '../../purchase/purchaseService';
import {
  getTrackerExport,
} from '../breakdownService';
import {
  filterStringGenerator,
  getAge,
} from '../utils/utils';
import {
  getLocalTime, queryGeneratorV1, saveExtraLargPdfContent, truncateHTMLTags,
  getAllCompanies, getDefaultNoValue, getCompanyTimezoneDate,
} from '../../util/appUtils';
import { getExportFileName } from '../../util/getDynamicClientData';

const appModels = require('../../util/appModels').default;

const DataExport = (props) => {
  const {
    afterReset, fields, sortedValue, rows, apiFields,
  } = props;
  const dispatch = useDispatch();
  const exportFileName = getExportFileName('breakdown_tracker');
  const [columns, setColumns] = useState(fields);
  const [dataFields, setDataFields] = useState(tableFields.fields);

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const {
    trackerCount, trackerFilters, trackerExportInfo, trackerRows, trackerInfo,
  } = useSelector((state) => state.breakdowntracker);
  const companies = getAllCompanies(userInfo, userRoles);

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
      // setDataFields(array);
    }
  }, []);

  { /*  useEffect(() => {
    if (fields && fields.length) {
      const array = [];
      fields.map((field) => {
        const exportField = tableFields.fields.find((tableField) => tableField.property === field);
        if (exportField) {
          array.push(exportField);
        }
      });
      setDataFields(array);
    }
  }, []); */ }

  useEffect(() => {
    setColumns(columns);
  }, [fields]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (trackerCount && trackerCount.length)) {
      const offsetValue = 0;
      const customFiltersQuery = trackerFilters && trackerFilters.customFilters ? queryGeneratorV1(trackerFilters.customFilters) : '';
      dispatch(getTrackerExport(companies, appModels.BREAKDOWNTRACKER, trackerCount.length, offsetValue, apiFields, customFiltersQuery, rows, sortedValue.sortBy, sortedValue.sortField));
    }
  }, [userInfo, trackerCount]);

  function checkFieldExists(dataColumns) {
    let dataColumnsList = dataColumns;
    if (columns.some((selectedValue) => selectedValue.includes('create_date'))) {
      dataColumnsList = dataColumnsList.concat(tableFields.createdFields);
    }
    if (columns.some((selectedValue) => selectedValue.includes('is_results_in_statutory_non_compliance'))) {
      dataColumnsList = dataColumnsList.concat(tableFields.resultField);
    }
    if (columns.some((selectedValue) => selectedValue.includes('remarks'))) {
      dataColumnsList = dataColumnsList.concat(tableFields.remarkField);
    }
    if (columns.some((selectedValue) => selectedValue.includes('type'))) {
      dataColumnsList = dataColumnsList.concat(tableFields.typeField);
    }
    if (columns.some((selectedValue) => selectedValue.includes('amc_status'))) {
      dataColumnsList = dataColumnsList.concat(tableFields.amcField);
    }
    if (columns.some((selectedValue) => selectedValue.includes('vendor_name'))) {
      dataColumnsList = dataColumnsList.concat(tableFields.vendorNameField);
    }
    if (columns.some((selectedValue) => selectedValue.includes('vendor_sr_number'))) {
      dataColumnsList = dataColumnsList.concat(tableFields.vendorField);
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
  const appliedFilters = filterStringGenerator(trackerFilters);

  { /* } useEffect(() => {
    if (fields && fields.length > 0 && trackerExportInfo && trackerExportInfo.data && trackerExportInfo.data.length > 0) {
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
  }, [fields, trackerExportInfo]); */ }

  useEffect(() => {
    if (fields && fields.length > 0 && trackerExportInfo && trackerExportInfo.data && trackerExportInfo.data.length > 0) {
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
  }, [fields, trackerExportInfo]);

  useEffect(() => {
    if (pdfHeader && pdfHeader.__wrapped__ && pdfHeader.__wrapped__.length > 0) {
      const extractHeaderkeys = map(pdfHeader.__wrapped__, 'dataKey');
      if (trackerExportInfo && trackerExportInfo.data && trackerExportInfo.data.length > 0) {
        trackerExportInfo.data.map((data) => {
          data.incident_age = getAge(data.incident_date, data.closed_on);
          data.incident_date = getCompanyTimezoneDate(data.incident_date, userInfo, 'datetime');
          data.attended_on = getCompanyTimezoneDate(data.attended_on, userInfo, 'datetime');
          data.closed_on = getCompanyTimezoneDate(data.closed_on, userInfo, 'datetime');
          data.create_date = getCompanyTimezoneDate(data.create_date, userInfo, 'datetime');
          data.last_comments = data.last_comments ? truncateHTMLTags(data.last_comments) : '';
          data.expexted_closure_date = getCompanyTimezoneDate(data.expexted_closure_date, userInfo, 'datetime');
          data.is_results_in_statutory_non_compliance = data.is_results_in_statutory_non_compliance ? 'Yes' : 'No';
          data.is_service_impacted = data.is_service_impacted ? 'Yes' : 'No';
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
      saveExtraLargPdfContent('Breakdown Tracker', pdfHeaders, pdfBody, `${exportFileName}.pdf`, companyName, appliedFilters);
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
            disabled={trackerExportInfo && trackerExportInfo.loading}
            onClick={() => {
              setExportType('pdf');
            }}
          >
            {(trackerExportInfo && trackerExportInfo.loading) ? (
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
            disabled={trackerExportInfo && trackerExportInfo.loading}
            onClick={() => {
              setExportType('excel');
            }}
          >
            {(trackerExportInfo && trackerExportInfo.loading) ? (
              <Spinner size="sm" color="light" className="mr-2" />
            ) : (<span />)}
            {' '}
            Download
          </Button>
        </div>
      </Col>
      {trackerExportInfo && trackerExportInfo.err && (
        <Col md="12" sm="12" lg="12" xs="12">
          <SuccessAndErrorFormat response={trackerExportInfo} />
        </Col>
      )}
      <Col md="12" sm="12" lg="12" className="d-none">
        <div id="print_report">
          {exportType === 'excel' && (
            <table align="center">
              <tbody>
                <tr><td style={{ textAlign: 'center' }} colSpan={5}><b>Breakdown Tracker Report</b></td></tr>
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
          {exportType === 'excel'
            ? (
              <DataTable
                columns={trackerInfo && trackerInfo.data && trackerInfo.data.length ? checkFieldExists(dataFields) : []}
                data={trackerExportInfo && trackerExportInfo.data ? trackerExportInfo.data : []}
                propertyAsKey="id"
              />
            )
            : ''}
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
  sortBy: PropTypes.string.isRequired,
  sortField: PropTypes.string.isRequired,
  rows: PropTypes.array.isRequired,
};

export default DataExport;
