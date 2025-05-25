/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Col, Row,
} from 'reactstrap';

import { InputField } from '@shared/formFields';
import { lettersOnly, integerKeyPress } from '../../../../util/appUtils';

const BasicForm = (props) => {
  const {
    formField: {
      nameValue,
      mobile,
      email,
      address,
      tenantCode,
    },
  } = props;

  return (
    <>
      <h6>Tenant Information</h6>
      <Row>
        <Col xs={12} sm={12} lg={12} md={12}>
          <InputField name={nameValue.name} label={nameValue.label} isRequired labelClassName="font-weight-500" onKeyPress={lettersOnly} type="text" maxLength="30" />
        </Col>
        <Col xs={12} sm={12} lg={12} md={12}>
          <InputField name={mobile.name} label={mobile.label} isRequired labelClassName="font-weight-500" onKeyPress={integerKeyPress} type="text" maxLength="13" />
        </Col>
        <Col xs={12} sm={12} lg={12} md={12}>
          <InputField name={email.name} label={email.label} isRequired labelClassName="font-weight-500" type="text" maxLength="50" />
        </Col>
        <Col xs={12} sm={12} lg={12} md={12}>
          <InputField name={tenantCode.name} label={tenantCode.label} isRequired labelClassName="font-weight-500" onKeyPress={lettersOnly} type="text" maxLength="15" />
        </Col>
        <Col xs={12} md={12} lg={12} sm={12}>
          <InputField
            name={address.name}
            label={address.label}
            isRequired
            labelClassName="font-weight-500"
            type="textarea"
            rows="4"
            maxLength="250"
          />
        </Col>
      </Row>
    </>
  );
};

BasicForm.propTypes = {
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default BasicForm;
