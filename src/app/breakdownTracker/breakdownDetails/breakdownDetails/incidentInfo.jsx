/* eslint-disable react/no-danger */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable import/no-unresolved */
import * as PropTypes from 'prop-types';
import React from 'react';
import { Col, Row } from 'reactstrap';
import { useSelector } from 'react-redux';

import {
  getDefaultNoValue, extractNameObject, getCompanyTimezoneDate, getArrayToValues,
} from '../../../util/appUtils';

const assetInfo = (props) => {
  const {
    detailData,
  } = props;

  const { userInfo } = useSelector((state) => state.user);

  return (
    <>
      {detailData && (
        <>
          { /* <Row className="m-0">
            <span className="m-0 p-0 light-text">
              Description of Breakdown/Failure
            </span>
          </Row>
          <Row className="m-0">
            <span className="m-0 p-0 font-weight-700 small-form-content hidden-scrollbar">
              {getDefaultNoValue(detailData.description_of_breakdown)}
            </span>
          </Row>
      <p className="mt-2" /> */ }
          <Row className="m-0">
            <span className="m-0 p-0 light-text">
              Incident Date
            </span>
          </Row>
          <Row className="m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(getCompanyTimezoneDate(detailData.incident_date, userInfo, 'datetime'))}</span>
          </Row>
          <p className="mt-2" />
          <Row className="m-0">
            <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
              <span className="m-0 p-0 light-text">
                Service Category
              </span>
            </Col>
            <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
              <span className="m-0 p-0 light-text">
                Ciriticality
              </span>
            </Col>
          </Row>
          <Row className="m-0">
            <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
              <span className="m-0 p-0 font-weight-700 text-capital">
                {getDefaultNoValue(extractNameObject(detailData.service_category_id, 'name'))}
              </span>
            </Col>
            <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
              <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(detailData.ciriticality)}</span>
            </Col>
          </Row>
          <p className="mt-2" />
          <Row className="m-0">
            <span className="m-0 p-0 light-text">
              Results in Statutory Non-Compliance?
            </span>
          </Row>
          <Row className="m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(detailData.is_results_in_statutory_non_compliance ? 'Yes' : 'No')}</span>
          </Row>
          <p className="mt-2" />
          <Row className="m-0">
            <span className="m-0 p-0 light-text">
              Breakdown due to Ageing?
            </span>
          </Row>
          <Row className="m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(detailData.is_breakdown_due_to_ageing ? 'Yes' : 'No')}</span>
          </Row>
          <p className="mt-2" />
          <Row className="m-0">
            <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
              <span className="m-0 p-0 light-text">
                Is Service Impacted?
              </span>
            </Col>
            {detailData.is_service_impacted && (
              <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
                <span className="m-0 p-0 light-text">
                  Services Impacted
                </span>
              </Col>
            )}
          </Row>
          <Row className="m-0">
            <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
              <span className="m-0 p-0 font-weight-700 text-capital">
                {getDefaultNoValue(detailData.is_service_impacted ? 'Yes' : 'No')}
              </span>
            </Col>
            <Col sm="12" md="6" xs="12" lg="6" className="p-0 m-0">
              {detailData.is_service_impacted && (

                <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(getArrayToValues(detailData.services_impacted_ids, 'name'))}</span>

              )}
            </Col>
          </Row>
          <p className="mt-2" />
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
