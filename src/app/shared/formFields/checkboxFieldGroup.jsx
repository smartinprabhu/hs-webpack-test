/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import { at } from 'lodash';
import { useField } from 'formik';
import { makeStyles } from '@material-ui/core/styles';
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
} from '@material-ui/core';
import { Radio } from '@mui/material';
import { AddThemeColor } from '../../themes/theme';

const CheckboxFieldGroup = (props) => {
  const {
    label, checkedvalue, customvalue, isDisabled, ...rest
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
    setValue(e.target.id);
  }

  let chkValue = false;

  if (field.value === checkedvalue) {
    chkValue = true;
  }

  if (customvalue && customvalue === checkedvalue) {
    chkValue = true;
  }

  const useStyles = makeStyles({
     root: {
       color: AddThemeColor({}).color,
       checked: {
         color: AddThemeColor({}).color,
       },
     },
   });

  const classes = useStyles();
  return (
    <FormControl {...rest}>
      <FormControlLabel
        value={field.value}
        control={(
          <Radio
            {...props}
            checked={chkValue}
            onChange={onChange}
            disabled={isDisabled}
           // color="default"
           // size="small"
            //className={classes.root}
          />
)}
        label={label}
      />
      {renderHelperText()}
    </FormControl>
  );
};

CheckboxFieldGroup.defaultProps = {
  customvalue: '',
  isDisabled: false,
};

CheckboxFieldGroup.propTypes = {
  label: PropTypes.string.isRequired,
  checkedvalue: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  customvalue: PropTypes.string,
  isDisabled: PropTypes.bool,
};

export default CheckboxFieldGroup;
