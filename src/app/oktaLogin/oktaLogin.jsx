import React from 'react';
import {
  Spinner,
} from 'reactstrap';
import { OktaAuth } from '@okta/okta-auth-js';
import { Security } from '@okta/okta-react';

const oktaLogin = () => {
  let oktaAuth;
  if (window.localStorage.getItem('issuer') && window.localStorage.getItem('okta_client_id') && window.localStorage.getItem('redirect_uri')) {
    const oktaConfigData = {
      clientId: window.localStorage.getItem('okta_client_id'),
      issuer: window.localStorage.getItem('issuer'),
      redirectUri: window.localStorage.getItem('redirect_uri'),
      pkce: true,
      disableHttpsCheck: false,
      scopes: ['openid', 'profile', 'email'],
    };
    oktaAuth = new OktaAuth(oktaConfigData);
    oktaAuth.signInWithRedirect();
  }

  const restoreOriginalUri = async (_oktaAuth, originalUri) => {
    window.location.replace(originalUri);
  };

  return (
    <div className="text-center m-4">
      {oktaAuth ? (
        <div className="text-center">
          <Spinner color="dark" />
          <div className="m-2 mb-2">Loading, please wait.. </div>
        </div>
      )
        : ''}
      <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri} />
    </div>
  );
};
export default oktaLogin;
