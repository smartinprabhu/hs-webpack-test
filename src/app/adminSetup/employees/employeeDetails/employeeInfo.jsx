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
import employeeLogo from '@images/icons/attendanceBlue.ico';
import { getRegStatusLabel } from '../utils/utils';
import {
  getDefaultNoValue, generateErrorMessage,
} from '../../../util/appUtils';

const EmployeeInfo = () => {
  const { employeeDetails } = useSelector((state) => state.setup);
  const employeeData = employeeDetails && (employeeDetails.data && employeeDetails.data.length > 0) ? employeeDetails.data[0] : '';

  return (
    <>
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
                <img src={employeeLogo} alt="asset" className="m-0" width="50" height="50" />
              </Col>
            </Row>
            <Row className="mb-1 mt-1 ml-0">
              <span className="font-weight-800 font-side-heading mb-1 mt-3">EMPLOYEE INFO</span>
            </Row>
            <Row className="pb-2">
              <Col md="12" xs="12" sm="12" lg="12">
                <Card className="bg-lightblue">
                  <CardBody className="p-1">
                    <p className="font-weight-400 mb-1 ml-1">
                      Gender
                    </p>
                    <p className="font-weight-800 font-side-heading mb-0 ml-2 text-capital">
                      {getDefaultNoValue(employeeData.gender)}
                    </p>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Row className="pb-2">
              <Col md="12" xs="12" sm="12" lg="12">
                <Card className="bg-lightblue">
                  <CardBody className="p-1">
                    <p className="font-weight-400 mb-1 ml-1">
                      Marital Status
                    </p>
                    <p className="font-weight-800 font-side-heading mb-0 ml-2 text-capital">
                      {getDefaultNoValue(employeeData.marital)}
                    </p>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Row className="pb-2">
              <Col md="12" xs="12" sm="12" lg="12">
                <Card className="bg-lightblue">
                  <CardBody className="p-1">
                    <p className="font-weight-400 mb-1 ml-1">
                      Nationality
                    </p>
                    <p className="font-weight-800 font-side-heading mb-0 ml-2">
                      {getDefaultNoValue(employeeData.country_id ? employeeData.country_id[1] : '')}
                    </p>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Row className="pb-2">
              <Col md="12" xs="12" sm="12" lg="12">
                <Card className="bg-lightblue">
                  <CardBody className="p-1">
                    <p className="font-weight-400 mb-1 ml-1">
                      Identification Number
                    </p>
                    <p className="font-weight-800 font-side-heading mb-0 ml-2">
                      {getDefaultNoValue(employeeData.identification_id ? employeeData.identification_id[1] : '')}
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
    </>
  );
};

export default EmployeeInfo;
