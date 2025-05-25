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
import moment from 'moment-timezone';
import { useSelector, useDispatch } from 'react-redux';

import auditBlue from '@images/icons/auditBlue.svg';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';

import {
  getDefaultNoValue, extractNameObject,
  getAllowedCompanies,
} from '../../util/appUtils';
import {
  updateHxTask,
  updateHxModule,
  resetHxTask,
  getConfigurationSummary,
} from '../siteService';
import DialogHeader from '../../commonComponents/dialogHeader';

const appModels = require('../../util/appModels').default;

const ReopenTask = ({
  actionModal, moduleData, detailData, atFinish, atCancel,
}) => {
  const dispatch = useDispatch();
  const [modal, setModal] = useState(actionModal);

  const [messageTicket, setMessageTicket] = useState('');

  const [timeoutLoading, setTimeoutLoading] = useState(false);

  const onMessageChange = (e) => {
    setMessageTicket(e.target.value);
  };

  const { hxTaskUpdate } = useSelector((state) => state.site);
  const { userInfo } = useSelector((state) => state.user);

  function getStatusCount(data, sta) {
    let res = 0;
    if (data && data.length) {
      const statusDatas = data.filter((item) => item.state === sta);
      res = statusDatas.length > 0 ? statusDatas.length : 0;
    }
    return res;
  }

  const handleStateChange = async (id, state) => {
    const payload = {
      comments: messageTicket,
      state: 'Open',
      done_on: false,
    };

    try {
      dispatch(updateHxTask(id, 'hx.onboarding_tasks', payload));
      const totalTasks = moduleData.onboarding_task_ids && moduleData.onboarding_task_ids.length > 0 ? moduleData.onboarding_task_ids.length : 0;
      const completedTasks = getStatusCount(moduleData.onboarding_task_ids, 'Done');
      if (moduleData && moduleData.state === 'In Progress') {
        let payload1 = {
          state: 'In Progress',
        };
        if (parseInt(completedTasks) === 1) {
          payload1 = {
            state: 'Open',
            done_on: false,
          };

          setTimeout(() => {
            dispatch(updateHxModule(moduleData.id, appModels.HXONBOARDING, payload1));
          }, 1000);
        }
      } else if (moduleData && moduleData.state === 'Done') {
        const payload1 = {
          state: parseInt(completedTasks) === 1 ? 'Open' : 'In Progress',
          done_on: false,
        };

        if (parseInt(totalTasks) === parseInt(completedTasks)) {
          setTimeout(() => {
            dispatch(updateHxModule(moduleData.id, appModels.HXONBOARDING, payload1));
          }, 1000);
        }
      }
    } catch (error) {
      console.error('Error updating reason or changing state:', error);
    } finally {
    // Set loading to false once everything is complete
      setTimeoutLoading(false);
    }
  };

  const toggle = () => {
    if (hxTaskUpdate && hxTaskUpdate.data && userInfo && userInfo.data && userInfo.data.company) {
      dispatch(getConfigurationSummary(userInfo.data.company.id, appModels.HXONBOARDING, 'noload'));
    }
    dispatch(resetHxTask());
    atFinish();
  };

  const toggleCancel = () => {
    setModal(!modal);
    dispatch(resetHxTask());
    atCancel();
  };

  const loading = (hxTaskUpdate && hxTaskUpdate.loading) || timeoutLoading;

  return (

    <Dialog maxWidth="lg" minWidth="lg" open={actionModal}>
      <DialogHeader title="Reopen the Task" onClose={toggleCancel} response={hxTaskUpdate} />
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
                    </Box>
                  </Box>
                </CardBody>
              )}
            </Card>
            {hxTaskUpdate && !hxTaskUpdate.data && !loading && (
              <Row className="ml-2 mr-2 mt-0">
                <Col xs={12} sm={12} md={12} lg={12} className="col-auto">
                  <Label className="mt-0">
                    Comments
                    {' '}
                    <span className="ml-1 text-danger" />
                  </Label>
                  <Input type="textarea" name="body" label="Action Taken" placeholder="Enter here" value={messageTicket} onChange={onMessageChange} className="bg-whitered" rows="4" />
                </Col>
              </Row>
            )}
            <Row className="justify-content-center">
              {hxTaskUpdate && hxTaskUpdate.data && !loading && (
                <SuccessAndErrorFormat response={hxTaskUpdate} successMessage="The Task has been reopened successfully.." />
              )}
              {hxTaskUpdate && hxTaskUpdate.err && (
                <SuccessAndErrorFormat response={hxTaskUpdate} />
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
        {hxTaskUpdate && hxTaskUpdate.data
          ? ''
          : (
            <Button
              type="button"
              variant="contained"
              className="submit-btn-auto"
              disabled={loading}
              onClick={() => handleStateChange(detailData.id)}
            >
              Reopen
            </Button>
          )}
        {(hxTaskUpdate && hxTaskUpdate.data
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

export default ReopenTask;
