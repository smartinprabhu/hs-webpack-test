/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/* eslint-disable import/no-unresolved */
/* eslint-disable radix */
import React, { useState, useEffect } from 'react';
import * as PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/system';
import { makeStyles } from '@material-ui/core/styles';
import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';
import {
  generateErrorMessage, getDefaultNoValue,
  getListOfModuleOperations, exportExcelTableToXlsx,
} from '../../util/appUtils';
import { resetPurchaseState, resetPrint, setInitialValues } from '../../purchase/purchaseService';
import {
  getReportId, getTypeId, resetDetailChecklistReport, resetChecklistReport, resetCreateChecklistReport,
} from '../../preventiveMaintenance/ppmService';
import ConsumptionPrint from './ReportList/consumptionPrint';
import './ReportList/stickyTable.css';
import actionCodes from '../data/actionCodes.json';
// import DataExport from './dataExport/dataExportConsumption';
import CommonGrid from '../../commonComponents/commonGrid';
import {
  resetUpdateVisitor,
} from '../../adminSetup/setupService';
import DownloadRequestAlert from '../../commonComponents/downloadRequestAlert';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const ConsumptionReport = React.memo((props) => {
  const {
    afterReset, reportName, collapse, showObservations, setShowObservations, tableHeaders, selectedDate, setSelectedDate,
    exportType, exportTrue, setExportType, setResetFilters, setExportTrue,
  } = props;
  const dispatch = useDispatch();
  const limit = 10;
  const classes = useStyles();
  const [currentPage, setPage] = useState(0);
  const [actionModal, showActionModal] = useState(false);
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const { filterInitailValues } = useSelector((state) => state.purchase);
  const { consumptionSummary } = useSelector((state) => state.inventory);
  const {
    typeId,
    selectedReportDate,
  } = useSelector((state) => state.ppm);

  const isDownloadRequest = !!(consumptionSummary && consumptionSummary.data && consumptionSummary.data.data && consumptionSummary.data.data.length && consumptionSummary.data.data[0].hashlib);

  useEffect(() => {
    if (isDownloadRequest) {
      showActionModal(true);
    }
  }, [consumptionSummary]);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Inspection Schedule', 'code');
  const isExportable = allowedOperations.includes(actionCodes['Inspection Checklist Report Export']);

  useEffect(() => {
    dispatch(setInitialValues(false, false, false, false));
  }, []);

  const redirectToAllReports = () => {
    dispatch(getReportId());
    dispatch(getTypeId({
      date: false, productCategoryId: [], vendorId: [], departmentValue: [], productId: [],
    }));
    dispatch(resetCreateChecklistReport());
    dispatch(resetPurchaseState());
    dispatch(resetDetailChecklistReport());
    dispatch(resetChecklistReport());
    dispatch(resetPrint());
    setSelectedDate('');
    if (afterReset) afterReset();
  };

  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsets = (index - 1) * limit;
    // setOffset(offsets);
    setPage(index);
    // setIsAllChecked(false);
  };

  const handleAnswerPrint = (htmlId, fileName) => {
    // const div = document.getElementById(htmlId);
    // Create a window object.
    // const win = window.open('', '', 'height=700,width=700'); // Open the window. Its a popup window.
    // document.title = fileName;
    // win.document.write(div.outerHTML); // Write contents in the new window.
    // win.document.close();
    /* setTimeout(() => {
      const r = win.confirm('Do you want to print this document ?');
      if (r === true) {
        win.print();
      }
    }, 1500); */
    // win.print(); // Finally, print the contents.

    const content = document.getElementById(htmlId);
    document.title = fileName;
    const pri = document.getElementById('print_frame').contentWindow;
    pri.document.open();
    pri.document.write(content.innerHTML);
    pri.document.close();
    dispatch(setInitialValues(false, false, false, false));
    setTimeout(() => {
      pri.focus();
      pri.print();
    }, 1000);
  };

  const exportTableToExcel = (tableID, fileTitle = '') => {
    try {
      exportExcelTableToXlsx(tableID, fileTitle);
      /* const dataType = 'application/vnd.ms-excel';
      const tableSelect = document.getElementById(tableID);
      const tableHTML = tableSelect.outerHTML;

      // Specify file name
      const fileName = fileTitle ? `${fileTitle}.xls` : 'excel_data.xls';

      // Create download link element
      const downloadLink = document.createElement('a');

      document.body.appendChild(downloadLink);

      const blob = new Blob(['\ufeff', tableHTML], { type: dataType });

      if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, fileName);
      } else {
        const elem = window.document.createElement('a');
        elem.href = window.URL.createObjectURL(blob);
        elem.download = fileName;
        document.body.appendChild(elem);
        elem.click();
        document.body.removeChild(elem);
      } */
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
    dispatch(setInitialValues(false, false, false, false));
  };
  const isData1 = consumptionSummary && consumptionSummary.data && consumptionSummary.data.data && consumptionSummary.data.data.length && consumptionSummary.data.data.length > 0 && !consumptionSummary.data.data[0].hashlib ? consumptionSummary.data.data : false;
  let isData = consumptionSummary && consumptionSummary.data && consumptionSummary.data.data ? consumptionSummary.data.data : false;
  isData = isDownloadRequest ? isData1 : isData;
  const loading = (userInfo && userInfo.loading) || (consumptionSummary && consumptionSummary.loading);
  const isNoData = (isData && isData.headers && isData.headers.length > 0 && isData.stock_details && isData.stock_details.length > 0) ? 'true' : 'false';
  let errorText = <div />;
  if ((selectedDate === 'Custom' && (!loading) && typeId && typeId !== null && !isData) || !selectedReportDate) {
    errorText = (
      <>
        PLEASE APPLY FILTERS
      </>
    );
  } else {
    errorText = '';
  }

  const isError = consumptionSummary && consumptionSummary.data ? !consumptionSummary.data.status : false;
  const qlIndex = 1;

  const getIsProcessedData = () => {
    if (isData) {
      const isProcessedData = [];
      for (let i = 0; i < isData.datas.length; i++) {
        const temp = [];
        for (let j = 0; j < isData.datas[i].length; j++) {
          temp.push(isData.datas[i][j]);
        }
        for (let k = temp.length; k < isData.headers.length; k++) {
          temp.push('-');
        }
        isProcessedData.push(temp);
      }
      return isProcessedData;
    }
    return [];
  };

  const selectedReportDate1 = selectedReportDate && selectedReportDate !== '' ? selectedReportDate : '';

  const countValue = isData && isData.stock_details && isData.stock_details.length ? isData.stock_details.length : 0;

  const [SummaryColumns, SetSummaryColumns] = useState([]);

  const fields = ['sl_no', 'product_name', 'unique_code', 'specification', 'brand', 'department', 'category', 'uom', 'vendor_name', 'opening_stock', 'inward_stock', 'consumption', 'outward_stock', 'scrap_total', 'stock_audit_total', 'closing_stock', 'unit_rate', 'total_consumption_cost'];
  const nonZeroFields = ['sl_no', 'product_name', 'unique_code', 'specification', 'brand', 'department', 'category', 'uom', 'vendor_name'];

  useEffect(() => {
    if (consumptionSummary?.data?.data?.headers) {
      const fieldsArray = [];
      consumptionSummary.data.data.headers.map((header, index) => {
        const obj = {
          field: fields[index],
          headerName: header,
          width: header === 'Sl No' ? 60 : 180,
          editable: true,
          valueGetter: (params) => {
            const { value } = params;

            // Check if the field is in nonZeroFields and handle with getDefaultNoValue
            if (nonZeroFields.includes(fields[index])) {
              return getDefaultNoValue(value);
            }

            // Check if the value is a valid number before calling toFixed
            return (typeof value === 'number' && !Number.isNaN(value))
              ? value.toFixed(2)
              : '0.00'; // Fallback to '0.00' if value is not a valid number
          },
          func: getDefaultNoValue,
          hideable: false,
        };
        fieldsArray.push(obj);
      });
      SetSummaryColumns(fieldsArray);
    }
  }, [consumptionSummary]);

  useEffect(() => {
    if (exportType === 'pdf') {
      handleAnswerPrint('print-consumption-report', 'Transfers Report - Summary');
      dispatch(setInitialValues(false, false, false, false));
      setExportType(false);
    } else if (exportType === 'excel') {
      exportTableToExcel('export-consumption-report', 'Transfers Report - Summary');
      dispatch(setInitialValues(false, false, false, false));
      setExportType(false);
    }
  }, [exportType, exportTrue]);

  return (
    <Box sx={{ fontFeatureSettings: 'Suisse Intl', position: 'sticky' }}>
      {errorText === '' && (
        <Box sx={{ backgroundColor: '#fff', borderLeft: '1px solid #0000001f', padding: '10px 0px 10px 18px' }}>
          <div className="mt-2">
            <span className="mr-2 font-medium">
              {(selectedReportDate1 && selectedDate && selectedDate !== 'Custom')
                ? (
                  <span className={reportName ? 'font-weight-800 font-size-13' : 'font-weight-800'}>
                    Report Date :
                    {' '}
                    {selectedReportDate1[0]}
                    {' '}
                    -
                    {' '}
                    {selectedReportDate1[1]}
                  </span>
                )
                : ((selectedReportDate1 && isData && (
                  <span className={reportName ? 'font-weight-800 font-size-13' : 'font-weight-800'}>
                    Report Date :
                    {' '}
                    {selectedReportDate1}
                  </span>
                ))
                )}
            </span>
          </div>
          {(!loading && selectedReportDate && isNoData !== 'false' && isData && isData && Object.keys(isData).length > 0) ? (
            <div className="mt-2">
              <span className="font-weight-800 mr-1">Filters :  </span>
              <span className="font-weight-500" />
              <span className="font-weight-600 mr-1">Operation Type :</span>
              <span className="font-weight-500">
                {typeId && typeId.opType && typeId.opType.name
                  ? `${typeId.opType.name}, ` : 'All,'}
              </span>
              <span className="font-weight-600 mr-1">Product :</span>
              <span className="font-weight-500">
                {typeId && typeId.productId && typeId.productId.length > 0
                  ? (typeId.productId.map((pd) => (
                    <span>
                      {pd.name}
                      ,
                    </span>
                  ))) : 'All,'}
              </span>
              <span className="font-weight-600 mr-1">Product Category :</span>
              <span className="font-weight-500">
                {typeId && typeId.productCategoryId && typeId.productCategoryId.length > 0
                  ? (typeId.productCategoryId.map((pd) => (
                    <span>
                      {pd.name}
                      ,
                    </span>
                  ))) : 'All,'}
              </span>
              <span className="font-weight-600 mr-1">Vendor Name :</span>
              <span className="font-weight-500">
                {typeId && typeId.vendorId && typeId.vendorId.length > 0
                  ? (typeId.vendorId.map((pd) => (
                    <span>
                      {pd.name}
                      ,
                    </span>
                  ))) : 'All,'}
              </span>
              <span className="font-weight-600 mr-1">Department :</span>
              <span className="font-weight-500">
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
          ) : ''}
        </Box>
      )}
      {isData && isData.stock_details && isData.stock_details.length > 0 && consumptionSummary && !consumptionSummary.err && !consumptionSummary.loading && selectedReportDate1 && selectedDate && SummaryColumns.length > 0 && (
        <CommonGrid
          className="reports-table"
          componentClassName="commonGrid"
          tableData={isData && isData.stock_details}
          page={currentPage}
          columns={SummaryColumns}
          rowCount={isData && isData.stock_details && isData.stock_details.length}
          checkboxSelection
          disableRowSelectionOnClick
          exportFileName="Transfers Report - Summary"
          listCount={isData && isData.stock_details && isData.stock_details.length}
          loading={consumptionSummary && consumptionSummary.loading}
          err={consumptionSummary && consumptionSummary.err}
          noHeader
          disableFilters
          disablePagination
          leftPinnedColumns={['sl_no', 'product_name']}
          disableShowAllButton
        />
      )}
      <div className="d-none">
        <ConsumptionPrint isdownloadRequest={false} typeId={typeId} consumptionSummary={consumptionSummary} showObservations={showObservations} tableHeaders={tableHeaders} selectedDate={selectedDate} />
      </div>
      {loading && (
        <div className="mb-3 mt-3 text-center">
          <Loader />
        </div>
      )}
      {(consumptionSummary && consumptionSummary.err) && (
        <ErrorContent errorTxt={generateErrorMessage(consumptionSummary)} />
      )}
      {(!loading && errorText === '' && (isError || isNoData === 'false')) && (
        <ErrorContent errorTxt="No Data Found" />
      )}
      <div className="mt-10 text-center">{errorText}</div>

      {actionModal && (
        <DownloadRequestAlert
          atReset={() => {
            setExportTrue(false);
            dispatch(resetUpdateVisitor());
            setResetFilters(true);
            showActionModal(false);
          }}
          webFilters={{
            dateSelection : selectedReportDate1,
            typeId,
            selectedDate,
          }}
          details={consumptionSummary && consumptionSummary.data && consumptionSummary.data.data && consumptionSummary.data.data.length && consumptionSummary.data.data[0]}
          actionModal
        />
      )}
    </Box>
  );
});

ConsumptionReport.propTypes = {
  collapse: PropTypes.bool,
  afterReset: PropTypes.func.isRequired,
  reportName: PropTypes.string.isRequired,
};
ConsumptionReport.defaultProps = {
  collapse: false,
};

export default ConsumptionReport;
