/* eslint-disable camelcase */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable import/no-unresolved */
import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useFormikContext } from 'formik';
import MuiTextField from '../../commonComponents/formFields/muiTextField';
import { AddThemeColor } from '../../themes/theme';

const TrackerVendorForm = (props) => {
  const {
    setFieldValue,
    formField: {
      vendorName,
      complaintNo,
      vendorSrNumber,
      amcStatus,
    },
  } = props;

  const { values: formValues } = useFormikContext();

  const { amc_status } = formValues;

  return (
    <Box
      sx={{
        width: '100%',
        marginTop: '20px',
      }}
    >
      <Typography
        sx={AddThemeColor({
          font: 'normal normal medium 20px/24px Suisse Intl',
          letterSpacing: '0.7px',
          fontWeight: 500,
        })}
      >
        Vendor Information
      </Typography>
      <Box
        sx={{
          width: '100%',
          alignItems: 'center',

        }}
      >
        <MuiTextField
          sx={{
            marginBottom: '20px',
          }}
          name={vendorName.name}
          label={vendorName.label}
          type="text"
          setFieldValue={setFieldValue}
          required={amc_status && (amc_status.value === 'Valid' || amc_status === 'Valid')}
          inputProps={{ maxLength: 30 }}
        />
        <MuiTextField
          sx={{
            marginBottom: '20px',
          }}
          name={complaintNo.name}
          setFieldValue={setFieldValue}
          label={complaintNo.label}
          type="text"
          inputProps={{ maxLength: 50 }}
        />
        <MuiTextField
          sx={{
            marginBottom: '20px',
          }}
          name={vendorSrNumber.name}
          label={vendorSrNumber.label}
          setFieldValue={setFieldValue}
          type="text"
          inputProps={{ maxLength: 50 }}
        />
      </Box>
    </Box>
  );
};

TrackerVendorForm.propTypes = {
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default TrackerVendorForm;
