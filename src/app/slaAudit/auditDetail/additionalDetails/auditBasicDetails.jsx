/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Card,
  CardBody,
} from 'reactstrap';
import * as PropTypes from 'prop-types';

import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import {
  generateErrorMessage,
} from '../../../util/appUtils';

import VisitInfo from './visitInfo';
import ValidatorsInfo from './validatorsInfo';

const AuditBasicDetails = (props) => {
  const {
    detailData,
  } = props;

  const viewData = detailData || false;

  return (
    <>
      {viewData && (<>
        {/* <div>
          <Row className=" TicketsSegments-cards">
            <Col sm="12" md="6" xs="12" lg="6" className="mb-2 pr-04">
              <Card className="h-100">
                <p className="ml-3 mb-1 mt-2 font-weight-600 text-pale-sky font-size-13">LOGS INFORMATION</p>
                <hr className="mb-0 mt-0 mr-2 ml-2" />
                <CardBody className="p-0">
                  <div className="mt-1 pl-3"> */}
                    <VisitInfo detailData={viewData} />
           {/*        </div>
                </CardBody>
              </Card>
            </Col>
            <Col sm="12" md="6" xs="12" lg="6" className="mb-2 pl-04">
              <Card className="h-100">
                <p className="ml-3 mb-1 mt-2 font-weight-600 text-pale-sky font-size-13">VALIDATORS INFORMATION</p>
                <hr className="mb-0 mt-0 mr-2 ml-2" />
                <CardBody className="p-0">
                  <div className="mt-1 pl-3"> */}
                    <ValidatorsInfo detailData={viewData} />
                  {/*  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

        </div> */}
        </>
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

AuditBasicDetails.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
};
export default AuditBasicDetails;
