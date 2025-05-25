/* eslint-disable import/no-unresolved */
/* eslint-disable prefer-destructuring */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';
import * as PropTypes from 'prop-types';

import { onDocumentCreatesAttach, updateTicket } from '../ticketService';
import {
  generateErrorMessage, prepareDocuments,
} from '../../util/appUtils';

const appModels = require('../../util/appModels').default;

const TicketSuccess = (props) => {
  const { isIncident } = props;
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  const {
    updateTicketInfo, addTicketInfo, uploadPhoto, documentCreateAttach,
  } = useSelector((state) => state.ticket);
  const {
    createTenantinfo,
  } = useSelector((state) => state.setup);

  useEffect(() => {
    if (addTicketInfo && addTicketInfo.data && addTicketInfo.data.length > 0) {
      if (uploadPhoto && uploadPhoto.length && uploadPhoto.length > 0) {
        const dcreate = prepareDocuments(uploadPhoto, addTicketInfo.data[0]);
        dispatch(onDocumentCreatesAttach(dcreate));
      }
    }
  }, [addTicketInfo]);

  useEffect(() => {
    if ((addTicketInfo && addTicketInfo.data) && (createTenantinfo && createTenantinfo.data)) {
      const updateData = { requestee_id: createTenantinfo.data[0] };
      dispatch(updateTicket(addTicketInfo.data[0], appModels.HELPDESK, updateData));
    }
  }, [addTicketInfo, createTenantinfo]);

  const loading = (userInfo && userInfo.loading) || (addTicketInfo && addTicketInfo.loading) || (updateTicketInfo && updateTicketInfo.loading) || (documentCreateAttach && documentCreateAttach.loading)
  || (createTenantinfo && createTenantinfo.loading);
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsgDocument = (documentCreateAttach && documentCreateAttach.err) ? generateErrorMessage(documentCreateAttach) : userErrorMsg;

  let errorResult = (
    <div />
  );

  const isSuccess = (addTicketInfo && addTicketInfo.data) || (updateTicketInfo && updateTicketInfo.data);

  if (!isSuccess) {
    if (addTicketInfo && addTicketInfo.err) {
      errorResult = (
        <ErrorContent errorTxt={generateErrorMessage(addTicketInfo)} />
      );
    } else if (updateTicketInfo && updateTicketInfo.err) {
      errorResult = (
        <ErrorContent errorTxt={generateErrorMessage(updateTicketInfo)} />
      );
    } else if (documentCreateAttach && documentCreateAttach.err) {
      errorResult = (
        <ErrorContent errorTxt={errorMsgDocument} />
      );
    }
  }

  return (
    <>
      {loading && (
      <div className="mb-2 mt-3 p-5" data-testid="loading-case">
        <Loader />
      </div>
      )}
      {((addTicketInfo && addTicketInfo.data) && (documentCreateAttach && !documentCreateAttach.err && !documentCreateAttach.loading)) && (
        <>
          <FontAwesomeIcon size="lg" className="action-fa-button-lg text-success" icon={faCheckCircle} />
          <h6 className="text-center text-success mb-0 mt-2" data-testid="success-case">
            The
            {' '}
            {isIncident ? 'incident' : 'ticket'}
            {' '}
            has been created successfully.
          </h6>
        </>
      )}
      {((addTicketInfo && addTicketInfo.err) || (documentCreateAttach && documentCreateAttach.err) || (updateTicketInfo && updateTicketInfo.err)) && (
      <div className="p-3 word-break-content">
        {errorResult}
      </div>
      )}
      {((addTicketInfo && !addTicketInfo.data && !addTicketInfo.err) && (updateTicketInfo && updateTicketInfo.data)) && (
      <>
        <FontAwesomeIcon size="lg" className="action-fa-button-lg text-success" icon={faCheckCircle} />
        <h6 className="text-center text-success mb-0 mt-2" data-testid="success-case">
          The
          {' '}
          {isIncident ? 'incident' : 'ticket'}
          {' '}
          has been updated successfully.
        </h6>
      </>
      )}
    </>
  );
};

TicketSuccess.propTypes = {
  isIncident: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
};
TicketSuccess.defaultProps = {
  isIncident: false,
};

export default TicketSuccess;
