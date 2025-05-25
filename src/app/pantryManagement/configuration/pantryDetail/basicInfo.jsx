/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Card,
  CardBody,
  Col,
  Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import DetailViewFormat from '@shared/detailViewFormat';
import {
  getDefaultNoValue,
  getCompanyTimezoneDate, extractTextObject,
} from '../../../util/appUtils';

const BasicInfo = (props) => {
  const {
    detail,
  } = props;
  const { userInfo } = useSelector((state) => state.user);

  const detailData = detail && (detail.data && detail.data.length > 0) ? detail.data[0] : '';
  return (
    <>
      <Card className="border-0 h-100">
        {detailData && (
        <CardBody data-testid="success-case">
          <Row className="pb-2">
            <Col md="12" sm="12" xs="12" lg="12">
              <Card className="bg-lightblue">
                <CardBody className="p-1">
                  <span className="font-weight-400 font-tiny mr-1">
                    Status
                  </span>
                  <br />
                  <span className="font-weight-800 pl-1 font-tiny text-info">
                    {getDefaultNoValue(detailData.state)}
                  </span>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row className="mb-1 mt-1 ml-0">
            <span className="font-weight-800 pl-1 font-side-heading mb-1 mt-2">PANTRY INFO</span>
          </Row>
          <Row className="pb-2">
            <Col md="12" sm="12" xs="12" lg="12">
              <Card className="bg-lightblue">
                <CardBody className="p-1">
                  <span className="font-weight-400 font-tiny mr-1">
                    Company
                  </span>
                  <br />
                  <span className="font-weight-800 pl-1 font-tiny">
                    {getDefaultNoValue(extractTextObject(detailData.company_id))}
                  </span>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row className="pb-2">
            <Col md="12" sm="12" xs="12" lg="12">
              <Card className="bg-lightblue">
                <CardBody className="p-1">
                  <span className="font-weight-400 font-tiny mr-1">
                    Created On
                  </span>
                  <br />
                  <span className="font-weight-800 pl-1 font-tiny">
                    {getDefaultNoValue(getCompanyTimezoneDate(detailData.create_date, userInfo, 'datetime'))}
                  </span>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </CardBody>
        )}
        <DetailViewFormat detailResponse={detail} />
      </Card>
    </>
  );
};

BasicInfo.propTypes = {
  detail: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
};
export default BasicInfo;
