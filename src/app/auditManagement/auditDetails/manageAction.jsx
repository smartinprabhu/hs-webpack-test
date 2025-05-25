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
  hxAuditActionStatusJson,
} from '../../commonComponents/utils/util';

import {
  getDefaultNoValue, extractNameObject,
  getAllowedCompanies,
} from '../../util/appUtils';
import {
  getHxAuditActionDetail,
  updateHxAudit,
  getHxAuditActionPerform,
} from '../auditService';
import DialogHeader from '../../commonComponents/dialogHeader';

const appModels = require('../../util/appModels').default;

const ManageAction = (props) => {
  const {
    detailData, offset, actionModal, atFinish, atCancel, actionMethod, actionButton, actionMsg,
  } = props;
  const dispatch = useDispatch();
  const [modal, setModal] = useState(actionModal);

  const [messageTicket, setMessageTicket] = useState('');
  const [resolution, setResolution] = useState('');

  const [timeoutLoading, setTimeoutLoading] = useState(false);

  const onMessageChange = (e) => {
    setMessageTicket(e.target.value);
  };

  const onResolutionChange = (e) => {
    setResolution(e.target.value);
  };

  const { hxAuditUpdate, hxAuditActionPerform } = useSelector((state) => state.hxAudits);

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);

  useEffect(() => {
    if (hxAuditActionPerform && hxAuditActionPerform.loading) {
      setTimeoutLoading(false);
    }
  }, [hxAuditActionPerform]);

  const handleStateChange = async (id, state) => {
    const payload = {
      resolution,
    };
    const context = { reason: messageTicket };

    try {
      if (resolution || (detailData.state === 'Closed' && actionButton.displayname === 'Set to Draft')) {
        setTimeoutLoading(true);
        dispatch(updateHxAudit(detailData.id, appModels.HXAUDITACTION, payload));
        setTimeout(() => {
          dispatch(getHxAuditActionPerform(id, state, appModels.HXAUDITACTION, context));
        }, 1500);
      } else {
        dispatch(getHxAuditActionPerform(id, state, appModels.HXAUDITACTION, context));
      }
    } catch (error) {
      console.error('Error updating reason or changing state:', error);
    } finally {
    // Set loading to false once everything is complete
      // setTimeoutLoading(false);
    }
  };

  const toggle = () => {
    if (hxAuditActionPerform && hxAuditActionPerform.data) {
      dispatch(getHxAuditActionDetail(detailData.id, appModels.HXAUDITACTION));
    }
    atFinish();
  };

  const toggleCancel = () => {
    setModal(!modal);
    atCancel();
  };

  const loading = (hxAuditUpdate && hxAuditUpdate.loading) || (hxAuditActionPerform && hxAuditActionPerform.loading) || timeoutLoading;

  const checkAuditStatus = (val) => (
    <Box>
      {hxAuditActionStatusJson.map(
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
      <DialogHeader title={detailData.state === 'Closed' && actionButton.displayname === 'Set to Draft' ? 'Reopen' : actionButton} onClose={toggleCancel} response={hxAuditActionPerform} />
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
                        <span className="font-weight-800 font-family-tab font-side-heading mr-1">Type: </span>
                        {getDefaultNoValue(detailData.type)}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" className="font-family-tab">
                        <span className="font-weight-800 font-family-tab font-side-heading mr-1">Severity: </span>
                        {getDefaultNoValue(detailData.severity)}
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
            {hxAuditActionPerform && !hxAuditActionPerform.data && !loading && (
              <Row className="ml-2 mr-2 mt-0">
                <Col xs={12} sm={12} md={12} lg={12} className="col-auto">
                  <Label className="mt-0">
                    Remarks
                    {' '}
                    <span className="ml-1 text-danger" />
                  </Label>
                  <Input type="textarea" name="body" label="Action Taken" placeholder="Enter remarks here" value={messageTicket} onChange={onMessageChange} className="bg-whitered" rows="4" />
                </Col>
                {actionButton === 'Close' && (
                <Col xs={12} sm={12} md={12} lg={12} className="col-auto">
                  <Label className="mt-0">
                    Resolution
                    {' '}
                    <span className="ml-1 text-danger" />
                  </Label>
                  <Input type="textarea" name="Resolution" label="Resolution" placeholder="Enter Resolution here" value={resolution} onChange={onResolutionChange} className="bg-whitered" rows="4" />
                </Col> 
                )}
              </Row>
            )}
            <Row className="justify-content-center">
              {hxAuditActionPerform && hxAuditActionPerform.data && !loading && (
                <SuccessAndErrorFormat response={hxAuditActionPerform} successMessage={detailData.state === 'Closed' && actionButton.displayname === 'Set to Draft' ? 'This audit action has been reopened successfully..' : actionMsg} />
              )}
              {hxAuditActionPerform && hxAuditActionPerform.err && (
                <SuccessAndErrorFormat response={hxAuditActionPerform} />
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
        {hxAuditActionPerform && hxAuditActionPerform.data
          ? ''
          : (
            <Button
              type="button"
              variant="contained"
              className="submit-btn-auto"
              disabled={loading}
              onClick={() => handleStateChange(detailData.id, actionMethod)}
            >
              {detailData.state === 'Closed' && actionButton.displayname === 'Set to Draft' ? 'Reopen' : actionButton}
            </Button>
          )}
        {(hxAuditActionPerform && hxAuditActionPerform.data
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

ManageAction.propTypes = {
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
export default ManageAction;
