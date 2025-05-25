/* eslint-disable react/no-danger */
/* eslint-disable camelcase */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import {
  InputGroup,
  InputGroupAddon,
  Col,
  Row,
  Table
} from 'reactstrap';
import Button from '@mui/material/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrashAlt, faSearch,
} from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  TextField, CircularProgress, FormHelperText, FormControl,
} from '@material-ui/core';
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { IoCloseOutline } from 'react-icons/io5';

import { useSelector, useDispatch } from 'react-redux';
import { useFormikContext } from 'formik';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import { library } from '@fortawesome/fontawesome-svg-core';
import * as Icons from '@fortawesome/free-solid-svg-icons';
import * as Icons1 from '@fortawesome/free-regular-svg-icons';
import { SketchPicker } from 'react-color';
import 'emoji-mart/css/emoji-mart.css';
import { Emoji, Picker } from 'emoji-mart';
import { Dialog, DialogContent, DialogContentText, Typography, ListItemText, Input } from '@mui/material';
import DialogHeader from '../../commonComponents/dialogHeader';

import addIcon from '@images/icons/plusCircleBlue.svg';
import Loader from '@shared/loading';
import customData from '../data/customData.json';
import SearchModal from './searchModal';
import {
  decimalKeyPress, generateErrorMessage,
  arraySortByString,
} from '../../util/appUtils';
import {
  getSurveyQuestions, getSurveyOptions, getChoiceData, getMatrixData, getChoiceOptions, getMatrixOptions,
} from '../surveyService';
import { a11yProps } from '../../util/appUtils'
import MuiAutoComplete from '../../commonComponents/formFields/muiAutocomplete';
import MuiCheckboxField from '../../commonComponents/formFields/muiCheckbox';
import MuiTextField from '../../commonComponents/formFields/muiTextField';
import { AddThemeColor } from '../../themes/theme';

const appModels = require('../../util/appModels').default;

const useStyles = makeStyles((themeStyle) => ({
  margin: {
    marginBottom: themeStyle.spacing(1.25),
    width: '100%',
  },
  option: {
    padding: 5,
    margin: 5,
    display: 'flow-root',
    '& > span': {
      marginRight: 10,
    },
  },
}));

const iconList = Object.keys(Icons)
  .filter((key) => key !== 'fas' && key !== 'prefix')
  .map((icon) => Icons[icon]);

const iconList1 = Object.keys(Icons1)
  .filter((key) => key !== 'far' && key !== 'prefix')
  .map((icon) => Icons1[icon]);

library.add(...iconList);
library.add(...iconList1);

const AddQuestions = (props) => {
  const {
    formField: {
      questionTitle,
      questionType,
      mandatoryAnswer,
      enableCondition,
      errorMessage,
      validateEntry,
      expectedMax,
      expectedMin,
      validateMinDate,
      validateMaxDate,
      validateMinFloat,
      validateMaxFloat,
      validationErrorMsg,
      validationEmail,
      displayMode,
      noofColumns,
      matrixType,
      parentId,
      questionOption,
      commentsField,
      commentsMessage,
      commentsAnswerChoice,
    },
    setFieldValue, editData, editQuestionId, editPageIndex,
  } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const { values: formValues } = useFormikContext();
  const {
    type, constr_mandatory, validation_required, comments_allowed, is_enable_condition,
    matrix_subtype, display_mode, column_nb, parent_id, based_on_ids, validation_min_date, validation_max_date,
  } = formValues;

  const [displayModeValue, setDisplayModeValue] = useState('columns');
  const [typeOpen, setTypeOpen] = useState(false);
  const [displayModeOpen, setDisplayModeOpen] = useState(false);
  const [columnsOpen, setColumnsOpen] = useState(false);
  const [qTypeOpen, setQtypeOpen] = useState(false);
  const [qtype, setQtype] = useState(false);
  const [questionOpen, setQuestionOpen] = useState(false);
  const [questionKeyword, setQuestionKeyword] = useState('');
  const [currentTab, setActive] = useState('Basic');
  const [choiceData, setChoiceData] = useState([]);
  const [choiceAdd, setChoiceAdd] = useState('');
  const [matrixData, setMatrixData] = useState([]);
  const [matrixAdd, setMatrixAdd] = useState('');
  const [constMandatory, setConstMandatory] = useState(false);
  const [validationRequired, setValidationRequired] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showCondition, setShowCondition] = useState(false);
  const [openQuestionSearchModal, setOpenQuestionSearchModal] = useState(false);
  const [serchFieldValue, setSearchFieldValue] = useState('');
  const [fieldName, setFieldName] = useState('');
  const [modalName, setModalName] = useState('');

  const [favOpen, setFavOpen] = useState('');

  const [colorModal, setColorModal] = useState(false);
  const [currentColor, setCurrentColor] = useState(false);
  const [currentEmoji, setCurrentEmoji] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(false);
  const [emojiModal, setEmojiModal] = useState(false);

  const favList1 = iconList.map((cl) => ({
    ...cl, value: cl.iconName, label: cl.iconName,
  }));

  const favList2 = iconList1.map((cl) => ({
    ...cl, value: cl.iconName, label: cl.iconName,
  }));

  let favList = [...favList1, ...favList2];

  favList = arraySortByString(favList, 'iconName');

  favList = [...new Map(favList.map((item) => [item.iconName, item])).values()];

  const {
    surveyQuestionInfo, surveyOptionInfo, choiceSelected, matrixSelected, choiceOptionInfo, matrixOptionInfo,
  } = useSelector((state) => state.survey);
  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    if (choiceOptionInfo && choiceOptionInfo.data && choiceOptionInfo.data.length > 0) {
      setChoiceData(choiceOptionInfo.data);
      setChoiceAdd(Math.random());
    }
  }, [choiceOptionInfo]);

  useEffect(() => {
    if (matrixOptionInfo && matrixOptionInfo.data && matrixOptionInfo.data.length > 0) {
      setMatrixData(matrixOptionInfo.data);
      setMatrixAdd(Math.random());
    }
  }, [matrixOptionInfo]);

  useEffect(() => {
    if (editData && editData.labels_ids_2 && editData.labels_ids_2.length > 0) {
      if (editData.labels_ids_2[0].value) {
        setMatrixData(editData.labels_ids_2);
        dispatch(getMatrixData(editData.labels_ids_2));
      } else {
        dispatch(getMatrixOptions(appModels.SURVEYLABEL, editData.labels_ids_2));
      }
    }
    if (editData && editData.labels_ids && editData.labels_ids.length > 0) {
      if (editData.labels_ids[0].value) {
        setChoiceData(editData.labels_ids);
        dispatch(getChoiceData(editData.labels_ids));
      } else {
        dispatch(getChoiceOptions(appModels.SURVEYLABEL, editData.labels_ids));
      }
    } else {
      setChoiceData([]);
      dispatch(getChoiceData([]));
    }
  }, [editData]);

  useEffect(() => {
    setConstMandatory(constr_mandatory);
  }, [constr_mandatory]);

  useEffect(() => {
    setValidationRequired(validation_required);
  }, [validation_required]);

  useEffect(() => {
    setShowComments(comments_allowed);
  }, [comments_allowed]);

  useEffect(() => {
    setShowCondition(is_enable_condition);
  }, [is_enable_condition]);

  useEffect(() => {
    if (type && type.value) {
      setQtype(type.value);
      setChoiceData([]);
      dispatch(getChoiceData([]));
      setMatrixData([]);
      dispatch(getMatrixData([]));
    } else if (type) {
      setQtype(type);
    }
  }, [type]);

  useEffect(() => {
    (async () => {
      if (display_mode && display_mode.value) {
        setDisplayModeValue(display_mode.value);
      } else if (display_mode) {
        setDisplayModeValue(display_mode);
      }
    })();
  }, [display_mode]);

  useEffect(() => {
    if (matrixAdd) {
      setMatrixData(matrixData);
      dispatch(getMatrixData(matrixData));
    }
  }, [matrixAdd]);

  useEffect(() => {
    if (choiceAdd) {
      setChoiceData(choiceData);
      dispatch(getChoiceData(choiceData));
    }
  }, [choiceAdd]);

  useEffect(() => {
    if (parent_id) {
      if (editQuestionId) {
        if (parent_id.length > 0 && !parent_id[0].id) {
          dispatch(getSurveyOptions(appModels.SURVEYLABEL, editData.based_on_ids));
        } else {
          dispatch(getSurveyOptions(appModels.SURVEYLABEL, parent_id.labels_ids));
        }
      } else if (editPageIndex) {
        if (parent_id.length > 0 && parent_id[0].id) {
          dispatch(getSurveyOptions(appModels.SURVEYLABEL, parent_id.labels_ids));
        } else {
          dispatch(getSurveyOptions(appModels.SURVEYLABEL, editData.based_on_ids));
        }
      } else {
        dispatch(getSurveyOptions(appModels.SURVEYLABEL, parent_id.labels_ids));
      }
    }
  }, [parent_id]);

  useEffect(() => {
    if ((editQuestionId || editPageIndex) && surveyOptionInfo && surveyOptionInfo.data && surveyOptionInfo.data.length > 0) {
      if (based_on_ids && based_on_ids.length > 0) {
        if (parent_id.id === editData.parent_id.id) {
          setFieldValue('based_on_ids', surveyOptionInfo.data);
        }
      }
    }
  }, [editQuestionId, editPageIndex, surveyOptionInfo]);

  useEffect(() => {
    (async () => {
      if (userInfo.data && questionOpen) {
        await dispatch(getSurveyQuestions(appModels.SURVEYQUESTION, questionKeyword));
      }
    })();
  }, [questionOpen, questionKeyword]);

  const onQuestionKeywordChange = (event) => {
    setQuestionKeyword(event.target.value);
  };

  const onQuestionSearch = () => {
    setOpenQuestionSearchModal(true);
    setFieldName('parent_id');
    setModalName('Question');
    setSearchFieldValue('display_name');
  };

  const onQuestionClear = () => {
    setQuestionKeyword(null);
    setQuestionOpen(false);
    setFieldValue('parent_id', '');
  };

  const onOptionClear = () => {
    setFieldValue('based_on_ids', '');
  };

  const loadEmptyRowTd = () => {
    const newData = matrixData;
    newData.push({
      value: '', sequence: 0,
    });
    setMatrixData(newData);
    setMatrixAdd(Math.random());
  };

  const removeRowData = (e, index) => {
    let checkData = matrixData;
    let indexRemove = checkData.indexOf(checkData[index]);
    if (editPageIndex && matrixSelected && matrixSelected.length > 0) {
      checkData = matrixSelected;
      indexRemove = checkData.indexOf(checkData[index]);
    }
    const { id } = checkData[indexRemove];
    if (id) {
      checkData[indexRemove].isRemove = true;
      setMatrixData(checkData);
      setMatrixAdd(Math.random());
    } else {
      checkData.splice(indexRemove, 1);
      setMatrixData(checkData);
      setMatrixAdd(Math.random());
    }
  };

  const onChangeRow = (e, index) => {
    const newData = matrixData;
    newData[index].value = e.target.value;
    newData[index].sequence = index + 1;
    setMatrixData(newData);
    setMatrixAdd(Math.random());
  };

  const loadEmptyTd = () => {
    const newData = choiceData;
    newData.push({
      value: '', quizz_mark: 0.00, sequence: 0, favicon: '', color: '', emoji: '',
    });
    setChoiceData(newData);
    setChoiceAdd(Math.random());
  };

  const removeData = (e, index) => {
    let checkData = choiceData;
    let indexRemove = checkData.indexOf(checkData[index]);
    if (editPageIndex && choiceSelected && choiceSelected.length > 0) {
      checkData = choiceSelected;
      indexRemove = checkData.indexOf(checkData[index]);
    }
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

  const onChangeChoice = (e, index) => {
    const newData = choiceData;
    newData[index].value = e.target.value;
    newData[index].sequence = index + 1;
    setChoiceData(newData);
    setChoiceAdd(Math.random());
  };

  const onChangeFavIcon = (e, index) => {
    const newData = choiceData;
    if (e) {
      newData[index].favicon = e.value;
      newData[index].emoji = '';
      setChoiceData(newData);
      setChoiceAdd(Math.random());
    } else {
      newData[index].favicon = '';
      setChoiceData(newData);
      setChoiceAdd(Math.random());
    }
  };

  const onChangeColor = (e, index) => {
    const newData = choiceData;
    newData[index].color = e.hex;
    setCurrentColor(e.hex);
    setChoiceData(newData);
    setChoiceAdd(Math.random());
  };

  const closeColorModal = () => {
    setColorModal(false);
    setCurrentColor(false);
    setCurrentIndex(false);
  };

  const openColorModal = (sc, cIndex) => {
    setCurrentColor(sc);
    setCurrentIndex(cIndex);
    setColorModal(true);
  };

  const onChangeEmoji = (e, index) => {
    const newData = choiceData;
    // newData[index].emoji = `U+${e.unified.toUpperCase()}`;
    newData[index].emoji = e.id;
    setCurrentEmoji(e.id);
    newData[index].favicon = '';
    setChoiceData(newData);
    setChoiceAdd(Math.random());
  };

  const closeEmojiModal = () => {
    setEmojiModal(false);
    setCurrentEmoji(false);
    setCurrentIndex(false);
  };

  const openEmojiModal = (sc, cIndex) => {
    setCurrentEmoji(sc);
    setCurrentIndex(cIndex);
    setEmojiModal(true);
  };

  let surveyQuestionOptions = [];
  let surveyOptions = [];

  if (surveyQuestionInfo && surveyQuestionInfo.loading) {
    surveyQuestionOptions = [{ display_name: 'Loading..' }];
  }
  if (surveyQuestionInfo && surveyQuestionInfo.data) {
    surveyQuestionOptions = surveyQuestionInfo.data;
  }
  if (parent_id && parent_id.length && parent_id.length > 0) {
    const oldId = [{ id: parent_id[0], display_name: parent_id[1] }];
    const newArr = [...surveyQuestionOptions, ...oldId];
    surveyQuestionOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  if (surveyQuestionInfo && surveyQuestionInfo.err) {
    surveyQuestionOptions = [];
  }

  if (surveyOptionInfo && surveyOptionInfo.loading) {
    surveyOptions = [{ display_name: 'Loading..' }];
  }
  if (surveyOptionInfo && surveyOptionInfo.data) {
    surveyOptions = surveyOptionInfo.data;
  }
  if (surveyOptionInfo && surveyOptionInfo.err) {
    surveyOptions = [];
  }

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

  const oldQtype = type && customData && customData.questionTypesText && customData.questionTypesText[type] ? customData.questionTypesText[type].label : '';
  const oldDisplayMode = display_mode && customData && customData.displayModesText && customData.displayModesText[display_mode] ? customData.displayModesText[display_mode].label : '';
  const oldMatrixType = matrix_subtype && customData && customData.matrixTypesText && customData.matrixTypesText[matrix_subtype] ? customData.matrixTypesText[matrix_subtype].label : '';
  const oldColumn = column_nb && customData && customData.noofColumnsText && customData.noofColumnsText[column_nb] ? customData.noofColumnsText[column_nb].label : '';
  const [tab, setTab] = useState(0)
  const tabs = ['Basic', 'Options']
  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <>
      <Tabs
        value={tab}
        onChange={handleTabChange}
        aria-label="basic tabs example"
      >
        {tabs &&
          tabs.length &&
          tabs.map((tabb) => (
            <Tab

              label={tabb}
              {...a11yProps(0)}
            />
          ))}
      </Tabs>

      {tab === 0 && (
        <div className="pt-3 audits-list thin-scrollbar">
          <Row>
            <Col xs={12} sm={7} md={7} lg={7}>
              <MuiTextField
                sx={{
                  marginTop: "auto",
                  marginBottom: "10px",
                }}
                inputProps={{ maxLength: 100 }}
                name={questionTitle.name}
                placeholder="Question Name"
                label={questionTitle.label}
                isRequired type="text" />
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={7} md={7} lg={7}>
              <MuiAutoComplete
                sx={{
                  marginTop: "auto",
                  marginBottom: "10px",
                }}
                name={questionType.name}
                label={questionType.label}
                open={qTypeOpen}
                size="small"
                oldValue={oldQtype}
                value={type && type.label ? type.label : oldQtype}
                onOpen={() => {
                  setQtypeOpen(true);
                }}
                onClose={() => {
                  setQtypeOpen(false);
                }}
                getOptionSelected={(option, value) => option.label === value.label}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                options={customData.questionTypes}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    label={questionType.label}
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
          </Row>
          {qtype === 'textbox'
            ? (
              <>
                <Row>
                  <Col xs={12} sm={12} md={12} lg={12}>
                    <>
                      <MuiCheckboxField
                        sx={{
                          marginTop: "auto",
                          marginBottom: "10px",
                        }}
                        name={validationEmail.name}
                        label={validationEmail.label}
                      />
                    </>
                  </Col>
                </Row>
              </>
            ) : ''}
          {qtype === 'simple_choice' || qtype === 'multiple_choice' || qtype === 'matrix'
            ? (
              <>
                <Row>
                  <Col xs={12} sm={12} md={12} lg={12}>
                    <>
                      <Typography
                        sx={AddThemeColor({
                          font: "normal normal medium 20px/24px Suisse Intl",
                          letterSpacing: "0.7px",
                          fontWeight: 500,
                          marginBottom: "10px",
                          marginTop: "10px",
                          paddingBottom: '4px'
                        })}
                      >
                        Answers
                      </Typography>
                      <div aria-hidden="true" className="font-weight-800 d-inline text-lightblue cursor-pointer mt-1 mb-1" onClick={loadEmptyTd}>
                        <img src={addIcon} className="mr-2 mb-1" alt="addequipment" height="15" width="15" />
                        <span className="mr-2">Add a Line</span>
                      </div>
                    </>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} sm={12} md={12} lg={12}>
                    <Table responsive className="m-0">
                      <thead className="bg-lightblue">
                        <tr>
                          <th className="p-2 min-width-200 border-0">Choices</th>
                          <th className="p-2 min-width-160 border-0">Fav Icon</th>
                          <th className="p-2 min-width-160 border-0">Color</th>
                          <th className="p-2 min-width-160 border-0">Emoji</th>
                          <th className="p-2 min-width-100 border-0">
                            <span className="invisible">Del</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {(!choiceSelected.loading && choiceOptionInfo && !choiceOptionInfo.loading && choiceSelected && choiceSelected.length > 0 && choiceSelected.map((pl, index) => (
                          <>
                            {!pl.isRemove && (
                              <tr key={index} className="font-weight-400">
                                <td className="p-2">
                                  <Input type="text" autoComplete="off" maxLength="30" name="value" value={pl.value} onChange={(e) => onChangeChoice(e, index)} />
                                </td>
                                <td className="p-2">
                                  <FormControl className="m-1">
                                    <MuiAutoComplete
                                      sx={{
                                        marginTop: "auto",
                                        marginBottom: "10px",
                                      }}
                                      name="Taxes"
                                      className="bg-white min-width-200"
                                      open={favOpen === index}
                                      size="small"
                                      onOpen={() => {
                                        setFavOpen(index);
                                      }}
                                      onClose={() => {
                                        setFavOpen('');
                                      }}
                                      classes={{
                                        option: classes.option,
                                      }}
                                      disableClearable={!(pl.favicon)}
                                      onChange={(e, data) => { onChangeFavIcon(data, index); }}
                                      value={pl.favicon}
                                      getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                                      options={favList}
                                      renderOption={(option) => (
                                        <ListItemText>
                                          <p className="float-left">
                                            {option.label && (
                                              <>
                                                <FontAwesomeIcon
                                                  icon={option.label}
                                                  className="mr-2"
                                                  size="lg"
                                                />
                                                {option.label}
                                              </>
                                            )}
                                          </p>
                                        </ListItemText>
                                      )}
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          variant="standard"
                                          className="without-padding"
                                          InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                              <>
                                                <InputAdornment position="start">
                                                  {pl.favicon && (
                                                    <FontAwesomeIcon
                                                      icon={pl.favicon}
                                                      className="mr-2"
                                                      size="lg"
                                                    />
                                                  )}
                                                </InputAdornment>
                                                {params.InputProps.endAdornment}
                                              </>
                                            ),
                                          }}
                                        />
                                      )}
                                    />
                                  </FormControl>
                                </td>
                                <td className="p-2">
                                  <InputGroup size="sm">
                                    <InputGroupAddon addonType="prepend">
                                      <div
                                        aria-hidden
                                        onClick={() => openColorModal(pl.color, index)}
                                        style={{ color: pl.color ? pl.color : '', backgroundColor: pl.color ? pl.color : '' }}
                                        className="cursor-pointer border-1px-light-white"
                                      >
                                        <FontAwesomeIcon size="lg" className="mr-2 ml-2 mt-1" icon={faSearch} />
                                      </div>
                                    </InputGroupAddon>
                                    <Input type="text" value={pl.color} disabled />
                                  </InputGroup>
                                </td>
                                <td className="p-2">
                                  <InputGroup size="sm">
                                    <InputGroupAddon addonType="prepend">
                                      <div
                                        aria-hidden
                                        onClick={() => openEmojiModal(pl.emoji, index)}
                                        className="cursor-pointer border-1px-light-white"
                                      >
                                        {pl.emoji ? (
                                          <div className="mr-2 ml-2 mt-1">
                                            <Emoji emoji={pl.emoji} set="google" size={18} />
                                          </div>
                                        )
                                          : (
                                            <FontAwesomeIcon size="lg" className="mr-2 ml-2 mt-1" icon={faSearch} />
                                          )}
                                      </div>
                                    </InputGroupAddon>
                                    <Input type="text" value={pl.emoji} disabled />
                                  </InputGroup>
                                </td>
                                <td className="p-2">
                                  <span className="font-weight-400 d-inline-block" />
                                  <FontAwesomeIcon className="mr-1 ml-1 cursor-pointer" size="sm" icon={faTrashAlt} onClick={(e) => { removeData(e, index); }} />
                                </td>
                              </tr>
                            )}
                          </>
                        )))}
                        {choiceOptionInfo && choiceOptionInfo.loading && choiceSelected && choiceSelected.loading && (
                          <div className="text-center mt-3">
                            <Loader />
                          </div>
                        )}
                      </tbody>
                    </Table>
                  </Col>
                </Row>
              </>
            ) : ''}
          {qtype === 'matrix'
            ? (
              <>
                <Row>
                  <Col xs={12} sm={12} md={12} lg={12}>
                    <>
                      <Typography
                        sx={AddThemeColor({
                          font: "normal normal medium 20px/24px Suisse Intl",
                          letterSpacing: "0.7px",
                          fontWeight: 500,
                          marginBottom: "10px",
                          marginTop: "10px",
                          paddingBottom: '4px'
                        })}
                      >
                        Rows of the Matrix
                      </Typography>
                      <div aria-hidden="true" className="font-weight-800 d-inline text-lightblue cursor-pointer mt-1 mb-1" onClick={loadEmptyRowTd}>
                        <img src={addIcon} className="mr-2 mb-1" alt="addequipment" height="15" width="15" />
                        <span className="mr-2">Add a Line</span>
                      </div>
                    </>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} sm={12} md={12} lg={12}>
                    <Table className="ml-2">
                      <thead className="bg-lightblue">
                        <tr>
                          <th className="p-2 min-width-200 border-0">Rows</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(!matrixSelected.loading && matrixOptionInfo && !matrixOptionInfo.loading && matrixSelected && matrixSelected.length > 0 && matrixSelected.map((ml, index1) => (
                          <>
                            {!ml.isRemove && (
                              <tr key={index1} className="font-weight-400">
                                <td className="p-2">
                                  <Input type="text" autoComplete="off" maxLength="30" name="value" value={ml.value} onChange={(e) => onChangeRow(e, index1)} />
                                </td>
                                <td className="p-2">
                                  <span className="font-weight-400 d-inline-block" />
                                  <FontAwesomeIcon className="mr-1 ml-1 cursor-pointer" size="sm" icon={faTrashAlt} onClick={(e) => { removeRowData(e, index1); }} />
                                </td>
                              </tr>
                            )}
                          </>
                        )))}
                        {matrixOptionInfo && matrixOptionInfo.loading && matrixSelected && matrixSelected.loading && (
                          <div className="text-center mt-3">
                            <Loader />
                          </div>
                        )}
                      </tbody>
                    </Table>
                  </Col>
                </Row>
              </>
            ) : ''}
        </div>
      )}
      {tab === 1 && (
        <div className="audits-list thin-scrollbar">
          <Row className="pr-3 pt-3">
            <Col xs={12} sm={12} md={12} lg={12}>
              <Typography
                sx={AddThemeColor({
                  font: "normal normal medium 20px/24px Suisse Intl",
                  letterSpacing: "0.7px",
                  fontWeight: 500,
                  marginBottom: "10px",
                  marginTop: "10px",
                })}
              >
                Constraints
              </Typography>
            </Col>
            <Col xs={12} sm={12} md={12} lg={12}>
              <MuiCheckboxField
                sx={{
                  marginTop: "auto",
                  marginBottom: "10px",
                }}
                className="ml-3"
                name={mandatoryAnswer.name}
                label={mandatoryAnswer.label}
              />
            </Col>
            {constMandatory
              ? (
                <Col xs={12} sm={6} md={6} lg={6} className="ml-3">
                  <MuiTextField name={errorMessage.name} label={errorMessage.label} inputProps={{ maxLength: 100 }} type="text" />
                </Col>
              ) : ''}
            {' '}
            {qtype.toString() === 'matrix'
              ? (
                <Col xs={12} sm={6} md={6} lg={6} className="ml-3">
                  <MuiAutoComplete
                    sx={{
                      marginTop: "auto",
                      marginBottom: "10px",
                    }}
                    name={matrixType.name}
                    isRequired={matrixType.required}
                    placeholder="Enter Title"
                    label={matrixType.label}
                    open={typeOpen}
                    oldValue={oldMatrixType}
                    value={matrix_subtype && matrix_subtype.label ? matrix_subtype.label : oldMatrixType}
                    size="small"
                    onOpen={() => {
                      setTypeOpen(true);
                    }}
                    onClose={() => {
                      setTypeOpen(false);
                    }}
                    getOptionSelected={(option, value) => option.label === value.label}
                    getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                    options={customData.matrixTypes}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="standard"
                        label={matrixType.label}
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
              ) : ''}
            {qtype.toString() === 'simple_choice' || qtype.toString() === 'multiple_choice'
              ? (
                <Col xs={12} sm={12} md={12} lg={12}>
                  <Typography
                    sx={AddThemeColor({
                      font: "normal normal medium 20px/24px Suisse Intl",
                      letterSpacing: "0.7px",
                      fontWeight: 500,
                      marginBottom: "10px",
                      marginTop: "10px",
                      paddingBottom: '4px'
                    })}
                  >
                    Display Mode
                  </Typography>
                </Col>
              ) : ''}
            {qtype.toString() === 'simple_choice'
              ? (
                <Col xs={12} sm={6} md={6} lg={6}>
                  <MuiAutoComplete
                    sx={{
                      marginTop: "auto",
                      marginBottom: "10px",
                    }}
                    name={displayMode.name}
                    isRequired={displayMode.required}
                    placeholder="Enter Title"
                    label={displayMode.label}
                    open={displayModeOpen}
                    oldValue={oldDisplayMode}
                    value={display_mode && display_mode.label ? display_mode.label : oldDisplayMode}
                    size="small"
                    onOpen={() => {
                      setDisplayModeOpen(true);
                    }}
                    onClose={() => {
                      setDisplayModeOpen(false);
                    }}
                    getOptionSelected={(option, value) => option.label === value.label}
                    getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                    options={customData.displayModes}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="standard"
                        label={displayMode.label}
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
              )
              : ''}
            {qtype.toString() === 'multiple_choice' || (qtype.toString() === 'simple_choice' && displayModeValue === 'columns')
              ? (
                <Col xs={12} sm={6} md={6} lg={6}>
                  <MuiAutoComplete
                    sx={{
                      marginTop: "auto",
                      marginBottom: "10px",
                    }}
                    name={noofColumns.name}
                    isRequired={noofColumns.required}
                    placeholder="Enter Title"
                    label={noofColumns.label}
                    open={columnsOpen}
                    oldValue={oldColumn}
                    value={column_nb && column_nb.label ? column_nb.label : oldColumn}
                    size="small"
                    onOpen={() => {
                      setColumnsOpen(true);
                    }}
                    onClose={() => {
                      setColumnsOpen(false);
                    }}
                    getOptionSelected={(option, value) => option.label === value.label}
                    getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                    options={customData.noofColumns}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="standard"
                        label={noofColumns.label}
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
              )
              : ''}
            {qtype.toString() === 'textbox' || qtype.toString() === 'numerical_box' || qtype.toString() === 'date'
              ? (
                <Col xs={12} sm={12} md={12} lg={12}>
                  <MuiCheckboxField
                    sx={{
                      marginTop: "auto",
                      marginBottom: "10px",
                    }}
                    className="ml-3"
                    name={validateEntry.name}
                    label={validateEntry.label}
                  />
                </Col>
              ) : ''}
            {validationRequired && qtype.toString() === 'textbox'
              ? (
                <Row>
                  <Col xs={12} sm={6} md={6} lg={6}>
                    <MuiTextField label={expectedMin.label} name={expectedMin.name} type="text" />
                  </Col>
                  <Col xs={12} sm={6} md={6} lg={6}>
                    <MuiTextField label={expectedMax.label} name={expectedMax.name} type="text" />
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={12}>
                    <MuiTextField label={validationErrorMsg.label} name={validationErrorMsg.name} type="text" />
                  </Col>
                </Row>
              ) : ''}
            {validationRequired && qtype.toString() === 'numerical_box'
              ? (
                <Row>
                  <Col xs={12} sm={6} md={6} lg={6}>
                    <MuiTextField
                      sx={{
                        marginTop: "auto",
                        marginBottom: "10px",
                      }}
                      label={validateMinFloat.label}
                      name={validateMinFloat.name}
                      onKeyPress={decimalKeyPress}
                      type="text"
                    />
                  </Col>
                  <Col xs={12} sm={6} md={6} lg={6}>
                    <MuiTextField
                      sx={{
                        marginTop: "auto",
                        marginBottom: "10px",
                      }}
                      label={validateMaxFloat.label}
                      name={validateMaxFloat.name}
                      onKeyPress={decimalKeyPress}
                      type="text"
                    />
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={12}>
                    <MuiTextField
                      sx={{
                        marginTop: "auto",
                        marginBottom: "10px",
                      }}
                      label={validationErrorMsg.label}
                      name={validationErrorMsg.name}
                      type="text"
                    />
                  </Col>
                </Row>
              ) : ''}
            {validationRequired && qtype.toString() === 'date'
              ? (
                <Row>
                  <Col xs={12} sm={6} md={6} lg={6}>
                    <Input
                      sx={{
                        marginTop: "auto",
                        marginBottom: "10px",
                      }}
                      type="date"
                      name={validateMinDate.name}
                      label={validateMinDate.label}
                      className="mt-3"
                      value={validation_min_date}
                      onChange={(e) => setFieldValue('validation_min_date', e.target.value)}
                    />
                  </Col>
                  <Col xs={12} sm={6} md={6} lg={6}>
                    <Input
                      sx={{
                        marginTop: "auto",
                        marginBottom: "10px",
                      }}
                      type='date'
                      name={validateMaxDate.name}
                      label={validateMaxDate.label}
                      className="mt-3"
                      value={validation_max_date}
                      onChange={(e) => setFieldValue('validation_max_date', e.target.value)}
                    />
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={12}>
                    <MuiTextField
                      sx={{
                        marginTop: "auto",
                        marginBottom: "10px",
                      }}
                      label={validationErrorMsg.label}
                      name={validationErrorMsg.name}
                      type="text"
                    />
                  </Col>
                </Row>
              ) : ''}
            {qtype.toString() === 'simple_choice' || qtype.toString() === 'multiple_choice' || qtype.toString() === 'matrix'
              ? (
                <>
                  <Col xs={12} sm={12} md={12} lg={12}>
                    <Typography
                      sx={AddThemeColor({
                        font: "normal normal medium 20px/24px Suisse Intl",
                        letterSpacing: "0.7px",
                        fontWeight: 500,
                        marginBottom: "10px",
                        marginTop: "10px",
                        paddingBottom: '4px'
                      })}
                    >
                      Allow Comments
                    </Typography>
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={12}>
                    <MuiCheckboxField
                      sx={{
                        marginTop: "auto",
                        marginBottom: "10px",
                      }}
                      className="ml-3"
                      name={commentsField.name}
                      label={commentsField.label}
                    />
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={12} className="ml-3">
                    {showComments
                      ? (
                        <MuiTextField
                          sx={{
                            marginTop: "auto",
                            marginBottom: "10px",
                          }}
                          name={commentsMessage.name}
                          label={commentsMessage.label}
                          type="text"
                        />
                      ) : ''}
                    {' '}
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={12}>
                    {showComments && (qtype.toString() === 'simple_choice' || qtype.toString() === 'multiple_choice')
                      ? (
                        <MuiCheckboxField
                          sx={{
                            marginTop: "auto",
                            marginBottom: "10px",
                          }}
                          className="ml-3"
                          name={commentsAnswerChoice.name}
                          label={commentsAnswerChoice.label}
                        />
                      ) : ''}
                    {' '}
                  </Col>
                </>
              ) : ''}
          </Row>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12}>
              <Typography
                sx={AddThemeColor({
                  font: "normal normal medium 20px/24px Suisse Intl",
                  letterSpacing: "0.7px",
                  fontWeight: 500,
                  marginTop: "10px",
                  marginBottom: "10px",
                })}
              >
                Condition Based Question
              </Typography>
            </Col>
            <Col xs={12} sm={12} md={12} lg={12}>
              <MuiCheckboxField
                sx={{
                  marginTop: "auto",
                  marginBottom: "10px",
                }}
                className="ml-3"
                name={enableCondition.name}
                label={enableCondition.label}
              />
            </Col>
            {showCondition
              ? (
                <Col xs={12} sm={12} md={12} lg={12} className="ml-3">
                  <MuiAutoComplete
                    sx={{
                      marginTop: "auto",
                      marginBottom: "10px",
                    }}
                    name={parentId.name}
                    label={parentId.label}
                    isRequired={parentId.required}
                    open={questionOpen}
                    size="small"
                    onOpen={() => {
                      setQuestionOpen(true);
                      setQuestionKeyword('');
                    }}
                    onClose={() => {
                      setQuestionOpen(false);
                      setQuestionKeyword('');
                    }}
                    oldValue={getOldData(parent_id)}
                    value={parent_id && parent_id.display_name ? parent_id.display_name : getOldData(parent_id)}
                    loading={surveyQuestionInfo && surveyQuestionInfo.loading}
                    getOptionSelected={(option, value) => (value.length > 0 ? option.display_name === value.display_name : '')}
                    getOptionLabel={(option) => (typeof option === 'string' ? option : option.display_name)}
                    options={surveyQuestionOptions}
                    onChange={(e, data) => { setFieldValue('based_on_ids', ''); setFieldValue('parent_id', data); }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        onChange={onQuestionKeywordChange}
                        variant="standard"
                        label={parentId.label}
                        placeholder="Search & Select"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {surveyQuestionInfo && surveyQuestionInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                              <InputAdornment position="end">
                                {((getOldData(parent_id)) || (parent_id && parent_id.id) || (questionKeyword && questionKeyword.length > 0)) && (
                                  <IconButton onClick={onQuestionClear}>
                                    <IoCloseOutline size={22} fontSize="small" />
                                  </IconButton>
                                )}
                                <IconButton onClick={onQuestionSearch}>
                                  <SearchIcon fontSize="small" />
                                </IconButton>
                              </InputAdornment>
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                  {(surveyQuestionInfo && surveyQuestionInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(surveyQuestionInfo)}</span></FormHelperText>)}
                </Col>
              ) : ''}
            {showCondition
              ? (
                <Col xs={12} sm={12} md={12} lg={12} className="ml-3">
                  <MuiAutoComplete
                    sx={{
                      marginTop: "auto",
                      marginBottom: "10px",
                    }}
                    multiple
                    filterSelectedOptions
                    limitTags={3}
                    name={questionOption.name}
                    label={questionOption.label}
                    value={based_on_ids && based_on_ids.length > 0 ? based_on_ids : []}
                    loading={(surveyOptionInfo && surveyOptionInfo.loading)}
                    options={surveyOptions}
                    getOptionLabel={(option) => (typeof option === 'string' ? option : option.display_name||option.name)}
                    onChange={(e, data) => { setFieldValue('based_on_ids', data); }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="standard"   
                        label={(
                          <>
                            <span className="font-family-tab">{questionOption.label}</span>
                            {' '}
                            <span className="text-danger text-bold">*</span>
                          </>
                        )}                    
                        placeholder="Select"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {surveyOptionInfo && surveyOptionInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                              <InputAdornment position="end">
                                {((based_on_ids && based_on_ids.length > 0) || (based_on_ids && based_on_ids.id)) && (
                                  <IconButton onClick={onOptionClear}>
                                    <IoCloseOutline size={22} fontSize="small" />
                                  </IconButton>
                                )}
                              </InputAdornment>
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                  {(surveyOptionInfo && surveyOptionInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(surveyOptionInfo)}</span></FormHelperText>)}
                </Col>
              ) : ''}
          </Row>
        </div>
      )}
      <Dialog size="xl" fullWidth open={openQuestionSearchModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setOpenQuestionSearchModal(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <SearchModal
              modelName={appModels.SURVEYQUESTION}
              afterReset={() => { setOpenQuestionSearchModal(false); }}
              fieldName={fieldName}
              fields={['display_name']}
              company=""
              otherFieldName={parent_id && parent_id.id ? parent_id.id : ''}
              modalName={modalName}
              setFieldValue={setFieldValue}
              serchFieldValue={serchFieldValue}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Dialog size="sm" open={colorModal}>
        <DialogHeader title="Color Picker" imagePath={false} onClose={() => { setColorModal(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <SketchPicker color={currentColor} onChangeComplete={(colour) => onChangeColor(colour, currentIndex)} />
            <hr />
            <div className="float-right">
              <>
                <Button
                  onClick={() => closeColorModal()}
                  size="sm"
                  variant="contained"
                  className="ml-1"
                >
                  Ok
                </Button>
              </>
            </div>
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Dialog size="lg" open={emojiModal}>
        <DialogHeader title="Emoji Picker" imagePath={false} onClose={() => { setEmojiModal(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Picker set="google" emoji={currentEmoji} showSkinTones={false} showPreview={false} title="Pick your emoji…" onSelect={(emoji) => onChangeEmoji(emoji, currentIndex)} />
            <hr />
            <div className="float-right">
              <>
                <Button
                  onClick={() => closeEmojiModal()}
                  size="sm"
                  variant="contained"
                  className="ml-1"
                >
                  Ok
                </Button>
              </>
            </div>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
};

AddQuestions.propTypes = {
  editQuestionId: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.bool,
  ]).isRequired,
  editPageIndex: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.bool,
  ]).isRequired,
  editData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default AddQuestions;
