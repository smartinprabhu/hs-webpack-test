/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */
/* eslint-disable radix */
/* eslint-disable no-loop-func */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import {
  faAngleDown,
  faAngleRight,
  faAngleUp,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Dialog,
  DialogContent, DialogContentText, DialogActions,
} from '@mui/material';
import {
  Radio, Spin, Switch,
} from 'antd';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Tooltip from '@mui/material/Tooltip';
import moment from 'moment';
import * as PropTypes from 'prop-types';
import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Alert,
  Button, Card, CardHeader,
  Col,
  Collapse,
  Input,
  Row,
  Table,
  Label,
} from 'reactstrap';
import ButtonMUI from '@mui/material/Button';

import fullyAssignIcon from '@images/icons/fullyAssign.png';
import inProgress from '@images/icons/inProgressNoCircle.svg';
import notStarted from '@images/inspection/notStarted.svg';
import dataSourceIcon from '@images/slaAudit/dataSourceIcon.svg';
import uploadPhotoBlue from '@images/uploadPhotoBlue.svg';
import workOrdersBlue from '@images/workOrders.svg';

import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';
import MuiToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import dayjs from 'dayjs';
import { styled } from '@mui/material/styles';
import DialogHeader from '../../commonComponents/dialogHeader';

import Documents from '../../commonComponents/documents';
import {
  decimalKeyPressDown,
  generateErrorMessage,
  getArrayFromValuesMultByIdIn,
  getColumnArrayByField,
  getComputedValidAnswer,
  getDatePickerFormat,
  getDateTimeSeconds,
  getDefaultNoValue,
  getDiiffNoOfDays,
  getFormulaResultV2,
  getLocalTime,
  numToValidFloatView,
  truncate,
} from '../../util/appUtils';
import { groupByMultiple } from '../../util/staticFunctions';
import {
  getSlaAuditDetail, getSlaAuditPerformaceDetails, updateSlaAudit, updateSlaAuditNoLoad,
} from '../auditService';

import { AddThemeColor } from '../../themes/theme';

const appModels = require('../../util/appModels').default;

const ToggleButton = styled(MuiToggleButton)(({ selectedColor }) => ({
  '&.Mui-selected, &.Mui-selected:hover': {
    color: 'white',
    backgroundColor: selectedColor,
    textTransform: 'capitalize',
  },
  '&.Mui-disabled': {
    textTransform: 'capitalize',
  },
}));

const Checklists = (props) => {
  const {
    detailData,
    setQuestionGroupsGlobal,
    setSavedQuestions,
  } = props;

  const dispatch = useDispatch();

  const [accordion, setAccordian] = useState([]);
  const [icon, setIcon] = useState(faAngleDown);

  const [questionGroups, setQuestionGroups] = useState([]);
  const [categoryId, setCategoryId] = useState([]);

  const [lastUpdated, setLastUpdated] = useState([]);
  const [performanceLogs, setPerformanceLogs] = useState([]);

  const [attachmentModal, setAttachmentModal] = useState(false);
  const [currentId, setCurrentId] = useState(false);
  const [currentName, setCurrentName] = useState(false);

  const [loadAns, setLoadAns] = useState(false);

  const [dataType, setDataType] = useState('');

  const [isViewRemarks, setViewRemarks] = useState(false);
  const [qtnRemarksModal, setQtnRemarksModal] = useState(false);
  const [currentGroup, setCurrentGroup] = useState(false);
  const [currentRemarks, setCurrentRemarks] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState(false);

  const [currentGroupId, setCurrentGroupId] = useState('');

  const [savedRecords, setSavedRecords] = useState([]);

  const [extraLoad, setExtraLoad] = useState('no');

  const [isTimer, setTimer] = useState(false);
  const [fetchTime, setFetchTime] = useState(false);

  const {
    updateSlaAuditInfo, slaAuditSummary, slaAuditConfig, updateSlaAuditNoInfo,
  } = useSelector((state) => state.slaAudit);
  const { userInfo } = useSelector((state) => state.user);

  const hasTarget = !!(slaAuditConfig && slaAuditConfig.data && slaAuditConfig.data.length && slaAuditConfig.data[0].has_target);

  const isMultipleEvaluation = hasTarget && !!(slaAuditConfig && slaAuditConfig.data && slaAuditConfig.data.length && slaAuditConfig.data[0].is_multiple_evaluation);

  const loading = detailData && detailData.loading;
  const isErr = detailData && detailData.err;
  const inspDeata = detailData && detailData.data && detailData.data.length ? detailData.data[0] : false;
  const isChecklist = (inspDeata && inspDeata.sla_audit_lines && inspDeata.sla_audit_lines.length > 0);

  const stages = useMemo(() => (isMultipleEvaluation && inspDeata && inspDeata.stage_ids && inspDeata.stage_ids.length ? inspDeata.stage_ids : []), [inspDeata, slaAuditConfig]);

  const evaluators = stages && stages.length > 0 ? stages.flatMap((item) => item.evaluators_ids) : [];

  const getCurrentStageData = () => {
    if (!isMultipleEvaluation || !Array.isArray(stages) || stages.length === 0) {
      return false;
    }

    const seqData = [...stages].sort((a, b) => a.sequence - b.sequence); // avoid mutating original
    const pendingStage = seqData.find((item) => item.state === 'Pending');

    if (!pendingStage) {
      return false;
    }

    return pendingStage;
  };

  const getCurrentStage = (id) => {
    if (!isMultipleEvaluation || !Array.isArray(stages) || stages.length === 0) {
      return false;
    }

    const seqData = [...stages].sort((a, b) => a.sequence - b.sequence); // avoid mutating original
    const pendingStage = seqData.find((item) => item.state === 'Pending');

    if (!pendingStage || !Array.isArray(pendingStage.evaluators_ids)) {
      return false;
    }

    return pendingStage.evaluators_ids.some((ev) => ev.id === id);
  };

  const isFinalStage = () => {
    if (!isMultipleEvaluation || !Array.isArray(stages) || stages.length === 0) {
      return false;
    }

    const sortedStages = [...stages].sort((a, b) => b.sequence - a.sequence); // descending order
    const finalStage = sortedStages[0];
    const currentStage = stages.find((s) => s.state === 'Pending');

    return currentStage?.stage_id?.id === finalStage?.stage_id?.id;
  };


  const sortCategories = (dataSections) => {
    dataSections = dataSections.sort((a, b) => a[0].sla_category_id.sequence - b[0].sla_category_id.sequence);
    return dataSections;
  };

  const sortSections = (dataSections) => {
    dataSections = dataSections.sort((a, b) => a[0].question_group_id.sequence - b[0].question_group_id.sequence);
    return dataSections;
  };
  const sections = isChecklist > 0 ? sortSections(groupByMultiple(questionGroups, (obj) => (obj.question_group_id && obj.question_group_id.id ? obj.question_group_id.id : ''))) : [];

  const categories = isChecklist > 0 ? groupByMultiple(inspDeata.sla_audit_lines, (obj) => (obj.sla_category_id && obj.sla_category_id.id ? obj.sla_category_id.id : '')) : [];

  const getinitial = () => {
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

  function saveRecordbyTime() {
    let newData = [];
    const trackerLines = [];

    const savingsRecords = [...new Map(savedRecords.map((item) => [item.id, item])).values()];

    const answeredQtns = savingsRecords.filter((item) => item.is_update === 'start');

    if (answeredQtns.length) {
      for (let i = 0; i < answeredQtns.length; i += 1) {
        if (answeredQtns[i].ans_type === 'target') {
          newData = [1, answeredQtns[i].id, { target: answeredQtns[i].target ? parseFloat(answeredQtns[i].target) : 0.00, achieved_score: getComputedValidAnswer(answeredQtns[i].achieved_score) }];
        } else if (answeredQtns[i].ans_type === 'evaluation') {
          newData = [1, answeredQtns[i].evId, { audit_line: { id: answeredQtns[i].id, answer: answeredQtns[i].answer ? answeredQtns[i].answer.toString() : '', achieved_score: getComputedValidAnswer(answeredQtns[i].achieved_score) }, measured_value: answeredQtns[i].measuredValue ? parseFloat(answeredQtns[i].measuredValue) : 0.00 }];
        } else {
          newData = [1, answeredQtns[i].id, { answer: answeredQtns[i].answer, achieved_score: getComputedValidAnswer(answeredQtns[i].achieved_score) }];
        }
        trackerLines.push(newData);
      }
      const payloadValues = {
        lines: trackerLines,
      };
      dispatch(updateSlaAudit(inspDeata.id, isMultipleEvaluation ? 'hx.sla.kpi_audit_line_evaluations' : 'hx.sla.kpi_audit_line', payloadValues, 'checklist'));
    }
  }

  function saveRecordby() {
    let newData = [];
    const trackerLines = [];
    const answeredQtns = savedRecords.filter((item) => item.is_update === 'failed');

    if (answeredQtns.length) {
      for (let i = 0; i < answeredQtns.length; i += 1) {
        if (answeredQtns[i].ans_type === 'target') {
          newData = [1, answeredQtns[i].id, { target: answeredQtns[i].target ? parseFloat(answeredQtns[i].target) : 0.00, achieved_score: getComputedValidAnswer(answeredQtns[i].achieved_score) }];
        } else if (answeredQtns[i].ans_type === 'evaluation') {
          newData = [1, answeredQtns[i].evId, { audit_line: { id: answeredQtns[i].id, answer: answeredQtns[i].answer ? answeredQtns[i].answer.toString() : '', achieved_score: getComputedValidAnswer(answeredQtns[i].achieved_score) }, measured_value: answeredQtns[i].measuredValue ? parseFloat(answeredQtns[i].measuredValue) : 0.00 }];
        } else {
          newData = [1, answeredQtns[i].id, { answer: answeredQtns[i].answer, achieved_score: getComputedValidAnswer(answeredQtns[i].achieved_score) }];
        }
        trackerLines.push(newData);
      }
      const payloadValues = {
        lines: trackerLines,
      };
      dispatch(updateSlaAudit(inspDeata.id, isMultipleEvaluation ? 'hx.sla.kpi_audit_line_evaluations' : 'hx.sla.kpi_audit_line', payloadValues, 'checklist'));
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

  useEffect(() => {
    if (categories && categories.length && categories[0].length) {
      setCategoryId(categories[0][0] && categories[0][0].sla_category_id ? categories[0][0].sla_category_id.id : false);
      setSavedRecords([]);
      setSavedQuestions([]);
    }
  }, [detailData]);

  useEffect(() => {
    if (updateSlaAuditNoInfo && updateSlaAuditNoInfo.data && dataType && dataType === 'toggle') {
      dispatch(getSlaAuditPerformaceDetails(inspDeata.id, appModels.SLAAUDITPERFORMANCELOGS));
    }
  }, [updateSlaAuditNoInfo]);

  useEffect(() => {
    if (slaAuditSummary && slaAuditSummary.data) {
      setPerformanceLogs(slaAuditSummary.data);
    } else if (slaAuditSummary && slaAuditSummary.err) {
      setPerformanceLogs([]);
    }
  }, [slaAuditSummary]);

  useEffect(() => {
    if (categoryId && inspDeata && inspDeata.sla_audit_lines && inspDeata.sla_audit_lines.length) {
      const catList = inspDeata.sla_audit_lines.filter((item) => item.sla_category_id && item.sla_category_id.id === categoryId);
      setQuestionGroups(catList);
      setQuestionGroupsGlobal(catList);
    }
  }, [categoryId]);

  useEffect(() => {
    if (questionGroups && questionGroups.length) {
      getinitial();
    }
  }, [questionGroups]);

  useEffect(() => {
    if (questionGroups && questionGroups.length && loadAns) {
      setQuestionGroups(questionGroups);
      setQuestionGroupsGlobal(questionGroups);
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
          <td className="p-2">{numToValidFloatView(assetData[i].max_score)}</td>
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
    let maxlength = 50;
    if (type === 'textbox' && qtn && qtn.validation_required && qtn.validation_length_max) {
      maxlength = qtn.validation_length_max;
    } else if (type === 'numerical_box' && qtn && qtn.validation_required && qtn.validation_max_float_value) {
      maxlength = qtn.validation_max_float_value;
    } else if (type === 'numerical_box' && qtn && !qtn.validation_required && !qtn.validation_max_float_value) {
      maxlength = 10;
    }
    return maxlength;
  };

  function getRangeValue(type, target, givenValue) {
    let value = 0;
    console.log(type);
    if (givenValue) {
      const tv = parseFloat(target).toFixed(2);
      const gv = parseFloat(givenValue).toFixed(2);
      if (type === 'Subtract') {
        value = parseFloat(tv) - parseFloat(gv);
      } else if (type === 'Divide') {
        value = parseFloat(gv) / parseFloat(tv);
      } else if (type === 'Measure') {
        value = parseFloat(gv);
      } else if (type === 'Subtract Percentage') {
        const diffValue = (parseFloat(tv) - parseFloat(gv));
        value = (diffValue / parseFloat(tv)) * 100;
      } else if (type === 'Percentage' || type === 'Measure Percentage') {
        value = (parseFloat(gv) / parseFloat(tv)) * 100;
      }
    }
    return hasTarget ? value : givenValue;
  }

  function getRangeScore(value, ranges) {
    let score = 0;
    console.log(value);
    console.log(ranges);
    if (ranges && ranges.length) {
      const rangeData = ranges.filter((item) => parseFloat(parseFloat(item.min).toFixed(2)) <= parseFloat(parseFloat(value).toFixed(2)) && parseFloat((parseFloat(item.max).toFixed(2))) >= parseFloat((parseFloat(value).toFixed(2))));
      if (rangeData && rangeData.length) {
        score = rangeData[0].score;
      }
    }
    console.log(score);
    return hasTarget && ranges && ranges.length ? score : value;
  }

  function loadNotherComputed(grpQtnsData, storeData, checklist) {
    const stData = storeData;
    for (let i = 0; i < grpQtnsData.length; i += 1) {
      const compQtnGrpdata = questionGroups.filter((item) => (item.mro_activity_id.type === 'Computed' || item.mro_activity_id.type === 'numerical_box') && item.mro_activity_id.difference === 'Expression' && item.mro_activity_id.expression.includes(grpQtnsData[i].mro_activity_id.code));
      console.log(compQtnGrpdata);
      console.log(grpQtnsData[i].mro_activity_id.code);
      if (compQtnGrpdata && compQtnGrpdata.length) {
        for (let j = 0; j < compQtnGrpdata.length; j += 1) {
          const detailIndex2 = questionGroups.findIndex((obj) => (obj.id === compQtnGrpdata[j].id));
          const totalValue2 = getFormulaResultV2(questionGroups, 'answer', compQtnGrpdata[j].mro_activity_id.expression);
          // const res2 = totalValue2;
          questionGroups[detailIndex2].achieved_score = questionGroups[detailIndex2].mro_activity_id.type === 'numerical_box' && (questionGroups[detailIndex2].answer > 0 && questionGroups[detailIndex2].target > 0) ? getRangeScore(totalValue2, questionGroups[detailIndex2].mro_activity_id.metric_id && questionGroups[detailIndex2].mro_activity_id.metric_id.scale_line_ids ? questionGroups[detailIndex2].mro_activity_id.metric_id.scale_line_ids : []) : totalValue2;
          if (questionGroups[detailIndex2].mro_activity_id.type === 'Computed') {
            questionGroups[detailIndex2].answer = totalValue2;
          }
          stData.push({
            id: compQtnGrpdata[j].id,
            type: checklist.mro_activity_id.type,
            ans_type: 'measure',
            answer: questionGroups[detailIndex2].mro_activity_id.type === 'Computed' ? totalValue2 : questionGroups[detailIndex2].answer,
            achieved_score: questionGroups[detailIndex2].mro_activity_id.type === 'numerical_box' && (questionGroups[detailIndex2].answer > 0 && questionGroups[detailIndex2].target > 0) ? getRangeScore(totalValue2, questionGroups[detailIndex2].mro_activity_id.metric_id && questionGroups[detailIndex2].mro_activity_id.metric_id.scale_line_ids ? questionGroups[detailIndex2].mro_activity_id.metric_id.scale_line_ids : []) : totalValue2,
            is_update: 'start',
          });
        }
        setLoadAns(Math.random());
        setQuestionGroups(questionGroups);
      }
    }
    return stData;
  }

  const handleInputChange = (event, checklist) => {
    const { value } = event.target;
    const field = 'answer';
    const detailIndex = questionGroups.findIndex((obj) => (obj.id === checklist.id));
    questionGroups[detailIndex][field] = value;
    setLoadAns(Math.random());
    setDataType('input');
    const storeData = [];

    let payload = {
      sla_audit_lines: [[1, checklist.id, { answer: value }]],
    };
    if (checklist.mro_activity_id.type === 'numerical_box' && checklist.mro_activity_id.difference !== 'Expression') {
      const rangeValue = getRangeValue(checklist.mro_activity_id.difference, checklist.target, value);
      const rangeScore = getRangeScore(rangeValue, checklist.mro_activity_id.metric_id && checklist.mro_activity_id.metric_id.scale_line_ids ? checklist.mro_activity_id.metric_id.scale_line_ids : []);
      payload = {
        sla_audit_lines: [[1, checklist.id, { answer: value, achieved_score: value && hasTarget ? rangeScore : '' }]],
      };
      questionGroups[detailIndex].achieved_score = value && hasTarget ? rangeScore : '';
    }

    setQuestionGroups(questionGroups);

    const grpQtnsData = questionGroups.filter((item) => (item.mro_activity_id.type === 'Computed' || item.mro_activity_id.type === 'numerical_box') && item.mro_activity_id.difference === 'Expression' && item.mro_activity_id.expression.includes(checklist.mro_activity_id.code));
    console.log(grpQtnsData);
    if (grpQtnsData && grpQtnsData.length) {
      for (let i = 0; i < grpQtnsData.length; i += 1) {
        const detailIndex1 = questionGroups.findIndex((obj) => (obj.id === grpQtnsData[i].id));
        const totalValue = getFormulaResultV2(questionGroups, 'answer', grpQtnsData[i].mro_activity_id.expression);
        console.log(totalValue);
        // const rangeScore = getRangeScore(totalValue, grpQtnsData[i].mro_activity_id.metric_id && grpQtnsData[i].mro_activity_id.metric_id.scale_line_ids ? grpQtnsData[i].mro_activity_id.metric_id.scale_line_ids : []);
        questionGroups[detailIndex1].achieved_score = questionGroups[detailIndex1].mro_activity_id.type === 'numerical_box' && (questionGroups[detailIndex1].answer > 0 && questionGroups[detailIndex1].target > 0) ? getRangeScore(totalValue, questionGroups[detailIndex1].mro_activity_id.metric_id && questionGroups[detailIndex1].mro_activity_id.metric_id.scale_line_ids ? questionGroups[detailIndex1].mro_activity_id.metric_id.scale_line_ids : []) : totalValue;
        if (questionGroups[detailIndex1].mro_activity_id.type === 'Computed') {
          questionGroups[detailIndex1].answer = totalValue;
        }
        console.log(questionGroups[detailIndex1].mro_activity_id.type === 'numerical_box' && (questionGroups[detailIndex1].answer > 0 && questionGroups[detailIndex1].target > 0));
        console.log(questionGroups[detailIndex1].target);
        storeData.push({
          id: grpQtnsData[i].id,
          type: checklist.mro_activity_id.type,
          ans_type: 'measure',
          answer: questionGroups[detailIndex1].mro_activity_id.type === 'Computed' ? totalValue : questionGroups[detailIndex1].answer,
          achieved_score: questionGroups[detailIndex1].mro_activity_id.type === 'numerical_box' && (questionGroups[detailIndex1].answer > 0 && questionGroups[detailIndex1].target > 0) ? getRangeScore(totalValue, questionGroups[detailIndex1].mro_activity_id.metric_id && questionGroups[detailIndex1].mro_activity_id.metric_id.scale_line_ids ? questionGroups[detailIndex1].mro_activity_id.metric_id.scale_line_ids : []) : totalValue,
          is_update: 'start',
        });
      }
      setLoadAns(Math.random());
      setQuestionGroups(questionGroups);
      for (let i = 0; i < grpQtnsData.length; i += 1) {
        const compQtnGrpdata = questionGroups.filter((item) => (item.mro_activity_id.type === 'Computed' || item.mro_activity_id.type === 'numerical_box') && item.mro_activity_id.difference === 'Expression' && item.mro_activity_id.expression.includes(grpQtnsData[i].mro_activity_id.code));
        console.log(compQtnGrpdata);
        console.log(grpQtnsData[i].mro_activity_id.code);
        if (compQtnGrpdata && compQtnGrpdata.length) {
          for (let j = 0; j < compQtnGrpdata.length; j += 1) {
            const detailIndex2 = questionGroups.findIndex((obj) => (obj.id === compQtnGrpdata[j].id));
            const totalValue2 = getFormulaResultV2(questionGroups, 'answer', compQtnGrpdata[j].mro_activity_id.expression);
            // const res2 = totalValue2;
            questionGroups[detailIndex2].achieved_score = questionGroups[detailIndex2].mro_activity_id.type === 'numerical_box' && (questionGroups[detailIndex2].answer > 0 && questionGroups[detailIndex2].target > 0) ? getRangeScore(totalValue2, questionGroups[detailIndex2].mro_activity_id.metric_id && questionGroups[detailIndex2].mro_activity_id.metric_id.scale_line_ids ? questionGroups[detailIndex2].mro_activity_id.metric_id.scale_line_ids : []) : totalValue2;
            if (questionGroups[detailIndex2].mro_activity_id.type === 'Computed') {
              questionGroups[detailIndex2].answer = totalValue2;
            }
            storeData.push({
              id: compQtnGrpdata[j].id,
              type: checklist.mro_activity_id.type,
              ans_type: 'measure',
              answer: questionGroups[detailIndex2].mro_activity_id.type === 'Computed' ? totalValue2 : questionGroups[detailIndex2].answer,
              achieved_score: questionGroups[detailIndex2].mro_activity_id.type === 'numerical_box' && (questionGroups[detailIndex2].answer > 0 && questionGroups[detailIndex2].target > 0) ? getRangeScore(totalValue2, questionGroups[detailIndex2].mro_activity_id.metric_id && questionGroups[detailIndex2].mro_activity_id.metric_id.scale_line_ids ? questionGroups[detailIndex2].mro_activity_id.metric_id.scale_line_ids : []) : totalValue2,
              is_update: 'start',
            });
          }

          loadNotherComputed(compQtnGrpdata, storeData, checklist);

          setLoadAns(Math.random());
          setQuestionGroups(questionGroups);
        }
      }
    }
    setSavedRecords([...savedRecords, ...storeData]);
    setSavedQuestions([...savedRecords, ...storeData]);
  };

  const onOpenRemarks = (id, name, remarks, ans) => {
    setCurrentId(id);
    setCurrentName(name);
    setCurrentRemarks(remarks);
    setCurrentAnswer(ans);
    setQtnRemarksModal(true);
  };

  const onMessageResetChange = (id) => {
    setCurrentRemarks('');
    const payload = {
      sla_audit_lines: [[1, id, { remarks: '' }]],
    };
    const field = 'remarks';
    const detailIndex = questionGroups.findIndex((obj) => (obj.id === id));
    console.log(detailIndex);
    questionGroups[detailIndex][field] = '';
    setLoadAns(Math.random());
    setQuestionGroups(questionGroups);
    setTimeout(() => {
      dispatch(updateSlaAuditNoLoad(inspDeata.id, appModels.SLAAUDIT, payload));
    }, 2000);
  };

  const handleSimpleChoiceChange = (event, checklist) => {
    const { value } = event.target;
    const field = 'answer';
    const detailIndex = questionGroups.findIndex((obj) => (obj.id === checklist.id));
    questionGroups[detailIndex][field] = value;
    setLoadAns(Math.random());
    setDataType('input');
    let payload = {
      sla_audit_lines: [[1, checklist.id, { answer: value }]],
    };

    let storeData = [{
      id: checklist.id, type: checklist.mro_activity_id.type, ans_type: 'measure', answer: value, is_update: 'start',
    }];

    if (checklist.mro_activity_id.type === 'numerical_box') {
      const rangeValue = getRangeValue(checklist.mro_activity_id.difference, checklist.target, value);
      const rangeScore = getRangeScore(rangeValue, checklist.mro_activity_id.metric_id && checklist.mro_activity_id.metric_id.scale_line_ids ? checklist.mro_activity_id.metric_id.scale_line_ids : []);
      payload = {
        sla_audit_lines: [[1, checklist.id, { answer: value, achieved_score: value && hasTarget ? rangeScore : '' }]],
      };

      storeData = [{
        id: checklist.id, type: checklist.mro_activity_id.type, ans_type: 'measure', answer: value, achieved_score: value && hasTarget ? rangeScore : '', is_update: 'start',
      }];
      questionGroups[detailIndex].achieved_score = value && hasTarget ? rangeScore : '';
    }

    setQuestionGroups(questionGroups);

    const grpQtnsData = questionGroups.filter((item) => item.mro_activity_id.type === 'Computed' && item.mro_activity_id.difference === 'Expression' && item.mro_activity_id.expression.includes(checklist.mro_activity_id.code));
    console.log(grpQtnsData);
    if (grpQtnsData && grpQtnsData.length) {
      for (let i = 0; i < grpQtnsData.length; i += 1) {
        const detailIndex1 = questionGroups.findIndex((obj) => (obj.id === grpQtnsData[i].id));
        const totalValue = getFormulaResultV2(questionGroups, 'answer', grpQtnsData[i].mro_activity_id.expression);
        console.log(totalValue);
        // const rangeScore = getRangeScore(totalValue, grpQtnsData[i].mro_activity_id.metric_id && grpQtnsData[i].mro_activity_id.metric_id.scale_line_ids ? grpQtnsData[i].mro_activity_id.metric_id.scale_line_ids : []);
        questionGroups[detailIndex1].achieved_score = totalValue;
        questionGroups[detailIndex1].answer = totalValue;

        storeData.push({
          id: grpQtnsData[i].id, type: checklist.mro_activity_id.type, ans_type: 'measure', answer: totalValue, achieved_score: totalValue, is_update: 'start',
        });
      }
      setLoadAns(Math.random());
      const auditLines = [];
      let newData = [];
      for (let i = 0; i < grpQtnsData.length; i += 1) {
        const totalValue = getFormulaResultV2(questionGroups, 'answer', grpQtnsData[i].mro_activity_id.expression);
        // const rangeScore = getRangeScore(totalValue, grpQtnsData[i].mro_activity_id.metric_id && grpQtnsData[i].mro_activity_id.metric_id.scale_line_ids ? grpQtnsData[i].mro_activity_id.metric_id.scale_line_ids : []);
        newData = [1, grpQtnsData[i].id, { achieved_score: totalValue, answer: totalValue }];
        auditLines.push(newData);
      }
      const payloadValues = {
        sla_audit_lines: auditLines,
      };

      setQuestionGroups(questionGroups);
      for (let i = 0; i < grpQtnsData.length; i += 1) {
        const compQtnGrpdata = questionGroups.filter((item) => item.mro_activity_id.type === 'Computed' && item.mro_activity_id.difference === 'Expression' && item.mro_activity_id.expression.includes(grpQtnsData[i].mro_activity_id.code));
        if (compQtnGrpdata && compQtnGrpdata.length) {
          for (let j = 0; j < compQtnGrpdata.length; j += 1) {
            const detailIndex2 = questionGroups.findIndex((obj) => (obj.id === compQtnGrpdata[j].id));
            const totalValue2 = getFormulaResultV2(questionGroups, 'answer', compQtnGrpdata[j].mro_activity_id.expression);
            // const res2 = totalValue2;
            questionGroups[detailIndex2].achieved_score = totalValue2;
            questionGroups[detailIndex2].answer = totalValue2;

            storeData.push({
              id: compQtnGrpdata[j].id, type: checklist.mro_activity_id.type, ans_type: 'measure', answer: totalValue2, achieved_score: totalValue2, is_update: 'start',
            });
          }
          setLoadAns(Math.random());
          const auditLines1 = [];
          let newData1 = [];
          for (let k = 0; k < compQtnGrpdata.length; k += 1) {
            const totalValue3 = getFormulaResultV2(questionGroups, 'answer', compQtnGrpdata[k].mro_activity_id.expression);
            newData1 = [1, compQtnGrpdata[k].id, { achieved_score: totalValue3, answer: totalValue3 }];
            auditLines1.push(newData1);
          }
          const payloadValues2 = {
            sla_audit_lines: auditLines1,
          };

          setQuestionGroups(questionGroups);
        }
      }
    }
    setSavedRecords([...savedRecords, ...storeData]);
    setSavedQuestions([...savedRecords, ...storeData]);

    if (value && value === 'NA' && checklist.mro_activity_id && checklist.mro_activity_id.comments_allowed) {
      onOpenRemarks(checklist.id, checklist.mro_activity_id && checklist.mro_activity_id.name ? checklist.mro_activity_id.name : '', checklist.remarks, checklist.answer);
    }
    if (value && value !== 'NA' && checklist.remarks && checklist.mro_activity_id && checklist.mro_activity_id.comments_allowed) {
      onMessageResetChange(checklist.id);
    }
  };

  const extractFilledAnswers = (currentStages) => {
    if (!questionGroups || !questionGroups.length || !currentStages?.evaluators_ids) return [];

    const allowedIds = currentStages.evaluators_ids.map((e) => e.id);

    return questionGroups.flatMap((item) => item.evaluations_ids.map((ev) => ({
      id: item.id,
      achieved_score: item.achieved_score,
      answer: item.answer,
      evaluations_id: ev.id,
      evId: ev.evaluator_id.id,
      measured_value: ev.measured_value,
    }))).filter((item) => allowedIds.includes(item.evId));
  };

  const handleStatusStageCheckboxChange = (event, catId) => {
    const { checked, value } = event.target;
    const slaCategories = inspDeata && inspDeata.sla_category_logs ? inspDeata.sla_category_logs.filter((item) => item.sla_category_id.id === catId) : [];
    if (value && slaCategories && slaCategories.length) {
      const payload = {
        sla_category_logs: [[1, slaCategories[0].id, { state: value }]],
      };

      let newData = [];
      const trackerLines = [];

      const filledAnsChecklistStageNew = extractFilledAnswers(getCurrentStageData());

      if (filledAnsChecklistStageNew && filledAnsChecklistStageNew.length) {
        for (let i = 0; i < filledAnsChecklistStageNew.length; i += 1) {
          newData = [1, filledAnsChecklistStageNew[i].evaluations_id, { audit_line: { id: filledAnsChecklistStageNew[i].id, answer: filledAnsChecklistStageNew[i].answer ? filledAnsChecklistStageNew[i].answer.toString() : '', achieved_score: getComputedValidAnswer(filledAnsChecklistStageNew[i].achieved_score) }, measured_value: filledAnsChecklistStageNew[i].measured_value ? parseFloat(filledAnsChecklistStageNew[i].measured_value) : 0.00 }];
          trackerLines.push(newData);
        }
        const payloadValues = {
          lines: trackerLines,
        };
        dispatch(updateSlaAudit(detailData.id, 'hx.sla.kpi_audit_line_evaluations', payloadValues, 'checklist'));
        setTimeout(() => {
          dispatch(updateSlaAudit(inspDeata.id, appModels.SLAAUDIT, payload));
        }, 1500);
        setTimeout(() => {
          dispatch(getSlaAuditDetail(inspDeata.id, appModels.SLAAUDIT));
        }, 2000);
      } else {
        dispatch(updateSlaAudit(inspDeata.id, appModels.SLAAUDIT, payload));
        setTimeout(() => {
          dispatch(getSlaAuditDetail(inspDeata.id, appModels.SLAAUDIT));
        }, 1000);
      }
    }
  };

  const handleStatusCheckboxChange = (event, catId) => {
    if (isMultipleEvaluation && inspDeata.state === 'Draft' && getCurrentStageData()) {
      handleStatusStageCheckboxChange(event, catId);
    } else {
      const { value } = event.target;
      const slaCategories = inspDeata && inspDeata.sla_category_logs ? inspDeata.sla_category_logs.filter((item) => item.sla_category_id.id === catId) : [];
      if (value && slaCategories && slaCategories.length) {
        const payload = {
          sla_category_logs: [[1, slaCategories[0].id, { state: value }]],
        };

        let newData = [];
        const trackerLines = [];

        const filledChecklist = inspDeata && inspDeata.sla_audit_lines && inspDeata.sla_audit_lines.length > 0 ? inspDeata.sla_audit_lines : [];

        const filledAnsChecklist = filledChecklist.filter((item) => item.answer && item.sla_category_id.id === catId);

        const filledAnsChecklistNew = filledAnsChecklist.map((cl) => ({
          id: cl.id,
          achieved_score: cl.achieved_score,
          answer: cl.answer,
          target: cl.target ? parseFloat(cl.target) : 0.00,
        }));

        if (inspDeata.state === 'Draft' && filledAnsChecklistNew && filledAnsChecklistNew.length) {
          for (let i = 0; i < filledAnsChecklistNew.length; i += 1) {
            newData = [1, filledAnsChecklistNew[i].id, { answer: filledAnsChecklistNew[i].answer, achieved_score: getComputedValidAnswer(filledAnsChecklistNew[i].achieved_score), target: filledAnsChecklistNew[i].target }];
            trackerLines.push(newData);
          }
          const payloadValues = {
            lines: trackerLines,
          };
          dispatch(updateSlaAudit(inspDeata.id, 'hx.sla.kpi_audit_line', payloadValues, 'checklist'));
          setTimeout(() => {
            dispatch(updateSlaAudit(inspDeata.id, appModels.SLAAUDIT, payload));
          }, 1500);
          setTimeout(() => {
            dispatch(getSlaAuditDetail(inspDeata.id, appModels.SLAAUDIT));
          }, 2000);
        } else {
          dispatch(updateSlaAudit(inspDeata.id, appModels.SLAAUDIT, payload));
          setTimeout(() => {
            dispatch(getSlaAuditDetail(inspDeata.id, appModels.SLAAUDIT));
          }, 1000);
        }
      }
    }
  };

  const handleInputKeyChange = (event, checklist) => {
    const { value } = event.target;
    const field = 'answer';
    const detailIndex = questionGroups.findIndex((obj) => (obj.id === checklist.id));
    questionGroups[detailIndex][field] = value;
    setLoadAns(Math.random());

    let sRecs = [...savedRecords, ...[{
      id: checklist.id, answer: value, ans_type: 'measure', type: checklist.mro_activity_id.type, is_update: 'start',
    }]];

    if (checklist.mro_activity_id.type === 'numerical_box' && checklist.mro_activity_id.difference !== 'Expression') {
      const rangeValue = getRangeValue(checklist.mro_activity_id.difference, checklist.target, value);
      const rangeScore = getRangeScore(rangeValue, checklist.mro_activity_id.metric_id && checklist.mro_activity_id.metric_id.scale_line_ids ? checklist.mro_activity_id.metric_id.scale_line_ids : []);
      sRecs = [...savedRecords, ...[{
        id: checklist.id, answer: value, ans_type: 'measure', achieved_score: value && hasTarget ? rangeScore : '', type: checklist.mro_activity_id.type, is_update: 'start',
      }]];
    }
    const uniSRecs = [...new Map(sRecs.map((item) => [item.id, item])).values()];
    setSavedRecords(uniSRecs);
    setSavedQuestions(uniSRecs);
    setQuestionGroups(questionGroups);
  };

  const handleTargetInputChange = (event, checklist) => {
    const { value } = event.target;
    const field = 'target';
    const detailIndex = questionGroups.findIndex((obj) => (obj.id === checklist.id));
    questionGroups[detailIndex][field] = value;
    setLoadAns(Math.random());
    setDataType('input');
    let payload = {
      sla_audit_lines: [[1, checklist.id, { target: value }]],
    };
    if (checklist.mro_activity_id.type === 'numerical_box' && value && checklist.mro_activity_id.difference !== 'Expression') {
      const rangeValue = getRangeValue(checklist.mro_activity_id.difference, value, checklist.answer);
      const rangeScore = getRangeScore(rangeValue, checklist.mro_activity_id.metric_id && checklist.mro_activity_id.metric_id.scale_line_ids ? checklist.mro_activity_id.metric_id.scale_line_ids : []);
      payload = {
        sla_audit_lines: [[1, checklist.id, { target: value, achieved_score: value ? rangeScore : '' }]],
      };
      questionGroups[detailIndex].achieved_score = value ? rangeScore : '';
    }
    setQuestionGroups(questionGroups);
  };

  const handleTargetInputKeyChange = (event, checklist) => {
    const { value } = event.target;
    const field = 'target';
    const detailIndex = questionGroups.findIndex((obj) => (obj.id === checklist.id));
    questionGroups[detailIndex][field] = value;
    setLoadAns(Math.random());

    let sRecs = [...savedRecords, ...[{
      id: checklist.id, target: value, type: checklist.mro_activity_id.type, ans_type: 'target', is_update: 'start',
    }]];

    if (checklist.mro_activity_id.type === 'numerical_box' && value && checklist.mro_activity_id.difference !== 'Expression') {
      const rangeValue = getRangeValue(checklist.mro_activity_id.difference, value, checklist.answer);
      const rangeScore = getRangeScore(rangeValue, checklist.mro_activity_id.metric_id && checklist.mro_activity_id.metric_id.scale_line_ids ? checklist.mro_activity_id.metric_id.scale_line_ids : []);
      sRecs = [...savedRecords, ...[{
        id: checklist.id, target: value, achieved_score: value ? rangeScore : '', ans_type: 'target', type: checklist.mro_activity_id.type, is_update: 'start',
      }]];
    }
    const uniSRecs = [...new Map(sRecs.map((item) => [item.id, item])).values()];
    setSavedRecords(uniSRecs);
    setSavedQuestions(uniSRecs);

    setQuestionGroups(questionGroups);
  };

  function prepareResetData(array) {
    const newArray = [];
    const newData = [];
    for (let i = 0; i < array.length; i += 1) {
      // newData = [array[i].id ? 1 : 0, array[i].id ? array[i].id : 0, { answer: '', achieved_score: '', target: '' }];
      newArray.push({
        id: array[i].id, target: '', type: array[i].mro_activity_id.type, ans_type: 'target', is_update: 'start',
      });
    }
    return newArray;
  }

  function checkIsApplicable(grpId) {
    let res = true;
    const catList = performanceLogs ? performanceLogs.filter((item) => item.question_group_id && item.question_group_id.id === grpId) : [];
    if (catList && catList.length) {
      res = catList[0].is_notapplicable;
    }
    return res;
  }

  function prepareResetUpdateData(array) {
    for (let i = 0; i < array.length; i += 1) {
      const detailIndex = questionGroups.findIndex((obj) => (obj.id === array[i].id));
      questionGroups[detailIndex].achieved_score = '';
      questionGroups[detailIndex].answer = '';
      questionGroups[detailIndex].target = '';
    }
  }

  const handleCheckboxChange = (checked, grpId) => {
    setCurrentGroupId(grpId);
    if (!checked) {
      const resetData = questionGroups.filter((item) => item.question_group_id.id === grpId);
      const data = prepareResetData(resetData);
      prepareResetUpdateData(resetData);
      // setSavedRecords([...savedRecords, ...data]);
      // setSavedQuestions([...savedRecords, ...data]);
      if (data && data.length) {
        let payload = {};
        const catList = slaAuditSummary && slaAuditSummary.data ? slaAuditSummary.data.filter((item) => item.question_group_id && item.question_group_id.id === grpId) : [];
        if (catList && catList.length) {
          payload = {
            indicator_logs: [[1, catList[0].id, { is_notapplicable: true }]],
          };
        }
        dispatch(updateSlaAuditNoLoad(inspDeata.id, appModels.SLAAUDIT, payload));
        setQuestionGroups(questionGroups);
        setQuestionGroupsGlobal(questionGroups);
      }
    } else if (checked) {
      const catList = slaAuditSummary && slaAuditSummary.data ? slaAuditSummary.data.filter((item) => item.question_group_id && item.question_group_id.id === grpId) : [];
      if (catList && catList.length) {
        const payload = {
          indicator_logs: [[1, catList[0].id, { is_notapplicable: false }]],
        };
        dispatch(updateSlaAuditNoLoad(inspDeata.id, appModels.SLAAUDIT, payload));
      }
    }
    setDataType('toggle');
  };

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

  function getAnswer(value, item) {
    let res = '';
    if (value) {
      if (hasTarget) {
        res = value;
      } else if (!hasTarget && item.mro_activity_id.type === 'Computed' && item.mro_activity_id.has_related_questions) {
        res = '';
      } else {
        res = value;
      }
    }

    return res;
  }

  const handleDateInputChange = (dateString, checklist) => {
    const dateValue = dateString && dateString.$D ? dateString.$D : '';
    const monthValue1 = dateString && typeof dateString.$M === 'number' ? dateString.$M + 1 : '';
    const yearValue = dateString && dateString.$y ? dateString.$y : '';
    let fullDate = '';
    if (dateValue && monthValue1 && yearValue) {
      fullDate = `${yearValue}-${monthValue1 > 9 ? monthValue1 : `0${monthValue1}`}-${dateValue > 9 ? dateValue : `0${dateValue}`}`;
    }
    console.log(dateString);
    const value = fullDate || ''; // dateString ? moment(new Date(getDateTimeSeconds(dateString))).format(getDatePickerFormat(userInfo, 'date')) : '';
    const displayValue = fullDate || '';
    const field = 'answer';
    setDataType('date');
    const detailIndex = questionGroups.findIndex((obj) => (obj.id === checklist.id));
    if (value) {
      questionGroups[detailIndex][field] = displayValue;
      setLoadAns(Math.random());
      let payload = {
        sla_audit_lines: [[1, checklist.id, { answer: value }]],
      };

      let sRecs = [...savedRecords, ...[{
        id: checklist.id, answer: value, ans_type: 'measure', type: checklist.mro_activity_id.type, is_update: 'start',
      }]];

      if (checklist.target) {
        const d = new Date(inspDeata.audit_date);
        const month = d.getMonth() + 1;
        let year = d.getFullYear();
        let monthValue = month > 9 ? month : `0${month}`;
        if (checklist.mro_activity_id.for_month === 'Next') {
          const nMon = month + 1;
          monthValue = nMon > 9 && nMon <= 12 ? nMon : nMon > 12 ? '01' : `0${nMon}`;
          year = nMon > 12 ? year + 1 : year;
        }
        const day = checklist.target > 9 ? checklist.target : `0${checklist.target}`;
        const targetDate = new Date(`${year}-${monthValue}-${day}`);
        const noOfdays = getDiiffNoOfDays(new Date(value), targetDate);
        console.log(noOfdays);
        const rangeScore = getRangeScore(noOfdays, checklist.mro_activity_id.metric_id && checklist.mro_activity_id.metric_id.scale_line_ids ? checklist.mro_activity_id.metric_id.scale_line_ids : []);
        payload = {
          sla_audit_lines: [[1, checklist.id, { answer: value, achieved_score: rangeScore }]],
        };
        questionGroups[detailIndex].achieved_score = rangeScore;
        setLoadAns(Math.random());

        sRecs = [...savedRecords, ...[{
          id: checklist.id, answer: value, achieved_score: rangeScore, ans_type: 'measure', type: checklist.mro_activity_id.type, is_update: 'start',
        }]];
      }

      const uniSRecs = [...new Map(sRecs.map((item) => [item.id, item])).values()];
      setSavedRecords(uniSRecs);
      setSavedQuestions(uniSRecs);
      setQuestionGroups(questionGroups);
    } else {
      const payload = {
        sla_audit_lines: [[1, checklist.id, { answer: '', achieved_score: '' }]],
      };
      questionGroups[detailIndex].answer = '';
      questionGroups[detailIndex].achieved_score = '';

      const sRecs = [...savedRecords, ...[{
        id: checklist.id, answer: '', achieved_score: '', ans_type: 'measure', type: checklist.mro_activity_id.type, is_update: 'start',
      }]];

      const uniSRecs = [...new Map(sRecs.map((item) => [item.id, item])).values()];
      setSavedRecords(uniSRecs);
      setSavedQuestions(uniSRecs);
      setLoadAns(Math.random());
      setQuestionGroups(questionGroups);
    }
  };

  const handleTargetDateInputChange = (dateString, checklist) => {
    const dateValue = dateString && dateString.$D ? dateString.$D : '';
    const monthValue1 = dateString && typeof dateString.$M === 'number' ? dateString.$M + 1 : '';
    const yearValue = dateString && dateString.$y ? dateString.$y : '';
    let fullDate = '';
    if (dateValue && monthValue1 && yearValue) {
      fullDate = `${yearValue}-${monthValue1}-${dateValue}`;
    }
    const value = fullDate || ''; // dateString ? moment(new Date(getDateTimeSeconds(dateString))).format(getDatePickerFormat(userInfo, 'date')) : '';
    const displayValue = fullDate || '';
    const field = 'target';
    setDataType('date');
    const detailIndex = questionGroups.findIndex((obj) => (obj.id === checklist.id));
    if (value) {
      const d = new Date(value);
      const dateNum = d.getDate();
      questionGroups[detailIndex][field] = dateNum;
      setLoadAns(Math.random());
      let payload = {
        sla_audit_lines: [[1, checklist.id, { target: dateNum }]],
      };

      let sRecs = [...savedRecords, ...[{
        id: checklist.id, target: dateNum, type: checklist.mro_activity_id.type, ans_type: 'target', is_update: 'start',
      }]];

      if (dateNum && checklist.answer) {
        const dn = new Date(inspDeata.audit_date);
        const month = dn.getMonth() + 1;
        let year = dn.getFullYear();
        let monthValue = month > 9 ? month : `0${month}`;
        if (checklist.mro_activity_id.for_month === 'Next') {
          const nMon = month + 1;
          monthValue = nMon > 9 && nMon <= 12 ? nMon : nMon > 12 ? '01' : `0${nMon}`;
          year = nMon > 12 ? year + 1 : year;
        }
        const day = dateNum > 9 ? dateNum : `0${dateNum}`;
        const targetDate = new Date(`${year}-${monthValue}-${day}`);
        const noOfdays = getDiiffNoOfDays(new Date(checklist.answer), targetDate);
        console.log(noOfdays);
        const rangeScore = getRangeScore(noOfdays, checklist.mro_activity_id.metric_id && checklist.mro_activity_id.metric_id.scale_line_ids ? checklist.mro_activity_id.metric_id.scale_line_ids : []);
        payload = {
          sla_audit_lines: [[1, checklist.id, { target: dateNum, achieved_score: rangeScore }]],
        };
        questionGroups[detailIndex].achieved_score = rangeScore;
        setLoadAns(Math.random());

        sRecs = [...savedRecords, ...[{
          id: checklist.id, target: dateNum, achieved_score: rangeScore, ans_type: 'target', type: checklist.mro_activity_id.type, is_update: 'start',
        }]];
      }

      const uniSRecs = [...new Map(sRecs.map((item) => [item.id, item])).values()];
      setSavedRecords(uniSRecs);
      setSavedQuestions(uniSRecs);
      setQuestionGroups(questionGroups);
    } else {
      const payload = {
        sla_audit_lines: [[1, checklist.id, { target: 0.00, achieved_score: '' }]],
      };
      // questionGroups[detailIndex].answer = '';
      questionGroups[detailIndex].achieved_score = '';

      const sRecs = [...savedRecords, ...[{
        id: checklist.id, target: 0.00, achieved_score: '', ans_type: 'target', type: checklist.mro_activity_id.type, is_update: 'start',
      }]];

      const uniSRecs = [...new Map(sRecs.map((item) => [item.id, item])).values()];
      setSavedRecords(uniSRecs);
      setSavedQuestions(uniSRecs);
      setLoadAns(Math.random());
      setQuestionGroups(questionGroups);
    }
  };

  function getTargetDate(checklist) {
    let res = checklist.target;
    if (checklist.target) {
      const d = new Date(inspDeata.audit_date);
      const month = d.getMonth() + 1;
      let year = d.getFullYear();
      let monthValue = month > 9 ? month : `0${month}`;
      if (checklist.mro_activity_id.for_month === 'Next') {
        const nMon = month + 1;
        monthValue = nMon > 9 && nMon <= 12 ? nMon : nMon > 12 ? '01' : `0${nMon}`;
        year = nMon > 12 ? year + 1 : year;
      }
      const day = checklist.target > 9 ? checklist.target : `0${checklist.target}`;
      const resValue = new Date(`${year}-${monthValue}-${day}`);
      const firstConv = new Date(getDateTimeSeconds(resValue));
      res = moment(new Date(firstConv), getDatePickerFormat(userInfo, 'date'));// moment(resValue).format(getDatePickerFormat(userInfo, 'date'));
    }
    return res;
  }

  function getTargetDateView(checklist) {
    let res = checklist.target;
    if (checklist.target) {
      const d = new Date(inspDeata.audit_date);
      const month = d.getMonth() + 1;
      let year = d.getFullYear();
      let monthValue = month > 9 ? month : `0${month}`;
      if (checklist.mro_activity_id.for_month === 'Next') {
        const nMon = month + 1;
        monthValue = nMon > 9 && nMon <= 12 ? nMon : nMon > 12 ? '01' : `0${nMon}`;
        year = nMon > 12 ? year + 1 : year;
      }
      const day = checklist.target > 9 ? checklist.target : `0${checklist.target}`;
      const resValue = new Date(`${year}-${monthValue}-${day}`);
      const firstConv = new Date(getDateTimeSeconds(resValue));
      res = moment(firstConv).format(getDatePickerFormat(userInfo, 'date'));// moment(resValue).format(getDatePickerFormat(userInfo, 'date'));
    }
    return res;
  }

  const preventPaste = (e) => {
    alert('Copying and pasting is not allowed!');
    e.preventDefault();
  };

  function getFiiledClassName(answer, type) {
    let res = '';
    if (type === 'Computed') {
      res = 'computed-filled';
    } else if (answer && type !== 'Computed') {
      res = 'filled';
    }
    return res;
  }

  const onViewClose = () => {
    setViewRemarks(false);
    setCurrentGroup(false);
    setCurrentRemarks(false);
  };

  const onViewOpen = (qtnName, remarks) => {
    setViewRemarks(true);
    setCurrentGroup(qtnName);
    setCurrentRemarks(remarks);
  };

  const onOpenAttachment = (id, name) => {
    setCurrentId(id);
    setCurrentName(name);
    setAttachmentModal(true);
  };

  const onRemarksClose = () => {
    setCurrentId(false);
    setCurrentName(false);
    setCurrentRemarks(false);
    setQtnRemarksModal(false);
  };

  const onMessageChange = (e) => {
    setCurrentRemarks(e.target.value);

    const field = 'remarks';
    const detailIndex = questionGroups.findIndex((obj) => (obj.id === currentId));
    console.log(detailIndex);
    questionGroups[detailIndex][field] = e.target.value;
    setLoadAns(Math.random());
    setQuestionGroups(questionGroups);
  };

  const onMessageBlur = (e) => {
    const payload = {
      sla_audit_lines: [[1, currentId, { remarks: e.target.value }]],
    };
    setTimeout(() => {
      dispatch(updateSlaAuditNoLoad(inspDeata.id, appModels.SLAAUDIT, payload));
    }, 500);
  };

  const onRemarksSaveClose = (rem) => {
    const payload = {
      sla_audit_lines: [[1, currentId, { remarks: rem }]],
    };
    dispatch(updateSlaAuditNoLoad(inspDeata.id, appModels.SLAAUDIT, payload));
    setCurrentId(false);
    setCurrentName(false);
    setCurrentRemarks(false);
    setQtnRemarksModal(false);
  };

  const handleStageMeasureChange = (event, evId, checklist, target, isLast) => {
    const { value } = event.target;
    const field = 'measured_value';

    if (value && (parseFloat(value) > parseFloat(target))) return;

    const checklistIndex = questionGroups.findIndex((obj) => obj.id === checklist.id);
    if (checklistIndex === -1) return;

    const evIndex = questionGroups[checklistIndex].evaluations_ids.findIndex((obj) => obj.id === evId);
    if (evIndex === -1) return;

    // ✅ Direct mutation
    questionGroups[checklistIndex].evaluations_ids[evIndex][field] = value;

    if (isLast) {
      const updatedEvaluations = questionGroups[checklistIndex].evaluations_ids;
      const total = updatedEvaluations.reduce(
        (acc, item) => {
          acc.target += parseFloat(item.target || 0);
          acc.measured_value += parseFloat(item.measured_value || 0);
          return acc;
        },
        { target: 0, measured_value: 0 },
      );

      const rangeValue = getRangeValue(
        checklist.mro_activity_id.difference,
        total.target,
        total.measured_value,
      );

      const rangeScore = getRangeScore(
        rangeValue,
        checklist.mro_activity_id.metric_id?.scale_line_ids || [],
      );

      questionGroups[checklistIndex].answer = total.measured_value;
      questionGroups[checklistIndex].achieved_score = value && hasTarget ? rangeScore : '';
    }

    // ✅ Still need to trigger re-render
    setQuestionGroups(questionGroups);
    setLoadAns(Math.random());

    const record = {
      id: checklist.id,
      evId,
      measuredValue: value,
      ans_type: 'evaluation',
      type: checklist.mro_activity_id.type,
      is_update: 'start',
    };

    if (isLast) {
      record.answer = questionGroups[checklistIndex].answer;
      record.achieved_score = questionGroups[checklistIndex].achieved_score;
    }

    const sRecs = [...savedRecords, record];
    const uniSRecs = [...new Map(sRecs.map((item) => [item.id, item])).values()];

    setSavedRecords(uniSRecs);
    setSavedQuestions(uniSRecs);
  };

  function getRow(assetDataList, groupId) {
    const tableTr = [];
    let gId = false;
    if (groupId) {
      gId = groupId;
    }

    const assetData = assetDataList.sort((a, b) => a.mro_activity_id.sequence - b.mro_activity_id.sequence);

    let lastMatchedId = false;

    for (let i = 0; i < assetData.length; i += 1) {
      if (assetData[i].question_group_id && assetData[i].question_group_id.id && assetData[i].question_group_id.id === gId) {
        if (isMultipleEvaluation && assetData[i].evaluations_ids && assetData[i].evaluations_ids.length) {
          const matchedEvaluatorIds = assetData[i].evaluations_ids.map((v) => v.evaluator_id.id);
          lastMatchedId = matchedEvaluatorIds[matchedEvaluatorIds.length - 1];
        }
        tableTr.push(
          <tr key={i} style={assetData[i].mro_activity_id.type === 'Computed' && assetData[i].mro_activity_id.has_related_questions ? { backgroundColor: '#f0f8ff' } : {}}>
            <td
              className="p-2 font-family-tab font-14"
            >
              {getDefaultNoValue(assetData[i].mro_activity_id && assetData[i].mro_activity_id.name ? assetData[i].mro_activity_id.name : '')}
              {assetData[i].mro_activity_id && assetData[i].mro_activity_id.data_source && (
                <Tooltip title={assetData[i].mro_activity_id.data_source}>
                  <span className="text-info cursor-pointer">
                    <img alt="dataSourceIcon" className="ml-1" height="13" width="13" src={dataSourceIcon} />
                  </span>
                </Tooltip>
              )}
              {!checkIsApplicable(groupId) && assetData[i].mro_activity_id && assetData[i].mro_activity_id.has_attachment && (
                <Tooltip title="Attachments">
                  <span className="text-info cursor-pointer">
                    <img
                      aria-hidden
                      alt="uploadPhotoBlue"
                      className="ml-2"
                      onClick={() => onOpenAttachment(assetData[i].id, assetData[i].mro_activity_id && assetData[i].mro_activity_id.name ? assetData[i].mro_activity_id.name : '')}
                      height="14"
                      width="14"
                      src={uploadPhotoBlue}
                    />
                  </span>
                </Tooltip>
              )}
              {!checkIsApplicable(groupId) && assetData[i].mro_activity_id && assetData[i].mro_activity_id.comments_allowed && (
                <Tooltip title="Remarks">
                  <span className="text-info cursor-pointer">
                    <img
                      aria-hidden
                      alt="workOrdersBlue"
                      className="ml-2"
                      onClick={() => onOpenRemarks(assetData[i].id, assetData[i].mro_activity_id && assetData[i].mro_activity_id.name ? assetData[i].mro_activity_id.name : '', assetData[i].remarks, assetData[i].answer)}
                      height="14"
                      width="14"
                      src={workOrdersBlue}
                    />
                  </span>
                </Tooltip>
              )}
            </td>
            {!isMultipleEvaluation && hasTarget && (
              <>
                {inspDeata.state === 'Draft'
                  ? (
                    <>
                      {assetData[i].mro_activity_id.type !== 'simple_choice' && assetData[i].mro_activity_id.type !== 'multiple_choice' && assetData[i].mro_activity_id.type !== 'boolean' && assetData[i].mro_activity_id.type !== 'date' && (
                      <td className="p-2 font-family-tab font-14">
                        <div className={assetData[i].mro_activity_id.target_placeholder ? 'input-container' : 'input-container1'}>
                          <Input
                            type={getInputType(assetData[i].mro_activity_id.type)}
                            className="m-0 position-relative"
                            name="targetValue"
                            autoComplete="off"
                            disabled={checkIsApplicable(groupId)}
                            onPaste={(e) => preventPaste(e)}
                            maxLength={getmaxLength(assetData[i].mro_activity_id.type, assetData[i].mro_activity_id)}
                            required={assetData[i].mro_activity_id && assetData[i].mro_activity_id.constr_mandatory}
                            onKeyDown={assetData[i].mro_activity_id.type === 'numerical_box' ? decimalKeyPressDown : ''}
                            value={typeof assetData[i].target === 'number' || typeof assetData[i].target === 'string' ? assetData[i].target : ''}
                            onBlur={(e) => (handleTargetInputChange(e, assetData[i]))}
                            onChange={(e) => (handleTargetInputKeyChange(e, assetData[i]))}
                          />
                          {assetData[i].mro_activity_id.target_placeholder && assetData[i].mro_activity_id.target_placeholder.length > 52 && (
                          <Tooltip title={assetData[i].mro_activity_id.target_placeholder}>
                            <label className={assetData[i].target ? 'filled' : ''} htmlFor="targetValue">
                              {truncate(assetData[i].mro_activity_id.target_placeholder, 52)}
                            </label>
                          </Tooltip>
                          )}
                          {assetData[i].mro_activity_id.target_placeholder && assetData[i].mro_activity_id.target_placeholder.length < 52 && (
                          <label className={assetData[i].target ? 'filled' : ''} htmlFor="targetValue">
                            {assetData[i].mro_activity_id.target_placeholder}
                          </label>
                          )}
                        </div>
                      </td>
                      )}
                      {assetData[i].mro_activity_id.type === 'date' && (
                      <td className="p-2">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DemoContainer components={['DatePicker']} className="customXDatePicker">
                            <DatePicker
                              value={assetData[i].target ? dayjs(getTargetDate(assetData[i])) : null}
                              format={getDatePickerFormat(userInfo, 'date')}
                              disabled={checkIsApplicable(groupId)}
                              className="customXDatePicker"
                              placeholder={assetData[i].mro_activity_id.target_placeholder ? assetData[i].mro_activity_id.target_placeholder : ''}
                              onChange={(date, dateString) => (handleTargetDateInputChange(date, assetData[i]))}
                            />
                          </DemoContainer>
                        </LocalizationProvider>
                      </td>
                      )}
                    </>
                  )
                  : (
                    <>
                      {assetData[i].mro_activity_id.type !== 'simple_choice' && assetData[i].mro_activity_id.type !== 'multiple_choice' && assetData[i].mro_activity_id.type !== 'boolean' && assetData[i].mro_activity_id.type !== 'date' ? (
                        <td className="p-2 font-family-tab font-14">
                          <div className={assetData[i].mro_activity_id.target_placeholder ? 'input-container' : 'input-container1'}>
                            <Input
                              type={getInputType(assetData[i].mro_activity_id.type)}
                              className="m-0 position-relative"
                              name="targetValue"
                              autoComplete="off"
                              value={typeof assetData[i].target === 'number' ? assetData[i].target : ''}
                              disabled
                            />
                            {assetData[i].mro_activity_id.target_placeholder && assetData[i].mro_activity_id.target_placeholder.length > 52 && (
                            <Tooltip title={assetData[i].mro_activity_id.target_placeholder}>
                              <label className={assetData[i].target ? 'filled' : ''} htmlFor="targetValue">
                                {truncate(assetData[i].mro_activity_id.target_placeholder, 52)}
                              </label>
                            </Tooltip>
                            )}
                            {assetData[i].mro_activity_id.target_placeholder && assetData[i].mro_activity_id.target_placeholder.length < 52 && (
                            <label className={assetData[i].target ? 'filled' : ''} htmlFor="targetValue">
                              {assetData[i].mro_activity_id.target_placeholder}
                            </label>
                            )}
                          </div>
                        </td>
                      )
                        : (
                          <td className="p-2 font-family-tab font-14">
                            <div className={assetData[i].mro_activity_id.target_placeholder ? 'input-container' : 'input-container1'}>
                              <Input
                                type="text"
                                className="m-0 position-relative"
                                name="answerValue"
                                autoComplete="off"
                                value={assetData[i].target ? getTargetDateView(assetData[i]) : ''}
                                disabled
                              />
                              {assetData[i].mro_activity_id.target_placeholder && assetData[i].mro_activity_id.target_placeholder.length > 52 && (
                              <Tooltip title={assetData[i].mro_activity_id.target_placeholder}>
                                <label className={assetData[i].target ? 'filled' : ''} htmlFor="targetValue">
                                  {truncate(assetData[i].mro_activity_id.target_placeholder, 52)}
                                </label>
                              </Tooltip>
                              )}
                              {assetData[i].mro_activity_id.target_placeholder && assetData[i].mro_activity_id.target_placeholder.length < 52 && (
                              <label className={assetData[i].target ? 'filled' : ''} htmlFor="targetValue">
                                {assetData[i].mro_activity_id.target_placeholder}
                              </label>
                              )}
                            </div>
                          </td>
                        )}
                    </>
                  )}
              </>
            )}
            {!isMultipleEvaluation && (
              <>
                {!(assetData[i].mro_activity_id.type === 'Computed' && assetData[i].mro_activity_id.has_related_questions) ? (
                  <>
                    {inspDeata.state === 'Draft'
                      ? (
                        <>
                          {assetData[i].mro_activity_id.type !== 'simple_choice' && assetData[i].mro_activity_id.type !== 'multiple_choice' && assetData[i].mro_activity_id.type !== 'boolean' && assetData[i].mro_activity_id.type !== 'date' && (
                          <td className="p-2 font-family-tab font-14">
                            <div className={assetData[i].mro_activity_id.measured_placeholder ? 'input-container' : 'input-container1'}>
                              <Input
                                type={getInputType(assetData[i].mro_activity_id.type)}
                                className={assetData[i].mro_activity_id.type === 'Computed' && !assetData[i].mro_activity_id.has_related_questions ? 'm-0 position-relative computed-input' : 'm-0 position-relative'}
                                name="answerValue"
                                autoComplete="off"
                                disabled={checkIsApplicable(groupId) || assetData[i].mro_activity_id.type === 'Computed'}
                                onPaste={(e) => preventPaste(e)}
                                maxLength={getmaxLength(assetData[i].mro_activity_id.type, assetData[i].mro_activity_id)}
                                required={assetData[i].mro_activity_id && assetData[i].mro_activity_id.constr_mandatory}
                                onKeyDown={assetData[i].mro_activity_id.type === 'numerical_box' ? decimalKeyPressDown : ''}
                                value={getAnswer(assetData[i].answer, assetData[i])}
                                onBlur={(e) => (handleInputChange(e, assetData[i]))}
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
                          </td>
                          )}
                          {assetData[i].mro_activity_id.type === 'date' && (
                          <td className="p-2">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DemoContainer components={['DatePicker']} className="customXDatePicker">
                                <DatePicker
                                  value={assetData[i].answer ? dayjs(assetData[i].answer) : null}
                                  format={getDatePickerFormat(userInfo, 'date')}
                                  disabled={checkIsApplicable(groupId)}
                                  className="customXDatePicker"
                                  placeholder={assetData[i].mro_activity_id.measured_placeholder ? assetData[i].mro_activity_id.measured_placeholder : ''}
                                  onChange={(date, dateString) => (handleDateInputChange(date, assetData[i]))}
                                />
                              </DemoContainer>
                            </LocalizationProvider>
                          </td>
                          )}
                          {assetData[i].mro_activity_id.type === 'simple_choice' && (
                          <td className="p-2">
                            <Radio.Group size="small" onChange={(e) => handleSimpleChoiceChange(e, assetData[i])} value={assetData[i].answer ? assetData[i].answer : ''} buttonStyle="solid" disabled={checkIsApplicable(groupId)}>
                              {assetData[i].mro_activity_id && assetData[i].mro_activity_id.labels_ids.map((ld) => (
                                <Radio.Button value={ld.value}>{ld.value}</Radio.Button>
                              ))}
                            </Radio.Group>
                          </td>
                          )}
                        </>
                      )
                      : (
                        <>
                          {assetData[i].mro_activity_id.type !== 'multiple_choice' && assetData[i].mro_activity_id.type !== 'boolean' && assetData[i].mro_activity_id.type !== 'date' ? (
                            <td className="p-2 font-family-tab font-14">
                              <div className={assetData[i].mro_activity_id.measured_placeholder ? 'input-container' : 'input-container1'}>
                                <Input
                                  type={getInputType(assetData[i].mro_activity_id.type)}
                                  className={assetData[i].mro_activity_id.type === 'Computed' && !assetData[i].mro_activity_id.has_related_questions ? 'm-0 position-relative computed-input' : 'm-0 position-relative'}
                                  name="answerValue"
                                  autoComplete="off"
                                  value={getAnswer(assetData[i].answer, assetData[i])}
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
                            </td>
                          )
                            : (
                              <td className="p-2 font-family-tab font-14">
                                <div className={assetData[i].mro_activity_id.measured_placeholder ? 'input-container' : 'input-container1'}>
                                  <Input
                                    type="text"
                                    className={assetData[i].mro_activity_id.type === 'Computed' && !assetData[i].mro_activity_id.has_related_questions ? 'm-0 position-relative computed-input' : 'm-0 position-relative'}
                                    name="answerValue"
                                    autoComplete="off"
                                    value={assetData[i].answer ? getDateValueView(assetData[i].answer) : ''}
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
                              </td>
                            )}
                        </>
                      )}
                  </>
                ) : (<td align="right" className="p-2" />)}
              </>
            )}
            {isMultipleEvaluation && assetData[i].evaluations_ids && assetData[i].evaluations_ids.length && evaluators && evaluators.length > 0 && evaluators.map((ev, index) => {
              const value = assetData[i].evaluations_ids.find((v) => v.evaluator_id.id === ev.id);
              const isLast = ev.id === lastMatchedId;

              return (
                <td key={ev.id} className="p-2 font-family-tab font-14">
                  {value ? (
                    <>
                      <p className="m-0 font-tiny font-family-tab">
                        Target Value:
                        {' '}
                        {value.target}
                      </p>
                      <Input
                        type="text"
                        className="m-0"
                        name="answerValue"
                        autoComplete="off"
                        disabled={!getCurrentStage(ev.id)}
                        onPaste={(e) => preventPaste(e)}
                        maxLength={5}
                        onKeyDown={decimalKeyPressDown}
                        value={value.measured_value ? value.measured_value : ''}
                        onChange={(e) => (handleStageMeasureChange(e, value.id, assetData[i], value.target, (isLast || (index > 0 && getCurrentStage(ev.id)))))}
                      />
                    </>
                  ) : ' - '}
                </td>
              );
            })}

            {((isMultipleEvaluation && (isFinalStage() || !getCurrentStageData())) || !isMultipleEvaluation) && (<td align="right" className="p-2 font-family-tab font-14">{hasTarget || (!hasTarget && assetData[i].mro_activity_id.type === 'Computed' && assetData[i].mro_activity_id.has_related_questions && assetData[i].answer) ? numToValidFloatView(assetData[i].achieved_score) : ''}</td>)}
          </tr>,
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
    const assetDataList = assetData.filter((item) => item.question_group_id.id === groupId && item.mro_activity_id.type !== 'Computed');
    if (isMultipleEvaluation && inspDeata.state === 'Draft' && getCurrentStageData()) {
      const stageSlas = assetDataList && assetDataList.length > 0 ? assetDataList.flatMap((item) => item.evaluations_ids) : [];

      const allowedIds = getCurrentStageData() && getCurrentStageData().evaluators_ids ? getCurrentStageData().evaluators_ids.map((e) => e.id) : [];

      // Filter the full objects
      const totalQtns = stageSlas.filter((item) => allowedIds.includes(item.evaluator_id.id));
      if (type === 'total') {
        res = totalQtns && totalQtns.length ? totalQtns.length : 0;
      } else if (type === 'answer' && assetDataList && assetDataList.length) {
        const assetDataAnsList = totalQtns.filter((item) => item.measured_value);
        res = assetDataAnsList && assetDataAnsList.length ? assetDataAnsList.length : 0;
      }
    } else if (type === 'total') {
      res = assetDataList && assetDataList.length ? assetDataList.length : 0;
    } else if (type === 'answer' && assetDataList && assetDataList.length) {
      const assetDataAnsList = assetDataList.filter((item) => item.answer && item.mro_activity_id.type !== 'Computed');
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
    const assetDataList = assetData.filter((item) => item.sla_category_id.id === groupId && item.mro_activity_id.type !== 'Computed');

    const unApplicableData = performanceLogs ? performanceLogs.filter((item) => item.sla_category_id.id === groupId && item.is_notapplicable) : [];
    const unApplicableQtnGrps = unApplicableData && unApplicableData.length ? getColumnArrayByField(unApplicableData, 'question_group_id', 'id') : [];

    if (isMultipleEvaluation && inspDeata.state === 'Draft' && getCurrentStageData()) {
      const stageSlas = assetDataList && assetDataList.length > 0 ? assetDataList.flatMap((item) => item.evaluations_ids) : [];

      const allowedIds = getCurrentStageData() && getCurrentStageData().evaluators_ids ? getCurrentStageData().evaluators_ids.map((e) => e.id) : [];

      // Filter the full objects
      const totalQtns = stageSlas.filter((item) => allowedIds.includes(item.evaluator_id.id));
      if (type === 'total') {
        const qtnCatData = inspDeata && inspDeata.sla_audit_lines ? inspDeata.sla_audit_lines.filter((item) => item.sla_category_id && item.sla_category_id.id === groupId && item.mro_activity_id.type !== 'Computed') : [];
        const unApplicableQtns = qtnCatData && qtnCatData.length && unApplicableQtnGrps && unApplicableQtnGrps.length ? getArrayFromValuesMultByIdIn(qtnCatData, unApplicableQtnGrps, 'question_group_id', 'id') : [];
        const unApplicableCount = unApplicableQtns && unApplicableQtns.length;
        res = totalQtns && totalQtns.length ? totalQtns.length - unApplicableCount : 0;
      } else if (type === 'answer' && totalQtns && totalQtns.length) {
        const qtnCatData = inspDeata && inspDeata.sla_audit_lines ? inspDeata.sla_audit_lines.filter((item) => item.sla_category_id && item.sla_category_id.id === groupId && item.mro_activity_id.type !== 'Computed' && item.answer) : [];
        const unApplicableQtns = qtnCatData && qtnCatData.length && unApplicableQtnGrps && unApplicableQtnGrps.length ? getArrayFromValuesMultByIdIn(qtnCatData, unApplicableQtnGrps, 'question_group_id', 'id') : [];
        const unApplicableCount = unApplicableQtns && unApplicableQtns.length;
        const assetDataAnsList = totalQtns.filter((item) => item.measured_value);
        res = assetDataAnsList && assetDataAnsList.length ? assetDataAnsList.length - unApplicableCount : 0;
      }
    } else if (type === 'total') {
      const qtnCatData = inspDeata && inspDeata.sla_audit_lines ? inspDeata.sla_audit_lines.filter((item) => item.sla_category_id && item.sla_category_id.id === groupId && item.mro_activity_id.type !== 'Computed') : [];
      const unApplicableQtns = qtnCatData && qtnCatData.length && unApplicableQtnGrps && unApplicableQtnGrps.length ? getArrayFromValuesMultByIdIn(qtnCatData, unApplicableQtnGrps, 'question_group_id', 'id') : [];
      const unApplicableCount = unApplicableQtns && unApplicableQtns.length;
      res = assetDataList && assetDataList.length ? assetDataList.length - unApplicableCount : 0;
    } else if (type === 'answer' && assetDataList && assetDataList.length) {
      const qtnCatData = inspDeata && inspDeata.sla_audit_lines ? inspDeata.sla_audit_lines.filter((item) => item.sla_category_id && item.sla_category_id.id === groupId && item.mro_activity_id.type !== 'Computed' && item.answer) : [];
      const unApplicableQtns = qtnCatData && qtnCatData.length && unApplicableQtnGrps && unApplicableQtnGrps.length ? getArrayFromValuesMultByIdIn(qtnCatData, unApplicableQtnGrps, 'question_group_id', 'id') : [];
      const unApplicableCount = unApplicableQtns && unApplicableQtns.length;
      const assetDataAnsList = assetDataList.filter((item) => item.answer);
      res = assetDataAnsList && assetDataAnsList.length ? assetDataAnsList.length - unApplicableCount : 0;
    }
    return res;
  }

  function getCatQtnsIsAllAnswered(assetData, groupId) {
    let gId = false;
    let res = false;
    if (groupId) {
      gId = groupId;
    }
    const assetDataList = assetData.filter((item) => item.sla_category_id.id === groupId && item.mro_activity_id.type !== 'Computed');

    const unApplicableData = performanceLogs ? performanceLogs.filter((item) => item.sla_category_id.id === groupId && item.is_notapplicable) : [];
    const unApplicableQtnGrps = unApplicableData && unApplicableData.length ? getColumnArrayByField(unApplicableData, 'question_group_id', 'id') : [];
    const qtnCatData = inspDeata && inspDeata.sla_audit_lines ? inspDeata.sla_audit_lines.filter((item) => item.sla_category_id && item.sla_category_id.id === groupId && item.mro_activity_id.type !== 'Computed') : [];
    const unApplicableQtns = qtnCatData && qtnCatData.length && unApplicableQtnGrps && unApplicableQtnGrps.length ? getArrayFromValuesMultByIdIn(qtnCatData, unApplicableQtnGrps, 'question_group_id', 'id') : [];
    const unApplicableCount = unApplicableQtns && unApplicableQtns.length;
    const totalCatQtns = assetDataList && assetDataList.length ? assetDataList.length - unApplicableCount : 0;

    const qtnCatDataAns = inspDeata && inspDeata.sla_audit_lines ? inspDeata.sla_audit_lines.filter((item) => item.sla_category_id && item.sla_category_id.id === groupId && item.mro_activity_id.type !== 'Computed' && item.answer) : [];
    const unApplicableQtnsAns = qtnCatDataAns && qtnCatDataAns.length && unApplicableQtnGrps && unApplicableQtnGrps.length ? getArrayFromValuesMultByIdIn(qtnCatDataAns, unApplicableQtnGrps, 'question_group_id', 'id') : [];
    const unApplicableCountAns = unApplicableQtnsAns && unApplicableQtnsAns.length ? unApplicableQtnsAns.length : 0;

    const assetDataAnsList = assetDataList.filter((item) => item.answer);
    const totalCatQtnsAns = assetDataAnsList && assetDataAnsList.length ? assetDataAnsList.length - unApplicableCountAns : 0;

    if (totalCatQtnsAns === totalCatQtns) {
      res = true;
    } else {
      res = false;
    }

    return res;
  }

  function getCategoryStatus(groupId) {
    let res = '';
    const slaCategories = inspDeata && inspDeata.sla_category_logs ? inspDeata.sla_category_logs.filter((item) => item.sla_category_id.id === groupId) : [];
    if (slaCategories && slaCategories.length) {
      res = slaCategories[0].state;
    }

    return res;
  }

  function isReviewUser(groupId) {
    let res = false;
    const userRoleId = userInfo && userInfo.data && userInfo.data.user_role_id ? userInfo.data.user_role_id : false;
    const slaCategories = inspDeata && inspDeata.sla_category_logs ? inspDeata.sla_category_logs.filter((item) => item.sla_category_id.id === groupId) : [];
    if (slaCategories && slaCategories.length) {
      const data = slaCategories[0].checker_ids && slaCategories[0].checker_ids.length ? slaCategories[0].checker_ids.filter((item) => item.id === userRoleId) : [];
      if (data && data.length) {
        res = true;
      }
    }
    return res;
  }

  function isApproveUser(groupId) {
    let res = false;
    const userRoleId = userInfo && userInfo.data && userInfo.data.user_role_id ? userInfo.data.user_role_id : false;
    const slaCategories = inspDeata && inspDeata.sla_category_logs ? inspDeata.sla_category_logs.filter((item) => item.sla_category_id.id === groupId) : [];
    if (slaCategories && slaCategories.length) {
      const data = slaCategories[0].approver_ids && slaCategories[0].approver_ids.length ? slaCategories[0].approver_ids.filter((item) => item.id === userRoleId) : [];
      if (data && data.length) {
        res = true;
      }
    }
    return res;
  }

  function isReviewUserExists(groupId) {
    let res = false;
    const slaCategories = inspDeata && inspDeata.sla_category_logs ? inspDeata.sla_category_logs.filter((item) => item.sla_category_id.id === groupId) : [];
    if (slaCategories && slaCategories.length && slaCategories[0].checker_ids && slaCategories[0].checker_ids.length) {
      res = true;
    }
    return res;
  }

  function isApproveUserExists(groupId) {
    let res = false;
    const slaCategories = inspDeata && inspDeata.sla_category_logs ? inspDeata.sla_category_logs.filter((item) => item.sla_category_id.id === groupId) : [];
    if (slaCategories && slaCategories.length && slaCategories[0].approver_ids && slaCategories[0].approver_ids.length) {
      res = true;
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

  useEffect(() => {
    if (inspDeata) {
      dispatch(getSlaAuditPerformaceDetails(inspDeata.id, appModels.SLAAUDITPERFORMANCELOGS));
    }
  }, [detailData]);

  function getArrayNewFormat(arr, key, ids) {
    const newArray = [];
    const array = arr.filter((item) => item.is_update === 'start');
    if (ids && ids.length) {
      for (let i = 0; i < array.length; i += 1) {
        const value = array[i].id;
        if (ids && (ids.indexOf(value) !== -1)) {
          if (array[i].ans_type === 'target') {
            newArray.push({
              id: array[i].id, target: array[i].target, achieved_score: array[i].achieved_score ? array[i].achieved_score : '', type: array[i].type, is_update: key,
            });
          } else {
            newArray.push({
              id: array[i].id, answer: array[i].answer, achieved_score: array[i].achieved_score ? array[i].achieved_score : '', type: array[i].type, is_update: key,
            });
          }
        }
      }
    } else {
      for (let i = 0; i < array.length; i += 1) {
        if (array[i].ans_type === 'target') {
          newArray.push({
            id: array[i].id, target: array[i].target, achieved_score: array[i].achieved_score ? array[i].achieved_score : '', type: array[i].type, is_update: key,
          });
        } else {
          newArray.push({
            id: array[i].id, answer: array[i].answer, achieved_score: array[i].achieved_score ? array[i].achieved_score : '', type: array[i].type, is_update: key,
          });
        }
      }
    }
    return newArray;
  }

  function getFailedQtns() {
    let res = false;
    const data = savedRecords.filter((item) => item.is_update === 'failed');
    if (data && data.length) {
      res = true;
    }
    return res;
  }

  useEffect(() => {
    if (updateSlaAuditInfo && updateSlaAuditInfo.data) {
      const catLastDate = [{ category_id: categoryId, last_updated: getLocalTime(new Date()) }];
      const arr = [...lastUpdated, ...catLastDate];
      setLastUpdated([...new Map(arr.map((item) => [item.category_id, item])).values()]);
      setExtraLoad('yes');
      setSavedRecords(getArrayNewFormat(savedRecords, 'success', updateSlaAuditInfo.data));
      setSavedQuestions(getArrayNewFormat(savedRecords, 'success', updateSlaAuditInfo.data));
      setTimeout(() => {
        setExtraLoad('no');
      }, 1500);
    } else if (updateSlaAuditInfo && updateSlaAuditInfo.err) {
      setExtraLoad('yes');
      setSavedRecords(getArrayNewFormat(savedRecords, 'failed'));
      setSavedQuestions(getArrayNewFormat(savedRecords, 'failed'));
      setTimeout(() => {
        setExtraLoad('no');
      }, 1500);
    }
  }, [updateSlaAuditInfo]);

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
            {(getFailedQtns()) && (
            <Alert color="warning" className="mt-2 position-sticky font-family-tab">
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
          <Col md={3} sm={12} xs={12} lg={3} className="sticky-filter thin-scrollbar p-2">
            {(categories && categories.length > 0) && sortCategories(categories).map((cat) => (
              <div
                key={cat[0].sla_category_id}
                aria-hidden
                onClick={() => setCategoryId(cat[0].sla_category_id.id)}
                className={categoryId === cat[0].sla_category_id.id ? 'p-2 bg-transparent-grey cursor-pointer font-family-tab' : 'p-2 cursor-pointer font-family-tab'}
              >
                <p
                  className={categoryId === cat[0].sla_category_id.id ? 'font-weight-700 m-0 font-14 font-family-tab' : 'font-weight-500 font-14 m-0 font-family-tab'}
                >
                  {getCatQtnsCount(
                    inspDeata.sla_audit_lines,
                    cat && cat[0].sla_category_id && cat[0].sla_category_id.id ? cat[0].sla_category_id.id : '',

                    'answer',
                  ) === 0
                    ? <img src={notStarted} height="26" width="26" className="width-26px mr-2" alt="notStarted" />
                    : getCatQtnsCount(
                      inspDeata.sla_audit_lines,
                      cat && cat[0].sla_category_id && cat[0].sla_category_id.id ? cat[0].sla_category_id.id : '',

                      'answer',
                    ) !== getCatQtnsCount(
                      inspDeata.sla_audit_lines,
                      cat && cat[0].sla_category_id && cat[0].sla_category_id.id ? cat[0].sla_category_id.id : '',

                      'total',
                    )
                      ? <img src={inProgress} className="height-15 mr-2" alt="inprogress" />
                      : <img src={fullyAssignIcon} className="height-15 mr-2" alt="completed" /> }
                  {cat[0].sla_category_id && cat[0].sla_category_id.name ? cat[0].sla_category_id.name : ''}
                  <p className="float-right font-weight-700 m-0">
                    {`(${getCatQtnsCount(
                      inspDeata.sla_audit_lines,
                      cat && cat[0].sla_category_id && cat[0].sla_category_id.id ? cat[0].sla_category_id.id : '',

                      'answer',
                    )} / 
                    ${getCatQtnsCount(
                      inspDeata.sla_audit_lines,
                      cat && cat[0].sla_category_id && cat[0].sla_category_id.id ? cat[0].sla_category_id.id : '',

                      'total',
                    )})`}

                    {categoryId === cat[0].sla_category_id.id && (
                    <FontAwesomeIcon className={getLastUpdated() ? 'font-weight-700 ml-1 mt-2' : 'font-weight-700 ml-1'} size="md" icon={faAngleRight} />
                    )}
                  </p>
                  {categoryId === cat[0].sla_category_id.id && getLastUpdated() && (
                  <p className="font-family-tab font-size-10px font-weight-400 mb-0 mt-0 ml-4 pl-1">
                    Last Updated On:
                      {' '}
                    {getLastUpdated()}
                  </p>
                  )}
                  {categoryId === cat[0].sla_category_id.id && isReviewUserExists(cat[0].sla_category_id.id) && isApproveUserExists(cat[0].sla_category_id.id) && (
                  <div className="mt-3 font-family-tab">
                    <ToggleButtonGroup
                      sx={{
                        maxHeight: '28px',
                      }}
                      exclusive
                      size="small"
                      onChange={(e) => handleStatusCheckboxChange(e, cat[0].sla_category_id.id)}
                      value={getCategoryStatus(cat[0].sla_category_id.id)}
                      buttonStyle="solid"
                      disabled={inspDeata.state === 'Approved'}
                    >
                      <ToggleButton disabled={inspDeata.state !== 'Draft'} value="Draft" selectedColor={AddThemeColor({}).color}>Draft</ToggleButton>
                      <ToggleButton
                        disabled={!getCatQtnsIsAllAnswered(
                          inspDeata.sla_audit_lines,
                          cat && cat[0].sla_category_id && cat[0].sla_category_id.id ? cat[0].sla_category_id.id : '',
                        ) || (isMultipleEvaluation && inspDeata.state === 'Draft' && getCurrentStageData())}
                        value="Submitted"
                        selectedColor={AddThemeColor({}).color}
                      >
                        Submitted
                      </ToggleButton>
                      <ToggleButton
                        disabled={!getCatQtnsIsAllAnswered(
                          inspDeata.sla_audit_lines,
                          cat && cat[0].sla_category_id && cat[0].sla_category_id.id ? cat[0].sla_category_id.id : '',
                        ) || !isReviewUser(cat[0].sla_category_id.id) || (inspDeata.state !== 'Submitted')}
                        value="Reviewed"
                        selectedColor={AddThemeColor({}).color}
                      >
                        Reviewed
                      </ToggleButton>
                      <ToggleButton
                        disabled={!getCatQtnsIsAllAnswered(
                          inspDeata.sla_audit_lines,
                          cat && cat[0].sla_category_id && cat[0].sla_category_id.id ? cat[0].sla_category_id.id : '',
                        ) || !isApproveUser(cat[0].sla_category_id.id) || (inspDeata.state !== 'Reviewed')}
                        value="Approved"
                        selectedColor={AddThemeColor({}).color}
                      >
                        Approved
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </div>
                  )}
                </p>
              </div>
            ))}
          </Col>
          <Col md={9} sm={12} xs={12} lg={9} className="h-100 sticky-filter thin-scrollbar">
            <Spin spinning={!!(((updateSlaAuditInfo && updateSlaAuditInfo.loading) || (extraLoad === 'yes')))}>
              <div className="ml-0 mt-2">
                {(accordion.length > 0) && (sections && sections.length > 0) && sections.map((section, index) => (
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
                          className="text-left m-0 p-0 border-0 box-shadow-none font-family-tab"
                          onClick={() => toggleAccordion(index)}
                          aria-expanded={accordion[index]}
                          aria-controls={`collapse${index}`}
                        >
                          <span className="collapse-heading font-weight-800 font-family-tab">
                            {section && section[0].question_group_id && section[0].question_group_id.name ? section[0].question_group_id.name : 'General'}
                            {' '}
                            {section && section[0].question_group_id && section[0].question_group_id.remarks && (
                            <Tooltip title="Guideline">
                              <span className="text-info cursor-pointer">
                                <FontAwesomeIcon className="ml-1" size="sm" icon={faInfoCircle} onClick={() => onViewOpen(section[0].question_group_id.name, section[0].question_group_id.remarks)} />
                              </span>
                            </Tooltip>
                            )}
                            {section && section[0].question_group_id && section[0].question_group_id.weightage && !checkIsApplicable(section[0].question_group_id.id) && (
                            <Tooltip title="Weightage %">
                              <span className="ml-2 font-family-tab">
                                (
                                {section[0].question_group_id.weightage}
                                % )
                              </span>
                            </Tooltip>
                            )}
                          </span>
                          <span className="float-right font-weight-800 font-family-tab">
                            {inspDeata.state === 'Draft' && (
                            <Switch
                              className="mr-2 custom-ant-switch"
                              onChange={(checked) => handleCheckboxChange(checked, section[0].question_group_id.id)}
                              checkedChildren="Applicable"
                              unCheckedChildren="Not-Applicable"
                              loading={(currentGroupId === section[0].question_group_id.id) && updateSlaAuditNoInfo && updateSlaAuditNoInfo.loading && dataType && dataType === 'toggle'}
                              checked={!checkIsApplicable(section[0].question_group_id.id)}
                            />
                            )}
                            {!checkIsApplicable(section[0].question_group_id.id) && (
                            <>
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
                            </>
                            )}
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
                            <Table responsive className="mb-0 mt-2 font-weight-400 border-0 assets-table" width="100%">
                              <thead>
                                <tr>
                                  <th className="p-2 min-width-160 font-family-tab font-14">
                                    Parameter Criteria
                                  </th>
                                  {!isMultipleEvaluation && hasTarget && (
                                  <th className="p-2 min-width-180 font-family-tab font-14">
                                    Target Value
                                  </th>
                                  )}
                                  {!isMultipleEvaluation && (
                                  <th className="p-2 min-width-180 font-family-tab font-14">
                                    Measured Value
                                  </th>
                                  )}
                                  {isMultipleEvaluation && evaluators && evaluators.length > 0 && evaluators.map((ev) => (
                                    <th className="p-2 min-width-160 font-family-tab font-14">
                                      {ev.name}
                                    </th>
                                  ))}
                                  {((isMultipleEvaluation && (isFinalStage() || !getCurrentStageData())) || !isMultipleEvaluation) && (
                                  <th align="right" className="text-right p-2 min-width-160 font-family-tab font-14">
                                    Achieved Score
                                  </th>
                                  )}
                                </tr>
                              </thead>
                              <tbody>
                                {getRow(
                                  questionGroups,
                                  section && section[0].question_group_id && section[0].question_group_id.id ? section[0].question_group_id.id : '',
                                )}
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
          <Dialog maxWidth="xl" fullWidth open={attachmentModal}>
            <DialogHeader title={currentName} onClose={() => setAttachmentModal(false)} />
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                <Documents
                  viewId={currentId}
                  reference={currentName}
                  resModel={appModels.SLAAUDITLINE}
                  model={appModels.DOCUMENT}
                />
              </DialogContentText>
            </DialogContent>
          </Dialog>
          <Dialog maxWidth="lg" fullWidth open={isViewRemarks}>
            <DialogHeader title={`${currentGroup} - Guideline`} fontAwesomeIcon={faInfoCircle} onClose={() => onViewClose()} />
            <DialogContent>
              <DialogContentText id="alert-dialog-description">

                {currentRemarks}
              </DialogContentText>
            </DialogContent>
          </Dialog>
          <Dialog maxWidth="xl" fullWidth open={qtnRemarksModal}>
            <DialogHeader title={currentName} ontAwesomeIcon={faInfoCircle} onClose={() => onRemarksClose()} hideClose={!!(currentAnswer && currentAnswer === 'NA' && !currentRemarks)} />
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                <Row className="">
                  <Col xs={12} sm={12} md={12} lg={12}>
                    <Label className="mt-0 font-family-tab">
                      Remarks
                      {' '}
                      {currentAnswer && currentAnswer === 'NA' && (
                      <span className="ml-1 text-danger">*</span>
                      )}
                    </Label>
                    <Input type="textarea" name="body" label="Action Taken" disabled={inspDeata.state !== 'Draft'} placeholder="Enter here" value={currentRemarks || ''} onChange={onMessageChange} className="bg-whitered" rows="4" />
                    {currentAnswer && currentAnswer === 'NA' && !currentRemarks && (<span className="text-danger ml-1">Remarks required</span>)}
                  </Col>
                </Row>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <ButtonMUI
                type="button"
                variant="contained"
                size="md"
                disabled={!currentRemarks}
                className="mr-1"
                onClick={() => onRemarksSaveClose(currentRemarks)}
              >
                Save
              </ButtonMUI>
            </DialogActions>
          </Dialog>
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
