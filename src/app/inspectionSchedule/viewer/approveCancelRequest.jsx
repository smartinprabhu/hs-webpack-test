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
} from 'reactstrap';
import FormLabel from '@mui/material/FormLabel';
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
} from '../../util/appUtils';
import {
  getHxInspCancelDetails,
} from '../inspectionService';
import { updateCancelReq } from '../../preventiveMaintenance/ppmService';
import DialogHeader from '../../commonComponents/dialogHeader';

const appModels = require('../../util/appModels').default;

const ApproveCancelRequest = (props) => {
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

  const { hxUpdatePpmCancelRequest } = useSelector((state) => state.ppm);

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);

  const toggle = () => {
    if (hxUpdatePpmCancelRequest && hxUpdatePpmCancelRequest.data) {
      dispatch(getHxInspCancelDetails(detailData.id, appModels.HXINSPECTIONCANCEL));
    }
    atFinish();
  };

  const toggleCancel = () => {
    setModal(!modal);
    atCancel();
  };

  const loading = (hxUpdatePpmCancelRequest && hxUpdatePpmCancelRequest.loading) || timeoutLoading;


  const handleStateChange = async (id) => {
    if (detailData && detailData.id) {
      setType('cancel');
      const payload = {
        remarks: messageTicket,
        state: 'Rejected',
      };

      try {
        dispatch(updateCancelReq(detailData.id, 'hx.inspection_cancel', payload));
      } catch (error) {
        console.error('Error updating reason or changing state:', error);
      } finally {
      // Set loading to false once everything is complete
        setTimeoutLoading(false);
      }
    }
  };

  const handleApproveChange = async (id) => {
    if (detailData && detailData.id) {
      setType('approve');
      const payload = {
        approved_on: moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss'),
        remarks: messageTicket,
        approved_by_id: userInfo && userInfo.data && userInfo.data.id,
        state: 'Approved',
      };

      try {
        dispatch(updateCancelReq(detailData.id, 'hx.inspection_cancel', payload));
      } catch (error) {
        console.error('Error updating reason or changing state:', error);
      } finally {
      // Set loading to false once everything is complete
        setTimeoutLoading(false);
      }
    }
  };

  return (

    <Dialog PaperProps={{ style: { width: '600px', maxWidth: '600px' } }} open={actionModal}>
      <DialogHeader title="Approve/Reject Cancellation Request" onClose={toggleCancel} response={hxUpdatePpmCancelRequest} />
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
                        {getDefaultNoValue(extractNameObject(detailData.requested_by_id, 'name'))}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" className="font-family-tab">
                        <span className="font-weight-800 font-family-tab font-side-heading mr-1">Requested On: </span>
                        {getDefaultNoValue(getCompanyTimezoneDate(detailData.requested_on, userInfo, 'datetime'))}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" className="font-family-tab">
                        <span className="font-weight-800 font-family-tab font-side-heading mr-1">Expires On: </span>
                        {getDefaultNoValue(getCompanyTimezoneDate(detailData.expires_on, userInfo, 'datetime'))}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" className="font-family-tab">
                        <span className="font-weight-800 font-family-tab font-side-heading mr-1">Reason: </span>
                        {getDefaultNoValue(detailData.reason)}
                      </Typography>
                    </Box>
                  </Box>
                </CardBody>
              )}
            </Card>
            {hxUpdatePpmCancelRequest && !hxUpdatePpmCancelRequest.data && !loading && (
              <Row className="ml-2 mr-2 mt-0">
                <Col xs={12} sm={12} md={12} lg={12} className="col-auto">
                  <FormLabel id="demo-row-radio-buttons-group-label" className="font-family-tab font-tiny">
                    Remarks
                    {' '}
                    <span className="ml-1 text-danger font-weight-800"> * </span>
                  </FormLabel>
                  <Input type="textarea" name="body" label="Action Taken" placeholder="Enter here" value={messageTicket} onChange={onMessageChange} className="bg-whitered" rows="2" />
                </Col>
              </Row>
            )}
            <Row className="justify-content-center font-family-tab">
              {hxUpdatePpmCancelRequest && hxUpdatePpmCancelRequest.data && !loading && (
                <SuccessAndErrorFormat response={hxUpdatePpmCancelRequest} successMessage={type === 'cancel' ? 'The Cancellation Request for the Inspection has been rejected.' : 'The Inspection has been cancelled successfully..'} />
              )}
              {hxUpdatePpmCancelRequest && hxUpdatePpmCancelRequest.err && (
                <SuccessAndErrorFormat response={hxUpdatePpmCancelRequest} />
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
        {hxUpdatePpmCancelRequest && hxUpdatePpmCancelRequest.data
          ? ''
          : (
            <>
              <Button
                type="button"
                variant="contained"
                className="reset-btn-new1 mr-2"
                disabled={loading || !isValidValue(messageTicket)}
                onClick={() => handleStateChange(detailData.id)}
              >

                Reject Request
              </Button>
              <Button
                type="button"
                variant="contained"
                className="submit-btn-auto"
                disabled={loading || !isValidValue(messageTicket)}
                onClick={() => handleApproveChange(detailData.id)}
              >

                Approve Request
              </Button>
            </>
          )}
        {(hxUpdatePpmCancelRequest && hxUpdatePpmCancelRequest.data
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

ApproveCancelRequest.propTypes = {
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
export default ApproveCancelRequest;
