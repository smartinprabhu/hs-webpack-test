/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { Autocomplete } from '@material-ui/lab';
import { Label, FormFeedback, FormGroup } from 'reactstrap';

const FormikAutocomplete = (props) => {
  const {
    label, name, loading, setValue, value, placeholder, labelClassName, formGroupClassName, apiError, isRequired, oldValue, isShowError, ...rest
  } = props;

  function renderHelperText() {
    let errorValue = '';
    if (apiError) {
      errorValue = apiError;
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
    <FormGroup className={formGroupClassName || ''} error={apiError ? '1' : '0'}>
      <Label className={labelClassName || ''} for={name}>
        {label}
        {isRequired && (<span className="ml-1 text-danger">*</span>)}
      </Label>
      <Autocomplete
        disableClearable={!(value)}
        placeholder={placeholder}
        onChange={(e, data) => setValue(data)}
        className="bg-white"
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
