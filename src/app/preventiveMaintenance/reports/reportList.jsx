/* eslint-disable max-len */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import * as PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment-timezone';
import Alert from '@mui/material/Alert';

import {
  getLocationsInfo, getLocationId, getSelectedReportDate, resetDmrReport,
  getLastUpdate, resetPPMYearlyExportLinkInfo,
} from '../ppmService';

import DMRSideFilters from './reportList/sidebar/sideFiltersDmr';
import SideFilterSmart from './reportList/sidebar/sideFiltersSmartLogger';
import SideFiltersPreventive from './reportList/sidebar/sideFilterPreventiveReport';
import SideFilterChecklist from './reportList/sidebar/sideFilterChecklist';
import SideFilterPPMStatus from './reportList/sidebar/sideFilterPPMStatus';
import SideFilterEmployeeChecklist from './reportList/sidebar/sideFilterEmployeeChecklist';

import {
  getAllowedCompanies, getMenuItems,
  getListOfModuleOperations, getCompanyTimezoneDate,
} from '../../util/appUtils';
import ReportsDmr from './reportList/reportDmr';
import ReportsListExcelView from './reportList/reportListExcelView';
import ReportsListSmartLogger from './reportList/reportSmartLogger';
import ReportsSelect from './reportList/reportSelect';
import ReportsChecklistNew from './reportList/reportChecklistNew';
import ReportsPPMStatus from './reportList/reportsPPMStatus';
import ReportChecklistEmployee from './reportList/reportChecklistEmployee';
import SideFilterVendorReport from './reportList/sidebar/sideFilterVendorReport';
import ReportsVendorPPM from './reportList/reportsVendorPPM';
import reportsData from './reports.json';

import ReportsFilterHeader from '../../commonComponents/reportsFilterHeader';
import PPMSideNav from '../navbar/navlist.json';
import inspectionNav from '../../inspectionSchedule/navbar/navlist.json';
import actionCodes from './data/actionCodes.json';
import ReportsYearlyPPM from './reportList/reportsYearlyPPM';
import SideFilterYearlyPPM from './reportList/sidebar/sideFilterYearlyPPM';

const appModels = require('../../util/appModels').default;

const reportList = (props) => {
  const { isInspection } = props;
  const dispatch = useDispatch();
  const [collapse, setCollapse] = useState(false);
  const [currentLocation, setCurrentLocation] = useState();
  const [selectedReport, setSelectedReport] = useState('');
  const [selectedApiReport, setSelectedApiReport] = useState('');
  const [showObservations, setShowObservations] = useState(false);
  const [selectedDate, setSelectedDate] = useState('%(today)s');
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const { locations, locationId, typeId } = useSelector((state) => state.ppm);
  const companies = getAllowedCompanies(userInfo);
  const [filtersIcon, setFilterIcon] = useState(false);

  const reportData = isInspection ? reportsData.reportListInsp : reportsData.reportList;

  const moduleName = isInspection ? 'Inspection Schedule' : '52 Week PPM';
  const menuList = getMenuItems(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], moduleName, 'name');
  const {
    inspectionEmployees, ppmStatusInfo, ppmYearlyExport, ppmVendorInfo, inspectionOrders, ppmReports, reports, warehouseLastUpdate,
  } = useSelector((state) => state.ppm);

  const lastUpdateTime = warehouseLastUpdate && warehouseLastUpdate.data && warehouseLastUpdate.data.length && warehouseLastUpdate.data[0].last_updated_at ? warehouseLastUpdate.data[0].last_updated_at : false;

  useEffect(() => {
    if (userInfo && userInfo.data && userInfo.data.company) {
      dispatch(getLocationsInfo(companies, appModels.TEMPLATEREPORT));
    }
  }, [userInfo]);

  useEffect(() => {
    setCurrentLocation();
  }, [locationId]);

  useEffect(() => {
    if (typeId && typeId.type) {
      setSelectedReport('Inspection Checklist Report');
    }
  }, [typeId]);

  useEffect(() => {
    dispatch(getLastUpdate(isInspection ? appModels.INSPECTIONCHECKLISTLOGS : appModels.PPMWEEK));
  }, [selectedReport]);

  const [tableHeaders, setTableHeaders] = useState([
    {
      headerName: 'Question Group',
      valueKey: 'question_group',
      static: false,
      isChecked: false,
    },
    {
      headerName: 'Observations',
      valueKey: 'observations',
      static: false,
      isChecked: false,
    },

  ]);

  useEffect(() => {
    if (currentLocation && currentLocation === 1 && userInfo && userInfo.data && userInfo.data.company && locations && locations.data) {
      dispatch(getLocationId(locations.data[0]));
      if (userInfo.data.timezone) {
        const companyTimezoneDate = moment.utc(new Date()).tz(userInfo.data.timezone).format('YYYY-MM-DD');
        dispatch(getSelectedReportDate(companyTimezoneDate));
      } else {
        const companyTimezoneDate = moment.utc(new Date()).format('YYYY-MM-DD');
        dispatch(getSelectedReportDate(companyTimezoneDate));
      }
    }
  }, [currentLocation]);


  const reportListFinal = reportData.filter((rp) => { if (menuList.includes(rp.name)) return rp; });

  const [report, setReport] = useState(reportListFinal && reportListFinal.length && reportListFinal.length === 1 ? reportListFinal[0] : '');
  const [filterOpen, setFilterOpen] = useState(false);
  const [exportType, setExportType] = useState('');
  const [exportTrue, setExportTrue] = useState('');
  const [resetFilters, setResetFilters] = useState(false);
  const [showResetOption, setShowResetOption] = useState(false);

  const showReset = () => showResetOption;

  
  useEffect(() => {
    if (report) {
     dispatch(resetPPMYearlyExportLinkInfo());
    }
  }, [report]);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], '52 Week PPM', 'code');

  const isExportable = allowedOperations.includes(actionCodes['PPM Vendor Report Export']);

  const showExportButton = () => {
    if (report && report.name === 'DMR Report') {
      return !!(reports && reports.data && reports.data.length);
    }
    if (report && report.name === 'Smart Logger Report') {
      return !!(ppmReports && ppmReports.data && ppmReports.data.length);
    }
    if (report && report.name === 'PPM Report') {
      return !!(ppmReports && ppmReports.data && ppmReports.data.length);
    }
    if (report && report.name === 'Inspection Checklist Report') {
      const isError = inspectionOrders && inspectionOrders.data ? !inspectionOrders.data.status : false;
      return !!(inspectionOrders && inspectionOrders.data && inspectionOrders.data.length && !isError);
    }
    if (report && report.name === 'Inspections by Employee Report') {
      const isError = inspectionEmployees && inspectionEmployees.data ? !inspectionEmployees.data.status : false;
      return !!(inspectionEmployees && inspectionEmployees.data && inspectionEmployees.data.length && !isError);
    }
    if (report && report.name === 'PPM Checklist Report') {
      return !!(ppmStatusInfo && ppmStatusInfo.data && ppmStatusInfo.data.length);
    }
    if (report && report.name === 'PPM Scheduler Report') {
      return !!(isExportable && ppmVendorInfo && ppmVendorInfo.data && ppmVendorInfo.data.length);
    }
    if (report && report.name === 'PPM Yearly Report') {
      return !!(ppmYearlyExport && ppmYearlyExport.data && ppmYearlyExport.data.url);
    }
  };

  const onReset = () => {
    setResetFilters(true);
  };

  const [customDownload, setCustomDownload] = useState('');
  return (
    <>
      <Alert severity="info">
        Last Updated at:
        {'  '}
        {lastUpdateTime ? getCompanyTimezoneDate(lastUpdateTime, userInfo, 'datetime') : 'N/A'}
      </Alert>
      <ReportsFilterHeader
        Module={moduleName}
        Menu="Reports"
        Link="inspection-overview/inspection/reports"
        HeaderData={isInspection ? inspectionNav.data : PPMSideNav.data}
        reportOptions={reportListFinal}
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
        customDownload={customDownload}
        setCustomDownload={setCustomDownload}
        excelOnly={report && (report.name === 'PPM Report' || report.name === 'PPM Scheduler Report' || report.name === 'Inspection Checklist Report' || report.name === 'PPM Yearly Report')}
        showExportButton={showExportButton}
      />
      {report && report.name === 'DMR Report' && (
        <DMRSideFilters
          apiReportName={selectedApiReport}
          filterOpen={filterOpen}
          setFilterOpen={setFilterOpen}
          resetFilters={resetFilters}
          setResetFilters={setResetFilters}
          setShowResetOption={setShowResetOption}
        />
      )}
      {report && report.name === 'Smart Logger Report' && (
        <SideFilterSmart
          apiReportName={selectedApiReport}
          filterOpen={filterOpen}
          setFilterOpen={setFilterOpen}
          resetFilters={resetFilters}
          setResetFilters={setResetFilters}
          setShowResetOption={setShowResetOption}
        />
      )}
      {report && report.name === 'Inspections by Employee Report' && (
        <SideFilterEmployeeChecklist
          filterOpen={filterOpen}
          setFilterOpen={setFilterOpen}
          resetFilters={resetFilters}
          setResetFilters={setResetFilters}
          setShowResetOption={setShowResetOption}
        />
      )}
      {report && report.name === 'PPM Report' && (
        <SideFiltersPreventive
          apiReportName={report.apiname}
          filterOpen={filterOpen}
          setFilterOpen={setFilterOpen}
          resetFilters={resetFilters}
          setResetFilters={setResetFilters}
          setShowResetOption={setShowResetOption}
        />
      )}
      {report && report.name === 'Inspection Checklist Report' && (
        <SideFilterChecklist
          showObservations={showObservations}
          setShowObservations={setShowObservations}
          tableHeaders={tableHeaders}
          setTableHeaders={setTableHeaders}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          filterOpen={filterOpen}
          setFilterOpen={setFilterOpen}
          resetFilters={resetFilters}
          setResetFilters={setResetFilters}
          setShowResetOption={setShowResetOption}
        />
      )}
      {report && report.name === 'PPM Checklist Report' && (
        <SideFilterPPMStatus
          filterOpen={filterOpen}
          setFilterOpen={setFilterOpen}
          resetFilters={resetFilters}
          setResetFilters={setResetFilters}
          setShowResetOption={setShowResetOption}
        />
      )}
      {report && report.name === 'PPM Scheduler Report' && (
        <SideFilterVendorReport
          filterOpen={filterOpen}
          setFilterOpen={setFilterOpen}
          resetFilters={resetFilters}
          setResetFilters={setResetFilters}
          setShowResetOption={setShowResetOption}
        />
      )}
      {report && report.name === 'PPM Yearly Report' && (
        <SideFilterYearlyPPM
          filterOpen={filterOpen}
          setFilterOpen={setFilterOpen}
          resetFilters={resetFilters}
          setResetFilters={setResetFilters}
          setShowResetOption={setShowResetOption}
        />
      )}
      {(!report || (report && !report.name)) && (
        <ReportsSelect />
      )}
      {report && report.name === 'DMR Report' && (
        <ReportsDmr collapse={collapse} afterReset={() => { setSelectedReport(''); setSelectedApiReport(''); dispatch(resetDmrReport()); }} reportName={selectedReport} />
      )}
      {report && report.name === '' && (
        <ReportsSelect collapse={collapse} />
      )}
      {report && report.name === 'Smart Logger Report' && (
        <ReportsListSmartLogger
          collapse={collapse}
          moduleName="inspection"
          afterReset={() => { setSelectedReport(''); setSelectedApiReport(''); }}
          reportName={report.name}
          exportType={exportType}
          exportTrue={exportTrue}
          setExportType={setExportType}
        />
      )}
      {report && report.name === 'PPM Report' && (
        <ReportsListExcelView
          collapse={collapse}
          moduleName="ppm"
          afterReset={() => { setSelectedReport(''); setSelectedApiReport(''); }}
          reportName={report.name}
          exportType={exportType}
          exportTrue={exportTrue}
          setExportType={setExportType}
          setCustomDownload={setCustomDownload}
        />
      )}
      {report && report.name === 'Inspection Checklist Report' && (
        <ReportsChecklistNew
          tableHeaders={tableHeaders}
          collapse={collapse}
          afterReset={() => { setSelectedReport(''); setSelectedApiReport(''); }}
          reportName={report.name}
          showObservations={showObservations}
          setShowObservations={setShowObservations}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          exportType={exportType}
          exportTrue={exportTrue}
          setResetFilters={setResetFilters}
          setExportTrue={setExportTrue}
          setExportType={setExportType}
        />
      )}
      {report && report.name === 'Inspections by Employee Report' && (
        <ReportChecklistEmployee
          collapse={collapse}
          afterReset={() => { setSelectedReport(''); setSelectedApiReport(''); }}
          reportName={report.name}
          exportType={exportType}
          exportTrue={exportTrue}
          setExportType={setExportType}
        />
      )}
      {report && report.name === 'PPM Checklist Report' && (
        <ReportsPPMStatus
          collapse={collapse}
          afterReset={() => { setSelectedReport(''); setSelectedApiReport(''); }}
          reportName={report.name}
          exportType={exportType}
          exportTrue={exportTrue}
          setResetFilters={setResetFilters}
          setExportType={setExportType}
          setExportTrue={setExportTrue}
        />
      )}
      {report && report.name === 'PPM Scheduler Report' && (
      <ReportsVendorPPM
        collapse={collapse}
        afterReset={() => { setSelectedReport(''); setSelectedApiReport(''); }}
        reportName={report.name}
        exportType={exportType}
        exportTrue={exportTrue}
        setExportType={setExportType}
      />
      )}
      {report && report.name === 'PPM Yearly Report' && (
      <ReportsYearlyPPM
        collapse={collapse}
        afterReset={() => { setSelectedReport(''); setSelectedApiReport(''); }}
        reportName={report.name}
        exportType={exportType}
        exportTrue={exportTrue}
        setExportType={setExportType}
      />
      )}

    </>
  );
};

reportList.propTypes = {
  collapse: PropTypes.bool,
  isInspection: PropTypes.bool,
};
reportList.defaultProps = {
  collapse: false,
  isInspection: false,
};

export default reportList;
