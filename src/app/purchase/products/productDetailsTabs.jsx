/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  Col,
  Row,
  Label,
} from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import {
  Checkbox,
} from '@material-ui/core';
import { Tabs } from 'antd';

import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';
import tabs from './tabs.json';
import AuditLog from '../../assets/assetDetails/auditLog';
import LogNotes from '../../assets/assetDetails/logNotes';
import ScheduleActivities from '../../assets/assetDetails/scheduleActivities';
import PurchaseDetails from './purchaseDetails';

import { getDefaultNoValue, getAllowedCompanies } from '../../util/appUtils';
import { getLocationRoute, getSellerIds, getTaxes } from '../purchaseService';

const appModels = require('../../util/appModels').default;

const { TabPane } = Tabs;

const ProductDetailsTabs = () => {
  const [currentTab, setActive] = useState('General Information');
  const changeTab = (key) => {
    setActive(key);
  };
  const dispatch = useDispatch();
  const [product, setProduct] = useState(false);
  const {
    productDetailsInfo, taxesInfo,
  } = useSelector((state) => state.purchase);
  const { locationRouteInfo } = useSelector((state) => state.purchase);

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
    if (productDetailsInfo && productDetailsInfo.data && productDetailsInfo.data.length > 0 && productDetailsInfo.data[0].seller_ids && productDetailsInfo.data[0].seller_ids.length) {
      dispatch(getSellerIds(appModels.SUPPLIERINFO, productDetailsInfo.data[0].seller_ids));
    }
  }, [productDetailsInfo]);

  useEffect(() => {
    if (productDetailsInfo && productDetailsInfo.data && productDetailsInfo.data.length > 0 && productDetailsInfo.data[0].taxes_id && productDetailsInfo.data[0].taxes_id.length) {
      dispatch(getTaxes(productDetailsInfo.data[0].taxes_id, appModels.TAX));
    }
  }, [productDetailsInfo]);

  return (
    <>
      <Row>
        <Col md="12" sm="12" lg="12" xs="12">
          <Card className="border-0 h-100">
            {productDetailsInfo && (productDetailsInfo.data && productDetailsInfo.data.length > 0) && (
            <CardBody>
              <Row>
                <Col md={12} sm={12} xs={12} lg={12}>
                  <Tabs defaultActiveKey={currentTab} onChange={changeTab}>
                    {tabs && tabs.detailstabs.map((tabData) => (
                      <TabPane tab={tabData.name} key={tabData.name} />
                    ))}
                  </Tabs>
                  {product && currentTab === 'General Information' ? (
                    <Row className="ml-1 mr-1 mt-1">
                      <Col sm="6" md="6" lg="6">
                        <Col sm="12" md="12" lg="12" className="mt-3">
                          <Row className="m-0">
                            <span className="font-weight-500">
                              Internal Reference
                            </span>
                          </Row>
                          <Row className="m-0">
                            <span className="p-0 font-weight-800 text-capital">
                              {product.default_code ? product.default_code : getDefaultNoValue(product.default_code)}
                            </span>
                          </Row>
                        </Col>
                        <hr className="mt-3" />
                        <Col sm="12" md="12" lg="12" className="mt-3">
                          <Row className="m-0">
                            <span className="font-weight-500">
                              Barcode
                            </span>
                          </Row>
                          <Row className="m-0">
                            <span className="p-0 font-weight-800 text-capital">
                              {product.barcode ? product.barcode : getDefaultNoValue(product.barcode)}
                            </span>
                          </Row>
                        </Col>
                        <hr className="mt-3" />
                        <Col sm="12" md="12" lg="12" className="mt-3">
                          <Row className="m-0">
                            <span className="font-weight-500">
                              Sales Price
                            </span>
                          </Row>
                          <Row className="m-0">
                            <span className="p-0 font-weight-800 text-capital">
                              {product.list_price ? product.list_price : getDefaultNoValue(product.list_price)}
                            </span>
                          </Row>
                        </Col>
                        <hr className="mt-3" />
                        <Col sm="12" md="12" lg="12" className="mt-3">
                          <Row className="m-0">
                            <span className="font-weight-500">
                              Customer Taxes
                            </span>
                          </Row>
                          <Row className="m-0">
                            <span className="p-0 font-weight-800 text-capital">
                              {product.taxes_id && product.taxes_id.length > 0 ? (
                                taxesInfo && taxesInfo.data && taxesInfo.data.length && taxesInfo.data.map((tax) => (
                                  <React.Fragment key={tax.id}>
                                    {tax.name}
                                  </React.Fragment>
                                ))
                              ) : '-'}
                            </span>
                          </Row>
                        </Col>
                        <hr className="mt-3" />
                      </Col>
                      <Col sm="6" md="6" lg="6">
                        <Col sm="12" md="12" lg="12" className="mt-3">
                          <Row className="m-0">
                            <span className="font-weight-500">
                              Country Of Origin
                            </span>
                          </Row>
                          <Row className="m-0">
                            <span className="p-0 font-weight-800 text-capital">
                              {product.origin_country_id && product.origin_country_id.length ? product.origin_country_id[1] : getDefaultNoValue(product.origin_country_id)}
                            </span>
                          </Row>
                        </Col>
                        <hr className="mt-3" />
                        <Col sm="12" md="12" lg="12" className="mt-3">
                          <Row className="m-0">
                            <span className="font-weight-500">
                              H.S. Code
                            </span>
                          </Row>
                          <Row className="m-0">
                            <span className="p-0 font-weight-800 text-capital">
                              {product.hs_code_id && product.hs_code_id.length ? product.hs_code_id[1] : getDefaultNoValue(product.hs_code_id)}
                            </span>
                          </Row>
                        </Col>
                        <hr className="mt-3" />
                        <Col sm="12" md="12" lg="12" className="mt-3">
                          <Row className="m-0">
                            <span className="font-weight-500">
                              Cost
                            </span>
                          </Row>
                          <Row className="m-0">
                            <span className="p-0 font-weight-800 text-capital">
                              {product.standard_price ? product.standard_price : getDefaultNoValue(product.standard_price)}
                            </span>
                          </Row>
                        </Col>
                        <hr className="mt-3" />
                        <Col sm="12" md="12" lg="12" className="mt-3">
                          <Row className="m-0">
                            <span className="font-weight-500">
                              Company
                            </span>
                          </Row>
                          <Row className="m-0">
                            <span className="p-0 font-weight-800 text-capital">
                              {product.company_id && product.company_id.length ? product.company_id[1] : getDefaultNoValue(product.company_id)}
                            </span>
                          </Row>
                        </Col>
                        <hr className="mt-3" />
                      </Col>
                    </Row>
                  ) : ''}
                  {product && currentTab === 'Purchase' ? (
                    <PurchaseDetails />
                  ) : ''}
                  {product && currentTab === 'Inventory' ? (
                    <Row className="ml-1 mr-1 mt-1">
                      <Col sm="6" md="6" lg="6">
                        <Col sm="12" md="12" lg="12" className="mt-2">
                          <h5>Operations</h5>
                          <span className="font-weight-500 ml-3">Routes</span>
                          <br />
                          {locationRouteInfo && locationRouteInfo.data && locationRouteInfo.data.length && locationRouteInfo.data.map((route) => (
                            <React.Fragment key={route.id}>
                              <Checkbox
                                name={route.name}
                                className="ml-3"
                                id={route.name}
                                checked={product.route_ids && product.route_ids.length ? product.route_ids.some((data) => data === route.id) : false}
                              />
                              <Label htmlFor={route.name}>
                                <span>{route.name}</span>
                              </Label>
                              <br />
                            </React.Fragment>
                          ))}
                          {locationRouteInfo && locationRouteInfo.loading ? (
                            <Loader />
                          ) : ''}
                        </Col>
                        <Col sm="12" md="12" lg="12" className="ml-3 mt-2">
                          <span>Customer Lead Time</span>
                          <Row className="m-0 ml-2 mt-2">
                            <span className="font-weight-500">
                              Days
                            </span>
                          </Row>
                          <Row className="m-0">
                            <span className="ml-2 p-0 font-weight-800 text-capital">
                              {product.sale_delay ? product.sale_delay : getDefaultNoValue(product.sale_delay)}
                            </span>
                          </Row>
                        </Col>
                      </Col>
                      <Col sm="6" md="6" lg="6" className="mt-2">
                        <h5>Logistic</h5>
                        <Col sm="12" md="12" lg="12" className="mt-3">
                          <Row className="m-0">
                            <span className="font-weight-500">
                              Weight
                            </span>
                          </Row>
                          <Row className="m-0">
                            <span className="p-0 font-weight-800 text-capital">
                              {product.weight ? product.weight : getDefaultNoValue(product.weight)}
                            </span>
                          </Row>
                        </Col>
                        <hr className="mt-3" />
                        <Col sm="12" md="12" lg="12" className="mt-3">
                          <Row className="m-0">
                            <span className="font-weight-500">
                              Volume
                            </span>
                          </Row>
                          <Row className="m-0">
                            <span className="p-0 font-weight-800 text-capital">
                              {product.volume ? product.volume : getDefaultNoValue(product.volume)}
                            </span>
                          </Row>
                        </Col>
                        <hr className="mt-3" />
                      </Col>
                      <hr className="mt-3" />
                    </Row>
                  ) : ''}
                  {product && currentTab === 'Internal Notes' ? (
                    <Row>
                      <h6 className="ml-3">Internal Notes</h6>
                      {product.description ? (
                        <>
                          <Col sm="12" md="12" lg="12">
                            <p className="font-weight-500 ml-2">
                              {product.description}
                            </p>
                          </Col>
                        </>
                      ) : (
                        <span className="ml-5">
                          <ErrorContent errorTxt="No Data" />
                        </span>
                      )}
                    </Row>
                  ) : ''}
                  {currentTab === 'Audit Logs'
                    ? <AuditLog ids={product.message_ids} />
                    : ''}
                  {currentTab === 'Log Note'
                    ? <LogNotes ids={product.message_ids} />
                    : ''}
                  {currentTab === 'Schedule Activity'
                    ? <ScheduleActivities resModalName={appModels.PARTS} resId={product.id} />
                    : ''}
                </Col>
              </Row>
            </CardBody>
            )}
          </Card>
        </Col>
      </Row>
    </>
  );
};
export default ProductDetailsTabs;
