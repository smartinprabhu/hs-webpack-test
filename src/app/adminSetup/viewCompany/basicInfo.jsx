/* eslint-disable import/no-unresolved */
import React from 'react';
import { useSelector } from 'react-redux';
import {
  Card,
  CardBody,
  Col,
  Row,
} from 'reactstrap';

import companyBuilding from '@images/building.jpg';
import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';

import {
  getDefaultNoValue, generateErrorMessage,
} from '../../util/appUtils';

const BasicInfo = () => {
  const { companyDetail } = useSelector((state) => state.setup);

  return (
    <>
      <Card className="border-0 h-100">
        {companyDetail && (companyDetail.data && companyDetail.data.length > 0) && (
        <CardBody data-testid="success-case" className="h-100">
          <h6>Basic</h6>
          <Row className="pb-2">
            <Col md="12">
              <p className="font-weight-400 font-tiny mr-1 mb-2">
                Company Logo
              </p>
              <img src={companyDetail.data[0].logo ? `data:image/png;base64,${companyDetail.data[0].logo}` : companyBuilding} alt="logo" width="100%" height="auto" />
            </Col>
          </Row>
          <Row className="pb-2">
            <Col md="12" sm="12" xs="12" lg="12">
              <Card className="bg-lightblue">
                <CardBody className="p-1">
                  <span className="font-weight-400 font-tiny mr-1">
                    Company Name
                  </span>
                  <br />
                  <span className="font-weight-800 font-tiny">
                    {getDefaultNoValue(companyDetail.data[0].name)}
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
                    Address
                  </span>
                  <br />
                  <span className="font-weight-800 font-tiny">
                    {getDefaultNoValue(companyDetail.data[0].street)}
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
                    Category
                  </span>
                  <br />
                  <span className="font-weight-800 font-tiny">
                    {getDefaultNoValue(companyDetail.data[0].res_company_categ_id[1])}
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
                    Currency
                  </span>
                  <br />
                  <span className="font-weight-800 font-tiny">
                    {getDefaultNoValue(companyDetail.data[0].currency_id[1])}
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
                    Time Zone
                  </span>
                  <br />
                  <span className="font-weight-800 font-tiny">
                    {getDefaultNoValue(companyDetail.data[0].company_tz)}
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
                    Website
                  </span>
                  <br />
                  <span className="font-weight-800 font-tiny">
                    {getDefaultNoValue(companyDetail.data[0].website)}
                  </span>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </CardBody>
        )}

        {companyDetail && companyDetail.loading && (
        <CardBody className="mt-4" data-testid="loading-case">
          <Loader />
        </CardBody>
        )}
        {(companyDetail && companyDetail.err) && (
        <CardBody>
          <ErrorContent errorTxt={generateErrorMessage(companyDetail)} />
        </CardBody>
        )}
      </Card>
    </>
  );
};
export default BasicInfo;
