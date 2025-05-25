/* eslint-disable max-len */
/* eslint-disable react/jsx-indent */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  Col,
  Row, Modal,
  ModalBody,
} from 'reactstrap';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useFormikContext } from 'formik';
import {
  TextField, CircularProgress, FormHelperText,
} from '@material-ui/core';
import moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';

import { InputField, FormikAutocomplete } from '@shared/formFields';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import envelopeIcon from '@images/icons/envelope.svg';
import telephoneIcon from '@images/icons/telephone.svg';
import formFields from './formFields.json';
import {
  generateErrorMessage, integerKeyPress,
  getAllCompanies, decimalKeyPressDown,
} from '../../../util/appUtils';
import { getPartners } from '../../equipmentService';
import assetActionData from '../../data/assetsActions.json';
import { getAMCText } from '../../utils/utils';
import SearchModalMultiple from '../../forms/searchModalMultiple';

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
    warranty_start_date, amc_start_date,
  } = formValues;

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

  const { userInfo ,userRoles} = useSelector((state) => state.user);
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
      <Card className="no-border-radius mb-2">
        <CardBody className="p-0 bg-porcelain">
          <p className="ml-2 mb-1 mt-1 font-weight-600 font-side-heading">Warranty</p>
        </CardBody>
      </Card>
      <Row className="p-1 assest-request-form">
        {formFields && formFields.warrantyFields && formFields.warrantyFields.map((fields) => (
          <React.Fragment key={fields.id}>
            {(fields.type !== 'array') && (fields.name !== 'validated_on') && (
              <Col sm="6" md="6" xs="12" lg="6">
                {(fields.name !== 'purchase_date' && fields.name !== 'purchase_value'
                  && fields.name !== 'warranty_start_date' && fields.name !== 'warranty_end_date' && fields.name !== 'amc_start_date' && fields.name !== 'amc_end_date' && fields.name !== 'amc_cost') && (
                    <InputField
                      name={fields.name}
                      label={fields.label}
                      type={fields.type}
                      formGroupClassName="m-1"
                      readOnly={fields.readonly}
                    />
                )}
                {fields.name === 'purchase_date' && (
                  <InputField
                    name={fields.name}
                    label={fields.label}
                    type={fields.type}
                    formGroupClassName="m-1"
                    readOnly={fields.readonly}
                    max={moment(new Date()).format('YYYY-MM-DD')}
                  />
                )}
                {fields.name === 'purchase_value' && (
                  <InputField
                    name={fields.name}
                    label={fields.label}
                    type={fields.type}
                    formGroupClassName="m-1"
                    readOnly={fields.readonly}
                    onKeyPress={integerKeyPress}
                  />
                )}
                {fields.name === 'warranty_start_date' && (
                  <InputField
                    name={fields.name}
                    label={fields.label}
                    type={fields.type}
                    formGroupClassName="m-1"
                    readOnly={fields.readonly}
                    max={moment(new Date()).format('YYYY-MM-DD')}
                  />
                )}
                {fields.name === 'warranty_end_date' && (
                  <InputField
                    name={fields.name}
                    label={fields.label}
                    type={fields.type}
                    formGroupClassName="m-1"
                    readOnly={fields.readonly}
                    min={moment(warrantyStateMax).format('YYYY-MM-DD')}
                  />
                )}
                {fields.name === 'amc_start_date' && (
                  <InputField
                    name={fields.name}
                    label={fields.label}
                    type="date"
                    formGroupClassName="m-1"
                    readOnly={fields.readonly}
                    max={moment(new Date()).format('YYYY-MM-DD')}
                  />
                )}
                {fields.name === 'amc_end_date' && (
                  <InputField
                    name={fields.name}
                    label={fields.label}
                    type="date"
                    formGroupClassName="m-1"
                    readOnly={fields.readonly}
                    min={moment(amcStateMax).format('YYYY-MM-DD')}
                  />
                )}
                 {fields.name === 'amc_cost' && (
                  <InputField
                    name={fields.name}
                    label={fields.label}
                    type={fields.type}
                    maxLength="10"
                    autoComplete="off"
                    formGroupClassName="m-1"
                    readOnly={fields.readonly}
                    onKeyPress={decimalKeyPressDown}
                  />
                 )}
              </Col>
            )}
            {(fields.type === 'array') && (fields.name === 'manufacturer_id') && (
              <Col sm="12" md="12" xs="12" lg="6">
                <FormikAutocomplete
                  name={fields.name}
                  label={fields.label}
                  formGroupClassName="m-1"
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
                {(partnersInfo && partnersInfo.err && manufacturerOpen) && (
                  <FormHelperText><span className="text-danger">{generateErrorMessage(partnersInfo)}</span></FormHelperText>
                )}
              </Col>
            )}
            {(fields.type === 'array') && (fields.name === 'customer_id') && (
              <Col sm="12" md="12" xs="12" lg="6">
                <FormikAutocomplete
                  name={fields.name}
                  label={fields.label}
                  formGroupClassName="m-1"
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
            )}
            {(fields.type === 'array') && (fields.name === 'vendor_id') && (
              <Col sm="12" md="12" xs="12" lg="6">
                <FormikAutocomplete
                  name={fields.name}
                  label={fields.label}
                  formGroupClassName="m-1"
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
            )}
            {(fields.type === 'array') && (fields.name === 'amc_type') && (
              <Col sm="12" md="12" xs="12" lg="6">
                <FormikAutocomplete
                  name={fields.name}
                  label={fields.label}
                  formGroupClassName="m-1"
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
            )}
          </React.Fragment>
        ))}
      </Row>
      <Modal size="xl" className="border-radius-50px modal-dialog-centered searchData-modalwindow" isOpen={extraMultipleModal}>
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
      </Modal>
    </>
  );
};

WarrantyUpdateForm.propTypes = {
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};
export default WarrantyUpdateForm;
