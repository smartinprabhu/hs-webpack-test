/* eslint-disable radix */
/* eslint-disable react/no-array-index-key */
/* eslint-disable import/no-unresolved */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Card, CardBody, Row, Col, Input,
  Table, Modal,
  ModalBody, ModalFooter, Button,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import {
  TextField, CircularProgress, FormHelperText, FormControl,
} from '@material-ui/core';
import { DatePicker } from 'antd';
import moment from 'moment';
import { Autocomplete } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';

import Loader from '@shared/loading';
import addIcon from '@images/icons/plusCircleBlue.svg';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import { getProductsList, getPartsData } from '../../../preventiveMaintenance/ppmService';
import {
  getTaxData, getCustomerTaxes, getTaxes, getProductOrders, getMeasures,
} from '../../purchaseService';
import '../../../preventiveMaintenance/preventiveMaintenance.scss';
import {
  generateArrayFromValue,
  getTotalFromArray, getArrayFromValuesById,
  getColumnArrayByIdWithArray,
  generateErrorMessage,
  getAllowedCompanies, decimalKeyPress, getDateTimeSeconds, getFloatValue, numToFloat,
} from '../../../util/appUtils';
import SearchModal from './searchModal';
import {
  getTotalTax, getDataWithTaxId, getColumnArrayByTaxesIdWithArray,
} from '../../utils/utils';
import {
  checkProductId, getProductsLength, checkRequiredFields, getRequiredMessage,
} from '../utils/utils';

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

const ProductUpdateForm = React.memo((props) => {
  const {
    setFieldValue,
  } = props;

  const dispatch = useDispatch();
  const classes = useStyles();
  const quantity = 1;
  const orderDateNotVisibleState = ['purchase', 'done', 'cancel'];
  const [partsData, setPartsData] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [openId, setOpen] = useState('');
  const [productKeyword, setProductKeyword] = useState('');
  const [partsAdd, setPartsAdd] = useState(false);
  const [partId, setPartId] = useState(false);
  const [partIndex, setPartIndex] = useState(false);
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
  const [taxesOpen, setTaxesOpen] = useState('');
  const [modalAlert, setModalAlert] = useState(false);
  const [uomKeyword, setUomKeyword] = useState('');
  const [uomId, setUom] = useState('');
  const [uomOptions, setUomOptions] = useState([]);
  const { measuresInfo } = useSelector((state) => state.purchase);

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const { productInfo, partsSelected } = useSelector((state) => state.ppm);
  const {
    taxInfo, productOrders, taxesInfo, quotationDetails, customerTaxesInfo,
  } = useSelector((state) => state.purchase);

  const toggleAlert = () => {
    setModalAlert(false);
  };

  useEffect(() => {
    if (quotationDetails && quotationDetails.data) {
      dispatch(getProductOrders(quotationDetails.data[0].order_line, appModels.PURCHASEORDERLINE));
    }
  }, [quotationDetails]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      dispatch(getMeasures(appModels.UOM, uomKeyword));
    }
  }, [uomKeyword]);

  useEffect(() => {
    if (measuresInfo && measuresInfo.data && measuresInfo.data.length > 0) {
      const { data } = measuresInfo;
      setUomOptions(data.map((cl) => ({
        ...cl, value: cl.id, label: cl.name,
      })));
    }
  }, [measuresInfo]);

  useEffect(() => {
    if (productInfo && productInfo.data && productInfo.data.length > 0) {
      const ids = getColumnArrayByIdWithArray(partsSelected && partsSelected.length ? partsSelected : [], 'product_id');
      const data = getArrayFromValuesById(productInfo.data, ids, 'id');
      if (data && data.length > 0) {
        setProductOptions(data.map((cl) => ({
          ...cl, value: cl.id, label: cl.name,
        })));
      }
    }
  }, [productInfo, partId, partsAdd]);

  useEffect(() => {
    if (partsAdd) {
      setPartsData(partsData);
      dispatch(getPartsData(partsData));
    }
  }, [partsAdd]);

  useEffect(() => {
    if (partsSelected && partsSelected.length > 0) {
      setFieldValue('order_line', partsSelected);
    } else {
      setPartsData([]);
      setFieldValue('order_line', []);
    }
  }, [partsSelected]);

  useEffect(() => {
    if (productOrders && productOrders.data) {
      const newData = productOrders.data.map((cl) => ({
        ...cl,
        id: cl.id,
        product_qty: numToFloat(cl.product_qty),
        price_unit: numToFloat(cl.price_unit),
      }));
      setPartsData(newData);
      dispatch(getPartsData(newData));
      const ids = getColumnArrayByTaxesIdWithArray(newData, 'taxes_id');
      if (ids && ids.length && !ids[0].name) {
        dispatch(getTaxes(ids, appModels.TAX));
      }
    }
  }, [productOrders]);

  useEffect(() => {
    if (taxesInfo && taxesInfo.data) {
      const newData = getDataWithTaxId(partsSelected && partsSelected.length ? partsSelected : [], taxesInfo.data);
      setPartsData(newData);
      setPartIndex(false);
      setPartsAdd(Math.random());
    }
  }, [taxesInfo]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      dispatch(getProductsList(companies, appModels.PRODUCT, productKeyword));
    }
  }, [userInfo, openId, productKeyword]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data) {
        await dispatch(getCustomerTaxes(userInfo.data.company.id, appModels.TAX, 'purchase'));
      }
    })();
  }, [userInfo, taxesOpen]);

  useEffect(() => {
    if (partId && (productInfo && productInfo.data)) {
      const data = generateArrayFromValue(productInfo.data, 'id', partId);
      const newData = partsData;
      if (data.length > 0) {
        newData[partIndex].name = data && data[0] && data[0].name ? data[0].name : '';
        newData[partIndex].company_id = data && data[0] && data[0].company_id ? data[0].company_id : '';
        newData[partIndex].price_unit = data && data[0] && data[0].standard_price ? numToFloat(data[0].standard_price) : numToFloat(0);
        newData[partIndex].taxes_id = data && data[0] && data[0].taxes_id ? data[0].taxes_id : '';
        newData[partIndex].price_subtotal = data && data[0] && data[0].standard_price ? (getFloatValue(data[0].standard_price) * getFloatValue(newData[partIndex].product_qty)) : getFloatValue(0);
        setPartsData(newData);
        setPartId(false);
        setPartsAdd(Math.random());
        dispatch(getTaxData(data[0].taxes_id ? data[0].taxes_id : '', appModels.TAX));
      }
    }
  }, [partId]);

  useEffect(() => {
    if (taxInfo && taxInfo.data) {
      const newData = partsData;
      if (taxInfo.data.length > 0 && partIndex !== false) {
        newData[partIndex].taxes_id = taxInfo.data;
        setPartsData(newData);
        setPartIndex(false);
        setPartsAdd(Math.random());
      }
      if (taxInfo.data.length > 0 && arrayIndex !== false) {
        newData[arrayIndex].taxes_id = taxInfo.data;
        setPartsData(newData);
        setArrayIndex(false);
        setPartsAdd(Math.random());
      }
    }
  }, [taxInfo]);

  useEffect(() => {
    if (partsSelected && partsSelected.length) {
      const filterNotRemovedData = partsSelected.filter((item) => !item.isRemove);
      const withoutTaxTotal = getTotalFromArray(filterNotRemovedData && filterNotRemovedData.length ? filterNotRemovedData : [], 'price_subtotal');
      const totalTaxRs = getTotalTax(filterNotRemovedData && filterNotRemovedData.length ? filterNotRemovedData : [], 'taxes_id', 'price_subtotal');
      const totalPay = withoutTaxTotal + totalTaxRs;
      setFieldValue('amount_untaxed', withoutTaxTotal);
      setFieldValue('amount_untaxed', withoutTaxTotal);
      setFieldValue('amount_tax', totalTaxRs);
      setFieldValue('amount_total', totalPay);
    }
  }, [partsSelected, partsData, partsAdd]);

  const loadEmptyTd = () => {
    const newData = partsData;
    newData.push({
      id: 0,
      product_id: '',
      name: '',
      company_id: '',
      date_planned: new Date(),
      product_uom: 1,
      product_qty: numToFloat(quantity),
      price_unit: numToFloat(0),
      taxes_id: '',
      price_subtotal: 0,
    });
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  const currentState = quotationDetails && quotationDetails.data ? quotationDetails.data[0].state : false;

  const removeData = (e, index) => {
    const checkData = partsData;
    const { id } = checkData[index];
    if (id && currentState === 'purchase') {
      setModalAlert(true);
    } else if (id && currentState !== 'purchase') {
      checkData[index].isRemove = true;
      setPartId(e.id);
      setPartIndex(index);
      setPartsData(checkData);
      setPartsAdd(Math.random());
    } else {
      const indexRemove = checkData.indexOf(checkData[index]);
      checkData.splice(indexRemove, 1);
      setPartsData(checkData);
      setPartsAdd(Math.random());
    }
  };

  const onUomChange = (e, index) => {
    const newData = partsData;
    newData[index].product_uom = e ? [e.id, e.name] : [];
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  const onUomKeyWordChange = (event) => {
    setUomKeyword(event.target.value);
  };

  const onQuantityChange = (e, index) => {
    const newData = partsData;
    newData[index].product_qty = e.target.value && e.target.value >= 1 ? e.target.value : '';
    const total = e.target.value * newData[index].price_unit;
    newData[index].price_subtotal = total;
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  const onPlannedDateChange = (e, index) => {
    const newData = partsData;
    newData[index].date_planned = e;
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  const onUnitChange = (e, index) => {
    const newData = partsData;
    newData[index].price_unit = e.target.value && e.target.value >= 1 ? e.target.value : '';
    const total = e.target.value * newData[index].product_qty;
    newData[index].price_subtotal = total;
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  const onProductChange = (e, index) => {
    const newData = partsData;
    newData[index].product_id = [e.id, e.name];
    newData[index].product_uom = e && e.uom_id ? [e.uom_id[0], e.uom_id[1]] : [];
    setPartId(e.id);
    setPartIndex(index);
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  const setTags = (e, index) => {
    const newData = partsData;
    newData[index].taxes_id = e;
    setPartId(e.id);
    setPartIndex(index);
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  const onProductKeywordChange = (event) => {
    setProductKeyword(event.target.value);
  };

  const onProductKeywordClear = (e, index) => {
    const newData = partsData;
    newData[index].product_id = '';
    newData[index].name = '';
    newData[index].price_unit = numToFloat(0);
    newData[index].product_uom = '';
    newData[index].taxes_id = '';
    setPartsData(newData);
    setPartsAdd(Math.random());
    setOpen(false);
  };

  const onDescriptionChange = (e, index) => {
    const newData = partsData;
    newData[index].name = e.target.value;
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  const showProductModal = (e, index) => {
    setModelValue(appModels.PRODUCT);
    setFieldName('product');
    setModalName('Products');
    setCompanyValue(userInfo && userInfo.data ? userInfo.data.company.id : '');
    setColumns(['id', 'name', 'company_id', 'uom_id', 'taxes_id', 'standard_price']);
    setOtherFieldName('purchase_ok');
    setOtherFieldValue(true);
    setArrayList(partsSelected);
    setArrayIndex(index);
    setExtraModal(true);
  };

  const filterNotRemovedData = partsSelected && partsSelected.length > 0 ? partsSelected.filter((item) => !item.isRemove) : [];
  const withoutTaxTotal = getTotalFromArray(filterNotRemovedData && filterNotRemovedData.length ? filterNotRemovedData : [], 'price_subtotal');
  const totalTaxRs = getTotalTax(filterNotRemovedData && filterNotRemovedData.length ? filterNotRemovedData : [], 'taxes_id', 'price_subtotal');
  const totalPay = withoutTaxTotal + totalTaxRs;
  const loading = (productOrders && productOrders.loading) || (taxesInfo && taxesInfo.loading);

  let taxesOptions = [];

  if (customerTaxesInfo && customerTaxesInfo.loading) {
    taxesOptions = [{ name: 'Loading..' }];
  }
  if (customerTaxesInfo && customerTaxesInfo.data) {
    taxesOptions = customerTaxesInfo.data;
  }
  if (customerTaxesInfo && customerTaxesInfo.err) {
    taxesOptions = [];
  }

  const productLength = partsSelected && partsSelected.length > 0 ? getProductsLength(partsSelected) : true;

  const state = quotationDetails && quotationDetails.data ? quotationDetails.data[0].state : false;

  return (
    <>
      <Card className="no-border-radius mt-2 mb-2">
        <CardBody className="p-0 bg-porcelain">
          <p className="ml-3 mb-1 mt-1 font-weight-600 font-side-heading">Products</p>
        </CardBody>
      </Card>
      <Row className="ml-0">
        <Col xs={12} sm={12} md={12} lg={12}>
          <div aria-hidden="true" className="font-weight-800 d-inline text-lightblue cursor-pointer mt-1 mb-1" onClick={loadEmptyTd}>
            <img src={addIcon} className="mr-2 mb-1" alt="addequipment" height="15" width="15" />
            <span className="mr-2">Add a Line</span>
          </div>
          {((!loading && productLength) || (!checkProductId(partsData))) && (
          <div className="text-danger text-center d-inline font-11 font-weight-800">
            Product  is required.
          </div>
          )}
          {(checkProductId(partsData) && !checkRequiredFields(partsData)) && (
          <div className="text-danger text-center d-inline font-11 font-weight-800">
              {getRequiredMessage(partsData)}
          </div>
          )}
        </Col>
      </Row>
      <Row className="products-list thin-scrollbar">
        <Col xs={12} sm={12} md={12} lg={12}>
          {!loading && (
            <Table className="ml-2">
              <thead>
                <tr>
                  <th className="p-2 min-width-200 border-0">
                    Product
                    <span className="ml-1 text-danger">*</span>
                  </th>
                  <th className="p-2 min-width-160 border-0">
                    Description
                    <span className="ml-1 text-danger">*</span>
                  </th>
                  <th className="p-2 min-width-100 border-0">
                    Company
                  </th>
                  <th className="p-2 min-width-200 border-0">
                    Scheduled Date
                    <span className="ml-1 text-danger">*</span>
                  </th>
                  <th className="p-2 min-width-100 border-0">
                    Quantity
                    <span className="ml-1 text-danger">*</span>
                  </th>
                  <th className="p-2 min-width-100 border-0">
                    Unit Price
                    <span className="ml-1 text-danger">*</span>
                  </th>
                  <th className="p-2 min-width-200 border-0">
                    Product Unit of Measure
                    <span className="ml-1 text-danger">*</span>
                  </th>
                  <th className="p-2 min-width-200 border-0">
                    Taxes
                  </th>
                  <th className="p-2 min-width-100 border-0">
                    Sub Total
                  </th>
                  <th className="p-2 min-width-100 border-0">
                    <span className="invisible">Del</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {(partsSelected && partsSelected.length > 0 && partsSelected.map((pl, index) => (
                  <>
                    {!pl.isRemove && (
                      <tr key={index} className="font-weight-400">
                        <td className="p-2">
                          <FormControl>
                            <Autocomplete
                              name="products"
                              className="bg-white min-width-200"
                              open={openId === index}
                              size="small"
                              onOpen={() => {
                                setOpen(index);
                                setProductKeyword('');
                              }}
                              onClose={() => {
                                setOpen('');
                                setProductKeyword('');
                              }}
                              classes={{
                                option: classes.option,
                              }}
                              value={pl.product_id && pl.product_id.length ? pl.product_id[1] : ''}
                              getOptionSelected={(option, value) => (value.length > 0 ? option.label === value.label : '')}
                              getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                              options={productOptions}
                              onChange={(e, data) => { onProductChange(data, index); }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  onChange={onProductKeywordChange}
                                  variant="outlined"
                                  className={pl.product_id && pl.product_id.length ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                                  placeholder="Search & Select"
                                  InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                      <>
                                        {(productInfo && productInfo.loading) && (openId === index) ? <CircularProgress color="inherit" size={20} /> : null}
                                        <InputAdornment position="end">
                                          {pl.product_id && pl.product_id[0] && (
                                            <IconButton
                                              aria-label="toggle password visibility"
                                              onClick={(e, data) => { onProductKeywordClear(data, index); }}
                                            >
                                              <BackspaceIcon fontSize="small" />
                                            </IconButton>
                                          )}
                                          <IconButton
                                            aria-label="toggle search visibility"
                                            onClick={(e, data) => { showProductModal(data, index); }}
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
                            {((productInfo && productInfo.err) && (openId === index)) && (<FormHelperText><span className="text-danger">{generateErrorMessage(productInfo)}</span></FormHelperText>)}
                          </FormControl>
                        </td>
                        <td className="p-2">
                          <Input name="name" value={pl.name} onChange={(e) => onDescriptionChange(e, index)} />
                        </td>
                        <td className="p-2">
                          <span>{pl.company_id && pl.company_id[1] ? pl.company_id[1] : ''}</span>
                        </td>
                        <td className="p-2">
                          <DatePicker
                            format="DD/MM/YYYY HH:mm:ss"
                            value={pl.date_planned ? moment(new Date(getDateTimeSeconds(pl.date_planned)), 'DD/MM/YYYY HH:mm:ss') : ''}
                            className="w-100"
                            showTime={{ format: 'HH:mm:ss' }}
                            onChange={(e) => onPlannedDateChange(e, index)}
                          />
                        </td>
                        <td className="p-2">
                          <Input type="text" autoComplete="off" name="product_qty" onKeyPress={decimalKeyPress} value={pl.product_qty} onChange={(e) => onQuantityChange(e, index)} />
                        </td>
                        <td className="p-2">
                          <Input type="text" autoComplete="off" name="price_unit" value={pl.price_unit} onKeyPress={decimalKeyPress} onChange={(e) => onUnitChange(e, index)} />
                        </td>
                        <td className="p-2">
                          <FormControl>
                            <Autocomplete
                              name="uom"
                              className="bg-white min-width-200"
                              open={uomId === index}
                              size="small"
                              disabled={orderDateNotVisibleState.includes(state)}
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
                                  placeholder="Search & Select"
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
                        </td>
                        <td className="p-2">
                          <FormControl className="m-1">
                            <Autocomplete
                              multiple
                              filterSelectedOptions
                              name="Taxes"
                              className="bg-white min-width-200"
                              open={taxesOpen === index}
                              size="small"
                              onOpen={() => {
                                setTaxesOpen(index);
                              }}
                              onClose={() => {
                                setTaxesOpen('');
                              }}
                              onChange={(e, data) => { setTags(data, index); }}
                              value={pl.taxes_id && pl.taxes_id.length ? pl.taxes_id : []}
                              loading={customerTaxesInfo && customerTaxesInfo.loading}
                              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                              options={taxesOptions}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  variant="outlined"
                                  className="without-padding"
                                  InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                      <>
                                        {customerTaxesInfo && customerTaxesInfo.loading && (taxesOpen === index) ? <CircularProgress color="inherit" size={20} /> : null}
                                        {params.InputProps.endAdornment}
                                      </>
                                    ),
                                  }}
                                />
                              )}
                            />
                            {(customerTaxesInfo && customerTaxesInfo.err) && (taxesOpen === index)
                              && (<FormHelperText><span className="text-danger">{generateErrorMessage(customerTaxesInfo)}</span></FormHelperText>)}
                          </FormControl>
                        </td>
                        <td className="p-2">
                          <span>{pl.price_subtotal ? getFloatValue(pl.price_subtotal) : getFloatValue(0)}</span>
                        </td>
                        <td className="p-2">
                          <span className="font-weight-400 d-inline-block" />
                          <FontAwesomeIcon className="mr-1 ml-1 cursor-pointer" size="sm" icon={faTrashAlt} onClick={(e) => { removeData(e, index); }} />
                        </td>
                      </tr>
                    )}
                  </>
                )))}
                <tr>
                  <td colSpan="8" className="text-right p-2">
                    <p>Untaxed Amount</p>
                    <p>Taxes</p>
                    <p>Total</p>
                  </td>
                  <td colSpan="2" className="p-2">
                    <p>
                      {getFloatValue(withoutTaxTotal)}
                      {' '}
                      Rs
                    </p>
                    <p>
                      {getFloatValue(totalTaxRs)}
                      {' '}
                      Rs
                    </p>
                    <p>
                      {getFloatValue(totalPay)}
                      {' '}
                      Rs
                    </p>
                  </td>
                </tr>
              </tbody>
            </Table>
          )}
          {loading && (
            <div className="text-center mt-4 mb-4">
              <Loader />
            </div>
          )}
        </Col>
      </Row>
      <Modal size="xl" className="border-radius-50px modal-dialog-centered" isOpen={extraModal}>
        <ModalHeaderComponent title={modalName} imagePath={false} closeModalWindow={() => { setExtraModal(false); }} />
        <ModalBody className="mt-0 pt-0">
          <SearchModal
            modelName={modelValue}
            afterReset={() => { setExtraModal(false); }}
            fieldName={fieldName}
            fields={columns}
            company={companyValue}
            otherFieldName={otherFieldName}
            otherFieldValue={otherFieldValue}
            modalName={modalName}
            setFieldValue={setFieldValue}
            arrayValues={arrayList}
            arrayIndex={arrayIndex}
          />
        </ModalBody>
      </Modal>
      <Modal isOpen={modalAlert} toggle={toggleAlert} size="sm">
        <ModalHeaderComponent size="sm" title="Alert" closeModalWindow={toggleAlert} />
        <hr className="m-0" />
        <ModalBody>
          Cannot delete a purchase order line which is in state &apos;Purchase Order&apos;.
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => { setModalAlert(false); }}>Ok</Button>
        </ModalFooter>
      </Modal>
    </>
  );
});

ProductUpdateForm.propTypes = {
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default ProductUpdateForm;
