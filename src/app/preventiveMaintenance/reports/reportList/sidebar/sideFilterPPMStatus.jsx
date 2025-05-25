/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable consistent-return */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
/* eslint-disable radix */
import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import { DatePicker, ConfigProvider } from 'antd';
import 'moment/locale/en-gb';
import locale from 'antd/es/locale/en_GB';
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
import customData from '../../data/customData.json';

import ReportsFilterDrawer from '../../../../commonComponents/reportsFilterDrawer';
import DialogHeader from '../../../../commonComponents/dialogHeader';

import {
  getTypeId,
  getPPMStatus, resetPPMStatus, getSheduleList, getEquipmentSpaceByBlockPPM, resetEquipmentSpaceByBlockPPM,
  getSpaceByBlockPPM, getMaintenanceTeam, resetTeam,
} from '../../../ppmService';
import {
  getBuildings,
} from '../../../../assets/equipmentService';
import {
  generateErrorMessage,
  getAllowedCompanies,
  getArrayFromValuesById,
  getColumnArrayById,
  isAssociativeArray,
  getArrayToCommaValues,
  getDateAndTimeForPPMChecklistReports,
} from '../../../../util/appUtils';
import preventiveActions from '../../../data/preventiveActions.json';
import SearchModalSingle from './searchModalSingle';
import SearchModalMultiple from './searchModalMultiple';

const appModels = require('../../../../util/appModels').default;

const { RangePicker } = DatePicker;

const SideFilterPPMStatus = ({
  apiReportName,
  filterOpen,
  setFilterOpen,
  resetFilters,
  setResetFilters,
  setShowResetOption,
}) => {
  const dispatch = useDispatch();
  const [customFilters, setCustomFilters] = useState({
    preventiveFor: 'equipment', scheduleValue: [], date: [null, null], spaceValue: [], equipValue: [], statusValue: [], locationId: [], teamValue: [], selectedField: '',
  });
  const [statusCollapse, setStatusCollapse] = useState(true);
  const [preventiveCollapse, setPreventiveCollapse] = useState(true);
  const [date, changeDate] = useState(false);
  const [preventiveFor, setPreventiveFor] = useState('equipment');

  const [scheduleValue, setScheduleValue] = useState([]);
  const [scheduleCollapse, setScheduleCollapse] = useState(true);
  const [schedulekeyword, setSchedulekeyword] = useState('');
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [sheduleOptions, setSheduleOptions] = useState([]);

  const [spaceCollapse, setSpaceCollapse] = useState(true);
  const [spaceOpen, setSpaceOpen] = useState(false);
  const [spaceKeyword, setSpaceKeyword] = useState('');

  const [byStatusCollapse, setByStatusCollapse] = useState(true);
  const [statusKeyword, setStatusKeyword] = useState('');
  const [statusValue, setStatusValue] = useState([]);

  const [equipmentCollapse, setEquipmentCollapse] = useState(true);
  const [equipmentOpen, setEquipmentOpen] = useState(false);
  const [equipmentKeyword, setEquipmentKeyword] = useState('');

  const [spaceOptions, setSpaceOptions] = useState([]);
  const [equipmentOptions, setEquipmentOptions] = useState([]);

  const [spaceValue, setSpaceValue] = useState([]);
  const [equipValue, setEquipValue] = useState([]);

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
  const [customSelectedOptions, setCustomSelectedOptions] = useState([]);

  const [blockCollapse, setBlockCollapse] = useState(true);
  const [blockOpen, setBlockOpen] = useState(false);
  const [blockKeyword, setBlockKeyword] = useState('');
  const [locationId, setLocationId] = useState([]);
  const [blockOptions, setBlockOptions] = useState([]);

  const [extraMultipleModal, setExtraMultipleModal] = useState(false);
  const [extraModal, setExtraModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [columns, setColumns] = useState([]);

  const { userInfo } = useSelector((state) => state.user);

  const {
    scheduleInfo, ppmassetSpaceInfo, ppmSpaceInfo, teamInfo,
  } = useSelector((state) => state.ppm);
  const {
    buildingsInfo,
  } = useSelector((state) => state.equipment);

  const companies = getAllowedCompanies(userInfo);

  useEffect(() => {
    dispatch(resetPPMStatus());
    dispatch(resetTeam());
    setCustomOptions('');
    dispatch(resetEquipmentSpaceByBlockPPM());
    setSelectedField(null);
    dispatch(getTypeId({
      preventiveFor, scheduleValue, statusValue, date, spaceValue, equipValue, locationId, teamValue, selectedField,
    }));
  }, []);

  useEffect(() => {
    if (ppmSpaceInfo && ppmSpaceInfo.data && ppmSpaceInfo.data.length && spaceOpen) {
      setSpaceOptions(getArrayFromValuesById(ppmSpaceInfo.data, isAssociativeArray(spaceValue || []), 'id'));
    } else if (ppmSpaceInfo && ppmSpaceInfo.loading) {
      setSpaceOptions([{ space_name: 'Loading...' }]);
    } else {
      setSpaceOptions([]);
    }
  }, [ppmSpaceInfo, spaceOpen]);

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
    if (ppmassetSpaceInfo && ppmassetSpaceInfo.data && ppmassetSpaceInfo.data.length && equipmentOpen) {
      setEquipmentOptions(getArrayFromValuesById(ppmassetSpaceInfo.data, isAssociativeArray(equipValue || []), 'id'));
    } else if (ppmassetSpaceInfo && ppmassetSpaceInfo.loading) {
      setEquipmentOptions([{ name: 'Loading...' }]);
    } else {
      setEquipmentOptions([]);
    }
  }, [ppmassetSpaceInfo, equipmentOpen]);

  useEffect(() => {
    if (teamValue && teamValue.assets && teamValue.assets.length) {
      setEquipmentOptions(getArrayFromValuesById(teamValue.assets, isAssociativeArray(equipValue || []), 'id'));
    } else {
      setEquipmentOptions([]);
    }
  }, [teamValue]);

  useEffect(() => {
    if (scheduleInfo && scheduleInfo.data && scheduleInfo.data.length && scheduleOpen) {
      setSheduleOptions(getArrayFromValuesById(scheduleInfo.data, isAssociativeArray(scheduleValue || []), 'id'));
    } else if (scheduleInfo && scheduleInfo.loading) {
      setSheduleOptions([{ name: 'Loading...' }]);
    } else {
      setSheduleOptions([]);
    }
  }, [scheduleInfo, scheduleOpen]);

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
    (async () => {
      if (userInfo && userInfo.data && blockOpen) {
        await dispatch(getBuildings(companies, appModels.SPACE, blockKeyword));
      }
    })();
  }, [userInfo, blockKeyword, blockOpen]);

  useEffect(() => {
    if (userInfo && userInfo.data && scheduleOpen) {
      const keywordTrim = schedulekeyword ? encodeURIComponent(schedulekeyword.trim()) : '';
      dispatch(getSheduleList(companies, appModels.SCHEDULE, keywordTrim));
    }
  }, [userInfo, schedulekeyword, scheduleOpen]);

  useEffect(() => {
    if (userInfo && userInfo.data && selectedField === 'maintenance_team_id' && (date && date.length && date[0] !== null && date[1] !== null)) {
      let start = '';
      let end = '';
      const weekObj = getDateAndTimeForPPMChecklistReports(userInfo, date[0], date[1]);
      if (date !== null) {
        start = weekObj[0];
        end = weekObj[1];
      }
      const type = preventiveFor === 'equipment' ? 'Equipment' : 'Space';
      dispatch(getMaintenanceTeam(start, end, type, appModels.PPMSCHEDULERWEEk));
    } else {
      dispatch(resetTeam());
      setTeamValue('');
      setEquipValue([]);
      setEquipmentOptions([]);
    }
  }, [selectedField, date, preventiveFor]);

  useEffect(() => {
    if (userInfo && userInfo.data && preventiveFor && locationId && locationId.length > 0) {
      const filterValue = getArrayToCommaValues(locationId, 'id');
      if (preventiveFor === 'space') {
        dispatch(getSpaceByBlockPPM(filterValue, preventiveFor));
      } else {
        dispatch(getEquipmentSpaceByBlockPPM(filterValue, preventiveFor));
      }
    }
  }, [userInfo, locationId, preventiveFor]);

  useEffect(() => {
    if ((userInfo && userInfo.data && userInfo.data.company && customFilters.date && customFilters.date.length && customFilters.date[0] !== null && customFilters.date[1] !== null) && customFilters.preventiveFor) {
      let start = '';
      let end = '';
      const assetId = customFilters.preventiveFor === 'equipment' ? getColumnArrayById(customFilters.equipValue, 'id') : getColumnArrayById(customFilters.spaceValue, 'id');
      const status = getColumnArrayById(customFilters.statusValue, 'value');
      const schedule = getColumnArrayById(customFilters.scheduleValue, 'id');
      const mteam = teamValue && teamValue.id ? [teamValue.id]: [];
      const weekObj = getDateAndTimeForPPMChecklistReports(userInfo, customFilters.date[0], customFilters.date[1]);
      if (customFilters.date !== null) {
        start = weekObj[0];
        end = weekObj[1];
      }

      dispatch(getPPMStatus(start, end, customFilters.preventiveFor, assetId, schedule, status, mteam));
    }
  }, [userInfo, customFilters]);

  const onDateRangeChange = (dates) => {
    setTeamValue('');
    setTeamOptions([]);
    changeDate(dates);
    dispatch(getTypeId({
      preventiveFor, scheduleValue, statusValue, date: dates, spaceValue, equipValue, locationId, teamValue, selectedField,
    }));
  };

  const handleTimeCheckboxChange = (event) => {
    setEquipValue([]);
    setSpaceValue([]);
    setTeamValue('');
    setPreventiveFor(event.target.value);
    dispatch(getTypeId({
      preventiveFor: event.target.value, scheduleValue, statusValue, date, spaceValue: [], equipValue: [], locationId: [], teamValue: '', selectedField,
    }));
  };

  const onEquipmentChange = (data) => {
    if (data && data.length && data.find((option) => option.name === 'Loading...')) {
      return false;
    }
    setEquipValue(data);
    setSpaceValue([]);
    dispatch(getTypeId({
      preventiveFor, scheduleValue, statusValue, date, spaceValue, equipValue: data, locationId, teamValue, selectedField,
    }));
  };

  const onScheduleChange = (data) => {
    if (data && data.length && data.find((option) => option.name === 'Loading...')) {
      return false;
    }
    setScheduleValue(data);
    dispatch(getTypeId({
      preventiveFor, scheduleValue: data, statusValue, date, spaceValue, equipValue, locationId, teamValue, selectedField,
    }));
  };

  const onTeamChange = (data) => {
    if (data && data.length && data.find((option) => option.name === 'Loading...')) {
      return false;
    }
    setTeamValue(data);
    if (preventiveFor === 'equipment') {
      setEquipValue(data.assets);
      setSpaceValue([]);
      dispatch(getTypeId({
        preventiveFor, scheduleValue: data, statusValue, date, spaceValue, equipValue: data.assets, locationId, teamValue: data, selectedField,
      }));
    } else {
      setSpaceValue(data.assets);
      setEquipValue([]);
      dispatch(getTypeId({
        preventiveFor, scheduleValue: data, statusValue, date, spaceValue: data.assets, equipValue, locationId, teamValue: data, selectedField,
      }));
    }
  };

  const onEquipmentChangeModal = (data) => {
    setEquipValue(data);
    setSpaceValue([]);
    dispatch(getTypeId({
      preventiveFor, scheduleValue, statusValue, date, spaceValue, equipValue: data, locationId, teamValue, selectedField,
    }));
  };

  const onScheduleChangeModal = (data) => {
    setScheduleValue(data);
    dispatch(getTypeId({
      preventiveFor, scheduleValue: data, statusValue, date, spaceValue, equipValue, locationId, teamValue, selectedField,
    }));
  };

  const onSpaceChangeModal = (data) => {
    setEquipValue([]);
    setSpaceValue(data);
    dispatch(getTypeId({
      preventiveFor, scheduleValue, statusValue, date, spaceValue: data, equipValue, locationId, teamValue, selectedField,
    }));
  };

  const onSpaceChange = (data) => {
    if (data && data.length && data.find((option) => option.space_name === 'Loading...')) {
      return false;
    }
    setEquipValue([]);
    setSpaceValue(data);
    dispatch(getTypeId({
      preventiveFor, scheduleValue, date, spaceValue: data, equipValue, statusValue, locationId, teamValue, selectedField,
    }));
  };

  const onBlockChange = (data) => {
    if (data && data.length && data.find((option) => option.path_name === 'Loading...')) {
      return false;
    }
    setLocationId(data);
    setEquipValue([]);
    setSpaceValue([]);
    dispatch(getTypeId({
      preventiveFor, scheduleValue, date, spaceValue: [], equipValue: [], statusValue, locationId: data, teamValue, selectedField,
    }));
  };

  const onSpaceClear = () => {
    setSpaceKeyword('');
    setSpaceValue([]);
    dispatch(getTypeId({
      preventiveFor, scheduleValue, statusValue, date, spaceValue: [], equipValue, locationId: [], teamValue, selectedField,
    }));
    setSpaceOpen(false);
  };

  const onEquipClear = () => {
    setEquipmentKeyword('');
    setEquipValue([]);
    dispatch(getTypeId({
      preventiveFor, scheduleValue, statusValue, date, spaceValue, equipValue: [], locationId: [], teamValue, selectedField,
    }));
    setEquipmentOpen(false);
  };

  const onScheduleClear = () => {
    setSchedulekeyword('');
    setScheduleValue([]);
    dispatch(getTypeId({
      preventiveFor, scheduleValue: [], date, spaceValue, equipValue, locationId, teamValue, selectedField,
    }));
    setScheduleOpen(false);
  };

  const onTeamClear = () => {
    setTeamkeyword('');
    setTeamValue([]);
    dispatch(getTypeId({
      preventiveFor, scheduleValue: [], date, spaceValue, equipValue, locationId, teamValue: '', selectedField,
    }));
    setTeamOpen(false);
  };

  const onBlockClear = () => {
    dispatch(resetEquipmentSpaceByBlockPPM());
    setBlockKeyword(null);
    setLocationId([]);
    setEquipValue([]);
    setSpaceValue([]);
    setBlockOpen(false);
    dispatch(getTypeId({
      preventiveFor, scheduleValue, statusValue, date, spaceValue: [], equipValue: [], locationId: [], teamValue, selectedField,
    }));
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

  const showTeamModal = () => {
    setExtraModal1(true);
    setFieldName('maintenance_team_id');
    setModalName('Maintenance Team');
    setColumns(['id', 'name']);
    setHeaders(['Name']);
    setOldValues(teamValue && teamValue.id ? teamValue.id : '');
  };

  const showSpaceModal = () => {
    setModelValue(appModels.SPACE);
    setFieldName('space');
    setModalName('Spaces');
    setOtherFieldValue(false);
    setCompanyValue(companies);
    setExtraModal(true);
    setColumns(['id', 'path_name', 'space_name', 'asset_category_id', 'block_id']);
  };

  const showScheduleModal = () => {
    setModelValue(appModels.SCHEDULE);
    setFieldName('by_period');
    setModalName('Schedules');
    setOtherFieldValue(false);
    setCompanyValue(companies);
    setExtraMultipleModal(true);
    setColumns(['id', 'name']);
  };

  const handleResetClick = () => {
    setScheduleValue([]);
    setPreventiveFor('equipment');
    setSpaceValue([]);
    setEquipValue([]);
    setLocationId([]);
    setStatusValue([]);
    setTeamValue([]);
    setSelectedField(null);
    changeDate([null, null]);
    dispatch(getTypeId({
      preventiveFor: 'equipment', scheduleValue: [], statusValue: [], date: false, spaceValue: [], equipValue: [], locationId: [], teamValue: '', selectedField: '',
    }));
  };

  const onStatusClear = () => {
    setStatusKeyword('');
    setStatusValue([]);
    dispatch(getTypeId({
      preventiveFor, scheduleValue, statusValue: [], date, spaceValue, equipValue, locationId, teamValue, selectedField,
    }));
  };

  const onStatusChange = (data) => {
    setStatusValue(data);
    dispatch(getTypeId({
      preventiveFor, scheduleValue, statusValue: data, date, spaceValue, equipValue, locationId, teamValue, selectedField,
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
      preventiveFor, scheduleValue, statusValue, date, spaceValue: [], equipValue: [], locationId: [], teamValue, selectedField,
    }));
  };

  moment.locale('en-gb', {
    week: {
      dow: 1, /// Date offset
    },
  });

  useEffect(() => {
    if (resetFilters) {
      setResetFilters(false);
      setShowResetOption(false);
      setSelectedField(null);
      setCustomOptions([]);
      setCustomFilters({
        preventiveFor: 'equipment', scheduleValue: [], date: [null, null], spaceValue: [], equipValue: [], statusValue: [], locationId: [], teamValue: '', selectedField: '',
      });
      handleResetClick();
      dispatch(resetPPMStatus());
    }
  }, [resetFilters]);

  const onApplyFilters = () => {
    setCustomFilters({
      preventiveFor, scheduleValue, date, spaceValue, equipValue, statusValue, locationId, teamValue, selectedField,
    });
    setFilterOpen(false);
    dispatch(resetPPMStatus());
  };

  const onCloseFilters = () => {
    dispatch(getTypeId({
      preventiveFor, scheduleValue, statusValue, date: customFilters.date, spaceValue, equipValue, locationId, teamValue, selectedField,
    }));
    // dispatch(resetPPMStatus());
    changeDate(customFilters.date);
    setSelectedField(customFilters.selectedField);
    setPreventiveFor(customFilters.preventiveFor);
    setScheduleValue(customFilters.scheduleValue);
    setSpaceValue(customFilters.spaceValue);
    setEquipValue(customFilters.equipValue);
    setStatusValue(customFilters.statusValue);
    setLocationId(customFilters.locationId);
    setTeamValue(customFilters.teamValue);
    setFilterOpen(false);
  };

  useEffect(() => {
    if ((customFilters.date && customFilters.date.length && customFilters.date[0] !== null && customFilters.date[1] !== null)
      || (customFilters.spaceValue && customFilters.spaceValue.length) || (customFilters.equipValue && customFilters.equipValue.length)
      || (customFilters.scheduleValue && customFilters.scheduleValue > 0) || customFilters.preventiveFor !== 'equipment') {
      setShowResetOption(true);
    }
  }, [customFilters]);

  const handleFieldReset = () => {
    setPreventiveFor('equipment');
    setSpaceValue([]);
    setEquipValue([]);
    setLocationId([]);
    setTeamValue('');
    dispatch(getTypeId({
      preventiveFor: 'equipment', scheduleValue, statusValue, date, spaceValue: [], equipValue: [], locationId: [], teamValue: '', selectedField,
    }));
  };

  const onDataChange = (fieldRef, data) => {
    setTeamValue(data);
    dispatch(getTypeId({
      preventiveFor: 'equipment', scheduleValue, statusValue, date, spaceValue, equipValue, locationId, teamValue: data, selectedField,
    }));
  };

  const filtersComponentsArray = [
    {
      title: (
        <span>
          BY WEEK FILTER
          <span className="text-danger ml-2px">*</span>
        </span>
      ),
      component:
  <ConfigProvider locale={locale}>
    <RangePicker
      onChange={onDateRangeChange}
            // format="YYYY-MM-DD"
      value={date}
      picker="week"
      size="small"
      className="mt-1 w-100"
    />
  </ConfigProvider>,
    },
    {
      title:(
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
    onChange={(e, options) => { setCustomOptions(options); setCustomSelectedOptions([]); setSelectedField(options ? options.value : false); handleFieldReset(); }}
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
  </FormGroup>,
    },
    {
      title: (locationId && locationId.length > 0) || (selectedField && selectedField === 'maintenance_team_id') ? (
        <span>
          BY TYPE
          <span className="text-danger ml-2px">*</span>
        </span>
      ): false,
      component:
  <>
    {preventiveActions.ppmReportType.map((tp, index) => (
      <span className="mb-1 d-block font-weight-500" key={tp.value}>
        <FormControlLabel
          control={(
            <Checkbox
              id={`checkboxslotaction${index}`}
              value={tp.value}
              name={tp.label}
              checked={preventiveFor === tp.value}
              onChange={handleTimeCheckboxChange}
            />
)}
          label={tp.label}
        />
      </span>
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
      title: preventiveFor !== 'equipment' && ((locationId && locationId.length > 0))
        ? (
          <span>
            BY SPACE
            <span className="text-danger ml-2px">*</span>
          </span>
        ): false,
      component:
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
      onChange={(e, options, action, value) => onSpaceChange(options, action, value)}
      getOptionSelected={(option, value) => option.name === value.space_name}
      getOptionLabel={(option) => (typeof option === 'string' ? option : option.space_name)}
      options={spaceOptions}
      renderOption={(option) => (
        <div>
          <h6>{option.space_name}</h6>
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
                {ppmSpaceInfo && ppmSpaceInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
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
    {(date && date.length) && (preventiveFor) && (ppmSpaceInfo && ppmSpaceInfo.err) && (
    <FormFeedback className="display-block">{generateErrorMessage(ppmSpaceInfo)}</FormFeedback>
    )}
  </FormGroup>,
    },
    {
      title: preventiveFor === 'equipment' && ((locationId && locationId.length > 0))
        ? (
          <span>
            BY EQUIPMENT
            <span className="text-danger ml-2px">*</span>
          </span>
        ) : false,
      component:
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
      onChange={(e, options, action, value) => onEquipmentChange(options, action, value)}
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
                {ppmassetSpaceInfo && ppmassetSpaceInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
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
    {(date && date.length) && (preventiveFor) && (ppmassetSpaceInfo && ppmassetSpaceInfo.err) && (
    <FormFeedback className="display-block">{generateErrorMessage(ppmassetSpaceInfo)}</FormFeedback>
    )}
  </FormGroup>,
    },
    {
      title: 'BY SCHEDULE',
      component:
  <FormGroup>
    <Autocomplete
      multiple
      filterSelectedOptions
      limitTags={3}
      id="tags-filledschedule"
      size="small"
      name="schedule"
      open={scheduleOpen}
      value={scheduleValue}
      onOpen={() => {
        setScheduleOpen(true);
        setSchedulekeyword('');
      }}
      onClose={() => {
        setScheduleOpen(false);
        setSchedulekeyword('');
      }}
      disableClearable={!(scheduleValue.length)}
      onChange={(e, options, action, value) => onScheduleChange(options, action, value)}
      getOptionSelected={(option, value) => option.name === value.name}
      getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
      options={sheduleOptions}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          value={schedulekeyword}
          className={((scheduleValue && scheduleValue.length > 0) || (schedulekeyword && schedulekeyword.length > 0))
            ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
          placeholder="Search & Select"
          onChange={(e) => setSchedulekeyword(e.target.value)}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {scheduleInfo && scheduleInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                <InputAdornment position="end">
                  {((scheduleValue && scheduleValue.length > 0) || (schedulekeyword && schedulekeyword.length > 0)) && (
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={onScheduleClear}
                  >
                    <BackspaceIcon fontSize="small" />
                  </IconButton>
                  )}
                  <IconButton
                    aria-label="toggle search visibility"
                    onClick={showScheduleModal}
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
    {(scheduleInfo && scheduleInfo.err) && (
    <FormFeedback className="display-block">{generateErrorMessage(scheduleInfo)}</FormFeedback>
    )}
  </FormGroup>,
    },
    {
      title: 'BY STATUS',
      component:
  <FormGroup>
    <Autocomplete
      multiple
      filterSelectedOptions
      limitTags={3}
      id="tags-filledstatus"
      name="status"
      size="small"
      onOpen={() => {
        setStatusKeyword('');
      }}
      onClose={() => {
        setStatusKeyword('');
      }}
      value={statusValue}
      disableClearable={!(statusValue.length)}
      onChange={(e, options, action, value) => onStatusChange(options, action, value)}
      getOptionSelected={(option, value) => option.label === value.label}
      getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
      options={preventiveActions.status}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          value={statusKeyword}
          className={((statusValue && statusValue.length > 0) || (statusKeyword && statusKeyword.length > 0))
            ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
          placeholder="Search & Select"
          onChange={(e) => setStatusKeyword(e.target.value)}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <InputAdornment position="end">
                {((statusValue && statusValue.length > 0) || (statusKeyword && statusKeyword.length > 0)) && (
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={onStatusClear}
                >
                  <BackspaceIcon fontSize="small" />
                </IconButton>
                )}
              </InputAdornment>
            ),
          }}
        />
      )}
    />
  </FormGroup>,
    },
  ];

  let disabled = !(date && date.length && date[0] !== null && date[1] !== null && locationId.length > 0 && ((equipValue && equipValue.length > 0) || (spaceValue && spaceValue.length > 0)));

  if (selectedField && selectedField === 'maintenance_team_id') {
    disabled = !(date && date.length && date[0] !== null && date[1] !== null && (teamValue && teamValue.id));
  }

  return (
    <>
      <Drawer anchor="right" open={filterOpen} PaperProps={{ sx: { width: '30%' } }}>
        <ReportsFilterDrawer
          filtersComponentsArray={filtersComponentsArray}
          onApplyFilters={onApplyFilters}
          onCloseFilters={onCloseFilters}
          isDisabled={disabled}
        />
      </Drawer>
      <Dialog maxWidth="xl" open={extraMultipleModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraMultipleModal(false); }} sx={{ width: '800px' }} />
        <DialogContent>
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
              oldScheduleValues={scheduleValue}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Dialog maxWidth="xl" open={extraModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraModal(false); }} sx={{ width: '800px' }} />
        <DialogContent>
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
              inspectionassetSpaceInfo={fieldName === 'space' ? ppmSpaceInfo : fieldName === 'equipment' ? ppmassetSpaceInfo : ''}
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
    </>
  );
};

export default SideFilterPPMStatus;
