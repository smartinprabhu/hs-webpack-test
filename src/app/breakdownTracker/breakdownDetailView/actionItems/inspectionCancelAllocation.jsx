/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable max-len */
/* eslint-disable radix */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import {
  Col,
  Row,
} from 'reactstrap';
import { Box } from '@mui/system';
import {
  Button,
  Dialog, DialogActions, DialogContent, DialogContentText,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

import {
  getCompanyTimezoneDate,
} from '../../../util/appUtils';
import DialogHeader from '../../../commonComponents/dialogHeader';

const InspectionCancelAllocation = ({
  actionModal, atCancel, startDate, endDate, setEndDate,
}) => {
  const [modal, setModal] = useState(actionModal);
  const { userInfo } = useSelector((state) => state.user);

  const [holidayEnd, setHolidayEnd] = useState(dayjs(endDate));

  const toggleCancel = () => {
    setModal(!modal);
    atCancel();
  };

  const onPlannedEndChange = (e) => {
    setHolidayEnd(e);
  };

  const onUpdate = () => {
    setEndDate(holidayEnd);
    setModal(!modal);
    atCancel();
  };

  const onReset = () => {
    setEndDate(null);
    setHolidayEnd(null);
  };

  return (

    <Dialog maxWidth="lg" minWidth="lg" open={actionModal}>
      <DialogHeader title="Resume Inspection" onClose={toggleCancel} />
      <DialogContent>
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
              <Col xs={12} sm={12} md={3} lg={3} className="mt-0 col-auto">
                <FormControl className="font-family-tab">
                  <FormLabel id="demo-row-radio-buttons-group-label" className="mb-1 font-family-tab font-tiny">
                    From Date
                    <span className="ml-1 text-danger font-weight-800"> * </span>
                  </FormLabel>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker']} sx={{ overflow: 'hidden' }}>
                      <DatePicker
                        minDate={dayjs().add(1, 'day')}
                        maxDate={dayjs(endDate)}
                        localeText={{ todayButtonLabel: 'Now' }}
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
                        disablePast
                        name="Start Date"
                        format="DD/MM/YYYY"
                        value={dayjs(holidayEnd)}
                        onChange={(e) => onPlannedEndChange(e)}
                        ampm={false}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </FormControl>
              </Col>

            </Row>
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
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
          disabled={!holidayEnd}
          onClick={() => onUpdate()}
        >
          Update
        </Button>

      </DialogActions>
    </Dialog>
  );
};

export default InspectionCancelAllocation;
