/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import {
  Button,
  Col,
  Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { TextField } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';

import { InputField, FormikAutocomplete } from '@shared/formFields';
import {
  getQuotationFilters,
} from '../../purchaseService';
import theme from '../../../util/materialTheme';
import filtersFields from './filtersFields.json';

const DataFilters = (props) => {
  const {
    afterReset,
  } = props;
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [customFiltersList, setCustomFilters] = useState([]);

  const {
    quotationFilters,
  } = useSelector((state) => state.purchase);

  const formInitialValues = {
    fieldName: '',
    fieldValue: '',
  };

  const currentValidationSchema = Yup.object().shape({
    fieldName: Yup.string()
      .nullable()
      .required('Field required'),
    fieldValue: Yup.string()
      .required('Value required'),
  });

  function handleSubmit(values, { resetForm }) {
    const filters = [{
      key: values.fieldName.value, value: encodeURIComponent(values.fieldValue), label: values.fieldName.label, type: 'text',
    }];
    setCustomFilters([...customFiltersList, ...filters]);
    const states = quotationFilters && quotationFilters.statuses ? quotationFilters.statuses : [];
    const orders = quotationFilters && quotationFilters.orderes ? quotationFilters.orderes : [];
    const vendors = quotationFilters && quotationFilters.vendores ? quotationFilters.vendores : [];
    const customFilters = [...customFiltersList, ...filters];
    dispatch(getQuotationFilters(states, orders, vendors, customFilters));
    resetForm({ values: '' });
    if (afterReset) afterReset();
  }

  return (
    <Row>
      <Col md="12" sm="12" lg="12" xs="12">
        <Formik
          initialValues={formInitialValues}
          validationSchema={currentValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ isValid, dirty }) => (
            <Form id="filter_frm">
              <ThemeProvider theme={theme}>
                <Col xs={12} sm={12} lg={12} md={12}>
                  <FormikAutocomplete
                    name="fieldName"
                    label="Field"
                    open={open}
                    size="small"
                    onOpen={() => {
                      setOpen(true);
                    }}
                    onClose={() => {
                      setOpen(false);
                    }}
                    getOptionSelected={(option, value) => option.label === value.label}
                    getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                    options={filtersFields.fields}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        placeholder="Select"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                </Col>
                <Col xs={12} sm={12} lg={12} md={12}>
                  <InputField
                    name="fieldValue"
                    label="Value"
                    type="text"
                  />
                </Col>
              </ThemeProvider>
              <hr />
              <div className="float-right">
                <Button
                  disabled={!(isValid && dirty)}
                  type="submit"
                   variant="contained"
                >
                  Search
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Col>
    </Row>
  );
};

DataFilters.propTypes = {
  afterReset: PropTypes.func.isRequired,
};

export default DataFilters;
