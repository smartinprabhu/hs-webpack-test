/* eslint-disable radix */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/require-default-props */
/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';
import Box from '@mui/system/Box';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Dialog from '@mui/material/Dialog';
import FormLabel from '@mui/material/FormLabel';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@material-ui/core/TextField';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import {
  Col,
  Row,
} from 'reactstrap';

import DialogHeader from '../../commonComponents/dialogHeader';
import WeekStartDatePicker from '../../commonComponents/formFields/weekStartDatePicker';
import WeekEndDatePicker from '../../commonComponents/formFields/weekEndDatePicker';

import ViewEvents from './viewEvents';
import MuiAutoCompleteStatic from '../../commonComponents/formFields/muiAutocompleteStatic';
import { returnThemeColor } from '../../themes/theme';

const Summary = ({
  formValues, equipments, bulkEvents, spaces,
}) => {
  const addDueDays = (days) => {
    const result = new Date();
    result.setDate(result.getDate() + days);
    return result;
  };

  const [isBulkEvents, setViewBulkEvents] = useState(false);

  return (
    <Box
      sx={{
        width: '100%',
        height: '85%',
        overflow: 'auto',
        marginBottom: '30px',
      }}
    >
      <Box
        sx={{
          width: '100%',
          padding: '10px 0px 20px 30px',
          display: 'flex',
          borderTop: '1px solid #0000001f',
          gap: '30px',
        }}
      >

        <Box
          sx={{
            width: '60%',
            display: 'flex',
            gap: '35px',
          }}
        >

          <Box
            sx={{
              marginTop: '20px',
              width: '50%',
            }}
          >
            <Box
              sx={{
                marginTop: '20px',
              }}
            >
              <p style={{ color: returnThemeColor() }} className="font-family-tab font-weight-800">Maintenance Info</p>
              <MuiAutoCompleteStatic
                sx={{
                  marginTop: 'auto',
                  marginBottom: '10px',
                }}
                options={[]}
                name="year"
                label="Maintenance Year"
                open={false}
                value={formValues.year}
                disabled
                setValue={false}
                getOptionSelected={(option, value) => option.year === value.year}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.year)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    label="Maintenance Year"
                    className="without-padding"
                    placeholder="Select"
                  />
                )}
              />

              <MuiAutoCompleteStatic
                sx={{
                  marginTop: 'auto',
                  marginBottom: '10px',
                }}
                options={[]}
                name="performed_by"
                label="Performed By"
                open={false}
                disabled
                value={formValues.performed_by}
                setValue={false}
                getOptionSelected={(option, value) => option.label === value.label}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    label="Performed By"
                    className="without-padding"
                    placeholder="Select"
                  />
                )}
              />
              {formValues.performed_by === 'External' && (
              <MuiAutoCompleteStatic
                sx={{
                  marginTop: 'auto',
                  marginBottom: '10px',
                }}
                name="vendor_id"
                label="Vendor"
                open={false}
                disabled
                value={formValues.vendor_id && formValues.vendor_id.name ? formValues.vendor_id.name : ''}
                setValue={false}
                getOptionSelected={(option, value) => option.name === value.name}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                options={[]}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    label="Vendor"
                    className="without-padding"
                    placeholder="Select"
                  />
                )}
              />
              )}
              <MuiAutoCompleteStatic
                sx={{
                  marginTop: 'auto',
                  marginBottom: '10px',
                }}
                name="maintenance_team_id"
                label="Maintenance Team"
                open={false}
                disabled
                value={formValues.maintenance_team_id && formValues.maintenance_team_id.name ? formValues.maintenance_team_id.name : ''}
                setValue={false}
                getOptionSelected={(option, value) => option.name === value.name}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                options={[]}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    label="Maintenance Team"
                    className="without-padding"
                    placeholder="Select"
                  />
                )}
              />
              <MuiAutoCompleteStatic
                sx={{
                  marginTop: 'auto',
                  marginBottom: '10px',
                }}
                name="task_id"
                label="Maintenance Operation"
                open={false}
                value={formValues.task_id && formValues.task_id.name ? formValues.task_id.name : ''}
                setValue={false}
                disabled
                getOptionSelected={(option, value) => option.name === value.name}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                options={[]}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    label="Maintenance Operation"
                    className="without-padding"
                    placeholder="Select"
                  />
                )}
              />
              <Box
                sx={{
                  marginTop: '15px',
                  marginBottom: '10px',
                }}
              >
                <FormControl>
                  <FormLabel className="mb-2 mt-1 font-tiny line-height-small" id="demo-row-radio-buttons-group-label">Photo Required</FormLabel>
                  <FormGroup className="pl-2" aria-label="position" row>
                    <FormControlLabel
                      control={(
                        <Checkbox
                          checked={formValues.at_start_mro}
                          size="small"
                          className="p-0"
                          disabled
                        // onChange={(e) => handleCheckChange(e, 'at_start_mro')}
                          inputProps={{ 'aria-label': 'controlled' }}
                        />
              )}
                      label="At Start"
                    />
                    <FormControlLabel
                      control={(
                        <Checkbox
                          checked={formValues.at_done_mro}
                          size="small"
                          className="p-0"
                          disabled
                        // onChange={(e) => handleCheckChange(e, 'at_done_mro')}
                          inputProps={{ 'aria-label': 'controlled' }}
                        />
                   )}
                      label="At Complete"
                    />
                  </FormGroup>
                </FormControl>
              </Box>
              <Box
                sx={{
                  marginTop: 'auto',
                  marginBottom: '10px',
                }}
              >
                <FormControl>
                  <FormLabel className="mb-2 mt-1 font-tiny line-height-small" id="demo-row-radio-buttons-group-label">QR Scan Required</FormLabel>
                  <FormGroup className="pl-2" aria-label="position" row>
                    <FormControlLabel
                      control={(
                        <Checkbox
                          checked={formValues.qr_scan_at_start}
                          size="small"
                          className="p-0"
                          disabled
                        // onChange={(e) => handleCheckChange(e, 'qr_scan_at_start')}
                          inputProps={{ 'aria-label': 'controlled' }}
                        />
              )}
                      label="At Start"
                      labelPlacement="end"
                    />
                    <FormControlLabel
                      control={(
                        <Checkbox
                          checked={formValues.qr_scan_at_done}
                          size="small"
                          disabled
                          className="p-0"
                        // onChange={(e) => handleCheckChange(e, 'qr_scan_at_done')}
                          inputProps={{ 'aria-label': 'controlled' }}
                        />
                   )}
                      label="At Complete"
                      labelPlacement="end"
                    />
                  </FormGroup>
                </FormControl>
              </Box>
              <Box
                sx={{
                  marginTop: 'auto',
                  marginBottom: '10px',
                }}
              >
                <FormControl>
                  <FormLabel className="mb-2 mt-1 font-tiny line-height-small" id="demo-row-radio-buttons-group-label">Service Report</FormLabel>
                  <FormGroup className="pl-2" aria-label="position" row>
                    <FormControlLabel
                      control={(
                        <Checkbox
                          checked={formValues.is_service_report_required}
                          size="small"
                          className="p-0"
                          disabled
                       // onChange={(e) => handleCheckChange(e, 'is_service_report_required')}
                          inputProps={{ 'aria-label': 'controlled' }}
                        />
              )}
                      label="Is Required to Complete PPM"
                      labelPlacement="end"
                    />
                  </FormGroup>
                </FormControl>
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              marginTop: '20px',
              width: '50%',
            }}
          >
            <Box
              sx={{
                marginTop: '20px',
              }}
            >
              <p style={{ color: returnThemeColor() }} className="font-family-tab font-weight-800">Asset Info</p>
              <FormControl>
                <FormLabel className="mb-2 mt-1 font-tiny line-height-small" id="demo-row-radio-buttons-group-label">Type</FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  value={formValues.category_type}
                  disabled
                >
                  {formValues.category_type === 'e' && (
                  <FormControlLabel value="e" control={<Radio size="small" />} label="Equipment" />
                  )}
                  {formValues.category_type === 'ah' && (
                  <FormControlLabel value="ah" control={<Radio size="small" />} label="Space" />
                  )}
                </RadioGroup>
              </FormControl>
            </Box>
            <Box
              sx={{
                marginTop: 'auto',
                marginBottom: '10px',
              }}
            >
              <FormControl>
                <FormLabel className="mb-2 mt-1 font-tiny line-height-small" id="demo-row-radio-buttons-group-label">Configure PPM By</FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  value={formValues.ppm_by}
                  disabled
                >
                  {formValues.ppm_by === 'Space Category' && (
                  <FormControlLabel value="Space Category" control={<Radio size="small" />} label={formValues.category_type === 'ah' ? 'Space Category' : 'Equipment Category'} />
                  )}
                  {formValues.ppm_by === 'Checklist' && (
                  <FormControlLabel value="Checklist" control={<Radio size="small" />} label="Checklist" />
                  )}
                </RadioGroup>
              </FormControl>
            </Box>
            {formValues.ppm_by === 'Space Category' && (
            <MuiAutoCompleteStatic
              sx={{
                marginTop: 'auto',
                marginBottom: '10px',
              }}
              name="category_id"
              label={formValues.category_type === 'ah' ? 'Space Category' : 'Equipment Category'}
              open={false}
              disabled
              value={formValues.category_id && formValues.category_id.name ? formValues.category_id.name : ''}
              setValue={false}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={[]}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label={formValues.category_type === 'ah' ? 'Space Category' : 'Equipment Category'}
                  className="without-padding"
                  placeholder="Select"
                />
              )}
            />
            )}
            <Box
              sx={{
                marginTop: '20px',
              }}
            >
              <p style={{ color: returnThemeColor() }} className="font-family-tab font-weight-800">Schedule Info</p>
              <MuiAutoCompleteStatic
                sx={{
                  marginTop: 'auto',
                  marginBottom: '10px',
                }}
                name="schedule_period_id"
                label="Schedule Period"
                open={false}
                disabled
                value={formValues.schedule_period_id && formValues.schedule_period_id.name ? formValues.schedule_period_id.name : ''}
                setValue={false}
                getOptionSelected={(option, value) => option.name === value.name}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                options={[]}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    label="Scheduled Period"
                    className="without-padding"
                    placeholder="Select"
                  />
                )}
              />
              <Box
                sx={{
                  marginTop: '15px',
                  marginBottom: '10px',
                }}
              >
                <FormControl>
                  <FormGroup className="pl-2" aria-label="position" row>
                    <FormControlLabel
                      control={(
                        <Checkbox
                          checked={formValues.recurrency}
                          size="small"
                          className="p-0"
                          disabled
                        // onChange={(e) => handleCheckChange(e, 'recurrency')}
                          inputProps={{ 'aria-label': 'controlled' }}
                        />
              )}
                      label="Repeats"
                    />
                  </FormGroup>
                </FormControl>
              </Box>
              {formValues.recurrency && formValues.schedule_period_id && formValues.schedule_period_id.name === 'Monthly' && (
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  gap: '5px',
                }}
              >

                <MuiAutoCompleteStatic
                  sx={{
                    marginTop: 'auto',
                    marginBottom: '10px',
                    width: '30%',
                  }}
                  options={[]}
                  name="interval"
                  label="Every"
                  open={false}
                  disabled
                  value={formValues.interval ? formValues.interval.toString() : '0'}
                  setValue={false}
                  getOptionSelected={(option, value) => option.label === value.label}
                  getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      label="Every"
                      className="without-padding"
                      placeholder="Select"

                    />
                  )}
                />
                <MuiAutoCompleteStatic
                  sx={{
                    marginTop: 'auto',
                    marginBottom: '10px',
                    width: '40%',
                  }}
                  options={[]}
                  name="rrule_type"
                  label="Period"
                  open={false}
                  value="Months"
                  setValue={false}
                  disabled
                  getOptionSelected={(option, value) => option.label === value.label}
                  getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      label="Period"
                      className="without-padding"
                      placeholder="Select"

                    />
                  )}
                />
                <MuiAutoCompleteStatic
                  sx={{
                    marginTop: 'auto',
                    marginBottom: '10px',
                    width: '30%',
                  }}
                  options={[]}
                  name="weekno"
                  label="Week"
                  open={false}
                  disabled
                  value={formValues.weekno}
                  setValue={false}
                  getOptionSelected={(option, value) => option.label === value.label}
                  getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      label="Week"
                      className="without-padding"
                      placeholder="Select"

                    />
                  )}
                />
              </Box>
              )}
              {formValues.recurrency && (
              <Box sx={{
                width: '100%',
                display: 'flex',
                gap: '20px',
              }}
              >
                <Box sx={{
                  marginTop: 'auto',
                  marginBottom: '10px',
                  width: '70%',
                }}
                >
                  <WeekStartDatePicker startDate={formValues.starts_on} setStartDate={false} isReadOnly />
                </Box>
                <Box sx={{
                  marginTop: 'auto',
                  marginBottom: '10px',
                  width: '70%',
                }}
                >
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker']} sx={{ overflow: 'hidden' }}>
                      <DatePicker
                        minDate={dayjs(new Date())}
                        maxDate={dayjs(addDueDays(365))}
                        localeText={{ todayButtonLabel: 'Now' }}
                        slotProps={{
                          actionBar: {
                            actions: ['accept'],
                          },
                        }}
                        disablePast
                        disabled
                        name="Repeats Until"
                        label="Repeats Until"
                        format="DD/MM/YYYY"
                        value={formValues.deadline}
                        ampm={false}
                      />
                    </DemoContainer>
                  </LocalizationProvider>

                </Box>
              </Box>
              )}
              {!formValues.recurrency && (
              <Box sx={{
                width: '100%',
                display: 'flex',
                gap: '20px',
              }}
              >
                <Box sx={{
                  marginTop: 'auto',
                  marginBottom: '10px',
                  width: '70%',
                }}
                >
                  <WeekStartDatePicker startDate={formValues.starts_on} setStartDate={false} isReadOnly />
                </Box>
                <Box sx={{
                  marginTop: 'auto',
                  marginBottom: '10px',
                  width: '70%',
                }}
                >
                  <WeekEndDatePicker startDate={formValues.starts_on} endDate={formValues.ends_on} setEndDate={false} />
                </Box>
              </Box>
              )}
            </Box>
          </Box>

        </Box>
        <Box
          sx={{
            width: '35%',
          }}
          className="vertical-horizontal-center"
        >
          <Stack>
            <Alert severity="info">
              <AlertTitle className="font-family-tab font-weight-800">
                Information of the PPMs to be created.
                <br />
                Please find the details below
              </AlertTitle>
              <div className="p-3">
                <Row className="">
                  <Col sm="12" md="6" xs="12" lg="6">
                    <p className="font-family-tab mb-2">Number of Assets</p>
                  </Col>
                  <Col sm="12" md="6" xs="12" lg="6">
                    <p className="font-family-tab mb-0">{formValues.category_type === 'e' ? equipments.length : spaces && spaces.length > 0 ? spaces.length : 0}</p>
                  </Col>
                  <Col sm="12" md="6" xs="12" lg="6">
                    <p className="font-family-tab mb-2">Number of PPMs</p>
                  </Col>
                  <Col sm="12" md="6" xs="12" lg="6">
                    <p className="font-family-tab mb-0">
                      {formValues.recurrency && bulkEvents && bulkEvents.length > 0 ? bulkEvents.length : 1}
                      {formValues.recurrency && (
                      <span
                        aria-hidden
                        onClick={() => setViewBulkEvents(true)}
                        className="font-family-tab font-tiny ml-2 cursor-pointer text-info"
                      >
                        View
                      </span>
                      )}
                    </p>
                  </Col>
                </Row>
              </div>
              <p className="font-family-tab font-tiny font-weight-800 mb-0 text-danger">NB: Please do verify the details, as PPM would be created upon confirming it.</p>

            </Alert>
          </Stack>
          <Dialog size="lg" fullWidth open={isBulkEvents}>
            <DialogHeader title="View Events" onClose={() => { setViewBulkEvents(false); }} />
            <ViewEvents readOnly setFieldValue={false} events={bulkEvents && bulkEvents.length > 0 ? bulkEvents : []} onClose={() => { setViewBulkEvents(false); }} deadline={formValues.deadline} />
          </Dialog>
        </Box>
      </Box>
    </Box>
  );
};

export default Summary;
