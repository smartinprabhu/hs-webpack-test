/* eslint-disable no-promise-executor-return */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable max-len */
/* eslint-disable radix */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
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
import survey from '@images/sideNavImages/commodityTransactions_black.svg';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';
import {
  tankerStatusJson,
} from '../../../commonComponents/utils/util';

import {
  getDefaultNoValue, extractNameObject,
  queryGeneratorWithUtc,
  getAllowedCompanies,
} from '../../../util/appUtils';

import {
  getTanker,
  getTankerDetails,
  updateReason,
  tankerStateChange,
  resetTankerState,
} from '../../tankerService';
import DialogHeader from '../../../commonComponents/dialogHeader';

const appModels = require('../../../util/appModels').default;

const Actions = (props) => {
  const {
    detailData, statusName, offset, actionModal1, atFinish, atCancel, actionMethod, actionText, actionValue, actionButton, actionMessage,
  } = props;
  const dispatch = useDispatch();
  const [modal, setModal] = useState(actionModal1);

  const [messageTicket, setMessageTicket] = useState('');

  const [timeoutLoading, setTimeoutLoading] = useState(false);

  const onMessageChange = (e) => {
    setMessageTicket(e.target.value);
  };

  const {
    tankerTransactionFilters,
    tankerStatusInfo,
    reasonLoading,
  } = useSelector((state) => state.tanker);

  const {
    sortedValue,
  } = useSelector((state) => state.equipment);

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);

  /* useEffect(() => {
    if (tankerStatusInfo && tankerStatusInfo.data && tankerStatusInfo.data.status) {
      dispatch(getTankerDetails(detailData.id, appModels.TANKERTRANSACTIONS));
      // dispatch(getBTConfig(companies, appModels.BREAKDOWNCONFIG));
    }
  }, [tankerStatusInfo]); */

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleStateChange = async (id, state) => {
    let payload = { reason: messageTicket };

    if (actionText === 'Verify' || actionText === 'Cancel' || actionText === 'Tanker Out') {
      payload = {
        remark: messageTicket,
      };
    }

    try {
    // Set loading state to true
      setTimeoutLoading(true);

      const documents = messageTicket && (actionText === 'Verify' || actionText === 'Cancel' || actionText === 'Tanker Out')
        ? ['reason', 'status']
        : ['status'];

      const context = { reason: messageTicket };

      // Use reduce to sequentially execute dispatch calls with delay
      await documents.reduce((promise, doc) => promise.then(async () => {
        if (doc === 'reason') {
          await dispatch(updateReason(detailData.id, payload, appModels.TANKERTRANSACTIONS));
        } else {
          await dispatch(tankerStateChange(id, state, appModels.TANKERTRANSACTIONS, context));
        }
        // Add a timeout between dispatch calls
        await delay(2000); // 1000ms = 1 second delay
      }), Promise.resolve());
    } catch (error) {
      console.error('Error updating reason or changing state:', error);
    } finally {
    // Reset loading state
      setTimeoutLoading(false);
    }
  };

  const toggle = () => {
    setModal(!modal);
    if (messageTicket && (actionText === 'Verify' || actionText === 'Cancel' || actionText === 'Tanker Out')) {
      setTimeout(() => {
        dispatch(getTankerDetails(detailData.id, appModels.TANKERTRANSACTIONS));
      }, 1500);
    } else {
      dispatch(getTankerDetails(detailData.id, appModels.TANKERTRANSACTIONS));
    }
    const customFiltersList = tankerTransactionFilters.customFilters ? queryGeneratorWithUtc(tankerTransactionFilters.customFilters, false, userInfo.data) : '';
    dispatch(getTanker(companies, appModels.TANKERTRANSACTIONS, 10, offset, customFiltersList, sortedValue.sortBy, sortedValue.sortField));
    dispatch(resetTankerState());
    atFinish();
  };

  const toggleCancel = () => {
    setModal(!modal);
    dispatch(resetTankerState());
    atCancel();
  };

  const loading = (tankerStatusInfo && tankerStatusInfo.loading) || timeoutLoading || reasonLoading;

  const checkTrackerStatus = (val) => (
    <Box>
      {tankerStatusJson.map(
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

    <Dialog maxWidth={(actionText === 'Verify' || actionText === 'Cancel' || actionText === 'Tanker Out') ? 'lg' : 'md'} minWidth={(actionText === 'Verify' || actionText === 'Cancel' || actionText === 'Tanker Out') ? 'lg' : 'md'} open={actionModal1}>
      <DialogHeader title={actionValue === 'Closed' ? 'Close' : actionValue} onClose={toggleCancel} response={tankerStatusInfo} />
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
                        {getDefaultNoValue(detailData.name)}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        <span className="font-weight-800 font-side-heading mr-1">Sequence: </span>
                        {getDefaultNoValue(detailData.sequence)}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        <span className="font-weight-800 font-side-heading mr-1">Commodity: </span>
                        {getDefaultNoValue(extractNameObject(detailData.commodity, 'name'))}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center' }}>
                        <span className="font-weight-800 font-side-heading mr-1">Status: </span>
                        {getDefaultNoValue(
                          tankerStatusInfo?.data?.status
                            ? checkTrackerStatus(detailData.state)
                            : checkTrackerStatus(detailData.state),
                        )}
                      </Typography>
                    </Box>
                  </Box>
                </CardBody>
              )}
            </Card>
            {(actionText === 'Verify' || actionText === 'Cancel' || actionText === 'Tanker Out') && tankerStatusInfo && !tankerStatusInfo.data && !loading && (
              <Row className="ml-2 mr-2 mt-0">
                <Col xs={12} sm={12} md={12} lg={12} className="col-auto">
                  <Label className="mt-0">
                    Remarks
                    {' '}
                    <span className="ml-1 text-danger">*</span>
                  </Label>
                  <Input type="textarea" name="body" label="Action Taken" placeholder="Enter here" value={messageTicket} onChange={onMessageChange} className="bg-whitered" rows="4" />
                </Col>
              </Row>
            )}
            <Row className="justify-content-center">
              {tankerStatusInfo && tankerStatusInfo.data && tankerStatusInfo.data.status && !loading && (
                <SuccessAndErrorFormat response={tankerStatusInfo} successMessage={actionMessage} />
              )}
              {tankerStatusInfo && tankerStatusInfo.err && (
                <SuccessAndErrorFormat response={tankerStatusInfo} />
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
        {tankerStatusInfo && tankerStatusInfo.data && tankerStatusInfo.data.status
          ? ''
          : (
            <Button
              type="button"
              variant="contained"
              className="submit-btn-auto"
              disabled={loading || ((actionText === 'Verify' || actionText === 'Cancel' || actionText === 'Tanker Out') && !messageTicket)}
              onClick={() => handleStateChange(detailData.id, actionMethod)}
            >
              {actionButton}
            </Button>
          )}
        {(tankerStatusInfo && tankerStatusInfo.data && tankerStatusInfo.data.status
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
  actionModal1: PropTypes.oneOfType([
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
