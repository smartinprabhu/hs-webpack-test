import React from 'react';
import * as PropTypes from 'prop-types';

const DynamicBreadcrumb = (props) => {
  const {
    overviewName, listName, afterList, afterDetail, detailName,
  } = props;

  const onListClick = () => {
    if (afterList) afterList();
  };

  const onOverViewClick = () => {
    if (afterDetail) afterDetail();
  };

  return (
    <>
      {overviewName && (
      <span
        aria-hidden
        className="font-weight-800 mr-1 font-medium link-text cursor-pointer"
        onClick={() => onOverViewClick()}
      >
        {overviewName}
        {' '}
        /
      </span>
      )}
      {listName && (
      <span aria-hidden="true" className="font-weight-800 font-medium cursor-pointer" onClick={() => onListClick()}>
        {listName}
        {' '}
        /
      </span>
      )}
      <span className="font-weight-400 ml-1 font-16" title={detailName}>
        {detailName}
      </span>
    </>
  );
};

DynamicBreadcrumb.propTypes = {
  overviewName: PropTypes.string.isRequired,
  listName: PropTypes.string.isRequired,
  afterList: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.bool,
  ]).isRequired,
  afterDetail: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.bool,
  ]).isRequired,
  detailName: PropTypes.string.isRequired,
};

export default DynamicBreadcrumb;
