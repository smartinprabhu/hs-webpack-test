/* eslint-disable import/no-unresolved */
import React, { useEffect, useState, useRef } from 'react';
import {
  Button,
  Col,
  FormGroup,
  Input,
  Row, Label,
} from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';
import JoditEditor from 'jodit-react';

import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import {
  getReceipents, createMessage,
} from '../../helpdesk/ticketService';
import { truncateHTMLTags } from '../../util/appUtils';

const appModels = require('../../util/appModels').default;

const logNoteForm = (props) => {
  const {
    detail, modalName, atFinish,
  } = props;
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const editor = useRef(null);
  const [isEditor, showEditor] = useState(false);

  const toggle = () => {
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
      {detail && (detail.data && detail.data.length > 0) && (
        <div className="pt-0">
          {(createMessageInfo && !createMessageInfo.data && !createMessageInfo.loading) && (
          <Row className="mb-2">
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
        </div>
      )}
      <div className="float-right pt-1">
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
      </div>
    </>
  );
};

logNoteForm.propTypes = {
  detail: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  modalName: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  atFinish: PropTypes.func.isRequired,
};
export default logNoteForm;
