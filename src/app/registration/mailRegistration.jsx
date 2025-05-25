/* eslint-disable no-param-reassign */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Col, Row, FormGroup, Button, Spinner,
} from 'reactstrap';
import { Formik, Form } from 'formik';
import { useHistory } from 'react-router';

import helixSenseLogo from '@images/helixSenseLogo.svg';
import { InputField } from '@shared/formFields';
import { getMailStatus, getOtpValidation, resetRegistration } from './service';
import Registartion from './registartion';
import mailRegistrationFormModel from './formModel/mailRegistrationFormModel';
import initialValues from './formModel/mailRegistrationInitialValue';
import { resetLogin } from '../auth/authActions';
import { clearResetPasswordData } from '../resetPassword/service';

const mailRegistration = () => {
  const { mailResponse } = useSelector((state) => state.mailRegister);
  const { errorMessage } = useSelector((state) => state.mailRegister);
  const { registerLoading } = useSelector((state) => state.mailRegister);
  const { sessionToken } = useSelector((state) => state.mailRegister);
  const [registerObject, setRegisterObject] = useState({});
  const [otpShow, setOtpShow] = useState(false);
  const [emailValue, setEmailValue] = useState('');
  const token = '45g1FGWa8ILBJQl9sNEaevmYo2TgYP';
  const tenant = '1450';
  const { formId, formField } = mailRegistrationFormModel;

  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    dispatch(resetLogin());
  }, []);

  const goBack = () => {
    setOtpShow(false);
    dispatch(resetRegistration());
  };

  const handleLogin = () => {
    history.push({
      pathname: '/',
    });
    window.location.reload(false);
  };

  const redirectToResetPassword = () => {
    dispatch(clearResetPasswordData());
    history.push({ pathname: '/forgot-password' });
    window.location.reload(false);
  };

  const showOtp = () => {
    setOtpShow(true);
    dispatch(resetRegistration());
  };

  const handleSubmit = (values) => {
    if (values.email && values.otp) {
      values.session = sessionToken;
      values.token = token;
      values.tenant = tenant;
      setRegisterObject({
        sessionToken,
        mail: values.email,
      });
      dispatch(getOtpValidation(values));
    } else {
      dispatch(getMailStatus(values, token, tenant));
    }
  };

  const validate = (values) => {
    const errors = {};
    values.email = emailValue;
    if (!values.email) {
      errors.email = 'Email is required!';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      errors.email = 'Invalid Email address';
    }
    // eslint-disable-next-line no-use-before-define
    if (otpShow && !values.otp) {
      errors.otp = 'OTP is required!';
    }

    return errors;
  };

  return (
    <div>
      {mailResponse.message !== 'OTP Confirmed Successfully.' ? (
        <div className="login">
          <Row className="m-0">
            <Col className="bg-white p-4 mt-5 opacity-9" sm={{ size: 4, order: 1, offset: 7 }} md={{ size: 4, order: 1, offset: 7 }} lg={{ size: 4, order: 1, offset: 7 }}>
              <Row className="m-0">
                <Col sm="8" lg="8" md="8" className="pl-0">
                  <h3>Register Email</h3>
                  <span className="light-text">Please register your email with us.</span>
                </Col>
                <Col sm="4" md="4" lg="4">
                  <img
                    src={helixSenseLogo}
                    width="80"
                    className="float-right"
                    alt="Helixsense Portal"
                  />
                </Col>
              </Row>
              {(!registerLoading && mailResponse && mailResponse.message) || (!registerLoading && errorMessage && errorMessage.error && errorMessage.error.message)
                ? (
                  <div>
                    {registerLoading && (
                      <Row className="mt-3 mb-3">
                        <Col sm={{ size: 11, order: 7, offset: 5 }}>
                          <Spinner size="lg" color="dark" />
                          <h3>Loading</h3>
                        </Col>
                      </Row>
                    )}
                    {!registerLoading && mailResponse.message && !errorMessage.error && (
                      <div className="mailStatus text-success">
                        {mailResponse.message}
                      </div>
                    )}

                    {(!registerLoading && errorMessage.data && errorMessage.data.message) || (!registerLoading && errorMessage.error && errorMessage.error.message) ? (
                      <div className="mailStatus text-danger">
                        {errorMessage.data.message || errorMessage.error.message}
                      </div>
                    ) : undefined}

                    <Button type="button" className="roundCorners p-login float-right mt-4" onClick={() => { goBack(); }}>BACK</Button>

                    {mailResponse.message === 'OTP has been sent successfully.' ? (
                      <Button type="button" className="roundCorners p-login float-right mt-4 mr-2" onClick={() => { showOtp(); }}>OK</Button>
                    ) : (
                      <Button type="button" className="roundCorners p-login float-right mt-4 mr-2" onClick={() => { handleLogin(); }}>LOGIN</Button>
                    )}
                    {errorMessage && errorMessage.error && errorMessage.error.message && errorMessage.error.message.includes('User already exists.') && (
                      <div>
                        <Button onClick={redirectToResetPassword} color="link" className="cursor-pointer mt-4">Forgot Password?</Button>
                      </div>
                    )}
                  </div>
                )
                : (
                  <Formik
                    initialValues={initialValues}
                    validate={validate}
                    onSubmit={handleSubmit}
                  >
                    {() => (
                      <Form id={formId} className="mt-3">
                        <FormGroup>
                          <Col xs={12} sm={12}>
                            <InputField
                              name={formField.email.name}
                              type="text"
                              label={formField.email.label}
                              placeholder={formField.email.placeholder}
                              onChange={(e) => setEmailValue(e.target.value)}
                              value={emailValue}
                            />
                          </Col>
                        </FormGroup>
                        {otpShow && (
                          <FormGroup>
                            <Col xs={12} sm={12}>
                              <InputField name={formField.otp.name} type="text" label={formField.otp.label} />
                            </Col>
                          </FormGroup>
                        )}
                        <div className="mb-1">
                          <Row>
                            <Col sm="12">
                              <Button type="submit" className="roundCorners p-login float-right ml-2">
                                {registerLoading && (
                                  <Spinner size="sm" color="light" />
                                )}
                                {' '}
                                REGISTER
                              </Button>
                            </Col>
                          </Row>
                        </div>
                      </Form>
                    )}
                  </Formik>
                )}
            </Col>
          </Row>
        </div>
      ) : <Registartion registerObject={registerObject} />}
    </div>

  );
};

export default mailRegistration;
