const initialState = {
  login: {},
  authError: null,
  microsoftLogin: {},
  dynamicLoginInfo: {},
  accountIdLoginInfo: {},
  googleCaptchaCheck: {},
  pinEnableData: true,
  headerData: {},
  awsLogin: {},
};
function authReducer(state, action) {
  if (typeof state === 'undefined') {
    return initialState;
  }
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        login: (state.login, { loading: true, data: null, err: null }),
      };

    case 'SAVE_PIN_ENABLE_DATA':
      return {
        ...state,
        pinEnableData: (state.pinEnableData, action.payload),
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        login:
          (state.login, { loading: false, data: action.payload.data, err: null }),
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        login:
          (state.login,
          { loading: false, err: action.payload && action.payload.response ? action.payload.response : action.error, data: null }),
      };
    case 'LOGOUT_SUCCESS':
      return {
        ...state,
      };
    case 'LOGOUT_FAILURE':
      return {
        ...state,
        authError: 'Logout Failed',
      };
    case 'RESET_LOGIN':
      return {
        ...state,
        login: (state.login, { login: false, err: null, data: null }),
      };
    case 'OKTALOGIN':
      return {
        ...state,
        oktaLogin: (state.oktaLogin, { loading: true, err: {} }),
        awsLogin: (state.awsLogin, { loading: true, err: null, data: null }),
      };
    case 'OKTALOGIN_SUCCESS':
      return {
        ...state,
        oktaLoginSuccess:
          (state.login, { loading: false, data: action.payload.data, err: null }),
        oktaLogin: (state.oktaLogin, { loading: false, err: {} }),
        awsLogin: (state.awsLogin, { loading: false, err: null, data: action.payload.data }),
      };
    case 'OKTALOGIN_FAILURE':
      return {
        ...state,
        login:
          (state.login,
          { loading: false, err: action.payload.response ? action.payload.response : action.payload, data: null }),
        oktaLogin: (state.oktaLogin, { loading: false, err: {} }),
        awsLogin: (state.awsLogin, { loading: false, err: action.payload.response ? action.payload.response : action.payload, data: null }),
      };
    case 'MICROSOFTLOGIN':
      return {
        ...state,
        microsoftLogin:
          (state.microsoftLogin, { loading: true, data: null, err: null }),
      };
    case 'MICROSOFTLOGIN_SUCCESS':
      return {
        ...state,
        microsoftLogin:
          (state.microsoftLogin,
          { loading: false, data: action.payload.data, err: null }),
      };
    case 'MICROSOFTLOGIN_FAILURE':
      return {
        ...state,
        microsoftLogin:
          (state.microsoftLogin,
          { loading: false, data: null, err: action.payload.response }),
      };
    case 'ACCOUNT_ID_LOGIN':
      return {
        ...state,
        accountIdLoginInfo:
          (state.accountIdLoginInfo, { loading: true, data: null, err: null }),
      };
    case 'ACCOUNT_ID_LOGIN_SUCCESS':
      return {
        ...state,
        accountIdLoginInfo:
          (state.accountIdLoginInfo,
          { loading: false, data: action.payload.data, err: null }),
      };
    case 'ACCOUNT_ID_LOGIN_FAILURE':
      return {
        ...state,
        accountIdLoginInfo:
          (state.accountIdLoginInfo,
          { loading: false, data: null, err: action.payload && action.payload.response && action.payload.response.data ? action.payload.response.data : action.error }),
      };
    case 'GOOGLE_CAPTCHA_VERIFY':
      return {
        ...state,
        googleCaptchaCheck:
          (state.googleCaptchaCheck,
          { loading: true, err: false, data: false }),
      };
    case 'GOOGLE_CAPTCHA_VERIFY_SUCCESS':
      return {
        ...state,
        googleCaptchaCheck:
          (state.googleCaptchaCheck,
          { loading: false, data: action.payload, err: false }),
      };
    case 'GOOGLE_CAPTCHA_VERIFY_FAILURE':
      return {
        ...state,
        googleCaptchaCheck:
          (state.googleCaptchaCheck,
          { loading: false, err: action.payload, data: false }),
      };
    default:
      return state;
  }
}

export default authReducer;
