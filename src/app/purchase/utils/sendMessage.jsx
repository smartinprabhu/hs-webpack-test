/* eslint-disable import/no-unresolved */
import React, { useEffect, useState, useRef } from 'react';
import {
  Button,
  Card,
  CardBody,
  Col,
  FormGroup,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  Row,
  Label,
} from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';
import JoditEditor from 'jodit-react';

import ModalHeaderComponent from '@shared/modalHeaderComponent';
import messageBlack from '@images/icons/messageBlack.svg';
import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import {
  createMessage, getReceipents,
} from '../../helpdesk/ticketService';
import { truncateHTMLTags } from '../../util/appUtils';

const appModels = require('../../util/appModels').default;

const SendMessage = (props) => {
  const {
    detail, modalName, title, subTitle, messageModal, atFinish,
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

  useEffect(() => {
    if (detail && detail.data) {
      const viewId = detail && detail.data && detail.data.length > 0 ? detail.data[0].id : '';
      dispatch(getReceipents(viewId, modalName));
    }
  }, [detail]);

  const sendMessage = () => {
    const id = detail.data.length > 0 ? detail.data[0].id : '';
    const partner = receipents && receipents.data ? receipents.data : [];
    if (id) {
      const values = {
        model: modalName, res_id: id, body: message, message_type: 'notification', partner_ids: partner,
      };
      dispatch(createMessage(values, appModels.MESSAGE));
      setMessage('');
    }
  };

  return (
    <>
      <Modal size={(createMessageInfo && createMessageInfo.data) ? 'sm' : 'xl'} className="border-radius-50px modal-dialog-centered" isOpen={messageModal}>
        <ModalHeaderComponent
          title={title}
          subtitle={subTitle}
          imagePath={false}
          closeModalWindow={toggle}
          response={createMessageInfo}
        />
        {detail && (detail.data && detail.data.length > 0) && (
        <ModalBody className="pt-0">
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
                    <Col sm="12" md="12" lg="12" xs="12">
                      <p className="font-weight-800 font-side-heading text-grey mb-1">
                        {detail.data[0].name}
                      </p>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
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
          <hr className="mb-0" />
        </ModalBody>
        )}
        <ModalFooter className="border-0 pt-1">
          {(createMessageInfo && createMessageInfo.data) && (
          <Button
             variant="contained"
            size="sm"
            onClick={toggle}
          >
            Ok
          </Button>
          )}
          {(createMessageInfo && !createMessageInfo.data) && (
            <Button
              size="sm"
              type="button"
               variant="contained"
              disabled={!message || !truncateHTMLTags(message)}
              onClick={() => { sendMessage(); }}
            >
              Send
            </Button>
          )}
        </ModalFooter>
      </Modal>
    </>
  );
};

SendMessage.propTypes = {
  detail: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  modalName: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  title: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  subTitle: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  messageModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  atFinish: PropTypes.func.isRequired,
};
export default SendMessage;
