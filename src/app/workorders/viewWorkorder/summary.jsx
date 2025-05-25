import React from 'react';
import {
  Col,
  Row,
} from 'reactstrap';
// eslint-disable-next-line import/no-unresolved
import ErrorContent from '@shared/errorContent';

const Summary = () => (
  <Row>
    <Col sm="12" md="12" lg="12" xs="12">
      <ErrorContent errorTxt="No data found." />
    </Col>
  </Row>
);

export default Summary;
