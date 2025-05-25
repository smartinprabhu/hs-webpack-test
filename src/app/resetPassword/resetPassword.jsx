/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Row, Col,
} from 'reactstrap';
import axios from 'axios';
import { Form, Formik } from 'formik';
import { useHistory } from 'react-router';
import { Box, Button } from '@mui/material';

import { InputField, LoginInputField } from '@shared/formFields';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

import { LoginBackGroudClass, LoginButtonsClass } from '../themes/theme';

import { createNewPassword, getPasswordPolicyInfo, showResetPasswordForm } from './service';
import passwordToggle from './passwordToggle';
import './resetPassword.scss';
import createPasswordModel from './formModel/createPasswordFormModel';
import createPasswordSchema from './formModel/createPasswordSchema';
import initialValues from './formModel/createPasswordInitialValue';
import { logout } from '../auth/auth';
import LoginBackground from '../commonComponents/loginBackground';
import PageLoader from '@shared/pageLoader';

const queryString = require('query-string');
const appConfig = require('../config/appConfig').default;

const ResetPassword = (props) => {
  const propValues = props;
  const sessionData = queryString.parse(propValues.location.search);
  const { formId, formField } = createPasswordModel;
  const { session, resetPasswordInfo, passwordPrivacyPolicyInfo } = useSelector((state) => state.resetPassword);
  // const { allowedInfo } = useSelector((state) => state.resetPassword);
  const history = useHistory();
  const [passwordInputType, ToggleIcon] = passwordToggle();
  const dispatch = useDispatch();
  const [allowedInfo, setAllowedInfo] = useState({ loading: false, data: null, err: null });
  const [loginClass, setLoginClass] = useState('');
  const ISAPIGATEWAY = appConfig.IS_USE_APIGATEWAY;

  const WEBAPPAPIURL = `${window.location.origin}/`;

  useEffect(() => {
    if (ISAPIGATEWAY === 'false') {
      dispatch(getPasswordPolicyInfo());
    }
  }, []);

  const redirectToLogin = () => {
    history.push({ pathname: '/' });
    dispatch(logout());
  };

  const showResetPassword = () => {
    dispatch(showResetPasswordForm());
    setAllowedInfo({
      loading: false, data: null, errMsg: false, err: null,
    });
  };

  const handleSubmit = (values) => {
    if (ISAPIGATEWAY === 'true') {
      setAllowedInfo({
        loading: true, data: null, errMsg: false, err: null,
      });
      const data = {
        sessionUUID: session && session.session_uuid ? session.session_uuid : sessionData.session_uuid,
        password: values.password,
        retypePassword: values.repeatPassword,
      };
      // dispatch(createNewPassword(data));

      const postData = new FormData();
      Object.keys(data).map((payloadObj) => {
        postData.append(payloadObj, data[payloadObj]);
        return postData;
      });
      const config = {
        method: 'post',
        url: `${WEBAPPAPIURL}auth/reset_password`,
        data,
        headers: {
          portalDomain: window.location.origin,
        },
      };

      axios(config)
        .then((response) => { setAllowedInfo({ loading: false, data: response.data, err: null }); })
        .catch((error) => {
          setAllowedInfo({ loading: false, data: null, err: error });
        });
    } else {
      const data = {
        session_uuid: session && session.session_uuid ? session.session_uuid : sessionData.session_uuid,
        password: values.password,
        retype_password: values.repeatPassword,
      };
      dispatch(createNewPassword(data));
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
          width: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            width: '55%',
            background: '#fff',
            padding: '30px',
          }}
        >
          {ISAPIGATEWAY === 'true' ? (
            <>
              <h3>Reset Password</h3>
              {allowedInfo && !allowedInfo.data && !allowedInfo.err && !allowedInfo.loading && (
                <span className="light-text">Please reset your password</span>
              )}

              {(allowedInfo && allowedInfo.loading) || allowedInfo.data || (allowedInfo.err)
                || (passwordPrivacyPolicyInfo && passwordPrivacyPolicyInfo.err && passwordPrivacyPolicyInfo.err.error.message)
                ? (
                  <div className="pl-2">
                    {allowedInfo && allowedInfo.loading && (
                      <div className="mt-3 mb-3 ml-3">
                        <PageLoader />
                        <h3 className="ml-n4">Loading</h3>
                      </div>
                    )}
                    {allowedInfo.data && (
                      <div className="text-success mb-1">
                        <FontAwesomeIcon size="sm" className="mr-2 font-size20 mb-n2px text-success" icon={faCheckCircle} />
                        Password is updated, please login
                      </div>
                    )}
                    {allowedInfo.err && allowedInfo.err && allowedInfo.err.message && (
                      <div className="text-danger mb-1">
                        <FontAwesomeIcon size="sm" className="mr-2 font-size20 mb-n2px text-danger" icon={faExclamationCircle} />
                        {allowedInfo.err.message}
                      </div>
                    )}
                    {passwordPrivacyPolicyInfo.err && passwordPrivacyPolicyInfo.err.error && passwordPrivacyPolicyInfo.err.error.message && (
                      <div className="text-danger mb-3 mt-3 ml-n4">
                        <FontAwesomeIcon size="sm" className="mr-2 font-size20 mb-n2px text-danger" icon={faExclamationCircle} />
                        {passwordPrivacyPolicyInfo.err.error.message}
                      </div>
                    )}
                    <Col sm={{ size: 11, order: 11, offset: 1 }}>
                      {allowedInfo && !allowedInfo.loading && (
                        <Button type="submit" className="roundCorners p-login float-right ml-2" onClick={() => { redirectToLogin(); }}> LOGIN</Button>
                      )}
                      {allowedInfo && allowedInfo.err && (
                        <Button type="button" className="roundCorners p-login float-right" onClick={showResetPassword}>BACK</Button>
                      )}
                    </Col>
                  </div>
                )
                : (
                  <Formik
                    initialValues={initialValues}
                    validationSchema={createPasswordSchema}
                    onSubmit={handleSubmit}
                  >
                    {() => (
                      <Form id={formId} className="mt-3">
                        <Row>
                          <Col xs={11} sm={11}>
                            <InputField name={formField.password.name} type={passwordInputType} autoComplete="off" label={formField.password.label} maxLength="12" />
                          </Col>
                          <Col xs={1} sm={1} className="mt-4 pt-4 pl-0">
                            <span>{ToggleIcon}</span>
                          </Col>
                          <Col xs={11} sm={11}>
                            <InputField name={formField.repeatPassword.name} type="password" label={formField.repeatPassword.label} maxLength="12" />
                          </Col>
                        </Row>
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
                            marginTop: '10px',
                          })}
                        >
                          RESET
                        </Button>
                      </Form>
                    )}
                  </Formik>
                )}
            </>
          ) : (
            <>
              <h3>Reset Password</h3>
              {resetPasswordInfo && !resetPasswordInfo.data && !resetPasswordInfo.err && !resetPasswordInfo.loading && (
                <span className="light-text">Please reset your password</span>
              )}

              {(resetPasswordInfo && resetPasswordInfo.loading) || resetPasswordInfo.data || (resetPasswordInfo.err && resetPasswordInfo.err.error)
                || (passwordPrivacyPolicyInfo && passwordPrivacyPolicyInfo.err && passwordPrivacyPolicyInfo.err.error.message)
                ? (
                  <div className="pl-2">
                    {resetPasswordInfo && resetPasswordInfo.loading && (
                      <div className="mt-3 mb-3 ml-3">
                        <PageLoader />
                        <h3 className="ml-n4">Loading</h3>
                      </div>
                    )}
                    {resetPasswordInfo.data && (
                      <div className="text-success mb-1">
                        <FontAwesomeIcon size="sm" className="mr-2 font-size20 mb-n2px text-success" icon={faCheckCircle} />
                        Password is updated, please login
                      </div>
                    )}
                    {resetPasswordInfo.err && resetPasswordInfo.err.error && resetPasswordInfo.err.error.message && (
                      <div className="text-danger mb-1">
                        <FontAwesomeIcon size="sm" className="mr-2 font-size20 mb-n2px text-danger" icon={faExclamationCircle} />
                        {resetPasswordInfo.err.error.message}
                      </div>
                    )}
                    {passwordPrivacyPolicyInfo.err && passwordPrivacyPolicyInfo.err.error && passwordPrivacyPolicyInfo.err.error.message && (
                      <div className="text-danger mb-3 mt-3 ml-n4">
                        <FontAwesomeIcon size="sm" className="mr-2 font-size20 mb-n2px text-danger" icon={faExclamationCircle} />
                        {passwordPrivacyPolicyInfo.err.error.message}
                      </div>
                    )}
                    <Col sm={{ size: 11, order: 11, offset: 1 }}>
                      {resetPasswordInfo && !resetPasswordInfo.loading && (
                        <Button type="submit" className="roundCorners p-login float-right ml-2" onClick={() => { redirectToLogin(); }}> LOGIN</Button>
                      )}
                      {resetPasswordInfo && resetPasswordInfo.err && resetPasswordInfo.err.error && (
                        <Button type="button" className="roundCorners p-login float-right" onClick={showResetPassword}>BACK</Button>
                      )}
                    </Col>

                  </div>
                )
                : (
                  <Formik
                    initialValues={initialValues}
                    validationSchema={createPasswordSchema}
                    onSubmit={handleSubmit}
                  >
                    {() => (
                      <Form id={formId} className="mt-3">
                        <Row>
                          <Col xs={11} sm={11}>
                            <LoginInputField name={formField.password.name} type={passwordInputType} autoComplete="off" label={formField.password.label} maxLength="12" />
                          </Col>
                          <Col xs={1} sm={1} className="mt-4 pt-4 pl-0">
                            <span>{ToggleIcon}</span>
                          </Col>
                          <Col xs={11} sm={11}>
                            <LoginInputField name={formField.repeatPassword.name} type="password" label={formField.repeatPassword.label} maxLength="12" />
                          </Col>
                        </Row>
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
                            marginTop: '10px',
                          })}
                        >
                          RESET
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
  );
};
export default ResetPassword;
