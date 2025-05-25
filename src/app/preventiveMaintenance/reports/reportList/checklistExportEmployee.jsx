/* eslint-disable import/no-unresolved */
/* eslint-disable react/no-array-index-key */
/* eslint-disable radix */
import React from 'react';
import * as PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import {
  getCompanyTimezoneDate,
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

const checklistExportEmployee = (props) => {
  const {
    inspectionEmployees, typeId,
  } = props;

  const { userInfo } = useSelector((state) => state.user);

  const loading = (userInfo && userInfo.loading) || (inspectionEmployees && inspectionEmployees.loading);

  const selectedReportDate = typeId && typeId.date && typeId.date.length
    ? `${getCompanyTimezoneDate(typeId.date[0], userInfo, 'date')} - ${getCompanyTimezoneDate(typeId.date[1], userInfo, 'date')}` : '';

  const isData = inspectionEmployees && inspectionEmployees.data && inspectionEmployees.data.length ? inspectionEmployees.data : false;

  return (
    <>
      <div id="export-employee-report">
        <h4 style={{ textAlign: 'center' }}>Inspection Employee Report</h4>
        <p style={{ textAlign: 'center' }}>{selectedReportDate}</p>
        {(!loading && isData && isData && Object.keys(isData).length > 0) && (
          <>
            <div className="p-3 mt-2">
              <br />
              <table
                style={{
                  border: '1px solid #495057', borderCollapse: 'collapse', marginBottom: '15px', textAlign: 'left'
                }}
                className="export-table1"
                width="100%"
                align="left"
              >
                <thead>
                  <tr>
                    {isData.heading && isData.heading.map((hd, index) => (
                      <th className={tabletdhead} key={index}>
                        <span>{hd}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {isData.data && isData.data.map((ql) => (
                    <tr key={ql}>
                      {ql && ql.map((dl) => (
                        <td style={tabletd} key={Math.random()}><span className="font-weight-400">{dl}</span></td>
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

checklistExportEmployee.propTypes = {
  inspectionEmployees: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
  ]).isRequired,
  typeId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
  ]).isRequired,
};

export default checklistExportEmployee;
