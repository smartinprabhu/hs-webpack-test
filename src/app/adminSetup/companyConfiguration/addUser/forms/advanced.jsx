/* eslint-disable camelcase */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import {
  Label,
} from 'reactstrap';
import {
  Grid, Typography, Dialog,
  DialogContent, DialogContentText,
} from '@mui/material';
import { Box } from '@mui/system';
import { IoCloseOutline } from 'react-icons/io5';
import * as PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
  TextField, CircularProgress,
} from '@material-ui/core';
import { useFormikContext } from 'formik';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import { makeStyles } from '@material-ui/core/styles';

import { CheckboxFieldGroup } from '@shared/formFields';

import envelopeIcon from '@images/icons/envelope.svg';
import telephoneIcon from '@images/icons/telephone.svg';
import DialogHeader from '../../../../commonComponents/dialogHeader';
import MuiTextField from '../../../../commonComponents/formFields/muiTextField';
import MuiAutoComplete from '../../../../commonComponents/formFields/muiAutocomplete';
import { getOperatingHours, getPartners } from '../../../../assets/equipmentService';
import {
  generateErrorMessage, noSpecialChars,
  getAllowedCompanies, extractOptionsObject, extractValueObjects,
} from '../../../../util/appUtils';
import SearchModal from './searchModal';
import { AddThemeColor } from '../../../../themes/theme';
import {
  getDepartments,

  getDesignations, getRolesGroups,
} from '../../../setupService';
import customData from '../data/companyData.json';

const appModels = require('../../../../util/appModels').default;

const useStyles = makeStyles((themeStyle) => ({
  margin: {
    marginBottom: themeStyle.spacing(1.25),
    width: '100%',
  },
  option: {
    padding: 5,
    margin: 5,
    display: 'flow-root',
    '& > span': {
      marginRight: 10,
    },
  },
}));

const Advanced = (props) => {
  const {
    setFieldValue,
    selectedUser,
    formField: {
      shiftId,
      departmentId,
      vendorId,
      mobileUser,
      biometricId,
      employeeId,
      associateId,
      Designation,
      defaultUserRole,
      associateTo,
      employee,
    },
  } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const { values: formValues } = useFormikContext();
  const {
    resource_calendar_id, hr_department, is_mobile_user, associates_to, vendor_id, designation_id, default_user_role_id, active, user_role_id,
  } = formValues;
  const [shiftOpen, setShiftOpen] = useState(false);
  const [shiftKeyword, setShiftKeyword] = useState('');
  const [departmentOpen, setDepartmentOpen] = useState(false);
  const [departmentKeyword, setDepartmentKeyword] = useState('');

  const [extraModal, setExtraModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [placeholderName, setPlaceholder] = useState('');
  const [otherFieldName, setOtherFieldName] = useState('');
  const [columns, setColumns] = useState(['id', 'name']);
  const [vendorKeyword, setVendorKeyword] = useState('');
  const [vendorOpen, setVendorOpen] = useState(false);
  const [desOpen, setDesOpen] = useState(false);
  const [desKeyword, setDesKeyword] = useState('');
  const [defaultRoleOpen, setDefaultRoleOpen] = useState(false);
  const [defaultRoleKeyword, setDefaultRoleKeyword] = useState(false);
  const [assosciateEntity, setAssociateEntity] = useState('');
  const [atOpen, setAtOpen] = useState(false);

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const {
    departmentsInfo, userDetails, memberDesginations, roleGroupsInfo,
  } = useSelector((state) => state.setup);
  const {
    hoursInfo,
  } = useSelector((state) => state.equipment);
  const {
    partnersInfo,
  } = useSelector((state) => state.equipment);

  const associatesTo = associates_to && associates_to.label ? associates_to.label : associates_to;
  const RoleKeyword = userInfo && userInfo.data && userInfo.data.company.name && userInfo.data.company.name.split('') && userInfo.data.company.name.split(' ')[0];

  useEffect(() => {
    if (associatesTo === 'Vendor' || associatesTo === 'Tenant' || associatesTo === 'Client') {
      setFieldValue('vendor_id', '');
      if (vendor_id && vendor_id.name) {
        setAssociateEntity('');
      } else {
        setAssociateEntity(getOldData(vendor_id));
      }
    }
  }, [associatesTo]);

  useEffect(() => {
    if (userInfo && userInfo.data && vendorOpen && associates_to) {
      let partnerType = 'customer';
      if (extractValueObjects(associates_to) && extractValueObjects(associates_to) === 'Vendor') {
        partnerType = 'supplier';
      } else if (extractValueObjects(associates_to) && extractValueObjects(associates_to) === 'Tenant') {
        partnerType = 'is_tenant';
      }
      dispatch(getPartners(companies, appModels.PARTNER, partnerType, vendorKeyword));
    }
  }, [userInfo, vendorKeyword, vendorOpen, associates_to]);

  useEffect(() => {
    if (userInfo && userInfo.data && desOpen) {
      dispatch(getDesignations(companies, appModels.USERDESIGNATION, desKeyword));
    }
  }, [userInfo, desKeyword, desOpen]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      dispatch(getRolesGroups(companies, appModels.USERROLE, defaultRoleKeyword));
    }
  }, [defaultRoleOpen, defaultRoleKeyword]);

  useEffect(() => {
    const mobileUserValue = userDetails && userDetails.data && userDetails.data[0].is_mobile_user ? 'yes' : 'no';
    setFieldValue('is_mobile_user', mobileUserValue);
  }, []);

  useEffect(() => {
    if (userInfo && userInfo.data && shiftOpen) {
      dispatch(getOperatingHours(companies, appModels.RESOURCECALENDAR, shiftKeyword));
    }
  }, [userInfo, shiftKeyword, shiftOpen]);

  useEffect(() => {
    if (userInfo && userInfo.data && departmentOpen) {
      dispatch(getDepartments(companies, appModels.DEPARTMENT, departmentKeyword));
    }
  }, [userInfo, departmentKeyword, departmentOpen]);

  useEffect(() => {
    if (userDetails && userDetails.data) {
      const empActive = userDetails && userDetails.data && userDetails.data[0].active ? 'yes' : 'no';
      setFieldValue('active', empActive);
      const mobileUserValue = userDetails && userDetails.data && userDetails.data[0].is_mobile_user ? 'yes' : 'no';
      setFieldValue('is_mobile_user', mobileUserValue);
    }
  }, [userDetails]);

  function getEmployeeActiveInfo() {
    let empActive = 'yes';

    if (userDetails && userDetails.data) {
      empActive = userDetails.data[0].active ? 'yes' : 'no';
    }

    if (active === 'yes') {
      empActive = 'yes';
    }

    if (active === 'no') {
      empActive = 'no';
    }

    return empActive;
  }

  useEffect(() => {
    getEmployeeActiveInfo();
  }, [active]);

  function getMobileUserInfo() {
    let mobileUserValue = userDetails && userDetails.data && userDetails.data[0].is_mobile_user ? 'yes' : 'no';

    if (is_mobile_user === 'yes') {
      mobileUserValue = 'yes';
    }

    if (is_mobile_user === 'no') {
      mobileUserValue = 'no';
    }

    return mobileUserValue;
  }

  useEffect(() => {
    getMobileUserInfo();
  }, [is_mobile_user]);

  const onShiftKeywordChange = (event) => {
    setShiftKeyword(event.target.value);
  };

  const onDepartmentKeywordChange = (event) => {
    setDepartmentKeyword(event.target.value);
  };

  const showDepartmentModal = () => {
    setModelValue(appModels.DEPARTMENT);
    setColumns(['id', 'name']);
    setFieldName('hr_department');
    setModalName('Department List');
    setPlaceholder('Departments');
    setCompanyValue(companies);
    setOtherFieldName(false);
    setExtraModal(true);
  };

  const onDepartmentKeywordClear = () => {
    setDepartmentKeyword(null);
    setFieldValue('hr_department', '');
    setDepartmentOpen(false);
  };
  const onDesKeyWordChange = (event) => {
    setDesKeyword(event.target.value);
  };
  const showDesignationModal = () => {
    setModelValue(appModels.USERDESIGNATION);
    setColumns(['id', 'name']);
    setFieldName('designation_id');
    setModalName('Designations List');
    setPlaceholder('Designations');
    setCompanyValue(companies);
    setOtherFieldName(false);
    setExtraModal(true);
  };

  const onDesignationKeywordClear = () => {
    setDesKeyword(null);
    setFieldValue('designation_id', '');
    setDesOpen(false);
  };
  const onVendorKeyWordChange = (event) => {
    setVendorKeyword(event.target.value);
  };
  const showRequestorModal = () => {
    setModelValue(appModels.PARTNER);
    setColumns(['id', 'name', 'email', 'mobile']);
    setFieldName('vendor_id');
    setModalName('Associates List');
    setPlaceholder('Associates To');
    setCompanyValue(companies);
    let partnerType = 'customer';
    if (extractValueObjects(associates_to) && extractValueObjects(associates_to) === 'Vendor') {
      partnerType = 'supplier';
    } else if (extractValueObjects(associates_to) && extractValueObjects(associates_to) === 'Tenant') {
      partnerType = 'is_tenant';
    }
    setOtherFieldName(partnerType);
    setExtraModal(true);
  };

  const onRequestorKeywordClear = () => {
    setVendorKeyword(null);
    setFieldValue('vendor_id', '');
    setVendorOpen(false);
    setAssociateEntity('');
  };

  const onDefaultRoleClear = () => {
    setFieldValue('default_user_role_id', '');
    setDefaultRoleOpen(false);
  };

  let shiftOptions = [];
  let departmentOptions = [];
  const vendorOptions = extractOptionsObject(partnersInfo, vendor_id);
  const desOptions = extractOptionsObject(memberDesginations, designation_id);
  let roleOptions = [];

  if (roleGroupsInfo && roleGroupsInfo.loading) {
    roleOptions = [{ name: 'Loading..' }];
  }

  if (roleGroupsInfo && roleGroupsInfo.data && roleGroupsInfo.data.length) {
    roleGroupsInfo.data.map((roleItem) => {
      const role = roleItem.name.toLowerCase();
      if (role.includes(RoleKeyword.toLowerCase())) {
        roleOptions.push(roleItem);
      }
    });
  }

  if (hoursInfo && hoursInfo.loading) {
    shiftOptions = [{ name: 'Loading..' }];
  }

  if (departmentsInfo && departmentsInfo.loading) {
    departmentOptions = [{ name: 'Loading..' }];
  }

  if (userDetails && userDetails.data && userDetails.data[0].resource_calendar_id) {
    const oldTypeId = [{ id: userDetails.data[0].resource_calendar_id[0], name: userDetails.data[0].resource_calendar_id[1] }];
    const newArr = [...shiftOptions, ...oldTypeId];
    shiftOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }

  if (hoursInfo && hoursInfo.data) {
    const arr = [...shiftOptions, ...hoursInfo.data];
    shiftOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }

  if (userDetails && userDetails.data && userDetails.data[0].hr_department) {
    const oldTypeId = [{ id: userDetails.data[0].hr_department[0], name: userDetails.data[0].hr_department[1] }];
    const newArr = [...departmentOptions, ...oldTypeId];
    departmentOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }

  if (departmentsInfo && departmentsInfo.data) {
    const arr = [...departmentOptions, ...departmentsInfo.data];
    departmentOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

  useEffect(() => {
    if (user_role_id && user_role_id.id && (!selectedUser || (selectedUser && !selectedUser.id))) {
      setFieldValue('default_user_role_id', user_role_id);
    }
  }, [user_role_id]);

  useEffect(() => {
    setFieldValue('vendor_id', vendor_id || '');
  }, []);

  useEffect(() => {
    if (assosciateEntity) {
      setAssociateEntity(null);
    }
  }, [associatesTo]);

  return (
    <>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 4 }}>
        <Grid item xs={12} sm={12} md={12}>
          <Typography
            sx={AddThemeColor({
              font: 'normal normal medium 20px/24px Suisse Intl',
              letterSpacing: '0.7px',
              fontWeight: 500,
              marginBottom: '10px',
              paddingBottom: '4px',
            })}
          >
            Additional Info
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <MuiAutoComplete
            sx={{
              marginBottom: '10px',
            }}
            name={departmentId.name}
            label={departmentId.label}
            isRequired={departmentId.required}
            formGroupClassName="mb-1 w-100"
            open={departmentOpen}
            size="small"
            oldValue={getOldData(hr_department)}
            value={hr_department && hr_department.name ? hr_department.name : getOldData(hr_department)}
            onOpen={() => {
              setDepartmentOpen(true);
              setDepartmentKeyword('');
            }}
            onClose={() => {
              setDepartmentOpen(false);
              setDepartmentKeyword('');
            }}
            apiError={(departmentsInfo && departmentsInfo.err) ? generateErrorMessage(departmentsInfo) : false}
            loading={departmentsInfo && departmentsInfo.loading}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={departmentOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onDepartmentKeywordChange}
                variant="standard"
                label={departmentId.label}
                required={departmentId.required}
                value={departmentKeyword}
                className={((getOldData(hr_department)) || (hr_department && hr_department.id) || (departmentKeyword && departmentKeyword.length > 0))
                  ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {departmentsInfo && departmentsInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {((getOldData(hr_department)) || (hr_department && hr_department.id) || (departmentKeyword && departmentKeyword.length > 0)) && (
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={onDepartmentKeywordClear}
                        >
                          <IoCloseOutline size={22} fontSize="small" />
                        </IconButton>
                        )}
                        <IconButton
                          aria-label="toggle search visibility"
                          onClick={showDepartmentModal}
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
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <MuiAutoComplete
            sx={{
              marginBottom: '10px',
            }}
            name={Designation.name}
            label={Designation.label}
            formGroupClassName="mb-1"
            isRequired={Designation.required}
            oldValue={getOldData(designation_id)}
            value={designation_id && designation_id.name ? designation_id.name : getOldData(designation_id)}
            apiError={(memberDesginations && memberDesginations.err) ? generateErrorMessage(memberDesginations) : false}
            open={desOpen}
            size="small"
            onOpen={() => {
              setDesOpen(true);
              setDesKeyword('');
            }}
            onClose={() => {
              setDesOpen(false);
              setDesKeyword('');
            }}
            loading={memberDesginations && memberDesginations.loading}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={desOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onDesKeyWordChange}
                variant="standard"
                label={Designation.label}
                required={Designation.required}
                value={desKeyword}
                className={((getOldData(designation_id)) || (designation_id && designation_id.id) || (desKeyword && desKeyword.length > 0))
                  ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {memberDesginations && memberDesginations.loading ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {((getOldData(designation_id)) || (designation_id && designation_id.id) || (desKeyword && desKeyword.length > 0)) && (
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={onDesignationKeywordClear}
                        >
                          <IoCloseOutline size={22} fontSize="small" />
                        </IconButton>
                        )}
                        <IconButton
                          aria-label="toggle search visibility"
                          onClick={showDesignationModal}
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
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <MuiAutoComplete
            sx={{
              marginBottom: '10px',
            }}
            name={defaultUserRole.name}
            label={defaultUserRole.label}
            isRequired={defaultUserRole.required}
            formGroupClassName="mb-1"
            oldValue={getOldData(default_user_role_id)}
            value={default_user_role_id && default_user_role_id.name ? default_user_role_id.name : getOldData(default_user_role_id)}
            open={defaultRoleOpen}
            size="small"
            onOpen={() => {
              setDefaultRoleOpen(true);
              setDefaultRoleKeyword('');
            }}
            onClose={() => {
              setDefaultRoleOpen(false);
              setDefaultRoleKeyword('');
            }}
            apiError={(roleGroupsInfo && roleGroupsInfo.err) ? generateErrorMessage(roleGroupsInfo) : false}
            loading={roleGroupsInfo && roleGroupsInfo.loading}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            noOptionsText={roleGroupsInfo && roleGroupsInfo.loading ? "Loading..." : "No matching roles found.Please contact System Admin."}
            options={roleOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label={defaultUserRole.label}
                required={defaultUserRole.required}
                className={((getOldData(default_user_role_id)) || (default_user_role_id && default_user_role_id.id))
                  ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                value={defaultRoleKeyword}
                onChange={(e) => setDefaultRoleKeyword(e.target.value)}
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {roleGroupsInfo && roleGroupsInfo.loading && defaultRoleOpen ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {((getOldData(default_user_role_id)) || (default_user_role_id && default_user_role_id.id)) && (
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={onDefaultRoleClear}
                        >
                          <IoCloseOutline size={22} fontSize="small" />
                        </IconButton>
                        )}
                        {/* <IconButton
                          aria-label="toggle search visibility"
                          disabled
                        >
                          <SearchIcon fontSize="small" />
                        </IconButton> */}
                      </InputAdornment>
                    </>
                  ),
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <MuiAutoComplete
            sx={{
              marginBottom: '10px',
            }}
            name={shiftId.name}
            label={shiftId.label}
            isRequired={shiftId.required}
            formGroupClassName="mb-1 w-100"
            open={shiftOpen}
            oldValue={getOldData(resource_calendar_id)}
            value={resource_calendar_id && resource_calendar_id.name ? resource_calendar_id.name : getOldData(resource_calendar_id)}
            size="small"
            onOpen={() => {
              setShiftOpen(true);
              setShiftKeyword('');
            }}
            onClose={() => {
              setShiftOpen(false);
              setShiftKeyword('');
            }}
            apiError={(hoursInfo && hoursInfo.err) ? generateErrorMessage(hoursInfo) : false}
            loading={hoursInfo && hoursInfo.loading}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={shiftOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onShiftKeywordChange}
                variant="standard"
                label={shiftId.label}
                required={shiftId.required}
                className="without-padding"
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {hoursInfo && hoursInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <MuiAutoComplete
            sx={{
              marginBottom: '10px',
            }}
            name={associateTo.name}
            formGroupClassName="mb-1"
            className="bg-white"
            open={atOpen}
            size="small"
            oldValue={associates_to}
            value={associates_to && associates_to.label ? associates_to.label : associates_to}
            onOpen={() => {
              setAtOpen(true);
            }}
            onClose={() => {
              setAtOpen(false);
            }}
            getOptionSelected={(option, value) => option.label === value.label}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
            options={customData && customData.associatesList ? customData.associatesList : []}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label={associateTo.label}
                required={associateTo.required}
                className="without-padding"
                placeholder="Select"
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
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <MuiAutoComplete
            sx={{
              marginBottom: '10px',
            }}
            name={associateId.name}
            label={associateId.label}
            formGroupClassName="mb-1"
            isRequired={associatesTo !== 'Client' ? associateId.required : false}
            oldValue={getOldData(vendor_id)}
            value={assosciateEntity}
              // value={associatesTo !== 'Client' ? vendor_id && vendor_id.name ? vendor_id.name : getOldData(vendor_id) : ''}
            onInputChange={(event, newValue) => {
              setAssociateEntity(newValue);
            }}
            apiError={(partnersInfo && partnersInfo.err) ? generateErrorMessage(partnersInfo) : false}
            open={vendorOpen}
            size="small"
            onOpen={() => {
              setVendorOpen(true);
              setVendorKeyword('');
            }}
            onClose={() => {
              setVendorOpen(false);
              setVendorKeyword('');
            }}
            classes={{
              option: classes.option,
            }}
            loading={partnersInfo && partnersInfo.loading}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            renderOption={(props, option) => (
              <Box
              component="li"
              sx={{
                display: 'flex',
                alignItems: 'center',
                '& > img': {
                  mr: 2,
                  flexShrink: 0,
                },
              }}
              {...props}
            >
              <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <h6>{option.name}</h6>
                <span>
                  {option.email && (
                    <>
                      <img src={envelopeIcon} alt="mail" height="13" width="13" className="mr-2" />
                      {option.email}
                    </>
                  )}
                </span>
              </div>
              {option.mobile && (
                <div style={{ marginLeft: 'auto' }}>
                  <img src={telephoneIcon} alt="telephone" height="13" width="13" className="mr-2" />
                  {option.mobile}
                </div>
              )}
            </Box>
            )}
            options={vendorOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onVendorKeyWordChange}
                variant="standard"
                label={associateId.label}
                required={associatesTo !== 'Client' ? associateId.required : false}
                value={vendorKeyword}
                className={((getOldData(vendor_id)) || (vendor_id && vendor_id.id) || (vendorKeyword && vendorKeyword.length > 0))
                  ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {partnersInfo && partnersInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {((getOldData(vendor_id)) || (vendor_id && vendor_id.id) || (vendorKeyword && vendorKeyword.length > 0)) && (
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={onRequestorKeywordClear}
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
          {(extractValueObjects(associates_to) && (extractValueObjects(associates_to) === 'Vendor' || extractValueObjects(associates_to) === 'Tenant') && vendor_id === '') && (
          <p className="text-danger">{associateId.requiredErrorMsg}</p>
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <MuiTextField
            sx={{
              marginBottom: '10px',
            }}
            fullWidth
            variant="standard"
            name={vendorId.name}
            label={vendorId.label}
            isRequired={vendorId.required}
            value={associatesTo !== 'Client' && assosciateEntity ? (Object.keys(assosciateEntity).length !== 0 && vendor_id.id ? vendor_id.id : '') : ''}
            formGroupClassName="m-1"
            type="text"
            onKeyPress={noSpecialChars}
            inputProps={{
              maxLength: 30,
            }}
          />

        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <MuiTextField
            sx={{
              marginBottom: '10px',
            }}
            fullWidth
            variant="standard"
            name={employeeId.name}
            label={employeeId.label}
            isRequired={employeeId.required}
            formGroupClassName="m-1"
            onKeyPress={noSpecialChars}
            type="text"
            inputProps={{
              maxLength: 30,
            }}
          />

        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <MuiTextField
            sx={{
              marginBottom: '10px',
            }}
            fullWidth
            variant="standard"
            name={biometricId.name}
            label={biometricId.label}
            isRequired={biometricId.required}
            formGroupClassName="m-1"
            onKeyPress={noSpecialChars}
            type="text"
            inputProps={{
              maxLength: 30,
            }}
          />
        </Grid>
        {selectedUser && userDetails && userDetails.data && userDetails.data.length && userDetails.data[0].oauth_uid && (
        <Grid item xs={12} sm={6} md={6}>
          <MuiTextField
            sx={{
              marginBottom: '10px',
            }}
            fullWidth
            variant="standard"
            name="oauthId"
            label="Oauth Id"
            disabled
            value={userDetails.data[0].oauth_uid}
            formGroupClassName="m-1"
            onKeyPress={noSpecialChars}
            type="text"
            inputProps={{
              maxLength: 30,
            }}
          />
        </Grid>
        )}
        <Grid item xs={12} sm={6} md={3}>
          <Label for={mobileUser.name} className="m-0">
            Mobile User Only
            <span className="ml-1 text-danger" />
          </Label>
          <br />
          <CheckboxFieldGroup
            name={mobileUser.name}
            checkedvalue="yes"
            id="yes"
            customvalue={getMobileUserInfo()}
            label={mobileUser.label}
            className="ml-1"
          />
          <CheckboxFieldGroup
            name={mobileUser.name}
            checkedvalue="no"
            customvalue={getMobileUserInfo()}
            id="no"
            label={mobileUser.label1}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Label for={employee.name} className="m-0">
            Employee Active Status
          </Label>
          <br />
          <CheckboxFieldGroup
            name={employee.name}
            checkedvalue="yes"
            customvalue={getEmployeeActiveInfo()}
            id="yes"
            label={employee.label}
            className="ml-1"
          />
          <CheckboxFieldGroup
            name={employee.name}
            checkedvalue="no"
            customvalue={getEmployeeActiveInfo()}
            id="no"
            label={employee.label1}
          />
        </Grid>
      </Grid>
      {/* <Row className="pb-4">
        <Col xs={12} sm={12} md={12} lg={12} className="mb-3 mt-3 pl-3">
          <Card className="no-border-radius mb-2">
            <CardBody className="p-0 bg-porcelain">
              <p className="ml-2 mb-1 mt-1 font-weight-600 font-side-heading">Additional Info</p>
            </CardBody>
          </Card>
        </Col>
        <Col xs="12" sm="6" md="6" lg="6" className="pl-0 pr-0">
          <Col md="12" sm="12" lg="12" xs="12">
            <FormikAutocomplete
              name={departmentId.name}
              label={departmentId.label}
              isRequired={departmentId.required}
              formGroupClassName="mb-1 w-100"
              open={departmentOpen}
              size="small"
              oldValue={getOldData(hr_department)}
              value={hr_department && hr_department.name ? hr_department.name : getOldData(hr_department)}
              onOpen={() => {
                setDepartmentOpen(true);
                setDepartmentKeyword('');
              }}
              onClose={() => {
                setDepartmentOpen(false);
                setDepartmentKeyword('');
              }}
              loading={departmentsInfo && departmentsInfo.loading}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={departmentOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={onDepartmentKeywordChange}
                  variant="outlined"
                  value={departmentKeyword}
                  className={((getOldData(hr_department)) || (hr_department && hr_department.id) || (departmentKeyword && departmentKeyword.length > 0))
                    ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                  placeholder="Search & Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {departmentsInfo && departmentsInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        <InputAdornment position="end">
                          {((getOldData(hr_department)) || (hr_department && hr_department.id) || (departmentKeyword && departmentKeyword.length > 0)) && (
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={onDepartmentKeywordClear}
                            >
                              <IoCloseOutline size={22} fontSize="small" />
                            </IconButton>
                          )}
                          <IconButton
                            aria-label="toggle search visibility"
                            onClick={showDepartmentModal}
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
            {(departmentsInfo && departmentsInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(departmentsInfo)}</span></FormHelperText>)}
          </Col>
          <Col md="12" sm="12" lg="12" xs="12">
            <FormikAutocomplete
              name={Designation.name}
              label={Designation.label}
              formGroupClassName="mb-1"
              isRequired={Designation.required}
              oldValue={getOldData(designation_id)}
              value={designation_id && designation_id.name ? designation_id.name : getOldData(designation_id)}
              apiError={(memberDesginations && memberDesginations.err) ? generateErrorMessage(memberDesginations) : false}
              open={desOpen}
              size="small"
              onOpen={() => {
                setDesOpen(true);
                setDesKeyword('');
              }}
              onClose={() => {
                setDesOpen(false);
                setDesKeyword('');
              }}
              loading={memberDesginations && memberDesginations.loading}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={desOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={onDesKeyWordChange}
                  variant="outlined"
                  value={desKeyword}
                  className={((getOldData(designation_id)) || (designation_id && designation_id.id) || (desKeyword && desKeyword.length > 0))
                    ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                  placeholder="Search & Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {memberDesginations && memberDesginations.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        <InputAdornment position="end">
                          {((getOldData(designation_id)) || (designation_id && designation_id.id) || (desKeyword && desKeyword.length > 0)) && (
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={onDesignationKeywordClear}
                            >
                              <IoCloseOutline size={22} fontSize="small" />
                            </IconButton>
                          )}
                          <IconButton
                            aria-label="toggle search visibility"
                            onClick={showDesignationModal}
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
          </Col>
          <Col md="12" sm="12" lg="12" xs="12">
            <FormikAutocomplete
              name={defaultUserRole.name}
              label={defaultUserRole.label}
              isRequired={defaultUserRole.required}
              formGroupClassName="mb-1"
              oldValue={getOldData(default_user_role_id)}
              value={default_user_role_id && default_user_role_id.name ? default_user_role_id.name : getOldData(default_user_role_id)}
              open={defaultRoleOpen}
              size="small"
              onOpen={() => {
                setDefaultRoleOpen(true);
                setDefaultRoleKeyword('');
              }}
              onClose={() => {
                setDefaultRoleOpen(false);
                setDefaultRoleKeyword('');
              }}
              loading={roleGroupsInfo && roleGroupsInfo.loading}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={roleOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  className={((getOldData(default_user_role_id)) || (default_user_role_id && default_user_role_id.id))
                    ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                  value={defaultRoleKeyword}
                  onChange={(e) => setDefaultRoleKeyword(e.target.value)}
                  placeholder="Search & Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {roleGroupsInfo && roleGroupsInfo.loading && defaultRoleOpen ? <CircularProgress color="inherit" size={20} /> : null}
                        <InputAdornment position="end">
                          {((getOldData(default_user_role_id)) || (default_user_role_id && default_user_role_id.id)) && (
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={onDefaultRoleClear}
                            >
                              <IoCloseOutline size={22} fontSize="small" />
                            </IconButton>
                          )}
                          <IconButton
                            aria-label="toggle search visibility"
                            disabled
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
            {(roleGroupsInfo && roleGroupsInfo.err && defaultRoleOpen) && (<FormHelperText><span className="text-danger">{generateErrorMessage(roleGroupsInfo)}</span></FormHelperText>)}
          </Col>
          <Col md="12" sm="12" lg="12" xs="12">
            <FormikAutocomplete
              name={shiftId.name}
              label={shiftId.label}
              isRequired={shiftId.required}
              formGroupClassName="mb-1 w-100"
              open={shiftOpen}
              oldValue={getOldData(resource_calendar_id)}
              value={resource_calendar_id && resource_calendar_id.name ? resource_calendar_id.name : getOldData(resource_calendar_id)}
              size="small"
              onOpen={() => {
                setShiftOpen(true);
                setShiftKeyword('');
              }}
              onClose={() => {
                setShiftOpen(false);
                setShiftKeyword('');
              }}
              loading={hoursInfo && hoursInfo.loading}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={shiftOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={onShiftKeywordChange}
                  variant="outlined"
                  className="without-padding"
                  placeholder="Search & Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {hoursInfo && hoursInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
            {(hoursInfo && hoursInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(hoursInfo)}</span></FormHelperText>)}
          </Col>
          <Col md="12" sm="12" lg="12" xs="12">
            <FormikAutocomplete
              name={associateTo.name}
              label={associateTo.label}
              isRequired={associateTo.required}
              formGroupClassName="mb-1"
              className="bg-white"
              open={atOpen}
              size="small"
              oldValue={associates_to}
              value={associates_to && associates_to.label ? associates_to.label : associates_to}
              onOpen={() => {
                setAtOpen(true);
              }}
              onClose={() => {
                setAtOpen(false);
              }}
              getOptionSelected={(option, value) => option.label === value.label}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
              options={customData && customData.associatesList ? customData.associatesList : []}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  className="without-padding"
                  placeholder="Select"
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
          <Col md="12" sm="12" lg="12" xs="12">
            <FormikAutocomplete
              name={associateId.name}
              label={associateId.label}
              formGroupClassName="mb-1"
              isRequired={associatesTo !== 'Client' ? associateId.required : false}
              oldValue={getOldData(vendor_id)}
              value={assosciateEntity}
              // value={associatesTo !== 'Client' ? vendor_id && vendor_id.name ? vendor_id.name : getOldData(vendor_id) : ''}
              onInputChange={(event, newValue) => {
                setAssociateEntity(newValue);
              }}
              apiError={(partnersInfo && partnersInfo.err) ? generateErrorMessage(partnersInfo) : false}
              open={vendorOpen}
              size="small"
              onOpen={() => {
                setVendorOpen(true);
                setVendorKeyword('');
              }}
              onClose={() => {
                setVendorOpen(false);
                setVendorKeyword('');
              }}
              classes={{
                option: classes.option,
              }}
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
              options={vendorOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={onVendorKeyWordChange}
                  variant="outlined"
                  value={vendorKeyword}
                  className={((getOldData(vendor_id)) || (vendor_id && vendor_id.id) || (vendorKeyword && vendorKeyword.length > 0))
                    ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                  placeholder="Search & Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {partnersInfo && partnersInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        <InputAdornment position="end">
                          {((getOldData(vendor_id)) || (vendor_id && vendor_id.id) || (vendorKeyword && vendorKeyword.length > 0)) && (
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={onRequestorKeywordClear}
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
            {(extractValueObjects(associates_to) && (extractValueObjects(associates_to) === 'Vendor' || extractValueObjects(associates_to) === 'Tenant') && vendor_id === '') && (
              <p className="text-danger">{associateId.requiredErrorMsg}</p>
            )}
          </Col>

        </Col>
        <Col xs="12" sm="6" md="6" lg="6">
          <Col md="12" sm="12" lg="12" xs="12">
            <InputField
              name={vendorId.name}
              label={vendorId.label}
              isRequired={vendorId.required}
              value={associatesTo !== 'Client' && assosciateEntity ? (Object.keys(assosciateEntity).length !== 0 ? vendor_id.id : '') : ''}
              formGroupClassName="mb-1"
              type="text"
              onKeyPress={noSpecialChars}
              maxLength="30"
            />
          </Col>
          <Col md="12" sm="12" lg="12" xs="12">
            <InputField
              name={employeeId.name}
              label={employeeId.label}
              isRequired={employeeId.required}
              formGroupClassName="mb-1"
              type="text"
              onKeyPress={noSpecialChars}
              maxLength="30"
            />
          </Col>
          <Col md="12" sm="12" lg="12" xs="12">
            <InputField
              name={biometricId.name}
              label={biometricId.label}
              isRequired={biometricId.required}
              formGroupClassName="mb-1"
              type="text"
              onKeyPress={noSpecialChars}
              maxLength="30"
            />
          </Col>
          {selectedUser && userDetails && userDetails.data && userDetails.data.length && userDetails.data[0].oauth_uid && (
            <Col md="12" sm="12" lg="12" xs="12">
              <InputField
                name="oauthId"
                label="Oauth Id"
                disabled
                value={userDetails.data[0].oauth_uid}
                formGroupClassName="mb-1"
                type="text"
                onKeyPress={noSpecialChars}
                maxLength="30"
              />
            </Col>
          )}
          <Col md="12" sm="12" lg="12" xs="12">
            <Label for={mobileUser.name} className="m-0">
              Mobile User Only
              <span className="ml-1 text-danger" />
            </Label>
            <br />
            <CheckboxFieldGroup
              name={mobileUser.name}
              checkedvalue="yes"
              id="yes"
              customvalue={getMobileUserInfo()}
              label={mobileUser.label}
              className="ml-1"
            />
            <CheckboxFieldGroup
              name={mobileUser.name}
              checkedvalue="no"
              customvalue={getMobileUserInfo()}
              id="no"
              label={mobileUser.label1}
            />
          </Col>
          <Col md="12" sm="12" lg="12" xs="12">
            <Label for={employee.name} className="m-0">
              Employee Active Status
              <span className="ml-1 text-danger">*</span>
            </Label>
            <br />
            <CheckboxFieldGroup
              name={employee.name}
              checkedvalue="yes"
              customvalue={getEmployeeActiveInfo()}
              id="yes"
              label={employee.label}
              className="ml-1"
            />
            <CheckboxFieldGroup
              name={employee.name}
              checkedvalue="no"
              customvalue={getEmployeeActiveInfo()}
              id="no"
              label={employee.label1}
            />
          </Col>
          {/* <Col md="12" sm="12" lg="12" xs="12">
            <InputField
              name={employeeId.name}
              label={employeeId.label}
              isRequired={employeeId.required}
              formGroupClassName="mb-1"
              type="text"
              onKeyPress={noSpecialChars}
              maxLength="30"
            />
          </Col>
        </Col>
      </Row> */}
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
              placeholderName={placeholderName}
              setFieldValue={setFieldValue}
              setAssociateEntity={fieldName === 'vendor_id' ? setAssociateEntity : ''}
              associatesTo={fieldName === 'vendor_id' ? associatesTo : ''}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
      {/* <Modal size="xl" className="border-radius-50px modal-dialog-centered" isOpen={extraModal}>
        <ModalHeaderComponent title={modalName} imagePath={false} closeModalWindow={() => { setExtraModal(false); }} />
        <ModalBody className="mt-0 pt-0">
        <SearchModal
            modelName={modelValue}
            afterReset={() => { setExtraModal(false); }}
            fieldName={fieldName}
            fields={columns}
            company={companyValue}
            otherFieldName={otherFieldName}
            placeholderName={placeholderName}
            setFieldValue={setFieldValue}
            setAssociateEntity={fieldName === 'vendor_id' ? setAssociateEntity : ''}
            associatesTo={fieldName === 'vendor_id' ? associatesTo : ''}
          />
        </ModalBody>
      </Modal> */}
    </>

  );
};

Advanced.propTypes = {
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default Advanced;
