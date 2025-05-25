/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Col,
  Row,
  Card,
  CardBody,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { Tooltip } from 'antd';

import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import {
  generateErrorMessage, truncate,
} from '../../util/appUtils';

import IncidentInfo from './breakdownDetails/incidentInfo';
import AssetInfo from './breakdownDetails/assetInfo';
import ResolutionInfo from './breakdownDetails/resolutionInfo';
import RequestorInfo from './breakdownDetails/requestorInfo';
import VendorInfo from './breakdownDetails/vendorInfo';

const BasicInfo = (props) => {
  const {
    detailData,
  } = props;

  const ticketData = detailData && (detailData.data && detailData.data.length > 0) ? detailData.data[0] : false;

  return (
    <>
      {ticketData && (
        <div>
          <Row className="p-0 TicketsSegments-cards">
            <Col sm="12" md="4" xs="12" lg="4" className="mb-2 pb-1 pr-04">
              <Card className="h-100">
                <p className="ml-3 mb-1 mt-2 font-weight-600 text-pale-sky font-size-13">INCIDENT INFORMATION</p>
                <hr className="mb-0 mt-0 mr-2 ml-2" />
                <CardBody className="p-0">
                  <div className="mt-1 pl-3">
                    <IncidentInfo detailData={ticketData} />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col sm="12" md="4" xs="12" lg="4" className="mb-2 pb-1 pl-04 pl-04">
              <Card className="h-100">
                <p className="ml-3 mb-1 mt-2 font-weight-600 text-pale-sky font-size-13">ASSET INFORMATION</p>
                <hr className="mb-0 mt-0 mr-2 ml-2" />
                <CardBody className="p-0">
                  <div className="mt-1 pl-3">
                    <AssetInfo detailData={ticketData} />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col sm="12" md="4" xs="12" lg="4" className="mb-2 pb-1 pl-0">
              <Card className="h-100">
                <p className="ml-3 mb-1 mt-2 font-weight-600 text-pale-sky font-size-13">RESOLUTION INFORMATION</p>
                <hr className="mb-0 mt-0 mr-2 ml-2" />
                <CardBody className="p-0">
                  <div className="mt-1 pl-3">
                    <ResolutionInfo detailData={ticketData} />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row className="p-0 TicketsSegments-cards">
            <Col sm="12" md="4" xs="12" lg="4" className="mb-2 pb-1 pr-04">
              <Card className="h-100">
                <p className="ml-3 mb-1 mt-2 font-weight-600 text-pale-sky font-size-13">REQUESTOR INFORMATION</p>
                <hr className="mb-0 mt-0 mr-2 ml-2" />
                <CardBody className="p-0">
                  <div className="mt-1 pl-3">
                    <RequestorInfo detailData={ticketData} />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col sm="12" md="4" xs="12" lg="4" className="mb-2 pb-1 pl-04 pl-04">
              <Card className="h-100">
                <p className="ml-3 mb-1 mt-2 font-weight-600 text-pale-sky font-size-13">VENDOR INFORMATION</p>
                <hr className="mb-0 mt-0 mr-2 ml-2" />
                <CardBody className="p-0">
                  <div className="mt-1 pl-3">
                    <VendorInfo detailData={ticketData} />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col sm="12" md="4" xs="12" lg="4" className="mb-2 pb-1 pl-0">
              <Card className="h-100">
                <p className="ml-3 mb-1 mt-2 font-weight-600 text-pale-sky font-size-13">DESCRIPTION</p>
                <hr className="mb-0 mt-0 mr-2 ml-2" />
                <CardBody className="p-0 med-form-content thin-scrollbar text-break">
                  <div className="mt-1 pl-3">
                    {ticketData.description_of_breakdown
                      ? (
                        <Tooltip title={ticketData.description_of_breakdown} placement="bottom">                        { }
                          {truncate(ticketData.description_of_breakdown, '120')}
                        </Tooltip>
                      )
                      : ''}
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      )}
      {detailData && detailData.loading && (
        <Card>
          <CardBody className="mt-4">
            <Loader />
          </CardBody>
        </Card>
      )}

      {(detailData && detailData.err) && (
        <Card>
          <CardBody>
            <ErrorContent errorTxt={generateErrorMessage(detailData)} />
          </CardBody>
        </Card>
      )}
    </>
  );
};

BasicInfo.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
};

export default BasicInfo;
