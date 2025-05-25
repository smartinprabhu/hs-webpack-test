/* eslint-disable no-return-assign */
/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-expressions */
/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Badge,
  Col,
  Table,
  Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { Pie, Bar } from 'react-chartjs-2';
import customData from '../data/customData.json';
import { getPercentage } from '../../assets/utils/utils';
import { getDatasetsPie, getDatasetsPieArray, getDatasetsGroupArray } from '../utils/utils';

import {
  getDefaultNoValue,
  generateArrayFromInner, getColumnArrayById,
  getMaskedEmail, getMaskedPhoneNo,
} from '../../util/appUtils';

const tabletd = {
  border: '1px solid #495057', borderCollapse: 'collapse', textAlign: 'left', textTransform: 'capitalize', padding: '2px',
};

const tabletdemail = {
  border: '1px solid #495057', borderCollapse: 'collapse', textAlign: 'left', padding: '2px',
};

const tabletdhead = {

  border: '1px solid #495057',
  borderBottom: '1px solid #495057',
  fontSize: '17px',
  backgroundColor: '#f3f9fc',
  borderCollapse: 'collapse',
  textAlign: 'left',
  textTransform: 'uppercase',
  padding: '2px',
};

const PrintAnswerReport = (props) => {
  const { surveyDetails, surveyAnswerReport, showGraph } = props;

  const reviewerDetails = surveyAnswerReport && surveyAnswerReport.data && surveyAnswerReport.data.survey
    && surveyAnswerReport.data.survey.reviwer && surveyAnswerReport.data.survey.reviwer.length
    ? surveyAnswerReport.data.survey.reviwer : false;

  const isLoading = (surveyAnswerReport && surveyAnswerReport.loading) || (surveyDetails && surveyDetails.loading);
  const today = moment(new Date()).format('DD-MMMM-YYYY');

  const qtns = surveyAnswerReport && surveyAnswerReport.data && surveyAnswerReport.data.survey_dict && surveyAnswerReport.data.survey_dict.page_ids
    && surveyAnswerReport.data.survey_dict.page_ids ? generateArrayFromInner(surveyAnswerReport.data.survey_dict.page_ids, 'question_ids') : false;

  const qtnsList = qtns && qtns.length ? qtns : false;

  const qtnListOrdered = qtnsList ? qtnsList.sort((a, b) => a.sequence - b.sequence) : false;

  let count = 0;

  function getAnswerTypeData(type, obj) {
    let res = '';
    if (type && obj) {
      if (type === 'date') {
        res = obj.value_date;
      } else if (type === 'free_text') {
        res = obj.value_free_text;
      } else if (type === 'text') {
        res = obj.value_text;
      }
    }
    return res;
  }

  function getAnswerTypeValues(arr) {
    let result = [];
    if (arr) {
      result = [...arr.reduce((mp, o) => {
        if (!mp.has(getAnswerTypeData(o.answer_type, o))) mp.set(getAnswerTypeData(o.answer_type, o), { ...o, count: 0 });
        mp.get(getAnswerTypeData(o.answer_type, o)).count++;
        return mp;
      }, new Map()).values()];
    }
    return result;
  }

  function getChart(qtnData) {
    let chartDiv = <div />;
    if (qtnData.input_summary && !qtnData.input_summary.answered) {
      chartDiv = (
        <div className="p-3 text-center">
          <h4>No Data Found.</h4>
        </div>
      );
    } else if (qtnData.graph_data && qtnData.graph_data.length > 0 && qtnData.graph_data[0] && qtnData.graph_data[0].values) {
      chartDiv = (
        <div>
          {showGraph !== 'Switch to Bar Chart' ? (
            <Bar
              key={qtnData.graph_data[0].key}
              options={customData.barChartOptions}
              data={getDatasetsPie(qtnData.graph_data[0].values, qtnData.prepare_result.answers ? getColumnArrayById(qtnData.prepare_result.answers, 'color') : [])}
            />
          ) : (
            <Pie
              key={qtnData.graph_data[0].key}
              options={customData.pieChartOptions}
              data={getDatasetsPie(qtnData.graph_data[0].values, qtnData.prepare_result.answers ? getColumnArrayById(qtnData.prepare_result.answers, 'color') : [])}
            />
          )}
        </div>
      );
    } else if (qtnData.prepare_result && qtnData.prepare_result.most_common && qtnData.prepare_result.most_common.length) {
      chartDiv = (
        <div>
          {showGraph !== 'Switch to Bar Chart' ? (
            <Bar
              key={qtnData}
              options={customData.barChartOptions}
              data={getDatasetsPieArray(qtnData.prepare_result.most_common, qtnData.prepare_result.answers ? getColumnArrayById(qtnData.prepare_result.answers, 'color') : [])}
            />
          ) : (
            <Pie
              key={qtnData}
              options={customData.pieChartOptions}
              data={getDatasetsPieArray(qtnData.prepare_result.most_common, qtnData.prepare_result.answers ? getColumnArrayById(qtnData.prepare_result.answers, 'color') : [])}
            />
          )}
        </div>
      );
    } else if (qtnData.graph_data && qtnData.graph_data.length > 0) {
      chartDiv = (
        <div>
          {showGraph !== 'Switch to Bar Chart' ? (
            <Bar
              key={qtnData}
              options={customData.barChartOptions}
              data={getDatasetsPie(qtnData.graph_data, qtnData.prepare_result.answers ? getColumnArrayById(qtnData.prepare_result.answers, 'color') : [])}
            />
          ) : (
            <Pie
              key={qtnData}
              options={customData.pieChartOptions}
              data={getDatasetsPie(qtnData.graph_data, qtnData.prepare_result.answers ? getColumnArrayById(qtnData.prepare_result.answers, 'color') : [])}
            />
          )}
        </div>
      );
    } else if (qtnData.prepare_result && qtnData.prepare_result.length && qtnData.prepare_result.length > 0) {
      chartDiv = (
        <div>
          {showGraph !== 'Switch to Bar Chart' ? (
            <Bar
              key={qtnData}
              options={customData.barChartOptions}
              data={getDatasetsGroupArray(qtnData.prepare_result, qtnData.prepare_result.answers ? getColumnArrayById(qtnData.prepare_result.answers, 'color') : [])}
            />
          ) : (
            <Pie
              key={qtnData}
              options={customData.pieChartOptions}
              data={getDatasetsGroupArray(qtnData.prepare_result, qtnData.prepare_result.answers ? getColumnArrayById(qtnData.prepare_result.answers, 'color') : [])}
            />
          )}
        </div>
      );
    } else {
      chartDiv = (
        <div className="p-3 text-center">
          <h4>No Data Found.</h4>
        </div>
      );
    }
    return chartDiv;
  }

  function getRowExcel(assetData, total) {
    const tableTr = [];
    if (assetData.answers && assetData.answers.length) {
      for (let i = 0; i < assetData.answers.length; i += 1) {
        tableTr.push(
          <tr key={i}>
            <td style={tabletd}>{getDefaultNoValue(assetData.answers[i].text)}</td>
            <td style={tabletd}>{assetData.answers[i].count}</td>
            <td style={tabletd}>{getPercentage(total, assetData.answers[i].count)}</td>
          </tr>,
        );
      }
    } else if (assetData.most_common && assetData.most_common.length) {
      for (let i = 0; i < assetData.most_common.length; i += 1) {
        tableTr.push(
          <tr key={i}>
            <td style={tabletd}>{assetData.most_common[i][0]}</td>
            <td style={tabletd}>{assetData.most_common[i][1]}</td>
            <td style={tabletd}>{getPercentage(total, assetData.most_common[i][1])}</td>
          </tr>,
        );
      }
    } else if (assetData && assetData.length) {
      const groupedData = getAnswerTypeValues(assetData);
      for (let i = 0; i < groupedData.length; i += 1) {
        tableTr.push(
          <tr key={i}>
            <td style={tabletd}>{getAnswerTypeData(groupedData[i].answer_type, groupedData[i])}</td>
            <td style={tabletd}>{groupedData[i].count}</td>
            <td style={tabletd}>{getPercentage(total, groupedData[i].count)}</td>
          </tr>,
        );
      }
    } else {
      tableTr.push(
        <tr>
          <td style={tabletd} colSpan="2" align="center">No Data Found</td>
        </tr>,
      );
    }
    return tableTr;
  }

  function getRow(assetData) {
    const tableTr = [];
    if (assetData.answers && assetData.answers.length) {
      for (let i = 0; i < assetData.answers.length; i += 1) {
        tableTr.push(
          <tr key={i}>
            <td className="p-2">{getDefaultNoValue(assetData.answers[i].text)}</td>
            <td className="p-2">{assetData.answers[i].count}</td>
          </tr>,
        );
      }
    } else if (assetData.most_common && assetData.most_common.length) {
      for (let i = 0; i < assetData.most_common.length; i += 1) {
        tableTr.push(
          <tr key={i}>
            <td className="p-2">{assetData.most_common[i][0]}</td>
            <td className="p-2">{assetData.most_common[i][1]}</td>
          </tr>,
        );
      }
    } else if (assetData && assetData.length) {
      const groupedData = getAnswerTypeValues(assetData);
      for (let i = 0; i < groupedData.length; i += 1) {
        tableTr.push(
          <tr key={i}>
            <td className="p-2">{getAnswerTypeData(groupedData[i].answer_type, groupedData[i])}</td>
            <td className="p-2">{groupedData[i].count}</td>
          </tr>,
        );
      }
    } else {
      tableTr.push(
        <tr>
          <td colSpan="2" align="center">No Data Found</td>
        </tr>,
      );
    }
    return tableTr;
  }

  return (
    <>
      <div id="print-survey-report-excel">
        <table width="100%" style={{ width: '100%' }}>
          <tbody>
            <tr>
              <td>
                <Row>
                  <Col>
                    <h3 style={{ float: 'left' }}>
                      {surveyDetails && surveyDetails.data ? surveyDetails.data[0].title : ''}
                    </h3>
                  </Col>
                  <Col>
                    <h3 style={{ float: 'right' }}>
                      <span>
                        <span style={{ marginRight: '0.5rem' }}>Generated on</span>
                        <span style={{ marginRight: '0.5rem' }}>{today}</span>
                      </span>
                    </h3>
                  </Col>
                </Row>
                {/* <p>{surveyDetails && surveyDetails.data ? surveyDetails.data[0].description : ''}</p> */}
                {!isLoading && reviewerDetails && (
                  <Row>
                    <Col sm="12" md="12" lg="12" xs="12">
                      <div style={{ padding: '1.5rem ' }} className="p-3">
                        <h6 style={{ fontSize: '17px', marginBottom: '15px' }}>Reviewer Details</h6>
                        <table style={{ border: '1px solid #495057', borderCollapse: 'collapse', marginBottom: '15px' }} className="export-table1" width="100%" align="left">
                          <thead>
                            <tr>
                              <th style={tabletdhead}>
                                Name
                              </th>
                              <th style={tabletdhead}>
                                Email
                              </th>
                              <th style={tabletdhead}>
                                Mobile
                              </th>
                              <th style={tabletdhead}>
                                Employee Code
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {reviewerDetails && reviewerDetails.map((rd) => (
                              <tr>
                                <td style={tabletd}>{getDefaultNoValue(rd.reviwer_name)}</td>
                                <td style={tabletdemail}>{getDefaultNoValue(getMaskedEmail(rd.email, 'x'))}</td>
                                <td style={tabletd}>{getDefaultNoValue(getMaskedPhoneNo(rd.reviwer_mobile))}</td>
                                <td style={tabletd}>{getDefaultNoValue(rd.employee_code)}</td>

                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </Col>
                  </Row>
                )}
                {!isLoading && surveyAnswerReport && surveyAnswerReport.data && surveyAnswerReport.data.survey_dict
                  && surveyAnswerReport.data.survey_dict.page_ids && (
                    <div style={{ padding: '1rem ' }} className="p-3">
                      {qtnListOrdered && qtnListOrdered.map((qtn) => (
                        <div key={qtn.question} style={{ padding: '0.5rem ' }} className="p-2">
                          <h6 style={{ fontSize: '17px', marginBottom: '0px' }}>
                            Q
                            {count += 1}
                            )
                            {'  '}
                            {qtn.question && qtn.question.name ? qtn.question.name : ''}
                          </h6>
                          {/* <div style={{ float: 'right', marginBottom: '0.5rem' }}>
                    <span style={{  marginRight: '0.5rem' }}>Total</span> -
                    <span style={{  marginRight: '0.5rem' }}>{qtn.input_summary.total_inputs}</span>
                    <br/>
                    <span style={{  marginRight: '0.5rem' }}>Answered</span> -
                    <span style={{  marginRight: '0.5rem' }}>{qtn.input_summary.answered}</span>
                    <br/>
                    <span style={{  marginRight: '0.5rem' }}>Skipped</span> -
                    <span style={{  marginRight: '0.5rem' }}>{qtn.input_summary.skipped}</span>
                    <br/>
                    {qtn.prepare_result && qtn.prepare_result.average && (
                      <>
                        <span style={{  marginRight: '0.5rem' }}>Avg</span> -
                        <span style={{  marginRight: '0.5rem' }}>{qtn.prepare_result.average}</span>
                        <br/>
                      </>
                    )}
                    {qtn.prepare_result && qtn.prepare_result.min && (
                      <>
                        <span style={{  marginRight: '0.5rem' }}>Min</span> -
                        <span style={{  marginRight: '0.5rem' }}>{qtn.prepare_result.min}</span>
                        <br/>
                      </>
                    )}
                    {qtn.prepare_result && qtn.prepare_result.max && (
                      <>
                        <span style={{  marginRight: '0.5rem' }}>Max</span> -
                        <span style={{  marginRight: '0.5rem' }}>{qtn.prepare_result.max}</span>
                        <br/>
                      </>
                    )}
                    {qtn.prepare_result && qtn.prepare_result.sum && (
                      <>
                        <span style={{  marginRight: '0.5rem' }}>Sum</span> -
                        <span style={{  marginRight: '0.5rem' }}>{qtn.prepare_result.sum}</span>
                      </>
                    )}
                  </div> */}

                          <table style={{ border: '1px solid #495057', borderCollapse: 'collapse', marginBottom: '15px' }} className="export-table1" width="100%" align="left">
                            <thead>
                              <tr>
                                <th style={tabletdhead}>
                                  Total
                                </th>
                                <th style={tabletdhead}>
                                  Answered
                                </th>
                                <th style={tabletdhead}>
                                  Skipped
                                </th>

                                {qtn.prepare_result && qtn.prepare_result.average && (
                                  <th style={tabletdhead}>
                                    Avg
                                  </th>
                                )}

                                {qtn.prepare_result && qtn.prepare_result.min && (

                                  <th style={tabletdhead}>
                                    Min
                                  </th>
                                )}
                                {qtn.prepare_result && qtn.prepare_result.max && (

                                  <th style={tabletdhead}>
                                    Max
                                  </th>
                                )}
                                {qtn.prepare_result && qtn.prepare_result.sum && (
                                  <th style={tabletdhead}>
                                    Sum
                                  </th>
                                )}

                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td style={tabletd}>{qtn.input_summary.total_inputs}</td>
                                <td style={tabletd}>{qtn.input_summary.answered}</td>
                                <td style={tabletd}>{qtn.input_summary.skipped}</td>
                                {qtn.prepare_result && qtn.prepare_result.average && (

                                  <td style={tabletd}>{qtn.prepare_result.average}</td>
                                )}
                                {qtn.prepare_result && qtn.prepare_result.min && (

                                  <td style={tabletd}>{qtn.prepare_result.min}</td>
                                )}
                                {qtn.prepare_result && qtn.prepare_result.max && (

                                  <td style={tabletd}>{qtn.prepare_result.max}</td>
                                )}
                                {qtn.prepare_result && qtn.prepare_result.sum && (

                                  <td style={tabletd}>{qtn.prepare_result.sum}</td>
                                )}
                              </tr>
                            </tbody>
                          </table>

                          <br />
                          <Row>
                            <Col sm="12" md="12" lg="12" xs="12">
                              <div style={{ padding: '0.25rem ' }} className="p-1">
                                <table style={{ border: '1px solid #495057', borderCollapse: 'collapse', marginBottom: '15px' }} className="export-table1" width="100%" align="left">
                                  <thead>
                                    <tr>
                                      <th style={tabletdhead}>
                                        Answer Choices
                                      </th>
                                      <th style={tabletdhead}>
                                        User Responses
                                      </th>
                                      <th style={tabletdhead}>
                                        %
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {getRowExcel(qtn.prepare_result ? qtn.prepare_result : [], qtn.input_summary.answered)}
                                  </tbody>
                                </table>
                              </div>
                            </Col>
                          </Row>
                        </div>
                      ))}
                    </div>
                )}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td>
                <div className="page-footer-space" style={{ height: '50px' }} />
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div id="print-survey-report-pdf">
        {!isLoading && surveyAnswerReport && surveyAnswerReport.data && surveyAnswerReport.data.survey_dict
          && surveyAnswerReport.data.survey_dict.page_ids && surveyAnswerReport.data.survey_dict.page_ids.map((section, index) => (
            <div>
              {
                  section.question_ids && section.question_ids.map((qtn, index1) => (
                    <div key={qtn.question} id={`answer-elements-${index}${index1}`} className="p-2">
                      <h6>
                        Q
                        {index + 1}
                        )
                        {'  '}
                        {qtn.question && qtn.question.name ? qtn.question.name : ''}
                        <span className="float-right">
                          <Badge color="info" className="mr-2 badge-text no-border-radius" pill>
                            {qtn.input_summary.total_inputs}
                            {'  '}
                            Total
                          </Badge>
                          <Badge color="success" className="mr-2 badge-text no-border-radius" pill>
                            {qtn.input_summary.answered}
                            {'  '}
                            Answered
                          </Badge>
                          <Badge color="danger" className="mr-2  badge-text no-border-radius" pill>
                            {qtn.input_summary.skipped}
                            {'  '}
                            Skipped
                          </Badge>
                          {qtn.prepare_result && qtn.prepare_result.average && (
                            <Badge color="info" className="mr-2 badge-text no-border-radius" pill>
                              {qtn.prepare_result.average}
                              {'  '}
                              Avg
                            </Badge>
                          )}
                          {qtn.prepare_result && qtn.prepare_result.min && (
                            <Badge color="info" className="mr-2  badge-text no-border-radius" pill>
                              {qtn.prepare_result.min}
                              {'  '}
                              Min
                            </Badge>
                          )}
                          {qtn.prepare_result && qtn.prepare_result.max && (
                            <Badge color="info" className="mr-2  badge-text no-border-radius" pill>
                              {qtn.prepare_result.max}
                              {'  '}
                              Max
                            </Badge>
                          )}
                          {qtn.prepare_result && qtn.prepare_result.sum && (
                            <Badge color="info" className="mr-2  badge-text no-border-radius" pill>
                              {qtn.prepare_result.sum}
                              {'  '}
                              Sum
                            </Badge>
                          )}
                        </span>
                      </h6>
                      <Row>
                        <Col id={`charts-${index}${index1}`} sm="12" md="6" lg="6" xs="12">
                          {getChart(qtn)}
                        </Col>
                        <Col sm="12" md="6" lg="6" xs="12">
                          <div className="p-1 small-table-list thin-scrollbar">
                            <Table responsive className="font-weight-400 border-0 assets-table" width="100%">
                              <thead>
                                <tr>
                                  <th className="p-2 min-width-160">
                                    Answer Choices
                                  </th>
                                  <th className="p-2 min-width-160">
                                    User Responses
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {getRow(qtn.prepare_result ? qtn.prepare_result : [])}
                              </tbody>
                            </Table>
                            <hr className="m-0" />
                          </div>
                        </Col>
                      </Row>
                    </div>
                  ))
                }
            </div>
        ))}
      </div>
      {/* <iframe name="print_frame" title="Export" id="print_frame" width="0" height="0" frameBorder="0" src="about:blank" /> */}
    </>
  );
};

PrintAnswerReport.propTypes = {
  surveyDetails: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
  ]).isRequired,
  surveyAnswerReport: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
  ]).isRequired,
};

export default PrintAnswerReport;
