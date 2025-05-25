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
  const { siteDetails } = useSelector((state) => state.setup);

  return (
    <Row className="h-100">
      <Col md="12" sm="12" lg="12" xs="12">
        <Card className="border-0 h-100">
          {siteDetails && (siteDetails.data && siteDetails.data.length > 0) && (
          <CardBody className="h-100">
            <div className="pr-2">
              <h6>
                Advanced
              </h6>
              <Row className="mb-4 ml-1 mr-1 mt-3">
                <Col sm="12" md="12" xs="12" lg="6">
                  <Row className="m-0">
                    <span className="m-0 p-0 font-weight-400">Latitude</span>
                  </Row>
                  <Row className="m-0">
                    <span className="m-0 p-0 font-weight-800 font-tiny text-capital">{getDefaultNoValue(siteDetails.data[0].latitude)}</span>
                  </Row>
                  <hr className="mt-2" />
                  <Row className="m-0">
                    <span className="m-0 p-0 font-weight-400">Picture of Site</span>
                  </Row>
                  <Row className="m-0">
                    {siteDetails.data[0].theme_logo ? (
                      <img src={`data:image/png;base64,${siteDetails.data[0].theme_logo}`} alt="logo" width="100" height="100" />
                    )
                      : (
                        <span className="m-0 p-0 font-weight-800 font-tiny">Not Assigned</span>
                      )}
                  </Row>
                  <hr className="mt-2" />
                </Col>
                <Col sm="12" md="12" xs="12" lg="6">
                  <Row className="m-0">
                    <span className="m-0 p-0 font-weight-400">Longitude</span>
                  </Row>
                  <Row className="m-0">
                    <span className="m-0 p-0 font-weight-800 font-tiny">{getDefaultNoValue(siteDetails.data[0].longitude)}</span>
                  </Row>
                  <hr className="mt-2" />
                  <Row className="m-0">
                    <span className="m-0 p-0 font-weight-400">Logo</span>
                  </Row>
                  <Row className="m-0">
                    {siteDetails.data[0].logo ? (
                      <img src={`data:image/png;base64,${siteDetails.data[0].logo}`} alt="logo" width="100" height="100" />
                    )
                      : (
                        <span className="m-0 p-0 font-weight-800 font-tiny">Not Assigned</span>
                      )}
                  </Row>
                  <hr className="mt-2" />
                </Col>
              </Row>
            </div>
          </CardBody>
          )}
          {siteDetails && siteDetails.loading && (
          <CardBody className="mt-4" data-testid="loading-case">
            <Loader />
          </CardBody>
          )}
          {(siteDetails && siteDetails.err) && (
          <CardBody>
            <ErrorContent errorTxt={generateErrorMessage(siteDetails)} />
          </CardBody>
          )}
        </Card>
      </Col>
    </Row>
  );
};
export default AdvancedInfo;
