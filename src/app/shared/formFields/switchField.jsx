/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import { at } from 'lodash';
import { useField } from 'formik';
import {
  Switch,
  FormControl,
  FormControlLabel,
  FormHelperText,
} from '@material-ui/core';

const SwitchField = (props) => {
  const {
    label, value, name, ...rest
  } = props;
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
        label={label}
        labelPlacement="start"
        checked={field.checked}
        control={<Switch {...field} checked={value} onChange={onChange} />}
      />
      {renderHelperText()}
    </FormControl>
  );
};

SwitchField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
};

export default SwitchField;
