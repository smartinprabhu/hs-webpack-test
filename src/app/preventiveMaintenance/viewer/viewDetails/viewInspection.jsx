/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as PropTypes from 'prop-types';
import Drawer from '@mui/material/Drawer';
import { Box } from '@mui/system';
import {
  IconButton, Button, Menu, Typography, Divider,
} from '@mui/material';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { BsThreeDotsVertical } from 'react-icons/bs';
import MenuItem from '@mui/material/MenuItem';
import { AiFillCheckCircle } from 'react-icons/ai';
import { FaTimesCircle } from 'react-icons/fa';

import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';

import workOrdersBlue from '@images/icons/workOrders.svg';

import ReviewWorkorder from '../../../inspectionSchedule/viewer/reviewWorkorder';

import {
  generateErrorMessage,
  getDefaultNoValue,
  TabPanel,
  getCompanyTimezoneDate,
  getTimeFromDecimal,
  extractNameObject,
  getColumnArrayById,
  getListOfOperations,
} from '../../../util/appUtils';
import { resetUpdateProductCategory } from '../../../pantryManagement/pantryService';
import {
  resetEscalate,
  getOrderDetail,
} from '../../../workorders/workorderService';
import OrderDetail from '../../../workorders/workorderDetails/workorderDetails';
import customData from '../data/customData.json';
import { getWorkOrderStateLabelNew } from '../../../workorders/utils/utils';

import DrawerHeader from '../../../commonComponents/drawerHeader';
import DetailViewHeader from '../../../commonComponents/detailViewHeader';
import DetailViewTab from '../../../commonComponents/detailViewTab';
import DetailViewRightPanel from '../../../commonComponents/detailViewRightPanel';
import DetailViewLeftPanel from '../../../commonComponents/detailViewLeftPanel';
import Checklists from './checklists';
import { ppmStatusLogJson, workorderStatusCapJson, detailViewHeaderClass } from '../../../commonComponents/utils/util';
import { getPPMSettingsDetails } from '../../../siteOnboarding/siteService';
import {
  resetUpdateScheduler,
  getHxPPMDetails,
  getHxPPMCancelDetails,
  resetCancelReq,
  getLastUpdate,
} from '../../ppmService';
import actionCodes from '../../data/preventiveActionCodes.json';
import SignOffPPM from './signOffPPM';
import SubAssets from './subAssets';
import StatusLogs from './statusLogs';
import PrepostPonePPM from './prepostPonePPM';
import PrepostPoneApproval from './prepostPoneApproval';
import PrepostPoneCancel from './prepostPoneCancel';
import PpmCancelRequest from './ppmCancelRequest';
import PpmCancelApproval from './ppmCancelApproval';
import PpmCancelCancellation from './ppmCancelCancellation';

const appModels = require('../../../util/appModels').default;

const faIcons = {
  WORKORDER: workOrdersBlue,
  WORKORDERACTIVE: workOrdersBlue,
};

const viewInspection = (props) => {
  const {
    atFinish, eventDetailModel,
  } = props;

  const dispatch = useDispatch();
  const { userInfo, userRoles } = useSelector((state) => state.user);

  const [modal, setModal] = useState(eventDetailModel);
  const [reviewModal, showReviewModal] = useState(false);
  const [signModal, showSignModal] = useState(false);

  const {
    ppmWeekInfo,
  } = useSelector((state) => state.inspection);
  const {
    hxPpmDetails,
    hxPpmCancelDetails,
  } = useSelector((state) => state.ppm);
  const {
    ppmSettingsInfo,
  } = useSelector((state) => state.site);

  const {
    warehouseLastUpdate,
  } = useSelector((state) => state.ppm);

  const allowedOperations = getListOfOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'code');

  const lastUpdateTime = warehouseLastUpdate && warehouseLastUpdate.data && warehouseLastUpdate.data.length && warehouseLastUpdate.data[0].last_updated_at ? warehouseLastUpdate.data[0].last_updated_at : false;

  const defaultActionText = 'PPM Actions';

  const [selectedActions, setSelectedActions] = useState(defaultActionText);
  const [selectedActionImage, setSelectedActionImage] = useState('');
  const [changeLocationActionOpen, setLocationActionOpen] = useState(false);
  const [enterAction, setEnterAction] = useState(false);
  const [addLink, setAddLink] = useState(false);
  const [value, setValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);

  const [requestModal, showRequestModal] = useState(false);
  const [approvalModal, showApprovalModal] = useState(false);
  const [cancelModal, showCancelModal] = useState(false);
  const [cancelRequestModal, showCancelRequestModal] = useState(false);
  const [cancelApprovalModal, showCancelApprovalModal] = useState(false);
  const [cancelCancellationModal, showCancelCancellationModal] = useState(false);

  const changeLocationActionToggle = () => setLocationActionOpen(!changeLocationActionOpen);

  const loading = ppmWeekInfo && ppmWeekInfo.loading;
  const isErr = ((ppmWeekInfo && ppmWeekInfo.err) || (ppmWeekInfo && ppmWeekInfo.data && !ppmWeekInfo.data.length));
  const inspDeata = ppmWeekInfo && ppmWeekInfo.data && ppmWeekInfo.data.data
    && ppmWeekInfo.data.data.length ? ppmWeekInfo.data.data[0] : false;

  const ppmConfig = ppmSettingsInfo && ppmSettingsInfo.data && ppmSettingsInfo.data.length ? ppmSettingsInfo.data[0] : false;

  const isReViewRequired = ppmConfig && ppmConfig.is_review_required;
  const isSignOffRequired = ppmConfig && ppmConfig.is_sign_off_required;

  const isPostPrepone = allowedOperations.includes(actionCodes['PrePostPone PPM']);
  const isCancel = allowedOperations.includes(actionCodes['Cancel PPM']);
  const isPostPreponeApprove = allowedOperations.includes(actionCodes['PrePostPone PPM Approval']);
  const isCancelApprove = allowedOperations.includes(actionCodes['Cancel PPM Approval']);

  const canPostPrepone = ppmConfig && ppmConfig.allow_postpone_prepone && isPostPrepone;
  const canPostPreponePast = ppmConfig && ppmConfig.allow_postpone_week;
  const canCancel = ppmConfig && ppmConfig.is_can_cancel && isCancel;

  // const configData = ppmSettingsInfo && ppmSettingsInfo.data && ppmSettingsInfo.data.length ? ppmSettingsInfo.data[0] : false;

  const tabs = ppmConfig && ppmConfig.is_subassets_viewer && inspDeata && inspDeata.category_type === 'Equipment' ? ['Schedule Overview', 'Checklists', 'Status Logs', 'Sub-Assets'] : ['Schedule Overview', 'Checklists', 'Status Logs'];

  function isReviewUser() {
    let res = false;
    const userRoleId = userInfo && userInfo.data && userInfo.data.user_role_id ? userInfo.data.user_role_id : false;
    if (userRoleId && ppmConfig && ppmConfig.review_role_id && ppmConfig.review_role_id.id && userRoleId === ppmConfig.review_role_id.id) {
      res = true;
    }
    return res;
  }

  function isSignOffUser() {
    let res = false;
    const userRoleId = userInfo && userInfo.data && userInfo.data.user_role_id ? userInfo.data.user_role_id : false;
    if (userRoleId && ppmConfig && ppmConfig.sign_off_role_id && ppmConfig.sign_off_role_id.id && userRoleId === ppmConfig.sign_off_role_id.id) {
      res = true;
    }
    return res;
  }

  const userEmployee = userInfo && userInfo.data && userInfo.data.employee && userInfo.data.employee.id ? userInfo.data.employee.id : false;
  const userRole = userInfo && userInfo.data && userInfo.data.user_role_id ? userInfo.data.user_role_id : false;
  const userId = userInfo && userInfo.data && userInfo.data.id ? userInfo.data.id : false;
  const userMail = userInfo && userInfo.data && userInfo.data.email && userInfo.data.email.email ? userInfo.data.email.email : false;

  const requestData = useMemo(() => (hxPpmDetails && hxPpmDetails.data && hxPpmDetails.data.length ? hxPpmDetails.data[0] : false), [hxPpmDetails]);
  const cancelData = useMemo(() => (hxPpmCancelDetails && hxPpmCancelDetails.data && hxPpmCancelDetails.data.length ? hxPpmCancelDetails.data[hxPpmCancelDetails.data.length - 1] : false), [hxPpmCancelDetails]);

  function isApproveUser() {
    let res = false;
    const canPostPreponeApproval = ppmConfig && ppmConfig.approval_required_for_postpone;
    const pendingdata = requestData && requestData.prepone_postpone_approval_ids && requestData.prepone_postpone_approval_ids.length ? requestData.prepone_postpone_approval_ids.filter((item) => item.state === 'Pending') : [];
    if (pendingdata && pendingdata.length > 0) {
      const pendingAuthData = pendingdata[pendingdata.length - 1];
      const teamData = pendingAuthData.approval_authority_id.type === 'Team';
      const userData = pendingAuthData.approval_authority_id.type === 'User';
      const roleData = pendingAuthData.approval_authority_id.type === 'Role';
      const customMailData = pendingAuthData.approval_authority_id.type === 'Custom';
      if (userData) {
        const userData1 = pendingAuthData.approval_authority_id.users_ids && pendingAuthData.approval_authority_id.users_ids.length ? pendingAuthData.approval_authority_id.users_ids : [];
        if (userData1 && userData1.length && getColumnArrayById(userData1, 'id').includes(userId)) {
          res = true;
        }
      }
      if (roleData) {
        const roleData1 = pendingAuthData.approval_authority_id.role_id && pendingAuthData.approval_authority_id.role_id.id;
        if (roleData1 && roleData1 === userRole) {
          res = true;
        }
      }
      if (customMailData) {
        const customMailData1 = pendingAuthData.approval_authority_id.user_defined_email_ids && pendingAuthData.approval_authority_id.user_defined_email_ids.includes(userMail);
        if (customMailData1) {
          res = true;
        }
      }
      if (teamData) {
        const teamMembers = pendingAuthData.approval_authority_id.team_members.member_ids.map((item) => ({
          employee_ids: item.employee_id && item.employee_id.id ? item.employee_id.id : '',
        }));
          // const teamEmployees = teamMembers.flatMap((item) => item.employee_ids.map((employee) => employee.id));
        const teamData1 = teamMembers.filter((item) => item.employee_ids && item.employee_ids === userEmployee);
        if (teamData1 && teamData1.length) {
          res = true;
        }
      }
    } else if (ppmConfig && ppmConfig.approval_authority && ppmConfig.approval_authority.id) {
      const teamData = ppmConfig.approval_authority.type === 'Team';
      const userData = ppmConfig.approval_authority.type === 'User';
      const roleData = ppmConfig.approval_authority.type === 'Role';
      const customMailData = ppmConfig.approval_authority.type === 'Custom';
      if (userData) {
        const userData1 = ppmConfig.approval_authority.users_ids && ppmConfig.approval_authority.users_ids.length ? ppmConfig.approval_authority.users_ids : [];
        if (userData1 && userData1.length && getColumnArrayById(userData1, 'id').includes(userId)) {
          res = true;
        }
      }
      if (roleData) {
        const roleData1 = ppmConfig.approval_authority.role_id && ppmConfig.approval_authority.role_id.id;
        if (roleData1 && roleData1 === userRole) {
          res = true;
        }
      }
      if (customMailData) {
        const customMailData1 = ppmConfig.approval_authority.user_defined_email_ids && ppmConfig.approval_authority.user_defined_email_ids.includes(userMail);
        if (customMailData1) {
          res = true;
        }
      }
      if (teamData) {
        const teamMembers = ppmConfig.approval_authority.team_members.member_ids.map((item) => ({
          employee_ids: item.employee_id && item.employee_id.id ? item.employee_id.id : '',
        }));
          // const teamEmployees = teamMembers.flatMap((item) => item.employee_ids.map((employee) => employee.id));
        const teamData1 = teamMembers.filter((item) => item.employee_ids && item.employee_ids === userEmployee);
        if (teamData1 && teamData1.length) {
          res = true;
        }
      }
    }
    return canPostPreponeApproval ? res : true;
  }

  function isRequestUser() {
    let res = false;
    const pendingdata = requestData && requestData.prepone_postpone_approval_ids && requestData.prepone_postpone_approval_ids.length ? requestData.prepone_postpone_approval_ids.filter((item) => item.state === 'Pending') : [];
    if (pendingdata && pendingdata.length > 0) {
      const pendingAuthData = pendingdata[pendingdata.length - 1];
      const requestorId = pendingAuthData.requested_by_id && pendingAuthData.requested_by_id.id;
      if (requestorId) {
        if (requestorId === userId) {
          res = true;
        }
      }
    }
    return res;
  }

  function isCancelApproveUser() {
    let res = false;
    const canCancelApproval = ppmConfig && ppmConfig.approval_required_for_cancel;
    if (cancelData && cancelData.id) {
      const pendingAuthData = cancelData;
      const teamData = pendingAuthData.cancel_approval_authority.type === 'Team';
      const userData = pendingAuthData.cancel_approval_authority.type === 'User';
      const roleData = pendingAuthData.cancel_approval_authority.type === 'Role';
      const customMailData = pendingAuthData.cancel_approval_authority.type === 'Custom';
      if (userData) {
        const userData1 = pendingAuthData.cancel_approval_authority.users_ids && pendingAuthData.cancel_approval_authority.users_ids.length ? pendingAuthData.cancel_approval_authority.users_ids : [];
        if (userData1 && userData1.length && getColumnArrayById(userData1, 'id').includes(userId)) {
          res = true;
        }
      }
      if (roleData) {
        const roleData1 = pendingAuthData.cancel_approval_authority.role_id && pendingAuthData.cancel_approval_authority.role_id.id;
        if (roleData1 && roleData1 === userRole) {
          res = true;
        }
      }
      if (customMailData) {
        const customMailData1 = pendingAuthData.cancel_approval_authority.user_defined_email_ids && pendingAuthData.cancel_approval_authority.user_defined_email_ids.includes(userMail);
        if (customMailData1) {
          res = true;
        }
      }
      if (teamData) {
        const teamMembers = pendingAuthData.cancel_approval_authority.team_members.member_ids.map((item) => ({
          employee_ids: item.employee_id && item.employee_id.id ? item.employee_id.id : '',
        }));
          // const teamEmployees = teamMembers.flatMap((item) => item.employee_ids.map((employee) => employee.id));
        const teamData1 = teamMembers.filter((item) => item.employee_ids && item.employee_ids === userEmployee);
        if (teamData1 && teamData1.length) {
          res = true;
        }
      }
    } else if (ppmConfig && ppmConfig.cancel_approval_authority && ppmConfig.cancel_approval_authority.id) {
      const teamData = ppmConfig.cancel_approval_authority.type === 'Team';
      const userData = ppmConfig.cancel_approval_authority.type === 'User';
      const roleData = ppmConfig.cancel_approval_authority.type === 'Role';
      const customMailData = ppmConfig.cancel_approval_authority.type === 'Custom';
      if (userData) {
        const userData1 = ppmConfig.cancel_approval_authority.users_ids && ppmConfig.cancel_approval_authority.users_ids.length ? ppmConfig.approval_authority.users_ids : [];
        if (userData1 && userData1.length && getColumnArrayById(userData1, 'id').includes(userId)) {
          res = true;
        }
      }
      if (roleData) {
        const roleData1 = ppmConfig.cancel_approval_authority.role_id && ppmConfig.cancel_approval_authority.role_id.id;
        if (roleData1 && roleData1 === userRole) {
          res = true;
        }
      }
      if (customMailData) {
        const customMailData1 = ppmConfig.cancel_approval_authority.user_defined_email_ids && ppmConfig.cancel_approval_authority.user_defined_email_ids.includes(userMail);
        if (customMailData1) {
          res = true;
        }
      }
      if (teamData) {
        const teamMembers = ppmConfig.cancel_approval_authority.team_members.member_ids.map((item) => ({
          employee_ids: item.employee_id && item.employee_id.id ? item.employee_id.id : '',
        }));
          // const teamEmployees = teamMembers.flatMap((item) => item.employee_ids.map((employee) => employee.id));
        const teamData1 = teamMembers.filter((item) => item.employee_ids && item.employee_ids === userEmployee);
        if (teamData1 && teamData1.length) {
          res = true;
        }
      }
    }
    return canCancelApproval ? res : true;
  }

  function isCancelRequestUser() {
    let res = false;
    console.log(cancelData);
    console.log(userId);
    if (cancelData && cancelData.id) {
      const requestorId = cancelData.requested_by_id && cancelData.requested_by_id.id;
      if (requestorId) {
        if (requestorId === userId) {
          res = true;
        }
      }
    }
    return res;
  }

  /* const openInNewTab = (url) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.opener = null;
  }; */

  const isApprovalPending = (requestData && requestData.is_pending_for_approval);
  const isCancelApprovalPending = (requestData && requestData.is_cancellation_requested);
  const isOnHoldApprovalPending = (requestData && requestData.is_on_hold_requested);

  const isRescheduled = (requestData && requestData.is_rescheduled);

  useMemo(() => {
    if (inspDeata && inspDeata.company_id && inspDeata.company_id.length) {
      dispatch(getPPMSettingsDetails(inspDeata.company_id[0], appModels.PPMWEEKCONFIG));
      dispatch(getHxPPMDetails(inspDeata.id, 'ppm.scheduler_week'));
      setValue(0);
    }
  }, [ppmWeekInfo]);

  useMemo(() => {
    if (requestData && requestData.id) {
      dispatch(getHxPPMCancelDetails(inspDeata.id, 'ppm.scheduler_cancel', 'ppm.scheduler_week'));
    }
  }, [hxPpmDetails]);

  useEffect(() => {
    dispatch(getLastUpdate(appModels.PPMWEEK));
  }, [signModal, reviewModal]);

  useEffect(() => {
    dispatch(resetEscalate());
    if (selectedActions === 'Review Work order') {
      showReviewModal(true);
    }
    if (selectedActions === 'Sign off') {
      showSignModal(true);
    }
    if (selectedActions === 'Prepone/Postpone PPM') {
      showRequestModal(true);
    }
    if (selectedActions === 'Approve/Reject Prepone/Postpone Request') {
      showApprovalModal(true);
    }
    if (selectedActions === 'Withdraw Prepone/Postpone Request') {
      showCancelModal(true);
    }
    if (selectedActions === 'Cancel PPM') {
      showCancelRequestModal(true);
    }
    if (selectedActions === 'Approve/Reject Cancellation Request') {
      showCancelApprovalModal(true);
    }
    if (selectedActions === 'Withdraw Cancellation Request') {
      showCancelCancellationModal(true);
    }
    if (selectedActions === 'Go to Work order') {
      if (inspDeata && inspDeata.order_id) {
        dispatch(getOrderDetail(inspDeata.order_id, appModels.ORDER));
        setAddLink(true);
        setModal(false);
      }
    }
  }, [enterAction]);

  function checkActionAllowed(actionName) {
    let allowed = false;
    const oId = inspDeata && inspDeata.order_id ? inspDeata.order_id : false;
    const statusName = inspDeata && inspDeata.state ? inspDeata.state : false;
    const statusNameNew = requestData && requestData.state ? requestData.state : false;
    const rId = inspDeata && inspDeata.reviewed_by ? inspDeata.reviewed_by : false;
    if (actionName === 'Go to Work order' && (statusNameNew !== 'Cancelled') && oId && !isCancelApprovalPending && !isApprovalPending) {
      allowed = true;
    }
    if (actionName === 'Review Work order' && (statusNameNew === 'Completed') && !isCancelApprovalPending && !isApprovalPending && isReViewRequired && oId && !rId && isReviewUser()) {
      allowed = true;
    }
    if (actionName === 'Sign off' && (statusNameNew === 'Completed') && !isApprovalPending && !isCancelApprovalPending && isSignOffRequired && oId && (rId || !isReViewRequired) && !inspDeata.is_signed_off && isSignOffUser()) {
      allowed = true;
    }
    if (actionName === 'Prepone/Postpone PPM' && !isOnHoldApprovalPending && !isCancelApprovalPending && ((statusNameNew === 'Upcoming' && canPostPrepone && !isApprovalPending) || (statusNameNew === 'Missed' && canPostPrepone && !isApprovalPending && canPostPreponePast))) {
      allowed = true;
    }
    if (actionName === 'Withdraw Prepone/Postpone Request' && (isApprovalPending)) {
      allowed = true;
    }
    if (actionName === 'Approve/Reject Prepone/Postpone Request' && (isApprovalPending) && isPostPreponeApprove) {
      allowed = true;
    }
    if (actionName === 'Cancel PPM' && !isOnHoldApprovalPending && !isApprovalPending && !isCancelApprovalPending && canCancel && (statusNameNew === 'Upcoming' || statusNameNew === 'Missed' || statusNameNew === 'On-hold')) {
      allowed = true;
    }
    if (actionName === 'Approve/Reject Cancellation Request' && isCancelApprovalPending && isCancelApprove) {
      allowed = true;
    }
    if (actionName === 'Withdraw Cancellation Request' && isCancelApprovalPending) {
      allowed = true;
    }
    return allowed;
  }

  function checkActionDisable(actionName) {
    let disable = false;
    if (actionName === 'Withdraw Prepone/Postpone Request' && (isApprovalPending && !isRequestUser())) {
      disable = true;
    }
    if (actionName === 'Approve/Reject Prepone/Postpone Request' && (isApprovalPending && !isApproveUser())) {
      disable = true;
    }
    if (actionName === 'Approve/Reject Cancellation Request' && isCancelApprovalPending && !isCancelApproveUser()) {
      disable = true;
    }
    if (actionName === 'Withdraw Cancellation Request' && isCancelApprovalPending && !isCancelRequestUser()) {
      disable = true;
    }
    return disable;
  }

  const toggle = () => {
    setModal(!modal);
    setSelectedActions(defaultActionText);
    setSelectedActionImage('');
    atFinish();
  };

  const openWorkOrder = () => {
    if (inspDeata && inspDeata.order_id) {
      dispatch(getOrderDetail(inspDeata.order_id, appModels.ORDER));
      setAddLink(true);
      setModal(false);
    }
  };

  const closeWorkOrder = () => {
    setSelectedActions(defaultActionText);
    setSelectedActionImage('');
    setAddLink(false);
    setModal(true);
  };

  const switchActionItem = (action) => {
    setLocationActionOpen(!changeLocationActionOpen);
    setSelectedActions(action.displayname);
    setSelectedActionImage(action.name);
    setEnterAction(Math.random());
    dispatch(resetCancelReq());
    dispatch(resetUpdateProductCategory());
    handleClose();
  };

  const closeRequest = () => {
    showRequestModal(false);
    dispatch(resetUpdateProductCategory());
    setSelectedActions(defaultActionText);
    setSelectedActionImage('');
  };

  const closeCancelRequest = () => {
    showCancelRequestModal(false);
    dispatch(resetCancelReq());
    setSelectedActions(defaultActionText);
    setSelectedActionImage('');
  };

  const closeCancelApproval = () => {
    showCancelApprovalModal(false);
    dispatch(resetCancelReq());
    setSelectedActions(defaultActionText);
    setSelectedActionImage('');
  };

  const closeCancelCancellation = () => {
    showCancelCancellationModal(false);
    dispatch(resetCancelReq());
    setSelectedActions(defaultActionText);
    setSelectedActionImage('');
  };

  const closeApproval = () => {
    showApprovalModal(false);
    dispatch(resetUpdateProductCategory());
    setSelectedActions(defaultActionText);
    setSelectedActionImage('');
  };

  const closeCancel = () => {
    showCancelModal(false);
    dispatch(resetUpdateProductCategory());
    setSelectedActions(defaultActionText);
    setSelectedActionImage('');
  };

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);

  const actionItems = customData && customData.actionItems ? customData.actionItems : [];

  const actionButtonItems = customData && customData.actionButtonItems ? customData.actionButtonItems : [];

  // const actionItems1 = !isReViewRequired ? actionDefaultItems.filter((item) => item.name !== 'REVIEW') : actionDefaultItems;
  //  const actionItems = !isSignOffRequired ? actionItems1.filter((item) => item.name !== 'SIGNOFF') : actionItems1;

  const checkStatus = (val, isHoldRequested, pauseReason, isServiceReport) => (
    <Box>
      {ppmStatusLogJson.map(
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
            {isHoldRequested ? 'On-Hold Requested' : status.text}
            {isServiceReport && val === 'Pause' && (
              <span className="ml-2">
                (
                {pauseReason}
                )
              </span>
            )}
          </Box>
        ),
      )}
    </Box>
  );

  const checkOderStatus = (val, isHoldRequested, pauseReason, isServiceReport) => (
    <Box>
      {workorderStatusCapJson.map(
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
            {isHoldRequested ? 'On-Hold Requested' : status.text}
            {isServiceReport && val === 'PAUSE' && (
              <span className="ml-2">
                (
                {pauseReason}
                )
              </span>
            )}
          </Box>
        ),
      )}
    </Box>
  );
  const checkAdditionalInfo = inspDeata && (inspDeata.at_start_mro || inspDeata.at_review_mro || inspDeata.at_done_mro || inspDeata.enforce_time || inspDeata.qr_scan_at_start || inspDeata.qr_scan_at_done || inspDeata.nfc_scan_at_start || inspDeata.nfc_scan_at_done || inspDeata.is_generate_wo);

  const returnCheckIcon = (showGreen, showText) => (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        margin: '5px 0px 5px 0px',
        minHeight: '50px',
      }}
    >
      <Typography>
        {showGreen
          ? (
            <AiFillCheckCircle
              size={15}
              cursor="pointer"
              className="mr-1"
              style={{ color: 'green' }}
            />
          )
          : (
            <FaTimesCircle
              size={15}
              cursor="pointer"
              className="mr-1"
              style={{ color: 'red' }}
            />
          )}
        {showText}
      </Typography>
    </Box>
  );
  return (
    <>
      <Drawer
        PaperProps={{
          sx: { width: '85%' },
        }}
        anchor="right"
        open={eventDetailModel}
      >
        <DrawerHeader
          headerName={inspDeata && inspDeata.name ? inspDeata.name : 'PPM View'}
          onClose={toggle}
        />
        {!loading && inspDeata && (
          <>
            <DetailViewHeader
              mainHeader={getDefaultNoValue(inspDeata.asset_name)}
              isScheduled={isRescheduled}
              status={checkStatus(inspDeata.state, inspDeata.is_on_hold_requested, inspDeata.pause_reason_name, inspDeata.is_service_report_required)}
              subHeader={(
                <>
                  {getDefaultNoValue(inspDeata.asset_code)}
                </>
              )}
              actionComponent={(
                <Box>
                  {actionButtonItems && actionButtonItems.map((actions) => (
                    checkActionAllowed(actions.displayname) && (
                      <Button
                        type="button"
                        variant="outlined"
                        sx={{
                          backgroundColor: '#fff',
                          '&:hover': {
                            backgroundColor: '#fff',
                          },
                        }}
                        className="ticket-btn"
                        disabled={checkActionDisable(actions.displayname)}
                        onClick={() => switchActionItem(actions)}
                      >
                        {actions.displayname}
                      </Button>
                    )
                  ))}
                  {actionItems?.some((action) => checkActionAllowed(action.displayname)) && (
                  <>
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
                      {actionItems && actionItems.map((actions) => (
                        checkActionAllowed(actions.displayname) && (
                        <MenuItem
                          sx={{
                            font: 'normal normal normal 15px Suisse Intl',
                          }}
                          id="switchAction"
                          className="pl-2"
                          key={actions.id}
                          disabled={checkActionDisable(actions.displayname)}
                          onClick={() => switchActionItem(actions)}
                        >
                          {actions.displayname}
                        </MenuItem>
                        )
                      ))}
                    </Menu>
                  </>
                  )}
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
                  width: '75%',
                }}
              >
                <DetailViewTab
                  value={value}
                  handleChange={handleTabChange}
                  tabs={tabs}
                />
                <Stack>
                  {inspDeata && lastUpdateTime && (
                  <Alert severity="info">
                    Last Updated at:
                    {'  '}
                    {lastUpdateTime ? getCompanyTimezoneDate(lastUpdateTime, userInfo, 'datetime') : 'N/A'}
                  </Alert>
                  )}
                </Stack>
                {isApprovalPending && (
                  <Stack>
                    <Alert severity="warning">
                      <p className="font-family-tab mb-0">
                        Prepone/Postpone Approval Pending
                      </p>
                    </Alert>
                  </Stack>
                )}
                {isCancelApprovalPending && (
                  <Stack>
                    <Alert severity="warning">
                      <p className="font-family-tab mb-0">
                        Cancellation of PPM Approval Pending
                      </p>
                    </Alert>
                  </Stack>
                )}
                {requestData && inspDeata && inspDeata.state && requestData.state && ((inspDeata.state !== requestData.state) || (inspDeata.starts_on !== requestData.starts_on) || (inspDeata.ends_on !== requestData.ends_on)) && (
                <Stack className="mt-2">
                  <Alert severity="info">
                    <p className="font-family-tab mb-0">
                      The updates will reflect shortly. Please check again later.
                    </p>
                  </Alert>
                </Stack>
                )}
                <TabPanel value={value} index={0}>
                  {inspDeata.is_signed_off && inspDeata.reviewed_on && (
                  <DetailViewLeftPanel
                    panelData={[{
                      header: 'Scheduler Information',
                      leftSideData: [
                        {
                          property: 'Maintenance Team',
                          value: getDefaultNoValue(inspDeata.maintenance_team_name),
                        },
                        {
                          property: 'Starts On',
                          value: getDefaultNoValue(getCompanyTimezoneDate(inspDeata.starts_on, userInfo, 'date')),
                        },
                        {
                          property: 'Duration',
                          value: getTimeFromDecimal(inspDeata.duration),
                        },
                        {
                          property: 'Compliance Type',
                          value: getDefaultNoValue(inspDeata.compliance_type),
                        },
                      ],
                      rightSideData: [
                        {
                          property: 'Maintenance Operation',
                          value: getDefaultNoValue(inspDeata.task_name),
                        },
                        {
                          property: 'Ends On',
                          value: getDefaultNoValue(getCompanyTimezoneDate(inspDeata.ends_on, userInfo, 'date')),
                        },
                        {
                          property: 'Gate Pass Reference',
                          value: getDefaultNoValue(inspDeata.gate_pass_reference),
                        },
                      ],
                    },
                    {
                      header: 'Work Information',
                      leftSideData: [
                        {
                          property: 'Order',
                          value:
  <div className={`${inspDeata.order_id ? 'cursor-pointer text-info' : ''} m-0`} onClick={openWorkOrder}>
    <span className="m-0 p-0 font-weight-700 text-capital">
      {getDefaultNoValue(inspDeata.order_name)}
    </span>
  </div>,
                        },
                        {
                          property: 'Actual Start Time',
                          value: getDefaultNoValue(inspDeata.date_start_execution ? getCompanyTimezoneDate(inspDeata.date_start_execution, userInfo, 'datetime') : ''),
                        },
                        {
                          property: 'Type',
                          value: getDefaultNoValue(inspDeata.performed_by),
                        },
                        inspDeata.performed_by === 'External' && {
                          property: 'Vendor',
                          value: getDefaultNoValue(inspDeata.vendor_name),
                        },
                        {
                          property: inspDeata.order_state && inspDeata.order_state.toLowerCase() === 'done' ? 'Done By' : false,
                          value: getDefaultNoValue(inspDeata.employee_name),
                        },
                        inspDeata.state === 'Pause' && {
                          property: 'On Hold End Date',
                          value: getDefaultNoValue(inspDeata.on_hold_end_date ? getCompanyTimezoneDate(inspDeata.on_hold_end_date, userInfo, 'datetime') : ''),
                        },
                        inspDeata.state === 'Pause' && {
                          property: 'On Hold Reason',
                          value: getDefaultNoValue(inspDeata.pause_reason_name),
                        },
                      ],
                      rightSideData: [
                        {
                          property: 'Order Status',
                          value: checkOderStatus(inspDeata.order_state, inspDeata.is_on_hold_requested, inspDeata.pause_reason_name, inspDeata.is_service_report_required),
                        },
                        {
                          property: 'Actual End Time',
                          value: getDefaultNoValue(inspDeata.date_execution ? getCompanyTimezoneDate(inspDeata.date_execution, userInfo, 'datetime') : ''),
                        },
                        {
                          property: 'Work Permit Reference',
                          value: getDefaultNoValue(inspDeata.work_permit_reference),
                        },
                        inspDeata.state === 'Pause' && {
                          property: 'On Hold Remarks',
                          value: getDefaultNoValue(inspDeata.on_hold_requested_command && inspDeata.on_hold_requested_command !== 'false' ? inspDeata.on_hold_requested_command : ''),
                        },
                      ],
                    },
                    {
                      header: 'Review Information',
                      leftSideData: [
                        {
                          property: 'Review Status',
                          value: getDefaultNoValue(inspDeata.review_status ? getWorkOrderStateLabelNew(inspDeata.review_status) : ''),

                        },
                        {
                          property: 'Reviewed By',
                          value: getDefaultNoValue(inspDeata.reviewed_by_name ? inspDeata.reviewed_by_name : ''),

                        },
                      ],
                      rightSideData: [
                        {
                          property: 'Reviewed On',
                          value: getDefaultNoValue(inspDeata.reviewed_on ? getCompanyTimezoneDate(inspDeata.reviewed_on, userInfo, 'datetime') : ''),

                        },
                        {
                          property: 'Review Remarks',
                          value: getDefaultNoValue(inspDeata.reviewed_remark ? inspDeata.reviewed_remark : ''),

                        },

                      ],
                    },
                    {
                      header: 'Sign off Information',
                      leftSideData: [
                        {
                          property: 'Signed off By',
                          value: getDefaultNoValue(inspDeata.signed_off_by),

                        },
                      ],
                      rightSideData: [
                        {
                          property: 'Signed off On',
                          value: getDefaultNoValue(inspDeata.signed_off_on ? getCompanyTimezoneDate(inspDeata.signed_off_on, userInfo, 'datetime') : ''),

                        },
                        {
                          property: 'Signed off Remarks',
                          value: getDefaultNoValue(inspDeata.signed_off_comments ? inspDeata.signed_off_comments : ''),

                        },

                      ],
                    },
                    ]}
                  />
                  )}
                  {!inspDeata.is_signed_off && inspDeata.reviewed_on && (
                  <DetailViewLeftPanel
                    panelData={[{
                      header: 'Scheduler Information',
                      leftSideData: [
                        {
                          property: 'Maintenance Team',
                          value: getDefaultNoValue(inspDeata.maintenance_team_name),
                        },
                        {
                          property: 'Starts On',
                          value: getDefaultNoValue(getCompanyTimezoneDate(inspDeata.starts_on, userInfo, 'date')),
                        },
                        {
                          property: 'Duration',
                          value: getTimeFromDecimal(inspDeata.duration),
                        },
                        {
                          property: 'Compliance Type',
                          value: getDefaultNoValue(inspDeata.compliance_type),
                        },
                      ],
                      rightSideData: [
                        {
                          property: 'Maintenance Operation',
                          value: getDefaultNoValue(inspDeata.task_name),
                        },
                        {
                          property: 'Ends On',
                          value: getDefaultNoValue(getCompanyTimezoneDate(inspDeata.ends_on, userInfo, 'date')),
                        },
                        {
                          property: 'Gate Pass Reference',
                          value: getDefaultNoValue(inspDeata.gate_pass_reference),
                        },
                      ],
                    },
                    {
                      header: 'Work Information',
                      leftSideData: [
                        {
                          property: 'Order',
                          value:
  <div className={`${inspDeata.order_id ? 'cursor-pointer text-info' : ''} m-0`} onClick={openWorkOrder}>
    <span className="m-0 p-0 font-weight-700 text-capital">
      {getDefaultNoValue(inspDeata.order_name)}
    </span>
  </div>,
                        },
                        {
                          property: 'Actual Start Time',
                          value: getDefaultNoValue(inspDeata.date_start_execution ? getCompanyTimezoneDate(inspDeata.date_start_execution, userInfo, 'datetime') : ''),
                        },
                        {
                          property: 'Type',
                          value: getDefaultNoValue(inspDeata.performed_by),
                        },
                        inspDeata.performed_by === 'External' && {
                          property: 'Vendor',
                          value: getDefaultNoValue(inspDeata.vendor_name),
                        },
                        {
                          property: inspDeata.order_state && inspDeata.order_state.toLowerCase() === 'done' ? 'Done By' : false,
                          value: getDefaultNoValue(inspDeata.employee_name),
                        },
                        inspDeata.state === 'Pause' && {
                          property: 'On Hold End Date',
                          value: getDefaultNoValue(inspDeata.on_hold_end_date ? getCompanyTimezoneDate(inspDeata.on_hold_end_date, userInfo, 'datetime') : ''),
                        },
                        inspDeata.state === 'Pause' && {
                          property: 'On Hold Reason',
                          value: getDefaultNoValue(inspDeata.pause_reason_name),
                        },
                      ],
                      rightSideData: [
                        {
                          property: 'Order Status',
                          value: checkOderStatus(inspDeata.order_state, inspDeata.is_on_hold_requested, inspDeata.pause_reason_name, inspDeata.is_service_report_required),
                        },
                        {
                          property: 'Actual End Time',
                          value: getDefaultNoValue(inspDeata.date_execution ? getCompanyTimezoneDate(inspDeata.date_execution, userInfo, 'datetime') : ''),
                        },
                        {
                          property: 'Work Permit Reference',
                          value: getDefaultNoValue(inspDeata.work_permit_reference),
                        },
                        inspDeata.state === 'Pause' && {
                          property: 'On Hold Remarks',
                          value: getDefaultNoValue(inspDeata.on_hold_requested_command && inspDeata.on_hold_requested_command !== 'false' ? inspDeata.on_hold_requested_command : ''),
                        },
                      ],
                    },
                    {
                      header: 'Review Information',
                      leftSideData: [
                        {
                          property: 'Review Status',
                          value: getDefaultNoValue(inspDeata.review_status ? getWorkOrderStateLabelNew(inspDeata.review_status) : ''),

                        },
                        {
                          property: 'Reviewed By',
                          value: getDefaultNoValue(inspDeata.reviewed_by_name ? inspDeata.reviewed_by_name : ''),

                        },
                      ],
                      rightSideData: [
                        {
                          property: 'Reviewed On',
                          value: getDefaultNoValue(inspDeata.reviewed_on ? getCompanyTimezoneDate(inspDeata.reviewed_on, userInfo, 'datetime') : ''),

                        },
                        {
                          property: 'Review Remarks',
                          value: getDefaultNoValue(inspDeata.reviewed_remark ? inspDeata.reviewed_remark : ''),

                        },

                      ],
                    },
                    ]}
                  />
                  )}
                  {inspDeata.is_signed_off && !inspDeata.reviewed_on && (
                  <DetailViewLeftPanel
                    panelData={[{
                      header: 'Scheduler Information',
                      leftSideData: [
                        {
                          property: 'Maintenance Team',
                          value: getDefaultNoValue(inspDeata.maintenance_team_name),
                        },
                        {
                          property: 'Starts On',
                          value: getDefaultNoValue(getCompanyTimezoneDate(inspDeata.starts_on, userInfo, 'date')),
                        },
                        {
                          property: 'Duration',
                          value: getTimeFromDecimal(inspDeata.duration),
                        },
                        {
                          property: 'Compliance Type',
                          value: getDefaultNoValue(inspDeata.compliance_type),
                        },
                      ],
                      rightSideData: [
                        {
                          property: 'Maintenance Operation',
                          value: getDefaultNoValue(inspDeata.task_name),
                        },
                        {
                          property: 'Ends On',
                          value: getDefaultNoValue(getCompanyTimezoneDate(inspDeata.ends_on, userInfo, 'date')),
                        },
                        {
                          property: 'Gate Pass Reference',
                          value: getDefaultNoValue(inspDeata.gate_pass_reference),
                        },
                      ],
                    },
                    {
                      header: 'Work Information',
                      leftSideData: [
                        {
                          property: 'Order',
                          value:
  <div className={`${inspDeata.order_id ? 'cursor-pointer text-info' : ''} m-0`} onClick={openWorkOrder}>
    <span className="m-0 p-0 font-weight-700 text-capital">
      {getDefaultNoValue(inspDeata.order_name)}
    </span>
  </div>,
                        },
                        {
                          property: 'Actual Start Time',
                          value: getDefaultNoValue(inspDeata.date_start_execution ? getCompanyTimezoneDate(inspDeata.date_start_execution, userInfo, 'datetime') : ''),
                        },
                        {
                          property: 'Type',
                          value: getDefaultNoValue(inspDeata.performed_by),
                        },
                        inspDeata.performed_by === 'External' && {
                          property: 'Vendor',
                          value: getDefaultNoValue(inspDeata.vendor_name),
                        },
                        {
                          property: inspDeata.order_state && inspDeata.order_state.toLowerCase() === 'done' ? 'Done By' : false,
                          value: getDefaultNoValue(inspDeata.employee_name),
                        },
                      ],
                      rightSideData: [
                        {
                          property: 'Order Status',
                          value: checkOderStatus(inspDeata.order_state, inspDeata.is_on_hold_requested, inspDeata.pause_reason_name, inspDeata.is_service_report_required),
                        },
                        {
                          property: 'Actual End Time',
                          value: getDefaultNoValue(inspDeata.date_execution ? getCompanyTimezoneDate(inspDeata.date_execution, userInfo, 'datetime') : ''),
                        },
                        {
                          property: 'Work Permit Reference',
                          value: getDefaultNoValue(inspDeata.work_permit_reference),
                        },
                      ],
                    },
                    {
                      header: 'Sign off Information',
                      leftSideData: [
                        {
                          property: 'Signed off By',
                          value: getDefaultNoValue(inspDeata.signed_off_by),

                        },
                      ],
                      rightSideData: [
                        {
                          property: 'Signed off On',
                          value: getDefaultNoValue(inspDeata.signed_off_on ? getCompanyTimezoneDate(inspDeata.signed_off_on, userInfo, 'datetime') : ''),

                        },
                        {
                          property: 'Signed off Remarks',
                          value: getDefaultNoValue(inspDeata.signed_off_comments ? inspDeata.signed_off_comments : ''),

                        },

                      ],
                    },
                    ]}
                  />
                  )}
                  {!inspDeata.is_signed_off && !inspDeata.reviewed_on && (
                  <DetailViewLeftPanel
                    panelData={[
                      cancelData && (isCancelApprovalPending || (inspDeata.state === 'Cancelled' && cancelData.state === 'Approved')) && {
                        header: `Cancellation ${inspDeata.state === 'Cancelled' ? '' : 'Request'} Information`,
                        leftSideData: [
                          {
                            property: 'Requested by',
                            value: getDefaultNoValue(extractNameObject(cancelData.requested_by_id, 'name')),
                          },
                          cancelData.state === 'Approved' && {
                            property: 'Approved by',
                            value: getDefaultNoValue(extractNameObject(cancelData.approved_by_id, 'name')),
                          },
                          {
                            property: 'Remarks',
                            value: getDefaultNoValue(cancelData.remarks),
                          },
                        ],
                        rightSideData: [
                          {
                            property: 'Requested On',
                            value: getDefaultNoValue(getCompanyTimezoneDate(cancelData.requested_on, userInfo, 'datetime')),
                          },
                          cancelData.state === 'Approved' && {
                            property: 'Approved On',
                            value: getDefaultNoValue(getCompanyTimezoneDate(cancelData.approved_on, userInfo, 'datetime')),
                          },
                        ],
                      },
                      {
                        header: 'Scheduler Information',
                        leftSideData: [
                          {
                            property: 'Maintenance Team',
                            value: getDefaultNoValue(inspDeata.maintenance_team_name),
                          },
                          {
                            property: 'Starts On',
                            value: getDefaultNoValue(getCompanyTimezoneDate(inspDeata.starts_on, userInfo, 'date')),
                          },
                          {
                            property: 'Duration',
                            value: getTimeFromDecimal(inspDeata.duration),
                          },
                          {
                            property: 'Compliance Type',
                            value: getDefaultNoValue(inspDeata.compliance_type),
                          },
                        ],
                        rightSideData: [
                          {
                            property: 'Maintenance Operation',
                            value: getDefaultNoValue(inspDeata.task_name),
                          },
                          {
                            property: 'Ends On',
                            value: getDefaultNoValue(getCompanyTimezoneDate(inspDeata.ends_on, userInfo, 'date')),
                          },
                          {
                            property: 'Gate Pass Reference',
                            value: getDefaultNoValue(inspDeata.gate_pass_reference),
                          },
                        ],
                      },
                      {
                        header: 'Work Information',
                        leftSideData: [
                          {
                            property: 'Order',
                            value:
  <div className={`${inspDeata.order_id ? 'cursor-pointer text-info' : ''} m-0`} onClick={openWorkOrder}>
    <span className="m-0 p-0 font-weight-700 text-capital">
      {getDefaultNoValue(inspDeata.order_name)}
    </span>
  </div>,
                          },
                          {
                            property: 'Actual Start Time',
                            value: getDefaultNoValue(inspDeata.date_start_execution ? getCompanyTimezoneDate(inspDeata.date_start_execution, userInfo, 'datetime') : ''),
                          },
                          {
                            property: 'Type',
                            value: getDefaultNoValue(inspDeata.performed_by),
                          },
                          inspDeata.performed_by === 'External' && {
                            property: 'Vendor',
                            value: getDefaultNoValue(inspDeata.vendor_name),
                          },
                          {
                            property: inspDeata.order_state && inspDeata.order_state.toLowerCase() === 'done' ? 'Done By' : false,
                            value: getDefaultNoValue(inspDeata.employee_name),
                          },
                          inspDeata.state === 'Pause' && {
                            property: 'On Hold End Date',
                            value: getDefaultNoValue(inspDeata.on_hold_end_date ? getCompanyTimezoneDate(inspDeata.on_hold_end_date, userInfo, 'datetime') : ''),
                          },
                          inspDeata.state === 'Pause' && {
                            property: 'On Hold Reason',
                            value: getDefaultNoValue(inspDeata.pause_reason_name),
                          },
                        ],
                        rightSideData: [
                          {
                            property: 'Order Status',
                            value: checkOderStatus(inspDeata.order_state, inspDeata.is_on_hold_requested, inspDeata.pause_reason_name, inspDeata.is_service_report_required),
                          },
                          {
                            property: 'Actual End Time',
                            value: getDefaultNoValue(inspDeata.date_execution ? getCompanyTimezoneDate(inspDeata.date_execution, userInfo, 'datetime') : ''),
                          },
                          {
                            property: 'Work Permit Reference',
                            value: getDefaultNoValue(inspDeata.work_permit_reference),
                          },
                          inspDeata.state === 'Pause' && {
                            property: 'On Hold Remarks',
                            value: getDefaultNoValue(inspDeata.on_hold_requested_command && inspDeata.on_hold_requested_command !== 'false' ? inspDeata.on_hold_requested_command : ''),
                          },
                        ],
                      },
                      inspDeata.is_on_hold_requested
                    && {
                      header: 'On Hold Request Information',
                      leftSideData: [
                        {
                          property: 'Requested by',
                          value: getDefaultNoValue(inspDeata.on_hold_requested_by),
                        },
                        {
                          property: 'Requestor\'s Email',
                          value: getDefaultNoValue(inspDeata.on_hold_requested_email),
                        },
                        {
                          property: 'Reason',
                          value: getDefaultNoValue(inspDeata.pause_reason_name),
                        },
                      ],
                      rightSideData: [
                        {
                          property: 'Requested on',
                          value: getDefaultNoValue(getCompanyTimezoneDate(inspDeata.on_hold_requested_on, userInfo, 'date')),
                        },
                        {
                          property: 'Remarks',
                          value: getDefaultNoValue(inspDeata.on_hold_requested_command),
                        },
                      ],
                    },
                      inspDeata && inspDeata.state === 'Missed' && inspDeata.state === 'Missed' && inspDeata.missed_reason_name
                    && {
                      header: 'Missed Information',
                      leftSideData: [
                        {
                          property: 'Missed Reason',
                          value: getDefaultNoValue(inspDeata.missed_reason_name),
                        },
                      ],
                      rightSideData: [
                        {
                          property: 'Remarks',
                          value: getDefaultNoValue(inspDeata.missed_remark),
                        },
                      ],
                    },
                    ]}
                  />
                  )}
                  {checkAdditionalInfo ? (
                    <>
                      <Box
                        sx={{
                          width: '100%',
                          display: 'flex',
                        }}
                      >
                        <Box
                          sx={{
                            width: '50%',
                            marginRight: '10px',
                          }}
                        >
                          <Typography
                            sx={detailViewHeaderClass}
                          >
                            Photo Required
                          </Typography>
                          {returnCheckIcon(inspDeata.at_start_mro, 'At Start')}
                          {returnCheckIcon(inspDeata.at_review_mro, 'At Review')}
                          {returnCheckIcon(inspDeata.at_done_mro, 'At Done')}
                        </Box>
                        <Box
                          sx={{
                            width: '50%',
                          }}
                        >
                          <Typography
                            sx={detailViewHeaderClass}
                          >
                            Enforce Time
                          </Typography>
                          {returnCheckIcon(inspDeata.enforce_time, 'Enforce Time')}
                        </Box>
                      </Box>
                      <Divider />
                      <Box
                        sx={{
                          width: '100%',
                          display: 'flex',
                        }}
                      >
                        <Box
                          sx={{
                            width: '50%',
                            marginRight: '10px',
                          }}
                        >
                          <Typography
                            sx={detailViewHeaderClass}
                          >
                            QR
                          </Typography>
                          {returnCheckIcon(inspDeata.qr_scan_at_start, 'QR Scan At Start')}
                          {returnCheckIcon(inspDeata.qr_scan_at_done, 'QR Scan At Done')}
                        </Box>
                        <Box
                          sx={{
                            width: '50%',
                          }}
                        >
                          <Typography
                            sx={detailViewHeaderClass}
                          >
                            NFC
                          </Typography>
                          {returnCheckIcon(inspDeata.nfc_scan_at_start, 'NFC Scan At Start')}
                          {returnCheckIcon(inspDeata.nfc_scan_at_done, 'NFC Scan At Done')}

                        </Box>

                      </Box>
                      <Box
                        sx={{
                          width: '100%',
                          display: 'flex',
                        }}
                      >
                        <Box
                          sx={{
                            width: '50%',
                            marginRight: '10px',
                          }}
                        >
                          <Typography
                            sx={detailViewHeaderClass}
                          >
                            Workorder
                          </Typography>
                          {returnCheckIcon(inspDeata.is_generate_wo, 'Generate WO')}
                        </Box>
                      </Box>
                    </>
                  ) : ''}
                </TabPanel>
                <TabPanel value={value} index={1}>
                  <Checklists />
                </TabPanel>
                <TabPanel value={value} index={2}>
                  <StatusLogs detaildata={inspDeata} />
                </TabPanel>
                <TabPanel value={value} index={3}>
                  <SubAssets />
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
                  panelOneHeader="Schedule"
                  panelOneLabel={inspDeata.schedule_period_name}
                />
              </Box>
            </Box>
          </>
        )}
        {reviewModal && (
        <ReviewWorkorder
          atFinish={() => {
            showReviewModal(false); resetEscalate();
            setSelectedActions(defaultActionText); setSelectedActionImage('');
          }}
          inspDeata={inspDeata}
          woData={false}
          isPPM
          reviewModal
        />
        )}
        {signModal && (
        <SignOffPPM
          atFinish={() => {
            showSignModal(false); resetUpdateScheduler();
            setSelectedActions(defaultActionText); setSelectedActionImage('');
          }}
          inspDeata={inspDeata}
          signModal
        />
        )}
        {requestModal && (
        <PrepostPonePPM
          atFinish={() => closeRequest()}
          atCancel={() => closeRequest()}
          detailData={inspDeata}
          actionModal={requestModal}
          canPostPreponePast={canPostPreponePast}
        />
        )}
        {approvalModal && (
        <PrepostPoneApproval
          atFinish={() => closeApproval()}
          atCancel={() => closeApproval()}
          detailData={inspDeata}
          requestData={requestData}
          actionModal={approvalModal}
        />
        )}
        {cancelModal && (
        <PrepostPoneCancel
          atFinish={() => closeCancel()}
          atCancel={() => closeCancel()}
          detailData={inspDeata}
          requestData={requestData}
          actionModal={cancelModal}
        />
        )}
        {cancelRequestModal && (
          <PpmCancelRequest
            atFinish={() => closeCancelRequest()}
            atCancel={() => closeCancelRequest()}
            detailData={inspDeata}
            actionModal={cancelRequestModal}
          />
        )}
        {cancelApprovalModal && (
        <PpmCancelApproval
          atFinish={() => closeCancelApproval()}
          atCancel={() => closeCancelApproval()}
          detailData={inspDeata}
          cancelData={cancelData}
          actionModal={cancelApprovalModal}
        />
        )}
        {cancelCancellationModal && (
        <PpmCancelCancellation
          atFinish={() => closeCancelCancellation()}
          atCancel={() => closeCancelCancellation()}
          detailData={inspDeata}
          cancelData={cancelData}
          actionModal={cancelCancellationModal}
        />
        )}
        {loading && (
          <div className="loader" data-testid="loading-case">
            <Loader />
          </div>
        )}
        {isErr && (
          <ErrorContent errorTxt={generateErrorMessage(ppmWeekInfo && ppmWeekInfo.err ? ppmWeekInfo.err : 'No Data Found')} />
        )}
      </Drawer>
      <Drawer
        PaperProps={{
          sx: { width: '85%' },
        }}
        anchor="right"
        open={addLink}
      >
        <DrawerHeader
          headerName={inspDeata && inspDeata.order_id && inspDeata.order_id.length ? inspDeata.order_id[1] : ''}
          onClose={closeWorkOrder}
        />
        <OrderDetail setViewModal={setAddLink} />
      </Drawer>
    </>
  );
};

viewInspection.propTypes = {
  eventDetailModel: PropTypes.bool.isRequired,
  atFinish: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.bool,
  ]).isRequired,
};
export default viewInspection;
