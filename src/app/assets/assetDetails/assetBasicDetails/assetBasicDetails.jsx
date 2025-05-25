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
} from '../../../util/appUtils';

import GeneralInfo from './generalInfo';
import PurchaseInfo from './purchaseInfo';
import WarrantyInfo from './warrantyInfo';

import MaintenanceInfo from './maintenanceInfo';
import ValidationInfo from './validationInfo';
import AdditionalInfo from './additionalInfo';

const AssetBasicDetails = (props) => {
  const {
    detailData,
    isITAsset,
  } = props;

  const equipmentData = detailData && (detailData.data && detailData.data.length > 0) ? detailData.data[0] : false;

  return (
    <>
      {equipmentData && (
        <div>
          <Row className="p-0 TicketsSegments-cards">
            <Col sm="12" md="4" xs="12" lg="4" className="mb-2 pb-1 pr-04">
              <Card className="h-100">
                <p className="ml-3 mb-1 mt-2 font-weight-600 text-pale-sky font-size-13">GENERAL INFORMATION</p>
                <hr className="mb-0 mt-0 mr-2 ml-2" />
                <CardBody className="p-0">
                  <div className="mt-1 pl-3">
                    <GeneralInfo detailData={equipmentData} />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col sm="12" md="4" xs="12" lg="4" className="mb-2 pb-1 pl-04 pr-04">
              <Card className="h-100">
                <p className="ml-3 mb-1 mt-2 font-weight-600 text-pale-sky font-size-13">PURCHASE INFORMATION</p>
                <hr className="mb-0 mt-0 mr-2 ml-2" />
                <CardBody className="p-0">
                  <div className="mt-1 pl-3">
                    <PurchaseInfo detailData={equipmentData} />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col sm="12" md="4" xs="12" lg="4" className="mb-2 pb-1 pl-04">
              <Card className="h-100">
                <p className="ml-3 mb-1 mt-2 font-weight-600 text-pale-sky font-size-13">
                  {/* WARRANTY INFORMATION */}
                  WARRANTY / AMC INFORMATION
                  </p>
                <hr className="mb-0 mt-0 mr-2 ml-2" />
                <CardBody className="p-0">
                  <div className="mt-1 pl-3">
                    <WarrantyInfo detailData={equipmentData} />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row className="p-0 TicketsSegments-cards">
            <Col sm="12" md="4" xs="12" lg="4" className="mb-2 pb-1 pr-04">
              <Card className="h-100">
                <p className="ml-3 mb-1 mt-2 font-weight-600 text-pale-sky font-size-13">MAINTENANCE INFORMATION</p>
                <hr className="mb-0 mt-0 mr-2 ml-2" />
                <CardBody className="p-0">
                  <div className="mt-1 pl-3">
                    <MaintenanceInfo detailData={equipmentData} />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col sm="12" md="4" xs="12" lg="4" className="mb-2 pb-1 pl-04 pr-04">
              <Card className="h-100">
                <p className="ml-3 mb-1 mt-2 font-weight-600 text-pale-sky font-size-13">VALIDATION INFORMATION</p>
                <hr className="mb-0 mt-0 mr-2 ml-2" />
                <CardBody className="p-0">
                  <div className="mt-1 pl-3">
                    <ValidationInfo detailData={equipmentData} isITAsset={isITAsset} />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col sm="12" md="4" xs="12" lg="4" className="mb-2 pb-1 pl-04">
              <Card className="h-100">
                <p className="ml-3 mb-1 mt-2 font-weight-600 text-pale-sky font-size-13">ADDITIONAL INFORMATION</p>
                <hr className="mb-0 mt-0 mr-2 ml-2" />
                <CardBody className="p-0">
                  <div className="mt-1 pl-3">
                    <AdditionalInfo detailData={equipmentData} />
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

AssetBasicDetails.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
  isITAsset: PropTypes.bool,
};

AssetBasicDetails.defaultProps = {
  isITAsset: false,
};
export default AssetBasicDetails;
