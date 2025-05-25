import React from 'react';
import {
  Col,
  Row,
} from 'reactstrap';

import BasicInfo from './viewCompany/basicInfo';
import AdvancedInfo from './viewCompany/advancedInfo';

const CompanyInfo = () => (
  <>
    <Row className="p-2 bg-lightblue">
      <Col sm="12" md="12" lg="3" className="p-2  basic-card">
        <BasicInfo />
      </Col>
      <Col sm="12" md="12" lg="9" className="p-2 advanced-card">
        <AdvancedInfo />
      </Col>
    </Row>
  </>
);

export default CompanyInfo;
