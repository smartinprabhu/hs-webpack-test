/* eslint-disable import/no-unresolved */
import React from 'react';
import * as PropTypes from 'prop-types';
import { RingProgress } from '@ant-design/charts';

const ProgressBar = (props) => {
  const {
    color,
    percent,
    uom,
  } = props;

  const textOptions = {
    title: {
      style: {
        color,
      },
      formatter: () => uom,
    },
  };

  const per = uom === 'ppm' ? percent / 1000 : percent / 100;

  return (
    <RingProgress
      color={color}
      forceFit
      height={128}
      percent={per}
      statistic={textOptions}
    />
  );
};

ProgressBar.propTypes = {
  color: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  percent: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  uom: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
};

export default ProgressBar;
