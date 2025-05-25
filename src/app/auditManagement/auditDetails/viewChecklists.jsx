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
  useEffect, useState, useMemo,
} from 'react';
import {
  Button, Card, CardHeader,
  Col,
  Collapse,
  Row,
  Table,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { Tooltip } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleDown,
  faAngleUp,
  faCheckCircle,
  faHourglass,
  faPaperclip,
  faArrowAltCircleUp,
  faArrowAltCircleDown,
  faInfoCircle,
  faComment,
  faNoteSticky,
  faPlusCircle,
} from '@fortawesome/free-solid-svg-icons';
import {
  Box,
  Dialog, DialogContent, DialogContentText,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

import {
  getChoiceData, getMatrixData, resetDeleteAnswers,
} from '../../survey/surveyService';

import DialogHeader from '../../commonComponents/dialogHeader';

import { returnThemeColor } from '../../themes/theme';

import {
  truncate,
  detectMob,
} from '../../util/appUtils';
import { groupByMultiple } from '../../util/staticFunctions';
import AuditActions from './auditActions';
import AddPage from './systemForms/addPage';
import Questions from './systemForms/questions';
import { resetUpdateSystem } from '../auditService';

const CheckLists = (props) => {
  const {
    orderCheckLists,
    questionOnly,
    systemId,
    isCreate,
  } = props;

  const { hxAuditActions } = useSelector((state) => state.hxAudits);

  const actionsData = useMemo(() => (hxAuditActions && hxAuditActions.data ? hxAuditActions.data : []), [hxAuditActions]);

  const [questionValues, setQuestions] = useState(orderCheckLists);

  const isMobileView = detectMob();

  const [catOpen, setCatOpen] = useState(false);

  const [categoryId, setCategoryId] = useState(false);

  const [viewModal, showViewModal] = useState(false);
  const [qtnName, setQtnName] = useState(false);
  const [qtnRemarks, setQtnRemarks] = useState(false);

  const [auditActionModal, showAuditActionModal] = useState(false);
  const [pageModal, showPageModal] = useState(false);
  const [questionModal, showQuestionModal] = useState(false);
  const [qtnId, setQtnId] = useState(false);
  const [questionGroupId, setQuestionGroupId] = useState(false);

  const [accordion, setAccordian] = useState([]);
  const [icon, setIcon] = useState(faAngleDown);

  const dispatch = useDispatch();

  const sortCategories = (dataSections) => {
    dataSections = dataSections.sort((a, b) => a[0].mro_activity_id.sequence - b[0].mro_activity_id.sequence);
    return dataSections;
  };

  const [isProcedure, setProcedure] = useState(false);
  const [viewMoreId, setViewMoreId] = useState(false);

  useEffect(() => {
    if (orderCheckLists) {
      setQuestions(orderCheckLists);
    }
  }, [orderCheckLists]);

  let categories = useMemo(() => (orderCheckLists && orderCheckLists.length > 0 ? groupByMultiple(orderCheckLists, (obj) => (obj.page_id && obj.page_id.id ? obj.page_id.id : '')) : []), [orderCheckLists]);

  if (isCreate) {
    categories = useMemo(() => (questionValues && questionValues.length > 0 ? groupByMultiple(questionValues, (obj) => (obj.page_id && obj.page_id.id ? obj.page_id.id : '')) : []), [questionValues]);
  }

  useEffect(() => {
    if (!isCreate && categories && categories.length && categories[0].length) {
      setCategoryId(categories[0][0] && categories[0][0].page_id ? categories[0][0].page_id.id : false);
    }
  }, [categories]);

  useEffect(() => {
    if (isCreate && categories && categories.length && categories[0].length && !categoryId) {
      setCategoryId(categories[0][0] && categories[0][0].page_id ? categories[0][0].page_id.id : false);
    }
  }, [categories, categoryId, orderCheckLists]);

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

  function getQtnsCount(assetData, groupId, type) {
    let gId = false;
    let res = 0;
    if (groupId) {
      gId = groupId;
    }
    let assetDataList = assetData.filter((item) => item.page_id.id === categoryId && item.mro_quest_grp_id && item.mro_quest_grp_id.id === groupId);
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
    let assetDataList = assetData.filter((item) => item.page_id.id === categoryId && item.mro_quest_grp_id && item.mro_quest_grp_id.id === groupId);
    if (!groupId) {
      assetDataList = assetData.filter((item) => item.page_id.id === categoryId && !(item.mro_quest_grp_id && item.mro_quest_grp_id.id));
    }
    return assetDataList;
  }

  function checkAction(questionId) {
    if (!hxAuditActions) return null;
    return questionId && actionsData && actionsData.length > 0
      ? actionsData.some((item) => item.question_id?.id === questionId)
      : false;
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

  function getCatName(catId) {
    let res = '';
    const assetDataList = categories.filter((item) => item[0].page_id.id === catId);
    if (assetDataList && assetDataList.length) {
      res = assetDataList[0][0].page_id.title;
    }
    return res;
  }

  const onViewRemarks = (qtn, remarks) => {
    showViewModal(true);
    setQtnName(qtn);
    setQtnRemarks(remarks);
  };

  const onCloseRemarks = () => {
    showViewModal(false);
    setQtnName(false);
    setQtnRemarks(false);
  };

  const onViewActions = (qtn, id) => {
    showAuditActionModal(true);
    setQtnName(qtn);
    setQtnId(id);
  };

  const onCloseActions = () => {
    showAuditActionModal(false);
    setQtnName(false);
    setQtnId(false);
  };

  const onCreatePage = () => {
    showPageModal(true);
  };

  const onCreateQuestion = (group) => {
    dispatch(resetDeleteAnswers());
    dispatch(getChoiceData([]));
    dispatch(getMatrixData([]));
    dispatch(resetUpdateSystem());
    showQuestionModal(true);
    setQuestionGroupId(group);
  };

  function getTableHeight(dataLength) {
    let res = 150;
    const rowHeight = 40; // Approximate height of a single row in pixels
    const maxHeight = 150; // Max height based on viewport
    const rowCount = dataLength && dataLength > 0 ? dataLength + 1 : 1;
    // Calculate the height
    res = Math.min(rowCount * rowHeight, maxHeight);
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

  return (

    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '10%',
        fontFamily: 'Suisse Intl',
      }}
      className=""
    >

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
                {!questionOnly && (
                  <>
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
                  </>
                )}
                <Tooltip title={getCatName(categoryId)} placement="top">
                  {truncate(getCatName(categoryId), questionOnly ? 27 : 40)}
                </Tooltip>
                {!questionOnly && (
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
                    icon={catOpen ? faArrowAltCircleUp : faArrowAltCircleDown}
                  />
                </p>
                )}
              </p>
            </div>
          )}
          {(catOpen || !isMobileView) && (categories && categories.length > 0) && sortCategories(categories).map((cat) => (
            <div
              key={cat[0].page_id}
              aria-hidden
              onClick={() => { setCategoryId(cat[0].page_id.id); setCatOpen(false); }}
              style={categoryId === cat[0].page_id.id ? { backgroundColor: returnThemeColor(), color: 'white' } : {}}
              className="p-2 cursor-pointer font-family-tab"
            >
              <p
                className={categoryId === cat[0].page_id.id ? 'font-weight-700 m-0 font-size-13' : 'font-size-13 font-weight-500 m-0'}
              >
                {!questionOnly && (
                  <>
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
                  </>
                )}
                <Tooltip title={cat[0].page_id && cat[0].page_id.title} placement="top">
                  {cat[0].page_id && cat[0].page_id.title ? truncate(cat[0].page_id.title, questionOnly ? 23 : 27) : ''}
                </Tooltip>
                {!questionOnly && (
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
                )}
                {questionOnly && (
                <p className="float-right font-weight-700 m-0">
                  {`(${getCatQtnsCount(
                    isCreate ? questionValues : orderCheckLists,
                    cat && cat[0].page_id && cat[0].page_id.id ? cat[0].page_id.id : '',

                    'total',
                  )})`}

                </p>
                )}
              </p>
            </div>
          ))}
          {isCreate && (
          <Tooltip title="Create New" placement="top">
            <p className="mt-3 ml-2 text-center fon-tiny font-fmily-tab cursor-pointer" onClick={() => onCreatePage()}>
              <FontAwesomeIcon
                size="md"
                className="height-15 mr-2"
                icon={faPlusCircle}
              />
              Create Category
            </p>
          </Tooltip>
          )}
        </Col>
        <Col md="9" sm="12" lg="9" xs="12" className={`h-100 sticky-filter thin-scrollbar ${isMobileView ? 'mt-3 p-2' : ''}`}>
          <div className="">
            {questionValues && questionValues.length > 0 && getCatQtnsList(questionValues, categoryId).map((item, index) => (
              <div
                id="accordion"
                className="accordion-wrapper mb-3 border-0"
                key={item[0].mro_quest_grp_id && item[0].mro_quest_grp_id.id ? item[0].mro_quest_grp_id.id : ''}
              >
                <Card>
                  <CardHeader style={accordion[index] ? { backgroundColor: returnThemeColor(), color: 'white' } : {}} id={`heading${index}`} className="p-2 transparent-header border-0">
                    <Button
                      block
                      color={accordion[index] ? '' : 'text-dark'}
                      style={accordion[index] ? { color: 'white' } : {}}
                      id={`heading${index}`}
                      className="text-left m-0 p-0 border-0 box-shadow-none"
                      onClick={() => toggleAccordion(index)}
                      aria-expanded={accordion[index]}
                      aria-controls={`collapse${index}`}
                    >
                      <span className="collapse-heading font-weight-800 font-family-tab" style={accordion[index] ? { color: 'white' } : {}}>
                        {item && item[0].mro_quest_grp_id && item[0].mro_quest_grp_id.name ? item[0].mro_quest_grp_id.name : 'General'}

                      </span>
                      <span className="float-right font-weight-800 font-family-tab" style={accordion[index] ? { color: 'white' } : {}}>
                        {!questionOnly && (
                        <>
                          {`(${getQtnsCount(
                            questionValues,
                            item && item[0].mro_quest_grp_id && item[0].mro_quest_grp_id.id ? item[0].mro_quest_grp_id.id : '',

                            'answer',
                          )} / 
              ${getQtnsCount(
                            questionValues,
                            item && item[0].mro_quest_grp_id && item[0].mro_quest_grp_id.id ? item[0].mro_quest_grp_id.id : '',

                            'total',
                          )})`}
                        </>
                        )}
                        {questionOnly && (
                        <>
                          {`(${getQtnsCount(
                            questionValues,
                            item && item[0].mro_quest_grp_id && item[0].mro_quest_grp_id.id ? item[0].mro_quest_grp_id.id : '',

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
                    className="border-0 p-2 med-form-content thin-scrollbar"
                    aria-labelledby={`heading${index}`}
                  >
                    {getQtnsList(questionValues, item && item[0].mro_quest_grp_id && item[0].mro_quest_grp_id.id ? item[0].mro_quest_grp_id.id : '').map((qtn, index1) => (
                      <div key={qtn.id}>
                        <Row className="font-weight-600 font-size-14px">
                          <Col md="12" sm="12" xs="12" lg="12" className="font-family-tab">
                            {`${index1 + 1})`}
                            {' '}
                            {qtn.mro_activity_id && qtn.mro_activity_id.name ? qtn.mro_activity_id.name : ''}
                            {' '}
                            {qtn.mro_activity_id && (qtn.mro_activity_id.procedure || (qtn.mro_activity_id && qtn.mro_activity_id.applicable_standard_ids && qtn.mro_activity_id.applicable_standard_ids.length > 0)) && (
                            <span aria-hidden className="text-info cursor-pointer" onClick={() => { setViewMoreId(isProcedure && viewMoreId === qtn.id ? false : qtn.id); setProcedure(!(isProcedure && viewMoreId === qtn.id)); }}>
                              {!(isProcedure && viewMoreId === qtn.id) ? 'view more...' : 'view less'}
                            </span>
                            )}
                            {qtn.mro_activity_id && qtn.mro_activity_id.helper_text && (
                            <Tooltip title={qtn.mro_activity_id.helper_text} placement="top">
                              <span className="text-info">
                                <FontAwesomeIcon
                                  size="md"
                                  className="height-15 ml-2 cursor-pointer"
                                  icon={faInfoCircle}
                                />
                              </span>
                            </Tooltip>
                            )}
                            {qtn.mro_activity_id && qtn.mro_activity_id.procedure && isProcedure && viewMoreId === qtn.id && (
                            <p className="p-1 mb-2 ml-1 font-weight-800 font-family-tab">
                              Procedure:
                              <span className="font-weight-400 ml-2 font-family-tab">
                                {qtn.mro_activity_id.procedure}
                              </span>
                            </p>
                            )}
                            {(qtn.mro_activity_id && qtn.mro_activity_id.applicable_standard_ids && qtn.mro_activity_id.applicable_standard_ids.length > 0) && isProcedure && viewMoreId === qtn.id && (
                            <>
                              <p className="font-family-tab mb-2 ml-2">Applicable Standards</p>
                              <div style={{ height: `${getTableHeight(qtn.mro_activity_id.applicable_standard_ids.length)}px` }} className="small-table-scroll thin-scrollbar">
                                <Table id="spare-part" className="mb-0 ml-1" responsive bordered>
                                  <thead className="bg-lightblue">
                                    <tr>
                                      <th className="p-2 min-width-140 border-0 table-column z-Index-1060 font-family-tab">
                                        Title
                                      </th>
                                      <th className="p-2 min-width-160 border-0 table-column z-Index-1060 font-family-tab">
                                        Disclosure
                                      </th>
                                      <th className="p-2 min-width-160 border-0 table-column z-Index-1060 font-family-tab">
                                        Standard
                                      </th>
                                      <th className="p-2 min-width-160 border-0 table-column z-Index-1060 font-family-tab">
                                        Description
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {qtn.mro_activity_id.applicable_standard_ids.map((as) => (
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

                        </Row>
                        {!questionOnly && (
                        <Row className="font-weight-400">
                          <Col md="12" sm="12" xs="12" lg="12">
                            <p className="p-1 font-family-tab mb-0 font-size-14px">
                              <span className="font-family-tab ml-1 font-weight-800">Response: </span>
                              <span className="font-family-tab ml-2 font-weight-400">{qtn.answer_common ? qtn.answer_common : 'NA'}</span>
                              {qtn.achieved_score > 0 && (
                              <span className="float-right mr-1">
                                <span className="font-family-tab font-weight-800">Score: </span>
                                <span className="font-family-tab ml-2 font-weight-400">{parseFloat(qtn.achieved_score).toFixed(2)}</span>
                              </span>
                              )}
                            </p>
                            {(qtn.answer_type === 'simple_choice' || qtn.answer_type === 'multiple_choice' || qtn.remarks) && (
                            <p className="mb-0 float-right">
                              {qtn.remarks && (
                              <Tooltip title="View Remarks" placement="top">
                                <span className="text-info">
                                  <FontAwesomeIcon
                                    size="lg"
                                    onClick={() => onViewRemarks(qtn.mro_activity_id.name, qtn.remarks)}
                                    className="height-15 mr-2 cursor-pointer"
                                    icon={faComment}
                                  />
                                </span>
                              </Tooltip>
                              )}
                              {checkAction(qtn.mro_activity_id && qtn.mro_activity_id.id) && (qtn.answer_type === 'simple_choice' || qtn.answer_type === 'multiple_choice') && (
                              <Tooltip title="View Actions" placement="top">
                                <span className="text-info ml-2">
                                  <FontAwesomeIcon
                                    size="lg"
                                    onClick={() => onViewActions(qtn.mro_activity_id.name, qtn.mro_activity_id.id)}
                                    className="height-15 mr-2 cursor-pointer"
                                    icon={faNoteSticky}
                                  />
                                </span>
                              </Tooltip>
                              )}
                            </p>
                            )}
                          </Col>
                        </Row>
                        )}
                        <hr className="mt-2 mb-2" />

                      </div>
                    ))}
                    {isCreate && (
                    <Tooltip title="Create Checklist Item" placement="top">
                      <span className="mt-3 ml-3 fon-tiny font-fmily-tab cursor-pointer" onClick={() => onCreateQuestion(item && item[0].mro_quest_grp_id && item[0].mro_quest_grp_id.id ? item[0].mro_quest_grp_id : '')}>
                        <FontAwesomeIcon
                          size="md"
                          className="height-15 mr-2"
                          icon={faPlusCircle}
                        />
                        Create Checklist Item
                      </span>
                    </Tooltip>
                    )}
                  </Collapse>
                </Card>
              </div>
            ))}
            {isCreate && (
            <Tooltip title="Create Section" placement="top">
              <p className="mt-3 text-center fon-tiny font-fmily-tab cursor-pointer" onClick={() => onCreateQuestion('')}>
                <FontAwesomeIcon
                  size="md"
                  className="height-15 mr-2"
                  icon={faPlusCircle}
                />
                Create Section
              </p>
            </Tooltip>
            )}
            <Dialog maxWidth="xl" open={auditActionModal}>
              <DialogHeader title={`Actions - ${qtnName}`} ontAwesomeIcon={faNoteSticky} onClose={() => onCloseActions()} />
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  <AuditActions questionId={qtnId} />
                </DialogContentText>
              </DialogContent>
            </Dialog>
            <Dialog maxWidth="lg" open={viewModal}>
              <DialogHeader title={qtnName} ontAwesomeIcon={faComment} onClose={() => onCloseRemarks()} />
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  <Row className="">
                    <Col xs={12} sm={12} md={12} lg={12}>
                      <p className="font-family-tab">{qtnRemarks}</p>
                    </Col>
                  </Row>
                </DialogContentText>
              </DialogContent>
            </Dialog>
            {pageModal && (
            <AddPage
              editId={false}
              editData={false}
              systemId={systemId}
              questionValues={questionValues}
              setQuestions={setQuestions}
              atFinish={() => { showPageModal(false); }}
              pageModal
            />
            )}
            {questionModal && (
            <Questions
              editId={false}
              editData={false}
              systemId={systemId}
              questionValues={questionValues}
              groupId={questionGroupId}
              categoryId={categoryId}
              categoryName={getCatName(categoryId)}
              setQuestions={setQuestions}
              atFinish={() => { showQuestionModal(false); }}
              activityModal={questionModal}
            />
            )}
          </div>
        </Col>
      </Row>

    </Box>

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
