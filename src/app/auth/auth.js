import * as Msal from 'msal';
import { Cookies } from 'react-cookie';

import AuthService from '../util/authService';
import {
  loginSuccess, loginFailure, logoutSuccess, logIn, oktaLogIn, oktaLoginSuccess, oktaLoginFailure,
  microsoftLogIn, microsoftLoginSuccess, microsoftLoginFailure, accountIdLogIn, accountIdLoginSuccess, accountIdLoginFailure,
  googleCaptchaVerify, googleCaptchaVerifySuccess, googleCaptchaVerifyFailure,
} from './authActions';
import { convertToUppercase } from '../util/appUtils';

const axios = require('axios');
const FormData = require('form-data');
const appConfig = require('../config/appConfig').default;

const authService = AuthService();
const cookies = new Cookies();
const WEBAPPAPIURL = `${window.location.origin === 'http://localhost:3010' ? 'http://localhost:3000' : window.location.origin}/api/`;
const ISAPIGATEWAY = appConfig.IS_USE_APIGATEWAY;

export const verifyCaptcha = (credentials) => (dispatch) => {
  if (credentials.captcha_secret && credentials.captcha_response) {
    const data = new FormData();
    data.append('secret', credentials.captcha_secret);
    data.append('response', credentials.captcha_response);

    dispatch(googleCaptchaVerify());

    const config = {
      method: 'post',
      url: `${window.location.origin === 'http://localhost:3010' ? 'http://localhost:3000' : window.location.origin}/recaptcha/api/siteverify`,
      data,
    };
    axios(config)
      .then((response) => {
        if (response.data && response.data.success) {
          dispatch(googleCaptchaVerifySuccess(response.data));
        } else {
          dispatch(googleCaptchaVerifyFailure(response.data));
        }
      })
      .catch((error) => {
        dispatch(googleCaptchaVerifyFailure(error));
      });
  } else {
    dispatch(googleCaptchaVerifyFailure('Failed'));
  }
};

export const setToken = (credentials, isAd) => (dispatch) => {
  if (credentials) {
    const data = new FormData();
    data.append('access_token', credentials.access_token);
    data.append('refresh_token', credentials.refresh_token);
    data.append('expires_in', credentials.expires_in);

    const config = {
      method: 'post',
      url: `${window.location.origin === 'http://localhost:3010' ? 'http://localhost:3000' : window.location.origin}/saveToken`,
      data,
      withCredentials: true,
    };
    axios(config)
      .then((response) => {
        if (response) {
          window.localStorage.setItem('is_logged_in', 'yes');
          if (!isAd) {
            dispatch(loginSuccess(response));
          } else {
            if (isAd === 'ms') {
              dispatch(microsoftLoginSuccess(response));
            } else {
              dispatch(oktaLoginSuccess(response));
            }
            window.location.reload();
            window.location.href = '/';
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

export const clearUser = () => (dispatch) => {
  const config = {
    method: 'get',
    url: `${window.location.origin === 'http://localhost:3010' ? 'http://localhost:3000' : window.location.origin}/clearUser`,
    headers: {
      endpoint: window.localStorage.getItem('api-url'),
      ioturl: window.localStorage.getItem('iot_url'),
    },
    withCredentials: true,
  };
  axios(config)
    .then((response) => {
      if (response) {
        authService.clearToken();
        dispatch(logoutSuccess());
        if (!authService.getMicrosoftUid() && !window.localStorage.getItem('is_logged_in')) {
          window.location.reload();
        }
      }
    })
    .catch((error) => {
      console.log(error);
      authService.clearToken();
      if (!authService.getMicrosoftUid() && !window.localStorage.getItem('is_logged_in')) {
        window.location.reload();
      }
    });
};

export const clearUserv1 = () => {
  const config = {
    method: 'get',
    url: `${window.location.origin === 'http://localhost:3010' ? 'http://localhost:3000' : window.location.origin}/clearUser`,
    headers: {
      endpoint: window.localStorage.getItem('api-url'),
      ioturl: window.localStorage.getItem('iot_url'),
    },
    withCredentials: true,
  };
  axios(config)
    .then((response) => {
      if (response) {
        authService.clearToken();
        if (!authService.getMicrosoftUid() && !window.localStorage.getItem('is_logged_in')) {
          window.location.reload();
        }
      }
    })
    .catch((error) => {
      authService.clearToken();
      if (!authService.getMicrosoftUid() && !window.localStorage.getItem('is_logged_in')) {
        window.location.reload();
      }
    });
};

export const login = (credentials, redirectLink) => (dispatch) => {
  if (ISAPIGATEWAY === 'true') {
    dispatch(logIn());
    const data = { userName: credentials.userName, password: credentials.password, accountId: credentials.accountId };

    const config = {
      method: 'post',
      url: `${window.location.origin}/auth/login`,
      data,
      // headers: { endpoint: window.localStorage.getItem('api-url') },
    };

    axios(config)
      .then((response) => {
        authService.setToken(response.data);
        dispatch(loginSuccess(response));
        /* if (!redirectLink) {
          window.location.href = '/';
        } else {
          window.location.href = redirectLink;
        } */
      })
      .catch((error) => {
        dispatch(loginFailure(error));
      });
  } else {
    const data = new FormData();
    const authData = authService.getCredentials();

    dispatch(logIn());
    if (appConfig.auth) {
      data.append('grant_type', appConfig.auth.GRANYTYPE);
    }

    data.append('client_id', credentials.client_id);
    data.append('client_secret', credentials.client_secret);
    data.append('username', credentials.userName);
    data.append('password', credentials.password);

    if (credentials.active_sessions) {
      data.append('active_sessions', credentials.active_sessions);
    }

    const config = {
      method: 'post',
      url: `${WEBAPPAPIURL}portal/web/authentication/oauth2/token`,
      data,
      withCredentials: true,
      headers: { endpoint: window.localStorage.getItem('api-url') },
    };

    axios(config)
      .then((response) => {
        dispatch(setToken(response.data));
        /* if (!redirectLink) {
          window.location.href = '/';
        } else {
          window.location.href = redirectLink;
        } */
      })
      .catch((error) => {
        dispatch(loginFailure(error));
      });
  }
};

export const oktaLogin = (credentials) => (dispatch) => {
  const data = new FormData();
  dispatch(oktaLogIn());
  data.append('token', credentials.tokens.accessToken.accessToken);
  data.append('client_id', credentials.tokens.accessToken.claims.cid);

  const config = {
    method: 'post',
    url: `${WEBAPPAPIURL}auth_oauth/get_access_token`,
    data,
    withCredentials: true,
    headers: { endpoint: window.localStorage.getItem('api-url') },
  };
  axios(config)
    .then((response) => {
      // authService.setToken(response.data);
      authService.setUid(response.data);
      dispatch(setToken(response.data, 'ad'));
      /* cookies.set('sessionExpiry', '1', {
        path: '/', secure: true, sameSite: 'strict',
      }); */
      // dispatch(oktaLoginSuccess(response));
      // window.location.reload(false);
    }).catch((error) => {
      dispatch(oktaLoginFailure(error));
    });
};

export const awsLogin = (credentials) => (dispatch) => {
  const data = new FormData();
  dispatch(oktaLogIn());
  data.append('token', credentials.token);
  data.append('client_id', credentials.client_id);

  const config = {
    method: 'post',
    url: `${WEBAPPAPIURL}auth_oauth/get_access_token`,
    data,
    withCredentials: true,
    headers: { endpoint: window.localStorage.getItem('api-url') },
  };
  axios(config)
    .then((response) => {
      // authService.setToken(response.data);
      // authService.setUid(response.data);
      dispatch(setToken(response.data, 'ad'));
      /* cookies.set('sessionExpiry', '1', {
        path: '/', secure: true, sameSite: 'strict',
      }); */
      // dispatch(oktaLoginSuccess(response));
      // window.location.reload(false);
    }).catch((error) => {
      dispatch(oktaLoginFailure(error));
    });
};

const microsoftLogOut = () => {
  const config = {
    auth: {
      clientId: authService.getMicrosoftCredentials(),
    },
  };
  const myMSALObj = new Msal.UserAgentApplication(config);
  myMSALObj.logout();
};

export const logout = () => (dispatch) => {
  if (ISAPIGATEWAY === 'true') {
    authService.clearToken();
    dispatch(logoutSuccess());
    if (!authService.getAccessToken()) {
      window.location.reload();
    }
  } else {
    // authService.clearToken();
    dispatch(clearUser());
    if (authService.getMicrosoftUid()) {
      microsoftLogOut();
    }
  }
};

export const microsoftLogin = (tokenObj, credentials) => (dispatch) => {
  if (!authService.getAccessToken()) {
    const data = new FormData();
    data.append('token', tokenObj.accessToken);
    data.append('client_id', credentials.clientId);
    const config = {
      method: 'POST',
      url: `${WEBAPPAPIURL}auth_oauth/get_access_token`,
      data,
      withCredentials: true,
      headers: { endpoint: window.localStorage.getItem('api-url') },
    };
    dispatch(microsoftLogIn());
    axios(config)
      .then((response) => {
        /// authService.setToken(response.data);
        authService.setMicrosoftUid(response.data);
        dispatch(setToken(response.data, 'ms'));

        /* cookies.set('sessionExpiry', '1', {
          path: '/', secure: true, sameSite: 'strict',
        });
        window.location.reload();
        window.location.href = '/'; */
      })
      .catch((error) => {
        dispatch(microsoftLoginFailure(error));
      });
  }
};

export const dynamicLogin = (values) => (dispatch) => {
  const URL = ISAPIGATEWAY === 'true' ? `${window.location.origin === 'http://localhost:3010' ? 'http://localhost:3000' : window.location.origin}/account/getByAccountId/${convertToUppercase(values.accountId)}`
    : `${WEBAPPAPIURL}authProviders/getByAccountId?account_id=${convertToUppercase(values.accountId)}`;
  const config = {
    method: 'get',
    url: URL,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };
  dispatch(accountIdLogIn());
  axios(config)
    .then((response) => {
      dispatch(accountIdLoginSuccess(response));
    }).catch((error) => {
      dispatch(accountIdLoginFailure(error));
    });
};
