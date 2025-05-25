/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardBody,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  Table,
  Row,
} from 'reactstrap';
import Button from '@mui/material/Button';
import * as PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';

import assetDefault from '@images/icons/assetDefault.svg';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import {
  faCheckCircle, faStoreAlt, faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import {
  getDefaultNoValue,
  extractTextObject,
} from '../../../util/appUtils';
import { getStateLabel } from '../utils/utils';
import {
  getScrapDetail,
  getActionData,
  resetActionData,
} from '../../inventoryService';
import customData from '../data/customData.json';
import { getProductDetails, getCompanyPrice } from '../../../purchase/purchaseService';

const appModels = require('../../../util/appModels').default;

const faIcons = {
  Start: faStoreAlt,
  Validate: faCheckCircle,
  Cancel: faTimesCircle,
};

const ActionScrap = (props) => {
  const {
    details, actionModal, actionText, actionCode, atFinish,
  } = props;
  const dispatch = useDispatch();
  const [modal, setModal] = useState(actionModal);

  const { actionResultInfo } = useSelector((state) => state.inventory);
  const {
    productDetailsInfo,
  } = useSelector((state) => state.purchase);
  const { userInfo } = useSelector((state) => state.user);

  const loading = (actionResultInfo && actionResultInfo.loading) || (productDetailsInfo && productDetailsInfo.loading);
  const isError = actionResultInfo && actionResultInfo.err;

  const stateData = actionResultInfo && actionResultInfo.data ? actionResultInfo.data : false;

  const isStateNotChange = (stateData && stateData.data && typeof stateData.data === 'object');
  const isResult = (stateData && stateData.data && typeof stateData.data === 'boolean') || (stateData && !isStateNotChange && stateData.status);

  /* useEffect(() => {
    const viewId = details && details.data ? details.data[0].id : '';
    if ((userInfo && userInfo.data) && viewId && isResult) {
      dispatch(getScrapDetail(viewId, appModels.STOCKSCRAP));
    }
  }, [userInfo, actionResultInfo]); */

  useEffect(() => {
    if ((userInfo && userInfo.data) && (details && details.data && details.data.length && details.data[0].product_id)) {
      const productId = details.data[0].product_id[0];
      dispatch(getProductDetails(appModels.PRODUCT, productId));
    }
  }, [details]);

  useEffect(() => {
    if (productDetailsInfo && productDetailsInfo.data && productDetailsInfo.data.length) {
      const strProduct = `product.product,${productDetailsInfo.data[0].id}`;
      const parentId = userInfo.data && userInfo.data.company && userInfo.data.company.parent_id && userInfo.data.company.parent_id.id ? userInfo.data.company.parent_id.id : false;
      const companyId = userInfo.data && userInfo.data.company && userInfo.data.company.id ? userInfo.data.company.id : false;
      let cids = [companyId];
      if (parentId) {
        cids = [parentId, companyId];
      }
      dispatch(getCompanyPrice(productDetailsInfo.data[0].id));
    }
  }, [productDetailsInfo]);

  const detailData = details && (details.data && details.data.length > 0) ? details.data[0] : '';

  const handleStateChange = (id, state) => {
    dispatch(getActionData(id, state, appModels.STOCKSCRAP));
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
      dispatch(getScrapDetail(viewId, appModels.STOCKSCRAP));
    }
    atFinish();
  };

  const qtyAvailable = productDetailsInfo && productDetailsInfo.data && productDetailsInfo.data.length ? productDetailsInfo.data[0].qty_available : 0;
  const locationId = productDetailsInfo && productDetailsInfo.data && productDetailsInfo.data.length ? productDetailsInfo.data[0].location_id : '';
  const qtyAsked = detailData.scrap_qty;
  const isValidatable = true;// qtyAvailable > qtyAsked;

  return (
    <Modal size={isValidatable || isResult ? 'md' : 'xl'} className="border-radius-50px modal-dialog-centered" isOpen={actionModal}>
      <ModalHeaderComponent fontAwesomeIcon={faIcons[actionText]} closeModalWindow={toggle} title={isValidatable ? `${actionText} Scrap` : 'Insufficient Quantity'} response={actionResultInfo} />
      {(isValidatable && !isStateNotChange) && (
      <div>
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
            <SuccessAndErrorFormat response={actionResultInfo ? actionResultInfo.data : false} successMessage={`This scrap has been ${getAlertText(actionText)} successfully..`} />
            )}
            {isError && (
            <SuccessAndErrorFormat response={actionResultInfo} />
            )}
            {((details && details.loading) || (loading)) && (
            <CardBody className="mt-4" data-testid="loading-case">
              <Loader />
            </CardBody>
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
      </div>
      )}
      {isStateNotChange && !loading && (
      <ModalBody className="pt-0 pl-4 pr-4">
        <div className="pl-5 font-weight-500">
          <p>
            The product
            {'  '}
            <span className="font-weight-700">{getDefaultNoValue(extractTextObject(detailData.product_id))}</span>
            {' '}
            is not available in sufficient quantity in
            {'  '}
            <span className="font-weight-700">{getDefaultNoValue(extractTextObject(detailData.location_id))}</span>
          </p>
          <Card className="no-border-radius mt-5 mb-2 ml-3 mr-5">
            <CardBody className="p-0 bg-porcelain">
              <p className="ml-2 mb-1 mt-1 font-weight-600 font-side-heading">Current Inventory</p>
            </CardBody>
          </Card>
          <div className="mb-4 ml-3 mr-5">
            <Table responsive className="mb-0 mt-2 font-weight-400 border-0 assets-table" width="100%">
              <thead>
                <tr>
                  <th className="p-2 min-width-160">
                    Product
                  </th>
                  <th className="p-2 min-width-100">
                    Location
                  </th>
                  <th className="p-2 min-width-160">
                    Quantity
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2">{getDefaultNoValue(extractTextObject(detailData.product_id))}</td>
                  <td className="p-2">{getDefaultNoValue(extractTextObject(locationId))}</td>
                  <td className="p-2">{qtyAvailable}</td>
                </tr>
              </tbody>
            </Table>
            <hr className="m-0" />
          </div>

          { /* <p className="text-center font-weight-700">This may lead to inconsistencies in your inventory. Are you sure you want to confirm this operation ?</p> */ }
        </div>
        {((details && details.loading) || (loading)) && (
        <CardBody className="mt-4" data-testid="loading-case">
          <Loader />
        </CardBody>
        )}
      </ModalBody>
      )}
    </Modal>
  );
};

ActionScrap.propTypes = {
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
export default ActionScrap;
