/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import {
  FormControl,
  FormControlLabel,
} from '@material-ui/core';
import { Checkbox } from '@mui/material';

const MuiCheckboxField = (props) => {
  const {
    value, checkboxChange, label,
  } = props;

  return (
    <FormControl>
      <FormControlLabel
        control={(
          <Checkbox
            size="small"
            className="p-0"
            checked={value}
            onChange={checkboxChange}
          />
                  )}
        label={label}
      />
    </FormControl>
  );
};

MuiCheckboxField.defaultProps = {
  isDisabled: false,
};

MuiCheckboxField.propTypes = {
  label: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  isDisabled: PropTypes.bool,
};

export default MuiCheckboxField;
