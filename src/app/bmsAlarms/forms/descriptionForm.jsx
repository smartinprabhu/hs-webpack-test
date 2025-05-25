/* eslint-disable react/forbid-prop-types */
/* eslint-disable import/no-unresolved */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { useFormikContext } from 'formik';
import Grid from '@mui/material/Grid';
import MuiTextField from '../../commonComponents/formFields/muiTextField';
import MuiTextarea from '../../commonComponents/formFields/muiTextarea';
import {
  truncateHTMLTags,
} from '../../util/appUtils';


const DescriptionForm = (props) => {
  const {
    editId,
    setFieldValue,
    formField: {
      title,
      descriptionOfBreakdown,
    },
  } = props;
  const { values: formValues } = useFormikContext();
  const { description } = formValues;
  const onActionChange = (data) => {
    setFieldValue('description', data.target.value);
  };

  useEffect(() => {
    if (editId) {
      setFieldValue('description', truncateHTMLTags(description));
    }
  }, [editId]);

  return (
    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 4 }}>
      <Grid item xs={12} sm={12} md={12}>
        <MuiTextField
          name={title.name}
          label={title.label}
          isRequired
          placeholder="Enter Subject"
          type="text"
          fullWidth
          variant="standard"
          inputProps={{
            maxLength: 150,
          }}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={12}>
        <MuiTextarea
          sx={{
            marginTop: 'auto',
            marginBottom: '20px',
          }}
          fullWidth
          variant="standard"
          multiline
          name={descriptionOfBreakdown.name}
          label={descriptionOfBreakdown.label}
          formGroupClassName="m-1"
          type="textarea"
          maxRows="4"
          inputProps={{
            maxLength: 150,
          }}
        />
      </Grid>
    </Grid>
  );
};

DescriptionForm.propTypes = {
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default DescriptionForm;
