/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */
/* eslint-disable import/no-cycle */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect, useMemo } from 'react';
import {
  MdOutlineOpenInFull,
} from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import * as PropTypes from 'prop-types';
import html2canvas from 'html2canvas';
import IconButton from '@mui/material/IconButton';
import {
  Box as MuiBox,
  Typography,
  Dialog,
  ListItem,
  ListItemButton,
  Button,
  Divider,
} from '@mui/material';
import { DatePicker, Cascader } from 'antd';
import { IoCloseOutline, IoArrowBack } from 'react-icons/io5';
import { BsPencil } from 'react-icons/bs';
import RefreshIcon from '@mui/icons-material/Refresh';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TodayOutlinedIcon from '@mui/icons-material/TodayOutlined';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import MuiTooltip from '@shared/muiTooltip';

import ChartCards from './chartCards';
import './style.css';
import './dashboardOuter.css';
import { AddThemeColor, DateFilterButtons } from '../../themes/theme';

import {
  getLastUpdate,
} from '../../preventiveMaintenance/ppmService';

import {
  getNinjaDashboard,
  getNinjaDashboardTimer,
  updateDashboardLayouts,
  getNinjaCode,
} from '../../analytics/analytics.service';
import {
  getBTConfig,
} from '../../breakdownTracker/breakdownService';
import {
  generateErrorMessage,
  getListOfModuleOperations,
  getCompanyTimezoneDateLocal,
  getCompanyTimezoneDate,
  getColumnArrayById,
} from '../../util/appUtils';
import customData from '../data/customData.json';
import StaticDataExportFull from './staticDataExportFull';
import {
  getArrayNewUpdateFormat,
  getDateRange,
  getCompanyTimezoneDayjsLocal,
} from '../utils/utils';
import { getAllowedCompaniesInfo } from '../../adminSetup/setupService';
import { useTheme } from '../../ThemeContext';

const { RangePicker } = DatePicker;

const appModels = require('../../util/appModels').default;

const DashboardView = React.memo((props) => {
  const {
    code,
    defaultDate,
    dashboardInterval,
    dashboardLayouts,
    dashboardColors,
    advanceFilter,
    hideExpand,
    moduleName,
    moduleCode,
  } = props;
  const { themes } = useTheme();
  const dispatch = useDispatch();
  const [dateRangeDialog, setDateRangeDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [expandMode, setExpandMode] = useState(false);
  const [customLayouts, setCustomLayouts] = useState({});
  const [isGroupFilter, setGroupFilter] = useState(false);
  const [isDataFilter, showDateFilter] = useState(false);
  const [customDateValue, setCustomDateValue] = useState([null, null]);
  const [selectedDateTag, setDateTag] = useState(defaultDate);
  const [fetchDateTime, setFetchDateTime] = useState(false);
  const [cascaderValues, setCascaderValues] = useState([]);
  const [customFilter, setCustomFilter] = useState(false);

  const [reload, setReload] = useState(false);

  const [isTimer, setTimer] = useState(false);
  const [fetchTime, setFetchTime] = useState(false);
  const [isUpdateLoad, setIsUpdateLoad] = useState(false);

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const {
    allowedCompanies,
  } = useSelector((state) => state.setup);
  const { ninjaDashboard, updateLayoutInfo, ninjaDashboardCode } = useSelector(
    (state) => state.analytics,
  );
  const {
    warehouseLastUpdate,
  } = useSelector((state) => state.ppm);

  const lastUpdateTime = warehouseLastUpdate && warehouseLastUpdate.data && warehouseLastUpdate.data.length && warehouseLastUpdate.data[0].last_updated_at ? warehouseLastUpdate.data[0].last_updated_at : false;

  const isParent = userInfo.data && userInfo.data.company.is_parent;

  const timeZone = userInfo.data
    && userInfo.data.timezone ? userInfo.data.timezone : false;

  const allowedOperations = getListOfModuleOperations(
    userRoles && userRoles.data ? userRoles.data.allowed_modules : [],
    'Dashboards',
    'code',
  );

  const isEditable = allowedOperations.includes('edit_ninja_dashboard');

  const cd1 = useMemo(() => (selectedDateTag === 'l_custom' && customDateValue?.[0]?._d
    ? moment(customDateValue[0]._d).format('YYYY-MM-DD')
    : false), [selectedDateTag, customDateValue]);

  const cd2 = useMemo(() => (selectedDateTag === 'l_custom' && customDateValue?.[1]?._d
    ? moment(customDateValue[1]._d).format('YYYY-MM-DD')
    : false), [selectedDateTag, customDateValue]);

  const siteLevel = userInfo
    && userInfo.data
    && userInfo.data.main_company
    && userInfo.data.main_company.category
    && userInfo.data.main_company.category.name
    && userInfo.data.main_company.category.name === 'Companys'
    ? 'Company'
    : 'Site';

  useEffect(() => {
    if (userInfo && userInfo.data && userInfo.data.company.parent_id && userInfo.data.company.parent_id.id && isParent) {
      dispatch(getAllowedCompaniesInfo(false, 'childs', userInfo.data.company.id));
    }
  }, [userInfo]);

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
          start = `${moment(`${s1} 23:59:59`).utc().subtract(1, 'day').format('YYYY-MM-DDTHH:mm:ss')}`;
        } */
        context = {
          ksDateFilterEndDate: `${end}.00Z`,
          ksDateFilterSelection: 'l_custom',
          ksDateFilterStartDate: `${start}.00Z`,
          tz: timeZone,
        };
      }
      if (advanceFilter || customFilter) {
        context.ksDomain = advanceFilter || customFilter;
      }
      setFetchDateTime(new Date());
      dispatch(
        getNinjaDashboardTimer(
          'ks_fetch_dashboard_data',
          appModels.NINJABOARD,
          code,
          context,
        ),
      );
    }
  }, [isTimer]);

  useEffect(() => {
    if (customFilter && code) {
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
          start = `${moment(`${s1} 23:59:59`).utc().subtract(1, 'day').format('YYYY-MM-DDTHH:mm:ss')}`;
        } */
        context = {
          ksDateFilterEndDate: `${end}.00Z`,
          ksDateFilterSelection: 'l_custom',
          ksDateFilterStartDate: `${start}.00Z`,
          tz: timeZone,
        };
      }

      context.ksDomain = customFilter;

      setFetchDateTime(new Date());
      dispatch(
        getNinjaDashboard(
          'ks_fetch_dashboard_data',
          appModels.NINJABOARD,
          code,
          context,
        ),
      );
    }
  }, [customFilter]);

  useEffect(() => {
    if (moduleName && (moduleName === '52 Week PPM' || moduleName === 'Inspection Schedule')) {
      dispatch(getLastUpdate(moduleName === 'Inspection Schedule' ? appModels.INSPECTIONCHECKLISTLOGS : appModels.PPMWEEK));
    }
  }, [moduleName, isTimer, reload]);

  useEffect(() => {
    if (userInfo && userInfo.data && moduleName && moduleName === 'Breakdown Tracker') {
      dispatch(getBTConfig(userInfo.data.company.id, appModels.BREAKDOWNCONFIG));
    }
  }, [moduleName]);

  useEffect(() => {
    if (code && reload) {
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
      if (advanceFilter || customFilter) {
        context.ksDomain = advanceFilter || customFilter;
      }
      setFetchDateTime(new Date());
      dispatch(getNinjaDashboard(
        'ks_fetch_dashboard_data',
        appModels.NINJABOARD,
        code,
        context,
      ));
    }
  }, [reload]);

  useEffect(() => {
    if (ninjaDashboard && ninjaDashboard.data) {
      setFetchDateTime(new Date());
    }
  }, [ninjaDashboard]);

  useEffect(() => {
    if (defaultDate) {
      setDateTag(defaultDate);
    }
  }, [defaultDate]);

  const loading = ninjaDashboard && ninjaDashboard.loading;

  useMemo(() => {
    if (code) {
      setTimer(false);
      setFetchTime(false);
      const context = {
        ksDateFilterEndDate: false,
        ksDateFilterSelection: defaultDate || 'l_none',
        ksDateFilterStartDate: false,
        tz: timeZone,
      };
      if (advanceFilter || customFilter) {
        context.ksDomain = advanceFilter || customFilter;
      }
      setFetchDateTime(new Date());
      dispatch(
        getNinjaDashboard(
          'ks_fetch_dashboard_data',
          appModels.NINJABOARD,
          code,
          context,
        ),
      );
    }
  }, [code]);

  const dashboardName = ninjaDashboard && ninjaDashboard.data && ninjaDashboard.data.name
    ? ninjaDashboard.data.name
    : ' ';

  const onCloseDateFilter = () => {
    if (selectedDateTag === 'l_custom') {
      setDateRangeDialog(false);
      showDateFilter(false);
    } else {
      showDateFilter(false);
    }
  };

  const onBackDateFilter = () => {
    setCustomDateValue([null, null]);
    setDateRangeDialog(false);
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
          start = `${moment(`${s1} 23:59:59`).utc().subtract(1, 'day').format('YYYY-MM-DDTHH:mm:ss')}`;
        } */
        const context = {
          ksDateFilterEndDate: `${end}.00Z`,
          ksDateFilterSelection: 'l_custom',
          ksDateFilterStartDate: `${start}.00Z`,
          tz: timeZone,
        };
        showDateFilter(false);
        if (advanceFilter || customFilter) {
          context.ksDomain = advanceFilter || customFilter;
        }
        setFetchDateTime(new Date());
        dispatch(
          getNinjaDashboard(
            'ks_fetch_dashboard_data',
            appModels.NINJABOARD,
            code,
            context,
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
      if (advanceFilter || customFilter) {
        context.ksDomain = advanceFilter || customFilter;
      }
      setFetchDateTime(new Date());
      dispatch(getNinjaCode(moduleCode, appModels.NINJABOARD, false, false, false));
      /* dispatch(
        getNinjaDashboard(
          'ks_fetch_dashboard_data',
          appModels.NINJABOARD,
          code,
          context,
        ),
      ); */
    }
  }, [updateLayoutInfo]);

  const onChangeDate = (value) => {
    setDateTag(value);
    if (value !== 'l_custom') {
      setCustomDateValue([null, null]);
      showDateFilter(false);
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
        dispatch(updateDashboardLayouts(code, appModels.NINJABOARD, postData));
      } else { */
      const context = {
        ksDateFilterEndDate: false,
        ksDateFilterSelection: value,
        ksDateFilterStartDate: false,
        tz: timeZone,
      };
      if (advanceFilter || customFilter) {
        context.ksDomain = advanceFilter || customFilter;
      }
      setFetchDateTime(new Date());
      dispatch(
        getNinjaDashboard(
          'ks_fetch_dashboard_data',
          appModels.NINJABOARD,
          code,
          context,
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
        dashboard_json: customLayouts,
      };
      if (seqdata && seqdata.length) {
        postData.ks_dashboard_items_ids = seqdata;
      }
      setIsUpdateLoad(true);
      dispatch(updateDashboardLayouts(code, appModels.NINJABOARD, postData));
    }
    setEditMode(false);
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
    const sidebarDiv = document.getElementById('collapse-sidebar');
    const componentHeader = document.getElementById('component-header');
    const menuHeader = document.getElementById('mainHeader2');

    if (headerDiv && sidebarDiv) {
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

    if (headerDiv && sidebarDiv) {
      headerDiv.style.display = 'flex';
      sidebarDiv.style.display = 'block';
      menuHeader.style.display = 'flex';
      componentHeaderExpand.style.width = '95%';
      componentHeaderHover.style.marginLeft = '5%';
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

  const hierarchicalData = useMemo(() => (userInfo.data.allowed_companies.reduce((acc, item) => {
    // Get the region information
    const regionId = item.region?.id?.[0]; // Region ID
    const regionName = item.region?.name; // Region Name

    // Skip items without a valid region
    if (!regionId || !regionName) {
      return acc;
    }

    // Find or create the region entry
    let regionEntry = acc.find((region) => region.value === regionId);

    if (!regionEntry) {
      regionEntry = {
        label: regionName,
        value: regionId,
        children: [], // Initialize an empty children array for the region
      };
      acc.push(regionEntry);
    }

    // Add the current item as a child of the region
    regionEntry.children.push({
      label: item.name,
      value: item.id,
      address: item.street_address || '', // Additional information
    });

    return acc;
  }, [])), [userInfo?.data?.allowed_companies]);

  const hierarchicalData1 = useMemo(() => (allowedCompanies && allowedCompanies.data && allowedCompanies.data.length ? allowedCompanies.data.reduce((acc, item) => {
    // Get the region information
    const regionId = item.region_id?.[0]; // Region ID
    const regionName = item.region_id?.[1]; // Region Name

    // Skip items without a valid region
    if (!regionId || !regionName) {
      return acc;
    }

    // Find or create the region entry
    let regionEntry = acc.find((region) => region.value === regionId);

    if (!regionEntry) {
      regionEntry = {
        label: regionName,
        value: regionId,
        children: [], // Initialize an empty children array for the region
      };
      acc.push(regionEntry);
    }

    // Add the current item as a child of the region
    regionEntry.children.push({
      label: item.name,
      value: item.id,
    });

    return acc;
  }, []) : []), [allowedCompanies?.data]);

  const showFilter = !(ninjaDashboard && ninjaDashboard.data && ninjaDashboard.data.disable_dashboard_date_filter);

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  document.addEventListener('fullscreenchange', (event) => {
    if (document.fullscreenElement) {
      const layout = document.getElementById('dynamic-dashboard');
      layout.style.background = '#f7fafc';
      onExpand();
    } else {
      onExpandClose();
    }
  });

  const customDate1 = selectedDateTag && selectedDateTag === 'l_custom' && customDateValue && customDateValue.length && customDateValue[0] && customDateValue[0] !== null ? moment(customDateValue[0]._d).format('DD-MMM-YYYY') : false;
  const customDate2 = selectedDateTag && selectedDateTag === 'l_custom' && customDateValue && customDateValue.length && customDateValue[1] && customDateValue[1] !== null ? moment(customDateValue[1]._d).format('DD-MMM-YYYY') : false;

  const customDates = customDate1 && customDate2 ? ` (${customDate1} to ${customDate2})` : '';

  const onChange = (list, values) => {
    setCascaderValues(list);
    if (!(list && list.length)) {
      setCustomFilter(false);
      if (code) {
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
            start = `${moment(`${s1} 23:59:59`).utc().subtract(1, 'day').format('YYYY-MM-DDTHH:mm:ss')}`;
          } */
          context = {
            ksDateFilterEndDate: `${end}.00Z`,
            ksDateFilterSelection: 'l_custom',
            ksDateFilterStartDate: `${start}.00Z`,
            tz: timeZone,
          };
        }

        setFetchDateTime(new Date());
        dispatch(
          getNinjaDashboard(
            'ks_fetch_dashboard_data',
            appModels.NINJABOARD,
            code,
            context,
          ),
        );
      }
    }
  };

  const onCompanyChange = () => {
    const list = cascaderValues;
    if (list && list.length > 1) {
      const ids = list.map((item) => item.length && item.length > 1 && item[1]);
      const rIds = list.map((item) => item.length && item.length === 1 && item[0]);
      const rIdsNew = rIds && rIds.length ? rIds.filter((item) => item) : [];
      const idsNew = ids.filter((item) => item);
      console.log(idsNew);
      console.log(rIdsNew);
      let filteredCompanies = [];

      if (rIdsNew && rIdsNew.length) {
        const companies = userInfo.data.allowed_companies;
        filteredCompanies = companies.filter(
          (company) => company.region && company.region.id && rIdsNew.includes(company.region.id[0]),
        );
      }

      if (idsNew && idsNew.length && !filteredCompanies.length) {
        setCustomFilter(`[('company_id','in',${JSON.stringify(idsNew)})]`);
      } else if (filteredCompanies.length && !(idsNew && idsNew.length)) {
        const cids = getColumnArrayById(filteredCompanies, 'id');
        setCustomFilter(`[('company_id','in',${JSON.stringify(cids)})]`);
      } else if (filteredCompanies.length && (idsNew && idsNew.length)) {
        const cids = getColumnArrayById(filteredCompanies, 'id');
        const newIds = [...cids, ...idsNew];
        setCustomFilter(`[('company_id','in',${JSON.stringify(newIds)})]`);
      }
    } else if (list && list.length === 1) {
      const cids = list.map((item) => item.length && item.length > 1 && item[1]);
      const rIds = list.map((item) => item.length && item.length === 1 && item[0]);
      const rIdsNew = rIds && rIds.length ? rIds.filter((item) => item) : [];
      const idsNew = cids.filter((item) => item);
      console.log(idsNew);
      console.log(rIdsNew);
      let filteredCompanies = [];

      if (rIdsNew && rIdsNew.length) {
        const companies = userInfo.data.allowed_companies;
        filteredCompanies = companies.filter(
          (company) => company.region && company.region.id && rIdsNew.includes(company.region.id[0]),
        );
      }

      if (idsNew && idsNew.length && !filteredCompanies.length) {
        setCustomFilter(`[('company_id','in',${JSON.stringify(idsNew)})]`);
      } else if (filteredCompanies.length && !(idsNew && idsNew.length)) {
        const cids1 = getColumnArrayById(filteredCompanies, 'id');
        setCustomFilter(`[('company_id','in',${JSON.stringify(cids1)})]`);
      } else if (filteredCompanies.length && (idsNew && idsNew.length)) {
        const cids1 = getColumnArrayById(filteredCompanies, 'id');
        const newIds = [...cids1, ...idsNew];
        setCustomFilter(`[('company_id','in',${JSON.stringify(newIds)})]`);
      }
    } else {
      setCustomFilter(false);
      if (code) {
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
          start = `${moment(`${s1} 23:59:59`).utc().subtract(1, 'day').format('YYYY-MM-DDTHH:mm:ss')}`;
        } */
          context = {
            ksDateFilterEndDate: `${end}.00Z`,
            ksDateFilterSelection: 'l_custom',
            ksDateFilterStartDate: `${start}.00Z`,
            tz: timeZone,
          };
        }

        setFetchDateTime(new Date());
        dispatch(
          getNinjaDashboard(
            'ks_fetch_dashboard_data',
            appModels.NINJABOARD,
            code,
            context,
          ),
        );
      }
    }
  };

  const getDateRangeDates = selectedDateTag && customData?.dateFiltersText?.[selectedDateTag]
    ? getDateRange(selectedDateTag)
    : null;

  const getDateRangeDatesList = getDateRangeDates?.length === 2
  && getDateRangeDates[0] != null
  && getDateRangeDates[1] != null
    ? `${getCompanyTimezoneDayjsLocal(getDateRangeDates[0], userInfo, 'date')} - ${getCompanyTimezoneDayjsLocal(getDateRangeDates[1], userInfo, 'date')}`
    : '';

  const dropdownRender = (menus) => (
    <div>
      {menus}
      {cascaderValues && cascaderValues.length > 0 && (
        <>
          <Divider
            style={{
              margin: 0,
            }}
          />
          <div
            style={{
              padding: 8,
            }}
            className="text-right"
          >
            <Button
              onClick={() => onCompanyChange()}
              className="normal-btn"
              variant="contained"
            >
              Apply
            </Button>
          </div>
        </>
      )}
    </div>
  );

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
                {dashboardName || ''}
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
                      {' '}
                      <RefreshIcon size={25} color={themes === 'light' ? 'black' : AddThemeColor({}).color} />
                      {' '}
                    </IconButton>

                  </MuiTooltip>

                  {moduleName && !(moduleName === '52 Week PPM' || moduleName === 'Inspection Schedule') && fetchDateTime && (
                    <MuiTooltip
                      title={(
                        <Typography>
                          Last Updated on
                          {' '}
                          {lastUpdateTime ? getCompanyTimezoneDate(lastUpdateTime, userInfo, 'datetime') : getCompanyTimezoneDateLocal(fetchDateTime, userInfo, 'datetime')}
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
                        className="header-link-btn"
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
                  {showFilter && isParent && (
                    <Cascader
                      style={{
                        width: '200px',
                        marginLeft: '5px',
                      }}
                      options={userInfo && userInfo.data && userInfo.data.company.parent_id && userInfo.data.company.parent_id.id ? hierarchicalData1 : hierarchicalData}
                      value={cascaderValues}
                      onChange={(values, selectedOptions) => onChange(values, selectedOptions)}
                      placeholder="Select Regions"
                      dropdownRender={dropdownRender}
                      multiple
                      maxTagCount="responsive"
                    />
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
                        className="normal-btn"
                        variant="contained"
                      >
                        Save
                      </Button>
                      <Button
                        onClick={() => {
                          setEditMode(false);
                          setCustomLayouts(dashboardLayouts);
                        }}
                        className="normal-btn"
                        variant="outlined"
                      >
                        Reset
                      </Button>
                    </>
                  )}

                  {!expandMode && isEditable && !editMode && (
                    <MuiTooltip title={<Typography>Rearrange Cards</Typography>}>
                      <IconButton
                        onClick={() => setEditMode(true)}
                        className="header-link-btn"
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
                      {!hideExpand && (
                        <MuiTooltip title={<Typography>Full Screen</Typography>}>
                          <IconButton
                            onClick={() => onExpand()}
                            className="header-link-btn"
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
            </div>
          </div>
          {loading && (
            <div className="margin-top-250px">
              <Loader />
            </div>
          )}
          <div>
            <Stack>
              {!loading && moduleName && (moduleName === '52 Week PPM' || moduleName === 'Inspection Schedule') && lastUpdateTime && (
                <Alert severity="info" sx={{ justifyContent: 'center' }}>
                  Last Updated at:
                  {'  '}
                  {lastUpdateTime ? getCompanyTimezoneDate(lastUpdateTime, userInfo, 'datetime') : 'N/A'}
                </Alert>
              )}
            </Stack>
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
              expandMode={expandMode}
              selectedDateTag={selectedDateTag}
              customDateValue={customDateValue}
              setCustomLayouts={setCustomLayouts}
              dashboardLayouts={dashboardLayouts}
              dashboardColors={dashboardColors}
              customLayouts={customLayouts}
              advanceFilter={advanceFilter}
              hideExpand={hideExpand}
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

                      { /* <LocalizationProvider dateAdapter={AdapterDayjs}>
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

DashboardView.propTypes = {
  code: PropTypes.string.isRequired,
  defaultDate: PropTypes.string.isRequired,
  dashboardInterval: PropTypes.number.isRequired,
  dashboardLayouts: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
    .isRequired,
  dashboardColors: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
    .isRequired,
};
export default DashboardView;
