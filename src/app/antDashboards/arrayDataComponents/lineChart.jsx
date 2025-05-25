/* eslint-disable camelcase */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
import React from 'react';
import { Line } from '@ant-design/plots';
import * as PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';

import customData from '../data/customData.json';
import {
  setCurrentThreshold,
} from '../../assets/equipmentService';
import {
  detectMob,
  getColumnArrayById,
} from '../../util/appUtils';

const LineChart = (props) => {
  const {
    lineData,
    xField,
    yField,
    seriesField,
    isYaxis,
    ymin,
    ymax,
    regions,
    currentThresholds,
    onThresholdItemChange,
    yName,
  } = props;

  const isMob = detectMob();

  const { currentThreshold } = useSelector((state) => state.equipment);
  const dispatch = useDispatch();

  function getCurrentThresholdName(name) {
    let res = false;
    if (currentThreshold && currentThreshold.length) {
      const data = currentThreshold || [];
      const fdata = data.filter((li) => li.name === name);
      if (fdata && fdata.length) {
        res = true;
      }
    }
    return res;
  }

  const onThresholdChange = (name, min, max, threshold_line) => {
    if (getCurrentThresholdName(name)) {
      const tData = currentThreshold.filter((li) => li.name !== name);
      dispatch(setCurrentThreshold([]));
    } else {
      const data = currentThreshold || [];
      data.push({
        name, min, max, threshold_line,
      });
      // dispatch(setCurrentThreshold([...new Map(data.map((item) => [item.name, item])).values()]));
      dispatch(setCurrentThreshold([{
        name, min, max, threshold_line,
      }]));
    }
  };

  function getName(name) {
    let res = '';
    if (customData && customData.thresholdsNames && customData.thresholdsNames[name]) {
      res = customData.thresholdsNames[name].name;
    }
    return res;
  }

  function getShortCode(name) {
    let res = '';
    if (customData && customData.thresholdsNames && customData.thresholdsNames[name]) {
      res = customData.thresholdsNames[name].shortCode;
    }
    return res;
  }

  function getDataName(name) {
    let res = '';
    if (customData && customData.thresholdsNames && customData.thresholdsNames[name]) {
      res = customData.thresholdsNames[name].dataname;
    }
    return res;
  }

  function getThresholdData() {
    let cdata = [];
    if (currentThresholds && currentThresholds.length) {
      cdata = currentThresholds.map((cl) => ({
        name: cl.reading_id && cl.reading_id.name ? getName(cl.reading_id.name) : '',
        shortCode: cl.reading_id && cl.reading_id.name ? getShortCode(cl.reading_id.name) : '',
        dataname: cl.reading_id && cl.reading_id.name ? getDataName(cl.reading_id.name) : '',
        uom: cl.uom_id && cl.uom_id.name ? cl.uom_id.name : '',
        min: cl.value_min,
        max: cl.value_max,
        threshold_line: cl.threshold_line,
        scale: '',
        color: '',
        sequence: cl.sequence,
      }));
    }
    cdata = cdata.length ? cdata.sort((a, b) => a.sequence - b.sequence) : [];
    return cdata;
  }

  const onLegendChange = (evt) => {
    const { view } = evt;
    const { filteredData } = view;
    const sName = filteredData && filteredData.length ? filteredData[0].threshold : '';
    const sData = getThresholdData();
    const fData = sData && sName && sData.length ? sData.filter((li) => li.name === sName) : [];
    const fnData = filteredData && filteredData && filteredData.length ? filteredData.filter((li) => li.threshold === sName) : [];
    if ((fnData && filteredData && fnData.length === filteredData.length) && fData && fData.length) {
      if (onThresholdItemChange) onThresholdItemChange(fData[0].name, fData[0].min, fData[0].max, fData[0].threshold_line);
    } else {
      onThresholdItemChange(false, null, null, null);
    }
  };

  const config = {
    data: lineData,
    xField,
    yField,
    height: 350,
    width: 350,
    seriesField,
    yAxis: {
      label: isYaxis ? {
        formatter: (v) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
      } : null,
      min: isYaxis ? ymin : null,
      max: isYaxis ? ymax : null,
    },
    legend: {
      position: 'right',
      selected: isYaxis && yName ? {
        'Dew Point Temperature': !!(isYaxis && yName && yName === 'Dew Point Temperature'),
        'Carbon Monoxide (CO)': !!(isYaxis && yName && yName === 'Carbon Monoxide (CO)'),
        'NDIR (CO2)': !!(isYaxis && yName && yName === 'NDIR (CO2)'),
        'Ozone (O)': !!(isYaxis && yName && yName === 'Ozone (O)'),
        'Particulate Matter 1.0': !!(isYaxis && yName && yName === 'Particulate Matter 1.0'),
        'Particulate Matter 2.5': !!(isYaxis && yName && yName === 'Particulate Matter 2.5'),
        'Particulate Matter 10': !!(isYaxis && yName && yName === 'Particulate Matter 10'),
        Humidity: !!(isYaxis && yName && yName === 'Humidity'),
        IAQ: !!(isYaxis && yName && yName === 'IAQ'),
        'ATM Pressure': !!(isYaxis && yName && yName === 'ATM Pressure'),
        Temperature: !!(isYaxis && yName && yName === 'Temperature'),
        'Total Volatile Organic Compound (TVOC)': !!(isYaxis && yName && yName === 'Total Volatile Organic Compound (TVOC)'),
      } : null,
    },
    animation: {
      appear: {
        animation: 'path-in',
        duration: 5000,
      },
    },
    colorField: seriesField,
    color: getColumnArrayById(customData.thresholdsColors, 'color'),
    annotations: regions,
    slider: {
      start: 0,
      end: 1,
    },
    tooltip: {
      shared: false,
    },
    lineStyle: {
      fillOpacity: 10,
      opacity: 10,
      lineWidth: 3,
    },
    connectNulls: false,
    interactions: [
      { type: 'element-active' },
      { type: 'brush' },
      {
        type: 'axis-label-highlight',
        cfg: {
          start: [{ trigger: 'axis-label:mouseenter', action: ['list-highlight:highlight', 'element-highlight:highlight'] }],
          end: [{ trigger: 'axis-label:mouseleave', action: ['list-highlight:reset', 'element-highlight:reset'] }],
        },
      },
      {
        type: 'element-highlight',
        cfg: {
          start: [{ trigger: 'element:mouseenter', action: 'element-highlight:highlight' }],
          end: [{ trigger: 'element:mouseleave', action: 'element-highlight:reset' }],
        },
      },
      {
        type: 'tooltip',
        cfg: {
          start: [{ trigger: 'element:mousemove', action: 'tooltip:show' }],
          end: [{ trigger: 'element:mouseleave', action: 'tooltip:hide' }],
        },
      },
      {
        type: 'active-region',
        cfg: {
          start: [{ trigger: 'element:mousemove', action: 'active-region:show' }],
          end: [{ trigger: 'element:mouseleave', action: 'active-region:hide' }],
        },
      },
    ],
  };

  return (
    <div className={`position-relative ${isMob ? 'height-350px' : ''}`}>
      <Line
        {...config}
        onReady={(plot) => {
          plot.on('legend-item:click', (evt) => {
            onLegendChange(evt);
          });
        }}
      />
    </div>
  );
};

LineChart.propTypes = {
  lineData: PropTypes.oneOfType([
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
  isYaxis: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  ymin: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
  ]).isRequired,
  ymax: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
  ]).isRequired,
  regions: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.array,
  ]).isRequired,
  currentThresholds: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.array,
  ]).isRequired,
  onThresholdItemChange: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.func,
  ]).isRequired,
  yName: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
};

export default LineChart;
