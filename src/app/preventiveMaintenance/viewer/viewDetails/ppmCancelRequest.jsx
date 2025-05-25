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
import moment from 'moment-timezone';

import workOrdersBlue from '@images/icons/workOrders.svg';
import SuccessAndErrorFormat from '@shared/successAndErrorFormatMui';
import Loader from '@shared/loading';

import {
  getDefaultNoValue, extractNameObject,
  getAllowedCompanies, getCompanyTimezoneDate,
  isValidValue,
} from '../../../util/appUtils';
import {
  getPPMDetail,
} from '../../../inspectionSchedule/inspectionService';
import { createCancelReq } from '../../ppmService';
import DialogHeader from '../../../commonComponents/dialogHeader';

const appModels = require('../../../util/appModels').default;

const PpmCancelRequest = (props) => {
  const {
    detailData, actionModal, atFinish, atCancel,
  } = props;
  const dispatch = useDispatch();
  const [modal, setModal] = useState(actionModal);

  const [messageTicket, setMessageTicket] = useState('');

  const [timeoutLoading, setTimeoutLoading] = useState(false);

  const onMessageChange = (e) => {
    setMessageTicket(e.target?.value?.trimStart() || '');
  };

  const { hxCreatePpmCancelRequest } = useSelector((state) => state.ppm);

  const {
    ppmSettingsInfo,
  } = useSelector((state) => state.site);

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);

  const configData = ppmSettingsInfo && ppmSettingsInfo.data && ppmSettingsInfo.data.length ? ppmSettingsInfo.data[0] : false;

  const addDays = (days, date) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  const toggle = () => {
    if (hxCreatePpmCancelRequest && hxCreatePpmCancelRequest.data) {
      dispatch(getPPMDetail(companies, appModels.PPMWEEK, detailData.id));
    }
    atFinish();
  };

  const toggleCancel = () => {
    setModal(!modal);
    atCancel();
  };

  const loading = (hxCreatePpmCancelRequest && hxCreatePpmCancelRequest.loading) || timeoutLoading;

  const handleStateChange = async (id) => {
    try {
      let postData = {};
      if (configData && configData.approval_required_for_cancel) {
        postData = {
          requested_on: moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss'),
          reason: messageTicket,
          requested_by_id: userInfo && userInfo.data && userInfo.data.id,
          cancel_approval_authority: configData && configData.cancel_approval_authority && configData.cancel_approval_authority.id ? configData.cancel_approval_authority.id : false,
          state: 'Pending',
          rec_id: id,
          expires_on: configData.cancel_approval_lead_days ? moment(addDays(configData.cancel_approval_lead_days, new Date())).utc().format('YYYY-MM-DD HH:mm:ss') : moment().endOf('day').utc().format('YYYY-MM-DD HH:mm:ss'),
          rec_model: 'ppm.scheduler_week',
          ppm_scheduler_ids: [[6, 0, [id]]],
        };
      } else {
        postData = {
          requested_on: moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss'),
          reason: messageTicket,
          requested_by_id: userInfo && userInfo.data && userInfo.data.id,
          // cancel_approval_authority: configData && configData.cancel_approval_authority && configData.cancel_approval_authority.id ? configData.cancel_approval_authority.id : false,
          state: 'Approved',
          rec_id: id,
          expires_on: configData.cancel_approval_lead_days ? moment(addDays(configData.cancel_approval_lead_days, new Date())).utc().format('YYYY-MM-DD HH:mm:ss') : moment().endOf('day').utc().format('YYYY-MM-DD HH:mm:ss'),
          rec_model: 'ppm.scheduler_week',
          approved_on: moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss'),
          approved_by_id: userInfo && userInfo.data && userInfo.data.id,
          ppm_scheduler_ids: [[6, 0, [id]]],
        };
      }

      const payload = { model: 'ppm.scheduler_cancel', values: postData };
      dispatch(createCancelReq('ppm.scheduler_cancel', payload));
    } catch (error) {
      console.error('Error updating reason or changing state:', error);
    } finally {
      // Set loading to false once everything is complete
      setTimeoutLoading(false);
    }
  };

  return (

    <Dialog PaperProps={{ style: { width: '600px', maxWidth: '600px' } }} open={actionModal}>
      <DialogHeader title="Cancel PPM" onClose={toggleCancel} response={hxCreatePpmCancelRequest} />
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Box
            sx={{
              width: '100%',
              height: '100%',
              backgroundColor: '#F6F8FA',
              padding: '10px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10%',
              fontFamily: 'Suisse Intl',
            }}
          >
            <Card className="border-5 mt-0 ml-4 mb-2 mr-4 border-secondary rounded-0 border-top-0 border-right-0 border-bottom-0">
              {detailData && (
                <CardBody data-testid="success-case" className="bg-lightblue p-3">
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                    <img src={workOrdersBlue} alt="asset" width="40" height="35" style={{ alignSelf: 'flex-start' }} />
                    <Box>
                      <Typography variant="h6" sx={{ fontSize: '1rem' }} className="mb-1">
                        {getDefaultNoValue(detailData.name)}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" className="font-family-tab">
                        <span className="font-weight-800 font-family-tab font-side-heading mr-1">Asset: </span>
                        {getDefaultNoValue(detailData.asset_name)}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" className="font-family-tab">
                        <span className="font-weight-800 font-family-tab font-side-heading mr-1">Maintenance Team: </span>
                        {getDefaultNoValue(detailData.maintenance_team_name)}
                      </Typography>
                    </Box>
                  </Box>
                </CardBody>
              )}
            </Card>
            {hxCreatePpmCancelRequest && !hxCreatePpmCancelRequest.data && !loading && (

              <Row className="ml-2 mr-2 mt-0">

                <Col xs={12} sm={12} md={12} lg={12} className="mt-3 col-auto">
                  <Label className="mt-0 font-family-tab">
                    Reason
                    {' '}
                    <span className="ml-1 text-danger font-weight-800"> * </span>
                  </Label>
                  <Input type="textarea" name="body" label="Action Taken" placeholder="Enter here" value={messageTicket} onChange={onMessageChange} className="bg-whitered" rows="2" />
                </Col>
              </Row>

            )}
            <Row className="justify-content-center font-family-tab">
              {hxCreatePpmCancelRequest && hxCreatePpmCancelRequest.data && !loading && (
                <SuccessAndErrorFormat response={hxCreatePpmCancelRequest} successMessage={configData && configData.approval_required_for_cancel ? 'The cancellation request for the PPM has been created.' : 'The PPM has been cancelled successfully..'} />
              )}
              {configData && configData.approval_required_for_cancel && hxCreatePpmCancelRequest && !hxCreatePpmCancelRequest.data && !loading && (
              <SuccessAndErrorFormat response={false} staticInfoMessage="Cancellation of PPM requires approval." />
              )}
              {hxCreatePpmCancelRequest && hxCreatePpmCancelRequest.err && (
                <SuccessAndErrorFormat response={hxCreatePpmCancelRequest} />
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
        {hxCreatePpmCancelRequest && hxCreatePpmCancelRequest.data
          ? ''
          : (
            <Button
              type="button"
              variant="contained"
              className="submit-btn-auto"
              disabled={loading || !isValidValue(messageTicket)}
              onClick={() => handleStateChange(detailData.id)}
            >
              {configData && configData.approval_required_for_cancel ? 'Request' : 'Cancel'}
            </Button>
          )}
        {(hxCreatePpmCancelRequest && hxCreatePpmCancelRequest.data
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

PpmCancelRequest.propTypes = {
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
export default PpmCancelRequest;
