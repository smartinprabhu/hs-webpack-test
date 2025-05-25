/* eslint-disable no-nested-ternary */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/no-danger */
import React, { useEffect, useState } from 'react';
import {
  Button, Card, CardHeader, Collapse,
  Row,
  Table, Col, CardBody,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import {
  faAngleDown, faAngleUp,
} from '@fortawesome/free-solid-svg-icons';
import DOMPurify from 'dompurify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tag } from 'antd';

import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import { getTicketOrders } from '../ticketService';
import {
  generateErrorMessage,
  extractNameObject,
  getDefaultNoValue,
  getCompanyTimezoneDate,
  extractTextObject,
  truncateHTMLTags,
  htmlToReact,
  isJsonString,
  getJsonString,
} from '../../util/appUtils';
import { groupByMultiple } from '../../util/staticFunctions';

const appModels = require('../../util/appModels').default;

const Orders = ({ detailData }) => {
  const dispatch = useDispatch();

  const { ticketDetail, ticketOrders } = useSelector((state) => state.ticket);
  const { userInfo } = useSelector((state) => state.user);

  const [accordion, setAccordian] = useState([]);
  const [icon, setIcon] = useState(faAngleDown);

  const loading = ticketOrders && ticketOrders.loading;
  const inspDeata = ticketOrders && ticketOrders.data && ticketOrders.data.length ? ticketOrders.data[0] : false;
  const isErr = (ticketOrders && ticketOrders.err) || (!loading && !inspDeata);
  const isChecklist = (inspDeata && inspDeata.checklist_json_data !== '[]' && inspDeata.checklist_json_data !== '' && inspDeata.checklist_json_data);
  const cheklistJsonObj = inspDeata && inspDeata.checklist_json_data && isJsonString(inspDeata.checklist_json_data) && getJsonString(inspDeata.checklist_json_data) ? getJsonString(inspDeata.checklist_json_data) : [];

  useEffect(() => {
    if (ticketDetail && ticketDetail.data) {
      const ids = ticketDetail.data.length > 0 ? ticketDetail.data[0].order_ids : [];
      dispatch(getTicketOrders(ids, appModels.ORDER));
    }
  }, [ticketDetail]);
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

  function getChecklistRow(assetData, groupId) {
    const tableTr = [];
    let gId;
    if (groupId === '') {
      gId = false;
    } else {
      gId = groupId;
    }
    for (let i = 0; i < assetData.length; i += 1) {
      if (assetData[i].checklist_question_header) {
        if (assetData[i].checklist_question_header && assetData[i].checklist_question_header && assetData[i].checklist_question_header === gId) {
          tableTr.push(
            <tr key={i}>
              <td className="p-2">{assetData[i].checklist_question ? assetData[i].checklist_question : ''}</td>
              <td className="p-2">
                {assetData[i].is_abnormal ? (
                  <Tag color="error">
                    {(assetData[i].answer_type === 'number' && assetData[i].answer_common !== false)
                      ? (assetData[i].answer_common ? parseFloat(getDefaultNoValue(assetData[i].answer_common)).toFixed(2) : '0.00')
                      : getDefaultNoValue(getTrimmedAnswer(assetData[i].answer_common, assetData[i].answer_type, inspDeata.state))}
                  </Tag>
                ) : (
                  <Tag color="success">
                    {(assetData[i].answer_type === 'number' && assetData[i].answer_common !== false)
                      ? (assetData[i].answer_common ? parseFloat(getDefaultNoValue(assetData[i].answer_common)).toFixed(2) : '0.00')
                      : getDefaultNoValue(getTrimmedAnswer(assetData[i].answer_common, assetData[i].answer_type, inspDeata.state))}
                  </Tag>
                )}
              </td>
              <td className="p-2">{getDefaultNoValue(inspDeata && inspDeata.employee_id && inspDeata.employee_id.name ? inspDeata.employee_id.name : '')}</td>
              <td className="p-2">{getDefaultNoValue(inspDeata && inspDeata.date_execution ? getCompanyTimezoneDate(inspDeata.date_execution, userInfo, 'datetime') : '')}</td>
            </tr>,
          );
        }
      }
    }
    return tableTr;
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
      if (isObjectEmpty(assetData[i].mro_quest_grp_id)) {
        tableTr.push(
          <tr key={i}>
            <td className="p-2">{getDefaultNoValue(extractNameObject(assetData[i].mro_activity_id, 'name'))}</td>
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
            <td className="p-2">{getDefaultNoValue(extractNameObject(assetData[i].user_id, 'name'))}</td>
            <td className="p-2">{getCompanyTimezoneDate(assetData[i].write_date, userInfo, 'datetime')}</td>
          </tr>,
        );
      } else if (!isObjectEmpty(assetData[i].mro_quest_grp_id)) {
        if (assetData[i].mro_quest_grp_id && assetData[i].mro_quest_grp_id.id && assetData[i].mro_quest_grp_id.id === gId) {
          tableTr.push(
            <tr key={i}>
              <td className="p-2">{getDefaultNoValue(extractNameObject(assetData[i].mro_activity_id, 'name'))}</td>
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
              <td className="p-2">{getDefaultNoValue(extractNameObject(assetData[i].user_id, 'name'))}</td>
              <td className="p-2">{getCompanyTimezoneDate(assetData[i].write_date, userInfo, 'datetime')}</td>
            </tr>,
          );
        }
      }
    }
    return tableTr;
  }

  const sections = isChecklist && cheklistJsonObj ? groupByMultiple(cheklistJsonObj, (obj) => (obj.checklist_question_header ? obj.checklist_question_header : '')) : [];

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

  useEffect(() => {
    if (isChecklist) {
      getinitial();
    }
  }, [ticketOrders]);

  const ticketData = detailData && (detailData.data && detailData.data.length > 0) ? detailData.data[0] : false;

  const isClosed = !!(((ticketData.state_id) && (ticketData.state_id[1] === 'Closed')));

  return (
    <>
      {(ticketData.state_id) && (ticketData.state_id[1] === 'Closed') && (
        <Row className="p-0 TicketsSegments-cards">
          <Col sm="12" md="12" xs="12" lg="12" className="mb-2 pb-1 pr-04">
            <Card className="h-100">
              <CardBody className="p-0">
                <div className="mt-1 pl-3">
                  <Row className="m-0">
                    <Col sm="12" md="4" xs="12" lg="4" className="p-0 m-0">
                      <span className="m-0 p-0 light-text">
                        Closed on
                      </span>
                    </Col>
                    <Col sm="12" md="4" xs="12" lg="4" className="p-0 m-0">
                      <span className="m-0 p-0 light-text">
                        Closed by
                      </span>
                    </Col>
                    <Col sm="12" md="4" xs="12" lg="4" className="p-0 m-0">
                      <span className="m-0 p-0 light-text">
                        Close Comment
                      </span>
                    </Col>
                  </Row>
                  <Row className="m-0">
                    <Col sm="12" md="4" xs="12" lg="4" className="p-0 m-0">
                      <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(getCompanyTimezoneDate(ticketData.close_time, userInfo, 'datetime'))}</span>
                    </Col>
                    <Col sm="12" md="4" xs="12" lg="4" className="p-0 m-0">
                      <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(extractTextObject(ticketData.closed_by_id))}</span>
                    </Col>
                    <Col sm="12" md="4" xs="12" lg="4" className="p-0 m-0">
                      {ticketData.close_comment && ticketData.close_comment !== '' && truncateHTMLTags(ticketData.close_comment).length > 0
                        ? <p className="m-0 p-0 font-weight-700 small-form-content hidden-scrollbar" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(htmlToReact(ticketData.close_comment), { USE_PROFILES: { html: true } }) }} />
                        : inspDeata && inspDeata.reason && inspDeata.reason !== '' && truncateHTMLTags(inspDeata.reason).length > 0
                          ? <p className="m-0 p-0 font-weight-700 small-form-content hidden-scrollbar" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(htmlToReact(inspDeata.reason), { USE_PROFILES: { html: true } }) }} />
                          : '-'}
                    </Col>
                  </Row>
                  <p className="mt-2" />

                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      )}
      {(!loading && isChecklist && cheklistJsonObj) && (
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
      {isErr && !isClosed && (
        <ErrorContent errorTxt={generateErrorMessage(ticketOrders && ticketOrders.err ? ticketOrders.err : 'No Data Found')} />
      )}
      {!isErr && inspDeata && !isChecklist && !loading && !isClosed && (
        <ErrorContent errorTxt="No Data Found" />
      )}
    </>
  );
};

Orders.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
};

export default Orders;