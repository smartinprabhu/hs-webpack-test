/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';
import {
  Col,
  Row,
} from 'reactstrap';

import '../../helpdesk/helpdeskOverview/helpdeskOverview.scss';
import Notifications from '../../dashboard/alerts';
import Insights from '../../helpdesk/helpdeskOverview/insights';
import IssueCategory from '../../helpdesk/helpdeskOverview/issueCategory';
import IncidentByType from '../../helpdesk/helpdeskOverview/incidentByType';
import Navbar from '../navbar/navbar';
import SharedDashboard from '../../shared/sharedDashboard';

const appModels = require('../../util/appModels').default;

const IncidentOverview = () => {
  const [isOldDashboard, setOldDashboard] = useState(false)
  const subMenu = 1;
  const menu = 'Insights';
  const module = "Incident Management"
  return (
    <Row className={`ml-1 mr-1 mt-2 mb-2 p-3 rounded-sm ${isOldDashboard ? 'incident-Overview' : 'bg-med-blue-dashboard'} border`}>
      <Col sm="12" md="12" lg="12" xs="12" className="p-0">
        <Row className={`p-1 ${isOldDashboard ? 'incidentOverview-mainCard' : ''}`}>
          <Col sm="12" md={isOldDashboard ? 8 : 12} lg={isOldDashboard ? 8 : 12} xs="12" className={`p-0 ${isOldDashboard ? 'incidentOverview-incidents' : ''}`}>
            <div className="mt-2">
              <SharedDashboard
                moduleName={module}
                menuName={menu}
                setOldDashboard={setOldDashboard}
                isOldDashboard={isOldDashboard}
              />
              {isOldDashboard && (
                <>
                  <Insights isIncident />
                  <Row className="m-0 p-3 incidentOverview-grpahs">
                    <Col sm="12" md="12" lg="6" xs="12" className="p-0 incidentOverview-issueCategory">
                      <IssueCategory isIncident />
                    </Col>
                    <Col sm="12" md="12" lg="6" xs="12" className="p-0 incidentOverview-incidentByType">
                      <IncidentByType isIncident />
                    </Col>
                  </Row>
                </>
              )}
            </div>
          </Col>
          {isOldDashboard && (
            <Col sm="12" md="12" lg="4" xs="12" className="p-0 incidentOverview-alarms asset-insight-notifications">
              <Row className="pb-1 pt-2">
                <Col sm="12" md="12" lg="12" xs="12">
                  <Notifications modelName={appModels.HELPDESK} />
                </Col>
              </Row>
            </Col>
          )}
        </Row>
      </Col>
    </Row>
  );
};
export default IncidentOverview;
