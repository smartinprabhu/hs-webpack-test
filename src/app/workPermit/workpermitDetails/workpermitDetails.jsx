/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import {
  Button,
  Dialog, DialogActions, DialogContent, DialogContentText,
  Divider,
  IconButton,
  Menu,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Row,
} from 'reactstrap';

import {
  faCheckCircle,
  faPaperclip,
  faPauseCircle,
  faPencilAlt,
  faPlayCircle,
  faPrint,
  faTag,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import workPermitBlack from '@images/icons/workPermitBlue.svg';
import Drawer from '@mui/material/Drawer';
import MenuItem from '@mui/material/MenuItem';
import Loader from '@shared/loading';
import moment from 'moment-timezone';
import { BsThreeDotsVertical } from 'react-icons/bs';

import ErrorContent from '@shared/errorContent';
import checkCircleBlack from '@images/icons/checkCircleBlack.svg';
import DetailViewHeader from '../../commonComponents/detailViewHeader';
import DetailViewLeftPanel from '../../commonComponents/detailViewLeftPanel';
import DetailViewTab from '../../commonComponents/detailViewTab';
import Documents from '../../commonComponents/documents';
import DrawerHeader from '../../commonComponents/drawerHeader';
import DialogHeader from '../../commonComponents/dialogHeader';
import {
  workPermitStatusJson,
  workorderStatusJson,
  detailViewHeaderClass,
} from '../../commonComponents/utils/util';
import {
  TabPanel,
  extractNameObject,
  getColumnArrayByField,
  convertDecimalToTimeReadable,
  getCompanyTimezoneDate,
  getDefaultNoValue,
  getListOfOperations,
  getListOfModuleOperations,
  numToFloatView,
} from '../../util/appUtils';
import { getWorkOrderStateLabel } from '../../workorders/utils/utils';
import actionCodes from '../data/actionCodes.json';
import customData from '../data/customData.json';
import WorkOrderChecklists from '../workPermitDetail/checklists';
import IssuePermitChecklists from '../workPermitDetail/issuePermitChecklists';
import WorkOrderPreparedChecklists from '../workPermitDetail/preparednessChecklist';
import SpareParts from '../workPermitDetail/spareParts';
import StatusLogs from '../workPermitDetail/statusLogs';
import { getWorkPermitDetails } from '../workPermitService';
import Checklists from '../../externalWorkPermit/checklists/checklists';
import {
  resetCreateOrder,
  resetCreateProductCategory,
  resetUpdateProductCategory, updateProductCategory,
} from '../../pantryManagement/pantryService';
import {
  getPrintReport, resetPrint,
} from '../../purchase/purchaseService';
import AuthService from '../../util/authService';
import {
  resetVisitState,
} from '../../visitorManagement/visitorManagementService';
import {
  resetActionData,
  resetEscalate,
  resetUpdateParts,
} from '../../workorders/workorderService';
import AddWorkPermit from '../addWorkPermit';
import { getCustomButtonName, getCustomStatusName } from '../utils/utils';
import Action from '../workPermitDetail/actionItems/actions';
import Extend from '../workPermitDetail/actionItems/extend';
import ReviewWorkorder from '../workPermitDetail/actionItems/reviewWorkorder';
import EscalationMatrix from './escalationMatrix';
import Assets from './assets';

const appModels = require('../../util/appModels').default;

const authService = AuthService();

const WorkPermitDetails = ({
  setViewModal, openWorkOrder, isDashboard, dataId,
}) => {
  const defaultActionText = 'Work Permit Actions';
  const {
    workPermitDetail, wpTaskLists, wpIpLists, workPermitConfig,
  } = useSelector((state) => state.workpermit);
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const [anchorEl, setAnchorEl] = useState(null);
  const [value, setValue] = useState(0);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch();
  const [editModal, showEditModal] = useState(false);
  const [editId, setEditId] = useState(false);
  const [changeLocationActionOpen, setLocationActionOpen] = useState(false);
  const [selectedActions, setSelectedActions] = useState(defaultActionText);
  const [enterAction, setEnterAction] = useState(false);
  const [checklistModal, setChecklistModal] = useState(false);
  const [checklistIpModal, setChecklistIpModal] = useState(false);
  const [checklistPrepareModal, setChecklistPrepareModal] = useState(false);
  const [checklistPrepareSuccessModal, setChecklistPrepareSuccessModal] = useState(false);
  const [checklistWoSuccessModal, setChecklistWoSuccessModal] = useState(false);
  const [isLoad, setIsLoad] = useState(false);
  const [reviewModal, showReviewModal] = useState(false);
  const [printModal, showPrintModal] = useState(false);
  const [extendModal, showExtendModal] = useState(false);
  const [taskQuestions, setTaskQuestions] = useState([]);
  const [ipQuestions, setIpQuestions] = useState([]);
  const [actionText, setActionText] = useState('');
  const [actionButton, setActionButton] = useState('');
  const [actionModal, showActionModal] = useState(false);
  const [actionValue, setActionValue] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [statusInfo, setStatusInfo] = useState({ loading: false, data: null, err: null });

  const { updateProductCategoryInfo } = useSelector((state) => state.pantry);

  const detailedData = workPermitDetail && workPermitDetail.data && workPermitDetail.data.length ? workPermitDetail.data[0] : '';
  const ViewId = detailedData ? detailedData.id : false;
  let tabs = ['Work Permit Overview', 'Preparedness Checklist', 'Work Checklist', 'Spare Parts', 'Attachments', 'Status Logs'];
  if (detailedData && detailedData.issue_permit_checklist_lines && detailedData.issue_permit_checklist_lines.length) {
    tabs = ['Work Permit Overview', 'Preparedness Checklist', 'Issue Permit Checklist', 'Work Checklist', 'Spare Parts', 'Attachments', 'Status Logs'];
  }

  const allowedOperations = getListOfOperations(
    userRoles && userRoles.data ? userRoles.data.allowed_modules : [],
    'code',
  );

  const allowedOperations1 = getListOfModuleOperations(
    userRoles && userRoles.data ? userRoles.data.allowed_modules : [],
    'Work Permit',
    'code',
  );

  const isStatusEditable = detailedData && detailedData.state && (detailedData.state !== 'Cancel' && detailedData.state !== 'Closed' && detailedData.state !== 'Permit Rejected');

  const isEditable = allowedOperations1.includes(actionCodes['Edit Work Permit']) && isStatusEditable;

  const wpConfig = workPermitConfig && workPermitConfig.data && workPermitConfig.data.length ? workPermitConfig.data[0] : false;

  if (wpConfig && wpConfig.is_track_sla_status) {
    tabs = ['Work Permit Overview', 'Preparedness Checklist', 'Work Checklist', 'Spare Parts', 'Attachments', 'Status Logs', 'Escalation Matrix'];
    if (detailedData && detailedData.issue_permit_checklist_lines && detailedData.issue_permit_checklist_lines.length) {
      tabs = ['Work Permit Overview', 'Preparedness Checklist', 'Issue Permit Checklist', 'Work Checklist', 'Spare Parts', 'Attachments', 'Status Logs', 'Escalation Matrix'];
    }
  }

  const isMultipleAssets = wpConfig && (wpConfig.is_include_multiple_equipment || wpConfig.is_include_multiple_space);

  if (wpConfig && (wpConfig.is_include_multiple_equipment || wpConfig.is_include_multiple_space)) {
    const newTabs = [
      ...tabs.slice(0, 1),
      'Equipment / Spaces',
      ...tabs.slice(1),
    ];
    tabs = newTabs;
  }

  const isPreparedRequired = wpConfig && wpConfig.is_prepared_required ? wpConfig.is_prepared_required : false;
  const isEhsRequired = wpConfig && wpConfig.is_ehs_required ? wpConfig.is_ehs_required : false;
  const reviewRequired = wpConfig && wpConfig.review_required ? wpConfig.review_required : false;

  function getCustomLabel(label) {
    let res = label;
    if (label) {
      if (label === 'Normal' && wpConfig.general_title) {
        res = wpConfig.general_title;
      } else if (label === 'Night Work' && wpConfig.night_title) {
        res = wpConfig.night_title;
      } else if (label === 'Special' && wpConfig.special_title) {
        res = wpConfig.special_title;
      }
    }
    return res;
  }

  const checkWorkPermitStatus = (val) => (
    <Box>
      {workPermitStatusJson.map(
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
            {getCustomStatusName(val, wpConfig)}
          </Box>
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
  const checkActionAllowed = (actionName) => {
    let allowed = true;
    const vrState = detailedData ? detailedData.state : '';

    if (actionName === 'Approve') {
      if (vrState !== 'Requested') {
        allowed = false;
      }
    }
    if (actionName === 'Prepare') {
      if (vrState !== 'Approved' || !isPreparedRequired || (detailedData && detailedData.order_id && detailedData.order_id.preparedness_checklist_lines && detailedData.order_id.preparedness_checklist_lines.length)) {
        allowed = false;
      }
    }

    if (actionName === 'Prepare Checklists') {
      if (vrState !== 'Approved' || !isPreparedRequired || !(detailedData && detailedData.order_id && detailedData.order_id.preparedness_checklist_lines && detailedData.order_id.preparedness_checklist_lines.length)) {
        allowed = false;
      }
    }

    if (actionName === 'Perform Work Checklist') {
      if (vrState !== 'Validated' || !isEhsRequired || !detailedData.order_id.id) {
        allowed = false;
      }
      if (vrState === 'Issued Permit' && !isEhsRequired && detailedData.order_id.id) {
        allowed = true;
      }
    }

    if (actionName === 'Perform Issue Permit Checklists') {
      if (vrState !== 'Prepared' || !(ipQuestions && ipQuestions.length)) {
        allowed = false;
      }
      if (vrState === 'Approved' && !isPreparedRequired && (ipQuestions && ipQuestions.length)) {
        allowed = true;
      }
    }

    if (actionName === 'Issue Permit') {
      if (vrState !== 'Prepared' || (ipQuestions && ipQuestions.length)) {
        allowed = false;
      }
      if (vrState === 'Approved' && !isPreparedRequired && !(ipQuestions && ipQuestions.length)) {
        allowed = true;
      }
    }
    if (actionName === 'Validate') {
      if (vrState !== 'Issued Permit' || !isEhsRequired) {
        allowed = false;
      }
    }
    if (actionName === 'On Hold') {
      if ((vrState !== 'Validated' && vrState !== 'Work In Progress')) {
        allowed = false;
      }
    }
    if (actionName === 'Cancel') {
      if (vrState === 'Closed' || vrState === 'Cancel' || vrState === 'Permit Rejected') {
        allowed = false;
      }
    }
    if (actionName === 'Resume') {
      if (vrState !== 'On Hold') {
        allowed = false;
      }
    }
    if (actionName === 'Review') {
      if ((vrState !== 'Validated' && vrState !== 'Work In Progress') || !reviewRequired) {
        allowed = false;
      }
    }
    if (actionName === 'Extend') {
      if (vrState !== 'Closed' && vrState !== 'Work In Progress') {
        allowed = false;
      }
    }
    return allowed;
  };

  const checkActionAllowedReview = (actionName) => {
    let allowed = false;
    const oId = detailedData && detailedData.order_id && detailedData.order_id.id ? detailedData.order_id.id : false;
    const oState = detailedData && detailedData.order_state ? detailedData.order_state : false;
    const status = detailedData && detailedData.state ? detailedData.state : false;
    const rId = detailedData && detailedData.order_id && detailedData.order_id.reviewed_by && detailedData.order_id.reviewed_by.id ? detailedData.order_id.reviewed_by.id : false;
    const reviewerId = detailedData.reviewer_id && detailedData.reviewer_id.id ? detailedData.reviewer_id.id : false;
    const userEmployee = userInfo && userInfo.data && userInfo.data.employee && userInfo.data.employee.id ? userInfo.data.employee.id : false;
    if (actionName === 'Review' && (status !== 'Closed') && (oState === 'done') && oId && !rId && (reviewerId === userEmployee)) {
      allowed = true;
    }
    return allowed;
  };
  const checkDisable = (actionName) => {
    let allowed = false;
    const userEmployee = userInfo && userInfo.data && userInfo.data.employee && userInfo.data.employee.id ? userInfo.data.employee.id : false;
    const ehsAuthorityMembersIds = detailedData.ehs_authority_id.member_ids
      && detailedData.ehs_authority_id.member_ids.length > 0 ? getColumnArrayByField(detailedData.ehs_authority_id.member_ids, 'employee_id', 'id') : false;
    const approveAuthorityMembersIds = detailedData.approval_authority_id.member_ids
      && detailedData.approval_authority_id.member_ids.length > 0 ? getColumnArrayByField(detailedData.approval_authority_id.member_ids, 'employee_id', 'id') : false;

    const issuePermitAuthorityMembersIds = detailedData.issue_permit_approval_id.member_ids
      && detailedData.issue_permit_approval_id.member_ids.length > 0 ? getColumnArrayByField(detailedData.issue_permit_approval_id.member_ids, 'employee_id', 'id') : false;

    if (actionName === 'Validate' && ((ehsAuthorityMembersIds && !ehsAuthorityMembersIds.includes(userEmployee)))) {
      allowed = true;
    } else if (actionName === 'Approve' && ((approveAuthorityMembersIds && !approveAuthorityMembersIds.includes(userEmployee)))) {
      allowed = true;
    } else if ((actionName === 'Issue Permit' || actionName === 'Perform Issue Permit Checklists') && ((issuePermitAuthorityMembersIds && !issuePermitAuthorityMembersIds.includes(userEmployee)))) {
      allowed = true;
    } else if (actionName === 'Review' && !checkActionAllowedReview(actionName)) {
      allowed = true;
    }
    return allowed;
  };

  const switchActionItem = (action) => {
    dispatch(resetActionData());
    setLocationActionOpen(!changeLocationActionOpen);
    setSelectedActions(action.displayname);
    setEnterAction(Math.random());
    handleClose();
  };

  const faIcons = {
    AUTHORIZE: faCheckCircle,
    PREPARE: faTag,
    ISSUEPERMIT: faCheckCircle,
    VALIDATE: faCheckCircle,
    REVIEW: faPencilAlt,
    PRINTPDF: faPrint,
    EXTEND: faTag,
    PREPARELIST: faPaperclip,
    PERFORMLIST: faPaperclip,
    IPCHECKLIST: faPaperclip,
    'On Hold': faPauseCircle,
    Resume: faPlayCircle,
    Cancel: faTimesCircle,
  };

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const closeEditWorkOrder = () => {
    showEditModal(false);
    dispatch(resetUpdateProductCategory());
    dispatch(getWorkPermitDetails(detailedData.id, appModels.WORKPERMIT));
  };

  const onClose = () => {
    setChecklistModal(false);
    setSelectedActions(defaultActionText);
  };

  const onIpClose = () => {
    setChecklistIpModal(false);
    setSelectedActions(defaultActionText);
  };

  const onPreClose = () => {
    setChecklistPrepareModal(false);
    setSelectedActions(defaultActionText);
  };

  const onPreDone = () => {
    setChecklistPrepareModal(false);
    setChecklistPrepareSuccessModal(true);
  };

  const onWoSuccess = () => {
    setChecklistModal(false);
    setChecklistWoSuccessModal(true);
  };

  const onDone = () => {
    const postData = {
      state: 'Prepared',
    };
    setIsLoad(true);
    dispatch(updateProductCategory(ViewId, appModels.WORKPERMIT, postData));
    setTimeout(() => {
      setIsLoad(false);
      // dispatch(getWorkPermitDetails(ViewId, appModels.WORKPERMIT));
    }, 1500);
    setChecklistPrepareModal(false);
    setChecklistPrepareSuccessModal(false);
    setSelectedActions(defaultActionText);
  };
  const {
    printReportInfo,
  } = useSelector((state) => state.purchase);

  const onWoDone = () => {
    setChecklistModal(false);
    const postData = {
      state: reviewRequired ? 'Work In Progress' : 'Closed',
    };
    setIsLoad(true);
    dispatch(updateProductCategory(ViewId, appModels.WORKPERMIT, postData));
    setTimeout(() => {
      setIsLoad(false);
      // dispatch(getWorkPermitDetails(ViewId, appModels.WORKPERMIT));
    }, 1500);
    setChecklistWoSuccessModal(false);
    setSelectedActions(defaultActionText);
  };

  useEffect(() => {
    if (updateProductCategoryInfo && updateProductCategoryInfo.data && isDashboard && dataId) {
      dispatch(getWorkPermitDetails(dataId, appModels.WORKPERMIT));
    }
  }, [updateProductCategoryInfo]);

  const onIpDone = () => {
    setChecklistIpModal(false);
    const postData = {
      state: 'Issued Permit',
    };
    setIsLoad(true);
    dispatch(updateProductCategory(ViewId, appModels.WORKPERMIT, postData));
    setTimeout(() => {
      setIsLoad(false);
      // dispatch(getWorkPermitDetails(ViewId, appModels.WORKPERMIT));
    }, 500);
    setSelectedActions(defaultActionText);
  };

  useEffect(() => {
    if ((printModal) && ViewId) {
      dispatch(getPrintReport(ViewId, 'mro_work_permit.work_permit_template'));
    }
  }, [printModal]);

  const taskData = wpTaskLists && wpTaskLists.data && wpTaskLists.data.length ? wpTaskLists.data[0] : false;
  const taskChecklists = taskData && taskData.check_list_ids && taskData.check_list_ids.length && taskData.check_list_ids[0].check_list_id && taskData.check_list_ids[0].check_list_id.activity_lines && taskData.check_list_ids[0].check_list_id.activity_lines.length ? taskData.check_list_ids[0].check_list_id.activity_lines : false;

  useEffect(() => {
    if (taskChecklists) {
      const newArrData = taskChecklists.map((cl) => ({
        id: cl.id,
        answer_type: cl.type,
        answer_common: false,
        mro_activity_id: {
          based_on_ids: cl.based_on_ids,
          constr_error_msg: cl.constr_error_msg,
          constr_mandatory: cl.constr_mandatory,
          has_attachment: cl.has_attachment,
          is_attachment_mandatory: cl.is_attachment_mandatory,
          id: cl.id,
          is_enable_condition: cl.is_enable_condition,
          name: cl.name,
          parent_id: cl.parent_id,
          validation_error_msg: cl.validation_error_msg,
          validation_length_max: cl.validation_length_max,
          is_multiple_line: cl.is_multiple_line,
          validation_length_min: cl.validation_length_min,
          validation_max_float_value: cl.validation_max_float_value,
          validation_min_float_value: cl.validation_min_float_value,
          validation_required: cl.validation_required,
          type: cl.type,
          sequence: cl.sequence,
          labels_ids: cl.labels_ids,
        },
        mro_quest_grp_id: cl.mro_quest_grp_id,
        value_date: false,
        value_number: 0,
        value_suggested: {},
        value_suggested_ids: [],
        value_text: false,
        type: false,
      }));
      setTaskQuestions(newArrData);
    } else {
      setTaskQuestions([]);
    }
  }, [wpTaskLists]);

  function changeFormat(data) {
    const newArrData = data && data.length ? data.map((cl) => ({
      ...cl,
      value: cl.name,
    })) : [];
    return newArrData;
  }

  useEffect(() => {
    if (wpIpLists && wpIpLists.data && wpIpLists.data.length) {
      const newArrData = wpIpLists.data.map((cl) => ({
        id: cl.mro_activity_id.id,
        answer_type: cl.answer_type,
        answer_common: false,
        mro_activity_id: {
          based_on_ids: cl.based_on_ids,
          constr_error_msg: 'Required',
          constr_mandatory: cl.constr_mandatory,
          has_attachment: false,
          is_attachment_mandatory: false,
          id: cl.mro_activity_id.id,
          is_enable_condition: cl.is_enable_condition,
          name: cl.mro_activity_id.name,
          parent_id: cl.parent_id,
          validation_error_msg: 'Invalid',
          validation_length_max: false,
          validation_length_min: false,
          validation_max_float_value: false,
          validation_min_float_value: false,
          validation_required: false,
          type: cl.answer_type,
          sequence: 0,
          labels_ids: changeFormat(cl.value_suggested_ids),
        },
        mro_quest_grp_id: cl.mro_quest_grp_id,
        value_date: false,
        value_number: 0,
        value_suggested: {},
        value_suggested_ids: changeFormat(cl.value_suggested_ids),
        value_text: false,
        type: false,
      }));
      setIpQuestions(newArrData);
    } else {
      setIpQuestions([]);
    }
  }, [wpIpLists]);

  useEffect(() => {
    if (printModal && printReportInfo && printReportInfo.data) {
      const pdfBase64 = printReportInfo.data.content;
      const dlnk = document.getElementById('dwnldLnk');
      if (dlnk) {
        dlnk.href = `data:application/octet-stream;base64,${pdfBase64}`;
        dlnk.click();
      }
      setSelectedActions(defaultActionText);
      showPrintModal(false);
      dispatch(resetPrint());
    }
  }, [printReportInfo]);

  useEffect(() => {
    dispatch(resetEscalate());
    dispatch(resetActionData());
    dispatch(resetCreateOrder());
    dispatch(resetVisitState());
    dispatch(resetUpdateParts());
    dispatch(resetUpdateProductCategory());
  }, []);

  useEffect(() => {
    if (selectedActions === 'Review') {
      showReviewModal(true);
    }
    if (selectedActions === 'Print PDF') {
      showPrintModal(true);
    }
    if (selectedActions === 'Extend') {
      showExtendModal(true);
    }
    if (selectedActions === 'Prepare Checklists') {
      setChecklistPrepareModal(true);
    }
    if (selectedActions === 'Perform Work Checklist') {
      setChecklistModal(true);
    }
    if (selectedActions === 'Perform Issue Permit Checklists') {
      setChecklistIpModal(true);
    }
    if (customData && customData.actionTypes && customData.actionTypes[selectedActions] && selectedActions !== 'Review') {
      setActionText(customData.actionTypes[selectedActions].text);
      setActionButton(customData.actionTypes[selectedActions].button);
      setActionValue(customData.actionTypes[selectedActions].value);
      setActionMessage(customData.actionTypes[selectedActions].msg);
      showActionModal(true);
    }
    dispatch(resetCreateProductCategory());
    dispatch(resetVisitState());
    dispatch(resetActionData());
    dispatch(resetCreateOrder());
    dispatch(resetUpdateProductCategory());
  }, [enterAction]);

  const cancelStateChange = () => {
    dispatch(resetVisitState());
    dispatch(resetActionData());
    dispatch(resetCreateOrder());
    dispatch(resetUpdateProductCategory());
    dispatch(getWorkPermitDetails(ViewId, appModels.WORKPERMIT));
  };
  const sortSections = (dataSections) => {
    const dataSectionsNew = dataSections.sort(
      (a, b) => a.mro_activity_id.sequence - b.mro_activity_id.sequence,
    );
    return dataSectionsNew;
  };
  const checkOderStatus = (val) => (
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
            {status.text}
          </Box>
        ),
      )}
    </Box>
  );
  const loading = detailedData && detailedData.loading;

  return (
    <>
      <a id="dwnldLnk" aria-hidden="true" download={`Work Permit - ${detailedData.name}.pdf`} className="d-none" />
      {detailedData && (
        <Box>
          <DetailViewHeader
            mainHeader={getDefaultNoValue(detailedData.name)}
            status={
              detailedData.state ? checkWorkPermitStatus(detailedData.state, wpConfig) : '-'
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
                {getDefaultNoValue(detailedData?.requestor_id?.name)}
              </>
            )}
            actionComponent={(
              <Box>
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
                    handleClose(false);
                    setEditId(detailedData.id);
                    showEditModal(true);
                    dispatch(resetUpdateProductCategory());
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
                  {!(wpIpLists && wpIpLists.loading) && !(ipQuestions && ipQuestions.length > 0) && customData && customData.actionItems.map((actions) => (
                    allowedOperations.includes(actionCodes[actions.displayname]) && (
                      checkActionAllowed(actions.displayname) && (
                        <MenuItem
                          sx={{
                            font: 'normal normal normal 15px Suisse Intl',
                          }}
                          id="switchAction"
                          className="pl-2"
                          key={actions.id}
                          disabled={checkDisable(actions.displayname)}
                          onClick={() => switchActionItem(actions)}
                        >
                          <FontAwesomeIcon
                            className="mr-2"
                            icon={faIcons[actions.name]}
                          />
                          {getCustomButtonName(actions.displayname, wpConfig)}
                        </MenuItem>
                      )
                    )
                  ))}
                  {!(wpIpLists && wpIpLists.loading) && (ipQuestions && ipQuestions.length > 0) && customData && customData.actionItems.map((actions) => (
                    allowedOperations.includes(actionCodes[actions.displayname]) && (
                      checkActionAllowed(actions.displayname) && (
                        <MenuItem
                          sx={{
                            font: 'normal normal normal 15px Suisse Intl',
                          }}
                          id="switchAction"
                          className="pl-2"
                          key={actions.id}
                          disabled={checkDisable(actions.displayname)}
                          onClick={() => switchActionItem(actions)}
                        >
                          <FontAwesomeIcon
                            className="mr-2"
                            icon={faIcons[actions.name]}
                          />
                          {getCustomButtonName(actions.displayname, wpConfig)}
                        </MenuItem>
                      )
                    )
                  ))}
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
                width: '100%',
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
                      header: 'Work Permit Information',
                      leftSideData: [
                        {
                          property: 'Type',
                          value: getDefaultNoValue(detailedData.type),
                        },
                        {
                          property: wpConfig && wpConfig.is_enable_type_of_work && 'Type of Work',
                          value: getDefaultNoValue(extractNameObject(detailedData.type_work_id, 'name')),
                        },
                        {
                          property: 'Nature of Work',
                          value: getDefaultNoValue(extractNameObject(detailedData.nature_work_id, 'name')),
                        },
                        {
                          property: 'Planned Start Time',
                          value: getDefaultNoValue(getCompanyTimezoneDate(detailedData.planned_start_time, userInfo, 'datetime')),
                        },
                        {
                          property: 'Duration (Hrs)',
                          value: convertDecimalToTimeReadable(detailedData.duration),
                        },
                        {
                          property: wpConfig && wpConfig.is_enable_department && 'Department',
                          value: getDefaultNoValue(extractNameObject(detailedData.department_id, 'name')),
                        },
                        {
                          property: 'Maintenance Checklist',
                          value: getDefaultNoValue(extractNameObject(detailedData.task_id, 'name')),
                        },
                        {
                          property: 'Issue Permit Checklist',
                          value: getDefaultNoValue(extractNameObject(detailedData.issue_permit_checklist_id, 'name')),
                        },
                      ],
                      rightSideData: [
                        {
                          property: detailedData.type,
                          value: getDefaultNoValue(detailedData.type === 'Space' ? extractNameObject(detailedData.space_id, 'space_name') : extractNameObject(detailedData.equipment_id, 'name')),
                        },
                        {
                          property: 'Type of Request',
                          value: getDefaultNoValue(getCustomLabel(detailedData.type_of_request)),
                        },
                        {
                          property: 'Work Location',
                          value: getDefaultNoValue(detailedData.work_location),
                        },
                        {
                          property: 'Planned End Time',
                          value: getDefaultNoValue(getCompanyTimezoneDate(detailedData.planned_end_time, userInfo, 'datetime')),
                        },
                        {
                          property: wpConfig && ((detailedData.type_of_request === 'Normal' && wpConfig.general_shift_allow_multiple_days) || (detailedData.type_of_request === 'Night Work' && wpConfig.night_shift_allow_multiple_days) || (detailedData.type_of_request === 'Special' && wpConfig.special_shift_allow_multiple_days)) && detailedData.valid_through ? 'Valid through' : false,
                          value: getDefaultNoValue(getCompanyTimezoneDate(detailedData.valid_through, userInfo, 'datetime')),
                        },
                        {
                          property: 'PO Reference',
                          value: getDefaultNoValue(detailedData.po_reference),
                        },
                        {
                          property: 'Preparedness Checklist',
                          value: getDefaultNoValue(extractNameObject(detailedData.preparedness_checklist_id, 'name')),
                        },
                        {
                          property: wpConfig && wpConfig.is_track_sla_status ? 'SLA Status' : false,
                          value: getDefaultNoValue(detailedData.sla_status),
                        },
                      ],
                    },
                    {
                      header: 'Vendor Information',
                      leftSideData: [
                        {
                          property: 'Vendor',
                          value: getDefaultNoValue(extractNameObject(detailedData.vendor_id, 'name')),
                        },
                        {
                          property: 'Vendor Email',
                          value: getDefaultNoValue(detailedData.vendor_email),
                        },
                        {
                          property: 'No. of Vendor Technicians',
                          value: detailedData.work_technician_ids ? getDefaultNoValue(detailedData.work_technician_ids.length) : '0',
                        },
                      ],
                      rightSideData: [
                        {
                          property: 'Vendor POC',
                          value: getDefaultNoValue(detailedData.vendor_poc),
                        },
                        {
                          property: 'Vendor Mobile',
                          value: getDefaultNoValue(detailedData.vendor_mobile),
                        },
                      ],
                    },
                    {
                      header: 'Maintenance Information',
                      leftSideData: [
                        {
                          property: 'Order',
                          value:
  <div onClick={openWorkOrder} className={detailedData.order_id && detailedData.order_id.id ? 'text-info cursor-pointer' : ''}>
    {getDefaultNoValue(extractNameObject(detailedData.order_id, 'name'))}
  </div>,
                        },

                        {
                          property: 'Actual Start Time',
                          value: getDefaultNoValue(detailedData.order_id && detailedData.order_id.date_start_execution ? getCompanyTimezoneDate(detailedData.order_id.date_start_execution, userInfo, 'datetime') : ''),
                        },
                        {
                          property: 'Done By',
                          value: detailedData.order_state === 'done' ? getDefaultNoValue(detailedData.order_id && detailedData.order_id.employee_id && detailedData.order_id.employee_id.name ? extractNameObject(detailedData.order_id.employee_id, 'name') : ''):'-',
                        },
                      ],
                      rightSideData: [
                        {
                          property: 'Order Status',
                          value: checkOderStatus(detailedData.order_state),
                        },
                        {
                          property: 'Actual End Time',
                          value: getDefaultNoValue(detailedData.order_id && detailedData.order_id.date_execution ? getCompanyTimezoneDate(detailedData.order_id.date_execution, userInfo, 'datetime') : ''),
                        },
                      ],
                    },
                    {
                      header: 'EHS Validation',
                      leftSideData: [
                        {
                          property: 'Validated On',
                          value: getDefaultNoValue(getCompanyTimezoneDate(detailedData.validated_on, userInfo, 'datetime')),
                        },
                        {
                          property: 'Validation Status',
                          value: getDefaultNoValue(detailedData.validated_status),
                        },
                      ],
                      rightSideData: [
                        {
                          property: 'Validated By',
                          value: getDefaultNoValue(extractNameObject(detailedData.validated_by, 'name')),
                        },
                      ],
                    },
                    {
                      header: 'Review Information',
                      leftSideData: [
                        {
                          property: 'Review Status',
                          value: getDefaultNoValue(detailedData.order_id && detailedData.order_id.review_status ? getWorkOrderStateLabel(detailedData.order_id.review_status.toLowerCase()) : ''),
                        },
                        {
                          property: 'Reviewed On',
                          value: getDefaultNoValue(detailedData.order_id && detailedData.order_id.reviewed_on ? getCompanyTimezoneDate(detailedData.order_id.reviewed_on, userInfo, 'datetime') : ''),
                        },
                      ],
                      rightSideData: [
                        {
                          property: 'Reviewed By',
                          value: getDefaultNoValue(detailedData.order_id && detailedData.order_id.reviewed_by && detailedData.order_id.reviewed_by.name ? extractNameObject(detailedData.order_id.reviewed_by, 'name') : ''),
                        },
                        {
                          property: 'Review Remarks',
                          value: getDefaultNoValue(detailedData.order_id && detailedData.order_id.reviewed_remark ? detailedData.order_id.reviewed_remark : ''),
                        },
                      ],
                    },
                    {
                      header: 'Approval Information',
                      leftSideData: [
                        {
                          property: 'Approval Authority',
                          value: getDefaultNoValue(extractNameObject(detailedData.approval_authority_id, 'name')),
                        },
                        {
                          property: 'Security Office',
                          value: getDefaultNoValue(extractNameObject(detailedData.security_office_id, 'name')),
                        },
                        {
                          property: 'Issue Permit Authority',
                          value: getDefaultNoValue(extractNameObject(detailedData.issue_permit_approval_id, 'name')),
                        },
                      ],
                      rightSideData: [
                        {
                          property: 'EHS Authority',
                          value: getDefaultNoValue(extractNameObject(detailedData.ehs_authority_id, 'name')),
                        },
                        {
                          property: 'Reviewer',
                          value: getDefaultNoValue(extractNameObject(detailedData.reviewer_id, 'name')),
                        },
                      ],
                    },
                    {
                      header: wpConfig && wpConfig.is_ehs_required && wpConfig && wpConfig.review_required && 'Other Information',
                      leftSideData: [
                        {
                          property: 'Job Description',
                          value: getDefaultNoValue(detailedData.job_description),
                        },
                        {
                          property: 'Terms and Conditions',
                          value: getDefaultNoValue(detailedData.terms_conditions),
                        },
                      ],
                      rightSideData: [
                        {
                          property: wpConfig && wpConfig.is_ehs_required && 'EHS Instructions',
                          value: getDefaultNoValue(detailedData.ehs_instructions),
                        },

                      ],
                    },
                  ]}
                  addtionalData={(
                    <>
                      {(wpConfig && (wpConfig.is_ehs_required && wpConfig.review_required) || (!wpConfig.is_ehs_required && wpConfig.review_required) || (wpConfig.is_ehs_required && !wpConfig.review_required)) && (
                        <>
                          <Typography
                            sx={detailViewHeaderClass}
                          >
                            VENDOR TECHNICIANS INFORMATION - (
                            {detailedData && detailedData.work_technician_ids ? detailedData.work_technician_ids.length : 0}
                            )
                          </Typography>
                          {detailedData && detailedData.work_technician_ids && detailedData.work_technician_ids.length ? (
                            <>
                              <Divider />
                              <Box
                                sx={{
                                  height: '50px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  padding: '10px',
                                }}
                              >
                                <Typography
                                  sx={{
                                    width: '40%',
                                    font: "normal normal normal 20px/26px Suisse Int'l",
                                    letterSpacing: '0.7px',
                                    color: '#000000',
                                  }}
                                >
                                  Name
                                </Typography>
                                <Typography
                                  sx={{
                                    width: '40%',
                                    font: "normal normal normal 20px/26px Suisse Int'l",
                                    letterSpacing: '0.7px',
                                    color: '#000000',
                                  }}
                                >
                                  Mobile
                                </Typography>
                                <Typography
                                  sx={{
                                    width: '20%',
                                    font: "normal normal normal 20px/26px Suisse Int'l",
                                    letterSpacing: '0.7px',
                                    color: '#000000',
                                  }}
                                >
                                  Age
                                </Typography>
                                <Divider />
                              </Box>
                              {detailedData.work_technician_ids.map((tech) => (
                                <Box
                                  sx={{
                                    height: '50px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '10px',
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      width: '40%',
                                      font: "normal normal normal 20px/26px Suisse Int'l",
                                      letterSpacing: '0.7px',
                                      color: '#000000',
                                    }}
                                  >
                                    {getDefaultNoValue(tech.name)}
                                  </Typography>
                                  <Typography
                                    sx={{
                                      width: '40%',
                                      font: "normal normal normal 20px/26px Suisse Int'l",
                                      letterSpacing: '0.7px',
                                      color: '#000000',
                                    }}
                                  >
                                    {getDefaultNoValue(tech.mobile)}
                                  </Typography>
                                  <Typography
                                    sx={{
                                      width: '20%',
                                      font: "normal normal normal 20px/26px Suisse Int'l",
                                      letterSpacing: '0.7px',
                                      color: '#000000',
                                    }}
                                  >
                                    {getDefaultNoValue(tech.age)}
                                  </Typography>
                                </Box>
                              ))}
                            </>
                          ) : (
                            <ErrorContent errorTxt="No Data Found" />
                          )}
                        </>
                      )}
                    </>
                  )}
                />
              </TabPanel>
              {isMultipleAssets && (
              <TabPanel value={value} index={1}>
                <Assets />
              </TabPanel>
              )}
              <TabPanel value={value} index={!isMultipleAssets ? 1 : 2}>
                <WorkOrderPreparedChecklists detailData={workPermitDetail} />
              </TabPanel>

              {detailedData && detailedData.issue_permit_checklist_lines && detailedData.issue_permit_checklist_lines.length > 0 && (
                <TabPanel value={value} index={!isMultipleAssets ? 2 : 3}>
                  <IssuePermitChecklists detailData={workPermitDetail} />
                </TabPanel>
              )}
              <TabPanel value={value} index={detailedData && detailedData.issue_permit_checklist_lines && detailedData.issue_permit_checklist_lines.length > 0 ? (!isMultipleAssets ? 3 : 4) : (!isMultipleAssets ? 2 : 3)}>
                <WorkOrderChecklists detailData={workPermitDetail} />
              </TabPanel>
              <TabPanel value={value} index={detailedData && detailedData.issue_permit_checklist_lines && detailedData.issue_permit_checklist_lines.length > 0 ? (!isMultipleAssets ? 4 : 5) : (!isMultipleAssets ? 3 : 4)}>
                <SpareParts />
              </TabPanel>
              <TabPanel value={value} index={detailedData && detailedData.issue_permit_checklist_lines && detailedData.issue_permit_checklist_lines.length > 0 ? (!isMultipleAssets ? 5 : 6) : (!isMultipleAssets ? 4 : 5)}>
                <Documents
                  viewId={detailedData.id}
                  reference={detailedData.name}
                  resModel={appModels.WORKPERMIT}
                  model={appModels.DOCUMENT}
                />
                <Divider />
              </TabPanel>
              <TabPanel value={value} index={detailedData && detailedData.issue_permit_checklist_lines && detailedData.issue_permit_checklist_lines.length > 0 ? (!isMultipleAssets ? 6 : 7) : (!isMultipleAssets ? 5 : 6)}>
                <StatusLogs />
              </TabPanel>
              {wpConfig && wpConfig.is_track_sla_status && (
              <TabPanel value={value} index={detailedData && detailedData.issue_permit_checklist_lines && detailedData.issue_permit_checklist_lines.length > 0 ? (!isMultipleAssets ? 7 : 8) : (!isMultipleAssets ? 6 : 7)}>
                <EscalationMatrix />
              </TabPanel>
              )}
            </Box>
            {/* <Box
                            sx={{
                                width: "25%",
                                height: "100%",
                                backgroundColor: "#F6F8FA",
                            }}
                        >
                            <DetailViewRightPanel
                                panelOneHeader="Requestor"
                                panelOneLabel={getDefaultNoValue(detailedData.requestor_id.name)}
                                panelTwoHeader={getDefaultNoValue(detailedData.type)}
                                panelTwoData={[
                                    {
                                        value: detailedData.type === 'Equipment' ? getDefaultNoValue(extractNameObject(detailedData.equipment_id, 'name')) : getDefaultNoValue(extractNameObject(detailedData.space_id, 'path_name'))
                                    },
                                ]}
                                panelThreeHeader="Work Permit Information"
                                panelThreeData={[
                                    {
                                        header: "Status",
                                        value:
                                            detailedData.state
                                                ? checkWorkPermitStatus(detailedData.state)
                                                : "-",
                                    },
                                    {
                                        header: "Created on",
                                        value: getDefaultNoValue(
                                            getCompanyTimezoneDate(
                                                detailedData.create_date,
                                                userInfo,
                                                "datetime"
                                            )
                                        ),
                                    },
                                    {
                                        header: "Last updated on",
                                        value: getDefaultNoValue(
                                            getCompanyTimezoneDate(
                                                detailedData.__last_update,
                                                userInfo,
                                                "datetime"
                                            )
                                        ),
                                    },
                                ]}
                            />
                        </Box> */}
            <Drawer
              PaperProps={{
                sx: { width: '85%' },
              }}
              anchor="right"
              open={editModal}
            >
              <DrawerHeader
                headerName="Update Work Permit"
                imagePath={workPermitBlack}
                onClose={() => {
                  showEditModal(false); setEditId(false);
                }}
              />
              <AddWorkPermit editId={editId} closeModal={closeEditWorkOrder} />
            </Drawer>
            {actionModal && (
              <Action
                atFinish={() => {
                  cancelStateChange(); setSelectedActions(defaultActionText); showActionModal(false);
                }}
                atCancel={() => {
                  setSelectedActions(defaultActionText); dispatch(resetVisitState()); showActionModal(false);
                }}
                actionText={actionText}
                actionButton={actionButton}
                actionMessage={actionMessage}
                actionValue={actionValue}
                details={workPermitDetail}
                actionModal
              />
            )}
            {reviewModal && (
              <ReviewWorkorder
                atFinish={() => {
                  showReviewModal(false); dispatch(resetEscalate()); dispatch(resetActionData()); cancelStateChange();
                  setSelectedActions(defaultActionText);
                }}
                atCancel={() => {
                  showReviewModal(false); dispatch(resetEscalate()); dispatch(resetActionData());
                  setSelectedActions(defaultActionText);
                }}
                detailData={workPermitDetail}
                reviewModal
              />
            )}
            {extendModal && (
              <Extend
                atFinish={() => {
                  showExtendModal(false); cancelStateChange(); setSelectedActions(defaultActionText);
                }}
                atCancel={() => {
                  dispatch(resetVisitState());
                  dispatch(resetActionData());
                  dispatch(resetCreateOrder());
                  dispatch(resetUpdateProductCategory()); setSelectedActions(defaultActionText); showExtendModal(false);
                }}
                details={workPermitDetail}
                actionText="Extend"
                actionButton="Extend"
                setViewModal={setViewModal}
                extendModal
              />
            )}
            {checklistPrepareModal && (
              <Checklists
                orderCheckLists={detailedData.order_id && detailedData.order_id.preparedness_checklist_lines ? sortSections(detailedData.order_id.preparedness_checklist_lines) : []}
                detailData={detailedData}
                atReject={() => onPreClose()}
                atDone={() => onPreDone()}
                statusInfo={statusInfo}
                wpConfigData={wpConfig}
                spareParts={detailedData.order_id && detailedData.order_id.parts_lines ? detailedData.order_id.parts_lines : []}
                fieldValue="preparedness_checklist_lines"
                isInternal
                token={authService.getAccessToken()}
                userId={userInfo && userInfo.data ? { id: userInfo.data.id, name: userInfo.data.name } : false}
              />
            )}
            {checklistModal && (
              <Checklists
                orderCheckLists={detailedData.order_id && detailedData.order_id.check_list_ids && detailedData.order_id.check_list_ids.length > 0 ? sortSections(detailedData.order_id.check_list_ids) : taskQuestions}
                detailData={detailedData}
                atReject={() => onClose()}
                atDone={() => onWoSuccess()}
                statusInfo={statusInfo}
                wpConfigData={wpConfig}
                spareParts={detailedData.order_id && detailedData.order_id.parts_lines ? detailedData.order_id.parts_lines : []}
                fieldValue="check_list_ids"
                isInternal
                token={authService.getAccessToken()}
                userId={userInfo && userInfo.data ? { id: userInfo.data.id, name: userInfo.data.name } : false}
              />
            )}
            {checklistIpModal && (
              <Checklists
                orderCheckLists={ipQuestions}
                detailData={detailedData}
                atReject={() => onIpClose()}
                atDone={() => onIpDone()}
                statusInfo={statusInfo}
                wpConfigData={wpConfig}
                spareParts={detailedData.order_id && detailedData.order_id.parts_lines ? detailedData.order_id.parts_lines : []}
                fieldValue="issue_permit_checklist_lines"
                isInternal
                token={authService.getAccessToken()}
                userId={userInfo && userInfo.data ? { id: userInfo.data.id, name: userInfo.data.name } : false}
              />
            )}
            {/* <Modal size="lg" className="border-radius-50px modal-dialog-centered" isOpen={isLoad}>
                            <ModalHeaderComponent
                                imagePath={checkCircleBlack}
                                title="Checklist"
                            />
                            <ModalBody>
                                <div className="text-center mt-4 mb-4">
                                    <Loader />
                                </div>
                            </ModalBody>
                        </Modal> */}
            <Dialog size="lg" open={checklistPrepareSuccessModal}>
              <DialogHeader
                imagePath={checkCircleBlack}
                title="Readiness Checklist"
              />
              <DialogContent>

                <DialogContentText id="alert-dialog-description">
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: '#F6F8FA',
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10%',
                      fontFamily: 'Suisse Intl',
                    }}
                  >
                    {isLoad && (
                    <div className="text-center mt-4 mb-4">
                      <Loader />
                    </div>
                    )}
                    {!isLoad && (
                    <Row className="justify-content-center">
                      <SuccessAndErrorFormat response={{ data: true }} successMessage="This work permit Readiness Checklists has been completed successfully.." />
                    </Row>
                    )}
                  </Box>
                </DialogContentText>

              </DialogContent>
              <DialogActions className="mr-3 ml-3">
                <Button
                  disabled={loading}
                  type="button"
                  variant="contained"
                  size="sm"
                  className="mr-1"
                  onClick={() => onDone()}
                >
                  Ok
                </Button>
              </DialogActions>
            </Dialog>
            <Dialog size="lg" open={checklistWoSuccessModal}>
              <DialogHeader
                imagePath={checkCircleBlack}
                title="Work Checklist"
              />
              <DialogContent>

                <DialogContentText id="alert-dialog-descriptiondd">
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: '#F6F8FA',
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10%',
                      fontFamily: 'Suisse Intl',
                    }}
                  >
                    {isLoad && (
                    <div className="text-center mt-4 mb-4">
                      <Loader />
                    </div>
                    )}
                    {!isLoad && (
                    <Row className="justify-content-center">
                      <SuccessAndErrorFormat response={{ data: true }} successMessage="This work permit Work Checklists has been completed successfully.." />
                    </Row>
                    )}
                  </Box>
                </DialogContentText>

              </DialogContent>
              <DialogActions className="mr-3 ml-3">
                <Button
                  disabled={loading}
                  type="button"
                  variant="contained"
                  size="sm"
                  className="mr-1"
                  onClick={() => onWoDone()}
                >
                  Ok
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        </Box>
      )}
      {workPermitDetail && workPermitDetail.loading && <Loader />}
    </>
  );
};
export default WorkPermitDetails;
