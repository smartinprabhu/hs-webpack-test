/* eslint-disable camelcase */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {
  TextField, CircularProgress,
} from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';
import {
  Row, Col, Label,
  Modal,
  ModalBody,
} from 'reactstrap';
import { useFormikContext } from 'formik';
import moment from 'moment';
import { Dialog, DialogContent, DialogContentText, Box } from '@mui/material'
import { IoCloseOutline } from 'react-icons/io5';

import ModalHeaderComponent from '@shared/modalHeaderComponent';
import {
  CheckboxFieldGroup, CheckboxField,
  DateTimeField,
} from '@shared/formFields';

import {
  getStockLocations,
} from '../../../purchase/purchaseService';
import { getStockReasons } from '../../inventoryService';
import {
  getProductCategories,
} from '../../../adminSetup/setupService';
import { getProductsList } from '../../../preventiveMaintenance/ppmService';
import {
  generateErrorMessage,
  getAllowedCompanies,
  extractOptionsObject,
  getDateTimeSeconds,
} from '../../../util/appUtils';
import SearchModal from './SearchModalSingle';
import MuiAutoComplete from "../../../commonComponents/formFields/muiAutocomplete";
import DialogHeader from '../../../commonComponents/dialogHeader';
import MuiTextField from "../../../commonComponents/formFields/muiTextField";

const appModels = require('../../../util/appModels').default;

const BasicForm = (props) => {
  const {
    editId,
    setFieldValue,
    setFieldTouched,
    formField: {
      name,
      locationId,
      Comments,
      reasonId,
      inventoryOf,
      inventoryDate,
      companyId,
      Exhausted,
      categoryId,
      productId,
    },
  } = props;
  const dispatch = useDispatch();
  const { values: formValues } = useFormikContext();
  const {
    filter,
    company_id,
    location_id,
    product_id,
    category_id,
    reason_id,
    date,
  } = formValues;

  const [companyOpen, setCompanyOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [locKeyword, setLocKeyword] = useState('');
  const [productCatOpen, setProductCatOpen] = useState(false);
  const [productCatKeyword, setProductCatKeyword] = useState('');
  const [productOpen, setProductOpen] = useState(false);
  const [productKeyword, setProductKeyword] = useState('');

  const [extraModal, setExtraModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [placeholderName, setPlaceholder] = useState('');
  const [columns, setColumns] = useState(['id', 'name']);

  const [reasonOpen, setReasonOpen] = useState(false);
  const [reasonKeyword, setReasonKeyword] = useState('');

  const [isMultiple, setIsMultiple] = useState(false);

  const { userInfo } = useSelector((state) => state.user);
  const { allowedCompanies, productCategoryInfo } = useSelector((state) => state.setup);
  const { stockLocations } = useSelector((state) => state.purchase);
  const { productInfo } = useSelector((state) => state.ppm);
  const { adjustmentDetail, stockReasons } = useSelector((state) => state.inventory);
  const companies = getAllowedCompanies(userInfo);

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

  useEffect(() => {
    if (filter) {
      if (filter === 'none' || filter === 'partial') {
        setFieldValue('product_id', '');
        setFieldValue('category_id', '');
      }
      if (filter === 'category') {
        setFieldValue('product_id', '');
      }
      if (filter === 'product') {
        setFieldValue('category_id', '');
      }
    }
  }, [filter]);

  useEffect(() => {
    if (!editId) {
      setFieldValue('date', moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss'));
    }
  }, [editId]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const userCompanyId = userInfo && userInfo.data && userInfo.data.company ? userInfo.data.company : '';
      setFieldValue('company_id', userCompanyId);
    }
  }, [userInfo]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      dispatch(getStockLocations(companies, appModels.STOCKLOCATION, locKeyword, 'scrap'));
    }
  }, [userInfo, locKeyword, locationOpen]);

  useEffect(() => {
    if (!location_id && stockLocations && stockLocations.data && stockLocations.data.length && stockLocations.data.length === 1 && !locKeyword) {
      setIsMultiple(false);
      setFieldValue('location_id', stockLocations.data[0]);
    } else if (stockLocations && stockLocations.data && stockLocations.data.length && stockLocations.data.length > 1) {
      setIsMultiple(true);
    }
  }, [stockLocations, location_id]);

  useEffect(() => {
    if (userInfo && userInfo.data && productCatOpen) {
      dispatch(getProductCategories(companies, appModels.PRODUCTCATEGORY, productCatKeyword));
    }
  }, [userInfo, productCatKeyword, productCatOpen]);


  useEffect(() => {
    if (reasonOpen) {
      dispatch(getStockReasons(companies, appModels.STOCKREASON, reasonKeyword));
    }
  }, [reasonKeyword, reasonOpen]);

  useEffect(() => {
    if (userInfo && userInfo.data && productOpen) {
      dispatch(getProductsList(companies, appModels.PRODUCT, productKeyword, 'inventory'));
    }
  }, [userInfo, productKeyword, productOpen]);

  const onLocationKeyWordChange = (event) => {
    setLocKeyword(event.target.value);
  };

  const onProductKeyWordChange = (event) => {
    setProductKeyword(event.target.value);
  };

  const onReasonKeyWordChange = (event) => {
    setReasonKeyword(event.target.value);
  };

  const onCategoryKeyWordChange = (event) => {
    setProductCatKeyword(event.target.value);
  };

  const onLocationClear = () => {
    setLocKeyword(null);
    setFieldValue('location_id', '');
    setLocationOpen(false);
  };

  const showLocationModal = () => {
    setModelValue(appModels.STOCKLOCATION);
    setColumns(['id', 'name']);
    setFieldName('location_id');
    setModalName('Audit Locations List');
    setPlaceholder('Locations');
    setCompanyValue(companies);
    setExtraModal(true);
  };

  const onProductClear = () => {
    setProductKeyword(null);
    setFieldValue('product_id', '');
    setProductOpen(false);
  };

  const showProductModal = () => {
    setModelValue(appModels.PRODUCT);
    setColumns(['id', 'name', 'uom_id', 'type', 'qty_available']);
    setFieldName('product_id');
    setModalName('Products List');
    setPlaceholder('Products');
    setCompanyValue(companies);
    setExtraModal(true);
  };

  const onReasonClear = () => {
    setProductKeyword(null);
    setFieldValue('reason_id', '');
    setProductOpen(false);
  };

  const showReasonModal = () => {
    setModelValue(appModels.STOCKREASON);
    setColumns(['id', 'name']);
    setFieldName('reason_id');
    setModalName('Reasons List');
    setPlaceholder('Reasons');
    setCompanyValue(companies);
    setExtraModal(true);
  };

  const onProductCatClear = () => {
    setProductKeyword(null);
    setFieldValue('category_id', '');
    setProductCatOpen(false);
  };

  const showProductCatModal = () => {
    setModelValue(appModels.PRODUCTCATEGORY);
    setColumns(['id', 'name']);
    setFieldName('category_id');
    setModalName('Category List');
    setPlaceholder('Categories');
    setCompanyValue(companies);
    setExtraModal(true);
  };

  const locationOptions = extractOptionsObject(stockLocations, location_id);
  const reasonOptions = extractOptionsObject(stockReasons, reason_id);
  const productOptions = extractOptionsObject(productInfo, product_id);
  const categoryOptions = extractOptionsObject(productCategoryInfo, category_id);

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

  const getCompanyValue = () => {
    let userCompanyId = userInfo && userInfo.data && userInfo.data.company ? userInfo.data.company : '';
    if (!company_id || (company_id && !company_id.id)) {
      userCompanyId = userInfo && userInfo.data && userInfo.data.company ? userInfo.data.company : '';
      setFieldValue('company_id', userCompanyId);
    }
    return userCompanyId ? userCompanyId.name : '';
  };

  const isDisabled = editId && adjustmentDetail && adjustmentDetail.data && adjustmentDetail.data.length && adjustmentDetail.data[0].state === 'done';

  // eslint-disable-next-line no-nested-ternary
  const userCompanies = allowedCompanies && allowedCompanies.data && allowedCompanies.data.allowed_companies && allowedCompanies.data.allowed_companies.length > 0
    ? allowedCompanies.data.allowed_companies : userInfo && userInfo.data && userInfo.data.allowed_companies && userInfo.data.allowed_companies.length > 0 ? userInfo.data.allowed_companies : [];

  return (
    <>
      <Box
        sx={{
          marginTop: "20px",
          display: 'flex',
          gap: '35px'
        }}
      >
        <Box sx={{ width: '50%' }}>
          <MuiTextField
            sx={{
              marginTop: "auto",
              marginBottom: "10px",
            }}
            name={name.name}
            label={name.label}
            autoComplete="off"
            isRequired
            disabled={isDisabled}
            type="text"
            className="mt-1"
            formGroupClassName="m-1"
            inputProps={{ maxLength: 50 }}
          />

          { /* <Col md="12" sm="12" lg="12" xs="12" className="m-1">
            <Label for={inventoryOf.name} className="font-weight-600 m-0">
              Inventory of
              {' '}
              <span className="ml-1 text-danger">*</span>
            </Label>
            <div className="m-1">
              <div className="label-mb-0">
                <CheckboxFieldGroup
                  name={inventoryOf.name}
                  checkedvalue="none"
                  id="none"
                  isDisabled={isDisabled}
                  label={inventoryOf.label}
                />
              </div>
              <div className="label-mb-0">
                <CheckboxFieldGroup
                  name={inventoryOf.name}
                  checkedvalue="category"
                  id="category"
                  isDisabled={isDisabled}
                  label={inventoryOf.label1}
                />
              </div>
              <div className="label-mb-0">
                <CheckboxFieldGroup
                  name={inventoryOf.name}
                  checkedvalue="product"
                  id="product"
                  isDisabled={isDisabled}
                  label={inventoryOf.label2}
                />
              </div>
              <div className="label-mb-0">
                <CheckboxFieldGroup
                  name={inventoryOf.name}
                  checkedvalue="partial"
                  id="partial"
                  isDisabled={isDisabled}
                  label={inventoryOf.label3}
                />
              </div>
            </div>
                </Col> */}

          <MuiTextField
            sx={{
              marginTop: "auto",
              marginBottom: "10px",
            }}
            name={Comments.name}
            label={Comments.label}
            autoComplete="off"
            type="text"
            className="mt-1"
            formGroupClassName="m-1"
            inputProps={{ maxLength: 150 }}
          />
        </Box>
        <Box sx={{ width: '50%' }}>
          <MuiAutoComplete
            sx={{
              marginTop: "auto",
              marginBottom: "10px",
            }}
            name={locationId.name}
            label={locationId.label}
            isRequired
            formGroupClassName="m-1"
            disabled={editId || !isMultiple}
            oldValue={getOldData(location_id)}
            value={location_id && location_id.name ? location_id.name : getOldData(location_id)}
            apiError={(stockLocations && stockLocations.err) ? generateErrorMessage(stockLocations) : false}
            open={locationOpen}
            size="small"
            onOpen={() => {
              setLocationOpen(true);
              setLocKeyword('');
            }}
            onClose={() => {
              setLocationOpen(false);
              setLocKeyword('');
            }}
            getOptionDisabled={() => stockLocations && stockLocations.loading}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={locationOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onLocationKeyWordChange}
                variant="standard"
                value={locKeyword}
                label={locationId.label}
                placeholder="Search & Select"
                required
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {stockLocations && stockLocations.loading ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {isMultiple && !editId && ((getOldData(location_id)) || (location_id && location_id.id) || (locKeyword && locKeyword.length > 0)) && (
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={onLocationClear}
                          >
                            <IoCloseOutline size={22} fontSize="small" />
                          </IconButton>
                        )}
                        {isMultiple && !editId && (
                          <IconButton
                            aria-label="toggle search visibility"
                            onClick={showLocationModal}
                          >
                            <SearchIcon fontSize="small" />
                          </IconButton>
                        )}
                      </InputAdornment>
                    </>
                  ),
                }}
              />
            )}
          />
          <MuiAutoComplete
            sx={{
              marginTop: "auto",
              marginBottom: "10px",
            }}
            name={reasonId.name}
            label={reasonId.label}
            disabled={isDisabled}
            oldValue={getOldData(reason_id)}
            value={reason_id && reason_id.name ? reason_id.name : getOldData(reason_id)}
            apiError={(stockReasons && stockReasons.err) ? generateErrorMessage(stockReasons) : false}
            open={reasonOpen}
            size="small"
            onOpen={() => {
              setReasonOpen(true);
              setReasonKeyword('');
            }}
            onClose={() => {
              setReasonOpen(false);
              setReasonKeyword('');
            }}
            getOptionDisabled={() => stockReasons && stockReasons.loading}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={reasonOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onReasonKeyWordChange}
                variant="standard"
                value={reasonKeyword}
                label={reasonId.label}
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {stockReasons && stockReasons.loading ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {!isDisabled && ((getOldData(reason_id)) || (reason_id && reason_id.id) || (reasonKeyword && reasonKeyword.length > 0)) && (
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={onReasonClear}
                          >
                            <IoCloseOutline size={22} fontSize="small" />
                          </IconButton>
                        )}
                        {!isDisabled && (
                          <IconButton
                            aria-label="toggle search visibility"
                            onClick={showReasonModal}
                          >
                            <SearchIcon fontSize="small" />
                          </IconButton>
                        )}
                      </InputAdornment>
                    </>
                  ),
                }}
              />
            )}
          />
        </Box>
        { /* <Col xs={12} md={12} lg={12} sm={12}>
            <DateTimeField
              name={inventoryDate.name}
              label={inventoryDate.label}
              isRequired
              readOnly={isDisabled}
              formGroupClassName="m-1"
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              placeholder={inventoryDate.label}
              value={date ? moment(new Date(getDateTimeSeconds(date))) : ''}
            />
          </Col>
          <Col xs={12} md={12} lg={12} sm={12}>
            <MuiAutoComplete
              name={companyId.name}
              label={companyId.label}
              formGroupClassName="m-1"
              open={companyOpen}
              size="small"
              disabled
              oldValue={getOldData(company_id)}
              value={getCompanyValue()}
              onOpen={() => {
                setCompanyOpen(true);
              }}
              onClose={() => {
                setCompanyOpen(false);
              }}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={userCompanies}
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
          {filter === 'product' && (
            <Col xs={12} md={12} lg={12} sm={12}>
              <MuiAutoComplete
                name={productId.name}
                label={productId.label}
                disabled={isDisabled}
                formGroupClassName="m-1"
                oldValue={getOldData(product_id)}
                value={product_id && product_id.name ? product_id.name : getOldData(product_id)}
                apiError={(productInfo && productInfo.err) ? generateErrorMessage(productInfo) : false}
                open={productOpen}
                size="small"
                onOpen={() => {
                  setProductOpen(true);
                  setProductKeyword('');
                }}
                onClose={() => {
                  setProductOpen(false);
                  setProductKeyword('');
                }}
                loading={productInfo && productInfo.loading}
                getOptionSelected={(option, value) => option.name === value.name}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                options={productOptions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    onChange={onProductKeyWordChange}
                    variant="outlined"
                    value={productKeyword}
                    className={((getOldData(product_id)) || (product_id && product_id.id) || (productKeyword && productKeyword.length > 0))
                      ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                    placeholder="Search & Select"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {productInfo && productInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                          <InputAdornment position="end">
                            {!isDisabled && ((getOldData(product_id)) || (product_id && product_id.id) || (productKeyword && productKeyword.length > 0)) && (
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={onProductClear}
                              >
                                <IoCloseOutline size={22} fontSize="small" />
                              </IconButton>
                            )}
                            {!isDisabled && (
                              <IconButton
                                aria-label="toggle search visibility"
                                onClick={showProductModal}
                              >
                                <SearchIcon fontSize="small" />
                              </IconButton>
                            )}
                          </InputAdornment>
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Col>
          )}
          {filter === 'category' && (
            <Col xs={12} md={12} lg={12} sm={12}>
              <MuiAutoComplete
                name={categoryId.name}
                label={categoryId.label}
                formGroupClassName="m-1"
                disabled={isDisabled}
                oldValue={getOldData(category_id)}
                value={category_id && category_id.name ? category_id.name : getOldData(category_id)}
                apiError={(productCategoryInfo && productCategoryInfo.err) ? generateErrorMessage(productCategoryInfo) : false}
                open={productCatOpen}
                size="small"
                onOpen={() => {
                  setProductCatOpen(true);
                  setProductCatKeyword('');
                }}
                onClose={() => {
                  setProductCatOpen(false);
                  setProductCatKeyword('');
                }}
                loading={productCategoryInfo && productCategoryInfo.loading}
                getOptionSelected={(option, value) => option.name === value.name}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                options={categoryOptions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    onChange={onCategoryKeyWordChange}
                    variant="outlined"
                    value={productCatKeyword}
                    className={((getOldData(category_id)) || (category_id && category_id.id) || (productCatKeyword && productCatKeyword.length > 0))
                      ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                    placeholder="Search & Select"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {productCategoryInfo && productCategoryInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                          <InputAdornment position="end">
                            {!isDisabled && ((getOldData(category_id)) || (category_id && category_id.id) || (productCatKeyword && productCatKeyword.length > 0)) && (
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={onProductCatClear}
                              >
                                <IoCloseOutline size={22} fontSize="small" />
                              </IconButton>
                            )}
                            {!isDisabled && (
                              <IconButton
                                aria-label="toggle search visibility"
                                onClick={showProductCatModal}
                              >
                                <SearchIcon fontSize="small" />
                              </IconButton>
                            )}
                          </InputAdornment>
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Col>
          )}
          {(filter === 'none' || filter === 'category') && (
            <Col xs={12} md={12} lg={12} sm={12} className="m-1">
              <CheckboxField
                name={Exhausted.name}
                label={Exhausted.label}
                isDisabled={isDisabled}
              />
            </Col>
          ) */}
      </Box>
      <Dialog size="lg" fullWidth open={extraModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraModal(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <SearchModal
              modelName={modelValue}
              afterReset={() => { setExtraModal(false); }}
              fieldName={fieldName}
              fields={columns}
              company={companyValue}
              placeholderName={placeholderName}
              setFieldValue={setFieldValue}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
};

BasicForm.propTypes = {
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  setFieldTouched: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default BasicForm;
