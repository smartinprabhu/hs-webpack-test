/* eslint-disable no-nested-ternary */
/* eslint-disable no-tabs */
/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import {
  Button, Card, CardHeader, Collapse,
  Row,
  Table,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
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
  extractTextObject,
  getCompanyTimezoneDate,
  getLocalTime,
} from '../../../util/appUtils';
import { groupByMultiple } from '../../../util/staticFunctions';
import { getInspectionChecklists } from '../../../inspectionSchedule/inspectionService';

const Checklists = () => {
  const { userInfo } = useSelector((state) => state.user);
  const {
    ppmWeekInfo,
    inspectionChecklists,
  } = useSelector((state) => state.inspection);

  const [accordion, setAccordian] = useState([]);
  const [icon, setIcon] = useState(faAngleDown);

  const dispatch = useDispatch();

  const loading = inspectionChecklists && inspectionChecklists.loading;
  const isErr = ((ppmWeekInfo && ppmWeekInfo.err) || (ppmWeekInfo && ppmWeekInfo.data && !ppmWeekInfo.data.status));
  const inspDeata = ppmWeekInfo && ppmWeekInfo.data && ppmWeekInfo.data.data
  && ppmWeekInfo.data.data.length > 0 ? ppmWeekInfo.data.data[0] : false;

  useEffect(() => {
    if (inspDeata && inspDeata.order_id && inspDeata.order_state && inspDeata.order_state.toLowerCase() === 'done') {
      dispatch(getInspectionChecklists(inspDeata.order_id));
    }
  }, [ppmWeekInfo]);

  function getEmployeeName(name) {
    let res = name;
    if (!name && inspDeata) {
      res = inspDeata.vendor_name;
    }
    return res;
  }

  const isChecklistJson = !!((inspDeata && inspDeata.order_id && inspDeata.order_state && inspDeata.order_state.toLowerCase() === 'done' && inspectionChecklists && inspectionChecklists.data && inspectionChecklists.data.length > 0 && inspectionChecklists.data[0].checklist_json_data && inspectionChecklists.data[0].checklist_json_data !== ''));

  const isChecklist = ''; //! isChecklistJson ? (inspDeata && inspDeata.order_id && inspDeata.order_id.check_list_ids && inspDeata.order_id.check_list_ids.length > 0) : '';

  const cheklistJsonObj = isChecklistJson ? JSON.parse(inspectionChecklists.data[0].checklist_json_data) : [];

  console.log(isChecklistJson);

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

  function getRow(assetData, groupId) {
    const tableTr = [];
    let gId;
    if (groupId === '') {
      gId = false;
    } else {
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
                  {(assetData[i].answer_type === 'number' && assetData[i].answer_common !== false)
                    ? parseFloat(getDefaultNoValue(assetData[i].answer_common)).toFixed(2)
                    : getDefaultNoValue(getTrimmedAnswer(assetData[i].answer_common, assetData[i].answer_type, inspDeata.order_state))}
                </Tag>
              ) : (
                <Tag color="success">
                  {(assetData[i].answer_type === 'number' && assetData[i].answer_common !== false)
                    ? parseFloat(getDefaultNoValue(assetData[i].answer_common)).toFixed(2)
                    : getDefaultNoValue(getTrimmedAnswer(assetData[i].answer_common, assetData[i].answer_type, inspDeata.order_state))}
                </Tag>
              )}
            </td>
            <td className="p-2">{getDefaultNoValue(getEmployeeName(inspDeata.employee_name))}</td>
            <td className="p-2">{getCompanyTimezoneDate(inspDeata.date_execution, userInfo, 'datetime')}</td>
          </tr>,
        );
      } else if (assetData[i].mro_quest_grp_id && !assetData[i].mro_quest_grp_id.id && !gId) {
        tableTr.push(
          <tr key={i}>
            <td className="p-2">{getDefaultNoValue(extractNameObject(assetData[i].mro_activity_id, 'name'))}</td>
            <td className="p-2">
              {assetData[i].is_abnormal ? (
                <Tag color="error">
                  {(assetData[i].answer_type === 'number' && assetData[i].answer_common !== false)
                    ? parseFloat(getDefaultNoValue(assetData[i].answer_common)).toFixed(2)
                    : getDefaultNoValue(getTrimmedAnswer(assetData[i].answer_common, assetData[i].answer_type, inspDeata.order_state))}
                </Tag>
              ) : (
                <Tag color="success">
                  {(assetData[i].answer_type === 'number' && assetData[i].answer_common !== false)
                    ? parseFloat(getDefaultNoValue(assetData[i].answer_common)).toFixed(2)
                    : getDefaultNoValue(getTrimmedAnswer(assetData[i].answer_common, assetData[i].answer_type, inspDeata.order_state))}
                </Tag>
              )}
            </td>
            <td className="p-2">{getDefaultNoValue(getEmployeeName(inspDeata.employee_name))}</td>
            <td className="p-2">{getCompanyTimezoneDate(inspDeata.date_execution, userInfo, 'datetime')}</td>
          </tr>,
        );
      }
    }
    return tableTr;
  }

  function checklistData(id) {
    const datas = inspDeata.check_list_id.activity_lines.find((obj) => obj.id === id);
    if (datas) {
      return datas.name;
    }
    return [];
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
                    : getDefaultNoValue(getTrimmedAnswer(assetData[i].answer_common, assetData[i].answer_type, inspDeata.order_state))}
                </Tag>
              ) : (
                <Tag color="success">
                  {(assetData[i].answer_type === 'number' && assetData[i].answer_common !== false)
                    ? (assetData[i].answer_common ? parseFloat(getDefaultNoValue(assetData[i].answer_common)).toFixed(2) : '0.00')
                    : getDefaultNoValue(getTrimmedAnswer(assetData[i].answer_common, assetData[i].answer_type, inspDeata.order_state))}
                </Tag>
              )}
            </td>
            <td className="p-2">{getDefaultNoValue(getTrimmedAnswer(assetData[i].answer_common, assetData[i].answer_type, inspDeata.order_state) !== '-' ? getEmployeeName(inspDeata.employee_name) : '')}</td>
            <td className="p-2">{getCompanyTimezoneDate(inspDeata.date_execution, userInfo, 'datetime')}</td>
          </tr>,
        );
      }
    }
    return tableTr;
  }

  // const sections = isChecklist > 0 ? groupByMultiple(inspDeata.order_id.check_list_ids, (obj) => (obj.mro_quest_grp_id && obj.mro_quest_grp_id.id ? obj.mro_quest_grp_id.id : '')) : [];

  const checkSections = !isChecklist ? groupByMultiple(cheklistJsonObj, (obj) => (obj.checklist_question_header ? obj.checklist_question_header : '')) : [];

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

  /* const getinitial = () => {
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
  }; */

  const getChecklistInitial = () => {
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

  useEffect(() => {
    if (isChecklistJson) {
      getChecklistInitial();
    }
  }, [inspectionChecklists]);

  useEffect(() => {
    getChecklistInitial();
  }, [ppmWeekInfo]);

  useEffect(() => {
    if (isChecklistJson) {
      getChecklistInitial();
    }
  }, [inspectionChecklists]);

  return (
    <>
      {(!loading && isChecklistJson) && (
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
                  {cheklistJsonObj && cheklistJsonObj.length > 0 && (
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
      {loading && (
      <div className="loader" data-testid="loading-case">
        <Loader />
      </div>
      )}
      {isErr && (
      <ErrorContent errorTxt={generateErrorMessage(ppmWeekInfo && ppmWeekInfo.err ? ppmWeekInfo.err : 'No Data Found')} />
      )}
      {!isErr && inspDeata && !isChecklistJson && !loading && (
      <ErrorContent errorTxt="No Data Found" />
      )}
    </>
  );
};

export default Checklists;
