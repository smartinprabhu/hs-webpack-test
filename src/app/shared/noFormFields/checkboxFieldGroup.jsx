/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  FormControl,
  FormControlLabel,
  Checkbox,
} from '@material-ui/core';

const CheckboxFieldGroup = (props) => {
  const {
    label, checkedvalue, customvalue, isDisabled, values, setValue, value, ...rest
  } = props;

  function onChange(e) {
    // setValue(e.target.id);
    if (e.target.checked) {
      setValue([...values, ...[e.target.value]]);
    } else {
      setValue(values.filter((item) => item !== e.target.value));
    }
  }

  let chkValue = false;

  if (value === checkedvalue) {
    chkValue = true;
  }

  if (customvalue && customvalue === checkedvalue) {
    chkValue = true;
  }

  const useStyles = makeStyles({
    root: {
      color: '#3a4354',
      checked: {
        color: '#3a4354',
      },
    },
  });

  const classes = useStyles();
  return (
    <FormControl {...rest}>
      <FormControlLabel
        value={value}
        checked={!!checkedvalue}
        control={(
          <Checkbox
            {...rest}
            size="small"
            onChange={onChange}
            color="default"
            disabled={isDisabled}
            className={classes.root}
          />
        )}
        label={label}
      />
    </FormControl>
  );
};

CheckboxFieldGroup.defaultProps = {
  customvalue: '',
  isDisabled: false,
};

CheckboxFieldGroup.propTypes = {
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  checkedvalue: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  setValue: PropTypes.func.isRequired,
  customvalue: PropTypes.string,
  isDisabled: PropTypes.bool,
};

export default CheckboxFieldGroup;
