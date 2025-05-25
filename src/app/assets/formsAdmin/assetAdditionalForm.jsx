/* eslint-disable camelcase */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import {
  CircularProgress,
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import {
  Autocomplete,
  Box,
  Dialog, DialogContent, DialogContentText,
  TextField,
  Typography,
} from '@mui/material';
import DOMPurify from 'dompurify';
import { useFormikContext } from 'formik';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import { infoValue } from '../../adminSetup/utils/utils';

// import { DateTimePicker } from '@material-ui/pickers';
// import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
// import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import MuiDateTimeField from '../../commonComponents/multipleFormFields/muiDateTimeField';
import UploadDocuments from './uploadDocuments';

import DialogHeader from '../../commonComponents/dialogHeader';

import MuiDatePicker from '../../commonComponents/multipleFormFields/muiDatePicker';
import { AddThemeColor } from '../../themes/theme';
import {
  decimalKeyPressDown,
  getAllowedCompanies, getDateTimeSeconds,
} from '../../util/appUtils';
import { bytesToSize } from '../../util/staticFunctions';
import assetActionData from '../data/assetsActions.json';
import {
  getEmployeeDataList,
  getEmployeeList,
  getOperatingHours,
  getTeamList,
} from '../equipmentService';
import AdvancedSearchModal from './advancedSearchModal';

const appModels = require('../../util/appModels').default;

const AssetAdditionalForm = (props) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [employeeKeyword, setEmployeeKeyword] = useState('');
  const [employeeShow, setEmployeeOpen] = useState(false);
  const [vsOpen, setVSOpen] = useState(false);
  const [wtOpen, setWtOpen] = useState(false);
  const [wtKeyword, setWtKeyword] = useState('');
  const [atOpen, setAtOpen] = useState(false);
  const [atKeyword, setAtKeyword] = useState('');
  const [tagOpen, setTagOpen] = useState(false);
  const [imgValidation, setimgValidation] = useState(false);
  const [imgSize, setimgSize] = useState(false);
  const [fileDataImage, setFileDataImage] = useState(false);
  const [fileDataType, setFileDataType] = useState(false);
  const [l1Open, setL1Open] = useState(false);
  const [l2Open, setL2Open] = useState(false);
  const [l3Open, setL3Open] = useState(false);
  const [l1Keyword, setL1Keyword] = useState('');
  const [l2Keyword, setL2Keyword] = useState('');
  const [l3Keyword, setL3Keyword] = useState('');
  const [hoursOpen, setHoursOpen] = useState(false);
  const [extraModal, setExtraModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [placeholderName, setPlaceholder] = useState('');
  const [columns, setColumns] = useState(['id', 'name']);
  const [selectedDate, setDateChange] = useState(new Date());

  const {
    isITAsset,
    setFieldValue,
    setFieldTouched,
    setPartsData,
    partsData,
    setPartsAdd,
    index,
    formData,
    formField: {
      validationStatus,
      validatedOn,
      validatedBy,
      comment,
      startDate,
      tagStatus,
      resourceCalendarId,
      employeeId,
      latitude,
      longitude,
      operatingHours,
      xPos,
      yPos,
      make,
      capacity,
      lastServiceDone,
      refillingDueDate,
      serial,
      model,
      criticality,
      monitoredById,
      managedById,
      maintainedById,
      ravValue,
      qrTag,
      nfcTag,
      rfidTag,
      virutualTag,
      equipmentNumber,
      Brand,
    },
  } = props;

  const { values: formValues } = useFormikContext();
  const {
    resource_calendar_id,
    employee_id,
    validated_by,
    monitored_by_id,
    managed_by_id,
    maintained_by_id,
    validated_on,
    operating_hours,
  } = formValues;

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const {
    hoursInfo, employeesInfo, employeeListInfo, teamsInfo, addAssetInfo,
  } = useSelector((state) => state.equipment);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && typeof wtOpen === 'number') {
        await dispatch(getOperatingHours(companies, appModels.RESOURCECALENDAR, wtKeyword));
      }
    })();
  }, [userInfo, wtKeyword, wtOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && typeof hoursOpen === 'number') {
        await dispatch(getOperatingHours(companies, appModels.RESOURCECALENDAR, wtKeyword));
      }
    })();
  }, [userInfo, wtKeyword, hoursOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && typeof employeeShow === 'number') {
        await dispatch(getEmployeeList(companies, appModels.USER, employeeKeyword));
      }
    })();
  }, [userInfo, employeeKeyword, employeeShow]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && typeof atOpen === 'number') {
        await dispatch(getEmployeeDataList(companies, appModels.EMPLOYEE, atKeyword));
      }
    })();
  }, [userInfo, atKeyword, atOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && typeof l1Open === 'number') {
        await dispatch(getTeamList(companies, appModels.TEAM, l1Keyword,false, ['name']));
      }
    })();
  }, [userInfo, l1Keyword, l1Open]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && typeof l2Open === 'number') {
        await dispatch(getTeamList(companies, appModels.TEAM, l2Keyword, false, ['name']));
      }
    })();
  }, [userInfo, l2Keyword, l2Open]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && typeof l3Open === 'number') {
        await dispatch(getTeamList(companies, appModels.TEAM, l3Keyword, false, ['name']));
      }
    })();
  }, [userInfo, l3Keyword, l3Open]);

  const onEmployeeKeywordChange = (event) => {
    setEmployeeKeyword(event.target.value);
  };

  const onWtKeywordChange = (event) => {
    setWtKeyword(event.target.value);
  };

  const onAtKeywordChange = (event) => {
    setAtKeyword(event.target.value);
  };

  const onL1KeywordChange = (event) => {
    setL1Keyword(event.target.value);
  };

  const onL2KeywordChange = (event) => {
    setL2Keyword(event.target.value);
  };

  const onL3KeywordChange = (event) => {
    setL3Keyword(event.target.value);
  };

  const handleFiles = (files) => {
    setimgValidation(false);
    setimgSize(false);
    if (files) {
      const { type } = files.fileList[0];

      if (!type.includes('image')) {
        setimgValidation(true);
      } else if (!bytesToSize(files.fileList[0].size)) {
        setimgSize(true);
      } else {
        const remfile = `data:${files.fileList[0].type};base64,`;
        setFileDataType(remfile);
        const fileData = files.base64.replace(remfile, '');
        setFileDataImage(fileData);
        setFieldValue('image_medium', fileData);
        setFieldValue('image_small', fileData);
      }
    }
  };
  const onFieldClear = (field) => {
    const newData = partsData;
    newData[index][field] = '';
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  const onAtClear = () => {
    setAtKeyword(null);
    setFieldValue('employee_id', '');
    onFieldClear('employee_id');
    setAtOpen(false);
  };

  const showAtModal = () => {
    setModelValue(appModels.EMPLOYEE);
    setColumns(['id', 'name']);
    setFieldName('employee_id');
    setModalName('Employee List');
    setPlaceholder('Employees');
    setCompanyValue(companies);
    setExtraModal(true);
  };

  const onValidatedByClear = () => {
    setEmployeeKeyword(null);
    setFieldValue('validated_by', '');
    onFieldClear('validated_by');
    setEmployeeOpen(false);
  };

  const showValidatedByModal = () => {
    setModelValue(appModels.USER);
    setColumns(['id', 'name']);
    setFieldName('validated_by');
    setModalName('User List');
    setPlaceholder('Users');
    setCompanyValue(companies);
    setExtraModal(true);
  };

  const onWtClear = () => {
    setWtKeyword(null);
    setFieldValue('resource_calendar_id', '');
    onFieldClear('resource_calendar_id');
    setWtOpen(false);
  };

  const showWtModal = () => {
    setModelValue(appModels.RESOURCECALENDAR);
    setColumns(['id', 'name']);
    setFieldName('resource_calendar_id');
    setModalName('Working Hours List');
    setPlaceholder('Working Hours');
    setCompanyValue(companies);
    setExtraModal(true);
  };
  const onHourKeywordChange = (event) => {
    setWtKeyword(event.target.value);
  };
  const onL1Clear = () => {
    setL1Keyword(null);
    setFieldValue('monitored_by_id', '');
    onFieldClear('monitored_by_id');
    setL1Open(false);
  };

  const showL1Modal = () => {
    setModelValue(appModels.TEAM);
    setColumns(['id', 'name']);
    setFieldName('monitored_by_id');
    setModalName('Teams List');
    setPlaceholder('Teams');
    setCompanyValue(companies);
    setExtraModal(true);
  };

  const onL2Clear = () => {
    setL2Keyword(null);
    setFieldValue('managed_by_id', '');
    onFieldClear('managed_by_id');
    setL2Open(false);
  };

  const showL2Modal = () => {
    setModelValue(appModels.TEAM);
    setColumns(['id', 'name']);
    setFieldName('managed_by_id');
    setModalName('Teams List');
    setPlaceholder('Teams');
    setCompanyValue(companies);
    setExtraModal(true);
  };

  const onL3Clear = () => {
    setL3Keyword(null);
    setFieldValue('maintained_by_id', '');
    onFieldClear('maintained_by_id');
    setL3Open(false);
  };

  const showL3Modal = () => {
    setModelValue(appModels.TEAM);
    setColumns(['id', 'name']);
    setFieldName('maintained_by_id');
    setModalName('Teams List');
    setPlaceholder('Teams');
    setCompanyValue(companies);
    setExtraModal(true);
  };

  let hourOptions = [];
  let employeeOptions = [];
  let employeeListOptions = [];
  let l1Options = [];
  let l2Options = [];
  let l3Options = [];

  if (teamsInfo && teamsInfo.loading) {
    if (l1Open) {
      l1Options = [{ name: 'Loading..' }];
    }
    if (l2Open) {
      l2Options = [{ name: 'Loading..' }];
    }
    if (l3Open) {
      l3Options = [{ name: 'Loading..' }];
    }
  }

  if (hoursInfo && hoursInfo.loading) {
    hourOptions = [{ name: 'Loading..' }];
  }
  if (hoursInfo && hoursInfo.data) {
    hourOptions = hoursInfo.data;
  }

  if (employeesInfo && employeesInfo.loading) {
    employeeOptions = [{ name: 'Loading..' }];
  }
  if (employeesInfo && employeesInfo.data) {
    employeeOptions = employeesInfo.data;
  }

  if (employeeListInfo && employeeListInfo.loading) {
    employeeListOptions = [{ name: 'Loading..' }];
  }
  if (employeeListInfo && employeeListInfo.data) {
    employeeListOptions = employeeListInfo.data;
  }

  if (teamsInfo && teamsInfo.data) {
    if (l1Open === index) {
      l1Options = teamsInfo.data;
    }
    if (l2Open === index) {
      l2Options = teamsInfo.data;
    }
    if (l3Open === index) {
      l3Options = teamsInfo.data;
    }
  }
  if (operating_hours && operating_hours.length && operating_hours.length > 0) {
    const oldMaintenanceTeam = [{ id: operating_hours[0], name: operating_hours[1] }];
    const newArr = [...hourOptions, ...oldMaintenanceTeam];
    hourOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  const oldHourId = operating_hours && operating_hours.length && operating_hours.length > 0 ? operating_hours[1] : '';

  const handleDateChange = (date) => {
    setDateChange(date);
    setFieldValue('validated_on', date);
  };

  const onDropdownChange = (e, indexV, field, name) => {
    const newData = partsData;
    newData[indexV][field] = { id: e.id, name: name ? e[name] : e.name };
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  const onDateChange = (e, indexV, field, name) => {
    const newData = partsData;
    newData[indexV][field] = e;
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  const onTextFieldChange = (e, indexV, field) => {
    const newData = partsData;
    newData[indexV][field] = DOMPurify.sanitize(e.target.value);
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  return (
    <>
      <Box
        sx={{
          width: '100%',
          marginTop: '20px',
        }}
      >
        <Typography
          sx={AddThemeColor({
            font: 'normal normal medium 20px/24px Suisse Intl',
            letterSpacing: '0.7px',
            fontWeight: 500,
            marginBottom: '20px',
          })}
        >
          Maintenance Info
        </Typography>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '3%',
            flexWrap: 'wrap',
          }}
        >
          <Autocomplete
            sx={{
              width: '30%',
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            name={maintainedById.name}
            label={maintainedById.label}
            className="bg-white"
            open={l3Open === index}
            value={formData.maintained_by_id && formData.maintained_by_id.name ? formData.maintained_by_id.name : ''}
            size="small"
            onOpen={() => {
              setL3Open(index);
              setL3Keyword('');
            }}
            onClose={() => {
              setL3Open(false);
              setL3Keyword('');
            }}
            onChange={(e, data) => { onDropdownChange(data, index, 'maintained_by_id', 'name'); }}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={l3Options}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onL3KeywordChange}
                variant="standard"
                InputLabelProps={{ shrink: true }}
                label={(
                  <>
                    {maintainedById.label}
                    {infoValue('maintained_by_id')}
                  </>
                )}
                value={l3Keyword}
                className={((maintained_by_id && maintained_by_id.id) || (l3Keyword && l3Keyword.length > 0))
                  ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {teamsInfo && teamsInfo.loading && l3Open === index ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {((maintained_by_id && maintained_by_id.id) || (l3Keyword && l3Keyword.length > 0)) && (
                        <IconButton
                           aria-label="toggle password visibility"
                           onClick={onL3Clear}
                         >
                           <IoCloseOutline size={22} fontSize="small" />
                         </IconButton>
                        )}
                        <IconButton
                          aria-label="toggle search visibility"
                          onClick={showL3Modal}
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
          <Autocomplete
            sx={{
              width: '30%',
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            name={managedById.name}
            label={managedById.label}
            className="bg-white"
            open={l2Open === index}
            value={formData.managed_by_id && formData.managed_by_id.name ? formData.managed_by_id.name : ''}
            size="small"
            onOpen={() => {
              setL2Open(index);
              setL2Keyword('');
            }}
            onClose={() => {
              setL2Open(false);
              setL2Keyword('');
            }}
            onChange={(e, data) => { onDropdownChange(data, index, 'managed_by_id', 'name'); }}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={l2Options}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onL2KeywordChange}
                variant="standard"
                InputLabelProps={{ shrink: true }}
                label={(
                  <>
                    {managedById.label}
                    {infoValue('managed_by_id')}
                  </>
                )}
                value={l2Keyword}
                className={((managed_by_id && managed_by_id.id) || (l2Keyword && l2Keyword.length > 0))
                  ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {teamsInfo && teamsInfo.loading && l2Open === index ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {((managed_by_id && managed_by_id.id) || (l2Keyword && l2Keyword.length > 0)) && (
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={onL2Clear}
                          >
                            <IoCloseOutline size={22} fontSize="small" />
                          </IconButton>
                        )}
                        <IconButton
                          aria-label="toggle search visibility"
                          onClick={showL2Modal}
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
          <Autocomplete
            sx={{
              width: '30%',
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            name={monitoredById.name}
            label={monitoredById.label}
            className="bg-white"
            open={l1Open === index}
            value={formData.monitored_by_id && formData.monitored_by_id.name ? formData.monitored_by_id.name : ''}
            size="small"
            onOpen={() => {
              setL1Open(index);
              setL1Keyword('');
            }}
            onClose={() => {
              setL1Open(false);
              setL1Keyword('');
            }}
            onChange={(e, data) => { onDropdownChange(data, index, 'monitored_by_id', 'name'); }}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={l1Options}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onL1KeywordChange}
                variant="standard"
                InputLabelProps={{ shrink: true }}
                label={(
                  <>
                    {monitoredById.label}
                    {infoValue('monitored_by_id')}
                  </>
                )}
                value={l1Keyword}
                className={((monitored_by_id && monitored_by_id.id) || (l1Keyword && l1Keyword.length > 0))
                  ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {teamsInfo && teamsInfo.loading && l1Open === index ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {((monitored_by_id && monitored_by_id.id) || (l1Keyword && l1Keyword.length > 0)) && (
                        <IconButton
                         aria-label="toggle password visibility"
                         onClick={onL1Clear}
                       >
                         <IoCloseOutline size={22} fontSize="small" />
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
          <TextField
            className="bg-white"
            variant="standard"
            onChange={(e) => onTextFieldChange(e, index, Brand.name)}
            value={formData[Brand.name]}
            InputLabelProps={{ shrink: true }}
            sx={{
              width: '30%',
              marginBottom: '20px',
            }}
            type="text"
            name={Brand.name}
            label={(
              <>
                {Brand.label}
                {infoValue('brand')}
              </>
            )}
          />
          <Autocomplete
            sx={{
              width: '30%',
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            name={resourceCalendarId.name}
            label={resourceCalendarId.label}
            className="bg-white"
            open={wtOpen === index}
            value={formData.resource_calendar_id && formData.resource_calendar_id.name ? formData.resource_calendar_id.name : ''}
            size="small"
            onOpen={() => {
              setWtOpen(index);
              setWtKeyword('');
            }}
            onClose={() => {
              setWtOpen(false);
              setWtKeyword('');
            }}
            loading={hoursInfo && hoursInfo.loading}
            onChange={(e, data) => { onDropdownChange(data, index, 'resource_calendar_id', 'name'); }}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={hourOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onWtKeywordChange}
                variant="standard"
                InputLabelProps={{ shrink: true }}
                label={(
                  <>
                    {resourceCalendarId.label}
                    {infoValue('resource_calendar_id')}
                  </>
                )}
                value={wtKeyword}
                className={((resource_calendar_id && resource_calendar_id.id) || (wtKeyword && wtKeyword.length > 0))
                  ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {hoursInfo && hoursInfo.loading && wtOpen === index ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {((resource_calendar_id && resource_calendar_id.id) || (wtKeyword && wtKeyword.length > 0)) && (
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={onWtClear}
                          >
                            <IoCloseOutline size={22} fontSize="small" />
                          </IconButton>
                        )}
                        <IconButton
                          aria-label="toggle search visibility"
                          onClick={showWtModal}
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
          <TextField
            className="bg-white"
            variant="standard"
            onChange={(e) => onTextFieldChange(e, index, ravValue.name)}
            value={formData[ravValue.name]}
            sx={{
              width: '30%',
              marginBottom: '20px',
            }}
            name={ravValue.name}
            label={(
              <>
                {ravValue.label}
                {infoValue('rav')}
              </>
            )}
            setFieldValue={setFieldValue}
            inputProps={{ maxLength: 10 }}
            onKeyPress={decimalKeyPressDown}
          />
        </Box>
      </Box>
      <Box
        sx={{
          width: '100%',
          marginTop: '20px',
        }}
      >
        <Typography
          sx={AddThemeColor({
            font: 'normal normal medium 20px/24px Suisse Intl',
            letterSpacing: '0.7px',
            fontWeight: 500,
            marginBottom: '20px',
          })}
        >
          Validation Info
        </Typography>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '3%',
            flexWrap: 'wrap',
          }}
        >
          <Autocomplete
            sx={{
              width: '30%',
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            name={validationStatus.name}
            label={validationStatus.label}
            className="bg-white"
            open={vsOpen === index}
            size="small"
            onOpen={() => {
              setVSOpen(index);
            }}
            onClose={() => {
              setVSOpen(false);
            }}
            getOptionSelected={(option, value) => option.label === value.label}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
            options={assetActionData.validationTypes}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label={(
                  <>
                    {validationStatus.label}
                    {infoValue('validation_status')}
                  </>
                )}
                InputLabelProps={{ shrink: true }}
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
          {!isITAsset && (
            <Autocomplete
              sx={{
                width: '30%',
                marginTop: 'auto',
                marginBottom: '20px',
              }}
              name={tagStatus.name}
              label={tagStatus.label}
              className="bg-white"
              open={tagOpen === index}
              size="small"
              onOpen={() => {
                setTagOpen(index);
              }}
              onClose={() => {
                setTagOpen(false);
              }}
              getOptionSelected={(option, value) => option.label === value.label}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
              options={assetActionData.tagStatsus}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  InputLabelProps={{ shrink: true }}
                  label={(
                    <>
                      {tagStatus.label}
                      {infoValue('tag_status')}
                    </>
                  )}
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
          )}
          <Autocomplete
            sx={{
              width: '30%',
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            name={validatedBy.name}
            label={validatedBy.label}
            className="bg-white"
            open={employeeShow === index}
            value={formData.validated_by && formData.validated_by.name ? formData.validated_by.name : ''}
            size="small"
            onOpen={() => {
              setEmployeeOpen(index);
              setEmployeeKeyword('');
            }}
            onClose={() => {
              setEmployeeOpen(false);
              setEmployeeKeyword('');
            }}
            loading={employeesInfo && employeesInfo.loading}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={employeeOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onEmployeeKeywordChange}
                variant="standard"
                InputLabelProps={{ shrink: true }}
                label={(
                  <>
                    {validatedBy.label}
                    {infoValue('validated_by')}
                  </>
                )}
                value={employeeKeyword}
                className={((validated_by && validated_by.id) || (employeeKeyword && employeeKeyword.length > 0))
                  ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {employeesInfo && employeesInfo.loading && employeeShow === index ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {((validated_by && validated_by.id) || (employeeKeyword && employeeKeyword.length > 0)) && (
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={onValidatedByClear}
                          >
                            <IoCloseOutline size={22} fontSize="small" />
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
          {/* <FormControl
            sx={{
              width: '30%',
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            variant="standard"
          >
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DateTimePicker
                name={validatedOn.name}
                label={validatedOn.label}
                value={selectedDate}
                onChange={handleDateChange}
                defaultValue={validated_on ? new Date(getDateTimeSeconds(validated_on)) : null}
                ampm={false}
                format="dd/MM/yyyy HH:mm:ss"
              />
            </MuiPickersUtilsProvider>
          </FormControl> */}
          <MuiDateTimeField
            sx={{
              width: '30%',
              marginTop: 'auto',
              marginBottom: '10px',
            }}
            name={validatedOn.name}
            label={validatedOn.label}
            className="ml-1 bg-white w-100"
            value={(formData[validatedOn.name])}
            onChange={(e) => onDateChange(e, index, validatedOn.name)}
          />
        </Box>
      </Box>
      <Box
        sx={{
          width: '100%',
          marginTop: '20px',
        }}
      >
        <Typography
          sx={AddThemeColor({
            font: 'normal normal medium 20px/24px Suisse Intl',
            letterSpacing: '0.7px',
            fontWeight: 500,
          })}
        >
          Other Info
        </Typography>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '3%',
            flexWrap: 'wrap',
          }}
        >
          <TextField
            className="bg-white"
            variant="standard"
            onChange={(e) => onTextFieldChange(e, index, latitude.name)}
            value={formData[latitude.name]}
            InputLabelProps={{ shrink: true }}
            sx={{
              width: '30%',
              marginBottom: '20px',
            }}
            name={latitude.name}
            label={(
              <>
                {latitude.label}
                {infoValue('latitude')}
              </>
            )}
            setFieldValue={setFieldValue}
            type="number"
          />
          <TextField
            className="bg-white"
            variant="standard"
            onChange={(e) => onTextFieldChange(e, index, longitude.name)}
            value={formData[longitude.name]}
            InputLabelProps={{ shrink: true }}
            sx={{
              width: '30%',
              marginBottom: '20px',
            }}
            name={longitude.name}
            label={(
              <>
                {longitude.label}
                {infoValue('longitude')}
              </>
            )}
            setFieldValue={setFieldValue}
            type="text"
          />
          <Autocomplete
            sx={{
              width: '30%',
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            name={operatingHours.name}
            label={operatingHours.label}
            className="bg-white"
            oldValue={oldHourId === index}
            value={formData.operating_hours && formData.operating_hours.name ? formData.operating_hours.name : formData.oldHourId}
            open={hoursOpen === index}
            size="small"
            onOpen={() => {
              setHoursOpen(index);
              setWtKeyword('');
            }}
            onClose={() => {
              setHoursOpen(false);
              setWtKeyword('');
            }}
            loading={hoursInfo && hoursInfo.loading}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={hourOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onHourKeywordChange}
                variant="standard"
                InputLabelProps={{ shrink: true }}
                label={(
                  <>
                    {operatingHours.label}
                    {infoValue('operating_hours')}
                  </>
                )}
                className="without-padding"
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {hoursInfo && hoursInfo.loading && hoursOpen === index ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
          <TextField
            className="bg-white"
            variant="standard"
            onChange={(e) => onTextFieldChange(e, index, xPos.name)}
            value={formData[xPos.name]}
            InputLabelProps={{ shrink: true }}
            sx={{
              width: '30%',
              marginBottom: '20px',
            }}
            name={xPos.name}
            label={(
              <>
                {xPos.label}
                {infoValue('xpos')}
              </>
            )}
            setFieldValue={setFieldValue}
            onKeyPress={decimalKeyPressDown}
            inputProps={{ maxLength: 10 }}
          />
          <TextField
            className="bg-white"
            variant="standard"
            onChange={(e) => onTextFieldChange(e, index, yPos.name)}
            InputLabelProps={{ shrink: true }}
            value={formData[yPos.name]}
            sx={{
              width: '30%',
              marginBottom: '20px',
            }}
            name={yPos.name}
            label={(
              <>
                {yPos.label}
                {infoValue('ypos')}
              </>
            )}
            setFieldValue={setFieldValue}
            onKeyPress={decimalKeyPressDown}
            inputProps={{ maxLength: 10 }}
          />
          <MuiDatePicker
            sx={{
              width: '30%',
              marginBottom: '20px',
            }}
            label={(
              <>
                {lastServiceDone.label}
                {infoValue('last_service_done')}
              </>
            )}
            value={(formData[lastServiceDone.name])}
            onChange={(e) => onDateChange(e, index, lastServiceDone.name)}
          />
          <TextField
            className="bg-white"
            variant="standard"
            onChange={(e) => onTextFieldChange(e, index, make.name)}
            InputLabelProps={{ shrink: true }}
            value={formData[make.name]}
            sx={{
              width: '30%',
              marginBottom: '20px',
            }}
            name={make.name}
            label={(
              <>
                {make.label}
                {infoValue('make')}
              </>
            )}
            setFieldValue={setFieldValue}
            type="text"
          />
          <MuiDatePicker
            sx={{
              width: '30%',
              marginBottom: '20px',
            }}
            label={(
              <>
                {refillingDueDate.label}
                {infoValue('refilling_due_date')}
              </>
            )}
            value={(formData[refillingDueDate.name])}
            onChange={(e) => onDateChange(e, index, refillingDueDate.name)}
          />

          <Autocomplete
            sx={{
              width: '30%',
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            name={employeeId.name}
            label={employeeId.label}
            className="bg-white"
            open={atOpen === index}
            value={formData.employee_id && formData.employee_id.name ? formData.employee_id.name : ''}
            size="small"
            onOpen={() => {
              setAtOpen(index);
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
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onAtKeywordChange}
                variant="standard"
                InputLabelProps={{ shrink: true }}
                label={(
                  <>
                    {employeeId.label}
                    {infoValue('employee_id')}
                  </>
                )}
                value={atKeyword}
                className={((employee_id && employee_id.id) || (atKeyword && atKeyword.length > 0))
                  ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {employeeListInfo && employeeListInfo.loading && atOpen === index ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {((employee_id && employee_id.id) || (atKeyword && atKeyword.length > 0)) && (
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={onAtClear}
                          >
                            <IoCloseOutline size={22} fontSize="small" />
                          </IconButton>
                        )}
                        <IconButton
                          aria-label="toggle search visibility"
                          onClick={showAtModal}
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
          <Box
            sx={{
              width: '100%',
              marginTop: '20px',
            }}
          >
            {/* <Typography
          sx={AddThemeColor({
            font: 'normal normal medium 20px/24px Suisse Intl',
            letterSpacing: '0.7px',
            fontWeight: 500,
            marginBottom: '20px',
          })}
        >
          Attachments
        </Typography> */}
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '3%',
                flexWrap: 'wrap',
              }}
            >
              <Box
                sx={{
                  width: '50%',
                }}
              >
                <UploadDocuments
                  saveData={addAssetInfo}
                  limit="1"
                  model={appModels.EQUIPMENT}
                  uploadFileType="images"
                  formData={formData}
                  setPartsAdd={setPartsAdd}
                  setPartsData={setPartsData}
                  partsData={partsData}
                  indexParent={index}
                  fileImage={(formData.image_medium)}
                />
              </Box>
              <TextField
                className="bg-white"
                variant="standard"
                onChange={(e) => onTextFieldChange(e, index, comment.name)}
                value={formData[comment.name]}
                InputLabelProps={{ shrink: true }}
                sx={{
                  width: '42%',
                  marginTop: '109px',
                  marginLeft: '15px',
                }}
                type="text"
                name={comment.name}
                label={(
                  <>
                    {comment.label}
                    {infoValue('comment')}
                  </>
            )}
                setFieldValue={setFieldValue}
              />
              {/* {!fileDataImage && (
          <ReactFileReader
            elementId="fileUpload"
            handleFiles={handleFiles}
            fileTypes="image/*"
            base64
          >
            <div className="float-right cursor-pointer">
              <img src={uploadIcon} className="mr-1" alt="issuecategory" height="20" />
              <span className="text-lightblue font-tiny cursor-pointer"> Upload</span>
            </div>
          </ReactFileReader>
          )} */}
              {/* {fileDataImage && (
          <div className="position-relative">
            <img
              src={`${fileDataType}${fileDataImage}`}
              height="150"
              width="150"
              className="ml-3"
              alt="uploaded"
            />
            <div className="position-absolute topright-img-close">
              <img
                aria-hidden="true"
                src={closeCircleIcon}
                className="cursor-pointer"
                onClick={() => {
                  setimgValidation(false);
                  setimgSize(false);
                  setFileDataImage(false);
                  setFileDataType(false);
                  setFieldValue('image_medium', false);
                  setFieldValue('image_small', false);
                }}
                alt="remove"
              />
            </div>
          </div>
          )} */}
            </Box>
          </Box>
          <Box
            sx={{
              marginBottom: '20px',
              marginTop: '20px',
              width: '50%',
            }}
          >
            <label style={{ display: 'block' }} htmlFor="textarea">
              {equipmentNumber.label}
              {infoValue('equipment_number')}
            </label>
            <TextareaAutosize
              style={{
                width: '-webkit-fill-available',
                borderRadius: '3px',
                borderColor: 'rgba(0, 0, 0, 0.23)',
              }}
              name={equipmentNumber.name}
              label={(
                <>
                  {equipmentNumber.label}
                  {infoValue('equipment_number')}
                </>
            )}
              variant="standard"
              multiline
              minRows={4}
              onChange={(e) => onTextFieldChange(e, index, equipmentNumber.name)}
            />
          </Box>
        </Box>
      </Box>
      {/* <Modal size="xl" className="border-radius-50px modal-dialog-centered searchData-modalwindow" isOpen={extraModal}>
        <ModalHeaderComponent title={modalName} imagePath={false} closeModalWindow={() => { setExtraModal(false); }} />
        <ModalBody className="mt-0 pt-0">
          <AdvancedSearchModal
            modelName={modelValue}
            afterReset={() => { setExtraModal(false); }}
            fieldName={fieldName}
            fields={columns}
            company={companyValue}
            placeholderName={placeholderName}
            setFieldValue={setFieldValue}
          />
        </ModalBody>
      </Modal> */}
      <Dialog maxWidth="lg" open={extraModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraModal(false); }} sx={{ width: '1000px' }} />
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
              setPartsData={setPartsData}
              partsData={partsData}
              index={index}
              setPartsAdd={setPartsAdd}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
};

AssetAdditionalForm.defaultProps = {
  isITAsset: false,
};

AssetAdditionalForm.propTypes = {
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  setFieldTouched: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  isITAsset: PropTypes.bool,
};

export default AssetAdditionalForm;
