/* eslint-disable no-param-reassign */
/* eslint-disable import/no-unresolved */

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { Formik, Form } from 'formik';
import {
  Row, Col, FormGroup, Button, Spinner,
} from 'reactstrap';
import { useHistory } from 'react-router';
import { InputField } from '@shared/formFields';

import './registration.scss';
import { registerUser, showRegistration } from './service';
import initialValues from './formModel/registrationInitialValues';
import registrationSchema from './formModel/registrationValidationSchema';

import helixSenseLogo from '@images/helixSenseLogo.svg';
import { clearResetPasswordData } from '../resetPassword/service';
import registrationFormModel from './formModel/registrationFormModel';

const Registartion = ({ registerObject }) => {
  const { formId, formField } = registrationFormModel;

  const {
    firstName,
    lastName,
    workNumber,
    password,
    repeatPassword,

  } = formField;

  const dispatch = useDispatch();
  const history = useHistory();

  const { userRegistartionResponse } = useSelector((state) => state.mailRegister);
  const { errorMessage } = useSelector((state) => state.mailRegister);
  const { registerLoading } = useSelector((state) => state.mailRegister);

  const token = '45g1FGWa8ILBJQl9sNEaevmYo2TgYP';

  const handleSubmit = (values) => {
    values.session = registerObject.sessionToken;
    values.email = registerObject.mail;
    values.token = token;
    dispatch(registerUser(values));
  };

  const goBack = () => {
    history.push({
      pathname: '/',
    });
  };

  const showRegisterForm = () => {
    dispatch(showRegistration());
  };

  const redirectToResetPassword = () => {
    dispatch(clearResetPasswordData());
    history.push({ pathname: '/forgot-password' });
  };

  return (
    <div className="login-h115">
      <Row className="m-0">
        <Col className="bg-white p-4 mt-5 opacity-9" sm={{ size: 4, order: 1, offset: 7 }} md={{ size: 4, order: 1, offset: 7 }} lg={{ size: 4, order: 1, offset: 7 }}>
          <Row className="m-0">
            <Col sm="8" lg="8" md="8" className="pl-0">
              <h3>Registration</h3>
              <span className="light-text">Please register yourself with us.</span>
            </Col>
            <Col sm="4" md="4" lg="4">
              <img
                src={helixSenseLogo}
                width="80"
                height="40"
                className="float-right"
                alt="Helixsense Portal"
              />
            </Col>
          </Row>

          {registerLoading || (userRegistartionResponse && userRegistartionResponse.message) || (errorMessage.error && errorMessage.error.message)
            ? (
              <div className="pl-2">
                {registerLoading && (
                  <Row className="mt-3 mb-3">
                    <Col sm={{ size: 11, order: 7, offset: 5 }}>
                      <Spinner size="lg" color="dark" />
                      <h3>Loading</h3>
                    </Col>
                  </Row>
                )}
                {!registerLoading && userRegistartionResponse.message && (
                  <Row className="mailStatus mb-3">
                    <Col sm="12">
                      {userRegistartionResponse.message}
                    </Col>
                  </Row>
                )}

                {!registerLoading && errorMessage.error && errorMessage.error.message && (
                  <Row className="mailStatus text-danger mb-3">
                    <Col sm="12">
                      {errorMessage.error.message}
                    </Col>
                  </Row>
                )}

                <Col sm={{ size: 11, order: 11, offset: 1 }}>
                  {(!registerLoading && userRegistartionResponse && userRegistartionResponse.message)
                   && userRegistartionResponse.message.includes('Request has been sent to your employer for verification')
                    ? (
                      <div>
                        <Button className="roundCorners p-login float-right ml-2" onClick={() => { goBack(); }}> LOGIN</Button>
                        <Button onClick={redirectToResetPassword} color="link" className="cursor-pointer">Forgot Password?</Button>
                        <Button type="button" className="roundCorners p-login float-right" onClick={showRegisterForm}>BACK</Button>
                      </div>
                    )
                    : (
                      <span>
                        {!registerLoading && (
                          <Button className="roundCorners p-login float-right ml-2" onClick={() => { goBack(); }}> OK</Button>
                        )}
                        {!registerLoading && errorMessage && errorMessage.error && errorMessage.error.message && (
                          <Button type="button" className="roundCorners p-login float-right" onClick={showRegisterForm}>BACK</Button>
                        )}
                      </span>
                    )}

                </Col>
              </div>
            )
            : (
              <Formik
                initialValues={initialValues}
                validationSchema={registrationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form id={formId} className="mt-3" noValidate>
                    <FormGroup>
                      <Col xs={12} sm={12}>
                        <InputField name={firstName.name} type="text" label={firstName.label} />
                      </Col>
                    </FormGroup>
                    <FormGroup>
                      <Col xs={12} sm={12}>
                        <InputField name={lastName.name} type="text" label={lastName.label} />
                      </Col>
                    </FormGroup>
                    <FormGroup>
                      <Col xs={12} sm={12}>
                        <InputField name={workNumber.name} type="number" label={workNumber.label} />
                      </Col>
                    </FormGroup>
                    <FormGroup>
                      <Col xs={12} sm={12}>
                        <InputField name={password.name} type="password" label={password.label} />
                      </Col>
                    </FormGroup>
                    <FormGroup>
                      <Col xs={12} sm={12}>
                        <InputField name={repeatPassword.name} type="password" label={repeatPassword.label} />
                      </Col>
                    </FormGroup>
                    <Row className="mb-1">
                      <Col sm={{ size: 11, order: 11, offset: 1 }}>
                        <Button type="submit" disabled={isSubmitting} className="roundCorners p-login float-right ml-2"> REGISTER</Button>
                        <Button type="button" className="roundCorners p-login float-right" onClick={() => { goBack(); }}>BACK</Button>
                      </Col>
                    </Row>
                  </Form>
                )}
              </Formik>
            )}
        </Col>
      </Row>
    </div>
  );
};

Registartion.propTypes = {
  registerObject: PropTypes.shape({
    sessionToken: PropTypes.string.isRequired,
    mail: PropTypes.string.isRequired,
  }).isRequired,
};

export default Registartion;
