/* eslint-disable import/no-cycle */
/* eslint-disable max-len */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable radix */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import * as PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
  Skeleton, Drawer,
} from 'antd';
import {
  Modal,
  ModalBody,
} from 'reactstrap';
import {
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import { makeStyles } from '@material-ui/core/styles';
import Plotly from 'plotly.js/dist/plotly-cartesian';

import ModalNoPadHead from '@shared/modalNoPadHead';
import ErrorContent from '@shared/errorContent';
import DrawerHeader from '@shared/drawerHeader';

import plotComponentFactory from './factory';
import '../../analytics/nativeDashboard/nativeDashboard.scss';
import {
  getDatasetsPie, getDatasetsBar, getDatasetsHBar, getDatasetsLine,
  getDomainString,
} from '../utils/utils';
import { getPagesCountV2, getColumnArrayById } from '../../util/appUtils';
import customData from '../data/customData.json';
import {
  getNinjaDashboardItem,
  setCurrentDashboardItem,
  resetCurrentDashboardItem,
} from '../../analytics/analytics.service';

import {
  getExtraSelectionMultiple, getExtraSelectionMultipleCount,
} from '../../helpdesk/ticketService';
import DynamicTableView from './dynamicTableView';
import ExpandModal from './expandModal';

const Plot = plotComponentFactory(Plotly);
const appModels = require('../../util/appModels').default;

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const PieChart = React.memo((props) => {
  const {
    chartData, height, width, dashboardColors, dateFilters,
    isShowModal, setChildShow,
    isIot,
    dashboardUuid,
    dashboardCode,
    isPublic,
  } = props;
  const dispatch = useDispatch();

  const [domainData, setDomain] = useState([]);
  const [chartId, setChartId] = useState(false);
  const [chartSequence, setSequence] = useState(0);
  const [active, setActive] = useState('idle');
  const [domainsList, setDomainsList] = useState([]);

  const [isViewList, setViewList] = useState(false);
  const [modelName, setModel] = useState(false);
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);

  const [chartDatasets, setDatasets] = useState([]);
  const [dataLayout, setDataLayout] = useState({});
  const [showModal, setShowModal] = useState(false);

  const [searchValue, setSearchValue] = useState('');
  const [isSearch, setSearch] = useState(false);
  const [isViewTitle, setViewTitle] = useState(false);

  const classes = useStyles();
  const limit = 20;

  const chartValues = chartData && chartData.ks_chart_data ? JSON.parse(chartData.ks_chart_data) : false;

  const layout = customData.customLayout;

  const config = customData.customConfig;

  const pieLayout = customData.customLayoutPie;

  const layoutExpand = customData.customLayoutExpand;

  const { ninjaDashboardItem, selectedDashboard } = useSelector((state) => state.analytics);
  const {
    listDataMultipleInfo, listDataMultipleCountInfo, listDataMultipleCountLoading,
  } = useSelector((state) => state.ticket);

  function getActiveState() {
    const id = chartData ? chartData.id : '';
    let result = 'idle';
    if (selectedDashboard && selectedDashboard === id) {
      result = 'active';
    } else if (selectedDashboard && selectedDashboard !== id) {
      result = 'inactive';
    } else {
      result = 'idle';
    }
    return result;
  }

  function getActionCount() {
    let res = 0;
    const arr = dashboardColors && dashboardColors.length ? dashboardColors.filter((item) => item.id === chartData.id) : false;
    if (chartId && arr && arr.length && arr[0].ks_action_lines) {
      res = arr[0].ks_action_lines.length;
    }
    return res;
  }

  useEffect(() => {
    const currentSeq = chartSequence + 1;
    if (chartId && domainData && (currentSeq <= getActionCount())) {
      dispatch(getNinjaDashboardItem(
        'ks_fetch_drill_down_data',
        appModels.NINJABOARDITEM,
        chartId,
        dashboardUuid ? JSON.stringify(domainData) : domainData,
        chartSequence,
        dashboardUuid ? 'IOT' : false,
        dashboardUuid,
      ));
    }
  }, [domainData]);

  useEffect(() => {
    if (chartId) {
      dispatch(setCurrentDashboardItem(chartId));
    }
  }, [chartId]);

  useEffect(() => {
    if (selectedDashboard) {
      setActive(getActiveState());
    }
  }, [selectedDashboard]);

  useEffect(() => {
    if (active === 'inactive') {
      setSequence(0);
      setChartId(false);
      setDomain([]);
      setDomainsList([]);
      setViewList(false);
      setModel(false);
      setDomain(false);
      setOffset(0);
      setPage(1);
    }
  }, [active]);

  useEffect(() => {
    if (modelName && isViewList) {
      const fields = customData && customData[modelName] ? getColumnArrayById(customData[modelName], 'property') : [];
      dispatch(getExtraSelectionMultiple(false, modelName, limit, offset, fields, getDomainString(JSON.stringify(domainData), searchValue, modelName)));
    }
  }, [modelName, isViewList, offset, isSearch]);

  useEffect(() => {
    if (modelName && isViewList) {
      const fields = customData && customData[modelName] ? getColumnArrayById(customData[modelName], 'property') : [];
      dispatch(getExtraSelectionMultipleCount(false, modelName, fields, getDomainString(JSON.stringify(domainData), searchValue, modelName)));
    }
  }, [modelName, isViewList, isSearch]);

  const sortedActions = (actionsData) => (actionsData.sort((a, b) => a.sequence - b.sequence));

  const chartItemValues = ninjaDashboardItem && ninjaDashboardItem.data && ninjaDashboardItem.data.ks_chart_data ? JSON.parse(ninjaDashboardItem.data.ks_chart_data) : false;
  const chartItemType = ninjaDashboardItem && ninjaDashboardItem.data && ninjaDashboardItem.data.ks_chart_type ? ninjaDashboardItem.data.ks_chart_type : 'none';
  const loading = (ninjaDashboardItem && ninjaDashboardItem.loading) || (listDataMultipleInfo && listDataMultipleInfo.loading) || (listDataMultipleCountLoading);

  /* const onChartItemClick = (elements, evt) => {
    if (chartData) {
      if ((chartData.max_sequnce && chartData.max_sequnce > 0) && (domainsList.length < (chartData.max_sequnce))) {
        if (!chartId) {
          if (elements.length === 0) return;
          const chart = elements[0]._chart;
          const element = chart.getElementAtEvent(evt)[0];
          setChartId(chartData.id);
          setDomain(chartValues.domains[element._index]);
          const listData = [{ id: 0, data: chartValues.domains[element._index] }];
          setDomainsList(listData);
        } else if (chartId) {
          if (elements.length === 0) return;
          const seq = parseInt(chartSequence) + 1;
          setSequence(seq);
          const chart = elements[0]._chart;
          const element = chart.getElementAtEvent(evt)[0];
          setDomain(chartItemValues.domains[element._index]);
          const listData = [{ id: chartSequence + 1, data: chartItemValues.domains[element._index] }];
          setDomainsList([...domainsList, ...listData]);
        }
      } else {
        if (elements.length === 0) return;
        const chart = elements[0]._chart;
        const element = chart.getElementAtEvent(evt)[0];
        const chartDomainList = chartSequence > 0 && chartItemValues ? chartItemValues : chartValues;
        setSequence(chartSequence + 1);
        if (!chartId) {
          setChartId(chartData.id);
        }
        setDomain(chartDomainList.domains[element._index]);
        const listData = [{ id: chartSequence + 1, data: chartDomainList.domains[element._index] }];
        setDomainsList([...domainsList, ...listData]);
        setViewList(true);
        setModel(chartData.ks_model_name);
      }
    }
  }; */

  const onChartItemClickPointPie = (evt) => {
    if (chartData && !isPublic) {
      const maxSequence = chartData.max_sequnce === 'Attribute: max_sequnce does not exist.'
        ? chartData.ks_action_lines && chartData.ks_action_lines.length
        : chartData.max_sequnce;
      if ((maxSequence && maxSequence > 0) && (domainsList.length < (maxSequence))) {
        if (!chartId) {
          if (evt.points.length === 0) return;
          const element = evt.points[0].pointNumber;
          setChartId(chartData.id);
          setDomain(chartValues.domains[element]);
          const listData = [{ id: 0, data: chartValues.domains[element] }];
          setDomainsList(listData);
        } else if (chartId) {
          if (evt.points.length === 0) return;
          const element = evt.points[0].pointNumber;
          setSequence(chartSequence + 1);
          setDomain(chartItemValues.domains[element]);
          const listData = [{ id: chartSequence + 1, data: chartItemValues.domains[element] }];
          setDomainsList([...domainsList, ...listData]);
        }
      } else {
        if (evt.points.length === 0) return;
        const element = evt.points[0].pointNumber;
        const chartDomainList = chartSequence > -1 && chartItemValues ? chartItemValues : chartValues;
        if (chartDomainList.domains[element] && chartDomainList.domains[element].length) {
          setSequence(chartSequence + 1);
          if (!chartId) {
            setChartId(chartData.id);
          }
          if (chartData.ks_data_calculation_type === 'custom') {
            setDomain(chartDomainList.domains[element]);
            const listData = [{ id: chartSequence + 1, data: chartDomainList.domains[element] }];
            setDomainsList([...domainsList, ...listData]);
            setViewList(true);
            setModel(chartData.ks_model_name);
          }
        }
      }
    }
  };

  const onChartItemClickPoint = (evt) => {
    if (chartData && !isPublic) {
      if ((chartData.max_sequnce && chartData.max_sequnce > 0) && (domainsList.length < (chartData.max_sequnce))) {
        if (!chartId) {
          if (evt.points.length === 0) return;
          const element = evt.points[0].pointIndex;
          setChartId(chartData.id);
          setDomain(chartValues.domains[element]);
          const listData = [{ id: 0, data: chartValues.domains[element] }];
          setDomainsList(listData);
        } else if (chartId) {
          if (evt.points.length === 0) return;
          const element = evt.points[0].pointIndex;
          setSequence(chartSequence + 1);
          setDomain(chartItemValues.domains[element]);
          const listData = [{ id: chartSequence + 1, data: chartItemValues.domains[element] }];
          setDomainsList([...domainsList, ...listData]);
        }
      } else {
        if (evt.points.length === 0) return;
        const element = evt.points[0].pointIndex;
        const chartDomainList = chartSequence > -1 && chartItemValues ? chartItemValues : chartValues;
        if (chartDomainList.domains[element] && chartDomainList.domains[element].length) {
          setSequence(chartSequence + 1);
          if (!chartId) {
            setChartId(chartData.id);
          }
          if (chartData.ks_data_calculation_type === 'custom') {
            setDomain(chartDomainList.domains[element]);
            const listData = [{ id: chartSequence + 1, data: chartDomainList.domains[element] }];
            setDomainsList([...domainsList, ...listData]);
            setViewList(true);
            setModel(chartData.ks_model_name);
          }
        }
      }
    }
  };

  const onSearchChange = (e) => {
    setSearchValue(e.target.value);
    if (e.key === 'Enter') {
      setSearch(Math.random());
      setPage(1);
      setOffset(0);
    }
  };

  const onClear = () => {
    setSearchValue('');
    setSearch(Math.random());
    setPage(1);
    setOffset(0);
  };

  const onSearch = () => {
    setSearch(Math.random());
    setPage(1);
    setOffset(0);
  };

  function getDominData(key) {
    let result = domainData;
    const arr = domainsList.filter((item) => item.id === key);
    if (arr && arr.length) {
      result = arr[0].data;
    }
    return result;
  }

  const onReset = () => {
    const maxSequence = chartData.max_sequnce === 'Attribute: max_sequnce does not exist.'
      ? chartData.ks_action_lines && chartData.ks_action_lines.length
      : chartData.max_sequnce;
    if ((chartSequence > 0) && (maxSequence && maxSequence > 0)) {
      if (isViewList) {
        setViewList(false);
      }
      setSequence(chartSequence - 1);
      setDomain(getDominData(chartSequence - 1));
    } else {
      dispatch(resetCurrentDashboardItem());
      setSequence(0);
      setChartId(false);
      setDomain([]);
      setDomainsList([]);
      setViewList(false);
      setModel(false);
      setDomain(false);
      setOffset(0);
      setPage(1);
    }
  };

  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsetValue = (index - 1) * limit;
    setPage(index);
    setOffset(offsetValue);
  };

  /* function getChartColors(key) {
    return chartValues && chartValues.colors ? chartValues.colors : [];
    /* let result = [];
    const arr = dashboardColors && dashboardColors.length ? dashboardColors.filter((item) => item.id === key) : false;
    if (arr && arr.length) {
      if (arr[0].ks_graph_status_records && arr[0].ks_graph_status_records.length) {
        result = getColumnArrayById(arr[0].ks_graph_status_records, 'ks_color_picker_id');
      }
    }
    return result;
  } */

  const onTitleReset = (seq) => {
    if (isViewList) {
      setViewList(false);
    }
    setSequence(seq);
    setDomain(getDominData(seq));
  };

  const onTitleFullReset = () => {
    dispatch(resetCurrentDashboardItem());
    setSequence(0);
    setChartId(false);
    setDomain([]);
    setDomainsList([]);
    setViewList(false);
    setModel(false);
    setDomain(false);
    setOffset(0);
    setPage(1);
    if (showModal || isShowModal) {
      setDatasets(getDatasetsPie(chartValues.datasets, chartValues.labels, chartValues.colors, chartData.ks_dashboard_item_type));
      setDataLayout({ ...layoutExpand, showlegend: true });
    }
  };

  function getDrillName() {
    const res = [];
    const arr = dashboardColors && dashboardColors.length ? dashboardColors.filter((item) => item.id === chartData.id) : false;
    if (chartId && arr && arr.length && arr[0].ks_action_lines && arr[0].ks_action_lines.length && arr[0].ks_action_lines[chartSequence]) {
      res.push(
        <span className="cursor-pointer" aria-hidden onClick={() => onTitleFullReset()}>
          {chartData.name}
        </span>,
      );
      for (let i = 0; i <= chartSequence; i += 1) {
        res.push(
          <span className={chartSequence === i ? 'light-text' : 'cursor-pointer'} key={i} aria-hidden onClick={() => onTitleReset(i)}>
            {'   '}
            /
            {'   '}
            {sortedActions(arr[0].ks_action_lines)[i].ks_item_action_field.field_description}
          </span>,
        );
      }
      // res = arr[0].ks_action_lines[chartSequence].ks_item_action_field && arr[0].ks_action_lines[chartSequence].ks_item_action_field.field_description ? arr[0].ks_action_lines[chartSequence].ks_item_action_field.field_description : chartData.name;
    }
    return res;
  }

  function getExpandDrillName() {
    const res = [];
    const arr = dashboardColors && dashboardColors.length ? dashboardColors.filter((item) => item.id === chartData.id) : false;
    res.push(
      <span className="cursor-pointer" aria-hidden onClick={() => onTitleFullReset()}>
        {chartData.name}
      </span>,
    );
    if (chartId && arr && arr.length && arr[0].ks_action_lines && arr[0].ks_action_lines.length && arr[0].ks_action_lines[chartSequence]) {
      for (let i = 0; i <= chartSequence; i += 1) {
        res.push(
          <span className={chartSequence === i ? 'light-text' : 'cursor-pointer'} key={i} aria-hidden onClick={() => onTitleReset(i)}>
            {'   '}
            /
            {'   '}
            {sortedActions(arr[0].ks_action_lines)[i].ks_item_action_field.field_description}
          </span>,
        );
      }
      // res = arr[0].ks_action_lines[chartSequence].ks_item_action_field && arr[0].ks_action_lines[chartSequence].ks_item_action_field.field_description ? arr[0].ks_action_lines[chartSequence].ks_item_action_field.field_description : chartData.name;
    }
    return res;
  }

  function getTableDrillName() {
    let res = chartData.name;
    const arr = dashboardColors && dashboardColors.length ? dashboardColors.filter((item) => item.id === chartData.id) : false;
    if (chartId && arr && arr.length && arr[0].ks_action_lines && arr[0].ks_action_lines.length && isViewList) {
      for (let i = 0; i < arr[0].ks_action_lines.length; i += 1) {
        res += `/${sortedActions(arr[0].ks_action_lines)[i].ks_item_action_field.field_description}`;
      }
    }
    return res;
  }

  const onExpandChart = () => {
    // console.log(cd);
    // if (cd) {
    let cData = getDatasetsPie(chartValues.datasets, chartValues.labels, chartValues.colors, chartData.ks_dashboard_item_type);
    let cLayout = { ...layoutExpand, showlegend: true };
    if (chartId) {
      if (chartItemType === 'ks_bar_chart') {
        cData = getDatasetsBar(chartItemValues.datasets, chartItemValues.labels);
        cLayout = chartItemValues.datasets.length > 1 ? { ...layoutExpand, showlegend: true } : layoutExpand;
      } else if (chartItemType === 'ks_horizontalBar_chart') {
        cData = getDatasetsHBar(chartItemValues.datasets, chartItemValues.labels);
        cLayout = chartItemValues.datasets.length > 1 ? { ...layoutExpand, showlegend: true } : layoutExpand;
      } else if (chartItemType === 'ks_pie_chart' || chartItemType === 'ks_doughnut_chart') {
        cData = getDatasetsPie(chartItemValues.datasets, chartItemValues.labels, false, chartItemType);
        cLayout = { ...layoutExpand, showlegend: true };
      } else if (chartItemType === 'ks_line_chart' || chartItemType === 'ks_area_chart' || chartItemType === 'ks_polarArea_chart') {
        cData = getDatasetsLine(chartItemValues.datasets, chartItemValues.labels, false, chartItemType);
        cLayout = chartItemValues.datasets.length > 1 ? { ...layoutExpand, showlegend: true } : layoutExpand;
      }
    }
    setDatasets(cData);
    setDataLayout(cLayout);
    setShowModal(true);
    // }
  };

  const onExpandChartData = () => {
    // console.log(cd);
    // if (cd) {
    let cData = getDatasetsPie(chartValues.datasets, chartValues.labels, chartValues.colors, chartData.ks_dashboard_item_type);
    let cLayout = { ...layoutExpand, showlegend: true };
    if (chartId) {
      if (chartItemType === 'ks_bar_chart') {
        cData = getDatasetsBar(chartItemValues.datasets, chartItemValues.labels);
        cLayout = chartItemValues.datasets.length > 1 ? { ...layoutExpand, showlegend: true } : layoutExpand;
      } else if (chartItemType === 'ks_horizontalBar_chart') {
        cData = getDatasetsHBar(chartItemValues.datasets, chartItemValues.labels);
        cLayout = chartItemValues.datasets.length > 1 ? { ...layoutExpand, showlegend: true } : layoutExpand;
      } else if (chartItemType === 'ks_pie_chart' || chartItemType === 'ks_doughnut_chart') {
        cData = getDatasetsPie(chartItemValues.datasets, chartItemValues.labels, false, chartItemType);
        cLayout = { ...layoutExpand, showlegend: true };
      } else if (chartItemType === 'ks_line_chart' || chartItemType === 'ks_area_chart' || chartItemType === 'ks_polarArea_chart') {
        cData = getDatasetsLine(chartItemValues.datasets, chartItemValues.labels, false, chartItemType);
        cLayout = chartItemValues.datasets.length > 1 ? { ...layoutExpand, showlegend: true } : layoutExpand;
      }
    }
    setDatasets(cData);
    setDataLayout(cLayout);
    // setShowModal(true);
    // }
  };

  useEffect(() => {
    if (isViewList) {
      setShowModal(false);
      setDatasets([]);
      setDataLayout({});
    }
  }, [isViewList]);

  useEffect(() => {
    if (isShowModal) {
      onExpandChartData();
    }
  }, [isShowModal]);

  useEffect(() => {
    if (ninjaDashboardItem && ninjaDashboardItem.data) {
      onExpandChartData();
    }
  }, [ninjaDashboardItem]);

  const onResetFull = () => {
    dispatch(resetCurrentDashboardItem());
    setSequence(0);
    setChartId(false);
    setDomain([]);
    setDomainsList([]);
    setViewList(false);
    setModel(false);
    setDomain(false);
    setOffset(0);
    setPage(1);
  };

  const onViewTitle = () => {
    setViewTitle(true);
  };

  let modeBarButtonsToAdd = [];

  if (chartId) {
    modeBarButtonsToAdd = [
      {
        name: 'Expand',
        width: 15,
        height: 15,
        icon: Plotly.Icons.autoscale,
        direction: 'up',
        click: (gd) => {
          onExpandChart();
        },
      },
      {
        name: 'Reset Drill Down',
        width: 15,
        height: 15,
        icon: Plotly.Icons.undo,
        direction: 'up',
        click: (gd) => {
          onResetFull();
        },
      }];
  } else if (!chartId && chartData.ks_description) {
    modeBarButtonsToAdd = [
      {
        name: 'Info',
        width: 15,
        height: 15,
        icon: Plotly.Icons.question,
        direction: 'up',
        click: (gd) => {
          onViewTitle();
        },
      },
      {
        name: 'Expand',
        width: 15,
        height: 15,
        icon: Plotly.Icons.autoscale,
        direction: 'up',
        click: (gd) => {
          onExpandChart();
        },
      }];
  } else {
    modeBarButtonsToAdd = [
      {
        name: 'Expand',
        width: 15,
        height: 15,
        icon: Plotly.Icons.autoscale,
        direction: 'up',
        click: (gd) => {
          onExpandChart();
        },
      }];
  }

  const totalDataCount = listDataMultipleCountInfo && listDataMultipleCountInfo.length ? listDataMultipleCountInfo.length : 0;

  const pages = getPagesCountV2(totalDataCount, limit);

  const isDataValuExists = chartValues && chartValues.datasets && chartValues.datasets.length > 0;

  const isDataValue = isDataValuExists ? chartValues.datasets.filter((item) => item.data && item.data.length) : [];

  const isDataExists = (isDataValue && isDataValue.length);

  const reHight = chartId ? 30 : 10;
  const customHeight = height - reHight;
  const customWidth = width - 20;

  return (
    <>
      {isDataExists ? (
        <>
          {!chartId && (
            <>
              { /* <StaticDataExport
              chartData={chartData}
              nextLevel={false}
              chartItems={false}
          /> */ }
              <div width="100%" height="100%" className="pr-3 pl-3" id="rechartContainer" style={{ height: '100%', width: '100%' }}>
                <Plot
                  key={chartData.code}
                  layout={{
                    ...pieLayout,
                    height: customHeight,
                    // width: customWidth,
                    title: {
                      text: `<b>${chartData.name}</b>`,
                      x: 0,
                      font: {
                        family: 'Lato,sans-serif',
                        size: 14,
                      },
                    },
                    // colorway: getChartColors(chartData.id),
                  }}
                  config={{
                    ...config,
                    modeBarButtonsToAdd,
                  }}
                  // options={pieChartOptions}
                  data={getDatasetsPie(chartValues.datasets, chartValues.labels, chartValues.colors, chartData.ks_dashboard_item_type)}
                  onClick={(evt) => onChartItemClickPointPie(evt)}
                  style={{ width: '100%', height: '100%' }}
                // onElementsClick={(elems, evt) => onChartItemClick(elems, evt)}
                />
              </div>
            </>
          )}
          {chartId && (
            <>
              {loading && (
                <div className="mt-3 mb-2 text-center">
                  <Skeleton active />
                </div>
              )}
              {chartItemType === 'ks_bar_chart' && (
                <div width="100%" height="100%" className="pr-3 pl-3" id="rechartContainer" style={{ height: '100%', width: '100%' }}>
                  <p className="mb-0 mr-2 ml-0 mt-2 no-wrap-text">{getDrillName()}</p>
                  <Plot
                    key={chartId}
                    layout={{
                      ...layout,
                      height: customHeight,
                      // width: customWidth,
                    }}
                    config={{
                      ...config,
                      modeBarButtonsToAdd,
                    }}
                    data={getDatasetsBar(chartItemValues.datasets, chartItemValues.labels)}
                    onClick={(evt) => onChartItemClickPoint(evt)}
                    style={{ width: '100%', height: '100%' }}
                  />
                </div>
              )}
              {chartItemType === 'ks_horizontalBar_chart' && (
                <div width="100%" height="100%" className="pr-3 pl-3" id="rechartContainer" style={{ height: '100%', width: '100%' }}>
                  <p className="mb-0 mr-2 ml-0 mt-2 no-wrap-text">{getDrillName()}</p>
                  <Plot
                    key={chartId}
                    layout={{
                      ...layout,
                      height: customHeight,
                      // width: customWidth,
                    }}
                    config={{
                      ...config,
                      modeBarButtonsToAdd,
                    }}
                    data={getDatasetsHBar(chartItemValues.datasets, chartItemValues.labels)}
                    onClick={(evt) => onChartItemClickPoint(evt)}
                    style={{ width: '100%', height: '100%' }}
                  />
                </div>
              )}
              {(chartItemType === 'ks_pie_chart' || chartItemType === 'ks_doughnut_chart') && (
                <div width="100%" height="100%" className="pr-3 pl-3" id="rechartContainer" style={{ height: '100%', width: '100%' }}>
                  <p className="mb-0 mr-2 ml-0 mt-2 no-wrap-text">{getDrillName()}</p>
                  <Plot
                    key={chartId}
                    layout={{
                      ...pieLayout,
                      height: customHeight,
                      // width: customWidth,
                    }}
                    config={{
                      ...config,
                      modeBarButtonsToAdd,
                    }}
                    data={getDatasetsPie(chartItemValues.datasets, chartItemValues.labels, false, chartItemType)}
                    onClick={(evt) => onChartItemClickPointPie(evt)}
                    style={{ width: '100%', height: '100%' }}
                  />
                </div>
              )}
              {(chartItemType === 'ks_line_chart' || chartItemType === 'ks_area_chart' || chartItemType === 'ks_polarArea_chart') && (
                <div width="100%" height="100%" className="pr-3 pl-3" id="rechartContainer" style={{ height: '100%', width: '100%' }}>
                  <p className="mb-0 mr-2 ml-0 mt-2 no-wrap-text">{getDrillName()}</p>
                  <Plot
                    key={chartId}
                    layout={{
                      ...layout,
                      height: customHeight,
                      // width: customWidth,
                    }}
                    config={{
                      ...config,
                      modeBarButtonsToAdd,
                    }}
                    data={getDatasetsLine(chartItemValues.datasets, chartItemValues.labels, false, chartItemType)}
                    onClick={(evt) => onChartItemClickPoint(evt)}
                    style={{ width: '100%', height: '100%' }}
                  />
                </div>
              )}
            </>
          )}
        </>
      )
        : (
          <>
            <p className="mb-0 mr-0 ml-2 mt-2 no-wrap-text">{chartData.name}</p>
            <ErrorContent errorTxt="No information to be displayed." />
          </>
        )}
      {(showModal || isShowModal) && !isViewList && (
        <ExpandModal
          atFinish={() => {
            setShowModal(false);
            setDatasets([]);
            setDataLayout({});
            if (setChildShow) setChildShow();
          }}
          chartDatasets={chartDatasets}
          showModal={(showModal || isShowModal)}
          chartData={chartData}
          dataLayout={dataLayout}
          onDrill={chartId && (chartItemType === 'ks_line_chart' || chartItemType === 'ks_area_chart' || chartItemType === 'ks_polarArea_chart' || chartItemType === 'ks_horizontalBar_chart' || chartItemType === 'ks_bar_chart') ? onChartItemClickPoint : onChartItemClickPointPie}
          chartName={getExpandDrillName()}
          dateFilters={dateFilters}
        />
      )}
      <Drawer
        title=""
        closable={false}
        className="drawer-bg-lightblue"
        width="90%"
        visible={isViewList}
      >
        <DrawerHeader
          title={getTableDrillName()}
          imagePath={false}
          closeDrawer={() => onReset()}
        />
        { /* <h4>
          <DynamicDataExport
            listName={getTableDrillName()}
            modelName={modelName}
            domainData={domainData}
            onSearchChange={onSearchChange}
            onClear={onClear}
            onSearch={onSearch}
            searchValue={searchValue}
          />
        </h4> */ }
        <div className="">
          { /* listDataMultipleInfo && listDataMultipleInfo.loading && (
            <div className="p-3 text-center">
              <Skeleton active />
            </div>
          ) */}
          <DynamicTableView
            columns={customData && customData[modelName] ? customData[modelName] : []}
            data={listDataMultipleInfo && !listDataMultipleInfo.err && !listDataMultipleInfo.loading && listDataMultipleInfo.data ? listDataMultipleInfo.data : []}
            propertyAsKey="id"
            modelName={modelName}
          />
        </div>
        { /* loading || pages === 0 ? (<span />) : (
          <div className={`${classes.root} float-right`}>
            <Pagination count={pages} page={page} size="small" color="primary" onChange={handlePageClick} showFirstButton showLastButton />
          </div>
        )}
        {(listDataMultipleInfo && listDataMultipleInfo.err) && (
          <SuccessAndErrorFormat response={listDataMultipleInfo} />
        ) */ }
      </Drawer>
      <Modal size="md" className="border-radius-50px modal-dialog-centered" isOpen={isViewTitle}>
        <ModalNoPadHead title={chartData.name} fontAwesomeIcon={faInfoCircle} closeModalWindow={() => setViewTitle(false)} />
        <ModalBody className="pl-3 pt-0 pr-3 pb-3">
          {chartData.ks_description}
        </ModalBody>
      </Modal>
    </>
  );
});

PieChart.propTypes = {
  chartData: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
    PropTypes.object,
  ]).isRequired,
  height: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
  ]).isRequired,
  width: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
  ]).isRequired,
  dashboardColors: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]).isRequired,
};
export default PieChart;
