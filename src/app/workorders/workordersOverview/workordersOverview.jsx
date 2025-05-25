/* eslint-disable import/no-cycle */
import React, { useState } from 'react';
import {
  Col,
  Row,
} from 'reactstrap';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

import './workordersOverview.scss';
// import Alerts from './alerts';
import Notifications from '../../dashboard/alerts';
import Insights from './insights';
import IssueCategory from './issueCategory';
import ServiceResponse from './serviceResponse';
import '../../apexDashboards/assetsDashboard/style.css';
//import SharedDashboard from '../../shared/sharedDashboard';
import {
  getMenuItems,
} from '../../util/appUtils';

const appModels = require('../../util/appModels').default;

const WorkordersOverview = () => {
  const [isOldDashboard, setOldDashboard] = useState(false)
  const { userRoles } = useSelector((state) => state.user);
  const { workorderDashboard } = useSelector((state) => state.workorder);

  const subMenu = 'Insights';
  const module = "Work Orders"
  const menuList = getMenuItems(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], module, 'name');
  const menuData = menuList.filter((item) => item === subMenu);
  const isMenu = !!(menuData && menuData.length);
  const isCodeData = workorderDashboard && workorderDashboard.data ? workorderDashboard.data.filter((item) => item.code === 'ASRR') : false;
  const isCodeExists = !!(isCodeData && isCodeData.length);

  if (!isMenu) {
    return (<Redirect to="/maintenance/workorders" />);
  }

  return (
    <Row className={`ml-1 mr-1 mt-2 mb-2 p-2 border ${isOldDashboard ? 'workorders-overview' : 'bg-med-blue-dashboard'}`}>
      <Col sm="12" md="12" lg="12" xs="12">
        <Row className={`p-1 ${isOldDashboard ? 'workorderinsights-maincard' : ''}`}>
          <Col sm="12" md={isOldDashboard ? 8 : 12} lg={isOldDashboard ? 8 : 12} xs="12" className={`p-0 ${isOldDashboard ? 'workorders-card' : ''}`}>
            {/* <SharedDashboard
              moduleName={module}
              menuName={subMenu}
              setOldDashboard={setOldDashboard}
              isOldDashboard={isOldDashboard}
            /> */}
            {isOldDashboard && (
              <>
                <Insights />
                <Row className="m-0 p-3">
                  <Col sm="12" md="12" lg={isCodeExists ? '6' : '12'} xs="12" className="p-0">
                    <IssueCategory />
                  </Col>
                  <Col sm="12" md="12" lg="6" xs="12" className="p-0 ">
                    <ServiceResponse />
                  </Col>
                </Row>
              </>
            )}
          </Col>
          {isOldDashboard && (
            <Col sm="12" md="12" lg="4" className="p-0 workorders-alarmcard asset-insights-notification">
              <Row className="pb-1 pt-2">
                <Col sm="12" md="12" lg="12" className="workorder-alarm">
                  <Notifications modelName={appModels.ORDER} />
                </Col>
              </Row>
            </Col>
          )}
        </Row>
      </Col>
    </Row>
  );
};
export default WorkordersOverview;
