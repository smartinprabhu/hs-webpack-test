/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
/* eslint-disable react/prop-types */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable import/no-unresolved */
import React, { useState, useMemo, useEffect } from 'react';
import * as PropTypes from 'prop-types';
import Chart from 'react-apexcharts';
import moment from 'moment';

import './styles.css';

import { useTheme } from '../../ThemeContext';
import customData from '../data/customData.json';
import {
  getLabelData, getXData, getYData, getYPointsData, getPointsData, getLabData,
  sanitizeLabels, sanitizeSeriesArray,
} from './utils';
import { isJsonString, getDiiffNoOfDays } from '../../util/appUtils';

const BarChartComponent = (props) => {
  const {
    isHorizontal,
    height,
    isExpand,
    xTitle,
    yTitle,
    selectedDateTag,
    width,
    dType,
    isMutliChart,
    divHeight,
    customDateValue,
    expand,
    boxClass,
    headingText,
    handleExpand,
    chartItemValues,
    dateGroup,
    datasets,
    labels,
    chartData,
    chartOptions,
    drillDownFunc,
    isDrillChart,
    isIot,
  } = props;

  const [chartDataSets, setChartDataSets] = useState(datasets);

  const { themes } = useTheme();

  const labelColor = (labelData) => (labelData.color ? labelData.color : '#1890ff');

  function getJsonString(str) {
    return JSON.parse(str);
  }

  const isDataLabel = isIot ? (chartData && (chartData.ks_info && isJsonString(chartData.ks_info) && getJsonString(chartData.ks_info).show_datalabel === 'true')) : (chartData && chartData.ks_description && isJsonString(chartData.ks_description) && getJsonString(chartData.ks_description).show_datalabel === 'true');

  const isShowTimeOnly = isIot ? (chartData && (chartData.ks_info && isJsonString(chartData.ks_info) && getJsonString(chartData.ks_info).show_time_only === 'true')) : (chartData && chartData.ks_description && isJsonString(chartData.ks_description) && getJsonString(chartData.ks_description).show_time_only === 'true');

  const areaFillColorData = isIot ? (chartData && (chartData.ks_info && isJsonString(chartData.ks_info) && getJsonString(chartData.ks_info).fill_color_data)) : (chartData && chartData.ks_description && isJsonString(chartData.ks_description) && getJsonString(chartData.ks_description).fill_color_data);

  const isYaxisAnnotation = useMemo(() => (isIot
    ? (chartData && chartData.ks_info && isJsonString(chartData.ks_info) && getJsonString(chartData.ks_info).y_axis_annotation === 'true')
    : (chartData && chartData.ks_description && isJsonString(chartData.ks_description) && getJsonString(chartData.ks_description).y_axis_annotation === 'true')), [isIot, chartData]);

  const isGoalEnable = chartData && chartData.ks_goal_enable && chartData.ks_standard_goal_value;
  const isAnnotation = chartData?.hx_annotations_data_ids?.length;

  const isBarPercentage = isIot ? datasets && datasets.length && datasets.length > 1 && (chartData && (chartData.ks_info && isJsonString(chartData.ks_info) && getJsonString(chartData.ks_info).show_bar_percentage === 'true')) : datasets && datasets.length && datasets.length > 1 && (chartData && chartData.ks_description && isJsonString(chartData.ks_description) && getJsonString(chartData.ks_description).show_bar_percentage === 'true');

  const isTools = !((chartData
    && chartData.hx_annotations_data_ids
    && chartData.hx_annotations_data_ids.length && !isYaxisAnnotation) || (labels && labels.length < 15));

  function getMinAndMaxValue() {
    let res = false;
    if (
      isIot
      && chartData
      && chartData.ks_info
      && isJsonString(chartData.ks_info)
    ) {
      const jsonData = getJsonString(chartData.ks_info);
      if (jsonData && jsonData.max) {
        res = { min: jsonData.min, max: jsonData.max };
      }
    } else if (
      chartData
      && chartData.ks_description
      && isJsonString(chartData.ks_description)
    ) {
      const jsonData = getJsonString(chartData.ks_description);
      if (jsonData && jsonData.max) {
        res = { min: jsonData.min, max: jsonData.max };
      }
    }
    return res;
  }

  function deepMerge(obj1, obj2) {
    // Check if both values are objects
    if (typeof obj1 === 'object' && typeof obj2 === 'object') {
      // Iterate over obj2 properties
      for (const key in obj2) {
        // If the property is an object, recursively merge
        if (obj2.hasOwnProperty(key) && obj2[key] && typeof obj2[key] === 'object') {
          // If obj1 also has the property and it's an object, merge recursively
          if (obj1[key] && typeof obj1[key] === 'object') {
            obj1[key] = deepMerge(obj1[key], obj2[key]);
          } else {
            // Otherwise, assign the property from obj2 to obj1
            obj1[key] = obj2[key];
          }
        } else {
          // If the property is not an object, assign it to obj1
          obj1[key] = obj2[key];
        }
      }
    } else {
      // If either value is not an object, use obj2 value
      obj1 = obj2;
    }

    return obj1;
  }

  const mainBarOptions = {
    /* plotOptions: {
      bar: {
        horizontal: isHorizontal,
        distributed: !!(
          !isDrillChart
          && datasets
          && datasets.length
          && datasets.length === 1
          && !datasets[0].color
        ),
        // columnWidth: isHorizontal ? "35%" : "55%",
        dataLabels: {
          orientation: 'vertical',
          position: 'top', // top, center, bottom
          hideOverflowingLabels: false,
        },
      },
    },
    grid: {
      padding: {
        bottom: labels.some((each) => each && each.length > 25) ? 30 : 2,
      },
    },
    dataLabels: {
      enabled: !!isDataLabel,
      formatter: (val) => getLabelData(val),
      style: {
        // fontSize: `${height + 1}px`,
        colors: ['#000000'],
        fontSize: !isExpand ? `${height - 4}px` : 0,
        fontWeight: 500,
        fontFamily: 'Suisse Intl',
      },
      offsetY: 5,
    }, */
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
      custom: ((chartData && chartData.ks_chart_date_groupby === 'hour') || (dateGroup && dateGroup === 'hour')) && isShowTimeOnly ? function ({
        series, seriesIndex, dataPointIndex, w,
      }) {
        return (
          `<div class="arrow_box" style="padding:8px;">${labels}` && labels.length && `${labels[dataPointIndex]} : ${getLabelData(series[seriesIndex][dataPointIndex])
          }</span>`
          + '</div>'
        );
      } : undefined,
    },
    xaxis: {
      categories:
        isAnnotation && !isYaxisAnnotation
          ? getLabData(labels)
          : sanitizeLabels(labels),
      type:
        isAnnotation && !isYaxisAnnotation
          ? 'datetime'
          : undefined,
      tickPlacement:
        isAnnotation && !isYaxisAnnotation
          ? 'between'
          : 'between',
      min: isAnnotation && labels && labels.length === 1 ? getLabData(labels)[0] - 1000000 : undefined,
      max: isAnnotation && labels && labels.length === 1 ? getLabData(labels)[0] + 1000000 : undefined,
      /* title: {
        text:
          chartData && chartData.title_x_axis ? chartData.title_x_axis : xTitle,
        style: {
          fontSize: '11.5px',
          fontWeight: 600,
          fontFamily: 'Suisse Intl',
        },
        offsetY: labels.some((each) => each && each.length > 25) ? 28 : 0,
      }, */
    },
    yaxis: {
      min: getMinAndMaxValue() ? getMinAndMaxValue().min : undefined,
      max: getMinAndMaxValue() ? getMinAndMaxValue().max : undefined,
      labels: {
        formatter(val, index) {
          return getLabelData(val);
        },
        style: {
          fontSize: '10px',
          fontWeight: 400,
          fontFamily: 'Suisse Intl',
        },
        // offsetX: 7,
      },
      /* title: {
        text:
          chartData && chartData.title_y_axis ? chartData.title_y_axis : yTitle,
        style: {
          fontSize: '11.5px',
          fontWeight: 600,
          fontFamily: 'Suisse Intl',
        },
      }, */
    },
    /* legend: {
      show: datasets[0]?.name !== undefined,
    }, */
    chart: {
      events: {
        dataPointSelection: (event, chartContext, config) => drillDownFunc(config),
      },
      // stacked: chartData && chartData.ks_bar_chart_stacked,
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
  };

  const barOptions = deepMerge(chartOptions, mainBarOptions);

  barOptions.xaxis.categories = isAnnotation && !isYaxisAnnotation ? getLabData(labels) : sanitizeLabels(labels);

  if (
    !isDrillChart
    && datasets
    && datasets.length
    && datasets.length === 1
    && !datasets[0].color
  ) {
    // barOptions.colors = datasets[0].colors;
    const chartValues = chartData && chartData.ks_chart_data
      ? JSON.parse(chartData.ks_chart_data)
      : false;
    barOptions.colors = chartValues && chartData && !(!chartData.ks_chart_relation_sub_groupby_field_type && (chartData.ks_chart_relation_groupby_field_type === 'date' || chartData.ks_chart_relation_groupby_field_type === 'datetime')) && chartValues.colors ? chartValues.colors : ['#4bb5f5'];
  }

  if (
    !isDrillChart && chartOptions && chartOptions.dataLabels
  ) {
    if (barOptions && barOptions.dataLabels && !isBarPercentage) {
      barOptions.dataLabels.formatter = function (value) {
        // Your custom formatting logic here
        return getLabelData(value);// Example: Format the label to two decimal places
      };
    }
    if (barOptions && barOptions.theme && barOptions.theme.palette && barOptions.theme.palette !== 'palette1') {
      barOptions.colors = undefined;
    }
    if (labels && labels.length <= 5) {
      barOptions.xaxis.labels.rotateAlways = false;
    }
    barOptions.xaxis.labels.style = {
      fontSize: '10px',
      fontWeight: 400,
      fontFamily: 'Suisse Intl',
      color: 'red',
    };
    barOptions.xaxis.labels.datetimeUTC = false;
    if (barOptions && barOptions.theme && barOptions.theme.palette && barOptions.theme.palette === 'palette1') {
      delete barOptions.theme;
      barOptions.plotOptions.bar.distributed = !!(!isDrillChart && datasets && datasets.length && datasets.length === 1 && !datasets[0].color);
      barOptions.legend.show = datasets && datasets.length && datasets.length > 1;
    }
    if (isBarPercentage) {
      barOptions.dataLabels.enabled = true;
      barOptions.dataLabels.formatter = function (value, opts) {
        const sum = opts.w.globals.columnSeries[opts.seriesIndex].reduce((a, b) => a + b, 0);
        const percent = (value / sum) * 100;
        return `${percent.toFixed(0)}%`;
      };
    }
    if (barOptions.yaxis && barOptions.yaxis.length > 0) {
      barOptions.yaxis = barOptions.yaxis[0];
      barOptions.yaxis.labels.formatter = function (value) {
        // Your custom formatting logic here
        return getLabelData(value);// Example: Format the label to two decimal places
      };
      barOptions.yaxis.labels.style = {
        fontSize: '10px',
        fontWeight: 400,
        fontFamily: 'Suisse Intl',
      };
      barOptions.yaxis.labels.offsetX = 12;
      barOptions.grid.padding.bottom = labels.some((each) => each && each.length > 25) ? 30 : 0;
      barOptions.grid.padding.left = 0;
      barOptions.yaxis.labels.padding = 0;
      barOptions.yaxis.title.offsetX = -13;
      barOptions.yaxis.axisBorder.show = false;
      barOptions.chart.id = '';
      barOptions.dataLabels.background.padding = 0;
      delete barOptions.chart.animations;
      delete barOptions.yaxis.crosshairs;
      delete barOptions.yaxis.showForNullSeries;
      delete barOptions.yaxis.logBase;
      delete barOptions.yaxis.logarithmic;
      delete barOptions.stroke;
      delete barOptions.labels;
    }
  }

  if (!isDrillChart && chartOptions && !chartOptions.dataLabels) {
    barOptions.plotOptions = {
      bar: {
        horizontal: isHorizontal,
        distributed: !!(
          !isDrillChart
          && datasets
          && datasets.length
          && datasets.length === 1
          && !datasets[0].color
        ),
        // columnWidth: isHorizontal ? "35%" : "55%",
        dataLabels: {
          orientation: 'vertical',
          position: 'top', // top, center, bottom
          hideOverflowingLabels: false,
        },
      },
    };
    barOptions.grid = {
      padding: {
        bottom: labels.some((each) => each && each.length > 25) ? 30 : 2,
      },
    };
    barOptions.dataLabels = {
      enabled: !!isDataLabel,
      formatter: (val) => getLabelData(val),
      style: {
        // fontSize: `${height + 1}px`,
        colors: ['#fff'],
        fontSize: !isExpand ? `${height - 4}px` : 0,
        fontWeight: 600,
        fontFamily: 'Suisse Intl',
      },
      offsetY: 5,
    };
    if (isBarPercentage) {
      barOptions.dataLabels.enabled = true;
      barOptions.dataLabels.formatter = function (value, opts) {
        const sum = opts.w.globals.columnSeries[opts.seriesIndex].reduce((a, b) => a + b, 0);
        const percent = (value / sum) * 100;
        return `${percent.toFixed(0)}%`;
      };
    }
    barOptions.legend = {
      show: datasets
        && datasets.length
        && datasets.length > 1,
    };
    barOptions.xaxis.labels = {
      rotateAlways: false, // labels && labels.length && labels.some((each) => each && each.length > 15),
      style: {
        fontSize: '10px',
        fontWeight: 400,
        fontFamily: 'Suisse Intl',
        color: 'red',
      },
    };
    barOptions.xaxis.title = {
      text:
        chartData && chartData.title_x_axis ? chartData.title_x_axis : xTitle,
      style: {
        fontSize: '13px',
        fontWeight: 800,
        fontFamily: 'Suisse Intl',
      },
      offsetY: labels.some((each) => each && each.length > 25) ? 28 : 0,
    };
    barOptions.yaxis.title = {
      text:
        chartData && chartData.title_y_axis ? chartData.title_y_axis : yTitle,
      style: {
        fontSize: '11.5px',
        fontWeight: 600,
        fontFamily: 'Suisse Intl',
      },
    };
    barOptions.yaxis.labels.offsetX = 7;
  }

  if (!isDrillChart && isAnnotation && !isYaxisAnnotation) {
    const xData = chartData.hx_annotations_data_ids.filter(
      (item) => item.hx_parameter === 'xaxis',
    );
    const pData = chartData.hx_annotations_data_ids.filter(
      (item) => item.hx_parameter === 'points',
    );
    barOptions.annotations = {
      xaxis: getXData(xData, labels),
      points: getPointsData(pData, datasets, labels),
    };
    barOptions.chart.zoom = { enabled: false };
  }

  if (!isDrillChart && isAnnotation && isYaxisAnnotation) {
    const yData = chartData.hx_annotations_data_ids.filter(
      (item) => item.hx_parameter === 'yaxis',
    );
    const pData = chartData.hx_annotations_data_ids.filter(
      (item) => item.hx_parameter === 'points',
    );
    barOptions.annotations = {
      yaxis: getYData(yData),
      points: getYPointsData(pData, datasets, labels, chartData.ks_chart_date_groupby),
    };
    barOptions.chart.zoom = { enabled: false };
  }

  function arraySum(arr) {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) sum += arr[i];
    return sum;
  }

  function splitMonthName(label) {
    let result = label;
    if (label) {
      const timeArr = label.split(' ');
      if (timeArr && timeArr.length > 1 && timeArr && timeArr.length === 4) {
        result = timeArr[0];
      } else {
        result = label;
      }
    }
    return result;
  }

  function removeYearFromString(inputString) {
    // Regular expression to match a year in the format YYYY (e.g., 2023)
    const yearPattern = /\b\d{4}\b/g;

    // Use the `replace` method to remove the year from the string
    const stringWithoutYear = inputString ? inputString.toString().replace(yearPattern, '') : '';

    return splitMonthName(stringWithoutYear);
  }

  function getMin(labelData) {
    const min = Math.min(...labelData.data);
    return min && parseFloat(min.toFixed(2));
  }

  function getMax(labelData) {
    const max = Math.max(...labelData.data);
    return max && parseFloat(max.toFixed(2));
  }

  function getAvg(labelData) {
    const avg = ((labelData.data.reduce((pv, cv) => pv + cv, 0) / labelData.data.length)
      * 100)
      / 100;

    return avg && parseFloat(avg.toFixed(2));
  }

  function getRangeScore(value, ranges) {
    let score = '';
    if (ranges && ranges.length) {
      const rangeData = ranges.filter(
        (item) => parseFloat(item.ks_from ? item.ks_from : 0) <= parseFloat(value)
          && parseFloat(item.ks_to) >= parseFloat(value),
      );
      if (rangeData && rangeData.length) {
        score = rangeData[0].ks_colors;
      }
    }
    return score;
  }

  function getRangeLegend(value, ranges) {
    let score = '';
    if (ranges && ranges.length) {
      const rangeData = ranges.filter(
        (item) => parseFloat(item.ks_from ? item.ks_from : 0) <= parseFloat(value)
          && parseFloat(item.ks_to) >= parseFloat(value),
      );
      if (rangeData && rangeData.length) {
        score = rangeData[0].ks_legend;
      }
    }
    if (ranges && ranges.length) {
      if (parseFloat(value) > parseFloat(ranges[ranges?.length - 1]?.ks_to)) {
        score = ranges[ranges?.length - 1].ks_legend;
      }
    }

    return score;
  }

  function getFillColorValue() {
    let res = false;
    if (areaFillColorData) {
      if (areaFillColorData === 'average') {
        const data = chartDataSets && chartDataSets.length ? chartDataSets[0] : [];
        res = getAvg(data);
      } else if (areaFillColorData === 'last') {
        const data = chartDataSets && chartDataSets.length && chartDataSets[0].data && chartDataSets[0].data.length ? chartDataSets[0].data[chartDataSets[0].data.length - 1] : [];
        res = data;
      }
    }
    return res;
  }

  const showValuesByDefault = () => {
    const array = [];
    if (!(isAnnotation)) {
      datasets
        && datasets.length
        && chartDataSets.map((labelData, i) => {
          if (chartData && chartData.ks_min && labelData?.data.length !== 0) {
            array.push({
              y: Math.min(...labelData.data),
              strokeDashArray: 0,
              borderColor: labelColor(labelData),
              label: {
                borderColor: labelColor(labelData),
                style: {
                  color: '#fff',
                  background: labelColor(labelData),
                },
                text: `Min : ${getMin(labelData)}`,
                position: 'left',
              },
            });
          }
          if (chartData && chartData.ks_max && labelData?.data.length !== 0) {
            array.push({
              y: Math.max(...labelData.data),
              strokeDashArray: 0,
              borderColor: labelColor(labelData),
              label: {
                style: {
                  color: '#fff',
                  background: labelColor(labelData),
                },
                text: `Max : ${getMax(labelData)}`,
              },
            });
          }
          if (chartData && chartData.ks_sum && labelData?.data.length !== 0) {
            array.push({
              y: Math.max(...labelData.data),
              strokeDashArray: 0,
              borderColor: labelColor(labelData),
              label: {
                style: {
                  color: '#fff',
                  background: labelColor(labelData),
                },
                text: `Total : ${arraySum(labelData.data)
                  && parseFloat(arraySum(labelData.data).toFixed(2))
                }`,
              },
            });
          }
          if (chartData && chartData.ks_avg && labelData?.data.length !== 0) {
            array.push({
              y:
                labelData.data.reduce((pv, cv) => pv + cv, 0)
                / labelData.data.length,
              strokeDashArray: 0,
              borderColor: labelColor(labelData),
              label: {
                style: {
                  color: '#fff',
                  background: labelColor(labelData),
                },
                text: `Avg : ${getAvg(labelData)}`,
                position: 'center',
              },
            });
          }
        });
      if (isGoalEnable) {
        array.push({
          y: chartData.ks_standard_goal_value,
          strokeDashArray: 0,
          borderColor: getRangeScore(
            parseFloat(chartData.ks_standard_goal_value),
            chartData && chartData.ks_hx_sla_audit_metric_line_ids ? chartData.ks_hx_sla_audit_metric_line_ids : [],
          ),
          label: {
            style: {
              color: '#fff',
              background: getRangeScore(
                parseFloat(chartData.ks_standard_goal_value),
                chartData && chartData.ks_hx_sla_audit_metric_line_ids ? chartData.ks_hx_sla_audit_metric_line_ids : [],
              ),
            },
            text: `${getRangeLegend(
              parseFloat(chartData.ks_standard_goal_value),
              chartData && chartData.ks_hx_sla_audit_metric_line_ids ? chartData.ks_hx_sla_audit_metric_line_ids : [],
            )}  ${parseFloat(chartData.ks_standard_goal_value)}`,
          },
        });
      }
    }
    return array;
  };

  if (barOptions && !barOptions.dataLabels && !isBarPercentage) {
    barOptions.dataLabels = {
      enabled: !!isDataLabel,
      formatter: (val) => getLabelData(val),
      style: {
        // fontSize: `${height + 1}px`,
        colors: ['#fff'],
        fontSize: !isExpand ? `${height - 4}px` : 0,
        fontWeight: 600,
        fontFamily: 'Suisse Intl',
      },
      offsetY: 5,
    };
  }

  if (!isDrillChart && barOptions.xaxis && barOptions.xaxis.labels && !(isAnnotation)) {
    barOptions.xaxis.labels.formatter = function (val) {
    // Your custom formatting logic here
      return (((chartData && chartData.ks_chart_date_groupby === 'hour') || (dateGroup && dateGroup === 'hour')) && isShowTimeOnly ? removeYearFromString(val) : val);// Example: Format the label to two decimal places
    };
  }

  function isCustomSigle() {
    let res = false;
    if (selectedDateTag && selectedDateTag === 'l_custom' && customDateValue && customDateValue.length > 1 && customDateValue[0] && customDateValue[1]) {
      const s1 = moment(customDateValue[0]._d).format('YYYY-MM-DD');
      const s2 = moment(customDateValue[1]._d).format('YYYY-MM-DD');
      const days = getDiiffNoOfDays(s1, s2);
      res = days === 0;
    }
    return res;
  }

  const isSingleDay = selectedDateTag && (chartData && chartData.ks_chart_date_groupby === 'hour') && (selectedDateTag === 'l_day' || selectedDateTag === 'ls_day' || isCustomSigle());

  const otherOptions = {
    ...customData.otherApexChartOptions,

    grid: {
      show: false,
      padding: {
        left: 40,
        bottom: labels.some((each) => each && each.length > 20) ? 40 : 2,
      },
    },
    colors: areaFillColorData ? [getRangeScore(
      getFillColorValue(),
      chartData && chartData.ks_hx_sla_audit_metric_line_ids ? chartData.ks_hx_sla_audit_metric_line_ids : [],
    )] : undefined,
    fill: {
      colors: areaFillColorData ? getRangeScore(
        getFillColorValue(),
        chartData && chartData.ks_hx_sla_audit_metric_line_ids ? chartData.ks_hx_sla_audit_metric_line_ids : [],
      ) : undefined,
      type: 'gradient',
      gradient: {
        shade: 'light',
      },
    },
    dataLabels: {
      enabled: !!isDataLabel,
      formatter: (val) => getLabelData(val),
      style: {
        // fontSize: `${height + 1}px`,
        colors: ['#000000'],
        fontSize: !isExpand ? `${height - 4}px` : 0,
        fontWeight: 500,
        fontFamily: 'Suisse Intl',
      },
      offsetY: 5,
    },
    xaxis: {
      categories: isAnnotation && isSingleDay ? getLabData(labels) : sanitizeLabels(labels),
      type: isAnnotation && isSingleDay ? 'datetime' : undefined,
      tickPlacement: isAnnotation && chartData.ks_chart_date_groupby === 'hour' ? 'between' : 'on',
      min: isAnnotation && labels && labels.length > 0 && isSingleDay ? getLabData(labels)[0] : undefined,
      max: isAnnotation && labels && labels.length > 0 && isSingleDay ? getLabData(labels)[labels.length - 1] + (isSingleDay ? 3600000 : 0) : undefined,
      labels: {
        style: {
          fontSize: '10px',
          fontWeight: 400,
          fontFamily: 'Suisse Intl',
        },
        datetimeUTC: false,
        formatter: isAnnotation ? undefined : (val) => (chartData && chartData.ks_chart_date_groupby === 'hour' && isShowTimeOnly ? removeYearFromString(val) : val),
        rotate: -45,
        rotateAlways: !isExpand ? !(isIot && isAnnotation) && labels && labels.length > 5 : !(isIot && isAnnotation) && ((labels && labels.some((each) => each && each.length > 10)) || (labels && labels.length > 10)),
        hideOverlappingLabels: !isExpand,
        showDuplicates: true,
      },
      title: {
        text:
          chartData && chartData.title_x_axis ? chartData.title_x_axis : xTitle,
        // offsetX: isExpand ? 10 : 3,
        // offsetY: isExpand ? (labels.length > 20 ? 5 : -10) : -5,
        style: {
          // fontSize: !isExpand ? `${height - 4}px` : 0,
          fontSize: '11.5px',
          fontWeight: 600,
          fontFamily: 'Suisse Intl',
        },
      },
    },
    yaxis: {
      min: getMinAndMaxValue() ? getMinAndMaxValue().min : undefined,
      max: isGoalEnable && datasets && datasets.length === 1 ? (max) => {
        max = Math.max(...datasets[0].data);
        return chartData.ks_standard_goal_value && chartData.ks_standard_goal_value > max ? chartData.ks_standard_goal_value + 1 : max;
      } : undefined,
      forceNiceScale: true,
      axisBorder: {
        show: false,
      },
      labels: {
        formatter(val, index) {
          return getLabelData(val);
        },
        style: {
          // fontSize: !isExpand ? `${height}px` : 0,
          fontSize: '11.5px',
          fontWeight: 400,
          fontFamily: 'Suisse Intl',
        },
      },
      title: {
        text:
          chartData && chartData.title_y_axis ? chartData.title_y_axis : yTitle,
        // offsetX: isExpand ? 2 : 5,
        // offsetY: isExpand ? 2 : 5,
        style: {
          // fontSize: !isExpand ? `${height}px` : 0,
          fontSize: '11.5px',
          fontWeight: 600,
          fontFamily: 'Suisse Intl',
          cssClass: 'apexcharts-xaxis-title',
        },
      },
    },
    annotations: {
      yaxis: showValuesByDefault(),
    },
    tooltip: {
      enabled: true,
      intersect: true,
      shared: false,
      y: {
        formatter: (val) => getLabelData(val),
        title: {
          formatter: (seriesName) => (chartData && chartData.title_y_axis ? chartData.title_y_axis : seriesName),
        },
      },
      custom: chartData && chartData.ks_chart_date_groupby === 'hour' && isShowTimeOnly ? function ({
        series, seriesIndex, dataPointIndex, w,
      }) {
        return (
          `<div class="arrow_box" style="padding:8px;">${labels}` && labels.length && `${labels[dataPointIndex]} : ${getLabelData(series[seriesIndex][dataPointIndex])
          }</span>`
          + '</div>'
        );
      } : undefined,
    },
    stroke: {
      width: 3,
      curve: 'smooth',
    },
    markers: {
      size: [5, 5],
    },
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
          reset: false, // isTools,
        },
      },
      events: {
        dataPointSelection: (event, chartContext, config) => drillDownFunc(config),
        legendClick: (chartContext, seriesIndex, config) => {
          if (chartDataSets[seriesIndex]?.data?.length) {
            setChartDataSets(
              chartDataSets.map((each, i) => {
                if (i === seriesIndex) {
                  return { ...each, data: [] };
                }
                return each;
              }),
            );
          } else {
            setChartDataSets(
              chartDataSets.map((each, i) => {
                if (i === seriesIndex) {
                  return { ...each, data: datasets[seriesIndex]?.data };
                }
                return each;
              }),
            );
          }
        },
      },
    },
    legend: {
      // fontSize: !isExpand ? `${height - 4}px` : "10px",
      show: datasets
        && datasets.length
        && datasets.length > 1,
      fontSize: '11px',
      fontWeight: 500,
      fontFamily: 'Suisse Intl',
      position: 'bottom',
      horizontalAlign: 'center',
      onItemHover: {
        highlightDataSeries: false,
      },
    },
    toolbar: {
      tools: {
        export: {
          csv: {
            filename: chartData && chartData.name,
          },
          svg: {
            filename: chartData && chartData.name,
          },
          png: {
            filename: chartData && chartData.name,
          },
        },
      },
    },
  };

  if (!isDrillChart && isAnnotation && !isYaxisAnnotation) {
    const xData = chartData.hx_annotations_data_ids.filter(
      (item) => item.hx_parameter === 'xaxis',
    );
    const pData = chartData.hx_annotations_data_ids.filter(
      (item) => item.hx_parameter === 'points',
    );
    otherOptions.annotations = {
      xaxis: getXData(xData, labels),
      points: getPointsData(pData, datasets, labels),
    };
    otherOptions.chart.zoom = { enabled: false };
  }

  if (!isDrillChart && isAnnotation && isYaxisAnnotation) {
    const yData = chartData.hx_annotations_data_ids.filter(
      (item) => item.hx_parameter === 'yaxis',
    );
    const pData = chartData.hx_annotations_data_ids.filter(
      (item) => item.hx_parameter === 'points',
    );
    otherOptions.annotations = {
      yaxis: getYData(yData),
      points: getYPointsData(pData, datasets, labels, chartData.ks_chart_date_groupby),
    };
    otherOptions.chart.zoom = { enabled: false };
  }

  if (themes === 'light' && !isDrillChart) {
    otherOptions.grid.yaxis = { lines: { show: false } };
  }
 
  if (themes === 'light' && barOptions.yaxis && !barOptions.yaxis.length && !isDrillChart) {
    barOptions.grid.yaxis = { lines: { show: false } };
  }


  const calHeight = divHeight ? divHeight - 50 : height * 28;

  return (
    <Chart
      id={chartData && chartData.id}
      type={dType}
      height={!isExpand ? calHeight : '100%'}
      series={isAnnotation ? datasets : sanitizeSeriesArray(datasets)}
      options={dType === 'bar' && !isMutliChart ? barOptions : otherOptions}
    />
  );
};

BarChartComponent.defaultProps = {
  expand: false,
  dType: 'bar',
  boxClass: 'vertical-bar-chart-box',
  headingText: '',
  datasets: [],
  labels: [],
  xTitle: '',
  yTitle: '',
  isHorizontal: false,
  drillDownFunc: () => { },
};

BarChartComponent.propTypes = {
  expand: PropTypes.bool,
  isHorizontal: PropTypes.bool,
  boxClass: PropTypes.string,
  headingText: PropTypes.string,
  datasets: PropTypes.array,
  labels: PropTypes.array,
  handleExpand: PropTypes.func.isRequired,
  height: PropTypes.number.isRequired,
  xTitle: PropTypes.string,
  yTitle: PropTypes.string,
  dType: PropTypes.string,
  drillDownFunc: PropTypes.func,
};

export default BarChartComponent;
