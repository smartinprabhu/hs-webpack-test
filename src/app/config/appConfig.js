/*  eslint-disable no-unused-vars */
import { env } from '../../../env';

const ConfigData = {
  WEBAPIURL: env.REACT_APP_WEBAPIURL || '',
  VERSION: env.REACT_APP_VERSION,
  IS_USE_APIGATEWAY: env.REACT_APP_IS_USE_APIGATEWAY,
  GOOGLEAPIKEY: env.REACT_APP_GOOGLE_API_KEY,
  GOOGLECAPTCHASITEKEY: env.REACT_APP_GOOGLE_CAPTCHA_SITE_KEY,
  GOOGLECAPTCHASECRETKEY: env.REACT_APP_GOOGLE_CAPTCHA_SECRET_KEY,
  CLIENTNAME: env.REACT_APP_CLIENT_NAME,
  POWERBI_EXPIRY: env.REACT_APP_POWERBI_EXPIRY || 3500000,
  ENV: env.REACT_APP_ENV,
  MUI_LICENSE_KEY: env.REACT_APP_MUI_LICENSE_KEY,
  AUTH_ENDPOINT: env.REACT_APP_AUTH_ENDPOINT,
  API_URL: env.REACT_APP_API_URL,
  ONESIGNALAPPID: env.REACT_APP_ONESIGNALAPPID,
  USE_CAPTCHA: env.REACT_APP_USE_CAPTCHA || 'No',
  IS_SWITCH_THEME: env.REACT_APP_IS_SWITCH_THEME || 'No',
  IS_ESG: env.REACT_APP_IS_ESG_ONE || 'false',
  THEME: env.REACT_APP_THEME,
  BASE_PATH: env.REACT_APP_BASE_PATH || '/',
  auth: {
    GRANYTYPE: env.REACT_APP_GRANYTYPE || 'password',
    REFRESHGRANTTYPE: env.REACT_APP_REFRESHGRANTTYPE || 'refresh_token',
  },
};
export default ConfigData;