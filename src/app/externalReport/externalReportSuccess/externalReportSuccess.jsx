/* eslint-disable import/no-unresolved */
/* eslint-disable prefer-destructuring */
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';
import * as PropTypes from 'prop-types';
import {
  Box,
} from '@mui/material';

import {
  generateErrorMessage,
} from '../../util/appUtils';

function externalReportSuccess(props) {
  const { createInfo, statusInfo } = props;

  const loading = (createInfo && createInfo.loading) || (statusInfo && statusInfo.loading);

  let errorResult = (
    <div />
  );

  const isSuccess = (createInfo && createInfo.data);

  if (!isSuccess) {
    if (createInfo && createInfo.err) {
      errorResult = (
        <ErrorContent errorTxt={generateErrorMessage(createInfo)} />
      );
    }
  }

  return (
    <Box  sx={{ fontFamily: "Suisse Intl" }}>
      {loading && (
      <div className="mb-2 mt-3 " data-testid="loading-case">
        <Loader />
      </div>
      )}
      {(((createInfo && createInfo.data) || (statusInfo && statusInfo.data)) && !loading) && (
        <>
          <FontAwesomeIcon size="lg" className="action-fa-button-lg text-success" icon={faCheckCircle} />
          <h6 className="text-center text-success mb-3 mt-2" data-testid="success-case">
            You will receive email updates on the status of the ticket.
          </h6>
        </>
      )}
      {(createInfo && createInfo.err && !createInfo.data) && (
      <div className="p-3 word-break-content">
        {errorResult}
      </div>
      )}
    </Box>
  );
}

externalReportSuccess.propTypes = {
  isIncident: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
};
externalReportSuccess.defaultProps = {
  isIncident: false,
};

export default externalReportSuccess;
