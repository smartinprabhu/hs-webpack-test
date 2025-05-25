/* eslint-disable import/no-unresolved */
/* eslint-disable radix */
import React from 'react';
import * as PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import PdfCompanyInfo from '@shared/pdfCompanyInfo';
import {
  getDefaultNoValue, getCompanyTimezoneDate,
} from '../../util/appUtils';
// import ChecklistExport from './checklistExport';

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
    inspectionOrders, typeId, showObservations,tableHeaders
  } = props;

  const { userInfo } = useSelector((state) => state.user);

  const loading = (userInfo && userInfo.loading) || (inspectionOrders && inspectionOrders.loading);

  const selectedReportDate = typeId && typeId.date && typeId.date.length
    ? `${getCompanyTimezoneDate(typeId.date[0], userInfo, 'date')} - ${getCompanyTimezoneDate(typeId.date[1], userInfo, 'date')}` : '';

  const isData = inspectionOrders && inspectionOrders.data && inspectionOrders.data.data && inspectionOrders.data.data.length ? inspectionOrders.data.data : false;

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
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <h4 style={{ textAlign: 'center' }}>Checklist Report</h4>
                <p style={{ textAlign: 'center' }}>{selectedReportDate}</p>
                {!loading && (isData) && isData.map((pd) => (
                  <>
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
                          {tableHeaders.filter(x=>x.isChecked).map((hd,index)=><th key={hd.valueKey} className={ 'sticky-th sticky-head'}>
                                    <span>{hd.headerName}</span>
                                  </th>)}
                                  {pd[0].headers && pd[0].headers.filter(x=>!tableHeaders.find(thd=>x === thd.headerName)).map((hd, index) => (
                                       <th style={tabletdhead} key={index++}>
                                       <span>
                                       {getCompanyTimezoneDate(hd, userInfo, 'datetime')}
                                       </span>
     
                                     </th>
                            
                               ))}
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
                          </tr>
                        </thead>
                        <tbody>
                          {pd[0].question_lists && pd[0].question_lists.map((ql, index) => (
                            <tr key={Math.random()}>
                              {
                                tableHeaders.filter(x=>x.isChecked).map((hd,subindex)=>{
                                  if(hd.valueKey){
                                    return <td style={tabletd}><span className="font-weight-400">{getDefaultNoValue(ql[hd.valueKey])}</span></td>
                                  }
                                  else{
                                    return <td style={tabletd}><span className="font-weight-400">{index + 1}</span></td>
                                  }
                                })
                              }
                              {/* <td style={tabletd}><span className="font-weight-400">{index + 1}</span></td>
                              <td style={tabletd}><span className="font-weight-400">{getDefaultNoValue(ql.qestion_group)}</span></td>
                              <td style={tabletd}><span className="font-weight-400">{getDefaultNoValue(ql.qestion)}</span></td>
                              {showObservations && (<td style={tabletd}><span className="font-weight-400">{getDefaultNoValue(ql.expected)}</span></td>
                              )}                       */}
                              {ql.day_list && ql.day_list.map((dl) => (
                                <td style={tabletd} key={Math.random()}><span className="font-weight-400">{getDefaultNoValue(dl)}</span></td>
                              ))}
                            </tr>
                          ))}
                          {pd[0].status_by_dis && (
                            <tr>
                               {tableHeaders.filter(x=>x.isChecked).map((hd,index)=>{
                                 if(hd.valueKey){
                                  return <td />

                                } else {
                                  return <></>
                                }
                               })}
                              {/* <td />
                              <td />
                              {showObservations && (<td />)} */}
                              <td style={tabletd}>Status</td>
                              {pd[0].status_by_dis && pd[0].status_by_dis.map((sta) => (
                                <>
                                  <td style={tabletd} key={Math.random()}><span className="font-weight-400">{getDefaultNoValue(sta.status)}</span></td>
                                </>
                              ))}
                            </tr>
                          )}
                          <tr>
                            {/* <td />
                            <td />
                            {showObservations && (<td />)} */}
                             {tableHeaders.filter(x=>x.isChecked).map((hd,index)=>{
                                 if(hd.valueKey){
                                  return <td />

                                } else {
                                  return <></>
                                }
                               })}
                            <td style={tabletd}>Done By</td>
                            {pd[0].done_by_list && pd[0].done_by_list.map((dby) => (
                              <>
                                <td style={tabletd} key={Math.random()}><span className="font-weight-400">{getDefaultNoValue(dby.done_by)}</span></td>
                              </>
                            ))}
                          </tr>
                          <tr>
                            {/* <td />
                            <td />
                            {showObservations && (<td />)} */}
                             {tableHeaders.filter(x=>x.isChecked).map((hd,index)=>{
                                 if(hd.valueKey){
                                  return <td />

                                } else {
                                  return <></>
                                }
                               })}
                            <td style={tabletd}>Done At</td>
                            {pd[0].done_by_list && pd[0].done_by_list.map((dby) => (
                              <>
                                <td style={tabletd} key={Math.random()}><span className="font-weight-400">{getCompanyTimezoneDate(dby.done_at, userInfo, 'datetime')}</span></td>
                              </>
                            ))}
                          </tr>
                          <tr>
                            {/* <td />
                            <td />
                            {showObservations && (<td />)} */}
                             {tableHeaders.filter(x=>x.isChecked).map((hd,index)=>{
                                 if(hd.valueKey){
                                  return <td />

                                } else {
                                  return <></>
                                }
                               })}
                            <td style={tabletd}>Reviewed By</td>
                            {pd[0].done_by_list && pd[0].done_by_list.map((dby) => (
                              <>
                                <td style={tabletd} key={Math.random()}><span className="font-weight-400">{getDefaultNoValue(dby.reviewed_by)}</span></td>
                              </>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </>
                ))}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <iframe name="print_frame" title="Export" id="print_frame" width="0" height="0" frameBorder="0" src="about:blank" />
      {/* <ChecklistExport typeId={typeId} inspectionOrders={inspectionOrders} showObservations={showObservations} tableHeaders={tableHeaders}/> */}
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
