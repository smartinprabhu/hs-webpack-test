/* eslint-disable react/prop-types */
/* eslint-disable import/no-unresolved */
import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Cookies } from 'react-cookie';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import { Box, Button } from '@mui/material';
import { InputCustomField } from '@shared/formFields';

import PageLoader from '@shared/pageLoader';

import LoginBackground from '../commonComponents/loginBackground';
import { LoginBackGroudClass, LoginButtonsClass } from '../themes/theme';
import { getMaxLenghtForFields, detectMob } from '../util/appUtils';
import AuthService from '../util/authService';
import formModel from './accountIdFormModel/accountIdFormModel';
import initialValues from './accountIdFormModel/accountIdInitialValues';
import validationSchema from './accountIdFormModel/accountIdValidationSchema';
import { dynamicLogin, verifyCaptcha, clearUser } from './auth';
import Login from './login';

const isMobileView = detectMob();

const appConfig = require('../config/appConfig').default;

const authService = AuthService();

const cookies = new Cookies();

const DynamicLogin = (props) => {
  const { redirectLink, match } = props;
  const params = match && match.params ? match.params : false;
  const accountid = params && params.accountid ? params.accountid : false;
  const [error, setError] = useState(false);
  const [login, setLogin] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const { accountIdLoginInfo, googleCaptchaCheck } = useSelector(
    (state) => state.auth,
  );
  const dispatch = useDispatch();
  const { formId, formFields } = formModel;
  const [clientToken, setClientToken] = useState(false);
  const [apiCall, setApiCall] = useState(false);
  const ISAPIGATEWAY = appConfig.IS_USE_APIGATEWAY;
  const [loginClass, setLoginClass] = useState('');
  const [accountCode, setAccountCode] = useState(false);

  const handleSubmit = (values) => {
    setAccountCode(values.accountId);
    dispatch(dynamicLogin(values));
  };

  const apiUrl = window.localStorage.getItem('api-url');

  const cornorLogo = accountIdLoginInfo && accountIdLoginInfo.data && accountIdLoginInfo.data.data
    && accountIdLoginInfo.data.data.logo ? accountIdLoginInfo.data.data.logo : false;

  useEffect(() => {
    if (accountid) {
      setAccountCode(accountid);
      dispatch(clearUser());
      authService.clearToken();
      dispatch(dynamicLogin({ accountId: accountid }));
    }
  }, [accountid]);

  const clearAccount = () => {
    const config = {
      method: 'get',
      url: `${window.location.origin === 'http://localhost:3010' ? 'http://localhost:3000' : window.location.origin}/clearAccount`,
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
  };

  const getAccount = () => {
    const config = {
      method: 'get',
      url: `${window.location.origin === 'http://localhost:3010' ? 'http://localhost:3000' : window.location.origin}/getAccount`,
      withCredentials: true,
    };
    axios(config)
      .then((response) => {
        if (response) {
          // console.log(response);
          setAccountCode(response.data);
          dispatch(dynamicLogin({ accountId: response.data }));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (apiUrl && !accountid) {
      // setAccountCode(cookies.get('accountId'));
      if (!window.localStorage.getItem('is_account_new')) {
        window.localStorage.removeItem('api-url');
        clearAccount();
        window.localStorage.setItem('is_account_new', 'false');
      }
      getAccount();
    } else if (!apiUrl && !accountid) {
      window.localStorage.setItem('is_account_new', 'true');
    }
  }, []);

  useEffect(() => {
    if (accountIdLoginInfo && accountIdLoginInfo.data && accountIdLoginInfo.data.endpoint && accountIdLoginInfo.data.endpoint.length && ISAPIGATEWAY) {
      window.localStorage.setItem('company_logo', cornorLogo);
      setLogin(true);
      /* cookies.set('sessionExpiry', '0', {
        path: '/', secure: true, sameSite: 'strict',
      }); */
    } else if (accountIdLoginInfo && accountIdLoginInfo.data && accountIdLoginInfo.data.data && accountIdLoginInfo.data.data.endpoints && accountIdLoginInfo.data.data.endpoints.length) {
      setLogin(true);
      window.localStorage.setItem('company_logo', cornorLogo);
    }
  }, [accountIdLoginInfo]);

  useEffect(() => {
    if (accountIdLoginInfo && accountIdLoginInfo.err && accountIdLoginInfo.err.error && accountIdLoginInfo.err.error.message) {
      setError(accountIdLoginInfo.err.error.message);
      setAttempts(attempts + 1);
      window.localStorage.setItem('company_logo', '');
    } else if (accountIdLoginInfo && accountIdLoginInfo.err) {
      console.log(accountIdLoginInfo.err);
      setError('Something went wrong..');
      setAttempts(attempts + 1);
      window.localStorage.setItem('company_logo', '');
    }
  }, [accountIdLoginInfo]);

  const onVerifyCallBack = (token) => {
    try {
      setApiCall(true);
      setClientToken(token);
      const data = {
        captcha_secret: appConfig.GOOGLECAPTCHASECRETKEY,
        captcha_response: token,
      };
      dispatch(verifyCaptcha(data));
    } catch (e) {
      console.log(e);
    }
  };

  const onRefresh = () => {
    window.location.href = redirectLink || '/login';
  };
  const maxLengthValues = getMaxLenghtForFields();

  const isGoogleCaptchaVerified = googleCaptchaCheck && googleCaptchaCheck.data;
  const theme = useState(localStorage.getItem('theme'));
  const bgColor = theme[0] === 'dark-style.css' ? 'dark-bg-login-area' : 'light-bg-login';

  /* useEffect(() => {
    if (appConfig.CLIENTNAME === 'sfx') {
      if (theme[0] === 'dark-style.css') {
        setLoginClass('switch-login dark-bg');
      } else {
        setLoginClass('switch-login bg-white');
      }
    } else {
      setLoginClass('login login-background');
    }
  }, [theme, appConfig]); */

  return login || cookies.get('accountId') ? (
    <Login redirectLink={redirectLink} accountCode={accountCode} />
  ) : (
    <Box
      sx={
        LoginBackGroudClass({
          height: '100vh',
          display: 'flex',
          top: '0px',
          left: '0px',
          overflow: 'hidden',
        })
}
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
          {/* <img
            src={companyLoginLogo}
            alt="logo"
            className="company-login-logo"
          /> */}
          <div>
            <h1 className="login-text pb-0 mb-0 mt-4">Welcome Back!</h1>
            <p className="login-description pt-0 mt-0 mb-4">Please sign in to your account.</p>
          </div>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue }) => (
              <Form id={formId}>
                <div className="accountId-text pt-2"> Enter Account Code*</div>
                <InputCustomField
                  name={formFields.accountId.name}
                  label=""
                  labelClassName="m-0"
                  customWrap
                  type="text"
                  className="input"
                  maxLength={maxLengthValues.accountId}
                  placeholder="Enter Account Code"
                />
                <Button
                  type="submit"
                  disabled={(accountIdLoginInfo && accountIdLoginInfo.loading) || (attempts === 3)}
                  sx={LoginButtonsClass({
                    width: '100%',
                    height: '50px',
                    borderRadius: '4px',
                    color: '#ffffff',
                    textTransform: 'capitalize',
                    fontSize: '18px',
                    margin: '8% 0px 0px 0px',
                  })}
                >
                  {error ? 'Retry' : 'Continue'}
                </Button>
              </Form>
            )}
          </Formik>
          {(accountIdLoginInfo && accountIdLoginInfo.loading && (
            <PageLoader />
          ))}
          {error && attempts < 3 && <div className="error-msg text-center">{error}</div>}
          {attempts === 3 && (
            <div className="error-msg text-center">
              Too many failed attempts try again later
            </div>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default DynamicLogin;
