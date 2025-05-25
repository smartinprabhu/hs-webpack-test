/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable camelcase */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Row, Col,
} from 'reactstrap';
import { useFormikContext } from 'formik';
import {
  TextField, CircularProgress, FormHelperText,
} from '@material-ui/core';

import { useSelector, useDispatch } from 'react-redux';
import { InputField, FormikAutocomplete } from '@shared/formFields';
import {
  getCountries,
  getStates,
} from '../../../adminSetup/setupService';
import { noSpecialChars, integerKeyPress, generateErrorMessage } from '../../../util/appUtils';

const appModels = require('../../../util/appModels').default;

const BasicSetup = (props) => {
  const {
    formField: {
      nameValue,
      bankCode,
      address,
      city,
      stateId,
      countryId,
      zip,
      phone,
      email,
    },
  } = props;
  const { values: formValues } = useFormikContext();
  const {
    country_id,
  } = formValues;
  const dispatch = useDispatch();
  const [countryOpen, setCountryOpen] = useState(false);
  const [countryKeyword, setCountryKeyword] = useState('');
  const [stateOpen, setStateOpen] = useState(false);
  const [stateKeyword, setStateKeyword] = useState('');
  const { userInfo } = useSelector((state) => state.user);
  const {
    countriesInfo, statesInfo,
  } = useSelector((state) => state.setup);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && countryOpen) {
        await dispatch(getCountries(userInfo.data.company.id, appModels.COUNTRY, countryKeyword));
      }
    })();
  }, [userInfo, countryKeyword, countryOpen]);

  useEffect(() => {
    (async () => {
      if ((country_id && country_id.id) && stateOpen) {
        const cid = country_id && country_id.id ? country_id.id : '';
        await dispatch(getStates(appModels.STATES, cid, stateKeyword));
      }
    })();
  }, [country_id, stateKeyword, stateOpen]);

  const onCountryKeywordChange = (event) => {
    setCountryKeyword(event.target.value);
  };

  const onStateKeywordChange = (event) => {
    setStateKeyword(event.target.value);
  };

  let countryOptions = [];
  let stateOptions = [];

  if (countriesInfo && countriesInfo.loading) {
    countryOptions = [{ name: 'Loading..' }];
  }
  if (statesInfo && statesInfo.loading) {
    stateOptions = [{ name: 'Loading..' }];
  }

  return (
    <>
      <Row className="ml-5 mr-5">
        <Col md="12" sm="6" lg="6" xs="6">
          <Col md="12" sm="12" lg="12" xs="12">
            <InputField
              name={nameValue.name}
              label={nameValue.label}
              isRequired={nameValue.required}
              type="text"
              maxLength="50"
              onKeyPress={noSpecialChars}
            />
          </Col>
          <Col md="12" sm="12" lg="12" xs="12">
            <InputField
              name={address.name}
              label={address.label}
              formGroupClassName="m-1"
              type="text"
              maxLength="250"
            />
          </Col>
          <Row className="pl-3 pr-3">
            <Col sm="6" md="6" xs="12" lg="6">
              <InputField
                name={city.name}
                label=""
                type="text"
                formGroupClassName="ml-1"
                labelClassName="m-0"
                placeholder={city.label}
                onKeyPress={noSpecialChars}
                maxLength="50"
              />
            </Col>
            <Col sm="6" md="6" xs="12" lg="6" className="">
              <FormikAutocomplete
                name={countryId.name}
                label=""
                formGroupClassName="ml-1"
                labelClassName=""
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
              {(countriesInfo && countriesInfo.err && countryOpen) && (<FormHelperText><span className="text-danger">{generateErrorMessage(countriesInfo)}</span></FormHelperText>) }
            </Col>
            <Col sm="6" md="6" xs="12" lg="6">
              <InputField
                name={zip.name}
                label=""
                type="text"
                formGroupClassName="ml-1"
                labelClassName="m-0"
                placeholder={zip.label}
                onKeyPress={integerKeyPress}
                maxLength="10"
              />
            </Col>
            <Col sm="6" md="6" xs="12" lg="6">
              <FormikAutocomplete
                name={stateId.name}
                label=""
                formGroupClassName=""
                labelClassName=""
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
              {(statesInfo && statesInfo.err && stateOpen) && (<FormHelperText><span className="text-danger">{generateErrorMessage(statesInfo)}</span></FormHelperText>) }
            </Col>
          </Row>
        </Col>
        <Col md="12" sm="6" lg="6" xs="6">
          <Col md="12" sm="12" lg="12" xs="12">
            <InputField
              name={bankCode.name}
              label={bankCode.label}
              type="text"
              maxLength="12"
              onKeyPress={integerKeyPress}
            />
          </Col>
          <Col md="12" sm="12" lg="12" xs="12">
            <InputField
              name={phone.name}
              label={phone.label}
              type="text"
              maxLength="12"
              onKeyPress={integerKeyPress}
            />
          </Col>
          <Col md="12" sm="12" lg="12" xs="12">
            <InputField
              name={email.name}
              label={email.label}
              maxLength="50"
              type="email"
            />
          </Col>
        </Col>
      </Row>
    </>
  );
};

BasicSetup.propTypes = {
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default BasicSetup;
