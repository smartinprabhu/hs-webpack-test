/* eslint-disable import/no-unresolved */
import React from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';
import {
  generateErrorMessage,
} from '../../../../util/appUtils';

function preventiveCheckListSuccess() {
  const { addPreventiveOperation } = useSelector((state) => state.ppm);
  return (
    <>
      {addPreventiveOperation && addPreventiveOperation.loading && (
      <span data-testid="loading-case">
        <Loader />
      </span>
      )}
      {addPreventiveOperation && addPreventiveOperation.data && (
        <h5 className="text-center text-success" data-testid="success-case">
          <FontAwesomeIcon size="lg" className="action-fa-button-lg" icon={faCheck} />
          {' '}
          {' '}
          The operation has been created successfully.
        </h5>
      )}
      {addPreventiveOperation && addPreventiveOperation.err && (
        <ErrorContent errorTxt={generateErrorMessage(addPreventiveOperation)} />
      )}
    </>
  );
}

export default preventiveCheckListSuccess;
