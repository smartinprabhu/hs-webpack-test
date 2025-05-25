/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Row, Col,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import {
  getDefaultNoValue,
  extractNameObject,
  getCompanyTimezoneDate,
} from '../../../util/appUtils';

const BasicInfo = (props) => {
  const {
    detailData,
  } = props;
  const { userInfo } = useSelector((state) => state.user);

  return (detailData && (
    <>
      <Row>
        <Col sm="12" md="3" xs="12" lg="3">
          <Row className="m-0">
            <span className="m-0 p-0 light-text">Category</span>
          </Row>
          <Row className="m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(extractNameObject(detailData.category_id, 'name'))}</span>
          </Row>
        </Col>
        <Col sm="12" md="3" xs="12" lg="3">
          <Row className="m-0">
            <span className="m-0 p-0 light-text">Priority</span>
          </Row>
          <Row className="m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(extractNameObject(detailData.priority_id, 'name'))}</span>
          </Row>
        </Col>
        <Col sm="12" md="3" xs="12" lg="3">
          <Row className="m-0">
            <span className="m-0 p-0 light-text">Assigned To</span>
          </Row>
          <Row className="m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(extractNameObject(detailData.assigned_id, 'name'))}</span>
          </Row>
        </Col>
        <Col sm="12" md="3" xs="12" lg="3">
          <Row className="m-0">
            <span className="m-0 p-0 light-text">Maintenance Team</span>
          </Row>
          <Row className="m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(extractNameObject(detailData.maintenance_team_id, 'name'))}</span>
          </Row>
        </Col>
      </Row>
      <p className="mt-2" />
      <Row>
        <Col sm="12" md="3" xs="12" lg="3">
          <Row className="m-0">
            <span className="m-0 p-0 light-text">Company</span>
          </Row>
          <Row className="m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(extractNameObject(detailData.company_id, 'name'))}</span>
          </Row>
        </Col>
        <Col sm="12" md="3" xs="12" lg="3">
          <Row className="m-0">
            <span className="m-0 p-0 light-text">Target Closure Date</span>
          </Row>
          <Row className="m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(getCompanyTimezoneDate(detailData.target_closure_date, userInfo, 'date'))}</span>
          </Row>
        </Col>
        <Col sm="12" md="3" xs="12" lg="3">
          <Row className="m-0">
            <span className="m-0 p-0 light-text">Type of Activity / Hazard</span>
          </Row>
          <Row className="m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(extractNameObject(detailData.incident_type_id, 'name'))}</span>
          </Row>
        </Col>
        <Col sm="12" md="3" xs="12" lg="3">
          <Row className="m-0">
            <span className="m-0 p-0 light-text">Report On</span>
          </Row>
          <Row className="m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(getCompanyTimezoneDate(detailData.incident_on, userInfo, 'datetime'))}</span>
          </Row>
        </Col>
      </Row>
      <p className="mt-2" />
      <Row>
        <Col sm="12" md="9" xs="9" lg="9">
          <Row className="m-0">
            <span className="m-0 p-0 light-text">Description</span>
          </Row>
          <Row className="m-0 small-form-content hidden-scrollbar">
            <span className="m-0 p-0 font-weight-700 text-capital">
              {getDefaultNoValue(detailData.description)}
            </span>
          </Row>
        </Col>
      </Row>
      <p className="mt-2" />
      { /* (detailData.state === 'Resolved' || detailData.state === 'Validated' || detailData.state === 'Signed off') && (
        <>
          <Row>
            <Col sm="12" md="12" xs="12" lg="12">
              <Row className="m-0">
                <span className="m-0 p-0 light-text">Resolution</span>
              </Row>
              <Row className="m-0 small-form-content hidden-scrollbar">
                <span className="m-0 p-0 font-weight-700 text-capital">
                  {getDefaultNoValue(detailData.resolution)}
                </span>
              </Row>
            </Col>
          </Row>
          <p className="mt-2" />
        </>
      ) */ }
    </>
  )
  );
};

BasicInfo.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
};
export default BasicInfo;
