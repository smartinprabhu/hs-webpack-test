/* eslint-disable react/prop-types */
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
  faCheckCircle,
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
  getSlaAuditDetail,
  resetUpdateSlaAuditStage, updateSlaAudit,
  getSlaAuditList, updateSlaAuditStage,
} from '../../auditService';

const appModels = require('../../../util/appModels').default;

const StageComplete = (props) => {
  const {
    detailData, savedRecords, currentStageName, questionGroupsGlobal, currentStage, offset, actionModal, atFinish, atCancel,
  } = props;
  const dispatch = useDispatch();
  const [modal, setModal] = useState(actionModal);
  const [messageTicket, setMessageTicket] = useState('');
  const [timeoutLoading, setTimeoutLoading] = useState(false);

  const [savedChecklists, setSavedChecklists] = useState(savedRecords);

  const {
    slaAuditAction, updateSlaAuditStageInfo, slaAuditSummary, slaAuditFilters, slaAuditConfig,
  } = useSelector((state) => state.slaAudit);

  const hasSecondApprove = slaAuditConfig && slaAuditConfig.data && slaAuditConfig.data.length && slaAuditConfig.data[0].is_second_level_approval;

  const {
    sortedValue,
  } = useSelector((state) => state.equipment);

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

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);

  const onMessageChange = (e) => {
    setMessageTicket(e.target.value);
  };

  useEffect(() => {
    setSavedChecklists(savedRecords);
  }, [savedRecords]);

  function saveRecordbyTime() {
    let newData = [];
    const trackerLines = [];

    const filledChecklist = questionGroupsGlobal?.length ? questionGroupsGlobal : [];
    const filledAnsChecklistNew = extractFilledAnswers(filledChecklist, currentStage);

    if (filledAnsChecklistNew && filledAnsChecklistNew.length) {
      for (let i = 0; i < filledAnsChecklistNew.length; i += 1) {
        newData = [1, filledAnsChecklistNew[i].evaluations_id, { audit_line: { id: filledAnsChecklistNew[i].id, answer: filledAnsChecklistNew[i].answer ? filledAnsChecklistNew[i].answer.toString() : '', achieved_score: getComputedValidAnswer(filledAnsChecklistNew[i].achieved_score) }, measured_value: filledAnsChecklistNew[i].measured_value ? parseFloat(filledAnsChecklistNew[i].measured_value) : 0.00 }];
        trackerLines.push(newData);
      }
      const payloadValues = {
        lines: trackerLines,
      };
      dispatch(updateSlaAudit(detailData.id, 'hx.sla.kpi_audit_line_evaluations', payloadValues, 'checklist'));
    }
  }

  useEffect(() => {
    saveRecordbyTime();
  }, []);

  const handleStateChange = (id) => {
    if (id) {
      const payload = {
        stage_ids: [[1, currentStage.id, { state: 'Done', remarks: DOMPurify.sanitize(messageTicket) }]],
      };
      dispatch(updateSlaAuditStage(detailData.id, appModels.SLAAUDIT, payload));
    }
  };

  const toggle = () => {
    setModal(!modal);
    dispatch(getSlaAuditDetail(detailData.id, appModels.SLAAUDIT));
    const customFiltersList = slaAuditFilters.customFilters ? queryGeneratorWithUtc(slaAuditFilters.customFilters, 'audit_date', userInfo.data) : '';
    dispatch(getSlaAuditList(companies, appModels.SLAAUDIT, 10, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField));
    dispatch(resetUpdateSlaAuditStage());
    atFinish();
  };

  const toggleCancel = () => {
    setModal(!modal);
    dispatch(resetUpdateSlaAuditStage());
    atCancel();
  };

  const totalSlas = questionGroupsGlobal && questionGroupsGlobal.length > 0 ? questionGroupsGlobal : [];

  const stageSlas = totalSlas && totalSlas.length > 0 ? totalSlas.flatMap((item) => item.evaluations_ids) : [];

  const allowedIds = currentStage && currentStage.evaluators_ids ? currentStage.evaluators_ids.map((e) => e.id) : [];

  // Filter the full objects
  const totalQtns = stageSlas.filter((item) => allowedIds.includes(item.evaluator_id.id));

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

    const unApplicableData = slaAuditSummary && slaAuditSummary.data ? slaAuditSummary.data.filter((item) => item.is_notapplicable) : [];
    const unApplicableQtnGrps = unApplicableData && unApplicableData.length ? getColumnArrayByField(unApplicableData, 'question_group_id', 'id') : [];
    const qtnCatData = detailData && detailData.sla_audit_lines ? detailData.sla_audit_lines.filter((item) => item.mro_activity_id.type !== 'Computed' && item.answer) : [];
    const unApplicableQtns = qtnCatData && qtnCatData.length && unApplicableQtnGrps && unApplicableQtnGrps.length ? getArrayFromValuesMultByIdIn(qtnCatData, unApplicableQtnGrps, 'question_group_id', 'id') : [];
    const unApplicableCount = unApplicableQtns && unApplicableQtns.length;
    const assetDataAnsList = totalQtns.filter((item) => item.measured_value);
    res = assetDataAnsList && assetDataAnsList.length ? assetDataAnsList.length - unApplicableCount : 0;

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

    <Dialog PaperProps={{ style: { width: '600px', maxWidth: '600px' } }} open={actionModal}>
      <DialogHeader title={`Complete ${currentStageName}`} imagePath={false} fontAwesomeIcon={faCheckCircle} response={updateSlaAuditStageInfo} onClose={() => { toggleCancel(); }} />
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

            <Card className="border-5 mt-0 ml-4 mb-4 mr-4 border-secondary rounded-0 border-top-0 border-right-0 border-bottom-0">
              {detailData && !((updateSlaAuditStageInfo && updateSlaAuditStageInfo.data) || updateSlaAuditStageInfo.loading) && (
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
                            {getDefaultNoValue(getSlaStateLabel(detailData.state, hasSecondApprove, detailData.second_approved_by))}
                          </span>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </CardBody>
              )}
            </Card>
            {updateSlaAuditStageInfo && !updateSlaAuditStageInfo.data && !updateSlaAuditStageInfo.loading && (
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
                      label="Remarks *"
                      formGroupClassName="m-1"
                      multiline
                      value={messageTicket}
                      onChange={onMessageChange}
                      maxRows={4}
                    />

                  </Box>

                </Col>
              </Row>
            )}
            {(parseInt(getTotalQtnsCount()) !== parseInt(getRangeData())) && (
              <Row className="justify-content-center">
                <p className="text-center text-danger m-0">
                  You have
                  {' '}
                  {unAnswered}
                  {' '}
                  unanswered SLA/KPIs. Please fill them to complete.
                </p>
              </Row>
            )}
            {getFailedQtns() && (
              <Row className="justify-content-center">
                <p className="text-center text-danger m-0">
                  You have
                  {' '}
                  Unsaved SLA/KPIs are pending. Please update them to complete.
                </p>
              </Row>
            )}
            <Row className="justify-content-center">
              {updateSlaAuditStageInfo && updateSlaAuditStageInfo.data && !updateSlaAuditStageInfo.loading && (
                <SuccessAndErrorFormat response={updateSlaAuditStageInfo} successMessage={`The ${currentStageName} has been completed successfully...`} />
              )}
              {updateSlaAuditStageInfo && updateSlaAuditStageInfo.err && (
                <SuccessAndErrorFormat response={updateSlaAuditStageInfo} />
              )}
              {updateSlaAuditStageInfo.loading && (
                <CardBody className="mt-4" data-testid="loading-case">
                  <Loader />
                </CardBody>
              )}
            </Row>

          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions className="mr-3 ml-3">
        {updateSlaAuditStageInfo && updateSlaAuditStageInfo.data
          ? ''
          : (
            <Button
              type="button"
              variant="contained"
              size="sm"
              disabled={!messageTicket || (updateSlaAuditStageInfo && updateSlaAuditStageInfo.loading) || (parseInt(getTotalQtnsCount()) !== parseInt(getRangeData())) || getFailedQtns()}
              className="mr-1"
              onClick={() => handleStateChange(detailData.id)}
            >
              Complete
            </Button>
          )}
        {(updateSlaAuditStageInfo && updateSlaAuditStageInfo.data
          && (
            <Button
              type="button"
              size="sm"
              variant="contained"
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

StageComplete.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  actionModal: PropTypes.oneOfType([
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
export default StageComplete;
