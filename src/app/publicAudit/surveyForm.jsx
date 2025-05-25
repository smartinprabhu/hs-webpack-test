/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-console */
/* eslint-disable no-return-assign */
/* eslint-disable radix */
/* eslint-disable prefer-destructuring */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';
import {
  Col,
  FormGroup,
  Form,
  Input,
  Row,
  Modal,
  ModalBody,
  Toast,
  ToastBody,
  ToastHeader,
} from 'reactstrap';
import Button from '@mui/material/Button';
import {
  FormControlLabel, Radio,
  Checkbox,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import * as PropTypes from 'prop-types';
import axios from 'axios';
import { Progress, Image, Tooltip } from 'antd';
import moment from 'moment-timezone';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import * as Icons from '@fortawesome/free-solid-svg-icons';
import * as Icons1 from '@fortawesome/free-regular-svg-icons';
import { Emoji } from 'emoji-mart';
import ReactFileReader from 'react-file-reader';
import {
  faTrashAlt, faArrowRight, faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';
import DOMPurify from 'dompurify';

import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';
import ModalHeaderComponent from '@shared/modalHeaderComponent';

import timer from '@images/icons/timer.png';
import checkGreen from '@images/icons/checkGreen.svg';
import uploadIcon from '@images/icons/uploadPhotoBlue.svg';
import fileMiniIcon from '@images/icons/fileMini.svg';
import checkCircleBlack from '@images/icons/checkCircleBlack.svg';

import {
  lettersOnly, integerKeyPress,
  generateArrayFromInner, detectMob,
  getLocalTimeSeconds,
  truncate,
  getColumnArrayById,
  getArrayFromValuesByIdIn,
  convertNumToTime,
} from '../util/appUtils';
import {
  newpercalculate,
  bytesToSizeLow,
} from '../util/staticFunctions';
import { storeSurveyToken } from '../helpdesk/ticketService';
import ImageUpload from '../externalWorkPermit/checklists/imageUpload';

const appConfig = require('../config/appConfig').default;
const appModels = require('../util/appModels').default;

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
    auditData,
    accid,
  } = props;
  const WEBAPPAPIURL = `${window.location.origin}/`;

  const classes = useStyles();
  const dispatch = useDispatch();
  const isMobileView = detectMob();

  const [answerValues, setAnswerValues] = useState([]);
  const [answerMultiValues, setMultiAnswerValues] = useState([]);
  const [createInfo, setCreateInfo] = useState({ loading: false, data: null, err: null });
  const [errorId, setErrorId] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const [infoId, setInfoId] = useState(false);
  const [infoMessage, setInfoMessage] = useState('');
  const [page, setPage] = useState(1);

  const [errorShow, setErrorShow] = useState(false);
  const [equipmentImages, setEquipmentImages] = useState([]);
  const currentChecklist = false;
  const [isModal, setModalOpen] = useState(false);
  const [imgSize, setimgSize] = useState(false);

  const resetRequest = () => {
    onNext();
    setAnswerValues([]);
    setErrorId(false);
    setValidationMessage('');
    setInfoId(false);
    setInfoMessage('');
    dispatch(storeSurveyToken(false));
    setMultiAnswerValues([]);
  };

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

  const storeOpportunities = (data) => {
    if (auditData && auditData.uuid && data && data.length) {
      const payload = { uuid: auditData.uuid, values: data };

      const postData = new FormData();
      if (payload && payload.values) {
        postData.append('values', JSON.stringify(payload.values));
      } else if (typeof payload === 'object') {
        Object.keys(payload).map((payloadObj) => {
          if ((payloadObj !== 'uuid')) {
            postData.append(payloadObj, payload[payloadObj]);
          }
          return postData;
        });
      }

      postData.append('uuid', payload.uuid);

      const config = {
        method: 'post',
        url: `${WEBAPPAPIURL}public/api/v4/Action/Create`,
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
            console.log(response.data.data);
            window.localStorage.setItem(('opportunities'), []);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
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

      const data = {
        // uuid: viewId,
        values: newArrData,
      };

      const postData = new FormData();
      postData.append('values', JSON.stringify(data.values));

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
        });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (detailData && detailData.uuid && auditData && auditData.uuid) {
      setCreateInfo({
        loading: true, data: null, count: 0, err: null,
      });

      const postValues = [...answerValues, ...answerMultiValues];

      const payload = { sys_uuid: detailData.uuid, audit_uuid: auditData.uuid, values: postValues };

      const postData = new FormData();
      if (payload && payload.values) {
        postData.append('values', JSON.stringify(payload.values));
      } else if (typeof payload === 'object') {
        Object.keys(payload).map((payloadObj) => {
          if ((payloadObj !== 'sys_uuid')
            || (payloadObj !== 'audit_uuid')) {
            postData.append(payloadObj, payload[payloadObj]);
          }
          return postData;
        });
      }

      postData.append('sys_uuid', payload.sys_uuid);

      postData.append('audit_uuid', payload.audit_uuid);

      const config = {
        method: 'post',
        url: `${WEBAPPAPIURL}public/api/v4/Audit/createRequest`,
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
            setCreateInfo({
              loading: false, data: response.data.data, count: response.data.status, err: response.data.error,
            });
            fileUpload(equipmentImages);
            onNext();
            if (window.localStorage.getItem('opportunities')) {
              storeOpportunities(JSON.parse(window.localStorage.getItem('opportunities')));
            }
          } else if (response.data && response.data.error && response.data.error.message) {
            setCreateInfo({ loading: false, data: null, err: response.data.error.message });
          }
        })
        .catch((error) => {
          setCreateInfo({
            loading: false, data: null, count: 0, err: error,
          });
        });
    }
  };

  const handleInputBlur = (event, checklist) => {
    const { value } = event.target;
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
      question_id: checklist.id, answer: value, answer_type: checklist.type, remarks: '', is_ncr: false,
    }];
    const arr = [...answerValues, ...data];
    setAnswerValues([...new Map(arr.map((item) => [item.question_id, item])).values()]);
    if (!value && checklist && checklist.constr_mandatory) {
      setValidationMessage('This question need an answer');
      setErrorId(checklist.id);
    }
  };

  const handleCommentChange = (event, checklist) => {
    const { value } = event.target;
    const index = answerValues.findIndex((object) => object.question_id === checklist.id);
    if (index !== -1 && answerValues[index]) {
      answerValues[index].remarks = DOMPurify.sanitize(value);
      setAnswerValues(answerValues);
    }
  };

  const handleCheckChange = (event, checklist, lids) => {
    const { checked } = event.target;
    if (checked) {
      const data = [{
        question_id: checklist.id, answer: lids.id, answer_type: checklist.type, remarks: '', is_ncr: lids.is_ncr,
      }];
      const arr = [...answerValues, ...data];
      setAnswerValues([...new Map(arr.map((item) => [item.question_id, item])).values()]);
      if (lids.is_ncr) {
        setInfoMessage('This response will create a non-compliance action.');
        setInfoId(checklist.id);
      } else {
        setInfoMessage('');
        setInfoId(false);
      }
    } else {
      setAnswerValues(answerValues.filter((item) => item.question_id !== checklist.id));
    }
  };

  const handleCheckIconChange = (checklist, lids) => {
    const isData = answerMultiValues.filter((item) => (item.answer === checklist.id));

    const isIconChecked = isData && isData.length;

    if (!isIconChecked) {
      const data = [{
        question_id: checklist.id, answer: lids.id, answer_type: checklist.type, remarks: '', is_ncr: lids.is_ncr,
      }];
      const arr = [...answerValues, ...data];
      setAnswerValues([...new Map(arr.map((item) => [item.question_id, item])).values()]);
      if (lids.is_ncr) {
        setInfoMessage('This response will create a non-compliance action.');
        setInfoId(checklist.id);
      } else {
        setInfoMessage('');
        setInfoId(false);
      }
    } else {
      setAnswerValues(answerValues.filter((item) => item.question_id !== checklist.id));
    }
  };

  const handleCheckMultiChange = (event, checklist, lids) => {
    const { checked } = event.target;
    if (checked) {
      const data = [{
        question_id: checklist.id, answer: lids.id, answer_type: checklist.type, remarks: '', is_ncr: lids.is_ncr,
      }];
      const arr = [...answerMultiValues, ...data];
      setMultiAnswerValues([...new Map(arr.map((item) => [item.answer, item])).values()]);
      if (lids.is_ncr) {
        setInfoMessage('This response will create a non-compliance action.');
        setInfoId(checklist.id);
      } else {
        setInfoMessage('');
        setInfoId(false);
      }
    } else {
      setMultiAnswerValues(answerMultiValues.filter((item) => (item.answer !== lids.id)));
    }
  };

  const handleCheckMultiIconChange = (checklist, lids) => {
    const isData = answerMultiValues.filter((item) => (item.answer === lids.id));

    const isIconChecked = isData && isData.length;

    if (!isIconChecked) {
      const data = [{
        question_id: checklist.id, answer: lids.id, answer_type: checklist.type, remarks: '', is_ncr: lids.is_ncr,
      }];
      const arr = [...answerMultiValues, ...data];
      setMultiAnswerValues([...new Map(arr.map((item) => [item.answer, item])).values()]);
      if (lids.is_ncr) {
        setInfoMessage('This response will create a non-compliance action.');
        setInfoId(checklist.id);
      } else {
        setInfoMessage('');
        setInfoId(false);
      }
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

  function isQtnAnswered(checklist) {
    let res = false;
    const isData = answerValues.filter((item) => (item.question_id === checklist.id));
    if (isData && isData.length) {
      res = true;
    }
    return res;
  }

  function isQtnAnswerValue(checklist) {
    let res = '';
    const isData = answerValues.filter((item) => (item.question_id === checklist.id));
    if (isData && isData.length) {
      res = isData[0].answer;
    }
    return res;
  }

  function isQtnCommentAnswered(checklist) {
    let res = '';
    const isData = answerValues.filter((item) => (item.question_id === checklist.id && item.remarks));
    if (isData && isData.length) {
      res = isData[0].remarks;
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

  function isConditionBased(checklist) {
    let res2 = true;
    const parentId = checklist.parent_id && checklist.parent_id.id ? checklist.parent_id.id : false;
    const targetValue = checklist.based_on_ids && checklist.based_on_ids.length ? checklist.based_on_ids[0].id : false;
    const isData = answerValues.filter((item) => (item.question_id === parentId));
    const baseValue = isData && isData.length ? isData[0].answer : false;
    const condApplied = (baseValue === targetValue);

    if (checklist.is_enable_condition && parentId && targetValue && !condApplied) {
      res2 = false;
    }

    return res2;
  }

  const onPagePrev = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    setPage(page - 1);
  };

  const onPageNext = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    setPage(page + 1);
  };

  const handleFiles = (files, checklist) => {
    const companyId = detailData.company_id && detailData.company_id.id ? detailData.company_id.id : false;
    setimgSize(false);
    if (files !== undefined) {
      const { name } = files.fileList[0];
      if (name && !name.match(/.(jpg|jpeg|svg|png|pdf|xlsx|ppt|docx|xls)$/i)) {
        setErrorShow(true);
      } else {
        const remfile = `data:${files.fileList[0].type};base64,`;
        const photoname = files.fileList[0].name;
        const fname = `${getLocalTimeSeconds(new Date())}-${auditData.name}`.replace(/\s+/g, '');
        const filedata = files.base64.replace(remfile, '');
        const fileSize = files.fileList[0].size;
        const values = {
          datas: filedata,
          datas_fname: photoname,
          name: fname,
          company_id: companyId,
          res_model: appModels.SYSTEMAUDIT,
          res_id: auditData.id,
          data_id: checklist.id,
          data_type: files.fileList[0].type,
          description: checklist.question ? checklist.question : '',
        };

        if (bytesToSizeLow(fileSize)) {
          const arr = [...equipmentImages, ...[values]];
          const data = [...new Map(arr.map((item) => [item.name, item])).values()];
          setEquipmentImages(data);
        } else {
          setimgSize(true);
          setErrorShow(true);
        }
      }
    }
  };

  const handleDelete = (name) => {
    if (name) {
      setEquipmentImages(equipmentImages.filter((item) => item.name !== name));
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

  const answeredValues = answerValues.filter((item) => (item.answer && item.answer !== ''));
  const answeredValuesMulti = answerMultiValues.filter((item) => (item.answer && item.answer !== ''));

  const multiAnswered = answeredValuesMulti && answeredValuesMulti.length ? 1 : 0;

  const answeredCount = parseInt(answeredValues.length) + parseInt(multiAnswered);

  const qtns = detailData && detailData.page_ids && detailData.page_ids.length && detailData.page_ids[page - 1]
    && detailData.page_ids[page - 1].question_ids ? detailData.page_ids[page - 1].question_ids : false;
  // generateArrayFromInner(detailData.page_ids[page - 1], 'question_ids') : false;

  const pageData = detailData && detailData.page_ids && detailData.page_ids.length && detailData.page_ids[page - 1] ? detailData.page_ids[page - 1] : false;

  const totalQtns = detailData && detailData.page_ids && detailData.page_ids.length ? generateArrayFromInner(detailData.page_ids, 'question_ids').length : 0;

  const totalQtnData = detailData && detailData.page_ids && detailData.page_ids.length ? generateArrayFromInner(detailData.page_ids, 'question_ids') : [];

  const reqQtnData = totalQtnData.filter((item) => (item.constr_mandatory));

  const reqQtnIds = getColumnArrayById(reqQtnData, 'id');

  const ansMandData = getArrayFromValuesByIdIn(answeredValues, reqQtnIds, 'question_id');

  const ansMandCount = ansMandData && ansMandData.length ? ansMandData.length : 0;

  const ansMandMultiData = getArrayFromValuesByIdIn(answeredValuesMulti, reqQtnIds, 'question_id');

  const ansMandMultiCount = ansMandMultiData && ansMandMultiData.length ? ansMandMultiData.length : 0;

  const reqQtnDataCount = totalQtnData.filter((item) => (item.constr_mandatory)).length;

  const totalMandAns = parseInt(ansMandCount) + parseInt(ansMandMultiCount);

  const isMandNotFill = parseInt(reqQtnDataCount) !== parseInt(totalMandAns);

  // const totalQuestions = qtns && qtns.length ? qtns.length : 0;

  // const isAllAnswered = (totalQuestions === answeredCount);

  const ansPerc = newpercalculate(totalQtns, answeredCount);

  const qtnsList = qtns && qtns.length ? qtns : false;

  const qtnListOrdered = qtnsList ? qtnsList.sort((a, b) => a.sequence - b.sequence) : false;

  // const isLastPage = isMandNotFill || (page !== detailData.page_ids.length);

  let count = 0;

  return (
    <Row>
      <Col md="12" sm="12" lg="12" xs="12" className={isMobileView ? 'pl-0' : ''}>
        <Form id="surveyList" onSubmit={handleSubmit}>
          {(createInfo && !createInfo.count && !createInfo.loading) && (
            <div className="pull-right ">
              <img src={timer} className="mr-2" alt="timer" width="15" height="15" />
              <span className="font-tiny font-weight-700">
                Less than
                {'  '}
                {detailData.survey_time ? convertNumToTime(detailData.survey_time, 'minutes') : '1'}
                {'  '}
                {detailData.survey_time && convertNumToTime(detailData.survey_time, 'minutes') > 1 ? 'minutes' : 'minute'}
              </span>
            </div>
          )}
          <br />
          {(createInfo && !createInfo.count && !createInfo.loading) && (
            <h5 className="text-center">{pageData && pageData.title ? pageData.title : ''}</h5>
          )}
          {(createInfo && !createInfo.count && !createInfo.loading) && qtnListOrdered && qtnListOrdered.map((qtn) => (
            <Row key={qtn.question}>
              <Col md="12" sm="12" lg="12" xs="12">
                {isConditionBased(qtn) && (
                  <>
                    <div className="question-info-circle border-light-slate-grey-1px background-color-unset">
                      <span className="font-weight-800 question-info-label left-n6">{count += 1}</span>
                    </div>
                    <div className="user-info-text">
                      <p className="font-weight-800 mb-0 ml-0 font-size-15px">
                        {qtn.question}
                        {qtn.constr_mandatory && (
                          <span className="text-danger ml-1">*</span>
                        )}
                      </p>
                    </div>
                    {qtn.type !== 'matrix' && qtn.type !== 'simple_choice' && qtn.type !== 'multiple_choice' && (
                      <>
                        <FormGroup className="pl-3 ml-5 mt-0 mb-0">
                          <Input
                            name={qtn.question}
                            type={getFieldType(qtn.type)}
                            className="bg-lightblue"
                            maxLength={qtn.validation_length_max ? qtn.validation_length_max : 50}
                            required={qtn.constr_mandatory}
                            onKeyPress={getFieldType(qtn.type) === 'number' ? integerKeyPress : lettersOnly}
                            min={qtn.type === 'date' && qtn.validation_min_date ? moment(new Date(qtn.validation_min_date)).format('YYYY-MM-DD') : false}
                            max={qtn.type === 'date' && qtn.validation_max_date ? moment(new Date(qtn.validation_max_date)).format('YYYY-MM-DD') : false}
                            onBlur={(e) => handleInputChange(e, qtn)}
                            defaultValue={isQtnAnswerValue(qtn)}
                            onChange={(e) => handleInputBlur(e, qtn)}
                          />
                          {errorId && errorId === qtn.id && validationMessage && (
                            <p className="text-danger mt-1 mb-0">{validationMessage}</p>
                          )}
                        </FormGroup>
                        {qtn.has_attachment && (
                          <>
                            <div className="text-right mt-3 text-line-height-2 mr-3 mb-2">
                              {isImageMaxExists(qtn.id) && (
                                <ReactFileReader handleFiles={(files) => handleFiles(files, qtn)} elementId={qtn.id} fileTypes="*" base64>
                                  <img src={uploadIcon} className="mr-1" alt="upload" height="20" />
                                  <span className="text-lightblue font-tiny cursor-pointer"> Upload</span>
                                </ReactFileReader>
                              )}
                            </div>
                            <Row className="ml-1 mr-1">
                              <Image.PreviewGroup>
                                {(equipmentImages && equipmentImages.length > 0) && equipmentImages.map((document) => (
                                  <>
                                    {(document.data_id === qtn.id) && isImage(document.datas_fname) && (
                                      <div className="mr-3 mb-3">
                                        <Image
                                          width={100}
                                          height={100}
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
                                            onClick={() => { handleDelete(document.name); }}
                                          />
                                        </Tooltip>
                                      </div>
                                    )}
                                  </>
                                ))}
                              </Image.PreviewGroup>

                              {(equipmentImages && equipmentImages.length > 0) && equipmentImages.map((document) => (
                                <>
                                  {(document.data_id === qtn.id) && !isImage(document.datas_fname) && (
                                    <div className="mr-3 mb-3">
                                      <img className="cursor-pointer" width="100" height="100" src={fileMiniIcon} alt="fileMiniIcon" />
                                      <br />
                                      <Tooltip title={document.datas_fname} placement="top">
                                        <span className="mr-2 float-left font-tiny">{truncate(document.datas_fname, 10)}</span>
                                      </Tooltip>
                                      <Tooltip title="Delete" placement="top">
                                        <FontAwesomeIcon
                                          size="sm"
                                          className="cursor-pointer mt-1 mr-2 float-right"
                                          icon={faTrashAlt}
                                          onClick={() => { handleDelete(document.name); }}
                                        />
                                      </Tooltip>
                                    </div>
                                  )}
                                </>
                              ))}
                            </Row>
                            <div>
                              {imgSize
                                ? (
                                  <Toast isOpen={errorShow} className="mt-2">
                                    <ToastHeader icon="danger" toggle={errorToggle}>FAILED</ToastHeader>
                                    <ToastBody className="text-left">
                                      Upload files less than 5 MB
                                    </ToastBody>
                                  </Toast>
                                ) : ''}
                            </div>
                          </>
                        )}
                        {qtn.comments_allowed && isQtnAnswered(qtn) && (
                          <FormGroup className="ml-2 mt-2">
                            <Input
                              name={qtn.question}
                              type="textarea"
                              className="bg-lightblue"
                              rows={1}
                              defaultValue={isQtnCommentAnswered(qtn)}
                              placeholder="Remarks (Optional)"
                              maxLength={250}
                              onChange={(e) => handleCommentChange(e, qtn)}
                            />
                          </FormGroup>
                        )}
                      </>
                    )}
                    {qtn.type === 'simple_choice' && (
                      <div className="pl-2 ml-5 mb-0 mt-2">
                        <Row>
                          {qtn.labels_ids && qtn.labels_ids.map((lid) => (
                            <Col
                              md="3"
                              sm="6"
                              lg="3"
                              xs="6"
                              key={lid.id}
                              className="text-center cursor-pointer"
                              onClick={() => handleCheckIconChange(qtn, lid)}
                            >
                              {(lid.favicon || lid.emoji) && (
                                <div
                                  style={isChecked(qtn, lid) ? { border: `2px solid ${lid.color}` } : {}}
                                  className={`${isChecked(qtn, lid) ? 'highlighted-shadow-box' : ''} p-3`}
                                >
                                  {lid.favicon && (
                                    <>
                                      <FontAwesomeIcon
                                        icon={lid.favicon}
                                        style={isChecked(qtn, lid) ? { color: lid.color } : {}}
                                        className="fa-2x"
                                        size="lg"
                                      />
                                      <p
                                        style={isChecked(qtn, lid) ? { color: lid.color } : {}}
                                        className="mt-2 mb-0 text-capital word-break-content"
                                      >
                                        {lid.value}
                                      </p>
                                    </>
                                  )}
                                  {lid.emoji && (
                                    <>
                                      <p
                                        style={isChecked(qtn, lid) ? { color: lid.color } : {}}
                                        className="mb-0 fa-2x "
                                      >
                                        {lid.emoji.length === 2 ? lid.emoji : <Emoji emoji={lid.emoji} set="google" size={32} />}
                                      </p>
                                      <p
                                        style={isChecked(qtn, lid) ? { color: lid.color } : {}}
                                        className="mt-2 mb-0 text-capital word-break-content"
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
                                className={`pr-3 ml-3 ${isChecked(qtn, lid) ? '' : ''}`}
                                checked={isChecked(qtn, lid)}
                                name={qtn.question}
                                value={lid.value}
                                control={(
                                  <Radio
                                    size="small"
                                    required={qtn.constr_mandatory}
                                    onChange={(e) => handleCheckChange(e, qtn, lid)}
                                    color="default"
                                    classes={{ root: classes.radio, checked: classes.checked }}
                                  />
                                )}
                                label={lid.value}
                              />
                            )}
                          </>
                        ))}
                        {errorId && errorId === qtn.id && validationMessage && (
                          <p className="text-danger mt-3 mb-0">{validationMessage}</p>
                        )}
                        {infoId && infoId === qtn.id && infoMessage && (
                          <p className="text-info mt-1 mb-1 ml-2">{infoMessage}</p>
                        )}
                        {qtn.has_attachment && (
                          <>
                            <div className="text-right mt-3 text-line-height-2 mr-3 mb-2">
                              {isImageMaxExists(qtn.id) && (
                                <ReactFileReader handleFiles={(files) => handleFiles(files, qtn)} elementId={qtn.id} fileTypes="*" base64>
                                  <img src={uploadIcon} className="mr-1" alt="upload" height="20" />
                                  <span className="text-lightblue font-tiny cursor-pointer"> Upload</span>
                                </ReactFileReader>
                              )}
                            </div>
                            <Row className="ml-1 mr-1">
                              <Image.PreviewGroup>
                                {(equipmentImages && equipmentImages.length > 0) && equipmentImages.map((document) => (
                                  <>
                                    {(document.data_id === qtn.id) && isImage(document.datas_fname) && (
                                      <div className="mr-3 mb-3">
                                        <Image
                                          width={100}
                                          height={100}
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
                                            onClick={() => { handleDelete(document.name); }}
                                          />
                                        </Tooltip>
                                      </div>
                                    )}
                                  </>
                                ))}
                              </Image.PreviewGroup>

                              {(equipmentImages && equipmentImages.length > 0) && equipmentImages.map((document) => (
                                <>
                                  {(document.data_id === qtn.id) && !isImage(document.datas_fname) && (
                                    <div className="mr-3 mb-3">
                                      <img className="cursor-pointer" width="100" height="100" src={fileMiniIcon} alt="fileMiniIcon" />
                                      <br />
                                      <Tooltip title={document.datas_fname} placement="top">
                                        <span className="mr-2 float-left font-tiny">{truncate(document.datas_fname, 10)}</span>
                                      </Tooltip>
                                      <Tooltip title="Delete" placement="top">
                                        <FontAwesomeIcon
                                          size="sm"
                                          className="cursor-pointer mt-1 mr-2 float-right"
                                          icon={faTrashAlt}
                                          onClick={() => { handleDelete(document.name); }}
                                        />
                                      </Tooltip>
                                    </div>
                                  )}
                                </>
                              ))}
                            </Row>
                            <div>
                              {imgSize
                                ? (
                                  <Toast isOpen={errorShow} className="mt-2">
                                    <ToastHeader icon="danger" toggle={errorToggle}>FAILED</ToastHeader>
                                    <ToastBody className="text-left">
                                      Upload files less than 5 MB
                                    </ToastBody>
                                  </Toast>
                                ) : ''}
                            </div>
                          </>
                        )}
                        {qtn.comments_allowed && isQtnAnswered(qtn) && (
                          <FormGroup className="ml-2 mt-2">
                            <Input
                              name={qtn.question}
                              type="textarea"
                              className="bg-lightblue"
                              rows={1}
                              defaultValue={isQtnCommentAnswered(qtn)}
                              placeholder="Remarks (Optional)"
                              maxLength={250}
                              onChange={(e) => handleCommentChange(e, qtn)}
                            />
                          </FormGroup>
                        )}
                      </div>
                    )}
                    {qtn.type === 'multiple_choice' && (
                      <div className="pl-2 ml-5 mb-0 mt-2">
                        <Row>
                          {qtn.labels_ids && qtn.labels_ids.map((lid) => (
                            <Col
                              md="3"
                              sm="6"
                              lg="3"
                              xs="6"
                              key={lid.id}
                              className="text-center cursor-pointer"
                              onClick={() => handleCheckMultiIconChange(qtn, lid)}
                            >
                              {(lid.favicon || lid.emoji) && (
                                <div
                                  style={isMultiChecked(qtn, lid) ? { border: `2px solid ${lid.color}` } : {}}
                                  className={`${isMultiChecked(qtn, lid) ? 'highlighted-shadow-box' : ''} p-3`}
                                >
                                  {lid.favicon && (
                                    <>
                                      <FontAwesomeIcon
                                        icon={lid.favicon}
                                        className="fa-2x"
                                        style={isMultiChecked(qtn, lid) ? { color: lid.color } : {}}
                                        size="lg"
                                      />
                                      <p
                                        style={isMultiChecked(qtn, lid) ? { color: lid.color } : {}}
                                        className="mt-2 mb-0 text-capital word-break-content"
                                      >
                                        {lid.value}
                                      </p>
                                    </>
                                  )}
                                  {lid.emoji && (
                                    <>
                                      <p
                                        style={isMultiChecked(qtn, lid) ? { color: lid.color } : {}}
                                        className="fa-2x mb-0"
                                      >
                                        {lid.emoji.includes('U+') ? lid.emoji : <Emoji emoji={lid.emoji} set="google" size={32} />}
                                      </p>
                                      <p
                                        style={isMultiChecked(qtn, lid) ? { color: lid.color } : {}}
                                        className="mt-2 mb-0 text-capital word-break-content"
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
                                className={`pr-3 ml-3 ${isMultiChecked(qtn, lid) ? '' : ''}`}
                                name={lid.value}
                                value={lid.value}
                                control={(
                                  <Checkbox
                                    size="small"
                                    required={qtn.constr_mandatory}
                                    onChange={(e) => handleCheckMultiChange(e, qtn, lid)}
                                    color="default"
                                    classes={{ root: classes.radio, checked: classes.checked }}
                                  />
                                )}
                                label={lid.value}
                              />
                            )}
                          </>
                        ))}
                        {infoId && infoId === qtn.id && infoMessage && (
                          <p className="text-info mt-1 mb-1 ml-2">{infoMessage}</p>
                        )}
                        {errorId && errorId === qtn.id && validationMessage && (
                          <p className="text-danger mt-3 mb-0">{validationMessage}</p>
                        )}
                        {qtn.has_attachment && (
                          <>
                            <div className="text-right mt-3 text-line-height-2 mr-3 mb-2">
                              {isImageMaxExists(qtn.id) && (
                                <ReactFileReader handleFiles={(files) => handleFiles(files, qtn)} elementId={qtn.id} fileTypes="*" base64>
                                  <img src={uploadIcon} className="mr-1" alt="upload" height="20" />
                                  <span className="text-lightblue font-tiny cursor-pointer"> Upload</span>
                                </ReactFileReader>
                              )}
                            </div>
                            <Row className="ml-1 mr-1">
                              <Image.PreviewGroup>
                                {(equipmentImages && equipmentImages.length > 0) && equipmentImages.map((document) => (
                                  <>
                                    {(document.data_id === qtn.id) && isImage(document.datas_fname) && (
                                      <div className="mr-3 mb-3">
                                        <Image
                                          width={100}
                                          height={100}
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
                                            onClick={() => { handleDelete(document.name); }}
                                          />
                                        </Tooltip>
                                      </div>
                                    )}
                                  </>
                                ))}
                              </Image.PreviewGroup>

                              {(equipmentImages && equipmentImages.length > 0) && equipmentImages.map((document) => (
                                <>
                                  {(document.data_id === qtn.id) && !isImage(document.datas_fname) && (
                                    <div className="mr-3 mb-3">
                                      <img className="cursor-pointer" width="100" height="100" src={fileMiniIcon} alt="fileMiniIcon" />
                                      <br />
                                      <Tooltip title={document.datas_fname} placement="top">
                                        <span className="mr-2 float-left font-tiny">{truncate(document.datas_fname, 10)}</span>
                                      </Tooltip>
                                      <Tooltip title="Delete" placement="top">
                                        <FontAwesomeIcon
                                          size="sm"
                                          className="cursor-pointer mt-1 mr-2 float-right"
                                          icon={faTrashAlt}
                                          onClick={() => { handleDelete(document.name); }}
                                        />
                                      </Tooltip>
                                    </div>
                                  )}
                                </>
                              ))}
                            </Row>
                            <div>
                              {imgSize
                                ? (
                                  <Toast isOpen={errorShow} className="mt-2">
                                    <ToastHeader icon="danger" toggle={errorToggle}>FAILED</ToastHeader>
                                    <ToastBody className="text-left">
                                      Upload files less than 5 MB
                                    </ToastBody>
                                  </Toast>
                                ) : ''}
                            </div>
                          </>
                        )}
                        {qtn.comments_allowed && isQtnAnswered(qtn) && (
                          <FormGroup className="ml-2 mt-2">
                            <Input
                              name={qtn.question}
                              type="textarea"
                              className="bg-lightblue"
                              rows={1}
                              defaultValue={isQtnCommentAnswered(qtn)}
                              placeholder="Remarks (Optional)"
                              maxLength={250}
                              onChange={(e) => handleCommentChange(e, qtn)}
                            />
                          </FormGroup>
                        )}
                      </div>
                    )}
                  </>
                )}
              </Col>
            </Row>
          ))}
          {(createInfo && !createInfo.count && !createInfo.loading) && detailData && detailData.page_ids && detailData.page_ids.length > 0 && (
            <Col md={{ size: 6, offset: 3 }} sm="12" lg={{ size: 6, offset: 3 }} xs="12">
              <div className={isMobileView ? 'text-center p-5 ml-5' : 'text-center p-4 ml-4 mt-2 mb-3 mr-3'}>
                <Button
                  type="button"
                  size="sm"
                  className="rounded-pill float-left"
                  disabled={page === 1}
                  onClick={onPagePrev}
                   variant="contained"
                >
                  <FontAwesomeIcon className="mr-2" size="sm" icon={faArrowLeft} />
                  {' '}
                  <span>Prev</span>
                </Button>
                <Button
                  type="button"
                  size="sm"
                  className="rounded-pill float-right"
                  disabled={page === detailData.page_ids.length || errorId}
                  onClick={onPageNext}
                   variant="contained"
                >
                  <FontAwesomeIcon className="mr-2" size="sm" icon={faArrowRight} />
                  <span>Next</span>
                </Button>
              </div>
            </Col>
          )}
          {(createInfo && !createInfo.count && !createInfo.loading) && (
            <div className="text-center ml-5 mt-2">
              <Progress percent={parseInt(ansPerc)} showInfo={false} />
              <p className="font-tiny font-weight-700">
                {(parseInt(answeredCount) <= parseInt(totalQtns)) ? answeredCount : totalQtns}
                {' '}
                /
                {totalQtns}
                {' '}
                answered
              </p>
            </div>
          )}
          {(createInfo && createInfo.data && !createInfo.count) && (
            <div className="text-center mt-5">
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
                <span className="text-success">
                  {detailData.feedback_text ? detailData.feedback_text : 'Thank you for your feedback.'}
                </span>
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
          {(createInfo && !createInfo.count && !createInfo.loading) && (
            <>
              <hr />
              <div className="float-right mt-1">
                {(detailData.requires_verification_by_otp || detailData.has_reviwer_email === 'Required' || detailData.has_reviwer_name === 'Required' || detailData.has_reviwer_mobile === 'Required')
                  && (
                    <Button
                      type="button"
                      size="md"
                      className="mr-2 btn-cancel"
                      onClick={() => resetRequest()}
                       variant="contained"
                    >
                      <span>Cancel</span>
                    </Button>
                  )}
                <Button
                  disabled={isMandNotFill || errorId || (createInfo && createInfo.loading)}
                  type="submit"
                  size="md"
                   variant="contained"
                >
                  <span>Submit</span>
                </Button>
              </div>
            </>
          )}
        </Form>
      </Col>
      <Modal size="md" className="border-radius-50px modal-dialog-centered" isOpen={isModal}>
        <ModalHeaderComponent
          imagePath={checkCircleBlack}
          closeModalWindow={() => setModalOpen(false)}
          title="Upload Attachments"
          response={createInfo}
        />

        <ModalBody>
          <ImageUpload
            viewId={auditData.id}
            ticketId={currentChecklist}
            ticketNumber={detailData.name}
            resModel={appModels.SYSTEMAUDIT}
            model={appModels.DOCUMENT}
            companyId={detailData.company_id && detailData.company_id.id ? detailData.company_id.id : false}
          />
        </ModalBody>
      </Modal>
    </Row>
  );
};

SurveyForm.propTypes = {
  onNext: PropTypes.func.isRequired,
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  auditData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
};

export default SurveyForm;
