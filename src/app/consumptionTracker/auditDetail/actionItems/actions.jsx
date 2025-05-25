/* eslint-disable max-len */
/* eslint-disable radix */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import {
  CardBody,
  Col,
  Row,
  Input,
  Label,
} from 'reactstrap';
import Button from '@mui/material/Button';
import DOMPurify from 'dompurify';
import * as PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box, Dialog, DialogContent, DialogActions, DialogContentText,
} from '@mui/material';

import {
  Checkbox,
  FormGroup,
  FormControlLabel,
} from '@material-ui/core';
import { Markup } from 'interweave';

import survey from '@images/icons/workPermitBlue.svg';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';
import DialogHeader from '../../../commonComponents/dialogHeader';
import {
  getDefaultNoValue, extractNameObject,
  queryGeneratorWithUtc,
  truncateFrontSlashs,
  truncateStars,
  getAllowedCompanies,
  getComputedValidAnswer,
} from '../../../util/appUtils';
import {
  getSlaStateLabel,
} from '../../utils/utils';
import {
  getCtAction, resetCtAuditActionInfo, getCtDetail, updateCt,
  getConsumptionTrackerCount, getConsumptionTrackerList,
} from '../../ctService';

const appModels = require('../../../util/appModels').default;

const Actions = (props) => {
  const {
    detailData, savedRecords, statusName, offset, actionModal, atFinish, atCancel, actionMethod, displayName, actionButton, actionMsg, message,
  } = props;
  const dispatch = useDispatch();
  const [modal, setModal] = useState(actionModal);
  const [messageTicket, setMessageTicket] = useState('');
  const [disclaimerTrue, setDisclaimerTrue] = useState(false);

  const [savedChecklists, setSavedChecklists] = useState(savedRecords);

  const { ctAction, ctFilters, updateCtInfo } = useSelector((state) => state.consumptionTracker);

  const filledChecklist = detailData && detailData.tracker_lines && detailData.tracker_lines.length > 0 ? detailData.tracker_lines : [];

  const filledAnsChecklist = filledChecklist.filter((item) => item.answer);

  const filledAnsChecklistNew = filledAnsChecklist.map((cl) => ({
    id: cl.id,
    answer: cl.answer,
    type: cl.mro_activity_id.type,
  }));

  const filledAnsChecklistdiff = savedChecklists.filter((role) => filledAnsChecklistNew.some((present) => present.id === role.id && parseFloat(present.answer) !== parseFloat(role.answer)));
  const filledAnsChecklistMiss = filledAnsChecklistNew.filter((role) => !savedChecklists.some((present) => present.id === role.id));

  const {
    sortedValue,
  } = useSelector((state) => state.equipment);

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);

  const onMessageChange = (e) => {
    setMessageTicket(e.target.value);
  };

  const handleStateChange = (id, state) => {
    dispatch(getCtAction(id, state, appModels.CONSUMPTIONTRACKER));
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

  function saveRecordbyTime() {
    let newData = [];
    const trackerLines = [];
    /* const answeredQtns = savedChecklists.filter((item) => item.is_update === 'start');

    if (answeredQtns.length && detailData) {
      for (let i = 0; i < answeredQtns.length; i += 1) {
        if (answeredQtns[i].type === 'numerical_box') {
          newData = [1, answeredQtns[i].id, { answer: answeredQtns[i].answer, value: getComputedValidAnswer(answeredQtns[i].answer), is_not_applicable: !!answeredQtns[i].is_not_applicable }];
          trackerLines.push(newData);
        } else {
          newData = [1, answeredQtns[i].id, { answer: answeredQtns[i].answer, is_not_applicable: !!answeredQtns[i].is_not_applicable }];
          trackerLines.push(newData);
        }
      } */
    if (filledAnsChecklistNew && filledAnsChecklistNew.length) {
      for (let j = 0; j < filledAnsChecklistNew.length; j += 1) {
        if (filledAnsChecklistNew[j].type === 'numerical_box') {
          newData = [1, filledAnsChecklistNew[j].id, { answer: filledAnsChecklistNew[j].answer, value: getComputedValidAnswer(filledAnsChecklistNew[j].answer) }];
          trackerLines.push(newData);
        } else {
          newData = [1, filledAnsChecklistNew[j].id, { answer: filledAnsChecklistNew[j].answer }];
          trackerLines.push(newData);
        }
      }
    }
    /* if (filledAnsChecklistMiss && filledAnsChecklistMiss.length) {
        for (let j = 0; j < filledAnsChecklistMiss.length; j += 1) {
          if (filledAnsChecklistMiss[j].type === 'numerical_box') {
            newData = [1, filledAnsChecklistMiss[j].id, { answer: filledAnsChecklistMiss[j].answer, value: getComputedValidAnswer(filledAnsChecklistMiss[j].answer), is_not_applicable: !!filledAnsChecklistMiss[j].is_not_applicable }];
            trackerLines.push(newData);
          } else {
            newData = [1, filledAnsChecklistMiss[j].id, { answer: filledAnsChecklistMiss[j].answer, is_not_applicable: !!filledAnsChecklistMiss[j].is_not_applicable }];
            trackerLines.push(newData);
          }
        }
      } */
    const payloadValues = {
      lines: trackerLines,
    };
    dispatch(updateCt(detailData.id, 'hx.tracker_line', payloadValues, 'checklist'));
    // }
  }

  useEffect(() => {
    if (displayName === 'Submit for Review') {
      saveRecordbyTime();
    }
  }, []);

  const toggle = () => {
    setModal(!modal);
    if (displayName === 'Cancel Tracker' || displayName === 'Set to Draft') {
      const payload = {
        reason: DOMPurify.sanitize(messageTicket),
      };
      dispatch(updateCt(detailData.id, appModels.CONSUMPTIONTRACKER, payload));
    }
    const customFiltersList = ctFilters.customFilters ? queryGeneratorWithUtc(ctFilters.customFilters, false, userInfo.data) : '';
    dispatch(getConsumptionTrackerList(companies, appModels.CONSUMPTIONTRACKER, 10, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField));
    dispatch(resetCtAuditActionInfo());
    atFinish();
  };

  const toggleCancel = () => {
    setModal(!modal);
    dispatch(resetCtAuditActionInfo());
    atCancel();
  };

  const loading = (ctAction && ctAction.loading);

  const rangeData = detailData && detailData.tracker_lines && detailData.tracker_lines.length ? detailData.tracker_lines.filter((item) => !item.is_not_applicable && item.answer && item.mro_activity_id.type !== 'Computed') : false;

  // const totalQtns = detailData.sla_audit_lines && detailData.sla_audit_lines.length ? detailData.sla_audit_lines.length : 0;
  const totalAnswered = rangeData && rangeData.length ? rangeData.length : 0;

  function getTotalQtnsCount() {
    let res = 0;
    const totalData = detailData && detailData.tracker_lines && detailData.tracker_lines.length ? detailData.tracker_lines.filter((item) => !item.is_not_applicable && item.mro_activity_id.type !== 'Computed') : 0;
    /* const unApplicableData = slaAuditSummary && slaAuditSummary.data ? slaAuditSummary.data.filter((item) => item.is_notapplicable) : [];
    const unApplicableQtnGrps = unApplicableData && unApplicableData.length ? getColumnArrayByField(unApplicableData, 'question_group_id', 'id') : [];
    const unApplicableQtns = unApplicableQtnGrps && unApplicableQtnGrps.length ? getArrayFromValuesMultByIdIn(detailData && detailData.sla_audit_lines ? detailData && detailData.sla_audit_lines : [], unApplicableQtnGrps, 'question_group_id', 'id') : [];
    const unApplicableCount = unApplicableQtns && unApplicableQtns.length; */
    res = totalData && totalData.length ? totalData.length : 0;
    return res;
  }

  function getFailedQtns() {
    let res = false;
    const datas = savedChecklists.filter((item) => item.is_update === 'failed');
    if (datas && datas.length) {
      res = true;
    }
    return res;
  }

  const unAnswered = (parseInt(getTotalQtnsCount()) - parseInt(totalAnswered));

  return (

    <Dialog maxWidth="lg" open={actionModal}>
      <DialogHeader title={displayName} imagePath={false} response={ctAction} onClose={() => { toggleCancel(); }} />
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
            {detailData && (
            <Row className="mb-2">
              <Col md="3" xs="3" sm="3" lg="3">
                <img src={survey} alt="asset" className="mt-1" width="50" height="45" />
              </Col>
              <Col md="9" xs="9" sm="9" lg="9">
                <Row>
                  <h6 className="mb-1">
                    {getDefaultNoValue(detailData.name)}
                  </h6>
                </Row>
                <Row>
                  <Col md="12" xs="12" sm="12" lg="12" className="p-0">
                    <span className="font-weight-800 font-side-heading mr-1">
                      Reference :
                    </span>
                    <span className="font-weight-400">
                      {getDefaultNoValue((detailData.audit_for))}
                    </span>
                  </Col>
                </Row>
                <Row>
                  <Col md="12" xs="12" sm="12" lg="12" className="p-0">
                    <span className="font-weight-800 font-side-heading mr-1">
                      Tracker Template :
                    </span>
                    <span className="font-weight-400">
                      {getDefaultNoValue(extractNameObject(detailData.tracker_template_id, 'name'))}
                    </span>
                  </Col>
                </Row>
                <Row>
                  <Col md="12" xs="12" sm="12" lg="12" className="p-0">
                    <span className="font-weight-800 font-side-heading mr-1">
                      Status :
                    </span>
                    <span className="font-weight-400">
                      {getDefaultNoValue(ctAction && ctAction.data && ctAction.data.status ? getSlaStateLabel(statusName) : getSlaStateLabel(detailData.state))}
                    </span>
                  </Col>
                </Row>
              </Col>
            </Row>
            )}
            {ctAction && !ctAction.data && !loading && (displayName === 'Cancel Tracker' || displayName === 'Set to Draft') && (
            <Row>
              <Col xs={12} sm={12} md={12} lg={12}>
                <Label className="mt-0">
                  Reason
                  {' '}
                  <span className="ml-1 text-danger">*</span>
                </Label>
                <Input type="textarea" name="body" label="Action Taken" placeholder="Enter here" value={messageTicket} onChange={onMessageChange} className="bg-whitered" rows="4" cols="50" />
                {!messageTicket && (<span className="text-danger ml-1">Reason required</span>)}
              </Col>
            </Row>
            )}
            {detailData.tracker_template_id && detailData.tracker_template_id.disclaimer && ctAction && !ctAction.data && !loading && (displayName === 'Approve' || displayName === 'Submit for Review') && (
            <Row className="ml-2 mr-2 mt-0">
              <Label className="mt-0">
                Disclaimer
                {' '}
                <span className="ml-1 text-danger">*</span>
              </Label>
              <div className="small-form-content thin-scrollbar p-2">
                <Markup content={truncateFrontSlashs(truncateStars(detailData.tracker_template_id.disclaimer))} />
              </div>
              <FormGroup className="pl-3">
                <FormControlLabel
                  control={(
                    <Checkbox
                      size="small"
                      color="default"
                      name="disclaimer"
                      id="disclaimer"
                      onChange={() => setDisclaimerTrue(!disclaimerTrue)}
                      value={disclaimerTrue}
                      checked={disclaimerTrue}
                    />
)}
                  label="I hereby agree above details"
                />
              </FormGroup>
            </Row>
            )}
            {displayName === 'Submit for Review' && (parseInt(getTotalQtnsCount()) !== parseInt(totalAnswered)) && (
            <Row className="justify-content-center">
              <p className="text-center text-danger m-0">
                You have
                {' '}
                {unAnswered}
                {' '}
                unanswered Tracker items. Please fill them to submit.
              </p>
            </Row>
            )}
            {displayName === 'Submit for Review' && getFailedQtns() && (
            <Row className="justify-content-center">
              <p className="text-center text-danger m-0">
                You have
                {' '}
                Unsaved questions are pending. Please update them to submit.
              </p>
            </Row>
            )}
            <Row className="justify-content-center">
              {ctAction && ctAction.data && ctAction.data.status && !loading && (
              <SuccessAndErrorFormat response={ctAction} successMessage={actionMsg} />
              )}
              {ctAction && ctAction.err && (
              <SuccessAndErrorFormat response={ctAction} />
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
        {ctAction && ctAction.data && ctAction.data.status
          ? ''
          : (
            <Button
              type="button"
               variant="contained"
              size="sm"
              disabled={loading
                || ((displayName === 'Cancel Tracker' || displayName === 'Set to Draft') && !messageTicket)
              || (displayName === 'Submit for Review' && (parseInt(getTotalQtnsCount()) !== parseInt(totalAnswered)))
              || (displayName === 'Submit for Review' && getFailedQtns())
              || (updateCtInfo && updateCtInfo.loading)
              || ((displayName === 'Submit for Review' || displayName === 'Approve') && detailData.tracker_template_id && detailData.tracker_template_id.disclaimer && !disclaimerTrue)}
              className="mr-1"
              onClick={() => handleStateChange(detailData.id, actionMethod)}
            >
              {actionButton}
            </Button>
          )}
        {(ctAction && ctAction.data && ctAction.data.status
              && (
                <Button
                  type="button"
                  size="sm"
                  disabled={loading}
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
  /*     </Modal> */
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
