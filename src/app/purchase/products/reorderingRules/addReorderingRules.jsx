/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-nested-ternary */
import { ThemeProvider } from '@material-ui/core/styles';
import { Form, Formik } from 'formik';
import * as PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Col, Row,
} from 'reactstrap';

import Loader from '@shared/loading';
import SuccessAndErrorModalWindow from '@shared/successAndErrorModalWindow';

import InventoryBlue from '@images/icons/inventoryBlue.svg';
import {
  CircularProgress, FormHelperText,
} from '@material-ui/core';
import {
  Box, Button, FormControl, TextField, Typography, Divider, ListItemText,
} from '@mui/material';

import { getProductsList } from '../../../preventiveMaintenance/ppmService';
import {
  decimalKeyPress, generateErrorMessage, getAllowedCompanies, reorderingRuleApiErrorMsg, reorderingRuleStaticErrorMsg,
  truncate,
} from '../../../util/appUtils';
import theme from '../../../util/materialTheme';
import {
  addReorderingRules,
  getMeasures,
  getStockLocations, getStockWarehouses, updateReorderingRule,
} from '../../purchaseService';
import customData from './data/customData.json';
import checkoutFormModel from './formModel/checkoutFormModel';
import formInitialValues from './formModel/formInitialValues';
import validationSchema from './formModel/validationSchema';

import MuiAutoComplete from '../../../commonComponents/formFields/muiAutocomplete';
import MuiTextField from '../../../commonComponents/formFields/muiTextField';
import { AddThemeColor } from '../../../themes/theme';

const { formId, formField } = checkoutFormModel;

const appModels = require('../../../util/appModels').default;

const AddRerderingRules = ({
  editId, afterReset, product, closeAddModal, defaultWarehouse, defaultLocation,
}) => {
  const dispatch = useDispatch();
  const [edit, setEdit] = useState(false);
  const [productOpen, setProductOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  const [leadTypeOpen, setLeadTypeOpen] = useState(false);
  const [warehouseOpen, setWarehouseOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [productOptions, setProductOptions] = useState([]);
  const [productKeyWord, setProductKeyWord] = useState('');
  const [uomOpen, setUomOpen] = useState(false);
  const [uomKeyword, setUomKeyword] = useState('');
  const [initialValues, setInitialValues] = useState(formInitialValues);
  const [isOpenSuccessAndErrorModalWindow, setIsOpenSuccessAndErrorModalWindow] = useState(false);

  let warehouseOptions = [];
  let locationOptions = [];
  const {
    addReorderInfo, updateReorderInfo, stockLocations, stockWarehouses, reOrderingRuleDetailsInfo, measuresInfo,
  } = useSelector((state) => state.purchase);
  const { userInfo } = useSelector((state) => state.user);
  const { productInfo } = useSelector((state) => state.ppm);
  const userCompanies = userInfo && userInfo.data && userInfo.data.allowed_companies && userInfo.data.allowed_companies.length > 0 ? userInfo.data.allowed_companies : [];
  const {
    siteDetails,
  } = useSelector((state) => state.site);
  const companies = siteDetails && siteDetails.data && siteDetails.data.length && siteDetails.data[0].id ? siteDetails.data[0].id : getAllowedCompanies(userInfo);

  const {
    inventorySettingsInfo,
  } = useSelector((state) => state.site);

  const invSettingData = inventorySettingsInfo && inventorySettingsInfo.data && inventorySettingsInfo.data.length ? inventorySettingsInfo.data[0] : false;
  const productsListAccess = invSettingData ? invSettingData.products_list_access : false;
  const productsListId = invSettingData && productsListAccess && productsListAccess === 'Company Level' && invSettingData.product_list_company_id.id ? invSettingData.product_list_company_id.id : false;

  useEffect(() => {
    if (productInfo && productInfo.data && productInfo.data.length > 0) {
      const { data } = productInfo;
      setProductOptions(data.map((cl) => ({
        ...cl, value: cl.id, label: cl.name,
      })));
    }
  }, [productInfo]);

  if (stockLocations && stockLocations.loading) {
    locationOptions = [{ display_name: 'Loading..' }];
  }

  if (stockLocations && stockLocations.err) {
    locationOptions = [];
  }

  if (stockLocations && stockLocations.data) {
    const arr = [...locationOptions, ...stockLocations.data];
    locationOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }

  if (stockWarehouses && stockWarehouses.loading) {
    warehouseOptions = [{ name: 'Loading..' }];
  }

  if (stockWarehouses && stockWarehouses.err) {
    warehouseOptions = [];
  }

  if (stockWarehouses && stockWarehouses.data) {
    const arr = [...warehouseOptions, ...stockWarehouses.data];
    warehouseOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }
  let measureOptions = [];

  if (measuresInfo && measuresInfo.loading) {
    measureOptions = [{ name: 'loading' }];
  }
  if (measuresInfo && measuresInfo.data) {
    measureOptions = measuresInfo.data;
  }
  if (measuresInfo && measuresInfo.err) {
    measureOptions = [];
  }

  function getOldDataId(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[0] : '';
  }

  const handleSubmit = (values) => {
    if (editId) {
      const postData = {
        name: (values?.product_id?.name && (values?.location_id?.display_name || values?.location_id?.name)) ? `${values?.product_id?.name}|${values?.location_id?.display_name || values?.location_id?.name}|${values?.product_min_qty}` : values?.name,
        product_id: values.product_id && values.product_id.id ? values.product_id.id : values.product_id[0],
        company_id: values.company_id && values.company_id.id ? values.company_id.id : values.company_id[0],
        warehouse_id: values.warehouse_id && values.warehouse_id.id ? values.warehouse_id.id : values.warehouse_id[0],
        location_id: values.location_id && values.location_id.id ? values.location_id.id : values.location_id[0],
        purchase_ok: values.purchase_ok,
        product_min_qty: parseFloat(values.product_min_qty ? values.product_min_qty : 0),
        product_max_qty: parseFloat(values.product_max_qty ? values.product_max_qty : 0),
        product_alert_level_qty: parseFloat(values.product_alert_level_qty ? values.product_alert_level_qty : 0),
        qty_multiple: parseFloat(values.qty_multiple ? values.qty_multiple : 1),
        lead_days: values.lead_days ? values.lead_days : 1,
        lead_type: values.lead_type ? values.lead_type.value : '',
        product_uom: values.product_uom && values.product_uom.id ? values.product_uom.id : values.product_uom[0],
      };
      if (!edit) {
        setIsOpenSuccessAndErrorModalWindow(true);
        setEdit(true);
        dispatch(updateReorderingRule(appModels.REORDERINGRULES, editId, postData));
      }
    } else {
      setIsOpenSuccessAndErrorModalWindow(true);
      const postData = {
        name: (values?.product_id?.name && (values?.location_id?.display_name || values?.location_id?.name)) ? `${values?.product_id?.name}|${values?.location_id?.display_name || values?.location_id?.name}|${values?.product_min_qty}` : '',
        product_id: values.product_id ? values.product_id.id : '',
        company_id: values.company_id ? values.company_id.id : '',
        warehouse_id: values.warehouse_id ? values.warehouse_id.id : '',
        location_id: values.location_id && values.location_id.id ? values.location_id.id : getOldDataId(values.location_id),
        purchase_ok: values.purchase_ok,
        product_min_qty: parseFloat(values.product_min_qty ? values.product_min_qty : 0),
        product_max_qty: parseFloat(values.product_max_qty ? values.product_max_qty : 0),
        product_alert_level_qty: parseFloat(values.product_alert_level_qty ? values.product_alert_level_qty : 0),
        qty_multiple: parseFloat(values.qty_multiple ? values.qty_multiple : 1),
        lead_days: values.lead_days ? values.lead_days : 1,
        lead_type: values.lead_type ? values.lead_type.value : '',
        product_uom: values.product_id.uom_id && values.product_id.uom_id.length ? values.product_id.uom_id[0] : values.product_id.uom_id && values.product_id.uom_id.id ? values.product_id.uom_id.id : '',
      };
      const payload = { model: appModels.REORDERINGRULES, values: postData };
      dispatch(addReorderingRules(appModels.REORDERINGRULES, payload));
    }
  };

  const onUomKeyWordChange = (event) => {
    setUomKeyword(event.target.value);
  };

  useEffect(() => {
    if (userInfo && userInfo.data && uomOpen) {
      dispatch(getMeasures(appModels.UOM, uomKeyword));
    }
  }, [userInfo, uomOpen, uomKeyword]);

  useEffect(() => {
    if (product && product.id) {
      formInitialValues.product_id = product;
      const pid = {
        ...formInitialValues,
        product_id: product && product.id ? product : '',
      };
      setInitialValues(pid);
    } else {
      formInitialValues.product_id = '';
    }
  }, [product]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const userCompanyId = userInfo && userInfo.data && userInfo.data.company ? userInfo.data.company : '';
      const companyIds = siteDetails && siteDetails.data && siteDetails.data.length && siteDetails.data[0].id ? { id: siteDetails.data[0].id, name: siteDetails.data[0].name } : userCompanyId;
      formInitialValues.company_id = companyIds;
      setInitialValues({
        ...formInitialValues,
        company_id: companyIds,
      });
    }
  }, [userInfo]);

  useEffect(() => {
    if (userInfo && userInfo.data && productOpen) {
      dispatch(getProductsList(productsListId || companies, appModels.PRODUCT, productKeyWord, 'purchase'));
    }
  }, [userInfo, productOpen]);

  useEffect(() => {
    if (userInfo && userInfo.data && (locationOpen || defaultLocation)) {
      dispatch(getStockLocations(companies, appModels.STOCKLOCATION));
    }
  }, [userInfo, locationOpen]);

  useEffect(() => {
    if (userInfo && userInfo.data && (warehouseOpen || defaultWarehouse)) {
      dispatch(getStockWarehouses(companies, appModels.WAREHOUSE));
    }
  }, [userInfo, warehouseOpen]);

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

  const onProductKeywordChange = (event) => {
    setProductKeyWord(event.target.value);
  };
  useEffect(() => {
    if (userInfo && userInfo.data) {
      // eslint-disable-next-line prefer-destructuring
      formInitialValues.lead_type = customData.leadTypes[0];
    }
  }, [userInfo]);
  const getDefaultLeadTypeValue = (value) => {
    const leadTypeValue = customData.leadTypes.filter((data) => data.value === value);
    if (leadTypeValue && leadTypeValue.length) {
      return leadTypeValue[0];
    }
    return '-';
  };

  const closeSuccessWindow = () => {
    setIsOpenSuccessAndErrorModalWindow(false);
    afterReset();
  };

  const handleReset = (resetForm) => {
    resetForm();
    setEdit(false);
    setIsOpenSuccessAndErrorModalWindow(false);
    setTimeout(() => {
      if (afterReset) afterReset();
    }, 1000);
  };

  const getUomValue = (values) => {
    let uomValue;
    if (values.product_id && values.product_id.uom_id && values.product_id.uom_id.length) {
      uomValue = { id: values.product_id.uom_id[0], name: values.product_id.uom_id[1] };
    } else if (values.product_id && values.product_id.uom_id && typeof values.product_id.uom_id === 'object') {
      uomValue = values.product_id.uom_id;
    } else {
      uomValue = getOldData(values.product_uom);
    }
    return uomValue;
  };

  useEffect(() => {
    if (defaultWarehouse && stockWarehouses && stockWarehouses.data && stockWarehouses.data.length) {
      //formInitialValues.warehouse_id = stockWarehouses.data[0];
      setInitialValues({
        ...formInitialValues,
        warehouse_id: stockWarehouses.data[0],
      });
      if (stockWarehouses.data[0] && stockWarehouses.data[0].lot_stock_id && stockWarehouses.data[0].lot_stock_id.length && defaultLocation) {
        setInitialValues({
          ...formInitialValues,
          warehouse_id: stockWarehouses.data[0],
          location_id: {
            id: stockWarehouses.data[0].lot_stock_id[0],
            display_name: stockWarehouses.data[0].lot_stock_id[1],
            name: stockWarehouses.data[0].lot_stock_id[1],
          },
        });
      }
    }
  }, [defaultWarehouse, stockWarehouses, defaultLocation]);


  const computedInitialValues = editId
  && reOrderingRuleDetailsInfo?.data?.length > 0
    ? reOrderingRuleDetailsInfo.data[0]
    : initialValues;

  return (
    <Row className="drawer-list thin-scrollbar pl-0 pr-0 pt-4 mr-0 ml-0">
      <Col md="12" sm="12" lg="12" xs="12">
        <Formik
          enableReinitialize
          initialValues={editId && reOrderingRuleDetailsInfo && reOrderingRuleDetailsInfo.data && reOrderingRuleDetailsInfo.data.length > 0 ? reOrderingRuleDetailsInfo.data[0] : computedInitialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            isValid, values, dirty, setFieldValue, resetForm,
          }) => {
            console.log('Form Values:', values); return (
              <Form id={formId}>
                <ThemeProvider theme={theme}>
                  <Box
                    sx={{
                      width: '100%',
                    }}
                  >
                    <FormControl
                      sx={{
                        width: '100%',
                        padding: '10px 0px 20px 30px',
                        overflowX: 'hidden',
                        borderTop: '1px solid #0000001f',
                      }}
                    >
                      <Box sx={{ width: '100%', display: 'flex', gap: '35px' }}>
                        <Box sx={{ width: '50%' }}>
                          <Typography
                            sx={AddThemeColor({
                              font: 'normal normal medium 20px/24px Suisse Intl',
                              letterSpacing: '0.7px',
                              fontWeight: 500,
                            })}
                          >
                            Product Info
                          </Typography>
                          {/* <MuiTextField
                          sx={{
                            marginBottom: '10px',
                            marginTop: '10px',
                          }}
                          type="text"
                          name={formField.name.name}
                          label={formField.name.label}
                          setFieldValue={setFieldValue}
                          isRequired={formField.name.isRequired}
                          inputProps={{
                            maxLength: 30,
                          }}
                        /> */}
                          <MuiAutoComplete
                            sx={{
                              marginBottom: '10px',
                              marginTop: '12px',
                            }}
                            name={formField.productId.name}
                            label={formField.productId.label}
                            isRequired={formField.productId.isRequired}
                            formGroupClassName="mb-1 w-100"
                            open={productOpen}
                            size="small"
                            onOpen={() => {
                              setProductOpen(true);
                              setProductKeyWord('');
                            }}
                            onClose={() => {
                              setProductOpen(false);
                              setProductKeyWord('');
                            }}
                            value={values.product_id && values.product_id.name ? values.product_id.name : getOldData(values.product_id)}
                            loading={productInfo && productInfo.loading}
                            getOptionSelected={(option, value) => option.name === value && value.name}
                            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                            options={productOptions}
                            renderOption={(props, option) => (
                              <>
                                <ListItemText
                                  {...props}
                                  primary={(
                                    <>
                                      <Box>
                                        <Typography
                                          sx={{
                                            font: 'Suisse Intl',
                                            fontWeight: 500,
                                            fontSize: '15px',
                                          }}
                                        >
                                          {option.name}
                                          {option.unique_code && (
                                          <>
                                            {'  '}
                                            |
                                            <span className="ml-1">{option.unique_code}</span>
                                          </>

                                          )}
                                        </Typography>
                                      </Box>
                                      <Box>
                                        <Typography
                                          sx={{
                                            font: 'Suisse Intl',
                                            fontSize: '12px',
                                          }}
                                        >
                                          {option.brand ? truncate(option.brand, 17) : '-'}
                                        </Typography>
                                      </Box>
                                      <Box>
                                        <Typography
                                          sx={{
                                            font: 'Suisse Intl',
                                            fontSize: '12px',
                                          }}
                                        >
                                          {option.uom_id && option.uom_id.length > 0 ? option.uom_id[1] : ''}
                                          <br />
                                          <span className="font-tiny mt-2">
                                            {option.categ_id && option.categ_id.length > 0 ? truncate(option.categ_id[1]) : ''}
                                          </span>
                                        </Typography>
                                      </Box>
                                    </>
                                )}
                                />
                                <Divider />
                              </>
                            )}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                variant="standard"
                                label={`${formField.productId.label}`}
                                required
                                className="without-padding"
                                placeholder="Search & Select"
                                onChange={onProductKeywordChange}
                                InputProps={{
                                  ...params.InputProps,
                                  endAdornment: (
                                    <>
                                      {productInfo && productInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                                      {params.InputProps.endAdornment}
                                    </>
                                  ),
                                }}
                              />
                            )}
                          />
                          {(productInfo && productInfo.err) && productOpen && (<FormHelperText><span className="text-danger">{generateErrorMessage(productInfo)}</span></FormHelperText>)}

                          <MuiAutoComplete
                            sx={{
                              marginBottom: '10px',
                            }}
                            name={formField.company.name}
                            label={formField.company.label}
                            formGroupClassName="m-1"
                            labelClassName="font-weight-600"
                            open={companyOpen}
                            size="small"
                            onOpen={() => {
                              setCompanyOpen(true);
                            }}
                            onClose={() => {
                              setCompanyOpen(false);
                            }}

                            value={values.company_id && values.company_id.name ? values.company_id.name : getOldData(values.company_id)}
                            getOptionSelected={(option, value) => option.name === value && value.name}
                            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                            options={userCompanies}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                variant="standard"
                                label={`${formField.company.label}`}
                                required
                                className="without-padding"
                             // placeholder={values.company_id && values.company_id.name ? values.company_id.name : getOldData(values.company_id)}
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

                          <MuiAutoComplete
                            sx={{
                              marginBottom: '10px',
                            }}
                            name={formField.warehouse.name}
                            label={formField.warehouse.label}
                            isRequired={formField.warehouse.isRequired}
                            formGroupClassName="mb-1 w-100"
                            value={values.warehouse_id && values.warehouse_id.name ? values.warehouse_id.name : getOldData(values.warehouse_id)}
                            open={warehouseOpen}
                            size="small"
                            onOpen={() => {
                              setWarehouseOpen(true);
                            }}
                            onClose={() => {
                              setWarehouseOpen(false);
                            }}
                            loading={stockWarehouses && stockWarehouses.loading}
                            getOptionSelected={(option, value) => option.name === value && value.name}
                            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                            options={warehouseOptions}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                variant="standard"
                                label={`${formField.warehouse.label}`}
                                required
                                className="without-padding custom-icons2"
                                placeholder="Search & Select"
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
                          {(stockWarehouses && stockWarehouses.err) && warehouseOpen && (<FormHelperText><span className="text-danger">{generateErrorMessage(stockWarehouses)}</span></FormHelperText>)}

                          <MuiAutoComplete
                            sx={{
                              marginBottom: '10px',
                            }}
                            name={formField.location.name}
                            label={formField.location.label}
                            isRequired={formField.location.isRequired}
                            formGroupClassName="mb-1 w-100"
                            open={locationOpen}
                            size="small"
                            onOpen={() => {
                              setLocationOpen(true);
                            }}
                            onClose={() => {
                              setLocationOpen(false);
                            }}
                            value={values.location_id && values.location_id.display_name
                              ? values.location_id.display_name : getOldData(values.location_id)}
                            loading={stockLocations && stockLocations.loading}
                            getOptionSelected={(option, value) => option.display_name === value.display_name}
                            getOptionLabel={(option) => (typeof option === 'string' ? option : option.display_name)}
                            options={locationOptions}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                variant="standard"
                                label={formField.location.label}
                                required={formField.location.isRequired}
                                className="without-padding"
                                placeholder="Search & Select"
                                InputProps={{
                                  ...params.InputProps,
                                  endAdornment: (
                                    <>
                                      {stockLocations && stockLocations.loading ? <CircularProgress color="inherit" size={20} /> : null}
                                      {params.InputProps.endAdornment}
                                    </>
                                  ),
                                }}
                              />
                            )}
                          />
                          {(stockLocations && stockLocations.err) && locationOpen && (<FormHelperText><span className="text-danger">{generateErrorMessage(stockLocations)}</span></FormHelperText>)}

                          <MuiAutoComplete
                            sx={{
                              marginBottom: '10px',
                            }}
                            name={formField.productUnitOfMeasure.name}
                            label={formField.productUnitOfMeasure.label}
                            isRequired={formField.productUnitOfMeasure.isRequired}
                            formGroupClassName="mb-2"
                            labelClassName="mb-2"
                            open={uomOpen}
                            disabled
                            size="small"
                            onOpen={() => {
                              setUomOpen(true);
                              setUomKeyword('');
                            }}
                            onClose={() => {
                              setUomOpen(false);
                              setUomKeyword('');
                            }}
                            value={getUomValue(values)}
                            getOptionSelected={(option, value) => option.name === value && value.name}
                            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                            options={measureOptions}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                onChange={onUomKeyWordChange}
                                variant="standard"
                                label={formField.productUnitOfMeasure.label}
                                className="without-padding"
                                placeholder="Search & Select"
                                InputProps={{
                                  ...params.InputProps,
                                  endAdornment: (
                                    <>
                                      {measuresInfo && measuresInfo.loading && uomOpen ? <CircularProgress color="inherit" size={20} /> : null}
                                      {params.InputProps.endAdornment}
                                    </>
                                  ),
                                }}
                              />
                            )}
                          />
                          {(measuresInfo && measuresInfo.err && measuresInfo) && (<FormHelperText><span className="text-danger">{generateErrorMessage(measuresInfo)}</span></FormHelperText>)}

                        </Box>
                        <Box sx={{ width: '50%' }}>
                          <Typography
                            sx={AddThemeColor({
                              font: 'normal normal medium 20px/24px Suisse Intl',
                              letterSpacing: '0.7px',
                              fontWeight: 500,
                            })}
                          >
                            Rules
                          </Typography>
                          <MuiTextField
                            sx={{
                              marginBottom: '10px',
                              marginTop: '10px',
                            }}
                            name={formField.minQuantity.name}
                            label={formField.minQuantity.label}
                            value={values.product_min_qty || ''}
                            isRequired={formField.minQuantity.isRequired}
                            type="text"
                            formGroupClassName="m-1"
                            inputProps={{
                              maxLength: 30,
                            }}
                            onKeyPress={decimalKeyPress}
                          />

                          <MuiTextField
                            sx={{
                              marginBottom: '10px',
                            }}
                            name={formField.maxQuantity.name}
                            label={formField.maxQuantity.label}
                            value={values.product_max_qty || ''}
                            type="text"
                            formGroupClassName="m-1"
                            inputProps={{
                              maxLength: 30,
                            }}
                            onKeyPress={decimalKeyPress}
                          />

                          <MuiTextField
                            sx={{
                              marginBottom: '10px',
                            }}
                            name={formField.alertQuantity.name}
                            label={formField.alertQuantity.label}
                            value={values.product_alert_level_qty || ''}
                            isRequired={formField.alertQuantity.isRequired}
                            type="text"
                            formGroupClassName="m-1"
                            inputProps={{
                              maxLength: 30,
                            }}
                            onKeyPress={decimalKeyPress}
                          />
                          {/* <Col md="12" sm="12" lg="12" xs="12">
                        <MuiTextField
                          name={formField.multiQuantity.name}
                          label={formField.multiQuantity.label}
                          value={values.qty_multiple || ''}
                          type="text"
                          formGroupClassName="m-1"
                          maxLength="30"
                          onKeyPress={decimalKeyPress}
                        />
                      </Col> */}

                          <Typography
                            sx={AddThemeColor({
                              font: 'normal normal medium 20px/24px Suisse Intl',
                              letterSpacing: '0.7px',
                              fontWeight: 500,
                              marginTop: '40px',
                            })}
                          >
                            Misc
                          </Typography>
                          <Box sx={{ display: 'flex', gap: '35px' }}>
                            <MuiTextField
                              sx={{
                                marginBottom: '10px',
                                marginTop: '10px',
                                width: '30%',
                              }}
                              name={formField.leadDays.name}
                              label={formField.leadDays.label}
                              value={values.lead_days || ''}
                              type="text"
                              formGroupClassName="m-1"
                              inputProps={{
                                maxLength: 30,
                              }}
                              onKeyPress={decimalKeyPress}
                            />

                            <MuiAutoComplete
                              sx={{
                                marginTop: '10px',
                                marginBottom: '10px',
                                width: '70%',
                              }}
                              name={formField.leadType.name}
                              label={formField.leadType.label}
                              formGroupClassName="mt-07rem"
                              open={leadTypeOpen}
                              size="small"
                              onOpen={() => {
                                setLeadTypeOpen(true);
                              }}
                              onClose={() => {
                                setLeadTypeOpen(false);
                              }}
                              value={values.lead_type && values.lead_type.label ? values.lead_type.label : getDefaultLeadTypeValue(values.lead_type)}
                              getOptionSelected={(option, value) => option.label === value.label}
                              getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                              options={customData.leadTypes}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  variant="standard"
                                  label={formField.leadDays.label}
                                  className="without-padding"
                                  placeholder="Search"
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
                          </Box>
                        </Box>
                      </Box>
                    </FormControl>
                  </Box>
                </ThemeProvider>
                {((addReorderInfo && addReorderInfo.loading) || (updateReorderInfo && updateReorderInfo.loading)) && (
                <div className="text-center mt-3">
                  <Loader />
                </div>
                )}
                {(addReorderInfo && !addReorderInfo.data && !addReorderInfo.loading && updateReorderInfo && !updateReorderInfo.data && !updateReorderInfo.loading) && (
                <div className="bg-lightblue sticky-button-736drawer">
                  <Button
                    disabled={!editId ? !(isValid && dirty) : !isValid}
                    type="submit"
                    variant="contained"
                  >
                    {!editId ? 'Create' : 'Update'}
                  </Button>
                </div>
                )}
                <SuccessAndErrorModalWindow
                  isOpenSuccessAndErrorModalWindow={isOpenSuccessAndErrorModalWindow}
                  setIsOpenSuccessAndErrorModalWindow={setIsOpenSuccessAndErrorModalWindow}
                  type={editId ? 'update' : 'create'}
                  successOrErrorData={editId ? updateReorderInfo : addReorderInfo}
                  headerImage={InventoryBlue}
                  headerText="Reordering Rules"
                  successRedirect={handleReset.bind(null, resetForm)}
                  staticErrorMsg={reorderingRuleStaticErrorMsg}
                  apiErrorMsg={reorderingRuleApiErrorMsg}
                />
              </Form>
            );
          }}
        </Formik>
      </Col>
    </Row>
  );
};

AddRerderingRules.propTypes = {
  closeAddModal: PropTypes.func.isRequired,
  editId: PropTypes.bool,
  editId: PropTypes.number,
  afterReset: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  product: PropTypes.object,
};
AddRerderingRules.defaultProps = {
  editId: false,
  editId: undefined,
  product: {},
};
export default AddRerderingRules;
