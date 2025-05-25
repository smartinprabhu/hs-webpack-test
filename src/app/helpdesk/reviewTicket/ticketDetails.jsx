/* eslint-disable max-len */
/* eslint-disable react/no-danger */
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
import {
  getNumberToCommas,
} from '../../util/staticFunctions';

const TicketDetails = (props) => {
  const { formValues, isIncident } = props;

  const {
    maintenanceConfigurationData,
  } = useSelector((state) => state.ticket);

  const isVendorShow = maintenanceConfigurationData && !maintenanceConfigurationData.loading && maintenanceConfigurationData.data
  && maintenanceConfigurationData.data.length > 0 && maintenanceConfigurationData.data[0].is_vendor_field === 'Yes';
  const isConstraintsShow = maintenanceConfigurationData && !maintenanceConfigurationData.loading && maintenanceConfigurationData.data
  && maintenanceConfigurationData.data.length > 0 && maintenanceConfigurationData.data[0].is_constraints;
  const isCostShow = maintenanceConfigurationData && !maintenanceConfigurationData.loading && maintenanceConfigurationData.data
  && maintenanceConfigurationData.data.length > 0 && maintenanceConfigurationData.data[0].is_cost;

  return (
    <>
      <span className="d-inline-block pb-1 mt-2 mb-2 font-weight-bold">Ticket Information</span>
      <Row className="mb-3">
        <Col xs={12} sm={12} md={12} lg={12}>
          <Row className="m-0">
            <span className="text-label-blue m-1">Channel</span>
          </Row>
          <Row className="m-0">
            <span className="m-1 font-weight-500">{getDefaultNoValue(formValues.channel ? formValues.channel.label : '')}</span>
          </Row>
          <hr className="m-1" />
          <Row className="m-0">
            <span className="text-label-blue m-1">Ticket Type</span>
          </Row>
          <Row className="m-0">
            <span className="m-1 font-weight-500">{getDefaultNoValue(formValues.ticket_type && formValues.ticket_type.label ? formValues.ticket_type.label : formValues.ticket_type )}</span>
          </Row>
          <hr className="m-1" />
          {!isIncident && (
            <>
              <Row className="m-0">
                <span className="text-label-blue m-1">Issue Type</span>
              </Row>
              <Row className="m-0">
                <span className="m-1 font-weight-500">{getDefaultNoValue(formValues.issue_type ? formValues.issue_type.label : '')}</span>
              </Row>
              <hr className="m-1" />
            </>
          )}
          <Row className="m-0">
            <span className="text-label-blue m-1 m-1">Maintenance Team</span>
          </Row>
          <Row className="m-0">
            <span className="m-1 font-weight-500">{getDefaultNoValue(formValues.maintenance_team_id ? formValues.maintenance_team_id.name : '')}</span>
          </Row>
          <hr className="m-1" />
          <Row className="m-0">
            <span className="text-label-blue m-1 m-1">Parent Ticket</span>
          </Row>
          <Row className="m-0">
            <span className="m-1 font-weight-500">{getDefaultNoValue(formValues.parent_id && formValues.parent_id.subject ? `${formValues.parent_id.ticket_number} - ${formValues.parent_id.subject}` : '')}</span>
          </Row>
          <hr className="m-1" />
          {isVendorShow && (
            <>
              <Row className="m-0">
                <span className="text-label-blue m-1 m-1">Vendor</span>
              </Row>
              <Row className="m-0">
                <span className="m-1 font-weight-500">{getDefaultNoValue(formValues.vendor_id && formValues.vendor_id.name ? `${formValues.vendor_id.name}` : '')}</span>
              </Row>
              <hr className="m-1" />
            </>
          )}
          {isConstraintsShow && (
            <>
              <Row className="m-0">
                <span className="text-label-blue m-1 m-1">Constraints</span>
              </Row>
              <Row className="m-0">
                <span className="m-1 font-weight-500">{getDefaultNoValue(formValues.constraints ? `${formValues.constraints}` : '')}</span>
              </Row>
              <hr className="m-1" />
            </>
          )}
          {isCostShow && (
          <>
            <Row className="m-0">
              <span className="text-label-blue m-1 m-1">Cost</span>
            </Row>
            <Row className="m-0">
              <span className="m-1 font-weight-500">{getDefaultNoValue(formValues.cost ? getNumberToCommas(`${formValues.cost}`) : '')}</span>
            </Row>
            <hr className="m-1" />
          </>
          )}
          {/* <Row className="m-0">
            <span className="text-label-blue m-1 m-1">Priority</span>
          </Row>
          <Row className="m-0">
            <span className="m-1 font-weight-500">{getDefaultNoValue(formValues.priority_id && formValues.priority_id.name ? formValues.priority_id.name : '')}</span>
          </Row>
          <hr className="m-1" /> */}
        </Col>
      </Row>
    </>
  );
};

TicketDetails.propTypes = {
  formValues: PropTypes.shape({
    subject: PropTypes.string,
    maintenance_team_id: PropTypes.string,
    category_id: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number,
    ]),
    description: PropTypes.string,
    sub_category_id: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number,
    ]),
    priority_id: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
    ]),
    parent_id: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
    ]),
    equipment_id: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
      PropTypes.number,
    ]),
    vendor_id: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
      PropTypes.number,
    ]),
    constraints: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
      PropTypes.number,
    ]),
    cost: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
      PropTypes.number,
    ]),
    channel: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
    ]),
    issue_type: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
    ]),
    isIncident: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.string,
    ]),
    ticket_type: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
    ]),
  }).isRequired,
  isIncident: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
};

export default TicketDetails;
