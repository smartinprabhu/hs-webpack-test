/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Card,
  CardBody,
  Col,
  Row,
} from 'reactstrap';
import { useSelector } from 'react-redux';

import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import employeeLogo from '@images/attendanceBlue.ico';
import { getRegStatusLabel } from '../utils/utils';
import { getDefaultNoValue, generateErrorMessage } from '../../util/appUtils';

const EmployeeInfo = () => {
  const { employeeDetails } = useSelector((state) => state.employee);
  const employeeData = employeeDetails && (employeeDetails.data && employeeDetails.data.length > 0) ? employeeDetails.data[0] : '';

  return (
    <Card className="border-0 h-100">
      {employeeDetails && (employeeDetails.data && employeeDetails.data.length > 0) && (
      <CardBody data-testid="success-case">
        <Row>
          <Col md="8" xs="8" sm="8" lg="8">
            <h4 className="mb-1 font-weight-800 font-medium">{employeeData.name}</h4>
            <p className="mb-1 font-weight-400 mt-1 font-tiny">
              {employeeData.employee_id_seq}
            </p>
            {getRegStatusLabel(employeeData.registration_status)}
          </Col>
          <Col md="4" xs="4" sm="4" lg="4" className="text-center">
            {employeeData && employeeData.image_small && (
            <img src={`data:image/png;base64,${employeeData.image_small}`} alt="Employee logo small" className="m-0" width="50" height="50" />
            )}
            {employeeData && !employeeData.image_small && (
            <img src={employeeLogo} alt="Employee default " className="m-0" width="50" height="50" />
            )}
          </Col>
        </Row>
        <Row className="mb-1 mt-1 ml-0">
          <span className="font-weight-800 font-side-heading mb-1 mt-3">EMPLOYEE INFO</span>
        </Row>
        <Row className="pb-2">
          <Col md="12" xs="12" sm="12" lg="12">
            <Card className="bg-lightblue">
              <CardBody className="p-1 info-card">
                <p className="font-weight-400 mb-1 ml-1">
                  Work Phone
                </p>
                <p className="font-weight-800 font-side-heading mb-0 ml-1 text-capital">
                  {getDefaultNoValue(employeeData.phone_number)}
                </p>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row className="pb-2">
          <Col md="12" xs="12" sm="12" lg="12">
            <Card className="bg-lightblue">
              <CardBody className="p-1 info-card">
                <p className="font-weight-400 mb-1 ml-1">
                  Email
                </p>
                <p className="font-weight-800 font-side-heading mb-0 ml-1 text-capital">
                  {getDefaultNoValue(employeeData.email)}
                </p>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row className="pb-2">
          <Col md="12" xs="12" sm="12" lg="12">
            <Card className="bg-lightblue">
              <CardBody className="p-1 info-card">
                <p className="font-weight-400 mb-1 ml-1">
                  Employee Number
                </p>
                <p className="font-weight-800 font-side-heading mb-0 ml-1">
                  {getDefaultNoValue(employeeData.employee_id_seq)}
                </p>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </CardBody>
      )}
      {employeeDetails && employeeDetails.loading && (
      <CardBody className="mt-4" data-testid="loading-case">
        <Loader />
      </CardBody>
      )}

      {(employeeDetails && employeeDetails.err) && (
      <CardBody>
        <ErrorContent errorTxt={generateErrorMessage(employeeDetails)} />
      </CardBody>
      )}
    </Card>
  );
};

export default EmployeeInfo;
