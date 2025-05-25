/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import {
  CircularProgress, FormHelperText,
  TextField,
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import { makeStyles } from '@material-ui/core/styles';
import BackspaceIcon from '@material-ui/icons/Backspace';
import moment from 'moment-timezone';
import dayjs from 'dayjs';
import SearchIcon from '@material-ui/icons/Search';
import {
  Dialog, DialogContent, DialogContentText, Typography, Box, ListItemText,
} from '@mui/material';
import { useFormikContext } from 'formik';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Spinner,
  Label,
} from 'reactstrap';
import { IoCloseOutline } from 'react-icons/io5';

import {
  CheckboxField,
} from '@shared/formFields';
import MultipleSearchModal from '@shared/searchModals/multipleSearchModal';
import DialogHeader from '../../commonComponents/dialogHeader';
import { getEquipmentList, getSpaceAllSearchList } from '../../helpdesk/ticketService';
import {
  getMailTemplate, getRecipientList,
} from '../../siteOnboarding/siteService';
import {
  generateErrorMessage,
  getAllowedCompanies,
  integerKeyPress,
  getArrayFromValuesById,
  isAssociativeArray,
  getColumnArrayById,
  isArrayColumnExists,
  extractTextObject,
  extractOptionsObject,
} from '../../util/appUtils';

import customData from '../data/customData.json';
import {
  getTypeLabel,
} from '../utils/utils';
import SearchModalMultiple from './searchModalMultiple';
import SearchModal from './searchModal';
import {
  getSurveyLocations, getEscalationPolicy,
} from '../surveyService';
import {
  getPartners,
} from '../../assets/equipmentService';
import { AddThemeColor } from '../../themes/theme';
import MuiTextField from '../../commonComponents/formFields/muiTextField';
import MuiTextArea from '../../commonComponents/formFields/muiTextarea';
import MuiAutoComplete from '../../commonComponents/formFields/muiAutocomplete';
import MuiFormLabel from '../../commonComponents/formFields/muiFormLabel';
import MuiCheckboxField from '../../commonComponents/formFields/muiCheckbox';
import MuiDateTimeField from '../../commonComponents/formFields/muiDateTimeField';

const appModels = require('../../util/appModels').default;

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

const AdditionalForm = React.memo((props) => {
  const {
    reload,
    editId,
    setFieldValue,
    setFieldTouched,
    formField: {
      categoryType,
      spaceId,
      equipmentCategoryId,
      verificationByOtp,
      reviewerName,
      hasTenant,
      reviewerEmail,
      reviewerMobile,
      disclaimer,
      disclaimerText,
      feedbackText,
      surveyTime,
      successfulHomepageReturnTime,
      isAllSpaces,
      spaceLevel,
      isSendEmail,
      isRepeats,
      startsOn,
      Day,
      mo,
      tu,
      we,
      th,
      fr,
      sa,
      su,
      recurrentRule,
      deadLine,
      answeredAlready,
      deadlineElapsed,
      escalationPolicyId,
      campaignEmailId,
      reminderEmailId,
    },
  } = props;
  const dispatch = useDispatch();
  const { values: formValues } = useFormikContext();
  const {
    category_type, starts_on, is_repeats, campaign_email_id, reminder_email_id, recurrent_rule, is_send_email, tenant_ids, is_show_all_spaces, space_level, location_id, equipment_id, has_disclaimer, location_ids, escalation_policy_id, recipients_ids,
  } = formValues;

  const refresh = reload;
  const [typeOpen, setTypeOpen] = useState(false);
  const [typeValue, setTypeValue] = useState(false);
  const [spaceOpen, setSpaceOpen] = useState(false);
  const [equipmentOpen, setEquipmentOpen] = useState(false);
  const [spacekeyword, setSpaceKeyword] = useState('');
  const [equipmentkeyword, setEquipmentkeyword] = useState('');
  const [spaceOpen1, setSpaceOpen1] = useState(false);
  const [spacekeyword1, setSpaceKeyword1] = useState('');
  const [levelOpen, setLevelOpen] = useState(false);
  const [extraModal, setExtraModal] = useState(false);
  const [extraModal1, setExtraModal1] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [columns, setColumns] = useState([]);
  const [extraSearchModal, setExtraSearchModal] = useState(false);
  const [headers, setHeaders] = useState([]);
  const [oldValues, setOldValues] = useState([]);

  const [repeatOpen, setRepeatOpen] = useState(false);

  const [cMailOpen, setCmailOpen] = useState(false);
  const [ePolicyOpen, setEpolicyOpen] = useState(false);
  const [rMailOpen, setRmailOpen] = useState(false);
  const [enter, setEnter] = useState(false);

  const [tenantOpen, setTenantOpen] = useState(false);
  const [tenantKeyword, setTenantKeyword] = useState(false);
  const [ePolicyKeyword, setEPolicyKeyword] = useState(false);

  const [rcOpen, setRcOpen] = useState(false);
  const [rcKeyword, setRcKeyword] = useState(false);

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);

  const { spaceInfoList, equipmentInfo } = useSelector((state) => state.ticket);
  const {
    surveyLocations,
    surveyTenants,
    surveyDetails,
    surveyEpolicy,
    surveyRecipients,
  } = useSelector((state) => state.survey);
  const {
    mailInfoList,
  } = useSelector((state) => state.site);

  const {
    partnersInfo,
  } = useSelector((state) => state.equipment);

  function isAssociativeArray(arr) {
    let result = arr;
    if (isArrayColumnExists(arr, 'id')) {
      result = getColumnArrayById(arr, 'id');
    }
    return result;
  }

  useEffect(() => {
    if (userInfo && userInfo.data) {
      dispatch(getMailTemplate(companies, appModels.MAILTEMPLATE, false, appModels.SURVEY));
    }
  }, [userInfo]);

  useEffect(() => {
    if (enter) {
      setFieldValue('recipients_ids', []);
    }
  }, [enter]);

  useEffect(() => {
    if (!is_send_email) {
      setFieldValue('starts_on', moment().tz(userInfo?.data?.timezone).format('YYYY-MM-DD'));
      setFieldValue('day', 1);
      setFieldValue('is_repeats', true);
      setFieldValue('recurrent_rule', '');
      setFieldValue('deadline', 1);
      setFieldValue('answered_already', 'Thank you. You have responded already.');
      setFieldValue('deadline_elapsed', 'Oops! This survey has expired.');
      setFieldValue('escalation_policy_id', false);
      setFieldValue('campaign_email_id', false);
      setFieldValue('reminder_email_id', false);
      setFieldValue('recipients_ids', []);
      setFieldValue('mo', 0);
      setFieldValue('tu', 0);
      setFieldValue('we', 0);
      setFieldValue('th', 0);
      setFieldValue('fr', 0);
      setFieldValue('sa', 0);
      setFieldValue('su', 0);
      setEnter(Math.random());
    }
  }, [is_send_email]);

  const detailData = surveyDetails && (surveyDetails.data && surveyDetails.data.length > 0) ? surveyDetails.data[0] : '';

  const locationOptions = detailData && detailData.location_ids && detailData.location_ids.length > 0 ? detailData.location_ids : [];

  useEffect(() => {
    (async () => {
      if (category_type && category_type.value) {
        setTypeValue(category_type.value);
        setFieldValue('equipment_id', '');
        setFieldValue('location_id', '');
        setFieldValue('location_ids', []);
        setFieldValue('disclaimer_text', '');
        setFieldValue('is_show_all_spaces', false);
      } else if (!category_type) {
        setTypeValue(category_type);
        setFieldValue('equipment_id', '');
        setFieldValue('location_id', '');
        setFieldValue('location_ids', []);
        setFieldValue('disclaimer_text', '');
        setFieldValue('is_show_all_spaces', false);
      } else if (category_type) {
        setTypeValue(category_type);
      }
    })();
  }, [category_type, refresh]);

  useEffect(() => {
    (async () => {
      if (is_show_all_spaces) {
        setFieldValue('location_id', '');
        setFieldValue('location_ids', []);
      }
    })();
  }, [is_show_all_spaces]);

  useEffect(() => {
    if (!editId && recurrent_rule && recurrent_rule.value) {
      if (recurrent_rule.value === 'weekly') { setFieldValue('deadline', 7); }
    }
  }, [recurrent_rule]);

  useEffect(() => {
    if (editId && surveyLocations && surveyLocations.data) {
      setFieldValue('location_ids', surveyLocations.data);
    }
  }, [editId]);

  useEffect(() => {
    if (editId && surveyTenants && surveyTenants.data) {
      setFieldValue('tenant_ids', surveyTenants.data);
    }
  }, [editId]);

  useEffect(() => {
    if (editId && surveyRecipients && surveyRecipients.data) {
      setFieldValue('recipients_ids', surveyRecipients.data);
    }
  }, [editId]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && spaceOpen) {
        await dispatch(getSpaceAllSearchList(companies, appModels.SPACE, spacekeyword));
      }
    })();
  }, [spaceOpen, spacekeyword]);

  useEffect(() => {
    if (userInfo && userInfo.data && tenantOpen) {
      dispatch(getPartners(companies, appModels.PARTNER, 'is_tenant', tenantKeyword, false, true));
    }
  }, [tenantKeyword, tenantOpen]);

  useEffect(() => {
    if (userInfo && userInfo.data && rcOpen) {
      dispatch(getPartners(companies, appModels.PARTNER, false, rcKeyword, false, true));
    }
  }, [rcKeyword, rcOpen]);

  useEffect(() => {
    if (userInfo && userInfo.data && ePolicyOpen) {
      dispatch(getEscalationPolicy(companies, appModels.SURVEYESCALATION, ePolicyKeyword));
    }
  }, [ePolicyKeyword, ePolicyOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && spaceOpen1) {
        await dispatch(getSpaceAllSearchList(companies, appModels.SPACE, spacekeyword1));
      }
    })();
  }, [spaceOpen1, spacekeyword1]);

  const onSpaceKeywordChange1 = (event) => {
    setSpaceKeyword1(event.target.value);
  };

  const onTenantKeywordChange = (event) => {
    setTenantKeyword(event.target.value);
  };

  useEffect(() => {
    (async () => {
      if (userInfo.data && equipmentOpen) {
        await dispatch(getEquipmentList(companies, appModels.EQUIPMENT, equipmentkeyword));
      }
    })();
  }, [equipmentOpen, equipmentkeyword]);

  const onSpaceKeywordChange = (event) => {
    setSpaceKeyword(event.target.value);
  };

  const onSpaceSearch = () => {
    setModelValue(appModels.SPACE);
    setFieldName('location_ids');
    setModalName('Locations');
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setExtraSearchModal(true);
    setColumns(['space_name', 'path_name', 'asset_category_id', 'id']);
    setHeaders(['Path Name', 'Space Name', 'Category']);
    setOldValues(location_ids);
  };

  const onTenantSearch = () => {
    setModelValue(appModels.PARTNER);
    setFieldName('tenant_ids');
    setModalName('Tenants');
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setExtraSearchModal(true);
    setColumns(['name', 'display_name', 'email', 'id', 'mobile']);
    setHeaders(['Name', 'Email', 'Mobile']);
    setOldValues(tenant_ids);
  };

  const onRPSearch = () => {
    setModelValue(appModels.PARTNER);
    setFieldName('recipients_ids');
    setModalName('Recipients');
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setExtraSearchModal(true);
    setColumns(['name', 'display_name', 'email', 'id', 'mobile']);
    setHeaders(['Name', 'Email', 'Mobile']);
    setOldValues(recipients_ids);
  };

  const onSpaceSearch1 = () => {
    setModelValue(appModels.SPACE);
    setFieldName('location_id');
    setModalName('Space');
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setColumns(['id', 'space_name', 'path_name']);
    setExtraModal(true);
  };

  const onSpaceClear = () => {
    setSpaceKeyword(null);
    setSpaceOpen(false);
    setFieldValue('location_id', []);
  };

  const onEquipmentKeywordChange = (event) => {
    setEquipmentkeyword(event.target.value);
  };

  const onEquipemntSearch = () => {
    setModelValue(appModels.EQUIPMENT);
    setFieldName('equipment_id');
    setModalName('Equipment');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setColumns(['id', 'name', 'location_id']);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraModal(true);
  };

  const onEPSearch = () => {
    setModelValue(appModels.SURVEYESCALATION);
    setFieldName('escalation_policy_id');
    setModalName('Escalation Policy');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setColumns(['id', 'name']);
    setCompanyValue('');
    setExtraModal1(true);
  };

  const onCMSearch = () => {
    setModelValue(appModels.MAILTEMPLATE);
    setFieldName('campaign_email_id');
    setModalName('Campaign Email');
    setOtherFieldName('model_id');
    setOtherFieldValue(appModels.SURVEY);
    setColumns(['id', 'name']);
    setCompanyValue('');
    setExtraModal1(true);
  };

  const onRMSearch = () => {
    setModelValue(appModels.MAILTEMPLATE);
    setFieldName('reminder_email_id');
    setModalName('Reminder Email');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setColumns(['id', 'name']);
    setCompanyValue('');
    setExtraModal1(true);
  };

  const onEquipmentClear = () => {
    setEquipmentkeyword(null);
    setEquipmentOpen(false);
    setFieldValue('equipment_id', '');
  };

  const onCmailClear = () => {
    setCmailOpen(false);
    setFieldValue('campaign_email_id', '');
  };

  const onEPolicyClear = () => {
    setEpolicyOpen(false);
    setFieldValue('escalation_policy_id', '');
  };

  const onRmailClear = () => {
    setRmailOpen(false);
    setFieldValue('reminder_email_id', '');
  };

  let spaceOptions = [];
  let equipmentOptions = [];
  let tenantOptions = [];
  let rcOptions = [];

  const oldSpaces = surveyLocations && surveyLocations.data ? surveyLocations.data : [];
  const oldTenants = surveyTenants && surveyTenants.data ? surveyTenants.data : [];

  if (spaceInfoList && spaceInfoList.loading) {
    spaceOptions = [{ path_name: 'Loading..' }];
  }
  if (spaceInfoList && spaceInfoList.data) {
    spaceOptions = spaceInfoList.data;
  }
  if (location_ids && location_ids.length && location_ids.length > 0) {
    const oldId = oldSpaces;
    const newArr = [...spaceOptions, ...oldId];
    spaceOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  if (spaceInfoList && spaceInfoList.err) {
    spaceOptions = [];
  }

  if (partnersInfo && partnersInfo.loading && rcOpen) {
    rcOptions = [{ name: 'Loading..', display_name: 'Loading..' }];
  }
  if (partnersInfo && partnersInfo.data && rcOpen) {
    rcOptions = partnersInfo.data;
  }
  if (recipients_ids && recipients_ids.length && recipients_ids.length > 0) {
    const oldId = oldTenants;
    const newArr = [...rcOptions, ...oldId];
    rcOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  if (recipients_ids && recipients_ids.err) {
    rcOptions = [];
  }

  if (partnersInfo && partnersInfo.loading) {
    tenantOptions = [{ name: 'Loading..', display_name: 'Loading..' }];
  }
  if (partnersInfo && partnersInfo.data) {
    tenantOptions = partnersInfo.data;
  }
  if (tenant_ids && tenant_ids.length && tenant_ids.length > 0) {
    const oldId = oldTenants;
    const newArr = [...tenantOptions, ...oldId];
    tenantOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  if (tenant_ids && tenant_ids.err) {
    tenantOptions = [];
  }

  if (equipmentInfo && equipmentInfo.loading) {
    equipmentOptions = [{ name: 'Loading..' }];
  }
  if (equipmentInfo && equipmentInfo.data) {
    equipmentOptions = equipmentInfo.data;
  }
  if (equipment_id && equipment_id.length && equipment_id.length > 0) {
    const oldEquipId = [{ id: equipment_id[0], name: equipment_id[1] }];
    const newArr = [...equipmentOptions, ...oldEquipId];
    equipmentOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  if (equipmentInfo && equipmentInfo.err) {
    equipmentOptions = [];
  }

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

  const onChangeOption = (field, data, reason) => {
    if (reason === 'clear' || (reason === 'remove-option' && data && data.length === 0)) {
      setFieldValue(field, []);
    } else {
      setFieldValue(field, data);
    }
  };

  function getRecurrentLabel(data) {
    if (customData && customData.repeatTypesText[data]) {
      return customData.repeatTypesText[data].label;
    }
    return '';
  }

  const surveyEpolicyOptions = extractOptionsObject(surveyEpolicy, escalation_policy_id);

  const isWeekly = recurrent_rule?.value === 'weekly' || getRecurrentLabel(recurrent_rule) === 'Weekly';

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          gap: '20px',
        }}
      >
        <Box sx={{
          width: '50%',
        }}
        >
          <MuiAutoComplete
            sx={{
              marginTop: 'auto',
              marginBottom: '25px',
            }}
            name={categoryType.name}
            isRequired={categoryType.required}
            placeholder="Enter Title"
            label={categoryType.label}
            open={typeOpen}
            value={category_type === 'ah' ? customData.types[1] : category_type === 'e' ? customData.types[0] : category_type}
            onOpen={() => {
              setTypeOpen(true);
            }}
            onClose={() => {
              setTypeOpen(false);
            }}
            defaultValue={customData.types[0]}
            getOptionSelected={(option, value) => option.label === value.label}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
            options={customData.types}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label={categoryType.label}
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
          {!is_show_all_spaces && typeValue === 'ah' && (
            <>
              <MuiAutoComplete
                sx={{
                  marginTop: 'auto',
                  marginBottom: '10px',
                }}
                name={spaceId.name}
                label={spaceId.label}
                open={spaceOpen}
                size="small"
                onOpen={() => {
                  setSpaceOpen(true);
                  setSpaceKeyword('');
                }}
                onClose={() => {
                  setSpaceOpen(false);
                  setSpaceKeyword('');
                }}
                oldValue={getOldData(location_id)}
                value={location_id && location_id.path_name ? location_id.path_name : getOldData(location_id)}
                loading={spaceInfoList && spaceInfoList.loading && !spaceOpen1}
                getOptionSelected={(option, value) => (value && value.length > 0 ? option.path_name === value.path_name : '')}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.path_name)}
                options={spaceOptions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    onChange={onSpaceKeywordChange}
                    variant="standard"
                    label={spaceId.label}
                    placeholder="Search & Select"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {spaceInfoList && spaceInfoList.loading && !spaceOpen1 ? <CircularProgress color="inherit" size={20} /> : null}
                          <InputAdornment position="end">
                            {((getOldData(location_id)) || (location_id && location_id.id) || (spacekeyword && spacekeyword.length > 0)) && (
                              <IconButton onClick={onSpaceClear}>
                                <IoCloseOutline size={22} fontSize="small" />
                              </IconButton>
                            )}
                            <IconButton onClick={onSpaceSearch1}>
                              <SearchIcon fontSize="small" />
                            </IconButton>
                          </InputAdornment>
                        </>
                      ),
                    }}
                  />
                )}
              />
              {(spaceInfoList && spaceInfoList.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(spaceInfoList)}</span></FormHelperText>)}
            </>
          )}
          {is_show_all_spaces && (
            <MuiAutoComplete
              name={spaceLevel.name}
              label={spaceLevel.label}
              className="bg-white"
              open={levelOpen}
              oldValue={space_level}
              value={space_level && space_level.label ? space_level.label : space_level}
              size="small"
              onOpen={() => {
                setLevelOpen(true);
              }}
              onClose={() => {
                setLevelOpen(false);
              }}
              getOptionSelected={(option, value) => option.label === value.label}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
              options={customData.levels}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label="Space Level"
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
          )}
          {!(surveyTenants && surveyTenants.loading) ? (
            <>
              <MuiAutoComplete
                multiple
                filterSelectedOptions
                limitTags={3}
                id="tags-filled"
                name="tenant_ids"
                label="Tenants"
                open={tenantOpen}
                value={tenant_ids && tenant_ids.length > 0 ? tenant_ids : []}
                size="small"
                onOpen={() => {
                  setTenantOpen(true);
                  // setTenantKeyword('');
                }}
                onClose={() => {
                  setTenantOpen(false);
                  // setTenantKeyword('');
                }}
                loading={(partnersInfo && partnersInfo.loading) && !tenantOpen}
                renderOption={(props, option) => (
                  <ListItemText
                    {...props}
                    primary={(
                      <Box>
                        <Typography
                          sx={{
                            font: 'Suisse Intl',
                            fontWeight: 500,
                            fontSize: '15px',
                          }}
                        >
                          {option.display_name || option.name}
                        </Typography>
                      </Box>
                    )}
                  />
                )}
                options={tenantOptions ? getArrayFromValuesById(tenantOptions, isAssociativeArray(tenant_ids || []), 'id') : []}
                getOptionLabel={(option) => (typeof option === 'string' ? option : (option.display_name || option.name))}
                onChange={(e, data, reason) => { onChangeOption('tenant_ids', data, reason); }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    label="Tenants"
                    value={tenantKeyword}
                    onChange={onTenantKeywordChange}
                    className={((getOldData(tenant_ids)) || (tenant_ids && tenant_ids.length > 0))
                      ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                    placeholder="Select"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {(partnersInfo && partnersInfo.loading) && !tenantOpen ? <CircularProgress color="inherit" size={20} /> : null}
                          <InputAdornment position="end">
                            {(tenant_ids && tenant_ids.length) || (tenantKeyword && tenantKeyword.length > 0) ? (
                              <IconButton
                                onClick={() => {
                                  setFieldValue('tenant_ids', []);
                                  setTenantKeyword('');
                                }}
                              >
                                <IoCloseOutline size={22} fontSize="small" />
                              </IconButton>
                            ) : ''}
                            <IconButton
                              onClick={onTenantSearch}
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
              {(partnersInfo && partnersInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(partnersInfo)}</span></FormHelperText>)}

            </>
          ) : (
            <Spinner size="sm" color="dark" className="mr-2" />
          )}
        </Box>
        <Box sx={{
          width: '50%',
        }}
        >
          {typeValue === 'ah'
            ? (
              <>
                <CheckboxField
                  className="ml-3 mt-4"
                  name={isAllSpaces.name}
                  label={isAllSpaces.label}
                />
                {!is_show_all_spaces && (
                  <>
                    {!(surveyLocations && surveyLocations.loading) ? (
                      <>
                        <MuiAutoComplete
                          multiple
                          filterSelectedOptions
                          limitTags={3}
                          id="tags-filled"
                          name="location_ids"
                          label="Locations"
                          open={spaceOpen1}
                          value={location_ids && location_ids.length > 0 ? location_ids : []}
                          size="small"
                          onOpen={() => {
                            setSpaceOpen1(true);
                            setSpaceKeyword1('');
                          }}
                          onClose={() => {
                            setSpaceOpen1(false);
                            setSpaceKeyword1('');
                          }}
                          loading={(spaceInfoList && spaceInfoList.loading) && !spaceOpen}
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
                                      {option.name || option.space_name}
                                    </Typography>
                                  </Box>
                                  {option.path_name && (
                                    <Box>
                                      <Typography
                                        sx={{
                                          font: 'Suisse Intl',
                                          fontSize: '12px',
                                        }}
                                      >
                                        {option.path_name}
                                      </Typography>
                                    </Box>
                                  )}
                                  {option.asset_category_id && (
                                    <Box>
                                      <Typography
                                        sx={{
                                          font: 'Suisse Intl',
                                          fontSize: '12px',
                                        }}
                                      >
                                        <span className="">
                                          {' '}
                                          {extractTextObject(option.asset_category_id)}
                                        </span>
                                      </Typography>
                                    </Box>
                                  )}
                                </>
                              )}
                            />
                          )}
                          options={spaceOptions ? getArrayFromValuesById(spaceOptions, isAssociativeArray(location_ids || []), 'id') : []}
                          getOptionLabel={(option) => (typeof option === 'string' ? option : option.path_name)}
                          onChange={(e, data, reason) => { onChangeOption('location_ids', data, reason); setFieldValue('equipment_id', ''); }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="standard"
                              label="Locations"
                              onChange={onSpaceKeywordChange1}
                              className={((getOldData(location_ids)) || (location_ids && location_ids.length > 0))
                                ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                              placeholder="Select"
                              InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                  <>
                                    {(spaceInfoList && spaceInfoList.loading) && !spaceOpen ? <CircularProgress color="inherit" size={20} /> : null}
                                    <InputAdornment position="end">
                                      {(location_ids && location_ids.length) || (spacekeyword1 && spacekeyword1.length > 0) ? (
                                        <IconButton
                                          onClick={() => {
                                            setFieldValue('location_ids', []);
                                          }}
                                        >
                                          <IoCloseOutline size={22} fontSize="small" />
                                        </IconButton>
                                      ) : ''}
                                      <IconButton
                                        onClick={onSpaceSearch}
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
                        {(spaceInfoList && spaceInfoList.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(spaceInfoList)}</span></FormHelperText>)}

                      </>
                    ) : (
                      <Spinner size="sm" color="dark" className="mr-2" />
                    )}
                  </>
                )}
              </>
            )
            : (
              <>
                {typeValue === 'e'
                  ? (
                    <MuiAutoComplete
                      sx={{
                        marginTop: 'auto',
                        marginBottom: '10px',
                      }}
                      name={equipmentCategoryId.name}
                      label={equipmentCategoryId.label}
                      open={equipmentOpen}
                      size="small"
                      oldValue={getOldData(equipment_id)}
                      value={equipment_id && equipment_id.name ? equipment_id.name : getOldData(equipment_id)}
                      onOpen={() => {
                        setEquipmentOpen(true);
                        setEquipmentkeyword('');
                      }}
                      onClose={() => {
                        setEquipmentOpen(false);
                        setEquipmentkeyword('');
                      }}
                      loading={equipmentInfo && equipmentInfo.loading}
                      getOptionSelected={(option, value) => (value && value.length > 0 ? option.name === value.name : '')}
                      getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                      options={equipmentOptions}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          onChange={onEquipmentKeywordChange}
                          variant="standard"
                          label={equipmentCategoryId.label}
                          placeholder="Search & Select"
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {equipmentInfo && equipmentInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                                <InputAdornment position="end">
                                  {((getOldData(equipment_id)) || (equipment_id && equipment_id.id) || (equipmentkeyword && equipmentkeyword.length > 0)) && (
                                    <IconButton onClick={onEquipmentClear}>
                                      <IoCloseOutline size={22} fontSize="small" />
                                    </IconButton>
                                  )}
                                  <IconButton onClick={onEquipemntSearch}>
                                    <SearchIcon fontSize="small" />
                                  </IconButton>
                                </InputAdornment>
                              </>
                            ),
                          }}
                        />
                      )}
                    />
                  ) : ''}
                {(equipmentInfo && equipmentInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(equipmentInfo)}</span></FormHelperText>)}
              </>
            )}
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          gap: '20px',
        }}
      >
        <Box
          sx={{
            width: '50%',
          }}
        >
          <Typography
            sx={AddThemeColor({
              font: 'normal normal medium 20px/24px Suisse Intl',
              letterSpacing: '0.7px',
              fontWeight: 500,
              marginBottom: '10px',
              marginTop: '10px',
              paddingBottom: '4px',
            })}
          >
            Configuration
          </Typography>
          <MuiCheckboxField
            name={verificationByOtp.name}
            label={verificationByOtp.label}
          />
          <br />
          <Label for={reviewerName.name} className="m-0">
            {reviewerName.label}
          </Label>
          <Box sx={{ display: 'flex' }}>
            <MuiFormLabel
              name={reviewerName.name}
              checkedvalue="Required"
              id="Required"
              label={reviewerName.label1}
            />
            <MuiFormLabel
              name={reviewerName.name}
              checkedvalue="Optional"
              id="Optional"
              label={reviewerName.label2}
            />
            <MuiFormLabel
              name={reviewerName.name}
              checkedvalue="None"
              id="None"
              label={reviewerName.label3}
            />
          </Box>
          <Label for={reviewerEmail.name} className="m-0">
            {reviewerEmail.label}
          </Label>
          <Box sx={{ display: 'flex' }}>
            <MuiFormLabel
              name={reviewerEmail.name}
              checkedvalue="Required"
              id="Required"
              label={reviewerEmail.label1}
            />
            <MuiFormLabel
              name={reviewerEmail.name}
              checkedvalue="Optional"
              id="Optional"
              label={reviewerEmail.label2}
            />
            <MuiFormLabel
              name={reviewerEmail.name}
              checkedvalue="None"
              id="None"
              label={reviewerEmail.label3}
            />
          </Box>
          <Label for={reviewerMobile.name} className="m-0">
            {reviewerMobile.label}
          </Label>
          <Box sx={{ display: 'flex' }}>
            <MuiFormLabel
              name={reviewerMobile.name}
              checkedvalue="Required"
              id="Required"
              label={reviewerMobile.label1}
            />
            <MuiFormLabel
              name={reviewerMobile.name}
              checkedvalue="Optional"
              id="Optional"
              label={reviewerMobile.label2}
            />
            <MuiFormLabel
              name={reviewerMobile.name}
              checkedvalue="None"
              id="None"
              label={reviewerMobile.label3}
            />
          </Box>
          <Label for={disclaimer.name} className="m-0">
            {disclaimer.label}
          </Label>
          <Box sx={{ display: 'flex' }}>
            <MuiFormLabel
              name={disclaimer.name}
              checkedvalue="Required"
              id="Required"
              label={disclaimer.label1}
            />
            <MuiFormLabel
              name={disclaimer.name}
              checkedvalue="Optional"
              id="Optional"
              label={disclaimer.label2}
            />
            <MuiFormLabel
              name={disclaimer.name}
              checkedvalue="None"
              id="None"
              label={disclaimer.label3}
            />
          </Box>
          <Label for={hasTenant.name} className="m-0">
            {hasTenant.label}
          </Label>
          <Box sx={{ display: 'flex' }}>
            <MuiFormLabel
              name={hasTenant.name}
              checkedvalue="Required"
              id="Required"
              label={hasTenant.label1}
            />
            <MuiFormLabel
              name={hasTenant.name}
              checkedvalue="Optional"
              id="Optional"
              label={hasTenant.label2}
            />
            <MuiFormLabel
              name={hasTenant.name}
              checkedvalue="None"
              id="None"
              label={hasTenant.label3}
            />
          </Box>
        </Box>
        <Box
          sx={{
            width: '50%',
          }}
        >
          <Typography
            sx={AddThemeColor({
              font: 'normal normal medium 20px/24px Suisse Intl',
              letterSpacing: '0.7px',
              fontWeight: 500,
              marginBottom: '10px',
              marginTop: '10px',
              paddingBottom: '4px',
            })}
          >
            Feedback
          </Typography>
          <MuiTextField
            name={feedbackText.name}
            label={feedbackText.label}
            type="text"
            sx={{
              marginTop: 'auto',
              marginBottom: '10px',
            }}
            maxLength="150"
          />
          <MuiTextField
            name={surveyTime.name}
            label={surveyTime.label}
            type="text"
            inputProps={{ maxLength: 10 }}
            sx={{
              marginTop: 'auto',
              marginBottom: '10px',
            }}
            onKeyPress={integerKeyPress}
          />
          <MuiTextField
            name={successfulHomepageReturnTime.name}
            label={successfulHomepageReturnTime.label}
            type="text"
            inputProps={{ maxLength: 3 }}
            sx={{
              marginTop: 'auto',
              marginBottom: '10px',
            }}
            onKeyPress={integerKeyPress}
          />
          {has_disclaimer === 'None' ? ''
            : (
              <MuiTextArea
                sx={{
                  marginTop: 'auto',
                  marginBottom: '10px',
                }}
                name={disclaimerText.name}
                label={disclaimerText.label}
                isRequired={disclaimerText.required}
                formGroupClassName="mb-1"
                multiline
                row="4"
              />
            )}

          <Typography
            sx={AddThemeColor({
              font: 'normal normal medium 20px/24px Suisse Intl',
              letterSpacing: '0.7px',
              fontWeight: 500,
              marginBottom: '10px',
              marginTop: '10px',
              paddingBottom: '4px',
            })}
          >
            Campaign
          </Typography>
          <MuiCheckboxField
            name={isSendEmail.name}
            label={isSendEmail.label}
          />
          <br />
          {is_send_email && (
            <>
              <MuiDateTimeField
                sx={{
                  marginTop: 'auto',
                  marginBottom: '10px',
                  width: '100%',
                }}
                name={startsOn.name}
                label={startsOn.label}
                isRequired
                formGroupClassName="m-1"
                setFieldValue={setFieldValue}
                setFieldTouched={setFieldTouched}
                placeholder={startsOn.label}
                formatValue="DD/MM/YYYY"
                type="date"
                disablePastDate
                value={starts_on ? dayjs(editId ? moment.utc(starts_on).local().tz(userInfo?.data?.timezone).format('YYYY-MM-DD') : starts_on) : null}
                // value={requested_on ? dayjs(new Date()) : null}
                localeText={{ todayButtonLabel: 'Now' }}
                slotProps={{
                  actionBar: {
                    actions: ['today', 'accept'],
                  },
                  textField: {
                    variant: 'standard', error: false,
                  },
                }}
              />
              <MuiCheckboxField
                name={isRepeats.name}
                label={isRepeats.label}
              />
              <Box
                sx={{
                  display: 'flex',
                  gap: '20px',
                  alignItems: 'center',
                }}
              >
                <Box sx={{
                  width: '50%',
                }}
                >
                  <MuiAutoComplete
                    sx={{
                      marginTop: 'auto',
                      marginBottom: '10px',
                    }}
                    name={recurrentRule.name}
                    isRequired={recurrentRule.required}
                    label={recurrentRule.label}
                    open={repeatOpen}
                    value={recurrent_rule && recurrent_rule.label ? recurrent_rule.label : getRecurrentLabel(recurrent_rule)}
                    onOpen={() => {
                      setRepeatOpen(true);
                    }}
                    onClose={() => {
                      setRepeatOpen(false);
                    }}
                    getOptionSelected={(option, value) => option.label === value.label}
                    getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                    options={customData.repeatTypes}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="standard"
                        label={recurrentRule.label}
                        required
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
                </Box>
                {(isWeekly) ? (
                  <Box
                    sx={{
                      width: '50%',
                      marginTop: '20px',
                    }}
                  >
                    <Typography
                      sx={{
                        font: 'normal normal medium 20px/24px Suisse Intl',
                        letterSpacing: '0.7px',
                        fontWeight: 500,
                        fontSize: '10px',
                        color: '#757575',
                      }}
                    >
                      Weekly
                    </Typography>
                    <Box
                      sx={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3%',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                      }}
                    >
                      <MuiCheckboxField
                        name={mo.name}
                        label={mo.label}
                      />
                      <MuiCheckboxField
                        name={tu.name}
                        label={tu.label}
                      />
                      <MuiCheckboxField
                        name={we.name}
                        label={we.label}
                      />
                      <MuiCheckboxField
                        name={th.name}
                        label={th.label}
                      />
                      <MuiCheckboxField
                        className="mr-1"
                        name={fr.name}
                        label={fr.label}
                      />
                      <MuiCheckboxField
                        className="mr-2"
                        name={sa.name}
                        label={sa.label}
                      />
                      <MuiCheckboxField
                        name={su.name}
                        label={su.label}
                      />
                    </Box>
                  </Box>
                )
                  : (
                    <Box sx={{
                      width: '50%',
                    }}
                    >
                      <MuiTextField
                        name={Day.name}
                        label={Day.label}
                        type="text"
                        required
                        inputProps={{ maxLength: 5 }}
                        sx={{
                          marginTop: 'auto',
                          marginBottom: '10px',
                        }}
                        onKeyPress={integerKeyPress}
                      />
                    </Box>
                  )}
              </Box>
              <MuiTextField
                name={deadLine.name}
                label={deadLine.label}
                type="text"
                required
                inputProps={{ maxLength: 5 }}
                sx={{
                  marginTop: 'auto',
                  marginBottom: '10px',
                }}
                onKeyPress={integerKeyPress}
              />
              {!(surveyTenants && surveyTenants.loading) ? (
                <>
                  <MuiAutoComplete
                    multiple
                    filterSelectedOptions
                    limitTags={3}
                    id="tags-filled"
                    name="recipients_ids"
                    label="Recipients"
                    open={rcOpen}
                    value={recipients_ids && recipients_ids.length > 0 ? recipients_ids : []}
                    size="small"
                    onOpen={() => {
                      setRcOpen(true);
                      // setTenantKeyword('');
                    }}
                    onClose={() => {
                      setRcOpen(false);
                      // setTenantKeyword('');
                    }}
                    loading={(partnersInfo && partnersInfo.loading)}
                    renderOption={(props, option) => (
                      <ListItemText
                        {...props}
                        primary={(
                          <Box>
                            <Typography
                              sx={{
                                font: 'Suisse Intl',
                                fontWeight: 500,
                                fontSize: '15px',
                              }}
                            >
                              {option.display_name || option.name}
                            </Typography>
                          </Box>
                        )}
                      />
                    )}
                    options={rcOptions ? getArrayFromValuesById(rcOptions, isAssociativeArray(recipients_ids || []), 'id') : []}
                    getOptionLabel={(option) => (typeof option === 'string' ? option : (option.display_name || option.name))}
                    onChange={(e, data, reason) => { onChangeOption('recipients_ids', data, reason); }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="standard"
                        label="Recipients"
                        value={rcKeyword}
                        onChange={onTenantKeywordChange}
                        className={((getOldData(recipients_ids)) || (recipients_ids && recipients_ids.length > 0))
                          ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                        placeholder="Select"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {(partnersInfo && partnersInfo.loading) && !rcOpen ? <CircularProgress color="inherit" size={20} /> : null}
                              <InputAdornment position="end">
                                {(recipients_ids && recipients_ids.length) || (rcKeyword && rcKeyword.length > 0) ? (
                                  <IconButton
                                    onClick={() => {
                                      setFieldValue('recipients_ids', []);
                                      setRcKeyword('');
                                    }}
                                  >
                                    <IoCloseOutline size={22} fontSize="small" />
                                  </IconButton>
                                ) : ''}
                                <IconButton
                                  onClick={onRPSearch}
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
                  {(partnersInfo && partnersInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(partnersInfo)}</span></FormHelperText>)}

                </>
              ) : (
                <Spinner size="sm" color="dark" className="mr-2" />
              )}
              <MuiAutoComplete
                sx={{
                  marginTop: 'auto',
                  marginBottom: '10px',
                }}
                name={escalationPolicyId.name}
                label={escalationPolicyId.label}
                open={ePolicyOpen}
                size="small"
                oldValue={getOldData(escalation_policy_id)}
                value={escalation_policy_id && escalation_policy_id.name ? escalation_policy_id.name : getOldData(escalation_policy_id)}
                onOpen={() => {
                  setEpolicyOpen(true);
                }}
                onClose={() => {
                  setEpolicyOpen(false);
                }}
                loading={surveyEpolicy && surveyEpolicy.loading}
                getOptionSelected={(option, value) => (value && value.length > 0 ? option.name === value.name : '')}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                options={surveyEpolicyOptions}
                apiError={(surveyEpolicy && surveyEpolicy.err) ? generateErrorMessage(surveyEpolicy) : false}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    label={escalationPolicyId.label}
                    placeholder="Search & Select"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {ePolicyOpen && surveyEpolicy && surveyEpolicy.loading ? <CircularProgress color="inherit" size={20} /> : null}
                          <InputAdornment position="end">
                            {((getOldData(escalation_policy_id)) || (escalation_policy_id && escalation_policy_id.id)) && (
                              <IconButton onClick={onEPolicyClear}>
                                <IoCloseOutline size={22} fontSize="small" />
                              </IconButton>
                            )}
                            <IconButton onClick={onEPSearch}>
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
                  marginBottom: '10px',
                }}
                name={campaignEmailId.name}
                label={campaignEmailId.label}
                open={cMailOpen}
                size="small"
                oldValue={getOldData(campaign_email_id)}
                value={campaign_email_id && campaign_email_id.name ? campaign_email_id.name : getOldData(campaign_email_id)}
                onOpen={() => {
                  setCmailOpen(true);
                }}
                onClose={() => {
                  setCmailOpen(false);
                }}
                loading={mailInfoList && mailInfoList.loading}
                getOptionSelected={(option, value) => (value && value.length > 0 ? option.name === value.name : '')}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                options={mailInfoList?.data || []}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    label={campaignEmailId.label}
                    placeholder="Search & Select"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {cMailOpen && mailInfoList && mailInfoList.loading ? <CircularProgress color="inherit" size={20} /> : null}
                          <InputAdornment position="end">
                            {((getOldData(campaign_email_id)) || (campaign_email_id && campaign_email_id.id)) && (
                              <IconButton onClick={onCmailClear}>
                                <IoCloseOutline size={22} fontSize="small" />
                              </IconButton>
                            )}
                            <IconButton onClick={onCMSearch}>
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
                  marginBottom: '10px',
                }}
                name={reminderEmailId.name}
                label={reminderEmailId.label}
                open={rMailOpen}
                size="small"
                oldValue={getOldData(reminder_email_id)}
                value={reminder_email_id && reminder_email_id.name ? reminder_email_id.name : getOldData(reminder_email_id)}
                onOpen={() => {
                  setRmailOpen(true);
                }}
                onClose={() => {
                  setRmailOpen(false);
                }}
                loading={mailInfoList && mailInfoList.loading}
                getOptionSelected={(option, value) => (value && value.length > 0 ? option.name === value.name : '')}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                options={mailInfoList?.data || []}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    label={reminderEmailId.label}
                    placeholder="Search & Select"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {rMailOpen && mailInfoList && mailInfoList.loading ? <CircularProgress color="inherit" size={20} /> : null}
                          <InputAdornment position="end">
                            {((getOldData(reminder_email_id)) || (reminder_email_id && reminder_email_id.id)) && (
                              <IconButton onClick={onRmailClear}>
                                <IoCloseOutline size={22} fontSize="small" />
                              </IconButton>
                            )}
                            <IconButton onClick={onRMSearch}>
                              <SearchIcon fontSize="small" />
                            </IconButton>
                          </InputAdornment>
                        </>
                      ),
                    }}
                  />
                )}
              />
              <MuiTextField
                name={answeredAlready.name}
                label={answeredAlready.label}
                type="text"
                sx={{
                  marginTop: 'auto',
                  marginBottom: '10px',
                }}
                maxLength="150"
              />
              <MuiTextField
                name={deadlineElapsed.name}
                label={deadlineElapsed.label}
                type="text"
                sx={{
                  marginTop: 'auto',
                  marginBottom: '10px',
                }}
                maxLength="150"
              />
            </>
          )}
        </Box>
      </Box>
      <Dialog size="lg" fullWidth open={extraModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraModal(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <SearchModalMultiple
              modelName={modelValue}
              afterReset={() => { setExtraModal(false); }}
              fieldName={fieldName}
              fields={columns}
              company={companyValue}
              modalName={modalName}
              otherFieldName={otherFieldName}
              otherFieldValue={otherFieldValue}
              setFieldValue={setFieldValue}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Dialog size="lg" fullWidth open={extraModal1}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraModal1(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <SearchModal
              modelName={modelValue}
              afterReset={() => { setExtraModal1(false); }}
              fieldName={fieldName}
              fields={columns}
              company={companyValue}
              modalName={modalName}
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
              noBuildings
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

AdditionalForm.propTypes = {
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

export default AdditionalForm;
