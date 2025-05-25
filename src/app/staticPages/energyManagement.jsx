/* eslint-disable react/no-danger */
import React from 'react';
import {
  Col,
  Row,
} from 'reactstrap';

const EnergyManagement = () => (
  <>
    <Row>
      <Col sm="12" md="12" lg="12" xs="12">
        <div
          dangerouslySetInnerHTML={{
            __html: "<iframe src='http://52.66.109.243:8080/dashboard/011054f0-dbe6-11ea-b3d8-67574b317d9f?publicId=32f81850-ec20-11ea-b3d8-67574b317d9f' width='100%' height='800px' />",
          }}
        />
      </Col>
    </Row>

  </>
);

export default EnergyManagement;
