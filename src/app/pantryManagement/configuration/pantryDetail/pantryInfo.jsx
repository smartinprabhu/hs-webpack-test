/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Row,
  Col,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import {
  getDefaultNoValue,
  getCompanyTimezoneDate,
  extractTextObject,
} from '../../../util/appUtils';

const PantryInfo = (props) => {
  const {
    detailData,
  } = props;
  const { userInfo } = useSelector((state) => state.user);

  return (detailData && (
  <>
    <Row>
      <Col sm="12" md="6" xs="12" lg="6">

        <Row className="m-0">
          <span className="m-0 p-0 light-text"> Company</span>
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(extractTextObject(detailData.company_id))}</span>
        </Row>
      </Col>
    </Row>
    <p className="mt-2" />
    <Row>
      <Col sm="12" md="6" xs="12" lg="6">
        <Row className="m-0">
          <span className="m-0 p-0 light-text">Created On</span>
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700">
            {' '}
            {getDefaultNoValue(getCompanyTimezoneDate(detailData.create_date, userInfo, 'datetime'))}
          </span>
        </Row>
      </Col>
    </Row>
    <p className="mt-2" />
  </>
  )
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
