/* eslint-disable react/forbid-prop-types */
/* eslint-disable camelcase */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {
  TextField, CircularProgress, FormHelperText,
} from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import BackspaceIcon from '@material-ui/icons/Backspace';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import {
  Row, Col, Label, Modal, ModalBody,
} from 'reactstrap';
import { useFormikContext } from 'formik';
import 'antd/dist/antd.css';
import { Dialog, DialogContent, DialogContentText, Box, Typography, RadioGroup } from "@mui/material";
import { IoCloseOutline } from 'react-icons/io5';

import {
  InputField, FormikAutocomplete, CheckboxField, CheckboxFieldGroup, DateTimeField,
} from '@shared/formFields';
import MuiTextField from '../../../../commonComponents/formFields/muiTextField';
import MuiAutoComplete from '../../../../commonComponents/formFields/muiAutocomplete';
import MuiFormLabel from '../../../../commonComponents/formFields/muiFormLabel';
import MuiCheckbox from '../../../../commonComponents/formFields/muiCheckbox';
import MuiDateTimeField from '../../../../commonComponents/formFields/muiDateTimeField';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import {
  generateErrorMessage, getAllCompanies, decimalKeyPressDown, integerKeyPress, lettersOnly, getColumnArrayByIdWithArray, getArrayFromValuesById, getDateTimeSeconds,
} from '../../../../util/appUtils';
import assetActionData from '../../../data/assetsActions.json';
import { getEquipmentList } from '../../../../helpdesk/ticketService';
import {
  getReading, getPreventiveCheckList, getTeamCategory, getAlarmCategory, getAlarmRecipients, getAlarmActions,
} from '../../../equipmentService';
import {
  getDataTypeLabel, getConditionLabel, getTimePeriodLabel, getRecurrenceLabel, getTodoLabel, getMaintainLabel, getPriorityTypesLabel,
} from '../../../utils/utils';
import SearchModalMultiple from './searchModalMultiple';
import { AddThemeColor } from '../../../../themes/theme';
import DialogHeader from '../../../../commonComponents/dialogHeader';

const appModels = require('../../../../util/appModels').default;

const ReadingForm = (props) => {
  const {
    setFieldValue,
    setFieldTouched,
    editId,
    formField: {
      readingId,
      uomId,
      typeValue,
      isActive,
      toDo,
      dataType,
      manualReading,
      conditionValue,
      validateEntry,
      minimumValue,
      maximumValue,
      validationErrMsg,
      aggregateTimePeriod,
      thresholdValue,
      recurrentValue,
      orderGeneratedOn,
      propagateValue,
      thresholdMin,
      thresholdMax,
      checkListId,
      teamCategory,
      mType,
      mroPropagate,
      alarmName,
      priorityValue,
      categoryValue,
      alarmRecipient,
      propagateAlarm,
      notiyMessage,
      descriptionValue,
      alarmAction,
      fontAwesomeIcon,
      ttlMinute,
      measuredOn,
      measureValue,
      measureId,
      equipmentId,
    },
  } = props;
  const dispatch = useDispatch();
  const [readingOpen, setReadingOpen] = useState(false);
  const [todoOpen, setTodoOpen] = useState(false);
  const [dataTypeOpen, setDataTypeOpen] = useState(false);
  const [conditionOpen, setConditionOpen] = useState(false);
  const [timePeriodOpen, setTimePeriodOpen] = useState(false);
  const [recurrentOpen, setRecurrentOpen] = useState(false);
  const [checklistOpen, setChecklistOpen] = useState(false);
  const [mTypeOpen, setMTypeOpen] = useState(false);
  const [teamCategoryOpen, setTeamCategoryOpen] = useState(false);
  const [priorityOpen, setPriorityOpen] = useState(false);
  const [alarmCategoryOpen, setAlarmCategoryOpen] = useState(false);
  const [alarmRecipientOpen, setAlarmRecipientOpen] = useState(false);
  const [alarmActionOpen, setAlarmActionOpen] = useState(false);
  const [measureReadingOpen, setMeasureReadingOpen] = useState(false);
  const [equipmentOpen, setEquipmentOpen] = useState(false);
  const [readingKeyword, setReadingKeyword] = useState('');
  const [checklistKeyword, setChecklistKeyword] = useState('');
  const [teamCategoryKeyword, setTeamCategoryKeyword] = useState('');
  const [alarmCategoryKeyword, setAlarmCategoryKeyword] = useState('');
  const [alarmRecipientKeyword, setAlarmRecipientKeyword] = useState('');
  const [alarmActionKeyword, setAlarmActionKeyword] = useState('');
  const [measureReadingKeyword, setMeasureReadingKeyword] = useState('');
  const [equipmentKeyword, setEquipmentKeyword] = useState('');
  const [extraMultipleModal, setExtraMultipleModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [fieldNameOne, setFieldNameOne] = useState('');
  const [fieldNameTwo, setFieldNameTwo] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [columns, setColumns] = useState(['id', 'name']);
  const { values: formValues } = useFormikContext();
  const {
    reading_id, type, uom_id, is_active, to_do, data_type, condition,
    validation_required, aggregate_timeperiod, recurrent, check_list_id, team_category_id, maintenance_type, priority, category_id, alarm_recipients,
    alarm_actions, date, measure_id, log_equipment_id,
  } = formValues;

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllCompanies(userInfo, userRoles);
  const {
    assetReadings, readingsList, checkList, teamCategoryInfo, alarmCategoryInfo, alarmRecipientsInfo, alarmActionsInfo, equipmentsDetails,
  } = useSelector((state) => state.equipment);
  const { equipmentInfo } = useSelector((state) => state.ticket);

  useEffect(() => {
    (async () => {
      if (userInfo.data && readingOpen) {
        await dispatch(getReading(appModels.READINGS, encodeURIComponent(readingKeyword)));
      }
    })();
  }, [readingOpen, readingKeyword]);

  useEffect(() => {
    (async () => {
      if (userInfo.data && checklistOpen) {
        await dispatch(getPreventiveCheckList(companies, appModels.PPMCHECKLIST));
      }
    })();
  }, [checklistOpen, checklistKeyword]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && teamCategoryOpen) {
        await dispatch(getTeamCategory(companies, appModels.CATEGORY, encodeURIComponent(teamCategoryKeyword)));
      }
    })();
  }, [teamCategoryOpen, teamCategoryKeyword]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && alarmCategoryOpen) {
        await dispatch(getAlarmCategory(companies, appModels.ALARMCATEGORY, encodeURIComponent(alarmCategoryKeyword)));
      }
    })();
  }, [alarmCategoryOpen, alarmCategoryKeyword]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && alarmRecipientOpen) {
        await dispatch(getAlarmRecipients(companies, appModels.ALARMRECIPIENTS, encodeURIComponent(alarmRecipientKeyword)));
      }
    })();
  }, [alarmRecipientOpen, alarmRecipientKeyword]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && alarmActionOpen) {
        await dispatch(getAlarmActions(companies, appModels.ALARMACTIONS, encodeURIComponent(alarmActionKeyword)));
      }
    })();
  }, [alarmActionOpen, alarmActionKeyword]);

  useEffect(() => {
    (async () => {
      if (userInfo.data && measureReadingOpen) {
        await dispatch(getReading(appModels.READINGS, encodeURIComponent(measureReadingKeyword)));
      }
    })();
  }, [measureReadingOpen, measureReadingKeyword]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && equipmentOpen) {
        await dispatch(getEquipmentList(companies, appModels.EQUIPMENT, encodeURIComponent(equipmentKeyword)));
      }
    })();
  }, [equipmentOpen, equipmentKeyword]);

  useEffect(() => {
    if (reading_id && reading_id.id) {
      let readingsData = [];
      if (readingsList && readingsList.data && readingsList.data.length > 0) {
        readingsData = readingsList.data.filter((obj) => (obj.id === reading_id.id));
      }
      if (readingsData.length > 0) {
        setFieldValue('uom_id', readingsData[0].uom_id === false ? '' : readingsData[0].uom_id[1]);
        setFieldValue('type', readingsData[0].type);
      }
      setFieldValue('measure_id', [reading_id.id, reading_id.display_name]);
    } else if (reading_id && reading_id.length > 0) {
      setFieldValue('uom_id', uom_id && uom_id.length > 0 ? uom_id[1] : '');
      setFieldValue('type', type);
      setFieldValue('measure_id', reading_id);
    } else {
      setFieldValue('uom_id', '');
      setFieldValue('type', '');
    }
  }, [reading_id]);

  useEffect(() => {
    if (equipmentsDetails && equipmentsDetails.data && equipmentsDetails.data.length > 0) {
      const equipmentIdValue = equipmentsDetails && equipmentsDetails.data && equipmentsDetails.data.length > 0 ? equipmentsDetails.data[0].id : '';
      const equipmentName = equipmentsDetails && equipmentsDetails.data && equipmentsDetails.data.length > 0 ? equipmentsDetails.data[0].name : '';
      setFieldValue('log_equipment_id', [equipmentIdValue, equipmentName]);
    }
  }, [equipmentsDetails]);

  function getIsActiveInfo() {
    let isActiveLabel = is_active ? 'yes' : 'no';

    if (is_active === 'yes') {
      isActiveLabel = 'yes';
    }

    if (is_active === 'no') {
      isActiveLabel = 'no';
    }

    return isActiveLabel;
  }

  useEffect(() => {
    getIsActiveInfo();
  }, [isActive]);

  const onReadingKeywordChange = (event) => {
    setReadingKeyword(event.target.value);
  };

  const onAlarmCategoryKeywordChange = (event) => {
    setAlarmCategoryKeyword(event.target.value);
  };

  const onAlarmRecipientKeywordChange = (event) => {
    setAlarmRecipientKeyword(event.target.value);
  };

  const onAlarmActionKeywordChange = (event) => {
    setAlarmActionKeyword(event.target.value);
  };

  const onTeamCategoryKeywordChange = (event) => {
    setTeamCategoryKeyword(event.target.value);
  };

  const onChecklistKeywordChange = (event) => {
    setChecklistKeyword(event.target.value);
  };

  const onMeasureReadingKeywordChange = (event) => {
    setMeasureReadingKeyword(event.target.value);
  };

  let readingOptions = [];

  if (readingsList && readingsList.loading) {
    readingOptions = [{ display_name: 'Loading..' }];
  }
  if (readingsList && readingsList.data) {
    const ids = getColumnArrayByIdWithArray(assetReadings && assetReadings.data && assetReadings.data.length > 0 ? assetReadings.data : [], 'reading_id');
    const data = getArrayFromValuesById(readingsList.data, ids, 'id');
    if (data && data.length > 0) {
      readingOptions = data.map((cl) => ({
        ...cl, value: cl.id, label: cl.name,
      }));
    }
    if (reading_id && reading_id.length > 0) {
      const oldId = [{ id: reading_id[0], display_name: reading_id[1] }];
      const newArr = [...readingOptions, ...oldId];
      readingOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
    }
  }

  let checklistOptions = [];

  if (checkList && checkList.loading) {
    checklistOptions = [{ name: 'Loading..' }];
  }
  if (checkList && checkList.data) {
    checklistOptions = checkList.data;
  }

  let teamCategoryOptions = [];

  if (teamCategoryInfo && teamCategoryInfo.loading) {
    teamCategoryOptions = [{ name: 'Loading..' }];
  }
  if (teamCategoryInfo && teamCategoryInfo.data) {
    teamCategoryOptions = teamCategoryInfo.data;
  }

  let alarmCategoryOptions = [];

  if (alarmCategoryInfo && alarmCategoryInfo.loading) {
    alarmCategoryOptions = [{ name: 'Loading..' }];
  }
  if (alarmCategoryInfo && alarmCategoryInfo.data) {
    alarmCategoryOptions = alarmCategoryInfo.data;
  }

  let alarmRecipientOptions = [];

  if (alarmRecipientsInfo && alarmRecipientsInfo.loading) {
    alarmRecipientOptions = [{ name: 'Loading..' }];
  }
  if (alarmCategoryInfo && alarmRecipientsInfo.data) {
    alarmRecipientOptions = alarmRecipientsInfo.data;
  }

  let alarmActionOptions = [];

  if (alarmActionsInfo && alarmActionsInfo.loading) {
    alarmActionOptions = [{ name: 'Loading..' }];
  }
  if (alarmActionsInfo && alarmActionsInfo.data) {
    alarmActionOptions = alarmActionsInfo.data;
  }

  let equipmentOptions = [];

  if (equipmentInfo && equipmentInfo.loading) {
    equipmentOptions = [{ name: 'Loading..' }];
  }
  if (equipmentInfo && equipmentInfo.data) {
    equipmentOptions = equipmentInfo.data;
  }

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

  const showReadingsModal = () => {
    setModelValue(appModels.READINGS);
    setFieldName('reading_id');
    setFieldNameOne('type');
    setFieldNameTwo('uom_id');
    setModalName('Readings');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setColumns(['id', 'name', 'type', 'uom_id']);
    setExtraMultipleModal(true);
  };

  return (
    <>
      <Box sx={{ display: 'flex', gap: '3%' }}>
        <Box sx={{ width: '50%' }}>
          <Typography
            sx={AddThemeColor({
              font: "normal normal medium 20px/24px Suisse Intl",
              letterSpacing: "0.7px",
              fontWeight: 500,
              marginBottom: "10px",
              paddingBottom: '4px'
            })}
          >
            Reading Configuration
          </Typography>
          <MuiAutoComplete
            sx={{
              marginTop: "auto",
              marginBottom: "10px",
            }}
            name={readingId.name}
            label={readingId.label}
            formGroupClassName="m-1"            
            disabled={editId}
            open={readingOpen}
            size="small"
            onOpen={() => {
              setReadingOpen(true);
              setReadingKeyword('');
            }}
            onClose={() => {
              setReadingOpen(false);
              setReadingKeyword('');
            }}
            oldValue={getOldData(reading_id)}
            value={reading_id && reading_id.display_name ? reading_id.display_name : getOldData(reading_id)}
            loading={readingsList && readingsList.loading}
            getOptionSelected={(option, values) => option.display_name === values.display_name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.display_name)}
            options={readingOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                required
                onChange={onReadingKeywordChange}
                label={`${readingId.label}`}
                variant="standard"
                className={reading_id && reading_id.id ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {readingsList && readingsList.loading ? <CircularProgress color="inherit" size={20} /> : null}
                      {!editId && (
                        <InputAdornment position="end">
                          {((reading_id && reading_id.id) || (readingKeyword && readingKeyword.length > 0) || (reading_id && reading_id.length)) && (
                            <IconButton onClick={() => {
                              setFieldValue('reading_id', '');
                              setFieldValue('uom_id', '');
                              setFieldValue('type', '');
                              setReadingKeyword('');
                            }}
                            >
                              <IoCloseOutline size={22} fontSize="small" />
                            </IconButton>
                          )}
                          <IconButton
                            aria-label="toggle search visibility"
                            onClick={showReadingsModal}
                          >
                            <SearchIcon fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      )}
                    </>
                  ),
                }}
              />
            )}
          />
          {(readingsList && readingsList.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(readingsList)}</span></FormHelperText>)}
          <MuiTextField
            sx={{
              marginTop: "auto",
              marginBottom: "10px",
            }}
            name={typeValue.name}
            label={typeValue.label}
            disabled
            formGroupClassName="mb-2 ml-1 mt-1 mr-0 disabledInput"
            type="text"
            readOnly
          />
          <MuiTextField
            sx={{
              marginTop: "auto",
              marginBottom: "10px",
            }}
            name={uomId.name}
            label={uomId.label}
            disabled
            formGroupClassName="mb-2 ml-1 mt-1 mr-0 disabledInput"
            type="text"
            readOnly
          />
          <MuiAutoComplete
            sx={{
              marginTop: "auto",
              marginBottom: "10px",
            }}
            name={dataType.name}
            label={dataType.label}
            formGroupClassName="m-1"
            open={dataTypeOpen}
            size="small"
            onOpen={() => {
              setDataTypeOpen(true);
            }}
            onClose={() => {
              setDataTypeOpen(false);
            }}
            disableClearable
            oldvalue={getDataTypeLabel(data_type)}
            value={data_type && data_type.label ? data_type.label : getDataTypeLabel(data_type)}
            getOptionSelected={(option, values) => option.label === values.label}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
            options={assetActionData.dataTypes}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label={dataType.label}
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
          <Typography
            sx={AddThemeColor({
              font: "normal normal medium 20px/24px Suisse Intl",
              letterSpacing: "0.7px",
              fontWeight: 500,
              marginBottom: "10px",
              paddingBottom: '4px'
            })}
          >
            Status
          </Typography>
          <RadioGroup
            row
            aria-labelledby="demo-form-control-label-placement"
            name="position"
            defaultValue="top"
            sx={{
              marginTop: "auto",
            }}
          >
            <MuiFormLabel
              name={isActive.name}
              checkedvalue="yes"
              id="yes"
              customvalue={getIsActiveInfo()}
              className="ml-1"
              label={isActive.label}
            />
            <MuiFormLabel
              name={isActive.name}
              checkedvalue="no"
              id="no"
              customvalue={getIsActiveInfo()}
              label={isActive.label1}
            />
          </RadioGroup>
          <MuiCheckbox
            sx={{
              marginTop: "auto",
              marginBottom: "10px",
            }}
            className="ml-1"
            name={manualReading.name}
            label={manualReading.label}
          />
        </Box>
        <Box sx={{ width: '50%' }}>
          <Typography
            sx={AddThemeColor({
              font: "normal normal medium 20px/24px Suisse Intl",
              letterSpacing: "0.7px",
              fontWeight: 500,
              marginBottom: "10px",
              paddingBottom: '4px'
            })}
          >
            Validation Configuration
          </Typography>
          <MuiCheckbox
            sx={{
              marginTop: "auto",
              marginBottom: "10px",
            }}
            className="ml-1"
            id="validateentry"
            checkedvalue="validateentry"
            name={validateEntry.name}
            label={validateEntry.label}
          />
          {validation_required && (
            <>
              <MuiTextField
                sx={{
                  marginTop: "auto",
                  marginBottom: "10px",
                }}
                name={minimumValue.name}
                label={minimumValue.label}
                type="text"
                maxLength="30"
                onKeyPress={decimalKeyPressDown}
                formGroupClassName="m-1"
              />
              <MuiTextField
                sx={{
                  marginTop: "auto",
                  marginBottom: "10px",
                }}
                name={maximumValue.name}
                label={maximumValue.label}
                type="text"
                maxLength="30"
                onKeyPress={decimalKeyPressDown}
                formGroupClassName="m-1"
              />
              <MuiTextField
                sx={{
                  marginTop: "auto",
                  marginBottom: "10px",
                }}
                name={validationErrMsg.name}
                label={validationErrMsg.label}
                type="text"
                maxLength="30"
                formGroupClassName="m-1"
              />
            </>
          )}
        </Box>
      </Box>
      <Box sx={{ display: 'flex', gap: '3%' }}>
        <Box sx={{ width: '50%' }}>
          <Typography
            sx={AddThemeColor({
              font: "normal normal medium 20px/24px Suisse Intl",
              letterSpacing: "0.7px",
              fontWeight: 500,
              marginBottom: "10px",
              paddingBottom: '4px'
            })}
          >
            Analytics Configuration
          </Typography>
          <MuiAutoComplete
            sx={{
              marginTop: "auto",
              marginBottom: "10px",
            }}
            name={conditionValue.name}
            label={conditionValue.label}
            formGroupClassName="m-1"
            open={conditionOpen}
            size="small"
            onOpen={() => {
              setConditionOpen(true);
            }}
            onClose={() => {
              setConditionOpen(false);
            }}
            disableClearable
            oldvalue={getConditionLabel(condition)}
            value={condition && condition.label ? condition.label : getConditionLabel(condition)}
            getOptionSelected={(option, values) => option.label === values.label}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
            options={assetActionData.conditionList}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label={conditionValue.label}
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
          {(condition) && (condition.value === 'Delta' || condition === 'Delta') && (
            <>
              <Typography
                sx={AddThemeColor({
                  font: "normal normal medium 20px/24px Suisse Intl",
                  letterSpacing: "0.7px",
                  fontWeight: 500,
                  marginBottom: "10px",
                  paddingBottom: '4px'
                })}
              >
                Delta
              </Typography>
              <MuiAutoComplete
                sx={{
                  marginTop: "auto",
                  marginBottom: "10px",
                }}
                name={aggregateTimePeriod.name}
                label={aggregateTimePeriod.label}
                formGroupClassName="m-1"
                open={timePeriodOpen}
                size="small"
                onOpen={() => {
                  setTimePeriodOpen(true);
                }}
                onClose={() => {
                  setTimePeriodOpen(false);
                }}
                disableClearable
                oldvalue={getTimePeriodLabel(aggregate_timeperiod)}
                value={aggregate_timeperiod && aggregate_timeperiod.label ? aggregate_timeperiod.label : getTimePeriodLabel(aggregate_timeperiod)}
                getOptionSelected={(option, values) => option.label === values.label}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                options={assetActionData.aggregateTimePeriodList}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    label={aggregateTimePeriod.label}
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
            </>
          )}
          {(condition) && (condition.value === 'Run Hour' || condition === 'Run Hour') && (
            <>
              <Typography
                sx={AddThemeColor({
                  font: "normal normal medium 20px/24px Suisse Intl",
                  letterSpacing: "0.7px",
                  fontWeight: 500,
                  marginBottom: "10px",
                  paddingBottom: '4px'
                })}
              >
                Run Hour
              </Typography>
              <MuiTextField
                sx={{
                  marginTop: "auto",
                  marginBottom: "10px",
                }}
                name={thresholdValue.name}
                label={thresholdValue.label}
                type="text"
                maxLength="30"
                onKeyPress={decimalKeyPressDown}
                formGroupClassName="m-1"
              />
              <MuiAutoComplete
                sx={{
                  marginTop: "auto",
                  marginBottom: "10px",
                }}
                name={recurrentValue.name}
                label={recurrentValue.label}
                formGroupClassName="m-1"
                open={recurrentOpen}
                size="small"
                onOpen={() => {
                  setRecurrentOpen(true);
                }}
                onClose={() => {
                  setRecurrentOpen(false);
                }}
                oldvalue={getRecurrenceLabel(recurrent)}
                value={recurrent && recurrent.label ? recurrent.label : getRecurrenceLabel(recurrent)}
                disableClearable
                getOptionSelected={(option, values) => option.label === values.label}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                options={assetActionData.recurrentList}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    label={recurrentValue.label}
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
              <MuiTextField
                sx={{
                  marginTop: "auto",
                  marginBottom: "10px",
                }}
                name={orderGeneratedOn.name}
                label={orderGeneratedOn.label}
                type="text"
                maxLength="30"
                onKeyPress={decimalKeyPressDown}
                formGroupClassName="m-1"
              />
              <MuiCheckbox
                sx={{
                  marginTop: "auto",
                  marginBottom: "10px",
                }}
                className="ml-1"
                name={propagateValue.name}
                label={propagateValue.label}
              />
            </>
          )}
          {(condition) && (condition.value === 'Threshold' || condition === 'Threshold') && (
            <>
              <Typography
                sx={AddThemeColor({
                  font: "normal normal medium 20px/24px Suisse Intl",
                  letterSpacing: "0.7px",
                  fontWeight: 500,
                  marginBottom: "10px",
                  paddingBottom: '4px'
                })}
              >
                Threshold
              </Typography>
              <MuiTextField
                sx={{
                  marginTop: "auto",
                  marginBottom: "10px",
                }}
                name={thresholdMin.name}
                label={thresholdMin.label}
                type="text"
                maxLength="30"
                onKeyPress={decimalKeyPressDown}
                formGroupClassName="m-1"
              />
              <MuiTextField
                sx={{
                  marginTop: "auto",
                  marginBottom: "10px",
                }}
                name={thresholdMax.name}
                label={thresholdMax.label}
                type="text"
                maxLength="30"
                onKeyPress={decimalKeyPressDown}
                formGroupClassName="m-1"
              />
            </>
          )}
        </Box>
        <Box sx={{ width: '50%' }}>
          <Typography
            sx={AddThemeColor({
              font: "normal normal medium 20px/24px Suisse Intl",
              letterSpacing: "0.7px",
              fontWeight: 500,
              marginBottom: "10px",
              paddingBottom: '4px'
            })}
          >
            Actions
          </Typography>
          <MuiAutoComplete
            sx={{
              marginTop: "auto",
              marginBottom: "10px",
            }}
            name={toDo.name}
            label={toDo.label}
            formGroupClassName="m-1"
            open={todoOpen}
            size="small"
            onOpen={() => {
              setTodoOpen(true);
            }}
            onClose={() => {
              setTodoOpen(false);
            }}
            disableClearable
            oldvalue={getTodoLabel(to_do)}
            value={to_do && to_do.label ? to_do.label : getTodoLabel(to_do)}
            getOptionSelected={(option, values) => option.label === values.label}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
            options={assetActionData.todoList}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label={toDo.label}
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
          {(to_do) && (to_do.value === 'Maintenance Order' || to_do === 'Maintenance Order') && (
            <>
              <Typography
                sx={AddThemeColor({
                  font: "normal normal medium 20px/24px Suisse Intl",
                  letterSpacing: "0.7px",
                  fontWeight: 500,
                  marginBottom: "10px",
                  paddingBottom: '4px'
                })}
              >
                Maintenance Order
              </Typography>
              <MuiAutoComplete
                sx={{
                  marginTop: "auto",
                  marginBottom: "10px",
                }}
                name={checkListId.name}
                label={checkListId.label}
                formGroupClassName="m-1"
                open={checklistOpen}
                size="small"
                onOpen={() => {
                  setChecklistOpen(true);
                  setChecklistKeyword('');
                }}
                onClose={() => {
                  setChecklistOpen(false);
                  setChecklistKeyword('');
                }}
                oldValue={getOldData(check_list_id)}
                value={check_list_id && check_list_id.name ? check_list_id.name : getOldData(check_list_id)}
                loading={checkList && checkList.loading}
                getOptionSelected={(option, values) => option.name === values.name}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                options={checklistOptions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    onChange={onChecklistKeywordChange}
                    variant="standard"
                    label={checkListId.label}
                    className={check_list_id && check_list_id.id ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                    placeholder="Search & Select"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {checkList && checkList.loading ? <CircularProgress color="inherit" size={20} /> : null}
                          <InputAdornment position="end">
                            {check_list_id && check_list_id.id && (
                              <IconButton onClick={() => {
                                setChecklistKeyword('');
                              }}
                              >
                                <IoCloseOutline size={22} fontSize="small" />
                              </IconButton>
                            )}
                            <IconButton>
                              <SearchIcon fontSize="small" />
                            </IconButton>
                          </InputAdornment>
                        </>
                      ),
                    }}
                  />
                )}
              />
              {(checkList && checkList.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(checkList)}</span></FormHelperText>)}
              <MuiAutoComplete
                sx={{
                  marginTop: "auto",
                  marginBottom: "10px",
                }}
                name={teamCategory.name}
                label={teamCategory.label}
                formGroupClassName="m-1"
                isRequired
                open={teamCategoryOpen}
                size="small"
                onOpen={() => {
                  setTeamCategoryOpen(true);
                  setTeamCategoryKeyword('');
                }}
                onClose={() => {
                  setTeamCategoryOpen(false);
                  setTeamCategoryKeyword('');
                }}
                oldValue={getOldData(team_category_id)}
                value={team_category_id && team_category_id.name ? team_category_id.name : getOldData(team_category_id)}
                loading={teamCategoryInfo && teamCategoryInfo.loading}
                getOptionSelected={(option, values) => option.name === values.name}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                options={teamCategoryOptions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    onChange={onTeamCategoryKeywordChange}
                    label={teamCategory.label}
                    variant="standard"
                    className={team_category_id && team_category_id.id ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                    placeholder="Search & Select"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {teamCategoryInfo && teamCategoryInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                          <InputAdornment position="end">
                            {team_category_id && team_category_id.id && (
                              <IconButton onClick={() => {
                                setTeamCategoryKeyword('');
                              }}
                              >
                                <IoCloseOutline size={22} fontSize="small" />
                              </IconButton>
                            )}
                            <IconButton>
                              <SearchIcon fontSize="small" />
                            </IconButton>
                          </InputAdornment>
                        </>
                      ),
                    }}
                  />
                )}
              />
              {(teamCategoryInfo && teamCategoryInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(teamCategoryInfo)}</span></FormHelperText>)}
              <MuiAutoComplete
                sx={{
                  marginTop: "auto",
                  marginBottom: "10px",
                }}
                name={mType.name}
                label={mType.label}
                formGroupClassName="m-1"
                open={mTypeOpen}
                size="small"
                onOpen={() => {
                  setMTypeOpen(true);
                }}
                onClose={() => {
                  setMTypeOpen(false);
                }}
                disableClearable
                oldvalue={getMaintainLabel(maintenance_type)}
                value={maintenance_type && maintenance_type.label ? maintenance_type.label : getMaintainLabel(maintenance_type)}
                getOptionSelected={(option, values) => option.label === values.label}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                options={assetActionData.mTypes}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    label={mType.label}
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
              <MuiCheckbox
                sx={{
                  marginTop: "auto",
                  marginBottom: "10px",
                }}
                className="ml-1"
                name={mroPropagate.name}
                label={mroPropagate.label}
              />
            </>
          )}
          {(to_do) && (to_do.value === 'Alarm' || to_do === 'Alarm') && (
            <>
              <Typography
                sx={AddThemeColor({
                  font: "normal normal medium 20px/24px Suisse Intl",
                  letterSpacing: "0.7px",
                  fontWeight: 500,
                  marginBottom: "10px",
                  paddingBottom: '4px'
                })}
              >
                Alarm
              </Typography>
              <MuiTextField
                sx={{
                  marginTop: "auto",
                  marginBottom: "10px",
                }}
                name={alarmName.name}
                label={alarmName.label}
                type="text"
                formGroupClassName="m-1"
              />
              <MuiAutoComplete
                sx={{
                  marginTop: "auto",
                  marginBottom: "10px",
                }}
                name={priorityValue.name}
                label={priorityValue.label}
                formGroupClassName="m-1"
                open={priorityOpen}
                size="small"
                onOpen={() => {
                  setPriorityOpen(true);
                }}
                onClose={() => {
                  setPriorityOpen(false);
                }}
                disableClearable
                oldvalue={getPriorityTypesLabel(priority)}
                value={priority && priority.label ? priority.label : getPriorityTypesLabel(priority)}
                getOptionSelected={(option, values) => option.label === values.label}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                options={assetActionData.priorityTypes}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    label={priorityValue.label}
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
              <MuiAutoComplete
                sx={{
                  marginTop: "auto",
                  marginBottom: "10px",
                }}
                name={categoryValue.name}
                label={categoryValue.label}
                formGroupClassName="m-1"
                open={alarmCategoryOpen}
                size="small"
                onOpen={() => {
                  setAlarmCategoryOpen(true);
                  setAlarmCategoryKeyword('');
                }}
                onClose={() => {
                  setAlarmCategoryOpen(false);
                  setAlarmCategoryKeyword('');
                }}
                oldValue={getOldData(category_id)}
                value={category_id && category_id.name ? category_id.name : getOldData(category_id)}
                loading={alarmCategoryInfo && alarmCategoryInfo.loading}
                getOptionSelected={(option, values) => option.name === values.name}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                options={alarmCategoryOptions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    onChange={onAlarmCategoryKeywordChange}
                    variant="standard"
                    label={categoryValue.label}
                    className={category_id && category_id.id ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                    placeholder="Search & Select"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {alarmCategoryInfo && alarmCategoryInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                          <InputAdornment position="end">
                            {category_id && category_id.id && (
                              <IconButton onClick={() => {
                                setAlarmCategoryKeyword('');
                              }}
                              >
                                <IoCloseOutline size={22} fontSize="small" />
                              </IconButton>
                            )}
                            <IconButton>
                              <SearchIcon fontSize="small" />
                            </IconButton>
                          </InputAdornment>
                        </>
                      ),
                    }}
                  />
                )}
              />
              {(alarmCategoryInfo && alarmCategoryInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(alarmCategoryInfo)}</span></FormHelperText>)}
              <MuiAutoComplete
                sx={{
                  marginTop: "auto",
                  marginBottom: "10px",
                }}
                name={alarmRecipient.name}
                label={alarmRecipient.label}
                formGroupClassName="m-1"
                open={alarmRecipientOpen}
                size="small"
                onOpen={() => {
                  setAlarmRecipientOpen(true);
                  setAlarmRecipientKeyword('');
                }}
                onClose={() => {
                  setAlarmRecipientOpen(false);
                  setAlarmRecipientKeyword('');
                }}
                oldValue={getOldData(alarm_recipients)}
                value={alarm_recipients && alarm_recipients.name ? alarm_recipients.name : getOldData(alarm_recipients)}
                loading={alarmRecipientsInfo && alarmRecipientsInfo.loading}
                getOptionSelected={(option, values) => option.name === values.name}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                options={alarmRecipientOptions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    onChange={onAlarmRecipientKeywordChange}
                    variant="standard"
                    label={alarmRecipient.label}
                    className={alarm_recipients && alarm_recipients.id ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                    placeholder="Search & Select"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {alarmRecipientsInfo && alarmRecipientsInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                          <InputAdornment position="end">
                            {alarm_recipients && alarm_recipients.id && (
                              <IconButton onClick={() => {
                                setAlarmRecipientKeyword('');
                              }}
                              >
                                <IoCloseOutline size={22} fontSize="small" />
                              </IconButton>
                            )}
                            <IconButton>
                              <SearchIcon fontSize="small" />
                            </IconButton>
                          </InputAdornment>
                        </>
                      ),
                    }}
                  />
                )}
              />
              {(alarmRecipientsInfo && alarmRecipientsInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(alarmRecipientsInfo)}</span></FormHelperText>)}
              <MuiCheckbox
                sx={{
                  marginTop: "auto",
                  marginBottom: "10px",
                }}
                className="ml-1"
                name={propagateAlarm.name}
                label={propagateAlarm.label}
              />
              <MuiTextField
                sx={{
                  marginTop: "auto",
                  marginBottom: "10px",
                }}
                name={notiyMessage.name}
                label={notiyMessage.label}
                type="text"
                formGroupClassName="m-1"
              />
              <MuiTextField
                sx={{
                  marginTop: "auto",
                  marginBottom: "10px",
                }}
                name={descriptionValue.name}
                label={descriptionValue.label}
                type="textarea"
                formGroupClassName="m-1"
              />
              <MuiAutoComplete
                sx={{
                  marginTop: "auto",
                  marginBottom: "10px",
                }}
                name={alarmAction.name}
                label={alarmAction.label}
                formGroupClassName="m-1"
                open={alarmActionOpen}
                size="small"
                onOpen={() => {
                  setAlarmActionOpen(true);
                  setAlarmActionKeyword('');
                }}
                onClose={() => {
                  setAlarmActionOpen(false);
                  setAlarmActionKeyword('');
                }}
                oldValue={getOldData(alarm_actions)}
                value={alarm_actions && alarm_actions.name ? alarm_actions.name : getOldData(alarm_actions)}
                loading={alarmActionsInfo && alarmActionsInfo.loading}
                getOptionSelected={(option, values) => option.name === values.name}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                options={alarmActionOptions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    onChange={onAlarmActionKeywordChange}
                    variant="standard"
                    label={alarmAction.label}
                    className={alarm_actions && alarm_actions.id ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                    placeholder="Search & Select"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {alarmActionsInfo && alarmActionsInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                          <InputAdornment position="end">
                            {alarm_actions && alarm_actions.id && (
                              <IconButton onClick={() => {
                                setAlarmActionKeyword('');
                              }}
                              >
                                <IoCloseOutline size={22} fontSize="small" />
                              </IconButton>
                            )}
                            <IconButton>
                              <SearchIcon fontSize="small" />
                            </IconButton>
                          </InputAdornment>
                        </>
                      ),
                    }}
                  />
                )}
              />
              {(alarmActionsInfo && alarmActionsInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(alarmActionsInfo)}</span></FormHelperText>)}
              <MuiTextField
                sx={{
                  marginTop: "auto",
                  marginBottom: "10px",
                }}
                name={fontAwesomeIcon.name}
                label={fontAwesomeIcon.label}
                type="text"
                formGroupClassName="m-1"
                onKeyPress={lettersOnly}
              />
              <MuiTextField
                sx={{
                  marginTop: "auto",
                  marginBottom: "10px",
                }}
                name={ttlMinute.name}
                label={ttlMinute.label}
                type="text"
                onKeyPress={integerKeyPress}
                maxLength="15"
                formGroupClassName="m-1"
              />
            </>
          )}
          {(to_do) && (to_do.value === 'Reading Logs' || to_do === 'Reading Logs') && (
            <>
              <Typography
                sx={AddThemeColor({
                  font: "normal normal medium 20px/24px Suisse Intl",
                  letterSpacing: "0.7px",
                  fontWeight: 500,
                  marginBottom: "10px",
                  paddingBottom: '4px'
                })}
              >
                Reading Logs
              </Typography>
              <MuiDateTimeField
                sx={{
                  marginTop: "auto",
                  marginBottom: "10px",
                }}
                name={measuredOn.name}
                label={measuredOn.label}
                setFieldValue={setFieldValue}
                setFieldTouched={setFieldTouched}
                placeholder={measuredOn.label}
                disablePastDate
                isRequired={measuredOn.required}
                className="ml-1 w-100"
                defaultValue={date ? new Date(getDateTimeSeconds(date)) : ''}
              />
              <MuiTextField
                sx={{
                  marginTop: "auto",
                  marginBottom: "10px",
                }}
                name={measureValue.name}
                label={measureValue.label}
                isRequired
                type="text"
                maxLength="30"
                onKeyPress={decimalKeyPressDown}
                formGroupClassName="m-1"
              />
              <MuiAutoComplete
                sx={{
                  marginTop: "auto",
                  marginBottom: "10px",
                }}
                name={measureId.name}
                label={measureId.label}
                formGroupClassName="m-1"
                open={measureReadingOpen}
                size="small"
                onOpen={() => {
                  setMeasureReadingOpen(true);
                  setMeasureReadingKeyword('');
                }}
                onClose={() => {
                  setMeasureReadingOpen(false);
                  setMeasureReadingKeyword('');
                }}
                oldValue={getOldData(measure_id)}
                disabled={((measure_id && measure_id.length > 0) || (measure_id && measure_id.id))}
                value={measure_id && measure_id.display_name ? measure_id.display_name : getOldData(measure_id)}
                loading={readingsList && readingsList.loading}
                getOptionSelected={(option, values) => option.display_name === values.display_name}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.display_name)}
                options={readingOptions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    onChange={onMeasureReadingKeywordChange}
                    label={measureId.label}
                    variant="standard"
                    className={measure_id && measure_id.id ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                    placeholder="Search & Select"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {readingsList && readingsList.loading ? <CircularProgress color="inherit" size={20} /> : null}
                          <InputAdornment position="end">
                            {measure_id && measure_id.id && (
                              <IconButton onClick={() => {
                                setMeasureReadingKeyword('');
                              }}
                              >
                                <IoCloseOutline size={22} fontSize="small" />
                              </IconButton>
                            )}
                            <IconButton>
                              <SearchIcon fontSize="small" />
                            </IconButton>
                          </InputAdornment>
                        </>
                      ),
                    }}
                  />
                )}
              />
              {(readingsList && readingsList.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(readingsList)}</span></FormHelperText>)}
              <MuiAutoComplete
                sx={{
                  marginTop: "auto",
                  marginBottom: "10px",
                }}
                name={equipmentId.name}
                label={equipmentId.label}
                formGroupClassName="m-1"
                open={equipmentOpen}
                size="small"
                onOpen={() => {
                  setEquipmentOpen(true);
                  setEquipmentKeyword('');
                }}
                onClose={() => {
                  setEquipmentOpen(false);
                  setEquipmentKeyword('');
                }}
                disabled={equipmentsDetails && equipmentsDetails.data && equipmentsDetails.data.length > 0}
                oldValue={getOldData(log_equipment_id)}
                value={log_equipment_id && log_equipment_id.name ? log_equipment_id.name : getOldData(log_equipment_id)}
                loading={equipmentInfo && equipmentInfo.loading}
                getOptionSelected={(option, values) => option.name === values.name}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                options={equipmentOptions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    onChange={onAlarmActionKeywordChange}
                    variant="standard"
                    label={equipmentId.label}
                    className={log_equipment_id && log_equipment_id.id ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                    placeholder="Search & Select"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {equipmentInfo && equipmentInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                          <InputAdornment position="end">
                            {log_equipment_id && log_equipment_id.id && (
                              <IconButton onClick={() => {
                                setEquipmentKeyword('');
                              }}
                              >
                                <IoCloseOutline size={22} fontSize="small" />
                              </IconButton>
                            )}
                            <IconButton>
                              <SearchIcon fontSize="small" />
                            </IconButton>
                          </InputAdornment>
                        </>
                      ),
                    }}
                  />
                )}
              />
              {(equipmentInfo && equipmentInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(equipmentInfo)}</span></FormHelperText>)}
            </>
          )}
        </Box>
      </Box>
      <Dialog size="xl" fullWidth open={extraMultipleModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraMultipleModal(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <SearchModalMultiple
              modelName={modelValue}
              afterReset={() => { setExtraMultipleModal(false); }}
              fieldName={fieldName}
              fieldNameOne={fieldNameOne}
              fieldNameTwo={fieldNameTwo}
              fields={columns}
              company={companyValue}
              otherFieldName={otherFieldName}
              otherFieldValue={otherFieldValue}
              setFieldValue={setFieldValue}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
};

ReadingForm.propTypes = {
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
  editId: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
    PropTypes.bool,
  ]).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  setFieldTouched: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default ReadingForm;
