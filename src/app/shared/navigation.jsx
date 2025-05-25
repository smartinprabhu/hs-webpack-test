import React from 'react';
import * as PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Navigation = (props) => {
  const {
    overviewName, overviewPath, listName, afterList, detailName,
  } = props;

  const onListClick = () => {
    if (afterList) afterList();
  };

  return (
    <>
      { overviewName !== ''
        ? (
          <span className="font-weight-800 mr-1 font-medium link-text">

            <Link to={overviewPath}>{overviewName}</Link>
            {' '}
            /
          </span>
        )
        : ''}
      {listName !== ''
        ? (
          <span aria-hidden="true" className="font-weight-800 font-medium cursor-pointer" onClick={() => onListClick()}>
            {listName}
            {' '}
            /
          </span>
        )
        : ''}
      <span className="font-weight-400 ml-1 font-16" title={detailName}>
        {detailName}
      </span>
    </>
  );
};

Navigation.propTypes = {
  overviewName: PropTypes.string.isRequired,
  overviewPath: PropTypes.string.isRequired,
  listName: PropTypes.string.isRequired,
  afterList: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.bool,
  ]).isRequired,
  detailName: PropTypes.string.isRequired,
};

export default Navigation;
