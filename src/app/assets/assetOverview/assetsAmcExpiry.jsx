/* eslint-disable react/no-array-index-key */
/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Row,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';

import clockBlueIcon from '@images/icons/clockAlertBlue.svg';
import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import { getExpiryAssets } from '../equipmentService';
import './assetOverview.scss';
import { getDifferenceInDays } from '../../util/staticFunctions';
import {
  getFirstDayofMonth, getLastDayofMonth, generateErrorMessage, getDateFormat,
  generateArrayFromValue, getAllCompanies,
} from '../../util/appUtils';

const appModels = require('../../util/appModels').default;

const AssetsExpiry = () => {
  const dispatch = useDispatch();
  const { userInfo ,userRoles} = useSelector((state) => state.user);
  const { assetDashboard } = useSelector((state) => state.equipment);
  const start = getFirstDayofMonth();
  const end = getLastDayofMonth();
  const [datasets, setDatasets] = useState([]);

  const isUserError = userInfo && userInfo.err;
  const isUserLoading = userInfo && userInfo.loading;
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (assetDashboard && assetDashboard.err) ? generateErrorMessage(assetDashboard) : userErrorMsg;
  const expiryData = generateArrayFromValue(assetDashboard && assetDashboard.data ? assetDashboard.data : [], 'code', 'AMED90');

  useEffect(() => {
    if (expiryData && expiryData.length) {
      const data = expiryData && expiryData.length && expiryData[0] && expiryData[0].datasets;
      setDatasets(data);
    }
  }, [assetDashboard]);

  return (
    <Card className="p-2 border-left-0 border-top-0 border-bottom-0">
      <CardTitle className="mb-1">
        <h6>
          <img src={clockBlueIcon} className="mr-2" alt="assets expiry" height="20" width="20" />
          UPCOMING AMC EXPIRY DATES IN 90 DAYS
        </h6>
      </CardTitle>
      <CardBody className="pt-0 asset-warranty thin-scrollbar">
        {assetDashboard && !assetDashboard.loading && (
        <Row className="border-bottom-silver-foil-2px p-1 asset-warranty-header-sticky">
          <Col lg="6" xs="6" sm="6" md="6" className="p-0 text-left">
            <span className="font-weight-800 font-side-heading">ASSETS</span>
          </Col>
          <Col lg="6" xs="6" sm="6" md="6" className="p-0 text-right">
            <span className="font-weight-800 font-side-heading">EXPIRY DATE</span>
          </Col>
        </Row>
        )}
        {((assetDashboard && assetDashboard.loading) || isUserLoading) && (
          <div className="mb-4 mt-2">
            <Loader />
          </div>
        )}
        {((assetDashboard && assetDashboard.err) || isUserError) && (
          <ErrorContent errorTxt={errorMsg.includes('No data') ? 'No text' : errorMsg} />
        )}
        {datasets && datasets.length === 0 && (assetDashboard && !assetDashboard.loading) && (
          <ErrorContent errorTxt="No text" />
        )}
        {assetDashboard && assetDashboard.data && datasets && datasets.length ? datasets.map((actions, index) => (
          <Row className="border-bottom p-2" key={index}>
            <Col lg="6" xs="6" sm="6" md="6" className="p-0 text-left">
              <span
                aria-hidden
                id={`${'Popover-'}${actions.data[1]}`}
                className={getDifferenceInDays(actions.data[4]) < 10
                  ? 'font-weight-800 bg-lavender-blush color-torch-red p-1 outline-none'
                  : 'font-weight-800 bg-alice-blue p-1 outline-none'}
                tabIndex={index}
              >
                {actions.data[0]}
              </span>
            </Col>
            <Col
              lg="6"
              xs="6"
              sm="6"
              md="6"
              className={getDifferenceInDays(actions.data[3]) < 10 ? 'bg-lavender-blush color-torch-red p-0 text-right' : 'p-0 text-right bg-alice-blue'}
            >
              <span className="font-weight-800 p-1 font-tiny float-left ml-2">
                {getDateFormat(actions.data[3])}
              </span>
              {' '}
              <span className="font-weight-400 font-tiny"> | </span>
              <small className="p-1 font-tiny font-weight-400">
                {' '}
                {getDifferenceInDays(actions.data[3])}
                {' '}
                days Left
              </small>
            </Col>
          </Row>
        )) : ''}
      </CardBody>
    </Card>
  );
};

export default AssetsExpiry;
