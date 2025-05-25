/* eslint-disable radix */
/* eslint-disable max-len */
/* eslint-disable react/prop-types */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable import/no-unresolved */
import React from 'react';
import Chart from 'react-apexcharts';

import PageLoader from '@shared/pageLoader';

import BarChartComponent from './barChartComponent';

import { isJsonString, getJsonString } from '../../util/appUtils';

const GetBarChart = (props) => {
  const {
    chartId,
    height,
    showModal,
    isShowModal,
    chartValues,
    onChartItemClickPoint,
    loading,
    chartItemType,
    dateGroup,
    drillDownCharts,
    customDateValue,
    customHeight,
    chartItemValues,
    dType,
    datasets,
    selectedDateTag,
    chartData,
    isMutliChart,
    dashboardColors,
    isIot,
    divHeight,
  } = props;

  const getToFixedTotal = (w) => {
    const total = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
    return total && total.toFixed(2);
  };

  const isDataLabel = isIot ? (chartData && (chartData.ks_info && isJsonString(chartData.ks_info) && getJsonString(chartData.ks_info).show_datalabel === 'true')) : (chartData && chartData.ks_description && isJsonString(chartData.ks_description) && getJsonString(chartData.ks_description).show_datalabel === 'true');

  const pieChartFixedTotal = (val) => val.toFixed(2);

  function getChartOptions() {
    let res = {};
    if (dashboardColors && dashboardColors.length && chartData && chartData.id) {
      const resu = dashboardColors.filter((item) => item.id === chartData.id);
      if (isIot) {
        if (resu && resu.length) {
          res = resu[0].dashboard_item_json;
        }
      } else if (resu && resu.length && isJsonString(resu[0].dashboard_item_json)) {
        res = getJsonString(resu[0].dashboard_item_json);
      }
    }
    return res;
  }

  const ogHeight = !isIot ? customHeight * 27 : customHeight * 23;

  const isNumberFormat = isIot ? (chartData && (chartData.ks_info && isJsonString(chartData.ks_info) && getJsonString(chartData.ks_info).number_format)) : (chartData && chartData.ks_description && isJsonString(chartData.ks_description) && getJsonString(chartData.ks_description).number_format);
  const numberFormat = isNumberFormat && isNumberFormat === 'integer' ? isNumberFormat : false;

  const getTooltipValue = (val, opts) => {
    const res = opts.globals && opts.globals.seriesPercent && opts.globals.seriesPercent[opts.dataPointIndex] ? opts.globals.seriesPercent[opts.dataPointIndex][0] : 0;
    return numberFormat ? res && `${parseInt(val)} (${parseInt(res)}%)` : res && `${parseFloat(val).toFixed(2)} (${parseFloat(res).toFixed(2)}%)`;
  };

  const getOriginalValue = (val, opts) => `${opts.w.config.series[opts.seriesIndex].toFixed(2)} (${val.toFixed(0)}%)`;

  return (
    <>
      {!chartId && (
        <BarChartComponent
          isHorizontal={
            chartData.ks_dashboard_item_type === 'ks_horizontalBar_chart'
          }
          expand={false}
          dType={dType}
          isMutliChart={isMutliChart}
          xTitle={chartData.x_axis_label}
          customDateValue={customDateValue}
          yTitle="Count"
          height={height}
          selectedDateTag={selectedDateTag}
          boxClass="vertical-bar-chart-box"
          headingText={chartData.name}
          chartData={chartData}
          dateGroup={dateGroup}
          handleExpand={{}}
          isExpand={showModal || isShowModal}
          chartOptions={getChartOptions()}
          datasets={datasets}
          labels={chartValues.labels}
          drillDownFunc={onChartItemClickPoint}
          isDrillChart={false}
          isIot={isIot}
          divHeight={divHeight}
        />
      )}
      {chartId && loading && <PageLoader type="chart" />}
      {chartId && drillDownCharts.includes(chartItemType) && (
        <BarChartComponent
          isHorizontal={chartItemType === 'ks_horizontalBar_chart'}
          expand={false}
          dType={dType}
          isMutliChart={isMutliChart}
          height={height}
          boxClass="vertical-bar-chart-box"
          handleExpand={{}}
          chartOptions={getChartOptions()}
          selectedDateTag={selectedDateTag}
          customDateValue={customDateValue}
          xTitle=""
          yTitle="Count"
          isExpand={showModal || isShowModal}
          datasets={datasets}
          labels={chartItemValues.labels}
          drillDownFunc={onChartItemClickPoint}
          isDrillChart
          isIot={isIot}
          divHeight={divHeight}
        />
      )}
      {chartId
        && (chartItemType === 'ks_pie_chart'
          || chartItemType === 'ks_doughnut_chart') && (
          <Chart
            type={chartItemType === 'ks_doughnut_chart' ? 'donut' : 'pie'}
            height={showModal ? '100%' : ogHeight}
            series={
              chartItemValues.datasets && chartItemValues.datasets.length
                ? chartItemValues.datasets[0].data
                : []
            }
            options={{
              chart: {
                events: {
                  dataPointSelection: (event, chartContext, config) => onChartItemClickPoint(config),
                },
              },
              legend: {
                position: 'bottom',
              },
              dataLabels: {
                enabled: !!isDataLabel,
                formatter: (val, opts) => getOriginalValue(val, opts),
                style: {
                  fontSize: `${height + 3}px`,
                },
                background: {
                  enabled: true,
                  foreColor: '#000000',
                  padding: 4,
                  borderRadius: 2,
                  borderWidth: 1,
                  borderColor: '#fff',
                  opacity: 0.9,
                  dropShadow: {
                    enabled: false,
                    top: 1,
                    left: 1,
                    blur: 1,
                    color: '#000',
                    opacity: 0.45,
                  },
                },
                dropShadow: {
                  enabled: false,
                  top: 1,
                  left: 1,
                  blur: 1,
                  color: '#000',
                  opacity: 0.45,
                },
              },
              labels: chartItemValues.labels,
              colors: chartItemValues.colors,
              tooltip: {
                enabled: true,
                y: {
                  formatter: (val, opts) => getTooltipValue(val, opts),
                },
              },
              plotOptions: {
                pie: {
                  donut: {
                    labels: {
                      show: true,
                      total: {
                        formatter: (w) => getToFixedTotal(w),
                        show: true,
                        showAlways: true,
                        fontWeight: 600,
                        fontSize: `${height + 3}px`,
                        color: '#ffffff',
                      },
                      value: {
                        color: '#ffffff',
                        fontWeight: 600,
                        fontSize: `${height + 3}px`,
                      },
                    },
                  },
                },
              },
            }}
          />
      )}
    </>
  );
};

export default GetBarChart;
