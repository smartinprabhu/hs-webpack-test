import React from 'react';
import {
  Col,
  Row,
} from 'reactstrap';

import BasicInfo from './viewSite/basicInfo';
import AdvancedInfo from './viewSite/advancedInfo';

const SiteInfo = () => (
  <>
    <Row className="m-0 h-100 bg-lightblue">
      <Col sm="12" md="12" lg="3" className="p-2">
        <BasicInfo />
      </Col>
      <Col sm="12" md="12" lg="9" className="p-2">
        <AdvancedInfo />
      </Col>
    </Row>
  </>
);

export default SiteInfo;
