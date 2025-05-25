/* eslint-disable react/no-danger */
/* eslint-disable no-undef */
/* eslint-disable import/no-unresolved */
import React, { useEffect, useState, useRef } from 'react';
import {
  Button,
  FormGroup,
} from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import JoditEditor from 'jodit-react';
import {
  BsChatLeftDots,
} from "react-icons/bs";
import { IconButton } from "@mui/material";
import { Dialog, DialogActions, DialogContent, DialogContentText } from '@mui/material'
import moment from 'moment-timezone';

import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import { updateTicket } from '../ticketService';
import { createOrderComment, resetComments } from '../../workorders/workorderService';
import {
  getListOfOperations,
} from '../../util/appUtils';
import './style.scss';
import actionCodes from '../data/helpdeskActionCodes.json';
import DialogHeader from '../../commonComponents/dialogHeader';

const appModels = require('../../util/appModels').default;

const Comments = () => {
  const dispatch = useDispatch();
  const editor = useRef(null);
  const [comment, setComment] = useState('');
  const [isEditor, showEditor] = useState(false);
  const [openNotes, setOpenNotes] = useState(false)
  const { ticketDetail } = useSelector((state) => state.ticket);
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const { orderComments, createCommentInfo } = useSelector((state) => state.workorder);
  const allowedOperations = getListOfOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'code');

  const isCommentAllowed = allowedOperations.includes(actionCodes['Add Comment']);

  /* useEffect(() => {
    if (ticketDetail && ticketDetail.data && isCommentAllowed) {
      const ids = ticketDetail.data.length > 0 ? ticketDetail.data[0].message_ids : [];
      dispatch(getOrdersComments(ids, appModels.MESSAGE));
    }
  }, [ticketDetail]); */

  useEffect(() => {
    if (createCommentInfo && createCommentInfo.data) {
      const viewId = ticketDetail && ticketDetail.data && ticketDetail.data.length > 0 ? ticketDetail.data[0].id : '';
      // dispatch(getTicketDetail(viewId, appModels.HELPDESK));
      dispatch(resetComments());
      setOpenNotes(false)
    }
  }, [createCommentInfo]);

  const onCommontChange = (data) => {
    setComment(data);
  };

  const sendComment = () => {
    const id = ticketDetail.data.length > 0 ? ticketDetail.data[0].id : '';
    if (id) {
      const values = {
        model: appModels.HELPDESK, res_id: id, body: comment, message_type: 'comment',
      };
      dispatch(createOrderComment(values, appModels.MESSAGE));
      setComment('');

      setTimeout(() => {
        const postData = {
          log_note: comment,
          log_note_date: moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss'),
          last_commented_by: userInfo && userInfo.data && userInfo.data.name ? userInfo.data.name : '',
        };
        dispatch(updateTicket(id, appModels.HELPDESK, postData));
      }, 1000);
    }
  };

  return (
    <>
      {isCommentAllowed && (
        <>
          <IconButton className="ticket-filter-btn" onClick={() => setOpenNotes(true)}>
            <BsChatLeftDots />
          </IconButton>
          <Dialog maxWidth={'lg'} open={openNotes}>
            <DialogHeader title={'Comments'} onClose={() => setOpenNotes(false)} />
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                <FormGroup className="mt-2">
                  <JoditEditor
                    ref={editor}
                    value={comment}
                    onChange={onCommontChange}
                    onBlur={onCommontChange}
                  />
                  {/* {(!isEditor || (comment && comment.length === 0)) && (
                  <Input
                    type="input"
                    defaultValue={comment}
                    className="subjectticket bw-2 mt-0"
                    placeholder="Enter Comment"
                    onClick={() => showEditor(true)}
                    onMouseLeave={() => showEditor(false)}
                  />
                )} */}
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
                  <SuccessAndErrorFormat response={createCommentInfo} successMessage="Comment added successfully." />
                )}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              {orderComments && !orderComments.loading && (
                <Button
                  disabled={!comment || (createCommentInfo && createCommentInfo.loading)}
                  type="button"
                  onClick={() => sendComment()}
                  variant="contained"
                  className="submit-btn"
                >
                  Send
                </Button>
              )}
            </DialogActions>
          </Dialog>
        </>
      )}
      {/* <Col sm="12" md="12" lg="12" xs="12" className=""> */}
      {/* (orderComments && orderComments.data) && orderComments.data.map((log) => (
            <div key={log.id} className="mb-1 mt-0 user-info-div">
              <div className="user-info-circle">
                <span className="font-weight-800 user-info-label">{generateTag(log.author_id ? log.author_id[1] : '', 2)}</span>
              </div>
              <div className="user-info-text">
                <h5>{log.author_id ? log.author_id[1] : ''}</h5>
                <p className="text-grayish-blue m-0 font-tiny font-weight-400">{getLocalTime(log.date)}</p>
                <p className="mt-1" dangerouslySetInnerHTML={{ __html: htmlToReact(log.body) }} />
              </div>
            </div>
          )) */}

      {/* orderComments && orderComments.loading && (
          <Loader />
          ) */}
      {/* (orderComments && orderComments.err) && (
          <ErrorContent errorTxt={generateErrorMessage(orderComments)} />
          ) */}
      {/* </Col> */}
    </>
  );
};

export default Comments;
