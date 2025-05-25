/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import * as PropTypes from 'prop-types';
import Plotly from 'plotly.js/dist/plotly-cartesian';
import { useSelector } from 'react-redux';
import { Dialog } from '@mui/material';
import Chart from 'react-apexcharts';
import { IoCloseOutline } from 'react-icons/io5';


import plotComponentFactory from './factory';
import customData from '../data/customData.json';

const Plot = plotComponentFactory(Plotly);

const ExpandDialog = (props) => {
  const {
    chartName, chartType, customHeight, chartSeries, chartId, chartData, chartOptions, showModal, atFinish,
    onDrill, onDateGroupChange,
  } = props;
  const [modal, setModal] = useState(showModal);

  const { ninjaDashboardItem, updateLayoutInfo } = useSelector((state) => state.analytics);

  const toggle = () => {
    setModal(!modal);
    atFinish();
  };

  const config = customData.customConfig;
  const layout = customData.customLayoutExpand;

  const loading = (ninjaDashboardItem && ninjaDashboardItem.loading) || (updateLayoutInfo && updateLayoutInfo.loading);

  return (
    <Dialog
      fullWidth
      maxWidth="lg"
      open={showModal}
    >
      <div className="dialog-box">
        <p className="circle-graph-heading">
          {chartName}
          {' '}
          <IoCloseOutline
            onClick={toggle}
            size={25}
            cursor="pointer"
          />
        </p>
        <div className="circle-graph-box-expand">
          <div className="pie-chart-inner-box">
            <Chart
              type={chartType}
              height={customHeight}
              series={chartSeries}
              options={chartOptions}
            />
          </div>
        </div>
      </div>
    </Dialog>
  );
};

ExpandDialog.propTypes = {
  chartName: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  chartType: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  customHeight: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
  ]).isRequired,
  showModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  chartSeries: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  chartOptions: PropTypes.oneOfType([
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
export default ExpandDialog;
