/* eslint-disable import/no-unresolved */
import React from 'react';
import { useSelector } from 'react-redux';
import {
  Card,
  CardBody,
  Col,
  Row,
} from 'reactstrap';

import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';

import {
  getDefaultNoValue, generateErrorMessage,
} from '../../../util/appUtils';

const BasicInfo = () => {
  const { allowCompanies, userDetails } = useSelector((state) => state.setup);

  return (
    <>
      <Card className="border-0 h-100">
        {userDetails && (userDetails.data && userDetails.data.length > 0) && (
        <CardBody data-testid="success-case" className={userDetails && userDetails.err ? 'h-100 p-0' : 'h-100'}>
          <h6>Basic</h6>
          <Row className="pb-2">
            <Col md="12" sm="12" xs="12" lg="12">
              <Card className="bg-lightblue">
                <CardBody className="p-1">
                  <span className="font-weight-400 font-tiny mr-1">
                    Name
                  </span>
                  <br />
                  <span className="font-weight-800 font-tiny">
                    {getDefaultNoValue(userDetails.data[0].name)}
                  </span>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row className="pb-2">
            <Col md="12" sm="12" xs="12" lg="12">
              <Card className="bg-lightblue">
                <CardBody className="p-1">
                  <span className="font-weight-400 font-tiny mr-1">
                    User Role
                  </span>
                  <br />
                  <span className="font-weight-800 font-tiny">
                    {getDefaultNoValue(userDetails.data[0].user_role_id ? userDetails.data[0].user_role_id[1] : '')}
                  </span>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row className="pb-2">
            <Col md="12" sm="12" xs="12" lg="12">
              <Card className="bg-lightblue">
                <CardBody className="p-1">
                  <span className="font-weight-400 font-tiny mr-1">
                    Company
                  </span>
                  <br />
                  <span className="font-weight-800 font-tiny">
                    {getDefaultNoValue(userDetails.data[0].company_id ? userDetails.data[0].company_id[1] : '')}
                  </span>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row className="pb-2">
            <Col md="12" sm="12" xs="12" lg="12">
              <Card className="bg-lightblue">
                <CardBody className="p-1">
                  <span className="font-weight-400 font-tiny mr-1">
                    Email ID
                  </span>
                  <br />
                  <span className="font-weight-800 font-tiny">
                    {getDefaultNoValue(userDetails.data[0].email)}
                  </span>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row className="pb-2">
            <Col md="12" sm="12" xs="12" lg="12">
              <Card className="bg-lightblue">
                <CardBody className="p-1">
                  <span className="font-weight-400 font-tiny mr-1">
                    Associates to
                  </span>
                  <br />
                  <span className="font-weight-800 font-tiny">
                    {getDefaultNoValue(userDetails.data[0].associates_to)}
                  </span>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row className="pb-2">
            <Col md="12" sm="12" xs="12" lg="12">
              <Card className="bg-lightblue">
                <CardBody className="p-1">
                  <span className="font-weight-400 font-tiny mr-1">
                    Associated Entry
                  </span>
                  <br />
                  <span className="font-weight-800 font-tiny">
                    {getDefaultNoValue(userDetails.data[0].vendor_id ? userDetails.data[0].vendor_id[1] : '')}
                  </span>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row className="pb-2">
            <Col md="12" sm="12" xs="12" lg="12">
              <Card className="bg-lightblue">
                <CardBody className="p-1">
                  <span className="font-weight-400 font-tiny mr-1">
                    Allow Companies
                  </span>
                  <br />
                  <span className="font-weight-800 font-tiny">
                    {allowCompanies && allowCompanies.data && allowCompanies.data.map((ac) => (
                      <span className="mr-2">{ac.name}</span>
                    ))}
                  </span>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row className="pb-2">
            <Col md="12" sm="12" xs="12" lg="12">
              <Card className="bg-lightblue">
                <CardBody className="p-1">
                  <span className="font-weight-400 font-tiny mr-1">
                    Employee Active
                  </span>
                  <br />
                  <span className="font-weight-800 font-tiny">
                    {userDetails.data[0].active ? 'Yes' : 'No'}
                  </span>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </CardBody>
        )}

        {userDetails && userDetails.loading && (
        <CardBody className="mt-4" data-testid="loading-case">
          <Loader />
        </CardBody>
        )}
        {(userDetails && userDetails.err) && (
        <CardBody className="p-0">
          <ErrorContent errorTxt={generateErrorMessage(userDetails)} />
        </CardBody>
        )}
      </Card>
    </>
  );
};
export default BasicInfo;
