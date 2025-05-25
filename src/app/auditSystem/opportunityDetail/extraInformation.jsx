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

import ExtraInfo from './extraInfo';

const ExtraInformation = (props) => {
  const {
    content,
  } = props;

  const inspDeata = content && content.data && content.data.length ? content.data[0] : false;

  return (
    <>
      {inspDeata && (
        <div>
          <Row className="p-0">
            <Col sm="12" md="4" xs="12" lg="4" className="mb-2 pb-1 pr-04">
              <Card className="h-100">
                <p className="ml-3 mb-1 mt-2 font-weight-600 text-pale-sky font-size-13">EXTRA INFORMATION</p>
                <hr className="mb-0 mt-0 mr-2 ml-2" />
                <CardBody className="p-0">
                  <div className="mt-1 pl-3">
                    <ExtraInfo detailData={inspDeata} />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      )}
      {inspDeata && inspDeata.loading && (
        <Card>
          <CardBody className="mt-4">
            <Loader />
          </CardBody>
        </Card>
      )}

      {(inspDeata && inspDeata.err) && (
        <Card>
          <CardBody>
            <ErrorContent errorTxt="No Data Found" />
          </CardBody>
        </Card>
      )}
    </>
  );
};

ExtraInformation.propTypes = {
  content: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]).isRequired,
};

export default ExtraInformation;
