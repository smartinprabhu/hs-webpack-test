/* eslint-disable import/no-unresolved */
/* eslint-disable react/no-danger */
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardBody,
  Col,
  Row,
  Table,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';

import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import {
  getTotalFromArray, generateErrorMessage,
  getDefaultNoValue, getFloatValue, getCompanyTimezoneDate,
} from '../../../util/appUtils';
import { getProductOrders, getTaxes } from '../../purchaseService';
import { getTotalTax, getDataWithTaxId, getColumnArrayByTaxesIdWithArray } from '../../utils/utils';

const appModels = require('../../../util/appModels').default;

const Products = () => {
  const dispatch = useDispatch();
  const [productsData, setProductsData] = useState([]);
  const {
    quotationDetails, productOrders, taxesInfo,
  } = useSelector((state) => state.purchase);
  const {
    userInfo,
  } = useSelector((state) => state.user);

  useEffect(() => {
    if (quotationDetails && quotationDetails.data) {
      dispatch(getProductOrders(quotationDetails.data[0].order_line, appModels.PURCHASEORDERLINE));
    }
  }, [quotationDetails]);

  useEffect(() => {
    if (productOrders && productOrders.data) {
      setProductsData(productOrders.data);
      const ids = getColumnArrayByTaxesIdWithArray(productOrders.data, 'taxes_id');
      if (ids && ids.length && !ids[0].name) {
        dispatch(getTaxes(ids, appModels.TAX));
      }
    }
  }, [productOrders]);

  useEffect(() => {
    if (taxesInfo && taxesInfo.data) {
      const newData = getDataWithTaxId(productsData && productsData.length ? productsData : [], taxesInfo.data);
      setProductsData(newData);
    }
  }, [taxesInfo]);

  const withoutTaxTotal = getTotalFromArray(productOrders && productOrders.data && productOrders.data.length ? productOrders.data : [], 'price_subtotal');
  const totalTaxRs = getTotalTax(productOrders && productOrders.data && productOrders.data.length ? productOrders.data : [], 'taxes_id', 'price_subtotal');
  const totalPay = withoutTaxTotal + totalTaxRs;

  return (
    <>
      <Row>
        <Col xs={12} sm={12} md={12} lg={12}>
          {productOrders && productOrders.loading && (
            <div className="mt-3">
              <Loader />
            </div>
          )}
          {productOrders && !productOrders.loading && productsData && (productsData.length > 0) && (
          <Table responsive>
            <thead>
              <tr>
                <th className="p-2 min-width-200 border-0">
                  Product
                </th>
                <th className="p-2 min-width-100 border-0">
                  Description
                </th>
                <th className="p-2 min-width-160 border-0">
                  Company
                </th>
                <th className="p-2 min-width-160 border-0">
                  Scheduled Date
                </th>
                <th className="p-2 min-width-100 border-0">
                  Quantity
                </th>
                <th className="p-2 min-width-100 border-0">
                  Unit Price
                </th>
                <th className="p-2 min-width-200 border-0">
                  Product Unit of Measure
                </th>
                <th className="p-2 min-width-160 border-0">
                  Taxes
                </th>
                <th className="p-2 min-width-100 border-0">
                  Sub Total
                </th>
              </tr>
            </thead>
            <tbody>
              {(productsData && productsData.length > 0) && productsData.map((pl) => (
                <tr key={pl.id} className="font-weight-400">
                  <td className="p-2">
                    {pl.product_id && pl.product_id[1] ? pl.product_id[1] : ''}
                  </td>
                  <td className="p-2">
                    <span>{pl.name}</span>
                  </td>
                  <td className="p-2">
                    <span>{getDefaultNoValue(pl.company_id && pl.company_id[1] ? pl.company_id[1] : '')}</span>
                  </td>
                  <td className="p-2">
                    <span>{getDefaultNoValue(pl.date_planned ? getCompanyTimezoneDate(pl.date_planned, userInfo, 'datetime') : '')}</span>
                  </td>
                  <td className="p-2">
                    <span>{pl.product_qty ? getFloatValue(pl.product_qty) : getFloatValue(0)}</span>
                  </td>
                  <td className="p-2">
                    <span>{pl.price_unit ? getFloatValue(pl.price_unit) : getFloatValue(0)}</span>
                  </td>
                  <td className="p-2">
                    <span>{getDefaultNoValue(pl.product_uom && pl.product_uom[1] ? pl.product_uom[1] : '')}</span>
                  </td>
                  <td className="p-2">
                    {pl.taxes_id && pl.taxes_id.length && pl.taxes_id.length > 0 ? pl.taxes_id.map((tax, index) => (
                      // eslint-disable-next-line react/no-array-index-key
                      <div key={index}>
                        {' '}
                        {tax.name}
                      </div>
                    )) : '- '}
                  </td>
                  <td className="p-2">
                    {pl.price_subtotal ? getFloatValue(pl.price_subtotal) : getFloatValue(0)}
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan="8" className="p-2 text-right">
                  <p>Untaxed Amount</p>
                  <p>Taxes</p>
                  <p>Total</p>
                </td>
                <td className="p-2">
                  <p>
                    {getFloatValue(withoutTaxTotal)}
                    {' '}
                    Rs
                  </p>
                  <p>
                    {getFloatValue(totalTaxRs)}
                    {' '}
                    Rs
                  </p>
                  <p>
                    {getFloatValue(totalPay)}
                    {' '}
                    Rs
                  </p>
                </td>
              </tr>
            </tbody>
          </Table>
          )}
        </Col>
      </Row>
      {(productOrders && productOrders.err) && (
      <Card>
        <CardBody>
          <ErrorContent errorTxt={generateErrorMessage(productOrders)} />
        </CardBody>
      </Card>
      )}
    </>
  );
};
export default Products;
