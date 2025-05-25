/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  Col,
  Row,
  Badge,
} from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';

import assetDefault from '@images/drawerLite/assetLite.svg';
import envelopeIcon from '@images/icons/envelope.svg';
import logsIcon from '@images/drawerLite/statusLite.svg';

import DetailViewFormat from '@shared/detailViewFormat';
import { getSpaceName } from '../../../assets/equipmentService';
import {
  getDefaultNoValue, truncate, getArrayToValues,
} from '../../../util/appUtils';

const appModels = require('../../../util/appModels').default;

const DetailInfo = (props) => {
  const {
    detailData, editId,
  } = props;
  const dispatch = useDispatch();
  const [locationValue, setLocationValue] = useState(false);
  const {
    spaceName,
  } = useSelector((state) => state.equipment);

  const viewData = detailData && (detailData.data && detailData.data.length > 0) ? detailData.data[0] : false;

  const loading = detailData && detailData.loading;

  useEffect(() => {
    if (viewData && viewData !== '') {
      const locationId = viewData.spaces_ids;
      if (locationId && locationId.length > 0) {
        dispatch(getSpaceName(appModels.SPACE, locationId));
      } else {
        setLocationValue([]);
      }
    }
  }, [editId, viewData]);

  useEffect(() => {
    const locationId = viewData.spaces_ids;
    if (!editId && locationId && locationId.length > 0 && spaceName && spaceName.data && spaceName.data.length > 0) {
      setLocationValue(spaceName.data);
    } else {
      setLocationValue([]);
    }
  }, [spaceName]);

  return (
    !loading && viewData && (
    <Row className="mt-3 globalModal-header-cards">
      <Col sm="12" md="3" lg="3" xs="12" className="p-0">
        <Card className="h-100 no-border-radius border-left-0 border-top-0 border-bottom-0">
          <CardBody className="p-2">
            <Row className="m-0">
              <Col sm="12" md="9" lg="9" xs="12" className="">
                <p className="mb-0 font-weight-500 font-tiny">
                  NAME
                </p>
                <p className="mb-0 font-weight-700">
                  {truncate(viewData.name, 30)}
                </p>
              </Col>
              <Col sm="12" md="3" lg="3" xs="12" className="">
                <img src={envelopeIcon} alt="asset" width="30" className="mt-3" />
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
      <Col sm="12" md="3" lg="3" xs="12" className="p-0">
        <Card className="h-100 no-border-radius border-left-0 border-top-0 border-bottom-0">
          <CardBody className="p-2">
            <Row className="m-0">
              <Col sm="12" md="9" lg="9" xs="12" className="">
                <p className="mb-0 font-weight-500 font-tiny">
                  SEQUENCE
                </p>
                <p className="mb-0 font-weight-700">
                  {getDefaultNoValue(viewData.pantry_sequence)}
                </p>
              </Col>
              <Col sm="12" md="3" lg="3" xs="12" className="">
                <img src={assetDefault} alt="asset" width="30" className="mt-3" />
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
      <Col sm="12" md="3" lg="3" xs="12" className="p-0">
        <Card className="h-100 no-border-radius border-left-0 border-top-0 border-bottom-0">
          <CardBody className="p-2">
            <Row className="m-0">
              <Col sm="12" md="9" lg="9" xs="12" className="">
                <p className="mb-0 font-weight-500 font-tiny">
                  STATUS
                </p>
                <p className="mb-0 font-weight-700">
                  <Badge className="bg-success">
                    {getDefaultNoValue(viewData.state)}
                  </Badge>
                </p>
              </Col>
              <Col sm="12" md="3" lg="3" xs="12" className="">
                <img src={logsIcon} alt="asset" width="25" className="mt-3" />
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
      <Col sm="12" md="3" lg="3" xs="12" className="p-0">
        <Card className="h-100 no-border-radius border-left-0 border-top-0 border-bottom-0">
          <CardBody className="p-2">
            <Row className="m-0">
              <Col sm="12" md="9" lg="9" xs="12" className="">
                <p className="mb-0 font-weight-500 font-tiny">
                  SPACES
                </p>
                <p className="mb-0 font-weight-700">
                  {getDefaultNoValue(locationValue && getArrayToValues(locationValue, 'path_name'))}
                </p>
              </Col>
              <Col sm="12" md="3" lg="3" xs="12" className="">
                <img src={assetDefault} alt="asset" width="30" className="mt-3" />
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
      <DetailViewFormat detailResponse={detailData} />
    </Row>
    ));
};

DetailInfo.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
};
export default DetailInfo;
