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
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@material-ui/core/TextField';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';
import {
  Col,
  Row,
} from 'reactstrap';

import MuiDatePicker from '../../commonComponents/multipleFormFields/muiDatePicker';
import MuiAutoCompleteStatic from '../../commonComponents/formFields/muiAutocompleteStatic';
import { AddThemeColor, returnThemeColor } from '../../themes/theme';
import { infoValue } from '../../adminSetup/utils/utils';

const Summary = ({
  formValues, equipments, bulkEvents, spaces,
}) => {
  const addDueDays = (days) => {
    const result = new Date();
    result.setDate(result.getDate() + days);
    return result;
  };

  function getNoOfInspections(schedules, assets) {
    let res = 0;
    if (schedules && assets) {
      res = schedules * assets;
    }
    return res;
  }

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
          }}
        >
          <Box
            sx={{
              marginTop: '20px',
              width: '100%',
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
              width: '100%',
            }}
          >

            <FormControl>
              <FormLabel className="mb-2 mt-1 font-tiny line-height-small" id="demo-row-radio-buttons-group-label">Configure Inspection By</FormLabel>
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
          <Box
            sx={{
              marginTop: '20px',
              display: 'flex',
              gap: '35px',
              width: '100%',
              alignItems: 'center',
            }}
          >

            {formValues.ppm_by === 'Space Category' && (
            <MuiAutoCompleteStatic
              sx={{
                marginTop: 'auto',
                marginBottom: '10px',
                width: '100%',
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
            <MuiAutoCompleteStatic
              sx={{
                marginTop: 'auto',
                marginBottom: '10px',
                width: '100%',
              }}
              name="check_list_id"
              label="Checklist"
              open={false}
              value={formValues.check_list_id && formValues.check_list_id.name ? formValues.check_list_id.name : ''}
              setValue={false}
              disabled
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={[]}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label="Checklist"
                  className="without-padding"
                  placeholder="Select"
                />
              )}
            />
          </Box>
          <Box
            sx={{
              marginTop: '20px',
            }}
          >
            <p style={{ color: returnThemeColor() }} className="font-family-tab font-weight-800">Schedule Info</p>

          </Box>
          <Box
            sx={{
              marginTop: '20px',
              display: 'flex',
              gap: '35px',
              width: '100%',
              alignItems: 'center',
            }}
          >

            <Box
              sx={{
                marginTop: 'auto',
                marginBottom: '10px',
                width: '100%',
              }}
            >
              <MuiDatePicker
                label={(
                  <>
                    Commences On
                    <span className="text-danger ml-1">*</span>
                    {infoValue('commences_on')}
                  </>
                                      )}
                value={formValues.commences_on}
                disabled
              />
            </Box>

            <MuiAutoCompleteStatic
              sx={{
                marginTop: 'auto',
                marginBottom: '10px',
                width: '100%',
              }}
              name="schedule_period_id"
              label="Starts At"
              multiple
              open={false}
              disabled
              value={formValues.starts_at}
              setValue={false}
              isOptionEqualToValue={(option, value) => option.label === value.label}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
              options={[]}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label="Starts At"
                  className="without-padding"
                  placeholder="Select"
                />
              )}
            />
            <MuiAutoCompleteStatic
              sx={{
                marginTop: 'auto',
                marginBottom: '10px',
                width: '100%',
              }}
              name="schedule_period_id"
              label="Duration"
              open={false}
              disabled
              value={formValues.duration}
              setValue={false}
              isOptionEqualToValue={(option, value) => option.label === value.label}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
              options={[]}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label="Duration"
                  className="without-padding"
                  placeholder="Select"
                />
              )}
            />

          </Box>
          <Box
            sx={{
              marginTop: '20px',
              display: 'flex',
              gap: '35px',
              width: '100%',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                marginTop: 'auto',
                marginBottom: '10px',
                width: '100%',
              }}
            >
              <MuiDatePicker
                label={(
                  <>
                    Ends On
                    <span className="text-danger ml-1">*</span>
                    {infoValue('ends_on')}
                  </>
                                      )}
                value={formValues.ends_on}
                disabled
              />
            </Box>
            <Box
              sx={{
                marginTop: 'auto',
                marginBottom: '10px',
                width: '100%',
              }}
            >
              <TextField
                variant="standard"
                size="small"
                type="text"
                name="description"
                label={(
                  <>
                    Description
                    <span className="text-danger ml-1">*</span>
                    {infoValue('description_Ins')}
                  </>
                    )}
                className="bg-white"
                value={formValues.description}
                InputLabelProps={{ shrink: true }}
                disabled
              />
            </Box>
          </Box>
          <Box
            sx={{
              marginTop: '20px',
              display: 'flex',
              gap: '35px',
              width: '100%',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                marginTop: 'auto',
                marginBottom: '10px',
                width: '100%',
              }}
            >
              <Typography
                sx={AddThemeColor({
                  font: 'normal normal medium 20px/24px Suisse Intl',
                  letterSpacing: '0.7px',
                  fontWeight: 500,
                })}
              >
                Enable Time Tracking?
              </Typography>
              <FormControl>

                <FormGroup className="pl-2" aria-label="position" row>
                  <FormControlLabel
                    control={(
                      <Checkbox
                        checked={formValues.is_enable_time_tracking}
                        size="small"
                        className="p-0"
                        disabled
                        // onChange={(e) => handleCheckChange(e, 'qr_scan_at_start')}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
              )}
                    label="Enable Time Tracking"
                    labelPlacement="end"
                  />

                </FormGroup>
              </FormControl>
            </Box>
            {formValues.is_enable_time_tracking && (
              <>
                <Box
                  sx={{
                    marginTop: 'auto',
                    marginBottom: '10px',
                    width: '100%',
                  }}
                >
                  <TextField
                    variant="standard"
                    size="small"
                    type="text"
                    name="description"
                    label={(
                      <>
                        Min Duration
                        <span className="text-danger ml-1" />

                      </>
                    )}
                    className="bg-white"
                    value={formValues.min_duration}
                    InputLabelProps={{ shrink: true }}
                    disabled
                  />
                </Box>
                <Box
                  sx={{
                    marginTop: 'auto',
                    marginBottom: '10px',
                    width: '100%',
                  }}
                >
                  <TextField
                    variant="standard"
                    size="small"
                    type="text"
                    name="description"
                    label={(
                      <>
                        Max Duration
                        <span className="text-danger ml-1" />

                      </>
                    )}
                    className="bg-white"
                    value={formValues.max_duration}
                    InputLabelProps={{ shrink: true }}
                    disabled
                  />
                </Box>
              </>
            )}
          </Box>
          <Box
            sx={{
              marginTop: '20px',
              display: 'flex',
              gap: '35px',
              width: '100%',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                marginTop: '10px',
              }}
            >
              <p style={{ color: returnThemeColor() }} className="font-family-tab font-weight-800">Maintenance Info</p>

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

              <Box
                sx={{
                  marginTop: 'auto',
                  marginBottom: '10px',
                }}
              >
                <Typography
                  sx={AddThemeColor({
                    font: 'normal normal medium 20px/24px Suisse Intl',
                    letterSpacing: '0.7px',
                    fontWeight: 500,
                  })}
                >
                  Exclude Days
                </Typography>
                <FormControl>

                  <FormGroup className="pl-2" aria-label="position" row>
                    <FormControlLabel
                      control={(
                        <Checkbox
                          checked={formValues.mo}
                          size="small"
                          className="p-0"
                          disabled
                        // onChange={(e) => handleCheckChange(e, 'at_start_mro')}
                          inputProps={{ 'aria-label': 'controlled' }}
                        />
              )}
                      label="Mon"
                    />
                    <FormControlLabel
                      control={(
                        <Checkbox
                          checked={formValues.tu}
                          size="small"
                          className="p-0"
                          disabled
                        // onChange={(e) => handleCheckChange(e, 'at_done_mro')}
                          inputProps={{ 'aria-label': 'controlled' }}
                        />
                   )}
                      label="Tue"
                    />
                    <FormControlLabel
                      control={(
                        <Checkbox
                          checked={formValues.we}
                          size="small"
                          className="p-0"
                          disabled
                        // onChange={(e) => handleCheckChange(e, 'at_done_mro')}
                          inputProps={{ 'aria-label': 'controlled' }}
                        />
                   )}
                      label="Wed"
                    />
                    <FormControlLabel
                      control={(
                        <Checkbox
                          checked={formValues.th}
                          size="small"
                          className="p-0"
                          disabled
                        // onChange={(e) => handleCheckChange(e, 'at_done_mro')}
                          inputProps={{ 'aria-label': 'controlled' }}
                        />
                   )}
                      label="Thu"
                    />
                    <FormControlLabel
                      control={(
                        <Checkbox
                          checked={formValues.fr}
                          size="small"
                          className="p-0"
                          disabled
                        // onChange={(e) => handleCheckChange(e, 'at_done_mro')}
                          inputProps={{ 'aria-label': 'controlled' }}
                        />
                   )}
                      label="Fri"
                    />
                    <FormControlLabel
                      control={(
                        <Checkbox
                          checked={formValues.sa}
                          size="small"
                          className="p-0"
                          disabled
                        // onChange={(e) => handleCheckChange(e, 'at_done_mro')}
                          inputProps={{ 'aria-label': 'controlled' }}
                        />
                   )}
                      label="sat"
                    />
                    <FormControlLabel
                      control={(
                        <Checkbox
                          checked={formValues.su}
                          size="small"
                          className="p-0"
                          disabled
                        // onChange={(e) => handleCheckChange(e, 'at_done_mro')}
                          inputProps={{ 'aria-label': 'controlled' }}
                        />
                   )}
                      label="Sun"
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
                <Typography
                  sx={AddThemeColor({
                    font: 'normal normal medium 20px/24px Suisse Intl',
                    letterSpacing: '0.7px',
                    fontWeight: 500,
                  })}
                >
                  Capture Picture
                </Typography>
                <FormControl>

                  <FormGroup className="pl-2" aria-label="position" row>
                    <FormControlLabel
                      control={(
                        <Checkbox
                          checked={formValues.at_start_mro}
                          size="small"
                          className="p-0"
                          disabled
                        // onChange={(e) => handleCheckChange(e, 'qr_scan_at_start')}
                          inputProps={{ 'aria-label': 'controlled' }}
                        />
              )}
                      label="To Start"
                      labelPlacement="end"
                    />
                    <FormControlLabel
                      control={(
                        <Checkbox
                          checked={formValues.at_review_mro}
                          size="small"
                          disabled
                          className="p-0"
                        // onChange={(e) => handleCheckChange(e, 'qr_scan_at_done')}
                          inputProps={{ 'aria-label': 'controlled' }}
                        />
                   )}
                      label="To Review"
                      labelPlacement="end"
                    />
                    <FormControlLabel
                      control={(
                        <Checkbox
                          checked={formValues.at_done_mro}
                          size="small"
                          disabled
                          className="p-0"
                        // onChange={(e) => handleCheckChange(e, 'qr_scan_at_done')}
                          inputProps={{ 'aria-label': 'controlled' }}
                        />
                   )}
                      label="To Complete"
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
                <Typography
                  sx={AddThemeColor({
                    font: 'normal normal medium 20px/24px Suisse Intl',
                    letterSpacing: '0.7px',
                    fontWeight: 500,
                  })}
                >
                  Time Enforcement
                </Typography>
                <FormControl>

                  <FormGroup className="pl-2" aria-label="position" row>
                    <FormControlLabel
                      control={(
                        <Checkbox
                          checked={formValues.enforce_time}
                          size="small"
                          className="p-0"
                          disabled
                       // onChange={(e) => handleCheckChange(e, 'is_service_report_required')}
                          inputProps={{ 'aria-label': 'controlled' }}
                        />
              )}
                      label="Enforce Time"
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
                <Typography
                  sx={AddThemeColor({
                    font: 'normal normal medium 20px/24px Suisse Intl',
                    letterSpacing: '0.7px',
                    fontWeight: 500,
                  })}
                >
                  QR Scan
                </Typography>
                <FormControl>

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
                      label="To Start"
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
                      label="To Complete"
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
                <Typography
                  sx={AddThemeColor({
                    font: 'normal normal medium 20px/24px Suisse Intl',
                    letterSpacing: '0.7px',
                    fontWeight: 500,
                  })}
                >
                  NFC
                </Typography>
                <FormControl>

                  <FormGroup className="pl-2" aria-label="position" row>
                    <FormControlLabel
                      control={(
                        <Checkbox
                          checked={formValues.nfc_scan_at_start}
                          size="small"
                          className="p-0"
                          disabled
                        // onChange={(e) => handleCheckChange(e, 'qr_scan_at_start')}
                          inputProps={{ 'aria-label': 'controlled' }}
                        />
              )}
                      label="To Start"
                      labelPlacement="end"
                    />
                    <FormControlLabel
                      control={(
                        <Checkbox
                          checked={formValues.nfc_scan_at_done}
                          size="small"
                          disabled
                          className="p-0"
                        // onChange={(e) => handleCheckChange(e, 'qr_scan_at_done')}
                          inputProps={{ 'aria-label': 'controlled' }}
                        />
                   )}
                      label="To Complete"
                      labelPlacement="end"
                    />
                  </FormGroup>
                </FormControl>
              </Box>
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
                Information of the Inspections to be created.
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
                    <p className="font-family-tab mb-2">Number of Inspections</p>
                  </Col>
                  <Col sm="12" md="6" xs="12" lg="6">
                    <p className="font-family-tab mb-0">{getNoOfInspections(formValues.starts_at && formValues.starts_at.length, formValues.category_type === 'e' ? equipments.length : spaces && spaces.length > 0 ? spaces.length : 0)}</p>
                  </Col>
                </Row>
              </div>
              <p className="font-family-tab font-tiny font-weight-800 mb-0 text-danger">NB: Please do verify the details, as Inspection would be created upon confirming it.</p>

            </Alert>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default Summary;
