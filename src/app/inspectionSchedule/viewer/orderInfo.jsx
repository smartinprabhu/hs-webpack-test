/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Row,
  Col,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { getWorkOrderStateLabel } from '../../workorders/utils/utils';
import {
  getDefaultNoValue,
  getCompanyTimezoneDate,
} from '../../util/appUtils';

const OrderInfo = (props) => {
  const {
    detailData,
    openWorkOrder,
  } = props;

  const { userInfo } = useSelector((state) => state.user);

  const {
    inspectionOrderInfo,
  } = useSelector((state) => state.inspection);

  const orderData = inspectionOrderInfo && inspectionOrderInfo.data && inspectionOrderInfo.data.length ? inspectionOrderInfo.data[0] : false;

  return (
    <>
      {detailData && (
      <Row className="m-0">
        <Col sm="12" md="6" xs="12" lg="6">
          <Row className="m-0">
            <span className="m-0 p-0 light-text">Order</span>
          </Row>
          <Row className={`${orderData && orderData.id ? 'cursor-pointer text-info' : ''} m-0`} onClick={openWorkOrder}>
            <span className="m-0 p-0 font-weight-700 text-capital">
              {getDefaultNoValue(orderData && orderData.name ? orderData.name : '')}
            </span>
          </Row>
          <p className="mt-2" />
          <Row className="m-0">
            <span className="m-0 p-0 light-text">Order Status</span>
          </Row>
          <Row className="m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">
              {getDefaultNoValue(getWorkOrderStateLabel(orderData && orderData.state ? orderData.state : ''))}
            </span>
          </Row>
          <p className="mt-2" />
          <Row className="m-0">
            <span className="m-0 p-0 light-text">Done By</span>
          </Row>
          <Row className="m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">
              {getDefaultNoValue(detailData.employee_name)}
            </span>
          </Row>
          <p className="mt-2" />
        </Col>
        <Col sm="12" md="6" xs="12" lg="6">
          <Row className="m-0">
            <span className="m-0 p-0 light-text">Actual Start Time</span>
          </Row>
          <Row className="m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">
              {getDefaultNoValue(detailData.date_start_execution ? getCompanyTimezoneDate(detailData.date_start_execution, userInfo, 'datetime') : '')}
            </span>
          </Row>
          <p className="mt-2" />
          <Row className="m-0">
            <span className="m-0 p-0 light-text">Actual End Time</span>
          </Row>
          <Row className="m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">
              {getDefaultNoValue(detailData.date_execution ? getCompanyTimezoneDate(detailData.date_execution, userInfo, 'datetime') : '')}
            </span>
          </Row>
          <p className="mt-2" />
        </Col>
      </Row>
      )}
    </>
  );
};

OrderInfo.propTypes = {
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
export default OrderInfo;
