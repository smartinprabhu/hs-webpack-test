/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/* eslint-disable import/no-unresolved */
/* eslint-disable radix */
import React, { useState, useEffect } from 'react';
import * as PropTypes from 'prop-types';
import {
  Card, CardBody, Col, Row, Table, Tooltip,
  Popover, PopoverHeader, PopoverBody,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';

import fileMiniIcon from '@images/icons/fileMini.svg';
import closeCircleIcon from '@images/icons/closeCircle.svg';
import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';
import DataExport from '../reports/dataExport/employeeReportExport';
import EmployeeReportPrint from './dataExport/employeeReportPrint';
import {
  generateErrorMessage, getDefaultNoValue, extractNameObject, getCompanyTimezoneDate, getListOfOperations
} from '../../util/appUtils';
import { groupByQuantity } from '../utils/utils';
import { groupByMultiple } from '../../util/staticFunctions';
import {
  getPantryFilters,
} from '../pantryService';
import {
  getReportId,
} from '../../preventiveMaintenance/ppmService';
import actionCodes from '../configuration/data/actionCodes.json';

const EmployeeReport = (props) => {
  const {
    afterReset, reportName,
  } = props;
  const dispatch = useDispatch();
  const [openValues, setOpenValues] = useState([]);
  const [isExport, showExport] = useState(false);

  const toggle = (id) => {
    setOpenValues((state) => [...state, id]);
  };

  const { userInfo, userRoles } = useSelector((state) => state.user);

  const { reports, pantryFilters, selectedReportType } = useSelector((state) => state.pantry);
  const {
    reportId,
  } = useSelector((state) => state.ppm);
  const allowedOperations = getListOfOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'code');

  const isExportable = allowedOperations.includes(actionCodes['Export Reports']);
  const dateFilterList = pantryFilters && pantryFilters.customFilters && pantryFilters.customFilters.filter((item) => item.type === 'datecompare');
  const dateFilter = pantryFilters && pantryFilters.customFilters && pantryFilters.customFilters.find((item) => item.date === true);

  const selectedReportDate = dateFilter && dateFilter.date && dateFilter.start && dateFilter.end
    ? `${getCompanyTimezoneDate(dateFilter.start, userInfo, 'date')} - ${getCompanyTimezoneDate(dateFilter.end, userInfo, 'date')}` : '';

  useEffect(() => {
    if (reports && reports.data) {
      const newReports = [];
      reports.data.map((report) => {
        if ((report && report.json && (report.download_url === '-' || report.download_url === false))) {
          if (!Array.isArray(report.json)) {
            report.newJson = JSON.parse((report.json).replace(/'/g, '"'));
            report.headers = report.newJson && report.newJson.length > 0 ? Object.keys(report.newJson[0]) : [];
            newReports.push(report);
          }
        }
        return newReports;
      });
      dispatch(getReportId(newReports));
    } else {
      dispatch(getReportId());
    }
  }, [reports]);

  const redirectToAllReports = () => {
    dispatch(getReportId());
    dispatch(getPantryFilters());
    if (afterReset) afterReset();
  };

  const loading = (userInfo && userInfo.loading) || (reports && reports.loading);
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (reports && reports.err) ? generateErrorMessage(reports) : userErrorMsg;

  function getOrderLines(employeeId) {
    const orderLines = [];
    // eslint-disable-next-line array-callback-return
    reports.data.map((rp) => {
      if (rp.employee_id && rp.employee_id.id === employeeId && rp.order_lines && rp.order_lines.length > 0) {
        // eslint-disable-next-line array-callback-return
        rp.order_lines.map((ol) => {
          ol.ordered_on = rp.ordered_on;
          ol.pantry_id = rp.pantry_id;
          orderLines.push(ol);
        });
      }
    });
    return orderLines;
  }

  function getRow(orderLines) {
    const tableTr = [];
    const assetData = groupByMultiple(orderLines, (obj) => obj.product_id.id);
    if (assetData && assetData.length > 0) {
      // eslint-disable-next-line array-callback-return
      assetData.map((rp) => {
        tableTr.push(
          <tr key={rp[0].id}>
            <td className="p-2">{getDefaultNoValue(extractNameObject(rp[0].product_id, 'name'))}</td>
            <td className="p-2">{groupByQuantity(orderLines, rp[0].product_id.id, 'ordered_qty')}</td>
            <td className="p-2">{groupByQuantity(orderLines, rp[0].product_id.id, 'delivered_qty')}</td>
            {selectedReportType === 'Detailed'
              ? (
                <>
                  <td className="p-2">{getDefaultNoValue(getCompanyTimezoneDate(rp[0].ordered_on, userInfo, 'datetime'))}</td>
                  <td className="p-2">{getDefaultNoValue(extractNameObject(rp[0].pantry_id, 'name'))}</td>
                </>
              ) : ''}
          </tr>,
        );
      });
    }
    return tableTr;
  }

  let employeeList = [];
  if (reports && reports.data && reports.data.length > 0) {
    employeeList = groupByMultiple(reports.data, (obj) => obj.employee_id.id);
  }

  return (
    <Card className="p-2 mb-2 bg-lightblue h-100">
      <CardBody className="p-1 bg-color-white m-0 side-filters-list thin-scrollbar">
        <Row className="p-2">
          <Col md="11" xs="12" sm="11" lg="11">
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
                  </span>
                  {' '}
                  -
                  {' '}
                  {selectedReportType}
                  {selectedReportDate && (
                    <span className={reportName ? 'ml-5 font-weight-800 font-size-13' : 'font-weight-800'}>
                      Report Date :
                      {' '}
                      {selectedReportDate}
                    </span>
                  )}
                </>
              </span>
            </div>
          </Col>
          {isExportable && reports && reports.data && reports.data.length > 0 && (
            <Col md="1" xs="12" sm="1" lg="1">
              <div className="float-right">
                <img
                  aria-hidden="true"
                  alt="Export"
                  src={fileMiniIcon}
                  id="Export"
                  onClick={() => { showExport(!isExport); }}
                  className="cursor-pointer mr-2"
                  onMouseOver={() => toggle(2)}
                  onMouseLeave={() => setOpenValues([])}
                  onFocus={() => toggle(2)}
                />
                <Tooltip
                  placement="top"
                  isOpen={openValues.some((selectedValue) => selectedValue === 2)}
                  target="Export"
                >
                  Export
                </Tooltip>
              </div>
              <Popover className="export-popover" placement="bottom" isOpen={isExport} target="Export">
                <PopoverHeader>
                  Export
                  <img
                    aria-hidden="true"
                    alt="close"
                    src={closeCircleIcon}
                    onClick={() => showExport(false)}
                    className="cursor-pointer float-right"
                  />
                </PopoverHeader>
                <PopoverBody><DataExport afterReset={() => showExport(false)} /></PopoverBody>
              </Popover>
            </Col>
          )}
        </Row>
        {loading && (
          <div className="mb-3 mt-3 text-center">
            <Loader />
          </div>
        )}
        {(reports && reports.err) && (
          <ErrorContent errorTxt={errorMsg} />
        )}
        {dateFilterList && dateFilterList.length !== 0 && reports && reports.data && reports.data.length > 0 ? (
          <>
            <Row className="pt-2" id='export-employee-pantry-orders'>
              <Col md="12" sm="12" lg="12" xs="12">
                {employeeList && employeeList.length > 0 ? (
                  <>
                    <table align="center" className='d-none'>
                      <tbody>
                        <tr><td style={{ textAlign: 'center' }} colSpan={5}><b>{reportName}{''}-{''}{selectedReportType}</b></td></tr>
                        <tr>
                          <td>Company</td>
                          <td colSpan={15}><b>{userInfo && userInfo.data ? userInfo.data.company.name : 'Company'}</b></td>
                        </tr>
                        <tr>
                          <td>{selectedReportDate && (<span> Report Date :</span>)}</td>
                          <td colSpan={15}><b>{selectedReportDate}</b></td>
                        </tr>
                      </tbody>
                    </table>
                    <br />
                    {employeeList.map((rp) => (
                      <div className="mt-2">
                        <h5 className="pl-2">{rp[0].employee_id.name}</h5>
                        <div className="notification-header thin-scrollbar">
                          <Table responsive className="mb-0 mt-2 font-weight-400 border-0 assets-table" width="100%">
                            <thead>
                              <tr>
                                <th className="p-2 min-width-160">
                                  Product
                                </th>
                                <th className="p-2 min-width-160">
                                  Ordered
                                </th>
                                <th className="p-2 min-width-160">
                                  Delivered
                                </th>
                                {selectedReportType === 'Detailed'
                                  ? (
                                    <>
                                      <th className="p-2 min-width-160">
                                        Ordered On
                                      </th>
                                      <th className="p-2 min-width-160">
                                        Pantry
                                      </th>
                                    </>
                                  ) : ''}
                              </tr>
                            </thead>
                            <tbody>
                              {getRow(getOrderLines(rp[0].employee_id.id))}
                            </tbody>
                          </Table>
                          <hr className="m-0" />
                        </div>
                      </div>
                    ))}
                  </>
                ) : ''}
              </Col>
            </Row>
            <div className="d-none">
              <EmployeeReportPrint reportName={reportName} selectedReportDate={selectedReportDate} getOrderLines={getOrderLines} getRow={getRow} />
            </div>
          </>
        ) : (
          <>
            {reports && !reports.loading && dateFilterList && dateFilterList.length === 0 && (
              <div className="text-center justify-content-center mt-25p">
                Please select Start date and End date.
              </div>
            )}
            {reports && !reports.loading && reports && reports.data && reports.data.length === 0 && dateFilterList && dateFilterList.length !== 0 && (
              <div className="text-center justify-content-center mt-25p">
                No Records Found
              </div>
            )}
          </>
        )}
      </CardBody>
    </Card>
  );
};

EmployeeReport.propTypes = {
  afterReset: PropTypes.func.isRequired,
  reportName: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
};
export default EmployeeReport;
