/* eslint-disable no-param-reassign */
/* eslint-disable react/prop-types */
/* eslint-disable prefer-destructuring */
/* eslint-disable array-callback-return */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-underscore-dangle */
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
  faFilePdf, faFileExcel, faExclamationCircle,
} from '@fortawesome/free-solid-svg-icons';
import 'jspdf-autotable';
import map from 'lodash/map';
import pick from 'lodash/pick';
import uniqBy from 'lodash/lodash';

import DataTable from '@shared/dataTable';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import tableFields from './tableFields.json';
import {
  getWorkordersExport,
} from '../workorderService';
import {
  filterStringGenerator,
  getWorkOrderPriorityText,
  getWorkOrderStateText,
  getWorkOrderTypeName,
  getMTName,
  getIssueTypeName,
} from '../utils/utils';
import {
  getColumnArray, getColumnArrayById, queryGenerator, savePdfContent,
  getAllowedCompanies, getDefaultNoValue, getCompanyTimezoneDate,
} from '../../util/appUtils';
import { setInitialValues } from '../../purchase/purchaseService';
import { getExportFileName } from '../../util/getDynamicClientData';
import { WorkOrdersModule } from '../../util/field';

const appModels = require('../../util/appModels').default;

const DataExport = (props) => {
  const {
    afterReset, fields, sortBy, sortField, apiFields
  } = props;
  const dispatch = useDispatch();
  const exportFileName = getExportFileName('Workorders')

  const [columns, setColumns] = useState(fields);
  const [dataFields, setDataFields] = useState([])

  const { userInfo } = useSelector((state) => state.user);
  const {
    workorderCount, workorderFilters, workordersExportInfo, woRows, workordersInfo,
  } = useSelector((state) => state.workorder);
  const companies = getAllowedCompanies(userInfo);

  useEffect(() => {
    setColumns(columns);
  }, [fields]);

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
    if ((userInfo && userInfo.data) && (workorderCount && workorderCount.length)
      && (workorderFilters && ((workorderFilters.states && workorderFilters.states.length > 0) || (workorderFilters.teams && workorderFilters.teams.length > 0)
        || (workorderFilters.priorities && workorderFilters.priorities.length > 0) || (workorderFilters.maintenanceTypes && workorderFilters.maintenanceTypes.length > 0)
        || (workorderFilters.types && workorderFilters.types.length > 0)
        || (workorderFilters.customFilters && workorderFilters.customFilters.length > 0) || (woRows.rows && woRows.rows.length > 0)))) {
      const offsetValue = 0;
      const statusValues = workorderFilters.states ? getColumnArray(workorderFilters.states, 'id') : [];
      const teams = workorderFilters.teams ? getColumnArrayById(workorderFilters.teams, 'id') : [];
      const priorities = workorderFilters.priorities ? getColumnArray(workorderFilters.priorities, 'id') : [];
      const maintenanceTypes = workorderFilters.maintenanceTypes ? getColumnArray(workorderFilters.maintenanceTypes, 'id') : [];
      const types = workorderFilters.types ? getColumnArray(workorderFilters.types, 'id') : [];
      const customFilters = workorderFilters.customFilters ? queryGenerator(workorderFilters.customFilters) : '';
      const rows = woRows.rows ? woRows.rows : [];
      dispatch(getWorkordersExport(companies, appModels.ORDER, workorderCount.length, offsetValue, WorkOrdersModule.workApiFields, statusValues, teams, priorities, maintenanceTypes,
        types, customFilters, rows, sortBy, sortField));
    }
  }, [userInfo, workorderCount, workorderFilters]);

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

  const [exportType, setExportType] = useState();

  const [pdfHeader, setPdfHeader] = useState([]);
  const [pdfBody, setPdfBody] = useState([]);
  const companyName = userInfo && userInfo.data ? userInfo.data.company.name : '';
  const appliedFilters = filterStringGenerator(workorderFilters);

  useEffect(() => {
    if (fields && fields.length > 0 && workordersExportInfo && workordersExportInfo.data && workordersExportInfo.data.length > 0) {
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
  }, [fields, workordersExportInfo]);

  useEffect(() => {
    if (pdfHeader && pdfHeader.__wrapped__ && pdfHeader.__wrapped__.length > 0) {
      const extractHeaderkeys = map(pdfHeader.__wrapped__, 'dataKey');
      if (workordersExportInfo && workordersExportInfo.data && workordersExportInfo.data.length > 0) {
        workordersExportInfo.data.map((data) => {
          data.equipment_location_id = data.equipment_id ? data.equipment_location_id : data.asset_id;
          data.priority = getWorkOrderPriorityText(data.priority);
          data.state = getWorkOrderStateText(data.state);
          data.issue_type = getIssueTypeName(data.issue_type);
          data.maintenance_type = getMTName(data.maintenance_type);
          data.type_category = getWorkOrderTypeName(data.type_category);
          data.create_date = getCompanyTimezoneDate(data.create_date, userInfo, 'datetime');
          data.date_planned = getCompanyTimezoneDate(data.date_planned, userInfo, 'datetime');
          data.date_execution = getCompanyTimezoneDate(data.date_execution, userInfo, 'datetime');
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
      savePdfContent('Workorders', pdfHeaders, pdfBody,  `${exportFileName}.pdf`, companyName, appliedFilters);
      dispatch(setInitialValues(false, false, false, false));
    } else if (exportType === 'excel') {
      exportTableToExcel('print_report_wo', exportFileName);
      if (afterReset) afterReset();
      dispatch(setInitialValues(false, false, false, false));
    }
  }, [exportType]);

  return (
    <Row>
      {workorderFilters && ((workorderFilters.states && workorderFilters.states.length > 0) || (workorderFilters.teams && workorderFilters.teams.length > 0)
        || (workorderFilters.maintenanceTypes && workorderFilters.maintenanceTypes.length > 0) || (workorderFilters.types && workorderFilters.types.length > 0)
        || (workorderFilters.priorities && workorderFilters.priorities.length > 0) || (workorderFilters.customFilters && workorderFilters.customFilters.length > 0)
        || (woRows.rows && woRows.rows.length > 0)) ? (
        <>
          <Col md="12" sm="12" lg="6" xs="12">
            <div className="p-3 text-center">
              <FontAwesomeIcon className="fa-3x" size="lg" icon={faFilePdf} />
              <h5>PDF</h5>
              <Button
                type="button"
                color="dark"
                className="bg-zodiac"
                disabled={workordersExportInfo && workordersExportInfo.loading}
                onClick={() => {
                  setExportType('pdf');
                }}
              >
                {(workordersExportInfo && workordersExportInfo.loading) ? (
                  <Spinner size="sm" color="light" className="mr-2" />
                ) : (<span />)}
                {' '}
                Download
              </Button>
            </div>
          </Col>
          <Col md="12" sm="12" lg="6" xs="12">
            <div className="p-3 text-center">
              <FontAwesomeIcon className="fa-3x" size="lg" icon={faFileExcel} />
              <h5>Excel</h5>
              <Button
                type="button"
                color="dark"
                className="bg-zodiac"
                disabled={workordersExportInfo && workordersExportInfo.loading}
                onClick={() => {
                  setExportType('excel');
                }}
              >
                {(workordersExportInfo && workordersExportInfo.loading) ? (
                  <Spinner size="sm" color="light" className="mr-2" />
                ) : (<span />)}
                {' '}
                Download
              </Button>
            </div>
          </Col>
        </>
      )
        : (
          <Col md="12" sm="12" lg="12" xs="12">
            <div className="text-center my-3">
              <FontAwesomeIcon className="mr-2 font-size20 mb-n2px" size="lg" icon={faExclamationCircle} />
              Apply any filter to export data
            </div>
          </Col>
        )}
      {workordersExportInfo && workordersExportInfo.err && (
        <Col md="12" sm="12" lg="12" xs="12">
          <SuccessAndErrorFormat response={workordersExportInfo} />
        </Col>
      )}
      <Col md="12" sm="12" lg="12" xs="12">
        <div className="hidden-div" id="print_report_wo">
          {exportType === 'excel' && (
            <table align="center">
              <tbody>
                <tr><td style={{ textAlign: 'center' }} colSpan={5}><b>Workorders Report</b></td></tr>
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
                columns={workordersInfo && workordersInfo.data && workordersInfo.data.length ? dataFields : []}
                data={workordersExportInfo && workordersExportInfo.data ? workordersExportInfo.data : []}
                propertyAsKey="id"
              />
            )
            : ''}
        </div>
      </Col>
      <iframe name="print_frame" title="Ticket_Export" id="print_frame" width="0" height="0" frameBorder="0" src="about:blank" />
    </Row>
  );
};

DataExport.propTypes = {
  afterReset: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  fields: PropTypes.array.isRequired,
  sortBy: PropTypes.string.isRequired,
  sortField: PropTypes.string.isRequired,
};

export default DataExport;
