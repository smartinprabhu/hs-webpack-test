import React, { useState } from 'react';
import { InputAdornment, FormHelperText, IconButton } from '@mui/material';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import { useField } from 'formik';
import { at } from 'lodash';
import { Box } from '@mui/system';
import { BsStars } from 'react-icons/bs';

import MuiTooltip from '@shared/muiTooltip';

import { AddThemeColor } from '../../themes/theme';
import { useTheme } from '../../ThemeContext';
import { htmlSanitizeInput } from '../../util/appUtils';
import AiText from '../../shared/aiText';

const MuiTextarea = (props) => {
  const {
    sx, name, isAI, setFieldValue, isRequired, label, onChange, customError, hideError, ...rest
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
      <label style={{ display: 'block' }} htmlFor="textarea">
        {`${label}`}
        {isRequired && ( <span className="text-danger ml-2px">*</span>)}
      </label>
      {!isAI && (

      <TextareaAutosize
        fullWidth
        name={name}
        style={{
          width: '-webkit-fill-available',
          borderRadius: '3px',
        }}
        onChange={(e) => setFieldValue(name, htmlSanitizeInput(e.target.value))}
        onKeyDown={(e) => setFieldValue(name, htmlSanitizeInput(e.target.value))}
        onPaste={(e) => preventPaste(e)}
        required={props.required || isRequired}
        variant="standard"
        {...rest}
        {...field}
        minRows={props.minRows ? props.minRows : 4}
        placeholder={props.placeholder ? props.placeholder : ''}
        id={name}
        aria-label="empty textarea"
      />

      )}
      {isAI && (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-end', // Align input with the icon
          position: 'relative',
          borderRadius: '4px',
          padding: '8px',
          width: '100%',
        }}
        onMouseLeave={() => setTextHover(false)}
        onMouseEnter={() => setTextHover(true)}
      >
        <TextareaAutosize
          fullWidth
          name={name}
          style={{
            width: '-webkit-fill-available',
            borderRadius: '3px',
          }}
          onChange={(e) => setFieldValue(name, htmlSanitizeInput(e.target.value))}
          onKeyDown={(e) => setFieldValue(name, htmlSanitizeInput(e.target.value))}
          onPaste={(e) => preventPaste(e)}
          required={props.required || isRequired}
          variant="standard"
          {...rest}
          {...field}
          minRows={props.minRows ? props.minRows : 4}
          placeholder={props.placeholder ? props.placeholder : ''}
          id={name}
          aria-label="empty textarea"
        />
        {isTextHover && (
        <InputAdornment position="end" sx={{ position: 'absolute', right: '8px', bottom: '24px' }}>
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
      </Box>
      )}
      {meta.touched && meta.error && !customError && !hideError && (
        <FormHelperText className="display-block mt-2 ml-0 mb-1">{renderHelperText()}</FormHelperText>
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
export default MuiTextarea;
