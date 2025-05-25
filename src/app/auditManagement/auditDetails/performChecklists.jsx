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
  Card, CardHeader,
  Col,
  Collapse,
  Row,
  Input,
  Toast,
  ToastBody,
  ToastHeader,
  Label,
  Table,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { Autocomplete } from '@material-ui/lab';
import Alert from '@mui/material/Alert';
import { Image, Tooltip } from 'antd';
import ReactFileReader from 'react-file-reader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleDown,
  faAngleUp,
  faCheckCircle,
  faHourglass,
  faPaperclip,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import {
  TextField,
} from '@material-ui/core';
import { library } from '@fortawesome/fontawesome-svg-core';
import * as Icons from '@fortawesome/free-solid-svg-icons';
import * as Icons1 from '@fortawesome/free-regular-svg-icons';
import { Emoji } from 'emoji-mart';
import { makeStyles } from '@material-ui/core/styles';
import {
  Box, Button, Checkbox,
  Dialog, DialogContent, DialogContentText, DialogActions,
} from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';

import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';

import fullyAssignIcon from '@images/icons/fullyAssign.png';
import checkWhite from '@images/icons/checkWhite.svg';
import fileMiniIcon from '@images/icons/fileMini.svg';

import DialogHeader from '../../commonComponents/dialogHeader';
import { returnThemeColor } from '../../themes/theme';
import AuditActions from './auditActions';

import { onDocumentCreates } from '../../helpdesk/ticketService';
import { updateHxAudit, getHxAuditActions, resetUpdateHxAudit, resetCreateHxAction } from '../auditService';

import {
  integerKeyPress,
  lettersOnly,
  getJsonString,
  getColumnArrayById,
  getDateTimeUtc,
  getLocalTimeSeconds,
  truncate,
  getArrayFromValuesByIdInLength,
  detectMob,
  getDateDiffereceBetweenTwoDays,
  isJsonString,
} from '../../util/appUtils';
import { bytesToSizeLow, groupByMultiple } from '../../util/staticFunctions';
import CreateNonConformity from './createNonConformity';

const iconList = Object.keys(Icons)
  .filter((key) => key !== 'fas' && key !== 'prefix')
  .map((icon) => Icons[icon]);

const iconList1 = Object.keys(Icons1)
  .filter((key) => key !== 'far' && key !== 'prefix')
  .map((icon) => Icons1[icon]);

library.add(...iconList);
library.add(...iconList1);

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

const CheckLists = (props) => {
  const {
    orderCheckLists,
    detailData,
    setLogs,
  } = props;
  const [answerValues, setAnswerValues] = useState([]);
  const [answerIpValues, setIpAnswerValues] = useState([]);
  const [questionValues, setQuestions] = useState(orderCheckLists);

  const isMobileView = detectMob();

  const [imgId, setimgId] = useState(false);
  const [catOpen, setCatOpen] = useState(false);

  const [isViewRemarks, setViewRemarks] = useState(false);
  const [isRequireRemarks, setIsRequireRemarks] = useState(false);
  const [qtnId, setQtnId] = useState(false);
  const [actionQtnId, setActionQtnId] = useState(false);
  const [currentRemarks, setCurrentRemarks] = useState(false);
  const [qtnName, setQtnName] = useState(false);
  const [acType, setAcType] = useState(false);
  const [ncModal, showNcModal] = useState(false);
  const [qtnDataId, setQtnDataId] = useState(false);

  const [accordion, setAccordian] = useState([]);
  const [icon, setIcon] = useState(faAngleDown);

  const [auditActionModal, showAuditActionModal] = useState(false);

  const dispatch = useDispatch();

  const [categoryId, setCategoryId] = useState([]);

  const [listDataInfo, setListDataInfo] = useState({ loading: false, data: null, err: null });

  const sortCategories = (dataSections) => {
    dataSections = dataSections.sort((a, b) => a[0].mro_activity_id.sequence - b[0].mro_activity_id.sequence);
    return dataSections;
  };

  const [imgSize, setimgSize] = useState(false);
  const [imgFile, setImgFile] = useState(false);

  const [isProcedure, setProcedure] = useState(false);
  const [viewMoreId, setViewMoreId] = useState(false);

  const [errorId, setErrorId] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');

  const [errorShow, setErrorShow] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState(false);

  const [answerMultiValues, setMultiAnswerValues] = useState([]);

  const [equipmentImages, setEquipmentImages] = useState([]);

  const { hxAuditUpdate, hxActionCreate, hxAuditActions } = useSelector((state) => state.hxAudits);

  const actionsData = useMemo(() => (hxAuditActions && hxAuditActions.data ? hxAuditActions.data : []), [hxAuditActions]);

  const WEBAPPAPIURL = `${window.location.origin === 'http://localhost:3010' ? 'http://localhost:3000' : window.location.origin}/`;

  useEffect(() => {
    dispatch(resetUpdateHxAudit());
    dispatch(resetCreateHxAction());
  }, []);

  useEffect(() => {
    if (detailData?.id) {
      dispatch(getHxAuditActions(appModels.HXAUDITACTION, detailData.id, false));
    }
  }, [detailData?.id]);

  useEffect(() => {
    if (detailData?.id && hxActionCreate && hxActionCreate.data) {
      dispatch(getHxAuditActions(appModels.HXAUDITACTION, detailData.id, false));
    }
  }, [hxActionCreate]);

  const onResume = () => {
    dispatch(resetUpdateHxAudit());
    dispatch(resetCreateHxAction());
  };

  function checkAction(questionId) {
    if (!hxAuditActions) return null;
    return questionId && actionsData && actionsData.length > 0
      ? actionsData.some((item) => item.question_id?.id === questionId)
      : false;
  }

  const onViewOpen = (qtnNam, qtnIds, remarks, require) => {
    setViewRemarks(true);
    setQtnName(qtnNam);
    setQtnId(qtnIds);
    setCurrentRemarks(remarks);
    setIsRequireRemarks(!!require);
  };

  const onNcOpen = (id, dataId, name, type, remarks, value) => {
    setQtnName(name);
    setQtnId(id);
    setQtnDataId(dataId);
    setAcType(type);
    setCurrentRemarks(remarks);
    setCurrentAnswer(value);
    dispatch(resetCreateHxAction());
    showNcModal(true);
  };

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

  const totalTargets = useMemo(() => {
    const targets = {};
    questionValues.forEach((row) => {
      const pageId = row.page_id.id;
      targets[pageId] = (targets[pageId] || 0) + (!row.is_na ? (row.mro_activity_id?.applicable_score || 0.00) : 0.00);
    });
    return targets;
  }, [questionValues, answerValues, answerMultiValues]);

  const totalAchieveds = useMemo(() => {
    const achieved = {};
    questionValues.forEach((row) => {
      const pageId = row.page_id.id;
      achieved[pageId] = (achieved[pageId] || 0) + (row.achieved_score || 0.00);
    });
    console.log(achieved);
    return achieved;
  }, [questionValues, answerValues, answerMultiValues]);

  const categories = useMemo(() => (orderCheckLists && orderCheckLists.length > 0 ? groupByMultiple(orderCheckLists, (obj) => (obj.page_id && obj.page_id.id ? obj.page_id.id : '')) : []), [orderCheckLists]);

  useEffect(() => {
    if (categories && categories.length && categories[0].length) {
      setCategoryId(categories[0][0] && categories[0][0].mro_quest_grp_id ? categories[0][0].page_id.id : false);
    }
  }, [categories]);

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
    if (lids.is_remark_required && !lids.is_ncr) {
      onViewOpen(checklist.mro_activity_id.name, checklist.id, checklist.remarks, true);
    }
    if (lids.quizz_mark && checklist.mro_activity_id.applicable_score) {
      questionValues[detailIndex].achieved_score = lids.quizz_mark;
    } else {
      questionValues[detailIndex].achieved_score = 0;
    }
    if (lids.is_not_acceptable) {
      questionValues[detailIndex].is_na = true;
      questionValues[detailIndex].achieved_score = 0;
    } else {
      questionValues[detailIndex].is_na = false;
    }
    questionValues[detailIndex].answer_common = lids.value;
    if (lids.is_ncr) {
      onNcOpen(checklist.id, checklist.mro_activity_id.id, checklist.mro_activity_id.name, 'Non-conformity', checklist.remarks, lids.value);
    }
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
      if (lids.is_remark_required && !lids.is_ncr) {
        onViewOpen(checklist.mro_activity_id.name, checklist.id, checklist.remarks, true);
      }
      if (lids.quizz_mark && checklist.mro_activity_id.applicable_score) {
        questionValues[detailIndex].achieved_score = lids.quizz_mark;
      } else {
        questionValues[detailIndex].achieved_score = 0;
      }
      if (lids.is_not_acceptable) {
        questionValues[detailIndex].is_na = true;
        questionValues[detailIndex].achieved_score = 0;
      } else {
        questionValues[detailIndex].is_na = false;
      }
      questionValues[detailIndex].answer_common = lids.value;
      setQuestions(questionValues);
      if (lids.is_ncr) {
        onNcOpen(checklist.id, checklist.mro_activity_id.id, checklist.mro_activity_id.name, 'Non-conformity', checklist.remarks, lids.value);
      }
    } else {
      const detailIndex = questionValues.findIndex((obj) => (obj.id === checklist.id));
      const detailIndex2 = answerValues.findIndex((obj) => (obj.id === checklist.id));
      const detailIndex3 = answerIpValues.findIndex((obj) => (obj.id === checklist.id));
      questionValues[detailIndex].is_na = false;
      questionValues[detailIndex].achieved_score = 0;
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
      if (lids.is_remark_required && !lids.is_ncr) {
        onViewOpen(checklist.mro_activity_id.name, checklist.id, checklist.remarks, true);
      }
      questionValues[detailIndex].achieved_score = checklist.mro_activity_id.applicable_score ? parseInt(questionValues[detailIndex].achieved_score) + parseInt(lids.quizz_mark) : 0;
      questionValues[detailIndex].answer_common = getColumnArrayById([...new Map(arr.map((item) => [item.answer_id, item])).values()], 'answer').toString();
      setQuestions(questionValues);
      if (lids.is_ncr) {
        onNcOpen(checklist.id, checklist.mro_activity_id.id, checklist.mro_activity_id.name, 'Non-conformity', checklist.remarks, getColumnArrayById([...new Map(arr.map((item) => [item.answer_id, item])).values()], 'answer').toString());
      }
    } else {
      setMultiAnswerValues(answerMultiValues.filter((item) => (item.answer_id !== lids.id)));
      // setAnswerValues(answerValues.filter((item) => (item.answer_id !== lids.id)));

      const detailIndex = questionValues.findIndex((obj) => (obj.id === checklist.id));
      if (lids.is_remark_required && !lids.is_ncr) {
        onViewOpen(checklist.mro_activity_id.name, checklist.id, checklist.remarks, true);
      }
      if (checklist.mro_activity_id.applicable_score && parseInt(lids.quizz_mark) > 0 && parseInt(lids.quizz_mark) <= parseInt(questionValues[detailIndex].achieved_score)) {
        questionValues[detailIndex].achieved_score = parseInt(questionValues[detailIndex].achieved_score) - parseInt(lids.quizz_mark);
      }
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
      if (lids.is_remark_required && !lids.is_ncr) {
        onViewOpen(checklist.mro_activity_id.name, checklist.id, checklist.remarks, true);
      }
      questionValues[detailIndex].achieved_score = checklist.mro_activity_id.applicable_score ? parseInt(questionValues[detailIndex].achieved_score) + parseInt(lids.quizz_mark) : 0;
      questionValues[detailIndex].answer_common = getColumnArrayById([...new Map(arr.map((item) => [item.answer_id, item])).values()], 'answer').toString();
      setQuestions(questionValues);
      if (lids.is_ncr) {
        onNcOpen(checklist.id, checklist.mro_activity_id.id, checklist.mro_activity_id.name, 'Non-conformity', checklist.remarks, getColumnArrayById([...new Map(arr.map((item) => [item.answer_id, item])).values()], 'answer').toString());
      }
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
      if (lids.is_remark_required && !lids.is_ncr) {
        onViewOpen(checklist.mro_activity_id.name, checklist.id, checklist.remarks, true);
      }

      if (checklist.mro_activity_id.applicable_score && parseInt(lids.quizz_mark) > 0 && parseInt(lids.quizz_mark) <= parseInt(questionValues[detailIndex].achieved_score)) {
        questionValues[detailIndex].achieved_score = parseInt(questionValues[detailIndex].achieved_score) - parseInt(lids.quizz_mark);
      }
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

  const onRemarksClose = () => {
    setQtnName(false);
    setQtnId(false);
    setCurrentRemarks(false);
    setViewRemarks(false);
    setIsRequireRemarks(false);
  };

  const onNcClose = () => {
    if (qtnId && acType === 'Non-conformity') {
      const detailIndex = questionValues.findIndex((obj) => (obj.id === qtnId));
      const detailIndex2 = answerValues.findIndex((obj) => (obj.id === qtnId));
      const detailIndex3 = answerIpValues.findIndex((obj) => (obj.id === qtnId));
      questionValues[detailIndex].is_na = false;
      questionValues[detailIndex].achieved_score = 0;
      questionValues[detailIndex].answer_common = '';
      questionValues[detailIndex].remarks = '.';
      answerValues[detailIndex2].answer_common = '';
      answerIpValues[detailIndex3].answer_common = '';
      setQuestions(questionValues);
      setAnswerValues(answerValues);
      setIpAnswerValues(answerIpValues);
    }
    setQtnName(false);
    setQtnId(false);
    showNcModal(false);
    setQtnDataId(false);
    setCurrentRemarks('');
    setCurrentAnswer('');
    setAcType('');
    dispatch(resetCreateHxAction());
  };

  const onNcClose1 = () => {
    setQtnName(false);
    setQtnId(false);
    showNcModal(false);
    setQtnDataId(false);
    setCurrentRemarks('');
    setCurrentAnswer('');
    setAcType('');
    dispatch(resetCreateHxAction());
  };

  const onMessageChange = (e) => {
    setCurrentRemarks(e.target.value);

    const detailIndex = questionValues.findIndex((obj) => (obj.id === qtnId));
    questionValues[detailIndex].remarks = e.target.value;
    setQuestions(questionValues);
  };

  const onRemarksSaveClose = (rem) => {
    const detailIndex = questionValues.findIndex((obj) => (obj.id === qtnId));
    questionValues[detailIndex].remarks = rem;
    setQuestions(questionValues);
    setQtnName(false);
    setQtnId(false);
    setCurrentRemarks(false);
    setViewRemarks(false);
    setIsRequireRemarks(false);
  };

  const onRemarksSaveCloseV1 = (rem) => {
    const detailIndex = questionValues.findIndex((obj) => (obj.id === qtnId));
    questionValues[detailIndex].remarks = rem;
    setQuestions(questionValues);
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

  const onViewActions = (qtn, id) => {
    showAuditActionModal(true);
    setQtnName(qtn);
    setActionQtnId(id);
  };

  const onCloseActions = () => {
    showAuditActionModal(false);
    setQtnName(false);
    setActionQtnId(false);
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
      const newArrData = fileContent.map((cl) => ({
        datas: cl.datas,
        datas_fname: cl.datas_fname,
        name: cl.name,
        company_id: cl.company_id,
        res_model: cl.res_model,
        res_id: cl.res_id,
        description: cl.description,
      }));

      dispatch(onDocumentCreates(newArrData));
    }
  };

  useEffect(() => {
    if (hxAuditUpdate && hxAuditUpdate.data) {
      fileUpload(equipmentImages);
    }
  }, [hxAuditUpdate]);

  useEffect(() => {
    if (questionValues) {
      const newArrData = questionValues.filter((item) => item.answer_common);
      const allLen = questionValues && questionValues.length;
      setLogs({ total: allLen, answer: newArrData.length });
    }
  }, [questionValues, answerValues, answerMultiValues]);

  const getPercentage = (totalAchieved, totalTarget) => {
    if (totalTarget === 0) return 0; // Avoid division by zero
    return (parseFloat((totalAchieved / totalTarget) * 100)); // Round to 2 decimal places
  };

  const updateWo = () => {
    if (detailData && detailData.id) {
      const newArrData = questionValues.filter((item) => item.answer_common || item.remarks === '.');

      const newArray = [];
      let newData = [];
      for (let i = 0; i < newArrData.length; i += 1) {
        const obj = { ...newArrData[i] };
        newData = [newArrData[i].id ? 1 : 0, newArrData[i].id ? newArrData[i].id : 0, {
          answer: obj.answer_common, remarks: obj.remarks === '.' ? '' : obj.remarks, achieved_score: obj.achieved_score ? obj.achieved_score : 0, is_na: obj.is_na ? obj.is_na : false,
        }];

        newArray.push(newData);
      }

      let postDataValues = {
        checklists_lines: newArray,
        state: 'Completed',
      };

      const allLen = questionValues && questionValues.length;

      if (newArrData.length !== allLen) {
        postDataValues = {
          checklists_lines: newArray,
          state: 'Inprogress',
        };
      }

      const summaryData = detailData.summary_pages;
      if (summaryData && summaryData.length) {
        const newArray1 = [];
        let newData1 = [];
        for (let i = 0; i < summaryData.length; i += 1) {
          const obj = { ...summaryData[i] };
          const id = obj.name && obj.name.id ? obj.name.id : '';

          const maxScore = totalTargets[id];
          const achievedScore = totalAchieveds[id];
          const percentage = getPercentage(achievedScore, maxScore);

          newData1 = [
            summaryData[i].id ? 1 : 0,
            summaryData[i].id ? summaryData[i].id : 0,
            { max_score: maxScore, achieved_score: achievedScore, percentage },
          ];

          newArray1.push(newData1);
        }

        postDataValues.summary_pages = newArray1;
        const totalAS = questionValues.reduce((accumulator, currentValue) => accumulator + (currentValue.achieved_score || 0.00), 0.00);
        const totalTS = questionValues.reduce((accumulator, currentValue) => accumulator + (!currentValue.is_na ? (currentValue.mro_activity_id?.applicable_score || 0.00) : 0.00), 0.00);
        const overallPercentage = totalAS > 0 ? (totalAS / totalTS) * 100 : 0;
        postDataValues.overall_score = parseFloat(overallPercentage);
      }

      dispatch(updateHxAudit(detailData.id, appModels.HXAUDIT, postDataValues));
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
          res_model: 'hx.audit',
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
    const mcQtns = questionValues.filter((item) => (item.answer_type === 'multiple_choice' && item.id === checklist.id && item.answer_common && item.answer_common.toString().includes(lids.value)));
    if (isData && isData.length) {
      res1 = true;
    } else if (mcQtns && mcQtns.length) {
      res1 = true;
    }

    return res1;
  }

  function getCatQtnsCount(assetData, groupId, type) {
    let gId = false;
    let res = 0;
    if (groupId) {
      gId = groupId;
    }
    const assetDataList = assetData.filter((item) => item.page_id.id === groupId);

    if (type === 'total') {
      res = assetDataList && assetDataList.length ? assetDataList.length : 0;
    } else if (type === 'answer' && assetDataList && assetDataList.length) {
      const assetDataAnsList = assetDataList.filter((item) => item.answer_common);
      res = assetDataAnsList && assetDataAnsList.length ? assetDataAnsList.length : 0;
    }
    return res;
  }

  function getCatName(catId) {
    let res = '';
    const assetDataList = categories.filter((item) => item[0].page_id.id === catId);
    if (assetDataList && assetDataList.length) {
      res = assetDataList[0][0].page_id.tite;
    }
    return res;
  }

  function getQtnsCount(assetData, groupId, type) {
    let gId = false;
    let res = 0;
    if (groupId) {
      gId = groupId;
    }
    let assetDataList = assetData.filter((item) => item.page_id.id === categoryId && item.mro_quest_grp_id.id === groupId);

    if (!groupId) {
      assetDataList = assetData.filter((item) => item.page_id.id === categoryId && !(item.mro_quest_grp_id && item.mro_quest_grp_id.id));
    }

    if (type === 'total') {
      res = assetDataList && assetDataList.length ? assetDataList.length : 0;
    } else if (type === 'answer' && assetDataList && assetDataList.length) {
      const assetDataAnsList = assetDataList.filter((item) => item.answer_common);
      res = assetDataAnsList && assetDataAnsList.length ? assetDataAnsList.length : 0;
    }
    return res;
  }

  function getQtnsList(assetData, groupId) {
    let assetDataList = assetData.filter((item) => item.page_id.id === categoryId && item.mro_quest_grp_id.id === groupId);
    if (!groupId) {
      assetDataList = assetData.filter((item) => item.page_id.id === categoryId && !(item.mro_quest_grp_id && item.mro_quest_grp_id.id));
    }
    return assetDataList;
  }

  const getinitial = (sections) => {
    if ((sections && sections.length > 0)) {
      const accordn = [];
      for (let i = 0; i < sections.length; i += 1) {
        if (i === 0) {
          accordn.push(true);
        } else {
          accordn.push(false);
        }
      }
      setAccordian(accordn);
    }
  };

  function getCatQtnsList(assetData, groupId) {
    const assetDataList = assetData.filter((item) => item.page_id.id === groupId);
    const sectionsList = sortCategories(groupByMultiple(assetDataList, (obj) => (obj.mro_quest_grp_id && obj.mro_quest_grp_id.id ? obj.mro_quest_grp_id.id : '')));
    // getinitial(sectionsList);
    return sectionsList;
  }

  useEffect(() => {
    if (categoryId) {
      const sectionsList = getCatQtnsList(questionValues, categoryId);
      getinitial(sectionsList); // Update the state only when sectionsList changes
    }
  }, [categoryId]);

  const toggleAccordion = (tab) => {
    const prevState = accordion;
    const state = prevState.map((x, index) => (tab === index ? !x : false));
    for (let i = 0; i < state.length; i += 1) {
      if (state[i] === false) {
        setIcon(faAngleDown);
      } else {
        setIcon(faAngleUp);
      }
    }
    setAccordian(state);
  };

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

  const disabledButton = !isReqAttachAdded || errorId || mandAnsLen || !ansLen || (hxAuditUpdate && hxAuditUpdate.loading);
  const dataLoading = (hxAuditUpdate && hxAuditUpdate.loading);
  const showButton = !(orderCheckLists && orderCheckLists.length);
  const isSuccess = hxAuditUpdate && hxAuditUpdate.data;

  function getTableHeight(dataLength) {
    let res = 150;
    const rowHeight = 40; // Approximate height of a single row in pixels
    const maxHeight = 150; // Max height based on viewport
    const rowCount = dataLength && dataLength > 0 ? dataLength + 1 : 1;
    // Calculate the height
    res = Math.min(rowCount * rowHeight, maxHeight);
    return res;
  }

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
          className=""
        >
          <>
            <Row>
              <Col md={3} sm={12} xs={12} lg={3} className="sticky-filter thin-scrollbar">
                {isMobileView && categoryId && (
                <div
                  style={{ backgroundColor: returnThemeColor(), color: 'white' }}
                  className="p-2 cursor-pointer mb-3"
                >
                  <p
                    className="font-weight-700 m-0"
                  >
                    {getCatQtnsCount(
                      orderCheckLists,
                      categoryId,
                      'answer',
                    ) === 0
                      ? (
                        <FontAwesomeIcon
                          size="md"
                          className="height-15 mr-2"
                          style={{ color: 'white' }}
                          icon={faPaperclip}
                        />
                      )
                      : getCatQtnsCount(
                        orderCheckLists,
                        categoryId,
                        'answer',
                      ) !== getCatQtnsCount(
                        orderCheckLists,
                        categoryId,
                        'total',
                      )
                        ? (
                          <FontAwesomeIcon
                            size="md"
                            className="height-15 mr-2"
                            style={{ color: 'white' }}
                            icon={faHourglass}
                          />
                        )
                        : (
                          <FontAwesomeIcon
                            size="md"
                            className="height-15 mr-2"
                            style={{ color: 'white' }}
                            icon={faCheckCircle}
                          />
                        ) }
                    <Tooltip title={getCatName(categoryId)} placement="top">
                      {truncate(getCatName(categoryId), 30)}
                    </Tooltip>
                    <p className="float-right font-weight-700 m-0">
                      {`(${getCatQtnsCount(
                        orderCheckLists,
                        categoryId,
                        'answer',
                      )} / 
                                    ${getCatQtnsCount(
                        orderCheckLists,
                        categoryId,
                        'total',
                      )})`}
                      <FontAwesomeIcon
                        size="lg"
                        className="height-15 ml-2"
                        onClick={() => setCatOpen(!catOpen)}
                        style={{ color: 'white' }}
                        icon={catOpen ? Icons.faArrowAltCircleUp : Icons.faArrowAltCircleDown}
                      />
                    </p>

                  </p>
                </div>
                )}
                {(catOpen || !isMobileView) && (categories && categories.length > 0) && sortCategories(categories).map((cat) => (
                  <div
                    key={cat[0].page_id}
                    aria-hidden
                    onClick={() => { setCategoryId(cat[0].page_id.id); setCatOpen(false); }}
                    style={categoryId === cat[0].page_id.id ? { backgroundColor: returnThemeColor(), color: 'white' } : {}}
                    className="p-2 cursor-pointer"
                  >
                    <p
                      className={categoryId === cat[0].page_id.id ? 'font-weight-700 m-0' : 'font-weight-500 m-0'}
                    >
                      {getCatQtnsCount(
                        orderCheckLists,
                        cat && cat[0].page_id && cat[0].page_id.id ? cat[0].page_id.id : '',

                        'answer',
                      ) === 0
                        ? (
                          <FontAwesomeIcon
                            size="md"
                            className="height-15 mr-2"
                            style={categoryId === cat[0].page_id.id ? { color: 'white' } : {}}
                            icon={faPaperclip}
                          />
                        )
                        : getCatQtnsCount(
                          orderCheckLists,
                          cat && cat[0].page_id && cat[0].page_id.id ? cat[0].page_id.id : '',

                          'answer',
                        ) !== getCatQtnsCount(
                          orderCheckLists,
                          cat && cat[0].page_id && cat[0].page_id.id ? cat[0].page_id.id : '',

                          'total',
                        )
                          ? (
                            <FontAwesomeIcon
                              size="md"
                              className="height-15 mr-2"
                              style={categoryId === cat[0].page_id.id ? { color: 'white' } : {}}
                              icon={faHourglass}
                            />
                          )
                          : (
                            <FontAwesomeIcon
                              size="md"
                              className="height-15 mr-2"
                              style={categoryId === cat[0].page_id.id ? { color: 'white' } : {}}
                              icon={faCheckCircle}
                            />
                          ) }
                      <Tooltip title={cat[0].page_id && cat[0].page_id.title} placement="top">
                        {cat[0].page_id && cat[0].page_id.title ? truncate(cat[0].page_id.title, 32) : ''}
                      </Tooltip>
                      <p className="float-right font-weight-700 m-0">
                        {`(${getCatQtnsCount(
                          orderCheckLists,
                          cat && cat[0].page_id && cat[0].page_id.id ? cat[0].page_id.id : '',

                          'answer',
                        )} / 
                                    ${getCatQtnsCount(
                          orderCheckLists,
                          cat && cat[0].page_id && cat[0].page_id.id ? cat[0].page_id.id : '',

                          'total',
                        )})`}

                      </p>
                    </p>
                  </div>
                ))}
              </Col>
              <Col md="9" sm="12" lg="9" xs="12" className={`h-100 sticky-filter thin-scrollbar ${isMobileView ? 'mt-3 p-2' : ''}`}>
                <div className="">
                  {questionValues && questionValues.length > 0 && getCatQtnsList(questionValues, categoryId).map((cItem, index) => (
                    <div
                      id="accordion"
                      className="accordion-wrapper mb-3 border-0"
                      key={cItem[0].mro_quest_grp_id && cItem[0].mro_quest_grp_id.id ? cItem[0].mro_quest_grp_id.id : ''}
                    >
                      <Card>
                        <CardHeader style={accordion[index] ? { backgroundColor: returnThemeColor(), color: 'white' } : {}} id={`heading${index}`} className="p-2 transparent-header border-0">
                          <div
                            style={accordion[index] ? { color: 'white' } : {}}
                            id={`heading${index}`}
                            aria-hidden
                            className="text-left m-0 p-0 border-0 box-shadow-none cursor-pointer"
                            onClick={() => toggleAccordion(index)}
                            aria-expanded={accordion[index]}
                            aria-controls={`collapse${index}`}
                          >
                            <span className="collapse-heading font-weight-800 font-family-tab" style={accordion[index] ? { color: 'white' } : {}}>
                              {cItem && cItem[0].mro_quest_grp_id && cItem[0].mro_quest_grp_id.name ? cItem[0].mro_quest_grp_id.name : 'General'}

                            </span>
                            <span className="float-right font-weight-800 font-family-tab" style={accordion[index] ? { color: 'white' } : {}}>

                              <>
                                {`(${getQtnsCount(
                                  questionValues,
                                  cItem && cItem[0].mro_quest_grp_id && cItem[0].mro_quest_grp_id.id ? cItem[0].mro_quest_grp_id.id : '',

                                  'answer',
                                )} / 
                                  ${getQtnsCount(
                                  questionValues,
                                  cItem && cItem[0].mro_quest_grp_id && cItem[0].mro_quest_grp_id.id ? cItem[0].mro_quest_grp_id.id : '',

                                  'total',
                                )})`}
                              </>

                              {accordion[index]
                                ? <FontAwesomeIcon className="ml-2 font-weight-800" size="lg" icon={faAngleUp} />
                                : <FontAwesomeIcon className="ml-2 font-weight-800" size="lg" icon={icon} />}
                            </span>
                          </div>
                        </CardHeader>

                        <Collapse
                          isOpen={accordion[index]}
                          data-parent="#accordion"
                          id={`collapse${index}`}
                          className="border-0 p-2 med-form-content thin-scrollbar"
                          aria-labelledby={`heading${index}`}
                        >
                          {getQtnsList(questionValues, cItem && cItem[0].mro_quest_grp_id && cItem[0].mro_quest_grp_id.id ? cItem[0].mro_quest_grp_id.id : '').map((item, index1) => (
                            <div key={item.id}>
                              <Row className="font-weight-600 font-family-tab">
                                <Col md="11" sm="12" xs="12" lg="11">
                                  {`${index1 + 1})`}
                                  {' '}
                                  {item.mro_activity_id && item.mro_activity_id.name ? item.mro_activity_id.name : ''}
                                  {' '}
                                  {item.mro_activity_id && (item.mro_activity_id.procedure || (item.mro_activity_id && item.mro_activity_id.applicable_standard_ids && item.mro_activity_id.applicable_standard_ids.length > 0)) && (
                                  <span aria-hidden className="text-info cursor-pointer" onClick={() => { setViewMoreId(isProcedure && viewMoreId === qtn.id ? false : item.id); setProcedure(!(isProcedure && viewMoreId === item.id)); }}>
                                    {!(isProcedure && viewMoreId === item.id) ? 'view more...' : 'view less'}
                                  </span>
                                  )}
                                  {item.mro_activity_id && item.mro_activity_id.helper_text && (
                                  <Tooltip title={item.mro_activity_id.helper_text} placement="top">
                                    <span className="text-info">
                                      <FontAwesomeIcon
                                        size="md"
                                        className="height-15 ml-2 cursor-pointer"
                                        icon={Icons.faInfoCircle}
                                      />
                                    </span>
                                  </Tooltip>
                                  )}
                                  {item.mro_activity_id && item.mro_activity_id.procedure && isProcedure && viewMoreId === item.id && (
                                  <p className="p-1 mb-2 font-weight-800 ml-1 font-family-tab">
                                    Procedure:
                                    <span className="font-weight-400 ml-2 font-family-tab">
                                      {item.mro_activity_id.procedure}
                                    </span>
                                  </p>
                                  )}
                                  {(item.mro_activity_id && item.mro_activity_id.applicable_standard_ids && item.mro_activity_id.applicable_standard_ids.length > 0) && isProcedure && viewMoreId === item.id && (
                                  <>
                                    <p className="font-family-tab mb-2 ml-2">Applicable Standards</p>
                                    <div style={{ height: `${getTableHeight(item.mro_activity_id.applicable_standard_ids.length)}px` }} className="small-table-scroll thin-scrollbar">
                                      <Table id="spare-part" className="mb-0 ml-1" responsive bordered>
                                        <thead className="bg-lightblue">
                                          <tr>
                                            <th className="font-family-tab p-2 min-width-140 border-0 table-column z-Index-1060">
                                              Title
                                            </th>
                                            <th className="font-family-tab p-2 min-width-160 border-0 table-column z-Index-1060">
                                              Disclosure
                                            </th>
                                            <th className="font-family-tab p-2 min-width-160 border-0 table-column z-Index-1060">
                                              Standard
                                            </th>
                                            <th className="font-family-tab p-2 min-width-160 border-0 table-column z-Index-1060">
                                              Description
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {item.mro_activity_id.applicable_standard_ids.map((as) => (
                                            <tr key={as.id}>
                                              <td className="p-2 font-weight-400 font-family-tab">{as.name}</td>
                                              <td className="p-2 font-weight-400 font-family-tab">{as.disclosure}</td>
                                              <td className="p-2 font-weight-400 font-family-tab">{as.standard_id && as.standard_id.name ? as.standard_id.name : '-'}</td>
                                              <td className="p-2 font-weight-400 font-family-tab">{as.description}</td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </Table>
                                    </div>
                                  </>
                                  )}
                                </Col>
                                {!isMobileView && (
                                <Col md="1" sm="2" xs="2" lg="1" className="text-right">
                                  {(item.mro_activity_id.type === 'suggestion' && item.value_suggested && item.answer_common !== false) && (
                                  <img alt="assigned" width="17" height="17" className="mr-1" src={fullyAssignIcon} />
                                  )}
                                  {(item.answer_common && item.mro_activity_id.type !== 'suggestion') && (
                                  <img alt="assigned" width="17" height="17" className="mr-1" src={fullyAssignIcon} />
                                  )}
                                </Col>
                                )}
                              </Row>
                              <Row className="font-weight-400">
                                {item.mro_activity_id.type === 'suggestion' && (
                                <Col md="11" sm="12" xs="12" lg="11">
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
                                    <div className="text-right mt-3 text-line-height-2 mr-4">
                                      {isImageMaxExists(item.id) && (
                                      <ReactFileReader handleFiles={(files) => handleFiles(files, item)} elementId={item.id} fileTypes="*" base64>
                                        <Tooltip title="Upload" placement="top">
                                          <span className="text-info">
                                            <FontAwesomeIcon
                                              size="lg"
                                              className="height-15 mr-1 cursor-pointer"
                                              icon={Icons.faFileUpload}
                                            />
                                          </span>
                                        </Tooltip>
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
                                    <div className="text-right mt-3 text-line-height-2 mr-4">
                                      {isImageMaxExists(item.id) && (
                                      <ReactFileReader handleFiles={(files) => handleFiles(files, item)} elementId={item.id} fileTypes="*" base64>
                                        <Tooltip title="Upload" placement="top">
                                          <span className="text-info">
                                            <FontAwesomeIcon
                                              size="lg"
                                              className="height-15 mr-1 cursor-pointer"
                                              icon={Icons.faFileUpload}
                                            />
                                          </span>
                                        </Tooltip>
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
                                <Col md="11" sm="12" xs="12" lg="11" className={item.mro_activity_id.type === 'boolean' ? 'mt-0 pt-2' : ''}>
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
                                    <div className="text-right mt-3 text-line-height-2 mr-4">
                                      {isImageMaxExists(item.id) && (
                                      <ReactFileReader handleFiles={(files) => handleFiles(files, item)} elementId={item.id} fileTypes="*" base64>
                                        <Tooltip title="Upload" placement="top">
                                          <span className="text-info">
                                            <FontAwesomeIcon
                                              size="lg"
                                              className="height-15 mr-1 cursor-pointer"
                                              icon={Icons.faFileUpload}
                                            />
                                          </span>
                                        </Tooltip>
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
                                  {item.mro_activity_id && (item.remarks || item.mro_activity_id.comments_allowed || item.mro_activity_id.has_attachment) && (
                                  <div className="text-right mt-3 text-line-height-2 mr-4 ml-auto display-flex content-center">
                                    {item.answer_common && (
                                    <>
                                      <span className="text-info mr-2" aria-hidden onClick={() => onNcOpen(item.id, item.mro_activity_id.id, item.mro_activity_id.name, 'Improvement Opportunity', item.remarks, item.answer_common)}>
                                        <Tooltip title="Add Improvement Opportunity" placement="top" getPopupContainer={(triggerNode) => triggerNode.parentNode}>
                                          <FontAwesomeIcon
                                            size="lg"
                                            className="height-15 cursor-pointer"
                                            icon={Icons.faPlusCircle}
                                          />
                                        </Tooltip>
                                      </span>
                                      {checkAction(item.mro_activity_id && item.mro_activity_id.id) && (
                                      <Tooltip title="View Actions" placement="top">
                                        <span className="text-info mr-2">
                                          <FontAwesomeIcon
                                            size="lg"
                                            onClick={() => onViewActions(item.mro_activity_id.name, item.mro_activity_id.id)}
                                            className="height-15 cursor-pointer"
                                            icon={Icons.faNoteSticky}
                                          />
                                        </span>
                                      </Tooltip>
                                      )}
                                    </>
                                    )}
                                    {(item.mro_activity_id.comments_allowed || item.remarks) && (
                                    <span className="text-info" aria-hidden onClick={() => onViewOpen(item.mro_activity_id.name, item.id, item.remarks)}>
                                      <Tooltip title="Add / Edit Remarks" placement="top">
                                        <FontAwesomeIcon
                                          size="lg"
                                          className="height-15 mr-2 cursor-pointer"
                                          icon={Icons.faComment}
                                        />
                                      </Tooltip>
                                    </span>
                                    )}

                                    {item.mro_activity_id.has_attachment && isImageMaxExists(item.id) && (
                                    <ReactFileReader handleFiles={(files) => handleFiles(files, item)} elementId={item.id} fileTypes="*" base64>
                                      <Tooltip title="Upload" placement="top">
                                        <span className="text-info">
                                          <FontAwesomeIcon
                                            size="lg"
                                            className="height-15 mr-1 cursor-pointer"
                                            icon={Icons.faFileUpload}
                                          />
                                        </span>
                                      </Tooltip>
                                      {item.mro_activity_id && item.mro_activity_id.is_attachment_mandatory && !isImageExists(item.id) && (<span className="text-danger font-weight-800 ml-1"> *</span>)}
                                    </ReactFileReader>
                                    )}
                                  </div>
                                  )}
                                  {item.answer_common && !(item.mro_activity_id && (item.remarks || item.mro_activity_id.comments_allowed || item.mro_activity_id.has_attachment)) && (
                                  <div className="text-right mt-3 text-line-height-2 mr-4 ml-auto display-flex content-center">
                                    <span className="text-info mr-2" aria-hidden onClick={() => onNcOpen(item.id, item.mro_activity_id.id, item.mro_activity_id.name, 'Improvement Opportunity', item.remarks, item.answer_common)}>
                                      <Tooltip title="Add Improvement Opportunity" placement="top" getPopupContainer={(triggerNode) => triggerNode.parentNode}>
                                        <FontAwesomeIcon
                                          size="lg"
                                          className="height-15 cursor-pointer"
                                          icon={Icons.faPlusCircle}
                                        />
                                      </Tooltip>
                                    </span>
                                    {checkAction(item.mro_activity_id && item.mro_activity_id.id) && (
                                    <Tooltip title="View Actions" placement="top">
                                      <span className="text-info mr-2">
                                        <FontAwesomeIcon
                                          size="lg"
                                          onClick={() => onViewActions(item.mro_activity_id.name, item.mro_activity_id.id)}
                                          className="height-15 cursor-pointer"
                                          icon={Icons.faNoteSticky}
                                        />
                                      </span>
                                    </Tooltip>
                                    )}
                                  </div>
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
                                    sm="12"
                                    lg="11"
                                    xs="12"
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
                                  {item.mro_activity_id && (item.remarks || item.mro_activity_id.comments_allowed || item.mro_activity_id.has_attachment) && (
                                  <div className="text-right mt-3 text-line-height-2 mr-4 ml-auto display-flex content-center">
                                    {item.answer_common && (
                                      <>
                                        <span className="text-info mr-2" aria-hidden onClick={() => onNcOpen(item.id, item.mro_activity_id.id, item.mro_activity_id.name, 'Improvement Opportunity', item.remarks, item.answer_common)}>
                                          <Tooltip title="Add Improvement Opportunity" placement="top" getPopupContainer={(triggerNode) => triggerNode.parentNode}>
                                            <FontAwesomeIcon
                                              size="lg"
                                              className="height-15 cursor-pointer"
                                              icon={Icons.faPlusCircle}
                                            />
                                          </Tooltip>
                                        </span>
                                        {checkAction(item.mro_activity_id && item.mro_activity_id.id) && (
                                        <Tooltip title="View Actions" placement="top">
                                          <span className="text-info mr-2">
                                            <FontAwesomeIcon
                                              size="lg"
                                              onClick={() => onViewActions(item.mro_activity_id.name, item.mro_activity_id.id)}
                                              className="height-15 cursor-pointer"
                                              icon={Icons.faNoteSticky}
                                            />
                                          </span>
                                        </Tooltip>
                                        )}
                                      </>
                                    )}
                                    {(item.remarks || item.mro_activity_id.comments_allowed) && (
                                    <span className="text-info" aria-hidden onClick={() => onViewOpen(item.mro_activity_id.name, item.id, item.remarks)}>
                                      <Tooltip title="Add / Edit Remarks" placement="top">
                                        <FontAwesomeIcon
                                          size="lg"
                                          className="height-15 mr-2 cursor-pointer"
                                          icon={Icons.faComment}
                                        />
                                      </Tooltip>
                                    </span>
                                    )}

                                    {item.mro_activity_id.has_attachment && isImageMaxExists(item.id) && (
                                    <ReactFileReader handleFiles={(files) => handleFiles(files, item)} elementId={item.id} fileTypes="*" base64>
                                      <Tooltip title="Upload" placement="top">
                                        <span className="text-info">
                                          <FontAwesomeIcon
                                            size="lg"
                                            className="height-15 mr-1 cursor-pointer"
                                            icon={Icons.faFileUpload}
                                          />
                                        </span>
                                      </Tooltip>
                                      {item.mro_activity_id && item.mro_activity_id.is_attachment_mandatory && !isImageExists(item.id) && (<span className="text-danger font-weight-800 ml-1"> *</span>)}
                                    </ReactFileReader>
                                    )}
                                  </div>
                                  )}
                                  {item.answer_common && !(item.mro_activity_id && (item.remarks || item.mro_activity_id.comments_allowed || item.mro_activity_id.has_attachment)) && (
                                  <div className="text-right mt-3 text-line-height-2 mr-4 ml-auto display-flex content-center">
                                    <span className="text-info mr-2" aria-hidden onClick={() => onNcOpen(item.id, item.mro_activity_id.id, item.mro_activity_id.name, 'Improvement Opportunity', item.remarks, item.answer_common)}>
                                      <Tooltip title="Add Improvement Opportunity" placement="top" getPopupContainer={(triggerNode) => triggerNode.parentNode}>
                                        <FontAwesomeIcon
                                          size="lg"
                                          className="height-15 cursor-pointer"
                                          icon={Icons.faPlusCircle}
                                        />
                                      </Tooltip>
                                    </span>
                                    {checkAction(item.mro_activity_id && item.mro_activity_id.id) && (
                                    <Tooltip title="View Actions" placement="top">
                                      <span className="text-info mr-2">
                                        <FontAwesomeIcon
                                          size="lg"
                                          onClick={() => onViewActions(item.mro_activity_id.name, item.mro_activity_id.id)}
                                          className="height-15 cursor-pointer"
                                          icon={Icons.faNoteSticky}
                                        />
                                      </span>
                                    </Tooltip>
                                    )}
                                  </div>
                                  )}
                                </>
                                )}
                              </Row>
                              <hr className="mt-2 mb-2" />
                            </div>
                          ))}
                        </Collapse>
                      </Card>
                    </div>

                  ))}
                </div>
              </Col>
            </Row>
            {(!disabledButton || showButton) && (
            <div className="text-center mt-3 mb-3">
              {(hxAuditUpdate && hxAuditUpdate.loading) && (
              <div className="text-center mt-4 mb-4">
                <Loader />
              </div>
              )}
              {(hxAuditUpdate && hxAuditUpdate.err) && (
              <div className="text-center mt-3 mb-3">
                <SuccessAndErrorFormat response={hxAuditUpdate} />
              </div>
              )}
            </div>
            )}
          </>
        </Box>
        <div className="text-center mt-2">
          {isMobileView && (
          <h6 className="text-info">
            (
            {ansLen}
            {' '}
            /
            {' '}
            {allLen}
            )
          </h6>
          )}

          <Button
            type="button"
            size="medium"
            variant="contained"
            disabled={(!showButton && disabledButton)}
            onClick={() => { updateWo(); setErrorId(false); setValidationMessage(''); }}
          >
            <img src={checkWhite} className="mr-2" alt="Prepare" width="13" height="13" />
            <span>{ansLen !== allLen ? 'Save' : 'Submit and Complete'}</span>
          </Button>
          {!isReqAttachAdded && (
          <p className="text-danger">Please upload files for all mandatory checklists.</p>
          )}
        </div>
        <Dialog fullWidth={isMobileView} maxWidth={isMobileView ? 'xl' : 'md'} open={isViewRemarks}>
          <DialogHeader title={qtnName} ontAwesomeIcon={Icons.faComment} onClose={() => onRemarksClose()} hideClose={isRequireRemarks} />
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <Row className="">
                <Col xs={12} sm={12} md={12} lg={12}>
                  <Label className="mt-0">
                    Remarks
                    {' '}
                    {isRequireRemarks && (<span className="text-danger">*</span>)}
                  </Label>
                  <Input type="textarea" name="body" label="Action Taken" placeholder="Enter here" value={currentRemarks || ''} onChange={onMessageChange} className="bg-whitered" rows="4" />
                  {isRequireRemarks && !currentRemarks && <p className="text-danger">Comment Required</p>}
                </Col>
              </Row>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              size="medium"
              variant="contained"
              disabled={!currentRemarks}
              className="mr-1"
              onClick={() => onRemarksSaveClose(currentRemarks)}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog maxWidth="xl" open={auditActionModal}>
          <DialogHeader title={`Actions - ${qtnName}`} ontAwesomeIcon={Icons.faNoteSticky} onClose={() => onCloseActions()} />
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <AuditActions noView questionId={actionQtnId} />
            </DialogContentText>
          </DialogContent>
        </Dialog>
        <Dialog fullWidth={isMobileView} maxWidth={isMobileView ? 'xl' : 'md'} open={ncModal}>
          <DialogHeader isLeftSubTitle title={`Create ${acType === 'Non-conformity' ? 'Non-Conformity' : 'Improvement Opportunity'}`} subtitle={`for "${qtnName}" ${currentAnswer ? ` - ${currentAnswer}` : ''}`} onClose={() => onNcClose()} response={false} imagePath={false} />
          <CreateNonConformity onRemarksSaveClose={onRemarksSaveCloseV1} qtnDataId={qtnDataId} currentAnswer={currentAnswer} currentRemarks={currentRemarks} onMessageChange={onMessageChange} qtnName={qtnName} type={acType} onClose={() => onNcClose1()} auditId={detailData.id} qtnId={qtnId} />
        </Dialog>
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
      {isSuccess && !dataLoading && (
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
        {(hxAuditUpdate && hxAuditUpdate.data) && (
        <div className="p-4 mt-4">
          {ansLen !== allLen && (
          <Alert severity="info">
            <p className="font-family-tab mb-0 font-weight-800">
              Audit checklists have been saved successfully.
              <span className="ml-2 cursor-pointer text-underlined" onClick={() => onResume()}>Resume</span>
            </p>
          </Alert>
          )}
          {ansLen === allLen && (
          <Alert severity="info">
            <p className="font-family-tab mb-0 font-weight-800">Thank you.</p>
            <p className="font-family-tab mb-0 font-weight-800">Audit has been performed successfully.</p>
          </Alert>
          )}
        </div>
        )}

      </Box>
      )}
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
