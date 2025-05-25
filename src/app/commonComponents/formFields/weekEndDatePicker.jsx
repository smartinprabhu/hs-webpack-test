import React from 'react';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';

dayjs.extend(isoWeek);

const WeekEndDatePicker = ({
  editId, startDate, endDate, setEndDate,
}) => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <DemoContainer components={['DatePicker']} sx={{ overflow: 'hidden' }}>
      <DatePicker
        label="Select Week End Date"
        value={endDate}
        minDate={startDate ? dayjs(startDate).endOf('isoWeek') : dayjs().endOf('isoWeek')} // Ensure it's after start date
        maxDate={dayjs().add(365, 'day').endOf('isoWeek')} // Limit future selection
        disablePast
        disabled={!editId}
        format="DD/MM/YYYY" // Standard date format
        onChange={(date) => {
          const weekEnd = dayjs(date).endOf('isoWeek'); // Force to Sunday
          if (startDate && weekEnd.isBefore(startDate)) {
            alert('End date cannot be before the start date!');
            return;
          }
          setEndDate(weekEnd);
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

export default WeekEndDatePicker;
