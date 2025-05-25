/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable radix */
/* eslint-disable camelcase */
/* eslint-disable comma-dangle */
/* eslint-disable react/no-array-index-key */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Table, Input
  ,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { Autocomplete } from '@material-ui/lab';
import {
  CircularProgress, FormHelperText,
} from '@material-ui/core';
import { useFormikContext } from 'formik';
import { Box } from "@mui/system";
import { Dialog, DialogContent, DialogContentText, Typography, TextField, FormControl } from "@mui/material";
import { IoCloseOutline } from 'react-icons/io5';

import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';

import Loader from '@shared/loading';
import addIcon from '@images/icons/plusCircleBlue.svg';
import {
  getProductsList,
} from '../../preventiveMaintenance/ppmService';
import {
  getWorkPermitPartsData,
} from '../workPermitService';
import {
  getAllowedCompanies, getArrayFromValuesById,
  getColumnArrayById,
  generateErrorMessage,
  numToFloat, decimalKeyPressDown,
} from '../../util/appUtils';
import { AddThemeColor } from '../../themes/theme';
import SearchModalUnique from './searchModalUnique';
import DialogHeader from '../../commonComponents/dialogHeader';

const appModels = require('../../util/appModels').default;

const ProductForm = (props) => {
  const {
    editId,
    productValues,
    setFieldValue,
  } = props;
  const { values: formValues } = useFormikContext();
  const {
    parts_lines
  } = formValues;
  const dispatch = useDispatch();
  const [partsData, setPartsData] = useState(productValues);
  const [productOptions, setProductOptions] = useState([]);
  const [partsAdd, setPartsAdd] = useState(false);
  const [openId, setOpen] = useState('');
  const [openQuantity, setOpenQuantity] = useState('');
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
  const [validationMsg, setValidationMsg] = useState(false);

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const {
    productInfo
  } = useSelector((state) => state.ppm);
  const { updateProductCategoryInfo } = useSelector((state) => state.pantry);
  const { workPermitDetail } = useSelector((state) => state.workpermit);

  useEffect(() => {
    setPartsData([]);
    dispatch(getWorkPermitPartsData([]));
  }, []);

  useEffect(() => {
    if (partsAdd) {
      setPartsData(partsData);
      dispatch(getWorkPermitPartsData(partsData));
    }
  }, [partsAdd]);

  useEffect(() => {
    if (editId && (workPermitDetail && workPermitDetail.data && workPermitDetail.data.length && workPermitDetail.data[0].parts_lines && workPermitDetail.data[0].parts_lines.length)
      && (updateProductCategoryInfo && !updateProductCategoryInfo.err)) {
      const newArrData = workPermitDetail.data[0].parts_lines.map((cl) => ({
        ...cl,
        id: cl.id,
        parts_id: cl.parts_id && cl.parts_id.id ? [cl.parts_id.id, cl.parts_id.name] : false,
        product_id_ref: cl.parts_id && cl.parts_id.id ? cl.parts_id.id : '',
        parts_uom: cl.parts_uom && cl.parts_uom.id ? cl.parts_uom.id : '',
        parts_qty: numToFloat(cl.parts_qty),
        name: cl.name ? cl.name : '',
        qty_available: cl.parts_id && cl.parts_id.id ? cl.parts_id.qty_available : false,
      }));
      setPartsData(newArrData);
      setPartsAdd(Math.random());
      dispatch(getWorkPermitPartsData(newArrData));
    }
  }, [editId]);

  useEffect(() => {
    if (productInfo && productInfo.data && productInfo.data.length > 0) {
      //const { data } = productInfo;
      const productData = partsData && partsData.length ? partsData.filter((item) => !item.isRemove) : [];
      const ids = getColumnArrayById(productData, 'product_id_ref');
      const data = getArrayFromValuesById(productInfo && productInfo.data ? productInfo.data : [], ids, 'id');
      setProductOptions(data.map((cl) => ({
        ...cl, value: cl.id, label: cl.name,
      })));
    }
  }, [productInfo]);

  useEffect(() => {
    if (partsAdd) {
      setPartsData(partsData);
      const productData = partsData && partsData.length ? partsData.filter((item) => !item.isRemove) : [];
      const ids = getColumnArrayById(productData, 'product_id_ref');
      const data = getArrayFromValuesById(productInfo && productInfo.data ? productInfo.data : [], ids, 'id');
      setProductOptions(data.map((cl) => ({
        ...cl, value: cl.id, label: cl.name,
      })));
    }
  }, [partsAdd]);

  useEffect(() => {
    if (partsData) {
      setFieldValue('parts_lines', partsData);
    }
  }, [partsData]);

  useEffect(() => {
    if (userInfo && userInfo.data && typeof openId === 'number') {
      dispatch(getProductsList(companies, appModels.PRODUCT, productKeyword, 'workpermit'));
    }
  }, [productKeyword, openId]);

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
      id: false, parts_id: '', parts_qty: numToFloat(1), name: '', parts_uom: '',
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

  const onQuantityChange = (e, index, field, qon) => {
    setOpenQuantity(index);
    setValidationMsg(false);
    const newData = partsData;
    if (field === 'parts_qty') {
      if (e.target.value && e.target.value <= qon) {
        newData[index][field] = e.target.value;
        setValidationMsg(false);
      } else {
        newData[index][field] = '';
        setValidationMsg(`Should be less than or equal to ${qon} (Quantity on hand)`);
      }
    } else {
      newData[index][field] = e.target.value;
    }
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  const onProductChange = (e, index) => {
    setValidationMsg(false);
    const newData = partsData;
    newData[index].parts_id = [e.id, e.name];
    newData[index].product_id_ref = e.id;
    newData[index].parts_uom = e.uom_id && e.uom_id.length ? e.uom_id[0] : '';
    newData[index].qty_available = e.qty_available;
    newData[index].parts_qty = numToFloat(1);
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  const onProductKeywordClear = (e, index) => {
    const newData = partsData;
    newData[index].parts_id = '';
    newData[index].product_id_ref = '';
    newData[index].parts_uom = '';
    newData[index].qty_available = '';
    newData[index].parts_qty = numToFloat(0);
    setPartsData(newData);
    setPartsAdd(Math.random());
    setOpen(false);
    setOpenQuantity(false);
  };

  const showProductModal = (e, index) => {
    setModelValue(appModels.PRODUCT);
    setFieldName('parts_lines');
    setModalName('Products');
    setCompanyValue(userInfo && userInfo.data ? userInfo.data.company.id : '');
    setColumns(['id', 'name', 'uom_id', 'type', 'qty_available']);
    setOtherFieldName('maintenance_ok');
    setOtherFieldValue(true);
    setArrayList(partsData);
    setArrayIndex(index);
    setExtraModal(true);
  };

  return (
    <>
      <Box
        sx={{
          marginTop: "20px",
          width: "100%",
        }}
      >
        <Typography
          sx={AddThemeColor({
            font: "normal normal medium 20px/24px Suisse Intl",
            letterSpacing: "0.7px",
            fontWeight: 500,
            marginBottom: "10px",
            paddingBottom: '4px'
          })}
        >
          Products Information
        </Typography>
        {workPermitDetail && workPermitDetail.loading && (
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
                Quantity
              </th>
              <th className="p-2 min-width-160 border-0">
                Short Description
              </th>
              <th className="p-2 min-width-160 border-0">
                <span className="invisible">Del</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="7" className="text-left">
                <span aria-hidden="true" className="font-weight-800 text-lightblue cursor-pointer mt-1 mb-1" onClick={loadEmptyTd}>
                  <img src={addIcon} className="mr-2 mb-1" alt="addequipment" height="15" width="15" />
                  Add a Line
                </span>
              </td>
            </tr>
            {(parts_lines && parts_lines.length > 0 && parts_lines.map((pl, index) => (
              <>
                {!pl.isRemove && (
                  <tr key={index}>
                    <td className="p-2">
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
                          value={pl.parts_id && pl.parts_id.length ? pl.parts_id[1] : ''}
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
                              className={pl.parts_id && pl.parts_id.length ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                              placeholder="Search & Select"
                              InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                  <>
                                    {(productInfo && productInfo.loading) && (openId === index) ? <CircularProgress color="inherit" size={20} /> : null}
                                    <InputAdornment position="end">
                                      {(pl.parts_id && pl.parts_id.length > 0 && pl.parts_id[0]) && (
                                        <IconButton
                                          aria-label="toggle password visibility"
                                          onClick={(e, data) => { onProductKeywordClear(data, index); }}
                                        >
                                          <IoCloseOutline size={22} fontSize="small" />
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
                      <Input
                        type="text"
                        onKeyPress={decimalKeyPressDown}
                        name="parts_qty"
                        value={pl.parts_qty}
                        onChange={(e) => onQuantityChange(e, index, 'parts_qty', pl.qty_available)}
                        maxLength="7"
                      />
                      {(openQuantity === index)
                        ? (
                          <div className="text-danger text-center d-inline font-11 font-weight-800">
                            {validationMsg}
                          </div>
                        )
                        : ''}
                    </td>
                    <td className="p-2">
                      <Input
                        type="text"
                        name="desc"
                        value={pl.name}
                        onChange={(e) => onQuantityChange(e, index, 'name')}
                        maxLength="150"
                      />
                    </td>
                    <td className="p-2">
                      <span className="font-weight-400 d-inline-block" />
                      <FontAwesomeIcon className="mr-1 ml-1 cursor-pointer" size="sm" icon={faTrashAlt} onClick={(e) => { removeData(e, index); }} />
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
