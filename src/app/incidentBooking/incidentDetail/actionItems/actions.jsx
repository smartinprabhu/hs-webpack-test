/* eslint-disable max-len */
/* eslint-disable radix */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useRef } from 'react';
import {
  Card,
  CardBody,
  Col,
  Row,
  Input,
  Label,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import DOMPurify from 'dompurify';
import {
  faEnvelope, faTimesCircle, faStopCircle, faCheckCircle, faSave, faFile,
  faChartArea, faSignOut,
} from '@fortawesome/free-solid-svg-icons';
import {
  Box,
  Dialog, DialogActions, DialogContent, DialogContentText,
  Button,
} from '@mui/material';

import survey from '@images/icons/workPermitBlue.svg';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';

import {
  getDefaultNoValue, extractNameObject,
  getColumnArrayByField,
  getArrayFromValuesMultByIdIn,
  queryGeneratorWithUtc,
  truncateFrontSlashs,
  truncateStars,
  getAllowedCompanies,
} from '../../../util/appUtils';
import {
  getSlaStateLabel,
} from '../../utils/utils';
import {
  getIncidentAction, resetCtAuditActionInfo, getIncidentDetail,
  getIncidentsCount, getIncidentsList, updateIncidentNoLoad,
} from '../../ctService';
import DialogHeader from '../../../commonComponents/dialogHeader';
import { hxincidentStatusJson } from '../../../commonComponents/utils/util';

const appModels = require('../../../util/appModels').default;

const faIcons = {
  CANCEL: faTimesCircle,
  RESOLVED: faEnvelope,
  START: faCheckCircle,
  ACKNOWLEDGE: faSave,
  VALIDATED: faFile,
  PAUSE: faStopCircle,
  RESUME: faCheckCircle,
  ANALYSIS: faChartArea,
  RECOMMEND: faCheckCircle,
  SIGNOFF: faSignOut,
};

const Actions = (props) => {
  const {
    detailData, statusName, offset, actionModal, atFinish, atCancel, actionMethod, displayName, actionButton, actionMsg, message,
    isTasksNotCleared, isAnalysisChecklisNotCleared, isValidChecklisNotCleared,
  } = props;
  const dispatch = useDispatch();
  const [modal, setModal] = useState(actionModal);

  const [messageTicket, setMessageTicket] = useState('');

  const [timeoutLoading, setTimeoutLoading] = useState(false);

  const onMessageChange = (e) => {
    setMessageTicket(e.target.value);
  };

  const { incidentAction, incidentHxFilters } = useSelector((state) => state.hxIncident);

  const {
    sortedValue,
  } = useSelector((state) => state.equipment);

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);

  const handleStateChange = (id, state) => {
    if (displayName === 'Resolve' || displayName === 'Validate' || displayName === 'Pause Incident' || displayName === 'Cancel Incident' || displayName === 'Sign off' || displayName === 'Acknowledge') {
      let payload = {
        reason: DOMPurify.sanitize(messageTicket),
      };
      if (displayName === 'Resolve') {
        payload = {
          resolution: DOMPurify.sanitize(messageTicket),
          reason: DOMPurify.sanitize(messageTicket),
        };
      }
      dispatch(updateIncidentNoLoad(detailData.id, appModels.HXINCIDENT, payload, 'yes'));
      setTimeoutLoading(true);
      setTimeout(() => {
        dispatch(getIncidentAction(id, state, appModels.HXINCIDENT));
        setTimeoutLoading(false);
      }, 1500);
    } else {
      dispatch(getIncidentAction(id, state, appModels.HXINCIDENT));
    }
  };

  const toggle = () => {
    setModal(!modal);
    if (displayName === 'Resolve' || displayName === 'Validate' || displayName === 'Pause Incident' || displayName === 'Cancel Incident' || displayName === 'Sign off' || displayName === 'Acknowledge') {
      setTimeout(() => {
        dispatch(getIncidentDetail(detailData.id, appModels.HXINCIDENT));
      }, 1500);
    } else {
      dispatch(getIncidentDetail(detailData.id, appModels.HXINCIDENT));
    }
    const customFiltersList = incidentHxFilters.customFilters ? queryGeneratorWithUtc(incidentHxFilters.customFilters, 'incident_on', userInfo.data) : '';
    dispatch(getIncidentsList(companies, appModels.HXINCIDENT, 10, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField));
    dispatch(resetCtAuditActionInfo());
    atFinish();
  };

  const toggleCancel = () => {
    setModal(!modal);
    dispatch(resetCtAuditActionInfo());
    atCancel();
  };

  const loading = (incidentAction && incidentAction.loading) || timeoutLoading;

  const checkTicketsStatus = (val) => (
    <Box>
      {hxincidentStatusJson.map(
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

  return (
    <Dialog maxWidth="xl" open={actionModal}>
      <DialogHeader fontAwesomeIcon={faIcons[message]} title={displayName} onClose={toggleCancel} response={incidentAction} />
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Box
            sx={{
              width: '600px',
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
              {detailData && (
                <CardBody data-testid="success-case" className="bg-lightblue p-3">
                  <Row>
                    <Col md="1" xs="1" sm="1" lg="2">
                      <img src={survey} alt="asset" className="mt-1" width="40" height="35" />
                    </Col>
                    <Col md="8" xs="8" sm="8" lg="8" className="ml-12">
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
                            {getDefaultNoValue((detailData.reference))}
                          </span>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="12" xs="12" sm="12" lg="12" className="p-0">
                          <span className="font-weight-800 font-side-heading mr-1">
                            Category :
                          </span>
                          <span className="font-weight-400">
                            {getDefaultNoValue(extractNameObject(detailData.category_id, 'name'))}
                          </span>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="12" xs="12" sm="12" lg="12" className="p-0">
                          <Box
                            sx={{
                              display: 'flex',
                              gap: '10px',
                              alignItems: 'center',
                              marginBottom: '5px',
                            }}
                          >
                            Status:
                            {getDefaultNoValue(
                              incidentAction && incidentAction.data && incidentAction.data.status
                                ? checkTicketsStatus(statusName)
                                : checkTicketsStatus(detailData.state),
                            )}
                          </Box>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </CardBody>
              )}
            </Card>
            {incidentAction && !incidentAction.data && !loading && (displayName === 'Resolve' || displayName === 'Validate' || displayName === 'Pause Incident' || displayName === 'Cancel Incident' || displayName === 'Sign off' || displayName === 'Acknowledge') && (
              <Row className="ml-2 mr-2 mt-0">
                <Col md="12" xs="12" sm="12" lg="12">
                  <Label className="mt-0">
                    Remarks
                    {' '}
                    <span className="ml-1 text-danger">*</span>
                  </Label>
                  <Input type="textarea" name="body" label="Action Taken" placeholder="Enter here" value={messageTicket} onChange={onMessageChange} className="bg-whitered" rows="4" style={{ width: '517px' }} />
                  {!messageTicket && (<span className="text-danger ml-1" style={{ fontSize: 'small' }}>Remarks required</span>)}
                </Col>
              </Row>
            )}
            {displayName === 'Resolve' && isTasksNotCleared && (
              <Row className="justify-content-center">
                <p className="text-danger m-0" style={{ whiteSpace: 'nowrap', fontSize: 'small' }}>
                  You have pending tasks to complete. Please complete them to resolve.
                </p>
              </Row>
            )}
            {displayName === 'Complete RCFA' && isAnalysisChecklisNotCleared && (
              <Row className="justify-content-center">
                <p className="text-danger m-0" style={{ whiteSpace: 'nowrap', fontSize: 'small' }}>
                  You have pending RCFA checklists to complete. Please complete them to complete RCFA.
                </p>
              </Row>
            )}
            {displayName === 'Validate' && isValidChecklisNotCleared && (
              <Row className="justify-content-center">
                <p className="text-danger m-0" style={{ whiteSpace: 'nowrap', fontSize: 'small' }}>
                  You have pending validations checklists to complete. Please complete them to resolve.
                </p>
              </Row>
            )}
            {displayName === 'Acknowledge' && ((detailData.severity_id && !detailData.severity_id.id) || (detailData.priority_id && !detailData.priority_id.id) || (detailData.probability_id && !detailData.probability_id.id) || (detailData.assigned_id && !detailData.assigned_id.id)) && (
              <Row className="justify-content-center">
                <p className="text-danger m-0" style={{ whiteSpace: 'nowrap', fontSize: 'small' }}>
                  You have to update Severity, Priority, Assigned To and Probability to Acknowledge.
                </p>
              </Row>
            )}
            {displayName === 'Complete RCFA' && ((detailData.severity_id && !detailData.severity_id.id) || (detailData.priority_id && !detailData.priority_id.id) || (detailData.probability_id && !detailData.probability_id.id) || (detailData.assigned_id && !detailData.assigned_id.id)) && (
              <Row className="justify-content-center">
                <p className="text-danger m-0" style={{ whiteSpace: 'nowrap', fontSize: 'small' }}>
                  You have to update Severity, Priority, Assigned To and Probability to Acknowledge.
                </p>
              </Row>
            )}
            <Row className="justify-content-center align-items-center">
              {incidentAction && incidentAction.data && incidentAction.data.status && !loading && (
                <SuccessAndErrorFormat response={incidentAction} successMessage={actionMsg} />
              )}
              {incidentAction && incidentAction.err && (
                <SuccessAndErrorFormat response={incidentAction} />
              )}
              {loading && (
                // <CardBody className="mt-4" data-testid="loading-case" >
                <Loader sx={{ paddingBottom: '20px' }} />
              // </CardBody>
              )}
            </Row>
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions className="mr-3 ml-3">
        {incidentAction && incidentAction.data && incidentAction.data.status
          ? ''
          : (
            <Button
              type="button"
              disabled={
                loading
                || (displayName === 'Resolve' && (isTasksNotCleared || !messageTicket))
                || (displayName === 'Complete RCFA' && isAnalysisChecklisNotCleared) || (displayName === 'Validate' && (isValidChecklisNotCleared || !messageTicket))
                || (displayName === 'Cancel Incident' && !messageTicket)
                || (displayName === 'Acknowledge' && !messageTicket)
                || (displayName === 'Pause Incident' && !messageTicket)
                || (displayName === 'Sign off' && !messageTicket)
                || (displayName === 'Acknowledge' && ((detailData.severity_id && !detailData.severity_id.id) || (detailData.priority_id && !detailData.priority_id.id) || (detailData.probability_id && !detailData.probability_id.id) || (detailData.assigned_id && !detailData.assigned_id.id)))
                || (displayName === 'Complete RCFA' && ((detailData.severity_id && !detailData.severity_id.id) || (detailData.priority_id && !detailData.priority_id.id) || (detailData.probability_id && !detailData.probability_id.id) || (detailData.assigned_id && !detailData.assigned_id.id)))
              }
              variant="contained"
              onClick={() => handleStateChange(detailData.id, actionMethod)}
              style={{ width: 'auto', height: '40px' }}
            >
              {actionButton}
            </Button>
          )}
        {(incidentAction && incidentAction.data && incidentAction.data.status
          && (
            <Button
              type="button"
              disabled={loading}
              variant="contained"
              className="submit-btn"
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
