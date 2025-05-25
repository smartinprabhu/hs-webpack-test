/* eslint-disable max-len */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable radix */
/* eslint-disable camelcase */
/* eslint-disable comma-dangle */
/* eslint-disable react/no-array-index-key */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Row, Col, Table, Input,
  Card, CardBody,
  Modal,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import Button from '@mui/material/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { Autocomplete } from '@material-ui/lab';
import {
  TextField, CircularProgress, FormHelperText, FormControl,
} from '@material-ui/core';
import axios from 'axios';

import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';

import Loader from '@shared/loading';
import addIcon from '@images/icons/plusCircleBlue.svg';

import ModalHeaderComponent from '@shared/modalHeaderComponent';
import SuccessAndErrorFormat from '@shared/successAndErrorFormat';

import checkCircleBlack from '@images/icons/checkCircleBlack.svg';
import checkWhite from '@images/icons/checkWhite.svg';

import {
  getArrayFromValuesById,
  getColumnArrayById,
  generateErrorMessage,
  numToFloat, decimalKeyPress,
  getArrayNewFormatUpdateDelete,
} from '../../util/appUtils';

import { getNewRequestArray } from '../../workPermit/utils/utils';

const appConfig = require('../../config/appConfig').default;

const ProductForm = (props) => {
  const {
    editId,
    workPermitDetail,
    workPermitConfig,
    companyId,
    ruuid,
    accid,
    atClose,
    atSuccess,
  } = props;
  const [partsData, setPartsData] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [partsAdd, setPartsAdd] = useState(false);
  const [openId, setOpen] = useState('');
  const [productKeyword, setProductKeyword] = useState('');
  const [validationMsg, setValidationMsg] = useState(false);
  const [openQuantity, setOpenQuantity] = useState('');
  const [productInfo, setProductsInfo] = useState({ loading: false, data: null, err: null });
  const [statusInfo, setStatusInfo] = useState({ loading: false, data: null, err: null });

  const WEBAPPAPIURL = `${window.location.origin}/`;

  useEffect(() => {
    if (editId && (workPermitDetail && workPermitDetail.data && workPermitDetail.data.length && workPermitDetail.data[0].parts_lines && workPermitDetail.data[0].parts_lines.length)) {
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
    if (companyId) {
      setProductsInfo({
        loading: true, data: null, count: 0, err: null,
      });

      const fields = '["id","name","lst_price","standard_price",("uom_id", ["id", "name"]),"qty_available"]';
      const payload = `domain=[["company_id","=",${companyId}],["maintenance_ok","=",true],["qty_available",">",0]]&model=product.product&fields=${fields}&offset=0&limit=500&portalDomain=${window.location.origin}`;

      const config = {
        method: 'get',
        url: `${WEBAPPAPIURL}public/api/v4/search?${payload}`,
        headers: {
          portalDomain: window.location.origin,
          accountId: accid,
        },
      };

      axios(config)
        .then((response) => setProductsInfo({
          loading: false, data: response.data.data, count: response.data.length, err: null,
        }))
        .catch((error) => {
          setProductsInfo({
            loading: false, data: null, count: 0, err: error,
          });
        });
    }
  }, [companyId]);

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

  function checkArrayhasDataProduct(data) {
    let result = [];
    if (data && data.length) {
      result = data.filter((item) => (item.parts_id && (typeof item.parts_id === 'number')));
    }
    return result;
  }

  const loadEmptyTd = () => {
    const newData = partsData && partsData.length ? partsData : [];
    newData.push({
      id: false, parts_id: '', parts_qty: numToFloat(0), name: '', parts_uom: '',
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
    newData[index].parts_uom = e.uom_id && e.uom_id.id ? e.uom_id.id : '';
    newData[index].qty_available = e.qty_available;
    setPartsData(newData);
    setPartsAdd(Math.random());
    setOpenQuantity(false);
  };

  const onProductKeywordClear = (e, index) => {
    const newData = partsData;
    newData[index].parts_id = '';
    newData[index].product_id_ref = '';
    newData[index].parts_uom = '';
    newData[index].qty_available = '';
    setPartsData(newData);
    setPartsAdd(Math.random());
    setOpen(false);
  };

  const onUpdateParts = () => {
    if (ruuid) {
      setStatusInfo({ loading: true, data: null, err: null });
      const postDataValues = {
        parts_lines: partsData && partsData.length > 0 ? getArrayNewFormatUpdateDelete(checkArrayhasDataProduct(getNewRequestArray(partsData))) : false,
      };

      const data = {
        uuid: ruuid,
        values: postDataValues,
      };

      const postData = new FormData();
      postData.append('values', JSON.stringify(data.values));
      if (typeof payload === 'object') {
        Object.keys(data).map((payloadObj) => {
          if (payloadObj !== 'uuid') {
            postData.append(payloadObj, data[payloadObj]);
          }
          return postData;
        });
      }
      postData.append('uuid', data.uuid);
      const config = {
        method: 'post',
        url: `${WEBAPPAPIURL}public/api/v4/wp/updateWPSStatus`,
        headers: {
          'Content-Type': 'multipart/form-data',
          portalDomain: window.location.origin,
          accountId: accid,
        },
        data: postData,
      };

      axios(config)
        .then((response) => {
          setStatusInfo({ loading: false, data: response.data.data, err: null });
          atClose();
          atSuccess();
        })
        .catch((error) => {
          setStatusInfo({ loading: false, data: null, err: error });
        });
    }
  };

  function checkPartsId(array) {
    let result = false;
    let count = 0;
    const arrayNew = array.filter((item) => !item.isRemove);
    for (let i = 0; i < arrayNew.length; i += 1) {
      if ((arrayNew[i].parts_id && arrayNew[i].parts_id.length > 0)) {
        count += 1;
      }
    }
    result = count === arrayNew.length;
    return result;
  }

  const isRequiredParts = workPermitConfig && workPermitConfig.is_parts_required;

  let partsCondition = false;

  if (isRequiredParts) {
    const partsDataList = partsData.filter((item) => item && !item.isRemove);
    partsCondition = (partsDataList && !partsDataList.length > 0) || !checkPartsId(partsDataList);
  }

  return (
    <Modal size="lg" className="border-radius-50px modal-dialog-centered" isOpen>
      <ModalHeaderComponent
        imagePath={checkCircleBlack}
        closeModalWindow={() => atClose()}
        title="Update Spare Parts"
        response={statusInfo}
      />
      <ModalBody>
        {(statusInfo && !statusInfo.data) && (
        <>
          <Card className="no-border-radius mb-2 mt-2">
            <CardBody className="p-0 bg-porcelain">
              <p className="ml-2 mb-1 mt-1 font-weight-600 font-side-heading">Products</p>
            </CardBody>
          </Card>
          <Row className="">
            <Col xs={12} sm={12} md={12} lg={12} className="ml-3">
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
                      {isRequiredParts && (
                      <span className="text-danger ml-1">*</span>
                      )}
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
                      <div aria-hidden="true" className="font-weight-800 text-lightblue cursor-pointer mt-1 mb-1" onClick={loadEmptyTd}>
                        <img src={addIcon} className="mr-2 mb-1" alt="addequipment" height="15" width="15" />
                        <span className="mr-5">Add a Line</span>
                      </div>
                    </td>
                  </tr>
                  {(partsData && partsData.length > 0 && partsData.map((pl, index) => (
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
                                  variant="outlined"
                                  value={productKeyword}
                                  className={pl.parts_id && pl.parts_id.length ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                                  placeholder="Select"
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
                                            <BackspaceIcon fontSize="small" />
                                          </IconButton>
                                          )}
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
                            onKeyPress={decimalKeyPress}
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
                            name="name"
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
            </Col>
          </Row>
        </>
        )}
        {(statusInfo && statusInfo.loading) && (
        <div className="text-center mt-4 mb-4">
          <Loader />
        </div>
        )}
        {(statusInfo && statusInfo.err) && (
        <div className="text-center mt-3 mb-3">
          <SuccessAndErrorFormat response={statusInfo} />
        </div>
        )}
      </ModalBody>
      <ModalFooter className="mr-3 ml-3">

        <Button
          type="button"
          size="md"
          className="rounded-pill"
          disabled={(statusInfo && statusInfo.loading) || partsCondition}
          onClick={() => onUpdateParts()}
           variant="contained"
        >
          <img src={checkWhite} className="mr-2" alt="Prepare" width="13" height="13" />
          <span>Update</span>
        </Button>
      </ModalFooter>
    </Modal>
  );
};

ProductForm.propTypes = {
  workPermitDetail: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
  workPermitConfig: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  companyId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  ruuid: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  atClose: PropTypes.func.isRequired,
  atSuccess: PropTypes.func.isRequired,
};

export default ProductForm;
