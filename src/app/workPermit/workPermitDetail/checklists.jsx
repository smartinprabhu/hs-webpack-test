/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-tabs */
/* eslint-disable linebreak-style */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import {
  Button, Card, CardHeader, Collapse,
  Row,
  Table,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import {
  faAngleDown, faAngleUp,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tag } from 'antd';

import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';

import {
  generateErrorMessage,
  extractNameObject,
  getDefaultNoValue,
  getCompanyTimezoneDate,
} from '../../util/appUtils';
import { groupByMultiple } from '../../util/staticFunctions';

const Checklists = (props) => {
  const {
    detailData,
  } = props;
  const { userInfo } = useSelector((state) => state.user);

  const [accordion, setAccordian] = useState([]);
  const [icon, setIcon] = useState(faAngleDown);

  const loading = detailData && detailData.loading;
  const isErr = detailData && detailData.err;
  const inspDeata = detailData && detailData.data && detailData.data.length ? detailData.data[0] : false;
  const isChecklist = (inspDeata && inspDeata.order_id && inspDeata.order_id.check_list_ids && inspDeata.order_id.check_list_ids.length > 0);

  const isChecklistData = inspDeata && inspDeata.order_id && inspDeata.order_id.check_list_ids;

  const isChecklistJson = (inspDeata && inspDeata.order_id && inspDeata.order_id.checklist_json_data);

  const cheklistJsonObj = isChecklistJson ? JSON.parse(isChecklistJson) : false;

  function getTrimmedAnswer(str, type, status) {
    let res = '-';
    if (type === 'boolean') {
      if (str) {
        if (str === 'True') {
          res = 'Yes';
        } else if (str === 'False') {
          res = 'No';
        } else if (typeof (str) === 'boolean') {
          res = 'Yes';
        } else {
          res = str;
        }
      } else {
        res = status.toLowerCase() === 'done' ? 'No' : '-';
      }
    } else if (type !== 'boolean') {
      if (str) {
        res = str;
      } else {
        res = '-';
      }
    }
    return res;
  }

  function isObjectEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  const sortSections = (dataSections) => {
    const dataSectionsNew = dataSections.sort(
      (a, b) => a.mro_activity_id.sequence - b.mro_activity_id.sequence,
    );
    return dataSectionsNew;
  };


  function getChecklistRow(assetDatas, groupId) {
    const tableTr = [];
    let gId;
    const assetData = sortSections(assetDatas);
    if (groupId === '') {
      gId = false;
    } else {
      gId = groupId;
    }
    for (let i = 0; i < assetData.length; i += 1) {
      if (!gId && !(assetData[i].checklist_question_header)) {
        tableTr.push(
          <tr key={i}>
            <td className="p-2">{assetData[i].checklist_question ? assetData[i].checklist_question : ''}</td>
            <td className="p-2">
              {assetData[i].is_abnormal ? (
                <Tag color="error">
                  {(assetData[i].mro_activity_id.type === 'numerical_box' && assetData[i].answer_common !== false)
                    ? parseFloat(getDefaultNoValue(assetData[i].answer_common)).toFixed(2)
                    : getDefaultNoValue(getTrimmedAnswer(assetData[i].answer_common, assetData[i].answer_type, inspDeata.order_state))}
                </Tag>
              ) : (
                <Tag color="success">
                  {(assetData[i].mro_activity_id.type === 'numerical_box' && assetData[i].answer_common !== false)
                    ? parseFloat(getDefaultNoValue(assetData[i].answer_common)).toFixed(2)
                    : getDefaultNoValue(getTrimmedAnswer(assetData[i].answer_common, assetData[i].answer_type, inspDeata.order_state))}
                </Tag>
              )}
            </td>
            <td className="p-2">{getDefaultNoValue(assetData[i].user_id ? extractNameObject(assetData[i].user_id, 'name') : '')}</td>
            <td className="p-2">{assetData[i].write_date ? getCompanyTimezoneDate(assetData[i].write_date, userInfo, 'datetime') : '-'}</td>
          </tr>,
        );
      } else if ((assetData[i].checklist_question_header)) {
        if (gId && assetData[i].checklist_question_header && assetData[i].checklist_question_header && assetData[i].checklist_question_header === gId) {
          tableTr.push(
            <tr key={i}>
              <td className="p-2">{assetData[i].checklist_question ? assetData[i].checklist_question : '-'}</td>
              <td className="p-2">
                {assetData[i].is_abnormal ? (
                  <Tag color="error">
                    {(assetData[i].mro_activity_id.type === 'numerical_box' && assetData[i].answer_common !== false)
                      ? parseFloat(getDefaultNoValue(assetData[i].answer_common)).toFixed(2)
                      : getDefaultNoValue(getTrimmedAnswer(assetData[i].answer_common, assetData[i].answer_type, inspDeata.order_state))}
                  </Tag>
                ) : (
                  <Tag color="success">
                    {(assetData[i].mro_activity_id.type === 'numerical_box' && assetData[i].answer_common !== false)
                      ? parseFloat(getDefaultNoValue(assetData[i].answer_common)).toFixed(2)
                      : getDefaultNoValue(getTrimmedAnswer(assetData[i].answer_common, assetData[i].answer_type, inspDeata.order_state))}
                  </Tag>
                )}
              </td>
              <td className="p-2">{getDefaultNoValue(assetData[i].user_id ? extractNameObject(assetData[i].user_id, 'name') : '')}</td>
              <td className="p-2">{assetData[i].write_date ? getCompanyTimezoneDate(assetData[i].write_date, userInfo, 'datetime') : '-'}</td>
            </tr>,
          );
        }
      }
    }
    return tableTr;
  }

  function getRow(assetDatas, groupId) {
    const tableTr = [];
    let gId = false;
    const assetData = sortSections(assetDatas);
    if (groupId) {
      gId = groupId;
    }
    for (let i = 0; i < assetData.length; i += 1) {
      if (gId && assetData[i].mro_quest_grp_id && assetData[i].mro_quest_grp_id.id && assetData[i].mro_quest_grp_id.id === gId) {
        tableTr.push(
          <tr key={i}>
            <td className="p-2">{getDefaultNoValue(extractNameObject(assetData[i].mro_activity_id, 'name'))}</td>
            <td className="p-2">
              {assetData[i].is_abnormal ? (
                <Tag color="error">
                  {(assetData[i].mro_activity_id.type === 'numerical_box' && assetData[i].answer_common !== false)
                    ? parseFloat(getDefaultNoValue(assetData[i].answer_common)).toFixed(2)
                    : getDefaultNoValue(getTrimmedAnswer(assetData[i].answer_common, assetData[i].mro_activity_id.type, inspDeata.order_state))}
                </Tag>
              ) : (
                <Tag color="success">
                  {(assetData[i].mro_activity_id.type === 'numerical_box' && assetData[i].answer_common !== false)
                    ? parseFloat(getDefaultNoValue(assetData[i].answer_common)).toFixed(2)
                    : getDefaultNoValue(getTrimmedAnswer(assetData[i].answer_common, assetData[i].mro_activity_id.type, inspDeata.order_state))}
                </Tag>
              )}
            </td>
            <td className="p-2">{getDefaultNoValue(extractNameObject(assetData[i].user_id, 'name'))}</td>
            <td className="p-2">{getCompanyTimezoneDate(assetData[i].write_date, userInfo, 'datetime')}</td>
          </tr>,
        );
      } else if (assetData[i].mro_quest_grp_id && !assetData[i].mro_quest_grp_id.id && !gId) {
        tableTr.push(
          <tr key={i}>
            <td className="p-2">{getDefaultNoValue(extractNameObject(assetData[i].mro_activity_id, 'name'))}</td>
            <td className="p-2">
              {assetData[i].is_abnormal ? (
                <Tag color="error">
                  {(assetData[i].mro_activity_id.type === 'numerical_box' && assetData[i].answer_common !== false)
                    ? parseFloat(getDefaultNoValue(assetData[i].answer_common)).toFixed(2)
                    : getDefaultNoValue(getTrimmedAnswer(assetData[i].answer_common, assetData[i].mro_activity_id.type, inspDeata.order_state))}
                </Tag>
              ) : (
                <Tag color="success">
                  {(assetData[i].mro_activity_id.type === 'numerical_box' && assetData[i].answer_common !== false)
                    ? parseFloat(getDefaultNoValue(assetData[i].answer_common)).toFixed(2)
                    : getDefaultNoValue(getTrimmedAnswer(assetData[i].answer_common, assetData[i].mro_activity_id.type, inspDeata.order_state))}
                </Tag>
              )}
            </td>
            <td className="p-2">{getDefaultNoValue(extractNameObject(assetData[i].user_id, 'name'))}</td>
            <td className="p-2">{getCompanyTimezoneDate(assetData[i].write_date, userInfo, 'datetime')}</td>
          </tr>,
        );
      }
    }
    return tableTr;
  }

  const sections = isChecklist > 0 ? groupByMultiple(inspDeata.order_id.check_list_ids, (obj) => (obj.mro_quest_grp_id && obj.mro_quest_grp_id.id ? obj.mro_quest_grp_id.id : '')) : [];

  const jsonSections = isChecklistJson ? groupByMultiple(cheklistJsonObj, (obj) => (obj.checklist_question_header ? obj.checklist_question_header : '')) : [];

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

  const getinitial1 = () => {
    if ((jsonSections && jsonSections.length > 0)) {
      const accordn = [];
      for (let i = 0; i < jsonSections.length; i += 1) {
        if (i === 0) {
          accordn.push(true);
        } else {
          accordn.push(false);
        }
      }
      setAccordian(accordn);
    }
  };

  const getAnswered = (array) => {
    let ansData = false;
    if (array && array.length) {
      const partsDataList = array.filter((item) => item.answer_common !== false);
      if (partsDataList && partsDataList.length > 0) {
        ansData = true;
      }
    }
    return ansData;
  };

  useEffect(() => {
    if (isChecklistJson) {
      getinitial1();
    } else if (isChecklist) {
      getinitial();
    }
  }, [detailData]);

  return (
    <>
      {!isChecklistJson ? (
        <>
          {(!loading && isChecklist && getAnswered(isChecklistData)) && (
          <div className="ml-0 bg-white">
            {(accordion.length > 0) && (sections && sections.length > 0) && sections.map((section, index) => (
              <div
                id="accordion"
                className="accordion-wrapper mb-3 border-0"
                key={section[0].id}
              >
                <Card>
                  <CardHeader id={`heading${index}`} className="p-2 bg-lightgrey border-0">
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
                        {section && section[0].mro_quest_grp_id && section[0].mro_quest_grp_id.name ? section[0].mro_quest_grp_id.name : 'General'}
                        {' '}
                      </span>
                      {accordion[index]
                        ? <FontAwesomeIcon className="float-right font-weight-300" size="lg" icon={faAngleUp} />
                        : <FontAwesomeIcon className="float-right font-weight-300" size="lg" icon={icon} />}
                    </Button>
                  </CardHeader>

                  <Collapse
                    isOpen={accordion[index]}
                    data-parent="#accordion"
                    id={`collapse${index}`}
                    className="border-0 med-form-content thin-scrollbar"
                    aria-labelledby={`heading${index}`}
                  >
                    <Row className="mr-2 ml-2 mb-0 ">
                      {isChecklist && (
                      <>
                        <Table responsive className="mb-0 mt-2 font-weight-400 border-0 assets-table" width="100%">
                          <thead>
                            <tr>
                              <th className="p-2 min-width-160">
                                Question
                              </th>
                              <th className="p-2 min-width-100">
                                Answer
                              </th>
                              <th className="p-2 min-width-160">
                                Answered By
                              </th>
                              <th className="p-2 min-width-160">
                                Answered on
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {getRow(
                              inspDeata.order_id.check_list_ids,
                              section && section[0].mro_quest_grp_id && section[0].mro_quest_grp_id.id ? section[0].mro_quest_grp_id.id : '',
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
          )}
        </>
      ) : (
        <>
          {(!loading && getAnswered(cheklistJsonObj) && isChecklistJson) && (
          <div className="ml-0 bg-white">
            {(accordion.length > 0) && (jsonSections && jsonSections.length > 0) && jsonSections.map((section, index) => (
              <div
                id="accordion"
                className="accordion-wrapper mb-3 border-0"
                key={section[0].id}
              >
                <Card>
                  <CardHeader id={`heading${index}`} className="p-2 bg-lightgrey border-0">
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
                        {section && section[0].checklist_question_header && section[0].checklist_question_header ? section[0].checklist_question_header : 'General'}
                        {' '}
                      </span>
                      {accordion[index]
                        ? <FontAwesomeIcon className="float-right font-weight-300" size="lg" icon={faAngleUp} />
                        : <FontAwesomeIcon className="float-right font-weight-300" size="lg" icon={icon} />}
                    </Button>
                  </CardHeader>

                  <Collapse
                    isOpen={accordion[index]}
                    data-parent="#accordion"
                    id={`collapse${index}`}
                    className="border-0 med-form-content thin-scrollbar"
                    aria-labelledby={`heading${index}`}
                  >
                    <Row className="mr-2 ml-2 mb-0 ">
                      {isChecklistJson && (
                      <>
                        <Table responsive className="mb-0 mt-2 font-weight-400 border-0 assets-table" width="100%">
                          <thead>
                            <tr>
                              <th className="p-2 min-width-160">
                                Question
                              </th>
                              <th className="p-2 min-width-100">
                                Answer
                              </th>
                              <th className="p-2 min-width-160">
                                Answered By
                              </th>
                              <th className="p-2 min-width-160">
                                Answered on
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {getChecklistRow(cheklistJsonObj, section && section[0].checklist_question_header && section[0].checklist_question_header ? section[0].checklist_question_header : '')}
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
          )}
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
      {!isErr && inspDeata && !isChecklist && !getAnswered(isChecklistData) && !isChecklistJson && !getAnswered(cheklistJsonObj) && !loading && (
      <ErrorContent errorTxt="No Data Found" />
      )}
      {isChecklist && !getAnswered(isChecklistData) && !isChecklistJson && (
      <ErrorContent errorTxt="No Data Found" />
      )}
      {isChecklistJson && !getAnswered(cheklistJsonObj) && !isChecklist && (
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
