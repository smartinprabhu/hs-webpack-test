/* eslint-disable import/no-unresolved */
import React, { useEffect, useState, useRef } from 'react';
import {
  Card,
  CardBody,
  Col,
  Input,
  Row,
  FormGroup,
  Label,
} from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';
import JoditEditor from 'jodit-react';
import { Button } from "@mui/material";
import {
  Box
} from '@mui/material';
import { Dialog, DialogActions, DialogContent, DialogContentText } from '@mui/material'

import ticketIconBlack from '@images/icons/ticketBlack.svg';
import messageBlack from '@images/icons/messageBlack.svg';
import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import { createMessage, getReceipents } from '../ticketService';
import { truncateHTMLTags } from '../../util/appUtils';
import DialogHeader from '../../commonComponents/dialogHeader';

const appModels = require('../../util/appModels').default;

const SendMessage = (props) => {
  const {
    ticketDetail, messageModal, atFinish, atCancel,
    isIncident,
  } = props;
  const dispatch = useDispatch();
  const [model, setmodel] = useState(messageModal);
  const [message, setMessage] = useState('');
  const editor = useRef(null);
  const [isEditor, showEditor] = useState(false);
  const toggle = () => {
    setmodel(!model);
    atFinish();
  };
  const {
    createMessageInfo, receipents,
  } = useSelector((state) => state.ticket);

  const onMessageChange = (data) => {
    setMessage(data);
  };

  const toggleCancel = () => {
    setmodel(!model);
    atCancel();
  };

  useEffect(() => {
    if (ticketDetail && ticketDetail.data) {
      const viewId = ticketDetail && ticketDetail.data && ticketDetail.data.length > 0 ? ticketDetail.data[0].id : '';
      dispatch(getReceipents(viewId, appModels.HELPDESK));
    }
  }, []);

  const sendMessage = () => {
    const id = ticketDetail.data.length > 0 ? ticketDetail.data[0].id : '';
    const partner = receipents && receipents.data ? receipents.data : [];
    if (id) {
      const values = {
        model: appModels.HELPDESK, res_id: id, body: message, message_type: 'comment', partner_ids: partner,
      };
      dispatch(createMessage(values, appModels.MESSAGE));
      setMessage('');
    }
  };

  return (
    <>
      <Dialog maxWidth={'xl'} fullWidth open={messageModal}>
        <DialogHeader title={isIncident ? 'Incident Overview' : 'Ticket Overview'} onClose={toggle} response={createMessageInfo} imagePath={ticketIconBlack} />
        {ticketDetail && (ticketDetail.data && ticketDetail.data.length > 0) && (
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
                {(createMessageInfo && !createMessageInfo.data && !createMessageInfo.loading) && (
                  <Row className="ml-4 mr-4 mb-5">
                    <Col sm="6" md="6" lg="6" xs="12">
                      <h6 className="text-grey ml-4 mt-5 pl-1">
                        <img src={messageBlack} alt="ticket" width="30" className="mr-2 pb-1" />
                        Please enter your message
                      </h6>
                    </Col>
                    <Col sm="6" md="6" lg="6" xs="12">
                      <Card className="bg-lightblue border-0">
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
                      {(createMessageInfo && !createMessageInfo.data) && (
                        <>
                          <FormGroup className="mt-2">
                            <Label htmlFor="sendMessage">
                              Message
                              {' '}
                              <span className="text-danger">*</span>
                            </Label>
                            {(isEditor || (message && message.length > 0)) && (
                              <JoditEditor
                                ref={editor}
                                value={message}
                                onChange={onMessageChange}
                                onBlur={onMessageChange}
                              />
                            )}
                            {(!isEditor || (message && message.length === 0)) && (

                              <Input
                                type="input"
                                id="SendMessage"
                                defaultValue={message}
                                className="subjectticket bw-2 mt-0"
                                placeholder="Enter message"
                                onClick={() => showEditor(true)}
                                onMouseLeave={() => showEditor(false)}
                              />
                            )}
                            {isEditor
                              ? (!message || !truncateHTMLTags(message)) && (<span className="font-11 text-danger mt-3 ml-1">Message is required</span>) : ''}
                          </FormGroup>
                        </>
                      )}
                    </Col>
                  </Row>
                )}
                {createMessageInfo && createMessageInfo.loading && (
                  <div className="text-center mt-3">
                    <Loader />
                  </div>
                )}
                {(createMessageInfo && createMessageInfo.err) && (
                  <SuccessAndErrorFormat response={createMessageInfo} />
                )}
                {(createMessageInfo && createMessageInfo.data) && (
                  <SuccessAndErrorFormat response={createMessageInfo} successMessage="Message sent successfully.." />
                )}
              </Box>
            </DialogContentText>
          </DialogContent>
        )}
        <DialogActions>
          {(createMessageInfo && createMessageInfo.data) && (
            <Button
              variant='contained'
              type="button"
              onClick={toggle}
              className="submit-btn"
            >
              Ok
            </Button>
          )}
          {(createMessageInfo && !createMessageInfo.data) && (
            <Button
              variant='contained'
              type="button"
              disabled={message === ''}
              onClick={() => { sendMessage(); }}
              className="submit-btn"
            >
              SEND
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

SendMessage.propTypes = {
  ticketDetail: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  messageModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  isIncident: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  atFinish: PropTypes.func.isRequired,
  atCancel: PropTypes.func.isRequired,
};
export default SendMessage;
