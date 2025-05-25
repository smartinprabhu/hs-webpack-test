/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
/* eslint-disable max-len */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-console */
/* eslint-disable radix */
/* eslint-disable array-callback-return */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, {
  useEffect, useState, useMemo, Suspense,
} from 'react';
import {
  Col,
  Row,
  Input,
  Toast,
  ToastBody,
  ToastHeader,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import axios from 'axios';
import { Autocomplete } from '@material-ui/lab';
import { Image, Tooltip } from 'antd';
import ReactFileReader from 'react-file-reader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import {
  TextField,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
  Box, Button, Checkbox,
  Dialog, DialogContent, DialogContentText,
} from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';

import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';

import checkCircleBlack from '@images/icons/checkCircleBlack.svg';
import fullyAssignIcon from '@images/icons/fullyAssign.png';
import answerIcon from '@images/icons/answerChecklist.svg';
import questionIcon from '@images/icons/questionChecklist.svg';
import checkWhite from '@images/icons/checkWhite.svg';
import uploadIcon from '@images/icons/uploadPhotoBlue.svg';
import fileMiniIcon from '@images/icons/fileMini.svg';

import {
  integerKeyPress,
  lettersOnly,
  getColumnArrayById,
  getDateTimeUtc,
  getLocalTimeSeconds,
  truncate,
  getArrayFromValuesByIdInLength,
  detectMob,
  calculateTimeDifference,
} from '../util/appUtils';
import { bytesToSizeLow } from '../util/staticFunctions';
import DialogHeader from '../commonComponents/dialogHeader';

import ImageUpload from '../externalWorkPermit/checklists/imageUpload';
import ServiceReport from './serviceReport';

const useStyles = makeStyles({
  radio: {
    '&$checked': {
    },
  },
  checked: {},
  MuiFormControlLabel: {
    label: {
      fontSize: '30px',
    },
  },
});

const appModels = require('../util/appModels').default;

const CheckLists = (props) => {
  const {
    orderCheckLists,
    detailData,
    settings,
    companyData,
    onResetView,
    setWoUpdateInfo1,
    accid,
  } = props;
  const [answerValues, setAnswerValues] = useState([]);
  const [answerIpValues, setIpAnswerValues] = useState([]);
  const [questionValues, setQuestions] = useState(orderCheckLists);

  const isMobileView = detectMob();

  const timeSheetData = useMemo(() => (detailData && detailData.order_id && detailData.order_id.mro_timesheet_ids && detailData.order_id.mro_timesheet_ids.length ? detailData.order_id.mro_timesheet_ids[detailData.order_id.mro_timesheet_ids.length - 1] : false), [detailData]);

  const [imgId, setimgId] = useState(false);

  const [woUpdateInfo, setWoUpdateInfo] = useState({ loading: false, data: null, err: null });
  const [listDataInfo, setListDataInfo] = useState({ loading: false, data: null, err: null });

  const [startInfo, setStartInfo] = useState({ loading: false, data: null, err: null });

  const [serviceModal, showServiceModal] = useState(false);

  const currentChecklist = false;
  const [isModal, setModalOpen] = useState(false);

  const [imgSize, setimgSize] = useState(false);
  const [imgFile, setImgFile] = useState(false);

  const [errorId, setErrorId] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');

  const [errorShow, setErrorShow] = useState(false);

  const [answerMultiValues, setMultiAnswerValues] = useState([]);

  const [equipmentImages, setEquipmentImages] = useState([]);

  const WEBAPPAPIURL = `${window.location.origin === 'http://localhost:3010' ? 'http://localhost:3000' : window.location.origin}/`;


  useEffect(() => {
    if (orderCheckLists) {
      setQuestions(orderCheckLists);
      const isAnswered = orderCheckLists.filter((item) => item.answer_common && item.answer_common.length);
      if (isAnswered && isAnswered.length) {
        const newArrData = orderCheckLists.map((cl) => ({
          id: cl.id,
          answer_type: cl.answer_type,
          value_text: cl.value_text,
          value_number: cl.value_number,
          value_suggested: cl && cl.value_suggested && cl.value_suggested.id ? cl.value_suggested.id : false,
          value_date: cl.value_date,
          type: cl.type,
          answer_common: cl.answer_common,
        }));
        setAnswerValues(newArrData);

        const newArrData1 = orderCheckLists.map((cl) => ({
          id: cl.id,
          question_group: cl.mro_quest_grp_id && cl.mro_quest_grp_id.name ? cl.mro_quest_grp_id.name : '',
          name: cl.mro_activity_id.name,
          answer_type: cl.answer_type,
          answer_common: cl.answer_common,
        }));
        setIpAnswerValues(newArrData1);
      }
    }
  }, [orderCheckLists]);

 /* useEffect(() => {
    if (questionValues && questionValues.length && getChecklistData()) {
      const array1 = getChecklistData();
      array1.forEach((item1) => {
        // Find the corresponding element in array2 by matching 'id'
        const matchingElement = questionValues.find((item2) => item2.id === item1.check_list_id);

        // If a matching element is found, modify its property, e.g., updating salary based on age
        if (matchingElement) {
          matchingElement.answer_common = getChecklistAnswer(item1.check_list_id); // Example: Set salary based on age
        }
      });
      setQuestions(questionValues);
    }
  }, []); */

  useEffect(() => {
    if (orderCheckLists && orderCheckLists.length) {
      setListDataInfo({
        loading: true, data: null, count: 0, err: null,
      });
      const fields = '["id","value"]';
      const newArrData = orderCheckLists.map((cl) => ({
        id: getColumnArrayById(cl.value_suggested_ids, 'id'),
      }));
      const newArrData1 = newArrData.filter((item) => (item.id && item.id.length));
      const newArrData2 = newArrData1 && newArrData1.length ? getColumnArrayById(newArrData1, 'id') : [];
      const ids = newArrData2 && newArrData2.length ? [...new Map(newArrData2.map((item) => [item, item])).values()] : [];
      const payload = `domain=[["id","!=",false],["id","in",[${ids}]]]&model=${appModels.ACTIVITYLINES}&fields=${fields}&offset=0&limit=1000&portalDomain=${window.location.origin}`;

      const config = {
        method: 'get',
        url: `${WEBAPPAPIURL}public/api/v4/search?${payload}`,
        headers: {
          portalDomain: window.location.origin,
          accountId: accid,
        },
      };

      axios(config)
        .then((response) => setListDataInfo({
          loading: false, data: response.data.data, count: response.data.length, err: null,
        }))
        .catch((error) => {
          setListDataInfo({
            loading: false, data: null, count: 0, err: error,
          });
        });
    }
  }, [orderCheckLists]);

  const handleCheckboxChange = (event, checklist) => {
    const { checked, value } = event.target;
    let checkValue = 'False';
    let checkValueDb = false;
    if (checked && (value === 'yes' || value === 'Yes')) {
      checkValue = 'True';
      checkValueDb = true;
    }
    const data = [{
      id: checklist.id, answer_type: checklist.answer_type, type: checkValueDb, answer_common: checkValue,
    }];
    const arr = [...answerValues, ...data];
    setAnswerValues([...new Map(arr.map((item) => [item.id, item])).values()]);

    const data2 = [{
      id: checklist.id, question_group: checklist.mro_quest_grp_id && checklist.mro_quest_grp_id.name ? checklist.mro_quest_grp_id.name : '', name: checklist.mro_activity_id.name, answer_type: checklist.answer_type, answer_common: checkValue,
    }];

    const arr2 = [...answerIpValues, ...data2];

    setIpAnswerValues([...new Map(arr2.map((item) => [item.id, item])).values()]);

    const detailIndex = questionValues.findIndex((obj) => (obj.id === checklist.id));
    questionValues[detailIndex].type = checkValueDb;
    questionValues[detailIndex].answer_common = checkValue;
    setQuestions(questionValues);
  };

  const handleCheckIconChange = (checklist, lids) => {
    const data = [{
      id: checklist.id, answer_type: checklist.answer_type, answer_common: lids.value,
    }];
    const arr = [...answerValues, ...data];
    setAnswerValues([...new Map(arr.map((item) => [item.id, item])).values()]);

    const data2 = [{
      id: checklist.id, question_group: checklist.mro_quest_grp_id && checklist.mro_quest_grp_id.name ? checklist.mro_quest_grp_id.name : '', name: checklist.mro_activity_id.name, answer_type: checklist.answer_type, answer_common: lids.value,
    }];

    const arr2 = [...answerIpValues, ...data2];

    setIpAnswerValues([...new Map(arr2.map((item) => [item.id, item])).values()]);

    const detailIndex = questionValues.findIndex((obj) => (obj.id === checklist.id));
    questionValues[detailIndex].answer_common = lids.value;
    setQuestions(questionValues);
  };

  const handleCheckChange = (event, checklist, lids) => {
    const { checked } = event.target;
    if (checked) {
      const data = [{
        id: checklist.id, answer_type: checklist.answer_type, answer_common: lids.value,
      }];
      const arr = [...answerValues, ...data];
      setAnswerValues([...new Map(arr.map((item) => [item.id, item])).values()]);

      const data2 = [{
        id: checklist.id, question_group: checklist.mro_quest_grp_id && checklist.mro_quest_grp_id.name ? checklist.mro_quest_grp_id.name : '', name: checklist.mro_activity_id.name, answer_type: checklist.answer_type, answer_common: lids.value,
      }];

      const arr2 = [...answerIpValues, ...data2];

      setIpAnswerValues([...new Map(arr2.map((item) => [item.id, item])).values()]);

      const detailIndex = questionValues.findIndex((obj) => (obj.id === checklist.id));
      questionValues[detailIndex].answer_common = lids.value;
      setQuestions(questionValues);
    } else {
      const detailIndex = questionValues.findIndex((obj) => (obj.id === checklist.id));
      const detailIndex2 = answerValues.findIndex((obj) => (obj.id === checklist.id));
      const detailIndex3 = answerIpValues.findIndex((obj) => (obj.id === checklist.id));
      questionValues[detailIndex].answer_common = '';
      answerValues[detailIndex2].answer_common = '';
      answerIpValues[detailIndex3].answer_common = '';
      setQuestions(questionValues);
      setAnswerValues(answerValues);
      setIpAnswerValues(answerIpValues);
    }
  };

  const handleCheckMultiIconChange = (checklist, lids) => {
    const isData = answerMultiValues.filter((item) => (item.answer_id === lids.id));

    const isIconChecked = isData && isData.length;

    if (!isIconChecked) {
      const data = [{
        question_id: checklist.id, answer: lids.value, answer_id: lids.id, answer_type: checklist.type,
      }];
      const arr = [...answerMultiValues, ...data];
      setMultiAnswerValues([...new Map(arr.map((item) => [item.answer_id, item])).values()]);

      const data1 = [{
        id: checklist.id, answer_type: checklist.answer_type, answer_common: getColumnArrayById([...new Map(arr.map((item) => [item.answer_id, item])).values()], 'answer').toString(),
      }];

      const arr1 = [...answerValues, ...data1];
      setAnswerValues([...new Map(arr1.map((item) => [item.id, item])).values()]);

      const data2 = [{
        id: checklist.id, question_group: checklist.mro_quest_grp_id && checklist.mro_quest_grp_id.name ? checklist.mro_quest_grp_id.name : '', name: checklist.mro_activity_id.name, answer_type: checklist.answer_type, answer_common: getColumnArrayById([...new Map(arr.map((item) => [item.answer_id, item])).values()], 'answer').toString(),
      }];

      const arr2 = [...answerIpValues, ...data2];

      setIpAnswerValues([...new Map(arr2.map((item) => [item.id, item])).values()]);

      const detailIndex = questionValues.findIndex((obj) => (obj.id === checklist.id));
      questionValues[detailIndex].answer_common = getColumnArrayById([...new Map(arr.map((item) => [item.answer_id, item])).values()], 'answer').toString();
      setQuestions(questionValues);
    } else {
      setMultiAnswerValues(answerMultiValues.filter((item) => (item.answer_id !== lids.id)));
      // setAnswerValues(answerValues.filter((item) => (item.answer_id !== lids.id)));

      const detailIndex = questionValues.findIndex((obj) => (obj.id === checklist.id));
      questionValues[detailIndex].answer_common = getColumnArrayById(answerMultiValues.filter((item) => (item.answer_id !== lids.id)), 'answer').toString();

      const detailIndex2 = answerValues.findIndex((obj) => (obj.id === checklist.id));
      answerValues[detailIndex2].answer_common = getColumnArrayById(answerMultiValues.filter((item) => (item.answer_id !== lids.id)), 'answer').toString();
      setAnswerValues(answerValues);

      const detailIndex3 = answerValues.findIndex((obj) => (obj.id === checklist.id));
      answerIpValues[detailIndex3].answer_common = getColumnArrayById(answerMultiValues.filter((item) => (item.answer_id !== lids.id)), 'answer').toString();
      setIpAnswerValues(answerIpValues);

      setQuestions(questionValues);
    }
  };

  const handleCheckMultiChange = (event, checklist, lids) => {
    const { checked } = event.target;
    if (checked) {
      const data = [{
        question_id: checklist.id, answer: lids.value, answer_id: lids.id, answer_type: checklist.type,
      }];
      const arr = [...answerMultiValues, ...data];
      setMultiAnswerValues([...new Map(arr.map((item) => [item.answer_id, item])).values()]);

      const detailIndex = questionValues.findIndex((obj) => (obj.id === checklist.id));
      questionValues[detailIndex].answer_common = getColumnArrayById([...new Map(arr.map((item) => [item.answer_id, item])).values()], 'answer').toString();
      setQuestions(questionValues);

      const data1 = [{
        id: checklist.id, answer_type: checklist.answer_type, answer_common: getColumnArrayById([...new Map(arr.map((item) => [item.answer_id, item])).values()], 'answer').toString(),
      }];

      const arr1 = [...answerValues, ...data1];
      setAnswerValues([...new Map(arr1.map((item) => [item.id, item])).values()]);

      const data2 = [{
        id: checklist.id, question_group: checklist.mro_quest_grp_id && checklist.mro_quest_grp_id.name ? checklist.mro_quest_grp_id.name : '', name: checklist.mro_activity_id.name, answer_type: checklist.answer_type, answer_common: getColumnArrayById([...new Map(arr.map((item) => [item.answer_id, item])).values()], 'answer').toString(),
      }];

      const arr2 = [...answerIpValues, ...data2];

      setIpAnswerValues([...new Map(arr2.map((item) => [item.id, item])).values()]);
    } else {
      setMultiAnswerValues(answerMultiValues.filter((item) => (item.answer_id !== lids.id)));

      const detailIndex = questionValues.findIndex((obj) => (obj.id === checklist.id));
      questionValues[detailIndex].answer = getColumnArrayById(answerMultiValues.filter((item) => (item.answer_id !== lids.id)), 'answer').toString();

      const detailIndex2 = answerValues.findIndex((obj) => (obj.id === checklist.id));
      answerValues[detailIndex2].answer_common = getColumnArrayById(answerMultiValues.filter((item) => (item.answer_id !== lids.id)), 'answer').toString();
      setAnswerValues(answerValues);

      const detailIndex3 = answerIpValues.findIndex((obj) => (obj.id === checklist.id));
      answerIpValues[detailIndex3].answer_common = getColumnArrayById(answerMultiValues.filter((item) => (item.answer_id !== lids.id)), 'answer').toString();
      setIpAnswerValues(answerIpValues);

      setQuestions(questionValues);
      setAnswerValues(answerValues);
      setIpAnswerValues(answerIpValues);
    }
  };

  const handleInputChange = (event, checklist) => {
    const { value } = event.target;
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
    const data = [{
      id: checklist.id, answer_type: checklist.answer_type, [field]: value, answer_common: value,
    }];
    const arr = [...answerValues, ...data];
    setAnswerValues([...new Map(arr.map((item) => [item.id, item])).values()]);

    const data1 = [{
      id: checklist.id, question_group: checklist.mro_quest_grp_id && checklist.mro_quest_grp_id.name ? checklist.mro_quest_grp_id.name : '', name: checklist.mro_activity_id.name, answer_type: checklist.answer_type, answer_common: value,
    }];

    const arr1 = [...answerIpValues, ...data1];

    setIpAnswerValues([...new Map(arr1.map((item) => [item.id, item])).values()]);

    const detailIndex = questionValues.findIndex((obj) => (obj.id === checklist.id));
    questionValues[detailIndex][field] = value;
    questionValues[detailIndex].answer_common = value;
    setQuestions(questionValues);
    if (!value && checklist && checklist.mro_activity_id && checklist.mro_activity_id.constr_mandatory) {
      setValidationMessage(checklist.mro_activity_id.constr_error_msg);
      setErrorId(checklist.id);
    } else {
      setValidationMessage('');
      setErrorId(false);
    }
  };

  const handleInputBlur = (event, checklist) => {
    const { value } = event.target;
    if (value && checklist && checklist.mro_activity_id && checklist.mro_activity_id.validation_required) {
      if ((checklist.answer_type === 'text' && checklist.mro_activity_id.validation_length_min && value.length < checklist.mro_activity_id.validation_length_min)
          || (checklist.answer_type === 'text' && checklist.mro_activity_id.validation_length_max && value.length > checklist.mro_activity_id.validation_length_max)
          || (checklist.answer_type === 'number' && checklist.mro_activity_id.validation_min_float_value && (parseInt(value) < parseInt(checklist.mro_activity_id.validation_min_float_value)))
          || (checklist.answer_type === 'number' && checklist.mro_activity_id.validation_max_float_value
            && (parseInt(value) > parseInt(checklist.mro_activity_id.validation_max_float_value)))) {
        setValidationMessage(checklist.mro_activity_id.validation_error_msg);
        setErrorId(checklist.id);
      } else {
        setValidationMessage('');
        setErrorId(false);
      }
    }

    if (!value && checklist && checklist.mro_activity_id && checklist.mro_activity_id.constr_mandatory) {
      setValidationMessage(checklist.mro_activity_id.constr_error_msg);
      setErrorId(checklist.id);
    }
  };

  const handleSuggestionSelect = (svalue, checklist) => {
    const value = svalue || false;
    const field = 'value_suggested';
    const data = [{ id: checklist.id, answer_type: checklist.answer_type, [field]: svalue && svalue.id ? svalue.id : false }];
    const arr = [...answerValues, ...data];
    setAnswerValues([...new Map(arr.map((item) => [item.id, item])).values()]);

    const data1 = [{
      id: checklist.id, question_group: checklist.mro_quest_grp_id && checklist.mro_quest_grp_id.name ? checklist.mro_quest_grp_id.name : '', name: checklist.mro_activity_id.name, answer_type: checklist.answer_type, answer_common: value,
    }];

    const arr1 = [...answerIpValues, ...data1];

    setIpAnswerValues([...new Map(arr1.map((item) => [item.id, item])).values()]);

    const detailIndex = questionValues.findIndex((obj) => (obj.id === checklist.id));
    questionValues[detailIndex][field] = value;
    questionValues[detailIndex].answer_common = value;
    setQuestions(questionValues);
  };

  const checkSuggestedValue = (index, suggestedIds) => {
    const ids = suggestedIds.length > 0 ? getColumnArrayById(suggestedIds, 'id') : [];
    const options = [];
    if (ids.length > 0 && listDataInfo && listDataInfo.data && listDataInfo.data.length > 0) {
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

  const checkSuggestedId = (sid, suggestedIds) => {
    const ids = suggestedIds.length > 0 ? getColumnArrayById(suggestedIds, 'id') : [];
    let slabel = '';
    if (sid && sid.id && ids.length > 0 && listDataInfo && listDataInfo.data && listDataInfo.data.length > 0) {
      const result = listDataInfo.data.filter((item) => (item.id === sid.id));
      slabel = result && result.length ? result[0].value : '';
    }
    return slabel;
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

  const getmaxLength = (type, qtn) => {
    let maxlength = 50;
    if (type === 'textbox' && qtn && qtn.validation_required && qtn.validation_length_max) {
      maxlength = qtn.validation_length_max;
    } else if ((type === 'numerical_box' || type === 'number') && qtn && qtn.validation_required && qtn.validation_max_float_value) {
      maxlength = qtn.validation_max_float_value;
    } else if ((type === 'numerical_box' || type === 'number') && qtn && !qtn.validation_required && !qtn.validation_max_float_value) {
      maxlength = 7;
    }
    return maxlength;
  };

  const getAnswer = (checklist) => {
    let answer = '';
    if (checklist.answer_type === 'text') {
      answer = checklist.value_text ? checklist.value_text : '';
    } else if (checklist.answer_type === 'number') {
      if (checklist.value_number === '') {
        answer = checklist.value_number;
      } else {
        answer = checklist.value_number ? parseInt(checklist.value_number) : '';
      }
    } else if (checklist.answer_type === 'date') {
      answer = checklist.value_date;
    } else if (checklist.answer_type === 'boolean') {
      if (checklist.answer_common === 'True') {
        answer = 'Yes';
      } else if (checklist.answer_common === 'False') {
        answer = 'No';
      } else {
        answer = '';
      }
    } else {
      answer = checklist.answer_common;
    }
    return answer;
  };

  const fileUpload = (fileContent) => {
    if (fileContent && fileContent.length) {
      // setUploadInfo({ loading: true, data: null, err: null });

      const newArrData = fileContent.map((cl) => ({
        datas: cl.datas,
        datas_fname: cl.datas_fname,
        name: cl.name,
        company_id: cl.company_id,
        res_model: cl.res_model,
        res_id: cl.res_id,
        description: cl.description,
      }));

      const data = {
        // uuid: viewId,
        values: newArrData,
      };

      const postData = new FormData();
      postData.append('values', JSON.stringify(data.values));
      /* if (typeof payload === 'object') {
          Object.keys(data).map((payloadObj) => {
            if (payloadObj !== 'uuid') {
              postData.append(payloadObj, data[payloadObj]);
            }
            return postData;
          });
        }

        if (data && data.uuid) {
          postData.append('uuid', data.uuid);
        } */

      const config = {
        method: 'post',
        url: `${WEBAPPAPIURL}public/api/v4/wp/Attachment`,
        headers: {
          'Content-Type': 'multipart/form-data',
          portalDomain: window.location.origin,
          accountId: accid,
        },
        data: postData,
      };

      axios(config)
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
          // setUploadInfo({ loading: false, data: null, err: error });
        });
    }
  };

  const updateWo = () => {
    if (detailData && detailData.order_id && detailData.order_id.id) {
      if (!detailData.is_service_report_required) {
        setWoUpdateInfo({
          loading: true, data: null, err: null, isHold: false,
        });
        setWoUpdateInfo1({
          loading: true, data: null, err: null, isHold: false,
        });
        const newArrData1 = answerValues;

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
          is_attachment_mandatory: cl.mro_activity_id && cl.mro_activity_id.is_attachment_mandatory ? cl.mro_activity_id.is_attachment_mandatory : false,
          write_date: new Date(),
        })) : [];
        let postDataValues = {
          checklist_json_data: JSON.stringify(newArrData),
          state: 'done',
          date_execution: getDateTimeUtc(new Date()),
        };

        if (timeSheetData && !timeSheetData.end_date) {
          postDataValues = {
            mro_timesheet_ids: [[1, timeSheetData.id, { end_date: getDateTimeUtc(new Date()), reason: 'Done', total_hours: parseFloat(calculateTimeDifference(timeSheetData.start_date, new Date(), true)) }]],
            checklist_json_data: JSON.stringify(newArrData),
            state: 'done',
            date_execution: getDateTimeUtc(new Date()),
          };
        }

        const data = {
          id: detailData.order_id.id,
          values: postDataValues,
        };

        const postData = new FormData();

        postData.append('values', JSON.stringify(data.values));

        postData.append('id', data.id);

        const config = {
          method: 'post',
          url: `${WEBAPPAPIURL}public/api/v4/wp/updateWPorder`,
          headers: {
            'Content-Type': 'multipart/form-data',
            portalDomain: window.location.origin,
            accountId: accid,
          },
          data: postData,
        };

        axios(config)
          .then((response) => {
            if (response.data.data) {
              setWoUpdateInfo({
                loading: false, data: response.data.data, err: null, isHold: false,
              });
              setWoUpdateInfo1({
                loading: false, data: response.data.data, err: null, isHold: false,
              });
            } else if (response.data && response.data.error && response.data.error.message) {
              setWoUpdateInfo({ loading: false, data: null, err: response.data.error.message });
              setWoUpdateInfo1({ loading: false, data: null, err: response.data.error.message });
            } else if (response.data.status) {
              setWoUpdateInfo({ loading: false, data: response.data.status, err: null });
              setWoUpdateInfo1({ loading: false, data: response.data.status, err: null });
              fileUpload(equipmentImages);
            }
          })
          .catch((error) => {
            setWoUpdateInfo({
              loading: false, data: null, err: error, isHold: false,
            });
            setWoUpdateInfo1({
              loading: false, data: null, err: error, isHold: false,
            });
          });
      } else {
        showServiceModal(true);
      }
    }
  };

  const updateWo1 = () => {
    if (detailData && detailData.order_id && detailData.order_id.id) {
      setWoUpdateInfo({
        loading: true, data: null, err: null, isHold: false,
      });
      setWoUpdateInfo1({
        loading: true, data: null, err: null, isHold: false,
      });
      const newArrData1 = answerValues;

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
        is_attachment_mandatory: cl.mro_activity_id && cl.mro_activity_id.is_attachment_mandatory ? cl.mro_activity_id.is_attachment_mandatory : false,
        write_date: new Date(),
      })) : [];
      let postDataValues = {
        checklist_json_data: JSON.stringify(newArrData),
        state: 'done',
        date_execution: getDateTimeUtc(new Date()),
      };

      if (timeSheetData && !timeSheetData.end_date) {
        postDataValues = {
          mro_timesheet_ids: [[1, timeSheetData.id, { end_date: getDateTimeUtc(new Date()), reason: 'Done', total_hours: parseFloat(calculateTimeDifference(timeSheetData.start_date, new Date(), true)) }]],
          checklist_json_data: JSON.stringify(newArrData),
          state: 'done',
          date_execution: getDateTimeUtc(new Date()),
        };
      }

      const data = {
        id: detailData.order_id.id,
        values: postDataValues,
      };

      const postData = new FormData();

      postData.append('values', JSON.stringify(data.values));

      postData.append('id', data.id);

      const config = {
        method: 'post',
        url: `${WEBAPPAPIURL}public/api/v4/wp/updateWPorder`,
        headers: {
          'Content-Type': 'multipart/form-data',
          portalDomain: window.location.origin,
          accountId: accid,
        },
        data: postData,
      };

      axios(config)
        .then((response) => {
          if (response.data.data) {
            setWoUpdateInfo({
              loading: false, data: response.data.data, err: null, isHold: false,
            });
            setWoUpdateInfo1({
              loading: false, data: response.data.data, err: null, isHold: false,
            });
          } else if (response.data && response.data.error && response.data.error.message) {
            setWoUpdateInfo({ loading: false, data: null, err: response.data.error.message });
            setWoUpdateInfo1({ loading: false, data: null, err: response.data.error.message });
          } else if (response.data.status) {
            setWoUpdateInfo({
              loading: false, data: response.data.status, err: null, isHold: false,
            });
            setWoUpdateInfo1({
              loading: false, data: response.data.status, err: null, isHold: false,
            });
            fileUpload(equipmentImages);
          }
        })
        .catch((error) => {
          setWoUpdateInfo({
            loading: false, data: null, err: error, isHold: false,
          });
          setWoUpdateInfo1({
            loading: false, data: null, err: error, isHold: false,
          });
        });
    }
  };

  const updateWo2 = () => {
    if (detailData && detailData.order_id && detailData.order_id.id) {
      setWoUpdateInfo({
        loading: true, data: null, err: null, isHold: false,
      });
      setWoUpdateInfo1({
        loading: true, data: null, err: null, isHold: false,
      });
      const newArrData1 = answerValues;

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
        is_attachment_mandatory: cl.mro_activity_id && cl.mro_activity_id.is_attachment_mandatory ? cl.mro_activity_id.is_attachment_mandatory : false,
        write_date: new Date(),
      })) : [];
      let postDataValues = {
        checklist_json_data: JSON.stringify(newArrData),
        state: 'pause',
        pause_reason_id: detailData.pause_reason_id && detailData.pause_reason_id.id ? detailData.pause_reason_id.id : false,
        reason: 'Service Report Pending',
      };

      if (timeSheetData && !timeSheetData.end_date) {
        postDataValues = {
          mro_timesheet_ids: [[1, timeSheetData.id, { end_date: getDateTimeUtc(new Date()), reason: 'Pause', total_hours: parseFloat(calculateTimeDifference(timeSheetData.start_date, new Date(), true)) }]],
          checklist_json_data: JSON.stringify(newArrData),
          state: 'pause',
          pause_reason_id: detailData.pause_reason_id && detailData.pause_reason_id.id ? detailData.pause_reason_id.id : false,
          reason: 'Service Report Pending',
        };
      }

      const data = {
        id: detailData.order_id.id,
        values: postDataValues,
      };

      const postData = new FormData();

      postData.append('values', JSON.stringify(data.values));

      postData.append('id', data.id);

      const config = {
        method: 'post',
        url: `${WEBAPPAPIURL}public/api/v4/wp/updateWPorder`,
        headers: {
          'Content-Type': 'multipart/form-data',
          portalDomain: window.location.origin,
          accountId: accid,
        },
        data: postData,
      };

      axios(config)
        .then((response) => {
          if (response.data.data) {
            setWoUpdateInfo({
              loading: false, data: response.data.data, err: null, isHold: true,
            });
            setWoUpdateInfo1({
              loading: false, data: response.data.data, err: null, isHold: true,
            });
          } else if (response.data && response.data.error && response.data.error.message) {
            setWoUpdateInfo({
              loading: false, data: null, err: response.data.error.message, isHold: false,
            });
            setWoUpdateInfo1({
              loading: false, data: null, err: response.data.error.message, isHold: false,
            });
          } else if (response.data.status) {
            setWoUpdateInfo({
              loading: false, data: response.data.status, err: null, isHold: false,
            });
            setWoUpdateInfo1({
              loading: false, data: response.data.status, err: null, isHold: false,
            });
            fileUpload(equipmentImages);
          }
        })
        .catch((error) => {
          setWoUpdateInfo({
            loading: false, data: null, err: error, isHold: false,
          });
          setWoUpdateInfo1({
            loading: false, data: null, err: error, isHold: false,
          });
        });
    }
  };

  function isImageExists(id) {
    let res = false;
    const data = equipmentImages.filter((item) => item.data_id === id);
    if (data && data.length) {
      res = true;
    }
    return res;
  }

  const handleFiles = (files, checklist) => {
    const companyId = companyData && companyData.id ? companyData.id : false;
    setimgSize(false);
    setImgFile(false);
    setimgId(false);
    if (files !== undefined) {
      const { name } = files.fileList[0];
      if (name && !name.match(/.(jpg|jpeg|svg|png|pdf|xlsx|ppt|docx|xls)$/i)) {
        setImgFile(true);
        setErrorShow(true);
        setimgId(checklist.id);
      } else {
        const remfile = `data:${files.fileList[0].type};base64,`;
        const photoname = files.fileList[0].name;
        const fname = `${getLocalTimeSeconds(new Date())}-${detailData.name}`.replace(/\s+/g, '');
        const filedata = files.base64.replace(remfile, '');
        const fileSize = files.fileList[0].size;
        const values = {
          datas: filedata,
          datas_fname: photoname,
          name: fname,
          company_id: companyId,
          res_model: 'mro.order',
          res_id: detailData.order_id && detailData.order_id.id ? detailData.order_id.id : false,
          data_id: checklist.id,
          data_type: files.fileList[0].type,
          description: checklist.mro_activity_id && checklist.mro_activity_id.name ? checklist.mro_activity_id.name : '',
        };

        if (bytesToSizeLow(fileSize)) {
          const arr = [...equipmentImages, ...[values]];
          const data = [...new Map(arr.map((item) => [item.name, item])).values()];
          setEquipmentImages(data);
          setImgFile(false);
        } else {
          setimgSize(true);
          setImgFile(false);
          setimgId(checklist.id);
          setErrorShow(true);
        }
      }
    }
  };

  const handleDelete = (name) => {
    if (name) {
      setEquipmentImages(equipmentImages.filter((item) => item.datas_fname !== name));
    }
  };

  const errorToggle = () => setErrorShow(!errorShow);

  function isImage(name) {
    let res = false;
    if (name && name.match(/.(jpg|jpeg|svg|png)$/i)) {
      res = true;
    }
    return res;
  }

  function isImageMaxExists(id) {
    let res = false;
    const data = equipmentImages.filter((item) => item.data_id === id);
    if (data && data.length < 5) {
      res = true;
    }
    return res;
  }

  function isChecked(checklist, lids) {
    let res = false;
    const isData = questionValues.filter((item) => (item.id === checklist.id && item.answer_common === lids.value));
    if (isData && isData.length) {
      res = true;
    }
    return res;
  }

  function isMultiChecked(checklist, lids) {
    let res1 = false;
    const isData = answerMultiValues.filter((item) => (item.answer_id === lids.id));
    const mcQtns = questionValues.filter((item) => (item.answer_type === 'multiple_choice' && item.id === checklist.id && item.answer_common && item.answer_common.toString().includes(lids.value)));
    if (isData && isData.length) {
      res1 = true;
    } else if (mcQtns && mcQtns.length) {
      res1 = true;
    }

    return res1;
  }

  const mandAnsData = questionValues && questionValues.length ? questionValues.filter((item) => (item.mro_activity_id && item.mro_activity_id.constr_mandatory && !item.answer_common)) : [];
  const requireAttachData = questionValues && questionValues.length ? questionValues.filter((item) => (item.mro_activity_id && item.mro_activity_id.has_attachment && item.mro_activity_id.is_attachment_mandatory)) : [];
  const reqAttachIds = getColumnArrayById(requireAttachData, 'id');
  const totalUniqueImages = equipmentImages && equipmentImages.length ? [...new Map(equipmentImages.map((item) => [item.data_id, item])).values()] : [];
  const uploadedIds = getArrayFromValuesByIdInLength(totalUniqueImages, reqAttachIds, 'data_id');
  const isReqAttachAdded = (uploadedIds.length === reqAttachIds.length);
  const oneDataReq = questionValues && questionValues.length ? questionValues.filter((item) => (item.answer_common)) : [];
  const mandAnsLen = mandAnsData && mandAnsData.length;

  const ansLen = oneDataReq && oneDataReq.length;
  const allLen = questionValues && questionValues.length;
  const notAllAns = parseInt(ansLen) !== parseInt(allLen);

  const disabledButton = !isReqAttachAdded || errorId || mandAnsLen || notAllAns || (woUpdateInfo && woUpdateInfo.loading);
  const dataLoading = (woUpdateInfo && woUpdateInfo.loading);
  const showButton = !(orderCheckLists && orderCheckLists.length);
  const isSuccess = woUpdateInfo && woUpdateInfo.data;

  return (
    <>

      {!isSuccess && !dataLoading && (
        <>
          <Box
            sx={{
              width: '100%',
              backgroundColor: '#F6F8FA',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10%',
              fontFamily: 'Suisse Intl',
            }}
            className="check-list-scroll thin-scrollbar"
          >
            <>
              <Row>
                <Col md="12" sm="12" lg="12" xs="12">
                  <div className="">
                    {questionValues && questionValues.length > 0 && questionValues.map((item, index) => (
                      <div key={item.id}>
                        <Row className="font-weight-600">
                          {!isMobileView && (
                          <Col md="1" sm="3" xs="3" lg="1">
                            <img
                              alt="questionIcon"
                              width="18"
                              height="18"
                              className="mr-2 mb-2 mt-2"
                              src={questionIcon}
                            />
                          </Col>
                          )}
                          <Col md="9" sm="10" xs="10" lg="9">
                            {isMobileView ? `${index + 1})` : ''}
                            {' '}
                            {item.mro_activity_id && item.mro_activity_id.name ? item.mro_activity_id.name : ''}
                          </Col>
                          <Col md="2" sm="2" xs="2" lg="2" className="text-right">
                            {(item.mro_activity_id.type === 'suggestion' && item.value_suggested && item.answer_common !== false) && (
                            <img alt="assigned" width="17" height="17" className="mr-1" src={fullyAssignIcon} />
                            )}
                            {(item.answer_common && item.mro_activity_id.type !== 'suggestion') && (
                            <img alt="assigned" width="17" height="17" className="mr-1" src={fullyAssignIcon} />
                            )}
                          </Col>
                        </Row>
                        <Row className="font-weight-400">
                          {!isMobileView && (
                          <Col md="1" sm="3" xs="3" lg="1">
                            <img
                              alt="answerIcon"
                              width="18"
                              height="18"
                              className="mr-2 mb-2 mt-2"
                              src={answerIcon}
                            />
                          </Col>
                          )}
                          {item.mro_activity_id.type === 'suggestion' && (
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
                            {item.mro_activity_id && item.mro_activity_id.has_attachment && (
                            <>
                              <div className="text-right mt-3 text-line-height-2 mr-3">
                                {isImageMaxExists(item.id) && (
                                <ReactFileReader handleFiles={(files) => handleFiles(files, item)} elementId={item.id} fileTypes="*" base64>
                                  <img src={uploadIcon} className="mr-1" alt="upload" height="20" />
                                  <span className="text-lightblue font-tiny cursor-pointer"> Upload</span>
                                  {item.mro_activity_id && item.mro_activity_id.is_attachment_mandatory && !isImageExists(item.id) && (<span className="text-danger font-weight-800 ml-1"> *</span>)}
                                </ReactFileReader>
                                )}
                              </div>
                              <Row className="ml-1 mr-1">
                                <Image.PreviewGroup>
                                  {(equipmentImages && equipmentImages.length > 0) && equipmentImages.map((document) => (
                                    <Suspense key={document.data_id} fallback={<div>Loading...</div>}>
                                      {(document.data_id === item.id) && isImage(document.datas_fname) && (
                                      <div className="mr-3 mb-2">
                                        <Image
                                          width={60}
                                          height={60}
                                          src={`data:${document.data_type};base64,${document.datas}`}
                                        />
                                        <br />
                                        <Tooltip title={document.datas_fname} placement="top">
                                          <span className="mr-2 float-left font-tiny">{truncate(document.datas_fname, 10)}</span>
                                        </Tooltip>
                                        <Tooltip title="Delete" placement="top">
                                          <FontAwesomeIcon
                                            size="sm"
                                            className="cursor-pointer mt-1 mr-2 float-right"
                                            icon={faTrashAlt}
                                            onClick={() => { handleDelete(document.datas_fname); }}
                                          />
                                        </Tooltip>
                                      </div>
                                      )}
                                    </Suspense>
                                  ))}
                                </Image.PreviewGroup>

                                {(equipmentImages && equipmentImages.length > 0) && equipmentImages.map((document) => (
                                  <>
                                    {(document.data_id === item.id) && !isImage(document.datas_fname) && (
                                    <div className="mr-3 mb-2">
                                      <img className="cursor-pointer" width="60" height="60" src={fileMiniIcon} alt="fileMiniIcon" />
                                      <br />
                                      <Tooltip title={document.datas_fname} placement="top">
                                        <span className="mr-2 float-left font-tiny">{truncate(document.datas_fname, 10)}</span>
                                      </Tooltip>
                                      <Tooltip title="Delete" placement="top">
                                        <FontAwesomeIcon
                                          size="sm"
                                          className="cursor-pointer mt-1 mr-2 float-right"
                                          icon={faTrashAlt}
                                          onClick={() => { handleDelete(document.datas_fname); }}
                                        />
                                      </Tooltip>
                                    </div>
                                    )}
                                  </>
                                ))}
                              </Row>
                              <div>
                                {imgSize && imgId === item.id
                                  ? (
                                    <Toast isOpen={errorShow} className="mt-2 ml-2">
                                      <ToastHeader icon="danger" toggle={errorToggle}>FAILED</ToastHeader>
                                      <ToastBody className="text-left">
                                        Upload files less than 5 MB
                                      </ToastBody>
                                    </Toast>
                                  ) : ''}
                                {imgFile && imgId === item.id
                                  ? (
                                    <Toast isOpen={errorShow} className="mt-2 ml-2">
                                      <ToastHeader icon="danger" toggle={errorToggle}>FAILED</ToastHeader>
                                      <ToastBody className="text-left">
                                        Upload .jpg, .jpeg, .svg, .png, .pdf, .xlsx, .ppt, .docx, .xls Only
                                      </ToastBody>
                                    </Toast>
                                  ) : ''}
                              </div>
                            </>
                            )}
                          </Col>
                          )}
                          {item.mro_activity_id.type === 'boolean' && (
                          <>
                            <Col className={item.mro_activity_id.type === 'boolean' ? 'mt-0 col-auto' : 'col-auto'}>
                              <FormControl>
                                <RadioGroup
                                  aria-labelledby="demo-radio-buttons-group-label"
                                  name="radio-buttons-group"
                                  onChange={(e) => handleCheckboxChange(e, item)}
                                  defaultValue={getAnswer(item)}
                                >
                                  <Box sx={{ display: 'flex' }}>
                                    <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                                    <FormControlLabel value="No" control={<Radio />} label="No" />
                                  </Box>
                                </RadioGroup>
                              </FormControl>
                            </Col>
                            {item.mro_activity_id && item.mro_activity_id.has_attachment && (
                            <Col
                              md="12"
                              sm="12"
                              lg="12"
                              xs="12"
                              className="ml-0 mt-1"
                            >
                              <div className="text-right mt-3 text-line-height-2 mr-3">
                                {isImageMaxExists(item.id) && (
                                <ReactFileReader handleFiles={(files) => handleFiles(files, item)} elementId={item.id} fileTypes="*" base64>
                                  <img src={uploadIcon} className="mr-1" alt="upload" height="20" />
                                  <span className="text-lightblue font-tiny cursor-pointer"> Upload</span>
                                  {item.mro_activity_id && item.mro_activity_id.is_attachment_mandatory && !isImageExists(item.id) && (<span className="text-danger font-weight-800 ml-1"> *</span>)}
                                </ReactFileReader>
                                )}
                              </div>
                              <Row className="ml-5 mr-1 pl-5">
                                <Image.PreviewGroup>
                                  {(equipmentImages && equipmentImages.length > 0) && equipmentImages.map((document) => (
                                    <Suspense key={document.data_id} fallback={<div>Loading...</div>}>
                                      {(document.data_id === item.id) && isImage(document.datas_fname) && (
                                      <div className="mr-3 mb-2">
                                        <Image
                                          width={60}
                                          height={60}
                                          src={`data:${document.data_type};base64,${document.datas}`}
                                        />
                                        <br />
                                        <Tooltip title={document.datas_fname} placement="top">
                                          <span className="mr-2 float-left font-tiny">{truncate(document.datas_fname, 10)}</span>
                                        </Tooltip>
                                        <Tooltip title="Delete" placement="top">
                                          <FontAwesomeIcon
                                            size="sm"
                                            className="cursor-pointer mt-1 mr-2 float-right"
                                            icon={faTrashAlt}
                                            onClick={() => { handleDelete(document.datas_fname); }}
                                          />
                                        </Tooltip>
                                      </div>
                                      )}
                                    </Suspense>
                                  ))}
                                </Image.PreviewGroup>

                                {(equipmentImages && equipmentImages.length > 0) && equipmentImages.map((document) => (
                                  <>
                                    {(document.data_id === item.id) && !isImage(document.datas_fname) && (
                                    <div className="mr-3 mb-2">
                                      <img className="cursor-pointer" width="60" height="60" src={fileMiniIcon} alt="fileMiniIcon" />
                                      <br />
                                      <Tooltip title={document.datas_fname} placement="top">
                                        <span className="mr-2 float-left font-tiny">{truncate(document.datas_fname, 10)}</span>
                                      </Tooltip>
                                      <Tooltip title="Delete" placement="top">
                                        <FontAwesomeIcon
                                          size="sm"
                                          className="cursor-pointer mt-1 mr-2 float-right"
                                          icon={faTrashAlt}
                                          onClick={() => { handleDelete(document.datas_fname); }}
                                        />
                                      </Tooltip>
                                    </div>
                                    )}
                                  </>
                                ))}
                              </Row>
                              <div>
                                {imgSize && imgId === item.id
                                  ? (
                                    <Toast isOpen={errorShow} className="mt-2 ml-2">
                                      <ToastHeader icon="danger" toggle={errorToggle}>FAILED</ToastHeader>
                                      <ToastBody className="text-left">
                                        Upload files less than 5 MB
                                      </ToastBody>
                                    </Toast>
                                  ) : ''}
                                {imgFile && imgId === item.id
                                  ? (
                                    <Toast isOpen={errorShow} className="mt-2 ml-2">
                                      <ToastHeader icon="danger" toggle={errorToggle}>FAILED</ToastHeader>
                                      <ToastBody className="text-left">
                                        Upload .jpg, .jpeg, .svg, .png, .pdf, .xlsx, .ppt, .docx, .xls Only
                                      </ToastBody>
                                    </Toast>
                                  ) : ''}
                              </div>
                            </Col>
                            )}
                          </>
                          )}
                          {item.mro_activity_id.type !== 'simple_choice' && item.mro_activity_id.type !== 'multiple_choice' && item.mro_activity_id.type !== 'boolean' && item.mro_activity_id.type !== 'suggestion' && (
                          <Col md="11" sm="9" xs="9" lg="11" className={item.mro_activity_id.type === 'boolean' ? 'mt-0 pt-2' : ''}>
                            <Input
                              type={getInputType(item.mro_activity_id.type)}
                              className="m-0 position-relative"
                              name="answerValue"
                              maxLength={getmaxLength(item.mro_activity_id.type, item.mro_activity_id)}
                              required={item.mro_activity_id && item.mro_activity_id.constr_mandatory}
                              onKeyPress={item.mro_activity_id.type === 'numerical_box' || item.mro_activity_id.type === 'number' ? integerKeyPress : lettersOnly}
                              defaultValue={getAnswer(item) ? getAnswer(item) : ''}
                                        // value={getAnswer(item)}
                              onChange={(e) => (handleInputChange(e, item))}
                              onBlur={(e) => handleInputBlur(e, item)}
                            />
                            {errorId && errorId === item.id && validationMessage && (
                            <p className="text-danger mt-1 mb-0">{validationMessage}</p>
                            )}
                            {item.mro_activity_id && item.mro_activity_id.has_attachment && (
                            <>
                              <div className="text-right mt-3 text-line-height-2 mr-3">
                                {isImageMaxExists(item.id) && (
                                <ReactFileReader handleFiles={(files) => handleFiles(files, item)} elementId={item.id} fileTypes="*" base64>
                                  <img src={uploadIcon} className="mr-1" alt="upload" height="20" />
                                  <span className="text-lightblue font-tiny cursor-pointer"> Upload</span>
                                  {item.mro_activity_id && item.mro_activity_id.is_attachment_mandatory && !isImageExists(item.id) && (<span className="text-danger font-weight-800 ml-1"> *</span>)}
                                </ReactFileReader>
                                )}
                              </div>
                              <Row className="ml-1 mr-1">
                                <Image.PreviewGroup>
                                  {(equipmentImages && equipmentImages.length > 0) && equipmentImages.map((document) => (
                                    <Suspense key={document.data_id} fallback={<div>Loading...</div>}>
                                      {(document.data_id === item.id) && isImage(document.datas_fname) && (
                                      <div className="mr-3 mb-2">
                                        <Image
                                          width={60}
                                          height={60}
                                          src={`data:${document.data_type};base64,${document.datas}`}
                                        />
                                        <br />
                                        <Tooltip title={document.datas_fname} placement="top">
                                          <span className="mr-2 float-left font-tiny">{truncate(document.datas_fname, 10)}</span>
                                        </Tooltip>
                                        <Tooltip title="Delete" placement="top">
                                          <FontAwesomeIcon
                                            size="sm"
                                            className="cursor-pointer mt-1 mr-2 float-right"
                                            icon={faTrashAlt}
                                            onClick={() => { handleDelete(document.datas_fname); }}
                                          />
                                        </Tooltip>
                                      </div>
                                      )}
                                    </Suspense>
                                  ))}
                                </Image.PreviewGroup>

                                {(equipmentImages && equipmentImages.length > 0) && equipmentImages.map((document) => (
                                  <>
                                    {(document.data_id === item.id) && !isImage(document.datas_fname) && (
                                    <div className="mr-3 mb-2">
                                      <img className="cursor-pointer" width="60" height="60" src={fileMiniIcon} alt="fileMiniIcon" />
                                      <br />
                                      <Tooltip title={document.datas_fname} placement="top">
                                        <span className="mr-2 float-left font-tiny">{truncate(document.datas_fname, 10)}</span>
                                      </Tooltip>
                                      <Tooltip title="Delete" placement="top">
                                        <FontAwesomeIcon
                                          size="sm"
                                          className="cursor-pointer mt-1 mr-2 float-right"
                                          icon={faTrashAlt}
                                          onClick={() => { handleDelete(document.datas_fname); }}
                                        />
                                      </Tooltip>
                                    </div>
                                    )}
                                  </>
                                ))}
                              </Row>
                              <div>
                                {imgSize && imgId === item.id
                                  ? (
                                    <Toast isOpen={errorShow} className="mt-2 ml-2">
                                      <ToastHeader icon="danger" toggle={errorToggle}>FAILED</ToastHeader>
                                      <ToastBody className="text-left">
                                        Upload files less than 5 MB
                                      </ToastBody>
                                    </Toast>
                                  ) : ''}
                                {imgFile && imgId === item.id
                                  ? (
                                    <Toast isOpen={errorShow} className="mt-2 ml-2">
                                      <ToastHeader icon="danger" toggle={errorToggle}>FAILED</ToastHeader>
                                      <ToastBody className="text-left">
                                        Upload .jpg, .jpeg, .svg, .png, .pdf, .xlsx, .ppt, .docx, .xls Only
                                      </ToastBody>
                                    </Toast>
                                  ) : ''}
                              </div>
                            </>
                            )}
                          </Col>
                          )}
                          {item.mro_activity_id.type === 'simple_choice' && (
                          <>
                            {item.mro_activity_id.labels_ids && item.mro_activity_id.labels_ids.map((lid) => (
                              (lid.favicon || lid.emoji) && (
                              <Col
                                md="3"
                                sm="6"
                                lg="3"
                                xs="6"
                                key={lid.id}
                                className="cursor-pointer"
                                onClick={() => handleCheckIconChange(item, lid)}
                              >

                                <div
                                  style={isChecked(item, lid) ? { border: `2px solid ${lid.color}` } : {}}
                                  className={`${isChecked(item, lid) ? 'highlighted-shadow-box' : ''} p-3`}
                                >
                                  {lid.favicon && (
                                  <>
                                    <FontAwesomeIcon
                                      icon={lid.favicon}
                                      style={isChecked(item, lid) ? { color: lid.color } : {}}
                                      className="fa-2x"
                                      size="lg"
                                    />
                                    <p
                                      style={isChecked(item, lid) ? { color: lid.color } : {}}
                                      className="mt-2 mb-0 text-capital word-break-content"
                                    >
                                      {lid.value}
                                    </p>
                                  </>
                                  )}
                                  {lid.emoji && (
                                  <>
                                    <p
                                      style={isChecked(item, lid) ? { color: lid.color } : {}}
                                      className="mb-0 fa-2x "
                                    >
                                      {lid.emoji.length === 2 && !lid.emoji.includes('+1') && !lid.emoji.includes('-1') ? lid.emoji : <Emoji emoji={lid.emoji} set="google" size={32} />}
                                    </p>
                                    <p
                                      style={isChecked(item, lid) ? { color: lid.color } : {}}
                                      className="mt-2 mb-0 text-capital word-break-content"
                                    >
                                      {lid.value}
                                    </p>
                                  </>
                                  )}
                                </div>
                              </Col>
                              )))}
                            {item.mro_activity_id.labels_ids && item.mro_activity_id.labels_ids.map((lid) => (
                              <>
                                {!lid.favicon && !lid.emoji && (
                                <Col
                                  md="2"
                                  sm="6"
                                  lg="2"
                                  xs="6"
                                  key={lid.id}
                                  className="cursor-pointer"
                                >
                                  <FormControlLabel
                                    key={lid.id}
                                    className={`${isChecked(item, lid) ? 'bg-cloud-burst' : 'bg-lightblue'}`}
                                    checked={isChecked(item, lid)}
                                    name={item.mro_activity_id.name}
                                    value={lid.value}
                                    control={(
                                      <Radio
                                        size="small"
                                        required={item.mro_activity_id.constr_mandatory}
                                        onChange={(e) => handleCheckChange(e, item, lid)}
                                      />
                                                )}
                                    label={lid.value}
                                  />
                                </Col>
                                )}
                              </>
                            ))}
                            {errorId && errorId === item.id && validationMessage && (
                            <p className="text-danger mt-3 mb-0">{validationMessage}</p>
                            )}
                            {item.mro_activity_id && item.mro_activity_id.has_attachment && (
                            <>
                              <Col
                                md="12"
                                sm="12"
                                lg="12"
                                xs="12"
                                className="ml-0"
                              >
                                <div className="text-right mt-3 text-line-height-2 mr-3">
                                  {isImageMaxExists(item.id) && (
                                  <ReactFileReader handleFiles={(files) => handleFiles(files, item)} elementId={item.id} fileTypes="*" base64>
                                    <img src={uploadIcon} className="mr-1" alt="upload" height="20" />
                                    <span className="text-lightblue font-tiny cursor-pointer"> Upload</span>
                                    {item.mro_activity_id && item.mro_activity_id.is_attachment_mandatory && !isImageExists(item.id) && (<span className="text-danger font-weight-800 ml-1"> *</span>)}
                                  </ReactFileReader>
                                  )}
                                </div>
                                <Row className="ml-5 mr-1 pl-5">
                                  <Image.PreviewGroup>
                                    {(equipmentImages && equipmentImages.length > 0) && equipmentImages.map((document) => (
                                      <Suspense key={document.data_id} fallback={<div>Loading...</div>}>
                                        {(document.data_id === item.id) && isImage(document.datas_fname) && (
                                        <div className="mr-3 mb-2">
                                          <Image
                                            width={60}
                                            height={60}
                                            src={`data:${document.data_type};base64,${document.datas}`}
                                          />
                                          <br />
                                          <Tooltip title={document.datas_fname} placement="top">
                                            <span className="mr-2 float-left font-tiny">{truncate(document.datas_fname, 10)}</span>
                                          </Tooltip>
                                          <Tooltip title="Delete" placement="top">
                                            <FontAwesomeIcon
                                              size="sm"
                                              className="cursor-pointer mt-1 mr-2 float-right"
                                              icon={faTrashAlt}
                                              onClick={() => { handleDelete(document.datas_fname); }}
                                            />
                                          </Tooltip>
                                        </div>
                                        )}
                                      </Suspense>
                                    ))}
                                  </Image.PreviewGroup>

                                  {(equipmentImages && equipmentImages.length > 0) && equipmentImages.map((document) => (
                                    <>
                                      {(document.data_id === item.id) && !isImage(document.datas_fname) && (
                                      <div className="mr-3 mb-2">
                                        <img className="cursor-pointer" width="60" height="60" src={fileMiniIcon} alt="fileMiniIcon" />
                                        <br />
                                        <Tooltip title={document.datas_fname} placement="top">
                                          <span className="mr-2 float-left font-tiny">{truncate(document.datas_fname, 10)}</span>
                                        </Tooltip>
                                        <Tooltip title="Delete" placement="top">
                                          <FontAwesomeIcon
                                            size="sm"
                                            className="cursor-pointer mt-1 mr-2 float-right"
                                            icon={faTrashAlt}
                                            onClick={() => { handleDelete(document.datas_fname); }}
                                          />
                                        </Tooltip>
                                      </div>
                                      )}
                                    </>
                                  ))}
                                </Row>
                              </Col>
                              <div>
                                {imgSize && imgId === item.id
                                  ? (
                                    <Toast isOpen={errorShow} className="mt-2 ml-2">
                                      <ToastHeader icon="danger" toggle={errorToggle}>FAILED</ToastHeader>
                                      <ToastBody className="text-left">
                                        Upload files less than 5 MB
                                      </ToastBody>
                                    </Toast>
                                  ) : ''}
                                {imgFile && imgId === item.id
                                  ? (
                                    <Toast isOpen={errorShow} className="mt-2 ml-2">
                                      <ToastHeader icon="danger" toggle={errorToggle}>FAILED</ToastHeader>
                                      <ToastBody className="text-left">
                                        Upload .jpg, .jpeg, .svg, .png, .pdf, .xlsx, .ppt, .docx, .xls Only
                                      </ToastBody>
                                    </Toast>
                                  ) : ''}
                              </div>
                            </>
                            )}
                          </>
                          )}
                          {item.mro_activity_id.type === 'multiple_choice' && (
                          <>

                            {item.mro_activity_id.labels_ids && item.mro_activity_id.labels_ids.map((lid) => (
                              (lid.favicon || lid.emoji) && (
                              <Col
                                md="3"
                                sm="6"
                                lg="3"
                                xs="6"
                                key={lid.id}
                                className="cursor-pointer"
                                onClick={() => handleCheckMultiIconChange(item, lid)}
                              >

                                <div
                                  style={isMultiChecked(item, lid) ? { border: `2px solid ${lid.color}` } : {}}
                                  className={`${isMultiChecked(item, lid) ? 'highlighted-shadow-box' : ''} p-3`}
                                >
                                  {lid.favicon && (
                                  <>
                                    <FontAwesomeIcon
                                      icon={lid.favicon}
                                      className="fa-2x"
                                      style={isMultiChecked(item, lid) ? { color: lid.color } : {}}
                                      size="lg"
                                    />
                                    <p
                                      style={isMultiChecked(item, lid) ? { color: lid.color } : {}}
                                      className="mt-2 mb-0 text-capital word-break-content"
                                    >
                                      {lid.value}
                                    </p>
                                  </>
                                  )}
                                  {lid.emoji && (
                                  <>
                                    <p
                                      style={isMultiChecked(item, lid) ? { color: lid.color } : {}}
                                      className="fa-2x mb-0"
                                    >
                                      {lid.emoji.length === 2 && !lid.emoji.includes('+1') && !lid.emoji.includes('-1') ? lid.emoji : <Emoji emoji={lid.emoji} set="google" size={32} />}
                                    </p>
                                    <p
                                      style={isMultiChecked(item, lid) ? { color: lid.color } : {}}
                                      className="mt-2 mb-0 text-capital word-break-content"
                                    >
                                      {lid.value}
                                    </p>
                                  </>
                                  )}
                                </div>
                              </Col>
                              )))}
                            <Col
                              md="11"
                              sm="11"
                              lg="11"
                              xs="11"
                            >
                              {item.mro_activity_id.labels_ids && item.mro_activity_id.labels_ids.map((lid) => (
                                <>
                                  {!lid.favicon && !lid.emoji && (

                                  <FormControlLabel
                                    key={lid.id}
                                    className={`${isMultiChecked(item, lid) ? 'bg-cloud-burst' : 'bg-lightblue'}`}
                                    name={lid.value}
                                    value={lid.value}
                                    control={(
                                      <Checkbox
                                        size="small"
                                        defaultChecked={isMultiChecked(item, lid)}
                                        required={item.mro_activity_id.constr_mandatory}
                                        onChange={(e) => handleCheckMultiChange(e, item, lid)}
                                      />
                                                )}
                                    label={lid.value}
                                  />
                                  )}
                                </>
                              ))}
                            </Col>
                            {item.mro_activity_id && item.mro_activity_id.has_attachment && (
                            <>
                              <Col
                                md="12"
                                sm="12"
                                lg="12"
                                xs="12"
                                className="ml-0"
                              >
                                <div className="text-right mt-3 text-line-height-2 mr-3">
                                  {isImageMaxExists(item.id) && (
                                  <ReactFileReader handleFiles={(files) => handleFiles(files, item)} elementId={item.id} fileTypes="*" base64>
                                    <img src={uploadIcon} className="mr-1" alt="upload" height="20" />
                                    <span className="text-lightblue font-tiny cursor-pointer"> Upload</span>
                                    {item.mro_activity_id && item.mro_activity_id.is_attachment_mandatory && !isImageExists(item.id) && (<span className="text-danger font-weight-800 ml-1"> *</span>)}
                                  </ReactFileReader>
                                  )}
                                </div>
                                <Row className="ml-5 mr-1 pl-5">
                                  <Image.PreviewGroup>
                                    {(equipmentImages && equipmentImages.length > 0) && equipmentImages.map((document) => (
                                      <Suspense key={document.data_id} fallback={<div>Loading...</div>}>
                                        {(document.data_id === item.id) && isImage(document.datas_fname) && (
                                        <div className="mr-3 mb-2">
                                          <Image
                                            width={60}
                                            height={60}
                                            src={`data:${document.data_type};base64,${document.datas}`}
                                          />
                                          <br />
                                          <Tooltip title={document.datas_fname} placement="top">
                                            <span className="mr-2 float-left font-tiny">{truncate(document.datas_fname, 10)}</span>
                                          </Tooltip>
                                          <Tooltip title="Delete" placement="top">
                                            <FontAwesomeIcon
                                              size="sm"
                                              className="cursor-pointer mt-1 mr-2 float-right"
                                              icon={faTrashAlt}
                                              onClick={() => { handleDelete(document.datas_fname); }}
                                            />
                                          </Tooltip>
                                        </div>
                                        )}
                                      </Suspense>
                                    ))}
                                  </Image.PreviewGroup>

                                  {(equipmentImages && equipmentImages.length > 0) && equipmentImages.map((document) => (
                                    <>
                                      {(document.data_id === item.id) && !isImage(document.datas_fname) && (
                                      <div className="mr-3 mb-2">
                                        <img className="cursor-pointer" width="60" height="60" src={fileMiniIcon} alt="fileMiniIcon" />
                                        <br />
                                        <Tooltip title={document.datas_fname} placement="top">
                                          <span className="mr-2 float-left font-tiny">{truncate(document.datas_fname, 10)}</span>
                                        </Tooltip>
                                        <Tooltip title="Delete" placement="top">
                                          <FontAwesomeIcon
                                            size="sm"
                                            className="cursor-pointer mt-1 mr-2 float-right"
                                            icon={faTrashAlt}
                                            onClick={() => { handleDelete(document.datas_fname); }}
                                          />
                                        </Tooltip>
                                      </div>
                                      )}
                                    </>
                                  ))}
                                </Row>
                              </Col>
                              <div>
                                {imgSize && imgId === item.id
                                  ? (
                                    <Toast isOpen={errorShow} className="mt-2 ml-2">
                                      <ToastHeader icon="danger" toggle={errorToggle}>FAILED</ToastHeader>
                                      <ToastBody className="text-left">
                                        Upload files less than 5 MB
                                      </ToastBody>
                                    </Toast>
                                  ) : ''}
                                {imgFile && imgId === item.id
                                  ? (
                                    <Toast isOpen={errorShow} className="mt-2 ml-2">
                                      <ToastHeader icon="danger" toggle={errorToggle}>FAILED</ToastHeader>
                                      <ToastBody className="text-left">
                                        Upload .jpg, .jpeg, .svg, .png, .pdf, .xlsx, .ppt, .docx, .xls Only
                                      </ToastBody>
                                    </Toast>
                                  ) : ''}
                              </div>
                            </>
                            )}
                          </>
                          )}
                        </Row>
                        <hr className="mt-2 mb-2" />
                      </div>
                    ))}
                  </div>
                </Col>
              </Row>
              {(!disabledButton || showButton) && (
              <div className="text-center mt-3 mb-3">
                <h5 className="mb-3">
                  Are you sure to submit the checklists
                </h5>
                {(woUpdateInfo && woUpdateInfo.loading) && (
                <div className="text-center mt-4 mb-4">
                  <Loader />
                </div>
                )}
                {(woUpdateInfo && woUpdateInfo.err) && (
                <div className="text-center mt-3 mb-3">
                  <SuccessAndErrorFormat response={woUpdateInfo} />
                </div>
                )}
              </div>
              )}
            </>
          </Box>
          <div className="text-center mt-2">
            <Button
              type="button"
              size="medium"
              variant="contained"
              disabled={(!showButton && disabledButton)}
              onClick={() => { updateWo(); setErrorId(false); setValidationMessage(''); }}
            >
              <img src={checkWhite} className="mr-2" alt="Prepare" width="13" height="13" />
              <span>Submit and Complete</span>
            </Button>
            {!isReqAttachAdded && (
            <p className="text-danger">Please upload files for all mandatory checklists.</p>
            )}
          </div>
        </>
      )}
      {dataLoading && (
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
          {' '}
          <Loader />
          {' '}

        </Box>
      )}
      <Dialog fullWidth={isMobileView} maxWidth={isMobileView ? 'xl' : 'md'} open={isModal}>
        <DialogHeader title="Upload Attachments" onClose={() => setModalOpen(false)} response={startInfo} imagePath={checkCircleBlack} />
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
              <ImageUpload
                viewId={detailData.id}
                ticketId={currentChecklist}
                ticketNumber={detailData.name}
                resModel="ppm.scheduler_week"
                model={appModels.DOCUMENT}
                companyId={companyData && companyData.id ? companyData.id : false}
              />
            </Box>
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Dialog fullWidth={isMobileView} maxWidth={isMobileView ? 'xl' : 'md'} open={serviceModal}>
        <DialogHeader title="Upload Service Report" onClose={() => showServiceModal(false)} response={startInfo} imagePath={false} />
        <ServiceReport accid={accid} putOnhold={() => { updateWo2(); showServiceModal(false); }} ppmConfig={settings} detailData={detailData} toggle={() => { updateWo1(); showServiceModal(false); }} companyId={companyData.id} />
      </Dialog>
    </>
  );
};

CheckLists.propTypes = {
  orderCheckLists: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
};
export default CheckLists;
