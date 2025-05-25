/* eslint-disable react/no-array-index-key */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Row, Col, Table, Input, Modal, ModalBody,
} from 'reactstrap';
import {
  
  Typography,
} from '@mui/material';
import { Autocomplete } from '@material-ui/lab';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';
import {
  TextField, CircularProgress, FormHelperText, FormControl,
} from '@material-ui/core';
import { ThemeProvider, makeStyles } from '@material-ui/core/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import ModalHeaderComponent from '@shared/modalHeaderComponent';

import Loader from '@shared/loading';
import addIcon from '@images/icons/plusCircleBlue.svg';
import { AddThemeColor } from '../../../themes/theme';
import theme from '../../../util/materialTheme';
import {
  getProductsList, getProductById, getPartsData, clearProductsByIdData,
  getTaskParts,
} from '../../ppmService';
import { getProductTypeLabel } from '../../utils/utils';
import '../../preventiveMaintenance.scss';
import {
  getAllowedCompanies, getArrayFromValuesById, getColumnArrayByIdWithArray, generateErrorMessage,
} from '../../../util/appUtils';
import SearchModal from './searchModal';

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

const PartsForm = (props) => {
  const {
    editId,
    setFieldValue,
  } = props;
  const quantity = '1.000';
  const dispatch = useDispatch();
  const classes = useStyles();
  const [partsData, setPartsData] = useState([]);
  const [productOptions, setProductOptions] = useState('');
  const [partsAdd, setPartsAdd] = useState(false);
  const [partId, setPartId] = useState(false);
  const [partIndex, setPartIndex] = useState(false);
  const [openId, setOpen] = useState('');
  const [productKeyword, setProductKeyword] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [fieldName, setFieldName] = useState('');
  const [modalName, setModalName] = useState('');
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [companyValue, setCompanyValue] = useState(false);
  const [extraModal, setExtraModal] = useState(false);
  const [arrayList, setArrayList] = useState([]);
  const [arrayIndex, setArrayIndex] = useState(false);
  const [operationData, setOperationData] = useState(false);

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const {
    productInfo, productIdInfo, partsSelected, ppmOperationData,
    taskPartsList,
  } = useSelector((state) => state.ppm);

  useEffect(() => {
    if (editId && (userInfo && userInfo.data) && (ppmOperationData && ppmOperationData.data)) {
      dispatch(getTaskParts(companies, appModels.TASKPARTS, ppmOperationData.data[0].parts_lines));
    }
  }, [editId, ppmOperationData]);

  useEffect(() => {
    if (editId && (taskPartsList && taskPartsList.data && taskPartsList.data.length)) {
      const newArrData = taskPartsList.data.map((cl) => ({
        ...cl,
        id: cl.id,
        parts_id: cl.parts_id,
        parts_qty: cl.parts_qty,
        name: cl.name,
        parts_type: cl.parts_type,
        parts_categ_id: cl.parts_categ_id ? cl.parts_categ_id[1] : '',
        parts_uom: cl.parts_uom ? cl.parts_uom[0] : '',
      }));
      setPartsData(newArrData);
      dispatch(getPartsData(newArrData));
    }
  }, [editId, taskPartsList]);

  useEffect(() => {
    if (productInfo && productInfo.data && productInfo.data.length > 0) {
      const ids = getColumnArrayByIdWithArray(partsSelected && partsSelected.length ? partsSelected : [], 'parts_id');
      const data = getArrayFromValuesById(productInfo.data, ids, 'id');
      if (data && data.length > 0) {
        setProductOptions(data.map((cl) => ({
          ...cl, value: cl.id, label: cl.name,
        })));
      }
    }
  }, [productInfo]);

  useEffect(() => {
    if (partsAdd) {
      setPartsData(partsData);
      dispatch(getPartsData(partsData));
    }
  }, [partsAdd]);

  useEffect(() => {
    if (partsAdd) {
      setPartsData(partsData);
      dispatch(getPartsData(partsData));
    }
  }, [partsAdd]);

  useEffect(() => {
    if (partsSelected && partsSelected.length > 0) {
      setFieldValue('parts_lines', partsSelected);
    } else {
      setPartsData([]);
      setFieldValue('parts_lines', []);
    }
  }, [partsSelected]);

  useEffect(() => {
    if (partId && (userInfo && userInfo.data)) {
      dispatch(getProductById(companies, appModels.TASKPARTS, partId));
    }
  }, [userInfo, partId]);

  useEffect(() => {
    dispatch(clearProductsByIdData());
    setPartsData([]);
  }, []);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      dispatch(getProductsList(companies, appModels.PRODUCT, productKeyword));
    }
  }, [userInfo, productKeyword]);

  useEffect(() => {
    if (productIdInfo && productIdInfo.data && productIdInfo.data.length > 0) {
      const { data } = productIdInfo;
      const newData = partsData;
      if (data.length > 0 && partIndex) {
        newData[partIndex].parts_type = data && data[0] && data[0].parts_type ? data[0].parts_type : '';
        newData[partIndex].parts_categ_id = data && data[0] && data[0].parts_categ_id && data[0].parts_categ_id[1] ? data[0].parts_categ_id[1] : '';
        newData[partIndex].parts_uom = data && data[0] && data[0].parts_uom && data[0].parts_uom[0] ? data[0].parts_uom[0] : '';
        setPartsData(newData);

        setPartId(false);
        setPartIndex(false);
        setPartsAdd(Math.random());
      }
    }
  }, [productIdInfo]);

  const loadEmptyTd = () => {
    const newData = partsData;
    if (editId) {
      newData.push({
        id: false, parts_id: '', parts_qty: parseFloat(quantity), name: '', parts_type: '', parts_categ_id: '', parts_uom: 1,
      });
    } else {
      newData.push({
        parts_id: '', parts_qty: parseFloat(quantity), name: '', parts_type: '', parts_categ_id: '', parts_uom: 1,
      });
    }
    setPartsData(newData);
    setPartsAdd(Math.random());
  };
  const removeData = (e, index) => {
    if (editId) {
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
    } else {
      const checkData = partsData;
      checkData.splice(index, 1);
      setPartsData(checkData);
      setPartsAdd(Math.random());
    }
  };

  const onNameChange = (e, index) => {
    const newData = partsData;
    newData[index].name = e.target.value;
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  const onQuantityChange = (e, index) => {
    const newData = partsData;
    newData[index].parts_qty = e.target.value;
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  const onProductChange = (e, index) => {
    const newData = partsData;
    newData[index].parts_id = [e.id, e.name];
    newData[index].name = e.name;
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
    newData[index].parts_id = '';
    newData[index].name = '';
    newData[index].parts_qty = '';
    newData[index].parts_type = '';
    newData[index].parts_categ_id = '';
    setPartsData(newData);
    setPartsAdd(Math.random());
    setOpen(false);
  };

  const showProductModal = (e, index) => {
    setModelValue(appModels.PRODUCT);
    setFieldName('parts_id');
    setModalName('Spare Part');
    setCompanyValue(userInfo && userInfo.data ? userInfo.data.company.id : '');
    setOtherFieldName('maintenance_ok');
    setOtherFieldValue(true);
    setArrayList(partsSelected);
    setArrayIndex(index);
    setExtraModal(true);
    setOperationData('parts');
  };

  return (
    <>
      <Typography
        sx={AddThemeColor({
          font: 'normal normal medium 20px/24px Suisse Intl',
          letterSpacing: '0.7px',
          fontWeight: 500,
          marginBottom: '10px',
          marginTop: '10px',
          paddingBottom: '4px',
        })}
      >
        Maintenance Parts
      </Typography>
      <ThemeProvider theme={theme}>
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            {editId && taskPartsList && taskPartsList.loading && (
            <div className="p-3" data-testid="loading-case">
              <Loader />
            </div>
            )}
            <Table responsive id="spare-part">
              <thead className="bg-lightblue">
                <tr>
                  <th className="p-2 min-width-160 border-0">
                    Spare Part
                  </th>
                  <th className="p-2 min-width-160 border-0">
                    Quantity
                  </th>
                  <th className="p-2 min-width-160 border-0">
                    Short Description
                  </th>
                  <th className="p-2 w-25 border-0">
                    Product Type
                  </th>
                  <th className="p-2 min-width-160 border-0">
                    Product Category
                  </th>
                  <th className="p-2 min-width-160 border-0">
                    <span className="invisible">Del</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="5" className="text-left">
                    <div aria-hidden="true" className="font-weight-800 text-lightblue cursor-pointer mt-1 mb-1" onClick={loadEmptyTd}>
                      <img src={addIcon} className="mr-2 mb-1" alt="addequipment" height="15" width="15" />
                      <span className="mr-5">
                        Add a Line
                      </span>
                    </div>
                  </td>
                </tr>
                {(partsSelected && partsSelected.length > 0 && partsSelected.map((pl, index) => (
                  <>
                    {!pl.isRemove && (
                    <tr key={index}>
                      <td>
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
                            value={pl.parts_id && pl.parts_id.length ? pl.parts_id[1] : ''}
                            getOptionSelected={(option, value) => option.label === value.label}
                            getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                            options={productOptions}
                            onChange={(e, data) => { onProductChange(data, index); }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                onChange={onProductKeywordChange}
                                variant="outlined"
                                className={pl.parts_id && pl.parts_id.length ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                                placeholder="Search & Select"
                                InputProps={{
                                  ...params.InputProps,
                                  endAdornment: (
                                    <>
                                      {(productInfo && productInfo.loading) && (openId === index) ? <CircularProgress color="inherit" size={20} /> : null}
                                      <InputAdornment position="end">
                                        {(pl.product_id && pl.product_id[0]) && (
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
                      <td>
                        <Input type="input" name="quantity" value={pl.parts_qty} onChange={(e) => onQuantityChange(e, index)} />
                      </td>
                      <td>
                        <Input type="input" name="name" value={pl.name} onChange={(e) => onNameChange(e, index)} />
                      </td>
                      <td>
                        <Input type="input" name="productType" disabled defaultValue={pl.parts_type ? getProductTypeLabel(pl.parts_type) : ''} />
                      </td>
                      <td>
                        <Input type="input" name="productCategory" disabled defaultValue={pl && pl.parts_categ_id ? pl.parts_categ_id : ''} />
                      </td>
                      <td>
                        <span className="font-weight-400 d-inline-block" />
                        <FontAwesomeIcon className="mr-1 ml-1 cursor-pointer" size="sm" icon={faTrashAlt} onClick={(e) => { removeData(e, index); }} />
                      </td>
                    </tr>
                    )}
                  </>
                )))}
              </tbody>
            </Table>
          </Col>
        </Row>
        <Modal size="xl" className="border-radius-50px modal-dialog-centered" isOpen={extraModal}>
          <ModalHeaderComponent title={modalName} imagePath={false} closeModalWindow={() => { setExtraModal(false); }} />
          <ModalBody className="mt-0 pt-0">
            <SearchModal
              modelName={modelValue}
              afterReset={() => { setExtraModal(false); }}
              fieldName={fieldName}
              fields={['name']}
              company={companyValue}
              otherFieldName={otherFieldName}
              otherFieldValue={otherFieldValue}
              modalName={modalName}
              setFieldValue={setFieldValue}
              arrayValues={arrayList}
              arrayIndex={arrayIndex}
              operationData={operationData}
            />
          </ModalBody>
        </Modal>
      </ThemeProvider>
    </>
  );
};

PartsForm.propTypes = {
  editId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default PartsForm;
