/* eslint-disable import/no-unresolved */
/* eslint-disable radix */
import React, { useState, useEffect } from 'react';
import * as PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import PdfCompanyInfo from '@shared/pdfCompanyInfo';
import {
  getDefaultNoValue, getCompanyTimezoneDate,
  getColumnArrayById,
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
    downloadType, inspectionOrders, typeId, showObservations, tableHeaders, selectedReportDateForReports, isdownloadRequest,
  } = props;

  const { userInfo } = useSelector((state) => state.user);

  const [dataType, setType] = useState('');

  useEffect(() => {
    setType(downloadType);
  }, [downloadType]);

  const loading = (userInfo && userInfo.loading) || (inspectionOrders && inspectionOrders.loading);

  const selectedReportDate = selectedReportDateForReports;

  let isData = inspectionOrders && inspectionOrders.data && inspectionOrders.data.data && inspectionOrders.data.data.length ? inspectionOrders.data.data : false;
  isData = isdownloadRequest && inspectionOrders;

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

  const checkExistence = (hd) => {
    let present = false;
    const headers = [];
    if (tableHeaders && tableHeaders.length) {
      tableHeaders.map((header) => {
        if (header.isChecked) {
          headers.push(header.headerName);
        }
      });
    }
    present = headers && headers.length && headers.includes(hd);
    return present;
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
    if (md && md.checklist_daily && getColumnArrayById(md.checklist_daily, 'date')) {
      result = splitData(getColumnArrayById(md.checklist_daily, 'date').slice(4));
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

  function getQuestionValues(id, data) {
    const res = [];
    console.log(data);
    if (id && data && data.length) {
      data.forEach((item) => {
        console.log(item);
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

  return (
    <>
      {dataType === 'pdf' && (
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
                  <div className="page-header-space" style={{ height: '90px' }} />
                </td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <h4 style={{ textAlign: 'center' }}>Checklist Report</h4>
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
                            <td style={tabletd}>
                              <span style={{ fontWeight: '800', marginRight: '0.25rem' }}> Scheduled Period : </span>
                              {pd[0].time_period}
                            </td>
                            <td style={tabletd}>
                              <span style={{ fontWeight: '800', marginRight: '0.25rem' }}> Scheduler : </span>
                              {pd[0].group_name ? pd[0].group_name : '-'}
                            </td>
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

                                <th style={tabletdhead}>
                                  <span>#</span>
                                </th>
                                <th style={tabletdhead}>
                                  <span>Checklist</span>
                                </th>
                                {tableHeaders.filter((x) => x.isChecked).map((hd, index) => (
                                  <th key={hd.valueKey} style={tabletdhead}>
                                    <span>{hd.headerName}</span>
                                  </th>
                                ))}

                                {qh.map((hd) => (
                                  <th style={tabletdhead} key={hd}>
                                    <span>{getCompanyTimezoneDate(hd, userInfo, 'datetime')}</span>
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {pd[0].question && pd[0].question.map((ql, index) => (
                                <tr key={Math.random()}>
                                  <td style={tabletd}><span className="font-weight-400">{getQuestionName(ql.name) ? (index + 1) : ''}</span></td>
                                  <td style={tabletd}><span className="font-weight-400">{getDefaultNoValue(ql.name)}</span></td>
                                  {tableHeaders.filter((x) => x.isChecked).map((hd, subindex) => {
                                    if (hd.valueKey) {
                                      return (
                                        <td style={tabletd}><span className="font-weight-400">{getDefaultNoValue(getQuestionName(ql.name) && pd[0][hd.valueKey] && pd[0][hd.valueKey][index] ? pd[0][hd.valueKey][index] : '')}</span></td>
                                      );
                                    }
                                  })}

                                </tr>
                              ))}
                            </tbody>
                          </table>
                          {/* <div style={{ pageBreakAfter: (parseInt(headerDate.length) - parseInt(1)) === indexheaderDate ? 'auto' : 'always' }} />
                          <div>&nbsp;</div> */}
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
      </>
      )}
      {dataType === 'excel' && (
      <ChecklistExport isdownloadRequest={isdownloadRequest} selectedReportDateForReports={selectedReportDate} typeId={typeId} inspectionOrders={inspectionOrders} showObservations={showObservations} tableHeaders={tableHeaders} />
      )}
    </>
  );
};

checklistPrint.propTypes = {
  inspectionOrders: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
  ]).isRequired,
  typeId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
  ]).isRequired,
};
export default checklistPrint;
