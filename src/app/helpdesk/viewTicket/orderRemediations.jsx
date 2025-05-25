/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable linebreak-style */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-tabs */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/no-danger */
import React, { useEffect, useState } from 'react';
import {
  Col,
  Row,
  Table,
  Card,
  CardBody,
  Button, CardHeader, Collapse,
} from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleDown, faAngleUp,
} from '@fortawesome/free-solid-svg-icons';
import { Drawer, Tag } from 'antd';

import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import DrawerHeader from '@shared/drawerHeader';

import workOrdersBlue from '@images/icons/workOrders.svg';

import { getOrdersFullDetails } from '../ticketService';
import {
  getOrderDetail, getOperationCheckListData, getOrderChecklist,
} from '../../workorders/workorderService';
import {
  generateErrorMessage,
  extractNameObject,
  getDefaultNoValue,
  getAllCompanies,
} from '../../util/appUtils';
import { groupByMultiple } from '../../util/staticFunctions';
import OrderInfo from './orderInfo';
import { getCheckListsJsonData } from '../../preventiveMaintenance/ppmService';
import OrderDetail from '../../workorders/viewWorkorder/orderDetail';

const appModels = require('../../util/appModels').default;

const OrderRemediations = () => {
  const dispatch = useDispatch();

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const { ticketDetail, incidentsOrderInfo } = useSelector((state) => state.ticket);
  const { checklistOpInfo, workOrderChecklist } = useSelector((state) => state.workorder);
  const { checkListsJson } = useSelector((state) => state.ppm);

  const [accordion, setAccordian] = useState([]);
  const [icon, setIcon] = useState(faAngleDown);
  const [addLink, setAddLink] = useState(false);

  const companies = getAllCompanies(userInfo, userRoles);

  useEffect(() => {
    if (ticketDetail && ticketDetail.data) {
      const ids = ticketDetail.data.length > 0 ? ticketDetail.data[0].order_ids : [];
      dispatch(getOrdersFullDetails(companies, appModels.ORDER, ids));
    }
  }, [ticketDetail]);

  const loading = incidentsOrderInfo && incidentsOrderInfo.loading;
  const isErr = ((incidentsOrderInfo && incidentsOrderInfo.err) || (incidentsOrderInfo && incidentsOrderInfo.data && !incidentsOrderInfo.data.status));
  const inspDeata = incidentsOrderInfo && incidentsOrderInfo.data && incidentsOrderInfo.data.data
    && incidentsOrderInfo.data.data.length && incidentsOrderInfo.data.data.length > 1 ? incidentsOrderInfo.data.data[1] : false;
  // const isChecklist = (inspDeata && inspDeata.check_list_ids && inspDeata.check_list_ids.length > 0);

  const isChecklistJson = (inspDeata && inspDeata.checklist_json_data && inspDeata.checklist_json_data !== '[]' && inspDeata.checklist_json_data !== '');
  const isChecklist = inspDeata && inspDeata.check_list_ids && inspDeata.check_list_ids.length > 0;

  const cheklistJsonObj = isChecklistJson && JSON.parse(inspDeata.checklist_json_data);

  const mroActivityIds = cheklistJsonObj && cheklistJsonObj.map((record) => record.mro_activity_id);

  useEffect(() => {
    if (inspDeata && inspDeata.checklist_json_data) {
      const ids = mroActivityIds || [];
      dispatch(getCheckListsJsonData(ids, appModels.ACTIVITY));
    }
  }, [inspDeata]);

  useEffect(() => {
    if (inspDeata && inspDeata.id) {
      const ids = inspDeata.id;
      dispatch(getOrderChecklist(ids, appModels.ORDER));
    }
  }, [incidentsOrderInfo]);

  useEffect(() => {
    if (!isChecklist) {
      const ids = workOrderChecklist && workOrderChecklist.data && workOrderChecklist.data[0] && workOrderChecklist.data[0].task_id && workOrderChecklist.data[0].task_id[0];
      console.log('ids', ids);
      dispatch(getOperationCheckListData(ids));
    }
  }, [workOrderChecklist]);

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
        res = status === 'done' ? 'No' : '-';
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
    if (groupId) {
      gId = groupId;
    }
    for (let i = 0; i < assetData.length; i += 1) {
      if (isObjectEmpty(assetData[i].mro_quest_grp_id)) {
        tableTr.push(
          <tr key={i}>
            <td className="p-2">{getDefaultNoValue(extractNameObject(assetData[i].mro_activity_id, 'name'))}</td>
            <td className="p-2">
              {assetData[i].is_abnormal ? (
                <h5>
                  <Tag color="error">
                    {(assetData[i].answer_type === 'number' && assetData[i].answer_common !== false)
                      ? parseFloat(getDefaultNoValue(assetData[i].answer_common)).toFixed(2)
                      : getDefaultNoValue(getTrimmedAnswer(assetData[i].answer_common, assetData[i].answer_type, inspDeata.state))}
                  </Tag>
                </h5>
              ) : (
                <h5>
                  <Tag color="success">
                    {(assetData[i].answer_type === 'number' && assetData[i].answer_common !== false)
                      ? parseFloat(getDefaultNoValue(assetData[i].answer_common)).toFixed(2)
                      : getDefaultNoValue(getTrimmedAnswer(assetData[i].answer_common, assetData[i].answer_type, inspDeata.state))}
                  </Tag>
                </h5>
              )}
            </td>
          </tr>,
        );
      } else if (!isObjectEmpty(assetData[i].mro_quest_grp_id)) {
        if (assetData[i].mro_quest_grp_id && assetData[i].mro_quest_grp_id.id && assetData[i].mro_quest_grp_id.id === gId) {
          tableTr.push(
            <tr key={i}>
              <td className="p-2">{getDefaultNoValue(extractNameObject(assetData[i].mro_activity_id, 'name'))}</td>
              <td className="p-2">
                {assetData[i].is_abnormal ? (
                  <h5>
                    <Tag color="error">
                      {(assetData[i].answer_type === 'number' && assetData[i].answer_common !== false)
                        ? parseFloat(getDefaultNoValue(assetData[i].answer_common)).toFixed(2)
                        : getDefaultNoValue(getTrimmedAnswer(assetData[i].answer_common, assetData[i].answer_type, inspDeata.state))}
                    </Tag>
                  </h5>
                ) : (
                  <h5>
                    <Tag color="success">
                      {(assetData[i].answer_type === 'number' && assetData[i].answer_common !== false)
                        ? parseFloat(getDefaultNoValue(assetData[i].answer_common)).toFixed(2)
                        : getDefaultNoValue(getTrimmedAnswer(assetData[i].answer_common, assetData[i].answer_type, inspDeata.state))}
                    </Tag>
                  </h5>
                )}
              </td>
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
                  : getDefaultNoValue(getTrimmedAnswer(assetData[i].answer_common, assetData[i].answer_type, inspDeata.state))}
              </Tag>
            ) : (
              <Tag color="success">
                {(assetData[i].answer_type === 'number' && assetData[i].answer_common !== false)
                  ? (assetData[i].answer_common ? parseFloat(getDefaultNoValue(assetData[i].answer_common)).toFixed(2) : '-')
                  : getDefaultNoValue(getTrimmedAnswer(assetData[i].answer_common, assetData[i].answer_type, inspDeata.state))}
              </Tag>
            )}
          </td>
        </tr>,
      );
    }
    return tableTr;
  }

  function checklistData(id) {
    const datas = checkListsJson && checkListsJson.data && checkListsJson.data.find((obj) => obj.id == id);
    if (datas) {
      return datas.name;
    }
    return '';
  }

  function getChecklistRow(assetData, groupId) {
    const tableTr = [];
    let gId;
    if (groupId === '') {
      gId = false;
    } else {
      gId = groupId;
    }
    for (let i = 0; i < assetData.length; i += 1) {
      if (!(assetData[i].checklist_question_header)) {
        tableTr.push(
          <tr key={i}>
            <td className="p-2">{assetData[i].checklist_question ? assetData[i].checklist_question : checklistData(assetData[i].mro_activity_id)}</td>
            <td className="p-2">
              {assetData[i].is_abnormal ? (
                <Tag color="error">
                  {(assetData[i].answer_type === 'number' && assetData[i].answer_common !== false)
                    ? parseFloat(getDefaultNoValue(assetData[i].answer_common)).toFixed(2)
                    : getDefaultNoValue(getTrimmedAnswer(assetData[i].answer_common, assetData[i].answer_type, inspDeata.state))}
                </Tag>
              ) : (
                <Tag color="success">
                  {(assetData[i].answer_type === 'number' && assetData[i].answer_common !== false)
                    ? parseFloat(getDefaultNoValue(assetData[i].answer_common)).toFixed(2)
                    : getDefaultNoValue(getTrimmedAnswer(assetData[i].answer_common, assetData[i].answer_type, inspDeata.state))}
                </Tag>
              )}
            </td>
          </tr>,
        );
      } else if (assetData[i].checklist_question_header) {
        if (assetData[i].checklist_question_header && assetData[i].checklist_question_header && assetData[i].checklist_question_header === gId) {
          tableTr.push(
            <tr key={i}>
              <td className="p-2">{assetData[i].checklist_question ? assetData[i].checklist_question : checklistData(assetData[i].mro_activity_id)}</td>
              <td className="p-2">
                {assetData[i].is_abnormal ? (
                  <Tag color="error">
                    {(assetData[i].answer_type === 'number' && assetData[i].answer_common !== false)
                      ? parseFloat(getDefaultNoValue(assetData[i].answer_common)).toFixed(2)
                      : getDefaultNoValue(getTrimmedAnswer(assetData[i].answer_common, assetData[i].answer_type, inspDeata.state))}
                  </Tag>
                ) : (
                  <Tag color="success">
                    {(assetData[i].answer_type === 'number' && assetData[i].answer_common !== false)
                      ? parseFloat(getDefaultNoValue(assetData[i].answer_common)).toFixed(2)
                      : getDefaultNoValue(getTrimmedAnswer(assetData[i].answer_common, assetData[i].answer_type, inspDeata.state))}
                  </Tag>
                )}
              </td>
            </tr>,
          );
        }
      }
    }
    return tableTr;
  }

  const sections = isChecklist > 0 ? groupByMultiple(inspDeata.check_list_ids, (obj) => (obj.mro_quest_grp_id && obj.mro_quest_grp_id.id ? obj.mro_quest_grp_id.id : '')) : [];

  const checkSections = isChecklistJson ? groupByMultiple(cheklistJsonObj, (obj) => (obj.checklist_question_header ? obj.checklist_question_header : '')) : [];

  const operationSections = checklistOpInfo && checklistOpInfo.data && checklistOpInfo.data.length > 0 ? groupByMultiple(checklistOpInfo.data, (obj) => (obj.mro_quest_grp_id ? obj.mro_quest_grp_id : '')) : [];

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

  useEffect(() => {
    if (isChecklist) {
      getinitial();
    }
    if (checklistOpInfo && checklistOpInfo.data) {
      getOperationChecklist();
    }
    getIntialChecklist();
  }, [incidentsOrderInfo, checklistOpInfo]);

  const openWorkOrder = () => {
    if (inspDeata && inspDeata.id) {
      dispatch(getOrderDetail(inspDeata.id, appModels.ORDER));
      setAddLink(true);
    }
  };

  const closeWorkOrder = () => {
    setAddLink(false);
  };

  return (
    <>
      <Row className="assessment-card">
        {inspDeata && (
          <Col sm="12" md="12" xs="12" lg="12" className="mb-2">
            <Card className="h-100">
              <p className="ml-3 mb-1 mt-2 font-weight-600 text-pale-sky font-size-13">ASSESSMENT INFORMATION</p>
              <hr className="mb-0 mt-0 mr-2 ml-2" />
              <CardBody className="p-0">
                <div className="mt-1 pl-0">
                  <OrderInfo detailData={inspDeata} openWorkOrder={openWorkOrder} />
                </div>
              </CardBody>
            </Card>
          </Col>
        )}
        <Col sm="12" md="12" lg="12" xs="12" className="p-3 comments-list thin-scrollbar">
          {(!loading && isChecklist) && (
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
                          {section && section[0] && section[0].mro_quest_grp_id && section[0].mro_quest_grp_id.name ? section[0].mro_quest_grp_id.name : 'General'}
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
                                </tr>
                              </thead>
                              <tbody>
                                {getRow(
                                  inspDeata.check_list_ids,
                                  section && section[0] && section[0].mro_quest_grp_id && section[0].mro_quest_grp_id.id ? section[0].mro_quest_grp_id.id : '',
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
          {(!loading && isChecklistJson && cheklistJsonObj && !isChecklist) && (
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
          {(!loading && checklistOpInfo && !isChecklistJson && !isChecklist) && (
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
                          {section && section[0] && section[0].mro_quest_grp_id && section[0].mro_quest_grp_id[1] ? section[0].mro_quest_grp_id[1] : 'General'}
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
                                </tr>
                              </thead>
                              <tbody>
                                {getOperationRow(
                                  checklistOpInfo && checklistOpInfo.data ? checklistOpInfo.data : [],
                                  section && section[0] && section[0].mro_quest_grp_id ? section[0].mro_quest_grp_id.id : '',
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
          {loading && (
            <div className="loader" data-testid="loading-case">
              <Loader />
            </div>
          )}
          {isErr && (
            <ErrorContent errorTxt={generateErrorMessage(incidentsOrderInfo && incidentsOrderInfo.err ? incidentsOrderInfo.err : 'No Data Found')} />
          )}
          {!isErr && inspDeata && !isChecklist && !isChecklistJson && !checklistOpInfo && !loading && (
            <ErrorContent errorTxt="No Data Found" />
          )}
          {!isErr && !inspDeata && !isChecklist && !isChecklistJson && !checklistOpInfo && !loading && (
            <ErrorContent errorTxt="No Data Found" />
          )}
        </Col>
      </Row>
      <Drawer
        title=""
        closable={false}
        width={1200}
        className="drawer-bg-lightblue"
        visible={addLink}
      >
        <DrawerHeader
          title={inspDeata && inspDeata.name ? inspDeata.name : ''}
          imagePath={workOrdersBlue}
          isEditable={false}
          closeDrawer={closeWorkOrder}
          onEdit={false}
          onPrev={false}
          onNext={false}
        />
        <OrderDetail setViewModal={setAddLink} />
      </Drawer>
    </>
  );
};

export default OrderRemediations;
