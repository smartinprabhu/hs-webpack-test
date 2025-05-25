/* eslint-disable consistent-return */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {
  TextField, CircularProgress,
  FormHelperText,
} from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';
import {
  Spinner,
} from 'reactstrap';
import { useFormikContext } from 'formik';
import { makeStyles } from '@material-ui/core/styles';
import { Cascader, Divider } from 'antd';
import moment from 'moment';
import { IoCloseOutline } from 'react-icons/io5';
import dayjs from 'dayjs';
import {
  Dialog, DialogContent, DialogContentText, ListItemText, Typography, Box,
} from '@mui/material';

import ModalHeaderComponent from '@shared/modalHeaderComponent';
import ErrorContent from '@shared/errorContent';
import envelopeIcon from '@images/icons/envelope.svg';
import telephoneIcon from '@images/icons/telephone.svg';
import {
  InputField, FormikAutocomplete, DateTimeField,
} from '@shared/formFields';
import { AddThemeColor } from '../../../themes/theme';
import {
  generateErrorMessage,
  extractOptionsObject,
  getAllCompanies,
  decimalKeyPressDown,
  getDateTimeSeconds,
  getListOfModuleOperations,
  preprocessData,
} from '../../../util/appUtils';
import {
  getCommodity, getTankerTransaction,
} from '../../tankerService';
import { getCascader } from '../../../helpdesk/ticketService';
import {
  getMeasures,
} from '../../../purchase/purchaseService';
import {
  getPartners, getBuildings, getAllSpaces,
} from '../../../assets/equipmentService';
import { addParents, addChildrens } from '../../../helpdesk/utils/utils';
import AdvancedSearchModal from './advancedSearchModal';
import SearchModalMultiple from './searchModalMultiple';
import MuiAutoComplete from '../../../commonComponents/formFields/muiAutocomplete';
import MuiTextField from '../../../commonComponents/formFields/muiTextField';
import MuiTextarea from '../../../commonComponents/formFields/muiTextarea';
import MuiDateTimeField from '../../../commonComponents/formFields/muiDateTimeField';
import DialogHeader from '../../../commonComponents/dialogHeader';
import actionCodes from '../../data/actionCodes.json';

import {
  resetCreateProductCategory,
} from '../../../pantryManagement/pantryService';

import AddTanker from '../addTanker';

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
  root: {
    // input label when focused
    '& label.Mui-focused': {
      color: AddThemeColor({}).color,
    },
    // focused color for input with variant='standard'
    '& .MuiInput-underline:after': {
      borderBottomColor: AddThemeColor({}).color,
    },
    // focused color for input with variant='filled'
    '& .MuiFilledInput-underline:after': {
      borderBottomColor: AddThemeColor({}).color,
    },
    // focused color for input with variant='outlined'
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': {
        borderColor: AddThemeColor({}).color,
      },
    },
  },
});

const TransactionBasicForm = React.memo((props) => {
  const {
    editId,
    setFieldValue,
    setFieldTouched,
    addModal,
    formField: {
      tankerId,
      name,
      commodityId,
      vendorId,
      capacityValue,
      uomId,
      blockId,
      deliveryChallan,
      initialReading,
      inData,
      remark,
      outData,
      amountVal,
      finalReading,
    },
  } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const { values: formValues } = useFormikContext();
  const {
    commodity, uom_id, vendor_id, tanker_id, location_id, in_datetime, out_datetime,
  } = formValues;
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const [tankerOpen, setTankerOpen] = useState(false);
  const [tankerKeyword, setTankerKeyword] = useState('');
  const [commodityOpen, setCommodityOpen] = useState(false);
  const [commodityKeyword, setCommodityKeyword] = useState('');
  const [uomOpen, setUomOpen] = useState(false);
  const [uomKeyword, setUomKeyword] = useState('');
  const [customerOpen, setCustomerOpen] = useState(false);
  const [customerKeyword, setCustomerKeyword] = useState('');

  const [cascaderValues, setCascaderValues] = useState([]);
  const [childValues, setChildValues] = useState([]);
  const [parentId, setParentId] = useState('');
  const [spaceIds, setSpaceIds] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [columns, setColumns] = useState(['id', 'name']);
  const [extraModal, setExtraModal] = useState(false);
  const [extraMultipleModal, setExtraMultipleModal] = useState(false);
  const defaultInDate = in_datetime && editId ? dayjs(moment.utc(in_datetime).local().tz(userInfo?.data?.timezone).format('YYYY-MM-DD HH:mm:ss')) : null;
  const [selectedDate, setDateChange] = useState(defaultInDate);

  const defaultOutDate = out_datetime && editId ? dayjs(moment.utc(out_datetime).local().tz(userInfo?.data?.timezone).format('YYYY-MM-DD HH:mm:ss')) : null;
  const [selectedDate1, setDateChange1] = useState(defaultOutDate);

  const [isAddTanker, showAddTanker] = useState(false);

  const {
    commodityInfo, tankerDataInfo, tankerTransactionDetail,
  } = useSelector((state) => state.tanker);
  const {
    partnersInfo, buildingsInfo, buildingSpaces,
  } = useSelector((state) => state.equipment);
  const {
    measuresInfo,
  } = useSelector((state) => state.purchase);
  const {
    spaceCascader,
  } = useSelector((state) => state.ticket);
  const {
    addProductCategoryInfo,
  } = useSelector((state) => state.pantry);

  const companies = getAllCompanies(userInfo, userRoles);

  const detailedData = tankerTransactionDetail && (tankerTransactionDetail.data && tankerTransactionDetail.data.length > 0) ? tankerTransactionDetail.data[0] : false;

  const noData = tankerDataInfo && tankerDataInfo.data && !tankerDataInfo.data.length;

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Commodity Transactions', 'code');

  const isCreatable = allowedOperations.includes(actionCodes['Create Tanker']);

  useEffect(() => {
    if (((userInfo && userInfo.data) && isCreatable && noData && (tankerKeyword && tankerKeyword.length > 3) && !extraMultipleModal)) {
      setTankerOpen(false);
    }
  }, [userInfo, tankerKeyword, tankerDataInfo]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      dispatch(getBuildings(companies, appModels.SPACE));
    }
  }, [userInfo]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (buildingsInfo && buildingsInfo.data)) {
      setChildValues(addParents(buildingsInfo.data));
    }
  }, [buildingsInfo]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (buildingSpaces && buildingSpaces.data && buildingSpaces.data.length && parentId)) {
      const childData = addChildrens(childValues, buildingSpaces.data[0].child, parentId);
      setChildValues(childData);
    }
  }, [buildingSpaces, parentId]);

  useEffect(() => {
    if (childValues) {
      setCascaderValues(childValues);
    }
  }, [childValues]);

  useEffect(() => {
    if (cascaderValues) {
      dispatch(getCascader(cascaderValues));
    }
  }, [cascaderValues, buildingSpaces]);

  useEffect(() => {
    if (userInfo && userInfo.data && tankerOpen) {
      dispatch(getTankerTransaction(companies, appModels.TANKERS, tankerKeyword));
    }
  }, [userInfo, tankerOpen, tankerKeyword]);

  useEffect(() => {
    if (userInfo && userInfo.data && commodityOpen) {
      dispatch(getCommodity(companies, appModels.TANKERCOMMODITY, commodityKeyword));
    }
  }, [userInfo, commodityOpen, commodityKeyword]);

  useEffect(() => {
    if (userInfo && userInfo.data && uomOpen) {
      dispatch(getMeasures(appModels.UOM, uomKeyword));
    }
  }, [uomOpen, uomKeyword]);

  useEffect(() => {
    if (userInfo && userInfo.data && customerOpen) {
      dispatch(getPartners(companies, appModels.PARTNER, 'supplier', customerKeyword));
    }
  }, [userInfo, customerKeyword, customerOpen]);

  // useEffect(() => {
  //   if (!editId) {
  //     setFieldValue('in_datetime', moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss'));
  //   }
  // }, [editId]);

  useEffect(() => {
    if (tanker_id && Object.keys(tanker_id).length && Object.keys(tanker_id).length > 0) {
      const vendorData = tanker_id.vendor_id ? tanker_id.vendor_id : '';
      const commodityData = tanker_id.commodity ? tanker_id.commodity : '';
      const uomData = tanker_id.uom_id ? tanker_id.uom_id : '';
      const capacityVal = tanker_id.capacity ? tanker_id.capacity : '';
      const registrationNo = tanker_id.name ? tanker_id.name : '';
      if (vendorData && Object.keys(vendorData).length && Object.keys(vendorData).length > 0) {
        setFieldValue('vendor_id', { id: vendorData.id, name: vendorData.name });
      }
      if (commodityData && Object.keys(commodityData).length && Object.keys(commodityData).length > 0) {
        setFieldValue('commodity', { id: commodityData.id, name: commodityData.name });
        setFieldValue('is_enable_amount', commodityData.is_enable_amount);
      }
      if (uomData && Object.keys(uomData).length && Object.keys(uomData).length > 0) {
        setFieldValue('uom_id', { id: uomData.id, name: uomData.name });
      }
      setFieldValue('capacity', capacityVal);
      setFieldValue('name', registrationNo);
    }
  }, [tanker_id]);

  let categoryOptions = [];

  if (commodityInfo && commodityInfo.loading) {
    categoryOptions = [{ name: 'Loading..' }];
  }

  if (commodityInfo && commodityInfo.data) {
    categoryOptions = commodityInfo.data;
  }
  const uomOptions = extractOptionsObject(measuresInfo, uom_id);
  const customerOptions = extractOptionsObject(partnersInfo, vendor_id);
  const tankerOptions = extractOptionsObject(tankerDataInfo, tanker_id);

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

  const onCommodityKeywordChange = (event) => {
    setCommodityKeyword(event.target.value);
  };

  const onUomKeyWordChange = (event) => {
    setUomKeyword(event.target.value);
  };

  const onCustomerKeywordChange = (event) => {
    setCustomerKeyword(event.target.value);
  };

  const showTankerModal = () => {
    setModelValue(appModels.TANKERS);
    setFieldName('tanker_id');
    setModalName('Tankers');
    setOtherFieldName('');
    setOtherFieldValue('');
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setColumns(['id', 'name', 'vendor_id', 'commodity', 'uom_id', 'is_enable_amount', 'capacity']);
    setExtraMultipleModal(true);
  };

  const onTankerKeywordChange = (event) => {
    setTankerKeyword(event.target.value);
  };

  const onTankerKeywordClear = () => {
    setTankerKeyword(null);
    setFieldValue('tanker_id', '');
    setTankerOpen(false);
    setFieldValue('vendor_id', '');
    setFieldValue('commodity', '');
    setFieldValue('uom_id', '');
    setFieldValue('capacity', '');
    setFieldValue('name', '');
    setFieldValue('is_enable_amount', false);
  };

  const isUserError = userInfo && userInfo.err;
  const loading = (userInfo && userInfo.loading) || (buildingsInfo && buildingsInfo.loading) || (buildingSpaces && buildingSpaces.loading);
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (buildingsInfo && buildingsInfo.err) ? generateErrorMessage(buildingsInfo) : userErrorMsg;
  const errorMsg1 = (buildingSpaces && buildingSpaces.err) ? generateErrorMessage(buildingSpaces) : userErrorMsg;

  const onChange = (value, selectedOptions) => {
    setParentId('');
    if (selectedOptions && selectedOptions.length) {
      if (!selectedOptions[0].parent_id) {
        setParentId(selectedOptions[0].id);
        setSpaceIds(selectedOptions[0].id);
        if (spaceIds !== selectedOptions[0].id) {
          dispatch(getAllSpaces(selectedOptions[0].id, companies));
        }
      }
    }
    setFieldValue(blockId.name, value);
  };

  const dropdownRender = (menus) => (
    <div>
      {menus}
      {loading && (
        <>
          <Divider style={{ margin: 0 }} />
          <div className="text-center p-2" data-testid="loading-case">
            <Spinner animation="border" size="sm" className="text-dark ml-3" variant="secondary" />
          </div>
        </>
      )}
      {((buildingsInfo && buildingsInfo.err) || isUserError) && (
        <>
          <Divider style={{ margin: 0 }} />
          <ErrorContent errorTxt={errorMsg} />
        </>
      )}
      {((buildingSpaces && buildingSpaces.err) || isUserError) && (
        <>
          <Divider style={{ margin: 0 }} />
          <ErrorContent errorTxt={errorMsg1} />
        </>
      )}
    </div>
  );

  useEffect(() => {
    if (addModal && !editId) {
      setFieldValue('in_datetime', dayjs(new Date()).add(2, 'seconds'));
    }
  }, [addModal]);

  useEffect(() => {
    if (in_datetime && out_datetime) {
      if (new Date(in_datetime) >= new Date(out_datetime)) {
        setFieldValue('date_valid', '');
      } else {
        setFieldValue('date_valid', 'yes');
      }
    }
  }, [in_datetime, out_datetime]);

  const handleDateChange = (date) => {
    setDateChange(date);
    setFieldValue('in_datetime', date);
  };

  const handleDateChange1 = (date) => {
    setDateChange1(date);
    setFieldValue('out_datetime', date);
  };

  const loadData = () => { };

  const closeModal = () => {
    showAddTanker(false);
    dispatch(resetCreateProductCategory());
  };

  return (
    <>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          gap: '3%',
        }}
      >
        <Box
          sx={{
            width: '50%',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <MuiAutoComplete
            sx={{
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            name={tankerId.name}
            label={tankerId.label}
            isRequired
            open={tankerOpen}
            oldValue={getOldData(tanker_id)}
            value={tanker_id && tanker_id.name ? tanker_id.name : getOldData(tanker_id)}
            size="small"
            onOpen={() => {
              setTankerOpen(true);
              setTankerKeyword('');
            }}
            onClose={() => {
              setTankerOpen(false);
              setTankerKeyword('');
            }}
            classes={{
              root: classes.root,
            }}
            loading={tankerDataInfo && tankerDataInfo.loading && tankerOpen}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            apiError={(tankerDataInfo && tankerDataInfo.err) ? generateErrorMessage(tankerDataInfo) : false}
            options={tankerOptions}
            renderOption={(props, option) => (
              <>
                <ListItemText
                  {...props}
                  primary={(
                    <Typography
                      sx={{
                        font: 'Suisse Intl',
                        fontWeight: 500,
                        fontSize: '15px',
                      }}
                    >
                      {option.name}
                    </Typography>
                  )}
                />
                <Divider className="m-0 p-0" />
              </>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onTankerKeywordChange}
                variant="standard"
                label={`${tankerId.label}`}
                required
                // value={tankerKeyword}
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {tankerDataInfo && tankerDataInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {((getOldData(tanker_id)) || (tanker_id && tanker_id.id) || (tankerKeyword && tankerKeyword.length > 0)) && (
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={onTankerKeywordClear}
                          >
                            <IoCloseOutline size={22} fontSize="small" />
                          </IconButton>
                        )}
                        <IconButton
                          aria-label="toggle search visibility"
                          onClick={showTankerModal}
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
          {(!(tanker_id && tanker_id.name) && noData && isCreatable && (tankerKeyword && tankerKeyword.length > 3)
                && (addProductCategoryInfo && !addProductCategoryInfo.err) && (addProductCategoryInfo && !addProductCategoryInfo.data)) && (
                <FormHelperText>
                  <span>{`New Tanker "${tankerKeyword}" will be created. Do you want to create..? Click`}</span>
                  <span aria-hidden="true" onClick={() => showAddTanker(true)} className="text-info ml-2 cursor-pointer">YES</span>
                </FormHelperText>
          )}
          <MuiTextField
            sx={{
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            name={capacityValue.name}
            label={capacityValue.label}
            autoComplete="off"
            type="text"
            disabled
            formGroupClassName="m-1"
            inputProps={{
              maxLength: 10,
            }}
            onKeyDown={decimalKeyPressDown}
          />
          <MuiAutoComplete
            sx={{
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            name={uomId.name}
            label={uomId.label}
            formGroupClassName="m-1"
            oldValue={getOldData(uom_id)}
            value={uom_id && uom_id.name ? uom_id.name : getOldData(uom_id)}
            apiError={(measuresInfo && measuresInfo.err) ? generateErrorMessage(measuresInfo) : false}
            open={uomOpen}
            disabled
            size="small"
            onOpen={() => {
              setUomOpen(true);
              setUomKeyword('');
            }}
            onClose={() => {
              setUomOpen(false);
              setUomKeyword('');
            }}
            classes={{
              root: classes.root,
            }}
            loading={measuresInfo && measuresInfo.loading}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={uomOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onUomKeyWordChange}
                variant="standard"
                label={uomId.label}
                value={uomKeyword}
                className={((getOldData(uom_id)) || (uom_id && uom_id.id) || (uomKeyword && uomKeyword.length > 0))
                  ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {measuresInfo && measuresInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                    </>
                  ),
                }}
              />
            )}
          />
          <MuiTextField
            sx={{
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            name={name.name}
            label={name.label}
            autoComplete="off"
            type="text"
            formGroupClassName="m-1"
            inputProps={{
              maxLength: 30,
            }}
            disabled
          />
          <MuiAutoComplete
            sx={{
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            name={commodityId.name}
            label={commodityId.label}
            formGroupClassName="m-1"
            open={commodityOpen}
            oldValue={getOldData(commodity)}
            value={commodity && commodity.name ? commodity.name : getOldData(commodity)}
            size="small"
            onOpen={() => {
              setCommodityOpen(true);
              setCommodityKeyword('');
            }}
            onClose={() => {
              setCommodityOpen(false);
              setCommodityKeyword('');
            }}
            classes={{
              root: classes.root,
            }}
            disabled
            loading={commodityInfo && commodityInfo.loading && commodityOpen}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            apiError={(commodityInfo && commodityInfo.err) ? generateErrorMessage(commodityInfo) : false}
            options={categoryOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onCommodityKeywordChange}
                variant="standard"
                label={commodityId.label}
                value={commodityKeyword}
                className={((getOldData(commodity)) || (commodity && commodity.id) || (commodityKeyword && commodityKeyword.length > 0))
                  ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {commodityInfo && commodityInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                    </>
                  ),
                }}
              />
            )}
          />
          <MuiAutoComplete
            sx={{
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            name={vendorId.name}
            label={vendorId.label}
            formGroupClassName="m-1"
            oldValue={getOldData(vendor_id)}
            value={vendor_id && vendor_id.name ? vendor_id.name : getOldData(vendor_id)}
            apiError={(partnersInfo && partnersInfo.err) ? generateErrorMessage(partnersInfo) : false}
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
              root: classes.root,
            }}
            disabled
            loading={partnersInfo && partnersInfo.loading}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            renderOption={(option) => (
              <>
                <h6>{option.name}</h6>
                <p className="float-left">
                  {option.email && (
                    <>
                      <img src={envelopeIcon} alt="mail" height="13" width="13" className="mr-2" />
                      {option.email}
                    </>
                  )}
                </p>
                <p className="float-right">
                  {option.mobile && (
                    <>
                      <img src={telephoneIcon} alt="telephone" height="13" width="13" className="mr-2" />
                      {option.mobile}
                    </>
                  )}
                </p>
              </>
            )}
            options={customerOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onCustomerKeywordChange}
                variant="standard"
                label={vendorId.label}
                value={customerKeyword}
                className={((vendor_id && vendor_id.id) || (customerKeyword && customerKeyword.length > 0) || (vendor_id && vendor_id.length))
                  ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {partnersInfo && partnersInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                    </>
                  ),
                }}
              />
            )}
          />
          {(editId && detailedData && detailedData.is_requires_verification && detailedData.state === 'Submitted') && (
          <MuiTextarea
            sx={{
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            name={remark.name}
            label={remark.label}
            formGroupClassName="m-1"
            type="textarea"
            maxRows="1"
          />
          )}
        </Box>
        <Box
          sx={{
            width: '50%',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <span className="pb-2 d-inline-block" >
            {blockId.label}
            <span className="text-danger ml-2px">*</span>
          </span>
          <br />
          <Cascader
            options={preprocessData(spaceCascader && spaceCascader.length > 0 ? spaceCascader : [])}            
            dropdownClassName="custom-cascader-popup"
            fieldNames={{ label: 'name', value: 'id', children: 'children' }}
            defaultValue={location_id && location_id.length ? location_id : (editId ? [location_id.path_name] : [])}
            placeholder="Select"
            notFoundContent="No options"
            dropdownRender={dropdownRender}
            onChange={onChange}
            //loadData={loadData}
            className="thin-scrollbar font-size-13 antd-cascader-width-98"
            changeOnSelect
          />

          <MuiDateTimeField
            sx={{
              marginTop: '6px',
              marginBottom: '12px',
            }}
            name={inData.name}
            label={inData.label}
            isRequired
            setFieldValue={setFieldValue}
            setFieldTouched={setFieldTouched}
            placeholder={inData.label}
            disablePastDate
            value={selectedDate}
            onChange={handleDateChange}
            slotProps={{
              actionBar: {
                actions: ['clear', 'accept'],
              },
              textField: {
                variant: 'standard', error: false,
              },
            }}
          />

          {editId && detailedData && detailedData.is_requires_verification && detailedData.state === 'Submitted' && (
          <MuiDateTimeField
            sx={{
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            minDateTime={editId ? dayjs(moment.utc(in_datetime).local().tz(userInfo?.data?.timezone).format('YYYY-MM-DD HH:mm:ss')) : dayjs(in_datetime)}
            name={outData.name}
            label={outData.label}
            isRequired
            setFieldValue={setFieldValue}
            setFieldTouched={setFieldTouched}
            placeholder={outData.label}
            disablePastDate
            value={selectedDate1}
            onChange={handleDateChange1}
            isErrorHandle
            errorField="date_valid"
            slotProps={{
              actionBar: {
                actions: ['clear', 'accept'],
              },
              textField: {
                variant: 'standard', error: false,
              },
            }}
          />
          )}
          <MuiTextField
            sx={{
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            inputProps={{
              maxLength: 15,
            }}
            name={deliveryChallan.name}
            label={deliveryChallan.label}
            autoComplete="off"
            type="text"
            formGroupClassName="m-1"
          />
          <MuiTextField
            sx={{
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            name={initialReading.name}
            label={initialReading.label}
            autoComplete="off"
            type="text"
            isRequired
            formGroupClassName="m-1"
            inputProps={{
              maxLength: 10,
            }}
            onKeyDown={decimalKeyPressDown}
          />
          {editId && detailedData && detailedData.is_requires_verification && detailedData.state === 'Submitted' && (
          <>
            <MuiTextField
              sx={{
                marginTop: 'auto',
                marginBottom: '20px',
              }}
              name={finalReading.name}
              label={finalReading.label}
              autoComplete="off"
              type="text"
              isRequired
              formGroupClassName="m-1"
              inputProps={{
                maxLength: 10,
              }}
              onKeyDown={decimalKeyPressDown}
            />

            <MuiTextField
              sx={{
                marginTop: 'auto',
                marginBottom: '20px',
              }}
              name={amountVal.name}
              label={amountVal.label}
              autoComplete="off"
              type="text"
              isRequired
              formGroupClassName="m-1"
              inputProps={{
                maxLength: 10,
              }}
              onKeyDown={decimalKeyPressDown}
            />
          </>
          )}
          {!(editId && detailedData && detailedData.is_requires_verification && detailedData.state === 'Submitted') && (
          <MuiTextarea
            sx={{
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            name={remark.name}
            label={remark.label}
            formGroupClassName="m-1"
            type="textarea"
            maxRows="1"
          />
          )}
        </Box>
      </Box>
      <Dialog maxWidth="lg" open={extraModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraModal(false); }} sx={{ width: '800px' }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <AdvancedSearchModal
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
      <Dialog maxWidth="lg" open={extraMultipleModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraMultipleModal(false); }} sx={{ width: '800px' }} />
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
              tankerKeyword={tankerKeyword}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Dialog maxWidth="lg" open={isAddTanker}>
        <DialogHeader title="Add Tanker" imagePath={false} onClose={() => { showAddTanker(false); }} sx={{ width: '800px' }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <AddTanker setFieldValue={setFieldValue} tankerKeyword={tankerKeyword} closeModal={closeModal} selectedUser={false} editData={false} />
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
});

TransactionBasicForm.propTypes = {
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  setFieldTouched: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default TransactionBasicForm;
