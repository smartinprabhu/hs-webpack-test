/* eslint-disable import/no-unresolved */
/* eslint-disable react/no-danger */
import React, { useEffect, useState } from 'react';
import {
  Col,
  Row,
  Table,
} from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Box from '@mui/material/Box';
import { Tooltip } from 'antd';

import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import DialogHeader from '../../../../commonComponents/dialogHeader';
import { getMoveProductsV1, getProductQuantity, resetProductInfo } from '../../../purchaseService';
import {
  getDefaultNoValue, generateErrorMessage, numToFloat, extractNameObject,
} from '../../../../util/appUtils';

const appModels = require('../../../../util/appModels').default;

const Products = ({ isEdit }) => {
  const dispatch = useDispatch();

  const { transferDetails, moveProductsV1, productQuantityInfo } = useSelector((state) => state.purchase);

  const code = transferDetails && (transferDetails.data && transferDetails.data.length > 0) ? transferDetails.data[0].picking_type_code : false;
  const locationId = transferDetails && (transferDetails.data && transferDetails.data.length > 0) && transferDetails.data[0].location_id && transferDetails.data[0].location_id.length ? transferDetails.data[0].location_id[0] : false;
  const locationDestinationId = transferDetails && (transferDetails.data && transferDetails.data.length > 0) && transferDetails.data[0].location_dest_id && transferDetails.data[0].location_dest_id.length ? transferDetails.data[0].location_dest_id[0] : false;

  function getLocationId() {
    let res = locationId;
    if (code === 'incoming') {
      res = locationDestinationId;
    } else {
      res = locationId;
    }
    return res;
  }

  const [currentProductId, setCurrentProductId] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(false);
  const [quantityModal, showQuantityModal] = useState(false);

  const onViewQuantity = (item) => {
    showQuantityModal(true);
    dispatch(getProductQuantity(getLocationId(), item && item.product_id && item.product_id.id ? item.product_id.id : false));
    setCurrentProductId(item && item.product_id && item.product_id.id ? item.product_id.id : false);
    setCurrentProduct(item);
  };

  const onCloseQuantity = () => {
    showQuantityModal(false);
    setCurrentProductId(false);
    dispatch(resetProductInfo());
    setCurrentProduct(false);
  };

  function getType() {
    let res = '';
    if (code === 'incoming') {
      res = 'Inward';
    } else if (code === 'outgoing') {
      res = 'Outward';
    } else {
      res = 'Material Request';
    }
    return res;
  }

  useEffect(() => {
    if (transferDetails && transferDetails.data && !isEdit) {
      const ids = transferDetails.data.length > 0 && transferDetails.data[0].move_ids_without_package ? transferDetails.data[0].move_ids_without_package : [];
      const pids = ids && ids.length === 0 && transferDetails.data.length > 0 && transferDetails.data[0].product_id && transferDetails.data[0].product_id.length ? transferDetails.data[0].product_id[0] : false;
      dispatch(getMoveProductsV1(ids, appModels.STOCKMOVE, false, 'mini', pids || false));
    }
  }, [transferDetails, isEdit]);

  const tranferData = transferDetails && transferDetails.data && transferDetails.data.length ? transferDetails.data[0] : '';
  const showQuantity = tranferData && tranferData.request_state && tranferData.request_state === 'Requested';

  function getRow(assetData) {
    const tableTr = [];
    for (let i = 0; i < assetData.length; i += 1) {
      tableTr.push(
        <tr key={i}>
          <td className="p-2">
            <p className="m-0">
              {getDefaultNoValue(extractNameObject(assetData[i].product_id, 'name'))}
              {assetData[i].product_id && assetData[i].product_id.unique_code && (
                <>
                  {'  '}
                  |
                  <span className="ml-1">{assetData[i].product_id.unique_code}</span>
                </>

              )}
            </p>
            <span className="font-tiny">
              {getDefaultNoValue(extractNameObject(assetData[i].product_id, 'brand'))}
              {'  '}
              |
              {'  '}
              {getDefaultNoValue(assetData[i].product_id.categ_id && assetData[i].product_id.categ_id.id ? extractNameObject(assetData[i].product_id.categ_id, 'name') : '')}
            </span>
          </td>
          <td className="p-2">
            {assetData[i].product_uom_qty ? numToFloat(assetData[i].product_uom_qty) : 0.00}
            {'  '}
            {getDefaultNoValue(extractNameObject(assetData[i].product_uom, 'name'))}
          </td>
          {showQuantity && (
          <td className="p-2">
            <Tooltip title="Click here to view the Stock on-hand quantity in the selected stock location." placement="top">
              <span aria-hidden className="cursor-pointer text-info" onClick={() => onViewQuantity(assetData[i])}>View Stock Quantity</span>
            </Tooltip>
          </td>
          )}
        </tr>,
      );
    }
    return tableTr;
  }

  return (
    <Row>
      <Col sm="12" md="12" lg="12" xs="12" className="p-2 products-list-tab comments-list thin-scrollbar">
        <>
          {(moveProductsV1 && moveProductsV1.data && moveProductsV1 && !moveProductsV1.loading && (moveProductsV1.data && moveProductsV1.data.length > 0)) && (
            <div>
              <Table responsive className="mb-0 mt-0 font-weight-400 border-0 assets-table" width="100%">
                <thead>
                  <tr>
                    <th className="p-2 min-width-100">
                      Product
                    </th>
                    <th className="p-2 min-width-100">
                      Quantity
                    </th>
                    {showQuantity && (
                    <th className="p-2 min-width-100">
                      Manage
                    </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {getRow(moveProductsV1 && moveProductsV1.data ? moveProductsV1.data : [])}
                </tbody>
              </Table>
              <hr className="m-0" />
            </div>
          )}
          {moveProductsV1 && moveProductsV1?.data?.length === 0 && (<ErrorContent errorTxt="" />)}

          {moveProductsV1 && moveProductsV1.loading && (
            <Loader />
          )}
        </>
        { /* (moveProductsV1 && moveProductsV1.err) && (
          <ErrorContent errorTxt={generateErrorMessage(moveProductsV1)} />
        ) */}
      </Col>
      <Dialog maxWidth="md" open={quantityModal}>
        <DialogHeader rightButton title="View Stock on Hand" onClose={() => { onCloseQuantity(); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Box
              sx={{
                width: '100%',
                height: '100%',
                backgroundColor: '#F6F8FA',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10%',
                fontFamily: 'Suisse Intl',
              }}
            >
              {productQuantityInfo && productQuantityInfo.data && currentProduct && (
              <div className="p-1 text-center">
                <Table responsive id="spare-part">
                  <thead className="bg-lightblue">
                    <tr>
                      <th className="p-2 min-width-100 border-0">
                        Product Name
                      </th>
                      <th className="p-2 min-width-160 border-0">
                        <h6 className="m-0">
                          {getDefaultNoValue(extractNameObject(currentProduct.product_id, 'name'))}
                          {currentProduct.product_id.unique_code && (
                          <>
                            {'  '}
                            |
                            <span className="ml-1">{currentProduct.product_id.unique_code}</span>
                          </>
                          )}
                        </h6>
                      </th>
                    </tr>
                    <tr>
                      <th className="p-2 min-width-100 border-0">
                        Product Brand
                      </th>
                      <th className="p-2 min-width-100 border-0">
                        <span className="font-tiny">
                          {currentProduct.product_id.brand ? currentProduct.product_id.brand : '-'}
                        </span>
                      </th>
                    </tr>
                    <tr>
                      <th className="p-2 min-width-100 border-0">
                        {getType()}
                        {' '}
                        Quantity
                      </th>
                      <th className="p-2 min-width-100 border-0">
                        {currentProduct.product_uom_qty ? parseFloat(currentProduct.product_uom_qty).toFixed(2) : 0.00}
                        {'  '}
                        {getDefaultNoValue(extractNameObject(currentProduct.product_uom, 'name'))}
                      </th>
                    </tr>
                    <tr>
                      <th className="p-2 min-width-100 border-0">
                        Stock On Hand
                      </th>
                      <th className="p-2 min-width-100 border-0">
                        <h6 className="font-weight-800 m-0">
                          {productQuantityInfo.data.length > 0 && productQuantityInfo.data[0].qty_on_hand ? parseFloat(productQuantityInfo.data[0].qty_on_hand).toFixed(2) : 0.00}
                          {'  '}
                          {getDefaultNoValue(extractNameObject(currentProduct.product_uom, 'name'))}
                        </h6>
                      </th>
                    </tr>
                  </thead>
                </Table>
              </div>
              )}
              {productQuantityInfo && productQuantityInfo.loading && (
                <div className="p-4">
                  <Loader />
                </div>
              )}
              {(productQuantityInfo && productQuantityInfo.err) && (
              <ErrorContent errorTxt={generateErrorMessage(productQuantityInfo)} />
              )}
            </Box>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </Row>
  );
};

export default Products;
