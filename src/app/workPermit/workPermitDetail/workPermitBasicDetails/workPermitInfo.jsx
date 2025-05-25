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
  numToFloatView,
} from '../../../util/appUtils';

const WorkPermitInfo = (props) => {
  const {
    detailData,
  } = props;

  const { userInfo } = useSelector((state) => state.user);
  const { workPermitConfig } = useSelector((state) => state.workpermit);
  const wpConfig = workPermitConfig && workPermitConfig.data && workPermitConfig.data.length ? workPermitConfig.data[0] : false;

  return (
    detailData && (
      <>
        <Row className="m-0">
          <Col sm="12" md="12" xs="12" lg="6" className="p-0 m-0">
            <span className="m-0 p-0 light-text">
              Type of Work
            </span>
          </Col>
          <Col sm="12" md="12" xs="12" lg="6" className="p-0 m-0">
            <span className="m-0 p-0 light-text">
              Type of Request
            </span>
          </Col>
        </Row>
        <Row className="m-0">
          <Col sm="12" md="12" xs="12" lg="6" className="p-0 m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">
              {' '}
              {getDefaultNoValue(extractNameObject(detailData.type_work_id, 'name'))}
            </span>
          </Col>
          <Col sm="12" md="12" xs="12" lg="6" className="p-0 m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">
              {' '}
              {getDefaultNoValue(detailData.type_of_request)}
            </span>
          </Col>
        </Row>
        <p className="mt-2" />
        <Row className="m-0">
          <Col sm="12" md="12" xs="12" lg="6" className="p-0 m-0">
            <span className="m-0 p-0 light-text">
              Nature of Work
            </span>
          </Col>
          <Col sm="12" md="12" xs="12" lg="6" className="p-0 m-0">
            <span className="m-0 p-0 light-text">
              Work Location
            </span>
          </Col>
        </Row>
        <Row className="m-0">
          <Col sm="12" md="12" xs="12" lg="6" className="p-0 m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">
              {' '}
              {getDefaultNoValue(extractNameObject(detailData.nature_work_id, 'name'))}
            </span>
          </Col>
          <Col sm="12" md="12" xs="12" lg="6" className="p-0 m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">
              {' '}
              {getDefaultNoValue(detailData.work_location)}
            </span>
          </Col>
        </Row>
        <p className="mt-2" />
        <Row className="m-0">
          <Col sm="12" md="12" xs="12" lg="6" className="p-0 m-0">
            <span className="m-0 p-0 light-text">
              Planned Start Time
            </span>
          </Col>
          <Col sm="12" md="12" xs="12" lg="6" className="p-0 m-0">
            <span className="m-0 p-0 light-text">
              Planned End Time
            </span>
          </Col>
        </Row>
        <Row className="m-0">
          <Col sm="12" md="12" xs="12" lg="6" className="p-0 m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">
              {' '}
              {getDefaultNoValue(getCompanyTimezoneDate(detailData.planned_start_time, userInfo, 'datetime'))}
            </span>
          </Col>
          <Col sm="12" md="12" xs="12" lg="6" className="p-0 m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">
              {' '}
              {getDefaultNoValue(getCompanyTimezoneDate(detailData.planned_end_time, userInfo, 'datetime'))}
            </span>
          </Col>
        </Row>
        <p className="mt-2" />
        <Row className="m-0">
          <span className="m-0 p-0 light-text">
            Duration (Hrs)
          </span>
        </Row>
        <Row className="m-0">
          <Col sm="12" md="12" xs="12" lg="12" className="p-0 m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">
              {' '}
              {numToFloatView(detailData.duration)}
            </span>
          </Col>
        </Row>
        <p className="mt-2" />
        {wpConfig && wpConfig.is_prepared_required && (
          <>
            <Row className="m-0">
              <span className="m-0 p-0 light-text">
                Preparedness Checklist
              </span>
            </Row>
            <Row className="m-0">
              <Col sm="12" md="12" xs="12" lg="12" className="p-0 m-0">
                <span className="m-0 p-0 font-weight-700 text-capital">
                  {' '}
                  {getDefaultNoValue(extractNameObject(detailData.preparedness_checklist_id, 'name'))}
                </span>
              </Col>
            </Row>
            <p className="mt-2" />
          </>
        )}
        <Row className="m-0">
          <span className="m-0 p-0 light-text">
            Maintenance Checklist
          </span>
        </Row>
        <Row className="m-0">
          <Col sm="12" md="12" xs="12" lg="12" className="p-0 m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">
              {' '}
              {getDefaultNoValue(extractNameObject(detailData.task_id, 'name'))}
            </span>
          </Col>
        </Row>
        <p className="mt-2" />
        <Row className="m-0">
          <span className="m-0 p-0 light-text">
            PO Reference
          </span>
        </Row>
        <Row className="m-0">
          <Col sm="12" md="12" xs="12" lg="12" className="p-0 m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">
              {' '}
              {getDefaultNoValue(detailData.po_reference)}
            </span>
          </Col>
        </Row>
        <p className="mt-2" />
      </>
    )
  );
};

WorkPermitInfo.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
};
export default WorkPermitInfo;
