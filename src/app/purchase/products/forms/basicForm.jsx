/* eslint-disable react/forbid-prop-types */
/* eslint-disable prefer-destructuring */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable camelcase */
/* eslint-disable import/no-unresolved */
import closeCircleIcon from '@images/icons/closeCircle.svg';
import { CircularProgress, FormHelperText } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import {
  Dialog, DialogContent, DialogContentText, ListItemText,

  Typography, TextField, Box, Button,
} from '@mui/material';
import { useFormikContext } from 'formik';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import ReactFileReader from 'react-file-reader';
import { useDispatch, useSelector } from 'react-redux';
import { MailOutline, CallOutlined } from '@mui/icons-material';
import { IoCloseOutline } from 'react-icons/io5';

import SearchModalSingleStatic from '@shared/searchModals/singleSearchModelStatic';

import { getEmployeeList, getPartners } from '../../../assets/equipmentService';
import {
  generateErrorMessage, getAllowedCompanies, extractOptionsObject,
} from '../../../util/appUtils';
import { bytesToSize } from '../../../util/staticFunctions';
import { getMeasures, getProductCategoryInfo, getCodeExists } from '../../purchaseService';
import SearchModalMultiple from '../../rfq/forms/searchModalMultiple';
import formikInitialValues from '../formModel/formInitialValues';
import SearchModal from './searchModal';
import { AddThemeColor } from '../../../themes/theme';
import MuiAutoComplete from '../../../commonComponents/formFields/muiAutocomplete';
import MuiTextField from '../../../commonComponents/formFields/muiTextField';
import DialogHeader from '../../../commonComponents/dialogHeader';

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

const BasicForm = React.memo((props) => {
  const {
    isEdit,
    setFieldValue,
    productNameDynamic,
    productCategoryId,
    isTheme,
    formField: {
      cost,
      productName,
      categoryId,
      productType,
      sales,
      purchase,
      maintenance,
      responsible,
      unitOfMeasure,
      purchaseUnitOfMeasure,
      perferredValue,
      uniqueCode,
    },
  } = props;
  const { values: formValues } = useFormikContext();
  const {
    name, categ_id, type, unique_code, responsible_id, image_medium, uom_id, uom_po_id, preferred_vendor, standard_price,
  } = formValues;
  const classes = useStyles();
  const [openCategoryId, setOpenCategoryId] = useState(false);
  const [openType, setOpenType] = useState(false);
  const [fileType, setFileType] = useState('data:image/png;base64,');
  const [fileDataImage, setFileDataImage] = useState(image_medium);
  const [imgSize, setimgSize] = useState(false);
  const [imgValidation, setimgValidation] = useState(false);
  const [responsibleOpen, setResponsibleOpen] = useState(false);
  const [responsibleKeyword, setResponsibleKeyword] = useState('');
  const [uomOpen, setUomOpen] = useState(false);
  const [pomOpen, setPomOpen] = useState(false);
  const [uomKeyword, setUomKeyword] = useState('');
  const [customerOpen, setCustomerOpen] = useState(false);
  const [customerKeyword, setCustomerKeyword] = useState('');
  const [extraMultipleModal, setExtraMultipleModal] = useState(false);
  const [categoryKeyword, setCategoryKeyword] = useState('');
  const [extraModal, setExtraModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [columns, setColumns] = useState(['id', 'name', 'display_name']);
  const [productField, setProductField] = useState('');

  const [extraModal1, setExtraModal1] = useState(false);
  const [headers, setHeaders] = useState([]);
  const [oldValues, setOldValues] = useState([]);

  const { employeesInfo, partnersInfo } = useSelector((state) => state.equipment);
  const { productCategoryInfo, productDetailsInfo, measuresInfo } = useSelector((state) => state.purchase);
  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const dispatch = useDispatch();

  const {
    inventorySettingsInfo,
  } = useSelector((state) => state.site);

  const invSettingData = inventorySettingsInfo && inventorySettingsInfo.data && inventorySettingsInfo.data.length ? inventorySettingsInfo.data[0] : false;
  const productsListAccess = invSettingData ? invSettingData.products_list_access : false;
  const productsListId = invSettingData && productsListAccess && productsListAccess === 'Company Level' && invSettingData.product_list_company_id.id ? invSettingData.product_list_company_id.id : false;
  const companiesv1 = productsListId || getAllowedCompanies(userInfo);

  useEffect(() => {
    if (isEdit) {
      setFileDataImage(image_medium);
      setFieldValue('image_medium', image_medium);
    }
  }, [isEdit]);

  useEffect(() => {
    if (unique_code) {
      dispatch(getCodeExists(companiesv1, unique_code, appModels.PRODUCT));
    }
  }, [unique_code]);

  useEffect(() => {
    if (userInfo && userInfo.data && customerOpen) {
      dispatch(getPartners(companies, appModels.PARTNER, 'supplier', customerKeyword, false, true));
    }
  }, [userInfo, customerKeyword, customerOpen]);

  useEffect(() => {
    if (isEdit) {
      setFieldValue('name', productDetailsInfo && productDetailsInfo.data && productDetailsInfo.data.length && productDetailsInfo.data[0].name);
      setProductField(productDetailsInfo && productDetailsInfo.data && productDetailsInfo.data.length && productDetailsInfo.data[0].name);
    }
  }, [isEdit, productDetailsInfo]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      dispatch(getProductCategoryInfo(companies, appModels.PRODUCTCATEGORY, categoryKeyword, false, false, false, false, 'inventory'));
    }
  }, []);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data) {
        await dispatch(getEmployeeList(companies, appModels.USER, responsibleKeyword));
      }
    })();
  }, [userInfo, responsibleKeyword]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      let category = false;
      if (isEdit && productDetailsInfo && productDetailsInfo.data && productDetailsInfo.data.length && productDetailsInfo.data[0].uom_id && productDetailsInfo.data[0].uom_id.category_id && productDetailsInfo.data[0].uom_id.category_id.id) {
        category = productDetailsInfo.data[0].uom_id.category_id.id;
      }
      dispatch(getMeasures(appModels.UOM, uomKeyword, category));
    }
  }, [userInfo, uomKeyword, uomOpen]);

  let productCategoryOptions = [];
  let responsibleOptions = [];
  let measureOptions = [];

  if (productCategoryInfo && productCategoryInfo.loading) {
    productCategoryOptions = [{ name: 'loading' }];
  }
  if (categ_id && categ_id.length && categ_id.length > 0) {
    const oldId = [{ id: categ_id[0], name: categ_id[1] }];
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

  if (employeesInfo && employeesInfo.loading) {
    responsibleOptions = [{ name: 'Loading..' }];
  }
  if (employeesInfo && employeesInfo.data) {
    responsibleOptions = employeesInfo.data;
  }
  if (employeesInfo && employeesInfo.err) {
    responsibleOptions = [];
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

  const onResponsibleKeywordChange = (event) => {
    setResponsibleKeyword(event.target.value);
  };
  const onUomKeyWordChange = (event) => {
    setUomKeyword(event.target.value);
  };
  useEffect(() => {
    if (fileDataImage) {
      setFieldValue('image_medium', fileDataImage);
    }
  }, [fileDataImage]);

  useEffect(() => {
    if (productNameDynamic) {
      setFieldValue('name', productNameDynamic);
      setProductField(productNameDynamic);
    }
  }, [productNameDynamic]);

  const handleFiles = (files) => {
    setimgValidation(false);
    setimgSize(false);
    if (files) {
      // eslint-disable-next-line no-shadow
      const { type } = files.fileList[0];
      if (!type.includes('image')) {
        setimgValidation(true);
      } else if (!bytesToSize(files.fileList[0].size)) {
        setimgSize(true);
      } else {
        const remfile = `data:${files.fileList[0].type};base64,`;
        setFileType(remfile);
        const fileData = files.base64.replace(remfile, '');
        setFileDataImage(fileData);
      }
    }
  };
  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

  useEffect(() => {
    if (userInfo && userInfo.data) {
      setFieldValue('type', { name: 'Storable', value: 'product' });
      formikInitialValues.type = { name: 'Storable', value: 'product' };
    }
  }, [userInfo]);

  useEffect(() => {
    if (productCategoryInfo && productCategoryInfo.data && productCategoryInfo.data.length) {
      const categData = productCategoryId ? productCategoryInfo.data.find((data) => data.id === productCategoryId) : productCategoryInfo.data.find((data) => data.name === 'All');
      if (categData) {
        setFieldValue('categ_id', categData);
        formikInitialValues.categ_id = categData;
      }
    }
  }, [productCategoryInfo]);

  useEffect(() => {
    if (measuresInfo && measuresInfo.data && measuresInfo.data.length) {
      const unitData = measuresInfo.data.find((data) => data.name === 'Unit(s)');
      if (unitData && !uom_id) {
        setFieldValue('uom_id', unitData);
        formikInitialValues.uom_id = unitData;
      }
      if (unitData && !uom_po_id) {
        setFieldValue('uom_po_id', unitData);
        formikInitialValues.uom_po_id = unitData;
      }
    }
  }, [measuresInfo]);

  useEffect(() => {
    if (employeesInfo && employeesInfo.data && employeesInfo.data.length) {
      const empData = employeesInfo.data;
      if (empData && empData.length && !responsible_id) {
        formikInitialValues.responsible_id = empData[0];
        setFieldValue('responsible_id', empData[0]);
      }
    }
  }, [employeesInfo]);

  /* useEffect(() => {
    if (fileDataImage) {
      formikInitialValues.image_medium = fileDataImage;
    }
  }, [fileDataImage]); */

  const onCategoryKeywordClear = () => {
    setFieldValue('categ_id', '');
    setOpenCategoryId(false);
    setCategoryKeyword(null);
  };

  const onDataChange = (fieldRef, data) => {
    setFieldValue(fieldRef, data);
  };

  const onResponsibleKeywordClear = () => {
    setResponsibleKeyword(null);
    setFieldValue('responsible_id', '');
    setResponsibleOpen(false);
  };

  const showCategoryModal = () => {
    setFieldName('categ_id');
    setExtraModal1(true);
    setColumns(['id', 'name']);
    setHeaders(['Name']);
    setModalName('Categories');
    setOldValues(categ_id && categ_id.id ? categ_id.id : '');
  };

  const showResponsibleModal = () => {
    setModelValue(appModels.USER);
    setFieldName('responsible_id');
    setModalName('Responsible List');
    setOtherFieldName('');
    setOtherFieldValue('');
    setCompanyValue(companies);
    setExtraModal(true);
  };

  const showRequestorModal = () => {
    setModelValue(appModels.PARTNER);
    setFieldName('preferred_vendor');
    setModalName('Vendors');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(companies);
    setColumns(['id', 'name', 'email', 'mobile', 'display_name']);
    setExtraMultipleModal(true);
  };

  const onKeywordClear = () => {
    setCustomerKeyword(null);
    setFieldValue('preferred_vendor', '');
    setCustomerOpen(false);
  };

  const onCategoryKeywordChange = (event) => {
    setCategoryKeyword(event.target.value);
  };

  const onCustomerKeywordChange = (event) => {
    setCustomerKeyword(event.target.value);
  };

  /* let customerOptions = [];

  if (partnersInfo && partnersInfo.loading) {
    customerOptions = [{ name: 'Loading..' }];
  }

  if (productDetailsInfo && productDetailsInfo.data && productDetailsInfo.data.length && productDetailsInfo.data[0] && productDetailsInfo.data[0].preferred_vendor && productDetailsInfo.data[0].preferred_vendor.id) {
    const oldPartId = [{ id: productDetailsInfo.data[0].preferred_vendor.id, name: productDetailsInfo.data[0].preferred_vendor.name }];
    const newArr = [...customerOptions, ...oldPartId];
    customerOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }

  if (partnersInfo && partnersInfo.err) {
    customerOptions = [];
  }

  if (partnersInfo && partnersInfo.data) {
    const arr = [...customerOptions, ...partnersInfo.data];
    customerOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  } */

  const customerOptions = extractOptionsObject(partnersInfo, preferred_vendor);

  const setNameFieldValue = (field, value, func) => {
    if (value.indexOf(' ') !== 0) {
      func(field, value);
      setProductField(value);
    } else {
      func(field, '');
      setProductField('');
    }
  };

  return (
    <Box
      sx={{
        marginTop: '20px',
        width: isTheme ? '100%' : '50%',
        gap: '35px',
      }}
    >
      <Typography
        sx={AddThemeColor({
          font: 'normal normal medium 20px/24px Suisse Intl',
          letterSpacing: '0.7px',
          fontWeight: 500,
          marginBottom: '10px',
          paddingBottom: '4px',
        })}
      >
        General Information
      </Typography>
      <MuiTextField
        sx={{
          marginBottom: '10px',
        }}
        name={productName.name}
        label={productName.label}
        isRequired
        inputProps={{ maxLength: 100 }}
        setFieldValue={setFieldValue}
        value={productField}
        onChange={(e) => { setNameFieldValue(productName.name, e.target.value, setFieldValue); }}
      />
      <MuiTextField
        sx={{
          marginBottom: '10px',
        }}
        name={uniqueCode.name}
        label={uniqueCode.label}
        setFieldValue={setFieldValue}
        inputProps={{ maxLength: 30 }}
        value={unique_code || ''}
      />
      <MuiAutoComplete
        sx={{
          marginTop: 'auto',
          marginBottom: '10px',
        }}
        name={unitOfMeasure.name}
        label={unitOfMeasure.label}
        isRequired={unitOfMeasure.isRequired}
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
            required={unitOfMeasure.isRequired}
            onChange={onUomKeyWordChange}
            label={`${unitOfMeasure.label}`}
            variant="standard"
          />
        )}
      />
      {(measuresInfo && measuresInfo.err && measuresInfo) && (<FormHelperText><span className="text-danger">{generateErrorMessage(measuresInfo)}</span></FormHelperText>)}
      <MuiAutoComplete
        sx={{
          marginTop: 'auto',
          marginBottom: '10px',
        }}
        name={perferredValue.name}
        label={perferredValue.label}
        formGroupClassName="m-1"
        oldValue={getOldData(preferred_vendor)}
        value={preferred_vendor && preferred_vendor.name ? preferred_vendor.name : getOldData(preferred_vendor)}
        open={customerOpen}
        size="small"
        onOpen={() => {
          setCustomerOpen(true);
          setCustomerKeyword('');
        }}
        onClose={() => {
          setCustomerOpen(false);
          setCustomerKeyword('');
        }}
        classes={{
          option: classes.option,
        }}
        loading={partnersInfo && partnersInfo.loading}
        getOptionSelected={(option, value) => option.name === value.name}
        getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
        renderOption={(props, option) => (
          <ListItemText
            {...props}
            primary={(
              <>
                <Box>
                  <Typography
                    sx={{
                      font: 'Suisse Intl',
                      fontWeight: 500,
                      fontSize: '15px',
                    }}
                  >
                    {option.name}
                  </Typography>
                </Box>
                {option?.email && (
                  <Box>
                    <Typography
                      sx={{
                        font: 'Suisse Intl',
                        fontSize: '12px',
                      }}
                    >
                      <MailOutline
                        style={{ height: '15px' }}
                        cursor="pointer"
                      />
                      {option?.email}
                    </Typography>
                  </Box>
                )}
                {option?.mobile && (
                  <Box>
                    <Typography
                      sx={{
                        font: 'Suisse Intl',
                        fontSize: '12px',
                      }}
                    >
                      <CallOutlined
                        style={{ height: '15px' }}
                        cursor="pointer"
                      />
                      <span>{option.mobile}</span>
                    </Typography>
                  </Box>
                )}
              </>
            )}
          />
        )}
        options={customerOptions}
        renderInput={(params) => (
          <TextField
            {...params}
            onChange={onCustomerKeywordChange}
            variant="standard"
            label={perferredValue.label}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {partnersInfo && partnersInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                  <InputAdornment position="end">
                    {((preferred_vendor && preferred_vendor.id) || (customerKeyword && customerKeyword.length > 0)) && (

                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={onKeywordClear}
                      >
                        <IoCloseOutline size={22} fontSize="small" />
                      </IconButton>
                    )}
                    <IconButton
                      aria-label="toggle search visibility"
                      onClick={showRequestorModal}
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
      {(partnersInfo && partnersInfo.err) && (
        <FormHelperText><span className="text-danger">{generateErrorMessage(partnersInfo)}</span></FormHelperText>
      )}
      <MuiAutoComplete
        sx={{
          marginTop: 'auto',
          marginBottom: '10px',
        }}
        name={categoryId.name}
        label={categoryId.label}
        isRequired={categoryId.isRequired}
        open={openCategoryId}
        onOpen={() => {
          setOpenCategoryId(true);
          setCategoryKeyword('');
        }}
        onClose={() => {
          setOpenCategoryId(false);
          setCategoryKeyword('');
        }}
        value={categ_id && categ_id.name ? categ_id.name : getOldData(categ_id)}
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
                    {((getOldData(categ_id)) || (categ_id && categ_id.id)) && (
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
      <Typography
        sx={{
          font: 'normal normal normal 16px Suisse Intl',
          letterSpacing: '0.63px',
          color: '#000000',
          marginBottom: '10px',
        }}
      >
        Product Image
      </Typography>
      {!fileDataImage && !image_medium && (
        <Box
          sx={{
            padding: '20px',
            border: '1px dashed #868686',
            width: '100%',
            display: 'block',
            alignItems: 'center',
            borderRadius: '4px',
          }}
        >
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <ReactFileReader
                handleFiles={handleFiles}
                elementId="fileUploads"
                fileTypes={['.csv', '.png', '.jpg', '.jpeg', '.svg', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pdf']}
                base64
              >
                <Button
                  variant="contained"
                  component="label"
                >
                  Upload
                </Button>
              </ReactFileReader>
            </Box>
            <Box>
              <Typography
                sx={{
                  font: 'normal normal normal 14px Suisse Intl',
                  letterSpacing: '0.63px',
                  color: '#000000',
                  marginBottom: '10px',
                  marginTop: '10px',
                  marginLeft: '5px',
                  justifyContent: 'center',
                  display: 'flex',
                }}
              >
                (Upload files less than 20 MB)
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
      {(!fileDataImage && (isEdit && image_medium)) && (
        <div className="position-relative mt-2">
          <img
            src={`data:image/png;base64,${productDetailsInfo.data[0].image_medium}`}
            height="150"
            width="150"
            className="ml-3"
            alt="uploaded"
          />
          <div className="position-absolute topright-img-close">
            <img
              aria-hidden="true"
              src={closeCircleIcon}
              className="cursor-pointer"
              onClick={() => {
                setimgValidation(false);
                setimgSize(false);
                setFileDataImage(false);
                setFileType(false);
                setFieldValue('image_medium', false);
              }}
              alt="remove"
            />
          </div>
        </div>
      )}
      {fileDataImage && (
        <div className="position-relative">
          <img
            src={`${fileType}${fileDataImage}`}
            height="150"
            width="150"
            className="ml-3"
            alt="uploaded"
          />
          <div className="position-absolute topright-img-close">
            <img
              aria-hidden="true"
              src={closeCircleIcon}
              className="cursor-pointer"
              onClick={() => {
                setimgValidation(false);
                setimgSize(false);
                setFileDataImage(false);
                setFileType(false);
                setFieldValue('image_medium', false);
              }}
              alt="remove"
            />
          </div>
        </div>
      )}
      {imgValidation && (<FormHelperText><span className="text-danger">Choose Image Only...</span></FormHelperText>)}
      {imgSize && (<FormHelperText><span className="text-danger">Maximum File Upload Size 20MB...</span></FormHelperText>)}

      <Dialog size="lg" fullWidth open={extraModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraModal(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <SearchModal
              modelName={modelValue}
              afterReset={() => { setExtraModal(false); }}
              fieldName={fieldName}
              fields={columns}
              company={companyValue}
              otherFieldName={otherFieldName}
              otherFieldValue={otherFieldValue}
              setFieldValue={setFieldValue}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>

      <Dialog size="lg" fullWidth open={extraMultipleModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraMultipleModal(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <SearchModalMultiple
              modelName={modelValue}
              afterReset={() => { setExtraMultipleModal(false); }}
              fieldName={fieldName}
              fields={columns}
              company={companyValue}
              otherFieldName={otherFieldName}
              otherFieldValue={otherFieldValue}
              setFieldValue={setFieldValue}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
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
    </Box>
  );
});

BasicForm.propTypes = {
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
  setFieldValue: PropTypes.func.isRequired,
  isEdit: PropTypes.bool,
  productNameDynamic: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
};

BasicForm.defaultProps = {
  isEdit: false,
  productNameDynamic: false,
};
export default BasicForm;
