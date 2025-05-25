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

const LocationBasicDetails = (props) => {
  const {
    detailData,
  } = props;

  const viewData = detailData && (detailData.data && detailData.data.length > 0) ? detailData.data[0] : false;

  return (
    <>
      {viewData && (
        <div>
          <Row className="p-0">
            <Col sm="12" md="6" xs="12" lg="6" className="mb-2 pb-1 pr-04 pl-04 ml-2">
              <Card className="h-100 location-overview-tabs">
                <p className="ml-3 mb-1 mt-2 font-weight-600 text-pale-sky font-size-13">GENERAL INFORMATION</p>
                <hr className="mb-0 mt-0 mr-2 ml-2" />
                <CardBody className="p-0">
                  <div className="mt-1 pl-3">
                    <GeneralInfo detailData={viewData} />
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

LocationBasicDetails.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
};
export default LocationBasicDetails;
