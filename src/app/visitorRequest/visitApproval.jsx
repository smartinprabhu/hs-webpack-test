/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  Col,
  Row,
} from 'reactstrap';
import {
  Button,
} from '@mui/material';
import * as PropTypes from 'prop-types';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDownload,
} from '@fortawesome/free-solid-svg-icons';
import { Image } from 'antd';

import DetailViewFormat from '@shared/detailViewFormat';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';

import idcardIcon from '@images/icons/idcard.svg';
import buildingBlack from '@images/icons/buildingBlack.svg';
import closeCircleRed from '@images/icons/closeCircleRed.svg';
import checkGreen from '@images/icons/checkGreen.svg';
import closeCircle from '@images/icons/closeCircle.svg';
import closeCircleWhite from '@images/icons/closeCircleWhite.svg';
import checkWhite from '@images/icons/checkWhite.svg';
import imageUpload from '@images/userProfile.jpeg';
import telephoneIcon from '@images/icons/telephone.svg';
import envelopeIcon from '@images/icons/envelope.svg';

import {
  getLocalTime, getDefaultNoValue,
  detectMimeType, getAccountIdFromUrl,
} from '../util/appUtils';
import { getTabName, getExportLogo } from '../util/getDynamicClientData';
import AuthService from '../util/authService';

const appConfig = require('../config/appConfig').default;

const VisitApproval = (props) => {
  const { match } = props;
  const { params } = match;
  const { uuid } = params;
  const accid = getAccountIdFromUrl(props);
  const [isButtonHover, setButtonHover] = useState(false);
  const [vpConfig, setVpConfig] = useState({ loading: false, data: null, err: null });
  const [statusInfo, setStatusInfo] = useState({ loading: false, data: null, err: null });
  const WEBAPPAPIURL = `${window.location.origin === 'http://localhost:3010' ? 'http://localhost:3000' : window.location.origin}/`;


  document.title = `${getTabName()} ${window.location.pathname.replace('/', '| ')}`;

  const authService = AuthService();
  const isAuthenticated = authService.getRefreshToken();

  useEffect(() => {
    if (uuid && !isAuthenticated) {
      setVpConfig({
        loading: true, data: null, count: 0, err: null,
      });
      const config = {
        method: 'get',
        url: `${WEBAPPAPIURL}public/api/v4/getVMSVisit?uuid=${uuid}&portalDomain=${window.location.origin}`,
        headers: {
          portalDomain: window.location.origin,
          accountId: accid,
        },
      };
      axios(config)
        .then((response) => setVpConfig({
          loading: false, data: response.data.data, count: response.data.length, err: null,
        }))
        .catch((error) => {
          setVpConfig({
            loading: false, data: null, count: 0, err: error,
          });
        });
    }
  }, [uuid, isAuthenticated]);

  useEffect(() => {
    if (statusInfo && statusInfo.data && uuid) {
      setVpConfig({
        loading: true, data: null, count: 0, err: null,
      });
      const config = {
        method: 'get',
        url: `${WEBAPPAPIURL}public/api/v4/getVMSVisit?uuid=${uuid}&portalDomain=${window.location.origin}`,
        headers: {
          portalDomain: window.location.origin,
          accountId: accid,
        },
      };
      axios(config)
        .then((response) => setVpConfig({
          loading: false, data: response.data.data, count: response.data.length, err: null,
        }))
        .catch((error) => {
          setVpConfig({
            loading: false, data: null, count: 0, err: error,
          });
        });
    }
  }, [statusInfo]);

  const statusUpdate = (statusValue) => {
    if (uuid) {
      setStatusInfo({ loading: true, data: null, err: null });
      const data = {
        uuid,
        status: statusValue,
      };

      const postData = new FormData();
      Object.keys(data).map((payloadObj) => {
        postData.append(payloadObj, data[payloadObj]);
        return postData;
      });
      const config = {
        method: 'post',
        url: `${WEBAPPAPIURL}public/api/v4/vms/updateVMSStatus`,
        headers: {
          'Content-Type': 'multipart/form-data',
          portalDomain: window.location.origin,
          accountId: accid,
        },
        data: postData,
      };

      axios(config)
        .then((response) => setStatusInfo({ loading: false, data: response.data.data, err: null }))
        .catch((error) => {
          setStatusInfo({ loading: false, data: null, err: error });
        });
    }
  };

  const detailData = vpConfig && vpConfig.data ? vpConfig.data : '';

  const documentDownload = (datas, filename) => {
    const element = document.createElement('a');
    element.setAttribute('href', `data:image/png;base64,${encodeURIComponent(datas)}`);
    element.setAttribute('download', filename);
    element.setAttribute('id', 'file');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();
    document.body.removeChild(element);
  };

  if (isAuthenticated && uuid) {
    return (
      <Redirect to={{
        pathname: '/visitormanagement/visitrequest',
        state: { referrer: 'view-request', uuid },
      }}
      />
    );
  }

  return (
    <Row className="ml-1 mr-1 external-link-tickets mt-2 mb-2 p-3">
      {vpConfig && vpConfig.data && vpConfig.count > 0 && (
      <Col md={{ size: 6, offset: 3 }} sm="12" lg={{ size: 6, offset: 3 }} xs="12">
        <>
          <CardBody className="p-2 mb-3 bg-ghost-white">
            <Row className="content-center">
              <Col md="1" sm="2" lg="1" xs="2">
                <img src={buildingBlack} alt="buildingBlack" className="mr-2" width="35" height="35" />
              </Col>
              <Col md="8" sm="8" lg="8" xs="8">
                <h4 className="mb-1 mt-0">
                  Welcome to
                  {' '}
                  {detailData.visitor_company && detailData.visitor_company.name ? detailData.visitor_company.name : ''}
                </h4>
              </Col>
              <Col md="3" sm="3" lg="3" xs="3">
                <img
                  src={detailData.visitor_company && detailData.visitor_company.logo ? `data:${detectMimeType(detailData.visitor_company.logo)};base64,${detailData.visitor_company.logo}` : getExportLogo()}
                  width="140"
                  height="auto"
                  className="d-inline-block align-top pr-2"
                  alt="Helixsense Portal"
                />
              </Col>
            </Row>
          </CardBody>
          <h4 className="mb-0">
            <img src={idcardIcon} alt="actions" className="mr-2 mb-2" width="30" height="30" />
            Visitor Management
          </h4>
          <hr className="mt-0" />

          <div className="mt-2">
            <Card className="bg-lightblue mb-2">
              <CardBody className="p-3">
                <h4 className="mb-3 text-capital">
                  Hi
                  {'  '}
                  ,
                  {' '}
                  {detailData.host_name}
                  {'  '}
                  {detailData.tenant_id && detailData.tenant_id.name && (
                    <>
                      (
                      {detailData.tenant_id.name}
                      )
                    </>
                  )}
                </h4>
                <h5>Visitor Info :</h5>
                <Row>
                  <Col md="2" sm="12" lg="2" xs="12" className="text-center">
                    <Image.PreviewGroup>
                      <Image
                        width={100}
                        height={100}
                        src={detailData.photo ? `data:${detectMimeType(detailData.photo)};base64,${detailData.photo}` : imageUpload}
                      />
                    </Image.PreviewGroup>

                  </Col>
                  <Col md="10" sm="12" lg="10" xs="12">
                    <h5 className="text-capital">
                      {detailData.visitor_name}
                    </h5>
                    <p className="mb-0">
                      <img src={telephoneIcon} className="mr-2" alt="phone" width="15" height="15" />
                      {detailData.visitor_mobile}
                    </p>
                    <p className="mb-0">
                      <img src={envelopeIcon} className="mr-2" alt="mail" width="15" height="15" />
                      {detailData.visitor_email}
                    </p>
                  </Col>
                </Row>
                <hr className="mb-1 mt-1" />
                <p className="mb-0">
                  <span className="font-weight-400">Visitor Company : </span>
                  <span className="font-weight-800 ml-1 text-capital">{getDefaultNoValue(detailData.organization)}</span>
                </p>
                <p className="mb-0">
                  <span className="font-weight-400">Purpose : </span>
                  <span className="font-weight-800 ml-1">{getDefaultNoValue(detailData.purpose)}</span>
                </p>
                <p className="mb-0">
                  <span className="font-weight-400">Planned Visit Date : </span>
                  <span className="font-weight-800 ml-1">{getDefaultNoValue(getLocalTime(detailData.planned_in))}</span>
                </p>
                {detailData.id_proof && detailData.id_proof.name && (
                  <>
                    <p className="mb-0">
                      <span className="font-weight-400">ID Proof : </span>
                      <span className="font-weight-800 ml-1">
                        {getDefaultNoValue(detailData.id_proof && detailData.id_proof.name ? detailData.id_proof.name : '')}
                        {detailData.attachment && (
                        <FontAwesomeIcon
                          className="ml-2 cursor-pointer"
                          icon={faDownload}
                          onClick={() => documentDownload(detailData.attachment, `${detailData.visitor_name} ${detailData.id_proof && detailData.id_proof.name ? detailData.id_proof.name : ''}`)}
                        />
                        )}
                      </span>
                    </p>
                    <p className="mb-0">
                      <span className="font-weight-400">ID Proof Number (Last 4 digits) : </span>
                      <span className="font-weight-800 ml-1">{getDefaultNoValue(detailData.Visitor_id_details)}</span>
                    </p>
                  </>
                )}
                <hr className="mb-1 mt-1" />
                <div className="text-center mt-3 mb-3">
                  {detailData.status === 'To Approve' && (
                    <>
                      <h5 className="mb-3">Are you sure to want to approve this visit request ?</h5>
                      {(statusInfo && statusInfo.err) && (
                      <div className="text-center mt-3 mb-3">
                        <SuccessAndErrorFormat response={statusInfo} />
                      </div>
                      )}
                      {(statusInfo && statusInfo.loading) && (
                      <div className="text-center mt-4 mb-4">
                        <Loader />
                      </div>
                      )}
                      <Button
                        type="button"
                        size="md"
                        className="hoverColor btn-cancel text-dark rounded-pill mr-2"
                        onClick={() => statusUpdate('Rejected')}
                        disabled={statusInfo && statusInfo.loading}
                        onMouseLeave={() => setButtonHover(false)}
                        onMouseEnter={() => setButtonHover(true)}
                        variant="contained"
                      >
                        <span className="page-actions-header content-center">
                          <img src={isButtonHover ? closeCircleWhite : closeCircle} className="mr-2" alt="Deny" width="13" height="13" />
                          <span>Deny</span>
                        </span>
                      </Button>
                      <Button
                        type="button"
                        size="md"
                        className="rounded-pill"
                        disabled={statusInfo && statusInfo.loading}
                        onClick={() => statusUpdate('Approved')}
                        variant="contained"
                      >
                        <img src={checkWhite} className="mr-2" alt="Approve" width="13" height="13" />
                        <span>Approve</span>
                      </Button>
                    </>
                  )}
                  {detailData.status === 'Approved' && (
                    <>
                      <img src={checkGreen} className="mr-2" alt="Approved" width="40" height="40" />
                      <h4 className="text-success">
                        This visit request has
                        {'  '}
                        {statusInfo && statusInfo.data ? '' : 'already'}
                        {'  '}
                        been approved
                      </h4>
                    </>

                  )}
                  {detailData.status === 'Cancelled' && (
                  <>
                    <img src={closeCircleRed} className="mr-2" alt="Cancelled" width="40" height="40" />
                    <h4 className="text-danger">Oops! The visit request is Cancelled</h4>
                  </>
                  )}
                  {detailData.status === 'Rejected' && (
                  <>
                    <img src={closeCircleRed} className="mr-2" alt="Rejected" width="40" height="40" />
                    <h4 className="text-danger">Oops! The visit request is Rejected</h4>
                  </>
                  )}

                </div>
              </CardBody>
            </Card>
          </div>
        </>
      </Col>
      )}
      {vpConfig && vpConfig.data && !vpConfig.count && (
        <Col md={{ size: 6, offset: 3 }} sm="12" lg={{ size: 6, offset: 3 }} xs="12">
          <div className="text-center mt-3 mb-3">
            <img src={closeCircleRed} className="mr-2" alt="invalid" width="40" height="40" />
            <h4 className="text-danger">Oops! Your request is invalid</h4>
          </div>
        </Col>
      )}
      <DetailViewFormat detailResponse={vpConfig} />
    </Row>
  );
};

VisitApproval.defaultProps = {
  match: false,
  params: false,
  uuid: false,
};

VisitApproval.propTypes = {
  match: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.bool,
    PropTypes.string,
  ]),
  params: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.bool,
    PropTypes.string,
  ]),
  uuid: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.bool,
    PropTypes.string,
  ]),
};

export default VisitApproval;
