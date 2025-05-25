/* eslint-disable import/no-unresolved */
import React from 'react';
import * as PropTypes from 'prop-types';
import { Statistic } from 'antd';

const StatasticView = (props) => {
  const {
    color,
    value,
    uom,
  } = props;

  return (
    <Statistic title={uom} value={value} valueStyle={{ color }} />
  );
};

StatasticView.propTypes = {
  color: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  value: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  uom: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
};

export default StatasticView;
