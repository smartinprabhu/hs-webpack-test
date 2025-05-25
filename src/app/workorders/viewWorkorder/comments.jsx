/* eslint-disable react/no-danger */
/* eslint-disable import/no-unresolved */
import React, { useEffect, useState, useRef } from 'react';
import {
  Col,
  FormGroup,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
} from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import JoditEditor from 'jodit-react';
import DOMPurify from 'dompurify';
import Button from '@mui/material/Button';
import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';

import {
  createOrderComment, resetComments, getOrderDetail,
} from '../workorderService';
import actionCodes from '../data/workOrderActionCodes.json';
import {
  getListOfOperations,
} from '../../util/appUtils';
import '../../helpdesk/viewTicket/style.scss';

const appModels = require('../../util/appModels').default;

const Comments = () => {
  const dispatch = useDispatch();
  const [isComment, showComment] = useState(false);
  const [comment, setComment] = useState('');
  const editor = useRef(null);
  const [isEditor, showEditor] = useState(false);
  const { workorderDetails, orderComments, createCommentInfo } = useSelector((state) => state.workorder);
  const { userRoles } = useSelector((state) => state.user);

  useEffect(() => {
    if (createCommentInfo && createCommentInfo.data) {
      const viewId = workorderDetails && workorderDetails.data && workorderDetails.data.length > 0 ? workorderDetails.data[0].id : '';
      dispatch(getOrderDetail(viewId, appModels.ORDER));
      dispatch(resetComments());
      showComment(false);
    }
  }, [createCommentInfo]);

  const onCommontChange = (data) => {
    setComment(data);
  };

  const sendComment = () => {
    const id = workorderDetails.data.length > 0 ? workorderDetails.data[0].id : '';
    if (id) {
      const values = {
        model: appModels.ORDER, res_id: id, body: DOMPurify.sanitize(comment), message_type: 'notification',
      };
      dispatch(createOrderComment(values, appModels.MESSAGE));
    }
  };

  const allowedOperations = getListOfOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'code');

  return (
    <>
      <Row>
        <Col className="comments-tab" sm="12" md="12" lg="12" xs="12">
          {allowedOperations.includes(actionCodes['Add Comments']) && (
          <>
            <FormGroup className="mt-2">
              {(isEditor || (comment && comment.length > 0)) && (
              <JoditEditor
                ref={editor}
                value={comment}
                onChange={onCommontChange}
                onBlur={onCommontChange}
              />
              )}
              {(!isEditor || (comment && comment.length === 0)) && (
              <Input
                type="input"
                defaultValue={comment}
                className="subjectticket bw-2 mt-0"
                placeholder="Enter Comment"
                onClick={() => showEditor(true)}
                onMouseLeave={() => showEditor(false)}
              />
              )}
            </FormGroup>
            {orderComments && !orderComments.loading && (
            <Button
              disabled={!comment || (createCommentInfo && createCommentInfo.loading)}
              type="button"
              onClick={() => sendComment()}
              size="sm"
              className="pull-right border-color-red-gray bg-white text-dark rounded-pill"
             variant="contained"
            >
              Send
            </Button>
            )}
          </>
          )}
        </Col>
        <Col sm="12" md="12" lg="12" xs="12" className="p-3 comments-list thin-scrollbar">
          <Modal isOpen={isComment} toggle={() => { showComment(false); setComment(''); }}>
            <ModalHeader toggle={() => { showComment(false); setComment(''); }}>Add Comment</ModalHeader>
            <ModalBody>
              <div>
                <FormGroup className="mt-2">
                  <Input type="textarea" name="body" maxLength="250" placeholder="Enter a comment" value={comment} onChange={onCommontChange} rows="3" />
                </FormGroup>

                {createCommentInfo && createCommentInfo.loading && (
                <div className="text-center mt-3">
                  <Loader />
                </div>
                )}
                {(createCommentInfo && createCommentInfo.err) && (
                <SuccessAndErrorFormat response={createCommentInfo} />
                )}
                {(createCommentInfo && createCommentInfo.data) && (
                <SuccessAndErrorFormat response={createCommentInfo} successMessage="Space updated successfully.." />
                )}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="contained" onClick={() => { showComment(false); setComment(''); }} size="sm" className="btn-cancel mr-2">
                Cancel
              </Button>
              <Button
                disabled={!comment || (createCommentInfo && createCommentInfo.loading)}
                type="button"
                size="sm"
                variant="contained"
                onClick={() => sendComment()}
              >
                Send
              </Button>
            </ModalFooter>
          </Modal>
        </Col>
      </Row>
    </>
  );
};

export default Comments;
