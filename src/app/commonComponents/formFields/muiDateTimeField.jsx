import React from 'react';
import { at } from 'lodash';
import { useField } from 'formik';
import dayjs from 'dayjs';

import { FormHelperText, Box } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
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
    noSeconds,
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
      const currentTime = dayjs(); // Get current time

      if (date.hour() === 0 && date.minute() === 0 && date.second() === 0) {
        // If only the date was picked without a time, set current time
        const selectedDate = date
          .set('hour', currentTime.hour())
          .set('minute', currentTime.minute())
          .set('second', currentTime.second());
        setFieldValue(name, selectedDate);
      } else {
        setFieldValue(name, date);
      }
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
      case 'minTime': {
        return 'Please select a valid date time.';
      }
      case 'maxTime': {
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
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={['DateTimePicker']} sx={{ overflow: 'hidden' }}>
          <DateTimePicker
            slotProps={isErrorHandle
              ? {
                actionBar: {
                  actions: ['accept'],
                },
                textField: {
                  variant: 'standard',
                  helperText: errorMessage,
                  inputRef: (input) => {
                    if (input) {
                      input.setAttribute('readonly', 'true');
                      input.onkeydown = (e) => e.preventDefault();
                    }
                  },
                },
              }
              : {
                textField: {
                  variant: 'standard',
                  helperText: errorMessage,
                  inputRef: (input) => {
                    if (input) {
                      input.setAttribute('readonly', 'true');
                      input.onkeydown = (e) => e.preventDefault();
                    }
                  },
                },
              }}
            name={name}
            label={(
              <>
                {label}
                {isRequired && <span className="ml-2px text-danger">*</span>}
              </>
            )}
            onError={(newError) => onError(newError)}
            ampm={false}
            onChange={onChange}
            defaultValue={defaultValue}
            disablePast={!!disablePastDate}
            timeSteps={{ hours: 1, minutes: 1, seconds: 1 }}
            format={formatValue || (noSeconds ? 'DD/MM/YYYY HH:mm' : 'DD/MM/YYYY HH:mm:ss')}
            {...rest}
            views={type && type === 'date' ? ['year', 'month', 'day'] : noSeconds ? ['year', 'month', 'day', 'hours', 'minutes'] : ['year', 'month', 'day', 'hours', 'minutes', 'seconds']}
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
