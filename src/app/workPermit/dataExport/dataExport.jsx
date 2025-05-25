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
import { WorkPermitModule } from '../../util/field';

import {
  setInitialValues,
} from '../../purchase/purchaseService';
import {
  getWorkPermitExport,
} from '../workPermitService';

import {
  savePdfContent,
  getAllowedCompanies, queryGeneratorV1,
  getDefaultNoValue, filterStringGeneratorDynamic, getCompanyTimezoneDate,
} from '../../util/appUtils';
import {
  getStateLabelText,
} from '../utils/utils';
import { getExportFileName } from '../../util/getDynamicClientData';

const appModels = require('../../util/appModels').default;

const DataExport = (props) => {
  const {
    afterReset, fields, rows,
    sortBy, sortField, apiFields,
  } = props;
  const dispatch = useDispatch();
  const exportFileName = getExportFileName('Work_Permit')

  const [columns, setColumns] = useState(fields);
  const [pdfBody, setPdfBody] = useState([]);

  const { userInfo } = useSelector((state) => state.user);
  const {
    workPermitsCount,
    workPermitFilters,
    workPermitsExport,
    workPermits, workPermitConfig,
  } = useSelector((state) => state.workpermit);
  const [dataFields, setDataFields] = useState([]);

  const companies = getAllowedCompanies(userInfo);

  const companyName = userInfo && userInfo.data ? userInfo.data.company.name : '';
  const appliedFilters = filterStringGeneratorDynamic(workPermitFilters);
  const wpConfig = workPermitConfig && workPermitConfig.data && workPermitConfig.data.length ? workPermitConfig.data[0] : false;

  useEffect(() => {
    setColumns(columns);
  }, [fields]);

  useEffect(() => {
    if (fields && fields.length) {
      let array = [];
      let fFields = tableFields.fields;
      if (wpConfig && wpConfig.is_enable_department) {
        fFields = fFields.concat([{
          property: 'department_id',
          heading: 'Department',
        }]);
      }
      fields.map((field) => {
        const exportField = fFields.find((tableField) => tableField.property === field);
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
    if ((userInfo && userInfo.data) && (workPermitsCount && workPermitsCount.length)) {
      const offsetValue = 0;
      const customFiltersQuery = workPermitFilters && workPermitFilters.customFilters ? queryGeneratorV1(workPermitFilters.customFilters) : '';
      dispatch(getWorkPermitExport(companies, appModels.WORKPERMIT, workPermitsCount.length, offsetValue, WorkPermitModule.workPermitApiFields, customFiltersQuery, rows, sortBy, sortField));
    }
  }, [userInfo, workPermitsCount, workPermitFilters]);

  function checkFieldExists(dataColumns) {
    let dataColumnsList = dataColumns;
    if (columns.some((selectedValue) => selectedValue.includes('requestor_id'))) {
      dataColumnsList = dataColumnsList.concat(tableFields.requestorField);
    }
    if (columns.some((selectedValue) => selectedValue.includes('maintenance_team_id'))) {
      dataColumnsList = dataColumnsList.concat(tableFields.teamField);
    }
    if (columns.some((selectedValue) => selectedValue.includes('type'))) {
      dataColumnsList = dataColumnsList.concat(tableFields.typeField);
    }
    if (columns.some((selectedValue) => selectedValue.includes('duration'))) {
      dataColumnsList = dataColumnsList.concat(tableFields.durationField);
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
    if (fields && fields.length > 0 && workPermitsExport && workPermitsExport.data && workPermitsExport.data.length > 0) {
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
  }, [fields, workPermitsExport]);

  useEffect(() => {
    if (pdfHeader && pdfHeader.__wrapped__ && pdfHeader.__wrapped__.length > 0) {
      const extractHeaderkeys = map(pdfHeader.__wrapped__, 'dataKey');
      if (workPermitsExport && workPermitsExport.data && workPermitsExport.data.length > 0) {
        workPermitsExport.data.map((data) => {
          data.planned_start_time = getCompanyTimezoneDate(data.planned_start_time, userInfo, 'datetime');
          data.planned_end_time = getCompanyTimezoneDate(data.planned_end_time, userInfo, 'datetime');
          data.state = getStateLabelText(data.state, wpConfig);
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
      savePdfContent('Work Permit', pdfHeaders, pdfBody, `${exportFileName}.pdf`, companyName, appliedFilters);
      dispatch(setInitialValues(false, false, false, false));
    } else if (exportType === 'excel') {
      exportTableToExcel('print_report', exportFileName);
      if (afterReset) afterReset();
      dispatch(setInitialValues(false, false, false, false));
    }
  }, [exportType]);

  const loading = workPermitsExport && workPermitsExport.loading;

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
            disabled={loading && workPermitsCount && workPermitsCount.length <= 0}
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
            disabled={loading && workPermitsCount && workPermitsCount.length <= 0}
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
      {workPermitsExport && workPermitsExport.err && (
        <Col md="12" sm="12" lg="12" xs="12">
          <SuccessAndErrorFormat response={workPermitsExport} />
        </Col>
      )}
      <Col md="12" sm="12" lg="12" className="d-none">
        <div id="print_report">
          {exportType === 'excel' && (
            <table align="center">
              <tbody>
                <tr><td style={{ textAlign: 'center' }} colSpan={5}><b>Work Permit Report</b></td></tr>
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
              columns={workPermits && workPermits.data && workPermits.data.length ? checkFieldExists(dataFields) : []}
              data={workPermitsExport && workPermitsExport.data ? workPermitsExport.data : []}
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
