import React from 'react';
import {
  Button,
  FormControlLabel,
  FormGroup,
  Radio,
} from '@mui/material';
import Loader from '@shared/loading';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';

import dateFiltersFields from '@shared/data/filtersFields.json';

import MuiAccordion from './muiAccordian';

const DefaultFilters = ({
  onCloseFilters, onApplyFilters, handleFilterDateboxChange, handleFilterDateRangeChange, filterDateValue, dateValue, onDateRangeChange, filterDate, defaultItems, isDisabled, isLabelDisabled, selectedValue, handleCheckboxChange,
}) => (
  <>
    <div className="filter-drawer-box-custom">
      <MuiAccordion
        title={(
          <span>
            Predefined Filters
            <span className="text-danger ml-2px">*</span>
          </span>
  )}
        panel={`${'Panel'}99`}
      >
        <FormGroup>
          {defaultItems.data && defaultItems.data.length > 0 && defaultItems.data.map((tp, index) => (
            <FormControlLabel
              control={(
                <Radio
                  id={`checkboxstatefilter${tp.id}`}
                  value={tp.domain}
                  name={tp.name}
                  disabled={isLabelDisabled}
                  checked={selectedValue === tp.domain}
                  onChange={handleCheckboxChange}
                />
              )}
              label={tp.name}
            />
          ))}
          {defaultItems.loading && (
            <Loader />
          )}
        </FormGroup>
      </MuiAccordion>
      {selectedValue && (
        <MuiAccordion title="Date Filters (Optional)" panel={`${'Panel'}98`}>
          <FormGroup>
            {dateFiltersFields && dateFiltersFields.dateFilters.map((tp, index) => (
              <FormControlLabel
                control={(
                  <Radio
                    id={`checkboxstateaction${index}`}
                    value={tp.label}
                    name={tp.label}
                    disabled={isLabelDisabled}
                    checked={filterDate === tp.label}
                    onChange={handleFilterDateboxChange}
                  />
                )}
                label={tp.label}
              />
            ))}
            {filterDate === 'Custom' && (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DateRangePicker']}>
                  <DateRangePicker
                    localeText={{ start: 'Start Date', end: 'End Date' }}
                    onChange={handleFilterDateRangeChange}
                    value={filterDateValue}
                    format="DD-MM-YYYY"
                    slotProps={{
                      actionBar: {
                        actions: ['clear'],
                      },
                      textField: { variant: 'filled' },
                    }}
                  />
                </DemoContainer>
              </LocalizationProvider>
            )}
          </FormGroup>
        </MuiAccordion>
      )}
    </div>
    <div className="sticky-button-30drawer">
      <Button type="button" variant="outlined" className="mr-3" onClick={onCloseFilters}>
        Cancel
      </Button>
      <Button type="button" variant="contained" onClick={onApplyFilters} disabled={isDisabled}>
        Apply
      </Button>
    </div>
  </>
);

export default DefaultFilters;
