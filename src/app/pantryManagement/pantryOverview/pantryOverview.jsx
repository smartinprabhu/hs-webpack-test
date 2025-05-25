import React, { useState } from 'react';
import {
  Col,
  Row,
} from 'reactstrap';

import './visitorOverview.scss';
import Notifications from '../../dashboard/alerts';
import Insights from './insights';
import TopOrders from './topOrders';
import Navbar from '../navbar/navbar';
import SharedDashboard from '../../shared/sharedDashboard';

const appModels = require('../../util/appModels').default;

const PantryOverview = () => {
  const subMenu = 'Insights';
  const module = "Pantry Management"
  const [isOldDashboard, setOldDashboard] = useState(false)

  return (
    <Row className={`ml-1 mr-1 mt-2 mb-2 p-2 border ${isOldDashboard ? 'pantry-module' : 'bg-med-blue-dashboard'}`}>
      <Col sm="12" md="12" lg="12" xs="12">
        <Row className="p-1">
          <Col sm="12" md={isOldDashboard ? 8 : 12} lg={isOldDashboard ? 8 : 12} xs="12" className={`p-0 ${isOldDashboard ? 'pantry-insight' : ''}`}>
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
                  <Col sm="12" md="12" lg="12" xs="12" className="p-0">
                    <TopOrders />
                  </Col>
                </Row>
              </>
            )}
          </Col>
          {isOldDashboard && (
            <Col sm="12" md="12" lg="4" className="p-0">
              <Row className="pb-1 pt-2">
                <Col className="asset-insight-notifications" sm="12" md="12" lg="12">
                  <Notifications modelName={appModels.PANTRYORDER} />
                </Col>
              </Row>
            </Col>
          )}
        </Row>
      </Col>
    </Row>
  );
};
export default PantryOverview;
