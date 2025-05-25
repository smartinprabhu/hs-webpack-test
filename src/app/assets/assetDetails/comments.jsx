/* eslint-disable import/no-unresolved */
/* eslint-disable react/no-danger */
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
import Button from '@mui/material/Button';
import { useSelector, useDispatch } from 'react-redux';
import JoditEditor from 'jodit-react';
import DOMPurify from 'dompurify';

import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';

import { getOrdersComments, createOrderComment, resetComments } from '../../workorders/workorderService';
import { getAssetDetail } from '../equipmentService';
import {
  getListOfOperations,
} from '../../util/appUtils';
import '../../helpdesk/viewTicket/style.scss';
import actionCodes from '../data/assetActionCodes.json';

const appModels = require('../../util/appModels').default;

const Comments = () => {
  const dispatch = useDispatch();
  const [isComment, showComment] = useState(false);
  const [comment, setComment] = useState('');
  const editor = useRef(null);
  const [isEditor, showEditor] = useState(false);
  const { userRoles } = useSelector((state) => state.user);
  const { equipmentsDetails } = useSelector((state) => state.equipment);
  const { orderComments, createCommentInfo } = useSelector((state) => state.workorder);

  const allowedOperations = getListOfOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'code');

  const commentAllowed = allowedOperations.includes(actionCodes['Add comment']);

  /* useEffect(() => {
    if (equipmentsDetails && equipmentsDetails.data && commentAllowed) {
      const ids = equipmentsDetails.data.length > 0 ? equipmentsDetails.data[0].message_ids : [];
      dispatch(getOrdersComments(ids, appModels.MESSAGE));
    }
  }, []); */

  useEffect(() => {
    if (createCommentInfo && createCommentInfo.data) {
      const viewId = equipmentsDetails && equipmentsDetails.data && equipmentsDetails.data.length > 0 ? equipmentsDetails.data[0].id : '';
      dispatch(getAssetDetail(viewId, appModels.EQUIPMENT, false));
      dispatch(resetComments());
      showComment(false);
    }
  }, [createCommentInfo]);

  const onCommontChange = (data) => {
    setComment(data);
  };

  const sendComment = () => {
    const id = equipmentsDetails && equipmentsDetails.data && equipmentsDetails.data.length > 0 ? equipmentsDetails.data[0].id : '';
    if (id) {
      const values = {
        model: appModels.EQUIPMENT, res_id: id, body: DOMPurify.sanitize(comment), message_type: 'notification',
      };
      dispatch(createOrderComment(values, appModels.MESSAGE));
    }
  };

  return (
    <Row>
      <Col sm="12" md="12" lg="12" xs="12">
        {commentAllowed && (
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
        {/* (orderComments && orderComments.data) && orderComments.data.map((log) => (
            <div key={log.id} className="mb-1 mt-0 user-info-div">
              <div className="user-info-circle">
                <span className="font-weight-800 user-info-label">{generateTag(log.author_id[1], 2)}</span>
              </div>
              <div className="user-info-text">
                <h5>{log.author_id[1]}</h5>
                <p className="text-grayish-blue m-0 font-tiny font-weight-400">{getLocalTime(log.date)}</p>
                <p className="mt-1" dangerouslySetInnerHTML={{ __html: log.body }} />
              </div>
            </div>
          )) */}
        {/* orderComments && orderComments.loading && (
          <Loader />
          ) */}
        {/* (orderComments && orderComments.err) && (
          <ErrorContent errorTxt={generateErrorMessage(orderComments)} />
          ) */}
        <Modal isOpen={isComment} toggle={() => { showComment(false); setComment(''); }}>
          <ModalHeader toggle={() => { showComment(false); setComment(''); }}>Add Comment</ModalHeader>
          <ModalBody>
            <div>
              <FormGroup className="mt-2">
                <Input type="textarea" name="body" placeholder="Enter a comment" value={comment} onChange={onCommontChange} rows="3" />
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
                <SuccessAndErrorFormat response={createCommentInfo} successMessage="Comment sent successfully.." />
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="contained" onClick={() => { showComment(false); setComment(''); }} color="danger" className="roundCorners mr-2">
              Cancel
            </Button>
            <Button
              disabled={!comment || (createCommentInfo && createCommentInfo.loading)}
              type="button"
              onClick={() => sendComment()}
               variant="contained"
              className="roundCorners"
            >
              Send
            </Button>
          </ModalFooter>
        </Modal>
      </Col>
    </Row>
  );
};

export default Comments;
