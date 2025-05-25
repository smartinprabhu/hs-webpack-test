/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Col, Row,
} from 'reactstrap';

import {
  getDefaultNoValue,
} from '../../util/appUtils';

const IncidentDetail = (props) => {
  const { formValues } = props;

  return (
    <>
      <span className="d-inline-block pb-1 mb-2 font-weight-bold">Incident Info</span>
      <Row className="mb-3">
        <Col xs={12} sm={5} md={5} lg={5}>
          <Row className="m-0">
            <span className="text-label-blue m-1">Incident Type</span>
          </Row>
          <Row className="m-0">
            <span className="m-1 font-weight-500">{getDefaultNoValue(formValues.incident_type_id && formValues.incident_type_id.name ? formValues.incident_type_id.name : '')}</span>
          </Row>
          <hr className="m-1" />
        </Col>
        <Col xs={12} sm={5} md={5} lg={5}>
          <Row className="m-0">
            <span className="text-label-blue m-1 m-1">Severity</span>
          </Row>
          <Row className="m-0">
            <span className="m-1 font-weight-500">{getDefaultNoValue(formValues.incident_severity_id && formValues.incident_severity_id.name ? formValues.incident_severity_id.name : '')}</span>
          </Row>
          <hr className="m-1" />
        </Col>
      </Row>
    </>
  );
};

IncidentDetail.propTypes = {
  formValues: PropTypes.shape({
    incident_type_id: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number,
    ]),
    incident_severity_id: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number,
    ]),
  }).isRequired,
};

export default IncidentDetail;
