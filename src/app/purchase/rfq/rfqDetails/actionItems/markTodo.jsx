/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
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

import assetDefault from '@images/icons/assetDefault.svg';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import Loader from '@shared/loading';
import {
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import {
  getDefaultNoValue, getLocalTime,
} from '../../../../util/appUtils';
import { purchaseStateChange, getTransferDetail } from '../../../purchaseService';

const appModels = require('../../../../util/appModels').default;

const markTodo = (props) => {
  const {
    transferDetails, todoModal, atFinish,
  } = props;
  const dispatch = useDispatch();
  const [modal, setModal] = useState(todoModal);
  
  const { userInfo } = useSelector((state) => state.user);
  const { stateChangeInfo } = useSelector((state) => state.purchase);

/*  useEffect(() => {
    const viewId = transferDetails && transferDetails.data ? transferDetails.data[0].id : '';
    if ((userInfo && userInfo.data) && viewId && (stateChangeInfo && stateChangeInfo.data)) {
      dispatch(getTransferDetail(viewId, appModels.STOCK));
    }
  }, [userInfo, stateChangeInfo]); */

  const transferData = transferDetails && (transferDetails.data && transferDetails.data.length > 0) ? transferDetails.data[0] : '';

  const handleStateChange = (id, state) => {
    dispatch(purchaseStateChange(id, state, appModels.STOCK));
  };

  const toggle = () => {
    setModal(!modal);
    const viewId = transferDetails && transferDetails.data ? transferDetails.data[0].id : '';
    if ((userInfo && userInfo.data) && viewId && (stateChangeInfo && stateChangeInfo.data)) {
      dispatch(getTransferDetail(viewId, appModels.STOCK));
    }
    atFinish();
  };

  return (
    <Modal size="md" className="border-radius-50px modal-dialog-centered" isOpen={todoModal}>
      <ModalHeaderComponent fontAwesomeIcon={faTimesCircle} closeModalWindow={toggle} title="Mark as Todo" response={stateChangeInfo} />
      <ModalBody>
        <Card className="border-5 mt-3 ml-4 mb-4 mr-4 border-secondary rounded-0 border-top-0 border-right-0 border-bottom-0">
          {stateChangeInfo && (!stateChangeInfo.data || !stateChangeInfo.status) && transferDetails && (transferDetails.data && transferDetails.data.length > 0) && (
            <CardBody data-testid="success-case" className="bg-lightblue p-3">
              <Row>
                <Col md="2" xs="2" sm="2" lg="2">
                  <img src={assetDefault} alt="asset" className="mt-2" width="45" height="45" />
                </Col>
                <Col md="8" xs="8" sm="8" lg="8" className="ml-2">
                  <Row>
                    <h6 className="mb-1">{transferData.name}</h6>
                  </Row>
                  <Row>
                    <Col md="12" xs="12" sm="12" lg="12" className="p-0">
                      <span className="font-weight-800 font-side-heading mr-1">
                        Partner :
                      </span>
                      <span className="font-weight-400">
                        {getDefaultNoValue(transferDetails && transferDetails.data && transferDetails.data[0].partner_id[1] ? transferDetails.data[0].partner_id[1] : '')}
                      </span>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12" xs="12" sm="12" lg="12" className="p-0">
                      <span className="font-weight-800 font-side-heading mr-1">
                        Scheduled Date :
                      </span>
                      <span className="font-weight-400">
                        {getDefaultNoValue(getLocalTime(transferDetails && transferDetails.data && transferDetails.data[0].scheduled_date ? transferDetails.data[0].scheduled_date : ''))}
                      </span>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </CardBody>
          )}
        </Card>
        <Row className="justify-content-center">
          {stateChangeInfo && (stateChangeInfo.data || stateChangeInfo.status) && (transferDetails && !transferDetails.loading) && (
            <SuccessAndErrorFormat response={stateChangeInfo} successMessage="This has been marked as todo successfully.." />
          )}
          {stateChangeInfo && stateChangeInfo.err && (
            <SuccessAndErrorFormat response={stateChangeInfo} />
          )}
          {((stateChangeInfo && stateChangeInfo.loading) || (transferDetails && transferDetails.loading)) && (
            <CardBody className="mt-4" data-testid="loading-case">
              <Loader />
            </CardBody>
          )}
        </Row>
      </ModalBody>
      <ModalFooter className="mr-3 ml-3">
        {(stateChangeInfo.data || stateChangeInfo.status)
          ? ''
          : (
            <Button
              type="button"
               variant="contained"
              size="sm"
              className="mr-1"
              disabled={((stateChangeInfo && stateChangeInfo.loading) || (transferDetails && transferDetails.loading))}
              onClick={() => handleStateChange(transferData.id, 'action_confirm')}
            >
              {' '}
              Mark
            </Button>
          )}
        {(stateChangeInfo.data || stateChangeInfo.status) && (
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
    </Modal>
  );
};

markTodo.propTypes = {
  transferDetails: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  todoModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  atFinish: PropTypes.func.isRequired,
};
export default markTodo;
