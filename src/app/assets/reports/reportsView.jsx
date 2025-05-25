/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import SideFilterAudit from './reportList/sidebar/sideFilterAudit';
import SideFilterAgeReport from './reportList/sidebar/sideFilterAgeReport';
import SideFilterAvailability from './reportList/sidebar/sideFilterAvailability';
import SideFilterMisplaced from './reportList/sidebar/sideFilterMisplaced';

import { resetExtraMultipleList } from '../../helpdesk/ticketService';
import {
  getMenuItems, getAllowedCompanies,
  getActiveTab,
  getHeaderTabs,
  getTabs,
  getDynamicTabs,
} from '../../util/appUtils';
import {
  resetAssetMisplaced, resetAssetAvailability, getIncidentReport, resetAuditReport, availabilityReportFilters,
  shiftHandoverReportFilters, auditReportFilters, misplacedReportFilters, resetWarrentyAgeReport, warrantyReportFilters,
} from '../equipmentService';
import ReportsAudit from './reportList/reportAudit';
import ReportWarrentyAge from './reportList/reportWarrentyAge';
import ReportAvailability from './reportList/reportAvailability';
import ReportMisplaced from './reportList/reportMisplaced';
import ReportsSelect from './reportList/reportSelect';
import SideFilterShiftHandover from '../../incidentManagement/reports/reportList/sidebar/sideFilterShiftReport';
import ReportShiftHandover from '../../incidentManagement/reports/reportList/reportShiftHandover';
import reports from './reports.json';

import assetSideNav from '../navbar/navlist.json';
import { updateHeaderData } from '../../core/header/actions';
import ReportsFilterHeader from '../../commonComponents/reportsFilterHeader';

const appModels = require('../../util/appModels').default;

const ReportsView = () => {
  const dispatch = useDispatch();

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const menuList = getMenuItems(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Asset Registry', 'name');
  const reportList = reports.reportList.filter((rp) => { if (menuList.includes(rp.name)) return rp; });

  const [report, setReport] = useState(reportList && reportList.length && reportList.length === 1 ? reportList[0] : '');
  const [filterOpen, setFilterOpen] = useState(false);
  const [exportType, setExportType] = useState('');
  const [exportTrue, setExportTrue] = useState('');
  const [resetFilters, setResetFilters] = useState(false);
  const {
    shiftHandoverFilters, auditReportFiltersInfo, availabilityReportFiltersInfo, misplacedFiltersInfo, warrantyAgeFilterInfo, assetAvailabilityInfo, assetMisplacedInfo, incidentReportInfo, auditInfo, warrentyAgeInfo,
  } = useSelector((state) => state.equipment);
  const companies = getAllowedCompanies(userInfo);

  const onReset = () => {
    setResetFilters(true);
    if (report && report.name === 'Shift Handover Report') {
      dispatch(shiftHandoverReportFilters([]));
      dispatch(getIncidentReport(companies, appModels.MROSHIFT));
    }
    if (report && report.name === 'Audit Report') {
      dispatch(auditReportFilters([]));
      dispatch(resetAuditReport());
      dispatch(resetExtraMultipleList());
    }
    if (report && report.name === 'Asset Audit - Availability Report') {
      dispatch(resetAssetAvailability());
      dispatch(availabilityReportFilters([]));
    }
    if (report && report.name === 'Asset Audit - Misplaced Assets') {
      dispatch(resetAssetMisplaced());
      dispatch(misplacedReportFilters([]));
    }
    if (report && report.name === 'Warranty Age Report') {
      dispatch(resetWarrentyAgeReport([]));
      dispatch(warrantyReportFilters());
    }
  };

  const showExportButton = () => {
    if (report && report.name === 'Shift Handover Report') {
      return !!(incidentReportInfo && incidentReportInfo.data && incidentReportInfo.data.length);
    }
    if (report && report.name === 'Audit Report') {
      return !!(auditInfo && auditInfo.data && auditInfo.data.length);
    }
    if (report && report.name === 'Asset Audit - Availability Report') {
      const isData = assetAvailabilityInfo && assetAvailabilityInfo.data && assetAvailabilityInfo.data.length ? assetAvailabilityInfo.data : false;
      return !!(isData && isData.length && isData.length > 0 && isData[0].total_assets !== 0);
    }
    if (report && report.name === 'Asset Audit - Misplaced Assets') {
      const isData = assetMisplacedInfo && assetMisplacedInfo.data && assetMisplacedInfo.data.length ? assetMisplacedInfo.data : false;
      return !!(isData && isData.length && isData.length > 0 && isData[0].misplaced_assets.length > 0);
    }
    if (report && report.name === 'Warranty Age Report') {
      return !!(warrentyAgeInfo && warrentyAgeInfo.data && warrentyAgeInfo.data.length);
    }
  };

  const showReset = () => {
    if (report && report.name === 'Shift Handover Report') {
      return !!(shiftHandoverFilters && shiftHandoverFilters.customFilters && shiftHandoverFilters.customFilters.length);
    }
    if (report && report.name === 'Audit Report') {
      const auditFilters = auditReportFiltersInfo && auditReportFiltersInfo.customFilters;
      if (auditFilters && auditFilters.length === 1 && auditFilters[0].key === 'validated status') {
        return false;
      }
      return !!(auditFilters && auditFilters.length);
    }
    if (report && report.name === 'Asset Audit - Availability Report') {
      return !!(availabilityReportFiltersInfo && availabilityReportFiltersInfo.customFilters && availabilityReportFiltersInfo.customFilters.length);
    }
    if (report && report.name === 'Asset Audit - Misplaced Assets') {
      return !!(misplacedFiltersInfo && misplacedFiltersInfo.customFilters && misplacedFiltersInfo.customFilters.length);
    }
    if (report && report.name === 'Warranty Age Report') {
      return !!(warrantyAgeFilterInfo && warrantyAgeFilterInfo.customFilters && warrantyAgeFilterInfo.customFilters.length);
    }
  };

  const headerTabs = getHeaderTabs(
    userRoles?.data?.allowed_modules,
    'Asset Registry',
  );

  let activeTab;
  let tabs;

  if (headerTabs) {
    const tabsDef = getTabs(headerTabs[0].menu, assetSideNav.data);
    let dynamicList = headerTabs[0].menu.filter((item) => !(assetSideNav && assetSideNav.data && assetSideNav.data[item.name]) && item.name !== 'Help');
    dynamicList = getDynamicTabs(dynamicList, '/asset-overview/dynamic-report');
    const tabsList = [...tabsDef, ...dynamicList];
    tabs = [...new Map(tabsList.map((item) => [item.name, item])).values()];
    activeTab = getActiveTab(
      tabs.filter((e) => e),
      'Reports',
    );
  }

  useEffect(() => {
    dispatch(
      updateHeaderData({
        module: 'Asset Registry',
        moduleName: 'Asset Registry',
        menuName: 'Reports',
        link: '/asset-overview/reports',
        headerTabs: tabs.filter((e) => e),
        activeTab,
      }),
    );
  }, [activeTab]);

  return (
    <>
      <ReportsFilterHeader
        Module="Asset Registry"
        Menu="Reports"
        Link="/asset-overview/reports"
        HeaderData={assetSideNav.data}
        reportOptions={reportList}
        onReset={onReset}
        showReset={showReset}
        report={report}
        setReport={setReport}
        loading={false}
        filterOpen={filterOpen}
        setFilterOpen={setFilterOpen}
        exportType={exportType}
        setExportType={setExportType}
        exportTrue={exportTrue}
        setExportTrue={setExportTrue}
        showExportButton={showExportButton}
      />

      {report && report.name === 'Audit Report' && (
        <SideFilterAudit
          filterOpen={filterOpen}
          setFilterOpen={setFilterOpen}
          resetFilters={resetFilters}
          setResetFilters={setResetFilters}
        />
      )}
      {report && report.name === 'Warranty Age Report' && (
        <SideFilterAgeReport
          filterOpen={filterOpen}
          setFilterOpen={setFilterOpen}
          resetFilters={resetFilters}
          setResetFilters={setResetFilters}
        />
      )}
      {report && report.name === 'Asset Audit - Availability Report' && (
        <SideFilterAvailability
          filterOpen={filterOpen}
          setFilterOpen={setFilterOpen}
          resetFilters={resetFilters}
          setResetFilters={setResetFilters}
        />
      )}
      {report && report.name === 'Asset Audit - Misplaced Assets' && (
        <SideFilterMisplaced
          filterOpen={filterOpen}
          setFilterOpen={setFilterOpen}
          resetFilters={resetFilters}
          setResetFilters={setResetFilters}
        />
      )}
      {report && report.name === 'Shift Handover Report' && (
        <SideFilterShiftHandover
          filterOpen={filterOpen}
          setFilterOpen={setFilterOpen}
          resetFilters={resetFilters}
          setResetFilters={setResetFilters}
        />
      )}
      {(!report || (report && !report.name)) && (
        <ReportsSelect />
      )}
      {(report && report.name === 'Audit Report') && (
        <ReportsAudit afterReset={() => { setReport(''); }} reportName={report.name} exportType={exportType} exportTrue={exportTrue} />
      )}
      {(report && report.name === 'Warranty Age Report') && (
        <ReportWarrentyAge afterReset={() => { setReport(''); }} reportName={report.name} exportType={exportType} exportTrue={exportTrue} />
      )}
      {(report && report.name === 'Asset Audit - Availability Report') && (
        <ReportAvailability afterReset={() => { setReport(''); }} reportName={report.name} exportType={exportType} exportTrue={exportTrue} />
      )}
      {(report && report.name === 'Asset Audit - Misplaced Assets') && (
        <ReportMisplaced afterReset={() => { setReport(''); }} reportName={report.name} exportType={exportType} exportTrue={exportTrue} />
      )}
      {(report && report.name === 'Shift Handover Report') && (
        <ReportShiftHandover afterReset={() => { setReport(''); }} reportName={report.name} exportType={exportType} exportTrue={exportTrue} />
      )}
    </>

  );
};
export default ReportsView;
