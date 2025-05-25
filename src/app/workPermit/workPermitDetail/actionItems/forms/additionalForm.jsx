/* eslint-disable react/jsx-no-bind */
/* eslint-disable max-len */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable camelcase */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Row, Col,
  Label,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useFormikContext } from 'formik';
import {
  TextField, CircularProgress,
} from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';
import moment from 'moment';
import DialogHeader from '../../../../commonComponents/dialogHeader';
import { Dialog, DialogContent, DialogContentText } from '@mui/material'

import {
  DateTimeFieldSingle, CheckboxFieldGroup, FormikAutocomplete,
} from '@shared/formFields';
import {
  getDateTimeSeconds, getAllowedCompanies, generateErrorMessage, extractOptionsObject,
  getHoursAndMinutes, getColumnArrayById,
} from '../../../../util/appUtils';
import {
  getTeamList,
} from '../../../../assets/equipmentService';
import {
  getEmployeeMembers,
} from '../../../../workorders/workorderService';
import AdvancedSearchModal from '../../../forms/advancedSearchModal';
import customData from '../../../data/customData.json';

const appModels = require('../../../../util/appModels').default;

const AdditionalForm = (props) => {
  const {
    setFieldValue,
    setFieldTouched,
    details,
    formField: {
      extendType,
      typeofRequest,
      plannedStartTime,
      plannedEndTime,
      approvalAuthority,
      userId,
    },
  } = props;
  const { values: formValues } = useFormikContext();
  const {
    approval_authority_id,
    extension_type,
    type_of_request,
    planned_start_time,
    planned_end_time,
    user_id,
  } = formValues;
  const dispatch = useDispatch();

  const [requestForOpen, setRequestForOpen] = useState(false);

  const [extraModal, setExtraModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [placeholderName, setPlaceholder] = useState('');
  const [columns, setColumns] = useState(['id', 'name']);

  const [employeeOpen, setEmployeeOpen] = useState(false);
  const [employeeKeyword, setEmployeeKeyword] = useState(false);
  const [l1Open, setL1Open] = useState(false);
  const [l1Keyword, setL1Keyword] = useState('');
  const [isTypeDisabled, setIsTypeDisabled] = useState(false);
  const [configStartTime, setConfigStartTime] = useState('');
  const [configEndTime, setConfigEndTime] = useState('');
  const [configApprovalTeam, setConfigApprovalTeam] = useState(false);
  const [requestLoad, setRequestLoad] = useState(false);

  const { userInfo } = useSelector((state) => state.user);
  const { employeeMembers } = useSelector((state) => state.workorder);
  const {
    teamsInfo,
  } = useSelector((state) => state.equipment);
  const { workPermitConfig } = useSelector((state) => state.workpermit);
  const companies = getAllowedCompanies(userInfo);

  const wpConfig = workPermitConfig && workPermitConfig.data && workPermitConfig.data.length ? workPermitConfig.data[0] : false;
  // const configStartTime = wpConfig && wpConfig.shift_from ? wpConfig.shift_from : false;
  // const configEndTime = wpConfig && wpConfig.shift_to ? wpConfig.shift_to : false;
  // const configApprovalTeam = wpConfig && wpConfig.approval_authority_shift_id && wpConfig.approval_authority_shift_id.id ? wpConfig.approval_authority_shift_id : false;

  const plannedEnd = details && (details.data && details.data.length > 0) ? details.data[0].planned_end_time : false;
  const plannedToday = moment(new Date()).format('YYYY-MM-DD').valueOf() === moment(plannedEnd).format('YYYY-MM-DD').valueOf();

  const getCustomLabel = (label) => {
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
  };

  useMemo(() => {
    if (type_of_request && type_of_request.value) {
      type_of_request.label = getCustomLabel(type_of_request.label);
    }
  }, [type_of_request]);

  useMemo(() => {
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
    } else {
      setFieldValue('type_of_request', { value: 'Normal', label: 'General' });
    }
    setRequestLoad(Math.random());
  }, [workPermitConfig]);

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
    if (type_of_request && type_of_request.value && wpConfig) {
      switch (type_of_request.value) {
        case 'Normal':
          setDefaultTime(
            wpConfig.general_shift_from || false,
            wpConfig.general_shift_to || false,
          );
          setConfigApprovalTeam(
            wpConfig.general_approval_authority_shift_id?.id ? wpConfig.general_approval_authority_shift_id : false,
          );
          break; // Use break instead of return for clarity
        case 'Night Work':
          setDefaultTime(
            wpConfig.night_shift_from || false,
            wpConfig.night_shift_to || false,
          );
          setConfigApprovalTeam(
            wpConfig.night_approval_authority_shift_id?.id ? wpConfig.night_approval_authority_shift_id : false,
          );
          break;
        case 'Special':
          setDefaultTime(
            wpConfig.special_shift_from || false,
            wpConfig.special_shift_to || false,
          );
          setConfigApprovalTeam(
            wpConfig.special_approval_authority_shift_id?.id ? wpConfig.special_approval_authority_shift_id : false,
          );
          break;
        default:
          removeDefaultTime();
          break;
      }
    }
  }, [wpConfig, type_of_request]);

  useEffect(() => {
    setFieldValue('date_valid', 'yes');
    if (planned_end_time && planned_start_time && (new Date(planned_end_time) < new Date(planned_start_time))) {
      setFieldValue('date_valid', '');
    } else {
      setFieldValue('date_valid', 'yes');
    }
  }, [planned_start_time, planned_end_time]);

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
    /* if (extension_type === 'Current Date') {
      res = false;
    } */
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

  function isTwoDays(startHour, endHour) {
    // Create Date object for the first datetime
    let res = false;
    if (startHour && endHour) {
      const currentDate = new Date();

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
      if (moment(new Date(endDate)).format('YYYY-MM-DD') > moment(startDate).format('YYYY-MM-DD')) {
        res = true;
      }
      const newEndDate = moment(new Date(endDate)).add(getToExtendTime(), 'h').format('YYYY-MM-DD HH:mm:ss');
      if (moment(new Date(newEndDate)).format('YYYY-MM-DD') > moment(startDate).format('YYYY-MM-DD')) {
        res = true;
      }
      const hm1 = getHoursAndMinutes(startHour);
      const hours1 = hm1 && hm1.hour ? hm1.hour : 0;
      const minutes1 = hm1 && hm1.minutes ? hm1.minutes : 0;
      const dateAct1 = moment(currentDate).format('YYYY-MM-DD');
      const calStartDate = `${dateAct1} ${hours1 >= 10 ? hours1 : `0${hours1}`}:${minutes1 >= 10 ? minutes1 : `0${minutes1}`}`;
      const newStartdate = moment(new Date(calStartDate)).subtract(getFromExtendTime(), 'h').format('YYYY-MM-DD HH:mm:ss');
      if (moment(new Date(newStartdate)).format('YYYY-MM-DD') < moment(currentDate).format('YYYY-MM-DD')) {
        res = true;
      }
    }
    return res;
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
        let calEndDate = getCalEndDate(configStartTime, configEndTime, psTime);
        if (extension_type === 'Current Date') {
          calEndDate = new Date(planned_start_time);
        }
        console.log(extension_type === 'Current Date');
        let dateAct1 = moment(calEndDate).add(getToExtendTime(), 'h').add(cet === 23 ? 59 : 0, 'minutes').format('YYYY-MM-DD HH:mm:ss');
        if (extension_type === 'Current Date') {
          const eHours = calEndDate.getHours() + 1;
          dateAct1 = moment(calEndDate).add(24 - eHours, 'h').add(cet === 23 ? 59 : 0, 'minutes').format('YYYY-MM-DD HH:mm:ss');
        }
        console.log(dateAct1);
        configStartDateString = dateAct1;
      }
      configStartDateSet = new Date(configStartDateString);
    }
    return configStartDateSet;
  }

  const range = (min, max) => [...Array(max - min + 1).keys()].map((i) => i + min);

  function getDisabledHours() {
    let result = [];
    if (configStartTime && configEndTime) {
      const hm1 = getHoursAndMinutes(configStartTime);
      const start = hm1 && hm1.hour ? hm1.hour : 0;

      const hm2 = getHoursAndMinutes(configEndTime);
      const end = hm2 && hm2.hour ? hm2.hour : 0;
      if (start && end) {
        result = range(start, end);
      }
    }
    return result;
  }

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && l1Open) {
        await dispatch(getTeamList(companies, appModels.TEAM, l1Keyword));
      }
    })();
  }, [userInfo, l1Keyword, l1Open]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && employeeOpen) {
        const teamId = (approval_authority_id && approval_authority_id.member_ids);
        const tMembers = getColumnArrayById(teamId, 'id');
        await dispatch(getEmployeeMembers(companies, appModels.EMPLOYEEMEMBERS, employeeKeyword, tMembers, false, 'user'));
      }
    })();
  }, [userInfo, employeeKeyword, employeeOpen, approval_authority_id]);

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

  useEffect(() => {
    if (type_of_request && type_of_request.value) {
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
        if (extension_type !== 'Current Date') {
          setFieldValue('planned_start_time', moment(configStartDate));
          setFieldValue('planned_end_time', moment(configEndDate));
        } else {
          const pEnd = moment.utc(plannedEnd).local().format('YYYY-MM-DD HH:mm:ss');
          setFieldValue('planned_start_time', moment(new Date(pEnd)));
        }
        if (configApprovalTeam) {
          setFieldValue('approval_authority_id', configApprovalTeam);
        }
        setIsTypeDisabled('yes');
      } else if (!configStartTime || !configEndTime) {
        setIsTypeDisabled(Math.random());
        setFieldValue('planned_start_time', '');
        setFieldValue('planned_end_time', '');
      }
    }
  }, [configStartTime, configEndTime, workPermitConfig, extension_type]);

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
      if (extension_type !== 'Current Date') {
        setFieldValue('planned_end_time', moment(configEndDate));
      }
    }
  }, [planned_start_time, extension_type]);

  useEffect(() => {
    if (planned_start_time && planned_end_time && !configStartTime && !configEndTime && new Date(planned_start_time) >= new Date(planned_end_time)) {
      setFieldValue('planned_end_time', moment(planned_start_time).add(10, 'minutes'));
    }
  }, [planned_end_time]);

  const onL1KeywordChange = (event) => {
    setL1Keyword(event.target.value);
  };

  const onL1Clear = () => {
    setL1Keyword(null);
    setFieldValue('approval_authority_id', '');
    setFieldValue('user_id', '');
    setL1Open(false);
  };

  const showL1Modal = () => {
    setModelValue(appModels.TEAM);
    setColumns(['id', 'name', 'member_ids']);
    setFieldName('approval_authority_id');
    setModalName('Approval Authority');
    setPlaceholder('Approval Authority');
    setCompanyValue(companies);
    setExtraModal(true);
  };

  const onEmployeeKeywordChange = (event) => {
    setEmployeeKeyword(event.target.value);
  };

  const onValidatedByClear = () => {
    setEmployeeKeyword(null);
    setFieldValue('user_id', '');
    setEmployeeOpen(false);
  };

  const showValidatedByModal = () => {
    setModelValue(appModels.EMPLOYEEMEMBERS);
    setColumns(['id', 'user_id']);
    setFieldName('user_id');
    setModalName('Approval User');
    setPlaceholder('Approval User');
    setCompanyValue(companies);
    setExtraModal(true);
  };

  const l1Options = extractOptionsObject(teamsInfo, approval_authority_id);
  let employeeOptions = [];

  if (employeeMembers && employeeMembers.loading) {
    employeeOptions = [{ name: 'Loading..' }];
  }
  if (employeeMembers && employeeMembers.data) {
    // const mid = detailData && detailData.employee_id ? detailData.employee_id[0] : '';
    const employeeOptionsData = employeeMembers.data.map((cl) => ({
      ...cl, id: cl.user_id ? cl.user_id[0] : false, name: cl.user_id ? cl.user_id[1] : false,
    })); // getTrimmedArray(employeeMembers.data, 'id', mid);
    employeeOptions = [...new Map(employeeOptionsData.map((item) => [item.id, item])).values()];
  }

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

  const getRequestForLabel = (data) => {
    if (customData && customData.requestTypeText[data]) {
      return customData.requestTypeText[data].label;
    }
    return '';
  };

  const typeRequest = type_of_request && type_of_request.value ? type_of_request.value : type_of_request;

  return (
    <>
      <Row className="p-1">
        <>
          <Col md="6" sm="6" lg="6" xs="12">
            <Col md="12" sm="12" lg="12" xs="12" className="ml-1">
              <Label for={extendType.name} className="font-weight-600 m-0">
                Type
              </Label>
              <br />
              <CheckboxFieldGroup
                name={extendType.name}
                checkedvalue="Current Date"
                id="Current Date"
                isDisabled={!plannedToday}
                className="ml-2"
                label={extendType.label1}
              />
              <CheckboxFieldGroup
                name={extendType.name}
                checkedvalue="Future Date"
                id="Future Date"
                className="ml-2"
                label={extendType.label}
              />
            </Col>
          </Col>
          <Col md="6" sm="6" lg="6" xs="12">
            <Col xs={12} sm={12} lg={12} md={12}>
              <DateTimeFieldSingle
                name={plannedStartTime.name}
                label={plannedStartTime.label}
                isRequired
                readOnly={extension_type === 'Current Date' || getIsFromEditable()}
                formGroupClassName="m-1"
                setFieldValue={setFieldValue}
                setFieldTouched={setFieldTouched}
                placeholder={plannedStartTime.label}
                disablePastDate
                disableCustomEqual
                disabledStartTime={getStartDate(false, false)}
                disabledEndTime={getEndDate(planned_end_time && planned_start_time && new Date(planned_start_time) < new Date(planned_end_time) ? planned_end_time : false)}
                startDate={getStartDate(false, false)}
                isNoEnd={!getIsFromEditable() && !getIsToEditable()}
                endDate={getEndDate(planned_end_time && planned_start_time && new Date(planned_start_time) < new Date(planned_end_time) ? planned_end_time : false)}
                isTwoDays={isTwoDays(configStartTime, configEndTime)}
                // endDate={type_of_request && type_of_request.value !== 'Night Work' ? getStartDate() : false}
                showNow={false}
                defaultValue={planned_start_time ? new Date(getDateTimeSeconds(planned_start_time)) : ''}
              />
              {planned_end_time && planned_start_time && new Date(planned_start_time) > new Date(planned_end_time) && (
              <div className="text-danger ml-1 font-tiny">
                Planned Start Time Should be less then Planned End Time
              </div>
              )}
            </Col>
          </Col>
          <Col md="6" sm="6" lg="6" xs="12">
          {getTypeLabels(customData.requestType) && getTypeLabels(customData.requestType).length > 1 && (
            <Col xs={12} sm={12} lg={12} md={12}>
              <FormikAutocomplete
                name={typeofRequest.name}
                label={typeofRequest.label}
                className="bg-white"
                formGroupClassName="m-1"
                open={requestForOpen}
                disableClearable
                oldValue={getRequestForLabel(type_of_request)}
                value={type_of_request && type_of_request.label ? type_of_request.label : getRequestForLabel(type_of_request)}
                size="small"
                onOpen={() => {
                  setRequestForOpen(true);
                }}
                onClose={() => {
                  setRequestForOpen(false);
                }}
                getOptionSelected={(option, value) => option.label === value.label}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                options={getTypeLabels(customData.requestType)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    className="without-padding"
                    placeholder="Select"
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
            </Col>
          )}
          </Col>
          <Col md="6" sm="6" lg="6" xs="12">
            <Col xs={12} sm={12} lg={12} md={12}>
              <DateTimeFieldSingle
                name={plannedEndTime.name}
                label={plannedEndTime.label}
                isRequired
                formGroupClassName="m-1"
                setFieldValue={setFieldValue}
                setFieldTouched={setFieldTouched}
                placeholder={plannedEndTime.label}
                disablePastDate
                disableCustomEqual
                readOnly={getIsToEditable()}
                disabledStartTime={getStartDate(extension_type === 'Current Date' || (planned_end_time && planned_start_time && new Date(planned_start_time) < new Date(planned_end_time)) ? planned_start_time : false, 'isEnd')}
                disabledEndTime={getEndDate(false, !getIsFromEditable() && !getIsToEditable() ? planned_start_time : false)}
                startDate={getStartDate(extension_type === 'Current Date' || (planned_end_time && planned_start_time && new Date(planned_start_time) < new Date(planned_end_time)) ? planned_start_time : false, 'isEnd')}
                endDate={getEndDate(false, !getIsFromEditable() && !getIsToEditable() ? planned_start_time : false)}
                isTwoDays={isTwoDays(configStartTime, configEndTime)}
                showNow={false}
                defaultValue={planned_end_time ? new Date(getDateTimeSeconds(planned_end_time)) : ''}
              />
              {planned_end_time && planned_start_time && new Date(planned_start_time) > new Date(planned_end_time) && (
              <div className="text-danger ml-1 font-tiny">
                Planned Start Time Should be less then Planned End Time
              </div>
              )}
            </Col>
          </Col>
          {typeRequest !== 'Normal' && (
            <>
              <Col md="6" sm="6" lg="6" xs="12">
                <Col xs={12} sm={12} lg={12} md={12}>
                  <FormikAutocomplete
                    name={approvalAuthority.name}
                    label={approvalAuthority.label}
                    formGroupClassName="m-1"
                    open={l1Open}
                    isRequired
                    oldValue={getOldData(approval_authority_id)}
                    value={approval_authority_id && approval_authority_id.name ? approval_authority_id.name : getOldData(approval_authority_id)}
                    size="small"
                    onOpen={() => {
                      setL1Open(true);
                      setL1Keyword('');
                    }}
                    onClose={() => {
                      setL1Open(false);
                      setL1Keyword('');
                    }}
                    loading={teamsInfo && teamsInfo.loading && teamsInfo}
                    getOptionSelected={(option, value) => option.name === value.name}
                    getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                    apiError={(teamsInfo && teamsInfo.err) ? generateErrorMessage(teamsInfo) : false}
                    options={l1Options}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        onChange={onL1KeywordChange}
                        variant="outlined"
                        value={l1Keyword}
                        className={((approval_authority_id && approval_authority_id.id) || (l1Keyword && l1Keyword.length > 0))
                          ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                        placeholder="Search & Select"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {teamsInfo && teamsInfo.loading && l1Open ? <CircularProgress color="inherit" size={20} /> : null}
                              <InputAdornment position="end">
                                {((approval_authority_id && approval_authority_id.id) || (l1Keyword && l1Keyword.length > 0)) && (
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={onL1Clear}
                                >
                                  <BackspaceIcon fontSize="small" />
                                </IconButton>
                                )}
                                <IconButton
                                  aria-label="toggle search visibility"
                                  onClick={showL1Modal}
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
                </Col>
              </Col>
              <Col md="6" sm="6" lg="6" xs="12" />
              <Col md="6" sm="6" lg="6" xs="12">
                <Col xs={12} sm={12} lg={12} md={12}>
                  <FormikAutocomplete
                    name={userId.name}
                    label={userId.label}
                    formGroupClassName="m-1"
                    oldValue={getOldData(user_id)}
                    isRequired
                    disabled={!((approval_authority_id && approval_authority_id.id) || (getOldData(approval_authority_id)))}
                    value={user_id && user_id.name ? user_id.name : getOldData(user_id)}
                    apiError={(employeeMembers && employeeMembers.err) ? generateErrorMessage(employeeMembers) : false}
                    open={employeeOpen}
                    size="small"
                    onOpen={() => {
                      setEmployeeOpen(true);
                      setEmployeeKeyword('');
                    }}
                    onClose={() => {
                      setEmployeeOpen(false);
                      setEmployeeKeyword('');
                    }}
                    loading={employeeMembers && employeeMembers.loading}
                    getOptionSelected={(option, value) => option.name === value.name}
                    getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                    options={employeeOptions}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        onChange={onEmployeeKeywordChange}
                        variant="outlined"
                        className={((user_id && user_id.id) || (employeeKeyword && employeeKeyword.length > 0))
                          ? 'without-padding custom-icons bg-white' : 'without-padding custom-icons2 bg-white'}
                        placeholder="Search & Select"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {employeeMembers && employeeMembers.loading ? <CircularProgress color="inherit" size={20} /> : null}
                              <InputAdornment position="end">
                                {((user_id && user_id.id) || (employeeKeyword && employeeKeyword.length > 0)) && (
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={onValidatedByClear}
                                >
                                  <BackspaceIcon fontSize="small" />
                                </IconButton>
                                )}
                                <IconButton
                                  aria-label="toggle search visibility"
                                  onClick={showValidatedByModal}
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
                </Col>
              </Col>
            </>
          )}
        </>
      </Row>
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
            placeholderName={placeholderName}
            setFieldValue={setFieldValue}
            approvalTeam={approval_authority_id && approval_authority_id.member_ids}
          />
              </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
};

AdditionalForm.propTypes = {
  formField: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  setFieldTouched: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  details: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
};

export default AdditionalForm;
