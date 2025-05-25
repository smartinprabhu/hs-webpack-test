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
        <span className="m-0 p-0 light-text">Allocated Resourses</span>
      </Row>
      <Row className="m-0">
        <span className="m-0 p-0 font-weight-700 text-capital">
          {getDefaultNoValue(detailData.n_resourse)}
        </span>
      </Row>
      <p className="mt-2" />
    </Col>
    <Col sm="12" md="6" xs="12" lg="6">
      <Row className="m-0">
        <span className="m-0 p-0 light-text">Planned Material Cost</span>
      </Row>
      <Row className="m-0">
        <span className="m-0 p-0 font-weight-700 text-capital">
          {detailData.std_mat_cost}
          .00
        </span>
      </Row>
      <p className="mt-2" />
      <Row className="m-0">
        <span className="m-0 p-0 light-text">Planned Tool Cost</span>
      </Row>
      <Row className="m-0">
        <span className="m-0 p-0 font-weight-700 text-capital">
          {detailData.std_tool_cost}
          .00
        </span>
      </Row>
      <p className="mt-2" />
      <Row className="m-0">
        <span className="m-0 p-0 light-text">Planned Labour Cost</span>
      </Row>
      <Row className="m-0">
        <span className="m-0 p-0 font-weight-700 text-capital">
          {detailData.std_labour_cost}
          .00
        </span>
      </Row>
      <p className="mt-2" />
    </Col>
    <Col sm="12" md="6" xs="12" lg="6">
      <Row className="m-0">
        <span className="m-0 p-0 light-text">Actual Material Cost</span>
      </Row>
      <Row className="m-0">
        <span className="m-0 p-0 font-weight-700 text-capital">
          {detailData.act_mat_cost}
          .00
        </span>
      </Row>
      <p className="mt-2" />
      <Row className="m-0">
        <span className="m-0 p-0 light-text">Actual Tool Cost</span>
      </Row>
      <Row className="m-0">
        <span className="m-0 p-0 font-weight-700 text-capital">
          {detailData.act_tool_cost}
          .00
        </span>
      </Row>
      <p className="mt-2" />
      <Row className="m-0">
        <span className="m-0 p-0 light-text">Actual Labour Cost</span>
      </Row>
      <Row className="m-0">
        <span className="m-0 p-0 font-weight-700 text-capital">
          {detailData.act_labour_cost}
          .00
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
