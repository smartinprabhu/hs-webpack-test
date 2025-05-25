/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-shadow */
/* eslint-disable react/prop-types */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Form,
} from 'reactstrap';
import { useHistory, useLocation } from 'react-router-dom';
import { Formik } from 'formik';
import { LoginInputField } from '@shared/formFields';
import MicrosoftLogin from 'react-microsoft-login';
import findindex from 'lodash/findIndex';
import * as PropTypes from 'prop-types';
import {
  GoogleReCaptchaProvider,
  GoogleReCaptcha,
} from 'react-google-recaptcha-v3';
import { Cookies } from 'react-cookie';
import axios from 'axios';
import { Box, Button } from '@mui/material';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';

import Loader from '@shared/loading';

import PageLoader from '@shared/pageLoader';
import AwsSSO from '@shared/awsSSO';

import oktaLogo from '@images/oktaLogin.png';
import microSoftLogo from '@images/microsoft.svg';

import mailIcon from '@images/mailIcon.svg';
import passwordIcon from '@images/passwordIcon.svg';

import {
  login, microsoftLogin, verifyCaptcha,
} from './auth';
import { resetLogin } from './authActions';
// import { resetRegistration } from '../registration/service';
import DialogHeader from '../commonComponents/dialogHeader';
import { clearResetPasswordData } from '../resetPassword/service';
import loginModel from './formModel/loginFormModel';
import loginSchema from './formModel/loginSchema';
import initialValues from './formModel/loginInitialValue';
import AuthService from '../util/authService';
import { getUserDetails } from '../user/userService';
import { getUserSession, setRemoveImproperSessions } from '../adminSetup/setupService';
import appsList from '../data/apps.json';
import { getMaxLenghtForFields, detectMob } from '../util/appUtils';
import applicationDetails from '../util/ClientDetails.json';
import LoginBackground from '../commonComponents/loginBackground';
import { LoginBackGroudClass, LoginButtonsClass, LoginTextButtonsClass } from '../themes/theme';

const isMobileView = detectMob();

const appConfig = require('../config/appConfig').default;

const authService = AuthService();

const Login = (props) => {
  const {
    redirectLink,
    accountCode,
  } = props;
  const { formId, formField } = loginModel;
  const dispatch = useDispatch();
  const loginData = useSelector((state) => state.auth.login);
  const googleCaptchaCheck = useSelector((state) => state.auth.googleCaptchaCheck);
  const microsoftLoginData = useSelector((state) => state.auth.microsoftLogin);
  const accountIdLoginInfo = useSelector((state) => state.auth.accountIdLoginInfo);
  const [loginClass, setLoginClass] = useState('');

  const { USE_CAPTCHA } = appConfig;

  const isNoCaptcha = USE_CAPTCHA && USE_CAPTCHA === 'No';
  const isBasePath = !!(appConfig.BASE_PATH && appConfig.BASE_PATH.includes('/v3'));

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [disableOkta, disableOktaButton] = useState(false);
  const [endpoints, setEndpoints] = useState(false);
  const [traditionalLoginTrue, setTraditionalLogin] = useState(false);
  const [microsoftLoginTrue, setMicrosoftLogin] = useState(false);
  const [staticLoginAttempted, setStaticLoginAttempted] = useState(false);
  // const [oktaLoginError, setOktaLoginError] = useState('');
  const [clientToken, setClientToken] = useState(!!isNoCaptcha);
  const [apiCall, setApiCall] = useState(false);
  const { userInfo } = useSelector((state) => state.user);
  const { userSessionData } = useSelector((state) => state.setup);
  const [sessionExpiredModal, setSessionExpiredModal] = useState(false);
  const [loginValues, setLoginValues] = useState({});

  const formikRef = useRef();

  const clearForm = () => {
    if (formikRef.current) {
      formikRef.current.resetForm();
    }
  };

  const cookies = new Cookies();
  useEffect(() => {
    const favicon = document.getElementById('favicon');
    applicationDetails.map((details) => {
      if (details.client === appConfig.CLIENTNAME) {
        document.title = details.title;
        favicon.setAttribute('href', details.favicon);
      }
    });
  }, []);

  const history = useHistory();
  const errTxt = 'Something went wrong..';
  const ISAPIGATEWAY = appConfig.IS_USE_APIGATEWAY;
  const maxLengthValues = getMaxLenghtForFields();
  // Un comment this while using registration process

  // const handleSignUp = () => {
  //   dispatch(resetRegistration());
  //   history.push('/registration');
  //   window.location.reload();
  // };

  /* useEffect(() => {
    if (!authService.getAccessToken()) {
      cookies.set('sessionExpiry', '0', {
        path: '/', secure: true, sameSite: 'strict',
      });
    }
  }, []); */

  useEffect(() => {
    if (loginData && loginData.data) {
      if (ISAPIGATEWAY === 'true') {
        dispatch(getUserDetails(authService.getAccessToken()));
      } else {
        /* cookies.set('sessionExpiry', '1', {
          path: '/', secure: true, sameSite: 'strict',
        }); */
        if (redirectLink) {
          window.localStorage.setItem(('isDefaultRedirect'), 'yes');
        }
        window.location.href = redirectLink || (isBasePath ? '/v3' : '/');
      }
    }
  }, [loginData]);

  useEffect(() => {
    if (userInfo && userInfo.data && userInfo.data.company && userInfo.data.company.id) {
      if (ISAPIGATEWAY === 'true') {
        const payload = { user_id: userInfo.data.id, beare_token: authService.getAccessToken() };
        dispatch(getUserSession(payload));
      } else {
      /*  cookies.set('sessionExpiry', '1', {
          path: '/', secure: true, sameSite: 'strict',
        }); */
        // eslint-disable-next-line no-lonely-if
        if (userInfo.data.home_web_menu_id && userInfo.data.home_web_menu_id.name) {
          const menuData = appsList.filter((item) => item.name === userInfo.data.home_web_menu_id.name);
          if (menuData && menuData.length) {
            window.location.href = redirectLink || menuData[0].url;
          } else {
            window.location.href = redirectLink || (isBasePath ? '/v3' : '/');
          }
        } else {
          window.location.href = redirectLink || (isBasePath ? '/v3' : '/');
        }
      }
    }
  }, [userInfo]);

  useEffect(() => {
    if (userSessionData && userSessionData.data && userSessionData.data.length > 0) {
      if (userSessionData.data[0].current_session_count > userSessionData.data[0].systm_config_count) {
        setSessionExpiredModal(true);
      } else {
        /* cookies.set('sessionExpiry', '1', {
          path: '/', secure: true, sameSite: 'strict',
        }); */
        if (userInfo && userInfo.data && userInfo.data.home_web_menu_id && userInfo.data.home_web_menu_id.name) {
          const menuData = appsList.filter((item) => item.name === userInfo.data.home_web_menu_id.name);
          if (menuData && menuData.length) {
            window.location.href = menuData[0].url;
          } else {
            window.location.href = redirectLink || (isBasePath ? '/v3' : '/');
          }
        } else {
          window.location.href = redirectLink || (isBasePath ? '/v3' : '/');
        }
      }
    } else if (userSessionData && userSessionData.err) {
      /* cookies.set('sessionExpiry', '1', {
        path: '/', secure: true, sameSite: 'strict',
      }); */
      if (userInfo && userInfo.data && userInfo.data.home_web_menu_id && userInfo.data.home_web_menu_id.name) {
        const menuData = appsList.filter((item) => item.name === userInfo.data.home_web_menu_id.name);
        if (menuData && menuData.length) {
          window.location.href = menuData[0].url;
        } else {
          window.location.href = redirectLink || (isBasePath ? '/v3' : '/');
        }
      } else {
        window.location.href = redirectLink || (isBasePath ? '/v3' : '/');
      }
    }
  }, [userSessionData]);

  const closeSessionExpire = () => {
    const payload = { user_id: userInfo.data.id, beare_token: authService.getAccessToken() };
    /*  cookies.set('sessionExpiry', '1', {
      path: '/', secure: true, sameSite: 'strict',
    }); */
    dispatch(setRemoveImproperSessions(payload));
    setSessionExpiredModal(false);
    if (userInfo && userInfo.data && userInfo.data.home_web_menu_id && userInfo.data.home_web_menu_id.name) {
      const menuData = appsList.filter((item) => item.name === userInfo.data.home_web_menu_id.name);
      if (menuData && menuData.length) {
        window.location.href = menuData[0].url;
      } else {
        window.location.href = redirectLink || (isBasePath ? '/v3' : '/');
      }
    } else {
      window.location.href = redirectLink || (isBasePath ? '/v3' : '/');
    }
  };

  const closeModal = () => {
  /*  cookies.set('sessionExpiry', '1', {
      path: '/', secure: true, sameSite: 'strict',
    }); */
    setSessionExpiredModal(false);
    if (userInfo && userInfo.data && userInfo.data.home_web_menu_id && userInfo.data.home_web_menu_id.name) {
      const menuData = appsList.filter((item) => item.name === userInfo.data.home_web_menu_id.name);
      if (menuData && menuData.length) {
        window.location.href = menuData[0].url;
      } else {
        window.location.href = redirectLink || (isBasePath ? '/v3' : '/');
      }
    } else {
      window.location.href = redirectLink || (isBasePath ? '/v3' : '/');
    }
  };

  const redirectToOktaLogin = () => {
    if (accountIdLoginInfo && accountIdLoginInfo.data && accountIdLoginInfo.data.data) {
      const oktaLoginEndpoint = accountIdLoginInfo.data.data.endpoints.find((data) => data.type === 'Okta');
      if (oktaLoginEndpoint) {
        authService.setOktaCredentials(oktaLoginEndpoint);
      }
    }
    window.localStorage.removeItem('okta-response');
    window.localStorage.setItem('okta-redirect-src', 'home');
    history.push({ pathname: '/okta-hosted-login' });
    window.location.reload();
  };

  const handleLoginCredentialsChange = (event) => {
    loginData.err = null;
    if (event.target.name === 'username') {
      setUsername(event.target.value);
    } else {
      setPassword(event.target.value);
    }
    if (event.target.value && event.target.value.length) {
      disableOktaButton(true);
    } else {
      disableOktaButton(false);
    }
    if ((username && username.length > 1) || (password && password.length > 1)) {
      disableOktaButton(true);
    }
  };

  const onSkipSession = () => {
    setUsername('');
    setPassword('');
    clearForm();
    dispatch(resetLogin());
  };

  let oktaLoginLoading;

  /* if (window.localStorage.getItem('issuer') && window.localStorage.getItem('okta_client_id') && window.localStorage.getItem('redirect_uri') && window.location.href.includes('okta-login')) {
    oktaLoginLoading = true;
    const oktaConfigData = {
      clientId: window.localStorage.getItem('okta_client_id'),
      issuer: window.localStorage.getItem('issuer'),
      redirectUri: window.localStorage.getItem('redirect_uri'),
      pkce: true,
      scopes: ['openid', 'profile', 'email'],
      disableHttpsCheck: false,
    };
    const oktaAuth = new OktaAuth(oktaConfigData);
    oktaAuth.token.parseFromUrl()
      .then((oktaResp) => {
        oktaLoginLoading = false;
        dispatch(oktaLogin(oktaResp));
        history.push({ pathname: '/' });
      }).catch((error) => {
        oktaLoginLoading = false;
        // setOktaLoginError(error.message);
        loginData.err = error.message === 'Unable to parse a token from the url' ? null : { data: { message: error.message } };
      });
  } */

  const redirectToResetPassword = () => {
    dispatch(clearResetPasswordData());
    history.push({ pathname: '/forgot-password' });
    // window.location.reload();
  };

  const clearAccount = () => {
    const config = {
      method: 'get',
      url: `${window.location.origin === 'http://localhost:3010' ? 'http://localhost:3000' : window.location.origin}/clearAccount`,
      withCredentials: true,
    };
    axios(config)
      .then((response) => {
        if (response) {
          window.location.pathname = '/';
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSwitchAccount = () => {
    window.localStorage.removeItem('api-url');
    clearAccount();
  };

  const handleSubmit = (values, endpoint) => {
    let data = {
      userName: values.username,
      password: values.password,
      accountId: accountIdLoginInfo && accountIdLoginInfo.data && accountIdLoginInfo.data.data
      && accountIdLoginInfo.data.data.account_id ? accountIdLoginInfo.data.data.account_id : false,
      client_id: endpoint.client_id,
      client_secret: accountIdLoginInfo && accountIdLoginInfo.data && accountIdLoginInfo.data.data
      && accountIdLoginInfo.data.data.client_secret ? accountIdLoginInfo.data.data.client_secret : false,
    };
    setLoginValues(data);
    if (ISAPIGATEWAY === 'true') {
      data = {
        userName: values.username,
        password: values.password,
        accountId: accountIdLoginInfo && accountIdLoginInfo.data && accountIdLoginInfo.data.data
        && accountIdLoginInfo.data.data.account_id ? accountIdLoginInfo.data.data.account_id : false,
      };
    }
    dispatch(login(data, redirectLink));
  };

  const setAccountToken = (credentials) => {
    if (credentials) {
      const data = new FormData();
      data.append('accountId', credentials.account_id);
      data.append('client_id', credentials.client_key);
      data.append('client_secret', credentials.client_secret);

      const config = {
        method: 'post',
        url: `${window.location.origin === 'http://localhost:3010' ? 'http://localhost:3000' : window.location.origin}/saveAccount`,
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

  const handleSession = (value) => {
    const newValue = { active_sessions: value };
    const data = { ...loginValues, ...newValue };
    dispatch(login(data, redirectLink));
  };

  const loginHandler = (err, data, msal) => {
    if (!err && data && microsoftLoginData && !microsoftLoginData.err && !microsoftLoginData.loading && !microsoftLoginData.data) {
      dispatch(microsoftLogin(data, msal));
    }
  };
  useEffect(() => {
    if ((!username && !password) || (username && !username.length) || (password && !password.length)) {
      disableOktaButton(false);
    }
  }, [username, password]);

  useEffect(() => {
    if ((username && username.length) || (password && password.length)) {
      disableOktaButton(true);
    }
  }, [username, password]);

  useEffect(() => {
    if (accountIdLoginInfo && accountIdLoginInfo.data && accountIdLoginInfo.data.endpoint && accountIdLoginInfo.data.endpoint.length && ISAPIGATEWAY === 'true') {
      if (typeof accountIdLoginInfo.data.endpoint === 'object') {
        setEndpoints(accountIdLoginInfo.data.endpoint);
      } else {
        setEndpoints([{ endpoint: accountIdLoginInfo.data.endpoint, type: 'Traditional' }]);
      }
    } else if (accountIdLoginInfo && accountIdLoginInfo.data && accountIdLoginInfo.data.data && accountIdLoginInfo.data.data.endpoints && accountIdLoginInfo.data.data.endpoints.length) {
      setEndpoints(accountIdLoginInfo.data.data.endpoints);
    }
  }, [accountIdLoginInfo]);

  useEffect(() => {
    if (accountIdLoginInfo && accountIdLoginInfo.data && ISAPIGATEWAY === 'true') {
      window.localStorage.setItem('api-url', accountIdLoginInfo.data.web_v3_endpoint || accountIdLoginInfo.data.endpoint);
      setAccountToken(accountIdLoginInfo.data);
      const microsoftLoginEndpoint = accountIdLoginInfo.data.endpoint && typeof accountIdLoginInfo.data.endpoint === 'object'
        && accountIdLoginInfo.data.endpoint.find((data) => data.type === 'Microsoft');
      if (microsoftLoginEndpoint && microsoftLoginTrue) {
        authService.setMicrosoftCredentials(microsoftLoginEndpoint);
      }
    } else if (accountIdLoginInfo && accountIdLoginInfo.data && accountIdLoginInfo.data.data) {
      const currentURL = window.location.origin;
      if ((accountIdLoginInfo.data.data.portal_url_v3 && accountIdLoginInfo.data.data.portal_url_v3 === currentURL) || currentURL === 'http://localhost:3010' || isBasePath) {
        window.localStorage.setItem('api-url', accountIdLoginInfo.data.data.web_v3_endpoint || accountIdLoginInfo.data.data.endpoint);
        // window.localStorage.setItem('portal-v2', accountIdLoginInfo.data.data.portal_url ? accountIdLoginInfo.data.data.portal_url : false);
        setAccountToken(accountIdLoginInfo.data.data);
      } else if (!accountIdLoginInfo.data.data.portal_url_v3 && !microsoftLoginTrue) {
        alert('WEB URL Not Assigned for this Account ID');
        handleSwitchAccount();
      } else if (!microsoftLoginTrue && !isBasePath) {
        window.location.href = `${accountIdLoginInfo.data.data.portal_url_v3}/accountlogin/${accountCode}`;
      }
      const microsoftLoginEndpoint = accountIdLoginInfo.data.data.endpoints.find((data) => data.type === 'Microsoft');
      if (microsoftLoginEndpoint && microsoftLoginTrue) {
        authService.setMicrosoftCredentials(microsoftLoginEndpoint);
      }
    }
  }, [accountIdLoginInfo, microsoftLoginTrue, traditionalLoginTrue]);

  const onVerifyCallBack = (token) => {
    if (!apiCall) {
      setApiCall(true);
      setClientToken(token);
      const data = {
        captcha_secret: appConfig.GOOGLECAPTCHASECRETKEY,
        captcha_response: token,
      };
      dispatch(verifyCaptcha(data));
    }
  };

  const location = useLocation();
  const currentPath = location.pathname;

  /* const cornorLogo = accountIdLoginInfo && accountIdLoginInfo.data && accountIdLoginInfo.data.data
    && accountIdLoginInfo.data.data.background_image ? accountIdLoginInfo.data.data.background_image : false;

  const ipcLogo = accountIdLoginInfo && accountIdLoginInfo.data && accountIdLoginInfo.data.data
    && accountIdLoginInfo.data.data.ipc_logo ? accountIdLoginInfo.data.data.ipc_logo : false;
  const theme = useState(localStorage.getItem('theme'));
  const bgColor = theme[0] === 'dark-style.css' ? 'dark-bg-login-area' : 'light-bg-login'; */

  const isGoogleCaptchaVerified = isNoCaptcha ? true : googleCaptchaCheck && googleCaptchaCheck.data;

  const SwitchAccount = () => (
    <Button
      onClick={handleSwitchAccount}
      color="link"
      className="cursor-pointer pt-0 pr-0 float-right"
    >
      <span className="light-text forgot-password">Switch Account</span>
    </Button>
  );

  useEffect(() => {
    if (accountIdLoginInfo && accountIdLoginInfo.err) {
      handleSwitchAccount();
    }
  }, [accountIdLoginInfo]);

  useEffect(() => {
    if (
      formikRef.current && // Ensure Formik ref is available
      !staticLoginAttempted && // Only attempt once
      endpoints && 
      endpoints.length > 0 && // Ensure endpoints are loaded
      endpoints.some(ep => ep.type === 'Traditional') && // Check if Traditional login is an option
      !(loginData && loginData.data) && // Not already processing a login
      !(loginData && loginData.loading) && // Not currently loading a login
      !(userInfo && userInfo.data) // Not already logged in / user info loaded
    ) {
      const traditionalEndpoint = endpoints.find(ep => ep.type === 'Traditional');
      if (traditionalEndpoint) {
        // console.log('Attempting static login with vignesh@dev.com'); // Optional: for debugging
        formikRef.current.setFieldValue('username', 'vignesh@dev.com');
        formikRef.current.setFieldValue('password', 'vignesh@dev.com');
        
        setTraditionalLogin(true); // Simulate the click's side-effect

        setTimeout(() => {
          if (formikRef.current) { // Check ref again inside timeout
            formikRef.current.submitForm();
          }
        }, 0); // A minimal timeout

        setStaticLoginAttempted(true);
      }
    }
  }, [endpoints, staticLoginAttempted, loginData, userInfo, traditionalLoginTrue]);

  const cpatchaLoad = isNoCaptcha ? false : ((googleCaptchaCheck && googleCaptchaCheck.loading) || !clientToken || !isGoogleCaptchaVerified);

  const setSequence = (menuList) => menuList.sort((a, b) => a.sequence - b.sequence);

  return (
    <Box
      sx={LoginBackGroudClass({
        height: '100vh',
        display: 'flex',
        top: '0px',
        left: '0px',
        overflow: 'hidden',
      })}
    >
      <LoginBackground />
      <Box
        sx={{
          width: isMobileView ? '100%' : '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            width: isMobileView ? '100%' : '55%',
            background: '#fff',
            padding: '30px',
          }}
        >
          <div>
            <h1 className="login-text pb-0 mb-0 mt-2">Welcome Back!</h1>
            <p className="login-description pt-0 mt-0 mb-3">Please sign in to your account.</p>
          </div>
          <div className="text-center">
            {accountIdLoginInfo?.data?.data?.logo && (
              <img
                src={`data:image/png;base64,${accountIdLoginInfo?.data?.data?.logo}`}
                alt="logo"
                className="company-login-logo"
              />
            )}
          </div>
          {accountIdLoginInfo && accountIdLoginInfo.loading && (
            <div className="text-center my-5">
              <Loader />
            </div>
          )}
          {endpoints && endpoints.length && setSequence(endpoints).map((endpoint) => (
            <>
              {endpoint.type === 'Traditional' ? (
                <>
                  <Formik
                    initialValues={initialValues}
                    validationSchema={loginSchema}
                    onSubmit={(values) => handleSubmit(values, endpoint)}
                    innerRef={formikRef}
                    validateOnBlur={false}
                    validateOnChange={false}
                  >
                    {(props) => (
                      <Form onSubmit={props.handleSubmit} onChange={handleLoginCredentialsChange} id={formId} className="pt-2">
                        <LoginInputField
                          name={formField.username.name}
                          type="text"
                          label={formField.username.label}
                          maxLength={maxLengthValues.username}
                          placeholder="Enter Username or Email"
                          fieldIcon={mailIcon}
                          labelClassName="text-black"
                        />
                        <LoginInputField
                          name={formField.password.name}
                          autoComplete="new-password"
                          type="password"
                          label={formField.password.label}
                          maxLength={maxLengthValues.password}
                          placeholder="Enter Password"
                          fieldIcon={passwordIcon}
                          labelClassName="text-black"
                        />
                        <Box
                          sx={LoginTextButtonsClass({
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%',
                          })}
                        >
                          <p aria-hidden onClick={redirectToResetPassword} className="switch-text mt-2">
                            Forgot password?
                          </p>
                          <p aria-hidden onClick={handleSwitchAccount} className="switch-text mt-2">
                            Switch Account
                          </p>
                        </Box>
                        <Button
                          type="submit"
                          onClick={() => setTraditionalLogin(true)}
                          disabled={(userSessionData && userSessionData.loading) || (userInfo && userInfo.loading) || (loginData && loginData.loading) || cpatchaLoad}
                          sx={LoginButtonsClass({
                            width: '100%',
                            height: '40px',
                            borderRadius: '4px',
                            color: '#ffffff',
                            textTransform: 'capitalize',
                            fontSize: '17px',
                            fontFamily: 'Suisse Intl',
                          })}
                        >
                          Login
                        </Button>
                        {endpoints.length > 1 && findindex(endpoints, { type: 'Traditional' }) === 0 ? (
                          <div className="text-center light-text my-1">
                            or
                          </div>
                        ) : ''}
                      </Form>
                    )}
                  </Formik>
                  {!isNoCaptcha && (
                    <GoogleReCaptchaProvider reCaptchaKey={appConfig.GOOGLECAPTCHASITEKEY}>
                      {!clientToken
                        ? <GoogleReCaptcha onVerify={(token) => onVerifyCallBack(token)} />
                        : ''}
                    </GoogleReCaptchaProvider>
                  )}
                </>
              ) : ''}
              {endpoint.type === 'Okta' ? (
                <>
                  <Button
                    onClick={() => { redirectToOktaLogin(); }}
                    disabled={disableOkta}
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
                  >
                    <img
                      src={oktaLogo}
                      width="15"
                      className="mr-2 mb-1"
                      alt="Helixsense Portal"
                    />
                    Login with OKTA
                  </Button>
                  {findindex(endpoints, { type: 'Traditional' }) === -1 && findindex(endpoints, { type: 'Mirosoft' }) === -1 && findindex(endpoints, { type: 'AWS OpenID' }) === -1 && (
                  <Button
                    onClick={() => { handleSwitchAccount(); }}
                    disabled={disableOkta}
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
                  >

                    Switch Account
                  </Button>
                  )}
                </>
              ) : ''}
              {endpoint.type === 'Microsoft' ? (
                <>
                  {endpoint.client_id && microsoftLoginData && !microsoftLoginData.loading && (
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
                          disabled={disableOkta}
                          onClick={() => setMicrosoftLogin(true)}
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
                      {findindex(endpoints, { type: 'Traditional' }) === -1 && findindex(endpoints, { type: 'Okta' }) === -1 && findindex(endpoints, { type: 'AWS OpenID' }) === -1 && (
                      <Button
                        onClick={() => { handleSwitchAccount(); }}
                        disabled={disableOkta}
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
                      >

                        Switch Account
                      </Button>
                      )}
                    </div>
                  )}
                </>
              ) : ''}
              {endpoint.type === 'AWS OpenID' ? (

                <div className="text-center light-text mt-2">

                  <AwsSSO endpoint={endpoint} disableOkta={disableOkta} />
                  {findindex(endpoints, { type: 'Traditional' }) === -1 && findindex(endpoints, { type: 'Okta' }) === -1 && findindex(endpoints, { type: 'Mirosoft' }) === -1 && (
                  <Button
                    onClick={() => { handleSwitchAccount(); }}
                    disabled={disableOkta}
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
                  >

                    Switch Account
                  </Button>
                  )}
                </div>

              ) : ''}
            </>
          ))}
          {loginData && !loginData.err && oktaLoginLoading
            ? (
              <div className="text-center">
                <div className="m-2 mb-2">Logging in ... </div>
              </div>
            )
            : ''}
          {ISAPIGATEWAY === 'true' && loginData && loginData.err && loginData.err.data && loginData.err.data.message
            && loginData.err.data.message !== "'NoneType' object has no attribute 'strip'" && isGoogleCaptchaVerified && (
              <div className="error-msg text-center">
                {loginData.err.data.arguments && loginData.err.data.arguments.length > 0 ? loginData.err.data.arguments : loginData.err.data.message}
              </div>
          )}
          {loginData && loginData.err && loginData.err.data && loginData.err.data.message && loginData.err.data.message === "'NoneType' object has no attribute 'strip'" && isGoogleCaptchaVerified && (
            <div className="error-msg text-center">
              Your AccountId does not have valid credentials to Login, please try with other AccountId.
            </div>
          )}
          {ISAPIGATEWAY !== 'true' && loginData && loginData.err && loginData.err.data && loginData.err.data.message && isGoogleCaptchaVerified && (
            <div className="error-msg text-center">
              {loginData.err.data.message.includes('\nNone') ? loginData.err.data.message.replace('\nNone', '') : loginData.err.data.message}
            </div>
          )}
          {loginData && !(loginData.err && loginData.err.status === 409) && (loginData.err || (loginData.err && loginData.err.data)) && !(loginData.err && loginData.err.data && loginData.err.data.message) && isGoogleCaptchaVerified && (
            <div className="error-msg text-center">
              {errTxt}
            </div>
          )}
          {loginData && (loginData.err && loginData.err.status === 409) && isGoogleCaptchaVerified && (
          <div className="error-msg text-center">
            {loginData.err.data && loginData.err.data.error && loginData.err.data.error.message ? loginData.err.data.error.message : errTxt}
          </div>
          )}
          {apiCall && !isGoogleCaptchaVerified && (googleCaptchaCheck && !googleCaptchaCheck.loading) && (
            <div className="error-msg text-center">
              Captcha verification failed.
              {' '}
              <a href={redirectLink ? currentPath : '/login'}>Click here to reload</a>
              { /* <span aria-hidden className="text-info cursor-pointer" onClick={() => { rerender(Math.random()); setClientToken(false); }}>Click here to reload</span> */}
            </div>
          )}
          {microsoftLoginData && microsoftLoginData.err && microsoftLoginData.err.data && microsoftLoginData.err.data.message && (
            <div className="error-msg text-center">
              {microsoftLoginData.err.data.message}
            </div>
          )}
          {microsoftLoginData && microsoftLoginData.loading && (
            <div className="text-center">
              Logging in with Microsoft...
            </div>
          )}
          {(loginData && loginData.loading && (
            <PageLoader />
          ))}
        </Box>
      </Box>

      <Dialog maxWidth="md" open={loginData && (loginData.err && loginData.err.status === 409)}>
        <DialogHeader title="Alert" hideClose response={false} imagePath={false} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <div className="text-center">
              You have exceeded the permissible active sessions. Would you like to logout all the other sessions?
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            type="button"
            variant="contained"
            className="reset-btn"
            onClick={() => onSkipSession()}
          >
            No

          </Button>
          <Button
            type="button"
            variant="contained"
            className="submit-btn"
            onClick={() => handleSession('clear')}
          >
            Yes

          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

Login.defaultProps = {
  redirectLink: false,
};

Login.propTypes = {
  redirectLink: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
};

export default Login;
