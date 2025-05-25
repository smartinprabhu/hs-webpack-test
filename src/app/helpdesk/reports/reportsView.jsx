import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import helpdeskNav from '../navbar/navlist.json';
import {
  getColumnArrayById,
  getAllowedCompanies,
  getHeaderTabs,
  getTabs,
  getActiveTab,
  getDynamicTabs,
} from '../../util/appUtils';
import FilterSetup from './reportsSetup/filterSetup';
import { setInitialValues } from '../../purchase/purchaseService';
import StaticDataExport from '../dataExport/staticDataExport';
import DataView from './reportsSetup/dataView';
import filtersFields from '../data/filtersFields.json';
import {
  getReportFilters, getHelpdeskFilter, resetHelpdeskReport,
  getMaintenanceConfigurationData, getTenantConfiguration,
} from '../ticketService';
import ReportsFilterHeader from '../../commonComponents/reportsFilterHeader';
import { updateHeaderData } from '../../core/header/actions';
import ReportSelect from './reportsSetup/reportSelect';

const appModels = require('../../util/appModels').default;

const ReportsView = ({ type }) => {
  const reportOptions = [
    {
      name: 'Tickets Detail Report',
      label: 'Tickets Detail Report',
      id: 1,
    },
  ];
  const [report, setReport] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const {
    helpdeskDetailReportInfo,
    maintenanceConfigurationData,
    helpdeskReportFilters,
    moduleFilters,
  } = useSelector((state) => state.ticket);
  const { userRoles } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const repData = helpdeskDetailReportInfo
    && helpdeskDetailReportInfo.data
    && helpdeskDetailReportInfo.data.length
    ? helpdeskDetailReportInfo.data
    : false;
  const isVendorShow = maintenanceConfigurationData
    && !maintenanceConfigurationData.loading
    && maintenanceConfigurationData.data
    && maintenanceConfigurationData.data.length
    && maintenanceConfigurationData.data[0].is_vendor_field === 'Yes';

  const allFields = getColumnArrayById(filtersFields.columns, 'accessor');

  const isFITTracker = !!(type && type === 'FITTracker');

  const navData = isFITTracker ? helpdeskNav.data1 : helpdeskNav.data;

  const showFields = isVendorShow ? allFields.concat(['vendor_id']) : allFields;
  const [exportType, setExportType] = useState('');
  const [exportTrue, setExportTrue] = useState('');

  const { userInfo } = useSelector((state) => state.user);
  const [resetFilters, setResetFilters] = useState(false);
  const [activeFilter, setActiveFilter] = useState(false);

  const [activeDateFilter, setActivedateFilter] = useState(false);

  const [activeTemplate, setActiveTemplate] = useState(false);

  const companies = getAllowedCompanies(userInfo);
  const { sortedValue } = useSelector((state) => state.equipment);

  useEffect(() => {
    if (userInfo && userInfo.data && userInfo.data.company) {
      dispatch(getMaintenanceConfigurationData(userInfo.data.company.id, appModels.MAINTENANCECONFIG));
    }
    if (userInfo && userInfo.data && userInfo.data.associates_to && userInfo.data.associates_to === 'Tenant') {
      dispatch(getTenantConfiguration());
    }
  }, []);

  const showExportButton = () => {
    if (report && report.name === 'Tickets Detail Report') {
      return !!(helpdeskDetailReportInfo && helpdeskDetailReportInfo.data && helpdeskDetailReportInfo.data.length);
    }
  };

  const onReset = () => {
    setResetFilters(true);
    dispatch(getReportFilters([]));
    dispatch(resetHelpdeskReport());
    setActiveFilter(false);
    setActivedateFilter(false);
    setActiveTemplate(false);
  };

  const showReset = () => {
    const checkNotTodayFilter = helpdeskReportFilters.customFilters
      && helpdeskReportFilters.customFilters.length
      && helpdeskReportFilters.customFilters.filter(
        (data) => data.key !== 'Today',
      );
    const checkTodayFilter = helpdeskReportFilters.customFilters
      && helpdeskReportFilters.customFilters.length
      && helpdeskReportFilters.customFilters.filter(
        (data) => data.key === 'Today',
      );
    return (checkNotTodayFilter && checkNotTodayFilter.length) || activeFilter
      ? true
      : !!(checkTodayFilter && checkTodayFilter.length > 1);
  };

  const headerTabs = getHeaderTabs(
    userRoles?.data?.allowed_modules,
    isFITTracker ? 'FIT Tracker' : 'Helpdesk',
  );

  let activeTab;
  let tabs;

  if (headerTabs && headerTabs.length) {
    const tabsDef = getTabs(headerTabs[0].menu, navData);
    let dynamicList = headerTabs[0].menu.filter((item) => !(navData && navData[item.name]) && item.name !== 'Help');
    dynamicList = getDynamicTabs(dynamicList, '/helpdesk-insights-overview/helpdesk/dynamic-report');
    const tabsList = [...tabsDef, ...dynamicList];
    tabs = [...new Map(tabsList.map((item) => [item.name, item])).values()];
    activeTab = getActiveTab(
      tabs.filter((e) => e),
      'Report',
    );
  }

  useEffect(() => {
    dispatch(
      updateHeaderData({
        module: isFITTracker ? 'FIT Tracker' : 'Helpdesk',
        moduleName: isFITTracker ? 'FIT Tracker' : 'Helpdesk',
        menuName: 'Report',
        link: '/helpdesk-insights-overview',
        headerTabs: tabs.filter((e) => e),
        activeTab,
        dispatchFunc: () => getHelpdeskFilter({}),
      }),
    );
  }, [activeTab]);

  return (
    <>
      <ReportsFilterHeader
        Module={isFITTracker ? 'FIT Tracker' : 'Helpdesk'}
        Menu="Report"
        Link="/helpdesk-insights-overview"
        HeaderData={navData}
        reportOptions={reportOptions}
        onReset={onReset}
        showReset={showReset}
        report={report}
        setReport={setReport}
        loading={helpdeskDetailReportInfo && helpdeskDetailReportInfo.loading}
        filterOpen={filterOpen}
        setFilterOpen={setFilterOpen}
        exportType={exportType}
        setExportType={setExportType}
        exportTrue={exportTrue}
        setExportTrue={setExportTrue}
        showExportButton={showExportButton}
      />
      {report && report.name === 'Tickets Detail Report' && (
        <FilterSetup
          filterOpen={filterOpen}
          setFilterOpen={setFilterOpen}
          activeFilter={activeFilter}
          onReset={onReset}
          setActiveFilter={setActiveFilter}
          activeTemplate={activeTemplate}
          setActiveTemplate={setActiveTemplate}
          activeDateFilter={activeDateFilter}
          setActivedateFilter={setActivedateFilter}
          resetFilters={resetFilters}
          setResetFilters={setResetFilters}
        />
      )}
      {!report && (
        <ReportSelect />
      )}
      {report && report.name === 'Tickets Detail Report' && helpdeskDetailReportInfo && (
        <StaticDataExport
          ticketData={repData}
          afterResets={() => dispatch(setInitialValues(false, false, false, false))}
          exportType={exportType}
          exportTrue={exportTrue}
          setExportType={setExportType}
          fields={showFields}
          isIncident={false}
          activeDateFilter={activeDateFilter}
          activeTemplate={activeTemplate}
          activeFilter={activeFilter}
        />
      )}
      {report && report.name === 'Tickets Detail Report' && (<DataView activeFilter={activeFilter} activeTemplate={activeTemplate} />)}
    </>
  );
};
export default ReportsView;
