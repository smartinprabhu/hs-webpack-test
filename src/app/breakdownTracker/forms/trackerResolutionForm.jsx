/* eslint-disable camelcase */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable import/no-unresolved */
import { FormControl, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useFormikContext } from 'formik';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import moment from 'moment';
import dayjs from 'dayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { getDateTimeSeconds } from '../../util/appUtils';
import { AddThemeColor } from '../../themes/theme';
import MuiTextField from '../../commonComponents/formFields/muiTextField';
import { getClosureDuration } from '../breakdownService';

const TrackerResolutionForm = (props) => {
  const {
    editId,
    setFieldValue,
    setFieldTouched,
    incidentDateEdit,
    error,
    setError,
    formField: {
      expectedClosureDate,
      attendedOn,
      actionTaken,
      closedOn,
    },
  } = props;
  const { values: formValues } = useFormikContext();
  const {
    ciriticality, service_category_id, priority, closed_on, expexted_closure_date, attended_on, action_taken, incident_date,
  } = formValues;
  const { trackerDetails, btConfigInfo, closureDurationInfo } = useSelector((state) => state.breakdowntracker);
  const { userInfo } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const configData = btConfigInfo && btConfigInfo.data && btConfigInfo.data.length ? btConfigInfo.data[0] : false;
  const isClosureDateEdit = configData && configData.is_edit_expected_closure_date;
  const [selectedIncDate, setDateIncChange] = useState(incident_date ? dayjs(moment.utc(incident_date).local().tz(userInfo?.data?.timezone).format('YYYY-MM-DD HH:mm:ss')) : dayjs(moment(new Date()).tz(userInfo?.data?.timezone).format('YYYY-MM-DD HH:mm:ss')));

  const isCritical = configData && configData.criticality;

  const durationHours = closureDurationInfo && typeof closureDurationInfo.data === 'number' ? parseInt(closureDurationInfo.data) : -1;

  const [selectedDate, setDateChange] = useState(expexted_closure_date ? dayjs(moment.utc(expexted_closure_date).local().tz(userInfo?.data?.timezone).format('YYYY-MM-DD HH:mm:ss')) : null);
  const [selectedAttDate, setAttDateChange] = useState(attended_on ? dayjs(moment.utc(attended_on).local().tz(userInfo?.data?.timezone).format('YYYY-MM-DD HH:mm:ss')) : null);
  const [selectedCloseDate, setCloseDateChange] = useState(closed_on ? dayjs(moment.utc(closed_on).local().tz(userInfo?.data?.timezone).format('YYYY-MM-DD HH:mm:ss')) : null);

  const onActionChange = (data) => {
    setFieldValue('action_taken', DOMPurify.sanitize(data.target.value));
  };

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

  useEffect(() => {
    if (incidentDateEdit) {
      if (editId && isCritical && ((ciriticality !== '') || (priority && priority !== ''))) {
        const sName = service_category_id && service_category_id.name ? service_category_id.name : getOldData(service_category_id);
        const cName = ciriticality;
        const pName = priority;
        dispatch(getClosureDuration(cName, pName, sName));
      }
      if (editId && !isCritical && ((priority && priority !== ''))) {
        const sName = service_category_id && service_category_id.name ? service_category_id.name : getOldData(service_category_id);
        const cName = false;
        const pName = priority;
        dispatch(getClosureDuration(cName, pName, sName));
      }
      if (editId && isCritical && ((ciriticality && ciriticality.label) || (priority && priority.label))) {
        const sName = service_category_id && service_category_id.name ? service_category_id.name : getOldData(service_category_id);
        const cName = ciriticality && ciriticality.label ? ciriticality.label : ciriticality;
        const pName = priority && priority.label ? priority.label : priority;
        dispatch(getClosureDuration(cName, pName, sName));
      }
      if (editId && !isCritical && ((priority && priority.label))) {
        const sName = service_category_id && service_category_id.name ? service_category_id.name : getOldData(service_category_id);
        const cName = false;
        const pName = priority && priority.label ? priority.label : priority;
        dispatch(getClosureDuration(cName, pName, sName));
      }
    }
  }, [incidentDateEdit]);

  useEffect(() => {
    if (!editId && isCritical && ((ciriticality && ciriticality.label) || (priority && priority.label))) {
      const sName = service_category_id && service_category_id.name ? service_category_id.name : '';
      dispatch(getClosureDuration(ciriticality.label, priority.label, sName));
    }
    if (!editId && !isCritical && priority && priority.label) {
      const sName = service_category_id && service_category_id.name ? service_category_id.name : '';
      dispatch(getClosureDuration(false, priority.label, sName));
    }
  }, [ciriticality, service_category_id, priority]);

  const crValue = ciriticality && ciriticality.label ? ciriticality.label : ciriticality;
  const prValue = priority && priority.label ? priority.label : priority;

  /* useEffect(() => {
    if (!expexted_closure_date && editId && ((ciriticality && ciriticality.label) || ciriticality) && ((priority && priority.label) || priority)) {
      const sName = service_category_id && service_category_id.name ? service_category_id.name : getOldData(service_category_id);
      const cName = ciriticality && ciriticality.label ? ciriticality.label : ciriticality;
      const pName = priority && priority.label ? priority.label : priority;
      dispatch(getClosureDuration(cName, pName, sName));
    }
  }, [ciriticality, service_category_id, priority]); */

  useEffect(() => {
    if (editId && isCritical && ((ciriticality && ciriticality.label) || (priority && priority.label))) {
      const sName = service_category_id && service_category_id.name ? service_category_id.name : getOldData(service_category_id);
      const cName = ciriticality && ciriticality.label ? ciriticality.label : ciriticality;
      const pName = priority && priority.label ? priority.label : priority;
      dispatch(getClosureDuration(cName, pName, sName));
    }
    if (editId && !isCritical && ((priority && priority.label))) {
      const sName = service_category_id && service_category_id.name ? service_category_id.name : getOldData(service_category_id);
      const cName = false;
      const pName = priority && priority.label ? priority.label : priority;
      dispatch(getClosureDuration(cName, pName, sName));
    }
  }, [ciriticality, service_category_id, priority]);

  useEffect(() => {
    if (!editId) {
      if (incident_date && durationHours > 0) {
        const incDate = moment(new Date(incident_date)).format('YYYY-MM-DD HH:mm:ss');
        setFieldValue('expexted_closure_date', moment(incDate).add(durationHours, 'hours').format('YYYY-MM-DD HH:mm:ss'));
        setDateChange(dayjs(moment(incDate).add(durationHours, 'hours').format('YYYY-MM-DD HH:mm:ss')));
      } else if (incident_date && durationHours === 0) {
        setFieldValue('expexted_closure_date', false);
        setDateChange(null);
      } else if (!incident_date) {
        setFieldValue('expexted_closure_date', false);
        setDateChange(null);
      }
    }
  }, [editId, closureDurationInfo, incident_date]);

  useEffect(() => {
    if (editId) {
      if (incident_date && durationHours > 0) {
        const incDate = incidentDateEdit ? moment(new Date(incident_date)).format('YYYY-MM-DD HH:mm:ss') : moment.utc(incident_date).local().format('YYYY-MM-DD HH:mm:ss');
        setFieldValue('expexted_closure_date', moment(incDate).add(durationHours, 'hours').format('YYYY-MM-DD HH:mm:ss'));
        setDateChange(dayjs(moment(incDate).add(durationHours, 'hours').format('YYYY-MM-DD HH:mm:ss')));
      } else if (incident_date && durationHours === 0) {
        setFieldValue('expexted_closure_date', false);
        setDateChange(null);
      } else if (!incident_date) {
        setFieldValue('expexted_closure_date', false);
        setDateChange(null);
      }
    }
  }, [editId, closureDurationInfo, incident_date]);

  function getDifferece(date2) {
    const date1 = new Date();
    const Difference_In_Time = date2.getTime() - date1.getTime();
    const Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    return Difference_In_Days;
  }

  const handleDateChange = (date) => {
    setError(false);
    setDateChange(date);
    setFieldValue('expexted_closure_date', date);
  };

  const handleAttDateChange = (date) => {
    setAttDateChange(date);
    setFieldValue('attended_on', date);
  };

  const handleCloseDateChange = (date) => {
    setCloseDateChange(date);
    setFieldValue('closed_on', date);
  };

  const errorMessage = React.useMemo(() => {
    switch (error) {
      case 'minDate': {
        return 'Please select a date and time later than the incident date and time.';
      }
      case 'minTime': {
        return 'Please select a date and time later than the incident date and time.';
      }
      case 'invalidDate': {
        return 'Invalid Date';
      }

      default: {
        return '';
      }
    }
  }, [error]);

  const closeDateDisable = trackerDetails && trackerDetails.data && trackerDetails.data[0] && trackerDetails.data[0].state_id && trackerDetails.data[0].state_id.name === 'Closed';

  return (
    <Box
      sx={{
        width: '100%',
        marginTop: '20px',
      }}
    >
      <Typography
        sx={AddThemeColor({
          font: 'normal normal medium 20px/24px Suisse Intl',
          letterSpacing: '0.7px',
          fontWeight: 500,
        })}
      >
        Resolution Information
      </Typography>
      <Box
        sx={{
          width: '100%',
          alignItems: 'center',
          gap: '3%',
          flexWrap: 'wrap',
        }}
      >
        <FormControl
          sx={{
            marginTop: 'auto',
            marginBottom: '20px',
          }}
          variant="standard"
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DateTimePicker']}>
              <DateTimePicker
                minDateTime={incident_date && typeof incident_date === 'string' ? selectedIncDate : incident_date || selectedIncDate}
                sx={{ width: '95%' }}
                localeText={{ todayButtonLabel: 'Now' }}
                onError={(newError) => setError(newError)}
                slotProps={{
                  actionBar: {
                    actions: ['today', 'clear', 'accept'],
                  },
                  textField: { variant: 'standard', required: expectedClosureDate.required },
                }}
                disabled={!incident_date || (!isClosureDateEdit && durationHours > 0) || (!isClosureDateEdit && ((isCritical && !crValue) || !prValue))}
                name={expectedClosureDate.name}
                label={expectedClosureDate.label}
                value={selectedDate}
                onChange={handleDateChange}
                ampm={false}
              // disablePast
              />
            </DemoContainer>
            <span className="ml-1 text-danger">{errorMessage}</span>
          </LocalizationProvider>
        </FormControl>
        {/* <FormControl
          sx={{
            width: '30%',
            marginTop: 'auto',
            marginBottom: '20px',
          }}
          variant="standard"
        >
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DateTimePicker
              name={expectedClosureDate.name}
              label={expectedClosureDate.label}
              // disablePastDate
              // disableCustomEqual
              // disabledDateTime
              value={selectedDate}
              onChange={handleDateChange}
              minDate={incident_date}
              // shouldDisableDate={incident_date}
              defaultValue={expexted_closure_date ? new Date(getDateTimeSeconds(expexted_closure_date)) : ''}
              format="dd/MM/yyyy HH:mm:ss"
            />
          </MuiPickersUtilsProvider>
        </FormControl> */}
        {/* <DateTimeField
          name={expectedClosureDate.name}
          label={expectedClosureDate.label}
          isRequired={expectedClosureDate.required}
          setFieldValue={setFieldValue}
          setFieldTouched={setFieldTouched}
          placeholder={expectedClosureDate.label}
          customClassName="bg-input-blue-small"
          labelClassName="mb-1"
          formGroupClassName="mb-1"
          disablePastDate
          disableCustomEqual
          disabledDateTime
          startDate={incident_date}
          subnoofdays={incident_date ? getDifferece(new Date(incident_date)) : ''}
          defaultValue={expexted_closure_date ? new Date(getDateTimeSeconds(expexted_closure_date)) : ''}
        /> */}
        <FormControl
          sx={{
            marginTop: 'auto',
            marginBottom: '20px',
          }}
          variant="standard"
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DateTimePicker']}>
              <DateTimePicker
                sx={{ width: '95%' }}
                localeText={{ todayButtonLabel: 'Now' }}
                slotProps={{
                  actionBar: {
                    actions: ['today', 'clear', 'accept'],
                  },
                  textField: { variant: 'standard' },
                }}
                name={attendedOn.name}
                label={attendedOn.label}
                value={selectedAttDate}
                disablePast
                onChange={handleAttDateChange}
                ampm={false}
              />
            </DemoContainer>
          </LocalizationProvider>
        </FormControl>
        {/* <FormControl
          sx={{
            marginTop: 'auto',
            marginBottom: '20px',
          }}
          variant="standard"
        >
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DateTimePicker
              name={attendedOn.name}
              label={attendedOn.label}
              value={selectedAttDate}
              onChange={handleAttDateChange}
              minDate={moment(new Date(), 'dd/MM/yyyy HH:mm:ss')}
              defaultValue={attended_on ? new Date(getDateTimeSeconds(attended_on)) : null}
              ampm={false}
              format="dd/MM/yyyy HH:mm:ss"
            />
          </MuiPickersUtilsProvider>
        </FormControl> */}
        {/* <DateTimeField
          name={attendedOn.name}
          label={attendedOn.label}
          isRequired={attendedOn.required}
          setFieldValue={setFieldValue}
          setFieldTouched={setFieldTouched}
          placeholder={attendedOn.label}
          customClassName="bg-input-blue-small"
          labelClassName="mb-1"
          formGroupClassName="mb-1"
          disablePastDate
          defaultValue={attended_on ? new Date(getDateTimeSeconds(attended_on)) : ''}
        /> */}
        <MuiTextField
          sx={{
            marginBottom: '20px',
          }}
          name={actionTaken.name}
          label={actionTaken.label}
          setFieldValue={setFieldValue}
          value={action_taken}
          onChange={onActionChange}
          onBlur={onActionChange}
          type="textarea"
          multiline
          rows="1"
        />
        {/* <FormControl
          sx={{
            marginTop: "auto",
            marginBottom: "20px",
          }}
          variant="standard"
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DateTimePicker']}>
              <DateTimePicker
                sx={{ width: '95%' }}
                localeText={{ todayButtonLabel: 'Now' }}
                slotProps={{
                  actionBar: {
                    actions: ['today', 'clear'],
                  },
                  textField: { variant: 'standard', }
                }}
                name={closedOn.name}
                label={closedOn.label}
                value={selectedCloseDate}
                onChange={handleCloseDateChange}
                ampm={false}
                disablePast
              />
            </DemoContainer>
          </LocalizationProvider>
              </FormControl> */ }
        {/* <FormControl
          sx={{
            marginTop: 'auto',
            marginBottom: '20px',
          }}
          variant="standard"
        >
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DateTimePicker
              name={closedOn.name}
              label={closedOn.label}
              value={selectedCloseDate}
              onChange={handleCloseDateChange}
              minDate={moment(new Date(), 'dd/MM/yyyy HH:mm:ss')}
              defaultValue={closed_on ? new Date(getDateTimeSeconds(closed_on)) : null}
              ampm={false}
              shouldDisableDate={closeDateDisable}
              format="dd/MM/yyyy HH:mm:ss"
            />
          </MuiPickersUtilsProvider>
        </FormControl> */}
        {/* <DateTimeField
          name={closedOn.name}
          label={closedOn.label}
          isRequired={closedOn.required}
          setFieldValue={setFieldValue}
          setFieldTouched={setFieldTouched}
          placeholder={closedOn.label}
          customClassName="bg-input-blue-small"
          labelClassName="mb-1"
          disabled={closeDateDisable}
          formGroupClassName="mb-1"
          disablePastDate
          defaultValue={closed_on ? new Date(getDateTimeSeconds(closed_on)) : ''}
        /> */}
      </Box>
    </Box>
  );
};

TrackerResolutionForm.propTypes = {
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  setFieldTouched: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default TrackerResolutionForm;
