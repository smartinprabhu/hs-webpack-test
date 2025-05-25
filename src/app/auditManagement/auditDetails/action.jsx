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
import auditBlue from '@images/icons/auditBlue.svg';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';
import {
  hxAuditStatusJson,
} from '../../commonComponents/utils/util';

import {
  getDefaultNoValue, extractNameObject,
  getAllowedCompanies,
} from '../../util/appUtils';
import {
  updateHxAudit,
  getHxAuditDetails,
  getHxAuditActions,
} from '../auditService';
import DialogHeader from '../../commonComponents/dialogHeader';

const appModels = require('../../util/appModels').default;

const Actions = (props) => {
  const {
    detailData, offset, actionModal, atFinish, atCancel, actionMethod, actionButton, actionMsg,
  } = props;
  const dispatch = useDispatch();
  const [modal, setModal] = useState(actionModal);

  const [messageTicket, setMessageTicket] = useState('');

  const [timeoutLoading, setTimeoutLoading] = useState(false);

  const onMessageChange = (e) => {
    setMessageTicket(e.target.value);
  };

  const { hxAuditUpdate, hxAuditActions } = useSelector((state) => state.hxAudits);

  const data = hxAuditActions && hxAuditActions.data ? hxAuditActions.data : [];
  const pendingActions = data && data.length ? data.filter((item) => item.state !== 'Closed') : [];

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);

  useEffect(() => {
    if (actionButton && actionButton === 'Sign off Audit' && detailData.id) {
      dispatch(getHxAuditActions(appModels.HXAUDITACTION, detailData.id));
    }
  }, [actionButton]);

  const handleStateChange = async (id, state) => {
    const payload = {
      remarks: messageTicket,
      state,
    };

    try {
      dispatch(updateHxAudit(id, appModels.HXAUDIT, payload));
    } catch (error) {
      console.error('Error updating reason or changing state:', error);
    } finally {
    // Set loading to false once everything is complete
      setTimeoutLoading(false);
    }
  };

  const toggle = () => {
    if (hxAuditUpdate && hxAuditUpdate.data) {
      dispatch(getHxAuditDetails(detailData.id, appModels.HXAUDIT));
    }
    atFinish();
  };

  const toggleCancel = () => {
    setModal(!modal);
    atCancel();
  };

  const loading = (hxAuditUpdate && hxAuditUpdate.loading) || timeoutLoading;

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
        </Box>
        ),
      )}
    </Box>
  );

  return (

    <Dialog maxWidth="lg" minWidth="lg" open={actionModal}>
      <DialogHeader title={actionButton} onClose={toggleCancel} response={hxAuditUpdate} />
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
                    <img src={auditBlue} alt="asset" width="40" height="35" style={{ alignSelf: 'flex-start' }} />
                    <Box>
                      <Typography variant="h6" sx={{ fontSize: '1rem' }} className="mb-1">
                        {getDefaultNoValue(detailData.name)}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" className="font-family-tab">
                        <span className="font-weight-800 font-family-tab font-side-heading mr-1">Sequence: </span>
                        {getDefaultNoValue(detailData.sequence)}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" className="font-family-tab">
                        <span className="font-weight-800 font-family-tab font-side-heading mr-1">Audit System: </span>
                        {getDefaultNoValue(extractNameObject(detailData.audit_system_id, 'name'))}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" className="font-family-tab" sx={{ display: 'flex', alignItems: 'center' }}>
                        <span className="font-weight-800 font-side-heading mr-1 font-family-tab">Status: </span>
                        {checkAuditStatus(detailData.state)}
                      </Typography>
                    </Box>
                  </Box>
                </CardBody>
              )}
            </Card>
            {hxAuditUpdate && !hxAuditUpdate.data && !loading && (
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
              {hxAuditUpdate && hxAuditUpdate.data && !loading && (
                <SuccessAndErrorFormat response={hxAuditUpdate} successMessage={actionMsg} />
              )}
              {pendingActions && pendingActions.length > 0 && actionButton === 'Sign off Audit' && (
                <p className="text-danger font-family-tab">You have pending actions to complete. Please complete them to sign off the audit.</p>
              )}
              {hxAuditUpdate && hxAuditUpdate.err && (
                <SuccessAndErrorFormat response={hxAuditUpdate} />
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
        {hxAuditUpdate && hxAuditUpdate.data
          ? ''
          : (
            <Button
              type="button"
              variant="contained"
              className="submit-btn-auto"
              disabled={loading || (hxAuditActions && hxAuditActions.loading) || (actionButton === 'Sign off Audit' && pendingActions && pendingActions.length > 0)}
              onClick={() => handleStateChange(detailData.id, actionMethod)}
            >
              {actionButton}
            </Button>
          )}
        {(hxAuditUpdate && hxAuditUpdate.data
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
  actionMsg: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  actionButton: PropTypes.oneOfType([
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
