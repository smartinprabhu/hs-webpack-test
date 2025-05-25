/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Col, Row,
} from 'reactstrap';

import {
  getDefaultNoValue,
} from '../../util/appUtils';

const WarrantyDetails = (props) => {
  const { formValues } = props;
  return (
    <Col xs={12} sm={4} md={4} lg={4}>
      <h5 className="mb-3">
        Warranty Information
      </h5>
      <Row>
        <Col xs={12} sm={12} md={12} lg={12}>
          <p className="text-label-blue m-1">Purchase Date</p>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <p className="m-1">{getDefaultNoValue(formValues.purchase_date)}</p>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <p className="text-label-blue m-1">Purchase Value</p>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <p className="m-1">{getDefaultNoValue(formValues.purchase_value)}</p>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <p className="text-label-blue m-1">Warranty Start Date</p>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <p className="m-1">{getDefaultNoValue(formValues.warranty_start_date)}</p>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <p className="text-label-blue m-1">Warranty End Date</p>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <p className="m-1">{getDefaultNoValue(formValues.warranty_end_date)}</p>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <p className="text-label-blue m-1">Validation Status</p>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <p className="m-1">{getDefaultNoValue(formValues.validation_status ? formValues.validation_status.label : '')}</p>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <p className="text-label-blue m-1">Validated on</p>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <p className="m-1">{getDefaultNoValue(formValues.validated_on)}</p>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <p className="text-label-blue m-1">Validated By</p>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <p className="m-1">{formValues.validated_by && formValues.validated_by.name ? getDefaultNoValue(formValues.validated_by.name) : 'Not Assigned'}</p>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <p className="text-label-blue m-1">Comment</p>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <p className="m-1">{getDefaultNoValue(formValues.comment)}</p>
        </Col>

      </Row>
    </Col>
  );
};

WarrantyDetails.propTypes = {
  formValues: PropTypes.shape({
    purchase_date: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.string,
    ]),
    purchase_value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    warranty_start_date: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.string,
    ]),
    warranty_end_date: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.string,
    ]),
    validation_status: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
    ]),
    validated_on: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.string,
    ]),
    validated_by: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
      PropTypes.number,
    ]),
    comment: PropTypes.string,
  }).isRequired,
};

export default WarrantyDetails;
