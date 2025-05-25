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
  getNatureofWorkExport,
} from '../workPermitService';

import {
  savePdfContent,
  getAllowedCompanies, queryGeneratorV1,
  getDefaultNoValue, filterStringGeneratorDynamic, getCompanyTimezoneDate,
} from '../../util/appUtils';
import { getExportFileName } from '../../util/getDynamicClientData';
import { WorkPermitModule } from '../../util/field';
import { exportingFieldsArray, getNewArray } from '../../purchase/utils/utils'; 

const appModels = require('../../util/appModels').default;

const DataExportNatureofWork = (props) => {
  const {
    afterReset, fields, rows, apiFields,
    sortedValue,
  } = props;
  const dispatch = useDispatch();
  const exportFileName = getExportFileName('Nature_of_work')

  const [columns, setColumns] = useState(fields);
  const [pdfBody, setPdfBody] = useState([]);
  const [dataFields, setDataFields] = useState([]);

  const { userInfo } = useSelector((state) => state.user);
  const {
    natureofWorkCount,
    natureofWorkFilters,
    natureofWorkExport,
  } = useSelector((state) => state.workpermit);
  const companies = getAllowedCompanies(userInfo);

  const companyName = userInfo && userInfo.data ? userInfo.data.company.name : '';
  const appliedFilters = filterStringGeneratorDynamic(natureofWorkFilters);

  useEffect(() => {
    if (fields && fields.length) {
      exportingFieldsArray(tableFields.natureFields, fields, dataFields, setDataFields);
}
}, []);

  useEffect(() => {
    setColumns(columns);
  }, [fields]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (natureofWorkCount && natureofWorkCount.length)) {
      const offsetValue = 0;
      const customFiltersQuery = natureofWorkFilters && natureofWorkFilters.customFilters ? queryGeneratorV1(natureofWorkFilters.customFilters) : '';
      dispatch(getNatureofWorkExport(companies, appModels.NATUREWORK, natureofWorkCount.length, offsetValue, WorkPermitModule.natureWorkAPiFields, customFiltersQuery, rows, sortedValue.sortBy, sortedValue.sortField));
    }
  }, [userInfo, natureofWorkCount, natureofWorkFilters]);

  function checkFieldExists(dataColumns) {
    let dataColumnsList = dataColumns;
    if (columns.some((selectedValue) => selectedValue.includes('company_id'))) {
      dataColumnsList = dataColumnsList.concat(tableFields.companyField);
    }
    if (columns.some((selectedValue) => selectedValue.includes('ehs_instructions'))) {
      dataColumnsList = dataColumnsList.concat(tableFields.ehsField);
    }
    if (columns.some((selectedValue) => selectedValue.includes('terms_conditions'))) {
      dataColumnsList = dataColumnsList.concat(tableFields.termsAndConditionField);
    }
    if (columns.some((selectedValue) => selectedValue.includes('work_location'))) {
      dataColumnsList = dataColumnsList.concat(tableFields.locationFields);
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
    if (fields && fields.length > 0 && natureofWorkExport && natureofWorkExport.data && natureofWorkExport.data.length > 0) {
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
  }, [fields, natureofWorkExport]);

  useEffect(() => {
    if (pdfHeader && pdfHeader.__wrapped__ && pdfHeader.__wrapped__.length > 0) {
      const extractHeaderkeys = map(pdfHeader.__wrapped__, 'dataKey');
      const exportData = natureofWorkExport && natureofWorkExport.data && natureofWorkExport.data.length > 0 ? getNewArray(natureofWorkExport.data) : [];
      if (exportData) {
        exportData.map((data) => {
          data.planned_start_time = getCompanyTimezoneDate(data.planned_start_time, userInfo, 'datetime');
          data.planned_end_time = getCompanyTimezoneDate(data.planned_end_time, userInfo, 'datetime');
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
      savePdfContent('Nature Of Work', pdfHeaders, pdfBody, `${exportFileName}.pdf`, companyName, appliedFilters);
      dispatch(setInitialValues(false, false, false, false));
    } else if (exportType === 'excel') {
      exportTableToExcel('print_report_naturework', exportFileName);
      if (afterReset) afterReset();
      dispatch(setInitialValues(false, false, false, false));
    }
  }, [exportType]);

  const loading = natureofWorkExport && natureofWorkExport.loading;

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
            disabled={loading && natureofWorkCount && natureofWorkCount.length <= 0}
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
            disabled={loading && natureofWorkCount && natureofWorkCount.length <= 0}
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
      {natureofWorkExport && natureofWorkExport.err && (
        <Col md="12" sm="12" lg="12" xs="12">
          <SuccessAndErrorFormat response={natureofWorkExport} />
        </Col>
      )}
      <Col md="12" sm="12" lg="12" className="d-none">
        <div id="print_report_naturework">
          {exportType === 'excel' && (
          <table align="center">
            <tbody>
              <tr>
                <td style={{ textAlign: 'center' }} colSpan={5}>
                  <b>Nature Of Work Reports</b>
                </td>
              </tr>
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
            <DataTable columns={checkFieldExists(dataFields)} data={natureofWorkExport && natureofWorkExport.data ? natureofWorkExport.data : []} propertyAsKey="id" />
          )}
        </div>
      </Col>
      <iframe name="print_frame" title="Vendor_Export" id="print_frame" width="0" height="0" frameBorder="0" src="about:blank" />
    </Row>
  );
};

DataExportNatureofWork.propTypes = {
  afterReset: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  fields: PropTypes.array.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  rows: PropTypes.array.isRequired,
  sortBy: PropTypes.string.isRequired,
  sortField: PropTypes.string.isRequired,
};

export default DataExportNatureofWork;
