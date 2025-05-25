import React from 'react';
import { useSelector } from 'react-redux';

import { Box } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import {
  getDateTimePickerFormat,
} from '../../util/appUtils';

const MuiDateTimeField = (props) => {
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
        <DemoContainer components={['DateTimePicker']} sx={{ overflow: 'hidden' }}>
          <DateTimePicker
            slotProps={{
              actionBar: {
                actions: ['clear', 'accept'],
              },
              textField: { variant: 'standard', InputLabelProps: { shrink: true } },
            }}
            ampm={false}
            timeSteps={{ hours: 1, minutes: 1, seconds: 1 }}
            format={getDateTimePickerFormat(userInfo, 'datetime')}
            {...rest}
            views={['day', 'hours', 'minutes', 'month', 'seconds', 'year']}
          />
        </DemoContainer>
      </LocalizationProvider>
    </Box>
  );
};

export default MuiDateTimeField;
