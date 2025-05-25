/* eslint-disable import/no-unresolved */
import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import MuiTextField from '../../commonComponents/formFields/muiTextField';


const BasicSetup = (props) => {
  const {
    setFieldValue,
    formField: {
      nameValue,
    },
  } = props;

  return (
    <Grid container rowSpacing={1} columnSpacing={{ xs: 12, sm: 12, md: 12 }}>
      <Grid item xs={12} sm={12} md={12}>
        <MuiTextField
          name={nameValue.name}
          label={nameValue.label}
          isRequired={nameValue.required}
          type="text"
          variant="standard"
          inputProps={{
            maxLength: 50,
          }}
        />
      </Grid>
    </Grid>
  );
};

BasicSetup.propTypes = {
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default BasicSetup;
