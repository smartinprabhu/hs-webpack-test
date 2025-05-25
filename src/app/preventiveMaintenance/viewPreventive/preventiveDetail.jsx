import React from 'react';
import {
  Col,
  Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';

import BasicInfo from './basicInfo';
import PreventiveSegments from './preventiveSegments';

const preventiveDetail = ({ isInspection }) => (
  <>
    <Row className="m-0 bg-lightblue">
      <Col sm="12" md="12" lg="12" className="p-2">
        <BasicInfo />
      </Col>
      <Col sm="12" md="12" lg="12" className="p-2 comments-list thin-scrollbar">
        <PreventiveSegments isInspection={isInspection} />
      </Col>
    </Row>
  </>
);
preventiveDetail.propTypes = {
  isInspection: PropTypes.bool,
};
preventiveDetail.defaultProps = {
  isInspection: false,
};
export default preventiveDetail;
