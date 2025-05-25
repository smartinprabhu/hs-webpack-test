/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Col, Row,
} from 'reactstrap';


const PurchaseSetup = () => {
  const subMenu = 'Purchase Info';

  return (
    <Row className="ml-1 mr-1 mt-2 mb-2 p-3 border  purchase-module">
      <Col className="purchase-module" sm="12" md="12" lg="12">
        {/* <Navbar id={subMenu} /> */}
      </Col>
    </Row>
  );
};

export default PurchaseSetup;
