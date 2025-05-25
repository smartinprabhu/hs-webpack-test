/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */
/* eslint-disable radix */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useRef } from 'react';
import {
  Card,
  CardBody,
  Col,
  Row,
  Input,
  Label,
} from 'reactstrap';
import moment from 'moment-timezone';
import DOMPurify from 'dompurify';
import * as PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import {
  faEnvelope, faCheckCircle, faTimesCircle,
  faSignOut,
} from '@fortawesome/free-solid-svg-icons';
import {
  Box,
  Dialog, DialogActions, DialogContent, DialogContentText,
  Button,
} from '@mui/material';

import survey from '@images/icons/workPermitBlue.svg';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';

import {
  getDefaultNoValue, extractNameObject,
  getCompanyTimezoneDate,
  queryGeneratorWithUtc,
  getAllowedCompanies,
  integerKeyPress,
} from '../../util/appUtils';
import {
  getGpAction, resetGpActionInfo, getGatePassDetails, getGatePass, updateGatePass,
} from '../gatePassService';
import DialogHeader from '../../commonComponents/dialogHeader';
import MuiNoFormTextField from '../../commonComponents/formFields/muiNoFormTextField';
import { gatePassStatusJson } from '../../commonComponents/utils/util';
import { getCustomButtonName, getCustomGatePassStatusName } from '../utils/utils';

const appModels = require('../../util/appModels').default;

const faIcons = {
  REJECT: faTimesCircle,
  RETURNAPPROVE: faEnvelope,
  APPROVE: faCheckCircle,
  RETURN: faCheckCircle,
  EXITED: faSignOut,
};

const Actions = (props) => {
  const {
    detailData, statusName, offset, actionModal, atFinish, atCancel, actionMethod, displayName, actionButton, actionMsg, message,
  } = props;
  const dispatch = useDispatch();
  const [modal, setModal] = useState(actionModal);

  const [messageTicket, setMessageTicket] = useState('');

  const [resName, setResName] = useState('');
  const [resMobile, setResMobile] = useState('');
  const [resEmail, setResEmail] = useState('');
  const [isReject, setIsReject] = useState(false);
  const [isExit, setIsExit] = useState(false);

  const [timeoutLoading, setTimeoutLoading] = useState(false);

  const onMessageChange = (e) => {
    setMessageTicket(e.target.value);
  };

  const onNameChange = (field, data) => {
    setResName(data);
  };

  const onMobileChange = (field, data) => {
    setResMobile(data);
  };

  const onMailChange = (field, data) => {
    setResEmail(data);
  };

  const { gatePassAction, gatePassFilters, gatePassConfig } = useSelector((state) => state.gatepass);

  const gpConfig = gatePassConfig && gatePassConfig.data && gatePassConfig.data.length ? gatePassConfig.data[0] : false;

  const {
    sortedValue,
  } = useSelector((state) => state.equipment);

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);

  const handleStateChange = (id, state) => {
    if (displayName === 'Approve' || displayName === 'Reject' || displayName === 'Return' || displayName === 'Exit' || displayName === 'Return Approval') {
      let payload = {
        reason: DOMPurify.sanitize(messageTicket),
      };

      if (state === 'action_rejected') {
        setIsReject(true);
      } else {
        setIsReject(false);
      }

      if (state === 'action_exited' && displayName === 'Return Approval') {
        setIsExit(true);
      } else {
        setIsExit(false);
      }

      if (displayName === 'Return') {
        payload = {
          receiver_name: resName,
          receiver_email: resEmail,
          receiver_mobile: resMobile,
          reason: DOMPurify.sanitize(messageTicket),
          bearer_return_on: moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss'),
        };
      }

      dispatch(updateGatePass(detailData.id, appModels.GATEPASS, payload, 'yes'));
      setTimeoutLoading(true);
      setTimeout(() => {
        dispatch(getGpAction(id, state, appModels.GATEPASS));
        setTimeoutLoading(false);
      }, 1500);
    } else {
      dispatch(getGpAction(id, state, appModels.GATEPASS));
    }
  };

  const toggle = () => {
    setModal(!modal);
    if (displayName === 'Approve' || displayName === 'Reject' || displayName === 'Return Approval' || displayName === 'Return' || displayName === 'Exit') {
      setTimeout(() => {
        dispatch(getGatePassDetails(detailData.id, appModels.GATEPASS));
      }, 1500);
    } else {
      dispatch(getGatePassDetails(detailData.id, appModels.GATEPASS));
    }
    const customFiltersList = gatePassFilters.customFilters ? queryGeneratorWithUtc(gatePassFilters.customFilters, false, userInfo.data) : '';
    dispatch(getGatePass(companies, appModels.GATEPASS, 10, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField));
    dispatch(resetGpActionInfo());
    atFinish();
    setIsReject(false);
    setIsExit(false);
  };

  const toggleCancel = () => {
    setModal(!modal);
    dispatch(resetGpActionInfo());
    atCancel();
    setIsReject(false);
    setIsExit(false);
  };

  const loading = (gatePassAction && gatePassAction.loading) || timeoutLoading;

  const checkGatePassStatus = (val) => (
    <Box>
      {gatePassStatusJson.map(
        (status) => val === status.status && (
        <Box
          sx={{
            backgroundColor: status.backgroundColor,
            padding: '4px 8px 4px 8px',
            border: 'none',
            borderRadius: '4px',
            color: status.color,
            fontFamily: 'Suisse Intl',
          }}
        >
          {getCustomGatePassStatusName(val, gpConfig)}
        </Box>
        ),
      )}
    </Box>
  );

  const mailRegEx = /[_a-zA-Z0-9.-]+(\.[_a-z0-9-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,})$/;

  const isResRequired = ((gpConfig && gpConfig.receiver_name === 'Required' && !resName) || (gpConfig && gpConfig.receiver_mobile === 'Required' && (!resMobile || (resMobile && resMobile.length < 10))) || (resEmail && !mailRegEx.test(resEmail)));

  return (
    <Dialog maxWidth="xl" open={actionModal}>
      <DialogHeader fontAwesomeIcon={faIcons[message]} title={getCustomButtonName(displayName, gpConfig)} onClose={toggleCancel} response={gatePassAction} />
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Box
            sx={{
              width: '600px',
              height: '100%',
              backgroundColor: '#F6F8FA',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10%',
              fontFamily: 'Suisse Intl',
            }}
          >
            <Card className="border-5 mt-0 ml-4 mb-4 mr-4 border-secondary rounded-0 border-top-0 border-right-0 border-bottom-0">
              {detailData && (
                <CardBody data-testid="success-case" className="bg-lightblue p-3">
                  <Row>
                    <Col md="1" xs="1" sm="1" lg="2">
                      <img src={survey} alt="asset" className="mt-1" width="40" height="35" />
                    </Col>
                    <Col md="8" xs="8" sm="8" lg="8" className="ml-12">
                      <Row>
                        <h6 className="mb-1">
                          {getDefaultNoValue(detailData.description)}
                        </h6>
                      </Row>
                      <Row>
                        <Col md="12" xs="12" sm="12" lg="12" className="p-0">
                          <span className="font-weight-800 font-side-heading mr-1">
                            {gpConfig && gpConfig.reference_display ? gpConfig.reference_display : 'Reference'}
                            {' '}
                            :
                          </span>
                          <span className="font-weight-400">
                            {getDefaultNoValue((detailData.reference))}
                          </span>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="12" xs="12" sm="12" lg="12" className="p-0">
                          <span className="font-weight-800 font-side-heading mr-1">
                            Requestor :
                          </span>
                          <span className="font-weight-400">
                            {getDefaultNoValue(extractNameObject(detailData.requestor_id, 'name'))}
                          </span>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="12" xs="12" sm="12" lg="12" className="p-0">
                          <span className="font-weight-800 font-side-heading mr-1">
                            Requested on :
                          </span>
                          <span className="font-weight-400">
                            {getDefaultNoValue(getCompanyTimezoneDate(detailData.requested_on, userInfo, 'datetime'))}
                          </span>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="12" xs="12" sm="12" lg="12" className="p-0">
                          <Box
                            sx={{
                              display: 'flex',
                              gap: '10px',
                              alignItems: 'center',
                              marginBottom: '5px',
                            }}
                          >
                            <span className="font-weight-800 font-side-heading">
                              Status:
                            </span>
                            {getDefaultNoValue(
                              gatePassAction && gatePassAction.data && gatePassAction.data.status
                                ? checkGatePassStatus(isReject ? 'Rejected' : isExit ? 'Exited' : statusName)
                                : checkGatePassStatus(detailData.state),
                            )}
                          </Box>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </CardBody>
              )}
            </Card>
            {gatePassAction && !gatePassAction.data && !loading && (displayName === 'Approve' || displayName === 'Reject' || displayName === 'Return Approval' || displayName === 'Exit') && (
              <Row className="ml-2 mr-2 mt-0">
                <Col md="12" xs="12" sm="12" lg="12">
                  <Label className="mt-0">
                    Remarks
                    {' '}
                    <span className="ml-1 text-danger">{displayName === 'Exit' ? '' : '*'}</span>
                  </Label>
                  <Input type="textarea" name="body" label="Action Taken" placeholder="Enter Remarks" value={messageTicket} onChange={onMessageChange} className="bg-whitered form-text-area" rows="4" style={{ width: '517px' }} />
                  {displayName !== 'Exit' && !messageTicket && (<span className="text-danger ml-1" style={{ fontSize: 'small' }}>Remarks required</span>)}
                </Col>
              </Row>
            )}
            {((gpConfig && gpConfig.receiver_name !== 'None') || (gpConfig && gpConfig.receiver_mobile !== 'None')) && gatePassAction && !gatePassAction.data && !loading && (displayName === 'Return') && (
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                gap: '3%',
              }}
            >

              {gpConfig && gpConfig.receiver_name !== 'None' && (
              <Box
                sx={{
                  width: '30%',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <MuiNoFormTextField
                  sx={{
                    marginTop: 'auto',
                    marginBottom: 'auto',
                  }}
                  name="receiver_name"
                  label="Receiver Name"
                  formGroupClassName="m-1"
                  isRequired={gpConfig && gpConfig.receiver_name === 'Required'}
                  type="text"
                  inputProps={{ maxLength: 50 }}
                  setFieldValue={onNameChange}
                  customError={gpConfig && gpConfig.receiver_name === 'Required' && !resName ? 'Receiver Name required' : ''}
                />
              </Box>
              )}
              <Box
                sx={{
                  width: '30%',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <MuiNoFormTextField
                  sx={{
                    marginTop: 'auto',
                    marginBottom: 'auto',
                  }}
                  name="receiver_email"
                  label="Receiver Email"
                  formGroupClassName="m-1"
                  type="email"
                  inputProps={{ maxLength: 50 }}
                  setFieldValue={onMailChange}
                  customError={resEmail && !mailRegEx.test(resEmail) ? 'Invalid Email ID' : ''}
                />
              </Box>
              {gpConfig && gpConfig.receiver_mobile !== 'None' && (
              <Box
                sx={{
                  width: '30%',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <MuiNoFormTextField
                  sx={{
                    marginTop: 'auto',
                    marginBottom: 'auto',
                  }}
                  name="receiver_mobile"
                  label="Receiver Mobile"
                  formGroupClassName="m-1"
                  onKeyPress={integerKeyPress}
                  isRequired={gpConfig && gpConfig.receiver_mobile === 'Required'}
                  type="text"
                  inputProps={{ maxLength: 12 }}
                  setFieldValue={onMobileChange}
                  customError={gpConfig && gpConfig.receiver_mobile === 'Required' && (!resMobile || (resMobile && resMobile.length < 10)) ? 'Receiver Mobile required' : ''}
                />
              </Box>
              )}
            </Box>
            )}
            {gatePassAction && !gatePassAction.data && !loading && (displayName === 'Return') && (
            <Row className="ml-2 mr-2 mt-0">
              <Col md="12" xs="12" sm="12" lg="12">
                <Label className="mt-0">
                  Remarks
                </Label>
                <Input type="textarea" name="body" label="Action Taken" placeholder="Enter Remarks" value={messageTicket} onChange={onMessageChange} className="bg-whitered form-text-area" rows="4" style={{ width: '517px' }} />
              </Col>
            </Row>
            )}
            <Row className="justify-content-center align-items-center">
              {gatePassAction && gatePassAction.data && gatePassAction.data.status && !loading && (
                <SuccessAndErrorFormat response={gatePassAction} successMessage={`This Gatepass has been ${isReject ? getCustomGatePassStatusName('Rejected', gpConfig) : getCustomGatePassStatusName(isExit ? 'Return Rejected' : statusName, gpConfig)} successfully..`} />
              )}
              {gatePassAction && gatePassAction.err && (
                <SuccessAndErrorFormat response={gatePassAction} />
              )}
              {loading && (
                // <CardBody className="mt-4" data-testid="loading-case" >
                <Loader sx={{ paddingBottom: '20px' }} />
              // </CardBody>
              )}
            </Row>
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions className="mr-3 ml-3">
        {gatePassAction && gatePassAction.data && gatePassAction.data.status
          ? ''
          : (
            <>
              {displayName === 'Approve' && (
              <Button
                type="button"
                disabled={
                loading
                || !messageTicket
              }
                variant="contained"
                className={loading || !messageTicket ? 'reset-btn-disabled' : 'reset-btn-new'}
                onClick={() => handleStateChange(detailData.id, 'action_rejected')}
                style={{ width: 'auto', height: '40px' }}
              >
                {getCustomButtonName('Reject', gpConfig)}
              </Button>
              )}
              {displayName === 'Return Approval' && (
              <Button
                type="button"
                disabled={loading || !messageTicket}
                variant="contained"
                className={loading || !messageTicket ? 'reset-btn-disabled' : 'reset-btn-new'}
                onClick={() => handleStateChange(detailData.id, 'action_exited')}
                style={{ width: 'auto', height: '40px' }}
              >
                {getCustomButtonName('Return Reject', gpConfig)}
              </Button>
              )}
              <Button
                type="button"
                disabled={
                loading
                || (displayName === 'Approve' && !messageTicket)
                || (displayName === 'Reject' && !messageTicket)
                || (displayName === 'Return Approval' && !messageTicket)
                || (displayName === 'Return' && isResRequired)
              }
                variant="contained"
                onClick={() => handleStateChange(detailData.id, actionMethod)}
                style={{ width: 'auto', height: '40px' }}
              >
                {getCustomButtonName(actionButton, gpConfig)}
              </Button>
            </>
          )}
        {(gatePassAction && gatePassAction.data && gatePassAction.data.status
          && (
            <Button
              type="button"
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

Actions.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  actionModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  actionMethod: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  displayName: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  message: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  actionButton: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  actionMsg: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  statusName: PropTypes.oneOfType([
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
export default Actions;
