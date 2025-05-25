/* eslint-disable react/forbid-prop-types */
/* eslint-disable import/no-unresolved */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Row, Col,
} from 'reactstrap';
import { ThemeProvider } from '@material-ui/core/styles';

import { InputField } from '@shared/formFields';

import theme from '../../util/materialTheme';
import { useFormikContext } from 'formik';

const VendorForm = (props) => {
  const {
    values,
    setFieldValue,
    formField: {
      vendorName,
      complaintNo,
      vendorSrNumber,
      amcStatus
    },
  } = props;

  const { values: formValues } = useFormikContext();
  const {amc_status} = formValues
  return (
    <>
      <span className="d-inline-block pb-1 font-17 mb-2 font-weight-800 requestorForm-title">Vendor Information</span>
      <ThemeProvider theme={theme}>
        <Row className="mb-3 requestorForm-input">
          <Col xs={12} sm={12} md={12} lg={12}> 
            <InputField
              name={vendorName.name}
              label={vendorName.label}
              customClassName="bg-input-blue-small"
              labelClassName="mb-1"
              formGroupClassName="mb-1"
              type="text"
              maxLength="150"
              isRequired={amc_status && (amc_status.value === 'Valid' || amc_status === "Valid")}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12}>
            <InputField
              name={complaintNo.name}
              label={complaintNo.label}
              customClassName="bg-input-blue-small"
              labelClassName="mb-1"
              formGroupClassName="mb-1"
              type="text"
              maxLength="150"
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12}>
            <InputField
              name={vendorSrNumber.name}
              label={vendorSrNumber.label}
              customClassName="bg-input-blue-small"
              labelClassName="mb-1"
              formGroupClassName="mb-1"
              type="text"
              maxLength="150"
            />
          </Col>

        </Row>
      </ThemeProvider>
    </>
  );
};

VendorForm.propTypes = {
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default VendorForm;
