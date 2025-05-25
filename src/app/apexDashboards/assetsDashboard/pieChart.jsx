/* eslint-disable no-nested-ternary */
/* eslint-disable react/button-has-type */
/* eslint-disable import/no-cycle */
/* eslint-disable max-len */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable radix */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import * as PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Modal, ModalBody } from 'reactstrap';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { makeStyles } from '@material-ui/core/styles';
import { CgExpand } from 'react-icons/cg';
import { FiDownload } from 'react-icons/fi';
import {
  Box, Dialog, Typography,
  IconButton,
} from '@mui/material';
import { IoCloseOutline } from 'react-icons/io5';
import { RestartAlt } from '@mui/icons-material';
import Drawer from '@mui/material/Drawer';
import html2canvas from 'html2canvas';

import MuiTooltip from '@shared/muiTooltip';

import ModalNoPadHead from '@shared/modalNoPadHead';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import ErrorContent from '@shared/errorContent';
import DrawerHeader from '../../commonComponents/drawerHeader';

import GetPieChart from '../utils/getPieChart';
import '../../analytics/nativeDashboard/nativeDashboard.scss';
import {
  getDatasetsPie,
  getDatasetsBar,
  getDatasetsHBar,
  getDatasetsLine,
  getDomainString,
  getChartName,
  getDatasetsApexBar,
  isModelExists,
  getActionLines,
  getIOTFields,
  get12Fields,
} from '../utils/utils';
import {
  formatFilterData,
  queryGeneratorWithUtc,
  valueCheck, getColumnArrayById, downloadPNGImage, isJsonString, getJsonString, debounce,
} from '../../util/appUtils';
import customData from '../data/customData.json';
import {
  getNinjaDashboardItem,
  setCurrentDashboardItem,
  resetCurrentDashboardItem,
} from '../../analytics/analytics.service';

import {
  getExtraSelectionMultiple,
  getExtraSelectionMultipleCount,
} from '../../helpdesk/ticketService';
import DynamicTableView from './dynamicTableView';
import StaticDataExport from './staticDataExport';

import './pieStyles.css';

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
    chartData, divHeight, chartCode, height, width, dashboardColors, dashboardUuid, dashboardCode, isShowModal, setChildShow, id,
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
  const [page, setPage] = useState(0);
  const [clickHistory, setClickHistory] = useState([]);

  const [chartDatasets, setDatasets] = useState([]);
  const [dataLayout, setDataLayout] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [reload, setReload] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [isAllReport, setAllReport] = useState(false);

  const [searchValue, setSearchValue] = useState('');
  const [isSearch, setSearch] = useState(false);
  const [isViewTitle, setViewTitle] = useState(false);
  const [excelDownload, setExcelDownload] = useState(false);

  const [dashboardColorsList, setDashboardColors] = useState([]);

  const [tableOrder1, setTableOrder1] = useState('desc');
  const [tableIndex1, setTableIndex1] = useState(0);
  const [customFilters, setCustomFilters] = useState('');

  const [anchorEl, setAnchorEl] = React.useState(null);
  const openExport = Boolean(anchorEl);

  const [exportReportData, setExportReportData] = useState(false);
  const [isLargeReport, setLargeReport] = useState(false);

  const { sortedValueDashboard } = useSelector((state) => state.equipment);

  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    setDashboardColors(dashboardColors);
  }, [dashboardColors]);

  const handleClose = () => {
    setAnchorEl(null);
    setExcelDownload(false);
  };

  const handleExcelDownload = () => {
    setAnchorEl(null);
    setExcelDownload(true);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setExcelDownload(false);
  };

  const classes = useStyles();

  const limit = 10;

  const handlePageChange = (pages) => {
    const offsetValue = pages * limit;
    setOffset(offsetValue);
    setPage(page);
  };

  const chartValues = chartData && chartData.ks_chart_data
    ? JSON.parse(chartData.ks_chart_data)
    : false;

  const layout = customData.customLayout;

  const config = customData.customConfig;

  const pieLayout = customData.customLayoutPie;

  const layoutExpand = customData.customLayoutExpand;

  const { ninjaDashboard, ninjaDashboardItem, selectedDashboard } = useSelector(
    (state) => state.analytics,
  );
  const {
    listDataMultipleInfo,
    listDataMultipleCountInfo,
    listDataMultipleCountLoading,
  } = useSelector((state) => state.ticket);

  const totalDataCount = listDataMultipleCountInfo && listDataMultipleCountInfo.length
    ? listDataMultipleCountInfo.length
    : 0;

  const dynamicFields = dashboardUuid ? (chartData && (chartData.ks_info && isJsonString(chartData.ks_info) && getJsonString(chartData.ks_info).list_fields)) : (chartData && chartData.ks_description && isJsonString(chartData.ks_description) && getJsonString(chartData.ks_description).list_fields);

  const tableFields = dashboardUuid ? (chartData && (chartData.ks_info && isJsonString(chartData.ks_info) && getJsonString(chartData.ks_info).table_fields)) : (chartData && chartData.ks_description && isJsonString(chartData.ks_description) && getJsonString(chartData.ks_description).table_fields);

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
      dispatch(
        getNinjaDashboardItem(
          'ks_fetch_drill_down_data',
          appModels.NINJABOARDITEM,
          chartId,
          dashboardUuid ? JSON.stringify(domainData) : domainData,
          chartSequence,
          dashboardUuid ? 'IOT' : false,
          dashboardUuid,
        ),
      );
    }
  }, [domainData]);

  useEffect(() => {
    if (chartCode) {
      dispatch(setCurrentDashboardItem(chartCode));
    }
  }, [chartCode]);

  useEffect(() => {
    if (selectedDashboard) {
      setActive(getActiveState());
    } else {
      setActive(getActiveState());
    }
  }, [selectedDashboard]);

  useEffect(() => {
    if (active === 'inactive') {
      setSequence(0);
      setChartId(false);
       setClickHistory([]);
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
    setSearchValue('');
    setCustomFilters([]);
    setSearch(Math.random());
    setPage(1);
    setOffset(0);
  }, [reload]);

  function getDomainData() {
    let res = getDomainString(JSON.stringify(domainData), searchValue, modelName, customFilters ? queryGeneratorWithUtc(customFilters, false, userInfo.data) : '');
    if (dashboardUuid) {
      res = encodeURIComponent(getDomainString(JSON.stringify(domainData), searchValue, modelName, customFilters ? queryGeneratorWithUtc(customFilters, false, userInfo.data) : ''));
    }
    return res;
  }

  useEffect(() => {
    if (modelName && isViewList) {
      const fields = customData && customData[modelName]
        ? getColumnArrayById(customData[modelName], 'property')
        : [];
      const new12Fields = modelName && get12Fields(modelName, dynamicFields) ? get12Fields(modelName, dynamicFields) : fields;
      const iotFields = modelName && getIOTFields(modelName, dynamicFields) ? getIOTFields(modelName, dynamicFields) : false;
      const newFields = iotFields || fields;
      dispatch(
        getExtraSelectionMultiple(
          false,
          modelName,
          limit,
          offset,
          dashboardUuid ? newFields : new12Fields,
          getDomainData(),
          false,
          modelName && get12Fields(modelName, dynamicFields) ? 'search' : false,
          !!dashboardUuid,
          dashboardUuid,
          sortedValueDashboard,
        ),
      );
    }
  }, [modelName, isViewList, offset, isSearch, sortedValueDashboard]);

  useEffect(() => {
    if (modelName && isViewList && isAllReport) {
      const fields = customData && customData[modelName]
        ? getColumnArrayById(customData[modelName], 'property')
        : [];
      const iotFields = modelName && getIOTFields(modelName, dynamicFields) ? getIOTFields(modelName, dynamicFields) : false;
      const new12Fields = modelName && get12Fields(modelName, dynamicFields) ? get12Fields(modelName, dynamicFields) : fields;
      const newFields = iotFields || fields;
      dispatch(
        getExtraSelectionMultiple(
          false,
          modelName,
          totalDataCount,
          0,
          dashboardUuid ? newFields : new12Fields,
          getDomainData(),
          false,
          modelName && get12Fields(modelName, dynamicFields) ? 'search' : false,
          !!dashboardUuid,
          dashboardUuid,
          sortedValueDashboard,
        ),
      );
    }
  }, [isAllReport]);

  useEffect(() => {
    if (modelName && isViewList && isLargeReport) {
      const fields = customData && customData[modelName]
        ? getColumnArrayById(customData[modelName], 'property')
        : [];
      const iotFields = modelName && getIOTFields(modelName, dynamicFields) ? getIOTFields(modelName, dynamicFields) : false;
      const new12Fields = modelName && get12Fields(modelName, dynamicFields) ? get12Fields(modelName, dynamicFields) : fields;
      const newFields = iotFields || fields;
      setExportReportData({
        totalRecords: totalDataCount, modelName, modelFields: dashboardUuid ? newFields : new12Fields, searchType: modelName && get12Fields(modelName, dynamicFields) ? 'search' : false, downloadType: 'Standard API', domain: getDomainData()
      });
    }
  }, [isLargeReport]);

  useEffect(() => {
    if (modelName && isViewList) {
      const fields = customData && customData[modelName]
        ? getColumnArrayById(customData[modelName], 'property')
        : [];
      const iotFields = modelName && getIOTFields(modelName) ? getIOTFields(modelName, dynamicFields) : false;
      const new12Fields = modelName && get12Fields(modelName, dynamicFields) ? get12Fields(modelName, dynamicFields) : fields;
      const newFields = iotFields || fields;
      dispatch(
        getExtraSelectionMultipleCount(
          false,
          modelName,
          dashboardUuid ? newFields : fields,
          encodeURIComponent(getDomainString(JSON.stringify(domainData), searchValue, modelName, customFilters ? queryGeneratorWithUtc(customFilters, false, userInfo.data) : '')),
          'search',
          !!dashboardUuid,
          dashboardUuid,
        ),
      );
    }
  }, [modelName, isViewList, isSearch]);

  const sortedActions = (actionsData) => actionsData.sort((a, b) => a.sequence - b.sequence);

  const chartItemValues = ninjaDashboardItem
    && ninjaDashboardItem.data
    && ninjaDashboardItem.data.ks_chart_data
    ? JSON.parse(ninjaDashboardItem.data.ks_chart_data)
    : false;
  const chartItemType = ninjaDashboardItem
    && ninjaDashboardItem.data
    && ninjaDashboardItem.data.ks_chart_type
    ? ninjaDashboardItem.data.ks_chart_type
    : 'none';
  const loading = (ninjaDashboardItem && ninjaDashboardItem.loading)
    || (listDataMultipleInfo && listDataMultipleInfo.loading)
    || listDataMultipleCountLoading;

  const onCloseExpand = () => {
    setShowModal(false);
    if (setChildShow) setChildShow();
    setDatasets([]);
    setDataLayout({});
  };

  function getUniqueArr(arr) {
    const res = [...new Map(arr.map((item) => [item.id, item])).values()];
    return res;
  }

  const onChartItemClickPoint = (configs) => {
    try {
      if (!chartData) return;

      dispatch(setCurrentDashboardItem(chartCode));

      const actLines = dashboardUuid && ninjaDashboard?.data
        ? ninjaDashboard.data.ks_dashboard_items_ids
        : dashboardColorsList;

      const maxSequence = chartData.max_sequnce === 'Attribute: max_sequnce does not exist.'
        ? getActionLines(actLines, chartData.id).length
        : chartData.max_sequnce || 0;

      const { dataPointIndex, w } = configs;
      const label = w.config.labels?.[dataPointIndex];

      if (label === undefined || dataPointIndex === undefined) return;

      const currentElement = dataPointIndex;

      // Utility: update click history at a specific level
      const updateClickHistory = (labels, level) => {
        setClickHistory((prev) => {
          const updated = [...prev];
          updated[level] = labels;
          return updated.slice(0, level + 1);
        });
      };

      // Handle drill logic
      if (maxSequence > 0 && getUniqueArr(domainsList).length < maxSequence) {
        if (!chartId) {
        // First level drill
          setChartId(chartData.id);
          setDomain(chartValues.domains[currentElement]);

          const listData = [{ id: 0, data: chartValues.domains[currentElement] }];
          setDomainsList(listData);

          updateClickHistory(label, 0);
        } else {
        // Deeper level drill
          const nextSequence = chartSequence + 1;
          setSequence(nextSequence);
          setDomain(chartItemValues.domains[currentElement]);

          const listData = [{ id: nextSequence, data: chartItemValues.domains[currentElement] }];
          setDomainsList([...domainsList, ...listData]);

          updateClickHistory(label, nextSequence);
        }
      } else {
      // Final drill level: trigger view list if applicable
        const chartDomainList = chartId && chartSequence > -1 && chartItemValues
          ? chartItemValues
          : chartValues;

        const currentDomain = chartDomainList.domains[currentElement];
        if (
          currentDomain?.length
        && isModelExists(chartData.ks_model_name, dynamicFields)
        && !chartData.ks_restrict_drilldown
        ) {
          const nextSequence = chartSequence + 1;

          setSequence(nextSequence);
          if (!chartId) setChartId(chartData.id);

          if (chartData.ks_data_calculation_type === 'custom') {
            setDomain(currentDomain);

            const listData = [{ id: nextSequence, data: currentDomain }];
            setDomainsList([...domainsList, ...listData]);

            updateClickHistory(label, nextSequence);

            setViewList(true);
            setModel(chartData.ks_model_name);
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
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
    const maxSequence = chartData.max_sequnce === 'Attribute: max_sequnce does not exist.' ? getActionLines(dashboardColors, chartData.id).length : chartData.max_sequnce;
    if (
      chartSequence > 0
      && maxSequence
      && maxSequence > 0
    ) {
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
      setFilterText('');
      setCustomFilters([]);
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

  function getChartColors(key) {
    let result = [];
    const arr = dashboardColors && dashboardColors.length
      ? dashboardColors.filter((item) => item.id === key)
      : false;
    if (arr && arr.length) {
      if (
        arr[0].ks_graph_status_records
        && arr[0].ks_graph_status_records.length
      ) {
        result = getColumnArrayById(
          arr[0].ks_graph_status_records,
          'ks_color_picker_id',
        );
      }
    }
    return result;
  }

  const onTitleReset = (seq) => {
    if (isViewList) {
      setViewList(false);
    }
    setSequence(seq);
    setDomain(getDominData(seq));
    setClickHistory((prev) => prev.slice(0, seq + 1));
  };

  const onTitleFullReset = () => {
    dispatch(resetCurrentDashboardItem());
    setSequence(0);
    setChartId(false);
    setClickHistory([]);
    setDomain([]);
    setDomainsList([]);
    setViewList(false);
    setModel(false);
    setDomain(false);
    setOffset(0);
    setPage(1);
    if (showModal || isShowModal) {
      setDatasets(
        getDatasetsPie(
          chartValues.datasets,
          chartValues.labels,
          chartValues.colors,
          chartData.ks_dashboard_item_type,
        ),
      );
      setDataLayout({ ...layoutExpand, showlegend: true });
    }
  };

  function getDrillText() {
    let res = '';
    const arr = dashboardColorsList && dashboardColorsList.length
      ? dashboardColorsList.filter((item) => item.id === chartData.id)
      : false;
    if (
      chartId
      && arr
      && arr.length
      && arr[0].ks_action_lines
      && arr[0].ks_action_lines.length
      && arr[0].ks_action_lines[chartSequence]
    ) {
      res = clickHistory[chartSequence];
    }
    return res;
  }

  function getDrillName() {
    const res = [];
    const arr = dashboardColors && dashboardColors.length
      ? dashboardColors.filter((item) => item.id === chartData.id)
      : false;
    if (
      chartId
      && arr
      && arr.length
      && arr[0].ks_action_lines
      && arr[0].ks_action_lines.length
      && arr[0].ks_action_lines[chartSequence]
    ) {
      res.push(
        <span
          className="cursor-pointer"
          aria-hidden
          onClick={() => onTitleFullReset()}
        >
          {chartData.name}
        </span>,
      );
      for (let i = 0; i <= chartSequence; i += 1) {
        res.push(
          <span
            className={chartSequence === i ? 'light-text' : 'cursor-pointer'}
            key={i}
            aria-hidden
            onClick={() => onTitleReset(i)}
          >
            {'   '}
            /
            {'   '}
            {clickHistory[i]}
          </span>,
        );
      }
      // res = arr[0].ks_action_lines[chartSequence].ks_item_action_field && arr[0].ks_action_lines[chartSequence].ks_item_action_field.field_description ? arr[0].ks_action_lines[chartSequence].ks_item_action_field.field_description : chartData.name;
    }
    return res;
  }

  function getTableDrillName() {
    let res = chartData.name;
    const arr = dashboardColors && dashboardColors.length
      ? dashboardColors.filter((item) => item.id === chartData.id)
      : false;
    if (
      chartId
      && arr
      && arr.length
      && arr[0].ks_action_lines
      && arr[0].ks_action_lines.length
      && isViewList
    ) {
      for (let i = 0; i < arr[0].ks_action_lines.length + 1; i += 1) {
        res += `/${clickHistory[i]}`;
      }
    }
    return res;
  }

  const onExpandChart = () => {
    // console.log(cd);
    // if (cd) {
    let cData = chartValues.datasets && chartValues.datasets.length
      ? chartValues.datasets[0].data
      : [];
    let cLayout = {
      legend: {
        position: 'top',
      },
      labels: chartValues.labels,
      colors: chartValues.colors,
    };
    if (chartId) {
      if (chartItemType === 'ks_bar_chart') {
        cData = getDatasetsBar(
          chartItemValues.datasets,
          chartItemValues.labels,
        );
        cLayout = chartItemValues.datasets.length > 1
          ? { ...layoutExpand, showlegend: true }
          : layoutExpand;
      } else if (chartItemType === 'ks_horizontalBar_chart') {
        cData = getDatasetsHBar(
          chartItemValues.datasets,
          chartItemValues.labels,
        );
        cLayout = chartItemValues.datasets.length > 1
          ? { ...layoutExpand, showlegend: true }
          : layoutExpand;
      } else if (
        chartItemType === 'ks_pie_chart'
        || chartItemType === 'ks_doughnut_chart'
      ) {
        cData = getDatasetsPie(
          chartItemValues.datasets,
          chartItemValues.labels,
          false,
          chartItemType,
        );
        cLayout = { ...layoutExpand, showlegend: true };
      } else if (
        chartItemType === 'ks_line_chart'
        || chartItemType === 'ks_area_chart'
        || chartItemType === 'ks_polarArea_chart'
      ) {
        cData = getDatasetsLine(
          chartItemValues.datasets,
          chartItemValues.labels,
          false,
          chartItemType,
        );
        cLayout = chartItemValues.datasets.length > 1
          ? { ...layoutExpand, showlegend: true }
          : layoutExpand;
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
    let cData = getDatasetsPie(
      chartValues.datasets,
      chartValues.labels,
      chartValues.colors,
      chartData.ks_dashboard_item_type,
    );
    let cLayout = { ...layoutExpand, showlegend: true };
    if (chartId) {
      if (chartItemType === 'ks_bar_chart') {
        cData = getDatasetsBar(
          chartItemValues.datasets,
          chartItemValues.labels,
        );
        cLayout = chartItemValues.datasets.length > 1
          ? { ...layoutExpand, showlegend: true }
          : layoutExpand;
      } else if (chartItemType === 'ks_horizontalBar_chart') {
        cData = getDatasetsHBar(
          chartItemValues.datasets,
          chartItemValues.labels,
        );
        cLayout = chartItemValues.datasets.length > 1
          ? { ...layoutExpand, showlegend: true }
          : layoutExpand;
      } else if (
        chartItemType === 'ks_pie_chart'
        || chartItemType === 'ks_doughnut_chart'
      ) {
        cData = getDatasetsPie(
          chartItemValues.datasets,
          chartItemValues.labels,
          false,
          chartItemType,
        );
        cLayout = { ...layoutExpand, showlegend: true };
      } else if (
        chartItemType === 'ks_line_chart'
        || chartItemType === 'ks_area_chart'
        || chartItemType === 'ks_polarArea_chart'
      ) {
        cData = getDatasetsLine(
          chartItemValues.datasets,
          chartItemValues.labels,
          false,
          chartItemType,
        );
        cLayout = chartItemValues.datasets.length > 1
          ? { ...layoutExpand, showlegend: true }
          : layoutExpand;
      }
    }
    setDatasets(cData);
    setDataLayout(cLayout);
    // setShowModal(true);
    // }
  };

  const onExportChart = async (imageFileName, chartId) => {
    const actionDiv = document.getElementById(chartId);
    if (actionDiv) {
      actionDiv.style.display = 'none';
    }
    // const targetDiv = document.getElementById(`${chartData.id}-pie`);
    const targetDiv = document.getElementById(id);
    if (targetDiv) {
      const canvas = await html2canvas(targetDiv);
      const image = canvas.toDataURL('image/png', 3.0);
      downloadPNGImage(image, imageFileName, id);
    }
    if (actionDiv) {
      actionDiv.style.display = 'initial';
    }
    setAnchorEl(null);
    setExcelDownload(false);
  };

  const onExportChartExpand = async (imageFileName, chartId) => {
    const actionDiv = document.getElementById(chartId);
    if (actionDiv) {
      actionDiv.style.display = 'none';
    }
    const targetDiv = document.getElementById(`${chartData.id}-expand-pie`);
    if (targetDiv) {
      const canvas = await html2canvas(targetDiv);
      const image = canvas.toDataURL('image/png', 3.0);
      downloadPNGImage(image, imageFileName, id);
    }
    if (actionDiv) {
      actionDiv.style.display = 'initial';
    }
    setAnchorEl(null);
    setExcelDownload(false);
  };

  useEffect(() => {
    if (isViewList) {
      setShowModal(false);
      setDatasets([]);
      setDataLayout({});
    }
  }, [isViewList]);

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
    setFilterText('');
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

  // const pages = getPagesCountV2(totalDataCount, limit);

  const isDataValuExists = chartValues && chartValues.datasets && chartValues.datasets.length > 0;

  const isDataValue = isDataValuExists
    ? chartValues.datasets.filter((item) => item.data && item.data.length)
    : [];

  const isDataExists = isDataValue && isDataValue.length;

  const reHight = chartId ? 30 : 35;
  const customHeight = height; // - reHight;
  const customWidth = width - 20;

  const getToFixedTotal = (w) => {
    const total = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
    return total && parseFloat(total.toFixed(2));
  };

  const calHeight = divHeight ? divHeight - 50 : height * 28;

  const pieChartFixedTotal = (val) => parseFloat(val.toFixed(2));

  const getOriginalValue = (val, opts) => `${parseFloat(opts.w.config.series[opts.seriesIndex].toFixed(2))} (${parseFloat(val.toFixed(0))}%)`;

  const drillDownCharts = [
    'ks_bar_chart',
    'ks_line_chart',
    'ks_bar_multi_chart',
    'ks_bar_advance_chart',
    'ks_bar_chart',
    'ks_horizontalBar_chart',
  ];

  const isFontSize = dashboardUuid ? (chartData && (chartData.ks_info && isJsonString(chartData.ks_info) && getJsonString(chartData.ks_info).header_font_size)) : (chartData && chartData.ks_description && isJsonString(chartData.ks_description) && getJsonString(chartData.ks_description).header_font_size);

  const headFont = isFontSize && isFontSize ? isFontSize : false;

  const isDetail = dashboardUuid ? (chartData && (chartData.ks_info && isJsonString(chartData.ks_info) && getJsonString(chartData.ks_info).hide_detail_view && getJsonString(chartData.ks_info).hide_detail_view === 'yes'))
    : (chartData && chartData.ks_description && isJsonString(chartData.ks_description) && getJsonString(chartData.ks_description).hide_detail_view && getJsonString(chartData.ks_description).hide_detail_view === 'yes');

  const onFilterChange = (data) => {
    if (data && data.quickFilterValues && data.quickFilterValues.length && data.quickFilterValues[0].length > 1) {
      setSearchValue(data?.quickFilterValues?.[0]);
      setFilterText(formatFilterData(false, data?.quickFilterValues?.[0]));
    } else if (data.items && data.items.length) {
      if (valueCheck(data.items)) {
        const tColumns = customData && customData[chartData.ks_model_name] ? customData[chartData.ks_model_name] : [];
        data.items.map((dataItem1) => {
          const label = tColumns && tColumns.length && tColumns.filter((column) => column.property === dataItem1.field);
          dataItem1.value = dataItem1?.value ? dataItem1.value : '';
          dataItem1.header = label && label.length ? label[0].heading : '';
        });
        const uniqueCustomFilter = _.reverse(
          _.uniqBy(_.reverse([...data.items]), 'header'),
        );
        const filterData = { customFilters: uniqueCustomFilter };
        setCustomFilters(uniqueCustomFilter);
        setFilterText(formatFilterData(filterData, data?.quickFilterValues?.[0]));
        setPage(1);
        setOffset(0);
        setSearch(Math.random());
      }
    } else {
      setCustomFilters([]);
      setFilterText('');
      setSearchValue('');
      setPage(1);
      setOffset(0);
      setSearch(Math.random());
    }
    // setSearch(Math.random());
  };

  const debouncedOnFilterChange = React.useMemo(
    () => debounce((data) => {
      onFilterChange(data);
    }, 500),
    [],
  );

  return (
    <>
      {isDataExists ? (
        <>
          <div className="pie-chart-box">
            <StaticDataExport
              chartData={chartData}
              nextLevel={!!chartId}
              columnIndex={tableIndex1}
              sortOrder={tableOrder1}
              chartItems={chartId ? chartItemValues : false}
              isDownload={excelDownload}
              setExcelDownload={() => setExcelDownload(false)}
              isIOT={!!dashboardUuid}
            />
            <Box
              sx={{
                padding: `${height - 4}px ${height - 4}px ${height - 4
                }px ${height - 4}px`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              <h1
                style={{ fontSize: headFont || `${height + 3}px` }}
                className="pie-chart-text m-0"
              >
                {chartId ? getDrillName() : chartData.name}
              </h1>
              <div id={`chart-actions${chartData.id}`}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px',
                  }}
                >
                  {id && (
                  <>
                    <MuiTooltip title={<Typography>Download</Typography>}>
                      <IconButton
                        id="basic-button1"
                        onClick={handleClick}
                      >
                        <FiDownload
                          size={20}
                          cursor="pointer"
                          className="expand-icon mr-2"
                        />
                      </IconButton>
                    </MuiTooltip>
                    <Menu
                      id="basic-menu"
                      anchorEl={anchorEl}
                      open={openExport}
                      onClose={handleClose}
                      MenuListProps={{
                        'aria-labelledby': 'basic-button1',
                      }}
                    >
                      <MenuItem onClick={() => onExportChart(chartId ? getDrillText() : chartData.name, `chart-actions-${chartData.id}`)}>Image</MenuItem>
                      <MenuItem onClick={() => handleExcelDownload()}>
                        Excel
                      </MenuItem>
                    </Menu>
                  </>
                  )}
                  <MuiTooltip title={<Typography>Expand</Typography>}>
                    <IconButton
                      onClick={() => onExpandChart()}
                    >
                      <CgExpand
                        size={24}
                        cursor="pointer"
                        className="expand-icon mr-2"
                      />
                    </IconButton>
                  </MuiTooltip>
                  {chartId && (
                  <MuiTooltip title={<Typography>Reset</Typography>}>
                    <IconButton
                      onClick={() => onResetFull()}
                    >
                      <RestartAlt
                        onClick={() => onResetFull()}
                        size={15}
                        cursor="pointer"
                        className="expand-icon"
                      />
                    </IconButton>
                  </MuiTooltip>
                  )}
                </Box>
              </div>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
              }}
              id={`${chartData.id}-pie`}
            >
              <Box
                sx={{
                  height: '90%',
                  width: '90%',
                }}
              >
                <GetPieChart
                  chartId={chartId}
                  height={height}
                  showModal={showModal}
                  divHeight={divHeight}
                  isShowModal={isShowModal}
                  chartValues={chartValues}
                  onChartItemClickPoint={onChartItemClickPoint}
                  loading={loading}
                  chartItemType={chartItemType}
                  drillDownCharts={drillDownCharts}
                  isIot={!!dashboardUuid}
                  customHeight={customHeight}
                  chartItemValues={chartItemValues}
                  setTableOrder1={setTableOrder1}
                  setTableIndex1={setTableIndex1}
                  dType={getChartName(chartId ? chartItemType : chartData.ks_dashboard_item_type)}
                  chartData={chartData}
                  datasets={chartId && drillDownCharts.includes(chartItemType) ? getDatasetsApexBar(
                    chartItemValues.datasets,
                    false,
                    false,
                    chartItemType,
                  ) : []}
                />
              </Box>
            </Box>
          </div>
          <Dialog
            PaperProps={{
              sx: {
                width: '90vw',
                height: '95vh',
                maxWidth: 'none',
                maxHeight: 'none',
              },
            }}
            open={(showModal || isShowModal) && (!isViewList)}
          >
            <div className="pie-chart-box-expand">
              <Box
                sx={{
                  padding: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              >
                <h1 style={{ fontSize: '18px' }} className="pie-chart-text m-0">
                  {chartId ? getDrillName() : chartData.name}
                </h1>
                <div id={`chart-actions${chartData.id}`}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '2px',
                    }}
                  >
                    {id && (
                      <>
                        <MuiTooltip title={<Typography>Download</Typography>}>
                          <IconButton
                            id="basic-button2"
                            onClick={handleClick}
                          >
                            <FiDownload
                              size={20}
                            />
                          </IconButton>
                        </MuiTooltip>
                        <Menu
                          id="basic-menu"
                          anchorEl={anchorEl}
                          open={openExport}
                          onClose={handleClose}
                          MenuListProps={{
                            'aria-labelledby': 'basic-button2',
                          }}
                        >
                          <MenuItem onClick={() => onExportChartExpand(chartId ? getDrillText() : chartData.name, `chart-actions-${chartData.id}`)}>Image</MenuItem>
                          <MenuItem onClick={() => handleExcelDownload()}>
                            Excel
                          </MenuItem>
                        </Menu>
                      </>
                    )}
                    <MuiTooltip title={<Typography>Close</Typography>}>
                      <IconButton
                        onClick={() => onCloseExpand()}
                      >
                        <IoCloseOutline
                          size={25}
                          cursor="pointer mr-2"
                        />
                      </IconButton>
                    </MuiTooltip>
                    {chartId && (
                      <RestartAlt
                        onClick={() => onResetFull()}
                        size={15}
                        cursor="pointer"
                      />
                    )}
                  </Box>
                </div>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  height: '100%',
                }}
                id={`${chartData.id}-expand-pie`}
              >
                <Box
                  sx={{
                    height: '90%',
                    width: '90%',
                  }}
                >
                  <GetPieChart
                    chartId={chartId}
                    height={height}
                    showModal={showModal}
                    isShowModal={isShowModal}
                    divHeight={divHeight}
                    chartValues={chartValues}
                    onChartItemClickPoint={onChartItemClickPoint}
                    loading={loading}
                    chartItemType={chartItemType}
                    drillDownCharts={drillDownCharts}
                    customHeight={customHeight}
                    chartItemValues={chartItemValues}
                    dType={getChartName(chartId ? chartItemType : chartData.ks_dashboard_item_type)}
                    isIot={!!dashboardUuid}
                    chartData={chartData}
                    setTableOrder1={setTableOrder1}
                    setTableIndex1={setTableIndex1}
                    datasets={chartId && drillDownCharts.includes(chartItemType) ? getDatasetsApexBar(
                      chartItemValues.datasets,
                      false,
                      false,
                      chartItemType,
                    ) : []}
                  />
                </Box>
              </Box>
            </div>
          </Dialog>
        </>
      ) : (
        <>
          <p className="m-0 no-wrap-text">{chartData.name}</p>
          <ErrorContent isDashboard calHeight={calHeight} errorTxt="No information to be displayed." />
        </>
      )}
      <Drawer
        PaperProps={{
          sx: { width: '85%' },
        }}
        anchor="right"
        open={isViewList}
      >
        <DrawerHeader
          headerName={getTableDrillName()}
          imagePath={false}
          onClose={() => onReset()}
        />
        <div className="">
          {/* listDataMultipleInfo && listDataMultipleInfo.loading && (
            <div className="p-3 text-center">
              <Skeleton active />
            </div>
          ) */}
          <DynamicTableView
            columns={
              tableFields || (customData && customData[modelName] ? customData[modelName] : [])
            }
            data={
              listDataMultipleInfo
                && !listDataMultipleInfo.err
                && !listDataMultipleInfo.loading
                && listDataMultipleInfo.data
                ? listDataMultipleInfo.data
                : []
            }
            propertyAsKey="id"
            modelName={modelName}
            isIot={dashboardUuid}
            totalDataCount={totalDataCount}
            handlePageChange={handlePageChange}
            currentPage={page}
            reload={reload}
            setReload={setReload}
            setSearch={setSearch}
            setAllReport={setAllReport}
            isLargeReport={isLargeReport}
            setLargeReport={setLargeReport}
            exportReportData={exportReportData}
            hideDetail={isDetail}
            exportFileName={getTableDrillName()}
            filters={filterText}
            onFilterChanges={debouncedOnFilterChange}
          />
        </div>
        {/* loading || pages === 0 ? (<span />) : (
          <div className={`${classes.root} float-right`}>
            <Pagination count={pages} page={page} size="small" color="primary" onChange={handlePageClick} showFirstButton showLastButton />
          </div>
        )}
        {(listDataMultipleInfo && listDataMultipleInfo.err) && (
          <SuccessAndErrorFormat response={listDataMultipleInfo} />
        ) */}
      </Drawer>
      <Modal
        size="md"
        className="border-radius-50px modal-dialog-centered"
        isOpen={isViewTitle}
      >
        <ModalNoPadHead
          title={chartData.name}
          fontAwesomeIcon={faInfoCircle}
          closeModalWindow={() => setViewTitle(false)}
        />
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
  height: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]).isRequired,
  width: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]).isRequired,
  dashboardColors: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
    .isRequired,
};
export default PieChart;
