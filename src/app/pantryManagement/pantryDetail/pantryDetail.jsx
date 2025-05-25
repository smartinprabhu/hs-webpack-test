import React from 'react';
import {
  Col,
  Row,
} from 'reactstrap';

import BasicInfo from './basicInfo';
import OrderSegments from './orderSegments';

const PantryDetail = () => (
  <>
    <Row className="m-0 bg-lightblue">
      <Col sm="12" md="12" lg="12" className="p-2">
        <BasicInfo />
      </Col>
      <Col sm="12" md="12" lg="12" className="p-2">
        <OrderSegments />
      </Col>
    </Row>
  </>
);

export default PantryDetail;
