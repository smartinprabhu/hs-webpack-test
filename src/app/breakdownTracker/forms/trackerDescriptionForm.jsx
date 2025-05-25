/* eslint-disable camelcase */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable import/no-unresolved */
import React from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';
import { useFormikContext } from 'formik';
import { Box } from '@mui/system';
import MuiTextField from '../../commonComponents/formFields/muiTextField';

const TrackerRemarksForm = (props) => {
  const {
    setFieldValue,
    formField: {
      descriptionOfBreakdown,
      title,
    },
  } = props;
  const { values: formValues } = useFormikContext();
  const { description_of_breakdown } = formValues;

  const onChange = (data) => {
    setFieldValue('remarks', data.target.value);
  };

  const onActionChange = (data) => {
    setFieldValue('description_of_breakdown', DOMPurify.sanitize(data.target.value));
  };

  return (
    <Box
      sx={{
        width: '100%',
        marginTop: '20px',
      }}
    >
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '2%',
          flexWrap: 'wrap',
        }}
      >
        <MuiTextField
          sx={{
            width: '49%',
            marginBottom: '20px',
          }}
          name={title.name}
          label={title.label}
          isRequired
          placeholder="Enter Title"
          type="text"
          inputProps={{ maxLength: 150 }}
          setFieldValue={setFieldValue}
        />
        <MuiTextField
          sx={{
            width: '49%',
            marginBottom: '20px',
          }}
          name={descriptionOfBreakdown.name}
          label={descriptionOfBreakdown.label}
          value={description_of_breakdown}
          setFieldValue={setFieldValue}
          onChange={onActionChange}
          isRequired
          onBlur={onActionChange}
          type="textarea"
          rows="3"
          inputProps={{ maxLength: 150 }}
        />
      </Box>
    </Box>
  );
};

TrackerRemarksForm.propTypes = {
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default TrackerRemarksForm;
