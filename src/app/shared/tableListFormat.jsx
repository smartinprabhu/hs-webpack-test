/* eslint-disable import/no-unresolved */
import React from 'react';
import * as PropTypes from 'prop-types';

import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';

import { generateErrorMessage } from '../util/appUtils';

const TableListFormat = (props) => {
  const {
    userResponse, listResponse, countLoad,
  } = props;

  const isUserError = userResponse && userResponse.err;
  const loading = (userResponse && userResponse.loading) || (listResponse && listResponse.loading) || (countLoad);
  const userErrorMsg = generateErrorMessage(userResponse);
  const errorMsg = (listResponse && listResponse.err) ? generateErrorMessage(listResponse) : userErrorMsg;

  return (
    <>
      {loading && (
      <div className="mb-2 mt-3 p-5" data-testid="loading-case">
        <Loader />
      </div>
      )}
      {((listResponse && listResponse.err) || isUserError) && (

      <ErrorContent errorTxt={errorMsg} />

      )}
    </>
  );
};

TableListFormat.defaultProps = {
  countLoad: false,
};

TableListFormat.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  userResponse: PropTypes.any.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  listResponse: PropTypes.any.isRequired,
  countLoad: PropTypes.bool,
};

export default TableListFormat;
