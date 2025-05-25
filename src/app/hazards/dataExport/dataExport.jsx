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
  getIncidentsExport,
} from '../ctService';
import {
  filterStringGenerator,
} from '../utils/utils';
import {
  queryGeneratorV1, savePdfContent,
  getAllCompanies, getDefaultNoValue, getCompanyTimezoneDate,
} from '../../util/appUtils';
import { getExportFileName } from '../../util/getDynamicClientData';
import {
  typeCtegoryLabelFunction,
} from '../../siteOnboarding/utils/utils';

const appModels = require('../../util/appModels').default;

const DataExport = (props) => {
  const {
    afterReset, fields, sortedValue, rows, apiFields,
  } = props;
  const dispatch = useDispatch();
  const exportFileName = getExportFileName('ehs_hazards');
  const [columns, setColumns] = useState(fields);
  const [dataFields, setDataFields] = useState(tableFields.fields);

  const { userInfo } = useSelector((state) => state.user);
  const {
    incidentHxCount, incidentHxFilters, incidentHxExportInfo,
  } = useSelector((state) => state.hazards);
  const companies = getAllCompanies(userInfo);

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
    if ((userInfo && userInfo.data) && (incidentHxCount && incidentHxCount.length)) {
      const offsetValue = 0;
      const customFiltersQuery = incidentHxFilters && incidentHxFilters.customFilters ? queryGeneratorV1(incidentHxFilters.customFilters) : '';
      dispatch(getIncidentsExport(companies, appModels.EHSHAZARD, incidentHxCount.length, offsetValue, apiFields, customFiltersQuery, rows, sortedValue.sortBy, sortedValue.sortField));
    }
  }, [userInfo, incidentHxCount]);

  function checkFieldExists(dataColumns) {
    let dataColumnsList = dataColumns;
    if (columns.some((selectedValue) => selectedValue.includes('reported_by_id'))) {
      dataColumnsList = dataColumnsList.concat(tableFields.reportedByFields);
    }
    if (columns.some((selectedValue) => selectedValue.includes('acknowledged_by_id'))) {
      dataColumnsList = dataColumnsList.concat(tableFields.acknowledgedByFields);
    }
    if (columns.some((selectedValue) => selectedValue.includes('acknowledged_on'))) {
      dataColumnsList = dataColumnsList.concat(tableFields.acknowledgedOnFields);
    }
    if (columns.some((selectedValue) => selectedValue.includes('resolved_by_id'))) {
      dataColumnsList = dataColumnsList.concat(tableFields.resolvedByFields);
    }
    if (columns.some((selectedValue) => selectedValue.includes('resolved_on'))) {
      dataColumnsList = dataColumnsList.concat(tableFields.resolvedOnFields);
    }
    if (columns.some((selectedValue) => selectedValue.includes('validated_by_id'))) {
      dataColumnsList = dataColumnsList.concat(tableFields.validatedByFields);
    }
    if (columns.some((selectedValue) => selectedValue.includes('validated_on'))) {
      dataColumnsList = dataColumnsList.concat(tableFields.validatedOnFields);
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
  const appliedFilters = filterStringGenerator(incidentHxFilters);

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
    if (fields && fields.length > 0 && incidentHxExportInfo && incidentHxExportInfo.data && incidentHxExportInfo.data.length > 0) {
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
  }, [fields, incidentHxExportInfo]);

  useEffect(() => {
    if (pdfHeader && pdfHeader.__wrapped__ && pdfHeader.__wrapped__.length > 0) {
      const extractHeaderkeys = map(pdfHeader.__wrapped__, 'dataKey');
      if (incidentHxExportInfo && incidentHxExportInfo.data && incidentHxExportInfo.data.length > 0) {
        incidentHxExportInfo.data.map((data) => {
          data.target_closure_date = getCompanyTimezoneDate(data.target_closure_date, userInfo, 'date');
          data.reported_on = getCompanyTimezoneDate(data.reported_on, userInfo, 'datetime');
          data.acknowledged_on = getCompanyTimezoneDate(data.acknowledged_on, userInfo, 'datetime');
          data.resolved_on = getCompanyTimezoneDate(data.resolved_on, userInfo, 'datetime');
          data.validated_on = getCompanyTimezoneDate(data.validated_on, userInfo, 'datetime');
          data.incident_on = getCompanyTimezoneDate(data.incident_on, userInfo, 'datetime');
          data.type_category = typeCtegoryLabelFunction(data.type_category);
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
      savePdfContent('EHS Hazards', pdfHeaders, pdfBody, `${exportFileName}.pdf`, companyName, appliedFilters);
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
            disabled={incidentHxExportInfo && incidentHxExportInfo.loading}
            onClick={() => {
              setExportType('pdf');
            }}
          >
            {(incidentHxExportInfo && incidentHxExportInfo.loading) ? (
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
            disabled={incidentHxExportInfo && incidentHxExportInfo.loading}
            onClick={() => {
              setExportType('excel');
            }}
          >
            {(incidentHxExportInfo && incidentHxExportInfo.loading) ? (
              <Spinner size="sm" color="light" className="mr-2" />
            ) : (<span />)}
            {' '}
            Download
          </Button>
        </div>
      </Col>
      {incidentHxExportInfo && incidentHxExportInfo.err && (
        <Col md="12" sm="12" lg="12" xs="12">
          <SuccessAndErrorFormat response={incidentHxExportInfo} />
        </Col>
      )}
      <Col md="12" sm="12" lg="12" className="d-none">
        <div id="print_report">
          {exportType === 'excel' && (
            <table align="center">
              <tbody>
                <tr><td style={{ textAlign: 'center' }} colSpan={5}><b>SLA Audit Report</b></td></tr>
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
                columns={incidentHxExportInfo && incidentHxExportInfo.data && incidentHxExportInfo.data.length ? checkFieldExists(dataFields) : []}
                data={incidentHxExportInfo && incidentHxExportInfo.data ? incidentHxExportInfo.data : []}
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
