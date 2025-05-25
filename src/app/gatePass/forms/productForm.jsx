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
  Row, Col, Table,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { Autocomplete } from '@material-ui/lab';
import {
  TextField, CircularProgress, FormHelperText, FormControl,
} from '@material-ui/core';
import { useFormikContext } from 'formik';
import { Box, } from '@mui/system';
import {
  Typography, Input,
  Dialog, DialogContent, DialogContentText,
} from '@mui/material';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import DOMPurify from 'dompurify';
import SearchIcon from '@material-ui/icons/Search';
import { IoCloseOutline } from 'react-icons/io5';

import Loader from '@shared/loading';
import addIcon from '@images/icons/plusCircleBlue.svg';
import {
  getGatePassAssets,
} from '../../preventiveMaintenance/ppmService';
import {
  getGatePassPartsData,
} from '../gatePassService';
import {
  createHxIncident,
  resetAddIncidentInfo,
} from '../../incidentBooking/ctService';
import {
  getArrayFromValuesById,
  getColumnArrayById,
  generateErrorMessage,
  numToFloat, decimalKeyPressDown,
} from '../../util/appUtils';
import SearchModalUnique from './searchModalUnique';
import AddItem from './addItem';
import { AddThemeColor } from '../../themes/theme';
import MuiAutoComplete from '../../commonComponents/formFields/muiAutocomplete';
import DialogHeader from '../../commonComponents/dialogHeader';

const ProductForm = (props) => {
  const {
    editId,
    productValues,
    setFieldValue,
  } = props;
  const { values: formValues } = useFormikContext();
  const {
    order_lines
  } = formValues;
  const dispatch = useDispatch();
  const [partsData, setPartsData] = useState(productValues);
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

  const [currentId, setCurrentId] = useState(false);

  const [productModal, setProductModal] = useState(false);

  const { userInfo } = useSelector((state) => state.user);
  const { addIncidentInfo } = useSelector((state) => state.hxIncident);
  const {
    gatePassAssets,
  } = useSelector((state) => state.ppm);
  const { gatePassDetails, updateGatePassInfo } = useSelector((state) => state.gatepass);

  useEffect(() => {
    setPartsData([]);
    dispatch(getGatePassPartsData([]));
  }, []);

  useEffect(() => {
    if (partsAdd) {
      setPartsData(partsData);
      dispatch(getGatePassPartsData(partsData));
    }
  }, [partsAdd]);

  useEffect(() => {
    if (editId && (gatePassDetails && gatePassDetails.data && gatePassDetails.data.length && gatePassDetails.data[0].order_lines && gatePassDetails.data[0].order_lines.length)
      && (updateGatePassInfo && !updateGatePassInfo.err)) {
      const newArrData = gatePassDetails.data[0].order_lines.map((cl) => ({
        ...cl,
        id: cl.id,
        asset_id: cl.asset_id && cl.asset_id.id ? [cl.asset_id.id, cl.asset_id.name] : false,
        asset_id_ref: cl.asset_id && cl.asset_id.id ? cl.asset_id.id : '',
        parts_qty: numToFloat(cl.parts_qty),
        description: cl.description,
      }));
      setPartsData(newArrData);
      setPartsAdd(Math.random());
      dispatch(getGatePassPartsData(newArrData));
    }
  }, [editId]);

  useEffect(() => {
    if (gatePassAssets && gatePassAssets.data && gatePassAssets.data.length > 0) {
      const { data } = gatePassAssets;
      setProductOptions(data.map((cl) => ({
        ...cl, value: cl.id, label: cl.name,
      })));
    }
  }, [gatePassAssets]);

  useEffect(() => {
    if (partsAdd) {
      setPartsData(partsData);
      const ids = getColumnArrayById(partsData && partsData.length ? partsData : [], 'asset_id_ref');
      const data = getArrayFromValuesById(gatePassAssets && gatePassAssets.data ? gatePassAssets.data : [], ids, 'id');
      setProductOptions(data.map((cl) => ({
        ...cl, value: cl.id, label: cl.name,
      })));
    }
  }, [partsAdd]);

  useEffect(() => {
    if (partsData) {
      setFieldValue('order_lines', partsData);
    }
  }, [partsData]);

  useEffect(() => {
    if (openId) {
      setProductKeyword('');
    }
  }, [openId]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      dispatch(getGatePassAssets('mro.gatepass.asset'));
    }
  }, [userInfo, addIncidentInfo]);

  const loadEmptyTd = () => {
    const newData = partsData && partsData.length ? partsData : [];
    newData.push({
      id: false, asset_id: '', parts_qty: numToFloat(1), description: '',
    });
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  const onProductKeywordChange = (event, index) => {
    setProductKeyword(event.target.value);
    setCurrentId(index);
    const ndata = productOptions.filter((item) => {
      const searchValue = item.label ? item.label.toString().toUpperCase() : '';
      const s = event.target.value ? event.target.value.toString().toUpperCase() : '';
      return (searchValue.search(s) !== -1);
    });
    if (ndata && !ndata.length) {
      setOpen('');
    }
  };

  const removeData = (e, index) => {
    const newData = partsData;
    const id = newData[index] ? newData[index] : newData[index]?.id;
    if (id) {
      newData[index].isRemove = true;
      setPartsAdd(Math.random());
    } else {
      newData = newData.splice(index, 1);
      setPartsAdd(Math.random());
    }
    const allHaveRemoveTrue = newData.every((obj) => obj.isRemove === true);
    setPartsData(allHaveRemoveTrue ? [] : newData);
  };

  const onQuantityChange = (e, index, field) => {
    const newData = partsData;
    if (field === 'parts_qty') {
      newData[index][field] = e.target.value && e.target.value >= 1 ? e.target.value : '';
    } else {
      newData[index][field] = DOMPurify.sanitize(e.target.value);
    }
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  const onProductChange = (e, index) => {
    const newData = partsData;
    newData[index].asset_id = [e?.id, e?.name];
    newData[index].asset_id_ref = e.id;
    newData[index].parts_qty = numToFloat(1);
    newData[index].description = '';
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  const onProductKeywordClear = (e, index) => {
    const newData = partsData;
    newData[index].asset_id = '';
    newData[index].asset_id_ref = '';
    newData[index].parts_qty = numToFloat(1);
    newData[index].description = '';
    setPartsData(newData);
    setPartsAdd(Math.random());
    setOpen(false);
  };

  const showProductModal = (e, index) => {
    setModelValue('mro.gatepass.asset');
    setFieldName('order_lines');
    setModalName('Items');
    setCompanyValue(userInfo && userInfo.data ? userInfo.data.company.id : '');
    setColumns(['id', 'name']);
    setOtherFieldName(false);
    setOtherFieldValue(true);
    setArrayList(partsData);
    setArrayIndex(index);
    setExtraModal(true);
  };

  const ndata = productOptions.filter((item) => {
    const searchValue = item.label ? item.label.toString().toUpperCase() : '';
    const s = productKeyword ? productKeyword.toString().toUpperCase() : '';
    return (searchValue.search(s) !== -1);
  });

  const onModalClose = () => {
    setProductModal(false);
    dispatch(resetAddIncidentInfo());
    if (addIncidentInfo && addIncidentInfo.data) {
      dispatch(getGatePassPartsData([]));
      setCurrentId('');
    }
  };

  return (
    <>
      <Box
        sx={{
          width: '100%',
        }}
      >
        <Typography
          sx={AddThemeColor({
            font: 'normal normal medium 20px/24px Suisse Intl',
            letterSpacing: '0.7px',
            fontWeight: 500,
          })}
        >
          Items Info
        </Typography>
        <Row className="instructions-scroll thin-scrollbar">
          <Col xs={12} sm={12} md={12} lg={12} className="ml-3">
            {gatePassDetails && gatePassDetails.loading && (
              <div className="p-3" data-testid="loading-case">
                <Loader />
              </div>
            )}
            <Table responsive id="spare-part">
              <thead className="bg-lightblue">
                <tr>
                  <th className="p-2 min-width-160 border-0">
                    Item
                    {' '}
                    <span className="text-danger ml-1">*</span>
                  </th>
                  <th className="p-2 min-width-160 border-0">
                    Quantity
                  </th>
                  <th className="p-2 min-width-200 border-0">
                    Description
                  </th>
                  <th className="p-2 min-width-100 border-0">
                    <span className="invisible">Del</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="4" className="text-left">
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
                        <td className="p-2">
                          <FormControl>
                            <Autocomplete
                              name="products_new"
                              className="min-width-200"
                              open={openId === index}
                              size="small"
                              onOpen={() => {
                                setOpen(index);
                              }}
                              onClose={() => {
                                setOpen('');
                              }}
                              value={pl.asset_id && pl.asset_id.length ? pl.asset_id[1] : ''}
                              getOptionSelected={(option, value) => (value?.length > 0 ? option.label === value.label : '')}
                              getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                              options={productOptions}
                              onChange={(e, data) => { onProductChange(data, index); }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  onChange={(e) => onProductKeywordChange(e, index)}
                                  variant="standard"
                                  value={productKeyword}
                                  className={pl.asset_id && pl.asset_id.length ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                                  placeholder="Search & Select"
                                  InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                      <>
                                        {(gatePassAssets && gatePassAssets.loading) && (openId === index) ? <CircularProgress color="inherit" size={20} /> : null}
                                        <InputAdornment position="end">
                                          {(pl.asset_id && pl.asset_id.length > 0 && pl.asset_id[0]) && (
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
                            {((gatePassAssets && gatePassAssets.err)
                              && (openId === index)) && (<FormHelperText><span className="text-danger">{generateErrorMessage(gatePassAssets)}</span></FormHelperText>)}
                            {(ndata && (!ndata.length) && (currentId === index) && (productKeyword && productKeyword.length >= 1)
                              && (addIncidentInfo && !addIncidentInfo.err) && (addIncidentInfo && !addIncidentInfo.data)) && !pl.asset_id && (
                                <FormHelperText className="form-helpertext">
                                  <span>{`New Item "${productKeyword}" will be created. Do you want to create..? Click`}</span>
                                  <span aria-hidden="true" onClick={() => { setProductModal(true); dispatch(resetAddIncidentInfo()); }} className="text-info ml-2 cursor-pointer">YES</span>
                                  {'  '}
                                  (OR)
                                  <span aria-hidden="true" onClick={() => { setProductKeyword(''); setOpen(''); setCurrentId(''); }} className="text-info ml-2 cursor-pointer">NO</span>
                                </FormHelperText>
                            )}
                          </FormControl>
                        </td>
                        <td className="p-2">
                          <Input
                            type="text"
                            onKeyDown={decimalKeyPressDown}
                            name="parts_qty"
                            className="mt-2"
                            value={pl.parts_qty}
                            onChange={(e) => onQuantityChange(e, index, 'parts_qty')}
                            inputProps={{ maxLength: '7' }}
                          />
                        </td>
                        <td className="p-2">
                          <Input
                            type="text"
                            name="parts_desc"
                            className="mt-2"
                            multiline
                            minRows={1}
                            value={pl.description}
                            inputProps={{ maxLength: '150' }}
                            onChange={(e) => onQuantityChange(e, index, 'description')}
                          />
                        </td>
                        <td className="p-2">
                          <span className="font-weight-400 d-inline-block" />
                          <FontAwesomeIcon className="mr-1 mt-3 ml-1 cursor-pointer" size="sm" icon={faTrashAlt} onClick={(e) => { removeData(e, index); }} />
                        </td>
                      </tr>
                    )}
                  </>
                )))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Box>

      <Dialog maxWidth="md" open={extraModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraModal(false); }} sx={{ width: '800px' }} />
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
      <Dialog maxWidth="md" open={productModal}>
        <DialogHeader title="Add Item" imagePath={false} onClose={() => { onModalClose(); }} response={addIncidentInfo} sx={{ width: '800px' }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <AddItem
              productName={productKeyword}
              setProductKeyword={setProductKeyword}
              currentId={currentId}
              onProductChange={onProductChange}
              reset={() => { onModalClose(); setOpen(''); }}
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
