/* eslint-disable prefer-destructuring */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable camelcase */
import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { useFormikContext } from 'formik';
import { TextField, CircularProgress, FormHelperText } from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';
import {
  Row, Col,
  Modal,
  ModalBody,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';
import { ThemeProvider, makeStyles } from '@material-ui/core/styles';

import envelopeIcon from '@images/icons/envelope.svg';

import ModalHeaderComponent from '@shared/modalHeaderComponent';
import { InputField, FormikAutocomplete } from '@shared/formFields';
import {
  getNumberToCommas,
} from '../../util/staticFunctions';

import {
  getTicketNames,
  getPriorityList,
  getHelpdeskTeams,
  getHelpdeskVendors,
} from '../ticketService';
import {
  resetCreateTenant,
} from '../../adminSetup/setupService';
import ticketActionData from '../data/ticketsActions.json';
import theme from '../../util/materialTheme';
import {
  generateErrorMessage, generateArrayFromValue,
  getAllCompanies, extractOptionsObject,
} from '../../util/appUtils';
import SearchModal from './searchModal';
import SearchModalCustom from './searchModalCustom';
import { getTicketPriorityText, getTicketChannelFormLabel, getIssueTypeLabel } from '../utils/utils';
import AddVendor from '../../adminSetup/siteConfiguration/addTenant/addCustomer';

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

const TicketForm = React.memo((props) => {
  const {
    setFieldValue,
    reloadSpace,
    editId,
    type,
    isFITTracker,
    formField: {
      Channel,
      issueType,
      maintenanceTeamId,
      parentId,
      vendorId,
      Cost,
      Constraints,
      ticketType,
    },
  } = props;

  const { values: formValues } = useFormikContext();
  const {
    category_id, sub_category_id, parent_id,
    issue_type, channel, maintenance_team_id, type_category,
    equipment_id, asset_id, ticket_type, company_id, vendor_id, cost, constraints,
  } = formValues;

  const dispatch = useDispatch();
  const classes = useStyles();

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

  const [addVendorModal, setAddVendorModal] = useState(false);
  const [noData, setNoData] = useState(false);

  const [ticketTypeOpen, setTicketTypeOpen] = useState(false);

  const { userInfo, userRoles } = useSelector((state) => state.user);

  const ticketTypes = [{ value: 'Proactive', label: 'Proactive' }, { value: 'Reactive', label: 'Reactive' }];

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

  const companies = getAllCompanies(userInfo, userRoles);

  const {
    siteCategoriesInfo, ticketNames,
    priorityList, helpdeskTeams, vendorsCustmonList,
    maintenanceConfigurationData,
  } = useSelector((state) => state.ticket);

  const {
    createTenantinfo,
  } = useSelector((state) => state.setup);

  function getCurrentCompanyId(forTeams) {
    let res = false;
    if (company_id && company_id.id) {
      if (company_id.category && company_id.category.id && company_id.category.name === 'Company' && !forTeams) {
        res = companies;
      } else {
        res = company_id.id;
      }
    } else if (company_id && company_id.length) {
      res = company_id[0];
    }
    return res;
  }

  const isVendorShow = maintenanceConfigurationData && !maintenanceConfigurationData.loading && maintenanceConfigurationData.data
    && maintenanceConfigurationData.data.length > 0 && maintenanceConfigurationData.data[0].is_vendor_field === 'Yes';
  const isConstraintsShow = maintenanceConfigurationData && !maintenanceConfigurationData.loading && maintenanceConfigurationData.data
    && maintenanceConfigurationData.data.length > 0 && maintenanceConfigurationData.data[0].is_constraints;
  const isCostShow = maintenanceConfigurationData && !maintenanceConfigurationData.loading && maintenanceConfigurationData.data
    && maintenanceConfigurationData.data.length > 0 && maintenanceConfigurationData.data[0].is_cost;

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

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && parentOpen) {
        await dispatch(getTicketNames(getCurrentCompanyId(), appModels.HELPDESK, parentKeyword, isIncident));
      }
    })();
  }, [userInfo, parentKeyword, parentOpen]);

  useEffect(() => {
    if (userInfo && userInfo.data && userInfo.data.company && vendorOpen) {
      dispatch(getHelpdeskVendors(isAll ? getCompanyId(company_id) : userInfo.data.company.id));
    }
  }, [vendorOpen]);

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

  useMemo(() => {
    if (userInfo && userInfo.data && refresh === '1') {
      const eqId = getFieldData(equipment_id);
      const spId = getFieldData(asset_id);
      const cateId = getFieldData(category_id);
      const tc = type_category && type_category === 'asset' ? 'space' : type_category;
      if (cateId && cateId !== 'None') {
        dispatch(getHelpdeskTeams(tc, eqId, spId, cateId, getCurrentCompanyId(true) ? getCurrentCompanyId(true) : userInfo.data.company.id, appModels.TEAM, ''));
      }
      /* if (cateId === 'None') {
        dispatch(getHelpdeskTeams(tc, eqId, spId, 'None', getCurrentCompanyId(true) ? getCurrentCompanyId(true) : userInfo.data.company.id, appModels.TEAM, ''));
      } */
    }
  }, [category_id]);

  useEffect(() => {
    if (userInfo && userInfo.data && refresh === '1' && teamOpen) {
      const eqId = getFieldData(equipment_id);
      const spId = getFieldData(asset_id);
      const cateId = getFieldData(category_id);
      const tc = type_category && type_category === 'asset' ? 'space' : type_category;
      if (cateId && cateId !== 'None' && teamSet === 'yes') {
        dispatch(getHelpdeskTeams(tc, eqId, spId, cateId, getCurrentCompanyId(true), appModels.TEAM, teamKeyword ? encodeURIComponent(teamKeyword.trim()) : ''));
      }
      if (cateId === 'None' || teamSet === 'no') {
        dispatch(getHelpdeskTeams(tc, eqId, spId, 'None', getCurrentCompanyId(true), appModels.TEAM, teamKeyword ? encodeURIComponent(teamKeyword.trim()) : ''));
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
    setCompanyValue(userInfo && userInfo.data ? getCurrentCompanyId() : '');
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
    setCompanyValue(userInfo && userInfo.data ? getCurrentCompanyId() : '');
    setExtraModal(true);
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

  const onMaintenaceKeywordClear = () => {
    setTeamKeyword('');
    setTeamSet('no');
    setFieldValue('maintenance_team_id', '');
    setTeamOpen(false);
  };

  const onVendorClear = () => {
    setVendorKeyword('');
    setFieldValue('vendor_id', '');
    setVendorOpen(false);
  };

  const onVendorKeywordChange = (event) => {
    setVendorKeyword(event.target.value);
  };

  const onChannelClear = () => {
    setFieldValue('channel', '');
    setModeOpen(false);
  };

  const onRequestClear = () => {
    setFieldValue('issue_type', '');
    setIssueTypeOpen(false);
  };

  const onTypeClear = () => {
    setFieldValue('ticket_type', '');
    setTicketTypeOpen(false);
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
    if (ticketActionData && ticketActionData.modes && ticketActionData.modes.length && refresh === '1') {
      setFieldValue('channel', ticketActionData.modes.find((data) => data.value === 'web'));
    }
  }, [refresh]);

  useEffect(() => {
    if (ticketActionData && ticketActionData.issueTypes && ticketActionData.issueTypes.length && refresh === '1') {
      setFieldValue('issue_type', ticketActionData.issueTypes.find((data) => data.value === 'request'));
    }
  }, [refresh]);

  useEffect(() => {
    if (ticketActionData && ticketActionData.issueTypes && ticketActionData.issueTypes.length) {
      setFieldValue('issue_type', ticketActionData.issueTypes.find((data) => data.value === 'request'));
    }
  }, []);

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

  const onChange = (data) => {
    setFieldValue('constraints', data.target.value);
  };

  const oldParentId = parent_id && parent_id.length && parent_id.length > 0 ? parent_id[1] : '';
  const oldIt = issue_type || '';
  const oldChannel = channel || '';
  // const oldPriorityId = priority_id && priority_id.length && priority_id.length > 0 ? priority_id[1] : '';
  const oldTeamId = maintenance_team_id && maintenance_team_id.length && maintenance_team_id.length > 0 ? maintenance_team_id[1] : '';

  return (
    <>
      <span className="d-inline-block pb-1 font-17 mb-2 font-weight-800">Ticket Information</span>
      <ThemeProvider theme={theme}>
        <Row className="mb-3 TicketForm-inputs">
          <Col xs={12} sm={12} md={!isIncident && !isFITTracker ? 6 : 12} lg={!isIncident && !isFITTracker ? 6 : 12}>
            <FormikAutocomplete
              name={Channel.name}
              label={Channel.label}
              labelClassName="mb-1"
              formGroupClassName="mb-1 w-100"
              open={modeOpen}
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
                  variant="outlined"
                  className="input-small-custom without-padding custom-icons"
                  placeholder="Search"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        <InputAdornment position="end">
                          {(getTicketChannelFormLabel(oldChannel) || (channel && channel.label)) && (
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={onChannelClear}
                            >
                              <BackspaceIcon fontSize="small" />
                            </IconButton>
                          )}
                        </InputAdornment>
                      </>
                    ),
                  }}
                />
              )}
            />
          </Col>
          {!isIncident && !isFITTracker && (
            <Col xs={12} sm={12} md={6} lg={6}>
              <FormikAutocomplete
                name={ticketType.name}
                label={ticketType.label}
                labelClassName="mb-1"
                formGroupClassName="mb-1 w-100"
                open={ticketTypeOpen}
                oldvalue={ticket_type}
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
                    variant="outlined"
                    className="input-small-custom without-padding custom-icons"
                    placeholder="Search"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          <InputAdornment position="end">
                            {(ticket_type || (ticket_type && ticket_type.label)) && (
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={onTypeClear}
                              >
                                <BackspaceIcon fontSize="small" />
                              </IconButton>
                            )}
                          </InputAdornment>
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Col>
          )}
          {!isIncident && (
            <Col xs={12} sm={12} md={12} lg={12}>
              <FormikAutocomplete
                name={issueType.name}
                label={issueType.label}
                labelClassName="mb-1"
                formGroupClassName="mb-1 w-100"
                isRequired
                open={issueTypeOpen}
                oldvalue={getIssueTypeLabel(oldIt)}
                value={issue_type && issue_type.label ? issue_type.label : getIssueTypeLabel(oldIt)}
                disabled={isIncident}
                size="small"
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
                    variant="outlined"
                    className="input-small-custom without-padding custom-icons"
                    placeholder="Search"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          <InputAdornment position="end">
                            {(getIssueTypeLabel(oldIt) || (issue_type && issue_type.label)) && (
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={onRequestClear}
                              >
                                <BackspaceIcon fontSize="small" />
                              </IconButton>
                            )}
                          </InputAdornment>
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Col>
          )}
          <Col xs={12} sm={12} md={12} lg={12}>
            <FormikAutocomplete
              name={maintenanceTeamId.name}
              label={maintenanceTeamId.label}
              labelClassName="mb-1"
              formGroupClassName="mb-1 w-100"
              open={teamOpen}
              oldValue={oldTeamId}
              value={maintenance_team_id && maintenance_team_id.name ? maintenance_team_id.name : oldTeamId}
              size="small"
              onOpen={() => {
                setTeamOpen(true);
                setTeamKeyword('');
              }}
              onClose={() => {
                setTeamOpen(false);
                setTeamKeyword('');
              }}
              loading={helpdeskTeams && helpdeskTeams.loading}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={teamOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={onTeamKeywordChange}
                  variant="outlined"
                  value={teamKeyword}
                  className={((oldTeamId) || (maintenance_team_id && maintenance_team_id.id) || (teamKeyword && teamKeyword.length > 0))
                    ? 'input-small-custom without-padding custom-icons' : 'input-small-custom without-padding custom-icons2'}
                  placeholder="Search & Select"
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
                              <BackspaceIcon fontSize="small" />
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
            {(helpdeskTeams && helpdeskTeams.err && teamOpen) && (<FormHelperText><span className="text-danger">{generateErrorMessage(helpdeskTeams)}</span></FormHelperText>)}
          </Col>
          <Col xs={12} sm={12} md={12} lg={12}>
            <FormikAutocomplete
              name={parentId.name}
              label={parentId.label}
              labelClassName="mb-1"
              formGroupClassName="mb-1 w-100"
              open={parentOpen}
              size="small"
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
              getOptionSelected={(option, value) => option.id === value.id}
              getOptionLabel={(option) => (typeof option === 'string' ? option : `${option.ticket_number} - ${option.subject}`)}
              options={parentOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={onParentKeywordChange}
                  variant="outlined"
                  value={parentKeyword}
                  className={((oldParentId) || (parent_id && parent_id.id) || (parentKeyword && parentKeyword.length > 0))
                    ? 'input-small-custom without-padding custom-icons' : 'input-small-custom without-padding custom-icons2'}
                  placeholder="Search & Select"
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
                              <BackspaceIcon fontSize="small" />
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
            {(ticketNames && ticketNames.err && parentOpen) && (<FormHelperText><span className="text-danger">{generateErrorMessage(ticketNames)}</span></FormHelperText>)}
          </Col>

          {isVendorShow && !isIncident && (
            <Col xs={12} sm={12} lg={12} md={12}>
              <FormikAutocomplete
                name={vendorId.name}
                label={vendorId.label}
                labelClassName="mb-1"
                formGroupClassName="mb-1 w-100"
                oldValue={getOldData(vendor_id)}
                value={vendor_id && vendor_id.name ? vendor_id.name : getOldData(vendor_id)}
                apiError={(vendorsCustmonList && vendorsCustmonList.err) ? generateErrorMessage(vendorsCustmonList) : false}
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
                getOptionDisabled={() => vendorsCustmonList && vendorsCustmonList.loading}
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
                  </>
                )}
                options={vendorOptions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    onChange={onVendorKeywordChange}
                    value={vendorKeyword}
                    className={((getOldData(vendor_id)) || (vendor_id && vendor_id.id) || (vendorKeyword && vendorKeyword.length > 0))
                      ? 'input-small-custom without-padding custom-icons' : 'input-small-custom without-padding custom-icons2'}
                    placeholder="Select"
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
                                <BackspaceIcon fontSize="small" />
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
              {((createTenantinfo && createTenantinfo.err) && !(vendor_id)) && (
                <FormHelperText><span className="text-danger">{generateErrorMessage(createTenantinfo)}</span></FormHelperText>
              )}
              {(noData && (vendorKeyword && vendorKeyword.length > 3)
                && (createTenantinfo && !createTenantinfo.err) && (createTenantinfo && !createTenantinfo.data)) && (
                  <FormHelperText>
                    <span>{`New Vendor "${vendorKeyword}" will be created. Do you want to create..? Click`}</span>
                    <span aria-hidden="true" onClick={() => setAddVendorModal(true)} className="text-info ml-2 cursor-pointer">YES</span>
                  </FormHelperText>
                )}
            </Col>
          )}
          {isConstraintsShow && !isIncident && (
            <Col xs={12} sm={12} md={12} lg={12}>
              <FormGroup className="mb-1">
                <>
                  <Label for={Constraints.name} className="mb-0">
                    {Constraints.label}
                  </Label>
                  <Input
                    name={Constraints.name}
                    label={Constraints.label}
                    value={constraints}
                    onChange={onChange}
                    onBlur={onChange}
                    type="textarea"
                    rows="4"
                  />
                </>
              </FormGroup>
            </Col>
          )}
          {isCostShow && !isIncident && (
            <Col md="12" sm="12" lg="12" xs="12">
              <InputField
                name={Cost.name}
                label={Cost.label}
                labelClassName="mb-0"
                value={getNumberToCommas(cost)}
                type="text"
                maxLength="12"
              />
            </Col>
          )}

          { /* <Col xs={12} sm={12} md={12} lg={12}>
            <FormGroup className="mb-1">
              <Label className="mb-1" for={priority.name}>
                {priority.label}
              </Label>
              <Input
                type="input"
                name={priority.name}
                oldvalue={oldPriorityId}
                value={priority_id && priority_id.name ? priority_id.name : oldPriorityId}
                className="bg-input-blue-small-disabled"
                disabled
              />
            </FormGroup>
                </Col> */ }
        </Row>
        <Modal size="xl" className="border-radius-50px modal-dialog-centered searchData-modalwindow" isOpen={extraModal}>
          <ModalHeaderComponent title={modalName} imagePath={false} closeModalWindow={() => { setExtraModal(false); }} />
          <ModalBody className="mt-0 pt-0">
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
          </ModalBody>
        </Modal>
        <Modal size={(createTenantinfo && createTenantinfo.data) ? 'sm' : 'xl'} className="border-radius-50px modal-dialog-centered searchData-modalwindow" isOpen={addVendorModal}>
          <ModalHeaderComponent title="Add Vendor" imagePath={false} closeModalWindow={() => { setAddVendorModal(false); }} response={createTenantinfo} />
          <ModalBody className="pt-0 mt-0">
            <AddVendor
              afterReset={() => { setAddVendorModal(false); dispatch(resetCreateTenant()); setNoData(false); }}
              setFieldValue={setFieldValue}
              requestorName={vendorKeyword}
              type="vendor"
              updateField="vendor_id"
              maintenanceConfigurationData={maintenanceConfigurationData}
              helpdeskCompanyId={getCompanyId(company_id)}
              moduleName="helpdesk"
            />
          </ModalBody>
        </Modal>
        <Modal size="xl" className="border-radius-50px modal-dialog-centered searchData-modalwindow " isOpen={extraModalCustom}>
          <ModalHeaderComponent title={modalName} imagePath={false} closeModalWindow={() => { setExtraModalCustom(false); }} />
          <ModalBody className="mt-0 pt-0">
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
          </ModalBody>
        </Modal>
      </ThemeProvider>
    </>
  );
});

TicketForm.propTypes = {
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  reloadSpace: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  type: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
  editId: PropTypes.oneOfType([PropTypes.bool, PropTypes.number, PropTypes.string]),
};

TicketForm.defaultProps = {
  type: false,
  editId: false,
};

export default TicketForm;
