/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Row, Col,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import {
  getDefaultNoValue,
  getCompanyTimezoneDate,
  numToFloatView,
  extractNameObject,
} from '../../../../util/appUtils';

const CommodityInfo = (props) => {
  const {
    detailData,
  } = props;

  const { userInfo } = useSelector((state) => state.user);

  return (
    <>
      {detailData && (
      <>
        <Row className="m-0">
          <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
            <span className="m-0 p-0 light-text">
              Initial Reading
            </span>
          </Col>
          <Col sm="12" md="1" xs="12" lg="1" className="p-0 m-0" />
          <Col sm="12" md="5" xs="12" lg="5" className="p-0 m-0">
            <span
              className="m-0 p-0 light-text"
            >
              Final Reading
            </span>
          </Col>
        </Row>
        <Row className="m-0">
          <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">{numToFloatView(detailData.initial_reading)}</span>
          </Col>
          <Col sm="12" md="1" xs="12" lg="1" className="p-0 m-0" />
          <Col sm="12" md="5" xs="12" lg="5" className="p-0 m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">{numToFloatView(detailData.final_reading)}</span>
          </Col>
        </Row>
        <p className="mt-2" />
        <Row className="m-0">
          <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
            <span className="m-0 p-0 light-text">
              In Date
            </span>
          </Col>
          <Col sm="12" md="1" xs="12" lg="1" className="p-0 m-0" />
          <Col sm="12" md="5" xs="12" lg="5" className="p-0 m-0">
            <span
              className="m-0 p-0 light-text"
            >
              Out Date
            </span>
          </Col>
        </Row>
        <Row className="m-0">
          <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">
              {' '}
              {getDefaultNoValue(getCompanyTimezoneDate(detailData.in_datetime, userInfo, 'datetime'))}
            </span>
          </Col>
          <Col sm="12" md="1" xs="12" lg="1" className="p-0 m-0" />
          <Col sm="12" md="5" xs="12" lg="5" className="p-0 m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">
              {' '}
              {getDefaultNoValue(getCompanyTimezoneDate(detailData.out_datetime, userInfo, 'datetime'))}
            </span>
          </Col>
        </Row>
        <p className="mt-2" />
        <Row className="m-0">
          <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
            <span className="m-0 p-0 light-text">
              Difference
            </span>
          </Col>
          <Col sm="12" md="1" xs="12" lg="1" className="p-0 m-0" />
          <Col sm="12" md="5" xs="12" lg="5" className="p-0 m-0">
            {detailData.is_enable_amount
              ? (
                <span
                  className="m-0 p-0 light-text"
                >
                  Amount
                </span>
              )
              : ''}
          </Col>
        </Row>
        <Row className="m-0">
          <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">
              {' '}
              {numToFloatView(detailData.difference)}
            </span>
          </Col>
          <Col sm="12" md="1" xs="12" lg="1" className="p-0 m-0" />
          <Col sm="12" md="5" xs="12" lg="5" className="p-0 m-0">
            {detailData.is_enable_amount
              ? (
                <span className="m-0 p-0 font-weight-700 text-capital">
                  {' '}
                  {numToFloatView(detailData.amount)}
                </span>
              ) : ''}
          </Col>
        </Row>
        <p className="mt-2" />
        <Row className="m-0">
          <span className="m-0 p-0 light-text">
            Purchase Order
          </span>
        </Row>
        <Row className="m-0">
          <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">
              {' '}
              {getDefaultNoValue(extractNameObject(detailData.purchase_order, 'name'))}
            </span>
          </Col>
        </Row>
        <p className="mt-2" />
        <Row className="m-0">
          <span className="m-0 p-0 light-text">
            Remarks
          </span>
        </Row>
        <Row className="m-0">
          <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">
              {' '}
              {getDefaultNoValue(detailData.remark)}
            </span>
          </Col>
        </Row>
      </>
      )}
    </>
  );
};

CommodityInfo.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
};
export default CommodityInfo;
