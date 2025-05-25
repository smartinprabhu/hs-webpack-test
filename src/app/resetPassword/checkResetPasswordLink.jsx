/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable import/no-extraneous-dependencies */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import {
  Spinner, UncontrolledTooltip,
} from 'reactstrap';
import axios from 'axios';
import propTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Button } from '@mui/material';

import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { testResetPasswordLink } from './service';
import { getTabName } from '../util/getDynamicClientData';
import { saveSessionId } from './action';
import LoginBackground from '../commonComponents/loginBackground';
import { LoginBackGroudClass, LoginButtonsClass } from '../themes/theme';
import { detectMob } from '../util/appUtils';

const isMobileView = detectMob();

const queryString = require('query-string');
const appConfig = require('../config/appConfig').default;

const CheckResetPasswordLink = (props) => {
  const propValues = props;
  const values = queryString.parse(propValues.location.search);
  const ISAPIGATEWAY = appConfig.IS_USE_APIGATEWAY;
  const [allowedInfo, setAllowedInfo] = useState({ loading: false, data: null, err: null });
  const { checkResetPasswordLinkInfo } = useSelector((state) => state.resetPassword);
  const [loginClass, setLoginClass] = useState('');

  //
  const dispatch = useDispatch();
  const history = useHistory();

  const WEBAPPAPIURL = `${window.location.origin}/`;

  useEffect(() => {
    if (ISAPIGATEWAY === 'true') {
      setAllowedInfo({
        loading: true, data: null, errMsg: false, err: null,
      });

      const config = {
        method: 'get',
        url: `${WEBAPPAPIURL}auth/check_reset_password_link?sessionUUID=${values.session_uuid}&portalDomain=${window.location.origin}`,
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
      dispatch(testResetPasswordLink(values));
    }
  }, []);

  document.title = `${getTabName()} ${window.location.pathname.replace('/', '| ')}`;

  const redirectToLogin = () => {
    dispatch(saveSessionId(values));
    history.push({ pathname: `/create-new-password?session_uuid=${values.session_uuid}` });
    window.location.reload(false);
  };
  const redirectToResetPassword = () => {
    history.push({ pathname: '/forgot-password' });
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
              <Box>
                <h1 className="login-text pb-0 mb-0 mt-2">Reset Password</h1>
                {allowedInfo && !allowedInfo.loading && !allowedInfo.err && (<span className="light-text">Click here to reset your password</span>)}
                {allowedInfo && allowedInfo.data && (
                  <div className="mt-3">
                    <Button
                      sx={LoginButtonsClass({
                        width: '100%',
                        height: '50px',
                        borderRadius: '4px',
                        color: '#ffffff',
                        textTransform: 'capitalize',
                        fontSize: '15px',
                        fontFamily: 'Suisse Intl',
                      })}
                      onClick={redirectToLogin}
                    >
                      {allowedInfo && allowedInfo.loading && <Spinner size="sm" />}
                      <span className="ml-2" />
                      RESET PASSWORD
                    </Button>
                  </div>
                )}
                {allowedInfo
                  && allowedInfo.err
                  && (
                    allowedInfo.err.message === 'Session expired or invalid.' ? (
                      <>
                        <div className="text-danger mt-0">
                          <FontAwesomeIcon size="sm" className="mr-2 font-size20 mb-n2px text-danger" icon={faExclamationCircle} />
                          {allowedInfo.err.message}
                          <Button
                            onClick={redirectToResetPassword}
                            type="button"
                            variant="contained"
                            className="cursor-pointer"
                          >
                            <span className="light-text float-right forgot-password" id="forgotPassword">
                              Forgot Password ?
                            </span>
                          </Button>
                        </div>
                        <UncontrolledTooltip placement="top-end" target="forgotPassword">
                          Click here to reset password
                        </UncontrolledTooltip>
                      </>
                    )
                      : (
                        <div className="text-danger text-center mt-3">
                          <FontAwesomeIcon size="sm" className="mr-2 font-size20 mb-n2px text-danger" icon={faExclamationCircle} />
                          {allowedInfo.err.message}
                        </div>
                      )
                  )}

              </Box>
            ) : (
              <Box>
                <h1 className="login-text pb-0 mb-0 mt-2">Forgot Password</h1>
                {checkResetPasswordLinkInfo && !checkResetPasswordLinkInfo.loading && !checkResetPasswordLinkInfo.err && (<span className="light-text">Click here to reset your password</span>)}
                {checkResetPasswordLinkInfo && checkResetPasswordLinkInfo.data && (
                  <div className="mt-3">
                    <Button
                      sx={LoginButtonsClass({
                        width: '100%',
                        height: '50px',
                        borderRadius: '4px',
                        color: '#ffffff',
                        textTransform: 'capitalize',
                        fontSize: '15px',
                        fontFamily: 'Suisse Intl',
                      })}
                      onClick={redirectToLogin}
                    >
                      {checkResetPasswordLinkInfo && checkResetPasswordLinkInfo.loading && <Spinner size="sm" />}
                      <span className="ml-2" />
                      RESET PASSWORD
                    </Button>
                  </div>
                )}
                {checkResetPasswordLinkInfo
                  && checkResetPasswordLinkInfo.err
                  && checkResetPasswordLinkInfo.err.error
                  && (
                    <>
                      {checkResetPasswordLinkInfo.err.error.message === 'Session expired or invalid.' ? (
                        <>
                          <div className="text-danger mt-0">
                            <FontAwesomeIcon size="sm" className="mr-2 font-size20 mb-n2px text-danger" icon={faExclamationCircle} />
                            {checkResetPasswordLinkInfo.err.error.message}
                            <Button
                              onClick={redirectToResetPassword}
                              type="button"
                              variant="contained"
                              className="cursor-pointer"
                            >
                              <span className="float-right forgot-password" id="forgotPassword">
                                Forgot Password ?
                              </span>
                            </Button>
                          </div>
                          <UncontrolledTooltip placement="top-end" target="forgotPassword">
                            Click here to reset password
                          </UncontrolledTooltip>
                        </>
                      )
                        : (
                          <div className="text-danger text-center mt-3">
                            <FontAwesomeIcon size="sm" className="mr-2 font-size20 mb-n2px text-danger" icon={faExclamationCircle} />
                            {checkResetPasswordLinkInfo.err.error.message}
                          </div>
                        )}
                    </>
                  )}
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </div>
  );
};
export default CheckResetPasswordLink;

CheckResetPasswordLink.defaultProps = {
  propValues: propTypes.shape({
    location: propTypes.shape({
      search: propTypes.string,
    }),
  }),
};
