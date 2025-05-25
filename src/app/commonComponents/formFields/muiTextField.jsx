import React, { useState } from 'react';
import { InputAdornment, TextField, FormHelperText, IconButton } from '@mui/material';
import { useField } from 'formik';
import { at } from 'lodash';
import { Box } from '@mui/system';
import { BsStars } from 'react-icons/bs';

import MuiTooltip from '@shared/muiTooltip';

import { AddThemeColor } from '../../themes/theme';
import { useTheme } from '../../ThemeContext';

import { htmlSanitizeInput } from '../../util/appUtils';
import AiText from '../../shared/aiText';

const MuiTextField = (props) => {
  const {
    sx, name, isAI, showErrorDefault, setFieldValue, isRequired, label, onChange, customError, hideError, ...rest
  } = props;
  const [field, meta] = useField(props);
  const { themes } = useTheme();

  const [aiModal, showAiModal] = useState(false);
  
    const [isTextHover, setTextHover] = React.useState(false);

  function renderHelperText() {
    const [touched, error] = at(meta, 'touched', 'error');
    let errorValue = '';
    if (touched && error) {
      errorValue = error;
    }
    return errorValue;
  }

  const preventPaste = (e) => {
    setTimeout(() => {
      setFieldValue(name, htmlSanitizeInput(e.target.value));
    }, 0);
  };

  const storeAiText = (val) => {
    setFieldValue(name, htmlSanitizeInput(val));
    showAiModal(false);
  };

  return (
    <Box
      sx={sx}
    >
      <TextField
        fullWidth
        name={name}
        id={name}
        type={props.type ? props.type : 'text'}
        label={(
          <>
            <span className="font-family-tab">{label}</span>
          </>
        )}
        onPaste={(e) => preventPaste(e)}
        onChange={(e) => setFieldValue(name, htmlSanitizeInput(e.target.value))}
        onKeyDown={(e) => {
          if (e.target.value.length === 0 && e.key === ' ') {
            e.preventDefault();
          } else {
            setFieldValue(name, htmlSanitizeInput(e.target.value));
          }
        }}
        onMouseLeave={() => setTextHover(false)}
        onMouseEnter={() => setTextHover(true)}
        required={props.required || isRequired}
        variant="standard"
        {...rest}
        {...field}
        multiline={!!props.multiline}
        rows={props.rows ? props.rows : 1}
        maxRows={props.maxRows ? props.maxRows : 1}
        InputLabelProps={{ shrink: true }}
        placeholder={props.placeholder ? props.placeholder : ''}
        InputProps={{
          ...(props.InputProps || {}), // Preserve existing InputProps if any
          endAdornment: (
            <>
              {props.InputProps?.endAdornment}
              {isAI && isTextHover && (
                <InputAdornment position="end">
                  <MuiTooltip title={props.value && props.value.length > 2 ? 'Refine with AI (Beta)' : ''}>
                    <IconButton
                      className={props.value && props.value.length > 2 ? 'cursor-pointer' : ''}
                      onClick={() => showAiModal(true)}
                      disabled={!(props.value && props.value.length > 2)}
                    >
                      <BsStars
                        size={20}
                        color={themes === 'light' ? '#000000' : (props.value && props.value.length > 2 ? AddThemeColor({}).color : 'rgb(117 123 121)')}
                        className="mb-1"
                      />
                    </IconButton>
                  </MuiTooltip>
                </InputAdornment>
              )}
            </>
          ),
        }}
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
      {aiModal && (
        <AiText actionModal={aiModal} subject={props.value} atCancel={() => showAiModal(false)} atFinish={storeAiText} />
      )}
    </Box>
  );
};
export default MuiTextField;
