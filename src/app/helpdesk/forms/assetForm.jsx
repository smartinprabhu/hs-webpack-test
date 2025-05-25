/* eslint-disable react/forbid-prop-types */
/* eslint-disable prefer-destructuring */
/* eslint-disable camelcase */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { TextField, CircularProgress, FormHelperText } from '@material-ui/core';
import {
  Row, Col, Label,
  Modal,
  ModalBody, Spinner,
} from 'reactstrap';
import { useFormikContext } from 'formik';
import { ThemeProvider, makeStyles } from '@material-ui/core/styles';
import { createFilterOptions } from '@material-ui/lab/Autocomplete';
import { Cascader, Divider, Tooltip } from 'antd';
import 'antd/dist/antd.css';

import {
  faInfoCircle, faClock,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import { CheckboxFieldGroup, FormikAutocomplete } from '@shared/formFields';
import ErrorContent from '@shared/errorContent';
import {
  generateErrorMessage,
  getAllCompanies,
  generateArrayFromValue,
  arraySortByString,
  extractOptionsObject,
} from '../../util/appUtils';
import {
  getEquipmentList, getCascader,
  getSiteBasedCategory, getSpaceAllSearchList,
} from '../ticketService';
import {
  getBuildings, getAllSpaces,
} from '../../assets/equipmentService';
import theme from '../../util/materialTheme';
import { addParents, addChildrens, getTimeFromFloat } from '../utils/utils';
import SearchModal from './searchModal';

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

const AssetForm = (props) => {
  const {
    setFieldValue,
    reloadSpace,
    editId,
    type,
    equipment,
    isIncident,
    formField: {
      typeCategory,
      equipmentId,
      assetId,
      categoryId,
      subCategorId,
    },
  } = props;
  const { values: formValues } = useFormikContext();
  const {
    company_id, type_category, asset_id,
    equipment_id, category_id, sub_category_id, custom_type,
  } = formValues;
  const dispatch = useDispatch();
  const classes = useStyles();
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
  const [spaceCategoryId, setSpaceCategoryId] = useState('');

  const [subCategoryKeyword, setSubCategoryKeyword] = useState('');
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categoryKeyword, setCategoryKeyword] = useState('');
  const [subCategoryOpen, setSubCategoryOpen] = useState(false);

  // const [equipmentOptions, setEquipmentOptions] = useState([]);

  const { userInfo, userRoles } = useSelector((state) => state.user);

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
    equipmentInfo, spaceCascader,
    siteCategoriesInfo, spaceInfoList,
    maintenanceConfigurationData,
  } = useSelector((state) => state.ticket);
  const {
    buildingsInfo, buildingSpaces,
  } = useSelector((state) => state.equipment);

  const filterOptions = createFilterOptions({
    matchFrom: 'any',
    stringify: (option) => option.name + option.serial,
  });

  const isITEnabled1 = userInfo && userInfo.data && userInfo.data.maintenance_setting
    && userInfo.data.maintenance_setting.enable_it_ticket ? userInfo.data.maintenance_setting.enable_it_ticket : false;

  const isITEnabled2 = maintenanceConfigurationData && !maintenanceConfigurationData.loading && maintenanceConfigurationData.data
    && maintenanceConfigurationData.data.length > 0 && maintenanceConfigurationData.data[0].is_enable_it_ticket;

  const isITEnabled = isAll ? isITEnabled2 : isITEnabled1;

  // let equipmentOptions = [];
  let categoryOptions = [];
  let subCategoryOptions = [];

  function getCurrentCompanyId() {
    let res = false;
    if (company_id && company_id.id) {
      if (company_id.category && company_id.category.id && company_id.category.name === 'Company') {
        res = companies;
      } else {
        res = company_id.id;
      }
    } else if (company_id && company_id.length) {
      res = company_id[0];
    }
    return res;
  }

  function getCurrentCompanyIds() {
    let res = false;
    if (company_id && company_id.id) {
      res = company_id.id;
    } else if (company_id && company_id.length) {
      res = company_id[0];
    }
    return res;
  }

  const setIds = () => {
    const oldEqId = equipment_id && equipment_id.length ? equipment_id[1] : false;
    if (oldEqId) {
      dispatch(getEquipmentList(getCurrentCompanyId(), appModels.EQUIPMENT, encodeURIComponent(oldEqId.trim())));
    }
    const oldAssetId = asset_id && asset_id.length ? asset_id[1] : false;
    if (oldAssetId) {
      dispatch(getSpaceAllSearchList(getCurrentCompanyId(), appModels.SPACE, encodeURIComponent(oldAssetId.trim())));
    }
  };

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
    if (editId && type_category !== 'IT') {
      setIds();
    }
  }, [type_category]);

  useEffect(() => {
    if (!editId && equipmentInfo && equipmentInfo.data && equipmentInfo.data.length && !spaceCategoryId && equipment_id && !equipment_id.id) {
      setFieldValue('equipment_id', equipmentInfo.data[0]);
      /* const catIdLoad = getFieldData(category_id);
      if (catIdLoad) {
        dispatch(getSiteBasedCategory(type_category, catIdLoad, type, getCurrentCompanyIds()));
      } */
    }
  }, [equipmentInfo]);

  /* useEffect(() => {
    if (editId && spaceInfoList && spaceInfoList.data && spaceInfoList.data.length && !spaceCategoryId && asset_id && !asset_id.id) {
      /* const catIdLoad = spaceInfoList.data[0].asset_category_id && spaceInfoList.data[0].asset_category_id.length ? spaceInfoList.data[0].asset_category_id[0] : false;
      setSpaceCategoryId(catIdLoad);
      if (catIdLoad) {
        dispatch(getSiteBasedCategory(type_category, catIdLoad, type, getCurrentCompanyIds()));
      }
    }
  }, [spaceInfoList]); */

  useEffect(() => {
    setRefresh(refresh);
  }, [refresh]);

  useEffect(() => {
    if (((company_id && company_id.id) || (company_id && company_id.length > 0)) && type_category === 'asset') {
      dispatch(getBuildings(getCurrentCompanyId(), appModels.SPACE));
    }
  }, [type_category]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && type_category && (asset_id || equipment_id || type_category === 'IT') && categoryOpen) {
        const catId = spaceCategoryId;
        await dispatch(getSiteBasedCategory(type_category, catId, type, getCurrentCompanyIds()));
      } else if (type_category === 'IT') {
        await dispatch(getSiteBasedCategory(type_category, false, type, getCurrentCompanyIds()));
      }
    })();
  }, [userInfo, type_category, categoryOpen]);

  useEffect(() => {
    if (editId && type_category === 'asset' && custom_type === 'IT') {
      setFieldValue('type_category', 'IT');
    }
  }, [company_id]);

  useEffect(() => {
    if (editId && type_category === 'IT') {
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
      if (userInfo && userInfo.data && equipmentOpen && ((company_id && company_id.id) || (company_id && company_id.length > 0))) {
        await dispatch(getEquipmentList(getCurrentCompanyId(), appModels.EQUIPMENT, equipmentKeyword));
      }
    })();
  }, [userInfo, equipmentKeyword, equipmentOpen]);

  /* useEffect(() => {
    if (equipmentInfo) {
      setEquipmentOptions(extractOptionsObject(equipmentInfo, equipment_id));
    }
  }, [equipmentInfo]); */

  const equipmentOptions = extractOptionsObject(equipmentInfo, equipment_id);

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
    } else if (editId && type_category === 'IT') {
      const defaultSpaceId = spaceCascader && spaceCascader.length && spaceCascader.length > 0 && spaceCascader[0].id ? [spaceCascader[0].id] : '';
      setFieldValue('asset_id', defaultSpaceId);
    }
  }, [siteCategoriesInfo]);

  const showEquipmentModal = () => {
    setModelValue(appModels.EQUIPMENT);
    setFieldName('equipment_id');
    setModalName('Equipments');
    setCompanyValue(userInfo && userInfo.data ? getCurrentCompanyId() : '');
    setColumns(['id', 'name', 'location_id', 'serial', 'category_id', 'maintenance_team_id']);
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setExtraModal(true);
  };

  const showCategoryModal = () => {
    if (spaceCategoryId) {
      dispatch(getSiteBasedCategory(type_category, spaceCategoryId, type, getCurrentCompanyIds()));
    } else if (type_category === 'IT') {
      dispatch(getSiteBasedCategory(type_category, false, type, getCurrentCompanyIds()));
    }
    setFieldName('category_id');
    setModalName('Problem Category');
    setCompanyValue(userInfo && userInfo.data ? getCurrentCompanyIds() : '');
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
          dispatch(getAllSpaces(selectedOptions[0].id, getCurrentCompanyIds()));
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

  /* if (equipmentInfo && equipmentInfo.loading) {
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
  } */

  console.log(equipmentOptions);

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

  useEffect(() => {
    if (category_id && category_id.name) {
      setCategoryKeyword(category_id.name);
    }
  }, [category_id]);

  const makeCategoryDisable = () => {
    if (type_category === 'equipment' && !equipment_id) {
      return true;
    } if (type_category === 'asset' && (!asset_id || (asset_id && !asset_id.length))) {
      return true;
    }
    return false;
  };

  const categoryAndSub = (
    <>
      <Col xs={12} sm={12} md={12} lg={12}>
        <FormikAutocomplete
          name={categoryId.name}
          label={categoryId.label}
          isRequired
          labelClassName="mb-1"
          formGroupClassName="mb-1 w-100"
          open={categoryOpen}
          disabled={makeCategoryDisable()}
          size="small"
          oldvalue={oldCatId}
          value={category_id && category_id.cat_display_name ? category_id.cat_display_name : category_id.name ? category_id.name : oldCatId}
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
              variant="outlined"
              value={category_id && category_id.category_id ? category_id.category_id : categoryKeyword}
              className={((oldCatId) || (category_id && category_id.id) || (categoryKeyword && categoryKeyword.length > 0))
                ? 'input-small-custom without-padding custom-icons' : 'input-small-custom without-padding custom-icons2'}
              placeholder="Select"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {siteCategoriesInfo && siteCategoriesInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                    {/* <InputAdornment position="end">
                      {((oldCatId) || (category_id && category_id.id) || (categoryKeyword && categoryKeyword.length > 0)) && (
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={onCategoryKeywordClear}
                      >
                        <BackspaceIcon fontSize="small" />
                      </IconButton>
                      )}
                    </InputAdornment> */}
                    <InputAdornment position="end">
                      {((oldCatId) || (category_id && category_id.id) || (categoryKeyword && categoryKeyword.length > 0)) && (
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={onCategoryKeywordClear}
                        >
                          <BackspaceIcon fontSize="small" />
                        </IconButton>
                      )}
                      <IconButton
                        aria-label="toggle search visibility"
                        onClick={showCategoryModal}
                        disabled={makeCategoryDisable()}
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
        {(siteCategoriesInfo && siteCategoriesInfo.err && categoryOpen) && (<FormHelperText><span className="text-danger">{generateErrorMessage(siteCategoriesInfo)}</span></FormHelperText>)}
      </Col>
      <Col xs={12} sm={12} md={12} lg={12}>
        <FormikAutocomplete
          name={subCategorId.name}
          label={subCategorId.label}
          isRequired
          disabled={!((category_id && category_id.id) || (oldCatId))}
          labelClassName="mb-1"
          formGroupClassName="mb-1 w-100"
          open={subCategoryOpen}
          size="small"
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
          loading={siteCategoriesInfo && siteCategoriesInfo.loading}
          getOptionSelected={(option, value) => (option.sub_cat_display_name ? option.sub_cat_display_name === value.sub_cat_display_name : option.name === value.name)}
          getOptionLabel={(option) => (typeof option === 'string' ? option : option.sub_cat_display_name ? option.sub_cat_display_name : option.name)}
          options={subCategoryOptions}
          renderInput={(params) => (
            <TextField
              {...params}
              onChange={onSubKeywordChange}
              variant="outlined"
              className={((oldSubCatId) || (sub_category_id && sub_category_id.id) || (subCategoryKeyword && subCategoryKeyword.length > 0))

                ? 'input-small-custom without-padding custom-icons' : 'input-small-custom without-padding custom-icons2'}
              placeholder="Select"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {siteCategoriesInfo && siteCategoriesInfo.loading && subCategoryOpen ? <CircularProgress color="inherit" size={20} /> : null}
                    <InputAdornment position="end">
                      {((oldSubCatId) || (sub_category_id && sub_category_id.id) || (subCategoryKeyword && subCategoryKeyword.length > 0)) && (
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={onSubCategoryKeywordClear}
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
        {(siteCategoriesInfo && siteCategoriesInfo.err && subCategoryOpen)
          && (
            <FormHelperText>
              <span className="text-danger">
                {generateErrorMessage(siteCategoriesInfo)}
              </span>
            </FormHelperText>
          )}
      </Col>
      {!isIncident && sub_category_id?.sla_timer && (
        <p>
          <small className="ml-3 text-info">
            <FontAwesomeIcon className="mr-1" size="sm" icon={faClock} />
            <b>
              SLA-Time:
              {' '}
              {getTimeFromFloat(sub_category_id.sla_timer)}
            </b>
          </small>
        </p>
      )}
    </>
  );

  return (
    <>
      <span className="d-inline-block pb-1 font-17 mb-2 font-weight-800">Asset Information</span>
      <ThemeProvider theme={theme}>
        <Row className={!editId ? 'mb-3 AssetForm-card' : 'AssetForm-card'}>
          <Col xs={12} sm={12} md={12} lg={12} className="ml-0 pl-0 AssetForm-card-inputs">
            <Col xs={12} sm={12} md={12} lg={12}>
              <Label for={typeCategory.name} className="m-0">
                Type
                <span className="ml-1 text-danger">*</span>
                {!type && (
                  <Tooltip title={typeInfo} color="black" placement="right" overlayStyle={{ maxWidth: '500px' }}>
                    <span className="text-info">
                      <FontAwesomeIcon className="ml-2 cursor-pointer" size="sm" icon={faInfoCircle} />
                    </span>
                  </Tooltip>
                )}
              </Label>
              <br />
              <CheckboxFieldGroup
                name={typeCategory.name}
                checkedvalue="equipment"
                id="equipment"
                onClick={() => resetSpaceCheck()}
                label={typeCategory.label}
              />
              <CheckboxFieldGroup
                name={typeCategory.name}
                checkedvalue="asset"
                id="asset"
                onClick={() => resetEquipment()}
                isDisabled={(!editId && equipment)}
                label={typeCategory.label1}
              />
              {!type && isITEnabled && (
                <CheckboxFieldGroup
                  name={typeCategory.name}
                  checkedvalue="IT"
                  id="IT"
                  onClick={() => { resetEquipment(); resetSpaceCheck(); }}
                  label={typeCategory.label2}
                />
              )}
            </Col>
            {ticketType === 'equipment'
              && (
                <Col xs={12} sm={12} md={12} lg={12}>
                  <FormikAutocomplete
                    name={equipmentId.name}
                    label={equipmentId.label}
                    labelClassName="mb-1"
                    formGroupClassName="mb-1 w-100"
                    isRequired
                    disabled={(!editId && equipment)}
                    oldValue={oldEquipId}
                    value={equipment_id && equipment_id.name ? equipment_id.name : oldEquipId}
                    open={equipmentOpen}
                    size="small"
                    onOpen={() => {
                      setEquipmentOpen(true);
                      setEquipmentKeyword('');
                    }}
                    onClose={() => {
                      setEquipmentOpen(false);
                      setEquipmentKeyword('');
                    }}
                    classes={{
                      option: classes.option,
                    }}
                    loading={equipmentInfo && equipmentInfo.loading}
                    getOptionSelected={(option, value) => option.name === value.name}
                    getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                    filterOptions={filterOptions}
                    options={equipmentOptions}
                    renderOption={(option) => (
                      <>
                        <h6 className="mb-1">
                          {option.name}
                          {option.brand && (
                          <>
                            {'  '}
                            |
                            <span className="ml-1">{option.brand}</span>
                          </>
                          )}
                        </h6>
                        <p className="font-tiny float-left ml-2 mb-0 mt-0">{option.location_id ? option.location_id[1] : ''}</p>
                        <p className="font-tiny ml-2">
                          {option.serial && (
                          <>
                            {option.serial}
                          </>
                          )}
                        </p>
                      </>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        onChange={onEquipmentKeywordChange}
                        variant="outlined"
                        placeholder="Search & Select"
                        value={equipmentKeyword}
                        className={!(!editId && equipment) && ((oldEquipId) || (equipment_id && equipment_id.id) || (equipmentKeyword && equipmentKeyword.length > 0))
                          ? 'input-small-custom without-padding custom-icons' : 'input-small-custom without-padding custom-icons2'}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {equipmentInfo && equipmentInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                              <InputAdornment position="end">
                                {!(!editId && equipment) && ((oldEquipId) || (equipment_id && equipment_id.id) || (equipmentKeyword && equipmentKeyword.length > 0)) && (
                                  <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={onEquipmentKeywordClear}
                                  >
                                    <BackspaceIcon fontSize="small" />
                                  </IconButton>
                                )}
                                {!(!editId && equipment) && (
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
                  {(equipmentInfo && equipmentInfo.err && equipmentOpen) && (<FormHelperText><span className="text-danger">{generateErrorMessage(equipmentInfo)}</span></FormHelperText>)}
                </Col>
              )}
            {ticketType === 'asset'
              && (
                <Col xs={12} sm={12} md={12} lg={12}>
                  <span className="font-weight-600 pb-1 d-inline-block">
                    {assetId.label}
                    <span className="ml-1 text-danger">*</span>
                  </span>
                  <br />

                  <Cascader
                    options={spaceCascader && spaceCascader.length > 0 ? spaceCascader : []}
                    value={spaceCascader && spaceCascader.length > 0 ? asset_id : []}
                    fieldNames={{ label: 'name', value: 'id', children: 'children' }}
                    onChange={onChange}
                    placeholder="Select Space"
                    dropdownRender={dropdownRender}
                    notFoundContent="No options"
                    className="thin-scrollbar bg-white mb-1"
                    loadData={loadData}
                    changeOnSelect
                  />
                </Col>
              )}
            {!editId && (
              categoryAndSub
            )}
          </Col>
        </Row>
        {editId && (
          <Row className="mb-3">
            {categoryAndSub}
          </Row>
        )}
        <Modal size="xl" className="border-radius-50px modal-dialog-centered" isOpen={extraModal}>
          <ModalHeaderComponent title={modalName} imagePath={false} closeModalWindow={() => { setExtraModal(false); }} />
          <ModalBody className="mt-0 pt-0">
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
          </ModalBody>
        </Modal>
      </ThemeProvider>
    </>
  );
};

AssetForm.defaultProps = {
  editId: false,
  equipment: false,
  type: false,
};

AssetForm.propTypes = {
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  reloadSpace: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  editId: PropTypes.oneOfType([PropTypes.bool, PropTypes.number, PropTypes.string]),
  equipment: PropTypes.oneOfType([PropTypes.bool, PropTypes.object, PropTypes.string]),
  type: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
};

export default AssetForm;
