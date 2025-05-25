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
  getJsonString,
  isJsonString,
  isValidValue,
} from '../../../util/appUtils';
import {
  getPPMDetail,
} from '../../../inspectionSchedule/inspectionService';
import { updateProductCategory } from '../../../pantryManagement/pantryService';
import DialogHeader from '../../../commonComponents/dialogHeader';

const appModels = require('../../../util/appModels').default;

const PrepostPoneCancel = (props) => {
  const {
    detailData, requestData, actionModal, atFinish, atCancel,
  } = props;
  const dispatch = useDispatch();
  const [modal, setModal] = useState(actionModal);

  const [messageTicket, setMessageTicket] = useState('');

  const [timeoutLoading, setTimeoutLoading] = useState(false);

  const [type, setType] = useState('');

  const onMessageChange = (e) => {
    setMessageTicket(e.target?.value?.trimStart() || '');
  };

  const { updateProductCategoryInfo } = useSelector((state) => state.pantry);

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);

  const toggle = () => {
    if (updateProductCategoryInfo && updateProductCategoryInfo.data) {
      dispatch(getPPMDetail(companies, appModels.PPMWEEK, detailData.id));
    }
    atFinish();
  };

  const toggleCancel = () => {
    setModal(!modal);
    atCancel();
  };

  const loading = (updateProductCategoryInfo && updateProductCategoryInfo.loading) || timeoutLoading;

  const pendingdata = requestData && requestData.prepone_postpone_approval_ids && requestData.prepone_postpone_approval_ids.length ? requestData.prepone_postpone_approval_ids.filter((item) => item.state === 'Pending') : [];

  const pendingDetail = pendingdata && pendingdata.length ? pendingdata[pendingdata.length - 1] : false;

  const handleStateChange = async (id) => {
    if (pendingDetail && pendingDetail.id) {
      setType('cancel');
      const payload = {
        remarks: messageTicket,
        state: 'Cancelled',
      };

      const postDataValues = {
        prepone_postpone_approval_ids: [[1, pendingDetail.id, payload]],
        // is_pending_for_approval: false,
      };

      try {
        dispatch(updateProductCategory(id, 'ppm.scheduler_week', postDataValues));
      } catch (error) {
        console.error('Error updating reason or changing state:', error);
      } finally {
      // Set loading to false once everything is complete
        setTimeoutLoading(false);
      }
    }
  };

  function getJsonData(json, field) {
    let res = false;
    if (json && field) {
      if (isJsonString(json) && getJsonString(json) && getJsonString(json)[field]) {
        res = getJsonString(json)[field];
      }
    }
    return res;
  }

  return (

    <Dialog PaperProps={{ style: { width: '600px', maxWidth: '600px' } }} open={actionModal}>
      <DialogHeader title="Withdraw Prepone/Postpone Request" onClose={toggleCancel} response={updateProductCategoryInfo} />
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
            {updateProductCategoryInfo && !updateProductCategoryInfo.data && !loading && (
              <Row className="ml-2 mr-2 mt-0">
                <Col xs={12} sm={12} md={6} lg={6} className="col-auto">
                  <Label className="mt-0 font-family-tab font-tiny font-weight-400">
                    Requested by
                    {' '}
                    <span className="ml-1 text-danger" />
                  </Label>
                  <p className="font-family-tab">{getDefaultNoValue(extractNameObject(pendingDetail.requested_by_id, 'name'))}</p>
                </Col>
                <Col xs={12} sm={12} md={6} lg={6} className="col-auto">
                  <Label className="mt-0 font-family-tab font-tiny font-weight-400">
                    Requested On
                    {' '}
                    <span className="ml-1 text-danger" />
                  </Label>
                  <p className="font-family-tab">{getDefaultNoValue(getCompanyTimezoneDate(pendingDetail.requested_on, userInfo, 'datetime'))}</p>
                </Col>
                <Col xs={12} sm={12} md={6} lg={6} className="col-auto">
                  <Label className="mt-0 font-family-tab font-tiny font-weight-400">
                    Planned Start Date
                    {' '}
                    <span className="ml-1 text-danger" />
                  </Label>
                  <p className="font-family-tab">{getDefaultNoValue(getCompanyTimezoneDate(detailData.starts_on, userInfo, 'date'))}</p>
                </Col>
                <Col xs={12} sm={12} md={6} lg={6} className="col-auto">
                  <Label className="mt-0 font-family-tab font-tiny font-weight-400">
                    Planned End Date
                    {' '}
                    <span className="ml-1 text-danger" />
                  </Label>
                  <p className="font-family-tab">{getDefaultNoValue(getCompanyTimezoneDate(detailData.ends_on, userInfo, 'date'))}</p>
                </Col>
                <Col xs={12} sm={12} md={6} lg={6} className="col-auto">
                  <Label className="mt-0 font-family-tab font-tiny font-weight-400">
                    Requested Start Date
                    {' '}
                    <span className="ml-1 text-danger" />
                  </Label>
                  <p className="font-family-tab">{getDefaultNoValue(getCompanyTimezoneDate(getJsonData(pendingDetail.data, 'proposed_start_date'), userInfo, 'date'))}</p>
                </Col>
                <Col xs={12} sm={12} md={6} lg={6} className="col-auto">
                  <Label className="mt-0 font-family-tab font-tiny font-weight-400">
                    Requested End Date
                    {' '}
                    <span className="ml-1 text-danger" />
                  </Label>
                  <p className="font-family-tab">{getDefaultNoValue(getCompanyTimezoneDate(getJsonData(pendingDetail.data, 'proposed_end_date'), userInfo, 'date'))}</p>
                </Col>
                <Col xs={12} sm={12} md={12} lg={12} className="col-auto">
                  <Label className="mt-0 font-family-tab">
                    Remarks
                    {' '}
                    <span className="ml-1 text-danger font-weight-800"> * </span>
                  </Label>
                  <Input type="textarea" name="body" label="Action Taken" placeholder="Enter here" value={messageTicket} onChange={onMessageChange} className="bg-whitered" rows="2" />
                </Col>
              </Row>
            )}
            <Row className="justify-content-center font-family-tab">
              {updateProductCategoryInfo && updateProductCategoryInfo.data && !loading && (
                <SuccessAndErrorFormat response={updateProductCategoryInfo} successMessage="The Prepone/Postpone PPM request has been withdrawn." />
              )}
              {updateProductCategoryInfo && updateProductCategoryInfo.err && (
                <SuccessAndErrorFormat response={updateProductCategoryInfo} />
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
        {updateProductCategoryInfo && updateProductCategoryInfo.data
          ? ''
          : (
            <Button
              type="button"
              variant="contained"
              className="submit-btn-auto mr-2"
              disabled={loading || !isValidValue(messageTicket)}
              onClick={() => handleStateChange(detailData.id)}
            >

              Cancel Request
            </Button>
          )}
        {(updateProductCategoryInfo && updateProductCategoryInfo.data
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

PrepostPoneCancel.propTypes = {
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
export default PrepostPoneCancel;
