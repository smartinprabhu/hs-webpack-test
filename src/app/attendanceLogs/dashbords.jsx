/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Col,
  Row,
} from 'reactstrap';
import { Spin } from 'antd';

import ErrorContent from '@shared/errorContent';

import Navbar from './navbar/navBar';

import {
  generateErrorMessage,
} from '../util/appUtils';

import { getNinjaCode, resetNinjaCode } from '../analytics/analytics.service';
// import DashboardView from '../nocDashboards/assetsDashboard/dashboardView';
import dashboardCodes from '../data/dashboardCodes.json';

const appModels = require('../util/appModels').default;

const Overview = () => {
  const subMenu = 'Insights';
  const dispatch = useDispatch();

  const [isShow, setIsShow] = useState(false);

  const { ninjaDashboardCode } = useSelector((state) => state.analytics);


  const code = dashboardCodes && dashboardCodes.codes && dashboardCodes.codes.Attendance ? dashboardCodes.codes.Attendance : '';

  useEffect(() => {
    dispatch(resetNinjaCode());
    dispatch(getNinjaCode(code, appModels.NINJABOARD));
    setIsShow(true);
  }, []);

  return (
    <Row className="ml-1 mr-1 mt-2 mb-2 p-2 border bg-med-blue-dashboard">
      { /* <Row>
      <Col sm="12" md="12" lg="12" xs="12">
        <div dangerouslySetInnerHTML={{ __html: "<iframe src='https://optimus-v2.smartclean.io/optimus/data/project/552786a71c47482b8e7b0f6b337aa5e4?org=HELIX' width='100%' height='800px' />" }} />
      </Col>
    </Row>
  */ }
      <Col sm="12" md="12" lg="12" xs="12">
        <Row className="p-1">
          <Col sm="12" md="12" lg="12" xs="12" className="p-0">
            
            {(!isShow || (ninjaDashboardCode && ninjaDashboardCode.loading)) && (
            <div className="text-center mt-2 mb-2">
              <Spin />
            </div>
            )}
            {ninjaDashboardCode && ninjaDashboardCode.err && (
            <ErrorContent errorTxt={generateErrorMessage(ninjaDashboardCode)} />
            )}
            {ninjaDashboardCode && ninjaDashboardCode.data && ninjaDashboardCode.data.length === 0 && (
            <ErrorContent errorTxt="No Data Found." />
            )}
          </Col>
        </Row>
      </Col>
    </Row>
  );
};
export default Overview;
