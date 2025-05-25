/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Card,
  CardBody,
  Col,
  Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import DetailViewFormat from '@shared/detailViewFormat';

import transferBlackIcon from '@images/transfersBlack.svg';

import {
  getDefaultNoValue,
  numToFloat,
  extractTextObject,
} from '../../../util/appUtils';

import { setCurrentTab, getMoveFilters } from '../../inventoryService';

const DetailInfo = (props) => {
  const {
    detail,
  } = props;

  const dispatch = useDispatch();

  const loadProductMoves = (product) => {
    if (product) {
      const key = product[0];
      const value = product[1];
      const filters = [{
        key: 'product_id', value: key, label: value, type: 'ids',
      }];
      dispatch(getMoveFilters(filters));
      dispatch(setCurrentTab('Product Moves'));
    }
  };

  const detailData = detail && (detail.data && detail.data.length > 0) ? detail.data[0] : '';

  return (
    <Card className="border-0">
      {detailData && (
      <CardBody>
        <Row>
          <Col sm="12" md="12" xs="12" lg="8">
            <span
              aria-hidden="true"
              id="switchAction"
              className="pl-2 cursor-pointer font-weight-400"
              onClick={() => loadProductMoves(detailData.product_id)}
            >
              <img
                className="mr-2"
                src={transferBlackIcon}
                width="15"
                alt="documents"
              />
              Product Moves
            </span>
          </Col>
        </Row>
        <hr />
        <Row className="ml-1 mr-1 mt-3">
          <Col sm="12" md="12" xs="12" lg="6">
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-roman-silver">Product</span>
            </Row>
            <Row className="m-0">
              <span className="m-1 p-1 font-weight-800 text-capital">{getDefaultNoValue(extractTextObject(detailData.product_id))}</span>
            </Row>
            <hr className="mt-0" />
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-roman-silver">Location</span>
            </Row>
            <Row className="m-0">
              <span className="m-1 p-1 font-weight-800 text-capital">{getDefaultNoValue(extractTextObject(detailData.location_id))}</span>
            </Row>
            <hr className="mt-0" />
          </Col>
          <Col sm="12" md="12" xs="12" lg="6">
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-roman-silver">Quantity on Hand</span>
            </Row>
            <Row className="m-0">
              <span className="m-1 p-1 font-weight-800">{numToFloat(detailData.quantity)}</span>
            </Row>
            <hr className="mt-0" />
            <Row className="m-0">
              <span className="m-0 p-0 font-weight-700 text-roman-silver">Quantity Reserved</span>
            </Row>
            <Row className="m-0">
              <span className="m-1 p-1 font-weight-800">{numToFloat(detailData.reserved_quantity)}</span>
            </Row>
            <hr className="mt-0" />
          </Col>
        </Row>
      </CardBody>
      )}
      <DetailViewFormat detailResponse={detail} />
    </Card>
  );
};

DetailInfo.propTypes = {
  detail: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
};
export default DetailInfo;
