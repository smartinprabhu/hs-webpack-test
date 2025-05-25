/* eslint-disable radix */
/* eslint-disable camelcase */
/* eslint-disable comma-dangle */
/* eslint-disable react/no-array-index-key */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import {
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  CircularProgress,
  FormControl,
  FormHelperText,
  TextField,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { useFormikContext } from 'formik';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Input,
  Table
} from 'reactstrap';

import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import { Box, Dialog, DialogContent, DialogContentText, Typography } from "@mui/material";
import { AddThemeColor } from '../../themes/theme';
import DialogHeader from '../../commonComponents/dialogHeader';
import { IoCloseOutline } from 'react-icons/io5';

import addIcon from '@images/icons/plusCircleBlue.svg';
import Loader from '@shared/loading';
import {
  getProductsList,
} from '../../preventiveMaintenance/ppmService';
import {
  decimalKeyPressDown,
  generateErrorMessage,
  getAllowedCompanies, getArrayFromValuesById,
  getColumnArrayById,
  numToFloat,
} from '../../util/appUtils';
import SearchModalUnique from './searchModalUnique';

const appModels = require('../../util/appModels').default;

const ProductForm = (props) => {
  const {
    editId,
    setFieldValue,
    setDataChanged,
    partsData,
    setPartsData,
  } = props;
  const { values: formValues } = useFormikContext();
  const {
    order_lines
  } = formValues;
  const dispatch = useDispatch();
  const [productOptions, setProductOptions] = useState([]);
  const [partsAdd, setPartsAdd] = useState(false);
  const [openId, setOpen] = useState('');
  const [productKeyword, setProductKeyword] = useState('');

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

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const {
    productInfo,
  } = useSelector((state) => state.ppm);
  const { pantryDetails, updateOrderInfo, pantryOrderLines } = useSelector((state) => state.pantry);

  useEffect(() => {
    if (editId && (pantryDetails && pantryDetails.data && pantryDetails.data.length && pantryDetails.data[0].order_lines && pantryDetails.data[0].order_lines.length)
    && (updateOrderInfo && !updateOrderInfo.err)) {
      const newArrData = pantryDetails.data[0].order_lines.map((cl) => ({
        ...cl,
        id: cl.id,
        product_id: cl.product_id && cl.product_id.id ? [cl.product_id.id, cl.product_id.name] : false,
        product_id_ref: cl.product_id && cl.product_id.id ? cl.product_id.id : '',
        ordered_qty: numToFloat(cl.ordered_qty),
        confirmed_qty: numToFloat(cl.confirmed_qty),
        delivered_qty: numToFloat(cl.delivered_qty),
        reason_from_pantry: cl.reason_from_pantry ? cl.reason_from_pantry : '',
        notes_from_employee: cl.notes_from_employee ? cl.notes_from_employee : '',
      }));
      setPartsData(newArrData);
    }
  }, [editId]);

  useEffect(() => {
    if (productInfo && productInfo.data && productInfo.data.length > 0) {
      const { data } = productInfo;
      setProductOptions(data.map((cl) => ({
        ...cl, value: cl.id, label: cl.name,
      })));
    }
  }, [productInfo]);

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
    setDataChanged(Math.random());
  }, [order_lines, setPartsData, partsAdd]);

  useEffect(() => {
    if (partsData) {
      setFieldValue('order_lines', partsData);
    }
  }, [partsData]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      dispatch(getProductsList(companies, appModels.PRODUCT, productKeyword, 'pantry'));
    }
  }, [productKeyword]);

  /* useEffect(() => {
    if (productInfo && productInfo.data && productInfo.data.length > 0) {
      const data = generateArrayFromValue(productInfo.data, 'id', partId);
      const newData = partsData;
      if (data.length > 0 && partIndex) {
        newData[partIndex].theoretical_qty = data && data[0] && data[0].theoretical_qty ? numToFloat(data[0].theoretical_qty) : numToFloat(0);
        setPartId(false);
        setPartIndex(false);
        setPartsAdd(Math.random());
      }
    }
  }, [partId]); */

  const loadEmptyTd = () => {
    const newData = partsData && partsData.length ? partsData : [];
    newData.push({
      id: false, product_id: '', ordered_qty: numToFloat(1), confirmed_qty: numToFloat(0), delivered_qty: numToFloat(0), product_id_ref: '', reason_from_pantry: '', notes_from_employee: '',
    });
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  const onProductKeywordChange = (event) => {
    setProductKeyword(event.target.value);
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

  const onQuantityChange = (e, index, field) => {
    const newData = partsData;
    const ordQty = newData[index].ordered_qty;
    const cnQty = newData[index].confirmed_qty;
    if (field === 'ordered_qty') {
      newData[index][field] = e.target.value && e.target.value >= 1 ? e.target.value : '';
    } else if (field === 'confirmed_qty') {
      newData[index][field] = e.target.value && e.target.value <= parseInt(ordQty) ? e.target.value : '';
    } else if (field === 'delivered_qty') {
      newData[index][field] = e.target.value && e.target.value <= parseInt(cnQty) ? e.target.value : '';
    } else {
      newData[index][field] = e.target.value;
    }
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  const onProductChange = (e, index) => {
    const newData = partsData;
    newData[index].product_id = [e.id, e.name];
    newData[index].product_id_ref = e.id;
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  const onProductKeywordClear = (e, index) => {
    const newData = partsData;
    newData[index].product_id = '';
    newData[index].product_id_ref = '';
    setPartsData(newData);
    setPartsAdd(Math.random());
    setOpen(false);
  };

  const showProductModal = (e, index) => {
    setModelValue(appModels.PRODUCT);
    setFieldName('order_lines');
    setModalName('Products');
    setCompanyValue(userInfo && userInfo.data ? userInfo.data.company.id : '');
    setColumns(['id', 'name', 'uom_id', 'type', 'qty_available']);
    setOtherFieldName('is_pantry_item');
    setOtherFieldValue(true);
    setArrayList(partsData);
    setArrayIndex(index);
    setExtraModal(true);
  };

  const detailData = pantryDetails && (pantryDetails.data && pantryDetails.data.length > 0) ? pantryDetails.data[0].state : '';

  const isConfirmNotEditable = (!editId) || (detailData === 'Draft') || ((detailData === 'Confirmed') || (detailData === 'Delivered') || (detailData === 'Cancelled'));
  const isOrderNotEditable = ((detailData === 'Ordered') || (detailData === 'Confirmed') || (detailData === 'Delivered') || (detailData === 'Cancelled'));
  const isDeliverNotEditable = (!editId) || (detailData === 'Ordered') || (detailData === 'Draft') || ((detailData === 'Delivered') || (detailData === 'Cancelled'));
  const isRemoveDisable = (!editId) || (detailData === 'Draft');
  //const isRemoveDisable = (!editId) || (detailData === 'Ordered') || ((detailData === 'Confirmed') || (detailData === 'Delivered') || (detailData === 'Cancelled'));

  return (
    <>
      <Box
        sx={{
          marginTop: '20px',
          width: '100%',
        }}
      >
        <Typography
          sx={AddThemeColor({
            font: 'normal normal medium 20px/24px Suisse Intl',
            letterSpacing: '0.7px',
            fontWeight: 500,
            marginBottom: '10px',
            paddingBottom: '4px'
          })}
        >
          Products
        </Typography>
        {pantryOrderLines && pantryOrderLines.loading && (
        <div className="p-3" data-testid="loading-case">
          <Loader />
        </div>
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
                Ordered Quantity
                <span className="text-danger ml-1">*</span>
              </th>
              <th className="p-2 min-width-160 border-0">
                Confirmed Quantity
              </th>
              <th className="p-2 w-25 border-0">
                Delivered Quantity
              </th>
              <th className="p-2 min-width-160 border-0">
                Reason from Pantry
              </th>
              <th className="p-2 min-width-160 border-0">
                Notes from Employee
              </th>
              <th className="p-2 min-width-160 border-0">
                <span className="invisible">Del</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="7" className="text-left">
                <div aria-hidden="true" className="font-weight-800 text-lightblue cursor-pointer mt-1 mb-1" onClick={loadEmptyTd}>
                  <img src={addIcon} className="mr-2 mb-1" alt="addequipment" height="15" width="15" />
                  <span className="mr-5">Add a Line</span>
                </div>
              </td>
            </tr>
            {(order_lines && order_lines.length > 0 && order_lines.map((pl, index) => (
              <>
                {!pl.isRemove && (
                <tr key={index}>
                  <td className="pb-2 pr-2 pl-2 pt-1">
                    <FormControl>
                      <Autocomplete
                        name="products_new"
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
                            value={productKeyword}
                            className={pl.product_id && pl.product_id.length ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                            placeholder="Search & Select"
                            InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                <>
                                  {(productInfo && productInfo.loading) && (openId === index) ? <CircularProgress color="inherit" size={20} /> : null}
                                  <InputAdornment position="end">
                                    {(pl.product_id && pl.product_id.length > 0 && pl.product_id[0]) && (
                                    <IconButton
                                      aria-label="toggle password visibility"
                                      onClick={(e, data) => { onProductKeywordClear(data, index); }}
                                    >
                                      <IoCloseOutline  size={20} fontSize="small" />
                                    </IconButton>
                                    )}
                                    <IconButton
                                      aria-label="toggle search visibility"
                                      onClick={(e, data) => { showProductModal(data, index); }}
                                    >
                                      <SearchIcon size={20} fontSize="small" />
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
                    <Input
                      type="text"
                      onKeyPress={decimalKeyPressDown}
                      disabled={isOrderNotEditable}
                      name="ordered_qty"
                      value={pl.ordered_qty}
                      onChange={(e) => onQuantityChange(e, index, 'ordered_qty')}
                      maxLength="7"
                    />
                  </td>
                  <td className="p-2">
                    <Input
                      type="text"
                      onKeyPress={decimalKeyPressDown}
                      disabled={isConfirmNotEditable}
                      name="confirmed_qty"
                      value={pl.confirmed_qty}
                      onChange={(e) => onQuantityChange(e, index, 'confirmed_qty')}
                      maxLength="7"
                    />
                  </td>
                  <td className="p-2">
                    <Input
                      type="text"
                      onKeyPress={decimalKeyPressDown}
                      disabled={isDeliverNotEditable}
                      name="delivered_qty"
                      value={pl.delivered_qty}
                      onChange={(e) => onQuantityChange(e, index, 'delivered_qty')}
                      maxLength="7"
                    />
                  </td>
                  <td className="p-2">
                    <Input
                      type="text"
                      name="reason_from_pantry"
                      value={pl.reason_from_pantry}
                      onChange={(e) => onQuantityChange(e, index, 'reason_from_pantry')}
                      maxLength="150"
                    />
                  </td>
                  <td className="p-2">
                    <Input
                      type="text"
                      name="notes_from_employee"
                      value={pl.notes_from_employee}
                      onChange={(e) => onQuantityChange(e, index, 'notes_from_employee')}
                      maxLength="150"
                    />
                  </td>
                  <td className="p-2">
                    <span className="font-weight-400 d-inline-block" />
                    <FontAwesomeIcon className="mr-1 ml-1 cursor-pointer" size="sm" icon={faTrashAlt} onClick={(e) => { isRemoveDisable ? removeData(e, index) : ''; }} />
                  </td>
                </tr>
                )}
              </>
            )))}
          </tbody>
        </Table>
      </Box>
      <Dialog size="xl" fullWidth open={extraModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraModal(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <SearchModalUnique
              modelName={modelValue}
              afterReset={() => { setExtraModal(false); }}
              fieldName={fieldName}
              fields={columns}
              company={companyValue}
              otherFieldName={otherFieldName}
              otherFieldValue={otherFieldValue}
              modalName={modalName}
              arrayValues={arrayList}
              arrayIndex={arrayIndex}
              onProductChange={onProductChange}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
};

ProductForm.propTypes = {
  productValues: PropTypes.oneOfType([PropTypes.array]).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
};

export default ProductForm;
