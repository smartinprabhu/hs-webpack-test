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
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';
import { IoCloseOutline } from 'react-icons/io5';

import ModalHeaderComponent from '@shared/modalHeaderComponent';
import Loader from '@shared/loading';
import addIcon from '@images/icons/plusCircleBlue.svg';
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
  extractTextObject, decimalKeyPressDown,
  getAllowedCompanies,
  numToFloat,
  getDefaultNoValue,
} from '../../util/appUtils';
import { AddThemeColor } from '../../themes/theme';
import { getEquipmentList } from '../../helpdesk/ticketService';
import DialogHeader from '../../commonComponents/dialogHeader';
import { getEquipmentStateText } from '../../assets/utils/utils';
import Assets from '../../assets/equipments';

const appModels = require('../../util/appModels').default;

const ProductForm = (props) => {
  const {
    editId,
    productValues,
    setFieldValue,
  } = props;
  const { values: formValues } = useFormikContext();
  const {
    asset_lines
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
  const [placeholderName, setPlaceholder] = useState('');
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [columns, setColumns] = useState(['id', 'name']);
  const [companyValue, setCompanyValue] = useState(false);
  const [multipleModal, setMultipleModal] = useState(false);
  const [arrayList, setArrayList] = useState([]);
  const [arrayIndex, setArrayIndex] = useState(false);

  const [currentId, setCurrentId] = useState(false);

  const [productModal, setProductModal] = useState(false);

  const { userInfo } = useSelector((state) => state.user);
  const { addIncidentInfo } = useSelector((state) => state.hxIncident);
  const { equipmentInfo } = useSelector((state) => state.ticket);
  const { gatePassDetails, updateGatePassInfo } = useSelector((state) => state.gatepass);

  const companies = getAllowedCompanies(userInfo);

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
    if (editId && (gatePassDetails && gatePassDetails.data && gatePassDetails.data.length && gatePassDetails.data[0].asset_lines && gatePassDetails.data[0].asset_lines.length)
      && (updateGatePassInfo && !updateGatePassInfo.err)) {
      const newArrData = gatePassDetails.data[0].asset_lines.map((cl) => ({
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
    if (equipmentInfo && equipmentInfo.data && equipmentInfo.data.length > 0) {
      const { data } = equipmentInfo;
      setProductOptions(data.map((cl) => ({
        ...cl, value: cl.id, label: cl.name,
      })));
    }
  }, [equipmentInfo]);

  useEffect(() => {
    if (partsAdd) {
      setPartsData(partsData);
      const ids = getColumnArrayById(partsData && partsData.length ? partsData : [], 'asset_id_ref');
      const data = getArrayFromValuesById(equipmentInfo && equipmentInfo.data ? equipmentInfo.data : [], ids, 'id');
      setProductOptions(data.map((cl) => ({
        ...cl, value: cl.id, label: cl.name,
      })));
    }
  }, [partsAdd]);

  useEffect(() => {
    if (partsData) {
      setFieldValue('asset_lines', partsData);
    }
  }, [partsData]);

  useEffect(() => {
    if (openId) {
      setProductKeyword('');
    }
  }, [openId]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const data = partsData && partsData.length ? partsData.filter((item) => item.asset_id_ref) : [];
      dispatch(getEquipmentList(companies, appModels.EQUIPMENT, productKeyword, false, false, false, false, false, getColumnArrayById(data, 'asset_id_ref')));
    }
  }, [userInfo, productKeyword, addIncidentInfo]);

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
    /* const ndata = productOptions.filter((item) => {
      const searchValue = item.label ? item.label.toString().toUpperCase() : '';
      const s = event.target.value ? event.target.value.toString().toUpperCase() : '';
      return (searchValue.search(s) !== -1);
    });
    if (ndata && !ndata.length) {
      setOpen('');
    } */
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
      newData[index][field] = e.target.value;
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

  const onAssetModalChange = (data) => {
    const newData = data.filter((item) => item.name);
    const fData = newData.map((cl) => ({
      asset_id_ref: cl.id,
      asset_id: [cl.id, cl.name],
      parts_qty: numToFloat(1),
      description: '',
    }));
    const newData2 = partsData.filter((item) => item.asset_id_ref && !item.isRemove);
    const allData = [...fData, ...newData2];
    const newData1 = [...new Map(allData.map((item) => [item.asset_id_ref, item])).values()];
    setPartsData(newData1);
    setPartsAdd(Math.random());

    setMultipleModal(false);
  };

  const getFiledData = (data) => {
    const newData = data.filter((item) => item.asset_id_ref && !item.isRemove);
    return getColumnArrayById(newData, 'asset_id_ref');
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
    setModelValue(appModels.EQUIPMENT);
    setFieldName('asset_lines');
    setModalName('Assets');
    setPlaceholder('Assets');
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setColumns(['id', 'name', 'location_id', 'state', 'category_id', 'serial', 'brand', 'make', 'model', 'equipment_seq']);
    setMultipleModal(true);
  };

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
          Assets Info
        </Typography>
        <Row className="instructions-scroll thin-scrollbar">
          <Col xs={12} sm={12} md={12} lg={12} className="ml-3">
            {gatePassDetails && gatePassDetails.loading && (
              <div className="p-3" data-testid="loading-case">
                <Loader />
              </div>
            )}
            <Table id="spare-part">
              <thead className="bg-lightblue">
                <tr>
                  <th className="p-2 min-width-160 border-0 table-column z-Index-1060">
                    Asset
                  </th>
                  <th className="p-2 min-width-100 border-0 table-column z-Index-1060">
                    Quantity (kg)
                  </th>
                  <th className="p-2 min-width-160 border-0 table-column z-Index-1060">
                    Description
                  </th>
                  <th className="p-2 min-width-100 border-0 table-column z-Index-1060">
                    <span className="">Delete</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="3" className="text-left">
                    <div aria-hidden="true" className="font-weight-800 text-lightblue cursor-pointer mt-1 mb-1" onClick={loadEmptyTd}>
                      <img src={addIcon} className="mr-2 mb-1" alt="addequipment" height="15" width="15" />
                      <span className="mr-5">Add an Asset</span>
                    </div>
                  </td>
                </tr>
                {(asset_lines && asset_lines.length > 0 && asset_lines.map((pl, index) => (
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
                                  className={pl.name ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                                  placeholder="Search & Select"
                                  InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                      <>
                                        {(equipmentInfo && equipmentInfo.loading) && (openId === index) ? <CircularProgress color="inherit" size={20} /> : null}
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
                            {((equipmentInfo && equipmentInfo.err)
                              && (openId === index)) && (<FormHelperText><span className="text-danger">{generateErrorMessage(equipmentInfo)}</span></FormHelperText>)}
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

      <Dialog
        ModalProps={{
          sx: { zIndex: '1100' },
        }}
        maxWidth="xl"
        open={multipleModal}
      >
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setMultipleModal(false); }} rightButton />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Box
              sx={{
                width: '100%',
                backgroundColor: '#F6F8FA',
                padding: '0px',
                display: 'flex',
                flexDirection: 'column',
                fontFamily: 'Suisse Intl',
              }}
            >

              <Assets
                isSearch
                fields={columns}
                onAssetChange={onAssetModalChange}
                oldAssets={asset_lines && asset_lines.length > 0 ? getFiledData(asset_lines) : []}
                afterReset={() => { setMultipleModal(false); }}
              />
            </Box>
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
