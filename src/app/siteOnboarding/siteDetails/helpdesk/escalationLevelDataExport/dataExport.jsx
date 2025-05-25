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
  getProductCategoryListExport,
} from '../../../../pantryManagement/pantryService';
// import {
//   getInventoryValuation,
// } from '../utils/utils';
import {
  setInitialValues,
} from '../../../../purchase/purchaseService';
import {
  getLocalTime, savePdfContent,
  getAllowedCompanies, queryGeneratorV1, getCompanyTimezoneDate, filterStringGeneratorDynamic,
} from '../../../../util/appUtils';

const appModels = require('../../../../util/appModels').default;

const DataExport = (props) => {
  const {
    afterReset, fields, rows, sortedValue, apiFields,
  } = props;
  const dispatch = useDispatch();
  const [columns, setColumns] = useState(fields);
  const [dataFields, setDataFields] = useState([]);

  const { userInfo } = useSelector((state) => state.user);
  const {
    pcExportListInfo,
  } = useSelector((state) => state.pantry);
  const {
    escalationLevelCount, escalationLevelListInfo, escalationLevelCountLoading,
    escalationLevelFilters, pcInfo,
  } = useSelector((state) => state.site);
  const companies = getAllowedCompanies(userInfo);
  const appliedFilters = filterStringGeneratorDynamic(escalationLevelFilters);

  useEffect(() => {
    setColumns(columns);
  }, [fields]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (escalationLevelCount && escalationLevelCount.length)) {
      const offsetValue = 0;
      const customFiltersQuery = escalationLevelFilters && escalationLevelFilters.customFilters ? queryGeneratorV1(escalationLevelFilters.customFilters) : '';
      dispatch(getProductCategoryListExport(companies, appModels.ESCALATIONLEVEL, escalationLevelCount.length, offsetValue, apiFields, customFiltersQuery, rows, sortedValue.sortBy, sortedValue.sortField));
    }
  }, [userInfo, escalationLevelCount]);

  function checkFieldExists(dataColumns) {
    const dataColumnsList = dataColumns;
    // if (columns.some((selectedValue) => selectedValue.includes('location_ids'))) {
    //   dataColumnsList = dataColumnsList.concat(tableFields.dateFields);
    // }
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
    if (fields && fields.length > 0 && pcExportListInfo && pcExportListInfo.data && pcExportListInfo.data.length > 0) {
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
  }, [fields, pcExportListInfo]);

  const getNewVisitArray = (array) => {
    const resources = [];
    if (array && array.length > 0) {
      for (let i = 0; i < array.length; i += 1) {
        const val = array[i];
        val.property_valuation = (val.property_valuation);
        val.product_count = val.product_count ? val.product_count : '0';
        val.create_date = getCompanyTimezoneDate(val.create_date, userInfo, 'datetime');
        resources.push(val);
      }
    }
    return resources;
  };

  useEffect(() => {
    if (pdfHeader && pdfHeader.__wrapped__ && pdfHeader.__wrapped__.length > 0) {
      const extractHeaderkeys = map(pdfHeader.__wrapped__, 'dataKey');
      const exportData = pcExportListInfo && pcExportListInfo.data && pcExportListInfo.data.length > 0 ? pcExportListInfo.data : [];
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
          return null;
        });
      }
    }
  }, [pdfHeader]);

  useEffect(() => {
    if (exportType === 'pdf') {
      const pdfHeaders = pdfHeader && pdfHeader.__wrapped__ && pdfHeader.__wrapped__.length > 0 ? pdfHeader.__wrapped__ : [];
      savePdfContent('Escalation Level', pdfHeaders, pdfBody, 'HSense-escalationlevel.pdf', companyName, appliedFilters);
      dispatch(setInitialValues(false, false, false, false, false));
    } else if (exportType === 'excel') {
      const currentDate = getLocalTime(new Date());
      const title = `EscalationLevel_on_${currentDate}`;
      exportTableToExcel('print_report_escalation', title);
      if (afterReset) afterReset();
      dispatch(setInitialValues(false, false, false, false, false));
    }
  }, [exportType]);

  const loading = pcExportListInfo && pcExportListInfo.loading;
  
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
      {pcExportListInfo && pcExportListInfo.err && (
        <Col md="12" sm="12" lg="12" xs="12">
          <SuccessAndErrorFormat response={pcExportListInfo} />
        </Col>
      )}
      <Col md="12" sm="12" lg="12" className="d-none">
        <div id="print_report_escalation">
          {exportType === 'excel' && (
          <table align="center">
            <tbody>
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
              columns={pcExportListInfo && pcExportListInfo.data && pcExportListInfo.data.length ? checkFieldExists(dataFields) : []}
              data={pcExportListInfo && pcExportListInfo.data ? pcExportListInfo.data : []}
              propertyAsKey="id"
            />
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
