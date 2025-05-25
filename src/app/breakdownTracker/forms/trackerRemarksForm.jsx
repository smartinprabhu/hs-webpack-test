/* eslint-disable camelcase */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable import/no-unresolved */
import React from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';
import { useFormikContext } from 'formik';
import { Box } from '@mui/system';
import MuiTextarea from '../../commonComponents/formFields/muiTextarea';

const TrackerRemarksForm = (props) => {
  const {
    setFieldValue,
    formField: {
      descriptionOfBreakdown,
      remark,
    },
  } = props;
  const { values: formValues } = useFormikContext();
  const { remarks, description_of_breakdown } = formValues;

  const onChange = (data) => {
    setFieldValue('remarks', DOMPurify.sanitize(data.target.value));
  };

  const onActionChange = (data) => {
    setFieldValue('description_of_breakdown', data.target.value);
  };

  return (
    <Box
      sx={{
        width: '50%',
        marginTop: '20px',
      }}
    >

      <MuiTextarea
        sx={{
          marginBottom: '20px',
        }}
        name={remark.name}
        label={remark.label}
        value={remarks}
        onChange={onChange}
        onBlur={onChange}
        type="text"
        multiline
        maxRows={4}
      />
    </Box>
  );
};

TrackerRemarksForm.propTypes = {
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default TrackerRemarksForm;
