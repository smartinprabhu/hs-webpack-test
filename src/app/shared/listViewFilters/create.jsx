import React from 'react';
import * as PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Tooltip } from 'antd';

// eslint-disable-next-line import/no-unresolved
import plusCircleMiniIcon from '@images/icons/plusCircleMini.svg';
import { setInitialValues } from '../../purchase/purchaseService';

const CreateList = (props) => {
  const {
    name, showCreateModal,
  } = props;
  const dispatch = useDispatch();

  return (
    <>
      <Tooltip title={name} placement="top">
        <img
          aria-hidden="true"
          id="Add"
          alt="Add"
          className="cursor-pointer mr-2"
          onClick={() => { showCreateModal(); dispatch(setInitialValues(false, false, false, false)); }}
          src={plusCircleMiniIcon}
        />
      </Tooltip>
    </>
  );
};

CreateList.propTypes = {
  name: PropTypes.string.isRequired,
  showCreateModal: PropTypes.func.isRequired,
};

export default CreateList;
