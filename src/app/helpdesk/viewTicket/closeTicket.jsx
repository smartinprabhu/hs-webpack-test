/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardBody,
  Col,
  Input,
  Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import DOMPurify from 'dompurify';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment-timezone';
import { Button, Box, Dialog, DialogActions, DialogContent, DialogContentText } from '@mui/material'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

import ticketIconBlack from '@images/icons/ticketBlack.svg';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import {
  createCloseTicket, getTicketStateClose, ticketStateChange, getTicketDetail,
} from '../ticketService';
import {
  getOrderDetail, orderStateChange, resetActionData,
  resetCreateOrderDuration,
  resetEscalate,
} from '../../workorders/workorderService';
import DialogHeader from '../../commonComponents/dialogHeader';

const appModels = require('../../util/appModels').default;

const CloseTicket = React.memo((props) => {
  const {
    ticketDetail, closeModal, atFinish,
    isIncident, woCloseInfo,
  } = props;
  const dispatch = useDispatch();
  const [model, setModal] = useState(closeModal);
  const [messageTicket, setMessageTicket] = useState('');
  const {
    closeTicket, ticketCloseState, ticketsInfo,
    stateChangeInfo,
  } = useSelector((state) => state.ticket);
  const { userInfo } = useSelector((state) => state.user);

  const {
    workorderDetails,
  } = useSelector((state) => state.workorder);

  const stateId = ticketCloseState && ticketCloseState.data && ticketCloseState.data.length > 0 ? ticketCloseState.data[0].id : '';

  const toggle = () => {
    const viewId = ticketDetail && ticketDetail.data ? ticketDetail.data[0].id : '';
    if ((userInfo && userInfo.data) && viewId && ((woCloseInfo && woCloseInfo.data) || (closeTicket && closeTicket.data))) {
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
        dispatch(orderStateChange(woData.id, techData, appModels.ORDER));
      }
    }
  };

  useEffect(() => {
    if (stateChangeInfo && stateChangeInfo.result && stateChangeInfo.result.status) {
      forceClose();
      dispatch(resetEscalate());
    }
  }, [stateChangeInfo]);

  const sendClose = () => {
    const id = ticketDetail.data.length > 0 ? ticketDetail.data[0].id : '';
    if (id && stateId) {
      const valuesClose = {
        ticket_id: id, message: DOMPurify.sanitize(messageTicket), template_id: false,
      };
      const payload = { model: appModels.HELPDESK, values: valuesClose };
      dispatch(createCloseTicket(payload));
      const uId = userInfo && userInfo.data && userInfo.data.id ? userInfo.data.id : false;
      const postData = {
        state_id: stateId, closed_by_id: uId, close_time: moment().utc().format('YYYY-MM-DD HH:mm:ss'), close_comment: messageTicket,
      };
      dispatch(ticketStateChange(id, postData, appModels.HELPDESK));
      // setMessageTicket('');
    }
  };

  const loading = ((ticketCloseState && ticketCloseState.loading) || (woCloseInfo && woCloseInfo.loading) || (closeTicket && closeTicket.loading) || (ticketDetail && ticketDetail.loading) || (ticketsInfo && ticketsInfo.loading) || (stateChangeInfo && stateChangeInfo.loading));

  return (
    <Dialog maxWidth={'md'} open={model} >
      <DialogHeader title={isIncident ? 'Close Incident' : 'Close Ticket'} onClose={toggle} response={closeTicket} imagePath={ticketIconBlack}/>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Box
            sx={{
              width: "100%",
              height: "100%",
              backgroundColor: "#F6F8FA",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "10%",
              fontFamily: "Suisse Intl",
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
                {(closeTicket && !closeTicket.data) && (
                  <>
                    {(ticketDetail && ticketDetail.data && ticketDetail.data[0].mro_state && ticketDetail.data[0].mro_state !== 'done' && woCloseInfo && !woCloseInfo.data) && (
                      <span className="text-center text-danger">
                        Related work order is not closed yet. so provide valid reason to Force Close.
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
            {!loading && !stateId && (
              <div className="text-danger text-center mt-3">
                <FontAwesomeIcon className="mr-2 font-size20 mb-n2px" size="lg" icon={faExclamationCircle} />
                Unable to close the ticket.
              </div>
            )}
            {(closeTicket && closeTicket.err) && (
              <SuccessAndErrorFormat response={closeTicket} />
            )}
            {((closeTicket && closeTicket.data) && (!loading)) && (
              <SuccessAndErrorFormat response={closeTicket} successMessage={`The ${isIncident ? 'incident' : 'Ticket'} has been Closed successfully.`} />
            )}
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {(closeTicket && !closeTicket.data) && (
          <Button
            variant='contained'
            disabled={messageTicket === '' || (stateChangeInfo && stateChangeInfo.data) || !stateId}
            onClick={() => sendClose()}
            className="submit-btn"
          >
            {ticketDetail && ticketDetail.data && ticketDetail.data[0].mro_state && ticketDetail.data[0].mro_state !== 'done' ? 'Force Close' : 'CLOSE'}

          </Button>
        )}
        {closeTicket && closeTicket.data && (
          <Button
            variant='contained'
            onClick={() => toggle()}
            disabled={loading}
            className="submit-btn"
          >
            OK
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
});

CloseTicket.propTypes = {
  ticketDetail: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  woCloseInfo: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  closeModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  isIncident: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  atFinish: PropTypes.func.isRequired,
};
export default CloseTicket;
