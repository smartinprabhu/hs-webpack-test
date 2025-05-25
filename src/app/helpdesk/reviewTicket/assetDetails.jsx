/* eslint-disable max-len */
/* eslint-disable camelcase */
import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Col, Row,
} from 'reactstrap';

import {
  getDefaultNoValue, getFileExtension,
} from '../../util/appUtils';
import {
  getSpaceValue, getTypeLabel,
} from '../utils/utils';

const AssetDetails = (props) => {
  const { formValues } = props;
  const { spaceCascader, uploadPhoto } = useSelector((state) => state.ticket);

  const getlabels = (value) => {
    const data = value;
    return getSpaceValue(data, spaceCascader);
  };

  return (
    <>
      <span className="d-inline-block pb-1 mb-2 mt-2 font-weight-bold">Asset Information</span>
      <Row className="mb-3">
        <Col xs={12} sm={12} md={12} lg={12}>
          <Row className="m-0">
            <span className="text-label-blue m-1 m-1">Type</span>
          </Row>
          <Row className="m-0">
            <span className="m-1 font-weight-500">{getDefaultNoValue(getTypeLabel(formValues.type_category))}</span>
          </Row>
          <hr className="m-1" />
          {getDefaultNoValue(formValues.type_category) !== 'asset'
            ? (
              <>
                <Row className="m-0">
                  <span className="text-label-blue m-1 m-1">Equipment</span>
                </Row>
                <Row className="m-0">
                  <span className="m-1 font-weight-500">{getDefaultNoValue(formValues.equipment_id && formValues.equipment_id.name ? formValues.equipment_id.name : '')}</span>
                </Row>
                <hr className="m-1" />
              </>
            )
            : (
              <>
                <Row className="m-0">
                  <span className="text-label-blue m-1">Space</span>
                </Row>
                <Row className="m-0">
                  <span className="m-1 font-weight-500">{getDefaultNoValue(formValues.asset_id ? getlabels(formValues.asset_id) : '')}</span>
                </Row>
                <hr className="m-1" />
              </>
            )}
          <Row className="m-0">
            <span className="text-label-blue m-1 m-1">Problem Category</span>
          </Row>
          <Row className="m-0">
            <span className="m-1 font-weight-500">{getDefaultNoValue(formValues.category_id && formValues.category_id.cat_display_name ? formValues.category_id.cat_display_name : formValues.category_id.name ? formValues.category_id.name : '')}</span>
          </Row>
          <hr className="m-1" />
          <Row className="m-0">
            <span className="text-label-blue m-1 m-1">Problem Sub-Category</span>
          </Row>
          <Row className="m-0">
            <span className="m-1 font-weight-500">{getDefaultNoValue(formValues.sub_category_id && formValues.sub_category_id.sub_cat_display_name ? formValues.sub_category_id.sub_cat_display_name : formValues.sub_category_id.name ? formValues.sub_category_id.name : '')}</span>
          </Row>
          <hr className="m-1" />
        </Col>
      </Row>
    </>
  );
};

AssetDetails.propTypes = {
  formValues: PropTypes.shape({
    type_category: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    category_id: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number,
    ]),
    description: PropTypes.string,
    sub_category_id: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number,
    ]),
    equipment_id: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
      PropTypes.number,
    ]),
    asset_id: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array,
    ]),
    maintenance_team_id: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
    ]),
  }).isRequired,
};

export default AssetDetails;

