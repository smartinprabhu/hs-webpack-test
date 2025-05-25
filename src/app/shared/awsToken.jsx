import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

import SuccessAndErrorFormat from '@shared/successAndErrorFormatMui';
import Loader from '@shared/loading';

import { awsLogin } from '../auth/auth';
import { decodeJWTToken, getAccountId } from '../util/appUtils';
import {
  accountIdLogIn, accountIdLoginSuccess, accountIdLoginFailure,
} from '../auth/authActions';

const WEBAPPAPIURL = `${window.location.origin === 'http://localhost:3010' ? 'http://localhost:3000' : window.location.origin}/`;

const fetchAccessToken = async (code, tokenEndpoint, clientId, clientSecret, setLoading, setError) => {
  setLoading(true);
  setError(null); // Reset error before fetching

  // const tokenEndpoint = localStorage.getItem('aws_token_endpoint');
  // const clientId = localStorage.getItem('aws_client_id');
  // const clientSecret = localStorage.getItem('aws_client_secret');
  const redirectUri = `${window.location.origin}/aws/callback`;

  // const CODE_VERIFIER_KEY = 'pkce_code_verifier';
  // const codeVerifier = localStorage.getItem(CODE_VERIFIER_KEY);

  const getTokenHeaders = () => {
    const tokenHeaders = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    if (clientSecret) {
      tokenHeaders.tokenurl = tokenEndpoint;
    }

    return tokenHeaders;
  };

  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('client_id', clientId);
  params.append('client_secret', clientSecret);
  params.append('redirect_uri', redirectUri);

  try {
    const response = await axios.post(`${WEBAPPAPIURL}aws/getToken`, params, {
      headers: getTokenHeaders(),
      withCredentials: true,
    });

    const { data } = response;
    return data.access_token;
  } catch (error) {
    const errorMessage = error.response
      ? `Token exchange failed: ${error.response.status} - ${error.response.data}`
      : `Erro: ${error.message}`;
    setError(errorMessage);
    return null;
  } finally {
    setLoading(false);
  }
};

const CodeExchange = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const awsLoginData = useSelector((state) => state.auth.awsLogin);
  const accountIdLoginInfo = useSelector((state) => state.auth.accountIdLoginInfo);

  const getAccountDetails = (accountId) => {
    const config = {
      method: 'get',
      url: `${WEBAPPAPIURL}api/authProviders/getByAccountId?account_id=${accountId}`,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    dispatch(accountIdLogIn());
    axios(config)
      .then((response) => {
        dispatch(accountIdLoginSuccess(response));
      }).catch((errors) => {
        dispatch(accountIdLoginFailure(errors));
      });
  };

  const clearOIDCData = () => {
    Object.keys(localStorage).forEach((key) => {
      if (key.includes('oidc')) {
        localStorage.removeItem(key);
        console.log(`Removed: ${key}`);
      }
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      const accountId = await getAccountId();
      getAccountDetails(accountId);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code && accountIdLoginInfo && accountIdLoginInfo.data && accountIdLoginInfo.data.data) {
      const awsLoginEndpoint = accountIdLoginInfo.data.data.endpoints.find((data) => data.type === 'AWS OpenID');
      fetchAccessToken(code, awsLoginEndpoint.token_endpoint, awsLoginEndpoint.client_id, awsLoginEndpoint.client_secret, setLoading, setError).then((token) => {
        if (token) {
          setAccessToken(token);
          clearOIDCData();
          const tokenData = decodeJWTToken(token);
          dispatch(awsLogin({ token, client_id: tokenData && tokenData.client_id ? tokenData.client_id : awsLoginEndpoint.client_id }));
        }
      });
    }
  }, [accountIdLoginInfo]);

  return (
    <div>
      {!accessToken && (accountIdLoginInfo.loading || loading) ? (
        <div className="p-5 mt-3 text-center">
          <Loader />
          <p>Authorizing...</p>
        </div>
      ) : !accessToken && error && (
        <SuccessAndErrorFormat staticErrorMsg={error} />
      )}
      {accessToken && awsLoginData && awsLoginData.loading && (
        <div className="p-5 mt-3 text-center">
          <Loader />
          <p>Signing in..</p>
        </div>
      )}
      {accessToken && awsLoginData && !awsLoginData.loading && awsLoginData.err && (
      <SuccessAndErrorFormat staticErrorMessage="Unable to login" />
      )}
      {accessToken && awsLoginData && !awsLoginData.loading && awsLoginData.data && (
      <SuccessAndErrorFormat staticSuccessMessage="Signed in Successfully,Redirecting..." />
      )}
    </div>
  );
};

export default CodeExchange;
