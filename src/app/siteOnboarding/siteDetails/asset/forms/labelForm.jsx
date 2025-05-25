/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable radix */
/* eslint-disable camelcase */
/* eslint-disable comma-dangle */
/* eslint-disable react/no-array-index-key */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import {
  faTrashAlt
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import addIcon from '@images/icons/plusCircleBlue.svg';
import {
  CircularProgress, FormControl, FormHelperText, TextField
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';
import { Autocomplete } from '@material-ui/lab';
import Loader from '@shared/loading';
import { useFormikContext } from 'formik';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Col, Input, Row, Table
} from 'reactstrap';
import {
  getGatePassPartsData
} from '../../../../gatePass/gatePassService';
import {
  getLabelList
} from '../../../siteService';
import { getAllowedCompanies, generateErrorMessage } from '../../../../util/appUtils';

const appModels = require('../../../../util/appModels').default;

const ProductForm = (props) => {
  const {
    editId,
    subCategoryValues,
    setFieldValue,
  } = props;
  const { values: formValues } = useFormikContext();
  const {
    space_label_ids
  } = formValues;
  const dispatch = useDispatch();
  const [partsData, setPartsData] = useState(subCategoryValues);
  const [partsAdd, setPartsAdd] = useState(false);
  const [openId, setOpen] = useState('');
  const [productOptions, setProductOptions] = useState([]);
  const [productKeyword, setProductKeyword] = useState('');

  const [modelValue, setModelValue] = useState('');
  const [fieldName, setFieldName] = useState('');
  const [modalName, setModalName] = useState('');
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [columns, setColumns] = useState(['id', 'name']);
  const [companyValue, setCompanyValue] = useState(false);
  const [extraModal, setExtraModal] = useState(false);

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const { acInfo, labelListInfo } = useSelector((state) => state.site);
  const { partsSelected } = useSelector((state) => state.gatepass);
  const {
    updateProductCategoryInfo,
  } = useSelector((state) => state.pantry);

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
    if (editId && (acInfo && acInfo.data && acInfo.data.length && acInfo.data[0].space_label_ids && acInfo.data[0].space_label_ids.length)
      && (updateProductCategoryInfo && !updateProductCategoryInfo.err)) {
      const newArrData = acInfo.data[0].space_label_ids.map((cl) => ({
        ...cl,
        id: cl.id,
        space_label_id: cl.space_label_id,
        space_value: cl.space_value,
      }));
      setPartsData(newArrData);
      setPartsAdd(Math.random());
      dispatch(getGatePassPartsData(newArrData));
    }
  }, [editId, acInfo]);

  useEffect(() => {
    if (labelListInfo && labelListInfo.data && labelListInfo.data.length > 0) {
      const { data } = labelListInfo;
      setProductOptions(data.map((cl) => ({
        ...cl, value: cl.id, label: cl.name,
      })));
    }
  }, [labelListInfo]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      dispatch(getLabelList(companies, appModels.SPACELABEL, productKeyword));
    }
  }, [productKeyword]);

  useEffect(() => {
    if (partsData) {
      setFieldValue('space_label_ids', partsData);
    }
  }, [partsData]);

  const loadEmptyTd = () => {
    const newData = partsData && partsData.length ? partsData : [];
    newData.push({
      id: false, space_label_id: '', space_value: ''
    });
    setPartsData(newData);
    setPartsAdd(Math.random());
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
    newData[index].space_value = e.target.value;
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  const onProductKeywordChange = (event) => {
    setProductKeyword(event.target.value);
  };

  const onProductChange = (e, index) => {
    const newData = partsData;
    newData[index].space_label_id = [e.id, e.name];
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  const onProductKeywordClear = (e, index) => {
    const newData = partsData;
    newData[index].space_label_id = '';
    setPartsData(newData);
    setPartsAdd(Math.random());
    setOpen(false);
  };

  const showProductModal = (e, index) => {
    setModelValue(appModels.SPACELABEL);
    setFieldName('space_label_ids');
    setModalName('Label');
    setCompanyValue(userInfo && userInfo.data ? userInfo.data.company.id : '');
    setColumns(['id', 'name']);
    setOtherFieldValue(true);
    setExtraModal(true);
  };

  return (
    <>
      <Row className="pl-1">
        <Col xs={12} sm={12} md={12} lg={12} >
          {acInfo && acInfo.loading && (
            <div className="p-3" data-testid="loading-case">
              <Loader />
            </div>
          )}
          <Table responsive id="spare-part">
            <thead className="bg-lightblue">
              <tr>
                <th className="p-2 min-width-160 border-0">
                  Label
                </th>
                <th className="p-2 min-width-160 border-0">
                  Value
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
              {(partsSelected && partsSelected.length > 0 && partsSelected.map((pl, index) => (
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
                            value={pl.space_label_id && pl.space_label_id.name ? pl.space_label_id.name : ''}
                            getOptionSelected={(option, value) => (value.length > 0 ? option.name === value.name : '')}
                            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                            options={productOptions}
                            onChange={(e, data) => { onProductChange(data, index); }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                onChange={onProductKeywordChange}
                                variant="outlined"
                                value={productKeyword}
                                className={pl.space_label_id && pl.space_label_id.length ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                                placeholder="Search & Select"
                                InputProps={{
                                  ...params.InputProps,
                                  endAdornment: (
                                    <>
                                      {(labelListInfo && labelListInfo.loading) && (openId === index) ? <CircularProgress color="inherit" size={20} /> : null}
                                      <InputAdornment position="end">
                                        {(pl.space_label_id && pl.space_label_id.id) && (
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
                          {((labelListInfo && labelListInfo.err)
                            && (openId === index)) && (<FormHelperText><span className="text-danger">{generateErrorMessage(labelListInfo)}</span></FormHelperText>)}
                        </FormControl>
                      </td>
                      <td className="p-2">
                        <Input
                          type="text"
                          name="space_value"
                          value={pl.space_value}
                          onChange={(e) => onQuantityChange(e, index)}
                          maxLength="50"
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
        </Col>
      </Row>
    </>
  );
};

ProductForm.propTypes = {
  subCategoryValues: PropTypes.oneOfType([PropTypes.array]).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
};

export default ProductForm;
