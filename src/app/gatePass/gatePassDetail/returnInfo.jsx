/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Col,
  Row,
  Card,
  CardBody,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';

import {
  generateErrorMessage,
  getDefaultNoValue,
  getCompanyTimezoneDate,
  extractNameObject,
} from '../../util/appUtils';

const ReturnInfo = (props) => {
  const {
    detailData,
  } = props;

  const { userInfo } = useSelector((state) => state.user);

  const viewData = detailData && (detailData.data && detailData.data.length > 0) ? detailData.data[0] : false;

  return (
    <>
      {viewData && (
        <div>
          <Row className="p-0 work-permit-overview">
            <Col sm="12" md="4" xs="12" lg="4" className="mb-2 pr-04">
              <Card className="h-100">
                <p className="ml-3 mb-1 mt-2 font-weight-600 text-pale-sky font-size-13">EXIT INFORMATION</p>
                <hr className="mb-0 mt-0 mr-2 ml-2" />
                <CardBody className="p-0">
                  <div className="mt-1 pl-3">
                    <Row className="m-0">
                      <span className="m-0 p-0 light-text">
                        Exit Allowed by
                      </span>
                    </Row>
                    <Row className="m-0">
                      <Col sm="12" md="12" xs="12" lg="12" className="p-0 m-0">
                        <span className="m-0 p-0 font-weight-700 text-capital">
                          {getDefaultNoValue(extractNameObject(detailData.exit_allowed_by, 'name'))}
                        </span>
                      </Col>
                    </Row>
                    <p className="mt-2" />
                    <Row className="m-0">
                      <span className="m-0 p-0 light-text">
                        Exit on
                      </span>
                    </Row>
                    <Row className="m-0">
                      <Col sm="12" md="12" xs="12" lg="12" className="p-0 m-0">
                        <span className="m-0 p-0 font-weight-700 text-capital">
                          {getDefaultNoValue(getCompanyTimezoneDate(detailData.exit_on, userInfo, 'datetime'))}
                        </span>
                      </Col>
                    </Row>
                    <p className="mt-2" />
                    <Row className="m-0">
                      <span className="m-0 p-0 light-text">
                        Exit Description
                      </span>
                    </Row>
                    <Row className="m-0">
                      <Col sm="12" md="12" xs="12" lg="12" className="p-0 m-0 small-form-content hidden-scrollbar">
                        <span className="m-0 p-0 font-weight-700 text-capital">
                          {getDefaultNoValue(detailData.exit_description)}
                        </span>
                      </Col>
                    </Row>
                    <p className="mt-2" />
                  </div>
                </CardBody>
              </Card>
            </Col>
            {viewData.type === 'Returnable' && (
            <Col sm="12" md="4" xs="12" lg="4" className="mb-2 pl-04">
              <Card className="h-100">
                <p className="ml-3 mb-1 mt-2 font-weight-600 text-pale-sky font-size-13">RETURN INFORMATION</p>
                <hr className="mb-0 mt-0 mr-2 ml-2" />
                <CardBody className="p-0">
                  <div className="mt-1 pl-3">
                    <Row className="m-0">
                      <span className="m-0 p-0 light-text">
                        Return Allowed by
                      </span>
                    </Row>
                    <Row className="m-0">
                      <Col sm="12" md="12" xs="12" lg="12" className="p-0 m-0">
                        <span className="m-0 p-0 font-weight-700 text-capital">
                          {getDefaultNoValue(extractNameObject(detailData.return_allowed_by, 'name'))}
                        </span>
                      </Col>
                    </Row>
                    <p className="mt-2" />
                    <Row className="m-0">
                      <span className="m-0 p-0 light-text">
                        Returned on
                      </span>
                    </Row>
                    <Row className="m-0">
                      <Col sm="12" md="12" xs="12" lg="12" className="p-0 m-0">
                        <span className="m-0 p-0 font-weight-700 text-capital">
                          {getDefaultNoValue(getCompanyTimezoneDate(detailData.return_on, userInfo, 'datetime'))}
                        </span>
                      </Col>
                    </Row>
                    <p className="mt-2" />
                    <Row className="m-0">
                      <span className="m-0 p-0 light-text">
                        Return Description
                      </span>
                    </Row>
                    <Row className="m-0">
                      <Col sm="12" md="12" xs="12" lg="12" className="p-0 m-0 small-form-content hidden-scrollbar">
                        <span className="m-0 p-0 font-weight-700 text-capital">
                          {getDefaultNoValue(detailData.return_description)}
                        </span>
                      </Col>
                    </Row>
                    <p className="mt-2" />
                  </div>
                </CardBody>
              </Card>
            </Col>
            )}
            <Col sm="12" md="4" xs="12" lg="4" className={viewData.type === 'Returnable' ? 'mb-2 pl-0' : 'mb-2 pl-04'}>
              <Card className="h-100">
                <p className="ml-3 mb-1 mt-2 font-weight-600 text-pale-sky font-size-13">APPROVE INFORMATION</p>
                <hr className="mb-0 mt-0 mr-2 ml-2" />
                <CardBody className="pb-0 pr-0 pt-0 pl-3">
                  <div className="mt-1 pl-0">
                    <Row className="m-0">
                      <span className="m-0 p-0 light-text">
                        Approved by
                      </span>
                    </Row>
                    <Row className="m-0">
                      <Col sm="12" md="12" xs="12" lg="12" className="p-0 m-0">
                        <span className="m-0 p-0 font-weight-700 text-capital">
                          {getDefaultNoValue(extractNameObject(detailData.approved_by, 'name'))}
                        </span>
                      </Col>
                    </Row>
                    <p className="mt-2" />
                    <Row className="m-0">
                      <span className="m-0 p-0 light-text">
                        Approved on
                      </span>
                    </Row>
                    <Row className="m-0">
                      <Col sm="12" md="12" xs="12" lg="12" className="p-0 m-0">
                        <span className="m-0 p-0 font-weight-700 text-capital">
                          {getDefaultNoValue(getCompanyTimezoneDate(detailData.approved_on, userInfo, 'datetime'))}
                        </span>
                      </Col>
                    </Row>
                    <p className="mt-2" />
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

ReturnInfo.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
};
export default ReturnInfo;
