/* eslint-disable react/forbid-prop-types */
/* eslint-disable camelcase */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import {
  CircularProgress,
  TextField,
} from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import {
  Autocomplete,
  Dialog,
  DialogContent, DialogContentText,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import MultipleSearchModal from '@shared/searchModals/multipleSearchModal';
import SingleSearchModal from '@shared/searchModals/singleSearchModal';
import dayjs from 'dayjs';
import { useFormikContext } from 'formik';
import PropTypes from 'prop-types';
import React, { useEffect, useState, useMemo } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { getAllowComapaniesData } from '../../adminSetup/setupService';
import {
  getAssetName,
  getBuildings,
  getSpaceName,
  getTeamList,
} from '../../assets/equipmentService';
import DialogHeader from '../../commonComponents/dialogHeader';
import MuiAutoComplete from '../../commonComponents/formFields/muiAutocomplete';
import MuiDateTimeField from '../../commonComponents/formFields/muiDateTimeField';
import MuiTextField from '../../commonComponents/formFields/muiTextField';
import MuiTextArea from '../../commonComponents/formFields/muiTextarea';
import { getEquipmentList } from '../../helpdesk/ticketService';
import { AddThemeColor } from '../../themes/theme';
import {
  extractOptionsObject,
  generateErrorMessage,
  getAllowedCompanies,
  getArrayFromValuesById, getColumnArrayById,
  isAllCompany,
  isArrayColumnExists,
} from '../../util/appUtils';
import {
  getComplianceAct,
  getComplianceCategory,
  getComplianceTemplate,
  getComplianceTemplateDetail,
  getSubmittedTo,
  getComplianceConfig,
} from '../complianceService';

import customData from '../data/customData.json';
import { getAppliesToFormLabel, getRepeatLabel, getRuleTypeLabel } from '../utils/utils';

const appModels = require('../../util/appModels').default;

const useStyles = makeStyles((themeStyle) => ({
  margin: {
    marginBottom: '20px',
    width: '25%',
  },
}));

const BasicForm = React.memo((props) => {
  const {
    setRepeatUntildata,
    setEendsOnData,
    setNextExpiryDateData,
    editId,
    setFieldValue,
    setFieldTouched,
    formField: {
      name,
      complianceAct,
      complianceCategory,
      complianceTemplate,
      submittedTo,
      responsible,
      appliesTo,
      location,
      companyId,
      assetIds,
      hasExpiry,
      nextExpiryDate,
      expirySchedule,
      expiryScheduleType,
      repeatUntil,
      endDate,
      renewalLeadTime,
      licenseNumber,
      description,
      Type,
      siteId,
    },
  } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const { values: formValues } = useFormikContext();
  const {
    compliance_id,
    compliance_category_id,
    compliance_act,
    submitted_to,
    responsible_id,
    applies_to,
    location_ids,
    company_ids,
    asset_ids,
    company_id,
    is_has_expiry, next_expiry_date,
    expiry_schedule_type, repeat_until, end_date, type,
  } = formValues;
  const [ctOpen, setCtOpen] = useState(false);
  const [ctKeyword, setCtKeyword] = useState('');
  const [caOpen, setCaOpen] = useState(false);
  const [caKeyword, setCaKeyword] = useState('');
  const [catOpen, setCatOpen] = useState(false);
  const [catKeyword, setCatKeyword] = useState('');
  const [subOpen, setSubOpen] = useState(false);
  const [subKeyword, setSubKeyword] = useState('');
  const [employeeOpen, setEmployeeOpen] = useState(false);
  const [employeeKeyword, setEmployeeKeyword] = useState('');
  const [applyOpen, setApplyOpen] = useState(false);
  const [spaceOpen, setSpaceOpen] = useState(false);
  const [assetOpen, setAssetOpen] = useState(false);
  const [companiesOpen, setCompaniesOpen] = useState(false);
  const [rTypeOpen, setRtypeOpen] = useState(false);
  const [repeatOpen, setRepeatOpen] = useState(false);
  const [detailShow, setDetailShow] = useState(false);
  const [extraModal, setExtraModal] = useState(false);
  const [extraSearchModal, setExtraSearchModal] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);

  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [columns, setColumns] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [oldValues, setOldValues] = useState([]);
  const [nextExp, setNextExp] = useState('');
  const [fieldValueClear, setFieldValueClear] = useState(false);
  const [checked, setChecked] = useState(false);
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const defaultExpDate = next_expiry_date ? dayjs(moment.utc(next_expiry_date).local().tz(userInfo?.data?.timezone).format('YYYY-MM-DD HH:mm:ss')) : null;
  const defaultEndDate = end_date ? dayjs(moment.utc(end_date).local().tz(userInfo?.data?.timezone).format('YYYY-MM-DD HH:mm:ss')) : null;
  const [selectedDate, setDateChange] = useState(defaultExpDate);
  const [selectedEndDate, setEndDateChange] = useState(defaultEndDate);
  const {
    complianceActInfo, complianceTemplateInfo, templateConfig, submittedToInfo, templateCompliance, addComplianceInfo, categoryInfo,
  } = useSelector((state) => state.compliance);
  const {
    teamsInfo, buildingsInfo, spaceName, assetNameInfo,
  } = useSelector((state) => state.equipment);
  const {
    allowCompanies, tenantUpdateInfo,
  } = useSelector((state) => state.setup);
  const { equipmentInfo } = useSelector((state) => state.ticket);
  const [endDateFormat, setEndDateFormat] = useState('');
  // const companies = getAllowedCompanies(userInfo);

  const isAllCompanies = isAllCompany(userInfo, userRoles);

  const userCompanyIdAdd = userInfo && userInfo.data && userInfo.data.company ? userInfo.data.company.id : '';
  const userCompanyIdEdit = company_id && company_id.id ? company_id.id : userCompanyIdAdd;
  const userCompanyIdSelect = isAllCompanies ? userCompanyIdEdit : userCompanyIdAdd;
  const userParentId = userInfo && userInfo.data && userInfo.data.company.parent_id ? userInfo.data.company.parent_id.id : '';

  const companies = isAllCompanies ? userCompanyIdEdit : getAllowedCompanies(userInfo);

  const userCompanyId = editId ? userCompanyIdEdit : userCompanyIdSelect;

  const tempSettingData = templateConfig && templateConfig.data && templateConfig.data.length ? templateConfig.data[0] : false;
  const templateListAccess = tempSettingData ? tempSettingData.template_list_access : false;
  const productsListId = tempSettingData && templateListAccess && templateListAccess === 'Company Level' && tempSettingData.template_company_id.id ? tempSettingData.template_company_id.id : false;

  useMemo(() => {
    if (userInfo && userInfo.data && userInfo.data.company) {
      dispatch(getComplianceConfig(userInfo.data.company.id, appModels.BCSCONFIG));
    }
  }, [userInfo]);


  useEffect(() => {
    if ((tenantUpdateInfo && tenantUpdateInfo.err) || (addComplianceInfo && addComplianceInfo.err)) setDetailShow(false);
  }, [tenantUpdateInfo]);

  useEffect(() => {
    if (location_ids) {
      const locationId = location_ids && location_ids.length > 0 ? location_ids : false;
      if (locationId && spaceName.data && !spaceName.data) {
        dispatch(getSpaceName(appModels.SPACE, locationId));
      }
    }
  }, [location_ids]);

  useEffect(() => {
    if (repeat_until) {
      setRepeatUntildata(repeat_until);
    }
    if (end_date || end_date === '') {
      setEendsOnData(endDateFormat);
    }
  }, [repeat_until, end_date, endDateFormat]);

  useEffect(() => {
    setFieldValue('end_date', '');
  }, [repeat_until]);

  useEffect(() => {
    setChecked(is_has_expiry);
  }, [is_has_expiry]);

  useEffect(() => {
    if (nextExp) {
      setNextExpiryDateData(nextExp);
    }
  }, [nextExp]);

  useEffect(() => {
    if (next_expiry_date !== '' && end_date !== '') {
      setEndDateFormat(dayjs(end_date));
      setNextExp(dayjs(next_expiry_date));
    } else {
      setEndDateFormat('');
      setNextExp('');
    }
  }, [next_expiry_date, end_date]);

  /*  useEffect(() => {
    if (!editId) {
      setFieldValue('next_expiry_date', new Date());
    }
  }, [editId]); */

  useEffect(() => {
    if (compliance_id) {
      const complianceId = compliance_id && compliance_id.id ? compliance_id.id : false;
      if (complianceId && !editId) {
        dispatch(getComplianceTemplateDetail(complianceId, appModels.COMPLIANCETEMPLATE));
      }
      if (complianceId && detailShow) {
        dispatch(getComplianceTemplateDetail(complianceId, appModels.COMPLIANCETEMPLATE));
      }
    }
  }, [compliance_id]);

  useEffect(() => {
    if (templateCompliance && templateCompliance.data && templateCompliance.data.length > 0) {
      console.log('Hello');
      const complianceName = templateCompliance.data[0].name ? templateCompliance.data[0].name : '';
      const Category = templateCompliance.data[0].compliance_category_id ? templateCompliance.data[0].compliance_category_id : '';
      const Act = templateCompliance.data[0].compliance_act ? templateCompliance.data[0].compliance_act : '';
      const submitTo = templateCompliance.data[0].submitted_to ? templateCompliance.data[0].submitted_to : '';
      const hasExp = templateCompliance.data[0].is_has_expiry;
      const typeValue = templateCompliance.data[0].type;
      const expiryScheduleValue = templateCompliance.data[0].expiry_schedule;
      const expiryScheduleTypeValue = templateCompliance.data[0].expiry_schedule_type ? templateCompliance.data[0].expiry_schedule_type : '';
      const renewalLeadTimeValue = templateCompliance.data[0].renewal_lead_time;
      setFieldValue('name', complianceName);
      if (Category && Category.length > 0) {
        setFieldValue('compliance_category_id', { id: Category[0], name: Category[1] });
      }
      if (Act && Act.length > 0) {
        setFieldValue('compliance_act', { id: Act[0], name: Act[1] });
      }
      if (submitTo && submitTo.length > 0) {
        setFieldValue('submitted_to', { id: submitTo[0], name: submitTo[1] });
      }
      if (typeValue) {
        setFieldValue('type', { value: typeValue, label: typeValue });
      }
      if (expiryScheduleTypeValue) {
        setFieldValue('expiry_schedule_type', { value: expiryScheduleTypeValue, label: expiryScheduleTypeValue });
      }
      setChecked(hasExp);
      setFieldValue('is_has_expiry', hasExp);
      setFieldValue('expiry_schedule', expiryScheduleValue === 0 ? 1 : expiryScheduleValue);
      setFieldValue('renewal_lead_time', renewalLeadTimeValue);
      setFieldValue('url_link', templateCompliance.data[0].url_link);
    }
  }, [templateCompliance]);

  useEffect(() => {
    if (spaceName && spaceName.data && spaceName.data.length > 0 && editId) {
      setFieldValue('location_ids', spaceName.data);
    }
  }, [spaceName]);

  useEffect(() => {
    if (asset_ids) {
      const assetId = asset_ids && asset_ids.length > 0 ? asset_ids : false;
      if (assetId && assetNameInfo && !assetNameInfo.data) {
        dispatch(getAssetName(appModels.EQUIPMENT, assetId));
      }
    }
  }, [asset_ids]);

  useEffect(() => {
    if (assetNameInfo && assetNameInfo.data && assetNameInfo.data.length > 0 && editId) {
      setFieldValue('asset_ids', assetNameInfo.data);
    }
  }, [assetNameInfo]);

  useEffect(() => {
    if (company_ids) {
      const companyIds = company_ids && company_ids.length > 0 ? company_ids : false;
      if (companyIds && allowCompanies && !allowCompanies.data) {
        dispatch(getAllowComapaniesData(appModels.COMPANY, companyIds));
      }
    }
  }, [company_ids]);

  useEffect(() => {
    if (allowCompanies && allowCompanies.data && allowCompanies.data.length > 0 && editId) {
      setFieldValue('company_ids', allowCompanies.data);
    }
  }, [allowCompanies]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && spaceOpen) {
        await dispatch(getBuildings(companies, appModels.SPACE));
      }
    })();
  }, [userInfo, spaceOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && assetOpen) {
        await dispatch(getEquipmentList(companies, appModels.EQUIPMENT));
      }
    })();
  }, [userInfo, assetOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && ctOpen && ((templateConfig && templateConfig.data) || (templateConfig && templateConfig.err) || (templateConfig && !templateConfig.loading))) {
        await dispatch(getComplianceTemplate(productsListId || companies, appModels.COMPLIANCETEMPLATE, ctKeyword));
      }
    })();
  }, [userInfo, ctKeyword, ctOpen, templateConfig]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && caOpen) {
        await dispatch(getComplianceAct(companies, appModels.COMPLIANCEACT, caKeyword));
      }
    })();
  }, [userInfo, caKeyword, caOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && catOpen) {
        await dispatch(getComplianceCategory(companies, appModels.COMPLIANCEACT, catKeyword));
      }
    })();
  }, [userInfo, catKeyword, catOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && subOpen) {
        await dispatch(getSubmittedTo(companies, appModels.PARTNER, 'is_compliance', subKeyword));
      }
    })();
  }, [userInfo, subKeyword, subOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && employeeOpen) {
        await dispatch(getTeamList(companies, appModels.TEAM, employeeKeyword));
      }
    })();
  }, [userInfo, employeeKeyword, employeeOpen]);

  let spaceOptions = [];

  if (buildingsInfo && buildingsInfo.loading) {
    spaceOptions = [{ path_name: 'Loading..' }];
  }
  if (buildingsInfo && buildingsInfo.data) {
    spaceOptions = buildingsInfo.data;
  }

  let assetOptions = [];

  if (equipmentInfo && equipmentInfo.loading) {
    assetOptions = [{ name: 'Loading..' }];
  }
  if (equipmentInfo && equipmentInfo.data) {
    assetOptions = equipmentInfo.data;
  }

  let userCompanies = [];

  if (userInfo && userInfo.loading) {
    userCompanies = [{ name: 'Loading..' }];
  }
  if (userInfo && userInfo.data) {
    userCompanies = userInfo.data.allowed_companies && userInfo.data.allowed_companies.length > 0 ? userInfo.data.allowed_companies : [];
  }

  const onComplianceTemplateKeyWordChange = (event) => {
    setCtKeyword(event.target.value);
  };

  const onComplianceActKeyWordChange = (event) => {
    setCaKeyword(event.target.value);
  };

  const onComplianceCatKeyWordChange = (event) => {
    setCatKeyword(event.target.value);
  };

  const onSubKeyWordChange = (event) => {
    setSubKeyword(event.target.value);
  };

  const onCaKeywordClear = () => {
    setCaKeyword(null);
    setFieldValue('compliance_act', '');
    setCaOpen(false);
  };

  const onCatKeywordClear = () => {
    setCatKeyword(null);
    setFieldValue('compliance_category_id', '');
    setCatOpen(false);
  };

  const onCtKeywordClear = () => {
    setCtKeyword(null);
    setFieldValue('name', '');
    setFieldValue('compliance_id', '');
    setFieldValue('compliance_category_id', '');
    setFieldValue('url_link', '');
    setFieldValue('compliance_act', '');
    setFieldValue('submitted_to', '');
    setFieldValue('is_has_expiry', false);
    setChecked(false);
    setFieldValue('expiry_schedule', '');
    setFieldValue('expiry_schedule_type', { value: 'Months', label: 'Months' });
    setFieldValue('renewal_lead_time', '');
    setCtOpen(false);
  };

  const onSubKeywordClear = () => {
    setSubKeyword(null);
    setFieldValue('submitted_to', '');
    setSubOpen(false);
  };

  const onEmployeeKeyWordChange = () => {
    setSubKeyword(null);
    setFieldValue('responsible_id', '');
    setSubOpen(false);
  };

  const showCtModal = () => {
    setModelValue(appModels.COMPLIANCETEMPLATE);
    setFieldName('compliance_id');
    setModalName('Compliance Template');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(productsListId || companies);
    setExtraModal(true);
  };

  const showCaModal = () => {
    setModelValue(appModels.COMPLIANCEACT);
    setFieldName('compliance_act');
    setModalName('Compliance Act');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue('');
    setExtraModal(true);
  };

  const showCategoryModal = () => {
    setModelValue(appModels.COMPLIANCECATEGORY);
    setFieldName('compliance_category_id');
    setModalName('Compliance Category');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue('');
    setExtraModal(true);
  };

  const showSubModal = () => {
    setModelValue(appModels.PARTNER);
    setFieldName('submitted_to');
    setModalName('Submitted To');
    setOtherFieldName('is_compliance');
    setOtherFieldValue(true);
    setCompanyValue('');
    setExtraModal(true);
  };

  function isAssociativeArray(arr) {
    let result = arr;
    if (isArrayColumnExists(arr, 'id')) {
      result = getColumnArrayById(arr, 'id');
    }
    return result;
  }

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

  const companyDatas = company_ids && company_ids.length ? company_ids : [];

  const appliesToType = applies_to && applies_to.value ? applies_to.value : applies_to;

  const complianceActOptions = extractOptionsObject(complianceActInfo, compliance_act);
  const complianceTemplateOptions = extractOptionsObject(complianceTemplateInfo, compliance_id);
  const partnersOptions = extractOptionsObject(submittedToInfo, submitted_to);
  const responsibleOptions = extractOptionsObject(teamsInfo, responsible_id);
  const categoryOptions = extractOptionsObject(categoryInfo, compliance_category_id);

  const repeatType = repeat_until && repeat_until.value ? repeat_until.value : repeat_until;

  const showEquipmentModal = () => {
    setModelValue(appModels.EQUIPMENT);
    setFieldName('asset_ids');
    setModalName('Assets');
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setExtraSearchModal(true);
    setColumns(['id', 'name', 'category_id', 'location_id']);
    setHeaders(['Name', 'Location', 'Category']);
    setOldValues(asset_ids);
  };

  const showLocationModal = () => {
    setModelValue(appModels.SPACE);
    setFieldName('location_ids');
    setModalName('Locations');
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setExtraSearchModal(true);
    setColumns(['space_name', 'path_name', 'id']);
    setHeaders(['Path Name', 'Space Name']);
    setOldValues(location_ids);
  };
  const onChangeOption = (field, data, reason) => {
    if (reason === 'clear' || (reason === 'remove-option' && data && data.length === 0)) {
      setFieldValue(field, []);
      setFieldValueClear(true);
    } else {
      setFieldValue(field, data);
    }
  };

  useEffect(() => {
    if (fieldValueClear) {
      setFieldValue('company_ids', []);
      setFieldValue('location_ids', []);
      setFieldValue('asset_ids', []);
      setFieldValueClear(false);
    }
  }, [fieldValueClear]);

  const handleDateChange = (date) => {
    setDateChange(date);
    setFieldValue('next_expiry_date', date);
  };

  const handleEndDateChange = (date) => {
    setEndDateChange(date);
    setFieldValue('end_date', date);
  };

  const handleChange = (event) => {
    setChecked(event.target.checked);
    setFieldValue('is_has_expiry', event.target.checked);
  };

  console.log(is_has_expiry);

  return (
    <>
      <Box
        sx={{
          width: '100%',
          marginTop: '20px',
        }}
      >
        <Typography
          sx={AddThemeColor({
            font: 'normal normal medium 20px/24px Suisse Intl',
            letterSpacing: '0.7px',
            fontWeight: 500,
          })}
        >
          Compliance Information
        </Typography>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '3%',
            flexWrap: 'wrap',
          }}
        >
          <MuiTextField
            sx={{
              width: '30%',
              marginBottom: '20px',
            }}
            name={name.name}
            label={name.label}
            // setFieldValue={setFieldValue}
            type="text"
            disabled
          />
          {!editId && isAllCompanies && (
          <MuiAutoComplete
            sx={{
              width: '30%',
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            name={siteId.name}
            label={siteId.label}
            isRequired
            formGroupClassName="m-1"
            open={companyOpen}
            size="small"
            disabled={!isAllCompanies}
            value={company_id && company_id.name ? company_id.name : ''}
            onOpen={() => {
              setCompanyOpen(true);
            }}
            onClose={() => {
              setCompanyOpen(false);
            }}
            apiError={!company_id ? 'Please select the site' : false}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={userCompanies}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label={siteId.label}
                //className="input-small-custom without-padding"
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
          )}
          <MuiAutoComplete
            sx={{
              width: '30%',
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            name={complianceTemplate.name}
            label={complianceTemplate.label}
            oldValue={getOldData(compliance_id)}
            value={compliance_id && compliance_id.name ? compliance_id.name : getOldData(compliance_id)}
            apiError={(complianceTemplateInfo && complianceTemplateInfo.err) ? generateErrorMessage(complianceTemplateInfo) : false}
            open={ctOpen}
            size="small"
            onOpen={() => {
              setCtOpen(true);
              setCtKeyword('');
            }}
            onClose={() => {
              setCtOpen(false);
              setCtKeyword('');
            }}
            onChange={(e, data) => { setFieldValue('compliance_id', data); setDetailShow(true); }}
            loading={complianceTemplateInfo && complianceTemplateInfo.loading}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={complianceTemplateOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onComplianceTemplateKeyWordChange}
                variant="standard"
                label={complianceTemplate.label}
                required
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {complianceTemplateInfo && complianceTemplateInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {((getOldData(compliance_id)) || (compliance_id && compliance_id.id) || (ctKeyword && ctKeyword.length > 0)) && (
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={onCtKeywordClear}
                          >
                            <IoCloseOutline size={22} fontSize="small" />
                          </IconButton>
                        )}
                        <IconButton
                          aria-label="toggle search visibility"
                          onClick={showCtModal}
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
          <Box
            sx={{
              width: '30%',
              marginBottom: '20px',
            }}
          >
            <TextField

              fullWidth
              disabled
              name={complianceCategory.name}
              label={complianceCategory.label}
              variant="standard"
              value={compliance_category_id && compliance_category_id.name ? compliance_category_id.name : getOldData(compliance_category_id)}
              type="text"
            />
          </Box>
          {/* <MuiAutoComplete
            sx={{
              width: '30%',
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            name={complianceCategory.name}
            label={complianceCategory.label}
            oldValue={getOldData(compliance_category_id)}
            value={compliance_category_id && compliance_category_id.name ? compliance_category_id.name : getOldData(compliance_category_id)}
            apiError={(categoryInfo && categoryInfo.err) ? generateErrorMessage(categoryInfo) : false}
            open={catOpen}
            size="small"
            disabled
            onOpen={() => {
              setCatOpen(true);
              setCatKeyword('');
            }}
            onClose={() => {
              setCatOpen(false);
              setCatKeyword('');
            }}
            loading={categoryInfo && categoryInfo.loading}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={categoryOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onComplianceCatKeyWordChange}
                variant="standard"
                label={complianceCategory.label}
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {categoryInfo && categoryInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {((getOldData(compliance_category_id)) || (compliance_category_id && compliance_category_id.id) || (catKeyword && catKeyword.length > 0)) && (
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={onCatKeywordClear}
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
              /> */}
          <Box
            sx={{
              width: '30%',
              marginBottom: '20px',
            }}
          >
            <TextField
              fullWidth
              variant="standard"
              name={complianceAct.name}
              label={complianceAct.label}
              type="text"
              disabled
              value={compliance_act && compliance_act.name ? compliance_act.name : getOldData(compliance_act)}
            />
          </Box>
          {/* <MuiAutoComplete
            sx={{
              width: '30%',
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            name={complianceAct.name}
            label={complianceAct.label}
            oldValue={getOldData(compliance_act)}
            value={compliance_act && compliance_act.name ? compliance_act.name : getOldData(compliance_act)}
            apiError={(complianceActInfo && complianceActInfo.err) ? generateErrorMessage(complianceActInfo) : false}
            open={caOpen}
            disabled
            size="small"
            onOpen={() => {
              setCaOpen(true);
              setCaKeyword('');
            }}
            onClose={() => {
              setCaOpen(false);
              setCaKeyword('');
            }}
            loading={complianceActInfo && complianceActInfo.loading}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={complianceActOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onComplianceActKeyWordChange}
                variant="standard"
                label={complianceAct.label}
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {complianceActInfo && complianceActInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {((getOldData(compliance_act)) || (compliance_act && compliance_act.id) || (caKeyword && caKeyword.length > 0)) && (
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={onCaKeywordClear}
                          >
                            <IoCloseOutline size={22} fontSize="small" />
                          </IconButton>
                        )}
                        <IconButton
                          aria-label="toggle search visibility"
                          onClick={showCaModal}
                        >
                          <SearchIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    </>
                  ),
                }}
              />
            )}
              /> */}
          {/* <MuiAutoComplete
            sx={{
              width: '30%',
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            name={submittedTo.name}
            label={submittedTo.label}
            oldValue={getOldData(submitted_to)}
            value={submitted_to && submitted_to.name ? submitted_to.name : getOldData(submitted_to)}
            apiError={(submittedToInfo && submittedToInfo.err) ? generateErrorMessage(submittedToInfo) : false}
            open={subOpen}
            disabled
            size="small"
            onOpen={() => {
              setSubOpen(true);
              setSubKeyword('');
            }}
            onClose={() => {
              setSubOpen(false);
              setSubKeyword('');
            }}
            loading={submittedToInfo && submittedToInfo.loading}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={partnersOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onSubKeyWordChange}
                variant="standard"
                label={submittedTo.label}
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {submittedToInfo && submittedToInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {((getOldData(submitted_to)) || (submitted_to && submitted_to.id) || (subKeyword && subKeyword.length > 0)) && (
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={onSubKeywordClear}
                          >
                            <IoCloseOutline size={22} fontSize="small" />
                          </IconButton>
                        )}
                        <IconButton
                          aria-label="toggle search visibility"
                          onClick={showSubModal}
                        >
                          <SearchIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    </>
                  ),
                }}
              />
            )}
              /> */}
          <Box
            sx={{
              width: '30%',
              marginBottom: '20px',
            }}
          >
            <TextField
              fullWidth
              variant="standard"
              name={submittedTo.name}
              label={submittedTo.label}
              type="text"
              disabled
              value={submitted_to && submitted_to.name ? submitted_to.name : getOldData(submitted_to)}
              formGroupClassName="m-1"
            />
          </Box>
          <Box
            sx={{
              width: '30%',
              marginBottom: '20px',
            }}
          >
            <TextField
              fullWidth
              variant="standard"
              name={Type.name}
              label={Type.label}
              type="text"
              disabled
              value={type && type.label ? type.label : type}
              formGroupClassName="m-1"
            />
          </Box>
          {/* <MuiAutoComplete
            sx={{
              width: '30%',
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            name={Type.name}
            label={Type.label}
            open={typeOpen}
            disableClearable
            oldvalue={type}
            defaultValue={type && type.label ? type.label : type}
            size="small"
            disabled
            onOpen={() => {
              setTypeOpen(true);
            }}
            onClose={() => {
              setTypeOpen(false);
            }}
            getOptionSelected={(option, value) => option.label === value.label}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
            options={customData.typeOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label={Type.label}
                className="without-padding"
                placeholder="Search"
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
              /> */}
          <MuiTextField
            sx={{
              width: '30%',
              marginBottom: '20px',
            }}
            name={licenseNumber.name}
            label={licenseNumber.label}
            setFieldValue={setFieldValue}
            type="text"
          />
          <MuiTextArea
            sx={{
              width: '30%',
              marginBottom: '20px',
            }}
            name={description.name}
            label={description.label}
            setFieldValue={setFieldValue}
            maxRows={4}
            type="text"
          />
        </Box>
        <Typography
          sx={AddThemeColor({
            font: 'normal normal medium 20px/24px Suisse Intl',
            letterSpacing: '0.7px',
            fontWeight: 500,
          })}
        >
          Asset Information
        </Typography>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '3%',
            flexWrap: 'wrap',
          }}
        >
          <MuiAutoComplete
            sx={{
              width: '30%',
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            name={appliesTo.name}
            label={appliesTo.label}
            open={applyOpen}
            disableClearable
            oldvalue={getAppliesToFormLabel(applies_to)}
            defaultValue={applies_to && applies_to.label ? applies_to.label : getAppliesToFormLabel(applies_to)}
            size="small"
            onOpen={() => {
              setApplyOpen(true);
            }}
            onClose={() => {
              setApplyOpen(false);
            }}
            getOptionSelected={(option, value) => option.label === value.label}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
            options={customData.appliesTo}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label={appliesTo.label}
                className="without-padding"
                placeholder="Search"
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
          {appliesToType === 'Location' && (
              <Autocomplete
              sx={{
                width: '30%',
                marginTop: 'auto',
                marginBottom: '20px',
              }}
                multiple
                filterSelectedOptions
                limitTags={3}
                id="tags-filled"
                name={location.name}
                label={location.label}
                open={spaceOpen}
                value={location_ids && location_ids.length > 0 ? location_ids : []}
                defaultValue={((buildingsInfo && !buildingsInfo.loading) || (spaceName && !spaceName.loading)) && spaceName && spaceName.data ? spaceName.data : []}
                size="small"
                onOpen={() => {
                  setSpaceOpen(true);
                }}
                onClose={() => {
                  setSpaceOpen(false);
                }}
                loading={(buildingsInfo && buildingsInfo.loading) || (spaceName && spaceName.loading)}
                options={spaceOptions ? getArrayFromValuesById(spaceOptions, isAssociativeArray(location_ids || []), 'id') : []}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.path_name)}
                onChange={(e, data, reason) => { onChangeOption('location_ids', data, reason); setFieldValue('company_ids', []); setFieldValue('asset_ids', []); }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    label={location.label}
                    placeholder="Select"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {(buildingsInfo && buildingsInfo.loading) || (spaceName && spaceName.loading) ? <CircularProgress color="inherit" size={20} /> : null}
                          <InputAdornment position="end">
                            {location_ids && location_ids.length ? (
                              <IconButton
                                onClick={() => {
                                  setFieldValue('location_ids', []);
                                }}
                              >
                                <IoCloseOutline size={22} fontSize="small" />
                              </IconButton>
                            ) : ''}
                            <IconButton
                              onClick={showLocationModal}
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
          )}
          {appliesToType === 'Site' && (
              <Autocomplete
                sx={{
                  width: '30%',
                  marginTop: 'auto',
                  marginBottom: '20px',
                }}
                multiple
                filterSelectedOptions
                limitTags={3}
                id="tags-filled"
                name={companyId.name}
                label={companyId.label}
                open={companiesOpen}
                value={companyDatas}
                defaultValue={(allowCompanies && !allowCompanies.loading) && allowCompanies && allowCompanies.data ? allowCompanies.data : []}
                size="small"
                onOpen={() => {
                  setCompaniesOpen(true);
                }}
                onClose={() => {
                  setCompaniesOpen(false);
                }}
                loading={(userInfo && userInfo.loading)}
                options={userCompanies ? getArrayFromValuesById(userCompanies, isAssociativeArray(company_ids || []), 'id') : []}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                onChange={(e, data, reason) => { onChangeOption('company_ids', data, reason); setFieldValue('location_ids', []); setFieldValue('asset_ids', []); }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    label={companyId.label}
                    className="without-padding"
                    required
                    placeholder="Select"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {(userInfo && userInfo.loading) ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
          )}
          {appliesToType === 'Asset' && (
              <Autocomplete
              sx={{
                width: '30%',
                marginTop: 'auto',
                marginBottom: '20px',
              }}
                multiple
                filterSelectedOptions
                limitTags={3}
                id="tags-filled"
                name={assetIds.name}
                label={assetIds.label}
                open={assetOpen}
                value={asset_ids && asset_ids.length > 0 ? asset_ids : []}
                defaultValue={((equipmentInfo && !equipmentInfo.loading) || (assetNameInfo && !assetNameInfo.loading)) && assetNameInfo && assetNameInfo.data ? assetNameInfo.data : []}
                size="small"
                onOpen={() => {
                  setAssetOpen(true);
                }}
                onClose={() => {
                  setAssetOpen(false);
                }}
                loading={(equipmentInfo && equipmentInfo.loading) || (assetNameInfo && assetNameInfo.loading)}
                options={assetOptions ? getArrayFromValuesById(assetOptions, isAssociativeArray(asset_ids || []), 'id') : []}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                onChange={(e, data, reason) => { onChangeOption('asset_ids', data, reason); setFieldValue('location_ids', []); setFieldValue('company_ids', []); }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    label={assetIds.label}
                    required
                    placeholder="Select"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {(equipmentInfo && equipmentInfo.loading) || (assetNameInfo && assetNameInfo.loading) ? <CircularProgress color="inherit" size={20} /> : null}
                          <InputAdornment position="end">
                            {asset_ids && asset_ids.length ? (
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => {
                                  setFieldValue('asset_ids', []);
                                }}
                              >
                                <IoCloseOutline size={22} fontSize="small" />
                              </IconButton>
                            ) : ''}
                            <IconButton
                              aria-label="toggle search visibility"
                              onClick={showEquipmentModal}
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
          )}
          <MuiAutoComplete
            sx={{
              width: '30%',
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            name={responsible.name}
            label={responsible.label}
            oldValue={getOldData(responsible_id)}
            value={responsible_id && responsible_id.name ? responsible_id.name : getOldData(responsible_id)}
            apiError={(teamsInfo && teamsInfo.err) ? generateErrorMessage(teamsInfo) : false}
            open={employeeOpen}
            size="small"
            onOpen={() => {
              setEmployeeOpen(true);
              setEmployeeKeyword('');
            }}
            onClose={() => {
              setEmployeeOpen(false);
              setEmployeeKeyword('');
            }}
            loading={teamsInfo && teamsInfo.loading}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={responsibleOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onEmployeeKeyWordChange}
                variant="standard"
                label={responsible.label}
                className="without-padding"
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {teamsInfo && teamsInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </Box>
        <Typography
          sx={AddThemeColor({
            font: 'normal normal medium 20px/24px Suisse Intl',
            letterSpacing: '0.7px',
            fontWeight: 500,
          })}
        >
          Recurrence Information
        </Typography>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '3%',
            flexWrap: 'wrap',
          }}
        >
          {/* <Checkbox
            name={hasExpiry.name}
            label={hasExpiry.label}
          /> */}
          <FormControlLabel
            control={<Checkbox checked={checked} onChange={handleChange} name={hasExpiry.name} color="success" />}
            label="Has Expiry?"
          />
          {is_has_expiry && (
            <>
              <MuiDateTimeField
                sx={{
                  marginTop: 'auto',
                  marginBottom: '20px',
                }}
                name={nextExpiryDate.name}
                label={nextExpiryDate.label}
                isRequired
                formGroupClassName="m-1"
                setFieldValue={setFieldValue}
                setFieldTouched={setFieldTouched}
                placeholder={nextExpiryDate.label}
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
              {/* <DateTimeField
                  name={nextExpiryDate.name}
                  label={nextExpiryDate.label}
                  isRequired={nextExpiryDate.required}
                  setFieldValue={setFieldValue}
                  setFieldTouched={setFieldTouched}
                  disablePastDate
                  placeholder={nextExpiryDate.label}
                  defaultValue={next_expiry_date ? new Date(getDateTimeSeconds(next_expiry_date)) : ''}
                /> */}
              <MuiTextField
                sx={{
                  width: '30%',
                  marginBottom: '20px',
                }}
                name={expirySchedule.name}
                label={expirySchedule.label}
                isRequired
                type="text"
              />
              <MuiAutoComplete
                sx={{
                  width: '30%',
                  marginTop: 'auto',
                  marginBottom: '20px',
                }}
                name={expiryScheduleType.name}
                label={expiryScheduleType.label}
                labelClassName="font-weight-600"
                className="bg-white"
                open={rTypeOpen}
                disableClearable
                oldValue={getRuleTypeLabel(expiry_schedule_type)}
                value={expiry_schedule_type && expiry_schedule_type.label ? expiry_schedule_type.label : getRuleTypeLabel(expiry_schedule_type)}
                size="small"
                onOpen={() => {
                  setRtypeOpen(true);
                }}
                onClose={() => {
                  setRtypeOpen(false);
                }}
                getOptionSelected={(option, value) => option.label === value.label}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                options={customData.ruleTypes}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    label={expiryScheduleType.label}
                    required
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
              <MuiAutoComplete
                sx={{
                  width: '30%',
                  marginTop: 'auto',
                  marginBottom: '20px',
                }}
                name={repeatUntil.name}
                label={repeatUntil.label}
                isRequired
                labelClassName="font-weight-600"
                className="bg-white"
                open={repeatOpen}
                disableClearable
                oldValue={getRepeatLabel(repeat_until)}
                value={repeat_until && repeat_until.label ? repeat_until.label : getRepeatLabel(repeat_until)}
                size="small"
                onOpen={() => {
                  setRepeatOpen(true);
                }}
                onClose={() => {
                  setRepeatOpen(false);
                }}
                getOptionSelected={(option, value) => option.label === value.label}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                options={customData.repeatType}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    label={repeatUntil.label}
                    required
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
              {repeatType === 'Ends On' && (
              <MuiDateTimeField
                sx={{
                  marginTop: 'auto',
                  marginBottom: '20px',
                }}
                name={endDate.name}
                label={endDate.label}
                isRequired
                formGroupClassName="m-1"
                setFieldValue={setFieldValue}
                setFieldTouched={setFieldTouched}
                placeholder={endDate.label}
                onChange={handleEndDateChange}
                disablePastDate
                value={selectedEndDate}
                slotProps={{
                  actionBar: {
                    actions: ['clear', 'accept'],
                  },
                  textField: {
                    variant: 'standard', error: false,
                  },
                }}
              />
              // <DateTimeField
              //   name={endDate.name}
              //   label={endDate.label}
              //   disablePastDate={!editId}
              //   setFieldValue={setFieldValue}
              //   setFieldTouched={setFieldTouched}
              //   placeholder={endDate.label}
              //   defaultValue={end_date ? new Date(getDateTimeSeconds(end_date)) : ''}
              // />
              )}
              <MuiTextField
                sx={{
                  width: '30%',
                  marginBottom: '20px',
                }}
                name={renewalLeadTime.name}
                label={renewalLeadTime.label}
                isRequired
                type="text"
              />
            </>
          )}
        </Box>
      </Box>
      <Dialog size="lg" fullWidth open={extraModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraModal(false); setDetailShow(true); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <SingleSearchModal
              modelName={modelValue}
              afterReset={() => { setExtraModal(false); setDetailShow(true); }}
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
      <Dialog size="lg" fullWidth open={extraSearchModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraSearchModal(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <MultipleSearchModal
              modelName={modelValue}
              afterReset={() => { setExtraSearchModal(false); }}
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
});

BasicForm.propTypes = {
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
  reload: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  setFieldTouched: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  setRepeatUntildata: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  setEendsOnData: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  setNextExpiryDateData: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default BasicForm;
