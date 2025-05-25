/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */
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
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

import TrackerCheck from '@images/sideNavImages/consumption_black.svg';
import assetIcon from '@images/icons/assetDefault.svg';

import Loader from '@shared/loading';
import * as PropTypes from 'prop-types';
import {
  getDefaultNoValue,
  getListOfOperations,
  htmlToReact,
  extractTextObject,
  getAllCompanies,
  getCompanyTimezoneDate,
  truncateHTMLTags,
  TabPanel,
  extractNameObject, extractValueObjects, getArrayToValues, truncate, extractIdObject,
} from '../../util/appUtils';
import PropertyAndValue from '../../commonComponents/propertyAndValue';
import DrawerHeader from '../../commonComponents/drawerHeader';
import DetailViewHeader from '../../commonComponents/detailViewHeader';
import DetailViewTab from '../../commonComponents/detailViewTab';
import DetailViewRightPanel from '../../commonComponents/detailViewRightPanel';
import DetailViewLeftPanel from '../../commonComponents/detailViewLeftPanel';
import CreateTracker from '../forms/createBreakdown';
import { getSLALabel } from '../../helpdesk/utils/utils';
import EquipmentCostForm from './equipmentCost';

// import Documents from '../../helpdesk/viewTicket/documents';
import Documents from '../../commonComponents/documents';
// import Comments from './comments';
import Comments from '../../commonComponents/comments';
import AuditLog from '../../assets/assetDetails/auditLog';
import Action from './actionItems/action';
import AssetDetailView from '../../assets/assetDetailsView/assetDetails';
import {
  getTrackerDetail, resetCloseDuration, resetOnHoldRequest, resetOnHoldApproval, resetComplianceReinitiate,
} from '../breakdownService';
import { getHxPPMCancelDetails } from '../../preventiveMaintenance/ppmService';
import { getHxInspCancelDetails } from '../../inspectionSchedule/inspectionService';
import {
  breakDownStatusJson,
  helpdeskPrioritiesJson,
  detailViewHeaderClass,
} from '../../commonComponents/utils/util';
import actionCodes from '../data/actionCodes.json';
import {
  resetOrderCheckList,
  resetUpdateCheckList,
  getOrderDetail,
  resetUpdateParts,
} from '../../workorders/workorderService';
import {
  getAssetDetail,
} from '../../assets/equipmentService';
import SlaMatrix from './slaMatrix';
import StatusLogs from './statusLogs';
import OnHoldRequest from './onholdRequest';
import OnHoldApproval from './onholdApproval';
import OnHoldRequestCancel from './onholdRequestCancel';
import CancelRequestDetails from '../../preventiveMaintenance/viewer/cancelRequestDetails';
import InspCancelRequestDetails from '../../inspectionSchedule/viewer/cancelRequestDetail';

const appModels = require('../../util/appModels').default;

// const faIcons = {
//   ESCALATETICKET: escalate,
//   ESCALATETICKETACTIVE: escalate,
//   REASSIGNTICKET: reassign,
//   REASSIGNTICKETACTIVE: reassign,
//   SENDMESSAGE: message,
//   SENDMESSAGEACTIVE: message,
//   CLOSETICKET: closeIcon,
//   CLOSETICKETACTIVE: closeIcon,
//   OPENWORKORDER: workorders,
//   OPENWORKORDERACTIVE: workorders,
//   STARTASSESSMENT: workorders,
//   STARTASSESSMENTACTIVE: workorders,
//   FINISHASSESSMENT: workorders,
//   FINISHASSESSMENTACTIVE: workorders,
//   STARTREMEDIATION: workorders,
//   STARTREMEDIATIONACTIVE: workorders,
//   FINISHREMEDIATION: workorders,
//   FINISHREMEDIATIONACTIVE: workorders,
//   ONHOLDTICKET: holdIcon,
//   ONHOLDTICKETACTIVE: holdIcon,
//   SHARETICKET: shareIcon,
//   SHARETICKETACTIVE: shareIcon,
//   PROGRESSTICKET: reassign,
//   PROGRESSTICKETACTIVE: reassign,
//   PRINTPDFA: holdIcon,
//   PRINTPDFAACTIVE: holdIcon,
//   PRINTPDFB: holdIcon,
//   PRINTPDFBACTIVE: holdIcon,
//   PRINTPDFAB: holdIcon,
//   PRINTPDFABACTIVE: holdIcon,
// };

const TicketDetails = ({
  onViewEditReset,
  isDashboard,
  isAsset,
  // editId,
  // setEditId,
  isIncident,
  setViewModal,
  setParentTicket,
  setCurrentTicket,
}) => {
  const {
    trackerDetails,
    btConfigInfo,
  } = useSelector((state) => state.breakdowntracker);
  const { surveyStatus } = useSelector((state) => state.survey);
  const defaultActionText = 'Breakdown Actions';

  const dispatch = useDispatch();
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const { printReportInfo } = useSelector((state) => state.purchase);
  const { tenantUpdateInfo } = useSelector((state) => state.setup);
  const {
    equipmentsDetails,
  } = useSelector((state) => state.equipment);

  const configData = btConfigInfo && btConfigInfo.data && btConfigInfo.data.length ? btConfigInfo.data[0] : false;
  const isCritical = configData && configData.criticality;
  const isApprovalRequired = configData && configData.is_on_hold_approval_required;

  const companies = getAllCompanies(userInfo);

  const [value, setValue] = useState(0);
  const [editLink, setEditLink] = useState(false);
  const [editModal, showEditModal] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const [changeLocationActionOpen, setLocationActionOpen] = useState(false);
  const [selectedActions, setSelectedActions] = useState(defaultActionText);
  const [selectedActionImage, setSelectedActionImage] = useState('');
  const [enterAction, setEnterAction] = useState(false);
  const [requestModal, showRequestModal] = useState(false);
  const [requestCancelModal, showRequestCancelModal] = useState(false);
  const [approvalModal, showApprovalModal] = useState(false);
  const [ppmModal, setPPMModal] = useState(false);
  const [inspModal, setInspModal] = useState(false);

  const [equipmentModal, setEquipmentModal] = useState(false);

  const detailedData = trackerDetails && trackerDetails.data && trackerDetails.data.length
    ? trackerDetails.data[0]
    : '';

  const tabs = ['Breakdown Overview', 'Status Logs', 'Escalation Matrix', 'Attachments', 'Audit Logs'];
  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const allowedOperations = getListOfOperations(
    userRoles && userRoles.data ? userRoles.data.allowed_modules : [],
    'code',
  );

  const {
    hxPpmCancelDetails,
  } = useSelector((state) => state.ppm);

  const {
    hxInspCancelDetails,
  } = useSelector((state) => state.inspection);

  useEffect(() => {
    if ((detailedData.equipment_id && detailedData.equipment_id.id && !isAsset)) {
      dispatch(getAssetDetail(detailedData.equipment_id.id, appModels.EQUIPMENT, false));
    }
  }, [detailedData]);

  useEffect(() => {
    if (detailedData.id && configData && (configData.is_cancel_ppm || configData.is_cancel_ppm_space)) {
      dispatch(getHxPPMCancelDetails(detailedData.id, appModels.HXPPMCANCEL, appModels.BREAKDOWNTRACKER, false, 'check'));
    }
  }, [detailedData]);

  useEffect(() => {
    if (detailedData.id && configData && (configData.is_cancel_inspection || configData.is_cancel_inspection_space)) {
      dispatch(getHxInspCancelDetails(detailedData.id, appModels.HXINSPECTIONCANCEL, 'check', appModels.BREAKDOWNTRACKER, detailedData.id));
    }
  }, [detailedData]);

  const handleAssetView = (id) => {
    if (id) {
      dispatch(getAssetDetail(id, appModels.EQUIPMENT, false));
      setEquipmentModal(true);
    }
  };

  const ppmId = hxPpmCancelDetails && hxPpmCancelDetails.data && hxPpmCancelDetails.data.length > 0 && hxPpmCancelDetails.data[0].id ? hxPpmCancelDetails.data[0].id : false;

  const handlePPMCancelView = (id) => {
    if (id) {
      dispatch(getHxPPMCancelDetails(id, appModels.HXPPMCANCEL, 'ppm.scheduler_week', 'view'));
      setPPMModal(true);
    }
  };

  const inspId = hxInspCancelDetails && hxInspCancelDetails.data && hxInspCancelDetails.data.length > 0 && hxInspCancelDetails.data[0].id ? hxInspCancelDetails.data[0].id : false;

  const handleInspCancelView = (id) => {
    if (id) {
      dispatch(getHxInspCancelDetails(id, appModels.HXINSPECTIONCANCEL));
      setInspModal(true);
    }
  };

  const checkTrackerStatus = (val) => (
    <Box>
      {breakDownStatusJson.map(
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

  const isServiceImpacted = detailedData && detailedData.is_service_impacted ? detailedData.is_service_impacted : false;
  const Space = detailedData && detailedData.type === 'Space';
  const Equipment = detailedData && detailedData.type === 'Equipment';

  const open = Boolean(anchorEl);

  function checkActionAllowedDisabled(actionName) {
    let allowed = true;
    const woId = trackerDetails && trackerDetails.data && trackerDetails.data[0].mro_order_id
      ? trackerDetails.data[0].mro_order_id[0]
      : false;
    const escalateLevel = trackerDetails
      && trackerDetails.data
      && trackerDetails.data[0].current_escalation_level;
    if (escalateLevel !== 'level1' && actionName === 'Escalate Ticket') {
      allowed = false;
    }
    if (actionName === 'Go to Work Orders' && !woId) {
      allowed = false;
    }
    return allowed;
  }
  const switchActionItem = (action) => {
    handleClose();
    setLocationActionOpen(!changeLocationActionOpen);
    setSelectedActions(action.displayname);
    setSelectedActionImage(action.name);
    setEnterAction(Math.random());
  };

  const [messageModal, showMessageModal] = useState(false);
  const [escalateModal, showEscalateModal] = useState(false);
  const [reassignModal, showReassignModal] = useState(false);
  const [closeModal, showCloseModal] = useState(false);
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
  const [editId, setEditId] = useState(false);
  const [detailActions, setDetailActions] = useState([]);

  const [actionId, setActionId] = useState('');
  const [actionValue, setActionValue] = useState('');

  useEffect(() => {
    if (tenantUpdateInfo && tenantUpdateInfo.data && detailedData && detailedData.id && isDashboard) {
      dispatch(getTrackerDetail(detailedData.id, appModels.BREAKDOWNTRACKER));
      // dispatch(getBTConfig(companies, appModels.BREAKDOWNCONFIG));
    }
  }, [tenantUpdateInfo]);

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
      showCloseModal(true);
    }
    if (selectedActions === 'Put On-Hold') {
      setActionText('Pause');
      setActionCode('do_record');
      showPauseActionModal(true);
    }
    if (selectedActions === 'Move to In Progress') {
      if (
        trackerDetails
        && trackerDetails.data
        && trackerDetails.data[0].mro_order_id
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
        trackerDetails
        && trackerDetails.data
        && trackerDetails.data[0].mro_order_id
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

  const onViewReset = () => {
    setAddLink(false);
    setViewModal(true);
    setSelectedActions(defaultActionText);
    setSelectedActionImage('');
  };

  const isOnHoldRequested = detailedData && detailedData.is_on_hold_requested;

  useEffect(() => {
    if (surveyStatus && surveyStatus.data && surveyStatus.data.length && surveyStatus.data.length) {
      if (isApprovalRequired && !isOnHoldRequested) {
        const actions = [...surveyStatus.data, ...[{ id: Math.random(), name: 'Request On-Hold' }]];
        setDetailActions(actions);
      } else if (isApprovalRequired && isOnHoldRequested) {
        const actions = [...surveyStatus.data, ...[{ id: Math.random(), name: 'Cancel On-Hold Request' }, { id: Math.random(), name: 'On-Hold Request Approval' }]];
        setDetailActions(actions);
      } else {
        setDetailActions(surveyStatus.data);
      }
    } else if (isApprovalRequired && !isOnHoldRequested) {
      setDetailActions([{ id: Math.random(), name: 'Request On-Hold' }]);
    } else if (isApprovalRequired && isOnHoldRequested) {
      setDetailActions([{ id: Math.random(), name: 'Cancel On-Hold Request' }, { id: Math.random(), name: 'On-Hold Request Approval' }]);
    }
  }, [surveyStatus, btConfigInfo, detailedData]);

  const checkActionAllowed = (actionName) => {
    let allowed = false;
    const vrState = detailedData && detailedData.state_id ? extractNameObject(detailedData.state_id, 'name') : '';

    const stateConditonOne = ['In Progress', 'On Hold'];
    const stateConditonTwo = ['Closed', 'On Hold'];
    const stateConditonThree = ['In Progress'];

    if (vrState === 'Open' && stateConditonOne.includes(actionName) && !isOnHoldRequested && !(actionName === 'On Hold' && isApprovalRequired)) {
      allowed = true;
    }
    if (vrState === 'In Progress' && stateConditonTwo.includes(actionName) && !isOnHoldRequested && !(actionName === 'On Hold' && isApprovalRequired)) {
      allowed = true;
    }
    if (vrState === 'On Hold' && stateConditonThree.includes(actionName)) {
      allowed = true;
    }
    if (actionName === 'Request On-Hold' && (vrState === 'Open' || vrState === 'In Progress') && !isOnHoldRequested) {
      allowed = true;
    }
    if (actionName === 'Cancel On-Hold Request' && (vrState === 'Open' || vrState === 'In Progress') && isOnHoldRequested) {
      allowed = true;
    }
    if (actionName === 'On-Hold Request Approval' && (vrState === 'Open' || vrState === 'In Progress') && isOnHoldRequested) {
      allowed = true;
    }
    return allowed;
  };

  const checkActionDisabled = (actionName) => {
    let disabled = false;
    const userName = userInfo && userInfo.data && userInfo.data.name ? userInfo.data.name : false;
    const userRole = userInfo && userInfo.data && userInfo.data.user_role_id ? userInfo.data.user_role_id : false;
    const approvalUserRole = configData && configData.on_hold_approval_id && configData.on_hold_approval_id.id;

    if (actionName === 'Cancel On-Hold Request' && !(detailedData && detailedData.on_hold_requested_by === userName)) {
      disabled = true;
    }
    if (actionName === 'On-Hold Request Approval' && !(approvalUserRole === userRole)) {
      disabled = true;
    }
    return disabled;
  };

  const stateCurrent = trackerDetails && (trackerDetails.data && trackerDetails.data.length > 0) && trackerDetails.data[0].state_id.name ? trackerDetails.data[0].state_id.name : false;
  const isEditState = stateCurrent !== 'Closed';

  const closeEditModalWindow = () => {
    if (document.getElementById('trackercheckoutForm')) {
      document.getElementById('trackercheckoutForm').reset();
    }
    showEditModal(false);
  };

  const stageId = detailedData.stage_id ? extractIdObject(detailedData.state_id) : '';
  const stateName = getDefaultNoValue(extractNameObject(detailedData.state_id, 'name'));

  const switchStatus = (status, statusName) => {
    handleClose();
    dispatch(resetOnHoldRequest());
    dispatch(resetOnHoldApproval());
    dispatch(resetComplianceReinitiate());
    dispatch(resetUpdateParts());
    setActionId(status);
    setSelectedActions(statusName);
    setActionValue(statusName);
    if (statusName !== 'Request On-Hold' && statusName !== 'Cancel On-Hold Request' && statusName !== 'On-Hold Request Approval') {
      showActionModal(true);
    } else if (statusName === 'Request On-Hold') {
      showRequestModal(true);
    } else if (statusName === 'Cancel On-Hold Request') {
      showRequestCancelModal(true);
    } else if (statusName === 'On-Hold Request Approval') {
      showApprovalModal(true);
    }
  };

  const closeRequest = () => {
    showRequestModal(false);
    dispatch(resetOnHoldRequest());
    setSelectedActions(defaultActionText);
    setSelectedActionImage('');
    setActionId('');
    setActionValue('');
  };

  const closeApproval = () => {
    showApprovalModal(false);
    dispatch(resetOnHoldApproval());
    dispatch(resetComplianceReinitiate());
    setSelectedActions(defaultActionText);
    setSelectedActionImage('');
    setActionId('');
    setActionValue('');
  };

  const closeCancel = () => {
    showRequestCancelModal(false);
    dispatch(resetUpdateParts());
    setSelectedActions(defaultActionText);
    setSelectedActionImage('');
    setActionId('');
    setActionValue('');
  };

  const cancelStateChange = () => {
    dispatch(resetUpdateParts());
  };

  return (
    <>
      {detailedData && (
        <Box>
          <DetailViewHeader
            mainHeader={getDefaultNoValue(detailedData.name)}
            status={
              detailedData.state_id
                ? checkTrackerStatus(isOnHoldRequested && stateName !== 'On Hold' ? 'On-Hold Requested' : extractNameObject(detailedData.state_id, 'name'))
                : '-'
            }
            subHeader={(
              <>
                {detailedData.incident_date
                  && userInfo.data
                  && userInfo.data.timezone
                  ? moment
                    .utc(detailedData.incident_date)
                    .local()
                    .tz(userInfo.data.timezone)
                    .format('yyyy MMM Do, hh:mm A')
                  : '-'}
                {' '}
                Title -
                {' '}
                {truncate(getDefaultNoValue(detailedData.title), '70')}
              </>
            )}
            actionComponent={(
              <Box>
                {allowedOperations.includes(actionCodes['Add Comment']) && (
                  <Comments
                    detailData={trackerDetails}
                    model={appModels.BREAKDOWNTRACKER}
                    messageType="comment"
                    getDetail={getTrackerDetail}
                    setTab={setValue}
                    tab={value}
                  />
                )}
                {trackerDetails
                  && !trackerDetails.loading
                  && isEditState
                  && allowedOperations.includes(actionCodes['Edit Breakdown Tracker']) && (
                    <Button
                      type="button"
                      className="ticket-btn"
                      sx={{
                        backgroundColor: '#fff',
                        '&:hover': {
                          backgroundColor: '#fff',
                        },
                      }}
                      variant="outlined"
                      onClick={() => {
                        dispatch(resetCloseDuration());
                        showEditModal(true);
                        // setEditLink(true);
                        handleClose(false);
                        setEditId(trackerDetails && (trackerDetails.data && trackerDetails.data.length > 0) ? trackerDetails.data[0].id : false);
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
                  {detailActions.length && detailActions.length > 0 && (
                    <>
                      {detailActions.map((st) => (
                        checkActionAllowed(st.name) && (
                          <MenuItem
                            sx={{
                              font: 'normal normal normal 15px Suisse Intl',
                            }}
                            id="switchLocation"
                            key={st.id}
                            className="pl-2"
                            onClick={() => switchStatus(st.id, st.name)}
                            disabled={stageId === st.id || checkActionDisabled(st.name)}
                          >
                            {st.name === 'Closed' ? 'Close' : st.name}
                          </MenuItem>
                        )
                      ))}
                    </>
                  )}
                  {/* {actionsList
                      && actionsList.map(
                        (actions) => allowedOperations.includes(
                          actionCodes[actions.displayname],
                        )
                          && checkActionAllowed(
                            actions.displayname,
                            trackerDetails,
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
                                    : actions.displayname}
                            </MenuItem>
                        ),
                      )} */}
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
              {isOnHoldRequested && stateName !== 'On Hold' && (
              <Stack>
                <Alert severity="info">
                  <p className="font-family-tab mb-0">
                    On-Hold Approval Pending
                  </p>
                </Alert>
              </Stack>
              )}
              <TabPanel value={value} index={0}>
                <DetailViewLeftPanel
                  panelData={[
                    isApprovalRequired && (isOnHoldRequested || stateName === 'On Hold') && {
                      header: `On-Hold ${isOnHoldRequested ? 'Requested' : ''} Information`,
                      leftSideData:
                        [
                          {
                            property: 'Requested by',
                            value: getDefaultNoValue(detailedData.on_hold_requested_by),
                          },
                          {
                            property: 'Reason',
                            value: getDefaultNoValue(
                              extractNameObject(detailedData.pause_reason_id, 'name'),
                            ),
                          },
                        ],
                      rightSideData:
                        [
                          {
                            property: 'Requested On',
                            value: getDefaultNoValue(
                              getCompanyTimezoneDate(
                                detailedData.on_hold_requested_on,
                                userInfo,
                                'datetime',
                              ),
                            ),
                          },
                          {
                            property: 'Remarks',
                            value: getDefaultNoValue(detailedData.on_hold_requested_command),
                          },
                        ],
                    },
                    {
                      header: 'Incident Information',
                      leftSideData:
                        [
                          {
                            property: 'Incident Date',
                            value: getDefaultNoValue(
                              getCompanyTimezoneDate(
                                detailedData.incident_date,
                                userInfo,
                                'datetime',
                              ),
                            ),
                          },
                          {
                            property: 'Service Category',
                            value: getDefaultNoValue(
                              extractNameObject(detailedData.service_category_id, 'name'),
                            ),
                          },
                          {
                            property: isCritical && configData && configData.is_non_compliance ? 'Results in Statutory Non-Compliance?' : false,
                            value: getDefaultNoValue(detailedData.is_results_in_statutory_non_compliance ? 'Yes' : 'No'),
                          },
                          {
                            property: configData && configData.is_non_compliance ? 'Breakdown due to Ageing?' : false,
                            value: getDefaultNoValue((detailedData.is_breakdown_due_to_ageing ? 'Yes' : 'No')),
                          },
                        ],
                      rightSideData:
                        [
                          {
                            property: isCritical ? 'Criticality' : false,
                            value: getDefaultNoValue(detailedData.ciriticality),
                          },
                          {
                            property: 'Priority',
                            value: getDefaultNoValue(detailedData.priority),
                          },
                          {
                            property: !isCritical && configData && configData.is_non_compliance ? 'Results in Statutory Non-Compliance?' : false,
                            value: getDefaultNoValue(detailedData.is_results_in_statutory_non_compliance ? 'Yes' : 'No'),
                          },
                          {
                            property: configData && configData.is_non_compliance ? 'Is Service Impacted?' : false,
                            value: getDefaultNoValue((detailedData.is_service_impacted ? 'Yes' : 'No')),
                          },
                          {
                            property: configData && configData.is_non_compliance && isServiceImpacted ? 'Services Impacted' : false,
                            value: getDefaultNoValue(
                              getArrayToValues(detailedData.services_impacted_ids, 'name'),
                            ),
                          },
                        ],
                    },
                    {
                      header: 'Asset Information',
                      leftSideData: [
                        {
                          property: 'Company',
                          value: getDefaultNoValue(
                            extractNameObject(detailedData.company_id, 'name'),
                          ),
                        },
                        {
                          property: 'Type',
                          value: getDefaultNoValue(detailedData.type),
                        },
                        {
                          property: Space ? 'Space' : Equipment ? 'Asset' : false,
                          value: Space
                            ? getDefaultNoValue(extractNameObject(detailedData.space_id, 'path_name')) : <span className="text-info font-family-tab cursor-pointer" onClick={() => handleAssetView(detailedData.equipment_id && detailedData.equipment_id.id)}>{getDefaultNoValue(extractNameObject(detailedData.equipment_id, 'name'))}</span>,
                        },
                        {
                          property: inspId && configData && (configData.is_cancel_inspection || configData.is_cancel_inspection_space) ? 'Inspection Cancellation Request' : false,
                          value: <span aria-hidden className="text-info font-family-tab cursor-pointer" onClick={() => handleInspCancelView(inspId)}>View</span>,
                        },
                      ],
                      rightSideData: [
                        {
                          property: Equipment ? 'Asset Location' : false,
                          value: getDefaultNoValue(detailedData.equipment_id && detailedData.equipment_id.location_id && detailedData.equipment_id.location_id.path_name ? extractNameObject(detailedData.equipment_id.location_id, 'path_name') : ''),
                        },
                        {
                          property: Equipment ? 'AMC Status' : false,
                          value: getDefaultNoValue(detailedData.amc_status),
                        },
                        {
                          property: ppmId && configData && (configData.is_cancel_ppm || configData.is_cancel_ppm_space) ? 'PPM Cancellation Request' : false,
                          value: <span aria-hidden className="text-info font-family-tab cursor-pointer" onClick={() => handlePPMCancelView(ppmId)}>View</span>,
                        },
                      ],
                    },
                    {
                      header: 'Resolution Information',
                      leftSideData: [
                        {
                          property: 'Expected Closure Date',
                          value: getDefaultNoValue(getCompanyTimezoneDate(detailedData.expexted_closure_date, userInfo, 'datetime')),
                        },
                        {
                          property: 'Attended On',
                          value: getDefaultNoValue(getCompanyTimezoneDate(detailedData.attended_on, userInfo, 'datetime')),
                        },
                        {
                          property: 'Action Taken',
                          value: getDefaultNoValue(detailedData.action_taken),
                        },

                      ],
                      rightSideData: [
                        {
                          property: 'Closed On',
                          value: getDefaultNoValue(
                            getCompanyTimezoneDate(detailedData.closed_on, userInfo, 'datetime'),
                          ),
                        },
                        {
                          property: 'Remarks',
                          value: getDefaultNoValue(detailedData.remarks),
                        },
                        {
                          property: 'SLA Status',
                          value: getSLALabel(detailedData.sla_status),
                        },
                      ],
                    },
                    {
                      header: 'Vendor Information',
                      leftSideData: [
                        {
                          property: 'Vendor Name',
                          value: getDefaultNoValue(detailedData.vendor_name),
                        },
                        {
                          property: 'Complaint No',
                          value: getDefaultNoValue(detailedData.complaint_no),
                        },
                      ],
                      rightSideData: [
                        {
                          property: 'Vendor FSR Number (Field Service Number)',
                          value: getDefaultNoValue(detailedData.vendor_sr_number),
                        },
                        {
                          property: 'Description',
                          value: getDefaultNoValue(detailedData.description_of_breakdown ? detailedData.description_of_breakdown : ''),
                        },
                      ],
                    },
                  ]}
                />
                {detailedData.type === 'Equipment' && (
                  <>
                    <Typography
                      sx={detailViewHeaderClass}
                    >
                      Cost
                    </Typography>
                    <EquipmentCostForm editId={detailedData.equipment_id ? extractValueObjects(detailedData.equipment_id) : ''} breakdownId={detailedData.id} isAsset />
                  </>
                )}
              </TabPanel>
              <TabPanel value={value} index={1}>
                <StatusLogs />
              </TabPanel>
              <TabPanel value={value} index={2}>
                <SlaMatrix />
              </TabPanel>
              <TabPanel value={value} index={3}>
                <Documents
                  viewId={trackerDetails.data[0].id}
                  ticketNumber={trackerDetails.data[0].name ? trackerDetails.data[0].name : ''}
                  resModel={appModels.BREAKDOWNTRACKER}
                  model={appModels.DOCUMENT}
                />
              </TabPanel>
              <TabPanel value={value} index={4}>
                {/* <Comments /> */}
                <AuditLog ids={trackerDetails.data[0].message_ids} />
                <Divider />
              </TabPanel>
            </Box>
            {/* <Box
              sx={{
                width: '25%',
                height: '100%',
                backgroundColor: '#F6F8FA',
              }}
            >
              <DetailViewRightPanel
                panelOneHeader="Title"
                panelOneLabel={getDefaultNoValue(detailedData.title)}
                panelTwoHeader={getDefaultNoValue(
                  extractNameObject(detailedData.space_id, 'path_name'),
                )}
                panelTwoData={[
                  {
                    value: getDefaultNoValue(
                      extractNameObject(detailedData.equipment_id, 'name'),
                    ),
                  },
                ]}
                panelThreeHeader="Incident Information"
                panelThreeData={[
                  {
                    header: 'Status',
                    value:
                      detailedData.state_id
                        ? checkTrackerStatus(extractNameObject(detailedData.state_id, 'name'))
                        : '-',
                  },
                  {
                    header: 'Created on',
                    value: getDefaultNoValue(
                      getCompanyTimezoneDate(
                        detailedData.create_date,
                        userInfo,
                        'datetime',
                      ),
                    ),
                  },
                ]}
              />
            </Box> */}
          </Box>
        </Box>
      )}
      {trackerDetails && trackerDetails.loading && <Loader />}
      <Drawer
        PaperProps={{
          sx: { width: '98%' },
        }}
        anchor="right"
        open={equipmentModal}
        ModalProps={{
          disableEnforceFocus: true,
        }}
      >
        <DrawerHeader
          headerName={
                  equipmentsDetails
                    && equipmentsDetails.data
                    && equipmentsDetails.data.length
                    && equipmentsDetails.data[0]
                    ? equipmentsDetails.data[0].name
                    : ''
                }
          imagePath={assetIcon}
          onClose={() => setEquipmentModal(false)}
        />
        <AssetDetailView
          setEditId={setEditId}
          editId={editId}
          isSearch={false}
          setViewModal={setEquipmentModal}
          viewModal={equipmentModal}
          isITAsset={false}
          categoryType={false}
        />
      </Drawer>
      <Drawer
        PaperProps={{
          sx: { width: '90%' },
        }}
        anchor="right"
        open={ppmModal}
        ModalProps={{
          disableEnforceFocus: true,
        }}
      >
        <DrawerHeader
          headerName={hxPpmCancelDetails && (hxPpmCancelDetails.data && hxPpmCancelDetails.data.length > 0 && !hxPpmCancelDetails.loading)
            ? hxPpmCancelDetails.data[0].remarks : 'Cancel Request'}
          imagePath={TrackerCheck}
          onClose={() => setPPMModal(false)}
        />
        <CancelRequestDetails offset={false} />

      </Drawer>
      <Drawer
        PaperProps={{
          sx: { width: '90%' },
        }}
        anchor="right"
        open={inspModal}
        ModalProps={{
          disableEnforceFocus: true,
        }}
      >
        <DrawerHeader
          headerName={hxInspCancelDetails && (hxInspCancelDetails.data && hxInspCancelDetails.data.length > 0 && !hxInspCancelDetails.loading)
            ? hxInspCancelDetails.data[0].reason : 'Cancel Request'}
          imagePath={TrackerCheck}
               // isEditable={isEditable}
          onClose={() => setInspModal(false)}
        />
        <InspCancelRequestDetails offset={false} />

      </Drawer>
      {actionModal && (
        <Action
          atFinish={() => {
            showActionModal(false); cancelStateChange(); setSelectedActions(defaultActionText);
            dispatch(resetComplianceReinitiate());
          }}
          actionId={actionId}
          actionValue={actionValue}
          details={trackerDetails}
          actionModal
        />
      )}
      {requestModal && (
      <OnHoldRequest
        atFinish={() => closeRequest()}
        atCancel={() => closeRequest()}
        detailData={detailedData}
        actionModal={requestModal}
      />
      )}
      {approvalModal && (
      <OnHoldApproval
        atFinish={() => closeApproval()}
        atCancel={() => closeApproval()}
        detailData={detailedData}
        actionModal={approvalModal}
      />
      )}
      {requestCancelModal && (
      <OnHoldRequestCancel
        atFinish={() => closeCancel()}
        atCancel={() => closeCancel()}
        detailData={detailedData}
        actionModal={requestCancelModal}
      />
      )}
      <Drawer
        PaperProps={{
          sx: { width: '85%' },
        }}
        anchor="right"
        open={editModal}
      >
        <DrawerHeader
          headerName="Update Breakdown Tracker"
          imagePath={TrackerCheck}
          onClose={() => {
            dispatch(resetCloseDuration());
            showEditModal(false);
            onViewEditReset();
          }}
        />
        <CreateTracker editId={editId} closeModal={closeEditModalWindow} />
        {/* <CreateTicketForm
          editIds={editId}
          afterReset={onViewEditReset}
          closeModal={() => setEditLink(false)}
        /> */}
      </Drawer>
      {/* <Drawer
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
      </Drawer> */}
    </>
  );
};

TicketDetails.defaultProps = {
  isAsset: false,
};

TicketDetails.propTypes = {
  isAsset: PropTypes.bool,
};
export default TicketDetails;
