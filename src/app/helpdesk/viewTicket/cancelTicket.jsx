/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Box, Dialog, DialogActions, DialogContent, DialogContentText,
} from '@mui/material';
import moment from 'moment-timezone';
import * as PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DOMPurify from 'dompurify';
import {
  Card,
  CardBody,
  Col,
  Input,
  Row,
} from 'reactstrap';
import Button from '@mui/material/Button';

import ticketIconBlack from '@images/icons/ticketBlack.svg';
import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import DialogHeader from '../../commonComponents/dialogHeader';
import {
  getOrderDetail, orderStateChange, resetActionData,
  resetCreateOrderDuration,
  resetEscalate,
} from '../../workorders/workorderService';
import {
  createCloseTicket,
  getTicketDetail,
  getTicketStateClose,
  ticketStateChange,
} from '../ticketService';

const appModels = require('../../util/appModels').default;

const CancelTicket = React.memo((props) => {
  const {
    ticketDetail, cancelModal, atFinish,
    isIncident, woCloseInfo,
  } = props;
  const dispatch = useDispatch();
  const [model, setModal] = useState(cancelModal);
  const [messageTicket, setMessageTicket] = useState('');
  const {
    ticketsInfo,
    stateChangeInfo,
    closeTicket, ticketCloseState,
  } = useSelector((state) => state.ticket);
  const { userInfo } = useSelector((state) => state.user);

  const stateId = ticketCloseState && ticketCloseState.data && ticketCloseState.data.length > 0 ? ticketCloseState.data[0].id : '';

  const {
    workorderDetails,
  } = useSelector((state) => state.workorder);

  const toggle = () => {
    const viewId = ticketDetail && ticketDetail.data ? ticketDetail.data[0].id : '';
    if ((userInfo && userInfo.data) && viewId && ((woCloseInfo && woCloseInfo.data))) {
      dispatch(getTicketDetail(viewId, appModels.HELPDESK));
    }
    dispatch(resetEscalate());
    dispatch(resetActionData());
    dispatch(resetCreateOrderDuration());
    setModal(!model);
    atFinish();
  };

  useEffect(() => {
    if (userInfo && userInfo.data && woCloseInfo && !woCloseInfo.data) {
      dispatch(getTicketStateClose(userInfo.data.company.id, appModels.HELPDESKSTATE, 'Closed'));
    }
  }, [userInfo, woCloseInfo]);

  useEffect(() => {
    if (ticketDetail && ticketDetail.data && ticketDetail.data[0].mro_state && ticketDetail.data[0].mro_state !== 'done' && ticketDetail.data[0].mro_order_id && ticketDetail.data[0].mro_order_id.length) {
      dispatch(getOrderDetail(ticketDetail.data[0].mro_order_id[0], appModels.ORDER));
    }
  }, [ticketDetail]);

  const onMessageChange = (e) => {
    setMessageTicket(e.target.value);
  };

  /* useEffect(() => {
    if (createDurationInfo && createDurationInfo.data && createDurationInfo.data.length) {
      // dispatch(getActionData(createDurationInfo.data[0], 'reject_request_order', 'mro.request.order.reject'));
      const woData = workorderDetails && workorderDetails.data && workorderDetails.data.length ? workorderDetails.data[0] : false;
      if (woData) {
        const techData = {
          state: 'cancel',
          reject_reason: messageTicket,
        };
        dispatch(orderStateChange(woData.id, techData, appModels.ORDER));
      }
      dispatch(resetCreateOrderDuration());
    }
  }, [createDurationInfo]); */

  const forceClose = () => {
    if (stateId && ticketDetail && ticketDetail.data && ticketDetail.data[0].mro_state && ticketDetail.data[0].mro_state !== 'done') {
      const woData = workorderDetails && workorderDetails.data && workorderDetails.data.length ? workorderDetails.data[0] : false;
      /* if (woData) {
      const postData = {
        reject_reason: messageTicket,
      };
      const viewId = woData.id;
      const payload = { model: 'mro.request.order.reject', values: postData, context: { active_id: viewId, active_model: appModels.ORDER } };
      dispatch(createOrderDuration('mro.request.order.reject', payload));
    } */
      if (woData) {
        const techData = {
          state: 'cancel',
          reject_reason: DOMPurify.sanitize(messageTicket),
        };
        setTimeout(() => {
          dispatch(orderStateChange(woData.id, techData, appModels.ORDER));
        }, 1000);
      }
    }
  };

  useEffect(() => {
    if (stateChangeInfo && stateChangeInfo.data) {
      forceClose();
      // dispatch(resetEscalate());
    }
  }, [stateChangeInfo]);

  const sendClose = () => {
    const id = ticketDetail.data.length > 0 ? ticketDetail.data[0].id : '';
    if (id && stateId) {
      const valuesClose = {
        ticket_id: id, message: DOMPurify.sanitize(messageTicket), template_id: false,
      };
      const payload = { model: appModels.HELPDESK, values: valuesClose };

      const uId = userInfo && userInfo.data && userInfo.data.id ? userInfo.data.id : false;
      const postData = {
        state_id: stateId, is_cancelled: true, closed_by_id: uId, close_time: moment().utc().format('YYYY-MM-DD HH:mm:ss'), close_comment: DOMPurify.sanitize(messageTicket),
      };
      dispatch(ticketStateChange(id, postData, appModels.HELPDESK));
      setTimeout(() => {
        dispatch(createCloseTicket(payload));
      }, 1000);
      // setMessageTicket('');
    }
  };

  const loading = ((ticketCloseState && ticketCloseState.loading) || (woCloseInfo && woCloseInfo.loading) || (ticketDetail && ticketDetail.loading) || (ticketsInfo && ticketsInfo.loading) || (stateChangeInfo && stateChangeInfo.loading));

  return (
    <Dialog maxWidth="md" open={model}>
      <DialogHeader title={isIncident ? 'Cancel Incident' : 'Cancel Ticket'} onClose={toggle} response={closeTicket} imagePath={ticketIconBlack} />
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
            <Row className="ml-4 mr-4 mb-5">
              <Col sm="12" md="12" lg="12" xs="12">
                <Card className="bg-thinblue border-0">
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
                  </CardBody>
                </Card>
                {(stateChangeInfo && !stateChangeInfo.data) && (
                  <>
                    {(ticketDetail && ticketDetail.data && ticketDetail.data[0].mro_state && ticketDetail.data[0].mro_state !== 'done' && woCloseInfo && !woCloseInfo.data) && (
                      <span className="text-center text-danger">
                        Related work order is not closed yet. so provide valid reason to Force Cancel.
                      </span>
                    )}
                    { /* (ticketDetail && ticketDetail.data && (!ticketDetail.data[0].mro_state || ticketDetail.data[0].mro_state === 'done' || (woCloseInfo && woCloseInfo.data))) && ( */}
                    <div>
                      <Input type="textarea" name="body" placeholder="Enter here" value={messageTicket} onChange={onMessageChange} className="mt-2 bg-whitered" rows="4" />
                      {!messageTicket && (<span className="text-danger ml-1">Reason required</span>)}
                    </div>
                    { /* )} */}
                  </>
                )}
              </Col>
            </Row>
            {loading && (
              <div className="text-center mt-3">
                <Loader />
              </div>
            )}
            {!loading && !stateId && (
              <div className="text-danger text-center mt-3">
                <FontAwesomeIcon className="mr-2 font-size20 mb-n2px" size="lg" icon={faExclamationCircle} />
                Unable to cancel the ticket.
              </div>
            )}
            {(stateChangeInfo && stateChangeInfo.err) && (
              <SuccessAndErrorFormat response={stateChangeInfo} />
            )}
            {stateChangeInfo && stateChangeInfo.data && !loading && (
              <SuccessAndErrorFormat response={stateChangeInfo} successMessage={`The ${isIncident ? 'incident' : 'Ticket'} has been Cancelled.`} />
            )}
            <hr className="mb-0" />
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {!(stateChangeInfo && stateChangeInfo.data) && (
          <Button
            size="sm"
            type="button"
             variant="contained"
            disabled={messageTicket === '' || (stateChangeInfo && stateChangeInfo.data) || !stateId}
            onClick={() => sendClose()}
          >
            {ticketDetail && ticketDetail.data && ticketDetail.data[0].mro_state && ticketDetail.data[0].mro_state !== 'done' ? 'Force Cancel' : 'Cancel'}

          </Button>
        )}
        {(stateChangeInfo && stateChangeInfo.data) && (
          <Button
            size="sm"
            type="button"
             variant="contained"
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

CancelTicket.propTypes = {
  ticketDetail: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  woCloseInfo: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  cancelModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  isIncident: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  atFinish: PropTypes.func.isRequired,
};
export default CancelTicket;
