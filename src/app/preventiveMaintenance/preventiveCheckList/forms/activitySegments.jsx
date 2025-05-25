/* eslint-disable max-len */
/* eslint-disable no-nested-ternary */
/* eslint-disable camelcase */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import {
  Col,
  Row,
  Input,
} from 'reactstrap';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import { Tabs } from 'antd';
import {
  TextField, CircularProgress, FormHelperText, FormControl,
} from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { useFormikContext } from 'formik';
import { Box } from '@mui/system';
import {
  Typography,
  Button,
  Dialog, DialogContent, DialogContentText, DialogActions,
} from '@mui/material';
import { IoCloseOutline } from 'react-icons/io5';
import closeIcon from '@images/icons/circleClose.svg';
import {
  getQuestionGroup, getChoiceOptions, getSmartLogger, getConditionQuestion, getOptions,
} from '../../ppmService';
import preventiveActions from '../../data/preventiveActions.json';
import {
  decimalKeyPress, generateErrorMessage,
  getAllowedCompanies, getArrayFromValuesById, isArrayColumnExists, getColumnArrayById,
} from '../../../util/appUtils';
import SearchModalMultiple from './searchModalMultiple';
import { AddThemeColor } from '../../../themes/theme';
import MuiAutoComplete from '../../../commonComponents/formFields/muiAutocomplete';
import MuiTextField from '../../../commonComponents/formFields/muiTextField';
import MuiCheckboxField from '../../../commonComponents/formFields/muiCheckbox';
import DialogHeader from '../../../commonComponents/dialogHeader';

const appModels = require('../../../util/appModels').default;

const useStyles = makeStyles((themeStyle) => ({
  margin: {
    marginBottom: themeStyle.spacing(1.25),
    width: '100%',
  },
}));

const { TabPane } = Tabs;
const ActivitySegments = (props) => {
  const {
    formField: {
      questionTitle,
      questionType,
      questionGroup,
      mandatoryAnswer,
      mandatoryPhoto,
      expected,
      multipleLine,
      expectedSuggest,
      errorMessage,
      validateEntry,
      expectedMax,
      expectedMin,
      expectedType,
      commentsField,
      hasAttachment,
      smartLogger,
      inspectionMethod,
      requiresAction,
      feedback,
      requiresVerification,
      preventiveAction,
      correctiveAction,
      isResolution,
      enableCondition,
      conditionQuestion,
      optionId,
    },
    setFieldValue,
    editId,
    editData,
  } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const { values: formValues } = useFormikContext();
  const {
    type, constr_mandatory, mro_quest_grp_id, reading_id, requires_action, requires_verification, is_enable_condition, parent_id, based_on_ids, labels_ids,
  } = formValues;
  const [qTypeOpen, setQtypeOpen] = useState(false);
  const [qtype, setQtype] = useState(false);
  const [currentTab, setActive] = useState('Basic');
  const [questionKeyword, setQuestionKeyword] = useState('');
  const [smartLoggerKeyword, setSmartLoggerKeyword] = useState('');
  const [questionOpen, setQuestionOpen] = useState(false);
  const [smartLoggerOpen, setSmartLoggerOpen] = useState(false);
  const [choiceData, setChoiceData] = useState([]);
  const [choiceAdd, setChoiceAdd] = useState('');
  const [constMandatory, setConstMandatory] = useState(false);
  const [reqVerification, setReqVerification] = useState(false);
  const [enableConditions, setEnableCondition] = useState(false);

  const [conditionQuestionOpen, setConditionQuestionOpen] = useState(false);
  const [conditionQuestionKeyword, setConditionQuestionKeyword] = useState(false);

  const [optionOpen, setOptionOpen] = useState(false);
  const [optionKeyword, setOptionKeyword] = useState(false);

  const [inspectionOpen, setInspectionOpen] = useState(false);
  const [requiresOpen, setRequiresOpen] = useState(false);

  const [basedOnIds, setBasedOnIds] = useState([]);
  const [optionIds, setOptionIds] = useState([]);
  const [checkedRows, setCheckRows] = useState([]);

  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [columns, setColumns] = useState(['display_name']);
  const [extraModal, setExtraModal] = useState(false);
  const [extraMultipleModal, setExtraMultipleModal] = useState(false);

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const {
    questionGroupInfo, choiceOptionInfo, smartLoggerInfo, conditionQuestionGroupInfo, optionInfo,
  } = useSelector((state) => state.ppm);

  const changeTab = (key) => {
    setActive(key);
  };

  useEffect(() => {
    if (type && type.value) {
      setQtype(type.value);
    } else if (type) {
      setQtype(type);
    }
  }, [type]);

  useEffect(() => {
    if (editData && editData.labels_ids && editData.labels_ids.length > 0) {
      if (editData.labels_ids[0].value) {
        setChoiceData(editData.labels_ids);
      } else {
        const ids = (getColumnArrayById(editData.labels_ids, 'id'));
        dispatch(getChoiceOptions(appModels.ACTIVITYLINES, ids));
      }
    } else {
      setChoiceData([]);
    }
  }, [editId]);

  useEffect(() => {
    if (choiceOptionInfo && choiceOptionInfo.data && choiceOptionInfo.data.length) {
      setChoiceData(choiceOptionInfo.data);
      setChoiceAdd(Math.random());
    }
  }, [choiceOptionInfo]);

  useEffect(() => {
    setConstMandatory(constr_mandatory);
  }, [constr_mandatory]);

  useEffect(() => {
    setReqVerification(requires_verification);
  }, [requires_verification]);

  useEffect(() => {
    setEnableCondition(is_enable_condition);
  }, [is_enable_condition]);

  useEffect(() => {
    if (choiceAdd) {
      setChoiceData(choiceData);
      setFieldValue('labels_ids', choiceData);
    }
  }, [choiceAdd]);

  useEffect(() => {
    (async () => {
      if (userInfo.data && questionOpen) {
        await dispatch(getQuestionGroup(companies, appModels.QUESTIONGROUP, questionKeyword));
      }
    })();
  }, [questionOpen, questionKeyword]);

  useEffect(() => {
    (async () => {
      if (userInfo.data && conditionQuestionOpen) {
        await dispatch(getConditionQuestion(companies, appModels.ACTIVITY, conditionQuestionKeyword));
      }
    })();
  }, [conditionQuestionOpen, conditionQuestionKeyword]);

  useEffect(() => {
    (async () => {
      if (userInfo.data && optionOpen) {
        await dispatch(getOptions(companies, appModels.ACTIVITYLINES, optionKeyword));
      }
    })();
  }, [optionOpen, optionKeyword]);

  useEffect(() => {
    (async () => {
      if (userInfo.data && smartLoggerOpen) {
        await dispatch(getSmartLogger(companies, appModels.SMARTLOGGER, smartLoggerKeyword));
      }
    })();
  }, [smartLoggerOpen, smartLoggerKeyword]);

  const onQuestionKeywordChange = (event) => {
    setQuestionKeyword(event.target.value);
  };

  const onConditionQuestionKeywordChange = (event) => {
    setConditionQuestionKeyword(event.target.value);
  };

  const onOptionKeywardChange = (event) => {
    setOptionKeyword(event.target.value);
  };

  const onSmartKeywordChange = (event) => {
    setSmartLoggerKeyword(event.target.value);
  };

  let questionOptions = [];

  if (questionGroupInfo && questionGroupInfo.loading) {
    questionOptions = [{ name: 'Loading..' }];
  }
  if (mro_quest_grp_id && mro_quest_grp_id.length && mro_quest_grp_id.length > 0) {
    const oldId = [{ id: mro_quest_grp_id.id, name: mro_quest_grp_id.name }];
    const newArr = [...questionOptions, ...oldId];
    questionOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  if (questionGroupInfo && questionGroupInfo.data) {
    questionOptions = questionGroupInfo.data;
  }
  if (questionGroupInfo && questionGroupInfo.err) {
    questionOptions = [];
  }

  let conditionQuestionOptions = [];

  if (conditionQuestionGroupInfo && conditionQuestionGroupInfo.loading) {
    conditionQuestionOptions = [{ name: 'Loading..' }];
  }
  if (parent_id && parent_id.length && parent_id.length > 0) {
    const oldId = [{ id: parent_id.id, name: parent_id.name }];
    const newArr = [...conditionQuestionOptions, ...oldId];
    conditionQuestionOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  if (conditionQuestionGroupInfo && conditionQuestionGroupInfo.data) {
    conditionQuestionOptions = conditionQuestionGroupInfo.data;
  }
  if (conditionQuestionGroupInfo && conditionQuestionGroupInfo.err) {
    conditionQuestionOptions = [];
  }

  let optionsList = [];

  if (optionInfo && optionInfo.loading) {
    optionsList = [{ display_name: 'Loading..' }];
  }
  if (based_on_ids && based_on_ids.length && based_on_ids.length > 0) {
    const oldId = [{ id: based_on_ids.id, display_name: based_on_ids.display_name }];
    const newArr = [...optionsList, ...oldId];
    optionsList = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  if (optionInfo && optionInfo.data) {
    optionsList = optionInfo.data;
  }
  if (optionInfo && optionInfo.err) {
    optionsList = [];
  }

  let smartLoggerOption = [];

  if (smartLoggerInfo && smartLoggerInfo.loading) {
    smartLoggerOption = [{ name: 'Loading..' }];
  }
  if (reading_id && reading_id.length && reading_id.length > 0) {
    const oldId = [{ id: reading_id.id, name: reading_id.name }];
    const newArr = [...smartLoggerOption, ...oldId];
    smartLoggerOption = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  if (smartLoggerInfo && smartLoggerInfo.data) {
    smartLoggerOption = smartLoggerInfo.data;
  }
  if (smartLoggerInfo && smartLoggerInfo.err) {
    smartLoggerOption = [];
  }

  const loadEmptyTd = () => {
    const newData = { value: '' };
    setChoiceData((data) => [...data, newData]);
    setChoiceAdd(Math.random());
  };

  const removeData = (e, index) => {
    const checkData = choiceData;
    const indexRemove = checkData.indexOf(checkData[index]);
    const { id } = checkData[indexRemove];
    if (id) {
      checkData[indexRemove].isRemove = true;
      setChoiceData(checkData);
      setChoiceAdd(Math.random());
    } else {
      checkData.splice(indexRemove, 1);
      setChoiceData(checkData);
      setChoiceAdd(Math.random());
    }
  };

  useEffect(() => {
    if (editId) {
      setBasedOnIds(based_on_ids);
    }
  }, [editId]);

  useEffect(() => {
    if (basedOnIds) {
      setFieldValue('based_on_ids', basedOnIds);
    }
  }, [basedOnIds]);

  const handleOption = (options) => {
    if (options && options.length && options.find((option) => option.display_name === 'Loading...')) {
      return false;
    }
    setBasedOnIds(options);
    setCheckRows(options);
  };

  function isAssociativeArray(arr) {
    let result = arr;
    if (isArrayColumnExists(arr, 'id')) {
      result = getColumnArrayById(arr, 'id');
    }
    return result;
  }

  useEffect(() => {
    if (optionInfo && optionInfo.data && optionInfo.data.length && optionOpen) {
      setOptionIds(getArrayFromValuesById(optionInfo.data, isAssociativeArray(basedOnIds || []), 'id'));
    } else if (optionInfo && optionInfo.loading) {
      setOptionIds([{ display_name: 'Loading...' }]);
    } else {
      setOptionIds([]);
    }
  }, [optionInfo, optionOpen]);

  const onOptionKeywordClear = () => {
    setOptionKeyword(null);
    setBasedOnIds([]);
    setCheckRows([]);
    setOptionOpen(false);
  };

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData.name : '';
  }

  const onChangeChoice = (e, index) => {
    const newData = choiceData;
    newData[index].value = e.target.value;
    setChoiceData(newData);
    setChoiceAdd(Math.random());
  };

  const showOptionModal = () => {
    setModelValue(appModels.ACTIVITYLINES);
    setFieldName('based_on_ids');
    setModalName('Option List');
    setColumns(['display_name']);
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraMultipleModal(true);
  };

  const oldGroupId = mro_quest_grp_id && mro_quest_grp_id.length && mro_quest_grp_id.length > 0 ? mro_quest_grp_id.name : '';
  const oldQuestion = parent_id && parent_id.length && parent_id.length > 0 ? parent_id.name : '';
  const oldSmartId = reading_id && reading_id.length && reading_id.length > 0 ? reading_id.name : '';
  const oldOption = based_on_ids && based_on_ids.length && based_on_ids.length > 0 ? based_on_ids.display_name : '';
  const oldQtype = type && preventiveActions && preventiveActions.questionTypesText && preventiveActions.questionTypesText[type] ? preventiveActions.questionTypesText[type].label : '';
  const oldReqAction = type && preventiveActions && preventiveActions.requiresActionText && preventiveActions.requiresActionText[requires_action] ? preventiveActions.requiresActionText[requires_action].label : '';

  return (
    <>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          gap: '20px',
        }}
      >
        <Box
          sx={{
            width: '50%',
          }}
        >
          <Typography
            sx={AddThemeColor({
              font: 'normal normal medium 20px/24px Suisse Intl',
              letterSpacing: '0.7px',
              fontWeight: 500,
              marginBottom: '10px',
              paddingBottom: '4px',
            })}
          >
            Basic
          </Typography>
          <MuiTextField
            sx={{
              marginTop: 'auto',
              marginBottom: '10px',
            }}
            name={questionTitle.name}
            placeholder="Enter Question"
            label={questionTitle.label}
            isRequired
            type="text"
            inputProps={{ maxLength: 150 }}
          />
          <MuiAutoComplete
            sx={{
              marginTop: 'auto',
              marginBottom: '10px',
            }}
            name={questionType.name}
            label={questionType.label}
            className="bg-white"
            open={qTypeOpen}
            size="small"
            oldValue={oldQtype}
            isRequired
            value={type && type.label ? type.label : oldQtype}
            onOpen={() => {
              setQtypeOpen(true);
            }}
            onClose={() => {
              setQtypeOpen(false);
            }}
            getOptionSelected={(option, value) => option.label === value.label}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
            options={preventiveActions.questionTypes}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label={(
                  <>
                    {questionType.label}
                    <span className="text-danger font-weight-800 ml-1">*</span>
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
          <MuiAutoComplete
            sx={{
              marginTop: 'auto',
              marginBottom: '10px',
            }}
            name={questionGroup.name}
            label={questionGroup.label}
            className="bg-white"
            open={questionOpen}
            size="small"
            oldValue={oldGroupId}
            value={mro_quest_grp_id && mro_quest_grp_id.name ? mro_quest_grp_id.name : oldGroupId}
            onOpen={() => {
              setQuestionOpen(true);
            }}
            onClose={() => {
              setQuestionOpen(false);
            }}
            loading={questionGroupInfo && questionGroupInfo.loading}
            getOptionSelected={(option, value) => (value.length > 0 ? option.name === value.name : '')}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={questionOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                label={questionGroup.label}
                onChange={onQuestionKeywordChange}
                variant="standard"
                className="without-padding"
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {questionGroupInfo && questionGroupInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
          {questionOpen && (questionGroupInfo && questionGroupInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(questionGroupInfo)}</span></FormHelperText>)}

          {qtype === 'smart_logger'
            ? (
              <Col xs={12} sm={5} md={5} lg={5}>
                <MuiAutoComplete
                  sx={{
                    marginTop: 'auto',
                    marginBottom: '10px',
                  }}
                  name={smartLogger.name}
                  label={smartLogger.label}
                  className="bg-white"
                  open={smartLoggerOpen}
                  size="small"
                  oldValue={oldSmartId}
                  value={reading_id && reading_id.name ? reading_id.name : oldSmartId}
                  onOpen={() => {
                    setSmartLoggerOpen(true);
                  }}
                  onClose={() => {
                    setSmartLoggerOpen(false);
                  }}
                  loading={smartLoggerInfo && smartLoggerInfo.loading}
                  getOptionSelected={(option, value) => (value.length > 0 ? option.name === value.name : '')}
                  getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                  options={smartLoggerOption}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      onChange={onSmartKeywordChange}
                      variant="standard"
                      className="without-padding"
                      placeholder="Search & Select"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {smartLoggerInfo && smartLoggerInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                />
                {(smartLoggerInfo && smartLoggerInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(smartLoggerInfo)}</span></FormHelperText>)}
              </Col>
            ) : ''}
          {qtype !== 'simple_choice' ? ''
            : (
              <Row>
                <Col xs={12} sm={6} md={6} lg={6}>
                  <>
                    <span className="font-weight-600 d-inline-block mb-1">Answers</span>
                    <br />
                    <Button
                      size="sm"
                      variant="contained"
                      onClick={loadEmptyTd}
                    >
                      Add a Line
                    </Button>
                    <br />
                    <br />
                    {(choiceData.map((cl, index) => (
                      <React.Fragment key={index}>
                        {!cl.isRemove && (
                          <Row>
                            <Col xs={10} sm={10} md={10} lg={10}>
                              <Input name="choices" value={cl.value} onChange={(e) => onChangeChoice(e, index)} type="text" />
                            </Col>
                            <Col xs={1} sm={1} md={1} lg={1}>
                              <img
                                src={closeIcon}
                                className="mr-2 mt-2 cursor-pointer"
                                alt="addequipment"
                                height="15"
                                aria-hidden="true"
                                onClick={(e) => { removeData(e, index); }}
                                width="15"
                              />
                            </Col>
                          </Row>
                        )}
                        <br />
                      </React.Fragment>
                    )))}
                  </>
                </Col>
                <Col xs={12} sm={6} md={6} lg={6}>
                  <MuiTextField
                    sx={{
                      marginTop: 'auto',
                      marginBottom: '10px',
                    }}
                    name={expectedSuggest.name}
                    onKeyPress={decimalKeyPress}
                    label={expectedSuggest.label}
                    type="text"
                    inputProps={{ maxLength: 150 }}
                  />
                </Col>
              </Row>
            )}
          <MuiAutoComplete
            sx={{
              marginTop: 'auto',
              marginBottom: '10px',
            }}
            name={inspectionMethod.name}
            label={inspectionMethod.label}
            formGroupClassName="m-1"
            open={inspectionOpen}
            size="small"
            onOpen={() => {
              setInspectionOpen(true);
            }}
            onClose={() => {
              setInspectionOpen(false);
            }}
            disableClearable
            getOptionSelected={(option, value) => option.label === value.label}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
            options={preventiveActions.inspectionMethod}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label={inspectionMethod.label}
                className="without-padding"
                placeholder="Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    params.InputProps.endAdornment
                  ),
                }}
              />
            )}
          />
        </Box>
        <Box
          sx={{
            width: '50%',
          }}
        >
          <Typography
            sx={AddThemeColor({
              font: 'normal normal medium 20px/24px Suisse Intl',
              letterSpacing: '0.7px',
              fontWeight: 500,
              marginBottom: '10px',
              paddingBottom: '4px',
            })}
          >
            Options
          </Typography>
          <span className="font-weight-600">Constraints</span>
          <br />
          <MuiCheckboxField
            sx={{
              marginTop: 'auto',
              marginBottom: '10px',
            }}
            name={mandatoryAnswer.name}
            label={mandatoryAnswer.label}
          />
          {constMandatory
            ? (
              <MuiTextField
                sx={{
                  marginTop: 'auto',
                  marginBottom: '10px',
                }}
                name={errorMessage.name}
                label={errorMessage.label}
                type="text"
                inputProps={{ maxLength: 150 }}
              />
            ) : ''}
          {' '}
          <br />
          {qtype.toString() === 'numerical_box' || qtype.toString() === 'date'
            ? (
              <MuiCheckboxField
                sx={{
                  marginTop: 'auto',
                  marginBottom: '10px',
                }}
                name={validateEntry.name}
                label={validateEntry.label}
              />
            ) : ''}
          {qtype !== 'simple_choice'
            ? (
              <MuiCheckboxField
                sx={{
                  marginTop: 'auto',
                  marginBottom: '10px',
                }}
                name={mandatoryPhoto.name}
                label={mandatoryPhoto.label}
              />
            ) : ''}
          <br />
          <span className="font-weight-600 mb-3">Actions</span>
          {' '}
          <MuiTextField
            sx={{
              marginTop: '20px',
              marginBottom: '10px',
            }}
            name={preventiveAction.name}
            label={preventiveAction.label}
            inputProps={{ maxLength: 150 }}
            type="text"
          />
          <MuiTextField
            sx={{
              marginTop: 'auto',
              marginBottom: '10px',
            }}
            name={correctiveAction.name}
            label={correctiveAction.label}
            inputProps={{ maxLength: 150 }}
            type="text"
          />
          <MuiCheckboxField
            sx={{
              marginTop: 'auto',
              marginBottom: '10px',
            }}
            name={isResolution.name}
            label={isResolution.label}
          />
          <MuiCheckboxField
            sx={{
              marginTop: 'auto',
              marginBottom: '10px',
            }}
            name={hasAttachment.name}
            label={hasAttachment.label}
          />

          <MuiCheckboxField
            sx={{
              marginTop: 'auto',
              marginBottom: '10px',
            }}
            name={requiresVerification.name}
            label={requiresVerification.label}
          />
          {reqVerification
            ? (qtype.toString() === 'textbox'
              ? (
                <>
                  <MuiTextField
                    sx={{
                      marginTop: 'auto',
                      marginBottom: '10px',
                    }}
                    name={expected.name}
                    label={expected.label}
                    inputProps={{ maxLength: 150 }}
                    type="text"
                  />
                  <MuiCheckboxField
                    sx={{
                      marginTop: 'auto',
                      marginBottom: '10px',
                    }}
                    name={multipleLine.name}
                    label={multipleLine.label}
                  />
                </>
              )
              : (qtype.toString() === 'numerical_box'
                ? (
                  <>
                    <br />
                    <span className="font-weight-600">Expected Answer</span>
                    <br />
                    <div className="d-flex">
                      <div className="mr-2 mt-4 pt-1">Between</div>
                      <MuiTextField
                        sx={{
                          marginTop: 'auto',
                          marginBottom: '10px',
                        }}
                        label=""
                        name={expectedMin.name}
                        onKeyPress={decimalKeyPress}
                        inputProps={{ maxLength: 150 }}
                        type="text"
                      />
                      <div className="mr-2 mt-4 pt-1">AND</div>
                      <MuiTextField
                        sx={{
                          marginTop: 'auto',
                          marginBottom: '10px',
                        }}
                        label=""
                        name={expectedMax.name}
                        onKeyPress={decimalKeyPress}
                        inputProps={{ maxLength: 150 }}
                        type="text"
                      />
                    </div>
                  </>
                )
                : (qtype.toString() === 'boolean'
                  ? (
                    <>
                      <br />
                      <span className="font-weight-600">Expected Answer</span>
                      <br />
                      <MuiCheckboxField
                        sx={{
                          marginTop: 'auto',
                          marginBottom: '10px',
                        }}
                        name={expectedType.name}
                        label={expectedType.label}
                      />
                    </>
                  )
                  : (qtype.toString() === 'simple_choice'
                    ? (
                      <>
                        <br />
                        <span className="font-weight-600">Allow Comments</span>
                        <br />
                        <MuiCheckboxField
                          sx={{
                            marginTop: 'auto',
                            marginBottom: '10px',
                          }}
                          name={commentsField.name}
                          label={commentsField.label}
                        />
                        <br />
                      </>
                    )
                    : ''))))
            : ''}
          {reqVerification
            ? (
              <>
                {qtype === 'date' || qtype === 'smart_logger' || qtype === 'simple_choice' || qtype === 'multiple_choice'
                  ? (
                    <div>
                      <span className="font-weight-600 mb-3">Expected Answer</span>
                    </div>
                  ) : ''}
                <br />
                <MuiAutoComplete
                  sx={{
                    marginTop: 'auto',
                    marginBottom: '10px',
                  }}
                  name={requiresAction.name}
                  label={requiresAction.label}
                  className="bg-white mt-2"
                  open={requiresOpen}
                  size="small"
                  oldValue={oldReqAction}
                  value={type && requires_action.label ? requires_action.label : oldReqAction}
                  onOpen={() => {
                    setRequiresOpen(true);
                  }}
                  onClose={() => {
                    setRequiresOpen(false);
                  }}
                  getOptionSelected={(option, value) => option.label === value.label}
                  getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                  options={preventiveActions.requiresAction}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      label={requiresAction.label}
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
                    marginTop: 'auto',
                    marginBottom: '10px',
                  }}
                  name={feedback.name}
                  label={feedback.label}
                  type="text"
                />
                <br />
              </>
            )
            : ''}
          <div>
            <span className="font-weight-600 mb-3">Condition Based Question</span>
          </div>
          <MuiCheckboxField
            sx={{
              marginTop: 'auto',
              marginBottom: '10px',
            }}
            name={enableCondition.name}
            label={enableCondition.label}
          />

          {enableConditions
            ? (
              <>
                <MuiAutoComplete
                  sx={{
                    marginTop: 'auto',
                    marginBottom: '10px',
                  }}
                  name={conditionQuestion.name}
                  label={conditionQuestion.label}
                  className="bg-white"
                  open={conditionQuestionOpen}
                  size="small"
                  oldValue={oldQuestion}
                  value={parent_id && parent_id.name ? parent_id.name : oldQuestion}
                  onOpen={() => {
                    setConditionQuestionOpen(true);
                  }}
                  onClose={() => {
                    setConditionQuestionOpen(false);
                  }}
                  loading={conditionQuestionGroupInfo && conditionQuestionGroupInfo.loading}
                  getOptionSelected={(option, value) => (value.length > 0 ? option.name === value.name : '')}
                  getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                  options={conditionQuestionOptions}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      onChange={onConditionQuestionKeywordChange}
                      variant="standard"
                      label={conditionQuestion.label}
                      className="without-padding"
                      placeholder="Search & Select"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {conditionQuestionGroupInfo && conditionQuestionGroupInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                />
                {(conditionQuestionGroupInfo && conditionQuestionGroupInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(conditionQuestionGroupInfo)}</span></FormHelperText>)}

                <div>
                  <FormControl className={classes.margin}>
                    <MuiAutoComplete
                      sx={{
                        marginTop: 'auto',
                        marginBottom: '10px',
                      }}
                      multiple
                      filterSelectedOptions
                      name="option"
                      open={optionOpen}
                      label={optionId.label}
                      size="small"
                      className="bg-white"
                      onOpen={() => {
                        setOptionOpen(true);
                        setOptionKeyword('');
                      }}
                      onClose={() => {
                        setOptionOpen(false);
                        setOptionKeyword('');
                      }}
                      value={based_on_ids && based_on_ids.length > 0 ? based_on_ids : []}
                      defaultValue={basedOnIds}
                      onChange={(e, options) => handleOption(options)}
                      getOptionSelected={(option, value) => option.display_name === value.display_name}
                      getOptionLabel={(option) => (typeof option === 'string' ? option : option.display_name)}
                      options={optionIds}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="standard"
                          label={optionId.label}
                          className={((getOldData(basedOnIds)) || (optionKeyword && optionKeyword.length > 0))
                            ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                          placeholder="Search & Select"
                          onChange={(e) => onOptionKeywardChange(e.target.value)}
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {(optionInfo && optionInfo.loading) ? <CircularProgress color="inherit" size={20} /> : null}
                                <InputAdornment position="end" className="pr-0">
                                  {((optionKeyword && optionKeyword.length > 0) || (based_on_ids && based_on_ids.length > 0)) && (
                                    <IconButton
                                      aria-label="toggle password visibility"
                                      onClick={onOptionKeywordClear}
                                    >
                                      <IoCloseOutline size={22} fontSize="small" />
                                    </IconButton>
                                  )}
                                  <IconButton
                                    aria-label="toggle search visibility"
                                    onClick={showOptionModal}
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
                </div>
              </>
            ) : ''}
        </Box>
      </Box>
      <Dialog maxWidth="lg" open={extraMultipleModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraMultipleModal(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <SearchModalMultiple
              modelName={modelValue}
              afterReset={() => { setExtraMultipleModal(false); }}
              fieldName={fieldName}
              fields={columns}
              company={companyValue}
              otherFieldName={otherFieldName}
              otherFieldValue={otherFieldValue}
              setCheckedRows={setCheckRows}
              olCheckedRows={checkedRows && checkedRows.length ? checkedRows : []}
              oldOptionData={basedOnIds && basedOnIds.length ? basedOnIds : []}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {(checkedRows && checkedRows.length && checkedRows.length > 0)
            ? (
              <Button
                type="button"
                size="sm"
                onClick={() => { setExtraMultipleModal(false); if (fieldName === 'based_on_ids') { setBasedOnIds(checkedRows); } }}
                // onClick={() => setFieldId()}
                variant="contained"
              >
                {' '}
                Add
              </Button>
            ) : ''}
        </DialogActions>
      </Dialog>
    </>
  );
};

ActivitySegments.propTypes = {
  formField: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  editData: PropTypes.oneOfType([PropTypes.func, PropTypes.string, PropTypes.bool]).isRequired,
  editId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

export default ActivitySegments;
