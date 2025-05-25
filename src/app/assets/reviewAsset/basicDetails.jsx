/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Col, Row,
} from 'reactstrap';

const BasicDetails = (props) => {
  const { formValues } = props;
  return (
    <Col xs={12} sm={4} md={4} lg={4}>
      <h5 className="mb-3">
        Basic Information
      </h5>
      <Row>
        <Col xs={12} sm={12} md={12} lg={12}>
          <p className="text-label-blue m-1">Name</p>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <p className="m-1">{formValues.name}</p>
        </Col>

        <Col xs={12} sm={12} md={12} lg={12}>
          <p className="text-label-blue m-1">Category</p>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <p className="m-1">{formValues.category_id && formValues.category_id.name ? formValues.category_id.name : ''}</p>
        </Col>

        <Col xs={12} sm={12} md={12} lg={12}>
          <p className="text-label-blue m-1">Space</p>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <p className="m-1">{formValues.location_id && formValues.location_id.path_name ? formValues.location_id.path_name : ''}</p>
        </Col>

        <Col xs={12} sm={12} md={12} lg={12}>
          <p className="text-label-blue m-1">Maintenance Team</p>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <p className="m-1">{formValues.maintenance_team_id && formValues.maintenance_team_id.name ? formValues.maintenance_team_id.name : ''}</p>
        </Col>
      </Row>
    </Col>
  );
};

BasicDetails.propTypes = {
  formValues: PropTypes.shape({
    name: PropTypes.string,
    location_id: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number,
    ]),
    category_id: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number,
    ]),
    maintenance_team_id: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number,
    ]),
  }).isRequired,
};

export default BasicDetails;
