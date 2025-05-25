import React from 'react';
import refreshIcon from '@images/refresh.svg';
import { Tooltip } from 'antd';

const Refresh = ({ loadingTrue, setReload }) => {
  return (
    <Tooltip title="Refresh" placement="top">
      <img
        aria-hidden="true"
        id='Refresh'
        alt="Refresh"
        height={20}
        width={20}
        className="cursor-pointer mr-2"
        src={refreshIcon}
        onClick={() => { if (!loadingTrue) setReload(Math.random()) }}
      />
    </Tooltip>
  )
}
export default Refresh