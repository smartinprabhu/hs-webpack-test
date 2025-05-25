/* eslint-disable camelcase */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import {
  Col,
  Row,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useFormikContext } from 'formik';
import {
  TextField, CircularProgress, FormHelperText,
} from '@material-ui/core';

import { InputField, FormikAutocomplete } from '@shared/formFields';
import formFields from './formFields.json';
import {
  getCountries,
  getStates,
  getCompanyCategories,
  getCurrency,
} from '../../setupService';
import {
  generateErrorMessage, noSpecialChars, integerKeyPress,
  getAllowedCompanies,
} from '../../../util/appUtils';
import customData from '../../data/customData.json';

const appModels = require('../../../util/appModels').default;

const BasicUpdateForm = (props) => {
  const {
    setFieldValue,
  } = props;
  const dispatch = useDispatch();
  const { values: formValues } = useFormikContext();
  const {
    country_id, state_id, currency_id, res_company_categ_id,
    company_tz,
  } = formValues;
  const [countryOpen, setCountryOpen] = useState(false);
  const [countryKeyword, setCountryKeyword] = useState('');
  const [stateOpen, setStateOpen] = useState(false);
  const [stateKeyword, setStateKeyword] = useState('');
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categoryKeyword, setCategoryKeyword] = useState('');
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [currencyKeyword, setCurrencyKeyword] = useState('');
  const [tzOpen, setTzOpen] = useState(false);

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const {
    countriesInfo, statesInfo, companyDetail,
    companyCategoriesInfo, currencyInfo,
  } = useSelector((state) => state.setup);

  const fields = formFields && formFields.fields ? formFields.fields : {};

  useEffect(() => {
    const isParent = companyDetail && companyDetail.data && companyDetail.data[0].is_parent ? 'yes' : 'no';
    setFieldValue('is_parent', isParent);
  }, []);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && countryOpen) {
        await dispatch(getCountries(companies, appModels.COUNTRY, countryKeyword));
      }
    })();
  }, [userInfo, countryKeyword, countryOpen]);

  useEffect(() => {
    (async () => {
      if ((stateOpen && ((country_id && country_id.id) || (companyDetail && companyDetail.data && companyDetail.data[0].country_id)))) {
        const cid = country_id && country_id.id ? country_id.id : companyDetail.data[0].country_id[0];
        await dispatch(getStates(appModels.STATES, cid, stateKeyword));
      }
    })();
  }, [companyDetail, country_id, stateKeyword, stateOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && categoryOpen) {
        await dispatch(getCompanyCategories(companies, appModels.COMPANYCATEGORY, categoryKeyword));
      }
    })();
  }, [userInfo, categoryKeyword, categoryOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && currencyOpen) {
        await dispatch(getCurrency(companies, appModels.CURRENCY, currencyKeyword));
      }
    })();
  }, [userInfo, currencyKeyword, currencyOpen]);

  const onCountryKeywordChange = (event) => {
    setCountryKeyword(event.target.value);
  };

  const onCurrencyKeywordChange = (event) => {
    setCurrencyKeyword(event.target.value);
  };

  const onCategoryKeywordChange = (event) => {
    setCategoryKeyword(event.target.value);
  };

  const onStateKeywordChange = (event) => {
    setStateKeyword(event.target.value);
  };

  let countryOptions = [];
  let stateOptions = [];
  let categoryOptions = [];
  let currencyOptions = [];

  if (countriesInfo && countriesInfo.loading) {
    countryOptions = [{ name: 'Loading..' }];
  }
  if (statesInfo && statesInfo.loading) {
    stateOptions = [{ name: 'Loading..' }];
  }

  if (companyCategoriesInfo && companyCategoriesInfo.loading) {
    categoryOptions = [{ name: 'Loading..' }];
  }
  if (currencyInfo && currencyInfo.loading) {
    currencyOptions = [{ name: 'Loading..' }];
  }
  if (country_id && country_id.length && country_id.length > 0) {
    const oldCid = [{ id: country_id[0], name: country_id[1] }];
    const newArr = [...countryOptions, ...oldCid];
    countryOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  if (countriesInfo && countriesInfo.data) {
    const arr = [...countryOptions, ...countriesInfo.data];
    countryOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }
  if (state_id && state_id.length && state_id.length > 0) {
    const oldSid = [{ id: state_id[0], name: state_id[1] }];
    const newArr = [...stateOptions, ...oldSid];
    stateOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  if (statesInfo && statesInfo.data) {
    const arr = [...stateOptions, ...statesInfo.data];
    stateOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }
  if (res_company_categ_id && res_company_categ_id.length && res_company_categ_id.length > 0) {
    const oldCatId = [{ id: res_company_categ_id[0], name: res_company_categ_id[1] }];
    const newArr = [...categoryOptions, ...oldCatId];
    categoryOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  if (companyCategoriesInfo && companyCategoriesInfo.data) {
    const arr = [...categoryOptions, ...companyCategoriesInfo.data];
    categoryOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }
  if (currency_id && currency_id.length && currency_id.length > 0) {
    const oldCurrId = [{ id: currency_id[0], name: currency_id[1] }];
    const newArr = [...currencyOptions, ...oldCurrId];
    currencyOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  if (currencyInfo && currencyInfo.data) {
    const arr = [...currencyOptions, ...currencyInfo.data];
    currencyOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }

  const oldCompanyId = country_id && country_id.length && country_id.length > 0 ? country_id[1] : '';
  const oldStateId = state_id && state_id.length && state_id.length > 0 ? state_id[1] : '';
  const oldCategoryId = res_company_categ_id && res_company_categ_id.length && res_company_categ_id.length > 0 ? res_company_categ_id[1] : '';
  const oldCurrencyId = currency_id && currency_id.length && currency_id.length > 0 ? currency_id[1] : '';
  const oldTimeZone = company_tz || '';

  return (

    <>
      <Row className="p-1">
        <Col md="6" sm="6" lg="6" xs="12">
          <Col sm="12" md="12" xs="12" lg="12">
            <InputField
              name={fields.Name.name}
              label={fields.Name.label}
              type={fields.Name.type}
              formGroupClassName="m-1"
              isRequired
              readOnly={fields.Name.readonly}
              onKeyPress={noSpecialChars}
              maxLength="30"
            />
          </Col>
          <Col sm="12" md="12" xs="12" lg="12">
            <InputField
              name={fields.WebsiteId.name}
              label={fields.WebsiteId.label}
              type={fields.WebsiteId.type}
              isRequired
              formGroupClassName="m-1"
              readOnly={fields.WebsiteId.readonly}
              maxLength="30"
            />
          </Col>
          <Col sm="12" md="12" xs="12" lg="12">
            <InputField
              name={fields.AddressId.name}
              label={fields.AddressId.label}
              type={fields.AddressId.type}
              isRequired
              formGroupClassName="m-1"
              readOnly={fields.AddressId.readonly}
              maxLength="50"
            />
          </Col>
        </Col>
        <Col sm="6" md="6" xs="12" lg="6">
          <Col sm="12" md="12" xs="12" lg="12">
            <FormikAutocomplete
              name={fields.CategoryId.name}
              label={fields.CategoryId.label}
              formGroupClassName="m-1 w-100"
              isRequired
              oldValue={oldCategoryId}
              value={res_company_categ_id && res_company_categ_id.name ? res_company_categ_id.name : oldCategoryId}
              open={categoryOpen}
              size="small"
              onOpen={() => {
                setCategoryOpen(true);
                setCategoryKeyword('');
              }}
              onClose={() => {
                setCategoryOpen(false);
                setCategoryKeyword('');
              }}
              loading={companyCategoriesInfo && companyCategoriesInfo.loading}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={categoryOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={onCategoryKeywordChange}
                  variant="outlined"
                  className="without-padding"
                  placeholder="Search and Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {companyCategoriesInfo && companyCategoriesInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
            {(companyCategoriesInfo && companyCategoriesInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(companyCategoriesInfo)}</span></FormHelperText>) }
          </Col>
          <Col sm="12" md="12" xs="12" lg="12">
            <FormikAutocomplete
              name={fields.CurrencyId.name}
              label={fields.CurrencyId.label}
              formGroupClassName="m-1 w-100"
              isRequired
              oldValue={oldCurrencyId}
              value={currency_id && currency_id.name ? currency_id.name : oldCurrencyId}
              open={currencyOpen}
              size="small"
              onOpen={() => {
                setCurrencyOpen(true);
                setCurrencyKeyword('');
              }}
              onClose={() => {
                setCurrencyOpen(false);
                setCurrencyKeyword('');
              }}
              loading={currencyInfo && currencyInfo.loading}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={currencyOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={onCurrencyKeywordChange}
                  variant="outlined"
                  className="without-padding"
                  placeholder="Search and Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {currencyInfo && currencyInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
            {(currencyInfo && currencyInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(currencyInfo)}</span></FormHelperText>) }
          </Col>
          <Col sm="12" md="12" xs="12" lg="12">
            <FormikAutocomplete
              name={fields.TimeZone.name}
              label={fields.TimeZone.label}
              formGroupClassName="m-1 w-100"
              isRequired
              oldValue={oldTimeZone}
              value={company_tz || oldTimeZone}
              open={tzOpen}
              size="small"
              onOpen={() => {
                setTzOpen(true);
              }}
              onClose={() => {
                setTzOpen(false);
              }}
              getOptionSelected={(option, value) => option.label === value.label}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
              options={customData.timeZones}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  className="without-padding"
                  placeholder="Search and Select"
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
        </Col>
      </Row>
      <Row className="pl-3 pr-5">
        <Col sm="3" md="3" xs="12" lg="3">
          <InputField
            name={fields.CityId.name}
            label=""
            type=""
            isRequired={false}
            formGroupClassName="m-1"
            labelClassName="m-0"
            readOnly={fields.CityId.readonly}
            placeholder={fields.CityId.label}
            onKeyPress={noSpecialChars}
            maxLength="50"
          />
        </Col>
        <Col sm="3" md="3" xs="12" lg="3">
          <FormikAutocomplete
            name={fields.CountryId.name}
            label=""
            formGroupClassName="mb-2 w-100"
            labelClassName="mb-4"
            oldValue={oldCompanyId}
            value={country_id && country_id.name ? country_id.name : oldCompanyId}
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
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={countryOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onCountryKeywordChange}
                variant="outlined"
                className="without-padding"
                placeholder="Country"
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
          {(countriesInfo && countriesInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(countriesInfo)}</span></FormHelperText>) }
        </Col>
        <Col sm="6" md="6" xs="12" lg="6" />
        <Col sm="3" md="3" xs="12" lg="3">
          <InputField
            name={fields.ZipId.name}
            label=""
            type={fields.ZipId.type}
            isRequired={false}
            formGroupClassName="m-1"
            labelClassName="m-0"
            readOnly={fields.ZipId.readonly}
            placeholder={fields.ZipId.label}
            onKeyPress={integerKeyPress}
            maxLength="10"
          />
        </Col>
        <Col sm="3" md="3" xs="12" lg="3">
          <FormikAutocomplete
            name={fields.StateId.name}
            label=""
            formGroupClassName="mb-2 w-100"
            labelClassName="mb-4"
            oldValue={oldStateId}
            value={state_id && state_id.name ? state_id.name : oldStateId}
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
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={stateOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onStateKeywordChange}
                variant="outlined"
                className="without-padding"
                placeholder="State"
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
          {(statesInfo && statesInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(statesInfo)}</span></FormHelperText>) }
        </Col>
      </Row>
    </>
  );
};

BasicUpdateForm.propTypes = {
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default BasicUpdateForm;
