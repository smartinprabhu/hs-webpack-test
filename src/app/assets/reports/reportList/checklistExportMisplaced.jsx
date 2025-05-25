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
    assetMisplacedInfo, selectedReportDate
  } = props;

  const { userInfo } = useSelector((state) => state.user);

  const loading = (userInfo && userInfo.loading) || (assetMisplacedInfo && assetMisplacedInfo.loading);

  const isData = assetMisplacedInfo && assetMisplacedInfo.data && assetMisplacedInfo.data.length ? assetMisplacedInfo.data : false;

  return (
    <>
      <div id="export-employee-report">
        <h4 style={{ textAlign: 'center' }}>Asset Audit - Misplaced Assets</h4>
        <p style={{ textAlign: 'center' }}>{selectedReportDate}</p>
        {(!loading && isData && isData.length > 0) && (
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
                    <th style={tabletdhead}>
                      <span>Asset Name</span>
                    </th>
                    <th style={tabletdhead}>
                      <span>Actual Location</span>
                    </th>
                    <th style={tabletdhead}>
                      <span>Scanned Location</span>
                    </th>
                    <th style={tabletdhead}>
                      <span>Audited On</span>
                    </th>
                    <th style={tabletdhead}>
                      <span>Audited By</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isData[0] && isData[0].misplaced_assets && isData[0].misplaced_assets.length > 0 && isData[0].misplaced_assets.map((mp) => (
                    <tr key={mp}>
                      <td style={tabletd}>
                        <span className="font-weight-400">
                          {mp.equipment}
                          <br />
                          {mp.equipment_seq}
                        </span>

                      </td>
                      <td style={tabletd}>
                        <span className="font-weight-400">
                          {mp.actual_location.space_name}
                          <br />
                          {mp.actual_location.path_name}
                        </span>

                      </td>
                      <td style={tabletd}>
                        <span className="font-weight-400">
                          {mp.scanned_location_id.space_name}
                          <br />
                          {mp.scanned_location_id.path_name}
                        </span>

                      </td>
                      <td style={tabletd}><span className="font-weight-400">{getCompanyTimezoneDate(mp.audited_on, userInfo, 'datetime')}</span></td>
                      <td style={tabletd}><span className="font-weight-400">{mp.audited_by}</span></td>
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
  assetMisplacedInfo: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
  ]).isRequired,
  typeId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
  ]).isRequired,
};

export default checklistExportEmployee;
