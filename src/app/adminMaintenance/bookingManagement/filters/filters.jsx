/* eslint-disable react/jsx-no-useless-fragment */
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
  getWorkorderFilter,
} from '../../adminMaintenanceService';
import theme from '../../../util/materialTheme';
import filtersFields from './filtersFields.json';

const Filters = (props) => {
  const {
    afterReset,
  } = props;
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const {
    workorderFilters,
  } = useSelector((state) => state.bookingWorkorder);

  const formInitialValues = {
    fieldName: '',
    fieldValue: '',
  };

  const currentValidationSchema = Yup.object().shape({
    fieldName: Yup.object()
      .nullable()
      .required('Field required'),
    fieldValue: Yup.string()
      .required('Value required')
      .max(20, 'Search value cannot be more than 20 characters'),
  });

  function handleSubmit(values, { resetForm }) {
    const filters = [{
      key: values.fieldName.value, value: encodeURIComponent(values.fieldValue), label: values.fieldName.label, type: Array.isArray(values.fieldName.value) ? 'array' : 'text',
    }];
    const filterValues = {
      bookingType: workorderFilters && workorderFilters.bookingType ? workorderFilters.bookingType : [],
      states: workorderFilters && workorderFilters.states ? workorderFilters.states : [],
      types: workorderFilters && workorderFilters.types ? workorderFilters.types : [],
      maintenanceStatus: workorderFilters && workorderFilters.maintenanceStatus ? workorderFilters.maintenanceStatus : [],
      customFilters: workorderFilters && workorderFilters.customFilters ? workorderFilters.customFilters : [],
      searchFilters: filters,
    };
    dispatch(getWorkorderFilter(filterValues));
    resetForm({ values: '' });
    if (afterReset) afterReset();
  }

  return (
    <Row>
      <Col md="12" sm="12" lg="12" xs="12">
        <Formik
          initialValues={formInitialValues}
          validationSchema={currentValidationSchema}
          // eslint-disable-next-line react/jsx-no-bind
          onSubmit={handleSubmit}
        >
          {({ isValid, dirty, values }) => (
            <Form id="filter_frm">

              <ThemeProvider theme={theme}>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <FormikAutocomplete
                    disableClearable={!(values && values.fieldName)}
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
                        placeholder="Select Field"
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
                <Col xs={12} sm={12} md={12} lg={12}>
                  <InputField
                    className="search-input-field"
                    name="fieldValue"
                    label="Value"
                    type="text"
                    maxLength={21}
                  />
                </Col>
              </ThemeProvider>
              <hr />
              <div className="float-right">
                <Button
                  className="go-search-btn"
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

Filters.propTypes = {
  afterReset: PropTypes.func.isRequired,
  setSelectedFilter: PropTypes.func.isRequired,
};

export default Filters;
