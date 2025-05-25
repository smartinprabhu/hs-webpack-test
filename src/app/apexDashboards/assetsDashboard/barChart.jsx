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
import { IoNavigateCircleOutline, IoCloseOutline } from 'react-icons/io5';
import html2canvas from 'html2canvas';
import {
  FiDownload, FiCalendar, FiEdit2, FiActivity,
} from 'react-icons/fi';
import * as Icons from '@fortawesome/free-solid-svg-icons';
import * as Icons1 from '@fortawesome/free-regular-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  Box,
  Dialog,
  ListItem,
  Typography,
  IconButton,
  ListItemButton,
} from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Card from '@mui/material/Card';
import { RestartAlt } from '@mui/icons-material';
import axios from 'axios';
import Drawer from '@mui/material/Drawer';
import CircularProgress from '@mui/material/CircularProgress';

import ModalNoPadHead from '@shared/modalNoPadHead';
import ErrorContent from '@shared/errorContent';
import MuiTooltip from '@shared/muiTooltip';
import PageLoader from '@shared/pageLoader';
import Loader from '@shared/loading';

import DrawerHeader from '../../commonComponents/drawerHeader';

import '../../analytics/nativeDashboard/nativeDashboard.scss';
import {
  getDatasetsBar,
  getDatasetsPie,
  getDatasetsHBar,
  getDatasetsLine,
  getDatasetsApexBarPreview,
  getDomainString,
  getIOTFields,
  get12Fields,
  getDynamicLayout,
  getDynamicLayoutTitle,
  getDatasetsApexBar,
  isModelExists,
  getActionLines,
  getDynamicLayoutWithoutTitle,
  getChartName,
} from '../utils/utils';
import customData from '../data/customData.json';
import { DateFilterButtons, AddThemeColor } from '../../themes/theme';
import StaticDataExport from './staticDataExport';
import {
  getTokenId,
  getColumnArrayById,
  titleCase,
  downloadPNGImage,
  isJsonString,
  getJsonString,
  getListOfModuleOperations,
  debounce,
  formatFilterData,
  queryGeneratorWithUtc,
  valueCheck,
} from '../../util/appUtils';
import {
  getNinjaDashboardItem,
  setCurrentDashboardItem,
  resetCurrentDashboardItem,
  updateDashboardLayouts,
  getNinjaDashboardTimer,
  getNinjaDashboardTimerDrill,
  resetUpdateDashboard,
  getNinjaCodeDrill,
  resetNinjaExpandCode,
  getNinjaCodeExpand,
} from '../../analytics/analytics.service';
import { updateDashboardData } from '../../helpdesk/actions';
import DashboardDrillView from './dashboardDrillView';

import {
  getExtraSelectionMultiple,
  getExtraSelectionMultipleCount,
} from '../../helpdesk/ticketService';
import DynamicTableView from './dynamicTableView';
import GetBarChart from '../utils/getBarChart';
import AuthService from '../../util/authService';
import SingleCardNumeric from './cardsElements/singleCardNumeric';
import MixedCardPreview from './cardsElements/mixedCardPreview';
import Configuration from './settings/configuration';
import HeatMap from './heatMap';
import TreeDashboard from '../../treeDashboards/dashboardDrill';

const iconList = Object.keys(Icons)
  .filter((key) => key !== 'fas' && key !== 'prefix')
  .map((icon) => Icons[icon]);

const iconList1 = Object.keys(Icons1)
  .filter((key) => key !== 'far' && key !== 'prefix')
  .map((icon) => Icons1[icon]);

library.add(...iconList);
library.add(...iconList1);

const appModels = require('../../util/appModels').default;

const appConfig = require('../../config/appConfig').default;

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const BarChart = React.memo((props) => {
  const {
    chartData,
    height,
    code,
    selectedDateTag,
    customDateValue,
    width,
    dashboardColors,
    chartCode,
    dashboardUuid,
    dashboardCode,
    isShowModal,
    setChildShow,
    isDrill,
    advanceFilter,
    isIAQ,
    isIot,
    id,
    divHeight,
    editMode,
    setDashboardCode,
  } = props;
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const openExport = Boolean(anchorEl);

  const [domainData, setDomain] = useState([]);
  const [chartId, setChartId] = useState(false);
  const [chartSequence, setSequence] = useState(0);
  const [active, setActive] = useState('idle');
  const [reload, setReload] = useState(false);
  const [domainsList, setDomainsList] = useState([]);
  const [clickHistory, setClickHistory] = useState([]);

  const [isViewList, setViewList] = useState(false);
  const [modelName, setModel] = useState(false);
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(0);

  const [chartDatasets, setDatasets] = useState([]);
  const [dataLayout, setDataLayout] = useState({});
  const [showModal, setShowModal] = useState(false);

  const [searchValue, setSearchValue] = useState('');
  const [isSearch, setSearch] = useState(false);
  const [customFilters, setCustomFilters] = useState('');
  const [isViewTitle, setViewTitle] = useState(false);

  const [isUpdateLoad, setIsUpdateLoad] = useState(false);

  const [selectedDataset, setSelectedDataset] = useState('');
  const [isDataFilter, showDateFilter] = useState(false);
  const [subDateFilter, setSubDateFilter] = useState(false);

  const [excelDownload, setExcelDownload] = useState(false);

  const [isEdit, setEdit] = useState(false);
  const [isMixedEdit, setMixedEdit] = useState(false);
  const [isAllReport, setAllReport] = useState(false);
  const [exportReportData, setExportReportData] = useState(false);
  const [isLargeReport, setLargeReport] = useState(false);

  const [isNavigate, setIsNavigate] = useState(false);

  const [dashboardColorsList, setDashboardColors] = useState([]);

  const [dateGroupData, setDateGroupData] = useState({ loading: false, data: null, err: null });

  const [showNavigate, setShowNavigate] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [customFilter, setCustomFilter] = useState([]);

  const [treeModal, setTreeModal] = useState(false);
  const [treeUuid, setTreeUuid] = useState(false);
  const [treeCode, setTreeCode] = useState(false);
  const [v16Modal, setV16Modal] = useState(false);
  const [v12Modal, setV12Modal] = useState(false);

  const WEBAPPAPIURL = `${appConfig.WEBAPIURL}/`;

  const { sortedValueDashboard } = useSelector((state) => state.equipment);

  const authService = AuthService();

  const limit = 10;

  const v16Fields = isIot ? (chartData && (chartData.ks_info && isJsonString(chartData.ks_info) && getJsonString(chartData.ks_info).list_fields)) : (chartData && chartData.ks_description && isJsonString(chartData.ks_description) && getJsonString(chartData.ks_description).list_fields);

  const tableFields = isIot ? (chartData && (chartData.ks_info && isJsonString(chartData.ks_info) && getJsonString(chartData.ks_info).table_fields)) : (chartData && chartData.ks_description && isJsonString(chartData.ks_description) && getJsonString(chartData.ks_description).table_fields);

  const handlePageChange = (pages) => {
    const offsetValue = pages * limit;
    setOffset(offsetValue);
    setPage(page);
  };

  const { userInfo, userRoles } = useSelector((state) => state.user);

  const userCompany = userInfo.data
    && userInfo.data.company ? userInfo.data.company : false;

  const allowedOperations = getListOfModuleOperations(
    userRoles && userRoles.data ? userRoles.data.allowed_modules : [],
    'Dashboards',
    'code',
  );

  const isEditable = allowedOperations.includes('edit_ninja_dashboard');

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

  const layout = customData.customLayout;

  const config = customData.customConfig;

  const pieLayout = customData.customLayoutPie;

  const layoutExpand = customData.customLayoutExpand;

  let chartValues = chartData && chartData.ks_chart_data && isJsonString(chartData.ks_chart_data)
    ? getJsonString(chartData.ks_chart_data)
    : false;

  const sortedActions = (actionsData) => actionsData.sort((a, b) => a.sequence - b.sequence);

  const {
    ninjaDashboardItem, ninjaDashboard, selectedDashboard, updateLayoutInfo,
    ninjaDrillCode, ninjaDashboardExpandCode,
  } = useSelector((state) => state.analytics);
  const {
    listDataMultipleInfo,
    listDataMultipleCountInfo,
    listDataMultipleCountLoading,
    cxoDashboardLevels,
  } = useSelector((state) => state.ticket);

  const totalDataCount = listDataMultipleCountInfo && listDataMultipleCountInfo.length
    ? listDataMultipleCountInfo.length
    : 0;

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

  const timeZone = userInfo.data
    && userInfo.data.timezone ? userInfo.data.timezone : 'Asia/Calcutta';

  function getChartOptions() {
    let res = false;
    if (dashboardColors && dashboardColors.length) {
      const dClrs = [...dashboardColors];
      if (dClrs && dClrs.length && chartData && chartData.id) {
        const resu = isIot
          ? dClrs.filter((item) => item.id === chartData.id && item.dashboard_item_json && Object.keys(item.dashboard_item_json).length > 0)
          : dClrs.filter((item) => item.id === chartData.id && item.dashboard_item_json && isJsonString(item.dashboard_item_json));
        if (!isIot && resu && resu.length && isJsonString(resu[0].dashboard_item_json)) {
          res = getJsonString(resu[0].dashboard_item_json);
        } else if (isIot && resu && resu.length && resu[0].dashboard_item_json && Object.keys(resu[0].dashboard_item_json).length > 0) {
          res = resu[0].dashboard_item_json;
        }
      }
    }
    return res;
  }

  function getDateGroupData(dateGroupName) {
    setDateGroupData({ loading: true, data: null, err: null });
    const cData = JSON.parse(JSON.stringify(chartData));
    cData.ks_chart_date_groupby = dateGroupName;
    cData.ks_graph_preview = 'Graph Preview';
    cData.ks_chart_data = JSON.stringify(chartValues);
    const data = JSON.stringify({
      method: 'call',
      params: {
        args: [
          [cData.id],
          cData,
          'ks_chart_date_groupby',
          {
            ks_chart_data: '',
          },
          {
            lang: 'en_US',
            tz: timeZone,
            uid: userInfo && userInfo.data ? userInfo.data.id : '',
            active_model: 'ks_dashboard_ninja.board',
            active_id: code,
            active_ids: [
              code,
            ],
            search_default_ks_dashboard_ninja_board_id: code,
            search_disable_custom_filters: true,
            default_ks_dashboard_ninja_board_id: code,
            current_id: cData.id,
          },
        ],
        model: 'ks_dashboard_ninja.item',
        method: 'onchange',
        kwargs: {},
      },
    });

    const configs = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${WEBAPPAPIURL}web/dataset/call_kw/ks_dashboard_ninja.item/onchange`,
      headers: {
        'Content-Type': 'application/json',
        // Authorization: `Bearer ${authService.getAccessToken()}`,
        endpoint: window.localStorage.getItem('api-url'),
      },
      data,
      withCredentials: true,
    };
    axios(configs)
      .then((response) => {
        if (response.data.result && response.data.result.value) {
          setDateGroupData({ loading: false, data: response.data.result.value, err: null });
        } else {
          setDateGroupData({ loading: false, data: null, err: 'failed' });
        }
      })
      .catch((error) => {
        setDateGroupData({ loading: false, data: null, err: error });
      });
  }

  async function getDateGroupDataIOT(dateGroupName) {
    const tokenId = await getTokenId();
    setDateGroupData({ loading: true, data: null, err: null });
    const cData = { ...chartData };
    cData.ks_chart_date_groupby = dateGroupName;
    cData.ks_graph_preview = 'Graph Preview';
    cData.ks_chart_data = JSON.stringify(chartValues);
    delete cData.action;
    delete cData.ks_chart_relation_groupby_field_type;
    delete cData.ks_chart_relation_groupby_name;
    delete cData.ks_chart_relation_sub_groupby_field_type;
    delete cData.ks_company;
    delete cData.ks_currency_position;
    delete cData.ks_currency_symbol;
    delete cData.ks_dashboard_id;
    delete cData.ks_data_formatting;
    delete cData.ks_goal_liness;
    delete cData.ks_model_display_name;
    delete cData.max_sequnce;
    delete cData.ks_hx_group_id;
    const data = {
      uuid: dashboardUuid,
      token: tokenId,
      method: 'call',
      params: {
        args: [
          [chartData.id],
          cData,
          'ks_chart_date_groupby',
          {
            ks_chart_data: '',
            ks_graph_preview: '',
            ks_multi_chart_date_groupby: '',
            ks_graph_status_records: 1,
            'ks_graph_status_records.ks_color_picker_id': 1,
            'ks_graph_status_records.name': '',
            'ks_graph_status_records.value': '',
          },
        ],
        kwargs: {
          context: {
            lang: 'en_US',
            tz: timeZone,
            uid: userInfo && userInfo.data ? userInfo.data.id : '',
            active_model: 'ks_dashboard_ninja.board',
            active_id: code,
            active_ids: [
              code,
            ],
            group_by: 'ks_dashboard_ninja_board_id',
            search_default_ks_dashboard_ninja_board_id: code,
            search_disable_custom_filters: true,
            default_ks_dashboard_ninja_board_id: code,
            current_id: chartData.id,
          },
        },
        model: 'ks_dashboard_ninja.item',
        method: 'onchange',
      },
    };

    const configs = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${WEBAPPAPIURL}public/api/v4/ninjadashboard/onchange`,
      headers: {
        'Content-Type': 'application/json',
        // Authorization: `Bearer ${authService.getAccessToken()}`,
        endpoint: window.localStorage.getItem('api-url'),
        ioturl: window.localStorage.getItem('iot_url'),
      },
      data,
      withCredentials: true,
    };
    axios(configs)
      .then((response) => {
        if (response.data && response.data.result && response.data.result.data && response.data.result.data.result && response.data.result.data.result.value) {
          setDateGroupData({ loading: false, data: response.data.result.data.result.value, err: null });
        } else {
          setDateGroupData({ loading: false, data: null, err: 'failed' });
        }
      })
      .catch((error) => {
        setDateGroupData({ loading: false, data: null, err: error });
      });
  }

  if (dateGroupData && dateGroupData.data) {
    const chartValuesFiltered = dateGroupData.data.ks_chart_data ? JSON.parse(dateGroupData.data.ks_chart_data) : false;
    if (chartValuesFiltered) {
      chartValuesFiltered.colors = chartValues.colors;
      chartValuesFiltered.subcolors = chartValues.subcolors;
    }
    chartValues = chartValuesFiltered;
  }

  useEffect(() => {
    dispatch(resetUpdateDashboard());
  }, []);

  useEffect(() => {
    if (isNavigate && ninjaDrillCode && !ninjaDrillCode.loading && ninjaDrillCode.data && ninjaDrillCode.data.length) {
      if (setDashboardCode) {
        dispatch(updateDashboardData([...cxoDashboardLevels, ...[{ code: ninjaDrillCode.data[0].code ? ninjaDrillCode.data[0].code.replace('V3', '') : '', name: ninjaDrillCode.data[0].name }]]));
        setDashboardCode(ninjaDrillCode.data[0].code ? ninjaDrillCode.data[0].code.replace('V3', '') : '');
        setIsNavigate(false);
      }
    }
  }, [isNavigate, ninjaDrillCode]);

  useEffect(() => {
    setDashboardColors(dashboardColors);
  }, [dashboardColors]);

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
      setSelectedDataset('');
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
      setDomain([]);
      setDomainsList([]);
      setClickHistory([]);
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
    if (isIot) {
      res = encodeURIComponent(getDomainString(JSON.stringify(domainData), searchValue, modelName, customFilters ? queryGeneratorWithUtc(customFilters, false, userInfo.data) : ''));
    }
    return res;
  }

  useEffect(() => {
    if (modelName && isViewList) {
      const fields = customData && customData[modelName]
        ? getColumnArrayById(customData[modelName], 'property')
        : [];
      const iotFields = modelName && getIOTFields(modelName, v16Fields) ? getIOTFields(modelName, v16Fields) : false;
      const new12Fields = modelName && get12Fields(modelName, v16Fields) ? get12Fields(modelName, v16Fields) : fields;
      const newFields = iotFields || fields;
      dispatch(
        getExtraSelectionMultiple(
          false,
          modelName,
          limit,
          offset,
          isIot ? newFields : new12Fields,
          getDomainData(),
          false,
          modelName && get12Fields(modelName, v16Fields) ? 'search' : false,
          isIot,
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
      const new12Fields = modelName && get12Fields(modelName, v16Fields) ? get12Fields(modelName, v16Fields) : fields;
      const iotFields = modelName && getIOTFields(modelName, v16Fields) ? getIOTFields(modelName, v16Fields) : false;
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
          modelName && get12Fields(modelName, v16Fields) ? 'search' : false,
          !!dashboardUuid,
          dashboardUuid,
          sortedValueDashboard,
        ),
      );
    }
  }, [isAllReport]);

  useEffect(() => {
    if (modelName && isViewList && isAllReport) {
      const fields = customData && customData[modelName]
        ? getColumnArrayById(customData[modelName], 'property')
        : [];
      const new12Fields = modelName && get12Fields(modelName, v16Fields) ? get12Fields(modelName, v16Fields) : fields;
      const iotFields = modelName && getIOTFields(modelName, v16Fields) ? getIOTFields(modelName, v16Fields) : false;
      const newFields = iotFields || fields;
      setExportReportData({
        totalRecords: totalDataCount, modelName, modelFields: dashboardUuid ? newFields : new12Fields, searchType: modelName && get12Fields(modelName, v16Fields) ? 'search' : false, downloadType: 'Standard API',domain:getDomainData()
      });
    }
  }, [isLargeReport]);

  useEffect(() => {
    if (modelName && isViewList) {
      const fields = customData && customData[modelName]
        ? getColumnArrayById(customData[modelName], 'property')
        : [];
      const iotFields = modelName && getIOTFields(modelName) ? getIOTFields(modelName) : false;
      const newFields = iotFields || fields;
      dispatch(
        getExtraSelectionMultipleCount(
          false,
          modelName,
          isIot ? newFields : fields,
          encodeURIComponent(getDomainString(JSON.stringify(domainData), searchValue, modelName, customFilters ? queryGeneratorWithUtc(customFilters, false, userInfo.data) : '')),
          'search',
          isIot,
          dashboardUuid,
        ),
      );
    }
  }, [modelName, isViewList, isSearch]);

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

  function getDateDomainProps(field, arr, operator) {
    let res = '';
    const data = arr.filter((item) => item.field === field && item.operator === operator);
    if (data && data.length) {
      res = data[0].value;
    }
    console.log(res);
    return res;
  }

  function extractConditions(domain) {
    const conditions = [];
    let i = 0;

    while (i < domain.length) {
      const clause = domain[i];

      if (Array.isArray(clause) && clause.length === 3) {
        const [fieldName, operator, value] = clause;
        conditions.push({ field: fieldName, operator, value });
      } else if (Array.isArray(clause) && (clause.length === 2)) {
        const [logicalOperator, nestedDomain] = clause;
        if (logicalOperator === '&' || logicalOperator === '|') {
          const logicalOperatorString = logicalOperator === '&' ? 'AND' : 'OR';
          const subConditions = extractConditions(nestedDomain);
          conditions.push({ operator: logicalOperatorString, conditions: subConditions });
        }
      }

      i++;
    }

    return conditions;
  }

  function getDateFilterField() {
    let res = 'create_date';
    const arr = dashboardColors && dashboardColors.length ? dashboardColors.filter((item) => item.id === chartData.id) : false;
    if (arr && arr.length && arr[0].ks_date_filter_field) {
      res = arr[0].ks_date_filter_field.name;
    }
    return res;
  }

  const getToFixedTotal = (w) => {
    const total = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
    return total && total.toFixed(2);
  };

  const pieChartFixedTotal = (val) => val.toFixed(2);

  const getOriginalValue = (val, opts) => `${opts.w.config.series[opts.seriesIndex].toFixed(2)} (${val.toFixed(0)}%)`;

  // const chartItemData = ninjaDashboardItem && ninjaDashboardItem.data ? ninjaDashboardItem.data : {};

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
  const updateLoading = updateLayoutInfo && updateLayoutInfo.loading;

  function getUniqueArr(arr) {
    const res = [...new Map(arr.map((item) => [item.id, item])).values()];
    return res;
  }

  const onChartItemClickPoint = (configs) => {
    try {
      if (!chartData) return;

      dispatch(setCurrentDashboardItem(chartCode));

      const actLines = isIot && ninjaDashboard && ninjaDashboard.data
        ? ninjaDashboard.data.ks_dashboard_items_ids
        : dashboardColorsList;

      const maxSequence = chartData.max_sequnce && chartData.max_sequnce === 'Attribute: max_sequnce does not exist.'
        ? getActionLines(actLines, chartData.id).length
        : chartData.max_sequnce || 0;

      const { dataPointIndex, seriesIndex, w } = configs;

      const allSeries = w?.config?.series || [];
      const seriesNames = allSeries.map((s) => s.name).filter(Boolean);
      const uniqueSeriesNames = [...new Set(seriesNames)];

      // Determine if we should use seriesName
      const shouldUseSeriesName = uniqueSeriesNames.length > 1;

      const seriesName = w.config.series?.[seriesIndex]?.name;
      const category = w.config.xaxis?.categories?.[dataPointIndex];

      // Compute label
      const label = shouldUseSeriesName && seriesName && seriesName !== 'Count' ? seriesName : category;

      // Utility: Update click history based on drill level
      const updateClickHistory = (labels, level) => {
        setClickHistory((prev) => {
          const next = [...prev];
          next[level] = labels;
          return next.slice(0, level + 1);
        });
      };

      const currentElement = dataPointIndex;

      if (maxSequence > 0 && getUniqueArr(domainsList).length < maxSequence) {
        if (!chartId) {
        // First level click
          setChartId(chartData.id);
          setDomain(chartValues.domains[currentElement]);

          const listData = [{ id: 0, data: chartValues.domains[currentElement] }];
          setDomainsList(listData);

          updateClickHistory(label, 0); // <-- update level 0
        } else {
        // Drill down to next level
          const nextSequence = chartSequence + 1;

          setSequence(nextSequence);
          setDomain(chartItemValues.domains[currentElement]);

          const listData = [{ id: nextSequence, data: chartItemValues.domains[currentElement] }];
          setDomainsList([...domainsList, ...listData]);

          updateClickHistory(label, nextSequence); // <-- update level N
        }
      } else {
      // Deepest level: apply further filtering
        const chartDomainList = chartId && chartSequence > -1 && chartItemValues ? chartItemValues : chartValues;

        if (
          chartDomainList.domains[currentElement]
        && chartDomainList.domains[currentElement].length
        && isModelExists(chartData.ks_model_name, v16Fields)
        && !chartData.ks_restrict_drilldown
        ) {
          const nextSequence = chartSequence + 1;

          setSequence(nextSequence);

          if (!chartId) {
            setChartId(chartData.id);
          }

          if (chartData.ks_data_calculation_type === 'custom') {
            setDomain(chartDomainList.domains[currentElement]);

            const listData = [{ id: nextSequence, data: chartDomainList.domains[currentElement] }];
            setDomainsList([...domainsList, ...listData]);

            updateClickHistory(label, nextSequence); // <-- update level N

            if (isModelExists(chartData.ks_model_name, v16Fields) && !chartData.ks_restrict_drilldown) {
              setViewList(true);
              setModel(chartData.ks_model_name);
            }
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

  function getSelectedData(data, key) {
    let result = [];
    const arr = data.filter((item) => item.label === key);
    if (arr && arr.length) {
      result = arr;
    }
    return result;
  }
  function getChartColors(key) {
    let result = [];
    // const arr = dashboardColors && dashboardColors.length ? dashboardColors.filter((item) => item.id === key) : false;
    if (key && chartValues) {
      // if (arr[0].ks_graph_status_records && arr[0].ks_graph_status_records.length) {
      result = chartValues.colors;
      // }
    }
    return result;
  }

  useEffect(() => {
    if (showModal && !chartId) {
      setDatasets(
        getDatasetsBar(
          chartValues.datasets,
          chartValues.labels,
          getChartColors(chartData.id),
          chartValues.subcolors,
          chartValues.tooltip_dataset ? chartValues.tooltip_dataset : false,
        ),
      );
      setDataLayout(
        getDynamicLayout(
          chartValues,
          chartData,
          layoutExpand,
          chartData.x_axis_label,
        ),
      );
    }
  }, [showModal, chartData]);

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

  function getTableDrillName() {
    let res = chartData.name;
    const arr = dashboardColorsList && dashboardColorsList.length
      ? dashboardColorsList.filter((item) => item.id === chartData.id)
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
      // res = arr[0].ks_action_lines[chartSequence].ks_item_action_field && arr[0].ks_action_lines[chartSequence].ks_item_action_field.field_description ? arr[0].ks_action_lines[chartSequence].ks_item_action_field.field_description : chartData.name;
    }
    return res;
  }

  const onExpandChart = () => {
    // console.log(cd);
    // if (cd) {
    let cData = getDatasetsBar(
      chartValues.datasets,
      chartValues.labels,
      getChartColors(chartData.id),
      chartValues.subcolors,
      chartValues.tooltip_dataset ? chartValues.tooltip_dataset : false,
    );
    let cLayout = getDynamicLayout(
      chartValues,
      chartData,
      layoutExpand,
      chartData.x_axis_label,
    );
    if (chartId) {
      if (chartItemType === 'ks_bar_chart') {
        cData = getDatasetsBar(
          chartItemValues.datasets,
          chartItemValues.labels,
        );
        cLayout = getDynamicLayout(
          chartItemValues,
          chartData,
          layoutExpand,
          getDrillText(),
        );
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
        cLayout = getDynamicLayout(
          chartItemValues,
          chartData,
          layoutExpand,
          getDrillText(),
        );
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
    let cData = getDatasetsBar(
      chartValues.datasets,
      chartValues.labels,
      getChartColors(chartData.id),
      chartValues.subcolors,
      chartValues.tooltip_dataset ? chartValues.tooltip_dataset : false,
    );
    let cLayout = getDynamicLayout(
      chartValues,
      chartData,
      layoutExpand,
      chartData.x_axis_label,
    );
    if (chartId) {
      if (chartItemType === 'ks_bar_chart') {
        cData = getDatasetsBar(
          chartItemValues.datasets,
          chartItemValues.labels,
        );
        cLayout = getDynamicLayout(
          chartItemValues,
          chartData,
          layoutExpand,
          getDrillText(),
        );
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
        cLayout = getDynamicLayout(
          chartItemValues,
          chartData,
          layoutExpand,
          getDrillText(),
        );
      }
    }
    setDatasets(cData);
    setDataLayout(cLayout);
    // setShowModal(true);
    // }
  };

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
    setDomain([]);
    setDomainsList([]);
    setClickHistory([]);
    setViewList(false);
    setModel(false);
    setDomain(false);
    setOffset(0);
    setPage(1);
    if (showModal) {
      setDatasets(
        getDatasetsBar(
          chartValues.datasets,
          chartValues.labels,
          getChartColors(chartData.id),
          chartValues.subcolors,
          chartValues.tooltip_dataset ? chartValues.tooltip_dataset : false,
        ),
      );
      setDataLayout(
        getDynamicLayout(
          chartValues,
          chartData,
          layoutExpand,
          chartData.x_axis_label,
        ),
      );
    }
  };

  function getDrillName() {
    const res = [];
    const arr = dashboardColorsList && dashboardColorsList.length
      ? dashboardColorsList.filter((item) => item.id === chartData.id)
      : false;
    if (
      chartId
      && arr
      && arr.length
      && arr[0].ks_action_lines
      && arr[0].ks_action_lines.length
      && sortedActions(arr[0].ks_action_lines)[chartSequence]
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

  useEffect(() => {
    if (updateLayoutInfo && updateLayoutInfo.data && code && isUpdateLoad) {
      setIsUpdateLoad(false);
      const context = {
        ksDateFilterEndDate: false,
        ksDateFilterSelection: chartData.ks_date_filter_selection,
        ksDateFilterStartDate: false,
      };

      dispatch(resetUpdateDashboard());
      if (isDrill) {
        dispatch(
          getNinjaDashboardTimerDrill(
            'ks_fetch_dashboard_data',
            appModels.NINJABOARD,
            code,
            context,
            dashboardUuid ? 'IOT' : false,
            dashboardCode,
            dashboardUuid,
            userCompany,
          ),
        );
      } else {
        if (!isDrill) {
          if (advanceFilter) {
            context.ksDomain = advanceFilter;
          } else if (dashboardUuid) {
            const companyId = userInfo
              && userInfo.data
              && userInfo.data.company
              && userInfo.data.company.id
              ? userInfo.data.company.id
              : '';
            // context.ksDomain = `[('db_company_id.id','=',${companyId})]`;
          }
        }
        dispatch(
          getNinjaDashboardTimer(
            'ks_fetch_dashboard_data',
            appModels.NINJABOARD,
            code,
            context,
            dashboardUuid ? 'IOT' : false,
            dashboardCode,
            dashboardUuid,
            userCompany,
          ),
        );
      }
    }
  }, [updateLayoutInfo]);

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

  const detailDataDefault = (chartData && ((chartData.ks_info && isJsonString(chartData.ks_info) && getJsonString(chartData.ks_info)) || (chartData.ks_description && isJsonString(chartData.ks_description) && getJsonString(chartData.ks_description))));

  const onExportChart = async (imageFileName, chartId) => {
    const actionDiv = document.getElementById(chartId);
    if (actionDiv) {
      actionDiv.style.display = 'none';
    }
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
    const targetDiv = document.getElementById(`${id}-bar-expand`);
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

  const onViewTitle = () => {
    setViewTitle(true);
  };

  const onReset = () => {
    const maxSequence = chartData.max_sequnce === 'Attribute: max_sequnce does not exist.'
      ? getActionLines(dashboardColorsList, chartData.id).length
      : chartData.max_sequnce;
    if (chartSequence > 0 && maxSequence && maxSequence > 0) {
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

  const onCloseTreeDashboard = () => {
    setTreeModal(false);
    setTreeUuid(false);
    setTreeCode(false);
  };

  const onClose16Dashboard = () => {
    setV16Modal(false);
    setTreeUuid(false);
    setTreeCode(false);
  };

  const onClose12Dashboard = () => {
    setV12Modal(false);
    dispatch(resetNinjaExpandCode());
  };

  const onDateGroupChange = (id, dateValue) => {
    setSubDateFilter(dateValue);
    if (isIot) {
      getDateGroupDataIOT(dateValue);
    } else {
      getDateGroupData(dateValue);
    }
    showDateFilter(false);
    /* if (id) {
      const postData = {
        ks_dashboard_items_ids: [[1, id, { ks_chart_date_groupby: dateValue }]],
      };
      showDateFilter(false);
      setIsUpdateLoad(true);
      dispatch(
        updateDashboardLayouts(
          code,
          appModels.NINJABOARD,
          postData,
          dashboardUuid ? 'IOT' : false,
          dashboardUuid,
        ),
      );
    } */
  };

  const onClickDataCard = () => {
    const isNavigation = isIot ? (chartData && (chartData.ks_info && isJsonString(chartData.ks_info) && getJsonString(chartData.ks_info).navigation && getJsonString(chartData.ks_info).navigation.type && getJsonString(chartData.ks_info).navigation.type === 'card'))
      : (chartData && chartData.ks_description && isJsonString(chartData.ks_description) && getJsonString(chartData.ks_description).navigation && getJsonString(chartData.ks_description).navigation.type && getJsonString(chartData.ks_description).navigation.type === 'card');
    if (isNavigation) {
      const navigation = isIot ? (chartData && (chartData.ks_info && isJsonString(chartData.ks_info) && getJsonString(chartData.ks_info).navigation && getJsonString(chartData.ks_info).navigation))
        : (chartData && chartData.ks_description && isJsonString(chartData.ks_description) && getJsonString(chartData.ks_description).navigation && getJsonString(chartData.ks_description).navigation);
      if (navigation && navigation.navigate_to === 'tree') {
        setTreeModal(true);
        setTreeUuid(navigation.uuid);
        setTreeCode(navigation.code ? navigation.code : false);
      } else if (navigation && navigation.navigate_to === 'v16') {
        setV16Modal(true);
        setTreeUuid(navigation.uuid);
        setTreeCode(navigation.code ? navigation.code : false);
      } else if (navigation && navigation.navigate_to === 'v12') {
        setV12Modal(true);
        dispatch(resetNinjaExpandCode());
        dispatch(getNinjaCodeExpand(navigation.code, appModels.NINJABOARD));
      }
    }
  };

  const isHeader = isIot ? (chartData && (chartData.ks_info && isJsonString(chartData.ks_info) && getJsonString(chartData.ks_info).card_header))
    : (chartData && chartData.ks_description && isJsonString(chartData.ks_description) && getJsonString(chartData.ks_description).card_header);

  function isJsonValue(opt, field1, field2) {
    let res = false;
    if (opt && isJsonString(opt) && getJsonString(opt) && getJsonString(opt)[field1] && getJsonString(opt)[field1][field2]) {
      res = getJsonString(opt)[field1][field2];
    }
    return res;
  }

  // const pages = getPagesCountV2(totalDataCount, limit);

  const isDataValuExists = chartValues && chartValues.datasets && chartValues.datasets.length > 0;

  const isDataValue = isDataValuExists
    ? chartValues.datasets.filter((item) => item.data && item.data.length)
    : [];

  const isDataExists = isDataValue && isDataValue.length;

  const initHeight = chartData.ks_chart_date_groupby ? 40 : 10;

  const reHight = chartId ? 30 : initHeight;
  const customHeight = height; // - reHight;
  // const customWidth = width - 20;
  const GroupByComponent = () => (
    <>
      {!(isIot && chartData.ks_info && isJsonString(chartData.ks_info) && getJsonString(chartData.ks_info).show_daterange === 'false') && (
        <MuiTooltip
          title={(
            <Typography>
              Group By
              {' ( '}
              {subDateFilter ? titleCase(subDateFilter) : titleCase(chartData.ks_chart_date_groupby)}
              {' ) '}
            </Typography>
          )}
        >
          <IconButton
            onClick={() => showDateFilter(true)}
          >
            <FiCalendar
              size={20}
              cursor="pointer"
              className="expand-icon"
            />
          </IconButton>
        </MuiTooltip>
      )}
      <span className="selected-chart-filter mr-3">
        <span style={{ fontSize: `${height + 2}px` }}>
          {subDateFilter ? titleCase(subDateFilter) : titleCase(chartData.ks_chart_date_groupby)}
        </span>
      </span>
    </>
  );

  const DropdownComponent = () => (
    <Box
      sx={{
        display: 'flex',
        gap: '10px',
        marginRight: '10px',
      }}
    >
      <FormControl
        size="small"
        sx={{
          width: 120,
        }}
      >
        <InputLabel id="demo-simple-select-label">Building</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Building"
        >
          <MenuItem value="building">Building 1</MenuItem>
        </Select>
      </FormControl>
      <FormControl
        size="small"
        sx={{
          width: 120,
        }}
      >
        <InputLabel id="demo-simple-select-label">Floor</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Floor"
        >
          <MenuItem value="floor">Floor 1</MenuItem>
        </Select>
      </FormControl>
      <FormControl
        size="small"
        sx={{
          width: 120,
        }}
      >
        <InputLabel id="demo-simple-select-label">Room</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Room"
        >
          <MenuItem value="building">Room 1</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );

  const drillDownCharts = [
    'ks_bar_chart',
    'ks_area_chart',
    'ks_line_chart',
    'ks_bar_multi_chart',
    'ks_bar_advance_chart',
    'ks_bar_chart',
    'ks_horizontalBar_chart',
  ];

  const onCloseExpand = () => {
    setShowModal(false);
    if (setChildShow) setChildShow();
    setDatasets([]);
    setDataLayout({});
  };

  const onNavigateDashboard = () => {
    if (
      chartData.ks_action_type === 'dashboard'
      && chartData.action_ks_dashboard_ninja_board_id
    ) {
      dispatch(
        getNinjaCodeDrill(
          chartData.action_ks_dashboard_ninja_board_id,
          appModels.NINJABOARD,
          isIot,
          dashboardUuid,
        ),
      );
      setIsNavigate(true);
    }
  };

  const calHeight = divHeight ? divHeight - 50 : height * 28;

  const isFontSize = isIot ? (chartData && (chartData.ks_info && isJsonString(chartData.ks_info) && getJsonString(chartData.ks_info).header_font_size)) : (chartData && chartData.ks_description && isJsonString(chartData.ks_description) && getJsonString(chartData.ks_description).header_font_size);

  const headFont = isFontSize && isFontSize ? isFontSize : false;

  const isDetail = isIot ? (chartData && (chartData.ks_info && isJsonString(chartData.ks_info) && getJsonString(chartData.ks_info).hide_detail_view && getJsonString(chartData.ks_info).hide_detail_view === 'yes'))
    : (chartData && chartData.ks_description && isJsonString(chartData.ks_description) && getJsonString(chartData.ks_description).hide_detail_view && getJsonString(chartData.ks_description).hide_detail_view === 'yes');

  const isShowTimeOnly = (chartData && ((chartData.ks_info && isJsonString(chartData.ks_info) && getJsonString(chartData.ks_info).show_time_only === 'true') || (chartData.ks_description && isJsonString(chartData.ks_description) && getJsonString(chartData.ks_description).show_time_only === 'true')));
  const isHeatMap = (chartData && ((chartData.ks_info && isJsonString(chartData.ks_info) && getJsonString(chartData.ks_info).heat_map_enabled === 'true') || (chartData.ks_description && isJsonString(chartData.ks_description) && getJsonString(chartData.ks_description).heat_map_enabled === 'true')));

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
        setPage(1);
        setOffset(0);
        setFilterText(formatFilterData(filterData, data?.quickFilterValues?.[0]));
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
          {dateGroupData && dateGroupData.loading && <PageLoader type="chart" />}
          {!(dateGroupData && dateGroupData.loading) && (
            <>
              {!(chartData && ((chartData.ks_info && isJsonString(chartData.ks_info) && getJsonString(chartData.ks_info).mixed_chart_enabled === 'true') || (chartData.ks_description && isJsonString(chartData.ks_description) && getJsonString(chartData.ks_description).mixed_chart_enabled === 'true'))) && (
                <div className="line-chart-box">
                  <StaticDataExport
                    chartData={chartData}
                    nextLevel={!!chartId}
                    chartItems={chartId ? chartItemValues : false}
                    isDownload={excelDownload}
                    setExcelDownload={() => setExcelDownload(false)}
                  />
                  <Box
                    sx={{
                      padding: `0px ${customHeight - 4}px 0px ${customHeight - 4}px`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                    }}
                  >
                    <h1
                      style={{ fontSize: headFont || `${height + 3}px` }}
                      className="line-chart-text m-0"
                    >
                      {chartId ? getDrillName() : chartData.name}
                    </h1>
                    <div id={`chart-actions-${chartData.id}`}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '2px',
                        }}
                      >
                        {/* {isIAQ && <DropdownComponent />} */}

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
                                  className={openExport ? 'mr-2' : 'expand-icon mr-2'}
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
                        {isEditable && !chartId && chartData && chartData.ks_dashboard_item_type === 'ks_bar_chart' && !(chartData
                          && chartData.hx_annotations_data_ids
                          && chartData.hx_annotations_data_ids.length > 1) && !isHeatMap && (
                            <MuiTooltip title={<Typography>Edit</Typography>}>
                              <IconButton
                                onClick={() => setEdit(true)}
                              >
                                <FiEdit2
                                  size={20}
                                  cursor="pointer"
                                  className="expand-icon mr-2"
                                />
                              </IconButton>
                            </MuiTooltip>
                        )}
                        {isEditable && !(chartData
                          && chartData.hx_annotations_data_ids
                          && chartData.hx_annotations_data_ids.length > 1) && !isHeatMap && !chartId && (
                            <MuiTooltip title={<Typography>Make as Mixed Card</Typography>}>
                              <IconButton
                                onClick={() => setMixedEdit(true)}
                              >
                                <FiActivity
                                  size={20}
                                  cursor="pointer"
                                  className="expand-icon mr-2"
                                />
                              </IconButton>
                            </MuiTooltip>
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
                          <RestartAlt
                            onClick={() => onResetFull()}
                            size={15}
                            cursor="pointer"
                            className="expand-icon"
                          />
                        )}
                        {(chartData.ks_action_type === 'dashboard' || chartData.ks_action_type === 'chart') && (
                          <>
                            {!(isNavigate && ninjaDrillCode && ninjaDrillCode.loading) && (
                              <MuiTooltip title={<Typography>Navigate</Typography>}>
                                <IconButton onClick={() => onNavigateDashboard()}>
                                  <IoNavigateCircleOutline
                                    size={24}
                                    cursor="pointer"
                                    className="expand-icon mr-2"
                                  />
                                </IconButton>
                              </MuiTooltip>
                            )}
                            {isNavigate && ninjaDrillCode && ninjaDrillCode.loading && (
                              <CircularProgress size={24} sx={{ color: AddThemeColor({}).color }} />
                            )}
                          </>
                        )}
                        {chartData.ks_chart_date_groupby && (<GroupByComponent />)}
                      </Box>
                    </div>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                      // height: '100%',
                    }}
                  >
                    <Box
                      sx={{
                        // height: '100%',
                        width: '100%',
                      }}
                      className={chartData && chartData.ks_chart_date_groupby === 'hour' && isShowTimeOnly ? 'apex-chart-min' : ''}
                    >
                      {!isHeatMap && (
                        <GetBarChart
                          chartId={chartId}
                          height={height}
                          divHeight={divHeight}
                          showModal={showModal}
                          isShowModal={isShowModal}
                          selectedDateTag={selectedDateTag}
                          customDateValue={customDateValue}
                          chartValues={chartValues}
                          onChartItemClickPoint={onChartItemClickPoint}
                          loading={loading}
                          dashboardColors={dashboardColors}
                          chartItemType={chartItemType}
                          drillDownCharts={drillDownCharts}
                          dateGroup={subDateFilter}
                          customHeight={customHeight}
                          isIot={isIot}
                          chartItemValues={chartItemValues}
                          dType={getChartName(chartId ? chartItemType : chartData.ks_dashboard_item_type)}
                          isMutliChart={
                            chartData.ks_dashboard_item_type
                            === 'ks_bar_multi_chart'
                          }
                          chartData={chartData}
                          datasets={
                            chartId && drillDownCharts.includes(chartItemType)
                              ? getDatasetsApexBar(
                                chartItemValues.datasets,
                                false,
                                false,
                                chartItemType,
                                false,
                                false,
                              )
                              : getDatasetsApexBar(
                                chartValues.datasets
                                  && chartValues.datasets.length > 1
                                  && chartData.ks_dashboard_item_type
                                  === 'ks_bar_advance_chart'
                                  && selectedDataset
                                  ? getSelectedData(
                                    chartValues.datasets,
                                    selectedDataset,
                                  )
                                  : chartValues.datasets,
                                getChartColors(chartData.id),
                                chartValues.subcolors,
                                chartData.ks_dashboard_item_type,
                                chartData,
                                getChartOptions(),
                              )
                          }
                        />
                      )}
                      {isHeatMap && (
                        <HeatMap isExpand={showModal || isShowModal} height={height} divHeight={divHeight} chartValues={chartValues} chartData={chartData} />
                      )}
                    </Box>
                  </Box>
                </div>
              )}
              {(chartData && ((chartData.ks_info && isJsonString(chartData.ks_info) && getJsonString(chartData.ks_info).mixed_chart_enabled === 'true') || (chartData.ks_description && isJsonString(chartData.ks_description) && getJsonString(chartData.ks_description).mixed_chart_enabled === 'true'))) && (
                <Card className="ticket-card-mixed" style={{ background: detailDataDefault && detailDataDefault.background_color ? `${detailDataDefault.background_color} 0% 0% no-repeat padding-box` : '#ffff 0% 0% no-repeat padding-box' }} onClick={() => (!isHeader ? setMixedEdit(!editMode && isEditable) : '')}>
                  {!isHeader ? (
                    <h1
                      style={{ fontSize: headFont || `${height + 3}px` }}
                      className="line-chart-text m-2"
                    >
                      {chartId ? getDrillName() : chartData.name}
                    </h1>
                  ) : (
                    <div
                      className="page-actions-header content-center p-1"
                      style={{
                        backgroundColor: isJsonValue(isIot ? chartData.ks_info : chartData.ks_description, 'card_header', 'backgroundColor') ? isJsonValue(chartData.ks_info ? chartData.ks_info : chartData.ks_description, 'card_header', 'backgroundColor') : 'white',
                      }}
                      onMouseEnter={() => setShowNavigate(true)}
                      onMouseLeave={() => setShowNavigate(false)}
                    >
                      <h1
                        style={{
                          fontSize: isJsonValue(isIot ? chartData.ks_info : chartData.ks_description, 'card_header', 'size') ? isJsonValue(chartData.ks_info ? chartData.ks_info : chartData.ks_description, 'card_header', 'size') : `${height + 3}px`,
                          color: isJsonValue(isIot ? chartData.ks_info : chartData.ks_description, 'card_header', 'color') ? isJsonValue(chartData.ks_info ? chartData.ks_info : chartData.ks_description, 'card_header', 'color') : 'black',
                        }}
                        className="line-chart-text m-0 text-align-left"
                      >
                        {isJsonValue(isIot ? chartData.ks_info : chartData.ks_description, 'card_header', 'icon') && (
                          <FontAwesomeIcon
                            icon={isJsonValue(isIot ? chartData.ks_info : chartData.ks_description, 'card_header', 'icon')}
                            style={
                              {
                                height: isJsonValue(isIot ? chartData.ks_info : chartData.ks_description, 'card_header', 'size') ? isJsonValue(chartData.ks_info ? chartData.ks_info : chartData.ks_description, 'card_header', 'size') : `${width * 7}px`,
                                width: isJsonValue(isIot ? chartData.ks_info : chartData.ks_description, 'card_header', 'size') ? isJsonValue(chartData.ks_info ? chartData.ks_info : chartData.ks_description, 'card_header', 'size') : `${width * 7}px`,
                                color: isJsonValue(isIot ? chartData.ks_info : chartData.ks_description, 'card_header', 'icon-color'),
                              }
                            }
                            className="mr-2"
                          />

                        )}

                        {chartData.name}
                      </h1>
                      {showNavigate && (
                        <div className="content-left ">
                          {isEditable && (
                            <MuiTooltip title={<Typography>Edit</Typography>}>
                              <IconButton
                                onClick={() => setMixedEdit(!editMode && isEditable)}
                                className="padding-2px navigate-icon"
                              >
                                <FontAwesomeIcon
                                  icon="fa-pencil"
                                  style={
                                    {
                                      height: isJsonValue(isIot ? chartData.ks_info : chartData.ks_description, 'card_header', 'size') ? isJsonValue(chartData.ks_info ? chartData.ks_info : chartData.ks_description, 'card_header', 'size') : `${width * 7}px`,
                                      width: isJsonValue(isIot ? chartData.ks_info : chartData.ks_description, 'card_header', 'size') ? isJsonValue(chartData.ks_info ? chartData.ks_info : chartData.ks_description, 'card_header', 'size') : `${width * 7}px`,
                                      color: isJsonValue(isIot ? chartData.ks_info : chartData.ks_description, 'card_header', 'icon-color'),
                                    }
                                  }
                                  className="mr-2 switch-icon"
                                />
                              </IconButton>

                            </MuiTooltip>
                          )}
                          <MuiTooltip title={<Typography>Navigate</Typography>}>
                            <IconButton className="padding-2px navigate-icon" onClick={() => onClickDataCard()}>
                              <FontAwesomeIcon
                                icon="fa-paper-plane"
                                style={
                                  {
                                    height: isJsonValue(isIot ? chartData.ks_info : chartData.ks_description, 'card_header', 'size') ? isJsonValue(chartData.ks_info ? chartData.ks_info : chartData.ks_description, 'card_header', 'size') : `${width * 7}px`,
                                    width: isJsonValue(isIot ? chartData.ks_info : chartData.ks_description, 'card_header', 'size') ? isJsonValue(chartData.ks_info ? chartData.ks_info : chartData.ks_description, 'card_header', 'size') : `${width * 7}px`,
                                    color: isJsonValue(isIot ? chartData.ks_info : chartData.ks_description, 'card_header', 'icon-color'),
                                  }
                                }
                                className="mr-1 switch-icon"
                              />
                            </IconButton>
                          </MuiTooltip>
                        </div>
                      )}

                    </div>

                  )}

                  <SingleCardNumeric divHeight={divHeight} chartData={chartData} chartValues={chartValues} height={height} width={width - 50} divWidth={width} />
                </Card>
              )}
            </>
          )}
          <Dialog
            PaperProps={{
              sx: {
                width: '95vw',
                height: '95vh',
                maxWidth: 'none',
                maxHeight: 'none',
              },
            }}
            open={(showModal || isShowModal) && !isViewList}
          >
            <div className="line-chart-box-expand">
              <Box
                sx={{
                  padding: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              >
                <h1 style={{ fontSize: '18px' }} className="line-chart-text m-0">
                  {chartId ? getDrillName() : chartData.name}
                </h1>
                <div id={`chart-actions-${chartData.id}`}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '2px',
                    }}
                  >
                    {chartData.ks_chart_date_groupby && (<GroupByComponent />)}
                    {id && (
                      <>
                        <MuiTooltip title={<Typography>Download</Typography>}>
                          <IconButton
                            id="basic-button1"
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
                            'aria-labelledby': 'basic-button1',
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
                        <IoCloseOutline size={20} />
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
                  width: '98%',
                  height: '100%',
                }}
                id={`${id}-bar-expand`}
              >
                <Box
                  sx={{
                    height: '90%',
                    width: '100%',
                  }}
                  className={chartData && chartData.ks_chart_date_groupby === 'hour' && isShowTimeOnly ? 'apex-chart-min' : ''}
                >
                  {!isHeatMap && (
                    <GetBarChart
                      chartId={chartId}
                      height={height}
                      selectedDateTag={selectedDateTag}
                      customDateValue={customDateValue}
                      divHeight={divHeight}
                      showModal={showModal}
                      isShowModal={isShowModal}
                      chartValues={chartValues}
                      onChartItemClickPoint={onChartItemClickPoint}
                      loading={loading}
                      chartItemType={chartItemType}
                      drillDownCharts={drillDownCharts}
                      dateGroup={subDateFilter}
                      customHeight={customHeight}
                      chartItemValues={chartItemValues}
                      dashboardColors={dashboardColors}
                      dType={getChartName(chartId ? chartItemType : chartData.ks_dashboard_item_type)}
                      isIot={isIot}
                      isMutliChart={
                        chartData.ks_dashboard_item_type === 'ks_bar_multi_chart'
                      }
                      chartData={chartData}
                      datasets={
                        chartId && drillDownCharts.includes(chartItemType)
                          ? getDatasetsApexBar(
                            chartItemValues.datasets,
                            false,
                            false,
                            chartItemType,
                            false,
                            false,
                          )
                          : getDatasetsApexBar(
                            chartValues.datasets
                              && chartValues.datasets.length > 1
                              && chartData.ks_dashboard_item_type
                              === 'ks_bar_advance_chart'
                              && selectedDataset
                              ? getSelectedData(
                                chartValues.datasets,
                                selectedDataset,
                              )
                              : chartValues.datasets,
                            getChartColors(chartData.id),
                            chartValues.subcolors,
                            chartData.ks_dashboard_item_type,
                            chartData,
                            getChartOptions(),
                          )
                      }
                    />
                  )}
                  {isHeatMap && (
                    <HeatMap isExpand={showModal || isShowModal} height={height} divHeight={divHeight} chartValues={chartValues} chartData={chartData} />
                  )}
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
          sx: { width: '90%' },
        }}
        anchor="right"
        open={isMixedEdit}
      >
        <DrawerHeader
          headerName={chartData && chartData.name ? chartData.name : ''}
          imagePath={false}
          onClose={() => setMixedEdit(false)}
        />
        <MixedCardPreview isIot={isIot} dashboardCode={dashboardCode} dashboardUuid={dashboardUuid} selectedDateTag={selectedDateTag} divHeight={divHeight} chartData={chartData} chartValues={chartValues} height={height} width={width} />
      </Drawer>
      <Drawer
        PaperProps={{
          sx: { width: '100%' },
        }}
        anchor="right"
        open={isEdit}
      >
        <DrawerHeader
          headerName={chartData && chartData.name ? chartData.name : ''}
          imagePath={false}
          onClose={() => setEdit(false)}
        />
        <Configuration
          chartData={chartData}
          isIot={isIot}
          dashboardCode={dashboardCode}
          dashboardUuid={dashboardUuid}
          chartValues={chartValues}
          selectedDateTag={selectedDateTag}
          dashboardColors={dashboardColors}
          code={code}
          savedOptions={getChartOptions()}
          datasets={
            chartId && drillDownCharts.includes(chartItemType)
              ? getDatasetsApexBar(
                chartItemValues.datasets,
                false,
                false,
                chartItemType,
                false,
                false,
              )
              : getDatasetsApexBarPreview(
                chartValues.datasets
                  && chartValues.datasets.length > 1
                  && chartData.ks_dashboard_item_type
                  === 'ks_bar_advance_chart'
                  && selectedDataset
                  ? getSelectedData(
                    chartValues.datasets,
                    selectedDataset,
                  )
                  : chartValues.datasets,
                getChartColors(chartData.id),
                chartValues.subcolors,
                chartData.ks_dashboard_item_type,
                chartData,
                getChartOptions(),
              )
          }
        />
      </Drawer>
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
        {/* <h4>
          <DynamicDataExport
            listName={getTableDrillName()}
            modelName={modelName}
            domainData={domainData}
            onSearchChange={onSearchChange}
            onClear={onClear}
            onSearch={onSearch}
            searchValue={searchValue}
          />
        </h4> */}
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
            isLargeReport={isLargeReport}
            setLargeReport={setLargeReport}
            exportReportData={exportReportData}
            setAllReport={setAllReport}
            modelName={modelName}
            exportFileName={getTableDrillName()}
            reload={reload}
            totalDataCount={totalDataCount}
            handlePageChange={handlePageChange}
            currentPage={page}
            setReload={setReload}
            setSearch={setSearch}
            hideDetail={isDetail}
            isIot={isIot}
            onFilterChanges={debouncedOnFilterChange}
            filters={filterText}
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
      <Drawer
        PaperProps={{
          sx: { width: '98%' },
        }}
        anchor="right"
        open={treeModal}
        ModalProps={{
          disableEnforceFocus: true,
        }}
      >
        <DrawerHeader
          headerName="Tree"
          imagePath={false}
          onClose={() => onCloseTreeDashboard()}
        />
        <TreeDashboard
          dashboardUuid={treeUuid}
          code={treeCode}
        />
      </Drawer>
      <Drawer
        PaperProps={{
          sx: { width: '98%' },
        }}
        anchor="right"
        open={v12Modal}
        ModalProps={{
          disableEnforceFocus: true,
        }}
      >
        <DrawerHeader
          headerName={
            ninjaDashboardExpandCode
              && ninjaDashboardExpandCode.data
              && ninjaDashboardExpandCode.data.length > 0
              ? ninjaDashboardExpandCode.data[0].name
              : ''
          }
          imagePath={false}
          onClose={() => onClose12Dashboard()}
        />

        {ninjaDashboardExpandCode
          && ninjaDashboardExpandCode.data
          && ninjaDashboardExpandCode.data.length > 0 && (
            <DashboardDrillView
              code={ninjaDashboardExpandCode.data[0].id}
              defaultDate={
                ninjaDashboardExpandCode.data[0].ks_date_filter_selection
              }
              dashboardInterval={ninjaDashboardExpandCode.data[0].ks_set_interval}
              dashboardLayouts={ninjaDashboardExpandCode.data[0].dashboard_json}
              dashboardColors={
                ninjaDashboardExpandCode.data[0].ks_dashboard_items_ids
              }
            />
        )}
        {ninjaDashboardExpandCode && ninjaDashboardExpandCode.loading && (
          <div className="margin-top-250px text-center">
            <Loader />
          </div>
        )}
        {ninjaDashboardExpandCode
          && ((ninjaDashboardExpandCode.data
            && ninjaDashboardExpandCode.data.length === 0)
            || ninjaDashboardExpandCode.err) && (
            <ErrorContent errorTxt="No Data Found" showRetry />
        )}
      </Drawer>
      <Drawer
        PaperProps={{
          sx: { width: '98%' },
        }}
        anchor="right"
        open={v16Modal}
        ModalProps={{
          disableEnforceFocus: true,
        }}
      >
        <DrawerHeader
          headerName="Dashboard"
          imagePath={false}
          onClose={() => onClose16Dashboard()}
        />

        <DashboardDrillView
          dashboardCode={treeCode}
          dashboardUuid={treeUuid}
          isIot
        />
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
      <Dialog maxWidth="lg" open={isDataFilter}>
        <div className="individual-dates-filter-pop-up">
          <div className="url-popup-header-box">
            <Typography
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontFamily: 'Suisse Intl',
                fontSize: '20px',
                fontWeight: '600',
              }}
            >
              <FiCalendar
                size={20}
                cursor="pointer"
              />
              Group By
            </Typography>
            <IconButton
              onClick={() => showDateFilter(false)}
              className="btn"
              type="button"
            >
              <IoCloseOutline size={28} />
            </IconButton>
          </div>

          {chartData.ks_chart_date_groupby
            && chartData.ks_chart_relation_groupby_field_type === 'datetime' && (
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '10px',
                  padding: '10px 0px 20px 0px',
                }}
                component="ul"
              >
                {customData
                  && customData.dateSeries
                  && customData.dateSeries.map((dl) => (
                    <ListItemButton
                      sx={DateFilterButtons({
                        width: '31%',
                        border: '1px solid #0000001f',
                      }, selectedDateTag === dl.value)}
                      onClick={() => onDateGroupChange(chartData.id, dl.value)}
                    >
                      <ListItem
                        sx={{
                          diplay: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {dl.label}
                      </ListItem>
                    </ListItemButton>
                  ))}
              </Box>
          )}
          {chartData.ks_chart_date_groupby
            && chartData.ks_chart_relation_groupby_field_type === 'date' && (
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '10px',
                  padding: '10px 0px 20px 0px',
                }}
                component="ul"
              >
                {customData
                  && customData.dateNoTimeSeries
                  && customData.dateNoTimeSeries.map((dl) => (
                    <ListItemButton
                      sx={DateFilterButtons({
                        width: '31%',
                        border: '1px solid #0000001f',
                      }, selectedDateTag === dl.value)}
                      onClick={() => onDateGroupChange(chartData.id, dl.value)}
                    >
                      <ListItem
                        sx={{
                          diplay: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {dl.label}
                      </ListItem>
                    </ListItemButton>
                  ))}
              </Box>
          )}
        </div>
      </Dialog>
    </>
  );
});

BarChart.propTypes = {
  chartData: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
    PropTypes.object,
  ]).isRequired,
  height: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]).isRequired,
  code: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]).isRequired,
  width: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]).isRequired,
  selectedDateTag: PropTypes.oneOfType([PropTypes.bool, PropTypes.string])
    .isRequired,
  dashboardColors: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
    .isRequired,
};
export default BarChart;
