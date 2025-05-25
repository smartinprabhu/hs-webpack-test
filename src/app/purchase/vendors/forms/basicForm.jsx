/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {
  TextField, CircularProgress, FormHelperText,
} from '@material-ui/core';
import {
  Row, Col, Label,
  FormGroup, Spinner,
} from 'reactstrap';
import { useFormikContext } from 'formik';
import { Autocomplete } from '@material-ui/lab';
import ReactFileReader from 'react-file-reader';

import closeCircleIcon from '@images/icons/closeCircle.svg';
import filesBlackIcon from '@images/icons/filesBlack.svg';
import { InputField, FormikAutocomplete, CheckboxFieldGroup } from '@shared/formFields';
import {
  generateErrorMessage, lettersOnly, noSpecialChars, integerKeyPress,
  getArrayFromValuesById, getColumnArrayById, isArrayColumnExists,
  getAllowedCompanies,
} from '../../../util/appUtils';
import {
  getCountries,
  getStates,
} from '../../../adminSetup/setupService';
import {
  getPartnerTags, getVendorTags,
} from '../../purchaseService';
import customData from '../data/customData.json';
import { bytesToSize } from '../../../util/staticFunctions';

const appModels = require('../../../util/appModels').default;

const BasicForm = React.memo((props) => {
  const {
    editId,
    reload,
    setFieldValue,
    formField: {
      companyType,
      name,
      address,
      city,
      stateId,
      countryId,
      zip,
      phone,
      mobile,
      email,
      website,
      Lang,
      categoryId,
      companyName,
    },
  } = props;
  const dispatch = useDispatch();
  const { values: formValues } = useFormikContext();
  const {
    country_id,
    state_id,
    category_id,
    lang,
    company_type,
    image_medium,
  } = formValues;
  const [countryOpen, setCountryOpen] = useState(false);
  const [countryKeyword, setCountryKeyword] = useState('');
  const [tagOpen, setTagOpen] = useState(false);
  const [refresh, setRefresh] = useState(reload);
  const [tagKeyword, setTagKeyword] = useState('');
  const [stateOpen, setStateOpen] = useState(false);
  const [stateKeyword, setStateKeyword] = useState('');
  const [langOpen, setLangOpen] = useState(false);
  const [imgValidation, setimgValidation] = useState(false);
  const [imgSize, setimgSize] = useState(false);
  const [fileDataImage, setFileDataImage] = useState(image_medium);
  const [fileType, setFileType] = useState('data:image/png;base64,');

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const {
    countriesInfo, statesInfo,
  } = useSelector((state) => state.setup);
  const { partnerTagsInfo, vendorTags, vendorDetails } = useSelector((state) => state.purchase);

  useEffect(() => {
    setRefresh(reload);
  }, [reload]);

  useEffect(() => {
    if (vendorDetails && vendorDetails.data && vendorDetails.data[0].category_id && editId && refresh === '1') {
      dispatch(getVendorTags(vendorDetails.data[0].category_id, appModels.PARTNERCATEGORY));
    }
  }, [editId, vendorDetails, refresh]);

  useEffect(() => {
    if (vendorTags && vendorTags.data && editId && refresh === '1') {
      setFieldValue('category_id', vendorTags.data);
    }
  }, [editId, vendorTags, refresh]);

  useEffect(() => {
    if (refresh === '1') {
      setimgValidation(false);
      setimgSize(false);
      setFileDataImage(false);
      setFileType('');
    }
  }, [refresh]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && countryOpen) {
        await dispatch(getCountries(companies, appModels.COUNTRY, countryKeyword));
      }
    })();
  }, [userInfo, countryKeyword, countryOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && refresh === '1') {
        await dispatch(getPartnerTags(companies, appModels.PARTNERCATEGORY, tagKeyword));
      }
    })();
  }, [userInfo, refresh]);

  const oldCountIdValue = country_id && country_id.length && country_id.length > 0 ? country_id[0] : '';

  useEffect(() => {
    (async () => {
      if (((country_id && country_id.id) || (oldCountIdValue)) && stateOpen) {
        const cid = country_id && country_id.id ? country_id.id : oldCountIdValue;
        await dispatch(getStates(appModels.STATES, cid, stateKeyword));
      }
    })();
  }, [country_id, stateKeyword, stateOpen, oldCountIdValue]);

  const onCountryKeywordChange = (event) => {
    setCountryKeyword(event.target.value);
  };

  const onStateKeywordChange = (event) => {
    setStateKeyword(event.target.value);
  };

  const onTagKeywordChange = (event) => {
    setTagKeyword(event.target.value);
  };

  const setTags = (data) => {
    setFieldValue('category_id', data);
  };

  const handleFiles = (files) => {
    setimgValidation(false);
    setimgSize(false);
    if (files) {
      const { type } = files.fileList[0];

      if (!type.includes('image')) {
        setimgValidation(true);
      } else if (!bytesToSize(files.fileList[0].size)) {
        setimgSize(true);
      } else {
        const remfile = `data:${files.fileList[0].type};base64,`;
        setFileType(remfile);
        const fileData = files.base64.replace(remfile, '');
        setFileDataImage(fileData);
        setFieldValue('image_medium', fileData);
        setFieldValue('image_small', fileData);
      }
    }
  };

  function isAssociativeArray(arr) {
    let result = arr;
    if (isArrayColumnExists(arr, 'id')) {
      result = getColumnArrayById(arr, 'id');
    }
    return result;
  }

  let countryOptions = [];
  let stateOptions = [];
  let tagOptions = [];

  if (countriesInfo && countriesInfo.loading) {
    countryOptions = [{ name: 'Loading..' }];
  }
  if (statesInfo && statesInfo.loading) {
    stateOptions = [{ name: 'Loading..' }];
  }

  if (country_id && country_id.length && country_id.length > 0) {
    const oldId = [{ id: country_id[0], name: country_id[1] }];
    const newArr = [...countryOptions, ...oldId];
    countryOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  if (countriesInfo && countriesInfo.data) {
    const arr = [...countryOptions, ...countriesInfo.data];
    countryOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }
  if (countriesInfo && countriesInfo.err) {
    countryOptions = [];
  }

  if (state_id && state_id.length && state_id.length > 0) {
    const oldId = [{ id: state_id[0], name: state_id[1] }];
    const newArr = [...stateOptions, ...oldId];
    stateOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  if (statesInfo && statesInfo.data) {
    const arr = [...stateOptions, ...statesInfo.data];
    stateOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }
  if (statesInfo && statesInfo.err) {
    stateOptions = [];
  }

  if (partnerTagsInfo && partnerTagsInfo.data) {
    tagOptions = [{ name: 'Loading..' }];
  }

  if (partnerTagsInfo && partnerTagsInfo.data) {
    tagOptions = getArrayFromValuesById(partnerTagsInfo.data, isAssociativeArray(category_id || []), 'id');
  }

  const oldStateId = state_id && state_id.length && state_id.length > 0 ? state_id[1] : '';
  const oldCountryId = country_id && country_id.length && country_id.length > 0 ? country_id[1] : '';
  const oldLang = lang && customData && customData.langugageTypes && customData.langugageTypes[lang] ? customData.langugageTypes[lang].label : '';

  return (
    <>

      <Row className="mb-1 create-vendors-form">
        <Col xs={12} sm={6} lg={6} md={6}>
          <Col md="12" sm="12" lg="12" xs="12">
            <Label for={companyType.name} className="font-weight-600 m-0">
              Type
            </Label>
            <br />
            <CheckboxFieldGroup
              name={companyType.name}
              checkedvalue="person"
              id="person"
              label={companyType.label1}
            />
            <CheckboxFieldGroup
              name={companyType.name}
              checkedvalue="company"
              id="company"
              label={companyType.label}
            />
          </Col>
          <Col xs={12} sm={12} lg={12} md={12}>
            <InputField name={name.name} label={name.label} autoComplete="off" isRequired type="text" formGroupClassName="m-1" maxLength="30" />
          </Col>
          <Col xs={12} md={12} lg={12} sm={12}>
            <InputField
              name={address.name}
              label={address.label}
              isRequired
              autoComplete="off"
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
                isRequired={false}
                autoComplete="off"
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
                oldValue={oldCountryId}
                value={country_id && country_id.name ? country_id.name : oldCountryId}
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
                      form: {
                        autoComplete: 'off',
                      },
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
                isRequired={false}
                autoComplete="off"
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
                oldValue={oldStateId}
                value={state_id && state_id.name ? state_id.name : oldStateId}
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
                      form: {
                        autoComplete: 'off',
                      },
                    }}
                  />
                )}
              />
              {(statesInfo && statesInfo.err && stateOpen) && (<FormHelperText><span className="text-danger">{generateErrorMessage(statesInfo)}</span></FormHelperText>) }
            </Col>
          </Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <FormGroup>
              <Label for="logo">Vendor Logo</Label>
              {!fileDataImage && (
              <ReactFileReader
                multiple
                elementId="fileUpload"
                handleFiles={handleFiles}
                fileTypes=".png"
                base64
              >
                <div className="cursor-pointer text-center border-style-dashed bg-snow border-color-whisper border-radius-5px p-1">
                  <img alt="upload" src={filesBlackIcon} className="mt-2 mb-2 fa-3x" />
                  <p className="font-weight-500">Select a file</p>
                </div>
              </ReactFileReader>
              )}
              {(!fileDataImage && (editId && vendorDetails && vendorDetails.data && vendorDetails.data[0].image_medium)) && (
              <div className="position-relative mt-2">
                <img
                  src={`data:image/png;base64,${vendorDetails.data[0].image_medium}`}
                  height="150"
                  width="150"
                  className="ml-3"
                  alt="uploaded"
                />
              </div>
              )}
              {fileDataImage && (
              <div className="position-relative mt-2">
                <img
                  src={`${fileType}${fileDataImage}`}
                  height="150"
                  width="150"
                  className="ml-3"
                  alt="uploaded"
                />
                <div className="position-absolute topright-img-close">
                  <img
                    aria-hidden="true"
                    src={closeCircleIcon}
                    className="cursor-pointer"
                    onClick={() => {
                      setimgValidation(false);
                      setimgSize(false);
                      setFileDataImage(false);
                      setFileType(false);
                      setFieldValue('image_medium', false);
                      setFieldValue('image_small', false);
                    }}
                    alt="remove"
                  />
                </div>
              </div>
              )}
            </FormGroup>
            {imgValidation && (<FormHelperText><span className="text-danger">Choose Image Only...</span></FormHelperText>)}
            {imgSize && (<FormHelperText><span className="text-danger">Maximum File Upload Size 1MB...</span></FormHelperText>)}
          </Col>
        </Col>
        <Col xs={12} sm={6} lg={6} md={6}>
          <Col xs={12} md={12} lg={12} sm={12}>
            <InputField
              name={phone.name}
              label={phone.label}
              formGroupClassName="m-1"
              type="text"
              maxLength="15"
              onKeyPress={integerKeyPress}
            />
          </Col>
          <Col xs={12} md={12} lg={12} sm={12}>
            <InputField
              name={mobile.name}
              label={mobile.label}
              isRequired
              formGroupClassName="m-1"
              type="text"
              maxLength="15"
              onKeyPress={integerKeyPress}
            />
          </Col>
          <Col xs={12} md={12} lg={12} sm={12}>
            <InputField
              name={email.name}
              label={email.label}
              isRequired
              formGroupClassName="m-1"
              type="email"
              maxLength="50"
            />
          </Col>
          <Col xs={12} md={12} lg={12} sm={12}>
            <InputField
              name={website.name}
              label={website.label}
              isRequired
              placeholder="e.g. www.yourcompany.com"
              formGroupClassName="m-1"
              type="text"
              maxLength="30"
            />
          </Col>
          <Col xs={12} md={11} lg={12} sm={12}>
            <FormikAutocomplete
              name={Lang.name}
              label={Lang.label}
              formGroupClassName="m-1"
              isRequired
              open={langOpen}
              size="small"
              oldValue={oldLang}
              value={lang && lang.label ? lang.label : oldLang}
              onOpen={() => {
                setLangOpen(true);
              }}
              onClose={() => {
                setLangOpen(false);
              }}
              getOptionSelected={(option, value) => option.label === value.label}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
              options={customData && customData.langugages ? customData.langugages : []}
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
          <Col xs={12} md={12} lg={12} sm={12}>
            <FormGroup className="m-1">
              <Label for={categoryId.name}>
                {categoryId.label}
              </Label>
              {(partnerTagsInfo && partnerTagsInfo.loading) || (vendorTags && vendorTags.loading) ? (
                <div className="p-3">
                  <Spinner />
                </div>
              )
                : (
                  <Autocomplete
                    multiple
                    filterSelectedOptions
                    limitTags={3}
                    id="tags-filled"
                    name={categoryId.name}
                    label={categoryId.label}
                    open={tagOpen}
                    size="small"
                    onOpen={() => {
                      setTagOpen(true);
                      setTagKeyword('');
                    }}
                    onClose={() => {
                      setTagOpen(false);
                      setTagKeyword('');
                    }}
                    loading={partnerTagsInfo && partnerTagsInfo.loading}
                    options={tagOptions}
                    getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                    value={category_id && category_id.length && category_id.length > 0 ? category_id : []}
                    defaultValue={vendorTags && vendorTags.data ? vendorTags.data : []}
                    onChange={(e, data) => setTags(data)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        onChange={onTagKeywordChange}
                        variant="outlined"
                        placeholder="Search & Select"
                        className="bg-white without-padding"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {(partnerTagsInfo && partnerTagsInfo.loading) || (vendorTags && vendorTags.loading) ? <CircularProgress color="inherit" size={20} /> : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                )}
              {(partnerTagsInfo && partnerTagsInfo.err && tagOpen) && (
              <FormHelperText><span className="text-danger">{generateErrorMessage(partnerTagsInfo)}</span></FormHelperText>
              )}
            </FormGroup>
          </Col>
          {company_type && company_type === 'person' && (
          <Col xs={12} sm={12} lg={12} md={12}>
            <InputField name={companyName.name} label={companyName.label} onKeyPress={lettersOnly} type="text" formGroupClassName="m-1" maxLength="30" />
          </Col>
          )}
        </Col>
      </Row>
    </>
  );
});

BasicForm.propTypes = {
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
  reload: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default BasicForm;
