/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';
import * as PropTypes from 'prop-types';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { TextField } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import { Tooltip } from 'antd';
import {
  Popover, PopoverHeader, PopoverBody, Col, 
} from 'reactstrap';
import Button from '@mui/material/Button';
import { InputField, FormikAutocomplete } from '@shared/formFields';
import filterMiniIcon from '@images/icons/searchBlack.svg';
import { useDispatch, useSelector } from 'react-redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';

import theme from '../../util/materialTheme';
import { setInitialValues } from '../../purchase/purchaseService';

const Search = (props) => {
  const {
    formFields, searchHandleSubmit, idNameFilter, classNameFilter,
  } = props;

  const dispatch = useDispatch();
  const {
    filterInitailValues,
  } = useSelector((state) => state.purchase);

  const [open, setOpen] = useState(false);

  const formInitialValues = {
    fieldName: '',
    fieldValue: '',
  };

  const currentValidationSchema = Yup.object().shape({
    fieldName: Yup.string()
      .nullable()
      .required('Field required'),
    fieldValue: Yup.string()
      .required('Value required')
      .max(50, 'Search value cannot be more than 50 characters'),
  });

  function handleSubmit(values, { resetForm }) {
    searchHandleSubmit(values, { resetForm });
    resetForm({ values: '' });
    dispatch(setInitialValues(false, false, false, false));
  }

  return (
    <>
      <Tooltip title="Search" placement="top">
        <img
          aria-hidden="true"
          id={idNameFilter || 'Search'}
          alt="Search"
          className="cursor-pointer mr-2"
          src={filterMiniIcon}
          onClick={() => dispatch(setInitialValues(false, true, false, false))}
        />
      </Tooltip>
      <Popover placement="bottom" isOpen={filterInitailValues.search} target={idNameFilter || 'Search'} className={classNameFilter || 'search-popover-fields'} trigger="focus">
        <PopoverHeader>
          Search
          <FontAwesomeIcon
            size="lg"
            onClick={() => dispatch(setInitialValues(false, false, false, false))}
            className="cursor-pointer float-right"
            icon={faTimesCircle}
          />
        </PopoverHeader>
        <PopoverBody>
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
                        options={formFields}
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
                      className="mb-2"
                    >
                      Search
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </Col>
        </PopoverBody>
      </Popover>
    </>
  );
};

Search.defaultProps = {
  idNameFilter: false,
  classNameFilter: false,
};

Search.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  formFields: PropTypes.array.isRequired,
  searchHandleSubmit: PropTypes.func.isRequired,
  idNameFilter: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),
  classNameFilter: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),
};

export default Search;
