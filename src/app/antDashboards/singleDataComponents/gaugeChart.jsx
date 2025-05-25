/* eslint-disable no-shadow */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
import React from 'react';
import * as PropTypes from 'prop-types';
import { Gauge } from '@ant-design/plots';

const GaugeChart = (props) => {
  const {
    color,
    rangeColor,
    value,
    uom,
    maxValue,
    minValue,
    fontSize,
    width,
    height,
  } = props;

  const per = value ? ((value - minValue) * 100) / (maxValue - minValue) : 0;

  const config = {
    percent: per ? per / 100 : 0.01,
    width: width || 100,
    height: height || 115,
    range: {
      color: rangeColor,
      width: 9,
    },
    gaugeStyle: {
      cursor: 'pointer',
    },
    indicator: null,
    axis: {
      label: {
        formatter(v) {
          return Number(v) * 100;
        },
        style: {
          fontSize: 0,
        },
      },
      tickLine: {
        style: {
          lineWidth: 0,
        },
      },
      tickInterval: 0,
      tickCount: 1,
      subTickLine: {
        count: 0,
      },
    },
    statistic: {
      title: {
        offsetY: -24,
        style: {
          fontSize,
          color,
        },
        formatter: ({ percent }) => `${value}`,
      },
      content: {
        offsetY: -8,
        style: {
          fontSize: 12,
          color,
        },
        formatter: () => uom,
      },
    },
  };

  return (
    <Gauge {...config} />
  );
};

GaugeChart.defaultProps = {
  width: false,
  height: false,
};

GaugeChart.propTypes = {
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
  fontSize: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
  ]).isRequired,
  maxValue: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
  ]).isRequired,
  minValue: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
  ]).isRequired,
  rangeColor: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  width: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
  ]),
  height: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
  ]),
};

export default GaugeChart;
