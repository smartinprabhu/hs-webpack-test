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
import checkCircleBlack from '@images/icons/checkCircleBlack.svg';
import backorder from '@images/icons/backorder.svg';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import Loader from '@shared/loading';
import {
  getDefaultNoValue, getLocalTime,
} from '../../../../util/appUtils';
import {
  getBackOrder, getLowQuantityProducts,
} from '../../utils/utils';
import {
  purchaseStateChange, validateStateChange, getTransferDetail, backorderChange,
} from '../../../purchaseService';

const appModels = require('../../../../util/appModels').default;

const Validate = (props) => {
  const {
    transferDetails, validateModal, atFinish,
  } = props;
  const dispatch = useDispatch();
  const [modal, setModal] = useState(validateModal);
  const [buttonType, setButtonType] = useState('');

  const toggle = () => {
    setModal(!modal);
    atFinish();
  };
  const { userInfo } = useSelector((state) => state.user);
  const {
    stateChangeInfo, stateValidateInfo, moveProducts, backorderInfo,
  } = useSelector((state) => state.purchase);

  const stateData = stateChangeInfo && stateChangeInfo.data ? stateChangeInfo.data : false;
  const validateData = stateValidateInfo && stateValidateInfo.data ? stateValidateInfo.data : false;
  const boData = backorderInfo && backorderInfo.data ? backorderInfo.data : false;

  const isStateNotChange = (stateData && stateData.data && typeof stateData.data === 'object');
  const isStateChange = (stateData && stateData.data && typeof stateData.data === 'boolean') || (stateData && !isStateNotChange && stateData.status);

  const isNotValidated = (validateData && validateData.data && typeof validateData.data === 'object');
  const isValidated = (validateData && validateData.data && typeof validateData.data === 'boolean') || (validateData && !isNotValidated && validateData.status);

  const isBoNoStatus = (boData && boData.data && typeof boData.data === 'object');
  const isBoStatus = (boData && boData.data && typeof boData.data === 'boolean') || (boData && !isBoNoStatus && boData.status);

  const isBo = validateData && validateData.data && validateData.data.res_model && validateData.data.res_model === 'stock.backorder.confirmation';
  const isBo2 = stateData && stateData.data && stateData.data.res_model && stateData.data.res_model === 'stock.backorder.confirmation';
  const isIt = validateData && validateData.data && validateData.data.res_model && validateData.data.res_model === 'stock.immediate.transfer';

  useEffect(() => {
    const viewId = transferDetails && transferDetails.data ? transferDetails.data[0].id : '';
    if ((userInfo && userInfo.data) && viewId && (stateChangeInfo && (isStateChange))) {
      dispatch(getTransferDetail(viewId, appModels.STOCK));
    }
  }, [userInfo, stateChangeInfo]);

  useEffect(() => {
    const viewId = transferDetails && transferDetails.data ? transferDetails.data[0].id : '';
    if ((userInfo && userInfo.data) && viewId && (stateValidateInfo && (isValidated))) {
      dispatch(getTransferDetail(viewId, appModels.STOCK));
    }
  }, [userInfo, stateValidateInfo]);

  useEffect(() => {
    const viewId = transferDetails && transferDetails.data ? transferDetails.data[0].id : '';
    if ((userInfo && userInfo.data) && viewId && (backorderInfo && (isBoStatus))) {
      dispatch(getTransferDetail(viewId, appModels.STOCK));
    }
  }, [userInfo, backorderInfo]);

  useEffect(() => {
    const viewId = transferDetails && transferDetails.data ? transferDetails.data[0].id : '';
    if ((userInfo && userInfo.data) && viewId) {
      dispatch(validateStateChange(viewId, 'button_validate', appModels.STOCK));
    }
  }, [userInfo]);

  const transferData = transferDetails && (transferDetails.data && transferDetails.data.length > 0) ? transferDetails.data[0] : '';
  const moveProduct = moveProducts && moveProducts.data && moveProducts.data.length > 0 ? moveProducts.data : [];

  const isNotReservedProducts = getLowQuantityProducts(moveProduct);
  const isBackOrder = getBackOrder(moveProduct) || isBo || isBo2;

  const handleStateChange = (state) => {
    const resid = validateData && validateData.data && validateData.data.res_id ? validateData.data.res_id : false;
    if (resid) {
      dispatch(purchaseStateChange(resid, state, appModels.STOCKTRANSFER));
    }
  };

  const handleBackorderChange = (state, btnType) => {
    const resid = validateData && validateData.data && validateData.data.res_id ? validateData.data.res_id : false;
    if (resid) {
      dispatch(backorderChange(resid, state, appModels.BACKORDER));
    }
    setButtonType(btnType);
  };

  const currentState = transferDetails && (transferDetails.data && transferDetails.data.length > 0) ? transferDetails.data[0].state : '';
  const currentType = transferDetails && (transferDetails.data && transferDetails.data.length > 0) ? transferDetails.data[0].picking_type_code : '';
  const isImmediatetransfer = !!(currentState === 'assigned' && !isBackOrder) || isIt;

  const loading = (backorderInfo && backorderInfo.loading)
    || (stateValidateInfo && stateValidateInfo.loading)
    || (stateChangeInfo && stateChangeInfo.loading) || (transferDetails && transferDetails.loading);

  function getTitle() {
    let title = 'Validate';
    if (isBackOrder || (isBoStatus)) {
      title = 'BackOrder';
    } else if (isImmediatetransfer && (stateValidateInfo && !stateValidateInfo.err) && (stateChangeInfo && !stateChangeInfo.err)) {
      title = 'Immediate Transfer';
    }
    return title;
  }

  return (
    <Modal
      size="md"
      className="border-radius-50px modal-dialog-centered"
      isOpen={validateModal}
    >
      <ModalHeaderComponent
        imagePath={isBackOrder ? backorder : checkCircleBlack}
        closeModalWindow={toggle}
        title={getTitle()}
        response={(isBoStatus) ? backorderInfo : stateChangeInfo}
      />
      <ModalBody className="pt-0">
        {isBackOrder
          ? !loading && (!isBoStatus && !isStateChange) && (
          <Row className="m-4">
            <Col md="12" sm="12" lg="12" xs="12">
              <div className="text-center">
                You want to create back order? You have processed less products than the initial demand.
              </div>
            </Col>
            <small className="text-grey text-center mt-3">
              Note : Create a backorder if you expect to process the remaining products later. Do not create a backorder, if you will not process the remaining products.
            </small>
          </Row>
          )
          : (
            <>
              {((isStateChange) || (isBoStatus) || (isValidated)) ? ''
                : (
                  <Card className="border-5 mt-3 ml-4 mb-4 mr-4 border-secondary rounded-0 border-top-0 border-right-0 border-bottom-0">
                    {transferDetails && (transferDetails.data && transferDetails.data.length > 0) && (
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
                )}
            </>
          )}
        <Row className="justify-content-center m-1">
          {stateChangeInfo && !stateChangeInfo.err && (stateValidateInfo && !stateValidateInfo.err) && !loading && (isStateChange || isValidated) && (
          <SuccessAndErrorFormat response={isStateChange ? stateChangeInfo : stateValidateInfo} successMessage="This order has been validated successfully.." />
          )}
          {buttonType === 'cancel' && (isBoStatus && (transferDetails && !transferDetails.loading)) && (
            <SuccessAndErrorFormat response={backorderInfo} successMessage="Backorder cancelled successfully.." />
          )}
          {buttonType === 'add' && (isBoStatus && (transferDetails && !transferDetails.loading)) && (
            <SuccessAndErrorFormat response={backorderInfo} successMessage="Backorder added successfully.." />
          )}
          {backorderInfo && backorderInfo.err && (
            <SuccessAndErrorFormat response={backorderInfo} />
          )}
          {stateChangeInfo && stateChangeInfo.err && (
            <SuccessAndErrorFormat response={stateChangeInfo} />
          )}
          {stateValidateInfo && stateValidateInfo.err && (
            <SuccessAndErrorFormat response={stateValidateInfo} />
          )}
          {loading && (
            <CardBody className="mt-4" data-testid="loading-case">
              <Loader />
            </CardBody>
          )}
          {!(isBackOrder || isBoStatus) && isImmediatetransfer && (!isStateChange && !isValidated) && (stateValidateInfo && !stateValidateInfo.err) && (stateChangeInfo && !stateChangeInfo.err) && (
          <Col md="12" sm="12" lg="12" xs="12">
            <div className="text-info text-center mb-2">
              Note :  You have not recorded done quantities yet, by clicking on validate your company will process all the reserved quantities.
            </div>
          </Col>
          )}
          {((currentState === 'assigned' || currentState === 'confirmed') && currentType !== 'incoming') && (isNotReservedProducts && isNotReservedProducts.length > 0)
          && (moveProducts && !moveProducts.loading && moveProducts.data) && (
          <Col md="12" sm="12" lg="12" xs="12" className="mt-2">
            <div className="text-info text-center mb-2">
              Note :  Update the quantity on hand for the products which are not able to reserve.
            </div>
          </Col>
          )}
        </Row>
      </ModalBody>
      {isBackOrder && transferData.state !== 'done'
        ? (
          <ModalFooter className="mr-3 ml-3">
            <Button
              type="button"
               variant="contained"
              size="sm"
              className="mr-1 btn-cancel"
              disabled={loading}
              onClick={() => handleBackorderChange('process_cancel_backorder', 'cancel')}
            >

              No Backorder
            </Button>
            <Button
              type="button"
               variant="contained"
              size="sm"
              className="mr-1"
              disabled={loading}
              onClick={() => handleBackorderChange('process', 'add')}
            >

              Add Backorder
            </Button>
          </ModalFooter>
        )
        : (
          <ModalFooter className="mr-3 ml-3">
            {((isStateChange) || (isBoStatus) || (isValidated))
              ? ''
              : (
                <Button
                  type="button"
                   variant="contained"
                  size="sm"
                  disabled={(stateValidateInfo && stateValidateInfo.err) || (stateChangeInfo && stateChangeInfo.err)}
                  className="mr-1"
                  onClick={() => handleStateChange('process')}
                >
                  {' '}
                  Validate
                </Button>
              )}
            {((isStateChange) || (isBoStatus) || (isValidated)) && (
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

Validate.propTypes = {
  transferDetails: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  validateModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  atFinish: PropTypes.func.isRequired,
};
export default Validate;
