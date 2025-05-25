/* eslint-disable import/no-unresolved */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-props-no-spreading */
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  CircularProgress,
  TextField,
} from '@material-ui/core';
import { ThemeProvider, makeStyles } from '@material-ui/core/styles';
import { Button, Grid } from '@mui/material';
import { Box } from '@mui/system';
import { Form, Formik } from 'formik';
import * as PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Col,
  Row,
} from 'reactstrap';

import SuccessAndErrorModalWindow from '@shared/successAndErrorModalWindow';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';
import MuiAutoComplete from '../../../commonComponents/formFields/muiAutocomplete';
import MuiTextField from '../../../commonComponents/multipleFormFields/muiTextField';
import {
  decimalKeyPressDown,
  generateErrorMessage,
  getAllowedCompaniesCase,
  noSpecialChars,
  trimJsonObject,
} from '../../../util/appUtils';
import {
  createSite,
  getAllowedCompaniesInfo,
  getCompanyCategories,
  getCountries,
  getSitesCount,
  getSitesList,
  getStates,
  resetCreateSite,
  resetUpdateSite,
  updateSite,
} from '../../setupService';
import formInitialValues from './formModel/formInitialValues';
import locationFormModel from './formModel/siteFormModel';
import validationSchema from './formModel/validationSchema';

import AuthService from '../../../util/authService';
import theme from '../../../util/materialTheme';
import { bytesToSize } from '../../../util/staticFunctions';
import { infoValue } from '../../utils/utils';

import customData from '../../data/customData.json';

const authService = AuthService();

const useStyles = makeStyles((themeStyle) => ({
  margin: {
    marginBottom: themeStyle.spacing(1),
    width: '100%',
  },
}));

const appModels = require('../../../util/appModels').default;

const { formId, formField } = locationFormModel;

const AddSite = (props) => {
  const {
    afterReset,
  } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [
    isOpenSuccessAndErrorModalWindow,
    setIsOpenSuccessAndErrorModalWindow,
  ] = useState(false);
  const [countryIdValue, setCountryIdValue] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const [countryKeyword, setCountryKeyword] = useState('');
  const [stateOpen, setStateOpen] = useState(false);
  const [stateKeyword, setStateKeyword] = useState('');
  const [imgValidation, setimgValidation] = useState(false);
  const [imgSize, setimgSize] = useState(false);
  const [fileDataImage, setFileDataImage] = useState(false);
  const [imgValidation1, setimgValidation1] = useState(false);
  const [imgSize1, setimgSize1] = useState(false);
  const [fileDataImage1, setFileDataImage1] = useState(false);
  const [fileType, setFileType] = useState('');
  const [fileType1, setFileType1] = useState('');
  const [currentTab, setActive] = useState('Basic');
  const [tzOpen, setTzOpen] = useState(false);

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompaniesCase(userInfo);
  const {
    countriesInfo, statesInfo, companyDetail, siteDetails, createSiteInfo, updateSiteInfo, companyCategoriesInfo,
  } = useSelector((state) => state.setup);

  useEffect(() => {
    if ((userInfo && userInfo.data) && ((createSiteInfo && createSiteInfo.data) || (updateSiteInfo && updateSiteInfo.data)) && (companyDetail && companyDetail.data && companyDetail.data.length)) {
      const statusValues = [];
      const customFilters = [];
      const pid = companyDetail.data[0].id;
      dispatch(getSitesCount(companies, appModels.COMPANY, pid, statusValues, customFilters));
    }
  }, [userInfo, companyDetail, createSiteInfo, updateSiteInfo]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && ((createSiteInfo && createSiteInfo.data) || (updateSiteInfo && updateSiteInfo.data)) && (companyDetail && companyDetail.data && companyDetail.data.length)) {
      const statusValues = [];
      const customFilters = [];
      const limit = 10;
      const offsetValue = 0;
      const sortByValue = 'DESC';
      const sortFieldValue = 'create_date';
      const pid = companyDetail.data[0].id;
      dispatch(getSitesList(companies, appModels.COMPANY, limit, offsetValue, pid, statusValues, customFilters, sortByValue, sortFieldValue));
      dispatch(getAllowedCompaniesInfo(authService.getAccessToken()));
    }
  }, [userInfo, companyDetail, createSiteInfo, updateSiteInfo]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data) {
        await dispatch(getCompanyCategories(companies, appModels.COMPANYCATEGORY, 'Site'));
      }
    })();
  }, [userInfo]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && countryOpen) {
        await dispatch(getCountries(companies, appModels.COUNTRY, countryKeyword));
      }
    })();
  }, [userInfo, countryKeyword, countryOpen]);

  useEffect(() => {
    (async () => {
      if (stateOpen && ((countryIdValue && countryIdValue.id) || (siteDetails && siteDetails.data && siteDetails.data[0].country_id))) {
        const cid = countryIdValue && countryIdValue.id ? countryIdValue.id : siteDetails.data[0].country_id[0];
        await dispatch(getStates(appModels.STATES, cid, stateKeyword));
      }
    })();
  }, [stateOpen, countryIdValue, stateKeyword, siteDetails]);

  const onCountryKeywordChange = (event) => {
    setCountryKeyword(event.target.value);
  };

  const onStateKeywordChange = (event) => {
    setStateKeyword(event.target.value);
  };

  const onReset = () => {
    setimgValidation(false);
    setimgSize(false);
    setFileDataImage(false);
    setimgValidation1(false);
    setimgSize1(false);
    setFileDataImage1(false);
    setFileType('');
    setFileType1('');
    dispatch(resetCreateSite());
    dispatch(resetUpdateSite());
    setIsOpenSuccessAndErrorModalWindow(false);
    if (afterReset) afterReset();
  };

  const handleReset = (resetForm) => {
    resetForm();
    onReset();
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
      }
    }
  };

  const handleFiles1 = (files) => {
    setimgValidation1(false);
    setimgSize1(false);
    if (files) {
      const { type } = files.fileList[0];

      if (!type.includes('image')) {
        setimgValidation1(true);
      } else if (!bytesToSize(files.fileList[0].size)) {
        setimgSize1(true);
      } else {
        const remfile = `data:${files.fileList[0].type};base64,`;
        setFileType1(remfile);
        const fileData = files.base64.replace(remfile, '');
        setFileDataImage1(fileData);
      }
    }
  };

  function handleSubmit(values) {
    const companyCategoryId = companyCategoriesInfo && companyCategoriesInfo.data
      && companyCategoriesInfo.data.length && companyCategoriesInfo.data.length > 0
      ? companyCategoriesInfo.data[0].id : false;
    if (siteDetails && siteDetails.data) {
      const postDataValues = {
        name: values.name,
        // code: values.code,
        street: values.street,
        city: values.city,
        latitude: values.latitude,
        longitude: values.longitude,
        country_id: values.country_id ? values.country_id.id : '',
        state_id: values.state_id ? values.state_id.id : '',
        company_tz: values.company_tz ? values.company_tz.value : '',
        res_company_categ_id: companyCategoryId,
      };

      const postData = { ...postDataValues };

      if (fileDataImage) {
        postData.logo = fileDataImage;
      }

      if (fileDataImage1) {
        postData.theme_logo = fileDataImage1;
      }
      const id = siteDetails && siteDetails.data ? siteDetails.data[0].id : '';
      setIsOpenSuccessAndErrorModalWindow(true);
      dispatch(updateSite(id, appModels.COMPANY, postData));
    } else {
      const countryId = values.country_id ? values.country_id.id : '';
      const stateId = values.state_id && values.state_id.id
        ? values.state_id.id : false;
      const timezone = values.company_tz && values.company_tz.value
        ? values.company_tz.value : false;

      const postData = { ...values };

      postData.country_id = countryId;
      postData.state_id = stateId;
      postData.company_tz = timezone;
      postData.parent_id = companyDetail && companyDetail.data && companyDetail.data.length ? companyDetail.data[0].id : false;
      postData.logo = fileDataImage || false;
      postData.theme_logo = fileDataImage1 || false;
      postData.res_company_categ_id = companyCategoryId;

      const payload = { model: appModels.COMPANY, values: postData };
      setIsOpenSuccessAndErrorModalWindow(true);
      dispatch(createSite(appModels.COMPANY, payload));
    }
  }

  let countryOptions = [];
  let stateOptions = [];

  if (countriesInfo && countriesInfo.loading) {
    countryOptions = [{ name: 'Loading..' }];
  }
  if (siteDetails && siteDetails.data && siteDetails.data[0].country_id) {
    const oldCatId = [{ id: siteDetails.data[0].country_id[0], name: siteDetails.data[0].country_id[1] }];
    const newArr = [...countryOptions, ...oldCatId];
    countryOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  if (countriesInfo && countriesInfo.data) {
    const arr = [...countryOptions, ...countriesInfo.data];
    countryOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }

  if (statesInfo && statesInfo.loading) {
    stateOptions = [{ name: 'Loading..' }];
  }
  if (siteDetails && siteDetails.data && siteDetails.data[0].state_id) {
    const oldCatId = [{ id: siteDetails.data[0].state_id[0], name: siteDetails.data[0].state_id[1] }];
    const newArr = [...stateOptions, ...oldCatId];
    stateOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  if (statesInfo && statesInfo.data) {
    const arr = [...stateOptions, ...statesInfo.data];
    stateOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

  function isDuplicateName() {
    let result = false;
    if (createSiteInfo && createSiteInfo.err && createSiteInfo.err.data && createSiteInfo.err.data.error) {
      const errText = createSiteInfo.err.data.error.message;
      if (errText.includes('duplicate')) {
        result = true;
      }
    }
    return result;
  }

  return (
    <Row>
      <Col md="12" sm="12" lg="12" xs="12">
        <Formik
          initialValues={siteDetails && siteDetails.data ? trimJsonObject(siteDetails.data[0]) : formInitialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            isValid, dirty, values, setFieldValue, resetForm,
          }) => (
            <Form id={formId}>
              {
                <ThemeProvider theme={theme}>
                  {/* <Nav>
                    {tabs && tabs.formTabs.map((item) => (
                      <div className="mr-5 ml-5 pl-1" key={item.id}>
                        <NavLink className="nav-link-item pt-2 pb-1 pl-1 pr-1" active={currentTab === item.name} href="#" onClick={() => setActive(item.name)}>{item.name}</NavLink>
                      </div>
                    ))}
                  </Nav>
                  <br /> */}
                  <Box
                    sx={{
                      width: '100%',
                      padding: '20px 25px',
                      flexGrow: 1,
                    }}
                    className="createFormScrollbar"
                  >
                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 4 }}>
                      <Grid item xs={12} sm={6} md={6}>
                        <MuiTextField
                          sx={{
                            marginBottom: '20px',
                          }}
                          fullWidth
                          variant="standard"
                          name={formField.nameValue.name}
                          // label={formField.nameValue.label}
                          formGroupClassName="m-1"
                          type="text"
                          label={(
                            <>
                              Name
                              <span className="text-danger ml-1">*</span>
                              {infoValue('assetName')}
                            </>
                          )}
                          onKeyPress={noSpecialChars}
                          inputProps={{
                            maxLength: 150,
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={6}>
                        <MuiTextField
                          sx={{
                            marginBottom: '20px',
                          }}
                          fullWidth
                          variant="standard"
                          label={(
                            <>
                              Short Code
                              <span className="text-danger ml-1">*</span>
                              {infoValue('assetName')}
                            </>
                          )}
                          name={formField.shortCode.name}
                          // label={formField.shortCode.label}
                          formGroupClassName="m-1"
                          type="text"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={6}>
                        <MuiTextField
                          sx={{
                            marginBottom: '20px',
                          }}
                          fullWidth
                          variant="standard"
                          label={(
                            <>
                              Address
                              <span className="text-danger ml-1">*</span>
                              {infoValue('assetName')}
                            </>
                          )}
                          name={formField.addressLineOne.name}
                          // label={formField.addressLineOne.label}
                          formGroupClassName="m-1"
                          type="text"
                          inputProps={{
                            maxLength: 300,
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={6}>
                        <MuiTextField
                          sx={{
                            marginBottom: '20px',
                          }}
                          fullWidth
                          variant="standard"
                          label={(
                            <>
                              City
                              <span className="text-danger ml-1">*</span>
                              {infoValue('assetName')}
                            </>
                          )}
                          name={formField.cityValue.name}
                          // label={formField.cityValue.label}
                          formGroupClassName="m-1"
                          type="text"
                          onKeyPress={noSpecialChars}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={6}>
                        <MuiAutoComplete
                          sx={{
                            marginBottom: '20px',
                          }}
                          name={formField.countryId.name}
                          className="bg-white"
                          open={countryOpen}
                          oldValue={getOldData(values.country_id)}
                          value={values.country_id && values.country_id.name ? values.country_id.name : getOldData(values.country_id)}
                          size="small"
                          onOpen={() => {
                            setCountryOpen(true);
                            setCountryKeyword('');
                          }}
                          onClose={() => {
                            setCountryOpen(false);
                            setCountryKeyword('');
                          }}
                          defaultValue={values && values.country_id ? values.country_id.name : ''}
                          loading={countriesInfo && countriesInfo.loading}
                          apiError={(countriesInfo && countriesInfo.err) ? generateErrorMessage(countriesInfo) : false}
                          getOptionSelected={(option, value) => (value.length > 0 ? option.name === value.name : '')}
                          getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                          options={countryOptions}
                          onChange={(e, data) => { setFieldValue(formField.countryId.name, data); setFieldValue(formField.stateId.name, ''); setCountryIdValue(data); }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              onChange={onCountryKeywordChange}
                              variant="standard"
                              label={(
                                <>
                                  Country
                                  <span className="text-danger ml-1">*</span>
                                  {infoValue('assetteam')}
                                </>
                              )}
                              InputLabelProps={{ shrink: true }}
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
                      </Grid>
                      <Grid item xs={12} sm={6} md={6}>
                        <MuiAutoComplete
                          sx={{
                            marginBottom: '20px',
                          }}
                          name={formField.stateId.name}
                          label={formField.stateId.label}
                          isRequired={formField.stateId.required}
                          formGroupClassName="mb-1"
                          oldValue={getOldData(values.state_id)}
                          value={values.state_id && values.state_id.name ? values.state_id.name : getOldData(values.state_id)}
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
                          apiError={(statesInfo && statesInfo.err) ? generateErrorMessage(statesInfo) : false}
                          getOptionSelected={(option, value) => (value.length > 0 ? option.name === value.name : '')}
                          getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                          options={stateOptions}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              onChange={onStateKeywordChange}
                              variant="standard"
                              label={(
                                <>
                                  State
                                  <span className="text-danger ml-1">*</span>
                                  {infoValue('assetteam')}
                                </>
                              )}
                              InputLabelProps={{ shrink: true }}
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
                      </Grid>
                      <Grid item xs={12} sm={6} md={6}>
                        <MuiTextField
                          sx={{
                            marginBottom: '20px',
                          }}
                          fullWidth
                          variant="standard"
                          label={(
                            <>
                              Latitude
                              <span className="text-danger ml-1">*</span>
                              {infoValue('assetName')}
                            </>
                          )}
                          name={formField.latitude.name}
                          // label={formField.latitude.label}
                          isRequired={formField.latitude.required}
                          formGroupClassName="m-1"
                          type="text"
                          onKeyPress={decimalKeyPressDown}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={6}>
                        <MuiTextField
                          sx={{
                            marginBottom: '20px',
                          }}
                          fullWidth
                          variant="standard"
                          label={(
                            <>
                              Longitude
                              <span className="text-danger ml-1">*</span>
                              {infoValue('assetName')}
                            </>
                          )}
                          name={formField.longitude.name}
                          // label={formField.longitude.label}
                          formGroupClassName="m-1"
                          type="text"
                          onKeyPress={decimalKeyPressDown}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={6}>
                        <MuiAutoComplete
                          name={formField.timeZone.name}
                          label={formField.timeZone.label}
                          isRequired={formField.timeZone.required}
                          formGroupClassName="m-1"
                          oldValue={values.company_tz}
                          value={values.company_tz}
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
                              variant="standard"
                              label={(
                                <>
                                  Timezone
                                  <span className="text-danger ml-1">*</span>
                                  {infoValue('assetteam')}
                                </>
                              )}
                              InputLabelProps={{ shrink: true }}
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
                      </Grid>
                    </Grid>
                  </Box>
                  {/* <Row className="ml-4 mr-4">
                      <Col md="6" sm="6" lg="6" xs="12">
                        <Col md="12" sm="11" lg="11" xs="11">
                          <InputField
                            name={formField.nameValue.name}
                            label={formField.nameValue.label}
                            isRequired={formField.nameValue.required}
                            formGroupClassName="mb-1"
                            type="text"
                            onKeyPress={noSpecialChars}
                          />
                        </Col>
                        <Col xs={12} sm={11} md={11} lg={11}>
                          <InputField
                            name={formField.addressLineOne.name}
                            label={formField.addressLineOne.label}
                            isRequired={formField.addressLineOne.required}
                            formGroupClassName="mb-1"
                            type="text"
                          />
                        </Col>
                        <Col xs={12} sm={11} md={11} lg={11}>
                          <FormGroup className="mb-1">
                            <Label for={formField.countryId.name}>
                              {formField.countryId.label}
                              {' '}
                              <span className="ml-2 text-danger">*</span>
                            </Label>
                            <Autocomplete
                              name={formField.countryId.name}
                              className="bg-white"
                              open={countryOpen}
                              oldValue={getOldData(values.country_id)}
                              value={values.country_id && values.country_id.name ? values.country_id.name : getOldData(values.country_id)}
                              size="small"
                              onOpen={() => {
                                setCountryOpen(true);
                                setCountryKeyword('');
                              }}
                              onClose={() => {
                                setCountryOpen(false);
                                setCountryKeyword('');
                              }}
                              defaultValue={values && values.country_id ? values.country_id.name : ''}
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
                          </FormGroup>
                          {(countriesInfo && countriesInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(countriesInfo)}</span></FormHelperText>)}
                        </Col>
                        <Col md="12" sm="11" lg="11" xs="11">
                          <InputField
                            name={formField.latitude.name}
                            label={formField.latitude.label}
                            isRequired={formField.latitude.required}
                            formGroupClassName="mb-1"
                            type="text"
                            onKeyPress={decimalKeyPressDown}
                          />
                        </Col>
                        <Col sm="11" md="12" xs="11" lg="11">
                          <FormikAutocomplete
                            name={formField.timeZone.name}
                            label={formField.timeZone.label}
                            isRequired={formField.timeZone.required}
                            formGroupClassName="m-1"
                            oldValue={values.company_tz}
                            value={values.company_tz}
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
                      <Col md="6" sm="6" lg="6" xs="12">
                        <Col md="12" sm="12" lg="12" xs="12">
                          <InputField
                            name={formField.shortCode.name}
                            label={formField.shortCode.label}
                            isRequired={formField.shortCode.required}
                            formGroupClassName="mb-1"
                            type="text"
                          />
                        </Col>
                        <Col md="12" sm="12" lg="12" xs="12">
                          <InputField
                            name={formField.cityValue.name}
                            label={formField.cityValue.label}
                            isRequired={formField.cityValue.required}
                            formGroupClassName="mb-1"
                            type="text"
                            onKeyPress={noSpecialChars}
                          />
                        </Col>
                        <Col xs={12} sm={12} md={12} lg={12}>
                          <FormikAutocomplete
                            name={formField.stateId.name}
                            label={formField.stateId.label}
                            isRequired={formField.stateId.required}
                            formGroupClassName="mb-1"
                            oldValue={getOldData(values.state_id)}
                            value={values.state_id && values.state_id.name ? values.state_id.name : getOldData(values.state_id)}
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
                        <Col md="12" sm="12" lg="12" xs="12">
                          <InputField
                            name={formField.longitude.name}
                            label={formField.longitude.label}
                            isRequired={formField.longitude.required}
                            formGroupClassName="mb-1"
                            type="text"
                            onKeyPress={decimalKeyPressDown}
                          />
                        </Col>
                      </Col>
                    </Row>
                    <Row className="ml-4 mr-4">
                      <Col xs="12" sm="6" md="6" lg="6">
                        <Col xs={12} sm={11} md={11} lg={11}>
                          <FormControl className={classes.margin}>
                            <Label for="theme_logo">Picture of Site</Label>
                            {!fileDataImage1 && (
                              <ReactFileReader
                                multiple
                                elementId="fileUpload"
                                handleFiles={handleFiles1}
                                fileTypes="image/*"
                                base64
                              >
                                <div className="cursor-pointer text-center border-style-dashed bg-snow border-color-whisper border-radius-5px p-1">
                                  <img alt="upload" src={filesBlackIcon} className="mt-2 mb-2 fa-3x" />
                                  <p className="font-weight-500">Select a file</p>
                                </div>
                              </ReactFileReader>
                            )}
                            {(!fileDataImage1 && (siteDetails && siteDetails.data && siteDetails.data[0].theme_logo)) && (
                              <div className="position-relative">
                                <img
                                  src={`data:image/png;base64,${siteDetails.data[0].theme_logo}`}
                                  height="150"
                                  width="150"
                                  className="ml-3"
                                  alt="uploaded"
                                />
                              </div>
                            )}
                            {fileDataImage1 && (
                              <div className="position-relative">
                                <img
                                  src={`${fileType1}${fileDataImage1}`}
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
                                      setimgValidation1(false);
                                      setimgSize1(false);
                                      setFileDataImage1(false);
                                      setFileType1(false);
                                    }}
                                    alt="remove"
                                  />
                                </div>
                              </div>
                            )}
                          </FormControl>
                          {imgValidation1 && (<FormHelperText><span className="text-danger">Choose Image Only...</span></FormHelperText>)}
                          {imgSize1 && (<FormHelperText><span className="text-danger">Maximum File Upload Size 1MB...</span></FormHelperText>)}
                        </Col>
                      </Col>
                      <Col xs="12" sm="6" md="6" lg="6">
                        <Col xs={12} sm={12} md={12} lg={12}>
                          <FormControl className={classes.margin}>
                            <Label for="logo">Logo</Label>
                            {!fileDataImage && (
                              <ReactFileReader
                                multiple
                                elementId="fileUpload"
                                handleFiles={handleFiles}
                                fileTypes="image/*"
                                base64
                              >
                                <div className="cursor-pointer text-center border-style-dashed bg-snow border-color-whisper border-radius-5px p-1">
                                  <img alt="upload" src={filesBlackIcon} className="mt-2 mb-2 fa-3x" />
                                  <p className="font-weight-500">Select a file</p>
                                </div>
                              </ReactFileReader>
                            )}
                            {(!fileDataImage && (siteDetails && siteDetails.data && siteDetails.data[0].logo)) && (
                              <div className="position-relative">
                                <img
                                  src={`data:image/png;base64,${siteDetails.data[0].logo}`}
                                  height="150"
                                  width="150"
                                  className="ml-3"
                                  alt="uploaded"
                                />
                              </div>
                            )}
                            {fileDataImage && (
                              <div className="position-relative">
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
                                    }}
                                    alt="remove"
                                  />
                                </div>
                              </div>
                            )}
                          </FormControl>
                          {imgValidation && (<FormHelperText><span className="text-danger">Choose Image Only...</span></FormHelperText>)}
                          {imgSize && (<FormHelperText><span className="text-danger">Maximum File Upload Size 1MB...</span></FormHelperText>)}
                        </Col>
                      </Col>
                    </Row> */}
                </ThemeProvider>
              }
              {/* {createSiteInfo && createSiteInfo.loading && (
                <div className="text-center mt-3">
                  <Loader />
                </div>
              )} */}
              {(createSiteInfo && createSiteInfo.err) && (
                <>
                  {isDuplicateName() ? (
                    <div className="text-danger text-center mt-3">
                      <FontAwesomeIcon className="mr-2 font-size20 mb-n2px" size="lg" icon={faExclamationCircle} />
                      The company name must be unique !
                    </div>
                  )
                    : (
                      <SuccessAndErrorFormat response={createSiteInfo} />
                    )}
                </>
              )}
              {/* {(createSiteInfo && createSiteInfo.data) && (
                <SuccessAndErrorFormat response={createSiteInfo} successMessage="Site added successfully.." />
              )} */}
              {/* updateSiteInfo && updateSiteInfo.loading && (
                <div className="text-center mt-3">
                  <Loader />
                </div>
              )}
              {(updateSiteInfo && updateSiteInfo.err) && (
                <SuccessAndErrorFormat response={updateSiteInfo} />
              )}
              {(updateSiteInfo && updateSiteInfo.data) && (
                <SuccessAndErrorFormat response={updateSiteInfo} successMessage="Site updated successfully.." />
              ) */}
              {/* siteDetails && siteDetails.data && (
                <div className="float-right mr-4">
                  {(updateSiteInfo && !updateSiteInfo.data) && (
                    <Button
                      disabled={!isValid || (updateSiteInfo && updateSiteInfo.loading)}
                      type="submit"
                      size="sm"
                       variant="contained"
                    >
                      Update
                    </Button>
                  )}
                </div>
              ) */}
              {/* {(siteDetails && !siteDetails.data) && (
                <div className="float-right mr-4">
                  {(createSiteInfo && !createSiteInfo.data) && (
                    <Button
                      disabled={!(isValid && dirty) || (createSiteInfo && createSiteInfo.loading)}
                      type="submit"
                      size="sm"
                       variant="contained"
                    >
                      Create
                    </Button>
                  )}
                </div>
              )} */}
              {(createSiteInfo && !createSiteInfo.data) && (
                <div className="bg-lightblue sticky-button-85drawer">
                  <Button
                    disabled={!(isValid && dirty) || (createSiteInfo && createSiteInfo.loading)}
                    type="button"
                    onClick={() => handleSubmit(values)}
                    variant="contained"
                    className="submit-btn"
                  >
                    Create
                  </Button>
                </div>
              )}
              <SuccessAndErrorModalWindow
                isOpenSuccessAndErrorModalWindow={
                  isOpenSuccessAndErrorModalWindow
                }
                setIsOpenSuccessAndErrorModalWindow={
                  setIsOpenSuccessAndErrorModalWindow
                }
                type="create"
                successOrErrorData={createSiteInfo}
                // headerImage={assetIcon}
                headerText="Site"
                successRedirect={handleReset.bind(null, resetForm)}
              />
            </Form>
          )}
        </Formik>
        {/* siteDetails && siteDetails.data && (
          <div className="float-right mr-4">
            {(updateSiteInfo && updateSiteInfo.data) && (
              <Button
                type="button"
                size="sm"
                 variant="contained"
                onClick={() => onReset()}
              >
                Ok
              </Button>
            )}
          </div>
        ) */}
        {/* {(siteDetails && !siteDetails.data) && (
          <div className="float-right mr-4">
            {(createSiteInfo && createSiteInfo.data) && (
              <Button
                type="button"
                size="sm"
                 variant="contained"
                onClick={() => onReset()}
              >
                Ok
              </Button>
            )}
          </div>
        )} */}
      </Col>
    </Row>
  );
};

AddSite.propTypes = {
  afterReset: PropTypes.func.isRequired,
};

export default AddSite;
