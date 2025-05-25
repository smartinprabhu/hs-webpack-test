/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Col, Row,
} from 'reactstrap';

import Navbar from '../navbar/navbar';
import SideSpaces from './sideSpaces';

const MapView = () => {
  const subMenu = 'Map View';

  return (
    <Row className="ml-1 mr-1 mt-2 mb-2 p-2 border">
      <Col sm="12" md="12" lg="12" xs="12" className="p-2">
        <Navbar id={subMenu} />
        <SideSpaces />
      </Col>
    </Row>

  );
};

export default MapView;
