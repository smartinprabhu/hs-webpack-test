/* eslint-disable react/prop-types */
/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import {
  Label,
  Input,
  Card,
  CardBody,
  Col,
  Row,
} from 'reactstrap';
import moment from 'moment';
import * as PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { ThemeProvider } from '@material-ui/core/styles';
import { Autocomplete } from '@material-ui/lab';
import { TextField, CircularProgress, FormHelperText } from '@material-ui/core';
import {
  Button,
  Box,
  FormControl,
  Dialog, DialogActions, DialogContent, DialogContentText,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import DOMPurify from 'dompurify';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';

import workorderLogo from '@images/icons/workOrders.svg';
import checkCircleBlack from '@images/icons/checkCircleBlack.svg';
import ticketIconBlack from '@images/icons/ticketBlack.svg';

import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import {
  getDefaultNoValue,
  generateErrorMessage,
  getAllowedCompanies,
  getDateTimeUtc,
  calculateTimeDifference,
  getCompanyTimezoneDate,
  getDateTimeUtcMuI,
  extractTextObject,
} from '../../../util/appUtils';
import { getWorkOrderStateLabel } from '../../utils/utils';
import { updateProductCategory, resetUpdateProductCategory } from '../../../pantryManagement/pantryService';
import {
  resetActionData, getActionData,
  resetCreateOrderDuration, createOrderDuration,
  getPauseReasons, orderStateChange, resetEscalate,
  getOrderTimeSheets,
} from '../../workorderService';
import theme from '../../../util/materialTheme';
import {
  getTicketStateClose, updateTicket, resetUpdateTicket, resetOnHoldTicket,
} from '../../../helpdesk/ticketService';
import DialogHeader from '../../../commonComponents/dialogHeader';

const appModels = require('../../../util/appModels').default;

const PauseWorkorder = (props) => {
  const {
    details, pauseActionModal, actionText, actionCode, atFinish, isTicket, isPPM, wId, tId, isApproval,
    pauseReasonRemarks, pauseReason, ppmData, ppmConfig,
  } = props;
  const dispatch = useDispatch();
  const [reasonValue, setReasonValue] = useState(pauseReasonRemarks || '');
  const [onHoldRejectRemarks, setOnHoldRejectRemarks] = useState('');
  const [reasonKeyword, setReasonKeyword] = useState('');
  const [isReject, setIsReject] = useState('');
  const [duration, setDuration] = useState('');
  const [reasonId, setReasonId] = useState(pauseReason && pauseReason.length ? { id: pauseReason[0], name: pauseReason[1] } : false);
  const [woId, setId] = useState(false);
  const [timeLoading, setTimeLoading] = useState(false);
  const [modal, setModal] = useState(pauseActionModal);
  const toggle = () => {
    dispatch(resetCreateOrderDuration());
    dispatch(resetActionData());
    dispatch(resetEscalate());
    dispatch(resetUpdateTicket());
    dispatch(resetOnHoldTicket());
    setModal(!modal);
    atFinish();
  };

  const {
    actionResultInfo, createDurationInfo, pauseReasons, orderTimeSheets,
    stateChangeInfo,
  } = useSelector((state) => state.workorder);
  const { userInfo } = useSelector((state) => state.user);
  const {
    ticketDetail, ticketCloseState, updateTicketInfo, onHoldApproval,
  } = useSelector((state) => state.ticket);
  const companies = getAllowedCompanies(userInfo);

  const userCompanyId = userInfo && userInfo.data && userInfo.data.company ? userInfo.data.company.id : '';
  const userParentId = userInfo && userInfo.data && userInfo.data.company.parent_id ? userInfo.data.company.parent_id.id : '';

  const isResult = actionResultInfo && actionResultInfo.data && (actionResultInfo.data.data || actionResultInfo.data.status);
  const loading = actionResultInfo && actionResultInfo.loading;
  const isError = actionResultInfo && actionResultInfo.err;

  const dataLoading = (loading) || (createDurationInfo && createDurationInfo.loading) || (stateChangeInfo && stateChangeInfo.loading);
  const isData = details && (details.data && details.data.length > 0 && !details.loading && !loading && (createDurationInfo && !createDurationInfo.loading))
    && (stateChangeInfo && !stateChangeInfo.loading);
  const showForm = !isResult && (!loading) && (createDurationInfo && !createDurationInfo.data && !createDurationInfo.loading) && (stateChangeInfo && !stateChangeInfo.loading);
  const showButton = !loading && (createDurationInfo && !createDurationInfo.loading);
  const showMsg = isResult && (!loading) && (createDurationInfo && !createDurationInfo.loading) && (stateChangeInfo && !stateChangeInfo.loading);

  const [error, setError] = React.useState(false);
  const [onHoldDate, setOnHoldDate] = useState(null);

  const errorMessage = React.useMemo(() => {
    switch (error) {
      case 'maxDate': {
        return 'Please select a valid date.';
      }
      case 'minDate': {
        return 'Please select a valid date.';
      }

      case 'invalidDate': {
        return 'Invalid Date';
      }

      default: {
        return '';
      }
    }
  }, [error]);

  useEffect(() => {
    dispatch(resetActionData());
  }, []);

  useEffect(() => {
    if (!isPPM && pauseReason && pauseReason.length) {
      setReasonId({ id: pauseReason[0], name: pauseReason[1] });
    } else if (!isPPM) {
      setReasonId(false);
    }
  }, [pauseReason]);

  function getCurrentWeekLastDate() {
    const today = new Date();
    const dayOfWeek = today.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6
    const lastDayOfWeek = 7; // Sunday is the last day of the week

    // Calculate the remaining days to reach Sunday
    const diff = lastDayOfWeek - dayOfWeek;

    // Add the difference to today's date to get the last date of the week
    const lastDate = new Date(today);
    lastDate.setDate(today.getDate() + diff);

    return lastDate;
  }

  function getEndTime() {
    let endDate = new Date();
    if (ppmData && reasonId && reasonId.id) {
      const durations = reasonId && reasonId.grace_period ? parseInt(reasonId.grace_period) : 0;
      const ppmEndDate = ppmData && ppmData.ends_on ? moment.utc(ppmData.ends_on).local().format('YYYY-MM-DD') : false;
      const graceEndDate = moment(new Date(ppmEndDate)).utc().add(durations, durations > 1 ? 'days' : 'day').format('YYYY-MM-DD');

      const maxValue1 = ppmConfig && ppmConfig.on_hold_max_grace_period ? parseInt(ppmConfig.on_hold_max_grace_period) : 30;
      const maxEndDate = moment(new Date(ppmEndDate)).utc().add(maxValue1, maxValue1 > 1 ? 'days' : 'day').format('YYYY-MM-DD');

      if ((new Date(ppmEndDate) > new Date()) || ((new Date(graceEndDate) > new Date()) && durations)) {
        endDate = moment(new Date(ppmEndDate)).utc().add(durations, durations > 1 ? 'days' : 'day').format('YYYY-MM-DD');
      } else if ((!durations && (new Date(maxEndDate) > new Date())) || (reasonId && reasonId.is_can_vverride && ppmConfig && ppmConfig.on_hold_max_grace_period && (new Date(maxEndDate) > new Date()))) {
        endDate = maxEndDate;
      } else {
        endDate = null;
      }
    } /* else if (reasonId && reasonId.id && ppmData && ppmData.on_hold_end_date) {
      const oldDate = moment.utc(ppmData.on_hold_end_date).local().format('YYYY-MM-DD');
      if ((new Date(oldDate) > new Date())) {
        endDate = oldDate;
      } else {
        endDate = null;
      }
    } */
    return endDate ? dayjs(endDate) : endDate;
  }

  function isEndTimeElpsed() {
    let endDate = false;
    if (reasonId && reasonId.id) {
      const durations = reasonId && reasonId.grace_period ? parseInt(reasonId.grace_period) : 0;
      const ppmEndDate = ppmData && ppmData.ends_on ? moment.utc(ppmData.ends_on).local().format('YYYY-MM-DD') : false;
      const graceEndDate = moment(new Date(ppmEndDate)).utc().add(durations, durations > 1 ? 'days' : 'day').format('YYYY-MM-DD');

      const maxValue1 = ppmConfig && ppmConfig.on_hold_max_grace_period ? parseInt(ppmConfig.on_hold_max_grace_period) : 30;
      const maxEndDate = moment(new Date(ppmEndDate)).utc().add(maxValue1, maxValue1 > 1 ? 'days' : 'day').format('YYYY-MM-DD');
      if ((new Date(ppmEndDate) > new Date()) || ((new Date(graceEndDate) > new Date()) && durations)) {
        endDate = false;
      } else if ((!durations && (new Date(maxEndDate) > new Date())) || (reasonId && reasonId.is_can_vverride && ppmConfig && ppmConfig.on_hold_max_grace_period && (new Date(maxEndDate) > new Date()))) {
        endDate = false;
      } else {
        endDate = true;
      }
    }
    /* } else if (ppmData && ppmData.on_hold_end_date) {
      const oldDate = moment.utc(ppmData.on_hold_end_date).local().format('YYYY-MM-DD');
      endDate = !((new Date(oldDate) > new Date()));
    } */
    return endDate;
  }

  function getMinEndTime() {
    let minDate = dayjs(moment(new Date()).tz(userInfo?.data?.timezone).format('YYYY-MM-DD'));
    if (ppmData && ppmData.ends_on) {
      const ppmEndDate = moment.utc(ppmData.ends_on).local().format('YYYY-MM-DD');
      const durations = reasonId && reasonId.grace_period ? parseInt(reasonId.grace_period) : 0;
      const graceEndDate = moment(new Date(ppmEndDate)).utc().add(durations, durations > 1 ? 'days' : 'day').format('YYYY-MM-DD');
      const maxValue1 = ppmConfig && ppmConfig.on_hold_max_grace_period ? parseInt(ppmConfig.on_hold_max_grace_period) : 30;
      const maxEndDate = moment(new Date(ppmEndDate)).utc().add(maxValue1, maxValue1 > 1 ? 'days' : 'day').format('YYYY-MM-DD');
      if ((new Date(ppmEndDate) > new Date())) {
        minDate = dayjs(moment.utc(ppmData.ends_on).local().add(1, 'day').tz(userInfo?.data?.timezone)
          .format('YYYY-MM-DD'));
      } else if (reasonId && ((!reasonId.grace_period && (new Date(maxEndDate) > new Date())) || (new Date(graceEndDate) > new Date() && durations) || (reasonId.is_can_vverride && ppmConfig && ppmConfig.on_hold_max_grace_period && (new Date(maxEndDate) > new Date())))) {
        minDate = dayjs(moment(new Date()).format('YYYY-MM-DD'));
      } else {
        minDate = dayjs(moment.utc(ppmData.ends_on).local().tz(userInfo?.data?.timezone)
          .format('YYYY-MM-DD'));
      }
    }

    return dayjs(minDate);
  }

  function getMaxEndTime() {
    const maxValue1 = ppmConfig && ppmConfig.on_hold_max_grace_period ? parseInt(ppmConfig.on_hold_max_grace_period) : 30;
    const durations = reasonId && reasonId.grace_period ? parseInt(reasonId.grace_period) : maxValue1;
    const ppmEndDate = ppmData && ppmData.ends_on ? moment.utc(ppmData.ends_on).local().format('YYYY-MM-DD') : false;
    let endDate = moment(new Date(ppmEndDate)).utc().add(durations, durations > 1 ? 'days' : 'day').format('YYYY-MM-DD');
    if (reasonId && reasonId.is_can_vverride && ppmConfig && ppmConfig.on_hold_max_grace_period) {
      const maxValue = ppmConfig && ppmConfig.on_hold_max_grace_period ? parseInt(ppmConfig.on_hold_max_grace_period) : 0;
      endDate = moment(new Date(ppmEndDate)).utc().add(maxValue, maxValue > 1 ? 'days' : 'day').format('YYYY-MM-DD');
    }
    return dayjs(endDate);
  }

  useEffect(() => {
    if (isPPM && ppmData && isApproval) {
      setReasonId(ppmData && ppmData.pause_reason_id && ppmData.pause_reason_id.id ? ppmData.pause_reason_id : false);
    } else if (isPPM && ppmData && !isApproval) {
      setReasonValue('');
      setReasonId(false);
    }
  }, [ppmData]);

  useEffect(() => {
    if (reasonId && reasonId.id) {
      setOnHoldDate(getEndTime());
    }
  }, [reasonId]);

  useEffect(() => {
    if (ppmData && ppmData.pause_reason_id && ppmData.pause_reason_id.id) {
      setDuration(ppmData.pause_reason_id.grace_period);
    }
  }, [ppmData]);

  useEffect(() => {
    if (details && details.data) {
      const ids = details.data.length > 0 ? details.data[0].mro_timesheet_ids : [];
      dispatch(getOrderTimeSheets(ids, appModels.TIMESHEET));
      setIsReject(false);
      setOnHoldRejectRemarks('');
    }
  }, []);

  useEffect(() => {
    const viewId = details && details.data ? details.data[0].id : '';
    setId(viewId);
    setIsReject(false);
    dispatch(resetUpdateProductCategory());
    setOnHoldRejectRemarks('');
  }, []);

  /* useEffect(() => {
    if (details && details.data && (stateChangeInfo && stateChangeInfo.data)) {
      const ids = details.data.length > 0 ? details.data[0].mro_timesheet_ids : [];
      dispatch(getOrderTimeSheets(ids, appModels.TIMESHEET));
    }
  }, [stateChangeInfo, details]); */

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const tempLevel = ppmConfig && ppmConfig.reason_access_level ? ppmConfig.reason_access_level : '';
      let domain = '';
      if (tempLevel === 'Site') {
        domain = `["company_id","=",${userCompanyId}]`;
      } else if (tempLevel === 'Company') {
        domain = `["company_id","in",[${userCompanyId}, ${userParentId}]]`;
      } else if (tempLevel === 'Instance') {
        domain = '"|",["company_id","=",1],["company_id","=",false]';
      }

      if (tempLevel && reasonKeyword) {
        domain = `${domain},["name","ilike","${reasonKeyword}"]`;
      }

      if (!tempLevel && reasonKeyword) {
        domain = `["name","ilike","${reasonKeyword}"]`;
      }
      dispatch(getPauseReasons(companies, appModels.ORDERPAUSEREASONS, reasonKeyword, isPPM ? 'On-hold' : false, isPPM ? domain : false));
    }
  }, [userInfo, reasonKeyword]);

  useEffect(() => {
    if (createDurationInfo && createDurationInfo.data && createDurationInfo.data.length) {
      dispatch(getActionData(createDurationInfo.data[0], actionCode, appModels.PAUSEREASON));
    }
  }, [createDurationInfo]);

  function checkTimesheet() {
    let tid = false;
    const data = orderTimeSheets && orderTimeSheets.data;
    if (data && data.length) {
      const result = data.filter((item) => (!item.end_date));
      tid = result && result.length ? result[result.length - 1].id : false;
    }
    return tid;
  }

  function checkTimesheetStartDate() {
    let tid = false;
    const data = orderTimeSheets && orderTimeSheets.data;
    if (data && data.length) {
      const result = data.filter((item) => (!item.end_date));
      tid = result && result.length ? result[result.length - 1].start_date : false;
    }
    return tid;
  }

  useEffect(() => {
    const viewId = details && details.data ? details.data[0].id : '';
    if ((userInfo && userInfo.data) && viewId && isResult) {
      let timeData = {};
      if (checkTimesheet()) {
        const tvalue = checkTimesheet();
        timeData = {
          mro_timesheet_ids: [[1, tvalue, {
            reason: reasonValue,
            description: 'Pause',
            end_date: getDateTimeUtc(new Date()),
            total_hours: parseFloat(calculateTimeDifference(checkTimesheetStartDate(), new Date(), true)),
          }]],
        };
        dispatch(orderStateChange(viewId, timeData, appModels.ORDER));
      }
      // dispatch(getOrderDetail(viewId, appModels.ORDER));
    }
  }, [userInfo, actionResultInfo]);

  // useEffect(() => {
  //   if ((userInfo && userInfo.data) && woId && (stateChangeInfo && stateChangeInfo.data)) {
  //     dispatch(getOrderDetail(woId, appModels.ORDER));
  //   }
  // }, [userInfo, stateChangeInfo]);

  useEffect(() => {
    if (!wId) {
      dispatch(getTicketStateClose(false, appModels.HELPDESKSTATE, 'On Hold'));
      dispatch(resetUpdateTicket());
    }
  }, [wId]);

  const detailData = details && (details.data && details.data.length > 0) ? details.data[0] : '';

  const sendDate = () => {
    const id = ppmData && ppmData.id ? ppmData.id : false;
    if (id) {
      let holdDate = onHoldDate || false;
      if (holdDate) {
        holdDate = getDateTimeUtcMuI(onHoldDate);
      }

      const postData = {
        on_hold_end_date: holdDate,
        paused_on: moment().utc().format('YYYY-MM-DD HH:mm:ss'),
      };
      dispatch(updateProductCategory(id, 'ppm.scheduler_week', postData));
    }
  };

  const putOnhold = () => {
    setIsReject(false);
    setOnHoldRejectRemarks('');
    const stateId = ticketCloseState && ticketCloseState.data && ticketCloseState.data.length > 0 ? ticketCloseState.data[0].id : '';
    if (stateId && tId && !isApproval && !isPPM) {
      const postData = {
        state_id: stateId,
        pause_reason_id: reasonId ? reasonId.id : false,
      };
      dispatch(updateTicket(tId, appModels.HELPDESK, postData));
      setTimeLoading(false);
      setTimeout(() => {
        sendDate();
      }, 2500);
    } else if ((tId || isPPM) && isApproval) {
      const method = 'send_on_hold_approvel_or_reject_email';
      const args = 'approval';
      const postData = {
        state_id: stateId,
        pause_reason_id: reasonId ? reasonId.id : false,
      };
      dispatch(updateTicket(tId, isPPM ? 'ppm.scheduler_week' : appModels.HELPDESK, postData, isApproval, method, args, isPPM ? (reasonId && reasonId.name ? reasonId.name : false) : false, isPPM, ppmData, userInfo && userInfo.data && userInfo.data.email && userInfo.data.email.email ? userInfo.data.email.email : ''));
      setTimeLoading(false);
      setTimeout(() => {
        sendDate();
      }, 2500);
    } else if (isPPM) {
      sendDate();
    }
  };

  const onDurationChange = (e) => {
    const maxValue = ppmConfig && ppmConfig.on_hold_max_grace_period ? parseInt(ppmConfig.on_hold_max_grace_period) : 0;
    setDuration(e.target.value && maxValue >= e.target.value ? e.target.value : '');
  };

  const putReject = () => {
    setIsReject(true);
    if ((tId || isPPM) && isApproval && onHoldRejectRemarks) {
      const method = 'send_on_hold_approvel_or_reject_email';
      const args = 'reject';
      const postData = {
        pause_reason_id: reasonId ? reasonId.id : false,
      };
      dispatch(updateTicket(tId, isPPM ? 'ppm.scheduler_week' : appModels.HELPDESK, postData, isApproval, method, args, DOMPurify.sanitize(onHoldRejectRemarks), isPPM, ppmData, userInfo && userInfo.data && userInfo.data.email && userInfo.data.email.email ? userInfo.data.email.email : ''));
    }
  };

  const storeReason = () => {
    const postData = {
      reason: reasonValue,
      pause_reason_id: reasonId ? reasonId.id : false,
    };
    const viewId = details && details.data ? details.data[0].id : '';
    const payload = { model: appModels.PAUSEREASON, values: postData, context: { active_id: viewId, active_model: appModels.ORDER } };
    dispatch(createOrderDuration(appModels.PAUSEREASON, payload));
    setTimeLoading(true);
    if (isApproval || isPPM) {
      setTimeout(() => {
        putOnhold();
      }, 2000);
    }
  };

  const onInputChange = (e) => {
    setReasonValue(e.target.value);
  };

  const onHoldRejectReasonInputChange = (e) => {
    setOnHoldRejectRemarks(e.target.value);
  };

  const onReasonKeyWordChange = (e) => {
    setReasonKeyword(e.target.value);
  };

  const onDateChange = (e) => {
    setError(false);
    setOnHoldDate(e);
  };

  return (
    <Dialog open={pauseActionModal}>
      <DialogHeader title={`${isApproval ? 'Approve/Reject On Hold' : isTicket ? 'Put On-Hold' : actionText} ${isApproval ? '' : isTicket ? 'Ticket' : 'Workorder'}`} onClose={toggle} response={actionResultInfo} imagePath={checkCircleBlack} />
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
            <Card className="border-5 ml-4 mb-2 mr-4 border-secondary rounded-0 border-top-0 border-right-0 border-bottom-0">
              {createDurationInfo && !createDurationInfo.data && detailData && !isTicket && !isPPM && (
                <CardBody data-testid="success-case" className="bg-lightblue p-3">
                  <Row>
                    <Col md="2" xs="2" sm="2" lg="2">
                      <img src={workorderLogo} alt="asset" className="mt-2" width="45" height="45" />
                    </Col>
                    <Col md="8" xs="8" sm="8" lg="8" className="ml-2">
                      <Row>
                        <h6 className="mb-1">{detailData.name}</h6>
                      </Row>
                      <Row>
                        <p className="mb-0 font-weight-500 font-tiny">
                          {getDefaultNoValue(detailData.sequence)}
                        </p>
                      </Row>
                      <Row>
                        <Col md="12" xs="12" sm="12" lg="12" className="p-0">
                          <span className="font-weight-800 font-side-heading mr-1">
                            Status :
                          </span>
                          <span className="font-weight-400">
                            {getWorkOrderStateLabel(detailData.state)}
                          </span>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </CardBody>
              )}
              {updateTicketInfo && (!updateTicketInfo.data || isApproval) && isTicket && ticketDetail && (ticketDetail.data && ticketDetail.data.length > 0) && (
                <CardBody className="p-3">
                  <Row>
                    <Col sm="9" md="9" lg="9" xs="12">
                      <p className="font-weight-800 font-side-heading text-grey mb-1">
                        {ticketDetail.data[0].subject}
                      </p>
                      <p className="font-weight-500 font-side-heading mb-1">
                        #
                        {ticketDetail.data[0].ticket_number}
                      </p>
                    </Col>
                    <Col sm="3" md="3" lg="3" xs="12">
                      <img src={ticketIconBlack} alt="workorder" width="25" className="mr-2 float-right" />
                    </Col>
                  </Row>
                  {isApproval && (onHoldApproval && !onHoldApproval.data) && (createDurationInfo && !createDurationInfo.data) && (
                    <>
                      <Row>
                        <Col md="12" xs="12" sm="12" lg="12">
                          <span className="font-weight-800 font-side-heading mr-1">
                            Requested by :
                          </span>
                          <span className="font-weight-400 font-side-heading">
                            {getDefaultNoValue(extractTextObject(ticketDetail.data[0].on_hold_requested_by))}
                          </span>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="12" xs="12" sm="12" lg="12">
                          <span className="font-weight-800 font-side-heading mr-1">
                            Requested on :
                          </span>
                          <span className="font-weight-400 font-side-heading">
                            {getCompanyTimezoneDate(ticketDetail.data[0].on_hold_requested_on, userInfo, 'datetime')}
                          </span>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="12" xs="12" sm="12" lg="12">
                          <span className="font-weight-800 font-side-heading mr-1">
                            Reason :
                          </span>
                          <span className="font-weight-400 font-side-heading">
                            {getDefaultNoValue(extractTextObject(ticketDetail.data[0].pause_reason_id))}
                          </span>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="12" xs="12" sm="12" lg="12">
                          <span className="font-weight-800 font-side-heading mr-1">
                            Remarks
                          </span>
                          <p className="font-weight-400 mb-0 font-side-heading small-form-content thin-scrollbar">
                            {getDefaultNoValue(ticketDetail.data[0].on_hold_requested_command)}
                          </p>
                        </Col>
                      </Row>
                    </>
                  )}
                </CardBody>
              )}
              {updateTicketInfo && (!updateTicketInfo.data || isApproval) && isPPM && ppmData && (
              <CardBody className="p-3">
                <Row>
                  <Col md="2" xs="2" sm="2" lg="2">
                    <img src={workorderLogo} alt="asset" className="mt-2" width="45" height="45" />
                  </Col>
                  <Col md="8" xs="8" sm="8" lg="8" className="ml-2">
                    <Row>
                      <h6 className="mb-1">{detailData.name}</h6>
                    </Row>
                    <Row>
                      <p className="mb-0 font-weight-500 font-tiny">
                        {getDefaultNoValue(detailData.sequence)}
                      </p>
                    </Row>
                    <Row>
                      <Col md="12" xs="12" sm="12" lg="12" className="p-0">
                        <span className="font-weight-800 font-side-heading mr-1">
                          Status :
                        </span>
                        <span className="font-weight-400">
                          {getWorkOrderStateLabel(detailData.state, ppmData && ppmData.is_on_hold_requested)}
                        </span>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                {isApproval && (onHoldApproval && !onHoldApproval.data) && (createDurationInfo && !createDurationInfo.data) && (
                <>
                  <Row>
                    <Col md="12" xs="12" sm="12" lg="12">
                      <span className="font-weight-800 font-side-heading mr-1">
                        Requested by :
                      </span>
                      <span className="font-weight-400 font-side-heading">
                        {getDefaultNoValue(extractTextObject(ppmData.on_hold_requested_by))}
                      </span>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12" xs="12" sm="12" lg="12">
                      <span className="font-weight-800 font-side-heading mr-1">
                        Requested on :
                      </span>
                      <span className="font-weight-400 font-side-heading">
                        {getCompanyTimezoneDate(ppmData.on_hold_requested_on, userInfo, 'datetime')}
                      </span>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12" xs="12" sm="12" lg="12">
                      <span className="font-weight-800 font-side-heading mr-1">
                        Reason
                      </span>
                      <span className="font-weight-400 mb-0 font-side-heading">
                        {getDefaultNoValue(ppmData.pause_reason_id && ppmData.pause_reason_id.id ? ppmData.pause_reason_id.name : '')}
                      </span>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12" xs="12" sm="12" lg="12">
                      <span className="font-weight-800 font-side-heading mr-1">
                        Remarks
                      </span>
                      <span className="font-weight-400 mb-0 font-side-heading">
                        {getDefaultNoValue(ppmData.on_hold_requested_command)}
                      </span>
                    </Col>
                  </Row>
                </>
                )}
              </CardBody>
              )}
            </Card>
            {isReject && isApproval && (onHoldApproval && !onHoldApproval.data) && (createDurationInfo && !createDurationInfo.data) && (
              <ThemeProvider theme={theme}>
                <Row className="ml-2 mr-2">
                  <Col xs={12} sm={12} md={12} lg={12}>
                    <Label for="actual_duration">
                      Reason
                      <span className="text-danger ml-1">*</span>
                    </Label>
                    <Input type="textarea" id="reason" value={onHoldRejectRemarks} onChange={onHoldRejectReasonInputChange} className="" rows="4" />
                    {!onHoldRejectRemarks && (<span className="text-danger ml-1">Reason required</span>)}
                  </Col>
                </Row>
              </ThemeProvider>
            )}
            {!isApproval && (
              <Row className="ml-2 mr-2">
                {showForm && ((wId && isTicket) || (!wId && !isTicket)) && (
                  <ThemeProvider theme={theme}>
                    <Col xs={12} sm={12} md={12} lg={6}>
                      <Label for="product_id">
                        {isTicket ? '' : 'On-Hold'}
                        {' '}
                        Reason
                        <span className="text-danger ml-1">*</span>
                      </Label>
                      <Autocomplete
                        name="pause_reason_id"
                        size="small"
                        onChange={(_event, newValue) => {
                          setReasonId(newValue);
                        }}
                        value={reasonId || ''}
                        disableClearable={!reasonId}
                        getOptionSelected={(option, value) => option.name === value.name}
                        getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                        options={pauseReasons && pauseReasons.data ? pauseReasons.data : []}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            onChange={onReasonKeyWordChange}
                            variant="outlined"
                            className="without-padding"
                            placeholder="Search & Select"
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <>
                                  {pauseReasons && pauseReasons.loading ? <CircularProgress color="inherit" size={20} /> : null}
                                  {params.InputProps.endAdornment}
                                </>
                              ),
                            }}
                          />
                        )}
                      />
                      {(pauseReasons && pauseReasons.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(pauseReasons)}</span></FormHelperText>)}
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={6}>
                      <Label for="actual_duration">
                        Remarks
                        <span className="text-danger ml-1">*</span>
                      </Label>
                      <Input type="text" id="reason" value={reasonValue} onChange={onInputChange} className="" maxLength="50" />
                    </Col>
                  </ThemeProvider>
                )}
                {(updateTicketInfo && !updateTicketInfo.data) && !((updateTicketInfo && updateTicketInfo.loading) || (ticketDetail && ticketDetail.loading)) && !wId && isTicket && (
                  <ThemeProvider theme={theme}>
                    <Col xs={12} sm={12} md={12} lg={12}>
                      <Label for="product_id">
                        {isTicket ? '' : 'On-Hold'}
                        {' '}
                        Reason
                        <span className="text-danger ml-1">*</span>
                      </Label>
                      <Autocomplete
                        name="pause_reason_id"
                        size="small"
                        onChange={(_event, newValue) => {
                          setReasonId(newValue);
                        }}
                        disableClearable={!reasonId}
                        value={reasonId || ''}
                        getOptionSelected={(option, value) => option.name === value.name}
                        getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                        options={pauseReasons && pauseReasons.data ? pauseReasons.data : []}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            onChange={onReasonKeyWordChange}
                            variant="outlined"
                            className="without-padding"
                            placeholder="Search & Select"
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <>
                                  {pauseReasons && pauseReasons.loading ? <CircularProgress color="inherit" size={20} /> : null}
                                  {params.InputProps.endAdornment}
                                </>
                              ),
                            }}
                          />
                        )}
                      />
                      {(pauseReasons && pauseReasons.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(pauseReasons)}</span></FormHelperText>)}
                    </Col>
                  </ThemeProvider>
                )}
              </Row>
            )}
            { /* isPPM && !isReject && isApproval && (
            <Row className="ml-2 mr-2">
              {(updateTicketInfo && !updateTicketInfo.data) && !((updateTicketInfo && updateTicketInfo.loading) || (ticketDetail && ticketDetail.loading)) && (
              <ThemeProvider theme={theme}>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <Label for="product_id">
                    {isTicket ? '' : 'Pause'}
                    {' '}
                    Reason
                    <span className="text-danger ml-1">*</span>
                  </Label>
                  <Autocomplete
                    name="pause_reason_id"
                    size="small"
                    onChange={(_event, newValue) => {
                      setReasonId(newValue);
                    }}
                    getOptionSelected={(option, value) => option.name === value.name}
                    getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                    options={pauseReasons && pauseReasons.data ? pauseReasons.data : []}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        onChange={onReasonKeyWordChange}
                        variant="outlined"
                        className="without-padding"
                        placeholder="Search & Select"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {pauseReasons && pauseReasons.loading ? <CircularProgress color="inherit" size={20} /> : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                  {(pauseReasons && pauseReasons.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(pauseReasons)}</span></FormHelperText>)}
                </Col>
              </ThemeProvider>
              )}
            </Row>
            ) */}
            {showForm && isPPM && !isReject && (
            <Row className="ml-2 mr-2">
              {(updateTicketInfo && !updateTicketInfo.data) && !((updateTicketInfo && updateTicketInfo.loading) || (ticketDetail && ticketDetail.loading)) && (
              <ThemeProvider theme={theme}>
                {reasonId && reasonId.id && !isEndTimeElpsed() && (
                <Col xs={12} sm={12} md={12} lg={12} className="mt-3">
                  <Label for="actual_duration">
                    On-Hold End Date
                    <span className="text-danger ml-1">*</span>
                  </Label>
                  <FormControl
                    sx={{
                      marginTop: 'auto',
                      marginBottom: '20px',
                      width: '100%',
                    }}
                    variant="standard"
                  >
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={['DatePicker']}>
                        <DatePicker
                          minDate={getMinEndTime()}
                          maxDate={getMaxEndTime()}
                          sx={{ width: '100%' }}
                          localeText={{ todayButtonLabel: 'Now' }}
                          onError={(newError) => setError(newError)}
                          disablePast
                          slotProps={{
                            actionBar: {
                              actions: ['accept'],
                            },
                            textField: { helperText: errorMessage, variant: 'standard' },
                          }}
                          // disabled={!(reasonId && reasonId.is_can_vverride) && (reasonId && reasonId.grace_period)}
                          name="closed_on"
                          label=""
                          value={onHoldDate}
                          onChange={onDateChange}
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  </FormControl>
                  {!isEndTimeElpsed() && reasonId && reasonId.id && (
                  <span className="text-info mt-0">
                    You can place this PPM on hold for a maximum of
                    {' '}
                    {!reasonId.is_can_vverride && reasonId.grace_period ? reasonId.grace_period : ppmConfig && ppmConfig.on_hold_max_grace_period}
                    {' '}
                    days from PPM Ends On:
                    {' '}
                    (
                    {ppmData && ppmData.ends_on ? getCompanyTimezoneDate(ppmData.ends_on, userInfo, 'date') : ''}
                    )
                    .
                  </span>
                  )}

                </Col>
                )}
                  {isEndTimeElpsed() && reasonId && reasonId.id && (
                    <Col xs={12} sm={12} md={12} lg={12} className="mt-3">
                      <p className="text-danger mt-0">
                        You cannot place this PPM on-hold as the maximum grace period is elapsed
                      </p>
                    </Col>
                  )}
              </ThemeProvider>
              )}
            </Row>
            )}
            {!isApproval && ((wId && isTicket) || (!wId && !isTicket)) && (
              <Row className="justify-content-center">
                {createDurationInfo && createDurationInfo.data && (
                  <SuccessAndErrorFormat response={createDurationInfo} successMessage={isTicket ? 'The Ticket has been placed On Hold.' : 'This workorder has been placed On-Hold successfully..'} />
                )}
                {createDurationInfo && createDurationInfo.err && (
                  <SuccessAndErrorFormat response={createDurationInfo} />
                )}
                {createDurationInfo && createDurationInfo.loading && (
                  <CardBody className="mt-4" data-testid="loading-case">
                    <Loader />
                  </CardBody>
                )}
              </Row>
            )}
            {isApproval && (wId && (isTicket || isPPM)) && (createDurationInfo && (createDurationInfo.data || createDurationInfo.err || createDurationInfo.loading)) && (
              <Row className="justify-content-center">
                {createDurationInfo && createDurationInfo.data && (
                  <SuccessAndErrorFormat response={createDurationInfo} successMessage={isTicket ? 'The Ticket has been placed On Hold.' : 'This workorder has been placed On-Hold successfully..'} />
                )}
                {createDurationInfo && createDurationInfo.err && (
                  <SuccessAndErrorFormat response={createDurationInfo} />
                )}
                {createDurationInfo && createDurationInfo.loading && (
                  <CardBody className="mt-4" data-testid="loading-case">
                    <Loader />
                  </CardBody>
                )}
              </Row>
            )}
            {!isApproval && !wId && (isTicket || isPPM) && (
              <Row className="justify-content-center">
                {updateTicketInfo && updateTicketInfo.data && (
                  <SuccessAndErrorFormat response={updateTicketInfo} successMessage={isTicket ? 'The Ticket has been placed On Hold.' : 'This workorder has been placed On-Hold successfully..'} />
                )}
                {updateTicketInfo && updateTicketInfo.err && (
                  <SuccessAndErrorFormat response={updateTicketInfo} />
                )}
                {(updateTicketInfo && updateTicketInfo.loading) && (
                  <CardBody className="mt-4" data-testid="loading-case">
                    <Loader />
                  </CardBody>
                )}
              </Row>
            )}
            {isApproval && !wId && (isTicket || isPPM) && !isReject && (
              <Row className="justify-content-center">
                {updateTicketInfo && updateTicketInfo.data && (
                  <SuccessAndErrorFormat response={updateTicketInfo} successMessage={isTicket ? 'The Ticket has been placed On Hold.' : 'This workorder has been placed On-Hold successfully..'} />
                )}
                {updateTicketInfo && updateTicketInfo.err && (
                  <SuccessAndErrorFormat response={updateTicketInfo} />
                )}
                {((updateTicketInfo && updateTicketInfo.loading) || timeLoading) && (
                  <CardBody className="mt-4" data-testid="loading-case">
                    <Loader />
                  </CardBody>
                )}
              </Row>
            )}
            {isApproval && (isTicket || isPPM) && (isReject || (onHoldApproval && onHoldApproval.data)) && !(createDurationInfo && createDurationInfo.data) && (
              <Row className="justify-content-center">
                {onHoldApproval && onHoldApproval.data && (
                  <SuccessAndErrorFormat response={onHoldApproval} successMessage={isTicket ? 'The Request for On Hold has been rejected.' : 'The Request for On Hold has been rejected.'} />
                )}
                {updateTicketInfo && updateTicketInfo.err && (
                  <SuccessAndErrorFormat response={updateTicketInfo} />
                )}
                {(updateTicketInfo && updateTicketInfo.loading) && (
                  <CardBody className="mt-4" data-testid="loading-case">
                    <Loader />
                  </CardBody>
                )}
              </Row>
            )}
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {onHoldApproval && !onHoldApproval.data && createDurationInfo && !createDurationInfo.data && updateTicketInfo && !updateTicketInfo.data && (isTicket || isPPM) && isApproval && (
          <Button
            type="button"
            variant="contained"
            className="reset-btn"
            disabled={(isReject && !onHoldRejectRemarks) || (updateTicketInfo && updateTicketInfo.loading)}
            onClick={() => putReject()}
          >
            Reject
          </Button>
        )}
        {!isReject && onHoldApproval && !onHoldApproval.data && updateTicketInfo && !updateTicketInfo.data && isTicket && !wId && !isPPM && (
          <Button
            type="button"
            variant="contained"
            className="submit-btn"
            disabled={!reasonId || (updateTicketInfo && updateTicketInfo.loading)}
            onClick={() => putOnhold()}
          >
            {isApproval ? 'Approve' : 'Confirm'}
          </Button>
        )}
        {!isApproval && createDurationInfo && !createDurationInfo.err && !createDurationInfo.data && (
          <Button
            type="button"
            variant="contained"
            disabled={!reasonId || !reasonValue || (updateTicketInfo && updateTicketInfo.loading) || (createDurationInfo && createDurationInfo.loading) || (!onHoldDate && isPPM)}
            className="submit-btn"
            onClick={() => storeReason()}
          >
            {(isTicket || isPPM) ? 'Confirm' : 'On-Hold'}
          </Button>
        )}
        {!isReject && onHoldApproval && !onHoldApproval.data && createDurationInfo && !createDurationInfo.err && !createDurationInfo.data && wId && isTicket && isApproval && (
          <Button
            type="button"
            variant="contained"
            disabled={!reasonId || !reasonValue || (updateTicketInfo && updateTicketInfo.loading) || (createDurationInfo && createDurationInfo.loading)}
            className="submit-btn"
            onClick={() => storeReason()}
          >
            Approve
          </Button>
        )}
        {!isReject && onHoldApproval && !onHoldApproval.data && createDurationInfo && !createDurationInfo.err && !createDurationInfo.data && isPPM && isApproval && (
          <Button
            type="button"
            variant="contained"
            disabled={!onHoldDate || !reasonId || (updateTicketInfo && updateTicketInfo.loading) || (createDurationInfo && createDurationInfo.loading)}
            className="submit-btn"
            onClick={() => storeReason()}
          >
            Approve
          </Button>
        )}
        {!isPPM && (createDurationInfo && (createDurationInfo.data || createDurationInfo.err)) && ((wId && isTicket) || (!wId && !isTicket)) && (
          <Button
            type="button"
            variant="contained"
            className="submit-btn"
            onClick={toggle}
          >
            Ok
          </Button>
        )}
        {createDurationInfo && (createDurationInfo.data || createDurationInfo.err) && isPPM && (
          <Button
            type="button"
            variant="contained"
            className="submit-btn"
            onClick={toggle}
          >
            Ok
          </Button>
        )}
        {!isApproval && (isTicket || isPPM) && !wId && updateTicketInfo && (updateTicketInfo.data || updateTicketInfo.err || (onHoldApproval && onHoldApproval.data)) && (

          <Button
            type="button"
            variant="contained"
            className="submit-btn"
            onClick={toggle}
          >
            Ok
          </Button>
        )}
        {isApproval && !(createDurationInfo && createDurationInfo.data) && (isTicket || isPPM) && updateTicketInfo && (updateTicketInfo.data || updateTicketInfo.err || (onHoldApproval && onHoldApproval.data)) && (

          <Button
            type="button"
            variant="contained"
            className="submit-btn"
            onClick={toggle}
          >
            Ok
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

PauseWorkorder.defaultProps = {
  isTicket: false,
  isPPM: false,
  wId: false,
  tId: false,
};

PauseWorkorder.propTypes = {
  details: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  pauseActionModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  actionText: PropTypes.string.isRequired,
  actionCode: PropTypes.string.isRequired,
  atFinish: PropTypes.func.isRequired,
  isTicket: PropTypes.bool,
  isPPM: PropTypes.bool,
  wId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
  ]),
  tId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
  ]),
};
export default PauseWorkorder;
