/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Col, Row,
} from 'reactstrap';
import { useSelector } from 'react-redux';

import {
  getDefaultNoValue,
} from '../../util/appUtils';

const RequestorDetails = (props) => {
  const { formValues, isFITTracker } = props;

  const { maintenanceConfigurationData } = useSelector((state) => state.ticket);

  const isMobNotShow = maintenanceConfigurationData && !maintenanceConfigurationData.loading && maintenanceConfigurationData.data
  && maintenanceConfigurationData.data.length > 0 && maintenanceConfigurationData.data[0].requestor_mobile_visibility === 'Confidential';

  const isTenantShow = maintenanceConfigurationData && !maintenanceConfigurationData.loading && maintenanceConfigurationData.data
  && maintenanceConfigurationData.data.length > 0 && maintenanceConfigurationData.data[0].is_tenant;

  return (
    <>
      <span className="d-inline-block pb-1 mb-2 mt-2 font-weight-bold">Requestor Information</span>
      <Row className="mb-3">
        <Col xs={12} sm={12} md={12} lg={12}>
          <Row className="m-0">
            <span className="text-label-blue m-1">Company</span>
          </Row>
          <Row className="m-0">
            <span className="m-1 font-weight-500">{getDefaultNoValue(formValues.company_id && formValues.company_id.name ? formValues.company_id.name : '')}</span>
          </Row>
          <hr className="m-1" />
          <Row className="m-0">
            <span className="text-label-blue m-1">Name</span>
          </Row>
          <Row className="m-0">
            <span className="m-1 font-weight-500">{getDefaultNoValue(formValues.requestee_id ? formValues.requestee_id.name : '')}</span>
          </Row>
          <hr className="m-1" />
          <Row className="m-0">
            <span className="text-label-blue m-1">Email</span>
          </Row>
          <Row className="m-0">
            <span className="m-1 font-weight-500">{getDefaultNoValue(formValues.email)}</span>
          </Row>
          <hr className="m-1" />
          {!isFITTracker && (
            <>
              <Row className="m-0">
                <span className="text-label-blue m-1">Mobile</span>
              </Row>
              <Row className="m-0">
                <span className={`m-1 font-weight-500 ${formValues.mobile && isMobNotShow ? 'hide-phone-number' : ''}`}>{getDefaultNoValue(formValues.mobile)}</span>
              </Row>
              <hr className="m-1" />
            </>
          )}
          {isTenantShow && !isFITTracker && (
          <>
            <Row className="m-0">
              <span className="text-label-blue m-1">Tenant</span>
            </Row>
            <Row className="m-0">
              <span className="m-1 font-weight-500">{getDefaultNoValue(formValues.tenant_name)}</span>
            </Row>
            <hr className="m-1" />
          </>
          )}
        </Col>
      </Row>
    </>
  );
};

RequestorDetails.propTypes = {
  formValues: PropTypes.shape({
    company_id: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number,
    ]).isRequired,
    requestee_id: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number,
    ]).isRequired,
    mobile: PropTypes.string,
    email: PropTypes.string,
    tenant_name: PropTypes.string,
  }).isRequired,
};

export default RequestorDetails;
