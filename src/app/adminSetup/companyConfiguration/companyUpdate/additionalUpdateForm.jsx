/* eslint-disable camelcase */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import {
  Col,
  Row,
  Label,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
  TextField, CircularProgress, FormHelperText,
} from '@material-ui/core';
import { useFormikContext } from 'formik';
import PropTypes from 'prop-types';

import { InputField, FormikAutocomplete, CheckboxFieldGroup } from '@shared/formFields';
import formFields from './formFields.json';
import {
  getIncoterms,
  getNomenClatures,
} from '../../setupService';
import {
  decimalKeyPress, integerKeyPress, generateErrorMessage, getAllowedCompanies,
} from '../../../util/appUtils';

const appModels = require('../../../util/appModels').default;

const AdditionalUpdateForm = (props) => {
  const {
    setFieldValue,
  } = props;
  const dispatch = useDispatch();
  const { values: formValues } = useFormikContext();
  const {
    incoterm_id, nomenclature_id, is_parent,
  } = formValues;
  const [itOpen, setItOpen] = useState(false);
  const [itKeyword, setItKeyword] = useState('');
  const [ncOpen, setNcOpen] = useState(false);
  const [ncKeyword, setNcKeyword] = useState('');

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const {
    nomenclatureInfo, incotermInfo, companyDetail,
  } = useSelector((state) => state.setup);

  useEffect(() => {
    const isParent = companyDetail && companyDetail.data && companyDetail.data[0].is_parent ? 'yes' : 'no';
    setFieldValue('is_parent', isParent);
  }, []);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && itOpen) {
        await dispatch(getIncoterms(companies, appModels.INCOTERM, itKeyword));
      }
    })();
  }, [userInfo, itKeyword, itOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && ncOpen) {
        await dispatch(getNomenClatures(companies, appModels.NOMENCLATURE, ncKeyword));
      }
    })();
  }, [userInfo, ncKeyword, ncOpen]);

  function getIsParentInfo() {
    let isParent = companyDetail && companyDetail.data && companyDetail.data[0].is_parent ? 'yes' : 'no';

    if (is_parent === 'yes') {
      isParent = 'yes';
    }

    if (is_parent === 'no') {
      isParent = 'no';
    }

    return isParent;
  }

  useEffect(() => {
    getIsParentInfo();
  }, [is_parent]);

  const onNcKeywordChange = (event) => {
    setNcKeyword(event.target.value);
  };

  const onItKeywordChange = (event) => {
    setItKeyword(event.target.value);
  };

  let itOptions = [];
  let ncOptions = [];

  if (incotermInfo && incotermInfo.loading) {
    itOptions = [{ name: 'Loading..' }];
  }
  if (incoterm_id && incoterm_id.length && incoterm_id.length > 0) {
    const oldItId = [{ id: incoterm_id[0], name: incoterm_id[1] }];
    const newArr = [...itOptions, ...oldItId];
    itOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  if (incotermInfo && incotermInfo.data) {
    const arr = [...itOptions, ...incotermInfo.data];
    itOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }

  if (nomenclatureInfo && nomenclatureInfo.loading) {
    ncOptions = [{ name: 'Loading..' }];
  }
  if (nomenclature_id && nomenclature_id.length && nomenclature_id.length > 0) {
    const oldNcId = [{ id: nomenclature_id[0], name: nomenclature_id[1] }];
    const newArr = [...ncOptions, ...oldNcId];
    ncOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  if (nomenclatureInfo && nomenclatureInfo.data) {
    const arr = [...ncOptions, ...nomenclatureInfo.data];
    ncOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }

  const oldIncotermId = incoterm_id && incoterm_id.length && incoterm_id.length > 0 ? incoterm_id[1] : '';
  const OldNomenClatureId = nomenclature_id && nomenclature_id.length && nomenclature_id.length > 0 ? nomenclature_id[1] : '';

  return (

    <>
      <Row className="p-1">
        {formFields && formFields.additionalFields && formFields.additionalFields.map((fields) => (
          <React.Fragment key={fields.id}>
            {(fields.type !== 'array') && (fields.name === 'code') && (
            <Col sm="12" md="12" xs="12" lg="6">
              <InputField
                name={fields.name}
                label={fields.label}
                type={fields.type}
                formGroupClassName="m-1"
                readOnly={fields.readonly}
                maxLength="10"
              />
            </Col>
            )}
            {(fields.type !== 'array') && (fields.name === 'phone') && (
            <Col sm="12" md="12" xs="12" lg="6">
              <InputField
                name={fields.name}
                label={fields.label}
                type={fields.type}
                formGroupClassName="m-1"
                readOnly={fields.readonly}
                onKeyPress={integerKeyPress}
                maxLength="15"
              />
            </Col>
            )}
            {(fields.type !== 'array') && (fields.name === 'email') && (
            <Col sm="12" md="12" xs="12" lg="6">
              <InputField
                name={fields.name}
                label={fields.label}
                type={fields.type}
                formGroupClassName="m-1"
                readOnly={fields.readonly}
                maxLength="25"
              />
            </Col>
            )}
            {(fields.type !== 'array') && (fields.name === 'vat') && (
            <Col sm="12" md="12" xs="12" lg="6">
              <InputField
                name={fields.name}
                label={fields.label}
                type={fields.type}
                formGroupClassName="m-1"
                readOnly={fields.readonly}
                maxLength="25"
              />
            </Col>
            )}
            {(fields.type !== 'array') && (fields.name === 'company_registry') && (
            <Col sm="12" md="12" xs="12" lg="6">
              <InputField
                name={fields.name}
                label={fields.label}
                type={fields.type}
                formGroupClassName="m-1"
                readOnly={fields.readonly}
                maxLength="25"
              />
            </Col>
            )}
            {(fields.type === 'array') && (fields.name === 'incoterm_id') && (
            <Col sm="12" md="12" xs="12" lg="6">
              <FormikAutocomplete
                name={fields.name}
                label={fields.label}
                formGroupClassName="m-1 w-100"
                oldValue={oldIncotermId}
                value={incoterm_id && incoterm_id.name ? incoterm_id.name : oldIncotermId}
                open={itOpen}
                size="small"
                onOpen={() => {
                  setItOpen(true);
                  setItKeyword('');
                }}
                onClose={() => {
                  setItOpen(false);
                  setItKeyword('');
                }}
                loading={incotermInfo && incotermInfo.loading}
                getOptionSelected={(option, value) => option.name === value.name}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                options={itOptions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    onChange={onItKeywordChange}
                    variant="outlined"
                    className="without-padding"
                    placeholder="Search and Select"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {incotermInfo && incotermInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
              {(incotermInfo && incotermInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(incotermInfo)}</span></FormHelperText>) }
            </Col>
            )}
            {(fields.type === 'array') && (fields.name === 'nomenclature_id') && (
            <Col sm="12" md="12" xs="12" lg="6">
              <FormikAutocomplete
                name={fields.name}
                label={fields.label}
                formGroupClassName="m-1 w-100"
                oldValue={OldNomenClatureId}
                value={nomenclature_id && nomenclature_id.name ? nomenclature_id.name : OldNomenClatureId}
                open={ncOpen}
                size="small"
                onOpen={() => {
                  setNcOpen(true);
                  setNcKeyword('');
                }}
                onClose={() => {
                  setNcOpen(false);
                  setNcKeyword('');
                }}
                loading={nomenclatureInfo && nomenclatureInfo.loading}
                getOptionSelected={(option, value) => option.name === value.name}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                options={ncOptions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    onChange={onNcKeywordChange}
                    variant="outlined"
                    className="without-padding"
                    placeholder="Search and Select"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {nomenclatureInfo && nomenclatureInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
              {(nomenclatureInfo && nomenclatureInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(nomenclatureInfo)}</span></FormHelperText>) }
            </Col>
            )}
            {(fields.type !== 'array') && (fields.name === 'is_parent') && (
            <Col sm="12" md="12" xs="12" lg="6">
              <Label for="Is Parent" className="mb-0 mt-1">
                Is Parent
                <span className="ml-1 text-danger" />
              </Label>
              <br />
              <CheckboxFieldGroup
                name="is_parent"
                checkedvalue="yes"
                customvalue={getIsParentInfo()}
                id="yes"
                label="Yes"
              />
              <CheckboxFieldGroup
                name="is_parent"
                checkedvalue="no"
                customvalue={getIsParentInfo()}
                id="no"
                label="No"
              />
            </Col>
            )}
            {(fields.type !== 'array') && (fields.name === 'latitude') && (
            <Col sm="12" md="12" xs="12" lg="6">
              <InputField
                name={fields.name}
                label={fields.label}
                type={fields.type}
                formGroupClassName="m-1"
                readOnly={fields.readonly}
                onKeyPress={decimalKeyPress}
                maxLength="50"
              />
            </Col>
            )}
            {(fields.type !== 'array') && (fields.name === 'longitude') && (
            <Col sm="12" md="12" xs="12" lg="6">
              <InputField
                name={fields.name}
                label={fields.label}
                type={fields.type}
                formGroupClassName="m-1"
                readOnly={fields.readonly}
                onKeyPress={decimalKeyPress}
                maxLength="50"
              />
            </Col>
            )}
          </React.Fragment>
        ))}
      </Row>
    </>
  );
};

AdditionalUpdateForm.propTypes = {
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default AdditionalUpdateForm;
