import React from 'react';
import * as PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const CustomModalMessage = (props) => {
  const {
    errorMessage, successMessage,
  } = props;

  return (
    <>
      {successMessage && (
        <div className="text-center text-success">
          <FontAwesomeIcon size="sm" className="mr-2 font-size20 mb-n2px text-success" icon={faCheckCircle} />
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="text-danger text-center mt-3">
          <FontAwesomeIcon className="mr-2 font-size20 mb-n2px" size="lg" icon={faExclamationCircle} />
          {errorMessage}
        </div>
      )}
    </>
  );
};

CustomModalMessage.defaultProps = {
  successMessage: undefined,
  errorMessage: undefined,
};

CustomModalMessage.propTypes = {
  successMessage: PropTypes.string,
  errorMessage: PropTypes.string,
};

export default CustomModalMessage;
