/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Row, Col
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import {
  getDefaultNoValue,
  getCompanyTimezoneDate, extractNameObject,
} from '../../util/appUtils';

const PantryInfo = (props) => {
  const {
    detailData,
  } = props;

  const { userInfo } = useSelector((state) => state.user);

  return (
    <>
      {detailData && (
        <>
          <Row className="m-0">
            <Col  sm="12" md="6" xs="12" lg="6">
              <Row className="m-0 ">
                <span
                  className="m-0 p-0 light-text"
                  aria-hidden
                >
                  Pantry Name
                </span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(extractNameObject(detailData.data[0].pantry_id, 'name'))}</span>
              </Row>
              <p className="mt-2" />
            </Col>
          </Row>
          <Row className="m-0">
            <Col sm="12" md="6" xs="12" lg="6">
              <Row className="m-0">
                <span
                  className="m-0 p-0 light-text"
                  aria-hidden
                >
                  Ordered On
                </span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(getCompanyTimezoneDate(detailData.data[0].ordered_on, userInfo, 'datetime'))}</span>
              </Row>
              <p className="mt-2" />
            </Col>
            <Col sm="12" md="6" xs="12" lg="6">
              <Row className="m-0">
                <span
                  className="m-0 p-0 light-text"
                  aria-hidden
                >
                  Confirmed On
                </span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(getCompanyTimezoneDate(detailData.data[0].confirmed_on, userInfo, 'datetime'))}</span>
              </Row>
              <p className="mt-2" />
            </Col>
          </Row>
          <Row className="m-0">
            <Col sm="12" md="6" xs="12" lg="6">
              <Row className="m-0">
                <span
                  className="m-0 p-0 light-text"
                  aria-hidden
                >
                  Delivered On
                </span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(getCompanyTimezoneDate(detailData.data[0].delivered_on, userInfo, 'datetime'))}</span>
              </Row>
              <p className="mt-2" />
            </Col>
            <Col sm="12" md="6" xs="12" lg="6">
              <Row className="m-0">
                <span
                  className="m-0 p-0 light-text"
                  aria-hidden
                >
                  Cancelled On
                </span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(getCompanyTimezoneDate(detailData.data[0].cancelled_on, userInfo, 'datetime'))}</span>
              </Row>
              <p className="mt-2" />
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

PantryInfo.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
};
export default PantryInfo;
