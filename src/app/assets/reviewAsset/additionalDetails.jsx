/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Col, Row,
} from 'reactstrap';
import {
  getDefaultNoValue,
} from '../../util/appUtils';

import { getCriticalLabel } from '../utils/utils';

const AdditionalDetails = (props) => {
  const { formValues } = props;
  return (
    <Col xs={12} sm={4} md={4} lg={4}>
      <h5 className="mb-3">
        Additional Information
      </h5>
      <Row>
        <Col xs={12} sm={12} md={12} lg={12}>
          <p className="text-label-blue m-1">Serial</p>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <p className="m-1">{getDefaultNoValue(formValues.serial)}</p>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <p className="text-label-blue m-1">Model</p>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <p className="m-1">{getDefaultNoValue(formValues.model)}</p>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <p className="text-label-blue m-1">Criticality</p>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <p className="m-1">{getCriticalLabel(formValues.criticality ? formValues.criticality.label : '')}</p>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <p className="text-label-blue m-1">Description</p>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <p className="m-1">{getDefaultNoValue(formValues.equipment_number)}</p>
        </Col>
      </Row>
    </Col>
  );
};

AdditionalDetails.propTypes = {
  formValues: PropTypes.shape({
    serial: PropTypes.string,
    model: PropTypes.string,
    criticality: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
    ]),
    equipment_number: PropTypes.string,
  }).isRequired,
};

export default AdditionalDetails;
