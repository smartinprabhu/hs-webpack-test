/* eslint-disable camelcase */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable global-require */
/* eslint-disable no-mixed-operators */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable max-len */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable radix */
/* eslint-disable array-callback-return */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardTitle,
  CardBody,
  Col,
  Row,
  Input,
  Progress,
} from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Autocomplete } from '@material-ui/lab';
import { TextField, FormControlLabel, Checkbox } from '@material-ui/core';
import { ThemeProvider, makeStyles } from '@material-ui/core/styles';
import { Radio } from 'antd';
import axios from 'axios';
import {
  Box, Typography,
  Dialog, DialogActions, DialogContent, DialogContentText, Button,
} from '@mui/material';

import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';

import workOrdersIcon from '@images/icons/workOrders.svg';
import inProgress from '@images/icons/inProgressNoCircle.svg';
import questionIcon from '@images/icons/questionChecklist.svg';
import answerIcon from '@images/icons/answerChecklist.svg';
import fullyAssignIcon from '@images/icons/fullyAssign.png';
import checklistIcon from '@images/icons/performChecklistBlack.svg';
import DialogHeader from '../../../commonComponents/dialogHeader';
import { workOrderPrioritiesJson, workorderStatusJson } from '../../../commonComponents/utils/util';
import theme from '../../../util/materialTheme';
import {
  generateErrorMessage,
  decimalKeyPressDown,
  extractValueObjects,
  getColumnArrayById,
  isJsonString,
  getJsonString,
} from '../../../util/appUtils';

import {
  getOrderCheckLists, getOperationCheckListData,
  updateChecklistAnswer, resetUpdateCheckList, resetSuggestedCheckedRows, getOrderDetail, resetRemoveCheckList, getExtraSelection,
} from '../../workorderService';
import { getCheckListsJsonData } from '../../../preventiveMaintenance/ppmService';
import {

  getCommaArray,
} from '../../utils/utils';
import { groupByMultiple } from '../../../util/staticFunctions';

const appModels = require('../../../util/appModels').default;

const useStyles = makeStyles({
  checked: {},
  MuiFormControlLabel: {
    label: {
      fontSize: '30px',
    },
  },
});

const CheckList = (props) => {
  const {
    workorderDetails, checkListModal, atFinish, refresh,
  } = props;
  const dispatch = useDispatch();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [detail, setDetail] = useState([]);
  const [modal, setModal] = useState(checkListModal);
  const [answerValues, setAnswerValues] = useState([]);
  const [showReset, setShowReset] = useState(true);
  const [answerMultiValues, setMultiAnswerValues] = useState([]);
  const [inputValues, setInputValues] = useState([]);
  const [mergeData, setMergeData] = useState([]);
  const [mergeDataOne, setMergeDataOne] = useState([]);
  const [multiData, setMultiData] = useState([]);
  const [multiDataCheck, setMultiDataCheck] = useState([]);
  const [taskConfig, setTaskConfig] = useState({ loading: false, data: null, err: null });
  const [errorId, setErrorId] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');

  const { userInfo } = useSelector((state) => state.user);

  const WEBAPPAPIURL = `${window.location.origin === 'http://localhost:3010' ? 'http://localhost:3000' : window.location.origin}/`;

  const classes = useStyles();

  const {
    orderCheckLists, updateChecklist, removeChecklist, listDataInfo, checklistOpInfo,
  } = useSelector((state) => state.workorder);
  const { checkListsJson } = useSelector((state) => state.ppm);
  const [taskQuestions, setTaskQuestions] = useState([]);
  const [operationChecklist, setOperationChecklist] = useState([]);

  const [loadAns, setLoadAns] = useState(false);

  const toggle = () => {
    setCurrentQuestion(0);
    setModal(!modal);
    atFinish();
  };

  const workorder = workorderDetails && workorderDetails.data && workorderDetails.data[0];
  const isChecklist = workorder && workorder.check_list_ids && workorder.check_list_ids.length > 0;
  const isChecklistJson = (workorder && workorder.checklist_json_data !== '[]' && workorder.checklist_json_data !== '' && workorder.checklist_json_data !== false && workorder.checklist_json_data !== null);

  const cheklistJsonObj = workorder && workorder.checklist_json_data ? JSON.parse(workorder.checklist_json_data) : false;
  const mroActivityIds = cheklistJsonObj && cheklistJsonObj.map((record) => record.mro_activity_id);

  // const operationChecklist = orderCheckLists && orderCheckLists.data && orderCheckLists.data.length > 0
  //   ? orderCheckLists.data : isChecklistJson && cheklistJsonObj ? cheklistJsonObj : taskQuestions;

  const [questionValues, setQuestions] = useState([]);

  // useEffect(() => {
  //   refresh();
  // }, []);

  useEffect(() => {
    setQuestions(questionValues);
  }, [loadAns]);

  useEffect(() => {
    if (mroActivityIds) {
      const ids = mroActivityIds || [];
      dispatch(getCheckListsJsonData(ids, appModels.ACTIVITY));
    }
  }, [workorderDetails]);

  /* useEffect(() => {
    setOperationChecklist([]);
    const arr = orderCheckLists.data || checklistOpInfo.data || cheklistJsonObj || taskQuestions;
    if (arr.length > 0) setOperationChecklist(arr);
    // if (orderCheckLists && orderCheckLists.data && orderCheckLists.data.length > 0) {
    //   setOperationChecklist(orderCheckLists.data);
    // } else if (isChecklistJson && cheklistJsonObj) {
    //   setOperationChecklist(cheklistJsonObj);
    // } else {
    //   setOperationChecklist(taskQuestions);
    // }
  }, [orderCheckLists && orderCheckLists.data && orderCheckLists.data.length > 0 || checklistOpInfo && checklistOpInfo.data && checklistOpInfo.data.length > 0 || cheklistJsonObj.length > 0 || taskQuestions.length > 0]); */

  useEffect(() => {
    if (operationChecklist && operationChecklist.length === 0) {
      if (orderCheckLists && orderCheckLists.data && orderCheckLists.data.length > 0) {
        setOperationChecklist(orderCheckLists.data);
      } else if (cheklistJsonObj && cheklistJsonObj.length > 0) {
        setOperationChecklist(cheklistJsonObj);
      } else if (checklistOpInfo && checklistOpInfo.data && checklistOpInfo.data.length > 0) {
        setOperationChecklist(checklistOpInfo.data);
      } else if (taskQuestions && taskQuestions.length > 0) {
        setOperationChecklist(taskQuestions);
      }
    }
  }, [operationChecklist, orderCheckLists, checklistOpInfo, cheklistJsonObj, taskQuestions]);

  useEffect(() => {
    if (!isChecklist && !isChecklistJson && workorder && workorder.task_id && workorder.task_id[0]) {
      const ids = workorder.task_id[0];
      dispatch(getOperationCheckListData(ids));
    }
  }, [workorderDetails]);

  useEffect(() => {
    setQuestions([]);
    if (
      operationChecklist
    && operationChecklist.length > 0
    && questionValues
    && questionValues.length === 0
    ) {
      const enriched = operationChecklist.map((item) => ({
        ...item,
        is_abnormal: 'is_abnormal' in item ? item.is_abnormal : false,
      }));
      setQuestions(enriched);
    }
  }, [operationChecklist]);

  function getPercentage(checklist) {
    let questionCount = 0;
    let answerCount = 0;
    if (checklist.length > 0) {
      questionCount = checklist.length;
      checklist.filter((obj) => {
        if (obj.answer_common) {
          answerCount += 1;
        }
      });
    }
    if (answerCount === 0) {
      return answerCount;
    }

    return parseFloat((answerCount / questionCount) * 100).toFixed(0);
  }

  function getPercentage1(checklist) {
    let questionCount = 0;
    let answerCount = 0;
    if (checklist.length > 0) {
      questionCount = checklist.length;
      answerValues.filter((obj) => {
        if (obj.answer_type !== 'suggestion' && obj.answer_type !== 'boolean' && obj.answer_common !== false) {
          answerCount += 1;
        }
        if (obj.answer_type === 'boolean' && (obj.type || obj.answer_common !== false)) {
          answerCount += 1;
        }
        if (obj.answer_type === 'suggestion' && obj.value_suggested !== false) {
          answerCount += 1;
        }
      });
    }
    if (answerCount === 0) {
      return answerCount;
    }

    return parseFloat((answerCount / questionCount) * 100).toFixed(0);
  }

  useEffect(() => {
    if (workorderDetails && workorderDetails.data) {
      const ids = workorderDetails.data.length > 0 ? workorderDetails.data[0].check_list_ids : [];
      dispatch(getOrderCheckLists(ids, appModels.CHECKLIST));
      setDetail([]);
    }
  }, [checkListModal]);

  useEffect(() => {
    if ((workorderDetails && workorderDetails.data) && (updateChecklist && updateChecklist.data)) {
      const ids = workorderDetails && workorderDetails.data && workorderDetails.data.length > 0 ? workorderDetails.data[0].check_list_ids : [];
      if (ids && ids.length > 0) {
        setDetail([]);
        setAnswerValues([]);
        setCurrentQuestion(0);
        dispatch(getOrderCheckLists(ids, appModels.CHECKLIST));
      }
    }
  }, [updateChecklist]);

  useEffect(() => {
    if ((workorderDetails && workorderDetails.data) && (removeChecklist && removeChecklist.data)) {
      const viewId = workorderDetails && workorderDetails.data ? workorderDetails.data[0].id : '';
      setDetail([]);
      setAnswerValues([]);
      setCurrentQuestion(0);
      dispatch(getOrderDetail(viewId, appModels.ORDER));
    }
  }, [removeChecklist]);

  useEffect(() => {
    if (orderCheckLists && orderCheckLists.data && orderCheckLists.data.length > 0 && detail && detail.length === 0) {
      setDetail(orderCheckLists.data[0]);
    }
  }, [orderCheckLists, detail]);

  useEffect(() => {
    if (checklistOpInfo && checklistOpInfo.data && checklistOpInfo.data.length > 0 && detail && detail.length === 0) {
      setDetail(checklistOpInfo.data[0]);
    }
  }, [checklistOpInfo, detail]);

  useEffect(() => {
    if (cheklistJsonObj && cheklistJsonObj.length > 0 && detail && detail.length === 0) {
      setDetail(cheklistJsonObj);
    }
  }, [cheklistJsonObj, detail]);

  useEffect(() => {
    if (orderCheckLists && orderCheckLists.data && orderCheckLists.data.length > 0) {
      const data = orderCheckLists.data.filter((item) => (item.answer_type === 'multiple_choice'));
      const newData = data.map((cl) => ({
        id: cl.id,
        value_text: cl.value_text,
        answer_type: 'multiple_choice',
      }));
      if (newData && newData.length) {
        setAnswerValues(newData);
        const data1 = getCommaArray(newData);
        setMultiAnswerValues(data1);
      }
      const valuesData = orderCheckLists.data.filter((item) => (item.answer_type === 'multiple_choice' || item.answer_type === 'suggestion'));
      dispatch(getExtraSelection(appModels.ACTIVITYLINES, getColumnArrayById(valuesData, 'value_suggested_ids').length, 0, 'value', '', getColumnArrayById(valuesData, 'value_suggested_ids')));
    }
  }, [orderCheckLists]);

  function checkDataFormat(data) {
    let res = data;
    if (typeof data === 'string') {
      if (isJsonString(data)) {
        res = getJsonString(data);
      } else {
        res = [];
      }
    }
    return res;
  }

  useEffect(() => {
    if (checklistOpInfo && checklistOpInfo.data && checklistOpInfo.data.length > 0) {
      const data = checklistOpInfo.data.filter((item) => (item.answer_type === 'multiple_choice'));
      const newData = data.map((cl) => ({
        id: cl.id,
        value_text: cl.value_text,
        answer_type: 'multiple_choice',
      }));
      if (newData && newData.length) {
        setAnswerValues(newData);
        const data1 = getCommaArray(newData);
        setMultiAnswerValues(data1);
      }
      const valuesData = checklistOpInfo.data.filter((item) => (item.answer_type === 'multiple_choice' || item.answer_type === 'suggestion' || item.answer_type === 'simple_choice'));
      const result = valuesData && valuesData.map(({ value_suggested_ids }) => value_suggested_ids);
      if (result && result.length > 0) {
        const IdData = [...mergeDataOne];
        result.forEach((element) => {
          checkDataFormat(element).forEach((datas) => {
            IdData.push(datas.id);
          });
        });
        setMergeDataOne(IdData);
        if (IdData && IdData.length > 0) { dispatch(getExtraSelection(appModels.ACTIVITYLINES, getColumnArrayById(IdData, 'value_suggested_ids').length, 0, 'value', '', getColumnArrayById(IdData, 'value_suggested_ids'))); }
      }
    }
  }, [checklistOpInfo]);

  useEffect(() => {
    if (questionValues && questionValues.length > 0) {
      const data = questionValues.filter((item) => (item.answer_type === 'multiple_choice'));
      const newData = data.map((cl) => ({
        id: cl.id,
        value_text: cl.value_text,
        answer_type: 'multiple_choice',
      }));
      if (newData && newData.length) {
        setAnswerValues(newData);
        const data1 = getCommaArray(newData);
        setMultiAnswerValues(data1);
      }
      const valuesData = questionValues.filter((item) => (item.answer_type === 'multiple_choice' || item.answer_type === 'suggestion' || item.answer_type === 'simple_choice'));
      const result = valuesData && valuesData.map(({ value_suggested_ids }) => value_suggested_ids);
      if (result && result.length > 0) {
        const IdData = [...mergeData];
        result.forEach((element) => {
          checkDataFormat(element).forEach((datas) => {
            IdData.push(datas.id);
          });
        });
        setMergeData(IdData);
        if (mergeData && mergeData.length > 0) { dispatch(getExtraSelection(appModels.ACTIVITYLINES, getColumnArrayById(IdData, 'value_suggested_ids').length, 0, 'value', '', getColumnArrayById(IdData, 'value_suggested_ids'))); }
      }
    }
  }, [questionValues]);

  // useEffect(() => {
  //   if (cheklistJsonObj && cheklistJsonObj.length > 0) {
  //     const data = cheklistJsonObj.filter((item) => (item.answer_type === 'multiple_choice'));
  //     const newData = data.map((cl) => ({
  //       id: cl.id,
  //       value_text: cl.value_text,
  //       answer_type: 'multiple_choice',
  //     }));
  //     if (newData && newData.length) {
  //       setAnswerValues(newData);
  //       const data1 = getCommaArray(newData);
  //       setMultiAnswerValues(data1);
  //     }
  //     const valuesData = cheklistJsonObj.filter((item) => (item.answer_type === 'multiple_choice' || item.answer_type === 'suggestion'));
  //     dispatch(getExtraSelection(appModels.ACTIVITYLINES, 1000, 0, 'value', '', getColumnArrayById(valuesData, 'value_suggested_ids')));
  //   }
  // }, [cheklistJsonObj]);

  useEffect(() => {
    setModal(checkListModal);
    setDetail([]);
  }, [checkListModal]);

  const onReset = () => {
    dispatch(resetUpdateCheckList());
    setShowReset(true);
    dispatch(resetUpdateCheckList());
    dispatch(resetRemoveCheckList());
    setCurrentQuestion(0);
    setModal(!modal);
    const viewId = workorderDetails && workorderDetails.data ? workorderDetails.data[0].id : '';
    dispatch(getOrderDetail(viewId, appModels.ORDER));
    atFinish();
  };

  const onRemoveReset = () => {
    dispatch(resetRemoveCheckList());
    setShowReset(true);
  };

  useEffect(() => {
    if (workorder && workorder.task_id && workorder.task_id[0] && !isChecklistJson && !isChecklist) {
      setTaskConfig({
        loading: true, data: null, count: 0, err: null,
      });

      const fields = '["id", "name", ["check_list_ids", ["id", ("check_list_id", ["id", ["activity_lines", ["id","name", "type", ("mro_quest_grp_id", ["id", "name"]),"has_attachment", "constr_mandatory","requires_verification","expected_min_number","expected_max_number","validation_required","validation_length_max","validation_length_min","validation_max_float_value","validation_min_float_value","constr_error_msg","validation_error_msg","is_enable_condition",("parent_id", ["id", "name"]),["based_on_ids", ["id"]]]]])]]]';
      const payload = `domain=[["id","=",${workorder.task_id[0]}]]&model=mro.task&fields=${fields}&offset=0&limit=1&portalDomain=${window.location.origin}`;

      const config = {
        method: 'get',
        url: `${WEBAPPAPIURL}public/api/v4/search?${payload}`,
        headers: {
          portalDomain: window.location.origin,
        },
      };

      axios(config)
        .then((response) => setTaskConfig({
          loading: false, data: response.data.data, count: response.data.length, err: null,
        }))
        .catch((error) => {
          setTaskConfig({
            loading: false, data: null, count: 0, err: error,
          });
        });
    }
  }, [workorder]);

  const taskData = taskConfig && taskConfig.data && taskConfig.data.length ? taskConfig.data[0] : false;
  const taskChecklists = taskData && taskData.check_list_ids && taskData.check_list_ids.length && taskData.check_list_ids[0].check_list_id && taskData.check_list_ids[0].check_list_id.activity_lines && taskData.check_list_ids[0].check_list_id.activity_lines.length ? taskData.check_list_ids[0].check_list_id.activity_lines : false;

  useEffect(() => {
    if (taskChecklists) {
      const newArrData = taskChecklists.map((cl) => ({
        id: cl.id,
        answer_type: cl.type,
        answer_common: false,
        is_abnormal: false,
        mro_activity_id: {
          based_on_ids: cl.based_on_ids,
          constr_error_msg: cl.constr_error_msg,
          constr_mandatory: cl.constr_mandatory,
          has_attachment: cl.has_attachment,
          id: cl.id,
          is_enable_condition: cl.is_enable_condition,
          name: cl.name,
          parent_id: cl.parent_id,
          requires_verification: cl.requires_verification,
          expected_min_number: cl.expected_min_number,
          expected_max_number: cl.expected_max_number,
          validation_error_msg: cl.validation_error_msg,
          validation_length_max: cl.validation_length_max,
          validation_length_min: cl.validation_length_min,
          validation_max_float_value: cl.validation_max_float_value,
          validation_min_float_value: cl.validation_min_float_value,
          validation_required: cl.validation_required,
        },
        mro_quest_grp_id: cl.mro_quest_grp_id,
        value_date: false,
        value_number: 0,
        value_suggested: {},
        value_suggested_ids: [],
        value_text: false,
        type: false,
      }));
      setTaskQuestions(newArrData);
    } else {
      setTaskQuestions([]);
    }
  }, [taskConfig]);

  useEffect(() => {
    if (operationChecklist) {
      const enriched = operationChecklist.map((item) => ({
        ...item,
        is_abnormal: 'is_abnormal' in item ? item.is_abnormal : false,
      }));
      setQuestions(enriched);
      setLoadAns(Math.random());
      const isAnswered = operationChecklist.filter((item) => item.answer_common && item.answer_common.length);
      if (isAnswered && isAnswered.length) {
        const newArrData = operationChecklist.map((cl) => ({
          id: cl.id,
          answer_type: cl.answer_type,
          value_text: cl.value_text,
          value_number: cl.value_number,
          value_suggested: cl && cl.value_suggested && cl.value_suggested.id ? cl.value_suggested.id : false,
          value_date: cl.value_date,
          type: cl.type,
        }));
        setAnswerValues(newArrData);
      }
    }
  }, [taskChecklists]);

  const handleCheckboxChange = (event, checklist, Index) => {
    const { checked, value } = event.target;
    let checkValue = 'False';
    let checkValueDb = false;
    if (checked && value === 'yes') {
      checkValue = 'True';
      checkValueDb = true;
    }
    const data = [{
      id: checklist.id, answer_type: checklist.answer_type, type: checkValue, answer_common: checkValue,
    }];
    const arr = [...answerValues, ...data];
    setAnswerValues([...new Map(arr.map((item) => [item.id, item])).values()]);
    const detailIndex = isChecklistJson ? questionValues.findIndex((obj) => (parseInt(obj.mro_activity_id) === parseInt(checklist.mro_activity_id))) : questionValues.findIndex((obj) => (extractValueObjects(obj.mro_activity_id) === extractValueObjects(checklist.mro_activity_id)));
    // questionValues[detailIndex].type = checkValue;
    questionValues[detailIndex].answer_common = checkValue;
    setLoadAns(Math.random());
    setQuestions(questionValues);
    setDetail(questionValues);
  };

  const handleCheckboxChange1 = (event, checklist, Index) => {
    const { checked, value } = event.target;
    let checkValue = 'False';
    let checkValueDb = false;
    if (checked && value === 'yes') {
      checkValue = 'True';
      checkValueDb = true;
    }
    const data = [{
      id: checklist.id, answer_type: checklist.answer_type, type: checkValue, answer_common: checkValue,
    }];
    const arr = [...answerValues, ...data];
    setAnswerValues([...new Map(arr.map((item) => [item.id, item])).values()]);
    const detailIndex = isChecklistJson ? questionValues.findIndex((obj) => (parseInt(obj.mro_activity_id) === parseInt(checklist.mro_activity_id))) : questionValues.findIndex((obj) => (extractValueObjects(obj.mro_activity_id) === extractValueObjects(checklist.mro_activity_id)));
    // questionValues[detailIndex].type = checkValue;
    questionValues[detailIndex].answer_common = checkValue;
    setLoadAns(Math.random());
    setQuestions(questionValues);
    setDetail(questionValues);
  };

  const handleInputChange = (event, checklist, index) => {
    const { value } = event.target;
    const newInputValues = [...inputValues];
    newInputValues[index] = event.target.value;
    setInputValues(newInputValues);
    let field = 'value_text';
    if (checklist.answer_type === 'number' || checklist.answer_type === 'numerical_box') {
      field = 'value_number';
    }
    if (checklist.answer_type === 'date') {
      field = 'value_date';
    }
    if (checklist.answer_type === 'suggestion' || checklist.answer_type === 'simple_choice') {
      field = 'value_suggested';
    }
    const data = [{ id: checklist.id, answer_type: checklist.answer_type, [field]: value }];
    const arr = [...answerValues, ...data];
    setAnswerValues([...new Map(arr.map((item) => [item.id, item])).values()]);
    // const detailIndex = detail.findIndex((obj) => (obj.id === checklist.id));
    // detail[detailIndex][field] = value;
    // setDetail(detail);
    // const detailIndex = questionValues.findIndex((obj) => (obj.id === checklist.id));
    const detailIndex = isChecklistJson ? questionValues.findIndex((obj) => (parseInt(obj.mro_activity_id) === parseInt(checklist.mro_activity_id))) : questionValues.findIndex((obj) => (extractValueObjects(obj.mro_activity_id) === extractValueObjects(checklist.mro_activity_id)));
    if (checklist.mro_activity_id && checklist.mro_activity_id.requires_verification && (checklist.answer_type === 'numerical_box' || checklist.answer_type === 'number' || checklist.answer_type === 'smart_logger')) {
      if (value) {
        const numValue = parseFloat(value);
        if (numValue < parseFloat(checklist.mro_activity_id.expected_min_number) || numValue > parseFloat(checklist.mro_activity_id.expected_max_number)) {
          setValidationMessage('abnormal');
          setErrorId(checklist.id);
          questionValues[detailIndex].is_abnormal = true;
        } else {
          setValidationMessage('');
          setErrorId(false);
          questionValues[detailIndex].is_abnormal = false;
        }
      } else {
        setValidationMessage('');
        setErrorId(false);
        questionValues[detailIndex].is_abnormal = false;
      }
    } else if (checklist.requires_verification && checklist.expected_min_number && checklist.expected_max_number && (checklist.answer_type === 'numerical_box' || checklist.answer_type === 'number' || checklist.answer_type === 'smart_logger')) {
      if (value) {
        const numValue = parseFloat(value);
        if (numValue < parseFloat(checklist.expected_min_number) || numValue > parseFloat(checklist.expected_max_number)) {
          setValidationMessage('abnormal');
          setErrorId(checklist.id);
          questionValues[detailIndex].is_abnormal = true;
        } else {
          setValidationMessage('');
          setErrorId(false);
          questionValues[detailIndex].is_abnormal = false;
        }
      } else {
        setValidationMessage('');
        setErrorId(false);
        questionValues[detailIndex].is_abnormal = false;
      }
    }
    questionValues[detailIndex][field] = value;
    questionValues[detailIndex].answer_common = value;
    setLoadAns(Math.random());
    setQuestions(questionValues);
    setDetail(questionValues);
    if (!value && checklist && checklist.mro_activity_id && checklist.mro_activity_id.constr_mandatory) {
      setValidationMessage(checklist?.mro_activity_id?.constr_error_msg);
      setErrorId(checklist.id);
    } else {
      setValidationMessage('');
      setErrorId(false);
    }
  };

  const handleSuggestionSelect = (svalue, checklist, index) => {
    const value = svalue ? svalue.id : false;
    const field = 'value_suggested';
    const data = [{
      id: checklist.id, answer_type: checklist.answer_type, [field]: value,
    }];
    const arr = [...answerValues, ...data];
    setAnswerValues([...new Map(arr.map((item) => [item.id, item])).values()]);

    // const detailIndex = detail.findIndex((obj) => (obj.id === checklist.id));
    // detail[detailIndex][field] = value;
    // setDetail(detail);
    // const detailIndex = questionValues.findIndex((obj) => (obj.id === checklist.id));
    const detailIndex = isChecklistJson ? questionValues.findIndex((obj) => (parseInt(obj.mro_activity_id) === parseInt(checklist.mro_activity_id))) : questionValues.findIndex((obj) => (extractValueObjects(obj.mro_activity_id) === extractValueObjects(checklist.mro_activity_id)));
    questionValues[detailIndex][field] = value;
    questionValues[detailIndex].answer_common = value;
    setLoadAns(Math.random());
    setQuestions(questionValues);
    setDetail(questionValues);
  };

  const handleSuggestionSelect1 = (svalue, checklist, index) => {
    const value = svalue ? svalue.id : false;
    const field = 'value_suggested';
    const data = [{
      id: checklist.id, answer_type: checklist.answer_type, [field]: value,
    }];
    const arr = [...answerValues, ...data];
    setAnswerValues([...new Map(arr.map((item) => [item.id, item])).values()]);

    // const detailIndex = detail.findIndex((obj) => (obj.id === checklist.id));
    // detail[detailIndex][field] = value;
    // setDetail(detail);
    // const detailIndex = questionValues.findIndex((obj) => (obj.id === checklist.id));
    const detailIndex = isChecklistJson ? questionValues.findIndex((obj) => (parseInt(obj.mro_activity_id) === parseInt(checklist.mro_activity_id))) : questionValues.findIndex((obj) => (extractValueObjects(obj.mro_activity_id) === extractValueObjects(checklist.mro_activity_id)));
    questionValues[detailIndex][field] = value;
    questionValues[detailIndex].answer_common = svalue.value;
    questionValues[detailIndex].value_suggested_ids = checklist.value_suggested_ids;
    setLoadAns(Math.random());
    setQuestions(questionValues);
    setDetail(questionValues);
  };

  const handleCheckMultiChange = (event, checklist, lids) => {
    const { checked } = event.target;
    const checkedData = answerValues.filter((item) => (item.id === checklist.id));
    const isCheckedData = checkedData && checkedData.length;
    if (isCheckedData) {
      if (checked) {
        const data = [{
          id: checklist.id, value_text: lids.value, answer_type: checklist.answer_type,
        }];
        const arr = [...answerMultiValues, ...data];
        setMultiAnswerValues(arr);
      } else {
        const checkedAnsData = answerMultiValues.filter((item) => (item.id === checklist.id));
        const ansCheckCount = checkedAnsData && checkedAnsData.length ? checkedAnsData.length : 0;
        if (ansCheckCount === 1) {
          setAnswerValues(answerValues.filter((item) => (item.id !== checklist.id)));
        }
        setMultiAnswerValues(answerMultiValues.filter((item) => (item.value_text !== lids.value)));
      }
    }
    if (!isCheckedData) {
      if (checked) {
        const data = [{ id: checklist.id, value_text: [lids.id], answer_type: checklist.answer_type }];
        const arr1 = [...answerValues, ...data];
        setAnswerValues([...new Map(arr1.map((item) => [item.id, item])).values()]);
        const data1 = [{ id: checklist.id, value_text: lids.value, answer_type: checklist.answer_type }];
        const arr = [...answerMultiValues, ...data1];
        setMultiAnswerValues(arr);
        // setQuestions(arr);
      } else {
        setMultiAnswerValues(answerMultiValues.filter((item) => (item.id !== checklist.id)));
        // setQuestions(answerMultiValues.filter((item) => (item.id !== checklist.id)));
      }
    }
  };

  function getAnsListstr(str) {
    let res = [];
    if (str) {
      const arr = str.split(',');
      res = arr && arr.length ? arr.map((cl) => ({
        id: cl,
        value_text: cl,
      })) : [];
    }
    return res;
  }

  const handleCheckMultiChange1 = (event, checklist, lids, index) => {
    const { checked } = event.target;
    const checkedData = answerValues.filter((item) => (item.id === checklist.id));
    const isCheckedData = checkedData && checkedData.length;
    if (isCheckedData) {
      if (checked) {
        const data = [{
          id: checklist.id, answer_id: lids.id, value_text: lids.value, answer_type: checklist.answer_type,
        }];
        const data1 = {
          id: lids.id, value: lids.value,
        };
        const arr = [...answerMultiValues, ...data];

        const arr1 = [...multiData];
        arr1.push(data1);
        setMultiData(arr1);
        setMultiAnswerValues(arr);
        const detailIndex = isChecklistJson ? questionValues.findIndex((obj) => (parseInt(obj.mro_activity_id) === parseInt(checklist.mro_activity_id))) : questionValues.findIndex((obj) => (extractValueObjects(obj.mro_activity_id) === extractValueObjects(checklist.mro_activity_id)));
        questionValues[detailIndex].answer_common = getColumnArrayById([...new Map(arr.map((item) => [item.answer_id, item])).values()], 'value_text').toString();
        setLoadAns(Math.random());
        setQuestions(questionValues);
        setDetail(questionValues);
      } else {
        const data = [{
          id: checklist.id, answer_id: lids.id, value_text: lids.value, answer_type: checklist.answer_type,
        }];
        const arr = [...answerMultiValues, ...data];
        setMultiDataCheck(arr);
        setMultiAnswerValues(arr.filter((item) => (item.value_text !== lids.value)));
        const detailIndex = isChecklistJson ? questionValues.findIndex((obj) => (parseInt(obj.mro_activity_id) === parseInt(checklist.mro_activity_id))) : questionValues.findIndex((obj) => (extractValueObjects(obj.mro_activity_id) === extractValueObjects(checklist.mro_activity_id)));
        questionValues[detailIndex].answer_common = getColumnArrayById(answerMultiValues.filter((item) => (item.answer_id !== lids.id)), 'value_text').toString();
        setLoadAns(Math.random());
        setQuestions(questionValues);
        setDetail(questionValues);
      }
    }
    if (!isCheckedData) {
      if (checked) {
        const data = [{
          id: checklist.id, answer_id: lids.id, value_text: [lids.id], answer_type: checklist.answer_type,
        }];
        const arr1 = [...answerValues, ...data];
        setAnswerValues([...new Map(arr1.map((item) => [item.id, item])).values()]);
        const data1 = [{
          id: checklist.id, answer_id: lids.id, value_text: lids.value, answer_type: checklist.answer_type,
        }];
        const arr = [...answerMultiValues, ...data1];
        setMultiAnswerValues(arr);
        const detailIndex = isChecklistJson ? questionValues.findIndex((obj) => (parseInt(obj.mro_activity_id) === parseInt(checklist.mro_activity_id))) : questionValues.findIndex((obj) => (extractValueObjects(obj.mro_activity_id) === extractValueObjects(checklist.mro_activity_id)));
        questionValues[detailIndex].answer_common = getColumnArrayById([...new Map(arr.map((item) => [item.answer_id, item])).values()], 'value_text').toString();
        setLoadAns(Math.random());
        setQuestions(questionValues);
        setDetail(questionValues);
        // setQuestions(arr);
      } else {
        setMultiAnswerValues(answerMultiValues.filter((item) => (item.id !== checklist.id)));
        const detailIndex = isChecklistJson ? questionValues.findIndex((obj) => (parseInt(obj.mro_activity_id) === parseInt(checklist.mro_activity_id))) : questionValues.findIndex((obj) => (extractValueObjects(obj.mro_activity_id) === extractValueObjects(checklist.mro_activity_id)));
        questionValues[detailIndex].answer_common = getColumnArrayById(answerMultiValues.filter((item) => (item.answer_id !== lids.id)), 'value_text').toString();
        setLoadAns(Math.random());
        setQuestions(questionValues);
        setDetail(questionValues);
        // setQuestions(answerMultiValues.filter((item) => (item.id !== checklist.id)));
      }
    }
  };

  const checkSuggestedId = (sid, suggestedIds) => {
    const ids = suggestedIds && suggestedIds.length > 0 ? checkDataFormat(suggestedIds) : [];
    let slabel = '';
    if (sid && isChecklistJson) {
      const listOptions = suggestedIds && suggestedIds.length > 0 ? checkDataFormat(suggestedIds) : [];
      const result = listOptions.filter((item) => (item.id === sid));
      slabel = result && result.length ? result[0].name : '';
    } else if (sid && ids.length > 0 && listDataInfo && listDataInfo.data && listDataInfo.data.length > 0) {
      const result = listDataInfo.data.filter((item) => (item.id === sid));
      slabel = result && result.length ? result[0].value : '';
    }
    return slabel;
  };

  const checkSuggestedIdCheck = (sid, suggestedIds) => {
    const results = suggestedIds && suggestedIds.length > 0 ? checkDataFormat(suggestedIds).map(({ id }) => id) : [];
    const ids = results && results.length > 0 ? results : [];
    let slabel = '';
    if (sid && isChecklistJson) {
      const listOptions = suggestedIds && suggestedIds.length > 0 ? checkDataFormat(suggestedIds) : [];
      const result = listOptions.filter((item) => (item.name === sid.answer_common));
      slabel = result && result.length ? result[0].name : '';
    } else if (sid && ids.length > 0 && listDataInfo && listDataInfo.data && listDataInfo.data.length > 0) {
      const result = listDataInfo.data.filter((item) => (item.value === sid.answer_common));
      slabel = result && result.length ? result[0].value : '';
    }
    return slabel;
  };

  const checkSuggestedIdOp = (sid, suggestedIds) => {
    const results = suggestedIds && suggestedIds.length > 0 ? checkDataFormat(suggestedIds).map(({ id }) => id) : [];
    const ids = results && results.length > 0 ? results : [];
    let slabel = '';
    if (sid && isChecklistJson) {
      const listOptions = suggestedIds && suggestedIds.length > 0 ? checkDataFormat(suggestedIds) : [];
      const result = listOptions.filter((item) => (item.id === sid));
      slabel = result && result.length ? result[0].name : '';
    } else if (sid && ids.length > 0 && listDataInfo && listDataInfo.data && listDataInfo.data.length > 0) {
      const result = listDataInfo.data.filter((item) => (item.id === sid));
      slabel = result && result.length ? result[0].value : '';
    }
    return slabel;
  };

  const checkSuggestedValue = (index, suggestedIds) => {
    const ids = suggestedIds && suggestedIds.length > 0 ? checkDataFormat(suggestedIds) : [];
    let options = [];
    if (isChecklistJson) {
      const listOptions = suggestedIds && suggestedIds.length > 0 ? checkDataFormat(suggestedIds) : [];

      options = listOptions && listOptions.length ? listOptions.map((cl) => ({
        id: cl.id,
        value: cl.name,
      })) : [];
    } else if (ids.length > 0 && listDataInfo && listDataInfo.data && listDataInfo.data.length > 0) {
      listDataInfo.data.map((data) => {
        for (let j = 0; j < ids.length; j += 1) {
          if (ids[j] === data.id) {
            options.push(data);
          }
        }
      });
    }
    return options;
  };

  const checkSuggestedValue1 = (index, suggestedIds) => {
    const result = suggestedIds && suggestedIds.length > 0 ? checkDataFormat(suggestedIds).map(({ id }) => id) : [];
    const ids = result && result.length > 0 ? result : [];
    let options = [];
    if (isChecklistJson) {
      const listOptions = suggestedIds && suggestedIds.length > 0 ? checkDataFormat(suggestedIds) : [];

      options = listOptions && listOptions.length ? listOptions.map((cl) => ({
        id: cl.id,
        value: cl.name,
      })) : [];
    } else if (ids.length > 0 && listDataInfo && listDataInfo.data && listDataInfo.data.length > 0) {
      listDataInfo.data.map((data) => {
        for (let j = 0; j < ids.length; j += 1) {
          if (ids[j] === data.id) {
            options.push(data);
          }
        }
      });
    }
    return options;
  };

  function checkAnsweredQuestion(checklist) {
    let answerCount = 0;
    if (checklist && checklist.length > 0) {
      const filter = checklist.filter((obj) => (obj.answer_common !== false));
      answerCount = filter.length;
    }
    return answerCount;
  }

  function checkAnsweredQuestion1(checklist) {
    const valueData = [];
    if (multiData && multiData.length > 0) {
      multiData.map((item) => valueData.push(item.value));
    }
    const newArrData = checklist && checklist.length ? checklist.map((cl) => ({
      check_list_id: cl.id,
      answer_type: cl.answer_type,
      // eslint-disable-next-line quotes
      answer_common: cl.answer_common ? cl.answer_common : false,
      value_suggested: cl && cl.value_suggested && cl.value_suggested.id ? cl.value_suggested.id : false,
    })) : [];
    let answerCount = 0;
    if (checklist && checklist.length > 0) {
      const filter = newArrData.filter((obj) => obj.answer_common !== false && obj.answer_common !== '');
      answerCount = filter.length;
    }
    return answerCount;
  }

  const getProgressColor = (percentage) => {
    let color = 'secondary';
    if (percentage >= 1 && percentage < 30) {
      color = 'danger';
    }
    if (percentage >= 30 && percentage < 50) {
      color = 'primary';
    }
    if (percentage >= 50 && percentage < 70) {
      color = 'warning';
    }
    if (percentage >= 70 && percentage < 90) {
      color = 'info';
    }
    if (percentage >= 90) {
      color = 'success';
    }
    return color;
  };

  const getInputType = (type) => {
    let inputType = 'text';
    if (type === 'date') {
      inputType = 'date';
    }
    if (type === 'boolean') {
      inputType = 'checkbox';
    }
    return inputType;
  };

  const getmaxLength = (type) => {
    let maxlength = '7';
    if (type === 'text' || type === 'textbox') {
      maxlength = '50';
    }
    return maxlength;
  };

  const getAnswer = (checklist) => {
    let answer = '';
    if (checklist.answer_type === 'text' || checklist.type === 'textbox') {
      answer = checklist.value_text ? checklist.value_text : '';
    }
    if (checklist.answer_type === 'number' || checklist.answer_type === 'numerical_box') {
      if (checklist.value_number === '') {
        answer = checklist.value_number;
      } else {
        answer = checklist.value_number ? parseInt(checklist.value_number) : '';
      }
    }
    if (checklist.answer_type === 'date') {
      answer = checklist.value_date;
    }
    if (checklist.answer_type === 'boolean') {
      if (checklist.answer_common === 'True') {
        answer = 'yes';
      } else if (checklist.answer_common === 'False') {
        answer = 'no';
      } else {
        answer = '';
      }
    }
    return answer;
  };

  const getStatus = (checklist) => {
    let questionCount = 0;
    let status = 'pending';
    let answerCount = 0;
    if (checklist.length > 0) {
      questionCount = checklist.length;
      checklist.filter((obj) => {
        if (obj.answer_common) {
          answerCount += 1;
        }
      });
    }
    if (questionCount > 0) {
      if (questionCount === answerCount) {
        status = 'completed';
      }
    }

    return status;
  };

  function isMultiChecked(checklist, lids) {
    let res1 = false;
    const isData = answerMultiValues.filter((item) => (item.value_text === lids.value));
    if (isData && isData.length) {
      res1 = true;
    }
    return res1;
  }

  const dataCheck = [];

  function isMultiChecked1(checklist, lids) {
    let res1 = false;
    const str = checklist && checklist.answer_common;
    // eslint-disable-next-line quotes
    const arr = str && str.split(",");
    /* const arrData = arr && arr.length > 0 && arr.map((value_text) => ({ value_text }));
    // dataCheck = arrData && arrData.filter((s) => s.value_text !== multiDataCheck.value_text);
    dataCheck = arrData.filter((s) => !multiDataCheck.some((m) => m.value_text === s.value_text));
    const requiredData = dataCheck && dataCheck.length > 0 ? dataCheck : arrData;
    const arrMulti = [...answerMultiValues, ...requiredData]; */
    const requiredData = arr && arr.length ? arr.map((cl) => ({
      id: cl,
      value_text: cl,
    })) : [];
    const arrMulti = [...answerMultiValues, ...requiredData];
    const arrMultis = [...new Map(arrMulti.map((item) => [item.value_text, item])).values()];
    // const isData = arr.filter((item) => (item === lids.value)); // arrMulti.filter((item) => (item.value_text === lids.value));
    const isData = requiredData.filter((item) => (item.value_text === lids.value));
    if (isData && isData.length) {
      res1 = true;
    }
    return res1;
  }

  const workorderData = workorderDetails && (workorderDetails.data && workorderDetails.data.length > 0) ? workorderDetails.data[0] : '';

  const sections = orderCheckLists && orderCheckLists.data && orderCheckLists.data.length > 0 ? groupByMultiple(orderCheckLists.data, (obj) => obj.mro_quest_grp_id) : [];
  const sectionsOp = checklistOpInfo && checklistOpInfo.data && checklistOpInfo.data.length > 0 ? groupByMultiple(checklistOpInfo.data, (obj) => obj.mro_quest_grp_id) : [];

  const checkSections = isChecklistJson && cheklistJsonObj ? groupByMultiple(cheklistJsonObj, (obj) => (obj.checklist_question_header ? obj.checklist_question_header : '')) : [];

  useEffect(() => {
    if (sections && sections.length > 0 && detail.length === 0) {
      setDetail(sections[0]);
    }
  }, [sections, modal]);

  useEffect(() => {
    if (sectionsOp && sectionsOp.length > 0 && detail.length === 0) {
      setDetail(sectionsOp[0]);
    }
  }, [sectionsOp, modal]);

  useEffect(() => {
    if (checkSections && checkSections.length > 0 && detail.length === 0) {
      setDetail(checkSections[0]);
    }
  }, [checkSections, modal]);

  const percentage = getPercentage((orderCheckLists && orderCheckLists.data && orderCheckLists.data.length) ? orderCheckLists.data : 0);
  const percentageOp = getPercentage((questionValues && questionValues.length) ? questionValues : 0);

  function checklistData(id) {
    const datas = checkListsJson && checkListsJson.data && checkListsJson.data.find((obj) => obj.id === id);
    if (datas) {
      return datas.name;
    }
    return '';
  }

  const userEmployeeId = userInfo && userInfo.data && userInfo.data.employee && userInfo.data.employee.id;
  const userEmployeeName = userInfo && userInfo.data && userInfo.data.employee && userInfo.data.employee.name;
  const assignEmployeeId = workorderData && workorderData.employee_id.length && workorderData.employee_id[0];

  const isNewEmployee = userEmployeeId && assignEmployeeId && (userEmployeeId !== assignEmployeeId);

  const handleSubmit = () => {
    let postData = {};
    /* if (orderCheckLists && orderCheckLists.data && orderCheckLists.data.length > 0) {
      const newData = getMergedAnswers(answerValues, answerMultiValues);
      postData = {
        check_list_ids: getArrayNewFormatUpdate(newData),
      };
    } */ if (questionValues && questionValues.length && questionValues.length > 0) {
      const data = checklistOpInfo && checklistOpInfo.data && checklistOpInfo.data.length > 0 && checklistOpInfo.data.filter((item) => (item.answer_type === 'multiple_choice'));
      const data2 = cheklistJsonObj && cheklistJsonObj.length > 0 && cheklistJsonObj.filter((item) => (item.answer_type === 'multiple_choice'));

      const suggestedData = data && data[0] && data[0].value_suggested_ids ? data[0].value_suggested_ids : data2 && data2[0] && data2[0].value_suggested_ids;
      const suggestedData1 = data2 && data2[0] && data2[0].answer_common ? data2[0].answer_common : '';
      const datasugg = checklistOpInfo && checklistOpInfo.data && checklistOpInfo.data.length > 0 && checklistOpInfo.data.filter((item) => (item.answer_type === 'simple_choice' || item.answer_type === 'suggestion'));
      const datasugg2 = cheklistJsonObj && cheklistJsonObj.length > 0 && cheklistJsonObj.filter((item) => (item.answer_type === 'simple_choice' || item.answer_type === 'suggestion'));
      const valueSuggestIds = datasugg && datasugg[0] && datasugg[0].value_suggested_ids ? datasugg[0].value_suggested_ids : datasugg2 && datasugg2[0] && datasugg2[0].value_suggested_ids;
      const valueData = [];
      if (multiData && multiData.length > 0) {
        multiData.map((item) => valueData.push(item.value));
      }
      // const checkListData = dataCheck && dataCheck.length > 0 && dataCheck.map((item) => item.value_text);
      const mergedArray = valueData.concat(suggestedData1);
      const newArrData = questionValues && questionValues.length ? questionValues.map((cl) => ({
        check_list_id: cl.id,
        answer_type: cl.answer_type,
        // eslint-disable-next-line quotes
        answer_common: cl.answer_common,
        is_abnormal: cl.is_abnormal,
        mro_activity_id: cl.mro_activity_id && cl.mro_activity_id.id ? cl.mro_activity_id.id : cl.mro_activity_id ? cl.mro_activity_id : '',
        checklist_question: cl.mro_activity_id && cl.mro_activity_id.name ? cl.mro_activity_id.name : cl.checklist_question ? cl.checklist_question : '',
        checklist_question_header: cl.mro_quest_grp_id && cl.mro_quest_grp_id.name ? cl.mro_quest_grp_id.name : '',
        value_suggested: cl.value_suggested && cl.value_suggested.id ? cl.value_suggested.id : false,
        value_suggested_ids: cl.answer_type === 'multiple_choice' ? suggestedData : valueSuggestIds,
      })) : [];
      postData = {
        checklist_json_data: JSON.stringify(newArrData),
      };
      if (isNewEmployee) {
        postData = {
          checklist_json_data: JSON.stringify(newArrData),
          employee_id: userEmployeeId,
        };
      }
    }
    const editId = workorderDetails && workorderDetails.data && workorderDetails.data.length > 0 ? workorderDetails.data[0].id : '';
    dispatch(updateChecklistAnswer(editId, postData, appModels.ORDER));
    dispatch(resetSuggestedCheckedRows());
    setShowReset(false);
  };
  const checkWorkOrderPriority = (val) => (
    <Box>
      {workOrderPrioritiesJson.map(
        (priority) => val === priority.priority && (
        <Typography
          sx={{
            color: priority.color,
          }}
        >
          {priority.text}
        </Typography>
        ),
      )}
    </Box>
  );
  const checkOderStatus = (val) => (
    <Box>
      {workorderStatusJson.map(
        (status) => val === status.status && (
        <Box
          sx={{
            backgroundColor: status.backgroundColor,
            padding: '4px 8px 4px 8px',
            border: 'none',
            borderRadius: '4px',
            color: status.color,
            fontFamily: 'Suisse Intl',
          }}
        >
          {status.text}
        </Box>
        ),
      )}
    </Box>
  );

  const answered = (questionValues && questionValues.length) ? checkAnsweredQuestion1(questionValues) : (orderCheckLists && orderCheckLists.data && orderCheckLists.data.length) ? checkAnsweredQuestion(orderCheckLists.data) : 0;
  const total = (orderCheckLists && orderCheckLists.data && orderCheckLists.data.length) ? orderCheckLists.data.length : (checklistOpInfo && checklistOpInfo.data && checklistOpInfo.data.length) ? checklistOpInfo.data.length : (cheklistJsonObj) ? cheklistJsonObj.length : 0;

  return (
    <Dialog maxWidth="xl" open={checkListModal}>
      <DialogHeader rightButton title="Check List" subtitle="Please answer all the questions" onClose={toggle} imagePath={checklistIcon} sx={{ width: '1000px' }} />
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Box
            sx={{
              width: '100%',
              height: '100%',
              backgroundColor: '#F6F8FA',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10%',
              fontFamily: 'Suisse Intl',
            }}
          >
            {workorderDetails && (workorderDetails.data && workorderDetails.data.length > 0) && (
              <Row>
                <Col md="12" sm="12" xs="12" lg="12">
                  <Card className="mb-2">
                    <CardBody className="font-tiny">
                      <Row>
                        <Col md="1" xs="1" sm="1" lg="1">
                          <img src={workOrdersIcon} alt="asset" width="30" height="30" className="mr-4" />
                        </Col>
                        <Col md="7" sm="7" xs="7" lg="7">
                          <h4 className="mb-1 font-weight-800 font-medium" title={workorderData.name}>{workorderData.name}</h4>
                          <p className="mb-1 font-weight-400 mt-1 font-tiny">
                            {workorderData.sequence}
                          </p>
                          {checkOderStatus(workorderData.state)}
                          {checkWorkOrderPriority(workorderData.priority)}
                        </Col>
                        <Col md="4" sm="4" xs="4" lg="4">
                          <div className="text-center font-weight-600">
                            Completed (
                            {(questionValues && questionValues.length) ? checkAnsweredQuestion1(questionValues) : (orderCheckLists && orderCheckLists.data && orderCheckLists.data.length) ? checkAnsweredQuestion(orderCheckLists.data) : 0}
                            /
                            {(orderCheckLists && orderCheckLists.data && orderCheckLists.data.length) ? orderCheckLists.data.length : (checklistOpInfo && checklistOpInfo.data && checklistOpInfo.data.length) ? checklistOpInfo.data.length : (cheklistJsonObj) ? cheklistJsonObj.length : 0}
                            )
                          </div>
                          {isChecklist
                            ? <Progress value={percentage} color={getProgressColor(percentage)}>
                              {percentage}
                              {' '}
                              %
                            </Progress>
                            : <Progress value={percentageOp} color={getProgressColor(percentageOp)}>
                              {percentageOp}
                              {' '}
                              %
                            </Progress>}
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            )}
            <Row className="pt-2">
              <Col md="4" sm="4" lg="4" xs="12" className="pr-0">
                <Card className="p-0 h-100">
                  <CardTitle className="p-2 bg-lightblue mb-1 text-center border-bottom sfilterarrow">
                    <h5 className="font-size-13 mb-0 textwrapdots font-weight-700">
                      Questions (
                      {(orderCheckLists && orderCheckLists.data && orderCheckLists.data.length) ? orderCheckLists.data.length : (checklistOpInfo && checklistOpInfo.data && checklistOpInfo.data.length) ? checklistOpInfo.data.length : (cheklistJsonObj && cheklistJsonObj.length) ? cheklistJsonObj.length : 0}
                      )
                    </h5>
                  </CardTitle>
                  <div className="mb-3 overflow-auto thin-scrollbar">
                    <ThemeProvider theme={theme}>
                      {((orderCheckLists && orderCheckLists.loading) || (checklistOpInfo && checklistOpInfo.loading)) && (
                        <div className="mb-2 mt-3 p-5" data-testid="loading-case">
                          <Loader />
                        </div>
                      )}
                      <List>
                        {isChecklist && sections && sections.length > 0 && sections.map((section, i) => (
                          <ListItem
                            button
                            key={section.id}
                            selected={i === currentQuestion}
                            className={i === currentQuestion ? 'bg-color-orange' : ''}
                            onClick={() => { setCurrentQuestion(i); setDetail(section); }}
                          >
                            {getStatus(section || []) === 'completed'
                              ? <img src={fullyAssignIcon} className="height-15 mr-2" alt="completed" />
                              : <img src={inProgress} className="height-15 mr-2" alt="inprogress" />}
                            <ListItemText
                              className={getStatus(section || []) === 'completed' ? 'text-success' : ''}
                              primary={(section && section[0].mro_quest_grp_id && section[0].mro_quest_grp_id[1] ? section[0].mro_quest_grp_id[1] : 'General')}
                            />
                          </ListItem>
                        ))}
                        {!isChecklist && checklistOpInfo && !isChecklistJson && sectionsOp && sectionsOp.length > 0 && sectionsOp.map((section, i) => (
                          <ListItem
                            button
                            key={section.id}
                            selected={i === currentQuestion}
                            className={i === currentQuestion ? 'bg-color-orange' : ''}
                            onClick={() => { setCurrentQuestion(i); setDetail(section); }}
                          >
                            {getStatus(section || []) === 'completed'
                              ? <img src={fullyAssignIcon} className="height-15 mr-2" alt="completed" />
                              : <img src={inProgress} className="height-15 mr-2" alt="inprogress" />}
                            <ListItemText
                              className={getStatus(section || []) === 'completed' ? 'text-success' : ''}
                              primary={(section && section[0].mro_quest_grp_id && section[0].mro_quest_grp_id.name ? section[0].mro_quest_grp_id.name : 'General')}
                            />
                          </ListItem>
                        ))}
                        {!isChecklist && cheklistJsonObj && isChecklistJson && checkSections && checkSections.length > 0 && checkSections.map((section, i) => (
                          <ListItem
                            button
                            key={section.id}
                            selected={i === currentQuestion}
                            className={i === currentQuestion ? 'bg-color-orange' : ''}
                            onClick={() => { setCurrentQuestion(i); setDetail(section); }}
                          >
                            {getStatus(section || []) === 'completed'
                              ? <img src={fullyAssignIcon} className="height-15 mr-2" alt="completed" />
                              : <img src={inProgress} className="height-15 mr-2" alt="inprogress" />}
                            <ListItemText
                              className={getStatus(section || []) === 'completed' ? 'text-success' : ''}
                              primary={(section && section[0].mro_quest_grp_id && section[0].mro_quest_grp_id.name ? section[0].mro_quest_grp_id.name : 'General')}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </ThemeProvider>
                  </div>
                </Card>
              </Col>
              <Col md="8" sm="8" lg="8" xs="12">
                <Card className="mb-2 h-100">
                  <CardBody className="pt-1 pb-1 bg-lightblue check-list-scroll thin-scrollbar">
                    {(orderCheckLists && orderCheckLists.err && checklistOpInfo && checklistOpInfo.err && cheklistJsonObj && cheklistJsonObj.err) && (
                    <ErrorContent errorTxt={generateErrorMessage(orderCheckLists)} />
                    )}
                    <Row>
                      {(!isChecklist && (cheklistJsonObj && cheklistJsonObj.length > 0))
                        ? (<Col md="12" sm="12" lg="12" xs="12" className="pt-2 pb-2">
                          <h5 className="font-size-13 pb-1 font-weight-700">{detail && detail.length && detail[0].mro_quest_grp_id ? detail[0].mro_quest_grp_id.name : ''}</h5>
                          {questionValues && questionValues.length
                            ? questionValues.map((item, index) => (
                              <Row className="pb-2">
                                <Col md="12" sm="12" xs="12" lg="12">
                                  <Card>
                                    <CardBody className="p-2">
                                      <Row className="font-weight-600">
                                        <Col md="1" sm="1" xs="1" lg="1">
                                          <img
                                            alt="questionIcon"
                                            width="18"
                                            height="18"
                                            className="mr-2 mb-2 mt-2"
                                            src={questionIcon}
                                          />
                                        </Col>
                                        <Col md="9" sm="9" xs="9" lg="9">
                                          {item.checklist_question ? item.checklist_question : checklistData(item.mro_activity_id)}
                                        </Col>
                                        <Col md="2" sm="2" xs="2" lg="2" className="text-right">
                                          {(item.answer_type === 'suggestion' && item.value_suggested) && (
                                            <img alt="assigned" width="17" height="17" className="mr-1" src={fullyAssignIcon} />
                                          )}
                                          {(item.answer_common && item.answer_type !== 'suggestion') && (
                                            <img alt="assigned" width="17" height="17" className="mr-1" src={fullyAssignIcon} />
                                          )}
                                        </Col>
                                      </Row>
                                      <hr className="mt-0 mb-2" />
                                      <Row className="font-weight-400">
                                        <Col md="1" sm="1" xs="1" lg="1">
                                          <img
                                            alt="answerIcon"
                                            width="18"
                                            height="18"
                                            className="mr-2 mb-2 mt-2"
                                            src={answerIcon}
                                          />
                                        </Col>
                                        {item.answer_type === 'suggestion' || item.answer_type === 'simple_choice'
                                          ? (
                                            <Col md="11" sm="11" xs="11" lg="11">
                                              <Autocomplete
                                                name="value_suggested_id"
                                                size="small"
                                                onChange={(_event, newValue) => {
                                                  handleSuggestionSelect1(newValue, item, index);
                                                }}
                                                disableClearable={!(item.value_suggested)}
                                                value={checkSuggestedIdCheck(item, item.value_suggested_ids)}
                                                getOptionSelected={(option, value) => option.value === value.value}
                                                getOptionLabel={(option) => (typeof option === 'string' ? option : option.value)}
                                                options={checkSuggestedValue1(index, item.value_suggested_ids)}
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
                                          )
                                          : item.answer_type === 'multiple_choice'
                                            ? (
                                              <Col md="11" sm="11" xs="11" lg="11">
                                                {item.value_suggested_ids && checkSuggestedValue1(index, item.value_suggested_ids).map((lid) => (
                                                  <FormControlLabel
                                                    key={lid.id}
                                                        // className={`pr-3 ml-3 ${isMultiChecked(item, lid) ? 'bg-cloud-burst text-white' : 'bg-lightblue'}`}
                                                    name={lid.value}
                                                    checked={isMultiChecked1(item, lid)}
                                                    defaultValue={lid.value}
                                                    control={(
                                                      <Checkbox
                                                        size="small"
                                                        required={item.constr_mandatory}
                                                        onChange={(e) => handleCheckMultiChange1(e, item, lid, index)}
                                                        color="default"
                                                        classes={{ root: classes.radio, checked: classes.checked }}
                                                      />
                                                        )}
                                                    label={lid.value}
                                                  />
                                                ))}
                                              </Col>
                                            ) : item.answer_type === 'boolean'
                                              ? (
                                                <Col md="11" sm="11" xs="11" lg="11">
                                                  <div className="ynbutton">
                                                    <Radio.Group onChange={(e) => handleCheckboxChange(e, item, index)} defaultValue={getAnswer(item)} buttonStyle="solid">
                                                      <Radio.Button value="yes">Yes</Radio.Button>
                                                      <Radio.Button value="no">
                                                        No
                                                      </Radio.Button>
                                                    </Radio.Group>
                                                  </div>

                                                </Col>
                                              )
                                              : item.answer_type === 'textbox' || item.answer_type === 'text' || item.answer_type === 'number' || item.answer_type === 'smart_logger' ? (
                                                <Col md="11" sm="11" xs="11" lg="11" className={item.answer_type === 'boolean' ? 'mt-0 pt-2' : ''}>
                                                  {/* <Input
                                                  type={getInputType(item.answer_type)}
                                                  className="m-0 position-relative"
                                                  name="answerValue"
                                                  maxLength={getmaxLength(item.answer_type, item.mro_activity_id)}
                                                  // onKeyPress={item.answer_type === 'number' ? integerKeyPress : false}
                                                  defaultValue={item.answer_common || ''}
                                                  value={inputValues[index] || getAnswer(item)}
                                                  onChange={(e) => handleInputChange(e, item, index)}
                                                  checked={getAnswer(item)}
                                                /> */}
                                                  <Input
                                                    type={getInputType(item.answer_type)}
                                                    className="m-0 position-relative"
                                                    name="answerValue"
                                                    maxLength={getmaxLength(item.answer_type, item.mro_activity_id)}
                                                    required={item.mro_activity_id && item.mro_activity_id.constr_mandatory}
                                                    onKeyDown={item.answer_type === 'number' || item.answer_type === 'numerical_box' || item.answer_type === 'smart_logger' ? decimalKeyPressDown : false}
                                                    defaultValue={item.answer_common ? item.answer_common : ''}
                                                        // value={inputValues[index] || getAnswer(item)}
                                                    onChange={(e) => handleInputChange(e, item, index)}
                                                        // onBlur={(e) => handleInputBlur(e, item)}
                                                    checked={getAnswer(item)}
                                                  />
                                                </Col>
                                              )
                                                : ''}
                                      </Row>
                                    </CardBody>
                                  </Card>
                                </Col>
                              </Row>
                            ))
                            : ''}
                        </Col>
                        ) : (
                          (isChecklist && orderCheckLists && orderCheckLists.data && orderCheckLists.data.length && orderCheckLists.data.length > 0 && detail && detail !== '{}') ? (
                            <Col md="12" sm="12" lg="12" xs="12" className="pt-2 pb-2">
                              <h5 className="font-size-13 pb-1 font-weight-700">{detail && detail.length && detail[0].mro_quest_grp_id ? detail[0].mro_quest_grp_id[1] : ''}</h5>
                              {detail && detail.length
                                ? detail.map((item, index) => (
                                  <Row className="pb-2">
                                    <Col md="12" sm="12" xs="12" lg="12">
                                      <Card>
                                        <CardBody className="p-2">
                                          <Row className="font-weight-600">
                                            <Col md="1" sm="1" xs="1" lg="1">
                                              <img
                                                alt="questionIcon"
                                                width="18"
                                                height="18"
                                                className="mr-2 mb-2 mt-2"
                                                src={questionIcon}
                                              />
                                            </Col>
                                            <Col md="8" sm="8" xs="8" lg="8">
                                              {item.mro_activity_id ? item.mro_activity_id[1] : ''}
                                            </Col>
                                            <Col md="2" sm="2" xs="2" lg="2" className="text-right">
                                              {(item.answer_type === 'suggestion' && item.value_suggested) && (
                                              <img alt="assigned" width="17" height="17" className="mr-1" src={fullyAssignIcon} />
                                              )}
                                              {(item.answer_common && item.answer_type !== 'suggestion') && (
                                              <img alt="assigned" width="17" height="17" className="mr-1" src={fullyAssignIcon} />
                                              )}
                                            </Col>
                                          </Row>
                                          <hr className="mt-0 mb-2" />
                                          <Row className="font-weight-400">
                                            <Col md="1" sm="1" xs="1" lg="1">
                                              <img
                                                alt="answerIcon"
                                                width="18"
                                                height="18"
                                                className="mr-2 mb-2 mt-2"
                                                src={answerIcon}
                                              />
                                            </Col>
                                            {item.answer_type === 'suggestion'
                                              ? (
                                                <Col md="10" sm="10" xs="10" lg="10">
                                                  <Autocomplete
                                                    name="value_suggested_id"
                                                    size="small"
                                                    onChange={(_event, newValue) => {
                                                      handleSuggestionSelect(newValue, item, index);
                                                    }}
                                                    disableClearable={!(item.value_suggested)}
                                                    value={item.value_suggested && item.value_suggested.length > 1 ? item.value_suggested[1] : checkSuggestedId(item.value_suggested, item.value_suggested_ids)}
                                                    getOptionSelected={(option, value) => option.value === value.value}
                                                    getOptionLabel={(option) => (typeof option === 'string' ? option : option)}
                                                    options={checkSuggestedValue(index, item.value_suggested_ids)}
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
                                              )
                                              : item.answer_type === 'multiple_choice'
                                                ? (
                                                  <Col md="10" sm="10" xs="10" lg="10">
                                                    {item.value_suggested_ids && checkSuggestedValue(index, item.value_suggested_ids).map((lid) => (
                                                      <FormControlLabel
                                                        key={lid.id}
                                                      // className={`pr-3 ml-3 ${isMultiChecked(item, lid) ? 'bg-cloud-burst text-white' : 'bg-lightblue'}`}
                                                        name={lid.value}
                                                        checked={isMultiChecked(item, lid)}
                                                        value={lid.value}
                                                        control={(
                                                          <Checkbox
                                                            size="small"
                                                            required={item.constr_mandatory}
                                                            onChange={(e) => handleCheckMultiChange(e, item, lid)}
                                                            color="default"
                                                            classes={{ root: classes.radio, checked: classes.checked }}
                                                          />
                                                      )}
                                                        label={lid.value}
                                                      />
                                                    ))}
                                                  </Col>
                                                ) : item.answer_type === 'boolean'
                                                  ? (
                                                    <Col md="10" sm="10" xs="10" lg="10">
                                                      <div className="ynbutton">
                                                        <Radio.Group onChange={(e) => handleCheckboxChange(e, item, index)} defaultValue={getAnswer(item)} buttonStyle="solid">
                                                          <Radio.Button value="yes">Yes</Radio.Button>
                                                          <Radio.Button value="no">
                                                            No
                                                          </Radio.Button>
                                                        </Radio.Group>
                                                      </div>
                                                    </Col>
                                                  ) : (
                                                    <Col md="10" sm="10" xs="10" lg="10" className={item.answer_type === 'boolean' ? 'mt-0 pt-2' : ''}>
                                                      <Input
                                                        type={getInputType(item.answer_type)}
                                                        className="m-0 position-relative"
                                                        name="answerValue"
                                                        maxLength={getmaxLength(item.answer_type)}
                                                        onKeyDown={item.answer_type === 'number' ? decimalKeyPressDown : false}
                                                        defaultValue={item.answer_type === 'number' ? 0 : ''}
                                                      // value={getAnswer(item)}
                                                        onChange={(e) => (handleInputChange(e, item))}
                                                        checked={getAnswer(item)}
                                                      />
                                                    </Col>
                                                  )}
                                          </Row>
                                        </CardBody>
                                      </Card>
                                    </Col>
                                  </Row>
                                ))
                                : ''}
                            </Col>
                          ) : (
                            <Col md="12" sm="12" lg="12" xs="12" className="pt-2 pb-2">
                              <h5 className="font-size-13 pb-1 font-weight-700">{detail && detail.length && detail[0].mro_quest_grp_id ? detail[0].mro_quest_grp_id.name : ''}</h5>
                              {checklistOpInfo && checklistOpInfo.data
                                ? checklistOpInfo.data.map((item, index) => <>
                                  <Row className="pb-2">
                                    <Col md="12" sm="12" xs="12" lg="12">
                                      <Card>
                                        <CardBody className="p-2">
                                          <Row className="font-weight-600">
                                            <Col md="1" sm="1" xs="1" lg="1">
                                              <img
                                                alt="questionIcon"
                                                width="18"
                                                height="18"
                                                className="mr-2 mb-2 mt-2"
                                                src={questionIcon}
                                              />
                                            </Col>
                                            <Col md="9" sm="9" xs="9" lg="9">
                                              {item.mro_activity_id ? item.mro_activity_id.name : 'Name'}
                                            </Col>
                                            <Col md="2" sm="2" xs="2" lg="2" className="text-right">
                                              {(item.answer_type === 'suggestion' && item.value_suggested) && (
                                              <img alt="assigned" width="17" height="17" className="mr-1" src={fullyAssignIcon} />
                                              )}
                                              {(item.answer_common && item.answer_type !== 'suggestion') && (
                                              <img alt="assigned" width="17" height="17" className="mr-1" src={fullyAssignIcon} />
                                              )}
                                            </Col>
                                          </Row>
                                          <hr className="mt-0 mb-2" />
                                          <Row className="font-weight-400">
                                            <Col md="1" sm="1" xs="1" lg="1">
                                              <img
                                                alt="answerIcon"
                                                width="18"
                                                height="18"
                                                className="mr-2 mb-2 mt-2"
                                                src={answerIcon}
                                              />
                                            </Col>
                                            {item.answer_type === 'suggestion' || item.answer_type === 'simple_choice'
                                              ? (
                                                <Col md="11" sm="11" xs="11" lg="11">
                                                  <Autocomplete
                                                    name="value_suggested_id"
                                                    size="small"
                                                    onChange={(_event, newValue) => {
                                                      handleSuggestionSelect1(newValue, item, index);
                                                    }}
                                                    disableClearable={!(item.value_suggested)}
                                                    defalutValue={checkSuggestedIdOp(item, item.value_suggested_ids)}
                                                    getOptionSelected={(option, value) => option.value === value.value}
                                                    getOptionLabel={(option) => (typeof option === 'string' ? option : option.value)}
                                                    options={checkSuggestedValue1(index, item.value_suggested_ids)}
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
                                              )
                                              : item.answer_type === 'multiple_choice'
                                                ? (
                                                  <Col md="11" sm="11" xs="11" lg="11">
                                                    {item.value_suggested_ids && checkSuggestedValue1(index, item.value_suggested_ids).map((lid) => (
                                                      <FormControlLabel
                                                        key={lid.id}
                                                        // className={`pr-3 ml-3 ${isMultiChecked(item, lid) ? 'bg-cloud-burst text-white' : 'bg-lightblue'}`}
                                                        name={lid.value}
                                                        checked={isMultiChecked(item, lid)}
                                                        value={lid.value}
                                                        control={(
                                                          <Checkbox
                                                            size="small"
                                                            required={item.constr_mandatory}
                                                            onChange={(e) => handleCheckMultiChange1(e, item, lid, index)}
                                                            color="default"
                                                            classes={{ root: classes.radio, checked: classes.checked }}
                                                          />
                                                        )}
                                                        label={lid.value}
                                                      />
                                                    ))}
                                                  </Col>
                                                ) : item.answer_type === 'boolean'
                                                  ? (
                                                    <Col md="11" sm="11" xs="11" lg="11">
                                                      <div className="ynbutton">
                                                        <Radio.Group onChange={(e) => handleCheckboxChange1(e, item, index)} defaultValue={getAnswer(item)} buttonStyle="solid">
                                                          <Radio.Button value="yes">Yes</Radio.Button>
                                                          <Radio.Button value="no">
                                                            No
                                                          </Radio.Button>
                                                        </Radio.Group>
                                                      </div>
                                                    </Col>
                                                  ) : item.answer_type === 'textbox' || item.answer_type === 'text' || item.answer_type === 'number' || item.answer_type === 'smart_logger'
                                                    ? (
                                                      <Col md="11" sm="11" xs="11" lg="11" className={item.answer_type === 'boolean' ? 'mt-0 pt-2' : ''}>
                                                        <Input
                                                          type={getInputType(item.answer_type)}
                                                          className="m-0 position-relative"
                                                          name="answerValue"
                                                          maxLength={getmaxLength(item.answer_type, item.mro_activity_id)}
                                                          required={item.mro_activity_id && item.mro_activity_id.constr_mandatory}
                                                          onKeyDown={item.answer_type === 'number' || item.answer_type === 'numerical_box' || item.answer_type === 'smart_logger' ? decimalKeyPressDown : false}
                                                          defaultValue={item.answer_common ? item.answer_common : ''}
                                                          // value={inputValues[index] || getAnswer(item)}
                                                          onChange={(e) => handleInputChange(e, item, index)}
                                                          // onBlur={(e) => handleInputBlur(e, item)}
                                                          checked={getAnswer(item)}
                                                        />
                                                      </Col>
                                                    )
                                                    : ''}
                                          </Row>
                                        </CardBody>
                                      </Card>
                                    </Col>
                                  </Row>

                                </>)
                                : ''}
                            </Col>
                          ))}
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions className="mr-3 ml-3">
        <CardBody className="mt-2 p-0 d-flex">
          <Col md="11" sm="11" lg="11" xs="12">
            {updateChecklist && updateChecklist.loading && (
              <div className="text-center mt-3">
                <Loader />
              </div>
            )}
            {(updateChecklist && updateChecklist.err) && (
              <SuccessAndErrorFormat response={updateChecklist} />
            )}
            {(updateChecklist && updateChecklist.data) && (
              <SuccessAndErrorFormat
                response={updateChecklist}
                successMessage="Answer updated successfully..."
              />
            )}
            {isNewEmployee && !(updateChecklist && updateChecklist.data) && (
              <p className="text-center text-info">
                Note: This work order will be assigned to and updated by
                {' '}
                {userEmployeeName}
              </p>
            )}
          </Col>
          <Col md="1" sm="1" lg="1" xs="12">
            {updateChecklist && updateChecklist.data && (
              <Button
                type="button"
                variant="contained"
                className="submit-btn"
                style={{ maxWidth: 'fit-content' }}
                onClick={() => onReset()}
                disabled={updateChecklist && updateChecklist.loading}
              >
                OK
              </Button>
            )}
          </Col>
        </CardBody>
        {(removeChecklist && removeChecklist.data)
          ? (
            <CardBody className="mt-2 p-0 d-flex">
              <Col md="11" sm="11" lg="11" xs="12">
                {removeChecklist && removeChecklist.loading && (
                  <div className="text-center mt-3">
                    <Loader />
                  </div>
                )}
                {(removeChecklist && removeChecklist.err) && (
                  <SuccessAndErrorFormat response={removeChecklist} />
                )}
                {(removeChecklist && removeChecklist.data) && (
                  <SuccessAndErrorFormat
                    response={removeChecklist}
                    successMessage="Question removed successfully..."
                  />
                )}
              </Col>
              <Col md="1" sm="1" lg="1" xs="12">
                {removeChecklist && removeChecklist.data && (
                  <Button
                    type="button"
                    variant="contained"
                    className="submit-btn"
                    onClick={() => onRemoveReset()}
                    disabled={removeChecklist && removeChecklist.loading}
                  >
                    OK
                  </Button>
                )}
              </Col>
            </CardBody>
          )
          : ''}
        {(showReset && (orderCheckLists && orderCheckLists.data && orderCheckLists.data.length > 0 || checklistOpInfo && checklistOpInfo.data && checklistOpInfo.data.length > 0 || cheklistJsonObj && cheklistJsonObj.length > 0))
          ? (
            <Button
              type="button"
              variant="contained"
              className="submit-btn"
              onClick={handleSubmit}
              disabled={(parseInt(answered) !== parseInt(total))}
            >
              Finish
            </Button>
          ) : ''}
      </DialogActions>
    </Dialog>
  );
};

CheckList.propTypes = {
  workorderDetails: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  checkListModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  atFinish: PropTypes.func.isRequired,
  refresh: PropTypes.func.isRequired,
};
export default CheckList;
