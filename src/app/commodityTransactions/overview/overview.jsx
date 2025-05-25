import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Col,
  Row,
} from 'reactstrap';
import { Spin } from 'antd';

import './overview.scss';
import Notifications from '../../dashboard/alerts';
import Insights from './insights';
import TransactionByCommodity from './transactionByCommodity';
import TransactionByVendor from './transactionByVendor';
import Navbar from '../navbar/navbar';

import { getNinjaCode, resetNinjaCode } from '../../analytics/analytics.service';
// import DashboardView from '../../nocDashboards/assetsDashboard/dashboardView';
import dashboardCodes from '../../data/dashboardCodes.json';

const appModels = require('../../util/appModels').default;

const Overview = () => {
  const subMenu = 'Insights';
  const dispatch = useDispatch();
  const [isShow, setIsShow] = useState(false);

  const { ninjaDashboardCode } = useSelector((state) => state.analytics);

  const code = dashboardCodes && dashboardCodes.codes && dashboardCodes.codes.Commodity ? dashboardCodes.codes.Commodity : '';

  useEffect(() => {
    dispatch(resetNinjaCode());
    dispatch(getNinjaCode(code, appModels.NINJABOARD));
    setIsShow(true);
  }, []);

  const isOldDashboard = (ninjaDashboardCode && ninjaDashboardCode.err) || (ninjaDashboardCode && ninjaDashboardCode.data && ninjaDashboardCode.data.length === 0);

  return (
    <Row className={`ml-1 mr-1 mt-2 mb-2 p-2 border ${isOldDashboard ? 'commodity-trans-mainCard' : 'bg-med-blue-dashboard'}`}>
      <Col sm="12" md="12" lg="12" xs="12">
        <Row className="p-1">
          <Col sm="12" md={isOldDashboard ? 8 : 12} lg={isOldDashboard ? 8 : 12} xs="12" className={`p-0 ${isOldDashboard ? 'tanker-overview' : ''}`}>
           
            {(!isShow || (ninjaDashboardCode && ninjaDashboardCode.loading)) && (
              <div className="text-center mt-2 mb-2">
                <Spin />
              </div>
            )}
            {isOldDashboard && (
              <>
                <Insights />
                <Row className="m-0 p-3">
                  <Col sm="12" md="12" lg="6" xs="12" className="p-0 transaction-card">
                    <TransactionByCommodity />
                  </Col>
                  <Col sm="12" md="12" lg="6" xs="12" className="p-0 vendor-card">
                    <TransactionByVendor />
                  </Col>
                </Row>
              </>
            )}
          </Col>
          {isOldDashboard && (
            <Col sm="12" md="12" lg="4" className="p-0  commodity-alarms-card">
              <Row className="pb-1 pt-2">
                <Col sm="12" md="12" lg="12">
                  <Notifications modelName={appModels.TANKERTRANSACTIONS} />
                </Col>
              </Row>
            </Col>
          )}
        </Row>
      </Col>
    </Row>
  );
};
export default Overview;
