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

import purchaseIcon from '@images/icons/purchaseHandBlack.svg';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import Loader from '@shared/loading';
import {
  faCheckCircle, faTimesCircle, faWindowClose, faCheck, faStoreAlt,
} from '@fortawesome/free-solid-svg-icons';
import {
  getAgreeStatusLabel,
} from '../../utils/utils';
import {
  getDefaultNoValue, getCompanyTimezoneDate,
} from '../../../../util/appUtils';
import { getPurchaseAgreementDetail, agreementStateChange } from '../../../purchaseService';

const appModels = require('../../../../util/appModels').default;

const faIcons = {
  Confirm: faCheckCircle,
  Validate: faCheck,
  Reset: faStoreAlt,
  Cancel: faTimesCircle,
  Close: faWindowClose,
};

const ActionPurchaseAgreement = (props) => {
  const {
    details, actionModal, actionText, actionCode, actionMessage, actionButton, atFinish,
  } = props;
  const dispatch = useDispatch();
  const [modal, setModal] = useState(actionModal);
  const toggle = () => {
    setModal(!modal);
    atFinish();
  };
  const { userInfo } = useSelector((state) => state.user);
  const { agreementStateChangeInfo } = useSelector((state) => state.purchase);

  useEffect(() => {
    const viewId = details && details.data ? details.data[0].id : '';
    if ((userInfo && userInfo.data) && viewId && (agreementStateChangeInfo && agreementStateChangeInfo.data)) {
      dispatch(getPurchaseAgreementDetail(viewId, appModels.PURCHASEAGREEMENT));
    }
  }, [userInfo, agreementStateChangeInfo]);

  const agreementData = details && (details.data && details.data.length > 0) ? details.data[0] : '';

  const handleStateChange = (id, state) => {
    dispatch(agreementStateChange(id, state, appModels.PURCHASEAGREEMENT));
  };

  const loading = (details && details.loading) || (agreementStateChangeInfo && agreementStateChangeInfo.loading);

  return (
    <Modal size="md" className="border-radius-50px modal-dialog-centered" isOpen={actionModal}>
      <ModalHeaderComponent fontAwesomeIcon={faIcons[actionButton]} closeModalWindow={toggle} title={actionText} response={agreementStateChangeInfo} />
      <ModalBody>
        <Card className="border-5 mt-3 ml-4 mb-4 mr-4 border-secondary rounded-0 border-top-0 border-right-0 border-bottom-0">
          {details && (details.data && details.data.length > 0) && (
            <CardBody data-testid="success-case" className="bg-lightblue p-3">
              <Row>
                <Col md="2" xs="2" sm="2" lg="2">
                  <img src={purchaseIcon} alt="asset" className="mt-2" width="45" height="45" />
                </Col>
                <Col md="8" xs="8" sm="8" lg="8" className="ml-2">
                  <Row>
                    <h6 className="mb-1">
                      {getDefaultNoValue(agreementData.name)}
                    </h6>
                  </Row>
                  <Row>
                    <Col md="12" xs="12" sm="12" lg="12" className="p-0">
                      <span className="font-weight-800 font-side-heading mr-1">
                        Status :
                      </span>
                      <span className="font-weight-400">
                        {getDefaultNoValue(getAgreeStatusLabel(agreementData.state))}
                      </span>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12" xs="12" sm="12" lg="12" className="p-0">
                      <span className="font-weight-800 font-side-heading mr-1">
                        Ordering Date :
                      </span>
                      <span className="font-weight-400">
                        {getDefaultNoValue(getCompanyTimezoneDate(agreementData.ordering_date, userInfo, 'datetime'))}
                      </span>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </CardBody>
          )}
        </Card>
        <Row className="justify-content-center">
          {agreementStateChangeInfo && agreementStateChangeInfo.data && !loading && (
            <SuccessAndErrorFormat response={agreementStateChangeInfo} successMessage={`This purchase agreement has been ${actionMessage} successfully..`} />
          )}
          {agreementStateChangeInfo && agreementStateChangeInfo.err && (
            <SuccessAndErrorFormat response={agreementStateChangeInfo} />
          )}
          {loading && (
            <CardBody className="mt-4" data-testid="loading-case">
              <Loader />
            </CardBody>
          )}
        </Row>
      </ModalBody>
      <ModalFooter className="mr-3 ml-3">
        {agreementStateChangeInfo && agreementStateChangeInfo.data
          ? ''
          : (
            <Button
              type="button"
               variant="contained"
              size="sm"
              disabled={loading}
              className="mr-1"
              onClick={() => handleStateChange(agreementData.id, actionCode)}
            >
              {actionButton}
            </Button>
          )}
        {(agreementStateChangeInfo && agreementStateChangeInfo.data
          && (
          <Button
            type="button"
            size="sm"
            disabled={loading}
             variant="contained"
            className="mr-1"
            onClick={toggle}
          >
            Ok
          </Button>
          )
        )}
      </ModalFooter>
    </Modal>
  );
};

ActionPurchaseAgreement.propTypes = {
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
  actionMessage: PropTypes.string.isRequired,
  actionButton: PropTypes.string.isRequired,
  atFinish: PropTypes.func.isRequired,
};
export default ActionPurchaseAgreement;
