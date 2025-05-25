import React from 'react';
import { TextField, FormHelperText } from '@mui/material';
import { Box } from '@mui/system';

const MuiNoFormTextField = (props) => {
  const {
    sx, name, setFieldValue, isRequired, label, onChange, customError, hideError, ...rest
  } = props;

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
        onChange={(e) => setFieldValue(name, e.target.value)}
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

      {customError && (
        <FormHelperText className="display-block mt-2 ml-0 mb-1">{customError}</FormHelperText>
      )}
    </Box>
  );
};
export default MuiNoFormTextField;
