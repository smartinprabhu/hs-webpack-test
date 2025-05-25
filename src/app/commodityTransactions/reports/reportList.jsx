/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import TransactionSideFilters from './reportList/sidebar/transactionSideFilters';
import ReportsSelect from './reportList/reportSelect';
import TransactionReport from './reportList/transactionReport';
import reports from './reports.json';
import {
  getSelectedReportDate,
} from '../../preventiveMaintenance/ppmService';
import {
  getCompanyTimezoneDate, getMenuItems,
} from '../../util/appUtils';
import ReportsFilterHeader from '../../commonComponents/reportsFilterHeader';
import CommodityNav from '../navbar/navlist.json';
import DataExport from '../dataExport/dataExport';
import { setInitialValues } from '../../purchase/purchaseService';

const reportList = () => {
  const dispatch = useDispatch();
  const [collapse, setCollapse] = useState(false);
  const [selectedReport, setSelectedReport] = useState('');
  const [filtersIcon, setFilterIcon] = useState(false);
  const [currentLocation, setCurrentLocation] = useState();
  const { locationId } = useSelector((state) => state.ppm);
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const {
    reportTankerInfo,
  } = useSelector((state) => state.tanker);
  const menuList = getMenuItems(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Commodity Transactions', 'name');

  useEffect(() => {
    setCurrentLocation();
  }, [locationId]);

  useEffect(() => {
    if (currentLocation && currentLocation !== 1) {
      const companyTimezoneDate = getCompanyTimezoneDate(new Date(), userInfo, 'monthyear');
      dispatch(getSelectedReportDate(companyTimezoneDate));
    }
  }, [currentLocation]);

  const reportData = reports.reportList;
  const [exportType, setExportType] = useState('');
  const [exportTrue, setExportTrue] = useState('');
  const [resetFilters, setResetFilters] = useState(false);
  const [showResetOption, setShowResetOption] = useState(false);
  const [report, setReport] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);

  const showExportButton = () => {

    if (report && report.name === 'Transaction Report') {
      return !!(reportTankerInfo && reportTankerInfo.data && reportTankerInfo.data.length);
    }
  };

  const showReset = () => {
    return showResetOption
  }
  
  const onReset = () => {
    setResetFilters(true)
  }

  return (
    <>
      <ReportsFilterHeader
        Module="Commodity Transactions"
        Menu="Reports"
        Link="/commodity/reports"
        HeaderData={CommodityNav.data}
        reportOptions={reportData}
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

      {report?.name === 'Transaction Report' && (
        <TransactionSideFilters
          filterOpen={filterOpen}
          setFilterOpen={setFilterOpen}
          resetFilters={resetFilters}
          setResetFilters={setResetFilters}
          setShowResetOption={setShowResetOption}
        />
      )}
      <div />
      {!report && (
        <ReportsSelect collapse={collapse} />
      )}
      {report?.name === 'Transaction Report' && (
        <TransactionReport activeFilter={resetFilters} collapse={collapse} afterReset={() => { setSelectedReport(''); }} reportName={report.name} />
      )}
      {report?.name === 'Transaction Report' && reportTankerInfo?.data && (
        <DataExport
          afterReset={() => dispatch(setInitialValues(false, false, false, false))}
          tankerTransactionsExport={reportTankerInfo}
          exportType={exportType}
          setExportTrue={setExportTrue}
          exportTrue={exportTrue}
          fields={['id', 'commodity', 'capacity', 'vendor_id', 'initial_reading', 'final_reading', 'difference', 'tanker_id', 'sequence', 'location_id' , 'in_datetime' ,'out_datetime', 'amount', 'delivery_challan', 'driver', 'driver_contact', 'remark']}
        />
      )}
    </>
  );
};

export default reportList;
