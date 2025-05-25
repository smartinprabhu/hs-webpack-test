/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable camelcase */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import {
  CircularProgress,
  TextField,
  FormHelperText,
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import {
  Grid, Typography, Dialog,
  DialogContent, DialogContentText, Tooltip,
} from '@mui/material';
import { Autocomplete } from '@material-ui/lab';
import { useFormikContext } from 'formik';
import uniqBy from 'lodash/unionBy';
import * as PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  CheckboxField,
} from '@shared/formFields';
import { IoCloseOutline } from 'react-icons/io5';
import ContentCopy from '@mui/icons-material/ContentCopy';


import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { resetExtraMultipleList } from '../../../../helpdesk/ticketService';
import DialogHeader from '../../../../commonComponents/dialogHeader';
import { AddThemeColor } from '../../../../themes/theme';
import {
  autoGeneratePassword,
  differenceArray,
  extractValueObjects,
  generateErrorMessage,
  getAllowedCompanies,
  getArrayFromValuesById,
  isAssociativeArray,
  getAllCompanies,
} from '../../../../util/appUtils';
import AuthService from '../../../../util/authService';
import {
  getRolesGroups,
} from '../../../setupService';
import formikInitialValues from '../formModel/formInitialValues';
import SearchModal from './searchModal';
import {
  getCompany,
} from '../../../../siteOnboarding/siteService';

import MuiAutoComplete from '../../../../commonComponents/formFields/muiAutocomplete';
import MuiTextField from '../../../../commonComponents/formFields/muiTextField';

const authService = AuthService();

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

const appModels = require('../../../../util/appModels').default;

const Basic = (props) => {
  const {
    selectedUser,
    reloadData,
    setFieldValue,
    errors,
    formField: {
      name,
      email,
      companyId,
      roleIds,
      employee,
      companyIds,
      associateId,
      phoneNumber,
      associateTo,
      Password,
      isTempPassword,
      isSOWEmployee,
      autoSelectCompany,
      defaultUserRole,
      Designation,
      employeeId,
    },
  } = props;
  const { values: formValues } = useFormikContext();
  const {
    company_id, user_role_id,
    default_user_role_id, phone_number,
    designation_id, auto_select_company,
    active, company_ids, associates_to, vendor_id, biometric, autogenerate_temporary_password, password, employee_id_seq,
  } = formValues;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [copySuccess, setCopySuccess] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);
  const [currenRoleKeyword, setCurrentRoleKeyword] = useState(false);
  const [companiesOpen, setCompaniesOpen] = useState(false);
  const [refresh, setRefresh] = useState(reloadData);
  const [companyOptions, setCompanyOptions] = useState([]);
  const [userCompanyOptions, setUserCompanyOptions] = useState([]);
  const [companyIDs, setComapanyIDs] = useState([]);
  const [companyKeyword, setCompanyKeyword] = useState('');

  const [extraModal, setExtraModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [extraSearchModal, setExtraSearchModal] = useState(false);
  const [placeholderName, setPlaceholder] = useState('');
  const [otherFieldName, setOtherFieldName] = useState('');
  const [otherFieldValue, setOtherFieldValue] = useState('');
  const [columns, setColumns] = useState(['id', 'name', 'email', 'mobile']);
  const [headers, setHeaders] = useState([]);
  const [oldValues, setOldValues] = useState([]);
  const [userCompanies, setUserCompanies] = useState([]);
  const [showPassword, setShowPassword] = useState(false);

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const {
    roleGroupsInfo, userDetails, allowedCompanies, allowCompanies,
  } = useSelector((state) => state.setup);
  const {
    companyInfo,
  } = useSelector((state) => state.site);
  const {
    partnersInfo,
  } = useSelector((state) => state.equipment);
  const RoleKeyword = userInfo && userInfo.data && userInfo.data.company.name && userInfo.data.company.name.split('') && userInfo.data.company.name.split(' ')[0];

  const allCompanies = getAllCompanies(userInfo, userRoles);

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  useEffect(() => {
    setRefresh(refresh);
  }, [refresh]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data) {
        await dispatch(getCompany(companies, appModels.COMPANY, companyKeyword, true));
      }
    })();
  }, [userInfo, companyKeyword, companiesOpen]);

  useEffect(() => {
    if (companyInfo && companyInfo.data && companyInfo.data.length && companiesOpen) {
      const allowedCompaniesList = allowedCompanies && allowedCompanies.data && allowedCompanies.data.allowed_companies && allowedCompanies.data.allowed_companies.length > 0
        ? allowedCompanies.data.allowed_companies : userInfo && userInfo.data && userInfo.data.allowed_companies && userInfo.data.allowed_companies.length > 0 ? userInfo.data.allowed_companies : [];
      const userCompaniesList = companyInfo && companyInfo.data && companyInfo.data.length ? companyInfo.data : [];
      const companyList = [...allowedCompaniesList, ...userCompaniesList];
      const companiesList = [...new Map(companyList.map((item) => [item.name, item])).values()];
      setUserCompanyOptions(getArrayFromValuesById(companiesList, isAssociativeArray(company_ids || []), 'id'));
    } else if (companyInfo && companyInfo.loading) {
      setUserCompanyOptions([{ name: 'Loading...' }]);
    } else {
      setUserCompanyOptions([]);
    }
  }, [companyInfo, companiesOpen]);

  useEffect(() => {
    if (refresh === '1') {
      if (autogenerate_temporary_password && typeof autogenerate_temporary_password === 'boolean') {
        setFieldValue('password', autoGeneratePassword(12));
      }
    }
  }, [refresh, autogenerate_temporary_password]);

  useEffect(() => {
    if (refresh === '1') {
      if (!extractValueObjects(associates_to)) {
        setFieldValue('vendor_id', '');
      }
    }
  }, [refresh, associates_to]);



  useEffect(() => {
    if (userInfo && userInfo.data) {
      const userCompanyId = userInfo && userInfo.data && userInfo.data.company ? userInfo.data.company : '';
      setFieldValue('company_id', userCompanyId);
      setFieldValue('company_ids', [userCompanyId]);
      formikInitialValues.company_id = userCompanyId;
      formikInitialValues.company_ids = [userCompanyId];
      dispatch(getRolesGroups(companies, appModels.USERROLE, currenRoleKeyword));
    }
  }, [roleOpen, currenRoleKeyword]);

  // eslint-disable-next-line no-lone-blocks
  // useEffect(() => {
  //   if (roleGroupsInfo && roleGroupsInfo.data && !selectedUser) {
  //     const filteredUserRole = roleGroupsInfo.data.filter((data) => data.name === 'Facility Admin');
  //     if (filteredUserRole && filteredUserRole.length) {
  //       const userRole = filteredUserRole[0];
  //       formikInitialValues.user_role_id = userRole;
  //     }
  //   }
  // }, [roleGroupsInfo, selectedUser]);

  const allowedSitesModal = () => {
    setOldValues(company_ids);
    setHeaders(['Name']);
    setModelValue(appModels.COMPANY);
    // setModelValue('');
    // dispatch(getAllowedCompaniesInfo(authService.getAccessToken()));
    setColumns(['id', 'name']);
    setFieldName('company_ids');
    setModalName('Allowed Sites List');
    setPlaceholder('Allowed Sites');
    const selectedCompany = userInfo && userInfo.data && userInfo.data.company && userInfo.data.company.id ? userInfo.data.company.id : '';
    setCompanyValue(allCompanies);
    setOtherFieldName(false);
    setExtraSearchModal(true);
  };

  const onCurrentRoleClear = () => {
    setFieldValue('user_role_id', '');
    setRoleOpen(false);
  };

  const onAllowedSitesClear = () => {
    setFieldValue('company_id', '');
    setFieldValue('company_ids', '');
    setCompaniesOpen(false);
    setCompanyOptions([]);
  };

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

  // eslint-disable-next-line no-nested-ternary
  // const userCompanies = allowedCompanies && allowedCompanies.data && allowedCompanies.data.allowed_companies && allowedCompanies.data.allowed_companies.length > 0 ? allowedCompanies.data.allowed_companies : userInfo && userInfo.data && userInfo.data.allowed_companies && userInfo.data.allowed_companies.length > 0 ? userInfo.data.allowed_companies : [];

  useEffect(() => {
    if (companyInfo && companyInfo.data) {
      const allowedCompaniesList = allowedCompanies && allowedCompanies.data && allowedCompanies.data.allowed_companies && allowedCompanies.data.allowed_companies.length > 0 ? allowedCompanies.data.allowed_companies : userInfo && userInfo.data && userInfo.data.allowed_companies && userInfo.data.allowed_companies.length > 0 ? userInfo.data.allowed_companies : [];
      const userCompaniesList = companyInfo && companyInfo.data && companyInfo.data.length ? companyInfo.data : [];
      const companyList = [...allowedCompaniesList, ...userCompaniesList];
      const companiesList = [...new Map(companyList.map((item) => [item.name, item])).values()];
      setUserCompanies(companiesList);
    }
  }, [companyInfo]);

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password)
      .then(() => {
        console.log('Password copied to clipboard!');
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
      });
  };

  useEffect(() => {
    if (company_ids && userCompanies && company_ids.length === userCompanies.length) {
      setFieldValue('auto_select_company', true);
    } else {
      setFieldValue('auto_select_company', false);
    }
  }, [company_ids, userCompanies]);

  useEffect(() => {
    if (company_ids) {
      setComapanyIDs(company_ids);
      const defaultValueArray = [];
      if (company_ids && company_ids.length && !company_ids[0].id) {
        company_ids.map((id) => {
          const defaultValueObj = userCompanies.find((com) => com.id === id);
          if (defaultValueObj) {
            defaultValueArray.push(defaultValueObj);
          }
        });
        setComapanyIDs(defaultValueArray);
      }
    } else {
      setComapanyIDs([]);
    }
  }, [company_ids, userCompanies]);

  useEffect(() => {
    if (companyIDs) {
      setCompanyOptions(companyIDs);
      setUserCompanyOptions(differenceArray(userCompanies, companyIDs));
    }
  }, [companyIDs, extraModal]);

  const onAllowedSitesChange = (data) => {
    data = uniqBy(data, 'id');
    if (company_id && ((typeof company_id === 'object' && company_id.id && !data.includes(company_id)) || (Array.isArray(company_id) && company_id.length && !data.find((com) => com.id === company_id[0])))) {
      setFieldValue('company_id', '');
    }
    setFieldValue('company_ids', data);
    setComapanyIDs(data);
  };

  useEffect(() => {
    setFieldValue('phone_number', phone_number || '');
    setFieldValue('employee_id_seq', employee_id_seq || '');
    setFieldValue('biometric', biometric || '');
  }, []);

  const InputType = showPassword ? 'text' : 'password';

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
            Basic Info
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <MuiTextField
            sx={{
              marginBottom: '10px',
            }}
            fullWidth
            variant="standard"
            name={name.name}
            label={name.label}
            isRequired
            formGroupClassName="m-1"
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
            name={email.name}
            label={email.label}
            isRequired
            formGroupClassName="m-1"
            type="email"
            inputProps={{
              maxLength: 35,
            }}
            disabled={selectedUser && userDetails && userDetails.data && userDetails.data.length && userDetails.data[0].oauth_uid}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <MuiTextField
            sx={{
              marginBottom: '10px',
            }}
            fullWidth
            variant="standard"
            name={phoneNumber.name}
            label={phoneNumber.label}
            formGroupClassName="m-1"
            type="text"
            inputProps={{
              maxLength: 12,
            }}
          />
        </Grid>
        {/* {((selectedUser && userDetails && userDetails.data && userDetails.data.length && !userDetails.data[0].oauth_uid) || !selectedUser) && ( */}
        {(!selectedUser) && (
        <Grid item xs={12} sm={6} md={6}>
          <MuiTextField
            fullWidth
            variant="standard"
            name={Password.name}
            label={Password.label}
            isRequired
            formGroupClassName="m-1"
            type={autogenerate_temporary_password && !selectedUser ? 'text' : InputType}
            InputProps={{
              endAdornment: (
                !(autogenerate_temporary_password && !selectedUser) && (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
                )
              ),
            }}
            autoComplete="new-password"
            disabled={!!(!selectedUser && autogenerate_temporary_password && typeof autogenerate_temporary_password === 'boolean')}
            inputProps={{
              maxLength: 25,
            }}
          />
          {/* {!(autogenerate_temporary_password && !selectedUser) && (
            <span>{ToggleIcon}</span>
          )} */}
          <CheckboxField
            name={isTempPassword.name}
            label={isTempPassword.label}
            className="ml-1"
          />
          {password && password !== '' && (
          <Tooltip title={copySuccess ? 'Copied!' : 'Copy Password'}>
            <ContentCopy
              style={{ fontSize: '18px' }}
              color="info"
              className="mt-2"
              onMouseLeave={() => setCopySuccess(false)}
              onClick={() => { copyToClipboard(); setCopySuccess(true); }}
            />
          </Tooltip>
          )}
        </Grid>
        )}
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
            Access Info
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <MuiAutoComplete
            name={roleIds.name}
            label={roleIds.label}
            isRequired={roleIds.required}
            formGroupClassName="mb-1"
            oldValue={getOldData(user_role_id)}
            value={user_role_id && user_role_id.name ? user_role_id.name : getOldData(user_role_id)}
            open={roleOpen}
            size="small"
            onOpen={() => {
              setRoleOpen(true);
              setCurrentRoleKeyword('');
            }}
            onClose={() => {
              setRoleOpen(false);
              setCurrentRoleKeyword('');
            }}
            loading={roleGroupsInfo && roleGroupsInfo.loading}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={roleOptions}
            noOptionsText={roleGroupsInfo && roleGroupsInfo.loading ? "Loading..." : "No matching roles found.Please contact System Admin."}
            apiError={(roleGroupsInfo && roleGroupsInfo.err) ? generateErrorMessage(roleGroupsInfo) : false}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label={roleIds.label}
                required={roleIds.required}
                className={((getOldData(user_role_id)) || (user_role_id && user_role_id.id))
                  ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                placeholder="Search & Select"
                value={currenRoleKeyword}
                onChange={(e) => setCurrentRoleKeyword(e.target.value)}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {roleGroupsInfo && roleGroupsInfo.loading && roleOpen ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {((getOldData(user_role_id)) || (user_role_id && user_role_id.id)) && (
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={onCurrentRoleClear}
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
            name={companyId.name}
            label={companyId.label}
            isRequired={companyId.required}
            formGroupClassName="mb-1"
            open={companyOpen}
            oldValue={getOldData(company_id)}
            value={company_id && company_id.name ? company_id.name : getOldData(company_id)}
            size="small"
            onOpen={() => {
              setCompanyOpen(true);
            }}
            onClose={() => {
              setCompanyOpen(false);
            }}
            apiError={(userInfo && userInfo.err) ? generateErrorMessage(userInfo) : false}
            loading={userInfo && userInfo.loading}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={companyOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                required={companyId.required}
                label={companyId.label}
                className="without-padding"
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {userInfo && userInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <Autocomplete
            multiple
            filterSelectedOptions
            limitTags={3}
            id="tags-filled"
            name={companyIds.name}
            label={companyIds.label}
            open={companiesOpen}
            isRequired={companyIds.required}
            size="small"
            onOpen={() => {
              setCompaniesOpen(true);
              setCompanyKeyword('');
            }}
            onClose={() => {
              setCompaniesOpen(false);
              setCompanyKeyword('');
            }}
            value={companyIDs && companyIDs.length ? companyIDs : []}
            loading={userInfo && userInfo.loading}
            options={userCompanyOptions}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            onChange={(e, data) => { onAllowedSitesChange(data); }}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                className={((getOldData(company_ids)) || (company_ids && company_ids.id))
                  ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                placeholder="Search & Select"
                label={(
                  <>
                    {companyIds.label}
                    <span className="text-danger ml-1">*</span>
                  </>
                  )}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {userInfo && userInfo.loading && companiesOpen ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {((getOldData(company_ids)) || (company_ids && company_ids.length > 0)) && (
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={onAllowedSitesClear}
                          >
                            <IoCloseOutline size={22} fontSize="small" />
                          </IconButton>
                        )}
                        <IconButton
                          aria-label="toggle search visibility"
                          onClick={allowedSitesModal}
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
          {(userInfo && userInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(userInfo)}</span></FormHelperText>)}
          <CheckboxField
            name={autoSelectCompany.name}
            label={autoSelectCompany.label}
            onClick={(e) => {
              if (e.target.checked) {
                setFieldValue('company_ids', userCompanies);
              } else {
                setFieldValue('company_ids', []);
                setFieldValue('company_id', '');
              }
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <CheckboxField
            className="mt-4"
            name={isSOWEmployee.name}
            label={isSOWEmployee.label}
          />
        </Grid>

      </Grid>
      {/* <Row>
        <Col md="6" sm="6" lg="6" xs="12">
          <InputField
            name={name.name}
            label={name.label}
            isRequired={name.required}
            formGroupClassName="mb-1"
            type="text"
            maxLength="30"
          />
        </Col>
      </Row>
      <Row>
        <Col md="6" sm="6" lg="6" xs="12" className="pl-0 pr-0">
          <Col xs={12} sm={12} md={12} lg={12} className="mb-3 mt-3 pl-3">
            <Card className="no-border-radius mb-2">
              <CardBody className="p-0 bg-porcelain">
                <p className="ml-2 mb-1 mt-1 font-weight-600 font-side-heading">Basic Info</p>
              </CardBody>
            </Card>
          </Col>
          <Col md="12" sm="12" lg="12" xs="12">
            <InputField
              name={email.name}
              label={email.label}
              isRequired={email.required}
              formGroupClassName="mb-1"
              type="email"
              maxLength="35"
              disabled={selectedUser && userDetails && userDetails.data && userDetails.data.length && userDetails.data[0].oauth_uid}
            />
          </Col>
          <Col md="12" sm="12" lg="12" xs="12">
            <InputField
              name={phoneNumber.name}
              label={phoneNumber.label}
              isRequired={phoneNumber.required}
              formGroupClassName="mb-1"
              type="text"
              onKeyPress={integerKeyPress}
              maxLength="12"
            />
          </Col>
          {((selectedUser && userDetails && userDetails.data && userDetails.data.length && !userDetails.data[0].oauth_uid) || !selectedUser) && (
          <>
            <Col md="12" sm="12" lg="12" xs="12">
              <InputField
                clearData
                name={Password.name}
                label={Password.label}
                isRequired={Password.required}
                disabled={!!(!selectedUser && autogenerate_temporary_password && typeof autogenerate_temporary_password === 'boolean')}
                formGroupClassName="mb-1"
                autoComplete="new-password"
                type={autogenerate_temporary_password && !selectedUser ? 'text' : 'password'}
                maxLength="8"
              />
            </Col>
          </>
          )}
          {!selectedUser && (
            <Col md="12" sm="12" lg="12" xs="12">
              <CheckboxField
                name={isTempPassword.name}
                label={isTempPassword.label}
                className="ml-1"
              />
            </Col>
          )}
        </Col>
        <Col md="6" sm="6" lg="6" xs="12">
          <Col xs={12} sm={12} md={12} lg={12} className="mb-3 mt-3 pl-3">
            <Card className="no-border-radius mb-2">
              <CardBody className="p-0 bg-porcelain">
                <p className="ml-2 mb-1 mt-1 font-weight-600 font-side-heading">Access Info</p>
              </CardBody>
            </Card>
          </Col>
          <Col md="12" sm="12" lg="12" xs="12">
            <FormikAutocomplete
              name={roleIds.name}
              label={roleIds.label}
              isRequired={roleIds.required}
              formGroupClassName="mb-1"
              oldValue={getOldData(user_role_id)}
              value={user_role_id && user_role_id.name ? user_role_id.name : getOldData(user_role_id)}
              open={roleOpen}
              size="small"
              onOpen={() => {
                setRoleOpen(true);
                setCurrentRoleKeyword('');
              }}
              onClose={() => {
                setRoleOpen(false);
                setCurrentRoleKeyword('');
              }}
              loading={roleGroupsInfo && roleGroupsInfo.loading}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={roleOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  className={((getOldData(user_role_id)) || (user_role_id && user_role_id.id))
                    ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                  placeholder="Search & Select"
                  value={currenRoleKeyword}
                  onChange={(e) => setCurrentRoleKeyword(e.target.value)}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {roleGroupsInfo && roleGroupsInfo.loading && roleOpen ? <CircularProgress color="inherit" size={20} /> : null}
                        <InputAdornment position="end">
                          {((getOldData(user_role_id)) || (user_role_id && user_role_id.id)) && (
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={onCurrentRoleClear}
                            >
                              <BackspaceIcon fontSize="small" />
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
            {(roleGroupsInfo && roleGroupsInfo.err && roleOpen) && (<FormHelperText><span className="text-danger">{generateErrorMessage(roleGroupsInfo)}</span></FormHelperText>)}
          </Col>
          <Col md="12" sm="12" lg="12" xs="12">
            <FormControl className={classes.margin}>
              <Label for={companyIds.name}>
                {companyIds.label}
                {' '}
                <span className="text-danger">*</span>
              </Label>
              <Autocomplete
                multiple
                filterSelectedOptions
                limitTags={3}
                id="tags-filled"
                name={companyIds.name}
                label={companyIds.label}
                open={companiesOpen}
                isRequired={companyIds.required}
                size="small"
                onOpen={() => {
                  setCompaniesOpen(true);
                }}
                onClose={() => {
                  setCompaniesOpen(false);
                }}
                value={companyIDs && companyIDs.length ? companyIDs : []}
                loading={userInfo && userInfo.loading}
                options={userCompanyOptions}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                onChange={(e, data) => { onAllowedSitesChange(data); }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    className={((getOldData(company_ids)) || (company_ids && company_ids.id))
                      ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                    placeholder="Search & Select"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {userInfo && userInfo.loading && companiesOpen ? <CircularProgress color="inherit" size={20} /> : null}
                          <InputAdornment position="end">
                            {((getOldData(company_ids)) || (company_ids && company_ids.length > 0)) && (
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={onAllowedSitesClear}
                              >
                                <BackspaceIcon fontSize="small" />
                              </IconButton>
                            )}
                            <IconButton
                              aria-label="toggle search visibility"
                              onClick={allowedSitesModal}
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
            </FormControl>
            {(userInfo && userInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(userInfo)}</span></FormHelperText>)}
          </Col>
          <Col md="12" sm="12" lg="12" xs="12" className="ml-1">
            <CheckboxField
              name={autoSelectCompany.name}
              label={autoSelectCompany.label}
              onClick={(e) => {
                if (e.target.checked) {
                  setFieldValue('company_ids', userCompanies);
                } else {
                  setFieldValue('company_ids', []);
                  setFieldValue('company_id', '');
                }
              }}
            />
          </Col>
          <Col md="12" sm="12" lg="12" xs="12">
            <FormikAutocomplete
              name={companyId.name}
              label={companyId.label}
              isRequired={companyId.required}
              formGroupClassName="mb-1"
              open={companyOpen}
              oldValue={getOldData(company_id)}
              value={company_id && company_id.name ? company_id.name : getOldData(company_id)}
              size="small"
              onOpen={() => {
                setCompanyOpen(true);
              }}
              onClose={() => {
                setCompanyOpen(false);
              }}
              loading={userInfo && userInfo.loading}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={companyOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  className="without-padding"
                  placeholder="Search & Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {userInfo && userInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
            {(userInfo && userInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(userInfo)}</span></FormHelperText>)}
          </Col>
          <Col md="12" sm="12" lg="12" xs="12" className="ml-1">
            <CheckboxField
              name={isSOWEmployee.name}
              label={isSOWEmployee.label}
            />
          </Col>
        </Col>
      </Row> */}
      <Dialog size="lg" fullWidth open={extraSearchModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraSearchModal(false); dispatch(resetExtraMultipleList()); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <SearchModal
              modelName={modelValue}
              afterReset={() => { setExtraSearchModal(false); dispatch(resetExtraMultipleList()); }}
              fieldName={fieldName}
              fields={columns}
              company={companyValue}
              otherFieldName={otherFieldName}
              placeholderName={placeholderName}
              setFieldValue={setFieldValue}
              allowedCompanies={fieldName === 'company_ids' ? userCompanies : ''}
              onCompanyChange={fieldName === 'company_ids' ? onAllowedSitesChange : ''}
              company_ids={fieldName === 'company_ids' ? companyIDs : ''}
            />
            {/* <MultipleSearchModal
              modelName={modelValue}
              afterReset={() => { setExtraSearchModal(false); dispatch(resetExtraMultipleList()); }}
              fieldName={fieldName}
              fields={columns}
              company={companyValue}
              setFieldValue={setFieldValue}
              otherFieldName={otherFieldName}
              otherFieldValue={otherFieldValue}
              headers={headers}
              oldValues={oldValues}
            /> */}
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
            allowedCompanies={fieldName === 'company_ids' ? allowedCompanies : ''}
            onCompanyChange={fieldName === 'company_ids' ? onAllowedSitesChange : ''}
            company_ids={fieldName === 'company_ids' ? companyIDs : ''}
          />
        </ModalBody>
      </Modal> */}
    </>
  );
};

Basic.defaultProps = {
  selectedUser: undefined,
};

Basic.propTypes = {
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  selectedUser: PropTypes.any,
  reloadData: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

export default Basic;
