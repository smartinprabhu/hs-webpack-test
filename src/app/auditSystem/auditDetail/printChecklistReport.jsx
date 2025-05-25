/* eslint-disable max-len */
/* eslint-disable no-return-assign */
/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-expressions */
/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Col,
  Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';

import PdfCompanyInfo from '@shared/pdfCompanyInfo';

import { Bar } from 'react-chartjs-2';
import { getStateLabel } from '../utils/utils';
import chartOptions from './barCharts.json';

import {
  numToFloat,
} from '../../util/appUtils';

const tabletd = {
  border: '1px solid #495057', borderCollapse: 'collapse', textAlign: 'left', textTransform: 'capitalize', padding: '2px',
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

const PrintChecklistReport = (props) => {
  const { auditDetails, answerData, answerChecklist } = props;

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
    if (answerData && answerData.quizz_score) {
      count = answerData.quizz_score;
    }
    return count; // return column data..
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

  const sections = auditDetails && auditDetails.audit_system_id && auditDetails.audit_system_id.page_ids && auditDetails.audit_system_id.page_ids.length > 0
    ? auditDetails.audit_system_id.page_ids : [];

  function getDatasets(values, labels) {
    let result = {};
    const dynamicColors = () => {
      const r = Math.floor(Math.random() * 255);
      const g = Math.floor(Math.random() * 255);
      const b = Math.floor(Math.random() * 255);
      return `rgb(${r},${g},${b})`;
    };
    if (values) {
      const datas = [];
      for (let i = 0; i < values.length; i += 1) {
        if (values[i].question_ids.length > 0) {
          datas.push({
            data: [
              getTotalMaxArray(values[i].question_ids),
              getTotalYesArray(values[i].id),
              parseFloat((getTotalYesArray(values[i].id) / getTotalMaxArray(values[i].question_ids)) * 100).toFixed(2)],
            label: values[i].title,
            backgroundColor: dynamicColors(),
          });
        }
      }
      result = {
        datasets: datas,
        labels,
      };
    }
    return result;
  }

  return (
    <>
      <div id="audit-checklist-report">
        <div
          className="page-header"
          style={{
            position: 'fixed',
            top: '0mm',
            width: '100%',
            height: '50px',
            textAlign: 'center',
          }}
        >
          <PdfCompanyInfo />
        </div>
        <div
          className="page-footer"
          style={{
            position: 'fixed',
            bottom: '0',
            width: '100%',
            height: '50px',
            textAlign: 'center',
          }}
        >
          -
        </div>

        <table width="100%" style={{ width: '100%' }}>

          <thead>
            <tr>
              <td>
                <div className="page-header-space" style={{ height: '50px' }} />
              </td>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>
                <h3 style={{ textAlign: 'center' }}>
                  {auditDetails && auditDetails.name ? auditDetails.name : ''}
                  {' '}
                  (
                  {auditDetails && auditDetails.reference ? auditDetails.reference : ''}
                  ) -
                  {' '}
                  {getStateLabel(auditDetails.state)}
                </h3>
                <p style={{ textAlign: 'center' }}>{auditDetails && auditDetails.company_id && auditDetails.company_id.name ? auditDetails.company_id.name : ''}</p>
                <p style={{ textAlign: 'center' }}>{auditDetails && auditDetails.audit_system_id && auditDetails.audit_system_id.display_name ? auditDetails.audit_system_id.display_name : ''}</p>
                {auditDetails && auditDetails.audit_system_id.page_ids && auditDetails.audit_system_id.page_ids.length > 0 && (
                <Row>
                  <Col sm="12" md="12" lg="12" xs="12">
                    <div>
                      <table style={{ border: '1px solid #495057', borderCollapse: 'collapse', marginBottom: '15px' }} className="export-table1" width="100%" align="left">
                        <thead>
                          <tr>
                            <th style={tabletdhead}>
                              Summary
                            </th>
                            <th style={tabletdhead}>
                              Max. Score
                            </th>
                            <th style={tabletdhead}>
                              Achieved Score
                            </th>
                            <th style={tabletdhead}>
                              % Compliance
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {auditDetails.audit_system_id.page_ids && sections.map((section) => (
                            <tr>
                              <td style={tabletd}>{section && section.title ? section.title : 'General'}</td>
                              <td style={tabletd}>
                                {getTotalMaxArray(section.question_ids)}
                              </td>
                              <td style={tabletd}>
                                {getTotalYesArray(section.id)}
                              </td>
                              <td style={tabletd}>
                                {numToFloat((getTotalYesArray(section.id) / getTotalMaxArray(section.question_ids)) * 100)}
                              </td>
                            </tr>
                          ))}
                          <tr>
                            <td style={tabletdhead}>Total</td>
                            <td style={tabletdhead}>{getTotaMaxAllArray(auditDetails.audit_system_id.page_ids)}</td>
                            <td style={tabletdhead}>{getTotalYesAllArray(auditDetails.audit_system_id.page_ids)}</td>
                            <td style={tabletdhead}>
                              {numToFloat(
                                (getTotalYesAllArray(auditDetails.audit_system_id.page_ids) / getTotaMaxAllArray(auditDetails.audit_system_id.page_ids)) * 100,
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </Col>
                </Row>
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
        <Bar
          key="Audit Chart"
          options={chartOptions.options}
          data={getDatasets(auditDetails.audit_system_id && auditDetails.audit_system_id.page_ids ? auditDetails.audit_system_id.page_ids : [], getTitles(auditDetails.audit_system_id && auditDetails.audit_system_id.page_ids ? auditDetails.audit_system_id.page_ids : []))}
        />
      </div>
      <iframe name="print_frame" title="Export" id="print_frame" width="0" height="0" frameBorder="0" src="about:blank" />
    </>
  );
};

PrintChecklistReport.propTypes = {
  auditDetails: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
  ]).isRequired,
  answerData: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
  ]).isRequired,
  answerChecklist: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.array,
    PropTypes.object,
  ]).isRequired,
};

export default PrintChecklistReport;
