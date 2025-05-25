/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable max-len */
/* eslint-disable radix */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import {
  Col,
  Row,
  CardBody,
} from 'reactstrap';
import { Box } from '@mui/system';
import {
  Button,
  Dialog, DialogActions, DialogContent, DialogContentText,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import SuccessAndErrorFormat from '@shared/successAndErrorFormatMui';
import Loader from '@shared/loading';

import {
  getDateLocalMuI,
} from '../../util/appUtils';
import DialogHeader from '../../commonComponents/dialogHeader';
import { resumeInspection, resetResumeInspection } from '../../preventiveMaintenance/ppmService';

const appModels = require('../../util/appModels').default;

const InspectionCancelAllocation = ({
  actionModal, atCancel, startDate, endDate, setEndDate, targetDateRanges, setTargetDateRanges, originalDateRanges, detailedData, onToggle,
}) => {
  const [modal, setModal] = useState(actionModal);
  const { userInfo } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const { hxPpmCancelDetails, resumeInspectionInfo } = useSelector((state) => state.ppm);

  const toggleCancel = () => {
    dispatch(resetResumeInspection());
    setModal(!modal);
    onToggle();
  };

  // const onPlannedEndChange = (e) => {
  //   setHolidayEnd(e);
  // };

  const getChangedDateRanges = () => {
    const changedItems = targetDateRanges.reduce((acc, range, index) => {
      const original = originalDateRanges[index];
      if (!original || !dayjs(range.end).isSame(dayjs(original.end), 'day')) {
        acc.push({
          id: range.id,
          close_date: getDateLocalMuI(dayjs(range.end).subtract(1, 'day')),
        });
      }
      return acc;
    }, []);

    return [changedItems]; // wrap in array as per your required format
  };

  const onUpdate = () => {
    const changedDateRanges = getChangedDateRanges();
    const args = changedDateRanges && changedDateRanges.length > 0 ? changedDateRanges : '[]';
    dispatch(resumeInspection(detailedData.id, 'resume_hx_inspection_checklist', appModels.HXINSPECTIONCANCEL, args));
    // setModal(!modal);
    // atCancel();
  };

  const onClose = () => {
    dispatch(resetResumeInspection());
    setModal(!modal);
    atCancel();
  };

  const onReset = () => {
    setTargetDateRanges(originalDateRanges);
  };

  const isDateRangeChanged = () => {
    if (originalDateRanges.length !== targetDateRanges.length) return true;
    return targetDateRanges.some((range, index) => !dayjs(range.end).isSame(dayjs(originalDateRanges[index].end), 'day'));
  };

  const onPlannedEndChange = (newValue, index) => {
    setTargetDateRanges((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        end: newValue ? newValue.format('YYYY-MM-DD') : null,
      };
      return updated;
    });
  };


  const loading = (resumeInspectionInfo && resumeInspectionInfo.loading) ;

  return (

    <Dialog PaperProps={resumeInspectionInfo && resumeInspectionInfo.data ? { style: { width: '600px', maxWidth: '600px' } } : ''}   maxWidth="lg" minWidth="lg" open={actionModal}>
      <DialogHeader title="Resume Inspection Schedules" onClose={toggleCancel} />
      <DialogContent>
        {resumeInspectionInfo && resumeInspectionInfo.data
          ? (
            <DialogContentText id="alert-dialog-description">
              <Row className="justify-content-center font-family-tab">
                {resumeInspectionInfo && resumeInspectionInfo.data && !loading && (
                <SuccessAndErrorFormat response={resumeInspectionInfo} successMessage="The Inspection schedule  has been resumed successfully.." />
                )}
                {resumeInspectionInfo && resumeInspectionInfo.err && (
                <SuccessAndErrorFormat response={resumeInspectionInfo} />
                )}
                {loading && (
                <CardBody className="mt-4" data-testid="loading-case">
                  <Loader />
                </CardBody>
                )}
              </Row>
            </DialogContentText>
          ) : (
            <DialogContentText id="alert-dialog-description">
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10%',
                  fontFamily: 'Suisse Intl',
                }}
              >
                <Row className="ml-2 mr-2 mt-0">

                  <Col xs={12} sm={12} md={12} lg={12} className="mt-0 mb-1 col-auto">
                    <p className="font-family-tab">Select a date to resume the inspections from(Note: Inspections would be resumed from the selected day)</p>
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={1} className="mt-0 mb-1 col-auto">
                    <FormControl className="font-family-tab">
                      <FormLabel id="demo-row-radio-buttons-group-label" className="mb-1 font-weight-bold font-tiny">
                        Sl.No
                      </FormLabel>
                    </FormControl>
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={11} className="mt-0 mb-1 col-auto">
                    <FormControl className="font-family-tab">
                      <FormLabel id="demo-row-radio-buttons-group-label" className="mb-1 font-weight-bold font-tiny">
                        From Date
                        <span className="ml-1 text-danger font-weight-800"> * </span>
                      </FormLabel>
                    </FormControl>
                  </Col>
                  {targetDateRanges && targetDateRanges.length && targetDateRanges.map((range, index) => (
                    <>
                      <Col xs={12} sm={12} md={12} lg={1} className="mt-0 col-auto">
                        <div className="mt-2">
                          {index + 1}
                          {' '}
                          .
                        </div>
                      </Col>
                      <Col xs={12} sm={12} md={12} lg={11} className="mt-0 col-auto">
                        <FormControl className="font-family-tab">
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker']} sx={{ overflow: 'hidden' }}>
                              <DatePicker
                                minDate={dayjs(range.start)}
                                localeText={{ todayButtonLabel: 'Now' }}
                                slotProps={{
                                  actionBar: { actions: ['accept'] },
                                  popper: {
                                    modifiers: [
                                      { name: 'flip', options: { fallbackPlacements: ['top'] } },
                                      { name: 'preventOverflow', options: { boundary: 'window', altAxis: true } },
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
                                disablePast
                                name={`Start Date ${index + 1}`}
                                format="DD/MM/YYYY"
                                value={dayjs(range.end)}
                                onChange={(e) => onPlannedEndChange(e, index)} // pass index for handler
                                ampm={false}
                              />
                            </DemoContainer>
                          </LocalizationProvider>
                        </FormControl>
                      </Col>
                    </>
                  ))}
                </Row>
              </Box>
            </DialogContentText>
          )}
      </DialogContent>
      <DialogActions>
        {resumeInspectionInfo && resumeInspectionInfo.data
          ? (
            <Button
              type="button"
              variant="contained"
              className="submit-btn"
              onClick={() => onClose()}
            >
              Ok
            </Button>
          )
          : (
            <>
              <Button
                type="button"
                variant="contained"
                className="reset-btn-new1"
                onClick={() => onReset()}
              >
                Reset
              </Button>
              <Button
                type="button"
                variant="contained"
                className="submit-btn-auto"
                disabled={!isDateRangeChanged()}
                onClick={() => onUpdate()}
              >
                Resume
              </Button>
            </>
          )}
      </DialogActions>
    </Dialog>
  );
};

export default InspectionCancelAllocation;
