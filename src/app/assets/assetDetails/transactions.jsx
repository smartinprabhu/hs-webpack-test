/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Col,
  Row,
  Card,
  CardBody,
} from 'reactstrap';
import * as PropTypes from 'prop-types';

import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import {
  generateErrorMessage,
} from '../../util/appUtils';

import Readings from './readings';
import Maintenance from './maintenance';

const Transactions = (props) => {
  const {
    detailData,
    setViewModal,
    viewModal,
    setEquipmentDetails,
    isEquipmentDetails,
  } = props;

  const equipmentData = detailData && (detailData.data && detailData.data.length > 0) ? detailData.data[0] : false;

  return (
    <>
      {equipmentData && (
        <div>
          <Row className="mb-2 ml-1 mr-1 mt-3 transactions-cards">
            <Col sm="12" md="12" xs="12" lg="12">
              <h6>Work Orders</h6>
              <Maintenance id={equipmentData.id} setViewModal={setViewModal} viewModal={viewModal} setEquipmentDetails={setEquipmentDetails} isEquipmentDetails={isEquipmentDetails} />
            </Col>
          </Row>
          <hr />
          <Row className="mb-2 ml-1 mr-1 mt-3 transactions-cards">
            <Col sm="12" md="12" xs="12" lg="12">
              <Readings
                ids={equipmentData.reading_lines_ids}
                viewId={equipmentData.id}
                type="equipment"
                setViewModal={setViewModal}
                viewModal={viewModal}
                setEquipmentDetails={setEquipmentDetails}
                isEquipmentDetails={isEquipmentDetails}
              />
            </Col>
          </Row>
        </div>
      )}
      {detailData && detailData.loading && (
        <Card>
          <CardBody className="mt-4">
            <Loader />
          </CardBody>
        </Card>
      )}

      {(detailData && detailData.err) && (
        <Card>
          <CardBody>
            <ErrorContent errorTxt={generateErrorMessage(detailData)} />
          </CardBody>
        </Card>
      )}
    </>
  );
};

Transactions.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
  setViewModal: PropTypes.func.isRequired,
  viewModal: PropTypes.bool.isRequired,
  setEquipmentDetails: PropTypes.func.isRequired,
  isEquipmentDetails: PropTypes.bool.isRequired,
};
export default Transactions;
