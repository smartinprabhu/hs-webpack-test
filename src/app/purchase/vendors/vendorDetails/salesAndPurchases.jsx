/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
import {
  Col,
  Row,
  Card,
  CardBody,
} from 'reactstrap';
import { useSelector } from 'react-redux';

import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import {
  getDefaultNoValue,
  generateErrorMessage,
} from '../../../util/appUtils';

const SalesAndPurchases = () => {
  const [vendor, setVendor] = useState(false);
  const {
    vendorDetails,
  } = useSelector((state) => state.purchase);
  useEffect(() => {
    if (vendorDetails && vendorDetails.data && vendorDetails.data.length) {
      setVendor(vendorDetails.data[0]);
    }
  }, [vendorDetails]);
  return (
    <>
      {vendor && (
        <Row className="ml-1 mr-1 mt-1">
          <Col sm="6" md="6" lg="6">
            <Col sm="12" md="12" lg="12" className="mt-3">
              <Row className="m-0 ml-2 mt-2">
                <span className="font-weight-500">
                  Is a Customer
                </span>
              </Row>
              <Row className="m-0">
                <span className="ml-2 p-0 font-weight-800 text-capital">
                  {vendor.customer ? 'Yes' : 'No'}
                </span>
              </Row>
            </Col>
            <hr className="mt-3" />
            <Col sm="12" md="12" lg="12" className="mt-3">
              <Row className="m-0 ml-2 mt-2">
                <span className="font-weight-500">
                  Sales Payment Terms
                </span>
              </Row>
              <Row className="m-0">
                <span className="ml-2 p-0 font-weight-800 text-capital">
                  {vendor.property_payment_term_id && vendor.property_payment_term_id.length ? vendor.property_payment_term_id[1] : getDefaultNoValue(vendor.property_payment_term_id)}
                </span>
              </Row>
            </Col>
            <hr className="mt-3" />
            <Col sm="12" md="12" lg="12" className="mt-3">
              <Row className="m-0 ml-2 mt-2">
                <span className="font-weight-500">
                  Assigned User
                </span>
              </Row>
              <Row className="m-0">
                <span className="ml-2 p-0 font-weight-800 text-capital">
                  {vendor.user_id && vendor.user_id.length ? vendor.user_id[1] : getDefaultNoValue(vendor.user_id)}
                </span>
              </Row>
            </Col>
            <hr className="mt-3" />
            <Col sm="12" md="12" lg="12" className="mt-3">
              <Row className="m-0 ml-2 mt-2">
                <span className="font-weight-500">
                  Visitor
                </span>
              </Row>
              <Row className="m-0">
                <span className="ml-2 p-0 font-weight-800 text-capital">
                  {vendor.is_visitor ? 'Yes' : 'No'}
                </span>
              </Row>
            </Col>
            <hr className="mt-3" />
            <Col sm="12" md="12" lg="12" className="mt-3">
              <Row className="m-0 ml-2 mt-2">
                <span className="font-weight-500">
                  Command Centre
                </span>
              </Row>
              <Row className="m-0">
                <span className="ml-2 p-0 font-weight-800 text-capital">
                  {vendor.is_command_centre ? 'Yes' : 'No'}
                </span>
              </Row>
            </Col>
            <hr className="mt-3" />
            <Col sm="12" md="12" lg="12" className="mt-3">
              <Row className="m-0 ml-2 mt-2">
                <span className="font-weight-500">
                  Fiscal Postion
                </span>
              </Row>
              <Row className="m-0">
                <span className="ml-2 p-0 font-weight-800 text-capital">
                  {vendor.property_account_position_id && vendor.property_account_position_id.length ? vendor.property_account_position_id[1] : getDefaultNoValue(vendor.property_account_position_id)}
                </span>
              </Row>
            </Col>
            <hr className="mt-3" />
          </Col>
          <Col sm="6" md="6" lg="6">
            <Col sm="12" md="12" lg="12" className="mt-3">
              <Row className="m-0 ml-2 mt-2">
                <span className="font-weight-500">
                  Is a Vendor
                </span>
              </Row>
              <Row className="m-0">
                <span className="ml-2 p-0 font-weight-800 text-capital">
                  {vendor.supplier ? 'Yes' : 'No'}
                </span>
              </Row>
            </Col>
            <hr className="mt-3" />
            <Col sm="12" md="12" lg="12" className="mt-3">
              <Row className="m-0 ml-2 mt-2">
                <span className="font-weight-500">
                  Purchase  Payment Terms
                </span>
              </Row>
              <Row className="m-0">
                <span className="ml-2 p-0 font-weight-800 text-capital">
                  {vendor.property_payment_term_id && vendor.property_payment_term_id.length ? vendor.property_payment_term_id[1] : getDefaultNoValue(vendor.property_payment_term_id)}
                </span>
              </Row>
            </Col>
            <hr className="mt-3" />
            <Col sm="12" md="12" lg="12" className="mt-3">
              <Row className="m-0 ml-2 mt-2">
                <span className="font-weight-500">
                  FM Services
                </span>
              </Row>
              <Row className="m-0">
                <span className="ml-2 p-0 font-weight-800 text-capital">
                  {vendor.is_fm_services ? 'Yes' : 'No'}
                </span>
              </Row>
            </Col>
            <hr className="mt-3" />
            <Col sm="12" md="12" lg="12" className="mt-3">
              <Row className="m-0 ml-2 mt-2">
                <span className="font-weight-500">
                  Tenant
                </span>
              </Row>
              <Row className="m-0">
                <span className="ml-2 p-0 font-weight-800 text-capital">
                  {vendor.is_tenant ? 'Yes' : 'No'}
                </span>
              </Row>
            </Col>
            <hr className="mt-3" />
            <Col sm="12" md="12" lg="12" className="mt-3">
              <Row className="m-0 ml-2 mt-2">
                <span className="font-weight-500">
                  Man Power Agency
                </span>
              </Row>
              <Row className="m-0">
                <span className="ml-2 p-0 font-weight-800 text-capital">
                  {vendor.is_man_power_agency ? 'Yes' : 'No'}
                </span>
              </Row>
            </Col>
            <hr className="mt-3" />
          </Col>
        </Row>
      )}
      {vendorDetails && vendorDetails.loading && (
      <Card>
        <CardBody className="mt-4">
          <Loader />
        </CardBody>
      </Card>
      )}
      {(vendorDetails && vendorDetails.err) && (
        <Card>
          <CardBody>
            <ErrorContent errorTxt={generateErrorMessage(vendorDetails)} />
          </CardBody>
        </Card>
      )}
    </>
  );
};
export default SalesAndPurchases;
