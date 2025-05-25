/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable default-case */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/button-has-type */
import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import axios from 'axios';

import { LoginButtonsClass } from '../themes/theme';

const DynamicOidcLogin = ({ endpoint, disableOkta }) => {
  const [authUrl, setAuthUrl] = useState(null);
  const [ssoClick, setSSOClick] = useState(false);

  const CODE_VERIFIER_KEY = 'pkce_code_verifier';

  const redirectUri = `${window.location.origin}/aws/callback`;

  const generateCodeVerifier = () => {
    const array = new Uint8Array(40);
    window.crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  };

  const generateCodeChallenge = async (verifier) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  };

  const setCodeVerifier = (codeVerifier) => {
    if (codeVerifier) {
      const data = new FormData();
      data.append('code_verifier', codeVerifier);

      const config = {
        method: 'post',
        url: `${window.location.origin === 'http://localhost:3010' ? 'http://localhost:3000' : window.location.origin}/saveAwsCode`,
        data,
        withCredentials: true,
      };
      axios(config)
        .then((response) => {
          if (response) {
            // console.log(response);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  useEffect(() => {
    if (endpoint && endpoint.auth_endpoint) {
      const setupPKCE = async () => {
        const codeVerifier = generateCodeVerifier();
        // localStorage.setItem(CODE_VERIFIER_KEY, codeVerifier);
        await setCodeVerifier(codeVerifier);
        const codeChallenge = await generateCodeChallenge(codeVerifier);

        const tokenAuth = endpoint.auth_endpoint;
        const clientId = endpoint.client_id;

        const { scope } = endpoint;
        const responseType = endpoint.return_type;
        const CCM = 'S256';

        const authUrl1 = `${tokenAuth}?client_id=${clientId}&response_type=${responseType}&scope=${scope}&redirect_uri=${redirectUri}&code_challenge=${codeChallenge}&code_challenge_method=${CCM}`;
        setAuthUrl(authUrl1);
      };
      setupPKCE();
    }
  }, [endpoint]);

  const handleLogin = () => {
    if (authUrl) {
      window.location.href = authUrl;
    }
  };

  if (endpoint && endpoint.auth_endpoint && !authUrl) return <div>Loading OIDC Config...</div>;

  return (
    <>
      {endpoint && endpoint.auth_endpoint && (
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
        disabled={disableOkta}
        onClick={() => handleLogin()}
      >
        Login with OIDC
      </Button>
      )}
    </>
  );
};

export default DynamicOidcLogin;
