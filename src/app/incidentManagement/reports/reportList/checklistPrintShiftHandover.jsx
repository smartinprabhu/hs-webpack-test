/* eslint-disable import/no-unresolved */
/* eslint-disable radix */
import React from 'react';
import * as PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import PdfCompanyInfo from '@shared/pdfCompanyInfo';
import {
  getCompanyTimezoneDate, extractTextObject,
} from '../../../util/appUtils';
import ChecklistExport from './checklistExportShift';
import { filterStringGenerator } from '../../../helpdesk/utils/utils';

const tabletd = {
  border: '1px solid #495057',
  borderCollapse: 'collapse',
  textAlign: 'center',
  // textTransform: 'capitalize',
  padding: '2px',
};

const tabletdwidth = {
  border: '1px solid #495057',
  borderCollapse: 'collapse',
  textAlign: 'center',
  // textTransform: 'capitalize',
  padding: '2px',
  maxWidth: '300px',
  minWidth: '250px',
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
    incidentReportInfo,
  } = props;

  const { userInfo } = useSelector((state) => state.user);
  const {
    shiftHandoverFilters
  } = useSelector((state) => state.equipment);

  const appliedFilters = filterStringGenerator(shiftHandoverFilters)
  const loading = (userInfo && userInfo.loading) || (incidentReportInfo && incidentReportInfo.loading);

  const isData = incidentReportInfo && incidentReportInfo.data && incidentReportInfo.data.length ? incidentReportInfo.data : false;

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
        <table style={{ width: '100%', marginTop: "30px" }}>
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
                <h4 style={{ textAlign: 'center' }}>Shift Handover Report</h4>
                <table align="center">
                  <tbody>
                    <tr>
                      <td>Company</td>
                      <td colSpan={15}><b>{userInfo && userInfo.data ? userInfo.data.company.name : 'Company'}</b></td>
                    </tr>
                    <tr>
                      <td>{appliedFilters && (<span>Filters</span>)}</td>
                      <td colSpan={15}><b>{appliedFilters}</b></td>
                    </tr>
                  </tbody>
                </table>
                {(!loading && isData && isData.length > 0) && (
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
                      <thead className="bg-gray-light">
                        <tr>
                          <th style={tabletdhead}>
                            <span>Description</span>
                          </th>
                          <th style={tabletdhead}>
                            <span>Maintanence Team</span>
                          </th>
                          <th style={tabletdhead}>
                            <span>Reported By</span>
                          </th>
                          <th style={tabletdhead}>
                            <span>Reported On</span>
                          </th>
                          <th style={tabletdhead}>
                            <span>Accepted By</span>
                          </th>
                          <th style={tabletdhead}>
                            <span>Accepted On</span>
                          </th>
                          <th style={tabletdhead}>
                            <span>Status</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {(!loading) && (isData) && isData.length && isData.map((data) => (
                          <tr>
                            <td style={tabletdwidth}><span className="font-weight-400 foldText">{data.name}</span></td>
                            <td style={tabletd}><span className="font-weight-400">{extractTextObject(data.maintenance_team_id)}</span></td>
                            <td style={tabletd}><span className="font-weight-400">{extractTextObject(data.reported_by)}</span></td>
                            <td style={tabletd}><span className="font-weight-400">{getCompanyTimezoneDate(data.reported_on, userInfo, 'datetime')}</span></td>
                            <td style={tabletd}><span className="font-weight-400">{extractTextObject(data.accepted_by)}</span></td>
                            <td style={tabletd}><span className="font-weight-400">{getCompanyTimezoneDate(data.accepted_on, userInfo, 'datetime')}</span></td>
                            <td style={tabletd}><span className="font-weight-400">{data.state}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <iframe name="print_frame" title="Export" id="print_frame" width="0" height="0" frameBorder="0" src="about:blank" />
      <ChecklistExport incidentReportInfo={incidentReportInfo} />
    </>
  );
};

checklistPrintEmployee.propTypes = {
  incidentReportInfo: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
  ]).isRequired,
};

export default checklistPrintEmployee;
