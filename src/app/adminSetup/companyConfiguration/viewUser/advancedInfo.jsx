/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Col,
  Row,
  Card,
  CardBody,
} from 'reactstrap';
import { useSelector } from 'react-redux';

import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';
import {
  getDefaultNoValue,
  generateErrorMessage,
} from '../../../util/appUtils';

const AdvancedInfo = () => {
  const { userDetails } = useSelector((state) => state.setup);

  return (
    <Row className="h-100">
      <Col md="12" sm="12" lg="12" xs="12">
        <Card className="border-0 h-100">
          {userDetails && (userDetails.data && userDetails.data.length > 0) && (
          <CardBody className="h-100">
            <div className="pr-2">
              <h6>
                Advanced
              </h6>
              <Row className="mb-4 ml-1 mr-1 mt-3">
                <Col sm="12" md="12" xs="12" lg="6">
                  <Row className="m-0">
                    <span className="m-0 p-0 font-weight-400">Shift</span>
                  </Row>
                  <Row className="m-0">
                    <span className="m-0 p-0 font-weight-800 font-tiny text-capital">
                      {getDefaultNoValue(userDetails.data[0].resource_calendar_id ? userDetails.data[0].resource_calendar_id[1] : '')}
                    </span>
                  </Row>
                  <hr className="mt-2" />
                  <Row className="m-0">
                    <span className="m-0 p-0 font-weight-400">Biometric ID</span>
                  </Row>
                  <Row className="m-0">
                    <span className="m-0 p-0 font-weight-800 font-tiny text-capital">
                      {getDefaultNoValue(userDetails.data[0].biometric)}
                    </span>
                  </Row>
                  <hr className="mt-2" />
                  <Row className="m-0">
                    <span className="m-0 p-0 font-weight-400">Mobile User Only</span>
                  </Row>
                  <Row className="m-0">
                    <span className="m-0 p-0 font-weight-800 font-tiny text-capital">
                      {userDetails.data[0].is_mobile_user ? 'Yes' : 'No'}
                    </span>
                  </Row>
                  <hr className="mt-2" />
                </Col>
                <Col sm="12" md="12" xs="12" lg="6">
                  <Row className="m-0">
                    <span className="m-0 p-0 font-weight-400">Department</span>
                  </Row>
                  <Row className="m-0">
                    <span className="m-0 p-0 font-weight-800 font-tiny text-capital">
                      {getDefaultNoValue(userDetails.data[0].hr_department ? userDetails.data[0].hr_department[1] : '')}
                    </span>
                  </Row>
                  <hr className="mt-2" />
                  <Row className="m-0">
                    <span className="m-0 p-0 font-weight-400">Employee ID</span>
                  </Row>
                  <Row className="m-0">
                    <span className="m-0 p-0 font-weight-800 font-tiny text-capital">
                      {getDefaultNoValue(userDetails.data[0].employee_id_seq)}
                    </span>
                  </Row>
                  <hr className="mt-2" />
                  <Row className="m-0">
                    <span className="m-0 p-0 font-weight-400">Vendor ID</span>
                  </Row>
                  <Row className="m-0">
                    <span className="m-0 p-0 font-weight-800 font-tiny text-capital">
                      {getDefaultNoValue(userDetails.data[0].vendor_id_seq)}
                    </span>
                  </Row>
                  <hr className="mt-2" />
                </Col>
              </Row>
            </div>
          </CardBody>
          )}
          {userDetails && userDetails.loading && (
          <CardBody className="mt-4" data-testid="loading-case">
            <Loader />
          </CardBody>
          )}
          {(userDetails && userDetails.err) && (
          <CardBody>
            <ErrorContent errorTxt={generateErrorMessage(userDetails)} />
          </CardBody>
          )}
        </Card>
      </Col>
    </Row>
  );
};
export default AdvancedInfo;
