/* eslint-disable react/forbid-prop-types */
/* eslint-disable import/no-unresolved */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  TextField,
  CircularProgress,
} from '@material-ui/core';
import { useFormikContext } from 'formik';
import {
  Box, Dialog, DialogContent, DialogContentText,
} from '@mui/material';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import { IoCloseOutline } from 'react-icons/io5';

import SearchModalSingleStatic from '@shared/searchModals/singleSearchModelStatic';

import MuiAutoComplete from '../../../../../../commonComponents/formFields/muiAutocomplete';
import MuiTextField from '../../../../../../commonComponents/formFields/muiTextField';
import MuiTextarea from '../../../../../../commonComponents/formFields/muiTextarea';
import DialogHeader from '../../../../../../commonComponents/dialogHeader';

import customData from '../../../../data/customData.json';
import { getProductCategoryInfo } from '../../../../../purchaseService';
import Attachment from './attachments';
import {
  getAllowedCompanies,
} from '../../../../../../util/appUtils';

const appModels = require('../../../../../../util/appModels').default;

const AdditionalForm = (props) => {
  const {
    setFieldValue,
    code,
    editId,
    formField: {
      companyId,
      note,
      poNo,
      dcNo,
      Priority,
      categoryId,
    },
  } = props;

  const { values: formValues } = useFormikContext();
  const {
    priority,
    product_categ_id,
  } = formValues;
  const [openCategoryId, setOpenCategoryId] = useState(false);
  const [categoryKeyword, setCategoryKeyword] = useState('');

  const [extraModal1, setExtraModal1] = useState(false);
  const [headers, setHeaders] = useState([]);
  const [oldValues, setOldValues] = useState([]);
  const [modalName, setModalName] = useState('');
  const [columns, setColumns] = useState(['id', 'name']);
  const [fieldName, setFieldName] = useState('');

  const { userInfo } = useSelector((state) => state.user);
  const { allowedCompanies } = useSelector((state) => state.setup);
  const { inventoryStatusDashboard } = useSelector((state) => state.inventory);
  const { productCategoryInfo } = useSelector((state) => state.purchase);

  const companies = getAllowedCompanies(userInfo);
  const dispatch = useDispatch();

  function isDcPoRequired(field) {
    let newStr = false;
    const pickingDataNew = inventoryStatusDashboard && inventoryStatusDashboard.data && inventoryStatusDashboard.data.Operations ? inventoryStatusDashboard.data.Operations : [];
    const pCode = code;
    const ogData = pickingDataNew.filter((item) => (item.code === pCode));
    if (ogData && ogData.length && field) {
      newStr = ogData[0][field];
    }
    return newStr;
  }

  useEffect(() => {
    setFieldValue('has_dc', isDcPoRequired('is_dc_required') ? 'Required' : 'None');
    setFieldValue('has_po', isDcPoRequired('is_po_required') ? 'Required' : 'None');
  }, []);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const userCompanyId = userInfo && userInfo.data && userInfo.data.company ? userInfo.data.company : '';
      setFieldValue('company_id', userCompanyId);
    }
  }, [userInfo]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      dispatch(getProductCategoryInfo(companies, appModels.PRODUCTCATEGORY, categoryKeyword, false, false, false, false, 'inventory'));
    }
  }, []);

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

  const onCategoryKeywordChange = (event) => {
    setCategoryKeyword(event.target.value);
  };

  const onCategoryKeywordClear = () => {
    setFieldValue('product_categ_id', '');
    setOpenCategoryId(false);
    setCategoryKeyword(null);
  };

  const showCategoryModal = () => {
    setFieldName('product_categ_id');
    setExtraModal1(true);
    setColumns(['id', 'name']);
    setHeaders(['Name']);
    setModalName('Categories');
    setOldValues(product_categ_id && product_categ_id.id ? product_categ_id.id : '');
  };

  let productCategoryOptions = [];

  if (productCategoryInfo && productCategoryInfo.loading) {
    productCategoryOptions = [{ name: 'loading' }];
  }
  if (product_categ_id && product_categ_id.length && product_categ_id.length > 0) {
    const oldId = [{ id: product_categ_id[0], name: product_categ_id[1] }];
    const newArr = [...productCategoryOptions, ...oldId];
    productCategoryOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  if (productCategoryInfo && productCategoryInfo.data && productCategoryInfo.data.length) {
    const arr = [...productCategoryOptions, ...productCategoryInfo.data];
    productCategoryOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }
  if (productCategoryInfo && productCategoryInfo.err) {
    productCategoryOptions = [];
  }

  const onDataChange = (fieldRef, data) => {
    setFieldValue(fieldRef, data);
  };

  const oldPriority = priority && customData && customData.prioritiesLabel && customData.prioritiesLabel[priority] ? customData.prioritiesLabel[priority].label : '';

  // eslint-disable-next-line no-nested-ternary
  const userCompanies = allowedCompanies && allowedCompanies.data && allowedCompanies.data.allowed_companies && allowedCompanies.data.allowed_companies.length > 0
    ? allowedCompanies.data.allowed_companies : userInfo && userInfo.data && userInfo.data.allowed_companies && userInfo.data.allowed_companies.length > 0 ? userInfo.data.allowed_companies : [];

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          gap: '35px',
        }}
      >
        {code !== 'internal' && (
          <>

            <MuiTextField
              sx={{
                marginBottom: '10px',
                width: '50%',
              }}
              name={dcNo.name}
              label={dcNo.label}
              required={isDcPoRequired('is_dc_required')}
              inputProps={{ maxLength: 50 }}
              setFieldValue={setFieldValue}
            />
            <MuiTextField
              sx={{
                marginBottom: '10px',
                width: '50%',
              }}
              name={poNo.name}
              label={poNo.label}
              required={isDcPoRequired('is_po_required')}
              inputProps={{ maxLength: 50 }}
              setFieldValue={setFieldValue}
            />
          </>
        )}
      </Box>
      {!editId && code !== 'internal' && (
      <Attachment isDcRequire={isDcPoRequired('is_dc_required')} isPoRequire={isDcPoRequired('is_po_required')} />
      )}

      <MuiTextarea
        sx={{
          marginBottom: '10px',
          width: '100%',
          // width: code !== 'internal' ? '100%' : '48%'
        }}
        name={note.name}
        label={note.label}
        inputProps={{ maxLength: 750 }}
        setFieldValue={setFieldValue}
      />

      <MuiAutoComplete
        sx={{
          marginTop: 'auto',
          marginBottom: '10px',
          width: '50%',
        }}
        name={categoryId.name}
        label={categoryId.label}
        open={openCategoryId}
        onOpen={() => {
          setOpenCategoryId(true);
          setCategoryKeyword('');
        }}
        onClose={() => {
          setOpenCategoryId(false);
          setCategoryKeyword('');
        }}
        value={product_categ_id && product_categ_id.name ? product_categ_id.name : getOldData(product_categ_id)}
        loading={productCategoryInfo && productCategoryInfo.loading}
        getOptionSelected={(option, value) => option.name === value.name}
        getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
        options={productCategoryOptions}
        renderInput={(params) => (
          <TextField
            {...params}
            onChange={onCategoryKeywordChange}
            variant="standard"
            label={`${categoryId.label}`}
            required
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {productCategoryInfo && productCategoryInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                  <InputAdornment position="end">
                    {((getOldData(product_categ_id)) || (product_categ_id && product_categ_id.id)) && (
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={onCategoryKeywordClear}
                    >
                      <IoCloseOutline size={22} fontSize="small" />
                    </IconButton>
                    )}
                    <IconButton
                      aria-label="toggle search visibility"
                      onClick={showCategoryModal}
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

      <Dialog size="xl" fullWidth open={extraModal1}>
        <DialogHeader rightButton title={modalName} imagePath={false} onClose={() => { setExtraModal1(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <SearchModalSingleStatic
              afterReset={() => { setExtraModal1(false); }}
              fieldName={fieldName}
              fields={columns}
              headers={headers}
              data={productCategoryOptions}
              setFieldValue={onDataChange}
              modalName={modalName}
              oldValues={oldValues}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>

    </>
  );
};

AdditionalForm.propTypes = {
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
  code: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default AdditionalForm;
