/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */
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
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Input,
  Progress,
} from 'reactstrap';
import Button from '@mui/material/Button';
import { Radio } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Autocomplete } from '@material-ui/lab';
import { TextField } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import workOrdersIcon from '@images/icons/workOrders.svg';
import closeCircleIcon from '@images/icons/closeCircle.svg';
import inProgress from '@images/icons/inProgressNoCircle.svg';
import questionIcon from '@images/icons/questionChecklist.svg';
import answerIcon from '@images/icons/answerChecklist.svg';
import fullyAssignIcon from '@images/icons/fullyAssign.png';
import checklistIcon from '@images/icons/performChecklistBlue.svg';
import axios from 'axios';

import theme from '../../../util/materialTheme';
import {
  generateErrorMessage,
  decimalKeyPressDown,
  getArrayNewFormatUpdate,
  getColumnArrayById,
  isJsonString,
  getJsonString,
} from '../../../util/appUtils';

import {
  getOrderCheckLists, getOperationCheckListData, getOrderChecklist,
  updateChecklistAnswer, resetUpdateCheckList, resetSuggestedCheckedRows, getOrderDetail, resetRemoveCheckList, getExtraSelection,
} from '../../workorderService';
import {
  getWorkOrderStateLabel, getWorkOrderPriorityFormLabel,
} from '../../utils/utils';
import { groupByMultiple } from '../../../util/staticFunctions';
import CloseWorkorder from './closeWoNoModal';

const appModels = require('../../../util/appModels').default;

const CheckListFinish = (props) => {
  const {
    workorderDetails, checkListModal, atFinish, selectedActions,
  } = props;
  const dispatch = useDispatch();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [detail, setDetail] = useState([]);
  const [modal, setModal] = useState(checkListModal);
  const [answerValues, setAnswerValues] = useState([]);
  const [showReset, setShowReset] = useState(true);
  const [closeActionModal, setCloseActionModal] = useState(false);
  const [dataValues, setDataValues] = useState(workorderDetails);
  const [inputValues, setInputValues] = useState([]);
  const [taskConfig, setTaskConfig] = useState({ loading: false, data: null, err: null });
  const [multiData, setMultiData] = useState([]);
    const [errorId, setErrorId] = useState(false);
    const [validationMessage, setValidationMessage] = useState('');

  const WEBAPPAPIURL = `${window.location.origin === 'http://localhost:3010' ? 'http://localhost:3000' : window.location.origin}/`;

  const {
    orderCheckLists, updateChecklist, removeChecklist, listDataInfo, checklistOpInfo, workOrderChecklist,
  } = useSelector((state) => state.workorder);

  const { userInfo } = useSelector((state) => state.user);

  const { incidentsOrderInfo } = useSelector((state) => state.ticket);
  const [taskQuestions, setTaskQuestions] = useState([]);

  const operationChecklist = orderCheckLists && orderCheckLists.data && orderCheckLists.data.length > 0
    ? orderCheckLists.data : taskQuestions;
  const [questionValues, setQuestions] = useState(operationChecklist);

  const toggle = () => {
    setCurrentQuestion(0);
    setModal(!modal);
    atFinish();
  };

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
    if (incidentsOrderInfo && incidentsOrderInfo.data) {
      const inspDeata1 = incidentsOrderInfo && incidentsOrderInfo.data && incidentsOrderInfo.data.data
        && incidentsOrderInfo.data.data.length ? { data: [incidentsOrderInfo.data.data[0]] } : false;

      const inspDeata2 = incidentsOrderInfo && incidentsOrderInfo.data && incidentsOrderInfo.data.data
        && incidentsOrderInfo.data.data.length && incidentsOrderInfo.data.data.length > 1 ? { data: [incidentsOrderInfo.data.data[1]] } : false;

      const woData = selectedActions && selectedActions.includes('Assessment') ? inspDeata1 : inspDeata2;
      setDataValues(woData);
    }
  }, [incidentsOrderInfo]);

  useEffect(() => {
    if (workorderDetails.data) {
      setDataValues(workorderDetails);
    }
  }, [workorderDetails]);

  const workorderData = dataValues && (dataValues.data && dataValues.data.length > 0) ? dataValues.data[0] : '';
  const isChecklist = workorderData && workorderData.check_list_ids && workorderData.check_list_ids.length > 0;
  const cheklistJsonObj = workorderData && workorderData.checklist_json_data ? JSON.parse(workorderData.checklist_json_data) : false;
  const mroActivityIds = cheklistJsonObj && cheklistJsonObj.map((record) => record.mro_activity_id);

  useEffect(() => {
    if (workorderData && workorderData.id) {
      const ids = workorderData.id;
      dispatch(getOrderChecklist(ids, appModels.ORDER));
    }
  }, [workorderData]);

  useEffect(() => {
    const ids = workorderDetails && workorderDetails.data && workorderDetails.data[0] && workorderDetails.data[0].task_id && workorderDetails.data[0].task_id.id && workorderDetails.data[0].task_id.id;
    if (!isChecklist && ids) {
      dispatch(getOperationCheckListData(ids));
    }
  }, []);

  useEffect(() => {
    if (operationChecklist && operationChecklist.length) {
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
      checklist.forEach((obj) => {
        if (obj.answer_type !== 'suggestion' && obj.answer_type !== 'boolean' && obj.answer_common !== false) {
          if (obj.value_text || obj.value_number || obj.value_date) {
            answerCount += 1;
          }
        }
        if (obj.answer_type === 'boolean' && (obj.type || obj.answer_common !== false)) {
          if (obj.answer_common !== '') {
            answerCount += 1;
          }
        }
        if (obj.answer_type === 'suggestion' && obj.value_suggested !== false) {
          if (obj.value_suggested !== '') {
            answerCount += 1;
          }
        }
      });
    }
    if (questionCount === 0) {
      return 0;
    }
    const percentage = (answerCount / questionCount) * 100;
    return Math.max(0, percentage.toFixed(0));
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
      const ids = workorderDetails.data.length > 0 ? getColumnArrayById(workorderDetails.data[0].check_list_ids, 'id') : [];
      dispatch(getOrderCheckLists(ids, appModels.CHECKLIST));
      dispatch(getExtraSelection(appModels.ACTIVITYLINES, 1000, 0, 'value', ''));
      setDetail([]);
    }
  }, []);

  useEffect(() => {
    if ((workorderDetails && workorderDetails.data) && (updateChecklist && updateChecklist.data)) {
      const ids = workorderDetails && workorderDetails.data && workorderDetails.data.length > 0 ? getColumnArrayById(workorderDetails.data[0].check_list_ids, 'id') : [];
      if (ids && ids.length > 0) {
        setDetail([]);
        setAnswerValues([]);
        setCurrentQuestion(0);
        dispatch(getOrderCheckLists(ids, appModels.CHECKLIST));
      }
    }
  }, [updateChecklist]);

  useEffect(() => {
    if ((workorderData) && (removeChecklist && removeChecklist.data)) {
      const viewId = workorderData && workorderData.id ? workorderData.id : '';
      setDetail([]);
      setAnswerValues([]);
      setCurrentQuestion(0);
      dispatch(getOrderDetail(viewId, appModels.ORDER));
    }
  }, [removeChecklist]);

  useEffect(() => {
    if (orderCheckLists && orderCheckLists.data && orderCheckLists.data.length > 0 && detail && detail.length === 0) {
      setDetail(orderCheckLists.data[0]);
      const isAnswered = orderCheckLists.data.filter((item) => item.answer_common && item.answer_common.length);
      if (isAnswered && isAnswered.length) {
        const newArrData = orderCheckLists.data.map((cl) => ({
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
  }, [orderCheckLists, detail]);

  useEffect(() => {
    if (workOrderChecklist && workOrderChecklist.data && workOrderChecklist.data[0] && workOrderChecklist.data[0].task_id && workOrderChecklist.data[0].task_id[0]) {
      setTaskConfig({
        loading: true, data: null, count: 0, err: null,
      });

      const fields = '["id", "name", ["check_list_ids", ["id", ("check_list_id", ["id", ["activity_lines", ["id","name", "type", ("mro_quest_grp_id", ["id", "name"]),"has_attachment", "constr_mandatory","requires_verification","expected_min_number","expected_max_number","validation_required","validation_length_max","validation_length_min","validation_max_float_value","validation_min_float_value","constr_error_msg","validation_error_msg","is_enable_condition",("parent_id", ["id", "name"]),["based_on_ids", ["id"]]]]])]]]';
      const payload = `domain=[["id","=",${workOrderChecklist.data[0].task_id[0]}]]&model=mro.task&fields=${fields}&offset=0&limit=1&portalDomain=${window.location.origin}`;

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
  }, [workOrderChecklist]);

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
    atFinish();
  };

  const onResetChecklist = () => {
    dispatch(resetUpdateCheckList());
    setShowReset(true);
    dispatch(resetUpdateCheckList());
    dispatch(resetRemoveCheckList());
    setCurrentQuestion(0);
    setCloseActionModal(true);
  };

  const onRemoveReset = () => {
    dispatch(resetRemoveCheckList());
    setShowReset(true);
  };

  const userEmployeeId = userInfo && userInfo.data && userInfo.data.employee && userInfo.data.employee.id;
  const userEmployeeName = userInfo && userInfo.data && userInfo.data.employee && userInfo.data.employee.name;
  const assignEmployeeId = workorderData && workorderData.employee_id.length && workorderData.employee_id[0];

  const isNewEmployee = userEmployeeId && assignEmployeeId && (userEmployeeId !== assignEmployeeId);

  const handleSubmit = () => {
    // const postData = {
    //   check_list_ids: getArrayNewFormatUpdate(answerValues),
    // };
    let postData = {};
    if (orderCheckLists && orderCheckLists.data && orderCheckLists.data.length > 0) {
      const newData = answerValues;
      postData = {
        check_list_ids: getArrayNewFormatUpdate(newData),
      };
    } else {
      const newArrData = questionValues && questionValues.length ? questionValues.map((cl) => ({
        check_list_id: cl.id,
        answer_type: cl.answer_type,
        answer_common: cl.answer_common,
        mro_activity_id: cl.mro_activity_id && cl.mro_activity_id.id ? cl.mro_activity_id.id : '',
        checklist_question: cl.mro_activity_id && cl.mro_activity_id.name ? cl.mro_activity_id.name : '',
        checklist_question_header: cl.mro_quest_grp_id && cl.mro_quest_grp_id.name ? cl.mro_quest_grp_id.name : '',
        value_suggested: cl && cl.value_suggested && cl.value_suggested.id ? cl.value_suggested.id : false,
        value_suggested_ids: cl.value_suggested_ids,
        has_attachment: cl.mro_activity_id && cl.mro_activity_id.has_attachment ? cl.mro_activity_id.has_attachment : false,
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

    const editId = workorderData && workorderData.id ? workorderData.id : '';
    dispatch(updateChecklistAnswer(editId, postData, appModels.ORDER));
    dispatch(resetSuggestedCheckedRows());
    setShowReset(false);
  };

  const handleCheckboxChange = (event, checklist) => {
    const { checked } = event.target;
    let checkValue = false;
    if (checked) {
      checkValue = true;
    }
    const data = [{ id: checklist.id, answer_type: checklist.answer_type, type: checkValue }];
    const arr = [...answerValues, ...data];
    setAnswerValues([...new Map(arr.map((item) => [item.id, item])).values()]);
    // const detailIndex = detail.findIndex((obj) => (obj.id === checklist.id));
    // detail[detailIndex].type = checkValue;
    // setDetail(detail);
    const detailIndex = questionValues.findIndex((obj) => (obj.id === checklist.id));
    questionValues[detailIndex].type = checkValue;
    // questionValues[detailIndex].answer_common = checkValue;
    setQuestions(questionValues);
    setDetail(questionValues);
  };

  const handleInputChange = (event, checklist, index) => {
    const { value } = event.target;
    const newInputValues = [...inputValues];
    newInputValues[index] = event.target.value;
    setInputValues(newInputValues);
    let field = 'value_text';
    if (checklist.answer_type === 'number') {
      field = 'value_number';
    }
    if (checklist.answer_type === 'date') {
      field = 'value_date';
    }
    if (checklist.answer_type === 'suggestion') {
      field = 'value_suggested';
    }
    const data = [{ id: checklist.id, answer_type: checklist.answer_type, [field]: value }];
    const arr = [...answerValues, ...data];
    setAnswerValues([...new Map(arr.map((item) => [item.id, item])).values()]);

    // const detailIndex = detail.findIndex((obj) => (obj.id === checklist.id));
    // detail[detailIndex][field] = value;
    // setDetail(detail);
    const detailIndex = questionValues.findIndex((obj) => (obj.id === checklist.id));
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

  const handleSuggestionSelect = (svalue, checklist) => {
    const value = svalue ? svalue.id : false;
    const field = 'value_suggested';
    const data = [{ id: checklist.id, answer_type: checklist.answer_type, [field]: value }];
    const arr = [...answerValues, ...data];
    setAnswerValues([...new Map(arr.map((item) => [item.id, item])).values()]);

    // const detailIndex = detail.findIndex((obj) => (obj.id === checklist.id));
    // detail[detailIndex][field] = value;
    // setDetail(detail);
    const detailIndex = questionValues.findIndex((obj) => (obj.id === checklist.id));
    questionValues[detailIndex][field] = value;
    questionValues[detailIndex].answer_common = value;
    setQuestions(questionValues);
    setDetail(questionValues);
  };

  const checkSuggestedValue = (index, suggestedIds) => {
    const ids = suggestedIds && suggestedIds.length > 0 ? checkDataFormat(suggestedIds) : [];
    let options = [];
    if (ids.length > 0 && listDataInfo && listDataInfo.data && listDataInfo.data.length > 0) {
      listDataInfo.data.map((data) => {
        for (let j = 0; j < ids.length; j += 1) {
          if (ids[j] === data.id) {
            options.push(data);
          }
        }
      });
    } else if (checklistOpInfo && checklistOpInfo.data && checklistOpInfo.data.length) {
      const listOptions = suggestedIds && suggestedIds.length > 0 ? checkDataFormat(suggestedIds) : [];

      options = listOptions && listOptions.length ? listOptions.map((cl) => ({
        id: cl.id,
        value: cl.name,
      })) : [];
    }
    return options;
  };

  const checkSuggestedId = (sid, suggestedIds) => {
    const ids = suggestedIds && suggestedIds.length > 0 ? checkDataFormat(suggestedIds) : [];
    let slabel = '';
    if (sid && ids.length > 0 && listDataInfo && listDataInfo.data && listDataInfo.data.length > 0) {
      const result = listDataInfo.data.filter((item) => (item.id === sid));
      slabel = result && result.length ? result[0].value : '';
    }
    return slabel;
  };

  function checkAnsweredQuestion(checklist) {
    let answerCount = 0;
    if (checklist && checklist.length > 0) {
      const filter = checklist.filter((obj) => ((obj.answer_type !== 'suggestion' || obj.answer_type !== 'simple_choice' && obj.answer_type !== 'boolean' && obj.answer_common !== false) || (obj.answer_type === 'suggestion' || obj.answer_type !== 'simple_choice' && obj.value_suggested !== false) || (obj.answer_type === 'boolean' && (obj.type || obj.answer_common !== false))));
      answerCount = filter.length;
    }
    return answerCount;
  }

  function checkAnsweredQuestion1(checklist) {
    const valueData = [];
    if (multiData && multiData.length > 0) {
      multiData.map((item) => valueData.push(item.value));
    }
    const newArrData = questionValues && questionValues.length ? questionValues.map((cl) => ({
      check_list_id: cl.id,
      answer_type: cl.answer_type,
      // eslint-disable-next-line quotes
      answer_common: cl.answer_type === 'multiple_choice' && (cl.answer_common == '' || cl.answer_common === false) ? valueData && valueData.join(",") : cl.answer_common,
      value_suggested: cl && cl.value_suggested && cl.value_suggested.id ? cl.value_suggested.id : false,
    })) : [];
    let answerCount = 0;
    if (questionValues && questionValues.length > 0) {
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
    if (type === 'text') {
      maxlength = '50';
    }
    return maxlength;
  };

  // const getAnswer = (checklist) => {
  //   let answer = '';
  //   if (checklist.answer_type === 'text') {
  //     answer = checklist.value_text ? checklist.value_text : '';
  //   }
  //   if (checklist.answer_type === 'number') {
  //     if (checklist.value_number === '') {
  //       answer = checklist.value_number;
  //     } else {
  //       answer = checklist.value_number ? parseInt(checklist.value_number) : 0;
  //     }
  //   }
  //   if (checklist.answer_type === 'date') {
  //     answer = checklist.value_date;
  //   }
  //   if (checklist.answer_type === 'boolean') {
  //     answer = checklist.type;
  //   }
  //   return answer;
  // };

  const getAnswer = (checklist) => {
    let answer = '';
    if (checklist.answer_type === 'text' || checklist.type === 'textbox') {
      answer = checklist.value_text ? checklist.value_text : '';
    }
    if (checklist.answer_type === 'number') {
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

  // const getStatus = (checklist) => {
  //   let questionCount = 0;
  //   let status = 'pending';
  //   let answerCount = 0;
  //   if (checklist.length > 0) {
  //     questionCount = checklist.length;
  //     checklist.filter((obj) => {
  //       if (obj.answer_common !== false) {
  //         answerCount += 1;
  //       }
  //     });
  //   }
  //   if (questionCount > 0) {
  //     if (questionCount === answerCount) {
  //       status = 'completed';
  //     }
  //   }

  //   return status;
  // };

  const getStatus = (checklist) => {
    let questionCount = 0;
    let status = 'pending';
    let answerCount = 0;
    if (checklist.length > 0) {
      questionCount = checklist.length;
      checklist.filter((obj) => {
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
    if (questionCount > 0) {
      if (questionCount === answerCount) {
        status = 'completed';
      }
    }

    return status;
  };

  const sections = orderCheckLists && orderCheckLists.data && orderCheckLists.data.length > 0 ? groupByMultiple(orderCheckLists.data, (obj) => obj.mro_quest_grp_id) : [];
  const sectionsOp = checklistOpInfo && checklistOpInfo.data && checklistOpInfo.data.length > 0 ? groupByMultiple(checklistOpInfo.data, (obj) => obj.mro_quest_grp_id) : [];

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

  const percentage = getPercentage((orderCheckLists && orderCheckLists.data && orderCheckLists.data.length) ? orderCheckLists.data : 0);
  const percentageOp = getPercentage((questionValues && questionValues.length) ? questionValues : 0);

  return (
    <Modal size="lg" className="border-radius-50px modal-dialog-centered checkList-modal" isOpen={checkListModal}>
      {!closeActionModal && (
        <>
          <ModalHeader className="modal-equipment-header text-grey">
            <Button
              variant="contained"
              onClick={toggle}
              className="hoverColor bg-white text-dark padding-btn-1  rounded-pill mr-2 float-right"
            >
              <img src={closeCircleIcon} height="15" width="15" className="mr-2 mb-1" alt="close" />
              <span className="mr-2 font-14">Close</span>
            </Button>
            <h4 className="mb-0 mt-1">
              <img
                alt="preventiveMaintenance"
                width="25"
                height="25"
                className="mr-2 mb-2 font-weight-700"
                src={checklistIcon}
              />
              Check List
            </h4>
            <span className="font-weight-600 mb-0 ml-4 font-13px">Please answer all the questions</span>
          </ModalHeader>
          <ModalBody className="pt-0">
            {workorderData && workorderData.name && workorderDetails && (workorderDetails.data && workorderDetails.data.length > 0) && (
              <Row className="m-0">
                <Col md="12" sm="12" xs="12" lg="12">
                  <Card className="mb-2">
                    <CardBody className="font-tiny">
                      <Row>
                        <Col md="1" xs="1" sm="1" lg="1">
                          <img src={workOrdersIcon} alt="asset" width="45" height="45" />
                        </Col>
                        <Col md="3" sm="3" xs="3" lg="3">
                          <h4 className="mb-1 font-weight-800 font-medium" title={workorderData.name}>{workorderData.name}</h4>
                          <p className="mb-1 font-weight-400 mt-1 font-tiny">
                            {workorderData.sequence}
                          </p>
                        </Col>
                        <Col md="4" sm="4" xs="4" lg="4">
                          <span className="mr-2">{getWorkOrderStateLabel(workorderData.state)}</span>
                          {getWorkOrderPriorityFormLabel(workorderData.priority)}
                        </Col>
                        <Col md="4" sm="4" xs="4" lg="4">
                          <div className="text-center font-weight-600">
                            Completed (
                            {(orderCheckLists && orderCheckLists.data && orderCheckLists.data.length) ? checkAnsweredQuestion(orderCheckLists.data) : (questionValues && questionValues.length) ? checkAnsweredQuestion1(questionValues) : 0}
                            /
                            {(orderCheckLists && orderCheckLists.data && orderCheckLists.data.length) ? orderCheckLists.data.length : (checklistOpInfo && checklistOpInfo.data && checklistOpInfo.data.length) ? checklistOpInfo.data.length : (cheklistJsonObj) ? cheklistJsonObj.length : ''}
                            )
                          </div>
                          {isChecklist
                            ? (
                              <Progress value={percentage} color={getProgressColor(percentage)}>
                                {percentage}
                                {' '}
                                %
                              </Progress>
                            )
                            : (
                              <Progress value={percentageOp} color={getProgressColor(percentageOp)}>
                                {percentageOp}
                                {' '}
                                %
                              </Progress>
                            )}
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            )}
            <Row className="pt-2 m-0">
              <Col md="3" sm="3" lg="3" xs="12" className="pr-0">
                <Card className="p-0 h-100">
                  <CardTitle className="p-2 bg-lightblue mb-1 text-center border-bottom sfilterarrow">
                    <h5 className="font-size-13 mb-0 textwrapdots font-weight-700">
                      Questions (
                      {(orderCheckLists && orderCheckLists.data && orderCheckLists.data.length) ? orderCheckLists.data.length : (checklistOpInfo && checklistOpInfo.data && checklistOpInfo.data.length) ? checklistOpInfo.data.length : 0}
                      )
                    </h5>
                  </CardTitle>
                  <div className="mb-3 overflow-auto thin-scrollbar">
                    <ThemeProvider theme={theme}>
                      {(orderCheckLists && orderCheckLists.loading) && (
                        <div className="mb-2 mt-3 p-5" data-testid="loading-case">
                          <Loader />
                        </div>
                      )}
                      <List>
                        {sections && sections.length > 0 && sections.map((section, i) => (
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
                      </List>
                      <List>
                        {checklistOpInfo && sectionsOp && sectionsOp.length > 0 && sectionsOp.map((section, i) => (
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
              <Col md="9" sm="9" lg="9" xs="12">
                <Card className="mb-2 h-100">
                  <CardBody className="pt-1 pb-1 bg-lightblue alarms-list thin-scrollbar">
                    {(orderCheckLists && orderCheckLists.err && checklistOpInfo && checklistOpInfo.err) && (
                      <ErrorContent errorTxt={generateErrorMessage(orderCheckLists)} />
                    )}
                    <Row>
                      {(isChecklist && orderCheckLists && orderCheckLists.data && orderCheckLists.data.length && orderCheckLists.data.length > 0 && detail && detail !== '{}') ? (
                        <Col md="12" sm="12" lg="12" xs="12" className="pt-2 pb-2">
                          <h5 className="font-size-13 d-inline-block pb-1 font-weight-700">{detail && detail.length && detail[0].mro_quest_grp_id ? detail[0].mro_quest_grp_id[1] : ''}</h5>
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
                                        <Col md="9" sm="9" xs="9" lg="9">
                                          {item.mro_activity_id ? item.mro_activity_id[1] : ''}
                                        </Col>
                                        <Col md="2" sm="2" xs="2" lg="2" className="text-right">
                                          {(item.answer_type === 'suggestion' && item.value_suggested && item.answer_common !== false) && (
                                            <img alt="assigned" width="17" height="17" className="mr-1" src={fullyAssignIcon} />
                                          )}
                                          {(item.answer_common !== false && item.answer_type !== 'suggestion') && (
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
                                            <Col md="11" sm="11" xs="11" lg="11">
                                              <Autocomplete
                                                name="value_suggested_id"
                                                size="small"
                                                onChange={(_event, newValue) => {
                                                  handleSuggestionSelect(newValue, item);
                                                }}
                                                disableClearable={!(item.value_suggested)}
                                                value={item.value_suggested && item.value_suggested.length > 1
                                                  ? item.value_suggested[1] : checkSuggestedId(item.value_suggested, item.value_suggested_ids)}
                                                getOptionSelected={(option, value) => option.value === value.value}
                                                getOptionLabel={(option) => (typeof option === 'string' ? option : option.value)}
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
                                          : (
                                            <Col md="11" sm="11" xs="11" lg="11" className={item.answer_type === 'boolean' ? 'mt-0 pt-2' : ''}>
                                              <Input
                                                type={getInputType(item.answer_type)}
                                                className="m-0 position-relative"
                                                name="answerValue"
                                                // maxLength={getmaxLength(item.answer_type)}
                                                onKeyDown={item.answer_type === 'number' || item.answer_type === 'smart_logger' ? decimalKeyPressDown : false}
                                                defaultValue={item.answer_type === 'number' ? 0 : ''}
                                                value={getAnswer(item)}
                                                onChange={(e) => (item.answer_type === 'boolean' ? handleCheckboxChange(e, item) : handleInputChange(e, item))}
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
                        (!isChecklist && checklistOpInfo && checklistOpInfo.data && checklistOpInfo.data.length && checklistOpInfo.data.length > 0 && detail && detail !== '{}')
                          ? <Col md="12" sm="12" lg="12" xs="12" className="pt-2 pb-2">
                            <h5 className="font-size-13 d-inline-block pb-1 font-weight-700">{detail && detail.length && detail[0].mro_quest_grp_id ? detail[0].mro_quest_grp_id.name : ''}</h5>
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
                                            {item.mro_activity_id ? item.mro_activity_id.name : ''}
                                          </Col>
                                          <Col md="2" sm="2" xs="2" lg="2" className="text-right">
                                            {(item.answer_type === 'suggestion') && (
                                              <img alt="assigned" width="17" height="17" className="mr-1" src={fullyAssignIcon} />
                                            )}
                                            {(item.answer_common !== false && item.answer_type !== 'suggestion') && (
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
                                              <Col md="11" sm="11" xs="11" lg="11">
                                                <Autocomplete
                                                  name="value_suggested_id"
                                                  size="small"
                                                  onChange={(_event, newValue) => {
                                                    handleSuggestionSelect(newValue, item);
                                                  }}
                                                  disableClearable={!(item.value_suggested)}
                                                  value={item.value_suggested && item.value_suggested.value ? item.value_suggested.value : checkSuggestedId(item.value_suggested, item.value_suggested_ids)}
                                                  getOptionSelected={(option, value) => option.value === value.value}
                                                  getOptionLabel={(option) => (typeof option === 'string' ? option : option.value)}
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
                                            : item.answer_type === 'boolean'
                                              ? (
                                                <Col md="11" sm="11" xs="11" lg="11">
                                                  <Radio.Group onChange={(e) => handleCheckboxChange(e, item)} defaultValue={getAnswer(item)} buttonStyle="solid">
                                                    <Radio.Button value="yes">Yes</Radio.Button>
                                                    <Radio.Button value="no">
                                                      No
                                                    </Radio.Button>
                                                  </Radio.Group>
                                                </Col>
                                              ) : (
                                                <Col md="11" sm="11" xs="11" lg="11" className={item.answer_type === 'boolean' ? 'mt-0 pt-2' : ''}>
                                                  {/* <Input
                                                  type={getInputType(item.answer_type)}
                                                  className="m-0 position-relative"
                                                  name="answerValue"
                                                  maxLength={getmaxLength(item.answer_type, item.mro_activity_id)}
                                                  required={item.mro_activity_id && item.mro_activity_id.constr_mandatory}
                                                  onKeyPress={item.answer_type === 'number' ? integerKeyPress : lettersOnly}
                                                  defaultValue=""
                                                  value={inputValues[index] || getAnswer(item)}
                                                  onChange={(e) => handleInputChange(e, item, index)}
                                                      // onBlur={(e) => handleInputBlur(e, item)}
                                                  checked={getAnswer(item)}
                                                /> */}
                                                  <Input
                                                    type={getInputType(item.answer_type)}
                                                    className="m-0 position-relative"
                                                    name="answerValue"
                                                    //  maxLength={getmaxLength(item.answer_type, item.mro_activity_id)}
                                                    required={item.mro_activity_id && item.mro_activity_id.constr_mandatory}
                                                    // onKeyPress={item.answer_type === 'number' ? integerKeyPress : false}
                                                    defaultValue={item.answer_common ? item.answer_common : ''}
                                                    // value={inputValues[index] || getAnswer(item)}
                                                    onChange={(e) => handleInputChange(e, item, index)}
                                                    // onBlur={(e) => handleInputBlur(e, item)}
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
                          : <Col />
                      )}
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter className="mr-3 ml-3">
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
                    size="sm"
                    type="button"
                    variant="contained"
                    onClick={() => onResetChecklist()}
                    disabled={updateChecklist && updateChecklist.loading}
                  >
                    Next
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
                        size="sm"
                        type="button"
                        variant="contained"
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
            {(showReset && (orderCheckLists && orderCheckLists.data && orderCheckLists.data.length > 0 || checklistOpInfo && checklistOpInfo.data && checklistOpInfo.data.length > 0))
              ? (
                <Button
                  type="button"
                  size="sm"
                  className="mr-1"
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={!(answerValues.length > 0)}
                >
                  Finish
                </Button>
              ) : ''}
          </ModalFooter>
        </>
      )}
      {closeActionModal && (
        <CloseWorkorder
          atFinish={() => {
            onReset();
          }}
          actionText="Finish"
          actionCode="do_record"
          details={dataValues}
          selectedActions={selectedActions}
          closeActionModal
          refresh={() => { }}
        />
      )}
    </Modal>
  );
};

CheckListFinish.propTypes = {
  workorderDetails: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  checkListModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  atFinish: PropTypes.func.isRequired,
  selectedActions: PropTypes.string.isRequired,
};
export default CheckListFinish;
