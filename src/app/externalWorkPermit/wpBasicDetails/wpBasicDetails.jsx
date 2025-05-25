/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Col,
  Row,
  Card,
  CardBody,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { Markup } from 'interweave';
import { Typography, Divider } from '@mui/material'
import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import {
  generateErrorMessage,
  detectMob, truncateFrontSlashs,
  truncateStars,
} from '../../util/appUtils';

import GeneralInfo from './generalInfo';
import VendorInfo from './vendorInfo';
import WpInfo from './wpInfo';
import { AddThemeColor } from '../../themes/theme';

const WpBasicDetails = (props) => {
  const {
    detailData,
    wpConfigData,
  } = props;

  const isMobile = detectMob();

  const viewData = detailData && (detailData.data && detailData.data.length > 0) ? detailData.data[0] : false;

  return (
    <>
      {viewData && (
        <div>
          <Row className="p-0">
            <Col sm="12" md="12" xs="12" lg="12" className="mb-2 pb-1">
              <Card className="h-100">
                <Typography
                  sx={AddThemeColor({
                    font: "normal normal medium 20px/24px Suisse Intl",
                    fontWeight: 500,
                    margin: "10px 0px 10px 10px",
                  })}
                >
                  General Information
                </Typography>
                <Divider />
                <CardBody className="p-0">
                  <div className="mt-1 pl-3">
                    <GeneralInfo wpConfigData={wpConfigData} detailData={viewData} />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col sm="12" md="6" xs="12" lg="6" className={`mb-2 pb-1 ${isMobile ? '' : 'pr-04'}`}>
              <Card className="h-100">
                <Typography
                  sx={AddThemeColor({
                    font: "normal normal medium 20px/24px Suisse Intl",
                    fontWeight: 500,
                    margin: "10px 0px 10px 10px",
                  })}
                >
                  WorkPermit Information
                </Typography>
                <Divider />
                <CardBody className="p-0">
                  <div className="mt-1 pl-3">
                    <WpInfo wpConfigData={wpConfigData} detailData={viewData} />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col sm="12" md="6" xs="12" lg="6" className={`mb-2 pb-1 ${isMobile ? '' : 'pl-04'}`}>
              <Card className="h-100">
                <Typography
                  sx={AddThemeColor({
                    font: "normal normal medium 20px/24px Suisse Intl",
                    fontWeight: 500,
                    margin: "10px 0px 10px 10px",
                  })}
                >
                  Vendor Information
                </Typography>
                <Divider />
                <CardBody className="p-0">
                  <div className="mt-1 pl-3">
                    <VendorInfo detailData={viewData} />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          {(viewData.state === 'Approved' || viewData.state === 'Validated') && (
            <Row className="p-0">
              <Col sm="12" md="12" xs="12" lg="12" className="">
                <Card>
                  <Typography
                    sx={AddThemeColor({
                      font: "normal normal medium 20px/24px Suisse Intl",
                      fontWeight: 500,
                      margin: "10px 0px 10px 10px",
                    })}
                  >
                    EHS Instructions
                  </Typography>
                  <CardBody className="p-0">
                    <div className="mt-0 pl-3 small-form-content thin-scrollbar">
                      <Markup content={truncateFrontSlashs(truncateStars(viewData.ehs_instructions))} />
                    </div>
                  </CardBody>
                  <Divider />
                  <Typography
                    sx={AddThemeColor({
                      font: "normal normal medium 20px/24px Suisse Intl",
                      fontWeight: 500,
                      margin: "10px 0px 10px 10px",
                    })}
                  >
                    Terms And Conditions
                  </Typography>
                  <CardBody className="p-0">
                    <div className="mt-0 mb-2 pl-3 small-form-content thin-scrollbar">
                      <Markup content={truncateFrontSlashs(truncateStars(viewData.terms_conditions))} />
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          )}
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

WpBasicDetails.propTypes = {
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
  ]).isRequired,
};
export default WpBasicDetails;
