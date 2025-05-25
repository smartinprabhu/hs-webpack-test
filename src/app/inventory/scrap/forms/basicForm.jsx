/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/jsx-no-useless-fragment */
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
import SearchIcon from '@material-ui/icons/Search';
import { useFormikContext } from 'formik';
import { makeStyles } from '@material-ui/core/styles';
import {
  Dialog, DialogContent, DialogContentText, Box, ListItemText, Typography,
} from '@mui/material';
import { IoCloseOutline } from 'react-icons/io5';

import {
  getStockLocations,
  getMeasures,
} from '../../../purchase/purchaseService';
import { getLocationProducts } from '../../../preventiveMaintenance/ppmService';
import {
  getLocationList,
} from '../../inventoryService';
import {
  generateErrorMessage,
  getAllowedCompanies,
  extractOptionsObject,
  queryGeneratorV1,
  decimalKeyPress,
  truncate,
  extractValueObjects,
} from '../../../util/appUtils';
import SearchModal from './SearchModalSingle';
import SearchModalProduct from './searchModalProduct';

import MuiAutoComplete from '../../../commonComponents/formFields/muiAutocomplete';
import DialogHeader from '../../../commonComponents/dialogHeader';
import MuiTextField from '../../../commonComponents/formFields/muiTextField';

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

const BasicForm = React.memo((props) => {
  const {
    setFieldValue,
    formField: {
      name,
      locationId,
      productUomId,
      scrapQty,
      productId,
      scrapLocationId,
    },
  } = props;
  const dispatch = useDispatch();
  const { values: formValues } = useFormikContext();
  const {
    location_id,
    product_id,
    scrap_location_id,
    product_uom_id,
  } = formValues;

  const classes = useStyles();

  const [locationOpen, setLocationOpen] = useState(false);
  const [locKeyword, setLocKeyword] = useState('');
  const [scrapLocOpen, setScrapLocOpen] = useState(false);
  const [scrapLocKeyword, setScrapLocKeyword] = useState('');
  const [productOpen, setProductOpen] = useState(false);
  const [productKeyword, setProductKeyword] = useState('');
  const [uomOpen, setUomOpen] = useState(false);
  const [uomKeyword, setUomKeyword] = useState('');

  const [extraModal, setExtraModal] = useState(false);
  const [extraModal1, setExtraModal1] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [placeholderName, setPlaceholder] = useState('');
  const [isMultiple, setIsMultiple] = useState(false);
  const [columns, setColumns] = useState(['id', 'name']);

  const { userInfo } = useSelector((state) => state.user);
  const { measuresInfo, stockLocations } = useSelector((state) => state.purchase);
  const { locationProducts } = useSelector((state) => state.ppm);
  const companies = getAllowedCompanies(userInfo);

  const {
    locationListInfo,
  } = useSelector((state) => state.inventory);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      dispatch(getStockLocations(companies, appModels.STOCKLOCATION, locKeyword, 'scrap'));
    }
  }, [userInfo, locKeyword]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      // dispatch(getStockLocations(companies, appModels.STOCKLOCATION, scrapLocKeyword, 'scraplocation'));
      let filters1 = [];
      const filters = [{
        key: 'scrap_location', value: true, label: '', type: 'ids',
      }];
      if (scrapLocKeyword) {
        filters1 = {
          key: 'name',
          title: 'Name',
          value: encodeURIComponent(scrapLocKeyword),
          label: 'Name',
          type: 'text',
        };
      }
      const customFiltersList = queryGeneratorV1(scrapLocKeyword ? [...filters, ...[filters1]] : filters);
      dispatch(getLocationList(companies, appModels.STOCKLOCATION, 10, 0, customFiltersList, 'DESC', 'name'));
    }
  }, [userInfo, scrapLocKeyword]);

  useEffect(() => {
    if (extractValueObjects(location_id)) {
      dispatch(getLocationProducts(extractValueObjects(location_id), productKeyword, 0, 20, 'Outward'));
    }
  }, [location_id, productKeyword]);

  useEffect(() => {
    if (product_id && product_id.parts_uom) {
      setFieldValue('product_uom_id', product_id.parts_uom);
    }
  }, [product_id]);

  useEffect(() => {
    if (!scrap_location_id && locationListInfo && locationListInfo.data && locationListInfo.data.length < 2) {
      setFieldValue('scrap_location_id', locationListInfo.data[0].id);
    }
  }, [locationListInfo, scrap_location_id]);

  useEffect(() => {
    if (!location_id && stockLocations && stockLocations.data && stockLocations.data.length && stockLocations.data.length === 1 && !locKeyword) {
      setIsMultiple(false);
      setFieldValue('location_id', stockLocations.data[0]);
    } else if (stockLocations && stockLocations.data && stockLocations.data.length && stockLocations.data.length > 1) {
      setIsMultiple(true);
    }
  }, [stockLocations, location_id]);

  useEffect(() => {
    if (userInfo && userInfo.data && uomOpen) {
      dispatch(getMeasures(appModels.UOM, uomKeyword));
    }
  }, [uomOpen, uomKeyword]);

  const onLocationKeyWordChange = (event) => {
    setLocKeyword(event.target.value);
  };

  const onProductKeyWordChange = (event) => {
    setProductKeyword(event.target.value);
  };

  const onScrapLocKeyWordChange = (event) => {
    setScrapLocKeyword(event.target.value);
  };

  const onUomKeyWordChange = (event) => {
    setUomKeyword(event.target.value);
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
    setModalName('Locations List');
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
    setColumns(['id', 'name', 'uom_id', 'unique_code', 'type', 'qty_available', 'brand', 'specification', 'categ_id']);
    setFieldName('product_id');
    setModalName('Products List');
    setPlaceholder('Products');
    setCompanyValue(companies);
    setExtraModal1(true);
  };

  const onScrapLocClear = () => {
    setScrapLocKeyword(null);
    setFieldValue('scrap_location_id', '');
    setScrapLocOpen(false);
  };

  const showScrapLocModal = () => {
    setModelValue(appModels.STOCKLOCATION);
    setColumns(['id', 'name']);
    setFieldName('scrap_location_id');
    setModalName('Scrap Location List');
    setPlaceholder('Scrap Locations');
    setCompanyValue(companies);
    setExtraModal(true);
  };

  const onUomClear = () => {
    setUomKeyword(null);
    setFieldValue('product_uom_id', '');
    setScrapLocOpen(false);
  };

  const showUomModal = () => {
    setModelValue(appModels.UOM);
    setColumns(['id', 'name']);
    setFieldName('product_uom_id');
    setModalName('UOM List');
    setPlaceholder('UOM');
    setCompanyValue(companies);
    setExtraModal(true);
  };

  function getPrData(data) {
    let res = data;
    if (data && data.length) {
      res = data.filter((item) => (item.qty_on_hand));
    }
    return res;
  }

  const locationOptions = extractOptionsObject(stockLocations, location_id);
  let productOptions = extractOptionsObject(locationProducts, product_id);
  productOptions = [...[{ label: 'header', name: 'header', unique_code: '' }], ...productOptions];
  const scrapLocationOptions = extractOptionsObject(locationListInfo, scrap_location_id);
  const uomOptions = extractOptionsObject(measuresInfo, product_uom_id);

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

  return (
    <>
      <Box
        sx={{
          marginTop: '20px',
          display: 'flex',
          gap: '35px',
        }}
      >
        <Box sx={{ width: '50%' }}>
          <MuiTextField
            sx={{
              marginBottom: '10px',
            }}
            name={name.name}
            label={name.label}
            autoComplete="off"
            isRequired
            type="text"
            formGroupClassName="m-1"
            maxLength="30"
          />

          <MuiTextField
            sx={{
              marginBottom: '10px',
            }}
            name={scrapQty.name}
            label={scrapQty.label}
            isRequired
            autoComplete="off"
            type="text"
            formGroupClassName="m-1"
            maxLength="5"
            onKeyPress={decimalKeyPress}
          />
          {((locationListInfo && locationListInfo.data && locationListInfo.data.length > 1) || locationListInfo.loading || scrapLocKeyword) && (
            <MuiAutoComplete
              name={scrapLocationId.name}
              label={scrapLocationId.label}
              sx={{
                marginTop: 'auto',
                marginBottom: '10px',
              }}
              isRequired
              formGroupClassName="m-1"
              oldValue={getOldData(scrap_location_id)}
              value={scrap_location_id && scrap_location_id.name ? scrap_location_id.name : getOldData(scrap_location_id)}
              apiError={(locationListInfo && locationListInfo.err && scrapLocOpen) ? generateErrorMessage(locationListInfo) : false}
              open={scrapLocOpen}
              size="small"
              onOpen={() => {
                setScrapLocOpen(true);
                setScrapLocKeyword('');
              }}
              onClose={() => {
                setScrapLocOpen(false);
                setScrapLocKeyword('');
              }}
              getOptionDisabled={() => locationListInfo && locationListInfo.loading && scrapLocOpen}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={scrapLocationOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={onScrapLocKeyWordChange}
                  variant="standard"
                  required
                  label={scrapLocationId.label}
                  value={scrapLocKeyword}
                  placeholder="Search & Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {locationListInfo && locationListInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        <InputAdornment position="end">
                          {((getOldData(scrap_location_id)) || (scrap_location_id && scrap_location_id.id) || (scrapLocKeyword && scrapLocKeyword.length > 0)) && (
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={onScrapLocClear}
                          >
                            <IoCloseOutline size={22} fontSize="small" />
                          </IconButton>
                          )}
                          {isMultiple && (
                          <IconButton
                            aria-label="toggle search visibility"
                            onClick={showScrapLocModal}
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
          )}
        </Box>
        <Box sx={{ width: '50%' }}>
          <MuiAutoComplete
            name={locationId.name}
            label={locationId.label}
            sx={{
              marginTop: 'auto',
              marginBottom: '10px',
            }}
            isRequired
            formGroupClassName="m-1"
            disabled={!isMultiple}
            oldValue={getOldData(location_id)}
            value={location_id && location_id.name ? location_id.name : getOldData(location_id)}
            apiError={(stockLocations && stockLocations.err && locationOpen) ? generateErrorMessage(stockLocations) : false}
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
            getOptionDisabled={() => stockLocations && stockLocations.loading && locationOpen}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={locationOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onLocationKeyWordChange}
                variant="standard"
                label={locationId.label}
                value={locKeyword}
                required
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {stockLocations && stockLocations.loading ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {(isMultiple && (getOldData(location_id)) || (location_id && location_id.id) || (locKeyword && locKeyword.length > 0)) && (
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={onLocationClear}
                          >
                            <IoCloseOutline size={22} fontSize="small" />
                          </IconButton>
                        )}
                        {isMultiple && (
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
            name={productId.name}
            label={productId.label}
            sx={{
              marginTop: 'auto',
              marginBottom: '10px',
            }}
            isRequired
            disabled={!location_id}
            formGroupClassName="m-1"
            oldValue={getOldData(product_id)}
            value={product_id && product_id.name ? product_id.name : getOldData(product_id)}
            apiError={(locationProducts && locationProducts.err) ? generateErrorMessage(locationProducts) : false}
            open={productOpen}
            classes={{
              listbox: 'custom-listbox', // Add custom class to the listbox
              option: classes.option,
            }}
            size="small"
            onOpen={() => {
              setProductOpen(true);
              setProductKeyword('');
            }}
            onClose={() => {
              setProductOpen(false);
              setProductKeyword('');
            }}
            getOptionDisabled={(option) => (!option.qty_on_hand) || option.label === 'header' || (locationProducts && locationProducts.loading)}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : `${option.name} ${option.unique_code ? `| ${option.unique_code}` : ''}`)}
            options={locationProducts && locationProducts.loading ? [] : productOptions}
            renderOption={(props, option) => (
              <>
                <ListItemText
                  {...props}
                  primary={(
                    <>
                      {option.label === 'header' ? (
                        <Box className="hide-header">
                          <Typography
                            sx={{
                              font: 'Suisse Intl',
                              fontWeight: 800,
                              fontSize: '15px',
                            }}
                          >
                            <p className="text-info">
                              Quantity shown here excludes Requested Undelivered Products.
                            </p>
                          </Typography>
                        </Box>
                      ) : (
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
                                fontWeight: 500,
                                fontSize: '15px',
                              }}
                            >
                              <span className="font-tiny">{option.brand ? truncate(option.brand, 20) : '-'}</span>
                            </Typography>
                          </Box>
                          <Box>
                            <Typography
                              sx={{
                                font: 'Suisse Intl',
                                fontWeight: 500,
                                fontSize: '15px',
                              }}
                            >
                              {parseFloat(option.qty_on_hand).toFixed(3)}
                              {' '}
                              {' '}
                              {option.parts_uom && option.parts_uom.name ? option.parts_uom.name : ''}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography
                              sx={{
                                font: 'Suisse Intl',
                                fontWeight: 500,
                                fontSize: '15px',
                              }}
                            >
                              {option.category && option.category.name ? truncate(option.category.name, 20) : ''}
                              {' '}

                            </Typography>
                          </Box>
                        </>
                      )}
                    </>
                  )}
                />
              </>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onProductKeyWordChange}
                variant="standard"
                required
                label={productId.label}
                value={productKeyword}
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {locationProducts && locationProducts.loading ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {location_id && ((getOldData(product_id)) || (product_id && product_id.id) || (productKeyword && productKeyword.length > 0)) && (
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={onProductClear}
                          >
                            <IoCloseOutline size={22} fontSize="small" />
                          </IconButton>
                        )}
                        {location_id && (
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
          <MuiAutoComplete
            name={productUomId.name}
            label={productUomId.label}
            sx={{
              marginTop: 'auto',
              marginBottom: '10px',
            }}
            isRequired
            disabled
            formGroupClassName="m-1"
            oldValue={getOldData(product_uom_id)}
            value={product_uom_id && product_uom_id.name ? product_uom_id.name : getOldData(product_uom_id)}
            apiError={(measuresInfo && measuresInfo.err) ? generateErrorMessage(measuresInfo) : false}
            open={uomOpen}
            size="small"
            onOpen={() => {
              setUomOpen(true);
              setUomKeyword('');
            }}
            onClose={() => {
              setUomOpen(false);
              setUomKeyword('');
            }}
            loading={measuresInfo && measuresInfo.loading}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={uomOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onUomKeyWordChange}
                variant="standard"
                label={productUomId.label}
                value={uomKeyword}
                placeholder=""
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {/* measuresInfo && measuresInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        <InputAdornment position="end">
                          {((getOldData(product_uom_id)) || (product_uom_id && product_uom_id.id) || (uomKeyword && uomKeyword.length > 0)) && (
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={onUomClear}
                          >
                            <IoCloseOutline size={22} fontSize="small" />
                          </IconButton>
                          )}
                          <IconButton
                            aria-label="toggle search visibility"
                            onClick={showUomModal}
                          >
                            <SearchIcon fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                          */ }
                    </>
                  ),
                }}
              />
            )}
          />
          { /*  <Col xs={12} md={12} lg={12} sm={12}>
            <DateTimeField
              name={dateExpected.name}
              label={dateExpected.label}
              formGroupClassName="m-1"
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              placeholder={dateExpected.label}
              defaultValue={date_expected ? new Date(getDateTimeSeconds(date_expected)) : ''}
            />
          </Col>
          <Col xs={12} md={12} lg={12} sm={12}>
            <InputField
              name={origin.name}
              label={origin.label}
              autoComplete="off"
              type="text"
              formGroupClassName="m-1"
              maxLength="30"
            />
                </Col> */ }
        </Box>
      </Box>
      <Dialog size="lg" fullWidth open={extraModal}>
        <DialogHeader rightButton title={modalName} imagePath={false} onClose={() => { setExtraModal(false); }} />
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
      <Dialog size="lg" fullWidth open={extraModal1}>
        <DialogHeader rightButton title={modalName} imagePath={false} onClose={() => { setExtraModal1(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <SearchModalProduct
              locationId={extractValueObjects(location_id)}
              afterReset={() => { setExtraModal1(false); }}
              stockType={false}
              fieldName="product_id"
              setFieldValue={setFieldValue}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
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
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  setFieldTouched: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default BasicForm;
