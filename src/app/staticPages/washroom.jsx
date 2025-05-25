/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';
import {
  Col,
  Row,
} from 'reactstrap';

import ErrorContent from '@shared/errorContent';

import SharedDashboard from '../shared/sharedDashboard';

const Overview = () => {
  const subMenu = 'Insights';
  const module = "Smart Washroom"
  const [isOldDashboard, setOldDashboard] = useState(false)

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
export default Overview;
