/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable camelcase */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import {
  CircularProgress,
  Dialog, DialogContent, DialogContentText,
  FormHelperText,
  TextField,
  Tooltip,
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import { Autocomplete } from '@material-ui/lab';
import ContentCopy from '@mui/icons-material/ContentCopy';
import Grid from '@mui/material/Grid';
import MultipleSearchModal from '@shared/searchModals/multipleSearchModal';
import { useFormikContext } from 'formik';
import uniqBy from 'lodash/unionBy';
import * as PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Col,
  Label,
} from 'reactstrap';

import {
  CheckboxField,
  CheckboxFieldGroup,
} from '@shared/formFields';
import { IoCloseOutline } from 'react-icons/io5';
import {
  getRolesGroups, getAllowedCompaniesInfo,
} from '../../../setupService';
import { resetExtraMultipleList } from '../../../../helpdesk/ticketService';
import {
  getCategoryList, getTeamList, getUNSPSCCodes, getUNSPSCOtherCodes, getBuildings, getAllSpaces,
} from '../../../../assets/equipmentService';
import DialogHeader from '../../../../commonComponents/dialogHeader';
import MuiAutoComplete from '../../../../commonComponents/formFields/muiAutocomplete';
import MuiTextField from '../../../../commonComponents/multipleFormFields/muiTextField';
import {
  getCompany,
} from '../../../../siteOnboarding/siteService';
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
import { infoValue } from '../../../utils/utils';
import formikInitialValues from '../formModel/formInitialValues';
import SearchModal from './searchModal';


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
    formField: {
      name,
      email,
      companyId,
      roleIds,
      employee,
      companyIds,
      mobileUser,
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
      teamIds,
    },
  } = props;
  const { values: formValues } = useFormikContext();
  const {
    company_id, user_role_id,
    default_user_role_id, phone_number,
    designation_id, auto_select_company,
    active, company_ids, associates_to, vendor_id, is_mobile_user, biometric, autogenerate_temporary_password, password, employee_id_seq, maintenance_team_ids,
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
  const [extraSearchModal, setExtraSearchModal] = useState(false);
  const [headers, setHeaders] = useState([]);
  const [oldValues, setOldValues] = useState([]);

  const [teamOpen, setTeamOpen] = useState(false);
  const [teamKeyword, setTeamKeyword] = useState('');
  const [teamOptions, setTeamOptions] = useState([]);
  const [teamIDs, setTeamIDs] = useState([]);

  const [extraModal, setExtraModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [placeholderName, setPlaceholder] = useState('');
  const [otherFieldName, setOtherFieldName] = useState('');
  const [otherFieldValue, setOtherFieldValue] = useState('');
  const [companyKeyword, setCompanyKeyword] = useState('');
  const [columns, setColumns] = useState(['id', 'name', 'email', 'mobile']);
  const [userCompanies, setUserCompanies] = useState([]);

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const {
    companyInfo,
  } = useSelector((state) => state.site);

  const companies = getAllowedCompanies(userInfo);
  const allCompanies = getAllCompanies(userInfo, userRoles);
  const {
    categoriesInfo, teamsInfo, unspscCodes, unspscOtherCodes, buildingsInfo, buildingSpaces,
  } = useSelector((state) => state.equipment);
  const {
    roleGroupsInfo, userDetails, allowedCompanies, allowCompanies,
  } = useSelector((state) => state.setup);
  const {
    partnersInfo,
  } = useSelector((state) => state.equipment);
  const RoleKeyword = userInfo && userInfo.data && userInfo.data.company.name && userInfo.data.company.name.split('') && userInfo.data.company.name.split(' ')[0];

  useEffect(() => {
    setRefresh(refresh);
  }, [refresh]);

  useEffect(() => {
    (async () => {
      if (userInfo.data && teamOpen) {
        await dispatch(getTeamList(companies, appModels.TEAM, teamKeyword));
      }
    })();
  }, [teamOpen, teamKeyword]);

  useEffect(() => {
    (async () => {
      if (userInfo.data && teamOpen) {
        await dispatch(getTeamList(companies, appModels.TEAM, teamKeyword));
      }
    })();
  }, [teamOpen, teamKeyword]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && companiesOpen) {
        await dispatch(getCompany(companies, appModels.COMPANY, companyKeyword, true, companies));
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
    if (teamsInfo && teamsInfo.data && teamsInfo.data.length && teamOpen) {
      setTeamOptions(getArrayFromValuesById(teamsInfo.data, isAssociativeArray(maintenance_team_ids || []), 'id'));
      // setTeamOptions(teamsInfo.data);
    } else if (teamsInfo && teamsInfo.loading) {
      setTeamOptions([{ name: 'Loading...' }]);
    } else {
      setTeamOptions([]);
    }
  }, [teamsInfo, teamOpen]);

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
      formikInitialValues.company_id = userCompanyId;
      formikInitialValues.company_ids = [userCompanyId];
      dispatch(getRolesGroups(companies, appModels.USERROLE, currenRoleKeyword));
    }
  }, []);

  useEffect(() => {
    if (userInfo && userInfo.data && roleOpen) {
      const userCompanyId = userInfo && userInfo.data && userInfo.data.company ? userInfo.data.company : '';
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

  const teamsModal = () => {
    setModelValue(appModels.TEAM);
    setColumns(['id', 'name']);
    setFieldName('maintenance_team_ids');
    setModalName('Teams List');
    setHeaders(['Name']);
    const selectedCompany = userInfo && userInfo.data && userInfo.data.company && userInfo.data.company.id ? userInfo.data.company.id : '';
    setCompanyValue(selectedCompany);
    setOtherFieldName(false);
    setExtraSearchModal(true);
    setOldValues(maintenance_team_ids);
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

  const onTeamsClear = () => {
    setFieldValue('maintenance_team_ids', '');
    setTeamOpen(false);
  };

  // const roleOptions = extractOptionsObject(roleGroupsInfo, roleIds);

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
  // const userCompanies = allowedCompanies && allowedCompanies.data && allowedCompanies.data.allowed_companies && allowedCompanies.data.allowed_companies.length > 0
  //   ? allowedCompanies.data.allowed_companies : userInfo && userInfo.data && userInfo.data.allowed_companies && userInfo.data.allowed_companies.length > 0 ? userInfo.data.allowed_companies : [];

  useEffect(() => {
    if (companyInfo && companyInfo.data) {
      const allowedCompaniesList = allowedCompanies && allowedCompanies.data && allowedCompanies.data.allowed_companies && allowedCompanies.data.allowed_companies.length > 0
      ? allowedCompanies.data.allowed_companies : userInfo && userInfo.data && userInfo.data.allowed_companies && userInfo.data.allowed_companies.length > 0 ? userInfo.data.allowed_companies : [];
    const userCompaniesList = companyInfo && companyInfo.data && companyInfo.data.length ? companyInfo.data : [];
    const companyList = [...allowedCompaniesList, ...userCompaniesList];
    const companiesList = [...new Map(companyList.map((item) => [item.name, item])).values()];
    setUserCompanies(companiesList);
    }
  }, [companyInfo]);

  // useEffect(() => {
  //   if (userInfo && userInfo.data) {
  //     setUserCompanyOptions(userCompanies);
  //   }
  // }, [allowedCompanies, userInfo]);

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

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

  // useEffect(() => {
  //   if (companyIDs) {
  //     setCompanyOptions(companyIDs);
  //     setUserCompanyOptions(differenceArray(userCompanies, companyIDs));
  //   }
  // }, [companyIDs, extraModal]);

  const onAllowedSitesChange = (data) => {
    data = uniqBy(data, 'id');
    if (company_id && ((typeof company_id === 'object' && company_id.id && !data.includes(company_id)) || (Array.isArray(company_id) && company_id.length && !data.find((com) => com.id === company_id[0])))) {
      setFieldValue('company_id', '');
    }
    setFieldValue('company_ids', data);
    setComapanyIDs(data);
  };

  const onTeamChange = (options) => {
    if (options && options.length && options.find((option) => option.name === 'Loading...')) {
      return false;
    }
    setFieldValue('maintenance_team_ids', options);
  };

  useEffect(() => {
    setFieldValue('phone_number', phone_number || '');
    setFieldValue('employee_id_seq', employee_id_seq || '');
    setFieldValue('biometric', biometric || '');
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password)
      .then(() => {
        console.log('Password copied to clipboard!');
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
      });
  };

  return (
    <>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 4 }}>
        <Grid item xs={12} sm={6} md={6}>
          <MuiTextField
            name={name.name}
            label={(
              <>
                {name.label}
                <span className="text-danger ml-1">*</span>
                {infoValue('userName')}
              </>
            )}
            formGroupClassName="mb-1"
            type="text"
            inputProps={{
              maxLength: 30,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <MuiTextField
            name={email.name}
            label={(
              <>
                {email.label}
                <span className="text-danger ml-1">*</span>
                {infoValue('userEmail')}
              </>
            )}
            formGroupClassName="mb-1"
            type="email"
            maxLength="35"
            disabled={selectedUser && userDetails && userDetails.data && userDetails.data.length && userDetails.data[0].oauth_uid}
          />
        </Grid>
        {!selectedUser && (
        <Grid item xs={12} sm={6} md={6}>

          <MuiTextField
            clearData
            name={Password.name}
            label={(
              <>
                {Password.label}
                <span className="text-danger ml-1">*</span>
                {infoValue('userPassword')}
              </>
            )}
            disabled={!!(!selectedUser && autogenerate_temporary_password && typeof autogenerate_temporary_password === 'boolean')}
            formGroupClassName="mb-1"
            autoComplete="new-password"
            type={autogenerate_temporary_password && !selectedUser ? 'text' : 'password'}
            inputProps={{
              maxLength: 25,
            }}
          />
          {!selectedUser && (
            <Col md="12" sm="12" lg="12" xs="12" className="pl-0">
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
            </Col>
          )}
        </Grid>
        )}
        <Grid item xs={12} sm={6} md={6}>
          <MuiAutoComplete
            sx={{
              marginTop: '10px',
              marginBottom: '10px',
            }}
            name={roleIds.name}
            label={roleIds.label}
            isRequired={roleIds.required}
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
            apiError={(roleGroupsInfo && roleGroupsInfo.err) ? generateErrorMessage(roleGroupsInfo) : false}
            loading={roleGroupsInfo && roleGroupsInfo.loading}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={roleOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                InputLabelProps={{ shrink: true }}
                label={(
                  <>
                    {roleIds.label}
                    <span className="text-danger ml-1">*</span>
                    {infoValue('userRole')}
                  </>
                )}
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
                        <IconButton
                          aria-label="toggle search visibility"
                          disabled
                        >
                          <SearchIcon size={22} fontSize="small" />
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
                InputLabelProps={{ shrink: true }}
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
        {/* <Grid item xs={12} sm={6} md={3}>
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
        </Grid> */}
        {!selectedUser && (
        <Grid item xs={12} sm={6} md={6}>
          <Autocomplete
            multiple
            filterSelectedOptions
            limitTags={3}
            id="tags-filled"
            name={teamIds.name}
            label={teamIds.label}
            open={teamOpen}
            isRequired={teamIds.required}
            size="small"
            onOpen={() => {
              setTeamOpen(true);
            }}
            onClose={() => {
              setTeamOpen(false);
            }}
            value={maintenance_team_ids && maintenance_team_ids.length ? maintenance_team_ids : []}
            loading={userInfo && userInfo.loading}
            options={teamOptions}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            onChange={(e, data) => { onTeamChange(data); }}
            renderInput={(params) => (
              <TextField
                {...params}
                InputLabelProps={{ shrink: true }}
                variant="standard"
                className={((getOldData(maintenance_team_ids)) || (maintenance_team_ids && maintenance_team_ids.id))
                  ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                placeholder="Search & Select"
                label={(
                  <>
                    {teamIds.label}
                  </>
                )}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {userInfo && userInfo.loading && companiesOpen ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {((getOldData(maintenance_team_ids)) || (maintenance_team_ids && maintenance_team_ids.length > 0)) && (
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={onTeamsClear}
                          >
                            <IoCloseOutline size={22} fontSize="small" />
                          </IconButton>
                        )}
                        <IconButton
                          aria-label="toggle search visibility"
                          onClick={teamsModal}
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
        </Grid>
        )}
      </Grid>
      <Dialog size="xl" fullWidth open={extraModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { dispatch(resetExtraMultipleList()); setExtraModal(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {/* <MultipleSearchModal
              modelName={modelValue}
              afterReset={() => { dispatch(resetExtraMultipleList()); setExtraSearchModal(false); }}
              fieldName={fieldName}
              fields={columns}
              company={companyValue}
              setFieldValue={setFieldValue}
              otherFieldName={otherFieldName}
              otherFieldValue={otherFieldValue}
              headers={headers}
              oldValues={oldValues}
            /> */}
            <SearchModal
              modelName={modelValue}
              afterReset={() => { setExtraModal(false); }}
              fieldName={fieldName}
              fields={columns}
              company={companyValue}
              otherFieldName={otherFieldName}
              placeholderName={placeholderName}
              setFieldValue={setFieldValue}
              allowedCompanies={fieldName === 'company_ids' ? userCompanies : ''}
              onCompanyChange={fieldName === 'company_ids' ? onAllowedSitesChange : ''}
              company_ids={fieldName === 'company_ids' ? companyIDs : ''}
              teamIds={fieldName === 'maintenance_team_ids' ? maintenance_team_ids : ''}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Dialog size="xl" fullWidth open={extraSearchModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { dispatch(resetExtraMultipleList()); setExtraSearchModal(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          <MultipleSearchModal
            modelName={modelValue}
            afterReset={() => { setExtraSearchModal(false); dispatch(resetExtraMultipleList());}}
            fieldName={fieldName}
            fields={columns}
            company={companyValue}
            setFieldValue={setFieldValue}
            otherFieldName={otherFieldName}
            otherFieldValue={otherFieldValue}
            headers={headers}
            oldValues={oldValues}
          />
          </DialogContentText>
        </DialogContent>
      </Dialog>
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
