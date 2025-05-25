/* eslint-disable import/no-unresolved */
/* eslint-disable radix */
import React, { useRef } from 'react';
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
import { getInjuriyTypeLabel } from '../../../helpdesk/utils/utils';

const tabletd = {
  border: '1px solid #495057',
  borderCollapse: 'collapse',
  textAlign: 'left',
  // textTransform: 'capitalize',
  padding: '2px',
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

const InvestigationReport = (props) => {
  const {
    detailData,
    isAnalysis,
    isValidate,
  } = props;

  const { userInfo } = useSelector((state) => state.user);

  const { multiDocumentsInfo, equipmentDocuments } = useSelector((state) => state.ticket);

  const multiDocuments = multiDocumentsInfo && multiDocumentsInfo.data && !multiDocumentsInfo.loading ? multiDocumentsInfo.data.filter((item) => item.datas) : [];
  const singelDocs = equipmentDocuments && equipmentDocuments.data && !equipmentDocuments.loading ? equipmentDocuments.data.filter((item) => item.datas) : [];

  const multipleDocuments = [...singelDocs, ...multiDocuments];

  const editor = useRef(null);

  function getTableHtml(ans) {
    let res2 = '';
    if (ans) {
      const res = ans.replaceAll('<td>', '<td style="border: 1px solid #dadada; min-width: 2em; padding: 0.4em; user-select: text; vertical-align: middle; color: #374152;">');
      const res1 = res.replaceAll('<table', '<table class=\"table table-bordered\" border="1" style="border: none; border-collapse: collapse; empty-cells: show; margin-bottom: 1em; margin-top: 1em; max-width: 100%;"');
      res2 = res1.replaceAll('<p><br></p>', '');
    }
    return res2;
  }

  const mimeTypesAllowed = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'];

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
      <div id="print-invest-report">
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
                  INCIDENT INVESTIGATION REPORT
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
                            <span className="font-weight-800" style={headText}>Date of Incident</span>
                          </td>
                          <td style={tabletd}>
                            <span className="font-weight-400">{getDefaultNoValue(getCompanyTimezoneDate(detailData.incident_on, userInfo, 'datetime'))}</span>
                          </td>
                          <td style={tabletdhead}>
                            <span className="font-weight-800" style={headText}>Incident Reference</span>
                          </td>
                          <td style={tabletd}>
                            <span className="font-weight-400">{getDefaultNoValue(detailData.reference)}</span>
                          </td>
                        </tr>
                        <tr>
                          <td style={tabletdhead}>
                            <span className="font-weight-800" style={headText}>
                              Reporting Source
                            </span>
                          </td>
                          <td style={tabletd}>
                            <span className="font-weight-400">
                              {getDefaultNoValue(extractNameObject(detailData.reported_by_id, 'name'))}
                            </span>
                          </td>
                          <td style={tabletdhead}>
                            <span className="font-weight-800" style={headText}>Person Witnessed</span>
                          </td>
                          <td style={tabletd}>
                            <span className="font-weight-400">{getDefaultNoValue(detailData.person_witnessed)}</span>
                          </td>
                        </tr>
                        <tr>
                          <td style={tabletdhead}>
                            <span className="font-weight-800" style={headText}>
                              Subject
                            </span>
                          </td>
                          <td style={tabletd} colSpan={3}>
                            <span className="font-weight-400">
                              {getDefaultNoValue(detailData.name)}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td style={tabletdhead}>
                            <span className="font-weight-800" style={headText}>{detailData.type_category && detailData.type_category === 'equipment' ? 'Equipment' : 'Location'}</span>
                          </td>
                          <td style={tabletd}>
                            {detailData.type_category && detailData.type_category === 'equipment' && (
                            <span className="font-weight-400">
                              {getDefaultNoValue(extractNameObject(detailData.equipment_id, 'name'))}
                            </span>
                            )}
                            {detailData.type_category && detailData.type_category === 'asset' && (
                            <span className="font-weight-400">{getDefaultNoValue(extractNameObject(detailData.asset_id, 'path_name'))}</span>
                            )}
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
                              Type of Incident
                            </span>
                          </td>
                          <td style={tabletd}>
                            <span className="font-weight-400">
                              {getDefaultNoValue(extractNameObject(detailData.incident_type_id, 'name'))}
                            </span>
                          </td>
                          <td style={tabletdhead}>
                            <span className="font-weight-800" style={headText}>Status</span>
                          </td>
                          <td style={tabletd}>
                            <span className="font-weight-400">{getDefaultNoValue(detailData.state)}</span>
                          </td>
                        </tr>
                        <tr>
                          <td style={tabletdhead}>
                            <span className="font-weight-800" style={headText}>
                              Severity
                            </span>
                          </td>
                          <td style={tabletd}>
                            <span className="font-weight-400">
                              {getDefaultNoValue(extractNameObject(detailData.severity_id, 'name'))}
                            </span>
                          </td>
                          <td style={tabletdhead}>
                            <span className="font-weight-800" style={headText}>Priority</span>
                          </td>
                          <td style={tabletd}>
                            <span className="font-weight-400">
                              {getDefaultNoValue(extractNameObject(detailData.priority_id, 'name'))}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td style={tabletdhead}>
                            <span className="font-weight-800" style={headText}>
                              Category
                            </span>
                          </td>
                          <td style={tabletd}>
                            <span className="font-weight-400">
                              {getDefaultNoValue(extractNameObject(detailData.category_id, 'name'))}
                            </span>
                            {detailData.category_id && detailData.category_id.image && (
                              <>
                                <br />
                                <img
                                  style={{
                                    marginLeft: 'auto', width: '100%', height: '200px', maxWidth: '200px', maxHeight: '200px',
                                  }}
                                  src={`data:${detectMimeType(detailData.category_id.image)};base64,${detailData.category_id.image}`}
                                  width="200"
                                  height="200"
                                  alt={detailData.category_id.name}
                                />
                              </>
                            )}
                          </td>
                          <td style={tabletdhead}>
                            <span className="font-weight-800" style={headText}>Sub Category</span>
                          </td>
                          <td style={tabletd}>
                            <span className="font-weight-400">
                              {getDefaultNoValue(extractNameObject(detailData.sub_category_id, 'name'))}
                            </span>
                            {detailData.sub_category_id && detailData.sub_category_id.image && (
                            <>
                              <br />
                              <img
                                style={{
                                  marginLeft: 'auto', width: '100%', height: '200px', maxWidth: '200px', maxHeight: '200px',
                                }}
                                src={`data:${detectMimeType(detailData.sub_category_id.image)};base64,${detailData.sub_category_id.image}`}
                                width="200"
                                height="200"
                                alt={detailData.sub_category_id.name}
                              />
                            </>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td style={tabletdhead}>
                            <span className="font-weight-800" style={headText}>
                              Description
                            </span>
                          </td>
                          <td style={tabletd} colSpan={3}>
                            <span className="font-weight-400">
                              {getDefaultNoValue(detailData.description)}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    { /* ((detailData.sub_category_id && detailData.sub_category_id.image) || (detailData.category_id && detailData.category_id.image)) && (
                      <>
                        <br />
                        <br />
                        {((detailData.sub_category_id && detailData.sub_category_id.image) && !(detailData.category_id && detailData.category_id.image)) && (
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
                                <h4 style={{ marginBottom: '0px' }}>{detailData.sub_category_id.name}</h4>
                              </td>
                            </tr>
                            <tr>
                              <td style={tabletdimage}>
                                <img
                                  style={{
                                    marginLeft: 'auto', width: '100%', height: 'auto', maxWidth: '200px',
                                  }}
                                  src={`data:${detectMimeType(detailData.sub_category_id.image)};base64,${detailData.sub_category_id.image}`}
                                  width="200"
                                  height="80"
                                  alt={detailData.sub_category_id.name}
                                />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        )}
                        {(!(detailData.sub_category_id && detailData.sub_category_id.image) && (detailData.category_id && detailData.category_id.image)) && (
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
                                <h4 style={{ marginBottom: '0px' }}>{detailData.category_id.name}</h4>
                              </td>
                            </tr>
                            <tr>
                              <td style={tabletdimage}>
                                <img
                                  style={{
                                    marginLeft: 'auto', width: '100%', height: 'auto', maxWidth: '200px',
                                  }}
                                  src={`data:${detectMimeType(detailData.category_id.image)};base64,${detailData.category_id.image}`}
                                  width="200"
                                  height="80"
                                  alt={detailData.category_id.name}
                                />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        )}
                          {((detailData.sub_category_id && detailData.sub_category_id.image) && (detailData.category_id && detailData.category_id.image)) && (
                            <>
                              <table
                                style={{
                                  border: '1px solid #495057',
                                  borderCollapse: 'collapse',
                                  marginBottom: '15px',
                                  marginTop: '5px',
                                  height: '200px',
                                }}
                                className="export-table1"
                                width="50%"
                                align="left"
                              >
                                <tbody>
                                  <tr>
                                    <td style={tabletdtitleimage}>
                                      <h4 style={{ marginBottom: '0px' }}>{detailData.category_id.name}</h4>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td style={tabletdimage}>
                                      <img
                                        style={{
                                          marginLeft: 'auto', width: '100%', height: '200px', maxWidth: '200px', maxHeight: '200px',
                                        }}
                                        src={`data:${detectMimeType(detailData.category_id.image)};base64,${detailData.category_id.image}`}
                                        width="200"
                                        height="200"
                                        alt={detailData.category_id.name}
                                      />
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <table
                                style={{
                                  border: '1px solid #495057',
                                  borderCollapse: 'collapse',
                                  marginBottom: '15px',
                                  marginTop: '5px',
                                  height: '200px',
                                }}
                                className="export-table1"
                                width="50%"
                                align="left"
                              >
                                <tbody>
                                  <tr>
                                    <td style={tabletdtitleimage}>
                                      <h4 style={{ marginBottom: '0px' }}>{detailData.sub_category_id.name}</h4>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td style={tabletdimage}>
                                      <img
                                        style={{
                                          marginLeft: 'auto', width: '100%', height: '200px', maxWidth: '200px', maxHeight: '200px',
                                        }}
                                        src={`data:${detectMimeType(detailData.sub_category_id.image)};base64,${detailData.sub_category_id.image}`}
                                        width="200"
                                        height="200"
                                        alt={detailData.sub_category_id.name}
                                      />
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </>
                          )}
                      </>
                                      ) */}
                    { /* !((detailData.sub_category_id && detailData.sub_category_id.image) || (detailData.category_id && detailData.category_id.image)) && (<br />) */ }
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
                            <h4 style={{ marginBottom: '0px' }}>CORRECTIVE ACTION</h4>
                          </td>
                        </tr>
                        <tr>
                          <td style={tabletd}>
                            {renderHTML(DOMPurify.sanitize(getTableHtml(detailData.corrective_action), { USE_PROFILES: { html: true } }))}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <br />
                    {isAnalysis && (
                      <>
                        <h4 style={{
                          textAlign: 'center',
                          marginBottom: '10px',
                        }}
                        >
                          ROOT CAUSE FAILURE ANALYSIS

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

                          <tbody>
                            {detailData.analysis_checklist_ids && detailData.analysis_checklist_ids.length > 0 && sortSectionsV1(detailData.analysis_checklist_ids).map((ac) => (
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
                        {detailData.injuries_sustained_ids && detailData.injuries_sustained_ids.length > 0 && (
                        <>
                          <h4
                            style={{
                              textAlign: 'center',
                              marginBottom: '15px',
                            }}
                          >
                            INJURIES SUSTAINED

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
                                  <span>Name</span>
                                </th>
                                <th style={tabletdhead}>
                                  <span>Organization</span>
                                </th>
                                <th style={tabletdhead}>
                                  <span>Nature of Injury</span>
                                </th>
                                <th style={tabletdhead}>
                                  <span>Organ Injured</span>
                                </th>
                                <th style={tabletdhead}>
                                  <span>Status</span>
                                </th>
                                <th style={tabletdhead}>
                                  <span>Remarks</span>
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {detailData.injuries_sustained_ids && detailData.injuries_sustained_ids.length > 0 && detailData.injuries_sustained_ids.map((ai) => (
                                <tr>
                                  <td style={tabletd}><span className="font-weight-400">{getDefaultNoValue(ai.name)}</span></td>
                                  <td style={tabletd}><span className="font-weight-400">{getDefaultNoValue(ai.organization)}</span></td>
                                  <td style={tabletd}><span className="font-weight-400">{getDefaultNoValue(ai.nature_of_injury)}</span></td>
                                  <td style={tabletd}><span className="font-weight-400">{getDefaultNoValue(ai.organ_injured)}</span></td>
                                  <td style={tabletd}><span className="font-weight-400">{getDefaultNoValue(getInjuriyTypeLabel(ai.status))}</span></td>
                                  <td style={tabletd}><span className="font-weight-400">{getDefaultNoValue(ai.remarks)}</span></td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </>
                        )}
                        {detailData.analysis_ids && detailData.analysis_ids.length > 0 && (
                        <>
                          <h4
                            style={{
                              textAlign: 'center',
                              marginBottom: '15px',
                            }}
                          >
                            RECOMMENDATIONS

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
                                  <span>Task Type</span>
                                </th>
                                <th style={tabletdhead}>
                                  <span>Action</span>
                                </th>
                                <th style={tabletdhead}>
                                  <span>Assigned To</span>
                                </th>
                                <th style={tabletdhead}>
                                  <span>Targt Date</span>
                                </th>
                                <th style={tabletdhead}>
                                  <span>Status</span>
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {detailData.analysis_ids && detailData.analysis_ids.length > 0 && detailData.analysis_ids.map((ai) => (
                                <tr>
                                  <td style={tabletd}><span className="font-weight-400">{getDefaultNoValue(extractNameObject(ai.task_type_id, 'name'))}</span></td>
                                  <td style={tabletd}><span className="font-weight-400">{getDefaultNoValue(ai.name)}</span></td>
                                  <td style={tabletd}><span className="font-weight-400">{getDefaultNoValue(extractNameObject(ai.assigned_id, 'name'))}</span></td>
                                  <td style={tabletd}><span className="font-weight-400">{getDefaultNoValue(getCompanyTimezoneDate(ai.target_date, userInfo, 'datetime'))}</span></td>
                                  <td style={tabletd}><span className="font-weight-400">{getDefaultNoValue(ai.state)}</span></td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </>
                        )}
                      </>
                    )}
                    {isValidate && (detailData.state === 'Validated' || detailData.state === 'Signed off') && detailData.validate_checklist_ids && detailData.validate_checklist_ids.length > 0 && (
                      <>
                        <h4 style={{
                          textAlign: 'center',
                          marginBottom: '15px',
                        }}
                        >
                          VALIDATIONS

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
                    {detailData.status_logs && detailData.status_logs.length > 0 && (
                    <>
                      <h4 style={{
                        textAlign: 'center',
                        marginBottom: '15px',
                      }}
                      >
                        ACTION LOGS

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
                              <span>Comment (if any)</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {detailData.status_logs && detailData.status_logs.length > 0 && detailData.status_logs.map((ai) => (
                            <tr>
                              <td style={tabletd}><span className="font-weight-400">{`${ai.from_state ? ai.from_state : 'O'} -> ${ai.to_state}`}</span></td>
                              <td style={tabletd}><span className="font-weight-400">{getDefaultNoValue(extractNameObject(ai.performed_by_id, 'name'))}</span></td>
                              <td style={tabletd}><span className="font-weight-400">{getDefaultNoValue(getCompanyTimezoneDate(ai.performed_on, userInfo, 'datetime'))}</span></td>
                              <td style={tabletd}><span className="font-weight-400">{getDefaultNoValue(ai.description)}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </>
                    )}
                    {multipleDocuments && multipleDocuments.length > 0 && (
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
                          {sortSections(multipleDocuments).map((ai) => (
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
      <iframe name="print_frame" title="Export" id="print_frame" width="0" height="0" frameBorder="0" src="about:blank" />
    </>
  );
};

InvestigationReport.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
  ]).isRequired,
};

export default InvestigationReport;
