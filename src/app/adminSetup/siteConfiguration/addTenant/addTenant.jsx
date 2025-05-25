/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Button,
  Col,
  Row,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import * as PropTypes from 'prop-types';
import { Formik, Form } from 'formik';
import { ThemeProvider } from '@material-ui/core/styles';

import { InputField } from '@shared/formFields';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';

import {
  resetCreateTenant,
  createTenant,
} from '../../setupService';
import validationSchema from './formModel/validationSchema';
import tenantFormModel from './formModel/tenantFormModel';
import formInitialValues from './formModel/formInitialValues';
import {
  noSpecialChars,
  integerKeyPress,
} from '../../../util/appUtils';
import theme from '../../../util/materialTheme';

const appModels = require('../../../util/appModels').default;

const { formId, formField } = tenantFormModel;

const AddTenant = (props) => {
  const {
    afterReset,
  } = props;
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.user);
  const {
    createTenantinfo,
  } = useSelector((state) => state.setup);

  const onReset = () => {
    dispatch(resetCreateTenant());
    if (afterReset) afterReset();
  };

  function handleSubmit(values) {
    const postData = { ...values };
    postData.is_tenant = true;
    postData.parent_id = false;
    postData.company_id = userInfo && userInfo.data && userInfo.data.company ? userInfo.data.company.id : '';
    const payload = { model: appModels.PARTNER, values: postData };
    dispatch(createTenant(appModels.PARTNER, payload));
  }

  return (
    <Row>
      <Col md="12" sm="12" lg="12" xs="12">
        <Formik
          initialValues={formInitialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            isValid, dirty,
          }) => (
            <Form id={formId}>
              {(createTenantinfo && createTenantinfo.data) ? ('') : (
                <ThemeProvider theme={theme}>
                  <Row className="ml-5 mr-5">
                    <Col md="6" sm="6" lg="6" xs="12">
                      <InputField
                        name={formField.nameValue.name}
                        label={formField.nameValue.label}
                        isRequired={formField.nameValue.required}
                        type="text"
                        maxLength="50"
                        onKeyPress={noSpecialChars}
                      />
                    </Col>
                    <Col md="6" sm="6" lg="6" xs="12">
                      <InputField
                        name={formField.mobile.name}
                        label={formField.mobile.label}
                        isRequired={formField.mobile.required}
                        type="text"
                        maxLength="13"
                        onKeyPress={integerKeyPress}
                      />
                    </Col>
                    <Col md="6" sm="6" lg="6" xs="12">
                      <InputField
                        name={formField.email.name}
                        label={formField.email.label}
                        isRequired={formField.email.required}
                        maxLength="50"
                        type="email"
                      />
                    </Col>
                  </Row>
                </ThemeProvider>
              )}
              {createTenantinfo && createTenantinfo.loading && (
              <div className="text-center mt-3">
                <Loader />
              </div>
              )}
              {(createTenantinfo && createTenantinfo.err) && (
              <SuccessAndErrorFormat response={createTenantinfo} />
              )}
              {(createTenantinfo && createTenantinfo.data) && (
              <SuccessAndErrorFormat response={createTenantinfo} successMessage="Tenant added successfully.." />
              )}
              <hr />
              <div className="float-right">
                {(createTenantinfo && createTenantinfo.data) && (
                <Button
                  type="button"
                  size="sm"
                  onClick={() => onReset()}
                   variant="contained"
                >
                  Ok
                </Button>
                )}
                {(createTenantinfo && !createTenantinfo.data) && (
                <Button
                  disabled={!(isValid && dirty)}
                  type="submit"
                  size="sm"
                   variant="contained"
                >
                  Add
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

AddTenant.propTypes = {
  afterReset: PropTypes.func.isRequired,
};

export default AddTenant;
