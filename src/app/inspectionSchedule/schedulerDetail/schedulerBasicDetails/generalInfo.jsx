/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';

import {
  getDefaultNoValue,
  extractNameObject,
} from '../../../util/appUtils';

const GeneralInfo = (props) => {
  const {
    detailData,
  } = props;

  return (
    <>
      {detailData && (
      <>

        <Row className="m-0">
          <span className="m-0 p-0 light-text">Type</span>
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(detailData.category_type)}</span>
        </Row>
        <p className="mt-2" />
        {detailData.category_type === 'Equipment'
          ? (
            <>
              <Row className="m-0">
                <span className="m-0 p-0 light-text">Equipment</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(extractNameObject(detailData.equipment_id, 'name'))}</span>
              </Row>
              <p className="mt-2" />
            </>
          )
          : (
            <>
              <Row className="m-0">
                <span className="m-0 p-0 light-text">Space</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(extractNameObject(detailData.space_id, 'path_name'))}</span>
              </Row>
              <p className="mt-2" />
            </>
          )}
        <Row className="m-0">
          <span className="m-0 p-0 light-text">Asset Number</span>
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(detailData.asset_number)}</span>
        </Row>
        <p className="mt-2" />
        <Row className="m-0">
          <span className="m-0 p-0 light-text">Company</span>
        </Row>
        <Row className="m-0">
          <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(extractNameObject(detailData.company_id, 'name'))}</span>
        </Row>
        <p className="mt-2" />
      </>
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
