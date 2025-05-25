/* eslint-disable camelcase */
/* eslint-disable comma-dangle */
/* eslint-disable react/no-array-index-key */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import {
  Row, Col, Table, Input,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { makeStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';
import {
  TextField, FormHelperText
} from '@material-ui/core';

import { FormikAutocomplete } from '@shared/formFields';

import addIcon from '@images/icons/plusCircleBlue.svg';

import {
  detectMob, decimalKeyPressDown, getColumnArrayByIdMulti, getArrayFromValuesById
} from '../util/appUtils';

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

const PantryProducts = (props) => {
  const {
    partsData,
    setPartsData,
    setFieldValue,
    pantryProducts,
    pantryId,
  } = props;

  const isMobileView = detectMob();

  const classes = useStyles();

  const [partsAdd, setPartsAdd] = useState(false);

  const [openId, setOpen] = useState('');
  const [productOptions, setProductOptions] = useState([]);

  useEffect(() => {
    if (partsAdd) {
      setPartsData(partsData);
    }
  }, [partsAdd]);

  useEffect(() => {
    setPartsData([]);
  }, [pantryId]);

  function isProductsNotValid(data) {
    let res = false;
    console.log(data);
    if (data && data.length) {
      const fData = data.filter((item) => !(item.product_id && item.product_id.name) || !(item.ordered_qty));
      console.log(fData);
      if (fData && fData.length) {
        res = true;
      } else {
        const fData1 = data.filter((item) => (item.product_id && item.product_id.minimum_order_qty && parseInt(item.product_id.minimum_order_qty) > parseInt(item.ordered_qty)));
        console.log(fData1);
        if (fData1 && fData1.length) {
          res = true;
        }
      }
    } else {
      res = true;
    }
    return res;
  }

  useEffect(() => {
    if (partsData) {
      setFieldValue('is_valid_products', isProductsNotValid(partsData) ? '' : 'yes');
    }
  }, [partsData, partsAdd]);

  useEffect(() => {
    if (pantryProducts && pantryProducts.length > 0) {
      const ids = getColumnArrayByIdMulti(partsData && partsData.length ? partsData : [], 'product_id', 'id');
      const data = getArrayFromValuesById(pantryProducts, ids, 'id');
      if (data && data.length > 0) {
        setProductOptions(data);
      } else {
        setProductOptions([]);
      }
    } else {
      setProductOptions([]);
    }
  }, [pantryProducts, partsAdd]);

  const loadEmptyTd = () => {
    const newData = partsData && partsData.length ? partsData : [];
    newData.push({
      product_id: {}, ordered_qty: 1, notes_from_employee: '',
    });
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  const removeData = (e, index) => {
    const newData = partsData;
    newData.splice(index, 1);
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  const onUnitChange = (e, index) => {
    const newData = partsData;
    const prHand = newData[index].product_id.maximum_order_qty;
    console.log(prHand);
    newData[index].ordered_qty = e.target.value && e.target.value >= 1 && parseFloat(prHand) >= e.target.value ? e.target.value : '';
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  const onProductChange = (e, index) => {
    const newData = partsData;
    newData[index].product_id = e;
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  const onDescChange = (e, index) => {
    const newData = partsData;
    newData[index].notes_from_employee = e.target.value;
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  const onProductKeywordClear = (e, index) => {
    const newData = partsData;
    newData[index].product_id = {};
    // newData[index].product_uom_ref = '';
    setPartsData(newData);
    setPartsAdd(Math.random());
    setOpen(false);
  };

  return (
    <Row>
      <Col xs={12} sm={12} md={12} lg={12} className="">
        {isMobileView ? (
          <>
            <div className="calendar-form-content thin-scrollbar">
              {partsData && partsData.length > 0 && (
              <p className="text-info font-weight-800 mt-2">
                Total Products:
                {'  '}
                {partsData.length}
              </p>
              )}
              {(partsData && partsData.length > 0 && partsData.map((pl, index) => (
                <div className="p-2 border-1px-light-card mb-3">
                  <FontAwesomeIcon className="mr-1 ml-1 cursor-pointer float-right" size="sm" icon={faTrashAlt} onClick={(e) => { removeData(e, index); }} />
                  <Row className="content-center">
                    <Col md="12" sm="6" lg="12" xs="6">
                      <span>Product </span>
                    </Col>
                    <Col md="12" sm="6" lg="12" xs="6">
                      <FormikAutocomplete
                        name="products"
                        className="bg-white"
                        open={openId === index}
                        size="small"
                        onOpen={() => {
                          setOpen(index);
                        }}
                        onClose={() => {
                          setOpen('');
                        }}
                        classes={{
                          option: classes.option,
                        }}
                        value={pl.product_id && pl.product_id.name ? pl.product_id.name : ''}
                        getOptionSelected={(option, value) => (value.length > 0 ? option.name === value.name : '')}
                        getOptionLabel={(option) => (typeof option === 'string' ? option : `${option.name}`)}
                        options={productOptions}
                        renderOption={(option) => (

                          <>
                            <p className="float-left m-0">
                              {option.name}
                              <br />
                              {option.uom_id && option.uom_id.name && (
                              <span className="font-tiny">{option.uom_id.name}</span>

                              )}
                            </p>
                            <p className="font-tiny float-right m-0">
                              {parseFloat(option.minimum_order_qty).toFixed(2)}
                              <br />
                              <span className="font-tiny mt-2">
                                {parseFloat(option.maximum_order_qty).toFixed(2)}
                              </span>
                            </p>
                          </>

                        )}
                        onChange={(e, data) => { onProductChange(data, index); }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            className={pl.product_id && pl.product_id.name ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                            placeholder="Select"
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <InputAdornment position="end">
                                  {pl.product_id && pl.product_id.name && (
                                  <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={(e, data) => { onProductKeywordClear(data, index); }}
                                  >
                                    <BackspaceIcon fontSize="small" />
                                  </IconButton>
                                  )}
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      />
                    </Col>
                    <Col md="12" sm="6" lg="12" xs="6">
                      <span>Quantity</span>
                    </Col>
                    <Col md="12" sm="6" lg="12" xs="6">
                      <Input type="text" className="m-0 small-form-control" autoComplete="off" maxLength="7" onKeyDown={decimalKeyPressDown} name="ordered_qty" value={pl.ordered_qty} onChange={(e) => onUnitChange(e, index)} />
                      {pl.ordered_qty && pl.product_id && pl.product_id.minimum_order_qty && parseFloat(pl.ordered_qty) < parseFloat(pl.product_id.minimum_order_qty) && (
                      <FormHelperText className="form-helpertext">
                        <span>Entered quantity was less than the minimum quantity.</span>
                      </FormHelperText>
                      )}
                    </Col>
                    { /* <Col md="12" sm="12" lg="12" xs="12" className="mb-2 mt-3">
                      <Input type="textarea" name="notes_from_employee" placeholder="Notes" value={pl.notes_from_employee} maxLength={300} onChange={(e) => onDescChange(e, index)} rows={2} />

                    </Col> */ }
                  </Row>
                </div>
              )))}
            </div>
            {productOptions && productOptions.length > 0 && (
            <div aria-hidden="true" className="font-weight-800 text-lightblue cursor-pointer mt-2 mb-1 text-center" onClick={loadEmptyTd}>
              <img src={addIcon} className="mr-2 mb-1" alt="addequipment" height="15" width="15" />
              <span className="">Add Product</span>
            </div>
            )}
          </>
        ) : (
          <div className="calendar-form-content thin-scrollbar">
            {partsData && partsData.length > 0 && (
            <p className="text-info font-weight-800 mt-2">
              Total Products:
                {'  '}
              {partsData.length}
            </p>
            )}
            <Table responsive id="spare-part">
              <thead className="bg-lightblue">
                <tr>
                  <th className="p-2 min-width-160 border-0">
                    Product
                    {' '}
                    <span className="text-danger ml-1">*</span>
                  </th>
                  <th className="p-2 min-width-160 border-0">
                    Quantity
                    {' '}
                    <span className="text-danger ml-1">*</span>
                  </th>
                  { /* <th className="p-2 min-width-160 border-0">
                    Notes
        </th> */ }
                  <th className="p-2 width-90 border-0">
                    Manage
                  </th>
                </tr>
              </thead>
              <tbody>
                {(partsData && partsData.length > 0 && partsData.map((pl, index) => (
                  <tr key={index}>
                    <td className="p-0 product-form-table">
                      <FormikAutocomplete
                        name="products"
                        className="bg-white min-width-200"
                        open={openId === index}
                        size="small"
                        onOpen={() => {
                          setOpen(index);
                        }}
                        onClose={() => {
                          setOpen('');
                        }}
                        classes={{
                          option: classes.option,
                        }}
                        value={pl.product_id && pl.product_id.name ? pl.product_id.name : ''}
                        getOptionSelected={(option, value) => (value.length > 0 ? option.name === value.name : '')}
                        getOptionLabel={(option) => (typeof option === 'string' ? option : `${option.name}`)}
                        options={productOptions}
                        renderOption={(option) => (

                          <>
                            <p className="float-left m-0">
                              {option.name}
                              <br />
                              {option.uom_id && option.uom_id.name && (
                              <span className="font-tiny">{option.uom_id.name}</span>

                              )}
                            </p>
                            <p className="font-tiny float-right m-0">
                              {parseFloat(option.minimum_order_qty).toFixed(2)}
                              <br />
                              <span className="font-tiny mt-2">
                                {parseFloat(option.maximum_order_qty).toFixed(2)}
                              </span>
                            </p>
                          </>

                        )}
                        onChange={(e, data) => { onProductChange(data, index); }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            className={pl.product_id && pl.product_id.name ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                            placeholder="Select"
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <InputAdornment position="end">
                                  {pl.product_id && pl.product_id.name && (
                                  <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={(e, data) => { onProductKeywordClear(data, index); }}
                                  >
                                    <BackspaceIcon fontSize="small" />
                                  </IconButton>
                                  )}
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      />

                    </td>
                    <td className="p-2 product-form-table">
                      <Input type="text" className="m-0 small-form-control" autoComplete="off" maxLength="7" onKeyDown={decimalKeyPressDown} name="ordered_qty" value={pl.ordered_qty} onChange={(e) => onUnitChange(e, index)} />
                      {pl.ordered_qty && pl.product_id && pl.product_id.minimum_order_qty && parseFloat(pl.ordered_qty) < parseFloat(pl.product_id.minimum_order_qty) && (
                      <FormHelperText className="form-helpertext">
                        <span>Entered Quanity was less than minimum quantity</span>
                      </FormHelperText>
                      )}
                    </td>
                    { /* <td className="p-2 product-form-table">
                      <Input type="textarea" name="notes_from_employee" value={pl.notes_from_employee} maxLength={300} onChange={(e) => onDescChange(e, index)} rows={1} />
                    </td> */ }
                    <td>
                      <span className="font-weight-400 d-inline-block" />
                      <FontAwesomeIcon className="mr-1 ml-1 cursor-pointer" size="sm" icon={faTrashAlt} onClick={(e) => { removeData(e, index); }} />
                    </td>
                  </tr>
                )))}
                {productOptions && productOptions.length > 0 && (
                <tr>
                  <td colSpan="3" className="text-center">
                    <div aria-hidden="true" className="font-weight-800 text-lightblue  mt-1 mb-1">
                      <img aria-hidden src={addIcon} className="mr-2 cursor-pointer mb-1" alt="addequipment" height="15" width="15" onClick={loadEmptyTd} />
                      <span aria-hidden onClick={loadEmptyTd} className="mr-5 cursor-pointer">Add Product</span>
                    </div>
                  </td>
                </tr>
                )}
              </tbody>
            </Table>
          </div>
        )}
      </Col>
    </Row>
  );
};

export default PantryProducts;
