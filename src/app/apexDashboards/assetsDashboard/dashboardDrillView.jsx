/* eslint-disable import/no-cycle */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable import/no-unresolved */
import React, {
  useState, useEffect, useMemo,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import * as PropTypes from 'prop-types';
import {
  DatePicker,
} from 'antd';
import { CircularProgress } from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import html2canvas from 'html2canvas';
import IconButton from '@mui/material/IconButton';
import { Autocomplete } from '@material-ui/lab';
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
import { IoCloseOutline } from 'react-icons/io5';
import TodayOutlinedIcon from '@mui/icons-material/TodayOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { StaticDateRangePicker, LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';

import PageLoader from '@shared/pageLoader';
import ErrorContent from '@shared/errorContent';
import MuiTooltip from '@shared/muiTooltip';

import ChartCards from './chartCards';
import ChartCardsIot from './chartCardsIOT';
import './style.css';
import './dashboardOuter.css';
import { AddThemeColor, DateFilterButtons } from '../../themes/theme';

import {
  getNinjaDashboardDrill,
  getNinjaDashboardTimerDrill,
  updateDashboardLayouts,
} from '../../analytics/analytics.service';
import {
  generateErrorMessage, getListOfModuleOperations, isJsonString, getCompanyTimezoneDateLocal,
} from '../../util/appUtils';
import customData from '../data/customData.json';
import StaticDataExportFull from './staticDataExportFull';
import {
  getArrayNewUpdateFormat
  ,
} from '../utils/utils';

const appModels = require('../../util/appModels').default;

const { RangePicker } = DatePicker;

const DashboardDrillView = React.memo((props) => {
  const {
    code,
    defaultDate,
    meterName,
    dashboardInterval,
    dashboardLayouts,
    dashboardColors,
    advanceFilter,
    isIot,
    dashboardUuid,
    dashboardCode,
    hideExpand,
  } = props;
  const dispatch = useDispatch();
  const [dateRangeDialog, setDateRangeDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [expandMode, setExpandMode] = useState(false);
  const [customLayouts, setCustomLayouts] = useState({});
  const [isGroupFilter, setGroupFilter] = useState(false);
  const [isDataFilter, showDateFilter] = useState(false);
  const [customDateValue, setCustomDateValue] = useState([null, null]);
  const [selectedDateTag, setDateTag] = useState(defaultDate);

  const [isTimer, setTimer] = useState(false);
  const [fetchTime, setFetchTime] = useState(false);
  const [isUpdateLoad, setIsUpdateLoad] = useState(false);
  const [reload, setReload] = useState(false);
  const [groupPreFilters, setSelectedGroupFilters] = useState(false);
  const [groupPreFiltersLabel, setSelectedGroupFiltersLabel] = useState(false);
  const [preFilter, setPreFilter] = useState(false);
  const [isFilterApply, setFilterApply] = useState(false);
  const [fetchDateTime, setFetchDateTime] = useState(new Date());

  const [code16, setCode16] = useState(false);
  const [defaultDate16, setDefaultDate16] = useState(false);
  const [dashboardInterval16, setDashboardInterval16] = useState(false);
  const [dashboardLayouts16, setDashboardLayouts16] = useState([]);
  const [dashboardColorsIot, setDashboardColorsIot] = useState([]);

  const [isCleared, setCleared] = useState(false);
  const [searchValue, setSearchValue] = useState(false);
  const [filterOptions, setFilterOptions] = useState([]);

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const { ninjaDashboardDrill, updateLayoutInfo } = useSelector((state) => state.analytics);

  const timeZone = userInfo.data
    && userInfo.data.timezone ? userInfo.data.timezone : false;

  const userCompany = userInfo.data
    && userInfo.data.company ? userInfo.data.company : false;

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Dashboards', 'code');

  const isEditable = allowedOperations.includes('edit_ninja_dashboard');

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

  const siteLevel = userInfo && userInfo.data && userInfo.data.main_company && userInfo.data.main_company.category
    && userInfo.data.main_company.category.name && userInfo.data.main_company.category.name === 'Companys' ? 'Company' : 'Site';

  useEffect(() => {
    if (dashboardInterval && !isIot) {
      // setLoadable(false);
      const interval = setInterval(() => {
        setTimer(Math.random());
        setFetchTime(new Date(Date.now() - dashboardInterval));
      }, dashboardInterval);
      // clearInterval(interval);
    }
  }, [dashboardInterval]);

  useEffect(() => {
    if (dashboardInterval16 && isIot) {
      // setLoadable(false);
      const interval = setInterval(() => {
        setTimer(Math.random());
        setFetchTime(new Date(Date.now() - dashboardInterval16));
      }, dashboardInterval16);
      // clearInterval(interval);
    }
  }, [dashboardInterval16]);

  useEffect(() => {
    if (isTimer && (dashboardInterval || dashboardInterval16) && (code || code16)) {
      const context = {
        ksDateFilterEndDate: false, ksDateFilterSelection: selectedDateTag, ksDateFilterStartDate: false, tz: timeZone,
      };
      if (advanceFilter) {
        context.ksDomain = advanceFilter;
      }
      dispatch(getNinjaDashboardTimerDrill('ks_fetch_dashboard_data', appModels.NINJABOARD, isIot ? code16 : code, context, isIot, dashboardCode, dashboardUuid, userCompany));
    }
  }, [isTimer]);

  useEffect(() => {
    if (defaultDate) {
      setDateTag(defaultDate);
    }
  }, [defaultDate]);

  useEffect(() => {
    if (defaultDate16) {
      setDateTag(defaultDate16);
    }
  }, [defaultDate16]);

  const loading = (ninjaDashboardDrill && ninjaDashboardDrill.loading);

  useEffect(() => {
    if (isIot && ninjaDashboardDrill && ninjaDashboardDrill.data) {
      setCode16(ninjaDashboardDrill.data.id ? ninjaDashboardDrill.data.id : false);
      setDefaultDate16(ninjaDashboardDrill.data.ks_date_filter_selection);
      setDashboardInterval16(ninjaDashboardDrill.data.ks_set_interval);
      setDashboardLayouts16(
        ninjaDashboardDrill.data.dashboard_json
          && isJsonString(ninjaDashboardDrill.data.dashboard_json)
          ? JSON.parse(ninjaDashboardDrill.data.dashboard_json)
          : [],
      );
      setDashboardColorsIot(ninjaDashboardDrill.data.ks_dashboard_items_ids);
    }
  }, [ninjaDashboardDrill]);

  useMemo(() => {
    if (code && !hideExpand && !isIot) {
      setTimer(false);
      setFetchTime(false);
      const dDate = isIot ? defaultDate16 : defaultDate;
      const context = {
        tz: timeZone,
      };
      if (advanceFilter) {
        context.ksDomain = advanceFilter;
      }
      dispatch(getNinjaDashboardDrill('ks_fetch_dashboard_data', appModels.NINJABOARD, isIot ? code16 : code, context, isIot, dashboardCode, dashboardUuid, userCompany));
    }
  }, [code, hideExpand]);

  useMemo(() => {
    if (dashboardCode && !hideExpand && isIot) {
      setTimer(false);
      setFetchTime(false);
      const dDate = isIot ? defaultDate16 : defaultDate;
      const context = {
        tz: timeZone,
      };
      if (advanceFilter) {
        context.ksDomain = advanceFilter;
      }
      dispatch(getNinjaDashboardDrill('ks_fetch_dashboard_data', appModels.NINJABOARD, isIot ? code16 : code, context, isIot, dashboardCode, dashboardUuid, userCompany));
    }
  }, [dashboardCode, hideExpand]);

  useEffect(() => {
    if ((code16 || code) && (reload || groupPreFilters)) {
      let context = {
        ksDateFilterEndDate: false, ksDateFilterSelection: selectedDateTag, ksDateFilterStartDate: false, tz: timeZone,
      };

      if (
        customDateValue
        && selectedDateTag === 'l_custom'
        && customDateValue.length
        && customDateValue[0]
        && customDateValue[0] !== null
      ) {
        const s1 = moment(customDateValue[0].$d).format('YYYY-MM-DD');
        const s2 = moment(customDateValue[1].$d).format('YYYY-MM-DD');
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
      if (advanceFilter || groupPreFilters) {
        context.ksDomain = advanceFilter || JSON.stringify(groupPreFilters);
      }
      setFetchDateTime(new Date());
      dispatch(getNinjaDashboardDrill(
        'ks_fetch_dashboard_data',
        appModels.NINJABOARD,
        isIot ? code16 : code,
        context,
        isIot,
        dashboardCode,
        dashboardUuid,
        userCompany,
      ));
    }
  }, [groupPreFilters, reload]);

  const dashboardName = ninjaDashboardDrill && ninjaDashboardDrill.data && ninjaDashboardDrill.data.name ? ninjaDashboardDrill.data.name : 'Dashboard';

  const onCloseDateFilter = () => {
    if (selectedDateTag === 'l_custom') {
      setDateRangeDialog(false);
      showDateFilter(false);
    } else {
      showDateFilter(false);
    }
  };

  useEffect(() => {
    if (customDateValue && customDateValue.length > 1 && customDateValue[0] && customDateValue[1]) {
      if (customDateValue && customDateValue.length && customDateValue[0] && customDateValue[0] !== null) {
        const s1 = moment(customDateValue[0].$d).format('YYYY-MM-DD');
        const s2 = moment(customDateValue[1].$d).format('YYYY-MM-DD');
        const start = `${moment(`${s1} 00:00:00`).utc().format('YYYY-MM-DDTHH:mm:ss')}`;
        const end = `${moment(`${s2} 23:59:59`).utc().format('YYYY-MM-DDTHH:mm:ss')}`;

        /* if (s1 === s2) {
          start = `${moment(`${s1} 23:59:59`).utc().subtract(1, 'day').format('YYYY-MM-DDTHH:mm:ss')}`;
        } */
        const context = {
          ksDateFilterEndDate: `${end}.00Z`, ksDateFilterSelection: 'l_custom', ksDateFilterStartDate: `${start}.00Z`, tz: timeZone,
        };
        showDateFilter(false);
        if (advanceFilter) {
          context.ksDomain = advanceFilter;
        }
        dispatch(getNinjaDashboardDrill('ks_fetch_dashboard_data', appModels.NINJABOARD, isIot ? code16 : code, context, isIot, dashboardCode, dashboardUuid, userCompany));
      }
    }
  }, [customDateValue]);

  useEffect(() => {
    if (updateLayoutInfo && updateLayoutInfo.data && (code16 || code) && isUpdateLoad) {
      setIsUpdateLoad(false);
      const context = {
        ksDateFilterEndDate: false, ksDateFilterSelection: selectedDateTag, ksDateFilterStartDate: false, tz: timeZone,
      };
      if (advanceFilter) {
        context.ksDomain = advanceFilter;
      }
      dispatch(getNinjaDashboardDrill('ks_fetch_dashboard_data', appModels.NINJABOARD, isIot ? code16 : code, context, isIot, dashboardCode, dashboardUuid, userCompany));
    }
  }, [updateLayoutInfo]);

  const onChangeDate = (value) => {
    setDateTag(value);
    if (value !== 'l_custom') {
      showDateFilter(false);
      const context = {
        ksDateFilterEndDate: false, ksDateFilterSelection: value, ksDateFilterStartDate: false, tz: timeZone,
      };
      if (advanceFilter) {
        context.ksDomain = advanceFilter;
      }
      dispatch(getNinjaDashboardDrill('ks_fetch_dashboard_data', appModels.NINJABOARD, isIot ? code16 : code, context, isIot, dashboardCode, dashboardUuid, userCompany));
    } else {
      setDateRangeDialog(true);
    }
  };

  const onUpdate = () => {
    if (code || code16) {
      const nData = ninjaDashboardDrill && ninjaDashboardDrill.data ? ninjaDashboardDrill.data : false;
      const data = nData && nData.ks_item_data ? nData.ks_item_data : false;
      const dataList = nData && nData.ks_gridstack_config ? nData.ks_gridstack_config : false;
      const seqdata = getArrayNewUpdateFormat(data, dataList, customLayouts);
      const postData = {
        dashboard_json: customLayouts,
      };
      if (seqdata && seqdata.length) {
        postData.ks_dashboard_items_ids = seqdata;
      }
      dispatch(updateDashboardLayouts(isIot ? code16 : code, appModels.NINJABOARD, postData, isIot, dashboardUuid));
    }
    setEditMode(false);
  };

  const handlePreFilterChange = (data) => {
    // const arr = [...groupPreFilters, ...[JSON.stringify(value)]];
    const arr = getFilterArray(ninjaDashboardDrill.data.ks_dashboard_pre_domain_filter);
    const arr1 = arr.filter((item) => item.value === data.value);
    setSelectedGroupFilters(arr1 && arr1.length ? arr1[0].data : false);
    setSelectedGroupFiltersLabel(data.value);
    setPreFilter(false);
  };

  const onExpand = () => {
    const elem = document.documentElement; // document.getElementById('main-body-property');
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
    const sidebarDiv = document.getElementById('main-sidebar');

    if (headerDiv && sidebarDiv) {
      headerDiv.style.display = 'none';
      sidebarDiv.style.display = 'none';
    }
    setExpandMode(true);
  };

  const onExpandClose = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { /* Safari */
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE11 */
      document.msExitFullscreen();
    }

    const headerDiv = document.getElementById('main-header');
    const sidebarDiv = document.getElementById('main-sidebar');

    if (headerDiv && sidebarDiv) {
      headerDiv.style.display = 'initial';
      sidebarDiv.style.display = 'block';
    }
    setExpandMode(false);
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

  const handlePreFilterClaer = () => {
    setSelectedGroupFilters(false);
    setSelectedGroupFiltersLabel(false);
    setSearchValue(null);
    setCleared(true);
    if (ninjaDashboardDrill && ninjaDashboardDrill.data && ninjaDashboardDrill.data.ks_dashboard_pre_domain_filter && getFilterArray(ninjaDashboardDrill.data.ks_dashboard_pre_domain_filter) && getFilterArray(ninjaDashboardDrill.data.ks_dashboard_pre_domain_filter).length > 0) {
      setFilterOptions(getFilterArray(ninjaDashboardDrill.data.ks_dashboard_pre_domain_filter));
    }
    setPreFilter(false);
  };

  const downloadImage = (blob, fileName) => {
    const fakeLink = window.document.createElement('a');
    fakeLink.style = 'display:none;';
    const actionDiv = document.getElementById('action-drill-buttons');
    fakeLink.download = fileName;

    fakeLink.href = blob;

    document.body.appendChild(fakeLink);
    fakeLink.click();
    document.body.removeChild(fakeLink);
    if (actionDiv) {
      actionDiv.style.display = 'flex';
    }
    fakeLink.remove();
  };

  const exportAsImage = async (imageFileName) => {
    const actionDiv = document.getElementById('action-drill-buttons');
    if (actionDiv) {
      actionDiv.style.display = 'none';
    }
    const targetDiv = document.getElementById('dynamic-drill-dashboard');
    if (targetDiv) {
      const canvas = await html2canvas(targetDiv);
      const image = canvas.toDataURL('image/png', 3.0);
      downloadImage(image, imageFileName);
    }
  };

  const searchFilterOptions = (event) => {
    setTimeout(() => {
      setSearchValue(event.target.value);
      const data = getFilterArray(ninjaDashboardDrill.data.ks_dashboard_pre_domain_filter);
      if (event.target.value && data && data.length) {
        const ndata = data.filter((item) => {
          const searchValue1 = item.label ? item.label.toString().toLowerCase() : '';
          const s = event.target.value.toString().toLowerCase();
          return (searchValue1.search(s) !== -1);
        });
        setFilterOptions(ndata);
      } else {
        setFilterOptions(getFilterArray(ninjaDashboardDrill.data.ks_dashboard_pre_domain_filter));
      }
    }, 500);
  };

  const cities = userInfo && userInfo.data && userInfo.data.allowed_companies ? userInfo.data.allowed_companies.map((cl) => ({
    value: cl.region && cl.region.id ? cl.region.id : '',
    label: cl.region && cl.region.name ? cl.region.name : '',
  })) : [];

  const showFilter = !(ninjaDashboardDrill && ninjaDashboardDrill.data && ninjaDashboardDrill.data.disable_dashboard_date_filter);

  const currentGroupData = cities && cities.length ? [...new Map(cities.map((item) => [item.value, item])).values()] : [];

  const customDate1 = selectedDateTag && selectedDateTag === 'l_custom' && customDateValue && customDateValue.length && customDateValue[0] && customDateValue[0] !== null ? moment(customDateValue[0].$d).format('DD-MMM-YYYY') : false;
  const customDate2 = selectedDateTag && selectedDateTag === 'l_custom' && customDateValue && customDateValue.length && customDateValue[1] && customDateValue[1] !== null ? moment(customDateValue[1].$d).format('DD-MMM-YYYY') : false;

  const customDates = customDate1 && customDate2 ? ` (${customDate1} to ${customDate2})` : '';

  return (
    <>
      {!hideExpand && (
        <Divider />
      )}
      <div className="insights-box">
        <div id="dynamic-drill-dashboard" style={hideExpand ? { backgroundColor: '#fafafa' } : {}}>
          <div className={hideExpand ? 'header-box2-no-border' : 'header-box2'}>
            {' '}
            <div className="insights-filter-box">
              <div className="commongrid-header-text">
                {meterName && (
                <span aria-hidden className="mr-2">
                  {meterName}
                  {'  '}
                  {'  -  '}
                </span>
                )}
                {' '}
                {dashboardName || ''}
              </div>
            </div>
            <div className="insights-filter-box" id="action-drill-buttons">
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
                    style={{ marginRight: '10px', color: AddThemeColor({}).color }}
                  >
                    {' '}
                    <RefreshIcon size={25} />
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
                        style={{ marginRight: '10px', color: AddThemeColor({}).color }}
                      >
                        {' '}
                        <AccessTimeIcon size={25} />
                        {' '}
                      </IconButton>

                    </MuiTooltip>
                  )}
                {ninjaDashboardDrill && ninjaDashboardDrill.data && ninjaDashboardDrill.data.ks_dashboard_pre_domain_filter && getFilterArray(ninjaDashboardDrill.data.ks_dashboard_pre_domain_filter) && getFilterArray(ninjaDashboardDrill.data.ks_dashboard_pre_domain_filter).length > 0 && (
                <>
                  <Autocomplete
                    id="demo"
                    size="small"
                    name="template"
                    className="width-210px mr-2 ml-2"
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
                    getOptionSelected={(option, value) => option.label === groupPreFiltersLabel}
                    getOptionLabel={(option) => (option && option.label ? option.label : '')}
                    options={filterOptions}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        onChange={searchFilterOptions}
                        value={searchValue}
                        label=""
                        variant="standard"
                        placeholder={getFilterPlaceholder(ninjaDashboardDrill.data.ks_dashboard_pre_domain_filter)}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {ninjaDashboardDrill && ninjaDashboardDrill.loading ? <CircularProgress color="inherit" size={20} /> : null}
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
                </>
                )}
                <span style={AddThemeColor({})}>
                  {customData
                      && customData.dateFiltersText
                      && selectedDateTag
                      && customData.dateFiltersText[selectedDateTag]
                    ? customData.dateFiltersText[selectedDateTag]
                    : ''}
                  {customDates}
                </span>
                  {!expandMode && showFilter && (
                  <MuiTooltip
                    title={(
                      <Typography>
                        Date Filters
                        {' ( '}
                        {customData && customData.dateFiltersText && selectedDateTag && customData.dateFiltersText[selectedDateTag] ? customData.dateFiltersText[selectedDateTag] : ''}
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
                      <TodayOutlinedIcon size={25} color="primary" />
                      {' '}
                    </IconButton>
                  </MuiTooltip>
                  )}
                <StaticDataExportFull
                  data={ninjaDashboardDrill && ninjaDashboardDrill.data ? ninjaDashboardDrill.data.ks_item_data : false}
                  dataList={ninjaDashboardDrill && ninjaDashboardDrill.data ? ninjaDashboardDrill.data.ks_gridstack_config : false}
                  dashboardName={dashboardName}
                  selectedDateTag={selectedDateTag}
                  customDateValue={customDateValue}
                  isDrill
                  onImageExport={() => exportAsImage(dashboardName)}
                />
                {!expandMode && editMode && (
                  <>
                    <Button
                      onClick={() => onUpdate()}
                      className="normal-btn"
                      variant="contained"
                    >
                      Save
                    </Button>
                    <Button
                      onClick={() => { setEditMode(false); setCustomLayouts(isIot ? dashboardLayouts16 : dashboardLayouts); }}
                      className="normal-btn"
                      variant="outlined"
                    >
                      Reset
                    </Button>
                  </>
                )}

                { /* !expandMode && isEditable && !editMode && (
                  <MuiTooltip title={<Typography>Rearrange Cards</Typography>}>
                    <IconButton
                      onClick={() => setEditMode(true)}
                      className="header-link-btn"
                    >
                      {' '}
                      <BsPencil size={20} />
                      {' '}
                    </IconButton>
                  </MuiTooltip>
                ) */ }
                { /* !editMode && (
                  <>
                    {expandMode ? (
                      <MuiTooltip title={<Typography>Exit Full Screen</Typography>}>
                        <IconButton
                          onClick={() => onExpandClose()}
                          className="header-link-btn"
                        >
                          <MdOutlineCloseFullscreen size={20} />
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
                              <MdOutlineOpenInFull size={20} color={AddThemeColor({}).color} />
                            </IconButton>
                          </MuiTooltip>
                        )}
                      </>
                    )}
                  </>
                ) */ }
              </>
              )}
            </div>
          </div>
          {loading && (
          <PageLoader type="max" />
          )}
          <div id="dynamic-drill-dashboard">
            {!isIot && (
            <ChartCards
              data={ninjaDashboardDrill && ninjaDashboardDrill.data ? ninjaDashboardDrill.data.ks_item_data : false}
              dataList={ninjaDashboardDrill && ninjaDashboardDrill.data ? ninjaDashboardDrill.data.ks_gridstack_config : false}
              editMode={editMode}
              code={code}
              selectedDateTag={selectedDateTag}
              setCustomLayouts={setCustomLayouts}
              dashboardLayouts={dashboardLayouts}
              dashboardColors={dashboardColors}
              customLayouts={customLayouts}
              isDrill
              advanceFilter={advanceFilter}
              expandMode={expandMode}
              hideExpand={hideExpand}
            />
            )}
            {isIot && (
            <ChartCardsIot
              data={
              ninjaDashboardDrill && ninjaDashboardDrill.data
                ? ninjaDashboardDrill.data.ks_item_data
                : false
            }
              dataList={
              ninjaDashboardDrill && ninjaDashboardDrill.data
                ? ninjaDashboardDrill.data.ks_gridstack_config
                : false
            }
              editMode={editMode}
              code={code}
              selectedDateTag={selectedDateTag}
              setCustomLayouts={setCustomLayouts}
              dashboardLayouts={dashboardLayouts16}
              dashboardColors={dashboardColorsIot}
              customLayouts={customLayouts}
              dashboardUuid={dashboardUuid}
              dashboardCode={dashboardCode}
              advanceFilter={advanceFilter}
              expandMode={expandMode}
              hideExpand={hideExpand}
              isIot
              isDrill
            />
            )}
          </div>
          {ninjaDashboardDrill && ninjaDashboardDrill.err && (
          <ErrorContent errorTxt={generateErrorMessage(ninjaDashboardDrill)} />
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
                  onClick={() => { onCloseDateFilter(); }}
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
                    {customData && customData.dateFiltersCurrent.map((dl) => (
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
                    {customData && customData.dateFiltersPast.map((dl) => (
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
                    {customData && customData.dateFiltersPastDays.map((dl) => (
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
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
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
                              <Box sx={{ mx: 2 }}> to </Box>
                              <TextField {...endProps} />
                            </>
                          )}
                        />
                      </LocalizationProvider>
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

DashboardDrillView.propTypes = {
  code: PropTypes.string.isRequired,
  defaultDate: PropTypes.string.isRequired,
  dashboardInterval: PropTypes.number.isRequired,
  dashboardLayouts: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  dashboardColors: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
};
export default DashboardDrillView;
