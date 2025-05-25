/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
import React, { useEffect } from 'react';
import {
  Col,
  Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';

import { InputField } from '../shared/formFields';
import {
  noSpecialChars,
  integerKeyPress,
  getLocalTime,
} from '../util/appUtils';

const BasicForm = (props) => {
  const {
    setFieldValue,
    detailData,
    visitorDetails,
    visitorData,
    formField: {
      nameValue,
      mobile,
      email,
    },
  } = props;

  useEffect(() => {
    setFieldValue('phone', visitorDetails && visitorDetails.phone ? visitorDetails.phone : '');
    setFieldValue('email', visitorDetails && visitorDetails.email ? visitorDetails.email : '');
    setFieldValue('visitor_name', visitorDetails && visitorDetails.visitor_name ? visitorDetails.visitor_name : '');
  }, [visitorDetails]);

  useEffect(() => {
    if (detailData) {
      setFieldValue('has_visitor_email', detailData.has_visitor_email);
      setFieldValue('has_visitor_mobile', detailData.has_visitor_mobile);
      setFieldValue('has_visitor_badge', 'None');
    }
  }, [detailData]);

  return (
    <>
      <p className="text-center mt-2 mb-2 text-info">
        <FontAwesomeIcon
          color="info"
          className="mr-2"
          size="sm"
          icon={faInfoCircle}
        />
        {visitorData && visitorData.host_name ? visitorData.host_name : 'Host'}
        {' '}
        has invited you to visit
        {' '}
        {visitorData && visitorData.company_id ? visitorData.company_id.name : 'Company'}
        {' '}
        on
        {' '}
        {visitorData && visitorData.planned_in ? getLocalTime(visitorData.planned_in) : ''}
        . Click next to submit your details.
      </p>
      <Row>
        { /* <Col md="12" sm="12" lg="12" xs="12">
        <FormGroup className="m-1">
          <Label className="m-0" for="host_name">
            Host Name
          </Label>
          <Input
            type="text"
            className="bg-lightblue"
            name="host_name"
            defaultValue={visitorData && visitorData.host_name ? visitorData.host_name : ''}
            disabled
          />
        </FormGroup>
      </Col>
      <Col md="12" sm="12" lg="12" xs="12">
        <FormGroup className="m-1">
          <Label className="m-0" for="host_email">
            Host Email
          </Label>
          <Input
            type="text"
            className="bg-lightblue"
            name="host_name"
            defaultValue={visitorData && visitorData.host_email ? maskEmail(visitorData.host_email) : ''}
            disabled
          />
        </FormGroup>
  </Col> */ }
        <Col md="12" sm="12" lg="12" xs="12">
          <InputField
            name={nameValue.name}
            label={nameValue.label}
            isRequired={nameValue.required}
            type="text"
            readOnly
            customClassName="bg-lightblue"
            labelClassName="m-0"
            formGroupClassName="m-1"
            maxLength="50"
            onKeyPress={noSpecialChars}
          />
        </Col>
        {detailData.has_visitor_mobile && detailData.has_visitor_mobile !== 'None' && (
        <Col md="12" sm="12" lg="12" xs="12">
          <InputField
            name={mobile.name}
            label={mobile.label}
            isRequired={detailData.has_visitor_mobile && detailData.has_visitor_mobile === 'Required'}
            type="text"
            readOnly
            customClassName="bg-lightblue"
            labelClassName="m-0"
            formGroupClassName="m-1"
            maxLength="13"
            onKeyPress={integerKeyPress}
          />
        </Col>
        )}
        {detailData.has_visitor_email && detailData.has_visitor_email !== 'None' && (
        <Col md="12" sm="12" lg="12" xs="12">
          <InputField
            name={email.name}
            label={email.label}
            isRequired={detailData.has_visitor_email && detailData.has_visitor_email === 'Required'}
            type="email"
            readOnly
            customClassName="bg-lightblue"
            labelClassName="m-0"
            formGroupClassName="m-1"
            maxLength="50"
          />
        </Col>
        )}
      </Row>
    </>
  );
};

BasicForm.propTypes = {
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  visitorDetails: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  visitorData: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
};

export default BasicForm;
