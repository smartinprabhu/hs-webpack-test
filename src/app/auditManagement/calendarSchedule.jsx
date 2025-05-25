/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable max-len */
/* eslint-disable prefer-destructuring */
/* eslint-disable consistent-return */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-param-reassign */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/no-danger */
import Pagination from '@material-ui/lab/Pagination';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import {
  Autocomplete, Box, Button, CircularProgress, Drawer, IconButton, TextField, Typography,
} from '@mui/material';
import MuiTooltip from '@shared/muiTooltip';
import DOMPurify from 'dompurify';
import { useHistory } from 'react-router-dom';
import { Tooltip } from 'antd';
import moment from 'moment';
import * as PropTypes from 'prop-types';
import React, { useEffect, useState, useMemo } from 'react';
import Scheduler, {
  AddMorePopover,
  DATE_FORMAT,
  SchedulerData, ViewTypes,
} from 'react-big-scheduler';
import 'react-big-scheduler/lib/css/style.css';
import {
  CgExport,
} from 'react-icons/cg';
import { RxReload } from 'react-icons/rx';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  Col, Row,
} from 'reactstrap';
import { makeStyles } from '@material-ui/core/styles';

import auditBlue from '@images/icons/auditBlue.svg';

import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';

import { setInitialValues } from '../purchase/purchaseService';
import ReportsFilterDrawer from '../commonComponents/reportsFilterDrawer';
import actionCodes1 from '../helpdesk/data/helpdeskActionCodes.json';
import {
  hxAuditStatusJson,
} from '../commonComponents/utils/util';

import {
  getCustomDate, getDateLabelFunc, getHeaderDateFormat,
  isNonWorkingTime,
} from '../preventiveMaintenance/utils/utils';
import withDragDropContext from '../preventiveMaintenance/withDnDContext';
import DrawerHeader from '../commonComponents/drawerHeader';
import { AddThemeBackgroundColor, AddThemeColor, ReturnThemeColor } from '../themes/theme';
import {
  generateErrorMessage,
  getAllCompanies,
  getColumnArrayById,
  getColumnArrayByIdWithArray,
  getStartTime, getEndTime,
  getDatePickerFormat,
  getListOfOperations,
  getPagesCountV2,
  getTotalFromArray,
  truncate, truncateWord,
} from '../util/appUtils';
import customData from './data/customData.json';
import {
  getAuditViewer,
  getAuditGroups,
  resetAuditViewer,
  resetCreateHxAudit,
  resetUpdateHxAudit,
  getHxAuditDetails,
  getHxAuditConfigData,
  getCustomGroup,
  resetCustomGroup,
  getActionFilters,
} from './auditService';
import {
  getEventData,
  getResources,
} from './utils/utils';
import '../inspectionSchedule/viewer/calendarStyle.scss';
import AddAudit from './addAudit';
import AuditDetails from './auditDetails/auditDetails';
import actionCodes from './data/actionCodes.json';
import ExportDrawer from '../commonComponents/exportDrawer';
import DataExport from './dataExport/dataExport';

const appModels = require('../util/appModels').default;

const useStyles = makeStyles({
  input: {
    fontFamily: 'Suisse Intl',
    fontSize: '14px',
  },
  option: {
    fontFamily: 'Suisse Intl', // Change font family
    fontSize: '14px', // Change font size
  },
});

const CalendarSchedule = ({ userInfo }) => {
  const dispatch = useDispatch();
  moment.locale('en', { week: { dow: 1, doy: 7 } });
  const schedulerData = new SchedulerData(
    moment().format(DATE_FORMAT),
    ViewTypes.Custom,
    false,
    false,
    {
      resourceName: '',
      schedulerWidth: '85%',
      dayResourceTableWidth: 100,
      weekResourceTableWidth: 100,
      monthResourceTableWidth: 100,
      customResourceTableWidth: 100,
      weekCellWidth: '15%',
      agendaResourceTableWidth: 90,
      nonAgendaSlotMinHeight: 50,
      dayCellWidth: 42,
      monthCellWidth: 42,
      weekMaxEvents: 2,
      monthMaxEvents: 1,
      dayMaxEvents: 1,
      customCellWidth: 42,
      nonWorkingTimeHeadBgColor: '#fff',
      nonWorkingTimeBodyBgColor: '#fff',
      nonAgendaOtherCellHeaderFormat: getHeaderDateFormat(userInfo, 'date'),
      minuteStep: 60,
      addMorePopoverHeaderFormat: getHeaderDateFormat(userInfo, 'date'),
      scrollToSpecialMomentEnabled: false,
      views: [
        {
          viewName: 'Week', viewType: ViewTypes.Week, showAgenda: false, isEventPerspective: false,
        },
        {
          viewName: 'Month', viewType: ViewTypes.Custom, showAgenda: false, isEventPerspective: false,
        },
        {
          viewName: 'Quarter', viewType: ViewTypes.Quarter, showAgenda: false, isEventPerspective: false,
        },
      ],
    },
    { getCustomDateFunc: getCustomDate, isNonWorkingTimeFunc: isNonWorkingTime },
  );
  schedulerData.setLocaleMoment(moment);
  schedulerData.setEvents([]);
  const [viewModal, setViewModal] = useState(schedulerData);
  const [enter, setEnter] = useState('');
  const [viewHead, setViewHead] = useState('Day');
  const [eventModal, setEventModal] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [calendarData, setCalendarData] = useState(false);
  const [headerItem, setHeaderItem] = useState(undefined);
  const [leftPop, setLeftPop] = useState(0);
  const [topPop, setTopPop] = useState(0);
  const [heightPop, setHeightPop] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState(['All']);
  const [selectedField, setSelectedField] = useState(null);
  const [labelField, setLabelField] = useState('');
  const [groupData, setGroupData] = useState([]);
  const [reload, setReload] = useState(false);
  const [activeStatus, setActiveStatus] = useState(false);

  const [groupFilters, setSelectedGroupFilters] = useState([]);

  const [isFilterApply, setFilterApply] = useState(true);
  const [isFilter, setFilter] = useState(false);
  const [isStatusFilter, setStatusFilter] = useState(false);
  const [isGroupFilter, setGroupFilter] = useState(false);
  const [assetLoad, setAssetLoad] = useState(false);
  const [isNext, setNext] = useState(true);

  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);

  const [viewId, setViewId] = useState(false);
  const [viewModel, setViewModel] = useState(false);

  const [addModal, showAddModal] = useState(false);

  const [assetIds, setAssetIds] = useState([]);

  const classes = useStyles();
  const history = useHistory();

  const [groupField, setGroupField] = useState('audit_system_id');
  const [groupFieldOptions, setGroupFieldOptions] = useState({ value: 'audit_system_id', label: 'Audit System' });

  const [pageGroupData, setPageGroupData] = useState([]);
  const [pageGroupDetailData, setPageGroupDetailData] = useState([]);

  const [totalLen, setTotalLen] = useState(0);

  const [statusOpen, setStatusOpen] = useState(false);
  const [statusOptions, setStatusOptions] = useState([{ value: 'All', label: 'All' }]);

  const [customOpen, setCustomOpen] = useState(false);
  const [customOptions, setCustomOptions] = useState('');

  const [customSelectedOpen, setCustomSelectedOpen] = useState(false);
  const [customSelectedOptions, setCustomSelectedOptions] = useState([]);

  const [enforceOpen, setEnforceOpen] = useState(false);
  const [enforceOptions, setEnforceOptions] = useState('');

  const [typeOpen, setTypeOpen] = useState(false);
  const [typeOptions, setTypeOptions] = useState('');

  const [filterOpen, setFilterOpen] = useState(false);
  const [showExport, setShowExport] = useState(false);

  const [exportType, setExportType] = useState('');
  const [exportTrue, setExportTrue] = useState('');

  const [systemData, setSystemData] = useState('');

  const [groupOpen, setGroupOpen] = useState(false);

  const [customFilters, setCustomFilters] = useState({
    statusOptions,
    customOptions,
    customSelectedOptions,
    typeOptions,
    enforceOptions,
  });

  const { userRoles } = useSelector((state) => state.user);

  const companies = getAllCompanies(userInfo, userRoles);

  const {
    auditViewerInfo,
    customDataGroup,
    hxAuditCreate,
    auditViewerExportInfo,
    auditGroups,
    hxAuditDetailsInfo,
  } = useSelector((state) => state.hxAudits);

  const isParent = userInfo && userInfo.data.company && userInfo.data.company.is_parent;

  const allowedOperations = getListOfOperations(
    userRoles && userRoles.data ? userRoles.data.allowed_modules : [],
    'code',
  );

  const isCreatable = allowedOperations.includes(actionCodes['Create Audit']);

  const isShowAll = allowedOperations && allowedOperations.includes(actionCodes1['All Commpany']);

  useMemo(() => {
    dispatch(getActionFilters([]));
  }, []);

  useMemo(() => {
    const totalLen1 = getTotalFromArray(auditGroups && auditGroups.data ? auditGroups.data : [], `${groupField}_count`);
    setTotalLen(totalLen1);
  }, [JSON.stringify(auditGroups)]);

  const totalDataCount1 = auditGroups && auditGroups.data ? auditGroups.data.length : 0;

  const totalDataCount = totalDataCount1;

  // const totalLen = (totalLen1 + totalLen2);

  const limit = 5;

  const pages = totalLen && auditViewerInfo && auditViewerInfo.data ? getPagesCountV2(totalDataCount, limit) : 0;

  useEffect(() => {
    dispatch(resetAuditViewer());
  }, []);

  const getDateLabel = () => {
    if (viewModal) {
      const { startDate } = viewModal;
      const { endDate } = viewModal;
      const { viewType } = viewModal;
      const start = moment(startDate);
      const end = moment(endDate);
      let dateLabel = start.format('LL');
      if (startDate !== endDate) {
        dateLabel = `${start.format('LL')}-${end.format('LL')}`;
      } else {
        dateLabel = getDateLabelFunc(viewModal, viewType, startDate, endDate);
      }
      return dateLabel;
    }
    return '';
  };

  const getWeekCount = () => {
    if (viewModal) {
      const { startDate } = viewModal;
      const { viewType } = viewModal;
      if (viewType === 1) {
        const viewDate = moment(startDate).format('MM-DD-YYYY');
        const weekcount = moment(viewDate, 'MM-DD-YYYY').isoWeek();
        const labelWeek = `Week ${weekcount}`;
        return labelWeek;
      }
      return '';
    }
    return '';
  };

  useEffect(() => {
    if (viewModal) {
      let isMounted = true;
      if (isMounted) {
        const thead = document.getElementById('RBS-Scheduler-root').tHead;
        const row = thead.insertRow(1);
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        // cell1.innerHTML = '<span class="ml-3 mr-2">Asset</span>';
        // cell2.innerHTML = `<div class="p-1 d-inline-block font-size-13"><span id="dateLabelText"></span></div><span id="weekLabelCount" class="float-right p-1 mr-2 font-size-13">${getWeekCount()}</span>`;
        const { resources } = viewModal;
        const resourceTable = document.getElementsByClassName('resource-table');
        for (let i = 0; i < resources.length; i += 1) {
          resourceTable[1].rows[i].cells[0].innerHTML = `<span class="ml-2 mr-2 textwrapdots
      d-inline-block width-160 text-left resourceHeading" title="${resources[i].name}">${resources[i].name}</span>
      <span class="ml-2 mr-2 textwrapdots
      d-inline-block width-160 float-right resourceHeading" title="${resources[i].reference}">${truncate(resources[i].reference, 20)}</span>`;
        }
      }
      return () => { isMounted = false; };
    }
  }, [viewModal]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const { startDate } = viewModal;
      const { endDate } = viewModal;

      const { viewType } = viewModal;

      const start = moment(getStartTime(startDate)).utc().format('YYYY-MM-DD HH:mm:ss');
      const end = moment(getEndTime(endDate)).utc().format('YYYY-MM-DD HH:mm:ss');

      dispatch(resetAuditViewer());
      const customData = getColumnArrayByIdWithArray(customSelectedOptions, selectedField);
      setSelectedGroupFilters(customData);
      const enforceData = enforceOptions ? enforceOptions.value : false;
      const inspectionTypeData = typeOptions ? typeOptions.value : false;
      const isAll = selectedFilter.filter((item) => item === 'All') && selectedFilter.filter((item) => item === 'All').length ? ['Missed', 'Upcoming', 'Completed', 'Started', 'Signed off', 'Reviewed', 'Inprogress', 'Canceled'] : selectedFilter;
      dispatch(getAuditGroups(companies, appModels.HXAUDIT, groupField, start, end, isAll, selectedField, customData));
    }
  }, [isFilterApply, reload, groupField]);

  useMemo(() => {
    if (hxAuditCreate && hxAuditCreate.data) {
      const { startDate } = viewModal;
      const { endDate } = viewModal;

      const { viewType } = viewModal;

      const start = moment(getStartTime(startDate)).utc().format('YYYY-MM-DD HH:mm:ss');
      const end = moment(getEndTime(endDate)).utc().format('YYYY-MM-DD HH:mm:ss');

      dispatch(resetAuditViewer());
      const customData = getColumnArrayByIdWithArray(customSelectedOptions, selectedField);
      setSelectedGroupFilters(customData);
      const isAll = selectedFilter.filter((item) => item === 'All') && selectedFilter.filter((item) => item === 'All').length ? ['Missed', 'Upcoming', 'Completed', 'Started', 'Signed off', 'Reviewed', 'Inprogress', 'Canceled'] : selectedFilter;
      dispatch(getAuditGroups(companies, appModels.HXAUDIT, groupField, start, end, isAll, selectedField, customData));
    }
  }, [hxAuditCreate]);

  useMemo(() => {
    if (userInfo && userInfo.data
      && ((auditGroups && auditGroups.data && !auditGroups.loading)
        || (auditGroups && auditGroups.data && !auditGroups.loading)) && totalLen && assetIds && assetIds.length) {
      const { startDate } = viewModal;
      const { endDate } = viewModal;

      const { viewType } = viewModal;

      const start = moment(getStartTime(startDate)).utc().format('YYYY-MM-DD HH:mm:ss');
      const end = moment(getEndTime(endDate)).utc().format('YYYY-MM-DD HH:mm:ss');

      const customData = getColumnArrayByIdWithArray(customSelectedOptions, selectedField);
      setSelectedGroupFilters(customData);
      const enforceData = enforceOptions ? enforceOptions.value : false;
      const inspectionTypeData = typeOptions ? typeOptions.value : false;
      const isAll = selectedFilter.filter((item) => item === 'All') && selectedFilter.filter((item) => item === 'All').length ? ['Missed', 'Upcoming', 'Completed', 'Started', 'Signed off', 'Reviewed', 'Inprogress', 'Canceled'] : selectedFilter;
      dispatch(getAuditViewer(companies, appModels.HXAUDIT, groupField, start, end, isAll, selectedField, customData, assetIds, totalLen));
    }
  }, [assetLoad, totalLen]);

  useEffect(() => {
    if (selectedField && userInfo && userInfo.data) {
      const { startDate } = viewModal;
      const { endDate } = viewModal;

      const start = moment(getStartTime(startDate)).utc().format('YYYY-MM-DD HH:mm:ss');
      const end = moment(getEndTime(endDate)).utc().format('YYYY-MM-DD HH:mm:ss');

      dispatch(getCustomGroup(companies, appModels.HXAUDIT, selectedField, start, end));
    }
  }, [selectedField, enter]);

  useMemo(() => {
    if (auditGroups && auditGroups.err && !auditGroups.loading) {
      const { startDate } = viewModal;
      const { endDate } = viewModal;
      console.log(auditGroups.err);

      const { viewType } = viewModal;
      const customData = getColumnArrayByIdWithArray(customSelectedOptions, selectedField);
      setSelectedGroupFilters(customData);

      const start = moment(getStartTime(startDate)).utc().format('YYYY-MM-DD HH:mm:ss');
      const end = moment(getEndTime(endDate)).utc().format('YYYY-MM-DD HH:mm:ss');

      const isAll = selectedFilter.filter((item) => item === 'All') && selectedFilter.filter((item) => item === 'All').length ? ['Missed', 'Upcoming', 'Completed', 'Started', 'Signed off', 'Reviewed', 'Inprogress', 'Canceled'] : selectedFilter;

      dispatch(getAuditViewer(companies, appModels.HXAUDIT, groupField, start, end, isAll, selectedField, customData, assetIds, totalLen));
    }
  }, [auditGroups && auditGroups.err && auditGroups.err.status]);

  /* useEffect(() => {
    if (selectedField && userInfo && userInfo.data) {
      const { startDate } = viewModal;
      const { endDate } = viewModal;
      const { viewType } = viewModal;

      const start = moment(startDate).format('YYYY-MM-DD');
      const end = moment(endDate).format('YYYY-MM-DD');

      dispatch(getCustomGroup(companies, appModels.HXAUDIT, selectedField, userInfo.data.id, userInfo.data.is_parent, false, teamsList, 'date', start, end, viewType === 5 ? 'yes' : false));
    }
  }, [selectedField, enter]); */

  useEffect(() => {
    if ((customDataGroup && customDataGroup.data && customDataGroup.data.length)) {
      const newArrData = customDataGroup.data.map((cl) => ({
        ...cl,
        value: cl[selectedField] && cl[selectedField].length ? cl[selectedField][0] : '',
        label: cl[selectedField] && cl[selectedField].length ? cl[selectedField][1] : '',
      }));
      setGroupData(newArrData);
    } else {
      setGroupData([]);
    }
  }, [customDataGroup]);

  useEffect(() => {
    if (viewId) {
      dispatch(getHxAuditDetails(viewId, appModels.HXAUDIT));
      setEventModal(true);
    }
  }, [viewId]);

  useEffect(() => {
    if (userInfo && userInfo.data && userInfo.data.company) {
      dispatch(getHxAuditConfigData(userInfo.data.company.id, appModels.HXAUDITCONFIG));
    }
  }, [userInfo]);

  useEffect(() => {
    if (history.location && history.location.state && history.location.state.id) {
      dispatch(getHxAuditDetails(history.location.state.id, appModels.HXAUDIT));
      setEventModal(true);
      history.replace({
        ...history.location,
        state: null, // Clear the state
      });
    }
  }, [history]);

  useEffect(() => {
    if ((auditGroups && auditGroups.data && auditGroups.data.length)) {
      const newArrData = auditGroups.data.map((cl) => ({
        ...cl,
        value: cl[groupField][0],
        label: cl[groupField][1],
      }));
      const loadData = getColumnArrayById(newArrData, 'value');
      const newData = [...pageGroupData, ...loadData];
      setPageGroupData([...new Map(newData.map((item) => [item, item])).values()]);
      setPageGroupDetailData([...pageGroupDetailData, ...newArrData]);
      if (assetIds && !assetIds.length) {
        setAssetIds(loadData.slice(0, limit));
        setAssetLoad(Math.random());
      } else if (assetIds && assetIds.length < 5) {
        const uniAssetIds = [...assetIds, ...loadData];
        const aids = [...new Map(uniAssetIds.map((item) => [item, item])).values()];
        setAssetIds(aids.slice(0, limit));
        setAssetLoad(Math.random());
      }
    }
  }, [auditGroups]);

  const comDate = new Date();

  const prevClickCustom = () => {
    const { startDate } = viewModal;
    // if (new Date(startDate) >= new Date(comDate)) {
    const sdata = viewModal;
    sdata.prev();
    setViewModal(sdata);
    setOffset(0);
    setPage(1);
    setAssetIds([]);
    setAssetLoad(Math.random());
    setPageGroupData([]);
    setPageGroupDetailData([]);
    setEnter(Math.random());
    // }
  };

  const nextClickCustom = () => {
    if (isNext) {
      const sdata = viewModal;
      sdata.next();
      setViewModal(sdata);
      setOffset(0);
      setPage(1);
      setAssetIds([]);
      setAssetLoad(Math.random());
      setPageGroupData([]);
      setPageGroupDetailData([]);
      setEnter(Math.random());
    }
  };

  const leftCustom = (
    `<div class="font-11">
     ${(new Date(viewModal.startDate)) ? '<span class="arrow-show left-show float-left ml-2 mt-1 cursor-pointer" id="previousButton"></span>' : ''}
        ${getDateLabel()}
        ${isNext ? '<span class="arrow-show right-show float-right mr-2 mt-1 cursor-pointer" id="nextButton"></span>' : ''}
    </div>`
  );

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      const { resources, events } = viewModal;
      const resourceTable = document.getElementsByClassName('resource-table');

      const checkedButton = document.getElementsByClassName('ant-radio-button-wrapper-checked');

      const checkedButtons = document.getElementsByClassName('ant-radio-button-wrapper');

      const rows = resourceTable[0].getElementsByClassName('header3-text');
      if (rows && rows.length) {
        rows[0].innerHTML = `${leftCustom}${getWeekCount()}`;
      }

      if (resourceTable && resourceTable.length) {
        resourceTable[0].style.backgroundColor = ReturnThemeColor();
        resourceTable[0].style.color = '#fff';
      }

      if (checkedButton && checkedButton.length) {
        checkedButton[0].style.backgroundColor = ReturnThemeColor();
        checkedButton[0].style.color = '#fff';
      }

      for (let i = 0; i < checkedButtons.length; i += 1) {
        if (checkedButtons[i].className !== 'ant-radio-button-wrapper ant-radio-button-wrapper-checked') {
          checkedButtons[i].style.backgroundColor = '#fff';
          checkedButtons[i].style.color = 'rgba(0, 0, 0, 0.65)';
        }
      }
      /* const dayFilter = document.getElementsByClassName('ant-radio-button-wrapper-checked')
       if (dayFilter && dayFilter.length) {
         dayFilter[0].style.backgroundColor = ReturnThemeColor()
         dayFilter[0].style.color = '#fff'
         dayFilter[0].style.border = 'none'
       } */

      for (let i = 0; i < resources.length; i += 1) {
        if (resourceTable[1].rows && resourceTable[1].rows.length) {
          resourceTable[1].rows[i].cells[0].innerHTML = `
            <p class='row ml-3 mb-0 resource-item font-weight-800 font-size-12px' title="${resources[i].name}"> 
           ${resources[i].name}
            </p><p class="row ml-3 mb-0 font-weight-500 font-size-12px" title="${resources[i].reference}"> ${truncate(resources[i].reference, 20)}</p>`;
        }
      }

      const previousButtonClick = document.getElementById('previousButton');
      if (previousButtonClick) {
        previousButtonClick.addEventListener('click', () => prevClickCustom());
      }

      const nextButtonClick = document.getElementById('nextButton');
      if (nextButtonClick) {
        nextButtonClick.addEventListener('click', () => nextClickCustom());
      }
    }
    return () => { isMounted = false; };
  }, [calendarData]);

  useEffect(() => {
    if (enter) {
      setHeaderItem(undefined);
      setLeftPop(0);
      setTopPop(0);
      setHeightPop(0);
      setViewModal(viewModal);
      setViewHead(viewHead);
      const { startDate } = viewModal;
      const { endDate } = viewModal;

      const { viewType } = viewModal;

      const start = moment(getStartTime(startDate)).utc().format('YYYY-MM-DD HH:mm:ss');
      const end = moment(getEndTime(endDate)).utc().format('YYYY-MM-DD HH:mm:ss');

      const isAll = selectedFilter.filter((item) => item === 'All') && selectedFilter.filter((item) => item === 'All').length ? ['Missed', 'Upcoming', 'Completed', 'Started', 'Signed off', 'Reviewed', 'Inprogress', 'Canceled'] : selectedFilter;

      const customDatas = getColumnArrayByIdWithArray(customSelectedOptions, selectedField);

      setSelectedGroupFilters(customData);
      // setSelectedField('asset_id');

      if (userInfo && userInfo.data) {
        dispatch(getAuditGroups(companies, appModels.HXAUDIT, groupField, start, end, isAll, selectedField, customDatas));
      }
    }
  }, [enter]);

  useEffect(() => {
    const classData = document.getElementsByClassName('ant-row-flex-middle')[0].children[2];
    classData.classList.add('col-md-3');
  }, []);

  useEffect(() => {
    // let isMounted = true;
    // if (isMounted) {
    if (auditViewerInfo && auditViewerInfo.data) {
      const { endDate } = viewModal;
      viewModal.setResources(getResources(auditViewerInfo.data, groupField));
      viewModal.setEvents(getEventData(auditViewerInfo.data, userInfo, groupField));
      setCalendarData(Math.random());
    } else {
      viewModal.setResources(getResources([], groupField));
      viewModal.setEvents(getEventData([], userInfo, groupField));
      setCalendarData(Math.random());
    }
    // }
    // return () => { isMounted = false; };
  }, [auditViewerInfo]);

  /* useEffect(() => {
    const { startDate, endDate } = viewModal;
    if (moment(new Date(endDate)).format('YYYY-MM-DD') > moment(new Date()).format('YYYY-MM-DD') && viewHead === 'Week') {
      setNext(false);
    } else if (moment(new Date(startDate)).format('YYYY-MM-DD') < moment(new Date()).format('YYYY-MM-DD')) {
      setNext(true);
    } else {
      setNext(false);
    }
  }, [enter, viewModal]); */

  const prevClick = (sdata) => {
    const { startDate } = viewModal;
    // if (new Date(startDate) >= new Date(comDate)) {
    sdata.prev();
    setViewModal(sdata);
    setOffset(0);
    setPage(1);
    setAssetIds([]);
    setAssetLoad(Math.random());
    setPageGroupData([]);
    setPageGroupDetailData([]);
    setEnter(Math.random());
    // }
  };

  const checkAuditColor = (val) => {
    let res = 'white';
    const data = hxAuditStatusJson.filter((item) => item.status === val);
    if (data && data.length) {
      res = data[0].color;
    }
    return res;
  };

  const checkAuditBgColor = (val) => {
    let res = 'white';
    const data = hxAuditStatusJson.filter((item) => item.status === val);
    if (data && data.length) {
      res = data[0].backgroundColor;
    }
    return res;
  };

  const nextClick = (sdata) => {
    if (isNext) {
      sdata.next();
      setViewModal(sdata);
      setOffset(0);
      setPage(1);
      setAssetIds([]);
      setAssetLoad(Math.random());
      setPageGroupData([]);
      setPageGroupDetailData([]);
      setEnter(Math.random());
    }
  };

  const onViewChange = (sdata, view) => {
    sdata.setViewType(view.viewType, view.showAgenda, view.isEventPerspective);
    let head = 'Day';
    if (view.viewType === 0) {
      head = 'Day';
    }
    if (view.viewType === 1) {
      head = 'Week';
    }
    if (view.viewType === 5) {
      head = 'Month';
    }
    setViewHead(head);
    setViewModal(sdata);
    setOffset(0);
    setAssetIds([]);
    setAssetLoad(Math.random());
    setPageGroupData([]);
    setPageGroupDetailData([]);
    setPage(1);
    // setFilterApply(true);
    setEnter(Math.random());
  };

  const onSelectDate = (sdata, date) => {
    sdata.setDate(date);
    setViewModal(sdata);
    setOffset(0);
    setAssetIds([]);
    setAssetLoad(Math.random());
    setPageGroupData([]);
    setPageGroupDetailData([]);
    setPage(1);
    setEnter(Math.random());
  };

  const clickedEvent = (sdata, event) => {
    dispatch(getHxAuditDetails(event.dataId, appModels.HXAUDIT));
    setEventModal(true);
  };

  const toggleExpandFunc = (sdata, slotId) => {
    sdata.toggleExpandStatus(slotId);
    setViewModal(sdata);
  };

  const onSetAddMoreState = (newState) => {
    if (newState === undefined) {
      setHeaderItem(undefined);
      setLeftPop(0);
      setTopPop(0);
      setHeightPop(0);
    } else {
      setHeaderItem(newState.headerItem);
      setLeftPop(newState.left);
      setTopPop(newState.top);
      setHeightPop(newState.height);
    }
  };

  useEffect(() => {
    const tableClass = document.getElementById('RBS-Scheduler-root');
    const schedulerContent = document.getElementsByClassName('scheduler-view')[0].children[1];
    tableClass.setAttribute('class', 'scheduler pin-expand');
    schedulerContent.setAttribute('class', 'thin-scrollbar calendar-thin-scrollbar');
  }, []);

  const eventItemPopoverTemplateResolver = (data, eventItem, title, start, end, statusColor) => {
    const showData = [
      {
        property: 'Audit Type',
        value: eventItem.type,
      },
      {
        property: 'Status',
        value: eventItem.status,
      },
      {
        property: 'Audit System',
        value: eventItem.system,
      },
      {
        property: 'Site',
        value: eventItem.company,
      },
      {
        property: 'Audit Category',
        value: eventItem.category,
      },
      {
        property: 'Audit SPOC',
        value: eventItem.auditSpoc,
      },
      {
        property: 'Sequence',
        value: eventItem.sequence,
      },
      {
        property: 'Quarter',
        value: eventItem.quarter,
      },
      {
        property: 'Scope',
        value: eventItem.scope,
      },
      {
        property: 'Department',
        value: eventItem.department,
      },
    ];
    return (
      <div className="ant-popover-inner-content">
        <div style={{ width: '300px' }}>
          <div className="ant-row-flex ant-row-flex-middle">
            <div className="overflow-text">
              <Row>
                <Col sm="12" md="12" lg="12" className="mb-2">
                  <div style={{ display: 'inline-flex' }}>
                    <div className="status-dot mt-1" style={{ backgroundColor: checkAuditBgColor(eventItem.status) }} />
                    {eventItem.schedule && eventItem.schedule.length && eventItem.schedule.length > 40 && (
                      <Tooltip title={eventItem.schedule} placement="top">
                        <span className="header2-text ml-2 font-weight-600 font-family-tab">{truncate(eventItem.schedule, 60)}</span>
                      </Tooltip>
                    )}
                    {eventItem.schedule && eventItem.schedule.length && eventItem.schedule.length < 40 && (

                    <span className="header2-text ml-2 font-weight-600 font-family-tab">
                      {eventItem.schedule}
                    </span>

                    )}
                  </div>
                </Col>
                <Col sm="12" md="12" lg="12">
                  {/* <span className="help-text">{start.format('MMM DD')}</span>
                <span className="header2-text" style={{ marginLeft: '8px' }}>-</span>
                <span className="help-text" style={{ marginLeft: '8px' }}>{end.format('MMM DD')}</span> */}
                  <Typography
                    sx={{
                      width: '40%',
                      font: 'normal normal normal 12px Suisse Intl',
                      color: '#6A6A6A',
                    }}
                  >
                    {start.format('MMM DD')}
                    {' '}
                    -
                    {' '}
                    {end.format('MMM DD')}
                  </Typography>
                </Col>
                <Col sm="12" md="12" lg="12" className="mt-3">

                  {showData && showData.map((data) => (
                    <Box
                      sx={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        margin: '5px 0px 5px 0px',
                        minHeight: '30px',
                      }}
                    >
                      <Typography
                        sx={{
                          width: '40%',
                          font: 'normal normal normal 12px Suisse Intl',
                          color: '#6A6A6A',
                        }}
                      >
                        {data?.property}
                        {'  '}
                        -
                        {'  '}
                        <span className="font-weight-700">{data?.value}</span>
                      </Typography>
                      {/* <Typography
                        sx={{
                          width: "60%",
                          font: "normal normal normal 12px Suisse Intl",
                          color: "#000000",
                        }}
                      >
                        {data?.value}
                      </Typography> */}
                    </Box>
                  ))}
                </Col>
                {/* <Col sm="4" md="4" lg="4">
                  <span className="text-center ml-4">
                    <QRCode value={eventItem.type === 'Space' ? eventItem.space_number : eventItem.equipment_number} renderAs="svg" includeMargin level="H" size={120} />
                  </span>
                      </Col> */}
              </Row>
            </div>
          </div>
          <div />
        </div>
      </div>
    );
  };

  const handleCustomChangeInfo = (options) => {
    const lastOne = options[options.length - 1];
    const dropdownValues = ['Started', 'Upcoming', 'Completed', 'Missed', 'Signed off', 'Reviewed', 'Inprogress', 'Canceled'];
    const isAll = lastOne && lastOne.value === 'All';
    if (!isAll && options.length && dropdownValues.some((ai) => getColumnArrayById(options, 'value').includes(ai))) {
      const notAll = options && options.length && options.filter((obj) => obj.value !== 'All');
      setSelectedFilter(getColumnArrayById(notAll, 'label'));
      setStatusOptions(notAll);
    } else {
      setStatusOptions([{ value: 'All', label: 'All' }]);
      setSelectedFilter(['All']);
    }
  };

  function getDayName(datestr) {
    let res = '';
    if (datestr) {
      const strTxt = datestr.toString().split(' ');
      res = strTxt && strTxt.length ? truncateWord(strTxt[0], 3) : '';
    }
    return res;
  }

  function getDayNum(datestr, vtype) {
    let res = '';
    if (datestr && vtype === ViewTypes.Custom) {
      const strTxt = datestr.toString().split(' ');
      const strTxt1 = strTxt && strTxt.length && strTxt[1] ? strTxt[1].toString().split('/') : '';
      const compForm = getDatePickerFormat(userInfo, 'date');
      const dateIndex = compForm ? compForm.toString().split('/') : '';
      const dateInd = dateIndex ? dateIndex.indexOf('DD') : 0;
      res = strTxt1 && strTxt1.length ? strTxt1[dateInd] : '';
    }
    return res;
  }

  const nonAgendaCellHeaderTemplateResolver = (sdata, item, formattedDateItems, style) => {
    const datetime = sdata.localeMoment(item.time);
    let isCurrentDate = false;

    if (sdata.viewType === ViewTypes.Day) {
      isCurrentDate = datetime.isSame(new Date(), 'hour');
    } else {
      isCurrentDate = datetime.isSame(new Date(), 'day');
    }

    // if (isCurrentDate) {
    //   style.backgroundColor = '#f3f9fc';
    //   style.color = '#3a4354';
    // }
    style.color = '#fff';
    // const dateFormat = getHeaderDateFormat(userInfo, 'date').toString().split(' ')[1].split('/');
    // const dateFormatIndex = dateFormat.indexOf('DD');

    return (
      <th key={item.time} className="header3-text" style={AddThemeBackgroundColor(style)}>
        {
          formattedDateItems.map((formattedItem, index) => (
            sdata.viewType === ViewTypes.Custom
              ? (
                <div
                  key={`${index}${item.time}`}
                  className="font-12"
                  // dangerouslySetInnerHTML={{ __html: formattedItem.replace(formattedItem, formattedItem.split(' ')[1].split('/')[dateFormatIndex]) }}
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize((`${getDayName(formattedItem)} ${getDayNum(formattedItem, sdata.viewType)}`.replace(' ', '<br>')), { USE_PROFILES: { html: true } }) }}
                />
              )
              : (
                <div
                  key={index}
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(formattedItem.replace(/[0-9]/g, '<b>$&</b>'), { USE_PROFILES: { html: true } }) }}
                />
              )
          ))
        }
      </th>
    );
  };

  function getFilterName(val) {
    let res = '';
    const data = customData && customData.groupFilters ? customData.groupFilters : [];
    const newData = data.filter((item) => item.value === val);
    if (newData && newData.length) {
      res = newData[0].label;
    }
    if (val === 'company_id') {
      res = 'Site';
    }
    return res;
  }

  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsetValue = (index - 1) * limit;
    setOffset(offsetValue);
    setPage(index);

    const pageData = pageGroupData;
    setAssetIds(pageData.slice(offsetValue, (offsetValue + limit)));
    setAssetLoad(Math.random());
  };

  const currentGroupData = groupData;

  useEffect(() => {
    setStatusOptions(customFilters.statusOptions ? customFilters.statusOptions : []);
    setCustomOptions(customFilters.customOptions ? customFilters.customOptions : '');
    setCustomSelectedOptions(customFilters.customSelectedOptions ? customFilters.customSelectedOptions : []);
    setTypeOptions(customFilters.typeOptions ? customFilters.typeOptions : '');
    setEnforceOptions(customFilters.enforceOptions ? customFilters.enforceOptions : '');
  }, [customFilters]);

  const onCloseFilters = () => {
    setFilterOpen(false);
    setStatusOptions([]);
    setCustomOptions([]);
    setCustomSelectedOptions([]);
    handleResetClick();
  };

  const onCloseFilters1 = () => {
    setFilterOpen(false);
    setStatusOptions(customFilters.statusOptions);
    setCustomOptions(customFilters.customOptions);
    setCustomSelectedOptions(customFilters.customSelectedOptions);
  };

  const onApplyFilters = () => {
    setFilterOpen(false);

    setOffset(0);
    setPage(1);
    setAssetIds([]);
    setAssetLoad(Math.random());
    setPageGroupData([]);
    setPageGroupDetailData([]);
    setFilterApply(Math.random());
    setFilter(true);
    setStatusFilter(false);
    setGroupFilter(false);

    console.log(statusOptions);

    const obj = {
      statusOptions,
      customOptions,
      customSelectedOptions,
      typeOptions,
      enforceOptions,
    };
    setCustomFilters(obj);
  };

  const handleStatusChange = (value, label) => {
    if (label !== activeStatus) {
      setActiveStatus(label);
      const normalizedLabel = label === 'In Progress' ? 'Inprogress' : label === 'Cancelled' ? 'Canceled' : label;
      const newOptions = [{ value, label: normalizedLabel }];

      setSelectedFilter([normalizedLabel]);
      setStatusOptions(newOptions);

      setFilterOpen(false);

      setOffset(0);
      setPage(1);
      setAssetIds([]);
      setAssetLoad(Math.random());
      setPageGroupData([]);
      setPageGroupDetailData([]);
      setFilterApply(Math.random());
      setFilter(true);
      setStatusFilter(false);
      setGroupFilter(false);

      const obj = {
        statusOptions: newOptions,
        customOptions,
        customSelectedOptions,
        typeOptions,
        enforceOptions,
      };
      setCustomFilters(obj);
    } else {
      setActiveStatus(false);
      setOffset(0);
      setPage(1);
      setFilterOpen(false);
      setSelectedFilter(['All']);
      setStatusFilter(false);
      setGroupFilter(false);
      setAssetIds([]);
      setAssetLoad(Math.random());
      setPageGroupData([]);
      setPageGroupDetailData([]);
      const obj = {
        statusOptions: [{ value: 'All', label: 'All' }],
        customOptions: '',
        customSelectedOptions: [],
        typeOptions: '',
        enforceOptions: '',
      };
      setCustomFilters(obj);
      setFilterApply(true);
      setFilter(false);
    }
  };

  const filtersComponentsArray = [
    {
      title: 'By Status',
      component:
  <Autocomplete
    multiple
    filterSelectedOptions
    name="Status"
    label="Status"
    formGroupClassName="m-1"
    open={statusOpen}
    size="small"
    onOpen={() => {
      setStatusOpen(true);
    }}
    onClose={() => {
      setStatusOpen(false);
    }}
    value={statusOptions}
    onChange={(e, options) => { setStatusOptions(options); handleCustomChangeInfo(options, e); }}
    getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
    options={customData && customData.viewerFilters ? customData.viewerFilters : []}
    renderInput={(params) => (
      <TextField
        {...params}
        variant="outlined"
        className="without-padding"
        placeholder="Search and Select"
        InputProps={{
          ...params.InputProps,
          endAdornment: (
            <>
              {params.InputProps.endAdornment}
            </>
          ),
        }}
      />
    )}
  />,
    },
    {
      title: isParent && isShowAll ? 'By System / Category / Department / SPOC / Site' : 'By System / Category / Department / SPOC',
      component:
  <Autocomplete
    name="Custom"
    label="Custom"
    formGroupClassName="m-1"
    open={customOpen}
    size="small"
    onOpen={() => {
      setCustomOpen(true);
    }}
    onClose={() => {
      setCustomOpen(false);
    }}
    value={customOptions}
    disableClearable={!customOptions}
    onChange={(e, options) => { dispatch(resetCustomGroup([])); setCustomOptions(options); setCustomSelectedOptions([]); setSelectedField(options ? options.value : false); }}
    getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
    options={customData && customData.groupFilters ? (isParent && isShowAll ? customData.groupFilters.concat({ value: 'company_id', label: 'Site' }) : customData.groupFilters) : []}
    renderInput={(params) => (
      <TextField
        {...params}
        variant="outlined"
        className="without-padding"
        placeholder="Search and Select"
        InputProps={{
          ...params.InputProps,
          endAdornment: (
            <>
              {params.InputProps.endAdornment}
            </>
          ),
        }}
      />
    )}
  />,
    },
    {
      title: selectedField ? `By ${getFilterName(selectedField)}` : false,
      component:
  <Autocomplete
    multiple
    filterSelectedOptions
    name="CustomSelected"
    label="CustomSelected"
    formGroupClassName="m-1"
    open={customSelectedOpen}
    size="small"
    onOpen={() => {
      setCustomSelectedOpen(true);
    }}
    onClose={() => {
      setCustomSelectedOpen(false);
    }}
    loading={customDataGroup && customDataGroup.loading}
    value={customSelectedOptions}
    onChange={(e, options) => setCustomSelectedOptions(options)}
    getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
    options={currentGroupData}
    renderInput={(params) => (
      <TextField
        {...params}
        variant="outlined"
        className="without-padding"
        placeholder={customSelectedOptions && customSelectedOptions.length && customSelectedOptions.length > 0 ? '' : 'Search and Select'}
        InputProps={{
          ...params.InputProps,
          endAdornment: (
            <>
              {(customDataGroup && customDataGroup.loading) ? <CircularProgress color="inherit" size={20} /> : null}
              {params.InputProps.endAdornment}
            </>
          ),
        }}
      />
    )}
  />,

    },
  ];

  const resetForm = () => {
    if (document.getElementById('hxAuditform')) {
      document.getElementById('hxAuditform').reset();
    }
    dispatch(resetCreateHxAudit());
    dispatch(resetUpdateHxAudit());
    showAddModal(false);
    setSystemData('');
  };

  const resetAdd = () => {
    dispatch(resetCreateHxAudit());
    dispatch(resetUpdateHxAudit());
  };

  const onCreateModal = () => {
    dispatch(resetCreateHxAudit());
    dispatch(resetUpdateHxAudit());
    setSystemData(false);
    showAddModal(true);
  };

  const onCreateModalSystem = () => {
    dispatch(resetCreateHxAudit());
    dispatch(resetUpdateHxAudit());
    showAddModal(true);
  };

  const handleResetClick = () => {
    setOffset(0);
    setPage(1);
    setFilterOpen(false);
    setSelectedFilter(['All']);
    setStatusFilter(false);
    setGroupFilter(false);
    setAssetIds([]);
    setAssetLoad(Math.random());
    setPageGroupData([]);
    setPageGroupDetailData([]);
    const obj = {
      statusOptions: [{ value: 'All', label: 'All' }],
      customOptions: '',
      customSelectedOptions: [],
      typeOptions: '',
      enforceOptions: '',
    };
    setCustomFilters(obj);
    setFilterApply(true);
    setFilter(false);
  };

  const resetToCurrent = () => {
    const currentMoment = moment(); // Get the current date

    // Create a new instance of SchedulerData to ensure methods are available
    const sdata = new SchedulerData(
      currentMoment.format(DATE_FORMAT),
      ViewTypes.Custom, // Use the current view type
      viewModal.showAgenda, // Preserve the agenda view setting
      viewModal.isEventPerspective, // Preserve event perspective setting
      viewModal.config, // Retain the existing configuration
      viewModal.behaviors, // Retain the behaviors
    );

    sdata.setDate(currentMoment.format(DATE_FORMAT));
    sdata.setViewType(ViewTypes.Custom, false, false);
    setViewModal(sdata); // Update the state
  };

  const groupOptions = [{ value: 'audit_system_id', label: 'Audit System' }, { value: 'department_id', label: 'Department' }];

  const isExportDisabled = (auditViewerInfo && auditViewerInfo.data && auditViewerInfo.data.length === 0) || (auditViewerInfo && auditViewerInfo.data === null);

  const rightCustomHeader = (
    <>
      <span />
      <p className="font-family-tab mb-0">Group By</p>
      <Autocomplete
        name="Group"
        label="Group By"
        className="width-150px header-filter-select"
        open={groupOpen}
        size="small"
        disableClearable
        onOpen={() => {
          setGroupOpen(true);
        }}
        onClose={() => {
          setGroupOpen(false);
        }}
        value={groupFieldOptions}
        classes={{
          option: classes.option,
        }}
        onChange={(e, options) => { setGroupFieldOptions(options); setGroupField(options ? options.value : false); }}
        getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
        options={groupOptions}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            className="without-padding"
            placeholder="Select"
            InputProps={{
              ...params.InputProps,
              classes: { input: classes.input },
              endAdornment: (
                <>
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
      <MuiTooltip title="Reload">
        <IconButton className="header-link-btn-no-space" color="primary" onClick={() => { resetToCurrent(); handleResetClick(); setReload(Math.random()); }}>
          {' '}
          <RxReload size={19} color={AddThemeColor({}).color} />
          {' '}
        </IconButton>
      </MuiTooltip>
      <IconButton
        className="header-filter-btn-no-space col-md-1"
        onClick={() => setFilterOpen(true)}
        color="primary"
      >
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <FilterAltOutlinedIcon
            size={15}
            style={{ color: AddThemeColor({}).color, marginRight: '3px' }}
          />
          {isFilter && (
          <FiberManualRecordIcon
            size={10}
            className="text-info"
            style={{
              fontSize: '15px',
              position: 'absolute',
              top: '-4px',
              right: '42px',
            }}
          />
          )}
          <span className="my-1 ml-1" style={{ color: AddThemeColor({}).color }}>
            Filters
          </span>

        </div>
      </IconButton>

      <IconButton className="header-filter-btn-no-space col-md-1" color="primary" disabled={isExportDisabled} onClick={() => setShowExport(true)}>
        <CgExport size={20} className="mb-1" color={AddThemeColor({}).color} />
        <span className="my-1 ml-1" style={{ color: AddThemeColor({}).color }}> Export </span>
      </IconButton>

      {isCreatable && (
      <Button
        onClick={() => onCreateModal()}
        type="button"
        variant="contained"
        className="header-create-btn-no-space text-white"
      >
        Schedule an Audit
      </Button>
      )}

    </>
  );

  const eventItemTemplateResolver = (sdata, event, bgColor, isStart, isEnd, mustAddCssClass, mustBeHeight, agendaMaxEventWidth) => {
    const roundCls = 'round-all';
    const backgroundColor = checkAuditBgColor(event.status);
    const image = '';
    let margin = '';

    if (sdata.viewType === ViewTypes.Custom) {
      margin = '';
    } else {
      margin = 'ml-2';
    }
    const titleText = sdata.behaviors.getEventTextFunc(sdata, event);

    let divStyle = {
      backgroundColor,
      color: checkAuditColor(event.status),
      height: mustBeHeight,
      paddingLeft: '4px',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
    };
    let divStyle1 = { backgroundColor, color: checkAuditColor(event.status), height: mustBeHeight };
    if (agendaMaxEventWidth) divStyle = { ...divStyle, maxWidth: agendaMaxEventWidth };
    if (agendaMaxEventWidth) divStyle1 = { ...divStyle1, maxWidth: agendaMaxEventWidth };
    let events = '';

    if (sdata.viewType === ViewTypes.Custom) {
      events = (
        <div key={event.id} className={roundCls} style={divStyle}>
          <span className="font-11 ml-1 font-weight-700 font-family-tab" style={{ lineHeight: `${mustBeHeight}px` }}>
            {event.schedule}
          </span>
        </div>
      );
      /** For Month removed more text(+2more) */
      const d = document.querySelectorAll('a.timeline-event > div:not([class])');
      const searchValue = 'more';
      for (let i = 0; i < d.length; i += 1) {
        if (d[i].innerHTML.indexOf(searchValue) > -1) {
          d[i].innerHTML = d[i].innerHTML.replace('more', '');
        }
      }
    } else {
      events = (
        <div key={event.id} className={`${roundCls} color-${event.status} event-item`} style={divStyle1}>
          <span className="font-11 ml-1" style={{ lineHeight: `${mustBeHeight}px` }}>
            {event.schedule}
          </span>
        </div>
      );
    }

    return events;
  };

  const onViewReset = () => {
    setViewId(false);
    setViewModel(false);
    setEventModal(false);
  };

  const isUserError = userInfo && userInfo.err;
  const loading = (userInfo && userInfo.loading)
    || (auditViewerInfo && auditViewerInfo.loading)
    || (auditGroups && auditGroups.loading);
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (auditViewerInfo && auditViewerInfo.err) ? generateErrorMessage(auditViewerInfo) : userErrorMsg;
  let popover = <div />;
  if (headerItem) {
    popover = (
      <AddMorePopover
        headerItem={headerItem}
        eventItemClick={clickedEvent}
        closeAction={onSetAddMoreState}
        left={(leftPop - 500)}
        schedulerData={viewModal}
        eventItemPopoverTemplateResolver={eventItemPopoverTemplateResolver}
        top={topPop - 200}
        height={heightPop}
      />
    );
  }

  // Function to handle new event creation
  const newEvent = (schedulerData, slotId, slotName, start, end) => {
    const data = {
      systemName: slotName, systemId: slotId, plannedIn: start, plannedOut: end, type: groupField,
    };
    setSystemData(data);
    onCreateModalSystem();
  };

  return (
    <Card className="">
      <div className="cschedule">
        <Scheduler
          className=""
          schedulerData={viewModal}
          prevClick={prevClick}
          nextClick={nextClick}
          onSelectDate={onSelectDate}
          onViewChange={onViewChange}
          eventItemClick={clickedEvent}
          toggleExpandFunc={toggleExpandFunc}
          nonAgendaCellHeaderTemplateResolver={nonAgendaCellHeaderTemplateResolver}
          eventItemTemplateResolver={eventItemTemplateResolver}
          eventItemPopoverTemplateResolver={eventItemPopoverTemplateResolver}
          onSetAddMoreState={onSetAddMoreState}
          newEvent={newEvent} // Handle new event creation
          rightCustomHeader={rightCustomHeader}
        />
        {popover}

        {loading && (
          <div className="loader" data-testid="loading-case">
            <Loader />
          </div>
        )}

        {((auditViewerInfo && auditViewerInfo.err) || isUserError) && (
          <ErrorContent errorTxt={errorMsg} />
        )}
        {(auditViewerInfo && auditViewerInfo.data && auditViewerInfo.data.length === 0 && !auditViewerInfo.err && !loading) && (
          <ErrorContent errorTxt="" />
        )}

      </div>
      {loading || pages === 0 ? (<span />) : (
        <div className="margin-center p-2">
          <Pagination count={pages} page={page} size="small" onChange={handlePageClick} showFirstButton showLastButton />
        </div>
      )}
      {!loading && (
      <div className="p-2 display-flex content-center margin-auto mt-2">
        {hxAuditStatusJson.map((data) => (
          <div
            aria-hidden
            style={activeStatus !== data.text && activeStatus ? { opacity: '0.4' } : {}}
            className="display-flex content-center cursor-pointer"
            onClick={() => handleStatusChange(data.status, data.text)}
          >
            <div className="status-dot mr-1" style={{ backgroundColor: data.backgroundColor }} />
            <small className="text-missed-inspection mr-3 font-family-tab font-weight-600">{data.text}</small>
          </div>
        ))}

      </div>
      )}
      <Drawer anchor="right" open={filterOpen} PaperProps={{ sx: { width: '30%' } }}>
        <ReportsFilterDrawer
          filtersComponentsArray={filtersComponentsArray}
          onApplyFilters={onApplyFilters}
          onCloseFilters={onCloseFilters}
          onCloseFilters1={onCloseFilters1}
          isDisabled={(!(customSelectedOptions && customSelectedOptions.length > 0) && selectedField)}
          isReset
        />
      </Drawer>
      <Drawer
        PaperProps={{
          sx: { width: '50%' },
        }}
        anchor="right"
        open={addModal}
      >
        <DrawerHeader
          headerName="Schedule an Audit"
          imagePath={auditBlue}
          onClose={() => resetForm()}
        />
        <AddAudit
          editId={false}
          closeModal={() => resetForm()}
          afterReset={() => resetAdd()}
          isShow={addModal}
          systemData={systemData}
          addModal
          setViewId={setViewId}
          setViewModal={setViewModel}
        />
      </Drawer>
      <Drawer
        PaperProps={{
          sx: { width: '85%' },
        }}
        anchor="right"
        open={eventModal}
      >
        <DrawerHeader
          headerName={hxAuditDetailsInfo && (hxAuditDetailsInfo.data && hxAuditDetailsInfo.data.length > 0)
            ? `${'Audit'}${' - '}${hxAuditDetailsInfo.data[0].name}` : 'Audit'}
          imagePath={auditBlue}
          onClose={() => onViewReset()}

        />
        <AuditDetails offset={offset} />
      </Drawer>
      <DataExport
        afterReset={() => dispatch(setInitialValues(false, false, false, false))}
        fields={[]}
        selectedFilter={selectedFilter}
        selectedField={selectedField}
        viewModal={viewModal}
        groupFilters={groupFilters}
        customDataGroup={groupData}
        assetIds={assetIds}
        customSelectedOptions={customSelectedOptions}
        exportType={exportType}
        exportTrue={exportTrue}
        totalLen={totalLen}
        groupField={groupField}
        viewHead={viewHead}
        showExport={showExport}
      />
      <ExportDrawer
        showExport={showExport}
        setShowExport={setShowExport}
        setExportTrue={setExportTrue}
        setExportType={setExportType}
        loading={auditViewerExportInfo && auditViewerExportInfo.loading}
      />
    </Card>
  );
};
CalendarSchedule.propTypes = {
  userInfo: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
};

export default withDragDropContext(CalendarSchedule);
