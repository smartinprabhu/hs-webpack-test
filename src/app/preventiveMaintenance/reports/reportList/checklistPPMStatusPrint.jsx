/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable import/no-unresolved */
/* eslint-disable radix */
import React from 'react';
import * as PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import moment from 'moment-timezone';

import PdfCompanyInfo from '@shared/pdfCompanyInfo';
import {
  getDefaultNoValue, getCompanyTimezoneDate,
  getColumnArrayById,
} from '../../../util/appUtils';
import ChecklistExport from './checklistPPMStatusExport';

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

const checklistPPMStatusPrint = (props) => {
  const {
    ppmStatusInfo, typeId, isReViewRequired, isSignOffRequired, isdownloadRequest,
  } = props;

  const { userInfo } = useSelector((state) => state.user);

  const loading = (userInfo && userInfo.loading) || (ppmStatusInfo && ppmStatusInfo.loading);

  let start = '';
  let end = '';

  if (typeId && typeId !== null && typeId.date && typeId.date.length) {
    start = moment(typeId.date[0]).startOf('isoWeek').format('YYYY-MM-DD');
    end = moment(typeId.date[1]).endOf('isoWeek').format('YYYY-MM-DD');
  }
  const selectedReportDate = start && end && `${getCompanyTimezoneDate(start, userInfo, 'date')} - ${getCompanyTimezoneDate(end, userInfo, 'date')}`;

  let isData = ppmStatusInfo && ppmStatusInfo.data && ppmStatusInfo.data.length && ppmStatusInfo.data.length > 0 && !ppmStatusInfo.data[0].hashlib ? ppmStatusInfo.data : false;
  isData = isdownloadRequest ? ppmStatusInfo : isData;

  const columnSize = 5;
  const splitData = (d) => {
    const splittedArrays = [];
    for (let i = 0; i < d.length;) {
      splittedArrays.push(d.slice(i, i += columnSize));
    }
    return splittedArrays;
  };

  const modifyQuestionData = (array) => {
    const d = array;
    const splittedDayList = [];
    for (let i = 0; i < d.length; i += 1) {
      const dL = splitData(d[i].day_list);
      d[i].day_list_new = dL;
      splittedDayList.push(d[i]);
    }
    return splittedDayList;
  };

  const commonHeadings = (md) => {
    let result = false;
    if (md && md.headers) {
      result = md.headers.slice(0, 4);
    }
    return result;
  };

  const headerDate = (md) => {
    let result = false;
    if (md && md.headers) {
      result = splitData(md.headers.slice(4));
    }
    return result;
  };

  const doneReview = (md) => {
    let result = false;
    if (md && md.done_by_list) {
      result = splitData(md.done_by_list);
    }
    return result;
  };

  const statusList = (md) => {
    let result = false;
    if (md && md.status_by_dis) {
      result = splitData(md.status_by_dis);
    }
    return result;
  };

  const questionList = (md) => {
    let result = false;
    if (md && md.question_lists) {
      result = modifyQuestionData(md.question_lists);
    }
    return result;
  };

  const keyExistsInArray = (key, jsonArray) => jsonArray.some((obj) => key in obj);

  return (
    <>
      <div id="print-checklist-report">
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
        <table>
          <thead>
            <tr>
              <td>
                <div className="page-header-space" style={{ height: '40px' }} />
                <br />
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <h4 style={{ textAlign: 'center' }}>PPM Checklist Report</h4>
                <p style={{ textAlign: 'center' }}>{selectedReportDate}</p>
                {!loading && (isData) && isData.map((pd) => (
                  <div className="p-3 mt-2">
                    <table style={{ border: '1px solid #495057', borderCollapse: 'collapse', marginBottom: '15px' }} className="export-table1" width="100%" align="left">
                      <tbody>
                        <tr>
                          <td style={tabletd}>
                            <span style={{ fontWeight: '800', marginRight: '0.25rem' }}>Asset Name : </span>
                            {pd[0].asset_name}
                          </td>
                          <td style={tabletd}>
                            <span style={{ fontWeight: '800', marginRight: '0.25rem' }}>Asset ID : </span>
                            {pd[0].asset_id}
                          </td>
                          <td style={tabletd}>
                            <span style={{ fontWeight: '800', marginRight: '0.25rem' }}>Location : </span>
                            {pd[0].asset_category}
                          </td>
                          {/* <td style={tabletd}>
                              <span style={{ fontWeight: '800', marginRight: '0.25rem' }}> Scheduled Period : </span>
                              {pd[0].time_period}
                </td> */}
                          <td style={tabletd}>
                            <span style={{ fontWeight: '800', marginRight: '0.25rem' }}> Scheduler : </span>
                            {pd[0].group_name ? pd[0].group_name : '-'}
                          </td>
                          {pd[0].team_name && typeId && typeId?.selectedField === 'maintenance_team_id' && (
                          <td style={tabletd}>
                            <span style={{ fontWeight: '800', marginRight: '0.25rem' }}> Maintenance Team : </span>
                            {pd[0].team_name ? pd[0].team_name : '-'}
                          </td>
                          )}
                          {pd[0].sub_assets && pd[0].sub_assets.length > 0 && (
                            <td style={tabletd}>
                              <span style={{ fontWeight: '800', marginRight: '0.25rem' }}> Sub Assets : </span>
                              {getColumnArrayById(pd[0].sub_assets, 'sub_asset_name').toString()}
                            </td>
                          )}
                        </tr>
                      </tbody>
                    </table>
                    {headerDate(pd[0]) && headerDate(pd[0]).map((qh, indexheaderDate) => (
                      <>
                        <table
                          style={{
                            border: '1px solid #495057', borderCollapse: 'collapse', marginBottom: '15px',
                          }}
                          className="export-table1"
                          width="100%"
                          align="left"
                          key={qh}
                        >
                          <thead>
                            <tr>
                              {commonHeadings(pd[0]) && commonHeadings(pd[0]).map((hd) => (
                                <th style={tabletdhead} key={hd}>
                                  <span>{hd}</span>
                                </th>
                              ))}
                              {qh.map((hd) => (
                                <th style={tabletdhead} key={hd}>
                                  <span>{getCompanyTimezoneDate(hd, userInfo, 'date')}</span>
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {questionList(pd[0]) && questionList(pd[0]).map((ql, qindex) => (
                              <tr key={ql}>
                                <td style={tabletd}><span className="font-weight-400">{qindex + 1}</span></td>
                                <td style={tabletd}><span className="font-weight-400">{getDefaultNoValue(ql.qestion_group)}</span></td>
                                <td style={tabletd}><span className="font-weight-400">{getDefaultNoValue(ql.qestion)}</span></td>
                                <td style={tabletd}><span className="font-weight-400">{getDefaultNoValue(ql.expected)}</span></td>
                                {ql.day_list_new && ql.day_list_new[indexheaderDate] && ql.day_list_new[indexheaderDate].map((dl) => (
                                  <td key={Math.random()} style={tabletd}><span className="font-weight-400">{getDefaultNoValue(dl)}</span></td>
                                ))}
                              </tr>
                            ))}
                            {statusList(pd[0]) && (
                              <tr>
                                <td />
                                <td />
                                <td />
                                <td style={tabletd}>Status</td>
                                {statusList(pd[0]) && statusList(pd[0])[indexheaderDate] && statusList(pd[0])[indexheaderDate].map((sta) => (
                                  <td key={Math.random()} style={tabletd}><span className="font-weight-400">{getDefaultNoValue(sta.status)}</span></td>
                                ))}
                              </tr>
                            )}
                            {doneReview(pd[0]) && doneReview(pd[0])[indexheaderDate] && keyExistsInArray('work_permit_reference', doneReview(pd[0])[indexheaderDate]) && (
                              <tr>
                                <td />
                                <td />
                                <td />
                                <td style={tabletd}>Work Permit Reference</td>
                                {doneReview(pd[0]) && doneReview(pd[0])[indexheaderDate] && doneReview(pd[0])[indexheaderDate].map((dby) => (
                                  <td key={Math.random()} style={tabletd}><span className="font-weight-400">{getDefaultNoValue(dby.work_permit_reference)}</span></td>
                                ))}
                              </tr>
                            )}
                            {doneReview(pd[0]) && doneReview(pd[0])[indexheaderDate] && keyExistsInArray('gate_pass_reference', doneReview(pd[0])[indexheaderDate]) && (
                              <tr>
                                <td />
                                <td />
                                <td />
                                <td style={tabletd}>Gate Pass Reference</td>
                                {doneReview(pd[0]) && doneReview(pd[0])[indexheaderDate] && doneReview(pd[0])[indexheaderDate].map((dby) => (
                                  <td key={Math.random()} style={tabletd}><span className="font-weight-400">{getDefaultNoValue(dby.gate_pass_reference)}</span></td>
                                ))}
                              </tr>
                            )}
                            {doneReview(pd[0]) && doneReview(pd[0])[indexheaderDate] && keyExistsInArray('compliance_type', doneReview(pd[0])[indexheaderDate]) && (
                            <tr>
                              <td />
                              <td />
                              <td />
                              <td style={tabletd}>Compliance Type</td>
                              {doneReview(pd[0]) && doneReview(pd[0])[indexheaderDate] && doneReview(pd[0])[indexheaderDate].map((dby) => (
                                <td key={Math.random()} style={tabletd}><span className="font-weight-400">{getDefaultNoValue(dby.compliance_type)}</span></td>
                              ))}
                            </tr>
                            )}
                            <tr>
                              <td />
                              <td />
                              <td />
                              <td style={tabletd}>Done By</td>
                              {doneReview(pd[0]) && doneReview(pd[0])[indexheaderDate] && doneReview(pd[0])[indexheaderDate].map((dby) => (
                                <td key={Math.random()} style={tabletd}><span className="font-weight-400">{getDefaultNoValue(dby.done_by)}</span></td>
                              ))}
                            </tr>
                            <tr>
                              <td />
                              <td />
                              <td />
                              <td style={tabletd}>Done At</td>
                              {doneReview(pd[0]) && doneReview(pd[0])[indexheaderDate] && doneReview(pd[0])[indexheaderDate].map((dby) => (
                                <td key={Math.random()} style={tabletd}><span className="font-weight-400">{getCompanyTimezoneDate(dby.done_at, userInfo, 'datetime')}</span></td>
                              ))}
                            </tr>
                            {isReViewRequired && (
                              <>
                                <tr>
                                  <td />
                                  <td />
                                  <td />
                                  <td style={tabletd}>Reviewed By</td>
                                  {doneReview(pd[0]) && doneReview(pd[0])[indexheaderDate] && doneReview(pd[0])[indexheaderDate].map((dby) => (
                                    <td key={Math.random()} style={tabletd}><span className="font-weight-400">{getDefaultNoValue(dby.reviewed_by)}</span></td>
                                  ))}
                                </tr>
                                <tr>
                                  <td />
                                  <td />
                                  <td />
                                  <td style={tabletd}>Reviewed on</td>
                                  {doneReview(pd[0]) && doneReview(pd[0])[indexheaderDate] && doneReview(pd[0])[indexheaderDate].map((dby) => (
                                    <td key={Math.random()} style={tabletd}><span className="font-weight-400">{getCompanyTimezoneDate(dby.reviewed_on, userInfo, 'datetime')}</span></td>
                                  ))}
                                </tr>
                              </>
                            )}
                            {isSignOffRequired && (
                              <>
                                <tr>
                                  <td />
                                  <td />
                                  <td />
                                  <td style={tabletd}>Signed off by</td>
                                  {doneReview(pd[0]) && doneReview(pd[0])[indexheaderDate] && doneReview(pd[0])[indexheaderDate].map((dby) => (
                                    <td key={Math.random()} style={tabletd}><span className="font-weight-400">{getDefaultNoValue(dby.signed_off_by)}</span></td>
                                  ))}
                                </tr>
                                <tr>
                                  <td />
                                  <td />
                                  <td />
                                  <td style={tabletd}>Signed off on</td>
                                  {doneReview(pd[0]) && doneReview(pd[0])[indexheaderDate] && doneReview(pd[0])[indexheaderDate].map((dby) => (
                                    <td key={Math.random()} style={tabletd}><span className="font-weight-400">{getCompanyTimezoneDate(dby.signed_off_on, userInfo, 'datetime')}</span></td>
                                  ))}
                                </tr>
                              </>
                            )}
                          </tbody>
                        </table>
                        <div style={{ pageBreakAfter: (parseInt(headerDate.length) - parseInt(1)) === indexheaderDate ? 'auto' : 'always' }} />
                        <div>&nbsp;</div>
                      </>
                    ))}
                  </div>
                ))}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <iframe name="print_frame" title="Export" id="print_frame" width="0" height="0" frameBorder="0" src="about:blank" />
      <ChecklistExport isReViewRequired={isReViewRequired} isSignOffRequired={isSignOffRequired} typeId={typeId} ppmStatusInfo={ppmStatusInfo} isdownloadRequest={isdownloadRequest} />
    </>
  );
};

checklistPPMStatusPrint.defaultProps = {
  isdownloadRequest: false,
};

checklistPPMStatusPrint.propTypes = {
  ppmStatusInfo: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
  ]).isRequired,
  isdownloadRequest: PropTypes.oneOfType([
    PropTypes.bool,
  ]),
  typeId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
  ]).isRequired,
};

export default checklistPPMStatusPrint;
