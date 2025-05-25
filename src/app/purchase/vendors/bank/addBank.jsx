/* eslint-disable no-shadow */
/* eslint-disable import/no-unresolved */
import React, { useEffect } from 'react';
import {
  Col,
  Row,
} from 'reactstrap';
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import * as PropTypes from 'prop-types';
import { Formik, Form } from 'formik';
import { ThemeProvider } from '@material-ui/core/styles';

import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';

import {
  resetBank,
  addBank,
} from '../../purchaseService';
import validationSchema from './formModel/validationSchema';
import tenantFormModel from './formModel/tenantFormModel';
import formInitialValues from './formModel/formInitialValues';
import theme from '../../../util/materialTheme';
import BasicSetup from './basicSetup';

const appModels = require('../../../util/appModels').default;

const { formId, formField } = tenantFormModel;

const AddBank = (props) => {
  const {
    afterReset,
  } = props;
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  const {
    addBankInfo,
  } = useSelector((state) => state.purchase);

  useEffect(() => {
    dispatch(resetBank());
  }, []);

  const onReset = () => {
    if (afterReset) afterReset();
  };

  function handleSubmit(values) {
    const postData = { ...values };
    postData.company_id = userInfo && userInfo.data && userInfo.data.company ? userInfo.data.company.id : '';
    postData.active = true;
    const payload = { model: appModels.BANKLIST, values: postData };
    dispatch(addBank(appModels.BANKLIST, payload));
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
              {(addBankInfo && addBankInfo.data) ? ('') : (
                <ThemeProvider theme={theme}>
                  <BasicSetup formField={formField} setFieldValue={setFieldValue} />
                </ThemeProvider>
              )}
              {addBankInfo && addBankInfo.loading && (
              <div className="text-center mt-3">
                <Loader />
              </div>
              )}
              {(addBankInfo && addBankInfo.err) && (
              <SuccessAndErrorFormat response={addBankInfo} />
              )}
              {(addBankInfo && addBankInfo.data) && (
              <SuccessAndErrorFormat response={addBankInfo} successMessage="Bank added successfully.." />
              )}
              <hr />
              <div className="float-right">
                {(addBankInfo && addBankInfo.data) && (
                <Button
                  type="button"
                  size="sm"
                  onClick={() => onReset()}
                  variant="contained"
                >
                  Ok
                </Button>
                )}
                {(addBankInfo && !addBankInfo.data) && (
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

AddBank.propTypes = {
  afterReset: PropTypes.func.isRequired,
};

export default AddBank;
