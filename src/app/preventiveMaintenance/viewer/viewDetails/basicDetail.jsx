/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Col,
  Row,
  Card,
  CardBody,
} from 'reactstrap';
import * as PropTypes from 'prop-types';

import ScheduleInfo from './scheduleInfo';
import OrderInfo from './orderInfo';
import AdditionalInfo from './additionalInfo';

const BasicDetail = (props) => {
  const {
    detailData,
    openWorkOrder,
  } = props;

  const checkAdditionalInfo = detailData && (detailData.at_start_mro || detailData.at_review_mro || detailData.at_done_mro || detailData.enforce_time || detailData.qr_scan_at_start || detailData.qr_scan_at_done || detailData.nfc_scan_at_start || detailData.nfc_scan_at_done || detailData.is_generate_wo )

  return (
    <>
      {detailData && (
        <div>
          <Row className="p-0 schedule-overview">
            <Col sm="12" md={checkAdditionalInfo ? "4" : "6"} xs="12" lg={checkAdditionalInfo ? "4" : "6"} className="mb-2 pr-04">
              <Card className="h-100">
                <p className="ml-3 mb-1 mt-2 font-weight-600 text-pale-sky font-size-13">SCHEDULE INFORMATION</p>
                <hr className="mb-0 mt-0 mr-2 ml-2" />
                <CardBody className="p-0">
                  <div className="mt-1 pl-0">
                    <ScheduleInfo detailData={detailData} />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col sm="12" md={checkAdditionalInfo ? "4" : "6"} xs="12" lg={checkAdditionalInfo ? "4" : "6"} className={checkAdditionalInfo ? "mb-2 pl-04 pr-04" : "mb-2 pl-04"}>
              <Card className="h-100">
                <p className="ml-3 mb-1 mt-2 font-weight-600 text-pale-sky font-size-13">WORK INFORMATION</p>
                <hr className="mb-0 mt-0 mr-2 ml-2" />
                <CardBody className="p-0">
                  <div className="mt-1 pl-0">
                    <OrderInfo detailData={detailData} openWorkOrder={openWorkOrder} />
                  </div>
                </CardBody>
              </Card>
            </Col>
           {checkAdditionalInfo && ( <Col sm="12" md="4" xs="12" lg="4" className="mb-2 pl-04">
              <Card className="h-100">
                <p className="ml-3 mb-1 mt-2 font-weight-600 text-pale-sky font-size-13">ADDITIONAL INFORMATION</p>
                <hr className="mb-0 mt-0 mr-2 ml-2" />
                <CardBody className="p-0">
                  <div className="mt-1 pl-0">
                    <AdditionalInfo detailData={detailData} />
                  </div>
                </CardBody>
              </Card>
            </Col>
            )}
          </Row>
        </div>
      )}
    </>
  );
};

BasicDetail.propTypes = {
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
export default BasicDetail;
