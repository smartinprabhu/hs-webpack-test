/* eslint-disable no-nested-ternary */
/* eslint-disable radix */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable camelcase */
/* eslint-disable comma-dangle */
/* eslint-disable react/no-array-index-key */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Row, Col, Table, Input,
  ModalFooter,
  Modal,
  ModalBody,
  Badge,
} from 'reactstrap';
import { ThemeProvider, makeStyles } from '@material-ui/core/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPencilAlt,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { Autocomplete } from '@material-ui/lab';
import {
  TextField, CircularProgress, FormHelperText, FormControl,
} from '@material-ui/core';
import { useFormikContext } from 'formik';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';
import {
  Dialog, DialogContent, DialogContentText, Button, DialogActions, Typography
} from '@mui/material';

import ModalHeaderComponent from '@shared/modalHeaderComponent';
import Loader from '@shared/loading';
import addIcon from '@images/icons/plusCircleBlue.svg';
import addCircleIcon from '@images/icons/addCircle.svg';
import addIconDisabled from '@images/icons/addCircleGrey.svg';
import minusIcon from '@images/icons/minusCircleBlue.svg';
import minusIconDisabled from '@images/icons/minusCircleGrey.svg';
import theme from '../../../util/materialTheme';
import {
  getProductsList,
} from '../../../preventiveMaintenance/ppmService';
import '../../../preventiveMaintenance/preventiveMaintenance.scss';
import {
  getAllowedCompanies, getArrayFromValuesById,
  getColumnArrayById, generateArrayFromValue,
  generateErrorMessage, integerKeyPress,
  truncate, decimalKeyPressDown,
} from '../../../util/appUtils';
import { AddThemeColor } from '../../../themes/theme';
import { getMeasures, getStockLocations } from '../../../purchase/purchaseService';
import { getAuditExists } from '../../inventoryService';
import SearchModalMultiple from './searchModalMultiple';
import DialogHeader from '../../../commonComponents/dialogHeader';
import { getNewRequestValArray } from '../utils/utils';

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

const ProductAddForm = (props) => {
  const {
    productValues,
    setFieldValue,
  } = props;
  const { values: formValues } = useFormikContext();
  const {
    line_ids,
    location_id,
  } = formValues;
  const dispatch = useDispatch();
  const [partsData, setPartsData] = useState(productValues);
  const [productOptions, setProductOptions] = useState([]);
  const [uomOptions, setUomOptions] = useState([]);
  const [partsAdd, setPartsAdd] = useState(false);
  const [partsVal, setPartsVal] = useState(false);
  const [partId, setPartId] = useState(false);
  const [partIndex, setPartIndex] = useState(false);
  const [openId, setOpen] = useState('');
  const [productKeyword, setProductKeyword] = useState('');
  const [uomKeyword, setUomKeyword] = useState('');
  const [uomId, setUom] = useState('');
  const [locId, setLoc] = useState('');
  const [locKeyword, setLocKeyword] = useState('');
  const [locOptions, setLocOptions] = useState([]);

  const [extraModal, setExtraModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [placeholderName, setPlaceholder] = useState('');
  const [columns, setColumns] = useState(['id', 'name']);
  const [arrayList, setArrayList] = useState([]);
  const [arrayIndex, setArrayIndex] = useState(0);
  const [quantityModal, setQuantityModal] = useState(false);

  const classes = useStyles();

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const {
    productInfo,
  } = useSelector((state) => state.ppm);
  const { auditExistsInfo } = useSelector((state) => state.inventory);
  const { measuresInfo, stockLocations } = useSelector((state) => state.purchase);

  /* useEffect(() => {
    if ((adjustmentProducts && adjustmentProducts.data && adjustmentProducts.data.length) && (updateAdjustmentInfo && !updateAdjustmentInfo.err)) {
      const newArrData = adjustmentProducts.data.map((cl) => ({
        ...cl,
        id: cl.id,
        product_id: cl.product_id,
        product_id_ref: cl.product_id ? cl.product_id[0] : '',
        product_uom_id: cl.product_uom_id,
        product_uom_id_ref: cl.product_uom_id ? cl.product_uom_id[0] : '',
        location_id: cl.location_id,
        location_id_ref: cl.location_id ? cl.location_id[0] : '',
        theoretical_qty: numToFloat(cl.theoretical_qty),
        product_qty: numToFloat(cl.product_qty),
      }));
      setPartsData(newArrData);
    }
  }, [adjustmentProducts]); */

  useEffect(() => {
    if ((location_id && location_id.id) && line_ids && line_ids.length > 0) {
      const data = getNewRequestValArray(line_ids);
      dispatch(getAuditExists((location_id && location_id.id), data));
    }
  }, [location_id, line_ids, partsVal]);

  useEffect(() => {
    if (productInfo && productInfo.data && productInfo.data.length > 0) {
      const { data } = productInfo;
      setProductOptions(data.map((cl) => ({
        ...cl, value: cl.id, label: cl.name,
      })));
    }
  }, [productInfo]);

  useEffect(() => {
    if (measuresInfo && measuresInfo.data && measuresInfo.data.length > 0) {
      const { data } = measuresInfo;
      setUomOptions(data.map((cl) => ({
        ...cl, value: cl.id, label: cl.name,
      })));
    }
  }, [measuresInfo]);

  useEffect(() => {
    if (stockLocations && stockLocations.data && stockLocations.data.length > 0) {
      const { data } = stockLocations;
      setLocOptions(data.map((cl) => ({
        ...cl, value: cl.id, label: cl.name,
      })));
    }
  }, [stockLocations]);

  useEffect(() => {
    if (partsAdd) {
      setPartsData(partsData);
      const ids = getColumnArrayById(partsData && partsData.length ? partsData : [], 'product_id_ref');
      const data = getArrayFromValuesById(productInfo && productInfo.data ? productInfo.data : [], ids, 'id');
      setProductOptions(data.map((cl) => ({
        ...cl, value: cl.id, label: cl.name,
      })));
    }
  }, [partsAdd]);

  useEffect(() => {
    if (partsData) {
      setFieldValue('line_ids', partsData);
    }
  }, [partsData, partsAdd]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      dispatch(getProductsList(companies, appModels.PRODUCT, productKeyword, 'scrapproduct'));
    }
  }, [productKeyword]);

  /* useEffect(() => {
    if (userInfo && userInfo.data) {
      dispatch(getMeasures(appModels.UOM, uomKeyword));
    }
  }, [uomKeyword]); */

  useEffect(() => {
    if (productInfo && productInfo.data && productInfo.data.length > 0) {
      const data = generateArrayFromValue(productInfo.data, 'id', partId);
      const newData = partsData;
      if (data.length > 0 && newData[partIndex]) {
        newData[partIndex].theoretical_qty = data && data[0].qty_available ? data[0].qty_available : 0;
        setPartId(false);
        setPartIndex(false);
        setPartsAdd(Math.random());
        setPartsVal(Math.random());
      }
    }
  }, [partId]);

  const loadEmptyTd = () => {
    const newData = partsData && partsData.length ? partsData : [];
    newData.push({
      product_id: '', product_id_ref: '', product_uom_id: '', theoretical_qty: 0, product_qty: 0,
    });
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  const onProductKeywordChange = (event) => {
    setProductKeyword(event.target.value);
  };

  const removeData = (e, index) => {
    const newData = partsData;
    newData.splice(index, 1);
    setPartsData(newData);
    setPartsAdd(Math.random());
    setPartsVal(Math.random());
  };

  const onQuantityChange = (e, index) => {
    const newData = partsData;
    const qty = newData[index].theoretical_qty;

    // newData[index].product_qty = e.target.value <= parseFloat(qty) ? e.target.value : '';
    newData[index].product_qty = e.target.value ? (e.target.value) : 0;
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  const onChangeAdd = (e, index) => {
    const newData = partsData;
    const ogqty = newData[index].product_qty;

    newData[index].product_qty = parseFloat(ogqty) + 1;
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  const onChangeMinus = (e, index) => {
    const newData = partsData;
    const ogqty = newData[index].product_qty;

    newData[index].product_qty = parseFloat(ogqty) - 1;
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  const onChangeAvail = (index) => {
    const newData = partsData;
    const qty = newData[index].theoretical_qty;

    newData[index].product_qty = qty;
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  const onChangeMisMatch = (index) => {
    const newData = partsData;
    newData[index].product_qty = 1;
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  const onProductChange = (e, index) => {
    const newData = partsData;
    newData[index].product_id = [e.id, e.name];
    newData[index].product_id_ref = e.id;
    newData[index].product_uom_id = e && e.uom_id ? [e.uom_id[0], e.uom_id[1]] : [];
    setPartId(e.id);
    setPartIndex(index);
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  const onProductKeywordClear = (e, index) => {
    const newData = partsData;
    newData[index].product_id = '';
    setPartsData(newData);
    setPartsAdd(Math.random());
    setProductKeyword('');
    setOpen(false);
  };

  const showProductModal = (e, index) => {
    setModelValue(appModels.PRODUCT);
    setColumns(['id', 'name', 'uom_id', 'type', 'qty_available', 'brand', 'specification', 'categ_id']);
    setFieldName('line_ids');
    setModalName('Products List');
    setPlaceholder('Products');
    setCompanyValue(companies);
    setExtraModal(true);
    const requestProduts = line_ids && line_ids.length ? line_ids.filter((item) => !item.isRemove && item.product_id && item.product_id.length).map((pl) => ({
      id: pl.product_id && pl.product_id.length ? pl.product_id[0] : false,
      name: pl.product_id && pl.product_id.length ? pl.product_id[1] : false,
      product_qty: pl.product_qty,
      product_id_ref: pl.product_id_ref,
      product_uom_id: pl.product_uom_id,
      theoretical_qty: pl.theoretical_qty,
    })) : [];
    setArrayList(requestProduts);
    setExtraModal(true);
  };

  const showProductModalMulti = () => {
    setModelValue(appModels.PRODUCT);
    setColumns(['id', 'name', 'uom_id', 'type', 'qty_available', 'brand', 'unique_code', 'specification', 'categ_id']);
    setFieldName('line_ids');
    setModalName('Products List');
    setPlaceholder('Products');
    setCompanyValue(companies);
    setExtraModal(true);
    const requestProduts = line_ids && line_ids.length ? line_ids.filter((item) => item.product_id && item.product_id.length).map((pl) => ({
      id: pl.product_id && pl.product_id.length ? pl.product_id[0] : false,
      name: pl.product_id && pl.product_id.length ? pl.product_id[1] : false,
      product_qty: pl.product_qty,
      product_id_ref: pl.product_id_ref,
      product_uom_id: pl.product_uom_id,
      theoretical_qty: pl.theoretical_qty ? pl.theoretical_qty : 0,
      brand: pl.brand,
      unique_code: pl.unique_code,
      specification: pl.specification,
    })) : [];
    setArrayList(requestProduts);
    setExtraModal(true);
  };

  const onProductModalChange = (data) => {
    if (data && data.length) {
      const newArrData = data.map((cl) => ({
        product_id: [cl.id, cl.name],
        product_id_ref: cl.id,
        brand: cl.brand,
        unique_code: cl.unique_code,
        specification: cl.specification,
        product_uom_id: cl.parts_uom ? cl.parts_uom : cl.product_uom_id,
        theoretical_qty: cl.theoretical_qty !== undefined ? cl.theoretical_qty : cl.qty_on_hand,
        product_qty: cl.product_qty ? cl.product_qty : cl.qty_on_hand,
      }));
      setPartsData(newArrData);
      setPartsAdd(Math.random());
      setPartsVal(Math.random());
    }
  };

  const onQuantityModalChange = (index) => {
    /* const newData = partsData;
    const qty = newData[index].theoretical_qty;
    newData[index].product_qty = qty; */
    setArrayIndex(index);
    setQuantityModal(true);
  };

  function getBgClass(act, given) {
    let res = '';
    if (parseFloat(act) === parseFloat(given)) {
      res = '';
    } else if (given && parseFloat(act) > parseFloat(given)) {
      res = '';
    }
    return res;
  }

  function getTextClass(act, given) {
    let res = '';
    if (parseFloat(act) === parseFloat(given)) {
      res = '';
    } else if (given && parseFloat(act) > parseFloat(given)) {
      res = '';
    }
    return res;
  }

  return (
    <>
      <h5 className="mb-3 mt-3 ml-1">
        Products
        <span className="ml-1 text-danger">*</span>
        {auditExistsInfo && auditExistsInfo.loading && (
          <span className="ml-2 text-info font-tiny">Validating...</span>
        )}
      </h5>
      <Row>
        <Row className="ml-1">
          <Col xs={12} sm={12} md={12} lg={12}>
            {location_id && location_id.name && (
              <Typography
                sx={AddThemeColor({
                  font: 'normal normal medium 20px/24px Suisse Intl',
                  letterSpacing: '0.7px',
                  fontWeight: 800,
                  marginBottom: '8px'
                })}
              >
                Note:
                <br />
                1.Add Product(s) from
                {' '}
                {location_id.name}
              </Typography>
            )}
          </Col>
          <Col xs={12} sm={12} md={12} lg={12}>
            {location_id && (
              <div aria-hidden="true" className="font-weight-800 d-inline text-center text-lightblue cursor-pointer mt-1 mb-1" onClick={showProductModalMulti}>
                <img src={addIcon} className="mr-2 mb-1" alt="addequipment" height="15" width="15" />
                <span className="mr-2">Add a Product</span>
              </div>
            )}
          </Col>
          <Col xs={12} sm={12} md={12} lg={12}>
            {!location_id && (
              <div className="text-danger text-center d-inline font-size-13 font-weight-800">
                Location is required.
              </div>
            )}
          </Col>
        </Row>
        <Col xs={12} sm={12} md={12} lg={12} className="">
          {line_ids && line_ids.length > 0 && (
            <Table responsive id="spare-part" className="overflow-hidden">
              <thead className="bg-lightblue">
                <tr>
                  <th className="p-2 min-width-250 border-0">
                    Product Name
                  </th>
                  <th className="p-2 min-width-100 border-0">
                    On Hand
                  </th>
                  <th className="p-2 min-width-100 border-0 text-left">
                    Audited Quantity
                  </th>
                  <th className="p-2 min-width-160 border-0">
                    <span className="invisible">Del</span>
                  </th>
                  <th className="p-2 min-width-40 border-0">
                    <span className="invisible">Del</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {(line_ids.map((pl, index) => (
                  <>
                    {!pl.isRemove && (
                      <tr key={index} className={getBgClass(parseFloat(pl.theoretical_qty), parseFloat(pl.product_qty))}>
                        <td className="p-2 vertical-align-middle">
                          { /* <FormControl>
                        <Autocomplete
                          name="products"
                          className="bg-white min-width-300"
                          open={openId === index}
                          size="medium"
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
                          renderOption={(option) => (
                            <>
                              <p className="float-left m-0">
                                {truncate(option.name, 20)}
                                <br />
                                <span className="font-tiny">{option.brand ? truncate(option.brand, 20) : '-'}</span>
                              </p>
                              <p className="float-right mb-1">
                                {option.qty_available}
                                {'   '}
                                {option.uom_id && option.uom_id.length ? option.uom_id[1] : '-'}
                                <br />
                                <span className="font-tiny mt-2">
                                  {option.categ_id && option.categ_id.length ? truncate(option.categ_id[1], 20) : '-'}
                                </span>
                              </p>
                            </>
                          )}
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
                            </FormControl> */ }
                          <h6 className={`m-0 ${getTextClass(parseFloat(pl.theoretical_qty), parseFloat(pl.product_qty))}`}>
                            {pl.product_id && pl.product_id.length ? pl.product_id[1] : '-'}
                            {pl.unique_code && (
                              <>
                                {'  '}
                                |
                                <span className="ml-1">{pl.unique_code}</span>
                              </>
                            )}
                          </h6>
                          <span className={`font-tiny ${getTextClass(parseFloat(pl.theoretical_qty), parseFloat(pl.product_qty))}`}>
                            {pl.brand}
                            {' '}
                            {pl.specification ? '|' : ''}
                            {' '}
                          </span>
                          <span className={`ml-2 font-tiny ${getTextClass(parseFloat(pl.theoretical_qty), parseFloat(pl.product_qty))}`}>
                            {pl.specification}
                          </span>
                        </td>
                        <td className="p-2 vertical-align-middle text-left">
                          { /* <Input type="input" name="theoretical_qty" disabled value={pl.theoretical_qty} /> */}
                          <h6 className={getTextClass(parseFloat(pl.theoretical_qty), parseFloat(pl.product_qty))}>{pl.theoretical_qty}</h6>
                        </td>
                        <td className="p-2 vertical-align-middle text-left">
                          {(pl.theoretical_qty || pl.product_qty) && parseFloat(pl.theoretical_qty) === parseFloat(pl.product_qty) ? (
                            <Badge
                              color="success"
                              className="badge-text no-border-radius"
                              pill
                            >
                              Available
                            </Badge>
                          ) : pl.product_qty && ((parseFloat(pl.theoretical_qty) > parseFloat(pl.product_qty)) || (parseFloat(pl.theoretical_qty) < parseFloat(pl.product_qty))) ? (
                            <Badge
                              color="danger"
                              className="badge-text no-border-radius"
                              pill
                            >
                              {pl.product_qty}
                            </Badge>
                          ) : (
                            <span>
                              0
                            </span>
                          )}
                          { /* <Input type="input" name="product_qty" value={pl.product_qty} onChange={(e) => onQuantityChange(e, index)} /> */}
                        </td>
                        <td className="p-2 vertical-align-middle text-left">
                          <FontAwesomeIcon
                            className="cursor-pointer"
                            size="sm"
                            icon={faPencilAlt}
                            onClick={() => { onQuantityModalChange(index); }}
                          />
                          {parseFloat(pl.theoretical_qty) !== parseFloat(pl.product_qty) && (
                            <Button
                              type="button"
                              className="ml-3"
                              onClick={() => onChangeAvail(index)}
                              variant="contained"
                            >
                              Available
                            </Button>
                          )}
                        </td>
                        <td className="p-2 vertical-align-middle">
                          <span className="font-weight-400 d-inline-block" />
                          <FontAwesomeIcon
                            className={`mr-1 ml-1 cursor-pointer ${getTextClass(parseFloat(pl.theoretical_qty), parseFloat(pl.product_qty))}`}
                            size="sm"
                            icon={faTrashAlt}
                            onClick={(e) => { removeData(e, index); }}
                          />
                        </td>
                      </tr>
                    )}
                  </>
                )))}
                <tr>
                  <td colSpan="5" align="center">

                    {!location_id && (
                      <p className="m-0 text-danger text-center font-size-13 font-weight-800">
                        Location is required.
                      </p>
                    )}
                  </td>
                </tr>
              </tbody>
            </Table>
          )}
        </Col>
      </Row>

      <Dialog size="lg" fullWidth open={extraModal}>
        <DialogHeader rightButton title={modalName} imagePath={false} onClose={() => { setExtraModal(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <SearchModalMultiple
              modelName={modelValue}
              modalName={modalName}
              afterReset={() => { setExtraModal(false); }}
              onProductChange={onProductModalChange}
              fields={columns}
              company={companyValue}
              oldValues={arrayList}
              locationId={location_id}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>

      <Dialog maxWidth="lg" open={quantityModal}>
        <DialogHeader title="Enter Quantity" imagePath={false} onClose={() => { setQuantityModal(false); }} />
        <DialogContent>
          {partsData && partsData[arrayIndex] && (
            <>
              <DialogContentText id="alert-dialog-description">
                <div className="p-1 text-left font-14">
                  <Table responsive id="spare-part">
                    <thead className="bg-lightblue">
                      <tr>
                        <th className="p-2 min-width-100 border-0">
                          Product Name
                        </th>
                        <th className="p-2 min-width-160 border-0">
                          <h6 className="m-0">
                            {partsData[arrayIndex].product_id && partsData[arrayIndex].product_id.length ? partsData[arrayIndex].product_id[1] : '-'}
                            {partsData[arrayIndex].unique_code && (
                              <>
                                {'  '}
                                |
                                <span className="ml-1">{partsData[arrayIndex].unique_code}</span>
                              </>
                            )}
                          </h6>
                        </th>
                      </tr>
                      <tr>
                        <th className="p-2 min-width-100 border-0">
                          Product Brand
                        </th>
                        <th className="p-2 min-width-100 border-0">
                          <span className="font-tiny">
                            {partsData[arrayIndex].brand ? partsData[arrayIndex].brand : '-'}
                          </span>
                        </th>
                      </tr>
                      <tr>
                        <th className="p-2 min-width-100 border-0">
                          On Hand
                        </th>
                        <th className="p-2 min-width-100 border-0">
                          {partsData[arrayIndex].theoretical_qty}
                        </th>
                      </tr>
                      <tr>
                        <th className="p-2 min-width-100 border-0">
                          Product Specification
                        </th>
                        <th className="p-2 min-width-160 border-0">
                          <span className="font-tiny">
                            {partsData[arrayIndex].specification ? partsData[arrayIndex].specification : '-'}
                          </span>
                        </th>
                      </tr>
                    </thead>
                  </Table>
                  <div className="d-inline-flex content-center">
                    {partsData[arrayIndex].product_qty
                      ? <img src={minusIcon} alt="minusquantity" className="cursor-pointer mt-1" height="20" aria-hidden="true" onClick={(e) => onChangeMinus(e, arrayIndex)} />
                      : <img src={minusIconDisabled} className="mt-1" alt="minusquantity" height="20" aria-hidden="true" />}
                    <div className="ml-2 mr-2">
                      <Input
                        type="input"
                        onKeyDown={decimalKeyPressDown}
                        className="m-0 text-center"
                        name="product_qty"
                        defaultValue={partsData[arrayIndex].product_qty ? parseFloat(partsData[arrayIndex].product_qty).toFixed(2) : 0}
                        value={partsData[arrayIndex].product_qty}
                        maxLength={7}
                        onChange={(e) => onQuantityChange(e, arrayIndex)}
                      />
                    </div>
                    <img src={addCircleIcon} alt="addquantity" className="cursor-pointer mt-1" height="20" aria-hidden="true" onClick={(e) => onChangeAdd(e, arrayIndex)} />
                  </div>
                </div>
              </DialogContentText>
              <DialogActions>
                <Button
                  type="button"
                  variant="contained"
                  // disabled={!partsData[arrayIndex].product_qty}
                  onClick={() => { setQuantityModal(false); }}
                >
                  Update
                </Button>
              </DialogActions>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

ProductAddForm.propTypes = {
  productValues: PropTypes.oneOfType([PropTypes.array]).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default ProductAddForm;
