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
  getComplianceExport,
} from '../complianceService';
import {
  filterStringGenerator,
} from '../utils/utils';
import {
  savePdfContent,
  getAllowedCompanies, getDefaultNoValue, getCompanyTimezoneDate, queryGeneratorWithUtc,
} from '../../util/appUtils';
import { getExportFileName } from '../../util/getDynamicClientData';
import { WasteModule } from '../../util/field';

const appModels = require('../../util/appModels').default;

const DataExport = (props) => {
  const {
    afterReset, fields, sortedValue, rows, apiFields,
  } = props;
  const dispatch = useDispatch();
  const exportFileName = getExportFileName('Waste_Tracker');
  const [columns, setColumns] = useState(fields);
  const [dataFields, setDataFields] = useState(tableFields.fields);

  const { userInfo } = useSelector((state) => state.user);
  const {
    complianceCount, complianceFilters, complianceExportInfo, complianceRows, complianceInfo,
  } = useSelector((state) => state.waste);
  const companies = getAllowedCompanies(userInfo);

  useEffect(() => {
    setColumns(columns);
  }, [fields]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (complianceCount && complianceCount.length)) {
      const offsetValue = 0;
      const customFiltersList = complianceFilters && complianceFilters.customFilters ? queryGeneratorWithUtc(complianceFilters.customFilters, false, userInfo.data) : '';
      dispatch(getComplianceExport(companies, appModels.WASTETRACKER, complianceCount.length, offsetValue, WasteModule.buildingApiFields, customFiltersList, rows, sortedValue.sortBy, sortedValue.sortField));
    }
  }, [userInfo, complianceCount, complianceFilters, sortedValue]);

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

  function checkFieldExists(dataColumns) {
    let dataColumnsList = dataColumns;
    if (columns.some((selectedValue) => selectedValue.includes('carried_by'))) {
      dataColumnsList = dataColumnsList.concat(tableFields.carryFields);
    }
    if (columns.some((selectedValue) => selectedValue.includes('security_by'))) {
      dataColumnsList = dataColumnsList.concat(tableFields.secFields);
    }
    if (columns.some((selectedValue) => selectedValue.includes('accompanied_by'))) {
      dataColumnsList = dataColumnsList.concat(tableFields.accompanyFields);
    }
    if (columns.some((selectedValue) => selectedValue.includes('create_date'))) {
      dataColumnsList = dataColumnsList.concat(tableFields.createdFields);
    }
    if (columns.some((selectedValue) => selectedValue.includes('company_id'))) {
      dataColumnsList = dataColumnsList.concat(tableFields.companyFields);
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
  const appliedFilters = filterStringGenerator(complianceFilters);

  { /* } useEffect(() => {
    if (fields && fields.length > 0 && complianceExportInfo && complianceExportInfo.data && complianceExportInfo.data.length > 0) {
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
  }, [fields, complianceExportInfo]); */ }

  useEffect(() => {
    if (fields && fields.length > 0 && complianceExportInfo && complianceExportInfo.data && complianceExportInfo.data.length > 0) {
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
  }, [fields, complianceExportInfo]);

  useEffect(() => {
    if (pdfHeader && pdfHeader.__wrapped__ && pdfHeader.__wrapped__.length > 0) {
      const extractHeaderkeys = map(pdfHeader.__wrapped__, 'dataKey');
      if (complianceExportInfo && complianceExportInfo.data && complianceExportInfo.data.length > 0) {
        complianceExportInfo.data.map((data) => {
          data.logged_on = data.logged_on ? getCompanyTimezoneDate(data.logged_on, userInfo, 'datetime') : '-';
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
      savePdfContent('Compliance Obligation', pdfHeaders, pdfBody, `${exportFileName}.pdf`, companyName, appliedFilters);
      dispatch(setInitialValues(false, false, false, false));
    } else if (exportType === 'excel') {
      exportTableToExcel('print_report', exportFileName);
      if (afterReset) afterReset();
      dispatch(setInitialValues(false, false, false, false));
    }
  }, [exportType]);

  const loading = complianceExportInfo && complianceExportInfo.loading;

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
            disabled={complianceCount && complianceCount.length === 0}
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
            disabled={complianceCount && complianceCount.length === 0}
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
      {complianceExportInfo && complianceExportInfo.err && (
        <Col md="12" sm="12" lg="12" xs="12">
          <SuccessAndErrorFormat response={complianceExportInfo} />
        </Col>
      )}
      <Col md="12" sm="12" lg="12" className="d-none">
        <div id="print_report">
          {exportType === 'excel' && (
          <table align="center">
            <tbody>
              <tr><td style={{ textAlign: 'center' }} colSpan={5}><b>Compliance Obligation Report</b></td></tr>
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
                columns={complianceInfo && complianceInfo.data && complianceInfo.data.length ? checkFieldExists(dataFields) : []}
                data={complianceExportInfo && complianceExportInfo.data ? complianceExportInfo.data : []}
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
