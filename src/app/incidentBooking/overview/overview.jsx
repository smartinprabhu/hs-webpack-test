import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Col,
  Row,
} from 'reactstrap';
import { Redirect } from 'react-router-dom';

import ErrorContent from '@shared/errorContent';

import './complianceOverview.scss';
// import ComplianceDownTime from './complianceDownTime';
// import ComplianceStatus from './complianceStatus';
// import Insights from './insights';
import { getMenuItems } from '../../util/appUtils';
import SharedDashboard from '../../shared/sharedDashboard';

const ComplianceOverview = () => {
  const [isOldDashboard, setOldDashboard] = useState(false)
  const subMenu = 'Insights';
  const module = 'HX Incident Report'
  const { userRoles } = useSelector((state) => state.user);
  const menuList = getMenuItems(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], module, 'name');
  const menuData = menuList.filter((item) => item === subMenu);
  const isMenu = !!(menuData && menuData.length);

  if (!isMenu) {
    return (<Redirect to="/hx-incidents" />);
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
              <ErrorContent errorTxt="Please Contact Admin" />
            )}
          </Col>
        </Row>
      </Col>
    </Row>
  );
};
export default ComplianceOverview;
