/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/* eslint-disable import/no-unresolved */
/* eslint-disable radix */
/* eslint-disable no-unused-vars */
import * as PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
} from '@mui/material';

import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';
import CommonGrid from '../../../commonComponents/commonGrid';
import { CommodityTranscationColumns } from '../../../commonComponents/gridColumns';
import {
  getReportId, getTypeId,
} from '../../../preventiveMaintenance/ppmService';
import {
  generateErrorMessage, getListOfModuleOperations, getCompanyTimezoneDateLocal, getDateAndTimeForDifferentTimeZonesLocal,
} from '../../../util/appUtils';
import {
  getTankerConfig,
  resetTransactionRoomReport,
} from '../../tankerService';
import actionCodes from '../data/actionCodes.json';

const appModels = require('../../../util/appModels').default;

const TransactionReport = (props) => {
  const {
    afterReset, activeFilter,
  } = props;
  const dispatch = useDispatch();
  const limit = 10;
  const [pageData, setPageData] = useState([]);
  const [page, setPage] = useState(0);
  const [visibleColumns, setVisibleColumns] = useState({});
  const {
    reportTankerInfo, tankerConfig,
  } = useSelector((state) => state.tanker);
  const { filterInitailValues } = useSelector((state) => state.purchase);

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const {
    typeId,
  } = useSelector((state) => state.ppm);

  const isVerification = tankerConfig && tankerConfig.data && tankerConfig.data.length ? tankerConfig.data[0].requires_verification : false;

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Commodity Transactions', 'code');

  const isExportable = allowedOperations.includes(actionCodes['Transaction Report']);

  const redirectToAllReports = () => {
    dispatch(getReportId());
    dispatch(resetTransactionRoomReport());
    dispatch(getTypeId());
    if (afterReset) afterReset();
  };

  useMemo(() => {
    if (userInfo && userInfo.data && userInfo.data.company) {
      dispatch(getTankerConfig(userInfo.data.company.id, appModels.TANKERCONFIG));
    }
  }, [userInfo]);

  useEffect(() => {
    if (
      visibleColumns
      && Object.keys(visibleColumns)
      && Object.keys(visibleColumns).length === 0
    ) {
      setVisibleColumns({
        _check_: true,
        ticket_number: true,
      });
    }
  }, [visibleColumns]);

  const transactionData = reportTankerInfo && reportTankerInfo.data && reportTankerInfo.data.length ? reportTankerInfo.data : [];

  const loading = (userInfo && userInfo.loading) || (reportTankerInfo && reportTankerInfo.loading);

  let errorText = <div />;
  if ((!loading)
    && ((reportTankerInfo && reportTankerInfo.err) || (reportTankerInfo && reportTankerInfo.data && !reportTankerInfo.data.length))) {
    errorText = '';
  } else if ((!loading) && typeId && (!typeId.date || typeId.date === null) && typeId.commodityValue && typeId.commodityValue.length === 0 && typeId.vendorValue && typeId.vendorValue.length === 0) {
    errorText = (
      <ErrorContent errorTxt="PLEASE APPLY FILTERS" />
    );
  }
  const isError = !!(reportTankerInfo && reportTankerInfo.data && reportTankerInfo.data.length <= 0);

  const handlePageChange = (page1) => {
    const offsetValue = page1 * limit;
    setPage(page1);
    if (transactionData.length) {
      setPageData(transactionData.slice(offsetValue, (offsetValue + limit)));
    }
  };

  useEffect(() => {
    if (!Array.isArray(transactionData)) return; // Ensure transactionData is valid

    const newPageData = transactionData.length > limit
      ? transactionData.slice(0, limit)
      : transactionData;

    // Only update if the data has changed
    setPageData((prevPageData) => (JSON.stringify(prevPageData) !== JSON.stringify(newPageData)
      ? newPageData
      : prevPageData));
  }, [transactionData, limit]);

  // useEffect(() => {
  //   if (transactionData.length) {
  //     setPageData(transactionData.length ? transactionData.length > 10 ? transactionData.slice(0, 10) : transactionData : [])
  //   } else {
  //     setPageData([])
  //   }
  // }, [transactionData])

  const getdate = (date1) => {
    let start1 = '';
    let end1 = '';
    if (date1 && date1.length && date1[0] && date1[0] !== null) {
      const dateRangeObj1 = getDateAndTimeForDifferentTimeZonesLocal(userInfo, date1[0].$d, date1[1].$d);
      start1 = dateRangeObj1[0];
      end1 = dateRangeObj1[1];

      return `${start1} to ${end1}`;
    }

    return '';
  };

  function filterDataPdfCustom() {
    let filterTxt = '';
    if (typeId?.commodityValue?.length) {
      filterTxt += 'Commodity: ';
      filterTxt += `${typeId.commodityValue.map((c) => c.name).join(', ')} | `;
    }

    if (typeId?.vendorValue?.length) {
      filterTxt += 'Vendor: ';
      filterTxt += `${typeId.vendorValue.map((v) => v.name).join(', ')} | `;
    }
    if (typeId?.date?.length && typeId.date[0] !== null && typeId.date[1] !== null) {
      filterTxt += `In Time: ${getCompanyTimezoneDateLocal(typeId.date[0].$d, userInfo, 'date')} - ${getCompanyTimezoneDateLocal(typeId.date[1].$d, userInfo, 'date')}`;

      if (typeId?.date1?.length && typeId.date1[0] !== null && typeId.date1[1] !== null) {
        filterTxt += ' | ';
      }
    }

    if (typeId?.date1?.length && typeId.date1[0] !== null && typeId.date1[1] !== null) {
      filterTxt += `Out Time: ${getCompanyTimezoneDateLocal(typeId.date1[0].$d, userInfo, 'date')} - ${getCompanyTimezoneDateLocal(typeId.date1[1].$d, userInfo, 'date')}`;
    }
    return filterTxt;
  }

  const customFilters = typeId === null || typeId === '' ? [] : [typeId];

  return (
    <div className="thin-scrollbar">
      {!activeFilter && (customFilters && customFilters.length > 0) && filterDataPdfCustom() !== '' && (
        <Box sx={{ backgroundColor: '#fff', borderLeft: '1px solid #0000001f', padding: '10px 0px 10px 18px' }}>
          <p className="m-0">
            Total Records :
            {' '}
            {transactionData && !loading && transactionData.length > 0 ? transactionData.length : 0}
            {' '}
          </p>
          <table align="center">
            <tbody>
              <tr>
                <td>{filterDataPdfCustom() && (<span>Filters :  </span>)}</td>
                <td colSpan={15}><b>{filterDataPdfCustom()}</b></td>
              </tr>
            </tbody>
          </table>
        </Box>

      )}
      {/* {isExportable
            ? (
              <Col md="1" xs="12" sm="1" lg="1">
                <ExportList response={reportTankerInfo && reportTankerInfo.data && reportTankerInfo.data.length > 0 ? reportTankerInfo && reportTankerInfo.data && reportTankerInfo.data.length : ''}/>
                {reportTankerInfo && reportTankerInfo.data && reportTankerInfo.data.length > 0 && (
                  <Popover placement="bottom" isOpen={filterInitailValues.download} target="Export">
                    <PopoverHeader>
                      Export
                      <img
                        aria-hidden="true"
                        alt="close"
                        src={closeCircleIcon}
                        onClick={() => dispatch(setInitialValues(false, false, false, false))}
                        className="cursor-pointer mr-1 mt-1 float-right"
                      />
                    </PopoverHeader>
                    <PopoverBody>
                      <div className="p-2">
                        <DataExport
                          afterReset={() => dispatch(setInitialValues(false, false, false, false))}
                          assetsList={transactionData}
                          isOutbound={false}
                        />
                      </div>
                    </PopoverBody>
                  </Popover>
                )}
              </Col>
            ) : ''} */}
      {loading && (
        <div className="mb-3 mt-3 text-center">
          <Loader />
        </div>
      )}
      {(reportTankerInfo && reportTankerInfo.err) && (
        <ErrorContent errorTxt={generateErrorMessage(reportTankerInfo)} />
      )}
      {(isError) && (
        <ErrorContent errorTxt="" />
      )}
      {errorText}
      {!loading && transactionData && transactionData.length && transactionData.length > 0
        ? (
          <CommonGrid
            className="reports-table"
            componentClassName="commonGrid"
            tableData={pageData}
            page={page}
            columns={CommodityTranscationColumns('report', isVerification)}
            rowCount={transactionData.length}
            limit={limit}
            checkboxSelection
            pagination
            disableRowSelectionOnClick
            exportFileName="Transaction Report"
            listCount={transactionData.length}
            visibleColumns={visibleColumns}
            setVisibleColumns={setVisibleColumns}
            loading={reportTankerInfo && reportTankerInfo.loading}
            err={reportTankerInfo && reportTankerInfo.err}
            noHeader
            disableFilters
            handlePageChange={handlePageChange}
          />
        )
        : ''}
    </div>
  );
};

TransactionReport.propTypes = {
  afterReset: PropTypes.func.isRequired,
  activeFilter: PropTypes.bool.isRequired,
};

export default TransactionReport;
