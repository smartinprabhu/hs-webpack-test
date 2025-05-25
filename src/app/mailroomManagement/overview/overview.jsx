import React, { useState } from 'react';
import {
  Col,
  Row,
} from 'reactstrap';

import './overview.scss';
import Notifications from '../../dashboard/alerts';
import Insights from './insights';
import Navbar from '../navbar/navbar';
import SharedDashboard from '../../shared/sharedDashboard';

const appModels = require('../../util/appModels').default;

const Overview = () => {
  const subMenu = 'Insights';
  const module = "Mail Room Management"
  const [isOldDashboard, setOldDashboard] = useState(false)

  return (
    <Row className={`ml-1 mr-1 mt-2 mb-2 p-2 border ${isOldDashboard ? 'mailRoomManagement-overview' : 'bg-med-blue-dashboard'}`}>
      <Col sm="12" md="12" lg="12" xs="12">
        <Row className={`p-1 ${isOldDashboard ? 'mailRoomManagementOverview-mainCard' : ''}`}>
          <Col sm="12" md={isOldDashboard ? 8 : 12} lg={isOldDashboard ? 8 : 12} xs="12" className={`p-0 ${isOldDashboard ? 'mailRoomManagementOverview-mails' : ''}`}>
            <SharedDashboard
              moduleName={module}
              menuName={subMenu}
              setOldDashboard={setOldDashboard}
              isOldDashboard={isOldDashboard}
            />
            {isOldDashboard && (
              <Insights />
            )}
          </Col>
          {isOldDashboard && (
            <Col sm="12" md="12" lg="4" className="p-0 mailRoomManagementOverview-alarms asset-insight-notifications">
              <Row className="pb-1 pt-2">
                <Col sm="12" md="12" lg="12">
                  <Notifications modelName={appModels.MAILINBOUND} />
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
