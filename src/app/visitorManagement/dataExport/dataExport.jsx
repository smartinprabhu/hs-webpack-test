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
  getVisitorRequestListExport,
} from '../visitorManagementService';
import customData from '../data/customData.json';
import {
  queryGeneratorV1, savePdfContent, getDefaultNoValue,
  getAllowedCompanies, getCompanyTimezoneDate, filterStringGeneratorDynamic,
} from '../../util/appUtils';
import { getExportFileName } from '../../util/getDynamicClientData';
import { VistorManagementModule } from '../../util/field';

const appModels = require('../../util/appModels').default;

const DataExport = (props) => {
  const {
    afterReset, fields, apiFields
  } = props;
  const dispatch = useDispatch();
  const exportFileName = getExportFileName('Visitor_Management')

  const [columns, setColumns] = useState(fields);
  const [dataFields, setDataFields] = useState([])

  const { userInfo } = useSelector((state) => state.user);
  const {
    visitorRequestCount, visitorRequestFilters, visitorRequestExport, visitorRequestRows,
  } = useSelector((state) => state.visitorManagement);
  const {
    sortedValue,
  } = useSelector((state) => state.equipment);
  const companies = getAllowedCompanies(userInfo);

  useEffect(() => {
    setColumns(columns);
  }, [fields]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (visitorRequestCount && visitorRequestCount.length)) {
      const offsetValue = 0;
      const customFiltersList = visitorRequestFilters.customFilters ? queryGeneratorV1(visitorRequestFilters.customFilters) : '';
      const rows = visitorRequestRows.rows ? visitorRequestRows.rows : [];
      dispatch(getVisitorRequestListExport(companies, appModels.VISITREQUEST, visitorRequestCount.length, offsetValue, VistorManagementModule.visitorApiFields, customFiltersList, rows, sortedValue.sortBy, sortedValue.sortField));
    }
  }, [userInfo, visitorRequestCount]);

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
  const appliedFilters = filterStringGeneratorDynamic(visitorRequestFilters);

  useEffect(() => {
    if (fields && fields.length) {
      let array = []
      tableFields.fields && tableFields.fields.length && tableFields.fields.map((field) => {
        let exportField = fields.find((tableField) => tableField === field.property)
        if (exportField) {
          array.push(field)
        }
      })
      setDataFields(array, 'header')
    }
  }, [])

  useEffect(() => {
    if (fields && fields.length > 0 && visitorRequestExport && visitorRequestExport.data && visitorRequestExport.data.length > 0) {
      const dataFieldArray = dataFields;
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
  }, [fields, visitorRequestExport]);

  const getEntryState = (entryStates) => {
    const filteredType = customData.entryStates.filter((data) => data.value === entryStates);
    if (filteredType && filteredType.length) {
      return filteredType[0].label;
    }
    return '-';
  };

  const getNewVisitArray = (array) => {
    const resources = [];
    if (array && array.length > 0) {
      for (let i = 0; i < array.length; i += 1) {
        const val = array[i];
        val.entry_status = getEntryState(val.entry_status);
        val.planned_in = getCompanyTimezoneDate(val.planned_in, userInfo, 'datetime');
        val.planned_out = getCompanyTimezoneDate(val.planned_out, userInfo, 'datetime');
        val.actual_in = getCompanyTimezoneDate(val.actual_in, userInfo, 'datetime');
        val.actual_out = getCompanyTimezoneDate(val.actual_out, userInfo, 'datetime');
        val.purpose = val.purpose_id ? getDefaultNoValue(val.purpose_id) : getDefaultNoValue(val.purpose)
        val.visitor_name = val.visitor_name ? val.visitor_name : '-';
        val.visitor_badge = val.visitor_badge ? val.visitor_badge : '-';
        val.organization = val.organization ? val.organization : '-';
        val.host_name = val.host_name ? val.host_name : '-';
        val.allowed_sites_id = val.allowed_sites_id && val.allowed_sites_id.length ? val.allowed_sites_id[1] : '-';
        val.type_of_visitor = val.type_of_visitor ? val.type_of_visitor : '-';
        resources.push(val);
      }
    }
    return resources;
  };

  useEffect(() => {
    if (pdfHeader && pdfHeader.__wrapped__ && pdfHeader.__wrapped__.length > 0) {
      const extractHeaderkeys = map(pdfHeader.__wrapped__, 'dataKey');
      const exportData = visitorRequestExport && visitorRequestExport.data && visitorRequestExport.data.length > 0 ? getNewVisitArray(visitorRequestExport.data) : [];
      if (exportData && exportData.length > 0) {
        exportData.map((data) => {
          const buildBodyObj = pick(data, extractHeaderkeys);
          Object.keys(buildBodyObj).map((bodyData) => {
            if (Array.isArray(buildBodyObj[bodyData])) {
              buildBodyObj[bodyData] = buildBodyObj[bodyData][1];
            }
            return buildBodyObj;
          });
          setPdfBody((state) => [...state, buildBodyObj]);
          return buildBodyObj;
        });
      }
    }
  }, [pdfHeader]);

  useEffect(() => {
    if (exportType === 'pdf') {
      const pdfHeaders = pdfHeader && pdfHeader.__wrapped__ && pdfHeader.__wrapped__.length > 0 ? pdfHeader.__wrapped__ : [];
      savePdfContent('Visitor Management', pdfHeaders, pdfBody, `${exportFileName}.pdf`, companyName, appliedFilters);
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
            disabled={visitorRequestExport && visitorRequestExport.loading}
            onClick={() => {
              setExportType('pdf');
            }}
          >
            {(visitorRequestExport && visitorRequestExport.loading) ? (
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
            disabled={visitorRequestExport && visitorRequestExport.loading}
            onClick={() => {
              setExportType('excel');
            }}
          >
            {(visitorRequestExport && visitorRequestExport.loading) ? (
              <Spinner size="sm" color="light" className="mr-2" />
            ) : (<span />)}
            {' '}
            Download
          </Button>
        </div>
      </Col>
      {visitorRequestExport && visitorRequestExport.err && (
        <Col md="12" sm="12" lg="12" xs="12">
          <SuccessAndErrorFormat response={visitorRequestExport} />
        </Col>
      )}
      <Col md="12" sm="12" lg="12" className="d-none">
        <div id="print_report">
          {exportType === 'excel' && (
            <table align="center">
              <tbody>
                <tr><td style={{ textAlign: 'center' }} colSpan={5}><b>Visitor Management Report</b></td></tr>
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
            <DataTable columns={dataFields} data={visitorRequestExport && visitorRequestExport.data ? visitorRequestExport.data : []} propertyAsKey="id" />
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
