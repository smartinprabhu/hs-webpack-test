/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import * as PropTypes from 'prop-types';
import axios from 'axios';
import { Redirect } from 'react-router-dom';



import { getTabName } from '../util/getDynamicClientData';
import AuthService from '../util/authService';
import AccountIdLogin from '../auth/accountIdLogin';
import {
  getAccountIdFromUrl,
} from '../util/appUtils';

const appConfig = require('../config/appConfig').default;

const ExternalApproval = (props) => {
  const { match } = props;
  const { params } = match;
  const { uuid } = params;
  const accid = getAccountIdFromUrl(props);
  const [vpConfig, setVpConfig] = useState({ loading: false, data: null, err: null });
  const [statusInfo, setStatusInfo] = useState({ loading: false, data: null, err: null });
  const WEBAPPAPIURL = `${window.location.origin}/`;

  document.title = `${getTabName()} ${window.location.pathname.replace('/', '| ')}`;

  const authService = AuthService();
  const isAuthenticated = authService.getRefreshToken();

  const fields = '["id","name","state","incident_on",("company_id", ["id", "name"]),("category_id", ["id", "name"]),("sub_category_id", ["id", "name"]),("severity_id", ["id", "name"])]';

  useEffect(() => {
    if (uuid && !isAuthenticated) {
      setVpConfig({
        loading: true, data: null, count: 0, err: null,
      });
      const payload = `domain=[["uuid","=","${uuid}"]]&model=hx.incident&fields=${fields}&offset=0&limit=1&portalDomain=${window.location.origin}`;

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
  }, [uuid, isAuthenticated]);

  useEffect(() => {
    if (statusInfo && statusInfo.data && uuid) {
      setVpConfig({
        loading: true, data: null, count: 0, err: null,
      });
      const payload = `domain=[["uuid","=","${uuid}"]]&model=hx.incident&fields=${fields}&offset=0&limit=1&portalDomain=${window.location.origin}`;

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
  }, [statusInfo]);

  const statusUpdate = (statusValue) => {
    if (uuid) {
      setStatusInfo({ loading: true, data: null, err: null });
      const data = {
        uuid,
        values: { state: statusValue },
      };

      const postData = new FormData();
      if (data && data.values) {
        postData.append('values', JSON.stringify(data.values));
      }
      if (data && data.uuid) {
        postData.append('uuid', data.uuid);
      }

      const config = {
        method: 'post',
        url: `${WEBAPPAPIURL}public/api/v4/inc/updateINStatus`,
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

  const detailData = vpConfig && vpConfig.data && vpConfig.data.length ? vpConfig.data[0] : '';

  if (isAuthenticated && uuid) {
    return (
      <Redirect to={{
        pathname: `/hx-incidents/${uuid}`,
        state: { referrer: 'view-request', uuid },
      }}
      />
    );
  }

  return (
    <>
      <AccountIdLogin redirectLink={`/hx-incidents/${uuid}`} />

      { /* <Row className="ml-1 mr-1 external-link-tickets mt-2 mb-2 p-3">
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
                  {detailData.company_id && detailData.company_id.name ? detailData.company_id.name : ''}
                </h4>
              </Col>
              <Col md="3" sm="3" lg="3" xs="3">
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
          <h4 className="mb-0">
            <img src={idcardIcon} alt="actions" className="mr-2 mb-2" width="30" height="30" />
            Incidnt Management
          </h4>
          <hr className="mt-0" />

          <div className="mt-2">
            <Card className="bg-lightblue mb-2">
              <CardBody className="p-3">
                <h5>Incident Info :</h5>
                <hr className="mb-1 mt-1" />
                <p className="mb-0">
                  <span className="font-weight-400">Subject : </span>
                  <span className="font-weight-800 ml-1 text-capital">{getDefaultNoValue(detailData.name)}</span>
                </p>
                <p className="mb-0">
                  <span className="font-weight-400">Category : </span>
                  <span className="font-weight-800 ml-1">{getDefaultNoValue(extractNameObject(detailData.category_id, 'name'))}</span>
                </p>
                <p className="mb-0">
                  <span className="font-weight-400">Sub Category : </span>
                  <span className="font-weight-800 ml-1">{getDefaultNoValue(extractNameObject(detailData.sub_category_id, 'name'))}</span>
                </p>
                <p className="mb-0">
                  <span className="font-weight-400">Severity : </span>
                  <span className="font-weight-800 ml-1">{getDefaultNoValue(extractNameObject(detailData.severity_id, 'name'))}</span>
                </p>
                <p className="mb-0">
                  <span className="font-weight-400">Incident On : </span>
                  <span className="font-weight-800 ml-1">{getDefaultNoValue(getLocalTime(detailData.incident_on))}</span>
                </p>
                <hr className="mb-1 mt-1" />
                <div className="text-center mt-3 mb-3">
                  {detailData.state === 'Reported' && (
                    <>
                      <h5 className="mb-3">Are you sure to want to acknowledge this incident ?</h5>
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
                        onClick={() => statusUpdate('Cancelled')}
                        disabled={statusInfo && statusInfo.loading}
                        onMouseLeave={() => setButtonHover(false)}
                        onMouseEnter={() => setButtonHover(true)}
                        color="danger"
                      >
                        <span className="page-actions-header content-center">
                          <img src={isButtonHover ? closeCircleWhite : closeCircle} className="mr-2" alt="Deny" width="13" height="13" />
                          <span>Cancel</span>
                        </span>
                      </Button>
                      <Button
                        type="button"
                        size="md"
                        className="rounded-pill"
                        disabled={statusInfo && statusInfo.loading}
                        onClick={() => statusUpdate('Acknowledged')}
                         variant="contained"
                      >
                        <img src={checkWhite} className="mr-2" alt="Approve" width="13" height="13" />
                        <span>Acknowledge</span>
                      </Button>
                    </>
                  )}
                  {detailData.state === 'Acknowledged' && (
                    <>
                      <img src={checkGreen} className="mr-2" alt="Approved" width="40" height="40" />
                      <h4 className="text-success">
                        This incident has
                        {'  '}
                        {statusInfo && statusInfo.data ? '' : 'already'}
                        {'  '}
                        been acknowledged
                      </h4>
                    </>

                  )}
                  {detailData.state !== 'Acknowledged' && detailData.state !== 'Reported' && (
                  <>
                    <img src={closeCircleRed} className="mr-2" alt="Cancelled" width="40" height="40" />
                    <h4 className="text-danger">
                      Oops! The incident is
                      {' '}
                      {detailData.state}
                    </h4>
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
      </Row> */ }
    </>
  );
};

ExternalApproval.defaultProps = {
  match: false,
  params: false,
  uuid: false,
};

ExternalApproval.propTypes = {
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

export default ExternalApproval;
