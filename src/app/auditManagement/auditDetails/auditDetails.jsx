import {
  IconButton, Button, Divider, Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { BsThreeDotsVertical } from 'react-icons/bs';
import React, { useState, useEffect, useMemo } from 'react';
import Chart from 'react-apexcharts';
import {
  Col,
  Table,
} from 'reactstrap';
import ButtonGroup from '@mui/material/ButtonGroup';
import { useHistory } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import { useSelector, useDispatch } from 'react-redux';
import Menu from '@mui/material/Menu';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import moment from 'moment-timezone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope, faCheckCircle, faTimesCircle,
  faSignOut, faSignIn, faFileExcel,
  faCalendarDays,
  faCheck,
  faCancel,
} from '@fortawesome/free-solid-svg-icons';
import DOMPurify from 'dompurify';

import Loader from '@shared/loading';
import auditBlue from '@images/icons/auditBlue.svg';

import Documents from '../../commonComponents/documents';
import DrawerHeader from '../../commonComponents/drawerHeader';
import DetailViewHeader from '../../commonComponents/detailViewHeader';
import DetailViewLeftPanel from '../../commonComponents/detailViewLeftPanel';
import DetailViewTab from '../../commonComponents/detailViewTab';
import {
  detailViewHeaderClass,
  hxAuditStatusJson,
} from '../../commonComponents/utils/util';
import SlaMatrix from './slaMatrix';
import StatusLogs from './statusLogs';
import actionCodes from '../data/actionCodes.json';
import {
  resetUpdateHxAudit,
  getHxAuditDetails,
  getHxAuditActions,
} from '../auditService';
import {
  TabPanel,
  extractNameObject,
  htmlToReact,
  getCompanyTimezoneDate,
  getDefaultNoValue,
  getListOfOperations,
  getColumnArrayByIdMulti,
  getColumnArrayByNumber,
  getColumnArrayById,
  exportExcelTableToXlsx,
} from '../../util/appUtils';
import AddAudit from '../addAudit';
import Action from './action';

import customData from '../data/customData.json';
import AuditEvents from './auditEvents';
import TimeLogs from './timeLogs';
import Auditors from './auditors';
import Auditees from './auditees';
import ViewChecklists from './viewChecklists';
import AuditActions from './auditActions';

import { getDueDays } from '../utils/utils';
import AuditReport from './auditReport';
import PrePostPone from './prePostPone';
import PrePostPoneCancel from './prePostPoneCancel';
import PrePostPoneApproval from './prePostPoneApproval';
import { getLabelData } from '../../apexDashboards/utils/utils';

const faIcons = {
  CANCEL: faTimesCircle,
  REVIEW: faEnvelope,
  PERFORM: faCheckCircle,
  START: faSignIn,
  SIGN: faSignOut,
  EXPORT: faFileExcel,
  POSTPOND: faCalendarDays,
  POSTPONDAPPROVAL: faCheck,
  POSTPONDCANCEL: faCancel,
};

const appModels = require('../../util/appModels').default;

const AuditDetails = ({ offset }) => {
  const { hxAuditDetailsInfo, hxAuditConfig, hxAuditUpdate } = useSelector((state) => state.hxAudits);
  const dispatch = useDispatch();
  const history = useHistory();
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const [anchorEl, setAnchorEl] = useState(null);
  const [value, setValue] = useState(0);
  const open = Boolean(anchorEl);
  const [editId, setEditId] = useState(false);
  const [taskQuestions, setTaskQuestions] = useState([]);
  const [editModal, showEditModal] = useState(false);

  const [viewId, setViewId] = useState(false);
  const [viewModel, setViewModel] = useState(false);

  const [chartType, setChartType] = useState('radar');

  const defaultActionText = 'Gatepass Actions';

  const [actionMethod, setActionMethod] = useState(false);
  const [actionButton, setActionButton] = useState(false);
  const [actionMsg, setActionMsg] = useState(false);
  const [statusName, setStatusName] = useState(false);

  const [actionModal, showActionModal] = useState(false);
  const [selectedActions, setSelectedActions] = useState(defaultActionText);
  const [selectedActionImage, setSelectedActionImage] = useState('');

  const [scheduleModal, setScheduleModal] = useState(false);

  const [scheduleCancelModal, setScheduleCancelModal] = useState(false);
  const [scheduleApprovalModal, setScheduleApprovalModal] = useState(false);

  const detailedData = hxAuditDetailsInfo && hxAuditDetailsInfo.data && hxAuditDetailsInfo.data.length ? hxAuditDetailsInfo.data[0] : '';
  let tabs = ['Overview', 'Stakeholders', 'Checklists', 'Audit Events', 'Time Logs', 'Status Logs', 'Attachments', 'Escalation Matrix'];

  if (detailedData && detailedData.state !== 'Started' && detailedData.state !== 'Upcoming') {
    tabs = ['Overview', 'Stakeholders', 'Checklists', 'Actions', 'Audit Events', 'Time Logs', 'Status Logs', 'Attachments', 'Escalation Matrix'];
  }

  const allowedOperations = getListOfOperations(
    userRoles && userRoles.data ? userRoles.data.allowed_modules : [],
    'code',
  );

  const opEdit = allowedOperations.includes(actionCodes['Edit Audit']);

  const isEditable = opEdit && detailedData && (detailedData.state === 'Upcoming' || detailedData.state === 'Started' || detailedData.state === 'Inprogress');

  const gpConfig = hxAuditConfig && hxAuditConfig.data && hxAuditConfig.data.length ? hxAuditConfig.data[0] : false;

  const userEmployee = userInfo && userInfo.data && userInfo.data.employee && userInfo.data.employee.id ? userInfo.data.employee.id : false;
  const userRole = userInfo && userInfo.data && userInfo.data.user_role_id ? userInfo.data.user_role_id : false;
  const userId = userInfo && userInfo.data && userInfo.data.id ? userInfo.data.id : false;
  const userMail = userInfo && userInfo.data && userInfo.data.email && userInfo.data.email.email ? userInfo.data.email.email : false;

  function exportTableToExcel(tableID, fileTitle = '') {
    try {
      const dataType = 'application/vnd.ms-excel';
      const tableSelect = document.getElementById(tableID);
      const tableHTML = tableSelect.outerHTML;

      // Specify file name
      const fileName = fileTitle ? `${fileTitle}.xls` : 'excel_data.xls';

      // Create download link element
      const downloadLink = document.createElement('a');

      document.body.appendChild(downloadLink);

      const blob = new Blob(['\ufeff', tableHTML], { type: dataType });

      if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, fileName);
      } else {
        const elem = window.document.createElement('a');
        elem.href = window.URL.createObjectURL(blob);
        elem.download = fileName;
        document.body.appendChild(elem);
        handleClose();
        elem.click();
        document.body.removeChild(elem);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  }

  const radarData = useMemo(() => {
    const options = {
      chart: {
        height: 350,
        type: chartType,
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
      title: {
        text: '% Complaince',
        style: {
          fontSize: '13px',
          fontWeight: 800,
          fontFamily: 'Suisse Intl',
        },
      },
      yaxis: {
        // stepSize: 20,
        labels: {
          formatter(val, index) {
            return getLabelData(val);
          },
          style: {
            fontSize: '10px',
            fontWeight: 400,
            fontFamily: 'Suisse Intl',
          },
        },
      },
      xaxis: {
        categories: [],
        style: {
          fontSize: '10px',
          fontWeight: 600,
          fontFamily: 'Suisse Intl',
        },
      },
    };
    let series = [{
      name: '% Complaince',
      data: [],
    }];
    let result = { options, series };
    if (detailedData && (detailedData.state === 'Completed' || detailedData.state === 'Reviewed' || detailedData.state === 'Signed off') && detailedData.summary_pages && detailedData.summary_pages.length > 0) {
      const newOptions = { ...options };
      newOptions.xaxis.categories = getColumnArrayByIdMulti(detailedData.summary_pages, 'name', 'title');
      newOptions.title.text = `${getDefaultNoValue(extractNameObject(detailedData.audit_system_id, 'name'))} % Complaince`;
      series[0].data = getColumnArrayByNumber(detailedData.summary_pages, 'percentage');
      if (chartType === 'bar' || chartType === 'bar_group') {
        newOptions.xaxis.labels = {
          style: {
            fontSize: '10px',
            fontWeight: 400,
            fontFamily: 'Suisse Intl',
          },
          trim: false,
          showDuplicates: false,
        };
        newOptions.plotOptions = {
          bar: {
            columnWidth: '45%',
            distributed: chartType !== 'bar_group',
          },
        };
        newOptions.tooltip = {
          enabled: true,
          y: {
            formatter: (val) => getLabelData(val),
            title: {
              formatter(seriesName) {
                return seriesName;
              },
            },
          },
        };
        newOptions.fill = {
          opacity: 1,
        };
        newOptions.stroke = {
          width: 0,
        };
        newOptions.dataLabels = {
          enabled: false,
        };
        newOptions.legend = {
          show: chartType === 'bar_group',
        };

        if (chartType === 'bar_group') {
        // Dynamically get metric names (keys from the first entry, excluding 'name'/'title')
          const metricKeys = getColumnArrayByIdMulti(detailedData.summary_pages, 'name', 'title');
          const data = getColumnArrayByNumber(detailedData.summary_pages, 'percentage');
          //  Build multi-series data dynamically
          series = metricKeys.map((metric, index) => ({
            name: metric, // Metric name as series name
            data: [data[index]], // Extract data for each metric
          }));
          newOptions.xaxis.categories = [`${getDefaultNoValue(extractNameObject(detailedData.audit_system_id, 'name'))} % Complaince`];
        }
        // newOptions.theme = { palette: 'palette3' };
      }
      result = { options: newOptions, series };
      // ApexCharts.exec('chart-audit', 'updateOptions', newOptions, false, true);
    }
    return result;
  }, [hxAuditDetailsInfo, chartType]);

  const taskChecklists = detailedData && detailedData.checklists_lines.length ? detailedData.checklists_lines : false;

  useEffect(() => {
    if (taskChecklists) {
      const newArrData = taskChecklists.map((cl) => ({
        id: cl.id,
        answer_type: cl.mro_activity_id.type,
        remarks: cl.remarks,
        is_na: cl.is_na,
        answer_common: cl.answer,
        mro_quest_grp_id: cl.question_group_id,
        achieved_score: cl.achieved_score,
        page_id: cl.page_id,
        mro_activity_id: {
          id: cl.mro_activity_id.id,
          name: cl.mro_activity_id.question,
          applicable_score: cl.mro_activity_id.applicable_score,
          applicable_standard_ids: cl.mro_activity_id.applicable_standard_ids,
          helper_text: cl.mro_activity_id.helper_text,
          procedure: cl.mro_activity_id.procedure,
          sequence: cl.mro_activity_id.sequence,
        },
      }));
      setTaskQuestions(newArrData);
    } else {
      setTaskQuestions([]);
    }
  }, [hxAuditDetailsInfo]);

  function isApproveUser() {
    let res = false;
    const canPostPreponeApproval = gpConfig && gpConfig.approval_required_for_postpone;
    const pendingdata = detailedData && detailedData.prepone_approval_ids && detailedData.prepone_approval_ids.length ? detailedData.prepone_approval_ids.filter((item) => item.state === 'Pending') : [];
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
    } else if (gpConfig && gpConfig.approval_authority && gpConfig.approval_authority.id) {
      const teamData = gpConfig.approval_authority.type === 'Team';
      const userData = gpConfig.approval_authority.type === 'User';
      const roleData = gpConfig.approval_authority.type === 'Role';
      const customMailData = gpConfig.approval_authority.type === 'Custom';
      if (userData) {
        const userData1 = gpConfig.approval_authority.users_ids && gpConfig.approval_authority.users_ids.length ? gpConfig.approval_authority.users_ids : [];
        if (userData1 && userData1.length && getColumnArrayById(userData1, 'id').includes(userId)) {
          res = true;
        }
      }
      if (roleData) {
        const roleData1 = gpConfig.approval_authority.role_id && gpConfig.approval_authority.role_id.id;
        if (roleData1 && roleData1 === userRole) {
          res = true;
        }
      }
      if (customMailData) {
        const customMailData1 = gpConfig.approval_authority.user_defined_email_ids && gpConfig.approval_authority.user_defined_email_ids.includes(userMail);
        if (customMailData1) {
          res = true;
        }
      }
      if (teamData) {
        const teamMembers = gpConfig.approval_authority.team_members.member_ids.map((item) => ({
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
    const pendingdata = detailedData && detailedData.prepone_approval_ids && detailedData.prepone_approval_ids.length ? detailedData.prepone_approval_ids.filter((item) => item.state === 'Pending') : [];
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

  useEffect(() => {
    if (value === 2 && detailedData && detailedData.id) {
      dispatch(getHxAuditActions(appModels.HXAUDITACTION, detailedData.id, false));
    }
  }, [value, hxAuditDetailsInfo]);

  const checkActionAllowed = (actionName) => {
    let allowed = true;
    const vrState = detailedData && detailedData.state ? detailedData.state : '';
    const isApprovalPending = detailedData && detailedData.is_pending_for_approval;
    const canPerform = gpConfig && gpConfig.allow_missed_audits_to_be_performed;
    const canPostPrepone = gpConfig && gpConfig.allow_postpone_prepone;

    if (actionName === 'Start Audit') {
      if (vrState !== 'Upcoming' && !(canPerform && vrState === 'Missed')) {
        allowed = false;
      }
    }
    if (actionName === 'Perform Audit') {
      if (vrState !== 'Started' && vrState !== 'Inprogress') {
        allowed = false;
      }
    }
    if (actionName === 'Export Report') {
      if (vrState !== 'Completed' && vrState !== 'Signed off' && vrState !== 'Reviewed') {
        allowed = false;
      }
    }
    if (actionName === 'Prepone / Postpone Audit') {
      if (!(vrState === 'Upcoming' && canPostPrepone && !isApprovalPending)) {
        allowed = false;
      }
    }
    if (actionName === 'Cancel Prepone / Postpone Request') {
      if (!(isApprovalPending && isRequestUser())) {
        allowed = false;
      }
    }
    if (actionName === 'Prepone / Postpone Approval') {
      if (!(isApprovalPending && isApproveUser())) {
        allowed = false;
      }
    }
    if (actionName === 'Cancel Audit') {
      if (vrState !== 'Started' && vrState !== 'Upcoming') {
        allowed = false;
      }
    }
    if (actionName === 'Review Audit') {
      if (vrState !== 'Completed') {
        allowed = false;
      }
    }
    if (actionName === 'Sign off Audit') {
      if (vrState !== 'Reviewed') {
        allowed = false;
      }
    }
    return allowed;
  };

  const checkDisable = (actionName) => {
    let disable = false;
    const vrState = detailedData && detailedData.state ? detailedData.state : '';
    const canPerform = gpConfig && gpConfig.allow_missed_audits_to_be_performed;
    const startDate = detailedData && detailedData.planned_start_date ? moment.utc(detailedData.planned_start_date).local().format('YYYY-MM-DD HH:mm:ss') : new Date();
    const endDate = detailedData && detailedData.planned_end_date ? moment.utc(detailedData.planned_end_date).local().format('YYYY-MM-DD HH:mm:ss') : new Date();
    const isWithinRange = (new Date() >= new Date(startDate) && new Date(endDate) >= new Date());
    const isNotFuture = new Date() >= new Date(startDate);
    const isAllow = canPerform || isWithinRange;
    const isApprovalPending = detailedData && detailedData.is_pending_for_approval;

    if (((actionName === 'Start Audit' || actionName === 'Perform Audit' || actionName === 'Review Audit' || actionName === 'Sign off Audit') && !isAllow) || (!isNotFuture && actionName !== 'Prepone / Postpone Audit' && actionName !== 'Prepone / Postpone Approval' && actionName !== 'Cancel Prepone / Postpone Request') || (isApprovalPending && actionName !== 'Cancel Prepone / Postpone Request' && actionName !== 'Prepone / Postpone Approval')) {
      disable = true;
    }
    return disable;
  };
  const startDate = detailedData && detailedData.planned_start_date ? moment.utc(detailedData.planned_start_date).local().format('YYYY-MM-DD HH:mm:ss') : new Date();
  const isNotFuture = new Date() >= new Date(startDate);

  const checkAuditStatus = (val) => (
    <Box>
      {hxAuditStatusJson.map(
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
          {val === 'Upcoming' ? getDueDays(detailedData.planned_start_date, detailedData.planned_end_date) : ''}
        </Box>
        ),
      )}
    </Box>
  );

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeAction = () => {
    showActionModal(false);
    dispatch(resetUpdateHxAudit());
    setSelectedActions(defaultActionText);
    setSelectedActionImage('');
    setActionMethod('');
    setActionButton('');
    setStatusName('');
    setActionMsg('');
  };

  const closeSchedule = () => {
    setScheduleModal(false);
    dispatch(resetUpdateHxAudit());
    setSelectedActions(defaultActionText);
    setSelectedActionImage('');
  };

  const closeCancelSchedule = () => {
    setScheduleCancelModal(false);
    dispatch(resetUpdateHxAudit());
    setSelectedActions(defaultActionText);
    setSelectedActionImage('');
  };

  const closeApprovalSchedule = () => {
    setScheduleApprovalModal(false);
    dispatch(resetUpdateHxAudit());
    setSelectedActions(defaultActionText);
    setSelectedActionImage('');
  };

  const switchActionItem = (action) => {
    if (action.displayname !== 'Perform Audit' && action.displayname !== 'Export Report' && action.displayname !== 'Prepone / Postpone Audit' && action.displayname !== 'Cancel Prepone / Postpone Request' && action.displayname !== 'Prepone / Postpone Approval') {
      dispatch(resetUpdateHxAudit());
      setSelectedActions(action.displayname);
      setActionMethod(action.method);
      setActionButton(action.displayname);
      setActionMsg(action.message);
      setSelectedActionImage(action.name);
      showActionModal(true);
      handleClose();
    } else if (action.displayname !== 'Export Report' && action.displayname !== 'Prepone / Postpone Audit' && action.displayname !== 'Cancel Prepone / Postpone Request' && action.displayname !== 'Prepone / Postpone Approval') {
      dispatch(resetUpdateHxAudit());
      handleClose();
      history.push({ pathname: `/audit-checklists/perform/${detailedData.id}` });
    } else if (action.displayname !== 'Prepone / Postpone Audit' && action.displayname !== 'Cancel Prepone / Postpone Request' && action.displayname !== 'Prepone / Postpone Approval') {
      setSelectedActions(action.displayname);
      setTimeout(() => {
        exportTableToExcel('print_audit_report', getDefaultNoValue(detailedData.name));
      }, 1500);
    } else if (action.displayname !== 'Cancel Prepone / Postpone Request' && action.displayname !== 'Prepone / Postpone Approval') {
      dispatch(resetUpdateHxAudit());
      setSelectedActions(action.displayname);
      setSelectedActionImage(action.name);
      setScheduleModal(true);
      handleClose();
    } else if (action.displayname !== 'Prepone / Postpone Approval') {
      dispatch(resetUpdateHxAudit());
      setSelectedActions(action.displayname);
      setSelectedActionImage(action.name);
      setScheduleCancelModal(true);
      handleClose();
    } else {
      dispatch(resetUpdateHxAudit());
      setSelectedActions(action.displayname);
      setSelectedActionImage(action.name);
      setScheduleApprovalModal(true);
      handleClose();
    }
  };

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const closeEditWindow = () => {
    showEditModal(false);
  };

  const closeEditReset = () => {
    showEditModal(false);
    if (editId && hxAuditUpdate && hxAuditUpdate.data) {
      dispatch(getHxAuditDetails(editId, appModels.HXAUDIT));
    }
    dispatch(resetUpdateHxAudit());
  };

  function getRangeColor(valueData, ranges) {
    let score = 'white';
    if (ranges && ranges.length) {
      const rangesData = ranges.filter((item) => parseFloat(parseFloat(item.min).toFixed(2)) <= parseFloat(parseFloat(valueData).toFixed(2)) && parseFloat((parseFloat(item.max).toFixed(2))) >= parseFloat((parseFloat(valueData).toFixed(2))));
      if (rangesData && rangesData.length) {
        score = rangesData[0].color;
      }
    }

    return score;
  }

  return (
    <>
      {detailedData && (
      <Box>
        <DetailViewHeader
          mainHeader={`${getDefaultNoValue(detailedData.name)}`}
          subHeader={detailedData.sequence}
          status={
                            detailedData.state ? checkAuditStatus(detailedData.state) : '-'
                        }
          actionComponent={(
            <Box>
              {hxAuditDetailsInfo
                                    && !hxAuditDetailsInfo.loading
                                    && isEditable && (
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
                                        setEditId(hxAuditDetailsInfo && (hxAuditDetailsInfo.data && hxAuditDetailsInfo.data.length > 0) ? hxAuditDetailsInfo.data[0].id : false);
                                        showEditModal(true);
                                        dispatch(resetUpdateHxAudit());
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
                {customData && customData.actionItems.map((actions) => (
                  (allowedOperations.includes(actionCodes[actions.displayname]) || (actions.displayname === 'Export Report')) && (
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
                      {actions.displayname}
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
            {detailedData && !detailedData.is_pending_for_approval && isNotFuture && (detailedData.state !== 'Signed off' && detailedData.state !== 'Canceled') && (
            <Stack>
              <Alert severity="info">
                <p className="font-family-tab mb-0">
                  {detailedData && detailedData.state && customData && customData.statusMsg && customData.statusMsg[detailedData.state] ? customData.statusMsg[detailedData.state].msg : ''}
                </p>
              </Alert>
            </Stack>
            )}
            {detailedData.is_pending_for_approval && (
            <Stack>
              <Alert severity="info">
                <p className="font-family-tab mb-0">
                  Prepone / Postpone Approval Pending
                </p>
              </Alert>
            </Stack>
            )}
            <TabPanel value={value} index={0}>
              <DetailViewLeftPanel
                panelData={[
                  {
                    header: 'General Information',
                    leftSideData: [
                      {
                        property: 'Audit System',
                        value: getDefaultNoValue(extractNameObject(detailedData.audit_system_id, 'name')),
                      },
                      {
                        property: 'Planned Start Date',
                        value: getDefaultNoValue(getCompanyTimezoneDate(detailedData.planned_start_date, userInfo, 'datetime')),
                      },
                      {
                        property: 'Department',
                        value: getDefaultNoValue(extractNameObject(detailedData.department_id, 'name')),
                      },
                      {
                        property: 'Audit SPOC',
                        value: getDefaultNoValue(extractNameObject(detailedData.audit_spoc_id, 'name')),
                      },
                      {
                        property: 'Audit Category',
                        value: getDefaultNoValue(extractNameObject(detailedData.audit_category_id, 'name')),
                      },
                      {
                        property: 'Scope',
                        value: getDefaultNoValue(detailedData.scope),
                      },
                    ],
                    rightSideData: [
                      {
                        property: 'Quarter',
                        value: getDefaultNoValue(detailedData.quarter),
                      },
                      {
                        property: 'Planned End date',
                        value: getDefaultNoValue(getCompanyTimezoneDate(detailedData.planned_end_date, userInfo, 'datetime')),
                      },
                      {
                        property: 'Company',
                        value: getDefaultNoValue(extractNameObject(detailedData.company_id, 'name')),
                      },
                      {
                        property: 'SLA Status',
                        value: getDefaultNoValue(detailedData.sla_status),
                      },
                      {
                        property: 'Objective',
                        value: getDefaultNoValue(detailedData.objective),
                      },
                    ],
                  },
                ]}
              />
              {detailedData && (detailedData.state === 'Completed' || detailedData.state === 'Reviewed' || detailedData.state === 'Signed off') && detailedData.summary_pages && detailedData.summary_pages.length > 0 && (
                <>
                  <Typography
                    sx={detailViewHeaderClass}
                  >
                    Summary
                  </Typography>
                  <Box
                    sx={{
                      width: '100%',
                      display: 'flex',
                    }}
                  >
                    <Box
                      sx={{
                        width: '50%',
                      }}
                    >
                      <Col sm="12" md="12" lg="12" xs="12" className="p-1 bg-white comments-list thin-scrollbar">
                        <div>
                          <Table responsive className="mb-2 font-weight-400 border-0 assets-table" width="100%">
                            <thead className="bg-gray-light">
                              <tr>
                                <th className="sticky-th font-family-tab-v2">{getDefaultNoValue(extractNameObject(detailedData.audit_system_id, 'name'))}</th>
                                <th className="p-2 sticky-th sticky-head cursor-default text-right font-family-tab-v2">Maximum Score</th>
                                <th className="p-2 sticky-th sticky-head cursor-default text-right font-family-tab-v2">Achieved Score</th>
                                <th className="p-2 sticky-th sticky-head cursor-default text-right font-family-tab-v2">% Complaince</th>
                              </tr>
                            </thead>
                            <tbody>
                              {detailedData.summary_pages.map((section) => (
                                <tr key={section.id}>
                                  <td className="p-2 sticky-td font-family-tab-v2">{section.name && section.name.title ? section.name.title : '-'}</td>
                                  <td className="p-2 sticky-td text-right font-family-tab-v2">{section.max_score ? parseFloat(section.max_score).toFixed(2) : '0.00'}</td>
                                  <td className="p-2 sticky-td text-right font-family-tab-v2">{section.achieved_score ? parseFloat(section.achieved_score).toFixed(2) : '0.00'}</td>
                                  <td className="p-2 sticky-td text-right font-family-tab-v2">{section.percentage ? parseFloat(section.percentage).toFixed(2) : '0.00'}</td>
                                </tr>
                              ))}
                              <tr>
                                <td className="p-2 sticky-td font-weight-800" />
                                <td className="p-2 sticky-td font-weight-800" />
                                <td
                                  className="p-2 sticky-td font-weight-800 font-family-tab-v2"
                                  style={{ color: getRangeColor(detailedData.overall_score, detailedData.audit_metric_id && detailedData.audit_metric_id.scale_line_ids ? detailedData.audit_metric_id.scale_line_ids : []) !== 'white' ? 'white' : '#374152', backgroundColor: getRangeColor(detailedData.overall_score, detailedData.audit_metric_id && detailedData.audit_metric_id.scale_line_ids ? detailedData.audit_metric_id.scale_line_ids : []) }}
                                >
                                  Overall %
                                </td>
                                <td
                                  className="p-2 sticky-td text-right font-weight-800 font-family-tab-v2"
                                  style={{ color: getRangeColor(detailedData.overall_score, detailedData.audit_metric_id && detailedData.audit_metric_id.scale_line_ids ? detailedData.audit_metric_id.scale_line_ids : []) !== 'white' ? 'white' : '#374152', backgroundColor: getRangeColor(detailedData.overall_score, detailedData.audit_metric_id && detailedData.audit_metric_id.scale_line_ids ? detailedData.audit_metric_id.scale_line_ids : []) }}
                                >
                                  {detailedData && detailedData.overall_score ? parseFloat(detailedData.overall_score).toFixed(2) : 0.00}
                                </td>
                                <td align="right" className="p-2 sticky-td text-right font-weight-800" />

                              </tr>

                            </tbody>
                          </Table>
                          <hr className="m-0" />
                          <p className="font-family-tab-v2 mt-2">Overall % Grades</p>
                          <Table responsive className="mb-2 font-weight-400 border-0 assets-table" width="100%">
                            <thead className="bg-gray-light">
                              <tr>
                                <th className="font-family-tab-v2">Category</th>
                                <th className="p-2 cursor-default font-family-tab-v2">Condition for Final Score</th>
                              </tr>
                            </thead>
                            <tbody>
                              {detailedData.audit_metric_id && detailedData.audit_metric_id.scale_line_ids && detailedData.audit_metric_id.scale_line_ids.length > 0 && detailedData.audit_metric_id.scale_line_ids.map((sl) => (
                                <tr key={sl.min}>
                                  <td className="p-2 font-family-tab-v2" style={{ color: sl.color ? 'white' : '#374152', backgroundColor: sl.color }}>{sl.legend}</td>
                                  <td className="p-2 font-family-tab-v2">
                                    {`>= ${sl.min ? parseFloat(sl.min).toFixed(2) : '0.00'} % - <= ${sl.max ? parseFloat(sl.max).toFixed(2) : '0.00'} %`}
                                  </td>
                                </tr>
                              ))}

                            </tbody>
                          </Table>
                          <hr className="m-0" />
                        </div>
                      </Col>
                    </Box>
                    <Box
                      sx={{
                        width: '50%',
                      }}
                    >
                      <div className="text-right mr-2">
                        <ButtonGroup
                          variant="contained"
                          size="small"
                          aria-label="Basic button group"
                        >
                          <Button
                            onClick={() => setChartType('radar')}
                            variant={chartType === 'radar' ? 'contained' : 'outlined'}
                            color={chartType === 'radar' ? 'primary' : 'inherit'}
                          >
                            Radar
                          </Button>
                          <Button
                            onClick={() => setChartType('bar')}
                            variant={chartType === 'bar' ? 'contained' : 'outlined'}
                            color={chartType === 'bar' ? 'primary' : 'inherit'}
                          >
                            Bar
                          </Button>
                        </ButtonGroup>
                      </div>
                      <div id="chart-auditi">
                        {chartType === 'radar' && (
                        <Chart id="chart-audit-radar" options={radarData.options} series={radarData.series} type="radar" height={350} />
                        )}
                        {chartType === 'bar' && (
                        <Chart id="chart-audit-bar" options={radarData.options} series={radarData.series} type="bar" height={350} />
                        )}
                      </div>
                    </Box>
                  </Box>
                </>
              )}
              <DetailViewLeftPanel
                panelData={[
                  {
                    header: 'Instructions',
                    leftSideData: [
                      {
                        property: 'Instructions to Auditor',
                        value: <p
                          className="text-capital font-side-heading m-0 p-0 max-height-300 overflow-auto thin-scrollbar"
                          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(htmlToReact(detailedData.instructions_to_auditor), { USE_PROFILES: { html: true } }) }}
                        />,
                      },
                      {
                        property: 'Instructions to Auditee',
                        value: <p
                          className="text-capital font-side-heading m-0 p-0 max-height-300 overflow-auto thin-scrollbar"
                          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(htmlToReact(detailedData.instructions_to_auditee), { USE_PROFILES: { html: true } }) }}
                        />,
                      },
                    ],
                    rightSideData: [
                      {
                        property: 'Terms and Conditions',
                        value: <p
                          className="text-capital font-side-heading m-0 p-0 max-height-300 overflow-auto thin-scrollbar"
                          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(htmlToReact(detailedData.terms_and_conditions), { USE_PROFILES: { html: true } }) }}
                        />,
                      },
                    ],
                  },
                ]}
              />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <>

                <Auditors />
                <Auditees />
              </>
            </TabPanel>
            <TabPanel value={value} index={2}>
              <ViewChecklists orderCheckLists={taskQuestions} />
            </TabPanel>
            {detailedData && detailedData.state !== 'Started' && detailedData.state !== 'Upcoming' && (
            <TabPanel value={value} index={3}>
              <AuditActions questionId={false} />
            </TabPanel>
            )}
            <TabPanel value={value} index={detailedData && detailedData.state !== 'Started' && detailedData.state !== 'Upcoming' ? 4 : 3}>
              <AuditEvents />
            </TabPanel>
            <TabPanel value={value} index={detailedData && detailedData.state !== 'Started' && detailedData.state !== 'Upcoming' ? 5 : 4}>
              <TimeLogs />
            </TabPanel>
            <TabPanel value={value} index={detailedData && detailedData.state !== 'Started' && detailedData.state !== 'Upcoming' ? 6 : 5}>
              <StatusLogs />
            </TabPanel>
            <TabPanel value={value} index={detailedData && detailedData.state !== 'Started' && detailedData.state !== 'Upcoming' ? 7 : 6}>
              <Documents
                viewId={detailedData.id}
                ticketNumber={detailedData.name}
                resModel={appModels.HXAUDIT}
                model={appModels.DOCUMENT}
              />
              <Divider />

            </TabPanel>
            <TabPanel value={value} index={detailedData && detailedData.state !== 'Started' && detailedData.state !== 'Upcoming' ? 8 : 7}>
              <SlaMatrix />
            </TabPanel>
          </Box>
          {actionModal && (
          <Action
            atFinish={() => closeAction()}
            atCancel={() => closeAction()}
            detailData={detailedData}
            actionModal={actionModal}
            actionButton={actionButton}
            actionMsg={actionMsg}
            offset={offset}
            actionMethod={actionMethod}
            displayName={selectedActions}
            message={selectedActionImage}
          />
          )}
          {scheduleModal && (
          <PrePostPone
            atFinish={() => closeSchedule()}
            atCancel={() => closeSchedule()}
            detailData={detailedData}
            actionModal={scheduleModal}
            offset={offset}
          />
          )}
          {scheduleCancelModal && (
          <PrePostPoneCancel
            atFinish={() => closeCancelSchedule()}
            atCancel={() => closeCancelSchedule()}
            detailData={detailedData}
            actionModal={scheduleCancelModal}
            offset={offset}
          />
          )}
          {scheduleApprovalModal && (
          <PrePostPoneApproval
            atFinish={() => closeApprovalSchedule()}
            atCancel={() => closeApprovalSchedule()}
            detailData={detailedData}
            actionModal={scheduleApprovalModal}
            offset={offset}
          />
          )}
          <div className="hidden-div" id="print_audit_report">
            {selectedActions && selectedActions === 'Export Report' && (
            <>
              <table align="center">
                <tbody>
                  <tr>
                    <td><b>{getDefaultNoValue(detailedData.name)}</b></td>
                  </tr>
                  <tr>
                    <td>Company</td>
                    <td colSpan={15}><b>{userInfo && userInfo.data ? userInfo.data.company.name : 'Company'}</b></td>
                  </tr>
                  <tr>
                    <td colSpan={15}>
                      <b>
                        {getDefaultNoValue(getCompanyTimezoneDate(detailedData.planned_start_date, userInfo, 'datetime'))}
                        {' - '}
                        {getDefaultNoValue(getCompanyTimezoneDate(detailedData.planned_end_date, userInfo, 'datetime'))}
                      </b>
                    </td>
                  </tr>
                </tbody>
              </table>

              <br />
              <AuditReport orderCheckLists={taskQuestions} detailedData={detailedData} />
            </>
            )}
          </div>
          <Drawer
            PaperProps={{
              sx: { width: '50%' },
            }}
            anchor="right"
            open={editModal}
          >
            <DrawerHeader
              headerName="Update Audit"
              imagePath={auditBlue}
              onClose={closeEditWindow}
            />
            <AddAudit
              editId={editId}
              closeModal={closeEditWindow}
              afterReset={closeEditReset}
              isShow={editModal}
              setViewId={setViewId}
              setViewModal={setViewModel}
            />
          </Drawer>
        </Box>
      </Box>
      )}
      {hxAuditDetailsInfo && hxAuditDetailsInfo.loading && <Loader />}
    </>
  );
};
export default AuditDetails;
