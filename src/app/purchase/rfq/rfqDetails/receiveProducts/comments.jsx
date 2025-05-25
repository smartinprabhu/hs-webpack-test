/* eslint-disable react/no-danger */
/* eslint-disable no-undef */
/* eslint-disable import/no-unresolved */
import React, { useEffect, useState, useRef } from 'react';
import {
    Col,
  FormGroup,
  Input,
  Row,
} from 'reactstrap';
import Button from '@mui/material/Button';
import { useSelector, useDispatch } from 'react-redux';
import JoditEditor from 'jodit-react';
import DOMPurify from 'dompurify';

import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import { getTransferDetail } from '../../../purchaseService';
import { getOrdersComments, createOrderComment, resetComments } from '../../../../workorders/workorderService';
import {
  getCompanyTimezoneDate, generateTag, generateErrorMessage,
  htmlToReact,
} from '../../../../util/appUtils';
import './style.scss';

const appModels = require('../../../../util/appModels').default;

const Comments = () => {
  const dispatch = useDispatch();
  const editor = useRef(null);
  const [comment, setComment] = useState('');
  const [isEditor, showEditor] = useState(false);
  const { transferDetails } = useSelector((state) => state.purchase);
  const { userInfo } = useSelector((state) => state.user);
  const { orderComments, createCommentInfo } = useSelector((state) => state.workorder);

  useEffect(() => {
    if (transferDetails && transferDetails.data) {
      const ids = transferDetails.data.length > 0 ? transferDetails.data[0].message_ids : [];
      dispatch(getOrdersComments(ids, appModels.MESSAGE));
    }
  }, [transferDetails]);

  useEffect(() => {
    if (createCommentInfo && createCommentInfo.data) {
      const viewId = transferDetails && transferDetails.data && transferDetails.data.length > 0 ? transferDetails.data[0].id : '';
      dispatch(getTransferDetail(viewId, appModels.STOCK));
      dispatch(resetComments());
    }
  }, [createCommentInfo]);

  const onCommontChange = (data) => {
    setComment(data);
  };

  const sendComment = () => {
    const id = transferDetails.data.length > 0 ? transferDetails.data[0].id : '';
    if (id) {
      const values = {
        model: appModels.STOCK, res_id: id, body: comment, message_type: 'notification',
      };
      dispatch(createOrderComment(values, appModels.MESSAGE));
      setComment('');
    }
  };

  return (
    <>
      <Row>
        <Col sm="12" md="12" lg="12">
          <div className="mb-4">
            <span className="font-weight-400 font-tiny mr-1">
              Description
            </span>
          </div>
          <br />
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
                value={comment}
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
        </Col>
        <Col sm="12" md="12" lg="12" xs="12" className="p-3 comments-list thin-scrollbar">
          {(orderComments && orderComments.data) && orderComments.data.map((log) => (
            <div key={log.id} className="mb-1 mt-0 user-info-div">
              <div className="user-info-circle">
                <span className="font-weight-800 user-info-label">{generateTag(log.author_id ? log.author_id[1] : '', 2)}</span>
              </div>
              <div className="user-info-text">
                <h5>{log.author_id ? log.author_id[1] : ''}</h5>
                <p className="text-grayish-blue m-0 font-tiny font-weight-400">{getCompanyTimezoneDate(log.date, userInfo, 'datetime')}</p>
                <p className="mt-1" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(htmlToReact(log.body), { USE_PROFILES: { html: true } }) }} />
              </div>
            </div>
          ))}
          {createCommentInfo && createCommentInfo.loading && (
          <div className="text-center mt-3">
            <Loader />
          </div>
          )}
          {(createCommentInfo && createCommentInfo.err) && (
          <SuccessAndErrorFormat response={createCommentInfo} />
          )}
          {(createCommentInfo && createCommentInfo.data) && (
          <SuccessAndErrorFormat response={createCommentInfo} successMessage="Comment added successfully." />
          )}
          {orderComments && orderComments.loading && (
            <Loader />
          )}
          {(orderComments && orderComments.err) && (
            <ErrorContent errorTxt={generateErrorMessage(orderComments)} />
          )}
        </Col>
      </Row>

    </>
  );
};

export default Comments;
