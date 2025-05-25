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
} from 'reactstrap';
import { ThemeProvider, makeStyles } from '@material-ui/core/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { Autocomplete } from '@material-ui/lab';
import {
  TextField, CircularProgress, FormHelperText, FormControl,
} from '@material-ui/core';
import { useFormikContext } from 'formik';

import Loader from '@shared/loading';
import addIcon from '@images/icons/plusCircleBlue.svg';
import theme from '../../../util/materialTheme';
import {
  getProductsList,
} from '../../../preventiveMaintenance/ppmService';
import '../../../preventiveMaintenance/preventiveMaintenance.scss';
import {
  getAllowedCompanies, getArrayFromValuesById,
  getColumnArrayById, generateArrayFromValue,
  generateErrorMessage,
  numToFloat,
  truncate,
} from '../../../util/appUtils';
import { getMeasures, getStockLocations } from '../../../purchase/purchaseService';

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

const ProductsForm = (props) => {
  const {
    productValues,
    setFieldValue,
  } = props;
  const { values: formValues } = useFormikContext();
  const {
    line_ids
  } = formValues;
  const dispatch = useDispatch();
  const [partsData, setPartsData] = useState(productValues);
  const [productOptions, setProductOptions] = useState([]);
  const [uomOptions, setUomOptions] = useState([]);
  const [partsAdd, setPartsAdd] = useState(false);
  const [partId, setPartId] = useState(false);
  const [partIndex, setPartIndex] = useState(false);
  const [openId, setOpen] = useState('');
  const [productKeyword, setProductKeyword] = useState('');
  const [uomKeyword, setUomKeyword] = useState('');
  const [uomId, setUom] = useState('');
  const [locId, setLoc] = useState('');
  const [locKeyword, setLocKeyword] = useState('');
  const [locOptions, setLocOptions] = useState([]);

  const classes = useStyles();

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const {
    productInfo,
  } = useSelector((state) => state.ppm);
  const { adjustmentProducts, updateAdjustmentInfo, adjustmentDetail } = useSelector((state) => state.inventory);
  const { measuresInfo, stockLocations } = useSelector((state) => state.purchase);

  useEffect(() => {
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
        theoretical_qty: cl.theoretical_qty,
        product_qty: cl.product_qty,
      }));
      setPartsData(newArrData);
    }
  }, [adjustmentProducts]);

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
  }, [partsData]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      dispatch(getProductsList(companies, appModels.PRODUCT, productKeyword, 'inventory'));
    }
  }, [productKeyword]);

  /* useEffect(() => {
    if (userInfo && userInfo.data) {
      dispatch(getMeasures(appModels.UOM, uomKeyword));
    }
  }, [uomKeyword]); */

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const parentLocation = adjustmentDetail && adjustmentDetail.data && adjustmentDetail.data.length > 0 && adjustmentDetail.data[0].location_id ? adjustmentDetail.data[0].location_id[0] : false;
      dispatch(getStockLocations(companies, appModels.STOCKLOCATION, locKeyword, 'inventory', parentLocation));
    }
  }, [locKeyword]);

  useEffect(() => {
    if (productInfo && productInfo.data && productInfo.data.length > 0) {
      const data = generateArrayFromValue(productInfo.data, 'id', partId);
      const newData = partsData;
      if (data.length > 0 && newData[partIndex]) {
        newData[partIndex].theoretical_qty = data && data[0].qty_available ? data[0].qty_available : 0;
        setPartId(false);
        setPartIndex(false);
        setPartsAdd(Math.random());
      }
    }
  }, [partId]);

  const loadEmptyTd = () => {
    const newData = partsData && partsData.length ? partsData : [];
    newData.push({
      id: false, product_id: '', product_uom_id: '', product_uom_id_ref: '', location_id_ref: '', product_id_ref: '', location_id: '', theoretical_qty: 0, product_qty: 0,
    });
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  const onProductKeywordChange = (event) => {
    setProductKeyword(event.target.value);
  };

  const onUomKeyWordChange = (event) => {
    setUomKeyword(event.target.value);
  };

  const onLocationKeyWordChange = (event) => {
    setLocKeyword(event.target.value);
  };

  const removeData = (e, index) => {
    const newData = partsData;
    const { id } = newData[index];
    if (id) {
      newData[index].isRemove = true;
      setPartsData(newData);
      setPartsAdd(Math.random());
    } else {
      newData.splice(index, 1);
      setPartsData(newData);
      setPartsAdd(Math.random());
    }
  };

  const onQuantityChange = (e, index) => {
    const newData = partsData;
    newData[index].product_qty = e.target.value;
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  const onProductChange = (e, index) => {
    const newData = partsData;
    newData[index].product_id = [e.id, e.name];
    newData[index].product_id_ref = e.id;
    newData[index].product_uom_id = e && e.uom_id ? [e.uom_id[0], e.uom_id[1]] : [];
    newData[index].product_uom_id_ref = e && e.uom_id ? e.uom_id[0] : '';
    setPartId(e.id);
    setPartIndex(index);
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  const onUomChange = (e, index) => {
    const newData = partsData;
    newData[index].product_uom_id = [e.id, e.name];
    newData[index].product_uom_id_ref = e.id;
    setPartId(e.id);
    setPartIndex(index);
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  const onLocChange = (e, index) => {
    const newData = partsData;
    newData[index].location_id = [e.id, e.name];
    newData[index].location_id_ref = e.id;
    setPartId(e.id);
    setPartIndex(index);
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  const isDisabled = adjustmentDetail && adjustmentDetail.data && adjustmentDetail.data.length && adjustmentDetail.data[0].state === 'confirm' && adjustmentDetail.data[0].filter !== 'partial';

  const checkOneProduct = adjustmentDetail && (adjustmentDetail.data && adjustmentDetail.data.length > 0 && adjustmentDetail.data[0].filter === 'product')
    && (adjustmentDetail.data[0].line_ids && adjustmentDetail.data[0].line_ids.length === 1);

  return (
    <>
      <h5 className="mb-3 mt-3 ml-3">Products</h5>
      <ThemeProvider theme={theme}>
        <Row>
          <Col xs={12} sm={12} md={12} lg={12} className="ml-3">
            <Table responsive id="spare-part" className="overflow-hidden">
              <thead className="bg-lightblue">
                <tr>
                  <th className="p-2 min-width-160 border-0">
                    Name
                  </th>
                  <th className="p-2 min-width-160 border-0">
                    Stock Quantity
                  </th>
                  <th className="p-2 min-width-160 border-0">
                    Audited Quantity
                  </th>
                  <th className="p-2 min-width-40 border-0">
                    <span className="invisible">Del</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {(line_ids && line_ids.length > 0 && line_ids.map((pl, index) => (
                  <>
                    {!pl.isRemove && (
                      <tr key={index}>
                        <td className="p-2">
                          <FormControl>
                            <Autocomplete
                              name="products"
                              className="bg-white min-width-300"
                              open={openId === index}
                              size="small"
                              disabled={isDisabled}
                              classes={{
                                option: classes.option,
                              }}
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
                        { /* <td className="p-2">
                          <FormControl>
                            <Autocomplete
                              name="uom"
                              className="bg-white min-width-200"
                              open={uomId === index}
                              size="small"
                              disabled
                              onOpen={() => {
                                setUom(index);
                                setUomKeyword('');
                              }}
                              onClose={() => {
                                setUom('');
                                setUomKeyword('');
                              }}
                              value={pl.product_uom_id && pl.product_uom_id.length ? pl.product_uom_id[1] : ''}
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
                        </td>
                        <td className="p-2">
                          <FormControl>
                            <Autocomplete
                              name="uom"
                              className="bg-white min-width-200"
                              open={locId === index}
                              size="small"
                              disabled={isDisabled}
                              onOpen={() => {
                                setLoc(index);
                                setLocKeyword('');
                              }}
                              onClose={() => {
                                setLoc('');
                                setLocKeyword('');
                              }}
                              value={pl.location_id && pl.location_id.length ? pl.location_id[1] : ''}
                              getOptionSelected={(option, value) => (value.length > 0 ? option.label === value.label : '')}
                              getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                              options={locOptions}
                              onChange={(e, data) => { onLocChange(data, index); }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  onChange={onLocationKeyWordChange}
                                  variant="outlined"
                                  className="without-padding"
                                  placeholder="Search & Select"
                                  InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                      <>
                                        {(stockLocations && stockLocations.loading) && (locId === index) ? <CircularProgress color="inherit" size={20} /> : null}
                                        {params.InputProps.endAdornment}
                                      </>
                                    ),
                                  }}
                                />
                              )}
                            />
                            {((stockLocations && stockLocations.err) && (locId === index)) && (
                              <FormHelperText><span className="text-danger">{generateErrorMessage(stockLocations)}</span></FormHelperText>
                            )}
                          </FormControl>
                            </td> */ }
                        <td className="p-2 vertical-align-middle">
                          <Input type="input" name="theoretical_qty" disabled value={pl.theoretical_qty} />
                        </td>
                        <td className="p-2 vertical-align-middle">
                          <Input type="input" name="product_qty" value={pl.product_qty} onChange={(e) => onQuantityChange(e, index)} />
                        </td>
                        <td>
                          <span className="font-weight-400 d-inline-block" />
                          <FontAwesomeIcon className="mr-1 ml-1 cursor-pointer" size="sm" icon={faTrashAlt} onClick={(e) => { removeData(e, index); }} />
                        </td>
                      </tr>
                    )}
                  </>
                )))}
                {!checkOneProduct && (
                  <tr>
                    <td colSpan="4" align="center">
                      <div aria-hidden="true" className="font-weight-800 d-inline text-center text-lightblue cursor-pointer mt-1 mb-1" onClick={loadEmptyTd}>
                        <img src={addIcon} className="mr-2 mb-1" alt="addequipment" height="15" width="15" />
                        <span className="mr-2">Add a Product</span>
                      </div>
                    </td>
                  </tr>
                )}
                {adjustmentProducts && adjustmentProducts.loading && (
                  <div className="p-3" data-testid="loading-case">
                    <Loader />
                  </div>
                )}
              </tbody>
            </Table>
          </Col>
        </Row >
      </ThemeProvider >
    </>
  );
};

ProductsForm.propTypes = {
  productValues: PropTypes.oneOfType([PropTypes.array]).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default ProductsForm;
