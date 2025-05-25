/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
import React, { useEffect } from 'react';
import {
  Col,
  Label,
  Row,
} from 'reactstrap';
// import * as PropTypes from 'prop-types';
import { Formik, Form } from 'formik';
import { ThemeProvider } from '@material-ui/core/styles';
import { Button } from '@mui/material';

import { useDispatch, useSelector } from 'react-redux';
import * as PropTypes from 'prop-types';
import { useHistory } from 'react-router';

import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import CustomModalMessage from '@shared/customModalMessage';

import { logout } from '../../../auth/auth';
import validationSchema from './formModel/validationSchema';
import passwordFormModel from './formModel/passwordFormModel';
import formInitialValues from './formModel/formInitialValues';
import { InputField } from '../../../shared/formFields';
import theme from '../../../util/materialTheme';
import AuthService from '../../../util/authService';
import {
  resetPasswordExists, updateUserPassword, setRemoveImproperSessions, resetupdateUserPasswordInfo,
} from '../../setupService';

const { formId, formField } = passwordFormModel;

const authService = AuthService();

const UpdatePassword = (props) => {
  const {
    afterReset,
  } = props;

  const dispatch = useDispatch();
  const history = useHistory();
  const { updateUserPasswordInfo } = useSelector((state) => state.setup);
  const { userInfo } = useSelector((state) => state.user);

  const updatePasswordSuccess = !!(updateUserPasswordInfo && updateUserPasswordInfo.data && updateUserPasswordInfo.data.status);

  useEffect(() => {
    if (updatePasswordSuccess && authService.getAccessToken() && userInfo && userInfo.data && userInfo.data.id) {
      const payload = { user_id: userInfo.data.id, beare_token: authService.getAccessToken() };
      dispatch(setRemoveImproperSessions(payload));
      dispatch(resetPasswordExists());
      history.push({ pathname: '/' });
      dispatch(logout());
    }
  }, [updateUserPasswordInfo]);

  function handleSubmit(values, { resetForm }) {
    const ids = `[${userInfo && userInfo.data && userInfo.data.id}]`;
    const payload = {
      ids, old_password: values.current_password, password: values.new_password, repassword: values.password,
    };
    dispatch(updateUserPassword(payload));
    resetForm({ values: '' });
    dispatch(resetPasswordExists());
  }

  const resetAndClose = () => {
    dispatch(resetupdateUserPasswordInfo());
    dispatch(resetPasswordExists());
    if (afterReset) afterReset();
  };

  return (
    <Row>
      <Col md="12" sm="12" lg="12" xs="12">
        <Formik
          initialValues={formInitialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            isValid, dirty, values,
          }) => (
            <Form id={formId}>
              <ThemeProvider theme={theme}>
                {(!updatePasswordSuccess && !updateUserPasswordInfo.loading) && (
                <Row className="content-center pl-4 pr-4 pb-2 pt-0">
                  <Col md="4" sm="4" lg="4" xs="12" className="mb-2">
                    <Label className="font-weight-500 float-right mt-2">Old Password</Label>
                  </Col>
                  <Col md="8" sm="8" lg="8" xs="12" className="mb-2">
                    <InputField
                      name={formField.currentPassword.name}
                      label=""
                     // isRequired={formField.currentPassword.required}
                      type="password"
                      labelClassName="m-0"
                      autoComplete="new-password"
                      formGroupClassName="m-0 line-height-small"
                      maxLength="30"
                    />
                  </Col>
                  <Col md="4" sm="4" lg="4" xs="12" className="mb-2">
                    <Label className="font-weight-500 float-right mt-2">New Password</Label>
                  </Col>
                  <Col md="8" sm="8" lg="8" xs="12" className="mb-2">
                    <InputField
                      name={formField.newPassword.name}
                      label=""
                     // isRequired={formField.newPassword.required}
                      type="password"
                      labelClassName="m-0"
                      autoComplete="new-password"
                      formGroupClassName="m-0"
                      maxLength="30"
                    />
                  </Col>
                  <Col md="4" sm="4" lg="4" xs="12">
                    <Label className="font-weight-500 float-right mt-2">Confirm Password</Label>
                  </Col>
                  <Col md="8" sm="8" lg="8" xs="12">
                    <InputField
                      name={formField.password.name}
                      label=""
                     // isRequired={formField.password.required}
                      type="password"
                      labelClassName="m-0"
                      autoComplete="new-password"
                      formGroupClassName="m-0 line-height-small"
                      maxLength="30"
                    />
                  </Col>
                </Row>
                )}
              </ThemeProvider>
              {updateUserPasswordInfo && updateUserPasswordInfo.loading && (
              <div className="text-center mt-3">
                <Loader />
              </div>
              )}
              {updateUserPasswordInfo && updateUserPasswordInfo.err && (
              <SuccessAndErrorFormat response={updateUserPasswordInfo} />
              )}
              {(!values.new_password) && !updatePasswordSuccess && updateUserPasswordInfo.data && updateUserPasswordInfo.data.error && (
              <CustomModalMessage errorMessage={updateUserPasswordInfo.data.error.message ? updateUserPasswordInfo.data.error.message : 'Unable to update'} />
              )}
              {updatePasswordSuccess && (
              <SuccessAndErrorFormat
                response={updateUserPasswordInfo}
                successMessage="Password updated successfully..."
              />
              )}
              <hr />
              <div className="float-right">
                {!updatePasswordSuccess && (
                <Button
                  disabled={!(isValid && dirty)}
                  variant="contained"
                  type="submit"
                >
                  Update
                </Button>
                )}
                {updatePasswordSuccess && (
                <Button
                  variant="contained"
                  onClick={() => resetAndClose()}
                >
                  Ok
                </Button>
                )}
              </div>
            </Form>
          )}
        </Formik>
      </Col>
    </Row>
  );
};

UpdatePassword.propTypes = {
  afterReset: PropTypes.func.isRequired,
};

export default UpdatePassword;
