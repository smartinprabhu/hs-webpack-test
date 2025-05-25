/* eslint-disable max-len */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
import FormData from 'form-data';
import AuthService from '../app/util/authService';
import { clearUserv1 } from '../app/auth/auth';

const axios = require('axios');
const async = require('async');
const appConfig = require('../app/config/appConfig').default;

const WEBAPPAPIURL = `${window.location.origin === 'http://localhost:3010' ? 'http://localhost:3000' : window.location.origin}/api/`;
const WEBAPPAPIURL1 = `${window.location.origin === 'http://localhost:3010' ? 'http://localhost:3000' : window.location.origin}/`;
const ISAPIGATEWAY = appConfig.IS_USE_APIGATEWAY;

const authService = AuthService();
let endPointArray = [];

export const authoriseRefreshToken = (cb) => {
  /* if (!authService.getRefreshToken()) {
    authService.clearToken();
    window.location.pathname = '/';
  } */

  let config = {};

  if (ISAPIGATEWAY === 'true') {
    config = {
      method: 'get',
      url: `${window.location.origin}/auth/refresh`,
      headers: {
        refreshToken: authService.getRefreshToken(),
      },
    };
  } else {
    const authData = authService.getCredentials();
    const data = new FormData();
    if (authService.getUid()) {
      data.append('grant_type', 'refresh_token');
      data.append('client_id', authService.getOktaCredentials());
    } else if (authService.getMicrosoftUid()) {
      data.append('grant_type', 'refresh_token');
      data.append('client_id', authService.getMicrosoftCredentials());
    } else if (appConfig.auth) {
      data.append('grant_type', appConfig.auth.REFRESHGRANTTYPE);
      data.append('client_id', authData.client_id);
      data.append('client_secret', authData.client_secret);
    }

    data.append('refresh_token', authService.getRefreshToken());
    config = {
      method: 'post',
      url: `${WEBAPPAPIURL}portal/web/authentication/oauth2/token`,
      headers: {
        endpoint: window.localStorage.getItem('api-url'),
        portalDomain: window.location.origin,
        ioturl: window.localStorage.getItem('iot_url'),
      },
      data,
    };
  }

  axios(config)
    .then((response) => {
      cb(undefined, response.data);
    })
    .catch((error) => {
      cb(error);
      if (authService.getRefreshToken()) {
        authService.clearToken();
        window.location.pathname = '/';
      }
    });
};

function callApi(endpoint, reqMethod, payload, cb) {
  /* need to update this block as the per
  the backend format that is while doing api calls
  */
  const apiWhiteList = ['booking/uuid/show',
    'employee/validate_email',
    'employee/validate_otp',
    'employee/register',
    'user/forgot_password',
    'user/password_policy',
    'user/check_reset_password_link',
    'user/reset_password',
    'countries',
    'crm',
  ];

  // if (!authService.getRefreshToken() && !apiWhiteList.includes(endpoint)) {
  //   window.location.reload();
  // }

  if (!authService.getRefreshToken()) {
    endPointArray = apiWhiteList.filter((list) => {
      if (endpoint.includes(list)) {
        return list;
      }
    });
    if (endPointArray.length === 0) {
      authService.clearToken();
      window.location.pathname = '/';
    }
  }

  const data = new FormData();
  if (payload && payload.values) {
    data.append('values', JSON.stringify(payload.values));
  } else if (typeof payload === 'object') {
    Object.keys(payload).map((payloadObj) => {
      if (payloadObj !== 'ids' && payloadObj !== 'id' && payloadObj !== 'args_new' && payloadObj !== 'stock_type' && payloadObj !== 'picking_ids' && payloadObj !== 'new_site_id' && payloadObj !== 'copy_from_company_id' && payloadObj !== 'model' && payloadObj !== 'method' && payloadObj !== 'args' && payloadObj !== 'context' && payloadObj !== 'uuid' && payloadObj !== 'token' && payloadObj !== 'domain' && payloadObj !== 'location_id') {
        data.append(payloadObj, payload[payloadObj]);
      }
      return data;
    });
  }

  if (payload && payload.guest_id) {
    data.append('guest_id', payload.guest_id);
  }

  if (payload && payload.employee_id) {
    data.append('employee_id', payload.employee_id);
  }

  if (payload && payload.uuid) {
    data.append('uuid', payload.uuid);
  }

  if (payload && payload.token) {
    data.append('token', payload.token);
  }

  if (payload && payload.ids) {
    data.append('ids', payload.ids);
  }

  if (payload && payload.id) {
    data.append('id', payload.id);
  }

  if (payload && payload.domain) {
    data.append('domain', payload.domain);
  }

  if (payload && payload.sequence) {
    data.append('sequence', payload.sequence);
  }

  if (payload && payload.picking_ids) {
    data.append('picking_ids', payload.picking_ids);
  }

  if (payload && payload.stock_type) {
    data.append('stock_type', payload.stock_type);
  }

  if (payload && payload.model) {
    data.append('model', payload.model);
  }

  if (payload && payload.method) {
    data.append('method', payload.method);
  }

  if (payload && payload.args) {
    data.append('args', JSON.stringify(payload.args));
  }

  if (payload && payload.args_new) {
    data.append('args', payload.args_new);
  }

  if (payload && payload.location_id) {
    data.append('location_id', payload.location_id);
  }

  if (payload && payload.context) {
    data.append('context', JSON.stringify(payload.context));
  }
  if (payload && payload.new_site_id) {
    data.append('new_site_id', JSON.stringify(payload.new_site_id));
  }
  if (payload && payload.copy_from_company_id) {
    data.append('copy_from_company_id', JSON.stringify(payload.copy_from_company_id));
  }

  const config = {
    method: reqMethod.toLowerCase(),
    url: endpoint.includes('public/api/v2/search') ? WEBAPPAPIURL1 + endpoint : endpoint.includes('create/ir.attachment') ? WEBAPPAPIURL + endpoint : WEBAPPAPIURL + appConfig.VERSION + endpoint,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    withCredentials: true,
  };

  if (payload) {
    config.data = data;
  }

  /* if (authService.getAccessToken()) {
    config.headers = {
      Authorization: `Bearer ${authService.getAccessToken()}`,
      endpoint: window.localStorage.getItem('api-url'),
      ioturl: window.localStorage.getItem('iot_url'),
      portalDomain: window.location.origin,
    };
  } else if (authService.getRefreshToken()) {
    authoriseRefreshToken(() => {
      config.headers = {
        Authorization: `Bearer ${authService.getAccessToken()}`,
        endpoint: window.localStorage.getItem('api-url'),
        ioturl: window.localStorage.getItem('iot_url'),
        portalDomain: window.location.origin,
      };
    });
  } else if (endPointArray.length > 0) {
    config.headers = {
      endpoint: window.localStorage.getItem('api-url'),
      ioturl: window.localStorage.getItem('iot_url'),
      portalDomain: window.location.origin,
    };
  } else {
    throw new Error('No token saved!');
  } */

  config.headers = {
    endpoint: window.localStorage.getItem('api-url'),
    ioturl: window.localStorage.getItem('iot_url'),
    portalDomain: window.location.origin,
  };

  axios(config)
    .then((response) => {
      cb(undefined, response.data);
    })
    .catch((error) => {
      // if (error.message === ('Network Error' || 'Request failed with status code 401')) {
      //   authService.setServerError();
      //   window.location.pathname = '/server-error';
      // }
      cb(error, undefined);
    });
}

function callQueueRestCalls(queueData, next, errorType, cb) {
  async.mapSeries(queueData, (resource, resCallback) => {
    callApi(resource.endpoint, resource.method, resource.payload, (error, response) => {
      if (response) {
        next({
          payload: response,
          type: resource.successType,
        });
        response.successType = resource.successType;
        resCallback(null, response);
      } else {
        next({
          error: error.message || 'There was an error.',
          type: errorType,
        });
      }
    });
  }, (err, response) => {
    if (err) {
      cb(err);
    } else {
      cb(null, response[0]);
    }
  });
}

let tokenValid = true;
const queueData = [];

export const CALL_API = Symbol('Call API');

// eslint-disable-next-line consistent-return
export default () => (next) => (action) => {
  const callAPI = action[CALL_API];
  // So the middleware doesn't get applied to every single action
  if (typeof callAPI === 'undefined') {
    return next(action);
  }
  const {
    endpoint, types, method, payload,
  } = callAPI;

  // eslint-disable-next-line no-unused-vars
  const [requestType, successType, errorType] = types;

  if (typeof callAPI === 'object' && endpoint && requestType) {
    next({
      type: requestType,
    });
  }

  /*
    Passing the authenticated boolean back in our data will let
    us distinguish between normal and secret quotes
  */
  if (endpoint.includes('booking/uuid/show') || endpoint.includes('employee/validate_email')
    || endpoint.includes('employee/validate_otp') || endpoint.includes('employee/register')
    || endpoint.includes('user/forgot_password') || endpoint.includes('user/password_policy')
    || endpoint.includes('user/check_reset_password_link') || endpoint.includes('user/reset_password')
    || endpoint.includes('countries') || endpoint.includes('crm')) {
    return callApi(endpoint, method, payload, (error, response) => {
      if (response) {
        next({
          payload: response,
          status: response.status,
          type: successType,
        });
      } else {
        next({
          error: error.response || 'There was an error.',
          type: errorType,
        });
      }
    });
  }
  if (authService.getAccessToken()) {
    return callApi(endpoint, method, payload, (error, response) => {
      if (response) {
        next({
          payload: response,
          type: successType,
        });
      } else if ((error.response && error.response.data && error.response.data.code === 401)
        || (error.response && error.response.data && error.response.data.code === '406 Not Acceptable')
        || (error.response && error.response.data && error.response.data === 'User Session is not valid')) {
        clearUserv1();
        window.location.pathname = '/';
      } else if ((error.response && error.response.status && error.response.status === 502)
      || (error.response && error.response.status && error.response.status === 504)) {
        const fObj = {
          types, endpoint, method, payload,
        };
        authService.storeServerApis(JSON.stringify(fObj));
        next({
          error: error.response || 'There was an error.',
          type: errorType,
        });
      } else {
        next({
          error: error.response || 'There was an error.',
          type: errorType,
        });
      }
    });
  }
  if (!authService.getAccessToken()) {
    queueData.push({
      endpoint, method, payload, successType,
    });
    if (tokenValid) {
      tokenValid = false;
      authoriseRefreshToken((err, res) => {
        if (res) {
          authService.setToken(res);
          callQueueRestCalls(queueData, next, errorType, (error, response) => {
            tokenValid = true;
            if (response) {
              next({
                payload: response,
                type: response,
              });
            } else {
              next({
                error: error.message || 'There was an error.',
                type: errorType,
              });
            }
          });
        }
      });
    }
  }
};
