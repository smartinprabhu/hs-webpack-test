import React from 'react';
import * as PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { generateErrorMessageDetail } from '../util/appUtils';

const SuccessAndErrorFormat = (props) => {
  const {
    response, successMessage, staticErrorMsg, staticSuccessMessage, apiErrorMsg, customErrMsg,
  } = props;

  return (
    <>
      {response && (response.data || response.status) && successMessage && (
        <div className="text-center text-success">
          <FontAwesomeIcon size="sm" className="mr-2 font-size20 mb-n2px text-success" icon={faCheckCircle} />
          {successMessage}
        </div>
      )}
      {response && response.err && (response.err.data || response.err.error || response.err.statusText) && (
        <div className="text-danger text-center mt-3">
          <FontAwesomeIcon className="mr-2 font-size20 mb-n2px" size="lg" icon={faExclamationCircle} />
          {apiErrorMsg && staticErrorMsg
            && generateErrorMessageDetail(response).includes(apiErrorMsg)
            ? (
              <>
                {staticErrorMsg}
              </>
            )
            : (
              <>
                {customErrMsg || generateErrorMessageDetail(response)}
              </>
            )}
        </div>
      )}
      {!response && staticErrorMsg && (
      <div className="text-danger text-center mt-3">
        <FontAwesomeIcon className="mr-2 font-size20 mb-n2px" size="lg" icon={faExclamationCircle} />
        {staticErrorMsg}
      </div>
      )}
      {!response && staticSuccessMessage && (
      <div className="text-success text-center mt-3">
        <FontAwesomeIcon className="mr-2 font-size20 mb-n2px" size="lg" icon={faCheckCircle} />
        {staticSuccessMessage}
      </div>
      )}
    </>
  );
};

SuccessAndErrorFormat.defaultProps = {
  successMessage: undefined,
};

SuccessAndErrorFormat.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  response: PropTypes.any.isRequired,
  successMessage: PropTypes.string,
};

export default SuccessAndErrorFormat;
