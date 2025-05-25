/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable max-len */
/* eslint-disable radix */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  Col,
  Row,
  Input,
  Label,
} from 'reactstrap';
import { Box } from '@mui/system';
import {
  Button,
  Typography,
  Dialog, DialogActions, DialogContent, FormControl, DialogContentText,
} from '@mui/material';
import * as PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux'; 
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import updateLocale from 'dayjs/plugin/updateLocale';
import isoWeek from 'dayjs/plugin/isoWeek';
import moment from 'moment-timezone';
import { DatePicker } from 'antd'; 

import workOrdersBlue from '@images/icons/workOrders.svg';
import SuccessAndErrorFormat from '@shared/successAndErrorFormatMui';
import Loader from '@shared/loading';

import {
  getDefaultNoValue, extractNameObject,
  getAllowedCompanies, getCompanyTimezoneDate,
  getDateLocalMuI, getCompanyTimezoneDateLocal,
  isValidValue,
} from '../../../util/appUtils';
import {
  getPPMDetail,
} from '../../../inspectionSchedule/inspectionService';
import { updateProductCategory } from '../../../pantryManagement/pantryService';
import DialogHeader from '../../../commonComponents/dialogHeader';

dayjs.extend(updateLocale);

// Set week start from Monday (1) to Sunday
dayjs.updateLocale('en', {
  weekStart: 1,
});

dayjs.extend(isoWeek);

const appModels = require('../../../util/appModels').default;

const PrepostPonePPM = (props) => {
  const {
    detailData, actionModal, canPostPreponePast, atFinish, atCancel,
  } = props;
  const dispatch = useDispatch();
  const [modal, setModal] = useState(actionModal);

  const [messageTicket, setMessageTicket] = useState('');

  const [timeoutLoading, setTimeoutLoading] = useState(false);

  const onMessageChange = (e) => {
    setMessageTicket(e.target?.value?.trimStart() || '');
  };

  const { updateProductCategoryInfo } = useSelector((state) => state.pantry);

  const {
    ppmSettingsInfo,
  } = useSelector((state) => state.site);

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);

  const configData = ppmSettingsInfo && ppmSettingsInfo.data && ppmSettingsInfo.data.length ? ppmSettingsInfo.data[0] : false;

  const [requestStartDate, setRequestStartDate] = useState(null);

  const [requestEndDate, setRequestEndDate] = useState(null);

  function checkExDatehasObject(data) {
    let result = false;
    if (typeof data === 'object' && data !== null) {
      result = getDateLocalMuI(data);
    } else {
      result = moment(data).format('YYYY-MM-DD');
    }
    return result;
  }

  const toggle = () => {
    if (updateProductCategoryInfo && updateProductCategoryInfo.data) {
      dispatch(getPPMDetail(companies, appModels.PPMWEEK, detailData.id));
    }
    atFinish();
  };

  const toggleCancel = () => {
    setModal(!modal);
    atCancel();
  };

  const addDays = (days) => {
    const date = requestStartDate;
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  const loading = (updateProductCategoryInfo && updateProductCategoryInfo.loading) || timeoutLoading;

  function checkChanges() {
    let res = 'none';
    if (detailData && detailData.starts_on) {
      const oldStart = dayjs(moment.utc(detailData.starts_on).local().tz(userInfo?.data?.timezone).format('YYYY-MM-DD'));
      const oldEnd = dayjs(moment.utc(detailData.ends_on).local().tz(userInfo?.data?.timezone).format('YYYY-MM-DD'));
      const newStart = dayjs(requestStartDate);
      const newEnd = dayjs(requestEndDate);
      if (oldStart.valueOf() > newStart.valueOf() && oldEnd.valueOf() > newEnd.valueOf()) {
        res = 'prepone';
      } else if (oldStart.valueOf() > newStart.valueOf() && oldEnd.valueOf() < newEnd.valueOf()) {
        res = 'prepone';
      } else if (oldStart.valueOf() < newStart.valueOf() && oldEnd.valueOf() < newEnd.valueOf()) {
        res = 'postpone';
      } else if (oldStart.valueOf() < newStart.valueOf() && oldEnd.valueOf() > newEnd.valueOf()) {
        res = 'postpone';
      } else if (oldStart.valueOf() !== newStart.valueOf()) {
        res = 'prepone';
      } else if (oldEnd.valueOf() !== newEnd.valueOf()) {
        res = 'postpone';
      }
    }

    return res;
  }

  function isPastSchedule() {
    let res = false;
    if (requestEndDate && (new Date() > new Date(requestEndDate))) {
      res = true;
    }
    return res;
  }

  function isInvalidSchedule() {
    let res = false;
    if (requestStartDate && requestEndDate && (new Date(requestStartDate) > new Date(requestEndDate))) {
      res = true;
    }
    return res;
  }

  function isApprovalRequires() {
    let res = false;
    const isConfigReq = configData && configData.approval_required_for_postpone;
    const exceptionDays = configData && configData.exception_for_approval_lead_days;
    const oldStart = dayjs(moment.utc(detailData.starts_on).local().tz(userInfo?.data?.timezone).format('YYYY-MM-DD'));
    // const oldEnd = dayjs(moment.utc(detailData.planned_end_date).local().tz(userInfo?.data?.timezone).format('YYYY-MM-DD HH:mm:ss'));
    if (isConfigReq) {
      const reqVsPlannedStartDiff = Math.abs(Math.floor((new Date() - new Date(oldStart)) / (1000 * 60 * 60 * 24)));
      if (parseInt(reqVsPlannedStartDiff) > parseInt(exceptionDays)) {
        const reqVsReqStartDiff = Math.abs(Math.floor((new Date() - new Date(requestStartDate)) / (1000 * 60 * 60 * 24)));
        if (parseInt(reqVsReqStartDiff) > parseInt(exceptionDays)) {
          res = false;
        } else {
          res = true;
        }
      } else if (parseInt(reqVsPlannedStartDiff) <= parseInt(exceptionDays)) {
        res = true;
      }
    }
    return res;
  }

  const onRequestStartChange = (val) => {
    setRequestStartDate(val);
  };

  const onRequestEndChange = (val) => {
    setRequestEndDate(val);
  };

  const disabledDate = (current) => {
    if (!current) return false; // Ensure current is valid

    const todayWeek = dayjs().isoWeek(); // Get current week number
    const selectedWeek = current.isoWeek(); // Get selected week number

    return selectedWeek < todayWeek; // Disable weeks before the current week
  };

  const onChange = (date, dateString) => {
    if (date) {
      // Extract the correct week number and year
      const selectedYear = date.year();
      const selectedWeek = date.isoWeek();

      // Get the start (Monday) and end (Sunday) of the selected week
      const startOfWeek = dayjs().year(selectedYear).isoWeek(selectedWeek).startOf('isoWeek');
      const endOfWeek = startOfWeek.add(6, 'day'); // Add 6 days to get Sunday

      console.log('Start of week (Monday):', startOfWeek.format('YYYY-MM-DD'));
      console.log('End of week (Sunday):', endOfWeek.format('YYYY-MM-DD'));
      setRequestStartDate(startOfWeek.format('YYYY-MM-DD'));
      setRequestEndDate(endOfWeek.format('YYYY-MM-DD'));
    }
  };

  const handleStateChange = async (id) => {
    if (isApprovalRequires()) {
      const dates = { proposed_start_date: checkExDatehasObject(requestStartDate), proposed_end_date: checkExDatehasObject(requestEndDate) };
      const payload = {
        requested_on: moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss'),
        remarks: messageTicket,
        requested_by_id: userInfo && userInfo.data && userInfo.data.id,
        data: JSON.stringify(dates),
        approval_authority_id: configData && configData.approval_authority && configData.approval_authority.id ? configData.approval_authority.id : false,
        expires_on: checkExDatehasObject(requestEndDate),
        state: 'Pending',
      };

      const postDataValues = {
        prepone_postpone_approval_ids: [[0, 0, payload]],
        // is_pending_for_approval: true,
      };

      try {
        dispatch(updateProductCategory(id, 'ppm.scheduler_week', postDataValues));
      } catch (error) {
        console.error('Error updating reason or changing state:', error);
      } finally {
        // Set loading to false once everything is complete
        setTimeoutLoading(false);
      }
    } else {
      const dates = { proposed_start_date: checkExDatehasObject(requestStartDate), proposed_end_date: checkExDatehasObject(requestEndDate) };
      const payload = {
        requested_on: moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss'),
        remarks: messageTicket,
        requested_by_id: userInfo && userInfo.data && userInfo.data.id,
        data: JSON.stringify(dates),
        // approval_authority_id: configData && configData.approval_authority && configData.approval_authority.id ? configData.approval_authority.id : false,
        expires_on: checkExDatehasObject(requestEndDate),
        state: 'Approved',
        approved_on: moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss'),
        approved_by_id: userInfo && userInfo.data && userInfo.data.id,
      };

      const postDataValues = {
        prepone_postpone_approval_ids: [[0, 0, payload]],
        // is_pending_for_approval: true,
      };
      try {
        dispatch(updateProductCategory(id, 'ppm.scheduler_week', postDataValues));
      } catch (error) {
        console.error('Error updating reason or changing state:', error);
      } finally {
        // Set loading to false once everything is complete
        setTimeoutLoading(false);
      }
    }
  };

  return (

    <Dialog PaperProps={{ style: { width: '600px', maxWidth: '600px' } }} open={actionModal}>
      <DialogHeader title={`Prepone/Postpone PPM ${isApprovalRequires() ? 'Request' : ''}`} onClose={toggleCancel} response={updateProductCategoryInfo} />
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Box
            sx={{
              width: '100%',
              height: '100%',
              backgroundColor: '#F6F8FA',
              padding: '10px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10%',
              fontFamily: 'Suisse Intl',
            }}
          >
            <Card className="border-5 mt-0 ml-4 mb-2 mr-4 border-secondary rounded-0 border-top-0 border-right-0 border-bottom-0">
              {detailData && (
                <CardBody data-testid="success-case" className="bg-lightblue p-3">
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                    <img src={workOrdersBlue} alt="asset" width="40" height="35" style={{ alignSelf: 'flex-start' }} />
                    <Box>
                      <Typography variant="h6" sx={{ fontSize: '1rem' }} className="mb-1">
                        {getDefaultNoValue(detailData.name)}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" className="font-family-tab">
                        <span className="font-weight-800 font-family-tab font-side-heading mr-1">Asset: </span>
                        {getDefaultNoValue(detailData.asset_name)}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" className="font-family-tab">
                        <span className="font-weight-800 font-family-tab font-side-heading mr-1">Maintenance Team: </span>
                        {getDefaultNoValue(detailData.maintenance_team_name)}
                      </Typography>
                    </Box>
                  </Box>
                </CardBody>
              )}
            </Card>
            {updateProductCategoryInfo && !updateProductCategoryInfo.data && !loading && (
            <>
              <Row className="ml-3 mr-2 mt-0">
                <Col xs={12} sm={12} md={6} lg={6} className="col-auto">
                  <Label className="mt-0 font-family-tab font-tiny font-weight-400">
                    Planned Start Date
                    {' '}
                    <span className="ml-1 text-danger" />
                  </Label>
                  <p className="font-family-tab">{getDefaultNoValue(getCompanyTimezoneDate(detailData.starts_on, userInfo, 'date'))}</p>
                </Col>
                <Col xs={12} sm={12} md={6} lg={6} className="col-auto">
                  <Label className="mt-0 font-family-tab font-tiny font-weight-400">
                    Planned End Date
                    {' '}
                    <span className="ml-1 text-danger" />
                  </Label>
                  <p className="font-family-tab">{getDefaultNoValue(getCompanyTimezoneDate(detailData.ends_on, userInfo, 'date'))}</p>
                </Col>
              </Row>
              <Row className="ml-3 mr-2 mt-0">
                <Col xs={12} sm={12} md={6} lg={6} className="col-auto">
                  <Label className="mt-0 font-family-tab font-tiny font-weight-400">
                    Planned Week No
                    {' '}
                    <span className="ml-1 text-danger" />
                  </Label>
                  <p className="font-family-tab">{getDefaultNoValue(detailData.week)}</p>
                </Col>
                <Col xs={6} sm={6} md={6} lg={6} className="col-auto">
                  <Label className="mt-0 font-family-tab font-tiny font-weight-400">
                    Select Week to Prepone/Postpone
                    {' '}
                    <span className="ml-1 text-danger font-weight-800"> * </span>
                  </Label>
                  <Box
                    sx={{
                      width: '100%',
                    }}
                  >
                    <FormControl>
                      <DatePicker onChange={onChange} allowClear={false} disabledDate={disabledDate} picker="week" />
                    </FormControl>
                  </Box>
                </Col>
                {requestStartDate && requestStartDate && (
                <>
                  <Col xs={12} sm={12} md={6} lg={6} className="col-auto">
                    <Label className="mt-0 font-family-tab font-tiny font-weight-400">
                      Request Start Date
                      {' '}
                      <span className="ml-1 text-danger" />
                    </Label>
                    <p className="font-family-tab">{getDefaultNoValue(getCompanyTimezoneDateLocal(requestStartDate, userInfo, 'date'))}</p>
                  </Col>
                  <Col xs={12} sm={12} md={6} lg={6} className="col-auto">
                    <Label className="mt-0 font-family-tab font-tiny font-weight-400">
                      Request End Date
                      {' '}
                      <span className="ml-1 text-danger" />
                    </Label>
                    <p className="font-family-tab">{getDefaultNoValue(getCompanyTimezoneDateLocal(requestEndDate, userInfo, 'date'))}</p>
                  </Col>
                </>
                )}

                { /* <Col xs={12} sm={12} md={6} lg={6} className="col-auto">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker']} sx={{ overflow: 'hidden' }}>
                      <DatePicker
                        minDate={canPostPreponePast ? null : dayjs().startOf('isoWeek')} // Prevent past dates
                        maxDate={requestEndDate ? dayjs(requestEndDate) : dayjs().endOf('isoWeek')} // Limit future selection
                        localeText={{ todayButtonLabel: 'Now' }}
                        shouldDisableDate={(date) => {
                          const dayOfWeek = dayjs(date).day();
                          return !(dayOfWeek === 1); // Only allow Monday (1) and Sunday (0)
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
                        }}
                        disablePast={!canPostPreponePast}
                        name="Request Start Date"
                        label="Request Start Date"
                        format="DD/MM/YYYY"
                        value={dayjs(requestStartDate)}
                        onChange={(date) => {
                          if (date) {
                            const today = dayjs().startOf('day'); // Today's date at 00:00
                            let weekStart = dayjs(date).startOf('isoWeek'); // Get Monday of selected week
                            let weekEnd = dayjs(date).endOf('isoWeek'); // Get Sunday of selected week

                            // If weekStart is in the past, adjust to the next Monday
                            if (weekStart.isBefore(today) && !canPostPreponePast) {
                              weekStart = today.startOf('isoWeek').add(1, 'week'); // Move to next Monday
                              weekEnd = weekStart.endOf('isoWeek'); // Adjust weekEnd accordingly
                            }
                            setRequestStartDate(weekStart);
                            setRequestEndDate(weekEnd);
                          } else {
                            setRequestStartDate(null);
                            setRequestEndDate(null);
                          }
                        }}
                        ampm={false}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </Col>
                <Col xs={12} sm={12} md={6} lg={6} className="col-auto">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker']} sx={{ overflow: 'hidden' }}>
                      <DatePicker
                        minDate={requestStartDate ? dayjs(requestStartDate) : dayjs().startOf('isoWeek')}
                        maxDate={
                            configData && configData.exception_for_approval_lead_days
                              ? dayjs().add(configData.exception_for_approval_lead_days, 'days').endOf('isoWeek')
                              : dayjs().add(30, 'days').endOf('isoWeek')
                          }
                        shouldDisableDate={(date) => {
                          const dayOfWeek = dayjs(date).day();
                          return !(dayOfWeek === 0); // Only allow Monday (1) and Sunday (0)
                        }}
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
                        }}
                        disablePast={!canPostPreponePast}
                        name="Request End Date"
                        label="Request End Date"
                        format="DD/MM/YYYY"
                        value={dayjs(requestEndDate)}
                        onChange={(date) => {
                          const weekEnd = dayjs(date).endOf('isoWeek'); // Force to Sunday
                          if (requestStartDate && weekEnd.isBefore(requestStartDate)) {
                            alert('End date cannot be before the start date!');
                            return;
                          }
                          setRequestEndDate(weekEnd);
                          const weekStart = dayjs(date).startOf('isoWeek');
                          setRequestStartDate(weekStart);
                        }}
                        ampm={false}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </Col> */}

                <Col xs={12} sm={12} md={12} lg={12} className="mt-3 col-auto">
                  <Label className="mt-0 font-family-tab">
                    Remarks
                    {' '}
                    <span className="ml-1 text-danger font-weight-800"> * </span>
                  </Label>
                  <Input type="textarea" name="body" label="Action Taken" placeholder="Enter here" value={messageTicket} onChange={onMessageChange} className="bg-whitered" rows="2" />
                </Col>
              </Row>
            </>
            )}
            <Row className="justify-content-center font-family-tab">
              {updateProductCategoryInfo && updateProductCategoryInfo.data && !loading && (
                <SuccessAndErrorFormat response={updateProductCategoryInfo} successMessage={isApprovalRequires() ? 'The Prepone/Postpone PPM Request has been created.' : 'The PPM has been rescheduled successfully...'} />
              )}
              {updateProductCategoryInfo && updateProductCategoryInfo.err && (
                <SuccessAndErrorFormat response={updateProductCategoryInfo} />
              )}
              {isApprovalRequires() && updateProductCategoryInfo && !updateProductCategoryInfo.data && !loading && (
                <SuccessAndErrorFormat response={false} staticInfoMessage="Prepone/Postpone of PPM requires approval." />
              )}
              {isPastSchedule() && !isInvalidSchedule() && updateProductCategoryInfo && !updateProductCategoryInfo.data && !loading && (
                <SuccessAndErrorFormat response={false} staticErrorMsg="The Request start / end date cannot be less than current date" />
              )}
              {!isPastSchedule() && isInvalidSchedule() && updateProductCategoryInfo && !updateProductCategoryInfo.data && !loading && (
              <SuccessAndErrorFormat response={false} staticErrorMsg="The Request start date cannot be greater than request end date" />
              )}
              {loading && (
                <CardBody className="mt-4" data-testid="loading-case">
                  <Loader />
                </CardBody>
              )}
            </Row>
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {updateProductCategoryInfo && updateProductCategoryInfo.data
          ? ''
          : (
            <Button
              type="button"
              variant="contained"
              className="submit-btn-auto"
              disabled={loading || checkChanges() === 'none' || isPastSchedule() || isInvalidSchedule() || !isValidValue(messageTicket) || !(requestStartDate && requestEndDate)}
              onClick={() => handleStateChange(detailData.id)}
            >
              {isApprovalRequires() ? 'Request' : ''}
              {' '}
              Prepone / Postpone PPM
            </Button>
          )}
        {(updateProductCategoryInfo && updateProductCategoryInfo.data
          && (
            <Button
              type="button"
              size="sm"
              disabled={loading}
              variant="contained"
              className="submit-btn"
              onClick={toggle}
            >
              Ok
            </Button>
          )
        )}
      </DialogActions>
    </Dialog>
  );
};

PrepostPonePPM.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  actionModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  atFinish: PropTypes.func.isRequired,
  atCancel: PropTypes.func.isRequired,
};
export default PrepostPonePPM;
