/* eslint-disable radix */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable camelcase */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {
  TextField, CircularProgress, FormHelperText, FormControl,
} from '@material-ui/core';
import {
  Row, Col, Label,
  Modal,
  ModalBody, Card, CardBody,
} from 'reactstrap';
import { useFormikContext } from 'formik';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';
import { Autocomplete } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment-timezone';

import ModalHeaderComponent from '@shared/modalHeaderComponent';
import {
  InputField, FormikAutocomplete, CheckboxField, DateTimeField,
} from '@shared/formFields';
import SingleSearchModal from '@shared/searchModals/singleSearchModal';
import MultipleSearchModal from '@shared/searchModals/multipleSearchModal';
import {
  generateErrorMessage,
  getArrayFromValuesById, getColumnArrayById, isArrayColumnExists,
  getAllowedCompanies, extractOptionsObject, getDateTimeSeconds,
} from '../../util/appUtils';
import {
  getComplianceTemplate, getComplianceAct, getSubmittedTo, getComplianceTemplateDetail, getComplianceCategory,
} from '../complianceService';
import {
  getTeamList, getSpaceName, getBuildings, getAssetName,
} from '../../assets/equipmentService';
import { getEquipmentList } from '../../helpdesk/ticketService';
import { getAllowComapaniesData } from '../../adminSetup/setupService';

import customData from '../data/customData.json';
import { getAppliesToFormLabel, getRuleTypeLabel, getRepeatLabel } from '../utils/utils';

const appModels = require('../../util/appModels').default;

const useStyles = makeStyles((themeStyle) => ({
  margin: {
    marginBottom: themeStyle.spacing(1.25),
    width: '100%',
  },
}));

const BasicForm = React.memo((props) => {
  const {
    setRepeatUntildata,
    setEendsOnData,
    setNextExpiryDateData,
    editId,
    isUpdate,
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
    renewal_lead_time,
    is_has_expiry, next_expiry_date,
    expiry_schedule_type, repeat_until, end_date,
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
  const [nextExp, setNextExp] = useState('');
  const [endDateFormat, setEndDateFormat] = useState('');

  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [columns, setColumns] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [oldValues, setOldValues] = useState([]);
  const [fieldValueClear, setFieldValueClear] = useState(false);
  const { userInfo } = useSelector((state) => state.user);
  const {
    complianceActInfo, complianceTemplateInfo, submittedToInfo, templateCompliance, addComplianceInfo, categoryInfo,
  } = useSelector((state) => state.compliance);
  const {
    teamsInfo, buildingsInfo, spaceName, assetNameInfo,
  } = useSelector((state) => state.equipment);
  const {
    allowCompanies, tenantUpdateInfo,
  } = useSelector((state) => state.setup);
  const { equipmentInfo } = useSelector((state) => state.ticket);
  const companies = getAllowedCompanies(userInfo);

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
    if (compliance_id) {
      const complianceId = compliance_id && compliance_id.id ? compliance_id.id : false;
      if (complianceId && detailShow) {
        dispatch(getComplianceTemplateDetail(complianceId, appModels.COMPLIANCETEMPLATE));
      }
    }
  }, [compliance_id]);

  useEffect(() => {
    if (templateCompliance && templateCompliance.data && templateCompliance.data.length > 0) {
      const complianceName = templateCompliance.data[0].name ? templateCompliance.data[0].name : '';
      const Category = templateCompliance.data[0].compliance_category_id ? templateCompliance.data[0].compliance_category_id : '';
      const Act = templateCompliance.data[0].compliance_act ? templateCompliance.data[0].compliance_act : '';
      const submitTo = templateCompliance.data[0].submitted_to ? templateCompliance.data[0].submitted_to : '';
      const hasExp = templateCompliance.data[0].is_has_expiry;
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
      if (expiryScheduleTypeValue) {
        setFieldValue('expiry_schedule_type', { value: expiryScheduleTypeValue, label: expiryScheduleTypeValue });
      }
      setFieldValue('is_has_expiry', hasExp);
      setFieldValue('expiry_schedule', expiryScheduleValue);
      setFieldValue('renewal_lead_time', renewalLeadTimeValue);
    }
  }, [templateCompliance]);

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
    if (nextExp) {
      setNextExpiryDateData(nextExp);
    }
  }, [nextExp]);

  useEffect(() => {
    if (next_expiry_date !== '' && end_date !== '') {
      setEndDateFormat(moment(end_date).format('YYYY-MM-DD HH-mm-ss'));
      setNextExp(moment(next_expiry_date).format('YYYY-MM-DD HH-mm-ss'));
    } else {
      setEndDateFormat('');
      setNextExp('');
    }
  }, [next_expiry_date, end_date]);

  useEffect(() => {
    if (renewal_lead_time && !editId) {
      setFieldValue('next_expiry_date', moment(new Date()).add(renewal_lead_time, 'days'));
    }
  }, [renewal_lead_time, isUpdate]);

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
      if (userInfo && userInfo.data && ctOpen) {
        await dispatch(getComplianceTemplate(companies, appModels.COMPLIANCETEMPLATE, ctKeyword));
      }
    })();
  }, [userInfo, ctKeyword, ctOpen]);

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
        await dispatch(getComplianceCategory(companies, appModels.COMPLIANCECATEGORY, false, catKeyword));
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
    setFieldValue('compliance_act', '');
    setFieldValue('submitted_to', '');
    setFieldValue('is_has_expiry', false);
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
    setCompanyValue('');
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

  return (
    <>
      <Row className="mb-1">
        <Col xs={12} sm={6} lg={6} md={6}>
          <Col xs={12} sm={12} md={12} lg={12}>
            <Card className="no-border-radius mt-3 mb-2">
              <CardBody className="p-0 bg-porcelain">
                <p className="ml-2 mb-1 mt-1 font-weight-600 font-side-heading">Compliance Info</p>
              </CardBody>
            </Card>
          </Col>
          <Col xs={12} sm={12} lg={12} md={12}>
            <InputField
              name={name.name}
              label={name.label}
              type="text"
              disabled
              formGroupClassName="m-1"
            />
          </Col>
          <Col xs={12} sm={12} lg={12} md={12}>
            <FormikAutocomplete
              name={complianceTemplate.name}
              label={complianceTemplate.label}
              formGroupClassName="m-1"
              isRequired
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
                  variant="outlined"
                  className={((getOldData(compliance_id)) || (compliance_id && compliance_id.id) || (caKeyword && caKeyword.length > 0))
                    ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
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
                              <BackspaceIcon fontSize="small" />
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
          </Col>
          <Col xs={12} sm={12} lg={12} md={12}>
            <FormikAutocomplete
              name={complianceCategory.name}
              label={complianceCategory.label}
              formGroupClassName="m-1"
              oldValue={getOldData(compliance_category_id)}
              value={compliance_category_id && compliance_category_id.name ? compliance_category_id.name : getOldData(compliance_category_id)}
              apiError={(categoryInfo && categoryInfo.err) ? generateErrorMessage(categoryInfo) : false}
              open={catOpen}
              size="small"
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
                  variant="outlined"
                  className={((getOldData(compliance_category_id)) || (compliance_category_id && compliance_category_id.id) || (catKeyword && catKeyword.length > 0))
                    ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
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
                              <BackspaceIcon fontSize="small" />
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
          </Col>
          <Col xs={12} sm={12} lg={12} md={12}>
            <FormikAutocomplete
              name={complianceAct.name}
              label={complianceAct.label}
              formGroupClassName="m-1"
              oldValue={getOldData(compliance_act)}
              value={compliance_act && compliance_act.name ? compliance_act.name : getOldData(compliance_act)}
              apiError={(complianceActInfo && complianceActInfo.err) ? generateErrorMessage(complianceActInfo) : false}
              open={caOpen}
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
                  variant="outlined"
                  className={((getOldData(compliance_act)) || (compliance_act && compliance_act.id) || (caKeyword && caKeyword.length > 0))
                    ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
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
                              <BackspaceIcon fontSize="small" />
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
            />
          </Col>
          <Col xs={12} sm={12} lg={12} md={12}>
            <FormikAutocomplete
              name={submittedTo.name}
              label={submittedTo.label}
              formGroupClassName="m-1"
              oldValue={getOldData(submitted_to)}
              value={submitted_to && submitted_to.name ? submitted_to.name : getOldData(submitted_to)}
              apiError={(submittedToInfo && submittedToInfo.err) ? generateErrorMessage(submittedToInfo) : false}
              open={subOpen}
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
                  variant="outlined"
                  className={((getOldData(submitted_to)) || (submitted_to && submitted_to.id) || (subKeyword && subKeyword.length > 0))
                    ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
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
                              <BackspaceIcon fontSize="small" />
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
            />
          </Col>
          <br />
          <Col xs={12} sm={12} md={12} lg={12}>
            <Card className="no-border-radius mt-3 mb-2">
              <CardBody className="p-0 bg-porcelain">
                <p className="ml-2 mb-1 mt-1 font-weight-600 font-side-heading">Asset Info</p>
              </CardBody>
            </Card>
          </Col>
          <Col xs={12} sm={12} md={12} lg={12}>
            <FormikAutocomplete
              name={appliesTo.name}
              label={appliesTo.label}
              labelClassName="mb-1"
              isRequired
              formGroupClassName="mb-1 w-100"
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
                  variant="outlined"
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
          </Col>
          {appliesToType === 'Location' && (
            <Col xs={12} sm={12} md={12} lg={12}>
              <FormControl className={classes.margin}>
                <Label for={location.name}>
                  {location.label}
                  {' '}
                  <span className="text-danger">*</span>
                </Label>
                <Autocomplete
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
                      variant="outlined"
                      className={((getOldData(location_ids)) || (location_ids && location_ids.length > 0))
                        ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
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
                                  <BackspaceIcon fontSize="small" />
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
              </FormControl>
              {(buildingsInfo && buildingsInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(buildingsInfo)}</span></FormHelperText>)}
            </Col>
          )}
          {appliesToType === 'Site' && (
            <Col xs={12} sm={12} md={12} lg={12}>
              <FormControl className={classes.margin}>
                <Label for={companyId.name}>
                  {companyId.label}
                  {' '}
                  <span className="text-danger">*</span>
                </Label>
                <Autocomplete
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
                      variant="outlined"
                      className="without-padding"
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
              </FormControl>
              {(userInfo && userInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(userInfo)}</span></FormHelperText>)}
            </Col>
          )}
          {appliesToType === 'Asset' && (
            <Col xs={12} sm={12} md={12} lg={12}>
              <FormControl className={classes.margin}>
                <Label for={assetIds.name}>
                  {assetIds.label}
                  {' '}
                  <span className="text-danger">*</span>
                </Label>
                <Autocomplete
                  multiple
                  filterSelectedOptions
                  formGroupClassName="m-1"
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
                      variant="outlined"
                      className={((getOldData(asset_ids)) || (asset_ids && asset_ids.length > 0))
                        ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                      placeholder="Select"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {(equipmentInfo && equipmentInfo.loading) || (assetNameInfo && assetNameInfo.loading) ? <CircularProgress color="inherit" size={20} /> : null}
                            <InputAdornment position="end">
                              {asset_ids && asset_ids.length ? (
                                <IconButton
                                  onClick={() => {
                                    setFieldValue('asset_ids', []);
                                  }}
                                >
                                  <BackspaceIcon fontSize="small" />
                                </IconButton>
                              ) : ''}
                              <IconButton
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
              </FormControl>
              {(equipmentInfo && equipmentInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(equipmentInfo)}</span></FormHelperText>)}
            </Col>
          )}
          <Col xs={12} sm={12} md={12} lg={12}>
            <FormikAutocomplete
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
                  variant="outlined"
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
          </Col>
        </Col>
        <Col xs={12} sm={6} lg={6} md={6}>
          <Col xs={12} sm={12} md={12} lg={12}>
            <Card className="no-border-radius mt-3 mb-2">
              <CardBody className="p-0 bg-porcelain">
                <p className="ml-2 mb-1 mt-1 font-weight-600 font-side-heading">Recurrence Info</p>
              </CardBody>
            </Card>
          </Col>
          <Col xs={12} sm={12} md={12} lg={12}>
            <CheckboxField
              name={hasExpiry.name}
              label={hasExpiry.label}
            />
            <br />
          </Col>
          {is_has_expiry && (
            <>
              <Col xs={12} sm={12} md={12} lg={12}>
                <DateTimeField
                  name={nextExpiryDate.name}
                  label={nextExpiryDate.label}
                  isRequired={nextExpiryDate.required}
                  setFieldValue={setFieldValue}
                  setFieldTouched={setFieldTouched}
                  disablePastDate
                  disableCustom
                  subnoofdays={renewal_lead_time ? parseInt(renewal_lead_time) : 0}
                  placeholder={nextExpiryDate.label}
                  defaultValue={next_expiry_date ? new Date(getDateTimeSeconds(next_expiry_date)) : ''}
                />
              </Col>
              <Row className="m-0">
                <Col xs={12} sm={6} md={6} lg={6}>
                  <InputField name={expirySchedule.name} isRequired label={expirySchedule.label} type="text" labelClassName="font-weight-600" />
                </Col>
                <Col xs={12} sm={6} md={6} lg={6}>
                  <FormikAutocomplete
                    name={expiryScheduleType.name}
                    label={expiryScheduleType.label}
                    labelClassName="font-weight-600"
                    className="bg-white"
                    isRequired
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
              </Row>
              <Col xs={12} sm={12} md={12} lg={12}>
                <FormikAutocomplete
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
              {repeatType === 'Ends On' && (
                <Col xs={12} sm={12} md={12} lg={12}>
                  <DateTimeField
                    isRequired={endDate.required}
                    name={endDate.name}
                    label={endDate.label}
                    disablePastDate={!editId}
                    setFieldValue={setFieldValue}
                    setFieldTouched={setFieldTouched}
                    placeholder={endDate.label}
                    defaultValue={end_date ? new Date(getDateTimeSeconds(end_date)) : ''}
                  />
                  {repeatType === 'Ends On' && end_date === '' && (
                  <p className="text-danger">{endDate && endDate.requiredErrorMsg}</p>
                  )}
                  {nextExp !== '' && endDateFormat !== '' && endDateFormat > nextExp ? (
                    <p className="text-danger">The selected New Expiry Date should be Greater than End Date</p>
                  ) : ('')}
                </Col>
              )}
              <Col xs={12} sm={12} md={12} lg={12}>
                <InputField name={renewalLeadTime.name} isRequired label={renewalLeadTime.label} type="text" labelClassName="font-weight-600" />
              </Col>
            </>
          )}
        </Col>
      </Row>
      <Modal size="xl" className="border-radius-50px modal-dialog-centered" isOpen={extraModal}>
        <ModalHeaderComponent title={modalName} imagePath={false} closeModalWindow={() => { setExtraModal(false); setDetailShow(true); }} />
        <ModalBody className="mt-0 pt-0">
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
        </ModalBody>
      </Modal>
      <Modal size="xl" className="border-radius-50px modal-dialog-centered" isOpen={extraSearchModal}>
        <ModalHeaderComponent title={modalName} imagePath={false} closeModalWindow={() => { setExtraSearchModal(false); }} />
        <ModalBody className="mt-0 pt-0">
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
        </ModalBody>
      </Modal>
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
};

export default BasicForm;
