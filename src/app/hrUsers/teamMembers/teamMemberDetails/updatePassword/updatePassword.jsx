/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
import React, { useEffect } from 'react';
import {
  Col,
  Label,
  Row,
} from 'reactstrap';
// import * as PropTypes from 'prop-types';
import { ThemeProvider } from '@material-ui/core/styles';
import { Form, Formik } from 'formik';

import * as PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import CustomModalMessage from '@shared/customModalMessage';
import Loader from '@shared/loading';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';

import { Button } from '@mui/material';
import {
  getActionData, resetActionData,
} from '../../../../workorders/workorderService';
import {
  createTeam, resetCreateTeam,
} from '../../../../adminSetup/setupService';
import { InputField } from '../../../../shared/formFields';
import AuthService from '../../../../util/authService';
import theme from '../../../../util/materialTheme';
import formInitialValues from './formModel/formInitialValues';
import passwordFormModel from './formModel/passwordFormModel';
import validationSchema from './formModel/validationSchema';

const appModels = require('../../../../util/appModels').default;

const { formId, formField } = passwordFormModel;

const authService = AuthService();

const UpdatePassword = (props) => {
  const {
    afterReset,
    memberId,
    userId,
  } = props;

  const dispatch = useDispatch();
  const history = useHistory();
  const { createTeamInfo } = useSelector((state) => state.setup);
  const { userInfo } = useSelector((state) => state.user);
  const {
    actionResultInfo
  } = useSelector((state) => state.workorder);

  const updatePasswordSuccess = !!(actionResultInfo && actionResultInfo.data && actionResultInfo.data.status);

  useEffect(() => {
    if (createTeamInfo && createTeamInfo.data && createTeamInfo.data.length) {
      const id = createTeamInfo.data[0];
      dispatch(getActionData(id, 'change_password_button_user_management', appModels.CHANGEPASSWORD));
    }
  }, [createTeamInfo]);

  function handleSubmit(values, { resetForm }) {
    const postData = { new_password: values.new_password, user_id: userId };
    const viewId = memberId;
    const payload = { model: appModels.CHANGEPASSWORD, values: { user_ids: [[0, viewId, postData]] } };
    dispatch(createTeam(appModels.CHANGEPASSWORD, payload));
    // dispatch(updateUserPassword(payload));
    resetForm({ values: '' });
  }

  const resetAndClose = () => {
    dispatch(resetCreateTeam());
    dispatch(resetActionData());
    if (afterReset) afterReset();
  };

  const loading =  (createTeamInfo && createTeamInfo.loading) || (actionResultInfo && actionResultInfo.loading);

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
                {(!updatePasswordSuccess && !loading) && (
                <Row className="content-center pl-4 pr-4 pb-2 pt-0">
                  <Col md="4" sm="4" lg="4" xs="12">
                    <Label className="font-weight-500 float-right mt-2">New Password</Label>
                  </Col>
                  <Col md="8" sm="8" lg="8" xs="12">
                    <InputField
                      name={formField.newPassword.name}
                      label=""
                      isRequired={formField.newPassword.required}
                      type="password"
                      labelClassName="m-0"
                      formGroupClassName="m-0 line-height-small"
                      maxLength="45"
                    />
                  </Col>
                  <Col md="4" sm="4" lg="4" xs="12">
                    <Label className="font-weight-500 float-right mt-2">Confirm Password</Label>
                  </Col>
                  <Col md="8" sm="8" lg="8" xs="12">
                    <InputField
                      name={formField.password.name}
                      label=""
                      isRequired={formField.password.required}
                      type="password"
                      labelClassName="m-0"
                      formGroupClassName="m-0 line-height-small"
                      maxLength="45"
                    />
                  </Col>
                </Row>
                )}
              </ThemeProvider>
              {actionResultInfo && actionResultInfo.loading && (
              <div className="text-center mt-3">
                <Loader />
              </div>
              )}
              {actionResultInfo && actionResultInfo.err && (
              <SuccessAndErrorFormat response={actionResultInfo} />
              )}
              {(!values.new_password) && !updatePasswordSuccess && actionResultInfo.data && actionResultInfo.data.error && (
              <CustomModalMessage errorMessage={actionResultInfo.data.error.message ? actionResultInfo.data.error.message : 'Unable to update'} />
              )}
              {updatePasswordSuccess && (
              <SuccessAndErrorFormat
                response={actionResultInfo}
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
