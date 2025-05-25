/* eslint-disable react/no-danger */
import React from 'react';
import {
  Col,
  Row,
} from 'reactstrap';

const IotSystem = () => (
  <>
    <Row>
      <Col sm="12" md="12" lg="12" xs="12">
        <div dangerouslySetInnerHTML={{ __html: "<iframe src='http://ec2-3-121-188-84.eu-central-1.compute.amazonaws.com:9001/' width='100%' height='800px' />" }} />
      </Col>
    </Row>

  </>
);

export default IotSystem;
