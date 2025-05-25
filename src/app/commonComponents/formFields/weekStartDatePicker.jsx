import React from 'react';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';

dayjs.extend(isoWeek);

const WeekStartDatePicker = ({ editId, endDate, startDate, setStartDate, isReadOnly }) => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <DemoContainer components={['DatePicker']} sx={{ overflow: 'hidden' }}>
      <DatePicker
        label="Select Week Start Date"
        value={startDate}
        minDate={dayjs()} // Prevent past dates
        maxDate={!editId ? dayjs().add(365, 'day') : dayjs(endDate).endOf('isoWeek')} // Limit future selection
        disablePast
        disabled={!!isReadOnly}
        format="DD/MM/YYYY" // Standard date format
        onChange={(date) => {
          const weekStart = dayjs(date).startOf('isoWeek'); // Force to Monday
          if (setStartDate) setStartDate(weekStart);
        }}
        slotProps={{
          actionBar: {
            actions: ['accept'],
          },
          popper: {
            modifiers: [
              {
                name: 'flip',
                options: {
                  fallbackPlacements: ['top'],
                },
              },
              {
                name: 'preventOverflow',
                options: {
                  boundary: 'window',
                  altAxis: true,
                },
              },
            ],
          },
          textField: {
            inputRef: (input) => {
              if (input) {
                input.setAttribute('readonly', 'true');
                input.onkeydown = (e) => e.preventDefault();
              }
            },
          },
        }}
      />
    </DemoContainer>
  </LocalizationProvider>
);

export default WeekStartDatePicker;
