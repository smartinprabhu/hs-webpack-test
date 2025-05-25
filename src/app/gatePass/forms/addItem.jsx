/* eslint-disable import/no-unresolved */
import React from 'react';
import {
  Col,
  Row,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import * as PropTypes from 'prop-types';
import { Formik, Form } from 'formik';
import { ThemeProvider } from '@material-ui/core/styles';
import { Button } from '@mui/material'
import { InputField } from '@shared/formFields';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import Loader from '@shared/loading';

import {
  createHxIncident,
  resetAddIncidentInfo,
} from '../../incidentBooking/ctService';
import validationSchema from './formModel/validationSchema';
import tenantFormModel from './formModel/checkoutFormModel';
import formInitialValues from './formModel/formInitialValues';
import {
  noSpecialChars,
  integerKeyPress,
} from '../../util/appUtils';
import theme from '../../util/materialTheme';

const appModels = require('../../util/appModels').default;

const { formId, formField } = tenantFormModel;

const AddItem = (props) => {
  const {
    reset,
    productName,
    setProductKeyword,
    onProductChange,
    currentId,
  } = props;
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.user);
  const { addIncidentInfo } = useSelector((state) => state.hxIncident);

  const onReset = () => {
    onProductChange({ id: addIncidentInfo && addIncidentInfo.data && addIncidentInfo.data.length ? addIncidentInfo.data[0] : '', name: productName }, currentId);
    dispatch(resetAddIncidentInfo());
    if (reset) reset();
  };

  function handleSubmit(values) {
    const postData = { ...values };
    setProductKeyword(values.name);
    const payload = { model: 'mro.gatepass.asset', values: postData };
    dispatch(createHxIncident('mro.gatepass.asset', payload));
  }

  formInitialValues.name = productName;

  return (
    <Row>
      <Col md="12" sm="12" lg="12" xs="12">
        <Formik
          initialValues={formInitialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            isValid,
          }) => (
            <Form id={formId}>
              {(addIncidentInfo && addIncidentInfo.data) ? ('') : (
                <ThemeProvider theme={theme}>
                  <Row className="ml-5 mr-5">
                    <Col md="12" sm="12" lg="12" xs="12">
                      <InputField
                        name={formField.name.name}
                        label={formField.name.label}
                        isRequired
                        type="text"
                        maxLength="50"
                        onKeyPress={noSpecialChars}
                      />
                    </Col>
                  </Row>
                </ThemeProvider>
              )}
              {addIncidentInfo && addIncidentInfo.loading && (
                <div className="text-center mt-3">
                  <Loader />
                </div>
              )}
              {(addIncidentInfo && addIncidentInfo.err) && (
                <SuccessAndErrorFormat response={addIncidentInfo} />
              )}
              {(addIncidentInfo && addIncidentInfo.data) && (
                <SuccessAndErrorFormat response={addIncidentInfo} successMessage="Item added successfully.." />
              )}
              <hr />
              <div className="float-right">
                {(addIncidentInfo && addIncidentInfo.data) && (
                  <Button
                    type="button"
                    onClick={() => onReset()}
                    variant='contained'
                  >
                    Ok
                  </Button>
                )}
                {(addIncidentInfo && !addIncidentInfo.data) && (
                  <Button
                    disabled={!(isValid)}
                    type="submit"
                    variant='contained'
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

AddItem.propTypes = {
  reset: PropTypes.func.isRequired,
};

export default AddItem;
