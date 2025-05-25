import React, { useState } from 'react';
import { Autocomplete, FormHelperText } from '@mui/material';
import { Box } from '@mui/system';

const MuiAutoCompleteStatic = (props) => {
  const {
    sx, label, name, multiple, value, loading, setValue, placeholder, labelClassName, formGroupClassName, apiError, isRequired, oldValue, customError, hideError, ...rest
  } = props;

  function onChange(e, data) {
    if (data) {
      setValue(data);
    } else {
      setValue('');
    }
  }

  const [touched, setTouched] = useState(false);
  const [error, setError] = useState('');

  console.log(value);

  return (
    <Box
      sx={sx}
    >
      <Autocomplete
        name={name}
        value={value}
        multiple={multiple || false}
        label={(
          <>
            {label}
            {' '}
            {isRequired && <span className="text-danger text-bold">*</span>}
          </>
        )}
        onBlur={() => {
          setTouched(true);
          if (isRequired && !value) {
            setError(`${label} is required`);
          }
        }}
        onFocus={() => setTouched(false)} // Reset touched on focus
        disableClearable={!(value) || props.disableClearable}
        placeholder={placeholder}
        onChange={onChange}
        required={!!(props.required || isRequired)}
        {...rest}
      />
      {(customError || (touched && error)) && (
        <FormHelperText className="display-block mt-2 mb-1 ml-0">
          {customError || error}
        </FormHelperText>
      )}
    </Box>
  );
};
export default MuiAutoCompleteStatic;
