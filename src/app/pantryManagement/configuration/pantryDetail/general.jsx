/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
import {
  Col,
  Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';

import DetailViewFormat from '@shared/detailViewFormat';
import {
  getDefaultNoValue, extractTextObject, getArrayToCommaValues,
} from '../../../util/appUtils';
import { getSpaceName } from '../../../assets/equipmentService';

const appModels = require('../../../util/appModels').default;

const General = (props) => {
  const {
    detail, editId,
  } = props;
  const dispatch = useDispatch();
  const [locationValue, setLocationValue] = useState(false);

  const detailData = detail && (detail.data && detail.data.length > 0) ? detail.data[0] : '';
  const {
    spaceName,
  } = useSelector((state) => state.equipment);

  useEffect(() => {
    if (detailData && detailData !== '') {
      const locationId = detailData.spaces_ids;
      if (locationId && locationId.length > 0) {
        dispatch(getSpaceName(appModels.SPACE, locationId));
      } else {
        setLocationValue([]);
      }
    }
  }, [editId, detail]);

  useEffect(() => {
    const locationId = detailData.spaces_ids;
    if (!editId && locationId && locationId.length > 0 && spaceName && spaceName.data && spaceName.data.length > 0) {
      setLocationValue(spaceName.data);
    } else {
      setLocationValue([]);
    }
  }, [spaceName]);

  return (
    <>
      {detailData && (
      <div>
        <Row className="mb-4 ml-1 mr-1 mt-3">
          <Col sm="12" md="12" xs="12" lg="6">
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-400">Maintenance Team</span>
            </Row>
            <Row className="m-0">
              <span className="m-0 p-0 mt-2 font-weight-800 font-tiny text-capital">{getDefaultNoValue(extractTextObject(detailData.maintenance_team_id))}</span>
            </Row>
            <hr className="mt-2" />
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-400">Working Time</span>
            </Row>
            <Row className="m-0">
              <span className="m-0 p-0 mt-2 font-weight-800 font-tiny text-capital">{getDefaultNoValue(extractTextObject(detailData.resource_calendar_id))}</span>
            </Row>
            <hr className="mt-2" />
          </Col>
          <Col sm="12" md="12" xs="12" lg="6">
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-400">Spaces</span>
            </Row>
            <Row className="m-0">
              <span className="m-0 p-0 mt-2 font-weight-800 font-tiny text-capital">
                {' '}
                {getDefaultNoValue(locationValue && getArrayToCommaValues(locationValue, 'path_name'))}
              </span>
            </Row>
            <hr className="mt-2" />
          </Col>
        </Row>
      </div>
      )}
      <DetailViewFormat detailResponse={detail} />
      {!editId && detail && !detail.loading
        ? <DetailViewFormat detailResponse={spaceName} />
        : ''}
    </>
  );
};

General.propTypes = {
  detail: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
};
export default General;
