import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  getColumnArrayById,
  queryGeneratorWithUtc,
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
import wasteSideNav from '../navbar/navlist.json';
import { getReportFilters, getWasteReports } from '../complianceService';
import ReportsFilterHeader from '../../commonComponents/reportsFilterHeader';
import { updateHeaderData } from '../../core/header/actions';

const appModels = require('../../util/appModels').default;

const ReportsView = () => {
  const reportOptions = [
    {
      name: 'Detail Report',
      label: 'Detail Report',
      id: 1,
    },
  ];
  const [report, setReport] = useState(reportOptions[0]);
  const [filterOpen, setFilterOpen] = useState(false);
  const { userRoles } = useSelector((state) => state.user);
  const { wasteReportFilters, wasteReportsInfo } = useSelector((state) => state.waste);
  const dispatch = useDispatch();

  const repData = wasteReportsInfo
    && wasteReportsInfo.data
    && wasteReportsInfo.data.length
    ? wasteReportsInfo.data
    : false;

  const allFields = getColumnArrayById(filtersFields.columns, 'accessor');

  const showFields = allFields;
  const [exportType, setExportType] = useState('');
  const [exportTrue, setExportTrue] = useState('');

  const { userInfo } = useSelector((state) => state.user);
  const [resetFilters, setResetFilters] = useState(false);

  const companies = getAllowedCompanies(userInfo);
  const { sortedValue } = useSelector((state) => state.equipment);

  const showExportButton = () => {
    if (report && report.name === 'Detail Report') {
      return !!(wasteReportsInfo && wasteReportsInfo.data && wasteReportsInfo.data.length);
    }
  };

  const onReset = () => {
    setResetFilters(true);
    // const customFilters = [
    //   {
    //     key: 'Today', value: 'Today', label: 'Today', type: 'date',
    //   },
    // ];
    // const customFiltersList = queryGeneratorWithUtc(
    //   customFilters,
    //   'create_date',
    //   userInfo.data,
    // );
    // const fields = getColumnArrayById(filtersFields.columns, 'accessor');
  
    // dispatch(getReportFilters(customFilters));
    // dispatch(
    //   getWasteReports(
    //     companies,
    //     appModels.WASTETRACKER,
    //     fields,
    //     customFiltersList,
    //     sortedValue.sortBy,
    //     sortedValue.sortField,
    //   ),
    // );
  };

  const showReset = () => {
    const checkNotTodayFilter = wasteReportFilters.customFilters
      && wasteReportFilters.customFilters.length
      && wasteReportFilters.customFilters.filter(
        (data) => data.key !== 'Today',
      );
    const checkTodayFilter = wasteReportFilters.customFilters
      && wasteReportFilters.customFilters.length
      && wasteReportFilters.customFilters.filter(
        (data) => data.key === 'Today',
      );
    // return checkNotTodayFilter && checkNotTodayFilter.length
    //   ? true
    //   : !!(checkTodayFilter && checkTodayFilter.length > 1);
    return !!(wasteReportFilters.customFilters
    && wasteReportFilters.customFilters.length > 0);
  };

  const headerTabs = getHeaderTabs(userRoles?.data?.allowed_modules, 'Waste Tracker');

  let activeTab;
  let tabs;

  if (headerTabs) {
    tabs = getTabs(headerTabs[0].menu, wasteSideNav.data);
    const tabsDef = getTabs(headerTabs[0].menu, wasteSideNav.data);
    let dynamicList = headerTabs[0].menu.filter((item) => !(wasteSideNav && wasteSideNav.data && wasteSideNav.data[item.name]) && item.name !== 'Help');
    dynamicList = getDynamicTabs(dynamicList, '/waste/dynamic-report');
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
        module: 'Waste Tracker',
        moduleName: 'Waste Tracker',
        menuName: '',
        link: '/waste-reports',
        headerTabs: tabs.filter((e) => e),
        activeTab,
      }),
    );
  }, [activeTab]);

  return (
    <>
      <ReportsFilterHeader
        Module="Waste Tracker"
        Menu="Report"
        Link="/waste-reports"
        HeaderData={wasteSideNav.data}
        reportOptions={reportOptions}
        onReset={onReset}
        showReset={showReset}
        report={report}
        setReport={setReport}
        loading={wasteReportsInfo && wasteReportsInfo.loading}
        filterOpen={filterOpen}
        setFilterOpen={setFilterOpen}
        exportType={exportType}
        setExportType={setExportType}
        exportTrue={exportTrue}
        setExportTrue={setExportTrue}
        showExportButton={showExportButton}
      />
      <FilterSetup
        filterOpen={filterOpen}
        setFilterOpen={setFilterOpen}
        resetFilters={resetFilters}
        setResetFilters={setResetFilters}
      />
      {wasteReportsInfo && (
        <StaticDataExport
          ticketData={repData}
          afterResets={() => dispatch(setInitialValues(false, false, false, false))}
          exportType={exportType}
          exportTrue={exportTrue}
          setExportType={setExportType}
          fields={showFields}
        />
      )}
      {report && report.name === 'Detail Report' && (<DataView />)}
    </>
  );
};
export default ReportsView;
