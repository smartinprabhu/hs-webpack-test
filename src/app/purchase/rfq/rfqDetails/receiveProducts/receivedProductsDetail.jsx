import React, { useState, useEffect } from 'react';
import {
  IconButton, Button, Menu,
} from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import moment from 'moment-timezone';
import { Box } from '@mui/system';
import { useDispatch, useSelector } from 'react-redux';
import Drawer from '@mui/material/Drawer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle, faTimesCircle, faTag, faPrint,
  faEnvelope, faEdit, faClock, faUndoAlt,
} from '@fortawesome/free-solid-svg-icons';
import { BsThreeDotsVertical } from 'react-icons/bs';
import incomingIcon from '@images/icons/incomingStock.svg';
import outcomingIcon from '@images/icons/outgoingStock.svg';
import transferIcon from '@images/transfers.svg';

import Loader from '@shared/loading';

import {
  resetPurchaseState, getPrintReport, resetPrint, resetValidateState, resetScrap, resetMoveOrder,
  resetBackorder, resetUpdateReceiptInfo, getStockLocations, resetAddReceiptInfo, getTransferDetail,
} from '../../../purchaseService';
import { resetCreateScrap } from '../../../../inventory/inventoryService';
import { getPartsData } from '../../../../preventiveMaintenance/ppmService';
import {
  getDefaultNoValue,
  getListOfModuleOperations, extractTextObject,
  TabPanel, getAllowedCompanies,
} from '../../../../util/appUtils';

import CancelTransfer from '../actionItems/cancelTransfer';
import DeliverTransfer from '../actionItems/deliverTransfer';
import ApproveTransfer from '../actionItems/approveTransfer';
import Scrap from '../actionItems/scrap';
import Return from '../actionItems/return';
import CheckAvailability from '../actionItems/checkAvailability';
import Unreserve from '../actionItems/unreserve';
import rfqActions from '../../data/customData.json';
import actionCodes from '../../../../inventory/data/actionCodes.json';
import AddReceipt from './addReceipt/addReceiptNew';
import customDataDashboard from '../../../../inventory/overview/data/customData.json';
import DrawerHeader from '../../../../commonComponents/drawerHeader';
import Comments from '../../../../commonComponents/comments';

import {
  InwardStatusJson,
} from '../../../../commonComponents/utils/util';


// import tabs from './tabs.json';
import TranferBasicDetails from './transferBasicDetails';
import Products from './products';
import Scraps from './scraps';
import LogNotes from '../../../../assets/assetDetails/logNotes';
import AddScheduleActivity from '../../../utils/addSheduleActivity/addSheduleActivity';
import AuditLog from '../../../../assets/assetDetails/auditLog';
import ScheduleActivities from '../../../../assets/assetDetails/scheduleActivities';
import SendMessageForm from '../../../utils/sendMessageForm';

import DetailViewHeader from '../../../../commonComponents/detailViewHeader';
import DetailViewTab from '../../../../commonComponents/detailViewTab';
import Documents from '../../../../commonComponents/documents';

const appModels = require('../../../../util/appModels').default;

const faIcons = {
  APPROVE: faCheckCircle,
  APPROVEACTIVE: faCheckCircle,
  PRINT: faPrint,
  PRINTACTIVE: faPrint,
  REJECT: faTimesCircle,
  REJECTACTIVE: faTimesCircle,
  RETURN: faTag,
  RETURNACTIVE: faTag,
  SCRAP: faTimesCircle,
  SCRAPACTIVE: faTimesCircle,
  DELIVER: faEnvelope,
  DELIVERACTIVE: faEnvelope,
  LOGNOTE: faEdit,
  LOGNOTEACTIVE: faEdit,
  SCHEDULEACTIVITY: faClock,
  SCHEDULEACTIVITYACTIVE: faClock,
  MARKASTODO: faCheckCircle,
  MARKASTODOACTIVE: faCheckCircle,
  AVAILABILITY: faCheckCircle,
  AVAILABILITYACTIVE: faCheckCircle,
  UNRESERVE: faUndoAlt,
  UNRESERVEACTIVE: faUndoAlt,
};

const defaultIcon = {
  outgoing: outcomingIcon,
  incoming: incomingIcon,
  internal: transferIcon,
};

const tabs = ['Overview', 'Attachments', 'Audit Log'];

const ReceivedProductsDetail = ({ isEdits, transferCode, pickingId }) => {
  // const { transferDetailss } = useSelector((state) => state.purchase);
  { /* <Row className="m-0 bg-lightblue">
  <Col sm="12" md="12" lg="12" xs="12" className="p-0 thin-scrollbar">
    <ReceivedDetailInfo transferDetails={transferDetails} />
    <ReceivedDetailTabs transferDetails={transferDetails} />
  </Col>
</Row> */ }
  const { transferDetails } = useSelector((state) => state.purchase);

  const dispatch = useDispatch();
  const defaultActionText = 'Actions';
  const resModelId = 235;
  const [enterAction, setEnterAction] = useState(false);
  const [changeLocationActionOpen, setLocationActionOpen] = useState(false);
  const [selectedActions, setSelectedActions] = useState(defaultActionText);
  const [validateModal, showValidateModal] = useState(false);
  const [printModal, showPrintModal] = useState(false);
  const [cancelModal, showCancelModal] = useState(false);
  const [todoModal, showTodoModal] = useState(false);
  const [scrapModal, showScrapModal] = useState(false);
  const [returnModal, showReturnModal] = useState(false);
  const [availModal, showAvailModal] = useState(false);
  const [unreserveModal, showUnreserveModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [value, setValue] = useState(0);
  const [selectedActionImage, setSelectedActionImage] = useState('');

  const [isMultiLocation, setMultiLocation] = useState(false);
  const [locationId, setLocationId] = useState(false);
  const [locationName, setLocationName] = useState(false);
  const [editLink, setEditLink] = useState(false);
  const [editId, setEditId] = useState(false);
  const [isEdit, setEdit] = useState(false);

  const customNames = customDataDashboard.types;

  const { userInfo, userRoles } = useSelector((state) => state.user);
  
  const companies = getAllowedCompanies(userInfo);
  const {

    printReportInfo,
    stockLocations,
    updateReceiptInfo,
  } = useSelector((state) => state.purchase);

  const { inventoryStatusDashboard, operationTypeDetails } = useSelector((state) => state.inventory);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Inventory', 'code');
  const changeLocationActionToggle = () => setLocationActionOpen(!changeLocationActionOpen);
  const isCancelableDefault = allowedOperations.includes(actionCodes['Cancel Transfer']);
  const isReturnableDefault = allowedOperations.includes(actionCodes['Return Transfer']);
  const isApprovableDefault = allowedOperations.includes(actionCodes['Approve Transfer']);
  const isDeliverableDefault = allowedOperations.includes(actionCodes['Deliver Transfer']);

  const isInwardApprovable = isApprovableDefault || allowedOperations.includes(actionCodes['Approve Inward Transfer']);
  const isOutwardApprovable = isApprovableDefault || allowedOperations.includes(actionCodes['Approve Outward Transfer']);
  const isMaterialApprovable = isApprovableDefault || allowedOperations.includes(actionCodes['Approve Material Transfer']);

  const isInwardDeliverable = isDeliverableDefault || allowedOperations.includes(actionCodes['Deliver Inward Transfer']);
  const isOutwardDeliverable = isDeliverableDefault || allowedOperations.includes(actionCodes['Deliver Outward Transfer']);
  const isMaterialDeliverable = isDeliverableDefault || allowedOperations.includes(actionCodes['Deliver Material Transfer']);

  const isInwardCancelable = isCancelableDefault || allowedOperations.includes(actionCodes['Cancel Inward Transfer']);
  const isOutwardCancelable = isCancelableDefault || allowedOperations.includes(actionCodes['Cancel Outward Transfer']);
  const isMaterialCancelable = isCancelableDefault || allowedOperations.includes(actionCodes['Cancel Material Transfer']);

  const isInwardReturnable = isReturnableDefault || allowedOperations.includes(actionCodes['Return Inward Transfer']);
  const isOutwardReturnable = isReturnableDefault || allowedOperations.includes(actionCodes['Return Outward Transfer']);
  const isMaterialReturnable = isReturnableDefault || allowedOperations.includes(actionCodes['Return Material Transfer']);

  let isCancelable = false;
  let isReturnable = false;
  let isApprovable = false;
  let isDeliverable = false;

  if (transferCode === 'incoming') {
    isApprovable = isInwardApprovable;
    isDeliverable = isInwardDeliverable;
    isCancelable = isInwardCancelable;
    isReturnable = isInwardReturnable;
  } else if (transferCode === 'outgoing') {
    isApprovable = isOutwardApprovable;
    isDeliverable = isOutwardDeliverable;
    isCancelable = isOutwardCancelable;
    isReturnable = isOutwardReturnable;
  } else if (transferCode === 'internal') {
    isApprovable = isMaterialApprovable;
    isDeliverable = isMaterialDeliverable;
    isCancelable = isMaterialCancelable;
    isReturnable = isMaterialReturnable;
  }

  useEffect(() => {
    const ViewId = transferDetails && transferDetails.data ? transferDetails.data[0].id : '';
    const rpState = transferDetails && transferDetails.data ? transferDetails.data[0].state : '';
    if (printModal && ViewId) {
      if (rpState === 'assigned') {
        dispatch(getPrintReport(ViewId, 'stock.report_picking'));
      }
      if (rpState === 'done') {
        dispatch(getPrintReport(ViewId, 'stock.report_deliveryslip'));
      }
    }
  }, [printModal]);

  useEffect(() => {
    if (stockLocations && stockLocations.data && stockLocations.data.length && stockLocations.data.length > 1) {
      setMultiLocation(true);
    } else if (stockLocations && stockLocations.data && stockLocations.data.length) {
      setMultiLocation(false);
      setLocationId(stockLocations.data[0].id);
      setLocationName(stockLocations.data[0].name);
    }
  }, [stockLocations]);

  useEffect(() => {
    if (printReportInfo && printReportInfo.data) {
      const pdfBase64 = printReportInfo.data.content;
      const dlnk = document.getElementById('dwnldLnk');
      dlnk.href = `data:application/octet-stream;base64,${pdfBase64}`;
      dlnk.click();
      setSelectedActions(defaultActionText);
      showPrintModal(false);
      dispatch(resetPrint());
    }
  }, [printReportInfo]);

  useEffect(() => {
    if (selectedActions === 'Approve') {
      dispatch(resetUpdateReceiptInfo());
      dispatch(resetAddReceiptInfo());
      dispatch(getPartsData([]));
      showValidateModal(true);
    }
    if (selectedActions === 'Deliver') {
      dispatch(resetUpdateReceiptInfo());
      dispatch(resetAddReceiptInfo());
      dispatch(getPartsData([]));
      showTodoModal(true);
    }
    if (selectedActions === 'Print') {
      showPrintModal(true);
    }
    if (selectedActions === 'Reject') {
      showCancelModal(true);
    }
    if (selectedActions === 'Scrap') {
      showScrapModal(true);
    }
    if (selectedActions === 'Return') {
      showReturnModal(true);
    }
    if (selectedActions === 'Check Availability') {
      showAvailModal(true);
    }
    if (selectedActions === 'Unreserve') {
      showUnreserveModal(true);
    }
  }, [enterAction]);

  /* const getPdfName = () => {
    let pdfName = 'Receive products';
    const rpState = transferDetails && transferDetails.data ? transferDetails.data[0].state : '';
    if (rpState === 'assigned') {
      pdfName = 'Picking Operations';
    }
    if (rpState === 'done') {
      pdfName = 'Delivery Slip';
    }
    return pdfName;
  };  */

  const cancelPurchaseState = () => {
    dispatch(resetPurchaseState());
  };

  const cancelState = () => {
    dispatch(resetPurchaseState());
    dispatch(resetValidateState());
    dispatch(resetBackorder());
  };

  const cancelScrapState = () => {
    dispatch(resetPurchaseState());
    dispatch(resetCreateScrap());
    dispatch(resetScrap());
    dispatch(resetMoveOrder());
  };

  /* const checkActionAllowed = (actionName) => {
    let allowed = true;
    const showValidate = transferDetails && transferDetails.data ? transferDetails.data[0].show_validate : false;
    const showAvailability = transferDetails && transferDetails.data ? transferDetails.data[0].show_check_availability : false;
    const isLocked = transferDetails && transferDetails.data ? transferDetails.data[0].is_locked : false;
    const rpState = transferDetails && transferDetails.data ? transferDetails.data[0].state : '';
    const pickingTypeCode = transferDetails && transferDetails.data ? transferDetails.data[0].picking_type_code : '';
    const showMarkAsTodo = transferDetails && transferDetails.data ? transferDetails.data[0].show_mark_as_todo : '';

    if (actionName === 'Validate') {
      if (!showValidate || (rpState === 'waiting' && rpState === 'confirmed')) {
        allowed = false;
      }
    }
    if (actionName === 'Check Availability') {
      if (!showAvailability || (rpState === 'draft' && rpState === 'assigned')) {
        allowed = false;
      }
    }
    if (actionName === 'Print') {
      if (!isLocked || (rpState !== 'partially_available' && rpState !== 'assigned' && rpState !== 'done')) {
        allowed = false;
      }
    }
    if (actionName === 'Unreserve') {
      if (rpState === 'cancel' || rpState === 'done' || rpState === 'draft' || rpState === 'waiting') {
        allowed = false;
      } else if (!isLocked || (pickingTypeCode !== 'incoming' && (rpState === 'partially_available'))) {
        allowed = false;
      }
    }
    if (actionName === 'Cancel') {
      if (!isLocked || (rpState !== 'partially_available' && rpState !== 'draft' && rpState !== 'waiting' && rpState !== 'confirmed' && rpState !== 'assigned')) {
        allowed = false;
      }
    }
    if (actionName === 'Scrap') {
      if (!isLocked || (pickingTypeCode !== 'incoming' && (rpState === 'draft' || rpState === 'cancel' || rpState === 'waiting')) || (pickingTypeCode === 'incoming' && rpState !== 'done')) {
        allowed = false;
      }
    }
    if (actionName === 'Return') {
      if (!isLocked || (rpState !== 'done')) {
        allowed = false;
      }
    }
    if (actionName === 'Mark as Todo') {
      if (!showMarkAsTodo) {
        allowed = false;
      }
    }
    return allowed;
  }; */

  const checkActionAllowed = (actionName) => {
    let allowed = false;
    const showValidate = transferDetails && transferDetails.data ? transferDetails.data[0].show_validate : false;
    const showAvailability = transferDetails && transferDetails.data ? transferDetails.data[0].show_check_availability : false;
    const isLocked = transferDetails && transferDetails.data ? transferDetails.data[0].is_locked : false;
    const rpState = transferDetails && transferDetails.data ? transferDetails.data[0].request_state : '';
    const pickingTypeCode = transferDetails && transferDetails.data ? transferDetails.data[0].picking_type_code : '';
    const showMarkAsTodo = transferDetails && transferDetails.data ? transferDetails.data[0].show_mark_as_todo : '';
    const isApprovalRequired = operationTypeDetails && operationTypeDetails.data && operationTypeDetails.data.length && operationTypeDetails.data[0].is_confirmed;

    /* if (actionName === 'Validate') {
      if (showValidate && (rpState === 'assigned' || rpState === 'confirmed')) {
        allowed = true;
      }
    }
    if (actionName === 'Check Availability') {
      if (showAvailability && pickingTypeCode !== 'incoming' && rpState === 'confirmed') {
        allowed = true;
      }
    }
    if (actionName === 'Print') {
      if (isLocked && rpState === 'done') {
        allowed = true;
      }
    }
    if (actionName === 'Unreserve') {
      if (isLocked && pickingTypeCode !== 'incoming' && rpState === 'assigned') {
        allowed = true;
      }
    } */
    if (actionName === 'Approve') {
      if (isLocked && rpState === 'Requested' && isApprovalRequired && isApprovable) {
        allowed = true;
      }
    }
    if (actionName === 'Deliver') {
      if (((isLocked && rpState === 'Approved') || (rpState === 'Requested' && !isApprovalRequired)) && isDeliverable) {
        allowed = true;
      }
    }
    if (actionName === 'Reject') {
      if (isLocked && rpState !== 'Delivered' && rpState !== 'Rejected' && isCancelable) {
        allowed = true;
      }
    }
    /* if (actionName === 'Scrap') {
      if (isLocked) {
        if (pickingTypeCode === 'incoming' && rpState === 'done') {
          allowed = true;
        } else if (pickingTypeCode !== 'incoming' && (rpState === 'assigned' || rpState === 'done' || rpState === 'confirmed')) {
          allowed = true;
        }
      }
    } */
    if (actionName === 'Return' && isReturnable) {
      if (isLocked && rpState === 'Delivered' && pickingTypeCode !== 'outgoing') {
        allowed = true;
      }
    }
    /* if (actionName === 'Mark as Todo') {
      if (showMarkAsTodo) {
        allowed = true;
      }
    } */
    return allowed;
  };

  /* function checkCurrentState(cstate, vstate) {
    let result = true;
    if (cstate !== 'cancel' && vstate === 'cancel') {
      result = false;
    }
    if (cstate !== 'waiting' && vstate === 'waiting') {
      result = false;
    }
    return result;
  } */

  const switchActionItem = (action) => {
    setLocationActionOpen(!changeLocationActionOpen);
    setSelectedActions(action.displayname);
    setSelectedActionImage(action.name);
    setEnterAction(Math.random());
    handleClose();
  };

  const detailData = transferDetails && (transferDetails.data && transferDetails.data.length > 0) ? transferDetails.data[0] : '';

  const onReset = () => {
    if (detailData && detailData.id && updateReceiptInfo && updateReceiptInfo.data) {
      dispatch(getTransferDetail(detailData.id, appModels.STOCK));
    }
    dispatch(resetUpdateReceiptInfo());
    dispatch(resetAddReceiptInfo());
    // dispatch(getPartsData([]));
  };
  // const rpName = detailData ? detailData.name : '';
  // const vendorName = detailData && detailData.partner_id ? extractTextObject(detailData.partner_id) : '';
  const loading = transferDetails && transferDetails.loading;

  function getItemData(type) {
    let res = detailData.asset_id;
    if (type === 'Location') {
      res = detailData.space_id;
    } else if (type === 'Employee') {
      res = detailData.employee_id;
    } else if (type === 'Department') {
      res = detailData.department_id;
    }
    return res;
  }

  function getStatusFieldName(strName) {
    let res = '';
    if (strName === 'Requested') {
      res = 'requested_display';
    } else if (strName === 'Approved') {
      res = 'approved_display';
    } else if (strName === 'Delivered') {
      res = 'delivered_display';
    } else if (strName === 'Rejected') {
      res = 'rejected_display';
    }
    return res;
  }

  function getStatusDynamicStaus(label) {
    let newStr = label;
    const dName = getStatusFieldName(label);
    const pickingData = inventoryStatusDashboard && inventoryStatusDashboard.data && inventoryStatusDashboard.data.Operations ? inventoryStatusDashboard.data.Operations : [];
    const pCode = detailData && detailData.picking_type_code ? detailData.picking_type_code : '';
    const ogData = pickingData.filter((item) => (item.code === pCode));
    if (ogData && ogData.length && dName) {
      newStr = ogData[0][dName];
    }
    return newStr;
  }

  function getStatusDynamicBtnStaus(label, fieldName) {
    let newStr = label;
    const pickingData = inventoryStatusDashboard && inventoryStatusDashboard.data && inventoryStatusDashboard.data.Operations ? inventoryStatusDashboard.data.Operations : [];
    const pCode = detailData && detailData.picking_type_code ? detailData.picking_type_code : '';
    const ogData = pickingData.filter((item) => (item.code === pCode));
    if (ogData && ogData.length && fieldName && ogData[0][fieldName]) {
      newStr = ogData[0][fieldName];
    }
    return newStr;
  }

  function getStatusDynamicBtnStausLoad(label) {
    let newStr = label;
    if (label === 'Approve' || label === 'Deliver') {
      let fieldName = '';
      if (label === 'Deliver') {
        fieldName = 'bn_delivered';
      } else {
        fieldName = 'bn_approved';
      }
      const pickingData = inventoryStatusDashboard && inventoryStatusDashboard.data && inventoryStatusDashboard.data.Operations ? inventoryStatusDashboard.data.Operations : [];
      const pCode = detailData && detailData.picking_type_code ? detailData.picking_type_code : '';
      const ogData = pickingData.filter((item) => (item.code === pCode));
      if (ogData && ogData.length && fieldName && ogData[0][fieldName]) {
        newStr = ogData[0][fieldName];
      }
    }
    return newStr;
  }

  const checkInwardStatus = (val) => (
    <Box>
      {InwardStatusJson.map(
        (status) => val === status.status && (
          <Box
            sx={{
              backgroundColor: status.backgroundColor,
              padding: '4px 8px 4px 8px',
              border: 'none',
              borderRadius: '4px',
              color: status.color,
              fontFamily: 'Suisse Intl',
            }}
          >
            {val}
          </Box>
        ),
      )}
    </Box>
  );

  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const isEditableDefault = allowedOperations.includes(actionCodes['Edit Transfer']);

  const isInwardEditable = (isEditableDefault || allowedOperations.includes(actionCodes['Edit Inward Transfer'])) && transferDetails && transferDetails.data && transferDetails.data.length > 0 && !transferDetails.loading && transferDetails.data[0].request_state !== 'Delivered' && transferDetails.data[0].request_state !== 'Rejected' && transferDetails.data[0].request_state !== 'Approved';
  const isOutwardEditable = (isEditableDefault || allowedOperations.includes(actionCodes['Edit Outward Transfer'])) && transferDetails && transferDetails.data && transferDetails.data.length > 0 && !transferDetails.loading && transferDetails.data[0].request_state !== 'Delivered' && transferDetails.data[0].request_state !== 'Rejected' && transferDetails.data[0].request_state !== 'Approved';
  const isMaterialEditable = (isEditableDefault || allowedOperations.includes(actionCodes['Edit Material Transfer'])) && transferDetails && transferDetails.data && transferDetails.data.length > 0 && !transferDetails.loading && transferDetails.data[0].request_state !== 'Delivered' && transferDetails.data[0].request_state !== 'Rejected' && transferDetails.data[0].request_state !== 'Approved';

  let isEditable = false;
  

  if (transferCode === 'incoming') {
    isEditable = isInwardEditable;
  } else if (transferCode === 'outgoing') {
    isEditable = isOutwardEditable;
  } else if (transferCode === 'internal') {
    isEditable = isMaterialEditable;
  }

  // const isEditable = allowedOperations.includes(actionCodes['Edit Transfer']) && transferDetails && transferDetails.data && transferDetails.data.length > 0 && !transferDetails.loading && transferDetails.data[0].request_state !== 'Delivered' && transferDetails.data[0].request_state !== 'Rejected';

  return (
    <>
      {detailData && (
        <>
          <Box>

            <DetailViewHeader
              mainHeader={getDefaultNoValue(extractTextObject(transferCode !== 'internal' && detailData.partner_id ? detailData.partner_id : detailData.name))}
              status={
                detailData.request_state
                  ? checkInwardStatus(detailData.request_state)
                  : '-'
              }
              subHeader={(
                <>
                  {detailData.create_date
                    && userInfo.data
                    && userInfo.data.timezone
                    ? moment
                      .utc(detailData.create_date)
                      .local()
                      .tz(userInfo.data.timezone)
                      .format('yyyy MMM Do, hh:mm A')
                    : '-'}
                  {' '}

                </>
              )}
              actionComponent={(
                <Box>
                  <Comments
                    detailData={transferDetails}
                    model={appModels.STOCK}
                    messageType="comment"
                    getDetail={getTransferDetail}
                    setTab={setValue}
                    tab={value}
                  />
                  {isEditable && (
                  <Button
                    type="button"
                    variant="outlined"
                    className="ticket-btn"
                    sx={{
                      backgroundColor: '#fff',
                      '&:hover': {
                        backgroundColor: '#fff',
                      },
                    }}
                    onClick={() => {
                      setEditLink(true);
                      dispatch(getStockLocations(companies, appModels.STOCKLOCATION, false, 'scrap'));
                      handleClose(false);
                      setEditId(detailData.id);
                      setEdit(true);
                    }}
                  >
                    Edit
                  </Button>
                  )}
                  <IconButton
                    sx={{
                      margin: '0px 5px 0px 5px',
                    }}
                    id="demo-positioned-button"
                    aria-controls={open ? 'demo-positioned-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleMenuClick}
                  >
                    <BsThreeDotsVertical color="#ffffff" />
                  </IconButton>
                  <Menu
                    id="demo-positioned-menu"
                    aria-labelledby="demo-positioned-button"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                    }}
                  >

                    {rfqActions
                      && rfqActions.actionTransferItems.map(
                        (actions) => checkActionAllowed(
                          actions.displayname,
                          transferDetails,
                          'Actions',
                        ) && (
                        <MenuItem
                          sx={{
                            font: 'normal normal normal 15px Suisse Intl',
                          }}
                          id="switchAction"
                          className="pl-2"
                          key={actions.id}
                              /*  disabled={
                                 !checkActionAllowedDisabled(actions.displayname)
                               } */
                          onClick={() => switchActionItem(actions)}
                        >
                          <FontAwesomeIcon
                            className="mr-2"
                            icon={faIcons[actions.name]}
                          />
                          {actions.displayname}

                        </MenuItem>
                        ),
                      )}
                  </Menu>
                </Box>
              )}
            />
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                height: '100%',
              }}
            >
              <Box
                sx={{
                  width: '100%',
                }}
              >
                <DetailViewTab
                  value={value}
                  handleChange={handleTabChange}
                  tabs={tabs}
                />

                <TabPanel value={value} index={0}>
                  <TranferBasicDetails isEdit={isEdits} detail={transferDetails} transferCode={transferCode} />
                </TabPanel>
                <TabPanel value={value} index={3}>
                  <Products />
                </TabPanel>
                <TabPanel value={value} index={4}>
                  <Scraps />
                </TabPanel>
                <TabPanel value={value} index={1}>
                  <Documents
                    viewId={transferDetails.data[0].id}
                    reference={transferDetails.data[0].name}
                    resModel={appModels.STOCK}
                    model={appModels.DOCUMENT}
                  />
                </TabPanel>

                <TabPanel value={value} index={2}>
                  <LogNotes ids={detailData.message_ids} />
                </TabPanel>
                <TabPanel value={value} index={5}>
                  <div>
                    <SendMessageForm
                      atFinish={() => {
                        cancelMessage();
                      }}
                      modalName={appModels.STOCK}
                      detail={transferDetails}
                    />
                    <br />
                    {' '}
                    <br />
                    <AuditLog ids={detailData.message_ids} />
                  </div>
                </TabPanel>
                <TabPanel value={value} index={6}>
                  <div>
                    <AddScheduleActivity
                      detail={transferDetails}
                      modalName={appModels.STOCK}
                      resModelId={resModelId}
                      afterReset={() => { cancelActivity(); }}
                    />
                    <br />
                    <ScheduleActivities resModalName={appModels.STOCK} resId={detailData.id} />
                  </div>
                </TabPanel>

              </Box>

              {/* <Box
                sx={{
                  width: "25%",
                  height: "100%",
                  backgroundColor: "#F6F8FA",
                }}
              >
             <DetailViewRightPanel
                  //panelOneHeader={transferCode !== 'internal' ? "VENDOR" : ''}
                  //panelOneLabel={transferCode !== 'internal' ? getDefaultNoValue(extractTextObject(detailData.partner_id)) : ''}
                  // panelOneValue1={getDefaultNoValue((detailData.display_name))}
                  // panelOneValue2={getDefaultNoValue(detailData.mobile)}
                  //   panelThreeHeader="Inventory Information"
                  panelThreeData={[
                    /*{
                      header: "Created on",
                      value: getDefaultNoValue(
                        getCompanyTimezoneDate(
                          detailData.create_date,
                          userInfo,
                          "datetime"
                        )
                      ),
                    },
                    {
                      header: "Status",
                      value:
                        detailData.request_state
                          ? checkInwardStatus(detailData.request_state)
                          : "-",
                    },*
                  {
                    header: "Expiry Date",
                    value: getDefaultNoValue(
                      getCompanyTimezoneDate(
                        detailData.expires_on,
                        userInfo,
                        "datetime"
                      )
                    ),
                  },

                  ]}
                />
              </Box> */}

            </Box>
            <Drawer
              PaperProps={{
                sx: { width: '50%' },
              }}
              anchor="right"
              open={editLink}
            >

              <DrawerHeader
                headerName={`Edit ${customNames[transferCode] ? customNames[transferCode].text : 'Transfer'}`}
                onClose={() => { setEditLink(false); onReset(); }}
              />
              <AddReceipt
                id={false}
                editId={detailData && detailData.id ? detailData.id : false}
                afterReset={() => { setEditLink(false); onReset(); }}
                code={transferCode}
                isMultiLocation={isMultiLocation}
                locationId={locationId}
                locationName={locationName}
                isShow={editLink}
                pickingData={pickingId ? { id: pickingId, name: transferCode } : {}}
              />
            </Drawer>
          </Box>
          {validateModal && (
            <ApproveTransfer
              atFinish={() => {
                showValidateModal(false); setSelectedActions(defaultActionText); onReset();
              }}
              transferDetails={transferDetails}
              title={`${getStatusDynamicBtnStaus('Approve', 'bn_approved')} ${customNames[detailData && detailData.picking_type_code ? detailData.picking_type_code : ''] ? customNames[detailData && detailData.picking_type_code ? detailData.picking_type_code : ''].text : 'Transfer'}`}
              submitText={getStatusDynamicBtnStaus('Approve', 'bn_approved')}
              actionMsg={getStatusDynamicStaus('Approved')}
              validateModal
            />
          )}
          {todoModal && (
            <DeliverTransfer
              atFinish={() => {
                showTodoModal(false); setSelectedActions(defaultActionText); onReset();
              }}
              transferDetails={transferDetails}
              title={`${getStatusDynamicBtnStaus('Deliver', 'bn_delivered')} ${customNames[detailData && detailData.picking_type_code ? detailData.picking_type_code : ''] ? customNames[detailData && detailData.picking_type_code ? detailData.picking_type_code : ''].text : 'Transfer'}`}
              submitText={getStatusDynamicBtnStaus('Deliver', 'bn_delivered')}
              actionMsg={getStatusDynamicStaus('Delivered')}
              todoModal
            />
          )}
          {cancelModal && (
            <CancelTransfer
              atFinish={() => {
                showCancelModal(false); setSelectedActions(defaultActionText); cancelPurchaseState();
              }}
              transferDetails={transferDetails}
              cancelModal
            />
          )}
          {scrapModal && (
            <Scrap
              atFinish={() => {
                showScrapModal(false); setSelectedActions(defaultActionText); cancelScrapState();
              }}
              transferDetails={transferDetails}
              scrapModal
            />
          )}
          {returnModal && (
            <Return
              atFinish={() => {
                showReturnModal(false); setSelectedActions(defaultActionText); cancelScrapState();
              }}
              transferDetails={transferDetails}
              returnModal
            />
          )}
          {availModal && (
            <CheckAvailability
              atFinish={() => {
                showAvailModal(false); setSelectedActions(defaultActionText); cancelPurchaseState();
              }}
              transferDetails={transferDetails}
              availModal
            />
          )}
          {unreserveModal && (
            <Unreserve
              atFinish={() => {
                showUnreserveModal(false); setSelectedActions(defaultActionText); cancelPurchaseState();
              }}
              transferDetails={transferDetails}
              unreserveModal
            />
          )}
        </>
      )}
      {loading && (
        <div className="text-center mt-3">
          <Loader />
        </div>
      )}
    </>
  );
};
export default ReceivedProductsDetail;
