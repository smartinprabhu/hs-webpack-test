import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Col,
  Row,
} from 'reactstrap';
import { Redirect } from 'react-router-dom';

import './complianceOverview.scss';
import Notifications from '../../dashboard/alerts';
import ComplianceExpiry from './complianceExpiry';
import ComplianceDownTime from './complianceDownTime';
import ComplianceStatus from './complianceStatus';
import Insights from './insights';
import Navbar from '../navbar/navbar';
import { getMenuItems } from '../../util/appUtils';
import SharedDashboard from '../../shared/sharedDashboard';

const appModels = require('../../util/appModels').default;

const ComplianceOverview = () => {
  const [popoverModal, setPopoverModal] = useState(false);
  const [isOldDashboard, setOldDashboard] = useState(false)

  const subMenu = 'Insights';
  const module = 'Building Compliance';
  const { userRoles } = useSelector((state) => state.user);
  const menuList = getMenuItems(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Building Compliance', 'name');

  const menuData = menuList.filter((item) => item === subMenu);
  const isMenu = !!(menuData && menuData.length);
  if (!isMenu) {
    return (<Redirect to="/buildingcompliance" />);
  }

  return (
    <Row className={`ml-1 mr-1 mt-2 mb-2 p-2 border ${isOldDashboard ? 'building-compliance-overview' : 'bg-med-blue-dashboard'}`}>
      <Col sm="12" md="12" lg="12" xs="12">
        <Row className={`p-1 ${isOldDashboard ? 'bc-insights' : ''}`}>
          <Col sm="12" md={isOldDashboard ? 8 : 12} lg={isOldDashboard ? 8 : 12} xs="12" className="p-0">
            <SharedDashboard
              moduleName={module}
              menuName={subMenu}
              setOldDashboard={setOldDashboard}
              isOldDashboard={isOldDashboard}
            />
            {isOldDashboard && (
              <>
                <Insights />
                <Row className="m-0 p-3">
                  <Col sm="12" md="12" lg="6" xs="12" className="p-0 ComplianceStatus">
                    <ComplianceStatus />
                  </Col>
                  <Col sm="12" md="12" lg="6" xs="12" className="p-0 ComplianceDownTime">
                    <ComplianceDownTime />
                  </Col>
                </Row>
                <Row className="m-0 p-3">
                  <Col sm="12" md="12" lg="12" xs="12" className="p-0 ComplianceExpiry">
                    <ComplianceExpiry popoverModal={popoverModal} setPopoverModal={setPopoverModal} />
                  </Col>
                </Row>
              </>
            )}
          </Col>
          {isOldDashboard && (
            <Col sm="12" md="12" lg="4" xs="12" className="p-0">
              <Row className="pb-1 pt-2">
                <Col className="asset-insight-notifications" sm="12" md="12" lg="12" xs="12">
                  <Notifications modelName={appModels.BULIDINGCOMPLIANCE} />
                </Col>
              </Row>
            </Col>
          )}
        </Row>
      </Col>
    </Row>
  );
};
export default ComplianceOverview;
