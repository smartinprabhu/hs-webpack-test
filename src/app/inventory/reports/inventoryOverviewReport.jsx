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
import map from 'lodash/map';
import pick from 'lodash/pick';
import uniqBy from 'lodash/lodash';
import { makeStyles } from '@material-ui/core/styles';
import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';
import {
  generateErrorMessage, getDefaultNoValue, filterDataPdf,
  getListOfModuleOperations, getPagesCountV2, saveExtraLargPdfContent,
  exportExcelTableToXlsx,
} from '../../util/appUtils';
import { resetPurchaseState, resetPrint, setInitialValues } from '../../purchase/purchaseService';
import {
  getReportId, getTypeId, resetDetailChecklistReport, resetChecklistReport, resetCreateChecklistReport,
} from '../../preventiveMaintenance/ppmService';
import AllProductsReportPrint from './ReportList/allProductReportPrint';
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

const InventoryOverviewReport = React.memo((props) => {
  const {
    afterReset, isShowArc, reportName, setSelectedDate, collapse, showObservations, setShowObservations, tableHeaders, selectedDate, limit, currentPage, setPage, offset, setOffset,
    exportType, exportTrue, setExportType,setResetFilters, setExportTrue,
  } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [isArc, setArc] = useState(isShowArc);
  const [actionModal, showActionModal] = useState(false);

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const { filterInitailValues } = useSelector((state) => state.purchase);
  const {
    inventoryOverview, inventoryOverviewCount, inventoryOverviewCountLoading, inventoryOverviewExport,
  } = useSelector((state) => state.inventory);
  const [pdfBody, setPdfBody] = useState([]);
  const [pdfHeader, setPdfHeader] = useState([]);
  const {
    typeId,
    selectedReportDate,
  } = useSelector((state) => state.ppm);
  
  const isDownloadRequest = !!(inventoryOverview && inventoryOverview.data && inventoryOverview.data.data && inventoryOverview.data.data.length && inventoryOverview.data.data[0].hashlib);

  useEffect(() => {
    if (isDownloadRequest) {
      showActionModal(true);
    }
  }, [inventoryOverview]);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Inspection Schedule', 'code');
  const isExportable = allowedOperations.includes(actionCodes['Inspection Checklist Report Export']);

  const isData = inventoryOverview && inventoryOverview.data && inventoryOverview.data.data ? inventoryOverview.data.data : false;
  const loading = (userInfo && userInfo.loading) || (inventoryOverview && inventoryOverview.loading) || (inventoryOverviewCountLoading);
  const isNoData = (isData && isData.headers && isData.headers.length > 0 && isData.stock_details && isData.stock_details.length > 0) ? 'true' : 'false';

  useEffect(() => {
    setArc(isShowArc);
  }, [isShowArc]);

  useEffect(() => {
    dispatch(setInitialValues(false, false, false, false));
  }, []);

  const redirectToAllReports = () => {
    dispatch(getReportId());
    setSelectedDate('');
    dispatch(getTypeId({
      date: false, productCategoryId: [], vendorId: [], departmentValue: [], productId: [],
    }));
    dispatch(resetCreateChecklistReport());
    dispatch(resetPurchaseState());
    dispatch(resetDetailChecklistReport());
    dispatch(resetChecklistReport());
    dispatch(resetPrint());
    if (afterReset) afterReset();
  };

  const handlePageClick = (page, index) => {
    const offsetVal = page * limit;
    setOffset(offsetVal);
    setPage(page);
  };

  const checkNumber = (value) => ((typeof value === 'number' && !Number.isNaN(value))
    ? value.toFixed(2)
    : '0');

  useEffect(() => {
    if (isData && isNoData !== 'false' && isData.headers && isData.headers.length > 0) {
      const keyJson = ['sl_no', 'product_name', 'unique_code', 'specification', 'brand', 'department', 'category', 'uom', 'vendor_name', 'opening_stock', 'inward_stock', 'consumption', 'outward_stock', 'scrap_total', 'stock_audit_total', 'closing_stock', 'unit_rate', 'total_consumption_cost'];

      const uniqFieldarray = [];
      isData.headers.map((item, index) => {
        const pdfHeaderObj = {
          header: item,
          dataKey: keyJson[index],
        };
        uniqFieldarray.push(pdfHeaderObj);
      });

      setPdfHeader(uniqBy(uniqFieldarray, 'header'));
      const pdfHead = uniqBy(uniqFieldarray, 'header');
      if (pdfHead && pdfHead.__wrapped__ && pdfHead.__wrapped__.length > 0) {
        const extractHeaderkeys = map(pdfHead.__wrapped__, 'dataKey');
        if (inventoryOverview && inventoryOverview.data && inventoryOverview.data.data && inventoryOverview.data.data.stock_details && inventoryOverview.data.data.stock_details.length > 0) {
          inventoryOverview.data.data.stock_details.map((data) => {
            data.closing_stock = checkNumber(data.closing_stock);
            data.consumption = checkNumber(data.consumption);
            data.inward_stock = checkNumber(data.inward_stock);
            data.outward_stock = checkNumber(data.outward_stock);
            data.opening_stock = checkNumber(data.opening_stock);
            data.total_cost = checkNumber(data.total_cost);
            data.unit_rate = checkNumber(data.unit_rate);
            data.scrap_total = checkNumber(data.scrap_total);
            data.stock_audit_total = checkNumber(data.stock_audit_total);
            // data.total_consumption_cost = checkNumber(data.total_consumption_cost);
            const buildBodyObj = pick(data, extractHeaderkeys);
            Object.keys(buildBodyObj).map((bodyData) => {
              if (Array.isArray(buildBodyObj[bodyData])) {
                buildBodyObj[bodyData] = buildBodyObj[bodyData][1];
              }
              return buildBodyObj;
            });
            setPdfBody((state) => [...state, buildBodyObj]);
          });
        }
      }
      // setPdfBody([]);
    }
  }, [inventoryOverview]);

  function filterStringGenerator(filters) {
    const rDate = (selectedReportDate1 && selectedDate && selectedDate !== 'Custom') ? `Report Date: ${selectedReportDate1[0]} - ${selectedReportDate1[1]} , ` : `Report Date: ${selectedReportDate1} , `;
    let filterTxt = `${rDate} Show Archived : ${isArc === 'True' ? 'Yes' : 'No'}, `;
    const states = filters && filters.productId ? filters.productId : [];
    const category = filters && filters.productCategoryId ? (filters.productCategoryId) : [];
    const act = filters && filters.vendorId ? filters.vendorId : [];
    const applies = filters && filters.departmentValue ? filters.departmentValue : [];

    if (states && states.length > 0) {
      filterTxt += 'Product : ';
      filterTxt += filterDataPdf(states);
    } else {
      filterTxt += 'Product : All, ';
    }

    if (category && category.length > 0) {
      filterTxt += 'Product Category : ';
      filterTxt += filterDataPdf(category, 'name');
    } else {
      filterTxt += 'Product Category : All, ';
    }

    if (act && act.length > 0) {
      filterTxt += 'Vendor Name : ';
      filterTxt += filterDataPdf(act);
    } else {
      filterTxt += 'Vendor Name : All, ';
    }

    if (applies && applies.length > 0) {
      filterTxt += 'Department : ';
      filterTxt += filterDataPdf(applies);
    } else {
      filterTxt += 'Department : All, ';
    }

    filterTxt = filterTxt.substring(0, filterTxt.length - 2);
    return filterTxt;
  }

  // useEffect(() => {
  //   if (pdfHeader && pdfHeader.__wrapped__ && pdfHeader.__wrapped__.length > 0) {
  //     const extractHeaderkeys = map(pdfHeader.__wrapped__, 'dataKey');
  //     if (inventoryOverviewExport && inventoryOverviewExport.data && inventoryOverviewExport.data.data && inventoryOverviewExport.data.data.stock_details && inventoryOverviewExport.data.data.stock_details.length > 0) {
  //       inventoryOverviewExport.data.data.stock_details.map((data) => {
  //         data.closing_stock = checkNumber(data.closing_stock);
  //         data.consumption = checkNumber(data.consumption);
  //         data.inward_stock = checkNumber(data.inward_stock);
  //         data.outward_stock = checkNumber(data.outward_stock);
  //         data.opening_stock = checkNumber(data.opening_stock);
  //         data.total_cost = checkNumber(data.total_cost);
  //         data.unit_rate = checkNumber(data.unit_rate);
  //         data.total_consumption_cost = checkNumber(data.total_consumption_cost);
  //         const buildBodyObj = pick(data, extractHeaderkeys);
  //         Object.keys(buildBodyObj).map((bodyData) => {
  //           if (Array.isArray(buildBodyObj[bodyData])) {
  //             buildBodyObj[bodyData] = buildBodyObj[bodyData][1];
  //           }
  //           return buildBodyObj;
  //         });
  //         setPdfBody((state) => [...state, buildBodyObj]);
  //       });
  //     }
  //   }
  // }, [inventoryOverviewExport]);

  const handleAnswerPrint = (htmlId, fileName) => {
    const companyName = userInfo && userInfo.data ? userInfo.data.company.name : '';
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

    /* const content = document.getElementById(htmlId);
    document.title = fileName;
    const pri = document.getElementById('print_frame').contentWindow;
    pri.document.open();
    pri.document.write(content.innerHTML);
    pri.document.close();
    dispatch(setInitialValues(false, false, false, false));
    setTimeout(() => {
      pri.focus();
      pri.print();
    }, 1000); */
    setTimeout(() => {
      const pdfHeaders = pdfHeader && pdfHeader.__wrapped__ && pdfHeader.__wrapped__.length > 0 ? pdfHeader.__wrapped__ : [];

      saveExtraLargPdfContent('Inventory Overview', pdfHeaders, pdfBody, `${fileName}.pdf`, companyName, filterStringGenerator(typeId));
      dispatch(setInitialValues(false, false, false, false));
    }, 600);
  };

  const onClose = () => {
    dispatch(setInitialValues(false, false, false, false));
  };

  const onDownload = () => {
    const result = {
      ...typeId,
      isExport: true,
    };
    dispatch(getTypeId(result));
  };

  useEffect(() => {
    if (filterInitailValues && filterInitailValues.download && !typeId.isExport && inventoryOverview && inventoryOverview.data && inventoryOverview.data.data) {
      onDownload();
    }
  }, [filterInitailValues]);

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
    dispatch(setInitialValues(false, false, false, false));
  };

  let errorText = <div />;
  if ((selectedDate && selectedDate === 'Custom' && (!loading) && typeId && typeId !== null && !isData) || !selectedReportDate) {
    errorText = (
      <>
        PLEASE APPLY FILTERS
      </>
    );
  } else {
    errorText = '';
  }

  const isError = inventoryOverview && inventoryOverview.data ? !inventoryOverview.data.status : false;
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

  const totalDataCount = inventoryOverviewCount && inventoryOverviewCount.length ? inventoryOverviewCount.length : 0;

  const pages = getPagesCountV2(totalDataCount, limit);

  const isDateNeed = (selectedReportDate && selectedDate && selectedDate !== 'Custom') || (selectedDate && selectedDate === 'Custom' && typeId && typeId.date && typeId.date.length > 0 && typeof typeId.date === 'object');

  useEffect(() => {
    if (exportType === 'pdf') {
      handleAnswerPrint('print-product-report', 'Inventory Overview Report');
      dispatch(setInitialValues(false, false, false, false));
      setExportType(false);
    } else if (exportType === 'excel') {
      exportExcelTableToXlsx('export-allProduct-report', 'Inventory Overview Report');
      dispatch(setInitialValues(false, false, false, false));
      setExportType(false);
    }
  }, [exportType, exportTrue]);

  const [SummaryColumns, SetSummaryColumns] = useState([]);

  const fields = ['sl_no', 'product_name', 'unique_code', 'specification', 'brand', 'department', 'category', 'uom', 'vendor_name', 'opening_stock', 'inward_stock', 'consumption', 'outward_stock', 'scrap_total', 'stock_audit_total', 'closing_stock', 'unit_rate', 'total_consumption_cost'];

  const nonZeroFields = ['sl_no', 'product_name', 'unique_code', 'specification', 'brand', 'department', 'category', 'uom', 'vendor_name'];

  useEffect(() => {
    if (inventoryOverview?.data?.data?.headers) {
      const fieldsArray = [];
      inventoryOverview.data.data.headers.map((header, index) => {
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

            // Handle cases where value is a string or number
            if (typeof value === 'string') {
              const numericValue = parseFloat(value);
              return !Number.isNaN(numericValue)
                ? numericValue.toFixed(2) // Valid numeric string
                : '0.00'; // Fallback for non-numeric string
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
  }, [inventoryOverview]);

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
          {(!loading && isDateNeed && isNoData !== 'false' && isData && isData && Object.keys(isData).length > 0) && (
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
                  ))) : 'All , '}
              </span>
              <span className="font-weight-600 mr-1">Show Archived :</span>
              <span className="font-weight-500">{isArc === 'True' ? 'Yes' : 'No'}</span>

            </div>
          )}
        </Box>
      )}
      {isData && isData.stock_details && isData.stock_details.length > 0 && inventoryOverview && !inventoryOverview.err && !inventoryOverview.loading && selectedReportDate1 && selectedDate && SummaryColumns.length > 0 && (

        <CommonGrid
          className="reports-table"
          componentClassName="commonGrid"
          tableData={isData && isData.stock_details}
          page={currentPage}
          columns={SummaryColumns}
          limit={limit}
          checkboxSelection
          rowCount={isData && isData.stock_details && isData.stock_details.length}
          disableRowSelectionOnClick
          exportFileName="Inventory Overview Report"
          listCount={isData && isData.stock_details && isData.stock_details.length}
          loading={inventoryOverview && inventoryOverview.loading}
          err={inventoryOverview && inventoryOverview.err}
          noHeader
          disableFilters
          disablePagination
          handlePageChange={handlePageClick}
          leftPinnedColumns={['sl_no', 'product_name']}
          disableShowAllButton
        />
      )}
      <div className="d-none">
        <AllProductsReportPrint isdownloadRequest={false} isShowArc={isArc} typeId={typeId} inventoryOverview={inventoryOverviewExport} showObservations={showObservations} tableHeaders={tableHeaders} selectedDate={selectedDate} />
      </div>
      {loading && (
        <div className="mb-3 mt-3 text-center">
          <Loader />
        </div>
      )}
      {(inventoryOverview && inventoryOverview.err) && (
        <ErrorContent errorTxt={generateErrorMessage(inventoryOverview)} />
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
            dateSelection:selectedReportDate1,
            isShowArc:isArc,
            typeId,
            selectedDate,
          }}
          details={inventoryOverview && inventoryOverview.data && inventoryOverview.data.data && inventoryOverview.data.data.length && inventoryOverview.data.data[0]}
          actionModal
        />
        )}
    </Box>
  );
});

InventoryOverviewReport.propTypes = {
  collapse: PropTypes.bool,
  afterReset: PropTypes.func.isRequired,
  reportName: PropTypes.string.isRequired,
};
InventoryOverviewReport.defaultProps = {
  collapse: false,
};

export default InventoryOverviewReport;
