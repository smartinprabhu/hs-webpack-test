/* eslint-disable prefer-destructuring */
/* eslint-disable no-shadow */
/* eslint-disable max-len */
/* eslint-disable no-alert */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/no-unresolved */
import closeCircleRed from '@images/icons/closeCircleRed.svg';
import axios from 'axios';
import * as PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import {
  Card, CardBody, Col, Row, Button,
} from 'reactstrap';
import Loader from '@shared/loading';
import AuthService from '../util/authService';
import { detectMob, getAccountIdFromUrl } from '../util/appUtils';
import { getExportLogo, getTabName } from '../util/getDynamicClientData';

const appConfig = require('../config/appConfig').default;

const ExternalReportOneQR = (props) => {
  const { match } = props;
  const { params } = match;
  const { uuid } = params;
  const isMobileView = detectMob();
  const accid = getAccountIdFromUrl(props);
  const [QRConfig, setQRConfig] = useState({ loading: false, data: null, err: null });
  const WEBAPPAPIURL = `${window.location.origin}/`;

  const detailData = QRConfig && QRConfig.data ? QRConfig.data[0] : '';
  const isQRLines = detailData && detailData.oneqr_lines && detailData.oneqr_lines.length ? detailData.oneqr_lines : false;
  const styleColor = `${'#'}${detailData && detailData.text_color && detailData.text_color !== '' ? detailData.text_color : 'fff'}`

  const authService = AuthService();
  const isAuthenticated = authService.getRefreshToken();
  document.title = `${getTabName()} ${window.location.pathname.replace('/', '| ')}`;

  const oneSignalDiv = document.getElementById('onesignal-bell-container');

  if (oneSignalDiv) {
    oneSignalDiv.style.display = 'none';
  }

  useEffect(() => {
    if (uuid && !isAuthenticated) {
      setQRConfig({
        loading: true, data: null, count: 0, err: null,
      });

      const config = {
        method: 'get',
        url: `${WEBAPPAPIURL}public/api/v4/getOneqr?uuid=${uuid}&portalDomain=${window.location.origin}`,
        headers: {
          portalDomain: window.location.origin,
          accountId: accid,
        },
      };

      axios(config)
        .then((response) => setQRConfig({
          loading: false, data: response.data.data, count: response.data.length, err: null,
        }))
        .catch((error) => {
          setQRConfig({
            loading: false, data: null, count: 0, err: error,
          });
        });
    }
  }, [uuid, isAuthenticated]);

  useEffect(() => {
    if (QRConfig && QRConfig.data && QRConfig.data.length && QRConfig.data.length > 0) {
      document.getElementById('main-body-property').style.backgroundColor = `${'#'}${detailData.background_color && detailData.background_color !== '' ? detailData.background_color : '3a4354'}`;
    }
  }, [QRConfig]);

  return (
    <Row
      className="ml-1 mr-1 mt-2 mb-2 p-2"
    >
      {QRConfig && QRConfig.data && QRConfig.count > 0 && (
        <Col md={{ size: 6, offset: 3 }} sm="12" lg={{ size: 6, offset: 3 }} xs="12" className="mt-3">
          <CardBody className="p-2 mb-3 bg-ghost-white">
            <Row className="content-center">
              <Col md="9" sm="9" lg="9" xs="9">
                {isMobileView
                  ? (
                    <h5
                      className="mb-1 mt-0"
                      style={{
                        color: styleColor,
                      }}
                    >
                      {detailData && detailData.company_id && detailData.company_id.name ? detailData.company_id.name : ''}
                    </h5>
                  )
                  : (
                    <h4
                      className="mb-1 mt-0"
                      style={{
                        color: styleColor,
                      }}
                    >
                      {detailData && detailData.company_id && detailData.company_id.name ? detailData.company_id.name : ''}
                    </h4>
                  )}
              </Col>
              <Col md="3" sm="3" lg="3" xs="3">
                <img
                  src={getExportLogo()}
                  width={isMobileView ? '80' : '130'}
                  height="auto"
                  className="d-inline-block align-top"
                  alt="Helixsense Portal"
                />
              </Col>
            </Row>
          </CardBody>
          <Row>
            <Col
              md="12"
              sm="12"
              xs="12"
              lg="12"
            >
              <h5
                className="text-center"
                style={{
                  color: styleColor,
                }}
              >
                {detailData.name}
              </h5>
              {detailData && detailData.description && (
                <h6
                  className="text-center text-break  mt-2 mb-0"
                  style={{
                    color: styleColor,
                  }}
                >
                  {detailData.description}
                </h6>
              )}
            </Col>
          </Row>
          <hr />
          <Row className="m-0">
            {isQRLines && isQRLines.length && isQRLines.map((menu) => (
              <Col md="6" sm="12" lg="6" xs="12" className="pl-1 pr-1 mb-2 cursor-pointer text-center">
                <Card
                  className="h-100 rounded"
                  style={{
                    background: `${'#'}${menu.card_color && menu.card_color !== '' ? menu.card_color : 'fff'}`,
                  }}
                >
                  <CardBody className="text-center">
                    <a href={`${WEBAPPAPIURL}${menu.external_path_name}/${menu.uuid}${menu.meetadata ? `?${menu.meetadata}` : ''} `} rel="noreferrer">
                      {menu && menu.image
                        ? (
                          <>
                            <img
                              src={menu.image ? `data: image / png; base64, ${menu.image} ` : ''}
                              alt="asset"
                              width="35"
                              height="35"
                              className="mb-3"
                            />
                            <br />
                          </>
                        )
                        : ''}
                      <Button
                        type="button"
                        style={{ background: `${'#'}${menu.button_color && menu.button_color !== '' ? menu.button_color : '3a4354'} `, borderColor: `${'#'}${menu.button_color && menu.button_color !== '' ? menu.button_color : '3a4354'} `, color: `${'#'}${menu.text_color && menu.text_color !== '' ? menu.text_color : 'fff'} ` }}
                        size="sm"
                      >
                        {menu.name}
                      </Button>
                    </a>
                    <br />
                    {menu && menu.description && (
                      <span
                        className="text-center text-break font-size-11  mt-2 mb-0"
                        style={{
                          color: `${'#'}${menu.description_color && menu.description_color !== '' ? menu.description_color : '808080'}`,
                        }}
                      >
                        {menu.description}
                      </span>
                    )}
                  </CardBody>
                </Card>
              </Col>
            ))}
            {!isQRLines && (
              <Col md="12" sm="12" lg="12" xs="12">
                <div className="text-center mt-3 mb-3">
                  <img src={closeCircleRed} className="mr-2" alt="invalid" width="40" height="40" />
                  <h4 className="text-danger">
                    Oops! No configurations are added

                  </h4>
                </div>
              </Col>
            )}
          </Row>
        </Col>
      )}
      {QRConfig && QRConfig.loading && (
        <Col md={{ size: 6, offset: 3 }} sm="12" lg={{ size: 6, offset: 3 }} xs="12">
          <div className="text-center mt-3 mb-3">
            <Loader />
          </div>
        </Col>
      )}
      {QRConfig && QRConfig.data && (!QRConfig.count) && (
        <Col md={{ size: 6, offset: 3 }} sm="12" lg={{ size: 6, offset: 3 }} xs="12">
          <div className="text-center mt-3 mb-3">
            <img src={closeCircleRed} className="mr-2" alt="invalid" width="40" height="40" />
            <h4 className="text-danger">
              Oops! Your request is invalid

            </h4>
          </div>
        </Col>
      )}
    </Row>
  );
};

ExternalReportOneQR.defaultProps = {
  match: false,
};

ExternalReportOneQR.propTypes = {
  match: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.bool,
    PropTypes.string,
  ]),
};

export default ExternalReportOneQR;
