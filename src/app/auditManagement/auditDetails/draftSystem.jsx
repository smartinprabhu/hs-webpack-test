/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable max-len */
/* eslint-disable radix */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import {
  Card,
  CardBody,
  Row,
} from 'reactstrap';
import { Box } from '@mui/system';
import {
  Button,
  Typography,
  Dialog, DialogActions, DialogContent, DialogContentText,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';

import auditBlue from '@images/icons/auditBlue.svg';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';

import {
  getDefaultNoValue, extractNameObject,
  getAllowedCompanies,
} from '../../util/appUtils';
import {
  updateHxSystem,
  getHxAuditSystemDetail,
  resetUpdateSystem,
} from '../auditService';
import DialogHeader from '../../commonComponents/dialogHeader';

const appModels = require('../../util/appModels').default;

const DraftSystem = ({
  actionModal, detailData, atFinish, atCancel,
}) => {
  const dispatch = useDispatch();
  const [modal, setModal] = useState(actionModal);

  const [timeoutLoading, setTimeoutLoading] = useState(false);

  const { hxSystemUpdate } = useSelector((state) => state.hxAudits);

  const handleStateChange = async (id) => {
    try {
      const payload = {
        state: 'Draft',
      };

      dispatch(updateHxSystem(id, appModels.HXSYSTEM, payload));
    } catch (error) {
      console.error('Error updating reason or changing state:', error);
    } finally {
    // Set loading to false once everything is complete
      setTimeoutLoading(false);
    }
  };

  const toggle = () => {
    if (hxSystemUpdate && hxSystemUpdate.data && detailData && detailData.id) {
      dispatch(getHxAuditSystemDetail(detailData.id, appModels.HXSYSTEM));
    }
    dispatch(resetUpdateSystem());
    atFinish();
  };

  const toggleCancel = () => {
    setModal(!modal);
    dispatch(resetUpdateSystem());
    atCancel();
  };

  const loading = (hxSystemUpdate && hxSystemUpdate.loading) || timeoutLoading;

  return (

    <Dialog maxWidth="lg" minWidth="lg" open={modal}>
      <DialogHeader title="Set to Draft" onClose={toggleCancel} response={hxSystemUpdate} />
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
                      <Typography variant="h6" sx={{ fontSize: '1rem' }} className="mb-1 font-family-tab">
                        {getDefaultNoValue(detailData.name)}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" className="font-family-tab">
                        <span className="font-weight-800 font-family-tab font-side-heading mr-1">Department: </span>
                        {getDefaultNoValue(extractNameObject(detailData.department_id, 'name'))}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" className="font-family-tab">
                        <span className="font-weight-800 font-family-tab font-side-heading mr-1">Scope: </span>
                        {getDefaultNoValue(detailData.scope)}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" className="font-family-tab">
                        <span className="font-weight-800 font-family-tab font-side-heading mr-1">Objective: </span>
                        {getDefaultNoValue(detailData.objective)}
                      </Typography>
                    </Box>
                  </Box>
                </CardBody>
              )}
            </Card>

            <Row className="justify-content-center">
              {hxSystemUpdate && hxSystemUpdate.data && !loading && (
                <SuccessAndErrorFormat response={hxSystemUpdate} successMessage="The System has been set to draft successfully.." />
              )}
              {hxSystemUpdate && hxSystemUpdate.err && (
                <SuccessAndErrorFormat response={hxSystemUpdate} />
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
        {hxSystemUpdate && hxSystemUpdate.data
          ? ''
          : (
            <Button
              type="button"
              variant="contained"
              className="submit-btn-auto"
              disabled={loading}
              onClick={() => handleStateChange(detailData.id)}
            >
              Set to Draft
            </Button>
          )}
        {(hxSystemUpdate && hxSystemUpdate.data
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

export default DraftSystem;
