/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Row, Col,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import {
  getDefaultNoValue,
  getCompanyTimezoneDate,
} from '../../util/appUtils';
import {
  getOriginStatusLabel,
} from '../utils/utils';

const FacilityInfo = (props) => {
  const {
    detailData,
  } = props;
  const { userInfo } = useSelector((state) => state.user);

  return (detailData && (
  <>
    <Row>
      <Col sm="12" md="6" xs="12" lg="6">
        <Row className="m-0">
          <span className="m-0 p-0 light-text">Actual In</span>
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital">{ getDefaultNoValue(getCompanyTimezoneDate(detailData.actual_in, userInfo, 'datetime')) }</span>
        </Row>
      </Col>
      <Col sm="12" md="6" xs="12" lg="6">
        <Row className="m-0">
          <span className="m-0 p-0 light-text">Actual Out</span>
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital">{ getDefaultNoValue(getCompanyTimezoneDate(detailData.actual_out, userInfo, 'datetime')) }</span>
        </Row>
      </Col>
    </Row>
    <p className="mt-2" />
    <Row>
      <Col sm="12" md="6" xs="12" lg="6">
        <Row className="m-0">
          <span className="m-0 p-0 light-text">Allow Multiple Entry</span>
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(detailData.allow_multiple_entry ? 'Yes' : 'No')}</span>
        </Row>
      </Col>
      <Col sm="12" md="6" xs="12" lg="6">
        <Row className="m-0">
          <span className="m-0 p-0 light-text">Approval Status</span>
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 text-info font-weight-700 text-capital">{getDefaultNoValue(detailData.state)}</span>
        </Row>
      </Col>
    </Row>
    <p className="mt-2" />
    <Row>
      <Col sm="12" md="6" xs="12" lg="6">
        <Row className="m-0">
          <span className="m-0 p-0 light-text">Origin</span>
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(getOriginStatusLabel(detailData.origin_status))}</span>
        </Row>
      </Col>
      {detailData.time_elapsed_reason && 
      <Col sm="12" md="6" xs="12" lg="6">
        <Row className="m-0">
          <span className="m-0 p-0 light-text">Time Elapsed Reason</span>
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(detailData.time_elapsed_reason)}</span>
        </Row>
      </Col>
}
    </Row>
    <p className="mt-1" />
    {detailData.entry_status === 'time_elapsed' && (<Row>
      <Col sm="12" md="6" xs="12" lg="6">
        <Row className="m-0">
          <span className="m-0 p-0 light-text">Reason</span>
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(detailData.reason)}</span>
        </Row>
      </Col>
      </Row>)}
  </>
  )
  );
};

FacilityInfo.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
};
export default FacilityInfo;
