/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import {
  CardBody,
  Col,
  Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import axios from 'axios';
import {
  Box, Button,
} from '@mui/material';

import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';

import idcardIcon from '@images/icons/gatepass.svg';
import closeCircleRed from '@images/icons/closeCircleRed.svg';
import checkGreen from '@images/icons/checkGreen.svg';
import closeCircle from '@images/icons/closeCircle.svg';
import closeCircleWhite from '@images/icons/closeCircleWhite.svg';
import checkWhite from '@images/icons/checkWhite.svg';

import { getExportLogo } from '../util/getDynamicClientData';
import AuthService from '../util/authService';
import WpBasicDetails from './basicDetails/basicDetails';
import RejectWp from './basicDetails/rejectWp';
import AssetInfo from './basicDetails/assetInfo';

import { getCustomButtonName, getCustomGatePassStatusName } from '../gatePass/utils/utils';

import {
  getDefaultNoValue,
  extractNameObject,
  getAccountIdFromUrl,
} from '../util/appUtils';

const appConfig = require('../config/appConfig').default;
const appModels = require('../util/appModels').default;

const GatePassApproval = (props) => {
  const { match } = props;
  const { params } = match;
  const { suuid, ruuid } = params;
  const accid = getAccountIdFromUrl(props)
  const [isButtonHover, setButtonHover] = useState(false);
  const [vpConfig, setVpConfig] = useState({ loading: false, data: null, err: null });
  const [statusInfo, setStatusInfo] = useState({ loading: false, data: null, err: null });
  const [wpConfig, setWpConfig] = useState({ loading: false, data: null, err: null });

  const [updateStatus, setUpdateStatus] = useState('');
  const [rejectModal, setRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const WEBAPPAPIURL = `${window.location.origin === 'http://localhost:3010' ? 'http://localhost:3000' : window.location.origin}/`;

  document.title = 'HELIX SENSE | Gate Pass';

  const oneSignalDiv = document.getElementById('onesignal-bell-container');
  const stickyFooter = document.getElementById('sticky_footer');

  if (oneSignalDiv) {
    oneSignalDiv.style.display = 'none';
  }

  if (stickyFooter) {
    stickyFooter.style.display = 'none';
  }

  const authService = AuthService();
  const isAuthenticated = authService.getRefreshToken();

  useEffect(() => {
    if (ruuid && !isAuthenticated && suuid) {
      setVpConfig({
        loading: true, data: null, count: 0, err: null,
      });
      const fields = '["id","name","reference","description","state","gatepass_type","email","mobile","type","requested_on","to_be_returned_on","approved_by","approved_on","exit_on","exit_description","return_on","return_description",("requestor_id", ["id", "name","mobile","email"]),("company_id", ["id", "name"]),("space_id", ["id", "path_name", "space_name"]),("approved_by", ["id", "name"]),("exit_allowed_by", ["id", "name"]),("return_allowed_by", ["id", "name"]),["message_ids", ["id"]],["order_lines", ["id", ("asset_id", ["id", "name"]), "parts_qty"]],["asset_lines", ["id", ("asset_id", ["id", "name","model","make","equipment_seq","serial","state","brand", ("category_id", ["id", "name"]), ("location_id", ["id", "path_name"]),["space_label_ids", ["id","space_value",("space_label_id", ["id", "name"])]]]), "parts_qty", "description"]]]';
      const payload = `domain=[["uuid","=","${ruuid}"]]&model=${appModels.GATEPASS}&fields=${fields}&offset=0&limit=1&portalDomain=${window.location.origin}`;

      const config = {
        method: 'get',
        url: `${WEBAPPAPIURL}public/api/v4/search?${payload}`,
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
  }, [ruuid, isAuthenticated]);

  const detailData = vpConfig && vpConfig.data && vpConfig.data.length ? vpConfig.data[0] : '';
  const wpConfigData = wpConfig && wpConfig.data && wpConfig.data.length ? wpConfig.data[0] : '';

  useEffect(() => {
    if (detailData && detailData.company_id && detailData.company_id.id) {
      setWpConfig({
        loading: true, data: null, count: 0, err: null,
      });

      const fields = '["id","reference_display","reference","space","attachment","config_json_data"]';
      const payload = `domain=[["company_id","=",${detailData.company_id.id}]]&model=mro.gatepass_configuration&fields=${fields}&offset=0&limit=1&portalDomain=${window.location.origin}`;

      const config = {
        method: 'get',
        url: `${WEBAPPAPIURL}public/api/v4/search?${payload}`,
        headers: {
          portalDomain: window.location.origin,
          accountId: accid,
        },
      };

      axios(config)
        .then((response) => setWpConfig({
          loading: false, data: response.data.data, count: response.data.length, err: null,
        }))
        .catch((error) => {
          setWpConfig({
            loading: false, data: null, count: 0, err: error,
          });
        });
    }
  }, [vpConfig]);

  const statusUpdate = (statusValue) => {
    if (ruuid) {
      setStatusInfo({ loading: true, data: null, err: null });
      const postDataValues = {
        state: statusValue,
      };

      const data = {
        uuid: ruuid,
        values: postDataValues,
      };

      const postData = new FormData();
      postData.append('values', JSON.stringify(data.values));
      if (typeof payload === 'object') {
        Object.keys(data).map((payloadObj) => {
          if (payloadObj !== 'uuid') {
            postData.append(payloadObj, data[payloadObj]);
          }
          return postData;
        });
      }
      postData.append('uuid', data.uuid);
      const config = {
        method: 'post',
        url: `${WEBAPPAPIURL}public/api/v4/gp/updateGPStatus`,
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

  const statusRejectUpdate = (statusValue, reason) => {
    if (ruuid) {
      setStatusInfo({ loading: true, data: null, err: null });
      const postDataValues = {
        state: statusValue,
        reason,
      };

      const data = {
        uuid: ruuid,
        values: postDataValues,
      };

      const postData = new FormData();
      postData.append('values', JSON.stringify(data.values));
      if (typeof payload === 'object') {
        Object.keys(data).map((payloadObj) => {
          if (payloadObj !== 'uuid') {
            postData.append(payloadObj, data[payloadObj]);
          }
          return postData;
        });
      }
      postData.append('uuid', data.uuid);

      const config = {
        method: 'post',
        url: `${WEBAPPAPIURL}public/api/v4/gp/updateGPStatus`,
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

  const onRejectClose = () => {
    setRejectModal(false);
    setRejectReason('');
  };

  const onRejectDone = () => {
    setUpdateStatus('Rejected');
    statusRejectUpdate(detailData.state === 'Returned' ? 'Exited' : 'Rejected', rejectReason);
    setRejectModal(false);
  };

  const loading = (statusInfo && statusInfo.loading);

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        backgroundColor: '#F6F8FA',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10%',
        fontFamily: 'Suisse Intl',
      }}
    >
      <Row className="ml-1 mr-1 external-link-tickets mt-2 mb-2 p-3">
        {vpConfig && vpConfig.data && vpConfig.count > 0 && detailData && (detailData.state === 'Created' || detailData.state === 'Returned') && (
          <Col md={{ size: 6, offset: 3 }} sm="12" lg={{ size: 6, offset: 3 }} xs="12">
            <>
              <CardBody className="p-2 mb-3 bg-ghost-white">
                <Row className="content-center">
                  <Col md="1" sm="2" lg="1" xs="2">
                    <img src={idcardIcon} alt="buildingBlack" className="mr-2" width="35" height="35" />
                  </Col>
                  <Col md="8" sm="8" lg="8" xs="8">
                    <h5 className="mb-1 mt-0">
                      {getDefaultNoValue(extractNameObject(detailData.company_id, 'name'))}
                      -
                      Gate Pass
                    </h5>
                  </Col>
                  <Col className="pr-3 pl-0" md="2" sm="2" lg="2" xs="2">
                    <img
                      src={getExportLogo()}
                      width="140"
                      height="auto"
                      className="d-inline-block align-top pr-2"
                      alt="Helixsense Portal"
                    />
                  </Col>
                </Row>
              </CardBody>
              <div className="text-center mt-2 mb-2">
                <div className="text-center mt-1 mb-1">
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
                  {statusInfo && statusInfo.data && (
                    <>
                      <img src={checkGreen} className="mr-2" alt="Approved" width="30" height="30" />
                      <h5 className="text-success">
                        This Gate Pass has
                        {'  '}
                        been
                        {' '}
                        {getCustomGatePassStatusName(updateStatus, wpConfigData)}
                      </h5>
                    </>
                  )}
                </div>
                {!loading && (statusInfo && !statusInfo.data) && (
                  <>
                    <Button
                      className="rounded-pill mr-2"
                      onClick={() => { setRejectReason(''); setRejectModal(true); }}
                      disabled={statusInfo && statusInfo.loading}
                      onMouseLeave={() => setButtonHover(false)}
                      onMouseEnter={() => setButtonHover(true)}
                      variant="contained"
                    >
                      <span className="page-actions-header content-center">
                        <img src={closeCircleWhite} className="mr-2" alt="Deny" width="13" height="13" />
                        <span>{getCustomButtonName(detailData.state === 'Returned' ? 'Return Reject' : 'Reject', wpConfigData)}</span>
                      </span>
                    </Button>
                    <Button
                      className="rounded-pill"
                      disabled={(statusInfo && statusInfo.loading)}
                      onClick={() => { setUpdateStatus(detailData.state === 'Returned' ? 'Return Approved' : 'Approved'); statusUpdate(detailData.state === 'Returned' ? 'Return Approved' : 'Approved'); }}
                      variant="contained"
                    >
                      <img src={checkWhite} className="mr-2" alt="Approved" width="13" height="13" />
                      <span>{getCustomButtonName(detailData.state === 'Returned' ? 'Return Approval' : 'Approve', wpConfigData)}</span>
                    </Button>
                    <div className="text-grey font-tiny mt-3" />
                  </>
                )}
              </div>
              <hr className="mt-0" />
              <div className="mt-2">
                <WpBasicDetails detailData={vpConfig} />
                {rejectModal && (detailData.state === 'Created' || detailData.state === 'Returned') && (
                  <RejectWp
                    detailData={detailData}
                    wpConfigData={wpConfigData}
                    isReturnReject={detailData.state === 'Returned'}
                    atReject={() => onRejectClose()}
                    atDone={() => onRejectDone()}
                    setMessage={setRejectReason}
                  />
                )}
              </div>
              <hr className="mb-1 mt-1" />
              <AssetInfo
                detailData={vpConfig}
                ruuid={ruuid}
                updateStatus={updateStatus}
              />
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
        {vpConfig && vpConfig.data && vpConfig.count > 0 && detailData && detailData.state !== 'Created' && detailData.state !== 'Returned' && (
          <Col md={{ size: 6, offset: 3 }} sm="12" lg={{ size: 6, offset: 3 }} xs="12">
            <div className="text-center mt-3 mb-3">
              <img src={closeCircleRed} className="mr-2" alt="invalid" width="40" height="40" />
              <h4 className="text-danger">
                Oops! Your request is
                {' '}
                {getCustomGatePassStatusName(detailData.state, wpConfigData)}
              </h4>
            </div>
          </Col>
        )}
        {(vpConfig && vpConfig.loading) && (
          <Col md={{ size: 6, offset: 3 }} sm="12" lg={{ size: 6, offset: 3 }} xs="12">
            <div className="text-center mt-4 mb-4">
              <Loader />
            </div>
          </Col>
        )}
        {vpConfig && vpConfig.err && !vpConfig.count && (
          <Col md={{ size: 6, offset: 3 }} sm="12" lg={{ size: 6, offset: 3 }} xs="12">
            <div className="text-center mt-3 mb-3">
              <img src={closeCircleRed} className="mr-2" alt="invalid" width="40" height="40" />
              <h4 className="text-danger">Oops! Your request is invalid</h4>
            </div>
          </Col>
        )}
      </Row>
    </Box>
  );
};

GatePassApproval.defaultProps = {
  match: false,
  params: false,
  suuid: false,
  ruuid: false,
};

GatePassApproval.propTypes = {
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
  suuid: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.bool,
    PropTypes.string,
  ]),
  ruuid: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.bool,
    PropTypes.string,
  ]),
};

export default GatePassApproval;
