/* eslint-disable import/no-unresolved */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/system';
import MuiTextField from '../../../commonComponents/formFields/muiTextField';

import { integerKeyPress } from '../../../util/appUtils';

const BasicSetup = (props) => {
  const {
    setFieldValue,
    personName,
    formField: {
      nameValue,
      mobile,
      email,
    },
  } = props;

  useEffect(() => {
    if (personName) {
      setFieldValue('name', personName);
    }
  }, [personName]);

  return (
    <>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '3%',
          flexWrap: 'wrap',
          marginTop: '20px',
        }}
      >
        <MuiTextField
          sx={{
            width: '48%',
            marginTop: 'auto',
            marginBottom: '20px',
          }}
          fullWidth
          variant="standard"
          name={nameValue.name}
          setFieldValue={setFieldValue}
          label={nameValue.label}
          isRequired={nameValue.required}
          formGroupClassName="m-1"
          type="text"
          inputProps={{
            maxLength: 50,
          }}
        />
        <MuiTextField
          sx={{
            width: '48%',
            marginTop: 'auto',
            marginBottom: '20px',
          }}
          fullWidth
          variant="standard"
          name={mobile.name}
          type="text"
          label={mobile.label}
          onKeyPress={integerKeyPress}
          setFieldValue={setFieldValue}
          formGroupClassName="m-1"
          isRequired={mobile.required}
          placeholder="Enter mobile"
          inputProps={{
            maxLength: 12,
          }}
        />
        <MuiTextField
          sx={{
            width: '48%',
            marginTop: 'auto',
            marginBottom: '20px',
          }}
          fullWidth
          variant="standard"
          name={email.name}
          setFieldValue={setFieldValue}
          type="email"
          label={email.label}
          formGroupClassName="m-1"
          isRequired={email.required}
          placeholder="Enter email"
          inputProps={{
            maxLength: 50,
          }}
        />
      </Box>
      {/* <Row className="ml-5 mr-5">
        <Col md="6" sm="6" lg="6" xs="12">
          <InputField
            name={nameValue.name}
            label={nameValue.label}
            isRequired={nameValue.required}
            type="text"
            onKeyPress={noSpecialChars}
          />
        </Col>
        <Col md="6" sm="6" lg="6" xs="12">
          <InputField
            name={mobile.name}
            label={mobile.label}
            isRequired={mobile.required}
            type="text"
            maxLength="12"
            onKeyPress={integerKeyPress}
          />
        </Col>
        <Col md="6" sm="6" lg="6" xs="12">
          <InputField
            name={email.name}
            label={email.label}
            isRequired={email.required}
            maxLength="50"
            type="email"
          />
        </Col>
        </Row> */}
    </>
  );
};

BasicSetup.propTypes = {
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  personName: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
};

export default BasicSetup;
