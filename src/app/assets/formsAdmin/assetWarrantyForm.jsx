/* eslint-disable react/forbid-prop-types */
/* eslint-disable import/no-unresolved */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-props-no-spreading */
import {
  CircularProgress,
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import {
  Dialog, DialogContent, DialogContentText,
  TextField,
  Typography, Autocomplete,
} from '@mui/material';
import { Box } from '@mui/system';
import { useFormikContext } from 'formik';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';

import dayjs from 'dayjs';

import envelopeIcon from '@images/icons/envelope.svg';
import telephoneIcon from '@images/icons/telephone.svg';
import DialogHeader from '../../commonComponents/dialogHeader';
import MuiDatePicker from '../../commonComponents/multipleFormFields/muiDatePicker';
import { AddThemeColor } from '../../themes/theme';
import {
  decimalKeyPressDown,
  getAllowedCompanies,
  getOldData,
  getDatePickerFormat,
} from '../../util/appUtils';
import assetActionData from '../data/assetsActions.json';
import { getPartners } from '../equipmentService';
import SearchModalMultiple from './searchModalMultiple';
import { infoValue } from '../../adminSetup/utils/utils';

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
    values,
    setPartsData,
    partsData,
    setPartsAdd,
    index,
    formData,
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
      startDate,
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

  let warrantyStateMax = new Date();
  let amcStateMax = new Date();

  if (warranty_start_date) {
    const date = new Date(warranty_start_date);
    const value = date.setDate(date.getDate() + 1);
    warrantyStateMax = new Date(value);
  }

  if (amc_start_date) {
    const date = new Date(amc_start_date);
    const value = date.setDate(date.getDate() + 1);
    amcStateMax = new Date(value);
  }

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const { partnersInfo } = useSelector((state) => state.equipment);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && typeof manufacturerOpen === 'number') {
        await dispatch(getPartners(companies, appModels.PARTNER, 'supplier', manufacturerKeyword, false, 'yes'));
      }
    })();
  }, [userInfo, manufacturerKeyword, manufacturerOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && typeof customerOpen === 'number') {
        await dispatch(getPartners(companies, appModels.PARTNER, 'customer', customerKeyword, false, 'yes'));
      }
    })();
  }, [userInfo, customerKeyword, customerOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && typeof vendorOpen === 'number') {
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

  const onFieldClear = (field) => {
    const newData = partsData;
    newData[index][field] = '';
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  const onVendorKeywordClear = () => {
    setVendorKeyword(null);
    onFieldClear('vendor_id');
    setVendorOpen(false);
  };

  const onManufacturerKeywordClear = () => {
    setManufacturerKeyword(null);
    setFieldValue('manufacturer_id', '');
    onFieldClear('manufacturer_id');
    setManufacturerOpen(false);
  };

  const onCustomerKeywordClear = () => {
    setCustomerKeyword(null);
    setFieldValue('customer_id', '');
    onFieldClear('customer_id');
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
    if (manufacturerOpen === index) {
      manufacturerOptions = [{ display_name: 'Loading..' }];
    }
    if (customerOpen === index) {
      customerOptions = [{ display_name: 'Loading..' }];
    }
    if (vendorOpen === index) {
      vendorOptions = [{ display_name: 'Loading..' }];
    }
  }
  if (partnersInfo && partnersInfo.data) {
    if (manufacturerOpen === index) {
      manufacturerOptions = partnersInfo.data;
    }
    if (customerOpen === index) {
      customerOptions = partnersInfo.data;
    }
    if (vendorOpen === index) {
      vendorOptions = partnersInfo.data;
    }
  }

  const onDropdownChange = (e, indexV, field, name) => {
    const newData = partsData;
    newData[indexV][field] = { id: e.id, [name]: name ? e[name] : e.name };
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  const onDropdownCustom = (e, indexV, field, name) => {
    const newData = partsData;
    newData[indexV][field] = { value: e.value, label: e.label };
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  const onDateChange = (e, indexV, field, name) => {
    const newData = partsData;
    newData[indexV][field] = e;
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  const onTextFieldChange = (e, indexV, field) => {
    const newData = partsData;
    newData[indexV][field] = e.target.value;
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

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
          Warranty Info
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
          <Autocomplete
            sx={{
              width: '30%',
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            name={amcType.name}
            label={amcType.label}
            className="bg-white"
            open={amcOpen === index}
            size="small"
            onOpen={() => {
              setAmcOpen(index);
            }}
            onClose={() => {
              setAmcOpen(false);
            }}
            value={formData.amc_type && formData.amc_type.label ? formData.amc_type.label : formData.amc_type}
            onChange={(e, data) => { onDropdownCustom(data, index, 'amc_type'); }}
            getOptionSelected={(option, value) => option.label === value.label}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
            options={assetActionData.amcTypes}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label={(
                  <>
                    {amcType.label}
                    {infoValue('amc_type')}
                  </>
                )}
                className="without-padding"
                InputLabelProps={{ shrink: true }}
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
          <MuiDatePicker
            sx={{
              width: '30%',
              marginBottom: '20px',
            }}
            label={(
              <>
                {amcStartDate.label}
                {infoValue('amc_start_date')}
              </>
            )}
            value={(formData[amcStartDate.name])}
            onChange={(e) => onDateChange(e, index, amcStartDate.name)}
            maxDate={dayjs(new Date())}
          />
          <MuiDatePicker
            sx={{
              width: '30%',
              marginBottom: '20px',
            }}
            label={(
              <>
                {amcEndDate.label}
                {infoValue('amc_end_date')}
              </>
            )}
            value={(formData[amcEndDate.name])}
            onChange={(e) => onDateChange(e, index, amcEndDate.name)}
            minDate={dayjs(amcStateMax)}
          />
          <TextField
            className="bg-white"
            variant="standard"
            onChange={(e) => onTextFieldChange(e, index, amcCost.name)}
            value={formData[amcCost.name]}
            sx={{
              width: '30%',
              marginBottom: '20px',
            }}
            name={amcCost.name}
            label={(
              <>
                {amcCost.label}
                {infoValue('amc_cost')}
              </>
            )}
            setFieldValue={setFieldValue}
            inputProps={{ maxLength: 10 }}
            onKeyPress={decimalKeyPressDown}
          // value={values[amcCost.name]}
          />
          <Autocomplete
            sx={{
              width: '30%',
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            name={vendorId.name}
            label={vendorId.label}
            className="bg-white"
            open={vendorOpen === index}
            size="small"
            onOpen={() => {
              setVendorOpen(index);
              setVendorKeyword('');
            }}
            onClose={() => {
              setVendorOpen(false);
              setVendorKeyword('');
            }}
            value={formData.vendor_id && formData.vendor_id.display_name ? formData.vendor_id.display_name : getOldData(formData.vendor_id)}
            isOptionEqualToValue={(option, value) => option.display_name === value.display_name}
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
            onChange={(e, data) => { onDropdownChange(data, index, 'vendor_id', 'display_name'); }}
            options={vendorOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onVendorKeywordChange}
                InputLabelProps={{ shrink: true }}
                variant="standard"
                label={(
                  <>
                    {vendorId.label}
                    {infoValue('vendor_id')}
                  </>
                )}
                value={vendorKeyword}
                className={((formData.vendor_id && formData.vendor_id.id) || (vendorKeyword && vendorKeyword.length > 0) || (formData.vendor_id && formData.vendor_id.length))
                  ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {partnersInfo && partnersInfo.loading && vendorOpen === index ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {((formData.vendor_id && formData.vendor_id.id) || (vendorKeyword && vendorKeyword.length > 0) || (formData.vendor_id && formData.vendor_id.length)) && (
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
          <MuiDatePicker
            sx={{
              width: '30%',
              marginBottom: '20px',
            }}
            label={(
              <>
                {warrantyStartDate.label}
                {infoValue('warranty_start_date')}
              </>
            )}
            value={(formData[warrantyStartDate.name])}
            onChange={(e) => onDateChange(e, index, warrantyStartDate.name)}
            maxDate={dayjs(new Date())}
          />
          <MuiDatePicker
            sx={{
              width: '30%',
              marginBottom: '20px',
            }}
            label={(
              <>
                {warrantyEndDate.label}
                {infoValue('warranty_end_date')}
              </>
            )}
            value={(formData[warrantyEndDate.name])}
            onChange={(e) => onDateChange(e, index, warrantyEndDate.name)}
            minDate={dayjs(warrantyStateMax)}
          />
        </Box>
        <Typography
          sx={AddThemeColor({
            font: 'normal normal medium 20px/24px Suisse Intl',
            letterSpacing: '0.7px',
            fontWeight: 500,
            marginBottom: '20px',
          })}
        >
          Purchase Info
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
          <MuiDatePicker
            sx={{
              width: '30%',
              marginBottom: '20px',
            }}
            label={(
              <>
                {purchaseDate.label}
                {infoValue('purchase_date')}
              </>
            )}
            value={(formData[purchaseDate.name])}
            onChange={(e) => onDateChange(e, index, purchaseDate.name)}
            maxDate={dayjs(new Date())}
          />
          <TextField
            className="bg-white"
            variant="standard"
            onChange={(e) => onTextFieldChange(e, index, purchaseValue.name)}
            value={formData[purchaseValue.name]}
            InputLabelProps={{ shrink: true }}
            sx={{
              width: '30%',
              marginBottom: '20px',
            }}
            type="text"
            name={purchaseValue.name}
            label={(
              <>
                {purchaseValue.label}
                {infoValue('purchase_value')}
              </>
            )}
            onKeyPress={decimalKeyPressDown}
          />
          <Autocomplete
            sx={{
              width: '30%',
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            name={customerId.name}
            label={customerId.label}
            className="bg-white"
            open={customerOpen === index}
            size="small"
            onOpen={() => {
              setCustomerOpen(index);
              setCustomerKeyword('');
            }}
            onClose={() => {
              setCustomerOpen(false);
              setCustomerKeyword('');
            }}
            value={formData.customer_id && formData.customer_id.display_name ? formData.customer_id.display_name : getOldData(formData.customer_id)}
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
            onChange={(e, data) => { onDropdownChange(data, index, 'customer_id', 'display_name'); }}
            options={customerOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onCustomerKeywordChange}
                variant="standard"
                InputLabelProps={{ shrink: true }}
                label={(
                  <>
                    {customerId.label}
                    {infoValue('customer_id')}
                  </>
                )}
                value={customerKeyword}
                className={((formData.customer_id && formData.customer_id.id) || (customerKeyword && customerKeyword.length > 0) || (formData.customer_id && formData.customer_id.length))
                  ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {partnersInfo && partnersInfo.loading && customerOpen === index ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {((formData.customer_id && formData.customer_id.id) || (customerKeyword && customerKeyword.length > 0) || (formData.customer_id && formData.customer_id.length)) && (
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
          <MuiDatePicker
            sx={{
              width: '30%',
              marginBottom: '20px',
            }}
            label={(
              <>
                {startDate.label}
                {infoValue('start_date')}
              </>
            )}
            value={(formData[startDate.name])}
            onChange={(e) => onDateChange(e, index, startDate.name)}
          />
          <TextField
            className="bg-white"
            variant="standard"
            onChange={(e) => onTextFieldChange(e, index, referenceNumber.name)}
            value={formData[referenceNumber.name]}
            sx={{
              width: '30%',
              marginBottom: '20px',
            }}
            InputLabelProps={{ shrink: true }}
            name={referenceNumber.name}
            label={(
              <>
                {referenceNumber.label}
                {infoValue('asset_id')}
              </>
            )}
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
              setPartsData={setPartsData}
              partsData={partsData}
              setPartsAdd={setPartsAdd}
              index={index}
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
