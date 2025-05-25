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

import assetDefault from '@images/icons/assetDefault.svg';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import Loader from '@shared/loading';
import {
  faStoreAlt,
} from '@fortawesome/free-solid-svg-icons';
import {
  getDefaultNoValue, getLocalTime,
} from '../../../../util/appUtils';
import { purchaseStateChange, getPurchaseRequestDetail } from '../../../purchaseService';

const appModels = require('../../../../util/appModels').default;

const SetToDraft = (props) => {
  const {
    detail, draftModal, atFinish,
  } = props;
  const dispatch = useDispatch();
  const storeValue = 'draft';
  const [modal, setModal] = useState(draftModal);
  const toggle = () => {
    setModal(!modal);
    atFinish();
  };
  const { userInfo } = useSelector((state) => state.user);
  const { stateChangeInfo } = useSelector((state) => state.purchase);

  useEffect(() => {
    const viewId = detail && detail.data ? detail.data[0].id : '';
    if ((userInfo && userInfo.data) && viewId && (stateChangeInfo && stateChangeInfo.data)) {
      dispatch(getPurchaseRequestDetail(viewId, appModels.PURCHASEREQUEST));
    }
  }, [userInfo, stateChangeInfo]);

  const requestData = detail && (detail.data && detail.data.length > 0) ? detail.data[0] : '';

  const handleStateChange = (id, state) => {
    dispatch(purchaseStateChange(id, state, appModels.PURCHASEREQUEST));
  };

  const loading = (stateChangeInfo && stateChangeInfo.loading) || (detail && detail.loading);

  return (
    <Modal size={stateChangeInfo && (stateChangeInfo.data || stateChangeInfo.status) ? 'sm' : 'md'} className="border-radius-50px modal-dialog-centered" isOpen={draftModal}>
      <ModalHeaderComponent fontAwesomeIcon={faStoreAlt} closeModalWindow={toggle} title="Set to Draft" response={stateChangeInfo} />
      <ModalBody className="pt-0">
        {(loading) || (stateChangeInfo && (stateChangeInfo.data || stateChangeInfo.status)) ? ''
          : (
            <Card className="border-5 mt-3 ml-4 mb-4 mr-4 border-secondary rounded-0 border-top-0 border-right-0 border-bottom-0">
              {detail && (detail.data && detail.data.length > 0) && (
                <CardBody data-testid="success-case" className="bg-lightblue p-3">
                  <Row>
                    <Col md="2" xs="2" sm="2" lg="2">
                      <img src={assetDefault} alt="asset" className="mt-2" width="45" height="45" />
                    </Col>
                    <Col md="8" xs="8" sm="8" lg="8" className="ml-2">
                      <Row>
                        <h6 className="mb-1">
                          {requestData.requisition_name}
                        </h6>
                      </Row>
                      <Row>
                        <Col md="12" xs="12" sm="12" lg="12" className="p-0">
                          <span className="font-weight-800 font-side-heading mr-1">
                            PR Code :
                          </span>
                          <span className="font-weight-400">
                            {getDefaultNoValue(detail && detail.data && detail.data[0].pr_id)}
                          </span>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="12" xs="12" sm="12" lg="12" className="p-0">
                          <span className="font-weight-800 font-side-heading mr-1">
                            Request Date :
                          </span>
                          <span className="font-weight-400">
                            {getDefaultNoValue(getLocalTime(detail && detail.data && detail.data[0].create_date ? detail.data[0].create_date : ''))}
                          </span>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </CardBody>
              )}
            </Card>
          )}
        <Row className="justify-content-center m-2">
          {stateChangeInfo && (stateChangeInfo.data || stateChangeInfo.status) && (detail && !detail.loading) && (
            <SuccessAndErrorFormat response={stateChangeInfo} successMessage="This purchase request has been set to draft successfully.." />
          )}
          {stateChangeInfo && stateChangeInfo.err && (
            <SuccessAndErrorFormat response={stateChangeInfo} />
          )}
          {loading && (
            <CardBody className="mt-4" data-testid="loading-case">
              <Loader />
            </CardBody>
          )}
        </Row>
      </ModalBody>
      <ModalFooter className="mr-3 ml-3">
        {requestData.state === storeValue
          ? ''
          : (
            <Button
              type="button"
               variant="contained"
              size="sm"
              className="mr-1"
              onClick={() => handleStateChange(requestData.id, 'button_draft')}
            >
              Move
            </Button>
          )}
        {requestData.state === storeValue && (
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

SetToDraft.propTypes = {
  detail: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  draftModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  atFinish: PropTypes.func.isRequired,
};
export default SetToDraft;
