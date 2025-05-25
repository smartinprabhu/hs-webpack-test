/* eslint-disable no-nested-ternary */
/* eslint-disable react/button-has-type */
/* eslint-disable max-len */
/* eslint-disable import/no-cycle */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable import/no-unresolved */
/* eslint-disable radix */
/* eslint-disable camelcase */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { RxArrowTopRight, RxArrowBottomLeft } from 'react-icons/rx';
import { FaInfoCircle } from 'react-icons/fa';
import Drawer from '@mui/material/Drawer';
import Card from '@mui/material/Card';
import Chart from 'react-apexcharts';
import {
  Box, Dialog, Typography, IconButton,
  DialogContent, DialogContentText,
} from '@mui/material';
import axios from 'axios';

import * as Icons from '@fortawesome/free-solid-svg-icons';
import * as Icons1 from '@fortawesome/free-regular-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import MuiTooltip from '@shared/muiTooltip';
import PageLoader from '@shared/pageLoader';
import DrawerHeader from '../../commonComponents/drawerHeader';

import DialogHeader from '../../commonComponents/dialogHeader';
import '../dashboard.scss';
import {
  getColorCode,
  getDomainString,
  isModelExists,
  getIOTFields,
  get12Fields,
} from '../utils/utils';
import {
  getExtraSelectionMultiple,
  getExtraSelectionMultipleCount,
} from '../../helpdesk/ticketService';
import {
  updateDashboardItem,
  getNinjaCodeDrill,
  resetNinjaExpandCode,
  getNinjaCodeExpand,
} from '../../analytics/analytics.service';
import {
  newpercalculate,
  newpercalculateGoal,
  newpercalculatePrev,
} from '../../util/staticFunctions';
import {
  getColumnArrayById,
  intToString,
  numberWithCommas,
  debounce,
  formatFilterData,
  valueCheck,
  queryGeneratorWithUtc,
} from '../../util/appUtils';
import customData from '../data/customData.json';
import DynamicTableView from './dynamicTableView';
import { getPercentage, getPercentageNew } from '../../assets/utils/utils';
import BarChart from './barChart';
import PieChart from './pieChart';
import DashboardDrillView from './dashboardDrillView';
import CardIcon from '../../assets/cardIcon/cardIcon';
import airQualityIcon from '../../../../images/default/icons/iaqIcons/airQualityIcon.svg';
import dataUsageIcon from '../../../../images/default/icons/iaqIcons/dataUsageIcon.svg';
import pmIcon from '../../../../images/default/icons/iaqIcons/pmIcon.svg';
import temperatureIcon from '../../../../images/default/icons/iaqIcons/temperatureIcon.svg';
import co2Icon from '../../../../images/default/icons/iaqIcons/co2Icon.svg';
import humidityIcon from '../../../../images/default/icons/iaqIcons/humidityIcon.svg';
import defaultIcon from '../../../../images/default/icons/iaqIcons/defaultIcon.svg';
import volatileOrganicCompoundsIcon from '../../../../images/default/icons/iaqIcons/volatileOrganicCompoundsIcon.svg';
import carbonMonoxideIcon from '../../../../images/default/icons/iaqIcons/carbonMonoxideIcon.svg';
import formaldehydeIcon from '../../../../images/default/icons/iaqIcons/formaldehydeIcon.svg';
import ozoneIcon from '../../../../images/default/icons/iaqIcons/ozoneIcon.svg';

import TreeDashboard from '../../treeDashboards/dashboardDrill';

import AuthService from '../../util/authService';
import { useTheme } from '../../ThemeContext';

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

const DataCard = ({

  dataItem,
  height,
  width,
  isIot,
  code,
  selectedDateTag,
  dashboardColors,
  dashboardUuid,
  dashboardCode,
  editMode,
  isIAQ,
}) => {
  const { themes } = useTheme();
  const [isViewList, setViewList] = useState(false);
  const [modelName, setModel] = useState(false);
  const [listName, setListName] = useState(false);
  const [domainData, setDomain] = useState([]);
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(0);
  const [isAllReport, setAllReport] = useState(false);

  const [searchValue, setSearchValue] = useState('');
  const [customFilters, setCustomFilters] = useState('');
  const [isSearch, setSearch] = useState(false);

  const [reload, setReload] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const [isShow, setIsShow] = useState(false);

  const [exportReportData, setExportReportData] = useState(false);
  const [isLargeReport, setLargeReport] = useState(false);

  const [ninjaChartInfo, setNinjaChartInfo] = useState({ loading: false, data: null, err: null });

  const [dashboardModal, setShowDashboardModal] = useState(false);
  const [treeModal, setTreeModal] = useState(false);
  const [treeUuid, setTreeUuid] = useState(false);
  const [treeCode, setTreeCode] = useState(false);
  const [v16Modal, setV16Modal] = useState(false);
  const [v12Modal, setV12Modal] = useState(false);
  const [titleModal, showTitleModal] = useState(false);
  const [titleText, setTitleText] = useState(false);

  const [filterText, setFilterText] = useState('');
  const [customFilter, setCustomFilter] = useState([]);
  const [showNavigate, setShowNavigate] = useState(false);
  const [tableColumns, setTableColumns] = useState([]);

  const { userInfo } = useSelector((state) => state.user);

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

  const dispatch = useDispatch();
  const classes = useStyles();

  const limit = 10;

  const handlePageChange = (pages) => {
    const offsetValue = pages * limit;
    setOffset(offsetValue);
    setPage(page);
  };

  const onViewInfo = (txt) => {
    setTitleText(txt);
    showTitleModal(true);
  };

  const onCloseInfo = () => {
    setTitleText(false);
    showTitleModal(false);
  };

  const WEBAPPAPIURL = `${appConfig.WEBAPIURL}/`;
  const authService = AuthService();

  const {
    listDataMultipleInfo,
    listDataMultipleCountInfo,
    listDataMultipleCountLoading,
  } = useSelector((state) => state.ticket);

  const { sortedValueDashboard } = useSelector((state) => state.equipment);

  const totalDataCount = listDataMultipleCountInfo && listDataMultipleCountInfo.length
    ? listDataMultipleCountInfo.length
    : 0;

  const {
    ninjaDashboard,
    updateNinjaChartItemInfo,
    ninjaDrillCode,
    ninjaDashboardExpandCode,
  } = useSelector((state) => state.analytics);

  const chartItemData = ninjaChartInfo && ninjaChartInfo.data && ninjaChartInfo.data.length
    ? ninjaChartInfo.data[0]
    : false;

  const isShowAsString = ninjaDashboard
    && ninjaDashboard.data
    && ninjaDashboard.data.is_long_number_as_string
    ? ninjaDashboard.data.is_long_number_as_string
    : false;

  const v16Fields = isIot ? (dataItem && (dataItem.ks_info && isJsonString(dataItem.ks_info) && getJsonString(dataItem.ks_info).list_fields)) : (dataItem && dataItem.ks_description && isJsonString(dataItem.ks_description) && getJsonString(dataItem.ks_description).list_fields);
  const tableFields = isIot ? (dataItem && (dataItem.ks_info && isJsonString(dataItem.ks_info) && getJsonString(dataItem.ks_info).table_fields)) : (dataItem && dataItem.ks_description && isJsonString(dataItem.ks_description) && getJsonString(dataItem.ks_description).table_fields);

  function getDomainData() {
    let res = getDomainString(JSON.stringify(domainData), searchValue, modelName, customFilters ? queryGeneratorWithUtc(customFilters, false, userInfo.data) : '');
    if (isIot) {
      res = encodeURIComponent(getDomainString(JSON.stringify(domainData), searchValue, modelName, customFilters ? queryGeneratorWithUtc(customFilters, false, userInfo.data) : ''));
    }
    return res;
  }

  useEffect(() => {
    setSearchValue('');
    setCustomFilters([]);
    setPage(0);
    setOffset(0);
    setSearch(Math.random());
  }, [reload]);

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
  }, [modelName, offset, isSearch, sortedValueDashboard]);

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
    if (modelName && isViewList && isLargeReport) {
      const fields = customData && customData[modelName]
        ? getColumnArrayById(customData[modelName], 'property')
        : [];
      const iotFields = modelName && getIOTFields(modelName, v16Fields) ? getIOTFields(modelName, v16Fields) : false;
      const new12Fields = modelName && get12Fields(modelName, v16Fields) ? get12Fields(modelName, v16Fields) : fields;
      const newFields = iotFields || fields;
      setExportReportData({
        totalRecords: totalDataCount, modelName, modelFields: dashboardUuid ? newFields : new12Fields, searchType: modelName && get12Fields(modelName, v16Fields) ? 'search' : false, downloadType: 'Standard API', domain: getDomainData(),
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
  }, [modelName, isSearch]);

  function resetUpdateDashboardChartItem() {
    setNinjaChartInfo({ loading: false, data: null, err: null });
  }

  useEffect(() => {
    resetUpdateDashboardChartItem();
  }, []);

  function getChartItem(id, model, isIot, uuid) {
    setNinjaChartInfo({ loading: true, data: null, err: null });
    const fields = '["action","code","id","name","ks_bar_chart_stacked","ks_chart_data","ks_dashboard_item_type","ks_domain","ks_description","title_x_axis","title_y_axis","x_axis_label","max_sequnce","ks_model_name","ks_chart_date_groupby","ks_data_calculation_type",["ks_graph_status_records", ["id", "name", "ks_color_picker_id"]],["ks_action_lines", ["id","sequence",("ks_item_action_field", ["id", "field_description"])]]]';
    const payload = `["id","=",${id}]`;

    const endpoint = `search/${model}?model=${model}&domain=[${payload}]&fields=${fields}&context={"ks_domain": ${JSON.stringify(dataItem.ks_domain)},"ks_date_filter_selection": "${selectedDateTag}"}`;

    let configs = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${WEBAPPAPIURL}api/v5/${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
        // Authorization: `Bearer ${authService.getAccessToken()}`,
      },
      withCredentials: true,
    };

    if (isIot) {
      const endpoint1 = `search?model=${model}&domain=[${payload}]&fields=${fields}&context={"ks_domain": ${JSON.stringify(dataItem.ks_domain)},"ks_date_filter_selection": "${selectedDateTag}"}`;
      configs = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${WEBAPPAPIURL}public/api/v2/${endpoint1}&uuid=${uuid}&token=${authService.getAccessToken()}`,
        headers: {
          'Content-Type': 'application/json',
          // Authorization: `Bearer ${authService.getAccessToken()}`,
          ioturl: window.localStorage.getItem('iot_url'),
        },
        withCredentials: true,
      };
    }
    axios(configs)
      .then((response) => {
        if (response.data && response.data.data) {
          setNinjaChartInfo({ loading: false, data: response.data.data, err: null });
        }
      })
      .catch((error) => {
        setNinjaChartInfo({ loading: false, data: null, err: error });
      });
  }

  useEffect(() => {
    if (
      ninjaChartInfo
      && !ninjaChartInfo.loading
      && updateNinjaChartItemInfo
      && !updateNinjaChartItemInfo.loading
      && showModal
      && dataItem.action_ks_dashboard_ninja_item_id
      && updateNinjaChartItemInfo
      && updateNinjaChartItemInfo.data
    ) {
      if (!isIot) {
        getChartItem(
          dataItem.action_ks_dashboard_ninja_item_id,
          appModels.NINJABOARDITEM,
        );
      } else {
        getChartItem(
          dataItem.action_ks_dashboard_ninja_item_id,
          appModels.NINJABOARDITEM,
          'IOT',
          dashboardUuid,
        );
      }
    }
  }, [updateNinjaChartItemInfo]);

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

  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsetValue = (index - 1) * limit;
    setPage(index);
    setOffset(offsetValue);
  };

  const handleViewList = (model, domain, name) => {
    if (isModelExists(model, v16Fields)) {
      setTableColumns(customData && customData[model] ? customData[model] : []);
      setListName(name);
      setModel(model);
      setDomain(domain);
      setViewList(true);
    }
  };

  // const pages = getPagesCountV2(totalDataCount, limit);

  const loading = (listDataMultipleInfo && listDataMultipleInfo.loading)
    || listDataMultipleCountLoading;

  const arrGrids = dataItem.ks_kpi_data ? JSON.parse(dataItem.ks_kpi_data) : [];

  const total = arrGrids
    && arrGrids.length
    && arrGrids.length === 2
    && arrGrids[1].record_data
    ? arrGrids[1].record_data
    : false;

  const totalTarget = arrGrids && arrGrids.length && arrGrids.length;

  const prevRec = arrGrids
    && arrGrids.length
    && arrGrids.length
    && arrGrids[0].previous_period
    ? arrGrids[0].previous_period
    : false;

  const customHeight = height - 40;

  function getResValue(input) {
    let res = 0;
    /* if (Number(input) === input && input % 1 !== 0) {
      res = intToString(parseFloat(input).toFixed(2));
    } else {
      res = intToString(parseInt(input));
    } */
    if (isShowAsString) {
      if (input < 999 && Number(input) === input && input % 1 !== 0) {
        res = parseFloat(input).toFixed(2);
      } else {
        res = intToString(parseInt(input));
      }
    }
    if (!isShowAsString) {
      if (Number(input) === input && input % 1 !== 0) {
        res = parseFloat(input).toFixed(2);
      } else {
        res = parseInt(input);
      }
    }
    return res;
  }

  function getStatusKpi(item) {
    let res = 'up';
    if (
      newpercalculate(total, item.ks_record_count) > item.ks_standard_goal_value
    ) {
      res = 'up';
    } else {
      res = 'down';
    }
    return res;
  }

  function getStatusColor(item) {
    let res = '';
    if (item.ks_goal_enable) {
      if (
        newpercalculate(total, item.ks_record_count)
        > item.ks_standard_goal_value
      ) {
        res = 'text-success';
      } else {
        res = 'text-danger';
      }
    }
    return res;
  }

  const isNavigation = isIot ? (dataItem && (dataItem.ks_info && isJsonString(dataItem.ks_info) && getJsonString(dataItem.ks_info).navigation && getJsonString(dataItem.ks_info).navigation.type && getJsonString(dataItem.ks_info).navigation.type === 'card'))
    : (dataItem && dataItem.ks_description && isJsonString(dataItem.ks_description) && getJsonString(dataItem.ks_description).navigation && getJsonString(dataItem.ks_description).navigation.type && getJsonString(dataItem.ks_description).navigation.type === 'card');

  const navigation = isIot ? (dataItem && (dataItem.ks_info && isJsonString(dataItem.ks_info) && getJsonString(dataItem.ks_info).navigation && getJsonString(dataItem.ks_info).navigation))
    : (dataItem && dataItem.ks_description && isJsonString(dataItem.ks_description) && getJsonString(dataItem.ks_description).navigation && getJsonString(dataItem.ks_description).navigation);

  const isNavigateIcon = ((isNavigation && navigation && (navigation.navigate_to === 'tree' || navigation.navigate_to === 'v16' || navigation.navigate_to === 'v12')) || (!isNavigation && ((dataItem.ks_action_type === 'chart' && dataItem.action_ks_dashboard_ninja_item_id) || (dataItem.ks_action_type === 'dashboard' && dataItem.action_ks_dashboard_ninja_board_id) || (dataItem.ks_data_calculation_type !== 'query' && dataItem.ks_record_count))));

  const isCardClickable = ((isNavigation && navigation && (navigation.navigate_to === 'tree' || navigation.navigate_to === 'v16' || navigation.navigate_to === 'v12')) || (!isNavigation && ((dataItem.ks_action_type === 'chart' && dataItem.action_ks_dashboard_ninja_item_id && dataItem.ks_record_count) || (dataItem.ks_action_type === 'dashboard' && dataItem.action_ks_dashboard_ninja_board_id && dataItem.ks_record_count) || (dataItem.ks_data_calculation_type !== 'query' && dataItem.ks_record_count && isModelExists(dataItem.ks_model_name, v16Fields)))));

  const onClickDataCard = () => {
    if (!dataItem.ks_restrict_drilldown && !editMode) {
      if (!isNavigation) {
        if (
          dataItem.ks_action_type === 'chart'
          && dataItem.action_ks_dashboard_ninja_item_id
          && dataItem.ks_record_count
        ) {
          setShowModal(true);
          resetUpdateDashboardChartItem();
          const postData = {
            ks_domain: dataItem.ks_domain,
            ks_date_filter_selection: selectedDateTag,
          };
          if (!isIot) {
            dispatch(
              updateDashboardItem(
                dataItem.action_ks_dashboard_ninja_item_id,
                appModels.NINJABOARDITEM,
                postData,
              ),
            );
          } else {
            dispatch(
              updateDashboardItem(
                dataItem.action_ks_dashboard_ninja_item_id,
                appModels.NINJABOARD,
                postData,
                'IOT',
                dashboardUuid,
                appModels.NINJABOARDITEM,
              ),
            );
          }
        } else if (
          dataItem.ks_action_type === 'dashboard'
          && dataItem.action_ks_dashboard_ninja_board_id
          && dataItem.ks_record_count
        ) {
          dispatch(
            getNinjaCodeDrill(
              dataItem.action_ks_dashboard_ninja_board_id,
              appModels.NINJABOARD,
              isIot,
              dashboardUuid,
            ),
          );
          setShowDashboardModal(true);
          setIsShow(true);
        } else if (dataItem.ks_data_calculation_type !== 'query' && dataItem.ks_record_count && isModelExists(dataItem.ks_model_name, v16Fields)) {
          handleViewList(
            dataItem.ks_model_name,
            dataItem.ks_domain,
            dataItem.name,
          );
        }
      } else if (navigation && navigation.navigate_to === 'tree') {
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

  const onCloseDashboard = () => {
    setShowDashboardModal(false);
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

  function getRangeScore(value, ranges = []) {
    if (!Array.isArray(ranges) || ranges.length === 0) {
      return '#000000'; // Default color if no valid range is found
    }

    const rangeData = ranges.filter((item) => {
      const from = parseFloat(item?.ks_from) || 0; // Default to 0 if undefined
      const to = parseFloat(item?.ks_to) || 100; // Default to 100 if undefined
      return from <= parseFloat(value) && to >= parseFloat(value);
    });
    return rangeData.length > 0 ? rangeData[0].ks_colors : '#000000'; // Default color
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
    /* if (ranges && ranges.length) {
      if (parseFloat(value) > parseFloat(ranges[ranges?.length - 1]?.ks_to)) {
        score = ranges[ranges?.length - 1].ks_legend;
      }
    } */

    return score;
  }

  const getCardIcon = (cardName) => {
    switch (cardName) {
      case 'Index Air Quality':
        return airQualityIcon;
      case 'Temperature (°C)':
        return temperatureIcon;
      case 'Washroom AQI':
        return airQualityIcon;
      case 'Usage':
        return dataUsageIcon;
      case 'Humidity (RH)':
        return humidityIcon;
      case 'CO2 (ppm)':
        return co2Icon;
      case 'Formaldehyde (ppm)':
        return formaldehydeIcon;
      case 'VOC (ppb)':
        return volatileOrganicCompoundsIcon;
      case 'CO (ppm)':
        return carbonMonoxideIcon;
      case 'Ozone (ppm)':
        return ozoneIcon;
      case 'PM2.5 (µg/m³)':
      case 'PM1 (µg/m³)':
      case 'PM4.0 (µg/m³)':
      case 'PM10 (µg/m³)':
        return pmIcon;

      default:
        return defaultIcon;
    }
  };

  const options = useMemo(() => ({
    chart: {
      type: 'radialBar',
      offsetY: -20,
      sparkline: {
        enabled: true,
      },
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        track: {
          background: '#e7e7e7',
          strokeWidth: '97%',
          startAngle: -90,
          endAngle: 90,
        },
        dataLabels: {
          show: true,
          name: {
            offsetY: -5,
            show: false,
          },
          value: {
            formatter(val) {
              return dataItem ? parseFloat(dataItem.ks_record_count).toFixed(2) : '0.00';
            },
            offsetY: -2,
            color: '#000000',
            fontSize: `${width * 15}px`,
            show: true,
          },
        },
      },
    },
    fill: {
      type: 'solid',
      colors: [dataItem
        ? getRangeScore(
          parseFloat(dataItem.ks_record_count),
          dataItem.ks_hx_sla_audit_metric_line_ids || [],
        ) || '#000000' // Default to black if no color is found
        : '#000000'],
    },
    labels: [
      dataItem
        ? getRangeLegend(
          parseFloat(dataItem.ks_record_count),
          dataItem.ks_hx_sla_audit_metric_line_ids,
        )
        : 'N/A',
    ],
  }), [dataItem, width]); // Recompute only if dataItem or width changes

  function getRangeColor(value, ranges) {
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
    if (ranges && ranges.length) {
      if (parseFloat(value) > parseFloat(ranges[ranges?.length - 1]?.ks_to)) {
        score = ranges[ranges?.length - 1].ks_colors;
      }
    }

    return score;
  }
  function getPercentageValue() {
    let res = 0;
    const jsonData = getJsonString(dataItem.ks_info);
    if (jsonData && jsonData.max_value) {
      res = getPercentageNew(jsonData.max_value, dataItem.ks_record_count);
    } else {
      res = dataItem.ks_record_count;
    }
    return parseInt(res);
  }

  function getValuebyType() {
    let res = '';
    if (getJsonString(dataItem.ks_info).value_expression === 'data2-data1' && arrGrids && arrGrids.length) {
      res = parseInt(arrGrids[1].record_data) - parseInt(arrGrids[0].record_data);
    } else if (getJsonString(dataItem.ks_info).value_expression === 'data1-data2' && arrGrids && arrGrids.length) {
      res = parseInt(arrGrids[0].record_data) - parseInt(arrGrids[1].record_data);
    } else {
      res = numberWithCommas(getResValue(dataItem.ks_record_count));
    }
    return res;
  }

  function isJsonValue(opt, field1, field2) {
    let res = false;
    if (opt && isJsonString(opt) && getJsonString(opt) && getJsonString(opt)[field1] && getJsonString(opt)[field1][field2]) {
      res = getJsonString(opt)[field1][field2];
    }
    return res;
  }

  function isJsonValue3(opt, field1, field2, field3) {
    let res = false;
    if (opt && isJsonString(opt) && getJsonString(opt) && getJsonString(opt)[field1] && getJsonString(opt)[field1][field2] && getJsonString(opt)[field1][field2][field3]) {
      res = getJsonString(opt)[field1][field2][field3];
    }
    return res;
  }

  function isJsonValue3Field(field1, field2, field3) {
    let res = false;
    const opt = isIot ? dataItem.ks_info : dataItem.ks_description;
    if (opt && isJsonString(opt) && getJsonString(opt) && getJsonString(opt)[field1] && getJsonString(opt)[field1][field2] && getJsonString(opt)[field1][field2][field3]) {
      res = getJsonString(opt)[field1][field2][field3];
    }
    return res;
  }

  function isJsonValue4Field(field1, field2, field3, field4) {
    let res = false;
    const opt = isIot ? dataItem.ks_info : dataItem.ks_description;
    if (opt && isJsonString(opt) && getJsonString(opt) && getJsonString(opt)[field1] && getJsonString(opt)[field1][field2] && getJsonString(opt)[field1][field2][field3] && getJsonString(opt)[field1][field2][field3][field4]) {
      res = getJsonString(opt)[field1][field2][field3][field4];
    }
    return res;
  }

  function getSvgAlign(type) {
    let res = false;
    if (type && type === 'right') {
      res = { marginLeft: 'auto' };
    } else if (type && type === 'center') {
      res = { marginLeft: 'auto', marginRight: 'auto' };
    }
    return res;
  }

  function parse(str) {
    try {
      const func = new Function('str', `'use strict'; return (${str})`);
      return func(str);
    } catch (e) {
      return false;
    }
  }

  function getValuebyExpression(expression) {
    let res = '';
    if (arrGrids && arrGrids.length && expression) {
      const res1 = expression.replaceAll('data_one', arrGrids[0].record_data);
      const res2 = res1.replaceAll('data_two', arrGrids[1].record_data);
      const formula = parse(res2);
      res = !isNaN(formula) && isFinite(formula) ? parseFloat(formula).toFixed(2) : 0;
    }
    return res;
  }

  function getHelperColor() {
    let res = 'black';
    const opt = isIot ? dataItem.ks_info : dataItem.ks_description;
    const defColor = isJsonValue(opt, 'helptext', 'color');
    if (isJsonValue(opt, 'helptext', 'apply_metric')) {
      const type = isJsonValue3(opt, 'secondary', 'value', 'type');
      if (type && type === 'expression') {
        const metColor = getRangeScore(getValuebyExpression(isJsonValue3(opt, 'secondary', 'value', 'expression')), dataItem.ks_hx_sla_audit_metric_line_ids);
        if (metColor) {
          res = metColor;
        } else {
          res = defColor || 'black';
        }
      } else {
        const metColor = getRangeScore(isJsonValue3(opt, 'secondary', 'value', 'value') && isJsonValue3(opt, 'secondary', 'value', 'value') === 'data_two' ? dataItem.ks_record_count_2 : dataItem.ks_record_count, dataItem.ks_hx_sla_audit_metric_line_ids);
        if (metColor) {
          res = metColor;
        } else {
          res = defColor || 'black';
        }
      }
    } else {
      res = defColor || 'black';
    }
    return res;
  }

  function getSecondaryColor(field) {
    let res = 'black';
    const opt = isIot ? dataItem.ks_info : dataItem.ks_description;
    const defColor = isJsonValue3Field('secondary', field, 'color');
    if (isJsonValue(opt, 'secondary', 'apply_metric')) {
      const type = isJsonValue3(opt, 'secondary', 'value', 'type');
      if (type && type === 'expression') {
        const metColor = getRangeScore(getValuebyExpression(isJsonValue3(opt, 'secondary', 'value', 'expression')), dataItem.ks_hx_sla_audit_metric_line_ids);
        if (metColor) {
          res = metColor;
        } else {
          res = defColor || 'black';
        }
      } else {
        const metColor = getRangeScore(isJsonValue3(opt, 'secondary', 'value', 'value') && isJsonValue3(opt, 'secondary', 'value', 'value') === 'data_two' ? dataItem.ks_record_count_2 : dataItem.ks_record_count, dataItem.ks_hx_sla_audit_metric_line_ids);
        if (metColor) {
          res = metColor;
        } else {
          res = defColor || 'black';
        }
      }
    } else {
      res = defColor || 'black';
    }
    return res;
  }

  function getPrimaryColor(field) {
    let res = 'black';
    const opt = isIot ? dataItem.ks_info : dataItem.ks_description;
    const defColor = isJsonValue3Field('primary', field, 'color');
    if (isJsonValue(opt, 'primary', 'apply_metric')) {
      const type = isJsonValue3(opt, 'primary', 'value', 'type');
      if (type && type === 'expression') {
        const metColor = getRangeScore(getValuebyExpression(isJsonValue3(opt, 'primary', 'value', 'expression')), dataItem.ks_hx_sla_audit_metric_line_ids);
        if (metColor) {
          res = metColor;
        } else {
          res = defColor || 'black';
        }
      } else {
        const metColor = getRangeScore(isJsonValue3(opt, 'primary', 'value', 'value') && isJsonValue3(opt, 'primary', 'value', 'value') === 'data_two' ? dataItem.ks_record_count_2 : dataItem.ks_record_count, dataItem.ks_hx_sla_audit_metric_line_ids);
        if (metColor) {
          res = metColor;
        } else {
          res = defColor || 'black';
        }
      }
    } else {
      res = defColor || 'black';
    }
    return res;
  }

  function getPrimarySubValue() {
    let res = false;
    const isSubValue = isJsonValue3Field('primary', 'value', 'subvalue');
    if (isSubValue) {
      const type = isJsonValue4Field('primary', 'value', 'subvalue', 'type');
      if (type && type === 'expression') {
        res = getValuebyExpression(isJsonValue4Field('primary', 'value', 'subvalue', 'expression'));
      } else {
        res = isJsonValue4Field('primary', 'value', 'subvalue', 'value') && isJsonValue4Field('primary', 'value', 'subvalue', 'value') === 'data_two' ? dataItem.ks_record_count_2 : dataItem.ks_record_count;
      }
    }
    return res;
  }

  function getSecondarySubValue() {
    let res = false;
    const isSubValue = isJsonValue3Field('secondary', 'value', 'subvalue');
    if (isSubValue) {
      const type = isJsonValue4Field('secondary', 'value', 'subvalue', 'type');
      if (type && type === 'expression') {
        res = getValuebyExpression(isJsonValue4Field('secondary', 'value', 'subvalue', 'expression'));
      } else {
        res = isJsonValue4Field('secondary', 'value', 'subvalue', 'value') && isJsonValue4Field('secondary', 'value', 'subvalue', 'value') === 'data_two' ? dataItem.ks_record_count_2 : dataItem.ks_record_count;
      }
    }
    return res;
  }

  const isTitleView = isIot ? dataItem.ks_info && !isJsonString(dataItem.ks_info) : dataItem.ks_description && !isJsonString(dataItem.ks_description);

  const isDetail = isIot ? (dataItem && (dataItem.ks_info && isJsonString(dataItem.ks_info) && getJsonString(dataItem.ks_info).hide_detail_view && getJsonString(dataItem.ks_info).hide_detail_view === 'yes'))
    : (dataItem && dataItem.ks_description && isJsonString(dataItem.ks_description) && getJsonString(dataItem.ks_description).hide_detail_view && getJsonString(dataItem.ks_description).hide_detail_view === 'yes');

  const isHeader = isIot ? (dataItem && (dataItem.ks_info && isJsonString(dataItem.ks_info) && getJsonString(dataItem.ks_info).card_header))
    : (dataItem && dataItem.ks_description && isJsonString(dataItem.ks_description) && getJsonString(dataItem.ks_description).card_header);

  const isInfoCard = isIot ? (dataItem && (dataItem.ks_info && isJsonString(dataItem.ks_info) && getJsonString(dataItem.ks_info).detail_card))
    : (dataItem && dataItem.ks_description && isJsonString(dataItem.ks_description) && getJsonString(dataItem.ks_description).detail_card);

  const onFilterChange = (data) => {
    if (data && data.quickFilterValues && data.quickFilterValues.length && data.quickFilterValues[0].length > 1) {
      setSearchValue(data?.quickFilterValues?.[0]);
      setFilterText(formatFilterData(false, data?.quickFilterValues?.[0]));
    } else if (data.items && data.items.length) {
      if (valueCheck(data.items)) {
        const tColumns = customData && customData[dataItem.ks_model_name] ? customData[dataItem.ks_model_name] : [];
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
        setPage(0);
        setOffset(0);
        setSearch(Math.random());
      }
    } else {
      setFilterText('');
      setCustomFilters([]);
      setSearchValue('');
      setPage(0);
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
      {isHeader && (
        <Card
          className={`${isJsonValue(isIot ? dataItem.ks_info : dataItem.ks_description, 'card', 'backgroundColor') ? 'ticket-card-mixed' : dataItem.ks_data_calculation_type !== 'query'
    && dataItem.ks_record_count && !dataItem.ks_restrict_drilldown
    && !editMode && isModelExists(dataItem.ks_model_name, v16Fields) ? 'ticket-card' : 'ticket-card-no-cursor'} ${
            themes === 'light' ? 'light-mode' : 'dark-mode'
          }`}
          style={{
            background: isJsonValue(isIot ? dataItem.ks_info : dataItem.ks_description, 'card', 'backgroundColor') ? `${isJsonValue(dataItem.ks_info ? dataItem.ks_info : dataItem.ks_description, 'card', 'backgroundColor')} 0% 0% no-repeat padding-box` : 'unset',
            textAlign: isJsonValue(isIot ? dataItem.ks_info : dataItem.ks_description, 'card', 'align') ? isJsonValue(dataItem.ks_info ? dataItem.ks_info : dataItem.ks_description, 'card', 'align') : 'unset',
          }}
        >
          <div
            className="page-actions-header content-center p-2"
            style={{
              backgroundColor: isJsonValue(isIot ? dataItem.ks_info : dataItem.ks_description, 'card_header', 'backgroundColor') ? isJsonValue(dataItem.ks_info ? dataItem.ks_info : dataItem.ks_description, 'card_header', 'backgroundColor') : 'white',
            }}
            onMouseEnter={() => setShowNavigate(true)}
            onMouseLeave={() => setShowNavigate(false)}
          >
            <h1
              style={{
                fontSize: isJsonValue(isIot ? dataItem.ks_info : dataItem.ks_description, 'card_header', 'size') ? isJsonValue(dataItem.ks_info ? dataItem.ks_info : dataItem.ks_description, 'card_header', 'size') : `${width * 8}px`,
                color: isJsonValue(isIot ? dataItem.ks_info : dataItem.ks_description, 'card_header', 'color') ? isJsonValue(dataItem.ks_info ? dataItem.ks_info : dataItem.ks_description, 'card_header', 'color') : 'black',
              }}
              className="ticket-text text-align-left left-head"
            >
              {isJsonValue(isIot ? dataItem.ks_info : dataItem.ks_description, 'card_header', 'icon') ? (
                <FontAwesomeIcon
                  icon={isJsonValue(isIot ? dataItem.ks_info : dataItem.ks_description, 'card_header', 'icon')}
                  style={
                    {
                      height: isJsonValue(isIot ? dataItem.ks_info : dataItem.ks_description, 'card_header', 'size') ? isJsonValue(dataItem.ks_info ? dataItem.ks_info : dataItem.ks_description, 'card_header', 'size') : `${width * 7}px`,
                      width: isJsonValue(isIot ? dataItem.ks_info : dataItem.ks_description, 'card_header', 'size') ? isJsonValue(dataItem.ks_info ? dataItem.ks_info : dataItem.ks_description, 'card_header', 'size') : `${width * 7}px`,
                      color: isJsonValue(isIot ? dataItem.ks_info : dataItem.ks_description, 'card_header', 'icon-color'),
                    }
                  }
                  className="mr-2"
                />

              ) : (
                <CardIcon
                  color={getColorCode(dataItem.ks_background_color)}
                  height={width * 8}
                  width={width * 8}
                />
              )}

              {dataItem.name}
            </h1>
            {showNavigate && !dataItem.ks_restrict_drilldown && isNavigateIcon && (
              <MuiTooltip title={<Typography>Navigate</Typography>}>
                <IconButton className="content-left padding-2px navigate-icon" onClick={() => onClickDataCard()}>
                  <FontAwesomeIcon
                    icon="fa-paper-plane"
                    style={
                      {
                        height: isJsonValue(isIot ? dataItem.ks_info : dataItem.ks_description, 'card_header', 'size') ? isJsonValue(dataItem.ks_info ? dataItem.ks_info : dataItem.ks_description, 'card_header', 'size') : `${width * 7}px`,
                        width: isJsonValue(isIot ? dataItem.ks_info : dataItem.ks_description, 'card_header', 'size') ? isJsonValue(dataItem.ks_info ? dataItem.ks_info : dataItem.ks_description, 'card_header', 'size') : `${width * 7}px`,
                        color: isJsonValue(isIot ? dataItem.ks_info : dataItem.ks_description, 'card_header', 'icon-color'),
                      }
                    }
                    className="mr-1 switch-icon"
                  />
                </IconButton>
              </MuiTooltip>
            )}
          </div>
          <div
            style={{
              padding: `${width * 5}px`,
            }}
            className="ticket-info-outer-no-kpi"
            aria-hidden

          >
            {isInfoCard && (
              <>
                <h6
                  style={{
                    fontSize: isJsonValue3(isIot ? dataItem.ks_info : dataItem.ks_description, 'primary', 'value', 'size') ? isJsonValue3(isIot ? dataItem.ks_info : dataItem.ks_description, 'primary', 'value', 'size') : `${width * 10}px`,
                    color: getPrimaryColor('value'),
                  }}
                  className="ticket-count mb-0"
                >
                  {isJsonValue3Field('primary', 'value', 'prefix') ? isJsonValue3Field('primary', 'value', 'prefix') : ''}
                  {isJsonValue3(isIot ? dataItem.ks_info : dataItem.ks_description, 'primary', 'value', 'type') && isJsonValue3(isIot ? dataItem.ks_info : dataItem.ks_description, 'primary', 'value', 'type') === 'expression'
                    ? getValuebyExpression(isJsonValue3(isIot ? dataItem.ks_info : dataItem.ks_description, 'primary', 'value', 'expression'))
                    : numberWithCommas(getResValue(isJsonValue3(isIot ? dataItem.ks_info : dataItem.ks_description, 'primary', 'value', 'value') && isJsonValue3(isIot ? dataItem.ks_info : dataItem.ks_description, 'primary', 'value', 'value') === 'data_two' ? dataItem.ks_record_count_2 : dataItem.ks_record_count))}
                  {isJsonValue3Field('primary', 'value', 'suffix') ? isJsonValue3Field('primary', 'value', 'suffix') : ''}
                  {getPrimarySubValue() && (
                    <span style={{ fontSize: isJsonValue4Field('primary', 'value', 'subvalue', 'size') ? isJsonValue4Field('primary', 'value', 'subvalue', 'size') : `${width * 7}px` }}>
                      /
                      {isJsonValue4Field('primary', 'value', 'subvalue', 'prefix') ? isJsonValue4Field('primary', 'value', 'subvalue', 'prefix') : ''}
                      {getPrimarySubValue()}
                      {isJsonValue4Field('primary', 'value', 'subvalue', 'suffix') ? isJsonValue4Field('primary', 'value', 'subvalue', 'suffix') : ''}
                    </span>
                  )}
                </h6>
                <p
                  style={{
                    fontSize: isJsonValue3(isIot ? dataItem.ks_info : dataItem.ks_description, 'primary', 'text', 'size') ? isJsonValue3(isIot ? dataItem.ks_info : dataItem.ks_description, 'primary', 'text', 'size') : `${width * 5}px`,
                    color: getPrimaryColor('text'),
                  }}
                  className="ticket-text mb-2"
                >
                  {isJsonValue3(isIot ? dataItem.ks_info : dataItem.ks_description, 'primary', 'text', 'label') ? isJsonValue3(isIot ? dataItem.ks_info : dataItem.ks_description, 'primary', 'text', 'label') : 'Text'}
                </p>
                <p
                  className="ticket-text mb-2"
                >
                  <span
                    style={{
                      fontSize: isJsonValue3(isIot ? dataItem.ks_info : dataItem.ks_description, 'secondary', 'text', 'size') ? isJsonValue3(isIot ? dataItem.ks_info : dataItem.ks_description, 'secondary', 'text', 'size') : `${width * 4}px`,
                      color: getSecondaryColor('text'),
                    }}
                  >
                    {isJsonValue3(isIot ? dataItem.ks_info : dataItem.ks_description, 'secondary', 'text', 'label') ? isJsonValue3(isIot ? dataItem.ks_info : dataItem.ks_description, 'secondary', 'text', 'label') : 'Text'}
                  </span>
                  <span
                    style={{
                      fontSize: isJsonValue3(isIot ? dataItem.ks_info : dataItem.ks_description, 'secondary', 'value', 'size') ? isJsonValue3(isIot ? dataItem.ks_info : dataItem.ks_description, 'secondary', 'value', 'size') : `${width * 4}px`,
                      color: getSecondaryColor('value'),
                    }}
                    className="ml-2"
                  >
                    {isJsonValue3Field('secondary', 'value', 'prefix') ? isJsonValue3Field('secondary', 'value', 'prefix') : ''}
                    {isJsonValue3(isIot ? dataItem.ks_info : dataItem.ks_description, 'secondary', 'value', 'type') && isJsonValue3(isIot ? dataItem.ks_info : dataItem.ks_description, 'secondary', 'value', 'type') === 'expression'
                      ? getValuebyExpression(isJsonValue3(isIot ? dataItem.ks_info : dataItem.ks_description, 'secondary', 'value', 'expression'))
                      : numberWithCommas(getResValue(isJsonValue3(isIot ? dataItem.ks_info : dataItem.ks_description, 'secondary', 'value', 'value') && isJsonValue3(isIot ? dataItem.ks_info : dataItem.ks_description, 'secondary', 'value', 'value') === 'data_two' ? dataItem.ks_record_count_2 : dataItem.ks_record_count))}
                    {isJsonValue3Field('secondary', 'value', 'suffix') ? isJsonValue3Field('secondary', 'value', 'suffix') : ''}
                    {getSecondarySubValue() && (
                      <span style={{ fontSize: isJsonValue4Field('secondary', 'value', 'subvalue', 'size') ? isJsonValue4Field('secondary', 'value', 'subvalue', 'size') : `${width * 3}px` }}>
                        /
                        {isJsonValue4Field('secondary', 'value', 'subvalue', 'prefix') ? isJsonValue4Field('secondary', 'value', 'subvalue', 'prefix') : ''}
                        {getSecondarySubValue()}
                        {isJsonValue4Field('secondary', 'value', 'subvalue', 'suffix') ? isJsonValue4Field('secondary', 'value', 'subvalue', 'suffix') : ''}
                      </span>
                    )}
                  </span>

                </p>
                <p
                  style={{
                    fontSize: isJsonValue(isIot ? dataItem.ks_info : dataItem.ks_description, 'helptext', 'size') ? isJsonValue(isIot ? dataItem.ks_info : dataItem.ks_description, 'helptext', 'size') : `${width * 3}px`,
                    color: getHelperColor(),
                  }}
                  className="ticket-text"
                >
                  {isJsonValue(isIot ? dataItem.ks_info : dataItem.ks_description, 'helptext', 'apply_metric')

                    ? getRangeLegend(
                      isJsonValue3(isIot ? dataItem.ks_info : dataItem.ks_description, 'secondary', 'value', 'type') && isJsonValue3(isIot ? dataItem.ks_info : dataItem.ks_description, 'secondary', 'value', 'type') === 'expression'
                        ? getValuebyExpression(isJsonValue3(isIot ? dataItem.ks_info : dataItem.ks_description, 'secondary', 'value', 'expression')) : isJsonValue3(isIot ? dataItem.ks_info : dataItem.ks_description, 'secondary', 'value', 'value') && isJsonValue3(isIot ? dataItem.ks_info : dataItem.ks_description, 'secondary', 'value', 'value') === 'data_two' ? dataItem.ks_record_count_2 : dataItem.ks_record_count,
                      dataItem.ks_hx_sla_audit_metric_line_ids,
                    )
                    : isJsonValue(isIot ? dataItem.ks_info : dataItem.ks_description, 'helptext', 'label') ? isJsonValue(isIot ? dataItem.ks_info : dataItem.ks_description, 'helptext', 'label') : ''}
                </p>
              </>
            )}
            {!isInfoCard && (
              <>
                {!(dataItem.ks_info && isJsonString(dataItem.ks_info) && (getJsonString(dataItem.ks_info).type === 'expression' || getJsonString(dataItem.ks_info).type === 'metric' || getJsonString(dataItem.ks_info).type === 'value')) && (
                  <p
                    style={{
                      fontSize: isJsonValue(dataItem.ks_info ? dataItem.ks_info : dataItem.ks_description, 'card-value', 'size') ? isJsonValue(dataItem.ks_info ? dataItem.ks_info : dataItem.ks_description, 'card-value', 'size') : `${width * 10}px`,
                      color: isJsonValue(dataItem.ks_info ? dataItem.ks_info : dataItem.ks_description, 'card-value', 'color') ? isJsonValue(dataItem.ks_info ? dataItem.ks_info : dataItem.ks_description, 'card-value', 'color') : getRangeScore(
                        parseFloat(dataItem.ks_record_count),
                        dataItem.ks_hx_sla_audit_metric_line_ids,
                      ),
                    }}
                    className="ticket-count "
                  >
                    {((dataItem.ks_dashboard_item_type === 'ks_kpi'
                      && (dataItem.ks_data_comparison === 'None'
                        || dataItem.ks_data_comparison === 'Percentage'))
                      || dataItem.ks_dashboard_item_type === 'ks_tile') && (
                        <>{numberWithCommas(getResValue(dataItem.ks_record_count))}</>
                    )}
                    {dataItem.ks_dashboard_item_type === 'ks_kpi'
                      && dataItem.ks_data_comparison === 'Sum'
                      && arrGrids
                      && arrGrids.length > 1 && (
                        <>{dataItem.ks_record_count + arrGrids[1].record_data}</>
                    )}
                    {dataItem.ks_dashboard_item_type === 'ks_kpi'
                      && dataItem.ks_data_comparison === 'None'
                      && arrGrids
                      && arrGrids.length > 1 && (
                        <>
                          /
                          {arrGrids[1].record_data}
                        </>
                    )}
                    {dataItem.ks_dashboard_item_type === 'ks_kpi'
                      && dataItem.ks_data_comparison === 'Percentage'
                      && arrGrids
                      && arrGrids.length > 1 && (
                        <span className="ticket-percentage">
                          {' '}
                          (
                          {getPercentage(
                            arrGrids[1].record_data,
                            arrGrids[0].record_data,
                          )}
                          %)
                        </span>
                    )}
                    {dataItem.ks_hx_sla_audit_metric_line_ids
                      && dataItem.ks_hx_sla_audit_metric_line_ids.length > 0
                      && (
                        <span className="ticket-percentage">
                          {' '}
                          (
                          {getRangeLegend(
                            parseFloat(dataItem.ks_record_count),
                            dataItem.ks_hx_sla_audit_metric_line_ids,
                          )}
                          )
                        </span>
                      )}
                  </p>
                )}
                {(dataItem.ks_info && isJsonString(dataItem.ks_info) && (getJsonString(dataItem.ks_info).type === 'expression' || getJsonString(dataItem.ks_info).type === 'metric' || getJsonString(dataItem.ks_info).type === 'value')) && (
                  <>
                    {getJsonString(dataItem.ks_info).type === 'metric' && (
                      <p
                        className="ticket-count "
                        style={{
                          color: getRangeColor(
                            parseFloat(getPercentage(
                              arrGrids[1].record_data,
                              arrGrids[0].record_data,
                            )).toFixed(2),
                            dataItem.ks_hx_sla_audit_metric_line_ids,
                          ),
                          fontSize: isJsonValue(dataItem.ks_info ? dataItem.ks_info : dataItem.ks_description, 'card-value', 'size') ? isJsonValue(dataItem.ks_info ? dataItem.ks_info : dataItem.ks_description, 'card-value', 'size') : `${width * 10}px`,
                        }}
                      >
                        {getRangeLegend(
                          getPercentage(
                            arrGrids[1].record_data,
                            arrGrids[0].record_data,
                          ),
                          dataItem.ks_hx_sla_audit_metric_line_ids,
                        )}
                        {getJsonString(dataItem.ks_info).value === 'true' ? (
                          <span style={{
                            color: getRangeColor(
                              parseFloat(getPercentage(
                                arrGrids[1].record_data,
                                arrGrids[0].record_data,
                              )).toFixed(2),
                              dataItem.ks_hx_sla_audit_metric_line_ids,
                            ),
                            fontSize: `${width * 6}px`,
                          }}
                          >
                            {' '}
                            (
                            {getPercentage(arrGrids[1].record_data, arrGrids[0].record_data)}
                            %
                            )
                          </span>
                        ) : (
                          <span />
                        )}
                      </p>
                    )}
                    {getJsonString(dataItem.ks_info).type === 'expression' && (
                      <p
                        className="ticket-count "
                        style={{
                          fontSize: isJsonValue(dataItem.ks_info ? dataItem.ks_info : dataItem.ks_description, 'card-value', 'size') ? isJsonValue(dataItem.ks_info ? dataItem.ks_info : dataItem.ks_description, 'card-value', 'size') : `${width * 10}px`,
                        }}
                      >
                        {parseFloat(100 - getPercentage(
                          arrGrids[1].record_data,
                          arrGrids[0].record_data,
                        )).toFixed(2)}
                        {'  '}
                        %

                        {getJsonString(dataItem.ks_info).value === 'true' ? (
                          <span style={{
                            fontSize: `${width * 6}px`,
                          }}
                          >
                            {' '}
                            (
                            {getValuebyType()}
                            )
                          </span>
                        ) : (
                          <span />
                        )}
                      </p>
                    )}
                    {getJsonString(dataItem.ks_info).type === 'value' && (
                      <p
                        className="ticket-count "
                        style={{
                          fontSize: isJsonValue(dataItem.ks_info ? dataItem.ks_info : dataItem.ks_description, 'card-value', 'size') ? isJsonValue(dataItem.ks_info ? dataItem.ks_info : dataItem.ks_description, 'card-value', 'size') : `${width * 10}px`,
                        }}
                      >
                        {parseFloat(getPercentage(
                          arrGrids[1].record_data,
                          arrGrids[0].record_data,
                        )).toFixed(2)}
                        {'  '}
                        %
                        {getJsonString(dataItem.ks_info).value === 'true' ? (
                          <span style={{
                            fontSize: `${width * 6}px`,
                          }}
                          >
                            {' '}
                            (
                            {getValuebyType()}
                            )
                          </span>
                        ) : (
                          <span />
                        )}
                      </p>
                    )}
                  </>
                )}
              </>
            )}
          </div>
          {!isInfoCard && (
            <>
              {dataItem.ks_dashboard_item_type === 'ks_kpi'
                && dataItem.ks_goal_enable && (
                  <>
                    <hr className="card-hr" />
                  </>
              )}

              {dataItem.ks_dashboard_item_type === 'ks_kpi'
                && totalTarget
                && dataItem.ks_goal_enable && (
                  <>
                    <div className="percentage-text-box">
                      {dataItem.ks_goal_enable && (
                        <>
                          <RxArrowTopRight size={width * 10} color="#1DBC77" />
                          <p
                            style={{
                              fontSize: `${width * 7}px`,
                            }}
                            className="percentage-text"
                          >
                            {`${newpercalculateGoal(
                              dataItem.ks_record_count,
                              dataItem.ks_standard_goal_value,
                            )}%`}
                          </p>
                        </>
                      )}
                      {prevRec && (
                        <>
                          <RxArrowBottomLeft size={width * 10} color="#1DBC77" />
                          <p
                            style={{
                              fontSize: `${width * 7}px`,
                            }}
                            className="percentage-text"
                          >
                            {`${newpercalculatePrev(
                              dataItem.ks_record_count,
                              prevRec,
                            )}%`}
                          </p>
                        </>
                      )}
                    </div>
                  </>
              )}
              {isJsonValue(dataItem.ks_info ? dataItem.ks_info : dataItem.ks_description, 'card', 'subText') && (
                <p
                  style={{
                    fontSize: isJsonValue(dataItem.ks_info ? dataItem.ks_info : dataItem.ks_description, 'subText', 'size') ? isJsonValue(dataItem.ks_info ? dataItem.ks_info : dataItem.ks_description, 'subText', 'size') : `${width * 7}px`,
                    color: isJsonValue(dataItem.ks_info ? dataItem.ks_info : dataItem.ks_description, 'subText', 'color') ? isJsonValue(dataItem.ks_info ? dataItem.ks_info : dataItem.ks_description, 'subText', 'color') : 'unset',
                    padding: '10px',
                  }}
                  className="mb-2 ticket-count"
                >
                  {isJsonValue(dataItem.ks_info ? dataItem.ks_info : dataItem.ks_description, 'card', 'subText')}
                </p>
              )}
            </>
          )}
        </Card>
      )}
      {!isHeader && (!isIot || !dataItem.ks_info || !isJsonString(dataItem.ks_info) || (dataItem.ks_info && isJsonString(dataItem.ks_info) && getJsonString(dataItem.ks_info).type !== 'radialBar')) && (
        <Card
          className={`${isJsonValue(dataItem.ks_info ? dataItem.ks_info : dataItem.ks_description, 'card', 'backgroundColor')
            ? 'ticket-card-mixed'
            : isCardClickable && !dataItem.ks_restrict_drilldown && !editMode
              ? 'ticket-card'
              : 'ticket-card-no-cursor'} ${
            themes === 'light' ? 'light-mode' : 'dark-mode'
          }`}
          style={{
            background: isJsonValue(dataItem.ks_info ? dataItem.ks_info : dataItem.ks_description, 'card', 'backgroundColor')
              ? `${isJsonValue(dataItem.ks_info ? dataItem.ks_info : dataItem.ks_description, 'card', 'backgroundColor')} 0% 0% no-repeat padding-box`
              : 'unset',
            textAlign: isJsonValue(dataItem.ks_info ? dataItem.ks_info : dataItem.ks_description, 'card', 'align')
              ? isJsonValue(dataItem.ks_info ? dataItem.ks_info : dataItem.ks_description, 'card', 'align')
              : 'unset',
          }}
        >
          <div
            style={{
              padding: `${width * 5}px`,
            }}
            className={
              dataItem.ks_goal_enable && totalTarget
                ? `ticket-info-outer ${themes === 'light' ? 'light-mode' : 'dark-mode'}`
                : `ticket-info-outer-no-kpi ${themes === 'light' ? 'light-mode' : 'dark-mode'}`
            }
            aria-hidden
            onClick={() => onClickDataCard()}
          >
            {/* <CheckSvg
            style={{
              height: `${width * 15}px`,
              width: `${width * 15}px`,
            }}
            className="ticket-img"
            fill={getColorCode(dataItem.ks_background_color)}
          /> */}
            {isJsonValue(isIot ? dataItem.ks_info : dataItem.ks_description, 'card', 'icon') ? (
              <FontAwesomeIcon
                icon={isJsonValue(isIot ? dataItem.ks_info : dataItem.ks_description, 'card', 'icon')}
                style={{ ...isJsonValue(dataItem.ks_info ? dataItem.ks_info : dataItem.ks_description, 'card', 'align') ? getSvgAlign(isJsonValue(dataItem.ks_info ? dataItem.ks_info : dataItem.ks_description, 'card', 'align')) : {}, ...{ height: `${width * 12}px`, width: `${width * 12}px`, color: isJsonValue(isIot ? dataItem.ks_info : dataItem.ks_description, 'card', 'icon-color') } }}
              />

            ) : (
              <CardIcon
                color={getColorCode(dataItem.ks_background_color)}
                height={width * 15}
                width={width * 15}
                style={isJsonValue(dataItem.ks_info ? dataItem.ks_info : dataItem.ks_description, 'card', 'align') ? getSvgAlign(isJsonValue(dataItem.ks_info ? dataItem.ks_info : dataItem.ks_description, 'card', 'align')) : false}
              />
            )}
            <h1
              style={{
                fontSize: isJsonValue(dataItem.ks_info ? dataItem.ks_info : dataItem.ks_description, 'card-text', 'size') ? isJsonValue(dataItem.ks_info ? dataItem.ks_info : dataItem.ks_description, 'card-text', 'size') : `${width * 8}px`,
                color: isJsonValue(dataItem.ks_info ? dataItem.ks_info : dataItem.ks_description, 'card-text', 'color') ? isJsonValue(dataItem.ks_info ? dataItem.ks_info : dataItem.ks_description, 'card-text', 'color') : 'unset',
              }}
              className={`ticket-text ${themes === 'light' ? 'light-mode' : 'dark-mode'}`}
            >
              {dataItem.name}
              {isTitleView && (
              <FaInfoCircle className="ml-2 font-weight-800" size={width * 7} onMouseEnter={() => onViewInfo(dataItem.name)} color="#17a2b8" onClick={() => onViewInfo(dataItem.name)} />
              )}
            </h1>
            {!(dataItem.ks_info && isJsonString(dataItem.ks_info) && (getJsonString(dataItem.ks_info).type === 'expression' || getJsonString(dataItem.ks_info).type === 'metric' || getJsonString(dataItem.ks_info).type === 'value')) && (
              <p
                style={{
                  fontSize: isJsonValue(dataItem.ks_info ? dataItem.ks_info : dataItem.ks_description, 'card-value', 'size') ? isJsonValue(dataItem.ks_info ? dataItem.ks_info : dataItem.ks_description, 'card-value', 'size') : `${width * 10}px`,
                  color: isJsonValue(dataItem.ks_info ? dataItem.ks_info : dataItem.ks_description, 'card-value', 'color') ? isJsonValue(dataItem.ks_info ? dataItem.ks_info : dataItem.ks_description, 'card-value', 'color') : getRangeScore(
                    parseFloat(dataItem.ks_record_count),
                    dataItem.ks_hx_sla_audit_metric_line_ids,
                  ),
                }}
                className="ticket-count"
              >
                {((dataItem.ks_dashboard_item_type === 'ks_kpi'
                  && (dataItem.ks_data_comparison === 'None'
                    || dataItem.ks_data_comparison === 'Percentage'))
                  || dataItem.ks_dashboard_item_type === 'ks_tile') && (
                    <>{numberWithCommas(getResValue(dataItem.ks_record_count))}</>
                )}
                {dataItem.ks_dashboard_item_type === 'ks_kpi'
                  && dataItem.ks_data_comparison === 'Sum'
                  && arrGrids
                  && arrGrids.length > 1 && (
                    <>{dataItem.ks_record_count + arrGrids[1].record_data}</>
                )}
                {dataItem.ks_dashboard_item_type === 'ks_kpi'
                  && dataItem.ks_data_comparison === 'None'
                  && arrGrids
                  && arrGrids.length > 1 && (
                    <>
                      /
                      {arrGrids[1].record_data}
                    </>
                )}
                {dataItem.ks_dashboard_item_type === 'ks_kpi'
                  && dataItem.ks_data_comparison === 'Percentage'
                  && arrGrids
                  && arrGrids.length > 1 && (
                    <span className="ticket-percentage">
                      {' '}
                      (
                      {getPercentage(
                        arrGrids[1].record_data,
                        arrGrids[0].record_data,
                      )}
                      %)
                    </span>
                )}
                {dataItem.ks_hx_sla_audit_metric_line_ids
                  && dataItem.ks_hx_sla_audit_metric_line_ids.length > 0
                  && (
                    <span className="ticket-percentage">
                      {' '}
                      (
                      {getRangeLegend(
                        parseFloat(dataItem.ks_record_count),
                        dataItem.ks_hx_sla_audit_metric_line_ids,
                      )}
                      )
                    </span>
                  )}
              </p>
            )}
            {(dataItem.ks_info && isJsonString(dataItem.ks_info) && (getJsonString(dataItem.ks_info).type === 'expression' || getJsonString(dataItem.ks_info).type === 'metric' || getJsonString(dataItem.ks_info).type === 'value')) && (
              <>
                {getJsonString(dataItem.ks_info).type === 'metric' && (
                  <p
                    className="ticket-count"
                    style={{
                      color: getRangeColor(
                        parseFloat(getPercentage(
                          arrGrids[1].record_data,
                          arrGrids[0].record_data,
                        )).toFixed(2),
                        dataItem.ks_hx_sla_audit_metric_line_ids,
                      ),
                      fontSize: isJsonValue(dataItem.ks_info ? dataItem.ks_info : dataItem.ks_description, 'card-value', 'size') ? isJsonValue(dataItem.ks_info ? dataItem.ks_info : dataItem.ks_description, 'card-value', 'size') : `${width * 10}px`,
                    }}
                  >
                    {getRangeLegend(
                      getPercentage(
                        arrGrids[1].record_data,
                        arrGrids[0].record_data,
                      ),
                      dataItem.ks_hx_sla_audit_metric_line_ids,
                    )}
                    {getJsonString(dataItem.ks_info).value === 'true' ? (
                      <span style={{
                        color: getRangeColor(
                          parseFloat(getPercentage(
                            arrGrids[1].record_data,
                            arrGrids[0].record_data,
                          )).toFixed(2),
                          dataItem.ks_hx_sla_audit_metric_line_ids,
                        ),
                        fontSize: `${width * 6}px`,
                      }}
                      >
                        {' '}
                        (
                        {getPercentage(arrGrids[1].record_data, arrGrids[0].record_data)}
                        %
                        )
                      </span>
                    ) : (
                      <span />
                    )}
                  </p>
                )}
                {getJsonString(dataItem.ks_info).type === 'expression' && (
                  <p
                    className="ticket-count"
                    style={{
                      fontSize: isJsonValue(dataItem.ks_info ? dataItem.ks_info : dataItem.ks_description, 'card-value', 'size') ? isJsonValue(dataItem.ks_info ? dataItem.ks_info : dataItem.ks_description, 'card-value', 'size') : `${width * 10}px`,
                    }}
                  >
                    {parseFloat(100 - getPercentage(
                      arrGrids[1].record_data,
                      arrGrids[0].record_data,
                    )).toFixed(2)}
                    {'  '}
                    %

                    {getJsonString(dataItem.ks_info).value === 'true' ? (
                      <span style={{
                        fontSize: `${width * 6}px`,
                      }}
                      >
                        {' '}
                        (
                        {getValuebyType()}
                        )
                      </span>
                    ) : (
                      <span />
                    )}
                  </p>
                )}
                {getJsonString(dataItem.ks_info).type === 'value' && (
                  <p
                    className="ticket-count"
                    style={{
                      fontSize: isJsonValue(dataItem.ks_info ? dataItem.ks_info : dataItem.ks_description, 'card-value', 'size') ? isJsonValue(dataItem.ks_info ? dataItem.ks_info : dataItem.ks_description, 'card-value', 'size') : `${width * 10}px`,
                    }}
                  >
                    {parseFloat(getPercentage(
                      arrGrids[1].record_data,
                      arrGrids[0].record_data,
                    )).toFixed(2)}
                    {'  '}
                    %
                    {getJsonString(dataItem.ks_info).value === 'true' ? (
                      <span style={{
                        fontSize: `${width * 6}px`,
                      }}
                      >
                        {' '}
                        (
                        {getValuebyType()}
                        )
                      </span>
                    ) : (
                      <span />
                    )}
                  </p>
                )}
              </>
            )}
          </div>
          {dataItem.ks_dashboard_item_type === 'ks_kpi'
            && dataItem.ks_goal_enable && (
              <>
                <hr className="card-hr" />
              </>
          )}

          {dataItem.ks_dashboard_item_type === 'ks_kpi'
            && totalTarget
            && dataItem.ks_goal_enable && (
              <>
                <div className="percentage-text-box">
                  {dataItem.ks_goal_enable && (
                    <>
                      <RxArrowTopRight size={width * 10} color="#1DBC77" />
                      <p
                        style={{
                          fontSize: `${width * 7}px`,
                        }}
                        className="percentage-text"
                      >
                        {`${newpercalculateGoal(
                          dataItem.ks_record_count,
                          dataItem.ks_standard_goal_value,
                        )}%`}
                      </p>
                    </>
                  )}
                  {prevRec && (
                    <>
                      <RxArrowBottomLeft size={width * 10} color="#1DBC77" />
                      <p
                        style={{
                          fontSize: `${width * 7}px`,
                        }}
                        className="percentage-text"
                      >
                        {`${newpercalculatePrev(
                          dataItem.ks_record_count,
                          prevRec,
                        )}%`}
                      </p>
                    </>
                  )}
                </div>
              </>
          )}
          {isJsonValue(dataItem.ks_info ? dataItem.ks_info : dataItem.ks_description, 'card', 'subText') && (
            <p
              style={{
                fontSize: isJsonValue(dataItem.ks_info ? dataItem.ks_info : dataItem.ks_description, 'subText', 'size') ? isJsonValue(dataItem.ks_info ? dataItem.ks_info : dataItem.ks_description, 'subText', 'size') : `${width * 7}px`,
                color: isJsonValue(dataItem.ks_info ? dataItem.ks_info : dataItem.ks_description, 'subText', 'color') ? isJsonValue(dataItem.ks_info ? dataItem.ks_info : dataItem.ks_description, 'subText', 'color') : 'unset',
                padding: '10px',
              }}
              className="mb-2 ticket-count"
            >
              {isJsonValue(dataItem.ks_info ? dataItem.ks_info : dataItem.ks_description, 'card', 'subText')}
            </p>
          )}
        </Card>
      )}
      {!isHeader && isIot && dataItem.ks_info && isJsonString(dataItem.ks_info) && getJsonString(dataItem.ks_info).type === 'radialBar' && (
        <Card
          className={`${
            isCardClickable && !dataItem.ks_restrict_drilldown && !editMode
              ? 'ticket-card'
              : 'ticket-card-no-cursor'
          } ${themes === 'light' ? 'light-mode' : 'dark-mode'}`}
        >
          <div
            style={{
              padding: `${width * 7}px`,
            }}
            aria-hidden
            onClick={() => onClickDataCard()}
          >
            {/* <ReactApexChart
              options={options}
              series={[getPercentageValue()]}
              type="radialBar"
              height={height + 50}
            /> */}
            <Chart
              options={options}
              series={[getPercentageValue()]}
              type="radialBar"
              height={width * 90}
            />
            <h1
              style={{
                fontSize: `${width * 8}px`,
              }}
              className="ticket-text text-center"
            >
              {dataItem.name}
            </h1>
            <p
              style={{
                fontSize: `${width * 5}px`,
                color: getRangeScore(
                  parseFloat(dataItem.ks_record_count),
                  dataItem.ks_hx_sla_audit_metric_line_ids,
                ),
              }}
              className="m-0 text-center"
            >
              {getRangeLegend(
                parseFloat(dataItem.ks_record_count),
                dataItem.ks_hx_sla_audit_metric_line_ids,
              )}
            </p>
            {isIot && dataItem.ks_info && isJsonString(dataItem.ks_info) && getJsonString(dataItem.ks_info).type === 'radialBar' && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: '3%',
                }}
              >
                <img
                  src={getCardIcon(dataItem.name)}
                  alt="card-img"
                  height={width * 20}
                  width={width * 20}
                />
              </Box>
            )}
          </div>
        </Card>
      )}
      <Dialog PaperProps={{ style: { width: '600px', maxWidth: '600px' } }} maxWidth="xl" open={titleModal}>
        <DialogHeader title={titleText} onClose={() => onCloseInfo()} response={false} imagePath={false} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <div className="p-3">
              {isIot && dataItem.ks_info && !isJsonString(dataItem.ks_info) && (
              <p className="font-family-tab font-weight-500">{dataItem.ks_info}</p>
              )}
              {!isIot && dataItem.ks_description && !isJsonString(dataItem.ks_description) && (
              <p className="font-family-tab font-weight-500">{dataItem.ks_description}</p>
              )}
            </div>
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Dialog
        PaperProps={{
          sx: {
            width: '90vw',
            height: '95vh',
            maxWidth: 'none',
            maxHeight: 'none',
          },
        }}
        open={
          showModal
          && ((ninjaChartInfo && ninjaChartInfo.loading)
            || (updateNinjaChartItemInfo && updateNinjaChartItemInfo.loading))
        }
      >
        <div className="line-chart-box-expand">
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '80%',
              height: '100%',
            }}
          >
            <Box
              sx={{
                height: '90%',
                width: '90%',
              }}
            >
              {((ninjaChartInfo && ninjaChartInfo.loading)
                || (updateNinjaChartItemInfo
                  && updateNinjaChartItemInfo.loading)) && (
                  <PageLoader type="max" />
              )}
            </Box>
          </Box>
        </div>
      </Dialog>

      {showModal
        && !(
          (ninjaChartInfo && ninjaChartInfo.loading)
          || (updateNinjaChartItemInfo && updateNinjaChartItemInfo.loading)
        ) && (
          <Box
            sx={{
              height: '90%',
              width: '90%',
            }}
          >
            {chartItemData && (
              <>
                {(chartItemData.ks_dashboard_item_type === 'ks_pie_chart'
                  || chartItemData.ks_dashboard_item_type
                  === 'ks_doughnut_chart') && (
                    <PieChart
                      dashboardColors={dashboardColors}
                      chartData={chartItemData}
                      // height={getAreas(dl.id, dl.web_sequence).h}
                      // width={getDimension(dl.id).w}
                      dashboardUuid={false}
                      dashboardCode={false}
                      isShowModal
                      setChildShow={() => setShowModal(false)}
                    />
                )}
                {(chartItemData.ks_dashboard_item_type === 'ks_area_chart'
                  || chartItemData.ks_dashboard_item_type === 'ks_line_chart'
                  || chartItemData.ks_dashboard_item_type
                  === 'ks_bar_multi_chart'
                  || chartItemData.ks_dashboard_item_type
                  === 'ks_bar_advance_chart'
                  || chartItemData.ks_dashboard_item_type === 'ks_bar_chart'
                  || chartItemData.ks_dashboard_item_type
                  === 'ks_horizontalBar_chart') && (
                    <BarChart
                      code={code}
                      selectedDateTag={selectedDateTag}
                      dashboardColors={dashboardColors}
                      chartData={chartItemData}
                      // height={getAreas(dl.id, dl.web_sequence).h}
                      // width={getDimension(dl.id).w}
                      dashboardUuid={false}
                      dashboardCode={false}
                      isShowModal
                      setChildShow={() => setShowModal(false)}
                    />
                )}
              </>
            )}
          </Box>
      )}
      <Drawer
        PaperProps={{
          sx: { width: '85%' },
        }}
        anchor="right"
        open={isViewList}
      >
        <DrawerHeader
          headerName={listName}
          imagePath={false}
          onClose={() => {
            setViewList(false);
            setCustomFilters([]);
            setFilterText('');
            setModel(false);
            setOffset(0);
            setPage(0);
          }}
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
        <div className="px-3">
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
            setAllReport={setAllReport}
            modelName={modelName}
            exportFileName={listName}
            isLargeReport={isLargeReport}
            setLargeReport={setLargeReport}
            exportReportData={exportReportData}
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
        open={dashboardModal}
      >
        <DrawerHeader
          headerName={
            ninjaDrillCode
              && ninjaDrillCode.data
              && ninjaDrillCode.data.length > 0
              ? ninjaDrillCode.data[0].name
              : ''
          }
          imagePath={false}
          onClose={() => onCloseDashboard()}
        />
        {isShow
          && ninjaDrillCode
          && ninjaDrillCode.data
          && ninjaDrillCode.data.length > 0
          && !ninjaDrillCode.loading && (
            <DashboardDrillView
              code={ninjaDrillCode.data[0].id}
              defaultDate={ninjaDrillCode.data[0].ks_date_filter_selection}
              dashboardInterval={ninjaDrillCode.data[0].ks_set_interval}
              dashboardLayouts={isIot && ninjaDrillCode.data[0].dashboard_json
                && isJsonString(ninjaDrillCode.data[0].dashboard_json)
                ? JSON.parse(ninjaDrillCode.data[0].dashboard_json)
                : ninjaDrillCode.data[0].dashboard_json}
              dashboardColors={ninjaDrillCode.data[0].ks_dashboard_items_ids}
              isIot={isIot}
              dashboardUuid={dashboardUuid && dataItem && dataItem.ks_info && isJsonString(dataItem.ks_info) && getJsonString(dataItem.ks_info).dashboard_uuid ? getJsonString(dataItem.ks_info).dashboard_uuid : dashboardUuid}
              dashboardCode={ninjaDrillCode.data[0].code ? ninjaDrillCode.data[0].code.replace('V3', '') : ''}
            />
        )}
        {(!isShow || (ninjaDrillCode && ninjaDrillCode.loading)) && (
          <PageLoader type="max" />
        )}
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
    </>
  );
};

export default DataCard;
