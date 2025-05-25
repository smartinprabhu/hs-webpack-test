/* eslint-disable react/prop-types */
/* eslint-disable import/no-unresolved */
import React from 'react';
import { Tooltip } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';

const OverviewBack = ({ onBack, taskId, moduleId }) => (
  <Tooltip title="Back to Overview" placement="top">
    <span aria-hidden className="cursor-pointer mr-4" onClick={() => onBack(taskId, moduleId)}>
      <FontAwesomeIcon
        icon={faArrowLeft}
        size="md"
      />
    </span>
  </Tooltip>
);

export default OverviewBack;
