/* eslint-disable camelcase */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useFormikContext } from 'formik';
import { Box } from '@mui/system';
import {
  Typography, TextField, FormControl, Dialog, DialogContent, DialogContentText,
} from '@mui/material';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import { IoCloseOutline } from 'react-icons/io5';
import { CircularProgress } from '@material-ui/core';

import checkoutFormModel from '../formModel/checkoutFormModel';
import MuiAutoComplete from '../../commonComponents/formFields/muiAutocomplete';
import MuiTextField from '../../commonComponents/formFields/muiTextField';
import {
  getTicketNames,
  getPriorityList,
  getHelpdeskTeams,
  getHelpdeskVendors,
} from '../ticketService';
import ticketActionData from '../data/ticketsActions.json';
import {
  generateErrorMessage, generateArrayFromValue,
  extractValueObjects,
  getAllCompanies, extractOptionsObject, getTenentOptions,
} from '../../util/appUtils';
import DialogHeader from '../../commonComponents/dialogHeader';
import SearchModal from './searchModal';
import SearchModalCustom from './searchModalCustom';
import { getTicketPriorityText, getTicketChannelFormLabel, getIssueTypeLabel } from '../utils/utils';
import { AddThemeColor } from '../../themes/theme';

const appModels = require('../../util/appModels').default;

const { formField } = checkoutFormModel;

const TicketInfoForm = (props) => {
  const {
    setFieldValue,
    reloadSpace,
    editId,
    type,
    values,
  } = props;

  const { values: formValues } = useFormikContext();
  const {
    category_id, sub_category_id, parent_id, tenant_id,
    issue_type, channel, maintenance_team_id, type_category,
    equipment_id, asset_id, company_id, vendor_id, ticket_type,
  } = formValues;
  const dispatch = useDispatch();
  const [modeOpen, setModeOpen] = useState(false);
  const [refresh, setRefresh] = useState(reloadSpace);
  const [issueTypeOpen, setIssueTypeOpen] = useState(false);
  const [extraModal, setExtraModal] = useState(false);
  const [extraModalCustom, setExtraModalCustom] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [columns, setColumns] = useState(['id', 'name']);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [parentOpen, setParentOpen] = useState(false);
  const [parentKeyword, setParentKeyword] = useState('');
  const [teamOpen, setTeamOpen] = useState(false);
  const [teamKeyword, setTeamKeyword] = useState('');
  const [teamSet, setTeamSet] = useState('yes');
  const [vendorOpen, setVendorOpen] = useState(false);
  const [vendorKeyword, setVendorKeyword] = useState('');
  const [noData, setNoData] = useState(false);
  const [ticketTypeOpen, setTicketTypeOpen] = useState(false);

  const ticketTypes = [{ value: 'Proactive', label: 'Proactive' }, { value: 'Reactive', label: 'Reactive' }];

  const { userInfo } = useSelector((state) => state.user);

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

  const isAll = !!(window.localStorage.getItem('isAllCompany') && window.localStorage.getItem('isAllCompany') === 'yes');

  const companies = isAll && getCompanyId(company_id) ? [getCompanyId(company_id)] : getAllCompanies(userInfo);

  const {
    siteCategoriesInfo, ticketNames, vendorsCustmonList,
    priorityList, helpdeskTeams, maintenanceConfigurationData,
    tenantConfig,
  } = useSelector((state) => state.ticket);

  const configData = maintenanceConfigurationData && !maintenanceConfigurationData.loading && maintenanceConfigurationData.data
  && maintenanceConfigurationData.data.length && maintenanceConfigurationData.data[0];

  useEffect(() => {
    if (userInfo && userInfo.data && userInfo.data.associates_to && userInfo.data.associates_to === 'Tenant' && getTenentOptions(userInfo, tenantConfig, extractValueObjects(tenant_id))) {
      const tConfig = getTenentOptions(userInfo, tenantConfig, extractValueObjects(tenant_id));
      setFieldValue('has_channel', tConfig.channel_visible);
      setFieldValue('has_team', tConfig.maintenance_team_visible);
      setFieldValue('has_ticket_type', tConfig.ticket_type_visible);
      setFieldValue('has_tenant', tConfig.tenant_visible);
    } else if (configData) {
      setFieldValue('has_channel', configData.channel_visible);
      setFieldValue('has_team', configData.maintenance_team_visible);
      setFieldValue('has_ticket_type', configData.ticket_type_visible);
      setFieldValue('has_tenant', configData.tenant_visible);
    }
  }, [maintenanceConfigurationData, tenantConfig, tenant_id]);

  let channelShow = configData && configData.channel_visible !== 'None';
  let channelReq = configData && configData.channel_visible === 'Required';

  let teamShow = configData && configData.maintenance_team_visible !== 'None';
  let teamReq = configData && configData.maintenance_team_visible === 'Required';

  let ticketTypeShow = configData && configData.ticket_type_visible !== 'None';
  let ticketTypeReq = configData && configData.ticket_type_visible === 'Required';

  if (userInfo && userInfo.data && userInfo.data.associates_to && userInfo.data.associates_to === 'Tenant' && getTenentOptions(userInfo, tenantConfig, extractValueObjects(tenant_id))) {
    const tConfig = getTenentOptions(userInfo, tenantConfig, extractValueObjects(tenant_id));
    channelShow = tConfig && tConfig.channel_visible !== 'None';
    channelReq = tConfig && tConfig.channel_visible === 'Required';

    teamShow = tConfig && tConfig.maintenance_team_visible !== 'None';
    teamReq = tConfig && tConfig.maintenance_team_visible === 'Required';

    ticketTypeShow = tConfig && tConfig.ticket_type_visible !== 'None';
    ticketTypeReq = tConfig && tConfig.ticket_type_visible === 'Required';
  }

  const isIncident = !!(type && type === 'Incident');

  function getFieldData(obj) {
    let res = 'None';
    if (obj) {
      if (obj.id) {
        res = obj.id;
      } else if (obj.length) {
        res = obj[0];
      }
    }
    return res;
  }

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && parentOpen) {
        await dispatch(getTicketNames(companies, appModels.HELPDESK, parentKeyword, isIncident));
      }
    })();
  }, [userInfo, parentKeyword, parentOpen]);

  useEffect(() => {
    if (userInfo && userInfo.data && siteCategoriesInfo && siteCategoriesInfo.data && sub_category_id && sub_category_id.id && category_id && category_id.id) {
      const subData = generateArrayFromValue(siteCategoriesInfo.data, 'id', category_id.id);
      let loadedSubData = [];
      if (!type && type_category !== 'IT') {
        loadedSubData = subData && subData.length ? subData[0].sub_category_id : [];
      } else {
        loadedSubData = subData && subData.length ? subData[0].subcategory_ids : [];
      }
      const subCategoryData = generateArrayFromValue(loadedSubData, 'id', sub_category_id.id);
      if (subCategoryData && subCategoryData.length > 0) {
        dispatch(getPriorityList(companies, appModels.HELPDESKPRIORITY, getTicketPriorityText(subCategoryData[0].priority)));
      }
    }
  }, [userInfo, sub_category_id, category_id]);

  useEffect(() => {
    if (userInfo && userInfo.data && refresh === '1') {
      const eqId = getFieldData(equipment_id);
      const spId = getFieldData(asset_id);
      const cateId = getFieldData(category_id);
      const tc = type_category && type_category === 'asset' ? 'space' : type_category;
      if (cateId && cateId !== 'None') {
        dispatch(getHelpdeskTeams(tc, eqId, spId, cateId, ''));
      }
      /* if (cateId === 'None') {
                dispatch(getHelpdeskTeams(tc, eqId, spId, cateId, companies, appModels.TEAM, ''));
            } */
    }
  }, [userInfo, category_id]);

  useEffect(() => {
    if (userInfo && userInfo.data && refresh === '1' && teamOpen) {
      const eqId = getFieldData(equipment_id);
      const spId = getFieldData(asset_id);
      const cateId = getFieldData(category_id);
      const tc = type_category && type_category === 'asset' ? 'space' : type_category;
      if (cateId && cateId !== 'None' && teamSet === 'yes') {
        dispatch(getHelpdeskTeams(tc, eqId, spId, cateId, teamKeyword ? encodeURIComponent(teamKeyword.trim()) : ''));
      }
      if (cateId === 'None' || teamSet === 'no') {
        dispatch(getHelpdeskTeams(tc, eqId, spId, 'None', companies, appModels.TEAM, teamKeyword ? encodeURIComponent(teamKeyword.trim()) : ''));
      }
    }
  }, [teamOpen, teamKeyword, teamSet]);

  useEffect(() => {
    const cateId = getFieldData(category_id);
    const mTeam = getFieldData(maintenance_team_id);
    if (!editId && !teamOpen && teamSet === 'yes' && helpdeskTeams && helpdeskTeams.data && helpdeskTeams.data.length && cateId && cateId !== 'None' && refresh === '1' && mTeam === 'None') {
      setFieldValue('maintenance_team_id', helpdeskTeams.data[0]);
    }
  }, [category_id, helpdeskTeams]);

  useEffect(() => {
    if (userInfo && userInfo.data && priorityList && priorityList.data) {
      const prData = { id: priorityList && priorityList.data[0].id, name: priorityList && priorityList.data[0].name };
      setFieldValue('priority_id', prData);
    }
  }, [userInfo, priorityList]);

  useEffect(() => {
    setRefresh(refresh);
  }, [refresh]);

  useEffect(() => {
    if (category_id && category_id.id && refresh === '1') {
      if (type_category !== 'IT') {
        setFieldValue('sub_category_id', '');
      }
      setTeamSet('yes');
      setFieldValue('priority_id', '');
      setFieldValue('maintenance_team_id', '');
    }
  }, [category_id, refresh]);

  useEffect(() => {
    if (sub_category_id && sub_category_id.id && refresh === '1') {
      setFieldValue('priority_id', '');
      // setFieldValue('maintenance_team_id', '');
    }
  }, [sub_category_id, refresh]);

  const onParentKeywordChange = (event) => {
    setParentKeyword(event.target.value);
  };

  const showParentModal = () => {
    setModelValue(appModels.HELPDESK);
    setFieldName('parent_id');
    setModalName('Tickets');
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setColumns(['id', 'ticket_number', 'subject']);
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setExtraModal(true);
  };

  const onParentKeywordClear = () => {
    setParentKeyword(null);
    setFieldValue('parent_id', '');
    setParentOpen(false);
  };

  const onTeamKeywordChange = (event) => {
    setTeamKeyword(event.target.value);
  };

  const showSearchModal = () => {
    setModelValue(appModels.TEAM);
    setFieldName('maintenance_team_id');
    setModalName('Maintenance Teams');
    setOtherFieldName('team_category_id');
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraModal(true);
  };

  const onMaintenaceKeywordClear = () => {
    setTeamKeyword('');
    setTeamSet('no');
    setFieldValue('maintenance_team_id', '');
    setTeamOpen(false);
  };

  let parentOptions = [];
  let teamOptions = [];

  if (ticketNames && ticketNames.loading) {
    parentOptions = [{ subject: 'Loading..', ticket_number: 'Ticket Number' }];
  }
  if (parent_id && parent_id.length && parent_id.length > 0) {
    const oldId = [{ id: parent_id[0], subject: parent_id[1], ticket_number: parent_id[0] }];
    const newArr = [...parentOptions, ...oldId];
    parentOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  if (ticketNames && ticketNames.data) {
    const arr = [...parentOptions, ...ticketNames.data];
    parentOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }
  if (ticketNames && ticketNames.err) {
    parentOptions = [];
  }

  if (helpdeskTeams && helpdeskTeams.loading) {
    teamOptions = [{ name: 'Loading..' }];
  }

  if (maintenance_team_id && maintenance_team_id.length && maintenance_team_id.length > 0) {
    const oldId = [{ id: maintenance_team_id[0], name: maintenance_team_id[1] }];
    const newArr = [...teamOptions, ...oldId];
    teamOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }

  if (helpdeskTeams && helpdeskTeams.data) {
    const arr = [...teamOptions, ...helpdeskTeams.data];
    teamOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }

  if (helpdeskTeams && helpdeskTeams.err) {
    teamOptions = [];
  }

  useEffect(() => {
    if (!editId && ticketActionData && ticketActionData.modes && ticketActionData.modes.length && refresh === '1') {
      setFieldValue('channel', ticketActionData.modes.find((data) => data.value === 'web'));
    }
  }, [refresh]);

  useEffect(() => {
    if (!editId && ticketActionData && ticketActionData.issueTypes && ticketActionData.issueTypes.length && refresh === '1') {
      setFieldValue('issue_type', ticketActionData.issueTypes.find((data) => data.value === 'request'));
    }
  }, [refresh]);

  useEffect(() => {
    if (!editId && ticketActionData && ticketActionData.issueTypes && ticketActionData.issueTypes.length) {
      setFieldValue('issue_type', ticketActionData.issueTypes.find((data) => data.value === 'request'));
    }
  }, []);

  let vendorOptions = extractOptionsObject(vendorsCustmonList, vendor_id);

  useEffect(() => {
    if (userInfo && userInfo.data && userInfo.data.company && vendorKeyword && (vendorKeyword && vendorKeyword.length > 3)) {
      if (vendorsCustmonList && vendorsCustmonList.data && vendorsCustmonList.data.length
                && vendorsCustmonList.data.length > 0 && vendorsCustmonList.data.some((selectedValue) => selectedValue.name.toLowerCase().includes(vendorKeyword.toLowerCase())
                    || selectedValue.name.toLowerCase().includes(vendorKeyword.toUpperCase()))) {
        setNoData(false);
      } else {
        setNoData(true);
        setVendorOpen(false);
      }
    }
  }, [vendorKeyword]);

  useEffect(() => {
    if (((userInfo && userInfo.data) && (noData) && (vendorKeyword && vendorKeyword.length > 3))) {
      vendorOptions = [{ id: -77, name: vendorKeyword }];
      setVendorOpen(false);
      setFieldValue('vendor_id', { id: -77, name: vendorKeyword });
    }
  }, [userInfo, vendorKeyword, vendorsCustmonList]);

  const onVendorKeywordChange = (event) => {
    setVendorKeyword(event.target.value);
  };

  useEffect(() => {
    if (userInfo && userInfo.data && userInfo.data.company && vendorOpen) {
      dispatch(getHelpdeskVendors(isAll ? getCompanyId(company_id) : userInfo.data.company.id));
    }
  }, [vendorOpen, vendorKeyword]);

  const oldParentId = parent_id && parent_id.length && parent_id.length > 0 ? parent_id[1] : '';
  const oldIt = issue_type || '';
  const oldChannel = channel || '';
  // const oldPriorityId = priority_id && priority_id.length && priority_id.length > 0 ? priority_id[1] : '';
  const oldTeamId = maintenance_team_id && maintenance_team_id.length && maintenance_team_id.length > 0 ? maintenance_team_id[1] : '';
  const isVendorShow = maintenanceConfigurationData && !maintenanceConfigurationData.loading && maintenanceConfigurationData.data
        && maintenanceConfigurationData.data.length && maintenanceConfigurationData.data[0].is_vendor_field === 'Yes';
  const isConstraintsShow = maintenanceConfigurationData && !maintenanceConfigurationData.loading && maintenanceConfigurationData.data
        && maintenanceConfigurationData.data.length && maintenanceConfigurationData.data[0].is_constraints;
  const isCostShow = maintenanceConfigurationData && !maintenanceConfigurationData.loading && maintenanceConfigurationData.data
        && maintenanceConfigurationData.data.length && maintenanceConfigurationData.data[0].is_cost;

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

  const onVendorClear = () => {
    setVendorKeyword('');
    setFieldValue('vendor_id', '');
    setVendorOpen(false);
  };

  const showVendorModal = () => {
    dispatch(getHelpdeskVendors(isAll ? getCompanyId(company_id) : userInfo.data.company.id));
    setModelValue('');
    setFieldName('vendor_id');
    setModalName('Vendor List');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraModalCustom(true);
  };

  const onTypeClear = () => {
    setFieldValue('ticket_type', '');
    setTicketTypeOpen(false);
  };

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
        Ticket Information
      </Typography>
      {channelShow && (
      <MuiAutoComplete
        sx={{
          marginTop: 'auto',
          marginBottom: '10px',
        }}
        name={formField.Channel.name}
        label={formField.Channel.label}
        open={modeOpen}
        isRequired={channelReq}
        required={channelReq}
        oldvalue={getTicketChannelFormLabel(oldChannel)}
        value={channel && channel.label ? channel.label : getTicketChannelFormLabel(oldChannel)}
        size="small"
        onOpen={() => {
          setModeOpen(true);
        }}
        onClose={() => {
          setModeOpen(false);
        }}
        getOptionSelected={(option, value) => option.label === value.label}
        getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
        options={ticketActionData.modes}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            label={(
              <>
                <span className="font-family-tab">{formField.Channel.label}</span>
                {' '}
                <span className="text-danger text-bold">{channelReq ? '*' : ''}</span>
              </>
            )}
          />
        )}
      />
      )}
      <MuiAutoComplete
        sx={{
          marginTop: 'auto',
          marginBottom: '10px',
        }}
        name={formField.issueType.name}
        label={formField.issueType.label}
        isRequired
        open={issueTypeOpen}
        oldvalue={getIssueTypeLabel(oldIt)}
        value={issue_type && issue_type.label ? issue_type.label : getIssueTypeLabel(oldIt)}
        disabled={isIncident}
        onOpen={() => {
          setIssueTypeOpen(true);
        }}
        onClose={() => {
          setIssueTypeOpen(false);
        }}
        getOptionSelected={(option, value) => option.label === value.label}
        getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
        options={ticketActionData.issueTypes}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            label={(
              <>
                <span className="font-family-tab">{formField.issueType.label}</span>
                {' '}
                <span className="text-danger text-bold">*</span>
              </>
            )}
          />
        )}
      />
      {teamShow && (
      <MuiAutoComplete
        sx={{
          marginTop: 'auto',
          marginBottom: '10px',
        }}
        name={formField.maintenanceTeamId.name}
        label={formField.maintenanceTeamId.label}
        open={teamOpen}
        oldValue={oldTeamId}
        isRequired={teamReq}
        value={maintenance_team_id && maintenance_team_id.name ? maintenance_team_id.name : oldTeamId}
        onOpen={() => {
          setTeamOpen(true);
          setTeamKeyword('');
        }}
        onClose={() => {
          setTeamOpen(false);
          setTeamKeyword('');
        }}
        apiError={(helpdeskTeams && helpdeskTeams.err) ? generateErrorMessage(helpdeskTeams) : false}
        loading={helpdeskTeams && helpdeskTeams.loading}
        getOptionSelected={(option, value) => option.name === value.name}
        getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
        options={teamOptions}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            className="without-padding custom-icons"
            onChange={onTeamKeywordChange}
            label={(
              <>
                <span className="font-family-tab">{formField.maintenanceTeamId.label}</span>
                {' '}
                <span className="text-danger text-bold">{teamReq ? '*' : ''}</span>
              </>
            )}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {helpdeskTeams && helpdeskTeams.loading ? <CircularProgress color="inherit" size={20} /> : null}
                  <InputAdornment position="end">
                    {((oldTeamId) || (maintenance_team_id && maintenance_team_id.id) || (teamKeyword && teamKeyword.length > 0)) && (
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={onMaintenaceKeywordClear}
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
      )}
      <MuiAutoComplete
        sx={{
          marginTop: 'auto',
          marginBottom: '10px',
        }}
        name={formField.parentId.name}
        label={formField.parentId.label}
        open={parentOpen}
        oldvalue={oldParentId}
        value={parent_id && parent_id.ticket_number ? `${parent_id.ticket_number} - ${parent_id.subject}` : oldParentId}
        onOpen={() => {
          setParentOpen(true);
          setParentKeyword('');
        }}
        onClose={() => {
          setParentOpen(false);
          setParentKeyword('');
        }}
        apiError={(ticketNames && ticketNames.err) ? generateErrorMessage(ticketNames) : false}
        loading={ticketNames && ticketNames.loading}
        getOptionSelected={(option, value) => option.id === value.id}
        getOptionLabel={(option) => (typeof option === 'string' ? option : `${option.ticket_number} - ${option.subject}`)}
        options={parentOptions}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            className="without-padding custom-icons"
            label={formField.parentId.label}
            onChange={onParentKeywordChange}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {ticketNames && ticketNames.loading ? <CircularProgress color="inherit" size={20} /> : null}
                  <InputAdornment position="end">
                    {((oldParentId) || (parent_id && parent_id.id) || (parentKeyword && parentKeyword.length > 0)) && (
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={onParentKeywordClear}
                    >
                      <IoCloseOutline size={22} fontSize="small" />
                    </IconButton>
                    )}
                    <IconButton
                      aria-label="toggle search visibility"
                      onClick={showParentModal}
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
      {ticketTypeShow && (
      <MuiAutoComplete
        sx={{
          marginTop: 'auto',
          marginBottom: '10px',
        }}
        name={formField.ticketType.name}
        label={formField.ticketType.label}
        open={ticketTypeOpen}
        isRequired={ticketTypeReq}
        value={ticket_type && ticket_type.label ? ticket_type.label : ticket_type}
        size="small"
        onOpen={() => {
          setTicketTypeOpen(true);
        }}
        onClose={() => {
          setTicketTypeOpen(false);
        }}
        getOptionSelected={(option, value) => option.label === value.label}
        getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
        options={ticketTypes}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            className="without-padding custom-icons"
            label={(
              <>
                <span className="font-family-tab">{formField.ticketType.label}</span>
                {' '}
                <span className="text-danger text-bold">{ticketTypeReq ? '*' : ''}</span>
              </>
            )}
            placeholder="Search"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <InputAdornment position="end">
                  {(ticket_type || (ticket_type && ticket_type.label)) && (
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={onTypeClear}
                  >
                    <IoCloseOutline size={22} fontSize="small" />
                  </IconButton>
                  )}
                </InputAdornment>
              ),
            }}
          />
        )}
      />
      )}
      {isVendorShow && !isIncident ? (
        <MuiAutoComplete
          sx={{
            marginTop: 'auto',
            marginBottom: '10px',
          }}
          name={formField.vendorId.name}
          label={formField.vendorId.label}
          oldValue={getOldData(vendor_id)}
          value={vendor_id && vendor_id.name ? vendor_id.name : getOldData(vendor_id)}
          open={vendorOpen}
          onOpen={() => {
            setVendorOpen(true);
            setVendorKeyword('');
          }}
          onClose={() => {
            setVendorOpen(false);
            setVendorKeyword('');
          }}
          apiError={(vendorsCustmonList && vendorsCustmonList.err) ? generateErrorMessage(vendorsCustmonList) : false}
          getOptionDisabled={() => vendorsCustmonList && vendorsCustmonList.loading}
          getOptionSelected={(option, value) => option.name === value.name}
          getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
          options={vendorOptions}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              className="without-padding custom-icons"
              onChange={onVendorKeywordChange}
              value={vendorKeyword}
              label={formField.vendorId.label}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {vendorsCustmonList && vendorsCustmonList.loading && vendorOpen ? <CircularProgress color="inherit" size={20} /> : null}
                    <InputAdornment position="end">
                      {(getOldData(vendor_id) || (vendor_id && vendor_id.id) || (vendorKeyword && vendorKeyword.length > 0)) && (

                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={onVendorClear}
                        >
                          <IoCloseOutline size={22} fontSize="small" />
                        </IconButton>
                      )}
                      <IconButton
                        aria-label="toggle search visibility"
                        onClick={showVendorModal}
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
      ) : ''}
      {isConstraintsShow && !isIncident ? (
        <MuiTextField
          sx={{
            marginTop: 'auto',
            marginBottom: '10px',
          }}
          fullWidth
          name={formField.Constraints.name}
          label={formField.Constraints.label}
          setFieldValue={setFieldValue}
          variant="standard"
          value={values[formField.Constraints.name]}
        />
      ) : ''}
      {isCostShow && !isIncident ? (
        <MuiTextField
          sx={{
            marginTop: 'auto',
            marginBottom: '10px',
          }}
          fullWidth
          name={formField.Cost.name}
          label={formField.Cost.label}
          setFieldValue={setFieldValue}
          variant="standard"
          type="number"
          value={values[formField.Cost.name]}
        />
      ) : ''}
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
              isIncident={isIncident}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Dialog size="xl" fullWidth open={extraModalCustom}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraModalCustom(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <SearchModalCustom
              modelName={modelValue}
              afterReset={() => { setExtraModalCustom(false); }}
              fieldName={fieldName}
              fields={columns}
              company={companyValue}
              otherFieldName={otherFieldName}
              otherFieldValue={otherFieldValue}
              modalName={modalName}
              setFieldValue={setFieldValue}
              customDataInfo={fieldName === 'vendor_id' ? vendorsCustmonList : ''}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </Box>
  );
};
export default TicketInfoForm;
