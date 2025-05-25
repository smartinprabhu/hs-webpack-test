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
    partsData, setPartsData, setPartsAdd, index, formData, name, label
  } = props;

  function onChange(e) {
    // setValue(e.target.checked);
    const newData = partsData;
    newData[index][name] = e.target.checked;
    setPartsData(newData);
    setPartsAdd(Math.random());
  }

  return (
    <FormControl>
      <FormControlLabel
        value={formData[name]}
        checked={formData[name]}
        control={(
          <Checkbox
            onChange={onChange}
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
