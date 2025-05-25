import React from 'react';
import { at } from 'lodash';
import { useField } from 'formik';

import { FormHelperText, Box } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';

const MuiDateTimeField = (props) => {
  const {
    sx,
    setFieldValue,
    setFieldTouched,
    errorField,
    name,
    isErrorHandle,
    label,
    formatValue,
    type,
    isRequired,
    customError,
    hideError,
    defaultValue,
    disablePastDate,
    ...rest
  } = props;

  const [field, meta] = useField(props);

  const [error1, setError] = React.useState(false);
  const [currentView, setCurrentView] = React.useState('day');

  function onChange(date) {
    if (isErrorHandle) {
      setError('');
      setFieldValue(errorField, 'yes');
    }
    if (date) {
      setFieldValue(name, date);
    } else {
      setFieldValue(name, '');
    }
  }

  function onError(err) {
    if (isErrorHandle) {
      if (err) {
        setFieldValue(errorField, '');
        setError(err);
      } else {
        setFieldValue(errorField, 'yes');
        setError(err);
      }
    }
  }

  const errorMessage = React.useMemo(() => {
    switch (error1) {
      case 'maxDate': {
        return 'Please select a valid date time.';
      }
      case 'minDate': {
        return 'Please select a valid date time.';
      }
      case 'invalidDate': {
        return 'Invalid Date';
      }

      default: {
        return '';
      }
    }
  }, [error1]);

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
      <LocalizationProvider dateAdapter={AdapterDayjs} sx={{ width: '100%' }}>
        <DemoContainer components={['DatePicker']} sx={{ overflow: 'hidden', width: '100%' }}>
          <DatePicker
            sx={{ width: '100%' }}
            slotProps={isErrorHandle
              ? {
                actionBar: {
                  actions: ['accept'],
                },
                textField: { variant: 'standard', helperText: errorMessage },
              }
              : { textField: { variant: 'standard', helperText: errorMessage } }}
            name={name}
            label={`${label}${isRequired ? '*' : ''}`}
            onError={(newError) => onError(newError)}
            ampm={false}
            onChange={onChange}
            defaultValue={defaultValue}
            disablePast={!!disablePastDate}
            format={formatValue || 'DD/MM/YYYY'}
            {...rest}
            views={['year', 'month', 'day']}
          />
        </DemoContainer>
      </LocalizationProvider>
      {meta.touched && meta.error && !customError && !hideError && (
        <FormHelperText className="display-block mt-2 mb-1 ml-0">{renderHelperText()}</FormHelperText>
      )}
      {customError && (
        <FormHelperText className="display-block mt-2 mb-1 ml-0">{customError}</FormHelperText>
      )}
    </Box>
  );
};

export default MuiDateTimeField;
