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

import plotComponentFactory from './factory';
import customData from '../data/customData.json';

const Plot = plotComponentFactory(Plotly);

const ExpandModal = (props) => {
  const {
    chartName, chartDatasets, chartId, chartData, dataLayout, showModal, atFinish,
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
    <Modal size="xl" className="modal-xxl" isOpen={showModal}>
      <ModalNoPadHead title={chartName || 'View'} fontAwesomeIcon={faChartSimple} closeModalWindow={toggle} />
      {loading && (
        <div className="mt-3 mb-2 pl-1 pt-3 pr-3 pb-1 text-center" style={{ height: '480px' }}>
          <Skeleton active size="large" />
        </div>
      )}
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
            }}
            data={chartDatasets}
            onClick={onDrill}
            style={{ width: '100%', height: '100%' }}
          />
          {!chartId && chartData && chartData.ks_chart_date_groupby && (
          <div className="center-radio-group">
            {customData && customData.dateSeries && customData.dateSeries.map((item) => (
              <Button color={chartData.ks_chart_date_groupby === item.value ? 'secondary' : 'text'} onClick={() => onDateGroupChange(chartData.id, item.value)} size="sm" value={item.value}>{item.label}</Button>
            ))}
          </div>
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
