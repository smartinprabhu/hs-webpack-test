/* eslint-disable react/forbid-prop-types */
/* eslint-disable camelcase */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import { useFormikContext } from 'formik';
import { Box, } from "@mui/material";

import {
  integerKeyPress,
} from '../../../util/appUtils';

import MuiTextField from '../../../commonComponents/formFields/muiTextField';

const AdvanceForm = React.memo((props) => {
  const {
    formField: {
      posxLabel,
      posyLabel,
      poszLabel,
      barcode,
      comment,
    },
  } = props;
  const { values: formValues } = useFormikContext();
  const {
    posx, posy, posz,
  } = formValues;

  return (
    <>
      <Box sx={{ width: '50%' }}>
        <MuiTextField
          sx={{
            marginBottom: "10px",
          }}
          name={posxLabel.name}
          label={posxLabel.label}
          autoComplete="off"
          type="text"
          value={posx || ''}
          onKeyPress={integerKeyPress}
          formGroupClassName="m-1"
          maxLength="30"
        />

        <MuiTextField
          sx={{
            marginBottom: "10px",
          }}
          name={posyLabel.name}
          label={posyLabel.label}
          autoComplete="off"
          type="text"
          value={posy || ''}
          onKeyPress={integerKeyPress}
          formGroupClassName="m-1"
          maxLength="30"
        />

        <MuiTextField
          sx={{
            marginBottom: "10px",
          }}
          name={poszLabel.name}
          label={poszLabel.label}
          autoComplete="off"
          type="text"
          value={posz || ''}
          onKeyPress={integerKeyPress}
          formGroupClassName="m-1"
          maxLength="30"
        />

        <MuiTextField
          sx={{
            marginBottom: "10px",
          }}
          name={barcode.name}
          label={barcode.label}
          autoComplete="off"
          type="text"
          formGroupClassName="m-1"
          maxLength="30"
        />

        <MuiTextField
          sx={{
            marginBottom: "10px",
          }}
          name={comment.name}
          label={comment.label}
          autoComplete="off"
          type="textarea"
          formGroupClassName="m-1"
          maxLength="30"
        />
      </Box>
    </>
  );
});

AdvanceForm.propTypes = {
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default AdvanceForm;
