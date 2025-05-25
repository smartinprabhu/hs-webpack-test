/* eslint-disable import/no-unresolved */
/* eslint-disable react/no-array-index-key */
/* eslint-disable radix */
import React from 'react';
import * as PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import {
  getCompanyTimezoneDate, getCompanyTimezoneDateExportTime,
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
    assetAvailabilityInfo,
  } = props;

  const { userInfo } = useSelector((state) => state.user);

  const loading = (userInfo && userInfo.loading) || (assetAvailabilityInfo && assetAvailabilityInfo.loading);

  const isData = assetAvailabilityInfo && assetAvailabilityInfo.data && assetAvailabilityInfo.data.length ? assetAvailabilityInfo.data : false;

  return (
    <>
      <div id="export-employee-report">
        <h4 style={{ textAlign: 'center' }}>Asset Audit - Availability Report</h4>
        {(!loading && isData && isData.length > 0) && (
          <div className="p-3 mt-2">
            <div className="row">
              <div className="col-lg-1" />
              <div className="col-lg-5" />
              <span className="font-weight-800 mr-1">Report Date :</span>
              <span className="font-weight-500">{getCompanyTimezoneDate(isData[0].report_date, userInfo, 'date')}</span>
              <div className="col-lg-5" />
              <span className="font-weight-800 mr-1">Location :</span>
              <span className="font-weight-500">
                {isData[0].location.space_name}
                {`( ${isData[0].location.path_name} )`}
                {' '}
              </span>
            </div>
            <div className="col-lg-1" />
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
                    <span>TOTAL ASSETS</span>
                  </th>
                  <th style={tabletdhead}>
                    <span>AVAILABLE</span>
                  </th>
                  <th style={tabletdhead}>
                    <span>MISSED</span>
                  </th>
                  <th style={tabletdhead}>
                    <span>MISPLACED</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={tabletd}><span className="font-weight-400">{isData[0].total_assets}</span></td>
                  <td style={tabletd}><span className="font-weight-400">{isData[0].available_count}</span></td>
                  <td style={tabletd}><span className="font-weight-400">{isData[0].missed_count}</span></td>
                  <td style={tabletd}><span className="font-weight-400">{isData[0].misplaced_count}</span></td>
                </tr>
              </tbody>
            </table>
            <br />
            {isData[0] && isData[0].available_assets && isData[0].available_assets.length > 0 && (
            <>
              <div className="row" style={{ marginBottom: '10px', fontWeight: 'bold' }}>
                <div className="col-lg-12">
                  <span className="font-weight-800 mr-1">AVAILABLE ASSETS</span>
                </div>
              </div>
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
                      <span>Asset Name</span>
                    </th>
                    <th style={tabletdhead}>
                      <span>Location Name</span>
                    </th>
                    <th style={tabletdhead}>
                      <span>Audited By</span>
                    </th>
                    <th data-type="datetime" style={tabletdhead}>
                      <span>Audited On</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isData[0] && isData[0].available_assets && isData[0].available_assets.length > 0 && isData[0].available_assets.map((as) => (
                    <tr key={as}>
                      <td style={tabletd}>
                        <span className="font-weight-400">
                          {as.equipment}
                          <br />
                          {as.equipment_seq}
                        </span>

                      </td>
                      <td style={tabletd}>
                        <span className="font-weight-400">
                          {as.location_id.space_name}
                          <br />
                          {as.location_id.path_name}
                        </span>

                      </td>
                      <td style={tabletd}><span className="font-weight-400">{as.audited_by}</span></td>
                      <td data-type="datetime" style={tabletd}><span className="font-weight-400">{getCompanyTimezoneDateExportTime(as.audited_on, userInfo, 'datetime')}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
            )}
            <br />
            {isData[0] && isData[0].missed_assets && isData[0].missed_assets.length > 0 && (
              <>
                <div className="row" style={{ marginBottom: '10px', fontWeight: 'bold' }}>
                  <div className="col-lg-12">
                    <span className="font-weight-800 mr-1">MISSED ASSETS</span>
                  </div>
                </div>
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
                        <span>Asset Name</span>
                      </th>
                      <th style={tabletdhead}>
                        <span>Location Name</span>
                      </th>
                      <th style={tabletdhead}>
                        <span>Audited By</span>
                      </th>
                      <th style={tabletdhead}>
                        <span>Audited On</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {isData[0] && isData[0].missed_assets && isData[0].missed_assets.length > 0 && isData[0].missed_assets.map((mp) => (
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
                            {mp.location_id.space_name}
                            <br />
                            {mp.location_id.path_name}
                          </span>

                        </td>
                        <td style={tabletd}><span className="font-weight-400">{mp.audited_by}</span></td>
                        <td style={tabletd}><span className="font-weight-400">{getCompanyTimezoneDate(mp.audited_on, userInfo, 'datetime')}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
            <br />
            {isData[0] && isData[0].misplaced_assets && isData[0].misplaced_assets.length > 0 && (
              <>
                <div className="row" style={{ marginBottom: '10px', fontWeight: 'bold' }}>
                  <div className="col-lg-12">
                    <span className="font-weight-800 mr-1">MISPLACED ASSETS</span>
                  </div>
                </div>
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
                        <span>Asset Name</span>
                      </th>
                      <th style={tabletdhead}>
                        <span>Actual Location</span>
                      </th>
                      <th style={tabletdhead}>
                        <span>Scanned Location</span>
                      </th>
                      <th style={tabletdhead}>
                        <span>Audited By</span>
                      </th>
                      <th style={tabletdhead}>
                        <span>Audited On</span>
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
                        <td style={tabletd}><span className="font-weight-400">{mp.audited_by}</span></td>
                        <td style={tabletd}><span className="font-weight-400">{getCompanyTimezoneDate(mp.audited_on, userInfo, 'datetime')}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>

        )}
      </div>
      <iframe name="print_frame" title="Export" id="print_frame" width="0" height="0" frameBorder="0" src="about:blank" />
    </>
  );
};

checklistExportEmployee.propTypes = {
  assetAvailabilityInfo: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
  ]).isRequired,
};

export default checklistExportEmployee;
