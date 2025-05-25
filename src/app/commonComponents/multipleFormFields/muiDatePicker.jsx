import React from 'react';
import { useSelector } from 'react-redux';

import { Box } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import {
  getDatePickerFormat,
} from '../../util/appUtils';

const AssetWarrantyForm = (props) => {
  const {
    sx,
    ...rest
  } = props;
  const { userInfo } = useSelector((state) => state.user);

  return (
    <Box
      sx={sx}
    >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={['DatePicker']} sx={{ overflow: 'hidden' }}>
          <DatePicker
            slotProps={{
              actionBar: {
                actions: ['clear', 'accept'],
              },
              textField: { variant: 'standard', error: false, InputLabelProps: { shrink: true } },
            }}
            format={getDatePickerFormat(userInfo, 'date')}
            className="ml-1 w-100"
            {...rest}
          />
        </DemoContainer>
      </LocalizationProvider>
    </Box>
  );
};

export default AssetWarrantyForm;
