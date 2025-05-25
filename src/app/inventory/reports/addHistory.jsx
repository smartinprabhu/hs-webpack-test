/* eslint-disable import/no-unresolved */
import React, { useEffect } from 'react';
import {
  Col,
  Row,
  Label,
} from 'reactstrap';
import Button from '@mui/material/Button';
import { useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';
import { Formik, Form } from 'formik';
import { ThemeProvider } from '@material-ui/core/styles';
import moment from 'moment';

import { CheckboxFieldGroup, DateTimeField } from '@shared/formFields';

import {
  createStockHistory,
  resetCreateStockHistory,
} from '../inventoryService';
import validationSchema from './formModel/validationSchema';
import formModel from './formModel/formModel';
import formInitialValues from './formModel/formInitialValues';
import theme from '../../util/materialTheme';
import { getDateTimeSeconds } from '../../util/appUtils';

const appModels = require('../../util/appModels').default;

const { formId, formField } = formModel;

const AddHistory = (props) => {
  const {
    type,
    afterReset,
  } = props;
  const dispatch = useDispatch();

  const onReset = () => {
    if (afterReset) afterReset();
  };

  useEffect(() => {
    dispatch(resetCreateStockHistory());
  }, []);

  function handleSubmit(values) {
    const inventoryDate = values.date ? moment(values.date).format('YYYY-MM-DD HH:mm:ss') : moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');
    const postData = { ...values };
    postData.date = inventoryDate;
    const payload = { model: appModels.STOCKHISTORY, values: postData };
    dispatch(createStockHistory(appModels.STOCKHISTORY, payload));
    onReset();
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
            isValid, values, setFieldValue, setFieldTouched,
          }) => (
            <Form id={formId}>
              <ThemeProvider theme={theme}>
                <Row className="ml-2 mr-2">
                  <Col md="12" sm="12" lg="12" xs="12">
                    <Label for={formField.computeAtDate.name} className="font-weight-600 m-0">
                      Compute
                      {' '}
                      <span className="ml-1 text-danger">*</span>
                    </Label>
                    <div className="m-1">
                      <div className="label-mb-0">
                        <CheckboxFieldGroup
                          name={formField.computeAtDate.name}
                          checkedvalue="0"
                          id="0"
                          label={formField.computeAtDate.label}
                        />
                      </div>
                      <div className="label-mb-0">
                        <CheckboxFieldGroup
                          name={formField.computeAtDate.name}
                          checkedvalue="1"
                          id="1"
                          label={formField.computeAtDate.label1}
                        />
                      </div>
                    </div>
                  </Col>
                  {values && values.compute_at_date === '1' && (
                    <Col md="12" sm="12" lg="12" xs="12">
                      <DateTimeField
                        name={formField.inventoryDate.name}
                        label={formField.inventoryDate.label}
                        formGroupClassName="m-1"
                        setFieldValue={setFieldValue}
                        setFieldTouched={setFieldTouched}
                        placeholder={formField.inventoryDate.label}
                        defaultValue={values && values.date ? new Date(getDateTimeSeconds(values.date)) : new Date(getDateTimeSeconds(moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss')))}
                      />
                    </Col>
                  )}
                </Row>
              </ThemeProvider>
              <hr />
              <div className="float-right">
                <Button
                  disabled={!(isValid)}
                  type="submit"
                  size="sm"
                   variant="contained"
                >
                  Retrive the Inventory
                  {'  '}
                  {type === 'report' ? 'Report' : 'Valuation'}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Col>
    </Row>
  );
};

AddHistory.propTypes = {
  type: PropTypes.string.isRequired,
  afterReset: PropTypes.func.isRequired,
};

export default AddHistory;
