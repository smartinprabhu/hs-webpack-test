/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable max-len */
/* eslint-disable radix */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  Col,
  Row,
  Input,
  Label,
} from 'reactstrap';
import { Box } from '@mui/system';
import {
  Button,
  Typography,
  Dialog, DialogActions, DialogContent, DialogContentText,
} from '@mui/material';
import * as PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import {
  faCheckCircle, faTimesCircle, faRedoAlt, faPauseCircle,
} from '@fortawesome/free-solid-svg-icons';
import survey from '@images/alarms/alarmsBlue.svg';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';
import {
  breakDownStatusJson,
} from '../../../commonComponents/utils/util';

import {
  getDefaultNoValue, extractNameObject,
  queryGeneratorWithUtc,
  getAllowedCompanies,
} from '../../../util/appUtils';
import {
  getTrackerList,
  getTrackerDetail,
  updateReason,
  complianceStateChange,
  resetTrackerState,
} from '../../breakdownService';
import DialogHeader from '../../../commonComponents/dialogHeader';

const appModels = require('../../../util/appModels').default;

const faIcons = {
  INPROGRESS: faCheckCircle,
  INPROGRESSACTIVE: faCheckCircle,
  ONHOLD: faPauseCircle,
  ONHOLDACTIVE: faPauseCircle,
  CLOSE: faCheckCircle,
  CLOSEACTIVE: faCheckCircle,
  CANCEL: faTimesCircle,
  CANCELACTIVE: faTimesCircle,
  DRAFT: faRedoAlt,
  DRAFTDACTIVE: faRedoAlt,
};

const Actions = (props) => {
  const {
    detailData, statusName, offset, actionModal, atFinish, atCancel, actionMethod, actionText, actionValue, actionButton, actionMessage,
  } = props;
  const dispatch = useDispatch();
  const [modal, setModal] = useState(actionModal);

  const [messageTicket, setMessageTicket] = useState('');

  const [timeoutLoading, setTimeoutLoading] = useState(false);

  const onMessageChange = (e) => {
    setMessageTicket(e.target.value);
  };

  const { stateChangeInfo, trackerFilters, reasonLoading } = useSelector((state) => state.bmsAlarms);

  const {
    sortedValue,
  } = useSelector((state) => state.equipment);

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);

  useEffect(() => {
    if (stateChangeInfo && stateChangeInfo.data && stateChangeInfo.data.status) {
      dispatch(getTrackerDetail(detailData.id, appModels.BMSALARMS));
      // dispatch(getBTConfig(companies, appModels.BREAKDOWNCONFIG));
    }
  }, [stateChangeInfo]);

  const handleStateChange = async (id, state) => {
    let payload = {
      reason: messageTicket,
    };

    if (actionText === 'Close') {
      payload = {
        resolution: messageTicket,
        // reason: messageTicket,
      };
    }

    try {
    // Set loading to true
      setTimeoutLoading(true);
      const documents = messageTicket && actionText === 'Close' ? ['reason', 'status'] : ['status'];
      const context = { reason: messageTicket };

      documents.reduce(
        (promise, doc) =>
        // Chain the promises correctly
          promise.then(() =>
          // Dispatch appropriate action based on the document
            (doc === 'reason'
              ? dispatch(updateReason(detailData.id, payload, appModels.BMSALARMS))
              : dispatch(complianceStateChange(id, state, appModels.BMSALARMS, context)))),
        Promise.resolve(),
      ); // Start with a resolved promise to chain subsequent actions
    } catch (error) {
      console.error('Error updating reason or changing state:', error);
    } finally {
    // Set loading to false once everything is complete
      setTimeoutLoading(false);
    }
  };

  const toggle = () => {
    setModal(!modal);
    if (messageTicket && actionText === 'Close') {
      setTimeout(() => {
        dispatch(getTrackerDetail(detailData.id, appModels.BMSALARMS));
      }, 1500);
    } else {
      dispatch(getTrackerDetail(detailData.id, appModels.BMSALARMS));
    }
    const customFiltersList = trackerFilters.customFilters ? queryGeneratorWithUtc(trackerFilters.customFilters, false, userInfo.data) : '';
    dispatch(getTrackerList(companies, appModels.BMSALARMS, 10, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField));
    dispatch(resetTrackerState());
    atFinish();
  };

  const toggleCancel = () => {
    setModal(!modal);
    dispatch(resetTrackerState());
    atCancel();
  };

  const loading = (stateChangeInfo && stateChangeInfo.loading) || timeoutLoading || reasonLoading;

  const checkTrackerStatus = (val) => (
    <Box>
      {breakDownStatusJson.map(
        (status) => val === status.status && (
          <span>
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
          </span>
        ),
      )}
    </Box>
  );

  return (

    <Dialog
      fullWidth
      maxWidth="lg"
      sx={{
        '& .MuiDialog-paper': {
          width: '450px', // Adjusts width to content size
          maxWidth: '80vw', // Limits the width to 80% of the viewport width
        },
      }}
      open={actionModal}
    >
      <DialogHeader title={actionValue === 'Closed' ? 'Close' : actionValue} onClose={toggleCancel} response={stateChangeInfo} />
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
              {detailData && (
                <CardBody data-testid="success-case" className="bg-lightblue p-3">
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                    <img src={survey} alt="asset" width="40" height="35" style={{ alignSelf: 'flex-start' }} />
                    <Box>
                      <Typography variant="h6" sx={{ fontSize: '1rem' }} className="mb-1">
                        {getDefaultNoValue(detailData.subject)}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        <span className="font-weight-800 font-side-heading mr-1">Severity: </span>
                        {getDefaultNoValue(detailData.severity)}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        <span className="font-weight-800 font-side-heading mr-1">Category: </span>
                        {getDefaultNoValue(extractNameObject(detailData.category_id, 'name'))}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center' }}>
                        <span className="font-weight-800 font-side-heading mr-1">Status: </span>
                        {getDefaultNoValue(
                          stateChangeInfo?.data?.status
                            ? checkTrackerStatus(detailData.state)
                            : checkTrackerStatus(detailData.state),
                        )}
                      </Typography>
                    </Box>
                  </Box>
                </CardBody>
              )}
            </Card>
            {stateChangeInfo && !stateChangeInfo.data && !loading && (
              <Row className="ml-2 mr-2 mt-0">
                <Col xs={12} sm={12} md={12} lg={12} className="col-auto">
                  <Label className="mt-0">
                    Remarks
                    {' '}
                    <span className="ml-1 text-danger" />
                  </Label>
                  <Input type="textarea" name="body" label="Action Taken" placeholder="Enter here" value={messageTicket} onChange={onMessageChange} className="bg-whitered" rows="4" />
                </Col>
              </Row>
            )}
            <Row className="justify-content-center">
              {stateChangeInfo && stateChangeInfo.data && stateChangeInfo.data.status && !loading && (
                <SuccessAndErrorFormat response={stateChangeInfo} successMessage={actionMessage} />
              )}
              {stateChangeInfo && stateChangeInfo.err && (
                <SuccessAndErrorFormat response={stateChangeInfo} />
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
      <DialogActions>
        {stateChangeInfo && stateChangeInfo.data && stateChangeInfo.data.status
          ? ''
          : (
            <Button
              type="button"
              variant="contained"
              className="submit-btn-auto"
              disabled={loading}
              onClick={() => handleStateChange(detailData.id, actionMethod)}
            >
              {actionButton}
            </Button>
          )}
        {(stateChangeInfo && stateChangeInfo.data && stateChangeInfo.data.status
          && (
            <Button
              type="button"
              size="sm"
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
  actionText: PropTypes.oneOfType([
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
  actionMessage: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  statusName: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  actionValue: PropTypes.oneOfType([
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
