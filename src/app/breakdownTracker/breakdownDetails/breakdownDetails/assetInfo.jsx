/* eslint-disable react/no-danger */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable import/no-unresolved */
import * as PropTypes from 'prop-types';
import React from 'react';
import { Row } from 'reactstrap';

import {
  extractNameObject, getDefaultNoValue,
} from '../../../util/appUtils';

const assetInfo = (props) => {
  const {
    detailData,
  } = props;

  return (
    <>
      {detailData && (
        <>
          <Row className="m-0">
            <span className="m-0 p-0 light-text">
              Company
            </span>
          </Row>
          <Row className="m-0">
            {getDefaultNoValue(extractNameObject(detailData.company_id, 'name'))}
          </Row>
          <p className="mt-2" />
          <Row className="m-0">
            <span className="m-0 p-0 light-text">
              Type
            </span>
          </Row>
          <Row className="m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(detailData.type)}</span>
          </Row>
          <p className="mt-2" />
          {detailData.type === 'Space' && (
            <>
              <Row className="m-0">
                <span className="m-0 p-0 light-text">
                  Space
                </span>
              </Row>
              <Row className="m-0">
                {getDefaultNoValue(extractNameObject(detailData.space_id, 'path_name'))}
              </Row>
              <p className="mt-2" />
            </>
          )}
          {detailData.type === 'Equipment' && (
            <>
              <Row className="m-0">
                <span className="m-0 p-0 light-text">
                  Asset
                </span>
              </Row>
              <Row className="m-0">
                {getDefaultNoValue(extractNameObject(detailData.equipment_id, 'name'))}
              </Row>
              <p className="mt-2" />
            </>
          )}
          {detailData.type === 'Equipment' && (
            <>
              <Row className="m-0">
                <span className="m-0 p-0 light-text">
                  Asset Location
                </span>
              </Row>
              <Row className="m-0">
                {getDefaultNoValue(detailData.equipment_id && detailData.equipment_id.location_id && detailData.equipment_id.location_id.path_name
                  ? extractNameObject(detailData.equipment_id.location_id, 'path_name') : '')}
              </Row>
              <p className="mt-2" />
              <Row className="m-0">
                <span className="m-0 p-0 light-text">
                  AMC Status
                </span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(detailData.amc_status)}</span>
              </Row>
              <p className="mt-2" />
            </>
          )}
        </>
      )}
    </>
  );
};

assetInfo.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
};

export default assetInfo;
