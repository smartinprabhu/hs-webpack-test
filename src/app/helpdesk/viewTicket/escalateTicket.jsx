/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import {
  Card,
  CardBody,
  Col,
  Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { Button } from "@mui/material";
import {
  Box
} from '@mui/material';
import { Dialog, DialogActions, DialogContent, DialogContentText } from '@mui/material'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimesCircle, faCheckCircle, faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux';

import ticketIcon from '@images/icons/ticketBlack.svg';

import { escalateTicket, resetEscalate, getTicketDetail } from '../ticketService';
import {
  getDefaultNoValue, generateErrorMessage,
} from '../../util/appUtils';

const appModels = require('../../util/appModels').default;

const EscalateTicket = (props) => {
  const {
    ticketDetail, escalateModal, atFinish,
  } = props;
  const dispatch = useDispatch();
  const [model, setmodel] = useState(escalateModal);
  const toggle = () => {
    setmodel(!model);
    const id = ticketDetail && ticketDetail.data ? ticketDetail.data[0].id : '';
    dispatch(getTicketDetail(id, appModels.HELPDESK));
    atFinish();
  };

  const {
    escalateTicketInfo,
  } = useSelector((state) => state.ticket);

  const handleStateChange = () => {
    const id = ticketDetail && ticketDetail.data ? ticketDetail.data[0].id : '';
    dispatch(escalateTicket(id, appModels.HELPDESK, 'create_maintenance_req_order'));
  };

  const cancelEscalate = () => {
    dispatch(resetEscalate());
  };

  let actionResults;

  if (escalateTicketInfo && escalateTicketInfo.loading) {
    actionResults = (
      <FontAwesomeIcon className="ml-2 mr-2 tab_nav_link" size="sm" icon={faSpinner} />
    );
  } else if (escalateTicketInfo && escalateTicketInfo.data) {
    actionResults = (
      <FontAwesomeIcon className="ml-2 mr-2" size="sm" icon={faCheckCircle} />
    );
  } else if (escalateTicketInfo && escalateTicketInfo.err) {
    actionResults = (
      <FontAwesomeIcon className="ml-2 mr-2" size="sm" icon={faTimesCircle} />
    );
  } else {
    actionResults = (
      <FontAwesomeIcon className="ml-2 mr-2 tab_nav_link" size="sm" icon={faCheckCircle} />
    );
  }

  return (
  
      <Dialog maxWidth={'lg'} open={model} >
      <DialogHeader  title="Escalate the Ticket" subtitle="Please follow these steps to Escalate the ticket" onClose={toggle} response={escalateTicketInfo} imagePath={ticketIcon} />
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
        <Row>
          <Col sm="6" md="6" lg="6" xs="12">
            <Card className="border-0 ">
              <CardBody className="p-2">
                <Row>
                  <Col sm="12" md="12" lg="12" xs="12">
                    <p className="font-weight-700 mt-3">
                      <FontAwesomeIcon className="ml-2 mr-2" size="sm" icon={faCheckCircle} />
                      Escalate this ticket to Level2.
                    </p>
                    <p className="font-weight-700">
                      {actionResults}
                      {escalateTicketInfo && escalateTicketInfo.err ? generateErrorMessage(escalateTicketInfo) : 'The Ticket has been Escalated.' }
                    </p>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          <Col sm="6" md="6" lg="6" xs="12">
            <Card className="bg-lightblue border-0">
              <CardBody className="p-3">
                <Row>
                  <Col sm="9" md="9" lg="9" xs="12">
                    <p className="font-weight-800 font-side-heading mb-1">
                      {getDefaultNoValue(ticketDetail && ticketDetail.data ? ticketDetail.data[0].subject : '')}
                    </p>
                    <p className="font-weight-500 font-side-heading mb-1">
                      #
                      {getDefaultNoValue(ticketDetail && ticketDetail.data ? ticketDetail.data[0].ticket_number : '')}
                    </p>
                    <span className="font-weight-800 font-side-heading mr-1">
                      {!(escalateTicketInfo && escalateTicketInfo.data) ? (<>Current</>) : (<>Previous</>)}
                      {' '}
                      Escalation Level :
                    </span>
                    <span className="font-weight-400 text-capitalize">
                      {!(escalateTicketInfo && escalateTicketInfo.data)
                        ? getDefaultNoValue(ticketDetail && ticketDetail.data && ticketDetail.data[0].current_escalation_level ? ticketDetail.data[0].current_escalation_level : '') : 'Level1'}
                    </span>
                  </Col>
                  <Col sm="3" md="3" lg="3" xs="12">
                    <img src={ticketIcon} alt="ticket" width="25" className="mr-2 float-right" />
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          {(escalateTicketInfo && escalateTicketInfo.data) && (
          <>
            <Col sm="6" md="6" lg="6" xs="12" />
            <Col sm="6" md="6" lg="6" xs="12">
              <p className="mb-3 mt-2 font-weight-800 text-center">Escalated to</p>
              <Card className="bg-lightblue border-0 mb-2">
                <CardBody className="p-3">
                  <Row>
                    <Col sm="9" md="9" lg="9" xs="12">
                      <p className="font-weight-800 font-side-heading mb-1">
                        {getDefaultNoValue(ticketDetail && ticketDetail.data ? ticketDetail.data[0].subject : '')}
                      </p>
                      <p className="font-weight-500 font-side-heading mb-1">
                        #
                        {getDefaultNoValue(ticketDetail && ticketDetail.data ? ticketDetail.data[0].ticket_number : '')}
                      </p>
                      <span className="font-weight-800 font-side-heading mr-1">
                        New Escalation Level :
                      </span>
                      <span className="font-weight-400 text-capitalize">
                        Level 2
                      </span>
                    </Col>
                    <Col sm="3" md="3" lg="3" xs="12">
                      <img src={ticketIcon} alt="ticket" width="25" className="mr-2 float-right" />
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </>
          )}
        </Row>
        </Box>
       </DialogContentText>
       </DialogContent>
       <DialogActions>
        {!(escalateTicketInfo && escalateTicketInfo.data) ? (
          <Button
            type="button"
            variant='contained'
            className="submit-btn"
            disabled={escalateTicketInfo && escalateTicketInfo.loading}
            onClick={() => handleStateChange()}
          >
            Confirm
          </Button>
        )
          : (
            <Button
              type="button"
              variant='contained'
              className="submit-btn"
              onClick={() => { cancelEscalate(); toggle(); }}
            >
              Ok
            </Button>
          )}
      </DialogActions>
    </Dialog>
  );
};
EscalateTicket.propTypes = {
  ticketDetail: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  escalateModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  atFinish: PropTypes.func.isRequired,
};
export default EscalateTicket;
