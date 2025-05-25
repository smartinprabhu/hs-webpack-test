/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import {
  Button,
  Modal,
  ModalBody,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import Plotly from 'plotly.js/dist/plotly-cartesian';
import { useSelector } from 'react-redux';
import { Skeleton } from 'antd';
import {
  faChartSimple,
} from '@fortawesome/free-solid-svg-icons';
import ModalNoPadHead from '@shared/modalNoPadHead';
import html2canvas from 'html2canvas';

import plotComponentFactory from './factory';
import customData from '../data/customData.json';

const Plot = plotComponentFactory(Plotly);

const ExpandModal = (props) => {
  const {
    chartName, chartDatasets, chartId, chartData, dataLayout, showModal, atFinish,
    onDrill, onDateGroupChange, dateFilters, dateGroupData,
  } = props;
  const [modal, setModal] = useState(showModal);

  const { ninjaDashboardItem, updateLayoutInfo } = useSelector((state) => state.analytics);

  const toggle = () => {
    setModal(!modal);
    atFinish();
  };

  const config = customData.customExpandConfig;
  const layout = customData.customLayoutExpand;

  const loading = (ninjaDashboardItem && ninjaDashboardItem.loading) || (updateLayoutInfo && updateLayoutInfo.loading) || (dateGroupData && dateGroupData.loading);

  function checkNumber(arr) {
    const arrNum = arr.map((elem) => {
      if (typeof elem === 'number') {
        return elem; // if the element is already a number, return it as is
      }
      // if the element is a string, remove the commas and parse it as a float
      const num = parseFloat(elem.replace(/,/g, ''));
      return isNaN(num) ? 0 : num; // if the result is NaN, return 0 instead
    });
    return arrNum;
  }

  function getMinValue(arr) {
    const arrNum = checkNumber(arr);
    return Math.min(...arrNum);
  }
  function getMaxValue(arr) {
    const arrNum = checkNumber(arr);
    return Math.max(...arrNum);
  }
  function getAvgValue(arr) {
    const arrNum = checkNumber(arr);
    const sum = arrNum.reduce((acc, val) => acc + val, 0);
    const average = sum / arrNum.length;
    const rounded = (Math.round(average * 100) / 100).toFixed(2);
    let displayValue = parseFloat(rounded).toFixed(2);
    if (displayValue.length > 6) {
      displayValue = displayValue.substring(0, 6);
    }
    return displayValue;
  }
  function getSumValue(arr) {
    const arrNum = checkNumber(arr);
    const sum = arrNum.reduce((acc, val) => acc + parseFloat(val), 0);
    const rounded = sum.toFixed(2);
    return rounded;
  }

  function getRow(chartDatasets) {
    const tableTr = [];
    for (let i = 0; i < chartDatasets.length; i += 1) {
      if (chartDatasets && chartDatasets.length && chartDatasets[i] && chartDatasets[i].y) {
        tableTr.push(
          <tr key={i}>
            <td className="colspan-7">{chartDatasets && chartDatasets[i] && chartDatasets[i].name}</td>
            <td>{getMinValue(chartDatasets && chartDatasets[i] && chartDatasets[i].y)}</td>
            <td>{getMaxValue(chartDatasets && chartDatasets[i] && chartDatasets[i].y)}</td>
            <td>{getAvgValue(chartDatasets && chartDatasets[i] && chartDatasets[i].y)}</td>
            {/* <td>{getSumValue(chartDatasets && chartDatasets[i] && chartDatasets[i].y)}</td> */}
          </tr>,
        );
      }
    }
    return tableTr;
  }

  function calculateTotal(arr) {
    let total = 0;
    if (Array.isArray(arr) && arr.length > 0) {
      for (let i = 0; i < arr.length; i++) {
        const data = arr[i];
        if (data.type === 'bar') {
          total += data.text.reduce((acc, val) => acc + parseFloat(val.replace(/,/g, '')), 0);
        } else if (data.type === 'pie') {
          total += data.values.reduce((acc, val) => acc + parseFloat(val.toString().replace(/,/g, '')), 0);
        } else if (data.type === 'scatter') {
          total += data.y.reduce((acc, val) => acc + parseFloat(val.toString().replace(/,/g, '')), 0);
        }
      }
    }
    total = Math.round(total * 100) / 100;
    return total;
  }

  const downloadImage = (blob, fileName) => {
    const fakeLink = window.document.createElement('a');
    fakeLink.style = 'display:none;';
    const actionDiv = document.getElementById('close_button');
    fakeLink.download = fileName;

    fakeLink.href = blob;

    document.body.appendChild(fakeLink);
    fakeLink.click();
    document.body.removeChild(fakeLink);
    if (actionDiv) {
      actionDiv.style.display = 'initial';
    }
    fakeLink.remove();
  };

  const exportAsImage = async () => {
    const actionDiv = document.getElementById('close_button');
    if (actionDiv) {
      actionDiv.style.display = 'none';
    }
    const targetDiv = document.getElementById('expand_modal');
    if (targetDiv) {
      const canvas = await html2canvas(targetDiv, {
        scale: 6, // set the DPI value to 6 times the default (96 DPI)
      });
      const image = canvas.toDataURL('image/png', 3.0);
      downloadImage(image, chartData.name);
    }
  };

  const modeBarButtonsToAdd = [
    {
      name: 'Download',
      width: 15,
      height: 15,
      icon: Plotly.Icons.camera,
      direction: 'up',
      click: (gd) => {
        exportAsImage();
      },
    },

  ];

  function isJsonString(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  function getJsonString(str) {
    return JSON.parse(str);
  }

  return (
    <Modal size="xl" className="modal-xxl" isOpen={showModal} id="expand_modal">
      <ModalNoPadHead title={chartName || 'View'} fontAwesomeIcon={faChartSimple} closeModalWindow={toggle} />

      {loading && (
        <div className="mt-3 mb-2 pl-1 pt-3 pr-3 pb-1 text-center" style={{ height: '480px' }}>
          <Skeleton active size="large" />
        </div>
      )}
      {dateFilters && (
        <div className="col-md-12">
          <span className="date-details">
            Selected Date :
            {' '}
            {Array.isArray(dateFilters) ? `${dateFilters[0]} - ${dateFilters[1]}` : dateFilters}
          </span>
        </div>
      )}
      {
        chartData.ks_std_dav ? (
          <div className="col-md-12">
            <span className="date-details">
              Total
              {' '}
              {chartName}
              {' '}
              :
              {' '}
              {calculateTotal(chartDatasets)}
            </span>
          </div>
        ) : null
      }
      {!loading && (
        <ModalBody className="pl-1 pt-0 pr-3 pb-2">

          <Plot
            layout={{
              ...dataLayout,
              height: 500,
            }}
            config={{
              ...config,
              scrollZoom: true,
              modeBarButtonsToAdd,
            }}
            data={chartDatasets}
            onClick={onDrill}
            style={{ width: '100%', height: '100%' }}
          />

          {chartData && (chartData.ks_dashboard_item_type === 'ks_bar_chart' || chartData.ks_dashboard_item_type === 'ks_line_chart') && (
            <div className="chart-details">
              <table>
                <thead>
                  <tr>
                    <td />
                    <td className="font-weight-800">Min</td>
                    <td className="font-weight-800">Max</td>
                    <td className="font-weight-800">Avg</td>
                  </tr>
                </thead>
                <tbody>

                  {getRow(chartDatasets)}

                </tbody>
              </table>
            </div>
          )}
          {!(chartData && chartData.ks_info && isJsonString(chartData.ks_info) && getJsonString(chartData.ks_info).show_daterange === 'false') && (
          <>
            {!chartId && chartData && chartData.ks_chart_date_groupby && chartData.ks_chart_relation_groupby_field_type === 'datetime' && (
            <div className="center-radio-group">
              {customData && customData.dateSeries && customData.dateSeries.map((item) => (
                <Button color={chartData.ks_chart_date_groupby === item.value ? 'secondary' : 'text'} onClick={() => onDateGroupChange(chartData.id, item.value)} size="sm" value={item.value}>{item.label}</Button>
              ))}
            </div>
            )}
            {!chartId && chartData && chartData.ks_chart_date_groupby && chartData.ks_chart_relation_groupby_field_type === 'date' && (
            <div className="center-radio-group">
              {customData && customData.dateNoTimeSeries && customData.dateNoTimeSeries.map((item) => (
                <Button color={chartData.ks_chart_date_groupby === item.value ? 'secondary' : 'text'} onClick={() => onDateGroupChange(chartData.id, item.value)} size="sm" value={item.value}>{item.label}</Button>
              ))}
            </div>
            )}
          </>
          )}
        </ModalBody>
      )}
    </Modal>
  );
};

ExpandModal.propTypes = {
  chartName: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  showModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  chartDatasets: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  dataLayout: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  onDrill: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.func,
  ]).isRequired,
  chartId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
  ]).isRequired,
  chartData: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
  ]).isRequired,
  atFinish: PropTypes.func.isRequired,
  onDateGroupChange: PropTypes.func.isRequired,
};
export default ExpandModal;
