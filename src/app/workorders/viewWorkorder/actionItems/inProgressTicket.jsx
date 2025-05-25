/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardBody,
  Col,
  Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from "@mui/material";
import {
  Box
} from '@mui/material';
import { Dialog, DialogActions, DialogContent, DialogContentText } from '@mui/material'

import checkCircleBlack from '@images/icons/checkCircleBlack.svg';
import ticketIconBlack from '@images/icons/ticketBlack.svg';

import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import {
  getTicketStateClose, updateTicket, resetUpdateTicket,
} from '../../../helpdesk/ticketService';
import DialogHeader from '../../../commonComponents/dialogHeader';

const appModels = require('../../../util/appModels').default;

const InProgressTicket = (props) => {
  const {
    progressActionModal, atFinish, tId,
  } = props;
  const dispatch = useDispatch();
  const [modal, setModal] = useState(progressActionModal);
  const toggle = () => {
    dispatch(resetUpdateTicket());
    setModal(!modal);
    atFinish();
  };

  const { ticketDetail, ticketCloseState, updateTicketInfo } = useSelector((state) => state.ticket);

  const showButton = (ticketDetail && !ticketDetail.loading) && (updateTicketInfo && !updateTicketInfo.loading);

  useEffect(() => {
    if (tId) {
      dispatch(getTicketStateClose(false, appModels.HELPDESKSTATE, 'In Progress'));
    }
  }, [tId]);

  const putOnhold = () => {
    const stateId = ticketCloseState && ticketCloseState.data && ticketCloseState.data.length > 0 ? ticketCloseState.data[0].id : '';
    if (stateId && tId) {
      const postData = {
        state_id: stateId,
      };
      dispatch(updateTicket(tId, appModels.HELPDESK, postData));
    }
  };

  return (
    <Dialog size="md" open={progressActionModal}>
      <DialogHeader imagePath={checkCircleBlack} onClose={toggle} title="Move to In Progress" response={updateTicketInfo} />
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
            <Card className="border-5 ml-4 mb-4 mr-4 border-secondary rounded-0 border-top-0 border-right-0 border-bottom-0">
              {ticketDetail && (ticketDetail.data && ticketDetail.data.length > 0) && (
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
              )}
            </Card>
            <Row className="justify-content-center">
              {updateTicketInfo && updateTicketInfo.data && !(ticketDetail && ticketDetail.loading) && (
                <SuccessAndErrorFormat response={updateTicketInfo} successMessage="This ticket has been Moved to In Progress successfully.." />
              )}
              {updateTicketInfo && updateTicketInfo.err && (
                <SuccessAndErrorFormat response={updateTicketInfo} />
              )}
              {((updateTicketInfo && updateTicketInfo.loading) || (ticketDetail && ticketDetail.loading)) && (
                <CardBody className="mt-4" data-testid="loading-case">
                  <Loader />
                </CardBody>
              )}
            </Row>
          </Box>
        </DialogContentText>
      </DialogContent>
      {showButton && (
        <DialogActions className="mr-3 ml-3">
          {updateTicketInfo && !updateTicketInfo.data && (
            <Button
              type="button"
              variant='contained'
              className="submit-btn"
              onClick={() => putOnhold()}
            >
              Confirm
            </Button>
          )}
          {updateTicketInfo && updateTicketInfo.data && !updateTicketInfo.loading && (

            <Button
              type="button"
              variant='contained'
              className="submit-btn"
              onClick={toggle}
            >
              Ok
            </Button>

          )}
        </DialogActions>
      )}
    </Dialog>
  );
};

InProgressTicket.defaultProps = {
  tId: false,
};

InProgressTicket.propTypes = {
  progressActionModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  atFinish: PropTypes.func.isRequired,
  tId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
  ]),
};
export default InProgressTicket;
