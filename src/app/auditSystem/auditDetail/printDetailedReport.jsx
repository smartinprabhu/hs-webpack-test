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
import { useSelector } from 'react-redux';

import PdfCompanyInfo from '@shared/pdfCompanyInfo';

import {
  getCompanyTimezoneDate,
  extractNameObject,
} from '../../util/appUtils';
import { getStateLabel } from '../utils/utils';

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

const PrintDetailedReport = (props) => {
  const { actionsData, auditDetails, answerChecklist } = props;

  const { userInfo } = useSelector((state) => state.user);

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

  const remarksList = answerChecklist && answerChecklist.length ? answerChecklist.filter((item) => item.remarks) : false;
  const remarksData = remarksList && remarksList.length ? remarksList : false;

  return (
    <>
      <div id="audit-detailed-report">
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
                {remarksData && (
                <Row>
                  <Col sm="12" md="12" lg="12" xs="12">
                    <div>
                      <h4 style={{ textAlign: 'center' }}>
                        Auditor's Remarks
                      </h4>
                      <table style={{ border: '1px solid #495057', borderCollapse: 'collapse', marginBottom: '15px' }} className="export-table1" width="100%" align="left">
                        <thead>
                          <tr>
                            <th style={tabletdhead}>
                              #
                            </th>
                            <th style={tabletdhead}>
                              {auditDetails.audit_system_id && auditDetails.audit_system_id.question_name ? auditDetails.audit_system_id.question_name : 'Question Name'}
                            </th>
                            <th style={tabletdhead}>
                              {auditDetails.audit_system_id && auditDetails.audit_system_id.question_description ? auditDetails.audit_system_id.question_description : 'Question Group'}
                            </th>
                            <th style={tabletdhead}>
                              Remarks
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {remarksData.map((nc, index) => (
                            <tr key={nc.id}>
                              <td style={tabletd}>{index + 1}</td>
                              <td style={tabletd}>{extractNameObject(nc.question_id, 'question')}</td>
                              <td style={tabletd}>
                                {extractNameObject(nc.question_id, 'question_description')}
                              </td>
                              <td style={tabletd}>
                                {nc.remarks}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Col>
                </Row>
                )}
                {actionsData && getNCData().length > 0 && (
                <Row>
                  <Col sm="12" md="12" lg="12" xs="12">
                    <div>
                      <h4 style={{ textAlign: 'center' }}>
                        Non-Compliances
                      </h4>
                      <table style={{ border: '1px solid #495057', borderCollapse: 'collapse', marginBottom: '15px' }} className="export-table1" width="100%" align="left">
                        <thead>
                          <tr>
                            <th style={tabletdhead}>
                              #
                            </th>
                            <th style={tabletdhead}>
                              Title
                            </th>
                            <th style={tabletdhead}>
                              Responsible
                            </th>
                            <th style={tabletdhead}>
                              Status
                            </th>
                            <th style={tabletdhead}>
                              Deadline
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {getNCData().map((nc, index) => (
                            <tr key={nc.id}>
                              <td style={tabletd}>{index + 1}</td>
                              <td style={tabletd}>{nc.name}</td>
                              <td style={tabletd}>
                                {extractNameObject(nc.user_id, 'name')}
                              </td>
                              <td style={tabletd}>
                                {getStateLabel(nc.state)}
                              </td>
                              <td style={tabletd}>
                                {getCompanyTimezoneDate(nc.date_deadline, userInfo, 'date')}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Col>
                </Row>
                )}
                {actionsData && getIOData().length > 0 && (
                <Row>
                  <Col sm="12" md="12" lg="12" xs="12">
                    <div>
                      <h4 style={{ textAlign: 'center' }}>
                      Improvements
                      </h4>
                      <table style={{ border: '1px solid #495057', borderCollapse: 'collapse', marginBottom: '15px' }} className="export-table1" width="100%" align="left">
                        <thead>
                          <tr>
                            <th style={tabletdhead}>
                              #
                            </th>
                            <th style={tabletdhead}>
                              Title
                            </th>
                            <th style={tabletdhead}>
                              Responsible
                            </th>
                            <th style={tabletdhead}>
                              Status
                            </th>
                            <th style={tabletdhead}>
                              Deadline
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {getIOData().map((nc, index) => (
                            <tr key={nc.id}>
                              <td style={tabletd}>{index + 1}</td>
                              <td style={tabletd}>{nc.name}</td>
                              <td style={tabletd}>
                                {extractNameObject(nc.user_id, 'name')}
                              </td>
                              <td style={tabletd}>
                                {getStateLabel(nc.state)}
                              </td>
                              <td style={tabletd}>
                                {getCompanyTimezoneDate(nc.date_deadline, userInfo, 'date')}
                              </td>
                            </tr>
                          ))}
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
      </div>
      <iframe name="print_frame" title="Export" id="print_frame" width="0" height="0" frameBorder="0" src="about:blank" />
    </>
  );
};

PrintDetailedReport.propTypes = {
  actionsData: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
  ]).isRequired,
  auditDetails: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
  ]).isRequired,
  answerChecklist: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
  ]).isRequired,
};

export default PrintDetailedReport;
