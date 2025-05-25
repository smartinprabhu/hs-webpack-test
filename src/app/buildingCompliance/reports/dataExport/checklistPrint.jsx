/* eslint-disable import/no-unresolved */
/* eslint-disable radix */
import React from 'react';
import * as PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import PdfCompanyInfo from '@shared/pdfCompanyInfo';
import {
  getDefaultNoValue, getCompanyTimezoneDate, extractNameObject,
} from '../../../util/appUtils';
import ChecklistExport from './checklistExport';

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

const checklistPrint = (props) => {
  const {
    complianceList, fields, logFields,
  } = props;
  const { userInfo } = useSelector((state) => state.user);
  const isData = complianceList && complianceList.length ? complianceList : false;

  return (
    <>
      <div id="print-compliance-report">
        <div
          className="page-header"
          style={{
            position: 'fixed',
            top: '0mm',
            width: '100%',
            textAlign: 'center',
          }}
        >
          <PdfCompanyInfo />
        </div>
        <table style={{ width: '100%' }}>
          <thead>
            <tr>
              <td>
                <div className="page-header-space" style={{ height: '40px' }} />
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <h4 style={{ textAlign: 'center' }}>Compliance Report</h4>
                <>
                  <div className="p-3 mt-1">
                    <>
                      <table
                        style={{
                          border: '1px solid #495057', borderCollapse: 'collapse',
                        }}
                        className="export-table1"
                        width="100%"
                        align="left"
                      >
                        <tbody>
                          {isData && isData.length && isData.map((q1, i) => (
                            <>
                              {i !== 0
                                ? (
                                  <tr data-id={i}>
                                    <td colSpan="5">
                                      <div className="page-header-space" style={{ height: '10px' }} />
                                    </td>
                                  </tr>
                                )
                                : ''}
                              <tr style={{ pageBreakInside: 'avoid' }}>
                                {fields && fields.length && fields.map((hd) => (
                                  <th style={tabletdhead} key={hd.heading}>
                                    <span>{hd.heading}</span>
                                  </th>
                                ))}
                              </tr>
                              <tr style={{ pageBreakInside: 'avoid' }}>
                                <td key={q1} style={tabletd}><span className="font-weight-400">{q1.complianceAct}</span></td>
                                <td key={q1} style={tabletd}><span className="font-weight-400">{q1.stateNew}</span></td>
                                <td key={q1} style={tabletd}><span className="font-weight-400">{q1.nextExpiryDate}</span></td>
                                <td key={q1} style={tabletd}><span className="font-weight-400">{q1.applies_to}</span></td>
                                <td key={q1} style={tabletd}><span className="font-weight-400">{q1.locate}</span></td>
                              </tr>
                              {q1.compliance_log_ids && q1.compliance_log_ids.length && q1.compliance_log_ids.length > 0
                                ? (
                                  <>
                                    <tr>
                                      <td colSpan="5">
                                        <table
                                          style={{
                                            border: '1px solid #495057', borderCollapse: 'collapse',
                                          }}
                                          width="100%"
                                          align="left"
                                        >
                                          <thead>
                                            <tr>
                                              {logFields && logFields.length && logFields.map((hds) => (
                                                <th style={tabletdhead} key={hds.heading}>
                                                  <span>{hds.heading}</span>
                                                </th>
                                              ))}
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {q1.compliance_log_ids && q1.compliance_log_ids.length && q1.compliance_log_ids.map((h1) => (
                                              <tr>
                                                <td key={h1} style={tabletd}><span className="font-weight-400">{getCompanyTimezoneDate(h1.log_date, userInfo, 'datetime')}</span></td>
                                                <td key={h1} style={tabletd}><span className="font-weight-400">{h1.description}</span></td>
                                                <td key={h1} style={tabletd}><span className="font-weight-400">{h1.stage}</span></td>
                                                <td key={h1} style={tabletd}><span className="font-weight-400">{getDefaultNoValue(extractNameObject(h1.user_id, 'name'))}</span></td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                  </>
                                )
                                : ''}
                            </>
                          ))}
                        </tbody>
                      </table>
                    </>
                  </div>
                </>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <ChecklistExport fields={fields} logFields={logFields} complianceList={complianceList} />
    </>
  );
};

checklistPrint.propTypes = {
  complianceList: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  fields: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
};

export default checklistPrint;
