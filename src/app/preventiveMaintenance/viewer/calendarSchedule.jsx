/* eslint-disable react/prop-types */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable consistent-return */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-param-reassign */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/no-danger */
import React, { useEffect, useState } from 'react';
import {
  Card, Popover, PopoverBody, Row, Col,
  CardBody,
} from 'reactstrap';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Alert from '@mui/material/Alert';
import Scheduler, {
  SchedulerData, ViewTypes, DATE_FORMAT, AddMorePopover,
} from 'react-big-scheduler';
import 'react-big-scheduler/lib/css/style.css';
import moment from 'moment';
import * as PropTypes from 'prop-types';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import { FaInfoCircle } from 'react-icons/fa';
import {
  CgExport,
} from 'react-icons/cg';
import DOMPurify from 'dompurify';
import {
  IconButton, Autocomplete, TextField, Drawer, Typography, Box,
} from '@mui/material';
import { RxReload, RxCopy } from 'react-icons/rx';
import { IoCloseOutline } from 'react-icons/io5';
import BackspaceIcon from '@material-ui/icons/Backspace';
import InputAdornment from '@material-ui/core/InputAdornment';

import completed from '@images/icons/completed.svg';
import missed from '@images/inspection/missed.svg';
import cancelled from '@images/inspection/cancelled.svg';
import pauseIcon from '@images/inspection/pauseIcon.svg';
import inProgress from '@images/icons/inprogress.svg';
import upcoming from '@images/icons/upcoming.svg';
import Pagination from '@material-ui/lab/Pagination';

import ErrorContent from '@shared/errorContent';
import MuiTooltip from '@shared/muiTooltip';
import Loader from '@shared/loading';

import DrawerHeader from '../../commonComponents/drawerHeader';
import DataExport from './dataExport/dataExport';
import { setInitialValues } from '../../purchase/purchaseService';
import '../../inspectionSchedule/viewer/calendarStyle.scss';
import EventDetails from './viewDetails/viewInspection';
import withDragDropContext from '../withDnDContext';
import {
  isNonWorkingTime, getCustomDate, getDateLabelFunc, getHeaderDateFormat,
} from '../utils/utils';
import {
  getResources, getEventData,
} from './utils/utils';
import {
  generateErrorMessage,
  getAllowedCompanies,
  getStartTime, getEndTime,
  getPagesCountV2, truncateWord, getDatePickerFormat,
  addOneWeek,
  substractOneWeek, getColumnArrayById, getCompanyTimezoneDate,
} from '../../util/appUtils';
import {
  getPPMChecklists, getCustomGroup, getPPMDetail, getDashboardFilters,
  getPPMChecklistsCount,
} from '../../inspectionSchedule/inspectionService';
import customData from './data/customData.json';
import { resetPPMhecklistExport, getLastUpdate } from '../ppmService';
import { ReturnThemeColor, AddThemeColor, AddThemeBackgroundColor } from '../../themes/theme';
import ExportDrawer from '../../commonComponents/exportDrawer';
import ReportsFilterDrawer from '../../commonComponents/reportsFilterDrawer';
import CopyExternalUrl from './copyExternalUrl';

const appModels = require('../../util/appModels').default;

const CalendarSchedule = ({ userInfo, assetName, uuid }) => {
  const dispatch = useDispatch();
  moment.locale('en', { week: { dow: 1, doy: 7 } });
  const schedulerData = new SchedulerData(
    moment().format(DATE_FORMAT),
    assetName ? ViewTypes.Week : ViewTypes.Custom,
    false,
    false,
    {
      resourceName: '',
      schedulerWidth: '95%',
      dayResourceTableWidth: 180,
      weekResourceTableWidth: 180,
      monthResourceTableWidth: 180,
      customResourceTableWidth: 180,
      weekCellWidth: '11%',
      agendaResourceTableWidth: 180,
      nonAgendaSlotMinHeight: 50,
      dayCellWidth: 50,
      monthCellWidth: 50,
      weekMaxEvents: 4,
      monthMaxEvents: 4,
      dayMaxEvents: 3,
      customCellWidth: 35,
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
      ],
    },
    { getCustomDateFunc: getCustomDate, isNonWorkingTimeFunc: isNonWorkingTime },
  );
  schedulerData.setLocaleMoment(moment);
  const [viewModal, setViewModal] = useState(schedulerData);
  const [enter, setEnter] = useState('');
  const [viewHead, setViewHead] = useState('Month');
  const [eventModal, setEventModal] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [calendarData, setCalendarData] = useState(false);
  const [copyUrl, showCopyUrl] = useState(false);
  const [headerItem, setHeaderItem] = useState(undefined);
  const [leftPop, setLeftPop] = useState(0);
  const [topPop, setTopPop] = useState(0);
  const [heightPop, setHeightPop] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState(['All']);
  const [selectedField, setSelectedField] = useState(null);

  const history = useHistory();

  const [groupData, setGroupData] = useState([]);

  const [groupFilters, setSelectedGroupFilters] = useState([]);

  const [isFilterApply, setFilterApply] = useState(true);
  const [fetchTime, setFetchTime] = useState(true);
  const [isStatusFilter, setStatusFilter] = useState(false);
  const [isGroupFilter, setGroupFilter] = useState(false);
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);
  const [resourceLoading, setResourceLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [isDisable, setDisable] = useState(false);

  const [filterOpen, setFilterOpen] = useState(false);
  const [showExport, setShowExport] = useState(false);

  const [exportType, setExportType] = useState('');
  const [exportTrue, setExportTrue] = useState('');

  const [requestOpen, setRequestOpen] = useState(false);

  const [prepostPoneOpen, setPrepostPoneOpen] = useState(false);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [requestCancelOpen, setRequestCancelOpen] = useState(false);
  const [complainceTypeOpen, setComplainceTypeOpen] = useState(false);

  const [statusOpen, setStatusOpen] = useState(false);
  const [statusOptions, setStatusOptions] = useState([{ value: 'All', label: 'All' }]);
  const [requestOptions, setRequestOptions] = useState('');

  const [customOpen, setCustomOpen] = useState(false);
  const [customOptions, setCustomOptions] = useState('');

  const [customSelectedOpen, setCustomSelectedOpen] = useState(false);
  const [customSelectedOptions, setCustomSelectedOptions] = useState([]);

  const [customFilters, setCustomFilters] = useState({
    statusOptions,
    customOptions,
    customSelectedOptions,
    requestOptions,
  });
  const companies = getAllowedCompanies(userInfo);

  const {
    ppmGroupInfo,
    customDataGroup,
    ppmChecklistCount,
    ppmChecklistLoading,
  } = useSelector((state) => state.inspection);

  const {
    ppmChecklistExportInfo,
    warehouseLastUpdate,
  } = useSelector((state) => state.ppm);

  const states = ['Missed', 'Upcoming', 'Completed', 'Abnormal', 'In Progress', 'Pause', 'Cancelled'];

  const lastUpdateTime = warehouseLastUpdate && warehouseLastUpdate.data && warehouseLastUpdate.data.length && warehouseLastUpdate.data[0].last_updated_at ? warehouseLastUpdate.data[0].last_updated_at : false;

  const { filterInitailValues } = useSelector((state) => state.purchase);

  const totalDataCount = ppmChecklistCount && ppmChecklistCount.length ? ppmChecklistCount.length : 0;

  const showReset = customFilters && ((customFilters?.customOptions?.label && customFilters?.customSelectedOptions?.length > 0) || (customFilters?.requestOptions?.label) || (customFilters?.statusOptions?.length && customFilters?.statusOptions[0].label !== 'All'));
  const limit = 50;
  const isUserError = userInfo && userInfo.err;
  const loading = (userInfo && userInfo.loading) || (ppmGroupInfo && ppmGroupInfo.loading) || (ppmChecklistLoading) || resourceLoading;
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (ppmGroupInfo && ppmGroupInfo.err) ? generateErrorMessage(ppmGroupInfo) : userErrorMsg;
  let popover = <div />;
  const pages = getPagesCountV2(totalDataCount, limit);

  const getDateLabel = () => {
    if (viewModal) {
      const { startDate } = viewModal;
      const { endDate } = viewModal;
      const { viewType } = viewModal;
      const dateLabel = getDateLabelFunc(viewModal, viewType, startDate, endDate);
      return dateLabel;
    }
    return '';
  };

  const StatusDot = ({ color = '#000000', size = 12 }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={size / 2} fill={color} />
    </svg>
  );

  useEffect(() => {
    if (ppmGroupInfo && ppmGroupInfo.loading || resourceLoading) {
      setDisable(true);
    } else {
      setDisable(false);
    }
  }, [enter, viewModal, ppmGroupInfo, resourceLoading]);

  useEffect(() => {
    const tableClass = document.getElementById('RBS-Scheduler-root');
    const schedulerContent = document.getElementsByClassName('scheduler-view')[0].children[1];
    tableClass.setAttribute('class', 'scheduler pin-expand');
    schedulerContent.setAttribute('class', 'thin-scrollbar');
  }, []);

  useEffect(() => {
    dispatch(getLastUpdate(appModels.PPMWEEK));
  }, []);

  useEffect(() => {
    dispatch(getLastUpdate(appModels.PPMWEEK));
  }, [fetchTime]);

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

  const arrowLeftClassName = isDisable ? 'arrow-show-disabled left-show float-left ml-2 mt-1 cursor-disabled' : 'arrow-show left-show float-left ml-2 mt-1 cursor-pointer';
  const arrowRightClassName = isDisable ? 'arrow-show-disabled right-show float-right mr-2 mt-1 cursor-disabled' : 'arrow-show right-show float-right mr-2 mt-1 cursor-pointer';

  const leftCustom = (
    `<div>
     <span class="${arrowLeftClassName}"  id="previousButton"></span>
        ${getDateLabel()}
        <span class="${arrowRightClassName}" id="nextButton"></span>
    </div>`
  );

  useEffect(() => {
    if (viewModal) {
      let isMounted = true;
      if (isMounted) {
        const { resources } = viewModal;
        const resourceTable = document.getElementsByClassName('resource-table');

        const checkedButton = document.getElementsByClassName('ant-radio-button-wrapper-checked');

        const checkedButtons = document.getElementsByClassName('ant-radio-button-wrapper');

        const rows = resourceTable[0].getElementsByClassName('header3-text');
        if (rows && rows.length) {
          rows[0].innerHTML = leftCustom;
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
            </p><p class="row ml-3 mb-0 resource-item font-weight-500 font-size-12px"> ${resources[i].reference}</p>`;
          }
        }

        const previousButtonClick = document.getElementById('previousButton');
        if (previousButtonClick && !loading) {
          previousButtonClick.addEventListener('click', () => prevClickCustom());
        }

        const nextButtonClick = document.getElementById('nextButton');
        if (nextButtonClick && !loading) {
          nextButtonClick.addEventListener('click', () => nextClickCustom());
        }
      }
      return () => { isMounted = false; };
    }
  }, [viewModal, isDisable]);

  useEffect(() => {
    if (assetName) {
      const { startDate } = viewModal;
      const { endDate } = viewModal;
      const { viewType } = viewModal;

      let start = moment(getStartTime(startDate)).utc().format('YYYY-MM-DD');
      let end = moment(getEndTime(endDate)).utc().format('YYYY-MM-DD');

      if (viewType === 5) {
        start = moment(getStartTime(substractOneWeek(startDate))).utc().format('YYYY-MM-DD');
        end = moment(getEndTime(addOneWeek(endDate))).utc().format('YYYY-MM-DD');
      }
      const isAll = selectedFilter.filter((item) => item === 'All') && selectedFilter.filter((item) => item === 'All').length ? states : selectedFilter;
      setSelectedField('asset_id');
      setSelectedGroupFilters([assetName]);
      dispatch(getPPMChecklists(companies, appModels.PPMWEEK, start, end, isAll, 'asset_id', [assetName], offset, limit, viewType === 5 ? 'yes' : false, requestOptions));
      dispatch(getPPMChecklistsCount(companies, appModels.PPMWEEK, start, end, isAll, 'asset_id', [assetName], viewType === 5 ? 'yes' : false, requestOptions));
    }
  }, [assetName]);

  useEffect(() => {
    if (userInfo && userInfo.data && !assetName) {
      const { startDate } = viewModal;
      const { endDate } = viewModal;
      const { viewType } = viewModal;

      let start = moment(getStartTime(startDate)).utc().format('YYYY-MM-DD');
      let end = moment(getEndTime(endDate)).utc().format('YYYY-MM-DD');

      if (viewType === 5) {
        start = moment(getStartTime(substractOneWeek(startDate))).utc().format('YYYY-MM-DD');
        end = moment(getEndTime(addOneWeek(endDate))).utc().format('YYYY-MM-DD');
      }
      const isAll = selectedFilter.filter((item) => item === 'All') && selectedFilter.filter((item) => item === 'All').length ? states : selectedFilter;
      if (userInfo && userInfo.data && !loading) {
        dispatch(getPPMChecklists(companies, appModels.PPMWEEK, start, end, isAll, selectedField, groupFilters, offset, limit, viewType === 5 ? 'yes' : false, requestOptions));
      }
    }
  }, [userInfo, isFilterApply, offset, reload]);

  useEffect(() => {
    if (userInfo && userInfo.data && !assetName) {
      const { startDate } = viewModal;
      const { endDate } = viewModal;
      const { viewType } = viewModal;

      let start = moment(getStartTime(startDate)).utc().format('YYYY-MM-DD');
      let end = moment(getEndTime(endDate)).utc().format('YYYY-MM-DD');

      if (viewType === 5) {
        start = moment(getStartTime(substractOneWeek(startDate))).utc().format('YYYY-MM-DD');
        end = moment(getEndTime(addOneWeek(endDate))).utc().format('YYYY-MM-DD');
      }

      const isAll = selectedFilter.filter((item) => item === 'All') && selectedFilter.filter((item) => item === 'All').length ? states : selectedFilter;
      if (userInfo && userInfo.data && !loading) {
        dispatch(getPPMChecklistsCount(companies, appModels.PPMWEEK, start, end, isAll, selectedField, groupFilters, viewType === 5 ? 'yes' : false, requestOptions));
      }
    }
  }, [isFilterApply, reload]);

  useEffect(() => {
    if (!assetName && selectedField && userInfo && userInfo.data) {
      const { startDate } = viewModal;
      const { endDate } = viewModal;
      const { viewType } = viewModal;

      let start = moment(getStartTime(startDate)).utc().format('YYYY-MM-DD');
      let end = moment(getEndTime(endDate)).utc().format('YYYY-MM-DD');

      if (viewType === 5) {
        start = moment(getStartTime(substractOneWeek(startDate))).utc().format('YYYY-MM-DD');
        end = moment(getEndTime(addOneWeek(endDate))).utc().format('YYYY-MM-DD');
      }
      dispatch(getCustomGroup(companies, appModels.PPMWEEK, selectedField, userInfo.data.id, userInfo.data.company.is_parent, 'ppm', false, 'date', start, end, viewType === 5 ? 'yes' : false));
    }
  }, [selectedField]);

  useEffect(() => {
    if ((customDataGroup && customDataGroup.data && customDataGroup.data.length)) {
      if (selectedField !== 'maintenance_team_id') {
        if (selectedField === 'asset_name') {
          const newArrData = customDataGroup.data.map((cl) => ({
            ...cl,
            value: cl[selectedField] ? cl[selectedField] : '',
            label: cl[selectedField] ? cl[selectedField] : '',
          }));
          setGroupData(newArrData);
        } else if (selectedField === 'vendor_name') {
          const newArrData = customDataGroup.data.map((cl) => ({
            ...cl,
            value: cl[selectedField] ? cl[selectedField] : '',
            label: cl[selectedField] ? cl[selectedField] : '',
          }));
          setGroupData(newArrData);
        } else if (selectedField === 'schedule_period_name') {
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
        const data = [...new Map(customDataGroup.data.map((item) => [item.maintenance_team_id.name, item])).values()];
        const newArrData = data.map((cl) => ({
          ...cl,
          value: cl[selectedField] && cl[selectedField].id ? cl[selectedField].id : '',
          label: cl[selectedField] && cl[selectedField].name ? cl[selectedField].name : '',
        }));
        setGroupData(newArrData);
      }
    } else if (customDataGroup.loading) {
      setGroupData([{
        value: 'Loading...',
        label: 'Loading...',
      }]);
    } else {
      setGroupData([]);
    }
  }, [customDataGroup]);

  useEffect(() => {
    const resourceView = document.getElementsByClassName('resource-view')[0].children[1].style.width = 'auto';
  }, []);

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      const { resources, events } = viewModal;
      const resourceView = document.getElementsByClassName('resource-view')[0].children[1].style.width = 'auto';
      const resourceTable = document.getElementsByClassName('resource-table');
      for (let i = 0; i < resources.length; i += 1) {
        if (resourceTable[1].rows && resourceTable[1].rows.length) {
          resourceTable[1].rows[i].cells[0].innerHTML = `
            <p class='row ml-3 mb-0 resource-item font-weight-800 font-size-12px' title="${resources[i].name}"> 
           ${resources[i].name}
            </p>
            <p class='row ml-3 mb-0 resource-item font-size-10px' style='color:rgba(0,0,0,.6)' title="${resources[i].type}">
            ${(resources[i].type)}
          </p><p class="row ml-3 mb-0 resource-item font-weight-500 font-size-12px"> ${resources[i].reference}</p>`;
        }
      }
    }
    return () => { isMounted = false; };
  }, [calendarData]);

  useEffect(() => {
    if (enter) {
      setResourceLoading(false);
      setHeaderItem(undefined);
      setLeftPop(0);
      setTopPop(0);
      setHeightPop(0);
      setViewModal(viewModal);
      setViewHead(viewHead);
      const resourceTable = document.getElementsByClassName('resource-table');
      const rows = resourceTable[0].getElementsByClassName('header3-text');
      if (rows && rows.length) {
        rows[0].innerHTML = leftCustom;
      }
      const previousButtonClick = document.getElementById('previousButton');
      if (previousButtonClick && !loading) {
        previousButtonClick.addEventListener('click', () => prevClickCustom());
      }

      const nextButtonClick = document.getElementById('nextButton');
      if (nextButtonClick && !loading) {
        nextButtonClick.addEventListener('click', () => nextClickCustom());
      }
      const { startDate } = viewModal;
      const { endDate } = viewModal;

      const { viewType } = viewModal;

      let start = moment(getStartTime(startDate)).utc().format('YYYY-MM-DD');
      let end = moment(getEndTime(endDate)).utc().format('YYYY-MM-DD');

      if (viewType === 5) {
        start = moment(getStartTime(substractOneWeek(startDate))).utc().format('YYYY-MM-DD');
        end = moment(getEndTime(addOneWeek(endDate))).utc().format('YYYY-MM-DD');
      }

      const isAll = selectedFilter.filter((item) => item === 'All') && selectedFilter.filter((item) => item === 'All').length ? states : selectedFilter;
      if (userInfo && userInfo.data && !loading) {
        dispatch(getPPMChecklistsCount(companies, appModels.PPMWEEK, start, end, isAll, selectedField, groupFilters, viewType === 5 ? 'yes' : false, requestOptions));
        dispatch(getPPMChecklists(companies, appModels.PPMWEEK, start, end, isAll, selectedField, groupFilters, offset, limit, viewType === 5 ? 'yes' : false, requestOptions));
      }
    }
  }, [enter]);

  useEffect(() => {
    // let isMounted = true;
    // if (isMounted) {
    setResourceLoading(true);
    if (ppmGroupInfo && ppmGroupInfo.data && ppmGroupInfo.data.length && ppmGroupInfo.data.length > 0) {
      const { endDate } = viewModal;
      const rsrces = getResources(ppmGroupInfo.data);
      viewModal.setResources(rsrces);
      // if (rsrces && !rsrces.length) {
      setResourceLoading(false);
      // }
      viewModal.setEvents(getEventData(ppmGroupInfo.data, userInfo, endDate));
      setCalendarData(Math.random());
    } else {
      viewModal.setResources(getResources([]));
      viewModal.setEvents(getEventData([]));
      setResourceLoading(false);
      setCalendarData(Math.random());
    }
    // }
    // return () => { isMounted = false; };
  }, [ppmGroupInfo]);

  const prevClick = (sdata) => {
    if (!loading) {
      sdata.prev();
      setViewModal(sdata);
      setOffset(0);
      setPage(1);
      setEnter(Math.random());
    }
  };

  const nextClick = (sdata) => {
    if (!loading) {
      sdata.next();
      setViewModal(sdata);
      setEnter(Math.random());
    }
  };

  const prevClickCustom = () => {
    const sdata = viewModal;
    sdata.prev();
    setViewModal(sdata);
    setOffset(0);
    setPage(1);
    setEnter(Math.random());
  };

  const nextClickCustom = () => {
    const sdata = viewModal;
    sdata.next();
    setViewModal(sdata);
    setOffset(0);
    setPage(1);
    setEnter(Math.random());
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
    setPage(1);
    setEnter(Math.random());
  };

  const onSelectDate = (sdata, date) => {
    sdata.setDate(date);
    setViewModal(sdata);
    setOffset(0);
    setPage(1);
    setEnter(Math.random());
  };

  const clickedEvent = (sdata, event) => {
    dispatch(getPPMDetail(companies, appModels.PPMWEEK, event.dataId));
    setEventModal(true);
  };

  useEffect(() => {
    if (uuid) {
      dispatch(getPPMDetail(companies, appModels.PPMWEEK, uuid));
      setEventModal(true);
    }
  }, [uuid]);

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

  const handleDateChange = () => {
    const today = moment();
    const sdata = viewModal;
    sdata.setDate(today);
    setViewModal(sdata);
    setOffset(0);
    setPage(1);
    setEnter(Math.random());
  };

  function getNameOnHover(name) {
    let nameOnPopOver = '';
    const getChecklistDisplayName = name.split('|');
    nameOnPopOver = getChecklistDisplayName[0];
    return name;
  }
  function getName(slotName) {
    let displayReturnSlotName = '';
    const returnSlotName = slotName.split('|');
    displayReturnSlotName = returnSlotName[1];
    return displayReturnSlotName;
  }

  const eventItemPopoverTemplateResolver = (data, eventItem, title, start, end, statusColor) => {
    let showData = [];
    eventItem.is_service_report_required ? showData = [
      {
        value: eventItem.performed_by,
        property: 'Type',
      },
      {
        value: eventItem.type === 'Space' ? eventItem.space_name : getNameOnHover(eventItem.slotName),
        property: eventItem.type,
      },
      {
        value: eventItem.schedule,
        property: 'Schedule',
      },
      {
        property: 'Maintenance Team',
        value: eventItem.maintenance_team,
      },
      {
        property: 'Reference Number',
        value: eventItem.type === 'Space' ? eventItem.asset_code : eventItem.location,
      },
      {
        property: 'On-Hold Requested',
        value: eventItem.is_on_hold_requested ? 'Yes' : 'No',
      },
      {
        property: 'Service Report Required',
        value: eventItem.is_service_report_required ? 'Yes' : 'No',
      },
      {
        property: 'Prepone/Postpone Requested',
        value: eventItem.is_pending_for_approval ? 'Yes' : 'No',
      },
      {
        property: 'PPM Cancellation Requested',
        value: eventItem.is_cancellation_requested ? 'Yes' : 'No',
      },
      {
        property: 'Is Rescheduled',
        value: eventItem.is_rescheduled ? 'Yes' : 'No',
      },
      {
        property: 'Compliance Type',
        value: eventItem.compliance_type ? eventItem.compliance_type : '-',
      },
      {
        property: 'Review Status',
        value: eventItem.review_status && eventItem.review_status === 'Done' ? 'Reviewed' : 'Not Reviewed',
      },
      {
        property: 'Signed off Status',
        value: eventItem.is_signed_off ? 'Done' : 'Not Done',
      },
      ...(eventItem.performed_by === 'External'
        ? [{ property: 'Vendor', value: eventItem.vendor_name }]
        : []),
    ]
      : showData = [
        {
          value: eventItem.performed_by,
          property: 'Type',
        },
        {
          value: eventItem.type === 'Space' ? eventItem.space_name : getNameOnHover(eventItem.slotName),
          property: eventItem.type,
        },
        {
          value: eventItem.schedule,
          property: 'Schedule',
        },
        {
          property: 'Maintenance Team',
          value: eventItem.maintenance_team,
        },
        {
          property: 'Reference Number',
          value: eventItem.type === 'Space' ? eventItem.asset_code : eventItem.location,
        },
        {
          property: 'On-Hold Requested',
          value: eventItem.is_on_hold_requested ? 'Yes' : 'No',
        },
        {
          property: 'Prepone/Postpone Requested',
          value: eventItem.is_pending_for_approval ? 'Yes' : 'No',
        },
        {
          property: 'PPM Cancellation Requested',
          value: eventItem.is_cancellation_requested ? 'Yes' : 'No',
        },
        {
          property: 'Is Rescheduled',
          value: eventItem.is_rescheduled ? 'Yes' : 'No',
        },
        {
          property: 'Compliance Type',
          value: eventItem.compliance_type,
        },
        {
          property: 'Review Status',
          value: eventItem.review_status && eventItem.review_status === 'Done' ? 'Reviewed' : 'Not Reviewed',
        },
        {
          property: 'Signed off Status',
          value: eventItem.is_signed_off ? 'Done' : 'Not Done',
        },
        ...(eventItem.performed_by === 'External'
          ? [{ property: 'Vendor', value: eventItem.vendor_name }]
          : []),
      ];
    return (
      <div className="ant-popover-inner-content">
        <div style={{ width: '350px' }}>
          <div className="ant-row-flex ant-row-flex-middle">
            <div className="ant-col ant-col-22">
              <Row>
                <Col sm="12" md="12" lg="12" className="mb-2">
                  <div style={{ display: 'flex' }}>
                    <div className="status-dot mt-1" style={{ backgroundColor: statusColor }} />
                    <div className="ant-col ant-col-22" style={{ wordBreak: 'break-word' }}>
                      <span className="header2-text" title={title} style={{ marginLeft: '7px', color: eventItem.color }}>{getNameOnHover(eventItem.displayName)}</span>
                    </div>
                  </div>
                </Col>
                <Col sm="12" md="12" lg="12">
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
                    {/* {eventItem.performed_by ? (<span style={{ marginLeft: '7px' }} className="badge-text no-border-radius badge badge-blue badge-pill">{eventItem.performed_by}</span>) : ''} */}
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
                          width: '50%',
                          font: 'normal normal normal 12px Suisse Intl',
                          color: '#6A6A6A',
                        }}
                      >
                        {data?.property}
                      </Typography>
                      <Typography
                        sx={{
                          width: '50%',
                          font: 'normal normal normal 12px Suisse Intl',
                          color: '#000000',
                        }}
                      >
                        {data?.value}
                      </Typography>
                    </Box>
                  ))}
                </Col>
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

  const handleStatusDeselectChange = (value) => {
    setSelectedFilter(selectedFilter.filter((item) => item !== value));
    dispatch(getDashboardFilters(false));
    setStatusFilter(true);
  };

  const handleStatusClear = () => {
    setSelectedFilter([]);
    dispatch(getDashboardFilters(false));
    setFilterApply(Math.random());
    setStatusFilter(false);
    setOffset(0);
    setPage(1);
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
    setGroupFilter(false);
    setOffset(0);
    setPage(1);
  };

  const handleFilterClear = () => {
    setSelectedField(null);
    setGroupData([]);
    setSelectedGroupFilters([]);
    dispatch(getDashboardFilters(false));
    setGroupFilter(false);
    setOffset(0);
    setPage(1);
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

  const onChangeFilters = () => {
    setFilterApply(Math.random());
    setStatusFilter(false);
    setGroupFilter(false);
    setOffset(0);
    setPage(1);
  };

  const onAddPPMs = () => {
    history.push({ pathname: '/preventive-overview/add-ppms' });
  };

  const handleStatusChangeInfo = (options) => {
    if (options.length) {
      setSelectedGroupFilters(getColumnArrayById(options, selectedField === 'schedule_period_name' ? 'value' : selectedField === 'maintenance_team_id' ? 'value' : selectedField === 'vendor_name' ? 'value' : 'asset_name'));
    } else {
      setSelectedGroupFilters([]);
    }
  };

  const handleCustomChangeInfo = (options) => {
    const lastOne = options[options.length - 1];
    const dropdownValues = states;
    const isAll = lastOne && lastOne.value === 'All';
    if (!isAll && options.length && dropdownValues.some((ai) => getColumnArrayById(options, 'value').includes(ai))) {
      const notAll = options && options.length && options.filter((obj) => obj.value !== 'All');
      setSelectedFilter(getColumnArrayById(notAll, 'value'));
      setStatusOptions(notAll);
    } else {
      setStatusOptions([{ value: 'All', label: 'All' }]);
      setSelectedFilter(['All']);
    }
  };

  const handleCustomFieldChangeInfo = (options) => {
    setSelectedGroupFilters([]);
    setCustomOptions(options);
    setSelectedField(options ? options.value : false);
    setCustomSelectedOptions([]);
  };

  const onClearRequestOptions = (options, field) => {
    setRequestOptions(options.filter((data) => data.field !== field));
  };

  const ongetRequestOptions = (options, field) => {
    const opt = options && options.length ? options.filter((data) => data.field === field) : [];
    return opt && opt.length ? opt[0] : '';
  };

  const requestStatus = [{ value: 'Yes', label: 'Yes', field: 'is_on_hold_requested' }, { value: 'No', label: 'No', field: 'is_on_hold_requested' }];

  const prepostponeStatus = [{ value: 'Yes', label: 'Yes', field: 'is_pending_for_approval' }, { value: 'No', label: 'No', field: 'is_pending_for_approval' }];

  const cancelReqStatus = [{ value: 'Yes', label: 'Yes', field: 'is_cancellation_requested' }, { value: 'No', label: 'No', field: 'is_cancellation_requested' }];

  const reScheduleStatus = [{ value: 'Yes', label: 'Yes', field: 'is_rescheduled' }, { value: 'No', label: 'No', field: 'is_rescheduled' }];

  const complainceTypeStatus = [{ value: 'Statutory', label: 'Statutory', field: 'compliance_type' }, { value: 'Non-Statutory', label: 'Non-Statutory', field: 'compliance_type' }];

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
    onChange={(e, options) => { setStatusOptions(options); handleCustomChangeInfo(options); }}
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
      title: 'By Maintenance Team / Asset / Vendor/ Schedule',
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
    disableClearable={!selectedField}
    onChange={(e, options) => handleCustomFieldChangeInfo(options)}
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
      title: selectedField
        ? selectedField === 'maintenance_team_id' ? 'By Maintenance Team'
          : selectedField === 'vendor_name' ? 'By Vendor'
            : selectedField === 'schedule_period_name' ? 'By Schedule'
              : 'By Asset' : false,
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
    value={customSelectedOptions}
    onChange={(e, options) => {
      options = options.filter((data) => data.label !== 'Loading...');
      setCustomSelectedOptions(options);
      handleStatusChangeInfo(options);
    }}
    getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
    options={groupData}
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
      title: 'Compliance Type',
      component:
  <Autocomplete
    name="Compliance Type"
    label="Compliance Type"
    formGroupClassName="m-1"
    open={complainceTypeOpen}
    size="small"
    disableClearable={!requestOptions}
    onOpen={() => {
      setComplainceTypeOpen(true);
    }}
    onClose={() => {
      setComplainceTypeOpen(false);
    }}
    value={ongetRequestOptions(requestOptions, 'compliance_type')}
    onChange={(e, options) => {
      setRequestOptions((prevOptions) => {
        // Ensure prevOptions is an array
        const existingOptions = Array.isArray(prevOptions) ? prevOptions : [];

        // Append the new option if it's not already present
        return options ? [...existingOptions, options] : existingOptions;
      });
    }}
    getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
    options={complainceTypeStatus}
    renderInput={(params) => (
      <TextField
        {...params}
        variant="outlined"
        className="without-padding custom-icons"
        placeholder="Select"
        InputProps={{
          ...params.InputProps,
          endAdornment: (
            <>
              <InputAdornment position="end">
                {ongetRequestOptions(requestOptions, 'compliance_type') && (
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => onClearRequestOptions(requestOptions, 'compliance_type')}
                >
                  <BackspaceIcon fontSize="small" />
                </IconButton>
                )}

              </InputAdornment>
            </>
          ),
        }}
      />
    )}
  />,
    },
    {
      title: 'Is Rescheduled',
      component:
  <Autocomplete
    name="Rescheduled Status"
    label="Rescheduled"
    formGroupClassName="m-1"
    open={rescheduleOpen}
    size="small"
    onOpen={() => {
      setRescheduleOpen(true);
    }}
    onClose={() => {
      setRescheduleOpen(false);
    }}
    value={ongetRequestOptions(requestOptions, 'is_rescheduled')}
    onChange={(e, options) => {
      setRequestOptions((prevOptions) => {
        // Ensure prevOptions is an array
        const existingOptions = Array.isArray(prevOptions) ? prevOptions : [];

        // Append the new option if it's not already present
        return options ? [...existingOptions, options] : existingOptions;
      });
    }}
    getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
    options={reScheduleStatus}
    renderInput={(params) => (
      <TextField
        {...params}
        variant="outlined"
        className="without-padding custom-icons"
        placeholder="Select"
        InputProps={{
          ...params.InputProps,
          endAdornment: (
            <>
              <InputAdornment position="end">
                {ongetRequestOptions(requestOptions, 'is_rescheduled') && (
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => onClearRequestOptions(requestOptions, 'is_rescheduled')}
                >
                  <BackspaceIcon fontSize="small" />
                </IconButton>
                )}

              </InputAdornment>
            </>
          ),
        }}
      />
    )}
  />,
    },
    {
      title: 'Is On-Hold Requested',
      component:
  <Autocomplete
    name="Hold Request Status"
    label="On-Hold Requested"
    formGroupClassName="m-1"
    open={requestOpen}
    size="small"
    onOpen={() => {
      setRequestOpen(true);
    }}
    onClose={() => {
      setRequestOpen(false);
    }}
    value={ongetRequestOptions(requestOptions, 'is_on_hold_requested')}
    disableClearable={!requestOptions}
    onChange={(e, options) => {
      setRequestOptions((prevOptions) => {
        // Ensure prevOptions is an array
        const existingOptions = Array.isArray(prevOptions) ? prevOptions : [];

        // Append the new option if it's not already present
        return options ? [...existingOptions, options] : existingOptions;
      });
    }}
    getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
    options={requestStatus}
    renderInput={(params) => (
      <TextField
        {...params}
        variant="outlined"
        className="without-padding custom-icons"
        placeholder="Select"
        InputProps={{
          ...params.InputProps,
          endAdornment: (
            <>
              <InputAdornment position="end">
                {ongetRequestOptions(requestOptions, 'is_on_hold_requested') && (
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => onClearRequestOptions(requestOptions, 'is_on_hold_requested')}
                >
                  <BackspaceIcon fontSize="small" />
                </IconButton>
                )}

              </InputAdornment>
            </>
          ),
        }}
      />
    )}
  />,
    },
    {
      title: 'Is Prepone/Postpone Requested',
      component:
  <Autocomplete
    name="Prepone/Postpone Status"
    label="Prepone/Postpone Requested"
    formGroupClassName="m-1"
    open={prepostPoneOpen}
    size="small"
    disableClearable={!requestOptions}
    onOpen={() => {
      setPrepostPoneOpen(true);
    }}
    onClose={() => {
      setPrepostPoneOpen(false);
    }}
    value={ongetRequestOptions(requestOptions, 'is_pending_for_approval')}
    onChange={(e, options) => {
      setRequestOptions((prevOptions) => {
        // Ensure prevOptions is an array
        const existingOptions = Array.isArray(prevOptions) ? prevOptions : [];

        // Append the new option if it's not already present
        return options ? [...existingOptions, options] : existingOptions;
      });
    }}
    getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
    options={prepostponeStatus}
    renderInput={(params) => (
      <TextField
        {...params}
        variant="outlined"
        placeholder="Select"
        className="without-padding custom-icons"
        InputProps={{
          ...params.InputProps,
          endAdornment: (
            <>
              <InputAdornment position="end">
                {ongetRequestOptions(requestOptions, 'is_pending_for_approval') && (
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => onClearRequestOptions(requestOptions, 'is_pending_for_approval')}
                >
                  <BackspaceIcon fontSize="small" />
                </IconButton>
                )}

              </InputAdornment>
            </>
          ),
        }}
      />
    )}
  />,
    },
    {
      title: 'Is Cancellation Requested',
      component:
  <Autocomplete
    name="Cancellation Status"
    label="Cancellation Requested"
    formGroupClassName="m-1"
    disableClearable={!requestOptions}
    open={requestCancelOpen}
    size="small"
    onOpen={() => {
      setRequestCancelOpen(true);
    }}
    onClose={() => {
      setRequestCancelOpen(false);
    }}
    value={ongetRequestOptions(requestOptions, 'is_cancellation_requested')}
    onChange={(e, options) => {
      setRequestOptions((prevOptions) => {
        // Ensure prevOptions is an array
        const existingOptions = Array.isArray(prevOptions) ? prevOptions : [];

        // Append the new option if it's not already present
        return options ? [...existingOptions, options] : existingOptions;
      });
    }}
    getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
    options={cancelReqStatus}
    renderInput={(params) => (
      <TextField
        {...params}
        variant="outlined"
        placeholder="Select"
        className="without-padding custom-icons"
        InputProps={{
          ...params.InputProps,
          endAdornment: (
            <>
              <InputAdornment position="end">
                {ongetRequestOptions(requestOptions, 'is_cancellation_requested') && (
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => onClearRequestOptions(requestOptions, 'is_cancellation_requested')}
                >
                  <BackspaceIcon fontSize="small" />
                </IconButton>
                )}

              </InputAdornment>
            </>
          ),
        }}
      />
    )}
  />,
    },
  ];

  useEffect(() => {
    const classData = document.getElementsByClassName('ant-row-flex-middle')[0].children[2];
    classData.classList.add('col-md-7');
  }, []);

  useEffect(() => {
    const classData = document.getElementsByClassName('ant-row-flex-middle')[0].children[2];
    if (showReset) {
      classData.classList.replace('col-md-7', 'col-md-6');
    } else {
      classData.classList.replace('col-md-6', 'col-md-7');
    }
  }, [customFilters]);

  const handleResetClick = () => {
    dispatch(resetPPMhecklistExport([]));
    setSelectedGroupFilters([]);
    setFilterOpen(false);
    setSelectedFilter(['All']);
    setStatusFilter(false);
    setGroupFilter(false);
    setOffset(0);
    setPage(1);
    setSelectedField(null);
    setRequestOptions('');
    const obj = {
      statusOptions: [{ value: 'All', label: 'All' }],
      customOptions: '',
      customSelectedOptions: [],
      requestOptions: '',
    };
    setCustomFilters(obj);
    setFilterApply(Math.random());
  };

  const isExportDisabled = (ppmGroupInfo && ppmGroupInfo.data && ppmGroupInfo.data.length === 0) || (ppmGroupInfo && ppmGroupInfo.data === null);

  const rightCustomHeaders = (
    <>
      <span />
      {!assetName && (
        <>
          {/* <Button
            type="button"
            style={{
              color: 'white'
            }}
            onClick={() => onAddPPMs()}
            variant="contained"
            className="mr-2"
          >
            Create PPM Schedules
          </Button> */}
          <MuiTooltip title="Copy External URL">
            <IconButton
              className="header-link-btn"
              color="primary"
              onClick={() => showCopyUrl(true)}
            >
              {' '}
              <RxCopy size={19} color={AddThemeColor({}).color} />
              {' '}
            </IconButton>
          </MuiTooltip>
          <MuiTooltip title="Refresh">
            <IconButton
              className="header-link-btn"
              color="primary"
              onClick={() => {
                setOffset(0);
                setPage(1);
                setFilterApply(Math.random());
                setFetchTime(Math.random());
              }}
              disabled={loading}
            >
              {' '}
              <RxReload size={19} color={AddThemeColor({}).color} />
              {' '}
            </IconButton>
          </MuiTooltip>
          <IconButton
            className="header-filter-btn col-md-1"
            onClick={() => setFilterOpen(true)}
            color="primary"
            disabled={loading}
          >
            <FilterAltOutlinedIcon
              size={15}
              style={{ color: AddThemeColor({}).color, marginRight: '3px' }}
            />
            <span className="my-1 ml-1" style={{ color: AddThemeColor({}).color }}>
              Filters
            </span>
          </IconButton>
          {showReset && (
          <IconButton className="header-filter-btn" onClick={() => { handleResetClick(); setReload(Math.random()); }} disabled={loading}>
            <IoCloseOutline size={25} style={{ marginRight: '3px' }} />
            Reset
          </IconButton>
          )}
          <IconButton className="header-filter-btn col-md-1" color="primary" onClick={() => setShowExport(true)} disabled={isExportDisabled || loading}>
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
    const checklistDisplayName = event.displayName;
    const getChecklistDisplayName = checklistDisplayName.split('|');
    const checklistDisplayNameOnCalendar = checklistDisplayName;

    const roundCls = 'round-all';
    const backgroundColor = event.bgColor;
    let image = '';
    let margin;

    if (sdata.viewType === ViewTypes.Custom) {
      margin = '';
    } else {
      margin = 'ml-2';
    }

    const titleText = sdata.behaviors.getEventTextFunc(sdata, event);

    if (event.status === '1') {
      image = <img alt="completed" src={completed} width="17" height="17" className={`${margin} cursor-pointer`} />;
    } else if (event.status === '2') {
      image = <img alt="missed" src={missed} width="17" height="17" className={`${margin} cursor-pointer`} />;
    } else if (event.status === '4') {
      image = <img alt="upcoming" src={upcoming} width="17" height="17" className={`${margin} cursor-pointer`} />;
    } else if (event.status === '3') {
      image = <img alt="inprogress" src={inProgress} width="17" height="17" className={`${margin} cursor-pointer`} />;
    } else if (event.status === '5') {
      image = <img alt="inprogress" src={pauseIcon} width="17" height="17" className={`${margin} cursor-pointer`} />;
    } else if (event.status === '6') {
      image = <img alt="cancelled" src={cancelled} width="17" height="17" className={`${margin} cursor-pointer`} />;
    } else if (event.status === '7') {
      image = <span className={`${margin} cursor-pointer`}><StatusDot color={event.color} size={15} /></span>;
    }

    let divStyle = {
      backgroundColor, color: event.color, height: mustBeHeight, paddingLeft: '5px',
    };
    if (agendaMaxEventWidth) divStyle = { ...divStyle, maxWidth: agendaMaxEventWidth };
    let events = '';

    if (sdata.viewType === ViewTypes.Custom) {
      events = (
        <div key={event.id} className={`${roundCls} event-item`} style={divStyle}>
          {'   '}
          {image}
          {'   '}
          <span className="font-11 ml-1" style={{ lineHeight: `${mustBeHeight}px` }}>
            {/* {titleText}            */}
            {checklistDisplayNameOnCalendar}
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
        <div key={event.id} className={`${roundCls} event-item`} style={divStyle}>
          {image}
          {' '}
          <span className="font-11 ml-1" style={{ className: 'modules', lineHeight: `${mustBeHeight}px` }}>
            {checklistDisplayNameOnCalendar}
          </span>
        </div>
      );
    }

    return events;
  };

  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsetValue = (index - 1) * limit;
    setOffset(offsetValue);
    setPage(index);
  };

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
  const exportLoading = (ppmChecklistExportInfo && ppmChecklistExportInfo.loading) || (ppmChecklistLoading);

  const onApplyFilters = () => {
    setFilterOpen(false);

    setFilterApply(Math.random());
    setStatusFilter(false);
    setGroupFilter(false);
    setOffset(0);
    setPage(1);

    const obj = {
      statusOptions,
      customOptions,
      customSelectedOptions,
      requestOptions,
    };
    setCustomFilters(obj);
    setSelectedField(customOptions ? customOptions.value : '');
  };

  const onCloseFilters = () => {
    setFilterOpen(false);
    setStatusOptions(customFilters.statusOptions);
    setRequestOptions(customFilters.requestOptions ? customFilters.requestOptions : '');
    setCustomOptions(customFilters.customOptions);
    setCustomSelectedOptions(customFilters.customSelectedOptions);
    setSelectedField(customFilters.customOptions ? customFilters.customOptions.value : '');
  };

  useEffect(() => {
    if (!assetName) {
      setStatusOptions(customFilters.statusOptions ? customFilters.statusOptions : []);
      setRequestOptions(customFilters.requestOptions ? customFilters.requestOptions : '');
      setCustomOptions(customFilters.customOptions ? customFilters.customOptions : '');
      setCustomSelectedOptions(customFilters.customSelectedOptions ? customFilters.customSelectedOptions : []);
    }
  }, [customFilters]);

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
          rightCustomHeader={rightCustomHeaders}
        />
        {popover}
        {loading && assetName && (
          <Card>
            <CardBody className="">
              <Loader />
            </CardBody>
          </Card>
        )}
        {loading && !assetName && (
        <div className="loader" data-testid="loading-case">
          <Loader />
        </div>
        )}
        {((ppmGroupInfo && ppmGroupInfo.err) || isUserError) && (
          <ErrorContent errorTxt={errorMsg} />
        )}
        {(ppmGroupInfo && ppmGroupInfo.data && ppmGroupInfo.data.length === 0 && !ppmGroupInfo.err) && (
          <ErrorContent errorTxt="No data" />
        )}
        <EventDetails eventDetailModel={eventModal} atFinish={() => setEventModal(false)} />
      </div>
      {loading || pages === 0 ? (<span />) : (
        <div className="margin-center p-2">
          <Pagination count={pages} page={page} size="small" color="primary" onChange={handlePageClick} showFirstButton showLastButton />
        </div>
      )}
      {!assetName && (
      <Popover placement="left" isOpen={popoverOpen} className="popoverQuestion" target="PopoverHelp">
        <PopoverBody className="pr-0 pl-2">
          <div className="ml-1 popover_line">
            <img alt="missed" src={missed} height="17" className="cursor-pointer mr-1" />
            <small className="text-missed-inspection mr-4 font-weight-600">Missed</small>
            <br />
            <img alt="inprogress" src={inProgress} height="17" className="cursor-pointer mr-1" />
            <small className="text-yellow mr-4 font-weight-600">In Progress</small>
            <br />
            <img alt="inprogress" src={pauseIcon} height="17" className="cursor-pointer mr-1" />
            <small className="text-ppm-warning mr-4 font-weight-600">On-Hold</small>
            <br />
            <img alt="completed" src={completed} height="17" className="cursor-pointer mr-1" />
            <small className="text-green mr-4 font-weight-600">Completed</small>
            <br />
            <img alt="upcoming" src={upcoming} height="17" className="cursor-pointer mr-1" />
            <small className="text-blue font-weight-600">Upcoming</small>
            <br />
            <img alt="cancelled" src={cancelled} height="17" className="cursor-pointer mr-1" />
            <small className="text-cancelled font-weight-600">Cancelled</small>
            <br />
            <span className="cursor-pointer mr-1"><StatusDot size={15} /></span>
            <small className="text-cancelled font-weight-600">Approval Pending</small>
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
      <Drawer
        PaperProps={{
          sx: { width: '30%' },
        }}
        anchor="right"
        open={copyUrl}
      >
        <DrawerHeader
          headerName="Copy External URL"
          imagePath={false}
          onClose={() => showCopyUrl(false)}
        />
        <CopyExternalUrl />
      </Drawer>
      <DataExport
        afterReset={() => dispatch(setInitialValues(false, false, false, false))}
        fields={[]}
        selectedFilter={selectedFilter}
        selectedField={selectedField}
        viewModal={viewModal}
        groupFilters={groupFilters}
        customDataGroup={groupData}
        exportType={exportType}
        exportTrue={exportTrue}
        isFilterApply={isFilterApply}
        viewHead={viewHead}
        requestOptions={requestOptions}
        showExport={showExport}
      />
      <ExportDrawer
        showExport={showExport}
        setShowExport={setShowExport}
        setExportTrue={setExportTrue}
        setExportType={setExportType}
        loading={exportLoading || ppmChecklistExportInfo?.loading}
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
