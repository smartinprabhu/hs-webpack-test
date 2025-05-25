/* eslint-disable import/no-unresolved */
import React from 'react';
import * as PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

import Loader from '@shared/loading';

const ModalFormAlert = (props) => {
  const {
    alertResponse,
    alertText,
  } = props;

  return (
    <>
      {alertResponse && alertResponse.loading && (
      <div className="text-center mt-3">
        <Loader />
      </div>
      )}
      {(alertResponse && alertResponse.data) && (
      <div className="text-center text-success">
        <FontAwesomeIcon size="sm" className="mr-2 font-size20 mb-n2px text-success" icon={faCheckCircle} />
        {alertText}
      </div>
      )}
    </>
  );
};

ModalFormAlert.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  alertResponse: PropTypes.any.isRequired,
  alertText: PropTypes.string.isRequired,
};

export default ModalFormAlert;
