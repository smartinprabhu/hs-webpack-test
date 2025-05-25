/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Row,
  Col,
} from 'reactstrap';
import * as PropTypes from 'prop-types';

import {
  getDefaultNoValue,
  extractNameObject,
} from '../../util/appUtils';
import { getCustomStatusName } from '../../workPermit/utils/utils';

const GeneralInfo = (props) => {
  const {
    detailData,
    wpConfigData,
  } = props;

  return (
    <>
      {detailData && (
        <Row className="p-0">
          <Col sm="12" md="6" xs="12" lg="6" className="mb-2">
            <Row className="m-0">
              <span className="m-0 p-0 light-text">Title</span>
            </Row>
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-capital word-break-content">{getDefaultNoValue(detailData.name)}</span>
            </Row>
            <p className="mt-2" />
            <Row className="m-0">
              <span className="m-0 p-0 light-text">Type</span>
            </Row>
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-capital word-break-content">{getDefaultNoValue(detailData.type)}</span>
            </Row>
            <p className="mt-2" />
            {detailData.type === 'Equipment'
              ? (
                <>
                  <Row className="m-0">
                    <span className="m-0 p-0 light-text">Equipment</span>
                  </Row>
                  <Row className="m-0">
                    <span className="m-0 p-0 font-weight-700 text-capital word-break-content">{getDefaultNoValue(extractNameObject(detailData.equipment_id, 'name'))}</span>
                  </Row>
                  <p className="mt-2" />
                  <Row className="m-0">
                    <span className="m-0 p-0 light-text">Location</span>
                  </Row>
                  <Row className="m-0">
                    <span className="m-0 p-0 font-weight-700 text-capital word-break-content">
                      {getDefaultNoValue(detailData.equipment_id && detailData.equipment_id.location_id ? extractNameObject(detailData.equipment_id.location_id, 'path_name') : '')}
                    </span>
                  </Row>
                  <p className="mt-2" />
                </>
              )
              : (
                <>
                  <Row className="m-0">
                    <span className="m-0 p-0 light-text">Location</span>
                  </Row>
                  <Row className="m-0">
                    <span className="m-0 p-0 font-weight-700 text-capital word-break-content">{getDefaultNoValue(extractNameObject(detailData.space_id, 'path_name'))}</span>
                  </Row>
                  <p className="mt-2" />
                </>
              )}
          </Col>
          <Col sm="12" md="6" xs="12" lg="6" className="mb-2">
            <Row className="m-0">
              <span className="m-0 p-0 light-text">Reference</span>
            </Row>
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-capital word-break-content">{getDefaultNoValue(detailData.reference)}</span>
            </Row>
            <p className="mt-2" />
            <Row className="m-0">
              <span className="m-0 p-0 light-text">Requestor Name</span>
            </Row>
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-capital word-break-content">{getDefaultNoValue(extractNameObject(detailData.requestor_id, 'name'))}</span>
            </Row>
            <p className="mt-2" />
            <Row className="m-0">
              <span className="m-0 p-0 light-text">Status</span>
            </Row>
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-800 text-info word-break-content">{getDefaultNoValue(getCustomStatusName(detailData.state, wpConfigData))}</span>
            </Row>
            <p className="mt-2" />
          </Col>
          <Col sm="12" md="12" xs="12" lg="12" className="mb-2">
            <Row className="m-0">
              <span className="m-0 p-0 light-text">Job Description</span>
            </Row>
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-capital word-break-content">{getDefaultNoValue(detailData.job_description)}</span>
            </Row>
            <p className="mt-2" />
          </Col>
        </Row>
      )}
    </>
  );
};

GeneralInfo.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
};
export default GeneralInfo;
