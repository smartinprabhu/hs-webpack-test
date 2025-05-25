/* eslint-disable prefer-destructuring */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable camelcase */
/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {
  TextField, CircularProgress, FormHelperText,
} from '@material-ui/core';
import {
  Row, Col,
} from 'reactstrap';
import { useFormikContext } from 'formik';

import { InputField, FormikAutocomplete } from '@shared/formFields';

import { getProductCategoryInfo, getMeasures } from '../../../../purchase/purchaseService';
import { generateErrorMessage, getAllowedCompanies, decimalKeyPress } from '../../../../util/appUtils';
import formikInitialValues from '../formModel/formInitialValues';

const appModels = require('../../../../util/appModels').default;

const BasicForm = (props) => {
  const {
    setFieldValue,
    formField: {
      productName,
      categoryId,
      productType,
      unitOfMeasure,
      purchaseUnitOfMeasure,
      cost,
      salesprice,
      descriptionId,
      weightId,
      volumeId,
    },
  } = props;
  const { values: formValues } = useFormikContext();
  const {
    name, categ_id, type, uom_id, uom_po_id,
    list_price, weight, volume, standard_price,
    description,
  } = formValues;
  const [openCategoryId, setOpenCategoryId] = useState(false);
  const [openType, setOpenType] = useState(false);
  const [uomOpen, setUomOpen] = useState(false);
  const [pomOpen, setPomOpen] = useState(false);
  const [uomKeyword, setUomKeyword] = useState('');

  const { productCategoryInfo, measuresInfo } = useSelector((state) => state.purchase);
  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const dispatch = useDispatch();

  useEffect(() => {
    if (userInfo && userInfo.data) {
      dispatch(getProductCategoryInfo(companies, appModels.PRODUCTCATEGORY));
    }
  }, [userInfo]);

  useEffect(() => {
    if (uom_id) {
      setFieldValue('uom_po_id', uom_id);
    }
  }, [uom_id]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      dispatch(getMeasures(appModels.UOM, uomKeyword));
    }
  }, [userInfo, uomKeyword]);

  let productCategoryOptions = [];
  let measureOptions = [];

  if (productCategoryInfo && productCategoryInfo.loading) {
    productCategoryOptions = [{ name: 'loading' }];
  }
  if (productCategoryInfo && productCategoryInfo.data && productCategoryInfo.data.length) {
    const arr = [...productCategoryOptions, ...productCategoryInfo.data];
    productCategoryOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }
  if (productCategoryInfo && productCategoryInfo.err) {
    productCategoryOptions = [];
  }

  if (measuresInfo && measuresInfo.loading) {
    measureOptions = [{ name: 'loading' }];
  }
  if (measuresInfo && measuresInfo.data) {
    measureOptions = measuresInfo.data;
  }
  if (measuresInfo && measuresInfo.err) {
    measureOptions = [];
  }
  const typeOptions = [
    { name: 'Consumable', value: 'consu' },
    { name: 'Storable', value: 'product' },
  ];

  const getType = (ProductType) => {
    const filteredType = typeOptions.filter((data) => data.value === ProductType);
    if (filteredType && filteredType.length) {
      return filteredType[0].name;
    }
    return '';
  };

  const onUomKeyWordChange = (event) => {
    setUomKeyword(event.target.value);
  };

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

  useEffect(() => {
    if (userInfo && userInfo.data) {
      formikInitialValues.type = { name: 'Storable', value: 'product' };
    }
  }, [userInfo]);

  useEffect(() => {
    if (productCategoryInfo && productCategoryInfo.data && productCategoryInfo.data.length) {
      const categData = productCategoryInfo.data.find((data) => data.display_name === 'All');
      if (categData) {
        formikInitialValues.categ_id = categData;
      }
    }
  }, [productCategoryInfo]);

  useEffect(() => {
    if (measuresInfo && measuresInfo.data && measuresInfo.data.length) {
      const unitData = measuresInfo.data.find((data) => data.name === 'Unit(s)');
      if (unitData && !uom_id) {
        formikInitialValues.uom_id = unitData;
      }
      if (unitData && !uom_po_id) {
        formikInitialValues.uom_po_id = unitData;
      }
    }
  }, [measuresInfo]);

  return (
    <Row className="mb-1">
      <Col xs={12} sm={6} lg={6} md={6}>
        <Col xs={12} sm={12} lg={12} md={12}>
          <InputField name={productName.name} autoFocus={!name} label={productName.label} isRequired type="text" formGroupClassName="m-1" maxLength="30" />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <FormikAutocomplete
            name={unitOfMeasure.name}
            label={unitOfMeasure.label}
            isRequired={unitOfMeasure.isRequired}
            formGroupClassName="m-1"
            labelClassName="mb-2"
            size="small"
            open={uomOpen}
            onOpen={() => {
              setUomOpen(true);
              setUomKeyword('');
            }}
            onClose={() => {
              setUomOpen(false);
              setUomKeyword('');
            }}
            value={uom_id && uom_id.name ? uom_id.name : getOldData(uom_id)}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={measureOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onUomKeyWordChange}
                variant="outlined"
                className="without-padding"
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {measuresInfo && measuresInfo.loading && uomOpen ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
          {(measuresInfo && measuresInfo.err && measuresInfo) && (<FormHelperText><span className="text-danger">{generateErrorMessage(measuresInfo)}</span></FormHelperText>)}
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <FormikAutocomplete
            name={purchaseUnitOfMeasure.name}
            label={purchaseUnitOfMeasure.label}
            isRequired={purchaseUnitOfMeasure.isRequired}
            formGroupClassName="m-1"
            labelClassName="mb-2"
            size="small"
            open={pomOpen}
            onOpen={() => {
              setPomOpen(true);
            }}
            onClose={() => {
              setPomOpen(false);
            }}
            // disabled={!uom_id}
            disabled
            value={uom_po_id && uom_po_id.name ? uom_po_id.name : getOldData(uom_po_id)}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={measureOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                className="without-padding"
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {measuresInfo && measuresInfo.loading && pomOpen ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
          {(measuresInfo && measuresInfo.err && measuresInfo) && (<FormHelperText><span className="text-danger">{generateErrorMessage(measuresInfo)}</span></FormHelperText>)}
        </Col>
        <Col xs={12} sm={12} lg={12} md={12}>
          <InputField
            name={cost.name}
            label={cost.label}
            value={standard_price || ''}
            type="text"
            formGroupClassName="m-1"
            maxLength="30"
            onKeyPress={decimalKeyPress}
          />
        </Col>
        <Col xs={12} md={12} lg={12} sm={12}>
          <InputField
            name={descriptionId.name}
            label={descriptionId.label}
            value={description || ''}
            formGroupClassName="m-1"
            type="textarea"
            rows="3"
            maxLength="750"
          />
        </Col>
      </Col>
      <Col xs={12} sm={6} lg={6} md={6}>
        <Col xs={12} sm={12} lg={12} md={12} className="mt-2">
          <FormikAutocomplete
            name={productType.name}
            label={productType.label}
            isRequired={productType.isRequired}
            formGroupClassName="m-1"
            labelClassName="mb-2"
            size="small"
            open={openType}
            onOpen={() => {
              setOpenType(true);
            }}
            onClose={() => {
              setOpenType(false);
            }}
            value={type && type.name ? type.name : getType(type)}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={typeOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                className="without-padding"
                placeholder="Type"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </Col>
        <Col xs={12} sm={12} lg={12} md={12}>
          <FormikAutocomplete
            name={categoryId.name}
            label={categoryId.label}
            formGroupClassName="m-1"
            labelClassName="mb-2"
            size="small"
            isRequired={categoryId.isRequired}
            open={openCategoryId}
            onOpen={() => {
              setOpenCategoryId(true);
            }}
            onClose={() => {
              setOpenCategoryId(false);
            }}
            value={categ_id && categ_id.display_name ? categ_id.display_name : getOldData(categ_id)}
            loading={productCategoryInfo && productCategoryInfo.loading}
            getOptionSelected={(option, value) => option.display_name === value.display_name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.display_name)}
            options={productCategoryOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                className="without-padding"
                placeholder="Category"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {productCategoryInfo && productCategoryInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </Col>
        <Col xs={12} sm={12} lg={12} md={12}>
          <InputField
            name={salesprice.name}
            label={salesprice.label}
            value={list_price || ''}
            type="text"
            formGroupClassName="m-1"
            maxLength="30"
            onKeyPress={decimalKeyPress}
          />
        </Col>

        <Col xs={12} sm={12} lg={12} md={12}>
          <InputField
            name={volumeId.name}
            label={volumeId.label}
            value={volume}
            type="text"
            formGroupClassName="m-1"
            maxLength="30"
            onKeyPress={decimalKeyPress}
          />
        </Col>
        <Col xs={12} sm={12} lg={12} md={12}>
          <InputField
            name={weightId.name}
            label={weightId.label}
            value={weight}
            type="text"
            formGroupClassName="m-1"
            maxLength="30"
            onKeyPress={decimalKeyPress}
          />
        </Col>
      </Col>
    </Row>
  );
};
BasicForm.propTypes = {
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  isEdit: PropTypes.bool,
};
BasicForm.defaultProps = {
  isEdit: false,
};
export default BasicForm;
