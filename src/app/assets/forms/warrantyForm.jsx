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
  TextField, CircularProgress, FormHelperText,
} from '@material-ui/core';
import {
  Card, CardBody, Row, Col,
} from 'reactstrap';
import { makeStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';

import { InputField, FormikAutocomplete } from '@shared/formFields';
import envelopeIcon from '@images/icons/envelope.svg';
import telephoneIcon from '@images/icons/telephone.svg';
import {
  generateErrorMessage, noSpecialChars, 
  getAllCompanies, decimalKeyPress,
} from '../../util/appUtils';
import { getPartners } from '../equipmentService';
import assetActionData from '../data/assetsActions.json';
import SearchModalMultiple from './searchModalMultiple';
import { Dialog, DialogContent, DialogContentText } from '@mui/material';
import DialogHeader from '../../commonComponents/dialogHeader';

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

const WarrantyForm = (props) => {
  const {
    setFieldValue,
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
      <Card className="no-border-radius mb-2 ">
        <CardBody className="p-0 bg-porcelain">
          <p className="ml-2 mb-1 mt-1 font-weight-600 font-side-heading">Warranty</p>
        </CardBody>
      </Card>
      <Row className="p-1 assest-request-form ">
        <Col sm="12" md="12" xs="12" lg="6">
          <FormikAutocomplete
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
            classes={{
              option: classes.option,
            }}
            loading={partnersInfo && partnersInfo.loading}
            getOptionSelected={(option, value) => option.display_name === value.display_name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.display_name)}
            renderOption={(option) => (
              <>
                <h6>{option.display_name}</h6>
                <p className="float-left">
                  {option.email && (
                    <>
                      <img src={envelopeIcon} alt="mail" height="13" width="13" className="mr-2" />
                      {option.email}
                    </>
                  )}
                </p>
                <p className="float-right">
                  {option.mobile && (
                    <>
                      <img src={telephoneIcon} alt="telephone" height="13" width="13" className="mr-2" />
                      {option.mobile}
                    </>
                  )}
                </p>
              </>
            )}
            options={manufacturerOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onManufacturerKeywordChange}
                variant="outlined"
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
          {(partnersInfo && partnersInfo.err) && manufacturerOpen && (
            <FormHelperText><span className="text-danger">{generateErrorMessage(partnersInfo)}</span></FormHelperText>
          )}
        </Col>
        <Col sm="12" md="12" xs="12" lg="6">
          <FormikAutocomplete
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
            classes={{
              option: classes.option,
            }}
            loading={partnersInfo && partnersInfo.loading}
            getOptionSelected={(option, value) => option.display_name === value.display_name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.display_name)}
            renderOption={(option) => (
              <>
                <h6>{option.display_name}</h6>
                <p className="float-left">
                  {option.email && (
                    <>
                      <img src={envelopeIcon} alt="mail" height="13" width="13" className="mr-2" />
                      {option.email}
                    </>
                  )}
                </p>
                <p className="float-right">
                  {option.mobile && (
                    <>
                      <img src={telephoneIcon} alt="telephone" height="13" width="13" className="mr-2" />
                      {option.mobile}
                    </>
                  )}
                </p>
              </>
            )}
            options={vendorOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onVendorKeywordChange}
                variant="outlined"
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
          {(partnersInfo && partnersInfo.err) && vendorOpen && (
            <FormHelperText><span className="text-danger">{generateErrorMessage(partnersInfo)}</span></FormHelperText>
          )}
        </Col>
        <Col xs={12} md={6} lg={6} sm={6}>
          <InputField
            name={purchaseDate.name}
            label={purchaseDate.label}
            formGroupClassName="m-1"
            max={moment(new Date()).format('YYYY-MM-DD')}
            type="date"
          />
        </Col>
        <Col xs={12} md={6} lg={6} sm={6}>
          <InputField
            name={purchaseValue.name}
            label={purchaseValue.label}
            formGroupClassName="m-1"
            onKeyPress={decimalKeyPress}
            type="text"
          />
        </Col>
        <Col xs={12} md={3} lg={3} sm={3}>
          <InputField
            name={warrantyStartDate.name}
            label={warrantyStartDate.label}
            formGroupClassName="m-1"
            max={moment(new Date()).format('YYYY-MM-DD')}
            type="date"
          />
        </Col>
        <Col xs={12} md={3} lg={3} sm={3}>
          <InputField
            name={warrantyEndDate.name}
            label=""
            labelClassName="mt-3"
            formGroupClassName="m-1"
            min={moment(warrantyStateMax).format('YYYY-MM-DD')}
            type="date"
          />
        </Col>
        <Col sm="6" md="6" xs="12" lg="6">
          <FormikAutocomplete
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
            classes={{
              option: classes.option,
            }}
            loading={customerOpen && partnersInfo && partnersInfo.loading}
            getOptionSelected={(option, value) => option.display_name === value.display_name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.display_name)}
            renderOption={(option) => (
              <>
                <h6>{option.display_name}</h6>
                <p className="float-left">
                  {option.email && (
                    <>
                      <img src={envelopeIcon} alt="mail" height="13" width="13" className="mr-2" />
                      {option.email}
                    </>
                  )}
                </p>
                <p className="float-right">
                  {option.mobile && (
                    <>
                      <img src={telephoneIcon} alt="telephone" height="13" width="13" className="mr-2" />
                      {option.mobile}
                    </>
                  )}
                </p>
              </>
            )}
            options={customerOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onCustomerKeywordChange}
                variant="outlined"
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
          {(partnersInfo && partnersInfo.err) && customerOpen && (
            <FormHelperText><span className="text-danger">{generateErrorMessage(partnersInfo)}</span></FormHelperText>
          )}
        </Col>
        <Col sm="6" md="6" xs="12" lg="6">
          <FormikAutocomplete
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
        <Col xs={12} md={3} lg={3} sm={3}>
          <InputField
            name={amcStartDate.name}
            label={amcStartDate.label}
            formGroupClassName="m-1"
            min={moment(new Date()).format('YYYY-MM-DD')}
            type="date"
            placeholder="AMC Start Date"
          />
        </Col>
        <Col xs={12} md={3} lg={3} sm={3}>
          <InputField
            name={amcEndDate.name}
            label=""
            labelClassName="mt-3"
            formGroupClassName="m-1"
            min={moment(amcStateMax).format('YYYY-MM-DD')}
            type="date"
            placeholder="AMC End Date"
          />
        </Col>
        <Col xs={12} md={6} lg={6} sm={6}>
          <InputField
            name={amcCost.name}
            label={amcCost.label}
            formGroupClassName="m-1"
            maxLength="10"
            autoComplete="off"
            onKeyPress={decimalKeyPress}
            type="text"
          />
        </Col>
        <Col xs={12} md={6} lg={6} sm={6}>
          <InputField
            name={referenceNumber.name}
            label={referenceNumber.label}
            formGroupClassName="m-1"
            onKeyPress={noSpecialChars}
            type="text"
          />
        </Col>
      </Row>
        <Dialog size="xl" fullWidth open={extraMultipleModal}>
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
          </ DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
};

WarrantyForm.propTypes = {
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default WarrantyForm;
