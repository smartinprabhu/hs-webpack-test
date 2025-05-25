import { Cookies } from 'react-cookie';

const appConfig = require('../config/appConfig').default;

const ISAPIGATEWAY = appConfig.IS_USE_APIGATEWAY;

const cookies = new Cookies();

const AuthService = (
  // eslint-disable-next-line func-names
  function () {
    function setToken(tokenObj) {
      const accessTokenExp = new Date();
      const refreshTokenExp = new Date();
      accessTokenExp.setTime(accessTokenExp.getTime() + (tokenObj.expires_in * 1000));
      refreshTokenExp.setTime(refreshTokenExp.getTime() + (28800 * 1000));
      cookies.set('access_token', tokenObj.access_token, {
        path: '/', secure: true, sameSite: 'strict', expires: accessTokenExp,
      });
      cookies.set('refresh_token', tokenObj.refresh_token, {
        path: '/', secure: true, sameSite: 'strict', expires: refreshTokenExp,
      });
    }
    function setUid(userObj) {
      const uidExp = new Date();
      uidExp.setTime(uidExp.getTime() + (28800 * 1000));
      cookies.set('uid', userObj.refresh_token, { path: '/', expires: uidExp });
    }
    function getAccessToken() {
      return window.localStorage.getItem('is_logged_in') && window.localStorage.getItem('is_logged_in') === 'yes';
    }
    function getRefreshToken() {
      return window.localStorage.getItem('is_logged_in') && window.localStorage.getItem('is_logged_in') === 'yes';
    }
    function getSessionExpiry() {
      return '1'; // cookies.get('sessionExpiry');
    }
    function getGatewaySession() {
      return cookies.get('Session') !== 'undefined' ? cookies.get('Session') : false;
    }
    function storeServerApis(apis) {
      const exp = new Date();
      exp.setTime(exp.getTime() + (3600 * 1000));
      cookies.set('server_apis', apis, {
        path: '/', secure: true, sameSite: 'strict', expires: exp,
      });
    }
    function storeAiMessages(msgs) {
      sessionStorage.setItem('ai_msgs', msgs);
    }
    function storeAiModel(model) {
      sessionStorage.setItem('ai_model', model);
    }
    function getServerApis() {
      return cookies.get('server_apis') && cookies.get('server_apis') !== undefined ? cookies.get('server_apis') : false;
    }
    function getAiMessages() {
      return sessionStorage.getItem('ai_msgs') && sessionStorage.getItem('ai_msgs') !== undefined ? sessionStorage.getItem('ai_msgs') : false;
    }
    function getAiModel() {
      return sessionStorage.getItem('ai_model') && sessionStorage.getItem('ai_model') !== undefined ? sessionStorage.getItem('ai_model') : false;
    }
    function clearToken() {
      // cookies.remove('access_token', { path: '/' });
      //  cookies.remove('refresh_token', { path: '/' });
      cookies.remove('server_error_count');
      cookies.remove('uid');
      cookies.remove('microsoft_uid');
      cookies.remove('session_id');
      cookies.remove('Session');
      cookies.remove('server_apis', { path: '/' });
      cookies.remove('sessionExpiry', { path: '/' });
      cookies.remove('microsoft_client_id');
      window.localStorage.removeItem('issuer');
      window.localStorage.removeItem('ioturl');
      window.localStorage.removeItem('redirect_uri');
      window.localStorage.removeItem('okta_client_id');
      window.localStorage.removeItem('isDefaultRedirect');
      window.localStorage.removeItem('is_logged_in');
      window.localStorage.setItem('user_theme', 'v2');
      window.sessionStorage.clear();
    }
    function setServerError() {
      return cookies.set('server_error', 'true');
    }
    function getServerError() {
      return cookies.get('server_error');
    }
    function clearServerError() {
      cookies.remove('server_error');
    }
    function setServerErrorCount(count) {
      return cookies.set('server_error_count', count);
    }
    function clearServerErrorCount() {
      cookies.remove('server_error_count');
    }
    function getServerErrorCount() {
      return cookies.get('server_error_count');
    }
    function getUid() {
      return cookies.get('uid');
    }
    function setMicrosoftUid(userObj) {
      const microsoftUidExp = new Date();
      microsoftUidExp.setTime(microsoftUidExp.getTime() + (28800 * 1000));
      cookies.set('microsoft_uid', userObj.refresh_token, { path: '/', expires: microsoftUidExp });
    }
    function getMicrosoftUid() {
      return cookies.get('microsoft_uid');
    }
    function setMicrosoftCredentials(data) {
      cookies.set('microsoft_client_id', data.client_id);
    }
    function getMicrosoftCredentials() {
      return cookies.get('microsoft_client_id');
    }
    function setOktaCredentials(data) {
      window.localStorage.setItem('okta_client_id', data.client_id);
      window.localStorage.setItem('issuer', data.web_discovery_uri);
      window.localStorage.setItem('redirect_uri', data.web_redirect_uri);
    }
    function getOktaCredentials() {
      return window.localStorage.getItem('okta_client_id');
    }
    function setCredentials(data) {
      if (ISAPIGATEWAY === 'true') {
        cookies.set('accountId', data.account_id, { secure: true, sameSite: 'strict' });
      } else {
        cookies.set('client_id', data.client_key, { secure: true, sameSite: 'strict' });
        cookies.set('client_secret', data.client_secret, { secure: true, sameSite: 'strict' });
        cookies.set('accountId', data.account_id, { secure: true, sameSite: 'strict' });
      }
    }
    function clearCredentials() {
      if (ISAPIGATEWAY === 'true') {
        cookies.remove('sessionExpiry', { path: '/' });
        window.localStorage.removeItem('api-url');
        cookies.remove('accountId');
      } else {
        window.localStorage.removeItem('api-url');
        cookies.remove('client_id');
        cookies.remove('client_secret');
        cookies.remove('accountId');
      }
    }
    function getCredentials() {
      let credentials = {
        client_id: cookies.get('client_id'),
        client_secret: cookies.get('client_secret'),
        account_id: cookies.get('accountId'),
      };
      if (ISAPIGATEWAY === 'true') {
        credentials = {
          account_id: cookies.get('accountId'),
        };
      }
      return credentials;
    }
    return {
      setToken,
      getAccessToken,
      getRefreshToken,
      getSessionExpiry,
      getGatewaySession,
      clearToken,
      setServerError,
      getServerError,
      clearServerError,
      setServerErrorCount,
      clearServerErrorCount,
      getServerErrorCount,
      setUid,
      getUid,
      setMicrosoftUid,
      getMicrosoftUid,
      getMicrosoftCredentials,
      setMicrosoftCredentials,
      setOktaCredentials,
      getOktaCredentials,
      setCredentials,
      getCredentials,
      clearCredentials,
      storeServerApis,
      getServerApis,
      storeAiMessages,
      getAiMessages,
      storeAiModel,
      getAiModel,
    };
  }
);

export default AuthService;
