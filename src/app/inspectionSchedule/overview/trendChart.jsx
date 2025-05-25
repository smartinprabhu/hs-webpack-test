/* eslint-disable radix */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-unresolved */
import React, { useMemo } from 'react';
import {
  Bar,
} from 'react-chartjs-2';
import * as PropTypes from 'prop-types';
import ErrorContent from '@shared/errorContent';
import Chart from 'react-apexcharts';
import ApexCharts from 'apexcharts';

import '../../analytics/nativeDashboard/nativeDashboard.scss';
import customData from '../data/customData.json';
import { getDatasetsApex } from '../utils/utils';

const TrendChart = React.memo((props) => {
  const { chartData } = props;

  // const chartValues = chartData && chartData.ks_chart_data ? JSON.parse(chartData.ks_chart_data) : false;

  // const options = customData.barChartOptions;

  const isDataExists = chartData && chartData.datasets && chartData.datasets.length > 0;

  function getArrayColors(label) {
    let result = '';

    if (label === 'Upcoming') {
      result = '#1092dc';
    } else if (label === 'Missed') {
      result = '#ec5824';
    } else if (label === 'Completed') {
      result = '#28a745';
    }

    return result;
  }

  const radarData = useMemo(() => {
    const series = getDatasetsApex(chartData.datasets, chartData.labels).datasets;
    const filteredSeries = series.filter((item) => item.data.some((val) => val !== 0));
    const options = {
      chart: {
        height: 350,
        type: 'bar',
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
      dataLabels: {
        enabled: false,
      },
      colors: filteredSeries.map((item) => getArrayColors(item.name)),
      legend: {
        position: 'top',
        show: true,
      },
      xaxis: {
        categories: chartData.labels,
        labels: {
          rotate: -45, // 👈 Rotate labels for slanted text
          rotateAlways: true,
          style: {
            fontSize: '12px',
          },
        },
        style: {
          fontSize: '10px',
          fontWeight: 600,
          fontFamily: 'Suisse Intl',
        },
      },
    };
    const allZero = filteredSeries.length === 0;
    const result = { options, series: filteredSeries, allZero };
    return result;
  }, [chartData]);

  return (
    isDataExists ? (
      radarData.allZero ? <ErrorContent errorTxt="No data here." />
        : (
          <div id="chart-auditi">
            <Chart id="chart-audit" options={radarData.options} series={radarData.series} type="bar" height={350} />
          </div>
        )
    )

      : (
        <ErrorContent errorTxt="No data here." />
      )
  );
});

TrendChart.propTypes = {
  chartData: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.array,
    PropTypes.object,
  ]).isRequired,
};
export default TrendChart;
