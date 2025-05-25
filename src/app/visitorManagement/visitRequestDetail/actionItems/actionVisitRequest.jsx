/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardBody,
  Col,
  Row,
  Input,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import {
  Dialog, DialogActions, DialogContent, DialogContentText,
  Button,
} from '@mui/material';
import { Box } from '@mui/system';
import DOMPurify from 'dompurify';
import moment from 'moment';

import visitRequest from '@images/icons/visitRequest.svg';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';
import {
  faCheckCircle, faTimesCircle, faWindowClose, faCheck, faArrowCircleRight,
} from '@fortawesome/free-solid-svg-icons';
import {
  getDefaultNoValue,
  getListOfOperations,
} from '../../../util/appUtils';
import {
  getVisitorRequestDetail, visitStateChange, timeElapsedDetails,
} from '../../visitorManagementService';
import DialogHeader from '../../../commonComponents/dialogHeader';
import {
  updateTenantNo, resetUpdateVisitor,
} from '../../../adminSetup/setupService';
import actionCodes from '../../data/actionCodes.json';

const appModels = require('../../../util/appModels').default;

const faIcons = {
  Approved: faCheckCircle,
  'Check In': faCheck,
  'Check Out': faArrowCircleRight,
  Cancelled: faTimesCircle,
  Rejected: faWindowClose,
};

const ActionVisitRequest = (props) => {
  const {
    details, actionModal, actionText, actionCode, actionMessage, actionButton, atFinish, atReset,
  } = props;
  const dispatch = useDispatch();
  const [modal, setModal] = useState(actionModal);
  const [messageTicket, setMessageTicket] = useState('');

  const [timeoutLoading, setTimeoutLoading] = useState(false);

  /* const toggle = () => {
    setModal(!modal);
    atFinish();
  }; */
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const { stateChangeInfo, visitorRequestDetails, visitRequestUpdate } = useSelector((state) => state.visitorManagement);
  const { updateVisitor } = useSelector((state) => state.setup);

  const allowedOperations = getListOfOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'code');
  const isCheckinRemarks = allowedOperations.includes(actionCodes['Check In Remarks']);
  const isCheckOutRemarks = allowedOperations.includes(actionCodes['Check Out Remarks']);

  const toggle = () => {
    setModal(!modal);
    const viewId = (visitorRequestDetails && (visitorRequestDetails.data && visitorRequestDetails.data.length > 0) ? visitorRequestDetails.data[0].id : false);
    if ((userInfo && userInfo.data) && viewId && (stateChangeInfo && stateChangeInfo.data)) {
      dispatch(getVisitorRequestDetail(viewId, appModels.VISITREQUEST));
    } else if ((userInfo && userInfo.data) && viewId && (updateVisitor && updateVisitor.data)) {
      dispatch(getVisitorRequestDetail(viewId, appModels.VISITREQUEST));
    }
    dispatch(resetUpdateVisitor());
    atReset();
  };

  const onMessageChange = (e) => {
    setMessageTicket(e.target.value);
  };

  const visitorRequestData = details && (details.data && details.data.length > 0) ? details.data[0] : '';

  const getTimeElapsed = visitorRequestDetails && visitorRequestDetails.data && visitorRequestDetails.data.length && visitorRequestDetails.data[0].entry_status;

  const handleStateChange = (id, state) => {
    if (actionText === 'Check In' || actionText === 'Check Out' || actionText === 'Reject') {
      let payload = {};
      if (actionText === 'Check In') {
        if (isCheckinRemarks) {
          payload = {
            comment: DOMPurify.sanitize(messageTicket),
            actual_in: moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss'),
            entry_status: 'Checkin',
          };
        }
        if (!isCheckinRemarks) {
          payload = {
            actual_in: moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss'),
            entry_status: 'Checkin',
          };
        }
      }
      if (actionText === 'Check Out') {
        if (isCheckOutRemarks) {
          payload = {
            comment: DOMPurify.sanitize(messageTicket),
            actual_out: moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss'),
            entry_status: 'Checkout',
          };
        }
        if (!isCheckOutRemarks) {
          payload = {
            actual_out: moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss'),
            entry_status: 'Checkout',
          };
        }
      }
      if (actionText === 'Reject') {
        payload = {
          rejected_reason: DOMPurify.sanitize(messageTicket),
        };
      }
      dispatch(updateTenantNo(id, payload, appModels.VISITREQUEST));
      if (actionText === 'Reject') {
        setTimeoutLoading(true);
        setTimeout(() => {
          dispatch(visitStateChange(id, state, appModels.VISITREQUEST));
          setTimeoutLoading(false);
        }, 1500);
      }
      /* setTimeoutLoading(true);
      setTimeout(() => {
        dispatch(visitStateChange(id, state, appModels.VISITREQUEST));
        setTimeoutLoading(false);
      }, 1500); */
    } else {
      dispatch(visitStateChange(id, state, appModels.VISITREQUEST));
    }
  };

  useEffect(() => {
    if (stateChangeInfo && stateChangeInfo.data && visitorRequestDetails && visitorRequestDetails.data && getTimeElapsed === 'time_elapsed') {
      const postData = {
        time_elapsed_reason: DOMPurify.sanitize(messageTicket),
      };
      dispatch(timeElapsedDetails(visitorRequestDetails.data[0].id, postData, appModels.VISITREQUEST));
    }
  }, [stateChangeInfo, getTimeElapsed]);

  const loading = (details && details.loading) || (updateVisitor && updateVisitor.loading) || (stateChangeInfo && stateChangeInfo.loading) || timeoutLoading;
  const notUpdated = (stateChangeInfo && !stateChangeInfo.data) && (updateVisitor && !updateVisitor.data);
  const updated = ((stateChangeInfo && stateChangeInfo.data) || (updateVisitor && updateVisitor.data));

  return (
    <Dialog maxWidth="md" open={actionModal}>
      <DialogHeader fontAwesomeIcon={faIcons[actionText]} title={actionText} onClose={toggle} response={stateChangeInfo} />
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
            <Card className="border-5 mt-3 ml-4 mb-4 mr-4 border-secondary rounded-0 border-top-0 border-right-0 border-bottom-0">
              {details && (details.data && details.data.length > 0) && (
                <CardBody data-testid="success-case" className="bg-lightblue p-3">
                  <Row>
                    <Col className="col-auto">
                      <img src={visitRequest} alt="asset" className="mt-2" width="35" height="35" />
                    </Col>
                    <Col className="col-auto ml-3">
                      <Row>
                        <h6 className="mb-1">
                          {getDefaultNoValue(visitorRequestData.visitor_name)}
                        </h6>
                      </Row>
                      <Row>
                        <Col md="12" xs="12" sm="12" lg="12" className="p-0">
                          <span className="font-weight-800 font-side-heading mr-1">
                            Visitor Type :
                          </span>
                          <span className="font-weight-400">
                            {getDefaultNoValue(visitorRequestData.type_of_visitor)}
                          </span>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="12" xs="12" sm="12" lg="12" className="p-0">
                          <span className="font-weight-800 font-side-heading mr-1">
                            Email :
                          </span>
                          <span className="font-weight-400">
                            {getDefaultNoValue(visitorRequestData.email)}
                          </span>
                        </Col>
                      </Row>

                    </Col>
                  </Row>
                </CardBody>
              )}
            </Card>
            {notUpdated && (
              <>
                {isCheckOutRemarks && actionCode === 'action_checkout' && getTimeElapsed === 'time_elapsed' && (
                  <div>
                    <Input type="textarea" name="body" placeholder="Enter here" value={messageTicket} onChange={onMessageChange} className="mt-4 bg-whitered" rows="4" />
                    {!messageTicket && (<span className="text-danger ml-1">Reason required</span>)}
                  </div>
                )}
                {actionText === 'Check In' && isCheckinRemarks && (
                  <div>
                    <Input type="textarea" name="body" placeholder="Enter here" value={messageTicket} onChange={onMessageChange} className="mt-4 bg-whitered" rows="4" />
                    {!messageTicket && (<span className="text-danger ml-1">Reason required</span>)}
                  </div>
                )}
                {actionText === 'Check Out' && isCheckOutRemarks && getTimeElapsed !== 'time_elapsed' && (
                  <div>
                    <Input type="textarea" name="body" placeholder="Enter here" value={messageTicket} onChange={onMessageChange} className="mt-4 bg-whitered" rows="4" />
                    {!messageTicket && (<span className="text-danger ml-1">Reason required</span>)}
                  </div>
                )}
                {actionText === 'Reject' && (
                <div>
                  <Input type="textarea" name="body" placeholder="Enter here" value={messageTicket} onChange={onMessageChange} className="mt-4 bg-whitered" rows="4" />
                  {!messageTicket && (<span className="text-danger ml-1">Reason required</span>)}
                </div>
                )}
              </>
            )}
            <Row className="justify-content-center">
              {stateChangeInfo && stateChangeInfo.data && !loading ? (
                <SuccessAndErrorFormat response={stateChangeInfo} successMessage={`This visit request has been ${actionMessage} successfully..`} />
              ) : (
                <>
                  {updateVisitor && updateVisitor.data && !loading && (
                  <SuccessAndErrorFormat response={updateVisitor} successMessage={`This visit request has been ${actionMessage} successfully..`} />
                  )}
                </>
              )}
              {updateVisitor && updateVisitor.err && (
              <SuccessAndErrorFormat response={updateVisitor} />
              )}
              {stateChangeInfo && stateChangeInfo.err && (
              <SuccessAndErrorFormat response={stateChangeInfo} />
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
        {updated
          ? ''
          : (
            <Button
              type="button"
              variant="contained"
              size="sm"
              // disabled={loading}
              disabled={(actionText === 'Reject' && !messageTicket) || (isCheckinRemarks && actionText === 'Check In' && !messageTicket) || (isCheckOutRemarks && getTimeElapsed !== 'time_elapsed' && actionText === 'Check Out' && !messageTicket) || (isCheckOutRemarks && actionCode === 'action_checkout' && getTimeElapsed === 'time_elapsed' && !messageTicket) || loading}
              className="mr-1 submit-btn-auto"
              onClick={() => { handleStateChange(visitorRequestData.id, actionCode); }}
            >
              {actionButton}
            </Button>
          )}
        {(updated
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

ActionVisitRequest.propTypes = {
  details: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  actionModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  actionText: PropTypes.string.isRequired,
  actionCode: PropTypes.string.isRequired,
  actionMessage: PropTypes.string.isRequired,
  actionButton: PropTypes.string.isRequired,
  atFinish: PropTypes.func.isRequired,
};
export default ActionVisitRequest;
