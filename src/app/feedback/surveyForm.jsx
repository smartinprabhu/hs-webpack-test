/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-return-assign */
/* eslint-disable radix */
/* eslint-disable prefer-destructuring */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
import React, {
  useMemo, useState, useEffect, useCallback,
} from 'react';
import {
  Col,
  Form,
  Row,
  Alert,
} from 'reactstrap';

import { makeStyles } from '@material-ui/core/styles';
import * as PropTypes from 'prop-types';
import axios from 'axios';
import { Tooltip, Progress } from 'antd';
import moment from 'moment-timezone';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import * as Icons from '@fortawesome/free-solid-svg-icons';
import * as Icons1 from '@fortawesome/free-regular-svg-icons';
import { Emoji } from 'emoji-mart';
import { useIdleTimer } from 'react-idle-timer';
import { Markup } from 'interweave';
import {
  FormControlLabel, Radio, Checkbox, Button, FormGroup, Input,
} from '@mui/material';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Dialog from '@mui/material/Dialog';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';

import timer from '@images/icons/timer.png';
import checkGreen from '@images/icons/checkGreen.svg';

import DialogHeader from '../commonComponents/dialogHeader';
import {
  integerKeyPress,
  generateArrayFromInnerExtra, detectMob,
  getColumnArrayById,
  getArrayFromValues,
} from '../util/appUtils';
import {
  newpercalculate,
  groupByMultiple,
} from '../util/staticFunctions';
import { storeSurveyToken } from '../helpdesk/ticketService';

const appConfig = require('../config/appConfig').default;

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
      color: '#fff',
    },
  },
  checked: {},
  MuiFormControlLabel: {
    label: {
      fontSize: '30px',
    },
  },
});

const SurveyForm = (props) => {
  const {
    onNext,
    detailData,
    type,
    accid,
    ruuid,
    clearForm,
    auid,
    lastAnswer,
  } = props;
  const WEBAPPAPIURL = `${window.location.origin === 'http://localhost:3010' ? 'http://localhost:3000' : window.location.origin}/`;

  const classes = useStyles();
  const dispatch = useDispatch();
  const isMobileView = detectMob();

  const { surveyToken } = useSelector((state) => state.ticket);

  const [answerValues, setAnswerValues] = useState([]);
  const [answerMultiValues, setMultiAnswerValues] = useState([]);
  const [createInfo, setCreateInfo] = useState({ loading: false, data: null, err: null });
  const [errorId, setErrorId] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const [counter, setCounter] = React.useState(11);

  const [isIdle, setIsIdle] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  const handleOnActive = useCallback(() => {
    console.log('User is active');
    setIsIdle(false);
  }, []);

  React.useEffect(() => {
    if (detailData && detailData.successful_homepage_return_time) {
      setCounter(detailData.successful_homepage_return_time);
    } else {
      setCounter(0);
    }
  }, [detailData]);

  React.useEffect(() => {
    if (createInfo && createInfo.data && createInfo.count) {
      const timer = counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [counter, createInfo]);

  const resetRequest = useCallback(() => {
    console.log('Resetting survey');
    setRemainingTime(0);
    setIsIdle(true);
    setAnswerValues([]);
    setErrorId(false);
    setValidationMessage('');
    dispatch(storeSurveyToken(false));
    setMultiAnswerValues([]);
    onNext();
    clearForm();
    window.location.reload(false);
  }, [onNext, dispatch]);

  React.useEffect(() => {
    if (createInfo && createInfo.data && createInfo.count && counter === 0) {
      resetRequest();
    }
  }, [counter, createInfo]);

  let idle_expiry_time = 500;

  if (detailData?.survey_time > 0) {
    idle_expiry_time = parseInt(detailData.survey_time, 10);
  }

  const { getRemainingTime } = useIdleTimer({
    timeout: 1000 * 60 * idle_expiry_time,
    onIdle: resetRequest,
    onActive: handleOnActive,
  });

  useEffect(() => {
    if (getRemainingTime && detailData?.survey_time > 0) {
      const interval = setInterval(() => {
        setRemainingTime(getRemainingTime());
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [getRemainingTime, detailData?.survey_time]);

  function getFieldType(typeVal) {
    let result = 'text';
    if (typeVal === 'free_text') {
      result = 'textarea';
    } else if (typeVal === 'numerical_box') {
      result = 'number';
    } else if (typeVal === 'date') {
      result = 'date';
    } else if (typeVal === 'textbox') {
      result = 'text';
    }

    return result;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (detailData && detailData.uuid && (auid || detailData.token || surveyToken)) {
      setCreateInfo({
        loading: true, data: null, count: 0, err: null,
      });

      const trimData = answerValues.filter((item) => item.answer);

      const postValues = [...trimData, ...answerMultiValues];

      const payload = { uuid: detailData.uuid, token: auid || detailData.token || surveyToken, values: postValues };

      if (type && ruuid) {
        payload.type = type;
        payload.ruuid = ruuid;
      }

      const postData = new FormData();
      if (payload && payload.values) {
        postData.append('values', JSON.stringify(payload.values));
      } else if (typeof payload === 'object') {
        Object.keys(payload).map((payloadObj) => {
          if ((payloadObj !== 'uuid')
            || (payloadObj !== 'token')
            || (payloadObj !== 'ruuid')
            || (payloadObj !== 'type')) {
            postData.append(payloadObj, payload[payloadObj]);
          }
          return postData;
        });
      }

      postData.append('uuid', payload.uuid);

      postData.append('token', payload.token);

      if (payload.ruuid) {
        postData.append('ruuid', payload.ruuid);
      }

      if (payload.type) {
        postData.append('type', payload.type);
      }

      const config = {
        method: 'post',
        url: `${WEBAPPAPIURL}public/api/v4/survey/createRequest`,
        headers: {
          'Content-Type': 'multipart/form-data',
          portalDomain: window.location.origin,
          accountId: accid,
        },
        data: postData,
      };

      axios(config)
        .then((response) => setCreateInfo({
          loading: false, data: response.data.data, count: response.data.status, err: response.data.error,
        }))
        .catch((error) => {
          setCreateInfo({
            loading: false, data: null, count: 0, err: error,
          });
        });
    }
  };

  const handleInputBlur = (event, checklist) => {
    const { value } = event.target;
    if (event && event.key && event.key === 'Enter') {
      const data = [{
        question_id: checklist.id, answer: value, answer_type: checklist.type, constr_mandatory: checklist.constr_mandatory,
      }];
      const arr = [...answerValues, ...data];
      setAnswerValues([...new Map(arr.map((item) => [item.question_id, item])).values()]);
      if (!value && checklist && checklist.constr_mandatory) {
        setValidationMessage('This question need an answer');
        setErrorId(checklist.id);
      }
    }
    if (value && checklist) {
      if ((checklist.type !== 'numerical_box' && checklist.validation_length_min && value.length < checklist.validation_length_min)
        || (checklist.type === 'numerical_box' && checklist.validation_min_float_value && parseFloat(value) < checklist.validation_min_float_value)
        || (checklist.type === 'numerical_box' && checklist.validation_max_float_value && parseFloat(value) > checklist.validation_max_float_value)) {
        setValidationMessage(checklist.validation_error_msg);
        setErrorId(checklist.id);
      } else {
        setValidationMessage('');
        setErrorId(false);
      }
    }

    if (!value && checklist && checklist.constr_mandatory) {
      setValidationMessage(checklist.constr_error_msg);
      setErrorId(checklist.id);
    }
  };

  const handleInputChange = (event, checklist) => {
    const { value } = event.target;
    const data = [{
      question_id: checklist.id, answer: value, answer_type: checklist.type, constr_mandatory: checklist.constr_mandatory,
    }];
    const arr = [...answerValues, ...data];
    setAnswerValues([...new Map(arr.map((item) => [item.question_id, item])).values()]);
    if (!value && checklist && checklist.constr_mandatory) {
      setValidationMessage('This question need an answer');
      setErrorId(checklist.id);
    }
  };

  const handleCheckChange = (event, checklist, lids) => {
    const { checked } = event.target;
    if (checked) {
      const data = [{
        question_id: checklist.id, answer: lids.id, answer_type: checklist.type, constr_mandatory: checklist.constr_mandatory,
      }];
      const arr = [...answerValues, ...data];
      setAnswerValues([...new Map(arr.map((item) => [item.question_id, item])).values()]);
    } else {
      setAnswerValues(answerValues.filter((item) => item.question_id !== checklist.id));
    }
  };

  const handleCheckIconChange = (checklist, lids) => {
    const isData = answerMultiValues.filter((item) => (item.answer === checklist.id));

    const isIconChecked = isData && isData.length;

    if (!isIconChecked) {
      const data = [{
        question_id: checklist.id, answer: lids.id, answer_type: checklist.type, constr_mandatory: checklist.constr_mandatory,
      }];
      const arr = [...answerValues, ...data];
      setAnswerValues([...new Map(arr.map((item) => [item.question_id, item])).values()]);
    } else {
      setAnswerValues(answerValues.filter((item) => item.question_id !== checklist.id));
    }
  };

  const handleCheckMultiChange = (event, checklist, lids) => {
    const { checked } = event.target;
    if (checked) {
      const data = [{
        question_id: checklist.id, answer: lids.id, answer_type: checklist.type, constr_mandatory: checklist.constr_mandatory,
      }];
      const arr = [...answerMultiValues, ...data];
      setMultiAnswerValues([...new Map(arr.map((item) => [item.answer, item])).values()]);
    } else {
      setMultiAnswerValues(answerMultiValues.filter((item) => (item.answer !== lids.id)));
    }
  };

  const handleCheckMultiIconChange = (checklist, lids) => {
    const isData = answerMultiValues.filter((item) => (item.answer === lids.id));

    const isIconChecked = isData && isData.length;

    if (!isIconChecked) {
      const data = [{
        question_id: checklist.id, answer: lids.id, answer_type: checklist.type, constr_mandatory: checklist.constr_mandatory,
      }];
      const arr = [...answerMultiValues, ...data];
      setMultiAnswerValues([...new Map(arr.map((item) => [item.answer, item])).values()]);
    } else {
      setMultiAnswerValues(answerMultiValues.filter((item) => (item.answer !== lids.id)));
    }
  };

  function isChecked(checklist, lids) {
    let res = false;
    const isData = answerValues.filter((item) => (item.question_id === checklist.id && item.answer === lids.id));
    if (isData && isData.length) {
      res = true;
    }
    return res;
  }

  function getInputValue(checklist) {
    let res = '';
    const isData = answerValues.filter((item) => (item.question_id === checklist.id));
    if (isData && isData.length) {
      res = isData[0].answer;
    }
    return res;
  }

  function isMultiChecked(checklist, lids) {
    let res1 = false;
    const isData = answerMultiValues.filter((item) => (item.answer === lids.id));
    if (isData && isData.length) {
      res1 = true;
    }

    return res1;
  }

  const isConditionBased = useCallback(
    (checklist) => {
      const parentId = checklist.parent_id?.id || false;
      // const targetValue = checklist.based_on_ids?.[0]?.id || false;
      const targetValue = getColumnArrayById(checklist.based_on_ids, 'id');
      const isData = answerValues.filter((item) => item.question_id === parentId);
      const baseValue = isData.length ? isData[0].answer : false;
      const condApplied = targetValue.includes(baseValue);
      if (checklist.is_enable_condition && parentId && targetValue && !condApplied) {
        const index = answerValues.findIndex((item) => item.question_id === checklist.id);
        if (index !== -1 && answerValues[index].answer !== '') {
          const updatedData = answerValues.filter((item) => item.question_id !== checklist.id);
          setAnswerValues(updatedData);
        }
        return false;
      }
      return true;
    },
    [answerValues, setAnswerValues],
  );

  const answeredValues = answerValues.filter((item) => (item.answer && item.answer !== ''));
  const answeredValuesMulti = answerMultiValues.filter((item) => (item.answer && item.answer !== ''));

  const multiAnswered = answeredValuesMulti && answeredValuesMulti.length ? answeredValuesMulti : [];

  const multiAnswereddata = multiAnswered && multiAnswered.length ? groupByMultiple(multiAnswered, (obj) => (obj.question_id ? obj.question_id : '')) : [];

  const answeredCount = parseInt(answeredValues.length) + parseInt(multiAnswereddata.length);

  const qtns = detailData && detailData.pages && detailData.pages.length ? generateArrayFromInnerExtra(detailData.pages, 'questions', 'title') : false;


  const pages = qtns ? groupByMultiple(qtns, (obj) => (obj.title ? obj.title : '')) : [];

  function getPageQuestions(arr, title) {
    let res = [];
    const data = arr.filter((item) => item.title === title);
    if (data && data.length) {
      res = data;
    }
    return res;
  }


  const reqQuestions = qtns && qtns.length ? qtns.filter((item) => (item.constr_mandatory)) : [];

  const conditionQtnsIsMand = useMemo(() => reqQuestions?.filter(
    (item) => item.is_enable_condition && !isConditionBased(item),
  ) || [], [reqQuestions]);

  const ansReqQtns1 = reqQuestions && reqQuestions.length ? getArrayFromValues([...answerValues, ...answerMultiValues], getColumnArrayById(reqQuestions, 'id'), 'question_id') : [];

  const ansReqQtns = ansReqQtns1 && ansReqQtns1.length ? ansReqQtns1.filter((item) => (item.answer)) : [];

  const activeMandQtnCount = reqQuestions.length - conditionQtnsIsMand.length;
  const answeredMandQtnCount = ansReqQtns.length;

  const isAllMandAnswered = answeredMandQtnCount >= activeMandQtnCount;

  const allAnswerQuestions = [...answerValues, ...answerMultiValues];

  // const isAllAnswered = (totalQuestions === answeredCount);

  // const ansPerc = newpercalculate(totalQuestions, answeredCount);

  const qtnsList = qtns && qtns.length ? qtns : false;

  const qtnListOrdered = qtnsList ? qtnsList.sort((a, b) => a.sequence - b.sequence) : false;

  let count = 0;

  return (
    <Row>
      <Col md="12" sm="12" lg="12" xs="12" className={isMobileView ? 'pl-0' : ''}>
        {lastAnswer && lastAnswer.last_answered_on && lastAnswer.last_answered_on !== '' && (
          <Alert color="primary" className="font-family-tab">
            You have answered this survey/feedback on
            {' '}
            {moment.utc(lastAnswer.last_answered_on).local().format('MM/DD/YYYY hh:mm A')}
          </Alert>
        )}
        <Form id="surveyList" onSubmit={handleSubmit}>
          {(createInfo && !createInfo.count && !createInfo.loading && detailData && detailData.survey_time > 0) && (
            <div className="pull-right">
              <img src={timer} className="mr-2" alt="timer" width="15" height="15" />
              <span className="font-tiny font-weight-700 font-family-tab">
                Less than
                {'  '}
                {detailData.survey_time ? parseInt(detailData.survey_time) : '1'}
                {'  '}
                {detailData.survey_time && parseInt(detailData.survey_time) > 1 ? 'minutes' : 'minute'}
              </span>
            </div>
          )}
          <br />
          {(createInfo && !createInfo.count && !createInfo.loading && pages && pages.length > 0) && pages.map((pg) => (
            <>
              <h6 className="page-title font-family-tab">{pg[0].title}</h6>
              {(createInfo && !createInfo.count && !createInfo.loading) && getPageQuestions(qtnListOrdered, pg[0].title).map((qtn) => (
                <Row key={qtn.question}>
                  <Col md="12" sm="12" lg="12" xs="12">
                    {isConditionBased(qtn) && (
                    <>
                      <div className="question-info-circle border-light-slate-grey-1px background-color-unset">
                        <span className="font-weight-800 font-family-tab question-info-label left-n6">{count += 1}</span>
                      </div>
                      <div className="user-info-text">
                        <p className="font-weight-800 mb-0 ml-1 font-size-16px font-family-tab">
                          {qtn.question}
                          {qtn.constr_mandatory && (
                          <span className="text-danger ml-2">*</span>
                          )}
                          {qtn.helper_text && (
                          <Tooltip title={(<Markup content={qtn.helper_text} />)} placement="top">
                            <span className="text-info font-family-tab">
                              <FontAwesomeIcon
                                size="md"
                                className="height-15 ml-2 cursor-pointer"
                                icon={Icons.faInfoCircle}
                              />
                            </span>
                          </Tooltip>
                          )}
                        </p>
                      </div>
                      {qtn.type !== 'matrix' && qtn.type !== 'simple_choice' && qtn.type !== 'multiple_choice' && (
                      <FormGroup className="pl-3 ml-5 mt-0 mb-0">
                        <Input
                          inputProps={{
                            maxLength: qtn.validation_length_max ? qtn.validation_length_max : 150,
                          }}
                          multiline={qtn.type === 'free_text'}
                          name={qtn.question}
                          type={getFieldType(qtn.type)}
                          required={qtn.constr_mandatory}
                          onKeyPress={(e) => {
                            if (getFieldType(qtn.type) === 'number') {
                              integerKeyPress(e);
                            }
                          }}
                          defaultValue={getInputValue(qtn)}
                          min={qtn.type === 'date' && qtn.validation_min_date ? moment(new Date(qtn.validation_min_date)).format('YYYY-MM-DD') : false}
                          max={qtn.type === 'date' && qtn.validation_max_date ? moment(new Date(qtn.validation_max_date)).format('YYYY-MM-DD') : false}
                          onBlur={(e) => handleInputChange(e, qtn)}
                          onChange={(e) => handleInputBlur(e, qtn)}
                          onKeyDown={(e) => handleInputBlur(e, qtn)}
                        />
                        {errorId && errorId === qtn.id && validationMessage && (
                          <p className="text-danger mt-1 mb-0">{validationMessage}</p>
                        )}
                      </FormGroup>
                      )}
                      {qtn.type === 'simple_choice' && (
                      <div className={`${isMobileView && qtn.response_type === 'Star Rating' ? 'pl-1' : 'pl-2'} ml-5 mb-0 mt-2`}>
                        <Row>
                          {qtn.labels_ids && qtn.labels_ids.map((lid) => (
                            <Col
                              md={qtn.response_type === 'Star Rating' ? '2' : '3'}
                              sm={isMobileView && qtn.response_type === 'Star Rating' ? '2' : '6'}
                              lg={qtn.response_type === 'Star Rating' ? '2' : '3'}
                              xs={isMobileView && qtn.response_type === 'Star Rating' ? '2' : '6'}
                              key={lid.id}
                              className="text-center cursor-pointer"
                              onClick={() => handleCheckIconChange(qtn, lid)}
                            >
                              {(lid.favicon || lid.emoji) && (
                                <div
                                  style={isChecked(qtn, lid) && !(isMobileView && qtn.response_type === 'Star Rating') ? { border: `2px solid ${lid.color}` } : {}}
                                  className={`${isChecked(qtn, lid) && !(isMobileView && qtn.response_type === 'Star Rating') ? 'highlighted-shadow-box' : ''} ${isMobileView && qtn.response_type === 'Star Rating' ? 'p-0' : 'p-3'}`}
                                >
                                  {lid.favicon && (
                                    <>
                                      <FontAwesomeIcon
                                        icon={lid.favicon}
                                        style={isChecked(qtn, lid) ? { color: lid.color } : {}}
                                        className="fa-2x"
                                        size="lg"
                                      />
                                      {!(isMobileView && qtn.response_type === 'Star Rating') && (
                                        <p
                                          style={isChecked(qtn, lid) ? { color: lid.color } : {}}
                                          className="mt-2 font-family-tab mb-0 text-capital font-10 font-weight-700 word-break-text"
                                        >
                                          {lid.value}
                                        </p>
                                      )}
                                    </>
                                  )}
                                  {lid.emoji && (
                                    <>
                                      {!(isMobileView && qtn.response_type === 'Star Rating') && (
                                        <p
                                          style={isChecked(qtn, lid) ? { color: lid.color } : {}}
                                          className="mb-0 fa-2x "
                                        >
                                          {lid.emoji.length === 2 && !lid.emoji.includes('+1') && !lid.emoji.includes('-1') ? lid.emoji : <Emoji emoji={lid.emoji} set="google" size={32} />}
                                        </p>
                                      )}
                                      {(isMobileView && qtn.response_type === 'Star Rating') && (
                                      <span
                                        style={isChecked(qtn, lid) ? { border: `2px solid ${lid.color}` } : {}}
                                        className={isChecked(qtn, lid) ? 'emoji-selected' : ''}
                                      >
                                        {lid.emoji.length === 2 && !lid.emoji.includes('+1') && !lid.emoji.includes('-1') ? lid.emoji : <Emoji emoji={lid.emoji} set="google" size={32} />}
                                      </span>
                                      )}

                                      <p
                                        style={isChecked(qtn, lid) ? { color: lid.color } : {}}
                                        className={`mt-2 mb-0 font-family-tab ${isMobileView && qtn.response_type === 'Star Rating' ? 'font-8' : 'font-10'} font-weight-700 text-capital word-break-text`}
                                      >
                                        {lid.value}
                                      </p>

                                    </>
                                  )}
                                </div>
                              )}
                            </Col>
                          ))}
                        </Row>
                        {qtn.labels_ids && qtn.labels_ids.map((lid) => (
                          <>
                            {!lid.favicon && !lid.emoji && (
                              <FormControlLabel
                                key={lid.id}
                                checked={isChecked(qtn, lid)}
                                name={qtn.question}
                                value={lid.value}
                                control={(
                                  <Radio
                                    size="small"
                                    required={qtn.constr_mandatory}
                                    onChange={(e) => handleCheckChange(e, qtn, lid)}
                                  />
                                )}
                                label={lid.value}
                              />
                            )}
                          </>
                        ))}
                        {errorId && errorId === qtn.id && validationMessage && (
                          <p className="text-danger mt-3 mb-0 font-family-tab">{validationMessage}</p>
                        )}
                      </div>
                      )}
                      {qtn.type === 'multiple_choice' && (
                      <div className={`${isMobileView && qtn.response_type === 'Star Rating' ? 'pl-1' : 'pl-2'} ml-5 mb-0 mt-2`}>
                        <Row>
                          {qtn.labels_ids && qtn.labels_ids.map((lid) => (
                            <Col
                              md="3"
                              sm={isMobileView && qtn.response_type === 'Star Rating' ? '2' : '6'}
                              lg="3"
                              xs={isMobileView && qtn.response_type === 'Star Rating' ? '2' : '6'}
                              key={lid.id}
                              className="text-center cursor-pointer"
                              onClick={() => handleCheckMultiIconChange(qtn, lid)}
                            >
                              {(lid.favicon || lid.emoji) && (
                                <div
                                  style={isMultiChecked(qtn, lid) && !(isMobileView && qtn.response_type === 'Star Rating') ? { border: `2px solid ${lid.color}` } : {}}
                                  className={`${isMultiChecked(qtn, lid) && !(isMobileView && qtn.response_type === 'Star Rating') ? 'highlighted-shadow-box' : ''} ${isMobileView && qtn.response_type === 'Star Rating' ? 'p-0' : 'p-3'}`}
                                >
                                  {lid.favicon && (
                                    <>
                                      <FontAwesomeIcon
                                        icon={lid.favicon}
                                        className="fa-2x"
                                        style={isMultiChecked(qtn, lid) ? { color: lid.color } : {}}
                                        size="lg"
                                      />
                                      {!(isMobileView && qtn.response_type === 'Star Rating') && (
                                        <p
                                          style={isMultiChecked(qtn, lid) ? { color: lid.color } : {}}
                                          className="mt-2 font-family-tab mb-0 font-10 font-weight-700 text-capital word-break-text"
                                        >
                                          {lid.value}
                                        </p>
                                      )}
                                    </>
                                  )}
                                  {lid.emoji && (
                                    <>
                                      {!(isMobileView && qtn.response_type === 'Star Rating') && (
                                        <p
                                          style={isMultiChecked(qtn, lid) ? { color: lid.color } : {}}
                                          className="fa-2x mb-0"
                                        >
                                          {lid.emoji.length === 2 && !lid.emoji.includes('+1') && !lid.emoji.includes('-1') ? lid.emoji : <Emoji emoji={lid.emoji} set="google" size={32} />}
                                        </p>
                                      )}
                                      {(isMobileView && qtn.response_type === 'Star Rating') && (
                                        <span
                                          style={isMultiChecked(qtn, lid) ? { border: `2px solid ${lid.color}` } : {}}
                                          className={isMultiChecked(qtn, lid) ? 'emoji-selected' : ''}
                                        >
                                          {lid.emoji.length === 2 && !lid.emoji.includes('+1') && !lid.emoji.includes('-1') ? lid.emoji : <Emoji emoji={lid.emoji} set="google" size={32} />}
                                        </span>
                                      )}
                                      <p
                                        style={isMultiChecked(qtn, lid) ? { color: lid.color } : {}}
                                        className="mt-2 font-family-tab mb-0 font-10 font-weight-700 text-capital word-break-text"
                                      >
                                        {lid.value}
                                      </p>
                                    </>
                                  )}
                                </div>
                              )}
                            </Col>
                          ))}
                        </Row>
                        {qtn.labels_ids && qtn.labels_ids.map((lid) => (
                          <>
                            {!lid.favicon && !lid.emoji && (
                              <FormControlLabel
                                key={lid.id}
                                name={lid.value}
                                value={lid.value}
                                control={(
                                  <Checkbox
                                    size="small"
                                    required={qtn.constr_mandatory}
                                    onChange={(e) => handleCheckMultiChange(e, qtn, lid)}
                                  />
                                )}
                                label={lid.value}
                              />
                            )}
                          </>
                        ))}
                      </div>
                      )}
                    </>
                    )}
                  </Col>
                </Row>
              ))}
            </>
          ))}
          {(createInfo && !createInfo.count && !createInfo.loading) && (
            <div className="text-center ml-5 mt-2 font-family-tab">
              <Progress percent={parseInt(newpercalculate(count, answeredCount))} showInfo={false} />
              <p className="font-tiny font-weight-700 font-family-tab">
                {(parseInt(answeredCount) <= parseInt(count)) ? answeredCount : count}
                {' '}
                /
                {' '}
                {count}
                {' '}
                answered
              </p>
            </div>
          )}
          {!isAllMandAnswered && reqQuestions.length > 0 && (
            <p className="text-center ml-5 mt-2 text-danger font-family-tab">(*) Please fill all the mandatory questions</p>
          )}
          {(createInfo && createInfo.data && !createInfo.count) && (
            <div className="text-center mt-5 font-family-tab">
              <SuccessAndErrorFormat response={createInfo} />
            </div>
          )}
          {(createInfo && createInfo.loading) && (
            <div className="text-center mt-3">
              <Loader />
            </div>
          )}
          {(createInfo && createInfo.data && createInfo.count) && (
            <>
              <div className="text-center p-2">
                <img src={checkGreen} className="mr-2" alt="Approved" width="20" height="20" />
                <span className="text-success font-weight-800 font-size-15px font-family-tab">
                  {detailData.feedback_text ? detailData.feedback_text : 'Thank you for your feedback.'}
                </span>
                {counter > 0 && (
                <p className="mt-2">
                  Returning back to the home page in
                  {' '}
                  {counter}
                  {' '}
                  seconds
                </p>
                )}
              </div>
              { /* <hr />
        <div className="float-right mt-1">
          <Button
            type="button"
            size="md"
            onClick={() => resetRequest()}
             variant="contained"
          >
            <span>Ok</span>
          </Button>
        </div> */ }
            </>
          )}
          {createInfo && createInfo.err && createInfo.data && createInfo.data.length <= 0 && (
          <Col md={{ size: 6, offset: 3 }} sm="12" lg={{ size: 6, offset: 3 }} xs="12">
            <div className="text-center mt-3 mb-3">
              <h6 className="text-danger font-family-tab">
                Oops!
                {' '}
                {createInfo.err.message ? createInfo.err.message : 'Something Went wrong'}
              </h6>
            </div>
          </Col>
          )}
          {(createInfo && !createInfo.count && !createInfo.loading) && (
            <>
              <hr />
              <div className="float-right mt-1">
                {(detailData.requires_verification_by_otp || detailData.has_reviwer_email !== 'None' || detailData.has_reviwer_name !== 'None' || detailData.has_reviwer_mobile !== 'None')
                  && (
                    <Button
                      type="button"
                      variant="contained btn-cancel"
                      className="mr-2"
                      onClick={() => resetRequest()}
                    >
                      <span>Cancel</span>
                    </Button>
                  )}
                <Button
                  disabled={!isAllMandAnswered || errorId || (createInfo && createInfo.loading) || !(allAnswerQuestions.length)}
                  type="submit"
                  variant="contained"
                >
                  <span>Submit</span>
                </Button>
              </div>
            </>
          )}
        </Form>
        <Dialog fullWidth={isMobileView} maxWidth={isMobileView ? 'xl' : 'md'} open={remainingTime && detailData?.survey_time > 0 && remainingTime < 10000}>
          <DialogHeader title="Alert" hideClose response={false} imagePath={false} />
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <div className="text-center font-family-tab">
                You’ve been idle for a while. Returning to home page in
                {' '}
                {Math.ceil(remainingTime / 1000)}
                {' '}
                seconds.
              </div>
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </Col>
    </Row>
  );
};

SurveyForm.propTypes = {
  onNext: PropTypes.func.isRequired,
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  lastAnswer: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  type: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  ruuid: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
  ]).isRequired,
  auid: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
  ]).isRequired,
};

export default SurveyForm;
