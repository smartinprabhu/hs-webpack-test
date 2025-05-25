/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/* eslint-disable import/no-unresolved */
/* eslint-disable radix */
import React, { useState, useEffect } from 'react';
import {
  Card, CardBody, Col, Row
  ,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@mui/material';

import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';
import { generateErrorMessage, getListOfModuleOperations } from '../../../util/appUtils';

import {
  getReportId, getLocationId, getTypeId, resetPPMReport,
} from '../../ppmService';
import actionCodes from '../data/actionCodes.json';
import actionCodes2 from '../../../workorders/reports/data/actionCodes.json';

const reportListExcelView = (props) => {
  const {
    afterReset, reportName, collapse, moduleName, setCustomDownload
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
    ppmReports, selectedReportDate, typeId,
  } = useSelector((state) => state.ppm);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], '52 Week PPM', 'code');

  const allowedOperations1 = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Inspection Schedule', 'code');

  const allowedOperations2 = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Work Orders', 'code');

  const isPPMExportable = allowedOperations.includes(actionCodes['PPM Report Export']);

  const isInspecExportable = allowedOperations1.includes(actionCodes['Smart Logger Report Export']);

  const isWoExportable = allowedOperations2.includes(actionCodes2['Smart Logger Report Export']);

  const redirectToAllReports = () => {
    dispatch(getReportId());
    dispatch(getLocationId());
    dispatch(getTypeId());
    dispatch(resetPPMReport());
    if (afterReset) afterReset();
  };

  useEffect(() => {
    if (ppmReports && ppmReports.data && ppmReports.data.length > 0 && ppmReports.data[0].download_link) {
      const Url = ppmReports.data[0].download_link.length > 0 && ppmReports.data[0].download_link[0].url;
      const apiUrl = window.localStorage.getItem('api-url');
      const filepath = `${apiUrl}${Url}`;
      setFilePath(filepath);
      setCustomDownload(
        <a href={filepath} rel="noreferrer">
          <Button
            type="button"
            variant="contained"
            disabled={loading && ppmReports && ppmReports.loading}
            className="header-export-btn"
            onClick={() => setExportType(false)}
          >
            Download
          </Button>
        </a>
      )
    } else {
      setFilePath(false);
      setCustomDownload('')
    }
  }, [ppmReports]);

  const loading = (userInfo && userInfo.loading) || (ppmReports && ppmReports.loading);

  let errorText = <div />;
  if ((!loading)
    && (ppmReports && ppmReports.err)) {
    if (generateErrorMessage(ppmReports) === 'start_date is required.') {
      errorText = <ErrorContent errorTxt="PLEASE SELECT START DATE AND END DATE" />;
    } else {
      errorText = '';
    }
  } else if (!loading
    && ((ppmReports && ppmReports.err) || (ppmReports && ppmReports.data && !ppmReports.data.length))) {
    errorText = (
      <ErrorContent errorTxt="NO DATA FOUND" />
    );
  } else if (!loading && typeId && (typeId.locationId && typeId.locationId.length <= 0)) {
    errorText = (
      <ErrorContent errorTxt="PLEASE SELECT SPACE" />
    );
  } else if (!loading && typeId && (typeId.categoryId && typeId.categoryId.length <= 0)) {
    errorText = (
      <ErrorContent errorTxt="PLEASE SELECT CATEGORY" />
    );
  }

  return (
    <Card className={'border-0 p-1 bg-lightblue h-100'}>
      <CardBody className="p-1 bg-color-white m-0">
        <Row className="p-2">
          {selectedReportDate && (
            <span className={'ml-3 pl-1 font-weight-800 font-size-13'}>
              Report Date :
              {' '}
              {selectedReportDate}
            </span>
          )}
        </Row>
        {(!loading) && filePath && (
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
        {(ppmReports && ppmReports.err && errorText === '') && (
          <ErrorContent errorTxt={generateErrorMessage(ppmReports)} />
        )}
        {errorText}
      </CardBody>
    </Card>
  );
};

reportListExcelView.propTypes = {
  collapse: PropTypes.bool,
  moduleName: PropTypes.string.isRequired,
};
reportListExcelView.defaultProps = {
  collapse: false,
};

export default reportListExcelView;
