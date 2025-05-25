/* eslint-disable import/no-unresolved */
import React from 'react';
import * as PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import PdfCompanyInfo from '@shared/pdfCompanyInfo';
import {
  getCompanyTimezoneDate,
  getColumnArrayValueByField,
} from '../../../util/appUtils';
import ChecklistExport from './checklistExportEmployee';
import { groupByMultiple } from '../../../util/staticFunctions';

const tabletd = {
  border: '1px solid #495057',
  borderCollapse: 'collapse',
  textAlign: 'center',
  textTransform: 'capitalize',
  padding: '2px',
};

const tabletdhead = {
  border: '1px solid #495057',
  borderBottom: '1px solid #495057',
  fontSize: '17px',
  backgroundColor: '#f3f9fc',
  borderCollapse: 'collapse',
  textAlign: 'center',
  textTransform: 'uppercase',
  padding: '2px',
};

const checklistPrintEmployee = (props) => {
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
      <div id="print-employee-report">
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
                          align="center"
                          width="100%"
                        >
                          <thead className="stickyemp-td">
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
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <iframe name="print_frame" title="Export" id="print_frame" width="0" height="0" frameBorder="0" src="about:blank" />
      <ChecklistExport typeId={typeId} employeePerformanceReport={employeePerformanceReport} />
    </>
  );
};

checklistPrintEmployee.propTypes = {
  employeePerformanceReport: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
  ]).isRequired,
  typeId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
  ]).isRequired,
};

export default checklistPrintEmployee;
