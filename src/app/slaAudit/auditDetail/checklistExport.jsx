/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/no-array-index-key */
/* eslint-disable radix */
import React, { useEffect, useState, useMemo } from 'react';
import {
  Row,
  Col,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { groupByMultiple } from '../../util/staticFunctions';
import {
  getDiiffNoOfDays,
  getCompanyTimezoneExportDate,
} from '../../util/appUtils';

const checklistExport = (props) => {
  const {
    isMultipleEvaluation,
    detailData,
  } = props;

  const [questionGroups, setQuestionGroups] = useState([]);
  const [categoryId, setCategoryId] = useState([]);

  const tabletd = {

    border: '1px solid #495057', borderCollapse: 'collapse', textAlign: 'left', textTransform: 'capitalize', padding: '2px',
  };
  const tabletdhead = {

    border: '1px solid white',
    borderBottom: '1px solid #4ebbfb',
    fontSize: '17px',
    backgroundColor: '#4ebbfb',
    color: 'white',
    borderCollapse: 'collapse',
    textAlign: 'left',
    textTransform: 'uppercase',
    padding: '2px',
  };

  const tablehead = {

    border: '1px solid white',
    borderBottom: '1px solid #4ebbfb',
    fontSize: '17px',
    backgroundColor: '#4ebbfb',
    color: 'white',
    borderCollapse: 'collapse',
    textAlign: 'center',
    textTransform: 'uppercase',
    padding: '2px',
  };

  const { userInfo } = useSelector((state) => state.user);

  const {
    slaAuditSummary,
    slaAuditConfig,
  } = useSelector((state) => state.slaAudit);

  const inspDeata = detailData && detailData.data && detailData.data.length ? detailData.data[0] : false;
  const isChecklist = (inspDeata && inspDeata.sla_audit_lines && inspDeata.sla_audit_lines.length > 0);

  const stages = useMemo(() => (isMultipleEvaluation && inspDeata && inspDeata.stage_ids && inspDeata.stage_ids.length ? inspDeata.stage_ids : []), [inspDeata, slaAuditConfig]);

  const evaluators = stages && stages.length > 0 ? stages.flatMap((item) => item.evaluators_ids) : [];

  const sortCategories = (dataSections) => {
    dataSections = dataSections.sort((a, b) => a[0].sla_category_id.sequence - b[0].sla_category_id.sequence);
    return dataSections;
  };

  const averageBy = (arr, fn) => arr.map(typeof fn === 'function' ? fn : (val) => val[fn]).reduce((acc, val) => acc + val, 0)
  / arr.length;

  const getQuestions = (catId, grpId) => {
    const catList = isChecklist > 0 ? inspDeata.sla_audit_lines.filter((item) => item.sla_category_id && item.sla_category_id.id === catId) : [];
    const data = catList.filter((item) => item.question_group_id && item.question_group_id.id === grpId);
    const assetData = data.sort((a, b) => a.mro_activity_id.sequence - b.mro_activity_id.sequence);
    return assetData;
  };

  const getQuestionsAvg = (catId, grpId) => {
    const catList = isChecklist > 0 ? inspDeata.sla_audit_lines.filter((item) => item.sla_category_id && item.sla_category_id.id === catId) : [];
    const data = catList.filter((item) => item.question_group_id && item.question_group_id.id === grpId);
    const assetData = data.sort((a, b) => a.mro_activity_id.sequence - b.mro_activity_id.sequence);
    const result = averageBy(assetData, (o) => o.achieved_score);
    return result;
  };

  const sortSections = (dataSections) => {
    dataSections = dataSections.sort((a, b) => a[0].question_group_id.sequence - b[0].question_group_id.sequence);
    return dataSections;
  };

  function getDateDifferences(dateNum, givenValue, monthText) {
    const dn = new Date(inspDeata.audit_date);
    const month = dn.getMonth() + 1;
    const year = dn.getFullYear();
    let monthValue = month > 9 ? month : `0${month}`;
    if (monthText === 'Next') {
      const nMon = month + 1;
      monthValue = nMon > 9 ? nMon : `0${nMon}`;
    }
    const day = dateNum > 9 ? dateNum : `0${dateNum}`;
    const targetDate = new Date(`${year}-${monthValue}-${day}`);
    const noOfdays = getDiiffNoOfDays(new Date(givenValue), targetDate);
    return Math.round(noOfdays);
  }

  function getRangeValue(type, target, givenValue, qtnType, month) {
    let value = 0;
    if (givenValue) {
      if (qtnType !== 'date' && !isNaN(givenValue)) {
        if (type === 'Subtract') {
          value = parseFloat(target) - parseFloat(givenValue);
        } else if (type === 'Divide') {
          value = parseFloat(givenValue) / parseFloat(target);
        } else if (type === 'Measure') {
          value = parseFloat(givenValue);
        } else if (type === 'Subtract Percentage') {
          const diffValue = (parseFloat(target) - parseFloat(givenValue));
          value = (diffValue / parseFloat(target)) * 100;
          value = `${value} %`;
        } else if (type === 'Percentage' || type === 'Measure Percentage') {
          value = (parseFloat(givenValue) / parseFloat(target)) * 100;
          value = `${value} %`;
        }
      } else {
        value = getDateDifferences(target, givenValue, month);
      }
    }
    return value;
  }

  function getTypeAnswer(qtnType, givenValue) {
    let value = '';
    if (qtnType !== 'date') {
      value = givenValue;
    } else {
      value = givenValue ? getCompanyTimezoneExportDate(givenValue, userInfo, 'datetime') : 0;
    }
    return value;
  }

  function getTypeTarget(qtnType, givenValue, monthText) {
    let value = '';
    if (qtnType !== 'date') {
      value = givenValue;
    } else if (givenValue && qtnType === 'date') {
      const dn = new Date(inspDeata.audit_date);
      const month = dn.getMonth() + 1;
      const year = dn.getFullYear();
      let monthValue = month > 9 ? month : `0${month}`;
      if (monthText === 'Next') {
        const nMon = month + 1;
        monthValue = nMon > 9 ? nMon : `0${nMon}`;
      }
      const day = givenValue > 9 ? givenValue : `0${givenValue}`;
      const targetDate = new Date(`${year}-${monthValue}-${day}`);
      value = getCompanyTimezoneExportDate(targetDate, userInfo, 'datetime');
    }
    return value;
  }

  const getSections = (catId) => {
    const catList = isChecklist > 0 ? inspDeata.sla_audit_lines.filter((item) => item.sla_category_id && item.sla_category_id.id === catId) : [];
    const assetData = sortSections(groupByMultiple(catList, (obj) => (obj.question_group_id && obj.question_group_id.id ? obj.question_group_id.id : '')));
    return assetData;
  };

  const getSummaryData = (field, grpId) => {
    const catList = slaAuditSummary && slaAuditSummary.data ? slaAuditSummary.data.filter((item) => item.question_group_id && item.question_group_id.id === grpId) : [];
    const assetData = catList && catList.length && catList[0][field] ? catList[0][field] : '';
    return assetData;
  };

  const getQuestionsLength = (catId, grpId) => {
    const catList = isChecklist > 0 ? inspDeata.sla_audit_lines.filter((item) => item.sla_category_id && item.sla_category_id.id === catId) : [];
    const data = catList.filter((item) => item.question_group_id && item.question_group_id.id === grpId);
    const assetData = data.sort((a, b) => a.mro_activity_id.sequence - b.mro_activity_id.sequence);
    return assetData.length;
  };

  const sections = isChecklist > 0 ? sortSections(groupByMultiple(questionGroups, (obj) => (obj.question_group_id && obj.question_group_id.id ? obj.question_group_id.id : ''))) : [];

  const categories = isChecklist > 0 ? groupByMultiple(inspDeata.sla_audit_lines, (obj) => (obj.sla_category_id && obj.sla_category_id.id ? obj.sla_category_id.id : '')) : [];

  useEffect(() => {
    if (categories && categories.length && categories[0].length) {
      setCategoryId(categories[0][0] && categories[0][0].sla_category_id ? categories[0][0].sla_category_id.id : false);
    }
  }, [detailData]);

  useEffect(() => {
    if (categoryId && inspDeata && inspDeata.sla_audit_lines && inspDeata.sla_audit_lines.length) {
      const catList = inspDeata.sla_audit_lines.filter((item) => item.sla_category_id && item.sla_category_id.id === categoryId);
      setQuestionGroups(catList);
    }
  }, [categoryId]);

  return (
    <Row>
      <Col md="12" sm="12" lg="12" className="d-none">
        <div id="SLA_Tracker_Checklists_Export">
          <table align="center">
            <tbody>
              <tr>
                <td colSpan={15}><b>SLA Tracker Items</b></td>
              </tr>
              <tr>
                <td>Company</td>
                <td colSpan={15}><b>{userInfo && userInfo.data ? userInfo.data.company.name : 'Company'}</b></td>
              </tr>
              <tr>
                <td>Title</td>
                <td colSpan={15}><b>{inspDeata && inspDeata.name ? inspDeata.name : '' }</b></td>
              </tr>
            </tbody>
          </table>
          <br />
          {isChecklist > 0 && sortCategories(categories).map((cat, catIndex) => (
            <>
              <br />
              <table style={{ border: '1px solid #495057', backgroundColor: '#4ebbfb', borderCollapse: 'collapse' }} className="export-table1" width="100%" align="left" id="table-to-xls_report">
                <thead>
                  <tr>
                    <th style={tablehead} colSpan="14">{cat && cat[0].sla_category_id && cat[0].sla_category_id.name ? cat[0].sla_category_id.name : ''}</th>
                  </tr>
                </thead>
              </table>
              <br />
              <table style={{ border: '1px solid #495057', borderCollapse: 'collapse' }} className="export-table1" width="100%" align="left" id="table-to-xls_report">
                <thead>
                  <tr>
                    <th style={tabletdhead}>Si No</th>
                    <th style={tabletdhead}>Performance Indicator</th>
                    <th style={tabletdhead}>Parameter Criteria</th>
                    <th style={tabletdhead}>Guidelines</th>
                    <th style={tabletdhead}>Weightages</th>
                    <th style={tabletdhead}>Calculated Weightages</th>
                    <th style={tabletdhead}>Target Score</th>
                    <th style={tabletdhead}>Target Weightage Score</th>
                    {isMultipleEvaluation && evaluators && evaluators.length > 0 && evaluators.map((ev) => (
                      <th style={tabletdhead}>
                        {`${ev.name} Target`}
                      </th>
                    ))}
                    <th style={tabletdhead}>Target</th>
                    {isMultipleEvaluation && evaluators && evaluators.length > 0 && evaluators.map((ev) => (
                      <th style={tabletdhead}>
                        {`${ev.name} Measured`}
                      </th>
                    ))}
                    <th style={tabletdhead}>Measured</th>
                    <th style={tabletdhead}>Data Source / Evidences</th>
                    <th style={tabletdhead}>Differences</th>
                    <th style={tabletdhead}>Achieved Score</th>
                    <th style={tabletdhead}>Average Achieved Score</th>
                  </tr>
                </thead>
                <tbody>
                  {isChecklist > 0 && getSections(cat && cat[0].sla_category_id && cat[0].sla_category_id.id ? cat[0].sla_category_id.id : '').map((section, index) => (
                    <tr>
                      <td style={tabletd}>{index + 1}</td>
                      <td style={tabletd}>
                        {section && section[0].question_group_id && section[0].question_group_id.name ? section[0].question_group_id.name : 'General'}
                      </td>
                      <td style={tabletd}>
                        {getQuestions(cat && cat[0].sla_category_id && cat[0].sla_category_id.id ? cat[0].sla_category_id.id : '', section && section[0].question_group_id && section[0].question_group_id.id ? section[0].question_group_id.id : '').map((qtn, index1) => (
                          <>
                            <span>
                              {qtn.mro_activity_id && qtn.mro_activity_id.name ? qtn.mro_activity_id.name : ''}
                            </span>
                            <br />
                            {getQuestionsLength(cat && cat[0].sla_category_id && cat[0].sla_category_id.id ? cat[0].sla_category_id.id : '', section && section[0].question_group_id && section[0].question_group_id.id ? section[0].question_group_id.id : '') !== (index1 + 1) && (
                            <hr className="m-0 p-0" />
                            )}
                          </>
                        ))}
                      </td>
                      <td style={tabletd}>
                        {section && section[0].question_group_id && section[0].question_group_id.remarks ? section[0].question_group_id.remarks : ''}
                      </td>
                      <td style={tabletd}>
                        {section && section[0].question_group_id && section[0].question_group_id.weightage ? section[0].question_group_id.weightage : ''}
                      </td>
                      <td style={tabletd}>
                        {section && section[0].question_group_id && section[0].question_group_id.id ? getSummaryData('calculated_weightage', section[0].question_group_id.id) : ''}
                      </td>
                      <td style={tabletd}>
                        {section && section[0].question_group_id && section[0].question_group_id.target_score}
                      </td>
                      <td style={tabletd}>
                        {section && section[0].question_group_id && section[0].question_group_id.id ? getSummaryData('target_weightage_score', section[0].question_group_id.id) : ''}
                      </td>
                      {isMultipleEvaluation && evaluators && evaluators.length > 0 && evaluators.map((ev, index) => getQuestions(
                        cat?.[0]?.sla_category_id?.id || '',
                        section?.[0]?.question_group_id?.id || '',
                      ).map((qtn, index1) => {
                        const value = qtn.evaluations_ids.find((v) => v.evaluator_id.id === ev.id);

                        return (
                          <td key={`ev-${ev.id}-qtn-${qtn.id}`} style={tabletd}>
                            <span>{value ? value.target : '-'}</span>
                            <br />
                            {getQuestionsLength(
                              cat?.[0]?.sla_category_id?.id || '',
                              section?.[0]?.question_group_id?.id || '',
                            ) !== (index1 + 1) && (
                            <hr className="m-0 p-0" />
                            )}
                          </td>
                        );
                      }))}
                      <td style={tabletd}>
                        {getQuestions(cat && cat[0].sla_category_id && cat[0].sla_category_id.id ? cat[0].sla_category_id.id : '', section && section[0].question_group_id && section[0].question_group_id.id ? section[0].question_group_id.id : '').map((qtn, index1) => (
                          <>
                            <span>
                              {qtn.mro_activity_id && qtn.mro_activity_id.target_placeholder ? `${qtn.mro_activity_id.target_placeholder} ${getTypeTarget(qtn.mro_activity_id.type, qtn.target, qtn.mro_activity_id.for_month)}` : getTypeTarget(qtn.mro_activity_id.type, qtn.target, qtn.mro_activity_id.for_month)}
                            </span>
                            <br />
                            {getQuestionsLength(cat && cat[0].sla_category_id && cat[0].sla_category_id.id ? cat[0].sla_category_id.id : '', section && section[0].question_group_id && section[0].question_group_id.id ? section[0].question_group_id.id : '') !== (index1 + 1) && (
                            <hr className="m-0 p-0" />
                            )}
                          </>
                        ))}
                      </td>
                      {isMultipleEvaluation && evaluators && evaluators.length > 0 && evaluators.map((ev, index) => getQuestions(
                        cat?.[0]?.sla_category_id?.id || '',
                        section?.[0]?.question_group_id?.id || '',
                      ).map((qtn, index1) => {
                        const value = qtn.evaluations_ids.find((v) => v.evaluator_id.id === ev.id);

                        return (
                          <td key={`ev-${ev.id}-qtn-${qtn.id}`} style={tabletd}>
                            <span>{value ? value.measured_value : '-'}</span>
                            <br />
                            {getQuestionsLength(
                              cat?.[0]?.sla_category_id?.id || '',
                              section?.[0]?.question_group_id?.id || '',
                            ) !== (index1 + 1) && (
                            <hr className="m-0 p-0" />
                            )}
                          </td>
                        );
                      }))}
                      <td style={tabletd}>
                        {getQuestions(cat && cat[0].sla_category_id && cat[0].sla_category_id.id ? cat[0].sla_category_id.id : '', section && section[0].question_group_id && section[0].question_group_id.id ? section[0].question_group_id.id : '').map((qtn, index1) => (
                          <>
                            <span>
                              {qtn.mro_activity_id && qtn.mro_activity_id.measured_placeholder ? `${qtn.mro_activity_id.measured_placeholder} ${getTypeAnswer(qtn.mro_activity_id.type, qtn.answer)}` : getTypeAnswer(qtn.mro_activity_id.type, qtn.answer)}
                            </span>
                            <br />
                            {getQuestionsLength(cat && cat[0].sla_category_id && cat[0].sla_category_id.id ? cat[0].sla_category_id.id : '', section && section[0].question_group_id && section[0].question_group_id.id ? section[0].question_group_id.id : '') !== (index1 + 1) && (
                            <hr className="m-0 p-0" />
                            )}
                          </>
                        ))}
                      </td>
                      <td style={tabletd}>
                        {getQuestions(cat && cat[0].sla_category_id && cat[0].sla_category_id.id ? cat[0].sla_category_id.id : '', section && section[0].question_group_id && section[0].question_group_id.id ? section[0].question_group_id.id : '').map((qtn, index1) => (
                          <>
                            <span>
                              {qtn.mro_activity_id && qtn.mro_activity_id.data_source ? qtn.mro_activity_id.data_source : ''}
                            </span>
                            <br />
                            {getQuestionsLength(cat && cat[0].sla_category_id && cat[0].sla_category_id.id ? cat[0].sla_category_id.id : '', section && section[0].question_group_id && section[0].question_group_id.id ? section[0].question_group_id.id : '') !== (index1 + 1) && (
                            <hr className="m-0 p-0" />
                            )}
                          </>
                        ))}
                      </td>
                      <td style={tabletd}>
                        {getQuestions(cat && cat[0].sla_category_id && cat[0].sla_category_id.id ? cat[0].sla_category_id.id : '', section && section[0].question_group_id && section[0].question_group_id.id ? section[0].question_group_id.id : '').map((qtn, index1) => (
                          <>
                            <span>
                              {getRangeValue(qtn.mro_activity_id.difference, qtn.target, qtn.answer, qtn.mro_activity_id.type, qtn.mro_activity_id.for_month)}
                            </span>
                            <br />
                            {getQuestionsLength(cat && cat[0].sla_category_id && cat[0].sla_category_id.id ? cat[0].sla_category_id.id : '', section && section[0].question_group_id && section[0].question_group_id.id ? section[0].question_group_id.id : '') !== (index1 + 1) && (
                            <hr className="m-0 p-0" />
                            )}
                          </>
                        ))}
                      </td>
                      <td style={tabletd}>
                        {getQuestions(cat && cat[0].sla_category_id && cat[0].sla_category_id.id ? cat[0].sla_category_id.id : '', section && section[0].question_group_id && section[0].question_group_id.id ? section[0].question_group_id.id : '').map((qtn, index1) => (
                          <>
                            <span>
                              {qtn.achieved_score}
                            </span>
                            <br />
                            {getQuestionsLength(cat && cat[0].sla_category_id && cat[0].sla_category_id.id ? cat[0].sla_category_id.id : '', section && section[0].question_group_id && section[0].question_group_id.id ? section[0].question_group_id.id : '') !== (index1 + 1) && (
                            <hr className="m-0 p-0" />
                            )}
                          </>
                        ))}
                      </td>
                      <td style={tabletd}>
                        {getQuestionsAvg(cat && cat[0].sla_category_id && cat[0].sla_category_id.id ? cat[0].sla_category_id.id : '', section && section[0].question_group_id && section[0].question_group_id.id ? section[0].question_group_id.id : '')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ))}
        </div>
      </Col>
      <iframe name="print_frame" title="SLA_Tracker_Checklists_Export" id="print_frame" width="0" height="0" frameBorder="0" src="about:blank" />
    </Row>
  );
};

checklistExport.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
  ]).isRequired,
};

export default checklistExport;
