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
} from '../../../util/appUtils';

import GeneralInfo from './generalInfo';

const ActionBasicDetails = (props) => {
  const {
    detailData, setDetailModal,
  } = props;

  const viewData = detailData || false;

  return (
    <>
      {viewData && (
        <div>
          <Row className="p-0 TicketsSegments-cards">
            <Col sm="12" md="12" xs="12" lg="12" className="mb-2 pb-1">
              <Card className="h-100">
                <p className="ml-3 mb-1 mt-2 font-weight-600 text-pale-sky font-size-13">GENERAL INFORMATION</p>
                <hr className="mb-0 mt-0 mr-2 ml-2" />
                <CardBody className="p-0">
                  <div className="mt-1 pl-3">
                    <GeneralInfo detailData={viewData} setDetailModal={setDetailModal} />
                  </div>
                </CardBody>
              </Card>
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

ActionBasicDetails.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
  setDetailModal: PropTypes.func.isRequired,
};
export default ActionBasicDetails;
