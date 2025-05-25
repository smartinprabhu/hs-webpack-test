/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable max-len */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-nested-ternary */
/* eslint-disable camelcase */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import {
  CircularProgress, FormHelperText,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Spinner,
  Table,
} from 'reactstrap';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import { CallOutlined, MailOutline } from '@mui/icons-material';
import { IoCloseOutline } from 'react-icons/io5';
import {
  Dialog, DialogContent, DialogContentText, List, ListItemText, RadioGroup, TextField, Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { Cascader, Divider } from 'antd';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { useFormikContext } from 'formik';
import moment from 'moment';
import addIcon from '@images/icons/plusCircleBlue.svg';
import ErrorContent from '@shared/errorContent';
import DialogHeader from '../../commonComponents/dialogHeader';
import MuiAutoComplete from '../../commonComponents/formFields/muiAutocomplete';
import MuiFormLabel from '../../commonComponents/formFields/muiFormLabel';
import MuiTextField from '../../commonComponents/formFields/muiTextField';

import AdditionalForm from './additionalForm';
import {
  resetCreateTenant,
} from '../../adminSetup/setupService';
import {
  getAllSpaces,
  getBuildings,
  getEmployeeDataList,
  getPartners,
} from '../../assets/equipmentService';
import { getCascader, getEquipmentList, getSpaceAllSearchList } from '../../helpdesk/ticketService';
import { addChildrens, addParents } from '../../helpdesk/utils/utils';
import { getOperationsList } from '../../preventiveMaintenance/ppmService';
import { AddThemeColor } from '../../themes/theme';
import {
  decimalKeyPressDown,
  extractOptionsObject, extractOptionsObjectWithName,
  extractTextObject,
  generateErrorMessage,
  getAllowedCompanies,
  getDateTimeLocalMuI,
  getDefaultNoValue,
  getHoursAndMinutes,
  integerKeyPress,
  getDateTimeUtcMuI,
  preprocessData,
  getCompanyTimezoneDate,
} from '../../util/appUtils';
import customData from '../data/customData.json';
import {
  getNatureWork, getPrepareChecklist,
  getTypeWork, getDepartments,
} from '../workPermitService';
import AdvancedSearchModal from './advancedSearchModal';
import SearchModalMultiple from './searchModalMultiple';
// import AddVendor from '../../purchase/vendors/addVendor';
import AddCustomer from '../../adminSetup/siteConfiguration/addTenant/addCustomer';
import MuiDateTimeField from '../../commonComponents/formFields/muiDateTimeField';
import MuiDateField from '../../commonComponents/formFields/muiDateField';
import SpaceSelection from '../../inspectionSchedule/viewer/spaceSelection';
import EquipmentsSelection from '../../commonComponents/equipmentsSelection';

dayjs.extend(utc);
dayjs.extend(timezone);

const appModels = require('../../util/appModels').default;

const useStyles = makeStyles({
  option: {
    padding: 5,
    margin: 5,
    display: 'flow-root',
    '& > span': {
      marginRight: 10,
    },
  },
});

const BasicForm = (props) => {
  const dispatch = useDispatch();
  const {
    setFieldValue,
    formField,
    setFieldTouched,
    editId,
    isShow,
    visibility,
    formField: {
      title,
      requestor,
      equipment,
      space,
      typeValue,
      vendor,
      vendorPoc,
      vendorMobile,
      vendorEmail,
      typeOfRequest,
      workLocation,
      typeOfWork,
      natureOfWork,
      plannedStartTime,
      preparednessCheckList,
      maintenanceCheckList,
      plannedEndTime,
      issuePermitCheckList,
      departmentId,
    },
  } = props;
  const { values: formValues } = useFormikContext();
  const {
    requestor_id, type, space_id, equipment_id, planned_start_time,
    vendor_id, type_work_id, nature_work_id,
    preparedness_checklist_id, valid_through, task_id, type_of_request, planned_end_time,
    approval_authority_id, issue_permit_checklist_id, department_id, start_valid, end_valid,
  } = formValues;
  const classes = useStyles();
  const [atOpen, setAtOpen] = useState(false);
  const [atKeyword, setAtKeyword] = useState('');
  const [spaceOpen, setSpaceOpen] = useState(false);
  const [spacekeyword, setSpaceKeyword] = useState('');
  const [equipmentOpen, setEquipmentOpen] = useState(false);
  const [equipmentkeyword, setEquipmentkeyword] = useState('');
  const [customerOpen, setCustomerOpen] = useState(false);
  const [customerKeyword, setCustomerKeyword] = useState('');
  const [workOpen, setWorkOpen] = useState(false);
  const [typeRequest, setTypeRequest] = useState(false);
  const [workKeyword, setWorkKeyword] = useState('');
  const [natureOpen, setNatureOpen] = useState(false);
  const [natureKeyword, setNatureKeyword] = useState('');
  const [taskOpen, setTaskOpen] = useState(false);
  const [taskKeyword, setTaskKeyword] = useState('');
  const [prepareOpen, setPrepareOpen] = useState(false);
  const [prepareKeyword, setPrepareKeyword] = useState('');
  const [typeData, setTypeData] = useState(false);
  const [natureShow, setNatureShow] = useState(false);
  const [depShow, setDepShow] = useState(false);
  const [vendorShow, setVendorShow] = useState(false);
  const [equipmentShow, setEquipmentShow] = useState(false);
  const [partsData, setPartsData] = useState([]);
  const [placeholderName, setPlaceholder] = useState('');
  const [extraModal, setExtraModal] = useState(false);
  const [extraMultipleModal, setExtraMultipleModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [columns, setColumns] = useState(['id', 'name']);
  const [depOpen, setDepOpen] = useState(false);
  const [depKeyword, setDepKeyword] = useState('');
  const [keywordSearch, setKeywordSearch] = useState('');
  const [validThroughDate, setValidThroughDate] = useState(null);

  const [parentId, setParentId] = useState('');
  const [spaceIds, setSpaceIds] = useState(false);
  const [childLoad, setChildLoad] = useState(false);
  const [cascaderValues, setCascaderValues] = useState([]);
  const [childValues, setChildValues] = useState([]);
  const [addCustomerModal, setAddCustomerModal] = useState(false);
  const [isTypeDisabled, setIsTypeDisabled] = useState(false);
  const [initalSpace, setInitialSpace] = useState(false);
  const [isNatureClear, setNatureClear] = useState(false);
  const [minToDateTime, setMinToDateTime] = useState(dayjs());
  const [maxToDateTime, setMaxToDateTime] = useState(dayjs());

  const [assetFilterModal, setAssetFilterModal] = useState(false);
  const [spaceFilterModal, setSpaceFilterModal] = useState(false);

  const [eqtype, setEqtype] = useState('');
  const [spacetype, setSpacetype] = useState('checked');

  const [equipments, setEquipments] = useState([]);
  const [spaces, setSpaces] = useState([]);

  const [partsAdd, setPartsAdd] = useState(false);
  const { userInfo } = useSelector((state) => state.user);

  const companies = getAllowedCompanies(userInfo);
  const {
    partnersInfo,
  } = useSelector((state) => state.equipment);
  const {
    employeeListInfo, buildingsInfo, buildingSpaces,
  } = useSelector((state) => state.equipment);
  const { spaceInfoList, equipmentInfo, spaceCascader } = useSelector((state) => state.ticket);
  const {
    typeWork, workNature, prepareInfo, workPermitDetail,
    workPermitConfig, wpDepartments,
  } = useSelector((state) => state.workpermit);
  const { taskInfo, partsSelected } = useSelector((state) => state.ppm);
  const {
    createTenantinfo,
  } = useSelector((state) => state.setup);
  const { updateProductCategoryInfo } = useSelector((state) => state.pantry);

  const noData = partnersInfo && partnersInfo.err ? partnersInfo.err.data : false;
  const [configStartTime, setConfigStartTime] = useState('');
  const [configEndTime, setConfigEndTime] = useState('');
  const [configApprovalTeam, setConfigApprovalTeam] = useState(false);

  const userCompanyId = userInfo && userInfo.data && userInfo.data.company ? userInfo.data.company.id : '';
  const userParentId = userInfo && userInfo.data && userInfo.data.company.parent_id ? userInfo.data.company.parent_id.id : '';

  const wpConfig = workPermitConfig && workPermitConfig.data && workPermitConfig.data.length ? workPermitConfig.data[0] : false;

  const workData = workPermitDetail && workPermitDetail.data && workPermitDetail.data.length ? workPermitDetail.data[0] : false;

  const isNotEditable = editId && workData && workData.state && (workData.state !== 'Requested');

  function getCustomLabel(label) {
    let res = label;
    if (label) {
      if (label === 'General' && wpConfig.general_title) {
        res = wpConfig.general_title;
      } else if (label === 'Night Work' && wpConfig.night_title) {
        res = wpConfig.night_title;
      } else if (label === 'Special' && wpConfig.special_title) {
        res = wpConfig.special_title;
      }
    }
    return res;
  }

  function getIsTypeEnable(data) {
    let res = data;
    if (wpConfig && data) {
      if (!wpConfig.is_general_type_of_work) {
        res = res.filter((item) => item.value !== 'Normal');
      }
      if (!wpConfig.is_night_type_of_work) {
        res = res.filter((item) => item.value !== 'Night Work');
      }
      if (!wpConfig.is_special_type_of_work) {
        res = res.filter((item) => item.value !== 'Special');
      }
    }
    return res;
  }

  function getTypeLabels(data) {
    const newData = getIsTypeEnable(data);
    const newArrData = newData.map((cl) => ({
      value: cl.value,
      label: getCustomLabel(cl.label),
    }));
    return newArrData;
  }

  useMemo(() => {
    if (type_of_request && type_of_request.value) {
      type_of_request.label = getCustomLabel(type_of_request.label);
    }
  }, [type_of_request]);

  useMemo(() => {
    if (!editId) {
      if (wpConfig) {
        if (wpConfig.is_general_type_of_work) {
          setFieldValue('type_of_request', { value: 'Normal', label: getCustomLabel('General') });
        } else if (wpConfig.is_night_type_of_work) {
          setFieldValue('type_of_request', { value: 'Night Work', label: getCustomLabel('Night Work') });
        } else if (wpConfig.is_special_type_of_work) {
          setFieldValue('type_of_request', { value: 'Special', label: getCustomLabel('Special') });
        } else {
          setFieldValue('type_of_request', { value: 'Normal', label: getCustomLabel('General') });
        }
      }
    } else {
      const request = customData.typeRequest.find((data) => data.value === type_of_request);
      if (request) {
        setFieldValue('type_of_request', request);
        setFieldTouched(type_of_request);
      }
    }
  }, [editId, workPermitConfig]);

  const setDefaultTime = (startTime, endTime) => {
    setConfigStartTime(startTime);
    setConfigEndTime(endTime);
  };

  const removeDefaultTime = () => {
    setDefaultTime(false, false);
    setFieldValue('planned_start_time', '');
    setFieldValue('planned_end_time', '');
    setIsTypeDisabled(false);
    setConfigApprovalTeam(false);
  };

  useEffect(() => {
    (async () => {
      if (type === 'Equipment') {
        setSpacetype('');
        setEqtype('checked');
        setTypeData('Equipment');
        setFieldValue('type', 'Equipment');
      } else {
        setEqtype('');
        setSpacetype('checked');
        setTypeData('Space');
        setFieldValue('type', 'Space');
      }
    })();
  }, [type]);

  const addDays = (days, date) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  function checkExDatehasObject(data) {
    let result = false;
    if (typeof data === 'object' && data !== null) {
      result = getDateTimeLocalMuI(data);
    } else {
      result = moment(data).format('YYYY-MM-DD HH:mm:ss');
    }
    return result;
  }

  const setValidThrough = (maxDays, date) => {
    const validThrough = addDays(maxDays, !editId || (editId && isPlanOutNew) ? checkExDatehasObject(date) : moment.utc(date).tz(userInfo?.data?.timezone));
    setValidThroughDate(validThrough);
    if (!editId || (editId && (!valid_through || isTypeNewV1))) {
      setFieldValue('valid_through', validThrough);
    }
  };

  useEffect(() => {
    if (wpConfig && (type_of_request || (type_of_request && type_of_request.value)) && planned_end_time) {
      const value = typeof type_of_request === 'object' && type_of_request?.value
        ? type_of_request.value
        : type_of_request || '';

      let allowMultipleDays = false;
      let maxAllowedDays = 1;

      if (value === 'Normal' && wpConfig.general_shift_allow_multiple_days) {
        allowMultipleDays = true;
        maxAllowedDays = wpConfig.general_shift_max_allowed_days || 1;
      } else if (value === 'Night Work' && wpConfig.night_shift_allow_multiple_days) {
        allowMultipleDays = true;
        maxAllowedDays = wpConfig.night_shift_max_allowed_days || 1;
      } else if (value === 'Special' && wpConfig.special_shift_allow_multiple_days) {
        allowMultipleDays = true;
        maxAllowedDays = wpConfig.special_shift_max_allowed_days || 1;
      }

      if (allowMultipleDays) {
        setValidThrough(maxAllowedDays, planned_end_time);
      } else {
        setFieldValue('valid_through', false);
        setFieldValue('valid_valid', 'yes');
        setValidThroughDate(null);
      }
    }
  }, [type_of_request, wpConfig, planned_end_time]);

  useEffect(() => {
    if (type_of_request && type_of_request.value && wpConfig) {
      switch (type_of_request.value) {
        case 'Normal':
          setDefaultTime(wpConfig && wpConfig.general_shift_from ? wpConfig.general_shift_from : false, wpConfig && wpConfig.general_shift_to ? wpConfig.general_shift_to : false);
          setConfigApprovalTeam(wpConfig && wpConfig.general_approval_authority_shift_id && wpConfig.general_approval_authority_shift_id.id ? wpConfig.general_approval_authority_shift_id : false);
          return () => { };
        case 'Night Work':
          setDefaultTime(wpConfig && wpConfig.night_shift_from ? wpConfig.night_shift_from : false, wpConfig && wpConfig.night_shift_to ? wpConfig.night_shift_to : false);
          setConfigApprovalTeam(wpConfig && wpConfig.night_approval_authority_shift_id && wpConfig.night_approval_authority_shift_id.id ? wpConfig.night_approval_authority_shift_id : false);
          return () => { };
        case 'Special':
          setDefaultTime(wpConfig && wpConfig.special_shift_from ? wpConfig.special_shift_from : false, wpConfig && wpConfig.special_shift_to ? wpConfig.special_shift_to : false);
          setConfigApprovalTeam(wpConfig && wpConfig.special_approval_authority_shift_id && wpConfig.special_approval_authority_shift_id.id ? wpConfig.special_approval_authority_shift_id : false);
          return () => { };
        default:
          removeDefaultTime();
          return () => { };
      }
    }
  }, [isShow, wpConfig, type_of_request]);

  function getIsFromEditable() {
    let res = true;
    if (type_of_request && type_of_request.value && wpConfig) {
      if (type_of_request.value === 'Normal' && wpConfig.general_from_time_editable) {
        res = false;
      } else if (type_of_request.value === 'Night Work' && wpConfig.night_from_time_editable) {
        res = false;
      } else if (type_of_request.value === 'Special' && wpConfig.special_from_time_editable) {
        res = false;
      }
    }
    return res;
  }

  function getIsToEditable() {
    let res = true;
    if (type_of_request && type_of_request.value && wpConfig) {
      if (type_of_request.value === 'Normal' && wpConfig.general_to_time_editable) {
        res = false;
      } else if (type_of_request.value === 'Night Work' && wpConfig.night_to_time_editable) {
        res = false;
      } else if (type_of_request.value === 'Special' && wpConfig.special_to_time_editable) {
        res = false;
      }
    }
    return res;
  }

  function getFromExtendTime() {
    let res = 0;
    if (type_of_request && type_of_request.value && wpConfig) {
      if (type_of_request.value === 'Normal' && wpConfig.gen_max_dur_from_time) {
        res = wpConfig.gen_max_dur_from_time;
      } else if (type_of_request.value === 'Night Work' && wpConfig.ngt_max_dur_from_time) {
        res = wpConfig.ngt_max_dur_from_time;
      } else if (type_of_request.value === 'Special' && wpConfig.spl_max_dur_from_time) {
        res = wpConfig.spl_max_dur_from_time;
      }
    }
    return res;
  }

  const onEquipmentAdd = (data) => {
    setEquipments(data);
    setFieldValue('equipment_ids', data);
    setFieldValue('equipment_id', data[0]);
  };

  const onSpaceModalChange = (data) => {
    setSpaceFilterModal(false);
    setSpaces(data);
    setFieldValue('space_ids', data);
    setFieldValue('space_id', data[0]);
  };

  const onFetchAssetSchedules = () => {
    setAssetFilterModal(false);
  };

  const onAssetModalChange = (data) => {
    if (data && data.length) {
      const newData = data.filter((item) => item.name);
      // const allData = [...newData, ...equipments];
      const newData1 = [...new Map(newData.map((item) => [item.id, item])).values()];
      setEquipments(newData1);
      setFieldValue('equipment_ids', newData1);
      setFieldValue('equipment_id', newData1[0]);
      // setTrigger(Math.random());
    } else {
      setEquipments([]);
      setFieldValue('equipment_ids', []);
      setFieldValue('equipment_id', '');
    }
  };

  const onSpaceAdd = (data) => {
    setSpaces(data);
    setFieldValue('space_ids', data);
  };

  const onEquipmentDelete = (id) => {
    setEquipments((prev) => prev.filter((r) => r.id !== id));
    const data = equipments.filter((r) => r.id !== id);
    setFieldValue('equipment_ids', data);
    setFieldValue('equipment_id', data && data.length ? data[0] : '');
  };

  const onSpaceDelete = (id) => {
    setSpaces((prev) => prev.filter((r) => r.id !== id));
    const data = spaces.filter((r) => r.id !== id);
    setFieldValue('space_ids', spaces.filter((r) => r.id !== id));
    setFieldValue('space_id', data && data.length ? data[0] : '');
  };

  function getToExtendTime() {
    let res = 0;
    if (type_of_request && type_of_request.value && wpConfig) {
      if (type_of_request.value === 'Normal' && wpConfig.gen_max_dur_to_time) {
        res = wpConfig.gen_max_dur_to_time;
      } else if (type_of_request.value === 'Night Work' && wpConfig.ngt_max_dur_to_time) {
        res = wpConfig.ngt_max_dur_to_time;
      } else if (type_of_request.value === 'Special' && wpConfig.spl_max_dur_to_time) {
        res = wpConfig.spl_max_dur_to_time;
      }
    }
    return res;
  }

  useEffect(() => {
    if (wpConfig) {
      setFieldValue('has_work_location', wpConfig.work_location);
      setFieldValue('has_preparednessCheckList', wpConfig.is_prepared_required);
      if (!editId) {
        if (wpConfig.asset_type && (wpConfig.asset_type === 'Both' || wpConfig.asset_type === 'Space')) {
          setFieldValue('type', 'Space');
        }
        if (wpConfig.asset_type && wpConfig.asset_type === 'Equipment') {
          setFieldValue('type', 'Equipment');
        }
      }
    }
  }, [workPermitConfig]);

  useEffect(() => {
    setInitialSpace(false);
    if (typeData === 'Equipment') {
      if (!editId) {
        setFieldValue('space_id', '');
      }
    } else if (typeData === 'Space') {
      if (!editId) {
        setInitialSpace(true);
        setFieldValue('equipment_id', '');
      }
    }
  }, [typeData]);

  useEffect(() => {
    if (editId) {
      setFieldValue('start_valid', 'yes');
      setFieldValue('end_valid', 'yes');
      setFieldValue('valid_valid', 'yes');
    }
  }, [editId]);

  useEffect(() => {
    if (buildingsInfo && buildingsInfo.data && wpConfig && !editId && !wpConfig.is_include_multiple_space) {
      if (wpConfig.asset_type && (wpConfig.asset_type === 'Both' || wpConfig.asset_type === 'Space')) {
        setFieldValue('space_id', { id: buildingsInfo.data[0].id, name: buildingsInfo.data[0].space_name });
      }
    }
  }, [workPermitConfig, buildingsInfo, wpConfig, isShow, initalSpace]);

  // Function to calculate time difference in hours between two 24-hour format time strings
  function calculateHourDifference(time1, time2) {
  // Parse input strings into Date objects
    const date1 = new Date(moment().add(time1, 'h').format('YYYY-MM-DD HH:mm:ss'));
    const date2 = new Date(moment().add(time2, 'h').format('YYYY-MM-DD HH:mm:ss'));

    // Calculate time difference in milliseconds
    const timeDiff = date2.getTime() - date1.getTime();

    // Convert time difference to hours
    const hoursDiff = Math.abs(timeDiff) / (1000 * 3600);

    return hoursDiff;
  }

  // Function to calculate two datetime values given two hours
  function getCalEndDate(startHour, endHour, psTime) {
    const currentDate = psTime ? new Date(psTime) : new Date();

    // Calculate start date
    const startDate = new Date(currentDate);
    startDate.setHours(startHour, 0, 0, 0);

    // Calculate end date
    const endDate = new Date(currentDate);
    endDate.setHours(endHour, 0, 0, 0);

    // Check if end time is before start time, which indicates it's next day
    if (endDate < startDate) {
      endDate.setDate(endDate.getDate() + 1);
    }
    endDate.setHours(endHour, endDate.getMinutes() + 0, 0, 0); // Set the time for the next day
    return endDate;
  }

  function getStartDate(psTime, isEnd) {
    let configStartDateSet = false;
    if (configStartTime && configEndTime) {
      let dateNow = new Date();
      let configStartDateString = new Date();
      if (psTime) {
        dateNow = new Date(moment(new Date(psTime)).format('YYYY-MM-DD HH:mm:ss'));
        const hours1 = dateNow.getHours();
        const minutes1 = dateNow.getMinutes();
        const dateAct1 = moment(dateNow).format('YYYY-MM-DD');
        configStartDateString = `${dateAct1} ${hours1 >= 10 ? hours1 : `0${hours1}`}:${minutes1 >= 10 ? minutes1 : `0${minutes1}`}`;
      } else {
        const hm1 = getHoursAndMinutes(configStartTime);
        const hours1 = hm1 && hm1.hour ? hm1.hour : 0;
        const minutes1 = hm1 && hm1.minutes ? hm1.minutes : 0;
        const dateAct1 = moment(!getIsFromEditable() && !getIsToEditable() && isEnd ? new Date(planned_start_time) : dateNow).format('YYYY-MM-DD');
        const calStartDate = `${dateAct1} ${hours1 >= 10 ? hours1 : `0${hours1}`}:${minutes1 >= 10 ? minutes1 : `0${minutes1}`}`;
        configStartDateString = moment(new Date(calStartDate)).subtract(getFromExtendTime(), 'h').format('YYYY-MM-DD HH:mm:ss');
      }

      configStartDateSet = new Date(configStartDateString);
    }
    return configStartDateSet;
  }

  function getStartEndHours() {
    let cet = configEndTime;
    let cst = configStartTime;
    if (getFromExtendTime()) {
      cst = configStartTime - getFromExtendTime();
    }
    if (getToExtendTime()) {
      cet = configEndTime + getToExtendTime();
    }
    return { startHour: cst, endHour: cet };
  }

  function getEndDate(peTime, psTime) {
    let configStartDateSet = false;
    if (configStartTime && configEndTime) {
      let dateNow = new Date();
      let configStartDateString = new Date();
      if (peTime) {
        let cet = configEndTime;
        let cst = configStartTime;
        if (getFromExtendTime()) {
          cst = configStartTime - getFromExtendTime();
        }
        if (getToExtendTime()) {
          cet = configEndTime + getToExtendTime();
        }
        dateNow = new Date(moment(new Date(peTime)).format('YYYY-MM-DD HH:mm:ss'));
        const hours1 = dateNow.getHours();
        const minutes1 = dateNow.getMinutes();
        const dateAct1 = moment(dateNow).format('YYYY-MM-DD');
        const configStartDateString1 = `${dateAct1} ${hours1 >= 10 ? hours1 : `0${hours1}`}:${minutes1 >= 10 ? minutes1 : `0${minutes1}`}`;
        const dateAct2 = moment(new Date(configStartDateString1)).add(getToExtendTime(), 'h').add(cet === 23 ? 59 : 0, 'minutes').format('YYYY-MM-DD HH:mm:ss');
        configStartDateString = dateAct2;
      } else {
        let cet = configEndTime;
        let cst = configStartTime;
        if (getFromExtendTime()) {
          cst = configStartTime - getFromExtendTime();
        }
        if (getToExtendTime()) {
          cet = configEndTime + getToExtendTime();
        }
        /* cet = cet === 24 ? cet - 1 : cet;
        const hm1 = getHoursAndMinutes(cet > 24 ? configEndTime : cet);
        const hours1 = hm1 && hm1.hour ? hm1.hour : 0;
        let minutes1 = hm1 && hm1.minutes ? hm1.minutes : 0;
        minutes1 = cet === 24 ? 59 : minutes1;
        const dateAct = moment(dateNow).format('YYYY-MM-DD');
        const strDate = `${dateAct} 00:00:00`;
        let dateAct1 = moment(strDate).add(cet, 'h').add(cet === 23 ? 59 : 0, 'minutes').format('YYYY-MM-DD HH:mm:ss');
        if (configStartTime > 16 && configEndTime < 10) {
          dateAct1 = moment(dateAct1).add(cet > 24 ? 2 : 1, cet > 24 ? 'days' : 'day').format('YYYY-MM-DD HH:mm:ss');
        } */
        const calEndDate = getCalEndDate(configStartTime, configEndTime, psTime);
        const dateAct1 = moment(calEndDate).add(getToExtendTime(), 'h').add(cet === 23 ? 59 : 0, 'minutes').format('YYYY-MM-DD HH:mm:ss');
        configStartDateString = dateAct1;
      }
      configStartDateSet = new Date(configStartDateString);
    }
    return configStartDateSet;
  }

  function disableEndDate() {
    return moment(planned_start_time).add(1, 'day').format('YYYY-MM-DD');
  }

  const range = (min, max) => [...Array(max - min + 1).keys()].map((i) => i + min);

  function getDisabledHours() {
    let result = [];
    if (configStartTime && configEndTime) {
      const hm1 = getHoursAndMinutes(configStartTime);
      const start = hm1 && hm1.hour ? hm1.hour : 0;

      const hm2 = getHoursAndMinutes(configEndTime);
      const end = hm2 && hm2.hour ? hm2.hour : 0;
      if (start && end && end > start) {
        result = range(start, end);
      }
    }
    return result;
  }

  function disabledRangeTime() {
    return {
      disabledHours: () => getDisabledHours(),
    };
  }

  let customerOptions = [];

  if (partnersInfo && partnersInfo.loading) {
    customerOptions = [{ name: 'Loading..' }];
  }
  if (vendor_id && vendor_id.length && vendor_id.length > 0) {
    const oldHour = [{ id: vendor_id[0], name: vendor_id[1] }];
    const newArr = [...customerOptions, ...oldHour];
    customerOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  if (partnersInfo && partnersInfo.data) {
    const arr = [...customerOptions, ...partnersInfo.data];
    customerOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }
  if (partnersInfo && partnersInfo.err) {
    customerOptions = [];
  }

  useEffect(() => {
    if (userInfo && userInfo.data && visibility) {
      dispatch(getBuildings(companies, appModels.SPACE));
    }
  }, [userInfo]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (buildingsInfo && buildingsInfo.data)) {
      setChildValues(addParents(buildingsInfo.data));
    }
  }, [buildingsInfo]);

  useEffect(() => {
    if (userInfo && userInfo.data && customerOpen) {
      dispatch(getPartners(companies, appModels.PARTNER, 'supplier', customerKeyword));
      dispatch(resetCreateTenant());
    }
  }, [userInfo, customerKeyword, customerOpen]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (buildingSpaces && buildingSpaces.data && buildingSpaces.data.length && parentId)) {
      setChildLoad(true);
      const childData = addChildrens(childValues, buildingSpaces.data[0].child, parentId);
      setChildValues(childData);
    }
  }, [buildingSpaces, parentId]);

  useEffect(() => {
    if (childValues) {
      setCascaderValues(childValues);
    }
  }, [childValues]);

  useEffect(() => {
    if (cascaderValues) {
      dispatch(getCascader(cascaderValues));
    }
  }, [cascaderValues, buildingSpaces, childLoad]);

  /* useEffect(() => {
    if (!editId && planned_start_time && type_of_request && type_of_request.value && type_of_request.value !== 'Night Work') {
      setFieldValue('planned_end_time', moment(planned_start_time).add(1, 'hours'));
    }
  }, [planned_start_time, duration]); */

  const isPlanOutNew = editId && planned_end_time && workPermitDetail && workPermitDetail.data && workPermitDetail.data.length && new Date(workPermitDetail.data[0].planned_end_time).getTime() !== new Date(planned_end_time).getTime();
  const isTypeOld = editId && workPermitDetail && workPermitDetail.data && workPermitDetail.data.length && workPermitDetail.data[0].type_of_request;
  const isTypeNew = typeof type_of_request === 'object' && type_of_request?.value
    ? type_of_request.value
    : type_of_request || '';
  const isTypeNewV1 = isTypeNew !== isTypeOld;

  useEffect(() => {
    if (type_of_request && type_of_request.value) {
      setFieldValue('type_of_request', type_of_request);
      const dateNow = new Date();
      const hm1 = getHoursAndMinutes(configStartTime);
      const hours1 = hm1 && hm1.hour ? hm1.hour : 0;
      const minutes1 = hm1 && hm1.minutes ? hm1.minutes : 0;
      const dateAct1 = moment(dateNow).format('YYYY-MM-DD');

      const hm2 = getHoursAndMinutes(configEndTime);
      const hours2 = hm2 && hm2.hour ? hm2.hour : 0;
      const minutes2 = hm2 && hm2.minutes ? hm2.minutes : 0;
      const dateAct2 = moment(dateNow).format('YYYY-MM-DD');

      const configStartDate = `${dateAct1} ${hours1 >= 10 ? hours1 : `0${hours1}`}:${minutes1 >= 10 ? minutes1 : `0${minutes1}`}:00`;

      let configEndDate = `${dateAct2} ${hours2 >= 10 ? hours2 : `0${hours2}`}:${minutes2 >= 10 ? minutes2 : `0${minutes2}`}:00`;

      if (configStartDate > configEndDate) {
        const nextDay = moment(dateAct2).add(1, 'day').format('YYYY-MM-DD');
        configEndDate = `${nextDay} ${hours2 >= 10 ? hours2 : `0${hours2}`}:${minutes2 >= 10 ? minutes2 : `0${minutes2}`}:00`;
      }

      if (configStartTime && configEndTime) {
        // if (!editId) {
        if (!editId || (editId && (getIsFromEditable() || isTypeNewV1))) {
          setFieldValue('planned_start_time', moment(configStartDate));
        }
        if (!editId || (editId && (getIsToEditable() || isTypeNewV1))) {
          setFieldValue('planned_end_time', moment(configEndDate));
        }
        //   }
        if (configApprovalTeam) {
          setFieldValue('approval_authority_id', configApprovalTeam);
        }
        setIsTypeDisabled('yes');
      } else if (!configStartTime || !configEndTime) {
        setIsTypeDisabled(Math.random());
        if (!editId) {
          setFieldValue('planned_start_time', '');
          setFieldValue('planned_end_time', '');
        }
        if (!editId) {
          const aData = nature_work_id && nature_work_id.approval_authority_id ? nature_work_id.approval_authority_id : '';
          if (aData && Object.keys(aData).length && Object.keys(aData).length > 0) {
            setFieldValue('approval_authority_id', { id: aData.id, name: aData.name });
          } else {
            setFieldValue('approval_authority_id', '');
          }
        } else {
          const oldData = workPermitDetail && workPermitDetail.data && workPermitDetail.data.length && workPermitDetail.data[0].approval_authority_id && workPermitDetail.data[0].approval_authority_id.id ? workPermitDetail.data[0].approval_authority_id : '';
          setFieldValue('approval_authority_id', oldData);
        }
      }
      setNatureClear(false);
    }
  }, [configStartTime, configEndTime, workPermitConfig, isNatureClear]);

  useEffect(() => {
    if (planned_start_time && type_of_request && type_of_request.value && !configStartTime && !configEndTime) {
      setFieldValue('planned_end_time', '');
    } else if (planned_start_time && !getIsFromEditable() && !getIsToEditable()) {
      const dateNow = new Date(planned_start_time);
      const hm1 = getHoursAndMinutes(configStartTime);
      const hours1 = hm1 && hm1.hour ? hm1.hour : 0;
      const minutes1 = hm1 && hm1.minutes ? hm1.minutes : 0;
      const dateAct1 = moment(dateNow).format('YYYY-MM-DD');

      const hm2 = getHoursAndMinutes(configEndTime);
      const hours2 = hm2 && hm2.hour ? hm2.hour : 0;
      const minutes2 = hm2 && hm2.minutes ? hm2.minutes : 0;
      const dateAct2 = moment(dateNow).format('YYYY-MM-DD');

      const configStartDate = `${dateAct1} ${hours1 >= 10 ? hours1 : `0${hours1}`}:${minutes1 >= 10 ? minutes1 : `0${minutes1}`}:00`;

      let configEndDate = `${dateAct2} ${hours2 >= 10 ? hours2 : `0${hours2}`}:${minutes2 >= 10 ? minutes2 : `0${minutes2}`}:00`;
      if (configStartDate > configEndDate) {
        const nextDay = moment(dateAct2).add(1, 'day').format('YYYY-MM-DD');
        configEndDate = `${nextDay} ${hours2 >= 10 ? hours2 : `0${hours2}`}:${minutes2 >= 10 ? minutes2 : `0${minutes2}`}:00`;
      }

      setFieldValue('planned_end_time', moment(configEndDate));
    }
  }, [planned_start_time]);

  useEffect(() => {
    if (!editId && planned_start_time && planned_end_time && !configStartTime && !configEndTime && new Date(planned_start_time) >= new Date(planned_end_time)) {
      setFieldValue('planned_end_time', moment(planned_start_time).add(10, 'minutes'));
    }
  }, [planned_end_time]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const empId = userInfo && userInfo.data && userInfo.data.employee && userInfo.data.employee.id ? userInfo.data.employee.id : '';
      const empName = userInfo && userInfo.data && userInfo.data.employee && userInfo.data.employee.name ? userInfo.data.employee.name : '';
      const companyId = userInfo.data.company ? userInfo.data.company.id : '';
      if (!editId) {
        setFieldValue('reviewer_id', { id: empId, name: empName });
        setFieldValue('requestor_id', { id: empId, name: empName });
      }
      setFieldValue('company_id', companyId);
    }
  }, [userInfo, editId]);

  useEffect(() => {
    if (vendor_id && Object.keys(vendor_id).length && Object.keys(vendor_id).length > 0 && vendorShow) {
      const vEmail = vendor_id.email ? vendor_id.email : '';
      const vMobile = vendor_id.mobile ? vendor_id.mobile : '';
      const vName = vendor_id.name ? vendor_id.name : '';
      setFieldValue('vendor_poc', vName);
      setFieldValue('vendor_mobile', vMobile);
      setFieldValue('vendor_email', vEmail);
    }
  }, [vendor_id, vendorShow, partnersInfo, customerOpen, customerKeyword]);

  /* useEffect(() => {
    if (equipment_id && Object.keys(equipment_id).length && Object.keys(equipment_id).length > 0 && equipmentShow) {
      const eLocation = (getDefaultNoValue(extractTextObject(equipment_id.location_id))) ? (getDefaultNoValue(extractTextObject(equipment_id.location_id))) : '';
      setFieldValue('work_location', eLocation);
    }
  }, [equipment_id, equipmentShow]); */

  useEffect(() => {
    if ((nature_work_id && Object.keys(nature_work_id).length && Object.keys(nature_work_id).length > 0 && natureShow)
      || ((department_id && Object.keys(department_id).length && Object.keys(department_id).length > 0 && depShow)) || configApprovalTeam || !configApprovalTeam) {
      const tData = nature_work_id && nature_work_id.task_id ? nature_work_id.task_id : '';
      const pData = nature_work_id && nature_work_id.preparedness_checklist_id ? nature_work_id.preparedness_checklist_id : '';
      const ipData = nature_work_id.issue_permit_checklist_id ? nature_work_id.issue_permit_checklist_id : '';
      const aDataDep = department_id && department_id.approval_authority_id ? department_id.approval_authority_id : '';
      const aDataNw = nature_work_id && nature_work_id.approval_authority_id ? nature_work_id.approval_authority_id : '';
      const aDataDep1 = aDataDep && Object.keys(aDataDep).length && Object.keys(aDataDep).length > 0 ? aDataDep : aDataNw;
      const aData = configApprovalTeam && Object.keys(configApprovalTeam).length && Object.keys(configApprovalTeam).length > 0 ? configApprovalTeam : aDataDep1;
      const eAuthDataDep = department_id && department_id.ehs_authority_id ? department_id.ehs_authority_id : '';
      const eAuthDataNw = nature_work_id && nature_work_id.ehs_authority_id ? nature_work_id.ehs_authority_id : '';
      const eAuthData = eAuthDataDep && Object.keys(eAuthDataDep).length && Object.keys(eAuthDataDep).length > 0 ? eAuthDataDep : eAuthDataNw;
      const ipAuthDataWP = nature_work_id.issue_permit_approval_id ? nature_work_id.issue_permit_approval_id : '';
      const ipAuthDataDept = department_id.issue_permit_approval_id ? department_id.issue_permit_approval_id : '';
      const ipAuthData = ipAuthDataDept && Object.keys(ipAuthDataDept).length && Object.keys(ipAuthDataDept).length > 0 ? ipAuthDataDept : ipAuthDataWP;
      const sdataDep = department_id && department_id.security_office_id ? department_id.security_office_id : '';
      const sdataNw = nature_work_id && nature_work_id.security_office_id ? nature_work_id.security_office_id : '';
      const sdata = sdataDep && Object.keys(sdataDep).length && Object.keys(sdataDep).length > 0 ? sdataDep : sdataNw;
      const eData = nature_work_id && nature_work_id.ehs_instructions ? nature_work_id.ehs_instructions : '';
      const termsData = nature_work_id && nature_work_id.terms_conditions ? nature_work_id.terms_conditions : '';
      if (tData && Object.keys(tData).length && Object.keys(tData).length > 0) {
        setFieldValue('task_id', { id: tData.id, name: tData.name });
      }
      if (pData && Object.keys(pData).length && Object.keys(pData).length > 0) {
        setFieldValue('preparedness_checklist_id', { id: pData.id, name: pData.name });
      }
      if (ipData && Object.keys(ipData).length && Object.keys(ipData).length > 0) {
        setFieldValue('issue_permit_checklist_id', { id: ipData.id, name: ipData.name });
      }
      if (ipData && !(Object.keys(ipData).length && Object.keys(ipData).length > 0)) {
        setFieldValue('issue_permit_checklist_id', '');
      }
      if (aData && Object.keys(aData).length && Object.keys(aData).length > 0) {
        setFieldValue('approval_authority_id', { id: aData.id, name: aData.name });
      } else {
        setFieldValue('approval_authority_id', '');
      }
      if (eAuthData && Object.keys(eAuthData).length && Object.keys(eAuthData).length > 0) {
        setFieldValue('ehs_authority_id', { id: eAuthData.id, name: eAuthData.name });
      } else if (!editId) {
        setFieldValue('ehs_authority_id', '');
      }
      if (ipAuthData && Object.keys(ipAuthData).length && Object.keys(ipAuthData).length > 0) {
        setFieldValue('issue_permit_approval_id', { id: ipAuthData.id, name: ipAuthData.name });
      } else if (aDataDep1 && Object.keys(aDataDep1).length && Object.keys(aDataDep1).length > 0) {
        setFieldValue('issue_permit_approval_id', { id: aDataDep1.id, name: aDataDep1.name });
      } else {
        setFieldValue('issue_permit_approval_id', '');
      }
      if (sdata && Object.keys(sdata).length && Object.keys(sdata).length > 0) {
        setFieldValue('security_office_id', { id: sdata.id, name: sdata.name });
      } else if (!editId) {
        setFieldValue('security_office_id', '');
      }
      setFieldValue('ehs_instructions', eData);
      setFieldValue('terms_conditions', termsData);
    }
  }, [configApprovalTeam, nature_work_id, department_id]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && atOpen) {
        await dispatch(getEmployeeDataList(companies, appModels.EMPLOYEE, atKeyword, false, false, 'workpemit'));
      }
    })();
  }, [userInfo, atKeyword, atOpen]);

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

  /* useEffect(() => {
    if (userInfo && userInfo.data && customerOpen) {
      dispatch(getVendor(companies, appModels.PARTNER, 'supplier', customerKeyword));
    }
  }, [userInfo, customerKeyword, customerOpen]); */

  useEffect(() => {
    if (userInfo && userInfo.data && workOpen) {
      const tempLevel = wpConfig && wpConfig.type_of_work_access_level ? wpConfig.type_of_work_access_level : '';
      let domain = '';
      if (tempLevel === 'Site') {
        domain = `["company_id","=",${userCompanyId}]`;
      } else if (tempLevel === 'Company') {
        domain = `["company_id","in",[${userCompanyId}, ${userParentId}]]`;
      } else if (tempLevel === 'Instance') {
        domain = '"|",["company_id","=",1],["company_id","=",false]';
      }

      if (tempLevel && workKeyword) {
        domain = `${domain},["name","ilike","${workKeyword}"]`;
      }

      if (!tempLevel && workKeyword) {
        domain = `["name","ilike","${workKeyword}"]`;
      }
      dispatch(getTypeWork(companies, appModels.WORKTYPE, false, domain));
    }
  }, [userInfo, workKeyword, workOpen, workPermitConfig]);

  useEffect(() => {
    if (userInfo && userInfo.data && depOpen) {
      const tempLevel = wpConfig && wpConfig.department_access_level ? wpConfig.department_access_level : '';
      let domain = '';
      if (tempLevel === 'Site') {
        domain = `["company_id","=",${userCompanyId}]`;
      } else if (tempLevel === 'Company') {
        domain = `["company_id","in",[${userCompanyId}, ${userParentId}]]`;
      } else if (tempLevel === 'Instance') {
        domain = '"|",["company_id","=",1],["company_id","=",false]';
      }

      if (tempLevel && depKeyword) {
        domain = `${domain},["name","ilike","${depKeyword}"]`;
      }

      if (!tempLevel && depKeyword) {
        domain = `["name","ilike","${depKeyword}"]`;
      }
      dispatch(getDepartments(appModels.WORKDEPARTMENT, domain));
    }
  }, [userInfo, depKeyword, depOpen, workPermitConfig]);

  useEffect(() => {
    if (userInfo && userInfo.data && natureOpen) {
      dispatch(getNatureWork(companies, appModels.NATUREWORK, natureKeyword));
    }
  }, [userInfo, natureKeyword, natureOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && taskOpen) {
        await dispatch(getOperationsList(companies, appModels.TASK, taskKeyword));
      }
    })();
  }, [userInfo, taskKeyword, taskOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && prepareOpen) {
        await dispatch(getPrepareChecklist(companies, appModels.PPMCHECKLIST, prepareKeyword));
      }
    })();
  }, [userInfo, prepareKeyword, prepareOpen]);

  const onAtKeywordChange = (event) => {
    setAtKeyword(event.target.value);
  };

  const onSpaceKeywordChange = (event) => {
    setSpaceKeyword(event.target.value);
  };

  const onSpaceSearch = (type) => {
    setModelValue(appModels.SPACE);
    setFieldName('space_id');
    setModalName('Space');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setColumns(['id', 'space_name', 'path_name']);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    if (type === 'Search More') {
      setKeywordSearch(spacekeyword);
    } else {
      setKeywordSearch('');
    }
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

  const onEquipemntSearch = (type) => {
    setModelValue(appModels.EQUIPMENT);
    setFieldName('equipment_id');
    setModalName('Equipment');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setColumns(['id', 'name', 'location_id']);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    if (type === 'Search More') {
      setKeywordSearch(equipmentkeyword);
    } else {
      setKeywordSearch('');
    }
    setExtraMultipleModal(true);
  };

  const onEquipmentClear = () => {
    setEquipmentkeyword(null);
    setEquipmentOpen(false);
    setFieldValue('equipment_id', '');
    // setFieldValue('work_location', '');
  };

  const onRequestorClear = () => {
    setAtKeyword('');
    setFieldValue('requestor_id', '');
    setAtOpen(false);
  };

  const onRequestorSearch = () => {
    setModelValue(appModels.EMPLOYEE);
    setColumns(['id', 'name']);
    setFieldName('requestor_id');
    setModalName('Requestor');
    setPlaceholder('Requestor');
    setCompanyValue(companies);
    setExtraModal(true);
  };

  const showRequestorModal = () => {
    setModelValue(appModels.PARTNER);
    setFieldName('vendor_id');
    setModalName('Vendors');
    setOtherFieldName('supplier');
    setOtherFieldValue('true');
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setColumns(['id', 'name', 'email', 'mobile']);
    setExtraMultipleModal(true);
  };

  const onCustomerKeywordChange = (event) => {
    setCustomerKeyword(event.target.value);
  };

  const onCustomerKeywordClear = () => {
    setCustomerKeyword(null);
    setFieldValue('vendor_id', '');
    setFieldValue('vendor_poc', '');
    setFieldValue('vendor_mobile', '');
    setFieldValue('vendor_email', '');
    setCustomerOpen(false);
  };

  const onWorkClear = () => {
    setWorkKeyword(null);
    setFieldValue('type_work_id', '');
    setWorkOpen(false);
  };

  const showWorkModal = () => {
    setModelValue(appModels.WORKTYPE);
    setColumns(['id', 'name']);
    setFieldName('type_work_id');
    setModalName('Type of Work List');
    setPlaceholder('Search Type of Work..');
    const tempLevel = wpConfig && wpConfig.type_of_work_access_level ? wpConfig.type_of_work_access_level : '';
    let domain = '';
    if (tempLevel === 'Site') {
      domain = `["company_id","=",${userCompanyId}]`;
    } else if (tempLevel === 'Company') {
      domain = `["company_id","in",[${userCompanyId}, ${userParentId}]]`;
    } else if (tempLevel === 'Instance') {
      domain = '"|",["company_id","=",1],["company_id","=",false]';
    }
    setCompanyValue(domain);
    setExtraModal(true);
  };

  const onNatureClear = () => {
    setNatureKeyword(null);
    setFieldValue('nature_work_id', '');
    setFieldValue('task_id', '');
    setFieldValue('preparedness_checklist_id', '');
    setFieldValue('issue_permit_checklist_id', '');
    setFieldValue('approval_authority_id', '');
    setFieldValue('issue_permit_approval_id', '');
    setFieldValue('ehs_authority_id', '');
    setFieldValue('security_office_id', '');
    setFieldValue('ehs_instructions', '');
    setFieldValue('terms_conditions', '');
    setNatureClear(true);
    setNatureShow(false);
    setNatureOpen(false);
  };

  const onDepClear = () => {
    setDepKeyword(null);
    setFieldValue('department_id', '');
    setFieldValue('issue_permit_approval_id', '');
    setFieldValue('ehs_authority_id', '');
    setFieldValue('security_office_id', '');
    setDepOpen(false);
  };

  const showNatureModal = () => {
    setModelValue(appModels.NATUREWORK);
    setColumns(['id', 'name']);
    setFieldName('nature_work_id');
    setModalName('Nature of Work List');
    setCompanyValue(companies);
    setExtraMultipleModal(true);
  };

  const showDepModal = () => {
    setModelValue(appModels.WORKDEPARTMENT);
    setColumns(['id', 'name']);
    setFieldName('department_id');
    setModalName('Departments');
    const tempLevel = wpConfig && wpConfig.department_access_level ? wpConfig.department_access_level : '';
    let domain = '';
    if (tempLevel === 'Site') {
      domain = `["company_id","=",${userCompanyId}]`;
    } else if (tempLevel === 'Company') {
      domain = `["company_id","in",[${userCompanyId}, ${userParentId}]]`;
    } else if (tempLevel === 'Instance') {
      domain = '"|",["company_id","=",1],["company_id","=",false]';
    }
    setCompanyValue(domain);
    setExtraMultipleModal(true);
  };

  const onTaskKeywordChange = (event) => {
    setTaskKeyword(event.target.value);
  };

  const onPrepareKeywordChange = (event) => {
    setPrepareKeyword(event.target.value);
  };

  const resetEquipment = () => {
    if (!editId) {
      setFieldValue('equipment_id', '');
      // setFieldValue('work_location', '');
    }
    if (!isNotEditable) {
      setFieldValue('equipment_id', '');
      // setFieldValue('work_location', '');
    }
  };

  const resetSpaceCheck = () => {
    if (!editId) {
      setFieldValue('space_id', '');
      // setFieldValue('work_location', '');
    }
    if (!isNotEditable) {
      setFieldValue('space_id', '');
      // setFieldValue('work_location', '');
    }
  };

  const onCustomerClose = () => {
    if (createTenantinfo && createTenantinfo.data) {
      dispatch(getPartners(companies, appModels.PARTNER, 'supplier', customerKeyword));
    }
  };

  const isUserError = userInfo && userInfo.err;
  const loading = (userInfo && userInfo.loading) || (buildingsInfo && buildingsInfo.loading) || (buildingSpaces && buildingSpaces.loading);
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (buildingsInfo && buildingsInfo.err) ? generateErrorMessage(buildingsInfo) : userErrorMsg;
  const errorMsg1 = (buildingSpaces && buildingSpaces.err) ? generateErrorMessage(buildingSpaces) : userErrorMsg;

  const onChange = (value, selectedOptions) => {
    // const sLocation = selectedOptions[selectedOptions.length - 1];
    // const sLocationValue = sLocation && sLocation.path_name ? sLocation.path_name : '';
    // setFieldValue('work_location', sLocationValue);
    setParentId('');
    if (selectedOptions && selectedOptions.length) {
      if (!selectedOptions[0].parent_id) {
        setParentId(selectedOptions[0].id);
        setSpaceIds(selectedOptions[0].id);
        if (spaceIds !== selectedOptions[0].id) {
          dispatch(getAllSpaces(selectedOptions[0].id, companies));
        }
      }
    }
    setFieldValue(space.name, value);
  };

  const dropdownRender = (menus) => (
    <div>
      {menus}
      {loading && (
        <>
          <Divider style={{ margin: 0 }} />
          <div className="text-center p-2" data-testid="loading-case">
            <Spinner animation="border" size="sm" className="text-dark ml-3" variant="secondary" />
          </div>
        </>
      )}
      {((buildingsInfo && buildingsInfo.err) || isUserError) && (
        <>
          <Divider style={{ margin: 0 }} />
          <ErrorContent errorTxt={errorMsg} />
        </>
      )}
      {((buildingSpaces && buildingSpaces.err) || isUserError) && (
        <>
          <Divider style={{ margin: 0 }} />
          <ErrorContent errorTxt={errorMsg1} />
        </>
      )}
    </div>
  );

  const loadData = () => { };
  const getSpace = () => {
    let spaceValue = [];
    if (space_id && space_id.length > 0) {
      spaceValue = space_id;
    } else if (space_id && space_id.id) {
      spaceValue = [space_id.id];
    }
    return spaceValue;
  };

  const employeeListOptions = extractOptionsObject(employeeListInfo, requestor_id);
  const spaceOptions = extractOptionsObjectWithName(spaceInfoList, space_id, 'path_name');
  const equipmentOptions = extractOptionsObject(equipmentInfo, equipment_id);
  const departmentOptions = extractOptionsObject(wpDepartments, department_id);
  // const customerOptions = extractOptionsObject(partnersInfo, vendor_id);
  const typeWorkOptions = extractOptionsObject(typeWork, type_work_id);
  const workNatureOptions = extractOptionsObject(workNature, nature_work_id);
  const prepareOptions = extractOptionsObject(prepareInfo, preparedness_checklist_id);
  const taskOptions = extractOptionsObject(taskInfo, task_id);

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

  useEffect(() => {
    if ((customerKeyword && customerKeyword.length >= 3) && partnersInfo && partnersInfo.data && createTenantinfo && createTenantinfo.data) {
      customerOptions = [{
        id: partnersInfo.data[0].id, name: customerKeyword, mobile: partnersInfo.data[0].mobile, email: partnersInfo.data[0].email,
      }];
      setCustomerOpen(false);
      setFieldValue('vendor_id', {
        id: partnersInfo.data[0].id, name: customerKeyword, mobile: partnersInfo.data[0].mobile, email: partnersInfo.data[0].email,
      });
    }
  }, [createTenantinfo, partnersInfo]);

  useEffect(() => {
    setPartsData([]);
  }, []);

  useEffect(() => {
    if (partsAdd) {
      setPartsData(partsData);
    }
  }, [partsAdd]);

  useEffect(() => {
    if (partsData) {
      setFieldValue('work_technician_ids', partsData);
      setFieldValue('no_vendor_technicians', partsData.length);
    }
  }, [partsData]);

  useEffect(() => {
    if (editId && (workPermitDetail && workPermitDetail.data && workPermitDetail.data.length && workPermitDetail.data[0].work_technician_ids && workPermitDetail.data[0].work_technician_ids.length) && (updateProductCategoryInfo && !updateProductCategoryInfo.err)) {
      const newArrData = workPermitDetail.data[0].work_technician_ids.map((cl) => ({
        ...cl,
        id: cl.id,
        name: cl.name ? cl.name : '',
        mobile: cl.mobile ? cl.mobile : '',
        age: cl.age ? cl.age : '',
      }));
      setPartsData(newArrData);
      setPartsAdd(Math.random());
    }
  }, [editId]);

  const loadEmptyTd = () => {
    const newData = partsData;
    newData.push({
      name: '', mobile: '', age: '',
    });
    setPartsData(newData);
    setPartsAdd(Math.random());
  };
  const onNameChange = (e, index) => {
    const newData = partsData;
    newData[index].name = e.target.value;
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  const onMobileChange = (e, index) => {
    const newData = partsData;
    newData[index].mobile = e.target.value;
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  const onAgeChange = (e, index) => {
    const newData = partsData;
    newData[index].age = e.target.value;
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  const removeData = (e, index) => {
    const newData = partsData;
    const { id } = newData[index];
    if (id || id === undefined) {
      newData[index].isRemove = true;
      setPartsData(newData);
      setPartsAdd(Math.random());
    } else {
      newData.splice(index, 1);
      setPartsData(newData);
      setPartsAdd(Math.random());
    }
  };

  const handleTimeChange = (event) => {
    const { checked, value } = event.target;
    if (checked && value) {
      const date = new Date();
      if (value === 'equipment') { setSpacetype(''); setEqtype('checked'); resetSpaceCheck(); } else { setSpacetype('checked'); setEqtype(''); resetEquipment(); }
    }
  };

  const isPlanInNew = editId && planned_start_time && workPermitDetail && workPermitDetail.data && workPermitDetail.data.length && new Date(workPermitDetail.data[0].planned_start_time).getTime() !== new Date(planned_start_time).getTime();
  const isValidNew = editId && valid_through && workPermitDetail && workPermitDetail.data && workPermitDetail.data.length && workPermitDetail.data[0].valid_through && new Date(workPermitDetail.data[0].valid_through).getTime() !== new Date(valid_through).getTime();

  function getFromEditMinDateTime() {
    const startDate = isPlanInNew ? dayjs(planned_start_time).format('YYYY-MM-DD HH:mm:ss') : false;
    return dayjs(getStartDate(startDate));
  }

  function getFromEditMaxDateTime() {
    const endDate = isPlanOutNew ? dayjs(planned_end_time).format('YYYY-MM-DD HH:mm:ss') : moment.utc(planned_end_time).local().tz(userInfo?.data?.timezone).format('YYYY-MM-DD HH:mm:ss');
    return !(!getIsFromEditable() && !getIsToEditable()) ? dayjs(getEndDate(endDate)) : null;
  }

  function getToEditMinDateTime(pst) {
    const startDate = isPlanInNew ? dayjs(pst).format('YYYY-MM-DD HH:mm:ss') : moment.utc(planned_start_time).local().tz(userInfo?.data?.timezone).format('YYYY-MM-DD HH:mm:ss');
    return dayjs(getStartDate(startDate));
  }

  function getToEditMaxDateTime(pst) {
    const startDate = isPlanInNew ? dayjs(pst).format('YYYY-MM-DD HH:mm:ss') : moment.utc(planned_start_time).local().tz(userInfo?.data?.timezone).format('YYYY-MM-DD HH:mm:ss');
    return !getIsFromEditable() && !getIsToEditable() ? dayjs(getEndDate(false, startDate)) : dayjs(getEndDate(false, startDate));
  }

  useEffect(() => {
    if (editId && planned_start_time) {
      setMinToDateTime(getToEditMinDateTime(planned_start_time));
      setMaxToDateTime(getToEditMaxDateTime(planned_start_time));
    }
  }, [configStartTime, configEndTime, planned_start_time]);

  return (
    <>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 4 }}>
        <Grid item xs={12} sm={6} md={6}>
          <MuiTextField
            sx={{
              marginBottom: '20px',
            }}
            fullWidth
            variant="standard"
            name={title.name}
            label={title.label}
            setFieldValue={setFieldValue}
            isRequired
            formGroupClassName="m-1"
            type="text"
            inputProps={{
              maxLength: 150,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <MuiAutoComplete
            sx={{
              marginBottom: '20px',
            }}
            name={requestor.name}
            label={requestor.label}
            // disabled
            formGroupClassName="m-1"
            open={atOpen}
            isRequired
            oldValue={getOldData(requestor_id)}
            value={requestor_id && requestor_id.name ? requestor_id.name : ''}
            size="small"
            onOpen={() => {
              setAtOpen(true);
              setAtKeyword('');
            }}
            onClose={() => {
              setAtOpen(false);
              setAtKeyword('');
            }}
            loading={employeeListInfo && employeeListInfo.loading}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={employeeListOptions}
            apiError={(employeeListInfo && employeeListInfo.err) ? generateErrorMessage(employeeListInfo) : false}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onAtKeywordChange}
                variant="standard"
                label={requestor.label}
                required
                value={atKeyword}
                className={((requestor_id && requestor_id.id) || (atKeyword && atKeyword.length > 0))
                  ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {employeeListInfo && employeeListInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {((requestor_id && requestor_id.id) || (atKeyword && atKeyword.length > 0)) && (
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={onRequestorClear}
                          >
                            <IoCloseOutline size={22} fontSize="small" />
                          </IconButton>
                        )}
                        <IconButton
                          aria-label="toggle search visibility"
                          onClick={onRequestorSearch}
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
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <Typography
            sx={AddThemeColor({
              font: 'normal normal medium 20px/24px Suisse Intl',
              letterSpacing: '0.7px',
              fontWeight: 500,
              marginBottom: '10px',
              paddingBottom: '4px',
            })}
          >
            Asset Info
          </Typography>
          <Typography
            sx={{
              font: 'normal normal medium 20px/24px Suisse Intl',
              marginBottom: '2px',
              paddingBottom: '2px',
            }}
          >
            Type
          </Typography>
          <Box
            sx={{
              alignItems: 'center',
              gap: '3%',
              display: 'flex',
            }}
          >
            <RadioGroup
              row
              aria-labelledby="demo-form-control-label-placement"
              name="position"
              defaultValue="top"
            >
              {wpConfig && wpConfig.asset_type && (wpConfig.asset_type === 'Both' || wpConfig.asset_type === 'Equipment') && (
                <MuiFormLabel
                  name={typeValue.name}
                  checkedvalue="Equipment"
                  id="Equipment"
                  isDisabled={isNotEditable}
                  onClick={handleTimeChange}
                  label={typeValue.label}
                  value="equipment"
                  checked={eqtype ? true : ''}
                />
              )}
              {wpConfig && wpConfig.asset_type && (wpConfig.asset_type === 'Both' || wpConfig.asset_type === 'Space') && (
                <MuiFormLabel
                  name={typeValue.name}
                  checkedvalue="Space"
                  id="Space"
                  isDisabled={isNotEditable}
                  onClick={handleTimeChange}
                  label={typeValue.label1}
                  value="space"
                  checked={spacetype ? true : ''}
                />
              )}
            </RadioGroup>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          {typeData === 'Space'
            ? (
              editId
                ? (
                  <MuiAutoComplete
                    sx={{
                      marginBottom: '10px',
                    }}
                    name={space.name}
                    label={space.label}
                    open={spaceOpen}
                    isRequired
                    disabled={isNotEditable}
                    size="small"
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
                    onSearchMoreClick={onSpaceSearch}
                    getOptionLabel={(option) => (typeof option === 'string' ? option : option.path_name)}
                    options={spaceOptions}
                    apiError={(spaceInfoList && spaceInfoList.err) ? generateErrorMessage(spaceInfoList) : false}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        onChange={onSpaceKeywordChange}
                        variant="standard"
                        label={space.label}
                        className={((getOldData(space_id)) || (space_id && space_id.id) || (spacekeyword && spacekeyword.length > 0))
                          ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                        placeholder="Search & Select"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {spaceInfoList && spaceInfoList.loading ? <CircularProgress color="inherit" size={20} /> : null}
                              <InputAdornment position="end">
                                {!isNotEditable && ((getOldData(space_id)) || (space_id && space_id.id) || (spacekeyword && spacekeyword.length > 0)) && (
                                  <IconButton onClick={onSpaceClear}>
                                    <IoCloseOutline size={22} fontSize="small" />
                                  </IconButton>
                                )}
                                {!isNotEditable && (
                                  <IconButton onClick={onSpaceSearch}>
                                    <SearchIcon fontSize="small" />
                                  </IconButton>
                                )}
                              </InputAdornment>
                            </>
                          ),
                        }}
                      />
                    )}
                    renderOption={(props, option) => (
                      <Box {...props} sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body1">{option.name}</Typography>
                      </Box>
                    )}
                    ListboxComponent={(listboxProps) => (
                      <Box {...listboxProps} sx={{ paddingBottom: '50px' }}>
                        <List>
                          {listboxProps.children}
                          {' '}
                          {/* List of options */}
                          <Typography onClick={() => onSpaceSearch('Search More')} variant="body1" sx={{ color: AddThemeColor({}).color, marginLeft: '1rem', cursor: 'pointer' }}>Search More...</Typography>
                        </List>
                      </Box>
                    )}
                  />
                )
                : (
                  <>
                    {wpConfig && wpConfig.is_include_multiple_space ? (
                      <>
                        <Button
                          type="button"
                          variant="contained"
                          size="small"
                          onClick={() => setSpaceFilterModal(true)}
                        >
                          Select Spaces
                        </Button>
                        {spaces && spaces.length > 0 && (
                        <>
                          <p className="font-family-tab mt-3 ">
                            Selected Spaces:
                            {' '}
                            {spaces.length}
                          </p>
                          <Stack className="mb-3" direction="row" flexWrap="wrap">
                            {spaces.map((row) => (
                              <Chip
                                key={row.id}
                                label={row.space_name} // or row.equipmentName or whatever field represents it
                                onDelete={() => onSpaceDelete(row.id)}
                                className="mb-3 mr-3"
                              />
                            ))}
                          </Stack>
                        </>
                        )}
                        {spaceFilterModal && (
                        <SpaceSelection
                          filterModal={spaceFilterModal}
                          spaces={spaces && spaces.length > 0 ? spaces : []}
                          setSpaces={onSpaceModalChange}
                          finishText="Add Spaces"
                          onCancel={() => setSpaceFilterModal(false)}
                        />
                        )}
                      </>
                    ) : (
                      <>
                        <Typography
                          sx={{
                            font: 'normal normal medium 20px/24px Suisse Intl',
                            marginBottom: '2px',
                            paddingBottom: '6px',
                          }}
                        >
                          {space.label}
                          *
                        </Typography>
                        <Cascader
                          options={preprocessData(spaceCascader && spaceCascader.length > 0 ? spaceCascader : [])}
                          dropdownClassName="custom-cascader-popup"
                          fieldNames={{ label: 'name', value: 'id', children: 'children' }}
                      // defaultValue={space_id && space_id.length ? space_id : []}
                          value={spaceCascader ? getSpace() : []}
                          placeholder="Select"
                          notFoundContent="No options"
                          dropdownRender={dropdownRender}
                          onChange={onChange}
                      // loadData={loadData}
                          className="thin-scrollbar bg-white mb-3 pb-1 w-100"
                          changeOnSelect
                        />
                      </>
                    )}
                  </>
                ))
            : (
              <>
                {typeData === 'Equipment' && (
                  <>
                    {!editId && wpConfig && wpConfig.is_include_multiple_equipment ? (
                      <>
                        <Button
                          type="button"
                          variant="contained"
                          size="small"
                          onClick={() => setAssetFilterModal(true)}
                        >
                          Select Equipment
                        </Button>
                        {equipments && equipments.length > 0 && (
                        <>
                          <p className="font-family-tab mt-3 ">
                            Selected Equipment:
                            {' '}
                            {equipments.length}
                          </p>
                          <Stack className="mb-3" direction="row" flexWrap="wrap">
                            {equipments.map((row) => (
                              <Chip
                                key={row.id}
                                label={row.name} // or row.equipmentName or whatever field represents it
                                onDelete={() => onEquipmentDelete(row.id)}
                                className="mb-3 mr-3"
                              />
                            ))}
                          </Stack>
                        </>
                        )}
                        {assetFilterModal && (
                        <EquipmentsSelection
                          onAssetModalChange={onAssetModalChange}
                          filterModal={assetFilterModal}
                          setEquipments={onEquipmentAdd}
                          equipments={equipments}
                          finishText="Add Equipment"
                          onClose={onFetchAssetSchedules}
                          onCancel={() => setAssetFilterModal(false)}
                        />
                        )}
                      </>
                    ) : (
                      <MuiAutoComplete
                        sx={{
                          marginBottom: '10px',
                        }}
                        name={equipment.name}
                        label={equipment.label}
                        isRequired
                        disabled={isNotEditable}
                        open={equipmentOpen}
                        size="small"
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
                        onChange={(e, data) => { setFieldValue('equipment_id', data); setEquipmentShow(true); }}
                        apiError={(equipmentInfo && equipmentInfo.err) ? generateErrorMessage(equipmentInfo) : false}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            onChange={onEquipmentKeywordChange}
                            variant="standard"
                            className={((getOldData(equipment_id)) || (equipment_id && equipment_id.id) || (equipmentkeyword && equipmentkeyword.length > 0))
                              ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                            placeholder="Search & Select"
                            label={equipment.label}
                            required
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <>
                                  {equipmentInfo && equipmentInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                                  <InputAdornment position="end">
                                    {!isNotEditable && ((getOldData(equipment_id)) || (equipment_id && equipment_id.id) || (equipmentkeyword && equipmentkeyword.length > 0)) && (
                                    <IconButton onClick={onEquipmentClear}>
                                      <IoCloseOutline size={22} fontSize="small" />
                                    </IconButton>
                                    )}
                                    {!isNotEditable && (
                                    <IconButton onClick={onEquipemntSearch}>
                                      <SearchIcon fontSize="small" />
                                    </IconButton>
                                    )}
                                  </InputAdornment>
                                </>
                              ),
                            }}
                          />
                        )}
                        renderOption={(props, option) => (
                          <Box {...props} sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="body1">{option.name}</Typography>
                          </Box>
                        )}
                        ListboxComponent={(listboxProps) => (
                          <Box {...listboxProps} sx={{ paddingBottom: '50px' }}>
                            <List>
                              {listboxProps.children}
                              {' '}
                              {/* List of options */}
                              <Typography onClick={() => onEquipemntSearch('Search More')} variant="body1" sx={{ color: AddThemeColor({}).color, marginLeft: '1rem', cursor: 'pointer' }}>Search More...</Typography>
                            </List>
                          </Box>
                        )}
                      />
                    )}
                  </>
                )}
              </>
            )}
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          {wpConfig && wpConfig.work_location && wpConfig.work_location !== 'None' && (
            <MuiTextField
              sx={{
                marginBottom: '10px',
              }}
              fullWidth
              variant="standard"
              setFieldValue={setFieldValue}
              name={workLocation.name}
              label={workLocation.label}
              disabled={isNotEditable}
              isRequired={wpConfig && wpConfig.work_location && wpConfig.work_location === 'Required'}
              formGroupClassName="m-1"
              autoComplete="off"
              inputProps={{
                maxLength: 150,
              }}
            />
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <Typography
            sx={AddThemeColor({
              font: 'normal normal medium 20px/24px Suisse Intl',
              letterSpacing: '0.7px',
              fontWeight: 500,
              marginBottom: '10px',
              paddingBottom: '4px',
            })}
          >
            Permit Info
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <Typography
            sx={AddThemeColor({
              font: 'normal normal medium 20px/24px Suisse Intl',
              letterSpacing: '0.7px',
              fontWeight: 500,
              marginBottom: '10px',
              paddingBottom: '4px',
            })}
          >
            Vendor Info
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          {getTypeLabels(customData.typeRequest) && getTypeLabels(customData.typeRequest).length > 1 && (
          <MuiAutoComplete
            sx={{
              marginBottom: '20px',
            }}
            name={typeOfRequest.name}
            placeholder="Enter Title"
            label={typeOfRequest.label}
            formGroupClassName="m-1"
            className="bg-white"
            open={typeRequest}
            isRequired
            disabled={isNotEditable}
            disableClearable
            oldValue={type_of_request}
            value={type_of_request && type_of_request.label ? type_of_request.label : type_of_request}
            size="small"
            onOpen={() => {
              setTypeRequest(true);
              setDepShow(false);
            }}
            onClose={() => {
              setTypeRequest(false);
            }}
            onChange={(e, value) => {
              if (!value) { removeDefaultTime(); setFieldValue('type_of_request', ''); } else {
                setFieldValue('type_of_request', value); setDepShow(true);
              }
            }}
            getOptionSelected={(option, value) => option.label === value.label}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
            options={getTypeLabels(customData.typeRequest)}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                className="without-padding"
                placeholder="Select"
                required
                label={typeOfRequest.label}
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
          />
          )}
          {wpConfig && wpConfig.is_enable_type_of_work && (
            <MuiAutoComplete
              sx={{
                marginBottom: '20px',
              }}
              name={typeOfWork.name}
              label={typeOfWork.label}
              disabled={isNotEditable}
              isRequired
              formGroupClassName="m-1"
              oldValue={getOldData(type_work_id)}
              value={type_work_id && type_work_id.name ? type_work_id.name : getOldData(type_work_id)}
              apiError={(typeWork && typeWork.err) ? generateErrorMessage(typeWork) : false}
              open={workOpen}
              size="small"
              onOpen={() => {
                setWorkOpen(true);
                setWorkKeyword('');
              }}
              onClose={() => {
                setWorkOpen(false);
                setWorkKeyword('');
              }}
              loading={typeWork && typeWork.loading}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={typeWorkOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={(e) => setWorkKeyword(e.target.value)}
                  label={typeOfWork.label}
                  required
                  variant="standard"
                  value={workKeyword}
                  className={((getOldData(type_work_id)) || (type_work_id && type_work_id.id) || (workKeyword && workKeyword.length > 0))
                    ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                  placeholder="Search & Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {typeWork && typeWork.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        <InputAdornment position="end">
                          {!isNotEditable && ((getOldData(type_work_id)) || (type_work_id && type_work_id.id) || (workKeyword && workKeyword.length > 0)) && (
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={onWorkClear}
                            >
                              <IoCloseOutline size={22} fontSize="small" />
                            </IconButton>
                          )}
                          {!isNotEditable && (
                          <IconButton
                            aria-label="toggle search visibility"
                            onClick={showWorkModal}
                          >
                            <SearchIcon fontSize="small" />
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
          {wpConfig && wpConfig.is_enable_department && (
            <MuiAutoComplete
              sx={{
                marginTop: '10px',
                marginBottom: '20px',
              }}
              name={departmentId.name}
              label={departmentId.label}
              disabled={isNotEditable}
              formGroupClassName="m-1"
              oldValue={getOldData(department_id)}
              value={department_id && department_id.name ? department_id.name : getOldData(department_id)}
              apiError={(wpDepartments && wpDepartments.err) ? generateErrorMessage(wpDepartments) : false}
              open={depOpen}
              size="small"
              onOpen={() => {
                setDepOpen(true);
                setDepKeyword('');
                setDepShow(false);
              }}
              onClose={() => {
                setDepOpen(false);
                setDepKeyword('');
              }}
              onChange={(e, data) => {
                setFieldValue('department_id', '');
                setFieldValue('issue_permit_approval_id', '');
                setFieldValue('ehs_authority_id', '');
                setFieldValue('security_office_id', '');
                setFieldValue('department_id', data);
                setDepShow(true);
              }}
              loading={wpDepartments && wpDepartments.loading}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={departmentOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={(e) => setDepKeyword(e.target.value)}
                  variant="standard"
                  label={departmentId.label}
                  value={depKeyword}
                  className={((getOldData(department_id)) || (department_id && department_id.id) || (depKeyword && depKeyword.length > 0))
                    ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                  placeholder="Search & Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {wpDepartments && wpDepartments.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        <InputAdornment position="end">
                          {((getOldData(department_id)) || (department_id && department_id.id) || (depKeyword && depKeyword.length > 0)) && (
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={onDepClear}
                            >
                              <IoCloseOutline size={22} fontSize="small" />
                            </IconButton>
                          )}
                          <IconButton
                            aria-label="toggle search visibility"
                            onClick={showDepModal}
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
          )}
          <MuiAutoComplete
            sx={{
              marginBottom: '20px',
            }}
            name={natureOfWork.name}
            label={natureOfWork.label}
            isRequired
            disabled={isNotEditable}
            formGroupClassName="m-1"
            oldValue={getOldData(nature_work_id)}
            value={nature_work_id && nature_work_id.name ? nature_work_id.name : getOldData(nature_work_id)}
            apiError={(workNature && workNature.err) ? generateErrorMessage(workNature) : false}
            open={natureOpen}
            size="small"
            onOpen={() => {
              setNatureOpen(true);
              setNatureKeyword('');
              setNatureShow(false);
            }}
            onClose={() => {
              setNatureOpen(false);
              setNatureKeyword('');
            }}
            onChange={(e, data) => {
              setFieldValue('nature_work_id', '');
              setFieldValue('task_id', '');
              setFieldValue('preparedness_checklist_id', '');
              setFieldValue('issue_permit_checklist_id', '');
              setFieldValue('issue_permit_approval_id', '');
              setFieldValue('ehs_authority_id', '');
              setFieldValue('security_office_id', '');
              setFieldValue('ehs_instructions', '');
              setFieldValue('terms_conditions', '');
              setFieldValue('nature_work_id', data);
              setNatureShow(true);
            }}
            loading={workNature && workNature.loading}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={workNatureOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={(e) => setNatureKeyword(e.target.value)}
                variant="standard"
                value={workKeyword}
                className={((getOldData(nature_work_id)) || (nature_work_id && nature_work_id.id) || (workKeyword && workKeyword.length > 0))
                  ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                placeholder="Search & Select"
                label={natureOfWork.label}
                required
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {workNature && workNature.loading ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {!isNotEditable && ((getOldData(nature_work_id)) || (nature_work_id && nature_work_id.id) || (workKeyword && workKeyword.length > 0)) && (
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={onNatureClear}
                          >
                            <IoCloseOutline size={22} fontSize="small" />
                          </IconButton>
                        )}
                        {!isNotEditable && (
                        <IconButton
                          aria-label="toggle search visibility"
                          onClick={showNatureModal}
                        >
                          <SearchIcon fontSize="small" />
                        </IconButton>
                        )}
                      </InputAdornment>
                    </>
                  ),
                }}
              />
            )}
          />
          <MuiDateTimeField
            sx={{
              marginBottom: '20px',
            }}
            minDateTime={!editId ? dayjs(moment(getStartDate(false)).format('YYYY-MM-DD HH:mm:ss')) : getFromEditMinDateTime()}
            maxDateTime={!editId && !(!getIsFromEditable() && !getIsToEditable()) ? dayjs(moment(getEndDate(planned_end_time || false)).format('YYYY-MM-DD HH:mm:ss')) : getFromEditMaxDateTime()}
           // slotProps={{ textField: { variant: 'standard', error: false } }}
            name={plannedStartTime.name}
            label={plannedStartTime.label}
            value={planned_start_time ? dayjs(editId && !isPlanInNew ? moment.utc(planned_start_time).local().tz(userInfo?.data?.timezone).format('YYYY-MM-DD HH:mm:ss') : planned_start_time) : null}
            setFieldValue={setFieldValue}
            setFieldTouched={setFieldTouched}
            shouldDisableTime={(timeValue, clockType) => {
              if (!(!getIsFromEditable() && !getIsToEditable())) return false;
              const hour = timeValue.hour();
              if (clockType === 'hours') {
                return hour < getStartEndHours().startHour || hour > getStartEndHours().endHour;
              }

              return false;
            }}
            ampm={false}
            isErrorHandle
            noSeconds
            errorField="start_valid"
            isRequired
           // disablePast
            disabled={getIsFromEditable() || isNotEditable}
           // readOnly={getIsFromEditable() || isNotEditable}
            showNow={false}
           // disabledTime={disabledRangeTime}
          />
          <MuiDateTimeField
            sx={{
              marginBottom: '20px',
            }}
            minDateTime={!editId ? dayjs(moment(getStartDate(planned_start_time || false)).format('YYYY-MM-DD HH:mm:ss')) : minToDateTime}
            maxDateTime={!editId ? dayjs(moment(getEndDate(false, !getIsFromEditable() && !getIsToEditable() ? planned_start_time : false)).format('YYYY-MM-DD HH:mm:ss')) : maxToDateTime}
           // slotProps={{ textField: { variant: 'standard', error: false } }}
            name={plannedEndTime.name}
            label={plannedEndTime.label}
            value={planned_end_time ? dayjs(editId && !isPlanOutNew ? moment.utc(planned_end_time).local().tz(userInfo?.data?.timezone).format('YYYY-MM-DD HH:mm:ss') : planned_end_time) : null}
            setFieldValue={setFieldValue}
            setFieldTouched={setFieldTouched}
            isErrorHandle
            noSeconds
            errorField="end_valid"
            ampm={false}
            isRequired
           // disablePast
           // readOnly={getIsToEditable() || isNotEditable}
            disabled={isNotEditable || getIsToEditable()}
            showNow={false}
            // disabledTime={disabledRangeTime}
           // startDate={!configStartTime && !configStartTime && new Date(planned_start_time)}
            // endDate={!configStartTime && !configStartTime && disableEndDate()}
          />
          {validThroughDate && (
          <MuiDateField
            sx={{ marginBottom: '20px' }}
            minDate={
           (editId && isPlanInNew) || !editId
             ? dayjs(planned_end_time)
             : dayjs.utc(planned_end_time).tz(userInfo?.data?.timezone)
         }
            maxDate={dayjs(validThroughDate)}
            name="valid_through"
            label="Valid Through"
            value={
           (editId && isValidNew) || !editId
             ? dayjs(valid_through)
             : dayjs.utc(valid_through).tz(userInfo?.data?.timezone)
         }
            setFieldValue={setFieldValue}
            setFieldTouched={setFieldTouched}
            isErrorHandle
            errorField="valid_valid"
            ampm={false}
            disablePast
            disabled={isNotEditable}
            showNow={false}
          />
          )}
          {type_of_request && type_of_request.value && !configEndTime && (
            <div className="text-danger ml-1 font-tiny font-family-tab">
              Please configure Planned End Time
            </div>
          )}
          <MuiAutoComplete
            sx={{
              marginBottom: '20px',
            }}
            name={maintenanceCheckList.name}
            label={maintenanceCheckList.label}
            className="bg-white"
            formGroupClassName="m-1"
            open={taskOpen}
            size="small"
            disabled
            oldValue={getOldData(task_id)}
            value={task_id && task_id.name ? task_id.name : getOldData(task_id)}
            onOpen={() => {
              setTaskOpen(true);
            }}
            onClose={() => {
              setTaskOpen(false);
            }}
            apiError={(taskInfo && taskInfo.err) ? generateErrorMessage(taskInfo) : false}
            loading={taskInfo && taskInfo.loading}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={taskOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onTaskKeywordChange}
                variant="standard"
                label={maintenanceCheckList.label}
                className={((getOldData(task_id)) || (task_id && task_id.id) || (taskKeyword && taskKeyword.length > 0))
                  ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {taskInfo && taskInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                    </>
                  ),
                }}
              />
            )}
          />
          <MuiAutoComplete
            sx={{
              marginBottom: '20px',
            }}
            name={issuePermitCheckList.name}
            label={issuePermitCheckList.label}
            className="bg-white"
            formGroupClassName="m-1"
            open={taskOpen}
            size="small"
            disabled
            oldValue={getOldData(issue_permit_checklist_id)}
            value={issue_permit_checklist_id && issue_permit_checklist_id.name ? issue_permit_checklist_id.name : getOldData(issue_permit_checklist_id)}
            onOpen={() => {
              setTaskOpen(true);
            }}
            onClose={() => {
              setTaskOpen(false);
            }}
            apiError={(taskInfo && taskInfo.err) ? generateErrorMessage(taskInfo) : false}
            loading={taskInfo && taskInfo.loading}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={taskOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onTaskKeywordChange}
                variant="standard"
                label={issuePermitCheckList.label}
                className={((getOldData(issue_permit_checklist_id)) || (issue_permit_checklist_id && issue_permit_checklist_id.id) || (taskKeyword && taskKeyword.length > 0))
                  ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {taskInfo && taskInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                    </>
                  ),
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <MuiAutoComplete
            sx={{
              marginBottom: '20px',
            }}
            name={vendor.name}
            label={vendor.label}
            formGroupClassName="m-1"
            oldValue={getOldData(vendor_id)}
            value={vendor_id && vendor_id.name ? vendor_id.name : getOldData(vendor_id)}
            // apiError={(partnersInfo && partnersInfo.err) ? generateErrorMessage(partnersInfo) : false}
            open={customerOpen && !(noData && (noData.status_code && noData.status_code === 404) && (customerKeyword && customerKeyword.length >= 3)
              && (createTenantinfo && !createTenantinfo.err) && (createTenantinfo && !createTenantinfo.data))}
            size="small"
            onOpen={() => {
              setCustomerOpen(true);
            }}
            onClose={() => {
              setCustomerOpen(false);
            }}
            classes={{
              option: classes.option,
            }}
            loading={partnersInfo && partnersInfo.loading}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            renderOption={(props, option) => (
              <ListItemText
                {...props}
                primary={(
                  <>
                    <Box>
                      <Typography
                        sx={{
                          font: 'Suisse Intl',
                          fontWeight: 500,
                          fontSize: '15px',
                        }}
                      >
                        {option.name}
                      </Typography>
                    </Box>
                    {option?.email && (
                      <Box>
                        <Typography
                          sx={{
                            font: 'Suisse Intl',
                            fontSize: '12px',
                          }}
                        >
                          <MailOutline
                            style={{ height: '15px' }}
                            cursor="pointer"
                          />
                          {option?.email}
                        </Typography>
                      </Box>
                    )}
                    {option?.mobile && (
                      <Box>
                        <Typography
                          sx={{
                            font: 'Suisse Intl',
                            fontSize: '12px',
                          }}
                        >
                          <CallOutlined
                            style={{ height: '15px' }}
                            cursor="pointer"
                          />
                          <span className="">{option.mobile}</span>
                        </Typography>
                      </Box>
                    )}
                  </>
                )}
              />
            )}
            onChange={(e, data) => { setFieldValue('vendor_id', data); setVendorShow(true); }}
            options={customerOptions}
            customError={(noData && (noData.status_code && noData.status_code === 404) && (customerKeyword && customerKeyword.length >= 3)
              && (createTenantinfo && !createTenantinfo.err) && (createTenantinfo && !createTenantinfo.data)) && (
              <FormHelperText>
                <span>{`New Vendor "${customerKeyword}" will be created. Do you want to create..? Click`}</span>
                <span aria-hidden="true" onClick={() => { setAddCustomerModal(true); setCustomerOpen(false); }} className="text-info ml-2 cursor-pointer">YES</span>
                <span aria-hidden="true" onClick={() => onCustomerKeywordClear()} className="text-info ml-2 cursor-pointer">NO</span>
              </FormHelperText>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onCustomerKeywordChange}
                variant="standard"
                label={vendor.label}
                value={customerKeyword}
                className={((vendor_id && vendor_id.id) || (customerKeyword && customerKeyword.length > 0) || (vendor_id && vendor_id.length))
                  ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {partnersInfo && partnersInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {(getOldData(vendor_id) || (vendor_id && vendor_id.id) || (customerKeyword && customerKeyword.length > 0)) && (
                          <IconButton onClick={onCustomerKeywordClear}>
                            <IoCloseOutline size={22} fontSize="small" />
                          </IconButton>
                        )}
                        <IconButton onClick={showRequestorModal}>
                          <SearchIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    </>
                  ),
                }}
              />
            )}
          />
          {((partnersInfo && partnersInfo.err && customerOpen) && !(noData.status_code && noData.status_code === 404)) && (
            <FormHelperText><span className="text-danger">{generateErrorMessage(partnersInfo)}</span></FormHelperText>
          )}
          {((createTenantinfo && createTenantinfo.err) && !(vendor_id)) && (
            <FormHelperText><span className="text-danger">{generateErrorMessage(createTenantinfo)}</span></FormHelperText>
          )}
          <MuiTextField
            sx={{
              marginBottom: '20px',
            }}
            fullWidth
            variant="standard"
            name={vendorEmail.name}
            type="email"
            setFieldValue={setFieldValue}
            label={vendorEmail.label}
            formGroupClassName="m-1"
            placeholder="Enter email"
            inputProps={{
              maxLength: 60,
            }}
          />
          <MuiTextField
            sx={{
              marginBottom: '20px',
            }}
            fullWidth
            variant="standard"
            name={vendorPoc.name}
            setFieldValue={setFieldValue}
            label={vendorPoc.label}
            formGroupClassName="m-1"
            type="text"
            inputProps={{
              maxLength: 150,
            }}
          />
          <MuiTextField
            sx={{
              marginTop: '10px',
              marginBottom: '20px',
            }}
            fullWidth
            variant="standard"
            setFieldValue={setFieldValue}
            name={vendorMobile.name}
            type="text"
            label={vendorMobile.label}
            onKeyPress={integerKeyPress}
            formGroupClassName="m-1"
            placeholder="Enter mobile"
            inputProps={{
              maxLength: 12,
            }}
          />
          {wpConfig && wpConfig.is_prepared_required && (
            <MuiAutoComplete
              sx={{
                marginTop: '10px',
                marginBottom: '20px',
              }}
              name={preparednessCheckList.name}
              label={preparednessCheckList.label}
              className="bg-white"
              formGroupClassName="m-1"
              open={prepareOpen}
              size="small"
              isRequired
              disabled
              oldValue={getOldData(preparedness_checklist_id)}
              value={preparedness_checklist_id && preparedness_checklist_id.name ? preparedness_checklist_id.name : getOldData(preparedness_checklist_id)}
              onOpen={() => {
                setPrepareOpen(true);
              }}
              onClose={() => {
                setPrepareOpen(false);
              }}
              apiError={(prepareInfo && prepareInfo.err) ? generateErrorMessage(prepareInfo) : false}
              loading={prepareInfo && prepareInfo.loading}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={prepareOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={onPrepareKeywordChange}
                  variant="standard"
                  label={preparednessCheckList.label}
                  required
                  className={((getOldData(preparedness_checklist_id)) || (preparedness_checklist_id && preparedness_checklist_id.id) || (prepareKeyword && prepareKeyword.length > 0))
                    ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                  placeholder="Search & Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {prepareInfo && prepareInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                      </>
                    ),
                  }}
                />
              )}
            />
          )}
          <Box
            sx={{
              width: '100%',
              marginTop: '20px',
            }}
          >
            <p className="mb-1 mt-0 ml-1 font-weight-500 font-14">Vendor Technicians</p>
            <Table className="ml-1">
              <thead>
                <tr className="bg-white">
                  <th className="p-2 min-width-200 border-0">
                    Name
                  </th>
                  <th className="p-2 min-width-160 border-0">
                    Mobile
                  </th>
                  <th className="p-2 min-width-100 border-0">
                    Age
                  </th>
                  <th className="p-2 min-width-100 border-0">
                    <span className="invisible">Del</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="7" className="text-left">
                    <div aria-hidden="true" className="font-weight-800 text-lightblue cursor-pointer mt-1 mb-1" onClick={loadEmptyTd}>
                      <img src={addIcon} className="mr-2 mb-1" alt="addequipment" height="15" width="15" />
                      <span className="mr-5">Add a Line</span>
                    </div>
                  </td>
                </tr>
                {(partsData && partsData.length > 0 && partsData.map((pl, index) => (
                  <>
                    {!pl.isRemove && (
                      <tr key={index} className="font-weight-400">
                        <td className="p-2">
                          <TextField
                            name="vendorName"
                            value={pl.name}
                            label=""
                            variant="standard"
                            onChange={(e) => onNameChange(e, index)}
                            inputProps={{
                              maxLength: 15,
                            }}
                          />
                        </td>
                        <td className="p-2">
                          <TextField
                            name="vendorMobile"
                            value={pl.mobile}
                            label=""
                            variant="standard"
                            onKeyPress={decimalKeyPressDown}
                            onChange={(e) => onMobileChange(e, index)}
                            inputProps={{
                              maxLength: 12,
                            }}
                          />
                        </td>
                        <td className="p-2">
                          <TextField
                            name="vendorAge"
                            value={pl.age}
                            label=""
                            variant="standard"
                            onKeyPress={decimalKeyPressDown}
                            onChange={(e) => onAgeChange(e, index)}
                            inputProps={{
                              maxLength: 3,
                            }}
                          />
                        </td>
                        <td className="p-2">
                          <span className="font-weight-400 d-inline-block" />
                          <FontAwesomeIcon className="mr-1 ml-1 cursor-pointer" size="sm" icon={faTrashAlt} onClick={(e) => { removeData(e, index); }} />
                        </td>
                      </tr>
                    )}
                  </>
                )))}
              </tbody>
            </Table>
          </Box>
        </Grid>
      </Grid>
      <AdditionalForm formField={formField} setFieldTouched={setFieldTouched} setFieldValue={setFieldValue} editId={editId} />
      <Dialog size="xl" fullWidth open={extraModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraModal(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <AdvancedSearchModal
              modelName={modelValue}
              afterReset={() => { setExtraModal(false); }}
              fieldName={fieldName}
              fields={columns}
              company={companyValue}
              setFieldValue={setFieldValue}
              placeholderName={placeholderName}

            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Dialog size="xl" fullWidth open={extraMultipleModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setFieldName(''); setKeywordSearch(''); setExtraMultipleModal(false); }} />
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
              setVendorShow={setVendorShow}
              setNatureShow={setNatureShow}
              setDepShow={setDepShow}
              keywordSearch={keywordSearch}
              setKeywordSearch={setKeywordSearch}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Dialog size={(createTenantinfo && createTenantinfo.data) ? 'sm' : 'xl'} fullWidth open={addCustomerModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setAddCustomerModal(false); setCustomerKeyword(null); }} response={createTenantinfo} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <AddCustomer
              afterReset={() => { onCustomerClose(); setAddCustomerModal(false); setVendorShow(true); }}
              setFieldValue={setFieldValue}
              requestorName={customerKeyword}
              type="vendor"
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
};

BasicForm.propTypes = {
  formField: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  editId: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]).isRequired,
  setFieldTouched: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default BasicForm;
