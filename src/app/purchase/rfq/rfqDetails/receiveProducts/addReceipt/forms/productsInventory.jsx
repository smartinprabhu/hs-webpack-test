/* eslint-disable max-len */
/* eslint-disable radix */
/* eslint-disable react/no-array-index-key */
/* eslint-disable import/no-unresolved */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Row, Col,
  Table,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPencil,
} from '@fortawesome/free-solid-svg-icons';
import {
  CircularProgress, FormHelperText, FormControl,
} from '@material-ui/core';
import { useFormikContext } from 'formik';
import { makeStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import {
  Dialog, DialogContent, DialogContentText, Typography, TextField, ListItemText, Box, Tooltip, Button,
} from '@mui/material';
import { IoCloseOutline } from 'react-icons/io5';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';

import Loader from '@shared/loading';
import addIcon from '@images/icons/plusCircleBlue.svg';
import { getLocationProducts, getPartsData } from '../../../../../../preventiveMaintenance/ppmService';
import {
  getMoveProducts, setUnreserveProducts, resetUnreserveProducts,
} from '../../../../../purchaseService';
import '../../../../../../preventiveMaintenance/preventiveMaintenance.scss';
import {
  getArrayFromValuesById,
  getColumnArrayByIdWithArray,
  generateErrorMessage,
  getColumnArrayByIdWithArrayName,
  getColumnArrayById,
  getAllowedCompanies, truncate, decimalKeyPressDown, isJsonString, getJsonString,
} from '../../../../../../util/appUtils';
import SearchModal from './searchModalProduct';
import { checkProductIdTransfer } from '../../../../utils/utils';
import MuiAutoComplete from '../../../../../../commonComponents/formFields/muiAutocomplete';
import DialogHeader from '../../../../../../commonComponents/dialogHeader';
import { AddThemeColor } from '../../../../../../themes/theme';

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

const ProductsInventory = (props) => {
  const {
    reload,
    setFieldValue,
    locationId,
    locationName,
    code,
  } = props;

  const dispatch = useDispatch();
  const { values: formValues } = useFormikContext();
  const {
    product_categ_id,
  } = formValues;
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
  const [uomOptions, setUomOptions] = useState([]);

  const [lProducts, setLProducts] = useState('');

  const [isInEditable, setInEditable] = useState(false);

  const [isAllEditable, setAllEditable] = useState(false);

  const [isAllModal, setAllModal] = useState(false);
  const [unreserveModal, setUnreserveModal] = useState(false);

  const [currentId, setCurrentId] = useState(false);
  const [currentName, setCurrentName] = useState(false);

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const { locationProducts, locationProductsHide, partsSelected } = useSelector((state) => state.ppm);
  const {
    transferDetails, unreserveInfo, moveProducts, measuresInfo,
  } = useSelector((state) => state.purchase);

  const {
    inventorySettingsInfo,
  } = useSelector((state) => state.site);

  const invSettingData = inventorySettingsInfo && inventorySettingsInfo.data && inventorySettingsInfo.data.length ? inventorySettingsInfo.data[0] : false;

  const isCategoryRequired = invSettingData && invSettingData.is_product_category_mandatory;

  const productCategory = (product_categ_id && product_categ_id.id) || (product_categ_id && product_categ_id.length > 0 && product_categ_id[0]);

  const tranferData = transferDetails && transferDetails.data && transferDetails.data.length ? transferDetails.data[0] : '';
  const idEditable = (tranferData && (tranferData.request_state === 'Approved' || tranferData.request_state === 'Requested') && locationId);
  const qtyEditable = (tranferData && (tranferData.request_state === 'Approved' || tranferData.request_state === 'Requested') && locationId);

  console.log(locationId);
  console.log(tranferData && (tranferData.request_state === 'Approved'));
  useEffect(() => {
    setRefresh(refresh);
  }, [reload]);

  useEffect(() => {
    if (code === 'incoming') {
      setAllEditable(true);
    }
  }, [code]);

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
    if (locationId) {
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

  useEffect(() => {
    if (openId) {
      setProductKeyword('');
    }
  }, [openId]);

  useEffect(() => {
    if (transferDetails && transferDetails.data) {
      const ids = transferDetails.data.length > 0 ? transferDetails.data[0].move_ids_without_package : [];
      dispatch(getMoveProducts(ids, appModels.STOCKMOVE, false));
    }
  }, [transferDetails]);

  useEffect(() => {
    if (moveProducts && moveProducts.data && refresh === '1') {
      const newArrData = moveProducts.data.map((cl) => ({
        ...cl,
        id: cl.id,
        product_id: cl.product_id,
        quantity: parseInt(cl.product_uom_qty),
        product_uom: cl.product_uom,
        quantity_done: parseInt(cl.quantity_done),
      }));
      setPartsData(newArrData);
      dispatch(getPartsData(newArrData));
    }
  }, [moveProducts, refresh]);

  useEffect(() => {
    if (locationId && moveProducts && moveProducts.data && code !== 'incoming') {
      const domains = `[["purchase_ok","=",true],["active","=",true],["is_pantry_item","!=",true],["name","in",${JSON.stringify(getColumnArrayByIdWithArrayName(moveProducts.data, 'product_id'))}]]`;
      dispatch(getLocationProducts(locationId, productKeyword, 0, moveProducts.data.length, getType(), domains, 'hide'));
    }
  }, [locationId, moveProducts]);

  function getPrData(data) {
    let res = data;
    if (code !== 'incoming') {
      res = data.filter((item) => (item.qty_on_hand));
    }
    return res;
  }

  useMemo(() => {
    if (locationProductsHide && locationProductsHide.data && locationProductsHide.data.length > 0) {
      setLProducts(JSON.stringify(locationProductsHide.data));
    } else {
      setLProducts(JSON.stringify([]));
    }
  }, [locationProductsHide]);

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
    }
  }, [locationProducts, partId, partsAdd]);

  useEffect(() => {
    if (partsAdd) {
      setPartsData(partsData);
      dispatch(getPartsData(partsData));
    }
  }, [partsAdd]);

  const onCancel = () => {
    dispatch(resetUnreserveProducts());
    setInEditable(false);
    setAllEditable(false);
    setCurrentId(false);
    setCurrentName(false);
    setUnreserveModal(false);
  };

  const onUnreserveOpen = () => {
    dispatch(resetUnreserveProducts());
    setInEditable(false);
    setAllEditable(false);
    setCurrentId(false);
    setCurrentName(false);
    setUnreserveModal(true);
  };

  const onUnreserveInOpen = (id, name) => {
    dispatch(resetUnreserveProducts());
    setInEditable(false);
    setAllEditable(false);
    setCurrentId(id);
    setCurrentName(name);
    setUnreserveModal(true);
  };

  const onDone = () => {
    const domains = `[["purchase_ok","=",true],["active","=",true],["is_pantry_item","!=",true],["name","in",${JSON.stringify(getColumnArrayByIdWithArrayName(moveProducts.data, 'product_id'))}]]`;
    dispatch(getLocationProducts(locationId, productKeyword, 0, moveProducts.data.length, getType(), domains, 'hide'));
    dispatch(resetUnreserveProducts());
    if (currentName) {
      setInEditable(true);
    } else {
      setAllEditable(true);
    }
    // setCurrentId(false);
    // setCurrentName(false);
    setUnreserveModal(false);
  };

  const onUnreserveData = () => {
    if (currentName) {
      const postData = { ids: `[${currentId}]` };
      dispatch(setUnreserveProducts(postData));
    } else {
      const ids = getColumnArrayById(partsSelected && partsSelected.length ? partsSelected : [], 'id');
      const postData = { ids: JSON.stringify(ids) };
      dispatch(setUnreserveProducts(postData));
    }
  };

  /* useEffect(() => {
    if (userInfo && userInfo.data) {
      dispatch(getMeasures(appModels.UOM, uomKeyword));
    }
  }, [uomKeyword]); */

  useEffect(() => {
    if (measuresInfo && measuresInfo.data && measuresInfo.data.length > 0) {
      const { data } = measuresInfo;
      setUomOptions(data.map((cl) => ({
        ...cl, value: cl.id, label: cl.name,
      })));
    }
  }, [measuresInfo]);

  useEffect(() => {
    if (partsSelected && partsSelected.length > 0) {
      setFieldValue('move_ids_without_package', partsSelected);
    } else {
      setPartsData([]);
      setFieldValue('move_ids_without_package', []);
    }
  }, [partsSelected]);

  const onUomKeyWordChange = (event) => {
    setUomKeyword(event.target.value);
  };

  const loadEmptyTd = () => {
    const newData = partsData;
    newData.push({
      id: false,
      product_id: '',
      quantity: 1,
      product_uom: false,
      quantity_done: 0,
    });
    setPartsData(newData);
    setProductKeyword('');
    setPartsAdd(Math.random());
  };
  const removeData = (e, index) => {
    const checkData = partsData;
    checkData[index].isRemove = true;
    setPartsData(checkData);
    setProductKeyword('');
    setPartsAdd(Math.random());
  };

  const onUnitChange = (e, index) => {
    const newData = partsData;
    const data = lProducts && isJsonString(lProducts) && getJsonString(lProducts) ? getJsonString(lProducts) : [];
    const prQty = data.filter((item) => (newData[index].product_id.length && item.id === newData[index].product_id[0]));
    const pqty = prQty && prQty.length ? prQty[0].qty_on_hand : 10;
    const prHand = newData[index].product_id && newData[index].product_id.length && newData[index].product_id.length > 2 ? newData[index].product_id[2] : pqty;
    if (code !== 'incoming') {
      newData[index].quantity = /^(\d+(\.\d*)?)?$/.test(e.target.value) && parseFloat(prHand) >= e.target.value ? e.target.value : '';
    } else {
      newData[index].quantity = /^(\d+(\.\d*)?)?$/.test(e.target.value) ? e.target.value : '';
    }
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  const onDoneChange = (e, index) => {
    const newData = partsData;
    const qty = newData[index].quantity;
    //  const rsQty = newData[index].reserved_availability;

    newData[index].quantity_done = e.target.value && e.target.value <= parseInt(qty) ? e.target.value : '';
    /* if (tranferData.picking_type_code !== 'incoming' && tranferData.state === 'assigned' && rsQty) {
      newData[index].quantity_done = e.target.value && e.target.value <= parseInt(rsQty) ? e.target.value : '';
    } else {
      newData[index].quantity_done = e.target.value && e.target.value <= parseInt(qty) ? e.target.value : '';
    } */
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
    newData[index].product_uom = e && e.parts_uom && e.parts_uom.id ? [e.parts_uom.id, e.parts_uom.name] : [];
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
    setPartsData(newData);
    setPartsAdd(Math.random());
    setOpen(false);
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
  };

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
        {idEditable && !isAllEditable && !isInEditable && (
        <Tooltip title="Edit All Products" placement="top">
          <FontAwesomeIcon className="mr-2 mt-1 float-right cursor-pointer" size="sm" icon={faPencil} onClick={() => onUnreserveOpen()} />
        </Tooltip>
        )}
      </Typography>
      <Row className="ml-0">
        <Col xs={12} sm={12} md={12} lg={12}>

          {!locationId && (
            <div className="text-danger text-center d-inline font-size-13 font-weight-800">
              Location is required.
            </div>
          )}
          {isCategoryRequired && !productCategory && (
          <div className="text-danger text-center d-inline font-size-13 font-weight-800">
            Product Category is required.
          </div>
          )}
          {locationId && locationName && code !== 'incoming' && (
            <div className="text-info mb-2 font-weight-800">
              Note: Select Product(s) from
              {' '}
              {locationName}
            </div>
          )}
          {locationId && locationName && code === 'incoming' && (
            <div className="text-info mb-2 font-weight-800">
              Note: Add products to
              {' '}
              {locationName}
            </div>
          )}
          {((partsSelected && !partsSelected.length > 0) || (!checkProductIdTransfer(partsData))) && locationId && (
            <div className="text-danger font-11 font-weight-800">
              Products is required.
            </div>
          )}
        </Col>
      </Row>
      <Row>
        <Col xs={12} sm={12} md={12} lg={12}>
          {moveProducts && moveProducts.loading && (
            <div className="text-center mt-3">
              <Loader />
            </div>
          )}
          {!moveProducts.loading && (
            <Table className="ml-2">
              <thead>
                <tr>
                  <th className="p-2 border-0">
                    Product
                    {' '}
                    <span className="text-danger ml-1">*</span>
                  </th>
                  <th className="p-2 border-0">
                    Quantity
                    {' '}
                    <span className="text-danger ml-1">*</span>
                  </th>
                  { /* <th className="p-2 border-0">
                  Done
                </th>
                showReserved && (
                <th className="p-2 min-width-100 border-0">
                  Reserved
                </th>
                ) */ }
                  <th className="p-2 border-0" />
                  <th className="p-2 border-0" />
                  <th className="p-2 border-0">
                    <span className="invisible">Del</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {((isCategoryRequired && productCategory) || (!isCategoryRequired)) && isAllEditable && (
                  <tr>
                    <td colSpan="4" align="center">
                      <div aria-hidden="true" className="font-weight-800 d-inline text-center text-lightblue cursor-pointer mt-1 mb-1" onClick={loadEmptyTd}>
                        <img src={addIcon} className="mr-2 mb-1" alt="addequipment" height="15" width="15" />
                        <span className="mr-2">Add a Product</span>
                      </div>
                    </td>
                  </tr>
                )}
                {(partsSelected && partsSelected.length > 0 && partsSelected.map((pl, index) => (
                  !pl.isRemove && (
                    <tr key={index} className="font-weight-400">
                      <td className="p-2 vertical-align-middle">
                        <FormControl>
                          <MuiAutoComplete
                            name="products"
                            className="bg-white min-width-400"
                            open={openId === index}
                            size="medium"
                            disabled={!isAllEditable && !(isInEditable && currentId === pl.id)}
                            onOpen={() => {
                              setOpen(index);
                              setProductKeyword('');
                            }}
                            onClose={() => {
                              setOpen('');
                              setProductKeyword('');
                            }}
                            classes={{
                              listbox: 'custom-listbox',
                              option: classes.option,
                            }}
                            value={pl.product_id && pl.product_id.length ? pl.product_id[1] : ''}
                            getOptionDisabled={(option) => (code !== 'incoming' && !option.qty_on_hand) || option.label === 'header'}
                            getOptionSelected={(option, value) => (value.length > 0 ? option.label === value.label : '')}
                            getOptionLabel={(option) => (typeof option === 'string' ? option : `${option.name} ${option.unique_code ? `| ${option.unique_code}` : ''}`)}
                            options={locationProducts && locationProducts.loading ? [] : [...[{ label: 'header', name: 'header', unique_code: '' }], ...productOptions]}
                            renderOption={(props, option) => (
                              <ListItemText
                                {...props}
                                primary={(
                                  option.label === 'header' ? (
                                    <Box>
                                      <Typography
                                        className="text-info"
                                        sx={{
                                          font: 'Suisse Intl',
                                          fontWeight: 800,
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
                            )}
                            onChange={(e, data) => { onProductChange(data, index); }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                onChange={onProductKeywordChange}
                                variant="standard"
                                label="Products"
                                className={pl.product_id && pl.product_id.length ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                                placeholder="Search & Select"
                                InputProps={{
                                  ...params.InputProps,
                                  endAdornment: (
                                    <>
                                      {(locationProducts && locationProducts.loading) && (openId === index) ? <CircularProgress color="inherit" size={20} /> : null}
                                      {(isAllEditable || (isInEditable && currentId === pl.id)) && (
                                        <InputAdornment position="end">
                                          {pl.product_id && pl.product_id[0] && (
                                            <IconButton
                                              aria-label="toggle password visibility"
                                              onClick={(e, data) => { onProductKeywordClear(data, index); }}
                                            >
                                              <IoCloseOutline size={22} fontSize="small" />
                                            </IconButton>
                                          )}
                                          {(isAllEditable || (isInEditable && currentId === pl.id)) && (
                                          <IconButton
                                            aria-label="toggle search visibility"
                                            onClick={(e, data) => { showProductModal(data, index); }}
                                          >
                                            <SearchIcon fontSize="small" />
                                          </IconButton>
                                          )}
                                        </InputAdornment>
                                      )}
                                    </>
                                  ),
                                }}
                              />
                            )}
                          />
                          {((locationProducts && locationProducts.err) && (openId === index)) && (<FormHelperText><span className="text-danger">{generateErrorMessage(locationProducts)}</span></FormHelperText>)}
                        </FormControl>
                      </td>
                      <td className="p-2 vertical-align-middle">
                        <TextField
                          fullWidth
                          type="text"
                          autoComplete="off"
                          disabled={!isAllEditable && !(isInEditable && currentId === pl.id)}
                          variant="standard"
                          onKeyDown={decimalKeyPressDown}
                          name="quantity"
                          value={pl.quantity}
                          onChange={(e) => onUnitChange(e, index)}
                          maxLength="7"
                        />
                      </td>
                      { /* showReserved && (
                    <td className="p-2">
                      <span>{pl.reserved_availability ? getFloatValue(pl.reserved_availability) : getFloatValue(0)}</span>
                    </td>
                    )
                    <td className="p-2 vertical-align-middle">
                      <Input
                        type="text"
                        autoComplete="off"
                        onKeyPress={decimalKeyPressDown}
                        disabled={!doneEditable}
                        name="quantity_done"
                        max={pl.quantity}
                        value={pl.quantity_done}
                        onChange={(e) => onDoneChange(e, index)}
                        maxLength="7"
                      />
                    </td> */ }
                      <td className="p-2 vertical-align-middle"><span>{pl.product_uom && pl.product_uom.length ? pl.product_uom[1] : ''}</span></td>
                      {idEditable && (
                      <td className="p-2 vertical-align-middle">
                        <div className="page-actions-header content-center">
                          { /* (isAllEditable || (isInEditable && pl.product_id && pl.product_id.length && currentId === pl.product_id[0])) && (
                        <FontAwesomeIcon className="mr-2 cursor-pointer" size="sm" icon={faTrashAlt} onClick={(e) => { removeData(e, index); }} />
                        ) */ }
                          {!isAllEditable && !(isInEditable && currentId === pl.id) && (
                            <Tooltip title="Edit Product" placement="top">
                              <FontAwesomeIcon className="cursor-pointer" size="sm" icon={faPencil} onClick={() => onUnreserveInOpen(pl.id, pl.product_id && pl.product_id.length ? pl.product_id[1] : '')} />
                            </Tooltip>
                          )}
                        </div>
                      </td>
                      )}
                    </tr>
                  )
                )))}
              </tbody>
            </Table>
          )}
        </Col>
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
              code={code}
              arrayIndex={arrayIndex}
              productCategory={productCategory}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Dialog size="lg" fullWidth open={unreserveModal}>
        <DialogHeader rightButton title="Unreserve Quantity" imagePath={false} onClose={() => { setUnreserveModal(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {unreserveInfo && (!unreserveInfo.data && !unreserveInfo.loading && !unreserveInfo.err) && (
            <p className="text-center">
              {currentName ? `Are you sure, you want to unreserve the quantity from ${currentName} ?` : 'Are you sure, you want to unreserve the quantities from the products ?'}
            </p>
            )}
            {unreserveInfo && unreserveInfo.loading && (
            <div className="text-center mt-3">
              <Loader />
            </div>
            )}
            {(unreserveInfo && unreserveInfo.err) && (
            <SuccessAndErrorFormat response={unreserveInfo} />
            )}
            {(unreserveInfo && unreserveInfo.data) && (
            <SuccessAndErrorFormat
              response={unreserveInfo}
              successMessage={currentName ? 'Product Quantity unreserved successfully...' : 'Products quantities are unreserved successfully...'}
            />
            )}
            <div className="pull-right mt-3">
              {unreserveInfo && !unreserveInfo.data && (
              <Button
                size="sm"
                disabled={unreserveInfo && unreserveInfo.loading}
                variant="contained"
                onClick={() => onUnreserveData()}
              >
                Confirm
              </Button>
              )}
              {unreserveInfo && unreserveInfo.data && (
              <Button size="sm" variant="contained" onClick={() => onDone()}>Ok</Button>
              )}
            </div>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
};

ProductsInventory.propTypes = {
  reload: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  locationId: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]).isRequired,
  code: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]).isRequired,
};

export default ProductsInventory;
