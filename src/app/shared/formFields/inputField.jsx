/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { at } from 'lodash';
import PropTypes from 'prop-types';
import { useField } from 'formik';
import {
  FormGroup, Label, Input, FormFeedback,
} from 'reactstrap';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  input: {
    '&::placeholder': {
      textOverflow: 'ellipsis !important',
      color: '#b4b8bc',
    },
    height: 30,
  },
}));

const InputField = (props) => {
  const {
    name, label, type, customClassName, labelClassName, formGroupClassName, isRequired, customError, hideError, ...rest
  } = props;
  const [field, meta] = useField(props);
  const classes = useStyles();

  function renderHelperText() {
    const [touched, error] = at(meta, 'touched', 'error');
    let errorValue = '';
    if (touched && error) {
      errorValue = error;
    }
    return errorValue;
  }

  return (
    <FormGroup className={formGroupClassName || ''}>
      <Label className={labelClassName || ''} for={name}>
        {label}
        {isRequired && (<span className="ml-1 text-danger">*</span>)}
      </Label>
      <Input
        type={type}
        className={customClassName || classes.input}
        name={name}
        {...field}
        {...rest}
        id="unique-email-field"
      />
      {meta.touched && meta.error && !customError && !hideError && (
      <FormFeedback className="display-block mt-2 mb-1">{renderHelperText()}</FormFeedback>
      )}
      {customError && (
      <FormFeedback className="display-block mt-2 mb-1">{customError}</FormFeedback>
      )}
    </FormGroup>
  );
};

InputField.defaultProps = {
  customClassName: false,
  labelClassName: false,
  formGroupClassName: false,
  isRequired: false,
  customError: false,
  hideError: false,
};

InputField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  labelClassName: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
  formGroupClassName: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
  customClassName: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
  isRequired: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
  customError: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
  hideError: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
};

export default InputField;
