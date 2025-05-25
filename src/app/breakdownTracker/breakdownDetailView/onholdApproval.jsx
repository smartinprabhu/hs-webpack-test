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

import trackerIcon from '@images/icons/breakTrackerBlue.svg';
import SuccessAndErrorFormat from '@shared/successAndErrorFormatMui';
import Loader from '@shared/loading';

import {
  getDefaultNoValue, extractNameObject,
  getAllowedCompanies, getCompanyTimezoneDate,
  isValidValue,
} from '../../util/appUtils';
import {
  onHoldApproval,
  getTrackerDetail,
} from '../breakdownService';
import DialogHeader from '../../commonComponents/dialogHeader';

const appModels = require('../../util/appModels').default;

const OnHoldApproval = (props) => {
  const {
    detailData, actionModal, atFinish, atCancel,
  } = props;
  const dispatch = useDispatch();
  const [modal, setModal] = useState(actionModal);

  const [messageTicket, setMessageTicket] = useState('');

  const [timeoutLoading, setTimeoutLoading] = useState(false);

  const [type, setType] = useState('');

  const onMessageChange = (e) => {
    setMessageTicket(e.target?.value?.trimStart() || '');
  };

  const { btOnHoldApproval } = useSelector((state) => state.breakdowntracker);

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);

  const toggle = () => {
    if (btOnHoldApproval && btOnHoldApproval.data) {
      dispatch(getTrackerDetail(detailData.id, appModels.BREAKDOWNTRACKER));
    }
    atFinish();
  };

  const toggleCancel = () => {
    setModal(!modal);
    atCancel();
  };

  const loading = (btOnHoldApproval && btOnHoldApproval.loading) || timeoutLoading;

  const handleStateChange = async (id) => {
    try {
      setType('cancel');

      const method = 'send_on_hold_approvel_or_reject_email';
      const args = 'reject';

      dispatch(onHoldApproval(id, appModels.BREAKDOWNTRACKER, args, method, messageTicket));
    } catch (error) {
      console.error('Error updating reason or changing state:', error);
    } finally {
      // Set loading to false once everything is complete
      setTimeoutLoading(false);
    }
  };

  const handleApproveChange = async (id) => {
    try {
      setType('approve');
      const method = 'send_on_hold_approvel_or_reject_email';
      const args = 'approval';

      dispatch(onHoldApproval(id, appModels.BREAKDOWNTRACKER, args, method, ''));
    } catch (error) {
      console.error('Error updating reason or changing state:', error);
    } finally {
      // Set loading to false once everything is complete
      setTimeoutLoading(false);
    }
  };

  return (

    <Dialog maxWidth="lg" minWidth="lg" open={actionModal}>
      <DialogHeader title="On-Hold Request Approval" onClose={toggleCancel} response={btOnHoldApproval} />
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Box
            sx={{
              width: '100%',
              height: '100%',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10%',
              fontFamily: 'Suisse Intl',
            }}
          >
            <Card className="border-5 mt-0 ml-4 mb-2 mr-4 border-secondary rounded-0 border-top-0 border-right-0 border-bottom-0">
              {detailData && (
                <CardBody data-testid="success-case" className="bg-lightblue p-3" style={{ backgroundColor: '#F6F8FA' }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                    <img src={trackerIcon} alt="asset" width="40" height="35" style={{ alignSelf: 'flex-start' }} />
                    <Box>
                      <Typography variant="h6" sx={{ fontSize: '1rem' }} className="mb-1">
                        {getDefaultNoValue(detailData.name)}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" className="font-family-tab">
                        <span className="font-weight-800 font-family-tab font-side-heading mr-1">Type: </span>
                        {getDefaultNoValue(detailData.type)}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" className="font-family-tab">
                        <span className="font-weight-800 font-family-tab font-side-heading mr-1">Priority: </span>
                        {getDefaultNoValue(detailData.priority)}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" className="font-family-tab">
                        <span className="font-weight-800 font-family-tab font-side-heading mr-1">Incident On: </span>
                        {getDefaultNoValue(getCompanyTimezoneDate(detailData.incident_date, userInfo, 'datetime'))}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" className="font-family-tab">
                        <span className="font-weight-800 font-family-tab font-side-heading mr-1">
                          {detailData.type === 'Space' ? 'Space' : 'Equipment'}
                          :
                          {' '}
                        </span>
                        {getDefaultNoValue(detailData.type === 'Space'
                          ? extractNameObject(detailData.space_id, 'path_name') : extractNameObject(detailData.equipment_id, 'name'))}
                      </Typography>
                    </Box>
                  </Box>
                </CardBody>
              )}
            </Card>
            {btOnHoldApproval && !btOnHoldApproval.data && !loading && (
            <>
              <Row className="ml-2 mr-2 mt-0">
                <Col xs={12} sm={12} md={6} lg={6} className="col-auto">
                  <Label className="mt-0 font-family-tab font-tiny font-weight-400" style={{ color: 'rgba(0, 0, 0, 0.54)' }}>
                    Requested by
                    {' '}
                    <span className="ml-1 text-danger" />
                  </Label>
                  <p className="font-family-tab">{getDefaultNoValue(detailData.on_hold_requested_by)}</p>
                </Col>
                <Col xs={12} sm={12} md={6} lg={6} className="col-auto">
                  <Label className="mt-0 font-family-tab font-tiny font-weight-400" style={{ color: 'rgba(0, 0, 0, 0.54)' }}>
                    Requested On
                    {' '}
                    <span className="ml-1 text-danger" />
                  </Label>
                  <p className="font-family-tab">{getDefaultNoValue(getCompanyTimezoneDate(detailData.on_hold_requested_on, userInfo, 'datetime'))}</p>
                </Col>
                <Col xs={12} sm={12} md={6} lg={6} className="col-auto">
                  <Label className="mt-0 font-family-tab font-tiny font-weight-400" style={{ color: 'rgba(0, 0, 0, 0.54)' }}>
                    Reason
                    {' '}
                    <span className="ml-1 text-danger" />
                  </Label>
                  <p className="font-family-tab">{getDefaultNoValue(extractNameObject(detailData.pause_reason_id, 'name'))}</p>
                </Col>
                <Col xs={12} sm={12} md={6} lg={6} className="col-auto">
                  <Label className="mt-0 font-family-tab font-tiny font-weight-400" style={{ color: 'rgba(0, 0, 0, 0.54)' }}>
                    Remarks
                    {' '}
                    <span className="ml-1 text-danger" />
                  </Label>
                  <p className="font-family-tab">{getDefaultNoValue(detailData.on_hold_requested_command)}</p>
                </Col>
              </Row>
              {type === 'cancel' && (
              <Row className="ml-2 mr-2 mt-0">
                <Col xs={12} sm={12} md={12} lg={12} className="col-auto">
                  <Label className="mt-0 font-family-tab font-tiny font-weight-400" style={{ color: 'rgba(0, 0, 0, 0.54)' }}>
                    Remarks
                  </Label>
                  <span className="ml-1 text-danger font-weight-800"> * </span>
                  <Input type="textarea" name="body" label="Action Taken" placeholder="Enter here" value={messageTicket} onChange={onMessageChange} className="bg-whitered" rows="2" />
                </Col>
              </Row>
              )}
            </>
            )}
            <Row className="justify-content-center font-family-tab">
              {btOnHoldApproval && btOnHoldApproval.data && !loading && (
                <SuccessAndErrorFormat response={btOnHoldApproval} successMessage={type === 'cancel' ? 'The Tracker On-Hold Request has been rejected.' : 'The Tracker has been placed On Hold.'} />
              )}
              {btOnHoldApproval && btOnHoldApproval.err && (
                <SuccessAndErrorFormat response={btOnHoldApproval} />
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
        {btOnHoldApproval && btOnHoldApproval.data
          ? ''
          : (
            <>
              <Button
                type="button"
                variant="contained"
                className={type !== 'cancel' ? 'reset-btn-new1 mr-2' : 'submit-btn-auto'}
                disabled={loading || (type === 'cancel' && !isValidValue(messageTicket))}
                onClick={() => (type !== 'cancel' ? setType('cancel') : handleStateChange(detailData.id))}
              >

                Reject Request
              </Button>
              {type !== 'cancel' && (
              <Button
                type="button"
                variant="contained"
                className="submit-btn-auto"
                disabled={loading}
                onClick={() => handleApproveChange(detailData.id)}
              >

                Approve Request
              </Button>
              )}
            </>
          )}
        {(btOnHoldApproval && btOnHoldApproval.data
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

OnHoldApproval.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  actionModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  atFinish: PropTypes.func.isRequired,
  atCancel: PropTypes.func.isRequired,
};
export default OnHoldApproval;
