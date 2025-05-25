import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { Button } from 'reactstrap';

import './cancelButtonRoundedGrey.scss';

const CancelButtonGrey = ({ openCloseModalWindow, disabled }) => (
  <Button disabled={disabled} className="btn buttonGrey py-0 px-2 btn-close float-right greyButton" outline onClick={openCloseModalWindow}>
    Close
    <FontAwesomeIcon icon={faTimesCircle} className="ml-1" />
  </Button>
);

CancelButtonGrey.propTypes = {
  disabled: PropTypes.bool,
  openCloseModalWindow: PropTypes.func.isRequired,
};

CancelButtonGrey.defaultProps = {
  disabled: undefined,
};

export default CancelButtonGrey;
