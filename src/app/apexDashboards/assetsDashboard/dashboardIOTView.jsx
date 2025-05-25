/* eslint-disable no-underscore-dangle */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-cycle */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect, useMemo } from 'react';
import {
  MdOutlineOpenInFull,
  MdOutlineCloseFullscreen,
} from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import {
  DatePicker,
} from 'antd';
import html2canvas from 'html2canvas';
import IconButton from '@mui/material/IconButton';
import {
  Box as MuiBox,
  Typography,
  Dialog,
  ListItem,
  TextField,
  ListItemButton,
  Divider,
  Button,
} from '@mui/material';
import { Autocomplete } from '@material-ui/lab';
import { CircularProgress } from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import { IoCloseOutline, IoArrowBack } from 'react-icons/io5';
import { BsPencil } from 'react-icons/bs';
import TodayOutlinedIcon from '@mui/icons-material/TodayOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import PageLoader from '@shared/pageLoader';
import ErrorContent from '@shared/errorContent';
import MuiTooltip from '@shared/muiTooltip';

import ChartCards from './chartCardsIOT';
import './style.css';
import './dashboardOuter.css';
import { AddThemeColor, DateFilterButtons } from '../../themes/theme';
import { ThemeProvider } from '../../ThemeContext';
import {
  getNinjaDashboard,
  getNinjaDashboardTimer,
  updateDashboardLayouts,
  resetDefaultFilterInfo,
  resetNinjaDashboard,
  storeSldData,
  getDefaultFilter,
} from '../../analytics/analytics.service';
import {
  generateErrorMessage,
  getListOfModuleOperations,
  getCompanyTimezoneDateLocal,
} from '../../util/appUtils';
import customData from '../data/customData.json';
import StaticDataExportFull from './staticDataExportFull';
import {
  getArrayNewUpdateFormat,
  getDateRange,
  getCompanyTimezoneDayjsLocal,
} from '../utils/utils';

const appModels = require('../../util/appModels').default;

const { RangePicker } = DatePicker;
const themes = ThemeProvider;
const DashboardIOTView = React.memo((props) => {
  const {
    dashboardCode, meterName, isSLDButton, dashboardUuid, advanceFilter, navigateLevel, setDashboardCode, isCxo, isSLD, dashboardTitle, isIAQ, hideExpand, defaultFilter,
  } = props;
  const dispatch = useDispatch();
  const [dateRangeDialog, setDateRangeDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [expandMode, setExpandMode] = useState(false);
  const [customLayouts, setCustomLayouts] = useState({});
  const [isGroupFilter, setGroupFilter] = useState(false);
  const [isDataFilter, showDateFilter] = useState(false);
  const [customDateValue, setCustomDateValue] = useState([null, null]);

  const [isTimer, setTimer] = useState(false);
  const [fetchTime, setFetchTime] = useState(false);

  const [fetchDateTime, setFetchDateTime] = useState(new Date());
  const [isUpdateLoad, setIsUpdateLoad] = useState(false);

  const [code, setCode] = useState(false);
  const [defaultDate, setDefaultDate] = useState(false);
  const [dashboardInterval, setDashboardInterval] = useState(false);
  const [dashboardLayouts, setDashboardLayouts] = useState([]);
  const [dashboardColors, setDashboardColors] = useState([]);

  const [selectedDateTag, setDateTag] = useState(defaultDate);

  const [groupPreFilters, setSelectedGroupFilters] = useState(false);
  const [groupPreFiltersLabel, setSelectedGroupFiltersLabel] = useState(false);
  const [preFilter, setPreFilter] = useState(false);
  const [isFilterApply, setFilterApply] = useState(false);
  const [defaultEnabled, setDefaultEnable] = useState(false);
  const [customFilter, setCustomFilter] = useState(false);
  const [customFilterName, setCustomFilterName] = useState(false);

  const [isCleared, setCleared] = useState(false);

  const [reload, setReload] = useState(false);

  const [searchValue, setSearchValue] = useState(false);
  const [filterOptions, setFilterOptions] = useState([]);

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const { ninjaDashboard, updateLayoutInfo, ninjaDefaultFilters } = useSelector(
    (state) => state.analytics,
  );

  const { cxoDashboardLevels } = useSelector((state) => state.ticket);

  const cd1 = useMemo(() => (selectedDateTag === 'l_custom' && customDateValue?.[0]?._d
    ? moment(customDateValue[0]._d).format('YYYY-MM-DD')
    : false), [selectedDateTag, customDateValue]);

  const cd2 = useMemo(() => (selectedDateTag === 'l_custom' && customDateValue?.[1]?._d
    ? moment(customDateValue[1]._d).format('YYYY-MM-DD')
    : false), [selectedDateTag, customDateValue]);

  const timeZone = userInfo.data
    && userInfo.data.timezone ? userInfo.data.timezone : false;

  const userCompany = userInfo.data
    && userInfo.data.company ? userInfo.data.company : false;

  const allowedOperations = getListOfModuleOperations(
    userRoles && userRoles.data ? userRoles.data.allowed_modules : [],
    'Dashboards',
    'code',
  );

  const isEditable = allowedOperations.includes('edit_ninja_dashboard');

  const companyId = userInfo
    && userInfo.data
    && userInfo.data.company
    && userInfo.data.company.id
    ? userInfo.data.company.id
    : '';

  const siteLevel = userInfo
    && userInfo.data
    && userInfo.data.main_company
    && userInfo.data.main_company.category
    && userInfo.data.main_company.category.name
    && userInfo.data.main_company.category.name === 'Companys'
    ? 'Company'
    : 'Site';

  function getFilterArray(jsonObject) {
    const jsonArray = Object.keys(jsonObject).map((key) => ({
      key,
      value: jsonObject[key],
    }));
    const jsonArray2 = jsonArray && jsonArray.length ? jsonArray.filter((item) => item.value.type !== 'separator') : [];
    const jsonArray3 = jsonArray2 && jsonArray2.length ? jsonArray2.sort((a, b) => a.value.sequence - b.value.sequence) : [];
    const jsonArray4 = jsonArray3 && jsonArray3.length ? jsonArray3.map((cl) => ({
      value: cl.value.name,
      label: cl.value.name,
      data: cl.value.domain,
    })) : [];
    return jsonArray4;
  }

  useEffect(() => {
    if (dashboardCode && !hideExpand) {
      setTimer(false);
      setFetchTime(false);
      setDefaultEnable(false);
      setCustomFilter('');
      setCustomFilterName('');
      dispatch(resetNinjaDashboard());
      dispatch(resetDefaultFilterInfo());
      dispatch(getDefaultFilter('ks_dashboard_ninja.custom_filters', dashboardUuid, dashboardCode, userCompany ? userCompany.id : false, userCompany && userCompany.code ? userCompany.code : ''));
    }
  }, [dashboardCode]);

  useEffect(() => {
    if ((ninjaDefaultFilters && ninjaDefaultFilters.data) || (ninjaDefaultFilters && ninjaDefaultFilters.err)) {
      if (ninjaDefaultFilters && ninjaDefaultFilters.data && ninjaDefaultFilters.data.length && ninjaDefaultFilters.data[0].domain) {
        setSelectedGroupFiltersLabel('');
        setCleared(false);
        setCustomFilter(ninjaDefaultFilters.data[0].domain);
        setCustomFilterName(ninjaDefaultFilters.data[0].name);
        setDefaultEnable(Math.random());
      } else {
        setCustomFilter('');
        setCustomFilterName('');
        setDefaultEnable(Math.random());
      }
    }
  }, [ninjaDefaultFilters]);

  useMemo(() => {
    if (dashboardCode && !hideExpand && defaultEnabled) {
      setTimer(false);
      setFetchTime(false);
      const context = { tz: timeZone };
      if (customFilter || advanceFilter || (defaultFilter)) {
        context.ksDomain = customFilter || advanceFilter || defaultFilter;
      } else {
        // context.ksDomain = `[('db_company_id.id','=',${companyId})]`;
      }
      setFetchDateTime(new Date());
      dispatch(
        getNinjaDashboard(
          'ks_fetch_dashboard_data',
          appModels.NINJABOARD,
          code,
          context,
          'IOT',
          dashboardCode,
          dashboardUuid,
          userCompany,
        ),
      );
    }
  }, [defaultEnabled]);

  useEffect(() => {
    if (ninjaDashboard && ninjaDashboard.data && ninjaDashboard.data.ks_dashboard_pre_domain_filter && getFilterArray(ninjaDashboard.data.ks_dashboard_pre_domain_filter) && getFilterArray(ninjaDashboard.data.ks_dashboard_pre_domain_filter).length > 0) {
      setFilterOptions(getFilterArray(ninjaDashboard.data.ks_dashboard_pre_domain_filter));
    }
    if (ninjaDashboard && ninjaDashboard.data) {
      setFetchDateTime(new Date());
    }
  }, [ninjaDashboard]);

  useEffect(() => {
    if (defaultFilter) {
      setCustomFilter('');
      setCustomFilterName('');
      setSelectedGroupFilters(defaultFilter);
    }
  }, [defaultFilter]);

  useEffect(() => {
    if (customFilter) {
      setSelectedGroupFilters(customFilter);
    }
  }, [customFilter]);

  useEffect(() => {
    if (!customFilterName && defaultFilter && !groupPreFiltersLabel && !isCleared && ninjaDashboard && ninjaDashboard.data && ninjaDashboard.data.ks_dashboard_pre_domain_filter) {
      const arr = getFilterArray(ninjaDashboard.data.ks_dashboard_pre_domain_filter);
      if (arr && arr.length) {
        setSelectedGroupFiltersLabel(arr[0].value);
      }
    }
  }, [ninjaDashboard, isCleared]);

  useEffect(() => {
    if (customFilterName && !groupPreFiltersLabel && !isCleared && ninjaDashboard && ninjaDashboard.data && ninjaDashboard.data.ks_dashboard_pre_domain_filter) {
      const arr = getFilterArray(ninjaDashboard.data.ks_dashboard_pre_domain_filter);
      const arr1 = arr.filter((item) => item.label === customFilterName);
      if (arr1 && arr1.length) {
        setSelectedGroupFiltersLabel(arr1[0].value);
      }
    }
  }, [ninjaDashboard, isCleared]);

  useEffect(() => {
    if (dashboardInterval) {
      // setLoadable(false);
      const interval = setInterval(() => {
        setTimer(Math.random());
        setFetchTime(new Date(Date.now() - dashboardInterval));
      }, dashboardInterval);
      // clearInterval(interval);
    }
  }, [dashboardInterval]);

  useEffect(() => {
    if (isTimer && dashboardInterval && code) {
      let context = {
        ksDateFilterEndDate: false,
        ksDateFilterSelection: selectedDateTag,
        ksDateFilterStartDate: false,
        tz: timeZone,
      };

      if (
        customDateValue
        && selectedDateTag === 'l_custom'
        && customDateValue.length
        && cd1
        && cd2
      ) {
        const s1 = cd1;
        const s2 = cd2;
        const start = `${moment(`${s1} 00:00:00`).local().format('YYYY-MM-DDTHH:mm:ss')}`;
        const end = `${moment(`${s2} 23:59:59`).local().format('YYYY-MM-DDTHH:mm:ss')}`;

        /* if (s1 === s2) {
          start = `${moment(`${s1} 23:59:59`).local().subtract(1, 'day').format('YYYY-MM-DDTHH:mm:ss')}`;
        } */

        context = {
          ksDateFilterEndDate: `${end}.00Z`,
          ksDateFilterSelection: 'l_custom',
          ksDateFilterStartDate: `${start}.00Z`,
          tz: timeZone,
        };
      }

      if (customFilter || advanceFilter || (groupPreFilters)) {
        context.ksDomain = customFilter || advanceFilter || JSON.stringify(groupPreFilters);
      } else {
        // context.ksDomain = `[('db_company_id.id','=',${companyId})]`;
      }
      setFetchDateTime(new Date());
      dispatch(
        getNinjaDashboardTimer(
          'ks_fetch_dashboard_data',
          appModels.NINJABOARD,
          code,
          context,
          'IOT',
          dashboardCode,
          dashboardUuid,
          userCompany,
        ),
      );
    }
  }, [isTimer]);

  useEffect(() => {
    if (code && (reload || groupPreFilters)) {
      let context = {
        ksDateFilterEndDate: false, ksDateFilterSelection: selectedDateTag, ksDateFilterStartDate: false, tz: timeZone,
      };

      if (
        customDateValue
        && selectedDateTag === 'l_custom'
        && customDateValue.length
        && cd1
        && cd2
      ) {
        const s1 = cd1;
        const s2 = cd2;
        const start = `${moment(`${s1} 00:00:00`).local().format('YYYY-MM-DDTHH:mm:ss')}`;
        const end = `${moment(`${s2} 23:59:59`).local().format('YYYY-MM-DDTHH:mm:ss')}`;

        /* if (s1 === s2) {
          start = `${moment(`${s1} 23:59:59`).local().subtract(1, 'day').format('YYYY-MM-DDTHH:mm:ss')}`;
        } */

        context = {
          ksDateFilterEndDate: `${end}.00Z`,
          ksDateFilterSelection: 'l_custom',
          ksDateFilterStartDate: `${start}.00Z`,
          tz: timeZone,
        };
      }
      if (customFilter || advanceFilter || groupPreFilters) {
        context.ksDomain = customFilter || advanceFilter || JSON.stringify(groupPreFilters);
      }
      setFetchDateTime(new Date());
      dispatch(getNinjaDashboard(
        'ks_fetch_dashboard_data',
        appModels.NINJABOARD,
        code,
        context,
        'IOT',
        dashboardCode,
        dashboardUuid,
        userCompany,
      ));
    }
  }, [groupPreFilters, reload]);

  useEffect(() => {
    if (defaultDate) {
      setDateTag(defaultDate);
    }
  }, [defaultDate]);

  const loading = (ninjaDashboard && ninjaDashboard.loading) || (ninjaDefaultFilters && ninjaDefaultFilters.loading);

  function isJsonString(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  useEffect(() => {
    if (ninjaDashboard && ninjaDashboard.data) {
      setCode(ninjaDashboard.data.id ? ninjaDashboard.data.id : false);
      setDefaultDate(ninjaDashboard.data.ks_date_filter_selection);
      setDashboardInterval(ninjaDashboard.data.ks_set_interval);
      setDashboardLayouts(
        ninjaDashboard.data.dashboard_json
          && isJsonString(ninjaDashboard.data.dashboard_json)
          ? JSON.parse(ninjaDashboard.data.dashboard_json)
          : [],
      );
      setDashboardColors(ninjaDashboard.data.ks_dashboard_items_ids);
    }
  }, [ninjaDashboard]);

  const dashboardName = ninjaDashboard && ninjaDashboard.data && ninjaDashboard.data.name
    ? ninjaDashboard.data.name
    : '';

  function getFilterPlaceholder(jsonObject) {
    const jsonArray = Object.keys(jsonObject).map((key) => ({
      key,
      value: jsonObject[key],
    }));
    const jsonArray2 = jsonArray && jsonArray.length ? jsonArray.filter((item) => item.value.name && item.value.type === 'separator') : [];
    let res = '';
    if (jsonArray2 && jsonArray2.length) {
      res = jsonArray2[0].value.name;
    }
    return res;
  }

  const handlePreFilterChange = (data) => {
    // const arr = [...groupPreFilters, ...[JSON.stringify(value)]];
    const arr = getFilterArray(ninjaDashboard.data.ks_dashboard_pre_domain_filter);
    const arr1 = arr.filter((item) => item.value === data.value);
    setCustomFilter('');
    setSelectedGroupFilters(arr1 && arr1.length ? arr1[0].data : false);
    setSelectedGroupFiltersLabel(data.value);
    setPreFilter(false);
  };

  const handlePreFilterClaer = () => {
    setSelectedGroupFilters(false);
    setSelectedGroupFiltersLabel(false);
    setCustomFilter('');
    setReload(Math.random());
    setSearchValue(null);
    setCleared(true);
    if (ninjaDashboard && ninjaDashboard.data && ninjaDashboard.data.ks_dashboard_pre_domain_filter && getFilterArray(ninjaDashboard.data.ks_dashboard_pre_domain_filter) && getFilterArray(ninjaDashboard.data.ks_dashboard_pre_domain_filter).length > 0) {
      setFilterOptions(getFilterArray(ninjaDashboard.data.ks_dashboard_pre_domain_filter));
    }
    setPreFilter(false);
  };

  const handlePreFilterDeselectChange = (value) => {
    setSelectedGroupFilters(false);
    setPreFilter(true);
  };

  const onChangeFilters = () => {
    setFilterApply(Math.random());
    setPreFilter(false);
  };

  const onCloseDateFilter = () => {
    if (selectedDateTag === 'l_custom') {
      setDateRangeDialog(false);
      showDateFilter(false);
    } else {
      showDateFilter(false);
    }
  };

  useEffect(() => {
    if (
      customDateValue
      && customDateValue.length > 1
      && cd1
      && cd2
    ) {
      if (
        customDateValue
        && customDateValue.length
        && cd1
        && cd2
      ) {
        const s1 = cd1;
        const s2 = cd2;
        const start = `${moment(`${s1} 00:00:00`).local().format('YYYY-MM-DDTHH:mm:ss')}`;
        const end = `${moment(`${s2} 23:59:59`).local().format('YYYY-MM-DDTHH:mm:ss')}`;

        /* if (s1 === s2) {
          start = `${moment(`${s1} 23:59:59`).local().subtract(1, 'day').format('YYYY-MM-DDTHH:mm:ss')}`;
        } */

        const context = {
          ksDateFilterEndDate: `${end}.00Z`,
          ksDateFilterSelection: 'l_custom',
          ksDateFilterStartDate: `${start}.00Z`,
          tz: timeZone,
        };
        showDateFilter(false);
        if (customFilter || advanceFilter || (groupPreFilters)) {
          context.ksDomain = customFilter || advanceFilter || JSON.stringify(groupPreFilters);
        } else {
          // context.ksDomain = `[('db_company_id.id','=',${companyId})]`;
        }
        setFetchDateTime(new Date());
        dispatch(
          getNinjaDashboard(
            'ks_fetch_dashboard_data',
            appModels.NINJABOARD,
            code,
            context,
            'IOT',
            dashboardCode,
            dashboardUuid,
            userCompany,
          ),
        );
      }
    }
  }, [customDateValue]);

  useEffect(() => {
    if (updateLayoutInfo && updateLayoutInfo.data && code && isUpdateLoad) {
      setIsUpdateLoad(false);
      const context = {
        ksDateFilterEndDate: false,
        ksDateFilterSelection: selectedDateTag,
        ksDateFilterStartDate: false,
        tz: timeZone,
      };
      if (customFilter || advanceFilter || (groupPreFilters)) {
        context.ksDomain = customFilter || advanceFilter || JSON.stringify(groupPreFilters);
      } else {
        // context.ksDomain = `[('db_company_id.id','=',${companyId})]`;
      }
      setFetchDateTime(new Date());
      dispatch(
        getNinjaDashboard(
          'ks_fetch_dashboard_data',
          appModels.NINJABOARD,
          code,
          context,
          'IOT',
          dashboardCode,
          dashboardUuid,
          userCompany,
        ),
      );
    }
  }, [updateLayoutInfo]);

  const onChangeDate = (value) => {
    setDateTag(value);
    if (value !== 'l_custom') {
      showDateFilter(false);
      setCustomDateValue([null, null]);
      /* setIsUpdateLoad(true);
      const data =
        ninjaDashboard && ninjaDashboard.data
          ? ninjaDashboard.data.ks_item_data
          : false;
      const dataList =
        ninjaDashboard && ninjaDashboard.data
          ? ninjaDashboard.data.ks_gridstack_config
          : false;
      const arrGrids = dataList ? JSON.parse(dataList) : [];
      const dataIds = Object.keys(arrGrids);
      const dataArray = getDataArryIn(data || [], dataIds);
      const dateItems =
        dataArray && dataArray.length
          ? dataArray.filter((item) => item.ks_chart_date_groupby)
          : [];
      if (dateItems && dateItems.length) {
        const dateGroup = getTargetDateGroup(value);
        const postData = {
          ks_dashboard_items_ids: getGroupDateArray(dateItems, dateGroup),
        };
        dispatch(
          updateDashboardLayouts(
            code,
            appModels.NINJABOARD,
            postData,
            "IOT",
            dashboardUuid
          )
        );
      } else { */
      const context = {
        ksDateFilterEndDate: false,
        ksDateFilterSelection: value,
        ksDateFilterStartDate: false,
        tz: timeZone,
      };
      if (customFilter || advanceFilter || (groupPreFilters)) {
        context.ksDomain = customFilter || advanceFilter || JSON.stringify(groupPreFilters);
      } else {
        // context.ksDomain = `[('db_company_id.id','=',${companyId})]`;
      }
      setFetchDateTime(new Date());
      dispatch(
        getNinjaDashboard(
          'ks_fetch_dashboard_data',
          appModels.NINJABOARD,
          code,
          context,
          'IOT',
          dashboardCode,
          dashboardUuid,
          userCompany,
        ),
      );
      // }
    } else {
      setCustomDateValue([null, null]);
      setDateRangeDialog(true);
    }
  };

  const onUpdate = () => {
    if (code) {
      const nData = ninjaDashboard && ninjaDashboard.data ? ninjaDashboard.data : false;
      const data = nData && nData.ks_item_data ? nData.ks_item_data : false;
      const dataList = nData && nData.ks_gridstack_config ? nData.ks_gridstack_config : false;
      const seqdata = getArrayNewUpdateFormat(data, dataList, customLayouts);
      const postData = {
        dashboard_json: JSON.stringify(customLayouts),
      };
      /* if (seqdata && seqdata.length) {
        postData.ks_dashboard_items_ids = seqdata;
      } */
      dispatch(
        updateDashboardLayouts(
          code,
          appModels.NINJABOARD,
          postData,
          'IOT',
          dashboardUuid,
        ),
      );
    }
    setEditMode(false);
  };

  const onExpand = () => {
    const elem = document.documentElement; // document.getElementById('dynamic-dashboard'); // document.getElementById('main-body-property');
    if (elem) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
    }

    const headerDiv = document.getElementById('main-header');
    const sidebarDiv = document.getElementById('collapse-sidebar');
    const componentHeader = document.getElementById('component-header');
    const menuHeader = document.getElementById('mainHeader2');

    if (headerDiv && sidebarDiv && menuHeader && componentHeader && menuHeader) {
      headerDiv.style.display = 'none';
      sidebarDiv.style.display = 'none';
      componentHeader.style.width = '100%';
      componentHeader.style.marginLeft = '0';
      menuHeader.style.display = 'none';
      elem.style.overflow = 'auto';
    }
    setExpandMode(true);
  };

  const onExpandClose = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      /* Safari */
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      /* IE11 */
      document.msExitFullscreen();
    }

    const headerDiv = document.getElementById('main-header');
    const sidebarDiv = document.getElementById('collapse-sidebar');
    const componentHeaderExpand = document.getElementsByClassName('content-box-expand');
    const componentHeaderHover = document.getElementsByClassName('content-box-hover');
    const menuHeader = document.getElementById('mainHeader2');
    setExpandMode(false);
    if (headerDiv && sidebarDiv && menuHeader && componentHeaderExpand && componentHeaderHover) {
      headerDiv.style.display = 'flex';
      sidebarDiv.style.display = 'block';
      menuHeader.style.display = 'flex';
      componentHeaderExpand.style.width = '95%';
      componentHeaderHover.style.marginLeft = '5%';
    }
  };

  const handleFilterChange = (value) => {
    setGroupFilter(false);
  };

  const handleFilterDeselectChange = (value) => {
    setGroupFilter(true);
  };

  const handleGroupFilterClear = () => {
    setGroupFilter(false);
  };

  const downloadImage = (blob, fileName) => {
    const fakeLink = window.document.createElement('a');
    fakeLink.style = 'display:none;';
    const actionDiv = document.getElementById('action-buttons');
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

  const exportAsImage = async (imageFileName) => {
    const actionDiv = document.getElementById('action-buttons');
    if (actionDiv) {
      actionDiv.style.display = 'none';
    }
    const targetDiv = document.getElementById('dynamic-dashboard');
    if (targetDiv) {
      const canvas = await html2canvas(targetDiv);
      const image = canvas.toDataURL('image/png', 3.0);
      downloadImage(image, imageFileName);
    }
    if (actionDiv) {
      actionDiv.style.display = 'flex';
    }
  };

  const cities = userInfo && userInfo.data && userInfo.data.allowed_companies
    ? userInfo.data.allowed_companies.map((cl) => ({
      value: cl.region && cl.region.id ? cl.region.id : '',
      label: cl.region && cl.region.name ? cl.region.name : '',
    }))
    : [];

  const currentGroupData = cities && cities.length
    ? [...new Map(cities.map((item) => [item.value, item])).values()]
    : [];

  const showFilter = !(ninjaDashboard && ninjaDashboard.data && ninjaDashboard.data.disable_dashboard_date_filter);

  document.addEventListener('fullscreenchange', (event) => {
    if (document.fullscreenElement) {
      const layout = document.getElementById('dynamic-dashboard');
      layout.style.background = '#f7fafc';
      onExpand();
    } else {
      onExpandClose();
    }
  });

  const searchFilterOptions = (event) => {
    setTimeout(() => {
      setSearchValue(event.target.value);
      const data = getFilterArray(ninjaDashboard.data.ks_dashboard_pre_domain_filter);
      if (event.target.value && data && data.length) {
        const ndata = data.filter((item) => {
          const searchValue1 = item.label ? item.label.toString().toLowerCase() : '';
          const s = event.target.value.toString().toLowerCase();
          return (searchValue1.search(s) !== -1);
        });
        setFilterOptions(ndata);
      } else {
        setFilterOptions(getFilterArray(ninjaDashboard.data.ks_dashboard_pre_domain_filter));
      }
    }, 500);
  };

  const onSldGoBack = () => {
    if (!isSLDButton) {
      window.history.back();
    } else {
      dispatch(storeSldData({}));
    }
  };

  const onBackDateFilter = () => {
    setCustomDateValue([null, null]);
    setDateRangeDialog(false);
  };

  const getDateRangeDates = selectedDateTag && customData?.dateFiltersText?.[selectedDateTag]
    ? getDateRange(selectedDateTag)
    : null;

  const getDateRangeDatesList = getDateRangeDates?.length === 2
    && getDateRangeDates[0] != null
    && getDateRangeDates[1] != null
    ? `${getCompanyTimezoneDayjsLocal(getDateRangeDates[0], userInfo, 'date')} - ${getCompanyTimezoneDayjsLocal(getDateRangeDates[1], userInfo, 'date')}`
    : '';

  const customDate1 = selectedDateTag && selectedDateTag === 'l_custom' && customDateValue && customDateValue.length && customDateValue[0] && customDateValue[0] !== null ? moment(customDateValue[0].$d).format('DD-MMM-YYYY') : false;
  const customDate2 = selectedDateTag && selectedDateTag === 'l_custom' && customDateValue && customDateValue.length && customDateValue[1] && customDateValue[1] !== null ? moment(customDateValue[1].$d).format('DD-MMM-YYYY') : false;

  const customDates = customDate1 && customDate2 ? ` (${customDate1} to ${customDate2})` : '';

  return (
    <>
      {!hideExpand && (
        <Divider />
      )}
      <div className="insights-box">
        <div id="dynamic-dashboard" style={hideExpand ? { backgroundColor: '#fafafa' } : {}}>
          <div className={hideExpand ? 'header-box2-no-border' : 'header-box2'}>
            <div className="insights-filter-box">
              <div className="commongrid-header-text">
                {' '}
                {isCxo && (
                <span aria-hidden className="mr-2" onClick={() => setDashboardCode('')}>
                  {'CXO >'}
                </span>
                )}
                {isSLD && (
                <span aria-hidden className="mr-2" onClick={() => onSldGoBack()}>
                  {'SLD >'}
                </span>
                )}
                {meterName && (
                <span aria-hidden className="mr-2">
                  {meterName}
                  {'  '}
                  {'  -  '}
                </span>
                )}
                {dashboardName && !isCxo ? dashboardName
                  : (
                    <>
                      { }
                      {cxoDashboardLevels && cxoDashboardLevels.length > 0 && cxoDashboardLevels.map((dl, index) => (
                        <span aria-hidden onClick={() => navigateLevel(index + 1, dl.code, cxoDashboardLevels.length === (index + 1) ? 'No' : 'Yes')}>
                          {`${dl.name} ${cxoDashboardLevels.length === (index + 1) ? '' : ' > '} `}
                        </span>
                      ))}
                    </>
                  )}
              </div>
            </div>
            <div className="insights-filter-box" id="action-buttons">
              {!loading && (
              <>

                <MuiTooltip
                  title={(
                    <Typography>
                      Refresh
                    </Typography>
                    )}
                >

                  <IconButton
                    className=""
                    onClick={() => setReload(Math.random())}
                    style={{
                      marginRight: '10px',
                      color: themes === 'light' ? '#938B8B' : AddThemeColor({}).color, // Dynamic color based on theme
                    }}
                  >
                    {' '}
                    <RefreshIcon size={25} color={themes === 'light' ? 'black' : AddThemeColor({}).color} />
                    {' '}
                  </IconButton>

                </MuiTooltip>
                {fetchDateTime && (
                <MuiTooltip
                  title={(
                    <Typography>
                      Last Updated on
                      {' '}
                      {getCompanyTimezoneDateLocal(fetchDateTime, userInfo, 'datetime')}
                    </Typography>
                      )}
                >

                  <IconButton
                    className=""
                    style={{
                      marginRight: '10px',
                      color: themes === 'light' ? '#938B8B' : AddThemeColor({}).color, // Dynamic color based on theme
                    }}
                  >
                    {' '}
                    <AccessTimeIcon size={25} />
                    {' '}
                  </IconButton>

                </MuiTooltip>
                )}
                {ninjaDashboard && ninjaDashboard.data && ninjaDashboard.data.ks_dashboard_pre_domain_filter && getFilterArray(ninjaDashboard.data.ks_dashboard_pre_domain_filter) && getFilterArray(ninjaDashboard.data.ks_dashboard_pre_domain_filter).length > 0 && (
                <Autocomplete
                  id="demo"
                  size="small"
                  name="template"
                  className="min-width-250"
                  open={preFilter}
                  onOpen={() => {
                    setPreFilter(true);
                  }}
                  onClose={() => {
                    setPreFilter(false);
                  }}
                  value={groupPreFiltersLabel || ''}
                  disableClearable
                  onChange={(e, options) => handlePreFilterChange(options)}
                  getOptionDisabled={(option, value) => option.label === groupPreFiltersLabel}
                  getOptionSelected={(option, value) => option.label === value.label}
                  getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                  options={filterOptions}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      onChange={searchFilterOptions}
                      value={searchValue}
                      label=""
                      variant="standard"
                      placeholder={getFilterPlaceholder(ninjaDashboard.data.ks_dashboard_pre_domain_filter)}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {ninjaDashboard && ninjaDashboard.loading ? <CircularProgress color="inherit" size={20} /> : null}
                            <InputAdornment position="end">
                              {(groupPreFiltersLabel || searchValue) && (
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handlePreFilterClaer}
                              >
                                <IoCloseOutline />
                              </IconButton>
                              )}
                            </InputAdornment>
                          </>
                        ),
                      }}
                    />
                  )}
                />
                )}
                {getDateRangeDatesList ? (
                  <MuiTooltip
                    title={(
                      <Typography>
                        {getDateRangeDatesList}
                      </Typography>
                                      )}
                  >

                    <span style={themes === 'light' ? { color: '#938B8B' } : AddThemeColor({})}>
                      {' '}
                      {customData
                                      && customData.dateFiltersText
                                      && selectedDateTag
                                      && customData.dateFiltersText[selectedDateTag]
                        ? customData.dateFiltersText[selectedDateTag]
                        : ''}
                      {customDates}
                    </span>
                  </MuiTooltip>
                )
                  : (
                    <span style={themes === 'light' ? { color: '#938B8B' } : AddThemeColor({})}>
                      {' '}
                      {customData
                                      && customData.dateFiltersText
                                      && selectedDateTag
                                      && customData.dateFiltersText[selectedDateTag]
                        ? customData.dateFiltersText[selectedDateTag]
                        : ''}
                      {customDates}
                    </span>
                  )}
                {!expandMode && showFilter && (
                <MuiTooltip
                  title={(
                    <Typography>
                      Date Filters
                      {' ( '}
                      {customData
                            && customData.dateFiltersText
                            && selectedDateTag
                            && customData.dateFiltersText[selectedDateTag]
                        ? customData.dateFiltersText[selectedDateTag]
                        : ''}
                      {' ) '}
                      {customDates}
                    </Typography>
                      )}
                >

                  <IconButton
                    onClick={() => showDateFilter(true)}
                    className="link-btn"
                    style={{ marginRight: '10px' }}
                  >
                    {' '}
                    <TodayOutlinedIcon
                      size={25}
                      sx={{ color: themes === 'light' ? 'black' : AddThemeColor({}).color }}
                    />
                    {' '}
                  </IconButton>

                </MuiTooltip>
                )}
                {!expandMode && (
                <StaticDataExportFull
                  data={
                        ninjaDashboard && ninjaDashboard.data
                          ? ninjaDashboard.data.ks_item_data
                          : false
                      }
                  dataList={
                        ninjaDashboard && ninjaDashboard.data
                          ? ninjaDashboard.data.ks_gridstack_config
                          : false
                      }
                  dashboardName={dashboardName}
                  selectedDateTag={selectedDateTag}
                  customDateValue={customDateValue}
                  onImageExport={() => exportAsImage(dashboardName)}
                />
                )}
                {!expandMode && editMode && (
                <>
                  <Button
                    onClick={() => onUpdate()}
                    variant="contained"
                    className="normal-btn"
                  >
                    Save
                  </Button>
                  <Button
                    onClick={() => {
                      setEditMode(false);
                      setCustomLayouts(dashboardLayouts);
                    }}
                    variant="outlined"
                    className="normal-btn"
                  >
                    Reset
                  </Button>
                </>
                )}

                {!expandMode && isEditable && !editMode && (
                <MuiTooltip title={<Typography>Rearrange Cards</Typography>}>
                  <IconButton
                    onClick={() => setEditMode(true)}
                    className="link-btn"
                  >
                    {' '}
                    <BsPencil
                      size={20}
                      sx={{ color: themes === 'light' ? 'black' : AddThemeColor({}).color }}
                    />
                    {' '}
                  </IconButton>
                </MuiTooltip>
                )}
                {!editMode && (
                <>
                  {expandMode ? (
                    <MuiTooltip
                      title={<Typography>Exit Full Screen</Typography>}
                    >
                      <IconButton
                        onClick={() => onExpandClose()}
                        className="link-btn"
                      >
                        <MdOutlineCloseFullscreen
                          size={20}
                          sx={{ color: themes === 'light' ? 'black' : AddThemeColor({}).color }}
                        />
                      </IconButton>
                    </MuiTooltip>
                  ) : (
                    <>
                      {!hideExpand && (
                      <MuiTooltip title={<Typography>Full Screen</Typography>}>
                        <IconButton
                          onClick={() => onExpand()}
                          className="link-btn"
                        >
                          <MdOutlineOpenInFull
                            size={20}
                            sx={{ color: themes === 'light' ? 'black' : AddThemeColor({}).color }}
                          />
                        </IconButton>
                      </MuiTooltip>
                      )}
                    </>
                  )}
                </>
                )}
              </>
              )}
            </div>
          </div>
          {loading && <PageLoader type="max" />}
          <div>
            <ChartCards
              data={
                ninjaDashboard && ninjaDashboard.data
                  ? ninjaDashboard.data.ks_item_data
                  : false
              }
              dataList={
                ninjaDashboard && ninjaDashboard.data
                  ? ninjaDashboard.data.ks_gridstack_config
                  : false
              }
              editMode={editMode}
              code={code}
              selectedDateTag={selectedDateTag}
              customDateValue={customDateValue}
              setCustomLayouts={setCustomLayouts}
              dashboardLayouts={dashboardLayouts}
              dashboardColors={dashboardColors}
              customLayouts={customLayouts}
              dashboardUuid={dashboardUuid}
              dashboardCode={dashboardCode}
              advanceFilter={advanceFilter}
              setDashboardCode={setDashboardCode}
              expandMode={expandMode}
              isIot
              hideExpand={hideExpand}
              isIAQ={isIAQ}
            />
          </div>
          {ninjaDashboard && ninjaDashboard.err && (
            <ErrorContent errorTxt={generateErrorMessage(ninjaDashboard)} />
          )}

          <Dialog maxWidth="lg" open={isDataFilter}>
            <div className="dates-filter-pop-up">
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
                  <TodayOutlinedIcon size={25} />
                  Date Filters
                </Typography>
                <IconButton
                  onClick={() => {
                    onCloseDateFilter();
                  }}
                  className="btn"
                  type="button"
                >
                  <IoCloseOutline size={28} />
                </IconButton>
              </div>
              <MuiBox
                sx={{
                  width: '100%',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '10px',
                  padding: '10px 0px 20px 0px',
                }}
                component="ul"
              >
                {!dateRangeDialog ? (
                  <>
                    {customData
                      && customData.dateFiltersCurrent.map((dl) => (
                        <ListItemButton
                          sx={DateFilterButtons({
                            width: '31%',
                            border: '1px solid #0000001f',
                          }, selectedDateTag === dl.value)}
                          onClick={() => onChangeDate(dl.value)}
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
                    {customData
                      && customData.dateFiltersPast.map((dl) => (
                        <ListItemButton
                          sx={DateFilterButtons({
                            width: '31%',
                            border: '1px solid #0000001f',
                          }, selectedDateTag === dl.value)}
                          onClick={() => onChangeDate(dl.value)}
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
                    {customData
                      && customData.dateFiltersPastDays.map((dl) => (
                        <ListItemButton
                          sx={DateFilterButtons({
                            width: '31%',
                            border: '1px solid #0000001f',
                          }, selectedDateTag === dl.value)}
                          onClick={() => onChangeDate(dl.value)}
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
                  </>
                ) : (
                  <>
                    <div className="dates-filter-pop-up">
                      <MuiBox
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '0px',
                        }}
                      >
                        <MuiTooltip title={<Typography>Back</Typography>}>
                          <IconButton
                            onClick={() => {
                              onBackDateFilter();
                            }}
                            className="btn"
                            type="button"
                          >
                            <IoArrowBack size={20} />
                          </IconButton>
                        </MuiTooltip>
                        <Typography
                          sx={{
                            fontFamily: 'Suisse Intl',
                            fontSize: '15px',
                            fontWeight: '500',
                          }}
                        >
                          Custom Date Range
                        </Typography>

                      </MuiBox>
                      <div className="p-2">
                        <RangePicker
                          onChange={(newValue) => {
                            setCustomDateValue(newValue);
                          }}
                          value={customDateValue}
                          open
                          format="DD-MM-y"
                          className="w-100"
                          size="small"
                        />
                      </div>
                      {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <StaticDateRangePicker
                          closeOnSelect
                          displayStaticWrapperAs="desktop"
                          value={customDateValue}
                          onChange={(newValue) => {
                            setCustomDateValue(newValue);
                          }}
                          renderInput={(startProps, endProps) => (
                            <>
                              <TextField {...startProps} />
                              <MuiBox sx={{ mx: 2 }}> to </MuiBox>
                              <TextField {...endProps} />
                            </>
                          )}
                        />
                      </LocalizationProvider> */ }
                    </div>
                  </>
                )}
              </MuiBox>
            </div>
          </Dialog>
        </div>
      </div>
    </>
  );
});

export default DashboardIOTView;
