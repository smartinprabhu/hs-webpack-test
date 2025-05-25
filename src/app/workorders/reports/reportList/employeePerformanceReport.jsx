/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/* eslint-disable import/no-unresolved */
/* eslint-disable radix */
import React from 'react';
import {
  Button, Card, CardBody, Col, Row, Popover, PopoverHeader, PopoverBody, Spinner,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileExcel,
  faFilePdf,
} from '@fortawesome/free-solid-svg-icons';

import ErrorContent from '@shared/errorContent';
import closeCircleIcon from '@images/icons/closeCircle.svg';
import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import ExportList from '@shared/listViewFilters/export';
import {
  generateErrorMessage, getCompanyTimezoneDate,
  getListOfModuleOperations, getColumnArrayValueByField,
} from '../../../util/appUtils';
import { groupByMultiple } from '../../../util/staticFunctions';
import { resetEmployeeReport } from '../../workorderService';
import { setInitialValues } from '../../../purchase/purchaseService';
import {
  getReportId, getTypeId,
} from '../../../preventiveMaintenance/ppmService';
import ChecklistPrint from './checklistPrintEmployee';
import './sidebar/stickyTableEmployee.css';
import actionCodes from '../data/actionCodes.json';

const EmployeePerformanceReport = React.memo((props) => {
  const {
    afterReset, reportName, collapse,
  } = props;
  const dispatch = useDispatch();
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const {
    typeId,
  } = useSelector((state) => state.ppm);
  const {
    employeePerformanceReport,
  } = useSelector((state) => state.workorder);
  const { filterInitailValues } = useSelector((state) => state.purchase);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Work Orders', 'code');

  const isExportable = allowedOperations.includes(actionCodes['Employee Performance Export']);

  const redirectToAllReports = () => {
    dispatch(getReportId());
    dispatch(getTypeId());
    dispatch(resetEmployeeReport());
    if (afterReset) afterReset();
  };

  const handleAnswerPrint = (htmlId, fileName) => {
    const div = document.getElementById(htmlId);
    // Create a window object.
    const win = window.open('', '', 'height=700,width=700'); // Open the window. Its a popup window.
    document.title = fileName;
    win.document.write(div.outerHTML); // Write contents in the new window.
    win.document.close();
    dispatch(setInitialValues(false, false, false, false));
  };
  const exportTableToExcel = (tableID, fileTitle = '') => {
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
    dispatch(setInitialValues(false, false, false, false));
  };

  const isData = employeePerformanceReport && employeePerformanceReport.data && employeePerformanceReport.data.length ? employeePerformanceReport.data : false;
  const getMaintenanceCount = (employeeId, type) => {
    let count = 0;
    if (isData && isData.length > 0) {
      const empData = isData.filter((emp) => emp.employee_id.id === employeeId && emp.maintenance_type === type);
      count = empData.length;
    }
    return count;
  };

  const loading = (userInfo && userInfo.loading) || (employeePerformanceReport && employeePerformanceReport.loading);

  let errorText = <div />;
  if ((!loading)
    && (employeePerformanceReport && employeePerformanceReport.err)) {
    errorText = '';
  } else if ((!loading)
  && ((employeePerformanceReport && employeePerformanceReport.err) || (employeePerformanceReport && employeePerformanceReport.data && !employeePerformanceReport.data.length))) {
    errorText = (
      <ErrorContent errorTxt="NO DATA FOUND" />
    );
  } else if ((!loading) && typeId && (!typeId.date || typeId.date === null)) {
    errorText = (
      <ErrorContent errorTxt="PLEASE SELECT START DATE AND END DATE" />
    );
  }

  const selectedReportDate = typeId && typeId.date && typeId.date.length
    ? `${getCompanyTimezoneDate(typeId.date[0], userInfo, 'date')} - ${getCompanyTimezoneDate(typeId.date[1], userInfo, 'date')}` : '';

  const employeeGroup = isData ? groupByMultiple(isData, (obj) => obj.employee_id.id) : false;
  const headings = ['Employee', 'Corrective', 'Preventive', 'On Condition', 'Periodic', 'Predictive'];

  return (
    <>
      <Card className={collapse ? 'filter-margin-right side-filters-list p-1 bg-lightblue h-100' : ' side-filters-list p-1 bg-lightblue h-100'}>
        <CardBody className="p-1 bg-color-white m-0">
          <Row className="p-2">
            <Col md="12" xs="12" sm="12" lg="12">
              <div className="content-inline">
                <span className="p-0 mr-2 font-medium">
                  <>
                    <span onClick={() => redirectToAllReports()} aria-hidden="true" className="cursor-pointer font-weight-800">
                      All Reports
                      {' '}
                      /
                      {' '}
                    </span>
                    <span className="font-weight-500">
                      {reportName}
                      {' '}
                    </span>
                    {selectedReportDate && (
                    <span className={reportName ? 'ml-5 font-weight-800 font-size-13' : 'font-weight-800'}>
                      Report Date :
                      {' '}
                      {selectedReportDate}
                    </span>
                    )}
                  </>
                </span>
                {isExportable && (typeId) && !loading && (isData) && (
                  <>
                    <div className="float-right">
                      <ExportList response={(!loading && isData && isData.length && isData.length > 0)} />
                    </div>
                    <Popover placement="bottom" isOpen={filterInitailValues.download} target="Export">
                      <PopoverHeader>
                        Export
                        <img
                          aria-hidden="true"
                          src={closeCircleIcon}
                          className="cursor-pointer mr-1 mt-1 float-right"
                          onClick={() => dispatch(setInitialValues(false, false, false, false))}
                          alt="close"
                        />
                      </PopoverHeader>
                      <PopoverBody>
                        <Row>
                          <Col md="12" sm="12" lg="6">
                            <div className="p-3 text-center">
                              <FontAwesomeIcon className="fa-3x" size="lg" icon={faFilePdf} />
                              <h5>PDF</h5>
                              <Button
                                type="button"
                                color="dark"
                                className="bg-zodiac"
                                disabled={loading && (employeePerformanceReport && !employeePerformanceReport.data)}
                                onClick={() => handleAnswerPrint('print-employee-report', 'Employee Performance Report')}
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
                                disabled={loading && (employeePerformanceReport && !employeePerformanceReport.data)}
                                onClick={() => exportTableToExcel('export-employee-report', 'Employee Performance Report')}
                              >
                                {(loading) ? (
                                  <Spinner size="sm" color="light" className="mr-2" />
                                ) : (<span />)}
                                {' '}
                                Download
                              </Button>
                            </div>
                          </Col>
                          {employeePerformanceReport && employeePerformanceReport.err && (
                          <Col md="12" sm="12" lg="12" xs="12">
                            <SuccessAndErrorFormat response={employeePerformanceReport} />
                          </Col>
                          )}
                        </Row>
                      </PopoverBody>
                    </Popover>
                  </>
                )}
              </div>
            </Col>
          </Row>
          {(!loading && isData && isData.length && isData.length > 0) && (
            <>
              <div className="p-3 mt-2">
                <div className="mt-3 report-table-list position-relative thin-scrollbar">
                  <div className="table-outer-wrapper">
                    <div className="scrolling-lock-table-wrapper thin-scrollbar">
                      <table className="tbl-search-results tbl-mobile-headers stickey-table" id="tbl_mobile_headers_0">
                        <thead className="bg-gray-light">
                          <tr>
                            {headings && headings.length && headings.length > 0 && headings.map((hd, index) => (
                              <th className="stickyemp-th stickyemp-head" key={index}>
                                <span>{hd}</span>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {employeeGroup && employeeGroup.length && employeeGroup.length > 0 && employeeGroup.map((emp) => (
                            <tr key={emp}>
                              <td className="stickyemp-td"><span className="font-weight-400">{getColumnArrayValueByField(emp, 0, 'employee_id', 'name')}</span></td>
                              <td className="stickyemp-td"><span className="font-weight-400">{getMaintenanceCount(getColumnArrayValueByField(emp, 0, 'employee_id', 'id'), 'bm')}</span></td>
                              <td className="stickyemp-td"><span className="font-weight-400">{getMaintenanceCount(getColumnArrayValueByField(emp, 0, 'employee_id', 'id'), 'pm')}</span></td>
                              <td className="stickyemp-td"><span className="font-weight-400">{getMaintenanceCount(getColumnArrayValueByField(emp, 0, 'employee_id', 'id'), 'oc')}</span></td>
                              <td className="stickyemp-td"><span className="font-weight-400">{getMaintenanceCount(getColumnArrayValueByField(emp, 0, 'employee_id', 'id'), 'pr')}</span></td>
                              <td className="stickyemp-td"><span className="font-weight-400">{getMaintenanceCount(getColumnArrayValueByField(emp, 0, 'employee_id', 'id'), 'pd')}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          <Col md="12" sm="12" lg="12" className="d-none">
            <ChecklistPrint typeId={typeId} employeePerformanceReport={employeePerformanceReport} />
          </Col>
          {loading && (
          <div className="mb-3 mt-3 text-center">
            <Loader />
          </div>
          )}
          {(employeePerformanceReport && employeePerformanceReport.err) && (
          <ErrorContent errorTxt={generateErrorMessage(employeePerformanceReport)} />
          )}
          {errorText}
        </CardBody>
      </Card>
    </>
  );
});

EmployeePerformanceReport.propTypes = {
  collapse: PropTypes.bool,
  afterReset: PropTypes.func.isRequired,
  reportName: PropTypes.string.isRequired,
};
EmployeePerformanceReport.defaultProps = {
  collapse: false,
};

export default EmployeePerformanceReport;
