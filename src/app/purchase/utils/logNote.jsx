/* eslint-disable import/no-unresolved */
import React, { useEffect, useState, useRef } from 'react';
import {
  Button,
  Col,
  FormGroup,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  Row, Label,
} from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';
import JoditEditor from 'jodit-react';

import ModalHeaderComponent from '@shared/modalHeaderComponent';
import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import {
  getReceipents, createMessage,
} from '../../helpdesk/ticketService';
import { truncateHTMLTags } from '../../util/appUtils';

const appModels = require('../../util/appModels').default;

const logNote = (props) => {
  const {
    detail, modalName, title, subTitle, noteModal, atFinish,
  } = props;
  const dispatch = useDispatch();
  const [model, setmodel] = useState(noteModal);
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
        model: modalName,
        res_id: id,
        body: message,
        message_type: 'comment',
        is_note: true,
        partner_ids: partner,
        subtype_id: 2,
      };
      dispatch(createMessage(values, appModels.MESSAGE));
      setMessage('');
    }
  };

  return (
    <>
      <Modal size={(createMessageInfo && createMessageInfo.data) ? 'sm' : 'xl'} className="border-radius-50px modal-dialog-centered" isOpen={noteModal}>
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
            <Col sm="12" md="12" lg="12" xs="12">
              <FormGroup className="mt-2">
                <Label htmlFor="log-note">
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
                  defaultValue={message}
                  id="log_note"
                  className="subjectticket bw-2 mt-0"
                  placeholder="Enter message"
                  onClick={() => showEditor(true)}
                  onMouseLeave={() => showEditor(false)}
                />
                )}
                {isEditor
                  ? (!message || !truncateHTMLTags(message)) && (<span className="text-danger ml-1 mt-3 font-11">Message is required</span>) : ''}
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
          <SuccessAndErrorFormat response={createMessageInfo} successMessage="Log saved successfully.." />
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

logNote.propTypes = {
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
  noteModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  atFinish: PropTypes.func.isRequired,
};
export default logNote;
