/* eslint-disable no-plusplus */
/* eslint-disable import/no-unresolved */
/* eslint-disable radix */
import React from 'react';
import * as PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import PdfCompanyInfo from '@shared/pdfCompanyInfo';
import {
  getDefaultNoValue, getCompanyTimezoneDate,
} from '../../../util/appUtils';
import ChecklistExport from './checklistExportSmartLogger';

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
    ppmReports, typeId,
  } = props;
  const {
    selectedReportDate,
  } = useSelector((state) => state.ppm);

  const { userInfo } = useSelector((state) => state.user);

  const loading = (userInfo && userInfo.loading) || (ppmReports && ppmReports.loading);

  const selectedReportDate1 = selectedReportDate && selectedReportDate !== '' ? selectedReportDate : '';

  const isData = ppmReports && ppmReports.data && ppmReports.data.length && ppmReports.data.length > 0 ? ppmReports.data[0] : false;

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
      const dL = splitData(d[i].slice(1));
      d[i].emp_list_new = dL;
      splittedDayList.push(d[i]);
    }
    return splittedDayList;
  };

  const commonHeadings = (md) => {
    let result = false;
    if (md && md.heading) {
      result = md.heading.slice(0, 1);
    }
    return result;
  };

  const headerDate = (md) => {
    let result = false;
    if (md && md.heading) {
      result = splitData(md.heading.slice(1));
    }
    return result;
  };

  const getIsProcessedData = () => {
    if (isData) {
      const isProcessedData = [];
      for (let i = 0; i < isData.datas.length; i++) {
        const temp = [];
        for (let j = 0; j < isData.datas[i].length; j++) {
          temp.push(isData.datas[i][j]);
        }
        for (let k = temp.length; k < isData.heading.length; k++) {
          temp.push('-');
        }
        isProcessedData.push(temp);
      }
      return isProcessedData;
    }
    return [];
  };

  const teamCountList = (md) => {
    let result = false;
    if (md && md.datas) {
      result = modifyQuestionData(getIsProcessedData(md.datas));
    }
    return result;
  };

  return (
    <>
      <div id="print-smart-report">
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
                <h4 style={{ textAlign: 'center' }}>Smart Logger Report</h4>
                <p style={{ textAlign: 'center' }}>{selectedReportDate1}</p>
                {(!loading && isData && isData && Object.keys(isData).length > 0) && (
                <div className="p-3 mt-2">
                  {headerDate(isData) && headerDate(isData).map((qh, indexheaderDate) => (
                    <table
                      style={{
                        border: '1px solid #495057', borderCollapse: 'collapse', marginBottom: '15px',
                      }}
                      className="export-table1"
                      width="100%"
                      align="center"
                      key={qh}
                    >
                      <thead>
                        <tr>
                          {commonHeadings(isData) && commonHeadings(isData).map((hd) => (
                            <th style={tabletdhead} key={hd}>
                              <span>{hd}</span>
                            </th>
                          ))}
                          {qh.map((hd) => (
                            <th style={tabletdhead} key={hd}>
                              <span>{hd}</span>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {teamCountList(isData) && teamCountList(isData).map((ql) => (
                          <tr key={ql}>
                            <td style={tabletd}><span className="font-weight-400">{getDefaultNoValue(ql[0])}</span></td>
                            {ql.emp_list_new && ql.emp_list_new[indexheaderDate] && ql.emp_list_new[indexheaderDate].map((dl) => (
                              <td key={Math.random()} style={tabletd}><span className="font-weight-400">{getDefaultNoValue(dl)}</span></td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ))}
                </div>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <iframe name="print_frame" title="Export" id="print_frame" width="0" height="0" frameBorder="0" src="about:blank" />
      <ChecklistExport typeId={typeId} ppmReports={ppmReports} />
    </>
  );
};

checklistPrint.propTypes = {
  ppmReports: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
  ]).isRequired,
  typeId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
  ]).isRequired,
};

export default checklistPrint;
