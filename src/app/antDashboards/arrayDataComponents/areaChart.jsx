/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
import React from 'react';
import { Area } from '@ant-design/plots';
import * as PropTypes from 'prop-types';

const AreaChart = (props) => {
  const {
    barData,
    xField,
    yField,
    seriesField,
  } = props;

  const config = {
    data: barData,
    xField,
    yField,
    seriesField,
    colorField: 'priority', // or seriesField in some cases
    color: ['#ff3333', '#ff9933', '#ffff80'],
    autoFit: true,
    smooth: true,
    xAxis: {
      label: {
        autoRotate: false,
      },
    },
    scrollbar: {
      type: 'horizontal',
    },
  };

  return (
    <div className="position-relative">
      <Area {...config} />
    </div>
  );
};

AreaChart.propTypes = {
  barData: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.array,
  ]).isRequired,
  xField: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  yField: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  seriesField: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
};

export default AreaChart;
