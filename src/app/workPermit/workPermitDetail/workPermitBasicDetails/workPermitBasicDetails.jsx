/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Col,
  Row,
  Card,
  CardBody,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import {
  generateErrorMessage,
} from '../../../util/appUtils';

import WorkPermitInfo from './workPermitInfo';
import VendorInfo from './vendorInfo';
import ApprovalInfo from './approvalInfo';
import OtherInfo from './otherInfo';
import OrderInfo from './orderInfo';
import ReviewInfo from './reviewInfo';
import EhsValidate from './ehsValidate';
import VendorDetail from './vendorDetail';

const workPermitBasicDetails = (props) => {
  const {
    detailData,
    openWorkOrder,
  } = props;

  const viewData = detailData && (detailData.data && detailData.data.length > 0) ? detailData.data[0] : false;
  const { workPermitConfig } = useSelector((state) => state.workpermit);
  const wpConfig = workPermitConfig && workPermitConfig.data && workPermitConfig.data.length ? workPermitConfig.data[0] : false;

  const otherCard = (
    <Col sm="12" md="4" xs="12" lg="4" className="mb-2 pr-04">
      <Card className="h-100">
        <p className="ml-3 mb-1 mt-2 font-weight-600 text-pale-sky font-size-13">OTHER INFORMATION</p>
        <hr className="mb-0 mt-0 mr-2 ml-2" />
        <CardBody className="p-0">
          <div className="mt-1 pl-3">
            <OtherInfo detailData={viewData} />
          </div>
        </CardBody>
      </Card>
    </Col>
  );

  const vendorCard = (
    <Col sm="12" md="4" xs="12" lg="4" className="mb-2 pl-04">
      <Card className="h-100">
        <p className="ml-3 mb-1 mt-2 font-weight-600 text-pale-sky font-size-13">
          VENDOR TECHNICIANS INFORMATION - (
          {viewData && viewData.work_technician_ids ? viewData.work_technician_ids.length : 0}
          )
        </p>
        <CardBody className="p-0">
          <div className="mt-1 ml-0">
            <VendorDetail detailData={viewData} />
          </div>
        </CardBody>
      </Card>
    </Col>
  );

  return (
    <>
      {viewData && (
        <div>
          <Row className="p-0 work-permit-overview">
            <Col sm="12" md="4" xs="12" lg="4" className="mb-2 pr-04">
              <Card className="h-100">
                <p className="ml-3 mb-1 mt-2 font-weight-600 text-pale-sky font-size-13">WORK PERMIT INFORMATION</p>
                <hr className="mb-0 mt-0 mr-2 ml-2" />
                <CardBody className="p-0">
                  <div className="mt-1 pl-3">
                    <WorkPermitInfo detailData={viewData} />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col sm="12" md="4" xs="12" lg="4" className="mb-2 pl-04">
              <Card className="h-100">
                <p className="ml-3 mb-1 mt-2 font-weight-600 text-pale-sky font-size-13">VENDOR INFORMATION</p>
                <hr className="mb-0 mt-0 mr-2 ml-2" />
                <CardBody className="p-0">
                  <div className="mt-1 pl-3">
                    <VendorInfo detailData={viewData} />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col sm="12" md="4" xs="12" lg="4" className="mb-2 pl-0">
              <Card className="h-100">
                <p className="ml-3 mb-1 mt-2 font-weight-600 text-pale-sky font-size-13">MAINTENANCE INFORMATION</p>
                <hr className="mb-0 mt-0 mr-2 ml-2" />
                <CardBody className="p-0">
                  <div className="mt-1 pl-0">
                    <OrderInfo detailData={viewData} openWorkOrder={openWorkOrder} />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row className="p-0 work-permit-overview">
            {wpConfig && wpConfig.is_ehs_required && (
              <Col sm="12" md="4" xs="12" lg="4" className="mb-2 pr-04">
                <Card className="h-100">
                  <p className="ml-3 mb-1 mt-2 font-weight-600 text-pale-sky font-size-13">EHS VALIDATION</p>
                  <hr className="mb-0 mt-0 mr-2 ml-2" />
                  <CardBody className="p-0">
                    <div className="mt-1 pl-3">
                      <EhsValidate detailData={viewData} />
                    </div>
                  </CardBody>
                </Card>
              </Col>
            )}
            {wpConfig && wpConfig.review_required && (
              <Col sm="12" md="4" xs="12" lg="4" className={wpConfig && wpConfig.is_ehs_required ? 'mb-2 pl-04' : 'mb-2 pr-04'}>
                <Card className="h-100">
                  <p className="ml-3 mb-1 mt-2 font-weight-600 text-pale-sky font-size-13">REVIEW INFORMATION</p>
                  <hr className="mb-0 mt-0 mr-2 ml-2" />
                  <CardBody className="p-0">
                    <div className="mt-1 pl-3">
                      <ReviewInfo detailData={viewData} />
                    </div>
                  </CardBody>
                </Card>
              </Col>
            )}
            <Col sm="12" md="4" xs="12" lg="4" className="mb-2 pl-0">
              <Card className="h-100">
                <p className="ml-3 mb-1 mt-2 font-weight-600 text-pale-sky font-size-13">APPROVAL INFORMATION</p>
                <hr className="mb-0 mt-0 mr-2 ml-2" />
                <CardBody className="p-0">
                  <div className="mt-1 pl-3">
                    <ApprovalInfo detailData={viewData} />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          {wpConfig && wpConfig.is_ehs_required && wpConfig && wpConfig.review_required && (
            <Row className="p-0 work-permit-overview">
              {otherCard}
              {vendorCard}
            </Row>
          )}
          {((wpConfig && !wpConfig.is_ehs_required && wpConfig && wpConfig.review_required) || (wpConfig && wpConfig.is_ehs_required && wpConfig && !wpConfig.review_required)) && (
          <Row className="p-0 work-permit-overview">
            {vendorCard}
          </Row>
          )}
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

workPermitBasicDetails.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
  openWorkOrder: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.bool,
  ]).isRequired,
};
export default workPermitBasicDetails;
