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
} from '../../../../util/appUtils';

const GeneralInfo = (props) => {
  const {
    detailData,
  } = props;

  const { userInfo } = useSelector((state) => state.user);

  return (
    <>
      {detailData && (
      <>
        <Row className="m-0">
          <Col sm="12" md="12" xs="12" lg="12">
            <Row className="m-0">
              <span className="m-0 p-0 light-text">Type</span>
            </Row>
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(detailData.recipient)}</span>
            </Row>
            <p className="mt-2" />
            {detailData.department_id && detailData.department_id.length && (
            <>
              <Row className="m-0">
                <span className="m-0 p-0 light-text">Department</span>
              </Row>
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(extractNameObject(detailData.department_id, 'display_name'))}</span>
              </Row>
              <p className="mt-2" />
            </>
            )}
            <Row className="m-0">
              <span className="m-0 p-0 light-text">Name</span>
            </Row>
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(extractNameObject(detailData.employee_id, 'name'))}</span>
            </Row>
            <Row className="m-0">
              <span className="m-0 p-0 light-text">Id</span>
            </Row>
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(extractNameObject(detailData.employee_id, 'employee_id_seq'))}</span>
            </Row><Row className="m-0">
              <span className="m-0 p-0 light-text">Email</span>
            </Row>
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(extractNameObject(detailData.employee_id, 'work_email'))}</span>
            </Row>
            <p className="mt-2" />
            <Row className="m-0">
              <span className="m-0 p-0 light-text">Parcel Dimensions</span>
            </Row>
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(detailData.parcel_dimensions)}</span>
            </Row>
            <p className="mt-2" />
            <Row className="m-0">
              <span className="m-0 p-0 light-text">Shelf</span>
            </Row>
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(detailData.shelf)}</span>
            </Row>
            <p className="mt-2" />
            <Row className="m-0">
              <span className="m-0 p-0 light-text">Registered On</span>
            </Row>
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(getCompanyTimezoneDate(detailData.sent_on, userInfo, 'datetime'))}</span>
            </Row>
            <p className="mt-2" />
            <Row className="m-0">
              <span className="m-0 p-0 light-text">Registered By</span>
            </Row>
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(extractNameObject(detailData.sent_by, 'name'))}</span>
            </Row>
            <p className="mt-2" />
            <Row className="m-0">
              <span className="m-0 p-0 light-text">Notes</span>
            </Row>
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(detailData.notes)}</span>
            </Row>
            <p className="mt-2" />
          </Col>
        </Row>
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
