/* eslint-disable max-len */
/* eslint-disable radix */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardBody,
  Col,
  Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import {
  faEnvelope, faTimesCircle, faCheckCircle, faSave, faFile, faEye,
} from '@fortawesome/free-solid-svg-icons';
import DOMPurify from 'dompurify';
import {
  Box, Button, TextField, Dialog, DialogContent, DialogActions, DialogContentText,
} from '@mui/material';

import survey from '@images/icons/workPermitBlue.svg';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';
import DialogHeader from '../../../commonComponents/dialogHeader';

import {
  getDefaultNoValue, extractNameObject,
  getColumnArrayByField,
  getArrayFromValuesMultByIdIn,
  queryGeneratorWithUtc,
  getAllowedCompanies,
  getComputedValidAnswer,
} from '../../../util/appUtils';
import {
  getSlaStateLabel,
} from '../../utils/utils';
import {
  getSlaAuditAction, resetSlaAuditActionInfo, updateSlaAudit,
  getSlaAuditList, getSlaSummaryDetailsInfo,
} from '../../auditService';
import ScoreCard from '../scorecard';

const appModels = require('../../../util/appModels').default;

const faIcons = {
  CANCEL: faTimesCircle,
  SUBMIT: faEnvelope,
  APPROVE: faCheckCircle,
  DRAFT: faSave,
  REVIEW: faFile,
  PREVIEW: faEye,
};

const Actions = (props) => {
  const {
    detailData, currentStage, questionGroupsGlobal, savedRecords, statusName, offset, actionModal, atFinish, atCancel, actionMethod, displayName, actionButton, actionMsg, message, actionName,
  } = props;
  const dispatch = useDispatch();
  const [modal, setModal] = useState(actionModal);
  const [messageTicket, setMessageTicket] = useState('');
  const [timeoutLoading, setTimeoutLoading] = useState(false);

  const [savedChecklists, setSavedChecklists] = useState(savedRecords);

  const {
    slaAuditAction, updateSlaAuditInfo, slaAuditSummary, slaAuditFilters, slaSummaryDetails, slaAuditConfig,
  } = useSelector((state) => state.slaAudit);

  const summaryDetails = slaSummaryDetails && slaSummaryDetails.data && slaSummaryDetails.data.length ? slaSummaryDetails.data[0] : false;

  const hasTarget = slaAuditConfig && slaAuditConfig.data && slaAuditConfig.data.length && slaAuditConfig.data[0].has_target;

  const isMultipleEvaluation = hasTarget && !!(slaAuditConfig && slaAuditConfig.data && slaAuditConfig.data.length && slaAuditConfig.data[0].is_multiple_evaluation);

  const hasSecondApprove = slaAuditConfig && slaAuditConfig.data && slaAuditConfig.data.length && slaAuditConfig.data[0].is_second_level_approval;

  const {
    sortedValue,
  } = useSelector((state) => state.equipment);

  const filledChecklist = detailData && detailData.sla_audit_lines && detailData.sla_audit_lines.length > 0 ? detailData.sla_audit_lines : [];

  const filledAnsChecklist = filledChecklist.filter((item) => item.answer);

  const filledAnsChecklistNew = filledAnsChecklist.map((cl) => ({
    id: cl.id,
    achieved_score: cl.achieved_score,
    answer: cl.answer,
    target: cl.target ? parseFloat(cl.target) : 0.00,
  }));

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);

  const onMessageChange = (e) => {
    setMessageTicket(e.target.value);
  };

  useEffect(() => {
    setSavedChecklists(savedRecords);
  }, [savedRecords]);

  function getPendingQtns() {
    let res = false;
    const datass = savedChecklists.filter((item) => item.is_update === 'start');
    if (datass && datass.length) {
      res = true;
    }
    return res;
  }

  const extractFilledAnswers = (questionGroups, currentStages) => {
    if (!questionGroups || !questionGroups.length || !currentStages?.evaluators_ids) return [];

    const allowedIds = currentStages.evaluators_ids.map((e) => e.id);

    return questionGroups.flatMap((item) => item.evaluations_ids.map((ev) => ({
      id: item.id,
      achieved_score: item.achieved_score,
      answer: item.answer,
      evaluations_id: ev.id,
      evId: ev.evaluator_id.id,
      measured_value: ev.measured_value,
    }))).filter((item) => allowedIds.includes(item.evId));
  };

  function saveRecordbyTimeStage() {
    let newData = [];
    const trackerLines = [];

    const filledChecklistStage = questionGroupsGlobal?.length ? questionGroupsGlobal : [];
    const filledAnsChecklistStageNew = extractFilledAnswers(filledChecklistStage, currentStage);

    if (filledAnsChecklistStageNew && filledAnsChecklistStageNew.length) {
      for (let i = 0; i < filledAnsChecklistStageNew.length; i += 1) {
        newData = [1, filledAnsChecklistStageNew[i].evaluations_id, { audit_line: { id: filledAnsChecklistStageNew[i].id, answer: filledAnsChecklistStageNew[i].answer ? filledAnsChecklistStageNew[i].answer.toString() : '', achieved_score: getComputedValidAnswer(filledAnsChecklistStageNew[i].achieved_score) }, measured_value: filledAnsChecklistStageNew[i].measured_value ? parseFloat(filledAnsChecklistStageNew[i].measured_value) : 0.00 }];
        trackerLines.push(newData);
      }
      const payloadValues = {
        lines: trackerLines,
      };
      dispatch(updateSlaAudit(detailData.id, 'hx.sla.kpi_audit_line_evaluations', payloadValues, 'checklist'));
    }
  }

  function saveRecordbyTime() {
    let newData = [];
    const trackerLines = [];
    if (filledAnsChecklistNew && filledAnsChecklistNew.length) {
      for (let i = 0; i < filledAnsChecklistNew.length; i += 1) {
        newData = [1, filledAnsChecklistNew[i].id, { answer: filledAnsChecklistNew[i].answer, achieved_score: getComputedValidAnswer(filledAnsChecklistNew[i].achieved_score), target: filledAnsChecklistNew[i].target }];
        trackerLines.push(newData);
      }
      const payloadValues = {
        lines: trackerLines,
      };
      dispatch(updateSlaAudit(detailData.id, 'hx.sla.kpi_audit_line', payloadValues, 'checklist'));
    }
  }

  useEffect(() => {
    if (displayName === 'Submit for Review') {
      if (isMultipleEvaluation && currentStage) {
        saveRecordbyTimeStage();
      } else {
        saveRecordbyTime();
      }
    }
  }, []);

  useEffect(() => {
    if (slaAuditAction && slaAuditAction.data && slaAuditAction.data.status && displayName === 'Preview') {
      dispatch(getSlaSummaryDetailsInfo(detailData.id, appModels.SLAAUDIT, 'nosla'));
    }
  }, [slaAuditAction]);

  /* useEffect(() => {
    if (displayName === 'Submit for Review' && !hasTarget) {
      dispatch(getSlaSummaryDetailsInfo(detailData.id, appModels.SLAAUDIT, 'nosla'));
    }
  }, [displayName]); */

  function getRangeScore(value, ranges) {
    let score = 0;
    if (ranges && ranges.length) {
      const rangesData = ranges.filter((item) => parseFloat(parseFloat(item.min).toFixed(2)) <= parseFloat(parseFloat(value).toFixed(2)) && parseFloat((parseFloat(item.max).toFixed(2))) >= parseFloat((parseFloat(value).toFixed(2))));
      if (rangesData && rangesData.length) {
        score = rangesData[0].score;
      }
    }

    return score;
  }

  function getManagementPenaltyAmt(value, weightage, penaltyPer) {
    let count = 0;
    if (value && weightage) {
      const percount = (value * weightage) / 100;
      count = (percount * penaltyPer) / 100;
    }
    return count;
  }

  const sections = summaryDetails && summaryDetails.sla_category_logs ? summaryDetails.sla_category_logs : [];

  function getLogs() {
    let newData = [];
    const ansLines = [];

    if (sections && sections.length > 0) {
      for (let i = 0; i < sections.length; i += 1) {
        newData = [1, sections[i].id, {
          penatly: getRangeScore(sections[i].achieved_score, sections[i].sla_penalty_metric_id && sections[i].sla_penalty_metric_id.scale_line_ids ? sections[i].sla_penalty_metric_id.scale_line_ids : []),
          penalty_amount: parseFloat(getManagementPenaltyAmt(summaryDetails.has_targe_management_fee, sections[i].weightage, getRangeScore(sections[i].achieved_score, sections[i].sla_penalty_metric_id && sections[i].sla_penalty_metric_id.scale_line_ids ? sections[i].sla_penalty_metric_id.scale_line_ids : []))),
        }];
        ansLines.push(newData);
      }
    }
    return ansLines;
  }

  function getAvgTotalAmt() {
    let count = 0.00;
    for (let i = 0; i < sections.length; i += 1) {
      count += getManagementPenaltyAmt(summaryDetails.has_targe_management_fee, sections[i].weightage, getRangeScore(sections[i].achieved_score, sections[i].sla_penalty_metric_id && sections[i].sla_penalty_metric_id.scale_line_ids ? sections[i].sla_penalty_metric_id.scale_line_ids : []));
    }
    return parseFloat(count).toFixed(2);
  }

  function getManagementFeeRiskNoTarget() {
    let count = 0;
    const penaltyAmt = parseFloat(getAvgTotalAmt());
    const mFee = summaryDetails.has_targe_management_fee;
    if (penaltyAmt && mFee) {
      const pa = parseFloat(penaltyAmt);
      const mgFee = parseFloat(mFee);
      if (parseFloat(pa) > parseFloat(mgFee)) {
        count = mFee;
      } else {
        count = penaltyAmt;
      }
    }
    return count;
  }

  const handleInputFeeChange = () => {
    if (!hasTarget && summaryDetails && summaryDetails.has_targe_management_fee && getLogs() && getLogs().length > 0) {
      const payload = {
        sla_category_logs: getLogs(),
        has_target_amount_penalized: parseFloat(getManagementFeeRiskNoTarget()),
      };
      dispatch(updateSlaAudit(detailData.id, appModels.SLAAUDIT, payload));
    }
  };

  const handleStateChange = (id, state) => {
    if (displayName === 'Cancel SLA Audit' || displayName === 'Set to Draft' || displayName === 'Review & Submit for Approval') {
      let payload = {};
      if (displayName === 'Set to Draft') {
        payload = {
          reason: DOMPurify.sanitize(messageTicket),
          approved_by_id: false,
          approved_on: false,
          reviewed_by_id: false,
          reviewed_on: false,
          second_approved_by: false,
          second_approved_on: false,
        };
      } else {
        payload = {
          reason: DOMPurify.sanitize(messageTicket),
        };
      }
      dispatch(updateSlaAudit(detailData.id, appModels.SLAAUDIT, payload));
      setTimeoutLoading(true);
      setTimeout(() => {
        dispatch(getSlaAuditAction(id, state, appModels.SLAAUDIT));
        setTimeoutLoading(false);
      }, 1500);
    } else {
      dispatch(getSlaAuditAction(id, displayName === 'Approve' && detailData.state === 'Approved' ? 'action_to_second_level_approved' : state, appModels.SLAAUDIT));
    }
  };

  const toggle = () => {
    setModal(!modal);
    if (displayName === 'Cancel SLA Audit' || displayName === 'Set to Draft' || displayName === 'Review & Submit for Approval') {
      /* setTimeout(() => {
        dispatch(getSlaAuditDetail(detailData.id, appModels.SLAAUDIT));
      }, 1500); */
    } else {
      // dispatch(getSlaAuditDetail(detailData.id, appModels.SLAAUDIT));
    }
    const customFiltersList = slaAuditFilters.customFilters ? queryGeneratorWithUtc(slaAuditFilters.customFilters, 'audit_date', userInfo.data) : '';
    dispatch(getSlaAuditList(companies, appModels.SLAAUDIT, 10, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField));
    dispatch(resetSlaAuditActionInfo());
    atFinish();
  };

  const toggleCancel = () => {
    setModal(!modal);
    dispatch(resetSlaAuditActionInfo());
    atCancel();
  };

  const loading = (slaAuditAction && slaAuditAction.loading) || timeoutLoading;

  const rangeData = detailData && detailData.sla_audit_lines && detailData.sla_audit_lines.length ? detailData.sla_audit_lines.filter((item) => item.answer && item.mro_activity_id.type !== 'Computed') : false;

  const totalQtns = detailData.sla_audit_lines && detailData.sla_audit_lines.length ? detailData.sla_audit_lines.filter((item) => item.mro_activity_id.type !== 'Computed') : [];
  const totalAnswered = rangeData && rangeData.length ? rangeData.length : 0;

  function getTotalQtnsCount() {
    let res = 0;
    const totalLength = totalQtns && totalQtns.length ? totalQtns.length : 0;
    const unApplicableData = slaAuditSummary && slaAuditSummary.data ? slaAuditSummary.data.filter((item) => item.is_notapplicable) : [];
    const unApplicableQtnGrps = unApplicableData && unApplicableData.length ? getColumnArrayByField(unApplicableData, 'question_group_id', 'id') : [];
    const unApplicableQtns = unApplicableQtnGrps && unApplicableQtnGrps.length ? getArrayFromValuesMultByIdIn(totalQtns, unApplicableQtnGrps, 'question_group_id', 'id') : [];
    const unApplicableCount = unApplicableQtns && unApplicableQtns.length;
    res = totalLength ? totalLength - unApplicableCount : 0;
    return res;
  }

  function getRangeData() {
    let res = 0;
    const assetDataList = detailData && detailData.sla_audit_lines && detailData.sla_audit_lines.length ? detailData.sla_audit_lines.filter((item) => item.mro_activity_id.type !== 'Computed') : [];

    const unApplicableData = slaAuditSummary && slaAuditSummary.data ? slaAuditSummary.data.filter((item) => item.is_notapplicable) : [];
    const unApplicableQtnGrps = unApplicableData && unApplicableData.length ? getColumnArrayByField(unApplicableData, 'question_group_id', 'id') : [];
    const qtnCatData = detailData && detailData.sla_audit_lines ? detailData.sla_audit_lines.filter((item) => item.mro_activity_id.type !== 'Computed' && item.answer) : [];
    const unApplicableQtns = qtnCatData && qtnCatData.length && unApplicableQtnGrps && unApplicableQtnGrps.length ? getArrayFromValuesMultByIdIn(qtnCatData, unApplicableQtnGrps, 'question_group_id', 'id') : [];
    const unApplicableCount = unApplicableQtns && unApplicableQtns.length;
    const assetDataAnsList = assetDataList.filter((item) => item.answer);
    res = assetDataAnsList && assetDataAnsList.length ? assetDataAnsList.length - unApplicableCount : 0;

    return res;
  }

  function getIsCategoriesNotReviewed() {
    let res = false;
    const slaCategories = detailData && detailData.sla_category_logs ? detailData.sla_category_logs.filter((item) => item.approver_ids.length && item.checker_ids.length && item.state !== 'Reviewed') : [];

    if (slaCategories && slaCategories.length) {
      res = true;
    }
    return res;
  }

  function getIsCategoriesNotApproved() {
    let res = false;
    const slaCategories = detailData && detailData.sla_category_logs ? detailData.sla_category_logs.filter((item) => item.approver_ids.length && item.checker_ids.length && item.state !== 'Approved') : [];

    if (slaCategories && slaCategories.length) {
      res = true;
    }
    return res;
  }

  const unAnswered = (parseInt(getTotalQtnsCount()) - parseInt(getRangeData()));

  function getFailedQtns() {
    let res = false;
    const datas = savedChecklists && savedChecklists.length && savedChecklists.filter((item) => item.is_update === 'failed');
    if (datas && datas.length) {
      res = true;
    }
    return res;
  }

  return (

    <Dialog maxWidth={slaAuditAction && slaAuditAction.data && slaAuditAction.data.status && displayName === 'Preview' ? 'md.' : 'md'} open={actionModal}>
      <DialogHeader title={displayName} imagePath={false} fontAwesomeIcon={faIcons[actionName]} response={slaAuditAction && slaAuditAction.data && slaAuditAction.data.status && displayName === 'Preview' ? false : slaAuditAction} onClose={() => { toggleCancel(); }} />
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
            {slaAuditAction && slaAuditAction.data && slaAuditAction.data.status && displayName === 'Preview' && (
              <>
                {slaSummaryDetails && !slaSummaryDetails.loading && (
                  <ScoreCard isPreview auditDetails={slaSummaryDetails && slaSummaryDetails.data && slaSummaryDetails.data.length ? slaSummaryDetails.data[0] : false} />
                )}
                {slaSummaryDetails && slaSummaryDetails.loading && (
                  <div className="mt-4" data-testid="loading-case">
                    <Loader />
                  </div>
                )}
              </>
            )}
            <Card className="border-5 mt-0 ml-4 mb-4 mr-4 border-secondary rounded-0 border-top-0 border-right-0 border-bottom-0">
              {detailData && (displayName !== 'Preview' || (slaAuditAction && slaAuditAction.data && slaAuditAction.data.status && displayName !== 'Preview') || (!(slaAuditAction && slaAuditAction.data && slaAuditAction.data.status) && displayName === 'Preview')) && (
                <CardBody data-testid="success-case" className="bg-lightblue p-3">
                  <Row>
                    <Col className="col-auto">
                      <img src={survey} alt="asset" className="mt-1" width="50" height="45" />
                    </Col>
                    <Col className="ml-2 col-auto">
                      <Row>
                        <h6 className="mb-1">
                          {getDefaultNoValue(detailData.name)}
                        </h6>
                      </Row>
                      <Row>
                        <Col className="p-0 col-auto">
                          <span className="font-weight-800 font-side-heading mr-1">
                            Reference :
                          </span>
                          <span className="font-weight-400">
                            {getDefaultNoValue((detailData.audit_for))}
                          </span>
                        </Col>
                      </Row>
                      <Row>
                        <Col className="p-0 col-auto">
                          <span className="font-weight-800 font-side-heading mr-1">
                            Audit Template :
                          </span>
                          <span className="font-weight-400">
                            {getDefaultNoValue(extractNameObject(detailData.audit_template_id, 'name'))}
                          </span>
                        </Col>
                      </Row>
                      <Row>
                        <Col className="p-0 col-auto">
                          <span className="font-weight-800 font-side-heading mr-1">
                            Status :
                          </span>
                          <span className="font-weight-400">
                            {getDefaultNoValue(slaAuditAction && slaAuditAction.data && slaAuditAction.data.status ? getSlaStateLabel(statusName, hasSecondApprove, (detailData.state === 'Approved' && statusName === 'Approved')) : getSlaStateLabel(detailData.state, hasSecondApprove, detailData.second_approved_by))}
                          </span>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </CardBody>
              )}
            </Card>
            {slaAuditAction && !slaAuditAction.data && !loading && (displayName === 'Cancel SLA Audit' || displayName === 'Set to Draft' || displayName === 'Review & Submit for Approval') && (
              <Row className="ml-2 mr-2 mt-0">
                <Col className="col-auto">
                  <Box
                    sx={{
                      width: 500,
                      maxWidth: '100%',
                    }}
                  >
                    <TextField
                      fullWidth
                      sx={{
                        marginBottom: '20px',
                      }}
                      name="body"
                      id="outlined-multiline-flexible"
                      label="Reason"
                      required
                      formGroupClassName="m-1"
                      multiline
                      value={messageTicket}
                      onChange={onMessageChange}
                      maxRows={4}
                    />
                    {/*! messageTicket && (<span className="text-danger ml-1">Reason required</span>) */}
                  </Box>
                  {/* <Label className="mt-0">
                    Reason
                    {' '}
                    <span className="ml-1 text-danger">*</span>
                  </Label>
                  <Input type="textarea" name="body" label="Action Taken" placeholder="Enter here" value={messageTicket} onChange={onMessageChange} className="bg-whitered" rows="4" cols="40" /> */}

                </Col>
              </Row>
            )}
            {displayName === 'Submit for Review' && (parseInt(getTotalQtnsCount()) !== parseInt(getRangeData())) && (
              <Row className="justify-content-center">
                <p className="text-center text-danger m-0">
                  You have
                  {' '}
                  {unAnswered}
                  {' '}
                  unanswered SLA/KPIs. Please fill them to submit.
                </p>
              </Row>
            )}
            {displayName === 'Submit for Review' && getFailedQtns() && (
              <Row className="justify-content-center">
                <p className="text-center text-danger m-0">
                  You have
                  {' '}
                  Unsaved SLA/KPIs are pending. Please update them to submit.
                </p>
              </Row>
            )}
            {displayName === 'Review & Submit for Approval' && getIsCategoriesNotReviewed() && (
              <Row className="justify-content-center">
                <p className="text-center text-danger m-0">
                  You have
                  {' '}
                  pending
                  {' '}
                  unreviewed SLA categories. Please approve them to submit for approval.
                </p>
              </Row>
            )}
            {displayName === 'Approve' && getIsCategoriesNotApproved() && (
              <Row className="justify-content-center">
                <p className="text-center text-danger m-0">
                  You have
                  {' '}
                  pending
                  {' '}
                  unapproved SLA categories. Please approve them to continue.
                </p>
              </Row>
            )}
            <Row className="justify-content-center">
              {displayName !== 'Preview' && slaAuditAction && slaAuditAction.data && slaAuditAction.data.status && !loading && (
                <SuccessAndErrorFormat response={slaAuditAction} successMessage={actionMsg} />
              )}
              {slaAuditAction && slaAuditAction.err && (
                <SuccessAndErrorFormat response={slaAuditAction} />
              )}
              {loading && (
                <CardBody className="mt-4" data-testid="loading-case">
                  <Loader />
                </CardBody>
              )}
            </Row>

          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions className="mr-3 ml-3">
        {slaAuditAction && slaAuditAction.data && slaAuditAction.data.status
          ? ''
          : (
            <Button
              type="button"
              variant="contained"
              size="sm"
              disabled={loading || (updateSlaAuditInfo && updateSlaAuditInfo.loading) || ((displayName === 'Cancel SLA Audit' || displayName === 'Set to Draft' || displayName === 'Review & Submit for Approval') && !messageTicket) || (displayName === 'Approve' && getIsCategoriesNotApproved()) || (displayName === 'Review & Submit for Approval' && getIsCategoriesNotReviewed()) || (displayName === 'Submit for Review' && getFailedQtns()) || (displayName === 'Submit for Review' && (parseInt(getTotalQtnsCount()) !== parseInt(getRangeData())))}
              className="mr-1"
              onClick={() => handleStateChange(detailData.id, actionMethod)}
            >
              {actionButton}
            </Button>
          )}
        {(slaAuditAction && slaAuditAction.data && slaAuditAction.data.status
          && (
            <Button
              type="button"
              size="sm"
              variant="contained"
              disabled={loading}
              className="mr-1"
              onClick={toggle}
            >
              Ok
            </Button>
          )
        )}
      </DialogActions>
    </Dialog>
  );
};

Actions.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  actionModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  actionMethod: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  displayName: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  message: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  actionButton: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  actionMsg: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  statusName: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  offset: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
  ]).isRequired,
  atFinish: PropTypes.func.isRequired,
  atCancel: PropTypes.func.isRequired,
};
export default Actions;
