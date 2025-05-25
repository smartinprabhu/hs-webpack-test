/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable radix */
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect, useMemo } from 'react';
import { Box } from '@mui/system';
import {
  IconButton, Menu,
  Button,
} from '@mui/material';
import { BsThreeDotsVertical } from 'react-icons/bs';
import MenuItem from '@mui/material/MenuItem';
import moment from 'moment-timezone';
import {
  Progress,
  Spinner,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileExcel, faEnvelope, faCheckCircle, faSave, faTimesCircle,
  faFile, faEye,
} from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { Tooltip } from 'antd';
import {
  getDefaultNoValue, numToFloatView, extractNameObject,
  getColumnArrayByField,
  getArrayFromValuesMultByIdIn,
  isJsonString,
  getJsonString,
  exportExcelTableToXlsx,
} from '../../util/appUtils';
import { newpercalculate } from '../../util/staticFunctions';

import {
  cjStatusJson,
} from '../../commonComponents/utils/util';

import customData from '../data/customData.json';
import Action from './actionItems/actions';
import DetailViewHeader from '../../commonComponents/detailViewHeader';
import {
  resetSlaAuditActionInfo, getSlaAuditDetail,
  resetUpdateSlaAuditStage,
  getSLAConfig,
  getSlaAuditPerformaceDetails,
} from '../auditService';
import ChecklistExport from './checklistExport';
import StageComplete from './actionItems/stageComplete';

const appModels = require('../../util/appModels').default;

const faIcons = {
  CANCEL: faTimesCircle,
  SUBMIT: faEnvelope,
  APPROVE: faCheckCircle,
  DRAFT: faSave,
  REVIEW: faFile,
  PREVIEW: faEye,
  EXPORT: faFileExcel,
};

const AuditDetailInfo = (props) => {
  const {
    detailData, savedRecords, questionGroupsGlobal, offset,
  } = props;
  const detail = detailData && (detailData.data && detailData.data.length > 0) ? detailData.data[0] : '';
  const dispatch = useDispatch();
  const defaultActionText = 'SLA Audit Actions';
  const [changeLocationActionOpen, setLocationActionOpen] = useState(false);
  const [actionModal, showActionModal] = useState(false);
  const [actionMethod, setActionMethod] = useState(false);
  const [actionButton, setActionButton] = useState(false);
  const [actionName, setActionName] = useState(false);
  const [actionMsg, setActionMsg] = useState(false);
  const [statusName, setStatusName] = useState(false);
  const [stageModal, showStageModal] = useState(false);
  const [selectedActions, setSelectedActions] = useState(defaultActionText);
  const [selectedActionImage, setSelectedActionImage] = useState('');
  const changeLocationActionToggle = () => setLocationActionOpen(!changeLocationActionOpen);
  const [anchorEl, setAnchorEl] = useState(null);

  const [performanceLogs, setPerformanceLogs] = useState([]);

  const { userInfo } = useSelector((state) => state.user);

  const {
    slaAuditSummary, slaAuditInfo, slaAuditConfig,
  } = useSelector((state) => state.slaAudit);

  const hasTarget = slaAuditConfig && slaAuditConfig.data && slaAuditConfig.data.length && slaAuditConfig.data[0].has_target;

  const hasSecondApprove = slaAuditConfig && slaAuditConfig.data && slaAuditConfig.data.length && slaAuditConfig.data[0].is_second_level_approval;

  const viewData = detailData && (detailData.data && detailData.data.length > 0) ? detailData.data[0] : false;

  useEffect(() => {
    if (viewData) {
      dispatch(getSlaAuditPerformaceDetails(viewData.id, appModels.SLAAUDITPERFORMANCELOGS));
    }
  }, [detailData]);

  const exportTableToExcel = (tableID, fileTitle = '') => {
    try {
      setTimeout(() => {
        exportExcelTableToXlsx(tableID, fileTitle)
      }, 1000);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  };

  const switchActionItem = (action) => {
    if (action.displayname !== 'Export SLA Items') {
      setSelectedActions(action.displayname);
      setActionMethod(action.method);
      setActionButton(action.buttonName);
      setActionMsg(action.message);
      setStatusName(action.statusName);
      setActionName(action.name);
      setSelectedActionImage(action.name);
      setAnchorEl(null);
      dispatch(resetSlaAuditActionInfo());
      showActionModal(true);
    } else {
      exportTableToExcel('SLA_Tracker_Checklists_Export', viewData && viewData.name ? viewData.name : '');
      setAnchorEl(null);
    }
  };

  const closeAction = () => {
    setAnchorEl(null);
    showActionModal(false);
    setSelectedActions(defaultActionText);
    setSelectedActionImage('');
    setActionMethod('');
    setActionButton('');
    setStatusName('');
    setActionMsg('');
    if (viewData) {
      dispatch(getSlaAuditDetail(viewData.id, appModels.SLAAUDIT));
    }
  };

  const closeActionCancel = () => {
    setAnchorEl(null);
    showActionModal(false);
    setSelectedActions(defaultActionText);
    setSelectedActionImage('');
    setActionMethod('');
    setActionButton('');
    setStatusName('');
    setActionMsg('');
  };

  const closeStageModal = () => {
    showStageModal(false);
    dispatch(resetUpdateSlaAuditStage());
  };

  const isMultipleEvaluation = hasTarget && !!(slaAuditConfig && slaAuditConfig.data && slaAuditConfig.data.length && slaAuditConfig.data[0].is_multiple_evaluation);

  const stages = useMemo(() => (isMultipleEvaluation && viewData && viewData.stage_ids && viewData.stage_ids.length ? viewData.stage_ids : []), [viewData, slaAuditConfig]);

  const getCurrentStage = () => {
    if (!isMultipleEvaluation || !Array.isArray(stages) || stages.length === 0) {
      return false;
    }

    const seqData = [...stages].sort((a, b) => a.sequence - b.sequence); // avoid mutating original
    const pendingStage = seqData.find((item) => item.state === 'Pending');

    if (!pendingStage) {
      return false;
    }

    return pendingStage.stage_id && pendingStage.stage_id.name ? pendingStage.stage_id.name : '';
  };

  const isFinalStage = () => {
    if (!isMultipleEvaluation || !Array.isArray(stages) || stages.length === 0) {
      return false;
    }

    const sortedStages = [...stages].sort((a, b) => b.sequence - a.sequence); // descending order
    const finalStage = sortedStages[0];
    const currentStage = stages.find((s) => s.state === 'Pending');

    return currentStage?.stage_id?.id === finalStage?.stage_id?.id;
  };

  const getCurrentStageData = () => {
    if (!isMultipleEvaluation || !Array.isArray(stages) || stages.length === 0) {
      return false;
    }

    const seqData = [...stages].sort((a, b) => a.sequence - b.sequence); // avoid mutating original
    const pendingStage = seqData.find((item) => item.state === 'Pending');

    if (!pendingStage) {
      return false;
    }

    return pendingStage;
  };

  function isReviewUser() {
    let res = false;
    const userRoleId = userInfo && userInfo.data && userInfo.data.user_role_id ? userInfo.data.user_role_id : false;
    const data = viewData.checker_ids && viewData.checker_ids.length ? viewData.checker_ids.filter((item) => item.id === userRoleId) : [];
    if (data && data.length) {
      res = true;
    }
    return res;
  }

  function isStageUser() {
    let res = false;
    const userRoleId = userInfo && userInfo.data && userInfo.data.user_role_id ? userInfo.data.user_role_id : false;
    const stageData = getCurrentStageData().stage_id && getCurrentStageData().stage_id.evaluators_ids ? getCurrentStageData().stage_id.evaluators_ids : [];
    const data = stageData && stageData.length ? stageData.filter((item) => item.role_id && (item.role_id.id === userRoleId)) : [];
    if (data && data.length) {
      res = true;
    }
    return res;
  }

  function isApproveUser() {
    let res = false;
    const userRoleId = userInfo && userInfo.data && userInfo.data.user_role_id ? userInfo.data.user_role_id : false;
    const data = viewData.approver_ids && viewData.approver_ids.length ? viewData.approver_ids.filter((item) => item.id === userRoleId) : [];
    if (data && data.length) {
      res = true;
    }
    return res;
  }

  function isApproveUser2() {
    let res = false;
    const userRoleId = userInfo && userInfo.data && userInfo.data.user_role_id ? userInfo.data.user_role_id : false;
    const data = viewData.second_approver_ids && viewData.second_approver_ids.length ? viewData.second_approver_ids.filter((item) => item.id === userRoleId) : [];
    if (data && data.length) {
      res = true;
    }
    return res;
  }

  const loading = detailData && detailData.loading;

  const rangeData = viewData && viewData.sla_audit_lines && viewData.sla_audit_lines.length ? viewData.sla_audit_lines.filter((item) => item.answer && item.mro_activity_id.type !== 'Computed') : false;

  function getRangeData() {
    let res = 0;
    const assetDataList = viewData && viewData.sla_audit_lines && viewData.sla_audit_lines.length ? viewData.sla_audit_lines.filter((item) => item.mro_activity_id.type !== 'Computed') : [];

    const unApplicableData = performanceLogs ? performanceLogs.filter((item) => item.is_notapplicable) : [];
    const unApplicableQtnGrps = unApplicableData && unApplicableData.length ? getColumnArrayByField(unApplicableData, 'question_group_id', 'id') : [];
    const qtnCatData = viewData && viewData.sla_audit_lines ? viewData.sla_audit_lines.filter((item) => item.mro_activity_id.type !== 'Computed' && item.answer) : [];
    const unApplicableQtns = qtnCatData && qtnCatData.length && unApplicableQtnGrps && unApplicableQtnGrps.length ? getArrayFromValuesMultByIdIn(qtnCatData, unApplicableQtnGrps, 'question_group_id', 'id') : [];
    const unApplicableCount = unApplicableQtns && unApplicableQtns.length;
    const assetDataAnsList = assetDataList.filter((item) => item.answer);
    res = assetDataAnsList && assetDataAnsList.length ? assetDataAnsList.length - unApplicableCount : 0;

    return res;
  }

  const sections = viewData && viewData.sla_category_logs ? viewData.sla_category_logs : [];

  useEffect(() => {
    if (viewData && viewData.company_id && viewData.company_id.id) {
      dispatch(getSLAConfig(viewData.company_id.id, appModels.SLAAUDITCONFIG));
    }
  }, [viewData && viewData.company_id && viewData.company_id.id]);

  useEffect(() => {
    if (slaAuditSummary && slaAuditSummary.data) {
      setPerformanceLogs(slaAuditSummary.data);
    } else if (slaAuditSummary && slaAuditSummary.err) {
      setPerformanceLogs([]);
    }
  }, [slaAuditSummary]);

  const isSum = !!(hasTarget && viewData && viewData.sla_json_data && isJsonString(viewData.sla_json_data) && getJsonString(viewData.sla_json_data)
  && getJsonString(viewData.sla_json_data).data_show_type && getJsonString(viewData.sla_json_data).data_show_type === 'sum');

  function getAvgTotal(field) {
    let count = 0;
    for (let i = 0; i < sections.length; i += 1) {
      count += sections[i][field];
    }
    return count;
  }

  function getTotalQtnsCount() {
    let res = 0;
    const totaldata = viewData && viewData.sla_audit_lines && viewData.sla_audit_lines.length ? viewData.sla_audit_lines.filter((item) => item.mro_activity_id.type !== 'Computed') : [];
    const unApplicableData = performanceLogs ? performanceLogs.filter((item) => item.is_notapplicable) : [];
    const unApplicableQtnGrps = unApplicableData && unApplicableData.length ? getColumnArrayByField(unApplicableData, 'question_group_id', 'id') : [];
    const unApplicableQtns = unApplicableQtnGrps && unApplicableQtnGrps.length ? getArrayFromValuesMultByIdIn(totaldata, unApplicableQtnGrps, 'question_group_id', 'id') : [];
    const unApplicableCount = unApplicableQtns && unApplicableQtns.length;
    res = totaldata && totaldata.length ? totaldata.length - unApplicableCount : 0;
    return res;
  }

  const checkActionAllowedV2 = (actionName) => {
    let allowed = true;
    const vrState = detailData && detailData.data ? detailData.data[0].state : '';
    const isCoverage = detailData && detailData.data && detailData.data.length && detailData.data[0].sla_audit_lines && detailData.data[0].sla_audit_lines.length > 0;
    if (actionName === 'Cancel SLA Audit') {
      if (vrState === 'Cancelled' || vrState === 'Approved') {
        allowed = false;
      }
      if (vrState === 'Submitted' && !isReviewUser()) {
        allowed = false;
      }
      if (vrState === 'Reviewed' && !isApproveUser()) {
        allowed = false;
      }
    }
    if (actionName === 'Set to Draft') {
      if (vrState === 'Cancelled' || vrState === 'Draft') {
        allowed = false;
      }
      if (vrState === 'Submitted' && !isReviewUser()) {
        allowed = false;
      }
      if (vrState === 'Reviewed' && !isApproveUser()) {
        allowed = false;
      }
      if (vrState === 'Approved' && !(isApproveUser() || isApproveUser2())) {
        allowed = false;
      }
    }
    if (actionName === 'Preview') {
      if (vrState !== 'Draft' || hasTarget) {
        allowed = false;
      }
    }
    if (actionName === 'Submit for Review') {
      if (vrState !== 'Draft' || (isMultipleEvaluation && getCurrentStage())) {
        allowed = false;
      }
    }
    if (actionName === 'Review & Submit for Approval') {
      if (vrState !== 'Submitted' || !isReviewUser()) {
        allowed = false;
      }
    }
    if (actionName === 'Approve') {
      if (vrState !== 'Reviewed' || !isApproveUser() || (viewData.second_approved_by)) {
        allowed = false;
      }
      if (isApproveUser2() && vrState === 'Approved' && !(viewData.second_approved_by)) {
        allowed = true;
      }
    }
    if (actionName === 'Export SLA Items') {
      if (!isCoverage) {
        allowed = false;
      }
    }
    return allowed;
  };

  const checkActionAllowed = (actionName) => {
    let allowed = true;
    const vrState = detailData && detailData.data ? detailData.data[0].state : '';
    const isCoverage = detailData && detailData.data && detailData.data.length && detailData.data[0].sla_audit_lines && detailData.data[0].sla_audit_lines.length > 0;
    if (actionName === 'Cancel SLA Audit') {
      if (vrState === 'Cancelled' || vrState === 'Approved') {
        allowed = false;
      }
      if (vrState === 'Submitted' && !isReviewUser()) {
        allowed = false;
      }
      if (vrState === 'Reviewed' && !isApproveUser()) {
        allowed = false;
      }
    }
    if (actionName === 'Set to Draft') {
      if (vrState === 'Cancelled' || vrState === 'Draft') {
        allowed = false;
      }
      if (vrState === 'Submitted' && !isReviewUser()) {
        allowed = false;
      }
      if (vrState === 'Reviewed' && !isApproveUser()) {
        allowed = false;
      }
      if (vrState === 'Approved' && !isApproveUser()) {
        allowed = false;
      }
    }
    if (actionName === 'Preview') {
      if (vrState !== 'Draft' || hasTarget) {
        allowed = false;
      }
    }
    if (actionName === 'Submit for Review') {
      if (vrState !== 'Draft' || (isMultipleEvaluation && getCurrentStage())) {
        allowed = false;
      }
    }
    if (actionName === 'Review & Submit for Approval') {
      if (vrState !== 'Submitted' || !isReviewUser()) {
        allowed = false;
      }
    }
    if (actionName === 'Approve') {
      if (vrState !== 'Reviewed' || !isApproveUser()) {
        allowed = false;
      }
    }
    if (actionName === 'Export SLA Items') {
      if (!isCoverage) {
        allowed = false;
      }
    }
    return allowed;
  };

  const getProgressColor = (percentage) => {
    let color = 'secondary';
    if (percentage >= 1 && percentage < 30) {
      color = 'danger';
    }
    if (percentage >= 30 && percentage < 50) {
      color = 'primary';
    }
    if (percentage >= 50 && percentage < 70) {
      color = 'warning';
    }
    if (percentage >= 70 && percentage < 90) {
      color = 'info';
    }
    if (percentage >= 90) {
      color = 'success';
    }
    return color;
  };

  function getRangeScore(value, ranges) {
    let score = '';
    if (ranges && ranges.length) {
      const rangesData = ranges.filter((item) => parseFloat(item.min) <= parseFloat(value) && parseFloat(item.max) >= parseFloat(value));
      if (rangesData && rangesData.length) {
        score = rangesData[0].legend;
      }
    }

    return score;
  }
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const checkConsumptionStatus = (val, hasSecondApprovee, isSecondApproved) => (
    <Box>
      {cjStatusJson.map(
        (status) => val === status.status && (
          <Box
            sx={{
              backgroundColor: status.status === 'Approved' && hasSecondApprovee && !isSecondApproved ? '#F9F397' : status.backgroundColor,
              padding: '4px 8px 4px 8px',
              border: 'none',
              borderRadius: '4px',
              color: status.status === 'Approved' && hasSecondApprovee && !isSecondApproved ? '#f7a20e' : status.color,
              fontFamily: 'Suisse Intl',
            }}
          >
            {hasSecondApprovee && status.status === 'Approved' && (
            <Tooltip title={isSecondApproved ? 'Second Level Approved' : 'First Level Approved'}>
              {val}
            </Tooltip>
            )}
            {hasSecondApprovee && status.status !== 'Approved' && (
              val
            )}
            {!hasSecondApprovee && status.status === 'Approved' && (
            <Tooltip title="Approved (Second Level Approval Not Required)">
              {val}
            </Tooltip>
            )}
            {!hasSecondApprovee && status.status !== 'Approved' && (
              val
            )}
          </Box>
        ),
      )}
    </Box>
  );

  const percentage = newpercalculate(getTotalQtnsCount(), getRangeData());

  const isCoverage1 = viewData && viewData.sla_audit_lines && viewData.sla_audit_lines.length > 0;
  const isCoverage = isMultipleEvaluation ? isCoverage1 && (isFinalStage() || !getCurrentStage()) : isCoverage1;


  return (
    <>
      {viewData && (
        <DetailViewHeader
          mainHeader={getDefaultNoValue(extractNameObject(viewData.audit_template_id, 'name'))}
          status={
            viewData.state
              ? checkConsumptionStatus(viewData.state, viewData.is_second_level_approval, (viewData.second_approved_by))
              : '-'
          }
          subHeader={(
            <>
              {viewData.created_on
                && userInfo.data
                && userInfo.data.timezone
                ? moment
                  .utc(viewData.created_on)
                  .local()
                  .tz(userInfo.data.timezone)
                  .format('yyyy MMM Do, hh:mm A')
                : '-'}
              {' '}
              {getDefaultNoValue(extractNameObject(detail.company_id, 'name'))}
            </>
          )}
          mainTwoHeader={isCoverage && ([
            {
              header: 'COVERAGE',
              value:
  <p className="mb-0 display-flex">
    <span className="mb-0 font-weight-800 font-14">
      {getRangeData()}
    </span>
    <span className="mb-0 font-weight-500 mr-3">
      {`/ ${getTotalQtnsCount()}`}
    </span>
    <Progress value={percentage} className="w-50 mt-1" color={getProgressColor(percentage)}>
      {percentage}
      {' '}
      %
    </Progress>
  </p>,
            },
          ])}
          mainThreeHeader={[
            {
              header: (hasTarget && (detail.state === 'Submitted' || detail.state === 'Reviewed' || detail.state === 'Approved')) ? 'OVERALL SCORE' : '',
              value:
  <p className="mb-0">
    {isSum ? numToFloatView(getAvgTotal(isSum ? 'achieved_score_sum' : 'achieved_score')) : numToFloatView(getAvgTotal(isSum ? 'achieved_score_sum' : 'achieved_score') / sections.length)}
    {' '}
    /
    {' '}
    {isSum ? numToFloatView(getAvgTotal('target')) : numToFloatView(getAvgTotal('target') / sections.length)}
    {' '}
    {((isSum && getRangeScore(getAvgTotal(isSum ? 'achieved_score_sum' : 'achieved_score'), detail.sla_metric_id && detail.sla_metric_id.scale_line_ids ? detail.sla_metric_id.scale_line_ids : [])) || (getRangeScore((getAvgTotal(isSum ? 'achieved_score_sum' : 'achieved_score') / sections.length), detail.sla_metric_id && detail.sla_metric_id.scale_line_ids ? detail.sla_metric_id.scale_line_ids : []))) && (
      <>
        {isSum
          ? (
            <span>
              {' '}
              (
              {getRangeScore(getAvgTotal(isSum ? 'achieved_score_sum' : 'achieved_score'), detail.sla_metric_id && detail.sla_metric_id.scale_line_ids ? detail.sla_metric_id.scale_line_ids : [])}
              )
              {' '}
            </span>
          )
          : (
            <span>
              {' '}
              (
              {getRangeScore((getAvgTotal(isSum ? 'achieved_score_sum' : 'achieved_score') / sections.length), detail.sla_metric_id && detail.sla_metric_id.scale_line_ids ? detail.sla_metric_id.scale_line_ids : [])}
              )
              {' '}
            </span>
          )}
      </>
    )}
  </p>,
            },
            {
              header: isMultipleEvaluation && getCurrentStage() ? 'STAGE' : false,
              value:
  <p className="mb-0 display-flex">
    {getCurrentStage()}
  </p>,
            },
          ]}
          actionComponent={(
            <Box>

              {isMultipleEvaluation && getCurrentStage() && isStageUser() && (
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
                onClick={() => { showStageModal(true); dispatch(resetUpdateSlaAuditStage()); }}
              >
                Complete
                {' '}
                {getCurrentStage()}
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

                {hasSecondApprove && customData
                  && customData.actionItems.map(
                    (actions) => checkActionAllowedV2(
                      actions.displayname,
                      slaAuditInfo,
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
                      disabled={slaAuditSummary.loading && actions.displayname === 'Export SLA Items'}
                      onClick={() => switchActionItem(actions)}
                    >
                      <FontAwesomeIcon
                        className="mr-2"
                        icon={faIcons[actions.name]}
                      />
                      {actions.displayname}
                      {slaAuditSummary.loading && actions.displayname === 'Export SLA Items' && (
                      <Spinner size="sm" />
                      )}
                    </MenuItem>
                    ),
                  )}
                {!hasSecondApprove && customData
                  && customData.actionItems.map(
                    (actions) => checkActionAllowed(
                      actions.displayname,
                      slaAuditInfo,
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
                      disabled={slaAuditSummary.loading && actions.displayname === 'Export SLA Items'}
                      onClick={() => switchActionItem(actions)}
                    >
                      <FontAwesomeIcon
                        className="mr-2"
                        icon={faIcons[actions.name]}
                      />
                      {actions.displayname}
                      {slaAuditSummary.loading && actions.displayname === 'Export SLA Items' && (
                      <Spinner size="sm" />
                      )}
                    </MenuItem>
                    ),
                  )}
              </Menu>
            </Box>
          )}
        />
      )}

      {actionModal && (
        <Action
          atFinish={() => closeAction()}
          atCancel={() => closeActionCancel()}
          detailData={viewData}
          actionModal={actionModal}
          actionButton={actionButton}
          actionName={actionName}
          actionMsg={actionMsg}
          offset={offset}
          actionMethod={actionMethod}
          displayName={selectedActions}
          statusName={statusName}
          message={selectedActionImage}
          savedRecords={savedRecords}
          questionGroupsGlobal={questionGroupsGlobal}
          currentStage={getCurrentStageData()}
        />
      )}
      {stageModal && (
      <StageComplete
        atFinish={() => closeStageModal()}
        atCancel={() => closeStageModal()}
        detailData={viewData}
        actionModal={stageModal}
        offset={offset}
        currentStage={getCurrentStageData()}
        savedRecords={savedRecords}
        questionGroupsGlobal={questionGroupsGlobal}
        currentStageName={getCurrentStage()}
      />
      )}

      <ChecklistExport isMultipleEvaluation={isMultipleEvaluation} detailData={detailData} />
    </>

  );
};

AuditDetailInfo.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
  ]).isRequired,
  offset: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.bool,
  ]).isRequired,
};

export default AuditDetailInfo;
