/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/jsx-indent */
/* eslint-disable import/no-unresolved */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { TextField, CircularProgress } from '@material-ui/core';
import { useFormikContext } from 'formik';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import moment from 'moment';

import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import {
  getOperationsList, getPreventiveCheckList, getInspectionChecklistGroup, getParentSchedule,
} from '../../preventiveMaintenance/ppmService';
import preventiveActions from '../../preventiveMaintenance/data/preventiveActions.json';
import { getSpaceAllSearchList, getEquipmentList, resetSpace } from '../../helpdesk/ticketService';
import { getTeamList, getEmployeeList } from '../../assets/equipmentService';
import {
  generateErrorMessage, getAllowedCompanies, extractOptionsObject, decimalKeyPress, extractNameObject} from '../../util/appUtils';
import {
  getInspectionForLabel,
  getPriorityLabel,
} from '../../preventiveMaintenance/utils/utils';
import AdvancedSearchModal from './advancedSearchModal';
import SearchModal from './searchModal';
import SearchModalMultiple from '../../survey/forms/searchModalMultiple';
import { Box } from '@mui/system';
import { Dialog, DialogContent, DialogContentText, FormControl, Typography } from '@mui/material';
import MuiAutoComplete from '../../commonComponents/formFields/muiAutocomplete';
import MuiCheckboxField from '../../commonComponents/formFields/muiCheckbox';
import { AddThemeColor } from '../../themes/theme'
import checkoutFormModel from '../formModel/checkoutFormModel';
import { IoCloseOutline } from 'react-icons/io5';
import DialogHeader from '../../commonComponents/dialogHeader';
import AddCustomer from '../../adminSetup/siteConfiguration/addTenant/addCustomer';
import MuiTextField from '../../commonComponents/formFields/muiTextField';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import timezone from 'dayjs/plugin/timezone';

const appModels = require('../../util/appModels').default;

dayjs.extend(utc);
dayjs.extend(timezone);

const RequestorForm = (props) => {
  const {
    editId,
    reloadData,
    setFieldValue,
    setFieldTouched,
    values,
    formField: {
      groupId,
      type,
      equipmentId,
      spaceId,
      maintenanceTeamId,
      taskId,
      checklistId,
      startsAt,
      durationAt,
      excludeHolidays,
      parentSchedule,
      priorityValue,
      commencesOn,
      endsOn,
      descriptionValue,
      remindBefore,
      missedAlert,
      recipients,
    },
  } = props;
  const { values: formValues } = useFormikContext();
  const {
    category_type, task_id, group_id, parent_id, check_list_id, commences_on, ends_on,
    maintenance_team_id, priority, equipment_id, space_id, recipients_id,
  } = formValues;
  const dispatch = useDispatch();
  const [ppmForOpen, setPpmForOpen] = useState(false);
  const [priorityOpen, setPriorityOpen] = useState(false);
  const [teamOpen, setTeamOpen] = useState(false);
  const [taskOpen, setTaskOpen] = useState(false);
  const [checkListOpen, setCheckListOpen] = useState(false);
  const [groupOpen, setGroupOpen] = useState(false);
  const [parentOpen, setParentOpen] = useState(false);
  const [typeValue, setTypeValue] = useState(false);
  const [spaceOpen, setSpaceOpen] = useState(false);
  const [equipmentOpen, setEquipmentOpen] = useState(false);
  const [spacekeyword, setSpaceKeyword] = useState('');
  const [equipmentkeyword, setEquipmentkeyword] = useState('');
  const [teamKeyword, setTeamKeyword] = useState('');
  const [taskKeyword, setTaskKeyword] = useState('');
  const [checkListKeyword, setCheckListKeyword] = useState('');
  const [groupKeyword, setGroupKeyword] = useState('');
  const [parentKeyword, setParentKeyword] = useState('');
  const [employeeKeyword, setEmployeeKeyword] = useState('');
  const [employeeShow, setEmployeeOpen] = useState(false);
  const [refresh, setRefresh] = useState(reloadData);
  const [fieldName, setFieldName] = useState('');
  const [modalName, setModalName] = useState('');

  const [modelValue, setModelValue] = useState('');
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [extraModal, setExtraModal] = useState(false);
  const [extraMultipleModal, setExtraMultipleModal] = useState(false);
  const [extraSearchModal, setExtraSearchModal] = useState(false);
  const [companyValue, setCompanyValue] = useState(false);
  const [addCustomerModal, setAddCustomerModal] = useState(false);
  const [columns, setColumns] = useState(['id', 'name']);
  const [customerKeyword, setCustomerKeyword] = useState('');

  const [teamOptions, setTeamOptions] = useState([]);
  console.log(commences_on, 'commences_on');
  const { userInfo } = useSelector((state) => state.user);
  // const companies = getAllowedCompanies(userInfo);
  const {
    siteDetails,
  } = useSelector((state) => state.site);
  const companies = siteDetails && siteDetails.data && siteDetails.data.length && siteDetails.data[0].id ? siteDetails.data[0].id : getAllowedCompanies(userInfo);
  const {
    taskInfo, checkList, checklistGroup, parentScheduleInfo,
  } = useSelector((state) => state.ppm);
  const { teamsInfo, employeesInfo } = useSelector((state) => state.equipment);
  const { spaceInfoList, equipmentInfo } = useSelector((state) => state.ticket);
  const {
    createTenantinfo, allowedCompanies,
  } = useSelector((state) => state.setup);

  const defaultCommenceOn = commences_on ? dayjs(moment.utc(commences_on).local().tz(userInfo?.data?.timezone).format('YYYY-MM-DD HH:mm:ss')) : null
  const defaultEndsOn = ends_on ? dayjs(moment.utc(ends_on).local().tz(userInfo?.data?.timezone).format('YYYY-MM-DD HH:mm:ss')) : null

  const [selectedEndsOnDate, setEndsOnDateChange] = useState(defaultEndsOn);
  const [selectedCommenseDate, setCommenseDateChange] = useState(defaultCommenceOn);

  useEffect(() => {
    setTeamOptions(extractOptionsObject(teamsInfo, maintenance_team_id));
  }, [editId, teamsInfo]);

  useEffect(() => {
    setRefresh(reloadData);
  }, [reloadData]);

  useEffect(() => {
    if (category_type && category_type.value) {
      setTypeValue(category_type.value);
      if (refresh === '1') {
        setFieldValue('equipment_id', '');
        setFieldValue('space_id', '');
      }
    } else if (category_type) {
      setTypeValue(category_type);
    }
  }, [category_type, refresh]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && spaceOpen) {
        await dispatch(getSpaceAllSearchList(companies, appModels.SPACE, spacekeyword));
      }
    })();
  }, [spaceOpen, spacekeyword]);

  useEffect(() => {
    (async () => {
      if (userInfo.data && equipmentOpen) {
        await dispatch(getEquipmentList(companies, appModels.EQUIPMENT, equipmentkeyword));
      }
    })();
  }, [equipmentOpen, equipmentkeyword]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && taskOpen) {
        await dispatch(getOperationsList(companies, appModels.TASK, taskKeyword));
      }
    })();
  }, [taskOpen, taskKeyword]);

  useEffect(() => {
    (async () => {
      if (userInfo.data && teamOpen) {
        await dispatch(getTeamList(companies, appModels.TEAM, teamKeyword));
      }
    })();
  }, [teamOpen, teamKeyword]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && employeeShow) {
        await dispatch(getEmployeeList(companies, appModels.USER, employeeKeyword));
      }
    })();
  }, [userInfo, employeeKeyword, employeeShow]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && checkListOpen) {
        await dispatch(getPreventiveCheckList(companies, appModels.PPMCHECKLIST, checkListKeyword));
      }
    })();
  }, [checkListOpen, checkListKeyword]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && groupOpen) {
        await dispatch(getInspectionChecklistGroup(companies, appModels.INSPECTIONCHECKLISTGROUP, groupKeyword));
      }
    })();
  }, [groupOpen, groupKeyword]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && parentOpen) {
        await dispatch(getParentSchedule(companies, appModels.INSPECTIONCHECKLIST, parentKeyword));
      }
    })();
  }, [parentOpen, parentKeyword]);

  const onTaskKeywordChange = (event) => {
    setTaskKeyword(event.target.value);
  };

  const onTeamKeywordChange = (event) => {
    setTeamKeyword(event.target.value);
  };

  const showTeamModal = () => {
    setModelValue(appModels.TEAM);
    setFieldName('maintenance_team_id');
    setModalName('Maintenance Teams');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraModal(true);
    setColumns(['id', 'name']);
  };

  const onTeamClear = () => {
    setTeamKeyword(null);
    setFieldValue('maintenance_team_id', '');
    setTeamOpen(false);
  };

  const onChecklistKeywordChange = (event) => {
    setCheckListKeyword(event.target.value);
  };

  const showChecklistModal = () => {
    setModelValue(appModels.PPMCHECKLIST);
    setFieldName('check_list_id');
    setModalName('Checklist');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraModal(true);
    setColumns(['id', 'name']);
  };

  const onChecklistClear = () => {
    setCheckListKeyword(null);
    setFieldValue('check_list_id', '');
    setCheckListOpen(false);
  };

  const onGroupKeywordChange = (event) => {
    setGroupKeyword(event.target.value);
  };

  const showGroupModal = () => {
    setModelValue(appModels.INSPECTIONCHECKLISTGROUP);
    setFieldName('group_id');
    setModalName('Group');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraModal(true);
    setColumns(['id', 'name']);
  };

  const onGroupClear = () => {
    setGroupKeyword(null);
    setFieldValue('group_id', '');
    setGroupOpen(false);
  };

  const onSpaceKeywordChange = (event) => {
    setSpaceKeyword(event.target.value);
  };

  const onSpaceSearch = () => {
    setModelValue(appModels.SPACE);
    setFieldName('space_id');
    setModalName('Space');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setColumns(['id', 'space_name', 'path_name']);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraMultipleModal(true);
  };

  const onSpaceClear = () => {
    setSpaceKeyword(null);
    setSpaceOpen(false);
    setFieldValue('space_id', '');
  };

  const onEquipmentKeywordChange = (event) => {
    setEquipmentkeyword(event.target.value);
  };

  const onEquipemntSearch = () => {
    setModelValue(appModels.EQUIPMENT);
    setFieldName('equipment_id');
    setModalName('Equipment');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setColumns(['id', 'name', 'location_id']);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraMultipleModal(true);
  };

  const showReceivableModal = () => {
    setModelValue(appModels.USER);
    setFieldName('recipients_id');
    setModalName('Recipients');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraModal(true);
  };

  const onEmployeeKeywordChange = (event) => {
    setEmployeeKeyword(event.target.value);
  };

  const onArKeywordClear = () => {
    setEmployeeKeyword(null);
    setFieldValue('recipients_id', '');
    setEmployeeOpen(false);
  };

  const onEquipmentClear = () => {
    setEquipmentkeyword(null);
    setEquipmentOpen(false);
    setFieldValue('equipment_id', '');
  };

  const onParentKeywordChange = (event) => {
    setParentKeyword(event.target.value);
  };

  const showParentModal = () => {
    setModelValue(appModels.INSPECTIONCHECKLIST);
    setFieldName('parent_id');
    setModalName('Parent');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraSearchModal(true);
    setColumns(['id', 'name', 'group_id', 'uuid']);
  };

  const onParentClear = () => {
    setParentKeyword(null);
    setFieldValue('parent_id', '');
    setParentOpen(false);
  };

  let taskOptions = [];
  let spaceOptions = [];
  let equipmentOptions = [];
  let employeeOptions = [];
  let checklistGroupOptions = [];
  let checklistOptions = [];
  let parentOptions = [];

  if (taskInfo && taskInfo.loading) {
    taskOptions = [{ name: 'Loading..' }];
  }
  if (task_id && task_id.length && task_id.length > 0) {
    const oldId = [{ id: task_id[0], name: task_id[1] }];
    const newArr = [...taskOptions, ...oldId];
    taskOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  if (taskInfo && taskInfo.data) {
    taskOptions = taskInfo.data;
  }
  if (taskInfo && taskInfo.err) {
    taskOptions = [];
  }

  if (spaceInfoList && spaceInfoList.loading) {
    spaceOptions = [{ path_name: 'Loading..' }];
  }
  if (spaceInfoList && spaceInfoList.data) {
    spaceOptions = spaceInfoList.data;
  }
  if (space_id && space_id.length && space_id.length > 0) {
    const oldId = [{ id: space_id[0], path_name: space_id[1] }];
    const newArr = [...spaceOptions, ...oldId];
    spaceOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  if (spaceInfoList && spaceInfoList.err) {
    spaceOptions = [];
  }

  if (equipmentInfo && equipmentInfo.loading) {
    equipmentOptions = [{ name: 'Loading..' }];
  }
  if (equipmentInfo && equipmentInfo.data) {
    equipmentOptions = equipmentInfo.data;
  }
  if (equipment_id && equipment_id.length && equipment_id.length > 0) {
    const oldEquipId = [{ id: equipment_id[0], name: equipment_id[1] }];
    const newArr = [...equipmentOptions, ...oldEquipId];
    equipmentOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  if (equipmentInfo && equipmentInfo.err) {
    equipmentOptions = [];
  }

  if (employeesInfo && employeesInfo.loading) {
    employeeOptions = [{ name: 'Loading..' }];
  }

  if (recipients_id && recipients_id.length && recipients_id.length > 0) {
    const oldId = [{ id: recipients_id[0], name: recipients_id[1] }];
    const newArr = [...employeeOptions, ...oldId];
    employeeOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }

  if (employeesInfo && employeesInfo.data) {
    const arr = [...employeeOptions, ...employeesInfo.data];
    employeeOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }

  if (checklistGroup && checklistGroup.loading) {
    checklistGroupOptions = [{ name: 'Loading..' }];
  }

  if (group_id && group_id.length && group_id.length > 0) {
    const oldId = [{ id: group_id[0], name: group_id[1] }];
    const newArr = [...checklistGroupOptions, ...oldId];
    checklistGroupOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }

  if (checklistGroup && checklistGroup.data) {
    const arr = [...checklistGroupOptions, ...checklistGroup.data];
    checklistGroupOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }

  if (checkList && checkList.loading) {
    checklistOptions = [{ name: 'Loading..' }];
  }

  if (check_list_id && check_list_id.length && check_list_id.length > 0) {
    const oldId = [{ id: check_list_id[0], name: check_list_id[1] }];
    const newArr = [...checklistOptions, ...oldId];
    checklistOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }

  if (checkList && checkList.data) {
    const arr = [...checklistOptions, ...checkList.data];
    checklistOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }

  if (parentScheduleInfo && parentScheduleInfo.loading) {
    parentOptions = [{ uuid: 'Loading..' }];
  }

  if (parent_id) {
    // const oldId = [{ id: parent_id.id, name: extractNameObject(parent_id.group_id, 'name') }];
    const oldId = [{ id: parent_id.id, uuid: parent_id.uuid }];
    const newArr = [...parentOptions, ...oldId];
    parentOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }

  function getNewData(array) {
    const data = [];
    const parentData = array;
    for (let i = 0; i < parentData.length; i += 1) {
      // parentData[i].name = parentData[i].group_id && array[i].group_id[1];
      parentData[i].name = parentData[i].uuid;
      data.push(parentData[i]);
    }
    return data;
  }

  if (parentScheduleInfo && parentScheduleInfo.data) {
    const parentScheduleInfoData = getNewData(parentScheduleInfo.data);
    const arr = [...parentOptions, ...parentScheduleInfoData];
    parentOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

  // function getParentData(oldData) {
  //   return oldData ? extractNameObject(oldData.group_id, 'name') : '';
  // }

  function getParentData(oldData) {
    return oldData ? extractNameObject(oldData.uuid, 'uuid') : '';
  }

  function getDifferece(date2) {
    const date1 = new Date();
    const Difference_In_Time = date2.getTime() - date1.getTime();
    const Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    return Difference_In_Days;
  }
  const { formField } = checkoutFormModel;
  const isAll = !!(window.localStorage.getItem('isAllCompany') && window.localStorage.getItem('isAllCompany') === 'yes');
  const cancelSpace = () => {
    dispatch(resetSpace());
  };

  const handleCommenseDateChange = (date) => {
    setCommenseDateChange(date);
    setFieldValue('commences_on', date);
  };

  const handleEndsOnDateChange = (date) => {
    setEndsOnDateChange(date);
    setFieldValue('ends_on', date);
  };


  return (
    <Box
      sx={{
        width: "100%",
        marginTop: "20px",
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: "3%",
          flexWrap: "wrap",
        }}
      >
        <FormControl
          sx={{
            width: "95%",
            marginTop: "auto",
            marginBottom: "20px",
          }}
          variant="standard"
        >
          <MuiAutoComplete
            name={formField.groupId.name}
            label={formField.groupId.label}
            open={groupOpen}
            oldValue={getOldData(group_id)}
            value={group_id && group_id.name ? group_id.name : getOldData(group_id)}
            onOpen={() => {
              setGroupOpen(true);
            }}
            onClose={() => {
              setGroupOpen(false);
            }}
            // apiError={(checklistGroup && checklistGroup.err) ? generateErrorMessage(checklistGroup) : false}
            loading={checklistGroup && checklistGroup.loading}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={checklistGroupOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                onChange={onGroupKeywordChange}
                label={formField.groupId.label}
                required
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {checklistGroup && checklistGroup.loading ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {((getOldData(group_id)) || (group_id && group_id.id) || (groupKeyword && groupKeyword.length > 0)) && (
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={onGroupClear}
                          >
                            <IoCloseOutline size={22} fontSize="small" />
                          </IconButton>
                        )}
                        <IconButton
                          aria-label="toggle search visibility"
                          onClick={showGroupModal}
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
        </FormControl>
        <Box
          sx={{
            width: "100%",
            marginTop: "20px",
          }}
        >
          <Typography
            sx={AddThemeColor({
              font: "normal normal medium 20px/24px Suisse Intl",
              letterSpacing: "0.7px",
              fontWeight: 500,
            })}
          >
            Asset Info
          </Typography>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "3%",
              flexWrap: "wrap",
            }}
          >
            <FormControl
              sx={{
                width: "30%",
                marginTop: "auto",
                marginBottom: "20px",
              }}
              variant="standard"
            >
              <MuiAutoComplete
                name={formField.type.name}
                label={formField.type.label}
                open={ppmForOpen}
                oldValue={getInspectionForLabel(category_type)}
                value={category_type && category_type.label ? category_type.label : getInspectionForLabel(category_type)}
                onOpen={() => {
                  setPpmForOpen(true);
                }}
                onClose={() => {
                  setPpmForOpen(false);
                }}
                getOptionSelected={(option, value) => option.label === value.label}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                options={preventiveActions.inspectionType}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    required
                    onChange={onGroupKeywordChange}
                    label={formField.type.label}
                  />
                )}
              />
            </FormControl>
            <FormControl
              sx={{
                width: "30%",
                marginTop: "auto",
                marginBottom: "20px",
              }}
              variant="standard"
            >
              {typeValue === 'Space' ? (
                <MuiAutoComplete
                  name={spaceId.name}
                  label={spaceId.label}
                  open={spaceOpen}
                  isRequired
                  onOpen={() => {
                    setSpaceOpen(true);
                    setSpaceKeyword('');
                  }}
                  onClose={() => {
                    setSpaceOpen(false);
                    setSpaceKeyword('');
                  }}
                  oldValue={getOldData(space_id)}
                  value={space_id && space_id.path_name ? space_id.path_name : getOldData(space_id)}
                  loading={spaceInfoList && spaceInfoList.loading}
                  getOptionSelected={(option, value) => (value.length > 0 ? option.path_name === value.path_name : '')}
                  getOptionLabel={(option) => (typeof option === 'string' ? option : option.path_name)}
                  options={spaceOptions}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      onChange={onSpaceKeywordChange}
                      variant="standard"
                      label={formField.spaceId.label}
                      required
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {spaceInfoList && spaceInfoList.loading ? <CircularProgress color="inherit" size={20} /> : null}
                            <InputAdornment position="end">
                              {((getOldData(space_id)) || (space_id && space_id.id) || (spacekeyword && spacekeyword.length > 0)) && (
                                <IconButton onClick={onSpaceClear}>
                                  <IoCloseOutline size={22} fontSize="small" />
                                </IconButton>
                              )}
                              <IconButton onClick={onSpaceSearch}>
                                <SearchIcon fontSize="small" />
                              </IconButton>
                            </InputAdornment>
                          </>
                        ),
                      }}
                    />
                  )}
                />) : (
                typeValue === 'Equipment' ?
                  <MuiAutoComplete
                    name={equipmentId.name}
                    label={equipmentId.label}
                    isRequired
                    open={equipmentOpen}
                    oldValue={getOldData(equipment_id)}
                    value={equipment_id && equipment_id.name ? equipment_id.name : getOldData(equipment_id)}
                    onOpen={() => {
                      setEquipmentOpen(true);
                      setEquipmentkeyword('');
                    }}
                    onClose={() => {
                      setEquipmentOpen(false);
                      setEquipmentkeyword('');
                    }}
                    loading={equipmentInfo && equipmentInfo.loading}
                    getOptionSelected={(option, value) => (value.length > 0 ? option.name === value.name : '')}
                    getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                    options={equipmentOptions}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        onChange={onEquipmentKeywordChange}
                        variant="standard"
                        label={formField.equipmentId.label}
                        required
                        placeholder="Search & Select"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {equipmentInfo && equipmentInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                              <InputAdornment position="end">
                                {(equipment_id && equipment_id.id) && (
                                  <IconButton onClick={onEquipmentClear}>
                                    <IoCloseOutline size={22} fontSize="small" />
                                  </IconButton>
                                )}
                                <IconButton onClick={onEquipemntSearch}>
                                  <SearchIcon fontSize="small" />
                                </IconButton>
                              </InputAdornment>
                            </>
                          ),
                        }}
                      />
                    )}
                  /> : '')}
            </FormControl>
          </Box>
        </Box>
        <Box
          sx={{
            width: "100%",
            marginTop: "20px",
          }}
        >
          <Typography
            sx={AddThemeColor({
              font: "normal normal medium 20px/24px Suisse Intl",
              letterSpacing: "0.7px",
              fontWeight: 500,
            })}
          >
            Maintenance Info
          </Typography>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "3%",
              flexWrap: "wrap",
            }}
          >
            <FormControl
              sx={{
                width: "30%",
                marginTop: "auto",
                marginBottom: "20px",
              }}
              variant="standard"
            >
              <MuiAutoComplete
                name={formField.maintenanceTeamId.name}
                label={formField.maintenanceTeamId.label}
                open={teamOpen}
                oldValue={maintenance_team_id}
                value={maintenance_team_id && maintenance_team_id.name ? maintenance_team_id.name : maintenance_team_id}
                onOpen={() => {
                  setTeamOpen(true);
                }}
                onClose={() => {
                  setTeamOpen(false);
                }}
                apiError={(teamsInfo && teamsInfo.err) ? generateErrorMessage(teamsInfo) : false}
                loading={teamsInfo && teamsInfo.loading}
                getOptionSelected={(option, value) => option.name === value.name}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                options={teamOptions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    onChange={onTeamKeywordChange}
                    label={formField.maintenanceTeamId.label}
                    required
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {maintenance_team_id && maintenance_team_id.loading ? <CircularProgress color="inherit" size={20} /> : null}
                          <InputAdornment position="end">
                            {((maintenance_team_id) || (maintenance_team_id && maintenance_team_id.id) || (teamKeyword && teamKeyword.length > 0)) && (
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={onTeamClear}
                              >
                                <IoCloseOutline size={22} fontSize="small" />
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
            </FormControl>
            <FormControl
              sx={{
                width: "30%",
                marginTop: "auto",
                marginBottom: "20px",
              }}
              variant="standard"
            >
              <MuiAutoComplete
                name={formField.taskId.name}
                label={formField.taskId.label}
                open={taskOpen}
                oldValue={task_id}
                value={task_id && task_id.name ? task_id.name : ''}
                onOpen={() => {
                  setTaskOpen(true);
                }}
                onClose={() => {
                  setTaskOpen(false);
                }}
                // apiError={(teamsInfo && teamsInfo.err) ? generateErrorMessage(teamsInfo) : false}
                // loading={taskInfo && taskInfo.loading}
                getOptionSelected={(option, value) => option.name === value.name}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                options={taskOptions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    onChange={onTaskKeywordChange}
                    label={formField.taskId.label}
                  />
                )}
              />
            </FormControl>
            <FormControl
              sx={{
                width: "30%",
                marginTop: "auto",
                marginBottom: "20px",
              }}
              variant="standard"
            >
              <MuiAutoComplete
                name={formField.checklistId.name}
                label={formField.checklistId.label}
                open={checkListOpen}
                oldValue={getOldData(check_list_id)}
                value={check_list_id && check_list_id.name ? check_list_id.name : getOldData(check_list_id)}
                onOpen={() => {
                  setCheckListOpen(true);
                }}
                onClose={() => {
                  setCheckListOpen(false);
                }}
                // apiError={(teamsInfo && teamsInfo.err) ? generateErrorMessage(teamsInfo) : false}
                loading={checkList && checkList.loading}
                getOptionSelected={(option, value) => option.name === value.name}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                options={checklistOptions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    onChange={onChecklistKeywordChange}
                    label={formField.checklistId.label}
                    required
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {check_list_id && check_list_id.loading ? <CircularProgress color="inherit" size={20} /> : null}
                          <InputAdornment position="end">
                            {((check_list_id) || (check_list_id && check_list_id.id) || (checkListKeyword && checkListKeyword.length > 0)) && (
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={onChecklistClear}
                              >
                                <IoCloseOutline size={22} fontSize="small" />
                              </IconButton>
                            )}
                            <IconButton
                              aria-label="toggle search visibility"
                              onClick={showChecklistModal}
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
            </FormControl>
            <FormControl
              sx={{
                width: "30%",
                marginTop: "auto",
                marginBottom: "20px",
              }}
              variant="standard"
            >
              <MuiTextField
                fullWidth
                name={formField.startsAt.name}
                label={formField.startsAt.label}
                setFieldValue={setFieldValue}
                variant="standard"
                isRequired
                onKeyPress={decimalKeyPress}
                inputProps={{ maxLength: 5 }}
                value={formField.startsAt.name}
                placeholder="0.00"
              />
            </FormControl>
            <FormControl
              sx={{
                width: "30%",
                marginTop: "auto",
                marginBottom: "20px",
              }}
              variant="standard"
            >
              <MuiTextField
                fullWidth
                name={formField.durationAt.name}
                label={formField.durationAt.label}
                setFieldValue={setFieldValue}
                variant="standard"
                isRequired
                onKeyPress={decimalKeyPress}
                inputProps={{ maxLength: 5 }}
                value={formField.durationAt.name}
                placeholder="0.00"
              />
            </FormControl>
            <MuiCheckboxField
              name={excludeHolidays.name}
              label={excludeHolidays.label}
            />
            <FormControl
              sx={{
                width: "30%",
                marginTop: "auto",
                marginBottom: "20px",
              }}
              variant="standard"
            >
              <MuiAutoComplete
                name={formField.parentSchedule.name}
                label={formField.parentSchedule.label}
                open={parentOpen}
                oldValue={getParentData(parent_id)}
                value={parent_id && parent_id.uuid ? parent_id.uuid : getParentData(parent_id)}
                onOpen={() => {
                  setParentOpen(true);
                }}
                onClose={() => {
                  setParentOpen(false);
                }}
                // apiError={(teamsInfo && teamsInfo.err) ? generateErrorMessage(teamsInfo) : false}
                loading={parentScheduleInfo && parentScheduleInfo.loading}
                getOptionSelected={(option, value) => option.uuid === value.uuid}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.uuid)}
                options={parentOptions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    onChange={onParentKeywordChange}
                    label={formField.parentSchedule.label}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {parent_id && parent_id.loading ? <CircularProgress color="inherit" size={20} /> : null}
                          <InputAdornment position="end">
                            {((parent_id) || (parent_id && parent_id.id) || (parentKeyword && parentKeyword.length > 0)) && (
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={onParentClear}
                              >
                                <IoCloseOutline size={22} fontSize="small" />
                              </IconButton>
                            )}
                            <IconButton
                              aria-label="toggle search visibility"
                              onClick={showParentModal}
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
            </FormControl>
          </Box>
        </Box>
        <Box
          sx={{
            width: "100%",
            marginTop: "20px",
          }}
        >
          <Typography
            sx={AddThemeColor({
              font: "normal normal medium 20px/24px Suisse Intl",
              letterSpacing: "0.7px",
              fontWeight: 500,
            })}
          >
            Schedule Info
          </Typography>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "3%",
              flexWrap: "wrap",
            }}
          >
            <FormControl
              sx={{
                width: "30%",
                marginTop: "auto",
                marginBottom: "20px",
              }}
              variant="standard"
            >
              <MuiAutoComplete
                name={formField.priorityValue.name}
                label={formField.priorityValue.label}
                open={priorityOpen}
                oldValue={getPriorityLabel(priority)}
                value={priority && priority.label ? priority.label : getPriorityLabel(priority)}
                onOpen={() => {
                  setPriorityOpen(true);
                }}
                onClose={() => {
                  setPriorityOpen(false);
                }}
                // apiError={(teamsInfo && teamsInfo.err) ? generateErrorMessage(teamsInfo) : false}
                // loading={parentScheduleInfo && parentScheduleInfo.loading}
                getOptionSelected={(option, value) => option.label === value.label}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                options={preventiveActions.priority}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    label={formField.priorityValue.label}
                  />
                )}
              />
            </FormControl>
            <FormControl
              sx={{
                width: "30%",
                marginTop: "auto",
                marginBottom: "20px",
              }}
              variant="standard"
            >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DateTimePicker']}>
                  <DateTimePicker
                    sx={{ width: '95%' }}
                    localeText={{ todayButtonLabel: 'Now' }}
                    slotProps={{
                      actionBar: {
                        actions: ['today', 'clear'],
                      },
                      textField: { variant: 'standard',   required: true,}
                    }}
                    name={commencesOn.name}
                    label={commencesOn.label}
                    value={selectedCommenseDate}
                    onChange={handleCommenseDateChange}                    
                    ampm={false}
                    disablePast
                  />
                </DemoContainer>
              </LocalizationProvider>
            </FormControl>
            <FormControl
              sx={{
                width: "30%",
                marginTop: "auto",
                marginBottom: "20px",
              }}
              variant="standard"
            >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DateTimePicker']}>
                  <DateTimePicker
                    sx={{ width: '95%' }}
                    localeText={{ todayButtonLabel: 'Now' }}
                    slotProps={{
                      actionBar: {
                        actions: ['today', 'clear'],
                      },
                      textField: { variant: 'standard', }
                    }}
                    name={endsOn.name}
                    label={endsOn.label}
                    value={selectedEndsOnDate}
                    onChange={handleEndsOnDateChange}
                    ampm={false}
                    disablePast
                  />
                </DemoContainer>
              </LocalizationProvider>
            </FormControl>
            <FormControl
              sx={{
                width: "30%",
                marginTop: "auto",
                marginBottom: "20px",
              }}
              variant="standard"
            >
              <MuiTextField
                fullWidth
                name={formField.descriptionValue.name}
                label={formField.descriptionValue.label}
                setFieldValue={setFieldValue}
                variant="standard"
                isRequired
                value={formField.descriptionValue.name}
              />
            </FormControl>
          </Box>
        </Box>
        <Box
          sx={{
            width: "100%",
            marginTop: "20px",
          }}
        >
          <Typography
            sx={AddThemeColor({
              font: "normal normal medium 20px/24px Suisse Intl",
              letterSpacing: "0.7px",
              fontWeight: 500,
            })}
          >
            Notifications
          </Typography>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "3%",
              flexWrap: "wrap",
            }}
          >
            <FormControl
              sx={{
                width: "30%",
                marginTop: "auto",
                marginBottom: "20px",
              }}
              variant="standard"
            >
              <MuiTextField
                fullWidth
                name={formField.remindBefore.name}
                label={formField.remindBefore.label}
                setFieldValue={setFieldValue}
                variant="standard"
                value={formField.remindBefore.name}
              />
            </FormControl>
            <FormControl
              sx={{
                width: "30%",
                marginTop: "auto",
                marginBottom: "20px",
              }}
              variant="standard"
            >
              <MuiAutoComplete
                name={formField.recipients.name}
                label={formField.recipients.label}
                open={employeeShow}
                oldValue={getOldData(recipients_id)}
                value={recipients_id && recipients_id.name ? recipients_id.name : getOldData(recipients_id)} onOpen={() => {
                  setEmployeeOpen(true);
                }}
                onClose={() => {
                  setEmployeeOpen(false);
                }}
                // apiError={(teamsInfo && teamsInfo.err) ? generateErrorMessage(teamsInfo) : false}
                loading={employeesInfo && employeesInfo.loading}
                getOptionSelected={(option, value) => option.name === value.name}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                options={employeeOptions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    onChange={onEmployeeKeywordChange}
                    label={formField.recipients.label}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {recipients_id && recipients_id.loading ? <CircularProgress color="inherit" size={20} /> : null}
                          <InputAdornment position="end">
                            {((recipients_id) || (recipients_id && recipients_id.id) || (employeeKeyword && employeeKeyword.length > 0)) && (
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={onArKeywordClear}
                              >
                                <IoCloseOutline size={22} fontSize="small" />
                              </IconButton>
                            )}
                            <IconButton
                              aria-label="toggle search visibility"
                              onClick={showReceivableModal}
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
            </FormControl>
            <MuiCheckboxField
              name={missedAlert.name}
              label={missedAlert.label}
            />
          </Box>
        </Box>
      </Box>
      <Dialog size="lg" fullWidth open={extraModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraModal(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <AdvancedSearchModal
              modelName={modelValue}
              modalName={modalName}
              afterReset={() => { setExtraModal(false); }}
              fieldName={fieldName}
              fields={columns}
              company={companyValue}
              otherFieldName={otherFieldName}
              otherFieldValue={otherFieldValue}
              setFieldValue={setFieldValue}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Dialog size="xl" fullWidth open={extraSearchModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraSearchModal(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <SearchModal
              modelName={modelValue}
              modalName={modalName}
              afterReset={() => { setExtraSearchModal(false); }}
              fieldName={fieldName}
              fields={columns}
              company={companyValue}
              otherFieldName={otherFieldName}
              otherFieldValue={otherFieldValue}
              setFieldValue={setFieldValue}
              placeholderName="Search .."
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Dialog size="xl" fullWidth open={extraMultipleModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraMultipleModal(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <SearchModalMultiple
              modelName={modelValue}
              afterReset={() => { setExtraMultipleModal(false); }}
              fieldName={fieldName}
              fields={columns}
              company={companyValue}
              modalName={modalName}
              otherFieldName={otherFieldName}
              otherFieldValue={otherFieldValue}
              setFieldValue={setFieldValue}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Dialog size={'xl'} fullWidth open={addCustomerModal}>
        <DialogHeader title="Add Customer" imagePath={false} onClose={() => { setAddCustomerModal(false); }} response={createTenantinfo} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <AddCustomer
              afterReset={() => { setAddCustomerModal(false); }}
              setFieldValue={setFieldValue}
              requestorName={customerKeyword}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </Box>



    // <ThemeProvider theme={theme}>
    //   <Row>
    //       <Col xs={12} sm={6} md={6} lg={6} className="mt-0">
    //       <FormikAutocomplete
    //         name={groupId.name}
    //         label={groupId.label}
    //         className="bg-white"
    //         open={groupOpen}
    //         size="small"
    //         isRequired
    //         oldValue={getOldData(group_id)}
    //         value={group_id && group_id.name ? group_id.name : getOldData(group_id)}
    //         onOpen={() => {
    //           setGroupOpen(true);
    //         }}
    //         onClose={() => {
    //           setGroupOpen(false);
    //         }}
    //         loading={checklistGroup && checklistGroup.loading}
    //         getOptionSelected={(option, value) => option.name === value.name}
    //         getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
    //         options={checklistGroupOptions}
    //         renderInput={(params) => (
    //             <TextField
    //               {...params}
    //               onChange={onGroupKeywordChange}
    //               variant="outlined"
    //               value={groupKeyword}
    //               className={(getOldData(group_id) || (group_id && group_id.id) || (groupKeyword && groupKeyword.length > 0))
    //                 ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
    //               placeholder="Search & Select"
    //               InputProps={{
    //                 ...params.InputProps,
    //                 endAdornment: (
    //                   <>
    //                     {checklistGroup && checklistGroup.loading ? <CircularProgress color="inherit" size={20} /> : null}
    //                     <InputAdornment position="end">
    //                       {(getOldData(group_id) || (group_id && group_id.id) || (groupKeyword && groupKeyword.length > 0)) && (
    //                       <IconButton onClick={onGroupClear}>
    //                         <BackspaceIcon fontSize="small" />
    //                       </IconButton>
    //                       )}
    //                       <IconButton onClick={showGroupModal}>
    //                         <SearchIcon fontSize="small" />
    //                       </IconButton>
    //                     </InputAdornment>
    //                   </>
    //                 ),
    //               }}
    //             />
    //         )}
    //       />
    //         {/* {(checklistGroup && checklistGroup.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(checklistGroup)}</span></FormHelperText>)} */}
    //       </Col>
    //   </Row>
    //     <Row>
    //       <Col xs={12} sm={6} md={6} lg={6} className="mt-2">
    //         <Card className="no-border-radius mb-2">
    //           <CardBody className="p-0 bg-porcelain">
    //             <p className="ml-2 mb-1 mt-1 font-weight-600 font-side-heading">Asset Info</p>
    //           </CardBody>
    //         </Card>
    //         <FormikAutocomplete
    //           name={type.name}
    //           isRequired={type.required}
    //           label={type.label}
    //           className="bg-white"
    //           open={ppmForOpen}
    //           disableClearable
    //           oldValue={getInspectionForLabel(category_type)}
    //           value={category_type && category_type.label ? category_type.label : getInspectionForLabel(category_type)}
    //           size="small"
    //           onOpen={() => {
    //             setPpmForOpen(true);
    //           }}
    //           onClose={() => {
    //             setPpmForOpen(false);
    //           }}
    //           getOptionSelected={(option, value) => option.label === value.label}
    //           getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
    //           options={preventiveActions.inspectionType}
    //           renderInput={(params) => (
    //             <TextField
    //               {...params}
    //               variant="outlined"
    //               className="without-padding"
    //               placeholder="Select"
    //               InputProps={{
    //                 ...params.InputProps,
    //                 endAdornment: (
    //                   <>
    //                     {params.InputProps.endAdornment}
    //                   </>
    //                 ),
    //               }}
    //             />
    //           )}
    //         />
    //       </Col>
    //       <Col xs={12} sm={6} md={6} lg={6} className="mt-2">
    //         <Card className="no-border-radius mb-2">
    //           <CardBody className="p-0 bg-porcelain">
    //             <p className="ml-2 mb-1 mt-1 font-weight-600 font-side-heading">Maintenance Info</p>
    //           </CardBody>
    //         </Card>
    //         <FormikAutocomplete
    //           name={maintenanceTeamId.name}
    //           label={maintenanceTeamId.label}
    //           className="bg-white"
    //           open={teamOpen}
    //           size="small"
    //           isRequired
    //           oldValue={getOldData(maintenance_team_id)}
    //           value={maintenance_team_id && maintenance_team_id.name ? maintenance_team_id.name : getOldData(maintenance_team_id)}
    //           onOpen={() => {
    //             setTeamOpen(true);
    //           }}
    //           onClose={() => {
    //             setTeamOpen(false);
    //           }}
    //           loading={teamsInfo && teamsInfo.loading}
    //           getOptionSelected={(option, value) => option.name === value.name}
    //           getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
    //           options={teamOptions}
    //           renderInput={(params) => (
    //             <TextField
    //               {...params}
    //               onChange={onTeamKeywordChange}
    //               variant="outlined"
    //               value={teamKeyword}
    //               className={(getOldData(maintenance_team_id) || (maintenance_team_id && maintenance_team_id.id) || (teamKeyword && teamKeyword.length > 0))
    //                 ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
    //               placeholder="Search & Select"
    //               InputProps={{
    //                 ...params.InputProps,
    //                 endAdornment: (
    //                   <>
    //                     {teamsInfo && teamsInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
    //                     <InputAdornment position="end">
    //                       {(getOldData(maintenance_team_id) || (maintenance_team_id && maintenance_team_id.id) || (teamKeyword && teamKeyword.length > 0)) && (
    //                       <IconButton onClick={onTeamClear}>
    //                         <BackspaceIcon fontSize="small" />
    //                       </IconButton>
    //                       )}
    //                       <IconButton onClick={showTeamModal}>
    //                         <SearchIcon fontSize="small" />
    //                       </IconButton>
    //                     </InputAdornment>
    //                   </>
    //                 ),
    //               }}
    //             />
    //           )}
    //         />
    //         {/* {(teamsInfo && teamsInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(teamsInfo)}</span></FormHelperText>)} */}
    //       </Col>
    //     </Row>
    //     <Row>
    //       {typeValue === 'Space'
    //         ? (
    //           <Col xs={12} sm={6} md={6} lg={6}>
    //           <FormikAutocomplete
    //             name={spaceId.name}
    //             label={spaceId.label}
    //             className="bg-white"
    //             open={spaceOpen}
    //             isRequired
    //             size="small"
    //             onOpen={() => {
    //               setSpaceOpen(true);
    //               setSpaceKeyword('');
    //             }}
    //             onClose={() => {
    //               setSpaceOpen(false);
    //               setSpaceKeyword('');
    //             }}
    //             oldValue={getOldData(space_id)}
    //             value={space_id && space_id.path_name ? space_id.path_name : getOldData(space_id)}
    //             loading={spaceInfoList && spaceInfoList.loading}
    //             getOptionSelected={(option, value) => (value.length > 0 ? option.path_name === value.path_name : '')}
    //             getOptionLabel={(option) => (typeof option === 'string' ? option : option.path_name)}
    //             options={spaceOptions}
    //             renderInput={(params) => (
    //               <TextField
    //                 {...params}
    //                 onChange={onSpaceKeywordChange}
    //                 variant="outlined"
    //                 className={((getOldData(space_id)) || (space_id && space_id.id) || (spacekeyword && spacekeyword.length > 0))
    //                   ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
    //                 placeholder="Search & Select"
    //                 InputProps={{
    //                   ...params.InputProps,
    //                   endAdornment: (
    //                     <>
    //                       {spaceInfoList && spaceInfoList.loading ? <CircularProgress color="inherit" size={20} /> : null}
    //                       <InputAdornment position="end">
    //                         {((getOldData(space_id)) || (space_id && space_id.id) || (spacekeyword && spacekeyword.length > 0)) && (
    //                         <IconButton onClick={onSpaceClear}>
    //                           <BackspaceIcon fontSize="small" />
    //                         </IconButton>
    //                         )}
    //                         <IconButton onClick={onSpaceSearch}>
    //                           <SearchIcon fontSize="small" />
    //                         </IconButton>
    //                       </InputAdornment>
    //                     </>
    //                   ),
    //                 }}
    //               />
    //             )}
    //           />
    //           {/* {(spaceInfoList && spaceInfoList.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(spaceInfoList)}</span></FormHelperText>)} */}
    //           </Col>
    //         )
    //         : (
    //         <Col xs={12} sm={6} md={6} lg={6}>
    //           {typeValue === 'Equipment'
    //             ? (
    //               <FormikAutocomplete
    //                 name={equipmentId.name}
    //                 label={equipmentId.label}
    //                 isRequired
    //                 className="bg-white"
    //                 open={equipmentOpen}
    //                 size="small"
    //                 oldValue={getOldData(equipment_id)}
    //                 value={equipment_id && equipment_id.name ? equipment_id.name : getOldData(equipment_id)}
    //                 onOpen={() => {
    //                   setEquipmentOpen(true);
    //                   setEquipmentkeyword('');
    //                 }}
    //                 onClose={() => {
    //                   setEquipmentOpen(false);
    //                   setEquipmentkeyword('');
    //                 }}
    //                 loading={equipmentInfo && equipmentInfo.loading}
    //                 getOptionSelected={(option, value) => (value.length > 0 ? option.name === value.name : '')}
    //                 getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
    //                 options={equipmentOptions}
    //                 renderInput={(params) => (
    //                   <TextField
    //                     {...params}
    //                     onChange={onEquipmentKeywordChange}
    //                     variant="outlined"
    //                     className={((getOldData(equipment_id)) || (equipment_id && equipment_id.id) || (equipmentkeyword && equipmentkeyword.length > 0))
    //                       ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
    //                     placeholder="Search & Select"
    //                     InputProps={{
    //                       ...params.InputProps,
    //                       endAdornment: (
    //                         <>
    //                           {equipmentInfo && equipmentInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
    //                           <InputAdornment position="end">
    //                             {(equipment_id && equipment_id.id) && (
    //                             <IconButton onClick={onEquipmentClear}>
    //                               <BackspaceIcon fontSize="small" />
    //                             </IconButton>
    //                             )}
    //                             <IconButton onClick={onEquipemntSearch}>
    //                               <SearchIcon fontSize="small" />
    //                             </IconButton>
    //                           </InputAdornment>
    //                         </>
    //                       ),
    //                     }}
    //                   />
    //                 )}
    //               />
    //             ) : ''}
    //           {/* {(equipmentInfo && equipmentInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(equipmentInfo)}</span></FormHelperText>)} */}
    //         </Col>
    //         )}
    //       <Col xs={12} sm={6} md={6} lg={6}>
    //         <FormikAutocomplete
    //           name={taskId.name}
    //           label={taskId.label}
    //           className="bg-white"
    //           open={taskOpen}
    //           size="small"
    //           oldValue={getOldData(task_id)}
    //           value={task_id && task_id.name ? task_id.name : getOldData(task_id)}
    //           onOpen={() => {
    //             setTaskOpen(true);
    //           }}
    //           onClose={() => {
    //             setTaskOpen(false);
    //           }}
    //           loading={taskInfo && taskInfo.loading}
    //           getOptionSelected={(option, value) => option.name === value.name}
    //           getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
    //           options={taskOptions}
    //           renderInput={(params) => (
    //             <TextField
    //               {...params}
    //               onChange={onTaskKeywordChange}
    //               variant="outlined"
    //               className="without-padding"
    //               placeholder="Search & Select"
    //               InputProps={{
    //                 ...params.InputProps,
    //                 endAdornment: (
    //                   <>
    //                     {taskInfo && taskInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
    //                     {params.InputProps.endAdornment}
    //                   </>
    //                 ),
    //               }}
    //             />
    //           )}
    //         />
    //         {/* {(taskInfo && taskInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(taskInfo)}</span></FormHelperText>)} */}
    //       </Col>
    //     </Row>
    //     <Row>
    //     <Col xs={12} sm={6} md={6} lg={6} />
    //     <Col xs={12} sm={6} md={6} lg={6}>
    //       <FormikAutocomplete
    //         name={checklistId.name}
    //         label={checklistId.label}
    //         className="bg-white"
    //         open={checkListOpen}
    //         size="small"
    //         isRequired
    //         oldValue={getOldData(check_list_id)}
    //         value={check_list_id && check_list_id.name ? check_list_id.name : getOldData(check_list_id)}
    //         onOpen={() => {
    //           setCheckListOpen(true);
    //         }}
    //         onClose={() => {
    //           setCheckListOpen(false);
    //         }}
    //         loading={checkList && checkList.loading}
    //         getOptionSelected={(option, value) => option.name === value.name}
    //         getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
    //         options={checklistOptions}
    //         renderInput={(params) => (
    //             <TextField
    //               {...params}
    //               onChange={onChecklistKeywordChange}
    //               variant="outlined"
    //               value={checkListKeyword}
    //               className={(getOldData(check_list_id) || (check_list_id && check_list_id.id) || (checkListKeyword && checkListKeyword.length > 0))
    //                 ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
    //               placeholder="Search & Select"
    //               InputProps={{
    //                 ...params.InputProps,
    //                 endAdornment: (
    //                   <>
    //                     {checkList && checkList.loading ? <CircularProgress color="inherit" size={20} /> : null}
    //                     <InputAdornment position="end">
    //                       {(getOldData(check_list_id) || (check_list_id && check_list_id.id) || (checkListKeyword && checkListKeyword.length > 0)) && (
    //                        <IconButton
    //                          aria-label="toggle password visibility"
    //                          onClick={onChecklistClear}
    //                        >
    //                             <BackspaceIcon fontSize="small" />
    //                        </IconButton>
    //                       )}
    //                         <IconButton
    //                           aria-label="toggle search visibility"
    //                           onClick={showChecklistModal}
    //                         >
    //                           <SearchIcon fontSize="small" />
    //                         </IconButton>
    //                     </InputAdornment>
    //                   </>
    //                 ),
    //               }}
    //             />
    //         )}
    //       />
    //         {/* {(checkList && checkList.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(checkList)}</span></FormHelperText>)} */}
    //     </Col>
    //     </Row>
    //     <Row>
    //     <Col xs={12} sm={6} md={6} lg={6} />
    //     <Col xs={12} sm={6} md={6} lg={6}>
    //         <InputField name={startsAt.name} isRequired label={startsAt.label} type="text" maxLength="5" placeHolder="0.00" />
    //     </Col>
    //     </Row>
    //     <Row>
    //     <Col xs={12} sm={6} md={6} lg={6} />
    //     <Col xs={12} sm={6} md={6} lg={6}>
    // //         <InputField name={durationAt.name} isRequired label={durationAt.label} type="text" maxLength="5" placeHolder="0.00" />
    //     </Col>
    //     </Row>
    //     <Row>
    //     <Col xs={12} sm={6} md={6} lg={6} />
    //     <Col xs={12} sm={6} md={6} lg={6}>
    //       <br />
    //             <CheckboxField
    //               name={excludeHolidays.name}
    //               label={excludeHolidays.label}
    //             />
    //     </Col>
    //     </Row>
    //     <Row>
    //     <Col xs={12} sm={6} md={6} lg={6} />
    //       <Col xs={12} sm={6} md={6} lg={6} className="mt-2">
    //       <FormikAutocomplete
    //         name={parentSchedule.name}
    //         label={parentSchedule.label}
    //         className="bg-white"
    //         open={parentOpen}
    //         size="small"
    //         oldValue={getParentData(parent_id)}
    //         value={parent_id && parent_id.uuid ? parent_id.uuid : getOldData(parent_id)}
    //         onOpen={() => {
    //           setParentOpen(true);
    //         }}
    //         onClose={() => {
    //           setParentOpen(false);
    //         }}
    //         loading={parentScheduleInfo && parentScheduleInfo.loading}
    //         getOptionSelected={(option, value) => option.uuid === value.uuid}
    //         getOptionLabel={(option) => (typeof option === 'string' ? option : option.uuid)}
    //         options={parentOptions}
    //         renderInput={(params) => (
    //             <TextField
    //               {...params}
    //               onChange={onParentKeywordChange}
    //               variant="outlined"
    //               value={parentKeyword}
    //               className={(getParentData(parent_id) || (parent_id && parent_id.id) || (parentKeyword && parentKeyword.length > 0))
    //                 ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
    //               placeholder="Search & Select"
    //               InputProps={{
    //                 ...params.InputProps,
    //                 endAdornment: (
    //                   <>
    //                     {parentScheduleInfo && parentScheduleInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
    //                     <InputAdornment position="end">
    //                       {(getParentData(parent_id) || (parent_id && parent_id.id) || (parentKeyword && parentKeyword.length > 0)) && (
    //                       <IconButton onClick={onParentClear}>
    //                         <BackspaceIcon fontSize="small" />
    //                       </IconButton>
    //                       )}
    //                       <IconButton onClick={showParentModal}>
    //                         <SearchIcon fontSize="small" />
    //                       </IconButton>
    //                     </InputAdornment>
    //                   </>
    //                 ),
    //               }}
    //             />
    //         )}
    //       />
    //         {/* {(parentScheduleInfo && parentScheduleInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(parentScheduleInfo)}</span></FormHelperText>)} */}
    //       </Col>
    //     </Row>
    //     <Row>
    //       <Col xs={12} sm={6} md={6} lg={6} className="mt-3">
    //         <Card className="no-border-radius mb-2">
    //           <CardBody className="p-0 bg-porcelain">
    //             <p className="ml-2 mb-1 mt-1 font-weight-600 font-side-heading">Schedule Info</p>
    //           </CardBody>
    //         </Card>
    //         <FormikAutocomplete
    //           name={priorityValue.name}
    //           label={priorityValue.label}
    //           className="bg-white"
    //           open={priorityOpen}
    //           size="small"
    //           onOpen={() => {
    //             setPriorityOpen(true);
    //           }}
    //           onClose={() => {
    //             setPriorityOpen(false);
    //           }}
    //           oldValue={getPriorityLabel(priority)}
    //           value={priority && priority.label ? priority.label : getPriorityLabel(priority)}
    //           getOptionSelected={(option, value) => option.label === value.label}
    //           getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
    //           options={preventiveActions.priority}
    //           renderInput={(params) => (
    //             <TextField
    //               {...params}
    //               variant="outlined"
    //               className="without-padding"
    //               placeholder="Select"
    //               InputProps={{
    //                 ...params.InputProps,
    //                 endAdornment: (
    //                   <>
    //                     {params.InputProps.endAdornment}
    //                   </>
    //                 ),
    //               }}
    //             />
    //           )}
    //         />
    //       </Col>
    //       <Col xs={12} sm={6} md={6} lg={6} className="mt-3">
    //         <Card className="no-border-radius mb-2">
    //           <CardBody className="p-0 bg-porcelain">
    //             <p className="ml-2 mb-1 mt-1 font-weight-600 font-side-heading">Notifications</p>
    //           </CardBody>
    //         </Card>
    //         <InputField name={remindBefore.name} label={remindBefore.label} type="text" onKeyPress={decimalKeyPress} maxLength="5" />
    //       </Col>
    //     </Row>
    //     <Row>
    //       <Col xs={12} sm={6} md={6} lg={6}>
    //       <DateTimeField
    //         name={commencesOn.name}
    //         label={commencesOn.label}
    //         isRequired={commencesOn.required}
    //         setFieldValue={setFieldValue}
    //         setFieldTouched={setFieldTouched}
    //         placeholder={commencesOn.label}
    //         disablePastDate
    //         defaultValue={commences_on ? new Date(getDateTimeSeconds(commences_on)) : ''}
    //       />
    //       </Col>
    //       <Col xs={12} sm={6} md={6} lg={6}>
    //       <br />
    //             <CheckboxField
    //               name={missedAlert.name}
    //               label={missedAlert.label}
    //             />
    //       </Col>
    //     </Row>
    //     <Row>
    //       <Col xs={12} sm={6} md={6} lg={6}>
    //       <DateTimeField
    //         name={endsOn.name}
    //         label={endsOn.label}
    //         isRequired={endsOn.required}
    //         setFieldValue={setFieldValue}
    //         setFieldTouched={setFieldTouched}
    //         placeholder={endsOn.label}
    //         disablePastDate
    //         disableCustom
    //         subnoofdays={commences_on ? getDifferece(new Date(commences_on)) : 0}
    //         defaultValue={ends_on ? new Date(getDateTimeSeconds(ends_on)) : ''}
    //       />
    //       </Col>
    //       <Col xs={12} sm={6} md={6} lg={6}>
    //         <FormikAutocomplete
    //           name={recipients.name}
    //           label={recipients.label}
    //           formGroupClassName="m-1"
    //           className="bg-white"
    //           oldValue={getOldData(                                )}
    //           value={recipients_id && recipients_id.name ? recipients_id.name : getOldData(recipients_id)}
    //           open={employeeShow}
    //           size="small"
    //           onOpen={() => {
    //             setEmployeeOpen(true);
    //             setEmployeeKeyword('');
    //           }}
    //           onClose={() => {
    //             setEmployeeOpen(false);
    //             setEmployeeKeyword('');
    //           }}
    //           loading={employeesInfo && employeesInfo.loading}
    //           getOptionSelected={(option, value) => option.name === value.name}
    //           getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
    //           options={employeeOptions}
    //           renderInput={(params) => (
    //             <TextField
    //               {...params}
    //               onChange={onEmployeeKeywordChange}
    //               variant="outlined"
    //               value={employeeKeyword}
    //               className={((recipients_id && recipients_id.id) || (employeeKeyword && employeeKeyword.length > 0) || (recipients_id && recipients_id.length))
    //                 ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
    //               placeholder="Search & Select"
    //               InputProps={{
    //                 ...params.InputProps,
    //                 endAdornment: (
    //                   <>
    //                     {employeesInfo && employeesInfo.loading && employeeShow ? <CircularProgress color="inherit" size={20} /> : null}
    //                       <InputAdornment position="end">
    //                         {((recipients_id && recipients_id.id) || (employeeKeyword && employeeKeyword.length > 0) || (recipients_id && recipients_id.length)) && (
    //                           <IconButton
    //                             aria-label="toggle password visibility"
    //                             onClick={onArKeywordClear}
    //                           >
    //                             <BackspaceIcon fontSize="small" />
    //                           </IconButton>
    //                         )}
    //                         <IconButton
    //                           aria-label="toggle search visibility"
    //                           onClick={showReceivableModal}
    //                         >
    //                           <SearchIcon fontSize="small" />
    //                         </IconButton>
    //                       </InputAdornment>
    //                   </>
    //                 ),
    //               }}
    //             />
    //           )}
    //         />
    //         {/* {(employeesInfo && employeesInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(employeesInfo)}</span></FormHelperText>) } */}
    //       </Col>
    //     </Row>
    //     <Row>
    //       <Col xs={12} sm={6} md={6} lg={6}>
    //         <InputField
    //           name={descriptionValue.name}
    //           label={descriptionValue.label}
    //           isRequired
    //           formGroupClassName="m-1"
    //           type="textarea"
    //           rows="4"
    //         />
    //       </Col>
    //     </Row>
    //     <Modal size="xl" className="border-radius-50px modal-dialog-centered" isOpen={extraModal}>
    //       <ModalHeaderComponent title={modalName} imagePath={false} closeModalWindow={() => { setExtraModal(false); }} />
    //       <ModalBody className="mt-0 pt-0">
    //         <AdvancedSearchModal
    //           modelName={modelValue}
    //           modalName={modalName}
    //           afterReset={() => { setExtraModal(false); }}
    //           fieldName={fieldName}
    //           fields={columns}
    //           company={companyValue}
    //           otherFieldName={otherFieldName}
    //           otherFieldValue={otherFieldValue}
    //           setFieldValue={setFieldValue}
    //         />
    //       </ModalBody>
    //     </Modal>
    //     <Modal size="xl" className="border-radius-50px modal-dialog-centered" isOpen={extraSearchModal}>
    //       <ModalHeaderComponent title={modalName} imagePath={false} closeModalWindow={() => { setExtraSearchModal(false); }} />
    //       <ModalBody className="mt-0 pt-0">
    //         <SearchModal
    //           modelName={modelValue}
    //           modalName={modalName}
    //           afterReset={() => { setExtraSearchModal(false); }}
    //           fieldName={fieldName}
    //           fields={columns}
    //           company={companyValue}
    //           otherFieldName={otherFieldName}
    //           otherFieldValue={otherFieldValue}
    //           setFieldValue={setFieldValue}
    //         />
    //       </ModalBody>
    //     </Modal>
    //     <Modal size="xl" className="border-radius-50px modal-dialog-centered" isOpen={extraMultipleModal}>
    //       <ModalHeaderComponent title={modalName} imagePath={false} closeModalWindow={() => { setExtraMultipleModal(false); }} />
    //       <ModalBody className="mt-0 pt-0">
    //         <SearchModalMultiple
    //           modelName={modelValue}
    //           afterReset={() => { setExtraMultipleModal(false); }}
    //           fieldName={fieldName}
    //           fields={columns}
    //           company={companyValue}
    //           modalName={modalName}
    //           otherFieldName={otherFieldName}
    //           otherFieldValue={otherFieldValue}
    //           setFieldValue={setFieldValue}
    //         />
    //       </ModalBody>
    //     </Modal>
    // </ThemeProvider>
  );
};

RequestorForm.defaultProps = {
  editId: undefined,
};

RequestorForm.propTypes = {
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  editId: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),
  reloadData: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  setFieldTouched: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default RequestorForm;
