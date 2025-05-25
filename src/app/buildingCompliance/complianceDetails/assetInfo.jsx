/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Row, Col,
} from 'reactstrap';
import * as PropTypes from 'prop-types';

import {
  getDefaultNoValue, getArrayToValues,
  extractNameObject, getArrayToCommaValues, getPathName,
} from '../../util/appUtils';

const AssetInfo = (props) => {
  const {
    detailData,
  } = props;

  let appliesToLocation = 'Site';
  let appliesToLocationValue = getDefaultNoValue(detailData.company_ids && getArrayToValues(detailData.company_ids, 'name'));
  if (detailData.applies_to === 'Location') {
    appliesToLocation = 'Location';
    appliesToLocationValue = getDefaultNoValue(detailData.location_ids && getPathName(detailData.location_ids, 'path_name'));
  } else if (detailData.applies_to === 'Asset') {
    appliesToLocation = 'Asset';
    appliesToLocationValue = getDefaultNoValue(detailData.asset_ids && getPathName(detailData.asset_ids, 'name'));
  }

  return (
    <>
      {detailData && (
        <>
          <Row className="m-0">
            <span className="m-0 p-0 light-text">
              Type
            </span>
          </Row>
          <Row className="m-0">
            <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
              <span className="m-0 p-0 font-weight-700 text-capital">
                {' '}
                {getDefaultNoValue(detailData.type)}
              </span>
            </Col>
          </Row>
          <Row className="m-0">
            <span className="m-0 p-0 light-text">
              License Number
            </span>
          </Row>
          <p className="mt-2" />
          <Row className="m-0">
            <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
              <span className="m-0 p-0 font-weight-700 text-capital">
                {' '}
                {getDefaultNoValue(detailData.license_number)}
              </span>
            </Col>
          </Row>
          <Row className="m-0">
            <span className="m-0 p-0 light-text">
              Applies To
            </span>
          </Row>
          <Row className="m-0">
            <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
              <span className="m-0 p-0 font-weight-700 text-capital">
                {' '}
                {getDefaultNoValue(detailData.applies_to)}
              </span>
            </Col>
          </Row>
          <p className="mt-2" />
          <Row className="m-0">
            <span className="m-0 p-0 light-text">
              {appliesToLocation}
            </span>
          </Row>
          <Row className="m-0">
            <Col sm="12" md="12" xs="12" lg="12" className="p-0 m-0">
              <span className="m-0 p-0 font-weight-700 text-capital">
                {' '}
                {appliesToLocationValue}
              </span>
            </Col>
          </Row>
          <p className="mt-2" />
          <Row className="m-0">
            <span className="m-0 p-0 light-text">
              Responsible
            </span>
          </Row>
          <Row className="m-0">
            <Col sm="12" md="12" xs="12" lg="12" className="p-0 m-0">
              <span className="m-0 p-0 font-weight-700 text-capital">
                {' '}
                {getDefaultNoValue(extractNameObject(detailData.responsible_id, 'name'))}
              </span>
            </Col>
          </Row>
          <p className="mt-2" />
        </>
      )}
    </>
  );
};

AssetInfo.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
};
export default AssetInfo;
