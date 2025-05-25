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
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@mui/material/Tooltip';
import DOMPurify from 'dompurify';

import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';

import { IoCloseOutline } from 'react-icons/io5';
import * as PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment-timezone';

import trackerIcon from '@images/icons/breakTrackerBlue.svg';
import SuccessAndErrorFormat from '@shared/successAndErrorFormatMui';
import Loader from '@shared/loading';

import {
  getDefaultNoValue, generateErrorMessage,
  extractNameObject,
  isValidValue,
  getAllowedCompanies, getCompanyTimezoneDate,
} from '../../util/appUtils';
import {
  getOnHoldRequest,
  getTrackerDetail,
} from '../breakdownService';
import {
  getPauseReasons,
} from '../../workorders/workorderService';
import MuiAutoCompleteStatic from '../../commonComponents/formFields/muiAutocompleteStatic';
import DialogHeader from '../../commonComponents/dialogHeader';

const appModels = require('../../util/appModels').default;

const OnHoldRequest = (props) => {
  const {
    detailData, actionModal, atFinish, atCancel,
  } = props;
  const dispatch = useDispatch();
  const [modal, setModal] = useState(actionModal);

  const [messageTicket, setMessageTicket] = useState('');
  const [reasonKeyword, setReasonKeyword] = useState('');

  const [reasonId, setReasonId] = useState('');
  const [reasonOpen, setReasonOpen] = useState(false);

  const [timeoutLoading, setTimeoutLoading] = useState(false);

  const onMessageChange = (e) => {
    setMessageTicket(e.target?.value?.trimStart() || '');
  };

  const { btOnHoldRequest } = useSelector((state) => state.breakdowntracker);

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const {
    pauseReasons,
  } = useSelector((state) => state.workorder);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      dispatch(getPauseReasons(companies, appModels.ORDERPAUSEREASONS, reasonKeyword, 'On-hold', false));
    }
  }, [userInfo, reasonKeyword]);

  const toggle = () => {
    if (btOnHoldRequest && btOnHoldRequest.data) {
      dispatch(getTrackerDetail(detailData.id, appModels.BREAKDOWNTRACKER));
    }
    atFinish();
  };

  const toggleCancel = () => {
    setModal(!modal);
    atCancel();
  };

  const loading = (btOnHoldRequest && btOnHoldRequest.loading) || timeoutLoading;

  const handleStateChange = (id) => {
    try {
      if (id) {
        const postData = {
          is_on_hold_requested: 'True',
          pause_reason_id: reasonId && reasonId.id ? reasonId.id : false,
          on_hold_requested_on: moment().utc().format('YYYY-MM-DD HH:mm:ss'),
          on_hold_requested_command: DOMPurify.sanitize(messageTicket),
        };
        dispatch(getOnHoldRequest(id, postData));
      }
    } catch (error) {
      console.error('Error updating reason or changing state:', error);
    } finally {
      // Set loading to false once everything is complete
      setTimeoutLoading(false);
    }
  };

  const onReasonClear = () => {
    setReasonKeyword(null);
    setReasonId('');
    setReasonOpen(false);
  };

  const onReasonChange = (value) => {
    setReasonId(value);
  };

  return (

    <Dialog maxWidth="lg" minWidth="lg" open={actionModal}>
      <DialogHeader title="Request On-Hold" onClose={toggleCancel} response={btOnHoldRequest} />
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
            <Card className="border-5 mt-0 ml-4 mb-2 mr-4 border-secondary rounded-0 border-top-0 border-right-0 border-bottom-0">
              {detailData && (
                <CardBody data-testid="success-case" className="bg-lightblue p-3" style={{ backgroundColor: '#F6F8FA' }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                    <img src={trackerIcon} alt="asset" width="40" height="35" style={{ alignSelf: 'flex-start' }} />
                    <Box>
                      <Typography variant="h6" sx={{ fontSize: '1rem' }} className="mb-1">
                        {getDefaultNoValue(detailData.name)}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" className="font-family-tab">
                        <span className="font-weight-800 font-family-tab font-side-heading mr-1">Type: </span>
                        {getDefaultNoValue(detailData.type)}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" className="font-family-tab">
                        <span className="font-weight-800 font-family-tab font-side-heading mr-1">Priority: </span>
                        {getDefaultNoValue(detailData.priority)}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" className="font-family-tab">
                        <span className="font-weight-800 font-family-tab font-side-heading mr-1">Incident On: </span>
                        {getDefaultNoValue(getCompanyTimezoneDate(detailData.incident_date, userInfo, 'datetime'))}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" className="font-family-tab">
                        <span className="font-weight-800 font-family-tab font-side-heading mr-1">
                          {detailData.type === 'Space' ? 'Space' : 'Equipment'}
                          :
                          {' '}
                        </span>
                        {getDefaultNoValue(detailData.type === 'Space'
                          ? extractNameObject(detailData.space_id, 'path_name') : extractNameObject(detailData.equipment_id, 'name'))}
                      </Typography>
                    </Box>
                  </Box>
                </CardBody>
              )}
            </Card>
            {btOnHoldRequest && !btOnHoldRequest.data && !loading && (
              <Row className="ml-2 mr-2 mt-0">
                <Col xs={12} sm={12} md={12} lg={12} className="col-auto">
                  <MuiAutoCompleteStatic
                    sx={{
                      marginTop: 'auto',
                      marginBottom: '10px',
                    }}
                    name="reason_id"
                    label="Reason"
                    open={reasonOpen}
                    value={reasonId && reasonId.name ? reasonId.name : ''}
                    apiError={(pauseReasons && pauseReasons.err) ? generateErrorMessage(pauseReasons) : false}
                    setValue={onReasonChange}
                    onOpen={() => {
                      setReasonOpen(true);
                      setReasonKeyword('');
                    }}
                    onClose={() => {
                      setReasonOpen(false);
                      setReasonKeyword('');
                    }}
                    loading={pauseReasons && pauseReasons.loading}
                    getOptionSelected={(option, value) => option.name === value.name}
                    getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                    options={pauseReasons && pauseReasons.data ? pauseReasons.data : []}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        onChange={(e) => setReasonKeyword(e.target.value)}
                        variant="standard"
                        label={(
                          <>
                            <span className="font-family-tab">Reason</span>
                            {' '}
                            <span className="text-danger text-bold">*</span>
                          </>
                          )}
                        value={reasonKeyword}
                        className={((reasonId && reasonId.name) || (reasonKeyword && reasonKeyword.length > 0))
                          ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                        placeholder="Search & Select Reason"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {pauseReasons && pauseReasons.loading ? <CircularProgress color="inherit" size={20} /> : null}
                              <InputAdornment position="end">
                                {((reasonId && reasonId.name) || (reasonKeyword && reasonKeyword.length > 0)) && (
                                <Tooltip title="Clear" fontSize="small">
                                  <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={onReasonClear}
                                  >
                                    <IoCloseOutline size={22} fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                )}

                              </InputAdornment>
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                </Col>
                <Col xs={12} sm={12} md={12} lg={12} className="col-auto">
                  <Label className="mt-0 font-family-tab font-tiny font-weight-400" style={{ color: 'rgba(0, 0, 0, 0.54)' }}>
                    Remarks
                    {' '}
                    <span className="ml-1 text-danger font-weight-800"> * </span>
                  </Label>
                  <Input type="textarea" name="body" label="Action Taken" placeholder="Enter here" value={messageTicket} onChange={onMessageChange} className="bg-whitered" rows="2" />
                </Col>
              </Row>
            )}
            <Row className="justify-content-center font-family-tab">
              {btOnHoldRequest && btOnHoldRequest.data && !loading && (
                <SuccessAndErrorFormat response={btOnHoldRequest} successMessage="The Request for On-Hold has been raised." />
              )}
              {btOnHoldRequest && btOnHoldRequest.err && (
                <SuccessAndErrorFormat response={btOnHoldRequest} />
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
        {btOnHoldRequest && btOnHoldRequest.data
          ? ''
          : (
            <Button
              type="button"
              variant="contained"
              className="submit-btn-auto"
              disabled={loading || !(reasonId && reasonId.name) || !isValidValue(messageTicket)}
              onClick={() => handleStateChange(detailData.id)}
            >
              Request
            </Button>
          )}
        {(btOnHoldRequest && btOnHoldRequest.data
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

OnHoldRequest.propTypes = {
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
export default OnHoldRequest;
