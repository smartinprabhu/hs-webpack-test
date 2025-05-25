/* eslint-disable react/prop-types */
/* eslint-disable radix */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/require-default-props */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import Box from '@mui/system/Box';
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
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

import SingleSearchModal from '@shared/searchModals/singleSearchModal';

import DialogHeader from '../../../commonComponents/dialogHeader';
import { returnThemeColor } from '../../../themes/theme';
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
import SpaceSelection from '../spaceSelection';
import EquipmentsSelection from '../../../commonComponents/equipmentsSelection';
import { getPreventiveCheckList, getAssetCategoryList } from '../../../preventiveMaintenance/ppmService';
import Selection from '../../../commonComponents/multipleFormFields/selectionMultiple';

const AddAssetsNew = ({
  editId, formValues, setFormValues, equipments, setEquipments, spaces, setSpaces,
}) => {
  const [multipleModal, setMultipleModal] = useState(false);
  const [columns, setColumns] = useState(['id', 'name']);
  const [checkedRows, setCheckRows] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [spaceSelected, setSpacesSelected] = useState([]);
  const [multipleSpaceModal, setMultipleSpaceModal] = useState(false);
  const [checkKeyword, setCheckKeyword] = useState(false);

  const [checkedSpaceRows, setSpaceCheckRows] = useState([]);
  const [isSpaceAllChecked, setIsSpaceAllChecked] = useState(false);

  const [categoryKeyword, setCategoryKeyword] = useState('');
  const [categoryOpen, setCategoryOpen] = useState(false);

  const [taskOpen, setTaskOpen] = useState(false);
  const [taskKeyword, setTaskKeyword] = useState('');
  const [assetType, setAssetType] = useState('');

  const [equipmentOpen, setEquipmentOpen] = useState(false);
  const [equipmentKeyword, setEquipmentKeyword] = useState('');

  const [spaceId, setSpaceId] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [extraModal, setExtraModal] = useState(false);
  const [extraModal1, setExtraModal1] = useState(false);
  const [parentId, setParentId] = useState('');

  const [cascaderValues, setCascaderValues] = useState([]);
  const [childValues, setChildValues] = useState([]);

  const [childLoad, setChildLoad] = useState(false);

  const [spaceOpen, setSpaceOpen] = useState(false);
  const [spaceKeyword, setSpaceKeyword] = useState('');
  const [assetFilterModal, setAssetFilterModal] = useState(false);
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [spaceFilterModal, setSpaceFilterModal] = useState(false);

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const dispatch = useDispatch();

  const { spacesInfo } = useSelector((state) => state.ticket);

  const {
    equInfoList,
  } = useSelector((state) => state.breakdowntracker);

  const { checkList, assetCategoriesInfo } = useSelector((state) => state.ppm);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && !editId) {
        await dispatch(getAssetCategoryList(companies, formValues.category_type === 'e' ? appModels.EQUIPMENTCATEGORY : appModels.ASSETCATEGORY, categoryKeyword));
      }
    })();
  }, [userInfo, categoryKeyword, formValues.category_type]);

  useEffect(() => {
    (async () => {
      if (!editId) {
        if (userInfo && userInfo.data) {
          await dispatch(getPreventiveCheckList(companies, appModels.PPMCHECKLIST, checkKeyword, formValues.category_type, formValues.ppm_by === 'Space Category' && formValues.category_id && formValues.category_id.id ? formValues.category_id.id : false));
        }
      }
    })();
  }, [checkKeyword, formValues.ppm_by, formValues.category_type, formValues.category_id]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && equipmentOpen && editId) {
        await dispatch(getEquipmentList(companies, appModels.EQUIPMENT, equipmentKeyword, false));
      }
    })();
  }, [userInfo, equipmentKeyword, equipmentOpen, formValues.task_id, formValues.category_type]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && spaceOpen && editId) {
        await dispatch(getSpacesList(companies, appModels.SPACE, spaceKeyword, false));
      }
    })();
  }, [userInfo, spaceKeyword, spaceOpen, formValues.task_id, formValues.category_type]);

  const onSpaceChange = (data) => {
    if (data && data.length && data.find((option) => option.name === 'Loading...')) {
      return false;
    }
    setFormValues((prevValues) => ({
      ...prevValues,
      space_id: data,
    }));
  };

  function getCategoryId() {
    let equipmentCategory = false;
    let spaceCategory = false;
    if (formValues.ppm_by === 'Space Category' && formValues.category_id && formValues.category_id.id) {
      equipmentCategory = formValues.category_id.id;
      spaceCategory = formValues.category_id.id;
    } else if (formValues.ppm_by === 'Checklist' && formValues.checklist_id && formValues.checklist_id_id) {
      equipmentCategory = formValues.checklist_id.equipment_category_id && formValues.checklist_id.equipment_category_id.length ? formValues.checklist_id.equipment_category_id[0] : false;
      spaceCategory = formValues.checklist_id.assest_category_id && formValues.checklist_id.assest_category_id.length ? formValues.checklist_id.assest_category_id[0] : false;
    }
    return formValues.category_type === 'e' ? equipmentCategory : spaceCategory;
  }

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && equipmentOpen) {
        await dispatch(getEquipmentList(companies, appModels.EQUIPMENT, equipmentKeyword, formValues.category_id && formValues.category_id.id ? formValues.category_id.id : false));
      }
    })();
  }, [userInfo, equipmentKeyword, equipmentOpen]);

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

  const onTaskChange = (value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      task_id: value,
    }));
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

  const showTaskModal = () => {
    setModelValue(appModels.TASK);
    setColumns(['id', 'name']);
    setFieldName('task_id');
    setAssetType(formValues.category_type === 'e' ? 'equipment' : 'asset');
    setModalName('Maintenance Checklist');
    setCompanyValue(companies);
    setExtraModal(true);
  };

  const onTaskClear = () => {
    setTaskKeyword(null);
    setFormValues((prevValues) => ({
      ...prevValues,
      task_id: '',
    }));
    setTaskOpen(false);
  };

  const onEquipClear = () => {
    setEquipmentKeyword(null);
    setEquipments([]);
    setEquipmentOpen(false);
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
      setCheckRows([]);
      setIsAllChecked(false);
    }
  };

  const removeData = (id) => {
    const newData = equipments.filter((item) => item.id !== id);
    setEquipments(newData);
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

  const onEquipmentDelete = (id) => {
    setEquipments((prev) => prev.filter((r) => r.id !== id));
  };

  const onSpaceDelete = (id) => {
    setSpaces((prev) => prev.filter((r) => r.id !== id));
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
    setEquipments([]);
    setCheckRows([]);
    setIsAllChecked(false);
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

  const onChecklistChange = (value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      check_list_id: value,
    }));
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

  const getFiledData = (data) => getColumnArrayById(data, 'id');

  const onFetchAssetSchedules = () => {
    setAssetFilterModal(false);
  };

  const categoryOptions = extractOptionsObject(assetCategoriesInfo, formValues.category_id);

  return (
    <Box
      sx={{
        width: '100%',
        maxHeight: '100vh',
        overflow: 'auto',
        marginBottom: '0px',
      }}
    >

      <FormControl
        sx={{
          width: '100%',
          padding: '10px 0px 20px 30px',
          // maxHeight: '600px',
          // overflowY: 'scroll',
          overflow: 'auto',
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
                Type
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
                Configure Inspection By
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
            <Selection
              paramsSet={onChecklistChange}
              setDropdownKeyword1={setCheckKeyword}
              paramsValue={formValues.check_list_id}
              paramsId={Math.random()}
              callData={getPreventiveCheckList}
              callDataFields={{ type: formValues.category_type, category: formValues.ppm_by === 'Space Category' && formValues.category_id && formValues.category_id.id ? formValues.category_id.id : false }}
              dropdownsInfo={checkList}
              dropdownOptions={extractOptionsObject(checkList, formValues.check_list_id)}
              moduleName={appModels.PPMCHECKLIST}
              labelName="Checklist"
              columns={['id', 'name', 'equipment_category_id', 'asset_category_id']}
              advanceSearchHeader="Checklist List"
              infoText="MaintenanceChecklist"
              advanceSearchCondition={`["company_id","in",[${companies}]],["type","=","${formValues.category_type === 'e' ? 'Equipment' : 'Space'}"]${formValues.ppm_by === 'Space Category' && formValues.category_id && formValues.category_id.id ? `,["${formValues.category_type === 'e' ? 'equipment_category_id' : 'asset_category_id'}","=",${formValues.ppm_by === 'Space Category' && formValues.category_id && formValues.category_id.id}]` : `,["${formValues.category_type === 'e' ? 'equipment_category_id' : 'asset_category_id'}","!=",false]`}`}
              isRequired
              sx={{
                marginTop: '10px',
                width: '33%',
              }}
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
          categoryId={getCategoryId()}
          finishText="Add Selected Equipment"
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
          categoryId={getCategoryId()}
          onCancel={() => setSpaceFilterModal(false)}
          finishText="Add Selected Spaces"
        />
        )}
      </div>
      )}
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
              company={companyValue}
              setFieldValue={onTaskSelect}
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
                fields={columns}
                isSingle={editId}
                onAssetChange={onAssetModalChange}
                assetCategory={formValues.category_id && formValues.category_id.id ? formValues.category_id.id : false}
                oldAssets={equipments && equipments.length > 0 ? getFiledData(equipments) : []}
                afterReset={() => { setMultipleModal(false); }}
              />
            </Box>
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
