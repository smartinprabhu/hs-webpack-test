/* eslint-disable max-len */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable radix */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-lonely-if */
import React, { useState, useEffect, useMemo } from 'react';
import {
  Table,
} from 'reactstrap';
import Pagination from '@material-ui/lab/Pagination';
import { useSelector, useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { IoCloseOutline } from 'react-icons/io5';
import moment from 'moment';
import { CgExpand } from 'react-icons/cg';
import {
  Skeleton,
} from 'antd';
import Card from '@mui/material/Card';
import Chart from 'react-apexcharts';
import {
  Box, IconButton, Typography, Dialog,
} from '@mui/material';
import Drawer from '@mui/material/Drawer';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import {
  FormControl,
} from '@material-ui/core';
import {
  FiDownload, FiSearch,
} from 'react-icons/fi';
import BackspaceIcon from '@material-ui/icons/Backspace';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import ErrorContent from '@shared/errorContent';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import MuiTooltip from '@shared/muiTooltip';

import { getPercentageNew } from '../../assets/utils/utils';

import DrawerHeader from '../../commonComponents/drawerHeader';

import airQualityIcon from '../../../../images/default/icons/iaqIcons/airQualityIcon.svg';
import dataUsageIcon from '../../../../images/default/icons/iaqIcons/dataUsageIcon.svg';
import pmIcon from '../../../../images/default/icons/iaqIcons/pmIcon.svg';
import temperatureIcon from '../../../../images/default/icons/iaqIcons/temperatureIcon.svg';
import co2Icon from '../../../../images/default/icons/iaqIcons/co2Icon.svg';
import humidityIcon from '../../../../images/default/icons/iaqIcons/humidityIcon.svg';
import defaultIcon from '../../../../images/default/icons/iaqIcons/defaultIcon.svg';
import volatileOrganicCompoundsIcon from '../../../../images/default/icons/iaqIcons/volatileOrganicCompoundsIcon.svg';
import carbonMonoxideIcon from '../../../../images/default/icons/iaqIcons/carbonMonoxideIcon.svg';
import formaldehydeIcon from '../../../../images/default/icons/iaqIcons/formaldehydeIcon.svg';
import ozoneIcon from '../../../../images/default/icons/iaqIcons/ozoneIcon.svg';

import { AddThemeColor } from '../../themes/theme';
import '../../analytics/nativeDashboard/nativeDashboard.scss';
import {
  getDefaultNoValue, isJsonString, checkIsDateOrTime, getJsonString, getPagesCountV2, truncateFrontSlashs, truncateStars, getCompanyTimezoneDate, checkIsDate, getColumnArrayByNumber, getColumnArrayById,
} from '../../util/appUtils';
import StaticDataExport from './staticDataExport';
import {
  getMTName,
  getWorkOrderStateText,
} from '../../workorders/utils/utils';
import {
  getResponseTypeText,
  getStateText,
} from '../../auditSystem/utils/utils';
import AuthService from '../../util/authService';
import {
  getColorCode,
  isModelExists,
  getLabelData,
} from '../utils/utils';
import customData from '../data/customData.json';
import DownloadRequestAlert from '../../commonComponents/downloadRequestAlertListView';

import {
  getAssetDetail,
} from '../../assets/equipmentService';
import {
  getTicketDetail,
} from '../../helpdesk/ticketService';
import {
  getOrderDetail,
} from '../../workorders/workorderService';
import {
  getWorkPermitDetails,
} from '../../workPermit/workPermitService';
import {
  getHxAuditDetails,
  getHxAuditActionDetail,
} from '../../auditManagement/auditService';
import {
  getNonConformitieDetails,
  getAuditDetails,
  getOpportunitiesDetails,
} from '../../auditSystem/auditService';
import {
  getVisitorRequestDetail,
} from '../../visitorManagement/visitorManagementService';
import {
  getInspectionSchedulertDetail,
  getInspectionDetail,
  getPPMDetail,
} from '../../inspectionSchedule/inspectionService';
import {
  getPantryDetail,
} from '../../pantryManagement/pantryService';
import {
  getInboundMailDetails,
  getOutboundMailDetails,
} from '../../mailroomManagement/mailService';
import {
  getAdjustmentDetail,
  getProductMove,
  getScrapDetail,
} from '../../inventory/inventoryService';
import {
  getSurveyDetail,
} from '../../survey/surveyService';
import {
  getComplianceDetail,
} from '../../buildingCompliance/complianceService';
import {
  getTransferDetail,
  getProductDetails,
} from '../../purchase/purchaseService';
import {
  getGatePassDetails,
} from '../../gatePass/gatePassService';
import {
  getTankerDetails,
} from '../../commodityTransactions/tankerService';
import {
  getTrackerDetail,
} from '../../breakdownTracker/breakdownService';
import {
  getSlaAuditDetail,
} from '../../slaAudit/auditService';
import {
  getIncidentDetail,
} from '../../incidentBooking/ctService';
import { getCtDetail } from '../../consumptionTracker/ctService';

import { getSiteDetail, resetCreateTenant } from '../../adminSetup/setupService';
import AssetDetails from '../../assets/assetDetailsView/assetDetails';
import TicketDetail from '../../helpdesk/ticketDetails/ticketDetails';
import OrderDetail from '../../workorders/workorderDetails/workorderDetails';
import SchedulerDetail from '../../inspectionSchedule/inspectionDetails/inspectionDetails';
import EventDetails from '../../inspectionSchedule/viewer/viewInspection';
import EventPPMDetails from '../../preventiveMaintenance/viewer/viewDetails/viewInspection';
import SiteInfo from '../../adminSetup/companyConfiguration/siteInfo';
import WorkPermitDetail from '../../workPermit/workpermitDetails/workpermitDetails';
import NonConformitiesDetail from '../../auditSystem/nonConformitiesDetail/nonConformitiesDetail';
import AuditDetail from '../../auditSystem/auditDetail/auditDetail';
import VisitRequestDetail from '../../visitorManagement/visitRequestDetail/visitRequestDetail';
import SurveyDetail from '../../survey/surveyDetail/surveyDetail';
import PantryDetail from '../../pantryManagement/pantryDetail/pantryDetail';
import InboundDetail from '../../mailroomManagement/operations/inboundDetail/inboundDetail';
import OutboundDetail from '../../mailroomManagement/operations/outboundDetail/InboundDetail';
import AdjustmentDetail from '../../inventory/adjustments/adjustmentDetails/adjustmentDetail';
import ProductMoveDetail from '../../inventory/reports/productMoveDetail/productMoveDetail';
import OpportunitiesDetail from '../../auditSystem/opportunityDetail/opportunitiesDetail';
import ComplianceDetail from '../../buildingCompliance/complianceDetailView/complianceDetails';
import ScrapDetail from '../../inventory/scrap/scrapDetails/scrapDetail';
import RpDetail from '../../purchase/rfq/rfqDetails/receiveProducts/receivedProductsDetail';
import GatePassDetail from '../../gatePass/gatePassDetails/gatePassDetails';
import TankerDetail from '../../commodityTransactions/operations/tankerDetail/tankerDetail';
import BreakdownTrackerDetail from '../../breakdownTracker/breakdownDetailView/breakdownDetails';
import AuditDetails from '../../slaAudit/auditDetail/auditDetail';
import CtDetail from '../../consumptionTracker/auditDetail/auditDetail';
import IncidentDetail from '../../incidentBooking/incidentDetails/incidentDetails';
import ProductDetail from '../../purchase/products/productDetails';
import HxuditDetails from '../../auditManagement/auditDetails/auditDetails';
import AuditActionDetails from '../../auditManagement/auditDetails/auditActionDetails';

import { groupByMultiple } from '../../util/staticFunctions';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const appConfig = require('../../config/appConfig').default;

const TableView = React.memo((props) => {
  const {
    chartData, height, width, fontHeight, isIot, fontWidth, dashboardUuid, dashboardCode,
  } = props;

  const textAlign = (chartData && (chartData.ks_info && isJsonString(chartData.ks_info) && getJsonString(chartData.ks_info).align) || (chartData.ks_description && isJsonString(chartData.ks_description) && getJsonString(chartData.ks_description).align));

  const limit = 10;
  const authService = AuthService();
  const classes = useStyles();
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);
  const [listDataMultipleInfo, setListDataMultipleInfo] = useState({ loading: false, data: null, err: null });
  const [listDataMultipleCountInfo, setListDataMultipleCountInfo] = useState({ loading: false, data: null, err: null });
  const [tableDataExport, setTableDataExport] = useState({ loading: false, data: null, err: null });
  const [excelDownload, setExcelDownload] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [viewModal, setViewModal] = useState(false);
  const [savedRecords, setSavedRecords] = useState([]);
  const [viewId, setViewId] = useState(false);
  const [isShowModal, setShowModal] = useState(false);
  const [exportReportData, setExportReportData] = useState(false);
  const [isLargeReport, setLargeReport] = useState(false);
  const [actionModal, showActionModal] = useState(false);

  const [expanded, setExpanded] = React.useState(false);

  const dispatch = useDispatch();

  const tableValues = chartData && chartData.ks_list_view_data ? JSON.parse(chartData.ks_list_view_data) : false;

  const isUnGrouped = chartData && chartData.ks_list_view_type === 'ungrouped';
  const isListOfQuery = chartData && chartData.ks_data_calculation_type === 'query';
  const noPagination = tableValues && tableValues.data_rows && tableValues.data_rows.length && tableValues.data_rows.length < 9;

  const modelName = chartData && chartData.ks_model_name ? chartData.ks_model_name : '';

  const WEBAPPAPIURL = `${window.location.origin === 'http://localhost:3010' ? 'http://localhost:3000' : window.location.origin}/`;

  const { userInfo } = useSelector((state) => state.user);

  const reHeight = height > 500 && height < 1000 ? 100 : height > 1000 ? 140 : 40;

  const calHeight = height ? height - 50 : fontHeight * 28;

  const isChartTable = isIot ? chartData && chartData.ks_info && isJsonString(chartData.ks_info) && getJsonString(chartData.ks_info).type === 'timeSeries' && getJsonString(chartData.ks_info).chart_table
    : chartData && chartData.ks_description && isJsonString(chartData.ks_description) && getJsonString(chartData.ks_description).type === 'timeSeries' && getJsonString(chartData.ks_description).chart_table;

  const isGroupTable = isIot ? chartData && chartData.ks_info && isJsonString(chartData.ks_info) && getJsonString(chartData.ks_info).group_enabled && getJsonString(chartData.ks_info).group_enabled === 'yes'
    : chartData && chartData.ks_description && isJsonString(chartData.ks_description) && getJsonString(chartData.ks_description).group_enabled && getJsonString(chartData.ks_description).group_enabled === 'yes';

  useEffect(() => {
    if (viewId && modelName) {
      if (modelName === 'mro.equipment') {
        dispatch(getAssetDetail(viewId, modelName, false));
      } else if (modelName === 'website.support.ticket') {
        dispatch(getTicketDetail(viewId, modelName));
      } else if (modelName === 'mro.order') {
        dispatch(getOrderDetail(viewId, modelName));
      } else if (modelName === 'hx.inspection_checklist') {
        dispatch(getInspectionSchedulertDetail(viewId, modelName));
      } else if (modelName === 'hx.inspection_checklist_log' || modelName === 'hx.inspection_log_report_view' || modelName === 'dw2.inspection_log') {
        dispatch(getInspectionDetail(userInfo && userInfo.data && userInfo.data.company ? userInfo.data.company.id : false, modelName, viewId));
      } else if (modelName === 'ppm.scheduler_week' || modelName === 'ppm.scheduler_week_report_view' || modelName === 'dw2.ppm_scheduler_week') {
        dispatch(getPPMDetail(userInfo && userInfo.data && userInfo.data.company ? userInfo.data.company.id : false, modelName, viewId));
      } else if (modelName === 'res.company') {
        dispatch(getSiteDetail(viewId, modelName));
      } else if (modelName === 'mro.work_permit') {
        dispatch(getWorkPermitDetails(viewId, modelName));
      } else if (modelName === 'audit_system.action') {
        dispatch(getNonConformitieDetails(viewId, modelName));
      } else if (modelName === 'mgmtsystem.audit') {
        dispatch(getAuditDetails(viewId, modelName));
      } else if (modelName === 'mro.visit.request') {
        dispatch(getVisitorRequestDetail(viewId, modelName));
      } else if (modelName === 'survey.survey') {
        dispatch(getSurveyDetail(viewId, modelName));
      } else if (modelName === 'pantry.order') {
        dispatch(getPantryDetail(viewId, modelName));
      } else if (modelName === 'mro.mailroom_inbound') {
        dispatch(getInboundMailDetails(viewId, modelName));
      } else if (modelName === 'mro.mailroom_outbound') {
        dispatch(getOutboundMailDetails(viewId, modelName));
      } else if (modelName === 'stock.inventory') {
        dispatch(getAdjustmentDetail(viewId, modelName));
      } else if (modelName === 'stock.move.line') {
        dispatch(getProductMove(viewId, modelName));
      } else if (modelName === 'stock.quant_report_view' || modelName === 'product.product_report_view') {
        dispatch(getProductDetails(modelName === 'product.product_report_view' ? 'product.product_report_view' : appModels.PRODUCT, viewId, modelName === 'product.product_report_view' ? 'product.product_report_view' : false));
      } else if (modelName === 'mgmtsystem.action') {
        dispatch(getOpportunitiesDetails(viewId, modelName));
      } else if (modelName === 'bcs.compliance.obligation') {
        dispatch(getComplianceDetail(viewId, modelName));
      } else if (modelName === 'stock.scrap') {
        dispatch(getScrapDetail(viewId, modelName));
      } else if (modelName === 'stock.picking' || modelName === 'stock.picking_report_view') {
        dispatch(getTransferDetail(viewId, modelName));
      } else if (modelName === 'mro.gatepass') {
        dispatch(getGatePassDetails(viewId, modelName));
      } else if (modelName === 'tanker.transactions') {
        dispatch(getTankerDetails(viewId, modelName));
      } else if (modelName === 'hx.breakdown_tracker') {
        dispatch(getTrackerDetail(viewId, modelName));
      } else if (modelName === 'hx.sla.kpi_audit') {
        dispatch(getSlaAuditDetail(viewId, modelName));
      } else if (modelName === 'hx.tracker') {
        dispatch(getCtDetail(viewId, modelName));
      } else if (modelName === 'hx.incident') {
        dispatch(getIncidentDetail(viewId, modelName));
      } else if (modelName === 'hx.audit') {
        dispatch(getHxAuditDetails(viewId, modelName));
      } else if (modelName === 'hx.audit_action' || modelName === 'hx.audit_action_report_view') {
        dispatch(getHxAuditActionDetail(viewId, modelName));
      }
    }
  }, [viewId]);

  const onKeyEnter = (e) => {
    setSearchValue(e.target.value);
    if (noPagination) {
      const input = e.target.value;
      const filter = input ? input.toString().toUpperCase() : '';
      const table = document.getElementById(`${width}data-tablex`);
      const rows = Array.from(table.getElementsByTagName('tr'));

      rows.forEach((row) => {
        const cells = Array.from(row.getElementsByTagName('td'));
        const found = cells.some((cell) => {
          const cellText = cell.textContent || cell.innerText;
          return cellText.toString().toUpperCase().search(filter) !== -1;
        });
        row.style.display = found ? '' : 'none';
      });
    } else {
      setPage(1);
      setOffset(0);
    }
  };

  function getModelFields() {
    let res = '';
    const labelFields = tableValues && tableValues.label_fields && tableValues.label_fields;
    if (searchValue && labelFields && labelFields.length) {
      for (let i = 0; i < labelFields.length - 1; i += 1) {
        res += ',"|"';
      }
      for (let i = 0; i < labelFields.length; i += 1) {
        res += `,["${labelFields[i]}","ilike","${searchValue}"]`;
      }
    }
    return res;
  }

  function getDomainNewString(domainString) {
    let result = domainString;
    if (searchValue && searchValue.length && domainString) {
      const reString = domainString.toString().substring(1, domainString.toString().length - 1);
      result = `[${reString}${getModelFields()}]`;
    }

    return result;
  }

  function getTableOrder() {
    let res = false;
    const data = tableValues && tableValues.fields;
    const idData = data && data.length ? data.findIndex((item) => item === chartData.ks_sort_by_field) : -1;
    const dataRows = tableValues && tableValues.label_fields;
    if (idData !== -1 && dataRows.length && dataRows[idData]) {
      res = dataRows[idData];
    }
    return res;
  }

  function getExtraSelectionMultiple(company, model, limitValue, offsetValue, fields, searchValueMultiple) {
    setListDataMultipleInfo({ loading: true, data: null, err: null });
    const newDomain = getDomainNewString(searchValueMultiple);
    const data = {
      domain: newDomain, model, fields: JSON.stringify(fields), limit: limitValue, offset: offsetValue,
    };
    const postData = new FormData();
    Object.keys(data).map((payloadObj) => {
      postData.append(payloadObj, data[payloadObj]);
      return postData;
    });
    let config = {
      method: 'post',
      url: `${WEBAPPAPIURL}api/v4/isearch_read`,
      headers: {
        'Content-Type': 'multipart/form-data',
        // Authorization: `Bearer ${authService.getAccessToken()}`,
        endpoint: window.localStorage.getItem('api-url'),
        ioturl: window.localStorage.getItem('iot_url'),
      },
      data: postData,
      withCredentials: true,
    };
    if (isIot) {
      let payload = `domain=${encodeURIComponent(newDomain)}&model=${model}&fields=[${fields}]&limit=${limitValue}&offset=${offsetValue}`;
      if (getTableOrder()) {
        payload = `domain=${encodeURIComponent(newDomain)}&model=${model}&fields=[${fields}]&limit=${limitValue}&offset=${offsetValue}&order=${getTableOrder()} ${chartData.ks_sort_by_order ? chartData.ks_sort_by_order : 'DESC'}`;
      }
      config = {
        method: 'get',
        url: `${WEBAPPAPIURL}public/api/v2/search?${payload}&uuid=${dashboardUuid}&token=${authService.getAccessToken()}`,
        headers: {
          // Authorization: `Bearer ${authService.getAccessToken()}`,
          endpoint: window.localStorage.getItem('api-url'),
          ioturl: window.localStorage.getItem('iot_url'),
        },
        withCredentials: true,
      };
    }
    axios(config)
      .then((response) => {
        setListDataMultipleInfo({ loading: false, data: response.data.data, err: null });
      })
      .catch((error) => {
        setListDataMultipleInfo({ loading: false, data: null, err: error });
      });
  }

  function getExtraSelectionMultipleCount(company, model, limitValue, offsetValue, fields, searchValueMultiple) {
    setListDataMultipleCountInfo({ loading: true, data: null, err: null });
    const newDomain = getDomainNewString(searchValueMultiple);
    const payloadNew = `domain=${encodeURIComponent(newDomain)}&model=${model}&count=1`;
    let config = {
      method: 'get',
      url: `${WEBAPPAPIURL}api/v4/search?${payloadNew}`,
      headers: {
        // Authorization: `Bearer ${authService.getAccessToken()}`,
        endpoint: window.localStorage.getItem('api-url'),
        ioturl: window.localStorage.getItem('iot_url'),
      },
      withCredentials: true,
    };
    if (isIot) {
      const payload = `domain=${encodeURIComponent(newDomain)}&model=${model}&count=1`;
      config = {
        method: 'get',
        url: `${WEBAPPAPIURL}public/api/v2/search?${payload}&uuid=${dashboardUuid}&token=${authService.getAccessToken()}`,
        headers: {
          // Authorization: `Bearer ${authService.getAccessToken()}`,
          endpoint: window.localStorage.getItem('api-url'),
          ioturl: window.localStorage.getItem('iot_url'),
        },
        withCredentials: true,
      };
    }
    axios(config)
      .then((response) => {
        setListDataMultipleCountInfo({ loading: false, data: response.data.length, err: null });
      })
      .catch((error) => {
        setListDataMultipleCountInfo({ loading: false, data: null, err: error });
      });
  }

  const [isLoading, setIsLoading] = useState(false);

  function getTableExtraSelectionMultiple(company, model, fields, searchValueMultiple) {
    setIsLoading(true);
    setTableDataExport({ loading: true, data: null, err: null });
    const data = {
      domain: searchValueMultiple, model, fields: JSON.stringify(fields),
    };
    const postData = new FormData();
    Object.keys(data).map((payloadObj) => {
      postData.append(payloadObj, data[payloadObj]);
      return postData;
    });
    let config = {
      method: 'post',
      url: `${WEBAPPAPIURL}api/v4/isearch_read`,
      headers: {
        'Content-Type': 'multipart/form-data',
        // Authorization: `Bearer ${authService.getAccessToken()}`,
        endpoint: window.localStorage.getItem('api-url'),
        ioturl: window.localStorage.getItem('iot_url'),
      },
      data: postData,
      withCredentials: true,
    };
    if (isIot) {
      let payload = `domain=${encodeURIComponent(searchValueMultiple)}&model=${model}&fields=[${fields}]`;
      if (getTableOrder()) {
        payload = `domain=${encodeURIComponent(searchValueMultiple)}&model=${model}&fields=[${fields}]&order=${getTableOrder()} ${chartData.ks_sort_by_order ? chartData.ks_sort_by_order : 'DESC'}`;
      }
      config = {
        method: 'get',
        url: `${WEBAPPAPIURL}public/api/v2/search?${payload}&uuid=${dashboardUuid}&token=${authService.getAccessToken()}`,
        headers: {
          // Authorization: `Bearer ${authService.getAccessToken()}`,
          endpoint: window.localStorage.getItem('api-url'),
          ioturl: window.localStorage.getItem('iot_url'),
        },
        withCredentials: true,
      };
    }
    axios(config)
      .then((response) => {
        setTableDataExport({ loading: false, data: response.data.data, err: null });
        setIsLoading(false);
      })
      .catch((error) => {
        setTableDataExport({ loading: false, data: null, err: error });
        setIsLoading(false);
      });
  }

  function getIOtFields(fields, types) {
    let res = [];
    const field = 'id';
    if (isIot) {
      for (let i = 0; i < fields.length; i += 1) {
        const fieldType = types[i];
        if (fieldType === 'many2one') {
          res.push(
            `("${fields[i]}",["id","display_name", "name"])`,
          );
        } else {
          res.push(`"${fields[i]}"`);
        }
      }
      res.push(`"${field}"`);
    } else {
      res = fields.concat(['id']);
    }
    return res;
  }

  useEffect(() => {
    if (tableValues && tableValues.label_fields && tableValues.label_fields.length && isUnGrouped && !isListOfQuery && !noPagination && !isChartTable && !isGroupTable) {
      getExtraSelectionMultiple(false, chartData.ks_model_name, limit, offset, getIOtFields(tableValues.label_fields, tableValues.fields_type ? tableValues.fields_type : []), chartData.ks_domain ? JSON.stringify(chartData.ks_domain) : []);
    }
  }, [chartData, searchValue, offset]);

  useEffect(() => {
    if (tableValues && tableValues.label_fields && tableValues.label_fields.length && isUnGrouped && !isListOfQuery && !noPagination && !isChartTable && !isGroupTable) {
      getExtraSelectionMultipleCount(false, chartData.ks_model_name, limit, offset, getIOtFields(tableValues.label_fields, tableValues.fields_type ? tableValues.fields_type : []), chartData.ks_domain ? JSON.stringify(chartData.ks_domain) : []);
    }
  }, [chartData, searchValue]);

  useEffect(() => {
    if (excelDownload && tableValues && tableValues.label_fields && tableValues.label_fields.length && isUnGrouped && !isListOfQuery && chartData && !noPagination && !isChartTable && !isGroupTable) {
      getTableExtraSelectionMultiple(false, chartData.ks_model_name, getIOtFields(tableValues.label_fields, tableValues.fields_type ? tableValues.fields_type : []), chartData.ks_domain ? JSON.stringify(chartData.ks_domain) : []);
    }
  }, [excelDownload]);

  const searchCount = listDataMultipleCountInfo && listDataMultipleCountInfo.data ? listDataMultipleCountInfo.data : 0;

  useEffect(() => {
    if (!isIot && tableValues && tableValues.label_fields && tableValues.label_fields.length && isUnGrouped && !isListOfQuery && chartData && !noPagination && !isChartTable && !isGroupTable) {
      const newFields = getIOtFields(tableValues.label_fields, tableValues.fields_type ? tableValues.fields_type : []);
      setExportReportData({
        totalRecords: searchCount, modelName, modelFields: newFields, searchType: 'isearch_read', downloadType: 'Standard API',domain:chartData.ks_domain ? JSON.stringify(chartData.ks_domain) : []
      });
    }
  }, [isLargeReport]);

  const pages = getPagesCountV2(chartData && chartData.ks_record_count && !searchValue ? chartData.ks_record_count : searchCount, limit);

  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsetValue = (index - 1) * limit;
    setPage(index);
    setOffset(offsetValue);
  };

  function isDateFormat(index) {
    let res = false;
    const data = tableValues && tableValues.fields_type && tableValues.fields_type;
    if (data && data.length && data[index] && (data[index] === 'date' || data[index] === 'datetime')) {
      res = data[index];
    }
    return res;
  }

  function isNumberFormat(index) {
    let res = false;
    const data = tableValues && tableValues.fields_type && tableValues.fields_type;
    if (data && data.length && data[index] && (data[index] === 'number' || data[index] === 'float')) {
      res = data[index];
    }
    return res;
  }

  function isIdField(firstIndex, secIndex) {
    let res = false;
    const data = tableValues && tableValues.label_fields && tableValues.label_fields;
    const idData = data && data.length ? data.findIndex((item) => item === 'id') : -1;
    const dataRows = tableValues && tableValues.data_rows ? tableValues.data_rows : [];
    if (idData !== -1 && dataRows.length && dataRows[firstIndex] && dataRows[firstIndex].data) {
      res = dataRows[firstIndex].data[idData];
    }
    return res;
  }

  function getResValue(input) {
    let res = 0;
    if (Number(input) === input && input % 1 !== 0) {
      res = parseFloat(input).toFixed(2);
    } else {
      res = parseInt(input);
    }
    return res;
  }

  function showDateVal(index, value) {
    let res = getDefaultNoValue(value);
    if (isDateFormat(index)) {
      const res1 = isDateFormat(index) === 'datetime' ? moment(value).format('YYYY-MM-DD HH:mm:ss') : moment(value).format('YYYY-MM-DD');
      res = getCompanyTimezoneDate(res1, userInfo, isDateFormat(index));
    } else if (checkIsDate(value)) {
      res = getCompanyTimezoneDate(value, userInfo, checkIsDateOrTime(value));
    } else if (isNumberFormat(index)) {
      res = getResValue(value);
    }
    return res;
  }

  function showCustomizedLabel(item, col, index) {
    const fieldsArray = ['planned_in', 'planned_out', 'date_start_scheduled', 'date'];
    let value = '';
    if (typeof item[col] === 'object' && item[col].length > 1) {
      const array = item[col];
      // eslint-disable-next-line no-unused-vars
      const [id, name] = array;
      value = name;
    } else if (typeof item[col] === 'object' && item[col].id) {
      value = item[col].name && item[col].name !== 'Attribute: name does not exist.' ? item[col].name : item[col].display_name;
    } else {
      if (col === 'maintenance_type' && modelName === 'mro.order') {
        value = getMTName(item[col]);
      } else if ((col === 'state' && modelName === 'mro.order') || col === 'order_state') {
        value = getWorkOrderStateText(item[col]);
      } else if (col === 'description' && modelName === 'website.support.ticket') {
        value = truncateFrontSlashs(truncateStars(item[col]));// <Markup content={truncateFrontSlashs(truncateStars(item[col.property]))} />;
      } else if (col === 'state' && modelName === 'audit_system.action') {
        value = getStateText(item[col]);
      } else if (col === 'type_action' && modelName === 'audit_system.action') {
        value = getResponseTypeText(item[col]);
      } else if (fieldsArray.includes(col)) {
        value = getCompanyTimezoneDate(item[col], userInfo, 'datetime');
      } else if (checkIsDate(item[col])) {
        value = getCompanyTimezoneDate(item[col], userInfo, checkIsDateOrTime(item[col]));
      } else if (isDateFormat(index)) {
        value = showDateVal(index, item[col]);
      } else if (isNumberFormat(index)) {
        value = getResValue(item[col]);
      } else {
        value = getDefaultNoValue(item[col]);
      }
    }
    return value;
  }

  const isDetail = isIot ? (chartData && (chartData.ks_info && isJsonString(chartData.ks_info) && getJsonString(chartData.ks_info).hide_detail_view && getJsonString(chartData.ks_info).hide_detail_view === 'yes'))
    : (chartData && chartData.ks_description && isJsonString(chartData.ks_description) && getJsonString(chartData.ks_description).hide_detail_view && getJsonString(chartData.ks_description).hide_detail_view === 'yes');

  function getIsDetailView() {
    let res = false;
    if (!isDetail) {
      const noDetailList = customData && customData.noDetailViewModels ? customData.noDetailViewModels : [];
      const noDetailData = noDetailList && noDetailList.length ? noDetailList.filter((item) => item === modelName) : [];
      const isNoDetailModelExists = noDetailData && noDetailData.length;
      if (!isNoDetailModelExists) {
        res = true;
      } else {
        res = false;
      }
    }
    return res;
  }

  function getRow(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      tableTr.push(
        <tr key={i}>
          {assetData[i].data && assetData[i].data.length > 0 && assetData[i].data.map((tv, index) => (
            <td
              aria-hidden="true"
              className={getIsDetailView() && typeof isIdField(i, index) === 'number' ? 'cursor-pointer p-2' : 'p-2'}
              onClick={() => { setViewId(isIdField(i, index)); setViewModal(getIsDetailView() && typeof isIdField(i, index) === 'number'); }}
              key={tv}
            >
              {showDateVal(index, tv)}

            </td>
          ))}
        </tr>,
      );
    }
    return tableTr;
  }

  function getTextAlignCss() {
    let res = { color: getColorCode(chartData.ks_font_color), marginLeft: 'auto', marginRight: 'auto' };
    if (textAlign === 'left') {
      res = { color: getColorCode(chartData.ks_font_color), marginRight: 'auto', paddingLeft: '15px' };
    } else if (textAlign === 'right') {
      res = { color: getColorCode(chartData.ks_font_color), marginLeft: 'auto', paddingRight: '15px' };
    }
    return res;
  }

  const isSectionTitle = chartData.ks_model_name === 'mgmtsystem.action' || chartData.ks_model_name === 'resource.resource';

  const loading = (listDataMultipleInfo && listDataMultipleInfo.loading);

  const getCardIcon = (cardName) => {
    switch (cardName) {
      case 'Index Air Quality':
        return airQualityIcon;
      case 'Temperature (°C)':
        return temperatureIcon;
      case 'Washroom AQI':
        return airQualityIcon;
      case 'Usage':
        return dataUsageIcon;
      case 'Humidity (RH)':
        return humidityIcon;
      case 'CO2 (ppm)':
        return co2Icon;
      case 'Formaldehyde (ppm)':
        return formaldehydeIcon;
      case 'VOC (ppb)':
        return volatileOrganicCompoundsIcon;
      case 'CO (ppm)':
        return carbonMonoxideIcon;
      case 'Ozone (ppm)':
        return ozoneIcon;
      case 'PM2.5 (µg/m³)':
      case 'PM1 (µg/m³)':
      case 'PM4.0 (µg/m³)':
      case 'PM10 (µg/m³)':
        return pmIcon;

      default:
        return defaultIcon;
    }
  };

  function getValueFromTable() {
    let res = 0;
    if (isIot && chartData && chartData.ks_info && isJsonString(chartData.ks_info) && getJsonString(chartData.ks_info).type === 'radialBar' && getJsonString(chartData.ks_info).source_data) {
      const data = tableValues && tableValues.data_rows ? tableValues.data_rows : [];
      const labels = tableValues && tableValues.label && tableValues.label;
      const dataLabel = getJsonString(chartData.ks_info).data_label ? getJsonString(chartData.ks_info).data_label : false;
      if (dataLabel && data && data.length) {
        const dataIndex = labels.findIndex((label) => label === dataLabel);
        if (dataIndex !== -1) {
          res = data[0].data && data[0].data[dataIndex] ? data[0].data[dataIndex] : 0;
        }
      }
    }
    return res;
  }

  function getTimeValueFromTable() {
    let res = new Date();
    if (isIot && chartData && chartData.ks_info && isJsonString(chartData.ks_info) && getJsonString(chartData.ks_info).type === 'radialBar' && getJsonString(chartData.ks_info).source_data) {
      const data = tableValues && tableValues.data_rows ? tableValues.data_rows : [];
      const labels = tableValues && tableValues.label && tableValues.label;
      const timeLabel = getJsonString(chartData.ks_info).time_label ? getJsonString(chartData.ks_info).time_label : false;
      if (timeLabel && data && data.length) {
        const dataIndex = labels.findIndex((label) => label === timeLabel);
        if (dataIndex !== -1) {
          const res1 = data[0].data && data[0].data[dataIndex] ? data[0].data[dataIndex] : new Date();
          res = moment(res1).format('YYYY-MM-DD HH:mm:ss');
        }
      }
    }
    return res;
  }

  function getRangeScore(value, ranges) {
    let score = '';
    if (ranges && ranges.length) {
      const rangeData = ranges.filter(
        (item) => parseFloat(item.ks_from ? item.ks_from : 0) <= parseFloat(value)
          && parseFloat(item.ks_to) >= parseFloat(value),
      );
      if (rangeData && rangeData.length) {
        score = rangeData[0].ks_colors;
      }
    }
    return score;
  }

  function getRangeLegend(value, ranges) {
    let score = '';
    if (ranges && ranges.length) {
      const rangeData = ranges.filter(
        (item) => parseFloat(item.ks_from ? item.ks_from : 0) <= parseFloat(value)
          && parseFloat(item.ks_to) >= parseFloat(value),
      );
      if (rangeData && rangeData.length) {
        score = rangeData[0].ks_legend;
      }
    }
    if (ranges && ranges.length) {
      if (parseFloat(value) > parseFloat(ranges[ranges?.length - 1]?.ks_to)) {
        score = ranges[ranges?.length - 1].ks_legend;
      }
    }

    return score;
  }

  const options = {
    chart: {
      type: 'radialBar',
      offsetY: -20,
      sparkline: {
        enabled: true,
      },
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        track: {
          background: '#e7e7e7',
          strokeWidth: '97%',
          startAngle: -90,
          endAngle: 90,
          // dropShadow: {
          //   enabled: true,
          //   top: 2,
          //   left: 0,
          //   color: "#999",
          //   opacity: 1,
          //   blur: 2,
          // },
        },
        dataLabels: {
          show: true,
          name: {
            offsetY: -5,
            show: false,
            // color: getRangeScore(
            //   parseInt(dataItem.ks_record_count),
            //   dataItem.ks_hx_sla_audit_metric_line_ids
            // ),
            // fontSize: `${width * 4}px`,
          },
          value: {
            formatter(val) {
              return parseFloat(getValueFromTable()).toFixed(2);
            },
            offsetY: -2,
            color: '#000000',
            fontSize: `${fontWidth * 15}px`,
            show: true,
          },
        },
      },
    },
    fill: {
      type: 'solid',
      colors: [
        function ({ value, seriesIndex, w }) {
          return getRangeScore(
            parseFloat(getValueFromTable()),
            chartData.ks_hx_sla_audit_metric_line_ids,
          );
        },
      ],
    },
    // stroke: {
    //   lineCap: "round",
    // },
    labels: [
      getRangeLegend(
        parseFloat(getValueFromTable()),
        chartData.ks_hx_sla_audit_metric_line_ids,
      ),
    ],
  };
  function getRangeColor(value, ranges) {
    let score = '';
    if (ranges && ranges.length) {
      const rangeData = ranges.filter(
        (item) => parseFloat(item.ks_from ? item.ks_from : 0) <= parseFloat(value)
          && parseFloat(item.ks_to) >= parseFloat(value),
      );
      if (rangeData && rangeData.length) {
        score = rangeData[0].ks_colors;
      }
    }
    if (ranges && ranges.length) {
      if (parseFloat(value) > parseFloat(ranges[ranges?.length - 1]?.ks_to)) {
        score = ranges[ranges?.length - 1].ks_colors;
      }
    }

    return score;
  }
  function getPercentageValue() {
    let res = 0;
    const jsonData = getJsonString(chartData.ks_info);
    if (jsonData && jsonData.max_value) {
      res = getPercentageNew(jsonData.max_value, getValueFromTable());
    } else {
      res = getValueFromTable();
    }
    return parseInt(res);
  }

  function getTableLabels() {
    let res = [];
    if (isIot && chartData && chartData.ks_info && isJsonString(chartData.ks_info) && getJsonString(chartData.ks_info).type === 'timeSeries' && getJsonString(chartData.ks_info).chart_table) {
      const data = tableValues && tableValues.data_rows ? tableValues.data_rows : [];
      const labels = tableValues && tableValues.label && tableValues.label;
      const timeLabel = getJsonString(chartData.ks_info).label_name ? getJsonString(chartData.ks_info).label_name : false;
      if (timeLabel && data && data.length) {
        const dataIndex = labels.findIndex((label) => label === timeLabel);
        if (dataIndex !== -1) {
          const newData = data.map((cl) => ({
            label: cl.data[dataIndex] ? showDateVal(dataIndex, cl.data[dataIndex]) : '',
          }));
          res = getColumnArrayById(newData, 'label');
        }
      }
    } else if (!isIot && chartData && chartData.ks_description && isJsonString(chartData.ks_description) && getJsonString(chartData.ks_description).type === 'timeSeries' && getJsonString(chartData.ks_description).chart_table) {
      const data = tableValues && tableValues.data_rows ? tableValues.data_rows : [];
      const labels = tableValues && tableValues.label && tableValues.label;
      const timeLabel = getJsonString(chartData.ks_description).label_name ? getJsonString(chartData.ks_description).label_name : false;
      if (timeLabel && data && data.length) {
        const dataIndex = labels.findIndex((label) => label === timeLabel);
        if (dataIndex !== -1) {
          const newData = data.map((cl) => ({
            label: cl.data[dataIndex] ? showDateVal(dataIndex, cl.data[dataIndex]) : '',
          }));
          res = getColumnArrayById(newData, 'label');
        }
      }
    }
    return res;
  }

  function getTableValues() {
    let res = 0;
    if (isIot && chartData && chartData.ks_info && isJsonString(chartData.ks_info) && getJsonString(chartData.ks_info).type === 'timeSeries' && getJsonString(chartData.ks_info).chart_table) {
      const data = tableValues && tableValues.data_rows ? tableValues.data_rows : [];
      const labels = tableValues && tableValues.label && tableValues.label;
      const dataLabel = getJsonString(chartData.ks_info).data_label ? getJsonString(chartData.ks_info).data_label : false;
      if (dataLabel && data && data.length) {
        const dataIndex = labels.findIndex((label) => label === dataLabel);
        if (dataIndex !== -1) {
          const newData = data.map((cl) => ({
            datas: cl.data[dataIndex] ? cl.data[dataIndex] : '',
          }));
          res = getColumnArrayByNumber(newData, 'datas');
        }
      }
    } else if (!isIot && chartData && chartData.ks_description && isJsonString(chartData.ks_description) && getJsonString(chartData.ks_description).type === 'timeSeries' && getJsonString(chartData.ks_description).chart_table) {
      const data = tableValues && tableValues.data_rows ? tableValues.data_rows : [];
      const labels = tableValues && tableValues.label && tableValues.label;
      const dataLabel = getJsonString(chartData.ks_description).data_label ? getJsonString(chartData.ks_description).data_label : false;
      if (dataLabel && data && data.length) {
        const dataIndex = labels.findIndex((label) => label === dataLabel);
        if (dataIndex !== -1) {
          const newData = data.map((cl) => ({
            datas: cl.data[dataIndex],
          }));
          res = getColumnArrayByNumber(newData, 'datas');
        }
      }
    }
    return res;
  }

  const groupField = isIot ? chartData && chartData.ks_info && isJsonString(chartData.ks_info) && getJsonString(chartData.ks_info).group_field
    : chartData && chartData.ks_description && isJsonString(chartData.ks_description) && getJsonString(chartData.ks_description).group_field;

  const dayCalculationField = isIot ? chartData && chartData.ks_info && isJsonString(chartData.ks_info) && getJsonString(chartData.ks_info).day_calculation_field
    : chartData && chartData.ks_description && isJsonString(chartData.ks_description) && getJsonString(chartData.ks_description).day_calculation_field;

  const statusField = isIot ? chartData && chartData.ks_info && isJsonString(chartData.ks_info) && getJsonString(chartData.ks_info).status_field
    : chartData && chartData.ks_description && isJsonString(chartData.ks_description) && getJsonString(chartData.ks_description).status_field;

  const activeStatusLabel = isIot ? chartData && chartData.ks_info && isJsonString(chartData.ks_info) && getJsonString(chartData.ks_info).active_status_label
    : chartData && chartData.ks_description && isJsonString(chartData.ks_description) && getJsonString(chartData.ks_description).active_status_label;

  const inActiveStatusLabel = isIot ? chartData && chartData.ks_info && isJsonString(chartData.ks_info) && getJsonString(chartData.ks_info).inactive_status_label
    : chartData && chartData.ks_description && isJsonString(chartData.ks_description) && getJsonString(chartData.ks_description).inactive_status_label;

  const activeStatusLabelColor = isIot ? chartData && chartData.ks_info && isJsonString(chartData.ks_info) && getJsonString(chartData.ks_info).active_status_color
    : chartData && chartData.ks_description && isJsonString(chartData.ks_description) && getJsonString(chartData.ks_description).active_status_color;

  const inActiveStatusLabelColor = isIot ? chartData && chartData.ks_info && isJsonString(chartData.ks_info) && getJsonString(chartData.ks_info).inactive_status_color
    : chartData && chartData.ks_description && isJsonString(chartData.ks_description) && getJsonString(chartData.ks_description).inactive_status_color;

  const chartType = isIot ? isChartTable && getJsonString(chartData.ks_info).chart_type : isChartTable && getJsonString(chartData.ks_description).chart_type;
  const dataType = isIot ? isChartTable && getJsonString(chartData.ks_info).data_type : isChartTable && getJsonString(chartData.ks_description).data_type;

  const mainBarOptions = {
    tooltip: {
      enabled: true,
      y: {
        formatter: (val) => (dataType && dataType === 'actual_value' ? val.toFixed(2) : getLabelData(val)),
        title: {
          formatter: (seriesName) => (chartData && chartData.title_y_axis ? chartData.title_y_axis : seriesName),
        },
      },
    },
    grid: {
      padding: {
        bottom: !isShowModal && getTableLabels().some((each) => each && each.length > 15) ? 15 : 10,
      },
    },
    xaxis: {
      categories: getTableLabels(),
      title: {
        text:
          chartData && chartData.title_x_axis ? chartData.title_x_axis : '',
        style: {
          fontSize: '11.5px',
          fontWeight: 600,
          fontFamily: 'Suisse Intl',
        },
        offsetY: !isShowModal && getTableLabels().some((each) => each && each.length > 15) ? -10 : -5,
      },
    },
    yaxis: {
      labels: {
        formatter(val, index) {
          return dataType && dataType === 'actual_value' ? val.toFixed(2) : getLabelData(val);
        },
        style: {
          fontSize: '10px',
          fontWeight: 400,
          fontFamily: 'Suisse Intl',
        },
      },
      title: {
        text:
          chartData && chartData.title_y_axis ? chartData.title_y_axis : '',
        style: {
          fontSize: '11.5px',
          fontWeight: 600,
          fontFamily: 'Suisse Intl',
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    chart: {
      toolbar: {
        show: false, // isTools,
        tools: {
          download: false,
          selection: false, // isTools,
          zoom: false,
          zoomin: false, // isTools,
          zoomout: false, // isTools,
          pan: false, // isTools,
          reset: false, // isTools,s
        },
      },
    },
  };

  const timeZone = userInfo.data
    && userInfo.data.timezone ? userInfo.data.timezone : false;

  const isTileIaq = isIot && chartData && chartData.ks_info && isJsonString(chartData.ks_info) && getJsonString(chartData.ks_info).type === 'radialBar' && getJsonString(chartData.ks_info).source_data;

  const isFontSize = isIot ? (chartData && (chartData.ks_info && isJsonString(chartData.ks_info) && getJsonString(chartData.ks_info).header_font_size)) : (chartData && chartData.ks_description && isJsonString(chartData.ks_description) && getJsonString(chartData.ks_description).header_font_size);

  const headFont = isFontSize && isFontSize ? isFontSize : false;

  function getDataRows() {
    let res = [];
    if (tableValues) {
      const data = tableValues && tableValues.data_rows ? tableValues.data_rows : [];
      const labels = tableValues && tableValues.label_fields && tableValues.label_fields;
      res = data.map((valueArray) => labels.reduce((obj, key, index) => {
        obj[key] = valueArray.data[index];
        return obj;
      }, {}));
    }
    return res;
  }

  function getGroupRows(data, name) {
    let res = [];
    if (name) {
      const grData = data && data.length ? data.filter((item) => item[groupField] === name) : [];
      if (grData && grData.length) {
        res = grData;
      }
    }
    return res;
  }

  function getGroupStatusRows(data, name, stFied) {
    let res = 0;
    if (name) {
      const grData = data && data.length ? data.filter((item) => item[groupField] === name && item[statusField] === stFied) : [];
      if (grData && grData.length) {
        res = grData.length;
      }
    }
    return res;
  }

  const onExcelDownload = () => {
    if (searchCount < 2000) {
      setExcelDownload(Math.random());
    } else {
      setLargeReport(true);
    }
  };

  useEffect(() => {
    if (isLargeReport && searchCount > 2000) {
      showActionModal(true);
    } else {
      showActionModal(false);
    }
  }, [isLargeReport]);

  function getTableColumns() {
    let res = [];
    const labelsFields = tableValues && tableValues.label_fields && tableValues.label_fields;
    const labels = tableValues && tableValues.label && tableValues.label;
    console.log(labelsFields);
    if (labelsFields && labelsFields.length) {
      res = labelsFields.map((cl, index) => ({
        field: cl,
        headerName: labels[index],
        width: 150,
        hideable: cl === 'id',
        groupable: true,
      }));
    }
    return res;
  }

  const handleAccChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  function minutesToDays(minutes) {
    let res = '0';
    const minutesInADay = 60 * 24;
    const minutesInAnHour = 60;

    // Calculate days
    const days = Math.floor(minutes / minutesInADay);

    // Calculate remaining minutes after subtracting days
    const remainingMinutes = minutes % minutesInADay;

    // Calculate hours from remaining minutes
    const hours = Math.floor(remainingMinutes / minutesInAnHour);

    // Calculate remaining minutes after subtracting hours
    const finalMinutes = Math.floor(remainingMinutes % minutesInAnHour);
    if (days > 0) {
      res = `${days}d ${hours}h ${finalMinutes}m`;
    } else if (hours > 0) {
      res = `${hours}h ${finalMinutes}m`;
    } else if (finalMinutes > 0) {
      res = `${finalMinutes}m`;
    }
    return res;
  }

  function daysStr(str) {
    let res = '';
    if (str) {
      res = str.replace('Mins', 'Days');
    }
    return res;
  }

  const groups = useMemo(() => (isGroupTable && groupField && tableValues && tableValues.data_rows ? groupByMultiple(getDataRows(), (obj) => (obj[groupField])) : []), [chartData]);

  return (
    <>
      {isGroupTable && (
      <>
        <div className="p-3">
          <b
            style={{ fontSize: headFont || `${fontHeight + 6}px` }}
            className="pie-chart-text"
          >
            {chartData.name}

          </b>
          <div className="float-right mb-0">
            <MuiTooltip title={<Typography>Download</Typography>}>
              <IconButton
                onClick={() => { setExcelDownload(Math.random()); }}
              >
                <FiDownload
                  size={20}
                  cursor="pointer"
                  className="expand-icon mr-2"
                />
              </IconButton>
            </MuiTooltip>
          </div>
          <StaticDataExport
            chartData={chartData}
            nextLevel={false}
            chartItems={false}
            noPagination
            tableDataExport={false}
            isLoading={isLoading}
            showCustomizedLabel={showCustomizedLabel}
            isDownload={excelDownload}
          />
        </div>
        <div className="pb-2 max-drawer-height thin-scrollbar" style={{ height: `${height - 55}px`, overflowY: 'auto', width: '100%' }}>
          {groups && groups.length > 0 && groups.map((gr, index) => (
            <>
              <Accordion expanded={expanded === gr[0][groupField]} onChange={handleAccChange(gr && gr[0][groupField])}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel${index}-content`}
                  id={`panel${index}bh-header`}
                >
                  <div className="table-container">
                    <div className="table-left">
                      <Typography className="font-family-tab" sx={{ fontWeight: '700' }}>
                        {gr && gr[0][groupField]}
                        {' '}
                        - (
                        {getGroupRows(getDataRows(), gr && gr[0][groupField]).length}
                        )
                      </Typography>
                    </div>
                    <div className="table-right">
                      <div className="table-right-child">
                        <Typography className="font-family-tab" sx={{ fontWeight: '700' }}>
                          {inActiveStatusLabel && (
                          <span className={`${inActiveStatusLabelColor ? '' : 'text-danger'}`} style={inActiveStatusLabelColor ? { color: inActiveStatusLabelColor } : {}}>
                            {inActiveStatusLabel}
                            {' '}
                            -
                            {' '}
                            {getGroupStatusRows(getDataRows(), gr && gr[0][groupField], inActiveStatusLabel)}
                          </span>
                          )}
                        </Typography>
                      </div>
                      <div className="table-right-child">
                        <Typography className="font-family-tab" sx={{ fontWeight: '700' }}>
                          {activeStatusLabel && (
                          <span className={`${inActiveStatusLabelColor ? '' : 'text-success'}`} style={activeStatusLabelColor ? { color: activeStatusLabelColor } : {}}>
                            {activeStatusLabel}
                            {' '}
                            -
                            {' '}
                            {getGroupStatusRows(getDataRows(), gr && gr[0][groupField], activeStatusLabel)}
                          </span>
                          )}
                        </Typography>
                      </div>
                    </div>
                  </div>

                </AccordionSummary>
                <AccordionDetails className="runTime-list thin-scrollbar">
                  <Table className="mb-0 font-weight-400 border-0 assets-table" width="100%" id={`${width}data-tablex`}>
                    <thead>
                      <tr>
                        {tableValues && tableValues.label && tableValues.label.map((tl, index3) => (
                          tableValues && tableValues.label_fields && tableValues.label_fields[index3] !== groupField && (
                          <th className="p-2 min-width-160 table-column" key={tl}>
                            <div className="font-weight-bold font-size-11">
                              {dayCalculationField && tableValues && tableValues.label_fields && tableValues.label_fields[index3] === dayCalculationField ? daysStr(tl) : tl}
                            </div>
                          </th>
                          )
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {getGroupRows(getDataRows(), gr && gr[0][groupField]).map((gl) => (

                        <tr key={gl}>
                          {tableValues && tableValues.label_fields && tableValues.label_fields.map((tdl) => (
                            tdl !== groupField && (
                            <td>{dayCalculationField && tdl === dayCalculationField ? minutesToDays(gl[tdl]) : getDefaultNoValue(gl[tdl]) }</td>
                            )
                          ))}
                        </tr>
                      ))}
                    </tbody>
                    <hr className="m-0" />

                  </Table>
                </AccordionDetails>
              </Accordion>
            </>
          ))}
        </div>
      </>
      )}
      {!isGroupTable && isChartTable && (
        <>
          <div className="line-chart-box">
            <Box
              sx={{
                padding: `8px ${fontHeight - 4}px 0px ${fontHeight - 4}px`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              <h1
                style={{ fontSize: headFont || `${fontHeight + 3}px` }}
                className="line-chart-text m-0"
              >
                {chartData.name}
              </h1>
              <div id={`chart-actions-${chartData.id}`}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px',
                  }}
                >

                  <MuiTooltip title={<Typography>Expand</Typography>}>
                    <IconButton
                      onClick={() => setShowModal(true)}
                    >
                      <CgExpand
                        size={24}
                        cursor="pointer"
                        className="expand-icon mr-2"
                      />
                    </IconButton>
                  </MuiTooltip>
                </Box>
              </div>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
              }}
            >
              <Box
                sx={{
                  height: '100%',
                  width: '100%',
                }}
              >
                <Chart
                  type={chartType}
                  series={[{
                    name: '',
                    data: getTableValues(),
                  }]}
                  height={calHeight}
                  options={mainBarOptions}
                />
              </Box>
            </Box>
          </div>
          <Dialog
            PaperProps={{
              sx: {
                width: '95vw',
                height: '95vh',
                maxWidth: 'none',
                maxHeight: 'none',
              },
            }}
            open={isShowModal}
          >
            <div className="line-chart-box-expand">
              <Box
                sx={{
                  padding: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              >
                <h1 style={{ fontSize: '18px' }} className="line-chart-text m-0">
                  {chartData.name}
                </h1>
                <div id={`chart-actions-${chartData.id}`}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '2px',
                    }}
                  >

                    <MuiTooltip title={<Typography>Close</Typography>}>
                      <IconButton
                        onClick={() => setShowModal(false)}
                      >
                        <IoCloseOutline size={20} />
                      </IconButton>
                    </MuiTooltip>
                  </Box>
                </div>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '98%',
                  height: '100%',
                }}
              >
                <Box
                  sx={{
                    height: '90%',
                    width: '100%',
                  }}
                >
                  <Chart
                    type={chartType}
                    series={[{
                      name: '',
                      data: getTableValues(),
                    }]}
                    height="100%"
                    options={mainBarOptions}
                  />
                </Box>
              </Box>
            </div>
          </Dialog>
        </>
      )}
      {!isGroupTable && !isChartTable && isTileIaq && (
        <Card
          className={chartData.ks_data_calculation_type !== 'query'
          && !chartData.ks_restrict_drilldown
          && isModelExists(chartData.ks_model_name) ? 'ticket-card-no-cursor' : 'ticket-card-no-cursor'}
        >
          <div
            style={{
              padding: `${fontWidth * 7}px`,
            }}
          >
            {/* <ReactApexChart
              options={options}
              series={[getPercentageValue()]}
              type="radialBar"
              height={height + 50}
            /> */}
            <Chart
              options={options}
              series={[getPercentageValue()]}
              type="radialBar"
              height={fontWidth * 90}
            />
            <h1
              style={{
                fontSize: `${fontWidth * 8}px`,
              }}
              className="ticket-text text-center"
            >
              {chartData.name}
            </h1>
            <p
              style={{
                fontSize: `${fontWidth * 5}px`,
                color: getRangeScore(
                  parseFloat(getValueFromTable()),
                  chartData.ks_hx_sla_audit_metric_line_ids,
                ),
              }}
              className="m-0 text-center"
            >
              {getRangeLegend(
                parseFloat(getValueFromTable()),
                chartData.ks_hx_sla_audit_metric_line_ids,
              )}
            </p>
            <p
              style={{
                fontSize: `${fontWidth * 5}px`,
              }}
              className="m-0 text-center"
            >
              {moment.utc(getTimeValueFromTable()).local().tz(timeZone).format(isJsonString(chartData.ks_info) && getJsonString(chartData.ks_info).date_time_format ? getJsonString(chartData.ks_info).date_time_format : 'dd-mon-yyyy')}
              { /* getCompanyTimezoneDate(getTimeValueFromTable(), userInfo, 'datetime') */}
            </p>
            {isIot && chartData.ks_info && isJsonString(chartData.ks_info) && getJsonString(chartData.ks_info).type === 'radialBar' && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: '3%',
                }}
              >
                <img
                  src={getCardIcon(chartData.name)}
                  alt="card-img"
                  height={fontWidth * 20}
                  width={fontWidth * 20}
                />
              </Box>
            )}
          </div>
        </Card>
      )}
      {!isGroupTable && !isChartTable && !isTileIaq && isSectionTitle && (
        <div
          className="p-0 bg-med-blue-dashboard"
          style={{
            display: 'flex',
            verticalAlign: 'middle',
            justifyContent: 'space-evenly',
            width: `${width}px`,
            height: `${height}px`,
            backgroundColor: getColorCode(chartData.ks_background_color),
            position: 'absolute',
            alignItems: 'center',
          }}
        >
          <h5 style={getTextAlignCss()} className="background-lightgray mb-0">{chartData.name}</h5>
        </div>
      )}
      {!isGroupTable && !isChartTable && !isTileIaq && !isSectionTitle && (
        <div className="p-3">
          <b
            style={{ fontSize: headFont || `${fontHeight + 6}px` }}
            className="pie-chart-text"
          >
            {chartData.name}

          </b>
          {tableValues && tableValues.data_rows && tableValues.data_rows.length > 0 && (
            <>
              <div className="float-right mb-0">
                <FormControl variant="outlined">
                  <OutlinedInput
                    id="outlined-adornment-weight"
                    type="text"
                    name="search"
                    variant="outlined"
                    sx={{
                      border: 0,
                      padding: '5px',
                      borderRadius: '4px',
                      height: '30px',
                      marginTop: '0px',
                    }}
                    autoComplete="off"
                    placeholder="Search"
                    autoFocus={searchValue}
                    value={searchValue}
                    onChange={(e) => onKeyEnter(e)}
                    onKeyDown={(e) => onKeyEnter(e)}
                    startAdornment={(
                      <InputAdornment position="start">
                        <FiSearch size={20} color={AddThemeColor({}).color} />
                      </InputAdornment>
                    )}
                    endAdornment={(
                      <InputAdornment position="end">
                        {searchValue && (
                          <>
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => { onKeyEnter({ target: { value: '' } }); }}
                            >
                              <BackspaceIcon fontSize="small" />
                            </IconButton>
                          </>
                        )}
                      </InputAdornment>
                    )}
                  />
                </FormControl>
                <MuiTooltip title={<Typography>Download</Typography>}>
                  <IconButton
                    onClick={() => onExcelDownload()}
                  >
                    <FiDownload
                      size={20}
                      cursor="pointer"
                      className="expand-icon mr-2"
                    />
                  </IconButton>
                </MuiTooltip>
              </div>
              {tableDataExport && !tableDataExport.loading && (
              <StaticDataExport
                chartData={chartData}
                nextLevel={false}
                chartItems={false}
                tableDataExport={!noPagination && tableDataExport && tableDataExport.data ? tableDataExport.data : false}
                isLoading={isLoading}
                noPagination={noPagination}
                showCustomizedLabel={showCustomizedLabel}
                isDownload={excelDownload && !isLoading && (noPagination || (!noPagination && ((tableDataExport && tableDataExport.data) || (tableDataExport && tableDataExport.err))))}
              />
              )}
            </>
          )}
        </div>
      )}
      {!isGroupTable && !isChartTable && !isTileIaq && (!isUnGrouped || noPagination || isListOfQuery) && !isSectionTitle && tableValues && tableValues.label && tableValues.label.length > 0 && (
        <>
          <div className="pb-2 max-drawer-height thin-scrollbar" style={{ height: `${height - 55}px`, overflowY: 'auto', width: '100%' }}>
            <Table className="mb-0 font-weight-400 border-0 assets-table" width="100%" id={`${width}data-tablex`}>
              <thead>
                <tr>
                  {tableValues && tableValues.label && tableValues.label.map((tl) => (
                    <th className="p-2 min-width-160 table-column" key={tl}>
                      <div className="font-weight-bold font-size-11">
                        {tl}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {getRow(tableValues && tableValues.data_rows ? tableValues.data_rows : [])}
              </tbody>
            </Table>
            <hr className="m-0" />
          </div>
        </>
      )}
      {!isGroupTable && !isChartTable && !isTileIaq && isUnGrouped && !noPagination && !isListOfQuery && !isSectionTitle && tableValues && tableValues.label && tableValues.label.length > 0 && (
        <>
          <div className="pb-2 max-drawer-height thin-scrollbar" style={{ height: `${height - 55}px`, overflowY: 'auto', width: '100%' }}>
            <Table className="mb-0 font-weight-400 border-0 assets-table" width="100%">
              <thead>
                <tr>
                  {tableValues && tableValues.label && tableValues.label.map((tl) => (
                    <th className="p-2 min-width-160 table-column" key={tl}>
                      <div className="font-weight-bold font-size-11">
                        {tl}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {listDataMultipleInfo && listDataMultipleInfo.data && listDataMultipleInfo.data.map((item) => (
                  <tr key={`${item.id}-row`}>
                    {tableValues.label_fields && tableValues.label_fields.map((col, index) => (
                      <td
                        key={`${item.id}-${col}`}
                        aria-hidden="true"
                        className={getIsDetailView() ? 'cursor-pointer' : ''}
                        onClick={() => { setViewId(item.id); setViewModal(getIsDetailView()); }}
                      >
                        {showCustomizedLabel(item, col, index)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table>
            <hr className="m-0" />
            {loading || pages === 0 ? (<span />) : (
              <div className={`${classes.root} float-right custom-table-footer`}>
                <Pagination count={pages} page={page} size="small" color="primary" onChange={handlePageClick} showFirstButton showLastButton />
              </div>
            )}
            {listDataMultipleInfo && listDataMultipleInfo.loading && (
              <div className="mt-2 text-center">
                <Skeleton active />
              </div>
            )}
            {(listDataMultipleInfo && listDataMultipleInfo.err) && (
              <SuccessAndErrorFormat response={listDataMultipleInfo} />
            )}
            {(listDataMultipleInfo && listDataMultipleInfo.data && listDataMultipleInfo.data.length === 0) && (
              <ErrorContent isDashboard errorTxt="No data here." />
            )}
            {actionModal && (
            <DownloadRequestAlert
              atReset={() => {
                dispatch(resetCreateTenant());
                setLargeReport(false);
                showActionModal(false);
              }}
              details={exportReportData}
              actionModal
            />
            )}
          </div>
        </>
      )}
      {tableValues && tableValues.label && tableValues.label.length === 0 && (
        <>
          {!isSectionTitle && (
            <ErrorContent isDashboard errorTxt="No data here." />
          )}
        </>
      )}
      <Drawer
        PaperProps={{
          sx: { width: '85%' },
        }}
        anchor="right"
        open={viewModal && (modelName !== 'hx.inspection_checklist_log' && modelName !== 'ppm.scheduler_week')}
      >
        <DrawerHeader
          headerName="Detail View"
          imagePath={false}
          onClose={() => setViewModal(false)}
        />
        {modelName === 'mro.equipment' && (
          <AssetDetails isEdit={false} afterUpdate={false} setViewModal={setViewModal} viewModal={viewModal} isITAsset={false} categoryType={false} />
        )}
        {modelName === 'website.support.ticket' && (
          <TicketDetail isIncident={false} setViewModal={setViewModal} setParentTicket={false} setCurrentTicket={false} />
        )}
        {modelName === 'mro.order' && (
          <OrderDetail setViewModal={setViewModal} />
        )}
        {modelName === 'hx.inspection_checklist' && (
          <SchedulerDetail />
        )}
        {modelName === 'res.company' && (
          <SiteInfo />
        )}
        {modelName === 'mro.work_permit' && (
          <WorkPermitDetail openWorkOrder={false} setViewModal={setViewModal} />
        )}
        {modelName === 'audit_system.action' && (
          <NonConformitiesDetail setViewModal={setViewModal} />
        )}
        {modelName === 'mgmtsystem.audit' && (
          <AuditDetail setViewModal={setViewModal} />
        )}
        {modelName === 'mro.visit.request' && (
          <VisitRequestDetail setViewModal={setViewModal} />
        )}
        {modelName === 'survey.survey' && (
          <SurveyDetail viewAnswers={false} />
        )}
        {modelName === 'pantry.order' && (
          <PantryDetail />
        )}
        {modelName === 'mro.mailroom_inbound' && (
          <InboundDetail />
        )}
        {modelName === 'mro.mailroom_outbound' && (
          <OutboundDetail />
        )}
        {modelName === 'stock.inventory' && (
          <AdjustmentDetail />
        )}
        {(modelName === 'stock.move.line') && (
          <ProductMoveDetail />
        )}
        {(modelName === 'stock.quant_report_view' || modelName === 'product.product_report_view') && (
          <ProductDetail model={modelName === 'product.product_report_view' ? 'product.product_report_view' : false} />
        )}
        {modelName === 'mgmtsystem.action' && (
          <OpportunitiesDetail />
        )}
        {modelName === 'bcs.compliance.obligation' && (
          <ComplianceDetail />
        )}
        {modelName === 'stock.scrap' && (
          <ScrapDetail />
        )}
        {(modelName === 'stock.picking' || modelName === 'stock.picking_report_view') && (
          <RpDetail />
        )}
        {modelName === 'mro.gatepass' && (
          <GatePassDetail setViewModal={setViewModal} />
        )}
        {modelName === 'tanker.transactions' && (
          <TankerDetail />
        )}
        {modelName === 'hx.breakdown_tracker' && (
          <BreakdownTrackerDetail />
        )}
        {modelName === 'hx.sla.kpi_audit' && (
          <AuditDetails offset={false} savedRecords={savedRecords} setSavedQuestions={setSavedRecords} />
        )}
        {modelName === 'hx.tracker' && (
          <CtDetail offset={false} savedRecords={savedRecords} setSavedQuestions={setSavedRecords} />
        )}
        {modelName === 'hx.incident' && (
          <IncidentDetail offset={false} />
        )}
        {modelName === 'hx.audit' && (
        <HxuditDetails offset={false} />
        )}
        {(modelName === 'hx.audit_action' || modelName === 'hx.audit_action_report_view') && (
        <AuditActionDetails offset={false} />
        )}
      </Drawer>
      {(modelName === 'hx.inspection_checklist_log' || modelName === 'hx.inspection_log_report_view' || modelName === 'dw2.inspection_log') && (
        <EventDetails eventDetailModel={viewModal} atFinish={() => setViewModal(false)} />
      )}
      {(modelName === 'ppm.scheduler_week' || modelName === 'ppm.scheduler_week_report_view' || modelName === 'dw2.ppm_scheduler_week') && (
        <EventPPMDetails eventDetailModel={viewModal} atFinish={() => setViewModal(false)} />
      )}
    </>
  );
});

TableView.propTypes = {
  chartData: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
    PropTypes.object,
  ]).isRequired,
  height: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
    PropTypes.object,
  ]).isRequired,
};
export default TableView;
