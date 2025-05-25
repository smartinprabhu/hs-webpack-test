/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable camelcase */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useFormikContext } from 'formik';
import { Box } from '@mui/system';
import {
  Typography, TextField, ListItemText,
  Dialog, DialogContent, DialogContentText,
} from '@mui/material';
import { Cascader, Divider } from 'antd';
import { Spinner } from 'reactstrap';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import { IoCloseOutline } from 'react-icons/io5';
import { CircularProgress } from '@material-ui/core';
import {
  faClock,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import ErrorContent from '@shared/errorContent';

import checkoutFormModel from '../formModel/checkoutFormModel';
import MuiAutoComplete from '../../commonComponents/formFields/muiAutocomplete';
import MuiTextarea from '../../commonComponents/formFields/muiTextarea';
import DialogHeader from '../../commonComponents/dialogHeader';
import {
  generateErrorMessage,
  getAllCompanies,
  generateArrayFromValue,
  arraySortByString,
  getTimeFromFloat,
  truncateHTMLTagsNew,
  preprocessData,
} from '../../util/appUtils';
import {
  getEquipmentList, getCascader,
  getSiteBasedCategory, getSpaceAllSearchList,
} from '../ticketService';
import {
  getBuildings, getAllSpaces,
} from '../../assets/equipmentService';
import { addParents, addChildrens } from '../utils/utils';
import SearchModal from './searchModal';
import { AddThemeColor } from '../../themes/theme';

const appModels = require('../../util/appModels').default;

const { formField } = checkoutFormModel;

const TicketAssetForm = (props) => {
  const {
    setFieldValue,
    reloadSpace,
    editId,
    isAIEnabled,
    type,
    equipment,
    values,
  } = props;
  const { values: formValues } = useFormikContext();
  const {
    company_id, type_category, asset_id,
    equipment_id, category_id, sub_category_id, custom_type, description,
  } = formValues;
  const dispatch = useDispatch();
  const [equipmentOpen, setEquipmentOpen] = useState(false);
  const [equipmentKeyword, setEquipmentKeyword] = useState('');
  const [cascaderValues, setCascaderValues] = useState([]);
  const [childValues, setChildValues] = useState([]);
  const [refresh, setRefresh] = useState(reloadSpace);
  const [ticketType, setTicketType] = useState('equipment');
  const [extraModal, setExtraModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [childLoad, setChildLoad] = useState(false);
  const [columns, setColumns] = useState(['id', 'name']);
  const [parentId, setParentId] = useState('');
  const [spaceId, setSpaceId] = useState(false);
  const [slaMsg, setSlaMsg] = useState(false);
  const [spaceCategoryId, setSpaceCategoryId] = useState('');

  const [subCategoryKeyword, setSubCategoryKeyword] = useState('');
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categoryKeyword, setCategoryKeyword] = useState('');
  const [subCategoryOpen, setSubCategoryOpen] = useState(false);

  const [spaceOpen, setSpaceOpen] = useState(false);

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
    equipmentInfo, spaceCascader,
    siteCategoriesInfo, spaceInfoList,
    maintenanceConfigurationData,
    ticketDetail, tenantConfig,
  } = useSelector((state) => state.ticket);
  const {
    buildingsInfo, buildingSpaces,
  } = useSelector((state) => state.equipment);

  const tenantSpaces = tenantConfig && tenantConfig.data && tenantConfig.data.length && tenantConfig.data[0].space_ids ? tenantConfig.data[0].space_ids : [];
  const tenantEquipments = tenantConfig && tenantConfig.data && tenantConfig.data.length && tenantConfig.data[0].equipment_ids ? tenantConfig.data[0].equipment_ids : [];

  const isITEnabled1 = userInfo && userInfo.data && userInfo.data.maintenance_setting
        && userInfo.data.maintenance_setting.enable_it_ticket ? userInfo.data.maintenance_setting.enable_it_ticket : false;

  const isITEnabled2 = maintenanceConfigurationData && !maintenanceConfigurationData.loading && maintenanceConfigurationData.data
        && maintenanceConfigurationData.data.length && maintenanceConfigurationData.data[0].is_enable_it_ticket;

  const isITEnabled = isAll ? isITEnabled2 : isITEnabled1;

  let equipmentOptions = [];
  let categoryOptions = [];
  let subCategoryOptions = [];
  let spaceOptions = [];
  const typeOptions = [{ name: 'equipment', value: 'Equipment' }, { name: 'asset', value: 'Space' }];
  if (!type && isITEnabled) {
    typeOptions.push({ name: 'IT', value: 'IT' });
  }
  const setIds = () => {
    const oldEqId = equipment_id && equipment_id.length ? equipment_id[1] : false;
    if (oldEqId) {
      dispatch(getEquipmentList(companies, appModels.EQUIPMENT, encodeURIComponent(oldEqId.trim())));
    }
    const oldAssetId = asset_id && asset_id.length === 0 ? asset_id[0] : asset_id && asset_id.length > 0 ? asset_id[1] : false;
    if (oldAssetId) {
      dispatch(getSpaceAllSearchList(companies, appModels.SPACE, encodeURIComponent(oldAssetId.trim())));
    }
  };

  const isTenantTicket = userInfo && userInfo.data && userInfo.data.associates_to && userInfo.data.associates_to === 'Tenant';

  function getFieldData(obj) {
    let res = false;
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
    if (editId && type_category !== 'IT' && !isTenantTicket) {
      if (asset_id && asset_id.length) {
        setFieldValue('asset_id', asset_id && asset_id.length ? [asset_id[1]] : []);
      }
    }
  }, [editId]);

  useEffect(() => {
    if (editId && description) {
      setFieldValue('description', truncateHTMLTagsNew(description));
    }
  }, [editId]);

  useEffect(() => {
    if (editId && type_category !== 'IT') {
      setIds();
    }
  }, [type_category]);

  useEffect(() => {
    if (editId && equipmentInfo && equipmentInfo.data && equipmentInfo.data.length && !spaceCategoryId && equipment_id && !equipment_id.id) {
      setFieldValue('equipment_id', equipmentInfo.data[0]);
      /* const catIdLoad = getFieldData(category_id);
            if (catIdLoad) {
                dispatch(getSiteBasedCategory(type_category, catIdLoad, type, companies));
            } */
    }
  }, [equipmentInfo]);

  /* useEffect(() => {
        if (editId && spaceInfoList && spaceInfoList.data && spaceInfoList.data.length && !spaceCategoryId && asset_id && !asset_id.id) {
            const catIdLoad = spaceInfoList.data[0].asset_category_id && spaceInfoList.data[0].asset_category_id.length ? spaceInfoList.data[0].asset_category_id[0] : false;
            setSpaceCategoryId(catIdLoad);
            if (catIdLoad) {
                dispatch(getSiteBasedCategory(type_category, catIdLoad, type, companies));
            }
        }
    }, [spaceInfoList]); */

  useEffect(() => {
    setRefresh(refresh);
  }, [refresh]);

  useEffect(() => {
    if (((company_id && company_id.id) || (company_id && company_id.length > 0)) && type_category === 'asset' && !isTenantTicket) {
      dispatch(getBuildings(companies, appModels.SPACE));
    }
  }, [type_category]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && type_category && (asset_id || equipment_id || type_category === 'IT') && categoryOpen) {
        const catId = spaceCategoryId;
        await dispatch(getSiteBasedCategory(type_category, catId, type, getCompanyId(company_id)));
      } else if (type_category === 'IT') {
        await dispatch(getSiteBasedCategory(type_category, false, type, getCompanyId(company_id)));
      }
    })();
  }, [userInfo, type_category, categoryOpen]);

  useEffect(() => {
    if (editId && type_category === 'asset' && custom_type === 'IT') {
      setFieldValue('type_category', 'IT');
    }
  }, [company_id]);

  useEffect(() => {
    if (editId && type_category === 'IT' && !isTenantTicket) {
      const defaultSpaceId = spaceCascader && spaceCascader.length && spaceCascader.length > 0 && spaceCascader[0].id ? [spaceCascader[0].id] : '';
      setFieldValue('asset_id', defaultSpaceId);
    }
  }, [type_category]);

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
    if ((equipment_id && equipment_id.category_id && equipment_id.category_id.length && equipment_id.category_id.length > 0)) {
      setSpaceCategoryId(equipment_id.category_id[0]);
    }
  }, [equipment_id]);

  useEffect(() => {
    if (((equipment_id && equipment_id.id) || (asset_id && asset_id.id)) && refresh === '1' && !editId) {
      setFieldValue('category_id', '');
      setFieldValue('sub_category_id', '');
    }
  }, [asset_id, equipment_id]);

  useEffect(() => {
    if (!editId && equipment && refresh === '1') {
      setFieldValue('equipment_id', equipment);
    }
  }, [editId, equipment]);

  useEffect(() => {
    if (childValues) {
      setCascaderValues(childValues);
    }
  }, [childValues]);

  useEffect(() => {
    if (cascaderValues && (refresh === '1' || childLoad)) {
      dispatch(getCascader(cascaderValues));
    }
  }, [cascaderValues, buildingSpaces, childLoad]);

  useEffect(() => {
    (async () => {
      if (type_category) {
        setTicketType(type_category);
      }
    })();
  }, [type_category]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && !isTenantTicket && equipmentOpen && ((company_id && company_id.id) || (company_id && company_id.length > 0))) {
        await dispatch(getEquipmentList(companies, appModels.EQUIPMENT, equipmentKeyword));
      }
    })();
  }, [userInfo, equipmentKeyword, equipmentOpen]);

  useEffect(() => {
    if (!editId) {
      if (type_category === 'IT' && siteCategoriesInfo && siteCategoriesInfo.data && !category_id && !sub_category_id) {
        // const defaultSpaceId = spaceCascader && spaceCascader.length && spaceCascader.length > 0 && spaceCascader[0].id ? [spaceCascader[0].id] : '';
        const defaultCategoryId = siteCategoriesInfo.data.length && siteCategoriesInfo.data.length > 0 && siteCategoriesInfo.data[0].id
          ? siteCategoriesInfo.data[0] : '';
        const subData = generateArrayFromValue(siteCategoriesInfo.data, 'id', siteCategoriesInfo.data.length > 0 ? siteCategoriesInfo.data[0].id : '');
        const defSubCatId = subData && subData.length ? subData[0].subcategory_ids[0] : '';
        // setFieldValue('channel', { value: 'web', label: 'Web' });
        // setFieldValue('issue_type', { value: 'request', label: 'Request' });
        setFieldValue('category_id', defaultCategoryId);
        setFieldValue('sub_category_id', defSubCatId);
      }
    } else if (editId && type_category === 'IT' && !isTenantTicket) {
      const defaultSpaceId = spaceCascader && spaceCascader.length && spaceCascader.length > 0 && spaceCascader[0].id ? [spaceCascader[0].id] : '';
      setFieldValue('asset_id', defaultSpaceId);
    }
  }, [siteCategoriesInfo]);

  const showEquipmentModal = () => {
    setModelValue(appModels.EQUIPMENT);
    setFieldName('equipment_id');
    setModalName('Equipments');
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setColumns(['id', 'name', 'location_id', 'serial', 'brand', 'category_id', 'maintenance_team_id', 'equipment_seq']);
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setExtraModal(true);
  };

  const showCategoryModal = () => {
    if (spaceCategoryId) {
      dispatch(getSiteBasedCategory(type_category, spaceCategoryId, type, getCompanyId(company_id)));
    } else if (type_category === 'IT') {
      dispatch(getSiteBasedCategory(type_category, false, type, getCompanyId(company_id)));
    }
    setFieldName('category_id');
    setModalName('Problem Category');
    setCompanyValue(userInfo && userInfo.data ? getCompanyId(company_id) : '');
    setColumns(['category_id']);
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setExtraModal(true);
  };

  const onEquipmentKeywordClear = () => {
    setEquipmentKeyword(null);
    setFieldValue('equipment_id', '');
    setFieldValue('category_id', '');
    setFieldValue('sub_category_id', '');
    setEquipmentOpen(false);
  };

  const onKeywordChange = (event) => {
    setCategoryKeyword(event.target.value);
  };
  const onSubKeywordChange = (event) => {
    setSubCategoryKeyword(event.target.value);
  };

  const onSubCategoryKeywordClear = () => {
    setSubCategoryKeyword(null);
    setFieldValue('sub_category_id', '');
    setFieldValue('priority_id', '');
    setFieldValue('maintenance_team_id', '');
    setFieldValue('incident_severity_id', '');
    setSubCategoryOpen(false);
  };

  const onCategoryKeywordClear = () => {
    setCategoryKeyword(null);
    setFieldValue('category_id', '');
    setFieldValue('sub_category_id', '');
    setFieldValue('priority_id', '');
    setFieldValue('maintenance_team_id', '');
    setFieldValue('incident_severity_id', '');
    setCategoryOpen(false);
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
      setFieldValue('category_id', '');
      setFieldValue('sub_category_id', '');
    }
    setFieldValue('asset_id', value);
  };

  const isUserError = userInfo && userInfo.err;
  const loading = (userInfo && userInfo.loading) || (buildingsInfo && buildingsInfo.loading) || (buildingSpaces && buildingSpaces.loading);
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (buildingsInfo && buildingsInfo.err) ? generateErrorMessage(buildingsInfo) : userErrorMsg;
  const errorMsg1 = (buildingSpaces && buildingSpaces.err) ? generateErrorMessage(buildingSpaces) : userErrorMsg;

  const loadData = () => { };

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

  const onEquipmentKeywordChange = (event) => {
    setEquipmentKeyword(event.target.value);
  };

  if (equipmentInfo && equipmentInfo.loading) {
    equipmentOptions = [{ name: 'Loading..' }];
  }
  if (equipment_id && equipment_id.length && equipment_id.length > 0) {
    const oldId = [{ id: equipment_id[0], name: equipment_id[1] }];
    const newArr = [...equipmentOptions, ...oldId];
    equipmentOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  if (equipmentInfo && equipmentInfo.data) {
    const arr = [...equipmentOptions, ...equipmentInfo.data];
    equipmentOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }

  if (equipmentInfo && equipmentInfo.err) {
    equipmentOptions = [];
  }
  if (spaceInfoList && spaceInfoList.loading) {
    spaceOptions = [{ name: 'Loading..' }];
  }
  if (asset_id && asset_id.length && asset_id.length > 0) {
    const oldId = [{ id: asset_id[0], name: asset_id[1] }];
    const newArr = [...spaceOptions, ...oldId];
    spaceOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  if (spaceInfoList && spaceInfoList.data) {
    const arr = [...spaceOptions, ...spaceInfoList.data];
    spaceOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }

  if (spaceInfoList && spaceInfoList.err) {
    spaceOptions = [];
  }

  if (siteCategoriesInfo && siteCategoriesInfo.loading) {
    categoryOptions = [{ name: 'Loading..' }];
  }
  if (category_id && category_id.length && category_id.length > 0) {
    const oldId = [{ id: category_id[0], name: category_id[1] }];
    const newArr = [...categoryOptions, ...oldId];
    categoryOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
    categoryOptions = arraySortByString(categoryOptions, 'name');
  }

  if (siteCategoriesInfo && siteCategoriesInfo.data && siteCategoriesInfo.data.length) {
    siteCategoriesInfo.data = siteCategoriesInfo.data.filter((categ) => {
      if (categ && Object.keys(categ).find((key) => key === 'is_incident')) {
        return categ.is_incident === false;
      } return categ;
    });

    const arr = [...categoryOptions, ...siteCategoriesInfo.data];
    categoryOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
    categoryOptions = arraySortByString(categoryOptions, 'name');
  }
  if (siteCategoriesInfo && siteCategoriesInfo.err) {
    categoryOptions = [];
  }

  if (siteCategoriesInfo && siteCategoriesInfo.loading) {
    subCategoryOptions = [{ name: 'Loading..' }];
  }

  if (sub_category_id && sub_category_id.length && sub_category_id.length > 0) {
    const oldId = [{ id: sub_category_id[0], name: sub_category_id[1] }];
    const newArr = [...subCategoryOptions, ...oldId];
    subCategoryOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
    subCategoryOptions = arraySortByString(subCategoryOptions, 'name');
  }
  if (siteCategoriesInfo && siteCategoriesInfo.data && getFieldData(category_id)) {
    const subData = generateArrayFromValue(siteCategoriesInfo.data, 'id', getFieldData(category_id));
    let loadedSubData = [];
    if (!type && type_category !== 'IT') {
      loadedSubData = subData && subData.length ? subData[0].sub_category_id : [];
    } else {
      loadedSubData = subData && subData.length ? subData[0].subcategory_ids : [];
    }
    if (loadedSubData) {
      const arr = [...subCategoryOptions, ...loadedSubData];
      subCategoryOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
      subCategoryOptions = arraySortByString(subCategoryOptions, 'name');
    }
  }
  if (siteCategoriesInfo && siteCategoriesInfo.err) {
    subCategoryOptions = [];
  }

  const resetEquipment = () => {
    if (!(!editId && equipment)) {
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

  const oldEquipId = equipment_id && equipment_id.length && equipment_id.length > 0 ? equipment_id[1] : '';
  const oldCatId = category_id && category_id.length && category_id.length > 0 ? category_id[1] : '';
  const oldSpaceId = asset_id && asset_id.length && asset_id.length > 0 ? asset_id[1] : '';
  const oldSubCatId = sub_category_id && sub_category_id.length && sub_category_id.length > 0 ? sub_category_id[1] : '';

  const typeInfo = (
    <div>
      <p>i) To report Facility equipment issues select &prime; Equipment &prime; as Type and select a relevant equipment.</p>
      <p>ii) To report general facility issues select &prime; Space &prime; as Type and select a relevant space.</p>
      {isITEnabled && (<p>iii) To report IT related issues select &prime; IT &prime;.</p>)}
      <p>
        {isITEnabled ? 'iv' : 'iii'}
        ) Select a relevant Category and Subcategory.
      </p>
    </div>
  );

  const detailedData = ticketDetail && ticketDetail.data && ticketDetail.data.length
    ? ticketDetail.data[0]
    : '';

  useEffect(() => {
    if (category_id && category_id.name) {
      setCategoryKeyword(category_id.name);
    }
  }, [category_id]);

  useEffect(() => {
    if (editId) {
      const newCategory = category_id && category_id.id;
      const oldCategory = detailedData && detailedData.category_id && detailedData.category_id.length && detailedData.category_id[0];
      const newSubCategory = sub_category_id && sub_category_id.id;
      const oldSubCategory = detailedData && detailedData.sub_category_id && detailedData.sub_category_id.length && detailedData.sub_category_id[0];
      if ((newCategory && newCategory !== oldCategory) || (newSubCategory && newSubCategory !== oldSubCategory)) {
        setSlaMsg(true);
      } else {
        setSlaMsg(false);
      }
    } else {
      setSlaMsg(false);
    }
  }, [category_id, sub_category_id]);

  const makeCategoryNormalDisable = () => {
    if (type_category === 'equipment' && !equipment_id) {
      return true;
    }
    if (type_category === 'asset' && (!asset_id || (asset_id && !asset_id.length))) {
      return true;
    }
    if (editId && !(detailedData && detailedData.state_id && detailedData.state_id.length && (detailedData.state_id[1] === 'Open' || detailedData.state_id[1] === 'In Progress'))) {
      return true;
    }
    return false;
  };

  const makeCategoryTenantDisable = () => {
    if (type_category === 'equipment' && !equipment_id) {
      return true;
    }
    if (type_category === 'asset' && !((asset_id && asset_id.id) || (asset_id && asset_id.length))) {
      return true;
    }
    if (editId && !(detailedData && detailedData.state_id && detailedData.state_id.length && (detailedData.state_id[1] === 'Open' || detailedData.state_id[1] === 'In Progress'))) {
      return true;
    }
    return false;
  };

  const makeCategoryDisable = () => {
    if (isTenantTicket) {
      return makeCategoryTenantDisable();
    }
    return makeCategoryNormalDisable();
  };

  const makeSubCategoryDisable = () => {
    if (editId && !(detailedData && detailedData.state_id && detailedData.state_id.length && (detailedData.state_id[1] === 'Open' || detailedData.state_id[1] === 'In Progress'))) {
      return true;
    }
    return false;
  };
  const defaultValue = () => {
    if (type_category === 'equipment') {
      return typeOptions[0];
    } if (type_category === 'asset') {
      return typeOptions[1];
    } if (type_category === 'IT') {
      return typeOptions[2];
    }
  };
  const [typeCategoryOption, setTypeCategoryOption] = useState(defaultValue());

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
        Asset Information
      </Typography>
      <MuiAutoComplete
        sx={{
          marginTop: 'auto',
          marginBottom: '10px',
        }}
        options={typeOptions}
        name="TypeCategory"
        label={formField.typeCategory.label}
        getOptionSelected={(option, value) => option.value === value.value}
        getOptionLabel={(option) => (typeof option === 'string' ? option : option.value)}
        onChange={(e, option) => {
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
            label={(
              <>
                <span className="font-family-tab">{formField.typeCategory.label}</span>
                {' '}
                <span className="text-danger text-bold">*</span>
              </>
            )}
            variant="standard"
          />
        )}
      />
      {ticketType === 'equipment' ? (
        <MuiAutoComplete
          sx={{
            marginTop: 'auto',
            marginBottom: '10px',
          }}
          name={formField.equipmentId.name}
          label={formField.equipmentId.label}
          disabled={(!editId && equipment)}
          oldValue={oldEquipId}
          value={equipment_id && equipment_id.name ? equipment_id.name : oldEquipId}
          open={equipmentOpen}
          onOpen={() => {
            setEquipmentOpen(true);
            setEquipmentKeyword('');
          }}
          onClose={() => {
            setEquipmentOpen(false);
            setEquipmentKeyword('');
          }}
          apiError={(equipmentInfo && equipmentInfo.err) ? generateErrorMessage(equipmentInfo) : false}
          loading={equipmentInfo && equipmentInfo.loading}
          getOptionSelected={(option, value) => option.name === value.name}
          getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
          options={isTenantTicket ? tenantEquipments : equipmentOptions}
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
                      {option.name}
                      {option.brand && (
                        <>
                          {'  '}
                          |
                          <span className="ml-1">{option.brand}</span>
                        </>
                      )}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        font: 'Suisse Intl',
                        fontSize: '12px',
                      }}
                    >
                      {option?.location_id?.[1]}
                    </Typography>
                  </Box>
                </>
                            )}
            />
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              onChange={onEquipmentKeywordChange}
              variant="standard"
              className="without-padding custom-icons"
              label={(
                <>
                  <span className="font-family-tab">{formField.equipmentId.label}</span>
                  {' '}
                  <span className="text-danger text-bold">*</span>
                </>
              )}
              value={equipmentKeyword}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {!isTenantTicket && equipmentInfo && equipmentInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                    <InputAdornment position="end">
                      {!(!editId && equipment) && ((oldEquipId) || (equipment_id && equipment_id.id) || (equipmentKeyword && equipmentKeyword.length > 0)) && (
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={onEquipmentKeywordClear}
                        >
                          <IoCloseOutline size={22} fontSize="small" />
                        </IconButton>
                      )}
                      {!isTenantTicket && (
                      <IconButton
                        aria-label="toggle search visibility"
                        onClick={showEquipmentModal}
                      >
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
      ) : ''}
      {ticketType === 'asset' ? (
        <>
          {!isTenantTicket ? (
            <>
              <span className="pb-1">
                {formField.assetId.label}
              </span>
              <br />
              <Cascader
                options={preprocessData(spaceCascader && spaceCascader.length > 0 ? spaceCascader : [])}
                dropdownClassName="custom-cascader-popup"
                value={spaceCascader && spaceCascader.length > 0
                  ? asset_id : []}
                fieldNames={{ label: 'name', value: 'id', children: 'children' }}
                onChange={onChange}
                placeholder="Select Space"
                dropdownRender={dropdownRender}
                notFoundContent="No options"
                className="thin-scrollbar bg-white mb-3 pb-1 w-100"
            // loadData={loadData}
                changeOnSelect
              />
            </>
          ) : (
            <MuiAutoComplete
              sx={{
                marginTop: 'auto',
                marginBottom: '10px',
              }}
              options={tenantSpaces}
              name={formField.assetId.name}
              label={formField.assetId.label}
              open={spaceOpen}
              oldValue={oldSpaceId}
              value={asset_id && asset_id.path_name ? asset_id.path_name : oldSpaceId}
              onOpen={() => setSpaceOpen(true)}
              onClose={() => setSpaceOpen(false)}
              getOptionSelected={(option, value) => option.path_name === value.path_name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.path_name)}
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
                          {option.space_name}
                          {option.sequence_asset_hierarchy && (
                            <>
                              {'  '}
                              |
                              <span className="ml-1">{option.sequence_asset_hierarchy}</span>
                            </>
                          )}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography
                          sx={{
                            font: 'Suisse Intl',
                            fontSize: '12px',
                          }}
                        >
                          {option?.asset_category_id?.name}
                        </Typography>
                      </Box>
                    </>
                                )}
                />
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={(
                    <>
                      <span className="font-family-tab">{formField.assetId.label}</span>
                      {' '}
                      <span className="text-danger text-bold">*</span>
                    </>
                       )}
                  variant="standard"
                />
              )}
            />
          )}
        </>
      ) : ''}
      <MuiAutoComplete
        sx={{
          marginTop: 'auto',
          marginBottom: '10px',
        }}
        name={formField.categoryId.name}
        label={formField.categoryId.label}
        isRequired
        open={categoryOpen}
        disabled={makeCategoryDisable()}
        oldvalue={oldCatId}
        value={category_id && category_id.cat_display_name ? category_id.cat_display_name : category_id.name ? category_id.name : oldCatId}
        apiError={(siteCategoriesInfo && siteCategoriesInfo.err) ? generateErrorMessage(siteCategoriesInfo) : false}
        onOpen={() => {
          setRefresh('1');
          setCategoryOpen(true);
          setCategoryKeyword('');
        }}
        onClose={() => {
          setCategoryOpen(false);
          setCategoryKeyword('');
        }}
        getOptionDisabled={() => siteCategoriesInfo && siteCategoriesInfo.loading}
        getOptionSelected={(option, value) => (option.cat_display_name ? option.cat_display_name === value.cat_display_name : option.name === value.name)}
        getOptionLabel={(option) => (typeof option === 'string' ? option : option.cat_display_name ? option.cat_display_name : option.name)}
        options={categoryOptions}
        renderInput={(params) => (
          <TextField
            {...params}
            onChange={() => onKeywordChange()}
            label={(
              <>
                <span className="font-family-tab">{formField.categoryId.label}</span>
                {' '}
                <span className="text-danger text-bold">*</span>
              </>
            )}
            value={category_id && category_id.category_id ? category_id.category_id : categoryKeyword}
            variant="standard"
            className="without-padding custom-icons"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {siteCategoriesInfo && siteCategoriesInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}

                  <InputAdornment position="end">
                    {!makeCategoryDisable() && ((oldCatId) || (category_id && category_id.id) || (categoryKeyword && categoryKeyword.length > 0)) && (

                    <IconButton
                      aria-label="toggle password visibility"
                    >
                      <IoCloseOutline size={22} fontSize="small" onClick={onCategoryKeywordClear} />
                    </IconButton>
                    )}
                    {!makeCategoryDisable() && (
                    <IconButton
                      aria-label="toggle search visibility"
                    >
                      <SearchIcon fontSize="small" onClick={showCategoryModal} disabled={makeCategoryDisable()} />
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
          marginTop: 'auto',
          marginBottom: '10px',
        }}
        name={formField.subCategorId.name}
        label={formField.subCategorId.label}
        isRequired
        disabled={!((category_id && category_id.id) || (oldCatId)) || makeSubCategoryDisable()}
        open={subCategoryOpen}
        oldvalue={oldSubCatId}
        value={sub_category_id && sub_category_id.sub_cat_display_name ? sub_category_id.sub_cat_display_name : sub_category_id.name ? sub_category_id.name : oldSubCatId}
        onOpen={() => {
          setRefresh('1');
          setSubCategoryOpen(true);
          setSubCategoryKeyword('');
        }}
        onClose={() => {
          setSubCategoryOpen(false);
          setSubCategoryKeyword('');
        }}
        apiError={(siteCategoriesInfo && siteCategoriesInfo.err) ? generateErrorMessage(siteCategoriesInfo) : false}
        loading={siteCategoriesInfo && siteCategoriesInfo.loading}
        getOptionSelected={(option, value) => (option.sub_cat_display_name ? option.sub_cat_display_name === value.sub_cat_display_name : option.name === value.name)}
        getOptionLabel={(option) => (typeof option === 'string' ? option : option.sub_cat_display_name ? option.sub_cat_display_name : option.name)}
        options={subCategoryOptions}
        renderInput={(params) => (
          <>
            <TextField
              {...params}
              onChange={onSubKeywordChange}
              variant="standard"
              label={(
                <>
                  <span className="font-family-tab">{formField.subCategorId.label}</span>
                  {' '}
                  <span className="text-danger text-bold">*</span>
                </>
              )}
            />
            {sub_category_id?.sla_timer && (
            <Typography sx={{ fontFamily: 'Suisse Intl' }}>
              <small className="mt-2 text-info">
                <FontAwesomeIcon className="mr-1" size="sm" icon={faClock} />
                <b>
                  SLA-Time:
                  {' '}
                  {getTimeFromFloat(sub_category_id.sla_timer)}
                </b>
              </small>
            </Typography>
            )}
            {slaMsg && (
            <Typography sx={{ fontFamily: 'Suisse Intl' }}>
              <small className="mt-2 text-info">
                <FontAwesomeIcon className="mr-1" size="sm" icon={faInfoCircle} />
                <b>
                  By updating the category/sub category in the ticket,SLA end time would be affected.
                </b>
              </small>
            </Typography>
            )}
          </>
        )}
      />
      {/* <MuiTextField
                sx={{
                    marginTop: "auto",
                    marginBottom: "10px",
                }}
                name={formField.Description.name}
                label={formField.Description.label}
                variant="standard"
                multiline={true}
                setFieldValue={setFieldValue}
                value={values[formField.Description.name]}
            // inputProps={{ maxLength: 150 }}
            /> */}
      <MuiTextarea
        sx={{
          marginTop: 'auto',
          marginBottom: '10px',
        }}
        name={formField.Description.name}
        label={formField.Description.label}
        variant="standard"
        setFieldValue={setFieldValue}
        value={values[formField.Description.name]}
        isAI={isAIEnabled}
      />
      <Dialog size="xl" fullWidth open={extraModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraModal(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <SearchModal
              categoryInfo={fieldName === 'category_id' ? siteCategoriesInfo : ''}
              modelName={modelValue}
              afterReset={() => { setExtraModal(false); }}
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
    </Box>
  );
};
export default TicketAssetForm;
