import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { OktaAuth } from '@okta/okta-auth-js';
import {
  Spinner,
} from 'reactstrap';

import {
  oktaLogin,
} from '../auth/auth';

import {
  oktaLoginFailure,
} from '../auth/authActions';

const OktaLoginResponse = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const oktaLoginData = useSelector((state) => state.auth.oktaLogin);
  const loginData = useSelector((state) => state.auth.login);

  const [oktaAuth, setOktaAuth] = useState(false);

  const isExternalLink = window.localStorage.getItem('okta-redirect-src') && window.localStorage.getItem('okta-redirect-src') !== 'home';

  let oktaLoginLoading;
  let oktaError;

  useEffect(() => {
    if (window.localStorage.getItem('issuer') && window.localStorage.getItem('okta_client_id') && window.localStorage.getItem('redirect_uri')) {
      oktaLoginLoading = true;
      const oktaConfigData = {
        issuer: window.localStorage.getItem('issuer'),
        clientId: window.localStorage.getItem('okta_client_id'),
        redirectUri: window.localStorage.getItem('redirect_uri'),
        pkce: true,
        scopes: ['openid', 'profile', 'email'],
        disableHttpsCheck: false,
      };

      setOktaAuth(new OktaAuth(oktaConfigData));
    }
  }, [window.localStorage.getItem('issuer')]);

  const getOktaResponse = async () => {
    if (!oktaAuth) {
      throw new Error('OktaAuth instance is not available.');
    }
    return oktaAuth.token.parseFromUrl(); // Directly return the promise
  };

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const oktaResp = await oktaAuth.token.parseFromUrl();
        // oktaLoginLoading = false;

        if (isExternalLink) {
          window.localStorage.setItem('okta-response', { data: oktaResp, err: null });
          history.push(window.localStorage.getItem('okta-redirect-src'));
          window.localStorage.removeItem('okta-redirect-src');
          window.location.reload();
        } else {
          dispatch(oktaLogin(oktaResp));
        }
        // history.push('/');
      } catch (error) {
        oktaLoginLoading = false;
        oktaError = error.message;
        dispatch(oktaLoginFailure(error));
        if (isExternalLink) {
          window.localStorage.setItem('okta-response', { data: null, err: error.message });
          history.push(window.localStorage.getItem('okta-redirect-src'));
          window.localStorage.removeItem('okta-redirect-src');
          window.location.reload();
        }
        console.error('Authentication error:', error.message);
        // Handle error (e.g., set error state, display error message)
      }
    };
    if (oktaAuth && getOktaResponse) {
      handleAuth();
    }
  }, [oktaAuth]);

  useEffect(() => {
    if (loginData && oktaAuth && loginData && loginData.err) {
      if (isExternalLink) {
        setTimeout(() => {
          history.push(window.localStorage.getItem('okta-redirect-src'));
          window.localStorage.removeItem('okta-redirect-src');
        }, 1000);
      } else {
        setTimeout(() => {
          history.push('/');
        }, 1000);
      }
    }
  }, [loginData]);

  return (
    <div className="text-center m-4">
      {(oktaLoginLoading && !oktaError && !(loginData && loginData.err) && !(oktaLoginData && oktaLoginData.loading)) ? (
        <div className="text-center">
          <Spinner color="dark" />
          <div className="m-2 mb-2">Authorizing, please wait.. </div>
        </div>
      )
        : ''}
      {(oktaAuth && oktaLoginData && oktaLoginData.loading && !oktaError && !(loginData && loginData.err)) ? (
        <div className="text-center">
          <Spinner color="dark" />
          <div className="m-2 mb-2">Logging in, please wait.. </div>
        </div>
      )
        : ''}
      {oktaError ? (
        <div className="text-center">
          <div className="m-2 mb-2">{oktaError}</div>
        </div>
      )
        : ''}
      {loginData && loginData.err ? (
        <div className="text-center">
          <div className="m-2 mb-2">{loginData.err.data && loginData.err.data.message ? loginData.err.data.message : loginData.err.message ? loginData.err.message : 'Something went wrong..'}</div>
        </div>
      )
        : ''}
    </div>
  );
};

export default OktaLoginResponse;
