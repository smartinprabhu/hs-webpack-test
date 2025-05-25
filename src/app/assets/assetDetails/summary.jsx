/* eslint-disable import/no-unresolved */
/* eslint-disable react/no-danger */
import React from 'react';
import {
  CardBody,
  Col,
  Row,
} from 'reactstrap';
import { useSelector } from 'react-redux';

import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';

const Summary = () => {
  const { equipmentsDetails } = useSelector((state) => state.equipment);
  const equipmentData = equipmentsDetails && (equipmentsDetails.data && equipmentsDetails.data.length > 0) ? equipmentsDetails.data[0] : '';
  return (
    <>
      {equipmentsDetails && (equipmentsDetails.data && equipmentsDetails.data.length > 0) && (
      <Row className="m-1">
        <Col sm="12" md="12" lg="6" xs="12">
          <Row>
            <span className="text-label-blue font-weight-800 collapse-heading m-0 p-0">Manufacturer</span>
          </Row>
          <Row>
            <span className="m-0 p-0 font-weight-400">{equipmentData.manufacturer_id ? equipmentData.manufacturer_id[1] : <span className="m-0 p-0 font-weight-400">Not Assigned</span>}</span>
          </Row>
          <hr className="mt-2" />
          <Row>
            <span className="text-label-blue font-weight-800 collapse-heading m-0 p-0">Purchase Date</span>
          </Row>
          <Row>
            <span className="m-0 p-0 font-weight-400">{equipmentData.purchase_date ? equipmentData.purchase_date : <span className="m-0 p-0 font-weight-400">Not Assigned</span>}</span>
          </Row>
          <hr className="mt-2" />
          <Row>
            <span className="text-label-blue font-weight-800 collapse-heading m-0 p-0">Purchase Value</span>
          </Row>
          <Row>
            <span className="m-0 p-0 font-weight-400">{equipmentData.purchase_value ? equipmentData.purchase_value : <span className="m-0 p-0 font-weight-400">Not Assigned</span>}</span>
          </Row>
          <hr className="mt-2" />
          <Row>
            <span className="text-label-blue font-weight-800 collapse-heading m-0 p-0">Model Code</span>
          </Row>
          <Row>
            <span className="m-0 p-0 font-weight-400">{equipmentData.model ? equipmentData.model : <span className="m-0 p-0font-weight-400">Not Assigned</span>}</span>
          </Row>
          <hr className="mt-2" />
          <Row>
            <span className="text-label-blue font-weight-800 collapse-heading m-0 p-0">Description</span>
          </Row>
          <Row>
            {equipmentData.note
              ? (<span className="m-0 p-0 font-weight-400" dangerouslySetInnerHTML={{ __html: equipmentData.note }} />)
              : (<span className="m-0 p-0 font-weight-400">Not Assigned</span>)}
          </Row>
          <hr className="mt-2" />
          <Row>
            <span className="text-label-blue font-weight-800 collapse-heading m-0 p-0">Class</span>
          </Row>
          <Row>
            <span className="m-0 p-0 font-weight-400">
              {equipmentData.class_id
                ? `${equipmentData.class_id[0]}-${equipmentData.class_id[1]}`
                : <span className="m-0 p-0 font-weight-400">Not Assigned</span>}
            </span>
          </Row>
          <hr className="mt-2" />
          <Row>
            <span className="text-label-blue font-weight-800 collapse-heading m-0 p-0">Family</span>
          </Row>
          <Row>
            <span className="m-0 p-0 font-weight-400">
              {equipmentData.family_id
                ? `${equipmentData.family_id[0]}-${equipmentData.family_id[1]}`
                : <span className="m-0 p-0 font-weight-400">Not Assigned</span>}
            </span>
          </Row>
          <hr className="mt-2" />
          <Row>
            <span className="text-label-blue font-weight-800 collapse-heading m-0 p-0">Serial No</span>
          </Row>
          <Row>
            <span className="m-0 p-0 font-weight-400">{equipmentData.serial ? equipmentData.serial : <span className="m-0 p-0 font-weight-400">Not Assigned</span>}</span>
          </Row>
          <hr className="mt-2" />
        </Col>
        <Col sm="12" md="12" lg="6" xs="12">
          <Row>
            <span className="text-label-blue font-weight-800 collapse-heading m-0 p-0">Installation Date</span>
          </Row>
          <Row>
            <span className="m-0 p-0 font-weight-400">{equipmentData.date_meter_install ? equipmentData.date_meter_install : <span className="m-0 p-0 font-weight-400">Not Assigned</span>}</span>
          </Row>
          <hr className="mt-2" />
          <Row>
            <span className="text-label-blue font-weight-800 collapse-heading m-0 p-0">Vendor</span>
          </Row>
          <Row>
            <span className="m-0 p-0 font-weight-400">{equipmentData.vendor_id ? equipmentData.vendor_id[1] : <span className="m-0 p-0 font-weight-400">Not Assigned</span>}</span>
          </Row>
          <hr className="mt-2" />
          <Row>
            <span className="text-label-blue font-weight-800 collapse-heading m-0 p-0">Criticality</span>
          </Row>
          <Row>
            <span className="m-0 p-0 font-weight-400">{equipmentData.criticality ? equipmentData.criticality : <span className="m-0 p-0 font-weight-400">Not Assigned</span>}</span>
          </Row>
          <hr className="mt-2" />
          <Row>
            <span className="text-label-blue font-weight-800 collapse-heading m-0 p-0">Validated By</span>
          </Row>
          <Row>
            <span className="m-0 p-0 font-weight-400">{equipmentData.validated_by ? equipmentData.validated_by[1] : <span className="m-0 p-0 font-weight-400">Not Assigned</span>}</span>
          </Row>
          <hr className="mt-2" />
          <Row>
            <span className="text-label-blue font-weight-800 collapse-heading m-0 p-0">Validated Status</span>
          </Row>
          <Row>
            <span className="m-0 p-0 font-weight-400">{equipmentData.validation_status ? equipmentData.validation_status : <span className="m-0 p-0 font-weight-400">Not Assigned</span>}</span>
          </Row>
          <hr className="mt-2" />
          <Row>
            <span className="text-label-blue font-weight-800 collapse-heading m-0 p-0">UNSPSC</span>
          </Row>
          <Row>
            <span className="m-0 p-0 font-weight-400">{equipmentData.commodity_id ? equipmentData.commodity_id[1] : <span className="m-0 p-0 font-weight-400">Not Assigned</span>}</span>
          </Row>
          <hr className="mt-2" />
          <Row>
            <span className="text-label-blue font-weight-800 collapse-heading m-0 p-0">Segment</span>
          </Row>
          <Row>
            <span className="m-0 p-0 font-weight-400">
              {equipmentData.segment_id
                ? `${equipmentData.segment_id[0]}-${equipmentData.segment_id[1]}`
                : <span className="m-0 p-0 font-weight-400">Not Assigned</span>}
            </span>
          </Row>
          <hr className="mt-2" />
        </Col>
      </Row>
      )}
      {equipmentsDetails && equipmentsDetails.loading && (
      <CardBody className="mt-4">
        <Loader />
      </CardBody>
      )}

      {(equipmentsDetails && equipmentsDetails.err) && (
        <CardBody>
          <ErrorContent errorTxt={equipmentsDetails.err.statusText ? equipmentsDetails.err.statusText : 'Something went wrong'} />
        </CardBody>
      )}
    </>
  );
};
export default Summary;
