/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import {
  Button,
  Popover,
  PopoverHeader,
  PopoverBody,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import * as PropTypes from 'prop-types';

import AssetDetailInfo from './assetDetailInfo';

const PopOverSpace = (props) => {
  const {
    actionIndex, actionName, popoverModal, atFinish,
  } = props;

  const [popoverOpen, setPopoverOpen] = useState(popoverModal);
  const toggle = () => { setPopoverOpen(!popoverOpen); atFinish(); };
  return (
    <>
      {actionIndex && (
      <Popover placement="right" isOpen={popoverOpen} target={`${'Popover-'}${actionIndex}`} toggle={toggle}>
        <PopoverHeader>
          <div>
            <span className="light-text mr-1">Asset :</span>
            {actionName}
            <FontAwesomeIcon
              size="lg"
              onClick={toggle}
              className="cursor-pointer float-right"
              icon={faTimesCircle}
            />
          </div>
        </PopoverHeader>
        <PopoverBody>
          <AssetDetailInfo />
          <Button  variant="contained" className="btn-sm float-right mb-1 mr-1" onClick={toggle}>
            Close
          </Button>
        </PopoverBody>
      </Popover>
      )}
    </>
  );
};

PopOverSpace.propTypes = {
  actionName: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  actionIndex: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  popoverModal: PropTypes.bool.isRequired,
  atFinish: PropTypes.func.isRequired,
};

export default PopOverSpace;
