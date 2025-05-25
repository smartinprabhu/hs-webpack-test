/* eslint-disable import/no-unresolved */
import React from 'react';
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

const SupportTicket = () => {
  const {
    vendorDetails,
  } = useSelector((state) => state.purchase);

  return (
    <>
      {vendorDetails && (vendorDetails.data && vendorDetails.data.length > 0) && (
        <div>
          <Row className="mb-4 ml-1 mr-1 mt-3">
            <Col sm="12" md="12" xs="12" lg="12">
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">Dedicated Support User</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-800 text-capital">
                  {getDefaultNoValue(vendorDetails.data[0].dedicated_support_user_id ? vendorDetails.data[0].dedicated_support_user_id[1] : '')}
                </span>
              </Row>
              <hr className="mt-3" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-400">SLA</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-800 text-capital">{getDefaultNoValue(vendorDetails.data[0].sla_id ? vendorDetails.data[0].sla_id[1] : '')}</span>
              </Row>
              <hr className="mt-3" />
            </Col>
          </Row>
        </div>
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
export default SupportTicket;
