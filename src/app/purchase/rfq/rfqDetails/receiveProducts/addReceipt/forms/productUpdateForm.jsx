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
import {
  CircularProgress, FormHelperText, FormControl,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { Typography, TextField, } from "@mui/material";

import { getProductsList, getPartsData } from '../../../../../../preventiveMaintenance/ppmService';
import { getMoveProducts } from '../../../../../purchaseService';
import '../../../../../../preventiveMaintenance/preventiveMaintenance.scss';
import {
  getArrayFromValuesById, getColumnArrayByIdWithArray,
  generateErrorMessage, getAllowedCompanies, getFloatValue, decimalKeyPressDown,
} from '../../../../../../util/appUtils';
import { AddThemeColor } from '../../../../../../themes/theme';

const appModels = require('../../../../../../util/appModels').default;

const ProductUpdateForm = (props) => {
  const {
    setFieldValue,
  } = props;

  const dispatch = useDispatch();
  const [partsData, setPartsData] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [openId, setOpen] = useState('');
  const [productKeyword, setProductKeyword] = useState('');
  const [partsAdd, setPartsAdd] = useState(false);
  const [partId, setPartId] = useState(false);

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const { productInfo, partsSelected } = useSelector((state) => state.ppm);
  const {
    moveProducts, transferDetails,
  } = useSelector((state) => state.purchase);

  useEffect(() => {
    if (transferDetails && transferDetails.data) {
      const ids = transferDetails.data.length > 0 ? transferDetails.data[0].move_ids_without_package : [];
      dispatch(getMoveProducts(ids, appModels.STOCKMOVE));
    }
  }, [transferDetails]);

  useEffect(() => {
    if (moveProducts && moveProducts.data) {
      setPartsData(moveProducts.data);
      dispatch(getPartsData(moveProducts.data));
    }
  }, [moveProducts]);

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
      setFieldValue('move_ids_without_package', partsSelected);
    } else {
      setPartsData([]);
      setFieldValue('move_ids_without_package', []);
    }
  }, [partsSelected]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      dispatch(getProductsList(companies, appModels.PRODUCT, productKeyword));
    }
  }, [userInfo, openId, productKeyword]);

  const onUnitChange = (e, index) => {
    const newData = partsData;
    newData[index].quantity_done = e.target.value;
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  const onProductChange = (e, index) => {
    const newData = partsData;
    newData[index].product_id = [e.id, e.name];
    newData[index].name = e.name;
    setPartId(e.id);
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  const onProductKeywordChange = (event) => {
    setProductKeyword(event.target.value);
  };

  const states = transferDetails && transferDetails.data && transferDetails.data.length > 0 ? transferDetails.data[0].state : '';

  return (
    <>
      <Typography
        sx={AddThemeColor({
          font: "normal normal medium 20px/24px Suisse Intl",
          letterSpacing: "0.7px",
          fontWeight: 500,
          marginTop: "10px",
          paddingBottom: '4px'
        })}
      >
        Products
      </Typography>
      <Row>
        <Col xs={12} sm={12} md={12} lg={12}>
          <Table className="ml-2">
            <thead>
              <tr>
                <th className="p-2 min-width-200 border-0">
                  Product
                </th>
                <th className="p-2 min-width-100 border-0">
                  Initial Demand
                </th>
                <th className="p-2 min-width-100 border-0">
                  Reserved
                </th>
                <th className="p-2 min-width-100 border-0">
                  Done
                </th>
                <th className="p-2 min-width-100 border-0">
                  <span className="invisible">Del</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {(partsSelected && partsSelected.length > 0 && partsSelected.map((pl, index) => (
                <tr key={index} className="font-weight-400">
                  <td className="p-2">
                    <FormControl>
                      <Autocomplete
                        name="products"
                        className="bg-white min-width-200"
                        open={openId === index}
                        size="small"
                        disabled
                        onOpen={() => {
                          setOpen(index);
                          setProductKeyword('');
                        }}
                        onClose={() => {
                          setOpen('');
                          setProductKeyword('');
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
                            variant="standard"
                            label="Products"
                            className="without-padding"
                            placeholder="Search & Select"
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <>
                                  {(productInfo && productInfo.loading) && (openId === index) ? <CircularProgress color="inherit" size={20} /> : null}
                                  {params.InputProps.endAdornment}
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
                    <span>{pl.product_uom_qty ? getFloatValue(pl.product_uom_qty) : getFloatValue(0)}</span>
                  </td>
                  <td className="p-2">
                    <span>{pl.reserved_availability ? getFloatValue(pl.reserved_availability) : getFloatValue(0)}</span>
                  </td>
                  <td className="p-2">
                    <TextField
                      fullWidth
                      type="input"
                      name="quantity_done"
                      disabled={states === 'done' || states === 'cancel'}
                      autoComplete="off"
                      onKeyDown={decimalKeyPressDown}
                      value={pl.quantity_done}
                      onChange={(e) => onUnitChange(e, index)}
                    />
                  </td>
                </tr>
              )))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </>
  );
};

ProductUpdateForm.propTypes = {
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default ProductUpdateForm;
