/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardBody,
  Col,
  Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';

import assetDefault from '@images/icons/assetDefault.svg';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, Box } from '@mui/material'

import {
  getDefaultNoValue, getLocalTime,
} from '../../../../util/appUtils';
import { purchaseStateChange, getTransferDetail, resetPurchaseState } from '../../../purchaseService';
import { getLowQuantityProducts } from '../../utils/utils';
import DialogHeader from '../../../../commonComponents/dialogHeader';

const appModels = require('../../../../util/appModels').default;

const CheckAvailability = (props) => {
  const {
    transferDetails, availModal, atFinish,
  } = props;
  const dispatch = useDispatch();
  const [modal, setModal] = useState(availModal);

  const { userInfo } = useSelector((state) => state.user);
  const { stateChangeInfo, moveProducts } = useSelector((state) => state.purchase);

  const stateData = stateChangeInfo && stateChangeInfo.data ? stateChangeInfo.data : false;

  const isStateNotChange = (stateData && stateData.data && typeof stateData.data === 'object');
  const isStateChange = (stateData && stateData.data && typeof stateData.data === 'boolean') || (stateData && !isStateNotChange && stateData.status);

  useEffect(() => {
    dispatch(resetPurchaseState());
  }, []);

  const toggle = () => {
    setModal(!modal);
    const viewId = transferDetails && transferDetails.data ? transferDetails.data[0].id : '';
    if ((userInfo && userInfo.data) && viewId && (stateChangeInfo && isStateChange)) {
      dispatch(getTransferDetail(viewId, appModels.STOCK));
    }
    atFinish();
  };

  const moveProduct = moveProducts && moveProducts.data && moveProducts.data.length > 0 ? moveProducts.data : [];

  const isNotReservedProducts = getLowQuantityProducts(moveProduct);

  const transferData = transferDetails && (transferDetails.data && transferDetails.data.length > 0) ? transferDetails.data[0] : '';

  const handleStateChange = (id, state) => {
    dispatch(purchaseStateChange(id, state, appModels.STOCK));
  };

  return (
    <Dialog maxWidth={'lg'} open={availModal}>
      <DialogHeader title="Check Availability" onClose={toggle} response={stateChangeInfo} />
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Box
            sx={{
              width: "100%",
              height: "100%",
              backgroundColor: "#F6F8FA",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "10%",
              fontFamily: "Suisse Intl",
            }}
          >
            {stateChangeInfo && (!isStateChange) && transferDetails && (transferDetails.data && transferDetails.data.length > 0) && (
              <Card className="border-5 mt-3 ml-4 mb-4 mr-4 border-secondary rounded-0 border-top-0 border-right-0 border-bottom-0">
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
              </Card>
            )}
            <Row className="justify-content-center">
              {stateChangeInfo && (isStateChange) && (transferDetails && !transferDetails.loading) && (
                <SuccessAndErrorFormat response={stateChangeInfo} successMessage="Availability has been checked successfully.." />
              )}
              {stateChangeInfo && stateChangeInfo.err && (
                <SuccessAndErrorFormat response={stateChangeInfo} />
              )}
              {((stateChangeInfo && stateChangeInfo.loading) || (transferDetails && transferDetails.loading)) && (
                <CardBody className="mt-4" data-testid="loading-case">
                  <Loader />
                </CardBody>
              )}
              {(stateChangeInfo && isStateChange) && (transferData.picking_type_code !== 'incoming') && (isNotReservedProducts && isNotReservedProducts.length > 0)
                && (moveProducts && !moveProducts.loading && moveProducts.data) && (
                  <Col md="12" sm="12" lg="12" xs="12" className="mt-2">
                    <div className="text-info text-center mb-2">
                      Note :  Update the quantity on hand for the products which are not able to reserve.
                    </div>
                  </Col>
                )}
            </Row>
          </Box>
        </DialogContentText>
      </DialogContent>
      <DialogActions className="mr-3 ml-3">
        {(isStateChange)
          ? ''
          : (
            <Button
              variant='contained'
              className="mr-1 submit-btn"
              disabled={((stateChangeInfo && stateChangeInfo.loading) || (transferDetails && transferDetails.loading))}
              onClick={() => handleStateChange(transferData.id, 'action_assign')}
            >
              {' '}
              Check
            </Button>
          )}
        {isStateChange && (
          <Button
            variant='contained'
            className="mr-1 submit-btn"
            onClick={toggle}
          >
            Ok
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

CheckAvailability.propTypes = {
  transferDetails: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  availModal: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  atFinish: PropTypes.func.isRequired,
};
export default CheckAvailability;
