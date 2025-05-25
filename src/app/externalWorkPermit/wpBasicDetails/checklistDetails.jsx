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
import {
  faAngleDown, faAngleUp,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tag } from 'antd';
import * as PropTypes from 'prop-types';
import { Typography, Divider, Box } from '@mui/material';

import {
  extractNameObject,
  getDefaultNoValue,
  getLocalTime,
} from '../../util/appUtils';
import { groupByMultiple } from '../../util/staticFunctions';
import { AddThemeColor } from '../../themes/theme';

const ChecklistDetails = (props) => {
  const {
    checklists,
    checklistJsonData,
    title,
    orderStatus,
    accid,
    orderDate,
  } = props;

  const [accordion, setAccordian] = useState([]);
  const [icon, setIcon] = useState(faAngleDown);

  const isChecklist = (checklists && checklists.length > 0);

  const isChecklistJson = checklistJsonData && title === 'Work Checklists' ? checklistJsonData : false;

  const cheklistJsonObj = isChecklistJson ? JSON.parse(checklistJsonData) : false;

  function getTrimmedAnswer(str, type) {
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
        res = orderStatus.toLowerCase() === 'done' ? 'No' : '-';
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
    let gId = false;
    if (groupId === '') {
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
                    : getDefaultNoValue(getTrimmedAnswer(assetData[i].answer_common, assetData[i].answer_type))}
                </Tag>
              ) : (
                <Tag color="success">
                  {(assetData[i].answer_type === 'number' && assetData[i].answer_common !== false)
                    ? parseFloat(getDefaultNoValue(assetData[i].answer_common)).toFixed(2)
                    : getDefaultNoValue(getTrimmedAnswer(assetData[i].answer_common, assetData[i].answer_type))}
                </Tag>
              )}
            </td>
            <td className="p-2">{getLocalTime(assetData[i].write_date)}</td>
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
                    : getDefaultNoValue(getTrimmedAnswer(assetData[i].answer_common, assetData[i].answer_type))}
                </Tag>
              ) : (
                <Tag color="success">
                  {(assetData[i].answer_type === 'number' && assetData[i].answer_common !== false)
                    ? parseFloat(getDefaultNoValue(assetData[i].answer_common)).toFixed(2)
                    : getDefaultNoValue(getTrimmedAnswer(assetData[i].answer_common, assetData[i].answer_type))}
                </Tag>
              )}
            </td>
            <td className="p-2">{getLocalTime(assetData[i].write_date)}</td>
          </tr>,
        );
      }
    }
    return tableTr;
  }

  function getJsonRow(assetData, groupId) {
    const tableTr = [];
    let gId = false;
    if (groupId === '') {
      gId = groupId;
    }
    for (let i = 0; i < assetData.length; i += 1) {
      if (!gId && !(assetData[i].checklist_question_header)) {
        tableTr.push(
          <tr key={i}>
            <td className="p-2">{getDefaultNoValue(assetData[i].checklist_question ? assetData[i].checklist_question : '')}</td>
            <td className="p-2">
              {assetData[i].is_abnormal ? (
                <Tag color="error">
                  {(assetData[i].answer_type === 'number' && assetData[i].answer_common !== false)
                    ? parseFloat(getDefaultNoValue(assetData[i].answer_common)).toFixed(2)
                    : getDefaultNoValue(getTrimmedAnswer(assetData[i].answer_common, assetData[i].answer_type))}
                </Tag>
              ) : (
                <Tag color="success">
                  {(assetData[i].answer_type === 'number' && assetData[i].answer_common !== false)
                    ? parseFloat(getDefaultNoValue(assetData[i].answer_common)).toFixed(2)
                    : getDefaultNoValue(getTrimmedAnswer(assetData[i].answer_common, assetData[i].answer_type))}
                </Tag>
              )}
            </td>
            <td className="p-2">{getLocalTime(orderDate)}</td>
          </tr>,
        );
      } else if (gId && assetData[i].checklist_question_header && assetData[i].checklist_question_header && assetData[i].checklist_question_header === gId) {
        tableTr.push(
          <tr key={i}>
            <td className="p-2">{getDefaultNoValue(assetData[i].checklist_question ? assetData[i].checklist_question : '')}</td>
            <td className="p-2">
              {assetData[i].is_abnormal ? (
                <Tag color="error">
                  {(assetData[i].answer_type === 'number' && assetData[i].answer_common !== false)
                    ? parseFloat(getDefaultNoValue(assetData[i].answer_common)).toFixed(2)
                    : getDefaultNoValue(getTrimmedAnswer(assetData[i].answer_common, assetData[i].answer_type))}
                </Tag>
              ) : (
                <Tag color="success">
                  {(assetData[i].answer_type === 'number' && assetData[i].answer_common !== false)
                    ? parseFloat(getDefaultNoValue(assetData[i].answer_common)).toFixed(2)
                    : getDefaultNoValue(getTrimmedAnswer(assetData[i].answer_common, assetData[i].answer_type))}
                </Tag>
              )}
            </td>
            <td className="p-2">{getLocalTime(orderDate)}</td>
          </tr>,
        );
      }
    }
    return tableTr;
  }

  const sections = isChecklist > 0 ? groupByMultiple(checklists, (obj) => (obj.mro_quest_grp_id && obj.mro_quest_grp_id.id ? obj.mro_quest_grp_id.id : '')) : [];
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

  useEffect(() => {
    if (isChecklistJson) {
      getinitial1();
    } else if (isChecklist) {
      getinitial();
    }
  }, [checklistJsonData, checklists]);

  return (
    <>
      <Box
        sx={{
          backgroundColor: '#F6F8FA',
          display: 'flex',
          flexDirection: 'column',
          gap: '10%',
          fontFamily: 'Suisse Intl',
        }}
      >
        {isChecklistJson ? (

          <>
            <Typography
              sx={AddThemeColor({
                font: 'normal normal medium 20px/24px Suisse Intl',
                fontWeight: 500,
                margin: '10px 0px 10px 10px',
              })}
            >
              {title}
            </Typography>

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
                                    Answered on
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {getJsonRow(cheklistJsonObj, section && section[0].checklist_question_header && section[0].checklist_question_header ? section[0].checklist_question_header : '')}
                              </tbody>
                            </Table>
                            <Divider />
                          </>
                        )}
                      </Row>
                    </Collapse>
                  </Card>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            {(isChecklist) && (
              <>
                <Typography
                  sx={AddThemeColor({
                    font: 'normal normal medium 20px/24px Suisse Intl',
                    fontWeight: 500,
                    margin: '10px 0px 10px 10px',
                  })}
                >
                  {title}
                </Typography>

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
                                        Answered on
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {getRow(checklists, section && section[0].mro_quest_grp_id && section[0].mro_quest_grp_id.id ? section[0].mro_quest_grp_id.id : '')}
                                  </tbody>
                                </Table>
                                <Divider />
                              </>
                            )}
                          </Row>
                        </Collapse>
                      </Card>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
        { /* !isChecklist && (
      <ErrorContent errorTxt="No Data Found" />
      ) */ }
      </Box>
    </>
  );
};

ChecklistDetails.propTypes = {
  checklists: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]).isRequired,
  checklistJsonData: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]).isRequired,
  orderStatus: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]).isRequired,
  orderDate: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]).isRequired,
};

export default ChecklistDetails;
