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
  Spinner,
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
import { purchaseStateChange, getQuotatioDetail } from '../../../purchaseService';

const appModels = require('../../../../util/appModels').default;

const SetToDraft = (props) => {
  const {
    quotationDetails, draftModal, atFinish,
  } = props;
  const dispatch = useDispatch();
  const storeValue = 'draft';
  const [modal, setModal] = useState(draftModal);
  const [stateType, setStateType] = useState('');
  const toggle = () => {
    setModal(!modal);
    atFinish();
  };
  const { userInfo } = useSelector((state) => state.user);
  const { stateChangeInfo } = useSelector((state) => state.purchase);

  useEffect(() => {
    const viewId = quotationDetails && quotationDetails.data ? quotationDetails.data[0].id : '';
    if ((userInfo && userInfo.data) && viewId && (stateChangeInfo && stateChangeInfo.data)) {
      dispatch(getQuotatioDetail(viewId, appModels.PURCHASEORDER));
    }
  }, [userInfo, stateChangeInfo]);

  const quotationData = quotationDetails && (quotationDetails.data && quotationDetails.data.length > 0) ? quotationDetails.data[0] : '';

  const handleStateChange = (id, state, type) => {
    dispatch(purchaseStateChange(id, state, appModels.PURCHASEORDER));
    setStateType(type);
  };

  return (
    <Modal size="md" className="border-radius-50px modal-dialog-centered" isOpen={draftModal}>
      <ModalHeaderComponent fontAwesomeIcon={faStoreAlt} closeModalWindow={toggle} title="Set to Draft" response={stateChangeInfo} />
      <ModalBody>
        <Card className="border-5 mt-3 ml-4 mb-4 mr-4 border-secondary rounded-0 border-top-0 border-right-0 border-bottom-0">
          {quotationDetails && (quotationDetails.data && quotationDetails.data.length > 0) && (
            <CardBody data-testid="success-case" className="bg-lightblue p-3">
              <Row>
                <Col md="2" xs="2" sm="2" lg="2">
                  <img src={assetDefault} alt="asset" className="mt-2" width="45" height="45" />
                </Col>
                <Col md="8" xs="8" sm="8" lg="8" className="ml-2">
                  <Row>
                    <h6 className="mb-1">
                      {quotationData.display_name}
                    </h6>
                  </Row>
                  <Row>
                    <Col md="12" xs="12" sm="12" lg="12" className="p-0">
                      <span className="font-weight-800 font-side-heading mr-1">
                        Vendor :
                      </span>
                      <span className="font-weight-400">
                        {getDefaultNoValue(quotationDetails && quotationDetails.data && quotationDetails.data[0].partner_id[1] ? quotationDetails.data[0].partner_id[1] : '')}
                      </span>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12" xs="12" sm="12" lg="12" className="p-0">
                      <span className="font-weight-800 font-side-heading mr-1">
                        Order Date :
                      </span>
                      <span className="font-weight-400">
                        {getDefaultNoValue(getLocalTime(quotationDetails && quotationDetails.data && quotationDetails.data[0].date_order ? quotationDetails.data[0].date_order : ''))}
                      </span>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </CardBody>
          )}
        </Card>
        <Row className="justify-content-center">
          {stateChangeInfo && stateChangeInfo.data && (quotationDetails && !quotationDetails.loading) && (
            <SuccessAndErrorFormat response={stateChangeInfo} successMessage="This RFQ has been set to draft successfully.." />
          )}
          {stateChangeInfo && stateChangeInfo.err && (
            <SuccessAndErrorFormat response={stateChangeInfo} />
          )}
          {quotationDetails && quotationDetails.loading && (
            <CardBody className="mt-4" data-testid="loading-case">
              <Loader />
            </CardBody>
          )}
        </Row>
      </ModalBody>
      <ModalFooter className="mr-3 ml-3">
        {quotationData.state === storeValue
          ? ''
          : (
            <Button
              type="button"
               variant="contained"
              size="sm"
              className="mr-1"
              onClick={() => handleStateChange(quotationData.id, 'button_draft', 'draft')}
            >
              {((quotationDetails && quotationDetails.loading) || (stateChangeInfo && stateChangeInfo.loading && stateType === 'draft')) ? (
                <Spinner size="sm" color="light" className="mr-2" />
              ) : ''}
              {' '}
              Move
            </Button>
          )}
        {quotationData.state === storeValue && (
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
  quotationDetails: PropTypes.oneOfType([
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
