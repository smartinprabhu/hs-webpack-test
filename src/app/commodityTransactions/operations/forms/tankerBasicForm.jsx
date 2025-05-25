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
  Row, Col, Modal, ModalBody,
} from 'reactstrap';
import { useFormikContext } from 'formik';
import { makeStyles } from '@material-ui/core/styles';
import { IoCloseOutline } from 'react-icons/io5';
import dayjs from 'dayjs';
import {
  Dialog, DialogContent, DialogContentText, ListItemText, Typography, Box, Divider,
} from '@mui/material';
import { CallOutlined, MailOutline } from '@mui/icons-material';

import envelopeIcon from '@images/icons/envelope.svg';
import telephoneIcon from '@images/icons/telephone.svg';
import {
  InputField, FormikAutocomplete,
} from '@shared/formFields';
import MuiAutoComplete from '../../../commonComponents/formFields/muiAutocomplete';
import MuiTextField from '../../../commonComponents/formFields/muiTextField';
import DialogHeader from '../../../commonComponents/dialogHeader';
import { AddThemeColor } from '../../../themes/theme';
import {
  generateErrorMessage,
  extractOptionsObject,
  getAllCompanies,
  decimalKeyPressDown,
  getListOfModuleOperations,
} from '../../../util/appUtils';
import {
  getCommodity,
} from '../../tankerService';
import {
  getMeasures,
} from '../../../purchase/purchaseService';
import {
  getPartners,
} from '../../../assets/equipmentService';
import AdvancedSearchModal from './advancedSearchModal';
import SearchModalMultiple from './searchModalMultiple';
import AddCustomer from '../../../adminSetup/siteConfiguration/addTenant/addCustomer';
import actionCodes from '../../data/actionCodes.json';

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

const TankerBasicForm = React.memo((props) => {
  const {
    setFieldValue,
    editId,
    tankerKeyword,
    formField: {
      name,
      commodityId,
      vendorId,
      capacityValue,
      uomId,
    },
  } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const { values: formValues } = useFormikContext();
  const {
    commodity, uom_id, vendor_id,
  } = formValues;
  const [commodityOpen, setCommodityOpen] = useState(false);
  const [commodityKeyword, setCommodityKeyword] = useState('');
  const [uomOpen, setUomOpen] = useState(false);
  const [uomKeyword, setUomKeyword] = useState('');
  const [customerOpen, setCustomerOpen] = useState(false);
  const [customerKeyword, setCustomerKeyword] = useState('');

  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [columns, setColumns] = useState(['id', 'name']);
  const [extraModal, setExtraModal] = useState(false);
  const [extraMultipleModal, setExtraMultipleModal] = useState(false);

  const [addCustomerModal, setAddCustomerModal] = useState(false);

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const {
    commodityInfo,
  } = useSelector((state) => state.tanker);
  const {
    partnersInfo,
  } = useSelector((state) => state.equipment);
  const {
    measuresInfo,
  } = useSelector((state) => state.purchase);

  const {
    createTenantinfo,
  } = useSelector((state) => state.setup);

  const companies = getAllCompanies(userInfo, userRoles);

  const noData = partnersInfo && partnersInfo.err ? partnersInfo.err.data : false;

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Commodity Transactions', 'code');

  const isCreatable = allowedOperations.includes(actionCodes['Add Vendors']);

  useEffect(() => {
    if (((userInfo && userInfo.data) && isCreatable && (noData && (noData.status_code && noData.status_code === 404)) && (customerKeyword && customerKeyword.length > 3) && !extraModal)) {
      setCustomerOpen(false);
    }
  }, [userInfo, customerKeyword, partnersInfo]);

  useEffect(() => {
    if (tankerKeyword) {
      setFieldValue('name', tankerKeyword);
    }
  }, [tankerKeyword]);

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
      dispatch(getPartners(companies, appModels.PARTNER, 'supplier', customerKeyword, false, true));
    }
  }, [userInfo, customerKeyword, customerOpen]);

  let categoryOptions = [];

  if (commodityInfo && commodityInfo.loading) {
    categoryOptions = [{ name: 'Loading..' }];
  }

  if (commodityInfo && commodityInfo.data) {
    categoryOptions = commodityInfo.data;
  }
  const uomOptions = extractOptionsObject(measuresInfo, uom_id);
  const customerOptions = extractOptionsObject(partnersInfo, vendor_id);
  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

  const showSearchModal = () => {
    setModelValue(appModels.TANKERCOMMODITY);
    setFieldName('commodity');
    setModalName('Commodity');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(companies);
    setExtraModal(true);
  };

  const onCommodityKeywordChange = (event) => {
    setCommodityKeyword(event.target.value);
  };

  const onCommodityKeywordClear = () => {
    setCommodityKeyword(null);
    setFieldValue('commodity', '');
    setCommodityOpen(false);
  };

  const onUomKeyWordChange = (event) => {
    setUomKeyword(event.target.value);
  };

  const onUomClear = () => {
    setUomKeyword(null);
    setFieldValue('uom_id', '');
    setUomOpen(false);
  };

  const showUomModal = () => {
    setModelValue(appModels.UOM);
    setColumns(['id', 'name']);
    setFieldName('uom_id');
    setModalName('UOM List');
    setCompanyValue('');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setExtraModal(true);
  };

  const showRequestorModal = () => {
    setModelValue(appModels.PARTNER);
    setFieldName('vendor_id');
    setModalName('Vendors');
    setOtherFieldName('supplier');
    setOtherFieldValue('true');
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setColumns(['id', 'name', 'email', 'mobile']);
    setExtraMultipleModal(true);
  };

  const onCustomerKeywordChange = (event) => {
    setCustomerKeyword(event.target.value);
  };

  const onCustomerKeywordClear = () => {
    setCustomerKeyword(null);
    setFieldValue('vendor_id', '');
    setCustomerOpen(false);
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
          <MuiTextField
            sx={{
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            name={name.name}
            label={name.label}
            autoComplete="off"
            isRequired
            type="text"
            formGroupClassName="m-1"
            maxLength="30"
          />
          <MuiAutoComplete
            sx={{
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            name={commodityId.name}
            label={commodityId.label}
            formGroupClassName="m-1"
            isRequired
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
            loading={commodityInfo && commodityInfo.loading && commodityOpen}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            apiError={(commodityInfo && commodityInfo.err) ? generateErrorMessage(commodityInfo) : false}
            options={categoryOptions}
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
                onChange={onCommodityKeywordChange}
                variant="standard"
                label={`${commodityId.label}`}
                required
                value={commodityKeyword}
                className={((getOldData(commodity)) || (commodity && commodity.id) || (commodityKeyword && commodityKeyword.length > 0))
                  ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {commodityInfo && commodityInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {((getOldData(commodity)) || (commodity && commodity.id) || (commodityKeyword && commodityKeyword.length > 0)) && (
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={onCommodityKeywordClear}
                          >
                            <IoCloseOutline size={22} fontSize="small" />
                          </IconButton>
                        )}
                        <IconButton
                          aria-label="toggle search visibility"
                          onClick={showSearchModal}
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
            loading={partnersInfo && partnersInfo.loading}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            renderOption={(props, option) => (
              <>
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
                          <span className="">{option.mobile}</span>
                        </Typography>
                      </Box>
                      )}
                    </>
                )}
                />
                <Divider />
              </>
            )}
            options={customerOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onCustomerKeywordChange}
                variant="standard"
                label={vendorId.label}
                // value={customerKeyword}
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {partnersInfo && partnersInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {((vendor_id && vendor_id.id) || (customerKeyword && customerKeyword.length > 0) || (vendor_id && vendor_id.length)) && (
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={onCustomerKeywordClear}
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
          {(noData && isCreatable && (noData.status_code && noData.status_code === 404) && (customerKeyword && customerKeyword.length > 3)
                && (createTenantinfo && !createTenantinfo.err) && (createTenantinfo && !createTenantinfo.data)) && (
                <FormHelperText>
                  <span>{`New Vendor "${customerKeyword}" will be created. Do you want to create..? Click`}</span>
                  <span aria-hidden="true" onClick={() => setAddCustomerModal(true)} className="text-info ml-2 cursor-pointer">YES</span>
                </FormHelperText>
          )}
        </Box>
        <Box
          sx={{
            width: '50%',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <MuiTextField
            sx={{
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            name={capacityValue.name}
            label={capacityValue.label}
            autoComplete="off"
            type="text"
            isRequired
            formGroupClassName="m-1"
            maxLength="5"
            onKeyDown={decimalKeyPressDown}
          />
          <MuiAutoComplete
            sx={{
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            name={uomId.name}
            label={uomId.label}
            isRequired
            formGroupClassName="m-1"
            classes={{
              root: classes.root,
            }}
            oldValue={getOldData(uom_id)}
            value={uom_id && uom_id.name ? uom_id.name : getOldData(uom_id)}
            apiError={(measuresInfo && measuresInfo.err) ? generateErrorMessage(measuresInfo) : false}
            open={uomOpen}
            size="small"
            onOpen={() => {
              setUomOpen(true);
              setUomKeyword('');
            }}
            onClose={() => {
              setUomOpen(false);
              setUomKeyword('');
            }}
            loading={measuresInfo && measuresInfo.loading}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={uomOptions}
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
                onChange={onUomKeyWordChange}
                variant="standard"
                label={`${uomId.label}`}
                required
                value={uomKeyword}
                className={((getOldData(uom_id)) || (uom_id && uom_id.id) || (uomKeyword && uomKeyword.length > 0))
                  ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {measuresInfo && measuresInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {((getOldData(uom_id)) || (uom_id && uom_id.id) || (uomKeyword && uomKeyword.length > 0)) && (
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={onUomClear}
                          >
                            <IoCloseOutline size={22} fontSize="small" />
                          </IconButton>
                        )}
                        <IconButton
                          aria-label="toggle search visibility"
                          onClick={showUomModal}
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
        </Box>
      </Box>
      <Dialog maxWidth="md" open={extraModal}>
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
      <Dialog size="xl" fullWidth open={addCustomerModal}>
        <DialogHeader title="Add Vendor" imagePath={false} onClose={() => { setAddCustomerModal(false); }} response={createTenantinfo} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <AddCustomer
              afterReset={() => { setAddCustomerModal(false); }}
              setFieldValue={setFieldValue}
              requestorName={customerKeyword}
              updateField="vendor_id"
              type="vendor"
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Dialog maxWidth="md" open={extraMultipleModal}>
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
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
});

TankerBasicForm.propTypes = {

  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  setFieldTouched: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  formField: PropTypes.objectOf(PropTypes.string).isRequired,
  editId: PropTypes.oneOfType([PropTypes.bool, PropTypes.number, PropTypes.string]).isRequired,
};

export default TankerBasicForm;
