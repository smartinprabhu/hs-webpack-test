import React from 'react';
import { TextField, FormHelperText } from '@mui/material';
import { useField } from 'formik';
import { at } from 'lodash';
import { Box } from '@mui/system';

const MuiTextField = (props) => {
  const {
    sx, name, showErrorDefault, setFieldValue, isRequired, onChange, customError, hideError, ...rest
  } = props;
  const [field, meta] = useField(props);

  function renderHelperText() {
    const [touched, error] = at(meta, 'touched', 'error');
    let errorValue = '';
    if (touched && error) {
      errorValue = error;
    }
    return errorValue;
  }

  return (
    <Box
      sx={sx}
    >
      <TextField
        fullWidth
        id={name}
        type={props.type ? props.type : 'text'}
        onChange={(e) => setFieldValue(name, e.target.value)}
        onKeyDown={(e) => {
          if (e.target.value.length === 0 && e.key === ' ') {
            e.preventDefault();
          }
        }}
        required={props.required || isRequired}
        variant="standard"
        {...rest}
        {...field}
        multiline={!!props.multiline}
        rows={props.rows ? props.rows : 1}
        maxRows={props.maxRows ? props.maxRows : 1}
        InputLabelProps={{ shrink: true }}
        placeholder={props.placeholder ? props.placeholder : ''}
      />
      {meta.touched && meta.error && !customError && !hideError && (
      <FormHelperText className="display-block mt-2 ml-0 mb-1">{renderHelperText()}</FormHelperText>
      )}
      {showErrorDefault && !(meta.touched && meta.error) && !customError && !hideError && (
      <FormHelperText className="display-block mt-2 ml-0 mb-1">{showErrorDefault}</FormHelperText>
      )}
      {customError && (
      <FormHelperText className="display-block mt-2 ml-0 mb-1">{customError}</FormHelperText>
      )}
    </Box>
  );
};
export default MuiTextField;
