/* eslint-disable import/no-unresolved */
/* eslint-disable react/no-array-index-key */
import React from 'react';
import * as PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import {
  getCompanyTimezoneDate,
  getColumnArrayValueByField,
} from '../../../util/appUtils';
import { groupByMultiple } from '../../../util/staticFunctions';

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
    employeePerformanceReport, typeId,
  } = props;

  const { userInfo } = useSelector((state) => state.user);

  const loading = (userInfo && userInfo.loading) || (employeePerformanceReport && employeePerformanceReport.loading);

  const selectedReportDate = typeId && typeId.date && typeId.date.length
    ? `${getCompanyTimezoneDate(typeId.date[0], userInfo, 'date')} - ${getCompanyTimezoneDate(typeId.date[1], userInfo, 'date')}` : '';

  const isData = employeePerformanceReport && employeePerformanceReport.data && employeePerformanceReport.data.length ? employeePerformanceReport.data : false;

  const getMaintenanceCount = (employeeId, type) => {
    let count = 0;
    if (isData && isData.length > 0) {
      const empData = isData.filter((emp) => emp.employee_id.id === employeeId && emp.maintenance_type === type);
      count = empData.length;
    }
    return count;
  };

  const employeeGroup = isData ? groupByMultiple(isData, (obj) => obj.employee_id.id) : false;
  const headings = ['Employee', 'Corrective', 'Preventive', 'On Condition', 'Periodic', 'Predictive'];
  return (
    <>
      <div id="export-employee-report">
        <h4 style={{ textAlign: 'center' }}>Employee Performance Report</h4>
        <p style={{ textAlign: 'center' }}>{selectedReportDate}</p>
        {(!loading && isData && isData.length && isData.length > 0) && (
        <>
          <div className="p-3 mt-2">
            <>
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
                    {headings && headings.length && headings.length > 0 && headings.map((hd) => (
                      <th style={tabletdhead} key={hd}>
                        <span>{hd}</span>
                      </th>
                    ))}

                  </tr>
                </thead>
                <tbody>
                  {employeeGroup && employeeGroup.length && employeeGroup.length > 0 && employeeGroup.map((emp) => (
                    <tr key={emp}>
                      <td style={tabletd}><span className="font-weight-400">{getColumnArrayValueByField(emp, 0, 'employee_id', 'name')}</span></td>
                      <td style={tabletd}><span className="font-weight-400">{getMaintenanceCount(getColumnArrayValueByField(emp, 0, 'employee_id', 'id'), 'bm')}</span></td>
                      <td style={tabletd}><span className="font-weight-400">{getMaintenanceCount(getColumnArrayValueByField(emp, 0, 'employee_id', 'id'), 'pm')}</span></td>
                      <td style={tabletd}><span className="font-weight-400">{getMaintenanceCount(getColumnArrayValueByField(emp, 0, 'employee_id', 'id'), 'oc')}</span></td>
                      <td style={tabletd}><span className="font-weight-400">{getMaintenanceCount(getColumnArrayValueByField(emp, 0, 'employee_id', 'id'), 'pr')}</span></td>
                      <td style={tabletd}><span className="font-weight-400">{getMaintenanceCount(getColumnArrayValueByField(emp, 0, 'employee_id', 'id'), 'pd')}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          </div>
        </>
        )}
      </div>
      <iframe name="print_frame" title="Export" id="print_frame" width="0" height="0" frameBorder="0" src="about:blank" />
    </>
  );
};

checklistExportEmployee.propTypes = {
  employeePerformanceReport: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
  ]).isRequired,
  typeId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
  ]).isRequired,
};

export default checklistExportEmployee;
