/* eslint-disable max-len */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect, useMemo } from 'react';
import * as PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

// import {
//   getLocationsInfo, getLocationId, getSelectedReportDate, resetDmrReport,
// } from '../ppmService';

import FilterConsumptionReport from './reports/ReportList/consumptionReportSideFilter';
import FilterConsumptionDetailReport from './reports/ReportList/consumptionDetailReportSideFilter';
import InventoryOverviewSideFilter from './reports/ReportList/inventoryOverviewSideFilter';
import {
  getInventorySettingDetails,
} from '../siteOnboarding/siteService';
import {
  getAllowedCompanies,
} from '../util/appUtils';
import ConsumptionReport from './reports/consumptionReport';
import InventoryOverviewReport from './reports/inventoryOverviewReport';
import ConsumptionDetailReport from './reports/consumptionDetailReport';
import ReportsSelect from './reportSelect';
import reports from './reportsList.json';
import ReportsFilterHeader from '../commonComponents/reportsFilterHeader';
import inventoryNav from './inventoryNavbar/navlist.json';
import {
  getTypeId,
} from '../preventiveMaintenance/ppmService';

const appModels = require('../util/appModels').default;

const reportList = (props) => {
  const limit = 20;
  const dispatch = useDispatch();
  const [collapse, setCollapse] = useState(false);
  const [currentLocation, setCurrentLocation] = useState();
  const [selectedReport, setSelectedReport] = useState('');
  const [currentPage, setPage] = useState(0);
  const [offset, setOffset] = useState(0);
  const [selectedApiReport, setSelectedApiReport] = useState('');
  const [showObservations, setShowObservations] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [isShowArc, setShowArc] = useState(false);

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const menuList = ['Transfers Report - Summary', 'Transfers Report - Detail', 'Inventory Overview'];
  const reportListData = reports.tabsList.filter((rp) => { if (menuList.includes(rp.name)) return rp; });

  const [report, setReport] = useState(reportListData && reportListData.length && reportListData.length === 1 ? reportListData[0] : '');
  const [filterOpen, setFilterOpen] = useState(false);
  const [exportType, setExportType] = useState('');
  const [showExport, setShowExport2] = useState(false);
  const [exportTrue, setExportTrue] = useState('');
  const [resetFilters, setResetFilters] = useState(false);
  const [showResetOption, setShowResetOption] = useState(false);

  const { locations, locationId, typeId } = useSelector((state) => state.ppm);
  const companies = getAllowedCompanies(userInfo);
  const [filtersIcon, setFilterIcon] = useState(false);
  const {
    consumptionSummary, inwardDetailSummary, consumptionDetailSummary, inwardSummary, inventoryOverview,
  } = useSelector((state) => state.inventory);

  const reportData = reports.tabsList;

  const moduleName = 'Inventory';
  // const menuList = getMenuItems(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], moduleName, 'name');

  //   useEffect(() => {
  //     if (userInfo && userInfo.data && userInfo.data.company) {
  //       dispatch(getLocationsInfo(companies, appModels.TEMPLATEREPORT));
  //     }
  //   }, [userInfo]);

  const showExportButton = () => {
    if (report && report.name === 'Transfers Report - Summary') {
      const isData = consumptionSummary && consumptionSummary.data && consumptionSummary.data.data ? consumptionSummary.data.data : false;
      const isNoData = !!((isData && isData.headers && isData.headers.length > 0 && isData.stock_details && isData.stock_details.length > 0));
      const isError = consumptionSummary && consumptionSummary.data ? !consumptionSummary.data.status : false;
      return !!(consumptionSummary && consumptionSummary.data && consumptionSummary.data.length && isNoData && !isError);
    }
    if (report && report.name === 'Transfers Report - Detail') {
      const isData = consumptionDetailSummary && consumptionDetailSummary.data && consumptionDetailSummary.data.data ? consumptionDetailSummary.data.data : false;
      const isNoData = !!((isData && isData.headers && isData.headers.length > 0 && isData.stock_details && isData.stock_details.length > 0));
      const isError = consumptionDetailSummary && consumptionDetailSummary.data ? !consumptionDetailSummary.data.status : false;
      return !!(consumptionDetailSummary && consumptionDetailSummary.data && consumptionDetailSummary.data.length && isNoData && !isError);
    }
    if (report && report.name === 'Inventory Overview') {
      const isData = inventoryOverview && inventoryOverview.data && inventoryOverview.data.data ? inventoryOverview.data.data : false;
      const isNoData = !!((isData && isData.headers && isData.headers.length > 0 && isData.stock_details && isData.stock_details.length > 0));
      const isError = inventoryOverview && inventoryOverview.data ? !inventoryOverview.data.status : false;
      return !!(inventoryOverview && inventoryOverview.data && inventoryOverview.data.length);
    }
  };

  useMemo(() => {
    if (userInfo && userInfo.data && userInfo.data.company) {
      dispatch(getInventorySettingDetails(userInfo.data.company.id, appModels.INVENTORYCONFIG));
    }
  }, [userInfo]);

  useEffect(() => {
    setCurrentLocation();
  }, [locationId]);

  const [tableHeaders, setTableHeaders] = useState([
    {
      headerName: '#',
      valueKey: '',
      static: true,
      isChecked: true,
    },
    {
      headerName: 'Question Group',
      valueKey: 'qestion_group',
      static: false,
      isChecked: false,
    },
    {
      headerName: 'Checklist',
      valueKey: 'qestion',
      static: true,
      isChecked: true,
    },
    {
      headerName: 'Observations',
      valueKey: 'expected',
      static: false,
      isChecked: false,
    },

  ]);

  //   useEffect(() => {
  //     if (currentLocation && currentLocation === 1 && userInfo && userInfo.data && userInfo.data.company && locations && locations.data) {
  //       dispatch(getLocationId(locations.data[0]));
  //       if (userInfo.data.timezone) {
  //         const companyTimezoneDate = moment.utc(new Date()).tz(userInfo.data.timezone).format('YYYY-MM-DD');
  //         dispatch(getSelectedReportDate(companyTimezoneDate));
  //       } else {
  //         const companyTimezoneDate = moment.utc(new Date()).format('YYYY-MM-DD');
  //         dispatch(getSelectedReportDate(companyTimezoneDate));
  //       }
  //     }
  //   }, [currentLocation]);

  const showReset = () => showResetOption;

  const onReset = () => {
    setResetFilters(true);
  };

  useEffect(() => {
    setOffset(0);
    setPage(0);
    dispatch(getTypeId({
      date: [null, null], productCategoryId: [], vendorId: [], departmentValue: [], productId: [], opType: '',
    }));
    setSelectedDate('');
    setShowResetOption(false);
  }, [report]);

  return (
    <>
      <ReportsFilterHeader
        Module="Inventory"
        Menu="Reports"
        Link="/inventory-overview/inventory/reports"
        HeaderData={inventoryNav.data}
        reportOptions={reportListData}
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
        setShowExport2={setShowExport2}
        setExportTrue={setExportTrue}
        excelOnly={report && (report.name === 'Transfers Report - Detail')}
        showExportButton={showExportButton}
      />

      {report && report.name === 'Transfers Report - Summary' && (
        <FilterConsumptionReport
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
      { /* report && report.name === 'Inward Stock Report - Summary' && (
        <FilterInwardReport
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
      ) */}
      {report && report.name === 'Transfers Report - Detail' && (
        <FilterConsumptionDetailReport
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
      { /* report && report.name === 'Inward Stock Report - Detail' && (
        <FilterInwardDetailReport
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
      ) */ }
      {report && report.name === 'Inventory Overview' && (
        <InventoryOverviewSideFilter
          isShowArc={isShowArc}
          setShowArc={setShowArc}
          showObservations={showObservations}
          setShowObservations={setShowObservations}
          tableHeaders={tableHeaders}
          setTableHeaders={setTableHeaders}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          limit={limit}
          currentPage={currentPage}
          setPage={setPage}
          offset={offset}
          setOffset={setOffset}
          showExport={showExport}
          filterOpen={filterOpen}
          setFilterOpen={setFilterOpen}
          resetFilters={resetFilters}
          setResetFilters={setResetFilters}
          setShowResetOption={setShowResetOption}
        />
      )}
      <div />

      {(!report || (report && !report.name)) && (
        <ReportsSelect
          collapse={collapse}
        />
      )}

      {report && report.name === 'Transfers Report - Summary' && (
        <ConsumptionReport
          tableHeaders={tableHeaders}
          collapse={collapse}
          afterReset={() => { setReport.name(''); setSelectedApiReport(''); }}
          reportName={report.name}
          showObservations={showObservations}
          setShowObservations={setShowObservations}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          exportType={exportType}
          exportTrue={exportTrue}
          setExportType={setExportType}
          setResetFilters={setResetFilters}
          setExportTrue={setExportTrue}
        />
      )}
      { /* report && report.name === 'Inward Stock Report - Summary' && (
        <InwardReport
          tableHeaders={tableHeaders}
          collapse={collapse}
          afterReset={() => { setReport.name(''); setSelectedApiReport(''); }}
          reportName={report.name}
          showObservations={showObservations}
          setShowObservations={setShowObservations}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}

          exportType={exportType}
          exportTrue={exportTrue}
          setExportType={setExportType}
        />
      ) */ }
      {report && report.name === 'Transfers Report - Detail' && (
        <ConsumptionDetailReport
          tableHeaders={tableHeaders}
          collapse={collapse}
          afterReset={() => { setReport.name(''); setSelectedApiReport(''); }}
          reportName={report.name}
          showObservations={showObservations}
          setShowObservations={setShowObservations}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          exportType={exportType}
          exportTrue={exportTrue}
          setExportType={setExportType}
          setResetFilters={setResetFilters}
          setExportTrue={setExportTrue}
        />
      )}
      { /* report && report.name === 'Inward Stock Report - Detail' && (
        <InwardDetailReport
          tableHeaders={tableHeaders}
          collapse={collapse}
          afterReset={() => { setReport.name(''); setSelectedApiReport(''); }}
          reportName={report.name}
          showObservations={showObservations}
          setShowObservations={setShowObservations}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          exportType={exportType}
          exportTrue={exportTrue}
          setExportType={setExportType}
        />
      ) */ }
      {report && report.name === 'Inventory Overview' && (
        <InventoryOverviewReport
          isShowArc={isShowArc}
          tableHeaders={tableHeaders}
          collapse={collapse}
          afterReset={() => { setReport.name(''); setSelectedApiReport(''); }}
          reportName={report.name}
          showObservations={showObservations}
          setShowObservations={setShowObservations}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          limit={limit}
          currentPage={currentPage}
          setPage={setPage}
          offset={offset}
          setOffset={setOffset}
          exportType={exportType}
          exportTrue={exportTrue}
          setExportType={setExportType}
          setResetFilters={setResetFilters}
          setExportTrue={setExportTrue}
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
