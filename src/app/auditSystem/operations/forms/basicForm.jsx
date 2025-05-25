/* eslint-disable no-nested-ternary */
/* eslint-disable no-undef */
/* eslint-disable camelcase */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import envelopeIcon from '@images/icons/envelope.svg';
import telephoneIcon from '@images/icons/telephone.svg';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import {
  CircularProgress,
  Dialog, DialogContent, DialogContentText,
  Grid,
  TextField, Typography
} from '@mui/material';
import { Box } from '@mui/system';
import ErrorContent from '@shared/errorContent';
import { Cascader, Divider } from 'antd';
import dayjs from 'dayjs';
import { useFormikContext } from 'formik';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import {
  Spinner
} from 'reactstrap';
import DialogHeader from '../../../commonComponents/dialogHeader';
import MuiAutoComplete from '../../../commonComponents/formFields/muiAutocomplete';
import MuiTextField from '../../../commonComponents/formFields/muiTextField';

import MuiDateTimeField from '../../../commonComponents/formFields/muiDateTimeField';
import { AddThemeColor } from '../../../themes/theme';

import {
  getAllSpaces,
  getBuildings,
  getEmployeeDataList,
} from '../../../assets/equipmentService';
import { getCascader, getSpaceAllSearchList } from '../../../helpdesk/ticketService';
import { addChildrens, addParents } from '../../../helpdesk/utils/utils';
import {
  extractOptionsObject, extractOptionsObjectWithName,
  generateErrorMessage, getAllowedCompanies,
  preprocessData,
  usMobile
} from '../../../util/appUtils';
import {
  getVendor,
} from '../../../workPermit/workPermitService';
import {
  getSystemAudit, getTeamMember,
} from '../../auditService';
import AdvancedSearchModal from './advancedSearchModal';
import SearchModalMultiple from './searchModalMultiple';

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

const BasicForm = (props) => {
  const dispatch = useDispatch();
  const {
    setFieldValue,
    formField,
    setFieldTouched,
    editId,
    formField: {
      title,
      dateAudit,
      system,
      facilityManager,
      facilityManagerContact,
      facilityManagerEmail,
      space,
      auditorName,
      auditorDesignation,
      audtiorContact,
      auditorEmail,
    },
  } = props;
  const { values: formValues } = useFormikContext();
  const {
    date, type, space_id, audit_system_id, facility_manager_id,
    sys_auditor_id,
  } = formValues;
  const classes = useStyles();
  const [atOpen, setAtOpen] = useState(false);
  const [atKeyword, setAtKeyword] = useState('');
  const [spaceOpen, setSpaceOpen] = useState(false);
  const [spacekeyword, setSpaceKeyword] = useState('');
  const [equipmentOpen, setEquipmentOpen] = useState(false);
  const [equipmentkeyword, setEquipmentkeyword] = useState('');
  const [customerOpen, setCustomerOpen] = useState(false);
  const [customerKeyword, setCustomerKeyword] = useState('');
  const [systemOpen, setSystemOpen] = useState(false);
  const [systemKeyword, setSystemKeyword] = useState('');
  const [teamOpen, setTeamOpen] = useState(false);
  const [teamKeyword, setTeamKeyword] = useState('');
  const [natureOpen, setNatureOpen] = useState(false);
  const [natureKeyword, setNatureKeyword] = useState('');
  const [taskOpen, setTaskOpen] = useState(false);
  const [taskKeyword, setTaskKeyword] = useState('');
  const [prepareOpen, setPrepareOpen] = useState(false);
  const [prepareKeyword, setPrepareKeyword] = useState('');
  const [typeData, setTypeData] = useState(false);
  const [natureShow, setNatureShow] = useState(false);
  const [vendorShow, setVendorShow] = useState(false);

  const [extraModal, setExtraModal] = useState(false);
  const [extraMultipleModal, setExtraMultipleModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [columns, setColumns] = useState(['id', 'name']);

  const [parentId, setParentId] = useState('');
  const [spaceIds, setSpaceIds] = useState(false);
  const [childLoad, setChildLoad] = useState(false);
  const [cascaderValues, setCascaderValues] = useState([]);
  const [childValues, setChildValues] = useState([]);

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const {
    buildingsInfo, buildingSpaces,
  } = useSelector((state) => state.equipment);
  const { spaceInfoList, spaceCascader } = useSelector((state) => state.ticket);
  const {
    vendorData,
  } = useSelector((state) => state.workpermit);
  const {
    systemAudit, teamMembers, auditDetail,
  } = useSelector((state) => state.audit);

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
      setChildLoad(true);
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
  }, [cascaderValues, buildingSpaces, childLoad]);

  useEffect(() => {
    (async () => {
      if (type) {
        setTypeData(type);
      }
    })();
  }, [type]);

  const partnerId = userInfo && userInfo.data && userInfo.data.parter_id ? userInfo.data.parter_id : '';

  useEffect(() => {
    if (!editId && partnerId && partnerId !== '') {
      setFieldValue('sys_auditor_id', partnerId);
    }
  }, [partnerId]);

  useEffect(() => {
    if (facility_manager_id && Object.keys(facility_manager_id).length && Object.keys(facility_manager_id).length > 0 && natureShow) {
      const vEmail = facility_manager_id.email ? facility_manager_id.email : '';
      const vMobile = facility_manager_id.phone_number ? facility_manager_id.phone_number : '';
      setFieldValue('facility_manager_contact', vMobile);
      setFieldValue('facility_manager_email', vEmail);
    }
  }, [facility_manager_id, natureShow]);

  useEffect(() => {
    if (sys_auditor_id && Object.keys(sys_auditor_id).length && Object.keys(sys_auditor_id).length > 0 && vendorShow) {
      const vEmail = sys_auditor_id.email ? sys_auditor_id.email : '';
      const vMobile = sys_auditor_id.mobile ? sys_auditor_id.mobile : '';
      setFieldValue('auditor_contact', vMobile);
      setFieldValue('auditor_email', vEmail);
    }
  }, [sys_auditor_id, vendorShow]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && atOpen) {
        await dispatch(getEmployeeDataList(companies, appModels.EMPLOYEE, atKeyword));
      }
    })();
  }, [userInfo, atKeyword, atOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && spaceOpen) {
        await dispatch(getSpaceAllSearchList(companies, appModels.SPACE, spacekeyword));
      }
    })();
  }, [spaceOpen, spacekeyword]);

  useEffect(() => {
    if (userInfo && userInfo.data && customerOpen) {
      dispatch(getVendor(companies, appModels.PARTNER, '', customerKeyword));
    }
  }, [userInfo, customerKeyword, customerOpen]);

  useEffect(() => {
    if (userInfo && userInfo.data && systemOpen) {
      dispatch(getSystemAudit(companies, appModels.AUDITSURVEY, systemKeyword));
    }
  }, [userInfo, systemKeyword, systemOpen]);

  useEffect(() => {
    if (userInfo && userInfo.data && teamOpen) {
      dispatch(getTeamMember(companies, appModels.TEAMMEMEBERS, teamKeyword));
    }
  }, [userInfo, teamKeyword, teamOpen]);

  const onSpaceKeywordChange = (event) => {
    setSpaceKeyword(event.target.value);
  };

  const onSpaceSearch = () => {
    setModelValue(appModels.SPACE);
    setFieldName('space_id');
    setModalName('Space');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setColumns(['id', 'space_name', 'path_name']);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraMultipleModal(true);
  };

  const onSpaceClear = () => {
    setSpaceKeyword(null);
    setSpaceOpen(false);
    setFieldValue('space_id', '');
  };

  const showRequestorModal = () => {
    setModelValue(appModels.PARTNER);
    setFieldName('sys_auditor_id');
    setModalName('Auditor List');
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
    setFieldValue('sys_auditor_id', '');
    setFieldValue('auditor_contact', '');
    setFieldValue('auditor_email', '');
    setCustomerOpen(false);
  };

  const onWorkClear = () => {
    setSystemKeyword(null);
    setFieldValue('audit_system_id', '');
    setSystemOpen(false);
  };

  const showWorkModal = () => {
    setModelValue(appModels.AUDITSURVEY);
    setColumns(['id', 'title']);
    setFieldName('audit_system_id');
    setModalName('System List');
    setCompanyValue('');
    setExtraMultipleModal(true);
  };

  const onFacilityClear = () => {
    setNatureKeyword(null);
    setFieldValue('facility_manager_id', '');
    setFieldValue('facility_manager_contact', '');
    setFieldValue('facility_manager_email', '');
    setNatureOpen(false);
  };

  const showFacilityModal = () => {
    setModelValue(appModels.TEAMMEMEBERS);
    setColumns(['id', 'name']);
    setFieldName('facility_manager_id');
    setModalName('Facility Manager List');
    setCompanyValue(companies);
    setExtraMultipleModal(true);
  };

  const resetSpaceCheck = () => {
    setFieldValue('space_id', '');
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
    setFieldValue(space.name, value);
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

  const loadData = () => {};
  const getSpace = () => {
    let spaceValue = [];
    if (space_id && space_id.length > 0) {
      spaceValue = space_id;
    } else if (space_id && space_id.id) {
      spaceValue = [space_id.name];
    }
    return spaceValue;
  };

  const states = editId && auditDetail && auditDetail.data && auditDetail.data.length > 0 ? auditDetail.data[0].state : false;
  const spaceOptions = extractOptionsObjectWithName(spaceInfoList, space_id, 'path_name');
  const customerOptions = extractOptionsObject(vendorData, sys_auditor_id);
  const systemOptions = extractOptionsObjectWithName(systemAudit, audit_system_id, 'title');
  const teamMembersOptions = extractOptionsObject(teamMembers, facility_manager_id);

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

  function getOldDataId(oldData) {
    return oldData && oldData.display_name ? oldData.display_name : '';
  }
  return (
    <>
      <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 4 }}>
        <Grid item xs={12} sm={6} md={6}>
          <MuiTextField
            sx={{
              marginTop: '10px',
            }}
            name={title.name}
            label={title.label}
            isRequired
            type="text"
            fullWidth
            variant="standard"
            inputProps={{
              maxLength: 150,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <MuiDateTimeField
            sx={{
              marginBottom: '20px',
            }}
            className="w-100"
            name={dateAudit.name}
            localeText={{ todayButtonLabel: 'Now' }}
            slotProps={{
              actionBar: {
                actions: ['today', 'clear', 'accept'],
              },
              textField: { variant: 'standard', error: false },
            }}
            label={dateAudit.label}
            isRequired
            value={date ? dayjs(editId ? moment.utc(date).local().tz(userInfo?.data?.timezone).format('YYYY-MM-DD HH:mm:ss') : date) : null}
            ampm={false}
            placeholder={dateAudit.label}
            disabled={states === 'open'}
            setFieldValue={setFieldValue}
            setFieldTouched={setFieldTouched}
            isErrorHandle
            disablePast
          />
          {/* <DateTimeField
            name={dateAudit.name}
            label={dateAudit.label}
            isRequired
            formGroupClassName="m-1"
            setFieldValue={setFieldValue}
            setFieldTouched={setFieldTouched}
            placeholder={dateAudit.label}
            disabled={states === 'open'}
            disablePastDate
            defaultValue={date ? new Date(getDateTimeSeconds(date)) : ''}
          /> */}
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <MuiAutoComplete
            sx={{
              marginBottom: '20px',
            }}
            name={system.name}
            label={system.label}
            isRequired
            className="bg-white"
            formGroupClassName="m-1"
            oldValue={getOldDataId(audit_system_id)}
            value={audit_system_id && audit_system_id.title ? audit_system_id.title : getOldDataId(audit_system_id)}
            apiError={(systemAudit && systemAudit.err) ? generateErrorMessage(systemAudit) : false}
            open={systemOpen}
            size="small"
            onOpen={() => {
              setSystemOpen(true);
              setSystemKeyword('');
            }}
            onClose={() => {
              setSystemOpen(false);
              setSystemKeyword('');
            }}
            loading={systemAudit && systemAudit.loading}
            isOptionEqualToValue={(option, value) => option.title === value.title}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.title)}
            options={systemOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={(e) => setSystemKeyword(e.target.value)}
                variant="standard"
                label={system.label}
                required
                value={systemKeyword}
                className={((getOldDataId(audit_system_id)) || (audit_system_id && audit_system_id.id) || (systemKeyword && systemKeyword.length > 0))
                  ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {systemAudit && systemAudit.loading ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {((getOldDataId(audit_system_id)) || (audit_system_id && audit_system_id.id) || (systemKeyword && systemKeyword.length > 0)) && (
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={onWorkClear}
                        >
                          <IoCloseOutline size={22} fontSize="small" />
                        </IconButton>
                        )}
                        <IconButton
                          aria-label="toggle search visibility"
                          onClick={showWorkModal}
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
            Facility Information
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <MuiAutoComplete
            sx={{
              marginBottom: '20px',
            }}
            name={facilityManager.name}
            label={facilityManager.label}
            formGroupClassName="m-1"
            oldValue={getOldData(facility_manager_id)}
            className="bg-white"
            value={facility_manager_id && facility_manager_id.name ? facility_manager_id.name : getOldData(facility_manager_id)}
            apiError={(teamMembers && teamMembers.err) ? generateErrorMessage(teamMembers) : false}
            open={teamOpen}
            size="small"
            onOpen={() => {
              setTeamOpen(true);
              setTeamKeyword('');
            }}
            onClose={() => {
              setTeamOpen(false);
              setTeamKeyword('');
            }}
            loading={teamMembers && teamMembers.loading}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={teamMembersOptions}
            onChange={(e, data) => { setFieldValue('facility_manager_id', data); setNatureShow(true); }}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={(e) => setTeamKeyword(e.target.value)}
                variant="standard"
                label={facilityManager.label}
                value={teamKeyword}
                className={((getOldData(facility_manager_id)) || (facility_manager_id && facility_manager_id.id) || (teamKeyword && teamKeyword.length > 0))
                  ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {teamMembers && teamMembers.loading ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {((getOldData(facility_manager_id)) || (facility_manager_id && facility_manager_id.id) || (teamKeyword && teamKeyword.length > 0)) && (
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={onFacilityClear}
                        >
                          <IoCloseOutline size={22} fontSize="small" />
                        </IconButton>
                        )}
                        <IconButton
                          aria-label="toggle search visibility"
                          onClick={showFacilityModal}
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
          <MuiTextField
            sx={{
              marginBottom: '20px',
            }}
            name={facilityManagerEmail.name}
            type="email"
            label={facilityManagerEmail.label}
            placeholder="Enter email"
            fullWidth
            variant="standard"
            inputProps={{
              maxLength: 35,
            }}
          />
        </Grid>
        {editId
          ? (
            <Grid item xs={12} sm={6} md={6}>
              <MuiAutoComplete
                sx={{
                  marginTop: '15px',
                  marginBottom: '20px',
                }}
                name={space.name}
                label={space.label}
                open={spaceOpen}
                size="small"
                className="bg-white"
                onOpen={() => {
                  setSpaceOpen(true);
                  setSpaceKeyword('');
                }}
                onClose={() => {
                  setSpaceOpen(false);
                  setSpaceKeyword('');
                }}
                oldValue={getOldData(space_id)}
                value={space_id && space_id.path_name ? space_id.path_name : getOldData(space_id)}
                loading={spaceInfoList && spaceInfoList.loading}
                getOptionSelected={(option, value) => (value.length > 0 ? option.path_name === value.path_name : '')}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.path_name)}
                options={spaceOptions}
                apiError={(spaceInfoList && spaceInfoList.err) ? generateErrorMessage(spaceInfoList) : false}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    onChange={onSpaceKeywordChange}
                    variant="standard"
                    label={space.label}
                    className={((getOldData(space_id)) || (space_id && space_id.id) || (spacekeyword && spacekeyword.length > 0))
                      ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                    placeholder="Search & Select"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {spaceInfoList && spaceInfoList.loading ? <CircularProgress color="inherit" size={20} /> : null}
                          <InputAdornment position="end">
                            {((getOldData(space_id)) || (space_id && space_id.id) || (spacekeyword && spacekeyword.length > 0)) && (
                            <IconButton onClick={onSpaceClear}>
                              <IoCloseOutline size={22} fontSize="small" />
                            </IconButton>
                            )}
                            <IconButton onClick={onSpaceSearch}>
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
          )
          : (
            <Grid item xs={12} sm={6} md={6}>
              <span className="font-weight-600 pb-1 d-inline-block">
                {space.label}
              </span>
              <br />
              <Cascader
                options={preprocessData(spaceCascader && spaceCascader.length > 0 ? spaceCascader : [])}            
            dropdownClassName="custom-cascader-popup"
                fieldNames={{ label: 'name', value: 'id', children: 'children' }}
                // defaultValue={space_id && space_id.length ? space_id : []}
                value={spaceCascader ? getSpace() : []}
                placeholder="Select"
                notFoundContent="No options"
                dropdownRender={dropdownRender}
                onChange={onChange}
                //loadData={loadData}
                className="thin-scrollbar font-size-13 antd-cascader-width-98"
                changeOnSelect
              />
            </Grid>
          )}
        <Grid item xs={12} sm={6} md={6}>
          <MuiTextField
            sx={{
              marginBottom: '20px',
            }}
            name={facilityManagerContact.name}
            type="text"
            label={facilityManagerContact.label}
            onKeyPress={usMobile}
            placeholder="Enter mobile"
            fullWidth
            variant="standard"
            inputProps={{
              maxLength: 15,
            }}
          />
        </Grid>
      </Grid>
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
            Auditor Information
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <MuiAutoComplete
            sx={{
              marginBottom: '20px',
            }}
            name={auditorName.name}
            label={auditorName.label}
            formGroupClassName="m-1"
            isRequired
            className="bg-white"
            oldValue={getOldData(sys_auditor_id)}
            value={sys_auditor_id && sys_auditor_id.name ? sys_auditor_id.name : getOldData(sys_auditor_id)}
            apiError={(vendorData && vendorData.err) ? generateErrorMessage(vendorData) : false}
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
            loading={vendorData && vendorData.loading}
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
            onChange={(e, data) => { setFieldValue('sys_auditor_id', data); setVendorShow(true); }}
            options={customerOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onCustomerKeywordChange}
                variant="standard"
                label={auditorName.label}
                required
                value={customerKeyword}
                className={((sys_auditor_id && sys_auditor_id.id) || (customerKeyword && customerKeyword.length > 0) || (sys_auditor_id && sys_auditor_id.length))
                  ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {vendorData && vendorData.loading ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {(getOldData(sys_auditor_id) || (sys_auditor_id && sys_auditor_id.id) || (customerKeyword && customerKeyword.length > 0)) && (
                        <IconButton onClick={onCustomerKeywordClear}>
                          <IoCloseOutline size={22} fontSize="small" />
                        </IconButton>
                        )}
                        <IconButton onClick={showRequestorModal}>
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
          <MuiTextField
            sx={{
              marginBottom: '20px',
            }}
            name={auditorDesignation.name}
            label={auditorDesignation.label}
            type="text"
            fullWidth
            variant="standard"
            inputProps={{
              maxLength: 50,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <MuiTextField
            sx={{
              marginBottom: '20px',
            }}
            name={auditorEmail.name}
            type="email"
            label={auditorEmail.label}
            placeholder="Enter email"
            fullWidth
            variant="standard"
            inputProps={{
              maxLength: 35,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <MuiTextField
            sx={{
              marginBottom: '20px',
            }}
            name={audtiorContact.name}
            type="text"
            label={audtiorContact.label}
            onKeyPress={usMobile}
            placeholder="Enter mobile"
            fullWidth
            variant="standard"
            inputProps={{
              maxLength: 15,
            }}
          />
        </Grid>
      </Grid>
      <Dialog size="xl" fullWidth open={extraModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraModal(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <AdvancedSearchModal
              modelName={modelValue}
              afterReset={() => { setExtraModal(false); }}
              fieldName={fieldName}
              fields={columns}
              company={companyValue}
              setFieldValue={setFieldValue}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Dialog size="xl" fullWidth open={extraMultipleModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraMultipleModal(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <SearchModalMultiple
              modelName={modelValue}
              afterReset={() => { setExtraMultipleModal(false); }}
              fieldName={fieldName}
              fields={columns}
              company={companyValue}
              modalName={modalName}
              otherFieldName={otherFieldName}
              otherFieldValue={otherFieldValue}
              setFieldValue={setFieldValue}
              setVendorShow={setVendorShow}
              setNatureShow={setNatureShow}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
};

BasicForm.propTypes = {
  formField: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  editId: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]).isRequired,
  setFieldTouched: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default BasicForm;
