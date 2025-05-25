/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Row, Col,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Markup } from 'interweave';

import {
  getDefaultNoValue,
  extractNameObject,
  getCompanyTimezoneDate,
  truncateFrontSlashs, truncateStars,
} from '../../util/appUtils';
import { getTaskStateLabel } from '../utils/utils';

const TaskBasicDetail = (props) => {
  const {
    detailData,
  } = props;
  const { userInfo } = useSelector((state) => state.user);

  return (detailData && (
  <>
    <Row>
      <Col sm="12" md="3" xs="12" lg="3">
        <Row className="m-0">
          <span className="m-0 p-0 light-text">Task Type</span>
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital">{ getDefaultNoValue(extractNameObject(detailData.task_type_id, 'name')) }</span>
        </Row>
      </Col>
      <Col sm="12" md="3" xs="12" lg="3">
        <Row className="m-0">
          <span className="m-0 p-0 light-text">Title</span>
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital">{ getDefaultNoValue(detailData.name) }</span>
        </Row>
      </Col>
      <Col sm="12" md="3" xs="12" lg="3">
        <Row className="m-0">
          <span className="m-0 p-0 light-text"> Assigned To</span>
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital">{ getDefaultNoValue(extractNameObject(detailData.assigned_id, 'name')) }</span>
        </Row>
      </Col>
      <Col sm="12" md="3" xs="12" lg="3">
        <Row className="m-0">
          <span className="m-0 p-0 light-text">Target Date</span>
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital">{ getDefaultNoValue(getCompanyTimezoneDate(detailData.target_date, userInfo, 'datetime')) }</span>
        </Row>
      </Col>
    </Row>
    <p className="mt-2" />
    <Row>
      <Col sm="12" md="3" xs="12" lg="3">
        <Row className="m-0">
          <span className="m-0 p-0 light-text">Status</span>
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital">{ getDefaultNoValue(getTaskStateLabel(detailData.state)) }</span>
        </Row>
      </Col>
      <Col sm="12" md="9" xs="12" lg="9">
        <Row className="m-0">
          <span className="m-0 p-0 light-text">Description</span>
        </Row>
        <Row className="m-0 form-modal-scroll hidden-scrollbar">
          <span className="m-0 p-0 font-weight-700 text-capital">
            <Markup content={truncateFrontSlashs(truncateStars(detailData.description))} />
          </span>
        </Row>
      </Col>
    </Row>
    <p className="mt-2" />
  </>
  )
  );
};

TaskBasicDetail.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
};
export default TaskBasicDetail;
