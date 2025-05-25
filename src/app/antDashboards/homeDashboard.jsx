/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Col,
  Row,
} from 'reactstrap';

import SchoolDashboard from '../dashboard/schoolDashboard';
import GroupCharts from './groupCharts';

import Navbar from './navbar/navbar';

const HomeDashboard = () => {
  const subMenu = 'Insights';
  return (
    <Row className="ml-1 mr-1 mt-2 mb-2 p-2 border">
      <Col sm="12" md="12" lg="12" xs="12" className="p-2">
        <div className="background-color-light-grey">
          <SchoolDashboard />
          <GroupCharts />
        </div>
      </Col>
    </Row>
  );
};

export default HomeDashboard;
