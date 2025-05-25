/* eslint-disable max-len */
/* eslint-disable react/jsx-indent */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useFormikContext } from 'formik';
import {
  CircularProgress,
} from '@material-ui/core';
import moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';

import envelopeIcon from '@images/icons/envelope.svg';
import telephoneIcon from '@images/icons/telephone.svg';
import {
  Dialog, DialogContent, DialogContentText,
  TextField, Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import dayjs from 'dayjs';
import formFields from './formFields.json';
import {
  generateErrorMessage, integerKeyPress,
  getAllCompanies, decimalKeyPressDown,
} from '../../../util/appUtils';
import { getPartners } from '../../equipmentService';
import assetActionData from '../../data/assetsActions.json';
import { getAMCText } from '../../utils/utils';
import SearchModalMultiple from '../../forms/searchModalMultiple';

import DialogHeader from '../../../commonComponents/dialogHeader';
import MuiAutoComplete from '../../../commonComponents/formFields/muiAutocomplete';
import MuiTextField from '../../../commonComponents/formFields/muiTextField';
import MuiDatePicker from '../../../commonComponents/formFields/muiDatePicker';
import { AddThemeColor } from '../../../themes/theme';

const appModels = require('../../../util/appModels').default;

const useStyles = makeStyles({
  option: {
    padding: 5,
    margin: 5,
    display: 'flow-root',
    '& > span': {
      marginRight: 10,
    },
  },
});

const WarrantyUpdateForm = (props) => {
  const {
    setFieldValue,
    validateField,
    setFieldTouched,
  } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const [amcOpen, setAmcOpen] = useState(false);
  const [manufacturerOpen, setManufacturerOpen] = useState(false);
  const [manufacturerKeyword, setManufacturerKeyword] = useState('');
  const [customerOpen, setCustomerOpen] = useState(false);
  const [customerKeyword, setCustomerKeyword] = useState('');
  const [vendorOpen, setVendorOpen] = useState(false);
  const [vendorKeyword, setVendorKeyword] = useState('');
  const { values: formValues } = useFormikContext();
  const {
    amc_type, manufacturer_id, vendor_id, customer_id,
    warranty_start_date, amc_start_date, warranty_end_date, purchase_date, amc_end_date,
  } = formValues;

  const [extraMultipleModal, setExtraMultipleModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [columns, setColumns] = useState(['id', 'name', 'email', 'mobile']);

  let warrantyStateMax = dayjs();
  let amcStateMax = dayjs();

  if (warranty_start_date) {
    // const date = new Date(warranty_start_date);
    // const value = date.setDate(date.getDate() + 1);
    // warrantyStateMax = new Date(value);
    warrantyStateMax = dayjs(warranty_start_date).add(1, 'day');
  }

  if (amc_start_date) {
    // const date = new Date(amc_start_date);
    // const value = date.setDate(date.getDate() + 1);
    // amcStateMax = new Date(value);
    amcStateMax = dayjs(amc_start_date).add(1, 'day');
  }
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllCompanies(userInfo, userRoles);
  const { partnersInfo } = useSelector((state) => state.equipment);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && manufacturerOpen) {
        await dispatch(getPartners(companies, appModels.PARTNER, 'supplier', manufacturerKeyword));
      }
    })();
  }, [userInfo, manufacturerKeyword, manufacturerOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && customerOpen) {
        await dispatch(getPartners(companies, appModels.PARTNER, 'customer', customerKeyword));
      }
    })();
  }, [userInfo, customerKeyword, customerOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && vendorOpen) {
        await dispatch(getPartners(companies, appModels.PARTNER, 'supplier', vendorKeyword));
      }
    })();
  }, [userInfo, vendorKeyword, vendorOpen]);

  const onManufacturerKeywordChange = (event) => {
    setManufacturerKeyword(event.target.value);
  };

  const onCustomerKeywordChange = (event) => {
    setCustomerKeyword(event.target.value);
  };

  const onVendorKeywordChange = (event) => {
    setVendorKeyword(event.target.value);
  };

  const onVendorKeywordClear = () => {
    setVendorKeyword(null);
    setFieldValue('vendor_id', '');
    setVendorOpen(false);
  };

  const onManufacturerKeywordClear = () => {
    setManufacturerKeyword(null);
    setFieldValue('manufacturer_id', '');
    setManufacturerOpen(false);
  };

  const onCustomerKeywordClear = () => {
    setCustomerKeyword(null);
    setFieldValue('customer_id', '');
    setCustomerOpen(false);
  };

  const showVendorModal = () => {
    setModelValue(appModels.PARTNER);
    setFieldName('vendor_id');
    setModalName('Vendor List');
    setOtherFieldName('supplier');
    setOtherFieldValue(true);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setColumns(['id', 'display_name', 'email', 'mobile']);
    setExtraMultipleModal(true);
  };

  const showManufactureModal = () => {
    setModelValue(appModels.PARTNER);
    setFieldName('manufacturer_id');
    setModalName('Manufacturer List');
    setOtherFieldName('manufacturer_id');
    setOtherFieldValue(true);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setColumns(['id', 'display_name', 'email', 'mobile']);
    setExtraMultipleModal(true);
  };

  const showCustomerModal = () => {
    setModelValue(appModels.PARTNER);
    setFieldName('customer_id');
    setModalName('Customer List');
    setOtherFieldName('customer');
    setOtherFieldValue(true);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setColumns(['id', 'display_name', 'email', 'mobile']);
    setExtraMultipleModal(true);
  };

  let manufacturerOptions = [];
  let customerOptions = [];
  let vendorOptions = [];

  if (partnersInfo && partnersInfo.loading) {
    if (manufacturerOpen) {
      manufacturerOptions = [{ display_name: 'Loading..' }];
    }
    if (customerOpen) {
      customerOptions = [{ display_name: 'Loading..' }];
    }
    if (vendorOpen) {
      vendorOptions = [{ display_name: 'Loading..' }];
    }
  }
  if (manufacturer_id && manufacturer_id.length && manufacturer_id.length > 0) {
    const oldManufactId = [{ id: manufacturer_id[0], display_name: manufacturer_id[1] }];
    const newArr = [...manufacturerOptions, ...oldManufactId];
    manufacturerOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  if (customer_id && customer_id.length && customer_id.length > 0) {
    const oldCustId = [{ id: customer_id[0], display_name: customer_id[1] }];
    const newArr = [...customerOptions, ...oldCustId];
    customerOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  if (vendor_id && vendor_id.length && vendor_id.length > 0) {
    const oldVenId = [{ id: vendor_id[0], display_name: vendor_id[1] }];
    const newArr = [...vendorOptions, ...oldVenId];
    vendorOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  if (partnersInfo && partnersInfo.data) {
    if (manufacturerOpen) {
      const arr = [...manufacturerOptions, ...partnersInfo.data];
      manufacturerOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
    }
    if (customerOpen) {
      const arr = [...customerOptions, ...partnersInfo.data];
      customerOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
    }
    if (vendorOpen) {
      const arr = [...vendorOptions, ...partnersInfo.data];
      vendorOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
    }
  }

  const oldAMCType = amc_type || '';

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

  return (
    <>
      <Box
        sx={{
          width: '100%',
          marginTop: '20px',
        }}
      >
        <Typography
          sx={AddThemeColor({
            font: 'normal normal medium 20px/24px Suisse Intl',
            letterSpacing: '0.7px',
            fontWeight: 500,
            marginBottom: '20px',
          })}
        >
          Warranty
        </Typography>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '3%',
            flexWrap: 'wrap',
          }}
        >

          {formFields && formFields.warrantyFields && formFields.warrantyFields.map((fields) => (
            <>
              {(fields.type !== 'array') && (fields.name !== 'validated_on') && (
                <>
                  {(fields.name !== 'purchase_date' && fields.name !== 'purchase_value'
                    && fields.name !== 'warranty_start_date' && fields.name !== 'warranty_end_date' && fields.name !== 'amc_start_date' && fields.name !== 'amc_end_date' && fields.name !== 'amc_cost') && (
                      <MuiTextField
                        sx={{
                          width: '30%',
                          marginBottom: '20px',
                        }}
                        name={fields.name}
                        label={fields.label}
                        type={fields.type}
                        readOnly={fields.readonly}
                      />
                  )}
                  {fields.name === 'purchase_date' && (
                    <MuiDatePicker
                      sx={{
                        width: '30%',
                        marginBottom: '20px',
                      }}
                      name={fields.name}
                      label={fields.label}
                      maxDate={dayjs(new Date())}
                      setFieldValue={setFieldValue}
                      value={purchase_date ? dayjs(moment.utc(purchase_date).local().format('YYYY-MM-DD')) : null}
                    // max={moment(new Date()).format('YYYY-MM-DD')}
                    />
                  )}
                  {fields.name === 'purchase_value' && (
                    <MuiTextField
                      sx={{
                        width: '30%',
                        marginBottom: '20px',
                      }}
                      name={fields.name}
                      label={fields.label}
                      type={fields.type}

                      readOnly={fields.readonly}
                      onKeyPress={integerKeyPress}
                    />
                  )}
                  {fields.name === 'warranty_start_date' && (
                    // <MuiTextField
                    //   sx={{
                    //     width: '30%',
                    //     marginBottom: '20px',
                    //   }}
                    //   name={fields.name}
                    //   label={fields.label}
                    //   type={fields.type}
                    //   readOnly={fields.readonly}
                    //   InputProps={{ inputProps: { max: moment(new Date()).format('YYYY-MM-DD') } }}
                    // // max={moment(new Date()).format('YYYY-MM-DD')}
                    // />
                    <MuiDatePicker
                      sx={{
                        width: '30%',
                        marginBottom: '20px',
                      }}
                      name={fields.name}
                      label={fields.label}
                      readOnly={fields.readonly}
                      setFieldValue={setFieldValue}
                      maxDate={dayjs(new Date())}
                      validateField={validateField}
                      setFieldTouched={setFieldTouched}
                      value={warranty_start_date ? dayjs(moment.utc(warranty_start_date).local().format('YYYY-MM-DD')) : null}
                    />
                  )}
                  {fields.name === 'warranty_end_date' && (
                    <MuiDatePicker
                      sx={{
                        width: '30%',
                        marginBottom: '20px',
                      }}
                      name={fields.name}
                      label={fields.label}
                      setFieldValue={setFieldValue}
                      readOnly={fields.readonly}
                      value={warranty_end_date ? dayjs(moment.utc(warranty_end_date).local().format('YYYY-MM-DD')) : null}
                      minDate={warrantyStateMax}
                      validateField={validateField}
                      setFieldTouched={setFieldTouched}
                      // InputProps={{ inputProps: { min: moment(warrantyStateMax).format('YYYY-MM-DD') } }}
                    // min={moment(warrantyStateMax).format('YYYY-MM-DD')}
                    />
                  )}
                  {fields.name === 'amc_start_date' && (
                    <MuiDatePicker
                      sx={{
                        width: '30%',
                        marginBottom: '20px',
                      }}
                      name={fields.name}
                      label={fields.label}
                      setFieldValue={setFieldValue}
                      readOnly={fields.readonly}
                      maxDate={dayjs(new Date())}
                      validateField={validateField}
                      setFieldTouched={setFieldTouched}
                      value={amc_start_date ? dayjs(moment.utc(amc_start_date).local().format('YYYY-MM-DD')) : null}
                     // InputProps={{ inputProps: { max: moment(new Date()).format('YYYY-MM-DD') } }}
                    // max={moment(new Date()).format('YYYY-MM-DD')}
                    />
                  )}
                  {fields.name === 'amc_end_date' && (
                    <MuiDatePicker
                      sx={{
                        width: '30%',
                        marginBottom: '20px',
                      }}
                      name={fields.name}
                      label={fields.label}
                      setFieldValue={setFieldValue}
                      readOnly={fields.readonly}
                      minDate={(amcStateMax)}
                      validateField={validateField}
                      setFieldTouched={setFieldTouched}
                       value={amc_end_date ? dayjs(moment.utc(amc_end_date).local().format('YYYY-MM-DD')) : null}
                      //InputProps={{ inputProps: { min: moment(amcStateMax).format('YYYY-MM-DD') } }}
                    // min={moment(amcStateMax).format('YYYY-MM-DD')}
                    />
                  )}
                  {fields.name === 'amc_cost' && (
                    <MuiTextField
                      sx={{
                        width: '30%',
                        marginBottom: '20px',
                      }}
                      name={fields.name}
                      label={fields.label}
                      type={fields.type}
                      inputProps={{ maxLength: 10 }}
                      autoComplete="off"
                      readOnly={fields.readonly}
                      onKeyPress={decimalKeyPressDown}
                    />
                  )}
                </>
              )}
              {(fields.type === 'array') && (fields.name === 'manufacturer_id') && (
                <MuiAutoComplete
                  sx={{
                    width: '30%',
                    marginTop: 'auto',
                    marginBottom: '20px',
                  }}
                  name={fields.name}
                  label={fields.label}
                  oldValue={getOldData(manufacturer_id)}
                  value={manufacturer_id && manufacturer_id.display_name ? manufacturer_id.display_name : getOldData(manufacturer_id)}
                  open={manufacturerOpen}
                  size="small"
                  onOpen={() => {
                    setManufacturerOpen(true);
                    setManufacturerKeyword('');
                  }}
                  onClose={() => {
                    setManufacturerOpen(false);
                    setManufacturerKeyword('');
                  }}
                  classes={{
                    option: classes.option,
                  }}
                  loading={partnersInfo && partnersInfo.loading}
                  apiError={(partnersInfo && partnersInfo.err) ? generateErrorMessage(partnersInfo) : false}
                  getOptionSelected={(option, value) => option.display_name === value.display_name}
                  getOptionLabel={(option) => (typeof option === 'string' ? option : option.display_name)}
                  renderOption={(props, option) => (
                    <Box
                      component="li"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        '& > img': {
                          mr: 2,
                          flexShrink: 0,
                        },
                      }}
                      {...props}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                        <h6>{option.display_name}</h6>
                        <span>
                          {option.email && (
                            <>
                              <img src={envelopeIcon} alt="mail" height="13" width="13" className="mr-2" />
                              {option.email}
                            </>
                          )}
                        </span>
                      </div>
                      {option.mobile && (
                        <div style={{ marginLeft: 'auto' }}>
                          <img src={telephoneIcon} alt="telephone" height="13" width="13" className="mr-2" />
                          {option.mobile}
                        </div>
                      )}
                    </Box>
                  )}
                  options={manufacturerOptions}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      onChange={onManufacturerKeywordChange}
                      variant="standard"
                      label={fields.label}
                      value={manufacturerKeyword}
                      className={((manufacturer_id && manufacturer_id.id) || (manufacturerKeyword && manufacturerKeyword.length > 0) || (manufacturer_id && manufacturer_id.length))
                        ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                      placeholder="Search & Select"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {partnersInfo && partnersInfo.loading && manufacturerOpen ? <CircularProgress color="inherit" size={20} /> : null}
                            <InputAdornment position="end">
                              {((manufacturer_id && manufacturer_id.id) || (manufacturerKeyword && manufacturerKeyword.length > 0) || (manufacturer_id && manufacturer_id.length)) && (
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={onManufacturerKeywordClear}
                                >
                                  <BackspaceIcon fontSize="small" />
                                </IconButton>
                              )}
                              <IconButton
                                aria-label="toggle search visibility"
                                onClick={showManufactureModal}
                              >
                                <SearchIcon fontSize="small" />
                              </IconButton>
                            </InputAdornment>
                          </>
                        ),
                      }}
                    />
                  )}
                />
              )}
              {(fields.type === 'array') && (fields.name === 'customer_id') && (
                <MuiAutoComplete
                  sx={{
                    width: '30%',
                    marginTop: 'auto',
                    marginBottom: '20px',
                  }}
                  name={fields.name}
                  label={fields.label}
                  oldValue={getOldData(customer_id)}
                  value={customer_id && customer_id.display_name ? customer_id.display_name : getOldData(customer_id)}
                  open={customerOpen}
                  size="small"
                  onOpen={() => {
                    setCustomerOpen(true);
                    setCustomerKeyword('');
                  }}
                  onClose={() => {
                    setCustomerOpen(false);
                    setCustomerKeyword('');
                  }}
                  classes={{
                    option: classes.option,
                  }}
                  loading={partnersInfo && partnersInfo.loading}
                  apiError={(partnersInfo && partnersInfo.err) ? generateErrorMessage(partnersInfo) : false}
                  getOptionSelected={(option, value) => option.display_name === value.display_name}
                  getOptionLabel={(option) => (typeof option === 'string' ? option : option.display_name)}
                  renderOption={(props, option) => (
                    <Box
                      component="li"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        '& > img': {
                          mr: 2,
                          flexShrink: 0,
                        },
                      }}
                      {...props}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                        <h6>{option.display_name}</h6>
                        <span>
                          {option.email && (
                            <>
                              <img src={envelopeIcon} alt="mail" height="13" width="13" className="mr-2" />
                              {option.email}
                            </>
                          )}
                        </span>
                      </div>
                      {option.mobile && (
                        <div style={{ marginLeft: 'auto' }}>
                          <img src={telephoneIcon} alt="telephone" height="13" width="13" className="mr-2" />
                          {option.mobile}
                        </div>
                      )}
                    </Box>
                  )}
                  options={customerOptions}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      onChange={onCustomerKeywordChange}
                      variant="standard"
                      label={fields.label}
                      value={customerKeyword}
                      className={((customer_id && customer_id.id) || (customerKeyword && customerKeyword.length > 0) || (customer_id && customer_id.length))
                        ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                      placeholder="Search & Select"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {partnersInfo && partnersInfo.loading && customerOpen ? <CircularProgress color="inherit" size={20} /> : null}
                            <InputAdornment position="end">
                              {((customer_id && customer_id.id) || (customerKeyword && customerKeyword.length > 0) || (customer_id && customer_id.length)) && (
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={onCustomerKeywordClear}
                                >
                                  <BackspaceIcon fontSize="small" />
                                </IconButton>
                              )}
                              <IconButton
                                aria-label="toggle search visibility"
                                onClick={showCustomerModal}
                              >
                                <SearchIcon fontSize="small" />
                              </IconButton>
                            </InputAdornment>
                          </>
                        ),
                      }}
                    />
                  )}
                />
              )}
              {(fields.type === 'array') && (fields.name === 'vendor_id') && (
                <MuiAutoComplete
                  sx={{
                    width: '30%',
                    marginTop: 'auto',
                    marginBottom: '20px',
                  }}
                  name={fields.name}
                  label={fields.label}
                  oldValue={getOldData(vendor_id)}
                  value={vendor_id && vendor_id.display_name ? vendor_id.display_name : getOldData(vendor_id)}
                  open={vendorOpen}
                  size="small"
                  onOpen={() => {
                    setVendorOpen(true);
                    setVendorKeyword('');
                  }}
                  onClose={() => {
                    setVendorOpen(false);
                    setVendorKeyword('');
                  }}
                  classes={{
                    option: classes.option,
                  }}
                  loading={partnersInfo && partnersInfo.loading}
                  apiError={(partnersInfo && partnersInfo.err) ? generateErrorMessage(partnersInfo) : false}
                  getOptionSelected={(option, value) => option.display_name === value.display_name}
                  getOptionLabel={(option) => (typeof option === 'string' ? option : option.display_name)}
                  renderOption={(props, option) => (
                    <Box
                      component="li"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        '& > img': {
                          mr: 2,
                          flexShrink: 0,
                        },
                      }}
                      {...props}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                        <h6>{option.display_name}</h6>
                        <span>
                          {option.email && (
                            <>
                              <img src={envelopeIcon} alt="mail" height="13" width="13" className="mr-2" />
                              {option.email}
                            </>
                          )}
                        </span>
                      </div>
                      {option.mobile && (
                        <div style={{ marginLeft: 'auto' }}>
                          <img src={telephoneIcon} alt="telephone" height="13" width="13" className="mr-2" />
                          {option.mobile}
                        </div>
                      )}
                    </Box>
                  )}
                  options={vendorOptions}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      onChange={onVendorKeywordChange}
                      variant="standard"
                      label={fields.label}
                      value={vendorKeyword}
                      className={((vendor_id && vendor_id.id) || (vendorKeyword && vendorKeyword.length > 0) || (vendor_id && vendor_id.length))
                        ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                      placeholder="Search & Select"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {partnersInfo && partnersInfo.loading && vendorOpen ? <CircularProgress color="inherit" size={20} /> : null}
                            <InputAdornment position="end">
                              {((vendor_id && vendor_id.id) || (vendorKeyword && vendorKeyword.length > 0) || (vendor_id && vendor_id.length)) && (
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={onVendorKeywordClear}
                                >
                                  <BackspaceIcon fontSize="small" />
                                </IconButton>
                              )}
                              <IconButton
                                aria-label="toggle search visibility"
                                onClick={showVendorModal}
                              >
                                <SearchIcon fontSize="small" />
                              </IconButton>
                            </InputAdornment>
                          </>
                        ),
                      }}
                    />
                  )}
                />
              )}
              {(fields.type === 'array') && (fields.name === 'amc_type') && (
                <MuiAutoComplete
                  sx={{
                    width: '30%',
                    marginTop: 'auto',
                    marginBottom: '20px',
                  }}
                  name={fields.name}
                  label={fields.label}
                  oldValue={getAMCText(oldAMCType)}
                  value={amc_type && amc_type.label ? amc_type.label : getAMCText(oldAMCType)}
                  open={amcOpen}
                  size="small"
                  onOpen={() => {
                    setAmcOpen(true);
                  }}
                  onClose={() => {
                    setAmcOpen(false);
                  }}
                  getOptionSelected={(option, value) => option.label === value.label}
                  getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                  options={assetActionData.amcTypes}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      label={fields.label}
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
              )}
            </>
          ))}
        </Box>
      </Box>
      <Dialog maxWidth="md" open={extraMultipleModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraMultipleModal(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <SearchModalMultiple
              modelName={modelValue}
              modalName={modalName}
              afterReset={() => { setExtraMultipleModal(false); }}
              fieldName={fieldName}
              fields={columns}
              company={companyValue}
              otherFieldName={otherFieldName}
              otherFieldValue={otherFieldValue}
              setFieldValue={setFieldValue}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
};

WarrantyUpdateForm.propTypes = {
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};
export default WarrantyUpdateForm;
