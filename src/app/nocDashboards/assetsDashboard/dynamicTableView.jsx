/* eslint-disable max-len */
/* eslint-disable import/no-cycle */
/* eslint-disable no-lonely-if */
/* eslint-disable radix */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import * as PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Drawer } from 'antd';
import moment from 'moment-timezone';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import DrawerHeader from '@shared/drawerHeader';

import '../../analytics/nativeDashboard/nativeDashboard.scss';
import {
  getDefaultNoValue, truncateFrontSlashs, truncateStars, getCompanyTimezoneDate,
  checkIsDate,
} from '../../util/appUtils';
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

import { getSiteDetail } from '../../adminSetup/setupService';
import AssetDetails from '../../assets/assetDetails/assetsDetail';
import TicketDetail from '../../helpdesk/viewTicket/ticketDetail';
import OrderDetail from '../../workorders/viewWorkorder/orderDetail';
import SchedulerDetail from '../../inspectionSchedule/schedulerDetail/schedulerDetail';
import EventDetails from '../../inspectionSchedule/viewer/viewInspection';
import EventPPMDetails from '../../preventiveMaintenance/viewer/viewDetails/viewInspection';
import SiteInfo from '../../adminSetup/companyConfiguration/siteInfo';
import WorkPermitDetail from '../../workPermit/workPermitDetail/workPermitDetail';
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
import ComplianceDetail from '../../buildingCompliance/complianceDetails/complianceDetail';
import ScrapDetail from '../../inventory/scrap/scrapDetails/scrapDetail';
import RpDetail from '../../purchase/rfq/rfqDetails/receiveProducts/receivedProductsDetail';
import GatePassDetail from '../../gatePass/gatePassDetails/gatePassDetails';
import TankerDetail from '../../commodityTransactions/operations/tankerDetail/tankerDetail';
import BreakdownTrackerDetail from '../../breakdownTracker/breakdownDetails/breakdownDetail';
import AuditDetails from '../../slaAudit/auditDetail/auditDetail';
import CtDetail from '../../consumptionTracker/auditDetail/auditDetail';
import IncidentDetail from '../../incidentBooking/incidentDetail/incidentDetail';
import ProductDetail from '../../purchase/products/productDetails';

import {
  getMTName,
  getWorkOrderStateText,
} from '../../workorders/utils/utils';
import {
  getResponseTypeText,
  getStateText,
} from '../../auditSystem/utils/utils';
import customData from '../data/customData.json';

const appModels = require('../../util/appModels').default;

const DynamicTableView = React.memo((props) => {
  const {
    columns, data, propertyAsKey, modelName,
  } = props;

  const { userInfo } = useSelector((state) => state.user);
  const {
    listDataMultipleCountInfo, listDataMultipleCountLoading,
  } = useSelector((state) => state.ticket);

  const [viewModal, setViewModal] = useState(false);
  const [viewId, setViewId] = useState(false);
  const [hoveredRow, setValue] = useState(false);
  const [dataColumns, setDataColumns] = useState(false);

  const [savedRecords, setSavedRecords] = useState([]);

  const { updatePartsOrderInfo } = useSelector((state) => state.workorder);

  const dataList = listDataMultipleCountInfo && !listDataMultipleCountInfo.err && !listDataMultipleCountLoading && listDataMultipleCountInfo.data ? listDataMultipleCountInfo.data : [];

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
    const fieldsArray = ['planned_in', 'planned_out', 'date_start_scheduled', 'date'];
    let value = '';
    if (typeof item[col.property] === 'object') {
      const array = item[col.property];
      // eslint-disable-next-line no-unused-vars
      const [id, name] = array;
      value = name;
    } else {
      if (col.property === 'maintenance_type' && modelName === 'mro.order') {
        value = getMTName(item[col.property]);
      } else if ((col.property === 'state' && modelName === 'mro.order') || col.property === 'order_state') {
        value = getWorkOrderStateText(item[col.property]);
      } else if (col.property === 'description' && modelName === 'website.support.ticket') {
        value = truncateFrontSlashs(truncateStars(item[col.property]));// <Markup content={truncateFrontSlashs(truncateStars(item[col.property]))} />;
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
      } else if (fieldsArray.includes(col.property)) {
        value = getCompanyTimezoneDate(item[col.property], userInfo, 'datetime');
      } else if (col.property === 'low_stock_percent') {
        value = parseInt(item[col.property]);
      } else if (checkIsDate(item[col.property])) {
        value = getCompanyTimezoneDate(item[col.property], userInfo, 'datetime');
      } else {
        value = typeof item[col.property] === 'number' ? parseFloat(item[col.property]).toFixed(2) : getDefaultNoValue(item[col.property]);
      }
    }
    return value;
  }

  useEffect(() => {
    if (columns && columns.length) {
      const newArrData = [];
      columns.map((cl) => {
        const obj = {
          headerName: cl.heading,
          field: cl.property,
          width: 170,
          resizable: true,
          sortable: true,
          valueGetter: (params) => showCustomizedLabel(params.row, cl),
        };
        newArrData.push(obj);
      });
      setDataColumns(newArrData);
    }
  }, [columns]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (updatePartsOrderInfo && updatePartsOrderInfo.data && modelName === 'hx.breakdown_tracker') {
      dispatch(getTrackerDetail(viewId, modelName));
    }
  }, [updatePartsOrderInfo]);

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
      } else if (modelName === 'hx.inspection_checklist_log' || modelName === 'hx.inspection_log_report_view') {
        dispatch(getInspectionDetail(userInfo && userInfo.data && userInfo.data.company ? userInfo.data.company.id : false, modelName, viewId));
      } else if (modelName === 'ppm.scheduler_week' || modelName === 'ppm.scheduler_week_report_view') {
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
      } else if (modelName === 'hx.sla.kpi_audit' || modelName === 'hx.sla_audit_category_logs_report_view') {
        dispatch(getSlaAuditDetail(viewId, 'hx.sla.kpi_audit'));
      } else if (modelName === 'hx.tracker') {
        dispatch(getCtDetail(viewId, modelName));
      } else if (modelName === 'hx.incident') {
        dispatch(getIncidentDetail(viewId, modelName));
      }
    }
  }, [viewId]);

  const handlePopoverOpen = (event) => {
    const { id } = event.currentTarget.parentElement.dataset;
    setValue(id);
  };

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
    if (modelName === 'stock.quant_report_view') {
      setViewId(event.row.product_id && event.row.product_id.length ? event.row.product_id[0] : event.row.id);
    } else {
      setViewId(event.row.id);
    }
    setViewModal(getIsDetailView());
  };

  const handlePopoverClose = () => {
    setValue('');
  };

  return (
    <>
      {dataColumns && dataColumns.length > 0 && (
        <div className="p-0">
          <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={dataList}
              columns={dataColumns}
              onRowClick={(params) => onViewClick(params)}
              checkboxSelection
              disableSelectionOnClick
              components={{ Toolbar: GridToolbar }}
              loading={listDataMultipleCountLoading}
              componentsProps={{
                cell: {
                  onMouseEnter: handlePopoverOpen,
                  onMouseLeave: handlePopoverClose,
                },
              }}
              disableColumnResize={false}
              experimentalFeatures={{ newEditingApi: true }}
            />
          </Box>
          { /* <Table className="mb-0 font-weight-400 border-0" width="100%">
          <thead>
            <tr>
              {columns.map((col) => (
                <th className="p-2 min-width-160 table-column" key={`header-${col.heading}`}>
                  <div className="font-weight-bold font-size-11">
                    {col.heading}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={`${item[propertyAsKey]}-row`}>
                {columns.map((col) => (
                  <td
                    aria-hidden="true"
                    className="cursor-pointer"
                    key={`${item[propertyAsKey]}-${col.property}`}
                    onClick={() => { setViewId(item.id); setViewModal(modelName !== 'hx_stats.helpdesk_service_time' && modelName !== 'survey.user_input' && modelName !== 'mro.equipment.location'); }}
                  >
                    {showCustomizedLabel(item, col)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
                </Table> */ }
          <hr className="m-0" />
        </div>
      )}
      <Drawer
        title=""
        closable={false}
        className="drawer-bg-lightblue-no-scroll"
        width="90%"
        visible={viewModal && (modelName !== 'hx.inspection_checklist_log' && modelName !== 'ppm.scheduler_week' && modelName !== 'hx.inspection_log_report_view' && modelName !== 'ppm.scheduler_week_report_view')}
      >
        <DrawerHeader
          title="Detail View"
          imagePath={false}
          closeDrawer={() => setViewModal(false)}
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
      </Drawer>
      {(modelName === 'hx.inspection_checklist_log' || modelName === 'hx.inspection_log_report_view') && (
        <EventDetails eventDetailModel={viewModal} atFinish={() => setViewModal(false)} />
      )}
      {(modelName === 'ppm.scheduler_week' || modelName === 'ppm.scheduler_week_report_view') && (
        <EventPPMDetails eventDetailModel={viewModal} atFinish={() => setViewModal(false)} />
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
