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
  getTeamsExport,
} from '../../setupService';
import {
  filterStringGenerator,
} from '../../../buildingCompliance/utils/utils';
import {
  savePdfContent,
  getAllowedCompanies, getTotalCount,
  getDefaultNoValue, queryGeneratorV1,
} from '../../../util/appUtils';
import { getExportFileName } from '../../../util/getDynamicClientData';
import { AdminSetupModule } from '../../../util/field';

const appModels = require('../../../util/appModels').default;

// const dataFields = tableFields.fields;

const DataExport = (props) => {
  const {
    afterReset, fields, sortedValue, rows, apiFields,
  } = props;
  const dispatch = useDispatch();
  const exportFileName = getExportFileName('Maintenance_Teams');
  const [columns, setColumns] = useState(fields);
  const [dataFields, setDataFields] = useState(tableFields.fields);

  const { userInfo } = useSelector((state) => state.user);
  const {
    teamCount, teamsExportInfo, teamsFilters,
  } = useSelector((state) => state.setup);
  const companies = getAllowedCompanies(userInfo);

  useEffect(() => {
    setColumns(columns);
  }, [fields]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (teamCount)) {
      const offsetValue = 0;
      const customFiltersQuery = teamsFilters && teamsFilters.customFilters ? queryGeneratorV1(teamsFilters.customFilters) : '';
      dispatch(getTeamsExport(companies, appModels.TEAM, getTotalCount(teamCount), offsetValue, AdminSetupModule.maintenanceApiFields, customFiltersQuery, rows, sortedValue.sortBy, sortedValue.sortField));
    }
  }, [userInfo, teamCount]);

  function checkFieldExists(dataColumns) {
    let dataColumnsList = dataColumns;
    if (columns.some((selectedValue) => selectedValue.includes('team_type'))) {
      dataColumnsList = dataColumnsList.concat(tableFields.typeFields);
    }
    if (columns.some((selectedValue) => selectedValue.includes('employee_id'))) {
      dataColumnsList = dataColumnsList.concat(tableFields.leaderFields);
    }
    if (columns.some((selectedValue) => selectedValue.includes('maintenance_cost_analytic_account_id'))) {
      dataColumnsList = dataColumnsList.concat(tableFields.analyticFields);
    }
    if (columns.some((selectedValue) => selectedValue.includes('labour_cost_unit'))) {
      dataColumnsList = dataColumnsList.concat(tableFields.costFields);
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
  const appliedFilters = filterStringGenerator(teamsFilters);

  useEffect(() => {
    if (fields && fields.length > 0 && teamsExportInfo && teamsExportInfo.data && teamsExportInfo.data.length > 0) {
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
  }, [fields, teamsExportInfo]);

  useEffect(() => {
    if (pdfHeader && pdfHeader.__wrapped__ && pdfHeader.__wrapped__.length > 0) {
      const extractHeaderkeys = map(pdfHeader.__wrapped__, 'dataKey');
      if (teamsExportInfo && teamsExportInfo.data && teamsExportInfo.data.length > 0) {
        teamsExportInfo.data.map((data) => {
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
      savePdfContent('Maintenance Teams', pdfHeaders, pdfBody, `${exportFileName}.pdf`, companyName, appliedFilters);
      dispatch(setInitialValues(false, false, false, false));
    } else if (exportType === 'excel') {
      exportTableToExcel('print_report_teams', exportFileName);
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
            disabled={teamsExportInfo && teamsExportInfo.loading}
            onClick={() => {
              setExportType('pdf');
            }}
          >
            {(teamsExportInfo && teamsExportInfo.loading) ? (
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
            disabled={teamsExportInfo && teamsExportInfo.loading}
            onClick={() => {
              setExportType('excel');
            }}
          >
            {(teamsExportInfo && teamsExportInfo.loading) ? (
              <Spinner size="sm" color="light" className="mr-2" />
            ) : (<span />)}
            {' '}
            Download
          </Button>
        </div>
      </Col>
      {teamsExportInfo && teamsExportInfo.err && (
        <Col md="12" sm="12" lg="12" xs="12">
          <SuccessAndErrorFormat response={teamsExportInfo} />
        </Col>
      )}
      <Col md="12" sm="12" lg="12" className="d-none">
        <div id="print_report_teams">
          {exportType === 'excel' && (
          <table align="center">
            <tbody>
              <tr><td style={{ textAlign: 'center' }} colSpan={5}><b>Maintenance Teams Report</b></td></tr>
              <tr>
                <td>Company</td>
                <td><b>{userInfo && userInfo.data ? userInfo.data.company.name : 'Company'}</b></td>
              </tr>
            </tbody>
          </table>
          )}

          <br />
          {exportType === 'excel' && (
            <DataTable
              columns={teamsExportInfo && teamsExportInfo.data && teamsExportInfo.data.length ? checkFieldExists(dataFields) : []}
              data={teamsExportInfo && teamsExportInfo.data ? teamsExportInfo.data : []}
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
  sortBy: PropTypes.string.isRequired,
  sortField: PropTypes.string.isRequired,
  // searchValue: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  rows: PropTypes.array.isRequired,
};

export default DataExport;
