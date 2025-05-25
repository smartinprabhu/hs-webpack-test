/* eslint-disable func-names */
/* eslint-disable no-param-reassign */
/* eslint-disable array-callback-return */
/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
import {
  Button,
  Col,
  Row,
  Spinner,
  Toast,
  ToastBody,
  ToastHeader,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFilePdf, faFileExcel,
} from '@fortawesome/free-solid-svg-icons';
import moment from 'moment-timezone';

import DataTable from '@shared/hspaceDataTable';
import { getCompanyTimeZoneDate } from '@shared/dateTimeConvertor';
import tableFieldsWithEmployee from './tableFieldsWithEmployee.json';
import tableFieldsWithOutEmployee from './tableFieldsWithOutEmployee.json';
import {
  getMaintenanceExport,
} from '../../adminMaintenanceService';
import {
  filterStringGenerator,
} from '../../utils/utils';
import {
  getLocalTime, getColumnArray, getColumnArrayById, queryGeneratorByDateAndTimeByKey,
} from '../../../util/appUtils';

const appModels = require('../../../util/appModels').default;

const dataFieldsWithEmployee = tableFieldsWithEmployee.fields;
const dataFieldsWithOutEmployee = tableFieldsWithOutEmployee.fields;

const DataExport = (props) => {
  const {
    afterReset, fields, dateRange, employeeField,
  } = props;
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [columns, setColumns] = useState(fields);
  const [exportData, setExportData] = useState([]);
  const [exportToPDF, setExportToPDF] = useState(false);
  const toggle = () => setShow(!show);
  const companyTZDate = getCompanyTimeZoneDate();

  const { userInfo } = useSelector((state) => state.user);
  const {
    maintenanceCount, workorderFilters, maintenanceExportInfo, woRows,
  } = useSelector((state) => state.bookingWorkorder);
  const companyTimeZone=userInfo && userInfo.data &&userInfo.data.company&& userInfo.data.company.timezone

  useEffect(() => {
    setColumns(columns);
  }, [fields]);

  const setDateRange = (dateRangeObj) => {
    const start = `${moment(dateRangeObj[0]).tz(companyTimeZone).startOf('date').utc()
      .format('YYYY-MM-DD HH:mm:ss')}`;
    const end = `${moment(dateRangeObj[1]).tz(companyTimeZone).endOf('date').utc()
      .format('YYYY-MM-DD HH:mm:ss')}`;
    const query = `["planned_in",">=","${start}"],["planned_in","<=","${end}"]`;
    return query;
  };
  useEffect(() => {
    if ((userInfo && userInfo.data && userInfo.data.company) && (maintenanceCount && maintenanceCount.length)) {
      const offsetValue = 0;
      const rows = woRows.rows ? woRows.rows : [];
      const statusValues = workorderFilters.states ? getColumnArray(workorderFilters.states, 'id') : [];
      const typeValues = workorderFilters.types ? getColumnArrayById(workorderFilters.types, 'id') : [];
      let customFilters;
      if (dateRange && dateRange[0] !== null && dateRange[1] !== null) {
        customFilters = setDateRange(dateRange);
        workorderFilters.customFilters = [];
      } else {
        const today = setDateRange([companyTZDate, companyTZDate]);
        customFilters = workorderFilters.customFilters && workorderFilters.customFilters.length ? queryGeneratorByDateAndTimeByKey(workorderFilters.customFilters, 'planned_in', companyTimeZone) : today;
      }
      let searchFilter;
      if (workorderFilters && workorderFilters.searchFilters && workorderFilters.searchFilters.length) {
        searchFilter = queryGeneratorByDateAndTimeByKey(workorderFilters.searchFilters);
      }
      dispatch(getMaintenanceExport(userInfo.data.company.id, appModels.SHIFT, maintenanceCount.length, offsetValue, columns, rows, statusValues, typeValues, customFilters, true, searchFilter));
      setShow(true);
    }
  }, [userInfo, maintenanceCount]);

  function checkFieldExists(dataColumns) {
    const dataColumnsList = dataColumns;
    return dataColumnsList;
  }
  console.log(exportToPDF, 'exportToPDFexportToPDFexportToPDFexportToPDF', exportData);
  useEffect(() => {
    if (maintenanceExportInfo && maintenanceExportInfo.data && maintenanceExportInfo.data.length && userInfo && userInfo.data && userInfo.data.company) {
      setExportData(maintenanceExportInfo.data);
    }
  }, [maintenanceExportInfo]);

  function exportTableToExcel(tableID, fileTitle = '') {
    const uri = 'data:application/vnd.ms-excel;base64,';
    // eslint-disable-next-line max-len
    const template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body><table>{table}</table></body></html>';
    const base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))); };
    const format = function (s, c) { return s.replace(/{(\w+)}/g, (m, p) => c[p]); };
    const table = document.getElementById(tableID);
    const ctx = { worksheet: fileTitle || 'Worksheet', table: table.innerHTML };
    const link = document.createElement('a');
    link.download = `${fileTitle}.xls`;
    link.href = uri + base64(format(template, ctx));
    document.body.appendChild(link);
    link.click();
  }

  const handlePDFExport = () => {
    setTimeout(() => {
      const content = document.getElementById('print_report');
      const pri = document.getElementById('print_frame').contentWindow;
      pri.document.open();
      pri.document.write(content.innerHTML);
      pri.document.close();
      pri.focus();
      pri.print();
      if (afterReset) afterReset();
    }, 1000);
  };

  const handleExcelExport = () => {
    const currentDate = getLocalTime(new Date());
    const title = `Maintenance_On_${currentDate}`;
    exportTableToExcel('print_report', title);
    if (afterReset) afterReset();
  };

  const appliedFilters = filterStringGenerator(workorderFilters);

  let errorMsg = 'Something Went wrong';

  if (maintenanceExportInfo && maintenanceExportInfo.err && maintenanceExportInfo.err.data && maintenanceExportInfo.err.data.error) {
    errorMsg = maintenanceExportInfo.err.data.error.message;
  } else if (maintenanceExportInfo && maintenanceExportInfo.err && maintenanceExportInfo.err.statusText) {
    errorMsg = maintenanceExportInfo.err.statusText;
  }

  return (
    <Row>
      <Col md="6" sm="6" lg="6" xs="6" className="p-0">
        <div className="py-2 text-center">
          <FontAwesomeIcon className="fa-3x mb-1" size="lg" icon={faFilePdf} />
          <h5>PDF</h5>
          <Button
            type="button"
            className="download-btn btn-sm"
            disabled={maintenanceExportInfo && maintenanceExportInfo.loading}
            onClick={() => { setExportToPDF(true); handlePDFExport(); }}
          >
            {(maintenanceExportInfo && maintenanceExportInfo.loading) ? (
              <Spinner size="sm" color="light" className="mr-2" />
            ) : (<span />)}
            {' '}
            Download
          </Button>
        </div>
      </Col>
      <Col md="6" sm="6" lg="6" xs="6" className="p-0">
        <div className="py-2 text-center">
          <FontAwesomeIcon className="fa-3x mb-1" size="lg" icon={faFileExcel} />
          <h5>Excel</h5>
          <Button
            type="button"
            className="download-btn btn-sm"
            disabled={maintenanceExportInfo && maintenanceExportInfo.loading}
            onClick={() => { setExportToPDF(false); handleExcelExport(); }}
          >
            {(maintenanceExportInfo && maintenanceExportInfo.loading) ? (
              <Spinner size="sm" color="light" className="mr-2" />
            ) : (<span />)}
            {' '}
            Download
          </Button>
        </div>
      </Col>
      {maintenanceExportInfo && maintenanceExportInfo.err && (
        <Toast isOpen={show} className="mt-2">
          <ToastHeader icon="danger" toggle={toggle}>FAILED</ToastHeader>
          <ToastBody>
            {errorMsg}
          </ToastBody>
        </Toast>
      )}
      <Col md="12" sm="12" lg="12" xs="12">
        <div className="hidden-div" id="print_report">
          <table id="" align="center">
            <tbody>
              <tr>
                <td>Site</td>
                <td><b>{userInfo && userInfo && userInfo.data && userInfo.data.company ? userInfo.data.company.name : 'Company'}</b></td>
              </tr>
              <tr>
                <td>{appliedFilters && (<span>Filters</span>)}</td>
                <td><b>{appliedFilters}</b></td>
              </tr>
              {/* <tr>
                <td>Date</td>
                <td><b>{userInfo && userInfo && userInfo.data.company ? userInfo.data.company.name : 'Planned In'}</b></td>
                <td><b>{userInfo && userInfo && userInfo.data.company ? userInfo.data.company.name : 'Planned Out'}</b></td>
              </tr> */}
            </tbody>
          </table>
          <br />
          <DataTable columns={checkFieldExists(employeeField ? dataFieldsWithEmployee : dataFieldsWithOutEmployee)} data={exportData} propertyAsKey="id" isExportToPDF={exportToPDF} />
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
  employeeField: PropTypes.bool,
  dateRange: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]),
};

DataExport.defaultProps = {
  employeeField: false,
  dateRange: undefined,
};

export default DataExport;
