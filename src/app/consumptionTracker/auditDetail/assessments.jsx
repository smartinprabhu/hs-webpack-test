/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */
/* eslint-disable radix */
/* eslint-disable no-loop-func */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import {
  Button, Card, CardHeader, Collapse,
  Row,
  Table,
  Col,
  Input,
  Modal,
  Alert,
  ModalBody,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import {
  faAngleDown, faAngleUp, faAngleRight,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import {
  Switch, Spin, Tooltip, DatePicker,
} from 'antd';
import moment from 'moment';

import inProgress from '@images/icons/inProgressNoCircle.svg';
import notStarted from '@images/inspection/notStarted.svg';
import fullyAssignIcon from '@images/icons/fullyAssign.png';
import dataSourceIcon from '@images/slaAudit/dataSourceIcon.svg';
import uploadPhotoBlue from '@images/uploadPhotoBlue.svg';

import ModalHeaderComponent from '@shared/modalHeaderComponent';
import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';

import { updateCt, updateCtAlt, getDecimalPrecision } from '../ctService';
import {
  generateErrorMessage,
  getDefaultNoValue,
  numToFloatView,
  getLocalTime,
  getDatePickerFormat,
  getDateTimeSeconds,
  getFloatTotalFromArrayConsumption,
  getComputedValidAnswer,
  truncate,
} from '../../util/appUtils';
import { groupByMultiple } from '../../util/staticFunctions';
import Documents from '../../commonComponents/documents';

const appModels = require('../../util/appModels').default;

const Checklists = (props) => {
  const {
    detailData,
    setSavedQuestions,
  } = props;

  const dispatch = useDispatch();

  const [accordion, setAccordian] = useState([]);
  const [icon, setIcon] = useState(faAngleDown);

  const [questionGroups, setQuestionGroups] = useState([]);
  const [categoryId, setCategoryId] = useState([]);

  const [lastUpdated, setLastUpdated] = useState([]);

  const [attachmentModal, setAttachmentModal] = useState(false);
  const [currentId, setCurrentId] = useState(false);
  const [currentName, setCurrentName] = useState(false);

  const [loadAns, setLoadAns] = useState(false);
  const [dataType, setDataType] = useState('');

  const [currentGroupId, setCurrentGroupId] = useState('');

  const [currentHoverId, setCurrentHoverId] = useState('');

  const [savedRecords, setSavedRecords] = useState([]);

  const [isTimer, setTimer] = useState(false);
  const [fetchTime, setFetchTime] = useState(false);

  const [extraLoad, setExtraLoad] = useState('no');

  const { updateCtInfo, decimalPrecisionGlobal } = useSelector((state) => state.consumptionTracker);
  const { userInfo } = useSelector((state) => state.user);

  const loading = detailData && detailData.loading;
  const isErr = detailData && detailData.err;
  const inspDeata = detailData && detailData.data && detailData.data.length ? detailData.data[0] : false;
  const isChecklist = (inspDeata && inspDeata.tracker_lines && inspDeata.tracker_lines.length > 0);

  const sections = isChecklist > 0 ? groupByMultiple(questionGroups, (obj) => (obj.question_group_id && obj.question_group_id.id ? obj.question_group_id.id : '')) : [];

  const categories = isChecklist > 0 ? groupByMultiple(inspDeata.tracker_lines, (obj) => (obj.category_id && obj.category_id.id ? obj.category_id.id : '')) : [];

  const dpGlobal = decimalPrecisionGlobal && decimalPrecisionGlobal.data && decimalPrecisionGlobal.data.length ? decimalPrecisionGlobal.data : false;

  const consumptionTracker = dpGlobal && dpGlobal.find((module) => module.name === 'Consumption Tracker');
  const consumptionTrackerdpGlobal = consumptionTracker ? consumptionTracker.digits : 2;

  function getDecimalPoints(activityId) {
    let res = 2;
    if (activityId) {
      res = activityId.decimal_accuracy_id && activityId.decimal_accuracy_id?.digits ? activityId.decimal_accuracy_id.digits : consumptionTrackerdpGlobal;
    }
    return res;
  }

  useEffect(() => {
    dispatch(getDecimalPrecision(appModels.DECIMALPRECISION));
  }, []);

  const getinitial = () => {
    if ((sections && sections.length > 0)) {
      const accordn = [];
      for (let i = 0; i < sections.length; i += 1) {
        /* if (i === 0) {
          accordn.push(false);
        } else {
          accordn.push(false);
        } */
        accordn.push(true);
      }
      setAccordian(accordn);
    }
  };

  function getSortedArray(arr) {
    let res = [];
    if (arr) {
      res = arr.sort((a, b) => a.mro_activity_id.sequence - b.mro_activity_id.sequence);
    }
    return res;
  }

  function getPendingQtns() {
    let res = false;
    const data = savedRecords.filter((item) => item.is_update === 'start');
    if (data && data.length) {
      res = true;
    }
    return res;
  }

  function getFailedQtns() {
    let res = false;
    const data = savedRecords.filter((item) => item.is_update === 'failed');
    if (data && data.length) {
      res = true;
    }
    return res;
  }

  function checkAnaswerExists(id, answer) {
    let res = true;
    if (savedRecords && savedRecords.length) {
      const data = savedRecords.filter((item) => item.answer === answer && item.id === id && item.is_update === 'success');
      if (data && data.length) {
        res = false;
      }
    } /* else if (savedTrLines && savedTrLines.length) {
      const data = savedTrLines.filter((item) => item.answer === answer && item.id === id);
      if (data && data.length) {
        res = false;
      }
    } */
    return res;
  }

  function checkAnswerExists(id, answer) {
    let res = true;
    if (questionGroups && questionGroups.length) {
      const data = questionGroups.filter((item) => item.answer !== answer && item.id === id);
      if (data && data.length) {
        res = false;
      }
    } /* else if (savedTrLines && savedTrLines.length) {
      const data = savedTrLines.filter((item) => item.answer === answer && item.id === id);
      if (data && data.length) {
        res = false;
      }
    } */
    return res;
  }

  function saveRecordbyInput(data) {
    const saveRec = [];
    const answeredQtns = data; // [...new Map(data.map((item) => [item.id, item])).values()];

    // console.log(answeredQtns);

    if (answeredQtns.length) {
      for (let i = 0; i < answeredQtns.length; i += 1) {
        saveRec.push({
          id: answeredQtns[i].id, answer: answeredQtns[i].answer, value: answeredQtns[i].answer, is_update: 'start',
        });
      }
      //  console.log(saveRec);
      if (saveRec && saveRec.length) {
        const savingRecords = [...savedRecords, ...saveRec];
        const savingsRecords = [...new Map(savingRecords.map((item) => [item.id, item])).values()];
        //  console.log(savingsRecords);
        setSavedRecords(savingsRecords);
        setSavedQuestions(savingsRecords);
      }
    }
  }

  // console.log(savedRecords);

  function saveRecordbyTime() {
    let newData = [];
    const trackerLines = [];

    const savingsRecords = [...new Map(savedRecords.map((item) => [item.id, item])).values()];

    const answeredQtns = savingsRecords.filter((item) => item.is_update === 'start');

    if (answeredQtns.length) {
      for (let i = 0; i < answeredQtns.length; i += 1) {
        if (answeredQtns[i].type === 'numerical_box') {
          newData = [1, answeredQtns[i].id, { answer: answeredQtns[i].answer, value: getComputedValidAnswer(answeredQtns[i].answer) }];
          trackerLines.push(newData);
        } else {
          newData = [1, answeredQtns[i].id, { answer: answeredQtns[i].answer }];
          trackerLines.push(newData);
        }
      }
      const payloadValues = {
        lines: trackerLines,
      };
      dispatch(updateCt(inspDeata.id, 'hx.tracker_line', payloadValues, 'checklist'));
    }
  }

  function saveRecordby() {
    let newData = [];
    const trackerLines = [];
    const answeredQtns = savedRecords.filter((item) => item.is_update === 'failed');

    if (answeredQtns.length) {
      for (let i = 0; i < answeredQtns.length; i += 1) {
        if (answeredQtns[i].type === 'numerical_box') {
          newData = [1, answeredQtns[i].id, { answer: answeredQtns[i].answer, value: getComputedValidAnswer(answeredQtns[i].answer) }];
          trackerLines.push(newData);
        } else {
          newData = [1, answeredQtns[i].id, { answer: answeredQtns[i].answer }];
          trackerLines.push(newData);
        }
      }
      const payloadValues = {
        lines: trackerLines,
      };
      dispatch(updateCt(inspDeata.id, 'hx.tracker_line', payloadValues, 'checklist'));
    }
  }

  useEffect(() => {
    if (isChecklist && inspDeata.state === 'Draft') {
      const dashboardInterval = 30000;
      const interval = setInterval(() => {
        setTimer(Math.random());
        setFetchTime(new Date(Date.now() - dashboardInterval));
      }, dashboardInterval);
      // clearInterval(interval);
    }
  }, [detailData]);

  useEffect(() => {
    if (isTimer) {
      saveRecordbyTime();
    }
  }, [isTimer]);

  const onUnsavedUpdate = () => {
    saveRecordby();
  };

  /* function saveRecordbyLength() {
    let newData = [];
    const trackerLines = [];
    const answeredQtns = questionGroups.filter((item) => item.answer);
    const arr = [...savedRecords, ...answeredQtns];
    setSavedRecords(arr);

    const filterQtns = [...new Map(arr.map((item) => [item.id, item])).values()];
    const filteranswers = [...new Map(filterQtns.map((item) => [item.answer, item])).values()];

    if (savedRecords.length && filteranswers && filteranswers.length >= 20) {
      for (let i = 0; i < filteranswers.length; i += 1) {
        newData = [1, filteranswers[i].id, { answer: filteranswers[i].answer, value: filteranswers[i].answer }];
        trackerLines.push(newData);
      }
      const payloadValues = {
        tracker_lines: trackerLines,
      };
      setTimeout(() => {
        dispatch(updateCt(inspDeata.id, appModels.CONSUMPTIONTRACKER, payloadValues));
      }, 3000);
    }
  } */

  useEffect(() => {
    if (categories && categories.length && categories[0].length) {
      setCategoryId(categories[0][0] && categories[0][0].category_id ? categories[0][0].category_id.id : false);
    }
    setSavedRecords([]);
    setSavedQuestions([]);
  }, [detailData]);

  useEffect(() => {
    if (categoryId && inspDeata && inspDeata.tracker_lines && inspDeata.tracker_lines.length) {
      const catList = inspDeata.tracker_lines.filter((item) => item.category_id && item.category_id.id === categoryId);
      setQuestionGroups(catList);
    }
  }, [categoryId]);

  /* useMemo(() => {
    console.log(savedTrackers);
    if (savedTrackers) {
      let isMounted = true;
      if (isMounted) {
        setSavedRecords(savedTrackers);
      }
      return () => { isMounted = false; };
    }
  }, []); */

  useEffect(() => {
    if (questionGroups && questionGroups.length) {
      getinitial();
    }
  }, [questionGroups]);

  useEffect(() => {
    if (questionGroups && questionGroups.length && loadAns) {
      setQuestionGroups(questionGroups);
    }
  }, [loadAns]);

  function getAnswerValue(type, data) {
    let res = '';
    if (type === 'number') {
      res = data.value_number;
    } else if (type === 'date') {
      res = data.value_date;
    } else if (type === 'text') {
      res = data.value_text;
    } else if (type === 'free_text') {
      res = data.value_free_text;
    } else if (type === 'suggestion') {
      res = data.value_suggested && data.value_suggested.value ? data.value_suggested.value : '';
    }
    return res;
  }

  function getQuestion(assetData) {
    const tableTr = [];
    const assetDataList = assetData.sort((a, b) => a.sequence - b.sequence);
    for (let i = 0; i < assetDataList.length; i += 1) {
      tableTr.push(
        <tr key={i}>
          <td className="p-2">{getDefaultNoValue(assetData[i].question)}</td>
          <td className="p-2">{getDefaultNoValue(assetData[i].question_description)}</td>
          <td className="p-2">{numToFloatView(assetData[i].max_score)}</td>
        </tr>,
      );
    }
    return tableTr;
  }

  const getInputType = (type) => {
    let inputType = 'text';
    if (type === 'date') {
      inputType = 'date';
    }
    if (type === 'free_text') {
      inputType = 'textarea';
    }
    return inputType;
  };

  const getmaxLength = (type, qtn) => {
    let maxlength = 300;
    if (type === 'textbox' && qtn && qtn.validation_required && qtn.validation_length_max) {
      maxlength = qtn.validation_length_max;
    } else if (type === 'numerical_box' && qtn && qtn.validation_required && qtn.validation_max_float_value) {
      maxlength = qtn.validation_max_float_value;
    } else if (type === 'numerical_box' && qtn && !qtn.validation_required && !qtn.validation_max_float_value) {
      maxlength = 10;
    }
    return maxlength;
  };

  const handleInputChange = (event, checklist, qrpQtns, gId) => {
    const { value } = event.target;
    const field = 'answer';
    const detailIndex = questionGroups.findIndex((obj) => (obj.id === checklist.id));
    questionGroups[detailIndex][field] = value;
    setLoadAns(Math.random());
    setDataType('input');

    const storeData = [];

    setQuestionGroups(questionGroups);
    const grpQtnsData = questionGroups.filter((item) => item.mro_activity_id.type === 'Computed' && item.mro_activity_id.calculation_type === 'Expression' && item.mro_activity_id.expression.includes(checklist.mro_activity_id.code));
    if (checklist.mro_activity_id.type === 'numerical_box' && grpQtnsData && grpQtnsData.length) {
      for (let i = 0; i < grpQtnsData.length; i += 1) {
        const detailIndex1 = questionGroups.findIndex((obj) => (obj.id === grpQtnsData[i].id));
        const totalValue = getFloatTotalFromArrayConsumption(questionGroups, 'answer', grpQtnsData[i].mro_activity_id.expression);
        const res = totalValue;
        questionGroups[detailIndex1][field] = parseFloat(res).toFixed(getDecimalPoints(grpQtnsData[i].mro_activity_id));
        storeData.push({
          id: grpQtnsData[i].id, type: checklist.mro_activity_id.type, answer: parseFloat(getFloatTotalFromArrayConsumption(questionGroups, 'answer', grpQtnsData[i].mro_activity_id.expression)).toFixed(getDecimalPoints(grpQtnsData[i].mro_activity_id)), value: parseFloat(getFloatTotalFromArrayConsumption(questionGroups, 'answer', grpQtnsData[i].mro_activity_id.expression)).toFixed(getDecimalPoints(grpQtnsData[i].mro_activity_id)), is_update: 'start',
        });
      }
      setLoadAns(Math.random());
      setQuestionGroups(questionGroups);
      for (let i = 0; i < grpQtnsData.length; i += 1) {
        const compQtnGrpdata = questionGroups.filter((item) => item.mro_activity_id.type === 'Computed' && item.mro_activity_id.calculation_type === 'Expression' && item.mro_activity_id.expression.includes(grpQtnsData[i].mro_activity_id.code));
        if (compQtnGrpdata && compQtnGrpdata.length) {
          for (let j = 0; j < compQtnGrpdata.length; j += 1) {
            const detailIndex2 = questionGroups.findIndex((obj) => (obj.id === compQtnGrpdata[j].id));
            const totalValue2 = getFloatTotalFromArrayConsumption(questionGroups, 'answer', compQtnGrpdata[j].mro_activity_id.expression);
            const res2 = totalValue2;
            questionGroups[detailIndex2][field] = parseFloat(res2).toFixed(getDecimalPoints(compQtnGrpdata[j].mro_activity_id));
            storeData.push({
              id: compQtnGrpdata[j].id, type: checklist.mro_activity_id.type, answer: parseFloat(getFloatTotalFromArrayConsumption(questionGroups, 'answer', compQtnGrpdata[j].mro_activity_id.expression)).toFixed(getDecimalPoints(compQtnGrpdata[j].mro_activity_id)), value: parseFloat(getFloatTotalFromArrayConsumption(questionGroups, 'answer', compQtnGrpdata[j].mro_activity_id.expression)).toFixed(getDecimalPoints(compQtnGrpdata[j].mro_activity_id)), is_update: 'start',
            });
          }
          setLoadAns(Math.random());
          setQuestionGroups(questionGroups);
        }
      }
    }

    setSavedRecords([...savedRecords, ...storeData]);
    setSavedQuestions([...savedRecords, ...storeData]);
  };

  const handleInputKeyChange = (event, checklist) => {
    const { value } = event.target;
    const field = 'answer';
    const detailIndex = questionGroups.findIndex((obj) => (obj.id === checklist.id));
    questionGroups[detailIndex][field] = value;
    setLoadAns(Math.random());
    const sRecs = [...savedRecords, ...[{
      id: checklist.id, answer: value, value, type: checklist.mro_activity_id.type, is_update: 'start',
    }]];
    const uniSRecs = [...new Map(sRecs.map((item) => [item.id, item])).values()];
    setSavedRecords(uniSRecs);
    setSavedQuestions(uniSRecs);
    setQuestionGroups(questionGroups);
  };

  const handleCheckboxChange = (checked, checklist, gId) => {
    let storeData = [];
    if (checked) {
      const field = 'is_not_applicable';
      const qrpQtns = questionGroups.filter((item) => item.question_group_id && item.question_group_id.id === gId);
      const detailIndex = questionGroups.findIndex((obj) => (obj.id === checklist.id));
      questionGroups[detailIndex][field] = false;
      setLoadAns(Math.random());
      setDataType('input');
      storeData = [{
        id: checklist.id, is_not_applicable: false, type: checklist.mro_activity_id.type, answer: checklist.answer, is_update: 'start',
      }];
      const payload = {
        lines: [[1, checklist.id, { is_not_applicable: false }]],
      };
      dispatch(updateCtAlt(inspDeata.id, 'hx.tracker_line', payload));
      setQuestionGroups(questionGroups);
      const grpQtnsData = questionGroups.filter((item) => item.mro_activity_id.type === 'Computed' && item.mro_activity_id.calculation_type === 'Expression' && item.mro_activity_id.expression.includes(checklist.mro_activity_id.code));
      if (checklist.mro_activity_id.type === 'numerical_box' && grpQtnsData && grpQtnsData.length) {
        for (let i = 0; i < grpQtnsData.length; i += 1) {
          const detailIndex1 = questionGroups.findIndex((obj) => (obj.id === grpQtnsData[i].id));
          const totalValue = getFloatTotalFromArrayConsumption(questionGroups, 'answer', grpQtnsData[i].mro_activity_id.expression);
          const res = totalValue;
          questionGroups[detailIndex1].answer = parseFloat(res).toFixed(getDecimalPoints(grpQtnsData[i].mro_activity_id));
          storeData.push({
            id: grpQtnsData[i].id, type: checklist.mro_activity_id.type, answer: parseFloat(getFloatTotalFromArrayConsumption(questionGroups, 'answer', grpQtnsData[i].mro_activity_id.expression)).toFixed(getDecimalPoints(grpQtnsData[i].mro_activity_id)), value: parseFloat(getFloatTotalFromArrayConsumption(questionGroups, 'answer', grpQtnsData[i].mro_activity_id.expression)).toFixed(getDecimalPoints(grpQtnsData[i].mro_activity_id)), is_update: 'start',
          });
        }
        setLoadAns(Math.random());
        setQuestionGroups(questionGroups);
        for (let i = 0; i < grpQtnsData.length; i += 1) {
          const compQtnGrpdata = questionGroups.filter((item) => item.mro_activity_id.type === 'Computed' && item.mro_activity_id.calculation_type === 'Expression' && item.mro_activity_id.expression.includes(grpQtnsData[i].mro_activity_id.code));
          if (compQtnGrpdata && compQtnGrpdata.length) {
            for (let j = 0; j < compQtnGrpdata.length; j += 1) {
              const detailIndex2 = questionGroups.findIndex((obj) => (obj.id === compQtnGrpdata[j].id));
              const totalValue2 = getFloatTotalFromArrayConsumption(questionGroups, 'answer', compQtnGrpdata[j].mro_activity_id.expression);
              const res2 = totalValue2;
              questionGroups[detailIndex2].answer = parseFloat(res2).toFixed(getDecimalPoints(compQtnGrpdata[j].mro_activity_id));
              storeData.push({
                id: compQtnGrpdata[j].id, type: checklist.mro_activity_id.type, answer: parseFloat(getFloatTotalFromArrayConsumption(questionGroups, 'answer', compQtnGrpdata[j].mro_activity_id.expression)).toFixed(getDecimalPoints(compQtnGrpdata[j].mro_activity_id)), value: parseFloat(getFloatTotalFromArrayConsumption(questionGroups, 'answer', compQtnGrpdata[j].mro_activity_id.expression)).toFixed(getDecimalPoints(compQtnGrpdata[j].mro_activity_id)), is_update: 'start',
              });
            }
            setLoadAns(Math.random());
            setQuestionGroups(questionGroups);
          }
        }
      }
    } else {
      const field = 'is_not_applicable';
      const qrpQtns = questionGroups.filter((item) => item.question_group_id && item.question_group_id.id === gId);
      const detailIndex = questionGroups.findIndex((obj) => (obj.id === checklist.id));
      questionGroups[detailIndex][field] = true;
      setLoadAns(Math.random());
      setDataType('input');
      storeData = [{
        id: checklist.id, is_not_applicable: true, type: checklist.mro_activity_id.type, answer: checklist.answer, is_update: 'start',
      }];
      const payload = {
        lines: [[1, checklist.id, { is_not_applicable: true }]],
      };
      dispatch(updateCtAlt(inspDeata.id, 'hx.tracker_line', payload));
      setQuestionGroups(questionGroups);
      const grpQtnsData = questionGroups.filter((item) => item.mro_activity_id.type === 'Computed' && item.mro_activity_id.calculation_type === 'Expression' && item.mro_activity_id.expression.includes(checklist.mro_activity_id.code));
      if (checklist.mro_activity_id.type === 'numerical_box' && grpQtnsData && grpQtnsData.length) {
        for (let i = 0; i < grpQtnsData.length; i += 1) {
          const detailIndex1 = questionGroups.findIndex((obj) => (obj.id === grpQtnsData[i].id));
          const totalValue = getFloatTotalFromArrayConsumption(questionGroups, 'answer', grpQtnsData[i].mro_activity_id.expression);
          const res = totalValue;
          questionGroups[detailIndex1].answer = parseFloat(res).toFixed(getDecimalPoints(grpQtnsData[i].mro_activity_id));
          storeData.push({
            id: grpQtnsData[i].id, type: checklist.mro_activity_id.type, answer: parseFloat(getFloatTotalFromArrayConsumption(questionGroups, 'answer', grpQtnsData[i].mro_activity_id.expression)).toFixed(getDecimalPoints(grpQtnsData[i].mro_activity_id)), value: parseFloat(getFloatTotalFromArrayConsumption(questionGroups, 'answer', grpQtnsData[i].mro_activity_id.expression)).toFixed(getDecimalPoints(grpQtnsData[i].mro_activity_id)), is_update: 'start',
          });
        }
        setLoadAns(Math.random());
        setQuestionGroups(questionGroups);
        for (let i = 0; i < grpQtnsData.length; i += 1) {
          const compQtnGrpdata = questionGroups.filter((item) => item.mro_activity_id.type === 'Computed' && item.mro_activity_id.calculation_type === 'Expression' && item.mro_activity_id.expression.includes(grpQtnsData[i].mro_activity_id.code));
          if (compQtnGrpdata && compQtnGrpdata.length) {
            for (let j = 0; j < compQtnGrpdata.length; j += 1) {
              const detailIndex2 = questionGroups.findIndex((obj) => (obj.id === compQtnGrpdata[j].id));
              const totalValue2 = getFloatTotalFromArrayConsumption(questionGroups, 'answer', compQtnGrpdata[j].mro_activity_id.expression);
              const res2 = totalValue2;
              questionGroups[detailIndex2].answer = parseFloat(res2).toFixed(getDecimalPoints(compQtnGrpdata[j].mro_activity_id));
              storeData.push({
                id: compQtnGrpdata[j].id, type: checklist.mro_activity_id.type, answer: parseFloat(getFloatTotalFromArrayConsumption(questionGroups, 'answer', compQtnGrpdata[j].mro_activity_id.expression)).toFixed(getDecimalPoints(compQtnGrpdata[j].mro_activity_id)), value: parseFloat(getFloatTotalFromArrayConsumption(questionGroups, 'answer', compQtnGrpdata[j].mro_activity_id.expression)).toFixed(getDecimalPoints(compQtnGrpdata[j].mro_activity_id)), is_update: 'start',
              });
            }
            setLoadAns(Math.random());
            setQuestionGroups(questionGroups);
          }
        }
      }
    }
    setSavedRecords([...savedRecords, ...storeData]);
    setSavedQuestions([...savedRecords, ...storeData]);
  };

  function prepareResetData(array) {
    const newArray = [];
    let newData = [];
    for (let i = 0; i < array.length; i += 1) {
      newData = [array[i].id ? 1 : 0, array[i].id ? array[i].id : 0, { answer: '', achieved_score: '' }];
      newArray.push(newData);
    }
    return newArray;
  }

  function checkIsApplicable(grpId) {
    const res = true;
    /* const catList = performanceLogs ? performanceLogs.filter((item) => item.question_group_id && item.question_group_id.id === grpId) : [];
    if (catList && catList.length) {
      res = catList[0].is_notapplicable;
    } */
    return res;
  }

  function prepareResetUpdateData(array) {
    for (let i = 0; i < array.length; i += 1) {
      const detailIndex = questionGroups.findIndex((obj) => (obj.id === array[i].id));
      questionGroups[detailIndex].achieved_score = '';
      questionGroups[detailIndex].answer = '';
    }
  }

  /* const handleCheckboxChange = (checked, grpId) => {
    setCurrentGroupId(grpId);
    if (!checked) {
      const resetData = questionGroups.filter((item) => item.question_group_id.id === grpId);
      const data = prepareResetData(resetData);
      prepareResetUpdateData(resetData);
      if (data && data.length) {
        let payload = {
          tracker_lines: data,
        };
        const catList = slaAuditSummary && slaAuditSummary.data ? slaAuditSummary.data.filter((item) => item.question_group_id && item.question_group_id.id === grpId) : [];
        if (catList && catList.length) {
          payload = {
            tracker_lines: data, indicator_logs: [[1, catList[0].id, { is_notapplicable: true }]],
          };
        }
        dispatch(updateSlaAudit(inspDeata.id, appModels.SLAAUDIT, payload));
        setQuestionGroups(questionGroups);
      }
    } else if (checked) {
      const catList = slaAuditSummary && slaAuditSummary.data ? slaAuditSummary.data.filter((item) => item.question_group_id && item.question_group_id.id === grpId) : [];
      if (catList && catList.length) {
        const payload = {
          indicator_logs: [[1, catList[0].id, { is_notapplicable: false }]],
        };
        dispatch(updateSlaAudit(inspDeata.id, appModels.SLAAUDIT, payload));
      }
    }
    setDataType('toggle');
  }; */

  function getDateValue(value) {
    let dateValue = '';
    if (value) {
      const firstConv = new Date(getDateTimeSeconds(value));
      dateValue = moment(new Date(firstConv), getDatePickerFormat(userInfo, 'date'));
    }

    return dateValue;
  }

  function getDateValueView(value) {
    let dateValue = '';
    if (value) {
      const firstConv = new Date(getDateTimeSeconds(value));
      dateValue = moment(firstConv).format(getDatePickerFormat(userInfo, 'date'));
    }

    return dateValue;
  }

  function getInputValue(qtn) {
    let res = '';
    if (qtn.is_not_applicable) {
      res = 'N/A';
    } else if (qtn.mro_activity_id.type === 'Computed' && qtn.mro_activity_id.calculation_type === 'Fixed') {
      res = qtn.mro_activity_id.fixed_value;
    } else if (qtn.answer && !qtn.is_not_applicable) {
      res = qtn.answer;
    }
    return res;
  }

  // function getInputValueNumerical(qtn) {
  //   let res = '';
  //   const decimalPrecision = qtn.mro_activity_id.decimal_accuracy_id && qtn.mro_activity_id.decimal_accuracy_id?.name === 'Consumption Tracker' ? qtn.mro_activity_id.decimal_accuracy_id.digits : 2;
  //   console.log(decimalPrecision);
  //   console.log(qtn);
  //   if (qtn.is_not_applicable) {
  //     res = 'N/A';
  //   } else if (qtn.answer && !qtn.is_not_applicable) {
  //     const answer = qtn.answer;
  //     res = answer !== '' && typeof answer === 'number' && !isNaN(answer) ? parseFloat(answer).toFixed(decimalPrecision) : answer;
  //   }
  //   return res;
  // }

  const handleDateInputChange = (dateString, checklist) => {
    const value = dateString || ''; // dateString ? moment(new Date(getDateTimeSeconds(dateString))).format(getDatePickerFormat(userInfo, 'date')) : '';
    const displayValue = dateString || '';
    const field = 'answer';
    setDataType('date');
    const storeData = [];
    const detailIndex = questionGroups.findIndex((obj) => (obj.id === checklist.id));
    if (value) {
      questionGroups[detailIndex][field] = displayValue;
      setLoadAns(Math.random());
      const payload = {
        tracker_lines: [[1, checklist.id, { answer: value }]],
      };

      const sRecs = [...savedRecords, ...[{
        id: checklist.id, answer: value, value, type: checklist.mro_activity_id.type, is_update: 'start',
      }]];
      const uniSRecs = [...new Map(sRecs.map((item) => [item.id, item])).values()];
      setSavedRecords(uniSRecs);
      setSavedQuestions(uniSRecs);

      // storeData = [{ id: checklist.id, answer: value, value }];

      /* if (checklist.target) {
        const d = new Date();
        const month = d.getMonth() + 1;
        const year = d.getFullYear();
        let monthValue = month > 9 ? month : `0${month}`;
        if (checklist.mro_activity_id.for_month === 'Next') {
          const nMon = month + 1;
          monthValue = nMon > 9 ? nMon : `0${nMon}`;
        }
        const day = checklist.target > 9 ? checklist.target : `0${checklist.target}`;
        const targetDate = new Date(`${year}-${monthValue}-${day}`);
        const noOfdays = getDiiffNoOfDays(new Date(value), targetDate);
        console.log(noOfdays);
        const rangeScore = getRangeScore(noOfdays, checklist.mro_activity_id.metric_id && checklist.mro_activity_id.metric_id.scale_line_ids ? checklist.mro_activity_id.metric_id.scale_line_ids : []);
        payload = {
          tracker_lines: [[1, checklist.id, { answer: value, achieved_score: rangeScore }]],
        };
        questionGroups[detailIndex].achieved_score = rangeScore;
        setLoadAns(Math.random());
      } */
      // dispatch(updateCt(inspDeata.id, appModels.CONSUMPTIONTRACKER, payload));
      setQuestionGroups(questionGroups);
    } else {
      const payload = {
        tracker_lines: [[1, checklist.id, { answer: '' }]],
      };
      questionGroups[detailIndex].answer = '';
      // questionGroups[detailIndex].achieved_score = '';
      // dispatch(updateCt(inspDeata.id, appModels.CONSUMPTIONTRACKER, payload));
      setLoadAns(Math.random());
      setQuestionGroups(questionGroups);
      // storeData = [{ id: checklist.id, answer: '', value: '' }];

      const sRecs = [...savedRecords, ...[{
        id: checklist.id, answer: '', value: '', type: checklist.mro_activity_id.type, is_update: 'start',
      }]];
      const uniSRecs = [...new Map(sRecs.map((item) => [item.id, item])).values()];
      setSavedRecords(uniSRecs);
      setSavedQuestions(uniSRecs);
    }
    // saveRecordbyInput(storeData);
  };

  function getTargetDate(checklist) {
    let res = checklist.target;
    if (checklist.target) {
      const d = new Date();
      const month = d.getMonth() + 1;
      const year = d.getFullYear();
      let monthValue = month > 9 ? month : `0${month}`;
      if (checklist.mro_activity_id.for_month === 'Next') {
        const nMon = month + 1;
        monthValue = nMon > 9 ? nMon : `0${nMon}`;
      }
      const day = checklist.target > 9 ? checklist.target : `0${checklist.target}`;
      const resValue = new Date(`${year}-${monthValue}-${day}`);
      res = moment(resValue).format(getDatePickerFormat(userInfo, 'date'));
    }
    return res;
  }

  function getFiiledClassName(answer, type) {
    let res = '';
    if (type === 'Computed') {
      res = 'computed-filled';
    } else if (answer && type !== 'Computed') {
      res = 'filled';
    }
    return res;
  }

  const preventPaste = (e) => {
    alert('Copying and pasting is not allowed!');
    e.preventDefault();
  };

  const onOpenAttachment = (id, name) => {
    setCurrentId(id);
    setCurrentName(name);
    setAttachmentModal(true);
  };

  function getSortedNestesArray(arr) {
    let res = [];
    if (arr) {
      res = arr.sort((a, b) => a[0].question_group_id.sequence - b[0].question_group_id.sequence);
    }
    return res;
  }

  function decimalKeyPressDown(e, maxDecimalPlaces = 2) {
    const { value } = e.target;
    const isDecimalKey = e.key === '.' || e.code === 'NumpadDecimal'; // Handle both '.' and NumpadDecimal
    const hasDecimalPoint = value.includes('.');

    // Allow essential control keys
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter'];
    const isControlKey = allowedKeys.includes(e.key)
      || e.key.startsWith('Arrow')
      || (e.ctrlKey || e.metaKey); // Handle copy-paste or Ctrl+Key shortcuts

    // Check if it's a numeric key or a numpad number
    const isNumericKey = (e.key >= '0' && e.key <= '9') // Regular number keys
      || (e.code.includes('Numpad') && e.key >= '0' && e.key <= '9'); // Numpad number keys

    // Allow control keys (Backspace, Delete, etc.)
    if (isControlKey) {
      return true;
    }

    // Allow numeric keys and restrict decimal precision
    if (isNumericKey) {
      if (hasDecimalPoint) {
        const decimalPart = value.split('.')[1];
        if (decimalPart && decimalPart.length >= maxDecimalPlaces) {
          e.preventDefault(); // Prevent entering more digits than allowed decimal places
          return false;
        }
      }
      return true;
    }

    // Allow a single decimal point
    if (isDecimalKey && !hasDecimalPoint) {
      return true;
    }

    // Prevent all other keys
    e.preventDefault();
    return false;
  }

  function getRow(assetDataList, groupId) {
    const tableTr = [];
    let gId = false;
    if (groupId) {
      gId = groupId;
    }

    const assetData = assetDataList.sort((a, b) => a.mro_activity_id.sequence - b.mro_activity_id.sequence);

    const grpQtns = assetDataList.filter((item) => item.question_group_id && item.question_group_id.id === gId);

    for (let i = 0; i < assetData.length; i += 1) {
      if (assetData[i].question_group_id && assetData[i].question_group_id.id && assetData[i].question_group_id.id === gId) {
        tableTr.push(
          <td className="p-2" key={assetData[i].mro_activity_id.name}>
            {inspDeata.state === 'Draft'
              ? (
                <>
                  {assetData[i].mro_activity_id.type !== 'simple_choice' && assetData[i].mro_activity_id.type !== 'multiple_choice' && assetData[i].mro_activity_id.type !== 'boolean' && assetData[i].mro_activity_id.type !== 'date' && (

                    <div className={assetData[i].mro_activity_id.measured_placeholder || assetData[i].mro_activity_id.type === 'Computed' ? 'input-container' : 'input-container1'}>
                      <Input
                        type={getInputType(assetData[i].mro_activity_id.type)}
                        className={assetData[i].mro_activity_id.type === 'Computed' ? 'm-0 position-relative computed-input' : 'm-0 position-relative'}
                        name="answerValue"
                        autoComplete="off"
                        onPaste={(e) => preventPaste(e)}
                        disabled={(assetData[i].mro_activity_id.type === 'Computed') || (assetData[i].is_not_applicable)}
                        maxLength={getmaxLength(assetData[i].mro_activity_id.type, assetData[i].mro_activity_id)}
                        required={assetData[i].mro_activity_id && assetData[i].mro_activity_id.constr_mandatory}
                        // onKeyPress={assetData[i].mro_activity_id.type === 'numerical_box' ? decimalKeyPress : ''}
                        onKeyDown={(e) => (assetData[i].mro_activity_id.type === 'numerical_box' ? decimalKeyPressDown(e, assetData[i].mro_activity_id.decimal_accuracy_id && assetData[i].mro_activity_id.decimal_accuracy_id?.digits ? assetData[i].mro_activity_id.decimal_accuracy_id.digits : consumptionTrackerdpGlobal) : '')}
                        value={getInputValue(assetData[i])}
                        onBlur={(e) => (handleInputChange(e, assetData[i], grpQtns, gId))}
                        onChange={(e) => (handleInputKeyChange(e, assetData[i]))}
                      />
                      {assetData[i].mro_activity_id.measured_placeholder && assetData[i].mro_activity_id.measured_placeholder.length > 52 && (
                        <Tooltip title={assetData[i].mro_activity_id.measured_placeholder}>
                          <label className={getFiiledClassName(assetData[i].answer, assetData[i].mro_activity_id.type)} htmlFor="answerValue">
                            {truncate(assetData[i].mro_activity_id.measured_placeholder, 52)}
                          </label>
                        </Tooltip>
                      )}
                      {assetData[i].mro_activity_id.measured_placeholder && assetData[i].mro_activity_id.measured_placeholder.length < 52 && (
                        <label className={getFiiledClassName(assetData[i].answer, assetData[i].mro_activity_id.type)} htmlFor="answerValue">
                          {assetData[i].mro_activity_id.measured_placeholder}
                        </label>
                      )}
                    </div>
                  )}
                  {assetData[i].mro_activity_id.type === 'date' && (
                    <DatePicker
                      value={assetData[i].answer ? getDateValue(assetData[i].answer) : ''}
                      format={getDatePickerFormat(userInfo, 'date')}
                      disabled={assetData[i].is_not_applicable}
                      placeholder={assetData[i].mro_activity_id.measured_placeholder ? assetData[i].mro_activity_id.measured_placeholder : ''}
                      onChange={(date, dateString) => (handleDateInputChange(date, assetData[i]))}
                    />
                  )}
                </>
              )
              : (
                <>
                  {assetData[i].mro_activity_id.type !== 'simple_choice' && assetData[i].mro_activity_id.type !== 'multiple_choice' && assetData[i].mro_activity_id.type !== 'boolean' && assetData[i].mro_activity_id.type !== 'date' ? (
                    <div className={assetData[i].mro_activity_id.measured_placeholder || assetData[i].mro_activity_id.type === 'Computed' ? 'input-container' : 'input-container1'}>
                      <Input
                        type={getInputType(assetData[i].mro_activity_id.type)}
                        className={assetData[i].mro_activity_id.type === 'Computed' ? 'm-0 position-relative computed-input' : 'm-0 position-relative'}
                        name="answerValue"
                        autoComplete="off"
                        value={getInputValue(assetData[i])}
                        disabled
                      />
                      {assetData[i].mro_activity_id.measured_placeholder && assetData[i].mro_activity_id.measured_placeholder.length > 52 && (
                        <Tooltip title={assetData[i].mro_activity_id.measured_placeholder}>
                          <label className={getFiiledClassName(assetData[i].answer, assetData[i].mro_activity_id.type)} htmlFor="answerValue">
                            {truncate(assetData[i].mro_activity_id.measured_placeholder, 52)}
                          </label>
                        </Tooltip>
                      )}
                      {assetData[i].mro_activity_id.measured_placeholder && assetData[i].mro_activity_id.measured_placeholder.length < 52 && (
                        <label className={getFiiledClassName(assetData[i].answer, assetData[i].mro_activity_id.type)} htmlFor="answerValue">
                          {assetData[i].mro_activity_id.measured_placeholder}
                        </label>
                      )}
                    </div>
                  )
                    : (
                      <div className={assetData[i].mro_activity_id.measured_placeholder ? 'input-container' : 'input-container1'}>
                        <Input
                          type="text"
                          className="m-0 position-relative"
                          name="answerValue"
                          autoComplete="off"
                          value={assetData[i].answer ? getDateValueView(assetData[i].answer) : ''}
                          disabled
                        />
                        {assetData[i].mro_activity_id.measured_placeholder && assetData[i].mro_activity_id.measured_placeholder.length > 52 && (
                          <Tooltip title={assetData[i].mro_activity_id.measured_placeholder}>
                            <label className={assetData[i].answer ? 'filled' : ''} htmlFor="answerValue">
                              {truncate(assetData[i].mro_activity_id.measured_placeholder, 52)}
                            </label>
                          </Tooltip>
                        )}
                        {assetData[i].mro_activity_id.measured_placeholder && assetData[i].mro_activity_id.measured_placeholder.length < 52 && (
                          <label className={assetData[i].answer ? 'filled' : ''} htmlFor="answerValue">
                            {assetData[i].mro_activity_id.measured_placeholder}
                          </label>
                        )}
                      </div>
                    )}
                </>
              )}
          </td>,
        );
      }
    }
    return tableTr;
  }

  function getQtnsCount(assetData, groupId, type) {
    let gId = false;
    let res = 0;
    if (groupId) {
      gId = groupId;
    }
    const assetDataList = assetData.filter((item) => item.question_group_id.id === groupId);
    if (type === 'total') {
      const assetApplicableQtns = assetDataList.filter((item) => !item.is_not_applicable && item.mro_activity_id.type !== 'Computed');
      res = assetApplicableQtns && assetApplicableQtns.length ? assetApplicableQtns.length : 0;
    } else if (type === 'answer' && assetDataList && assetDataList.length) {
      const assetDataAnsList = assetDataList.filter((item) => !item.is_not_applicable && item.answer && item.mro_activity_id.type !== 'Computed');
      res = assetDataAnsList && assetDataAnsList.length ? assetDataAnsList.length : 0;
    }
    return res;
  }

  function getCatQtnsCount(assetData, groupId, type) {
    let gId = false;
    let res = 0;
    if (groupId) {
      gId = groupId;
    }
    const assetDataList = assetData.filter((item) => item.category_id.id === groupId);
    if (type === 'total') {
      /* const unApplicableData = performanceLogs ? performanceLogs.filter((item) => item.category_id.id === groupId && item.is_notapplicable) : [];
      const unApplicableQtnGrps = unApplicableData && unApplicableData.length ? getColumnArrayByField(unApplicableData, 'question_group_id', 'id') : [];
      const qtnCatData = inspDeata && inspDeata.tracker_lines ? inspDeata.tracker_lines.filter((item) => item.category_id && item.category_id.id === groupId) : [];
      const unApplicableQtns = qtnCatData && qtnCatData.length && unApplicableQtnGrps && unApplicableQtnGrps.length ? getArrayFromValuesMultByIdIn(qtnCatData, unApplicableQtnGrps, 'question_group_id', 'id') : [];
      const unApplicableCount = unApplicableQtns && unApplicableQtns.length; */
      const assetApplicableQtns = assetDataList.filter((item) => !item.is_not_applicable && item.mro_activity_id.type !== 'Computed');
      res = assetApplicableQtns && assetApplicableQtns.length ? assetApplicableQtns.length : 0;// assetDataList && assetDataList.length ? assetDataList.length - unApplicableCount : 0;
    } else if (type === 'answer' && assetDataList && assetDataList.length) {
      const assetDataAnsList = assetDataList.filter((item) => !item.is_not_applicable && item.answer && item.mro_activity_id.type !== 'Computed');
      res = assetDataAnsList && assetDataAnsList.length ? assetDataAnsList.length : 0;
    }
    return res;
  }

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

  function getArrayNewFormat(arr, key, ids) {
    const newArray = [];
    const array = arr.filter((item) => item.is_update === 'start');
    if (ids && ids.length) {
      for (let i = 0; i < array.length; i += 1) {
        const value = array[i].id;
        if (ids && (ids.indexOf(value) !== -1)) {
          newArray.push({
            id: array[i].id, answer: array[i].answer, value: array[i].answer, type: array[i].type, is_update: key,
          });
        }
      }
    } else {
      for (let i = 0; i < array.length; i += 1) {
        newArray.push({
          id: array[i].id, answer: array[i].answer, value: array[i].answer, type: array[i].type, is_update: key,
        });
      }
    }
    return newArray;
  }

  useEffect(() => {
    if (updateCtInfo && updateCtInfo.data) {
      const catLastDate = [{ category_id: categoryId, last_updated: getLocalTime(new Date()) }];
      const arr = [...lastUpdated, ...catLastDate];
      setLastUpdated([...new Map(arr.map((item) => [item.category_id, item])).values()]);
      setExtraLoad('yes');
      setSavedRecords(getArrayNewFormat(savedRecords, 'success', updateCtInfo.data));
      setSavedQuestions(getArrayNewFormat(savedRecords, 'success', updateCtInfo.data));
      setTimeout(() => {
        setExtraLoad('no');
      }, 1500);
    } else if (updateCtInfo && updateCtInfo.err) {
      setExtraLoad('yes');
      setSavedRecords(getArrayNewFormat(savedRecords, 'failed'));
      setSavedQuestions(getArrayNewFormat(savedRecords, 'failed'));
      setTimeout(() => {
        setExtraLoad('no');
      }, 1500);
    }
  }, [updateCtInfo]);

  function getLastUpdated() {
    let res = '';
    const lastDataList = lastUpdated && lastUpdated.length ? lastUpdated.filter((item) => item.category_id === categoryId) : [];
    if (lastDataList && lastDataList.length) {
      res = lastDataList[0].last_updated;
    }
    return res;
  }

  return (
    <>
      {(!loading && isChecklist) && (
        <>
          <Row>
            <Col md={12} sm={12} xs={12} lg={12}>
              { /* getPendingQtns() && !(updateCtInfo && updateCtInfo.loading) && (
              <Alert color="warning" className="mt-2 position-sticky">
                <Tooltip title="Info">
                  <span className="text-info cursor-pointer">
                    <FontAwesomeIcon className="mr-2 custom-fav-icon" size="sm" icon={faInfoCircle} />
                  </span>
                </Tooltip>
                Preparing...
              </Alert>
              )}
              {(updateCtInfo && updateCtInfo.loading) && (
              <Alert color="warning" className="mt-2 position-sticky">
                <Tooltip title="Info">
                  <span className="text-info cursor-pointer">
                    <FontAwesomeIcon className="mr-2 custom-fav-icon" size="sm" icon={faInfoCircle} />
                  </span>
                </Tooltip>
                Saving...
              </Alert>
              ) */ }
              {(getFailedQtns()) && (
                <Alert color="warning" className="mt-2 position-sticky">
                  <Tooltip title="Info">
                    <span className="text-info cursor-pointer">
                      <FontAwesomeIcon className="mr-2 custom-fav-icon" size="sm" icon={faInfoCircle} />
                    </span>
                  </Tooltip>
                  Unsaved questions are pending.Click here to
                  <span aria-hidden onClick={() => onUnsavedUpdate()} className="ml-2 cursor-pointer text-info">
                    Update
                    {' '}

                  </span>
                </Alert>
              )}
            </Col>
          </Row>
          <Row>
            <Col md={3} sm={12} xs={12} lg={3} className="sticky-filter thin-scrollbar">
              {(categories && categories.length > 1) && categories.map((cat) => (
                <div
                  key={cat[0].category_id}
                  aria-hidden
                  onClick={() => setCategoryId(cat[0].category_id.id)}
                  className={categoryId === cat[0].category_id.id ? 'p-2 bg-white cursor-pointer' : 'p-2 cursor-pointer'}
                >
                  <p
                    className={categoryId === cat[0].category_id.id ? 'font-weight-800 m-0' : 'font-weight-500 m-0'}
                  >
                    {getCatQtnsCount(
                      inspDeata.tracker_lines,
                      cat && cat[0].category_id && cat[0].category_id.id ? cat[0].category_id.id : '',

                      'answer',
                    ) === 0
                      ? <img src={notStarted} height="26" width="26" className="width-26px mr-2" alt="notStarted" />
                      : getCatQtnsCount(
                        inspDeata.tracker_lines,
                        cat && cat[0].category_id && cat[0].category_id.id ? cat[0].category_id.id : '',

                        'answer',
                      ) !== getCatQtnsCount(
                        inspDeata.tracker_lines,
                        cat && cat[0].category_id && cat[0].category_id.id ? cat[0].category_id.id : '',

                        'total',
                      )
                        ? <img src={inProgress} className="height-15 mr-2" alt="inprogress" />
                        : <img src={fullyAssignIcon} className="height-15 mr-2" alt="completed" />}
                    {cat[0].category_id && cat[0].category_id.name ? cat[0].category_id.name : ''}
                    <p className="float-right font-weight-800 m-0">
                      {`(${getCatQtnsCount(
                        inspDeata.tracker_lines,
                        cat && cat[0].category_id && cat[0].category_id.id ? cat[0].category_id.id : '',

                        'answer',
                      )} / 
                    ${getCatQtnsCount(
                        inspDeata.tracker_lines,
                        cat && cat[0].category_id && cat[0].category_id.id ? cat[0].category_id.id : '',

                        'total',
                      )})`}

                      {categoryId === cat[0].category_id.id && (
                        <FontAwesomeIcon className={getLastUpdated() ? 'font-weight-800 ml-1 mt-2' : 'font-weight-800 ml-1'} size="md" icon={faAngleRight} />
                      )}
                    </p>
                    {categoryId === cat[0].category_id.id && getLastUpdated() && (
                      <p className="font-size-10px font-weight-400 mb-0 mt-0 ml-4 pl-1">
                        Last Updated On:
                        {' '}
                        {getLastUpdated()}
                      </p>
                    )}
                  </p>
                </div>
              ))}
            </Col>
            <Col md={categories && categories.length > 1 ? 9 : 12} sm={12} xs={12} lg={categories && categories.length > 1 ? 9 : 12} className="sticky-filter thin-scrollbar">
              <Spin spinning={!!(((updateCtInfo && updateCtInfo.loading) || (extraLoad === 'yes')))}>
                <div className="ml-0">
                  {(accordion.length > 0) && (sections && sections.length > 0) && getSortedNestesArray(sections).map((section, index) => (
                    <div
                      id="accordion"
                      className="accordion-wrapper mb-3 border-0"
                      key={section[0].question_group_id && section[0].question_group_id.id ? section[0].question_group_id.id : ''}
                    >
                      <Card>
                        <CardHeader id={`heading${index}`} className="p-2 transparent-header border-0">
                          <Button
                            block
                            color="text-dark"
                            id={`heading${index}`}
                            className="text-left m-0 p-0 border-0 box-shadow-none"
                            onClick={() => toggleAccordion(index)}
                            aria-expanded={accordion[index]}
                            aria-controls={`collapse${index}`}
                          >
                            <span className="collapse-heading font-weight-800">
                              {section && section[0].question_group_id && section[0].question_group_id.name ? section[0].question_group_id.name : 'General'}
                              {' '}
                              {section && section[0].question_group_id && section[0].question_group_id.remarks && (
                                <Tooltip title={section[0].question_group_id.remarks}>
                                  <span className="text-info cursor-pointer">
                                    <FontAwesomeIcon className="ml-1" size="sm" icon={faInfoCircle} />
                                  </span>
                                </Tooltip>
                              )}
                              {section && section[0].question_group_id && section[0].question_group_id.weightage > 0 && (
                                <Tooltip title="Weightage %">
                                  <span className="ml-2">
                                    (
                                    {section[0].question_group_id.weightage}
                                    % )
                                  </span>
                                </Tooltip>
                              )}
                              { /* inspDeata.state === 'Draft' && (
                          <Switch
                            className="ml-2"
                            onChange={(checked) => handleCheckboxChange(checked, section[0].question_group_id.id)}
                            checkedChildren="Applicable"
                            unCheckedChildren="Not-Applicable"
                            loading={(currentGroupId === section[0].question_group_id.id) && updateSlaAuditInfo && updateSlaAuditInfo.loading && dataType && dataType === 'toggle'}
                            checked={!checkIsApplicable(section[0].question_group_id.id)}
                          />
                          ) */ }
                            </span>
                            <span className="float-right font-weight-800">

                              {`(${getQtnsCount(
                                questionGroups,
                                section && section[0].question_group_id && section[0].question_group_id.id ? section[0].question_group_id.id : '',

                                'answer',
                              )} / 
                    ${getQtnsCount(
                                questionGroups,
                                section && section[0].question_group_id && section[0].question_group_id.id ? section[0].question_group_id.id : '',

                                'total',
                              )})`}

                              {accordion[index]
                                ? <FontAwesomeIcon className="ml-2 font-weight-800" size="lg" icon={faAngleUp} />
                                : <FontAwesomeIcon className="ml-2 font-weight-800" size="lg" icon={icon} />}
                            </span>
                          </Button>
                        </CardHeader>

                        <Collapse
                          isOpen={accordion[index]}
                          data-parent="#accordion"
                          id={`collapse${index}`}
                          className="border-0 med-form-content thin-scrollbar"
                          aria-labelledby={`heading${index}`}
                        >
                          <Row className="mr-2 ml-2 mb-0 products-list-tab">
                            {isChecklist && (
                              <>
                                <Table responsive className="mb-0 mt-2 font-weight-400 border-0 assets-table static-width-table" width="100%">
                                  <thead>
                                    <tr>
                                      {(section && section.length > 0) && (questionGroups && questionGroups.length > 0) && getSortedArray(questionGroups).map((qtn) => (
                                        qtn.question_group_id && qtn.question_group_id.id && qtn.question_group_id.id === section[0].question_group_id.id && (
                                          <th
                                            className="p-2 min-width-160"
                                            key={qtn.mro_activity_id.id}
                                            onMouseLeave={() => setCurrentHoverId(false)}
                                            onMouseEnter={() => setCurrentHoverId(qtn.id)}
                                          >
                                            {getDefaultNoValue(qtn.mro_activity_id && qtn.mro_activity_id.name ? qtn.mro_activity_id.name : '')}
                                            {qtn.mro_activity_id && qtn.mro_activity_id.data_source && (
                                              <Tooltip title={qtn.mro_activity_id.data_source}>
                                                <span className="text-info cursor-pointer">
                                                  <img alt="dataSourceIcon" className="ml-1" height="13" width="13" src={dataSourceIcon} />
                                                </span>
                                              </Tooltip>
                                            )}
                                            {qtn.mro_activity_id && qtn.mro_activity_id.has_attachment && inspDeata.state === 'Draft' && (
                                              <Tooltip title="Attachments">
                                                <span className="text-info cursor-pointer">
                                                  <img
                                                    aria-hidden
                                                    alt="uploadPhotoBlue"
                                                    className="ml-2"
                                                    onClick={() => onOpenAttachment(qtn.id, qtn.mro_activity_id && qtn.mro_activity_id.name ? qtn.mro_activity_id.name : '')}
                                                    height="14"
                                                    width="14"
                                                    src={uploadPhotoBlue}
                                                  />
                                                </span>
                                              </Tooltip>
                                            )}

                                            {inspDeata.state === 'Draft' && qtn.mro_activity_id.type !== 'Computed' && (currentHoverId === qtn.id) && (
                                              <>
                                                <br />
                                                <Switch
                                                  className="ml-2 custom-ant-switch"
                                                  onChange={(checked) => handleCheckboxChange(checked, qtn, section[0].question_group_id.id)}
                                                  checkedChildren="Applicable"
                                                  unCheckedChildren="Not-Applicable"
                                                  // loading={(currentGroupId === section[0].question_group_id.id) && updateSlaAuditInfo && updateSlaAuditInfo.loading && dataType && dataType === 'toggle'}
                                                  checked={!qtn.is_not_applicable}
                                                />
                                              </>
                                            )}
                                          </th>
                                        )
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      {getRow(
                                        questionGroups,
                                        section && section[0].question_group_id && section[0].question_group_id.id ? section[0].question_group_id.id : '',
                                      )}
                                    </tr>
                                  </tbody>
                                </Table>
                                <hr className="m-0" />
                              </>
                            )}
                          </Row>
                        </Collapse>
                      </Card>

                    </div>
                  ))}
                </div>
              </Spin>
            </Col>
            <Modal size="xl" className="border-radius-50px modal-dialog-centered searchData-modalwindow" isOpen={attachmentModal}>
              <ModalHeaderComponent title={currentName} imagePath={false} closeModalWindow={() => { setAttachmentModal(false); }} />
              <ModalBody className="mt-0 pt-0">
                <Documents
                  viewId={currentId}
                  reference={currentName}
                  resModel={appModels.TRACKERLINE}
                  model={appModels.DOCUMENT}
                />
              </ModalBody>
            </Modal>
          </Row>
        </>
      )}
      {loading && (
        <div className="loader" data-testid="loading-case">
          <Loader />
        </div>
      )}
      {isErr && (
        <ErrorContent errorTxt={generateErrorMessage(detailData && detailData.err ? detailData.err : 'No Data Found')} />
      )}
      {!isErr && inspDeata && !isChecklist && !loading && (
        <ErrorContent errorTxt="No Data Found" />
      )}
    </>
  );
};

Checklists.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
};

export default Checklists;
