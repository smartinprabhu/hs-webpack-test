/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
import {
  FormGroup, Col,
} from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { useHistory } from 'react-router';
import { Formik, Form } from 'formik';
import { LoginInputField } from '@shared/formFields';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { Box, Button } from '@mui/material';
import mailIcon from '@images/mailIcon.svg';

import PageLoader from '@shared/pageLoader';
import { showForgotMailForm, sendResetPasswordLink } from './service';
import resetPasswordModel from './formModel/resetPasswordFormModel';
import resetPasswordSchema from './formModel/resetPasswordSchema';
import initialValues from './formModel/resetPasswordInitialValue';
import { getTabName } from '../util/getDynamicClientData';
import { LoginBackGroudClass, LoginButtonsClass } from '../themes/theme';

import { resetLogin } from '../auth/authActions';
import { resetRegistration } from '../registration/service';

import LoginBackground from '../commonComponents/loginBackground';
import { detectMob } from '../util/appUtils';

const isMobileView = detectMob();

const appConfig = require('../config/appConfig').default;

const GetResetPasswordLink = () => {
  const { formId, formField } = resetPasswordModel;
  const accountIdLoginInfo = useSelector((state) => state.auth.accountIdLoginInfo);
  const { resetPasswordLinkInfo } = useSelector((state) => state.resetPassword);
  const dispatch = useDispatch();
  const [allowedInfo, setAllowedInfo] = useState({ loading: false, data: null, err: null });
  const [loginClass, setLoginClass] = useState('');

  const ISAPIGATEWAY = appConfig.IS_USE_APIGATEWAY;

  const history = useHistory();
  document.title = `${getTabName()} ${window.location.pathname.replace('/', '| ')}`;

  const WEBAPPAPIURL = `${window.location.origin}/`;

  useEffect(() => {
    dispatch(resetLogin());
    dispatch(resetRegistration());
  }, []);

  const showForgotMail = () => {
    dispatch(showForgotMailForm());
    setAllowedInfo({ loading: false, data: null, err: null });
  };

  const goBack = () => {
    history.push({
      pathname: '/',
    });
    // window.location.reload(false);
  };
  const accountIdValue = accountIdLoginInfo && accountIdLoginInfo.data
    && accountIdLoginInfo.data.account_id ? accountIdLoginInfo.data.account_id : false;

  const handleSubmit = (values) => {
    if (ISAPIGATEWAY === 'true') {
      setAllowedInfo({
        loading: true, data: null, errMsg: false, err: null,
      });
      const data = {
        email_id: values.email,
        accountId: accountIdValue,
        redirect_url: window.location.href.replace('/forgot-password', '/reset-password'),
      };
      const postData = new FormData();
      Object.keys(data).map((payloadObj) => {
        postData.append(payloadObj, data[payloadObj]);
        return postData;
      });
      const config = {
        method: 'post',
        url: `${WEBAPPAPIURL}auth/forgot_password`,
        headers: {
          portalDomain: window.location.origin,
        },
        data,
      };

      axios(config)
        .then((response) => { setAllowedInfo({ loading: false, data: response.data, err: null }); })
        .catch((error) => {
          setAllowedInfo({ loading: false, data: null, err: error });
        });
    } else {
      const data = {
        email_id: values.email,
      };
      dispatch(sendResetPasswordLink(data));
    }
  };
  const theme = useState(localStorage.getItem('theme'));
  const bgColor = theme[0] === 'dark-style.css' ? 'dark-bg-login-area' : 'light-bg-login';

  useEffect(() => {
    if (appConfig.CLIENTNAME === 'sfx') {
      if (theme[0] === 'dark-style.css') {
        setLoginClass('switch-login dark-bg');
      } else {
        setLoginClass('switch-login bg-white');
      }
    } else {
      setLoginClass('login login-background');
    }
  }, [theme, appConfig]);

  const cornorLogo = accountIdLoginInfo && accountIdLoginInfo.data && accountIdLoginInfo.data.data
    && accountIdLoginInfo.data.data.background_image ? accountIdLoginInfo.data.data.background_image : false;

  const ipcLogo = accountIdLoginInfo && accountIdLoginInfo.data && accountIdLoginInfo.data.data
    && accountIdLoginInfo.data.data.ipc_logo ? accountIdLoginInfo.data.data.ipc_logo : false;
  return (
    <div>
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
            {ISAPIGATEWAY === 'true' ? (
              <Box sx={{ display: '-webkit-box' }}>
                <h1 className="login-text pb-0 mb-0 mt-2">Forgot Password</h1>
                <Button
                  type="button"
                  sx={LoginButtonsClass({
                    borderRadius: '20px',
                    color: '#ffffff',
                    textTransform: 'capitalize',
                    fontSize: '12px',
                    fontFamily: 'Suisse Intl',
                    marginTop: '20px',
                    marginLeft: '10px',
                  })}
                  onClick={goBack}
                >
                  Back to Login
                </Button>
                {(allowedInfo && allowedInfo.loading)
                  || (allowedInfo && allowedInfo.data && allowedInfo.data.message)
                  ? (
                    <div className="pl-0">
                      {((allowedInfo && allowedInfo.loading)) && (
                        <>
                          <PageLoader />
                          <h5>Loading...</h5>
                        </>
                      )}

                      {allowedInfo && allowedInfo.data && allowedInfo.data && allowedInfo.data.message.length <= 0 && allowedInfo.data.data.message && (
                        <div className="text-success mb-3 mt-4">
                          <FontAwesomeIcon size="sm" className="mr-2 font-size20 mb-n2px text-success" icon={faCheckCircle} />
                          {allowedInfo.data.data.message}
                        </div>
                      )}

                      {(allowedInfo && !allowedInfo.loading && allowedInfo.data && allowedInfo.data.data.length <= 0 && allowedInfo.data.message) && (
                        <div className="text-danger mb-3 mt-4">
                          <FontAwesomeIcon size="sm" className="mr-2 font-size20 mb-n2px text-danger" icon={faExclamationCircle} />
                          {allowedInfo.data.message}
                        </div>
                      )}
                      <Col sm={{ size: 11, order: 11, offset: 1 }}>
                        {allowedInfo && !allowedInfo.loading
                          && allowedInfo && allowedInfo.data && allowedInfo.data && allowedInfo.data.message.length <= 0 && allowedInfo.data.data.message && (
                            <Button
                              type="submit"
                              sx={LoginButtonsClass({
                                width: '100%',
                                height: '50px',
                                borderRadius: '4px',
                                color: '#ffffff',
                                textTransform: 'capitalize',
                                fontSize: '15px',
                                fontFamily: 'Suisse Intl',
                              })}
                              size="sm"
                              onClick={() => { goBack(); }}
                            >
                              OK
                            </Button>
                        )}
                        {((allowedInfo && allowedInfo.data && allowedInfo.data.message && allowedInfo.data.data.length <= 0)) && (
                          <Button
                            type="submit"
                            sx={LoginButtonsClass({
                              width: '100%',
                              height: '50px',
                              borderRadius: '4px',
                              color: '#ffffff',
                              textTransform: 'capitalize',
                              fontSize: '15px',
                              fontFamily: 'Suisse Intl',
                            })}
                            size="sm"
                            onClick={() => { showForgotMail(); }}
                          >
                            {' '}
                            OK
                          </Button>
                        )}
                      </Col>
                    </div>
                  )
                  : (
                    <Formik
                      initialValues={initialValues}
                      validationSchema={resetPasswordSchema}
                      onSubmit={handleSubmit}
                    >
                      {() => (
                        <Form id={formId} className="mt-4">
                          <FormGroup>
                            <Col xs={12} sm={12} className="p-0">
                              <LoginInputField name={formField.email.name} type="text" label={formField.email.label} placeholder={formField.email.placeholder} maxLength="50" fieldIcon={mailIcon} />
                            </Col>
                          </FormGroup>
                          <Button
                            type="submit"
                            sx={LoginButtonsClass({
                              width: '100%',
                              height: '50px',
                              borderRadius: '4px',
                              color: '#ffffff',
                              textTransform: 'capitalize',
                              fontSize: '15px',
                              fontFamily: 'Suisse Intl',
                            })}
                          >
                            SUBMIT
                          </Button>
                        </Form>
                      )}
                    </Formik>
                  )}
              </Box>
            ) : (
              <>
                <Box sx={{ display: '-webkit-box' }}>
                  <h1 className="login-text pb-0 mb-0 mt-2">Forgot Password</h1>
                  <Button
                    sx={LoginButtonsClass({
                      borderRadius: '20px',
                      color: '#ffffff',
                      textTransform: 'capitalize',
                      fontSize: '12px',
                      fontFamily: 'Suisse Intl',
                      marginTop: '20px',
                      marginLeft: '10px',
                    })}
                    onClick={goBack}
                  >
                    Back to Login
                  </Button>
                </Box>
                {(resetPasswordLinkInfo && resetPasswordLinkInfo.loading)
                  || (resetPasswordLinkInfo && resetPasswordLinkInfo.data && resetPasswordLinkInfo.data.message)
                  || (resetPasswordLinkInfo && resetPasswordLinkInfo.err && resetPasswordLinkInfo.err.error)
                  ? (
                    <div className="pl-0">
                      {resetPasswordLinkInfo && resetPasswordLinkInfo.loading && (
                        <>
                          <PageLoader />
                          <h5>Loading...</h5>
                        </>
                      )}
                      {resetPasswordLinkInfo && resetPasswordLinkInfo.data && resetPasswordLinkInfo.data.message && (
                        <div className="text-success mb-3 mt-2">
                          <FontAwesomeIcon size="sm" className="mr-2 font-size20 mb-n2px text-success" icon={faCheckCircle} />
                          {resetPasswordLinkInfo.data.message}
                        </div>
                      )}
                      {resetPasswordLinkInfo && resetPasswordLinkInfo.err && resetPasswordLinkInfo.err.error && resetPasswordLinkInfo.err.error.message && (
                        <div className="text-danger mb-3 mt-2">
                          <FontAwesomeIcon size="sm" className="mr-2 font-size20 mb-n2px text-danger" icon={faExclamationCircle} />
                          {resetPasswordLinkInfo.err.error.message}
                        </div>
                      )}

                      {resetPasswordLinkInfo && resetPasswordLinkInfo.err && !resetPasswordLinkInfo.err.error && (
                        <div className="text-danger mb-3 mt-2">
                          <FontAwesomeIcon size="sm" className="mr-2 font-size20 mb-n2px text-danger" icon={faExclamationCircle} />
                          Something went wrong...
                        </div>
                      )}
                      {resetPasswordLinkInfo && resetPasswordLinkInfo.err && resetPasswordLinkInfo.err.error && !resetPasswordLinkInfo.err.error.message && (
                        <div className="text-danger mb-3 mt-2">
                          <FontAwesomeIcon size="sm" className="mr-2 font-size20 mb-n2px text-danger" icon={faExclamationCircle} />
                          Something went wrong...
                        </div>
                      )}

                      {resetPasswordLinkInfo && !resetPasswordLinkInfo.loading
                        && resetPasswordLinkInfo.data && (
                          <Button
                            type="submit"
                            sx={LoginButtonsClass({
                              width: '100%',
                              height: '50px',
                              borderRadius: '4px',
                              color: '#ffffff',
                              textTransform: 'capitalize',
                              fontSize: '15px',
                              fontFamily: 'Suisse Intl',
                            })}
                            size="sm"
                            onClick={() => { goBack(); }}
                          >
                            OK
                          </Button>
                      )}
                      {((resetPasswordLinkInfo && resetPasswordLinkInfo.err)
                        || (resetPasswordLinkInfo && resetPasswordLinkInfo.err && resetPasswordLinkInfo.err.error)) && (
                          <Button
                            type="submit"
                            sx={LoginButtonsClass({
                              width: '100%',
                              height: '50px',
                              borderRadius: '4px',
                              color: '#ffffff',
                              textTransform: 'capitalize',
                              fontSize: '15px',
                              fontFamily: 'Suisse Intl',
                            })}
                            size="sm"
                            onClick={() => { showForgotMail(); }}
                          >
                            OK
                          </Button>
                      )}
                    </div>
                  )
                  : (
                    <Formik
                      initialValues={initialValues}
                      validationSchema={resetPasswordSchema}
                      onSubmit={handleSubmit}
                    >
                      {() => (
                        <Form id={formId} className="mt-2">
                          <FormGroup>
                            <Col xs={12} sm={12} className="p-0">
                              <LoginInputField name={formField.email.name} type="text" label={formField.email.label} placeholder={formField.email.placeholder} maxLength="50" fieldIcon={mailIcon} />
                            </Col>
                          </FormGroup>
                          <Button
                            type="submit"
                            sx={LoginButtonsClass({
                              width: '100%',
                              height: '50px',
                              borderRadius: '4px',
                              color: '#ffffff',
                              textTransform: 'capitalize',
                              fontSize: '15px',
                              fontFamily: 'Suisse Intl',
                            })}
                          >
                            SUBMIT
                          </Button>
                        </Form>
                      )}
                    </Formik>
                  )}
              </>
            )}
          </Box>
        </Box>
      </Box>
    </div>
  );
};
export default GetResetPasswordLink;
