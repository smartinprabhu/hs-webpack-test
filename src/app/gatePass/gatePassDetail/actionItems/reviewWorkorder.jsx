/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardBody,
  Col,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  Row,
} from 'reactstrap';
import Button from '@mui/material/Button';
import * as PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import DOMPurify from 'dompurify';

import ModalHeaderComponent from '@shared/modalHeaderComponent';
import workOrdersBlue from '@images/icons/workOrders.svg';
import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import {
  resetEscalate,
  getActionData,
  resetActionData,
  updatePartsOrder,
  resetUpdateParts,
} from '../../../workorders/workorderService';
import { getWorkOrderStateLabel } from '../../../workorders/utils/utils';
import {
  getDefaultNoValue,
  extractNameObject,
} from '../../../util/appUtils';

const appModels = require('../../../util/appModels').default;

const ReviewWorkorder = (props) => {
  const {
    detailData, reviewModal, atFinish, atCancel,
  } = props;
  const dispatch = useDispatch();
  const [model, setModal] = useState(reviewModal);
  const [messageTicket, setMessageTicket] = useState('');

  const { userInfo } = useSelector((state) => state.user);
  const { actionResultInfo, updatePartsOrderInfo } = useSelector((state) => state.workorder);

  const workData = detailData && detailData.data && detailData.data.length ? detailData.data[0] : false;

  const toggle = () => {
    setModal(!model);
    atFinish();
    dispatch(resetEscalate());
    dispatch(resetActionData());
  };

  const toggleCancel = () => {
    setModal(!model);
    atCancel();
  };

  useEffect(() => {
    if (updatePartsOrderInfo && updatePartsOrderInfo.data && workData && workData.id) {
      dispatch(getActionData(workData.id, 'action_closed', appModels.WORKPERMIT));
    }
  }, [updatePartsOrderInfo]);

  useEffect(() => {
    dispatch(resetEscalate());
    dispatch(resetActionData());
    dispatch(resetUpdateParts());
  }, []);

  const onMessageChange = (e) => {
    setMessageTicket(e.target.value);
  };

  const handleStateChange = () => {
    const oId = workData && workData.order_id && workData.order_id.id ? workData.order_id.id : false;
    const uId = userInfo && userInfo.data && userInfo.data.id ? userInfo.data.id : false;
    if (oId) {
      const postData = {
        review_status: 'Done',
        reviewed_by: uId,
        reviewed_remark: DOMPurify.sanitize(messageTicket),
        reviewed_on: moment().utc().format('YYYY-MM-DD HH:mm:ss'),
      };
      dispatch(updatePartsOrder(oId, postData, appModels.ORDER));
    }
  };

  const loading = (actionResultInfo && actionResultInfo.loading) || (updatePartsOrderInfo && updatePartsOrderInfo.loading);

  return (
    <Modal size="md" className="border-radius-50px modal-dialog-centered" isOpen={model}>
      <ModalHeaderComponent imagePath={workOrdersBlue} closeModalWindow={toggleCancel} title="Review Work Permit" response={updatePartsOrderInfo} />
      {workData && (
      <ModalBody>
        <Row className="ml-4 mr-4 mb-5">
          <Col sm="12" md="12" lg="12" xs="12">
            <Card className="bg-thinblue border-0">
              <CardBody className="p-3">
                <Row>
                  <Col sm="9" md="9" lg="9" xs="12">
                    <p className="font-weight-800 font-side-heading text-grey mb-1">
                      {getDefaultNoValue(extractNameObject(workData.order_id, 'name'))}
                    </p>
                    <p className="font-weight-500 font-side-heading mb-1">
                      {getDefaultNoValue(getWorkOrderStateLabel(workData.order_state))}
                    </p>
                  </Col>
                  <Col sm="3" md="3" lg="3" xs="12">
                    <img src={workOrdersBlue} alt="workorder" width="25" className="mr-2 float-right" />
                  </Col>
                </Row>
              </CardBody>
            </Card>
            {(updatePartsOrderInfo && !updatePartsOrderInfo.data && (!loading)) && (
            <div>
              <Input type="textarea" name="body" placeholder="Enter here" value={messageTicket} onChange={onMessageChange} className="mt-2 bg-whitered" rows="4" />
              {!messageTicket && (<span className="text-danger ml-1">Remarks required</span>)}
            </div>
            )}
          </Col>
        </Row>
        {loading && (
        <div className="text-center mt-3">
          <Loader />
        </div>
        )}
        {(updatePartsOrderInfo && updatePartsOrderInfo.err) && (
        <SuccessAndErrorFormat response={updatePartsOrderInfo} />
        )}
        {((updatePartsOrderInfo && updatePartsOrderInfo.data) && (!loading)) && (
        <SuccessAndErrorFormat response={updatePartsOrderInfo} successMessage="This work permit  has been reviewed successfully.." />
        )}
        <hr className="mb-0" />
      </ModalBody>
      )}
      <ModalFooter className="border-0 pt-1">
        {(updatePartsOrderInfo && !updatePartsOrderInfo.data && (!loading)) && (
        <Button
          size="sm"
          type="button"
           variant="contained"
          disabled={messageTicket === ''}
          onClick={() => handleStateChange()}
        >
          Review
        </Button>
        )}
        {(updatePartsOrderInfo && updatePartsOrderInfo.data && (!loading)) && (
        <Button
          size="sm"
          type="button"
           variant="contained"
          onClick={() => toggle()}
        >
          OK
        </Button>
        )}
      </ModalFooter>
    </Modal>
  );
};

ReviewWorkorder.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  reviewModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  atFinish: PropTypes.func.isRequired,
  atCancel: PropTypes.func.isRequired,
};
export default ReviewWorkorder;
