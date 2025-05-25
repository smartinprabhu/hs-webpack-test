/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import assetDefault from '@images/icons/assetDefault.svg';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import {
  faCheckCircle, faStoreAlt, faTimesCircle, faExclamationCircle,
} from '@fortawesome/free-solid-svg-icons';
import {
  getDefaultNoValue,
  extractTextObject,
} from '../../../util/appUtils';
import { getStateLabel } from '../utils/utils';
import {
  getAdjustmentDetail,
  getActionData,
  resetActionData,
} from '../../inventoryService';
import customData from '../data/customData.json';

const appModels = require('../../../util/appModels').default;

const faIcons = {
  Start: faStoreAlt,
  Validate: faCheckCircle,
  Cancel: faTimesCircle,
};

const ActionAdjustment = (props) => {
  const {
    details, actionModal, actionText, actionCode, atFinish,
  } = props;
  const dispatch = useDispatch();
  const [modal, setModal] = useState(actionModal);

  const { actionResultInfo } = useSelector((state) => state.inventory);
  const { userInfo } = useSelector((state) => state.user);

  const isResult = actionResultInfo && actionResultInfo.data && (actionResultInfo.data.data || actionResultInfo.data.status);
  const loading = actionResultInfo && actionResultInfo.loading;
  const isError = actionResultInfo && actionResultInfo.err;

  /* useEffect(() => {
    const viewId = details && details.data ? details.data[0].id : '';
    if ((userInfo && userInfo.data) && viewId && isResult) {
      dispatch(getAdjustmentDetail(viewId, appModels.INVENTORY));
    }
  }, [userInfo, actionResultInfo]); */

  const detailData = details && (details.data && details.data.length > 0) ? details.data[0] : '';

  const handleStateChange = (id, state) => {
    dispatch(getActionData(id, state, appModels.INVENTORY));
  };

  function getAlertText(actionValue) {
    let text = 'performed';
    if (customData && customData.actionTypes && customData.actionTypes[actionValue]) {
      text = customData.actionTypes[actionValue].msg;
    }
    return text;
  }

  function getAlertStatus(actionValue) {
    let text = 'performed';
    if (customData && customData.actionTypes && customData.actionTypes[actionValue]) {
      text = customData.actionTypes[actionValue].targetStatus;
    }
    return text;
  }

  const toggle = () => {
    dispatch(resetActionData());
    setModal(!modal);
    const viewId = details && details.data ? details.data[0].id : '';
    if ((userInfo && userInfo.data) && viewId && isResult) {
      dispatch(getAdjustmentDetail(viewId, appModels.INVENTORY));
    }
    atFinish();
  };

  return (
    <Modal size="md" className="border-radius-50px modal-dialog-centered" isOpen={actionModal}>
      <ModalHeaderComponent fontAwesomeIcon={faIcons[actionText]} closeModalWindow={toggle} title={`${actionText} Stock Audit`} response={actionResultInfo} />
      <ModalBody>
        <Card className="border-5 ml-4 mb-4 mr-4 border-secondary rounded-0 border-top-0 border-right-0 border-bottom-0">
          {details && (details.data && details.data.length > 0 && !details.loading && !loading) && (
          <CardBody data-testid="success-case" className="bg-lightblue p-3">
            <Row>
              <Col md="2" xs="2" sm="2" lg="2">
                <img src={assetDefault} alt="asset" className="mt-2" width="45" height="45" />
              </Col>
              <Col md="8" xs="8" sm="8" lg="8" className="ml-2">
                <Row>
                  <h6 className="mb-1">{detailData.name}</h6>
                </Row>
                <Row>
                  <p className="mb-0 font-weight-500 font-tiny">
                    {getDefaultNoValue(extractTextObject(detailData.location_id))}
                  </p>
                </Row>
                <Row>
                  <Col md="12" xs="12" sm="12" lg="12" className="p-0">
                    <span className="font-weight-800 font-side-heading mr-1">
                      Status :
                    </span>
                    <span className="font-weight-400">
                      {getStateLabel(isResult && (details && !details.loading) ? getAlertStatus(actionText) : detailData.state)}
                    </span>
                  </Col>
                </Row>
              </Col>
            </Row>
          </CardBody>
          )}
        </Card>
        <Row className="justify-content-center">
          {isResult && (details && !details.loading) && (
            <SuccessAndErrorFormat response={actionResultInfo ? actionResultInfo.data : false} successMessage={`This Stock Audit has been ${getAlertText(actionText)} successfully..`} />
          )}
          {isError && (
          <SuccessAndErrorFormat response={actionResultInfo} />
          )}
          {((details && details.loading) || (loading)) && (
            <CardBody className="mt-4" data-testid="loading-case">
              <Loader />
            </CardBody>
          )}
          {actionCode === 'action_validate' && detailData && detailData.filter === 'partial' && !detailData.line_ids.length && (
          <div className="text-danger text-center mt-3">
            <FontAwesomeIcon className="mr-2 font-size20 mb-n2px" size="lg" icon={faExclamationCircle} />
            No inventories added..
          </div>
          )}
        </Row>
      </ModalBody>
      {!details.loading && !loading && (
      <ModalFooter className="mr-3 ml-3">
        {!isResult && (
        <Button
          type="button"
           variant="contained"
          size="sm"
          className="mr-1"
          disabled={actionCode === 'action_validate' && detailData.filter === 'partial' && !detailData.line_ids.length}
          onClick={() => handleStateChange(detailData.id, actionCode)}
        >
          Confirm
        </Button>
        )}
        {isResult && (
        <Button
          type="button"
          size="sm"
           variant="contained"
          className="mr-1"
          onClick={toggle}
        >
          Ok
        </Button>
        )}
      </ModalFooter>
      )}
    </Modal>
  );
};

ActionAdjustment.propTypes = {
  details: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  actionModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  actionText: PropTypes.string.isRequired,
  actionCode: PropTypes.string.isRequired,
  atFinish: PropTypes.func.isRequired,
};
export default ActionAdjustment;
