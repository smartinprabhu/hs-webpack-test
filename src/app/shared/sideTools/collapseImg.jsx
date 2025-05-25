/* eslint-disable import/no-unresolved */
import React from 'react';
import * as PropTypes from 'prop-types';
import {
  UncontrolledTooltip,
} from 'reactstrap';

import filterIcon from '@images/filter.png';

const CollapseImg = (props) => {
  const {
    onCollapse,
    isBack,
  } = props;

  return (
    <>
      {isBack
        ? (
          <>

          </>
        )
        : (
          <>
            <img src={filterIcon} height="30px" aria-hidden="true" width="30px" alt="filters" onClick={() => onCollapse()} className="cursor-pointer filter-left ml-4" id="filters" />
            <UncontrolledTooltip target="filters" placement="right">
              Filters
            </UncontrolledTooltip>
          </>
        )}
    </>
  );
};

CollapseImg.propTypes = {
  onCollapse: PropTypes.func.isRequired,
  isBack: PropTypes.bool,
};

CollapseImg.defaultProps = {
  isBack: false,
};

export default CollapseImg;
