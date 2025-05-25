/* eslint-disable no-restricted-globals */
/* eslint-disable max-len */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable radix */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-lonely-if */
import React from 'react';
import { IoArrowDownSharp, IoArrowUpSharp } from 'react-icons/io5';
import Chart from 'react-apexcharts';

import {
  convertPXToVW,
  getLabelData,
  getTrimmedTargetData,
} from '../../utils/utils';
import {
  isJsonString,
  getJsonString,
} from '../../../util/appUtils';
import {
  newpercalculatePrev,
} from '../../../util/staticFunctions';

const SingleCardNumeric = React.memo(({
  chartData, chartValues, height, width, divHeight, divWidth,
}) => {
  const detailData = (chartData && ((chartData.ks_info && isJsonString(chartData.ks_info) && getJsonString(chartData.ks_info)) || (chartData.ks_description && isJsonString(chartData.ks_description) && getJsonString(chartData.ks_description))));

  const isGoalEnable = chartData && chartData.ks_goal_enable && chartData.ks_standard_goal_value;

  function getDatasetData(label) {
    let res = [];
    if (label && chartValues && chartValues.datasets && getTrimmedTargetData(chartValues.datasets).length > 1) {
      const arr = getTrimmedTargetData(chartValues.datasets).filter((item) => item.label === label);
      if (arr && arr.length) {
        res = arr[0].data;
      }
    } else if (chartValues && chartValues.datasets && getTrimmedTargetData(chartValues.datasets).length === 1) {
      const arr = getTrimmedTargetData(chartValues.datasets);
      if (arr && arr.length) {
        res = arr[0].data;
      }
    }
    return res;
  }

  function getDatasetLabel() {
    let res = [];
    if (chartValues && chartValues.datasets && getTrimmedTargetData(chartValues.datasets).length === 1) {
      const arr = getTrimmedTargetData(chartValues.datasets);
      if (arr && arr.length) {
        res = arr[0].label;
      }
    }
    return res;
  }

  function parseExp(str) {
    try {
      const func = new Function('str', `'use strict'; return (${str})`);
      return func(str);
    } catch (e) {
      return false;
    }
  }

  function getTypeOfDataValue(label, type) {
    let res = 0;
    if (label && type) {
      const data = getDatasetData(label);
      if (data && data.length) {
        if (type === 'first') {
          res = data[0];
        } else if (type === 'last') {
          res = data[data.length - 1];
        } else if (type === 'min') {
          res = Math.min(...data);
        } else if (type === 'max') {
          res = Math.max(...data);
        } else if (type === 'avg') {
          const dataSum = data.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
          res = dataSum / data.length;
        } else if (type === 'sum') {
          res = data.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        } else if (type === 'expression') {
          const exp = detailData && detailData.primary_value && detailData.primary_value.expression ? detailData.primary_value.expression : '';
          const sv1 = detailData && detailData.secondary_value1 && detailData.secondary_value1.source_data ? detailData.secondary_value1.source_data : '';
          const sv2 = detailData && detailData.secondary_value2 && detailData.secondary_value2.source_data ? detailData.secondary_value2.source_data : '';
          if (exp) {
            const res1 = exp.replaceAll('pv.first', getTypeOfDataValue(label, 'first'));
            const res2 = res1.replaceAll('pv.last', getTypeOfDataValue(label, 'last'));
            const res3 = res2.replaceAll('pv.min', getTypeOfDataValue(label, 'min'));
            const res4 = res3.replaceAll('pv.max', getTypeOfDataValue(label, 'max'));
            const res5 = res4.replaceAll('pv.avg', getTypeOfDataValue(label, 'avg'));
            const res6 = res5.replaceAll('pv.sum', getTypeOfDataValue(label, 'sum'));

            const res11 = res6.replaceAll('sv1.first', getTypeOfDataValue(sv1, 'first'));
            const res22 = res11.replaceAll('sv1.last', getTypeOfDataValue(sv1, 'last'));
            const res33 = res22.replaceAll('sv1.min', getTypeOfDataValue(sv1, 'min'));
            const res44 = res33.replaceAll('sv1.max', getTypeOfDataValue(sv1, 'max'));
            const res55 = res44.replaceAll('sv1.avg', getTypeOfDataValue(sv1, 'avg'));
            const res66 = res55.replaceAll('sv1.sum', getTypeOfDataValue(sv1, 'sum'));

            const res111 = res66.replaceAll('sv2.first', getTypeOfDataValue(sv2, 'first'));
            const res222 = res111.replaceAll('sv2.last', getTypeOfDataValue(sv2, 'last'));
            const res333 = res222.replaceAll('sv2.min', getTypeOfDataValue(sv2, 'min'));
            const res444 = res333.replaceAll('sv2.max', getTypeOfDataValue(sv2, 'max'));
            const res555 = res444.replaceAll('sv2.avg', getTypeOfDataValue(sv2, 'avg'));
            const res666 = res555.replaceAll('sv2.sum', getTypeOfDataValue(sv2, 'sum'));

            const formula = parseExp(res666);

            res = !isNaN(formula) && isFinite(formula) ? formula : 0;
          } else {
            res = 0;
          }
        }
      }
    }
    return res;
  }

  const formatCurrency = (number, prefix = '', suffix = '') => {
    const formattedNumber1 = number ? parseFloat(number).toFixed(2) : 0;

    // Add thousands separator
    const formattedNumber = formattedNumber1.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    // Format the number as a currency string
    return `${prefix}${formattedNumber}${suffix}`;
  };

  const formatDecimal = (number, prefix = '', suffix = '') => {
    // Add thousands separator
    const formattedNumber = parseFloat(number).toFixed(2);

    // Format the number as a currency string
    return `${prefix}${formattedNumber}${suffix}`;
  };

  const formatNumeric = (number, prefix = '', suffix = '') => {
    // Add thousands separator
    const formattedNumber = parseInt(number);

    // Format the number as a currency string
    return `${prefix}${formattedNumber}${suffix}`;
  };

  function getDataValue(label, type, format, prefix = '', suffix = '') {
    let res = 0;
    if (label && type) {
      const val = getTypeOfDataValue(label, type);
      if (format === 'decimal2f') {
        res = formatDecimal(val, prefix, suffix);
      } else if (format === 'numeric') {
        res = formatNumeric(val, prefix, suffix);
      } else if (format === 'monetary') {
        res = formatCurrency(val, prefix, suffix);
      }
    }
    return res;
  }

  function getPercentageKpi() {
    let res = '0 %';
    const sv2 = getTypeOfDataValue(detailData.secondary_value2 && detailData.secondary_value2.source_data ? detailData.secondary_value2.source_data : 'Count', detailData.secondary_value2 && detailData.secondary_value2.show_value ? detailData.secondary_value2.show_value : '');
    const sv1 = getTypeOfDataValue(detailData.secondary_value1 && detailData.secondary_value1.source_data ? detailData.secondary_value1.source_data : 'Count', detailData.secondary_value1 && detailData.secondary_value1.show_value ? detailData.secondary_value1.show_value : '');
    const pve = getTypeOfDataValue(detailData.primary_value && detailData.primary_value.source_data ? detailData.primary_value.source_data : 'Count', detailData.primary_value && detailData.primary_value.show_value ? detailData.primary_value.show_value : '');
    if (detailData && detailData.primary_value && detailData.primary_value.kpi_field2 && detailData.primary_value.kpi_field1) {
      let cv = 0;
      let pv = 0;
      if (detailData.primary_value.kpi_field1 === 'pv') {
        cv = pve;
      } else if (detailData.primary_value.kpi_field1 === 'sv1') {
        cv = sv1;
      } else if (detailData.primary_value.kpi_field1 === 'sv2') {
        cv = sv2;
      }

      if (detailData.primary_value.kpi_field2 === 'pv') {
        pv = pve;
      } else if (detailData.primary_value.kpi_field2 === 'sv1') {
        pv = sv1;
      } else if (detailData.primary_value.kpi_field2 === 'sv2') {
        pv = sv2;
      }

      const result = newpercalculatePrev(pv, cv);
      res = `${result} %`;
    } else if (!(detailData && detailData.primary_value && detailData.primary_value.kpi_field2 && detailData.primary_value.kpi_field1)) {
      const result = newpercalculatePrev(sv1, sv2);
      res = `${result} %`;
    }
    return res;
  }

  function getStatusColor(currentValue, prevValue, direction) {
    let res = '';
    const sv2 = getTypeOfDataValue(detailData.secondary_value2 && detailData.secondary_value2.source_data ? detailData.secondary_value2.source_data : 'Count', detailData.secondary_value2 && detailData.secondary_value2.show_value ? detailData.secondary_value2.show_value : '');
    const sv1 = getTypeOfDataValue(detailData.secondary_value1 && detailData.secondary_value1.source_data ? detailData.secondary_value1.source_data : 'Count', detailData.secondary_value1 && detailData.secondary_value1.show_value ? detailData.secondary_value1.show_value : '');
    const pve = getTypeOfDataValue(detailData.primary_value && detailData.primary_value.source_data ? detailData.primary_value.source_data : 'Count', detailData.primary_value && detailData.primary_value.show_value ? detailData.primary_value.show_value : '');
    if (detailData && detailData.primary_value && detailData.primary_value.kpi_field2 && detailData.primary_value.kpi_field1) {
      let cv = 0;
      let pv = 0;
      if (detailData.primary_value.kpi_field1 === 'pv') {
        cv = pve;
      } else if (detailData.primary_value.kpi_field1 === 'sv1') {
        cv = sv1;
      } else if (detailData.primary_value.kpi_field1 === 'sv2') {
        cv = sv2;
      }

      if (detailData.primary_value.kpi_field2 === 'pv') {
        pv = pve;
      } else if (detailData.primary_value.kpi_field2 === 'sv1') {
        pv = sv1;
      } else if (detailData.primary_value.kpi_field2 === 'sv2') {
        pv = sv2;
      }

      if (direction && direction === 'high_is_good') {
        if (cv > pv) {
          res = 'text-success';
        } else {
          res = 'text-danger';
        }
      } else if (direction && direction === 'low_is_good') {
        if (cv > pv) {
          res = 'text-danger';
        } else {
          res = 'text-success';
        }
      } else if (cv > pv) {
        res = 'text-success';
      } else {
        res = 'text-danger';
      }
    } else if (!(detailData && detailData.primary_value && detailData.primary_value.kpi_field2 && detailData.primary_value.kpi_field1)) {
      if (direction && direction === 'high_is_good') {
        if (currentValue > prevValue) {
          res = 'text-success';
        } else {
          res = 'text-danger';
        }
      } else if (direction && direction === 'low_is_good') {
        if (currentValue > prevValue) {
          res = 'text-danger';
        } else {
          res = 'text-success';
        }
      } else if (currentValue > prevValue) {
        res = 'text-success';
      } else {
        res = 'text-danger';
      }
    }
    return res;
  }

  function getStatusKpi(currentValue, prevValue) {
    let res = 'up';
    const sv2 = getTypeOfDataValue(detailData.secondary_value2 && detailData.secondary_value2.source_data ? detailData.secondary_value2.source_data : 'Count', detailData.secondary_value2 && detailData.secondary_value2.show_value ? detailData.secondary_value2.show_value : '');
    const sv1 = getTypeOfDataValue(detailData.secondary_value1 && detailData.secondary_value1.source_data ? detailData.secondary_value1.source_data : 'Count', detailData.secondary_value1 && detailData.secondary_value1.show_value ? detailData.secondary_value1.show_value : '');
    const pve = getTypeOfDataValue(detailData.primary_value && detailData.primary_value.source_data ? detailData.primary_value.source_data : 'Count', detailData.primary_value && detailData.primary_value.show_value ? detailData.primary_value.show_value : '');
    if (detailData && detailData.primary_value && detailData.primary_value.kpi_field2 && detailData.primary_value.kpi_field1) {
      let cv = 0;
      let pv = 0;
      if (detailData.primary_value.kpi_field1 === 'pv') {
        cv = pve;
      } else if (detailData.primary_value.kpi_field1 === 'sv1') {
        cv = sv1;
      } else if (detailData.primary_value.kpi_field1 === 'sv2') {
        cv = sv2;
      }

      if (detailData.primary_value.kpi_field2 === 'pv') {
        pv = pve;
      } else if (detailData.primary_value.kpi_field2 === 'sv1') {
        pv = sv1;
      } else if (detailData.primary_value.kpi_field2 === 'sv2') {
        pv = sv2;
      }

      if (cv > pv) {
        res = 'up';
      } else {
        res = 'down';
      }
    } else if (!(detailData && detailData.primary_value && detailData.primary_value.kpi_field2 && detailData.primary_value.kpi_field1)) {
      if (currentValue > prevValue) {
        res = 'up';
      } else {
        res = 'down';
      }
    }
    return res;
  }

  const annotationsArr = [];

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

  if (isGoalEnable) {
    annotationsArr.push({
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

  const options = {
    chart: {
      sparkline: {
        enabled: true,
      },
    },
    theme: {
      palette: detailData && detailData.sparkline && detailData.sparkline.palette ? detailData.sparkline.palette : 'palette1',
    },
    annotations: {
      yaxis: annotationsArr,
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
    xaxis: {
      categories: chartValues && chartValues.labels ? chartValues.labels : [],
      datetimeUTC: false,
    },
  };

  function getChartTooltip() {
    let label = 'Count';
    if (detailData && detailData.sparkline && detailData.sparkline.type) {
      label = getDatasetLabel();
    }
    return label;
  }

  const sparkHeight = (divHeight * 50) / 100;// divHeight > 250 && Math.abs(divHeight - 250) > 35 ? Math.abs(divHeight - 250) : Math.abs(divHeight - 130);

  return (
    <>
      {detailData && detailData.widget && detailData.widget === 'single_card_numeric' && (
        <div
          className="vertical-center text-center cursor-pointer"
        >
          <h3
            style={{ fontSize: convertPXToVW(width, height), color: detailData.primary_value && detailData.primary_value.value_color ? detailData.primary_value.value_color : 'black', textAlign: detailData.primary_value && detailData.primary_value.value_position ? detailData.primary_value.value_position : 'center' }}
            className=""
          >
            {detailData.primary_value && detailData.primary_value.show_value && detailData.primary_value.value_format ? getDataValue(detailData.primary_value.source_data ? detailData.primary_value.source_data : 'Count', detailData.primary_value.show_value, detailData.primary_value.value_format, detailData.primary_value.prefix ? detailData.primary_value.prefix : '', detailData.primary_value.suffix ? detailData.primary_value.suffix : '') : 0}
          </h3>
          <h5
            style={{ fontSize: convertPXToVW(width, height, 0.3), color: detailData.primary_value && detailData.primary_value.text_color ? detailData.primary_value.text_color : 'black', textAlign: detailData.primary_value && detailData.primary_value.text_position ? detailData.primary_value.text_position : 'center' }}
            className=""
          >
            {detailData.primary_value && detailData.primary_value.pv_text ? detailData.primary_value.pv_text : ''}
          </h5>
        </div>
      )}
      {detailData && detailData.widget && detailData.widget === 'single_card_numeric_with_one_secondary' && (
      <div style={{ display: 'flex' }}>
        <div
          className="text-center vertical-left-center cursor-pointer"
        >
          <h3
            style={{ fontSize: convertPXToVW(width, height), color: detailData.primary_value && detailData.primary_value.value_color ? detailData.primary_value.value_color : 'black', textAlign: detailData.primary_value && detailData.primary_value.value_position ? detailData.primary_value.value_position : 'center' }}
            className=""
          >
            {detailData.primary_value && detailData.primary_value.show_value && detailData.primary_value.value_format ? getDataValue(detailData.primary_value.source_data ? detailData.primary_value.source_data : 'Count', detailData.primary_value.show_value, detailData.primary_value.value_format, detailData.primary_value.prefix ? detailData.primary_value.prefix : '', detailData.primary_value.suffix ? detailData.primary_value.suffix : '') : 0}
          </h3>
          <h5
            style={{ fontSize: convertPXToVW(width, height, 0.3), color: detailData.primary_value && detailData.primary_value.text_color ? detailData.primary_value.text_color : 'black', textAlign: detailData.primary_value && detailData.primary_value.text_position ? detailData.primary_value.text_position : 'center' }}
            className=""
          >
            {detailData.primary_value && detailData.primary_value.pv_text ? detailData.primary_value.pv_text : ''}
          </h5>
        </div>
        <div
          className="text-center vertical-right-center cursor-pointer"
        >
          <h6
            style={{ fontSize: convertPXToVW(width, height, 0.5), color: detailData.secondary_value1 && detailData.secondary_value1.value_color ? detailData.secondary_value1.value_color : 'black', textAlign: detailData.secondary_value1 && detailData.secondary_value1.value_position ? detailData.secondary_value1.value_position : 'center' }}
            className=""
          >
            {detailData.secondary_value1 && detailData.secondary_value1.show_value && detailData.secondary_value1.value_format ? getDataValue(detailData.secondary_value1 && detailData.secondary_value1.source_data ? detailData.secondary_value1.source_data : 'Count', detailData.secondary_value1 && detailData.secondary_value1.show_value ? detailData.secondary_value1.show_value : '', detailData.secondary_value1.value_format, detailData.secondary_value1.prefix ? detailData.secondary_value1.prefix : '', detailData.secondary_value1.suffix ? detailData.secondary_value1.suffix : '') : 0}
          </h6>
          <p
            style={{
              fontSize: convertPXToVW(width, height, 0.8), opacity: 0.7, color: detailData.secondary_value1 && detailData.secondary_value1.text_color ? detailData.secondary_value1.text_color : 'black', textAlign: detailData.secondary_value1 && detailData.secondary_value1.text_position ? detailData.secondary_value1.text_position : 'center',
            }}
            className="mb-3"
          >
            {detailData.secondary_value1 && detailData.secondary_value1.sv1_text ? detailData.secondary_value1.sv1_text : ''}
          </p>
        </div>
      </div>
      )}
      {detailData && detailData.widget && detailData.widget === 'single_card_numeric_with_two_secondary' && (
      <div style={{ display: 'flex' }}>
        <div
          className="text-center vertical-left-center cursor-pointer"
        >
          <h3
            style={{ fontSize: convertPXToVW(width, height), color: detailData.primary_value && detailData.primary_value.value_color ? detailData.primary_value.value_color : 'black', textAlign: detailData.primary_value && detailData.primary_value.value_position ? detailData.primary_value.value_position : 'center' }}
            className=""
          >
            {detailData.primary_value && detailData.primary_value.show_value && detailData.primary_value.value_format ? getDataValue(detailData.primary_value.source_data ? detailData.primary_value.source_data : 'Count', detailData.primary_value.show_value, detailData.primary_value.value_format, detailData.primary_value.prefix ? detailData.primary_value.prefix : '', detailData.primary_value.suffix ? detailData.primary_value.suffix : '') : 0}
          </h3>
          <h5
            style={{ fontSize: convertPXToVW(width, height, 0.3), color: detailData.primary_value && detailData.primary_value.text_color ? detailData.primary_value.text_color : 'black', textAlign: detailData.primary_value && detailData.primary_value.text_position ? detailData.primary_value.text_position : 'center' }}
            className=""
          >
            {detailData.primary_value && detailData.primary_value.pv_text ? detailData.primary_value.pv_text : ''}
          </h5>
        </div>
        <div
          className="text-center vertical-right-center cursor-pointer"
        >
          <h6
            style={{ fontSize: convertPXToVW(width, height, 0.5), color: detailData.secondary_value1 && detailData.secondary_value1.value_color ? detailData.secondary_value1.value_color : 'black', textAlign: detailData.secondary_value1 && detailData.secondary_value1.value_position ? detailData.secondary_value1.value_position : 'center' }}
            className=""
          >
            {detailData.secondary_value1 && detailData.secondary_value1.show_value && detailData.secondary_value1.value_format ? getDataValue(detailData.secondary_value1 && detailData.secondary_value1.source_data ? detailData.secondary_value1.source_data : 'Count', detailData.secondary_value1 && detailData.secondary_value1.show_value ? detailData.secondary_value1.show_value : '', detailData.secondary_value1.value_format, detailData.secondary_value1.prefix ? detailData.secondary_value1.prefix : '', detailData.secondary_value1.suffix ? detailData.secondary_value1.suffix : '') : 0}
          </h6>
          <p
            style={{
              fontSize: convertPXToVW(width, height, 0.8), opacity: 0.7, color: detailData.secondary_value1 && detailData.secondary_value1.text_color ? detailData.secondary_value1.text_color : 'black', textAlign: detailData.secondary_value1 && detailData.secondary_value1.text_position ? detailData.secondary_value1.text_position : 'center',
            }}
            className="mb-3"
          >
            {detailData.secondary_value1 && detailData.secondary_value1.sv1_text ? detailData.secondary_value1.sv1_text : ''}
          </p>

          <h6
            style={{ fontSize: convertPXToVW(width, height, 0.5), color: detailData.secondary_value2 && detailData.secondary_value2.value_color ? detailData.secondary_value2.value_color : 'black', textAlign: detailData.secondary_value2 && detailData.secondary_value2.value_position ? detailData.secondary_value2.value_position : 'center' }}
            className=""
          >
            {detailData.secondary_value2 && detailData.secondary_value2.show_value && detailData.secondary_value2.value_format ? getDataValue(detailData.secondary_value2 && detailData.secondary_value2.source_data ? detailData.secondary_value2.source_data : 'Count', detailData.secondary_value2 && detailData.secondary_value2.show_value ? detailData.secondary_value2.show_value : '', detailData.secondary_value2.value_format, detailData.secondary_value2.prefix ? detailData.secondary_value2.prefix : '', detailData.secondary_value2.suffix ? detailData.secondary_value2.suffix : '') : 0}
          </h6>
          <p
            style={{
              fontSize: convertPXToVW(width, height, 0.8), opacity: 0.7, color: detailData.secondary_value2 && detailData.secondary_value2.text_color ? detailData.secondary_value2.text_color : 'black', textAlign: detailData.secondary_value2 && detailData.secondary_value2.text_position ? detailData.secondary_value2.text_position : 'center',
            }}
            className=""
          >
            {detailData.secondary_value2 && detailData.secondary_value2.sv2_text ? detailData.secondary_value2.sv2_text : ''}
          </p>
        </div>
      </div>
      )}
      {detailData && detailData.widget && detailData.widget === 'single_card_numeric_indicator' && (
      <div
        className="vertical-center text-center cursor-pointer"
      >

        {detailData.primary_value && detailData.primary_value.kpi_show === 'true' && (
        <p
          style={{
            fontSize: convertPXToVW(width, height, 0.5), display: 'flex', justifyContent: 'center', alignItems: 'center',
          }}
          className={`mb-1 ${getStatusColor(getTypeOfDataValue(detailData.secondary_value2 && detailData.secondary_value2.source_data ? detailData.secondary_value2.source_data : 'Count', detailData.secondary_value2 && detailData.secondary_value2.show_value ? detailData.secondary_value2.show_value : ''), getTypeOfDataValue(detailData.secondary_value1 && detailData.secondary_value1.source_data ? detailData.secondary_value1.source_data : 'Count', detailData.secondary_value1 && detailData.secondary_value1.show_value ? detailData.secondary_value1.show_value : ''), detailData.primary_value.kpi_direction)}`}
        >
          {getStatusKpi(getTypeOfDataValue(detailData.secondary_value2 && detailData.secondary_value2.source_data ? detailData.secondary_value2.source_data : 'Count', detailData.secondary_value2 && detailData.secondary_value2.show_value ? detailData.secondary_value2.show_value : ''), getTypeOfDataValue(detailData.secondary_value1 && detailData.secondary_value1.source_data ? detailData.secondary_value1.source_data : 'Count', detailData.secondary_value1 && detailData.secondary_value1.show_value ? detailData.secondary_value1.show_value : '')) === 'down' && (
          <IoArrowDownSharp />
          )}
          {getStatusKpi(getTypeOfDataValue(detailData.secondary_value2 && detailData.secondary_value2.source_data ? detailData.secondary_value2.source_data : 'Count', detailData.secondary_value2 && detailData.secondary_value2.show_value ? detailData.secondary_value2.show_value : ''), getTypeOfDataValue(detailData.secondary_value1 && detailData.secondary_value1.source_data ? detailData.secondary_value1.source_data : 'Count', detailData.secondary_value1 && detailData.secondary_value1.show_value ? detailData.secondary_value1.show_value : '')) === 'up' && (
          <IoArrowUpSharp />
          )}
          <span className="ml-2">{getPercentageKpi()}</span>
        </p>
        )}
        <h3
          style={{ fontSize: convertPXToVW(width, height), color: detailData.primary_value && detailData.primary_value.value_color ? detailData.primary_value.value_color : 'black', textAlign: detailData.primary_value && detailData.primary_value.value_position ? detailData.primary_value.value_position : 'center' }}
          className=""
        >
          {detailData.primary_value && detailData.primary_value.show_value && detailData.primary_value.value_format ? getDataValue(detailData.primary_value.source_data ? detailData.primary_value.source_data : 'Count', detailData.primary_value.show_value, detailData.primary_value.value_format, detailData.primary_value.prefix ? detailData.primary_value.prefix : '', detailData.primary_value.suffix ? detailData.primary_value.suffix : '') : 0}
        </h3>
        <h5
          style={{ fontSize: convertPXToVW(width, height, 0.3), color: detailData.primary_value && detailData.primary_value.text_color ? detailData.primary_value.text_color : 'black', textAlign: detailData.primary_value && detailData.primary_value.text_position ? detailData.primary_value.text_position : 'center' }}
          className=""
        >
          {detailData.primary_value && detailData.primary_value.pv_text ? detailData.primary_value.pv_text : ''}
        </h5>
      </div>
      )}
      {detailData && detailData.widget && detailData.widget === 'single_card_numeric_indicator_with_one_secondary' && (
      <div style={{ display: 'flex' }}>
        <div
          className="text-center vertical-left-center cursor-pointer"
        >
          {detailData.primary_value && detailData.primary_value.kpi_show === 'true' && (
          <p
            style={{
              fontSize: convertPXToVW(width, height, 0.5), display: 'flex', justifyContent: 'center', alignItems: 'center',
            }}
            className={`mb-1 ${getStatusColor(getTypeOfDataValue(detailData.secondary_value2 && detailData.secondary_value2.source_data ? detailData.secondary_value2.source_data : 'Count', detailData.secondary_value2 && detailData.secondary_value2.show_value ? detailData.secondary_value2.show_value : ''), getTypeOfDataValue(detailData.secondary_value1 && detailData.secondary_value1.source_data ? detailData.secondary_value1.source_data : 'Count', detailData.secondary_value1 && detailData.secondary_value1.show_value ? detailData.secondary_value1.show_value : ''), detailData.primary_value.kpi_direction)}`}
          >
            {getStatusKpi(getTypeOfDataValue(detailData.secondary_value2 && detailData.secondary_value2.source_data ? detailData.secondary_value2.source_data : 'Count', detailData.secondary_value2 && detailData.secondary_value2.show_value ? detailData.secondary_value2.show_value : ''), getTypeOfDataValue(detailData.secondary_value1 && detailData.secondary_value1.source_data ? detailData.secondary_value1.source_data : 'Count', detailData.secondary_value1 && detailData.secondary_value1.show_value ? detailData.secondary_value1.show_value : '')) === 'down' && (
            <IoArrowDownSharp />
            )}
            {getStatusKpi(getTypeOfDataValue(detailData.secondary_value2 && detailData.secondary_value2.source_data ? detailData.secondary_value2.source_data : 'Count', detailData.secondary_value2 && detailData.secondary_value2.show_value ? detailData.secondary_value2.show_value : ''), getTypeOfDataValue(detailData.secondary_value1 && detailData.secondary_value1.source_data ? detailData.secondary_value1.source_data : 'Count', detailData.secondary_value1 && detailData.secondary_value1.show_value ? detailData.secondary_value1.show_value : '')) === 'up' && (
            <IoArrowUpSharp />
            )}
            <span className="ml-2">{getPercentageKpi()}</span>
          </p>
          )}
          <h3
            style={{ fontSize: convertPXToVW(width, height), color: detailData.primary_value && detailData.primary_value.value_color ? detailData.primary_value.value_color : 'black', textAlign: detailData.primary_value && detailData.primary_value.value_position ? detailData.primary_value.value_position : 'center' }}
            className=""
          >
            {detailData.primary_value && detailData.primary_value.show_value && detailData.primary_value.value_format ? getDataValue(detailData.primary_value.source_data ? detailData.primary_value.source_data : 'Count', detailData.primary_value.show_value, detailData.primary_value.value_format, detailData.primary_value.prefix ? detailData.primary_value.prefix : '', detailData.primary_value.suffix ? detailData.primary_value.suffix : '') : 0}
          </h3>
          <h5
            style={{ fontSize: convertPXToVW(width, height, 0.3), color: detailData.primary_value && detailData.primary_value.text_color ? detailData.primary_value.text_color : 'black', textAlign: detailData.primary_value && detailData.primary_value.text_position ? detailData.primary_value.text_position : 'center' }}
            className=""
          >
            {detailData.primary_value && detailData.primary_value.pv_text ? detailData.primary_value.pv_text : ''}
          </h5>
        </div>
        <div
          className="text-center vertical-right-center cursor-pointer"
        >
          <h6
            style={{ fontSize: convertPXToVW(width, height, 0.5), color: detailData.secondary_value1 && detailData.secondary_value1.value_color ? detailData.secondary_value1.value_color : 'black', textAlign: detailData.secondary_value1 && detailData.secondary_value1.value_position ? detailData.secondary_value1.value_position : 'center' }}
            className=""
          >
            {detailData.secondary_value1 && detailData.secondary_value1.show_value && detailData.secondary_value1.value_format ? getDataValue(detailData.secondary_value1 && detailData.secondary_value1.source_data ? detailData.secondary_value1.source_data : 'Count', detailData.secondary_value1 && detailData.secondary_value1.show_value ? detailData.secondary_value1.show_value : '', detailData.secondary_value1.value_format, detailData.secondary_value1.prefix ? detailData.secondary_value1.prefix : '', detailData.secondary_value1.suffix ? detailData.secondary_value1.suffix : '') : 0}
          </h6>
          <p
            style={{
              fontSize: convertPXToVW(width, height, 0.8), opacity: 0.7, color: detailData.secondary_value1 && detailData.secondary_value1.text_color ? detailData.secondary_value1.text_color : 'black', textAlign: detailData.secondary_value1 && detailData.secondary_value1.text_position ? detailData.secondary_value1.text_position : 'center',
            }}
            className="mb-3"
          >
            {detailData.secondary_value1 && detailData.secondary_value1.sv1_text ? detailData.secondary_value1.sv1_text : ''}
          </p>
        </div>
      </div>
      )}
      {detailData && detailData.widget && detailData.widget === 'single_card_numeric_indicator_with_two_secondary' && (
      <div style={{ display: 'flex' }}>
        <div
          className="text-center vertical-left-center cursor-pointer"
        >
          {detailData.primary_value && detailData.primary_value.kpi_show === 'true' && (
          <p
            style={{
              fontSize: convertPXToVW(width, height, 0.5), display: 'flex', justifyContent: 'center', alignItems: 'center',
            }}
            className={`mb-1 ${getStatusColor(getTypeOfDataValue(detailData.secondary_value2 && detailData.secondary_value2.source_data ? detailData.secondary_value2.source_data : 'Count', detailData.secondary_value2 && detailData.secondary_value2.show_value ? detailData.secondary_value2.show_value : ''), getTypeOfDataValue(detailData.secondary_value1 && detailData.secondary_value1.source_data ? detailData.secondary_value1.source_data : 'Count', detailData.secondary_value1 && detailData.secondary_value1.show_value ? detailData.secondary_value1.show_value : ''), detailData.primary_value.kpi_direction)}`}
          >
            {getStatusKpi(getTypeOfDataValue(detailData.secondary_value2 && detailData.secondary_value2.source_data ? detailData.secondary_value2.source_data : 'Count', detailData.secondary_value2 && detailData.secondary_value2.show_value ? detailData.secondary_value2.show_value : ''), getTypeOfDataValue(detailData.secondary_value1 && detailData.secondary_value1.source_data ? detailData.secondary_value1.source_data : 'Count', detailData.secondary_value1 && detailData.secondary_value1.show_value ? detailData.secondary_value1.show_value : '')) === 'down' && (
            <IoArrowDownSharp />
            )}
            {getStatusKpi(getTypeOfDataValue(detailData.secondary_value2 && detailData.secondary_value2.source_data ? detailData.secondary_value2.source_data : 'Count', detailData.secondary_value2 && detailData.secondary_value2.show_value ? detailData.secondary_value2.show_value : ''), getTypeOfDataValue(detailData.secondary_value1 && detailData.secondary_value1.source_data ? detailData.secondary_value1.source_data : 'Count', detailData.secondary_value1 && detailData.secondary_value1.show_value ? detailData.secondary_value1.show_value : '')) === 'up' && (
            <IoArrowUpSharp />
            )}
            <span className="ml-2">{getPercentageKpi()}</span>
          </p>
          )}
          <h3
            style={{ fontSize: convertPXToVW(width, height), color: detailData.primary_value && detailData.primary_value.value_color ? detailData.primary_value.value_color : 'black', textAlign: detailData.primary_value && detailData.primary_value.value_position ? detailData.primary_value.value_position : 'center' }}
            className=""
          >
            {detailData.primary_value && detailData.primary_value.show_value && detailData.primary_value.value_format ? getDataValue(detailData.primary_value.source_data ? detailData.primary_value.source_data : 'Count', detailData.primary_value.show_value, detailData.primary_value.value_format, detailData.primary_value.prefix ? detailData.primary_value.prefix : '', detailData.primary_value.suffix ? detailData.primary_value.suffix : '') : 0}
          </h3>
          <h5
            style={{ fontSize: convertPXToVW(width, height, 0.3), color: detailData.primary_value && detailData.primary_value.text_color ? detailData.primary_value.text_color : 'black', textAlign: detailData.primary_value && detailData.primary_value.text_position ? detailData.primary_value.text_position : 'center' }}
            className=""
          >
            {detailData.primary_value && detailData.primary_value.pv_text ? detailData.primary_value.pv_text : ''}
          </h5>
        </div>
        <div
          className="text-center vertical-right-center cursor-pointer"
        >
          <h6
            style={{ fontSize: convertPXToVW(width, height, 0.5), color: detailData.secondary_value1 && detailData.secondary_value1.value_color ? detailData.secondary_value1.value_color : 'black', textAlign: detailData.secondary_value1 && detailData.secondary_value1.value_position ? detailData.secondary_value1.value_position : 'center' }}
            className=""
          >
            {detailData.secondary_value1 && detailData.secondary_value1.show_value && detailData.secondary_value1.value_format ? getDataValue(detailData.secondary_value1 && detailData.secondary_value1.source_data ? detailData.secondary_value1.source_data : 'Count', detailData.secondary_value1 && detailData.secondary_value1.show_value ? detailData.secondary_value1.show_value : '', detailData.secondary_value1.value_format, detailData.secondary_value1.prefix ? detailData.secondary_value1.prefix : '', detailData.secondary_value1.suffix ? detailData.secondary_value1.suffix : '') : 0}
          </h6>
          <p
            style={{
              fontSize: convertPXToVW(width, height, 0.8), opacity: 0.7, color: detailData.secondary_value1 && detailData.secondary_value1.text_color ? detailData.secondary_value1.text_color : 'black', textAlign: detailData.secondary_value1 && detailData.secondary_value1.text_position ? detailData.secondary_value1.text_position : 'center',
            }}
            className="mb-3"
          >
            {detailData.secondary_value1 && detailData.secondary_value1.sv1_text ? detailData.secondary_value1.sv1_text : ''}
          </p>

          <h6
            style={{ fontSize: convertPXToVW(width, height, 0.5), color: detailData.secondary_value2 && detailData.secondary_value2.value_color ? detailData.secondary_value2.value_color : 'black', textAlign: detailData.secondary_value2 && detailData.secondary_value2.value_position ? detailData.secondary_value2.value_position : 'center' }}
            className=""
          >
            {detailData.secondary_value2 && detailData.secondary_value2.show_value && detailData.secondary_value2.value_format ? getDataValue(detailData.secondary_value2 && detailData.secondary_value2.source_data ? detailData.secondary_value2.source_data : 'Count', detailData.secondary_value2 && detailData.secondary_value2.show_value ? detailData.secondary_value2.show_value : '', detailData.secondary_value2.value_format, detailData.secondary_value2.prefix ? detailData.secondary_value2.prefix : '', detailData.secondary_value2.suffix ? detailData.secondary_value2.suffix : '') : 0}
          </h6>
          <p
            style={{
              fontSize: convertPXToVW(width, height, 0.8), opacity: 0.7, color: detailData.secondary_value2 && detailData.secondary_value2.text_color ? detailData.secondary_value2.text_color : 'black', textAlign: detailData.secondary_value2 && detailData.secondary_value2.text_position ? detailData.secondary_value2.text_position : 'center',
            }}
            className=""
          >
            {detailData.secondary_value2 && detailData.secondary_value2.sv2_text ? detailData.secondary_value2.sv2_text : ''}
          </p>
        </div>
      </div>
      )}
      {detailData && detailData.widget && detailData.widget === 'single_card_numeric_indicator_with_sparkline' && (
      <>
        <div style={{ display: 'flex', height: '45%' }}>
          <div
            className="vertical-center-top text-center cursor-pointer"
          >

            {detailData.primary_value && detailData.primary_value.kpi_show === 'true' && (
            <p
              style={{
                fontSize: convertPXToVW(width, height, 0.5), display: 'flex', justifyContent: 'center', alignItems: 'center',
              }}
              className={`mb-1 ${getStatusColor(getTypeOfDataValue(detailData.secondary_value2 && detailData.secondary_value2.source_data ? detailData.secondary_value2.source_data : 'Count', detailData.secondary_value2 && detailData.secondary_value2.show_value ? detailData.secondary_value2.show_value : ''), getTypeOfDataValue(detailData.secondary_value1 && detailData.secondary_value1.source_data ? detailData.secondary_value1.source_data : 'Count', detailData.secondary_value1 && detailData.secondary_value1.show_value ? detailData.secondary_value1.show_value : ''), detailData.primary_value.kpi_direction)}`}
            >
              {getStatusKpi(getTypeOfDataValue(detailData.secondary_value2 && detailData.secondary_value2.source_data ? detailData.secondary_value2.source_data : 'Count', detailData.secondary_value2 && detailData.secondary_value2.show_value ? detailData.secondary_value2.show_value : ''), getTypeOfDataValue(detailData.secondary_value1 && detailData.secondary_value1.source_data ? detailData.secondary_value1.source_data : 'Count', detailData.secondary_value1 && detailData.secondary_value1.show_value ? detailData.secondary_value1.show_value : '')) === 'down' && (
              <IoArrowDownSharp />
              )}
              {getStatusKpi(getTypeOfDataValue(detailData.secondary_value2 && detailData.secondary_value2.source_data ? detailData.secondary_value2.source_data : 'Count', detailData.secondary_value2 && detailData.secondary_value2.show_value ? detailData.secondary_value2.show_value : ''), getTypeOfDataValue(detailData.secondary_value1 && detailData.secondary_value1.source_data ? detailData.secondary_value1.source_data : 'Count', detailData.secondary_value1 && detailData.secondary_value1.show_value ? detailData.secondary_value1.show_value : '')) === 'up' && (
              <IoArrowUpSharp />
              )}
              <span className="ml-2">{getPercentageKpi()}</span>
            </p>
            )}
            <h3
              style={{ fontSize: convertPXToVW(width, height), color: detailData.primary_value && detailData.primary_value.value_color ? detailData.primary_value.value_color : 'black', textAlign: detailData.primary_value && detailData.primary_value.value_position ? detailData.primary_value.value_position : 'center' }}
              className=""
            >
              {detailData.primary_value && detailData.primary_value.show_value && detailData.primary_value.value_format ? getDataValue(detailData.primary_value.source_data ? detailData.primary_value.source_data : 'Count', detailData.primary_value.show_value, detailData.primary_value.value_format, detailData.primary_value.prefix ? detailData.primary_value.prefix : '', detailData.primary_value.suffix ? detailData.primary_value.suffix : '') : 0}
            </h3>
            <h5
              style={{ fontSize: convertPXToVW(width, height, 0.3), color: detailData.primary_value && detailData.primary_value.text_color ? detailData.primary_value.text_color : 'black', textAlign: detailData.primary_value && detailData.primary_value.text_position ? detailData.primary_value.text_position : 'center' }}
              className=""
            >
              {detailData.primary_value && detailData.primary_value.pv_text ? detailData.primary_value.pv_text : ''}
            </h5>
          </div>
        </div>
        {detailData.sparkline && detailData.sparkline.type && (
        <div className="pl-2 pr-2" style={{ display: 'flex', height: '45%' }}>
          <Chart
            type={detailData.sparkline.type}
            series={[{
              name: detailData.sparkline.source_data ? detailData.sparkline.source_data : getChartTooltip(),
              data: getDatasetData(detailData.sparkline.source_data ? detailData.sparkline.source_data : 'Count'),
            }]}
            height={sparkHeight > 20 ? sparkHeight - 20 : sparkHeight - 5}
            width={divWidth - 40}
            options={options}
          />
        </div>
        )}
      </>
      )}
      {detailData && detailData.widget && detailData.widget === 'single_card_numeric_with_one_secondary_indicator_with_sparkline' && (
      <>
        <div style={{ display: 'flex', height: '45%' }}>
          <div
            className="text-center vertical-left-center-top-chart cursor-pointer"
          >
            {detailData.primary_value && detailData.primary_value.kpi_show === 'true' && (
            <p
              style={{
                fontSize: convertPXToVW(width, height, 0.5), display: 'flex', justifyContent: 'center', alignItems: 'center',
              }}
              className={`mb-1 ${getStatusColor(getTypeOfDataValue(detailData.secondary_value2 && detailData.secondary_value2.source_data ? detailData.secondary_value2.source_data : 'Count', detailData.secondary_value2 && detailData.secondary_value2.show_value ? detailData.secondary_value2.show_value : ''), getTypeOfDataValue(detailData.secondary_value1 && detailData.secondary_value1.source_data ? detailData.secondary_value1.source_data : 'Count', detailData.secondary_value1 && detailData.secondary_value1.show_value ? detailData.secondary_value1.show_value : ''), detailData.primary_value.kpi_direction)}`}
            >
              {getStatusKpi(getTypeOfDataValue(detailData.secondary_value2 && detailData.secondary_value2.source_data ? detailData.secondary_value2.source_data : 'Count', detailData.secondary_value2 && detailData.secondary_value2.show_value ? detailData.secondary_value2.show_value : ''), getTypeOfDataValue(detailData.secondary_value1 && detailData.secondary_value1.source_data ? detailData.secondary_value1.source_data : 'Count', detailData.secondary_value1 && detailData.secondary_value1.show_value ? detailData.secondary_value1.show_value : '')) === 'down' && (
              <IoArrowDownSharp />
              )}
              {getStatusKpi(getTypeOfDataValue(detailData.secondary_value2 && detailData.secondary_value2.source_data ? detailData.secondary_value2.source_data : 'Count', detailData.secondary_value2 && detailData.secondary_value2.show_value ? detailData.secondary_value2.show_value : ''), getTypeOfDataValue(detailData.secondary_value1 && detailData.secondary_value1.source_data ? detailData.secondary_value1.source_data : 'Count', detailData.secondary_value1 && detailData.secondary_value1.show_value ? detailData.secondary_value1.show_value : '')) === 'up' && (
              <IoArrowUpSharp />
              )}
              <span className="ml-2">{getPercentageKpi()}</span>
            </p>
            )}
            <h3
              style={{ fontSize: convertPXToVW(width, height), color: detailData.primary_value && detailData.primary_value.value_color ? detailData.primary_value.value_color : 'black', textAlign: detailData.primary_value && detailData.primary_value.value_position ? detailData.primary_value.value_position : 'center' }}
              className=""
            >
              {detailData.primary_value && detailData.primary_value.show_value && detailData.primary_value.value_format ? getDataValue(detailData.primary_value.source_data ? detailData.primary_value.source_data : 'Count', detailData.primary_value.show_value, detailData.primary_value.value_format, detailData.primary_value.prefix ? detailData.primary_value.prefix : '', detailData.primary_value.suffix ? detailData.primary_value.suffix : '') : 0}
            </h3>
            <h5
              style={{ fontSize: convertPXToVW(width, height, 0.3), color: detailData.primary_value && detailData.primary_value.text_color ? detailData.primary_value.text_color : 'black', textAlign: detailData.primary_value && detailData.primary_value.text_position ? detailData.primary_value.text_position : 'center' }}
              className=""
            >
              {detailData.primary_value && detailData.primary_value.pv_text ? detailData.primary_value.pv_text : ''}
            </h5>
          </div>
          <div
            className="text-center vertical-right-center-top-chart cursor-pointer"
          >
            <h6
              style={{ fontSize: convertPXToVW(width, height, 0.5), color: detailData.secondary_value1 && detailData.secondary_value1.value_color ? detailData.secondary_value1.value_color : 'black', textAlign: detailData.secondary_value1 && detailData.secondary_value1.value_position ? detailData.secondary_value1.value_position : 'center' }}
              className=""
            >
              {detailData.secondary_value1 && detailData.secondary_value1.show_value && detailData.secondary_value1.value_format ? getDataValue(detailData.secondary_value1 && detailData.secondary_value1.source_data ? detailData.secondary_value1.source_data : 'Count', detailData.secondary_value1 && detailData.secondary_value1.show_value ? detailData.secondary_value1.show_value : '', detailData.secondary_value1.value_format, detailData.secondary_value1.prefix ? detailData.secondary_value1.prefix : '', detailData.secondary_value1.suffix ? detailData.secondary_value1.suffix : '') : 0}
            </h6>
            <p
              style={{
                fontSize: convertPXToVW(width, height, 0.8), opacity: 0.7, color: detailData.secondary_value1 && detailData.secondary_value1.text_color ? detailData.secondary_value1.text_color : 'black', textAlign: detailData.secondary_value1 && detailData.secondary_value1.text_position ? detailData.secondary_value1.text_position : 'center',
              }}
              className="mb-3"
            >
              {detailData.secondary_value1 && detailData.secondary_value1.sv1_text ? detailData.secondary_value1.sv1_text : ''}
            </p>
          </div>
        </div>
        {detailData.sparkline && detailData.sparkline.type && (
        <div className="pl-2 pr-2" style={{ display: 'flex', height: '45%' }}>
          <Chart
            type={detailData.sparkline.type}
            series={[{
              name: detailData.sparkline.source_data ? detailData.sparkline.source_data : getChartTooltip(),
              data: getDatasetData(detailData.sparkline.source_data ? detailData.sparkline.source_data : 'Count'),
            }]}
            height={sparkHeight > 20 ? sparkHeight - 20 : sparkHeight - 5}
            width={divWidth - 40}
            options={options}
          />
        </div>
        )}
      </>
      )}
      {detailData && detailData.widget && detailData.widget === 'single_card_numeric_with_two_secondary_indicator_with_sparkline' && (
      <>
        <div style={{ display: 'flex', height: '45%' }}>
          <div
            className="text-center vertical-left-center-top-chart cursor-pointer"
          >
            {detailData.primary_value && detailData.primary_value.kpi_show === 'true' && (
            <p
              style={{
                fontSize: convertPXToVW(width, height, 0.5), display: 'flex', justifyContent: 'center', alignItems: 'center',
              }}
              className={`mb-1 ${getStatusColor(getTypeOfDataValue(detailData.secondary_value2 && detailData.secondary_value2.source_data ? detailData.secondary_value2.source_data : 'Count', detailData.secondary_value2 && detailData.secondary_value2.show_value ? detailData.secondary_value2.show_value : ''), getTypeOfDataValue(detailData.secondary_value1 && detailData.secondary_value1.source_data ? detailData.secondary_value1.source_data : 'Count', detailData.secondary_value1 && detailData.secondary_value1.show_value ? detailData.secondary_value1.show_value : ''), detailData.primary_value.kpi_direction)}`}
            >
              {getStatusKpi(getTypeOfDataValue(detailData.secondary_value2 && detailData.secondary_value2.source_data ? detailData.secondary_value2.source_data : 'Count', detailData.secondary_value2 && detailData.secondary_value2.show_value ? detailData.secondary_value2.show_value : ''), getTypeOfDataValue(detailData.secondary_value1 && detailData.secondary_value1.source_data ? detailData.secondary_value1.source_data : 'Count', detailData.secondary_value1 && detailData.secondary_value1.show_value ? detailData.secondary_value1.show_value : '')) === 'down' && (
              <IoArrowDownSharp />
              )}
              {getStatusKpi(getTypeOfDataValue(detailData.secondary_value2 && detailData.secondary_value2.source_data ? detailData.secondary_value2.source_data : 'Count', detailData.secondary_value2 && detailData.secondary_value2.show_value ? detailData.secondary_value2.show_value : ''), getTypeOfDataValue(detailData.secondary_value1 && detailData.secondary_value1.source_data ? detailData.secondary_value1.source_data : 'Count', detailData.secondary_value1 && detailData.secondary_value1.show_value ? detailData.secondary_value1.show_value : '')) === 'up' && (
              <IoArrowUpSharp />
              )}
              <span className="ml-2">{getPercentageKpi()}</span>
            </p>
            )}
            <h3
              style={{ fontSize: convertPXToVW(width, height), color: detailData.primary_value && detailData.primary_value.value_color ? detailData.primary_value.value_color : 'black', textAlign: detailData.primary_value && detailData.primary_value.value_position ? detailData.primary_value.value_position : 'center' }}
              className=""
            >
              {detailData.primary_value && detailData.primary_value.show_value && detailData.primary_value.value_format ? getDataValue(detailData.primary_value.source_data ? detailData.primary_value.source_data : 'Count', detailData.primary_value.show_value, detailData.primary_value.value_format, detailData.primary_value.prefix ? detailData.primary_value.prefix : '', detailData.primary_value.suffix ? detailData.primary_value.suffix : '') : 0}
            </h3>
            <h5
              style={{ fontSize: convertPXToVW(width, height, 0.3), color: detailData.primary_value && detailData.primary_value.text_color ? detailData.primary_value.text_color : 'black', textAlign: detailData.primary_value && detailData.primary_value.text_position ? detailData.primary_value.text_position : 'center' }}
              className=""
            >
              {detailData.primary_value && detailData.primary_value.pv_text ? detailData.primary_value.pv_text : ''}
            </h5>
          </div>
          <div
            className="text-center vertical-right-center-top-chart cursor-pointer"
          >
            <h6
              style={{ fontSize: convertPXToVW(width, height, 0.5), color: detailData.secondary_value1 && detailData.secondary_value1.value_color ? detailData.secondary_value1.value_color : 'black', textAlign: detailData.secondary_value1 && detailData.secondary_value1.value_position ? detailData.secondary_value1.value_position : 'center' }}
              className=""
            >
              {detailData.secondary_value1 && detailData.secondary_value1.show_value && detailData.secondary_value1.value_format ? getDataValue(detailData.secondary_value1 && detailData.secondary_value1.source_data ? detailData.secondary_value1.source_data : 'Count', detailData.secondary_value1 && detailData.secondary_value1.show_value ? detailData.secondary_value1.show_value : '', detailData.secondary_value1.value_format, detailData.secondary_value1.prefix ? detailData.secondary_value1.prefix : '', detailData.secondary_value1.suffix ? detailData.secondary_value1.suffix : '') : 0}
            </h6>
            <p
              style={{
                fontSize: convertPXToVW(width, height, 0.8), opacity: 0.7, color: detailData.secondary_value1 && detailData.secondary_value1.text_color ? detailData.secondary_value1.text_color : 'black', textAlign: detailData.secondary_value1 && detailData.secondary_value1.text_position ? detailData.secondary_value1.text_position : 'center',
              }}
              className="mb-3"
            >
              {detailData.secondary_value1 && detailData.secondary_value1.sv1_text ? detailData.secondary_value1.sv1_text : ''}
            </p>

            <h6
              style={{ fontSize: convertPXToVW(width, height, 0.5), color: detailData.secondary_value2 && detailData.secondary_value2.value_color ? detailData.secondary_value2.value_color : 'black', textAlign: detailData.secondary_value2 && detailData.secondary_value2.value_position ? detailData.secondary_value2.value_position : 'center' }}
              className=""
            >
              {detailData.secondary_value2 && detailData.secondary_value2.show_value && detailData.secondary_value2.value_format ? getDataValue(detailData.secondary_value2 && detailData.secondary_value2.source_data ? detailData.secondary_value2.source_data : 'Count', detailData.secondary_value2 && detailData.secondary_value2.show_value ? detailData.secondary_value2.show_value : '', detailData.secondary_value2.value_format, detailData.secondary_value2.prefix ? detailData.secondary_value2.prefix : '', detailData.secondary_value2.suffix ? detailData.secondary_value2.suffix : '') : 0}
            </h6>
            <p
              style={{
                fontSize: convertPXToVW(width, height, 0.8), opacity: 0.7, color: detailData.secondary_value2 && detailData.secondary_value2.text_color ? detailData.secondary_value2.text_color : 'black', textAlign: detailData.secondary_value2 && detailData.secondary_value2.text_position ? detailData.secondary_value2.text_position : 'center',
              }}
              className=""
            >
              {detailData.secondary_value2 && detailData.secondary_value2.sv2_text ? detailData.secondary_value2.sv2_text : ''}
            </p>
          </div>
        </div>
        {detailData.sparkline && detailData.sparkline.type && (
        <div className="pl-2 pr-2" style={{ display: 'flex', height: '45%' }}>
          <Chart
            type={detailData.sparkline.type}
            series={[{
              name: detailData.sparkline.source_data ? detailData.sparkline.source_data : getChartTooltip(),
              data: getDatasetData(detailData.sparkline.source_data ? detailData.sparkline.source_data : 'Count'),
            }]}
            height={sparkHeight > 20 ? sparkHeight - 20 : sparkHeight - 5}
            width={divWidth - 40}
            options={options}
          />
        </div>
        )}
      </>
      )}
    </>
  );
});

export default SingleCardNumeric;
