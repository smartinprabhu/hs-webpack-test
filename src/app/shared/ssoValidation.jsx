/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-console */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import {
  CardBody,
  Col,
  Row,
  Spinner,
} from 'reactstrap';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import {
  Button,
} from '@mui/material';
import { useHistory } from 'react-router-dom';
import MicrosoftLogin from 'react-microsoft-login';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

import DetailViewFormat from '@shared/detailViewFormat';
import closeCircleRed from '@images/icons/closeCircleRed.svg';
import oktaLogo from '@images/oktaLogin.png';
import microSoftLogo from '@images/microsoft.svg';
import buildingBlack from '@images/icons/buildingBlack.svg';

import AuthService from '../util/authService';
import {
  detectMob, detectMimeType,
} from '../util/appUtils';
import { storeSSOToken } from '../helpdesk/ticketService';
import { LoginButtonsClass } from '../themes/theme';

const appConfig = require('../config/appConfig').default;

const SSOValidation = ({
  accid, setApprove, opLogo, companyName, companyLogo, title, description,
}) => {
  const [accountConfig, setAccountConfig] = useState({ loading: false, data: null, err: null });
  const [microsoftLoginData, setMicrosoftLoginData] = useState({ loading: false, data: null, err: null });
  const [oktaLoginData, setOktaLoginData] = useState({ loading: false, data: null, err: null });

  const WEBAPPAPIURL = `${window.location.origin === 'http://localhost:3010' ? 'http://localhost:3000' : window.location.origin}/`;

  const [endpoints, setEndpoints] = useState(false);
  const [oktaEnds, setOktaEnds] = useState(false);
  const [timeLoading, setTimeLoading] = useState(false);
  const [msData, setMsData] = useState(false);
  const [msToken, setMsToken] = useState(false);
  const [msLogin, setMsLogin] = useState(false);

  const history = useHistory();

  const authService = AuthService();
  const isAuthenticated = authService.getRefreshToken();
  const dispatch = useDispatch();
  const isMobileView = detectMob();

  useEffect(() => {
    if (accid && !isAuthenticated) {
      setAccountConfig({
        loading: true, data: null, count: 0, err: null,
      });
      const config = {
        method: 'get',
        url: `${WEBAPPAPIURL}api/authProviders/getByAccountId?account_id=${accid}`,
        headers: {
          portalDomain: window.location.origin,
        },
      };
      axios(config)
        .then((response) => setAccountConfig({
          loading: false, data: response.data.data, count: response.data && response.data.data ? 1 : 0, err: null,
        }))
        .catch((error) => {
          setAccountConfig({
            loading: false, data: null, count: 0, err: error,
          });
        });
    }
    window.localStorage.removeItem('issuer');
    window.localStorage.removeItem('redirect_uri');
    window.localStorage.removeItem('okta_client_id');
    window.localStorage.removeItem('api-url');
    window.localStorage.removeItem('okta-redirect-src');
    dispatch(storeSSOToken({}));
  }, [accid, isAuthenticated]);

  useEffect(() => {
    if (accountConfig && accountConfig.data && accountConfig.data.endpoints && accountConfig.data.endpoints.length) {
      setEndpoints(accountConfig.data.endpoints);
      const oktaLoginEndpoint = accountConfig.data.endpoints.find((data) => data.type === 'Okta');
      if (oktaLoginEndpoint) {
        authService.setOktaCredentials(oktaLoginEndpoint);
      }
    }
  }, [accountConfig]);

  useEffect(() => {
    if (accountConfig && accountConfig.data && accountConfig.data.endpoints && accountConfig.data.endpoints.length && window.localStorage.getItem('okta-response')) {
      const octaResp = window.localStorage.getItem('okta-response');
      setOktaLoginData({
        loading: false, data: octaResp.data ? octaResp.data : null, err: octaResp.err ? octaResp.err : null,
      });
      if (octaResp && octaResp.data) {
        dispatch(storeSSOToken(octaResp.data));
        setTimeLoading(true);
        setTimeout(() => {
          setApprove(true);
          setTimeLoading(false);
        }, 1500);
      }
      window.localStorage.removeItem('issuer');
      window.localStorage.removeItem('redirect_uri');
      window.localStorage.removeItem('okta_client_id');
      window.localStorage.removeItem('api-url');
      window.localStorage.removeItem('okta-redirect-src');
      window.localStorage.removeItem('okta-response');
    }
  }, [accountConfig, window.localStorage.getItem('okta-response')]);

  const onMSLogin = (tokenObj, credentials) => {
    if (tokenObj && credentials) {
      setMsLogin(false);
      const data = new FormData();
      data.append('token', tokenObj.accessToken);
      data.append('client_id', credentials.clientId);
      const config = {
        method: 'POST',
        url: `${WEBAPPAPIURL}api/auth_oauth/get_access_token`,
        data,
        withCredentials: true,
        headers: { endpoint: accountConfig && accountConfig.data && accountConfig.data.endpoint },
      };
      window.localStorage.removeItem('issuer');
      window.localStorage.removeItem('redirect_uri');
      window.localStorage.removeItem('okta_client_id');
      window.localStorage.removeItem('api-url');
      window.localStorage.removeItem('okta-redirect-src');
      window.localStorage.removeItem('okta-response');
      setOktaLoginData({
        loading: false, data: null, err: null,
      });
      setMicrosoftLoginData({
        loading: true, data: null, err: null,
      });
      axios(config)
        .then((response) => {
          setMicrosoftLoginData({
            loading: false, data: response.data, err: null,
          });
          const tokenData = { tokens: tokenObj, client: credentials, msResponse: response.data };
          dispatch(storeSSOToken(tokenData));
          setTimeLoading(true);
          setTimeout(() => {
            setApprove(true);
            setTimeLoading(false);
          }, 1500);
        })
        .catch((error) => {
          dispatch(storeSSOToken({}));
          setMicrosoftLoginData({
            loading: false, data: null, err: error,
          });
          window.localStorage.removeItem('issuer');
          window.localStorage.removeItem('redirect_uri');
          window.localStorage.removeItem('okta_client_id');
          window.localStorage.removeItem('api-url');
          window.localStorage.removeItem('okta-redirect-src');
          window.localStorage.removeItem('okta-response');
        });
    } else {
      setOktaLoginData({
        loading: false, data: null, err: null,
      });
      dispatch(storeSSOToken({}));
      window.localStorage.removeItem('issuer');
      window.localStorage.removeItem('redirect_uri');
      window.localStorage.removeItem('okta_client_id');
      window.localStorage.removeItem('api-url');
      window.localStorage.removeItem('okta-redirect-src');
      window.localStorage.removeItem('okta-response');
      setMsLogin(true);
    }
  };

  const onOktaLogin = () => {
    setMicrosoftLoginData({
      loading: false, data: null, err: false,
    });
    setMsLogin(false);
    setOktaLoginData({
      loading: true, data: null, err: false,
    });
    dispatch(storeSSOToken({}));
    window.localStorage.setItem('api-url', accountConfig && accountConfig.data && accountConfig.data.endpoint);
    window.localStorage.setItem('okta-redirect-src', `${window.location.pathname}${window.location.search}`);
    history.push(`${window.location.pathname}${window.location.search}`);
    history.push({ pathname: '/okta-hosted-login' });
    window.location.reload();
  };

  useEffect(() => {
    if (msToken && msLogin && msData) {
      onMSLogin(msData, msToken);
    }
  }, [msData, msToken]);

  const loginHandler = (err, data, msal) => {
    if (err) {
      console.log('Microsoft Login Error:', err);
      return;
    }

    if (!data || !msal) return;

    if (microsoftLoginData && (microsoftLoginData.err || microsoftLoginData.loading || microsoftLoginData.data)) return;

    setMsToken((prevToken) => prevToken || msal);
    setMsData((prevData) => prevData || data);
  };

  function getErrorMessage(msError, oktaError) {
    let res = '';
    if (msError && msError.data && msError.data.message) {
      res = msError.data.message;
    } else if (oktaError && oktaError.message) {
      res = oktaError.message;
    }
    return res;
  }

  const setSequence = (menuList) => menuList.sort((a, b) => a.sequence - b.sequence);

  return (
    <>
      {accountConfig && accountConfig.data && accountConfig.count > 0 && (
      <Col md={{ size: 6, offset: 3 }} sm="12" lg={{ size: 6, offset: 3 }} xs="12" className={isMobileView ? 'pl-0' : ''}>

        <CardBody className={isMobileView ? 'p-2 mb-1' : 'p-2 mb-3'}>
          <Row className="content-center">
            <Col md="1" sm="2" lg="1" xs="2">
              <img src={buildingBlack} alt="buildingBlack" className="mr-2" width="35" height="35" />
            </Col>
            <Col md="8" sm="7" lg="8" xs="7">
              <h4 className="mb-1 mt-0 font-family-tab">
                {companyName}
              </h4>
            </Col>
            <Col md="2" sm="3" lg="2" xs="3">
              {companyLogo && (
              <img
                src={`data:${detectMimeType(companyLogo)};base64,${companyLogo}`}
                width="70"
                height="auto"
                className="d-inline-block align-top pr-2 imaget-custom-responsive"
                alt="Helixsense Portal"
              />
              )}
            </Col>
          </Row>
          <hr />
          <Row className="content-center">
            <Col md="1" sm="1" lg="1" xs="1">
              <img src={opLogo} alt="checklistSurvey" className="mr-1" width={isMobileView ? '25' : '30'} height="auto" />
            </Col>
            <Col md="11" sm="10" lg="11" xs="10">
              {isMobileView
                ? (
                  <h6 className="mb-0 mt-1 font-family-tab text-break">
                    {title}
                  </h6>
                )
                : (
                  <h5 className="mb-0 font-family-tab">
                    {title}
                  </h5>
                )}
              <p className="text-muted font-family-tab mt-0 mb-0 font-weight-400">
                {description}
              </p>
            </Col>
          </Row>
          <hr />
          {microsoftLoginData && oktaLoginData && (microsoftLoginData.data || oktaLoginData.data) && (
            <Stack>
              <Alert severity="success" sx={{ justifyContent: 'center' }}>
                <p className="font-family-tab mb-0 font-weight-800">Login Completed Successfully.</p>
                {timeLoading && (
                <p className="font-family-tab mb-0 fon-tiny">
                  Redirecting, Please wait...
                  <Spinner size="sm" color="dark" />
                </p>
                )}
              </Alert>
            </Stack>
          )}
          {microsoftLoginData && oktaLoginData && (microsoftLoginData.err || oktaLoginData.err) && (
          <Stack>
            <Alert severity="error" sx={{ justifyContent: 'center' }}>
              <p className="font-family-tab mb-0 font-weight-800">Login Failed,Please Try again.</p>
              <p className="font-family-tab mb-0 font-weight-800">{getErrorMessage(microsoftLoginData.err, oktaLoginData.err)}</p>
            </Alert>
          </Stack>
          )}

          {(microsoftLoginData.loading || oktaLoginData.loading) ? (
            <div className="text-center mt-2">
              <Spinner color="dark" />
              <div className="m-2 mb-2 font-family-tab">Authorizing, please wait.. </div>
            </div>
          )
            : ''}
          <Row className="content-center mt-3">
            <Col md="3" sm="12" lg="3" xs="12" />
            <Col md="6" sm="12" lg="6" xs="12">
              {endpoints && endpoints.length && setSequence(endpoints).map((endpoint) => (
                <>
                  {endpoint.type === 'Okta' && microsoftLoginData && !microsoftLoginData.data && oktaLoginData && !oktaLoginData.data ? (
                    <>
                      <Button
                  // onClick={() => { redirectToOktaLogin(); }}
                        className="mt-2"
                        sx={LoginButtonsClass({
                          width: '100%',
                          height: '40px',
                          borderRadius: '4px',
                          color: '#ffffff',
                          textTransform: 'capitalize',
                          fontSize: '17px',
                          fontFamily: 'Suisse Intl',
                        })}
                        disabled={microsoftLoginData.loading || oktaLoginData.loading}
                        onClick={() => onOktaLogin()}
                      >
                        <img
                          src={oktaLogo}
                          width="15"
                          className="mr-2 mb-1"
                          alt="Helixsense Portal"
                        />
                        Login with OKTA
                      </Button>

                    </>
                  ) : ''}
                  {endpoint.type === 'Microsoft' ? (
                    <>
                      {endpoint.client_id && microsoftLoginData && !microsoftLoginData.data && oktaLoginData && !oktaLoginData.data && (
                      <div className="text-center light-text mt-2">
                        <MicrosoftLogin
                          className="text-center"
                          buttonTheme="light"
                          clientId={endpoint.client_id}
                          authCallback={loginHandler}
                          redirectUri={endpoint.web_redirect_uri}
                          tenantUrl={endpoint.auth_endpoint || appConfig.AUTH_ENDPOINT}
                        >
                          <Button
                            sx={LoginButtonsClass({
                              width: '100%',
                              height: '40px',
                              borderRadius: '4px',
                              color: '#ffffff',
                              textTransform: 'capitalize',
                              fontSize: '17px',
                              fontFamily: 'Suisse Intl',
                            })}
                            disabled={microsoftLoginData.loading || oktaLoginData.loading}
                            onClick={() => onMSLogin(msData || '', msToken || '')}
                          >
                            <img
                              aria-hidden="true"
                              src={microSoftLogo}
                              width="15"
                              height="15"
                              className="mr-2 mb-1"
                              alt="Microsoft Login"
                            />
                            Login with Microsoft
                          </Button>
                        </MicrosoftLogin>
                      </div>
                      )}
                    </>
                  ) : ''}
                </>
              ))}
            </Col>
            <Col md="3" sm="12" lg="3" xs="12" />

            <Stack>
              <Alert severity="info" sx={{ marginTop: '10px' }}>

                <p className="font-family-tab mb-0">

                  <b>INSTRUCTION:</b>
                  {' '}
                  To continue with Company / Microsoft AD Login, enable pop-ups in your mobile or web browser settings.
                  <br />
                  <br />
                  <b>How to enable pop-ups:</b>
                  <br />
                  - Safari (iOS): Settings &gt; Safari &gt; Block Pop-ups &gt; Turn Off
                  <br />
                  - Chrome (Android/iOS): Settings &gt; Site Settings &gt; Pop-ups and redirects &gt; Allow
                  <br />
                  - Edge (Android/iOS): Settings &gt; Cookies and site permissions &gt; Pop-ups and redirects &gt; Allow
                  <br />
                  <br />
                  <b>If pop-ups are blocked, the login window may not appear.</b>
                  <br />
                  <br />
                  <b>To avoid multiple clicks during login:</b>
                  <br />
                  - Please disable "Prevent Cross-Site Tracking“ on IOS device
                  <br />
                  - Safari (iOS): Go to Settings &gt; Safari &gt; Privacy & Security, then turn off "Prevent Cross-Site Tracking."
                </p>

              </Alert>
            </Stack>
          </Row>
        </CardBody>
      </Col>
      )}
      {accountConfig && accountConfig.data && !accountConfig.count && (
      <Col md={{ size: 6, offset: 3 }} sm="12" lg={{ size: 6, offset: 3 }} xs="12">
        <div className="text-center mt-3 mb-3">
          <img src={closeCircleRed} className="mr-2" alt="invalid" width="40" height="40" />
          <h4 className="text-danger">Oops! Your request is invalid</h4>
        </div>
      </Col>
      )}

      {((accountConfig && accountConfig.loading) || (accountConfig && accountConfig.err)) && (
      <DetailViewFormat detailResponse={accountConfig} />
      )}
    </>
  );
};

export default SSOValidation;
