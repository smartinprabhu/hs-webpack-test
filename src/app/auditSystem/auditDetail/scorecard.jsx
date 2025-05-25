/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
import {
  Row,
  Col,
  Card,
  CardBody,
  Table,
} from 'reactstrap';
import { Bar } from 'react-chartjs-2';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import ErrorContent from '@shared/errorContent';

import {
  getColumnArrayById, truncate, getDefaultNoValue, getCompanyTimezoneDate,
  extractNameObject, numToFloat,
} from '../../util/appUtils';
import '../auditOverview/visitorOverview.scss';
import { getStateLabel, getResponseTypeLabel } from '../utils/utils';
import { getAuditActions, getAuditAssessments } from '../auditService';
import chartOptions from '../data/barCharts.json';

const appModels = require('../../util/appModels').default;

const Scorecard = React.memo(({ auditDetails }) => {
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.user);

  const [isNcShow, setIsNcShow] = useState(false);
  const [isIoShow, setIsIoShow] = useState(false);

  const sections = auditDetails && auditDetails.audit_system_id && auditDetails.audit_system_id.page_ids && auditDetails.audit_system_id.page_ids.length > 0
    ? auditDetails.audit_system_id.page_ids : [];

  const { auditActionDetails, auditAssessmentDetail } = useSelector((state) => state.audit);

  const answerData = auditAssessmentDetail && auditAssessmentDetail.data && auditAssessmentDetail.data.length ? auditAssessmentDetail.data[0] : false;
  const answerChecklist = (answerData && answerData.user_input_line_ids && answerData.user_input_line_ids.length > 0) ? answerData.user_input_line_ids : [];

  useEffect(() => {
    if (auditDetails && auditDetails.id) {
      dispatch(getAuditAssessments(auditDetails.id, appModels.AUDITSURVEYINPUT));
    }
  }, [auditDetails]);

  useEffect(() => {
    if (auditDetails.id) {
      dispatch(getAuditActions(auditDetails.id, appModels.AUDITACTION, 'improvement'));
    }
  }, [auditDetails]);

  const actionsData = auditActionDetails && auditActionDetails.data && auditActionDetails.data.length > 0 ? auditActionDetails.data : [];

  function getNCCount() {
    let res = 0;
    const data = actionsData.filter((item) => item.type_action === 'non_conformity');
    if (data && data.length) {
      res = data.length;
    }
    return res;
  }

  function getIOCount() {
    let res = 0;
    const data = actionsData.filter((item) => item.type_action === 'improvement');
    if (data && data.length) {
      res = data.length;
    }
    return res;
  }

  function getNCData() {
    let res = 0;
    const data = actionsData.filter((item) => item.type_action === 'non_conformity');
    if (data && data.length) {
      res = data;
    }
    return res;
  }

  function getIOData() {
    let res = 0;
    const data = actionsData.filter((item) => item.type_action === 'improvement');
    if (data && data.length) {
      res = data;
    }
    return res;
  }

  function getColorCode(label) {
    let res = '';
    if (label === 'Max Score') {
      res = '#6699ff';
    } else if (label === 'Actual Score') {
      res = '#00cc99';
    } else if (label === '% Compliance') {
      res = '#ff9933';
    }
    return res;
  }

  function getTitles(array) {
    const count = [];
    if (array) {
      for (let i = 0; i < array.length; i += 1) {
        count.push((array[i].title));
      }
    }
    return count; // return column data..
  }

  function getAnsweredQuestions(qtnId) {
    let res = false;
    const data = answerChecklist.filter((item) => item.question_id && item.question_id.id && item.question_id.id === qtnId);
    for (let i = 0; i < data.length; i += 1) {
      if (data[i].value_suggested && data[i].value_suggested.value !== 'NA') {
        res = true;
      }
    }
    return res;
  }

  function getTotalMaxArray(array) {
    let count = 0;
    for (let i = 0; i < array.length; i += 1) {
      if (getAnsweredQuestions(array[i].id)) {
        count += array[i].max_score;
      }
    }
    return count; // return column data..
  }

  function getQuizMark(array) {
    let count = 0;
    if (array && array.length) {
      for (let i = 0; i < array.length; i += 1) {
        count += array[i].quizz_mark;
      }
    }
    return count; // return column data..
  }

  function getTotalYesArray(id) {
    let count = 0;
    /* if (array && array.length) {
      for (let i = 0; i < array.length; i += 1) {
        count += getQuizMark(array[i].labels_ids);
      }
    } */
    if (answerChecklist && answerChecklist.length) {
      for (let i = 0; i < answerChecklist.length; i += 1) {
        if (answerChecklist[i].page_id && answerChecklist[i].page_id.id && id === answerChecklist[i].page_id.id) {
          count += answerChecklist[i].quizz_mark;
        }
      }
    }
    return count; // return column data..
  }

  function getTotaMaxAllArray(array) {
    let count = 0;
    for (let i = 0; i < array.length; i += 1) {
      count += getTotalMaxArray(array[i].question_ids);
    }
    return count; // return column data..
  }

  function getTotalYesAllArray(array) {
    let count = 0;
    /* for (let i = 0; i < array.length; i += 1) {
      count += getTotalYesArray(array[i].question_ids);
    } */
    if (answerData && answerData.quizz_score) {
      count = answerData.quizz_score;
    }
    return count; // return column data..
  }

  function getDatasets(values, labels) {
    let result = {};
    if (values) {
      const datas = [];
      for (let i = 0; i < values.length; i += 1) {
        if (values[i].question_ids.length > 0) {
          datas.push({
            max: getTotalMaxArray(values[i].question_ids),
            acheived: getTotalYesArray(values[i].id),
            complaince: numToFloat((getTotalYesArray(values[i].id) / getTotalMaxArray(values[i].question_ids)) * 100),
          });
        }
      }
      const data = [];
      data.push({
        data: getColumnArrayById(datas, 'max'),
        label: 'Max Score',
        backgroundColor: getColorCode('Max Score'),
      });
      data.push({
        data: getColumnArrayById(datas, 'acheived'),
        label: 'Actual Score',
        backgroundColor: getColorCode('Actual Score'),
      });
      data.push({
        data: getColumnArrayById(datas, 'complaince'),
        label: '% Compliance',
        backgroundColor: getColorCode('% Compliance'),
      });
      result = {
        datasets: data,
        labels,
      };
    }
    return result;
  }

  return (
    <Card className="p-2 border-0 bg-white score-card">
      <CardBody className="pt-2">
        {sections && sections.length > 0 && (
          <Row className="score-sub-cards">
            <Col sm="6" md="3" lg="3" xs="6" className={`p-1 ${getNCCount() ? 'cursor-pointer' : ''}`} onClick={() => { setIsNcShow(!isNcShow); setIsIoShow(false); }}>
              <Card className="border-0 bg-med-blue p-2 h-100 text-center">
                <CardBody className="p-2">
                  <h4>{getNCCount()}</h4>
                </CardBody>
                <div>
                  <span className="font-weight-700">Non-Compliances</span>
                </div>
                <span className={isNcShow && getNCData().length > 0 ? 'arrow-bottom' : ''} />
              </Card>
            </Col>
            <Col sm="6" md="3" lg="3" xs="6" className={`p-1 ${getIOCount() ? 'cursor-pointer' : ''}`} onClick={() => { setIsIoShow(!isIoShow); setIsNcShow(false); }}>
              <Card className="border-0 bg-med-blue p-2 h-100 text-center">
                <CardBody className="p-2">
                  <h4>{getIOCount()}</h4>
                </CardBody>
                <div>
                  <span className="font-weight-700">Improvements</span>
                </div>
                <span className={isIoShow && getIOData().length > 0 ? 'arrow-bottom' : ''} />
              </Card>
            </Col>
            <Col sm="6" md="3" lg="3" xs="6" className="p-1">
              <Card className="border-0 bg-med-blue p-2 h-100 text-center">
                <CardBody className="p-2">
                  <h4>
                    {' '}
                    {numToFloat(
                      (getTotalYesAllArray(sections) / getTotaMaxAllArray(sections)) * 100,
                    )}

                  </h4>
                </CardBody>
                <div>
                  <span className="font-weight-700">Audit Complaince (%)</span>
                </div>
              </Card>
            </Col>
            <Col sm="6" md="3" lg="3" xs="6" className="p-1">
              <Card className="border-0 bg-med-blue p-2 h-100 text-center">
                <CardBody className="p-2">
                  <h4>
                    {getTotalYesAllArray(sections)}
                    {' '}
                    /
                    {' '}
                    <span className="font-tiny">{getTotaMaxAllArray(sections)}</span>
                  </h4>
                </CardBody>
                <div>
                  <span className="font-weight-700">Audit Complaince</span>
                </div>
              </Card>
            </Col>
          </Row>
        )}
        {isNcShow && getNCData().length > 0 && (
          <div className="mb-4">
            <h6 className="mb-2 mt-2">Non-Compliances</h6>
            <Table responsive className="font-weight-400 border-0 assets-table" width="100%">
              <thead className="bg-gray-light">
                <tr>
                  <th className="p-2 min-width-160">
                    Observation/Non-Compliance
                  </th>
                  <th className="p-2 min-width-160">
                    Response Type
                  </th>
                  <th className="p-2 min-width-160">
                    Responsible
                  </th>
                  <th className="p-2 min-width-160">
                    Status
                  </th>
                  <th className="p-2 min-width-160">
                    Deadline
                  </th>
                </tr>
              </thead>
              <tbody>
                {getNCData().map((nc) => (
                  <tr key={nc.id}>
                    <td
                      className="p-2 font-weight-800"
                    >
                      {getDefaultNoValue(nc.name)}
                    </td>
                    <td className="p-2">{getDefaultNoValue(getResponseTypeLabel(nc.type_action))}</td>
                    <td className="p-2">{getDefaultNoValue(extractNameObject(nc.user_id, 'name'))}</td>
                    <td className="p-2">{getDefaultNoValue(getStateLabel(nc.state))}</td>
                    <td className="p-2">{getDefaultNoValue(getCompanyTimezoneDate(nc.date_deadline, userInfo, 'date'))}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <hr className="m-0" />
          </div>
        )}
        {isIoShow && getIOData().length > 0 && (
          <div className="mb-4">
            <h6 className="mb-2 mt-2">Improvements</h6>
            <Table responsive className="font-weight-400 border-0 assets-table" width="100%">
              <thead className="bg-gray-light">
                <tr>
                  <th className="p-2 min-width-160">
                    Observation/Non-Compliance
                  </th>
                  <th className="p-2 min-width-160">
                    Response Type
                  </th>
                  <th className="p-2 min-width-160">
                    Responsible
                  </th>
                  <th className="p-2 min-width-160">
                    Status
                  </th>
                  <th className="p-2 min-width-160">
                    Deadline
                  </th>
                </tr>
              </thead>
              <tbody>
                {getIOData().map((nc) => (
                  <tr key={nc.id}>
                    <td
                      className="p-2 font-weight-800"
                    >
                      {getDefaultNoValue(nc.name)}
                    </td>
                    <td className="p-2">{getDefaultNoValue(getResponseTypeLabel(nc.type_action))}</td>
                    <td className="p-2">{getDefaultNoValue(extractNameObject(nc.user_id, 'name'))}</td>
                    <td className="p-2">{getDefaultNoValue(getStateLabel(nc.state))}</td>
                    <td className="p-2">{getDefaultNoValue(getCompanyTimezoneDate(nc.date_deadline, userInfo, 'date'))}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <hr className="m-0" />
          </div>
        )}
        {sections && sections.length === 0 && (
          <ErrorContent errorTxt="No text" />
        )}
        {sections && sections.length > 0 && (
        <div>
          <Bar
            key="Audit Scorecard"
            height="300"
            data={getDatasets(sections, getTitles(sections))}
            options={chartOptions.options}
          />
        </div>
        )}
        <Row className="scoreCard-table">
          <Col sm="12" md="12" lg="12" xs="12" className="p-3 bg-white comments-list thin-scrollbar">
            {sections && sections.length > 0 && (
            <div>
              <Table responsive className="mb-0 mt-2 font-weight-400 border-0 assets-table" width="100%">
                <thead className="bg-gray-light">
                  <tr>
                    <th className="sticky-th">#</th>
                    {sections.map((section) => (
                      <th key={section.id} className="p-2 sticky-th sticky-head cursor-default" title={section && section.title ? section.title : 'General'}>
                        {truncate(section && section.title ? section.title : 'General', 28)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 sticky-td">Max Score</td>
                    {sections.map((section) => (
                      <td key={section.id} className="p-2 sticky-td">{getTotalMaxArray(section.question_ids)}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-2 sticky-td">Actual Score</td>
                    {sections.map((section) => (
                      <td key={section.id} className="p-2 sticky-td">{getTotalYesArray(section.id)}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-2 sticky-td">% Compliance</td>
                    {sections.map((section) => (
                      <td key={section.id} className="p-2 sticky-td">{numToFloat((getTotalYesArray(section.id) / getTotalMaxArray(section.question_ids)) * 100)}</td>
                    ))}
                  </tr>
                </tbody>
              </Table>
              <hr className="m-0" />
            </div>
            )}
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
});

Scorecard.propTypes = {
  auditDetails: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
};

export default Scorecard;
