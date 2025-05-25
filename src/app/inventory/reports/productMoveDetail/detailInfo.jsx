/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Card,
  CardBody,
  Col,
  Row,
} from 'reactstrap';
import { useSelector } from 'react-redux';
import * as PropTypes from 'prop-types';

import DetailViewFormat from '@shared/detailViewFormat';
import {
  getDefaultNoValue,
  numToFloat,
  extractTextObject, getCompanyTimezoneDate,
} from '../../../util/appUtils';
import customData from '../data/customData.json';

const DetailInfo = (props) => {
  const {
    detail,
  } = props;

  const { userInfo } = useSelector((state) => state.user);

  const detailData = detail && (detail.data && detail.data.length > 0) ? detail.data[0] : '';

  return (
    <Card className="border-0">
      {detailData && (
      <CardBody>
        <Row>
          <Col sm="12" md="12" xs="12" lg="12" className="text-right">
            {customData && customData.pmStateTypes.map((st) => (
              <span key={st.value} className={detailData.state === st.value ? 'text-info mr-3 font-weight-800' : 'mr-3 tab_nav_link'}>{st.label}</span>
            ))}
          </Col>
        </Row>
        <hr />
        <Row className="ml-1 mr-1 mt-3">
          <Col sm="12" md="12" xs="12" lg="6">
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-roman-silver">Date</span>
            </Row>
            <Row className="m-0">
              <span className="m-1 p-1 font-weight-800 text-capital">{getDefaultNoValue(getCompanyTimezoneDate(detailData.date, userInfo, 'datetime'))}</span>
            </Row>
            <hr className="mt-0" />
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-roman-silver">Reference</span>
            </Row>
            <Row className="m-0">
              <span className="m-1 p-1 font-weight-800 text-capital">{getDefaultNoValue(detailData.reference)}</span>
            </Row>
            <hr className="mt-0" />
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-roman-silver">Product</span>
            </Row>
            <Row className="m-0">
              <span className="m-1 p-1 font-weight-800 text-capital">{getDefaultNoValue(extractTextObject(detailData.product_id))}</span>
            </Row>
            <hr className="mt-0" />
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-roman-silver">From</span>
            </Row>
            <Row className="m-0">
              <span className="m-1 p-1 font-weight-800 text-capital">{getDefaultNoValue(extractTextObject(detailData.location_id))}</span>
            </Row>
            <hr className="mt-0" />
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-roman-silver">To</span>
            </Row>
            <Row className="m-0">
              <span className="m-1 p-1 font-weight-800 text-capital">{getDefaultNoValue(extractTextObject(detailData.location__dest_id))}</span>
            </Row>
            <hr className="mt-0" />
          </Col>
          <Col sm="12" md="12" xs="12" lg="6">
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-roman-silver">Quantity Done</span>
            </Row>
            <Row className="m-0">
              <span className="m-1 p-1 font-weight-800">{numToFloat(detailData.qty_done)}</span>
            </Row>
            <hr className="mt-0" />
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-roman-silver">Quantity Reserved</span>
            </Row>
            <Row className="m-0">
              <span className="m-1 p-1 font-weight-800">{numToFloat(detailData.product_qty)}</span>
            </Row>
            <hr className="mt-0" />
          </Col>
        </Row>
      </CardBody>
      )}
      <DetailViewFormat detailResponse={detail} />
    </Card>
  );
};

DetailInfo.propTypes = {
  detail: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
};
export default DetailInfo;
