/* eslint-disable react/prop-types */
/* eslint-disable import/no-unresolved */
import React from 'react';
import importMiniIcon from '@images/icons/importMini.svg';
import { Tooltip } from 'antd';

const Upload = ({ setEnable }) => (
  <Tooltip title="Bulk Upload" placement="top">
    <img
      aria-hidden="true"
      id="Bulk Upload"
      alt="Bulk Upload"
      height={18}
      width={18}
      className="cursor-pointer mr-2"
      src={importMiniIcon}
      onClick={() => { setEnable(); }}
    />
  </Tooltip>
);
export default Upload;
