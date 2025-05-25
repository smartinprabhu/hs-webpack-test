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
  setInitialValues,
} from '../../purchase/purchaseService';
import {
  getGatePassExport,
} from '../gatePassService';

import {
  getLocalTime, savePdfContent,
  getAllowedCompanies, queryGeneratorV1,
  getDefaultNoValue, filterStringGeneratorDynamic, getCompanyTimezoneDate,
} from '../../util/appUtils';
import { getExportFileName } from '../../util/getDynamicClientData';

const appModels = require('../../util/appModels').default;

const DataExport = (props) => {
  const {
    afterReset, fields, rows,
    sortBy, sortField,sortedValue
  } = props;
  const dispatch = useDispatch();
  const exportFileName =  getExportFileName('Gate_Pass_Reports')

  const [columns, setColumns] = useState(fields);
  const [pdfBody, setPdfBody] = useState([]);
  // const dataFields = tableFields.fields;
  const [dataFields, setDataFields] = useState(tableFields.fields);

  const { userInfo } = useSelector((state) => state.user);
  const {
    gatePassesCount,
    gatePasses,
    gatePassFilters,
    gatePassesExport,
    gatePassConfig,
  } = useSelector((state) => state.gatepass);
  const companies = getAllowedCompanies(userInfo);

  const companyName = userInfo && userInfo.data ? userInfo.data.company.name : '';
  const appliedFilters = filterStringGeneratorDynamic(gatePassFilters);

  useEffect(() => {
    setColumns(columns);
  }, [fields]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (gatePassesCount && gatePassesCount.length)) {
      const offsetValue = 0;
      const customFiltersQuery = gatePassFilters && gatePassFilters.customFilters ? queryGeneratorV1(gatePassFilters.customFilters) : '';
      dispatch(getGatePassExport(companies, appModels.GATEPASS, gatePassesCount.length, offsetValue, columns, customFiltersQuery, rows, sortedValue.sortBy, sortedValue.sortField ));
    }
  }, [userInfo, gatePassesCount, gatePassFilters, sortedValue]);

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

  function setRef(data, isRef) {
    let res = [];
    if (isRef) {
      const refIndex = data.findIndex((item) => item.property === 'reference');
      if (refIndex !== -1) {
        const newData = data;
        newData[refIndex].heading = isRef;
        res = newData;
      } else {
        res = data;
      }
    }
    return res;
  }

  const refName = gatePassConfig && gatePassConfig.data && gatePassConfig.data.length && gatePassConfig.data[0].reference_display ? gatePassConfig.data[0].reference_display : false;

  function checkFieldExists(dataColumns) {
    let dataColumnsList = setRef(dataColumns, refName);
    // let dataColumnsList = dataColumns;

    if (columns.some((selectedValue) => selectedValue.includes('name'))) {
      dataColumnsList = dataColumnsList.concat(tableFields.nameField);
    }
    if (columns.some((selectedValue) => selectedValue.includes('email'))) {
      dataColumnsList = dataColumnsList.concat(tableFields.mailField);
    }
    if (columns.some((selectedValue) => selectedValue.includes('bearer_return_on'))) {
      dataColumnsList = dataColumnsList.concat(tableFields.returnOnField);
    }
    if (columns.some((selectedValue) => selectedValue.includes('approved_on'))) {
      dataColumnsList = dataColumnsList.concat(tableFields.appOnField);
    }
    if (columns.some((selectedValue) => selectedValue.includes('approved_by'))) {
      dataColumnsList = dataColumnsList.concat(tableFields.appByField);
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

  useEffect(() => {
    if (fields && fields.length > 0 && gatePassesExport && gatePassesExport.data && gatePassesExport.data.length > 0) {
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
  }, [fields, gatePassesExport]);

  useEffect(() => {
    if (pdfHeader && pdfHeader.__wrapped__ && pdfHeader.__wrapped__.length > 0) {
      const extractHeaderkeys = map(pdfHeader.__wrapped__, 'dataKey');
      if (gatePassesExport && gatePassesExport.data && gatePassesExport.data.length > 0) {
        gatePassesExport.data.map((data) => {
          data.requested_on = getCompanyTimezoneDate(data.requested_on, userInfo, 'datetime');
          data.approved_on = getCompanyTimezoneDate(data.approved_on, userInfo, 'datetime');
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
      savePdfContent('Gate Pass', pdfHeaders, pdfBody, `${exportFileName}.pdf`, companyName, appliedFilters);
      dispatch(setInitialValues(false, false, false, false));
    } else if (exportType === 'excel') {
      exportTableToExcel('print_report', exportFileName);
      if (afterReset) afterReset();
      dispatch(setInitialValues(false, false, false, false));
    }
  }, [exportType]);

  const loading = gatePassesExport && gatePassesExport.loading;

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
            disabled={loading && gatePassesCount && gatePassesCount.length <= 0}
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
            disabled={loading && gatePassesCount && gatePassesCount.length <= 0}
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
      {gatePassesExport && gatePassesExport.err && (
        <Col md="12" sm="12" lg="12" xs="12">
          <SuccessAndErrorFormat response={gatePassesExport} />
        </Col>
      )}
      <Col md="12" sm="12" lg="12" className="d-none">
        <div id="print_report">
          {exportType === 'excel' && (
          <table align="center">
            <tbody>
              <tr><td style={{ textAlign: 'center' }} colSpan={5}><b>Gate Pass Report</b></td></tr>
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
            <DataTable columns={checkFieldExists(dataFields)} data={gatePassesExport && gatePassesExport.data ? gatePassesExport.data : []} propertyAsKey="id" />
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
  // eslint-disable-next-line react/forbid-prop-types
  rows: PropTypes.array.isRequired,
  sortBy: PropTypes.string.isRequired,
  sortField: PropTypes.string.isRequired,
};

export default DataExport;
