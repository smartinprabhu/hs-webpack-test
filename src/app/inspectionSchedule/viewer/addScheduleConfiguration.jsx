/* eslint-disable react/prop-types */
/* eslint-disable radix */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/require-default-props */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/system/Box';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import TextField from '@material-ui/core/TextField';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@material-ui/core/CircularProgress';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';

import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';

import { IoCloseOutline } from 'react-icons/io5';

import DialogHeader from '../../commonComponents/dialogHeader';
import Selection from '../../commonComponents/multipleFormFields/selectionMultiple';
import {
  generateErrorMessage,
  extractOptionsObject,
  getAllowedCompanies,
  decimalKeyPressDown,
  generateTimeDurations,
  generateTimeDurationsOnlyHours,
  getColumnArrayById,
  getColumnArrayByIdWithObj,
} from '../../util/appUtils';
import { AddThemeColor, returnThemeColor } from '../../themes/theme';

import {
  getOperationsList,
  getPreventiveCheckList,
} from '../../preventiveMaintenance/ppmService';

import {
  getTeamList,
  getPartners,
} from '../../assets/equipmentService';
import SearchModalTeam from '../../assets/forms/advancedSearchModal';
import AdvancedSearchModal from '../../workPermit/configration/forms/advancedSearchModal';

import MuiAutoCompleteStatic from '../../commonComponents/formFields/muiAutocompleteStatic';

import { infoValue } from '../../adminSetup/utils/utils';
import MuiDatePicker from '../../commonComponents/multipleFormFields/muiDatePicker';
import MuiCheckboxField from '../../commonComponents/multipleFormFields/muiCheckboxMini';

const appModels = require('../../util/appModels').default;

const AddScheduleConfiguration = ({
  editId, formValues, setFormValues, spaces, equipments,
}) => {
  const [teamKeyword, setTeamKeyword] = useState('');
  const [teamOpen, setTeamOpen] = React.useState(false);

  const [extraModalTeam, setExtraModalTeam] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [columns, setColumns] = useState(['id', 'name']);
  const [placeholderName, setPlaceholder] = useState('');

  const [extraModal, setExtraModal] = useState(false);
  const [taskKeyword, setTaskKeyword] = useState(false);
  const [checkKeyword, setCheckKeyword] = useState(false);

  const {
    teamsInfo,
  } = useSelector((state) => state.equipment);
  const { userInfo } = useSelector((state) => state.user);
  const { taskInfo, checkList } = useSelector((state) => state.ppm);

  const dispatch = useDispatch();

  const companies = getAllowedCompanies(userInfo);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && teamOpen) {
        await dispatch(getTeamList(companies, appModels.TEAM, teamKeyword));
      }
    })();
  }, [teamOpen, teamKeyword]);

  function getUniqueValues(arr) {
    return [...new Map(arr.map((item) => [item, item])).values()];
  }

  function getCategoryId() {
    let equipmentCategory = false;
    let spaceCategory = false;
    if (editId) {
      equipmentCategory = formValues.equipment_id && formValues.equipment_id.category_id && formValues.equipment_id.category_id.id ? formValues.equipment_id.category_id.id : false;
      spaceCategory = formValues.space_id && formValues.space_id.asset_category_id && formValues.space_id.asset_category_id.length ? formValues.space_id.asset_category_id[0] : formValues.space_id && formValues.space_id.asset_category_id && formValues.space_id.asset_category_id.id ? formValues.space_id.asset_category_id.id : false;
    } else {
      equipmentCategory = equipments && equipments.length ? getUniqueValues(getColumnArrayByIdWithObj(equipments, 'category_id')) : false;
      spaceCategory = spaces && spaces.length ? getUniqueValues(getColumnArrayById(spaces, 'type')) : false;
    }
    return formValues.category_type === 'e' ? equipmentCategory : spaceCategory;
  }

  useEffect(() => {
    (async () => {
      if (!editId) {
        if (userInfo && userInfo.data) {
          await dispatch(getOperationsList(companies, appModels.TASK, taskKeyword, formValues.category_type === 'e' ? 'equipment' : 'asset', false, getCategoryId()));
        }
        if (userInfo && userInfo.data) {
          await dispatch(getPreventiveCheckList(companies, appModels.PPMCHECKLIST, checkKeyword, formValues.category_type, getCategoryId()));
        }
      } else {
        if (userInfo && userInfo.data) {
          await dispatch(getOperationsList(companies, appModels.TASK, taskKeyword, formValues.category_type === 'e' ? 'equipment' : 'asset', false, getCategoryId()));
        }
        if (userInfo && userInfo.data) {
          await dispatch(getPreventiveCheckList(companies, appModels.PPMCHECKLIST, checkKeyword, formValues.category_type, getCategoryId()));
        }
      }
    })();
  }, [taskKeyword, checkKeyword, spaces, equipments, formValues.category_type, formValues.category_id, formValues.equipment_id, formValues.space_id]);

  const onTeamChange = (value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      maintenance_team_id: value,
    }));
  };

  const onTaskChange = (value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      task_id: value,
    }));
  };

  const onChecklistChange = (value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      check_list_id: value,
    }));
  };

  const handleCheckChange = (event, field) => {
    const { checked } = event.target;
    if (checked) {
      setFormValues((prevValues) => ({
        ...prevValues,
        [field]: true,
      }));
    } else {
      setFormValues((prevValues) => ({
        ...prevValues,
        [field]: false,
      }));
    }
  };

  const onTeamClear = () => {
    setTeamKeyword(null);
    setFormValues((prevValues) => ({
      ...prevValues,
      maintenance_team_id: '',
    }));
    setTeamOpen(false);
  };

  const onTeamSelect = (name, value) => {
    console.log(value);
    setFormValues((prevValues) => ({
      ...prevValues,
      maintenance_team_id: value,
    }));
  };

  const getArrayToCommaValuesTime = (array, key) => {
    let ids = '';
    if (array && array.length > 0) {
      for (let i = 0; i < array.length; i += 1) {
        ids += `${parseFloat((array[i][key])).toFixed(2)},`;
      }
    }
    ids = ids.substring(0, ids.length - 1);
    return ids;
  };

  const onDateChange = (value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      starts_at: value,
      description: !editId ? `Starts at ${value && value.length && getArrayToCommaValuesTime(value, 'value')} for ${formValues.duration && formValues.duration.value}` : `Starts at ${value && value.value} for ${formValues.duration && formValues.duration.value}`,
    }));
  };

  const onDropdownCustom = (value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      duration: { value: value && value.value ? value.value : '', label: value && value.label ? value.label : '' },
      description: !editId ? `Starts at ${formValues.starts_at && formValues.starts_at.length && getArrayToCommaValuesTime(formValues.starts_at, 'value')} for ${value && value.value ? value.value : ''}` : `Starts at ${formValues.starts_at && formValues.starts_at.value} for ${value && value.value ? value.value : ''}`,
    }));
  };

  const handleCommenseDateChange = (e) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      ends_on: e,
    }));
  };

  const onTextFieldChange = (e) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      description: e,
    }));
  };

  const onTrackChange = (e) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      is_enable_time_tracking: e.target.checked,
    }));
  };

  const onDurationChange = (e, field) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [field]: e.target.value,
    }));
  };

  const onTaskSelect = (name, value) => {
    if (fieldName === 'task_id') {
      setFormValues((prevValues) => ({
        ...prevValues,
        task_id: value,
      }));
    } else if (fieldName === 'vendor_id') {
      setFormValues((prevValues) => ({
        ...prevValues,
        vendor_id: value,
      }));
    }
  };

  const showTeamModal = () => {
    setModelValue(appModels.TEAM);
    setColumns(['id', 'name']);
    setFieldName('maintenance_team_id');
    setModalName('Team List');
    setPlaceholder('Maintenance Teams');
    setCompanyValue(companies);
    setExtraModalTeam(true);
  };

  const setCommenceOn = (value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      commences_on: value,
    }));
  };

  const teamOptions = extractOptionsObject(teamsInfo, formValues.maintenance_team_id);

  const timeDurationsHours = generateTimeDurationsOnlyHours(24);
  const timeDurations = generateTimeDurations(1);

  return (
    <Box
      sx={{
        width: '100%',
        maxHeight: '100vh',
        overflow: 'hidden',
        marginBottom: '30px',
      }}
    >
      <FormControl
        sx={{
          width: '100%',
          padding: '10px 0px 20px 30px',
          // maxHeight: '600px',
          // overflowY: 'scroll',
          overflow: 'hidden',
          borderTop: '1px solid #0000001f',
        }}
      >
        <Box
          sx={{
            width: '100%',
          }}
        />

        <p style={{ color: returnThemeColor() }} className="font-family-tab font-weight-800">Schedule Info</p>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            gap: '3%',
          }}
        >
          <Box
            sx={{
              marginTop: 'auto',
              marginBottom: '10px',
              width: '20%',
            }}
          >
            <MuiDatePicker
              label={(
                <>
                  Commences On
                  <span className="text-danger ml-1">*</span>
                  {infoValue('commences_on')}
                </>
                        )}
              value={formValues.commences_on}
              onChange={(e) => setCommenceOn(e)}
              minDate={dayjs(new Date())}
            />
          </Box>
          <Selection
            isMultipleCustom={!editId}
            isCustomData={!!editId}
            paramsSet={(e) => onDateChange(e)}
            paramsValue={!editId && !Array.isArray(formValues.starts_at) ? [formValues.starts_at] : formValues.starts_at}
            paramsId={Math.random()}
            dropdownOptions={timeDurationsHours}
            labelName="Starts At(Hours)"
            placeholderText="00:00 (HH:MM)"
            infoText="starts_at"
            sx={{
              marginTop: 'auto',
              marginBottom: '10px',
              width: '20%',
            }}
            isRequired
          />
          <Selection
            paramsSet={(e) => onDropdownCustom(e)}
            paramsValue={formValues.duration}
            paramsId={Math.random()}
            dropdownOptions={timeDurations}
            labelName="Duration(Hours)"
            placeholderText="00:00 (HH:MM)"
            infoText="duration"
            sx={{
              marginTop: 'auto',
              marginBottom: '10px',
              width: '17%',
            }}
            isCustomData
            isRequired
          />
          <Box
            sx={{
              marginTop: 'auto',
              marginBottom: '10px',
              width: '23%',
            }}
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DateTimePicker']}>
                <DateTimePicker
                  sx={{ width: '100%' }}
                  localeText={{ todayButtonLabel: 'Now' }}
                  slotProps={{
                    actionBar: {
                      actions: ['today', 'clear'],
                    },
                    textField: { variant: 'standard', InputLabelProps: { shrink: true } },
                  }}
                  name="ends_on"
                  label={(
                    <>
                      Ends On
                      {infoValue('ends_on')}
                    </>
                              )}
                  value={formValues.ends_on}
                  onChange={handleCommenseDateChange}
                  ampm={false}
                  disablePast
                />
              </DemoContainer>
            </LocalizationProvider>
          </Box>

          <FormControl
            sx={{
              marginTop: 'auto',
              marginBottom: '10px',
              width: '20%',
            }}
            variant="standard"
          >
            <TextField
              variant="standard"
              size="small"
              type="text"
              name="description"
              label={(
                <>
                  Description
                  <span className="text-danger ml-1">*</span>
                  {infoValue('description_Ins')}
                </>
        )}
              className="bg-white"
              value={formValues.description}
              InputLabelProps={{ shrink: true }}
              onChange={(e) => onTextFieldChange(e)}
              inputProps={{ maxLength: 150 }}
            />
          </FormControl>

        </Box>

        <Box
          sx={{
            width: '100%',
            display: 'flex',
            gap: '3%',
          }}
        >
          <FormControl
            sx={{
              marginTop: 'auto',
              marginBottom: '10px',
              width: '18%',
            }}
          >
            <FormControlLabel
              value={formValues.is_enable_time_tracking}
              checked={formValues.is_enable_time_tracking}
              control={(
                <Checkbox
                  onChange={onTrackChange}
                />
                              )}
              label="Enable Time Tracking?"
            />
          </FormControl>
          {formValues.is_enable_time_tracking ? (
            <>
              <FormControl
                sx={{
                  marginTop: 'auto',
                  marginBottom: '10px',
                  width: '20%',
                }}
                variant="standard"
              >
                <TextField
                  variant="standard"
                  size="small"
                  type="text"
                  name="min_duration"
                  label={(
                    <>
                      Min Duration
                      <span className="text-danger ml-1">*</span>
                      {infoValue('min_duration')}
                    </>
                            )}
                  className="bg-white"
                  value={formValues.min_duration}
                  onKeyPress={decimalKeyPressDown}
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) => onDurationChange(e, 'min_duration')}
                  inputProps={{ maxLength: 5 }}
                />
              </FormControl>
              <FormControl
                sx={{
                  marginTop: 'auto',
                  marginBottom: '10px',
                  width: '20%',
                }}
                variant="standard"
              >
                <TextField
                  variant="standard"
                  size="small"
                  type="text"
                  name="max_duration"
                  label={(
                    <>
                      Max Duration
                      <span className="text-danger ml-1">*</span>
                      {infoValue('max_duration')}
                    </>
                    )}
                  onKeyPress={decimalKeyPressDown}
                  className="bg-white"
                  value={formValues.max_duration}
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) => onDurationChange(e, 'max_duration')}
                  inputProps={{ maxLength: 5 }}
                />
              </FormControl>
            </>
          ) : ''}
        </Box>
        <p style={{ color: returnThemeColor() }} className="font-family-tab font-weight-800">Maintenance Info</p>

        <Box
          sx={{
            width: '100%',
            display: 'flex',
            gap: '3%',
          }}
        >
          {editId && (
          <>
            <Selection
              paramsSet={onTaskChange}
              setDropdownKeyword1={setTaskKeyword}
              paramsValue={formValues.task_id}
              paramsId={Math.random()}
              callData={getOperationsList}
              callDataFields={{ type: formValues.category_type === 'e' ? 'equipment' : 'asset', category: getCategoryId() }}
              dropdownsInfo={taskInfo}
              dropdownOptions={extractOptionsObject(taskInfo, formValues.task_id)}
              moduleName={appModels.TASK}
              labelName="Maintenance Operation"
              columns={['id', 'name']}
              advanceSearchHeader="Maintenance Operation List"
              infoText="MaintenanceOperation"
              advanceSearchCondition={`["company_id","in",[${companies}]],["maintenance_type","=","pm"],["type_category","=","${formValues.category_type === 'e' ? 'equipment' : 'asset'}"],["${formValues.category_type === 'e' ? 'category_id' : 'asset_category_id'}","${!editId ? 'in' : '='}",${editId ? getCategoryId() : JSON.stringify(getCategoryId())}]`}
                    // isRequired
              sx={{
                marginTop: 'auto',
                marginBottom: '10px',
                width: '20%',
              }}
            />
            <Selection
              paramsSet={onChecklistChange}
              setDropdownKeyword1={setCheckKeyword}
              paramsValue={formValues.check_list_id}
              paramsId={Math.random()}
              callData={getPreventiveCheckList}
              callDataFields={{ type: formValues.category_type, category: !editId ? formValues.category_id && formValues.category_id.id : (formValues.category_type === 'e' ? formValues.equipment_id && formValues.equipment_id.category_id && formValues.equipment_id.category_id.id : formValues.space_id && formValues.space_id.asset_category_id && formValues.space_id.asset_category_id.id) }}
              dropdownsInfo={checkList}
              dropdownOptions={extractOptionsObject(checkList, formValues.check_list_id)}
              moduleName={appModels.PPMCHECKLIST}
              labelName="Maintenance Checklist"
              columns={['id', 'name']}
              advanceSearchHeader="Maintenance Checklist List"
              infoText="MaintenanceChecklist"
              advanceSearchCondition={`["company_id","in",[${companies}]],["type","=","${formValues.category_type === 'e' ? 'Equipment' : 'Space'}"],["${formValues.category_type === 'e' ? 'equipment_category_id' : 'asset_category_id'}","${!editId ? 'in' : '='}",${editId ? getCategoryId() : JSON.stringify(getCategoryId())}]`}
              isRequired
              sx={{
                marginTop: 'auto',
                marginBottom: '10px',
                width: '20%',
              }}
            />
          </>
          )}
          <MuiAutoCompleteStatic
            sx={{
              marginTop: 'auto',
              marginBottom: '10px',
              width: '20%',
            }}
            name="maintenance_team_id"
            label="Maintenance Team"
            open={teamOpen}
            isRequired
            value={formValues.maintenance_team_id && formValues.maintenance_team_id.name ? formValues.maintenance_team_id.name : ''}
            apiError={(teamsInfo && teamsInfo.err) ? generateErrorMessage(teamsInfo) : false}
            setValue={onTeamChange}
            onOpen={() => {
              setTeamOpen(true);
              setTeamKeyword('');
            }}
            onClose={() => {
              setTeamOpen(false);
              setTeamKeyword('');
            }}
            loading={teamsInfo && teamsInfo.loading}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={teamOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={(e) => setTeamKeyword(e.target.value)}
                variant="standard"
                label={(
                  <>
                    <span className="font-family-tab">Maintenance Team</span>
                    {' '}
                    <span className="text-danger text-bold">*</span>
                  </>
                  )}
                value={teamKeyword}
                className={((formValues.maintenance_team_id && formValues.maintenance_team_id.name) || (teamKeyword && teamKeyword.length > 0))
                  ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                placeholder="Search & Select Maintenance Team"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {teamsInfo && teamsInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {((formValues.maintenance_team_id && formValues.maintenance_team_id.name) || (teamKeyword && teamKeyword.length > 0)) && (
                          <Tooltip title="Clear" fontSize="small">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={onTeamClear}
                            >
                              <IoCloseOutline size={22} fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Search" fontSize="small">
                          <IconButton
                            aria-label="toggle search visibility"
                            onClick={showTeamModal}
                          >
                            <SearchIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </InputAdornment>
                    </>
                  ),
                }}
              />
            )}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: '3%' }}>
          <Box
            sx={{
              width: '50%',
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
              Exclude Days
            </Typography>
            <small>Select any days you would like to exclude from the scheduling options</small>
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '3%',
                flexWrap: 'wrap',
                padding: '10px',
                justifyContent: 'flex-start',
              }}
            >
              <MuiCheckboxField
                value={formValues.mo}
                label="Mon"
                checkboxChange={(e) => handleCheckChange(e, 'mo')}
              />
              <MuiCheckboxField
                value={formValues.tu}
                label="Tue"
                checkboxChange={(e) => handleCheckChange(e, 'tu')}
              />
              <MuiCheckboxField
                value={formValues.we}
                label="Wed"
                checkboxChange={(e) => handleCheckChange(e, 'we')}
              />
              <MuiCheckboxField
                value={formValues.th}
                label="Thu"
                checkboxChange={(e) => handleCheckChange(e, 'th')}
              />
              <MuiCheckboxField
                value={formValues.fr}
                label="Fri"
                checkboxChange={(e) => handleCheckChange(e, 'fr')}
              />
              <MuiCheckboxField
                value={formValues.sa}
                label="Sat"
                checkboxChange={(e) => handleCheckChange(e, 'sa')}
              />
              <MuiCheckboxField
                value={formValues.su}
                label="Sun"
                checkboxChange={(e) => handleCheckChange(e, 'su')}
              />
            </Box>
          </Box>
          <Box
            sx={{
              width: '50%',
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
              Capture Picture
            </Typography>
            <small>Select when to capture a picture during the inspection process</small>
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '3%',
                flexWrap: 'wrap',
                padding: '10px',
                justifyContent: 'flex-start',
              }}
            >
              <MuiCheckboxField
                value={formValues.at_start_mro}
                label="To Start"
                checkboxChange={(e) => handleCheckChange(e, 'at_start_mro')}
              />
              <MuiCheckboxField
                value={formValues.at_review_mro}
                label="To Review"
                checkboxChange={(e) => handleCheckChange(e, 'at_review_mro')}
              />
              <MuiCheckboxField
                value={formValues.at_done_mro}
                label="To Complete"
                checkboxChange={(e) => handleCheckChange(e, 'at_done_mro')}
              />
            </Box>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: '3%' }}>
          <Box
            sx={{
              width: '50%',
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
              Time Enforcement
            </Typography>
            <small>Select the time enforcement option for your inspection</small>
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '3%',
                flexWrap: 'wrap',
                padding: '10px',
                justifyContent: 'flex-start',
              }}
            >
              <MuiCheckboxField
                value={formValues.enforce_time}
                label="Enforce Time"
                checkboxChange={(e) => handleCheckChange(e, 'enforce_time')}
              />

            </Box>
          </Box>
          <Box
            sx={{
              width: '50%',
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
              QR Scan
            </Typography>
            <small>Choose an QR scan option for your inspection</small>
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '3%',
                flexWrap: 'wrap',
                padding: '10px',
                justifyContent: 'flex-start',
              }}
            >
              <MuiCheckboxField
                value={formValues.qr_scan_at_start}
                label="QR Scan at Start"
                checkboxChange={(e) => handleCheckChange(e, 'qr_scan_at_start')}
              />
              <MuiCheckboxField
                value={formValues.qr_scan_at_done}
                label="QR Scan at Done"
                checkboxChange={(e) => handleCheckChange(e, 'qr_scan_at_done')}
              />
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            width: '50%',
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
            NFC
          </Typography>
          <small>Choose an NFC scan option for your inspection</small>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '3%',
              flexWrap: 'wrap',
              padding: '10px',
              justifyContent: 'flex-start',
            }}
          >

            <MuiCheckboxField
              value={formValues.nfc_scan_at_start}
              label="NFC Scan at Start"
              checkboxChange={(e) => handleCheckChange(e, 'nfc_scan_at_start')}
            />
            <MuiCheckboxField
              value={formValues.nfc_scan_at_done}
              label="NFC Scan at Done"
              checkboxChange={(e) => handleCheckChange(e, 'nfc_scan_at_done')}
            />
          </Box>
        </Box>

      </FormControl>
      <Dialog size="lg" fullWidth open={extraModalTeam}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraModalTeam(false); }} />
        <DialogContent>
          <SearchModalTeam
            modelName={modelValue}
            afterReset={() => { setExtraModalTeam(false); }}
            fieldName={fieldName}
            fields={columns}
            company={companyValue}
            placeholderName={placeholderName}
            setFieldValue={onTeamSelect}
          />
        </DialogContent>
      </Dialog>
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
              setFieldValue={onTaskSelect}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AddScheduleConfiguration;
