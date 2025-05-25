/* eslint-disable import/no-unresolved */
/* eslint-disable radix */
import React from 'react';
import * as PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import DOMPurify from 'dompurify';
import renderHTML from 'react-render-html';

import {
  getCompanyTimezoneDate,
  getDefaultNoValue,
  extractNameObject,
  detectMimeType,
} from '../../../util/appUtils';

const tabletd = {
  border: '1px solid #495057',
  borderCollapse: 'collapse',
  textAlign: 'left',
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

const headText = {
  fontWeight: 800,
  marginRight: '2px',
};

const LessonsLearnt = (props) => {
  const {
    detailData,
    isValidate,
  } = props;

  const { userInfo } = useSelector((state) => state.user);

  const { multiDocumentsInfo } = useSelector((state) => state.ticket);

  const multiDocuments = multiDocumentsInfo && multiDocumentsInfo.data && !multiDocumentsInfo.loading ? multiDocumentsInfo.data.filter((item) => item.datas) : [];

  function getTableHtml(ans) {
    let res2 = '';
    if (ans) {
      const res = ans.replaceAll('<td>', '<td style="border: 1px solid #dadada; min-width: 2em; padding: 0.4em; user-select: text; vertical-align: middle; color: #374152;">');
      const res1 = res.replaceAll('<table', '<table class=\"table table-bordered\" border="1" style="border: none; border-collapse: collapse; empty-cells: show; margin-bottom: 1em; margin-top: 1em; max-width: 100%;"');
      res2 = res1.replaceAll('<p><br></p>', '');
    }
    return res2;
  }

  function getTrimmedAnswer(str) {
    let res = '-';
    if (str) {
      if (str === 'True') {
        res = 'Yes';
      } else if (str === 'False') {
        res = 'No';
      } else if (typeof (str) === 'boolean') {
        res = 'Yes';
      } else {
        res = str;
      }
    }
    return res;
  }

  const sortSections = (dataSections) => {
    const dataSectionsNew = dataSections.sort(
      (a, b) => new Date(a.create_date) - new Date(b.create_date),
    );
    return dataSectionsNew;
  };

  const sortSectionsV1 = (dataSections) => {
    const dataSectionsNew = dataSections.sort(
      (a, b) => a.mro_activity_id.sequence - b.mro_activity_id.sequence,
    );
    return dataSectionsNew;
  };

  return (
    <>
      <div id="print-invest-report-learn">
        <table style={{ width: '100%' }}>
          <thead>
            <tr>
              <td>
                <div className="page-header-space" style={{ height: '20px' }} />
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <h3 style={{ display: 'flex', alignItems: 'center', marginBottom: detailData && detailData.company_id && detailData.company_id.logo ? '10px' : '20px' }}>
                  LESSONS LEARNT REPORT
                  {detailData && detailData.company_id && detailData.company_id.logo && (
                  <img
                    style={{
                      marginLeft: 'auto', width: '100%', height: 'auto', maxWidth: '100px',
                    }}
                    src={`data:${detectMimeType(detailData.company_id.logo)};base64,${detailData.company_id.logo}`}
                    width="100"
                    height="80"
                    alt="Helixsense Portal"
                  />
                  )}
                </h3>
                {detailData && (
                  <div className="p-3 mt-2">
                    <table
                      style={{
                        border: '1px solid #495057',
                        borderCollapse: 'collapse',
                        marginBottom: '15px',
                        color: 'white',
                        backgroundColor: '#0d2a92',
                      }}
                      className="export-table1"
                      width="100%"
                      align="left"
                    >
                      <tbody>
                        <tr>
                          <td style={tabletd}>
                            <span className="font-weight-800" style={headText}>Date of Incident</span>
                          </td>
                          <td style={tabletd}>
                            <span className="font-weight-800" style={headText}>{getDefaultNoValue(getCompanyTimezoneDate(detailData.incident_on, userInfo, 'datetime'))}</span>
                          </td>
                          <td style={tabletd}>
                            <span className="font-weight-800" style={headText}>Incident Reference</span>
                          </td>
                          <td style={tabletd}>
                            <span className="font-weight-800" style={headText}>{getDefaultNoValue(detailData.reference)}</span>
                          </td>
                        </tr>
                        <tr>
                          <td style={tabletd}>
                            <span className="font-weight-800" style={headText}>
                              Subject
                            </span>
                          </td>
                          <td style={tabletd} colSpan={3}>
                            <span className="font-weight-800" style={headText}>
                              {getDefaultNoValue(detailData.name)}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td style={tabletd}>
                            <span className="font-weight-800" style={headText}>{detailData.type_category && detailData.type_category === 'equipment' ? 'Equipment' : 'Location'}</span>
                          </td>
                          <td style={tabletd}>
                            {detailData.type_category && detailData.type_category === 'equipment' && (
                            <span className="font-weight-800" style={headText}>
                              {getDefaultNoValue(extractNameObject(detailData.equipment_id, 'name'))}
                            </span>
                            )}
                            {detailData.type_category && detailData.type_category === 'asset' && (
                            <span className="font-weight-800" style={headText}>{getDefaultNoValue(extractNameObject(detailData.asset_id, 'path_name'))}</span>
                            )}
                          </td>
                          <td style={tabletd}>
                            <span className="font-weight-800" style={headText}>Site</span>
                          </td>
                          <td style={tabletd}>
                            <span className="font-weight-800" style={headText}>{getDefaultNoValue(extractNameObject(detailData.company_id, 'name'))}</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <br />
                    <br />
                    <table
                      style={{
                        border: '1px solid #495057',
                        borderCollapse: 'collapse',
                        marginBottom: '15px',
                        marginTop: '5px',
                      }}
                      className="export-table1"
                      width="100%"
                      align="left"
                    >
                      <tbody>
                        <tr>
                          <td style={tabletdtitle}>
                            <h4 style={{ marginBottom: '0px' }}>INCIDENT SUMMARY</h4>
                          </td>
                        </tr>
                        <tr>
                          <td style={tabletd}>
                            {renderHTML(DOMPurify.sanitize(getTableHtml(detailData.description), { USE_PROFILES: { html: true } }))}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <br />
                    {isValidate && (detailData.state === 'Validated' || detailData.state === 'Signed off') && detailData.validate_checklist_ids && detailData.validate_checklist_ids.length > 0 && (
                      <>
                        <h4 style={{ textAlign: 'center', marginBottom: '15px' }} />
                        <table
                          style={{
                            border: '1px solid #495057', borderCollapse: 'collapse', marginBottom: '15px',
                          }}
                          className="export-table1"
                          width="100%"
                          align="left"
                        >

                          <tbody>
                            {detailData.validate_checklist_ids && detailData.validate_checklist_ids.length > 0 && sortSectionsV1(detailData.validate_checklist_ids).map((ac) => (
                              <>
                                <tr>
                                  <td style={tabletdhead}><span className="font-weight-400">{getDefaultNoValue(extractNameObject(ac.mro_activity_id, 'name'))}</span></td>
                                </tr>
                                <tr>
                                  <td style={tabletdbord}>
                                    <span className="font-weight-400">
                                      {ac.type === 'Rich Text' ? (
                                        renderHTML(DOMPurify.sanitize(getTableHtml(ac.answer), { USE_PROFILES: { html: true } }))
                                      )
                                        : getDefaultNoValue(getTrimmedAnswer(ac.answer))}
                                    </span>
                                  </td>
                                </tr>
                              </>
                            ))}
                          </tbody>
                        </table>
                      </>
                    )}
                    {multiDocuments && multiDocuments.length > 0 && (
                    <>
                      <h4 style={{
                        textAlign: 'center',
                        marginBottom: '15px',
                      }}
                      >
                        APPENDIX

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
                              <span>File Name</span>
                            </th>
                            <th style={tabletdhead}>
                              <span>File Type</span>
                            </th>
                            <th style={tabletdhead}>
                              <span>Created Date</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {sortSections(multiDocuments).map((ai) => (
                            <tr>
                              <td style={tabletd}><span className="font-weight-400">{getDefaultNoValue(ai.datas_fname)}</span></td>
                              <td style={tabletd}><span className="font-weight-400">{getDefaultNoValue(ai.mimetype)}</span></td>
                              <td style={tabletd}><span className="font-weight-400">{getDefaultNoValue(getCompanyTimezoneDate(ai.create_date, userInfo, 'datetime'))}</span></td>
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
      <iframe name="print_frame" title="Export" id="print_frame_learn" width="0" height="0" frameBorder="0" src="about:blank" />
    </>
  );
};

LessonsLearnt.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
  ]).isRequired,
};

export default LessonsLearnt;
