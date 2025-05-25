/* eslint-disable radix */
/* eslint-disable array-callback-return */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import {
  Input,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import DOMPurify from 'dompurify';
import {
  Button, Dialog, DialogContent, DialogContentText, DialogActions,
} from '@mui/material';

import closeCircle from '@images/icons/closeCircle.svg';
import closeCircleWhite from '@images/icons/closeCircleWhite.svg';
import checkWhite from '@images/icons/checkWhite.svg';
import DialogHeader from '../../commonComponents/dialogHeader';
import { getCustomButtonName } from '../../gatePass/utils/utils';

const RejectWp = (props) => {
  const {
    atReject,
    atDone,
    setMessage,
    isReturnReject,
    wpConfigData,
  } = props;

  const [messageTicket, setMessageTicket] = useState('');

  const [isButtonHover, setButtonHover] = useState(false);

  const rejectWp = () => {
    atDone();
  };

  const onMessageChange = (e) => {
    setMessage(DOMPurify.sanitize(e.target.value));
    setMessageTicket(DOMPurify.sanitize(e.target.value));
  };

  return (
    <Dialog size="md" open>
      <DialogHeader title={`${getCustomButtonName(isReturnReject ? 'Return Reject' : 'Reject', wpConfigData)} Gate Pass`} imagePath={false} response={false} onClose={atReject} />
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <div className="text-center mt-3 mb-3">
            <h5 className="mb-3">
              Are you sure to
              {' '}
              {getCustomButtonName(isReturnReject ? 'Return Reject' : 'Reject', wpConfigData)}
              {' '}
              the gate pass ?
            </h5>
            <div>
              <Input type="textarea" name="body" placeholder="Enter Reason here" value={messageTicket} onChange={onMessageChange} className="mt-2 bg-whitered" rows="4" />
              {!messageTicket && (<span className="text-danger ml-1">Reason required</span>)}
            </div>
          </div>
        </DialogContentText>
      </DialogContent>
      <DialogActions className="float-right">
        <Button
          variant="contained"
          className="rounded-pill mr-2"
          onClick={() => atReject()}
          onMouseLeave={() => setButtonHover(false)}
          onMouseEnter={() => setButtonHover(true)}
        >
          <span className="page-actions-header content-center">
            <img src={isButtonHover ? closeCircleWhite : closeCircle} className="mr-2" alt="Deny" width="13" height="13" />
            <span>Cancel</span>
          </span>
        </Button>
        <Button
          className="rounded-pill"
          disabled={!messageTicket}
          onClick={() => rejectWp()}
          variant="contained"
        >
          <img src={checkWhite} className="mr-2" alt="Prepare" width="13" height="13" />
          <span>{getCustomButtonName(isReturnReject ? 'Return Reject' : 'Reject', wpConfigData)}</span>
        </Button>
      </DialogActions>
    </Dialog>
  );
};

RejectWp.propTypes = {
  atReject: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
  atDone: PropTypes.func.isRequired,
};
export default RejectWp;
