/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  Col,
  Input,
  Label,
  Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Dialog, DialogActions, DialogContent, DialogContentText,
  Button,
} from '@mui/material';
import DOMPurify from 'dompurify';

import workOrdersIcon from '@images/icons/workOrders.svg';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';
import {
  faTimesCircle, faCheckCircle, faArrowCircleRight, faStoreAlt,
} from '@fortawesome/free-solid-svg-icons';
import DialogHeader from '../../../commonComponents/dialogHeader';

import {
  resetPantryAction,
  getPantryDetail,
  getActionData,
  updateOrder,
  resetUpdateOrder,
} from '../../pantryService';
import {
  getDefaultNoValue, extractTextObject, extractNameObject,
} from '../../../util/appUtils';

const appModels = require('../../../util/appModels').default;

const faIcons = {
  Draft: faStoreAlt,
  Ordered: faCheckCircle,
  Confirmed: faCheckCircle,
  Delivered: faArrowCircleRight,
  Cancelled: faTimesCircle,
};

const ActionPantry = (props) => {
  const {
    details, actionModal, actionValue, actionMethod, actionHead, atFinish,
  } = props;
  const dispatch = useDispatch();
  const [modal, setModal] = useState(actionModal);

  const [messageTicket, setMessageTicket] = useState('');
  const [timeoutLoading, setTimeoutLoading] = useState(false);

  const onMessageChange = (e) => {
    setMessageTicket(e.target.value);
  };

  const toggle = () => {
    setModal(!modal);
    dispatch(resetUpdateOrder());
    dispatch(resetPantryAction());
    atFinish();
  };

  const toggleClose = () => {
    setModal(!modal);
    atFinish();
  };

  const { pantryOrderActionInfo } = useSelector((state) => state.pantry);

  const isResult = pantryOrderActionInfo && pantryOrderActionInfo.data && (pantryOrderActionInfo.data.data || pantryOrderActionInfo.data.status);
  const loading = (pantryOrderActionInfo && pantryOrderActionInfo.loading) || (details && details.loading) || timeoutLoading;
  const isError = pantryOrderActionInfo && pantryOrderActionInfo.err;

  useEffect(() => {
    dispatch(resetPantryAction());
    dispatch(resetUpdateOrder());
  }, []);

  useEffect(() => {
    const viewId = details && details.data ? details.data[0].id : '';
    if (viewId && isResult) {
      dispatch(getPantryDetail(viewId, appModels.PANTRYORDER));
    }
  }, [pantryOrderActionInfo]);

  const detailData = details && (details.data && details.data.length > 0) ? details.data[0] : '';

  const handleStateChange = (id, method) => {
    if (actionHead === 'Cancel') {
      const payload = {
        reason_for_cancellation_pantry: DOMPurify.sanitize(messageTicket),
      };
      dispatch(updateOrder(detailData.id, appModels.PANTRYORDER, payload));
      setTimeoutLoading(true);
      setTimeout(() => {
        dispatch(getActionData(id, method, appModels.PANTRYORDER));
        setTimeoutLoading(false);
      }, 1500);
    } else {
      dispatch(getActionData(id, method, appModels.PANTRYORDER));
    }
  };

  return (

    <Dialog maxWidth="xl" open={actionModal}>
      <DialogHeader fontAwesomeIcon={faIcons[actionValue]} title={actionHead} onClose={toggleClose} response={pantryOrderActionInfo} />
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Box
            sx={{
              width: '400px',
              height: '100%',
              backgroundColor: '#F6F8FA',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10%',
              fontFamily: 'Suisse Intl',
            }}
          >
            <Card className="border-5  border-secondary rounded-0 border-top-0 border-right-0 border-bottom-0">
              {!loading && details && (details.data && details.data.length > 0) && (
              <CardBody data-testid="success-case" className="bg-lightblue p-3">
                <Row>
                  <Col className="col-auto">
                    <img src={workOrdersIcon} alt="order" className="mt-1" width="50" height="45" />
                  </Col>
                  <Col className="col-auto">
                    <Row>
                      <h6 className="mb-1">
                        {getDefaultNoValue(detailData.name)}
                      </h6>
                    </Row>
                    <Row>
                      <Col className="col-auto p-0">
                        <span className="font-weight-800 font-side-heading mr-2">
                          Pantry :
                        </span>
                        <span className="font-weight-400">
                          {getDefaultNoValue(extractNameObject(detailData.pantry_id, 'name'))}
                        </span>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="col-auto p-0">
                        <span className="font-weight-800 font-side-heading mr-2">
                          Location :
                        </span>
                        <span className="font-weight-400">
                          {getDefaultNoValue(extractNameObject(detailData.space_id, 'path_name'))}
                        </span>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="col-auto p-0">
                        <span className="font-weight-800 font-side-heading mr-2">
                          Employee :
                        </span>
                        {detailData.order_create_type === 'Internal' && (
                        <span className="font-weight-400">
                          {getDefaultNoValue(extractTextObject(detailData.employee_id))}
                        </span>
                        )}
                        {detailData.order_create_type === 'External' && (
                        <span className="font-weight-400">
                          {getDefaultNoValue(detailData.employee_name)}
                        </span>
                        )}
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </CardBody>
              )}
            </Card>
            {!isResult && !loading && (actionHead === 'Cancel') && (
            <Row className="mt-1">
              <Col xs={12} sm={12} md={12} lg={12}>
                <Label className="mt-0">
                  Reason
                  {' '}
                  <span className="ml-1 text-danger">*</span>
                </Label>
                <Input type="textarea" name="body" label="Action Taken" placeholder="Enter here" value={messageTicket} onChange={onMessageChange} className="bg-whitered" rows="4" />
                {/*! messageTicket && (<span className="text-danger ml-1">Reason required</span>) */}
              </Col>
            </Row>
            )}
            <Row className="justify-content-center">
              {isResult && (details && !details.loading) && (
              <SuccessAndErrorFormat response={pantryOrderActionInfo} successMessage={`This order has been ${actionValue} successfully..`} />
              )}
              {isError && (
              <SuccessAndErrorFormat response={pantryOrderActionInfo} />
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
      <DialogActions className="mr-3 ml-3">
        {isResult
          ? ''
          : (
            <Button
              type="button"
              size="sm"
              variant="contained"
              className="submit-btn"
              disabled={loading || (actionHead === 'Cancel' && !messageTicket)}
              onClick={() => handleStateChange(detailData.id, actionMethod)}
            >
              {actionHead}
            </Button>
          )}
        {isResult && (
          <Button
            type="button"
            variant="contained"
            className="submit-btn"
            disabled={loading}
            onClick={toggle}
          >
            Ok
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

ActionPantry.propTypes = {
  details: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  actionModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  actionValue: PropTypes.string.isRequired,
  actionHead: PropTypes.string.isRequired,
  atFinish: PropTypes.func.isRequired,
  actionMethod: PropTypes.string.isRequired,
};
export default ActionPantry;
