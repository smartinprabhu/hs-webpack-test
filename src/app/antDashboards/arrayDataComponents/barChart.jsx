/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
import React from 'react';
import { Column } from '@ant-design/charts';
import * as PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { translateText } from '../../util/appUtils';

const BarChart = (props) => {
  const {
    barData,
    xField,
    yField,
    seriesField,
    colorField,
    colors,
  } = props;

  const { userInfo } = useSelector((state) => state.user);

  const config = {
    data: barData,
    padding: 'auto',
    xField,
    yField,
    seriesField,
    colorField, // or seriesField in some cases
    color: ({ priority }) => {
      let res = '#6395f9';
      if (priority === translateText('High', userInfo)) {
        res = '#ff3333';
      } else if (priority === translateText('Medium', userInfo)) {
        res = '#ff9933';
      } else if (priority === translateText('Low', userInfo)) {
        res = '#ffff80';
      }
      return res;
    },
    height: 300,
    width: 300,
    xAxis: {
      label: {
        autoRotate: false,
      },
    },
    yAxis: {
      label: {
        formatter: (v) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
      },
    },
    scrollbar: {
      type: 'horizontal',
    },
    animation: {
      appear: {
        animation: 'path-in',
        duration: 5000,
      },
    },
  };

  return (
    <div className="position-relative">
      <Column {...config} />
    </div>
  );
};

BarChart.propTypes = {
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
  colorField: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  colors: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.array,
  ]).isRequired,
};

export default BarChart;
