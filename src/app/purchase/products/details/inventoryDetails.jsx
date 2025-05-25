/* eslint-disable import/no-unresolved */
import React, { useEffect } from 'react';
import {
  Col,
  Row,
  Label,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import {
  Checkbox,
} from '@material-ui/core';

import DetailViewFormat from '@shared/detailViewFormat';
import Loader from '@shared/loading';

import {
  getDefaultNoValue,
  numToFloat,
  getAllowedCompanies,
} from '../../../util/appUtils';
import { getLocationRoute } from '../../purchaseService';

const appModels = require('../../../util/appModels').default;

const InventoryDetails = (props) => {
  const {
    detail,
  } = props;
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const {
    locationRouteInfo,
  } = useSelector((state) => state.purchase);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      dispatch(getLocationRoute(companies, appModels.LOCATIONROUTE));
    }
  }, [userInfo]);

  const detailData = detail && (detail.data && detail.data.length > 0) ? detail.data[0] : '';

  return (
    <Row>
      {detailData && (
        <Col sm="12" md="12" lg="12" xs="12">
          <Row className="ml-1 mr-1 mt-3">
            <Col sm="12" md="12" xs="12" lg="12">
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-700 text-roman-silver">Routes</span>
              </Row>
              <Row className="m-0">
                {locationRouteInfo && locationRouteInfo.data && locationRouteInfo.data.length && locationRouteInfo.data.map((route) => (
                  <React.Fragment key={route.id}>
                    <Checkbox
                      name={route.name}
                      className="ml-3"
                      id={route.name}
                      checked={detailData.route_ids && detailData.route_ids.length ? detailData.route_ids.some((data) => data === route.id) : false}
                    />
                    <Label htmlFor={route.name} className="mt-2">
                      <span>{route.name}</span>
                    </Label>
                    <br />
                  </React.Fragment>
                ))}
                {locationRouteInfo && locationRouteInfo.loading ? (
                  <Loader />
                ) : ''}
              </Row>
            </Col>
            <Col sm="12" md="12" xs="12" lg="6">
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-700 text-roman-silver">Days</span>
              </Row>
              <Row className="m-0">
                <span className="m-1 p-1 font-weight-800 text-capital">{detailData.sale_delay}</span>
              </Row>
              <hr className="mt-0" />
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-700 text-roman-silver">Volume</span>
              </Row>
              <Row className="m-0">
                <span className="m-1 p-1 font-weight-800 text-capital">{getDefaultNoValue(numToFloat(detailData.volume))}</span>
              </Row>
              <hr className="mt-0" />
            </Col>
            <Col sm="12" md="12" xs="12" lg="6">
              <Row className="m-0">
                <span className="m-0 p-0 font-weight-700 text-roman-silver">Weight</span>
              </Row>
              <Row className="m-0">
                <span className="m-1 p-1 font-weight-800">{getDefaultNoValue(numToFloat(detailData.weight))}</span>
              </Row>
              <hr className="mt-0" />
            </Col>
          </Row>
        </Col>
      )}
      <DetailViewFormat detailResponse={detail} />
    </Row>
  );
};

InventoryDetails.propTypes = {
  detail: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
};
export default InventoryDetails;
