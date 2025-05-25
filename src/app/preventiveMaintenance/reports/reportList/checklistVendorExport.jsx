/* eslint-disable import/no-unresolved */
/* eslint-disable react/no-array-index-key */
/* eslint-disable radix */
import React from 'react';
import * as PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import ExcelCompanyLogo from '@shared/excelCompanyLogo';

import {
  getDefaultNoValue, getCompanyTimezoneDate, getColumnArrayById, getCompanyTimezoneDateExportTime,
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

const ChecklistVendorExport = (props) => {
  const {
    ppmVendorInfo, typeId,
  } = props;

  const { userInfo } = useSelector((state) => state.user);

  const loading = (userInfo && userInfo.loading) || (ppmVendorInfo && ppmVendorInfo.loading);

  const selectedReportDate = typeId && typeId !== null && typeId.date && typeId.date.length
    ? `${getCompanyTimezoneDate(typeId.date[0], userInfo, 'date')} - ${getCompanyTimezoneDate(typeId.date[1], userInfo, 'date')}` : '';

  const isData = ppmVendorInfo && ppmVendorInfo.data && ppmVendorInfo.data.length ? ppmVendorInfo.data : false;

  return (
    <>
      <div id="export-vendor-report">
        <ExcelCompanyLogo />
        <h4 style={{ textAlign: 'center' }}>PPM Scheduler Report</h4>
        <p style={{ textAlign: 'center' }}>{selectedReportDate}</p>
        {(typeId && typeId.vendorValue && typeId.vendorValue.length > 0) && (
        <p style={{ textAlign: 'center' }}>
          Vendors:
          {' '}
          {getColumnArrayById(typeId.vendorValue, 'name').toString()}
        </p>
        )}
        {!loading && (isData) && (
          <>
            <div className="p-3 mt-2">
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
                    <th data-type="string" style={tabletdhead}>Asset</th>
                    <th data-type="string" style={tabletdhead}>Asset ID</th>
                    <th data-type="string" style={tabletdhead}>Schedule</th>
                    <th data-type="string" style={tabletdhead}>Week No</th>
                    <th data-type="string" style={tabletdhead}>Status</th>
                    <th data-type="string" style={tabletdhead}>Checklist Name</th>
                    <th data-type="string" style={tabletdhead}>Maintenance Team</th>
                    <th data-type="string" style={tabletdhead}>Site Name</th>
                    <th data-type="string" style={tabletdhead}>Vendor Name</th>
                    <th data-type="date" style={tabletdhead}>Starts On</th>
                    <th data-type="date" style={tabletdhead}>Ends On</th>
                    <th data-type="date" style={tabletdhead}>Actual Completion On</th>
                  </tr>
                </thead>
                <tbody>
                  {isData.map((ql, index) => (
                    <tr key={ql}>
                      <td style={tabletd}><span className="font-weight-400">{getDefaultNoValue(ql.asset_name)}</span></td>
                      <td style={tabletd}><span className="font-weight-400">{getDefaultNoValue(ql.asset_code)}</span></td>
                      <td style={tabletd}><span className="font-weight-400">{getDefaultNoValue(ql.schedule)}</span></td>
                      <td style={tabletd}><span className="font-weight-400">{getDefaultNoValue(ql.week)}</span></td>
                      <td style={tabletd}><span className="font-weight-400">{getDefaultNoValue(ql.state)}</span></td>
                      <td style={tabletd}><span className="font-weight-400">{getDefaultNoValue(ql.checklist)}</span></td>
                      <td style={tabletd}><span className="font-weight-400">{getDefaultNoValue(ql.maintenance_team_id)}</span></td>
                      <td style={tabletd}><span className="font-weight-400">{getDefaultNoValue(ql.site)}</span></td>
                      <td style={tabletd}><span className="font-weight-400">{getDefaultNoValue(ql.vendor)}</span></td>
                      <td style={tabletd}><span className="font-weight-400">{getDefaultNoValue(getCompanyTimezoneDate(ql.starts_on, userInfo, 'date'))}</span></td>
                      <td style={tabletd}><span className="font-weight-400">{getDefaultNoValue(getCompanyTimezoneDate(ql.ends_on, userInfo, 'date'))}</span></td>
                      <td style={tabletd}><span className="font-weight-400">{getDefaultNoValue(getCompanyTimezoneDate(ql.actual_completion_on, userInfo, 'date'))}</span></td>
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

ChecklistVendorExport.propTypes = {
  ppmVendorInfo: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
  ]).isRequired,
  typeId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
  ]).isRequired,
};

export default ChecklistVendorExport;