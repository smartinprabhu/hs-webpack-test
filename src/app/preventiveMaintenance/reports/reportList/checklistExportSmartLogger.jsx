/* eslint-disable no-plusplus */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/no-array-index-key */
/* eslint-disable radix */
import React from 'react';
import * as PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import {
  getDefaultNoValue,
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

const checklistExport = (props) => {
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

  return (
    <>
      <div id="export-smart-report">
        <h4 style={{ textAlign: 'center' }}>Smart Logger Report</h4>
        <p style={{ textAlign: 'center' }}>{selectedReportDate1}</p>
        {(!loading && isData && isData && Object.keys(isData).length > 0) && (
        <>
          <div className="p-3 mt-2">
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
                  {isData && isData.heading && isData.heading.map((hd, index) => (
                    <th className={tabletdhead} key={index}>
                      <span>{hd}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isData && isData.datas && isData.datas.length && getIsProcessedData().map((ql) => (
                  <tr key={ql}>
                    {ql && ql.map((dl) => (
                      <td style={tabletd} key={Math.random()}><span className="font-weight-400">{getDefaultNoValue(dl)}</span></td>
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
        )}
      </div>
      <iframe name="print_frame" title="Export" id="print_frame" width="0" height="0" frameBorder="0" src="about:blank" />
    </>
  );
};

checklistExport.propTypes = {
  ppmReports: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
  ]).isRequired,
  typeId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
  ]).isRequired,
};

export default checklistExport;
