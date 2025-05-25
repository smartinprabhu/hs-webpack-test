/* eslint-disable import/no-unresolved */
/* eslint-disable react/no-array-index-key */
/* eslint-disable radix */
import React from 'react';
import * as PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import {
  getDefaultNoValue, getCompanyTimezoneDate,
  getColumnArrayById, checkIsDate,
} from '../../../util/appUtils';

const tabletd = {
  border: '1px solid #495057', borderCollapse: 'collapse', textAlign: 'center', textTransform: 'capitalize', padding: '2px',
};

const tabletdcenter = {
  textAlign: 'center', textTransform: 'capitalize', padding: '2px', border: '1px solid #495057', borderCollapse: 'collapse',
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

const checklistExport = (props) => {
  const {
    inspectionOrders, typeId, showObservations, tableHeaders, selectedReportDateForReports, isdownloadRequest,
  } = props;

  const { userInfo } = useSelector((state) => state.user);

  const loading = (userInfo && userInfo.loading) || (inspectionOrders && inspectionOrders.loading);

  const selectedReportDate = selectedReportDateForReports;

  let isData = inspectionOrders && inspectionOrders.data && inspectionOrders.data.data && inspectionOrders.data.data.length ? inspectionOrders.data.data : false;
  isData = isdownloadRequest ? inspectionOrders : isData;

  function getQuestionValues(id, data) {
    const res = [];
    if (id && data && data.length) {
      data.forEach((item) => {
        const ansData = item.answers.filter((s) => s.question_id.toString() === id.toString());
        if (ansData && ansData.length) {
          res.push(ansData[0]);
        }
      });
    }
    return res;
  }

  function getQuestionName(name) {
    let res = true;
    if (name === 'Status' || name === 'Done By' || name === 'Done At' || name === 'Reviewed By') {
      res = false;
    }
    return res;
  }

  function getTypeAns(val) {
    let res = val;
    if (typeof val !== 'number') {
      res = getDefaultNoValue(val);
      if (checkIsDate(val)) {
        res = getCompanyTimezoneDate(val, userInfo, 'datetime');
      }
    } else {
      res = val;
    }
    return res;
  }

  return (
    <>
      <div id="export-checklist-report">
        <table align="center">
          <tbody>
            <tr>
              <td colSpan={8} style={{ textAlign: 'center' }}><h4>Inspection Checklist Report</h4></td>
            </tr>
            <tr>
              <td colSpan={8} style={{ textAlign: 'center' }}>
                <p>{selectedReportDate}</p>
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
                    <th>Scheduled Period</th>
                    <th>Scheduler</th>
                    {pd[0].team_name && typeId && typeId?.selectedField === 'maintenance_team_id' && (
 <th>Maintenance Team</th>
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
                    <td style={tabletd}>

                      {pd[0].time_period}
                    </td>
                    <td style={tabletd}>

                      {pd[0].group_name ? pd[0].group_name : '-'}
                    </td>
                    {pd[0].team_name && typeId && typeId?.selectedField === 'maintenance_team_id' && (
                    <td style={tabletd}>
                      {pd[0].team_name ? pd[0].team_name : '-'}
                    </td>
                    )}
                  </tr>
                </tbody>
              </table>
              <br />

              <table
                style={{
                  border: '1px solid #495057',
                  borderCollapse: 'collapse',
                  marginBottom: '15px',
                }}
                className="export-table1"
                width="100%"
                align="left"
              >
                <thead>
                  <tr>
                    {/* {pd[0].headers && pd[0].headers.map((hd, index) => (
                      <>
                        {hd === 'Observations' && !showObservations ? '' : (
                          <th style={tabletdhead} key={Math.random()}>
                            {index <= 3 ? (
                              <span>{hd}</span>
                            )
                              : (
                                <span>{getCompanyTimezoneDate(hd, userInfo, 'datetime')}</span>
                              )}
                          </th>
                        )}
                      </>
                    ))} */}
                    <th style={tabletd}>
                      <span>#</span>
                    </th>
                    <th style={tabletd}>
                      <span>Checklist</span>
                    </th>
                    {tableHeaders.filter((x) => x.isChecked).map((hd, index) => (
                      <th key={hd.valueKey} style={tabletd}>
                        <span>{hd.headerName}</span>
                      </th>
                    ))}
                    {pd[0].checklist_daily && pd[0].checklist_daily.length > 0 && getColumnArrayById(pd[0].checklist_daily, 'date').map((hd, index) => (
                      <th key={index++} style={tabletd}>
                        <span>
                          {getCompanyTimezoneDate(hd, userInfo, 'datetime')}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pd[0].question && pd[0].question.map((ql, index) => (
                    <tr key={Math.random()}>
                      <td style={tabletdcenter}><span className="font-weight-400">{getQuestionName(ql.name) ? (index + 1) : ''}</span></td>
                      <td style={tabletdcenter}><span className="font-weight-400">{getDefaultNoValue(ql.name)}</span></td>
                      {tableHeaders.filter((x) => x.isChecked).map((hd, subindex) => {
                        if (hd.valueKey) {
                          return (
                            <td style={tabletdcenter}><span className="font-weight-400">{getDefaultNoValue(getQuestionName(ql.name) && pd[0][hd.valueKey] && pd[0][hd.valueKey][index] ? pd[0][hd.valueKey][index] : '')}</span></td>
                          );
                        }
                      })}
                      {getQuestionValues(ql.id, pd[0].checklist_daily).map((dl) => (
                        <td style={dl.hasOwnProperty('is_abnormal') && dl.is_abnormal && dl.is_abnormal === 'Yes' ? { ...tabletdcenter, ...{ backgroundColor: 'red', color: 'white' } } : tabletdcenter} key={Math.random()}><span className="font-weight-400">{getTypeAns(dl.value)}</span></td>
                      ))}
                    </tr>
                  ))}
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

checklistExport.defaultProps = {
  isdownloadRequest: false,
};

checklistExport.propTypes = {
  inspectionOrders: PropTypes.oneOfType([
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

export default checklistExport;
