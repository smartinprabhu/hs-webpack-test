/* eslint-disable camelcase */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
  CircularProgress,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Checkbox from '@mui/material/Checkbox';
import {
  Typography, TextField,
  Dialog, DialogContent, DialogContentText, Box,
  ListItemText,
} from '@mui/material';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import { IoCloseOutline } from 'react-icons/io5';
import SearchIcon from '@material-ui/icons/Search';
import { useFormikContext } from 'formik';

// import { DateTimePicker } from '@material-ui/pickers';
// import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
// import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import UploadDocuments from '../../commonComponents/uploadDocuments';
import MuiAutoComplete from '../../commonComponents/formFields/muiAutocomplete';
import MuiTextField from '../../commonComponents/formFields/muiTextField';
import MuiDateTimeField from '../../commonComponents/formFields/muiDateTimeField';
import MuiDatePicker from '../../commonComponents/formFields/muiDatePicker';

import DialogHeader from '../../commonComponents/dialogHeader';

import {
  decimalKeyPressDown, getAllowedCompanies, getDateTimeSeconds,
  generateErrorMessage,
} from '../../util/appUtils';
import {
  getOperatingHours, getEmployeeList, getEmployeeDataList, getTeamList,
} from '../equipmentService';
import { bytesToSize } from '../../util/staticFunctions';
import assetActionData from '../data/assetsActions.json';
import AdvancedSearchModal from './advancedSearchModal';
import { AddThemeColor } from '../../themes/theme';
import { getEquipmentList } from '../../helpdesk/ticketService';

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

const AssetAdditionalForm = (props) => {
  const dispatch = useDispatch();
  const classes = useStyles();
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

  const [parentOpen, setParentOpen] = useState(false);
  const [parentKeyword, setParentKeyword] = useState('');

  const {
    equipmentInfo,
  } = useSelector((state) => state.ticket);

  const {
    isITAsset,
    setFieldValue,
    validateField,
    setFieldTouched,
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
      Brand,
      parentId,
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
    parent_id,
  } = formValues;

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const {
    hoursInfo, employeesInfo, employeeListInfo, teamsInfo, addAssetInfo,
  } = useSelector((state) => state.equipment);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && wtOpen) {
        await dispatch(getOperatingHours(companies, appModels.RESOURCECALENDAR, wtKeyword));
      }
    })();
  }, [userInfo, wtKeyword, wtOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && parentOpen) {
        await dispatch(getEquipmentList(companies, appModels.EQUIPMENT, parentKeyword, !!isITAsset, false, false, false, false, false, 'parent'));
      }
    })();
  }, [userInfo, parentKeyword, parentOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && hoursOpen) {
        await dispatch(getOperatingHours(companies, appModels.RESOURCECALENDAR, wtKeyword));
      }
    })();
  }, [userInfo, wtKeyword, hoursOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && employeeShow) {
        await dispatch(getEmployeeList(companies, appModels.USER, employeeKeyword));
      }
    })();
  }, [userInfo, employeeKeyword, employeeShow]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && atOpen) {
        await dispatch(getEmployeeDataList(companies, appModels.EMPLOYEE, atKeyword));
      }
    })();
  }, [userInfo, atKeyword, atOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && l1Open) {
        await dispatch(getTeamList(companies, appModels.TEAM, l1Keyword));
      }
    })();
  }, [userInfo, l1Keyword, l1Open]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && l2Open) {
        await dispatch(getTeamList(companies, appModels.TEAM, l2Keyword));
      }
    })();
  }, [userInfo, l2Keyword, l2Open]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && l3Open) {
        await dispatch(getTeamList(companies, appModels.TEAM, l3Keyword));
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

  const onAtClear = () => {
    setAtKeyword(null);
    setFieldValue('employee_id', '');
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
    setWtOpen(false);
  };

  const onParentKeywordChange = (event) => {
    setParentKeyword(event.target.value);
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
    if (l1Open) {
      l1Options = teamsInfo.data;
    }
    if (l2Open) {
      l2Options = teamsInfo.data;
    }
    if (l3Open) {
      l3Options = teamsInfo.data;
    }
  }
  if (operating_hours && operating_hours.length && operating_hours.length > 0) {
    const oldMaintenanceTeam = [{ id: operating_hours[0], name: operating_hours[1] }];
    const newArr = [...hourOptions, ...oldMaintenanceTeam];
    hourOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  const oldHourId = operating_hours && operating_hours.length && operating_hours.length > 0 ? operating_hours[1] : '';

  let parentOptions = [];

  if (equipmentInfo && equipmentInfo.loading) {
    parentOptions = [{ name: 'Loading..' }];
  }
  if (equipmentInfo && equipmentInfo.data) {
    const arr = [...parentOptions, ...equipmentInfo.data];
    parentOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }

  const handleDateChange = (date) => {
    setDateChange(date);
    setFieldValue('validated_on', date);
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
          Maintenance
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
          <MuiTextField
            sx={{
              width: '22%',
              marginBottom: '20px',
            }}
            name={model.name}
            label={model.label}
            setFieldValue={setFieldValue}
          />
          <MuiTextField
            sx={{
              width: '22%',
              marginBottom: '20px',
            }}
            type="text"
            name={Brand.name}
            label={Brand.label}
            setFieldValue={setFieldValue}
          />
          <MuiTextField
            sx={{
              width: '22%',
              marginBottom: '20px',
            }}
            type="text"
            name={serial.name}
            label={serial.label}
            setFieldValue={setFieldValue}
          />
          <MuiAutoComplete
            sx={{
              width: '22%',
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            name={criticality.name}
            label={criticality.label}
            formGroupClassName="m-1"
            open={open}
            size="small"
            onOpen={() => {
              setOpen(true);
            }}
            onClose={() => {
              setOpen(false);
            }}
            getOptionSelected={(option, value) => option.label === value.label}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
            options={assetActionData.criticalities}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label={criticality.label}
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
          {/* <MuiTextField
            sx={{
              width: '30%',
              marginBottom: '20px',
            }}
            type="date"
            name={startDate.name}
            label={startDate.label}
            setFieldValue={setFieldValue}
          /> */}
          <MuiDatePicker
            sx={{
              width: '30%',
              marginBottom: '20px',
            }}
            name={startDate.name}
            label={startDate.label}
            validateField={validateField}
            setFieldTouched={setFieldTouched}
            setFieldValue={setFieldValue}
          />
          <MuiAutoComplete
            sx={{
              width: '30%',
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            name={resourceCalendarId.name}
            label={resourceCalendarId.label}
            formGroupClassName="m-1"
            open={wtOpen}
            value={resource_calendar_id && resource_calendar_id.name ? resource_calendar_id.name : ''}
            size="small"
            onOpen={() => {
              setWtOpen(true);
              setWtKeyword('');
            }}
            onClose={() => {
              setWtOpen(false);
              setWtKeyword('');
            }}
            loading={hoursInfo && hoursInfo.loading}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={hourOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onWtKeywordChange}
                variant="standard"
                label={resourceCalendarId.label}
                value={wtKeyword}
                className={((resource_calendar_id && resource_calendar_id.id) || (wtKeyword && wtKeyword.length > 0))
                  ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {hoursInfo && hoursInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
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
          <MuiAutoComplete
            sx={{
              width: '30%',
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            name={monitoredById.name}
            label={monitoredById.label}
            formGroupClassName="m-1"
            open={l1Open}
            value={monitored_by_id && monitored_by_id.name ? monitored_by_id.name : ''}
            size="small"
            onOpen={() => {
              setL1Open(true);
              setL1Keyword('');
            }}
            onClose={() => {
              setL1Open(false);
              setL1Keyword('');
            }}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={l1Options}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onL1KeywordChange}
                variant="standard"
                label={monitoredById.label}
                value={l1Keyword}
                className={((monitored_by_id && monitored_by_id.id) || (l1Keyword && l1Keyword.length > 0))
                  ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {teamsInfo && teamsInfo.loading && l1Open ? <CircularProgress color="inherit" size={20} /> : null}
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
          <MuiAutoComplete
            sx={{
              width: '30%',
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            name={managedById.name}
            label={managedById.label}
            formGroupClassName="m-1"
            open={l2Open}
            value={managed_by_id && managed_by_id.name ? managed_by_id.name : ''}
            size="small"
            onOpen={() => {
              setL2Open(true);
              setL2Keyword('');
            }}
            onClose={() => {
              setL2Open(false);
              setL2Keyword('');
            }}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={l2Options}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onL2KeywordChange}
                variant="standard"
                label={managedById.label}
                value={l2Keyword}
                className={((managed_by_id && managed_by_id.id) || (l2Keyword && l2Keyword.length > 0))
                  ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {teamsInfo && teamsInfo.loading && l2Open ? <CircularProgress color="inherit" size={20} /> : null}
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
          <MuiAutoComplete
            sx={{
              width: '30%',
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            name={maintainedById.name}
            label={maintainedById.label}
            formGroupClassName="m-1"
            open={l3Open}
            value={maintained_by_id && maintained_by_id.name ? maintained_by_id.name : ''}
            size="small"
            onOpen={() => {
              setL3Open(true);
              setL3Keyword('');
            }}
            onClose={() => {
              setL3Open(false);
              setL3Keyword('');
            }}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={l3Options}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onL3KeywordChange}
                variant="standard"
                label={maintainedById.label}
                value={l3Keyword}
                className={((maintained_by_id && maintained_by_id.id) || (l3Keyword && l3Keyword.length > 0))
                  ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {teamsInfo && teamsInfo.loading && l3Open ? <CircularProgress color="inherit" size={20} /> : null}
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
          <MuiTextField
            sx={{
              width: '30%',
              marginBottom: '20px',
            }}
            name={ravValue.name}
            label={ravValue.label}
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
          Validation
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
          <MuiAutoComplete
            sx={{
              width: '30%',
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            name={validationStatus.name}
            label={validationStatus.label}
            formGroupClassName="m-1"
            open={vsOpen}
            size="small"
            onOpen={() => {
              setVSOpen(true);
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
                label={validationStatus.label}
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
            <MuiAutoComplete
              sx={{
                width: '30%',
                marginTop: 'auto',
                marginBottom: '20px',
              }}
              name={tagStatus.name}
              label={tagStatus.label}
              formGroupClassName="m-1"
              open={tagOpen}
              size="small"
              onOpen={() => {
                setTagOpen(true);
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
                  label={tagStatus.label}
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
          <MuiAutoComplete
            sx={{
              width: '30%',
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            name={validatedBy.name}
            label={validatedBy.label}
            formGroupClassName="m-1"
            open={employeeShow}
            value={validated_by && validated_by.name ? validated_by.name : ''}
            size="small"
            onOpen={() => {
              setEmployeeOpen(true);
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
                label={validatedBy.label}
                value={employeeKeyword}
                className={((validated_by && validated_by.id) || (employeeKeyword && employeeKeyword.length > 0))
                  ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {employeesInfo && employeesInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
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
            slotProps={{
              actionBar: {
                actions: ['clear', 'accept'],
              },
              textField: { variant: 'standard', error: false },
            }}
            name={validatedOn.name}
            label={validatedOn.label}
            setFieldValue={setFieldValue}
            setFieldTouched={setFieldTouched}
            placeholder={validatedOn.label}
            className="ml-1 w-100"
            defaultValue={validated_on ? new Date(getDateTimeSeconds(validated_on)) : null}
          />
          {isITAsset && (
            <>
              <span className="font-weight-600 text-black d-inline-block mt-1 mb-1">Tag Status </span>
              <br />
              <Checkbox
                name={qrTag.name}
                label={qrTag.label}
                inputProps={{ 'aria-label': 'controlled' }}
              />
              <span className="font-weight-600 text-black d-inline-block mt-1 mb-1 invisible">Tag Status </span>
              <br />
              <Checkbox
                name={nfcTag.name}
                label={nfcTag.label}
                inputProps={{ 'aria-label': 'controlled' }}
              />
              <span className="font-weight-600 text-black d-inline-block mt-1 mb-1 invisible">Tag Status </span>
              <br />
              <Checkbox
                name={rfidTag.name}
                label={rfidTag.label}
                inputProps={{ 'aria-label': 'controlled' }}
              />
              <span className="font-weight-600 text-black d-inline-block mt-1 mb-1 invisible">Tag Status </span>
              <br />
              <Checkbox
                name={virutualTag.name}
                label={virutualTag.label}
                inputProps={{ 'aria-label': 'controlled' }}
              />
            </>
          )}
        </Box>
      </Box>
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
              setFieldValue={setFieldValue}
              model={appModels.EQUIPMENT}
              setFieldValue={setFieldValue}
              uploadFileType="images"
            />
          </Box>
          <MuiTextField
            sx={{
              width: '30%',
              marginTop: '109px',
              marginLeft: '15px',
            }}
            type="text"
            name={comment.name}
            label={comment.label}
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
          <MuiTextField
            sx={{
              width: '30%',
              marginBottom: '20px',
            }}
            name={latitude.name}
            label={latitude.label}
            setFieldValue={setFieldValue}
            type="number"
          />
          <MuiTextField
            sx={{
              width: '30%',
              marginBottom: '20px',
            }}
            name={longitude.name}
            label={longitude.label}
            setFieldValue={setFieldValue}
            type="text"
          />
          <MuiAutoComplete
            sx={{
              width: '30%',
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            name={operatingHours.name}
            label={operatingHours.label}
            formGroupClassName="m-1"
            oldValue={oldHourId}
            value={operating_hours && operating_hours.name ? operating_hours.name : oldHourId}
            open={hoursOpen}
            size="small"
            onOpen={() => {
              setHoursOpen(true);
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
                label={operatingHours.label}
                className="without-padding"
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {hoursInfo && hoursInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
          <MuiAutoComplete
            sx={{
              width: '30%',
              marginBottom: '20px',
            }}
            name={parentId.name}
            label={parentId.label}
            value={parent_id && parent_id.name ? parent_id.name : ''}
            open={parentOpen}
            size="small"
            onOpen={() => {
              setParentOpen(true);
              setParentKeyword('');
            }}
            onClose={() => {
              setParentOpen(false);
              setParentKeyword('');
            }}
            classes={{
              option: classes.option,
            }}
            loading={equipmentInfo && equipmentInfo.loading}
            apiError={(equipmentInfo && equipmentInfo.err) ? generateErrorMessage(equipmentInfo) : false}
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
                    {option.location_id && (
                    <Box>
                      <Typography
                        sx={{
                          font: 'Suisse Intl',
                          fontSize: '12px',
                        }}
                      >
                        {option.location_id[1]}
                      </Typography>
                    </Box>
                    )}

                  </>
                                                  )}
              />
            )}
            options={parentOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onParentKeywordChange}
                label={parentId.label}
                variant="standard"
                className="without-padding"
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {equipmentInfo && equipmentInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
          <MuiTextField
            sx={{
              width: '30%',
              marginBottom: '20px',
            }}
            name={xPos.name}
            label={xPos.label}
            setFieldValue={setFieldValue}
            onKeyPress={decimalKeyPressDown}
            inputProps={{ maxLength: 10 }}
          />
          <MuiTextField
            sx={{
              width: '30%',
              marginBottom: '20px',
            }}
            name={yPos.name}
            label={yPos.label}
            setFieldValue={setFieldValue}
            onKeyPress={decimalKeyPressDown}
            inputProps={{ maxLength: 10 }}
          />
          {/* <MuiTextField
            sx={{
              width: '30%',
              marginBottom: '20px',
            }}
            name={lastServiceDone.name}
            label={lastServiceDone.label}
            setFieldValue={setFieldValue}
            type="date"
          /> */}
          <MuiDatePicker
            sx={{
              width: '30%',
              marginBottom: '20px',
            }}
            name={lastServiceDone.name}
            label={lastServiceDone.label}
            setFieldValue={setFieldValue}
            validateField={validateField}
            setFieldTouched={setFieldTouched}
          />
          <MuiTextField
            sx={{
              width: '30%',
              marginBottom: '20px',
            }}
            name={make.name}
            label={make.label}
            setFieldValue={setFieldValue}
            type="text"
          />
          {/* <MuiTextField
            sx={{
              width: '30%',
              marginBottom: '20px',
            }}
            name={refillingDueDate.name}
            label={refillingDueDate.label}
            setFieldValue={setFieldValue}
            type="date"
          /> */}
          <MuiDatePicker
            sx={{
              width: '30%',
              marginBottom: '20px',
            }}
            name={refillingDueDate.name}
            label={refillingDueDate.label}
            setFieldValue={setFieldValue}
            validateField={validateField}
            setFieldTouched={setFieldTouched}
          />
          <MuiTextField
            sx={{
              width: '30%',
              marginBottom: '20px',
            }}
            name={capacity.name}
            label={capacity.label}
            setFieldValue={setFieldValue}
            type="text"
          />
          <MuiAutoComplete
            sx={{
              width: '30%',
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            name={employeeId.name}
            label={employeeId.label}
            formGroupClassName="m-1"
            open={atOpen}
            value={employee_id && employee_id.name ? employee_id.name : ''}
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
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onAtKeywordChange}
                variant="standard"
                label={employeeId.label}
                value={atKeyword}
                className={((employee_id && employee_id.id) || (atKeyword && atKeyword.length > 0))
                  ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {employeeListInfo && employeeListInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
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
