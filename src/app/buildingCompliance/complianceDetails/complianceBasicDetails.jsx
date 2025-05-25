/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Col,
  Row,
  Card,
  CardBody,
} from 'reactstrap';
import * as PropTypes from 'prop-types';

import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import {
  generateErrorMessage,
} from '../../util/appUtils';

import AssetInfo from './assetInfo';
import RecurrenceInfo from './recurrenceInfo';
import AdditionalInfo from './additionalInfo';

const ComplianceBasicDetails = (props) => {
  const {
    detailData,
  } = props;

  const viewData = detailData && (detailData.data && detailData.data.length > 0) ? detailData.data[0] : false;

  return (
    <>
      {viewData && (
        <div>
          <Row className="p-0">
            <Col sm="12" md="4" xs="12" lg="4" className="mb-2 pr-04">
              <Card className="h-100 compliance-overview-tabs">
                <p className="ml-3 mb-1 mt-2 font-weight-600 text-pale-sky font-size-13">ASSET INFORMATION</p>
                <hr className="mb-0 mt-0 mr-2 ml-2" />
                <CardBody className="p-0">
                  <div className="mt-1 pl-3">
                    <AssetInfo detailData={viewData} />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col sm="12" md="4" xs="12" lg="4" className="mb-2 pl-04">
              <Card className="h-100 compliance-overview-tabs">
                <p className="ml-3 mb-1 mt-2 font-weight-600 text-pale-sky font-size-13">RECURRENCE INFORMATION</p>
                <hr className="mb-0 mt-0 mr-2 ml-2" />
                <CardBody className="p-0">
                  <div className="mt-1 pl-3">
                    <RecurrenceInfo detailData={viewData} />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col sm="12" md="4" xs="12" lg="4" className="mb-2 pl-04">
              <Card className="h-100 compliance-overview-tabs">
                <p className="ml-3 mb-1 mt-2 font-weight-600 text-pale-sky font-size-13">ADDITIONAL INFORMATION</p>
                <hr className="mb-0 mt-0 mr-2 ml-2" />
                <CardBody className="p-0">
                  <div className="mt-1 pl-3">
                    <AdditionalInfo detailData={viewData} />
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

ComplianceBasicDetails.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
};
export default ComplianceBasicDetails;
