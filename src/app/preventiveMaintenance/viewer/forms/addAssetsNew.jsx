/* eslint-disable react/prop-types */
/* eslint-disable radix */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/require-default-props */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import Box from '@mui/system/Box';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@material-ui/core/TextField';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@material-ui/core/CircularProgress';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import { IoCloseOutline } from 'react-icons/io5';
import {
  Table,
  Spinner,
} from 'reactstrap';
import {
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import { Divider } from 'antd';

import ErrorContent from '@shared/errorContent';
import SingleSearchModal from '@shared/searchModals/singleSearchModal';

import DialogHeader from '../../../commonComponents/dialogHeader';
import { returnThemeColor } from '../../../themes/theme';
import SpaceSelection from '../../../inspectionSchedule/viewer/spaceSelection';
import EquipmentsSelection from '../../../commonComponents/equipmentsSelection';
import {
  getColumnArrayById,
  getDefaultNoValue,
  extractNameObject,
  getAllowedCompanies,
  generateErrorMessage,
  extractOptionsObject,
  preprocessData,
} from '../../../util/appUtils';

import {
  getBuildings, getAllSpaces, getEquipmentFilters,
} from '../../../assets/equipmentService';

import {
  getCascader,
  getSpacesList,
} from '../../../helpdesk/ticketService';

import {
  getEquipmentList,
} from '../../../breakdownTracker/breakdownService';

import AdvancedSearchModal from '../../../workPermit/configration/forms/advancedSearchModal';
import MuiAutoCompleteStatic from '../../../commonComponents/formFields/muiAutocompleteStatic';
import Assets from '../../../assets/equipments';
import Spaces from '../../../assets/spaces';
import appModels from '../../../util/appModels';
import { getOperationsList, getAssetCategoryList } from '../../ppmService';

const AddAssetsNew = ({
  formValues, editId, setFormValues, equipments, setEquipments, spaces, setSpaces,
}) => {
  const [multipleModal, setMultipleModal] = useState(false);
  const [columns, setColumns] = useState(['id', 'name']);
  const [checkedRows, setCheckRows] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [spaceSelected, setSpacesSelected] = useState([]);
  const [multipleSpaceModal, setMultipleSpaceModal] = useState(false);

  const [checkedSpaceRows, setSpaceCheckRows] = useState([]);
  const [isSpaceAllChecked, setIsSpaceAllChecked] = useState(false);

  const [categoryKeyword, setCategoryKeyword] = useState('');
  const [categoryOpen, setCategoryOpen] = useState(false);

  const [equipmentOpen, setEquipmentOpen] = useState(false);
  const [equipmentKeyword, setEquipmentKeyword] = useState('');

  const [spaceOpen, setSpaceOpen] = useState(false);
  const [spaceKeyword, setSpaceKeyword] = useState('');

  const [spaceId, setSpaceId] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [extraModal, setExtraModal] = useState(false);
  const [parentId, setParentId] = useState('');

  const [cascaderValues, setCascaderValues] = useState([]);
  const [childValues, setChildValues] = useState([]);

  const [childLoad, setChildLoad] = useState(false);
  const [assetFilterModal, setAssetFilterModal] = useState(false);
  const [spaceFilterModal, setSpaceFilterModal] = useState(false);
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [extraModal1, setExtraModal1] = useState(false);

  const [taskOpen, setTaskOpen] = useState(false);
  const [taskKeyword, setTaskKeyword] = useState('');
  const [assetType, setAssetType] = useState('');

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const dispatch = useDispatch();
  const { taskInfo, assetCategoriesInfo } = useSelector((state) => state.ppm);

  const { spacesInfo } = useSelector((state) => state.ticket);

  const {
    equInfoList,
  } = useSelector((state) => state.breakdowntracker);

  const {
    buildingsInfo, buildingSpaces,
  } = useSelector((state) => state.equipment);

  const onChange = (value, selectedOptions) => {
    setParentId('');
    setSpacesSelected(value);

    // Function to find last element and include either children or the object itself
    const mergedData = value.map((idArray) => {
      const lastId = idArray[idArray.length - 1]; // Get last ID
      const node = selectedOptions.flat().find((item) => item.id === lastId);

      if (!node) return null; // Skip if not found

      // If children exist, return the object with children, else return the object itself
      return node.children && node.children.length > 0 ? { ...node } : node;
    }).filter(Boolean); // Remove nulls if last ID not found

    setSpaces(mergedData);

    if (selectedOptions && selectedOptions.length) {
      const rowData = selectedOptions[selectedOptions.length - 1];
      if (!rowData[rowData.length - 1].parent_id || (formValues.category_id && formValues.category_id.id)) {
        setParentId(rowData[rowData.length - 1].id);
        setSpaceId(rowData[rowData.length - 1].id);
        if (spaceId !== rowData[rowData.length - 1].id) {
          dispatch(getAllSpaces(rowData[rowData.length - 1].id, companies));
        }
      }
    }
    // setFieldValue('asset_id', value);
  };

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

  const onTitleChange = (value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      name: value,
    }));
  };

  function getCategoryId() {
    let res = false;
    if (!editId) {
      if (formValues.category_type === 'e') {
        if (formValues.ppm_by === 'Space Category') {
          res = formValues.category_id && formValues.category_id.id;
        } else if (formValues.ppm_by === 'Checklist') {
          res = formValues.task_id && formValues.task_id.category_id && formValues.task_id.category_id.length ? formValues.task_id.category_id[0] : '';
        }
      } else if (formValues.category_type === 'ah') {
        if (formValues.ppm_by === 'Space Category') {
          res = formValues.category_id && formValues.category_id.id;
        } else if (formValues.ppm_by === 'Checklist') {
          res = formValues.task_id && formValues.task_id.asset_category_id && formValues.task_id.asset_category_id.length ? formValues.task_id.asset_category_id[0] : '';
        }
      }
    } else if (formValues.category_type === 'e') {
      if (formValues.task_id && formValues.task_id.category_id && formValues.task_id.category_id.id) {
        res = formValues.task_id && formValues.task_id.category_id && formValues.task_id.category_id.id;
      } else if (formValues.task_id && formValues.task_id.category_id && formValues.task_id.category_id.length) {
        res = formValues.task_id && formValues.task_id.category_id && formValues.task_id.category_id[0];
      }
    } else if (formValues.category_type === 'ah') {
      if (formValues.task_id && formValues.task_id.asset_category_id && formValues.task_id.asset_category_id.id) {
        res = formValues.task_id && formValues.task_id.asset_category_id && formValues.task_id.asset_category_id.id;
      } else if (formValues.task_id && formValues.task_id.asset_category_id && formValues.task_id.asset_category_id.length) {
        res = formValues.task_id && formValues.task_id.asset_category_id && formValues.task_id.asset_category_id[0];
      }
    }
    return res;
  }

  /* useEffect(() => {
    if (formValues.category_type === 'ah' && !editId) {
      dispatch(getBuildings(companies, appModels.SPACE, false, false, formValues.category_id && formValues.category_id.id ? 1000 : false, formValues.category_id && formValues.category_id.id ? formValues.category_id.id : false));
    }
  }, [formValues.category_type, formValues.category_id]);

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
  }, [buildingSpaces, parentId]); */

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && categoryOpen && !editId) {
        await dispatch(getAssetCategoryList(companies, formValues.category_type === 'e' ? appModels.EQUIPMENTCATEGORY : appModels.ASSETCATEGORY, categoryKeyword));
      }
    })();
  }, [userInfo, categoryKeyword, categoryOpen, formValues.category_type]);

  useEffect(() => {
    (async () => {
      if (!editId) {
        if (userInfo && userInfo.data) {
          await dispatch(getOperationsList(companies, appModels.TASK, taskKeyword, formValues.category_type === 'e' ? 'equipment' : 'asset', false, formValues.ppm_by === 'Space Category' && formValues.category_id && formValues.category_id.id ? formValues.category_id.id : false));
        }
      }
    })();
  }, [taskKeyword, formValues.category_type, formValues.category_id]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && equipmentOpen && editId) {
        await dispatch(getEquipmentList(companies, appModels.EQUIPMENT, equipmentKeyword, getCategoryId()));
      }
    })();
  }, [userInfo, equipmentKeyword, equipmentOpen, formValues.task_id, formValues.category_type]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && spaceOpen && editId) {
        await dispatch(getSpacesList(companies, appModels.SPACE, spaceKeyword, getCategoryId()));
      }
    })();
  }, [userInfo, spaceKeyword, spaceOpen, formValues.task_id, formValues.category_type]);

  const onCategoryChange = (value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      category_id: value,
    }));
  };

  const onCategoryClear = () => {
    setCategoryKeyword(null);
    setFormValues((prevValues) => ({
      ...prevValues,
      category_id: '',
    }));
    setCategoryOpen(false);
  };

  const onEquipmentChange = (data) => {
    if (data && data.length && data.find((option) => option.name === 'Loading...')) {
      return false;
    }
    setFormValues((prevValues) => ({
      ...prevValues,
      equipment_id: data,
    }));
    // setEquipments(data);
  };

  const onSpaceChange = (data) => {
    if (data && data.length && data.find((option) => option.name === 'Loading...')) {
      return false;
    }
    setFormValues((prevValues) => ({
      ...prevValues,
      space_id: data,
    }));
  };

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

  const onEquipClear = () => {
    setFormValues((prevValues) => ({
      ...prevValues,
      equipment_id: '',
    }));
    setEquipmentKeyword(null);
    setEquipments([]);
    setEquipmentOpen(false);
  };

  const onSpaceClear = () => {
    setFormValues((prevValues) => ({
      ...prevValues,
      space_id: '',
    }));
    setSpaceKeyword(null);
    setEquipments([]);
    setSpaceOpen(false);
  };

  const showTaskModal = () => {
    setModelValue(appModels.TASK);
    setColumns(['id', 'name']);
    setFieldName('task_id');
    setAssetType(formValues.category_type === 'e' ? 'equipment' : 'asset');
    setModalName('Maintenance Checklist');
    setCompanyValue(companies);
    setExtraModal(true);
  };

  const onTaskChange = (value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      task_id: value,
    }));
  };

  const onTaskClear = () => {
    setTaskKeyword(null);
    setFormValues((prevValues) => ({
      ...prevValues,
      task_id: '',
    }));
    setTaskOpen(false);
  };

  const handleTypeChange = (event) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      category_type: event.target.value,
      task_id: '',
    }));
    onCategoryClear();
    if (event.target.value === 'e') {
      setSpaces([]);
      onSpaceClear();
      dispatch(getEquipmentFilters([]));
      setSpacesSelected([]);
      setParentId('');
      setChildValues([]);
      setSpaceId(false);
      setChildLoad(false);
      setCascaderValues([]);
      setSpaceCheckRows([]);
      setIsSpaceAllChecked(false);
    } else if (event.target.value === 'ah') {
      onEquipClear();
      setEquipments([]);
      dispatch(getEquipmentFilters([]));
      setCheckRows([]);
      setIsAllChecked(false);
    }
  };

  const handlePPMByChange = (event) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      ppm_by: event.target.value,
    }));
    onCategoryClear();
    setSpaces([]);
    setSpacesSelected([]);
    setParentId('');
    setChildValues([]);
    setSpaceId(false);
    setChildLoad(false);
    setCascaderValues([]);
    setSpaceCheckRows([]);
    setIsSpaceAllChecked(false);
    onEquipClear();
    onSpaceClear();
    setEquipments([]);
    setCheckRows([]);
    setIsAllChecked(false);
  };

  const removeData = (id) => {
    const newData = equipments.filter((item) => item.id !== id);
    setEquipments(newData);
  };

  const onFetchAssetSchedules = () => {
    setAssetFilterModal(false);
  };

  const removeSpaceData = (id) => {
    const newData = spaces.filter((item) => item.id !== id);
    setSpaces(newData);
    const idPairs = [...spaceSelected];
    const filteredIdPairs = idPairs.filter(
      (arr) => arr[arr.length - 1] !== id,
    );
    setSpacesSelected(filteredIdPairs);
  };

  const onAssetModalChange = (data) => {
    if (!editId) {
      if (data && data.length) {
        const newData = data.filter((item) => item.name);
        // const allData = [...newData, ...equipments];
        const newData1 = [...new Map(newData.map((item) => [item.id, item])).values()];
        setEquipments(newData1);
      //  setTrigger(Math.random());
      } else {
        setEquipments([]);
      }
    } else {
      setFormValues((prevValues) => ({
        ...prevValues,
        equipment_id: data,
      }));
    }
  };

  const onSpaceModalChange = (data) => {
    if (!editId) {
      setSpaces(data);
      setSpaceFilterModal(false);
    } else {
      setFormValues((prevValues) => ({
        ...prevValues,
        space_id: data,
      }));
      setMultipleSpaceModal(false);
    }
  };

  const onTaskSelect = (name, value) => {
    if (fieldName === 'task_id') {
      setFormValues((prevValues) => ({
        ...prevValues,
        task_id: value,
      }));
    } else if (fieldName === 'vendor_id') {
      setFormValues((prevValues) => ({
        ...prevValues,
        vendor_id: value,
      }));
    }
  };

  const onOpenModal = () => {
    if (formValues.category_type === 'e') {
      setMultipleSpaceModal(false);
      setMultipleModal(true);
    } else if (formValues.category_type === 'ah') {
      setMultipleModal(false);
      setMultipleSpaceModal(true);
    }
  };

  const showCategoryModal = () => {
    setModelValue(formValues.category_type === 'e' ? appModels.EQUIPMENTCATEGORY : appModels.ASSETCATEGORY);
    setFieldName('category_id');
    setModalName('Categories');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue('');
    setExtraModal1(true);
  };

  const onCategorySelect = (name, value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      category_id: value,
    }));
  };

  const getFiledData = (data) => getColumnArrayById(data, 'id');

  const categoryOptions = extractOptionsObject(assetCategoriesInfo, formValues.category_id);
  const taskOptions = extractOptionsObject(taskInfo, formValues.task_id);

  return (
    <Box
      sx={{
        width: '100%',
        marginBottom: '30px',
      }}
    >

      <FormControl
        sx={{
          width: '100%',
          padding: '10px 0px 20px 30px',
          borderTop: '1px solid #0000001f',
        }}
      >
        <Box
          sx={{
            width: '60%',
            // display: 'flex',
            // gap: '35px',
          }}
        >
          <p style={{ color: returnThemeColor() }} className="font-family-tab font-weight-800">Asset Info</p>
          { /* <Box
            sx={{
              marginTop: '20px',
              width: '20%',
            }}
          >

          </Box> */ }
          <Box
            sx={{
              marginTop: '20px',
              width: '100%',
            }}
          >
            <FormControl>
              <FormLabel className="mb-2 mt-1 font-tiny line-height-small" id="demo-row-radio-buttons-group-label">
                {editId ? 'Update' : 'Create'}
                {' '}
                PPM For
                <span className="ml-2 text-danger">*</span>
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                value={formValues.category_type}
                onChange={handleTypeChange}
              >
                <FormControlLabel value="e" control={<Radio size="small" />} label="Equipment" />
                <FormControlLabel value="ah" control={<Radio size="small" />} label="Space" />
              </RadioGroup>
            </FormControl>
          </Box>
          {!editId && (
          <Box
            sx={{
              marginTop: '20px',
              width: '100%',
            }}
          >
            <FormControl>
              <FormLabel className="mb-2 mt-1 font-tiny line-height-small" id="demo-row-radio-buttons-group-label">
                Configure PPM By
                <span className="ml-2 text-danger">*</span>
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                value={formValues.ppm_by}
                onChange={handlePPMByChange}
              >
                <FormControlLabel value="Space Category" control={<Radio size="small" />} label={formValues.category_type === 'ah' ? 'Space Category' : 'Equipment Category'} />
                <FormControlLabel value="Checklist" control={<Radio size="small" />} label="Checklist" />
              </RadioGroup>
            </FormControl>
          </Box>
          )}
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              gap: '30px',
            }}
          >
            {!editId && formValues.ppm_by === 'Space Category' && (
            <MuiAutoCompleteStatic
              sx={{
                marginTop: '10px',
                width: '33%',
              }}
              name="category_id"
              label="Space Category"
              open={categoryOpen}
              value={formValues.category_id && formValues.category_id.name ? formValues.category_id.name : ''}
              apiError={(assetCategoriesInfo && assetCategoriesInfo.err) ? generateErrorMessage(assetCategoriesInfo) : false}
              setValue={onCategoryChange}
              onOpen={() => {
                setCategoryOpen(true);
                setCategoryKeyword('');
              }}
              onClose={() => {
                setCategoryOpen(false);
                setCategoryKeyword('');
              }}
              loading={assetCategoriesInfo && assetCategoriesInfo.loading}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={categoryOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={(e) => setCategoryKeyword(e.target.value)}
                  variant="standard"
                  label={(
                    <>
                      <span className="font-family-tab">{formValues.category_type === 'ah' ? 'Space Category' : 'Equipment Category'}</span>
                      {' '}
                      <span className="text-danger text-bold">*</span>
                    </>
                  )}
                  value={categoryKeyword}
                  className={((formValues.category_id && formValues.category_id.name) || (categoryKeyword && categoryKeyword.length > 0))
                    ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                  placeholder={`Search & Select ${formValues.category_type === 'ah' ? 'Space Category' : 'Equipment Category'}`}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {assetCategoriesInfo && assetCategoriesInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        <InputAdornment position="end">
                          {((formValues.category_id && formValues.category_id.name) || (categoryKeyword && categoryKeyword.length > 0)) && (
                          <Tooltip title="Clear" fontSize="small">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={onCategoryClear}
                            >
                              <IoCloseOutline size={22} fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          )}
                          <Tooltip title="Search" fontSize="small">
                            <IconButton
                              aria-label="toggle search visibility"
                              onClick={showCategoryModal}
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
            {!editId && (
            <MuiAutoCompleteStatic
              sx={{
                marginTop: '10px',
                width: '33%',
              }}
              name="task_id"
              label="Checklists"
              open={taskOpen}
              value={formValues.task_id && formValues.task_id.name ? formValues.task_id.name : ''}
              apiError={(taskInfo && taskInfo.err) ? generateErrorMessage(taskInfo) : false}
              setValue={onTaskChange}
              onOpen={() => {
                setTaskOpen(true);
                setTaskKeyword('');
              }}
              onClose={() => {
                setTaskOpen(false);
                setTaskKeyword('');
              }}
              loading={taskInfo && taskInfo.loading}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={taskOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={(e) => setTaskKeyword(e.target.value)}
                  variant="standard"
                  label={!editId ? (
                    <>
                      <span className="font-family-tab">Checklists</span>
                      {' '}
                      <span className="text-danger text-bold">*</span>
                    </>
                  ) : 'Checklists'}
                  value={taskKeyword}
                  className={((formValues.task_id && formValues.task_id.name) || (taskKeyword && taskKeyword.length > 0))
                    ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                  placeholder="Search & Select Checklists"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {taskInfo && taskInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        <InputAdornment position="end">
                          {((formValues.task_id && formValues.task_id.name) || (taskKeyword && taskKeyword.length > 0)) && (
                          <Tooltip title="Clear" fontSize="small">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={onTaskClear}
                            >
                              <IoCloseOutline size={22} fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          )}
                          <Tooltip title="Search" fontSize="small">
                            <IconButton
                              aria-label="toggle search visibility"
                              onClick={showTaskModal}
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
            {editId && formValues.category_type === 'e' && (
            <MuiAutoCompleteStatic
              sx={{
                marginTop: '10px',
                width: '33%',
              }}
              name="equipment_id"
              label="Equipment"
              open={equipmentOpen}
              value={formValues.equipment_id && formValues.equipment_id.name ? formValues.equipment_id.name : ''}
              apiError={(equInfoList && equInfoList.err) ? generateErrorMessage(equInfoList) : false}
              setValue={onEquipmentChange}
              onOpen={() => {
                setEquipmentOpen(true);
                setEquipmentKeyword('');
              }}
              onClose={() => {
                setEquipmentOpen(false);
                setEquipmentKeyword('');
              }}
              loading={equInfoList && equInfoList.loading}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={equInfoList && equInfoList.data ? equInfoList.data : []}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={(e) => setEquipmentKeyword(e.target.value)}
                  variant="standard"
                  label={(
                    <>
                      <span className="font-family-tab">Equipment</span>
                      {' '}
                      <span className="text-danger text-bold">*</span>
                    </>
                  )}
                  value={equipmentKeyword}
                  className={((formValues.equipment_id && formValues.equipment_id.name) || (equipmentKeyword && equipmentKeyword.length > 0))
                    ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                  placeholder="Search & Select Equipment"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {equInfoList && equInfoList.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        <InputAdornment position="end">
                          {((formValues.equipment_id && formValues.equipment_id.name) || (equipmentKeyword && equipmentKeyword.length > 0)) && (
                          <Tooltip title="Clear" fontSize="small">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={onEquipClear}
                            >
                              <IoCloseOutline size={22} fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          )}
                          <Tooltip title="Search" fontSize="small">
                            <IconButton
                              aria-label="toggle search visibility"
                              onClick={onOpenModal}
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
            {editId && formValues.category_type === 'ah' && (
            <MuiAutoCompleteStatic
              sx={{
                marginTop: '10px',
                width: '33%',
              }}
              name="space_id"
              label="Space"
              open={spaceOpen}
              value={formValues.space_id && formValues.space_id.space_name ? formValues.space_id.space_name : ''}
              apiError={(spacesInfo && spacesInfo.err) ? generateErrorMessage(spacesInfo) : false}
              setValue={onSpaceChange}
              onOpen={() => {
                setSpaceOpen(true);
                setSpaceKeyword('');
              }}
              onClose={() => {
                setSpaceOpen(false);
                setSpaceKeyword('');
              }}
              loading={spacesInfo && spacesInfo.loading}
              getOptionSelected={(option, value) => option.name === value.space_name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.space_name)}
              options={spacesInfo && spacesInfo.data ? spacesInfo.data : []}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={(e) => setSpaceKeyword(e.target.value)}
                  variant="standard"
                  label={(
                    <>
                      <span className="font-family-tab">Space</span>
                      {' '}
                      <span className="text-danger text-bold">*</span>
                    </>
                  )}
                  value={spaceKeyword}
                  className={((formValues.space_id && formValues.space_id.space_name) || (spaceKeyword && spaceKeyword.length > 0))
                    ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                  placeholder="Search & Select Space"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {spacesInfo && spacesInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        <InputAdornment position="end">
                          {((formValues.space_id && formValues.space_id.space_name) || (spaceKeyword && spaceKeyword.length > 0)) && (
                          <Tooltip title="Clear" fontSize="small">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={onSpaceClear}
                            >
                              <IoCloseOutline size={22} fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          )}
                          <Tooltip title="Search" fontSize="small">
                            <IconButton
                              aria-label="toggle search visibility"
                              onClick={onOpenModal}
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

        </Box>
      </FormControl>
      {formValues && formValues.category_type === 'e' && equipments && equipments.length > 0 && (
        <div className="p-3">
          <p className="font-family-tab">
            Selected Assets:
            {equipments.length}
          </p>
          <Table responsive>
            <thead className="bg-gray-light font-family-tab">
              <tr>
                <th className="p-2 min-width-100">
                  Name
                </th>
                <th className="p-2 min-width-160">
                  Reference Number
                </th>
                <th className="p-2 min-width-160">
                  Category
                </th>
                <th className="p-2 min-width-160">
                  Block
                </th>
                <th className="p-2 min-width-160">
                  Floor
                </th>
                <th className="p-2 min-width-160">
                  Space
                </th>
                <th className="p-2 min-width-160">
                  Maintenance Team
                </th>
                <th />
              </tr>
            </thead>
            <tbody className="font-family-tab">
              {equipments.map((eq, index) => (
                <tr key={eq.id}>
                  <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(eq.name)}</span></td>
                  <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(eq.equipment_seq)}</span></td>
                  <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(extractNameObject(eq.category_id, 'name'))}</span></td>
                  <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(extractNameObject(eq.block_id, 'space_name'))}</span></td>
                  <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(extractNameObject(eq.floor_id, 'space_name'))}</span></td>
                  <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(extractNameObject(eq.location_id, 'path_name'))}</span></td>
                  <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(extractNameObject(eq.maintenance_team_id, 'name'))}</span></td>
                  <td className="p-2 align-middle">
                    <span className="font-weight-400 d-inline-block" />
                    <FontAwesomeIcon className="mr-1 ml-1 cursor-pointer" size="md" icon={faTrashAlt} onClick={() => removeData(eq.id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
      {formValues && formValues.category_type === 'ah' && spaces && spaces.length > 0 && (
        <div className="p-3">
          <p className="font-family-tab">
            Selected Spaces:
            {spaces.length}
          </p>
          <Table responsive>
            <thead className="bg-gray-light font-family-tab">
              <tr>
                <th className="p-2 min-width-100">
                  Name
                </th>
                <th className="p-2 min-width-160">
                  Full Path
                </th>
                <th className="p-2 min-width-160">
                  Category
                </th>

                <th />
              </tr>
            </thead>
            <tbody className="font-family-tab">
              {spaces.map((eq, index) => (
                <tr key={eq.id}>
                  <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(eq.space_name)}</span></td>
                  <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(eq.path_name)}</span></td>
                  <td className="p-2"><span className="font-weight-400">{getDefaultNoValue(eq.type)}</span></td>
                  <td className="p-2 align-middle">
                    <span className="font-weight-400 d-inline-block" />
                    <FontAwesomeIcon className="mr-1 ml-1 cursor-pointer" size="md" icon={faTrashAlt} onClick={() => removeSpaceData(eq.id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
      {!editId && formValues && formValues.category_type === 'e' && getCategoryId() && (
        <div className="pl-4 pr-3 mb-2">
          <Button
            type="button"
            variant="contained"
            size="small"
            onClick={() => setAssetFilterModal(true)}
          >
            Select Equipment
          </Button>

          {assetFilterModal && (
          <EquipmentsSelection
            onAssetModalChange={onAssetModalChange}
            filterModal={assetFilterModal}
            setEquipments={setEquipments}
            equipments={equipments}
            finishText="Add Selected Equipment"
            categoryId={getCategoryId()}
            onClose={onFetchAssetSchedules}
            onCancel={() => setAssetFilterModal(false)}
          />
          )}
        </div>
      )}
      {!editId && formValues && formValues.category_type === 'ah' && getCategoryId() && (
      <div className="pl-4 pr-3 mb-2">
        <Button
          type="button"
          variant="contained"
          size="small"
          onClick={() => setSpaceFilterModal(true)}
        >
          Select Spaces
        </Button>

        {spaceFilterModal && (
        <SpaceSelection
          filterModal={spaceFilterModal}
          spaces={spaces && spaces.length > 0 ? spaces : []}
          setSpaces={onSpaceModalChange}
          onCancel={() => setSpaceFilterModal(false)}
          categoryId={getCategoryId()}
          finishText="Add Selected Spaces"
        />
        )}
      </div>
      )}
      <Dialog maxWidth="lg" open={extraModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraModal(false); }} sx={{ width: '1000px' }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <AdvancedSearchModal
              modelName={modelValue}
              afterReset={() => { setExtraModal(false); }}
              fieldName={fieldName}
              fields={columns}
              assetType={assetType}
              categoryId={getCategoryId()}
              company={companyValue}
              setFieldValue={onTaskSelect}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Dialog size="lg" fullWidth open={extraModal1}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraModal1(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <SingleSearchModal
              modelName={modelValue}
              afterReset={() => { setExtraModal1(false); }}
              fieldName={fieldName}
              fields={columns}
              company={companyValue}
              otherFieldName={otherFieldName}
              otherFieldValue={otherFieldValue}
              setFieldValue={onCategorySelect}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Dialog
        ModalProps={{
          sx: { zIndex: '1100' },
        }}
        maxWidth="xl"
        open={multipleModal}
      >
        <DialogHeader title="Select Assets" imagePath={false} onClose={() => { setMultipleModal(false); }} rightButton />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Box
              sx={{
                width: '100%',
                backgroundColor: '#F6F8FA',
                padding: '0px',
                display: 'flex',
                flexDirection: 'column',
                fontFamily: 'Suisse Intl',
              }}
            >

              <Assets
                isSearch
                isSingle={editId}
                fields={columns}
                onAssetChange={onAssetModalChange}
                assetCategory={getCategoryId()}
                oldAssets={equipments && equipments.length > 0 ? getFiledData(equipments) : []}
                afterReset={() => { setMultipleModal(false); }}
              />
            </Box>
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Dialog
        ModalProps={{
          sx: { zIndex: '1100' },
        }}
        maxWidth="xl"
        minWidth="xl"
        open={multipleSpaceModal}
      >
        <DialogHeader title="Select Spaces" imagePath={false} onClose={() => { setMultipleSpaceModal(false); }} rightButton />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Box
              sx={{
                width: '100%',
                backgroundColor: '#F6F8FA',
                padding: '0px',
                display: 'flex',
                flexDirection: 'column',
                fontFamily: 'Suisse Intl',
              }}
            >
              <Spaces
                isSearch
                isMini
                fields={columns}
                isSingle={editId}
                onAssetChange={onSpaceModalChange}
                assetCategory={getCategoryId()}
                oldAssets={spaces && spaces.length > 0 ? getFiledData(spaces) : []}
                afterReset={() => { setMultipleSpaceModal(false); }}
              />

            </Box>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AddAssetsNew;
