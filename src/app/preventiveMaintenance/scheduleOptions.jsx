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

import ExcludeDays from './excludeDays';
import PhotoRequired from './photoRequired';
import EnforceTime from './enforceTime';
import QrInfo from './qrInfo';
import NfcInfo from './nfcInfo';

const ScheduleOptions = (props) => {
  const {
    detailData,
  } = props;

  const viewData = detailData && (detailData.data && detailData.data.length > 0) ? detailData.data[0] : false;

  const isExcludeDays = (viewData.mo || viewData.tu || viewData.we || viewData.th || viewData.fr || viewData.sa || viewData.su);

  return (
    <>
      {viewData && (
        <div>
          <Row className="p-0">
            {isExcludeDays && (
            <Col sm="12" md="4" xs="12" lg="4" className="mb-2 pb-1 pr-04">
              <Card className="h-100">
                <p className="ml-3 mb-1 mt-2 font-weight-600 text-pale-sky font-size-13">EXCLUDE DAYS</p>
                <hr className="mb-0 mt-0 mr-2 ml-2" />
                <CardBody className="p-0">
                  <div className="mt-1 pl-3">
                    <ExcludeDays detailData={viewData} />
                  </div>
                </CardBody>
              </Card>
            </Col>
            )}
            <Col sm="12" md="4" xs="12" lg="4" className={`mb-2 pb-1 ${isExcludeDays ? 'pr-04 pl-04' : 'pr-04'}`}>
              <Card className="h-100">
                <p className="ml-3 mb-1 mt-2 font-weight-600 text-pale-sky font-size-13">PHOTO REQUIRED</p>
                <hr className="mb-0 mt-0 mr-2 ml-2" />
                <CardBody className="p-0">
                  <div className="mt-1 pl-3">
                    <PhotoRequired detailData={viewData} />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col sm="12" md="4" xs="12" lg="4" className={`mb-2 pb-1 ${isExcludeDays ? 'pl-04' : 'pr-04 pl-04'}`}>
              <Card className="h-100">
                <p className="ml-3 mb-1 mt-2 font-weight-600 text-pale-sky font-size-13">ENFORCE TIME</p>
                <hr className="mb-0 mt-0 mr-2 ml-2" />
                <CardBody className="p-0">
                  <div className="mt-1 pl-3">
                    <EnforceTime detailData={viewData} />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col sm="12" md="4" xs="12" lg="4" className={`mb-2 pb-1 ${isExcludeDays ? 'pr-04' : 'pl-04'}`}>
              <Card className="h-100">
                <p className="ml-3 mb-1 mt-2 font-weight-600 text-pale-sky font-size-13">QR</p>
                <hr className="mb-0 mt-0 mr-2 ml-2" />
                <CardBody className="p-0">
                  <div className="mt-1 pl-3">
                    <QrInfo detailData={viewData} />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col sm="12" md="4" xs="12" lg="4" className={`mb-2 pb-1 ${isExcludeDays ? 'pl-04' : 'pr-04'}`}>
              <Card className="h-100">
                <p className="ml-3 mb-1 mt-2 font-weight-600 text-pale-sky font-size-13">NFC</p>
                <hr className="mb-0 mt-0 mr-2 ml-2" />
                <CardBody className="p-0">
                  <div className="mt-1 pl-3">
                    <NfcInfo detailData={viewData} />
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

ScheduleOptions.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
};
export default ScheduleOptions;
