/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Badge,
  Card,
  CardBody,
  Col,
  Row,
} from 'reactstrap';
import { useSelector } from 'react-redux';

import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import assetMiniBlueIcon from '@images/icons/assetMiniBlue.svg';
import {
  getDefaultNoValue, getTimeFromFloat, getDateTimeFromFloat,
} from '../../util/appUtils';
import { getEquipmentStateLabel } from '../utils/utils';
import { validityCheck } from '../../util/staticFunctions';

const AssetDetailInfo = () => {
  const { equipmentsDetails } = useSelector((state) => state.equipment);
  const equipmentData = equipmentsDetails && (equipmentsDetails.data && equipmentsDetails.data.length > 0) ? equipmentsDetails.data[0] : '';

  return (
    <>
      <Card className="border-0 h-100">
        {equipmentsDetails && (equipmentsDetails.data && equipmentsDetails.data.length > 0) && (
          <CardBody data-testid="success-case">
            <Row>
              <Col md="8" lg="8" xs="8" sm="8">
                <h4 className="mb-1"><Badge color="primary" className="p-2 font-weight-800 font-medium no-border-radius">{equipmentData.name}</Badge></h4>
                <p className="mb-1 font-weight-400">
                  #
                  {equipmentData.equipment_seq}
                </p>
                {getEquipmentStateLabel(equipmentData.state)}
              </Col>
              <Col md="4" lg="4" xs="4" sm="4" className="text-center">
                <img src={assetMiniBlueIcon} alt="asset" className="m-0" width="35" height="35" />
              </Col>
            </Row>
            <Row className="mb-1 mt-1 ml-0">
              <span className="font-weight-800 font-side-heading mb-1 mt-1">GENERAL INFO</span>
            </Row>
            <Row className="pb-2">
              <Col md="12" lg="12" xs="12" sm="12">
                <span className="font-weight-600 font-side-heading mr-1">
                  Category :
                </span>
                <span className="font-weight-400">
                  {getDefaultNoValue(equipmentData.category_id
                    ? equipmentData.category_id[1]
                    : '')}
                </span>
              </Col>
              <Col md="12" lg="12" xs="12" sm="12">
                <span className="font-weight-600 font-side-heading mr-1">
                  Location :
                </span>
                <span className="font-weight-400">
                  {getDefaultNoValue(equipmentData.location_id
                    ? equipmentData.location_id[1]
                    : '')}
                </span>
              </Col>
              <Col md="12" lg="12" xs="12" sm="12">
                <span className="font-weight-600 font-side-heading mr-1">
                  Vendor :
                </span>
                <span className="font-weight-400">
                  {getDefaultNoValue(equipmentData.vendor_id
                    ? equipmentData.vendor_id[1]
                    : '')}
                </span>
              </Col>
            </Row>
            <Row className="mb-0 mt-0 ml-0">
              <span className="font-weight-800 font-side-heading mb-1">USAGE INFO</span>
            </Row>
            <Row className="pb-2">
              <Col md="12" lg="12" xs="12" sm="12">
                <span className="font-weight-600 font-side-heading mr-1">
                  MTBF :
                </span>
                <span className="font-weight-400">
                  {getDateTimeFromFloat(equipmentsDetails.data[0].mtbf_hours)}
                </span>
              </Col>
              <Col md="12" lg="12" xs="12" sm="12">
                <span className="font-weight-600 font-side-heading mr-1">
                  MTTR :
                </span>
                <span className="font-weight-400">
                  {getTimeFromFloat(equipmentsDetails.data[0].mttf_hours)}
                </span>
              </Col>
              <Col md="12" lg="12" xs="12" sm="12">
                <span className="font-weight-600 font-side-heading mr-1">
                  Downtime :
                </span>
                <span className="font-weight-400">
                  {getTimeFromFloat(equipmentsDetails.data[0].scheduled_down_time)}
                </span>
              </Col>
            </Row>
            <Row className="m-0">
              <span className="font-weight-800 font-side-heading mb-1 ">WARRANTY</span>
            </Row>
            <Row className="pb-2">
              <Col md="12" lg="12" xs="12" sm="12">
                <Card className="bg-lightblue">
                  <CardBody className="p-1">
                    <span className="font-weight-400">
                      {getDefaultNoValue(validityCheck(equipmentData.warranty_end_date))}
                    </span>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </CardBody>
        )}
        {equipmentsDetails && equipmentsDetails.loading && (
        <CardBody className="mt-4" data-testid="loading-case">
          <Loader />
        </CardBody>
        )}

        {(equipmentsDetails && equipmentsDetails.err) && (
        <CardBody>
          <ErrorContent errorTxt={equipmentsDetails.err.statusText ? equipmentsDetails.err.statusText : 'Something went wrong'} />
        </CardBody>
        )}
      </Card>
    </>
  );
};

export default AssetDetailInfo;
