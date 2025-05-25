/* eslint-disable camelcase */
/* eslint-disable import/no-unresolved */
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import {
  Col,
} from 'reactstrap';
import { ThemeProvider } from '@material-ui/core/styles';

import { InputField } from '@shared/formFields';
import theme from '../../../util/materialTheme';

const RequestorForm = (props) => {
  const {
    setFieldValue,
    formField: {
      requestorName,
      email,
      siteSpoc,
      siteContactDetails,
      billingAddress,
      shippingAddress,
      comments,
      requisationCode,
    },
  } = props;
  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const reqName = userInfo.data.name ? userInfo.data.name : '';
      const reqEmail = userInfo.data.email && userInfo.data.email.email ? userInfo.data.email.email : '';
      const address = userInfo.data.company && userInfo.data.company.address ? userInfo.data.company.address : '';
      setFieldValue('requestor_full_name', reqName);
      setFieldValue('requestor_email', reqEmail);
      setFieldValue('bill_to_address', address);
      setFieldValue('ship_to_address', address);
    }
  }, [userInfo]);

  return (
    <>
      <ThemeProvider theme={theme}>
        <Col xs={12} sm={12} md={12} lg={12} className="mb-3 ml-1">
          <h6>Requestor Info</h6>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="mb-2">
          <InputField
            name={requestorName.name}
            label={requestorName.label}
            formGroupClassName="m-1"
            type="text"
            maxLength="100"
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="mb-2">
          <InputField
            name={email.name}
            label={email.label}
            formGroupClassName="m-1"
            type="text"
            maxLength="50"
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="mb-2">
          <InputField
            name={siteSpoc.name}
            label={siteSpoc.label}
            formGroupClassName="m-1"
            isRequired
            type="text"
            maxLength="200"
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="mb-2">
          <InputField
            name={siteContactDetails.name}
            label={siteContactDetails.label}
            formGroupClassName="m-1"
            isRequired
            type="text"
            maxLength="200"
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="mb-2">
          <InputField
            name={billingAddress.name}
            label={billingAddress.label}
            formGroupClassName="m-1"
            type="text"
            maxLength="300"
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="mb-2">
          <InputField
            name={shippingAddress.name}
            label={shippingAddress.label}
            formGroupClassName="m-1"
            type="text"
            maxLength="300"
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="mb-2">
          <InputField
            name={comments.name}
            label={comments.label}
            formGroupClassName="m-1"
            type="text"
            maxLength="200"
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} className="mb-2">
          <InputField
            name={requisationCode.name}
            label={requisationCode.label}
            disabled
            formGroupClassName="m-1"
            type="text"
            maxLength="50"
          />
        </Col>
      </ThemeProvider>
    </>
  );
};

RequestorForm.propTypes = {
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default RequestorForm;
