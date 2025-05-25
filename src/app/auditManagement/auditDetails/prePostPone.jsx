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
  Dialog, DialogActions, DialogContent, DialogContentText,
} from '@mui/material';
import * as PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import moment from 'moment-timezone';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';

import auditBlue from '@images/icons/auditBlue.svg';
import SuccessAndErrorFormat from '@shared/successAndErrorFormatMui';
import Loader from '@shared/loading';

import {
  getDefaultNoValue, extractNameObject,
  getAllowedCompanies, getCompanyTimezoneDate,
  getDateTimeUtcMuI,
} from '../../util/appUtils';
import {
  updateHxAudit,
  getHxAuditDetails,
} from '../auditService';
import DialogHeader from '../../commonComponents/dialogHeader';

const appModels = require('../../util/appModels').default;

const PrePostPone = (props) => {
  const {
    detailData, offset, actionModal, atFinish, atCancel,
  } = props;
  const dispatch = useDispatch();
  const [modal, setModal] = useState(actionModal);

  const [messageTicket, setMessageTicket] = useState('');

  const [timeoutLoading, setTimeoutLoading] = useState(false);

  const onMessageChange = (e) => {
    setMessageTicket(e.target.value);
  };

  const { hxAuditUpdate, hxAuditConfig } = useSelector((state) => state.hxAudits);

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);

  const configData = hxAuditConfig && hxAuditConfig.data && hxAuditConfig.data.length ? hxAuditConfig.data[0] : false;

  const [requestStartDate, setRequestStartDate] = useState(detailData && detailData.planned_start_date ? dayjs(moment.utc(detailData.planned_start_date).local().tz(userInfo?.data?.timezone).format('YYYY-MM-DD HH:mm:ss')) : null);

  const [requestEndDate, setRequestEndDate] = useState(detailData && detailData.planned_end_date ? dayjs(moment.utc(detailData.planned_end_date).local().tz(userInfo?.data?.timezone).format('YYYY-MM-DD HH:mm:ss')) : null);

  function checkExDatehasObject(data) {
    let result = false;
    if (typeof data === 'object' && data !== null) {
      result = getDateTimeUtcMuI(data);
    } else {
      result = moment(data).utc().format('YYYY-MM-DD HH:mm:ss');
    }
    return result;
  }

  const toggle = () => {
    if (hxAuditUpdate && hxAuditUpdate.data) {
      dispatch(getHxAuditDetails(detailData.id, appModels.HXAUDIT));
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

  const loading = (hxAuditUpdate && hxAuditUpdate.loading) || timeoutLoading;

  function checkChanges() {
    let res = 'none';
    if (detailData && detailData.planned_start_date) {
      const oldStart = dayjs(moment.utc(detailData.planned_start_date).local().tz(userInfo?.data?.timezone).format('YYYY-MM-DD HH:mm:ss'));
      const oldEnd = dayjs(moment.utc(detailData.planned_end_date).local().tz(userInfo?.data?.timezone).format('YYYY-MM-DD HH:mm:ss'));
      const newStart = requestStartDate;
      const newEnd = requestEndDate;
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
    if ((new Date() > new Date(requestStartDate)) || (new Date() > new Date(requestEndDate))) {
      res = true;
    }
    return res;
  }

  function isInvalidSchedule() {
    let res = false;
    if ((new Date(requestStartDate) > new Date(requestEndDate))) {
      res = true;
    }
    return res;
  }

  function isApprovalRequires() {
    let res = false;
    const isConfigReq = configData && configData.approval_required_for_postpone;
    const exceptionDays = configData && configData.exception_for_approval_lead_days;
    const oldStart = dayjs(moment.utc(detailData.planned_start_date).local().tz(userInfo?.data?.timezone).format('YYYY-MM-DD HH:mm:ss'));
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

  const handleStateChange = async (id) => {
    if (isApprovalRequires()) {
      const dates = { proposed_start_date: checkExDatehasObject(requestStartDate), proposed_end_date: checkExDatehasObject(requestEndDate) };
      const payload = {
        requested_on: moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss'),
        remarks: messageTicket,
        requested_by_id: userInfo && userInfo.data && userInfo.data.id,
        data: JSON.stringify(dates),
        approval_authority_id: configData && configData.approval_authority && configData.approval_authority.id ? configData.approval_authority.id : false,
        expires_on: checkChanges() === 'prepone' ? detailData.planned_start_date : detailData.planned_end_date,
        state: 'Pending',
      };

      const postDataValues = {
        prepone_approval_ids: [[0, 0, payload]],
        is_pending_for_approval: true,
      };

      try {
        dispatch(updateHxAudit(id, appModels.HXAUDIT, postDataValues));
      } catch (error) {
        console.error('Error updating reason or changing state:', error);
      } finally {
        // Set loading to false once everything is complete
        setTimeoutLoading(false);
      }
    } else {
      const dates = { planned_start_date: checkExDatehasObject(requestStartDate), planned_end_date: checkExDatehasObject(requestEndDate) };
      try {
        dispatch(updateHxAudit(id, appModels.HXAUDIT, dates));
      } catch (error) {
        console.error('Error updating reason or changing state:', error);
      } finally {
        // Set loading to false once everything is complete
        setTimeoutLoading(false);
      }
    }
  };

  return (

    <Dialog maxWidth="lg" minWidth="lg" open={actionModal}>
      <DialogHeader title={`Prepone / Postpone Audit ${isApprovalRequires() ? 'Request' : ''}`} onClose={toggleCancel} response={hxAuditUpdate} />
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Box
            sx={{
              width: '100%',
              height: '100%',
              backgroundColor: '#F6F8FA',
              padding: '20px',
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
                    <img src={auditBlue} alt="asset" width="40" height="35" style={{ alignSelf: 'flex-start' }} />
                    <Box>
                      <Typography variant="h6" sx={{ fontSize: '1rem' }} className="mb-1">
                        {getDefaultNoValue(detailData.name)}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" className="font-family-tab">
                        <span className="font-weight-800 font-family-tab font-side-heading mr-1">Sequence: </span>
                        {getDefaultNoValue(detailData.sequence)}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" className="font-family-tab">
                        <span className="font-weight-800 font-family-tab font-side-heading mr-1">Audit System: </span>
                        {getDefaultNoValue(extractNameObject(detailData.audit_system_id, 'name'))}
                      </Typography>
                    </Box>
                  </Box>
                </CardBody>
              )}
            </Card>
            {hxAuditUpdate && !hxAuditUpdate.data && !loading && (
              <Row className="ml-2 mr-2 mt-0">
                <Col xs={12} sm={12} md={6} lg={6} className="col-auto">
                  <Label className="mt-0 font-family-tab font-tiny font-weight-400">
                    Planned Start Date
                    {' '}
                    <span className="ml-1 text-danger" />
                  </Label>
                  <p className="font-family-tab">{getDefaultNoValue(getCompanyTimezoneDate(detailData.planned_start_date, userInfo, 'datetime'))}</p>
                </Col>
                <Col xs={12} sm={12} md={6} lg={6} className="col-auto">
                  <Label className="mt-0 font-family-tab font-tiny font-weight-400">
                    Planned End Date
                    {' '}
                    <span className="ml-1 text-danger" />
                  </Label>
                  <p className="font-family-tab">{getDefaultNoValue(getCompanyTimezoneDate(detailData.planned_end_date, userInfo, 'datetime'))}</p>
                </Col>
                <Col xs={12} sm={12} md={6} lg={6} className="col-auto">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DateTimePicker']} sx={{ overflow: 'hidden' }}>
                      <DateTimePicker
                        minDateTime={dayjs(new Date())}
                        maxDateTime={dayjs(requestEndDate)}
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
                        disablePast
                        name="Request Start Date"
                        label="Request Start Date"
                        format="DD/MM/YYYY HH:mm:ss"
                        value={dayjs(requestStartDate)}
                        onChange={onRequestStartChange}
                        ampm={false}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </Col>
                <Col xs={12} sm={12} md={6} lg={6} className="col-auto">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DateTimePicker']} sx={{ overflow: 'hidden' }}>
                      <DateTimePicker
                        minDateTime={dayjs(requestStartDate)}
                        maxDateTime={configData && configData.max_planned_interval_days ? dayjs(addDays(configData.max_planned_interval_days)) : dayjs(addDays(30))}
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
                        disablePast
                        name="Request End Date"
                        label="Request End Date"
                        format="DD/MM/YYYY HH:mm:ss"
                        value={dayjs(requestEndDate)}
                        onChange={onRequestEndChange}
                        ampm={false}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </Col>

                <Col xs={12} sm={12} md={12} lg={12} className="col-auto">
                  <Label className="mt-0 font-family-tab">
                    Remarks
                    {' '}
                    <span className="ml-1 text-danger" />
                  </Label>
                  <Input type="textarea" name="body" label="Action Taken" placeholder="Enter here" value={messageTicket} onChange={onMessageChange} className="bg-whitered" rows="2" />
                </Col>
              </Row>
            )}
            <Row className="justify-content-center font-family-tab">
              {hxAuditUpdate && hxAuditUpdate.data && !loading && (
                <SuccessAndErrorFormat response={hxAuditUpdate} successMessage={isApprovalRequires() ? 'The Audit Prepone / Postpone Request has been created successfully...' : 'The Audit has been rescheduled successfully...'} />
              )}
              {hxAuditUpdate && hxAuditUpdate.err && (
                <SuccessAndErrorFormat response={hxAuditUpdate} />
              )}
              {isApprovalRequires() && hxAuditUpdate && !hxAuditUpdate.data && !loading && (
                <SuccessAndErrorFormat response={false} staticInfoMessage="This Audit Prepone / Postpone Request requires an approval" />
              )}
              {isPastSchedule() && !isInvalidSchedule() && hxAuditUpdate && !hxAuditUpdate.data && !loading && (
                <SuccessAndErrorFormat response={false} staticErrorMsg="The Request start / end date cannot be less than current date" />
              )}
              {!isPastSchedule() && isInvalidSchedule() && hxAuditUpdate && !hxAuditUpdate.data && !loading && (
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
        {hxAuditUpdate && hxAuditUpdate.data
          ? ''
          : (
            <Button
              type="button"
              variant="contained"
              className="submit-btn-auto"
              disabled={loading || checkChanges() === 'none' || isPastSchedule() || isInvalidSchedule()}
              onClick={() => handleStateChange(detailData.id)}
            >
              {isApprovalRequires() ? 'Request' : ''}
              {' '}
              Prepone / Postpone Audit
            </Button>
          )}
        {(hxAuditUpdate && hxAuditUpdate.data
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

PrePostPone.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  actionModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  offset: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
  ]).isRequired,
  atFinish: PropTypes.func.isRequired,
  atCancel: PropTypes.func.isRequired,
};
export default PrePostPone;
