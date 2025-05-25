/* eslint-disable react/forbid-prop-types */
/* eslint-disable import/no-unresolved */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import PropTypes from 'prop-types';
import { useFormikContext } from 'formik';
import {
  CircularProgress,
} from '@material-ui/core';
import {
  Typography, TextField, Dialog, DialogContent, DialogContentText,
} from '@mui/material';
import dayjs from 'dayjs';
import { Box } from '@mui/system';
import { makeStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import { IoCloseOutline } from 'react-icons/io5';
import SearchIcon from '@material-ui/icons/Search';

import envelopeIcon from '@images/icons/envelope.svg';
import telephoneIcon from '@images/icons/telephone.svg';
import MuiTextField from '../../commonComponents/formFields/muiTextField';
import MuiAutoComplete from '../../commonComponents/formFields/muiAutocomplete';
import MuiDatePicker from '../../commonComponents/formFields/muiDatePicker';
import DialogHeader from '../../commonComponents/dialogHeader';
import {

  getAllowedCompanies, decimalKeyPressDown,
} from '../../util/appUtils';
import { getPartners } from '../equipmentService';
import assetActionData from '../data/assetsActions.json';
import SearchModalMultiple from './searchModalMultiple';
import { AddThemeColor } from '../../themes/theme';

const appModels = require('../../util/appModels').default;

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

const AssetWarrantyForm = (props) => {
  const {
    setFieldValue,
    setFieldTouched,
    validateField,
    values,
    formField: {
      manufacturerId,
      vendorId,
      amcType,
      amcCost,
      customerId,
      referenceNumber,
      purchaseDate,
      purchaseValue,
      warrantyStartDate,
      warrantyEndDate,
      amcStartDate,
      amcEndDate,
    },
  } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const { values: formValues } = useFormikContext();
  const {
    warranty_start_date, amc_start_date, manufacturer_id, vendor_id, customer_id,
  } = formValues;
  const [amcOpen, setAmcOpen] = useState(false);
  const [manufacturerOpen, setManufacturerOpen] = useState(false);
  const [manufacturerKeyword, setManufacturerKeyword] = useState('');
  const [customerOpen, setCustomerOpen] = useState(false);
  const [customerKeyword, setCustomerKeyword] = useState('');
  const [vendorOpen, setVendorOpen] = useState(false);
  const [vendorKeyword, setVendorKeyword] = useState('');

  const [extraMultipleModal, setExtraMultipleModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [columns, setColumns] = useState(['id', 'name', 'email', 'mobile']);

  let warrantyStateMax = dayjs();
  let amcStateMax =  dayjs();
  
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

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const { partnersInfo } = useSelector((state) => state.equipment);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && manufacturerOpen) {
        await dispatch(getPartners(companies, appModels.PARTNER, 'supplier', manufacturerKeyword, false, 'yes'));
      }
    })();
  }, [userInfo, manufacturerKeyword, manufacturerOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && customerOpen) {
        await dispatch(getPartners(companies, appModels.PARTNER, 'customer', customerKeyword, false, 'yes'));
      }
    })();
  }, [userInfo, customerKeyword, customerOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && vendorOpen) {
        await dispatch(getPartners(companies, appModels.PARTNER, 'supplier', vendorKeyword, false, 'yes'));
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
  if (partnersInfo && partnersInfo.data) {
    if (manufacturerOpen) {
      manufacturerOptions = partnersInfo.data;
    }
    if (customerOpen) {
      customerOptions = partnersInfo.data;
    }
    if (vendorOpen) {
      vendorOptions = partnersInfo.data;
    }
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
          <MuiAutoComplete
            sx={{
              width: '30%',
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            name={manufacturerId.name}
            label={manufacturerId.label}
            formGroupClassName="m-1"
            value={manufacturer_id && manufacturer_id.display_name ? manufacturer_id.display_name : ''}
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
                label={manufacturerId.label}
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
                            <IoCloseOutline size={22} fontSize="small" />
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
          <MuiAutoComplete
            sx={{
              width: '30%',
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            name={vendorId.name}
            label={vendorId.label}
            formGroupClassName="m-1"
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
                label={vendorId.label}
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
                            <IoCloseOutline size={22} fontSize="small" />
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
          {/* <MuiTextField
            sx={{
              width: '30%',
              marginBottom: '20px',
            }}
            name={purchaseDate.name}
            label={purchaseDate.label}
            setFieldValue={setFieldValue}
            InputProps={{ inputProps: { max: moment(new Date()).format('YYYY-MM-DD') } }}
            //  value={values[purchaseDate.name]}
            // max={moment(new Date()).format('YYYY-MM-DD')}
            type="date"
          /> */}
          <MuiDatePicker
            sx={{
              width: '30%',
              marginBottom: '20px',
            }}
            name={purchaseDate.name}
            setFieldTouched={setFieldTouched}
            label={purchaseDate.label}
            setFieldValue={setFieldValue}
            maxDate={dayjs(new Date())}
          />
          <MuiTextField
            sx={{
              width: '30%',
              marginBottom: '20px',
            }}
            type="text"
            name={purchaseValue.name}
            label={purchaseValue.label}
            setFieldValue={setFieldValue}
            // value={values[purchaseValue.name]}
            onKeyPress={decimalKeyPressDown}
          />
          {/* <MuiTextField
            sx={{
              width: '30%',
              marginBottom: '20px',
            }}
            InputProps={{ inputProps: { max: moment(new Date()).format('YYYY-MM-DD') } }}
            type="date"
            name={warrantyStartDate.name}
            label={warrantyStartDate.label}
          /> */}
          <MuiDatePicker
            sx={{
              width: '30%',
              marginBottom: '20px',
            }}
            name={warrantyStartDate.name}
            label={warrantyStartDate.label}
            setFieldValue={setFieldValue}
            maxDate={dayjs(new Date())}
            setFieldTouched={setFieldTouched}
            validateField={validateField}
          />
          {/* <MuiTextField
            sx={{
              width: '30%',
              marginBottom: '20px',
            }}
            InputProps={{ inputProps: { min: moment(warrantyStateMax).format('YYYY-MM-DD') } }}
            type="date"
            name={warrantyEndDate.name}
            label={warrantyEndDate.label}
          /> */}
          <MuiDatePicker
            sx={{
              width: '30%',
              marginBottom: '20px',
            }}
            name={warrantyEndDate.name}
            label={warrantyEndDate.label}
            setFieldValue={setFieldValue}
            minDate={(warrantyStateMax)} 
            setFieldTouched={setFieldTouched}
            validateField={validateField}
          />
          <MuiAutoComplete
            sx={{
              width: '30%',
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            name={customerId.name}
            label={customerId.label}
            formGroupClassName="m-1"
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
                label={customerId.label}
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
                            <IoCloseOutline size={22} fontSize="small" />
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
          <MuiAutoComplete
            sx={{
              width: '30%',
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            name={amcType.name}
            label={amcType.label}
            formGroupClassName="m-1"
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
                label={amcType.label}
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
          {/* <MuiTextField
            sx={{
              width: '30%',
              marginBottom: '20px',
            }}
            name={amcStartDate.name}
            label={amcStartDate.label}
            InputProps={{ inputProps: { max: moment(new Date()).format('YYYY-MM-DD') } }}
            type="date"
            placeholder="AMC Start Date"
          /> */}
          <MuiDatePicker
            sx={{
              width: '30%',
              marginBottom: '20px',
            }}
            name={amcStartDate.name}
            label={amcStartDate.label}
            setFieldValue={setFieldValue}
            maxDate={dayjs(new Date())}
            setFieldTouched={setFieldTouched}
            validateField={validateField}
          />
          {/* <MuiTextField
            sx={{
              width: '30%',
              marginBottom: '20px',
            }}
            name={amcEndDate.name}
            label={amcEndDate.label}
            InputProps={{ inputProps: { min: moment(amcStateMax).format('YYYY-MM-DD') } }}
            type="date"
            placeholder="AMC End Date"
          /> */}
          <MuiDatePicker
            sx={{
              width: '30%',
              marginBottom: '20px',
            }}
            name={amcEndDate.name}
            label={amcEndDate.label}
            setFieldValue={setFieldValue}
            minDate={(amcStateMax)}
            setFieldTouched={setFieldTouched}
            validateField={validateField}
          />
          <MuiTextField
            sx={{
              width: '30%',
              marginBottom: '20px',
            }}
            name={amcCost.name}
            label={amcCost.label}
            setFieldValue={setFieldValue}
            inputProps={{ maxLength: 10 }}
            onKeyPress={decimalKeyPressDown}
          // value={values[amcCost.name]}
          />
          <MuiTextField
            sx={{
              width: '30%',
              marginBottom: '20px',
            }}
            name={referenceNumber.name}
            label={referenceNumber.label}
            setFieldValue={setFieldValue}
          // value={values[referenceNumber.name]}
          />
        </Box>
      </Box>
      {/* <Modal size="xl" className="border-radius-50px modal-dialog-centered searchData-modalwindow" isOpen={extraMultipleModal}>
        <ModalHeaderComponent title={modalName} imagePath={false} closeModalWindow={() => { setExtraMultipleModal(false); }} />
        <ModalBody className="mt-0 pt-0">
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
        </ModalBody>
      </Modal> */}
      <Dialog maxWidth="lg" open={extraMultipleModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraMultipleModal(false); }} sx={{ width: '1000px' }} />
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

AssetWarrantyForm.propTypes = {
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default AssetWarrantyForm;
