/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Row, Col,
} from 'reactstrap';
import * as PropTypes from 'prop-types';

const Notifications = (props) => {
  const {
    detailData,
  } = props;

  return (
    <>
      {detailData && (
      <>
        <Row className="m-0 text-left">
          <Col sm="12" md="6" xs="12" lg="6" className="pl-0">
            <span className="m-0 p-0 light-text">From Date</span>
          </Col>
          <Col sm="12" md="6" xs="12" lg="6" className="pl-0">
            <span className="m-0 p-0 light-text">To Date</span>
          </Col>
        </Row>
        <Row className="m-0">
          <Col sm="12" md="6" xs="12" lg="6" className="pl-0">
            <span className="m-0 p-0 font-weight-700 text-capital">
              {(detailData.from_date)}
            </span>
          </Col>
          <Col sm="12" md="6" xs="12" lg="6" className="pl-0">
            <span className="m-0 p-0 font-weight-700 text-capital">{(detailData.to_date)}</span>
          </Col>
        </Row>
        <p className="mt-2" />
        <Row className="m-0">
          <Col sm="12" md="6" xs="12" lg="6" className="pl-0">
            <span className="m-0 p-0 light-text">Consumption</span>
          </Col>
          <Col sm="12" md="6" xs="12" lg="6" className="pl-0">
            <span className="m-0 p-0 light-text">Unit Cost</span>
          </Col>
        </Row>
        <Row className="m-0">
          <Col sm="12" md="6" xs="12" lg="6" className="pl-0">
            <span className="m-0 p-0 font-weight-700 text-capital">{(detailData.consumption)}</span>
          </Col>
          <Col sm="12" md="6" xs="12" lg="6" className="pl-0">
            <span className="m-0 p-0 font-weight-700 text-capital">{(detailData.unit_cost)}</span>
          </Col>
        </Row>
        <p className="mt-2" />
        <Row className="m-0">
          <span className="m-0 p-0 light-text">Total Cost</span>
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital">{(detailData.total_cost)}</span>
        </Row>
        <p className="mt-2" />
      </>
      )}
    </>
  );
};

Notifications.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
};
export default Notifications;
