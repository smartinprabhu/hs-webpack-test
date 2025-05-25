/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/* eslint-disable import/no-unresolved */
/* eslint-disable radix */
import React, { useState } from 'react';
import * as PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/system';

import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';
import DataExport from '../dataExport/dataExport';
import CommonGrid from '../../../commonComponents/commonGrid';
import { InboundMailReportColumns } from '../../../commonComponents/gridColumns';
import {
  generateErrorMessage, getListOfModuleOperations, getDefaultNoValue, extractNameObject, getCompanyTimezoneDateLocal, getCompanyTimezoneDate,
} from '../../../util/appUtils';
import {
  getReportId, getTypeId,
} from '../../../preventiveMaintenance/ppmService';
import { setInitialValues } from '../../../purchase/purchaseService';
import {
  resetMailRoomReport,
} from '../../mailService';
import actionCodes from '../data/actionCodes.json';

const InBoundReport = (props) => {
  const {
    afterReset, reportName,
    selectedDate, setSelectedDate,
    exportType, exportTrue, setExportType,
  } = props;
  const dispatch = useDispatch();
  const {
    reportMailRoomInfo,
  } = useSelector((state) => state.mailroom);

  const limit = 10;
  const [currentPage, setPage] = useState(0);

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const {
    typeId,
  } = useSelector((state) => state.ppm);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Mail Room Management', 'code');

  const isExportable = allowedOperations.includes(actionCodes['Inbound Report']);

  const redirectToAllReports = () => {
    dispatch(getReportId());
    dispatch(resetMailRoomReport());
    dispatch(getTypeId());
    if (afterReset) afterReset();
  };

  function getRow(roomData) {
    const tableTr = [];
    if (roomData && roomData.length > 0) {
      // eslint-disable-next-line array-callback-return
      roomData.map((rp) => {
        tableTr.push(
          <tr key={rp.id}>
            <td className="p-2">
              {' '}
              {getDefaultNoValue(rp.sender)}
            </td>
            <td className="p-2">
              {' '}
              {getDefaultNoValue(extractNameObject(rp.employee_id, 'name'))}
            </td>
            <td className="p-2">
              {' '}
              {getDefaultNoValue(rp.state)}
            </td>
            <td className="p-2">
              {' '}
              {getDefaultNoValue(extractNameObject(rp.courier_id, 'name'))}
            </td>
            <td className="p-2">
              {' '}
              {getDefaultNoValue(rp.tracking_no)}
            </td>
            <td className="p-2">
              {' '}
              {getDefaultNoValue(rp.parcel_dimensions)}
            </td>
            <td className="p-2">
              {' '}
              {getDefaultNoValue(rp.notes)}
            </td>
            <td className="p-2">
              {' '}
              {getDefaultNoValue(getCompanyTimezoneDate(rp.received_on, userInfo, 'datetime'))}
            </td>
            <td className="p-2">
              {' '}
              {getDefaultNoValue(extractNameObject(rp.received_by, 'name'))}
            </td>
            <td className="p-2">
              {' '}
              {getDefaultNoValue(getCompanyTimezoneDate(rp.collected_on, userInfo, 'datetime'))}
            </td>
            <td className="p-2">
              {' '}
              {getDefaultNoValue(extractNameObject(rp.collected_by, 'name'))}
            </td>
          </tr>,
        );
      });
    }
    return tableTr;
  }

  const handlePageClick = (e, index) => {
    e.preventDefault();
    setPage(index);
  };

  const mailRoomData = reportMailRoomInfo && reportMailRoomInfo.data && reportMailRoomInfo.data.length ? reportMailRoomInfo.data : [];

  const loading = (userInfo && userInfo.loading) || (reportMailRoomInfo && reportMailRoomInfo.loading);

  let errorText = <div />;
  if (!loading
    && ((reportMailRoomInfo && reportMailRoomInfo.err) || (reportMailRoomInfo && reportMailRoomInfo.data && !reportMailRoomInfo.data.length))) {
    errorText = '';
  } else if (!loading && typeId && !typeId.date) {
    errorText = (
      <ErrorContent errorTxt="PLEASE SELECT REGISTERED ON" />
    );
  }
  const isError = !!(reportMailRoomInfo && reportMailRoomInfo.data && reportMailRoomInfo.data.length <= 0);

  return (
    <Box sx={{ fontFeatureSettings: 'Suisse Intl', position: 'sticky' }}>
      <Box sx={{ backgroundColor: '#fff', borderLeft: '1px solid #0000001f', padding: '10px 0px 10px 18px' }}>
        <div className="content-inline">
          <span className="p-0 mr-2 font-medium">
            {(typeId && typeId.date && typeId.date.length > 0 && typeId.date[0])
                && (
                  <span className={reportName ? 'font-weight-800 font-size-13' : 'font-weight-800'}>
                    Report Date :
                    {' '}
                    {getCompanyTimezoneDateLocal(typeId.date[0], userInfo, 'date')}
                    {' '}
                    -
                    {' '}
                    {getCompanyTimezoneDateLocal(typeId.date[1], userInfo, 'date')}
                  </span>
                )}
          </span>
        </div>
        {(!loading && mailRoomData && mailRoomData.length > 0) && (
        <div className="mt-2">

          <span className="font-weight-800 mr-1 font-family-tab">Filters :  </span>
          <span className="font-weight-500" />
          <span className="font-weight-600 mr-1 font-family-tab">Status :</span>
          <span className="font-weight-50 font-family-tab0">
            {typeId && typeId.statusValue && typeId.statusValue.length > 0
              ? (typeId.statusValue.map((pd) => (
                <span>
                  {pd.label}
                  ,
                </span>
              ))) : 'All,'}
          </span>
          <span className="font-weight-600 mr-1 font-family-tab">Employee :</span>
          <span className="font-weight-500 font-family-tab">
            {typeId && typeId.employeeValue && typeId.employeeValue.length > 0
              ? (typeId.employeeValue.map((pd) => (
                <span>
                  {pd.name}
                  ,
                </span>
              ))) : 'All,'}
          </span>

          <span className="font-weight-600 mr-1 font-family-tab">Courier Name :</span>
          <span className="font-weight-500 font-family-tab">
            {typeId && typeId.courierValue && typeId.courierValue.length > 0
              ? (typeId.courierValue.map((pd) => (
                <span>
                  {pd.name}
                  ,
                </span>
              ))) : 'All,'}
          </span>
          <span className="font-weight-600 mr-1 font-family-tab">Department :</span>
          <span className="font-weight-500 font-family-tab">
            {' '}
            {typeId && typeId.departmentValue && typeId.departmentValue.length > 0
              ? (typeId.departmentValue.map((pd) => (
                <span>
                  {pd.name}
                  ,
                </span>
              ))) : 'All'}
          </span>
        </div>
        )}
      </Box>

      {loading && (
        <div className="mb-3 mt-3 text-center">
          <Loader />
        </div>
      )}
      {(reportMailRoomInfo && reportMailRoomInfo.err) && (
      <ErrorContent errorTxt={generateErrorMessage(reportMailRoomInfo)} />
      )}
      {(isError) && (
      <ErrorContent errorTxt="No Data Found" />
      )}
      {errorText}
      {!loading && mailRoomData && mailRoomData.length && mailRoomData.length > 0
        ? (

          <CommonGrid
            className="reports-table font-family-tab"
            componentClassName="commonGrid"
            tableData={mailRoomData}
            page={currentPage}
            columns={InboundMailReportColumns()}
            limit={limit}
            checkboxSelection
            rowCount={mailRoomData.length}
            disableRowSelectionOnClick
            exportFileName="Mail Room Inbound Report"
            listCount={mailRoomData.length}
            loading={reportMailRoomInfo && reportMailRoomInfo.loading}
            err={reportMailRoomInfo && reportMailRoomInfo.err}
            noHeader
            disableFilters
            disablePagination
            handlePageChange={handlePageClick}
            leftPinnedColumns={[]}
            disableShowAllButton
          />

        )
        : ''}

      <DataExport
        afterReset={() => dispatch(setInitialValues(false, false, false, false))}
        assetsList={mailRoomData}
        exportType={exportType}
        exportTrue={exportTrue}
        setExportType={setExportType}
        isOutbound={false}
      />
    </Box>
  );
};

InBoundReport.propTypes = {
  afterReset: PropTypes.func.isRequired,
  reportName: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
};

export default InBoundReport;
