/* eslint-disable max-len */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
import {
  ButtonDropdown,
  Card,
  CardBody,
  Col,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Row,
  Spinner,
} from 'reactstrap';
import moment from 'moment-timezone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown, faCog, faPrint,
} from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';
import { Drawer } from 'antd';

import DrawerHeader from '@shared/drawerHeader';
import envelopeIcon from '@images/icons/envelope.svg';
import telephoneIcon from '@images/icons/telephone.svg';
import escalate from '@images/icons/escalateBlue.svg';
import reassign from '@images/icons/ticketBlue.svg';
import workorders from '@images/icons/workOrders.svg';
import message from '@images/icons/messageBlue.svg';
import messageGrey from '@images/icons/messageGrey.svg';
import closeIcon from '@images/icons/closeCircleBlue.svg';
import holdIcon from '@images/icons/auditBlue.svg';
import locationBlack from '@images/drawerLite/locationLite.svg';
import assetDefault from '@images/drawerLite/assetLite.svg';
import handPointerBlack from '@images/drawerLite/actionLite.svg';
import logsIcon from '@images/drawerLite/statusLite.svg';
import shareIcon from '@images/ticket/shareBlue.svg';

import ErrorContent from '@shared/errorContent';
import actionCodes from '../data/helpdeskActionCodes.json';
import ticketActions from '../data/ticketsActions.json';
import {
  getDefaultNoValue, getListOfOperations, isOperationsExists,
  extractTextObject, getAllCompanies, extractNameObject,
} from '../../util/appUtils';
import {
  getTicketStatText, getTicketStateFormText,
  getIncidentStatText, getSLALabel, getSLATime,
  getSLAStatusCheck, getSLATimeClosed, getSLAStatusCheckClose,
} from '../utils/utils';
import {
  resetMessage, resetEscalate, resetClose, getTicketDetail,
  getOrdersFullDetails, resetshareTicket,
} from '../ticketService';
import ReassignTicket from './reassignTicket';
import EscalateTicket from './escalateTicket';
import CloseTicket from './closeTicket';
import SendMessage from './sendMessage';
import {
  resetOrderCheckList,
  resetUpdateCheckList,
  getOrderDetail,
} from '../../workorders/workorderService';
import CheckList from '../../workorders/viewWorkorder/actionItems/checklistFinish';
import ActionWorkorder from '../../workorders/viewWorkorder/actionItems/actionWorkorder';
import CloseWorkorder from '../../workorders/viewWorkorder/actionItems/closeWorkorder';
import AcceptWorkorder from '../../workorders/viewWorkorder/actionItems/acceptStartWorkorder';
import PauseWorkorder from '../../workorders/viewWorkorder/actionItems/pauseWorkorder';
import OrderDetail from '../../workorders/viewWorkorder/orderDetail';
import InProgressTicket from '../../workorders/viewWorkorder/actionItems/inProgressTicket';
import ShareTicket from './shareTicket';
import { getPrintReport, resetPrint } from '../../purchase/purchaseService';

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

const BasicInfo = (props) => {
  const {
    isIncident, setViewModal, isFITTracker, type,
  } = props;
  const dispatch = useDispatch();
  const defaultActionText = isIncident ? 'Incident Actions' : 'Ticket Actions';
  const [enterAction, setEnterAction] = useState(false);
  const [changeLocationActionOpen, setLocationActionOpen] = useState(false);
  const [selectedActions, setSelectedActions] = useState(defaultActionText);
  const [selectedActionImage, setSelectedActionImage] = useState('');
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

  const {
    workorderDetails, stateChangeInfo,
  } = useSelector((state) => state.workorder);

  const changeLocationActionToggle = () => setLocationActionOpen(!changeLocationActionOpen);
  const checkOperationType = type === 'FITTracker' ? 'FIT Tracker' : isIncident ? 'Incident Management' : 'Helpdesk';
  const {
    ticketDetail, incidentsOrderInfo, maintenanceConfigurationData, shareTicketInfo,
  } = useSelector((state) => state.ticket);

  const {
    printReportInfo,
  } = useSelector((state) => state.purchase);
  const { userInfo, userRoles } = useSelector((state) => state.user);

  const companies = getAllCompanies(userInfo, userRoles);

  const isMobNotShow = maintenanceConfigurationData && !maintenanceConfigurationData.loading && maintenanceConfigurationData.data
    && maintenanceConfigurationData.data.length > 0 && maintenanceConfigurationData.data[0].requestor_mobile_visibility === 'Confidential';
  const isAgeShow = maintenanceConfigurationData && !maintenanceConfigurationData.loading && maintenanceConfigurationData.data
    && maintenanceConfigurationData.data.length > 0 && maintenanceConfigurationData.data[0].is_age;

  const detailData = ticketDetail && (ticketDetail.data && ticketDetail.data.length > 0) ? ticketDetail.data[0] : '';
  const loading = ticketDetail && ticketDetail.loading;

  const reportType = detailData && detailData.incident_state === 'Assess' ? 'mro_incident_ticket.incident_report_part_a' : detailData && detailData.incident_state === 'Remediate' ? 'mro_incident_ticket.incident_report_part_b' : '';
  useEffect(() => {
    const viewId = ticketDetail && ticketDetail.data && ticketDetail.data.length > 0 ? ticketDetail.data[0].id : false;
    if ((printModal) && viewId) {
      dispatch(getPrintReport(viewId, 'mro_incident_ticket.incident_report_part_a'));
    }
  }, [printModal]);

  useEffect(() => {
    const viewId = ticketDetail && ticketDetail.data && ticketDetail.data.length > 0 ? ticketDetail.data[0].id : false;
    if ((printModalb) && viewId) {
      dispatch(getPrintReport(viewId, 'mro_incident_ticket.incident_report_part_b'));
    }
  }, [printModalb]);

  useEffect(() => {
    if ((printModal || printModalb) && printReportInfo && printReportInfo.data) {
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
    if (ticketDetail && ticketDetail.data && isIncident) {
      const ids = ticketDetail.data.length > 0 ? ticketDetail.data[0].order_ids : [];
      dispatch(getOrdersFullDetails(companies, appModels.ORDER, ids));

      const woId = ticketDetail.data.length > 0 ? ticketDetail.data[0].mro_order_id[0] : false;
      if (woId) {
        dispatch(getOrderDetail(woId, appModels.ORDER));
      }
    }
  }, [ticketDetail]);

  const cancelMessage = () => {
    dispatch(resetMessage());
    const viewId = ticketDetail && ticketDetail.data && ticketDetail.data.length > 0 ? ticketDetail.data[0].id : '';
    dispatch(getTicketDetail(viewId, appModels.HELPDESK));
  };

  const cancelEscalate = () => {
    dispatch(resetEscalate());
  };

  const cancelReassign = () => {
    dispatch(resetEscalate());
  };

  const cancelClose = () => {
    dispatch(resetClose());
  };

  useEffect(() => {
    setSelectedActions(defaultActionText);
    setSelectedActionImage('');
  }, []);

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
      cancelEscalate(); cancelReassign(); cancelClose();
      showCloseModal(true);
    }
    if (selectedActions === 'Put On-Hold') {
      if (ticketDetail && ticketDetail.data && !isIncident) {
        const woId = ticketDetail.data.length > 0 ? ticketDetail.data[0].mro_order_id[0] : false;
        if (woId) {
          dispatch(getOrderDetail(woId, appModels.ORDER));
        }
      }
      setActionText('Pause');
      setActionCode('do_record');
      showPauseActionModal(true);
    }
    if (selectedActions === 'Share Ticket') {
      dispatch(resetshareTicket());
      setShareActionModal(true);
    }
    if (selectedActions === 'Move to In Progress') {
      if (ticketDetail && ticketDetail.data && ticketDetail.data[0].mro_order_id) {
        if (ticketDetail && ticketDetail.data && !isIncident) {
          const ids = ticketDetail.data.length > 0 ? ticketDetail.data[0].order_ids : [];
          dispatch(getOrdersFullDetails(companies, appModels.ORDER, ids));

          const woId = ticketDetail.data.length > 0 ? ticketDetail.data[0].mro_order_id[0] : false;
          if (woId) {
            dispatch(getOrderDetail(woId, appModels.ORDER));
          }
        }
        setActionText('Restart');
        setActionCode('action_restart');
        showActionModal(true);
      } else {
        setProgressActionModal(true);
      }
    }
    if (selectedActions === 'Go to Work Orders') {
      if (ticketDetail && ticketDetail.data && ticketDetail.data[0].mro_order_id) {
        if (ticketDetail && ticketDetail.data && !isIncident) {
          const woId = ticketDetail.data.length > 0 ? ticketDetail.data[0].mro_order_id[0] : false;
          if (woId) {
            dispatch(getOrderDetail(woId, appModels.ORDER));
          }
        }
        setAddLink(true);
        setViewModal(false);
      }
    }
    if (selectedActions === 'Start Assessment' || selectedActions === 'Start Remediation') {
      setActionText('Assign');
      setActionCode('assgined_request_order');
      showAcceptModal(true);
    }
    if (selectedActions === 'Finish Assessment' || selectedActions === 'Finish Remediation') {
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

  function checkActionAllowed(actionName) {
    let allowed = true;
    const whState = getTicketStateFormText(ticketDetail.data[0].state_id ? ticketDetail.data[0].state_id[1] : '');
    const inState = ticketDetail.data[0].incident_state ? ticketDetail.data[0].incident_state : '';
    const woState = ticketDetail.data[0].mro_state ? ticketDetail.data[0].mro_state : '';
    if (!isIncident) {
      if (actionName === 'Escalate Ticket' && (whState === 'Staff Closed' || whState === 'Customer Closed')) {
        allowed = false;
      }
      if (actionName === 'Reassign Ticket' && (whState === 'Staff Closed' || whState === 'Customer Closed')) {
        allowed = false;
      }
      if (actionName === 'Send Message' && (whState === 'Staff Closed' || whState === 'Customer Closed')) {
        allowed = false;
      }
      if (actionName === 'Close Ticket' && (whState === 'Staff Closed' || whState === 'Customer Closed')) {
        allowed = false;
      }
      if (actionName === 'Put On-Hold' && (whState === 'Staff Closed' || whState === 'Customer Closed' || whState === 'On Hold')) {
        allowed = false;
      }
      if (actionName === 'Move to In Progress' && ((whState === 'Open' && woState) || whState === 'Staff Closed' || whState === 'Customer Closed' || whState === 'In Progress')) {
        allowed = false;
      }
    } else {
      if (actionName === 'Escalate Ticket' && (whState === 'Staff Closed' || inState === 'Resolved')) {
        allowed = false;
      }
      if (actionName === 'Reassign Ticket' && (whState === 'Staff Closed' || inState === 'Resolved')) {
        allowed = false;
      }
      if (actionName === 'Send Message' && (whState === 'Staff Closed' || inState === 'Resolved')) {
        allowed = false;
      }
      if (actionName === 'Start Assessment' && (inState === 'Assess In Progress' || inState === 'Resolved' || inState === 'Remediate' || inState === 'Remediate In Progress' || inState === 'Assess')) {
        allowed = false;
      }
      if (actionName === 'Finish Assessment' && (inState === 'Resolved' || inState === 'Remediate'
        || inState === 'Report' || inState === 'Remediate In Progress' || inState === 'Assess')) {
        allowed = false;
      }
      if (actionName === 'Start Remediation' && (inState === 'Report' || inState === 'Resolved'
        || inState === 'Assess In Progress' || inState === 'Remediate' || inState === 'Remediate In Progress')) {
        allowed = false;
      }
      if (actionName === 'Finish Remediation' && (inState === 'Resolved' || inState === 'Assess In Progress' || inState === 'Report' || inState === 'Assess' || inState === 'Remediate')) {
        allowed = false;
      }
      if (actionName === 'Report Part A' && (inState === 'Assess In Progress' || inState === 'Resolved' || inState === 'Remediate In Progress' || inState === 'Report' || inState === 'Remediate')) {
        allowed = false;
      }
      if (actionName === 'Report Part B' && (inState === 'Assess In Progress' || inState === 'Remediate In Progress' || inState === 'Assess')) {
        allowed = false;
      }
    }
    return allowed;
  }

  function checkActionAllowedDisabled(actionName) {
    let allowed = true;
    const woId = ticketDetail && ticketDetail.data && ticketDetail.data[0].mro_order_id ? ticketDetail.data[0].mro_order_id[0] : false;
    const escalateLevel = ticketDetail && ticketDetail.data && ticketDetail.data[0].current_escalation_level;
    if (woId && actionName === 'Escalate Ticket') {
      allowed = false;
    }
    if (actionName === 'Go to Work Orders' && !woId) {
      allowed = false;
    }
    return allowed;
  }

  const switchActionItem = (action) => {
    setLocationActionOpen(!changeLocationActionOpen);
    setSelectedActions(action.displayname);
    setSelectedActionImage(action.name);
    setEnterAction(Math.random());
  };

  const onViewReset = () => {
    setAddLink(false);
    setViewModal(true);
    setSelectedActions(defaultActionText);
    setSelectedActionImage('');
  };

  const allowedOperationsConfig = getListOfOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'code');
  const allowedOperations = allowedOperationsConfig.concat(['Accept Assessment', 'Start Assessment', 'Finish Assessment', 'Accept Remediation', 'Start Remediation', 'Finish Remediation', 'Report Part A', 'Report Part B']);
  const isActionsExists = isOperationsExists(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], checkOperationType);

  const woDetailData = workorderDetails && workorderDetails.data && workorderDetails.data.length > 0 ? { data: [workorderDetails.data[0]] } : false;
  const actionsList = isIncident ? ticketActions.actionIncidentItems : ticketActions.actionItems;

  const inspDeata1 = incidentsOrderInfo && incidentsOrderInfo.data && incidentsOrderInfo.data.data
    && incidentsOrderInfo.data.data.length ? { data: [incidentsOrderInfo.data.data[0]] } : false;

  const inspDeata2 = incidentsOrderInfo && incidentsOrderInfo.data && incidentsOrderInfo.data.data
    && incidentsOrderInfo.data.data.length && incidentsOrderInfo.data.data.length > 1 ? { data: [incidentsOrderInfo.data.data[1]] } : woDetailData;

  const woData = selectedActions && selectedActions.includes('Assessment') ? inspDeata1 : inspDeata2;
  const incidentName = detailData ? detailData.person_name : '';

  const stateName = getDefaultNoValue(extractTextObject(detailData.state_id));

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

  return (
    <>
      <a id="dwnldLnk" aria-hidden="true" download={`Incident Report -${incidentName}.pdf`} className="d-none" />
      {!loading && detailData && (
        <Row className="mt-3 globalModal-header-cards">
          <Col sm="12" md="3" lg="3" xs="12" className="p-0">
            <Card className="h-100 no-border-radius border-left-0 border-top-0 border-bottom-0">
              <CardBody className="p-2">
                <Row className="m-0">
                  <Col sm="12" md="9" lg="9" xs="12" className="">
                    <p className="mb-0 font-weight-500">
                      REQUESTOR
                    </p>
                    <p className="mb-0 font-weight-700">
                      {getDefaultNoValue(detailData.person_name)}
                    </p>
                    <p className="m-0 font-weight-500 font-tiny">
                      <img src={envelopeIcon} alt="mail" height="13" width="13" className="mr-2" />
                      {getDefaultNoValue(detailData.email)}
                    </p>
                    {!isFITTracker && (
                    <p className="m-0 font-weight-500 font-tiny">
                      <img src={telephoneIcon} alt="telephone" height="13" width="13" className="mr-2" />
                      <span className={detailData.mobile && isMobNotShow ? 'hide-phone-number' : ''}>{getDefaultNoValue(detailData.mobile)}</span>
                    </p>
                    )}
                  </Col>
                  <Col sm="12" md="3" lg="3" xs="12" className="">
                    <img
                      aria-hidden="true"
                      src={messageGrey}
                      alt="asset"
                      className="mt-3 cursor-pointer"
                      width="30"
                      height="30"
                    />
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          <Col sm="12" md="3" lg="3" xs="12" className="p-0">
            {detailData.type_category && detailData.type_category === 'asset' && (
              <Card className="h-100 no-border-radius border-left-0 border-top-0 border-bottom-0">
                <CardBody className="p-2">
                  <Row className="m-0">
                    <Col sm="12" md="9" lg="9" xs="12" className="">
                      <p className="mb-0 font-weight-500 font-tiny">
                        LOCATION
                      </p>
                      <p className="mb-0 font-weight-700">
                        {getDefaultNoValue(extractTextObject(detailData.asset_id))}
                      </p>
                    </Col>
                    <Col sm="12" md="3" lg="3" xs="12" className="">
                      <img src={locationBlack} alt="asset" width="30" height="30" className="mt-3" />
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            )}
            {detailData.type_category && detailData.type_category === 'equipment' && (
              <Card className="h-100 no-border-radius border-left-0 border-top-0 border-bottom-0">
                <CardBody className="p-2">
                  <Row className="m-0">
                    <Col sm="12" md="9" lg="9" xs="12" className="">
                      <p className="mb-0 font-weight-500 font-tiny">
                        ASSET
                      </p>
                      <p className="mb-0 font-weight-700">
                        {getDefaultNoValue(extractTextObject(detailData.equipment_id))}
                      </p>
                      <p className="m-0 font-weight-500 font-tiny">
                        {getDefaultNoValue(extractTextObject(detailData.equipment_location_id))}
                      </p>
                    </Col>
                    <Col sm="12" md="3" lg="3" xs="12" className="">
                      <img src={assetDefault} alt="asset" width="30" height="30" className="mt-3" />
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            )}
          </Col>
          <Col sm="12" md="3" lg="3" xs="12" className="p-0">
            <Card className="h-100 no-border-radius border-left-0 border-top-0 border-bottom-0">
              <CardBody className="p-2">
                <Row className="m-0">
                  <Col sm="12" md="9" lg="9" xs="12" className="">
                    <p className="mb-0 font-weight-500 font-tiny">
                      STATUS
                    </p>
                    <p className={`mb-0 font-weight-700 ${isIncident ? 'text-info' : ''}`}>
                      {isIncident
                        ? getDefaultNoValue(getIncidentStatText(detailData.incident_state))
                        : getDefaultNoValue(detailData.state_id ? getTicketStatText(detailData.state_id[1]) : '')}
                    </p>
                    {detailData.state_id && detailData.state_id.length > 0 && (detailData.state_id[1] !== 'Staff Closed' && detailData.state_id[1] !== 'Customer Closed' && detailData.state_id[1] !== 'Closed') && (
                      <p className="m-0 p-0 font-weight-700 text-capital">
                        {getSLALabel(detailData.sla_status)}
                        {detailData.state_id[1] !== 'On Hold' && (
                          <p className="font-weight-400 m-0 p-0">
                            <span className="mr-1">
                              {' '}

                              <span className={getSLAStatusCheck(detailData.sla_end_date) === 'Time remains' ? 'text-success' : 'text-danger'}>
                                {getSLAStatusCheck(detailData.sla_end_date)}
                                {' '}
                                {getSLATime(detailData.state_id[1], detailData.sla_end_date)}
                              </span>
                            </span>
                            {' '}
                          </p>
                        )}
                      </p>
                    )}
                    {detailData.state_id && detailData.state_id.length > 0 && (detailData.state_id[1] === 'Staff Closed' || detailData.state_id[1] === 'Customer Closed' || detailData.state_id[1] === 'Closed') && (
                      <p className="m-0 p-0 font-weight-700 text-capital">
                        {getSLALabel(detailData.sla_status)}
                        <p className="font-weight-400 m-0 p-0">
                          {getSLAStatusCheckClose(detailData.sla_end_date, detailData.close_time) === ''
                            ? ''
                            : (
                              <span className="mr-1">
                                {' '}
                                {/* detailData.sla_status === 'SLA Elapsed' ? 'since' : '' */}

                                <span className={getSLAStatusCheckClose(detailData.sla_end_date, detailData.close_time) === 'Closed before' ? 'text-success' : 'text-danger'}>
                                  {getSLAStatusCheckClose(detailData.sla_end_date, detailData.close_time)}
                                </span>
                              </span>
                            )}
                          {getSLATimeClosed(detailData.sla_end_date, detailData.close_time)}
                          {' '}

                        </p>
                      </p>
                    )}
                    {!isIncident && isAgeShow && (
                      <p className="mb-0 font-weight-700 text-danger">
                        Age -
                        {' '}
                        {`${getAge(detailData.create_date, stateName === 'Staff Closed' || stateName === 'Customer Closed' || stateName === 'Closed' ? detailData.close_time : '')}`}
                      </p>
                    )}

                  </Col>
                  <Col sm="12" md="3" lg="3" xs="12" className="">
                    <img src={logsIcon} alt="asset" width="30" height="30" className="mt-3" />
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          <Col sm="12" md="3" lg="3" xs="12" className="p-0">
            <Card className="h-100 no-border-radius border-0">
              <CardBody className="p-2">
                <Row className="m-0">
                  <Col sm="12" md="9" lg="9" xs="12" className="">
                    <p className="mb-0 font-weight-500 font-tiny">
                      ACTIONS
                    </p>
                    <p className="mb-0 font-weight-700">
                      {isActionsExists ? (
                        <div className="mt-2">
                          <ButtonDropdown isOpen={changeLocationActionOpen} toggle={changeLocationActionToggle} className="actionDropdown">
                            <DropdownToggle
                              caret
                              className={selectedActionImage !== '' ? 'bg-white text-navy-blue text-left pb-05 pt-05 font-11 rounded-pill'
                                : 'pb-05 pt-05 font-11 rounded-pill btn-navyblue text-left'}
                            >
                              {selectedActionImage !== ''
                                ? (
                                  <img src={faIcons[`${selectedActionImage}ACTIVE`]} height="15" width="15" alt="ticketactions" className="mr-2" />
                                ) : ''}
                              <span className="font-weight-700">
                                {!selectedActionImage && (
                                  <FontAwesomeIcon size="sm" color="primary" className="mr-2 mt-1" icon={faCog} />
                                )}
                                {isIncident && selectedActions === 'Close Ticket' ? 'Close Incident' : selectedActions === 'Report Part A' && detailData.incident_state !== 'Report' ? 'Download Report' : selectedActions === 'Report Part A' && detailData.incident_state !== 'Report' ? 'Download Report' : selectedActions}
                                {printReportInfo && printReportInfo.loading && (
                                  <Spinner size="sm" animation="border" variant="primary" className="ml-1 mr-1" />
                                )}
                                <FontAwesomeIcon size="sm" color="primary" className="float-right ml-2 mt-1" icon={faChevronDown} />
                              </span>
                            </DropdownToggle>
                            <DropdownMenu>
                              {actionsList && actionsList.map((actions) => (
                                allowedOperations.includes(actionCodes[actions.displayname]) && (
                                  checkActionAllowed(actions.displayname) && (
                                    <DropdownItem
                                      id="switchAction"
                                      className="pl-2"
                                      key={actions.id}
                                      disabled={!checkActionAllowedDisabled(actions.displayname)}
                                      onClick={() => switchActionItem(actions)}
                                    >
                                      <img src={faIcons[actions.name]} alt="ticketactions" className="mr-2" height="15" width="15" />
                                      {isIncident && actions.displayname === 'Close Ticket' ? 'Close Incident' : actions.displayname === 'Report Part A' && detailData.incident_state !== 'Report' ? 'Download Report' : actions.displayname === 'Report Part B' && detailData.incident_state !== 'Report' ? 'Download Report' : actions.displayname}
                                    </DropdownItem>
                                  ))))}
                            </DropdownMenu>
                          </ButtonDropdown>
                        </div>
                      ) : (
                        <ErrorContent errorTxt="No data found." />
                      )}
                    </p>
                  </Col>
                  <Col sm="12" md="3" lg="3" xs="12" className="">
                    <img src={handPointerBlack} alt="asset" width="30" height="30" className="mt-3" />
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          {reassignModal && (
            <ReassignTicket
              atFinish={() => {
                showReassignModal(false); cancelReassign();
                setSelectedActions(defaultActionText); setSelectedActionImage('');
              }}
              ticketDetail={ticketDetail}
              reassignModal
              isIncident={isIncident}
            />
          )}
          {escalateModal && (
            <EscalateTicket
              atFinish={() => {
                showEscalateModal(false); cancelEscalate();
                setSelectedActions(defaultActionText); setSelectedActionImage('');
              }}
              ticketDetail={ticketDetail}
              escalateModal
              isIncident={isIncident}
            />
          )}
          {closeModal && (
            <CloseTicket
              atFinish={() => {
                showCloseModal(false); cancelEscalate(); cancelReassign(); cancelClose();
                setSelectedActions(defaultActionText); setSelectedActionImage('');
              }}
              ticketDetail={ticketDetail}
              closeModal
              isIncident={isIncident}
              woCloseInfo={stateChangeInfo}
            />
          )}
          {messageModal && (
            <SendMessage
              atFinish={() => {
                showMessageModal(false); cancelMessage();
                setSelectedActions(defaultActionText); setSelectedActionImage('');
              }}
              atCancel={() => {
                showMessageModal(false); setSelectedActions(defaultActionText); setSelectedActionImage('');
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

          <Drawer
            title=""
            closable={false}
            className="drawer-bg-lightblue"
            width={1250}
            visible={addLink}
          >
            <DrawerHeader
              title={workorderDetails && (workorderDetails.data && workorderDetails.data.length > 0)
                ? `${'Work Order'}${' - '}${workorderDetails.data[0].name}` : 'Work Order'}
              imagePath={false}
              isEditable={false}
              closeDrawer={() => onViewReset()}
              onEdit={false}
              onPrev={false}
              onNext={false}
            />
            <OrderDetail setViewModal={setAddLink} />
          </Drawer>
        </Row>
      )}
      {pauseActionModal && (
        <PauseWorkorder
          atFinish={() => {
            showPauseActionModal(false);
            setSelectedActions(defaultActionText);
            setSelectedActionImage('');
          }}
          actionText={actionText}
          actionCode={actionCode}
          details={workorderDetails}
          pauseActionModal
          isTicket
          tId={ticketDetail && ticketDetail.data && ticketDetail.data.length > 0 ? ticketDetail.data[0].id : false}
          wId={ticketDetail && ticketDetail.data && ticketDetail.data.length > 0 && ticketDetail.data[0].mro_order_id && ticketDetail.data[0].mro_order_id.length ? ticketDetail.data[0].mro_order_id[0] : false}
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
          tId={ticketDetail && ticketDetail.data && ticketDetail.data.length > 0 ? ticketDetail.data[0].id : false}
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
          tId={ticketDetail && ticketDetail.data && ticketDetail.data.length > 0 ? ticketDetail.data[0].id : false}
        />
      )}
    </>
  );
};

BasicInfo.propTypes = {
  isIncident: PropTypes.bool,
  setViewModal: PropTypes.func.isRequired,
};
BasicInfo.defaultProps = {
  isIncident: false,
};

export default BasicInfo;
