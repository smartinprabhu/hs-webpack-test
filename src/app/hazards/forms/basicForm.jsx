/* eslint-disable no-nested-ternary */
/* eslint-disable camelcase */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  
  Spinner,
  FormGroup,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/system';
import {
  Typography, TextField, FormControl, Dialog, DialogContent, DialogContentText, Tooltip,
} from '@mui/material';
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { IoCloseOutline } from 'react-icons/io5';
import {
  CircularProgress} from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import { useFormikContext } from 'formik';
import { Cascader, Divider } from 'antd';
import { makeStyles } from '@material-ui/core/styles';



import {
  getHxIncidentConfig, getHxcategories, getHxPriorities,
  getHxTypes,
} from '../ctService';
import {
  getEquipmentList, getCascader,
} from '../../helpdesk/ticketService';
import {
  getBuildings, getAllSpaces, getTeamList,
} from '../../assets/equipmentService';
import {
  getTeamMember,
} from '../../auditSystem/auditService';
import {
  generateErrorMessage, extractOptionsObject, getDateTimeSeconds,
  getAllowedCompanies, getColumnArrayById,
  getTimeFromNumber, isAllCompany, preprocessData,
} from '../../util/appUtils';
import AdvancedSearchModal from './advancedSearchModal';
import SearchModalHelp from '../../helpdesk/forms/searchModal';
// import SearchModalMultiple from './searchModalMultiple';
import { addParents, addChildrens } from '../../helpdesk/utils/utils';
import SearchModalTeam from '../../assets/forms/advancedSearchModal';
import SearchModalMultiple from '../../auditSystem/operations/forms/searchModalMultiple';
import SeverityTable from './severityTable';
import MuiAutoComplete from '../../commonComponents/formFields/muiAutocomplete';
import MuiTextField from '../../commonComponents/formFields/muiTextField';
import MuiTextarea from '../../commonComponents/formFields/muiTextarea';
import UploadDocuments from '../../commonComponents/uploadDocuments';
import DialogHeader from '../../commonComponents/dialogHeader';

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
    isShow,
    editId,
    values,
    formField: {
      title,
      typeCategory,
      targetClosureDate,
      categoryId,
      priorityId,
      maintenanceTeamId,
      description,
      equipmentId,
      assetId,
      incidentOn,
      incidentTypeId,
      companyId,
    },
  } = props;
  const { values: formValues } = useFormikContext();
  const {
    target_closure_date, type_category, equipment_id, asset_id,
    category_id, priority_id, assigned_id, maintenance_team_id,
    incident_on, incident_type_id, company_id,
  } = formValues;
  const [systemOpen, setSystemOpen] = useState(false);
  const [systemKeyword, setSystemKeyword] = useState('');

  const [equipmentOpen, setEquipmentOpen] = useState(false);
  const [equipmentKeyword, setEquipmentKeyword] = useState('');
  const [cascaderValues, setCascaderValues] = useState([]);
  const [childValues, setChildValues] = useState([]);

  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);

  const [parentId, setParentId] = useState('');
  const [spaceId, setSpaceId] = useState(false);
  const [spaceCategoryId, setSpaceCategoryId] = useState('');
  const [companyOpen, setCompanyOpen] = useState(false);

  const [extraModal, setExtraModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [columns, setColumns] = useState(['id', 'name']);
  const [childLoad, setChildLoad] = useState(false);

  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categoryKeyword, setCategoryKeyword] = useState('');

  const [subCategoryOpen, setSubCategoryOpen] = useState(false);
  const [subCategoryKeyword, setSubCategoryKeyword] = useState('');

  const [priorityOpen, setPriorityOpen] = useState(false);
  const [priorityKeyword, setPriorityKeyword] = useState('');

  const [teamOpen, setTeamOpen] = useState(false);
  const [teamKeyword, setTeamKeyword] = useState('');

  const [extraModalHelp, setExtraModalHelp] = useState(false);
  const [placeholderName, setPlaceholder] = useState('');
  const [extraModalTeam, setExtraModalTeam] = useState(false);

  const [teamMemberOpen, setTeamMemberOpen] = useState(false);
  const [teamMemberKeyword, setTeamMemberKeyword] = useState('');

  const [extraMultipleModal, setExtraMultipleModal] = useState(false);

  const [extraModalTable, setExtraModalTable] = useState(false);

  const [probOpen, setProbOpen] = useState(false);

  const [showMore, setShowMore] = useState(true);

  const [typeOpen, setTypeOpen] = useState(false);
  const [typeKeyword, setTypeKeyword] = useState('');

  const { userInfo, userRoles } = useSelector((state) => state.user);

  const {
    teamMembers,
  } = useSelector((state) => state.audit);

  const {
    equipmentInfo, spaceCascader,
  } = useSelector((state) => state.ticket);

  const {
    buildingsInfo, buildingSpaces,
    teamsInfo,
  } = useSelector((state) => state.equipment);

  const {
    hxSeverities,
    hxIncidentConfig,
    hxCategories,
    hxSubCategories,
    hxPriorities,
    addIncidentInfo,
    hxTypes,
    incidentDetailsInfo,
  } = useSelector((state) => state.hazards);

  const {
    allowedCompanies,
  } = useSelector((state) => state.setup);

  const isAllCompanies = isAllCompany(userInfo, userRoles);

  const [targetDate, setTargetDateChange] = useState(target_closure_date ? new Date(getDateTimeSeconds(target_closure_date)) : new Date());

  const targetClosureDateValue = editId && incidentDetailsInfo && incidentDetailsInfo.data && incidentDetailsInfo.data.length ? incidentDetailsInfo.data[0].target_closure_date : false;

  const oldPid = editId && incidentDetailsInfo && incidentDetailsInfo.data && incidentDetailsInfo.data.length ? incidentDetailsInfo.data[0].priority_id : false;

  const userCompanyIdAdd = userInfo && userInfo.data && userInfo.data.company ? userInfo.data.company.id : '';
  const userCompanyIdEdit = company_id && company_id.id ? company_id.id : userCompanyIdAdd;
  const userCompanyIdSelect = isAllCompanies ? userCompanyIdEdit : userCompanyIdAdd;
  const userParentId = userInfo && userInfo.data && userInfo.data.company.parent_id ? userInfo.data.company.parent_id.id : '';

  const companies = isAllCompanies ? userCompanyIdEdit : getAllowedCompanies(userInfo);

  const userCompanyId = editId ? userCompanyIdEdit : userCompanyIdSelect;

  const userCompaniesList = allowedCompanies && allowedCompanies.data && allowedCompanies.data.allowed_companies && allowedCompanies.data.allowed_companies.length > 0
    ? allowedCompanies.data.allowed_companies : userInfo && userInfo.data && userInfo.data.allowed_companies && userInfo.data.allowed_companies.length > 0 ? userInfo.data.allowed_companies : [];
  const userCompanies = isAllCompanies && userInfo && userInfo.data && userInfo.data.is_parent ? userCompaniesList.filter((item) => item.id !== userInfo.data.company.id) : userCompaniesList;

  useEffect(() => {
    if (userInfo && userInfo.data && userCompanyId && !isAllCompanies) {
      dispatch(getBuildings(companies, appModels.SPACE));
      if (!editId) {
        dispatch(getHxIncidentConfig(userCompanyId, appModels.HAZARDCONFIG));
        setFieldValue('incident_on', new Date());
      }
    }
  }, [isShow]);

  useEffect(() => {
    if (isAllCompanies && company_id && company_id.id) {
      dispatch(getBuildings(company_id.id, appModels.SPACE));
      dispatch(getHxIncidentConfig(company_id.id, appModels.HAZARDCONFIG));
      if (!editId) {
        setFieldValue('incident_on', new Date());
      }
    }
  }, [company_id]);

  useEffect(() => {
    if (editId && priority_id && priority_id.resolution_time) {
      const closurDate = getTimeFromNumber(targetClosureDateValue, false, priority_id.resolution_time);
      const oId = oldPid && oldPid.id ? oldPid.id : false;
      if ((oldPid && !oldPid.id) || (oId !== priority_id.id)) {
        setFieldValue('target_closure_date', closurDate);
      }
    }
  }, [priority_id]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (buildingsInfo && buildingsInfo.data)) {
      setChildValues(addParents(buildingsInfo.data));
      if (!editId && !asset_id && buildingsInfo.data.length) {
        setFieldValue('asset_id', buildingsInfo.data[0]);
      }
    }
  }, [buildingsInfo]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && teamOpen) {
        await dispatch(getTeamList(companies, appModels.TEAM, teamKeyword));
      }
    })();
  }, [teamOpen, teamKeyword]);

  useEffect(() => {
    if ((userInfo && userInfo.data) && (buildingSpaces && buildingSpaces.data && buildingSpaces.data.length && parentId)) {
      setChildLoad(true);
      const childData = addChildrens(childValues, buildingSpaces.data[0].child, parentId);
      setChildValues(childData);
    }
  }, [buildingSpaces, parentId]);

  useEffect(() => {
    if (childValues) {
      setChildLoad(true);
      setCascaderValues(childValues);
    }
  }, [childValues]);

  useEffect(() => {
    if (cascaderValues && childLoad) {
      dispatch(getCascader(cascaderValues));
    }
  }, [cascaderValues, buildingSpaces, childLoad]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && equipmentOpen) {
        await dispatch(getEquipmentList(companies, appModels.EQUIPMENT, equipmentKeyword));
      }
    })();
  }, [equipmentKeyword, equipmentOpen]);

  const configData = hxIncidentConfig && hxIncidentConfig.data && hxIncidentConfig.data.length ? hxIncidentConfig.data[0] : false;

  useEffect(() => {
    if (configData) {
      setFieldValue('has_attachment_for_reporting', configData.has_attachment_for_reporting);
      setFieldValue('has_incident_type', configData.has_incident_type);
    } else {
      setFieldValue('has_attachment_for_reporting', '');
      setFieldValue('has_incident_type', '');
    }
  }, [hxIncidentConfig]);

  useEffect(() => {
    if (userInfo && userInfo.data && teamMemberOpen) {
      dispatch(getTeamMember(companies, appModels.TEAMMEMEBERS, teamMemberKeyword));
    }
  }, [userInfo, teamMemberKeyword, teamMemberOpen]);

  useEffect(() => {
    if (userInfo && userInfo.data && categoryOpen && configData) {
      const tempLevel = configData.category_access ? configData.category_access : '';
      let domain = '';
      if (tempLevel === 'Site') {
        domain = `["company_id","=",${userCompanyId}]`;
      } else if (tempLevel === 'Company') {
        domain = `["company_id","in",[${userCompanyId}, ${userParentId}]]`;
      } else if (tempLevel === 'Instance') {
        domain = '"|",["company_id","=",1],["company_id","=",false]';
      }

      if (incident_type_id.category_ids && incident_type_id.category_ids.length) {
        domain = `${domain},["id","in",[${getColumnArrayById(incident_type_id.category_ids, 'id')}]]`;
      }

      if (tempLevel && categoryKeyword) {
        domain = `${domain},["name","ilike","${categoryKeyword}"]`;
      }

      if (!tempLevel && categoryKeyword) {
        domain = `["name","ilike","${categoryKeyword}"]`;
      }

      dispatch(getHxcategories(domain, appModels.EHSCATEGORY));
    }
    /* if (!incident_type_id) {
      setFieldValue('category_id', '');
      setFieldValue('sub_category_id', '');
    } */
  }, [userInfo, categoryKeyword, categoryOpen, hxIncidentConfig, incident_type_id]);

  useEffect(() => {
    if (userInfo && userInfo.data && priorityOpen && configData) {
      const tempLevel = configData.priority_access ? configData.priority_access : '';
      let domain = '';
      if (tempLevel === 'Site') {
        domain = `["company_id","=",${userCompanyId}]`;
      } else if (tempLevel === 'Company') {
        domain = `["company_id","in",[${userCompanyId}, ${userParentId}]]`;
      } else if (tempLevel === 'Instance') {
        domain = '"|",["company_id","=",1],["company_id","=",false]';
      }

      if (tempLevel && priorityKeyword) {
        domain = `${domain},["name","ilike","${priorityKeyword}"]`;
      }

      if (!tempLevel && priorityKeyword) {
        domain = `["name","ilike","${priorityKeyword}"]`;
      }

      dispatch(getHxPriorities(domain, appModels.EHSPRIORITY));
    }
  }, [userInfo, priorityKeyword, priorityOpen, hxIncidentConfig]);

  useEffect(() => {
    if (userInfo && userInfo.data && typeOpen) {
      const tempLevel = configData.incident_type_access ? configData.incident_type_access : '';
      let domain = '';
      if (tempLevel === 'Site') {
        domain = `["company_id","=",${userCompanyId}]`;
      } else if (tempLevel === 'Company') {
        domain = `["company_id","in",[${userCompanyId}, ${userParentId}]]`;
      } else if (tempLevel === 'Instance') {
        domain = '"|",["company_id","=",1],["company_id","=",false]';
      }

      if (tempLevel && typeKeyword) {
        domain = `${domain},["name","ilike","${typeKeyword}"]`;
      }

      if (!tempLevel && typeKeyword) {
        domain = `["name","ilike","${typeKeyword}"]`;
      }

      dispatch(getHxTypes(domain, appModels.EHSTYPES));
    }
  }, [userInfo, typeKeyword, typeOpen, hxIncidentConfig]);

  const onCatClear = () => {
    setCategoryKeyword(null);
    setFieldValue('category_id', '');
    setCategoryOpen(false);
  };

  const showCatModal = () => {
    setModelValue(appModels.EHSCATEGORY);
    setColumns(['id', 'name']);
    setFieldName('category_id');
    setModalName('Category List');
    let domain = '';
    const tempLevel = configData.category_access ? configData.category_access : '';
    if (tempLevel === 'Site') {
      domain = `["company_id","=",${userCompanyId}]`;
    } else if (tempLevel === 'Company') {
      domain = `["company_id","in",[${userCompanyId}, ${userParentId}]]`;
    } else if (tempLevel === 'Instance') {
      domain = '"|",["company_id","=",1],["company_id","=",false]';
    }

    if (incident_type_id.category_ids && incident_type_id.category_ids.length) {
      domain = `${domain},["id","in",[${getColumnArrayById(incident_type_id.category_ids, 'id')}]]`;
    }

    setCompanyValue(domain);
    setExtraModal(true);
  };

  const onTypeClear = () => {
    setTypeKeyword(null);
    setFieldValue('incident_type_id', '');
    setTypeOpen(false);
  };

  const showTypeModal = () => {
    setModelValue(appModels.EHSTYPES);
    setColumns(['id', 'name', 'category_ids', 'is_show_category']);
    setFieldName('incident_type_id');
    setModalName('Type of Activity / Hazard');
    const tempLevel = configData.incident_type_access ? configData.incident_type_access : '';
    let domain = '';
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

  const onPriorityClear = () => {
    setPriorityKeyword(null);
    setFieldValue('priority_id', '');
    setPriorityOpen(false);
  };

  const showPriorityModal = () => {
    setModelValue(appModels.EHSPRIORITY);
    setColumns(['id', 'name']);
    setFieldName('priority_id');
    setModalName('Priority List');
    let domain = '';
    const tempLevel = configData.priority_access ? configData.priority_access : '';
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

  const handleTimeChange = (event) => {
    const { checked, value } = event.target;
    if (checked && value) {
      setFieldValue('type_category', value);
      if (value === 'asset') {
        setFieldValue('asset_id', '');
      } else {
        setFieldValue('equipment_id', '');
      }
    }
  };

  const onEquipmentKeywordChange = (event) => {
    setEquipmentKeyword(event.target.value);
  };

  const onEquipmentKeywordClear = () => {
    setEquipmentKeyword(null);
    setFieldValue('equipment_id', '');
    setEquipmentOpen(false);
  };

  const onChange = (value, selectedOptions) => {
    setParentId('');
    if (selectedOptions && selectedOptions.length) {
      if (!selectedOptions[0].parent_id) {
        setParentId(selectedOptions[0].id);
        setSpaceId(selectedOptions[0].id);
        setSpaceCategoryId(selectedOptions[0].typeId);
        if (spaceId !== selectedOptions[0].id) {
          dispatch(getAllSpaces(selectedOptions[0].id, companies));
        }
      } else {
        setSpaceCategoryId(selectedOptions[0].typeId);
      }
    } else {
      // setFieldValue('category_id', '');
      // setFieldValue('sub_category_id', '');
    }
    setFieldValue('asset_id', value);
  };

  const showTeamModal = () => {
    setModelValue(appModels.TEAM);
    setColumns(['id', 'name']);
    setFieldName('maintenance_team_id');
    setModalName('Team List');
    setPlaceholder('Maintenance Teams');
    setCompanyValue(companies);
    setExtraModalTeam(true);
  };

  const onTeamClear = () => {
    setTeamKeyword(null);
    setFieldValue('maintenance_team_id', '');
    setTeamOpen(false);
  };

  const showEquipmentModal = () => {
    setModelValue(appModels.EQUIPMENT);
    setColumns(['id', 'name', 'location_id', 'category_id', 'maintenance_team_id']);
    setFieldName('equipment_id');
    setModalName('Equipments List');
    const domain = `["company_id","=",${userCompanyId}]`;
    setCompanyValue(domain);
    setExtraModal(true);
  };

  const onFacilityClear = () => {
    setTeamMemberKeyword(null);
    setFieldValue('assigned_id', '');
    setTeamMemberOpen(false);
  };

  const showFacilityModal = () => {
    setModelValue(appModels.TEAMMEMEBERS);
    setColumns(['id', 'name']);
    setFieldName('assigned_id');
    setModalName('Team Members List');
    setCompanyValue(`["company_id","=",${userCompanyId}]`);
    setExtraModal(true);
    // setExtraMultipleModal(true);
  };

  const resetEquipment = () => {
    if (!(!editId && equipmentId)) {
      setFieldValue('equipment_id', '');
    }
    setFieldValue('category_id', '');
    setFieldValue('sub_category_id', '');
  };

  const resetSpaceCheck = () => {
    setFieldValue('asset_id', '');
    setFieldValue('category_id', '');
    setFieldValue('sub_category_id', '');
  };


  let typeOptions = [{ name: 'equipment', value: 'Equipment' }, { name: 'asset', value: "Space" }]
  const defaultValue = () => {
    if (type_category === 'equipment') {
      return typeOptions[0]
    } else if (type_category === 'asset') {
      return typeOptions[1]
    }
  }
  const [typeCategoryOption, setTypeCategoryOption] = useState(defaultValue())

  const isUserError = userInfo && userInfo.err;
  const loading = (userInfo && userInfo.loading) || (buildingsInfo && buildingsInfo.loading) || (buildingSpaces && buildingSpaces.loading);
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (buildingsInfo && buildingsInfo.err) ? generateErrorMessage(buildingsInfo) : userErrorMsg;
  const errorMsg1 = (buildingSpaces && buildingSpaces.err) ? generateErrorMessage(buildingSpaces) : userErrorMsg;

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
      {/* {((buildingsInfo && buildingsInfo.err) || isUserError) && (
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
      )} */}
    </div>
  );

  const loadData = () => { };

  const equipmentOptions = extractOptionsObject(equipmentInfo, equipment_id);
  const categoryOptions = extractOptionsObject(hxCategories, category_id);
  const priorityOptions = extractOptionsObject(hxPriorities, priority_id);
  const teamOptions = extractOptionsObject(teamsInfo, maintenance_team_id);
  const teamMembersOptions = extractOptionsObject(teamMembers, assigned_id);

  const typesOptions = extractOptionsObject(hxTypes, incident_type_id);

  function getModdata(data) {
    const newArrData = data.map((cl) => ({
      id: cl.id,
      name: cl.title_id && cl.title_id.name ? cl.title_id.name : '',
    }));
    return newArrData;
  }

  function getOldDataId(oldData) {
    return oldData && oldData.name ? oldData.name : '';
  }

  function checkDataType(arr) {
    let res = [];
    if (arr && arr.id) {
      res = [arr.id, arr.name];
    } else if (arr && arr.length) {
      res = arr;
    }
    return res;
  }

  return (
    <>
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
            gap: '3%',
            flexWrap: 'wrap',
          }}
        >
          <MuiTextField
            sx={{
              width: '100%',
              marginBottom: '10px',
            }}
            name={title.name}
            label={title.label}
            maxLength="150"
            setFieldValue={setFieldValue}
            variant="standard"
            value={values[title.name]}
            required
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
          {!editId && isAllCompanies && (
            <MuiAutoComplete
              sx={{
                width: '100%',
                marginTop: 'auto',
                marginBottom: '10px',
              }}
              name={companyId.name}
              label={companyId.label}
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
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={userCompanies}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  // className="input-small-custom without-padding"
                  placeholder="Select"
                  label={companyId.label}
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
              marginTop: 'auto',
              marginBottom: '10px',
            }}
            options={typeOptions}
            name="TypeCategory"
            label="Type"
            getOptionSelected={(option, value) => option.value === value.value}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.value)}
            onChange={(e, option) => {
              console.log(e, option);
              if (option) {
                setTypeCategoryOption(option);
                setFieldValue('type_category', option.name);
                if (option.name === 'equipment') {
                  resetEquipment();
                } else {
                  resetSpaceCheck();
                }
              }
            }}
            value={typeCategoryOption}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Type"
                required
                variant="standard"
              />
            )}
          />
          <MuiAutoComplete
            name={categoryId.name}
            label={categoryId.label}
            sx={{
              width: '48%',
              marginTop: 'auto',
              marginBottom: '10px',
            }}
            oldValue={getOldDataId(category_id)}
            value={category_id && category_id.name ? category_id.name : getOldDataId(category_id)}
            apiError={(hxCategories && hxCategories.err) ? generateErrorMessage(hxCategories) : false}
            open={categoryOpen}
            onOpen={() => {
              setCategoryOpen(true);
              setCategoryKeyword('');
            }}
            onClose={() => {
              setCategoryOpen(false);
              setCategoryKeyword('');
            }}
            loading={hxCategories && hxCategories.loading}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={categoryOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={(e) => setCategoryKeyword(e.target.value)}
                variant="standard"
                value={categoryKeyword}
                label={categoryId.label}
                required
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {hxCategories && hxCategories.loading ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {((getOldDataId(category_id)) || (category_id && category_id.id) || (categoryKeyword && categoryKeyword.length > 0)) && (
                          <Tooltip title="Clear" fontSize="small">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={onCatClear}
                            >
                              <IoCloseOutline size={22} fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Search" fontSize="small">
                          <IconButton
                            aria-label="toggle search visibility"
                            onClick={showCatModal}
                          >
                            <SearchIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
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
          {type_category === 'equipment'
            && (
              <MuiAutoComplete
                sx={{
                  width: '48%',
                  marginTop: 'auto',
                  marginBottom: '10px',
                }}
                name={equipmentId.name}
                label={equipmentId.label}
                apiError={(equipmentInfo && equipmentInfo.err) ? generateErrorMessage(equipmentInfo) : false}
                oldValue={getOldDataId(equipment_id)}
                value={equipment_id && equipment_id.name ? equipment_id.name : getOldDataId(equipment_id)}
                open={equipmentOpen}
                onOpen={() => {
                  setEquipmentOpen(true);
                  setEquipmentKeyword('');
                }}
                onClose={() => {
                  setEquipmentOpen(false);
                  setEquipmentKeyword('');
                }}
                loading={equipmentInfo && equipmentInfo.loading}
                getOptionSelected={(option, value) => option.name === value.name}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                // renderOption={(option) => (
                //   <ListItemText
                //     {...props}
                //     primary={
                //       <>
                //         <Box >
                //           <Typography
                //             sx={{
                //               font: 'Suisse Intl',
                //               fontWeight: 500,
                //               fontSize: '15px',
                //             }}
                //           >
                //             {option.name}
                //           </Typography>
                //           <Box>
                //             <Typography
                //               sx={{
                //                 font: 'Suisse Intl',
                //                 fontSize: '12px',
                //               }}
                //             >
                //               {option.location_id ? option.location_id[1] : ''}
                //             </Typography>
                //           </Box>
                //         </Box>
                //       </>
                //     }
                //   />
                // )}
                options={equipmentOptions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    onChange={onEquipmentKeywordChange}
                    variant="standard"
                    label={equipmentId.label}
                    required
                    value={equipmentKeyword}
                    className="without-padding"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {equipmentInfo && equipmentInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                          <InputAdornment position="end">
                            {((getOldDataId(equipment_id)) || (equipment_id && equipment_id.id) || (equipmentKeyword && equipmentKeyword.length > 0)) && (
                              <Tooltip title="Clear" fontSize="small">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={onEquipmentKeywordClear}
                                >
                                  <IoCloseOutline size={22} fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                            <Tooltip title="Search" fontSize="small">
                              <IconButton
                                aria-label="toggle search visibility"
                                onClick={showEquipmentModal}
                              >
                                <SearchIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </InputAdornment>
                        </>
                      ),
                    }}
                  />
                )}
              />
            )}
          {type_category === 'asset'
            && (
              <Box
                sx={{
                  width: '48%',
                  marginTop: 'auto',
                  marginBottom: '10px',
                }}
              >
                <Typography
                  sx={{
                    font: 'normal normal normal 12px Suisse Intl',
                    letterSpacing: '0.63px',
                    color: '#000000',
                    marginBottom: '5px',
                    marginTop: '3px',
                    color: "rgba(0, 0, 0, 0.6) !important",
                  }}
                >
                  {assetId.label}
                  <span className="text-danger ml-2px">*</span>
                </Typography>
                <Cascader
                    options={preprocessData(spaceCascader && spaceCascader.length > 0 ? spaceCascader : [])}            
            dropdownClassName="custom-cascader-popup"
                  value={spaceCascader && spaceCascader.length > 0 ? checkDataType(asset_id) : []}
                  fieldNames={{ label: 'name', value: 'id', children: 'children' }}
                  onChange={onChange}
                  placeholder="Select Space"
                  dropdownRender={dropdownRender}
                  notFoundContent="No options"
                  className="thin-scrollbar bg-white mb-1 ml-1 w-100"
                  //loadData={loadData}
                  changeOnSelect
                />
              </Box>
            )}

          {configData.has_incident_type && configData.has_incident_type !== 'None' && (
            <MuiAutoComplete
              name={incidentTypeId.name}
              label={incidentTypeId.label}
              isRequired={configData.has_incident_type && configData.has_incident_type === 'Required'}
              sx={{
                width: '48%',
                marginTop: 'auto',
                marginBottom: '10px',
              }}
              oldValue={getOldDataId(incident_type_id)}
              value={incident_type_id && incident_type_id.name ? incident_type_id.name : getOldDataId(incident_type_id)}
              apiError={(hxTypes && hxTypes.err) ? generateErrorMessage(hxTypes) : false}
              open={typeOpen}
              onOpen={() => {
                setTypeOpen(true);
                setTypeKeyword('');
              }}
              onClose={() => {
                setTypeOpen(false);
                setTypeKeyword('');
              }}
              loading={hxTypes && hxTypes.loading}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={typesOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={(e) => setTypeKeyword(e.target.value)}
                  variant="standard"
                  value={typeKeyword}
                  label={incidentTypeId.label}
                  placeholder="Search & Select"
                  required={configData.has_incident_type && configData.has_incident_type === 'Required'}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {hxTypes && hxTypes.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        <InputAdornment position="end">
                          {((getOldDataId(incident_type_id)) || (incident_type_id && incident_type_id.id) || (typeKeyword && typeKeyword.length > 0)) && (
                            <Tooltip title="Clear" fontSize="small">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={onTypeClear}
                              >
                                <IoCloseOutline size={22} fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          <Tooltip title="Search" fontSize="small">
                            <IconButton
                              aria-label="toggle search visibility"
                              onClick={showTypeModal}
                            >
                              <SearchIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </InputAdornment>
                      </>
                    ),
                  }}
                />
              )}
            />
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
          {editId && (
            <MuiAutoComplete
              name={priorityId.name}
              label={priorityId.label}
              sx={{
                width: '48%',
                marginTop: 'auto',
                marginBottom: '10px',
              }}
              oldValue={getOldDataId(priority_id)}
              value={priority_id && priority_id.name ? priority_id.name : getOldDataId(priority_id)}
              apiError={(hxPriorities && hxPriorities.err) ? generateErrorMessage(hxSeverities) : false}
              open={priorityOpen}
              onOpen={() => {
                setPriorityOpen(true);
                setPriorityKeyword('');
              }}
              onClose={() => {
                setPriorityOpen(false);
                setPriorityKeyword('');
              }}
              loading={hxPriorities && hxPriorities.loading}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={priorityOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={(e) => setPriorityKeyword(e.target.value)}
                  variant="standard"
                  value={priorityKeyword}
                  label={priorityId.label}
                  placeholder="Search & Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {hxPriorities && hxPriorities.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        <InputAdornment position="end">
                          {((getOldDataId(priority_id)) || (priority_id && priority_id.id) || (priorityKeyword && priorityKeyword.length > 0)) && (
                            <Tooltip title="Clear" fontSize="small">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={onPriorityClear}
                              >
                                <IoCloseOutline size={22} fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          <Tooltip title="Search" fontSize="small">
                            <IconButton
                              aria-label="toggle search visibility"
                              onClick={showPriorityModal}
                            >
                              <SearchIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </InputAdornment>
                      </>
                    ),
                  }}
                />
              )}
            />
          )}
          {editId && (
            <MuiAutoComplete
              name={maintenanceTeamId.name}
              label={maintenanceTeamId.label}
              sx={{
                width: '48%',
                marginTop: 'auto',
                marginBottom: '10px',
              }}
              oldValue={getOldDataId(maintenance_team_id)}
              value={maintenance_team_id && maintenance_team_id.name ? maintenance_team_id.name : getOldDataId(maintenance_team_id)}
              apiError={(teamsInfo && teamsInfo.err) ? generateErrorMessage(teamsInfo) : false}
              open={teamOpen}
              onOpen={() => {
                setTeamOpen(true);
                setTeamKeyword('');
              }}
              onClose={() => {
                setTeamOpen(false);
                setTeamKeyword('');
              }}
              loading={teamsInfo && teamsInfo.loading}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={teamOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={(e) => setTeamKeyword(e.target.value)}
                  variant="standard"
                  label={maintenanceTeamId.label}
                  value={teamKeyword}
                  className={((getOldDataId(maintenance_team_id)) || (maintenance_team_id && maintenance_team_id.id) || (teamKeyword && teamKeyword.length > 0))
                    ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                  placeholder="Search & Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {teamsInfo && teamsInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        <InputAdornment position="end">
                          {((getOldDataId(maintenance_team_id)) || (maintenance_team_id && maintenance_team_id.id) || (teamKeyword && teamKeyword.length > 0)) && (
                            <Tooltip title="Clear" fontSize="small">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={onTeamClear}
                              >
                                <IoCloseOutline size={22} fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          <Tooltip title="Search" fontSize="small">
                            <IconButton
                              aria-label="toggle search visibility"
                              onClick={showTeamModal}
                            >
                              <SearchIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </InputAdornment>
                      </>
                    ),
                  }}
                />
              )}
            />
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
          {editId && (
            <FormControl
              sx={{
                width: '48%',
                marginTop: 'auto',
                marginBottom: '10px',
              }}
              variant="standard"
            >
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DateTimePicker
                  name={targetClosureDate.name}
                  label={targetClosureDate.label}
                  setFieldValue={setFieldValue}
                  setFieldTouched={setFieldTouched}
                  value={targetDate}
                  onChange={(date) => { setTargetDateChange(date); setFieldValue(targetClosureDate.name, date); }}
                  defaultValue={target_closure_date ? new Date(getDateTimeSeconds(target_closure_date)) : ''}
                  ampm={false}
                  disablePast
                  format="dd/MM/yyyy h:mm:ss a"
                />
              </MuiPickersUtilsProvider>
            </FormControl>
          )}
          {editId && (
            <MuiAutoComplete
              name="assigned_id"
              label="Assigned To"
              sx={{
                width: '48%',
                marginTop: 'auto',
                marginBottom: '10px',
              }}
              oldValue={getOldDataId(assigned_id)}
              value={assigned_id && assigned_id.name ? assigned_id.name : getOldDataId(assigned_id)}
              apiError={(teamMembers && teamMembers.err) ? generateErrorMessage(teamMembers) : false}
              open={teamMemberOpen}
              size="small"
              onOpen={() => {
                setTeamMemberOpen(true);
                setTeamMemberKeyword('');
              }}
              onClose={() => {
                setTeamMemberOpen(false);
                setTeamMemberKeyword('');
              }}
              loading={teamMembers && teamMembers.loading}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={teamMembersOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={(e) => setTeamMemberKeyword(e.target.value)}
                  variant="standard"
                  value={teamMemberKeyword}
                  label="Assigned To"
                  placeholder="Search & Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {teamMembers && teamMembers.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        <InputAdornment position="end">
                          {((getOldDataId(assigned_id)) || (assigned_id && assigned_id.id) || (teamMemberKeyword && teamMemberKeyword.length > 0)) && (
                            <Tooltip title="Clear" fontSize="small">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={onFacilityClear}
                              >
                                <IoCloseOutline size={22} fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          <Tooltip title="Search" fontSize="small">
                            <IconButton
                              aria-label="toggle search visibility"
                              onClick={showFacilityModal}
                            >
                              <SearchIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </InputAdornment>
                      </>
                    ),
                  }}
                />
              )}
            />
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
          <MuiTextarea
            sx={{
              width: '97%',
              marginBottom: '10px',
            }}
            name={description.name}
            label={description.label}
            setFieldValue={setFieldValue}
            variant="standard"
            value={values[description.name]}
            maxRows={4}
          />
        </Box>
        <Box
          sx={{
            width: '97%',
          }}
        >
          {!editId && configData.has_attachment_for_reporting && configData.has_attachment_for_reporting !== 'None' && (
            <FormGroup className="m-1">
              <UploadDocuments
                saveData={addIncidentInfo}
                labelName={configData.has_attachment_for_reporting === 'Required' ? 'Attachments * ' : 'Attachments'}
                model={appModels.EHSHAZARD}
                limit={5}
                uploadFileType="images"
              />
            </FormGroup>
          )}
        </Box>
      </Box >
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
      <Dialog size="lg" fullWidth open={extraModalTable}>
        <DialogHeader title="Severity Table" imagePath={false} onClose={() => { setExtraModalTable(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <SeverityTable
              afterReset={() => { setExtraModalTable(false); }}
              setFieldValue={setFieldValue}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Dialog size="lg" fullWidth open={extraModalHelp}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraModalHelp(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <SearchModalHelp
              categoryInfo=""
              modelName={modelValue}
              afterReset={() => { setExtraModalHelp(false); }}
              fieldName={fieldName}
              fields={columns}
              company={companyValue}
              otherFieldName={otherFieldName}
              otherFieldValue={otherFieldValue}
              modalName={modalName}
              setFieldValue={setFieldValue}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Dialog size="lg" fullWidth open={extraModalTeam}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraModalTeam(false); }} />
        <DialogContent>
          <SearchModalTeam
            modelName={modelValue}
            afterReset={() => { setExtraModalTeam(false); }}
            fieldName={fieldName}
            fields={columns}
            company={companyValue}
            placeholderName={placeholderName}
            setFieldValue={setFieldValue}
          />
        </DialogContent>
      </Dialog>
      <Dialog size="lg" fullWidth open={extraMultipleModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraMultipleModal(false); }} />
        <DialogContent>
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
          />
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
  isShow: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]).isRequired,
};

export default BasicForm;
