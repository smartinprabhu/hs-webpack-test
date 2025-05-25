import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/system';
import {
  IconButton, Typography, Button, Divider, Menu,
} from '@mui/material';
import { BsThreeDotsVertical } from 'react-icons/bs';
import MenuItem from '@mui/material/MenuItem';
import moment from 'moment-timezone';
import Drawer from '@mui/material/Drawer';

import escalate from '@images/icons/escalateBlack.svg';
import reassign from '@images/icons/ticketBlack.svg';
import workorders from '@images/icons/workOrdersBlack.svg';
import message from '@images/icons/messageBlack.svg';
import closeIcon from '@images/icons/closeCircleGrey.svg';
import holdIcon from '@images/icons/auditBlack.svg';
import shareIcon from '@images/icons/shareBlack.svg';
import ticketIcon from '@images/sideNavImages/helpdesk_black.svg';

import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import {
  getDefaultNoValue,
  getListOfOperations,
  htmlSanitizeInput,
  stripHtmlTags,
  extractTextObject,
  getAllCompanies,
  getCompanyTimezoneDate,
  truncateHTMLTags,
  getTenentOptions,
  extractValueObjects,
  TabPanel,
} from '../../util/appUtils';
import { getPrintReport, resetPrint } from '../../purchase/purchaseService';
import {
  getTicketChannelFormLabel,
  getIssueTypeLabel,
  getTicketOrderStateText,
  getMTLabel,
  checkActionAllowed,
  getSLALabel, getAge, getSLATimeClosed, getSLAStatusCheckClose, getSLAStatusCheck, getSLATime,
} from '../utils/utils';
import AuditLog from '../../commonComponents/auditLogs';
import Documents from '../../commonComponents/documents';
import Comments from '../../commonComponents/comments';
import PropertyAndValue from '../../commonComponents/propertyAndValue';
import DrawerHeader from '../../commonComponents/drawerHeader';
import DetailViewHeader from '../../commonComponents/detailViewHeader';
import DetailViewTab from '../../commonComponents/detailViewTab';
import DetailViewRightPanel from '../../commonComponents/detailViewRightPanel';
import DetailViewLeftPanel from '../../commonComponents/detailViewLeftPanel';
import CreateTicketForm from '../forms/createTicketForm';
import {
  heldeskStatusJson,
  helpdeskPrioritiesJson,
  detailViewHeaderClass,
} from '../../commonComponents/utils/util';
import actionCodes from '../data/helpdeskActionCodes.json';
import ticketActions from '../data/ticketsActions.json';
import {
  resetshareTicket,
  getTicketDetail,
  resetMessage,
  resetEscalate,
  resetClose,
  getOrdersFullDetails,
  getSiteBasedCategory,
  resetOnHoldRequest,
  resetOnHoldTicket,
  resetImage,
  resetUpdateTicket,
  setTicketCurrentTab, getTicketOrders,
} from '../ticketService';
import {
  resetOrderCheckList,
  resetUpdateCheckList,
  getOrderDetail,
} from '../../workorders/workorderService';
import {
  getAssetDetail,
} from '../../assets/equipmentService';
import ReassignTicket from '../viewTicket/reassignTicket';
import EscalateTicket from '../viewTicket/escalateTicket';
import CloseTicket from '../viewTicket/closeTicket';
import SendMessage from '../viewTicket/sendMessage';
import CancelTicket from '../viewTicket/cancelTicket';
import CheckList from '../../workorders/viewWorkorder/actionItems/checklistFinish';
import ActionWorkorder from '../../workorders/viewWorkorder/actionItems/actionWorkorder';
import CloseWorkorder from '../../workorders/viewWorkorder/actionItems/closeWorkorder';
import AcceptWorkorder from '../../workorders/viewWorkorder/actionItems/acceptStartWorkorder';
import PauseWorkorder from '../../workorders/viewWorkorder/actionItems/pauseWorkorder';
import OrderDetail from '../../workorders/viewWorkorder/orderDetail';
import WorkorderDetails from '../../workorders/workorderDetails/workorderDetails';
import InProgressTicket from '../../workorders/viewWorkorder/actionItems/inProgressTicket';
import ShareTicket from '../viewTicket/shareTicket';
import EscalationMatrix from './escalationMatrix';
import { AddThemeColor } from '../../themes/theme';
import OnHoldRequest from '../viewTicket/onHoldRequest';
import LogNotes from '../viewTicket/logNotes';

const appModels = require('../../util/appModels').default;

const faIcons = {
  ESCALATETICKET: escalate,
  ESCALATETICKETACTIVE: escalate,
  REASSIGNTICKET: reassign,
  REASSIGNTICKETACTIVE: reassign,
  SENDMESSAGE: message,
  SENDMESSAGEACTIVE: message,
  CLOSETICKET: closeIcon,
  CLOSETICKETACTIVE: closeIcon,
  CANCELTICKET: closeIcon,
  CANCELTICKETACTIVE: closeIcon,
  OPENWORKORDER: workorders,
  OPENWORKORDERACTIVE: workorders,
  STARTASSESSMENT: workorders,
  STARTASSESSMENTACTIVE: workorders,
  FINISHASSESSMENT: workorders,
  FINISHASSESSMENTACTIVE: workorders,
  STARTREMEDIATION: workorders,
  STARTREMEDIATIONACTIVE: workorders,
  FINISHREMEDIATION: workorders,
  FINISHREMEDIATIONACTIVE: workorders,
  ONHOLDTICKET: holdIcon,
  ONHOLDTICKETACTIVE: holdIcon,
  SHARETICKET: shareIcon,
  SHARETICKETACTIVE: shareIcon,
  PROGRESSTICKET: reassign,
  PROGRESSTICKETACTIVE: reassign,
  PRINTPDFA: holdIcon,
  PRINTPDFAACTIVE: holdIcon,
  PRINTPDFB: holdIcon,
  PRINTPDFBACTIVE: holdIcon,
  PRINTPDFAB: holdIcon,
  PRINTPDFABACTIVE: holdIcon,
};

const TicketDetails = ({
  onViewEditReset,
  editId,
  setEditId,
  isIncident,
  setViewModal,
  setParentTicket,
  isAIEnabled,
  setCurrentTicket,
}) => {
  const {
    ticketDetail,
    incidentsOrderInfo,
    maintenanceConfigurationData,
    shareTicketInfo,
    onHoldApproval,
    siteCategoriesInfo,
    ticketOrders,
    tenantConfig,
  } = useSelector((state) => state.ticket);
  const defaultActionText = isIncident ? 'Incident Actions' : 'Ticket Actions';

  const dispatch = useDispatch();
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const { workorderDetails, stateChangeInfo, createCommentInfo } = useSelector(
    (state) => state.workorder,
  );
  const { printReportInfo } = useSelector((state) => state.purchase);

  const isVendorShow = maintenanceConfigurationData && !maintenanceConfigurationData.loading && maintenanceConfigurationData.data
  && maintenanceConfigurationData.data.length && maintenanceConfigurationData.data[0].is_vendor_field === 'Yes';

  let isTenant = maintenanceConfigurationData && !maintenanceConfigurationData.loading && maintenanceConfigurationData.data
  && maintenanceConfigurationData.data.length && maintenanceConfigurationData.data[0].tenant_visible && maintenanceConfigurationData.data[0].tenant_visible !== 'None';

  let isTicketType = maintenanceConfigurationData && !maintenanceConfigurationData.loading && maintenanceConfigurationData.data
  && maintenanceConfigurationData.data.length && maintenanceConfigurationData.data[0].ticket_type_visible && maintenanceConfigurationData.data[0].ticket_type_visible !== 'None';

  const configData = maintenanceConfigurationData && !maintenanceConfigurationData.loading && maintenanceConfigurationData.data
  && maintenanceConfigurationData.data.length && maintenanceConfigurationData.data[0];

  let isChannelVisible = configData && configData.channel_visible !== 'None';
  let isTeamVisible = configData && configData.maintenance_team_visible !== 'None';

  const companies = getAllCompanies(userInfo);

  const [value, setValue] = useState(0);
  const [editLink, setEditLink] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [changeLocationActionOpen, setLocationActionOpen] = useState(false);
  const [selectedActions, setSelectedActions] = useState(defaultActionText);
  const [selectedActionImage, setSelectedActionImage] = useState('');
  const [enterAction, setEnterAction] = useState(false);

  let tabs = ['Overview', 'Status Logs', 'Notes', 'Attachments'];

  const detailedData = ticketDetail && ticketDetail.data && ticketDetail.data.length
    ? ticketDetail.data[0]
    : '';

  const isTenantTicket = userInfo && userInfo.data && userInfo.data.associates_to && userInfo.data.associates_to === 'Tenant';

  if (isTenantTicket && getTenentOptions(userInfo, tenantConfig, detailedData && detailedData.tenant_id ? extractValueObjects(detailedData.tenant_id) : false)) {
    const tConfig = getTenentOptions(userInfo, tenantConfig, detailedData && detailedData.tenant_id ? extractValueObjects(detailedData.tenant_id) : false);
    isTenant = tConfig.tenant_visible !== 'None';
    isChannelVisible = tConfig.channel_visible !== 'None';
    isTicketType = tConfig.ticket_type_visible !== 'None';
    isTeamVisible = tConfig.maintenance_team_visible !== 'None';
  }

  if (detailedData.state_id && detailedData.state_id[1] === 'Closed') {
    tabs = ['Overview', 'Status Logs', 'Notes', 'Attachments', 'Resolutions'];
  }

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const allowedOperations = getListOfOperations(
    userRoles && userRoles.data ? userRoles.data.allowed_modules : [],
    'code',
  );

  const checkTicketsStatus = (val) => {
    const isCancelled = detailedData.is_cancelled;
    const isOnHoldRequested = detailedData.is_on_hold_requested;
    let stateValue = isCancelled ? 'Cancelled' : val;
    stateValue = isOnHoldRequested && val !== 'On Hold' && val !== 'Closed' ? 'On-Hold Requested' : stateValue;
    return (
      <Box>
        {heldeskStatusJson.map(
          (status) => stateValue === status.status && (
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
              {stateValue}
            </Box>
          ),
        )}
      </Box>
    );
  };

  const checkTicketPriority = (val) => (
    <Box>
      {helpdeskPrioritiesJson.map(
        (priority) => val === priority.priority && (
          <Typography
            sx={{
              color: priority.color,
            }}
          >
            {val}
          </Typography>
        ),
      )}
    </Box>
  );
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const isConstraintsShow = maintenanceConfigurationData
    && !maintenanceConfigurationData.loading
    && maintenanceConfigurationData.data
    && maintenanceConfigurationData.data.length
    && maintenanceConfigurationData.data[0].is_constraints;
  const isCostShow = maintenanceConfigurationData
    && !maintenanceConfigurationData.loading
    && maintenanceConfigurationData.data
    && maintenanceConfigurationData.data.length
    && maintenanceConfigurationData.data[0].is_cost;
  const actionsList = isIncident
    ? ticketActions.actionIncidentItems
    : ticketActions.actionItems;
  const woDetailData = workorderDetails
    && workorderDetails.data
    && workorderDetails.data.length > 0
    ? { data: [workorderDetails.data[0]] }
    : false;
  const inspDeata1 = incidentsOrderInfo
    && incidentsOrderInfo.data
    && incidentsOrderInfo.data.data
    && incidentsOrderInfo.data.data.length
    ? { data: [incidentsOrderInfo.data.data[0]] }
    : false;
  const inspDeata2 = incidentsOrderInfo
    && incidentsOrderInfo.data
    && incidentsOrderInfo.data.data
    && incidentsOrderInfo.data.data.length
    && incidentsOrderInfo.data.data.length > 1
    ? { data: [incidentsOrderInfo.data.data[1]] }
    : woDetailData;
  const woData = selectedActions && selectedActions.includes('Assessment')
    ? inspDeata1
    : inspDeata2;

  const workOrderData = workorderDetails
    && workorderDetails.data
    && workorderDetails.data.length > 0 && workorderDetails.data[0];

  const switchActionItem = (action) => {
    handleClose();
    dispatch(resetOnHoldTicket());
    setLocationActionOpen(!changeLocationActionOpen);
    setSelectedActions(action.displayname);
    setSelectedActionImage(action.name);
    setEnterAction(Math.random());
  };

  function isValidateUser() {
    let res = false;
    const approveRoleId = maintenanceConfigurationData && !maintenanceConfigurationData.loading && maintenanceConfigurationData.data
      && maintenanceConfigurationData.data.length > 0 && maintenanceConfigurationData.data[0].on_hold_approval_id
      && maintenanceConfigurationData.data[0].on_hold_approval_id.id ? maintenanceConfigurationData.data[0].on_hold_approval_id.id : false;
    const userRoleId = userInfo && userInfo.data && userInfo.data.user_role_id ? userInfo.data.user_role_id : false;
    if (userRoleId && approveRoleId && userRoleId === approveRoleId) {
      res = true;
    }
    return res;
  }

  function checkActionAllowedDisabled(actionName) {
    let allowed = true;
    const woId = ticketDetail && ticketDetail.data && ticketDetail.data[0].mro_order_id
      ? ticketDetail.data[0].mro_order_id[0]
      : false;
    const escalateLevel = ticketDetail && ticketDetail.data && ticketDetail.data[0].level;
    if (escalateLevel !== 'level1' && actionName === 'Escalate Ticket') {
      allowed = false;
    }
    if (actionName === 'Go to Work Orders' && !woId) {
      allowed = false;
    }
    if (actionName === 'Put On-Hold' && detailedData.is_on_hold_requested && !isValidateUser()) {
      allowed = false;
    }
    return allowed;
  }
  const [messageModal, showMessageModal] = useState(false);
  const [escalateModal, showEscalateModal] = useState(false);
  const [reassignModal, showReassignModal] = useState(false);
  const [closeModal, showCloseModal] = useState(false);
  const [cancelModal, showCancelModal] = useState(false);
  const [addLink, setAddLink] = useState(false);
  const [actionText, setActionText] = useState('');
  const [actionCode, setActionCode] = useState('');
  const [actionModal, showActionModal] = useState(false);
  const [closeActionModal, showCloseActionModal] = useState(false);
  const [printModal, showPrintModal] = useState(false);
  const [printModalb, showPrintModalb] = useState(false);
  const [acceptModal, showAcceptModal] = useState(false);
  const [checkListModal, showCheckListModal] = useState(false);
  const [pauseActionModal, showPauseActionModal] = useState(false);
  const [progressActionModal, setProgressActionModal] = useState(false);
  const [shareActionModal, setShareActionModal] = useState(false);
  const [category, setCategory] = useState(false);
  const [subCategory, setSubCategory] = useState(false);
  const [ohRequestModal, showOhRequestModal] = useState(false);

  const {
    equipmentsDetails,
  } = useSelector((state) => state.equipment);

  const categoryName = category ? category.cat_display_name ? category.cat_display_name : category.name : getDefaultNoValue(extractTextObject(detailedData.category_id));
  const subCategoryName = subCategory ? subCategory.sub_cat_display_name ? subCategory.sub_cat_display_name : subCategory.name : getDefaultNoValue(extractTextObject(detailedData.sub_category_id));
  const isAgeShow = maintenanceConfigurationData && !maintenanceConfigurationData.loading && maintenanceConfigurationData.data
    && maintenanceConfigurationData.data.length && maintenanceConfigurationData.data[0].is_age;
  const stateName = getDefaultNoValue(extractTextObject(detailedData.state_id));

  useEffect(() => {
    if (detailedData && detailedData.state_id && detailedData.state_id.length && detailedData.state_id[1] === 'Closed') {
      let ids = detailedData.order_ids;
      if (!('order_ids' in detailedData)) {
        ids = detailedData.mro_order_id && detailedData.mro_order_id.length ? [detailedData.mro_order_id[0]] : [];
      }
      dispatch(getTicketOrders(ids, appModels.ORDER));
    }
  }, [detailedData]);

  const inspDeata = ticketOrders && ticketOrders.data && ticketOrders.data.length ? ticketOrders.data[0] : false;

  useEffect(() => {
    if (detailedData) {
      dispatch(getSiteBasedCategory(detailedData.type_category, false, false, detailedData.company_id && detailedData.company_id.length && detailedData.company_id[0]));
    }
  }, [detailedData]);

  useEffect(() => {
    if (siteCategoriesInfo && siteCategoriesInfo.data && siteCategoriesInfo.data.length && detailedData?.category_id?.[0] && detailedData?.sub_category_id?.[0]) {
      const findCateg = siteCategoriesInfo.data.find((categ) => categ.id === detailedData.category_id[0]);
      const findSubCateg = findCateg && findCateg.sub_category_id && findCateg.sub_category_id.length && findCateg.sub_category_id.find((categ) => categ.id === detailedData.sub_category_id[0]);
      setSubCategory(findSubCateg);
      setCategory(findCateg);
    }
  }, [siteCategoriesInfo]);

  const cancelEscalate = () => {
    dispatch(resetEscalate());
  };

  const cancelReassign = () => {
    dispatch(resetEscalate());
  };

  const cancelClose = () => {
    dispatch(resetClose());
  };

  const resetRequest = () => {
    dispatch(resetOnHoldRequest());
  };

  useEffect(() => {
    const viewId = ticketDetail && ticketDetail.data && ticketDetail.data.length > 0
      ? ticketDetail.data[0].id
      : false;
    if (printModal && viewId) {
      dispatch(
        getPrintReport(viewId, 'mro_incident_ticket.incident_report_part_a'),
      );
    }
  }, [printModal]);

  useEffect(() => {
    const viewId = ticketDetail && ticketDetail.data && ticketDetail.data.length > 0
      ? ticketDetail.data[0].id
      : false;
    if (printModalb && viewId) {
      dispatch(
        getPrintReport(viewId, 'mro_incident_ticket.incident_report_part_b'),
      );
    }
  }, [printModalb]);

  useEffect(() => {
    if (
      (printModal || printModalb)
      && printReportInfo
      && printReportInfo.data
    ) {
      const pdfBase64 = printReportInfo.data.content;
      const dlnk = document.getElementById('dwnldLnk');
      dlnk.href = `data:application/octet-stream;base64,${pdfBase64}`;
      dlnk.click();
      setSelectedActions(defaultActionText);
      setSelectedActionImage('');
      showPrintModal(false);
      showPrintModalb(false);
      dispatch(resetPrint());
    }
  }, [printReportInfo]);

  useEffect(() => {
    if (selectedActions === 'Escalate Ticket') {
      showEscalateModal(true);
    }
    if (selectedActions === 'Reassign Ticket') {
      showReassignModal(true);
    }
    if (selectedActions === 'Send Message') {
      showMessageModal(true);
    }
    if (selectedActions === 'Close Ticket') {
      cancelEscalate();
      cancelReassign();
      cancelClose();
      showCloseModal(true);
    }
    if (selectedActions === 'Cancel Ticket') {
      cancelEscalate(); cancelReassign(); cancelClose();
      showCancelModal(true);
    }
    if (selectedActions === 'Put On-Hold') {
      setActionText('Pause');
      setActionCode('do_record');
      if (detailedData && detailedData.is_on_hold_approval_required && !detailedData.is_on_hold_requested) {
        showOhRequestModal(true);
      } else {
        showPauseActionModal(true);
      }
    }
    if (selectedActions === 'Share Ticket') {
      dispatch(resetshareTicket());
      setShareActionModal(true);
    }
    if (selectedActions === 'Move to In Progress') {
      if (
        ticketDetail
        && ticketDetail.data
        && ticketDetail.data[0].mro_order_id
      ) {
        setActionText('Restart');
        setActionCode('action_restart');
        showActionModal(true);
      } else {
        setProgressActionModal(true);
      }
    }
    if (selectedActions === 'Go to Work Orders') {
      if (
        ticketDetail
        && ticketDetail.data
        && ticketDetail.data[0].mro_order_id
      ) {
        setAddLink(true);
      }
    }
    if (
      selectedActions === 'Start Assessment'
      || selectedActions === 'Start Remediation'
    ) {
      setActionText('Assign');
      setActionCode('assgined_request_order');
      showAcceptModal(true);
    }
    if (
      selectedActions === 'Finish Assessment'
      || selectedActions === 'Finish Remediation'
    ) {
      dispatch(resetOrderCheckList());
      showCheckListModal(true);
      setActionText('');
      setActionCode('');
    }
    if (selectedActions === 'Finish') {
      setActionText('Finish');
      setActionCode('do_record');
      showCloseActionModal(true);
    }
    if (selectedActions === 'Report Part A') {
      showPrintModal(true);
    }
    if (selectedActions === 'Report Part B') {
      showPrintModalb(true);
    }
  }, [enterAction]);

  const cancelMessage = () => {
    dispatch(resetMessage());
    const viewId = ticketDetail && ticketDetail.data && ticketDetail.data.length > 0
      ? ticketDetail.data[0].id
      : '';
    dispatch(getTicketDetail(viewId, appModels.HELPDESK));
  };

  const cancelCheckList = () => {
    dispatch(resetUpdateCheckList());
  };

  const callTicket = () => {
    const viewId = ticketDetail && ticketDetail.data ? ticketDetail.data[0].id : '';
    if (viewId) {
      dispatch(getTicketDetail(viewId, appModels.HELPDESK));
    }
  };

  const callTicketWithSucc = () => {
    const viewId = ticketDetail && ticketDetail.data ? ticketDetail.data[0].id : '';
    if (viewId && shareTicketInfo && shareTicketInfo.data) {
      dispatch(getTicketDetail(viewId, appModels.HELPDESK));
      dispatch(resetshareTicket());
    }
  };
  useEffect(() => {
    if (ticketDetail && ticketDetail.data) {
      const ids = ticketDetail.data.length > 0 ? ticketDetail.data[0].order_ids : [];
      dispatch(getOrdersFullDetails(companies, appModels.ORDER, ids));

      if (ticketDetail.data.length > 0 && ticketDetail.data[0].equipment_id && ticketDetail.data[0].equipment_id.length) {
        dispatch(getAssetDetail(ticketDetail.data[0].equipment_id[0], appModels.EQUIPMENT, 'yes'));
      }

      const woId = ticketDetail.data.length > 0
        ? ticketDetail.data[0].mro_order_id[0]
        : false;
      if (woId) {
        dispatch(getOrderDetail(woId, appModels.ORDER));
      }
    }
  }, [ticketDetail]);

  const onViewReset = () => {
    setAddLink(false);
    setViewModal(true);
    setSelectedActions(defaultActionText);
    setSelectedActionImage('');
  };

  function getOnHoldActionName(act) {
    let res = act;
    if (act === 'Put On-Hold' && detailedData.is_on_hold_approval_required && !detailedData.is_on_hold_requested) {
      res = 'Request On Hold';
    } else if (act === 'Put On-Hold' && detailedData.is_on_hold_approval_required && detailedData.is_on_hold_requested) {
      res = 'Approve/Reject On Hold';
    }
    return res;
  }

  const isMobNotShow = maintenanceConfigurationData && !maintenanceConfigurationData.loading && maintenanceConfigurationData.data
    && maintenanceConfigurationData.data.length > 0 && maintenanceConfigurationData.data[0].requestor_mobile_visibility === 'Confidential';

  return (
    <>
      {detailedData && (
        <Box>
          <DetailViewHeader
            mainHeader={getDefaultNoValue(detailedData.subject)}
            status={
              detailedData.state_id && detailedData.state_id.length
                ? checkTicketsStatus(detailedData.state_id[1])
                : '-'
            }
            subHeader={(
              <>
                {detailedData.create_date
                  && userInfo.data
                  && userInfo.data.timezone
                  ? moment
                    .utc(detailedData.create_date)
                    .local()
                    .tz(userInfo.data.timezone)
                    .format('yyyy MMM Do, hh:mm A')
                  : '-'}
                {' '}
                Requestor -
                {' '}
                {getDefaultNoValue(extractTextObject(detailedData.requestee_id) ? extractTextObject(detailedData.requestee_id) : detailedData.person_name)}
              </>
            )}
            actionComponent={(
              <Box>
                {allowedOperations.includes(actionCodes['Add Comment']) && (
                  <Comments
                    detailData={ticketDetail}
                    model={appModels.HELPDESK}
                    messageType="comment"
                    getDetail={getTicketDetail}
                    setTab={setValue}
                    tab={value}
                    isHelpdesk
                  />
                )}
                {ticketDetail
                  && !ticketDetail.loading
                  && ticketDetail.data
                  && ticketDetail.data.length > 0
                  && ticketDetail.data[0].state_id
                  && ticketDetail.data[0].state_id.length > 0
                  && ticketDetail.data[0].state_id[1] !== 'Closed'
                  && allowedOperations.includes(actionCodes['Close Ticket'])
                  && checkActionAllowed(
                    'Close Ticket',
                    ticketDetail,
                    isIncident,
                  ) && (
                    <Button
                      type="button"
                      className="ticket-btn"
                      variant="outlined"
                      sx={{
                        backgroundColor: '#fff',
                        '&:hover': {
                          backgroundColor: '#fff',
                        },
                      }}
                      onClick={() => switchActionItem({
                        name: 'CLOSETICKET',
                        displayname: 'Close Ticket',
                      })}
                    >
                      {isIncident ? 'Close Incident' : 'Close Ticket'}
                    </Button>
                )}
                {ticketDetail
                  && !ticketDetail.loading
                  && ticketDetail.data
                  && ticketDetail.data.length > 0
                  && ticketDetail.data[0].state_id
                  && ticketDetail.data[0].state_id.length > 0
                  && ticketDetail.data[0].state_id[1] !== 'Closed'
                  && allowedOperations.includes(actionCodes['Edit Ticket'])
                  && (
                    <Button
                      type="button"
                      className="ticket-btn"
                      onClick={() => {
                        setEditLink(true);
                        handleClose(false);
                        setEditId(detailedData.id);
                      }}
                      sx={{
                        backgroundColor: '#fff',
                        '&:hover': {
                          backgroundColor: '#fff',
                        },
                      }}
                      variant="outlined"
                    >
                      {isIncident ? 'Edit' : 'Edit'}
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
                  {actionsList
                    && actionsList.map(
                      (actions) => allowedOperations.includes(
                        actionCodes[actions.displayname],
                      )
                        && checkActionAllowed(
                          actions.displayname,
                          ticketDetail,
                          isIncident,
                        ) && (
                          <MenuItem
                            sx={{
                              font: 'normal normal normal 15px Suisse Intl',
                            }}
                            id="switchAction"
                            className="pl-2"
                            key={actions.id}
                            disabled={
                              !checkActionAllowedDisabled(actions.displayname)
                            }
                            onClick={() => switchActionItem(actions)}
                          >
                            <img
                              src={faIcons[actions.name]}
                              alt="ticketactions"
                              className="mr-2"
                              height="15"
                              width="15"
                            />
                            {isIncident
                              && actions.displayname === 'Close Ticket'
                              ? 'Close Incident'
                              : actions.displayname === 'Report Part A'
                                ? 'Download Report'
                                : actions.displayname === 'Report Part B'
                                  ? 'Download Report'
                                  : getOnHoldActionName(actions.displayname)}
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
            }}
          >
            <Box
              sx={{
                width: '75%',
              }}
            >
              <DetailViewTab
                value={value}
                handleChange={handleTabChange}
                tabs={tabs}
              />
              <TabPanel value={value} index={0}>
                <DetailViewLeftPanel
                  panelData={[
                    {
                      header: 'Ticket Information',
                      leftSideData:
                        [
                          /* {
                            property: "Subject",
                            value: getDefaultNoValue(detailedData.subject),
                          },
                          {
                            property: "Created on",
                            value: getDefaultNoValue(
                              getCompanyTimezoneDate(
                                detailedData.create_date,
                                userInfo,
                                "datetime"
                              )
                            ),
                          }, */
                          {
                            property: 'Due Date',
                            value: getCompanyTimezoneDate(
                              detailedData.sla_end_date,
                              userInfo,
                              'datetime',
                            ),
                          },
                          {
                            property: 'Issue Type',
                            value: getDefaultNoValue(
                              getIssueTypeLabel(detailedData.issue_type),
                            ),
                          },
                          {
                            property: 'Priority',
                            value: detailedData?.priority_id?.[1],
                          },
                          {
                            property: isCostShow ? 'Cost' : false,
                            value: getDefaultNoValue(detailedData.cost),
                          },
                          {
                            property: 'Description',
                            value: stripHtmlTags(htmlSanitizeInput(detailedData.description)),
                          },
                          {
                            property: 'Assigned To',
                            value: getDefaultNoValue(
                              extractTextObject(detailedData.employee_id),
                            ),
                          },
                          {
                            property: detailedData.state_id && detailedData.state_id[1] === 'On Hold' && 'On Hold Reason',
                            value: workOrderData && detailedData.mro_order_id ? getDefaultNoValue(extractTextObject(workOrderData.pause_reason_id)) : !detailedData.mro_order_id ? getDefaultNoValue(extractTextObject(detailedData.pause_reason_id)) : '',
                          },
                          {
                            property: detailedData.is_on_hold_approval_required && detailedData.state_id && detailedData.state_id[1] !== 'Closed' && detailedData.is_on_hold_requested && 'On Hold Reason',
                            value: detailedData.pause_reason_id ? getDefaultNoValue(extractTextObject(detailedData.pause_reason_id)) : '',
                          },
                          {
                            property: workOrderData && detailedData.state_id && detailedData.state_id[1] === 'On Hold' && detailedData.mro_order_id && 'On Hold Remarks',
                            value: workOrderData && getDefaultNoValue(workOrderData.reason),
                          },
                          {
                            property: detailedData.is_on_hold_approval_required && detailedData.state_id && detailedData.state_id[1] !== 'Closed' && detailedData.is_on_hold_requested && 'On Hold Remarks',
                            value: detailedData.on_hold_requested_command ? getDefaultNoValue(detailedData.on_hold_requested_command) : '',
                          },
                        ],
                      rightSideData:
                        [
                          /* {
                            property: 'Description',
                            value: <span className="text-break" dangerouslySetInnerHTML={{ __html: htmlToReact(detailedData.description) }} />,

                          },
                          {
                            property: 'Assigned To',
                            value: getDefaultNoValue(
                              extractTextObject(detailedData.employee_id),
                            ),
                          }, */
                          {
                            property: isChannelVisible ? 'Channel' : false,
                            value: getDefaultNoValue(
                              getTicketChannelFormLabel(detailedData.channel),
                            ),
                          },
                          {
                            property: 'Parent Ticket',
                            value: getDefaultNoValue(
                              extractTextObject(detailedData.parent_id),
                            ),
                          },
                          {
                            property: isTicketType ? 'Ticket Type' : false,
                            value: getDefaultNoValue(detailedData.ticket_type),
                          },
                          {
                            property: isConstraintsShow ? 'Constraints' : false,
                            value: <span className="text-break">
                              {getDefaultNoValue(detailedData.constraints)}
                            </span>,
                          },
                          {
                            property: (detailedData.state_id) && (detailedData.state_id[1] === 'Closed') ? detailedData.is_cancelled ? 'Cancelled On' : 'Closed On' : false,
                            value: getDefaultNoValue(
                              getCompanyTimezoneDate(
                                detailedData.close_time,
                                userInfo,
                                'datetime',
                              ),
                            ),
                          },
                          {
                            property: (detailedData.state_id) && (detailedData.state_id[1] === 'Closed') ? detailedData.is_cancelled ? 'Cancelled by' : 'Closed by' : false,
                            value: getDefaultNoValue(
                              extractTextObject(detailedData.closed_by_id),
                            ),
                          },
                          {
                            property: (detailedData.state_id) && (detailedData.state_id[1] === 'Closed') ? detailedData.is_cancelled ? 'Cancel Comment' : 'Close Comment' : false,
                            value: detailedData.close_comment && detailedData.close_comment !== '' && truncateHTMLTags(detailedData.close_comment).length > 0
                              ? (
                                <p
                                  className="m-0 p-0 small-form-content hidden-scrollbar"
                                >
                                  {htmlSanitizeInput(detailedData.close_comment)}
                                </p>
                              )
                              : inspDeata && inspDeata.reason && inspDeata.reason !== '' && truncateHTMLTags(inspDeata.reason).length > 0
                                ? (
                                  <p
                                    className="m-0 p-0 small-form-content hidden-scrollbar"
                                  >
                                    {htmlSanitizeInput(inspDeata.reason)}
                                  </p>
                                )
                                : '-',
                          },
                          {
                            property: isTenantTicket ? 'Tenant' : false,
                            value: getDefaultNoValue(extractTextObject(detailedData.tenant_id)),
                          },
                          {
                            property: isTenant ? 'Tenant Name' : false,
                            value: getDefaultNoValue(detailedData.tenant_name),
                          },
                          /* {
                             property: detailedData.state_id && detailedData.state_id[1] !== 'On Hold' && !detailedData.is_on_hold_requested && detailedData.on_hold_reject_reason && 'On Hold Reject Reason',
                             value: getDefaultNoValue(detailedData.on_hold_reject_reason),
                           }, */
                        ],
                    },
                    {
                      header: 'Asset Information',
                      leftSideData: [
                        {
                          property: 'Problem Category',
                          value: categoryName,
                        },
                        {
                          property: 'Maintenance Order',
                          value: getDefaultNoValue(extractTextObject(detailedData.mro_order_id)),
                        },
                        {
                          property: isTeamVisible ? 'Maintenance Team' : false,
                          value: getDefaultNoValue(
                            extractTextObject(detailedData.maintenance_team_id),
                          ),
                        },
                        {
                          property: 'MO Status',
                          value: getDefaultNoValue(
                            getTicketOrderStateText(detailedData.mro_state),
                          ),
                        },
                        {
                          property: 'Work Station Number',
                          value: getDefaultNoValue(detailedData.work_location),
                        },
                      ],
                      rightSideData: [
                        {
                          property: 'Problem Sub-Category',
                          value: getDefaultNoValue(
                            extractTextObject(detailedData.sub_category_id),
                          ),
                        },
                        {
                          property: 'Escalation Level',
                          value: getDefaultNoValue(
                            detailedData.current_escalation_level,
                          ),
                        },
                        {
                          property: 'Maintenance Type',
                          value: getDefaultNoValue(
                            getMTLabel(detailedData.maintenance_type),
                          ),
                        },
                        {
                          property: isVendorShow ? 'Vendor' : false,
                          value: getDefaultNoValue(
                            extractTextObject(detailedData.vendor_id),
                          ),
                        },
                      ],
                    }, {
                      header: 'Last Comment Information',
                      leftSideData: [
                        {
                          property: 'Last Comment',
                          value: getDefaultNoValue(detailedData.log_note),
                        },
                      ],
                      rightSideData: [
                        {
                          property: detailedData.log_note && (detailedData.log_note_date || detailedData.last_commented_by) ? 'Last Commented on' : false,
                          value: getDefaultNoValue(
                            getCompanyTimezoneDate(
                              detailedData.log_note_date,
                              userInfo,
                              'datetime',
                            ),
                          ),
                        },
                        {
                          property: detailedData.log_note && (detailedData.log_note_date || detailedData.last_commented_by) ? 'Last Commented by' : false,
                          value: getDefaultNoValue(
                            detailedData.last_commented_by,
                          ),
                        },
                      ],
                    },
                    detailedData.state_id && detailedData.state_id.length > 0 && (detailedData.state_id[1] !== 'Closed' && detailedData.state_id[1] !== 'On Hold') && {
                      header: 'SLA Information',
                      leftSideData: [
                        {
                          property: 'SLA Status',
                          value: getDefaultNoValue(detailedData.sla_status),
                        },

                      ],
                      rightSideData: [
                        {
                          property: 'SLA Level',
                          value: getDefaultNoValue(
                            extractTextObject(detailedData.sla_id),
                          ),
                        },
                      ],
                    },
                  ]}
                />
                <Typography
                  sx={detailViewHeaderClass}
                >
                  Escalation Matrix
                </Typography>
                <EscalationMatrix detailData={detailedData} />
              </TabPanel>
              <TabPanel value={value} index={1}>
                <LogNotes ids={detailedData.status_logs} />
              </TabPanel>
              <TabPanel value={value} index={2}>
                <AuditLog ids={detailedData.message_ids} />
              </TabPanel>
              <TabPanel value={value} index={3}>
                <Documents
                  viewId={detailedData.id}
                  reference={
                    detailedData.ticket_number
                      ? detailedData.ticket_number
                      : ''
                  }
                  resModel={appModels.HELPDESK}
                  model={appModels.DOCUMENT}
                />
                <Divider />
              </TabPanel>
              <TabPanel value={value} index={4}>
                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                  }}
                >
                  {detailedData.state_id
                    && detailedData.state_id[1] === 'Closed' ? (
                      <Box
                        sx={{
                          width: '50%',
                        }}
                      >
                        <PropertyAndValue
                          data={{
                            property: detailedData.is_cancelled ? 'Cancelled on' : 'Closed on',
                            value: getDefaultNoValue(
                              getCompanyTimezoneDate(
                                detailedData.close_time,
                                userInfo,
                                'datetime',
                              ),
                            ),
                          }}
                        />
                        <PropertyAndValue
                          data={{
                            property: detailedData.is_cancelled ? 'Cancelled by' : 'Closed by',
                            value: getDefaultNoValue(extractTextObject(detailedData.closed_by_id)),
                          }}
                        />
                        <PropertyAndValue
                          data={{
                            property: detailedData.is_cancelled ? 'Cancel Comment' : 'Close Comment',
                            value: detailedData.close_comment && detailedData.close_comment !== '' && truncateHTMLTags(detailedData.close_comment).length > 0
                              ? (
                                <p
                                  className="m-0 p-0 small-form-content hidden-scrollbar"
                                >
                                  {htmlSanitizeInput(detailedData.close_comment)}
                                </p>
                              )
                              : inspDeata && inspDeata.reason && inspDeata.reason !== '' && truncateHTMLTags(inspDeata.reason).length > 0
                                ? (
                                  <p
                                    className="m-0 p-0 small-form-content hidden-scrollbar"
                                  >
                                    {htmlSanitizeInput(inspDeata.reason)}
                                  </p>
                                )
                                : '-',
                          }}
                        />
                      </Box>
                    ) : (
                      <ErrorContent errorTxt="No Data Found" />
                    )}
                </Box>
              </TabPanel>
            </Box>
            <Box
              sx={{
                width: '25%',
                height: '100%',
                backgroundColor: '#F6F8FA',
              }}
            >
              <DetailViewRightPanel
                panelOneHeader="Requestor"
                panelOneLabel={getDefaultNoValue(extractTextObject(detailedData.requestee_id) ? extractTextObject(detailedData.requestee_id) : detailedData.person_name)}
                panelOneValue1={getDefaultNoValue(detailedData.email)}
                // panelOneValue2={getDefaultNoValue(detailedData.mobile)}
                panelOneValue2={(
                  <span className={detailedData.mobile && isMobNotShow ? 'hide-phone-number' : ''}>
                    {getDefaultNoValue(detailedData.mobile)}
                  </span>
                )}
                panelTwoHeader={`${getDefaultNoValue(
                  extractTextObject(
                    detailedData.equipment_id
                      ? detailedData.equipment_id
                      : detailedData.asset_id,
                  ),
                )} ${detailedData.equipment_id && equipmentsDetails && equipmentsDetails.data && equipmentsDetails.data.length > 0 && equipmentsDetails.data[0].brand ? `  |   ${equipmentsDetails.data[0].brand}` : ''}`}
                panelTwoData={[
                  {
                    value: detailedData.equipment_location_id
                      ? getDefaultNoValue(
                        extractTextObject(
                          detailedData.equipment_location_id,
                        ),
                      )
                      : false,
                  },
                ]}
                panelThreeHeader="Ticket Information"
                panelThreeData={[
                  /* {
                      header: "Status",
                      value:
                        detailedData.state_id && detailedData.state_id.length
                          ? checkTicketsStatus(detailedData.state_id[1])
                          : "-",
                    }, */
                  {
                    header: 'Priority',
                    value:
  <>
    {detailedData.priority_id
                          && detailedData.priority_id.length
      ? checkTicketPriority(detailedData.priority_id[1])
      : '-'}
    {detailedData.state_id && detailedData.state_id.length > 0 && (detailedData.state_id[1] !== 'Closed' && detailedData.state_id[1] !== 'On Hold') && (
    <Typography>
      {getSLALabel(detailedData.sla_status)}
      {detailedData.state_id[1] !== 'On Hold' && (
      <p className="font-weight-400 m-0 p-0">
        <span className="mr-1">
          <span className={getSLAStatusCheck(detailedData.sla_end_date) === 'Time remains' ? 'text-success' : 'text-danger'}>
            {getSLAStatusCheck(detailedData.sla_end_date)}
            {' '}
            {getSLATime(detailedData.state_id[1], detailedData.sla_end_date)}
          </span>
        </span>
      </p>
      )}
    </Typography>
    )}
    {detailedData.state_id && detailedData.state_id.length > 0 && (detailedData.state_id[1] === 'Closed' && !detailedData.is_cancelled) && (
    <Typography>
      <p className="font-weight-400 m-0 p-0">
        {getSLAStatusCheckClose(detailedData.sla_end_date, detailedData.close_time) === ''
          ? ''
          : (
            <span className="mr-1">
              <span className={getSLAStatusCheckClose(detailedData.sla_end_date, detailedData.close_time) === 'Closed before' ? 'text-success' : 'text-danger'}>
                {getSLAStatusCheckClose(detailedData.sla_end_date, detailedData.close_time)}
              </span>
            </span>
          )}
        {getSLATimeClosed(detailedData.sla_end_date, detailedData.close_time)}
        {' '}
      </p>
    </Typography>
    )}
    {isAgeShow && (
    <Typography>
      Age -
      {' '}
      {`${getAge(detailedData.create_date, stateName === 'Closed' ? detailedData.close_time : '')}`}
    </Typography>
    )}
  </>,
                  },
                  /* {
                      header: "Created on",
                      value: getDefaultNoValue(
                        getCompanyTimezoneDate(
                          detailedData.create_date,
                          userInfo,
                          "datetime"
                        )
                      ),
                    }, */
                  {
                    header: 'Last updated on',
                    value: getDefaultNoValue(
                      getCompanyTimezoneDate(
                        detailedData.__last_update,
                        userInfo,
                        'datetime',
                      ),
                    ),
                  },
                ]}
              />
            </Box>
          </Box>
        </Box>
      )}
      {ticketDetail && ticketDetail.loading && <Loader />}
      {reassignModal && (
        <ReassignTicket
          atFinish={() => {
            showReassignModal(false);
            cancelReassign();
            setSelectedActions(defaultActionText);
            setSelectedActionImage('');
          }}
          ticketDetail={ticketDetail}
          reassignModal
          isIncident={isIncident}
        />
      )}
      {escalateModal && (
        <EscalateTicket
          atFinish={() => {
            showEscalateModal(false);
            cancelEscalate();
            setSelectedActions(defaultActionText);
            setSelectedActionImage('');
          }}
          ticketDetail={ticketDetail}
          escalateModal
          isIncident={isIncident}
        />
      )}
      {closeModal && (
        <CloseTicket
          atFinish={() => {
            showCloseModal(false);
            cancelEscalate();
            cancelReassign();
            cancelClose();
            setSelectedActions(defaultActionText);
            setSelectedActionImage('');
          }}
          ticketDetail={ticketDetail}
          closeModal
          isIncident={isIncident}
          woCloseInfo={stateChangeInfo}
        />
      )}
      {cancelModal && (
        <CancelTicket
          atFinish={() => {
            showCancelModal(false); cancelEscalate(); cancelReassign(); cancelClose();
            setSelectedActions(defaultActionText); setSelectedActionImage('');
          }}
          ticketDetail={ticketDetail}
          cancelModal
          isIncident={isIncident}
          woCloseInfo={stateChangeInfo}
        />
      )}
      {ohRequestModal && (
        <OnHoldRequest
          atFinish={() => {
            showOhRequestModal(false); resetRequest();
            setSelectedActions(defaultActionText); setSelectedActionImage('');
          }}
          ticketDetail={ticketDetail}
          ohRequestModal
        />
      )}
      {messageModal && (
        <SendMessage
          atFinish={() => {
            showMessageModal(false);
            cancelMessage();
            setSelectedActions(defaultActionText);
            setSelectedActionImage('');
          }}
          atCancel={() => {
            showMessageModal(false);
            setSelectedActions(defaultActionText);
            setSelectedActionImage('');
          }}
          ticketDetail={ticketDetail}
          messageModal
          isIncident={isIncident}
        />
      )}
      {checkListModal && (
        <CheckList
          atFinish={() => {
            showCheckListModal(false);
            cancelCheckList();
            callTicket();
            setSelectedActions(defaultActionText);
            setSelectedActionImage('');
          }}
          workorderDetails={woData}
          selectedActions={selectedActions}
          checkListModal
        />
      )}
      {actionModal && (
        <ActionWorkorder
          atFinish={() => {
            showActionModal(false);
            setSelectedActions(defaultActionText);
            setSelectedActionImage('');
            callTicket();
          }}
          actionText={actionText}
          actionCode={actionCode}
          details={woData}
          actionModal
        />
      )}
      {closeActionModal && (
        <CloseWorkorder
          atFinish={() => {
            showCloseActionModal(false);
            setSelectedActions(defaultActionText);
            setSelectedActionImage('');
            callTicket();
          }}
          actionText={actionText}
          actionCode={actionCode}
          details={woData}
          closeActionModal
        />
      )}
      {acceptModal && (
        <AcceptWorkorder
          atFinish={() => {
            showAcceptModal(false);
            setSelectedActions(defaultActionText);
            setSelectedActionImage('');
            callTicket();
          }}
          actionText={actionText}
          actionCode={actionCode}
          details={woData}
          selectedActions={selectedActions}
          acceptModal
        />
      )}
      {pauseActionModal && (
        <PauseWorkorder
          atFinish={() => {
            showPauseActionModal(false);
            setSelectedActions(defaultActionText);
            setSelectedActionImage('');
            dispatch(resetOnHoldTicket());
            callTicket();
          }}
          actionText={actionText}
          actionCode={actionCode}
          isApproval={(detailedData.is_on_hold_approval_required && detailedData.is_on_hold_requested) || (onHoldApproval && onHoldApproval.data)}
          pauseReasonRemarks={detailedData.on_hold_requested_command}
          pauseReason={detailedData.pause_reason_id}
          details={workorderDetails}
          pauseActionModal
          isTicket
          tId={
            ticketDetail && ticketDetail.data && ticketDetail.data.length > 0
              ? ticketDetail.data[0].id
              : false
          }
          wId={
            ticketDetail
              && ticketDetail.data
              && ticketDetail.data.length > 0
              && ticketDetail.data[0].mro_order_id
              && ticketDetail.data[0].mro_order_id.length
              ? ticketDetail.data[0].mro_order_id[0]
              : false
          }
        />
      )}
      {progressActionModal && (
        <InProgressTicket
          atFinish={() => {
            setProgressActionModal(false);
            setSelectedActions(defaultActionText);
            setSelectedActionImage('');
          }}
          progressActionModal
          tId={
            ticketDetail && ticketDetail.data && ticketDetail.data.length > 0
              ? ticketDetail.data[0].id
              : false
          }
        />
      )}
      {shareActionModal && (
        <ShareTicket
          atFinish={() => {
            setShareActionModal(false);
            setSelectedActions(defaultActionText);
            setSelectedActionImage('');
            callTicketWithSucc();
          }}
          shareActionModal
          tId={
            ticketDetail && ticketDetail.data && ticketDetail.data.length > 0
              ? ticketDetail.data[0].id
              : false
          }
        />
      )}
      <Drawer
        PaperProps={{
          sx: { width: '85%' },
        }}
        anchor="right"
        open={editLink}
      >
        <DrawerHeader
          headerName={
            !isIncident ? 'Update a Ticket' : 'Update an Incident Ticket'
          }
          imagePath={ticketIcon}
          onClose={() => {
            setEditLink(false);
            dispatch(resetUpdateTicket());
            dispatch(resetImage());
            setEditId(false);
            // onViewEditReset();
          }}
        />
        <CreateTicketForm
          editIds={editId}
          afterReset={onViewEditReset}
          isAIEnabled={isAIEnabled}
          closeModal={() => setEditLink(false)}
        />
      </Drawer>
      <Drawer
        PaperProps={{
          sx: { width: '85%' },
        }}
        anchor="right"
        open={addLink}
      >
        <DrawerHeader
          headerName={
            workorderDetails
              && workorderDetails.data
              && workorderDetails.data.length > 0
              ? `${'Work Order'}${' - '}${workorderDetails.data[0].name}`
              : 'Work Order'
          }
          onClose={() => onViewReset()}
        />
        <WorkorderDetails setViewModal={setAddLink} />
      </Drawer>
    </>
  );
};
export default TicketDetails;
