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
  useEffect, useState, useRef, Suspense,
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
import moment from 'moment';
import ReactFileReader from 'react-file-reader';
import SignaturePad from 'react-signature-canvas';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import {
  TextField,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
  Box, Button, Checkbox,
  Dialog, DialogActions, DialogContent, DialogContentText,
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
  getArrayNewFormatUpdate,
  getColumnArrayById,
  getDateTimeUtc,
  getLocalTimeSeconds,
  truncate,
  getArrayFromValuesByIdInLength,
  getArrayNewFormat,
  getDateDiffereceBetweenTwoDays,
  calculateTimeDifference,
  getArrayNewFormatUpdateDelete,
} from '../../util/appUtils';
import { bytesToSizeLow } from '../../util/staticFunctions';
import { getNewRequestArraySpare, getCustomStatusName } from '../../workPermit/utils/utils';
import PartsForm from '../wpBasicDetails/partsForm';
import DialogHeader from '../../commonComponents/dialogHeader';

import ImageUpload from './imageUpload';

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

const appModels = require('../../util/appModels').default;
const appConfig = require('../../config/appConfig').default;

const CheckLists = (props) => {
  const {
    orderCheckLists,
    atReject,
    atDone,
    statusInfo,
    detailData,
    fieldValue,
    spareParts,
    isInternal,
    userId,
    accid,
    token,
    wpConfigData,
  } = props;
  const [answerValues, setAnswerValues] = useState([]);
  const [answerIpValues, setIpAnswerValues] = useState([]);
  const [isSigned, setIsSigned] = useState(false);
  const [statusUpdateInfo, setStatusInfo] = useState({ loading: false, data: null, err: null });
  const [questionValues, setQuestions] = useState(orderCheckLists);
  const [sparesData, setSpareParts] = useState([]);

  const sigCanvas = useRef({});
  const classes = useStyles();

  const [imgId, setimgId] = useState(false);

  const [woUpdateInfo, setWoUpdateInfo] = useState({ loading: false, data: null, err: null });
  const [listDataInfo, setListDataInfo] = useState({ loading: false, data: null, err: null });
  const [timeSheetInfo, setTimeSheetInfo] = useState({ loading: false, data: null, err: null });

  const [startInfo, setStartInfo] = useState({ loading: false, data: null, err: null });

  const [isButtonHover, setButtonHover] = useState(false);

  const currentChecklist = false;
  const [isModal, setModalOpen] = useState(false);

  const [imgSize, setimgSize] = useState(false);
  const [imgFile, setImgFile] = useState(false);

  const [errorId, setErrorId] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');

  const [error1, setError1] = React.useState(false);
  const [error2, setError2] = React.useState(false);

  const [actualStartDate, setActualStartdate] = useState(dayjs(moment().format('YYYY-MM-DD HH:mm:ss')));
  const [actualEndDate, setActualEnddate] = useState(dayjs(moment().format('YYYY-MM-DD HH:mm:ss')));

  const [errorShow, setErrorShow] = useState(false);

  const [answerMultiValues, setMultiAnswerValues] = useState([]);

  const [equipmentImages, setEquipmentImages] = useState([]);
  const [signature, setSignature] = useState(false);
  const WEBAPPAPIURL = `${window.location.origin === 'http://localhost:3010' ? 'http://localhost:3000' : window.location.origin}/`;

  const onDateChange = (e) => {
    setError1(false);
    setActualStartdate(e);
  };

  const onDateChange1 = (e) => {
    setError2(false);
    setActualEnddate(e);
  };

  const APIURL = appConfig.API_URL;

  const onWoStart = () => {
    if (detailData && detailData.id) {
      setTimeSheetInfo({
        loading: true, data: null, count: 0, err: null,
      });
      const fields = '["id",("order_id", ["id",["mro_timesheet_ids", ["id", "start_date"]]])]';
      const payload = `domain=[["id","=",${detailData.id}]]&model=${appModels.WORKPERMIT}&fields=${fields}&offset=0&limit=1&portalDomain=${window.location.origin}`;

      const config = {
        method: 'get',
        url: `${WEBAPPAPIURL}public/api/v4/search?${payload}`,
        headers: {
          endpoint: APIURL,
          portalDomain: window.location.origin,
          accountId: accid,
        },
      };

      axios(config)
        .then((response) => setTimeSheetInfo({
          loading: false, data: response.data.data, count: response.data.length, err: null,
        }))
        .catch((error) => {
          setTimeSheetInfo({
            loading: false, data: null, count: 0, err: error,
          });
        });
    }
  };

  useEffect(() => {
    if (startInfo && startInfo.data) {
      onWoStart();
    }
  }, [startInfo]);

  useEffect(() => {
    if (fieldValue !== 'preparedness_checklist_lines') {
      onWoStart();
    }
  }, [fieldValue]);

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
          endpoint: APIURL,
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

  const onSignEmpty = () => {
    sigCanvas.current.clear();
    setEquipmentImages(equipmentImages.filter((item) => item.description !== 'Vendor Sign'));
    setSignature(false);
    setIsSigned(false);
  };

  const onSignSave = () => {
    const filebase = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
    if (filebase) {
      const companyId = detailData.company_id && detailData.company_id.id ? detailData.company_id.id : false;
      const remfile = 'data:image/png;base64,';
      const photoname = 'vendor_sign.png';
      const fname = `${getLocalTimeSeconds(new Date())}-${detailData.name}`.replace(/\s+/g, '');
      const filedata = filebase.replace(remfile, '');
      const values = {
        datas: filedata,
        datas_fname: photoname,
        name: fname,
        company_id: companyId,
        res_model: appModels.WORKPERMIT,
        res_id: detailData.id,
        description: 'Vendor Sign',
      };

      const arr = [...equipmentImages, ...[values]];
      const data = [...new Map(arr.map((item) => [item.name, item])).values()];

      setEquipmentImages(data);
      setIsSigned(true);
    }
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
    let maxlength = 300;
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
        answer = 'yes';
      } else if (checklist.answer_common === 'False') {
        answer = 'no';
      } else {
        answer = '';
      }
    } else {
      answer = checklist.answer_common;
    }
    return answer;
  };

  const statusUpdate = (statusValue) => {
    if (statusValue && detailData && detailData.uuid) {
      setStatusInfo({ loading: true, data: null, err: null });
      const postDataValues = {
        state: statusValue,
      };

      const data = {
        uuid: detailData.uuid,
        values: postDataValues,
      };

      const postData = new FormData();
      postData.append('values', JSON.stringify(data.values));
      if (typeof payload === 'object') {
        Object.keys(data).map((payloadObj) => {
          if (payloadObj !== 'uuid') {
            postData.append(payloadObj, data[payloadObj]);
          }
          return postData;
        });
      }
      postData.append('uuid', data.uuid);

      const config = {
        method: 'post',
        url: `${WEBAPPAPIURL}public/api/v4/wp/updateWPSStatus`,
        headers: {
          'Content-Type': 'multipart/form-data',
          portalDomain: window.location.origin,
          accountId: accid,
        },
        data: postData,
      };

      axios(config)
        .then((response) => setStatusInfo({ loading: false, data: response.data.data, err: null }))
        .catch((error) => {
          setStatusInfo({ loading: false, data: null, err: error });
        });
    }
  };

  const acceptStartWo = () => {
    if (detailData && detailData.requestor_id && detailData.requestor_id.id) {
      setStartInfo({ loading: true, data: null, err: null });

      let postDataValues = {
        mro_timesheet_ids: [[0, 0, { mro_order_id: detailData.order_id.id, start_date: getDateTimeUtc(wpConfigData.edit_actual_start_dt ? new Date(actualStartDate) : new Date()), reason: 'Start' }]],
        employee_id: detailData.requestor_id.id,
        review_status: false,
        reviewed_by: false,
        reviewed_remark: '',
        reviewed_on: false,
        checklist_json_data: false,
        // state: 'in_progress',
      };

      const timeSheetData = timeSheetInfo && timeSheetInfo.data && timeSheetInfo.data.length && timeSheetInfo.data[0].order_id && timeSheetInfo.data[0].order_id.mro_timesheet_ids && timeSheetInfo.data[0].order_id.mro_timesheet_ids.length ? timeSheetInfo.data[0].order_id.mro_timesheet_ids[timeSheetInfo.data[0].order_id.mro_timesheet_ids.length - 1] : false;

      if (timeSheetData && !timeSheetData.end_date) {
        postDataValues = {
          mro_timesheet_ids: [[1, timeSheetData.id, { start_date: getDateTimeUtc(wpConfigData.edit_actual_start_dt ? new Date(actualStartDate) : new Date()), reason: 'Start' }]],
          employee_id: detailData.requestor_id.id,
          review_status: false,
          reviewed_by: false,
          reviewed_remark: '',
          reviewed_on: false,
          checklist_json_data: false,
        };
      }

      const data = {
        id: detailData.order_id.id,
        values: postDataValues,
      };

      const postData = new FormData();
      postData.append('values', JSON.stringify(data.values));
      /* if (typeof payload === 'object') {
        Object.keys(data).map((payloadObj) => {
          if (payloadObj !== 'id') {
            postData.append(payloadObj, data[payloadObj]);
          }
          return postData;
        });
      } */

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
            setStartInfo({ loading: false, data: response.data.data, err: null });
            // statusUpdate('Work In Progress');
          } else if (response.data && response.data.error && response.data.error.message) {
            setStartInfo({ loading: false, data: null, err: response.data.error.message });
          }
        })
        .catch((error) => {
          setStartInfo({ loading: false, data: null, err: error });
        });
    }
  };

  const closeWo = () => {
    if (detailData && detailData.requestor_id && detailData.requestor_id.id) {
      setStartInfo({ loading: true, data: null, err: null });

      const startDate = detailData.order_id.date_start_execution;
      const endDate = detailData.order_id.date_execution;

      const timeSheetData = timeSheetInfo && timeSheetInfo.data && timeSheetInfo.data.length && timeSheetInfo.data[0].order_id && timeSheetInfo.data[0].order_id.mro_timesheet_ids && timeSheetInfo.data[0].order_id.mro_timesheet_ids.length ? timeSheetInfo.data[0].order_id.mro_timesheet_ids[timeSheetInfo.data[0].order_id.mro_timesheet_ids.length - 1] : false;

      let postDataValues = {
        // mro_timesheet_ids: [[0, 0, { mro_order_id: detailData.order_id.id, start_date: getDateTimeUtc(new Date()), reason: 'Start' }]],
        // employee_id: detailData.requestor_id.id,
        state: 'done',
        actual_duration: getDateDiffereceBetweenTwoDays(startDate, endDate),
        date_execution: getDateTimeUtc(new Date()),
      };

      if (timeSheetData) {
        postDataValues = {
          mro_timesheet_ids: [[1, timeSheetData.id, { end_date: getDateTimeUtc(wpConfigData.edit_actual_end_dt ? new Date(actualEndDate) : new Date()), reason: 'Done', total_hours: parseFloat(calculateTimeDifference(timeSheetData.start_date, wpConfigData.edit_actual_end_dt ? new Date(actualEndDate) : new Date(), true)) }]],
          // employee_id: detailData.requestor_id.id,
          state: 'done',
          actual_duration: getDateDiffereceBetweenTwoDays(startDate, endDate),
          date_execution: getDateTimeUtc(new Date()),
        };
      }

      const data = {
        id: detailData.order_id.id,
        values: postDataValues,
      };

      const postData = new FormData();
      postData.append('values', JSON.stringify(data.values));
      /* if (typeof payload === 'object') {
        Object.keys(data).map((payloadObj) => {
          if (payloadObj !== 'id') {
            postData.append(payloadObj, data[payloadObj]);
          }
          return postData;
        });
      } */

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
            setStartInfo({ loading: false, data: response.data.data, err: null });
          } else if (response.data && response.data.error && response.data.error.message) {
            setStartInfo({ loading: false, data: null, err: response.data.error.message });
          }
        })
        .catch((error) => {
          setStartInfo({ loading: false, data: null, err: error });
        });
    }
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
      setWoUpdateInfo({ loading: true, data: null, err: null });
      let newArrData1 = answerValues;
      if (isInternal && fieldValue !== 'issue_permit_checklist_lines') {
        newArrData1 = answerValues.map((cl) => ({
          ...cl,
          write_date: new Date(),
          user_id: userId && userId.id ? userId.id : false,
        }));
      }
      if (isInternal && fieldValue === 'issue_permit_checklist_lines') {
        newArrData1 = answerIpValues.map((cl) => ({
          question_id: cl.id,
          question_group: cl.question_group,
          name: cl.name,
          answer_type: cl.answer_type,
          answer_common: cl.answer_common,
          write_date: new Date(),
        }));
      }

      let postDataValues = {
        [fieldValue]: getArrayNewFormatUpdate(newArrData1),
        state: 'in_progress',
      };

      if (sparesData && sparesData.length) {
        postDataValues = {
          [fieldValue]: getArrayNewFormatUpdate(newArrData1),
          parts_lines: sparesData && sparesData.length > 0 ? getArrayNewFormatUpdateDelete(getNewRequestArraySpare(sparesData)) : false,
          state: 'in_progress',
        };
      }

      if (fieldValue === 'check_list_ids') {
        let newArrData = questionValues && questionValues.length ? questionValues.map((cl) => ({
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
        if (isInternal) {
          newArrData = questionValues && questionValues.length ? questionValues.map((cl) => ({
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
            user_id: userId,
          })) : [];
        }
        if (sparesData && sparesData.length) {
          postDataValues = {
            checklist_json_data: JSON.stringify(newArrData),
            parts_lines: sparesData && sparesData.length > 0 ? getArrayNewFormatUpdateDelete(getNewRequestArraySpare(sparesData)) : false,
            state: 'in_progress',
          };
        } else {
          postDataValues = {
            checklist_json_data: JSON.stringify(newArrData),
            state: 'in_progress',
          };
        }
      }

      if (isInternal && fieldValue === 'issue_permit_checklist_lines') {
        postDataValues = {
          [fieldValue]: getArrayNewFormat(newArrData1),
        };
      }

      let data = {
        id: detailData.order_id.id,
        values: postDataValues,
      };

      if (fieldValue === 'issue_permit_checklist_lines') {
        data = {
          id: detailData.id,
          values: postDataValues,
        };
      }

      const postData = new FormData();

      postData.append('values', JSON.stringify(data.values));
      /* if (typeof payload === 'object') {
        Object.keys(data).map((payloadObj) => {
          if (payloadObj !== 'id') {
            postData.append(payloadObj, data[payloadObj]);
          }
          return postData;
        });
      } */
      if (isInternal && fieldValue === 'issue_permit_checklist_lines') {
        postData.append('ids', `[${data.id}]`);
      } else {
        postData.append('id', data.id);
      }

      let config = {
        method: 'post',
        url: `${WEBAPPAPIURL}public/api/v4/wp/updateWPorder`,
        headers: {
          'Content-Type': 'multipart/form-data',
          portalDomain: window.location.origin,
          accountId: accid,
        },
        data: postData,
      };

      if (isInternal && fieldValue !== 'issue_permit_checklist_lines') {
        config = {
          method: 'post',
          url: `${WEBAPPAPIURL}public/api/v4/wp/updateWPorder`,
          headers: {
            'Content-Type': 'multipart/form-data',
            portalDomain: window.location.origin,
            accountId: accid,
            // endpoint: window.localStorage.getItem('api-url'),
            // Authorization: `Bearer ${token}`,
          },
          data: postData,
          // withCredentials: true,
        };
      }

      if (isInternal && fieldValue === 'issue_permit_checklist_lines') {
        config = {
          method: 'put',
          url: `${WEBAPPAPIURL}api/v4/write/mro.work_permit`,
          headers: {
            'Content-Type': 'multipart/form-data',
            endpoint: window.localStorage.getItem('api-url'),
            // Authorization: `Bearer ${token}`,
          },
          data: postData,
          withCredentials: true,
        };
      }

      axios(config)
        .then((response) => {
          if (response.data.data) {
            setWoUpdateInfo({ loading: false, data: response.data.data, err: null });
            if (fieldValue === 'check_list_ids') {
              // statusUpdate('Work In Progress');
              closeWo();
            }
            fileUpload(equipmentImages);
            if (fieldValue === 'issue_permit_checklist_lines') {
              setTimeout(() => {
                atDone();
              }, 1500);
            } else {
              atDone();
            }
          } else if (response.data && response.data.error && response.data.error.message) {
            setWoUpdateInfo({ loading: false, data: null, err: response.data.error.message });
          } else if (response.data.status) {
            setWoUpdateInfo({ loading: false, data: response.data.status, err: null });
            fileUpload(equipmentImages);
            if (fieldValue === 'issue_permit_checklist_lines') {
              setTimeout(() => {
                atDone();
              }, 1500);
            } else {
              atDone();
            }
          }
        })
        .catch((error) => {
          setWoUpdateInfo({ loading: false, data: null, err: error });
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
    const companyId = detailData.company_id && detailData.company_id.id ? detailData.company_id.id : false;
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
          res_model: appModels.WORKPERMIT,
          res_id: detailData.id,
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
    const mcQtns = questionValues.filter((item) => (item.type === 'multiple_choice' && item.id === checklist.id && item.answer_common && item.answer_common.toString().includes(lids.value)));
    if (isData && isData.length) {
      res1 = true;
    } else if (mcQtns && mcQtns.length) {
      res1 = true;
    }

    return res1;
  }

  const errorMessage2 = React.useMemo(() => {
    switch (error2) {
      case 'minDate': {
        return 'Please select a date time greater than the actual in time. ';
      }
      case 'minTime': {
        return 'Please select a date time greater than the actual in time.';
      }

      case 'invalidDate': {
        return 'Invalid Date';
      }

      default: {
        return '';
      }
    }
  }, [error2]);

  const errorMessage1 = React.useMemo(() => {
    switch (error1) {
      case 'maxDate': {
        return 'Please select a date time greater than the planned in time and less than the planned out time.';
      }
      case 'minDate': {
        return 'Please select a date time greater than the planned in time and less than the planned out time.';
      }
      case 'minTime': {
        return 'Please select a date time greater than the planned in time and less than the planned out time.';
      }
      case 'maxTime': {
        return 'Please select a date time greater than the planned in time and less than the planned out time.';
      }
      case 'invalidDate': {
        return 'Invalid Date';
      }

      default: {
        return '';
      }
    }
  }, [error1]);

  const isNotValidClosedDate = (actualStartDate && ((new Date(actualStartDate) < new Date(moment.utc(detailData.planned_start_time).local().format('YYYY-MM-DD HH:mm:ss'))) || (new Date(actualStartDate) >= new Date(moment.utc(detailData.planned_end_time).local().format('YYYY-MM-DD HH:mm:ss')))));
  const isNotValidClosedDate1 = (actualEndDate && (new Date(actualEndDate) < new Date(actualStartDate)));

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

  const disabledButton = !isReqAttachAdded || errorId || mandAnsLen || notAllAns || (statusInfo && statusInfo.loading) || (woUpdateInfo && woUpdateInfo.loading);
  const dataLoading = (statusInfo && statusInfo.loading) || (woUpdateInfo && woUpdateInfo.loading);
  const showButton = !(orderCheckLists && orderCheckLists.length);
  const isSuccess = woUpdateInfo && woUpdateInfo.data;

  return (
    <>
      <Dialog maxWidth="lg" open>
        <DialogHeader title={fieldValue === 'check_list_ids' ? 'Work Checklist' : fieldValue === 'preparedness_checklist_lines' ? 'Readiness Checklist' : 'Issue Permit Checklists'} onClose={() => atReject()} response={woUpdateInfo} imagePath={checkCircleBlack} />
        {!isSuccess && !dataLoading && ((startInfo && startInfo.data) || fieldValue === 'preparedness_checklist_lines' || fieldValue === 'issue_permit_checklist_lines') && (
          <>
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
                  <>
                    <Row>
                      <Col md="12" sm="12" lg="12" xs="12">
                        <div className="">
                          {questionValues && questionValues.length > 0 && questionValues.map((item, index) => (
                            <div key={item.id}>
                              <Row className="font-weight-600">
                                <Col md="1" sm="3" xs="3" lg="1">
                                  <img
                                    alt="questionIcon"
                                    width="18"
                                    height="18"
                                    className="mr-2 mb-2 mt-2"
                                    src={questionIcon}
                                  />
                                </Col>
                                <Col md="9" sm="6" xs="6" lg="9">
                                  {item.mro_activity_id && item.mro_activity_id.name ? item.mro_activity_id.name : ''}
                                </Col>
                                <Col md="2" sm="3" xs="3" lg="2" className="text-right">
                                  {(item.mro_activity_id.type === 'suggestion' && item.value_suggested && item.answer_common !== false) && (
                                    <img alt="assigned" width="17" height="17" className="mr-1" src={fullyAssignIcon} />
                                  )}
                                  {(item.answer_common && item.mro_activity_id.type !== 'suggestion') && (
                                    <img alt="assigned" width="17" height="17" className="mr-1" src={fullyAssignIcon} />
                                  )}
                                </Col>
                              </Row>
                              <Row className="font-weight-400">
                                <Col md="1" sm="3" xs="3" lg="1">
                                  <img
                                    alt="answerIcon"
                                    width="18"
                                    height="18"
                                    className="mr-2 mb-2 mt-2"
                                    src={answerIcon}
                                  />
                                </Col>
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
                                      maxLength={!item.mro_activity_id.is_multiple_line || item.mro_activity_id.type === 'numerical_box' ? getmaxLength(item.mro_activity_id.type, item.mro_activity_id) : 500}
                                      required={item.mro_activity_id && item.mro_activity_id.constr_mandatory}
                                      onKeyPress={item.mro_activity_id.type === 'numerical_box' || item.mro_activity_id.type === 'number' ? integerKeyPress : ''}
                                      defaultValue={getAnswer(item) ? getAnswer(item) : ''}
                                      // value={getAnswer(item)}
                                      onChange={(e) => (handleInputChange(e, item))}
                                      onBlur={(e) => handleInputBlur(e, item)}
                                    // checked={getAnswer(item)}
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

                    <div className="text-center mt-3 mb-3">
                      {fieldValue === 'check_list_ids' && (
                        <>
                          <p>Signature</p>
                          <div className="border-color-sea-buckthorn-2px">
                            <SignaturePad
                              ref={sigCanvas}
                              // canvasProps={{
                              //   className: 'signatureCanvas',
                              // }}
                              canvasProps={{ width: 800, height: 200, className: 'sigCanvas' }}
                              onEnd={(e) => { setSignature(Math.random()); }}
                            />
                          </div>
                          <div className="mt-2">
                            <Button
                              type="button"
                              size="sm"
                              variant="contained"
                              disabled={!signature}
                              onClick={() => onSignEmpty()}
                              className="mr-1"
                            >
                              <span>Clear</span>
                            </Button>
                            {!isSigned && (
                              <Button
                                type="button"
                                size="sm"
                                variant="contained"
                                disabled={!signature}
                                onClick={() => onSignSave()}
                              >
                                <span>Finish</span>
                              </Button>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                    {fieldValue === 'check_list_ids' && !isSigned && (
                      <div className="text-danger font-tiny text-center">
                        Vendor &apos;s Signature is required to submit the work order
                      </div>
                    )}
                    {fieldValue === 'check_list_ids' && (
                    <>
                      <PartsForm spareParts={spareParts} setSpareParts={setSpareParts} editId />
                      {wpConfigData.edit_actual_end_dt && (
                        <Row className="m-2">
                          <Col xs={6} sm={6} md={6} lg={3} />
                          <Col xs={6} sm={6} md={6} lg={6} className="text-center">
                            <p>
                              Actual Start Time:
                              {'  '}
                              {moment(new Date(actualStartDate)).format('MM/DD/YYYY hh:mm A')}
                            </p>
                          </Col>
                          <Col xs={6} sm={6} md={6} lg={3} />
                          <Col xs={6} sm={6} md={6} lg={3} />
                          <Col xs={6} sm={6} md={6} lg={6} className="text-center">
                            <FormControl
                              sx={{
                                marginTop: 'auto',
                                marginBottom: '20px',
                              }}
                              variant="standard"
                            >
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['DateTimePicker']}>
                                  <DateTimePicker
                                    minDateTime={actualStartDate ? dayjs(moment(new Date(actualStartDate)).format('YYYY-MM-DD HH:mm:ss')) : dayjs(moment(new Date()).format('YYYY-MM-DD HH:mm:ss'))}
                                    sx={{ width: '95%' }}
                                    localeText={{ todayButtonLabel: 'Now' }}
                                    onError={(newError) => setError2(newError)}
                                    timeSteps={{ hours: 1, minutes: 1 }}
                                    slotProps={{
                                      actionBar: {
                                        actions: ['accept'],
                                      },
                                      textField: {
                                        variant: 'standard',
                                        helperText: errorMessage2,
                                      },
                                    }}
                                    name="closed_on"
                                    label="Actual End Date time *"
                                    value={actualEndDate}
                                    onChange={onDateChange1}
                                    ampm={false}
                                  />
                                </DemoContainer>
                              </LocalizationProvider>
                              { /* <span className="ml-1 text-danger">{!errorMessage2 && isNotValidClosedDate1 ? 'Please select a datetime earlier than the planned out datetime and later than the planned in datetime and actual start datetime.' : ''}</span> */ }
                            </FormControl>
                          </Col>
                          <Col xs={6} sm={6} md={6} lg={3} />
                        </Row>
                      )}
                    </>
                    )}
                    {(!disabledButton || showButton) && (
                      <div className="text-center mt-3 mb-3">
                        <h5 className="mb-3">
                          Are you sure to submit the
                          {' '}
                          {fieldValue === 'check_list_ids' ? 'Work Checklist' : fieldValue === 'preparedness_checklist_lines' ? 'Readiness Checklist' : 'Issue Permit Checklists'}
                          {' '}
                          ?
                          {isInternal && (
                            <>
                              {' '}
                              (On-behalf of Vendor)
                            </>
                          )}
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

                        <div className="text-grey font-tiny mt-3">
                          {fieldValue === 'check_list_ids'
                            ? 'NB: After perform checklists, the reviewer will receive an email with link to review the workorder.'
                            : `NB: After ${getCustomStatusName('Prepared', wpConfigData)}, the authorizer will receive an email with link to ${getCustomStatusName('Approved', wpConfigData)} work permit and ${getCustomStatusName('Issued Permit', wpConfigData)}.`}
                        </div>
                      </div>
                    )}
                  </>
                </Box>
              </DialogContentText>
            </DialogContent>
            <DialogActions className="mr-3 ml-3">
              {!isReqAttachAdded && (
              <span className="text-danger">Please upload files for all mandatory checklists.</span>
              )}
              <Button
                type="button"
                size="md"
                variant="contained"
                disabled={(!showButton && disabledButton) || (fieldValue === 'check_list_ids' && !isSigned) || (fieldValue === 'check_list_ids' && wpConfigData.edit_actual_end_dt && isNotValidClosedDate1)}
                onClick={() => { updateWo(); setErrorId(false); setValidationMessage(''); }}
              >
                <img src={checkWhite} className="mr-2" alt="Prepare" width="13" height="13" />
                <span>Submit</span>
              </Button>
            </DialogActions>
          </>
        )}
        {!isSuccess && !dataLoading && ((startInfo && !startInfo.data) && fieldValue !== 'preparedness_checklist_lines' && fieldValue !== 'issue_permit_checklist_lines') && (
          <>
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
                  <div className="text-center mt-3 mb-3">
                    <h5 className="mb-3">
                      Are you sure to start the workorder ?
                    </h5>
                    {wpConfigData.edit_actual_start_dt && (
                      <Row className="m-2">
                        <Col xs={12} sm={12} md={12} lg={12}>
                          <p>
                            Planned In:
                            {'  '}
                            {moment.utc(detailData.planned_start_time).local().format('MM/DD/YYYY hh:mm A')}
                          </p>
                          <p>
                            Planned Out:
                            {'  '}
                            {moment.utc(detailData.planned_end_time).local().format('MM/DD/YYYY hh:mm A')}
                          </p>
                        </Col>
                        <Col xs={6} sm={6} md={6} lg={3} />
                        <Col xs={6} sm={6} md={6} lg={6}>
                          <FormControl
                            sx={{
                              marginTop: 'auto',
                              marginBottom: '20px',
                            }}
                            variant="standard"
                          >
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DemoContainer components={['DateTimePicker']}>
                                <DateTimePicker
                                  minDateTime={detailData.planned_start_time ? dayjs(moment.utc(detailData.planned_start_time).local().format('YYYY-MM-DD HH:mm:ss')) : dayjs(moment(new Date()).format('YYYY-MM-DD HH:mm:ss'))}
                                  maxDateTime={detailData.planned_end_time ? dayjs(moment.utc(detailData.planned_end_time).local().format('YYYY-MM-DD HH:mm:ss')) : dayjs(moment(new Date()).format('YYYY-MM-DD HH:mm:ss'))}
                                  sx={{ width: '95%' }}
                                  localeText={{ todayButtonLabel: 'Now' }}
                                  onError={(newError) => setError1(newError)}
                                  timeSteps={{ hours: 1, minutes: 1 }}
                                  slotProps={{
                                    actionBar: {
                                      actions: ['accept'],
                                    },
                                    textField: {
                                      variant: 'standard',
                                      helperText: errorMessage1,
                                    },
                                  }}
                                  name="closed_on"
                                  label="Actual Start Date time *"
                                  value={actualStartDate}
                                  onChange={onDateChange}
                                  ampm={false}
                                />
                              </DemoContainer>
                            </LocalizationProvider>
                            <span className="ml-1 text-danger">{!errorMessage1 && isNotValidClosedDate ? 'Please select a date time greater than the planned in time and less than the planned out time.' : ''}</span>
                          </FormControl>
                        </Col>
                        <Col xs={6} sm={6} md={6} lg={3} />
                      </Row>
                    )}
                    {(startInfo && startInfo.loading) && (
                      <div className="text-center mt-4 mb-4">
                        <Loader />
                      </div>
                    )}
                    {(startInfo && startInfo.err) && (
                      <div className="text-center mt-3 mb-3">
                        <SuccessAndErrorFormat response={startInfo} />
                      </div>
                    )}
                  </div>
                </Box>
              </DialogContentText>
            </DialogContent>
            <DialogActions className="mr-3 ml-3">
              <Button
                type="button"
                size="md"
                onClick={() => acceptStartWo()}
                disabled={(wpConfigData.edit_actual_start_dt && isNotValidClosedDate) || (startInfo && startInfo.loading)}
                variant="contained"
              >
                <img src={checkWhite} className="mr-2" alt="Prepare" width="13" height="13" />
                <span>Start</span>
              </Button>
            </DialogActions>
          </>
        )}
        {dataLoading && (
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
                {' '}
                <Loader />
                {' '}

              </Box>
              {' '}

            </DialogContentText>
          </DialogContent>
        )}
        {isSuccess && (
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
                {' '}
                <SuccessAndErrorFormat response={woUpdateInfo} successMessage="Checklist performed successfully.." />
                {' '}

              </Box>
              {' '}

            </DialogContentText>
          </DialogContent>
        )}
      </Dialog>
      <Dialog maxWidth="md" open={isModal}>
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
                resModel={appModels.WORKPERMIT}
                model={appModels.DOCUMENT}
                companyId={detailData.company_id && detailData.company_id.id ? detailData.company_id.id : false}
              />
            </Box>
          </DialogContentText>
        </DialogContent>
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
  statusInfo: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  fieldValue: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  spareParts: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  atReject: PropTypes.func.isRequired,
  atDone: PropTypes.func.isRequired,
};
export default CheckLists;
