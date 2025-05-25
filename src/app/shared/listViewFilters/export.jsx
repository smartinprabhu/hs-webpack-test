/* eslint-disable import/no-unresolved */
import React from 'react';
import { useDispatch } from 'react-redux';
import { Tooltip } from 'antd';
import * as PropTypes from 'prop-types';

import fileMiniIcon from '@images/icons/fileMini.svg';
import fileMiniDisableIcon from '@images/icons/fileMiniDisable.svg';

import { setInitialValues } from '../../purchase/purchaseService';

const ExportList = (props) => {
  const { idNameFilter, response } = props;
  const dispatch = useDispatch();

  return (
    <>
      <Tooltip title="Export" placement="top">
      {response && (
        <img
          aria-hidden="true"
          id={idNameFilter || 'Export'}
          alt="Export"
          className="cursor-pointer mr-2"
          onClick={() => { dispatch(setInitialValues(false, false, false, true)); }}
          src={fileMiniIcon} />
      )}
        {!(response) && (
          <img
            aria-hidden="true"
            id={idNameFilter || 'Export'}
            alt="Export"
            className="exportDisabled mr-2"
            onClick={() => { dispatch(setInitialValues(false, false, false, false)); }}
            src={fileMiniDisableIcon} />
        )}
      </Tooltip>
    </>
  );
};

ExportList.defaultProps = {
  idNameFilter: false,
  response: false,
};

ExportList.propTypes = {
  idNameFilter: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),
};

export default ExportList;
