/* eslint-disable camelcase */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/system';
import { FormHelperText, CircularProgress } from '@material-ui/core';
import {
  Typography, TextField,
  Dialog, DialogContent, DialogContentText, ListItemText,
} from '@mui/material';
import { useFormikContext } from 'formik';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import { IoCloseOutline } from 'react-icons/io5';
import { MailOutline, CallOutlined } from '@mui/icons-material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import checkoutFormModel from '../formModel/checkoutFormModel';
import MuiAutoComplete from '../../commonComponents/formFields/muiAutocomplete';
import MuiTextField from '../../commonComponents/formFields/muiTextField';
import DialogHeader from '../../commonComponents/dialogHeader';

import {
  getPartners,
} from '../../assets/equipmentService';
import { resetSpace, getMaintenanceConfig, getMaintenanceConfigurationData } from '../ticketService';
import {
  generateArrayFromValue,
  getAllCompanies, getTenentOptions,
  getColumnArrayById,
  extractValueObjects,
} from '../../util/appUtils';
import SearchModal from './searchModal';
import AddCustomer from '../../adminSetup/siteConfiguration/addTenant/addCustomer';
import { AddThemeColor } from '../../themes/theme';
import { getAllowedCompaniesInfo } from '../../adminSetup/setupService';

import UploadDocuments from '../../commonComponents/uploadDocuments';

const appModels = require('../../util/appModels').default;

const { formField } = checkoutFormModel;

const TicketRequestorForm = (props) => {
  const {
    reloadData,
    errors,
    setFieldValue,
    editId,
    values,
    limit,
  } = props;
  const { values: formValues } = useFormikContext();
  const {
    company_id, requestee_id, tenant_id,
  } = formValues;
  const dispatch = useDispatch();
  const [companyOpen, setCompanyOpen] = useState(false);
  const [customerOpen, setCustomerOpen] = useState(false);
  const [customerKeyword, setCustomerKeyword] = useState('');
  const [extraModal, setExtraModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [refresh, setRefresh] = useState(reloadData);
  const [addCustomerModal, setAddCustomerModal] = useState(false);
  const columns = ['id', 'name', 'email', 'mobile'];
  const [viewImage, setViewImage] = useState('');
  const [imageName, setImageName] = useState(false);
  const [passwordInputType, ToggleIcon] = useState(true);

  const [tenantOpen, setTenantOpen] = useState(false);

  const { userInfo } = useSelector((state) => state.user);

  const isAll = !!(window.localStorage.getItem('isAllCompany') && window.localStorage.getItem('isAllCompany') === 'yes');

  function getCompanyId(cId) {
    let res = '';
    if (cId) {
      if (cId.id) {
        res = cId.id;
      } else if (cId.length) {
        res = cId[0];
      }
    }
    return res;
  }

  const companies = isAll && getCompanyId(company_id) ? [getCompanyId(company_id)] : getAllCompanies(userInfo);
  const {
    partnersInfo,
  } = useSelector((state) => state.equipment);
  const {
    createTenantinfo, allowedCompanies,
  } = useSelector((state) => state.setup);

  const { maintenanceConfigurationData, tenantConfig, addTicketInfo } = useSelector((state) => state.ticket);

  const configData = maintenanceConfigurationData && !maintenanceConfigurationData.loading && maintenanceConfigurationData.data
  && maintenanceConfigurationData.data.length && maintenanceConfigurationData.data[0];

  const isMobNotShow = maintenanceConfigurationData && !maintenanceConfigurationData.loading && maintenanceConfigurationData.data
        && maintenanceConfigurationData.data.length && maintenanceConfigurationData.data[0].requestor_mobile_visibility === 'Confidential';

  let isTenant = maintenanceConfigurationData && !maintenanceConfigurationData.loading && maintenanceConfigurationData.data
  && maintenanceConfigurationData.data.length && maintenanceConfigurationData.data[0].tenant_visible && maintenanceConfigurationData.data[0].tenant_visible !== 'None';

  let tenantReq = configData && configData.tenant_visible === 'Required';

  let rnDisable = configData && !configData.is_requester_name;
  let rnName = configData && configData.is_requester_name;
  let reDisable = configData && !configData.is_requester_email;

  const isTenantTicket = userInfo && userInfo.data && userInfo.data.associates_to && userInfo.data.associates_to === 'Tenant';
  const allowedTenants = userInfo && userInfo.data && userInfo.data.allowed_tenants && userInfo.data.allowed_tenants.length ? userInfo.data.allowed_tenants : [];

  if (userInfo && userInfo.data && userInfo.data.associates_to && userInfo.data.associates_to === 'Tenant' && getTenentOptions(userInfo, tenantConfig, extractValueObjects(tenant_id))) {
    const tConfig = getTenentOptions(userInfo, tenantConfig, extractValueObjects(tenant_id));
    rnName = tConfig && tConfig.is_requester_name;
    rnDisable = tConfig && !tConfig.is_requester_name;
    reDisable = tConfig && !tConfig.is_requester_email;

    isTenant = tConfig && tConfig.tenant_visible !== 'None';
    tenantReq = tConfig && tConfig.tenant_visible === 'Required';
  }

  const noData = partnersInfo && partnersInfo.err ? partnersInfo.err.data : false;
  let customerOptions = [];

  if (partnersInfo && partnersInfo.loading) {
    customerOptions = [{ name: 'Loading..' }];
  }
  if (requestee_id && requestee_id.length && requestee_id.length > 0) {
    const oldHour = [{ id: requestee_id[0], name: requestee_id[1] }];
    const newArr = [...customerOptions, ...oldHour];
    customerOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  if (partnersInfo && partnersInfo.data) {
    const arr = [...customerOptions, ...partnersInfo.data];
    customerOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }
  if (partnersInfo && partnersInfo.err) {
    customerOptions = [];
  }

  let companyId = '';

  useEffect(() => {
    setRefresh(reloadData);
  }, [reloadData]);

  useEffect(() => {
    if (getCompanyId(company_id) && isAll) {
      dispatch(getMaintenanceConfig([getCompanyId(company_id)], appModels.MAINTENANCECONFIG));
      dispatch(getMaintenanceConfigurationData(getCompanyId(company_id), appModels.MAINTENANCECONFIG));
    }
  }, [company_id]);

  useEffect(() => {
    if (addTicketInfo && addTicketInfo.data) {
      setViewImage('');
      setImageName('');
    }
  }, [addTicketInfo]);

  useEffect(() => {
    if (isAll && userInfo && userInfo.data && userInfo.data.company) {
      dispatch(getAllowedCompaniesInfo(false, 'childs', userInfo.data.company.id));
    }
  }, [isAll]);

  useEffect(() => {
    if (company_id && company_id.id && refresh === '1' && !editId) {
      setFieldValue('asset_id', '');
      // setFieldValue('equipment_id', '');
    }
  }, [refresh, company_id]);

  useEffect(() => {
    if (userInfo && userInfo.data && !requestee_id) {
      // eslint-disable-next-line no-nested-ternary
      companyId = userInfo.data.company ? userInfo.data.company : '';
      const partnerId = userInfo.data.partner_id && userInfo.data.partner_id !== '' ? { id: userInfo.data.partner_id, name: userInfo.data.name } : '';
      const mobileNo = userInfo.data.mobile ? userInfo.data.mobile : '';
      const emailId = userInfo.data.email && userInfo.data.email.email ? userInfo.data.email.email : '';
      setFieldValue('company_id', companyId);
      setFieldValue('requestee_id', partnerId);
      setFieldValue('email', emailId);
      setFieldValue('mobile', mobileNo);
    }
  }, [userInfo]);

  useEffect(() => {
    if (!editId && userInfo && userInfo.data && allowedTenants && allowedTenants.length > 0) {
      setFieldValue('tenant_id', allowedTenants[0]);
    }
  }, [userInfo]);


  useEffect(() => {
    if (userInfo && userInfo.data && customerOpen) {
      dispatch(getPartners(companies, appModels.PARTNER, 'customer', customerKeyword));
    }
  }, [userInfo, customerKeyword, customerOpen]);

  useEffect(() => {
    if (userInfo && userInfo.data && partnersInfo && partnersInfo.data && requestee_id && requestee_id.id && !extraModal && refresh === '1') {
      const partnerData = generateArrayFromValue(partnersInfo.data, 'id', requestee_id.id);
      if (partnerData && partnerData.length > 0) {
        setFieldValue('email', partnerData[0].email ? partnerData[0].email : '');
        setFieldValue('mobile', partnerData[0].mobile ? partnerData[0].mobile : '');
      }
    }
  }, [userInfo, requestee_id, refresh]);

  useEffect(() => {
    if (((userInfo && userInfo.data) && (noData && (noData.status_code && noData.status_code === 404)) && (customerKeyword && customerKeyword.length > 3) && !extraModal)) {
      customerOptions = [{ id: -77, name: customerKeyword }];
      setCustomerOpen(false);
      setFieldValue('requestee_id', { id: -77, name: customerKeyword });
    }
  }, [userInfo, customerKeyword, partnersInfo]);

  const showRequestorModal = () => {
    setModelValue(appModels.PARTNER);
    setFieldName('requestee_id');
    setModalName('Requestor');
    setOtherFieldName('customer');
    setOtherFieldValue('true');
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraModal(true);
  };

  const onCustomerKeywordChange = (event) => {
    setCustomerKeyword(event.target.value);
  };

  const onKeywordClear = () => {
    setCustomerKeyword(null);
    setFieldValue('requestee_id', '');
    setCustomerOpen(false);
    setFieldValue('email', '');
    setFieldValue('mobile', '');
  };

  const cancelSpace = () => {
    dispatch(resetSpace());
  };

  const oldCompId = company_id && company_id.length && company_id.length > 0 ? company_id[1] : '';
  const oldTenantId = tenant_id && tenant_id.length && tenant_id.length > 0 ? tenant_id[1] : '';
  const oldReqId = requestee_id && requestee_id.length && requestee_id.length > 0 ? requestee_id[1] : '';

  // eslint-disable-next-line no-nested-ternary
  const userCompanies = userInfo && userInfo.data && userInfo.data.company.parent_id && userInfo.data.company.parent_id.id && allowedCompanies && allowedCompanies.data && allowedCompanies.data.length > 0
    ? allowedCompanies.data : userInfo && userInfo.data && userInfo.data.allowed_companies && userInfo.data.allowed_companies.length > 0 ? userInfo.data.allowed_companies : [];

  return (
    <Box
      sx={{
        marginTop: '20px',
        width: '30%',
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
        Requestor Information
      </Typography>
      <MuiAutoComplete
        sx={{
          marginTop: 'auto',
          marginBottom: '10px',
        }}
        options={userCompanies}
        name={formField.company.name}
        label={formField.company.label}
        open={companyOpen}
        disabled={!isAll}
        oldValue={oldCompId}
        value={company_id && company_id.name ? company_id.name : oldCompId}
        onOpen={() => {
          setCompanyOpen(true);
          formValues.asset_id = [];
          cancelSpace();
        }}
        onClose={() => {
          setCompanyOpen(false);
        }}
        getOptionSelected={(option, value) => option.name === value.name}
        getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
        renderInput={(params) => (
          <TextField
            {...params}
            label={(
              <>
                <span className="font-family-tab">{formField.company.label}</span>
                {' '}
                <span className="text-danger text-bold">*</span>
              </>
            )}
            variant="standard"
          />
        )}
      />
      <MuiAutoComplete
        sx={{
          marginTop: 'auto',
          marginBottom: '10px',
        }}
        name={formField.personName.name}
        label={formField.personName.label}
        oldValue={oldReqId}
        value={requestee_id && requestee_id.name ? requestee_id.name : oldReqId}
        open={customerOpen}
        disabled={rnDisable}
        onOpen={() => {
          setCustomerOpen(true);
        }}
        onClose={() => {
          setCustomerOpen(false);
        }}
        loading={partnersInfo && partnersInfo.loading}
        getOptionSelected={(option, value) => option.name === value.name}
        getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
        options={customerOptions}
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
                      <span className={isMobNotShow ? 'hide-phone-number' : ''}>{option.mobile}</span>
                    </Typography>
                  </Box>
                )}
              </>
                          )}
          />
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            onChange={onCustomerKeywordChange}
            variant="standard"
            className="without-padding custom-icons"
            label={(
              <>
                <span className="font-family-tab">{formField.personName.label}</span>
                {' '}
                <span className="text-danger text-bold">*</span>
              </>
            )}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {partnersInfo && partnersInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                  <InputAdornment position="end">
                    {rnName && ((oldReqId) || (requestee_id && requestee_id.id) || (customerKeyword && customerKeyword.length > 0)) && (

                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={onKeywordClear}
                    >
                      <IoCloseOutline size={22} fontSize="small" />
                    </IconButton>
                    )}
                    {rnName && (
                    <IconButton
                      aria-label="toggle search visibility"
                      onClick={showRequestorModal}
                    >
                      <SearchIcon fontSize="small" />
                    </IconButton>
                    )}
                  </InputAdornment>
                </>
              ),
            }}
          />
        )}
      />
      {(noData && (noData.status_code && noData.status_code === 404) && (customerKeyword && customerKeyword.length > 3)
                && (createTenantinfo && !createTenantinfo.err) && (createTenantinfo && !createTenantinfo.data)) && (
                <FormHelperText>
                  <span>{`New Requestor "${customerKeyword}" will be created. Do you want to create..? Click`}</span>
                  <span aria-hidden="true" onClick={() => setAddCustomerModal(true)} className="text-info ml-2 cursor-pointer">YES</span>
                </FormHelperText>
      )}
      <MuiTextField
        sx={{
          marginBottom: '10px',
        }}
        name={formField.Email.name}
        autoComplete="off"
        disabled={reDisable}
        label={formField.Email.label}
        setFieldValue={setFieldValue}
        value={values[formField.Email.name]}
        isRequired
        inputProps={{ maxLength: 50, autoComplete: 'new-password' }}
      />
      <MuiTextField
        sx={{
          marginBottom: '10px',
        }}
        type={isMobNotShow ? passwordInputType ? 'password' : 'text' : 'text'}
        name={formField.Mobile.name}
        label={formField.Mobile.label}
        setFieldValue={setFieldValue}
        autoComplete="off"
        value={values[formField.Mobile.name]}
        InputProps={{
          endAdornment: <InputAdornment position="end">
            {isMobNotShow && (
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => ToggleIcon(!passwordInputType)}
                onMouseDown={() => ToggleIcon(!passwordInputType)}
                edge="end"
              >
                {passwordInputType ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            )}
          </InputAdornment>,
          maxLength: 15,
          autoComplete: 'off',
        }}
        inputProps={{ maxLength: 15, autoComplete: 'new-password' }}
        showErrorDefault={errors && errors.mobile ? 'Invalid Mobile Number' : false}
      />
      {isTenantTicket && (
      <MuiAutoComplete
        sx={{
          marginTop: 'auto',
          marginBottom: '10px',
        }}
        options={allowedTenants}
        name={formField.tenantId.name}
        label={formField.tenantId.label}
        open={tenantOpen}
        disabled={allowedTenants && allowedTenants.length > 0 && allowedTenants.length === 1}
        oldValue={oldTenantId}
        value={tenant_id && tenant_id.name ? tenant_id.name : oldTenantId}
        onOpen={() => setTenantOpen(true)}
        onClose={() => setTenantOpen(false)}
        getOptionSelected={(option, value) => option.name === value.name}
        getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
        renderInput={(params) => (
          <TextField
            {...params}
            label={(
              <>
                <span className="font-family-tab">{formField.tenantId.label}</span>
                {' '}
                <span className="text-danger text-bold">*</span>
              </>
             )}
            variant="standard"
          />
        )}
      />
      )}
      {isTenant && (
      <MuiTextField
        sx={{
          marginBottom: '10px',
        }}
        name={formField.tenantName.name}
        label={formField.tenantName.label}
        setFieldValue={setFieldValue}
        value={values[formField.tenantName.name]}
        isRequired={tenantReq}
      />
      )}
      {!editId && (
        <Box>
          <UploadDocuments
            saveData={addTicketInfo}
            limit={userInfo && userInfo.data && userInfo.data.maintenance_setting && userInfo.data.maintenance_setting.helpdesk_attachment_limit ? userInfo.data.maintenance_setting.helpdesk_attachment_limit : 5}
            model={appModels.HELPDESK}
            uploadFileType="all"
          />
        </Box>
      )}
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
              modalName={modalName}
              setFieldValue={setFieldValue}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Dialog size="xl" fullWidth open={addCustomerModal}>
        <DialogHeader title="Add Customer" imagePath={false} onClose={() => { setAddCustomerModal(false); }} response={createTenantinfo} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <AddCustomer
              afterReset={() => { setAddCustomerModal(false); }}
              setFieldValue={setFieldValue}
              requestorName={customerKeyword}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </Box>
  );
};
export default TicketRequestorForm;
