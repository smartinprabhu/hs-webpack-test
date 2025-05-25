/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import { at } from 'lodash';
import { useField } from 'formik';
import {
  Radio,
  FormControl,
  FormControlLabel,
  FormHelperText,
} from '@material-ui/core';

const RadioboxField = (props) => {
  const { label, ...rest } = props;
  const [field, meta, helper] = useField(props);
  const { setValue } = helper;

  function renderHelperText() {
    const [touched, error] = at(meta, 'touched', 'error');
    let errorText = '';
    if (touched && error) {
      errorText = <FormHelperText>{error}</FormHelperText>;
    }
    return errorText;
  }

  function onChange(e) {
    setValue(e.target.checked);
  }
  return (
    <FormControl {...rest}>
      <FormControlLabel
        value={field.value}
        checked={field.value === '' ? false : field.value}
        control={(
          <Radio
            {...field}
            size="small"
            onChange={onChange}
            color="default"
          />
)}
        label={label}
      />
      {renderHelperText()}
    </FormControl>
  );
};

RadioboxField.propTypes = {
  label: PropTypes.string.isRequired,
};

export default RadioboxField;
