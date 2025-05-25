import React from 'react';
import { Autocomplete, FormHelperText } from '@mui/material';
import { useField } from 'formik';
import { at } from 'lodash';
import { Box } from '@mui/system';

const MuiAutoComplete = (props) => {
  const {
    sx, label, name, loading, filterOptions, customMessage, customMessageContent, placeholder, labelClassName, formGroupClassName, apiError, isRequired, oldValue, customError, hideError, ...rest
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
    <Box
      sx={sx}
    >
      <Autocomplete
        {...field}
          label={
    <>
      {label}
      {isRequired && <span className="ml-2px text-danger">*</span>}
    </>
  }
        disableClearable={!(value) || props.disableClearable}
        placeholder={placeholder}
        onChange={onChange}
        filterOptions={filterOptions || undefined}
        onBlur={() => setTouched(name, true)}
        {...rest}
        required={!!(props.required || isRequired)}
      />
      {meta.touched && meta.error && !customError && !hideError && (
        <FormHelperText className="display-block mt-2 mb-1 ml-0">{renderHelperText()}</FormHelperText>
      )}
      {customError && (
        <FormHelperText className="display-block mt-2 mb-1 ml-0">{customError}</FormHelperText>
      )}
      {customMessage && (
      <FormHelperText className="display-block mt-2 mb-1 ml-0">{customMessageContent}</FormHelperText>
      )}
    </Box>
  );
};
export default MuiAutoComplete;
