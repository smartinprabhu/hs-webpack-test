/* eslint-disable import/no-unresolved */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import {
    Col,
  Label,
  Row,
} from 'reactstrap';
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import * as PropTypes from 'prop-types';
import { Formik, Form } from 'formik';
import {
  TextField, CircularProgress, FormHelperText, FormControl,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { ThemeProvider, makeStyles } from '@material-ui/core/styles';

import { InputField, FormikAutocomplete, CheckboxFieldGroup } from '@shared/formFields';
import {
  getCountries,
  getStates,
} from '../../../../adminSetup/setupService';
import {
  storeContacts,
} from '../../../purchaseService';
import validationSchema from './formModel/validationSchema';
import contactFormModel from './formModel/contactFormModel';
import formInitialValues from './formModel/formInitialValues';
import {
  generateErrorMessage, noSpecialChars,
  integerKeyPress, getAllowedCompanies,
} from '../../../../util/appUtils';
import { getEmployeeList } from '../../../../assets/equipmentService';
import customData from '../../data/customData.json';

import theme from '../../../../util/materialTheme';

const useStyles = makeStyles(() => ({
  margin: {
    marginBottom: '0.25rem',
    width: '100%',
  },
}));

const appModels = require('../../../../util/appModels').default;

const { formId, formField } = contactFormModel;

const AddContact = (props) => {
  const {
    afterReset,
  } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [employeeKeyword, setEmployeeKeyword] = useState('');
  const [employeeShow, setEmployeeOpen] = useState(false);
  const [countryIdValue, setCountryIdValue] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const [countryKeyword, setCountryKeyword] = useState('');
  const [stateOpen, setStateOpen] = useState(false);
  const [stateKeyword, setStateKeyword] = useState('');
  const [genderOpen, setGenderOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const {
    countriesInfo, statesInfo,
  } = useSelector((state) => state.setup);
  const { employeesInfo } = useSelector((state) => state.equipment);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && employeeShow) {
        await dispatch(getEmployeeList(companies, appModels.USER, employeeKeyword));
      }
    })();
  }, [userInfo, employeeKeyword, employeeShow]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && countryOpen) {
        await dispatch(getCountries(companies, appModels.COUNTRY, countryKeyword));
      }
    })();
  }, [userInfo, countryKeyword, countryOpen]);

  useEffect(() => {
    (async () => {
      if (stateOpen && countryIdValue && countryIdValue.id) {
        await dispatch(getStates(appModels.STATES, countryIdValue.id, stateKeyword));
      }
    })();
  }, [stateOpen, countryIdValue, stateKeyword]);

  const onEmployeeKeywordChange = (event) => {
    setEmployeeKeyword(event.target.value);
  };

  const onCountryKeywordChange = (event) => {
    setCountryKeyword(event.target.value);
  };

  const onStateKeywordChange = (event) => {
    setStateKeyword(event.target.value);
  };

  function handleSubmit(values) {
    const countryId = values.country_id ? values.country_id.id : '';
    const stateId = values.state_id && values.state_id.id
      ? values.state_id.id : false;
    const userId = values.user_id && values.user_id.id
      ? values.user_id.id : false;
    const visitorType = values.visitor_type && values.visitor_type.value
      ? values.visitor_type.value : false;
    const gender = values.gender && values.gender.value
      ? values.gender.value : false;

    const postData = { ...values };

    postData.country_id = countryId;
    postData.user_id = userId;
    postData.state_id = stateId;
    postData.visitor_type = visitorType;
    postData.gender = gender;

    dispatch(storeContacts([postData]));
    if (afterReset) afterReset();
  }

  let countryOptions = [];
  let stateOptions = [];
  let employeeOptions = [];

  if (countriesInfo && countriesInfo.loading) {
    countryOptions = [{ name: 'Loading..' }];
  }
  if (countriesInfo && countriesInfo.data) {
    countryOptions = countriesInfo.data;
  }

  if (statesInfo && statesInfo.loading) {
    stateOptions = [{ name: 'Loading..' }];
  }
  if (statesInfo && statesInfo.data) {
    stateOptions = statesInfo.data;
  }

  if (employeesInfo && employeesInfo.loading) {
    employeeOptions = [{ name: 'Loading..' }];
  }
  if (employeesInfo && employeesInfo.data) {
    employeeOptions = employeesInfo.data;
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
            isValid, dirty, values, setFieldValue,
          }) => (
            <Form id={formId}>
              <ThemeProvider theme={theme}>
                <Row className="ml-4 mr-4">
                  <Col md="12" sm="11" lg="11" xs="11">
                    <CheckboxFieldGroup
                      name={formField.type.name}
                      checkedvalue="contact"
                      id="contact"
                      label={formField.type.label}
                    />
                    <CheckboxFieldGroup
                      name={formField.type.name}
                      checkedvalue="invoice"
                      id="invoice"
                      label={formField.type.label1}
                    />
                    <CheckboxFieldGroup
                      name={formField.type.name}
                      checkedvalue="delivery"
                      id="delivery"
                      label={formField.type.label2}
                    />
                    <CheckboxFieldGroup
                      name={formField.type.name}
                      checkedvalue="other"
                      id="other"
                      label={formField.type.label3}
                    />
                    <CheckboxFieldGroup
                      name={formField.type.name}
                      checkedvalue="private"
                      id="private"
                      label={formField.type.label4}
                    />
                  </Col>
                  <Col md="6" sm="6" lg="6" xs="12">
                    <Col md="12" sm="11" lg="11" xs="11">
                      <InputField
                        name={formField.nameValue.name}
                        label={formField.nameValue.label}
                        isRequired={formField.nameValue.required}
                        formGroupClassName="mb-1"
                        type="text"
                        onKeyPress={noSpecialChars}
                        maxLength="30"
                      />
                    </Col>
                    <Col md="12" sm="11" lg="11" xs="11">
                      <FormikAutocomplete
                        name={formField.visitorType.name}
                        label={formField.visitorType.label}
                        formGroupClassName="mb-1 w-100"
                        isRequired
                        open={typeOpen}
                        size="small"
                        onOpen={() => {
                          setTypeOpen(true);
                        }}
                        onClose={() => {
                          setTypeOpen(false);
                        }}
                        getOptionSelected={(option, value) => option.label === value.label}
                        getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                        options={customData && customData.visitorTypes ? customData.visitorTypes : []}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            className="without-padding"
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
                    <Col md="12" sm="11" lg="11" xs="11">
                      <FormikAutocomplete
                        name={formField.gender.name}
                        label={formField.gender.label}
                        formGroupClassName="mb-1 w-100"
                        isRequired
                        open={genderOpen}
                        size="small"
                        onOpen={() => {
                          setGenderOpen(true);
                        }}
                        onClose={() => {
                          setGenderOpen(false);
                        }}
                        getOptionSelected={(option, value) => option.label === value.label}
                        getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                        options={customData && customData.genders ? customData.genders : []}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            className="without-padding"
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
                    <Col md="12" sm="11" lg="11" xs="11">
                      <InputField
                        name={formField.phone.name}
                        label={formField.phone.label}
                        isRequired={formField.phone.required}
                        formGroupClassName="mb-1"
                        type="text"
                        onKeyPress={integerKeyPress}
                        maxLength="15"
                      />
                    </Col>
                    <Col md="12" sm="11" lg="11" xs="11">
                      <InputField
                        name={formField.email.name}
                        label={formField.email.label}
                        isRequired={formField.nameValue.required}
                        formGroupClassName="mb-1"
                        type="text"
                        maxLength="30"
                      />
                    </Col>
                    <Col md="12" sm="11" lg="11" xs="11">
                      <FormikAutocomplete
                        name={formField.userId.name}
                        label={formField.userId.label}
                        isRequired={formField.stateId.required}
                        formGroupClassName="mb-1 w-100"
                        className="bg-white"
                        open={employeeShow}
                        size="small"
                        onOpen={() => {
                          setEmployeeOpen(true);
                          setEmployeeKeyword('');
                        }}
                        onClose={() => {
                          setEmployeeOpen(false);
                          setEmployeeKeyword('');
                        }}
                        loading={employeesInfo && employeesInfo.loading}
                        getOptionSelected={(option, value) => option.name === value.name}
                        getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                        options={employeeOptions}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            onChange={onEmployeeKeywordChange}
                            variant="outlined"
                            className="without-padding"
                            placeholder="Search & Select"
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <>
                                  {employeesInfo && employeesInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                                  {params.InputProps.endAdornment}
                                </>
                              ),
                            }}
                          />
                        )}
                      />
                      {(employeesInfo && employeesInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(employeesInfo)}</span></FormHelperText>) }
                    </Col>
                  </Col>
                  {values && values.type && values.type !== 'contact' && (
                  <Col md="6" sm="6" lg="6" xs="12">
                    <Col md="12" sm="11" lg="11" xs="11">
                      <InputField
                        name={formField.addressLineOne.name}
                        label={formField.addressLineOne.label}
                        isRequired={formField.addressLineOne.required}
                        formGroupClassName="mb-1"
                        type="text"
                        maxLength="100"
                      />
                    </Col>
                    <Col md="12" sm="11" lg="11" xs="11">
                      <InputField
                        name={formField.addressLineTwo.name}
                        label={formField.addressLineTwo.label}
                        isRequired={formField.addressLineTwo.required}
                        formGroupClassName="mb-1"
                        type="text"
                        maxLength="100"
                      />
                    </Col>
                    <Col md="12" sm="11" lg="11" xs="11">
                      <InputField
                        name={formField.cityValue.name}
                        label={formField.cityValue.label}
                        isRequired={formField.cityValue.required}
                        formGroupClassName="mb-1"
                        type="text"
                        onKeyPress={noSpecialChars}
                        maxLength="50"
                      />
                    </Col>
                    <Col xs={12} sm={11} md={11} lg={11}>
                      <FormControl className={classes.margin}>
                        <Label for={formField.countryId.name}>
                          {formField.countryId.label}
                        </Label>
                        <Autocomplete
                          name={formField.countryId.name}
                          className="bg-white"
                          open={countryOpen}
                          size="small"
                          onOpen={() => {
                            setCountryOpen(true);
                            setCountryKeyword('');
                          }}
                          onClose={() => {
                            setCountryOpen(false);
                            setCountryKeyword('');
                          }}
                          loading={countriesInfo && countriesInfo.loading}
                          getOptionSelected={(option, value) => (value.length > 0 ? option.name === value.name : '')}
                          getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                          options={countryOptions}
                          onChange={(e, data) => { setFieldValue(formField.countryId.name, data); setFieldValue(formField.stateId.name, ''); setCountryIdValue(data); }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              onChange={onCountryKeywordChange}
                              variant="outlined"
                              className="without-padding"
                              placeholder="Search & Select"
                              InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                  <>
                                    {countriesInfo && countriesInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                  </>
                                ),
                              }}
                            />
                          )}
                        />
                      </FormControl>
                      {(countriesInfo && countriesInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(countriesInfo)}</span></FormHelperText>)}
                    </Col>
                    <Col xs={12} sm={12} md={11} lg={11}>
                      <FormikAutocomplete
                        name={formField.stateId.name}
                        label={formField.stateId.label}
                        isRequired={formField.stateId.required}
                        formGroupClassName="mb-1 w-100"
                        className="bg-white"
                        open={stateOpen}
                        size="small"
                        onOpen={() => {
                          setStateOpen(true);
                          setStateKeyword('');
                        }}
                        onClose={() => {
                          setStateOpen(false);
                          setStateKeyword('');
                        }}
                        loading={statesInfo && statesInfo.loading}
                        getOptionSelected={(option, value) => (value.length > 0 ? option.name === value.name : '')}
                        getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                        options={stateOptions}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            onChange={onStateKeywordChange}
                            variant="outlined"
                            className="without-padding"
                            placeholder="Search & Select"
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <>
                                  {statesInfo && statesInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                                  {params.InputProps.endAdornment}
                                </>
                              ),
                            }}
                          />
                        )}
                      />
                      {(statesInfo && statesInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(statesInfo)}</span></FormHelperText>)}
                    </Col>
                    <Col md="12" sm="11" lg="11" xs="11">
                      <InputField
                        name={formField.zip.name}
                        label={formField.zip.label}
                        isRequired={formField.zip.required}
                        formGroupClassName="mb-1"
                        type="text"
                        onKeyPress={integerKeyPress}
                        maxLength="10"
                      />
                    </Col>
                  </Col>
                  )}
                </Row>
                <hr />
                <div className="float-right mr-4">
                  <Button
                    disabled={!isValid && dirty}
                    type="submit"
                    size="sm"
                    variant="contained"
                  >
                    Create
                  </Button>
                </div>
              </ThemeProvider>
            </Form>
          )}
        </Formik>
      </Col>
    </Row>
  );
};

AddContact.propTypes = {
  afterReset: PropTypes.func.isRequired,
};

export default AddContact;
