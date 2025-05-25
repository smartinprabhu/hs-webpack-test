/* eslint-disable no-nested-ternary */
import React from 'react';
import Chart from 'react-apexcharts';
import PropTypes from 'prop-types';

import { getHeatData, getColorOptions, getLabelData } from '../utils/utils';

const HeatMap = (props) => {
  const {
    chartData,
    chartValues,
    divHeight,
    isExpand,
    height,
  } = props;

  const datasets = getHeatData(chartValues.datasets, chartValues.labels);
  const colorOptions = getColorOptions(chartData && chartData.ks_hx_sla_audit_metric_line_ids ? chartData.ks_hx_sla_audit_metric_line_ids : []);

  console.log(datasets);

  const reHeight = divHeight > 500 && divHeight < 1000 ? 120 : divHeight > 1000 ? 170 : 70;

  const calHeight = divHeight ? divHeight - reHeight : height * 28;

  const options = {
    chart: {
      toolbar: {
        show: false, // isTools,
        tools: {
          download: false,
          selection: false, // isTools,
          zoom: false,
          zoomin: false, // isTools,
          zoomout: false, // isTools,
          pan: false, // isTools,
          reset: false, // isTools,s
        },
      },
    },
    plotOptions: {
      heatmap: {
        shadeIntensity: 0.5,
        radius: 0,
        useFillColorAsStroke: false,
        colorScale: {
          ranges: colorOptions,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: (val) => getLabelData(val),
        title: {
          formatter(seriesName) {
            return seriesName;
          },
        },
      },
    },
  };

  return (
    <Chart
      type="heatmap"
      height={!isExpand ? calHeight : '100%'}
      series={datasets}
      options={options}
    />
  );
};

HeatMap.propTypes = {
  chartData: PropTypes.objectOf.isRequired,
  chartValues: PropTypes.objectOf.isRequired,
};

export default HeatMap;
