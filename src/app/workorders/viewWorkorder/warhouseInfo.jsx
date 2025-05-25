/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Row,
  Col,
} from 'reactstrap';
import * as PropTypes from 'prop-types';

import {
  getDefaultNoValue,
} from '../../util/appUtils';

const ScheduleInfo = (props) => {
  const {
    detailData,
  } = props;

  return (detailData && (
  <Row className="m-0">
    <Col sm="12" md="12" xs="12" lg="12">
      <Row className="m-0">
        <span className="m-0 p-0 light-text">Warehouse</span>
      </Row>
      <Row className="m-0">
        <span className="m-0 p-0 font-weight-700 text-capital">
          {getDefaultNoValue(detailData.warehouse_id[1])}
        </span>
      </Row>
      <p className="mt-2" />
    </Col>
    <Col sm="12" md="12" xs="12" lg="12">
      <Row className="m-0">
        <span className="m-0 p-0 light-text">Spare Parts Location</span>
      </Row>
      <Row className="m-0">
        <span className="m-0 p-0 font-weight-700 text-capital">
          {getDefaultNoValue(detailData.location_parts_id[1])}
        </span>
      </Row>
      <p className="mt-2" />
    </Col>
    <Col sm="12" md="12" xs="12" lg="12">
      <Row className="m-0">
        <span className="m-0 p-0 light-text">Operation Type</span>
      </Row>
      <Row className="m-0">
        <span className="m-0 p-0 font-weight-700 text-capital">
          {getDefaultNoValue(detailData.picking_type_id[1])}
        </span>
      </Row>
      <p className="mt-2" />
    </Col>
  </Row>
  )
  );
};

ScheduleInfo.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
};
export default ScheduleInfo;
