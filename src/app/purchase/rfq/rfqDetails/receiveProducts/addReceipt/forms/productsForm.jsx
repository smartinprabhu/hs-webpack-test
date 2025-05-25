/* eslint-disable max-len */
/* eslint-disable radix */
/* eslint-disable react/no-array-index-key */
/* eslint-disable import/no-unresolved */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Row, Col,
  Table,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import {
  CircularProgress, FormHelperText,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import {
  Dialog, DialogContent, DialogContentText, Typography, TextField, ListItemText, Box, Divider,
} from '@mui/material';
import { IoCloseOutline } from 'react-icons/io5';
import { useFormikContext } from 'formik';

import addIcon from '@images/icons/plusCircleBlue.svg';
import { getLocationProducts, getPartsData } from '../../../../../../preventiveMaintenance/ppmService';
import {
  clearAddProduct, clearTaxesInfo, clearTableData,
} from '../../../../../purchaseService';
import '../../../../../../preventiveMaintenance/preventiveMaintenance.scss';
import {
  getArrayFromValuesById,
  getColumnArrayByIdWithArray,
  generateErrorMessage,
  getAllowedCompanies, 
  truncate, avoidSpaceOnFirstCharacter, getListOfModuleOperations,
  decimalKeyPressDown,
} from '../../../../../../util/appUtils';
import SearchModal from './searchModalProduct';
import { checkProductIdTransfer } from '../../../../utils/utils';
import AddProduct from '../../../../../products/addProductMini';
import { AddThemeColor } from '../../../../../../themes/theme';
import MuiAutoComplete from '../../../../../../commonComponents/formFields/muiAutocomplete';
import DialogHeader from '../../../../../../commonComponents/dialogHeader';
import actionCodes1 from '../../../../../../inventory/data/actionCodes.json';

const appModels = require('../../../../../../util/appModels').default;

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

const ProductsForm = (props) => {
  const {
    reload,
    setFieldValue,
    locationId,
    locationName,
    code,
  } = props;
  const { values: formValues } = useFormikContext();
  const {
    product_categ_id,
  } = formValues;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [partsData, setPartsData] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [openId, setOpen] = useState('');
  const [productKeyword, setProductKeyword] = useState('');
  const [partsAdd, setPartsAdd] = useState(false);
  const [partId, setPartId] = useState(false);
  const [modelValue, setModelValue] = useState('');
  const [fieldName, setFieldName] = useState('');
  const [modalName, setModalName] = useState('');
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [columns, setColumns] = useState(['id', 'name']);
  const [companyValue, setCompanyValue] = useState(false);
  const [extraModal, setExtraModal] = useState(false);
  const [arrayList, setArrayList] = useState([]);
  const [arrayIndex, setArrayIndex] = useState(false);
  const [refresh, setRefresh] = useState(reload);
  const [uomKeyword, setUomKeyword] = useState('');
  const [uomId, setUom] = useState('');
  const [productModal, setProductModal] = useState(false);

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const { locationProducts, partsSelected } = useSelector((state) => state.ppm);
  const { measuresInfo, addProductInfo } = useSelector((state) => state.purchase);

  const {
    inventorySettingsInfo,
  } = useSelector((state) => state.site);

  const invSettingData = inventorySettingsInfo && inventorySettingsInfo.data && inventorySettingsInfo.data.length ? inventorySettingsInfo.data[0] : false;

  const isCategoryRequired = invSettingData && invSettingData.is_product_category_mandatory;

  const productCategory = product_categ_id && product_categ_id.id;

  useEffect(() => {
    setRefresh(refresh);
  }, [reload]);

  function getPrData(data) {
    let res = data;
    if (code !== 'incoming') {
      res = data.filter((item) => (item.qty_on_hand));
    }
    return res;
  }

  function getType() {
    let res = 'Inward';
    if (code === 'outgoing') {
      res = 'outward';
    } else if (code === 'internal') {
      res = 'material_req';
    } else if (code === 'incoming') {
      res = 'Inward';
    }
    return res;
  }

  useEffect(() => {
    if (locationProducts && locationProducts.data && locationProducts.data.length > 0) {
      const ids = getColumnArrayByIdWithArray(partsSelected && partsSelected.length ? partsSelected : [], 'product_id');
      const data = getArrayFromValuesById(locationProducts.data, ids, 'id');
      if (data && data.length > 0) {
        setProductOptions(data.map((cl) => ({
          ...cl, value: cl.id, label: cl.name,
        })));
      } else {
        setProductOptions([]);
      }
    } else if (locationProducts && locationProducts.err) {
      setProductOptions([]);
    }
  }, [locationProducts, partId, partsAdd]);

  useEffect(() => {
    if (partsAdd) {
      setPartsData(partsData);
      dispatch(getPartsData(partsData));
      const project = document.getElementById('productInId');
      if (project) project.scrollIntoView();
    }
  }, [partsAdd]);

  useEffect(() => {
    if (partsSelected && partsSelected.length > 0) {
      const project = document.getElementById('productInId');
      if (project) project.scrollIntoView();
      setFieldValue('move_ids_without_package', partsSelected);
    } else {
      setPartsData([]);
      setFieldValue('move_ids_without_package', []);
    }
  }, [partsSelected]);

  useEffect(() => {
    if (refresh === '1') {
      setPartsData([]);
      dispatch(getPartsData([]));
      setFieldValue('move_ids_without_package', []);
    }
  }, [refresh]);

  const noData = locationProducts && locationProducts.err ? locationProducts.err.data : false;

  const allowedOperations1 = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Inventory', 'code');

  const isProductCreatable = allowedOperations1.includes(actionCodes1['Add Product']);

  useEffect(() => {
    if (((userInfo && userInfo.data) && (code === 'incoming') && (noData && (noData.status_code && noData.status_code === 404)) && (productKeyword && productKeyword.length > 0) && !extraModal)) {
      // setOpen(false);
    }
  }, [productKeyword, locationProducts]);

  useEffect(() => {
    if (openId) {
      setProductKeyword('');
    }
  }, [openId]);

  useEffect(() => {
    if (locationId && ((isCategoryRequired && productCategory) || (!isCategoryRequired))) {
      let domains = false;
      if (code !== 'incoming') {
        domains = '[["purchase_ok","=",true],["active","=",true],["is_pantry_item","!=",true]';
        if (productCategory) {
          domains = `${domains},["categ_id","=",${productCategory}]`;
        }
        if (productKeyword) {
          domains = `${domains},"|",["name","ilike","${productKeyword}"],["unique_code","ilike","${productKeyword}"]`;
        }
        domains = `${domains}]`;
      }
      dispatch(getLocationProducts(locationId, productKeyword, 0, 20, getType(), domains, false, productCategory));
    }
  }, [locationId, productKeyword, product_categ_id]);

  const onUomKeyWordChange = (event) => {
    setUomKeyword(event.target.value);
  };

  const loadEmptyTd = () => {
    const newData = partsData;
    newData.push({
      product_id: '', quantity: 1, product_uom: false,
    });
    setProductKeyword('');
    setPartsData(newData);
    setPartsAdd(Math.random());
  };
  const removeData = (e, index) => {
    const checkData = partsData;
    const indexRemove = checkData.indexOf(checkData[index]);
    checkData.splice(indexRemove, 1);
    setPartsData(checkData);
    setProductKeyword('');
    setPartsAdd(Math.random());
  };

  const onUnitChange = (e, index) => {
    const newData = partsData;
    const prHand = newData[index].product_id && newData[index].product_id.length && newData[index].product_id.length > 2 ? newData[index].product_id[2] : 1000;
    if (code !== 'incoming') {
      newData[index].quantity = /^(\d+(\.\d*)?)?$/.test(e.target.value) && parseFloat(prHand) >= e.target.value ? e.target.value : '';
    } else {
      newData[index].quantity = /^(\d+(\.\d*)?)?$/.test(e.target.value) ? e.target.value : '';
    }
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  const onUomChange = (e, index) => {
    const newData = partsData;
    newData[index].product_uom = e ? [e.id, e.name] : [];
    newData[index].product_uom_ref = e ? e.id : '';
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  const onProductChange = (e, index) => {
    const newData = partsData;
    newData[index].product_id = e ? [e.id, e.name, e.qty_on_hand ? parseInt(e.qty_on_hand) : parseInt(e.qty_available)] : [];
    // newData[index].name = e ? e.name : '';
    newData[index].product_uom = e && e.parts_uom && e.parts_uom.id ? [e.parts_uom.id, e.parts_uom.name] : [];
    // newData[index].product_uom_ref = e && e.uom_id ? e.uom_id[0] : '';
    setPartId(e.id);
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  const onProductKeywordChange = (event) => {
    setProductKeyword(event.target.value);
  };

  const onProductKeywordClear = (e, index) => {
    const newData = partsData;
    newData[index].product_id = '';
    newData[index].product_uom = '';
    // newData[index].product_uom_ref = '';
    setPartsData(newData);
    setPartsAdd(Math.random());
    setProductKeyword('');
    setOpen(false);
  };

  const onModalClose = () => {
    setProductModal(false);
  };

  const onProductClose = () => {
    const newData = partsData;
    if (addProductInfo && addProductInfo.data && addProductInfo.data.data && addProductInfo.data.data.length && newData[openId]) {
      newData[openId].product_id = [addProductInfo.data.data[0], productKeyword, 0];
      // newData[index].name = e ? e.name : '';
      newData[openId].product_uom = [1, 'Units'];
      // newData[index].product_uom_ref = e && e.uom_id ? e.uom_id[0] : '';
      setPartId(addProductInfo.data[0]);
      setPartsData(newData);
      setPartsAdd(Math.random());
    }
    dispatch(clearAddProduct());
    dispatch(clearTableData());
    dispatch(clearTaxesInfo());
  };

  const showProductModal = (e, index) => {
    setModelValue(appModels.PRODUCT);
    setFieldName('move_ids_without_package');
    setModalName('Products');
    setCompanyValue(userInfo && userInfo.data ? userInfo.data.company.id : '');
    setColumns(['id', 'name', 'uom_id', 'type', 'qty_available']);
    setOtherFieldName('type');
    setOtherFieldValue(['product', 'consu']);
    setArrayList(partsSelected);
    setArrayIndex(index);
    setExtraModal(true);
    setProductKeyword('');
  };

  const isError = (noData && code === 'incoming' && (noData.status_code && noData.status_code === 404) && (productKeyword && productKeyword.length > 0)
    && (addProductInfo && !addProductInfo.err) && (addProductInfo && !addProductInfo.data));

  const isError2 = (noData && code !== 'incoming' && (noData.status_code && noData.status_code === 404) && (productKeyword && productKeyword.length > 0)
    && (addProductInfo && !addProductInfo.err) && (addProductInfo && !addProductInfo.data));

  return (
    <>
      <Typography
        sx={AddThemeColor({
          font: 'normal normal medium 20px/24px Suisse Intl',
          letterSpacing: '0.7px',
          fontWeight: 500,
          marginTop: '10px',
          paddingBottom: '4px',
        })}
      >
        Products
        <span className="text-danger ml-2px">*</span>
      </Typography>
      <Row className="">
        <Col xs={12} sm={12} md={12} lg={12} className="p-l-0">
          {!locationId && (
            <div className="text-danger text-center d-inline font-size-13 font-weight-800">
              Location is required.
            </div>
          )}
          {locationId && isCategoryRequired && !productCategory && (
            <div className="text-danger text-center d-inline font-size-13 font-weight-800">
              Product Category is required.
            </div>
          )}
          {locationId && locationName && code !== 'incoming' && (
            <Typography
              sx={AddThemeColor({
                font: 'normal normal medium 20px/24px Suisse Intl',
                letterSpacing: '0.7px',
                // fontWeight: 800,
                marginBottom: '8px',
              })}
            >
              Note: Select Product(s) from
              {' '}
              {locationName}
            </Typography>
          )}
          {locationId && locationName && code === 'incoming' && (
            <Typography
              sx={AddThemeColor({
                font: 'normal normal medium 20px/24px Suisse Intl',
                letterSpacing: '0.7px',
                // fontWeight: 800,
                marginBottom: '8px',
              })}
            >
              Note: Add products to
              {' '}
              {locationName}
            </Typography>
          )}
          {((isCategoryRequired && productCategory) || (!isCategoryRequired)) && locationId && (
            <div aria-hidden="true" className="font-weight-800 d-inline text-center text-lightblue cursor-pointer mt-1 mb-1" onClick={loadEmptyTd}>
              <img src={addIcon} className="mr-2 mb-1" alt="addequipment" height="15" width="15" />
              <span className="mr-2">Add a Product</span>
            </div>

          )}
          {((partsSelected && !partsSelected.length > 0) || (!checkProductIdTransfer(partsData))) && locationId && ((isCategoryRequired && productCategory) || (!isCategoryRequired)) && (
            <div className="text-danger mt-2 font-11 font-weight-800">
              Product and Quantity is required.
            </div>
          )}
        </Col>
      </Row>
      <Row>
        {partsSelected && partsSelected.length > 0 && (
          <Table className="ml-2" id="productInId">
            <thead>
              <tr>
                <th className="p-2 border-0">
                  <Typography
                    sx={{ fontFamily: 'Suisse Intl' }}
                  >
                    Product
                    <span className="text-danger ml-1">*</span>
                  </Typography>
                </th>
                <th className="py-2 pl-0 border-0">
                  <Typography
                    sx={{ fontFamily: 'Suisse Intl' }}
                  >
                    Quantity
                    <span className="text-danger ml-1">*</span>
                  </Typography>
                </th>
                <th className="py-2 pl-0 border-0" />
                <th className="py-2 pl-0 border-0">
                  <span className="invisible">Del</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {(partsSelected.map((pl, index) => (
                <tr key={index} className="font-weight-400">
                  <td>
                    <MuiAutoComplete
                      sx={{ width: '300px' }}
                      fullWidth
                      name="products"
                      open={code !== 'incoming' ? (openId === index && !isError2) : (openId === index && !isError && !productModal)}
                      size="small"
                      disabled={!locationId}
                      onOpen={() => {
                        setOpen(index);
                      }}
                      onClose={() => {
                        setOpen('');
                      }}
                      classes={{
                        option: classes.option,
                      }}
                      onKeyDown={productKeyword === '' ? avoidSpaceOnFirstCharacter : true}
                      getOptionDisabled={(option) => (code !== 'incoming' && !option.qty_on_hand) || option.label === 'header'}
                      value={pl.product_id && pl.product_id.length ? pl.product_id[1] : openId === index ? productKeyword : ''}
                      getOptionSelected={(option, value) => (value.length > 0 ? option.label === value.label : '')}
                      getOptionLabel={(option) => (typeof option === 'string' ? option : `${option.name} ${option.unique_code ? `| ${option.unique_code}` : ''}`)}
                      options={locationProducts && locationProducts.loading ? [] : [...[{ label: 'header', name: 'header', unique_code: '' }], ...productOptions]}
                      renderOption={(props, option) => (
                        <>
                          <ListItemText
                            {...props}
                            primary={(
                                option.label === 'header' ? (
                                  <Box>
                                    <Typography
                                      className="text-info"
                                      sx={{
                                        font: 'Suisse Intl',
                                        fontWeight: 500,
                                        fontSize: '15px',
                                      }}
                                    >
                                      Quantity shown here excludes Requested Undelivered Products.
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
                                        {option.qty_on_hand}
                                        {'   '}
                                        {option.parts_uom && option.parts_uom.name ? option.parts_uom.name : ''}
                                        <br />
                                        <span className="font-tiny mt-2">
                                          {option.category && option.category.name ? truncate(option.category.name, 17) : ''}
                                        </span>
                                      </Typography>
                                    </Box>
                                  </>
                                )
                            )}
                          />
                          <Divider />
                        </>
                      )}
                      onChange={(e, data) => { onProductChange(data, index); }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="standard"
                          label="Products"
                          onChange={onProductKeywordChange}
                          value={openId === index ? productKeyword : ''}
                          className={pl.product_id && pl.product_id.length ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                          placeholder="Search & Select"
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {(locationProducts && locationProducts.loading) && (openId === index) ? <CircularProgress color="inherit" size={20} /> : null}
                                <InputAdornment position="end">
                                  {((pl.product_id && pl.product_id[0] && locationId) || (openId === index && productKeyword)) && (
                                    <IconButton
                                      aria-label="toggle password visibility"
                                      onClick={(e, data) => { onProductKeywordClear(data, index); }}
                                    >
                                      <IoCloseOutline size={22} fontSize="small" />
                                    </IconButton>
                                  )}
                                  {locationId && (
                                    <IconButton
                                      aria-label="toggle search visibility"
                                      onClick={(e, data) => { showProductModal(data, index); setOpen(''); }}
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
                    {((locationProducts && locationProducts.err) && (openId === index) && (!(noData.status_code && noData.status_code === 404) || (code !== 'incoming') || !isProductCreatable)) && (<FormHelperText><span className="text-danger">{generateErrorMessage(locationProducts)}</span></FormHelperText>)}
                    {isProductCreatable && (noData && code === 'incoming' && (noData.status_code && noData.status_code === 404) && (openId === index) && ((productKeyword && productKeyword.length > 0) || (productKeyword && productKeyword.length >= 1))
                      && (addProductInfo && !addProductInfo.err) && (addProductInfo && !addProductInfo.data)) && (
                        <FormHelperText className="form-helpertext">
                          <span>{`New Product "${productKeyword}" will be created. Do you want to create..? Click`}</span>
                          <span aria-hidden="true" onClick={() => setProductModal(true)} className="text-info ml-2 cursor-pointer">YES</span>
                          {'  '}
                          (OR)
                          <span aria-hidden="true" onClick={() => { setProductKeyword(''); setOpen(''); }} className="text-info ml-2 cursor-pointer">NO</span>
                        </FormHelperText>
                    )}
                  </td>
                  <td className="p-2 mt-2">
                    <TextField
                      fullWidth
                      name="Quantity"
                      id="Quantity"
                      label="Quantity"
                      variant="standard"
                      autoComplete="off"
                      maxLength="7"
                      onKeyDown={decimalKeyPressDown}
                      onChange={(e) => onUnitChange(e, index)}
                      value={pl.quantity}
                    />
                  </td>
                  <td className="p-2 pt-4"><span>{pl.product_uom && pl.product_uom.length ? pl.product_uom[1] : ''}</span></td>
                  { /* <td className="p-2">
                    <span>{pl.reserved_availability ? getFloatValue(pl.reserved_availability) : getFloatValue(0)}</span>
                  </td>
                  <td className="p-2">
                    <span>{pl.quantity_done ? getFloatValue(pl.quantity_done) : getFloatValue(0)}</span>
                  </td>
                  <td className="p-2">
                    <FormControl>
                      <Autocomplete
                        name="uom"
                        className="bg-white min-width-200"
                        open={uomId === index}
                        disabled
                        size="small"
                        onOpen={() => {
                          setUom(index);
                          setUomKeyword('');
                        }}
                        onClose={() => {
                          setUom('');
                          setUomKeyword('');
                        }}
                        value={pl.product_uom && pl.product_uom.length ? pl.product_uom[1] : ''}
                        getOptionSelected={(option, value) => (value.length > 0 ? option.label === value.label : '')}
                        getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                        options={uomOptions}
                        onChange={(e, data) => { onUomChange(data, index); }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            onChange={onUomKeyWordChange}
                            variant="outlined"
                            className="without-padding"
                            placeholder=""
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <>
                                  {(measuresInfo && measuresInfo.loading) && (uomId === index) ? <CircularProgress color="inherit" size={20} /> : null}
                                  {params.InputProps.endAdornment}
                                </>
                              ),
                            }}
                          />
                        )}
                      />
                      {((measuresInfo && measuresInfo.err) && (uomId === index)) && (<FormHelperText><span className="text-danger">{generateErrorMessage(measuresInfo)}</span></FormHelperText>)}
                    </FormControl>
                          </td> */ }
                  <td className="p-2 pt-4">
                    <span className="font-weight-400 d-inline-block" />
                    <FontAwesomeIcon className="mr-1 ml-1 cursor-pointer" size="sm" icon={faTrashAlt} onClick={(e) => { removeData(e, index); }} />
                  </td>
                </tr>
              )))}
            </tbody>
          </Table>
        )}
      </Row>

      <Dialog size="lg" fullWidth open={extraModal}>
        <DialogHeader rightButton title={modalName} imagePath={false} onClose={() => { setExtraModal(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <SearchModal
              locationId={locationId}
              afterReset={() => { setExtraModal(false); }}
              stockType={code === 'incoming' ? 'Inward' : false}
              arrayValues={arrayList}
              productKeyword={productKeyword}
              setProductKeyword={setProductKeyword}
              arrayIndex={arrayIndex}
              code={code}
              productCategory={productCategory}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>

      <Dialog size={(addProductInfo && addProductInfo.data) ? 'sm' : 'xl'} open={productModal}>
        <DialogHeader title="Add Product" imagePath={false} onClose={() => { onModalClose(); onProductClose(); }} response={addProductInfo} sx={{ width: '500px' }} />
        <DialogContent sx={{ overflow: 'unset' }}>
          <DialogContentText id="alert-dialog-description">
            <AddProduct
              isTheme
              isModal
              productName={productKeyword}
              setProductKeyword={setProductKeyword}
              reset={() => { onModalClose(); onProductClose(); setOpen(''); }}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
};

ProductsForm.propTypes = {
  reload: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  locationId: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]).isRequired,
  code: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]).isRequired,
};

export default ProductsForm;
