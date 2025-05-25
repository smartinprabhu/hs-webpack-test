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
import {
  Autocomplete, Box, Button, CircularProgress, Drawer, IconButton, TextField, Typography,
} from '@mui/material';
import MuiTooltip from '@shared/muiTooltip';
import DOMPurify from 'dompurify';
import { Tooltip } from 'antd';
import Alert from '@mui/material/Alert';
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
import { FaInfoCircle } from 'react-icons/fa';
import { RxReload } from 'react-icons/rx';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  Col,
  Popover,
  CardBody,
  PopoverBody, Row,
} from 'reactstrap';

import alertIcon from '@images/icons/alert.svg';
import completed from '@images/icons/completed.svg';
import incidentManagementWhite from '@images/icons/incidentManagementWhite.svg';
import upcoming from '@images/icons/upcoming.svg';
import upcomingBlack from '@images/icons/upcomingBlack.svg';
import inProgress from '@images/inspection/missed.svg';
import cancelled from '@images/inspection/cancelled.svg';
import InspectionIcon from '@images/sideNavImages/inspection_black.svg';

import {
  faChevronLeft,
  faChevronRight,
  faInfoCircle,
  faEye,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';
import DrawerHeader from '../../commonComponents/drawerHeader';
import ReportsFilterDrawer from '../../commonComponents/reportsFilterDrawer';
import ExportDrawer from '../../commonComponents/exportDrawer';

import { getLastUpdate } from '../../preventiveMaintenance/ppmService';
import {
  getCustomDate, getDateLabelFunc, getHeaderDateFormat,
  isNonWorkingTime,
} from '../../preventiveMaintenance/utils/utils';
import withDragDropContext from '../../preventiveMaintenance/withDnDContext';
import { setInitialValues } from '../../purchase/purchaseService';
import { AddThemeBackgroundColor, AddThemeColor, ReturnThemeColor } from '../../themes/theme';
import {
  generateErrorMessage,
  getAllowedCompanies,
  getColumnArrayById,
  getCompanyTimezoneDate,
  getDatePickerFormat,
  getDifferenceBetweenInDays,
  getPagesCountV2,
  getTotalFromArray,
  truncate, truncateWord, extractNameObject,
} from '../../util/appUtils';
import customData from '../data/customData.json';
import {
  getCustomGroup,
  getDashboardFilters,
  getInspectionCommenceDate,
  getInspectionDetail,
  getInspectionViewerGroups,
  getPageSpaceGroups,
  resetCustomGroup,
  resetInspectionViewer,
  getInspectionSchedulertDetail,
} from '../inspectionService';
import {
  getEventData,
  getResources,
} from '../utils/utils';
import './calendarStyle.scss';
import DataExport from './dataExport/dataExport';
import EventDetails from './viewInspection';
import SchedulerDetail from '../inspectionDetails/inspectionDetails';

const appModels = require('../../util/appModels').default;

const CalendarSchedule = ({ userInfo, assetName, uuid }) => {
  const dispatch = useDispatch();
  moment.locale('en', { week: { dow: 1, doy: 7 } });
  const schedulerData = new SchedulerData(
    moment().format(DATE_FORMAT),
    ViewTypes.Day,
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
      dayMaxEvents: 2,
      weekMaxEvents: 4,
      monthMaxEvents: 4,
      quarterMaxEvents: 4,
      yearMaxEvents: 4,
      customCellWidth: 42,
      nonWorkingTimeHeadBgColor: '#fff',
      nonWorkingTimeBodyBgColor: '#fff',
      nonAgendaOtherCellHeaderFormat: getHeaderDateFormat(userInfo, 'date'),
      minuteStep: 60,
      addMorePopoverHeaderFormat: getHeaderDateFormat(userInfo, 'date'),
      scrollToSpecialMomentEnabled: false,
      views: [
        {
          viewName: 'Day', viewType: ViewTypes.Day, showAgenda: false, isEventPerspective: false,
        },
        {
          viewName: 'Week', viewType: ViewTypes.Week, showAgenda: false, isEventPerspective: false,
        },
        {
          viewName: 'Month', viewType: ViewTypes.Custom, showAgenda: false, isEventPerspective: false,
        },
      ],
    },
    { getCustomDateFunc: getCustomDate, isNonWorkingTimeFunc: isNonWorkingTime },
  );
  schedulerData.setLocaleMoment(moment);
  const [viewModal, setViewModal] = useState(schedulerData);
  const [parentSchedule, setParentScheduleViewModal] = useState(false);
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

  const [groupFilters, setSelectedGroupFilters] = useState([]);

  const [isFilterApply, setFilterApply] = useState(true);
  const [isStatusFilter, setStatusFilter] = useState(false);
  const [isGroupFilter, setGroupFilter] = useState(false);
  const [assetLoad, setAssetLoad] = useState(false);
  const [isNext, setNext] = useState(false);

  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);

  const [assetIds, setAssetIds] = useState([]);

  const [pageGroupData, setPageGroupData] = useState([]);
  const [pageGroupDetailData, setPageGroupDetailData] = useState([]);

  const [totalLen, setTotalLen] = useState(0);
  const [enforceField, setEnforceField] = useState(null);
  const [inspectionGroup, setInspectionGroup] = useState(null);

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
  const [parentScheduleId, setParentScheduleId] = useState(false);

  const [customFilters, setCustomFilters] = useState({
    statusOptions,
    customOptions,
    customSelectedOptions,
    typeOptions,
    enforceOptions,
  });

  const companies = getAllowedCompanies(userInfo);

  const {
    inspectionGroupInfo,
    customDataGroup,
    inspectionCommenceInfo,
    inspectionDashboardFilters,
    inspectionSpacePageGroups,
    inspectionChecklistExport,
    inspectionChecklistCountLoading,
    inspectionPageGroups,
    inspectionSchedulerDetail,
  } = useSelector((state) => state.inspection);

  const states = ['Missed', 'Upcoming', 'Completed', 'Abnormal', 'Cancelled'];

  const { inspectionTeamsDashboard, warehouseLastUpdate } = useSelector((state) => state.ppm);

  const lastUpdateTime = warehouseLastUpdate && warehouseLastUpdate.data && warehouseLastUpdate.data.length && warehouseLastUpdate.data[0].last_updated_at ? warehouseLastUpdate.data[0].last_updated_at : false;

  const exportLoading = (inspectionChecklistExport && inspectionChecklistExport.loading) || (inspectionChecklistCountLoading);

  const { filterInitailValues } = useSelector((state) => state.purchase);

  useEffect(() => {
    if (parentScheduleId) {
      dispatch(getInspectionSchedulertDetail(parentScheduleId, appModels.INSPECTIONCHECKLIST, 'warehouse'));
    }
  }, [parentScheduleId]);

  // const totalLen1 = getTotalFromArray(inspectionSpacePageGroups && inspectionSpacePageGroups.data ? inspectionSpacePageGroups.data : [], 'space_id_count');

  // const totalLen2 = getTotalFromArray(inspectionPageGroups && inspectionPageGroups.data ? inspectionPageGroups.data : [], 'equipment_id_count');

  useMemo(() => {
    const totalLen1 = getTotalFromArray(inspectionSpacePageGroups && inspectionSpacePageGroups.data ? inspectionSpacePageGroups.data : [], 'asset_id_count');

    // const totalLen2 = getTotalFromArray(inspectionPageGroups && inspectionPageGroups.data ? inspectionPageGroups.data : [], 'equipment_id_count');
    setTotalLen(totalLen1);
  }, [JSON.stringify(inspectionSpacePageGroups)]);

  const totalDataCount1 = inspectionSpacePageGroups && inspectionSpacePageGroups.data ? inspectionSpacePageGroups.data.length : 0;
  // const totalDataCount2 = inspectionPageGroups && inspectionPageGroups.data ? inspectionPageGroups.data.length : 0;

  const totalDataCount = totalDataCount1;

  // const totalLen = (totalLen1 + totalLen2);

  const limit = 5;

  const pages = totalLen && inspectionGroupInfo && inspectionGroupInfo.data ? getPagesCountV2(totalDataCount, limit) : 0;

  const teamsList = getColumnArrayById(inspectionTeamsDashboard && inspectionTeamsDashboard.data ? inspectionTeamsDashboard.data : [], 'id');

  useEffect(() => {
    if (userInfo && userInfo.data && userInfo.data.company && userInfo.data.company.id) {
      dispatch(getInspectionCommenceDate(userInfo.data.company.id, appModels.INSPECTIONCONFIG));
    }
    dispatch(resetInspectionViewer());
    dispatch(getLastUpdate(appModels.INSPECTIONCHECKLISTLOGS));
  }, []);

  useEffect(() => {
    if (reload) {
      dispatch(getLastUpdate(appModels.INSPECTIONCHECKLISTLOGS));
    }
  }, [reload]);

  useEffect(() => {
    if (userInfo && userInfo.data && inspectionDashboardFilters && inspectionDashboardFilters.data && inspectionDashboardFilters.data.length) {
      setCustomFilters(inspectionDashboardFilters.data[0]);
      setSelectedFilter(inspectionDashboardFilters.data[0].status);
      if (inspectionDashboardFilters.data[0].teams && inspectionDashboardFilters.data[0].teams.length) {
        setGroupData([{ value: inspectionDashboardFilters.data[0].teams[0], label: inspectionDashboardFilters.data[0].teamName }]);
        setSelectedGroupFilters(inspectionDashboardFilters.data[0].teams);
        setSelectedField('maintenance_team_id');
      }

      const dateDiff = getDifferenceBetweenInDays(inspectionDashboardFilters.data[0].selectDate[0], inspectionDashboardFilters.data[0].selectDate[1]);
      const sdata = viewModal;
      if (inspectionDashboardFilters.data[0].selectDate && inspectionDashboardFilters.data[0].selectDate.length) {
        if (dateDiff >= 1) {
          sdata.setViewType(5, false, false);
          const today = new Date();
          const cmonth = today.getMonth() + 1;

          const givenDate = new Date(inspectionDashboardFilters.data[0].selectDate[0]);
          const givenMonth = givenDate.getMonth() + 1;

          if (cmonth > givenMonth) {
            sdata.prev();
          } else if (cmonth < givenMonth) {
            sdata.next();
          }
          sdata.startDate = inspectionDashboardFilters.data[0].selectDate[0];
          sdata.endDate = inspectionDashboardFilters.data[0].selectDate[1];
          sdata.setDate(moment(inspectionDashboardFilters.data[0].selectDate[0]));
          setViewHead('Month');
          setViewModal(sdata);
        } else {
          sdata.setDate(moment(inspectionDashboardFilters.data[0].selectDate[0]));
          setViewModal(sdata);
        }
      }

      if (dateDiff >= 1) {
        const start = inspectionDashboardFilters.data[0].selectDate[0];
        const end = inspectionDashboardFilters.data[0].selectDate[1];
        const isAll = inspectionDashboardFilters.data[0].status;
        dispatch(resetInspectionViewer());
        // dispatch(getPageGroups(companies, appModels.INSPECTIONCHECKLISTLOGS, start, end, isAll, inspectionDashboardFilters.data[0].teams && inspectionDashboardFilters.data[0].teams.length ? 'maintenance_team_id' : '', inspectionDashboardFilters.data[0].teams, teamsList, enforceField, inspectionGroup));
        dispatch(getPageSpaceGroups(companies, appModels.INSPECTIONCHECKLISTLOGS, start, end, isAll, inspectionDashboardFilters.data[0].teams && inspectionDashboardFilters.data[0].teams.length ? 'maintenance_team_id' : '', inspectionDashboardFilters.data[0].teams, teamsList, enforceField, inspectionGroup));
      } else {
        const { startDate } = viewModal;
        const { endDate } = viewModal;

        const start = moment(startDate).format('YYYY-MM-DD');
        const end = moment(endDate).format('YYYY-MM-DD');

        const isAll = inspectionDashboardFilters.data[0].status;
        dispatch(resetInspectionViewer());
        // dispatch(getPageGroups(companies, appModels.INSPECTIONCHECKLISTLOGS, start, end, isAll, inspectionDashboardFilters.data[0].teams && inspectionDashboardFilters.data[0].teams.length ? 'maintenance_team_id' : '', inspectionDashboardFilters.data[0].teams, teamsList, enforceField, inspectionGroup));
        dispatch(getPageSpaceGroups(companies, appModels.INSPECTIONCHECKLISTLOGS, start, end, isAll, inspectionDashboardFilters.data[0].teams && inspectionDashboardFilters.data[0].teams.length ? 'maintenance_team_id' : '', inspectionDashboardFilters.data[0].teams, teamsList, enforceField, inspectionGroup));
      }
      // dispatch(getInspectionViewerGroups(companies, appModels.INSPECTIONCHECKLISTLOGS, start, end, isAll, sField, sFilters, assetIds, totalLen));
    }
  }, [inspectionDashboardFilters]);

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
      d-inline-block width-160 float-right resourceHeading" title="${resources[i].reference}">${resources[i].reference}</span>
      <br /><k class="resourceSchedule"><span class="ml-2"><small><b>${(resources[i].type)}</b></small></span></k>`;
        }
      }
      return () => { isMounted = false; };
    }
  }, [viewModal]);

  useEffect(() => {
    if (!assetName && userInfo && userInfo.data && inspectionDashboardFilters && !inspectionDashboardFilters.data) {
      const { startDate } = viewModal;
      const { endDate } = viewModal;

      const start = moment(startDate).format('YYYY-MM-DD');
      const end = moment(endDate).format('YYYY-MM-DD');
      dispatch(resetInspectionViewer());
      const customData = selectedField === 'maintenance_team_id' ? getColumnArrayById(getColumnArrayById(customSelectedOptions, 'maintenance_team_id'), 'id') : getColumnArrayById(customSelectedOptions, 'asset_name');
      setSelectedGroupFilters(customData);
      const enforceData = enforceOptions ? enforceOptions.value : false;
      const inspectionTypeData = typeOptions ? typeOptions.value : false;
      // let statusData = statusOptions && statusOptions.length ? getColumnArrayById(statusOptions, 'label') : ['Missed', 'Upcoming', 'Completed', 'Abnormal']
      const isAll = selectedFilter.filter((item) => item === 'All') && selectedFilter.filter((item) => item === 'All').length ? states : selectedFilter;
      // dispatch(getPageGroups(companies, appModels.INSPECTIONCHECKLISTLOGS, start, end, isAll, selectedField, groupFilters, teamsList, enforceField, inspectionGroup));
      dispatch(getPageSpaceGroups(companies, appModels.INSPECTIONCHECKLISTLOGS, start, end, isAll, selectedField, customData, teamsList, enforceData, inspectionTypeData));
    }
  }, [isFilterApply, reload]);

  useEffect(() => {
    if (assetName && userInfo && userInfo.data && inspectionDashboardFilters && !inspectionDashboardFilters.data) {
      const { startDate } = viewModal;
      const { endDate } = viewModal;

      const start = moment(startDate).format('YYYY-MM-DD');
      const end = moment(endDate).format('YYYY-MM-DD');
      dispatch(resetInspectionViewer());
      // const customData = selectedField === 'maintenance_team_id' ? getColumnArrayById(getColumnArrayById(customSelectedOptions, 'maintenance_team_id'), 'id') : getColumnArrayById(customSelectedOptions, 'asset_name');
      setSelectedGroupFilters([assetName]);
      const enforceData = enforceOptions ? enforceOptions.value : false;
      const inspectionTypeData = typeOptions ? typeOptions.value : false;
      setSelectedField('asset_id');
      // let statusData = statusOptions && statusOptions.length ? getColumnArrayById(statusOptions, 'label') : ['Missed', 'Upcoming', 'Completed', 'Abnormal']
      const isAll = selectedFilter.filter((item) => item === 'All') && selectedFilter.filter((item) => item === 'All').length ? states : selectedFilter;
      // dispatch(getPageGroups(companies, appModels.INSPECTIONCHECKLISTLOGS, start, end, isAll, selectedField, groupFilters, teamsList, enforceField, inspectionGroup));
      dispatch(getPageSpaceGroups(companies, appModels.INSPECTIONCHECKLISTLOGS, start, end, isAll, 'asset_id', [assetName], teamsList, enforceData, inspectionTypeData));
    }
  }, [assetName]);

  useMemo(() => {
    if (userInfo && userInfo.data
      && ((inspectionSpacePageGroups && inspectionSpacePageGroups.data && !inspectionSpacePageGroups.loading)
        || (inspectionSpacePageGroups && inspectionSpacePageGroups.data && !inspectionSpacePageGroups.loading)) && totalLen && assetIds && assetIds.length) {
      const { startDate } = viewModal;
      const { endDate } = viewModal;

      const start = inspectionDashboardFilters && inspectionDashboardFilters.data ? inspectionDashboardFilters.data[0].selectDate[0] : moment(startDate).format('YYYY-MM-DD');
      const end = inspectionDashboardFilters && inspectionDashboardFilters.data ? inspectionDashboardFilters.data[0].selectDate[1] : moment(endDate).format('YYYY-MM-DD');

      const customData = selectedField === 'maintenance_team_id' ? getColumnArrayById(getColumnArrayById(customSelectedOptions, 'maintenance_team_id'), 'id') : getColumnArrayById(customSelectedOptions, 'asset_name');
      setSelectedGroupFilters(customData);
      const enforceData = enforceOptions ? enforceOptions.value : false;
      const inspectionTypeData = typeOptions ? typeOptions.value : false;
      const isAll = selectedFilter.filter((item) => item === 'All') && selectedFilter.filter((item) => item === 'All').length ? states : selectedFilter;
      dispatch(getInspectionViewerGroups(companies, appModels.INSPECTIONCHECKLISTLOGS, start, end, isAll, assetName ? 'asset_id' : selectedField, assetName ? [assetName] : customData, assetIds, totalLen, teamsList, enforceData, inspectionTypeData));
    }
  }, [assetLoad, totalLen]);

  useMemo(() => {
    if (inspectionSpacePageGroups && inspectionSpacePageGroups.err && !inspectionSpacePageGroups.loading) {
      const { startDate } = viewModal;
      const { endDate } = viewModal;
      console.log(inspectionSpacePageGroups.err);

      const start = inspectionDashboardFilters && inspectionDashboardFilters.data ? inspectionDashboardFilters.data[0].selectDate[0] : moment(startDate).format('YYYY-MM-DD');
      const end = inspectionDashboardFilters && inspectionDashboardFilters.data ? inspectionDashboardFilters.data[0].selectDate[1] : moment(endDate).format('YYYY-MM-DD');

      const isAll = selectedFilter.filter((item) => item === 'All') && selectedFilter.filter((item) => item === 'All').length ? states : selectedFilter;

      dispatch(getInspectionViewerGroups(companies, appModels.INSPECTIONCHECKLISTLOGS, start, end, isAll, assetName ? 'asset_id' : selectedField, assetName ? [assetName] : customData, assetIds, totalLen, teamsList, enforceField, inspectionGroup));
    }
  }, [inspectionSpacePageGroups && inspectionSpacePageGroups.err && inspectionSpacePageGroups.err.status]);

  useEffect(() => {
    if (!assetName && selectedField && userInfo && userInfo.data) {
      const { startDate } = viewModal;
      const { endDate } = viewModal;
      const { viewType } = viewModal;

      const start = moment(startDate).format('YYYY-MM-DD');
      const end = moment(endDate).format('YYYY-MM-DD');

      dispatch(getCustomGroup(companies, appModels.INSPECTIONCHECKLISTLOGS, selectedField, userInfo.data.id, userInfo.data.is_parent, false, teamsList, 'date', start, end, viewType === 5 ? 'yes' : false));
    }
  }, [selectedField, enter]);

  useEffect(() => {
    if ((customDataGroup && customDataGroup.data && customDataGroup.data.length)) {
      if (selectedField !== 'maintenance_team_id') {
        if (selectedField !== 'maintenance_team_id') {
          const newArrData = customDataGroup.data.map((cl) => ({
            ...cl,
            value: cl[selectedField] ? cl[selectedField] : '',
            label: cl[selectedField] ? cl[selectedField] : '',
          }));
          setGroupData(newArrData);
        } else {
          const newArrData = customDataGroup.data.map((cl) => ({
            ...cl,
            value: cl[selectedField] && cl[selectedField].length ? cl[selectedField][0] : '',
            label: cl[selectedField] && cl[selectedField].length ? cl[selectedField][1] : '',
          }));
          setGroupData(newArrData);
        }
      } else {
        const isMaintenanceKey = customDataGroup.data && customDataGroup.data[0].maintenance_team_id;
        if (isMaintenanceKey) {
          const data = [...new Map(customDataGroup.data.map((item) => [item.maintenance_team_id.id, item])).values()];
          const newArrData = data.map((cl) => ({
            ...cl,
            value: cl[selectedField] && cl[selectedField].id ? cl[selectedField].id : '',
            label: cl[selectedField] && cl[selectedField].name ? cl[selectedField].name : '',
          }));
          setGroupData(newArrData);
        }
      }
    } else {
      setGroupData([]);
    }
  }, [customDataGroup]);

  /* useEffect(() => {
    if ((inspectionPageGroups && inspectionPageGroups.data && inspectionPageGroups.data.length)) {
      const newArrData = inspectionPageGroups.data.map((cl) => ({
        ...cl,
        value: cl.equipment_id && cl.equipment_id.length ? cl.equipment_id[0] : '',
        label: cl.equipment_id && cl.equipment_id.length ? cl.equipment_id[1] : '',
        type: 'equipment',
      }));
      const loadData = getColumnArrayById(newArrData, 'value');
      const newData = [...pageGroupData, ...loadData];
      setPageGroupData([...new Map(newData.map((item) => [item, item])).values()]);
      setPageGroupDetailData([...pageGroupDetailData, ...newArrData]);
      if (assetIds && !assetIds.length) {
        setAssetIds(loadData.slice(0, limit));
        setAssetLoad(Math.random());
      } else if (assetIds && assetIds.length < 10) {
        const uniAssetIds = [...assetIds, ...loadData];
        const aids = [...new Map(uniAssetIds.map((item) => [item, item])).values()];
        setAssetIds(aids.slice(0, limit));
        setAssetLoad(Math.random());
      }
    } else {
      const previousData = pageGroupDetailData;
      let spaceData = [];
      const filterData = previousData.filter((item) => item.type !== 'equipment');
      if (previousData && previousData.length && filterData && filterData.length) {
        spaceData = filterData;
      }
      const loadData = getColumnArrayById(spaceData, 'value');
      setAssetIds(loadData.slice(0, limit));
      setPageGroupData(loadData);
      setPageGroupDetailData(spaceData);
    }
  }, [inspectionPageGroups]); */

  useEffect(() => {
    if ((inspectionSpacePageGroups && inspectionSpacePageGroups.data && inspectionSpacePageGroups.data.length)) {
      const newArrData = inspectionSpacePageGroups.data.map((cl) => ({
        ...cl,
        value: cl.asset_id,
        label: cl.asset_id,
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
    } /* else {
      const previousData = pageGroupDetailData;
      let euipmentData = [];
      const filterData = previousData.filter((item) => item.type !== 'space');
      if (previousData && previousData.length && filterData && filterData.length) {
        euipmentData = filterData;
      }
      const loadData = getColumnArrayById(euipmentData, 'value');
      setAssetIds(loadData.slice(0, limit));
      setPageGroupData(loadData);
      setPageGroupDetailData(euipmentData);
    } */
  }, [inspectionSpacePageGroups]);

  const comDate = inspectionCommenceInfo && inspectionCommenceInfo.data && inspectionCommenceInfo.data.length
    && inspectionCommenceInfo.data[0].inspection_commenced_on ? inspectionCommenceInfo.data[0].inspection_commenced_on : new Date();

  const prevClickCustom = () => {
    const { startDate } = viewModal;
    if (new Date(startDate) >= new Date(comDate)) {
      const sdata = viewModal;
      sdata.prev();
      setViewModal(sdata);
      setOffset(0);
      setPage(1);
      setAssetIds([]);
      setAssetLoad(Math.random());
      setPageGroupData([]);
      setPageGroupDetailData([]);
      dispatch(getDashboardFilters(false));
      setEnter(Math.random());
    }
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
      dispatch(getDashboardFilters(false));
      setEnter(Math.random());
    }
  };

  const leftCustom = (
    `<div class="font-11">
     ${(new Date(viewModal.startDate) >= new Date(comDate)) ? '<span class="arrow-show left-show float-left ml-2 mt-1 cursor-pointer" id="previousButton"></span>' : ''}
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

      console.log(checkedButtons);

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
            </p>
            <p class='row ml-3 mb-0 resource-item font-size-10px' style='color:rgba(0,0,0,.6)' title="${resources[i].type}">
            ${(resources[i].type)}
          </p><p class="row ml-3 mb-0 font-weight-500 font-size-12px"> ${resources[i].reference}</p>`;
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

      const start = moment(startDate).format('YYYY-MM-DD');
      const end = moment(endDate).format('YYYY-MM-DD');

      const isAll = selectedFilter.filter((item) => item === 'All') && selectedFilter.filter((item) => item === 'All').length ? states : selectedFilter;

      let customDatas = selectedField === 'maintenance_team_id' ? getColumnArrayById(getColumnArrayById(customSelectedOptions, 'maintenance_team_id'), 'id') : getColumnArrayById(customSelectedOptions, 'asset_name');
      if (assetName) {
        customDatas = [assetName];
      }
      setSelectedGroupFilters(customData);
      setSelectedField('asset_id');

      if (userInfo && userInfo.data) {
        // dispatch(getPageGroups(companies, appModels.INSPECTIONCHECKLISTLOGS, start, end, isAll, selectedField, groupFilters, teamsList, enforceField, inspectionGroup));
        dispatch(getPageSpaceGroups(companies, appModels.INSPECTIONCHECKLISTLOGS, start, end, isAll, assetName ? 'asset_id' : selectedField, customDatas, teamsList, enforceField, inspectionGroup));
        // dispatch(getInspectionViewerGroups(companies, appModels.INSPECTIONCHECKLISTLOGS, start, end, isAll, selectedField, groupFilters, assetIds, totalLen));
      }
    }
  }, [enter]);

  useEffect(() => {
    const classData = document.getElementsByClassName('ant-row-flex-middle')[0].children[2];
    classData.classList.add('col-md-7');
  }, []);

  useEffect(() => {
    // let isMounted = true;
    // if (isMounted) {
    if (inspectionGroupInfo && inspectionGroupInfo.data) {
      const { endDate } = viewModal;
      viewModal.setResources(getResources(inspectionGroupInfo.data));
      viewModal.setEvents(getEventData(inspectionGroupInfo.data, userInfo, endDate));
      setCalendarData(Math.random());
    } else {
      viewModal.setResources(getResources([]));
      viewModal.setEvents(getEventData([]));
      setCalendarData(Math.random());
    }
    // }
    // return () => { isMounted = false; };
  }, [inspectionGroupInfo]);

  useEffect(() => {
    const { startDate, endDate } = viewModal;
    if (moment(new Date(endDate)).format('YYYY-MM-DD') > moment(new Date()).format('YYYY-MM-DD') && viewHead === 'Week') {
      setNext(false);
    } else if (moment(new Date(startDate)).format('YYYY-MM-DD') < moment(new Date()).format('YYYY-MM-DD')) {
      setNext(true);
    } else {
      setNext(false);
    }
  }, [enter, viewModal]);

  useEffect(() => {
    if (uuid) {
      dispatch(getInspectionDetail(companies, 'dw2.inspection_log', uuid));
      setEventModal(true);
    }
  }, [uuid]);

  const prevClick = (sdata) => {
    const { startDate } = viewModal;
    if (new Date(startDate) >= new Date(comDate)) {
      sdata.prev();
      setViewModal(sdata);
      setOffset(0);
      setPage(1);
      setAssetIds([]);
      setAssetLoad(Math.random());
      setPageGroupData([]);
      setPageGroupDetailData([]);
      dispatch(getDashboardFilters(false));
      setEnter(Math.random());
    }
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
      dispatch(getDashboardFilters(false));
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
    dispatch(getDashboardFilters(false));
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
    dispatch(getInspectionDetail(companies, 'dw2.inspection_log', event.dataId));
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

  const handleDateChange = () => {
    const today = moment();
    const sdata = viewModal;
    sdata.setDate(today);
    setViewModal(sdata);
    setOffset(0);
    setPage(1);
    setAssetIds([]);
    setAssetLoad(Math.random());
    setPageGroupData([]);
    setPageGroupDetailData([]);
    dispatch(getDashboardFilters(false));
    setEnter(Math.random());
  };

  const eventItemPopoverTemplateResolver = (data, eventItem, title, start, end, statusColor) => {
    const showData = [
      {
        value: eventItem.type === 'Space' ? eventItem.space_name : eventItem.equipment_name,
        property: eventItem.type === 'Space' ? 'Space' : 'Equipment',
      },
      {
        property: 'Maintenance Team',
        value: title,
      },
      {
        property: 'Reference Number',
        value: eventItem.type === 'Space' ? eventItem.space_number : eventItem.equipment_number,
      },
      {
        property: 'Review Status',
        value: eventItem.review_status && eventItem.review_status === 'Done' ? 'Reviewed' : 'Not Reviewed',
      },
      {
        property: 'Review Status',
        value: eventItem.review_status && eventItem.review_status === 'Done' ? 'Reviewed' : 'Not Reviewed',
      },
    ];
    return (
      <div className="ant-popover-inner-content">
        <div style={{ width: '300px' }}>
          <div className="ant-row-flex ant-row-flex-middle">
            <div className="ant-col ant-col-22 overflow-text">
              <Row>
                <Col sm="12" md="12" lg="12" className="mb-2">
                  <div style={{ display: 'flex' }}>
                    <div className="status-dot mt-1" style={{ backgroundColor: statusColor }} />
                    {eventItem.schedule && eventItem.schedule.length && eventItem.schedule.length > 60 && (
                      <Tooltip title={eventItem.schedule} placement="top">
                        <span style={{ color: eventItem.color }} className="ml-2 badge-text no-border-radius badge badge-blue badge-pill">{truncate(eventItem.schedule, 60)}</span>
                      </Tooltip>
                    )}
                    {eventItem.schedule && eventItem.schedule.length && eventItem.schedule.length < 60 && (
                      <>
                        <span className="header2-text ml-2" style={{ color: eventItem.color }}>
                          {eventItem.schedule}
                        </span>

                        {eventItem.parent_id && (
                        <Tooltip title="View Parent Schedule">
                          <FontAwesomeIcon
                            className="px-1 py-0 ml-2 mt-1 cursor-pointer"
                            style={{ color: AddThemeColor({}).color }}
                            onClick={() => {
                              setParentScheduleId(eventItem.parent_id);
                              setParentScheduleViewModal(true);
                            }}
                            size="sm"
                            icon={faEye}
                          />
                        </Tooltip>
                        ) }
                      </>
                    )}
                  </div>
                </Col>
                {eventItem.enforce_time && (
                  <Col sm="2" md="2" lg="2">
                    <Button size="sm" variant="outlined" style={{ minWidth: '0px' }} className="px-1 py-0 ml-2 bg-white cursor-default">
                      T
                    </Button>
                  </Col>
                )}
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
                        {data?.value}
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

  const handleStatusChange = (value) => {
    const isAll = !!(selectedFilter.filter((item) => item === 'All') && selectedFilter.filter((item) => item === 'All').length);
    if (isAll) {
      const arr = [...selectedFilter.filter((item) => item !== 'All'), ...[value]];
      setSelectedFilter([...new Map(arr.map((item) => [item, item])).values()]);
    } else if (value === 'All') {
      setSelectedFilter([value]);
    } else {
      const arr = [...selectedFilter, ...[value]];
      setSelectedFilter([...new Map(arr.map((item) => [item, item])).values()]);
    }
    dispatch(getDashboardFilters(false));
  };

  const handleCustomChangeInfo = (options) => {
    const lastOne = options[options.length - 1];
    const dropdownValues = states;
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

  const handleStatusDeselectChange = (value) => {
    setSelectedFilter(selectedFilter.filter((item) => item !== value));
    dispatch(getDashboardFilters(false));
    setStatusFilter(true);
  };

  const handleStatusClear = () => {
    setSelectedFilter([]);
    dispatch(getDashboardFilters(false));
    setOffset(0);
    setPage(1);
    setAssetIds([]);
    setAssetLoad(Math.random());
    setPageGroupData([]);
    setPageGroupDetailData([]);
    setFilterApply(Math.random());
    setStatusFilter(false);
  };

  const handleFilterChange = (value) => {
    const arr = [...groupFilters, ...[value]];
    setSelectedGroupFilters([...new Map(arr.map((item) => [item, item])).values()]);
    dispatch(getDashboardFilters(false));
  };

  const handleFilterDeselectChange = (value) => {
    setSelectedGroupFilters(groupFilters.filter((item) => item !== value));
    dispatch(getDashboardFilters(false));
    setGroupFilter(true);
  };

  const handleGroupFilterClear = () => {
    setSelectedGroupFilters([]);
    dispatch(getDashboardFilters(false));
    setFilterApply(Math.random());
    setOffset(0);
    setPage(1);
    setAssetIds([]);
    setAssetLoad(Math.random());
    setPageGroupData([]);
    setPageGroupDetailData([]);
    setGroupFilter(false);
  };

  const handleFilterClear = () => {
    setSelectedField(null);
    setGroupData([]);
    setSelectedGroupFilters([]);
    setGroupFilter(false);
    setOffset(0);
    setPage(1);
    setAssetIds([]);
    setAssetLoad(Math.random());
    setPageGroupData([]);
    setPageGroupDetailData([]);
    dispatch(getDashboardFilters(false));
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

  const leftCustomHeader = (
    <div>
      {(new Date(viewModal.startDate) >= new Date(comDate)) && (
        <FontAwesomeIcon size="lg" className="mr-1 ml-2 cursor-pointer" onClick={() => { prevClickCustom(); }} icon={faChevronLeft} />
      )}
      <Button
        size="sm"
        onClick={() => { handleDateChange(); }}
        className="pr-4 pl-4 p-0  text-white rounded-pill"
        variant="contained"
      >
        {viewHead}
      </Button>
      {isNext && (
        <FontAwesomeIcon size="lg" className="ml-1 cursor-pointer" onClick={() => { nextClickCustom(); }} icon={faChevronRight} />
      )}
    </div>
  );

  const onChangeFilters = () => {
    setOffset(0);
    setPage(1);
    setAssetIds([]);
    setAssetLoad(Math.random());
    setPageGroupData([]);
    setPageGroupDetailData([]);
    setFilterApply(Math.random());
    setStatusFilter(false);
    setGroupFilter(false);
  };

  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsetValue = (index - 1) * limit;
    setOffset(offsetValue);
    setPage(index);

    const pageData = pageGroupData;
    setAssetIds(pageData.slice(offsetValue, (offsetValue + limit)));
    setAssetLoad(Math.random());
  };

  const currentGroupData = inspectionDashboardFilters && inspectionDashboardFilters.data && inspectionDashboardFilters.data.teams && inspectionDashboardFilters.data.teams.length
    ? [{ value: inspectionDashboardFilters.data[0].teams[0], label: inspectionDashboardFilters.data[0].teamName }] : groupData;

  const currentGroupFilters = inspectionDashboardFilters && inspectionDashboardFilters.data && inspectionDashboardFilters.data.length
    ? inspectionDashboardFilters.data[0].teams : groupFilters;

  const onCloseFilters = () => {
    setFilterOpen(false);
    setStatusOptions(customFilters.statusOptions);
    setCustomOptions(customFilters.customOptions);
    setCustomSelectedOptions(customFilters.customSelectedOptions);
    setTypeOptions(customFilters.typeOptions);
    setEnforceOptions(customFilters.enforceOptions);
  };

  useEffect(() => {
    if (!assetName) {
      setStatusOptions(customFilters.statusOptions ? customFilters.statusOptions : []);
      setCustomOptions(customFilters.customOptions ? customFilters.customOptions : '');
      setCustomSelectedOptions(customFilters.customSelectedOptions ? customFilters.customSelectedOptions : []);
      setTypeOptions(customFilters.typeOptions ? customFilters.typeOptions : '');
      setEnforceOptions(customFilters.enforceOptions ? customFilters.enforceOptions : '');
    }
  }, [customFilters]);

  const onApplyFilters = () => {
    setFilterOpen(false);

    setOffset(0);
    setPage(1);
    setAssetIds([]);
    setAssetLoad(Math.random());
    setPageGroupData([]);
    setPageGroupDetailData([]);
    setFilterApply(Math.random());
    setStatusFilter(false);
    setGroupFilter(false);

    const obj = {
      statusOptions,
      customOptions,
      customSelectedOptions,
      typeOptions,
      enforceOptions,
    };
    setCustomFilters(obj);
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
      title: 'By Maintenance Team / Asset',
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
    onChange={(e, options) => { dispatch(resetCustomGroup([])); setCustomOptions(options); setCustomSelectedOptions([]); setSelectedField(options ? options.value : false); }}
    getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
    options={customData && customData.groupFilters ? customData.groupFilters : []}
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
      title: selectedField && selectedField === 'maintenance_team_id' ? 'By Maintenance Team' : selectedField && selectedField === 'asset_name' ? 'By Asset' : false,
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
    {
      title: 'By Additional Filter',
      component:
  <Autocomplete
    name="Type"
    label="Type"
    formGroupClassName="m-1"
    open={enforceOpen}
    size="small"
    onOpen={() => {
      setEnforceOpen(true);
    }}
    onClose={() => {
      setEnforceOpen(false);
    }}
    value={enforceOptions}
    onChange={(e, options) => { setEnforceOptions(options); setEnforceField(options ? options.value : false); }}
    getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
    options={customData && customData.EnforceFilters ? customData.EnforceFilters : []}
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
      title: 'By Inspection Type',
      component:
  <Autocomplete
    name="Type"
    label="Type"
    formGroupClassName="m-1"
    open={typeOpen}
    size="small"
    onOpen={() => {
      setTypeOpen(true);
    }}
    onClose={() => {
      setTypeOpen(false);
    }}
    value={typeOptions}
    onChange={(e, options) => { setTypeOptions(options); setInspectionGroup(options ? options.value : false); }}
    getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
    options={customData && customData.InspectionFilters ? customData.InspectionFilters : []}
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
  ];

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
  };

  const isExportDisabled = (inspectionGroupInfo && inspectionGroupInfo.data && inspectionGroupInfo.data.length === 0) || (inspectionGroupInfo && inspectionGroupInfo.data === null);

  const rightCustomHeader = (
    <>
      <span />
      {!assetName && (
        <>
          <IconButton
            className="header-filter-btn col-md-1"
            onClick={() => setFilterOpen(true)}
            color="primary"
          >
            <FilterAltOutlinedIcon
              size={15}
              style={{ color: AddThemeColor({}).color, marginRight: '3px' }}
            />
            <span className="my-1 ml-1" style={{ color: AddThemeColor({}).color }}>
              Filters
            </span>
          </IconButton>
          <MuiTooltip title="Refresh">
            <IconButton className="header-link-btn" color="primary" onClick={() => { handleResetClick(); setReload(Math.random()); }}>
              {' '}
              <RxReload size={19} color={AddThemeColor({}).color} />
              {' '}
            </IconButton>
          </MuiTooltip>
          <IconButton className="header-filter-btn col-md-1" color="primary" disabled={isExportDisabled} onClick={() => setShowExport(true)}>
            <CgExport size={20} className="mb-1" color={AddThemeColor({}).color} />
            <span className="my-1 ml-1" style={{ color: AddThemeColor({}).color }}> Export </span>
          </IconButton>

          <IconButton
            onClick={() => setPopoverOpen(true)}
            onMouseEnter={() => setPopoverOpen(true)}
            onMouseHover={() => setPopoverOpen(true)}
            onMouseLeave={() => setPopoverOpen(false)}
            color="primary"
            id="PopoverHelp"
          >
            <FaInfoCircle size={20} className="mb-1" style={{ color: AddThemeColor({}).color }} />
          </IconButton>
        </>
      )}
    </>
  );

  const eventItemTemplateResolver = (sdata, event, bgColor, isStart, isEnd, mustAddCssClass, mustBeHeight, agendaMaxEventWidth) => {
    const roundCls = 'round-all';
    const backgroundColor = event.bgColor;
    let image = '';
    let margin = '';

    if (sdata.viewType === ViewTypes.Custom) {
      margin = '';
    } else {
      margin = 'ml-2';
    }
    const titleText = sdata.behaviors.getEventTextFunc(sdata, event);
    if (event.status === '1' && !event.isAbnormal) {
      image = <img alt="completed" src={completed} width="17" height="17" className={`${margin} cursor-pointer`} />;
    } else if (event.status === '2' && !event.isAbnormal) {
      image = <img alt="inprogress" src={inProgress} width="17" height="17" className={`${margin} cursor-pointer`} />;
    } else if (event.status === '4' && !event.isAbnormal) {
      image = <img alt="upcoming" src={upcoming} width="17" height="17" className={`${margin} cursor-pointer`} />;
    } else if (event.status === '3' && !event.isAbnormal) {
      image = <img alt="upcoming" src={upcomingBlack} width="17" height="17" className={`${margin} cursor-pointer`} />;
    } else if (event.isAbnormal) {
      image = <img alt="alertIcon" src={incidentManagementWhite} width="14" height="14" className={`${margin} cursor-pointer`} />;
    } else if (event.status === '6') {
      image = <img alt="cancelled" src={cancelled} width="17" height="17" className={`${margin} cursor-pointer`} />;
    }

    let divStyle = {
      backgroundColor, color: event.color, height: mustBeHeight, paddingLeft: '4px',
    };
    let divStyle1 = { backgroundColor, color: event.color, height: mustBeHeight };
    if (agendaMaxEventWidth) divStyle = { ...divStyle, maxWidth: agendaMaxEventWidth };
    if (agendaMaxEventWidth) divStyle1 = { ...divStyle1, maxWidth: agendaMaxEventWidth };
    let events = '';

    if (sdata.viewType === ViewTypes.Custom) {
      events = (
        <div key={event.id} className={event.isAbnormal ? `${roundCls} abnormal` : roundCls} style={divStyle}>
          {image}
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
          {image}
          {' '}
          <span className="font-11 ml-1" style={{ lineHeight: `${mustBeHeight}px` }}>
            {event.schedule}
          </span>
        </div>
      );
    }

    return events;
  };

  const isUserError = userInfo && userInfo.err;
  const loading = (userInfo && userInfo.loading)
    || (inspectionGroupInfo && inspectionGroupInfo.loading)
    || (inspectionSpacePageGroups && inspectionSpacePageGroups.loading) || (inspectionPageGroups && inspectionPageGroups.loading);
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (inspectionGroupInfo && inspectionGroupInfo.err) ? generateErrorMessage(inspectionGroupInfo) : userErrorMsg;
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

  return (
    <Card className="">
      <Alert severity="info">
        Last Updated at:
        {'  '}
        {lastUpdateTime ? getCompanyTimezoneDate(lastUpdateTime, userInfo, 'datetime') : 'N/A'}
      </Alert>
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
          rightCustomHeader={rightCustomHeader}
        />
        {popover}

        {loading && !assetName && (
          <div className="loader" data-testid="loading-case">
            <Loader />
          </div>
        )}
        {loading && assetName && (
          <Card>
            <CardBody className="">
              <Loader />
            </CardBody>
          </Card>
        )}
        {((inspectionGroupInfo && inspectionGroupInfo.err) || isUserError) && (
          <ErrorContent errorTxt={errorMsg} />
        )}
        {(inspectionGroupInfo && inspectionGroupInfo.data && inspectionGroupInfo.data.length === 0 && !inspectionGroupInfo.err && !loading) && (
          <ErrorContent errorTxt="" />
        )}
        <EventDetails eventDetailModel={eventModal} atFinish={() => setEventModal(false)} />
      </div>
      {loading || pages === 0 ? (<span />) : (
        <div className="margin-center p-2">
          <Pagination count={pages} page={page} size="small" onChange={handlePageClick} showFirstButton showLastButton />
        </div>
      )}
      {!assetName && (
      <Popover placement="left" isOpen={popoverOpen} className="popoverQuestion" target="PopoverHelp">
        <PopoverBody className="pr-0 pl-2">
          <div className="ml-1 popover_line">
            <img alt="inProgress" src={inProgress} height="17" className="cursor-pointer mr-1" />
            <small className="text-missed-inspection mr-4 font-weight-600">Missed</small>
            <br />
            <img alt="completed" src={completed} height="17" className="cursor-pointer mr-1" />
            <small className="text-green mr-4 font-weight-600">Completed</small>
            <br />
            <img alt="upcoming" src={upcoming} height="17" className="cursor-pointer mr-1" />
            <small className="text-blue font-weight-600">Upcoming</small>
            <br />
            <img alt="abnormal" src={alertIcon} width="14" height="14" className="cursor-pointer mr-1" />
            <small className="text-danger font-weight-600">Abnormal</small>
            <br />
            <img alt="cancelled" src={cancelled} height="17" className="cursor-pointer mr-1" />
            <small className="text-cancelled font-weight-600">Cancelled</small>
          </div>
        </PopoverBody>
      </Popover>
      )}
      <Drawer anchor="right" open={filterOpen} PaperProps={{ sx: { width: '30%' } }}>
        <ReportsFilterDrawer
          filtersComponentsArray={filtersComponentsArray}
          onApplyFilters={onApplyFilters}
          onCloseFilters={onCloseFilters}
        />
      </Drawer>
      <DataExport
        afterReset={() => dispatch(setInitialValues(false, false, false, false))}
        fields={[]}
        selectedFilter={selectedFilter}
        selectedField={selectedField}
        viewModal={viewModal}
        viewHead={viewHead}
        groupFilters={groupFilters}
        assetIds={pageGroupData}
        customDataGroup={groupData}
        enforceField={enforceField}
        inspectionGroup={inspectionGroup}
        labelField={labelField}
        exportType={exportType}
        exportTrue={exportTrue}
        showExport={showExport}
        isFilterApply={isFilterApply}
      />
      <ExportDrawer
        showExport={showExport}
        setShowExport={setShowExport}
        setExportTrue={setExportTrue}
        setExportType={setExportType}
        loading={exportLoading}
      />
      <Drawer
        PaperProps={{
          sx: { width: '85%' },
        }}
        anchor="right"
        open={parentSchedule}
      >
        <DrawerHeader
          headerName={inspectionSchedulerDetail && (inspectionSchedulerDetail.data && inspectionSchedulerDetail.data.length > 0)
            ? extractNameObject(inspectionSchedulerDetail.data[0].group_id, 'name') : ''}
          imagePath={inspectionSchedulerDetail && (inspectionSchedulerDetail.data && inspectionSchedulerDetail.data.length > 0) ? InspectionIcon : ''}
          onClose={() => { setParentScheduleId(false); setParentScheduleViewModal(false); }}
        />
        <SchedulerDetail isWarehouse />
      </Drawer>
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
