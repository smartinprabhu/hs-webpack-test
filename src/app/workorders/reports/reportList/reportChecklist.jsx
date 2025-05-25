/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/* eslint-disable import/no-unresolved */
/* eslint-disable radix */
import React from 'react';
import {
  Card, CardBody, Col, Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileExcel,
  faFilePdf,
} from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from 'antd';

import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';
import {
  generateErrorMessage, getDefaultNoValue, getCompanyTimezoneDate,
  getListOfModuleOperations,
} from '../../../util/appUtils';
import { resetPurchaseState, resetPrint } from '../../../purchase/purchaseService';
import {
  getReportId, getTypeId, resetDetailChecklistReport, resetChecklistReport, resetCreateChecklistReport,
} from '../../../preventiveMaintenance/ppmService';
import ChecklistPrint from '../../../preventiveMaintenance/reports/reportList/checklistPrint';
import './sidebar/stickyTable.css';
import actionCodes from '../data/actionCodes.json';

const ReportChecklist = React.memo((props) => {
  const {
    afterReset, reportName, collapse,
  } = props;
  const dispatch = useDispatch();

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const {
    typeId,
    preventiveChecklistOrders,
  } = useSelector((state) => state.ppm);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Work Orders', 'code');

  const isExportable = allowedOperations.includes(actionCodes['Inspection Checklist Report Export']);

  const redirectToAllReports = () => {
    dispatch(getReportId());
    dispatch(getTypeId());
    dispatch(resetCreateChecklistReport());
    dispatch(resetPurchaseState());
    dispatch(resetDetailChecklistReport());
    dispatch(resetChecklistReport());
    dispatch(resetPrint());
    if (afterReset) afterReset();
  };

  const handleAnswerPrint = (htmlId, fileName) => {
    const div = document.getElementById(htmlId);
    // Create a window object.
    const win = window.open('', '', 'height=700,width=700'); // Open the window. Its a popup window.
    document.title = fileName;
    win.document.write(div.outerHTML); // Write contents in the new window.
    win.document.close();
    /* setTimeout(() => {
      const r = win.confirm('Do you want to print this document ?');
      if (r === true) {
        win.print();
      }
    }, 1500); */
    // win.print(); // Finally, print the contents.
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
  };

  const loading = (userInfo && userInfo.loading) || (preventiveChecklistOrders && preventiveChecklistOrders.loading);

  let errorText = <div />;
  if ((!loading)
    && ((preventiveChecklistOrders && preventiveChecklistOrders.err) || (preventiveChecklistOrders && preventiveChecklistOrders.data && !preventiveChecklistOrders.data.length))) {
    errorText = '';
  } else if (!loading && typeId && (!typeId.scheduleValue || !typeId.scheduleValue.length)) {
    errorText = (
      <ErrorContent errorTxt="PLEASE SELECT SCHEDULE" />
    );
  } else if (!loading && typeId && (!typeId.date || typeId.date === null)) {
    errorText = (
      <ErrorContent errorTxt="PLEASE SELECT START DATE AND END DATE" />
    );
  } else if (!loading && typeId && (!typeId.spaceValue || !typeId.spaceValue.length) && (!typeId.equipValue || !typeId.equipValue.length)) {
    errorText = (
      <ErrorContent errorTxt="PLEASE SELECT SPACE OR EQUIPMENT" />
    );
  }

  const selectedReportDate = typeId && typeId.date && typeId.date.length
    ? `${getCompanyTimezoneDate(typeId.date[0], userInfo, 'date')} - ${getCompanyTimezoneDate(typeId.date[1], userInfo, 'date')}` : '';

  const isData = preventiveChecklistOrders && preventiveChecklistOrders.data && preventiveChecklistOrders.data.data && preventiveChecklistOrders.data.data.length
    ? preventiveChecklistOrders.data.data : false;
  const isError = preventiveChecklistOrders && preventiveChecklistOrders.data ? !preventiveChecklistOrders.data.status : false;

  return (
    <>
      <Card className={collapse ? 'filter-margin-right reports p-1 bg-lightblue h-100' : 'reports p-1 bg-lightblue h-100'}>
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
                {isExportable && (typeId && ((typeId.spaceValue && typeId.spaceValue.length > 0) || (typeId.equipValue && typeId.equipValue.length > 0))) && !loading && (isData) && (
                  <>
                    <Tooltip title="Print PDF Report" placement="top">
                      <FontAwesomeIcon
                        onClick={() => handleAnswerPrint('print-checklist-report', 'Checklist Report')}
                        className="float-right cursor-pointer"
                        color="primary"
                        size="lg"
                        icon={faFilePdf}
                      />
                    </Tooltip>
                    <Tooltip title="Export Excel Report" placement="top">
                      <FontAwesomeIcon
                        onClick={() => exportTableToExcel('export-checklist-report', 'Checklist Report')}
                        className="ml-2 mr-2 float-right cursor-pointer"
                        color="primary"
                        size="lg"
                        icon={faFileExcel}
                      />
                    </Tooltip>
                  </>
                )}
              </div>
            </Col>
          </Row>
          {(typeId && ((typeId.spaceValue && typeId.spaceValue.length > 0) || (typeId.equipValue && typeId.equipValue.length > 0))) && !loading && (isData) && isData.map((md) => (
            <>
              <div className="p-3 mt-2">
                <Row>
                  <Col md="1" xs="12" sm="12" lg="1" />
                  <Col md="5" xs="12" sm="12" lg="5">
                    <span className="font-weight-800 mr-1">Asset Name :</span>
                    <span className="font-weight-500">{md[0].asset_name}</span>
                  </Col>
                  <Col md="5" xs="12" sm="12" lg="5">
                    <span className="font-weight-800 mr-1">Asset ID :</span>
                    <span className="font-weight-500">{md[0].asset_id}</span>
                  </Col>
                  <Col md="1" xs="12" sm="12" lg="1" />
                  <Col md="1" xs="12" sm="12" lg="1" />
                  <Col md="5" xs="12" sm="12" lg="5">
                    <span className="font-weight-800 mr-1">Location :</span>
                    <span className="font-weight-500">{md[0].asset_category}</span>
                  </Col>
                  <Col md="5" xs="12" sm="12" lg="5">
                    <span className="font-weight-800 mr-1">Scheduled Period :</span>
                    <span className="font-weight-500">{md[0].time_period}</span>
                  </Col>
                  <Col md="1" xs="12" sm="12" lg="1" />
                  <Col md="1" xs="12" sm="12" lg="1" />
                  <Col md="5" xs="12" sm="12" lg="5">
                    <span className="font-weight-800 mr-1">Scheduler :</span>
                    <span className="font-weight-500">{md[0].task_id && md[0].task_id.name ? md[0].task_id.name : ''}</span>
                  </Col>
                </Row>
                <div className="mt-3 report-table-list position-relative thin-scrollbar">
                  <div className="table-outer-wrapper">
                    <div className="scrolling-lock-table-wrapper thin-scrollbar">
                      <table className="tbl-search-results tbl-mobile-headers stickey-table" id="tbl_mobile_headers_0">
                        <thead className="bg-gray-light">
                          <tr>
                            {md[0].headers && md[0].headers.map((hd, index) => (
                              <th className="sticky-th sticky-head" key={index}>
                                {index <= 2 ? (
                                  <span>{hd}</span>
                                )
                                  : (
                                    <span>{getCompanyTimezoneDate(hd, userInfo, 'datetime')}</span>
                                  )}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {md[0].question_lists && md[0].question_lists.map((ql, index) => (
                            <tr key={ql}>
                              <td className="sticky-td"><span className="font-weight-400">{index + 1}</span></td>
                              <Tooltip title={getDefaultNoValue(ql.qestion)} placement="top">
                                <td className="sticky-td"><span className="font-weight-400">{getDefaultNoValue(ql.qestion)}</span></td>
                              </Tooltip>
                              <td className="sticky-td"><span className="font-weight-400">{getDefaultNoValue(ql.expected)}</span></td>
                              {ql.day_list && ql.day_list.map((dl) => (
                                <td className="sticky-td min-width-160" key={Math.random()}><span className="font-weight-400">{getDefaultNoValue(dl)}</span></td>
                              ))}
                            </tr>
                          ))}
                          <tr>
                            <td className="sticky-td">-</td>
                            <td className="sticky-td">-</td>
                            <td className="sticky-td">Done By</td>
                            {md[0].done_by_list && md[0].done_by_list.map((dby) => (
                              <>
                                <td className="sticky-td min-width-160" key={Math.random()}><span className="font-weight-400">{getDefaultNoValue(dby.done_by)}</span></td>
                              </>
                            ))}
                          </tr>
                          <tr>
                            <td className="sticky-td">-</td>
                            <td className="sticky-td">-</td>
                            <td className="sticky-td">Reviewed By</td>
                            {md[0].done_by_list && md[0].done_by_list.map((dby) => (
                              <>
                                <td className="sticky-td min-width-160" key={Math.random()}><span className="font-weight-400">{getDefaultNoValue(dby.reviewed_by)}</span></td>
                              </>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <hr className="m-0 border-color-grey" />
            </>
          ))}
          <Col md="12" sm="12" lg="12" className="d-none">
            <ChecklistPrint typeId={typeId} inspectionOrders={preventiveChecklistOrders} />
          </Col>
          {loading && (
          <div className="mb-3 mt-3 text-center">
            <Loader />
          </div>
          )}
          {(preventiveChecklistOrders && preventiveChecklistOrders.err) && (
          <ErrorContent errorTxt={generateErrorMessage(preventiveChecklistOrders)} />
          )}
          {(isError) && (
          <ErrorContent errorTxt="No Data Found" />
          )}
          {errorText}
        </CardBody>
      </Card>
    </>
  );
});

ReportChecklist.propTypes = {
  collapse: PropTypes.bool,
  afterReset: PropTypes.func.isRequired,
  reportName: PropTypes.string.isRequired,
};
ReportChecklist.defaultProps = {
  collapse: false,
};

export default ReportChecklist;
