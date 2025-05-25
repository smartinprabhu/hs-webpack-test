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
import { getExpiryAssets } from '../../assets/equipmentService';
import './complianceOverview.scss';
import {
  getFirstDayofMonth, getLastDayofMonth, generateErrorMessage,
  generateArrayFromValue, getAllowedCompanies,
} from '../../util/appUtils';

const appModels = require('../../util/appModels').default;

const ComplianceExpiry = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  const { complianceDashboard } = useSelector((state) => state.compliance);
  const start = getFirstDayofMonth();
  const end = getLastDayofMonth();
  const [datasets, setDatasets] = useState([]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const companies = getAllowedCompanies(userInfo);
      dispatch(getExpiryAssets(start, end, companies, appModels.BULIDINGCOMPLIANCE));
    }
  }, [userInfo, start, end]);

  const isUserError = userInfo && userInfo.err;
  const isUserLoading = userInfo && userInfo.loading;
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (complianceDashboard && complianceDashboard.err) ? generateErrorMessage(complianceDashboard) : userErrorMsg;
  const expiryData = generateArrayFromValue(complianceDashboard && complianceDashboard.data ? complianceDashboard.data : [], 'code', 'UR');

  useEffect(() => {
    if (expiryData && expiryData.length) {
      const data = expiryData && expiryData.length && expiryData[0] && expiryData[0].datasets;
      setDatasets(data);
    }
  }, [complianceDashboard]);

  return (
    <Card className="p-2 border-0 h-100">
      <CardTitle className="mb-1">
        <h6>
          <img src={clockBlueIcon} className="mr-2" alt="assets expiry" height="20" width="20" />
          UPCOMING RENEWAL IN NEXT 120 DAYS
        </h6>
      </CardTitle>
      <CardBody className="pt-0 asset-warranty thin-scrollbar">
        <Row className="border-bottom-silver-foil-2px p-1 asset-warranty-header-sticky">
          <Col lg="7" xs="6" sm="6" md="6" className="p-0 text-left">
            <span className="font-weight-800 font-side-heading">COMPLIANCE SOON TO EXPIRE</span>
          </Col>
          <Col lg="5" xs="6" sm="6" md="6" className="p-0 text-center">
            <span className="font-weight-800 font-side-heading">RENEWAL DUE DAYS</span>
          </Col>
        </Row>
        {((complianceDashboard && complianceDashboard.loading) || isUserLoading) && (
          <div className="mb-4 mt-2">
            <Loader />
          </div>
        )}
        {((complianceDashboard && complianceDashboard.err) || isUserError) && (
          <ErrorContent errorTxt={errorMsg.includes('No data') ? 'No text' : errorMsg} />
        )}
        {datasets && datasets.length === 0 && (complianceDashboard && !complianceDashboard.loading) && (
          <ErrorContent errorTxt="No text" />
        )}
        {complianceDashboard && complianceDashboard.data && datasets && datasets.length ? datasets.map((actions, index) => (
          actions.data[1] && actions.data[1] <= 120 && (
          <Row className="border-bottom p-2" key={index}>
            <Col lg="7" xs="7" sm="7" md="7" className="p-0 text-left">
              <span
                role="button"
                aria-hidden="true"
                id={`${'Popover-'}${actions.data[1]}`}
                className={actions.data[1] < 10
                  ? 'font-weight-800 bg-lavender-blush color-torch-red p-1 outline-none'
                  : 'font-weight-800 bg-alice-blue p-1 outline-none'}
                tabIndex={index}
              >
                {actions.data[0]}
              </span>
            </Col>
            <Col
              lg="5"
              xs="5"
              sm="5"
              md="5"
              className="text-center"
            >
              <span className={actions.data[1] < 10 ? 'bg-lavender-blush color-torch-red p-0 text-center' : 'p-0 text-center bg-alice-blue'}>
                <small className="p-3 font-tiny font-weight-400">
                  {' '}
                  {actions.data[1]}
                  {' '}
                  days Left
                </small>
              </span>
            </Col>
          </Row>
          )
        )) : ''}
      </CardBody>
    </Card>
  );
};

export default ComplianceExpiry;
