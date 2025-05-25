/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Col,
  Row,
  Card,
  CardBody,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { Typography, Divider } from '@mui/material';

import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import {
  generateErrorMessage,
} from '../../util/appUtils';

import BearerInfo from './bearerInfo';
import RequestorInfo from './requestorInfo';
import { AddThemeColor } from '../../themes/theme';

const BasicDetails = (props) => {
  const {
    detailData,
  } = props;

  const viewData = detailData && (detailData.data && detailData.data.length > 0) ? detailData.data[0] : false;

  return (
    <>
      {viewData && (
        <div>
          <Row className="p-0 work-permit-overview">
            <Col sm="12" md="6" xs="12" lg="6" className="mb-2 pr-04">
              <Card className="h-100">
                <Typography
                  sx={AddThemeColor({
                    font: "normal normal medium 20px/24px Suisse Intl",
                    fontWeight: 500,
                    margin: "10px 0px 10px 10px",
                  })}
                >
                  Requestor Information
                </Typography>
                <Divider />
                <CardBody className="p-0">
                  <div className="mt-1 pl-3">
                    <RequestorInfo detailData={viewData} />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col sm="12" md="6" xs="12" lg="6" className="mb-2 pl-04">
              <Card className="h-100">
                <Typography
                  sx={AddThemeColor({
                    font: "normal normal medium 20px/24px Suisse Intl",
                    fontWeight: 500,
                    margin: "10px 0px 10px 10px",
                  })}
                >
                  Bearer Information
                </Typography>
                <Divider />
                <CardBody className="p-0">
                  <div className="mt-1 pl-3">
                    <BearerInfo detailData={viewData} />
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

BasicDetails.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
};
export default BasicDetails;
