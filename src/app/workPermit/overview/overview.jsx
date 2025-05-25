import React, { useState } from 'react';
import {
  Col,
  Row,
} from 'reactstrap';

import './overview.scss';
import Notifications from '../../dashboard/alerts';
import Insights from './insights';
import ByNatureoFWork from './byNatureoFWork';
import ByVendor from './byVendor';
import SharedDashboard from '../../shared/sharedDashboard';

const appModels = require('../../util/appModels').default;

const Overview = () => {
  const subMenu = 'Insights';
  const module = 'Work Permit'
  const [isOldDashboard, setOldDashboard] = useState(false)

  return (
    <Row className={`ml-1 mr-1 mt-2 mb-2 p-2 border ${isOldDashboard ? 'workPermitOverview' : 'bg-med-blue-dashboard'}`}>
      <Col sm="12" md="12" lg="12" xs="12">
        <Row className={`p-1 ${isOldDashboard ? 'workPermitOverview-mainCard' : ''}`}>
          <Col sm="12" md={isOldDashboard ? 8 : 12} lg={isOldDashboard ? 8 : 12} xs="12" className={`p-0 ${isOldDashboard ? 'workPermit-card' : ''}`}>
            <SharedDashboard
              moduleName={module}
              menuName={subMenu}
              setOldDashboard={setOldDashboard}
              isOldDashboard={isOldDashboard}
            />
            {isOldDashboard && (
              <>
                <Insights />
                <Row className="m-0 p-3 workPermitOverview-graphs">
                  <Col sm="12" md="12" lg="12" xs="12" className="p-0 workPermitOverview-ByNatureoFWork">
                    <ByNatureoFWork />
                  </Col>
                  <Col sm="12" md="12" lg="12" xs="12" className="p-0 workPermitOverview-ByVendor">
                    <ByVendor />
                  </Col>
                </Row>
              </>
            )}
          </Col>
          {isOldDashboard && (
            <Col sm="12" md="12" lg="4" className="p-0 workPermit-alarms-card">
              <Row className="pb-1 pt-2">
                <Col sm="12" md="12" lg="12">
                  <Notifications modelName={appModels.WORKPERMIT} />
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
