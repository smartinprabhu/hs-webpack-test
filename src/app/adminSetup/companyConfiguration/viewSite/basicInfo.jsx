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
  const { siteDetails } = useSelector((state) => state.setup);

  return (
    <>
      <Card className="border-0 h-100">
        {siteDetails && (siteDetails.data && siteDetails.data.length > 0) && (
        <CardBody data-testid="success-case" className="h-100">
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
                    {getDefaultNoValue(siteDetails.data[0].name)}
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
                    Code
                  </span>
                  <br />
                  <span className="font-weight-800 font-tiny">
                    {getDefaultNoValue(siteDetails.data[0].code)}
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
                    Address Line
                  </span>
                  <br />
                  <span className="font-weight-800 font-tiny">
                    {getDefaultNoValue(siteDetails.data[0].street)}
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
                    City
                  </span>
                  <br />
                  <span className="font-weight-800 font-tiny">
                    {getDefaultNoValue(siteDetails.data[0].street)}
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
                    State
                  </span>
                  <br />
                  <span className="font-weight-800 font-tiny">
                    {getDefaultNoValue(siteDetails.data[0].state_id ? siteDetails.data[0].state_id[1] : '')}
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
                    Country
                  </span>
                  <br />
                  <span className="font-weight-800 font-tiny">
                    {getDefaultNoValue(siteDetails.data[0].country_id ? siteDetails.data[0].country_id[1] : '')}
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
                    Timezone
                  </span>
                  <br />
                  <span className="font-weight-800 font-tiny">
                    {getDefaultNoValue(siteDetails.data[0].company_tz ? siteDetails.data[0].company_tz : '')}
                  </span>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </CardBody>
        )}

        {siteDetails && siteDetails.loading && (
        <CardBody className="mt-4" data-testid="loading-case">
          <Loader />
        </CardBody>
        )}
        {(siteDetails && siteDetails.err) && (
        <CardBody className="p-0">
          <ErrorContent errorTxt={generateErrorMessage(siteDetails)} />
        </CardBody>
        )}
      </Card>
    </>
  );
};
export default BasicInfo;
