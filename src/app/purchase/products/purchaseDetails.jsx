/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import {
  Col, Row, Table,
} from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';

import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import { getLocationRoute, getSellerIds } from '../purchaseService';
import {
  getAllowedCompanies, getCompanyTimezoneDate, getDefaultNoValue,
} from '../../util/appUtils';

const appModels = require('../../util/appModels').default;

const PurchaseDetails = () => {
  const dispatch = useDispatch();
  const [product, setProduct] = useState(false);
  const {
    productDetailsInfo,
  } = useSelector((state) => state.purchase);
  const { sellerIdsInfo } = useSelector((state) => state.purchase);

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      dispatch(getLocationRoute(companies, appModels.LOCATIONROUTE));
    }
  }, [userInfo]);

  useEffect(() => {
    if (userInfo && userInfo.data && productDetailsInfo && (productDetailsInfo.data && productDetailsInfo.data.length > 0)) {
      setProduct(productDetailsInfo.data[0]);
    }
  }, [productDetailsInfo, userInfo]);

  useEffect(() => {
    if (product && product.seller_ids && product.seller_ids.length) {
      dispatch(getSellerIds(appModels.SUPPLIERINFO, product.seller_ids));
    }
  }, [product]);

  return (
    <>
      <Row>
        <Col sm="12" md="12" lg="12" className="mx-2">
          {product && product.seller_ids && product.seller_ids.length > 0 && sellerIdsInfo && sellerIdsInfo.loading && (
            <Loader />
          )}
          {product && product.seller_ids && product.seller_ids.length > 0 ? (
            sellerIdsInfo && sellerIdsInfo.data && sellerIdsInfo.data.length && (
            <>
              <Table responsive className="mx-2">
                <thead>
                  <tr>
                    <th className="p-2 min-width-200 border-0">
                      Vendor
                    </th>
                    <th className="p-2 min-width-200 border-0">
                      Minimal Quantity
                    </th>
                    <th className="p-2 min-width-100 border-0">
                      Price
                    </th>
                    <th className="p-2 min-width-100 border-0">
                      Start Date
                    </th>
                    <th className="p-2 min-width-100 border-0">
                      End Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sellerIdsInfo && sellerIdsInfo.data && sellerIdsInfo.data.map((sellerData) => (
                    <tr key={sellerData.id}>
                      <td>
                        {sellerData.display_name}
                      </td>
                      <td>
                        {sellerData.min_qty}
                      </td>
                      <td>
                        {sellerData.price}
                      </td>
                      <td>
                        {getDefaultNoValue(getCompanyTimezoneDate(sellerData.date_start, userInfo, 'date'))}
                      </td>
                      <td>
                        {getDefaultNoValue(getCompanyTimezoneDate(sellerData.date_end, userInfo, 'date'))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
            )
          ) : (
            <ErrorContent errorTxt="No Data" />
          )}
        </Col>
      </Row>
    </>
  );
};
export default PurchaseDetails;
