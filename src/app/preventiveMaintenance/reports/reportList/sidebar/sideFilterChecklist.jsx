/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable consistent-return */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
/* eslint-disable radix */
import React, { useState, useEffect, useMemo } from 'react';
import moment from 'moment-timezone';
import { DatePicker } from 'antd';
import {
  FormGroup,
  FormFeedback,
} from 'reactstrap';
import {
  TextField, CircularProgress,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';
import { useSelector, useDispatch } from 'react-redux';
import {
  Checkbox,
  Drawer,
  FormControlLabel,
  Dialog, DialogContent, DialogContentText,
} from '@mui/material';
import SearchModalSingleStatic from '@shared/searchModals/singleSearchModelStatic';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';

import {
  getTypeId,
  getInspectionOrders, resetInspectionOrders, getSelectedReportDate, getEquipmentSpaceByBlockICR, resetEquipmentSpaceByBlockICR, getMaintenanceTeam, resetTeam,
} from '../../../ppmService';
import {
  getBuildings,
} from '../../../../assets/equipmentService';
import customData from '../../data/customData.json';
import {
  generateErrorMessage,
  getAllowedCompanies,
  getArrayFromValuesById,
  isArrayColumnExists,
  getColumnArrayById,
  getArrayToCommaValues,
  getDatesOfQueryReport,
  getCompanyTimezoneDate,
  getDateAndTimeForReportsLocalDate,
} from '../../../../util/appUtils';
import preventiveActions from '../../../data/preventiveActions.json';
import SearchModalSingle from './searchModalSingle';
import SearchModalMultiple from './searchModalMultiple';
import { getInspectionCommenceDate } from '../../../../inspectionSchedule/inspectionService';
import ReportsFilterDrawer from '../../../../commonComponents/reportsFilterDrawer';
import DialogHeader from '../../../../commonComponents/dialogHeader';

const appModels = require('../../../../util/appModels').default;

const { RangePicker } = DatePicker;

const SideFilterChecklist = (props) => {
  const {
    setTableHeaders,
    tableHeaders,
    selectedDate,
    setSelectedDate,
    filterOpen,
    setFilterOpen,
    resetFilters,
    setResetFilters,
    setShowResetOption,
  } = props;
  const dispatch = useDispatch();
  const [customFilters, setCustomFilters] = useState({
    preventiveFor: 'e', scheduleValue: '', date: [null, null], spaceValue: [], equipValue: [], locationId: [], selectedDate, teamValue: '', selectedField: '',
  });
  const [statusCollapse, setStatusCollapse] = useState(true);
  const [preventiveCollapse, setPreventiveCollapse] = useState(true);
  const [date, changeDate] = useState(customFilters.date);
  const [datesValue, setDatesValue] = useState([]);
  const [preventiveFor, setPreventiveFor] = useState('e');
  const [scheduleValue, setScheduleValue] = useState(customFilters.scheduleValue);

  const [spaceCollapse, setSpaceCollapse] = useState(true);
  const [spaceOpen, setSpaceOpen] = useState(false);
  const [spaceKeyword, setSpaceKeyword] = useState('');

  const [equipmentCollapse, setEquipmentCollapse] = useState(true);
  const [equipmentOpen, setEquipmentOpen] = useState(false);
  const [equipmentKeyword, setEquipmentKeyword] = useState('');

  const [spaceOptions, setSpaceOptions] = useState([]);
  const [equipmentOptions, setEquipmentOptions] = useState([]);

  const [selectedField, setSelectedField] = useState('');
  const [customOpen, setCustomOpen] = useState(false);
  const [customOptions, setCustomOptions] = useState('');

  const [teamValue, setTeamValue] = useState([]);
  const [teamkeyword, setTeamkeyword] = useState('');
  const [teamOpen, setTeamOpen] = useState(false);
  const [teamOptions, setTeamOptions] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [oldValues, setOldValues] = useState([]);
  const [extraModal1, setExtraModal1] = useState(false);

  const [addColumcCollapse, setAddColumnsCollapse] = useState(true);

  const [spaceValue, setSpaceValue] = useState(customFilters.scheduleValue);
  const [equipValue, setEquipValue] = useState(customFilters.equipValue);

  const [blockCollapse, setBlockCollapse] = useState(true);
  const [blockOpen, setBlockOpen] = useState(false);
  const [blockKeyword, setBlockKeyword] = useState('');
  const [locationId, setLocationId] = useState(customFilters.locationId);
  const [blockOptions, setBlockOptions] = useState([]);
  // const [selectedDate, setSelectedDate] = useState('%(today)s');
  const [extraModal, setExtraModal] = useState(false);
  const [extraMultipleModal, setExtraMultipleModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [columns, setColumns] = useState([]);
  const [commenceDate, setCommenceDate] = useState(new Date());

  const { userInfo } = useSelector((state) => state.user);

  const { inspectionassetSpaceInfo, teamInfo } = useSelector((state) => state.ppm);
  const { inspectionCommenceInfo } = useSelector((state) => state.inspection);

  const { buildingsInfo } = useSelector((state) => state.equipment);

  const companies = getAllowedCompanies(userInfo);

  function isAssociativeArray(arr) {
    let result = arr;
    if (isArrayColumnExists(arr, 'id')) {
      result = getColumnArrayById(arr, 'id');
    }
    return result;
  }

  useEffect(() => {
    if (userInfo && userInfo.data && selectedField === 'maintenance_team_id' && selectedDate && (selectedDate === '%(custom)s' || selectedDate === 'Custom') && (date && date.length && date[0] !== null && date[1] !== null)) {
      let start = '';
      let end = '';
      if (date && date[0] && date[0] !== null) {
        start = moment(date[0].toDate()).format('YYYY-MM-DD');
        end = moment(date[1].toDate()).format('YYYY-MM-DD');
      }
      const type = preventiveFor === 'e' ? 'Equipment' : 'Space';
      dispatch(getMaintenanceTeam(start, end, type, appModels.INSPECTIONCHECKLISTLOG));
    } else if (userInfo && userInfo.data && selectedField === 'maintenance_team_id' && selectedDate && selectedDate !== 'Custom' && selectedDate !== '%(custom)s') {
      let start = '';
      let end = '';
      const dates = getDateAndTimeForReportsLocalDate(selectedDate);
      if (dates.length > 0) {
        start = dates[0];
        end = dates[1];
      }
      const type = preventiveFor === 'e' ? 'Equipment' : 'Space';
      dispatch(getMaintenanceTeam(start, end, type, appModels.INSPECTIONCHECKLISTLOG));
    } else {
      dispatch(resetTeam());
      setTeamValue('');
      setEquipValue([]);
      setEquipmentOptions([]);
    }
  }, [selectedField, selectedDate, date, preventiveFor]);

  useMemo(() => {
    const isValidSelection = userInfo?.data?.company
    && selectedDate && selectedDate !== 'Custom' && selectedDate !== '%(custom)s'
    && preventiveFor
    && ((spaceValue?.length > 0) || (equipValue?.length > 0) || selectedField === 'maintenance_team_id');
    if (isValidSelection && (selectedField === 'asset_name' || (selectedField === 'maintenance_team_id' && teamValue && teamValue !== ''))) {
      let start = '';
      let end = '';
      const assetId = preventiveFor === 'e' ? getColumnArrayById(equipValue, 'id') : getColumnArrayById(spaceValue, 'id');
      const mteam = teamValue && teamValue.id ? [teamValue.id]: [];
      const dates = getDateAndTimeForReportsLocalDate(selectedDate);
      if (dates.length > 0) {
        start = dates[0];
        end = dates[1];
      }
      dispatch(getSelectedReportDate(getDatesOfQueryReport(selectedDate, userInfo)));
      dispatch(getInspectionOrders(start, end, preventiveFor, assetId, commenceDate, mteam));
    }
  }, [JSON.stringify(customFilters)]);

  useEffect(() => {
    if (userInfo && userInfo.data && userInfo.data.company && date === undefined) {
      if (userInfo.data.timezone) {
        const todayDate = getCompanyTimezoneDate(new Date(), userInfo, 'datetimesecs');
        changeDate(todayDate);
      }
    }
  }, [userInfo, date]);

  useMemo(() => {
    const isValidSelection = userInfo?.data?.company
        && selectedDate
        && (selectedDate === '%(custom)s' || selectedDate === 'Custom')
        && date?.length
        && date[0] !== null
        && date[1] !== null
        && preventiveFor
        && ((spaceValue?.length > 0) || (equipValue?.length > 0) || selectedField === 'maintenance_team_id');

    if (isValidSelection && (selectedField === 'asset_name' || (selectedField === 'maintenance_team_id' && teamValue && teamValue !== ''))) {
      const start = moment(date[0].toDate()).format('YYYY-MM-DD');
      const end = moment(date[1].toDate()).format('YYYY-MM-DD');

      const assetId = preventiveFor === 'e'
        ? getColumnArrayById(equipValue, 'id')
        : getColumnArrayById(spaceValue, 'id');
 const mteam = teamValue && teamValue.id ? [teamValue.id]: [];
      const calendarSelectedFirstDay = moment(date[0].toDate()).format('YYYY-MM-DD');
      const calendarSelectedLastDay = moment(date[1].toDate()).format('YYYY-MM-DD');

      const selectedReportDate = `${getCompanyTimezoneDate(
        calendarSelectedFirstDay,
        userInfo,
        'date',
      )} - ${getCompanyTimezoneDate(calendarSelectedLastDay, userInfo, 'date')}`;
      dispatch(getSelectedReportDate(selectedReportDate));
      dispatch(getInspectionOrders(start, end, preventiveFor, assetId, commenceDate, mteam));
    }
  }, [JSON.stringify(customFilters)]);

  const handleCheckboxChange = (event) => {
    changeDate([null, null]);
    setSelectedDate(event.target.value);
    dispatch(getTypeId({
      preventiveFor, scheduleValue, date, spaceValue, equipValue, locationId, selectedDate: event.target.value, teamValue, selectedField,
    }));
    setDatesValue([]);
  };

  useEffect(() => {
    dispatch(resetEquipmentSpaceByBlockICR());
    dispatch(getTypeId({
      preventiveFor, scheduleValue, date, spaceValue, equipValue, locationId, selectedDate,
    }));
    dispatch(getInspectionCommenceDate(companies, appModels.INSPECTIONCONFIG));
  }, []);

  useEffect(() => {
    if (inspectionCommenceInfo && inspectionCommenceInfo.data) {
      setCommenceDate(new Date(inspectionCommenceInfo.data[0].inspection_commenced_on));
    }
  }, [inspectionCommenceInfo]);

  useEffect(() => {
    if (teamInfo && teamInfo.data && teamInfo.data.length) {
      setTeamOptions(getArrayFromValuesById(teamInfo.data, isAssociativeArray(teamValue || []), 'id'));
    } else if (teamInfo && teamInfo.loading) {
      setTeamOptions([{ name: 'Loading...' }]);
    } else {
      setTeamOptions([]);
    }
  }, [teamInfo]);

  useEffect(() => {
    if (buildingsInfo && buildingsInfo.data && buildingsInfo.data.length && blockOpen) {
      setBlockOptions(getArrayFromValuesById(buildingsInfo.data, isAssociativeArray(locationId || []), 'id'));
    } else if (buildingsInfo && buildingsInfo.loading) {
      setBlockOptions([{ path_name: 'Loading...' }]);
    } else {
      setBlockOptions([]);
    }
  }, [buildingsInfo, blockOpen]);

  useEffect(() => {
    if (inspectionassetSpaceInfo && inspectionassetSpaceInfo.data && inspectionassetSpaceInfo.data.length && spaceOpen) {
      setSpaceOptions(getArrayFromValuesById(inspectionassetSpaceInfo.data, isAssociativeArray(spaceValue || []), 'id'));
    } else if (inspectionassetSpaceInfo && inspectionassetSpaceInfo.loading) {
      setSpaceOptions([{ space_name: 'Loading...' }]);
    } else {
      setSpaceOptions([]);
    }
  }, [inspectionassetSpaceInfo, spaceOpen]);

  useEffect(() => {
    if (inspectionassetSpaceInfo && inspectionassetSpaceInfo.data && inspectionassetSpaceInfo.data.length && equipmentOpen) {
      setEquipmentOptions(getArrayFromValuesById(inspectionassetSpaceInfo.data, isAssociativeArray(equipValue || []), 'id'));
    } else if (inspectionassetSpaceInfo && inspectionassetSpaceInfo.loading) {
      setEquipmentOptions([{ name: 'Loading...' }]);
    } else {
      setEquipmentOptions([]);
    }
  }, [inspectionassetSpaceInfo, equipmentOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && blockOpen) {
        await dispatch(getBuildings(companies, appModels.SPACE, blockKeyword));
      }
    })();
  }, [userInfo, blockKeyword, blockOpen]);

  useEffect(() => {
    if (userInfo && userInfo.data && preventiveFor && locationId && locationId.length > 0) {
      const filterValue = getArrayToCommaValues(locationId, 'id');
      const type = preventiveFor === 'ah' ? 'space' : 'equipment';
      dispatch(getEquipmentSpaceByBlockICR(filterValue, type));
    }
  }, [userInfo, locationId, preventiveFor]);

  function getStartTime(startDate) {
    let res = new Date();
    if (startDate) {
      res = new Date(startDate);
      res.setHours(0);
      res.setMinutes(0);
      res.setSeconds(0);
    }
    return res;
  }

  function getEndTime(endDate) {
    let res = new Date();
    if (endDate) {
      res = new Date(endDate);
      res.setHours(23);
      res.setMinutes(59);
      res.setSeconds(59);
    }
    return res;
  }

  // useEffect(() => {
  //   if ((userInfo && userInfo.data && userInfo.data.company) && (date && date.length) && (preventiveFor) && ((spaceValue && spaceValue.length > 0) || (equipValue && equipValue.length > 0))) {
  //     let start = '';
  //     let end = '';
  //     const assetId = preventiveFor === 'e' ? getColumnArrayById(equipValue, 'id') : getColumnArrayById(spaceValue, 'id');
  //     if (date && date[0] && date[0] !== null) {
  //       start = `${moment(getStartTime(date[0])).utc().format('YYYY-MM-DD')} 23:59:59`;
  //       end = `${moment(getEndTime(date[1])).utc().format('YYYY-MM-DD')} 23:59:59`;
  //     }
  //     dispatch(getSelectedReportDate(getDatesOfQueryReport(selectedDate, userInfo)));
  //     dispatch(getInspectionOrders(start, end, preventiveFor, assetId, commenceDate));

  //   }
  // }, [userInfo, date, preventiveFor, spaceValue, equipValue]);

  function getDifferece(date1, date2) {
    // const date1 = new Date();
    const DifferenceInTime = date2.getTime() - date1.getTime();
    const DifferenceInDays = DifferenceInTime / (1000 * 3600 * 24);
    return DifferenceInDays;
  }

  const disabledDate = (current) => {
    if (!datesValue || datesValue.length === 0) {
      return false;
    }
    let disable = false;
    const subnoofdays = commenceDate ? getDifferece(new Date(datesValue[0]), new Date(commenceDate)) : 0;
    if (subnoofdays > 0 && subnoofdays < 60) {
      const days = Math.abs(subnoofdays);
      const tooLates = datesValue && datesValue.length && datesValue[0] && current.diff(datesValue[0], 'days') > (days + 1);
      const tooEarlys = datesValue && datesValue.length && datesValue[1] && datesValue[1].diff(current, 'days') > (days + 1);
      disable = tooEarlys || tooLates;
    } else {
      const tooLate = datesValue && datesValue.length && datesValue[0] && current.diff(datesValue[0], 'days') > 60;
      const tooEarly = datesValue && datesValue.length && datesValue[1] && datesValue[1].diff(current, 'days') > 60;
      disable = tooEarly || tooLate;
    }
    return disable;
  };

  const onDateRangeChange = (dates) => {
    changeDate(dates);
    setDatesValue(dates);
    setScheduleValue('');
    dispatch(getTypeId({
      preventiveFor, scheduleValue, date: dates, spaceValue, equipValue, locationId, selectedDate, teamValue, selectedField,
    }));
  };

  const handleTimeCheckboxChange = (event) => {
    dispatch(resetEquipmentSpaceByBlockICR());
    setEquipValue([]);
    setSpaceValue([]);
    setTeamValue('');
    setScheduleValue('');
    dispatch(resetInspectionOrders());
    setPreventiveFor(event.target.value);
    dispatch(getTypeId({
      preventiveFor: event.target.value, scheduleValue, date, spaceValue: [], equipValue: [], locationId, selectedDate, teamValue, selectedField,
    }));
  };

  const onSpaceClear = () => {
    setSpaceKeyword('');
    setSpaceValue([]);
    setScheduleValue('');
    dispatch(getTypeId({
      preventiveFor, scheduleValue, date, spaceValue: [], equipValue, locationId, selectedDate, teamValue, selectedField,
    }));
    setSpaceOpen(false);
  };

  const onEquipClear = () => {
    setEquipmentKeyword('');
    setEquipValue([]);
    setScheduleValue('');
    dispatch(getTypeId({
      preventiveFor, scheduleValue, date, spaceValue, equipValue: [], locationId, selectedDate, teamValue, selectedField,
    }));
    setEquipmentOpen(false);
  };

  const onTeamClear = () => {
    setTeamkeyword('');
    setTeamValue([]);
    dispatch(getTypeId({
      preventiveFor, scheduleValue, date, spaceValue, equipValue, locationId, selectedDate, teamValue: '', selectedField,
    }));
    setTeamOpen(false);
  };

  const showTeamModal = () => {
    setExtraModal1(true);
    setFieldName('maintenance_team_id');
    setModalName('Maintenance Team');
    setColumns(['id', 'name']);
    setHeaders(['Name']);
    setOldValues(teamValue && teamValue.id ? teamValue.id : '');
  };

  const showEquipmentModal = () => {
    setModelValue(appModels.EQUIPMENT);
    setFieldName('equipment');
    setModalName('Equipments');
    setOtherFieldValue(false);
    setCompanyValue(companies);
    setExtraModal(true);
    setColumns(['id', 'name', 'location_id', 'category_id', 'block_id']);
  };

  const showSpaceModal = () => {
    setModelValue(appModels.SPACE);
    setFieldName('space');
    setModalName('Spaces');
    setOtherFieldValue(false);
    setCompanyValue(companies);
    setExtraModal(true);
    setColumns(['id', 'path_name', 'space_name', 'block_id']);
  };

  const handleResetClick = () => {
    const list = [...tableHeaders];
    list.forEach((x) => {
      if (x.valueKey) {
        x.isChecked = false;
      }
    });
    setScheduleValue();
    setCustomOptions();
    setPreventiveFor('e');
    setSelectedDate('%(today)s');
    setSpaceValue([]);
    setEquipValue([]);
    setLocationId([]);
    setTeamValue('');
    setSelectedField('');
    changeDate(undefined);
    dispatch(getSelectedReportDate(''));
    dispatch(resetInspectionOrders());
    dispatch(getTypeId({
      preventiveFor: 'e', scheduleValue: '', date: false, spaceValue: [], equipValue: [], locationId: [], selectedDate: '%(today)s', teamValue: '', selectedField: '',
    }));
  };

  const onBlockChange = (data) => {
    if (data && data.length && data.find((option) => option.path_name === 'Loading...')) {
      return false;
    }
    setLocationId(data);
    setEquipValue([]);
    setSpaceValue([]);
    dispatch(resetEquipmentSpaceByBlockICR());
    dispatch(getTypeId({
      preventiveFor, scheduleValue: '', date: false, spaceValue: [], equipValue: [], locationId: data, selectedDate, teamValue, selectedField,
    }));
  };

  const onBlockClear = () => {
    dispatch(resetEquipmentSpaceByBlockICR());
    setBlockKeyword(null);
    setLocationId([]);
    setEquipValue([]);
    setSpaceValue([]);
    setBlockOpen(false);
    dispatch(getTypeId({
      preventiveFor, scheduleValue: '', date: false, spaceValue: [], equipValue: [], locationId: [], selectedDate, teamValue, selectedField,
    }));
  };

  const showBlockModal = () => {
    setModelValue(appModels.SPACE);
    setFieldName('location_ids');
    setModalName('Block List');
    setColumns(['id', 'name', 'block_name', 'path_name', 'asset_category_id', 'space_name']);
    setOtherFieldValue(false);
    setOtherFieldName(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraModal(true);
  };

  const onBlockChangeModal = (data) => {
    setLocationId(data);
    dispatch(getTypeId({
      preventiveFor, scheduleValue: '', date: false, spaceValue: [], equipValue: [], locationId: data, selectedDate, teamValue, selectedField,
    }));
  };

  const onSpaceChange = (data) => {
    if (data && data.length && data.find((option) => option.space_name === 'Loading...')) {
      return false;
    }
    setEquipValue([]);
    setSpaceValue(data);
    setScheduleValue('');
    dispatch(getTypeId({
      preventiveFor, scheduleValue, date, spaceValue: data, equipValue, locationId, selectedDate, teamValue, selectedField,
    }));
  };

  const onScheduleChangeModal = (data) => {
    setScheduleValue(data);
    dispatch(getTypeId({
      preventiveFor, scheduleValue: data, date, spaceValue, equipValue, locationId, selectedDate, teamValue, selectedField,
    }));
  };

  const onTeamChange = (data) => {
    if (data && data.length && data.find((option) => option.name === 'Loading...')) {
      return false;
    }
    setTeamValue(data);
    if (preventiveFor === 'e') {
      setEquipValue(data.assets);
      dispatch(getTypeId({
        preventiveFor, scheduleValue, date, spaceValue, equipValue: data.assets, locationId, selectedDate, teamValue: data, selectedField,
      }));
      setSpaceValue([]);
    } else {
      dispatch(getTypeId({
        preventiveFor, scheduleValue, date, spaceValue: data.assets, equipValue, locationId, selectedDate, teamValue: data, selectedField,
      }));
      setSpaceValue(data.assets);
      setEquipValue([]);
    }
  };

  const onEquipmentChange = (data) => {
    if (data && data.length && data.find((option) => option.name === 'Loading...')) {
      return false;
    }
    setEquipValue(data);
    setSpaceValue([]);
    setScheduleValue('');
    dispatch(getTypeId({
      preventiveFor, scheduleValue, date, spaceValue, equipValue: data, locationId, selectedDate, teamValue, selectedField,
    }));
  };

  const onEquipmentChangeModal = (data) => {
    setEquipValue(data);
    setSpaceValue([]);
    setScheduleValue('');
    dispatch(getTypeId({
      preventiveFor, scheduleValue, date, spaceValue, equipValue: data, locationId, selectedDate, teamValue, selectedField,
    }));
  };

  const onSpaceChangeModal = (data) => {
    setEquipValue([]);
    setScheduleValue('');
    setSpaceValue(data);
    dispatch(getTypeId({
      preventiveFor, scheduleValue, date, spaceValue: data, equipValue, locationId, selectedDate, teamValue, selectedField,
    }));
  };

  useEffect(() => {
    if (resetFilters) {
      setResetFilters(false);
      setShowResetOption(false);
      setCustomFilters({
        preventiveFor: 'e', scheduleValue: '', date: [null, null], spaceValue: [], equipValue: [], locationId: [], selectedDate: '%(today)s', teamValue: '', selectedField: '',
      });
      handleResetClick();
      dispatch(resetInspectionOrders());
    }
  }, [resetFilters]);

  const handleFieldReset = () => {
    setPreventiveFor('e');
    setSpaceValue([]);
    setEquipValue([]);
    setLocationId([]);
    setTeamValue('');
    dispatch(getTypeId({
      preventiveFor: 'e', scheduleValue: '', date: [null, null], spaceValue: [], equipValue: [], locationId: [], selectedDate, teamValue: '', selectedField: '',
    }));
  };

  useEffect(() => {
    if (customFilters && ((customFilters.scheduleValue)
      || (customFilters.equipValue && customFilters.equipValue.length > 0)
      || (customFilters.spaceValue && customFilters.spaceValue.length > 0)
      || (customFilters.locationId && customFilters.locationId.length > 0)
      || (teamValue)
      || (customFilters.date && customFilters.date.length && customFilters.date[0] !== null && customFilters.date[1] !== null))
      || (customFilters.selectedDate !== '%(today)s')) {
      setShowResetOption(true);
    }
  }, [customFilters]);


  const filtersComponentsArray = [
    {
      title: 'BY DATE FILTER',
      component:
  <>
    {preventiveActions.reportFilterSmart.map((tp, index) => (
      <FormControlLabel
        control={(
          <Checkbox
            id={`checkboxstateaction${index}`}
            value={tp.value}
            name={tp.label}
            checked={selectedDate === tp.value}
            onChange={handleCheckboxChange}
          />
)}
        label={tp.label}
      />
    ))}
    {selectedDate === '%(custom)s' || selectedDate === 'Custom' ? (

      <div>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DateRangePicker']}>
            <DateRangePicker
              localeText={{ start: 'Start Date', end: 'End Date' }}
              onChange={onDateRangeChange}
              value={date}
              shouldDisableDate={disabledDate}
              format="DD-MM-YYYY"
              slotProps={{
                actionBar: {
                  actions: ['clear'],
                },
                textField: { variant: 'filled' },
                field: {
                  readOnly: true,
                },
              }}
            />
          </DemoContainer>
        </LocalizationProvider>
        {!date || date && date.length && date[0] === null && date[1] === null && (
        <FormFeedback className="text-info m-1 text-info font-tiny display-block">Maximum Date Range upto 60 days</FormFeedback>
        )}
      </div>
    ) : ''}
  </>,
    },
    {
      title: (
        <span>
          BY MAINTENANCE TEAM / ASSET
          <span className="text-danger ml-2px">*</span>
        </span>
      ),
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
    onChange={(e, options) => { setCustomOptions(options); setSelectedField(options ? options.value : false); handleFieldReset(); }}
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
      title: selectedField && selectedField === 'asset_name' ? (
        <span>
          BY BLOCK
          <span className="text-danger ml-2px">*</span>
        </span>
      ) : false,
      component:
  <>
    <FormGroup>
      <Autocomplete
        multiple
        filterSelectedOptions
        limitTags={3}
        id="tags-filled"
        size="small"
        name="block"
        open={blockOpen}
        onOpen={() => {
          setBlockOpen(true);
          setBlockKeyword('');
        }}
        onClose={() => {
          setBlockOpen(false);
          setBlockKeyword('');
        }}
        value={locationId}
        disableClearable={!(locationId.length)}
        onChange={(e, options) => onBlockChange(options)}
        getOptionSelected={(option, value) => option.name === value.path_name}
        getOptionLabel={(option) => (typeof option === 'string' ? option : `${option.path_name}(${option.space_name})`)}
        options={blockOptions}
        renderOption={(option) => (
          <div>
            <h6>{option.name || option.space_name}</h6>
            <p className="float-left font-tiny">
              {option.path_name && (
              <>
                {option.path_name}
              </>
              )}
            </p>
          </div>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            className={(((locationId && locationId.length > 0)) || (blockKeyword && blockKeyword.length > 0))
              ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
            placeholder="Search & Select"
            onChange={(e) => setBlockKeyword(e.target.value)}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {(buildingsInfo && buildingsInfo.loading) ? <CircularProgress color="inherit" size={20} /> : null}
                  <InputAdornment position="end">
                    {((blockKeyword && blockKeyword.length > 0) || (locationId && locationId.length > 0)) && (
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={onBlockClear}
                    >
                      <BackspaceIcon fontSize="small" />
                    </IconButton>
                    )}
                    <IconButton
                      aria-label="toggle search visibility"
                      onClick={showBlockModal}
                    >
                      <SearchIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                </>
              ),
            }}
          />
        )}
      />
    </FormGroup>
  </>,
    },
    {
      title: (locationId && locationId.length > 0) || (selectedField && selectedField === 'maintenance_team_id') ? (
        <span>
          BY TYPE
          <span className="text-danger ml-2px">*</span>
        </span>
      ) : '',
      component:
  <>
    {preventiveActions.ppmFor.map((tp, index) => (
      <FormControlLabel
        control={(
          <Checkbox
            type="checkbox"
            id={`checkboxslotaction${index}`}
            value={tp.value}
            name={tp.label}
            checked={preventiveFor === tp.value}
            onChange={handleTimeCheckboxChange}
          />
)}
        label={tp.label}
      />
    ))}
  </>,
    },
    {
      title: (selectedField && selectedField === 'maintenance_team_id') ? (
        <span>
          BY MAINTENANCE TEAM
          <span className="text-danger ml-2px">*</span>
        </span>
      ) : false,
      component:
  <FormGroup>
    <Autocomplete
      id="tags-filledteam"
      size="small"
      name="team"
      open={teamOpen}
      value={teamValue}
      onOpen={() => {
        setTeamOpen(true);
        setTeamkeyword('');
      }}
      onClose={() => {
        setTeamOpen(false);
        setTeamkeyword('');
      }}
      onChange={(e, options, action, value) => onTeamChange(options, action, value)}
      getOptionSelected={(option, value) => option.name === value.name}
      getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
      options={teamOptions}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          value={teamkeyword}
          className={((teamValue && teamValue.length > 0) || (teamkeyword && teamkeyword.length > 0))
            ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
          placeholder="Search & Select"
          onChange={(e) => setTeamkeyword(e.target.value)}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {teamInfo && teamInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                <InputAdornment position="end">
                  {((teamValue && teamValue.length > 0) || (teamkeyword && teamkeyword.length > 0)) && (
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={onTeamClear}
                  >
                    <BackspaceIcon fontSize="small" />
                  </IconButton>
                  )}
                  <IconButton
                    aria-label="toggle search visibility"
                    onClick={showTeamModal}
                  >
                    <SearchIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              </>
            ),
          }}
        />
      )}
    />
    {(teamInfo && teamInfo.err) && (
    <FormFeedback className="display-block">{generateErrorMessage(teamInfo)}</FormFeedback>
    )}
  </FormGroup>,
    },
    {
      title: locationId && locationId.length > 0 ? preventiveFor !== 'e' ? (
        <span>
          BY SPACE
          <span className="text-danger ml-2px">*</span>
        </span>
      ) : (
        <span>
          BY EQUIPMENT
          <span className="text-danger ml-2px">*</span>
        </span>
      ) : '',
      component:
  <>
    {selectedField && selectedField === 'asset_name'
    && (preventiveFor !== 'e' && locationId && locationId.length > 0
      ? (
        <FormGroup>
          <Autocomplete
            multiple
            filterSelectedOptions
            limitTags={3}
            id="tags-filledspace"
            name="space"
            open={spaceOpen}
            size="small"
            onOpen={() => {
              setSpaceOpen(true);
              setSpaceKeyword('');
            }}
            onClose={() => {
              setSpaceOpen(false);
              setSpaceKeyword('');
            }}
            value={spaceValue}
            disableClearable={!(spaceValue.length)}
            onChange={(e, options) => onSpaceChange(options)}
            getOptionSelected={(option, value) => option.name === value.space_name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.space_name)}
            options={spaceOptions}
            renderOption={(option) => (
              <div>
                <h6>{option.name || option.space_name}</h6>
                <p className="float-left font-tiny">
                  {option.path_name && (
                  <>
                    {option.path_name}
                  </>
                  )}
                </p>
              </div>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                value={spaceKeyword}
                className={((spaceValue && spaceValue.length > 0) || (spaceKeyword && spaceKeyword.length > 0))
                  ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                placeholder="Search & Select"
                onChange={(e) => setSpaceKeyword(e.target.value)}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {inspectionassetSpaceInfo && inspectionassetSpaceInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {((spaceValue && spaceValue.length > 0) || (spaceKeyword && spaceKeyword.length > 0)) && (
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={onSpaceClear}
                        >
                          <BackspaceIcon fontSize="small" />
                        </IconButton>
                        )}
                        <IconButton
                          aria-label="toggle search visibility"
                          onClick={showSpaceModal}
                        >
                          <SearchIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    </>
                  ),
                }}
              />
            )}
          />
          {(date && date.length) && (preventiveFor) && (inspectionassetSpaceInfo && inspectionassetSpaceInfo.err) && (
          <FormFeedback className="display-block">{generateErrorMessage(inspectionassetSpaceInfo)}</FormFeedback>
          )}
        </FormGroup>
      )
      : (
        <FormGroup>
          <Autocomplete
            multiple
            filterSelectedOptions
            limitTags={3}
            id="tags-filled"
            size="small"
            name="equipment"
            open={equipmentOpen}
            value={equipValue}
            onOpen={() => {
              setEquipmentOpen(true);
              setEquipmentKeyword('');
            }}
            onClose={() => {
              setEquipmentOpen(false);
              setEquipmentKeyword('');
            }}
            disableClearable={!(equipValue.length)}
            onChange={(e, options) => onEquipmentChange(options)}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={equipmentOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                value={equipmentKeyword}
                className={((equipValue && equipValue.length > 0) || (equipmentKeyword && equipmentKeyword.length > 0))
                  ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                placeholder="Search & Select"
                onChange={(e) => setEquipmentKeyword(e.target.value)}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {inspectionassetSpaceInfo && inspectionassetSpaceInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {((equipValue && equipValue.length > 0) || (equipmentKeyword && equipmentKeyword.length > 0)) && (
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={onEquipClear}
                        >
                          <BackspaceIcon fontSize="small" />
                        </IconButton>
                        )}
                        <IconButton
                          aria-label="toggle search visibility"
                          onClick={showEquipmentModal}
                        >
                          <SearchIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    </>
                  ),
                }}
              />
            )}
          />
          {date && date.length && preventiveFor && inspectionassetSpaceInfo && inspectionassetSpaceInfo.err && (
          <FormFeedback className="display-block">{generateErrorMessage(inspectionassetSpaceInfo)}</FormFeedback>
          )}
        </FormGroup>
      ))}
  </>,
    },
    {
      title: 'ADD COLUMNS',
      component:
  <>
    {tableHeaders.filter((x) => !x.static).map((row) => (
      <FormControlLabel
        control={(
          <Checkbox
            id={row.valueKey}
            checked={row.isChecked}
            name={row.valueKey}
            onChange={(e) => {
              const list = [...tableHeaders];
              list.forEach((x) => {
                if (x.valueKey === row.valueKey) {
                  x.isChecked = e.target.checked;
                }
              });
              // list[index].isChecked = e.target.checked;
              setTableHeaders(list);
            }}
          />
)}
        label={row.headerName}
      />
    ))}
  </>,
    },
  ];

  const onApplyFilters = () => {
    dispatch(resetInspectionOrders());
    setCustomFilters({
      preventiveFor, scheduleValue, date, spaceValue, equipValue, locationId, selectedDate, teamValue, selectedField,
    });
    setFilterOpen(false);
  };
  const onCloseFilters = () => {
    setPreventiveFor(customFilters.preventiveFor);
    setScheduleValue(customFilters.scheduleValue);
    changeDate(customFilters.date);
    setSpaceValue(customFilters.spaceValue);
    setEquipValue(customFilters.equipValue);
    setLocationId(customFilters.locationId);
    setSelectedDate(customFilters.selectedDate);
    setFilterOpen(false);
  };

  const onDataChange = (fieldRef, data) => {
    setTeamValue(data);
    dispatch(getTypeId({
      preventiveFor: 'e', scheduleValue, date, spaceValue, equipValue, locationId, selectedDate, teamValue: data, selectedField,
    }));
  };

  let disabled = !(((selectedDate && selectedDate !== '%(custom)s' || (selectedDate === '%(custom)s' && date && date.length && date[0] !== null && date[1] !== null))) && locationId.length > 0 && ((equipValue && equipValue.length > 0) || (spaceValue && spaceValue.length > 0)));

  if (selectedField && selectedField === 'maintenance_team_id') {
    disabled = !(((selectedDate && selectedDate !== '%(custom)s' || (selectedDate === '%(custom)s' && date && date.length && date[0] !== null && date[1] !== null))) && (teamValue && teamValue.id));
  }

  return (
    <>
      <Dialog maxWidth="xl" open={extraMultipleModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraMultipleModal(false); }} />
        <DialogContent sx={{ width: '1000px' }}>
          <DialogContentText id="alert-dialog-description">
            <SearchModalSingle
              modelName={modelValue}
              modalName={modalName}
              afterReset={() => { setExtraMultipleModal(false); }}
              onEquipmentChange={onEquipmentChangeModal}
              onSpaceChange={onSpaceChangeModal}
              onScheduleChange={onScheduleChangeModal}
              fieldName={fieldName}
              fields={columns}
              company={companyValue}
              otherFieldValue={otherFieldValue}
              oldEquipValues={equipValue}
              oldSpaceValues={spaceValue}
              blockValues={getArrayToCommaValues(locationId, 'id')}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>

      <Dialog maxWidth="xl" open={extraModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraModal(false); }} />
        <DialogContent sx={{ width: '1000px' }}>
          <DialogContentText id="alert-dialog-description">
            <SearchModalMultiple
              modelName={modelValue}
              afterReset={() => { setExtraModal(false); }}
              fieldName={fieldName}
              fields={columns}
              company={companyValue}
              otherFieldName={otherFieldName}
              otherFieldValue={otherFieldValue}
              onSpaceChange={onBlockChangeModal}
              oldSpaceValues={locationId}
              oldEquipValues={equipValue}
              oldSpaceListValues={spaceValue}
              onEquipmentChange={onEquipmentChangeModal}
              onSpaceListChange={onSpaceChangeModal}
              inspectionassetSpaceInfo={fieldName === 'space' || fieldName === 'equipment' ? inspectionassetSpaceInfo : ''}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Dialog size="xl" fullWidth open={extraModal1}>
        <DialogHeader rightButton title={modalName} imagePath={false} onClose={() => { setExtraModal1(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <SearchModalSingleStatic
              afterReset={() => { setExtraModal1(false); }}
              fieldName={fieldName}
              fields={columns}
              headers={headers}
              data={teamOptions}
              setFieldValue={onDataChange}
              modalName={modalName}
              oldValues={oldValues}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Drawer anchor="right" open={filterOpen} PaperProps={{ sx: { width: '30%' } }}>
        <ReportsFilterDrawer
          filtersComponentsArray={filtersComponentsArray}
          onApplyFilters={onApplyFilters}
          onCloseFilters={onCloseFilters}
          isDisabled={disabled}
        />
      </Drawer>
    </>
  );
};

export default SideFilterChecklist;
