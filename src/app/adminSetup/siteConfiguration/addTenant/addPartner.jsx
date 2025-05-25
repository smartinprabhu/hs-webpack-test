/* eslint-disable no-shadow */
/* eslint-disable import/no-unresolved */
import React, { useEffect } from 'react';
import {
  Button,
  Col,
  Row,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import * as PropTypes from 'prop-types';
import { Formik, Form } from 'formik';
import { ThemeProvider } from '@material-ui/core/styles';

import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';

import {
  resetCreateTenant,
  createTenant,
} from '../../setupService';
import validationSchema from './formModel/validationSchema';
import tenantFormModel from './formModel/tenantFormModel';
import formInitialValues from './formModel/formInitialValues';
import theme from '../../../util/materialTheme';
import BasicSetup from './basicSetup';

const appModels = require('../../../util/appModels').default;

const { formId, formField } = tenantFormModel;

const AddPartner = (props) => {
  const {
    afterReset,
    isPartner,
  } = props;
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  const {
    createTenantinfo,
  } = useSelector((state) => state.setup);

  useEffect(() => {
    dispatch(resetCreateTenant());
  }, []);

  const onReset = () => {
    // dispatch(resetCreateTenant());
    if (afterReset) afterReset();
  };

  function handleSubmit(values) {
    const postData = { ...values };
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
            isValid, dirty, setFieldValue,
          }) => (
            <Form id={formId}>
              {(createTenantinfo && createTenantinfo.data) ? ('') : (
                <ThemeProvider theme={theme}>
                  <BasicSetup formField={formField} setFieldValue={setFieldValue} personName={false} />
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
              <SuccessAndErrorFormat response={createTenantinfo} successMessage={isPartner ? 'Partner added successfully..' : 'Customer added successfully..'} />
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

AddPartner.propTypes = {
  afterReset: PropTypes.func.isRequired,
  isPartner: PropTypes.bool,
};

AddPartner.defaultProps = {
  isPartner: false,
};

export default AddPartner;
