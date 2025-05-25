/* eslint-disable array-callback-return */
/* eslint-disable no-param-reassign */
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

import { getCompanyTimeZoneDate } from '@shared/dateTimeConvertor';
import DataTable from '../../shared/hspaceDataTable';
import tableFields from './tableFields.json';
import {
  getMaintenanceExport,
} from '../adminMaintenanceService';
import {
  filterStringGenerator,
} from '../utils/utils';
import {
  getLocalTime, getColumnArrayById, queryGeneratorByDateAndTimeByKey,
} from '../../util/appUtils';

const appModels = require('../../util/appModels').default;

const dataFields = tableFields.fields;

const DataExport = (props) => {
  const {
    afterReset, fields, dateRange,
  } = props;
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [columns, setColumns] = useState(fields);
  const toggle = () => setShow(!show);
  const companyTZDate = getCompanyTimeZoneDate();

  const { userInfo } = useSelector((state) => state.user);
  const companyTimeZone=userInfo && userInfo.data &&userInfo.data.company&&userInfo.data.company.timezone
  const {
    workordersCount, maintenanceExportInfo, woRows, cleaningWorkorderFilters,
  } = useSelector((state) => state.bookingWorkorder);

  useEffect(() => {
    setColumns(columns);
  }, [fields]);

  const setDateRange = (dateRangeObj) => {
    const start = `${moment(dateRangeObj[0]).tz(companyTimeZone).startOf('date').utc()
      .format('YYYY-MM-DD HH:mm:ss')}`;
    const end = `${moment(dateRangeObj[1]).tz(companyTimeZone).endOf('date').utc()
      .format('YYYY-MM-DD HH:mm:ss')}`;
    const query = `["date_planned",">=","${start}"],["date_planned","<=","${end}"]`;
    return query;
  };
  useEffect(() => {
    if ((userInfo && userInfo.data && userInfo.data.company) && (workordersCount && workordersCount.data && workordersCount.data.length) > 0) {
      const offsetValue = 0;
      // const rows = woRows.rows ? woRows.rows : [];
      const typeValues = cleaningWorkorderFilters.types ? getColumnArrayById(cleaningWorkorderFilters.types, 'id') : [];
      let customFilters;
      if (dateRange && dateRange[0] !== null && dateRange[1] !== null) {
        customFilters = setDateRange(dateRange);
        cleaningWorkorderFilters.customFilters = [];
      } else {
        const today = setDateRange([companyTZDate, companyTZDate]);
        customFilters = cleaningWorkorderFilters.customFilters && cleaningWorkorderFilters.customFilters.length ? queryGeneratorByDateAndTimeByKey(cleaningWorkorderFilters.customFilters, 'date_planned', companyTimeZone) : today;
      }
      dispatch(getMaintenanceExport(userInfo.data.company.id, appModels.SHIFT, workordersCount && workordersCount.data && workordersCount.data.length, offsetValue, columns, false, false, typeValues, customFilters));
      setShow(true);
    }
  }, [userInfo, woRows, workordersCount]);

  function checkFieldExists(dataColumns) {
    const dataColumnsList = dataColumns;
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

  const appliedFilters = filterStringGenerator(cleaningWorkorderFilters);

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
            color="dark"
            className="bg-zodiac btn-sm"
            disabled={maintenanceExportInfo && maintenanceExportInfo.loading}
            onClick={() => handlePDFExport()}
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
            color="dark"
            className="bg-zodiac btn-sm"
            disabled={maintenanceExportInfo && maintenanceExportInfo.loading}
            onClick={() => handleExcelExport()}
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
          <DataTable columns={checkFieldExists(dataFields)} data={maintenanceExportInfo && maintenanceExportInfo.data ? maintenanceExportInfo.data : []} propertyAsKey="id" />
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
  dateRange: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]),
};
DataExport.defaultProps = {
  dateRange: undefined,
};
export default DataExport;
