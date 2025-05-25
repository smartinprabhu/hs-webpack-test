/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import {
  Button, Card, CardHeader, Collapse,
  Row,
  Table,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import {
  faAngleDown, faAngleUp,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';

import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';

import { getAuditAssessments } from '../auditService';
import {
  generateErrorMessage,
  getDefaultNoValue,
  numToFloatView,
} from '../../util/appUtils';
import { groupByMultiple } from '../../util/staticFunctions';

const appModels = require('../../util/appModels').default;

const Checklists = (props) => {
  const {
    detailData,
  } = props;

  const dispatch = useDispatch();

  const [accordion, setAccordian] = useState([]);
  const [icon, setIcon] = useState(faAngleDown);

  const loading = detailData && detailData.loading;
  const isErr = detailData && detailData.err;
  const inspDeata = detailData && detailData.data && detailData.data.length ? detailData.data[0] : false;
  const isChecklist = (inspDeata && inspDeata.audit_system_id && inspDeata.audit_system_id.page_ids && inspDeata.audit_system_id.page_ids.length > 0);

  const { auditAssessmentDetail } = useSelector((state) => state.audit);

  const answerData = auditAssessmentDetail && auditAssessmentDetail.data && auditAssessmentDetail.data.length ? auditAssessmentDetail.data[0] : false;
  const answerChecklist = (answerData && answerData.user_input_line_ids && answerData.user_input_line_ids.length > 0) ? answerData.user_input_line_ids : [];

  useEffect(() => {
    if (inspDeata && inspDeata.id) {
      dispatch(getAuditAssessments(inspDeata.id, appModels.AUDITSURVEYINPUT));
    }
  }, [detailData]);

  function getAnswerValue(type, data) {
    let res = '';
    if (type === 'number') {
      res = data.value_number;
    } else if (type === 'date') {
      res = data.value_date;
    } else if (type === 'text') {
      res = data.value_text;
    } else if (type === 'free_text') {
      res = data.value_free_text;
    } else if (type === 'suggestion') {
      res = data.value_suggested && data.value_suggested.value ? data.value_suggested.value : '';
    }
    return res;
  }

  function getAnswer(qtnId) {
    let res = '';
    const data = answerChecklist.filter((item) => item.question_id && item.question_id.id && item.question_id.id === qtnId);
    if (data && data.length) {
      res = getAnswerValue(data[0].answer_type, data[0]);
    }
    return res;
  }

  function getScore(qtnId) {
    let res = '';
    const data = answerChecklist.filter((item) => item.question_id && item.question_id.id && item.question_id.id === qtnId);
    if (data && data.length) {
      res = data[0].quizz_mark;
    }
    return res;
  }

  function getRemarks(qtnId) {
    let res = '';
    const data = answerChecklist.filter((item) => item.question_id && item.question_id.id && item.question_id.id === qtnId);
    if (data && data.length) {
      res = data[0].remarks;
    }
    return res;
  }

  function getQuestion(assetData) {
    const tableTr = [];
    const assetDataList = assetData.sort((a, b) => a.sequence - b.sequence);
    for (let i = 0; i < assetDataList.length; i += 1) {
      tableTr.push(
        <tr key={i}>
          <td className="p-2">{getDefaultNoValue(assetData[i].question)}</td>
          <td className="p-2">{getDefaultNoValue(assetData[i].question_description)}</td>
          <td className="p-2">{numToFloatView(assetData[i].max_score)}</td>
          <td className="p-2">{getDefaultNoValue(numToFloatView(getScore(assetData[i].id)))}</td>
          <td className="p-2">{getDefaultNoValue(getAnswer(assetData[i].id))}</td>
          <td className="p-2">{getDefaultNoValue(getRemarks(assetData[i].id))}</td>
        </tr>,
      );
    }
    return tableTr;
  }

  function getRow(assetData, groupId) {
    const tableTr = [];
    let gId = false;
    if (groupId) {
      gId = groupId;
    }
    const assetDataList = assetData.sort((a, b) => a.sequence - b.sequence);

    for (let i = 0; i < assetDataList.length; i += 1) {
      if (assetData[i].id && assetData[i].id && assetData[i].id === gId) {
        tableTr.push(getQuestion(assetData[i].question_ids));
      }
    }
    return tableTr;
  }

  const sections = isChecklist > 0 ? groupByMultiple(inspDeata.audit_system_id.page_ids, (obj) => (obj.id ? obj.id : '')) : [];

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
  }, [detailData]);

  return (
    <>
      {(!loading && isChecklist) && (
      <div className="ml-0">
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
                    {section && section[0].title && section[0].title ? section[0].title : 'General'}
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
                <Row className="mr-2 ml-2 mb-0 products-list-tab">
                  {isChecklist && (
                  <>
                    <Table responsive className="mb-0 mt-2 font-weight-400 border-0 assets-table" width="100%">
                      <thead>
                        <tr>
                          <th className="p-2 min-width-160">
                            {inspDeata.audit_system_id && inspDeata.audit_system_id.question_name ? inspDeata.audit_system_id.question_name : 'Question Name'}
                          </th>
                          <th className="p-2 min-width-160">
                            {inspDeata.audit_system_id && inspDeata.audit_system_id.question_description ? inspDeata.audit_system_id.question_description : 'Question Group'}
                          </th>
                          <th className="p-2 min-width-160">
                            Max Score
                          </th>
                          <th className="p-2 min-width-160">
                            Achieved Score
                          </th>
                          <th className="p-2 min-width-160">
                            Answer
                          </th>
                          <th className="p-2 min-width-160">
                            Remarks
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {getRow(
                          inspDeata.audit_system_id.page_ids,
                          section && section[0].id ? section[0].id : '',
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
      <ErrorContent errorTxt={generateErrorMessage(detailData && detailData.err ? detailData.err : 'No Data Found')} />
      )}
      {!isErr && inspDeata && !isChecklist && !loading && (
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
