/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/no-array-index-key */
/* eslint-disable radix */
import React from 'react';
import * as PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import moment from 'moment-timezone';

import {
  getDefaultNoValue, getCompanyTimezoneDate,
  getColumnArrayById,
} from '../../../util/appUtils';

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

const checklistPPMStatusExport = (props) => {
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

  let isData = ppmStatusInfo && ppmStatusInfo.data && ppmStatusInfo.data.length && !ppmStatusInfo.data[0].hashlib ? ppmStatusInfo.data : false;
  isData = isdownloadRequest ? ppmStatusInfo : isData;

  const keyExistsInArray = (key, jsonArray) => jsonArray.some((obj) => key in obj);

  return (
    <>
      <div id="export-checklist-report">
        <table align="center">
          <tbody>
            <tr>
              <td colSpan={15}><b> PPM Checklist Report</b></td>
            </tr>
            <tr>
              <td>Date</td>
              <td colSpan={15}>
                <b>
                  {selectedReportDate}
                </b>

              </td>
            </tr>
          </tbody>
        </table>
        {!loading && (isData) && isData.map((pd) => (
          <>
            <div className="p-3 mt-2">
              <br />
              <table style={{ border: '1px solid #495057', borderCollapse: 'collapse', marginBottom: '15px' }} className="export-table1" width="100%" align="left">
                <thead>
                  <tr>
                    <th>Asset Name</th>
                    <th>Asset ID</th>
                    <th>Location</th>
                    <th>Scheduler</th>
                    {pd[0].team_name && typeId && typeId?.selectedField === 'maintenance_team_id' && (
                    <th>Maintenance Team</th>
                    )}
                    {pd[0].sub_assets && pd[0].sub_assets.length > 0 && (
                    <th>Sub Assets</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={tabletd}>
                      {pd[0].asset_name}
                    </td>
                    <td style={tabletd}>

                      {pd[0].asset_id}
                    </td>
                    <td style={tabletd}>

                      {pd[0].asset_category}
                    </td>
                    {/* <td style={tabletd}>
                      <span style={{ fontWeight: '800', marginRight: '0.25rem' }}> Scheduled Period : </span>
                      {pd[0].time_period}
        </td> */}
                    <td style={tabletd}>

                      {pd[0].group_name ? pd[0].group_name : '-'}
                    </td>
                    {pd[0].team_name && typeId && typeId?.selectedField === 'maintenance_team_id' && (
                    <td style={tabletd}>
                      {pd[0].team_name ? pd[0].team_name : '-'}
                    </td>
                    )}
                    {pd[0].sub_assets && pd[0].sub_assets.length > 0 && (
                    <td style={tabletd}>
                      {getColumnArrayById(pd[0].sub_assets, 'sub_asset_name').toString()}
                    </td>
                    )}
                  </tr>
                </tbody>
              </table>
              <br />
              <table
                style={{
                  border: '1px solid #495057', borderCollapse: 'collapse', marginBottom: '15px',
                }}
                className="export-table1"
                width="100%"
                align="left"
              >
                <thead>
                  <tr>
                    {pd[0].headers && pd[0].headers.map((hd, index) => (
                      <th className={tabletdhead} key={index}>
                        {index <= 3 ? (
                          <span>{hd}</span>
                        )
                          : (
                            <span>{getCompanyTimezoneDate(hd, userInfo, 'date')}</span>
                          )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pd[0].question_lists && pd[0].question_lists.map((ql, index) => (
                    <tr key={ql}>
                      <td style={tabletd}><span className="font-weight-400">{index + 1}</span></td>
                      <td style={tabletd}><span className="font-weight-400">{getDefaultNoValue(ql.qestion_group)}</span></td>
                      <td style={tabletd}><span className="font-weight-400">{getDefaultNoValue(ql.qestion)}</span></td>
                      <td style={tabletd}><span className="font-weight-400">{getDefaultNoValue(ql.expected)}</span></td>
                      {ql.day_list && ql.day_list.map((dl) => (
                        <td style={tabletd} key={Math.random()}><span className="font-weight-400">{getDefaultNoValue(dl)}</span></td>
                      ))}
                    </tr>
                  ))}
                  {pd[0].status_by_dis && (
                    <tr>
                      <td />
                      <td />
                      <td />
                      <td style={tabletd}>Status</td>
                      {pd[0].status_by_dis && pd[0].status_by_dis.map((sta) => (
                        <td style={tabletd} key={Math.random()}><span className="font-weight-400">{getDefaultNoValue(sta.status)}</span></td>
                      ))}
                    </tr>
                  )}
                  {pd[0].done_by_list && keyExistsInArray('work_permit_reference', pd[0].done_by_list) && (
                    <tr>
                      <td />
                      <td />
                      <td />
                      <td style={tabletd}>Work Permit Reference</td>
                      {pd[0].done_by_list && pd[0].done_by_list.map((dby) => (
                        <td style={tabletd} key={Math.random()}><span className="font-weight-400">{getDefaultNoValue(dby.work_permit_reference)}</span></td>
                      ))}
                    </tr>
                  )}
                  {pd[0].done_by_list && keyExistsInArray('gate_pass_reference', pd[0].done_by_list) && (
                  <tr>
                    <td />
                    <td />
                    <td />
                    <td style={tabletd}>Gate Pass Reference</td>
                    {pd[0].done_by_list && pd[0].done_by_list.map((dby) => (
                      <td style={tabletd} key={Math.random()}><span className="font-weight-400">{getDefaultNoValue(dby.gate_pass_reference)}</span></td>
                    ))}
                  </tr>
                  )}
                  {pd[0].done_by_list && keyExistsInArray('compliance_type', pd[0].done_by_list) && (
                  <tr>
                    <td />
                    <td />
                    <td />
                    <td style={tabletd}>Compliance Type</td>
                    {pd[0].done_by_list && pd[0].done_by_list.map((dby) => (
                      <td style={tabletd} key={Math.random()}><span className="font-weight-400">{getDefaultNoValue(dby.compliance_type)}</span></td>
                    ))}
                  </tr>
                  )}
                  <tr>
                    <td />
                    <td />
                    <td />
                    <td style={tabletd}>Done By</td>
                    {pd[0].done_by_list && pd[0].done_by_list.map((dby) => (
                      <td style={tabletd} key={Math.random()}><span className="font-weight-400">{getDefaultNoValue(dby.done_by)}</span></td>
                    ))}
                  </tr>
                  <tr>
                    <td />
                    <td />
                    <td />
                    <td style={tabletd}>Done At</td>
                    {pd[0].done_by_list && pd[0].done_by_list.map((dby) => (
                      <td style={tabletd} key={Math.random()}><span className="font-weight-400">{getCompanyTimezoneDate(dby.done_at, userInfo, 'datetime')}</span></td>
                    ))}
                  </tr>
                  {isReViewRequired && (
                    <>
                      <tr>
                        <td />
                        <td />
                        <td />
                        <td style={tabletd}>Reviewed By</td>
                        {pd[0].done_by_list && pd[0].done_by_list.map((dby) => (
                          <td style={tabletd} key={Math.random()}><span className="font-weight-400">{getDefaultNoValue(dby.reviewed_by)}</span></td>
                        ))}
                      </tr>
                      <tr>
                        <td />
                        <td />
                        <td />
                        <td style={tabletd}>Reviewed on</td>
                        {pd[0].done_by_list && pd[0].done_by_list.map((dby) => (
                          <td style={tabletd} key={Math.random()}><span className="font-weight-400">{getCompanyTimezoneDate(dby.reviewed_on, userInfo, 'datetime')}</span></td>
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
                        {pd[0].done_by_list && pd[0].done_by_list.map((dby) => (
                          <td style={tabletd} key={Math.random()}><span className="font-weight-400">{getDefaultNoValue(dby.signed_off_by)}</span></td>
                        ))}
                      </tr>
                      <tr>
                        <td />
                        <td />
                        <td />
                        <td style={tabletd}>Signed off on</td>
                        {pd[0].done_by_list && pd[0].done_by_list.map((dby) => (
                          <td style={tabletd} key={Math.random()}><span className="font-weight-400">{getCompanyTimezoneDate(dby.signed_off_on, userInfo, 'datetime')}</span></td>
                        ))}
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
            <br />
            {' '}
            <br />
          </>
        ))}
      </div>
      <iframe name="print_frame" title="Export" id="print_frame" width="0" height="0" frameBorder="0" src="about:blank" />
    </>
  );
};

checklistPPMStatusExport.defaultProps = {
  isdownloadRequest: false,
};

checklistPPMStatusExport.propTypes = {
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

export default checklistPPMStatusExport;
