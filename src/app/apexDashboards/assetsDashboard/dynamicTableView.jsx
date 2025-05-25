/* eslint-disable max-len */
/* eslint-disable import/no-cycle */
/* eslint-disable no-lonely-if */
/* eslint-disable radix */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import * as PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import {
  getGridStringOperators,
} from '@mui/x-data-grid-pro';

import DrawerHeader from '../../commonComponents/drawerHeader';

import '../../analytics/nativeDashboard/nativeDashboard.scss';
import {
  getDefaultNoValue, containsHtmlTags, stripHtmlTags, getCompanyTimezoneDate,
  getAllCompanies, getTicketStatus, queryGeneratorWithUtc,
} from '../../util/appUtils';
import {
  getAssetDetail,
} from '../../assets/equipmentService';
import {
  getTicketDetail,
  resetUpdateTicket,
  resetImage,
  resetAddTicket,
} from '../../helpdesk/ticketService';
import {
  getOrderDetail,
} from '../../workorders/workorderService';
import {
  getHxAuditDetails,
  getHxAuditActionDetail,
} from '../../auditManagement/auditService';
import {
  getWorkPermitDetails,
} from '../../workPermit/workPermitService';
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
  getStatus,
} from '../../survey/surveyService';
import {
  getComplianceDetail,
} from '../../buildingCompliance/complianceService';
import {
  getTransferDetail,
  getProductDetails,
  getProductList,
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
  getHxIncidentConfig,
  resetAddIncidentInfo,
  resetUpdateIncidentInfo,
} from '../../incidentBooking/ctService';
import { getCtDetail } from '../../consumptionTracker/ctService';

import { getSiteDetail } from '../../adminSetup/setupService';
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
import VisitRequestDetail from '../../visitorManagement/visitRequestDetails/visitRequestDetails';
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
import HxuditDetails from '../../auditManagement/auditDetails/auditDetails';
import AuditActionDetails from '../../auditManagement/auditDetails/auditActionDetails';
import CtDetail from '../../consumptionTracker/auditDetail/auditDetail';
import IncidentDetail from '../../incidentBooking/incidentDetails/incidentDetails';
import ProductDetail from '../../purchase/products/productDetails';
import CommonGridStatic from '../../commonComponents/commonGridStatic';
import {
  getMTName,
  getWorkOrderStateText,
} from '../../workorders/utils/utils';
import {
  getResponseTypeText,
  getStateText,
} from '../../auditSystem/utils/utils';
import customData from '../data/customData.json';
import {
  getCustomGatePassStatusName,
} from '../../gatePass/utils/utils';

const appModels = require('../../util/appModels').default;

const DynamicTableView = React.memo((props) => {
  const {
    columns, data, setAllReport, hideDetail, handlePageChange, currentPage, totalDataCount, propertyAsKey, modelName, exportFileName, isIot, setReload, reload, onFilterChanges, filters, setSearch, exportReportData, isLargeReport,setLargeReport
  } = props;

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const {
    listDataMultipleInfo, listDataMultipleCountInfo, listDataMultipleCountLoading,
  } = useSelector((state) => state.ticket);

  const [viewModal, setViewModal] = useState(false);
  const [viewId, setViewId] = useState(false);
  const [hoveredRow, setValue] = useState(false);
  const [dataColumns, setDataColumns] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({});
  const [parentTicket, setParentTicket] = useState(false);
  const [currentTicket, setCurrentTicket] = useState(false);

  const [questionValuesView, setQuestionsView] = useState([]);
  const [isSave, setSave] = useState(false);
  const [isCancel, setCancel] = useState(false);

  const [savedRecords, setSavedRecords] = useState([]);
  const [editId, setEditId] = useState(false);
  const [questionGroups, setQuestionGroups] = useState([]);

  const { updatePartsOrderInfo } = useSelector((state) => state.workorder);

  const {
    gatePassConfig,
  } = useSelector((state) => state.gatepass);
  const {
    updateIncidentInfo,
  } = useSelector((state) => state.hxIncident);

  const companies = getAllCompanies(userInfo, userRoles);

  const gpConfig = gatePassConfig && gatePassConfig.data && gatePassConfig.data.length ? gatePassConfig.data[0] : false;

  const dataList = listDataMultipleInfo && !listDataMultipleInfo.err && !listDataMultipleInfo.loading && listDataMultipleInfo.data ? listDataMultipleInfo.data : [];

  function getAge(dueDate, closeDate) {
    const d = moment.utc(dueDate).local().format();
    const dateFuture = new Date(d);

    const dateCurrent = closeDate && closeDate !== '' ? new Date(moment.utc(closeDate).local().format()) : new Date();

    const diffTime = Math.round(dateFuture - dateCurrent) / 1000;

    const totalSeconds = Math.abs(diffTime);

    const days = totalSeconds / 86400;
    const temp1 = totalSeconds % 86400;
    const hours = temp1 / 3600;
    const temp2 = temp1 % 3600;
    const minutes = temp2 / 60;

    if (Math.floor(days) > 0) {
      return `${Math.floor(days)}D ${Math.floor(hours)}H ${Math.floor(minutes)} Mins`;
    }
    if (Math.floor(hours) > 0) {
      return `${Math.floor(hours)}H ${Math.floor(minutes)} Mins`;
    }

    return `${Math.floor(minutes)} Mins`;
  }

  function showCustomizedLabel(item, col) {
    const dateTimeFieldsArray = ['planned_in', 'planned_out', 'date_start_scheduled', 'date', 'create_date', 'planned_start_time',
      'planned_end_time', 'planned_in', 'planned_out', 'received_on', 'next_expiry_date', 'requested_on',
      'ordered_on', 'sent_on', 'date_create'];
    const dateFieldsArray = ['warranty_start_date', 'end_of_life', 'warranty_end_date', 'amc_start_date', 'amc_end_date'];
    let value = '';
    if (typeof item[col.property] === 'object') {
      if (col.property === 'state_id' && modelName === 'website.support.ticket') {
        value = getTicketStatus(item[col.property], item.is_on_hold_requested, item.is_cancelled);
      } else if (item[col.property].length && item[col.property].length > 1) {
        const array = item[col.property];
        // eslint-disable-next-line no-unused-vars
        const [id, name] = array;
        value = name;
      } else if (col.displayField && item[col.property][col.displayField]) {
        value = item[col.property][col.displayField];
      } else if (item[col.property].id && (item[col.property].name || item[col.property].alias_name || item[col.property].asset_name || item[col.property].space_name || item[col.property].path_name)) {
        value = item[col.property].space_name || item[col.property].path_name || item[col.property].name || item[col.property].alias_name || item[col.property].asset_name;
      }
    } else {
      if (col.property === 'maintenance_type' && modelName === 'mro.order') {
        value = getMTName(item[col.property]);
      } else if ((col.property === 'state' && modelName === 'mro.order') || col.property === 'order_state') {
        value = getWorkOrderStateText(item[col.property]);
      } else if (col.property === 'description' && modelName === 'website.support.ticket') {
        value = containsHtmlTags(item[col.property]) ? stripHtmlTags(item[col.property]) : getDefaultNoValue(item[col.property]);
      } else if (col.property === 'state' && modelName === 'audit_system.action') {
        value = getStateText(item[col.property]);
      } else if (col.property === 'is_service_impacted') {
        value = item[col.property] ? 'Yes' : 'No';
      } else if (col.property === 'is_results_in_statutory_non_compliance') {
        value = item[col.property] ? 'Yes' : 'No';
      } else if (col.property === 'incident_age') {
        value = getAge(item.incident_date, item.state_id[1] === 'Closed' ? item.closed_on : '');
      } else if (col.property === 'type_action' && modelName === 'audit_system.action') {
        value = getResponseTypeText(item[col.property]);
      } else if (dateTimeFieldsArray.includes(col.property)) {
        value = getCompanyTimezoneDate(item[col.property], userInfo, 'datetime');
      } else if (dateFieldsArray.includes(col.property)) {
        value = getCompanyTimezoneDate(item[col.property], userInfo, 'date');
      } else if (col.dateField) {
        value = getCompanyTimezoneDate(item[col.property], userInfo, col.dateField);
      } else if (col.property === 'low_stock_percent') {
        value = parseInt(item[col.property]);
      } else if (col.property === 'state' && modelName === 'mro.gatepass') {
        value = getCustomGatePassStatusName(item[col.property], gpConfig);
      } else if (col.property === 'is_on_hold_requested') {
        value = item[col.property] ? 'Yes' : 'No';
      } else if (col.property === 'is_cancelled') {
        value = item[col.property] ? 'Yes' : 'No';
      } else {
        value = typeof item[col.property] === 'number' ? parseFloat(item[col.property]).toFixed(2) : containsHtmlTags(item[col.property]) ? stripHtmlTags(item[col.property]) : getDefaultNoValue(item[col.property]);
      }
    }
    return value;
  }

  const getValue = (value) => {
    let fieldValue = value || '-';
    if (Array.isArray(fieldValue)) {
      fieldValue = value[1];
    } else if (typeof value === 'object') {
      if (value.id && (value.name || value.alias_name || value.asset_name || value.space_name || value.path_name)) {
        fieldValue = value.space_name || value.path_name || value.name || value.alias_name || value.asset_name;
      } else {
        fieldValue = '-';
      }
    } else if (containsHtmlTags(value)) {
      fieldValue = stripHtmlTags(value);
    }
    return fieldValue;
  };

  useEffect(() => {
    if (columns && columns.length) {
      const newArrData = [];
      columns.map((cl) => {
        const obj = {
          headerName: cl.heading,
          field: cl.property,
          width: 170,
          resizable: true,
          type: cl.type && cl.type === 'number' ? 'number' : 'text',
          sortable: true,
          func: cl.property === 'state' ? getCustomGatePassStatusName : cl.property === 'state_id' && modelName === 'website.support.ticket' ? false : (cl.displayField ? false : getValue),
          dateField: cl.dateField ? cl.dateField : false,
          displayField: cl.displayField ? cl.displayField : false,
          filterOperators: getGridStringOperators().filter(
            (operator) => operator.value === 'contains',
          ),
          specialStatus: !!(cl.property === 'state_id' && modelName === 'website.support.ticket'),
          valueGetter: (params) => showCustomizedLabel(params.row, cl),
        };
        newArrData.push(obj);
      });
      setDataColumns(newArrData);
    }
  }, [columns]);

  useEffect(() => {
    if (
      visibleColumns
      && Object.keys(visibleColumns)
      && Object.keys(visibleColumns).length === 0
    ) {
      if (columns && columns.length) {
        const newArrData = { _check_: true };
        columns.map((cl) => {
          newArrData[cl.property] = !cl.hide;
        });
        setVisibleColumns(newArrData);
      }
    }
  }, [columns]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (updatePartsOrderInfo && updatePartsOrderInfo.data && modelName === 'hx.breakdown_tracker') {
      dispatch(getTrackerDetail(viewId, modelName));
    }
  }, [updatePartsOrderInfo]);

  /* useEffect(() => {
    if (updateIncidentInfo && updateIncidentInfo.data && viewId && modelName === 'hx.incident') {
      dispatch(getIncidentDetail(viewId, appModels.HXINCIDENT));
    }
  }, [updateIncidentInfo]); */

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
        dispatch(getStatus(companies, appModels.SURVEYSTAGE));
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
      } else if (modelName === 'stock.quant_report_view' || modelName === 'product.product_report_view' || modelName === 'product.company_product_report_view' || modelName === 'dw2_mv_stock.quant_report_view' || modelName === 'dw2.mv_product_product_report_view') {
        const defaultFilters = [
          {
            key: 'id', title: 'ID', value: viewId, label: 'ID', type: 'id', Header: 'ID', id: 'id',
          },
        ];
        dispatch(getProductList(companies, appModels.PRODUCT, 1, 0, 'DESC', 'id', [], [], queryGeneratorWithUtc(defaultFilters, false, userInfo.data), false));
        dispatch(getProductDetails(modelName === 'product.product_report_view' || modelName === 'product.company_product_report_view' ? modelName : appModels.PRODUCT, viewId, modelName === 'product.product_report_view' || modelName === 'product.company_product_report_view' ? modelName : false));
      } else if (modelName === 'mgmtsystem.action') {
        dispatch(getOpportunitiesDetails(viewId, modelName));
      } else if (modelName === 'bcs.compliance.obligation') {
        dispatch(getComplianceDetail(viewId, modelName));
      } else if (modelName === 'stock.scrap') {
        dispatch(getScrapDetail(viewId, modelName));
      } else if (modelName === 'stock.picking' || modelName === 'stock.picking_report_view' || modelName === 'dw2.mv.stock.picking_report_view') {
        dispatch(getTransferDetail(viewId, modelName === 'dw2.mv.stock.picking_report_view' ? 'stock.picking' : modelName));
      } else if (modelName === 'mro.gatepass' || modelName === 'mro.gatepass.to_be_returned_report_view' || modelName === 'mro.gatepass.reported_on_report_view') {
        dispatch(getGatePassDetails(viewId, modelName));
      } else if (modelName === 'tanker.transactions') {
        dispatch(getTankerDetails(viewId, modelName));
      } else if (modelName === 'hx.breakdown_tracker') {
        dispatch(getTrackerDetail(viewId, modelName));
      } else if (modelName === 'hx.audit') {
        dispatch(getHxAuditDetails(viewId, modelName));
      } else if (modelName === 'hx.audit_action' || modelName === 'hx.audit_action_report_view') {
        dispatch(getHxAuditActionDetail(viewId, modelName));
      } else if (modelName === 'hx.sla.kpi_audit') {
        dispatch(getSlaAuditDetail(viewId, modelName));
      } else if (modelName === 'hx.tracker') {
        dispatch(getCtDetail(viewId, modelName));
      } else if (modelName === 'hx.incident') {
        dispatch(getIncidentDetail(viewId, modelName));
        dispatch(resetUpdateIncidentInfo());
        dispatch(resetAddIncidentInfo());
        dispatch(getHxIncidentConfig(companies, appModels.INCIDENTCONFIG));
      }
    }
  }, [viewId]);

  const handlePopoverOpen = (event) => {
    const { id } = event.currentTarget.parentElement.dataset;
    setValue(id);
  };

  const openWorkOrder = () => {
    setViewModal(true);
  };

  /* const handlePPMClose = () => {
    if (setSearch) { setSearch(Math.random()); }
  }; */

  function getIsDetailView() {
    let res = false;
    const noDetailList = customData && customData.noDetailViewModels ? customData.noDetailViewModels : [];
    const noDetailData = noDetailList && noDetailList.length ? noDetailList.filter((item) => item === modelName) : [];
    const isNoDetailModelExists = noDetailData && noDetailData.length;
    if (!isNoDetailModelExists) {
      res = true;
    } else {
      res = false;
    }
    return res;
  }

  const onViewClick = (event) => {
    if (!hideDetail) {
      if (modelName === 'stock.quant_report_view') {
        setViewId(event.row.product_id ? event.row.product_id : event.row.id);
      } else if (modelName === 'dw2.mv_product_product_report_view') {
        setViewId(event.row.product_id ? event.row.product_id : event.row.id);
      } else if (modelName === 'dw2.mv.stock.picking_report_view') {
        setViewId(event.row.stock_picking_id ? event.row.stock_picking_id : event.row.id);
      } else if (modelName === 'dw2_mv_stock.quant_report_view') {
        setViewId(event.row.product_id ? event.row.product_id : event.row.id);
      } else {
        setViewId(event.row.id);
      }
      if (modelName !== 'mro.shift.employee' && modelName !== 'booking.report.model') {
        setViewModal(getIsDetailView());
      }
    }
  };

  const handlePopoverClose = () => {
    setValue('');
  };

  const onViewEditReset = () => {
    dispatch(getTicketDetail(viewId, appModels.HELPDESK));
    dispatch(resetUpdateTicket());
    dispatch(resetImage());
    dispatch(resetAddTicket());
  };

  const onViewReset = () => {
    dispatch(resetUpdateIncidentInfo());
    dispatch(resetAddIncidentInfo());
    if (modelName === 'hx.incident') {
      dispatch(getIncidentDetail(viewId, modelName));
    }
  };

  function getHeaderName() {
    let res = 'Detail View';
    if (dataList && dataList.length) {
      const nData = dataList.filter((item) => item.id === viewId);
      if (nData && nData.length) {
        if (modelName === 'website.support.ticket' && nData[0].ticket_number) {
          res = nData[0].ticket_number;
        } else if (nData[0].name) {
          res = nData[0].name;
        }
      }
    }
    return res;
  }

  return (
    <>
      {dataColumns && dataColumns.length > 0 && (
        <div className="p-0">
          <Box sx={{ height: 670, width: '100%' }}>
            <CommonGridStatic
              className="dashboard-table"
              dataList={dataList}
              dataListCount={listDataMultipleCountInfo && listDataMultipleCountInfo.length ? listDataMultipleCountInfo.length : 0}
              dataColumns={dataColumns}
              onViewClick={onViewClick}
              configData={gpConfig}
              loading={listDataMultipleInfo.loading || listDataMultipleCountLoading}
              visibleColumns={visibleColumns}
              setVisibleColumns={setVisibleColumns}
              exportFileName={exportFileName}
              setReload={setReload}
              setAllReport={setAllReport}
              isLargeReport={isLargeReport}
              setLargeReport={setLargeReport}
              exportReportData={exportReportData}
              page={currentPage}
              rowCount={totalDataCount}
              modelName={modelName}
              noGlobalFilter
              limit={10}
              isIot={isIot}
              handlePageChange={handlePageChange}
              onFilterChanges={onFilterChanges}
              filters={filters}
            />
          </Box>
          <hr className="m-0" />
        </div>
      )}
      <Drawer
        PaperProps={{
          sx: { width: '85%' },
        }}
        anchor="right"
        open={viewModal && (modelName !== 'hx.inspection_checklist_log' && modelName !== 'ppm.scheduler_week')}
      >
        <DrawerHeader
          headerName={getHeaderName()}
          imagePath={false}
          onClose={() => setViewModal(false)}
        />
        {modelName === 'mro.equipment' && (
          <AssetDetails isEdit={false} afterUpdate={false} setViewModal={setViewModal} viewModal={viewModal} isITAsset={false} categoryType={false} />
        )}
        {modelName === 'website.support.ticket' && (
          <TicketDetail
            onViewEditReset={onViewEditReset}
            editId={viewId}
            setEditId={setEditId}
            isIncident={false}
            setViewModal={setViewModal}
            setParentTicket={setParentTicket}
            setCurrentTicket={setCurrentTicket}
          />
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
          <WorkPermitDetail
            editId={viewId}
            setEditId={setEditId}
            isDashboard
            dataId={viewId}
            setViewModal={setViewModal}
            openWorkOrder={openWorkOrder}
          />
        )}
        {modelName === 'audit_system.action' && (
          <NonConformitiesDetail setViewModal={setViewModal} />
        )}
        {modelName === 'mgmtsystem.audit' && (
          <AuditDetail setViewModal={setViewModal} />
        )}
        {modelName === 'mro.visit.request' && (
          <VisitRequestDetail
            editId={viewId}
            setEditId={setEditId}
            setViewModal={setViewModal}
          />
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
        {(modelName === 'stock.quant_report_view' || modelName === 'product.product_report_view' || modelName === 'product.company_product_report_view' || modelName === 'dw2_mv_stock.quant_report_view' || modelName === 'dw2.mv_product_product_report_view') && (
        <ProductDetail model={modelName === 'product.product_report_view' || modelName === 'product.company_product_report_view' ? modelName : false} />
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
        {(modelName === 'stock.picking' || modelName === 'stock.picking_report_view' || modelName === 'dw2.mv.stock.picking_report_view') && (
          <RpDetail />
        )}
        {(modelName === 'mro.gatepass' || modelName === 'mro.gatepass.to_be_returned_report_view' || modelName === 'mro.gatepass.reported_on_report_view') && (
          <GatePassDetail setViewModal={setViewModal} />
        )}
        {modelName === 'tanker.transactions' && (
          <TankerDetail />
        )}
        {modelName === 'hx.breakdown_tracker' && (
          <BreakdownTrackerDetail editId={viewId} isDashboard />
        )}
        {modelName === 'hx.sla.kpi_audit' && (
          <AuditDetails
            offset={false}
            setQuestionGroupsGlobal={setQuestionGroups}
            questionGroupsGlobal={questionGroups}
            savedRecords={savedRecords}
            setSavedQuestions={setSavedRecords}
          />
        )}
        {modelName === 'hx.tracker' && (
          <CtDetail offset={false} savedRecords={savedRecords} setSavedQuestions={setSavedRecords} />
        )}
        {modelName === 'hx.incident' && (
          <IncidentDetail isDashboard setCancel={setCancel} isCancel={isCancel} setSave={setSave} isSave={isSave} setQuestionsView={setQuestionsView} questionValuesView={questionValuesView} offset={0} editId={viewId} setEditId={setEditId} onViewReset={onViewReset} />
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
        <EventPPMDetails eventDetailModel={viewModal} atFinish={() => { setViewModal(false); }} />
      )}
    </>
  );
});

DynamicTableView.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  columns: PropTypes.array.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.array.isRequired,
  propertyAsKey: PropTypes.string.isRequired,
  modelName: PropTypes.string.isRequired,
};
export default DynamicTableView;
