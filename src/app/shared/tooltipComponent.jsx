/* eslint-disable import/no-unresolved */
import React from 'react';
import * as PropTypes from 'prop-types';
import {
  Button,
} from 'reactstrap';
import { Tooltip } from 'antd';

import closeCircle from '@images/icons/closeCircle.svg';

const TooltipComponent = (props) => {
  const {
    closeDrawer,
  } = props;

  return (
    <Tooltip title="Close" placement="left">
      <Button className="rounded-pill bg-white" size="sm" onClick={closeDrawer}>
        <img src={closeCircle} aria-hidden className="" height="15" width="15" alt="close" />
      </Button>
    </Tooltip>
  );
};

TooltipComponent.propTypes = {
  closeDrawer: PropTypes.func.isRequired,
};

export default TooltipComponent;
