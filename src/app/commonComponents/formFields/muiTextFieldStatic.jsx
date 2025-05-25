import React, { useState } from 'react';
import { TextField, FormHelperText } from '@mui/material';
import { Box } from '@mui/system';
import DOMPurify from 'dompurify';

const MuiTextFieldStatic = (props) => {
  const {
    sx, name, showErrorDefault, setFieldValue, isRequired, label, customError, ...rest
  } = props;

  const [touched, setTouched] = useState(false);
  const [error, setError] = useState('');

  return (
    <Box
      sx={sx}
    >
      <TextField
        fullWidth
        name={name}
        id={name}
        type={props.type ? props.type : 'text'}
        label={`${label}`}
        onChange={(e) => setFieldValue(DOMPurify.sanitize(e.target.value))}
        onFocus={() => setTouched(false)} // Reset touched when moving to another field
        onBlur={(e) => {
          setTouched(true);
          if (isRequired && !e.target.value.trim()) {
            setError(`${label} is required`);
          } else {
            setError('');
          }
        }}
        onKeyDown={(e) => {
          if (e.target.value.length === 0 && e.key === ' ') {
            e.preventDefault();
          }
        }}
        required={props.required || isRequired}
        variant="standard"
        {...rest}
        multiline={!!props.multiline}
        rows={props.rows ? props.rows : 1}
        maxRows={props.maxRows ? props.maxRows : 1}
        InputLabelProps={{ shrink: true }}
        placeholder={props.placeholder ? props.placeholder : ''}
      />
      {(customError || (touched && error)) && (
        <FormHelperText className="display-block mt-2 ml-0 mb-1">
          {customError || error}
        </FormHelperText>
      )}
    </Box>
  );
};
export default MuiTextFieldStatic;
