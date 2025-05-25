/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ReportsFilterHeader from '../../commonComponents/reportsFilterHeader';
import MailRoomSideFilters from './reportList/sidebar/mailRoomSideFilters';
import ReportsSelect from './reportList/reportSelect';
import InBoundReport from './reportList/inboundReport';
import OutBoundReport from './reportList/outboundReport';
import reports from './reports.json';
import mailNav from '../navbar/navlist.json';
import {
  getSelectedReportDate,
} from '../../preventiveMaintenance/ppmService';
import {
  getCompanyTimezoneDate, getMenuItems,
} from '../../util/appUtils';

const reportList = () => {
  const dispatch = useDispatch();
  const limit = 20;
  const [collapse, setCollapse] = useState(false);
  const [selectedReport, setSelectedReport] = useState('');
  const [filtersIcon, setFilterIcon] = useState(false);
  const [currentLocation, setCurrentLocation] = useState();
  const [selectedDate, setSelectedDate] = useState('');
  const [currentPage, setPage] = useState(0);
  const [offset, setOffset] = useState(0);
  const { locationId } = useSelector((state) => state.ppm);
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const {
    reportMailRoomInfo,
  } = useSelector((state) => state.mailroom);

  const menuList = getMenuItems(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Mail Room Management', 'name');

  const reportListData = reports.reportList.filter((rp) => { if (menuList.includes(rp.name)) return rp; });

  const [report, setReport] = useState(reportListData && reportListData.length && reportListData.length === 1 ? reportListData[0] : '');
  const [filterOpen, setFilterOpen] = useState(false);
  const [exportType, setExportType] = useState('');
  const [showExport, setShowExport2] = useState(false);
  const [exportTrue, setExportTrue] = useState('');
  const [resetFilters, setResetFilters] = useState(false);
  const [showResetOption, setShowResetOption] = useState(false);

  const showExportButton = () => {
    if (report && report.name === 'Inbound Report') {
      const isData = reportMailRoomInfo && reportMailRoomInfo.data && reportMailRoomInfo.data.length ? reportMailRoomInfo.data : false;
      const isNoData = !isData;
      const isError = reportMailRoomInfo && reportMailRoomInfo.err ? reportMailRoomInfo.err : false;
      return !!((reportMailRoomInfo && reportMailRoomInfo.data && reportMailRoomInfo.data.length && !isNoData && !isError));
    }
    if (report && report.name === 'Outbound Report') {
      const isData = reportMailRoomInfo && reportMailRoomInfo.data && reportMailRoomInfo.data.length ? reportMailRoomInfo.data : false;
      const isNoData = !isData;
      const isError = reportMailRoomInfo && reportMailRoomInfo.err ? reportMailRoomInfo.err : false;
      return !!((reportMailRoomInfo && reportMailRoomInfo.data && reportMailRoomInfo.data.length && !isNoData && !isError));
    }
  };

  console.log(showExportButton());

  useEffect(() => {
    setCurrentLocation();
  }, [locationId]);

  useEffect(() => {
    if (currentLocation && currentLocation !== 1) {
      const companyTimezoneDate = getCompanyTimezoneDate(new Date(), userInfo, 'monthyear');
      dispatch(getSelectedReportDate(companyTimezoneDate));
    }
  }, [currentLocation]);

  const showReset = () => showResetOption;

  const onReset = () => {
    setResetFilters(true);
  };

  return (
    <>
      <ReportsFilterHeader
        Module="Mail Room Management"
        Menu="Reports"
        Link="/mailroom/reports"
        HeaderData={mailNav.data}
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
        excelOnly={false}
        showExportButton={showExportButton}
      />

      {report && report.name === 'Inbound Report' && (
      <MailRoomSideFilters
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        isOutbound={false}
        filterOpen={filterOpen}
        setFilterOpen={setFilterOpen}
        resetFilters={resetFilters}
        setResetFilters={setResetFilters}
        setShowResetOption={setShowResetOption}
      />
      )}
      {report && report.name === 'Outbound Report' && (
      <MailRoomSideFilters
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        filterOpen={filterOpen}
        setFilterOpen={setFilterOpen}
        resetFilters={resetFilters}
        setResetFilters={setResetFilters}
        setShowResetOption={setShowResetOption}
        isOutbound
      />
      )}
      <div />

      {(!report || (report && !report.name)) && (
      <ReportsSelect
        collapse={collapse}
      />
      )}
      {report && report.name === 'Inbound Report' && (
        <InBoundReport
          collapse={collapse}
          afterReset={() => { setReport(''); setSelectedReport(''); }}
          reportName={report && report.name}
          isOutbound={false}
          limit={limit}
          currentPage={currentPage}
          setPage={setPage}
          offset={offset}
          setOffset={setOffset}
          exportType={exportType}
          setExportType={setExportType}
          exportTrue={exportTrue}
          filterOpen={filterOpen}
          setFilterOpen={setFilterOpen}
          resetFilters={resetFilters}
          setResetFilters={setResetFilters}
          setShowResetOption={setShowResetOption}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      )}
      {report && report.name === 'Outbound Report' && (
        <OutBoundReport
          collapse={collapse}
          afterReset={() => { setReport(''); setSelectedReport(''); }}
          reportName={report && report.name}
          isOutbound
          limit={limit}
          currentPage={currentPage}
          setPage={setPage}
          offset={offset}
          setOffset={setOffset}
          exportType={exportType}
          setExportType={setExportType}
          exportTrue={exportTrue}
          filterOpen={filterOpen}
          setFilterOpen={setFilterOpen}
          resetFilters={resetFilters}
          setResetFilters={setResetFilters}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          setShowResetOption={setShowResetOption}
        />
      )}
    </>
  );
};

export default reportList;
