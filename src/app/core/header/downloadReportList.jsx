import DescriptionIcon from '@mui/icons-material/Description';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  CircularProgress,
  Chip,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Report from '@images/reports.svg';
import Pagination from '@material-ui/lab/Pagination';
import EventIcon from '@mui/icons-material/Event';
import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';
import ModuleImages from '@shared/moduleImages';
import RefreshIcon from '@mui/icons-material/Refresh';
import MuiTooltip from '@shared/muiTooltip';
import IconButton from '@mui/material/IconButton';

import uniqBy from 'lodash/lodash';
import map from 'lodash/map';
import pick from 'lodash/pick';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AllProductsReportPrint from '../../inventory/reports/ReportList/allProductReportPrint';
import ConsumptionDetailPrint from '../../inventory/reports/ReportList/consumptionDetailExcelPrint';
import ConsumptionPrint from '../../inventory/reports/ReportList/consumptionPrint';
import { resetDownloadDetailsById, getDownloadRequestById, getDownloadRequestRefresh } from '../../preventiveMaintenance/ppmService';
import ChecklistExport from '../../preventiveMaintenance/reports/reportList/checklistExport';
import ChecklistExportPPM from '../../preventiveMaintenance/reports/reportList/checklistPPMStatusPrint';
import { AddThemeColor } from '../../themes/theme';
import appModels from '../../util/appModels';
import {
  exportExcelTableToXlsx,
  generateErrorMessage,
  getAllCompanies,
  getCompanyTimezoneDate,
  saveExtraLargPdfContent,
  getPagesCountV2,
  getModuleDisplayName,
} from '../../util/appUtils';
import customData from './customData.json';
import modelFields from '../../apexDashboards/data/customData.json';
import DynamicDataExport from './dynamicDataExport';

const ReportDropdown = ({ limit, setOffset }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [isDownloading, setIsDownloading] = useState(false);
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllCompanies(userInfo, userRoles);
  const {
    downloadRequestInfo, downloadRequestDetails, downloadRequestCount, downloadRequestSingleData,
  } = useSelector((state) => state.ppm);
  const [moduleName, setModuleName] = useState('');
  const [modelType, setModelType] = useState('');
  const [downloadType, setType] = useState('');
  const [pdfBody, setPdfBody] = useState([]);
  const [pdfHeader, setPdfHeader] = useState([]);
  const [exportingId, setExportingId] = useState(null);
  const [downloadRequestlist, setDownloadRequestlist] = useState([]);
  const [refreshingId, setRefreshingId] = useState(null);

  const totalDataCount = downloadRequestCount && downloadRequestCount.data && downloadRequestCount.data.length ? downloadRequestCount.data.length : 0;
  const pages = getPagesCountV2(totalDataCount, limit);
  const loading = (downloadRequestInfo && downloadRequestInfo.loading) || (downloadRequestCount && downloadRequestCount.loading);
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
    if (downloadRequestInfo && downloadRequestInfo.data && downloadRequestInfo.data.length > 0) {
      setDownloadRequestlist(downloadRequestInfo.data);
    }
  }, [downloadRequestInfo]);

  const handleRefresh = async (id) => {
    setRefreshingId(id);
    await dispatch(getDownloadRequestRefresh(appModels.DOWNLOADREQUEST, id));
  };

  useEffect(() => {
    if (downloadRequestSingleData?.data?.length > 0 && refreshingId !== null) {
      if (downloadRequestSingleData.data[0].id === refreshingId) {
        setDownloadRequestlist((prevList) => prevList.map((item) => (item.id === refreshingId ? { ...item, ...downloadRequestSingleData.data[0] } : item)));
        setRefreshingId(null); // reset
      }
    }
  }, [downloadRequestSingleData]);

  const downloadDetails = downloadRequestDetails && downloadRequestDetails.data && downloadRequestDetails.data.length ? JSON.parse(downloadRequestDetails.data[0].response_data) : false;
  const webProps = downloadRequestDetails && downloadRequestDetails.data && downloadRequestDetails.data.length ? JSON.parse(downloadRequestDetails.data[0].web_parms) : false;

  const handleAnswerPrint = (htmlId, fileName) => {
    setType('pdf');

    const content = document.getElementById(htmlId);
    document.title = fileName;
    const pri = document.getElementById('print_frame').contentWindow;

    pri.document.open();
    pri.document.write(content.innerHTML);
    pri.document.close();

    setTimeout(() => {
      pri.focus();
      pri.print();

      const reportElement = document.getElementById(htmlId);
      if (reportElement) {
        reportElement.remove();
      }

      setType('');
      setExportingId(null); // Reset loader after export
    }, 1000);
  };

  const checkNumber = (value) => ((typeof value === 'number' && !Number.isNaN(value))
    ? value.toFixed(2)
    : '0');

  useEffect(() => {
    if (downloadType === 'pdf' && moduleName === 'stock.picking.overview' && downloadDetails && downloadDetails.headers && downloadDetails.headers.length > 0) {
      const keyJson = [
        'sl_no', 'product_name', 'unique_code', 'specification', 'brand', 'department', 'category', 'uom', 'vendor_name',
        'opening_stock', 'inward_stock', 'consumption', 'outward_stock', 'scrap_total', 'stock_audit_total', 'closing_stock',
        'unit_rate', 'total_consumption_cost',
      ];
      const uniqFieldarray = [];
      downloadDetails.headers.map((item, index) => {
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
        if (downloadDetails && downloadDetails.stock_details && downloadDetails.stock_details.length > 0) {
          downloadDetails.stock_details.map((data) => {
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
  }, [downloadRequestDetails]);

  const handleAnswerPrintLargePdf = (htmlId, fileName) => {
    const companyName = userInfo && userInfo.data ? userInfo.data.company.name : '';
    setTimeout(() => {
      const pdfHeaders = pdfHeader && pdfHeader.__wrapped__ && pdfHeader.__wrapped__.length > 0 ? pdfHeader.__wrapped__ : [];

      saveExtraLargPdfContent('Inventory Overview', pdfHeaders, pdfBody, `${fileName}.pdf`, companyName, webProps?.filterspdf);
    }, 600);
  };

  const exportTableToExcel = async (tableID, fileTitle = '') => {
    try {
      setType('excel');

      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay if needed

      exportExcelTableToXlsx(tableID, fileTitle);
      setType('');

      const reportElement = document.getElementById(tableID);
      if (reportElement) {
        reportElement.remove();
      }
    } catch (e) {
      console.log(e);
    } finally {
      setExportingId(null); // Hide loader
    }
  };

  const getTemplateBasedonModule = () => {
    let template = (
      <ChecklistExport
        typeId={false}
        inspectionOrders={downloadDetails}
        isdownloadRequest
        tableHeaders={tableHeaders}
      />
    );
    if (modelType !== 'Standard API' && moduleName === 'hx.inspection_checklist_log') {
      template = <ChecklistExport selectedReportDateForReports={webProps?.selectedReportDateForReports} inspectionOrders={downloadDetails} isdownloadRequest tableHeaders={webProps?.tableHeaders} />;
    }
    if (modelType !== 'Standard API' && moduleName === 'ppm.scheduler_week') {
      template = (
        <ChecklistExportPPM
          ppmStatusInfo={downloadDetails}
          isReViewRequired={webProps?.isReViewRequired}
          isSignOffRequired={webProps?.isSignOffRequired}
          typeId={webProps?.typeId}
          isdownloadRequest
        />
      );
    }
    if (modelType !== 'Standard API' && moduleName === 'stock.picking.detailed') {
      template = (
        <ConsumptionDetailPrint
          dateSelection={webProps?.dateSelection}
          isStock={webProps?.isStock}
          typeId={webProps?.typeId}
          selectedDate={webProps?.selectedDate}
          isdownloadRequest
          downloadDetails={downloadDetails}
        />
      );
    }
    if (modelType !== 'Standard API' && moduleName === 'stock.picking.summary') {
      template = <ConsumptionPrint typeId={webProps?.typeId} dateSelection={webProps?.dateSelection} selectedDate={webProps?.selectedDate} isdownloadRequest downloadDetails={downloadDetails} />;
    }
    if (modelType !== 'Standard API' && moduleName === 'stock.picking.overview') {
      template = (
        <AllProductsReportPrint
          isShowArc={webProps?.isShowArc}
          dateSelection={webProps?.dateSelection}
          typeId={webProps?.typeId}
          selectedDate={webProps?.selectedDate}
          isdownloadRequest
          downloadDetails={downloadDetails}
        />
      );
    }
    if (modelType === 'Standard API') {
      template = (
        <DynamicDataExport
          modelName={moduleName}
          listName={`${webProps?.exportFileName} Report`}
          data={downloadDetails}
          setExportingId={setExportingId}
          setType={setType}
          onFinish={() => { dispatch(resetDownloadDetailsById()); setExportingId(null); }}
        />
      );
    }
    return template;
  };

  useEffect(() => {
    if (downloadDetails && downloadType === 'excel' && moduleName !== '') {
      setAnchorEl(null);
      if (moduleName === 'hx.inspection_checklist_log' || moduleName === 'ppm.scheduler_week') {
        exportTableToExcel('export-checklist-report', 'Checklist Report');
      }
      if (moduleName === 'stock.picking.detailed') {
        exportTableToExcel('export-consumption-detail-report', 'Transfers Detail Report');
      }
      if (moduleName === 'stock.picking.summary') {
        exportTableToExcel('export-consumption-report', 'Transfers Report - Summary');
      }
      if (moduleName === 'stock.picking.overview') {
        exportTableToExcel('export-allProduct-report', 'Inventory Overview Report');
      }
    }
    if (downloadDetails && downloadType === 'pdf' && moduleName !== '') {
      setAnchorEl(null);
      if (moduleName === 'hx.inspection_checklist_log' || moduleName === 'ppm.scheduler_week') {
        handleAnswerPrint('print-checklist-report', 'Checklist Report');
      }
      if (moduleName === 'stock.picking.summary') {
        handleAnswerPrint('print-consumption-report', 'Transfers Report - Summary');
      }
      if (moduleName === 'stock.picking.overview' && pdfBody && pdfBody.length > 0) {
        handleAnswerPrintLargePdf('print-product-report', 'Inventory Overview Report');
      }
    }
  }, [downloadRequestDetails, moduleName, pdfBody]);

  const handleClickExcel = async (id) => { // Add 'async' here
    if (isDownloading) return; // Prevent multiple clicks

    setIsDownloading(true);
    setExportingId({ id, type: 'excel' });

    try {
      await dispatch(getDownloadRequestById(appModels.DOWNLOADREQUEST, id)); // Await the API call
      setType('excel');
    } finally {
      setIsDownloading(false); // Reset after download completes
    }
  };

  const handleClickPdf = async (id) => { // Add 'async' here
    if (isDownloading) return; // Prevent multiple clicks

    setIsDownloading(true);
    setExportingId({ id, type: 'pdf' });

    try {
      await dispatch(getDownloadRequestById(appModels.DOWNLOADREQUEST, id)); // Await the API call
      setType('pdf');
    } finally {
      setIsDownloading(false); // Reset after download completes
    }
  };

  const getStatusColor = (sta) => {
    let res = '#6c757d';
    if (sta === 'Pending') {
      res = '#ffc107';
    } else if (sta === 'Ready') {
      res = '#28a745';
    } else if (sta === 'Expired') {
      res = '#dc3545';
    }
    return res;
  };

  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsetValue = (index - 1) * limit;
    setPage(index);
    setOffset(offsetValue);
  };

  return (
    <>
      <div>
        <List sx={{ maxHeight: 300, overflowY: 'auto', paddingBottom: 0 }}>
          {downloadRequestInfo && downloadRequestInfo.loading && <Loader />}
          {(downloadRequestInfo && downloadRequestInfo.err) && (
          <ErrorContent errorTxt={generateErrorMessage(downloadRequestInfo)} />
          )}
          {downloadRequestlist && downloadRequestlist.length && downloadRequestlist.map((item) => (
            (['Ready', 'Pending'].includes(item.state)) ? (
              <ListItem
                key={item.id}
                divider
                sx={{ display: 'flex', justifyContent: 'space-between', padding: '10px 40px' }}
              >
                <ListItemText
                  sx={{ fontSize: 12 }}
                  primary={(
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {/* Report Icon */}
                        <div style={{
                          border: `1px solid ${getStatusColor(item.state)}`,
                          padding: '10px',
                          borderRadius: '50%',
                          backgroundColor: getStatusColor(item.state),
                          display: 'inline-flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                        >
                          <ModuleImages moduleName={item.download_type === 'Report' ? customData?.reports?.[item.model]?.iconName : customData?.listview?.[item.model]?.iconName} />
                        </div>
                        <Typography sx={{ fontSize: '14px', fontWeight: 'bold' }}>
                          {item.download_type === 'Report' ? customData?.reports?.[item.model]?.reportName : `${JSON.parse(item.web_parms)?.exportFileName} ` + 'Report'}
                          {' '}
                          -
                          {' '}
                          <Chip
                            size="small"
                            label={item.state}
                            sx={{
                              borderRadius: 0, // No rounding
                              height: 18,
                              fontSize: '10px',
                              fontWeight: 'bold',
                              px: 0.5,
                              backgroundColor: getStatusColor(item.state),
                              color: 'White',
                            }}
                          />
                        </Typography>
                        {item.state === 'Pending' && (
                        <MuiTooltip
                          title={(
                            <Typography>
                              Refresh
                            </Typography>
                                            )}
                        >
                          <IconButton
                            className="p-0 pt-1"
                            onClick={() => {
                              handleRefresh(item.id);
                            }}
                            style={{ marginRight: '10px', color: AddThemeColor({}).color }}
                          >
                            {' '}
                            <RefreshIcon size={8} />
                            {' '}
                          </IconButton>
                        </MuiTooltip>
                        )}
                      </Box>
                    </Box>
                  )}
                  secondary={(
                    <Box>
                      <Box sx={{
                        display: 'flex', alignItems: 'center', gap: 0.5, marginLeft: '3rem', marginBottom: '5px',
                      }}
                      >
                        <AccessTimeIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                        <Typography variant="body2" sx={{ fontSize: '11px' }}>
                          <b>Created On:</b>
                          {' '}
                          {getCompanyTimezoneDate(item.created_on, userInfo, 'datetime')}
                        </Typography>
                      </Box>

                      <Box sx={{
                        display: 'flex', alignItems: 'center', gap: 0.5, marginLeft: '3rem',
                      }}
                      >
                        <EventIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                        <Typography variant="body2" sx={{ fontSize: '11px' }}>
                          <b>Expires On:</b>
                          {' '}
                          {getCompanyTimezoneDate(item.expire_on, userInfo, 'datetime')}
                        </Typography>
                      </Box>
                      <Box sx={{
                        display: 'flex', alignItems: 'center', gap: 0.5, marginTop: '3px', marginLeft: '3rem',
                      }}
                      >
                        {item.state !== 'Ready' ? null : (
                          <>
                            {/* Excel Download Button */}
                            {
  (
    (item.download_type === 'Standard API'
     && Array.isArray(modelFields[item.model])
     && modelFields[item.model].length > 0)
    || (item.download_type === 'Report'
     && (customData?.reports?.[item.model]?.downloadType === 'excel'
      || customData?.reports?.[item.model]?.downloadType === 'both'))
  ) && (
  <Button
    size="small"
    variant="outlined"
    sx={{
      fontSize: '10px',
      padding: '2px 6px',
      minHeight: '24px',
      lineHeight: 1.2,
      mr: 1,
    }}
    startIcon={
          exportingId?.id === item.id && exportingId?.type === 'excel'
            ? <CircularProgress size={14} />
            : <DescriptionIcon fontSize="small" sx={{ color: AddThemeColor({}).color }} />
        }
    onClick={() => {
      setModuleName(item.model);
      setModelType(item.download_type);
      handleClickExcel(item.id);
    }}
  >
    <Box component="span" sx={{ marginTop: '3px' }}>
      DOWNLOAD EXCEL
    </Box>
  </Button>
  )
}
                            {(item.download_type === 'Report' && (customData?.reports?.[item.model]?.downloadType === 'pdf' || customData?.reports?.[item.model]?.downloadType === 'both')) && (
                            <Button
                              size="small"
                              sx={{
                                fontSize: '10px',
                                padding: '2px 6px',
                                minHeight: '24px',
                                lineHeight: 1.2,
                              }}
                              variant="outlined"
                              startIcon={
          exportingId?.id === item.id && exportingId?.type === 'pdf'
            ? <CircularProgress size={14} />
            : <PictureAsPdfIcon fontSize="small" sx={{ color: AddThemeColor({}).color }} />
        }
                              onClick={() => {
                                setModuleName(item.model);
                                setModelType(item.download_type);
                                handleClickPdf(item.id);
                              }}
                            >
                              <Box component="span" sx={{ marginTop: '3px' }}>
                                DOWNLOAD PDF
                              </Box>
                            </Button>
                            )}
                          </>
                        )}
                      </Box>
                    </Box>
                  )}
                />
              </ListItem>
            ) : ''))}
          {loading || pages === 0 ? (<span />) : (
            <Box
              sx={{
                position: 'sticky',
                bottom: 0,
                backgroundColor: '#fff',
                zIndex: 1,
                display: 'flex',
                justifyContent: 'flex-end',
                padding: '8px',
                borderTop: '1px solid #e0e0e0',
              }}
            >
              <Pagination count={pages} page={page} size="small" color="primary" onChange={handlePageClick} className="font-11" showFirstButton showLastButton />
            </Box>
          )}
        </List>
      </div>
      {downloadDetails
        ? (
          <div className="d-none">
            {getTemplateBasedonModule()}
          </div>
        ) : ''}

    </>
  );
};

export default ReportDropdown;
