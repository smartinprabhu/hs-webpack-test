/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
/* eslint-disable camelcase */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
  CircularProgress,
} from '@material-ui/core';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import moment from 'moment';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormLabel from '@mui/material/FormLabel';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { useFormikContext } from 'formik';
import { makeStyles } from '@material-ui/core/styles';
import { Box } from '@mui/system';
import {
  TextField, Dialog, DialogContent, DialogContentText,
} from '@mui/material';
import { IoCloseOutline } from 'react-icons/io5';

import MuiAutoComplete from '../../commonComponents/formFields/muiAutocomplete';
import MuiTextField from '../../commonComponents/formFields/muiTextField';
import MuiDateTimeField from '../../commonComponents/formFields/muiDateTimeField';
import DialogHeader from '../../commonComponents/dialogHeader';

import {
  getAuditSystems,
  getAuditDepartments,
  getHxAuditConfigData,
  getAuditCategories,
  getSystemChecklists,
} from '../auditService';
import {
  getTeamMember,
} from '../../auditSystem/auditService';
import {
  generateErrorMessage, extractOptionsObject, getDateTimeSeconds,
  extractValueObjects, getAllowedCompanies, getColumnArrayById,
  getTimeFromNumber, getListOfOperations,
  integerKeyPress,
} from '../../util/appUtils';
import actionCodes from '../data/actionCodes.json';
import { calculateRepeatingMonthlyEvents, getStartDateofAudit, getPlannedDays } from '../utils/utils';
import AdvancedSearchModal from './advancedSearchModal';
import ViewChecklists from '../auditDetails/viewChecklists';
import ViewEvents from './viewEvents';

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

const BasicForm = (props) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const {
    setFieldValue,
    setFieldTouched,
    systemData,
    isShow,
    editId,
    values,
    formField: {
      title,
      auditSystemId,
      auditCategoryId,
      plannedStartDate,
      auditSpocId,
      auditType,
      plannedEndDate,
      departmentId,
      Scope,
      Objective,
      monthCount,
      repeatUntil,
    },
  } = props;
  const { values: formValues } = useFormikContext();
  const {
    planned_start_date, month, bulk_events, is_repeats, audit_category_id, audit_spoc_id, audit_type, planned_end_date, audit_system_id, department_id,
  } = formValues;
  const [systemOpen, setSystemOpen] = useState(false);
  const [systemKeyword, setSystemKeyword] = useState('');

  const [departmentOpen, setDepartmentOpen] = useState(false);
  const [departmentKeyword, setDepartmentKeyword] = useState('');

  const [extraModal, setExtraModal] = useState(false);
  const [extraModal1, setExtraModal1] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [columns, setColumns] = useState(['id', 'name']);

  const [teamMemberOpen, setTeamMemberOpen] = useState(false);
  const [isViewChecklists, setViewChecklists] = useState(false);
  const [teamMemberKeyword, setTeamMemberKeyword] = useState('');

  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categoryKeyword, setCategoryKeyword] = useState('');
  const [taskQuestions, setTaskQuestions] = useState([]);

  const [isBulkEvents, setViewBulkEvents] = useState(false);

  const { userInfo, userRoles } = useSelector((state) => state.user);

  const {
    hxSystemsInfo,
    hxDepartmentsInfo,
    hxAuditConfig,
    hxCategoriesInfo,
    hxAuditDetailsInfo,
    hxSystemChecklists,
  } = useSelector((state) => state.hxAudits);

  const allowedOperations = getListOfOperations(
    userRoles && userRoles.data ? userRoles.data.allowed_modules : [],
    'code',
  );

  const isBulkCreatable = allowedOperations.includes(actionCodes['Create Bulk Audit']);

  const detailedData = hxAuditDetailsInfo && hxAuditDetailsInfo.data && hxAuditDetailsInfo.data.length ? hxAuditDetailsInfo.data[0] : '';

  const isSystemEditable = !editId || (editId && detailedData && (detailedData.state === 'Upcoming'));
  const isDateEditable = !editId;

  const {
    teamMembers,
  } = useSelector((state) => state.audit);

  const companies = getAllowedCompanies(userInfo);

  const userCompanyId = userInfo && userInfo.data && userInfo.data.company ? userInfo.data.company.id : '';
  const userParentId = userInfo && userInfo.data && userInfo.data.company.parent_id ? userInfo.data.company.parent_id.id : '';

  useEffect(() => {
    if (editId) {
      setFieldValue('date_valid', 'yes');
    }
  }, [editId]);

  const addDueDays = (days) => {
    const result = new Date();
    result.setDate(result.getDate() + days);
    return result;
  };

  const [deadline, setDeadline] = useState(dayjs(addDueDays(365)));

  useEffect(() => {
    if (!editId) {
      if (is_repeats === 'No') {
        setFieldValue('month', 1);
        setFieldValue('repeat_until', false);
        setFieldValue('bulk_events', []);
      } else {
        setDeadline(dayjs(addDueDays(365)));
      }
    }
  }, [is_repeats]);

  useEffect(() => {
    if (hxSystemChecklists && hxSystemChecklists.data && hxSystemChecklists.data.length && hxSystemChecklists.data[0].page_ids && hxSystemChecklists.data[0].page_ids.length) {
      const newArrData = hxSystemChecklists.data[0].page_ids.flatMap((item) => item.question_ids.map((question) => ({
        id: question.id,
        answer_type: question.type, // Replace with actual value if available
        remarks: null, // Replace with actual value if available
        answer_common: null, // Replace with actual value if available
        mro_quest_grp_id: question.question_group_id, // Replace with actual value if available
        achieved_score: null, // Replace with actual value if available
        page_id: {
          id: item.id,
          title: item.title,
        },
        mro_activity_id: {
          id: question.id,
          name: question.question,
          applicable_score: question.applicable_score,
          applicable_standard_ids: question.applicable_standard_ids,
          helper_text: question.helper_text,
          procedure: question.procedure,
          sequence: question.sequence,
        },
      })));

      setTaskQuestions(newArrData);
    } else {
      setTaskQuestions([]);
    }
  }, [hxSystemChecklists]);

  useEffect(() => {
    if (!editId) {
      if (deadline) {
        setFieldValue('repeat_until', deadline);
      } else {
        setFieldValue('repeat_until', false);
      }
    }
  }, [deadline]);

  useEffect(() => {
    if (teamMemberOpen) {
      dispatch(getTeamMember(companies, appModels.TEAMMEMEBERS, teamMemberKeyword));
    }
  }, [teamMemberKeyword, teamMemberOpen]);

  useEffect(() => {
    if (planned_end_date && planned_start_date) {
      if (planned_end_date && editId && (new Date(planned_start_date) >= new Date(planned_end_date))) {
        setFieldValue('date_valid', '');
      } else {
        setFieldValue('date_valid', 'yes');
      }
      if (new Date(planned_start_date) >= new Date(planned_end_date)) {
        setFieldValue('date_valid', '');
      } else {
        setFieldValue('date_valid', 'yes');
      }
    }
  }, [planned_end_date, planned_start_date]);

  useEffect(() => {
    if (userInfo && userInfo.data && userInfo.data.company) {
      dispatch(getHxAuditConfigData(userInfo.data.company.id, appModels.HXAUDITCONFIG));
    }
  }, [userInfo]);

  function getDepartmentValue(value) {
    let res = '';
    if (value && value.id) {
      res = value;
    } else if (value && value.length > 1) {
      res = { id: value[0], name: value[1] };
    }
    return res;
  }

  useEffect(() => {
    if (!editId) {
      if (audit_system_id && audit_system_id.id) {
        setFieldValue('scope', audit_system_id.scope ? audit_system_id.scope : '');
        setFieldValue('objective', audit_system_id.objective ? audit_system_id.objective : '');
        setFieldValue('department_id', audit_system_id.department_id ? getDepartmentValue(audit_system_id.department_id) : '');
      } else {
        setFieldValue('scope', '');
        setFieldValue('objective', '');
        setFieldValue('department_id', '');
      }
    }
    if (audit_system_id && audit_system_id.id) {
      dispatch(getSystemChecklists(audit_system_id.id, appModels.HXSYSTEM));
      setFieldValue('instructions_to_auditor', audit_system_id.instructions_to_auditor ? audit_system_id.instructions_to_auditor : '');
      setFieldValue('instructions_to_auditee', audit_system_id.instructions_to_auditee ? audit_system_id.instructions_to_auditee : '');
      setFieldValue('terms_and_conditions', audit_system_id.terms_and_conditions ? audit_system_id.terms_and_conditions : '');
      setFieldValue('audit_metric_id', audit_system_id.audit_metric_id ? extractValueObjects(audit_system_id.audit_metric_id) : false);
      setFieldValue('overall_score', audit_system_id.overall_score ? parseFloat(audit_system_id.overall_score) : 0.00);
    } else {
      setFieldValue('instructions_to_auditee', '');
      setFieldValue('instructions_to_auditor', '');
      setFieldValue('terms_and_conditions', '');
      setFieldValue('audit_metric_id', false);
      setFieldValue('overall_score', 0.00);
    }
  }, [audit_system_id]);

  useEffect(() => {
    if (!editId && systemData && systemData.plannedIn && systemData.plannedOut) {
      setFieldValue('planned_start_date', dayjs(systemData.plannedIn));
      setFieldValue('planned_end_date', dayjs(systemData.plannedOut));
    }
    if (!editId && systemData && systemData.systemId && systemData.systemName && systemData.type === 'audit_system_id') {
      setSystemKeyword(systemData.systemName);
      setSystemOpen(true);
    }
  }, [systemData]);

  useEffect(() => {
    if (!editId && audit_system_id && audit_system_id.id) {
      setFieldValue('name', `${audit_system_id.name}`);
      if (department_id && department_id.name) {
        setFieldValue('name', `${audit_system_id.name}-${department_id.name}`);
      }
    }
  }, [audit_system_id, department_id]);

  function getNoOfAudits(months) {
    let res = 0;
    if (!editId && is_repeats === 'Yes' && months && parseInt(months) > 0 && planned_start_date && planned_end_date) {
      let startDate = getStartDateofAudit(new Date(), parseInt(months));
      let endDate = getStartDateofAudit(new Date(), parseInt(months));
      let plannedStart = new Date();
      let plannedEnd = new Date();
      let eventStartDay = plannedStart.getDate();
      let eventEndDay = plannedEnd.getDate();
      let endMonth = plannedEnd.getMonth() + 1;
      if (planned_start_date && planned_end_date) {
        plannedStart = new Date(planned_start_date);
        plannedEnd = new Date(planned_end_date);
        startDate = getStartDateofAudit(new Date(planned_start_date), parseInt(months));
        endDate = getStartDateofAudit(new Date(planned_end_date), parseInt(months));
        eventStartDay = plannedStart.getDate();
        eventEndDay = plannedEnd.getDate();
        endMonth = plannedEnd.getMonth() + 1;
      }
      const repeatUntilDate = new Date(deadline);

      const events = calculateRepeatingMonthlyEvents(startDate, months, eventStartDay, eventEndDay, endDate, repeatUntilDate);
      const plannedEvents = getPlannedDays(events, planned_start_date, planned_end_date);
      setFieldValue('bulk_events', plannedEvents);
      res = events.length;
    } else {
      res = 0;
      setFieldValue('bulk_events', []);
    }
    return res;
  }

  useEffect(() => {
    getNoOfAudits(month);
  }, [month, planned_end_date, planned_start_date, deadline, is_repeats]);

  const configData = hxAuditConfig && hxAuditConfig.data && hxAuditConfig.data.length ? hxAuditConfig.data[0] : false;

  const addDays = (days) => {
    const date = editId ? dayjs(moment.utc(planned_start_date).local().tz(userInfo?.data?.timezone).format('YYYY-MM-DD HH:mm:ss')) : planned_start_date;
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  useEffect(() => {
    if (userInfo && userInfo.data && departmentOpen) {
      const tempLevel = configData && configData.department_access ? configData.department_access : 'Site';
      let domain = '';
      if (tempLevel === 'Site') {
        domain = `["company_id","=",${userCompanyId}]`;
      } else if (tempLevel === 'Company') {
        domain = `["company_id","in",[${userCompanyId}, ${userParentId}]]`;
      } else if (tempLevel === 'Instance') {
        domain = '"|",["company_id","=",1],["company_id","=",false]';
      }

      if (tempLevel && departmentKeyword) {
        domain = `${domain},["name","ilike","${departmentKeyword}"]`;
      }

      if (!tempLevel && departmentKeyword) {
        domain = `["name","ilike","${departmentKeyword}"]`;
      }

      dispatch(getAuditDepartments(domain, appModels.HXAUDITDEPARTMENT));
    }
  }, [userInfo, departmentKeyword, departmentOpen, hxAuditConfig]);

  useEffect(() => {
    if (userInfo && userInfo.data && systemOpen) {
      const tempLevel = configData && configData.audit_template_access ? configData.audit_template_access : 'Site';
      let domain = '';
      if (tempLevel === 'Site') {
        domain = `["company_id","=",${userCompanyId}],["state","=","Published"]`;
      } else if (tempLevel === 'Company') {
        domain = `["company_id","in",[${userCompanyId}, ${userParentId}]],["state","=","Published"]`;
      } else if (tempLevel === 'Instance') {
        domain = '"|",["company_id","=",1],["company_id","=",false],["state","=","Published"]';
      }

      if (tempLevel && systemKeyword) {
        domain = `${domain},["name","ilike","${systemKeyword}"],["state","=","Published"]`;
      }

      if (!tempLevel && systemKeyword) {
        domain = `["name","ilike","${systemKeyword}"],["state","=","Published"]`;
      }

      if (!tempLevel && !systemKeyword) {
        domain = '["state","=","Published"]';
      }

      dispatch(getAuditSystems(domain, appModels.HXSYSTEM));
    }
  }, [userInfo, systemKeyword, systemOpen, hxAuditConfig]);

  useEffect(() => {
    if (userInfo && userInfo.data && categoryOpen) {
      const tempLevel = configData && configData.audit_category_access ? configData.audit_category_access : 'Site';
      let domain = '';
      if (tempLevel === 'Site') {
        domain = `["company_id","=",${userCompanyId}]`;
      } else if (tempLevel === 'Company') {
        domain = `["company_id","in",[${userCompanyId}, ${userParentId}]]`;
      } else if (tempLevel === 'Instance') {
        domain = '"|",["company_id","=",1],["company_id","=",false]';
      }

      if (tempLevel && categoryKeyword) {
        domain = `${domain},["name","ilike","${categoryKeyword}"]`;
      }

      if (!tempLevel && categoryKeyword) {
        domain = `["name","ilike","${categoryKeyword}"]`;
      }

      dispatch(getAuditCategories(domain, appModels.HXAUDITCATEGORY));
    }
  }, [userInfo, categoryKeyword, categoryOpen, hxAuditConfig]);

  const showSystemModal = () => {
    setModelValue(appModels.HXSYSTEM);
    setColumns(['id', 'name', 'scope', 'instructions_to_auditor', 'audit_metric_id', 'overall_score', 'instructions_to_auditee', 'terms_and_conditions', 'objective', 'department_id']);
    setFieldName('audit_system_id');
    setModalName('Systems List');
    const tempLevel = configData && configData.audit_template_access ? configData.audit_template_access : 'Site';

    let domain = '';
    if (tempLevel === 'Site') {
      domain = `["company_id","=",${userCompanyId}],["state","=","Published"]`;
    } else if (tempLevel === 'Company') {
      domain = `["company_id","in",[${userCompanyId}, ${userParentId}]],["state","=","Published"]`;
    } else if (tempLevel === 'Instance') {
      domain = '"|",["company_id","=",1],["company_id","=",false],["state","=","Published"]';
    }

    if (!tempLevel) {
      domain = '["state","=","Published"]';
    }

    setCompanyValue(domain);
    setExtraModal(true);
  };

  const showDepModal = () => {
    setModelValue(appModels.HXAUDITDEPARTMENT);
    setColumns(['id', 'name']);
    setFieldName('department_id');
    setModalName('Departments List');
    let domain = '';
    const tempLevel = configData && configData.department_access ? configData.department_access : 'Site';
    if (tempLevel === 'Site') {
      domain = `["company_id","=",${userCompanyId}]`;
    } else if (tempLevel === 'Company') {
      domain = `["company_id","in",[${userCompanyId}, ${userParentId}]]`;
    } else if (tempLevel === 'Instance') {
      domain = '"|",["company_id","=",1],["company_id","=",false]';
    }

    setCompanyValue(domain);
    setExtraModal(true);
  };

  const showCatModal = () => {
    setModelValue(appModels.HXAUDITCATEGORY);
    setColumns(['id', 'name']);
    setFieldName('audit_category_id');
    setModalName('Category List');
    let domain = '';
    const tempLevel = configData && configData.audit_category_access ? configData.audit_category_access : 'Site';
    if (tempLevel === 'Site') {
      domain = `["company_id","=",${userCompanyId}]`;
    } else if (tempLevel === 'Company') {
      domain = `["company_id","in",[${userCompanyId}, ${userParentId}]]`;
    } else if (tempLevel === 'Instance') {
      domain = '"|",["company_id","=",1],["company_id","=",false]';
    }

    setCompanyValue(domain);
    setExtraModal(true);
  };

  const onSystemKeywordChange = (event) => {
    setSystemKeyword(event.target.value);
  };

  const onMemberKeywordChange = (event) => {
    setTeamMemberKeyword(event.target.value);
  };

  const onCategoryKeywordChange = (event) => {
    setCategoryKeyword(event.target.value);
  };

  const onCategoryClear = () => {
    setCategoryKeyword(null);
    setFieldValue('audit_category_id', '');
    setCategoryOpen(false);
  };

  const onSystemClear = () => {
    setSystemKeyword(null);
    setFieldValue('audit_system_id', '');
    setSystemOpen(false);
  };

  const onDepKeywordChange = (event) => {
    setDepartmentKeyword(event.target.value);
  };

  const onDepClear = () => {
    setDepartmentKeyword(null);
    setFieldValue('department_id', '');
    setDepartmentOpen(false);
  };

  const onMemberClear = () => {
    setTeamMemberKeyword(null);
    setFieldValue('audit_spoc_id', '');
    setTeamMemberOpen(false);
  };

  const showFacilityModal = () => {
    setModelValue(appModels.TEAMMEMEBERS);
    setColumns(['id', 'name']);
    setFieldName('audit_spoc_id');
    setModalName('Audit SPOC List');
    setCompanyValue(`["company_id","=",${userCompanyId}]`);
    setExtraModal1(true);
  // setExtraMultipleModal(true);
  };

  const systemOptions = extractOptionsObject(hxSystemsInfo, audit_system_id);
  const depOptions = extractOptionsObject(hxDepartmentsInfo, department_id);
  const teamMembersOptions = extractOptionsObject(teamMembers, audit_spoc_id);
  const categoryOptions = extractOptionsObject(hxCategoriesInfo, audit_category_id);

  return (
    <Box
      sx={{
        width: '100%',
        marginTop: '20px',
      }}
    >
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Box sx={{
          marginBottom: '10px',
        }}
        >
          <p className="mb-1">
            <FormLabel className="mb-2 mt-1 font-tiny line-height-small font-family-tab" id="demo-row-radio-buttons-group-label">Type</FormLabel>
          </p>
          <ButtonGroup
            variant="contained"
            size="small"
            aria-label="Basic button group"
          >
            <Button
              onClick={() => setFieldValue('audit_type', 'Internal')}
              variant={audit_type === 'Internal' ? 'contained' : 'outlined'}
              color={audit_type === 'Internal' ? 'primary' : 'inherit'}
            >
              Internal
            </Button>
            <Button
              onClick={() => setFieldValue('audit_type', 'External')}
              variant={audit_type === 'External' ? 'contained' : 'outlined'}
              color={audit_type === 'External' ? 'primary' : 'inherit'}
            >
              External
            </Button>
          </ButtonGroup>
        </Box>

      </Box>
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
            width: '48%',
            marginBottom: '10px',
          }}
          name={auditSystemId.name}
          label={auditSystemId.label}
          open={systemOpen}
          formGroupClassName="m-1"
          isRequired
          size="small"
          onOpen={() => {
            setSystemOpen(true);
            setSystemKeyword('');
          }}
          onClose={() => {
            setSystemOpen(false);
            setSystemKeyword('');
          }}
          oldValue={audit_system_id}
          disabled={!isSystemEditable}
          value={audit_system_id && audit_system_id.name ? audit_system_id.name : audit_system_id}
          getOptionDisabled={() => hxSystemsInfo && hxSystemsInfo.loading}
          getOptionSelected={(option, value) => (value.length > 0 ? option.name === value.name : '')}
          getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
          options={systemOptions}
          apiError={(hxSystemsInfo && hxSystemsInfo.err) ? generateErrorMessage(hxSystemsInfo) : false}
          customMessage={audit_system_id && audit_system_id.id && hxSystemChecklists && hxSystemChecklists.data && taskQuestions && taskQuestions.length > 0}
          customMessageContent={<span className="font-family-tab cursor-pointer text-info" onClick={() => setViewChecklists(true)}>View Checklists</span>}
          renderInput={(params) => (
            <TextField
              {...params}
              onChange={onSystemKeywordChange}
              variant="standard"
              label={`${auditSystemId.label}`}
              required
              className="without-padding custom-icons"
              placeholder="Search & Select"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {hxSystemsInfo && hxSystemsInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                    <InputAdornment position="end">
                      {isSystemEditable && ((audit_system_id && audit_system_id.name) || (systemKeyword && systemKeyword.length > 0)) && (
                      <IconButton onClick={onSystemClear}>
                        <IoCloseOutline size={22} fontSize="small" />
                      </IconButton>
                      )}
                      {isSystemEditable && (
                      <IconButton onClick={showSystemModal}>
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

        <MuiAutoComplete
          sx={{
            width: '48%',
            marginBottom: '10px',
          }}
          name={departmentId.name}
          label={departmentId.label}
          open={departmentOpen}
          formGroupClassName="m-1"
          isRequired
          size="small"
          onOpen={() => {
            setDepartmentOpen(true);
            setDepartmentKeyword('');
          }}
          onClose={() => {
            setDepartmentOpen(false);
            setDepartmentKeyword('');
          }}
          oldValue={department_id && department_id.name ? department_id.name : ''}
          value={department_id && department_id.name ? department_id.name : ''}
          getOptionDisabled={() => hxDepartmentsInfo && hxDepartmentsInfo.loading}
          getOptionSelected={(option, value) => (value.length > 0 ? option.name === value.name : '')}
          getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
          options={depOptions}
          apiError={(hxDepartmentsInfo && hxDepartmentsInfo.err) ? generateErrorMessage(hxDepartmentsInfo) : false}
          renderInput={(params) => (
            <TextField
              {...params}
              onChange={onDepKeywordChange}
              variant="standard"
              label={`${departmentId.label}`}
              placeholder="Search & Select"
              className="without-padding custom-icons"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {hxDepartmentsInfo && hxDepartmentsInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                    <InputAdornment position="end">
                      {((department_id && department_id.name) || (departmentKeyword && departmentKeyword.length > 0)) && (
                      <IconButton onClick={onDepClear}>
                        <IoCloseOutline size={22} fontSize="small" />
                      </IconButton>
                      )}
                      <IconButton onClick={showDepModal}>
                        <SearchIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  </>
                ),
              }}
            />
          )}
        />

      </Box>

      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '3%',
          flexWrap: 'wrap',
        }}
      >
        <MuiDateTimeField
          sx={{
            width: '48%',
            marginBottom: '10px',
          }}
          name={plannedStartDate.name}
          label={plannedStartDate.label}
          isRequired
          formGroupClassName="m-1"
          setFieldValue={setFieldValue}
          setFieldTouched={setFieldTouched}
          placeholder={plannedStartDate.label}
          disablePastDate
          disabled={!isDateEditable}
          value={planned_start_date ? dayjs(editId ? moment.utc(planned_start_date).local().tz(userInfo?.data?.timezone).format('YYYY-MM-DD HH:mm:ss') : planned_start_date) : null}
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
        <MuiDateTimeField
          sx={{
            width: '48%',
            marginBottom: '10px',
          }}
          name={plannedEndDate.name}
          label={plannedEndDate.label}
          isRequired
          disabled={!isDateEditable}
          formGroupClassName="m-1"
          minDateTime={editId ? dayjs(moment.utc(planned_start_date).local().tz(userInfo?.data?.timezone).format('YYYY-MM-DD HH:mm:ss')) : dayjs(planned_start_date)}
          maxDateTime={configData && configData.max_planned_interval_days ? dayjs(addDays(configData.max_planned_interval_days)) : dayjs(addDays(30))}
          setFieldValue={setFieldValue}
          setFieldTouched={setFieldTouched}
          placeholder={plannedEndDate.label}
          disablePastDate={!editId}
          disableCustom
          value={planned_end_date ? dayjs(editId ? moment.utc(planned_end_date).local().tz(userInfo?.data?.timezone).format('YYYY-MM-DD HH:mm:ss') : planned_end_date) : null}
          localeText={{ todayButtonLabel: 'Now' }}
          isErrorHandle
          errorField="date_valid"
        />
        {isBulkCreatable && !editId && planned_start_date && planned_end_date && (
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '3%',
              flexWrap: 'wrap',
            }}
          >
            <Box sx={{
              marginBottom: '10px',
              width: '15%',
            }}
            >
              <p className="mb-1">
                <FormLabel className="mb-2 mt-1 font-tiny line-height-small font-family-tab" id="demo-row-radio-buttons-group-label">Repeats</FormLabel>
              </p>
              <ButtonGroup
                variant="contained"
                size="small"
                aria-label="Basic button group"
              >
                <Button
                  onClick={() => setFieldValue('is_repeats', 'Yes')}
                  variant={is_repeats === 'Yes' ? 'contained' : 'outlined'}
                  color={is_repeats === 'Yes' ? 'primary' : 'inherit'}
                >
                  Yes
                </Button>
                <Button
                  onClick={() => setFieldValue('is_repeats', 'No')}
                  variant={is_repeats === 'No' ? 'contained' : 'outlined'}
                  color={is_repeats === 'No' ? 'primary' : 'inherit'}
                >
                  No
                </Button>
              </ButtonGroup>
            </Box>
            {is_repeats === 'Yes' && (
              <>
                <MuiTextField
                  sx={{
                    width: '20%',
                    marginBottom: '10px',
                  }}
                  name={monthCount.name}
                  label={monthCount.label}
                  inputProps={{ maxLength: 2 }}
                  onKeyPress={integerKeyPress}
                  setFieldValue={setFieldValue}
                  variant="standard"
                  value={values[monthCount.name]}
                />
                <Box sx={{
                  marginBottom: '10px',
                  width: '30%',
                }}
                >
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker']} sx={{ overflow: 'hidden' }}>
                      <DatePicker
                        minDate={dayjs(new Date())}
                        maxDate={dayjs(addDueDays(365))}
                        localeText={{ todayButtonLabel: 'Now' }}
                        slotProps={{
                          actionBar: {
                            actions: ['accept'],
                          },
                        }}
                        disablePast
                        name="Repeats Until"
                        label="Repeats Until"
                        format="DD/MM/YYYY"
                        value={deadline}
                        onChange={setDeadline}
                        ampm={false}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </Box>
              </>
            )}
            {is_repeats === 'Yes' && (
              <p className="font-family-tab font-tiny">
                Note:
                {bulk_events.length}
                {' '}
                Audits will be scheduled for the above date range.
                <span onClick={() => setViewBulkEvents(true)} className="font-family-tab font-tiny ml-2 cursor-pointer text-info">View</span>
              </p>
            )}
          </Box>
        )}
      </Box>

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
            width: '48%',
            marginBottom: '10px',
          }}
          name={Scope.name}
          label={Scope.label}
          inputProps={{ maxLength: 150 }}
          setFieldValue={setFieldValue}
          variant="standard"
          value={values[Scope.name]}
        />
        <MuiTextField
          sx={{
            width: '48%',
            marginBottom: '10px',
          }}
          name={Objective.name}
          label={Objective.label}
          inputProps={{ maxLength: 150 }}
          setFieldValue={setFieldValue}
          variant="standard"
          value={values[Objective.name]}
        />

      </Box>
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
            width: '48%',
            marginBottom: '10px',
          }}
          name={auditSpocId.name}
          label={auditSpocId.label}
          open={teamMemberOpen}
          isRequired
          formGroupClassName="m-1"
          size="small"
          onOpen={() => {
            setTeamMemberOpen(true);
            setTeamMemberKeyword('');
          }}
          onClose={() => {
            setTeamMemberOpen(false);
            setTeamMemberKeyword('');
          }}
          oldValue={audit_spoc_id && audit_spoc_id.name ? audit_spoc_id.name : ''}
          value={audit_spoc_id && audit_spoc_id.name ? audit_spoc_id.name : ''}
          getOptionDisabled={() => teamMembers && teamMembers.loading}
          getOptionSelected={(option, value) => (value.length > 0 ? option.name === value.name : '')}
          getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
          options={teamMembersOptions}
          apiError={(teamMembers && teamMembers.err) ? generateErrorMessage(teamMembers) : false}
          renderInput={(params) => (
            <TextField
              {...params}
              onChange={onMemberKeywordChange}
              variant="standard"
              label={`${auditSpocId.label}`}
              required
              className="without-padding custom-icons"
              placeholder="Search & Select"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {teamMembers && teamMembers.loading ? <CircularProgress color="inherit" size={20} /> : null}
                    <InputAdornment position="end">
                      {((audit_spoc_id && audit_spoc_id.name) || (teamMemberKeyword && teamMemberKeyword.length > 0)) && (
                      <IconButton onClick={onMemberClear}>
                        <IoCloseOutline size={22} fontSize="small" />
                      </IconButton>
                      )}
                      <IconButton onClick={showFacilityModal}>
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
            width: '48%',
            marginBottom: '10px',
          }}
          name={auditCategoryId.name}
          label={auditCategoryId.label}
          open={categoryOpen}
          formGroupClassName="m-1"
          size="small"
          onOpen={() => {
            setCategoryOpen(true);
            setCategoryKeyword('');
          }}
          onClose={() => {
            setCategoryOpen(false);
            setCategoryKeyword('');
          }}
          oldValue={audit_category_id && audit_category_id.name ? audit_category_id.name : ''}
          value={audit_category_id && audit_category_id.name ? audit_category_id.name : ''}
          getOptionDisabled={() => hxCategoriesInfo && hxCategoriesInfo.loading}
          getOptionSelected={(option, value) => (value.length > 0 ? option.name === value.name : '')}
          getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
          options={categoryOptions}
          apiError={(hxCategoriesInfo && hxCategoriesInfo.err) ? generateErrorMessage(hxCategoriesInfo) : false}
          renderInput={(params) => (
            <TextField
              {...params}
              onChange={onCategoryKeywordChange}
              variant="standard"
              label={`${auditCategoryId.label}`}
              className="without-padding custom-icons"
              placeholder="Search & Select"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {hxCategoriesInfo && hxCategoriesInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                    <InputAdornment position="end">
                      {((audit_category_id && audit_category_id.name) || (categoryKeyword && categoryKeyword.length > 0)) && (
                      <IconButton onClick={onCategoryClear}>
                        <IoCloseOutline size={22} fontSize="small" />
                      </IconButton>
                      )}
                      <IconButton onClick={showCatModal}>
                        <SearchIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  </>
                ),
              }}
            />
          )}
        />
      </Box>
      {audit_system_id && audit_system_id.id && (
        <MuiTextField
          sx={{
            width: '100%',
            marginBottom: '30px',
          }}
          name={title.name}
          label={title.label}
          inputProps={{ maxLength: 150 }}
          setFieldValue={setFieldValue}
          variant="standard"
          value={values[title.name]}
          required
        />
      )}

      <Dialog size="lg" fullWidth open={extraModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraModal(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <AdvancedSearchModal
              modelName={modelValue}
              afterReset={() => { setExtraModal(false); }}
              fieldName={fieldName}
              fields={columns}
              company={companyValue}
              placeholderName="Search"
              setFieldValue={setFieldValue}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Dialog size="lg" fullWidth open={extraModal1}>
        <DialogHeader title={modalName} onClose={() => { setExtraModal1(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <AdvancedSearchModal
              modelName={modelValue}
              afterReset={() => { setExtraModal1(false); }}
              fieldName={fieldName}
              setFieldValue={setFieldValue}
              fields={columns}
              company={companyValue}
              placeholderName="Search"
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Dialog size="xl" fullWidth open={isViewChecklists}>
        <DialogHeader title="View Checklists" onClose={() => { setViewChecklists(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <ViewChecklists orderCheckLists={taskQuestions} questionOnly />
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Dialog size="lg" fullWidth open={isBulkEvents}>
        <DialogHeader title="View Events" onClose={() => { setViewBulkEvents(false); }} />
        <ViewEvents setFieldValue={setFieldValue} events={bulk_events && bulk_events.length > 0 ? bulk_events : []} onClose={() => { setViewBulkEvents(false); }} deadline={deadline} />
      </Dialog>

    </Box>
  );
};

BasicForm.propTypes = {
  formField: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  editId: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]).isRequired,
  setFieldTouched: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  isShow: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]).isRequired,
};

export default BasicForm;
