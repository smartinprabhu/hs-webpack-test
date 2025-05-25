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
  setInitialValues, getPurchaseAgreementListExport,
} from '../../purchaseService';
import customData from '../data/customData.json';
import {
  queryGeneratorV1, savePdfContent,
  getAllowedCompanies, getCompanyTimezoneDate,
  getDefaultNoValue, filterStringGeneratorDynamic,
} from '../../../util/appUtils';
import { getExportFileName } from '../../../util/getDynamicClientData';

const appModels = require('../../../util/appModels').default;

const dataFields = tableFields.fields;

const DataExport = (props) => {
  const {
    afterReset, fields,
  } = props;
  const dispatch = useDispatch();
  const exportFileName = getExportFileName('Purchase_Agreement')

  const [columns, setColumns] = useState(fields);

  const { userInfo } = useSelector((state) => state.user);
  const {
    purchaseAgreementCount, purchaseAgreementFilters, purchaseAgreementExport, purchaseAgreementRows,
  } = useSelector((state) => state.purchase);
  const companies = getAllowedCompanies(userInfo);

  useEffect(() => {
    setColumns(columns);
  }, [fields]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (purchaseAgreementCount && purchaseAgreementCount.length)) {
      const offsetValue = 0;
      const customFiltersList = purchaseAgreementFilters.customFilters ? queryGeneratorV1(purchaseAgreementFilters.customFilters) : '';
      const rows = purchaseAgreementRows.rows ? purchaseAgreementRows.rows : [];
      dispatch(getPurchaseAgreementListExport(companies, appModels.PURCHASEAGREEMENT, purchaseAgreementCount.length, offsetValue, columns, customFiltersList, rows));
    }
  }, [userInfo, purchaseAgreementCount]);

  function checkFieldExists(dataColumns) {
    let dataColumnsList = dataColumns;
    if (columns.some((selectedValue) => selectedValue.includes('company_id'))) {
      dataColumnsList = dataColumnsList.concat(tableFields.typeFields);
    }
    if (columns.some((selectedValue) => selectedValue.includes('create_date'))) {
      dataColumnsList = dataColumnsList.concat(tableFields.createFields);
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
  const appliedFilters = filterStringGeneratorDynamic(purchaseAgreementFilters);

  useEffect(() => {
    if (fields && fields.length > 0 && purchaseAgreementExport && purchaseAgreementExport.data && purchaseAgreementExport.data.length > 0) {
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
  }, [fields, purchaseAgreementExport]);

  const getAgreeStatusLabel = (agreeStates) => {
    const filteredType = customData.agreeStates.filter((data) => data.value === agreeStates);
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
        val.state = getAgreeStatusLabel(val.state);
        val.ordering_date = getCompanyTimezoneDate(val.ordering_date, userInfo, 'datetime');
        val.date_end = getCompanyTimezoneDate(val.date_end, userInfo, 'datetime');
        resources.push(val);
      }
    }
    return resources;
  };

  useEffect(() => {
    if (pdfHeader && pdfHeader.__wrapped__ && pdfHeader.__wrapped__.length > 0) {
      const extractHeaderkeys = map(pdfHeader.__wrapped__, 'dataKey');
      const exportData = purchaseAgreementExport && purchaseAgreementExport.data && purchaseAgreementExport.data.length > 0 ? getNewVisitArray(purchaseAgreementExport.data) : [];
      if (exportData && exportData.length > 0) {
        exportData.map((data) => {
          data.state = getAgreeStatusLabel(data.state);
          const buildBodyObj = pick(data, extractHeaderkeys);
          Object.keys(buildBodyObj).map((bodyData) => {
            if (Array.isArray(buildBodyObj[bodyData])) {
              buildBodyObj[bodyData] = buildBodyObj[bodyData][1];
            } else {
              buildBodyObj[bodyData] = getDefaultNoValue(buildBodyObj[bodyData]);
            }
            return null
          });
          setPdfBody((state) => [...state, buildBodyObj]);
          return null
        });
      }
    }
  }, [pdfHeader]);

  useEffect(() => {
    if (exportType === 'pdf') {
      const pdfHeaders = pdfHeader && pdfHeader.__wrapped__ && pdfHeader.__wrapped__.length > 0 ? pdfHeader.__wrapped__ : [];
      savePdfContent('Purchase Agreement', pdfHeaders, pdfBody, `${exportFileName}.pdf`, companyName, appliedFilters);
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
            disabled={purchaseAgreementExport && purchaseAgreementExport.loading}
            onClick={() => {
              setExportType('pdf');
            }}
          >
            {(purchaseAgreementExport && purchaseAgreementExport.loading) ? (
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
            disabled={purchaseAgreementExport && purchaseAgreementExport.loading}
            onClick={() => {
              setExportType('excel');
            }}
          >
            {(purchaseAgreementExport && purchaseAgreementExport.loading) ? (
              <Spinner size="sm" color="light" className="mr-2" />
            ) : (<span />)}
            {' '}
            Download
          </Button>
        </div>
      </Col>
      {purchaseAgreementExport && purchaseAgreementExport.err && (
        <Col md="12" sm="12" lg="12" xs="12">
          <SuccessAndErrorFormat response={purchaseAgreementExport} />
        </Col>
      )}
      <Col md="12" sm="12" lg="12" className="d-none">
        <div id="print_report">
          {exportType === 'excel' && (
          <table align="center">
            <tbody>
              <tr><td style={{ textAlign: 'center' }} colSpan={5}><b> Purchase Agreement Report </b></td></tr>
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
            <DataTable columns={checkFieldExists(dataFields)} data={purchaseAgreementExport && purchaseAgreementExport.data ? purchaseAgreementExport.data : []} propertyAsKey="id" />
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
