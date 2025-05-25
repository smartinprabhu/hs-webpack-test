/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Col,
  Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import DetailViewFormat from '@shared/detailViewFormat';
import {
  getDefaultNoValue,
  extractTextObject,
  getCompanyTimezoneDate,
} from '../../../util/appUtils';
import { getInvoiceStatusLabel } from '../utils/utils';

const OtherInformation = (props) => {
  const {
    detail,
  } = props;

  const { userInfo } = useSelector((state) => state.user);

  const detailData = detail && (detail.data && detail.data.length > 0) ? detail.data[0] : '';

  return (
    <Row>
      {detailData && (
        <Col sm="12" md="12" lg="12" xs="12">
          <Row className="ml-1 mr-1 mt-3">
            <Col sm="12" md="12" xs="12" lg="6">
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-700 text-roman-silver">Scheduled Date</span>
              </Row>
              <Row className="m-0">
                <span className="m-1 p-1 font-weight-800 text-capital">{getDefaultNoValue(getCompanyTimezoneDate(detailData.date_planned, userInfo, 'datetime'))}</span>
              </Row>
              <hr className="mt-0" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-700 text-roman-silver">Payment Terms</span>
              </Row>
              <Row className="m-0">
                <span className="m-1 p-1 font-weight-800 text-capital">{getDefaultNoValue(extractTextObject(detailData.payment_term_id))}</span>
              </Row>
              <hr className="mt-0" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-700 text-roman-silver">Purchase Representative</span>
              </Row>
              <Row className="m-0">
                <span className="m-1 p-1 font-weight-800 text-capital">{getDefaultNoValue(extractTextObject(detailData.user_id))}</span>
              </Row>
              <hr className="mt-0" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-700 text-roman-silver">Fiscal Position</span>
              </Row>
              <Row className="m-0">
                <span className="m-1 p-1 font-weight-800">{getDefaultNoValue(extractTextObject(detailData.fiscal_position_id))}</span>
              </Row>
              <hr className="mt-0" />
            </Col>
            <Col sm="12" md="12" xs="12" lg="6">
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-700 text-roman-silver">Incoterm</span>
              </Row>
              <Row className="m-0">
                <span className="m-1 p-1 font-weight-800">{getDefaultNoValue(extractTextObject(detailData.incoterm_id))}</span>
              </Row>
              <hr className="mt-0" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-700 text-roman-silver">Approval Date</span>
              </Row>
              <Row className="m-0">
                <span className="m-1 p-1 font-weight-800">{getDefaultNoValue(getCompanyTimezoneDate(detailData.date_approve, userInfo, 'date'))}</span>
              </Row>
              <hr className="mt-0" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-700 text-roman-silver">Billing Status</span>
              </Row>
              <Row className="m-0">
                <span className="m-1 p-1 font-weight-800">{getDefaultNoValue(getInvoiceStatusLabel(detailData.invoice_status))}</span>
              </Row>
              <hr className="mt-0" />
            </Col>
          </Row>
        </Col>
      )}
      <DetailViewFormat detailResponse={detail} />
    </Row>
  );
};

OtherInformation.propTypes = {
  detail: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
};
export default OtherInformation;
