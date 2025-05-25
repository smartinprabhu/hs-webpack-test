/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import { at } from 'lodash';
import { useField } from 'formik';
import { AddThemeColor } from '../../themes/theme';
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  makeStyles,
} from '@material-ui/core';

const CheckboxField = (props) => {
  const { label, isDisabled, ...rest } = props;
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

  const useStyles = makeStyles({
    root: {
      color: AddThemeColor({}).color,
      checked: {
        color: AddThemeColor({}).color,
      },
    },
  });

  function onChange(e) {
    setValue(e.target.checked);
  }
  const classes = useStyles();
  return (
    <FormControl {...rest}>
      <FormControlLabel
        value={field.value}
        checked={field && field.value ? field.value : false}
        control={(
          <Checkbox
            {...field}
            size="small"
            onChange={onChange}
            color="default"
            disabled={isDisabled}
            className={classes.root}
          />
        )}
        label={label}
      />
      {renderHelperText()}
    </FormControl>
  );
};

CheckboxField.defaultProps = {
  isDisabled: false,
};

CheckboxField.propTypes = {
  label: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  isDisabled: PropTypes.bool,
};

export default CheckboxField;
