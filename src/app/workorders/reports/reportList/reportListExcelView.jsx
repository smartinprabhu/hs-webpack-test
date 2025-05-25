/* eslint-disable import/no-unresolved */
/* eslint-disable radix */
import React, { useState, useEffect } from 'react';
import {
  Button, Card, CardBody, Col, Row, Tooltip,
  Popover, PopoverHeader, PopoverBody, Spinner,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileExcel,
} from '@fortawesome/free-solid-svg-icons';

import fileMiniIcon from '@images/icons/fileMini.svg';
import closeCircleIcon from '@images/icons/closeCircle.svg';
import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';
import { generateErrorMessage, getListOfModuleOperations } from '../../../util/appUtils';

import {
  getReportId, getLocationId,
} from '../../../preventiveMaintenance/ppmService';
import actionCodes from '../data/actionCodes.json';

const reportListExcelView = (props) => {
  const {
    afterReset, reportName, collapse,
  } = props;
  const dispatch = useDispatch();
  const officeViewerApiLink = 'https://view.officeapps.live.com/op/embed.aspx';
  const [openValues, setOpenValues] = useState([]);
  const [isExport, showExport] = useState(false);
  const [filePath, setFilePath] = useState(false);

  const toggle = (id) => {
    setOpenValues((state) => [...state, id]);
  };

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const {
    slaEvalutionReport,
  } = useSelector((state) => state.workorder);
  const {
    selectedReportDate,
  } = useSelector((state) => state.ppm);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Work Orders', 'code');

  const isExportable = allowedOperations.includes(actionCodes['SLA Audit Report Export']);

  const redirectToAllReports = () => {
    dispatch(getReportId());
    dispatch(getLocationId());
    if (afterReset) afterReset();
  };

  useEffect(() => {
    if (slaEvalutionReport && slaEvalutionReport.data && slaEvalutionReport.data.length > 0 && slaEvalutionReport.data[0].download_link) {
      const Url = slaEvalutionReport.data[0].download_link.length > 0 && slaEvalutionReport.data[0].download_link[0].url;
      const apiUrl = window.localStorage.getItem('api-url');
      const filepath = `${apiUrl}/${Url}`;
      setFilePath(filepath);
    } else {
      setFilePath(false);
    }
  }, [slaEvalutionReport]);

  const loading = (userInfo && userInfo.loading) || (slaEvalutionReport && slaEvalutionReport.loading);
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (slaEvalutionReport && slaEvalutionReport.err) ? generateErrorMessage(slaEvalutionReport) : userErrorMsg;

  return (
    <Card className={collapse ? 'filter-margin-right side-filters-list p-1 bg-lightblue h-100' : 'side-filters-list p-1 bg-lightblue h-100'}>
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
                  </span>
                  <span className={reportName ? 'ml-5 font-weight-800 font-size-13' : 'font-weight-800'}>
                    Report Date :
                    {' '}
                    {selectedReportDate}
                  </span>
                </>
              </span>
            </div>
          </Col>
          {isExportable && !loading && !errorMsg && filePath && (
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
              <PopoverBody>
                <Row>
                  <Col md="12" sm="12" lg="12">
                    <div className="p-3 text-center">
                      <FontAwesomeIcon className="fa-3x" size="lg" icon={faFileExcel} />
                      <h5>Excel</h5>
                      <a href={filePath} rel="noreferrer">
                        <Button
                          type="button"
                          color="dark"
                          className="bg-zodiac"
                          disabled={slaEvalutionReport && slaEvalutionReport.loading}
                        >
                          {(slaEvalutionReport && slaEvalutionReport.loading) ? (
                            <Spinner size="sm" color="light" className="mr-2" />
                          ) : (<span />)}
                          {' '}
                          Download
                        </Button>
                      </a>
                    </div>
                  </Col>
                </Row>
              </PopoverBody>
            </Popover>
          </Col>
          )}
        </Row>
        {!loading && !errorMsg && filePath && (
          <Row className="p-2">
            <Col md="12" xs="12" sm="12" lg="12">
              <iframe src={`${officeViewerApiLink}?src=${filePath}`} width="100%" title={reportName} height="565px" frameBorder="0"> </iframe>
            </Col>
          </Row>
        )}
        {loading && (
        <div className="mb-3 mt-3 text-center">
          <Loader />
        </div>
        )}
        {(slaEvalutionReport && slaEvalutionReport.err) && (
        <ErrorContent errorTxt={errorMsg} />
        )}
      </CardBody>
    </Card>
  );
};

reportListExcelView.propTypes = {
  collapse: PropTypes.bool,
};
reportListExcelView.defaultProps = {
  collapse: false,
};

export default reportListExcelView;
