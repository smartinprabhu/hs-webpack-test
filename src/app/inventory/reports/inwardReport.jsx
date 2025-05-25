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
import { Box } from "@mui/system";

import { makeStyles } from '@material-ui/core/styles';
import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';
import {
  generateErrorMessage, getDefaultNoValue, 
  getListOfModuleOperations, getPagesCountV2,
} from '../../util/appUtils';
import { resetPurchaseState, resetPrint, setInitialValues } from '../../purchase/purchaseService';
import {
  getReportId, getTypeId, resetDetailChecklistReport, resetChecklistReport, resetCreateChecklistReport,
} from '../../preventiveMaintenance/ppmService';
import { clearConsumptionSummary } from '../inventoryService';
import InwardStockPrint from './ReportList/InwardStockPrint';
import './ReportList/stickyTable.css';
import actionCodes from '../data/actionCodes.json';
import CommonGrid from "../../commonComponents/commonGrid";

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const InwardReport = React.memo((props) => {
  const {
    afterReset, reportName, collapse, showObservations, setShowObservations, tableHeaders, selectedDate, setSelectedDate,
    exportType, exportTrue, setExportType
  } = props;
  const dispatch = useDispatch();
  const limit = 10;
  const classes = useStyles();
  const [currentPage, setPage] = useState(0);
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const { filterInitailValues } = useSelector((state) => state.purchase);
  const { inwardSummary } = useSelector((state) => state.inventory);
  const {
    typeId,
    selectedReportDate,
  } = useSelector((state) => state.ppm);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Inspection Schedule', 'code');

  const isExportable = allowedOperations.includes(actionCodes['Inward Stock Report Export']);

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

  useEffect(() => {
    dispatch(clearConsumptionSummary());
  }, []);

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
    setTimeout(() => {
      pri.focus();
      pri.print();
    }, 1000);
  };

  const exportTableToExcel = (tableID, fileTitle = '') => {
    try {
      const dataType = 'application/vnd.ms-excel';
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
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  };

  const isData = inwardSummary && inwardSummary.data && inwardSummary.data.data ? inwardSummary.data.data : false;
  const isNoData = (isData && isData.headers && isData.headers.length > 0 && isData.stock_details && isData.stock_details.length > 0) ? 'true' : 'false';
  // const loading = (userInfo && userInfo.loading) || (inwardSummary && inwardSummary.loading) || !isData || selectedDate !== '%(custom)s';
  const loading = ((userInfo && userInfo.loading) || (inwardSummary && inwardSummary.loading));
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

  // const selectedReportDate = typeId && typeId !== null && typeId.date && typeId.date.length
  //   ? `${getCompanyTimezoneDate(typeId.date[0], userInfo, 'date')} - ${getCompanyTimezoneDate(typeId.date[1], userInfo, 'date')}` : '';

  const isError = inwardSummary && inwardSummary.data ? !inwardSummary.data.status : false;
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
  const pages = getPagesCountV2(countValue, limit);

  useEffect(() => {
    if (exportType === 'pdf') {
      handleAnswerPrint('print-inward-report', 'Inward Stock Report')
      dispatch(setInitialValues(false, false, false, false));
      setExportType(false)
    } else if (exportType === 'excel') {
      exportTableToExcel('export-inward-report', 'Inward Stock Report')
      dispatch(setInitialValues(false, false, false, false));
      setExportType(false)
    }
  }, [exportType, exportTrue]);

  const [SummaryColumns, SetSummaryColumns] = useState([])

  const fields = ['sl_no', 'product_name', 'unique_code', 'specification', 'brand', 'department', 'category', 'uom', 'vendor_name', 'inward_stock', 'unit_rate', 'total_cost']
  const nonZeroFields = ['sl_no', 'product_name', 'unique_code',, 'specification', 'brand', 'department', 'category', 'uom', 'vendor_name']

  useEffect(() => {
    if (inwardSummary?.data?.data?.headers) {
      const fieldsArray = []
      inwardSummary.data.data.headers.map((header, index) => {
        const obj = {
          field: fields[index],
          headerName: header,
          width: header === 'Sl No' ? 60 : 180,
          editable: true,
          valueGetter: (params) => nonZeroFields.includes(fields[index]) ? getDefaultNoValue(params.value) : params.value ? params.value.toFixed(2) : 0,
          func: getDefaultNoValue,
          hideable: false
        }
        fieldsArray.push(obj)
      })
      SetSummaryColumns(fieldsArray)
    }
  }, [inwardSummary])

  return (
    <Box sx={{ fontFeatureSettings: "Suisse Intl", position: 'sticky' }} >
      {errorText === '' && (
        <Box sx={{ backgroundColor: '#fff', borderLeft: '1px solid #0000001f', padding: '10px 0px 10px 18px' }}>
          <span className="p-0 mr-2 font-medium">
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
              : (
                (selectedReportDate1 && isData && (
                  <span className={reportName ? 'font-weight-800 font-size-13' : 'font-weight-800'}>
                    Report Date :
                    {' '}
                    {selectedReportDate1}
                  </span>
                ))
              )}
          </span>
          {(!loading && selectedReportDate && isNoData !== 'false' && isData && isData && Object.keys(isData).length > 0) && (
            <div className="mt-2">
              <span className="font-weight-800 mr-1">Filters :  </span>
              <span className="font-weight-500" />
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
          )}
        </Box>
      )}
      {isData && isData.stock_details && isData.stock_details.length > 0 && inwardSummary && !inwardSummary.err && !inwardSummary.loading && selectedReportDate1 && selectedDate && SummaryColumns.length > 0 && (
        <CommonGrid
          className="reports-table"
          componentClassName="commonGrid"
          tableData={isData && isData.stock_details}
          page={currentPage}
          columns={SummaryColumns}
          rowCount={isData && isData.stock_details && isData.stock_details.length}
          checkboxSelection
          disableRowSelectionOnClick
          exportFileName="Inward Report - Summary"
          listCount={isData && isData.stock_details && isData.stock_details.length}
          loading={inwardSummary && inwardSummary.loading}
          err={inwardSummary && inwardSummary.err}
          noHeader={true}
          disableFilters={true}
          disablePagination={true}
          leftPinnedColumns={['sl_no', 'product_name']}
          disableShowAllButton={true}
        />
      )}
      <div className="d-none">
        <InwardStockPrint typeId={typeId} inwardSummary={inwardSummary} showObservations={showObservations} tableHeaders={tableHeaders} selectedDate={selectedDate} />
      </div>
      {loading && (
        <div className="mb-3 mt-3 text-center">
          <Loader />
        </div>
      )}
      {(inwardSummary && inwardSummary.err) && (
        <ErrorContent errorTxt={generateErrorMessage(inwardSummary)} />
      )}
      {(!loading && errorText === '' && (isError || isNoData === 'false')) && (
        <ErrorContent errorTxt="No Data Found" />
      )}
      <div className='mt-10 text-center'>{errorText}</div>
    </Box>
  );
});

InwardReport.propTypes = {
  collapse: PropTypes.bool,
  afterReset: PropTypes.func.isRequired,
  reportName: PropTypes.string.isRequired,
};
InwardReport.defaultProps = {
  collapse: false,
};

export default InwardReport;
