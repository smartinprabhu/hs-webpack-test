/* eslint-disable max-len */
/* eslint-disable no-tabs */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-nested-ternary */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/no-danger */
import React, { useEffect, useState } from 'react';
import {
  Button, Card, CardHeader, Collapse,
  Col,
  Row,
  Table,
} from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import { Tag } from 'antd';

import {
  faAngleDown, faAngleUp,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import { getCheckListsJsonData } from '../../preventiveMaintenance/ppmService';
import {
  getLocalTime, getDefaultNoValue, getCompanyTimezoneDate,
} from '../../util/appUtils';
import { groupByMultiple } from '../../util/staticFunctions';

const appModels = require('../../util/appModels').default;

const CheckLists = ({ ppmData }) => {
  const dispatch = useDispatch();
  const [accordion, setAccordian] = useState([]);
  const [icon, setIcon] = useState(faAngleDown);

  const { userInfo } = useSelector((state) => state.user);

  const { workorderDetails, orderCheckLists, checklistOpInfo } = useSelector((state) => state.workorder);
  const { checkListsJson } = useSelector((state) => state.ppm);

  const workorder = workorderDetails && workorderDetails.data && workorderDetails.data[0];

  const vendorName = ppmData && ppmData.vendor_id && ppmData.vendor_id.id ? ppmData.vendor_id.name : '';

  const isChecklistJson = (workorder && workorder.state === 'done' && workorder.checklist_json_data !== '[]' && workorder.checklist_json_data !== '' && workorder.checklist_json_data);

  /* useEffect(() => {
    if (workorderDetails && workorderDetails.data) {
      const ids = workorderDetails.data.length > 0 ? workorderDetails.data[0].check_list_ids : [];
      dispatch(getOrderCheckLists(ids, appModels.CHECKLIST));
    }
  }, [workorderDetails]); */

  const isChecklist = workorder && workorder.check_list_ids && workorder.check_list_ids.length > 0;

  const cheklistJsonObj = workorder && workorder.checklist_json_data ? JSON.parse(workorder.checklist_json_data) : [];

  const mroActivityIds = cheklistJsonObj && cheklistJsonObj.map((record) => record.mro_activity_id);

  useEffect(() => {
    if (mroActivityIds) {
      const ids = mroActivityIds || [];
      dispatch(getCheckListsJsonData(ids, appModels.ACTIVITY));
    }
  }, [workorderDetails]);

  /* useEffect(() => {
    if (workorder && workorder.task_id && !isChecklist && !isChecklistJson) {
      const ids = workorder && workorder.task_id && workorder.task_id[0];
      dispatch(getOperationCheckListData(ids));
    }
  }, [workorderDetails]); */

  function getEmployeeName(name) {
    let res = name;
    if (!name && ppmData) {
      res = vendorName;
    }
    return res;
  }

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

  function getRow(assetData, groupId) {
    const tableTr = [];
    let gId = false;
    if (groupId) {
      gId = groupId;
    }
    for (let i = 0; i < assetData.length; i += 1) {
      if (assetData[i].mro_quest_grp_id === false) {
        if (assetData[i].mro_quest_grp_id === gId) {
          tableTr.push(
            <tr key={i}>
              <td className="p-2">{getDefaultNoValue(assetData[i].mro_activity_id ? assetData[i].mro_activity_id[1] : '')}</td>
              <td className="p-2">
                {assetData[i].is_abnormal ? (
                  <Tag color="error">
                    {(assetData[i].answer_type === 'number' && assetData[i].answer_common !== false)
                      ? (assetData[i].answer_common ? parseFloat(getDefaultNoValue(assetData[i].answer_common)).toFixed(2) : '-')
                      : getDefaultNoValue(getTrimmedAnswer(assetData[i].answer_common, assetData[i].answer_type, workorder.state))}
                  </Tag>
                ) : (
                  <Tag color="success">
                    {(assetData[i].answer_type === 'number' && assetData[i].answer_common !== false)
                      ? (assetData[i].answer_common ? parseFloat(getDefaultNoValue(assetData[i].answer_common)).toFixed(2) : '-')
                      : getDefaultNoValue(getTrimmedAnswer(assetData[i].answer_common, assetData[i].answer_type, workorder.state))}
                  </Tag>
                )}
              </td>
              <td className="p-2">{getDefaultNoValue(assetData[i].answer_common ? getEmployeeName(assetData[i].user_id && assetData[i].user_id.length ? assetData[i].user_id[1] : '') : '')}</td>
              <td className="p-2">{getDefaultNoValue(assetData[i].answer_common ? getLocalTime(assetData[i].write_date) : '')}</td>
            </tr>,
          );
        }
      } else if (assetData[i].mro_quest_grp_id !== false) {
        if (assetData[i].mro_quest_grp_id === gId) {
          tableTr.push(
            <tr key={i}>
              <td className="p-2">{getDefaultNoValue(assetData[i].mro_activity_id ? assetData[i].mro_activity_id[1] : '')}</td>
              <td className="p-2">
                {assetData[i].is_abnormal ? (
                  <Tag color="error">
                    {(assetData[i].answer_type === 'number' && assetData[i].answer_common !== false)
                      ? (assetData[i].answer_common ? parseFloat(getDefaultNoValue(assetData[i].answer_common)).toFixed(2) : '-')
                      : getDefaultNoValue(getTrimmedAnswer(assetData[i].answer_common, assetData[i].answer_type, workorder.state))}
                  </Tag>
                ) : (
                  <Tag color="success">
                    {(assetData[i].answer_type === 'number' && assetData[i].answer_common !== false)
                      ? (assetData[i].answer_common ? parseFloat(getDefaultNoValue(assetData[i].answer_common)).toFixed(2) : '-')
                      : getDefaultNoValue(getTrimmedAnswer(assetData[i].answer_common, assetData[i].answer_type, workorder.state))}
                  </Tag>
                )}
              </td>
              <td className="p-2">{getDefaultNoValue(assetData[i].answer_common ? getEmployeeName(assetData[i].user_id && assetData[i].user_id.length ? assetData[i].user_id[1] : '') : '')}</td>
              <td className="p-2">{getDefaultNoValue(assetData[i].answer_common ? getLocalTime(assetData[i].write_date) : '')}</td>
            </tr>,
          );
        }
      }
    }
    return tableTr;
  }

  function getOperationRow(assetData, groupId) {
    const tableTr = [];
    let gId = false;
    if (groupId) {
      gId = groupId;
    }
    for (let i = 0; i < assetData.length; i += 1) {
      tableTr.push(
        <tr key={i}>
          <td className="p-2">{getDefaultNoValue(assetData[i].mro_activity_id ? assetData[i].mro_activity_id.name : '')}</td>
          <td className="p-2">
            {assetData[i].is_abnormal ? (
              <Tag color="error">
                {(assetData[i].answer_type === 'number' && assetData[i].answer_common !== false)
                  ? (assetData[i].answer_common ? parseFloat(getDefaultNoValue(assetData[i].answer_common)).toFixed(2) : '-')
                  : getDefaultNoValue(getTrimmedAnswer(assetData[i].answer_common, assetData[i].answer_type, workorder.state))}
              </Tag>
            ) : (
              <Tag color="success">
                {(assetData[i].answer_type === 'number' && assetData[i].answer_common !== false)
                  ? (assetData[i].answer_common ? parseFloat(getDefaultNoValue(assetData[i].answer_common)).toFixed(2) : '-')
                  : getDefaultNoValue(getTrimmedAnswer(assetData[i].answer_common, assetData[i].answer_type, workorder.state))}
              </Tag>
            )}
          </td>
          <td className="p-2">{getDefaultNoValue(assetData[i].answer_common ? assetData[i] && getEmployeeName(assetData[i].user_id) : '')}</td>
          <td className="p-2">{getDefaultNoValue(assetData[i].answer_common ? getLocalTime(assetData[i].write_date) : '')}</td>
        </tr>,
      );
    }
    return tableTr;
  }

  function checklistData(id) {
    const datas = checkListsJson && checkListsJson.data && checkListsJson.data.find((obj) => obj.id === id);
    if (datas) {
      return datas.name;
    }
    return '';
  }

  function getChecklistRow(assetData, groupId) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      if (assetData[i].checklist_question_header === groupId) {
        tableTr.push(
          <tr key={i}>
            <td className="p-2">{assetData[i].checklist_question ? assetData[i].checklist_question : checklistData(assetData[i].mro_activity_id)}</td>
            <td className="p-2">
              {assetData[i].is_abnormal ? (
                <Tag color="error">
                  {(assetData[i].answer_type === 'number' && assetData[i].answer_common !== false)
                    ? (assetData[i].answer_common ? parseFloat(getDefaultNoValue(assetData[i].answer_common)).toFixed(2) : '0.00')
                    : getDefaultNoValue(getTrimmedAnswer(assetData[i].answer_common, assetData[i].answer_type, workorder.state))}
                </Tag>
              ) : (
                <Tag color="success">
                  {(assetData[i].answer_type === 'number' && assetData[i].answer_common !== false)
                    ? (assetData[i].answer_common ? parseFloat(getDefaultNoValue(assetData[i].answer_common)).toFixed(2) : '0.00')
                    : getDefaultNoValue(getTrimmedAnswer(assetData[i].answer_common, assetData[i].answer_type, workorder.state))}
                </Tag>
              )}
            </td>
            <td className="p-2">{getDefaultNoValue(workorderDetails.data[0] ? getEmployeeName(workorderDetails.data[0].employee_id && workorderDetails.data[0].employee_id[1] ? workorderDetails.data[0].employee_id[1] : '') : '')}</td>
            <td className="p-2">{getDefaultNoValue(workorderDetails.data[0] ? getCompanyTimezoneDate(workorderDetails.data[0].date_execution, userInfo, 'datetime') : '')}</td>
          </tr>,
        );
      }
    }
    return tableTr;
  }

  const sections = orderCheckLists && orderCheckLists.data && orderCheckLists.data.length > 0 ? groupByMultiple(orderCheckLists.data, (obj) => obj.mro_quest_grp_id) : [];

  const checkSections = isChecklistJson && cheklistJsonObj ? groupByMultiple(cheklistJsonObj, (obj) => (obj.checklist_question_header ? obj.checklist_question_header : '')) : [];

  const operationSections = checklistOpInfo && checklistOpInfo.data && checklistOpInfo.data.length > 0 ? groupByMultiple(checklistOpInfo.data, (obj) => obj.mro_quest_grp_id) : [];

  // eslint-disable-next-line no-unused-vars
  const toggleAccordion = (tab, sec) => {
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

  const getIntialChecklist = () => {
    if ((checkSections && checkSections.length > 0)) {
      const accordn = [];
      for (let i = 0; i < checkSections.length; i += 1) {
        if (i === 0) {
          accordn.push(true);
        } else {
          accordn.push(false);
        }
      }
      setAccordian(accordn);
    }
  };

  const getOperationChecklist = () => {
    if ((operationSections && operationSections.length > 0)) {
      const accordn = [];
      for (let i = 0; i < operationSections.length; i += 1) {
        if (i === 0) {
          accordn.push(true);
        } else {
          accordn.push(false);
        }
      }
      setAccordian(accordn);
    }
  };

  useEffect(() => {
    /* if (orderCheckLists && orderCheckLists.data) {
      getinitial();
    }
    if (checklistOpInfo && checklistOpInfo.data) {
      getOperationChecklist();
    } */
    if (isChecklistJson) {
      getIntialChecklist();
    }
  }, [isChecklistJson]);

  return (
    <Row>
      <Col sm="12" md="12" lg="12" xs="12">
        { /* (checklistOpInfo && checklistOpInfo.data && !isChecklist && !isChecklistJson) && (
          <div className="ml-0 bg-white">
            {(operationSections && operationSections.length > 0) && operationSections.map((section, index) => (
              <div
                id="accordion"
                className="accordion-wrapper mb-3 border-0"
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
                      {checklistOpInfo && (
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
                            {getOperationRow(
                              checklistOpInfo && checklistOpInfo.data ? checklistOpInfo.data : [],
                              section && section[0].mro_quest_grp_id ? section[0].mro_quest_grp_id.id : '',
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

        {(accordion.length > 0) && (isChecklist) && (sections && sections.length > 0) && sections.map((section, index) => (
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
                  onClick={() => toggleAccordion(index, section[0].id)}
                  aria-expanded={accordion[index]}
                  aria-controls={`collapse${index}`}
                >
                  <span className="collapse-heading font-weight-800">
                    {section && section[0].mro_quest_grp_id && section[0].mro_quest_grp_id[1] ? section[0].mro_quest_grp_id[1] : 'General'}
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
                className="border-0 comments-list thin-scrollbar"
                aria-labelledby={`heading${index}`}
              >
                <Row className="mr-2 ml-2 mt-3 mb-0 ">

                  {orderCheckLists && orderCheckLists.data && (
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
                          orderCheckLists && orderCheckLists.data ? orderCheckLists.data : [],
                          section && section[0].mro_quest_grp_id ? section[0].mro_quest_grp_id[0] : '',
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
        )) */ }

        {(isChecklistJson && cheklistJsonObj) && (
          <div className="ml-0 bg-white">
            {(checkSections && checkSections.length > 0) && checkSections.map((section, index) => (
              <div
                id="accordion"
                className="accordion-wrapper mb-3 border-0"
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
                      {cheklistJsonObj && (
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
        {orderCheckLists && orderCheckLists.loading && (
        <Loader />
        )}
        {(!isChecklistJson) && (
          <ErrorContent errorTxt="No Data Found." />
        )}
      </Col>
    </Row>
  );
};

export default CheckLists;
