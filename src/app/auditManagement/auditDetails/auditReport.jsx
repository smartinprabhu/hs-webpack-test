import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

import {
  getDefaultNoValue,
  extractNameObject,
  getCompanyTimezoneDate,
  numToFloatView,
} from '../../util/appUtils';

import { groupByMultiple } from '../../util/staticFunctions';

const tabletd = {
  border: '1px solid rgba(224, 224, 224, 1)', verticalAlign: 'middle', fontFamily: 'Roboto Condensed', borderCollapse: 'collapse', textAlign: 'center', textTransform: 'capitalize', padding: '35px',
};

const tabletdLeft = {
  border: '1px solid rgba(224, 224, 224, 1)', fontFamily: 'Roboto Condensed', borderCollapse: 'collapse', textAlign: 'left', textTransform: 'capitalize', padding: '15px',
};

const tabletdRight = {
  border: '1px solid rgba(224, 224, 224, 1)', fontFamily: 'Roboto Condensed', borderCollapse: 'collapse', textAlign: 'right', textTransform: 'capitalize', padding: '15px',
};

const tabletdhead = {
  backgroundColor: '#203764',
  color: 'white',
  fontFamily: 'Roboto Condensed',
  borderCollapse: 'collapse',
  textAlign: 'center',
  textTransform: 'uppercase',
  padding: '35px',
};

const tableheader = {
  fontSize: '18px',
  fontWeight: 800,
  verticalAlign: 'middle',
  fontFamily: 'Roboto Condensed',
  borderCollapse: 'collapse',
  textAlign: 'center',
  textTransform: 'uppercase',
  padding: '35px',
};

const AuditReport = ({ orderCheckLists, detailedData }) => {
  const { userInfo } = useSelector((state) => state.user);

  const sortCategories = (dataSections) => {
    dataSections = dataSections.sort((a, b) => a[0].mro_activity_id.sequence - b[0].mro_activity_id.sequence);
    return dataSections;
  };

  function getCatQtnsList(assetData, groupId) {
    const assetDataList = assetData.filter((item) => item.page_id.id === groupId);
    const sectionsList = sortCategories(groupByMultiple(assetDataList, (obj) => (obj.mro_quest_grp_id && obj.mro_quest_grp_id.id ? obj.mro_quest_grp_id.id : '')));
    // getinitial(sectionsList);
    console.log(sectionsList);
    return sectionsList;
  }

  function getQtnsList(assetData, groupId, categoryId) {
    let assetDataList = assetData.filter((item) => item.page_id.id === categoryId && item.mro_quest_grp_id.id === groupId);
    if (!groupId) {
      assetDataList = assetData.filter((item) => item.page_id.id === categoryId && !(item.mro_quest_grp_id && item.mro_quest_grp_id.id));
    }

    return assetDataList;
  }

  const getGroupedData = (lists) => {
    // First, group by page_id
    const pages = groupByMultiple(lists, (item) => item.page_id?.id);

    // For each page, group by mro_quest_grp_id (question group ID)
    const groupedData = pages.map((page) => {
      const groups = groupByMultiple(page, (item) => item.mro_quest_grp_id?.id || 'general');
      return {
        pageTitle: page[0].page_id?.title,
        pageId: page[0].page_id?.id,
        groups,
      };
    });

    return groupedData;
  };

  const categories = useMemo(() => getGroupedData(orderCheckLists), [orderCheckLists]);

  const totalTargets = useMemo(() => {
    const targets = {};
    orderCheckLists.forEach((row) => {
      const pageId = row.page_id.id;
      targets[pageId] = (targets[pageId] || 0) + (!row.is_na ? (row.mro_activity_id?.applicable_score || 0.00) : 0.00);
    });
    return targets;
  }, [orderCheckLists]);

  const totalAchieveds = useMemo(() => {
    const achieved = {};
    orderCheckLists.forEach((row) => {
      const pageId = row.page_id.id;
      achieved[pageId] = (achieved[pageId] || 0) + (row.achieved_score || 0.00);
    });
    return achieved;
  }, [orderCheckLists]);

  const getPercentage = (totalAchieved, totalTarget) => {
    if (totalTarget === 0) return 0; // Avoid division by zero
    return ((totalAchieved / totalTarget) * 100).toFixed(2); // Round to 2 decimal places
  };

  return (
    <div>
      <br />
      <table
        style={{
          height: '300px',
          borderCollapse: 'collapse',
          padding: '20px',
        }}
        className="export-table1"
        width="100%"
        align="center"
        id="table-to-xls_report"
      >
        <thead>
          <tr>
            <td align="center" colSpan="7" rowSpan="2" style={tableheader}>
              Auditors
            </td>
          </tr>
        </thead>
      </table>
      <br />
      <table
        style={{
          border: '1px solid rgba(224, 224, 224, 1)',
          borderCollapse: 'collapse',
          padding: '20px',
        }}
        className="export-table1"
        width="100%"
        align="left"
        id="table-to-xls_report"
      >
        <thead>
          <tr>
            <th style={tabletdhead}>#</th>
            <th style={tabletdhead}>Name</th>
            <th style={tabletdhead}>Function</th>
            <th style={tabletdhead}>Type</th>
            <th style={tabletdhead}>Certification Status</th>
            <th style={tabletdhead}>Certification Expiry</th>
            <th style={tabletdhead}>SPOC</th>
          </tr>
        </thead>
        <tbody>

          {detailedData && detailedData.auditors_ids.map((at, atIndex) => (
            <tr key={at.id}>
              <td style={tabletd}>
                {atIndex + 1}
              </td>
              <td style={tabletdLeft}>
                {extractNameObject(at.auditor_id, 'name')}
              </td>
              <td style={tabletdLeft}>
                {extractNameObject(at.role_id, 'name')}
              </td>
              <td style={tabletdLeft}>{getDefaultNoValue(extractNameObject(at.auditor_id, 'type'))}</td>
              <td style={tabletdLeft}>{getDefaultNoValue(extractNameObject(at.auditor_id, 'certification_status'))}</td>
              <td style={tabletdLeft}>{getDefaultNoValue(extractNameObject(at.auditor_id, 'certificate_expires_on'))}</td>
              <td style={tabletdLeft}>
                {at.is_spoc ? 'Yes' : 'No'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <br />
      <table
        style={{
          height: '300px',
          borderCollapse: 'collapse',
          padding: '20px',
        }}
        className="export-table1"
        width="100%"
        align="center"
        id="table-to-xls_report"
      >
        <thead>
          <tr>
            <td align="center" colSpan="7" rowSpan="2" style={tableheader}>
              Auditees
            </td>
          </tr>
        </thead>
      </table>
      <br />
      <table
        style={{
          border: '1px solid rgba(224, 224, 224, 1)',
          borderCollapse: 'collapse',
          padding: '20px',
        }}
        className="export-table1"
        width="100%"
        align="left"
        id="table-to-xls_report"
      >
        <thead>
          <tr>
            <th style={tabletdhead}>#</th>
            <th style={tabletdhead}>Name</th>
            <th style={tabletdhead}>Function</th>
            <th style={tabletdhead}>SPOC</th>
          </tr>
        </thead>
        <tbody>

          {detailedData && detailedData.auditees_ids.map((ae, aeIndex) => (
            <tr key={ae.id}>
              <td style={tabletd}>
                {aeIndex + 1}
              </td>
              <td style={tabletdLeft}>
                {extractNameObject(ae.auditor_id, 'name')}
              </td>
              <td style={tabletdLeft}>
                {extractNameObject(ae.role_id, 'name')}
              </td>
              <td style={tabletdLeft}>
                {ae.is_spoc ? 'Yes' : 'No'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <br />
      <table
        style={{
          height: '300px',
          borderCollapse: 'collapse',
          padding: '20px',
        }}
        className="export-table1"
        width="100%"
        align="center"
        id="table-to-xls_report"
      >
        <thead>
          <tr>
            <td align="center" colSpan="7" rowSpan="2" style={tableheader}>
              Overview
            </td>
          </tr>
        </thead>
      </table>
      <br />
      <table>
        <tr>
          <td>
            <table style={{
              borderCollapse: 'collapse',
              padding: '20px',
            }}
            >
              <thead>
                <tr>
                  <th style={tabletdhead}>Audit System</th>
                  <td style={tabletd}>{getDefaultNoValue(extractNameObject(detailedData.audit_system_id, 'name'))}</td>
                </tr>
                <tr>
                  <th style={tabletdhead}>Planned Start Date</th>
                  <td style={tabletd}>{getDefaultNoValue(getCompanyTimezoneDate(detailedData.planned_start_date, userInfo, 'datetime'))}</td>
                </tr>
                <tr>
                  <th style={tabletdhead}>Department</th>
                  <td style={tabletd}>{getDefaultNoValue(extractNameObject(detailedData.department_id, 'name'))}</td>
                </tr>
                <tr>
                  <th style={tabletdhead}>Audit SPOC</th>
                  <td style={tabletd}>{getDefaultNoValue(extractNameObject(detailedData.audit_spoc_id, 'name'))}</td>
                </tr>
                <tr>
                  <th style={tabletdhead}>Audit Category</th>
                  <td style={tabletd}>{getDefaultNoValue(extractNameObject(detailedData.audit_category_id, 'name'))}</td>
                </tr>
                <tr>
                  <th style={tabletdhead}>Scope</th>
                  <td style={tabletd}>{getDefaultNoValue(detailedData.scope)}</td>
                </tr>
              </thead>
            </table>
          </td>

          <td>&nbsp;</td>
          <td>
            <table style={{
              borderCollapse: 'collapse',
              padding: '20px',
            }}
            >
              <thead>
                <tr>
                  <th style={tabletdhead}>Quarter</th>
                  <td style={tabletd}>{getDefaultNoValue(detailedData.quarter)}</td>
                </tr>
                <tr>
                  <th style={tabletdhead}>Planned End Date</th>
                  <td style={tabletd}>{getDefaultNoValue(getCompanyTimezoneDate(detailedData.planned_end_date, userInfo, 'datetime'))}</td>
                </tr>
                <tr>
                  <th style={tabletdhead}>Company</th>
                  <td style={tabletd}>{getDefaultNoValue(extractNameObject(detailedData.company_id, 'name'))}</td>
                </tr>
                <tr>
                  <th style={tabletdhead}>SLA Status</th>
                  <td style={tabletd}>{getDefaultNoValue(detailedData.sla_status)}</td>
                </tr>
                <tr>
                  <th style={tabletdhead}>Objective</th>
                  <td style={tabletd}>{getDefaultNoValue((detailedData.objective))}</td>
                </tr>
                <tr>
                  <th style={tabletdhead}>Sequence</th>
                  <td style={tabletd}>{getDefaultNoValue(detailedData.sequence)}</td>
                </tr>
              </thead>
            </table>
          </td>
        </tr>
      </table>

      <br />
      <table
        style={{
          height: '300px',
          borderCollapse: 'collapse',
          padding: '20px',
        }}
        className="export-table1"
        width="100%"
        align="center"
        id="table-to-xls_report"
      >
        <thead>
          <tr>
            <td align="center" colSpan="5" rowSpan="2" style={tableheader}>
              Summary
            </td>
          </tr>
        </thead>
      </table>
      <br />
      <table
        style={{
          border: '1px solid rgba(224, 224, 224, 1)',
          borderCollapse: 'collapse',
          padding: '20px',
        }}
        className="export-table1"
        width="100%"
        align="left"
        id="table-to-xls_report"
      >
        <thead>
          <tr>
            <th style={tabletdhead}>#</th>
            <th style={tabletdhead}>Name</th>
            <th style={tabletdhead}>Maximum Score</th>
            <th style={tabletdhead}>Achieved Score</th>
            <th style={tabletdhead}>% Compliance</th>

          </tr>
        </thead>
        <tbody>

          {detailedData && detailedData.summary_pages.map((at, atIndex) => (
            <tr key={at.id}>
              <td style={tabletd}>
                {atIndex + 1}
              </td>
              <td style={tabletdLeft}>
                {extractNameObject(at.name, 'title')}
              </td>
              <td style={tabletdRight}>
                {numToFloatView(at.max_score)}
              </td>
              <td style={tabletdRight}>
                {numToFloatView(at.achieved_score)}
              </td>
              <td style={tabletdRight}>
                {numToFloatView(at.percentage)}
              </td>
            </tr>
          ))}
          <tr>
            <td />
            <td />
            <td />
            <td style={tabletd}>Overall Score %</td>
            <td style={tabletdRight}><b>{numToFloatView(detailedData.overall_score) || '0.00'}</b></td>
          </tr>
        </tbody>
      </table>

      <br />
      {categories?.length > 0
      && categories.map((category, catIndex) => (
        <React.Fragment key={catIndex}>
          <br />
          <table
            style={{
              height: '300px',
              borderCollapse: 'collapse',
              padding: '20px',
            }}
            className="export-table1"
            width="100%"
            align="center"
            id="table-to-xls_report"
          >
            <thead>
              <tr>
                <td align="center" colSpan="7" rowSpan="2" style={tableheader}>
                  {catIndex + 1}
                  .
                  {category.pageTitle}
                </td>
              </tr>
            </thead>
          </table>
          <br />
          <table
            style={{
              border: '1px solid rgba(224, 224, 224, 1)',
              borderCollapse: 'collapse',
              padding: '20px',
            }}
            className="export-table1"
            width="100%"
            align="left"
            id="table-to-xls_report"
          >
            <thead>
              <tr>
                <th style={tabletdhead}>#</th>
                <th style={tabletdhead}>Audit Check</th>
                <th style={tabletdhead}>Applicability</th>
                <th style={tabletdhead}>How to Verify</th>
                <th style={tabletdhead}>What to Look for</th>
                <th style={tabletdhead}>Auditor Notes</th>
                <th style={tabletdhead}>Compliance</th>
              </tr>
            </thead>
            <tbody>
              {/* Loop through each group in the category */}
              {Array.isArray(category.groups) && category.groups.length > 0
    && category.groups.map((group, groupIndex) => (
      <React.Fragment key={groupIndex}>
        {/* Render the group header */}
        <tr>
          {/* Render group name, span across all questions in the group */}
          <td style={tabletd} rowSpan={group.length}>
            {groupIndex + 1}
          </td>
          <td style={tabletd} rowSpan={group.length}>
            {group[0]?.mro_quest_grp_id?.name || 'General'}
          </td>

          {/* Render the first question number */}
          <td style={tabletdRight}>
            {!group[0].is_na ? (numToFloatView(group[0]?.mro_activity_id?.applicable_score) || '0.00') : '0.00'}
          </td>
          <td style={tabletdLeft}>{group[0]?.mro_activity_id?.name || 'General'}</td>

          <td style={tabletdLeft}>{group[0]?.mro_activity_id?.procedure || ''}</td>
          <td style={tabletdLeft}>{group[0]?.answer_common || ''}</td>
          <td style={tabletdRight}>
            {numToFloatView(group[0]?.achieved_score) || '0.00'}
          </td>
        </tr>

        {/* Render the remaining questions in the group */}
        {group.slice(1).map((item, index) => (
          <tr key={item.id}>

            <td style={tabletdRight}>
              {!item.is_na ? (numToFloatView(item.mro_activity_id?.applicable_score) || '0.00') : '0.00'}
            </td>
            <td style={tabletdLeft}>{item.mro_activity_id?.name || 'General'}</td>

            <td style={tabletdLeft}>{item.mro_activity_id?.procedure || ''}</td>
            <td style={tabletdLeft}>{item.answer_common || ''}</td>
            <td style={tabletdRight}>
              {numToFloatView(item.achieved_score) || '0.00'}
            </td>
          </tr>
        ))}
      </React.Fragment>
    ))}
              <tr>
                <td />
                <td style={tabletd}>Summary</td>
                <td style={tabletdRight}><b>{numToFloatView(totalTargets[category.pageId]) || '0.00'}</b></td>
                <td />
                <td />
                <td />
                <td style={tabletdRight}><b>{numToFloatView(totalAchieveds[category.pageId]) || '0.00'}</b></td>
              </tr>
              <tr>
                <td colSpan="7" style={tabletd}>
                  % Compliance:
                  {' '}
                  <b>{getPercentage(totalAchieveds[category.pageId], totalTargets[category.pageId])}</b>
                </td>
              </tr>
            </tbody>
          </table>
        </React.Fragment>
      ))}
      <br />
    
    </div>

  );
};

export default AuditReport;
