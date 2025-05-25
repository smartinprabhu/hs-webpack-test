/* eslint-disable no-undef */
/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Row,
  Col,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import DetailViewFormat from '@shared/detailViewFormat';

import {
  getDefaultNoValue,
  extractTextObject,
} from '../../../util/appUtils';

const GeneralInfo = (props) => {
  const {
    detailData, editId,
  } = props;

  const {
    spaceName,
  } = useSelector((state) => state.equipment);


  return (
    detailData && (
    <>
      <Row>
        <Col sm="12" md="6" xs="12" lg="6">
          <Row className="m-0">
            <span className="m-0 p-0 light-text">Maintenance Team</span>
          </Row>
          <Row className="m-0">
            <span className="m-0 p-0 font-weight-700 text-capital">{getDefaultNoValue(extractTextObject(detailData.maintenance_team_id))}</span>
          </Row>
        </Col>
      </Row>
      <p className="mt-2" />
      <Row>
        <Col sm="12" md="6" xs="12" lg="6">
          <Row className="m-0">
            <span className="m-0 p-0 light-text">Working Time</span>
          </Row>
          <Row className="m-0">
            <span className="m-0 p-0 font-weight-700">{getDefaultNoValue(extractTextObject(detailData.resource_calendar_id))}</span>
          </Row>
        </Col>
      </Row>
      <p className="mt-2" />
      <DetailViewFormat detailResponse={detailData} />
      {!editId && detailData && !detailData.loading
        ? <DetailViewFormat detailResponse={spaceName} />
        : ''}
    </>
    ));
};

GeneralInfo.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,

  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
};
export default GeneralInfo;
