/* eslint-disable radix */
/* eslint-disable react/prop-types */
/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import {
  Input,
  FormGroup,
  Label,
  Col,
  Row,
} from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import {
  FormHelperText,
} from '@material-ui/core';
import moment from 'moment';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import Box from '@mui/material/Box';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';

import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';

import {
  getHxActionDays, updateHxAudit,
} from '../../auditService';
import {
  getDateTimeUtcMuI,
  convertTimeToDecimal,
  detectMob,
  getAllowedCompanies,
  convertDecimalToTime,
} from '../../../util/appUtils';

const appModels = require('../../../util/appModels').default;

const AddEvent = React.memo(({
  auditId, lineId, auditData, editData, onClose, deleteId,
}) => {
  const [formValues, setFormValues] = useState({
    name: '',
    date: dayjs(new Date()),
    duration: 0,
    agenda: '',
    resources: '',
    notes: '',
  });

  const dispatch = useDispatch();

  const { hxAuditUpdate } = useSelector((state) => state.hxAudits);

  const { userInfo } = useSelector((state) => state.user);

  const companies = getAllowedCompanies(userInfo);

  useEffect(() => {
    if (lineId && editData.id) {
      const editValues = { ...editData };
      editValues.date = dayjs(moment(editData.date).utc().format('YYYY-MM-DD HH:mm:ss'));
      const durationString = convertDecimalToTime(editValues.duration);
      editValues.duration = durationString;
      setFormValues(editValues);
    }
  }, [lineId, editData]);

  const onDataChange = (e, field) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [field]: e.target.value,
    }));
  };

  const onDateChange = (value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      date: value,
    }));
  };

  function checkExDatehasObject(data) {
    let result = false;
    if (typeof data === 'object' && data !== null) {
      result = getDateTimeUtcMuI(data);
    } else {
      result = moment(data).utc().format('YYYY-MM-DD HH:mm:ss');
    }
    return result;
  }

  const createNC = () => {
    if (auditId) {
      const postData = { ...formValues };
      postData.date = formValues.date ? checkExDatehasObject(formValues.date) : false;
      postData.duration = formValues.duration ? convertTimeToDecimal(formValues.duration) : 0.00;
      let postDataValues = {
        audit_events_ids: [[lineId ? 1 : 0, lineId || 0, postData]],
      };
      if (deleteId) {
        postDataValues = {
          audit_events_ids: [[2, lineId, false]],
        };
      }
      dispatch(updateHxAudit(auditId, appModels.HXAUDIT, postDataValues));
    }
  };

  const handleKeyDown = (e) => {
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'];

    // Allow Numpad keys, Backspace, Delete, Tab, and arrow keys
    if (
      (e.code && e.code.startsWith('Numpad'))
      || allowedKeys.includes(e.key)
      || e.key === ':'
    ) {
      return;
    }

    // Prevent any non-numeric or non-colon input
    if (e.key < '0' || e.key > '9') {
      e.preventDefault();
    }
  };

  const handleChange = (e) => {
    const { value } = e.target;

    // Only allow numbers and one colon separator
    const validValue = value.replace(/[^0-9:]/g, '');

    // If there is a colon, ensure there's no more than one and it's in the correct place
    const [hours, minutes] = validValue.split(':');
    if (hours && (hours.length > 2 || +hours > 23)) return; // Hours should be 00-23
    if (minutes && (minutes.length > 2 || +minutes > 59)) return; // Minutes should be 00-59

    setFormValues((prevValues) => ({
      ...prevValues,
      duration: validValue,
    }));
  };

  const isMobileView = detectMob();

  const isDisable = !(formValues.name && formValues.date && formValues.agenda);

  return (
    <>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Box
            sx={{
              width: '100%',
              height: '100%',
              backgroundColor: '#F6F8FA',
              padding: isMobileView ? '5px' : '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10%',
              fontFamily: 'Suisse Intl',
            }}
          >
            {!deleteId && !(hxAuditUpdate && hxAuditUpdate.data) && !hxAuditUpdate.loading && (
            <Row>
              <Col xs={12} sm={12} md={12} lg={12} className="mb-2">
                <Label className="m-0">
                  Title
                  {' '}
                  <span className="text-danger">*</span>
                </Label>
                <Input
                  type="text"
                  name="name"
                  label="Action Taken"
                  placeholder="Opening Meeting"
                  value={formValues.name}
                  onChange={(e) => onDataChange(e, 'name')}
                  className="bg-whitered"
                />
              </Col>
              <Col md="12" xs="12" sm="12" lg="12" className="mb-2">
                <FormGroup className="m-0">
                  <Label className="m-0">
                    Event Date & Time
                    <span className="text-danger ml-1">*</span>
                  </Label>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DateTimePicker']}>
                      <DateTimePicker
                        minDateTime={dayjs(moment(auditData.planned_start_date).utc().format('YYYY-MM-DD HH:mm:ss'))}
                        sx={{ width: '100%', backgroundColor: 'white' }}
                        localeText={{ todayButtonLabel: 'Now' }}
                        timeSteps={{ hours: 1, minutes: 1 }}
                        slotProps={{
                          actionBar: {
                            actions: ['accept'],
                          },
                        }}
                        name="closed_on"
                        label=""
                        value={formValues.date}
                        onChange={onDateChange}
                        ampm={false}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </FormGroup>
              </Col>
              <Col xs={12} sm={12} md={12} lg={12} className="mb-2">
                <Label className="m-0">
                  Duration (HH:MM)
                  {' '}
                  <span className="text-danger">*</span>
                </Label>
                <Input
                  type="text"
                  name="Duration"
                  label="Duration"
                  value={formValues.duration}
                  onKeyDown={handleKeyDown}
                  onChange={handleChange}
                  maxLength="10"
                  placeholder="HH:MM"
                  className="bg-whitered"
                />
              </Col>
              <Col xs={12} sm={12} md={12} lg={12} className="mb-2">
                <Label className="m-0">
                  Agenda
                  {' '}
                  <span className="text-danger">*</span>
                </Label>
                <Input
                  type="text"
                  name="agenda"
                  label="agenda"
                  placeholder="Agenda"
                  value={formValues.agenda}
                  onChange={(e) => onDataChange(e, 'agenda')}
                  className="bg-whitered"
                />
              </Col>
              <Col xs={12} sm={12} md={12} lg={12} className="mb-2">
                <Label className="m-0">
                  Resources
                </Label>
                <Input
                  type="textarea"
                  name="Resources"
                  label="Resources"
                  placeholder="You may include the resources involved in the event"
                  value={formValues.resources}
                  onChange={(e) => onDataChange(e, 'resources')}
                  className="bg-whitered"
                  rows="4"
                />
              </Col>
              <Col xs={12} sm={12} md={12} lg={12} className="mb-2">
                <Label className="m-0">
                  Notes
                </Label>
                <Input
                  type="textarea"
                  name="notes"
                  label="notes"
                  placeholder="Notes"
                  value={formValues.notes}
                  onChange={(e) => onDataChange(e, 'notes')}
                  className="bg-whitered"
                  rows="4"
                />
              </Col>
            </Row>
            )}
            {deleteId && !(hxAuditUpdate && hxAuditUpdate.data) && !hxAuditUpdate.loading && (
            <Row>
              <Col xs={12} sm={12} md={12} lg={12} className="mb-2">
                <p className="font-family-tab text-center">
                  Are you sure, you want to delete
                  {' '}
                  {editData.name}
                </p>
              </Col>
            </Row>
            )}
            {hxAuditUpdate && hxAuditUpdate.loading && (
            <div className="text-center mt-3">
              <Loader />
            </div>
            )}
            {(hxAuditUpdate && hxAuditUpdate.err) && (
            <FormHelperText><span className="text-danger font-family-tab">Something went wrong..</span></FormHelperText>
            )}
            {hxAuditUpdate && hxAuditUpdate.data && !hxAuditUpdate.loading && (
            <SuccessAndErrorFormat response={hxAuditUpdate} successMessage={`The Audit Event ${lineId ? `${deleteId ? 'deleted' : 'updated'}` : 'added'} successfully.`} />
            )}
            <hr className="mb-0" />
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {!(hxAuditUpdate && hxAuditUpdate.data) && (
          <>
            <Button
              type="button"
              variant="contained"
              className="submit-btn"
              disabled={isDisable || (hxAuditUpdate && hxAuditUpdate.data) || hxAuditUpdate.loading}
              onClick={() => createNC()}
            >
              {lineId ? `${deleteId ? 'Yes' : 'Update'}` : 'Submit'}

            </Button>
            {deleteId && (
            <Button
              type="button"
              variant="contained"
              className="reset-btn"
              onClick={() => onClose()}
            >
              No

            </Button>
            )}
          </>
        )}
        {(hxAuditUpdate && hxAuditUpdate.data) && (
        <Button
          type="button"
          variant="contained"
          className="submit-btn"
          onClick={() => onClose()}
          disabled={hxAuditUpdate.loading}
        >
          OK
        </Button>
        )}
      </DialogActions>

    </>
  );
});

export default AddEvent;
