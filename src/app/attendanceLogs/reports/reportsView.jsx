/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ReportDownload from './reportDownload';
import MonthlyAttendance from './sidebar/monthlyAttendance';
import EmployeeBioMetric from './sidebar/employeeBiometric';

import { resetExtraMultipleList } from '../../helpdesk/ticketService';
import {
  getActiveTab,
  getAllowedCompanies,
  getDynamicTabs,
  getHeaderTabs,
  getMenuItems,
  getTabs,
} from '../../util/appUtils';
import {
  attendanceReportFilters,
  resetExportLink,
  resetCteateExport,
} from '../attendanceService';
import ReportsSelect from './reportSelect';
import reports from './reports.json';

import ReportsFilterHeader from '../../commonComponents/reportsFilterHeader';
import { updateHeaderData } from '../../core/header/actions';
import attendenceNav from '../navbar/navList.json';

const appModels = require('../../util/appModels').default;

const ReportsView = () => {
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [collapse, setCollapse] = useState(false);

  const [globalType, setGlobalType] = useState('');
  const [globalVendor, setGlobalVendor] = useState('');

  const [empDates, setEmpdates] = useState([]);
  const [employees, setEmployees] = useState([]);

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const { exportLinkInfo, attendanceReportFiltersInfo } = useSelector((state) => state.attendance);
  const menuList = getMenuItems(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Attendance Logs', 'name');
  const reportList = reports.reportList.filter((rp) => { if (menuList.includes(rp.name)) return rp; });

  const [report, setReport] = useState(reportList && reportList.length && reportList.length === 1 ? reportList[0] : '');
  const [filterOpen, setFilterOpen] = useState(false);
  const [exportType, setExportType] = useState('');
  const [exportTrue, setExportTrue] = useState('');
  const [resetFilters, setResetFilters] = useState(false);
  const companies = getAllowedCompanies(userInfo);

  useEffect(() => {
    dispatch(attendanceReportFilters([]));
    dispatch(resetCteateExport());
    dispatch(resetExportLink());
  }, [report]);

  const onReset = () => {
    setResetFilters(true);
    if (report.name === 'Monthly Attendance Details' || report.name === 'Form XXVI' || report.name === 'Daily Attendance Details' || report.name === 'Monthly Biometric') {
      dispatch(resetCteateExport());
      dispatch(resetExportLink());
      dispatch(attendanceReportFilters([]));
    }
  };

  const showExportButton = () => {
    if (report.name === 'Monthly Attendance Details' || report.name === 'Form XXVI' || report.name === 'Daily Attendance Details' || report.name === 'Monthly Biometric' || report && report.name === 'Employee wise biometric report') {
      return !!(exportLinkInfo && exportLinkInfo.data && exportLinkInfo.data.length);
    }
  };

  const showReset = () => {
    if (report.name === 'Monthly Attendance Details' || report.name === 'Form XXVI' || report.name === 'Daily Attendance Details' || report.name === 'Monthly Biometric' || report && report.name === 'Employee wise biometric report') {
      return !!(attendanceReportFiltersInfo && attendanceReportFiltersInfo.customFilters && attendanceReportFiltersInfo.customFilters.length);
    }
  };

  const headerTabs = getHeaderTabs(
    userRoles?.data?.allowed_modules,
    'Attendance Logs',
  );

  let activeTab;
  let tabs;

  if (headerTabs) {
    tabs = getTabs(headerTabs[0].menu, attendenceNav.data);
    activeTab = getActiveTab(
      tabs.filter((e) => e),
      'Reports',
    );
  }

  useEffect(() => {
    dispatch(
      updateHeaderData({
        module: 'Attendance Logs',
        moduleName: 'Attendance Logs',
        menuName: 'Reports',
        link: '/attendance/reports',
        headerTabs: tabs.filter((e) => e),
        activeTab,
      }),
    );
  }, [activeTab]);

  return (
    <>
      <ReportsFilterHeader
        Module="Attendance Logs"
        Menu="Reports"
        Link="/attendance-overview/reports"
        HeaderData={attendenceNav.data}
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
        excelOnly
      />

      {report && (report.name === 'Monthly Attendance Details' || report.name === 'Form XXVI' || report.name === 'Daily Attendance Details' || report.name === 'Monthly Biometric') && (
        <MonthlyAttendance
          filterOpen={filterOpen}
          setFilterOpen={setFilterOpen}
          resetFilters={resetFilters}
          setResetFilters={setResetFilters}
          afterReset={() => { setReport(''); }}
          reportName={report.name}
          exportType={exportType}
          exportTrue={exportTrue}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}          
        />
      )}
      {(report && report.name === 'Employee wise biometric report') && (
      <EmployeeBioMetric
        setEmpdates={setEmpdates}
        setEmployees={setEmployees}
        empDates={empDates}
        employees={employees}
        filterOpen={filterOpen}
        setFilterOpen={setFilterOpen}
        resetFilters={resetFilters}
        setResetFilters={setResetFilters}
        afterReset={() => { setReport(''); }}
        reportName={report.name}
        exportType={exportType}
        exportTrue={exportTrue}        
      />
      )}
      {(!report || (report && !report.name)) && (
        <ReportsSelect />
      )}
      {report && report.name && (
      <ReportDownload
        collapse={collapse}
        afterReset={() => { setReport(''); }}
        reportName={report.name}
        exportType={exportType}
        exportTrue={exportTrue}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        globalVendor={globalVendor}
        setGlobalVendor={setGlobalVendor}
        globalType={globalType}
        setGlobalType={setGlobalType}
        setEmpdates={setEmpdates}
        setEmployees={setEmployees}
        empDates={empDates}
        employees={employees}
      />
      )}
    </>

  );
};
export default ReportsView;
