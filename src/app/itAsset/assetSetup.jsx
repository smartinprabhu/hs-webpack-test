/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Col, Row,
} from 'reactstrap';

import Navbar from './navbar/navbar';
import AssetSegments from './assetSegments';

const AssetSetup = () => {
  const subMenu = 'IT Assets';

  return (
    <Row className="ml-1 mr-1 mt-2 mb-2 p-3 border itAssetsOverview">
      <Col sm="12" md="12" lg="12">
        <Row className="p-0">
          <Col sm="12" md="12" lg="12" className="p-0">
            <AssetSegments />
          </Col>
        </Row>
      </Col>
    </Row>

  );
};

export default AssetSetup;
