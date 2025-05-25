/* eslint-disable import/no-unresolved */
/* eslint-disable react/no-danger */
import React, { useEffect } from 'react';
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
  extractTextObject, generateErrorMessage,
  getDefaultNoValue, getFloatValue, getCompanyTimezoneDate,
} from '../../../util/appUtils';
import { getAgreeProduct } from '../../purchaseService';

const appModels = require('../../../util/appModels').default;

const Products = () => {
  const dispatch = useDispatch();
  const {
    purchaseAgreementDetails, agreeProductOrders,
  } = useSelector((state) => state.purchase);
  const {
    userInfo,
  } = useSelector((state) => state.user);

  useEffect(() => {
    if (purchaseAgreementDetails && purchaseAgreementDetails.data && purchaseAgreementDetails.data.length > 0) {
      dispatch(getAgreeProduct(purchaseAgreementDetails.data[0].line_ids, appModels.PURCHASEAGREEMENTLINE));
    }
  }, [purchaseAgreementDetails]);

  return (
    <>
      <Row>
        <Col xs={12} sm={12} md={12} lg={12}>
          {agreeProductOrders && agreeProductOrders.loading && (
            <div className="mt-3">
              <Loader />
            </div>
          )}
          {agreeProductOrders && !agreeProductOrders.loading && agreeProductOrders.data && (agreeProductOrders.data.length > 0) && (
          <Table responsive>
            <thead>
              <tr>
                <th className="p-2 min-width-200 border-0">
                  Product
                </th>
                <th className="p-2 min-width-160 border-0">
                  Quantity
                </th>
                <th className="p-2 min-width-160 border-0">
                  Ordered quantities
                </th>
                <th className="p-2 min-width-200 border-0">
                  Product Unit of Measure
                </th>
                <th className="p-2 min-width-200 border-0">
                  Scheduled Date
                </th>
                <th className="p-2 min-width-160 border-0">
                  Analytic Account
                </th>
                <th className="p-2 min-width-100 border-0">
                  Unit Price
                </th>
              </tr>
            </thead>
            <tbody>
              {(agreeProductOrders && agreeProductOrders.data && agreeProductOrders.data.length > 0) && agreeProductOrders.data.map((pa) => (
                <tr key={pa.id} className="font-weight-400">
                  <td className="p-2">
                    {pa.product_id && pa.product_id[1] ? pa.product_id[1] : ''}
                  </td>
                  <td className="p-2">
                    <span>{pa.product_qty ? getFloatValue(pa.product_qty) : getFloatValue(0)}</span>
                  </td>
                  <td className="p-2">
                    <span>{pa.qty_ordered ? getFloatValue(pa.qty_ordered) : getFloatValue(0)}</span>
                  </td>
                  <td className="p-2">
                    <span>{getDefaultNoValue(pa.product_uom && pa.product_uom[1] ? pa.product_uom[1] : '')}</span>
                  </td>
                  <td className="p-2">
                    <span>{getDefaultNoValue(pa.schedule_date ? getCompanyTimezoneDate(pa.schedule_date, userInfo, 'datetime') : '')}</span>
                  </td>
                  <td className="p-2">
                    <span>{pa.account_analytic_id ? extractTextObject(pa.account_analytic_id) : getFloatValue(0)}</span>
                  </td>
                  <td className="p-2">
                    {pa.price_unit ? getFloatValue(pa.price_unit) : getFloatValue(0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          )}
        </Col>
      </Row>
      {(agreeProductOrders && agreeProductOrders.err) && (
      <Card>
        <CardBody>
          <ErrorContent errorTxt={generateErrorMessage(agreeProductOrders)} />
        </CardBody>
      </Card>
      )}
    </>
  );
};
export default Products;
