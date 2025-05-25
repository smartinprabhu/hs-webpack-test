import {
  faTimesCircle, faCheckCircle, faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import {
  Button,
  Dialog, DialogActions, DialogContent, DialogContentText,
  IconButton,
  Menu,
  Typography,
} from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import moment from 'moment-timezone';
import {
  Box,
} from '@mui/system';
import DOMPurify from 'dompurify';
import {
  TextField, CircularProgress, FormHelperText,
} from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';
import React, { useEffect, useState } from 'react';
import { AiFillCheckCircle } from 'react-icons/ai';
import {
  BsThreeDotsVertical,
} from 'react-icons/bs';
import { FaTimesCircle } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  CardBody,
  Col,
  FormGroup,
  Label,
  Row,
} from 'reactstrap';

import checkCircleBlack from '@images/icons/checkCircleBlack.svg';
import closeCircle from '@images/icons/closeCircle.svg';
import escalate from '@images/icons/escalateBlue.svg';
import checklistIcon from '@images/icons/performChecklistBlack.svg';
import workOrderIcon from '@images/icons/workorder.svg';
import Loader from '@shared/loading';
import { Autocomplete } from '@material-ui/lab';

import AdvancedSearchModal from './advancedSearchModal';
import AuditLog from '../../commonComponents/auditLogs';
import DetailViewHeader from '../../commonComponents/detailViewHeader';
import DetailViewLeftPanel from '../../commonComponents/detailViewLeftPanel';
import DetailViewRightPanel from '../../commonComponents/detailViewRightPanel';
import DetailViewTab from '../../commonComponents/detailViewTab';
import DialogHeader from '../../commonComponents/dialogHeader';
import Documents from '../../commonComponents/documents';
import { detailViewHeaderClass, workOrderPrioritiesJson, workorderStatusJson } from '../../commonComponents/utils/util';
import ReviewWorkorder from '../../inspectionSchedule/viewer/reviewWorkorder';
import {
  TabPanel,
  extractTextObject,
  generateErrorMessage,
  getCompanyTimezoneDate,
  getDefaultNoValue, getListOfOperations,
  htmlToReact,
  convertNumToTime,
  getAllowedCompanies,
} from '../../util/appUtils';
import actionCodes from '../data/workOrderActionCodes.json';
import workorderActions from '../data/workorderActions.json';
import { getPPMSettingsDetails } from '../../siteOnboarding/siteService';
import {
  getIssueTypeName,
  getMTName,
  getSLALabel, getSLAText, getSLATime,
  getWorkOrderStateLabelNew,
  getWorkOrderTypeName,
  getTrimmedArray,
} from '../utils/utils';
import { getTeamList } from '../../assets/equipmentService';
import AcceptWorkorder from '../viewWorkorder/actionItems/acceptWorkorder';
import ActionWorkorder from '../viewWorkorder/actionItems/actionWorkorder';
import CheckList from '../viewWorkorder/actionItems/checkList';
import CloseWorkorder from '../viewWorkorder/actionItems/closeWorkorder';
import PauseWorkorder from '../viewWorkorder/actionItems/pauseWorkorder';
import CheckLists from '../viewWorkorder/checkLists';
import LookupParts from '../viewWorkorder/lookupParts';
import Parts from '../viewWorkorder/parts';
import Timesheets from '../viewWorkorder/timesheets';
import {
  ticketStateChange, resetUpdateTicket, resetOnHoldTicket, resetDocumentCreate,
} from '../../helpdesk/ticketService';
import Tools from '../viewWorkorder/tools';
import {
  getOrderCheckLists,
  getWoPPMDetail,
  resetWoPPMDetail,
  resetPPMOnHoldRequest,
  resetCreateOrderDuration,
  resetActionData,
  getOrderDetail, resetEscalate, resetOrderCheckList, resetTaskChecklist, resetUpdateCheckList, orderStateChange, updateReassignTeam,
} from '../workorderService';
import { resetUpdateProductCategory } from '../../pantryManagement/pantryService';
import OnHoldRequest from './onHoldRequest';
import OnHoldRequestCancel from './onHoldRequestCancel';
import UpdateMissedReason from './updateMissedReason';
import UploadServiceReport from './uploadServiceReport';
import ViewChecklists from '../viewWorkorder/viewChecklists';

const appModels = require('../../util/appModels').default;

const WorkorderDetails = (props) => {
  const { setViewModal } = props;
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [value, setValue] = useState(0);

  const [extraModal, setExtraModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [placeholderName, setPlaceholder] = useState('');
  const [columns, setColumns] = useState(['id', 'name']);

  const [cancelModal, showCancelModal] = useState(false);
  const [isViewChecklists, setViewChecklists] = useState(false);
  const [missedReasonModal, showMissedReasonModal] = useState(false);

  const [serviceModal, showServiceModal] = useState(false);

  const { userInfo } = useSelector((state) => state.user);
  const {
    workorderDetails, createCommentInfo, stateChangeInfo, updateChecklist,
    ppmOnholdData,
  } = useSelector((state) => state.workorder);
  const {
    ticketDetail,
  } = useSelector((state) => state.ticket);
  const { userRoles } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);

  const {
    ppmSettingsInfo,
  } = useSelector((state) => state.site);

  const ppmConfig = ppmSettingsInfo && ppmSettingsInfo.data && ppmSettingsInfo.data.length ? ppmSettingsInfo.data[0] : false;

  const ppmData = ppmOnholdData && ppmOnholdData.data && ppmOnholdData.data.length ? ppmOnholdData.data[0] : false;

  const isUserError = userInfo && userInfo.err;
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (workorderDetails && workorderDetails.err) ? generateErrorMessage(workorderDetails) : userErrorMsg;
  const allowedOperations = getListOfOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'code');

  const open = Boolean(anchorEl);
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const detailedData = workorderDetails && workorderDetails.data && workorderDetails.data.length ? workorderDetails.data[0] : '';
  const tabs = ['Overview', 'Audit Logs', 'Parts', 'Attachments', 'Lookup Parts', 'Tools', 'Check List', 'Timesheet'];
  const notAllowedOperations = ['Perform Check List', 'Assign', 'Start', 'Pause', 'Reopen', 'Finish', 'Restart', 'Unassign', 'Review', 'Cancel On-Hold Request', 'Provide Missed Reason', 'Upload Service Report'];

  const ticketDetailedData = ticketDetail && ticketDetail.data && ticketDetail.data.length
    ? ticketDetail.data[0]
    : '';

  const checkOderStatus = (val, isHoldRequested, pauseReason, serviceReport) => (
    <Box>
      {workorderStatusJson.map(
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
            {serviceReport && val === 'pause' && (
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

  useEffect(() => {
    if (createCommentInfo && createCommentInfo.data) {
      setValue(1);
    }
  }, [createCommentInfo]);

  useEffect(() => {
    dispatch(resetWoPPMDetail());
    if (detailedData && detailedData.ppm_scheduler_week_id && detailedData.ppm_scheduler_week_id.length && userInfo && userInfo.data && userInfo.data.company) {
      dispatch(getWoPPMDetail(detailedData.ppm_scheduler_week_id[0], appModels.PPMWEEK));
      dispatch(getPPMSettingsDetails(userInfo && userInfo.data && userInfo.data.company ? userInfo.data.company.id : '', appModels.PPMWEEKCONFIG));
    }
  }, [workorderDetails]);

  function isValidateUser() {
    let res = false;
    const approveRoleId = ppmConfig && ppmConfig.on_hold_approval_id ? ppmConfig.on_hold_approval_id.id : false;
    const userRoleId = userInfo && userInfo.data && userInfo.data.user_role_id ? userInfo.data.user_role_id : false;
    if (userRoleId && approveRoleId && userRoleId === approveRoleId) {
      res = true;
    }
    return res;
  }

  function isRequestUser() {
    let res = false;
    const reqMail = ppmData && ppmData.on_hold_requested_email ? ppmData.on_hold_requested_email : false;
    const userRoleId = userInfo && userInfo.data && userInfo.data.email && userInfo.data.email.email ? userInfo.data.email.email : '';
    if (userRoleId && reqMail && reqMail === userRoleId) {
      res = true;
    }
    return res;
  }

  const isNotAllowPPM = ppmData && ppmData.state && ppmData.state === 'Missed' && !(ppmConfig && ppmConfig.is_perform_missed_ppm);

  console.log(isNotAllowPPM);

  function checkActionAllowedDisabled(actionName) {
    let allowed = true;
    if (actionName === 'Pause' && ppmData && ppmData.is_on_hold_requested && !isValidateUser()) {
      allowed = false;
    }
    const ppmEndDate = ppmData && ppmData.ends_on ? moment.utc(ppmData.ends_on).local().format('YYYY-MM-DD') : false;
    if (actionName === 'Pause' && ppmData && ppmData.is_on_hold_approval_required && !ppmData.is_on_hold_requested && (!(ppmData.state === 'In Progress' || ppmData.state === 'Upcoming') || !(ppmEndDate && new Date(ppmEndDate) >= new Date()))) {
      allowed = false;
    }
    if (actionName === 'Cancel On-Hold Request' && ppmData && ppmData.is_on_hold_requested && !isRequestUser()) {
      allowed = false;
    }
    if (isNotAllowPPM) {
      allowed = false;
    }
    if (actionName === 'Provide Missed Reason') {
      if (ppmConfig && ppmConfig.is_provide_missed_reason && ppmData && ppmData.state && ppmData.state === 'Missed') {
        allowed = true;
      } else {
        allowed = false;
      }
    }
    return allowed;
  }

  const isServiceReport = ppmData && ppmData.is_service_report_required;
  const pauseDetailReason = ppmData && ppmData.pause_reason_id && ppmData.pause_reason_id.id ? ppmData.pause_reason_id.id : false;

  const pauseConfigReason = ppmConfig && ppmConfig.service_report_reason_id && ppmConfig.service_report_reason_id.type && ppmConfig.service_report_reason_id.type === 'On-hold' && ppmConfig.service_report_reason_id.id ? ppmConfig.service_report_reason_id.id : false;

  const isServiceReportRequired = isServiceReport && pauseDetailReason && pauseConfigReason && (pauseDetailReason === pauseConfigReason);

  const checkActionAllowed = (actionName) => {
    let allowed = false;
    const whState = workorderDetails && workorderDetails.data && workorderDetails.data.length > 0 && workorderDetails.data[0].state ? workorderDetails.data[0].state : '';
    const rId = workorderDetails && workorderDetails.data && workorderDetails.data.length > 0
      && workorderDetails.data[0].reviewed_by && workorderDetails.data[0].reviewed_by.length ? workorderDetails.data[0].reviewed_by[0] : false;
    const isHoldReq = ppmData.is_on_hold_approval_required && ppmData.is_on_hold_requested;

    if (actionName === 'Reassign to a Team' && (whState === 'in_progress' || whState === 'ready') && !isHoldReq) {
      allowed = true;
    }
    if (actionName === 'Perform Check List' && (whState === 'in_progress') && !isHoldReq) {
      allowed = true;
    }
    if (actionName === 'Cancel On-Hold Request' && isHoldReq) {
      allowed = true;
    }
    if (actionName === 'Assign' && (whState === 'draft' || whState === 'ready') && !isHoldReq) {
      allowed = true;
    }
    if (actionName === 'Unassign' && (whState === 'assigned' || whState === 'in_progress') && !isHoldReq) {
      allowed = true;
    }
    if (actionName === 'Pause' && (whState === 'in_progress')) {
      allowed = true;
    }
    if (actionName === 'Provide Missed Reason' && ppmData && ppmData.state && ppmData.state === 'Missed' && ppmConfig && ppmConfig.is_provide_missed_reason && !(whState === 'done' && whState === 'cancel')) {
      allowed = true;
    }
    if (actionName === 'Restart' && (whState === 'pause') && !isServiceReport) {
      allowed = true;
    }
    if (actionName === 'Upload Service Report' && (whState === 'pause') && isServiceReport) {
      allowed = true;
    }
    if (actionName === 'Finish' && (whState === 'in_progress') && !isHoldReq) {
      allowed = true;
    }
    if (actionName === 'Start' && (whState === 'assigned') && !isHoldReq) {
      allowed = true;
    }
    if (actionName === 'Reopen' && (whState === 'done' || whState === 'cancel')) {
      allowed = true;
    }
    if (actionName === 'Review' && whState === 'done' && !rId && !(detailedData && detailedData.work_permit_id && detailedData.work_permit_id.length)) {
      allowed = true;
    }
    return allowed;
  };

  const faIcons = {
    REASSIGNTEAM: escalate,
    REASSIGNTEAMACTIVE: escalate,
    PERFORMCHECKLIST: checklistIcon,
    PERFORMCHECKLISTACTIVE: checklistIcon,
    ASSIGN: checkCircleBlack,
    ASSIGNACTIVE: checkCircleBlack,
    START: checkCircleBlack,
    STARTACTIVE: checkCircleBlack,
    PAUSE: checkCircleBlack,
    PAUSEACTIVE: checkCircleBlack,
    REOPEN: checkCircleBlack,
    REOPENACTIVE: checkCircleBlack,
    CLOSE: closeCircle,
    CLOSEACTIVE: closeCircle,
    RESTART: checkCircleBlack,
    RESTARTACTIVE: checkCircleBlack,
    UNASSIGN: checkCircleBlack,
    UNASSIGNACTIVE: checkCircleBlack,
    REVIEW: checklistIcon,
    REVIEWACTIVE: checklistIcon,
    CANCEL: closeCircle,
    CANCELACTIVE: closeCircle,
    MISSEDREASON: checklistIcon,
    MISSEDREASONACTIVE: checklistIcon,
    SERVICEREPORT: checklistIcon,
    SERVICEREPORTACTIVE: checklistIcon,
  };

  const [selectedActions, setSelectedActions] = useState('');
  const [selectedActionImage, setSelectedActionImage] = useState('');
  const [enterAction, setEnterAction] = useState(false);
  const [actionModal, showActionModal] = useState(false);
  const [closeActionModal, showCloseActionModal] = useState(false);
  const [pauseActionModal, showPauseActionModal] = useState(false);
  const [acceptModal, showAcceptModal] = useState(false);
  const [actionText, setActionText] = useState('');
  const [actionCode, setActionCode] = useState('');
  const [reviewModal, showReviewModal] = useState(false);
  const [escalateModal, showEscalateModal] = useState(false);
  const [checkListModal, showCheckListModal] = useState(false);
  const [teamOpen, setTeamOpen] = useState(false);
  const [teamKeyword, setTeamKeyword] = useState('');
  const [teamId, setTeamId] = useState('');
  const [oldTeamId, setOldTeamId] = useState(['0', 'Not Assigned']);
  const [ohRequestModal, showOhRequestModal] = useState(false);

  const { teamsInfo } = useSelector((state) => state.equipment);

  const handleStateChange = () => {
    const postData = { maintenance_team_id: teamId && teamId.id ? teamId.id : '' };
    const id = workorderDetails && workorderDetails.data ? workorderDetails.data[0].id : '';
    dispatch(orderStateChange(id, postData, appModels.ORDER));
    dispatch(updateReassignTeam(teamId && teamId.id ? teamId.id : '', id, 'create', appModels.ASSIGNTEAM));
  };

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && teamOpen) {
        await dispatch(getTeamList(companies, appModels.TEAM, teamKeyword));
      }
    })();
  }, [teamOpen, teamKeyword]);

  useEffect(() => {
    dispatch(resetEscalate());
  }, []);

  useEffect(() => {
    const viewId = workorderDetails && workorderDetails.data ? workorderDetails.data[0].id : '';
    if ((userInfo && userInfo.data) && viewId && (stateChangeInfo && stateChangeInfo.data) && selectedActions === 'Reassign to a Team') {
      dispatch(getOrderDetail(viewId, appModels.ORDER));
      if (workorderDetails && workorderDetails.data && workorderDetails.data[0].help_desk_id && workorderDetails.data[0].help_desk_id[0]) {
        if (teamId && teamId.id) {
          const postData = { maintenance_team_id: teamId.id };
          dispatch(ticketStateChange(workorderDetails.data[0].help_desk_id[0], postData, appModels.HELPDESK));
        }
      }
    }
  }, [userInfo, stateChangeInfo]);

  useEffect(() => {
    if (selectedActions === 'Reassign to a Team') {
      setActionText('');
      setActionCode('');
      showEscalateModal(true);
    }
    if (selectedActions === 'Perform Check List') {
      dispatch(resetOrderCheckList());
      dispatch(resetTaskChecklist());
      showCheckListModal(true);
      setActionText('');
      setActionCode('');
    }
    if (selectedActions === 'Assign') {
      setActionText('Assign');
      setActionCode('assgined_request_order');
      showAcceptModal(true);
    }
    if (selectedActions === 'Start') {
      setActionText('Start');
      setActionCode('action_start');
      showActionModal(true);
    }
    if (selectedActions === 'Restart') {
      setActionText('Restart');
      setActionCode('action_restart');
      showActionModal(true);
    }
    if (selectedActions === 'Unassign') {
      setActionText('Unassign');
      setActionCode('action_unassign');
      showActionModal(true);
    }
    if (selectedActions === 'Pause') {
      setActionText('Pause');
      setActionCode('do_record');
      dispatch(resetCreateOrderDuration());
      dispatch(resetOnHoldTicket());
      dispatch(resetUpdateTicket());
      dispatch(resetUpdateProductCategory());
      dispatch(resetActionData());
      dispatch(resetEscalate());
      if (ppmData && ppmData.is_on_hold_approval_required && !ppmData.is_on_hold_requested) {
        dispatch(resetPPMOnHoldRequest());
        showOhRequestModal(true);
      } else {
        showPauseActionModal(true);
      }
    }
    if (selectedActions === 'Reopen') {
      setActionText('Reopen');
      setActionCode('action_reopen');
      showActionModal(true);
    }
    if (selectedActions === 'Finish') {
      setActionText('Finish');
      setActionCode('do_record');
      showCloseActionModal(true);
    }
    if (selectedActions === 'Cancel On-Hold Request') {
      showCancelModal(true);
    }
    if (selectedActions === 'Review') {
      dispatch(resetEscalate());
      setActionText('');
      setActionCode('');
      showReviewModal(true);
    }
    if (selectedActions === 'Provide Missed Reason') {
      dispatch(resetUpdateProductCategory());
      setActionText('');
      setActionCode('');
      showMissedReasonModal(true);
    }
    if (selectedActions === 'Upload Service Report') {
      dispatch(resetDocumentCreate());
      dispatch(resetCreateOrderDuration());
      dispatch(resetActionData());
      setActionText('');
      setActionCode('');
      showServiceModal(true);
    }
  }, [enterAction]);

  const switchActionItem = (action) => {
    handleMenuClose();
    setSelectedActions(action.displayname);
    setSelectedActionImage(action.name);
    setEnterAction(Math.random());
  };
  const inspDeata = workorderDetails && workorderDetails.data && workorderDetails.data.length ? workorderDetails.data[0] : false;

  // useEffect(() => {
  //     const viewId = workorderDetails && workorderDetails.data ? workorderDetails.data[0].id : '';
  //     if ((userInfo && userInfo.data) && viewId && (stateChangeInfo && stateChangeInfo.data)) {
  //         dispatch(getOrderDetail(viewId, appModels.ORDER));
  //     }
  // }, [userInfo, stateChangeInfo]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (updateChecklist && updateChecklist.data)) {
      const ids = workorderDetails && workorderDetails.data && workorderDetails.data.length > 0 ? workorderDetails.data[0].check_list_ids : [];
      if (ids.length > 0) {
        dispatch(getOrderCheckLists(ids, appModels.CHECKLIST));
      }
    }
  }, [userInfo, updateChecklist]);

  const cancelCheckList = () => {
    dispatch(resetUpdateCheckList());
  };

  const cancelEscalate = () => {
    dispatch(resetEscalate());
  };

  const onTeamKeywordChange = (event) => {
    setTeamKeyword(event.target.value);
  };

  const onHoldClose = () => {
    dispatch(resetPPMOnHoldRequest());
    showOhRequestModal(false);
    setSelectedActions(''); setSelectedActionImage('');
  };

  const onMissClose = () => {
    dispatch(resetUpdateProductCategory());
    showMissedReasonModal(false);
    setSelectedActions(''); setSelectedActionImage('');
  };

  const onServiceClose = () => {
    dispatch(resetDocumentCreate());
    dispatch(resetCreateOrderDuration());
    dispatch(resetActionData());
    showServiceModal(false);
    setSelectedActions(''); setSelectedActionImage('');
  };

  const onHoldReqClose = () => {
    dispatch(resetUpdateProductCategory());
    showOhRequestModal(false);
    setSelectedActions(''); setSelectedActionImage('');
  };

  const onTeamChange = (e, data) => {
    setTeamId(data);
    setOldTeamId(workorderDetails && workorderDetails.data ? workorderDetails.data[0].maintenance_team_id : []);
  };

  const onViewChecklists = (taskId) => {
    if (taskId && taskId.length) {
      setViewChecklists(true);
    }
  };

  const onCloseViewChecklists = () => {
    setViewChecklists(false);
  };

  let teamOptions = [];

  if (teamsInfo && teamsInfo.loading) {
    teamOptions = [{ name: 'Loading..' }];
  }
  if (teamsInfo && teamsInfo.data) {
    const mid = workorderDetails && workorderDetails.data ? workorderDetails.data[0].maintenance_team_id[0] : '';
    teamOptions = getTrimmedArray(teamsInfo.data, 'id', mid);
  }

  const checkWorkOrderPriority = (val) => (
    <Box>
      {workOrderPrioritiesJson.map(
        (priority) => val === priority.priority && (
          <Typography
            sx={{
              color: priority.color,
            }}
          >
            {priority.text}
          </Typography>
        ),
      )}
    </Box>
  );

  let actionResults;

  if (stateChangeInfo && stateChangeInfo.loading) {
    actionResults = (
      <FontAwesomeIcon className="ml-2 mr-2 tab_nav_link" size="sm" icon={faSpinner} />
    );
  } else if (stateChangeInfo && stateChangeInfo.data) {
    actionResults = (
      <FontAwesomeIcon className="ml-2 mr-2" size="sm" icon={faCheckCircle} />
    );
  } else if (stateChangeInfo && stateChangeInfo.err) {
    actionResults = (
      <FontAwesomeIcon className="ml-2 mr-2" size="sm" icon={faTimesCircle} />
    );
  } else {
    actionResults = (
      <FontAwesomeIcon className="ml-2 mr-2 tab_nav_link" size="sm" icon={faCheckCircle} />
    );
  }

  const showTeamModal = () => {
    setOldTeamId(workorderDetails && workorderDetails.data ? workorderDetails.data[0].maintenance_team_id : []);
    setModelValue(appModels.TEAM);
    setColumns(['id', 'name']);
    setFieldName('maintenance_team_id');
    setModalName('Team List');
    setPlaceholder('Maintenance Teams');
    setCompanyValue(companies);
    setExtraModal(true);
  };

  function getOnHoldActionName(act) {
    let res = act;
    if (act === 'Pause' && ppmData.is_on_hold_approval_required && !ppmData.is_on_hold_requested) {
      res = 'Request On Hold';
    } else if (act === 'Pause' && ppmData.is_on_hold_approval_required && ppmData.is_on_hold_requested) {
      res = 'Approve/Reject On Hold';
    } else if (act === 'Pause') {
      res = 'On Hold';
    } else if (act === 'Provide Missed Reason' && ppmData && ppmData.missed_reason_id && ppmData.missed_reason_id.id) {
      res = 'Update Missed Reason';
    }
    return res;
  }

  const ActualDuration = () => {
    return (
      <>
        Actual Duration <br /> 
        <span className='font-11'>(Approx. ±1 min)</span>
      </>
    );
  };
  const WorkedDuration = () => {
    return (
      <>
        Worked Duration <br /> 
        <span className='font-11'>(Approx. ±1 min)</span>
      </>
    );
  };


  return (
    <>
      {detailedData && (
        <Box>
          <DetailViewHeader
            mainHeader={getDefaultNoValue(detailedData.name)}
            status={detailedData.state
              ? checkOderStatus(detailedData.state, ppmData && ppmData.is_on_hold_requested, ppmData && ppmData.pause_reason_id && ppmData.pause_reason_id.id ? ppmData.pause_reason_id.name : '', ppmData && ppmData.is_service_report_required)
              : '-'}
            subHeader={getDefaultNoValue(detailedData.sequence)}
            actionComponent={(
              <Box>
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
                  onClose={handleMenuClose}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                >
                  {(ppmOnholdData && !ppmOnholdData.loading) && (ppmSettingsInfo && !ppmSettingsInfo.loading) && workorderActions && workorderActions.actionItems.map((actions) => (
                    (allowedOperations.includes(actionCodes[actions.displayname]) || notAllowedOperations.includes(actions.displayname)) && (
                      checkActionAllowed(actions.displayname) && (
                        <MenuItem
                          sx={{
                            font: 'normal normal normal 15px Suisse Intl',
                          }}
                          id="switchAction"
                          className="pl-2"
                          disabled={!(checkActionAllowedDisabled(actions.displayname))}
                          key={actions.id}
                          onClick={() => switchActionItem(actions)}
                        >
                          <img
                            src={faIcons[actions.name]}
                            alt="ticketactions"
                            className="mr-2"
                            height="15"
                            width="15"
                          />
                          {getOnHoldActionName(actions.displayname)}
                        </MenuItem>
                      )
                    )))}
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
                      header: 'General Information',
                      leftSideData: [
                        {
                          property: 'Cause',
                          value: <p
                            className="text-capital font-side-heading m-0 p-0 max-height-80 overflow-auto thin-scrollbar"
                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(htmlToReact(detailedData.cause), { USE_PROFILES: { html: true } }) }}
                          />,
                        },
                        {
                          property: 'Type',
                          value: getDefaultNoValue(getWorkOrderTypeName(detailedData.type_category)),
                        },
                        {
                          property: detailedData.type_category === 'equipment' ? 'Equipment' : false,
                          value: getDefaultNoValue(detailedData.equipment_id ? detailedData.equipment_id[1] : ''),
                        },
                        {
                          property: detailedData.type_category === 'equipment' ? 'Equipment Location' : false,
                          value: getDefaultNoValue(detailedData.equipment_location_id ? detailedData.equipment_location_id[1] : ''),
                        },
                        {
                          property: detailedData.type_category === 'asset' ? 'Space' : false,
                          value: getDefaultNoValue(detailedData.asset_id ? detailedData.asset_id[1] : ''),
                        },
                      ],
                      rightSideData: [
                        {
                          property: 'Asset Number',
                          value: getDefaultNoValue(detailedData.sequence),
                        },
                        {
                          property: 'Description',
                          value: detailedData.description === '' ? getDefaultNoValue(ticketDetailedData.description) : getDefaultNoValue(detailedData.description),
                        },
                        {
                          property: 'Site',
                          value: getDefaultNoValue(detailedData.company_id ? detailedData.company_id[1] : ''),
                        },
                        {
                          property: 'Work Permit Reference',
                          value: getDefaultNoValue(detailedData.work_permit_reference),
                        },
                      ],
                    },
                    ppmData && ppmData.is_on_hold_requested
                    && {
                      header: 'On Hold Request Information',
                      leftSideData: [
                        {
                          property: 'Requested by',
                          value: getDefaultNoValue(ppmData.on_hold_requested_by),
                        },
                        {
                          property: 'Requestor\'s Email',
                          value: getDefaultNoValue(ppmData.on_hold_requested_email),
                        },
                        {
                          property: 'Reason',
                          value: getDefaultNoValue(ppmData.pause_reason_id && ppmData.pause_reason_id.id ? ppmData.pause_reason_id.name : ''),
                        },
                      ],
                      rightSideData: [
                        {
                          property: 'Requested on',
                          value: getDefaultNoValue(getCompanyTimezoneDate(ppmData.on_hold_requested_on, userInfo, 'date')),
                        },
                        {
                          property: 'Remarks',
                          value: getDefaultNoValue(ppmData.on_hold_requested_command),
                        },
                        {
                          property: 'On-Hold End Date',
                          value: getDefaultNoValue(getCompanyTimezoneDate(ppmData.on_hold_end_date, userInfo, 'date')),
                        },
                      ],
                    },
                    ppmData && detailedData.state === 'pause'
                    && {
                      header: 'On Hold Information',
                      leftSideData: [
                        {
                          property: 'Reason',
                          value: getDefaultNoValue(ppmData.pause_reason_id && ppmData.pause_reason_id.id ? ppmData.pause_reason_id.name : ''),
                        },
                        {
                          property: 'Remarks',
                          value: getDefaultNoValue(ppmData.on_hold_requested_command),
                        },
                      ],
                      rightSideData: [
                        {
                          property: 'On-Hold End Date',
                          value: getDefaultNoValue(getCompanyTimezoneDate(ppmData.on_hold_end_date, userInfo, 'date')),
                        },

                      ],
                    },
                    ppmData && ppmData.state === 'Missed' && ppmData.state === 'Missed' && ppmData.missed_reason_id && ppmData.missed_reason_id.id
                    && {
                      header: 'Missed Information',
                      leftSideData: [
                        {
                          property: 'Missed Reason',
                          value: getDefaultNoValue(ppmData.missed_reason_id && ppmData.missed_reason_id.id ? ppmData.missed_reason_id.name : ''),
                        },
                      ],
                      rightSideData: [
                        {
                          property: 'Remarks',
                          value: getDefaultNoValue(ppmData.missed_remark),
                        },
                      ],
                    },
                    {
                      header: 'Maintenance Information',
                      leftSideData: [
                        {
                          property: 'Maintenance Team',
                          value: getDefaultNoValue(detailedData.maintenance_team_id ? detailedData.maintenance_team_id[1] : ''),
                        },
                        {
                          property: 'Maintenance Operations',
                          value: <span className={`${detailedData.task_id && detailedData.task_id.length > 0 ? 'cursor-pointer text-info' : ''}`} onClick={() => onViewChecklists(detailedData.task_id)}>{getDefaultNoValue(detailedData.task_id && detailedData.task_id.length > 0 ? detailedData.task_id[1] : '')}</span>,
                        },
                        {
                          property: 'Technician',
                          value: getDefaultNoValue(detailedData.employee_id ? detailedData.employee_id[1] : ''),
                        },
                        {
                          property: detailedData.maintenance_type === 'pm' ? '52 Week PPM Calendar' : false,
                          value: getDefaultNoValue(detailedData.ppm_scheduler_week_id ? detailedData.ppm_scheduler_week_id[1] : ''),
                        },
                        {
                          property: 'Is Reopened',
                          value: detailedData.is_reopened ? 'Yes' : 'No',
                        },
                        {
                          property: detailedData.state === 'pause' && !ppmData ? 'On-Hold Reason' : false,
                          value: getDefaultNoValue(extractTextObject(detailedData.pause_reason_id)),
                        },
                        {
                          property: detailedData.state === 'cancel' ? 'Reject Reason' : false,
                          value: getDefaultNoValue(detailedData.reject_reason),
                        },

                      ],
                      rightSideData: [
                        {
                          property: 'Maintenance Type',
                          value: getDefaultNoValue(getMTName(detailedData.maintenance_type)),
                        },
                        {
                          property: detailedData.state === 'missed' ? 'Missed Reason' : false,
                          value: getDefaultNoValue(detailedData.reject_reason),

                        },
                        {
                          property: 'Source Document',
                          value: getDefaultNoValue(detailedData.origin),
                        },
                        {
                          property: 'Issue Type',
                          value: getDefaultNoValue(getIssueTypeName(detailedData.issue_type)),
                        },
                        {
                          property: 'SLA Score Type',
                          value: getDefaultNoValue(detailedData.sla_score_type),
                        },
                        {
                          property: 'Team Category',
                          value: getDefaultNoValue(detailedData.team_category_id ? detailedData.team_category_id[1] : ''),
                        },
                        {
                          property: detailedData.state === 'pause' ? 'Remarks' : false,
                          value: getDefaultNoValue(detailedData.reason),
                        },
                      ],
                    },
                    {
                      header: 'Warehouse Information',
                      leftSideData: [
                        {
                          property: 'Warehouse',
                          value: getDefaultNoValue(detailedData.warehouse_id[1]),
                        },
                        {
                          property: 'Spare Parts Location',
                          value: getDefaultNoValue(detailedData.location_parts_id[1]),
                        },

                      ],
                      rightSideData: [
                        {
                          property: 'Operation Type',
                          value: getDefaultNoValue(detailedData.picking_type_id[1]),
                        },
                      ],
                    },
                    {
                      header: 'Schedule Information',
                      leftSideData: [
                        {
                          property: 'Scheduled Period',
                          value: <span className="m-0 p-0 text-capital">
                            {getDefaultNoValue(getCompanyTimezoneDate(detailedData.date_start_scheduled, userInfo, 'datetime'))}
                            <br />
                            {getDefaultNoValue(getCompanyTimezoneDate(detailedData.date_scheduled, userInfo, 'datetime'))}
                          </span>,
                        },
                        {
                          property: 'Requested Date',
                          value: getDefaultNoValue(getCompanyTimezoneDate(detailedData.date_planned, userInfo, 'datetime')),
                        },
                        {
                          property: 'Planned Duration',
                          value: `${convertNumToTime(detailedData.order_duration)} Hours`,
                        },
                      ],
                      rightSideData: [
                        {
                          property: 'Execution Period',
                          value: <span className="m-0 p-0 text-capital">
                            {getDefaultNoValue(getCompanyTimezoneDate(detailedData.date_start_execution, userInfo, 'datetime'))}
                            <br />
                            {getDefaultNoValue(getCompanyTimezoneDate(detailedData.date_execution, userInfo, 'datetime'))}
                          </span>,
                        },
                        {
                          property: ActualDuration(),
                          value: `${convertNumToTime(detailedData.actual_duration)} Hours`,
                        },
                        {
                          property: WorkedDuration(),
                          value: `${convertNumToTime(detailedData.worked_hours)} Hours`,
                        },
                      ],
                    },
                    {
                      header: 'Review Information',
                      leftSideData: [
                        {
                          property: 'Review Status',
                          value: getDefaultNoValue(detailedData.review_status ? getWorkOrderStateLabelNew(detailedData.review_status) : ''),
                        },
                        {
                          property: 'Reviewed By',
                          value: getDefaultNoValue(detailedData.reviewed_by && detailedData.reviewed_by.length > 0 ? extractTextObject(detailedData.reviewed_by) : ''),
                        },
                      ],
                      rightSideData: [
                        {
                          property: 'Reviewed On',
                          value: getDefaultNoValue(detailedData.reviewed_on ? getCompanyTimezoneDate(detailedData.reviewed_on, userInfo, 'datetime') : ''),
                        },
                        {
                          property: 'Review Remarks',
                          value: getDefaultNoValue(detailedData.reviewed_remark ? detailedData.reviewed_remark : ''),
                        },
                      ],
                    },
                    {
                      header: 'Cost Information',
                      leftSideData: [
                        {
                          property: 'Planned Material Cost',
                          value: `${detailedData.std_mat_cost}.00`,
                        },
                        {
                          property: 'Planned Tool Cost',
                          value: `${detailedData.std_tool_cost}.00`,
                        },
                        {
                          property: 'Planned Labour Cost',
                          value: `${detailedData.std_labour_cost}.00`,
                        },
                        {
                          property: 'Allocated Resourses',
                          value: getDefaultNoValue(detailedData.n_resourse),
                        },
                      ],
                      rightSideData: [
                        {
                          property: 'Actual Material Cost',
                          value: `${detailedData.act_mat_cost}.00`,
                        },
                        {
                          property: 'Actual Tool Cost',
                          value: `${detailedData.act_tool_cost}.00`,
                        },
                        {
                          property: 'Actual Labour Cost',
                          value: `${detailedData.act_labour_cost}.00`,
                        },
                      ],
                    },
                  ]}
                />
                <Typography
                  sx={detailViewHeaderClass}
                >
                  Additional Information
                </Typography>
                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                    height: '100%',
                  }}
                >
                  <Box
                    sx={{
                      width: '50%',
                    }}
                  >
                    <Typography
                      sx={{
                        font: 'normal normal medium 20px/24px Suisse Intl',
                        letterSpacing: '0.7px',
                        fontWeight: 500,
                        margin: '10px 0px 10px 0px',
                      }}
                    >
                      Photo Required
                    </Typography>
                    {detailedData.at_start_mro ? (
                      <AiFillCheckCircle style={{ color: 'green' }} />
                    ) : (
                      <FaTimesCircle style={{ color: 'red' }} />
                    )}
                    <span className="mr-3 ml-1">At Start</span>
                    {detailedData.at_review_mro ? (
                      <AiFillCheckCircle style={{ color: 'green' }} />
                    ) : (
                      <FaTimesCircle style={{ color: 'red' }} />
                    )}
                    <span className="mr-3 ml-1">At Review</span>
                    {detailedData.at_done_mro ? (
                      <AiFillCheckCircle style={{ color: 'green' }} />
                    ) : (
                      <FaTimesCircle style={{ color: 'red' }} />
                    )}
                    <span className="mr-3 ml-1">At Done</span>
                  </Box>
                  <Box
                    sx={{
                      width: '50%',
                    }}
                  >
                    <Typography
                      sx={{
                        font: 'normal normal medium 20px/24px Suisse Intl',
                        letterSpacing: '0.7px',
                        fontWeight: 500,
                        margin: '10px 0px 10px 0px',
                      }}
                    >
                      Enforce Time
                    </Typography>
                    {detailedData.enforce_time ? (
                      <AiFillCheckCircle style={{ color: 'green' }} />
                    ) : (
                      <FaTimesCircle style={{ color: 'red' }} />
                    )}
                    <span className="mr-3 ml-1"> Enforce Time</span>
                  </Box>
                </Box>
                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                    height: '100%',
                  }}
                >
                  <Box
                    sx={{
                      width: '50%',
                    }}
                  >
                    <Typography
                      sx={{
                        font: 'normal normal medium 20px/24px Suisse Intl',
                        letterSpacing: '0.7px',
                        fontWeight: 500,
                        margin: '10px 0px 10px 0px',
                      }}
                    >
                      QR
                    </Typography>
                    {detailedData.is_qr_scan_at_start ? (
                      <AiFillCheckCircle style={{ color: 'green' }} />
                    ) : (
                      <FaTimesCircle style={{ color: 'red' }} />
                    )}
                    <span className="mr-3 ml-1">QR Scan At Start</span>
                    {detailedData.is_qr_scan_at_done ? (
                      <AiFillCheckCircle style={{ color: 'green' }} />
                    ) : (
                      <FaTimesCircle style={{ color: 'red' }} />
                    )}
                    <span className="mr-3 ml-1">QR Scan At Done</span>

                  </Box>
                  <Box
                    sx={{
                      width: '50%',
                    }}
                  >
                    <Typography
                      sx={{
                        font: 'normal normal medium 20px/24px Suisse Intl',
                        letterSpacing: '0.7px',
                        fontWeight: 500,
                        margin: '10px 0px 10px 0px',
                      }}
                    >
                      NFC
                    </Typography>
                    {detailedData.is_nfc_scan_at_start ? (
                      <AiFillCheckCircle style={{ color: 'green' }} />
                    ) : (
                      <FaTimesCircle style={{ color: 'red' }} />
                    )}
                    <span className="mr-3 ml-1">NFC Scan At Start</span>
                    {detailedData.is_nfc_scan_at_done ? (
                      <AiFillCheckCircle style={{ color: 'green' }} />
                    ) : (
                      <FaTimesCircle style={{ color: 'red' }} />
                    )}
                    <span className="mr-3 ml-1">NFC Scan At Done</span>
                  </Box>
                </Box>
              </TabPanel>
              <TabPanel value={value} index={1}>
                <AuditLog ids={detailedData.message_ids} />
              </TabPanel>
              <TabPanel value={value} index={2}>
                <Parts />
              </TabPanel>
              <TabPanel value={value} index={3}>
                <Documents
                  viewId={detailedData.id}
                  ticketId={detailedData.help_desk_id ? detailedData.help_desk_id[0] : false}
                  ticketNumber={detailedData.name}
                  resModel={appModels.ORDER}
                  model={appModels.DOCUMENT}
                />
              </TabPanel>
              <TabPanel value={value} index={4}>
                <LookupParts />
              </TabPanel>
              <TabPanel value={value} index={5}>
                <Tools />
              </TabPanel>
              <TabPanel value={value} index={6}>
                <CheckLists ppmData={ppmData} />
              </TabPanel>
              <TabPanel value={value} index={7}>
                <Timesheets />
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
                // panelOneHeader="Reference"
                //  panelOneLabel={getDefaultNoValue(detailedData.name)}
                // panelOneValue1={getDefaultNoValue(detailedData.sequence)}
                // panelTwoHeader={getDefaultNoValue(getWorkOrderTypeName(detailedData.type_category))}
                /* panelTwoData={[
                    {
                        value: getDefaultNoValue(extractTextObject(detailedData.equipment_id ? detailedData.equipment_id : detailedData.asset_id))
                    },
                    {
                        value: detailedData.equipment_location_id ? getDefaultNoValue(extractTextObject(detailedData.equipment_location_id)) : false
                    }
                ]} */
                panelThreeHeader="Work Order Information"
                panelThreeData={[
                  /* {
                                            header: "Status",
                                            value: detailedData.state
                                                ? checkOderStatus(detailedData.state)
                                                : "-"
                                        }, */
                  {
                    header: 'Priority',
                    value: <>
                      {detailedData.priority
                        ? checkWorkOrderPriority(detailedData.priority)
                        : '-'}
                      {detailedData.state !== 'pause' && detailedData.state !== 'done' && detailedData.state !== 'cancel' && (
                        <Typography>
                          {getSLAText(detailedData.date_scheduled, detailedData.date_execution) === 'Within SLA'
                            ? (
                              <AccessTimeIcon
                                size={10}
                                cursor="pointer"
                                style={{ color: 'green', height: '20px' }}
                              />
                            )
                            : (
                              <AccessTimeIcon
                                size={10}
                                cursor="pointer"
                                style={{ color: 'red', height: '20px' }}
                              />
                            )}
                          {getSLALabel(detailedData.date_scheduled, detailedData.date_execution)}
                          {' '}
                          {' '}
                          {getSLAText(detailedData.date_scheduled, detailedData.date_execution) === 'SLA Elapsed'
                            ? (
                              <span className="text-danger ml-1">
                                {' '}
                                {getSLATime(workorderDetails.data[0].date_scheduled, workorderDetails.data[0].date_execution)}
                                {' '}
                              </span>
                            )
                            : ''}
                        </Typography>
                      )}
                    </>,
                  },
                  {
                    header: 'Created on',
                    value: getDefaultNoValue(getCompanyTimezoneDate(detailedData.create_date, userInfo, 'datetime')),
                  },
                ]}
              />
            </Box>
          </Box>
        </Box>
      )}
      {workorderDetails && workorderDetails.loading && <Loader />}
      {checkListModal && (
        <CheckList
          atFinish={() => {
            showCheckListModal(false);
            cancelCheckList();
            setSelectedActionImage('');
            dispatch(getOrderDetail(workorderDetails && workorderDetails.data && workorderDetails.data.length > 0 ? workorderDetails.data[0].id : '', appModels.ORDER));
          }}
          workorderDetails={workorderDetails}
          refresh={() => { }}
          checkListModal
        />
      )}
      {actionModal && (
        <ActionWorkorder
          atFinish={() => {
            showActionModal(false);
            setSelectedActionImage('');
            setSelectedActions(false);
            dispatch(getOrderDetail(workorderDetails && workorderDetails.data && workorderDetails.data.length > 0 ? workorderDetails.data[0].id : '', appModels.ORDER));
          }}
          actionText={actionText}
          actionCode={actionCode}
          details={workorderDetails}
          actionModal
        />
      )}
      {ohRequestModal && (
        <OnHoldRequest
          atFinish={() => onHoldClose()}
          details={workorderDetails}
          ppmData={ppmData}
          ppmConfig={ppmConfig}
          ohRequestModal
        />
      )}
      {missedReasonModal && (
        <UpdateMissedReason
          atFinish={() => onMissClose()}
          details={workorderDetails}
          ppmData={ppmData}
          ppmConfig={ppmConfig}
          missedReasonModal
        />
      )}
      {serviceModal && (
        <UploadServiceReport
          atFinish={() => onServiceClose()}
          details={workorderDetails}
          ppmData={ppmData}
          ppmConfig={ppmConfig}
          serviceModal
        />
      )}
      {cancelModal && (
        <OnHoldRequestCancel
          atFinish={() => onHoldReqClose()}
          details={workorderDetails}
          ppmData={ppmData}
          cancelModal
        />
      )}
      {closeActionModal && (
        <CloseWorkorder
          atFinish={() => {
            showCloseActionModal(false);
            setSelectedActionImage('');
            setSelectedActions(false);
            dispatch(getOrderDetail(workorderDetails && workorderDetails.data && workorderDetails.data.length > 0 ? workorderDetails.data[0].id : '', appModels.ORDER));
          }}
          actionText={actionText}
          ppmData={ppmData}
          ppmConfig={ppmConfig}
          actionCode={actionCode}
          details={workorderDetails}
          closeActionModal
          refresh={() => { }}
        />
      )}
      {pauseActionModal && (
        <PauseWorkorder
          atFinish={() => {
            showPauseActionModal(false);
            setSelectedActionImage('');
            setSelectedActions(false);
            dispatch(getOrderDetail(workorderDetails && workorderDetails.data && workorderDetails.data.length > 0 ? workorderDetails.data[0].id : '', appModels.ORDER));
          }}
          actionText={actionText}
          actionCode={actionCode}
          details={workorderDetails}
          isApproval={ppmData && ((ppmData.is_on_hold_approval_required && ppmData.is_on_hold_requested))}
          pauseReasonRemarks={ppmData ? ppmData.on_hold_requested_command : ''}
          pauseActionModal
          isPPM={!!ppmData}
          ppmData={ppmData}
          ppmConfig={ppmConfig}
        />
      )}
      {acceptModal && (
        <AcceptWorkorder
          atFinish={() => {
            showAcceptModal(false);
            setSelectedActionImage('');
            setSelectedActions(false);
            dispatch(getOrderDetail(workorderDetails && workorderDetails.data && workorderDetails.data.length > 0 ? workorderDetails.data[0].id : '', appModels.ORDER));
          }}
          actionText={actionText}
          actionCode={actionCode}
          details={workorderDetails}
          acceptModal
        />
      )}
      {reviewModal && (
        <ReviewWorkorder
          atFinish={() => {
            showReviewModal(false);
            resetEscalate();
            setSelectedActionImage('');
            setSelectedActions(false);
            dispatch(getOrderDetail(workorderDetails && workorderDetails.data && workorderDetails.data.length > 0 ? workorderDetails.data[0].id : '', appModels.ORDER));
          }}
          woData={inspDeata}
          inspDeata={false}
          reviewModal
        />
      )}
      <Dialog maxWidth="lg" open={escalateModal}>
        <DialogHeader
          imagePath={workOrderIcon}
          title="Reassign to a Team"
          onClose={() => { showEscalateModal(false); setTeamId(''); cancelEscalate(); setSelectedActionImage(''); }}
          response={stateChangeInfo}
        />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Row>
              <Col sm="6" md="6" lg="6" xs="12">
                <Card className="border-0">
                  <CardBody className="p-2">
                    <Row>
                      <Col sm="12" md="12" lg="12" xs="12">
                        <p className="font-weight-700 mt-3 font-size-13px">
                          <FontAwesomeIcon className="ml-2 mr-2" size="sm" icon={faCheckCircle} />
                          Reassign this work order to the new team.
                        </p>
                        <p className="font-weight-700 font-size-13px">
                          {actionResults}
                          {stateChangeInfo && stateChangeInfo.err ? generateErrorMessage(stateChangeInfo) : 'The work order has been reassigned successfully.'}
                        </p>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
              <Col sm="6" md="6" lg="6" xs="12">
                <Card className="bg-lightblue border-0">
                  <CardBody className="p-3">
                    {workorderDetails && (workorderDetails.data && workorderDetails.data.length > 0) && (
                      <Row>
                        <Col sm="9" md="9" lg="9" xs="12">
                          <p className="font-weight-800 font-side-heading mb-1">
                            {workorderDetails.data[0].name}
                          </p>
                          <p className="font-weight-500 font-side-heading mb-1">
                            {workorderDetails.data[0].sequence}
                          </p>
                          <span className="font-weight-800 font-side-heading mr-1">
                            {!(stateChangeInfo && stateChangeInfo.data) ? (<>Current</>) : (<>Previous</>)}
                            {' '}
                            Team :
                          </span>
                          <span className="font-weight-400">
                            {!(stateChangeInfo && stateChangeInfo.data)
                              ? getDefaultNoValue(workorderDetails.data[0].maintenance_team_id ? workorderDetails.data[0].maintenance_team_id[1] : '') : oldTeamId[1]}
                          </span>
                        </Col>
                        <Col sm="3" md="3" lg="3" xs="12">
                          <img src={workOrderIcon} alt="workorder" width="25" className="mr-2 float-right" />
                        </Col>
                      </Row>
                    )}
                  </CardBody>
                </Card>
                {!(stateChangeInfo && stateChangeInfo.data) && (
                  <div>
                    <FormGroup className="mt-3">
                      <Label for="maintenance_team">Maintenance Team  <span className="text-danger ml-2px">*</span></Label>
                      <Autocomplete
                        name="maintenance_team"
                        label="Maintenance Team"
                        open={teamOpen}
                        size="small"
                        onOpen={() => {
                          setTeamKeyword('');
                          setTeamOpen(true);
                        }}
                        onClose={() => {
                          setTeamOpen(false);
                        }}
                        onChange={onTeamChange}
                        value={teamId && teamId.name ? teamId.name : ''}
                        loading={teamsInfo && teamsInfo.loading}
                        getOptionSelected={(option, value) => option.name === value.name}
                        getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                        options={teamOptions}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            onChange={onTeamKeywordChange}
                            variant="outlined"
                            className="without-padding custom-icons"
                            // className={teamId && teamId.id ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                            placeholder="Search & Select"
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <>
                                  {teamsInfo && teamsInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                                  <InputAdornment position="end">
                                    {teamId && (
                                      <IconButton onClick={() => {
                                        setOldTeamId('');
                                        setTeamId('');
                                        setTeamKeyword('');
                                      }}
                                      >
                                        <BackspaceIcon fontSize="small" />
                                      </IconButton>
                                    )}
                                    <IconButton>
                                      <SearchIcon fontSize="small" onClick={showTeamModal} />
                                    </IconButton>
                                  </InputAdornment>
                                </>
                              ),
                            }}
                          />
                        )}
                      />
                      {(teamsInfo && teamsInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(teamsInfo)}</span></FormHelperText>)}
                    </FormGroup>
                  </div>
                )}
              </Col>
              {(stateChangeInfo && stateChangeInfo.data) && (
                <>
                  <Col sm="6" md="6" lg="6" xs="12" />
                  <Col sm="6" md="6" lg="6" xs="12">
                    <p className="mb-3 mt-2 font-weight-800 text-center">Reassigned to</p>
                    <Card className="bg-lightblue border-0">
                      <CardBody className="p-3">
                        {workorderDetails && (workorderDetails.data && workorderDetails.data.length > 0) && (
                          <Row>
                            <Col sm="9" md="9" lg="9" xs="12">
                              <p className="font-weight-800 font-side-heading mb-1">
                                {workorderDetails.data[0].name}
                              </p>
                              <p className="font-weight-500 font-side-heading mb-1">
                                {workorderDetails.data[0].sequence}
                              </p>
                              <span className="font-weight-800 font-side-heading mr-1">
                                New Team :
                              </span>
                              <span className="font-weight-400">
                                {getDefaultNoValue(workorderDetails.data[0].maintenance_team_id ? workorderDetails.data[0].maintenance_team_id[1] : '')}
                              </span>
                            </Col>
                            <Col sm="3" md="3" lg="3" xs="12">
                              <img src={workOrderIcon} alt="workorder" width="25" className="mr-2 float-right" />
                            </Col>
                          </Row>
                        )}
                      </CardBody>
                    </Card>
                  </Col>
                </>
              )}
            </Row>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {!(stateChangeInfo && stateChangeInfo.data) ? (
            <Button
              disabled={(!teamId || (stateChangeInfo && stateChangeInfo.loading))}
              type="button"
              size="sm"
              variant="contained"
              className="submit-btn"
              onClick={() => handleStateChange()}
            >
              Confirm
            </Button>
          )
            : (
              <Button
                type="button"
                size="sm"
                variant="contained"
                className="submit-btn"
                onClick={() => {
                  showEscalateModal(false);
                  setTeamId('');
                  cancelEscalate();
                  setSelectedActionImage('');
                }}
              >
                Ok
              </Button>
            )}
        </DialogActions>
      </Dialog>
      <Dialog maxWidth="lg" open={extraModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraModal(false); }} sx={{ width: '1000px' }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <AdvancedSearchModal
              modelName={modelValue}
              afterReset={() => { setExtraModal(false); }}
              fieldName={fieldName}
              fields={columns}
              company={companyValue}
              placeholderName={placeholderName}
              setTeamId={setTeamId}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Dialog maxWidth="lg" open={isViewChecklists}>
        <DialogHeader title="View Checklists" imagePath={false} onClose={() => onCloseViewChecklists()} sx={{ width: '1000px' }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <ViewChecklists ppmData={false} />
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default WorkorderDetails;
