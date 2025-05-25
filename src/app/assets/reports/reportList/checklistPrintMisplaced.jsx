/* eslint-disable import/no-unresolved */
/* eslint-disable radix */
import React from 'react';
import * as PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import PdfCompanyInfo from '@shared/pdfCompanyInfo';
import {
  getCompanyTimezoneDate,
} from '../../../util/appUtils';
import ChecklistExport from './checklistExportMisplaced';

const tabletd = {
  border: '1px solid #495057',
  borderCollapse: 'collapse',
  textAlign: 'left',
  //textTransform: 'capitalize',
  padding: '2px',
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

const checklistPrintEmployee = (props) => {
  const {
    assetMisplacedInfo, selectedReportDate
  } = props;

  const { userInfo } = useSelector((state) => state.user);

  const loading = (userInfo && userInfo.loading) || (assetMisplacedInfo && assetMisplacedInfo.loading);

  const isData = assetMisplacedInfo && assetMisplacedInfo.data && assetMisplacedInfo.data.length ? assetMisplacedInfo.data : false;

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
                <h4 style={{ textAlign: 'center' }}>Asset Audit - Misplaced Assets</h4>
                <p style={{ textAlign: 'center' }}>{selectedReportDate}</p>
                {(!loading && isData && isData.length > 0) && (
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
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <iframe name="print_frame" title="Export" id="print_frame" width="0" height="0" frameBorder="0" src="about:blank" />
      <ChecklistExport selectedReportDate={selectedReportDate} assetMisplacedInfo={assetMisplacedInfo} />
    </>
  );
};

checklistPrintEmployee.propTypes = {
  assetMisplacedInfo: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
  ]).isRequired,
};

export default checklistPrintEmployee;
