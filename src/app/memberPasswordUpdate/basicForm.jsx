/* eslint-disable react/forbid-prop-types */
/* eslint-disable consistent-return */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Col,
  Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';

import { InputField } from '../shared/formFields';
import {
  detectMob,
} from '../util/appUtils';

const BasicForm = (props) => {
  const {
    formField: {
      newPassword,
      password,
    },
  } = props;

  const isMobileView = detectMob();

  return (
    <Row>
      <Col md="12" sm="12" lg="12" xs="12" className={isMobileView ? 'pl-4' : ''}>
        <InputField
          name={newPassword.name}
          label={newPassword.label}
          isRequired
          type="password"
          customClassName="bg-lightblue"
          labelClassName="m-0"
          formGroupClassName="m-1"
          maxLength="50"
        />
      </Col>
      <Col md="12" sm="12" lg="12" xs="12" className={isMobileView ? 'pl-4' : ''}>
        <InputField
          name={password.name}
          label={password.label}
          isRequired
          type="password"
          customClassName="bg-lightblue"
          labelClassName="m-0"
          formGroupClassName="m-1"
          maxLength="50"
        />
      </Col>
    </Row>
  );
};

BasicForm.propTypes = {
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default BasicForm;
