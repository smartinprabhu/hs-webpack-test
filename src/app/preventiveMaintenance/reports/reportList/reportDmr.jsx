/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/* eslint-disable import/no-unresolved */
/* eslint-disable radix */
import React, { useState, useEffect } from 'react';
import * as PropTypes from 'prop-types';
import {
  Card, CardBody, CardHeader, Col, Row, Table, Tooltip,
  Popover, PopoverHeader, PopoverBody,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';

import fileMiniIcon from '@images/icons/fileMini.svg';
import closeCircleIcon from '@images/icons/closeCircle.svg';
import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';
import DataExport from '../dataExport/dataExport';
import { generateErrorMessage, getListOfModuleOperations } from '../../../util/appUtils';

import {
  getReportId, getLocationId,
} from '../../ppmService';
import actionCodes from '../data/actionCodes.json';

const reportDmr = (props) => {
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
  const {
    reportId, reports, selectedReportDate, locationId, locations,
  } = useSelector((state) => state.ppm);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], '52 Week PPM', 'code');

  const isExportable = allowedOperations.includes(actionCodes['DMR Report Export']);

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
    dispatch(getLocationId());
    if (afterReset) afterReset();
  };

  let reportIndex = 1;
  const loading = (userInfo && userInfo.loading) || (reports && reports.loading);
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (reports && reports.err) ? generateErrorMessage(reports) : userErrorMsg;
  const errorMsgLocation = (locations && locations.err) ? generateErrorMessage(locations) : userErrorMsg;

  return (
    <Card className="reports p-2 mb-2 bg-lightblue h-100">
      <CardBody className="p-1 bg-color-white m-0">
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
                    {' '}
                    /
                    {' '}
                  </span>
                  {locationId && locationId.name ? (
                    <span className="font-weight-400">{locationId.name}</span>
                  ) : ''}
                  <span className={locationId && locationId.name ? 'ml-5 font-weight-800 font-size-13' : 'font-weight-800'}>
                    Report Date :
                    {' '}
                    {selectedReportDate}
                  </span>
                </>
              </span>
            </div>
          </Col>
          {isExportable && reports && reports.data && reports.data.length > 0 && reportId && Array.isArray(reportId) && reportId.length > 0 && (
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
            <Popover placement="bottom" isOpen={isExport} target="Export">
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
        {(locations && locations.err) && (
        <ErrorContent errorTxt={errorMsgLocation} />
        )}
        {reports && reports.data && reports.data.length > 0 && reportId && Array.isArray(reportId) && reportId.length > 0 ? (
          <Row className="pt-2">
            <Col md="12" sm="12" lg="12" xs="12">
              {reportId && Array.isArray(reportId) && reportId.length > 0 && reportId.map((report, index) => (
                <div
                  className="mb-3 border-0"
                  key={report.id}
                >
                  <Card>
                    <CardHeader id={`heading${index}`} className="p-2 bg-sky border-bottom">
                      <span className="collapse-heading font-weight-800">
                        {report.name}
                      </span>
                    </CardHeader>
                    <Row className="m-1">
                      {report && report.newJson && report.newJson.length === 0 && (
                      <div className="text-center">
                        No
                          {' '}
                        {report.name}
                        {' '}
                        found.
                      </div>
                      )}
                      {report && report.newJson && report.newJson.length > 0 && (
                      <Card className="bg-white border-0 h-100">
                        <CardBody className="p-1 m-0">
                          {(report && report.newJson) && (
                          <span data-testid="success-case" />
                          )}
                          {(report && report.newJson && report.headers && report.headers.length > 0) && (
                          <div>
                            <Table responsive>
                              <thead className="bg-gray-light">
                                <tr key={reportIndex++}>
                                  {report.headers.map((header) => (
                                    <th
                                      key={header}
                                        // eslint-disable-next-line no-nested-ternary
                                      className={header === 'S.NO' ? 'min-width-100' : header.length > 15 ? 'min-width-250' : 'min-width-200'}
                                    >
                                      <span aria-hidden="true" className="sort-by cursor-pointer">
                                        {header}
                                      </span>
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {Array.isArray(report.newJson) && report.newJson && report.newJson.length > 0 && report.newJson.map((reportInfo) => (
                                  <tr key={reportIndex++}>
                                    {report.headers.map((header) => (
                                      <td
                                        key={header}
                                        aria-hidden="true"
                                        className="cursor-pointer"
                                        onClick={() => { showExport(false); }}
                                      >
                                        <span className="font-weight-600">{reportInfo[header]}</span>
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </Table>
                          </div>
                          )}
                        </CardBody>
                      </Card>
                      )}
                    </Row>
                  </Card>
                </div>
              ))}
            </Col>
          </Row>
        ) : (
          <>
            {(locations && locations.data && locations.data.length > 0)
              && (((reports && reports.loading) || (reports && reports.err) || (reports && reports.data)) && locationId && locationId.name ? '' : (
                <div className="text-center justify-content-center mt-25p">
                  Please select a report type.
                </div>
              ))}
          </>
        )}
      </CardBody>
    </Card>
  );
};

reportDmr.propTypes = {
  afterReset: PropTypes.func.isRequired,
  reportName: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
};
export default reportDmr;
