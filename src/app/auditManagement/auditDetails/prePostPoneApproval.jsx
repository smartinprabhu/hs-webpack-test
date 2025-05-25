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

import auditBlue from '@images/icons/auditBlue.svg';
import SuccessAndErrorFormat from '@shared/successAndErrorFormatMui';
import Loader from '@shared/loading';

import {
  getDefaultNoValue, extractNameObject,
  getAllowedCompanies, getCompanyTimezoneDate,
  getJsonString,
  isJsonString,
} from '../../util/appUtils';
import {
  updateHxAudit,
  getHxAuditDetails,
} from '../auditService';
import DialogHeader from '../../commonComponents/dialogHeader';

const appModels = require('../../util/appModels').default;

const PrePostPoneApproval = (props) => {
  const {
    detailData, offset, actionModal, atFinish, atCancel,
  } = props;
  const dispatch = useDispatch();
  const [modal, setModal] = useState(actionModal);

  const [messageTicket, setMessageTicket] = useState('');

  const [timeoutLoading, setTimeoutLoading] = useState(false);

  const [type, setType] = useState('');

  const onMessageChange = (e) => {
    setMessageTicket(e.target.value);
  };

  const { hxAuditUpdate } = useSelector((state) => state.hxAudits);

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);

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

  const pendingdata = detailData && detailData.prepone_approval_ids && detailData.prepone_approval_ids.length ? detailData.prepone_approval_ids.filter((item) => item.state === 'Pending') : [];

  const pendingDetail = pendingdata && pendingdata.length ? pendingdata[pendingdata.length - 1] : false;

  const handleStateChange = async (id) => {
    if (pendingDetail && pendingDetail.id) {
      setType('cancel');
      const payload = {
        remarks: messageTicket,
        state: 'Cancelled',
      };

      const postDataValues = {
        prepone_approval_ids: [[1, pendingDetail.id, payload]],
        is_pending_for_approval: false,
      };

      try {
        dispatch(updateHxAudit(id, appModels.HXAUDIT, postDataValues));
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

  const handleApproveChange = async (id) => {
    if (pendingDetail && pendingDetail.id) {
      setType('approve');
      const payload = {
        approved_on: moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss'),
        remarks: messageTicket,
        approved_by_id: userInfo && userInfo.data && userInfo.data.id,
        state: 'Approved',
      };

      const postDataValues = {
        prepone_approval_ids: [[1, pendingDetail.id, payload]],
        is_pending_for_approval: false,
        planned_start_date: getJsonData(pendingDetail.data, 'proposed_start_date'),
        planned_end_date: getJsonData(pendingDetail.data, 'proposed_end_date'),
      };

      try {
        dispatch(updateHxAudit(id, appModels.HXAUDIT, postDataValues));
      } catch (error) {
        console.error('Error updating reason or changing state:', error);
      } finally {
      // Set loading to false once everything is complete
        setTimeoutLoading(false);
      }
    }
  };

  return (

    <Dialog maxWidth="lg" minWidth="lg" open={actionModal}>
      <DialogHeader title="Prepone / Postpone Approval" onClose={toggleCancel} response={hxAuditUpdate} />
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
            <Card className="border-5 mt-0 ml-4 mb-2 mr-4 border-secondary rounded-0 border-top-0 border-right-0 border-bottom-0">
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
                    </Box>
                  </Box>
                </CardBody>
              )}
            </Card>
            {hxAuditUpdate && !hxAuditUpdate.data && !loading && (
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
                  <p className="font-family-tab">{getDefaultNoValue(getCompanyTimezoneDate(detailData.planned_start_date, userInfo, 'datetime'))}</p>
                </Col>
                <Col xs={12} sm={12} md={6} lg={6} className="col-auto">
                  <Label className="mt-0 font-family-tab font-tiny font-weight-400">
                    Planned End Date
                    {' '}
                    <span className="ml-1 text-danger" />
                  </Label>
                  <p className="font-family-tab">{getDefaultNoValue(getCompanyTimezoneDate(detailData.planned_end_date, userInfo, 'datetime'))}</p>
                </Col>
                <Col xs={12} sm={12} md={6} lg={6} className="col-auto">
                  <Label className="mt-0 font-family-tab font-tiny font-weight-400">
                    Requested Start Date
                    {' '}
                    <span className="ml-1 text-danger" />
                  </Label>
                  <p className="font-family-tab">{getDefaultNoValue(getCompanyTimezoneDate(getJsonData(pendingDetail.data, 'proposed_start_date'), userInfo, 'datetime'))}</p>
                </Col>
                <Col xs={12} sm={12} md={6} lg={6} className="col-auto">
                  <Label className="mt-0 font-family-tab font-tiny font-weight-400">
                    Requested End Date
                    {' '}
                    <span className="ml-1 text-danger" />
                  </Label>
                  <p className="font-family-tab">{getDefaultNoValue(getCompanyTimezoneDate(getJsonData(pendingDetail.data, 'proposed_end_date'), userInfo, 'datetime'))}</p>
                </Col>
                <Col xs={12} sm={12} md={12} lg={12} className="col-auto">
                  <Label className="mt-0 font-family-tab">
                    Remarks
                    {' '}
                    <span className="ml-1 text-danger" />
                  </Label>
                  <Input type="textarea" name="body" label="Action Taken" placeholder="Enter here" value={messageTicket} onChange={onMessageChange} className="bg-whitered" rows="2" />
                </Col>
              </Row>
            )}
            <Row className="justify-content-center font-family-tab">
              {hxAuditUpdate && hxAuditUpdate.data && !loading && (
                <SuccessAndErrorFormat response={hxAuditUpdate} successMessage={type === 'cancel' ? 'The Audit Prepone and Postpone Request has been rejected.' : 'The Audit has been rescheduled successfully..'} />
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
            <>
              <Button
                type="button"
                variant="contained"
                className="reset-btn-new1 mr-2"
                disabled={loading}
                onClick={() => handleStateChange(detailData.id)}
              >

                Reject Request
              </Button>
              <Button
                type="button"
                variant="contained"
                className="submit-btn-auto"
                disabled={loading}
                onClick={() => handleApproveChange(detailData.id)}
              >

                Approve Request
              </Button>
            </>
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

PrePostPoneApproval.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  actionModal: PropTypes.oneOfType([
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
export default PrePostPoneApproval;
