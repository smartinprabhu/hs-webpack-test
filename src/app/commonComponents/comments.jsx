/* eslint-disable react/no-danger */
/* eslint-disable import/no-unresolved */
import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import JoditEditor from 'jodit-react';
import { Button } from "@mui/material";
import {
    BsChatLeftDots,
} from "react-icons/bs";
import { IconButton } from "@mui/material";
import { Dialog, DialogActions, DialogContent, DialogContentText } from '@mui/material'
import moment from 'moment-timezone';

import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import MuiTooltip from '@shared/muiTooltip';

import {
    createOrderComment, resetComments,
} from '../workorders/workorderService';
import { updateTicket } from '../helpdesk/ticketService';
import DialogHeader from '../commonComponents/dialogHeader';

const appModels = require('../util/appModels').default;

const Comments = (props) => {
    const { detailData, model, messageType, getDetail, setTab, tab, isHelpdesk } = props
    const dispatch = useDispatch();
    const [comment, setComment] = useState('');
    const [openNotes, setOpenNotes] = useState(false)
    const editor = useRef(null);
    const { orderComments, createCommentInfo } = useSelector((state) => state.workorder);
    const { userInfo } = useSelector((state) => state.user);

    useEffect(() => {
        if (createCommentInfo && createCommentInfo.data) {
            const viewId = detailData && detailData.data && detailData.data.length > 0 ? detailData.data[0].id : '';
            if (!isHelpdesk) {
                dispatch(getDetail(viewId, model));
            }
            dispatch(resetComments());
            if (setTab && tab) {
                setTab(tab)
            }
        }
    }, [createCommentInfo]);

    const onCommontChange = (data) => {
        setComment(data);
    };

    const sendComment = () => {
        const id = detailData.data.length > 0 ? detailData.data[0].id : '';
        if (id) {
            const values = {
                model: model, res_id: id, body: comment, message_type: messageType,
            };
            dispatch(createOrderComment(values, appModels.MESSAGE));
            if (isHelpdesk) {
                const postData = {
                    log_note: comment,
                    log_note_date: moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss'),
                    last_commented_by: userInfo && userInfo.data && userInfo.data.name ? userInfo.data.name : '',
                };
                dispatch(updateTicket(id, appModels.HELPDESK, postData));
            }
        }
    };

    return (
        <>
            <MuiTooltip title="Add Comment">
                <IconButton className="ticket-filter-btn" onClick={() => setOpenNotes(true)}>
                    <BsChatLeftDots />
                </IconButton>
            </MuiTooltip>
            <Dialog maxWidth={'lg'} open={openNotes}>
                <DialogHeader title={'Comments'} onClose={() => setOpenNotes(false)} />
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <JoditEditor
                            ref={editor}
                            value={comment}
                            onChange={onCommontChange}
                            onBlur={onCommontChange}
                        />
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
                            variant='contained'
                            className="submit-btn"
                        >
                            Send
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Comments;
