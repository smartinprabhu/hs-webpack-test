/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Col,
  Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';

import DetailViewFormat from '@shared/detailViewFormat';
import {
  getDefaultNoValue,
  extractTextObject,
} from '../../../../util/appUtils';
import { getPriorityLabel } from '../../utils/utils';

const AdditionalInfo = (props) => {
  const {
    detail,
  } = props;

  const detailData = detail && (detail.data && detail.data.length > 0) ? detail.data[0] : '';

  return (
    <Row>
      {detailData && (
        <Col sm="12" md="12" lg="12" xs="12">
          <Row className="ml-1 mr-1 mt-3">
            <Col sm="12" md="12" xs="12" lg="6">
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-700 text-roman-silver">Company</span>
              </Row>
              <Row className="m-0">
                <span className="m-1 p-1 font-weight-800">{getDefaultNoValue(extractTextObject(detailData.company_id))}</span>
              </Row>
              <hr className="mt-0" />
            </Col>
            <Col sm="12" md="12" xs="12" lg="6">
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-700 text-roman-silver">Priority</span>
              </Row>
              <Row className="m-0">
                <span className="m-1 p-1 font-weight-800">{getDefaultNoValue(getPriorityLabel(detailData.priority))}</span>
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

AdditionalInfo.propTypes = {
  detail: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
};
export default AdditionalInfo;
