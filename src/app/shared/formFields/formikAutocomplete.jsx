/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { at } from 'lodash';
import { Autocomplete } from '@material-ui/lab';
import { Label, FormFeedback, FormGroup } from 'reactstrap';
import { useField } from 'formik';

const FormikAutocomplete = (props) => {
  const {
    label, name, loading, placeholder, labelClassName, formGroupClassName, apiError, isRequired, oldValue, isShowError, ...rest
  } = props;
  const [field, meta, helper] = useField(props);
  const { setValue, setTouched } = helper;
  const [touched, error, value] = at(meta, 'touched', 'error', 'value');
  const isError = touched && error && true;

  function renderHelperText() {
    let errorValue = '';
    if (touched && apiError) {
      errorValue = apiError;
    } else if (touched && error) {
      errorValue = error;
    }
    return errorValue;
  }

  function onChange(e, data) {
    if (data) {
      setValue(data);
    } else {
      setValue('');
    }
  }
  
  return (
    <FormGroup className={formGroupClassName || ''} error={isError ? '1' : '0'}>
      <Label className={labelClassName || ''} for={name}>
        {label}
        {isRequired && (<span className="ml-1 text-danger">*</span>)}
      </Label>
      <Autocomplete
        {...field}
        disableClearable={!(value)}
        placeholder={placeholder}
        onChange={onChange}
        className="bg-white"
        onBlur={() => setTouched(name, true)}
        {...rest}
      />
      {!isShowError && (
        <FormFeedback className="display-block">{renderHelperText()}</FormFeedback>
      )}
    </FormGroup>
  );
};

FormikAutocomplete.defaultProps = {
  loading: false,
  labelClassName: false,
  formGroupClassName: false,
  isRequired: false,
  apiError: false,
  oldValue: false,
  isShowError: false,
};

FormikAutocomplete.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  labelClassName: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
  formGroupClassName: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
  isRequired: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
  oldValue: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
    PropTypes.number,
  ]),
  apiError: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
    PropTypes.number,
  ]),
  isShowError: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
    PropTypes.number,
  ]),
};

export default FormikAutocomplete;
