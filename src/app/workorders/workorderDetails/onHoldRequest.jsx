/* eslint-disable radix */
/* eslint-disable react/prop-types */
/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import {
  Box, Dialog, FormControl, Button, DialogActions, DialogContent, DialogContentText,
} from '@mui/material';
import moment from 'moment-timezone';
import * as PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Label,
  Card,
  CardBody,
  Col,
  Input,
  Row,
} from 'reactstrap';
import DOMPurify from 'dompurify';
import { ThemeProvider } from '@material-ui/core/styles';
import { Autocomplete } from '@material-ui/lab';
import { TextField, CircularProgress, FormHelperText } from '@material-ui/core';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';

import workorderLogo from '@images/icons/workOrders.svg';
import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import DialogHeader from '../../commonComponents/dialogHeader';
import {
  resetPPMOnHoldRequest,
  getOrderDetail,
  getPPMOnHoldRequest,
  getPauseReasons,
} from '../workorderService';
import {
  getDefaultNoValue,
  getAllowedCompanies,
  generateErrorMessage,
  getCompanyTimezoneDate,
  getDateTimeUtcMuI,
} from '../../util/appUtils';
import theme from '../../util/materialTheme';
import { getWorkOrderStateLabel } from '../utils/utils';

const appModels = require('../../util/appModels').default;

const OnHoldRequest = React.memo((props) => {
  const {
    details, ppmData, ppmConfig, ohRequestModal, atFinish,
  } = props;
  const dispatch = useDispatch();
  const [model, setModal] = useState(ohRequestModal);
  const [reasonId, setReasonId] = useState(false);
  const [reasonKeyword, setReasonKeyword] = useState('');
  const [messageTicket, setMessageTicket] = useState('');
  const {
    ppmOnholdRequest,
    pauseReasons,
  } = useSelector((state) => state.workorder);
  const { userInfo } = useSelector((state) => state.user);

  const [error, setError] = React.useState(false);
  const [onHoldDate, setOnHoldDate] = useState(null);

  console.log(error);

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
    dispatch(resetPPMOnHoldRequest());
  }, []);

  function getEndTime() {
    const duration = reasonId && reasonId.grace_period ? parseInt(reasonId.grace_period) : 1;
    const ppmEndDate = ppmData && ppmData.ends_on ? moment.utc(ppmData.ends_on).local().format('YYYY-MM-DD') : false;
    const endDate = moment(new Date(ppmEndDate)).utc().add(duration, duration > 1 ? 'days' : 'day').format('YYYY-MM-DD');
    return dayjs(endDate);
  }

  useEffect(() => {
    if (reasonId && reasonId.id) {
      setOnHoldDate(getEndTime());
    }
  }, [reasonId]);

  const onDateChange = (e) => {
    setError(false);
    setOnHoldDate(e);
  };

  const companies = getAllowedCompanies(userInfo);

  const userCompanyId = userInfo && userInfo.data && userInfo.data.company ? userInfo.data.company.id : '';
  const userParentId = userInfo && userInfo.data && userInfo.data.company.parent_id ? userInfo.data.company.parent_id.id : '';

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
      dispatch(getPauseReasons(companies, appModels.ORDERPAUSEREASONS, reasonKeyword, 'On-hold', domain));
    }
  }, [userInfo, reasonKeyword]);

  const detailData = details && (details.data && details.data.length > 0) ? details.data[0] : '';

  const toggle = () => {
    const viewId = details && details.data ? details.data[0].id : '';
    if (viewId && ppmOnholdRequest && ppmOnholdRequest.data) {
      dispatch(getOrderDetail(viewId, appModels.ORDER));
    }
    dispatch(resetPPMOnHoldRequest());
    setModal(!model);
    atFinish();
  };

  const onMessageChange = (e) => {
    setMessageTicket(e.target.value);
  };

  const onReasonKeyWordChange = (e) => {
    setReasonKeyword(e.target.value);
  };

  function getMaxEndTime() {
    const maxValue1 = ppmConfig && ppmConfig.on_hold_max_grace_period ? parseInt(ppmConfig.on_hold_max_grace_period) : 30;
    const duration = reasonId && reasonId.grace_period ? parseInt(reasonId.grace_period) : maxValue1;
    const ppmEndDate = ppmData && ppmData.ends_on ? moment.utc(ppmData.ends_on).local().format('YYYY-MM-DD') : false;
    let endDate = moment(new Date(ppmEndDate)).utc().add(duration, duration > 1 ? 'days' : 'day').format('YYYY-MM-DD');
    if (reasonId && reasonId.is_can_vverride && ppmConfig && ppmConfig.on_hold_max_grace_period) {
      const maxValue = ppmConfig && ppmConfig.on_hold_max_grace_period ? parseInt(ppmConfig.on_hold_max_grace_period) : 0;
      endDate = moment(new Date(ppmEndDate)).utc().add(maxValue, maxValue > 1 ? 'days' : 'day').format('YYYY-MM-DD');
    }
    return dayjs(endDate);
  }

  const sendClose = () => {
    const id = ppmData && ppmData.id ? ppmData.id : false;
    if (id) {
      let holdDate = onHoldDate || false;
      if (holdDate) {
        holdDate = getDateTimeUtcMuI(onHoldDate);
      }
      const postData = {
        is_on_hold_requested: 'True',
        on_hold_end_date: holdDate,
        pause_reason_id: reasonId && reasonId.id ? reasonId.id : false,
        on_hold_requested_by: detailData.employee_id && detailData.employee_id.length ? detailData.employee_id[1] : false,
        on_hold_requested_email: userInfo && userInfo.data && userInfo.data.email && userInfo.data.email.email ? userInfo.data.email.email : '',
        on_hold_requested_on: moment().utc().format('YYYY-MM-DD HH:mm:ss'),
        on_hold_requested_command: DOMPurify.sanitize(messageTicket),
      };
      dispatch(getPPMOnHoldRequest(id, postData));
    }
  };

  const loading = (ppmOnholdRequest && ppmOnholdRequest.loading);

  return (
    <Dialog maxWidth="md" open={model}>
      <DialogHeader title="Request On-Hold" onClose={toggle} response={ppmOnholdRequest} imagePath={workorderLogo} />
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
            <Row className="ml-4 mr-4 mb-0">
              <Col sm="12" md="12" lg="12" xs="12">
                <Card className="border-5 ml-4 mb-4 mr-4 border-secondary rounded-0 border-top-0 border-right-0 border-bottom-0">
                  {detailData && (
                  <CardBody className="bg-lightblue p-3">
                    <Row>
                      <Col md="2" xs="2" sm="2" lg="2">
                        <img src={workorderLogo} alt="asset" className="mt-2" width="35" height="35" />
                      </Col>
                      <Col md="8" xs="8" sm="8" lg="8" className="ml-4">
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
                </Card>
                {(ppmOnholdRequest && !ppmOnholdRequest.data) && (
                <Row className="mt-2">
                  <ThemeProvider theme={theme}>
                    <Col xs={12} sm={12} md={12} lg={12}>
                      <Label for="product_id">
                        On-Hold
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
                            className="without-padding bg-white"
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
                      {!reasonId && (<span className="text-danger ml-1">Reason required</span>)}
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={12} className="mt-2">
                      <Label for="actual_duration">
                        Remarks
                        <span className="text-danger ml-1">*</span>
                      </Label>
                      <Input type="textarea" name="body" placeholder="Enter here" value={messageTicket} onChange={onMessageChange} className="bg-whitered" rows="2" />
                      {!messageTicket && (<span className="text-danger ml-1">Remarks required</span>)}
                    </Col>
                    {reasonId && reasonId.id && (
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
                              minDate={ppmData && ppmData.ends_on ? dayjs(moment.utc(ppmData.ends_on).local().add(1, 'day').tz(userInfo?.data?.timezone)
                                .format('YYYY-MM-DD')) : dayjs(moment(new Date()).tz(userInfo?.data?.timezone).format('YYYY-MM-DD'))}
                              maxDate={getMaxEndTime()}
                              sx={{ width: '100%' }}
                              localeText={{ todayButtonLabel: 'Now' }}
                              onError={(newError) => setError(newError)}
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
                      {reasonId && reasonId.grace_period > 0 && (
                      <span className="text-info mt-1">
                        You can place this PPM on hold for a maximum of
                          {' '}
                        {!reasonId.is_can_vverride ? reasonId.grace_period : ppmConfig && ppmConfig.on_hold_max_grace_period}
                        {' '}
                        days..
                      </span>
                      )}
                    </Col>
                    )}
                  </ThemeProvider>
                </Row>
                )}
              </Col>
            </Row>
            {loading && (
            <div className="text-center mt-3">
              <Loader />
            </div>
            )}
            {(ppmOnholdRequest && ppmOnholdRequest.err) && (
            <SuccessAndErrorFormat response={ppmOnholdRequest} />
            )}
            {ppmOnholdRequest && ppmOnholdRequest.data && !loading && (
            <SuccessAndErrorFormat response={ppmOnholdRequest} successMessage="The Request for On Hold has been raised." />
            )}
            <hr className="mb-0" />
          </Box>
        </DialogContentText>
      </DialogContent>
      {!(ppmOnholdRequest && ppmOnholdRequest.data) && ppmData && ppmData.ends_on && (
      <p className="text-primary text-center mb-1 pr-3 pl-3">
        Approval is required to place this PPM On-Hold Your Approval request will be valid until
        {' '}
        {getCompanyTimezoneDate(ppmData.ends_on, userInfo, 'date')}
      </p>
      )}
      <DialogActions>
        {!(ppmOnholdRequest && ppmOnholdRequest.data) && (
        <Button
          type="button"
          variant="contained"
          className="submit-btn"
          disabled={!reasonId || !messageTicket || (ppmOnholdRequest && ppmOnholdRequest.data) || loading}
          onClick={() => sendClose()}
        >
          Request

        </Button>
        )}
        {(ppmOnholdRequest && ppmOnholdRequest.data) && (
        <Button
          type="button"
          variant="contained"
          className="submit-btn"
          onClick={() => toggle()}
          disabled={loading}
        >
          OK
        </Button>
        )}
      </DialogActions>
    </Dialog>

  );
});

OnHoldRequest.propTypes = {
  details: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  ohRequestModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  atFinish: PropTypes.func.isRequired,
};
export default OnHoldRequest;
