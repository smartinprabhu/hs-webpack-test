/* eslint-disable import/no-unresolved */
/* eslint-disable radix */
import React, { useRef } from 'react';
import * as PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import QRCode from 'qrcode.react';

import {
  getCompanyTimezoneDate,
  getDefaultNoValue,
  extractNameObject,
  detectMimeType,
  numToFloat,
} from '../../util/appUtils';
import { getCustomGatePassStatusName } from '../utils/utils';
import { getEquipmentStateText } from '../../assets/utils/utils';

const tabletd = {
  border: '1px solid #495057',
  borderCollapse: 'collapse',
  textAlign: 'left',
  // textTransform: 'capitalize',
  padding: '2px',
  wordBreak: 'break-word',
};

const tabletdimage = {
  border: '1px solid #495057',
  borderCollapse: 'collapse',
  textAlign: 'center',
  // textTransform: 'capitalize',
  padding: '2px',
};

const tabletdbord = {
  border: '1px solid #495057',
  borderCollapse: 'collapse',
  textAlign: 'left',
  // textTransform: 'capitalize',
  padding: '15px',
};

const tabletdhead = {
  border: '1px solid #495057',
  borderBottom: '1px solid #495057',
  fontSize: '14px',
  fontWeight: 700,
  backgroundColor: '#f3f9fc',
  borderCollapse: 'collapse',
  textAlign: 'left',
  // textTransform: 'uppercase',
  padding: '2px',
};

const tabletdtitle = {
  border: '1px solid #495057',
  borderBottom: '1px solid #495057',
  fontWeight: 800,
  backgroundColor: '#f3f9fc',
  borderCollapse: 'collapse',
  textAlign: 'left',
  // textTransform: 'uppercase',
  padding: '2px',
};

const tabletdtitleimage = {
  border: '1px solid #495057',
  borderBottom: '1px solid #495057',
  fontWeight: 800,
  backgroundColor: '#f3f9fc',
  borderCollapse: 'collapse',
  textAlign: 'left',
  // textTransform: 'uppercase',
  padding: '2px',
  height: '30px',
};

const headText = {
  fontWeight: 800,
  marginRight: '2px',
};

const editorReadConfig = {
  toolbar: false,
  readonly: true,
  showCharsCounter: false,
  showWordsCounter: false,
  showXPathInStatusbar: false,
  height: 250,
  minHeight: 100,
};

const GatePassReport = (props) => {
  const {
    detailData,
    gpConfig,
  } = props;

  const { userInfo } = useSelector((state) => state.user);

  const logo = window.localStorage.getItem('vendor_logo') && window.localStorage.getItem('vendor_logo') !== 'false' && window.localStorage.getItem('vendor_logo') !== ''
    ? window.localStorage.getItem('vendor_logo') : false;

  return (
    <>
      <div id="print-gatepass-report">
        <table style={{ width: '100%' }}>
          <thead>
            <tr>
              <td style={{ textAlign: 'center' }}>
                <div className="page-header-space" style={{ height: '10px' }} />
                {logo && (
                <img
                  style={{
                    marginLeft: 'auto', width: '100%', height: 'auto', maxWidth: '100px',
                  }}
                  src={logo}
                  width="100"
                  height="80"
                  alt="Helixsense Portal"
                />
                )}
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <h3 style={{ display: 'flex', alignItems: 'center', marginBottom: detailData && detailData.company_id && detailData.company_id.logo ? '0px' : '0px' }}>
                  {detailData.type === 'Returnable' ? 'RETURNABLE' : 'NON-RETURNABLE '}
                  {' '}
                  GATEPASS REPORT
                  <p style={{
                    marginLeft: 'auto', width: '100%', height: 'auto', maxWidth: '100px',
                  }}
                  >
                    <QRCode
                      value={getDefaultNoValue(detailData && detailData.gatepass_number)}
                      renderAs="svg"
                      includeMargin
                      level="H"
                      size={100}
                      id="qrCode"
                    />
                  </p>
                </h3>
                {detailData && (
                  <div className="p-3 mt-0">
                    <table
                      style={{
                        border: '1px solid #495057', borderCollapse: 'collapse', marginBottom: '15px',
                      }}
                      className="export-table1"
                      width="100%"
                      align="left"
                    >
                      <tbody>
                        <tr>
                          <td style={tabletdhead}>
                            <span className="font-weight-800" style={headText}>Date of Request</span>
                          </td>
                          <td style={tabletd}>
                            <span className="font-weight-400">{getDefaultNoValue(getCompanyTimezoneDate(detailData.requested_on, userInfo, 'datetime'))}</span>
                          </td>
                          <td style={tabletdhead}>
                            <span className="font-weight-800" style={headText}>Gate Pass No</span>
                          </td>
                          <td style={tabletd}>
                            <span className="font-weight-400">{getDefaultNoValue(detailData.gatepass_number)}</span>
                          </td>
                        </tr>
                        <tr>
                          <td style={tabletdhead}>
                            <span className="font-weight-800" style={headText}>
                              Requested By
                            </span>
                          </td>
                          <td style={tabletd}>
                            <span className="font-weight-400">
                              {getDefaultNoValue(extractNameObject(detailData.requestor_id, 'name'))}
                            </span>
                          </td>
                          <td style={tabletdhead}>
                            <span className="font-weight-800" style={headText}>Status</span>
                          </td>
                          <td style={tabletd}>
                            <span className="font-weight-400">{getDefaultNoValue(getCustomGatePassStatusName(detailData.state, gpConfig))}</span>
                          </td>
                        </tr>
                        <tr>
                          <td style={tabletdhead}>
                            <span className="font-weight-800" style={headText}>
                              Purpose
                            </span>
                          </td>
                          <td style={tabletd} colSpan={3}>
                            <span className="font-weight-400">
                              {getDefaultNoValue(detailData.description)}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td style={tabletdhead}>
                            <span className="font-weight-800" style={headText}>Space</span>
                          </td>
                          <td style={tabletd}>
                            <span className="font-weight-400">{getDefaultNoValue(extractNameObject(detailData.space_id, 'path_name'))}</span>
                          </td>
                          <td style={tabletdhead}>
                            <span className="font-weight-800" style={headText}>Site</span>
                          </td>
                          <td style={tabletd}>
                            <span className="font-weight-400">{getDefaultNoValue(extractNameObject(detailData.company_id, 'name'))}</span>
                          </td>
                        </tr>
                        <tr>
                          <td style={tabletdhead}>
                            <span className="font-weight-800" style={headText}>
                              {gpConfig && gpConfig.reference_display ? gpConfig.reference_display : 'Reference'}
                            </span>
                          </td>
                          <td style={tabletd}>
                            <span className="font-weight-400">
                              {getDefaultNoValue(detailData.reference)}
                            </span>
                          </td>
                          <td style={tabletdhead}>
                            <span className="font-weight-800" style={headText}>Type</span>
                          </td>
                          <td style={tabletd}>
                            <span className="font-weight-400">{getDefaultNoValue(detailData.gatepass_type)}</span>
                          </td>
                        </tr>
                        <tr>
                          <td style={tabletdhead}>
                            <span className="font-weight-800" style={headText}>
                              Bearer’s Name
                            </span>
                          </td>
                          <td style={tabletd}>
                            <span className="font-weight-400">
                              {getDefaultNoValue(detailData.name)}
                            </span>
                          </td>
                          <td style={tabletdhead}>
                            <span className="font-weight-800" style={headText}>Bearer’s Mobile</span>
                          </td>
                          <td style={tabletd}>
                            <span className="font-weight-400">
                              {getDefaultNoValue(detailData.mobile)}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          {detailData.type === 'Returnable' && (
                            <>
                              <td style={tabletdhead}>
                                <span className="font-weight-800" style={headText}>
                                  To be Returned On
                                </span>
                              </td>
                              <td style={tabletd}>
                                <span className="font-weight-400">
                                  {getDefaultNoValue(getCompanyTimezoneDate(detailData.to_be_returned_on, userInfo, 'datetime'))}
                                </span>
                              </td>
                            </>
                          )}
                          <td style={tabletdhead}>
                            <span className="font-weight-800" style={headText}>Bearer’s Email</span>
                          </td>
                          <td style={tabletd}>
                            <span className="font-weight-400">
                              {getDefaultNoValue(detailData.email)}
                            </span>
                          </td>
                          {detailData.type !== 'Returnable' && (
                          <>
                            <td style={tabletdhead}>
                              <span className="font-weight-800" style={headText}>Vendor</span>
                            </td>
                            <td style={tabletd}>
                              <span className="font-weight-400">
                                {getDefaultNoValue(extractNameObject(detailData.vendor_id, 'name'))}
                              </span>
                            </td>
                          </>
                          )}
                        </tr>
                        <tr>
                          {detailData.type === 'Returnable' && (
                          <>
                            <td style={tabletdhead}>
                              <span className="font-weight-800" style={headText}>
                                SLA Status
                              </span>
                            </td>
                            <td style={tabletd}>
                              <span className="font-weight-400">
                                {getDefaultNoValue(detailData.sla_status)}
                              </span>
                            </td>
                          </>
                          )}
                          {detailData.type === 'Returnable' && (
                          <>
                            <td style={tabletdhead}>
                              <span className="font-weight-800" style={headText}>Vendor</span>
                            </td>
                            <td style={tabletd}>
                              <span className="font-weight-400">
                                {getDefaultNoValue(extractNameObject(detailData.vendor_id, 'name'))}
                              </span>
                            </td>
                          </>
                          )}
                        </tr>
                        {detailData.type === 'Returnable' && (
                        <>
                          <tr>
                            <td style={tabletdhead}>
                              <span className="font-weight-800" style={headText}>
                                Receiver’s Name
                              </span>
                            </td>
                            <td style={tabletd}>
                              <span className="font-weight-400">
                                {getDefaultNoValue(detailData.receiver_name)}
                              </span>
                            </td>
                            <td style={tabletdhead}>
                              <span className="font-weight-800" style={headText}>Receiver’s Mobile</span>
                            </td>
                            <td style={tabletd}>
                              <span className="font-weight-400">
                                {getDefaultNoValue(detailData.receiver_mobile)}
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td style={tabletdhead}>
                              <span className="font-weight-800" style={headText}>
                                Returned On
                              </span>
                            </td>
                            <td style={tabletd}>
                              <span className="font-weight-400">
                                {getDefaultNoValue(getCompanyTimezoneDate(detailData.bearer_return_on, userInfo, 'datetime'))}
                              </span>
                            </td>
                            <td style={tabletdhead}>
                              <span className="font-weight-800" style={headText}>Receiver’s Email</span>
                            </td>
                            <td style={tabletd}>
                              <span className="font-weight-400">
                                {getDefaultNoValue(detailData.receiver_email)}
                              </span>
                            </td>
                          </tr>
                        </>
                        )}
                      </tbody>
                    </table>

                    {detailData.gatepass_type && detailData.gatepass_type === 'Asset' && detailData.asset_lines && detailData.asset_lines.length > 0 && (
                    <>
                      <br />
                      <br />
                      <h4 style={{
                        textAlign: 'center',
                        marginBottom: '15px',
                      }}
                      >
                        ASSETS
                      </h4>
                      <table
                        style={{
                          border: '1px solid #495057',
                          borderCollapse: 'collapse',
                          marginBottom: '15px',
                        }}
                        className="export-table1"
                        width="100%"
                        align="left"
                      >
                        <thead className="bg-gray-light">
                          <tr>
                            <th style={tabletdhead}>
                              <span>#</span>
                            </th>
                            <th style={tabletdhead}>
                              <span>Name</span>
                            </th>
                            <th style={tabletdhead}>
                              <span>Quantity (kg)</span>
                            </th>
                            <th style={tabletdhead}>
                              <span>Description</span>
                            </th>
                            <th style={tabletdhead}>
                              <span>Asset Number</span>
                            </th>
                            <th style={tabletdhead}>
                              <span>Category</span>
                            </th>
                            <th style={tabletdhead}>
                              <span>Status</span>
                            </th>
                            <th style={tabletdhead}>
                              <span>Location</span>
                            </th>
                            <th style={tabletdhead}>
                              <span>Model</span>
                            </th>
                            <th style={tabletdhead}>
                              <span>Make</span>
                            </th>
                            <th style={tabletdhead}>
                              <span>Serial</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {detailData.asset_lines && detailData.asset_lines.length > 0 && detailData.asset_lines.map((ad, index) => (
                            <>
                              <tr>
                                <td style={tabletd}><span className="font-weight-400">{index + 1}</span></td>
                                <td style={tabletd}><span className="font-weight-400">{extractNameObject(ad.asset_id, 'name')}</span></td>
                                <td style={tabletd}><span className="font-weight-400">{ad.parts_qty ? parseFloat(ad.parts_qty).toFixed(2) : 0.00}</span></td>
                                <td style={tabletd}><span className="font-weight-400 word-break-content">{getDefaultNoValue(ad.description)}</span></td>
                                <td style={tabletd}><span className="font-weight-400">{extractNameObject(ad.asset_id, 'equipment_seq')}</span></td>
                                <td style={tabletd}><span className="font-weight-400">{extractNameObject(extractNameObject(ad.asset_id, 'category_id'), 'name')}</span></td>
                                <td style={tabletd}><span className="font-weight-400">{getEquipmentStateText(extractNameObject(ad.asset_id, 'state'))}</span></td>
                                <td style={tabletd}><span className="font-weight-400">{extractNameObject(extractNameObject(ad.asset_id, 'location_id'), 'path_name')}</span></td>
                                <td style={tabletd}><span className="font-weight-400">{extractNameObject(ad.asset_id, 'model')}</span></td>
                                <td style={tabletd}><span className="font-weight-400">{extractNameObject(ad.asset_id, 'make')}</span></td>
                                <td style={tabletd}><span className="font-weight-400">{extractNameObject(ad.asset_id, 'serial')}</span></td>
                              </tr>
                              {ad.asset_id.space_label_ids && ad.asset_id.space_label_ids.length > 0 && (
                              <tr>
                                <td colSpan="11" style={tabletd}>
                                  <div>
                                    <strong>Additional Details for Asset:</strong>
                                    <table
                                      style={{
                                        border: '1px solid #495057',
                                        borderCollapse: 'collapse',
                                        marginBottom: '15px',
                                      }}
                                      className="export-table1"
                                      width="100%"
                                      align="left"
                                    >
                                      <thead className="bg-gray-light">
                                        <tr>
                                          <th style={tabletdhead}>
                                            <span>Name</span>
                                          </th>
                                          <th style={tabletdhead}>
                                            <span>Value</span>
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {ad.asset_id.space_label_ids.map((sl) => (
                                          <tr>
                                            <td style={tabletd}>
                                              <span className="font-weight-400">
                                                {' '}
                                                {extractNameObject(sl.space_label_id, 'name')}
                                              </span>
                                            </td>
                                            <td style={tabletd}>
                                              <span className="font-weight-400">
                                                {' '}
                                                {getDefaultNoValue(sl.space_value)}
                                              </span>
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </td>
                              </tr>
                              )}
                            </>
                          ))}
                        </tbody>
                      </table>
                    </>
                    )}

                    {detailData.gatepass_type && detailData.gatepass_type === 'Item' && detailData.order_lines && detailData.order_lines.length > 0 && (
                    <>
                      <br />
                      <br />
                      <h4 style={{
                        textAlign: 'center',
                        marginBottom: '15px',
                      }}
                      >
                        ITEMS

                      </h4>
                      <table
                        style={{
                          border: '1px solid #495057',
                          borderCollapse: 'collapse',
                          marginBottom: '15px',
                        }}
                        className="export-table1"
                        width="100%"
                        align="left"
                      >
                        <thead className="bg-gray-light">
                          <tr>
                            <th style={tabletdhead}>
                              <span>#</span>
                            </th>
                            <th style={tabletdhead}>
                              <span>Name</span>
                            </th>
                            <th style={tabletdhead}>
                              <span>Quantity</span>
                            </th>
                            <th style={tabletdhead}>
                              <span>Description</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {detailData.order_lines && detailData.order_lines.length > 0 && detailData.order_lines.map((ol, index1) => (
                            <tr>
                              <td style={tabletd}><span className="font-weight-400">{index1 + 1}</span></td>
                              <td style={tabletd}><span className="font-weight-400">{getDefaultNoValue(extractNameObject(ol.asset_id, 'name'))}</span></td>
                              <td style={tabletd}><span className="font-weight-400">{numToFloat(ol.parts_qty)}</span></td>
                              <td style={tabletd}><span className="font-weight-400">{getDefaultNoValue(ol.description)}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </>
                    )}
                    <br />
                    <br />
                    {detailData.status_logs && detailData.status_logs.length > 0 && (
                    <>
                      <h4 style={{
                        textAlign: 'center',
                        marginBottom: '15px',
                      }}
                      >
                        STATUS LOGS

                      </h4>
                      <table
                        style={{
                          border: '1px solid #495057',
                          borderCollapse: 'collapse',
                          marginBottom: '15px',
                        }}
                        className="export-table1"
                        width="100%"
                        align="left"
                      >
                        <thead className="bg-gray-light">
                          <tr>
                            <th style={tabletdhead}>
                              <span>Action</span>
                            </th>
                            <th style={tabletdhead}>
                              <span>Performed By</span>
                            </th>
                            <th style={tabletdhead}>
                              <span>Performed On</span>
                            </th>
                            <th style={tabletdhead}>
                              <span>Remarks</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {detailData.status_logs && detailData.status_logs.length > 0 && detailData.status_logs.map((ai) => (
                            <tr>
                              <td style={tabletd}><span className="font-weight-400">{`${ai.from_state ? getCustomGatePassStatusName(ai.from_state, gpConfig) : 'O'} -> ${getCustomGatePassStatusName(ai.to_state, gpConfig)}`}</span></td>
                              <td style={tabletd}><span className="font-weight-400">{getDefaultNoValue(ai.performed_by, 'name')}</span></td>
                              <td style={tabletd}><span className="font-weight-400">{getDefaultNoValue(getCompanyTimezoneDate(ai.performed_on, userInfo, 'datetime'))}</span></td>
                              <td style={tabletd}><span className="font-weight-400">{getDefaultNoValue(ai.description)}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </>
                    )}
                  </div>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <iframe name="print_frame" title="Export" id="print_frame" width="0" height="0" frameBorder="0" src="about:blank" />
    </>
  );
};

GatePassReport.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
  ]).isRequired,
};

export default GatePassReport;
