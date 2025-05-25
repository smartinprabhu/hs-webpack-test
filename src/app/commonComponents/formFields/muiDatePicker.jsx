import React from 'react';
import { useSelector } from 'react-redux';
import { Box, FormHelperText } from '@mui/material';
import { useField } from 'formik';
import { at } from 'lodash';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { getDatePickerFormat } from '../../util/appUtils';

const AssetWarrantyForm = (props) => {
  const {
    sx, setFieldValue, setFieldTouched, validateField, name, ...rest
  } = props;
  const { userInfo } = useSelector((state) => state.user);
  const [field, meta] = useField(name); // 🛠 Correctly link to Formik field

  const onChange = (value) => {
    setFieldValue(name, value || ''); // Convert to ISO format
    setFieldTouched(name, true, false); // Ensure validation runs
    if (validateField) {
      validateField(name);
    }
  };

  function renderHelperText() {
    const [touched, error] = at(meta, 'touched', 'error');
    let errorValue = '';
    if (touched && error) {
      errorValue = error;
    }
    return errorValue;
  }

  return (
    <Box sx={sx}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={['DatePicker']} sx={{ overflow: 'hidden' }}>
          <DatePicker
            {...field}
            {...rest}
            value={field.value ? dayjs(field.value) : null}
            onChange={onChange}
            format={getDatePickerFormat(userInfo, 'date')}
            slotProps={{
              actionBar: {
                actions: ['clear', 'accept'],
              },
              textField: {
                variant: 'standard',
                error: false,
                InputLabelProps: { shrink: true },
              },
            }}
            className="ml-1 w-100"
          />
        </DemoContainer>
      </LocalizationProvider>
      {meta.touched && meta.error && (
      <FormHelperText className="display-block mt-2 mb-1 ml-0">{renderHelperText()}</FormHelperText>
      )}
    </Box>
  );
};

export default AssetWarrantyForm;
