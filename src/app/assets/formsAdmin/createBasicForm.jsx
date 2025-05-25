/* eslint-disable camelcase */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import {
  CircularProgress,
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import {
  Dialog, DialogContent, DialogContentText,
  TextField, Autocomplete,
} from '@mui/material';
import { Box } from '@mui/system';
import 'antd/dist/antd.css';
import { useFormikContext } from 'formik';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import {
  faTrashAlt
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import makeStyles from '@mui/styles/makeStyles';
import DialogHeader from '../../commonComponents/dialogHeader';
import MuiAutoComplete from '../../commonComponents/formFields/muiAutocomplete';
import { infoValue } from '../../adminSetup/utils/utils';

import { getCascader } from '../../helpdesk/ticketService';
import { addChildrens, addParents } from '../../helpdesk/utils/utils';
import { getAllowedCompanies, avoidSpaceOnFirstCharacter, getOldData } from '../../util/appUtils';
import {
  getBuildings,
  getCategoryList, getTeamList, getUNSPSCCodes, getUNSPSCOtherCodes,
} from '../equipmentService';
import AdvancedSearchModal from './advancedSearchModal';
import customData from '../../adminSetup/assetsLocationConfiguration/addLocation/data/companyData.json';

const appModels = require('../../util/appModels').default;

const useStyles = makeStyles({
  root: {
    '& .MuiFormLabel-asterisk': {
      color: 'red',
    },
  },
});

const CreateBasicForm = (props) => {
  const {
    setFieldValue,
    reloadSpace,
    spaceId,
    pathName,
    isGlobalITAsset,
    values,
    index,
    formData,
    setPartsData,
    partsData,
    setPartsAdd,
    formField: {
      Name,
      categoryId,
      maintenanceTeamId,
      locationId,
      equipmentNumber,
      commodityId,
      familyId,
      classId,
      segmentId,
      categoryType,
    },
  } = props;
  const { values: formValues } = useFormikContext();
  const dispatch = useDispatch();
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [teamOpen, setTeamOpen] = useState(false);
  const [categoryKeyword, setCategoryKeyword] = useState('');
  const [teamKeyword, setTeamKeyword] = useState('');
  const [cascaderValues, setCascaderValues] = useState([]);
  const [childValues, setChildValues] = useState([]);
  const [unspscOpen, setUnspscOpen] = useState(false);
  const [unspscKeyword, setUnspscKeyword] = useState('');
  const [typeOpen, setTypeOpen] = useState(false);
  const [refresh, setRefresh] = useState(reloadSpace);
  const classes = useStyles();
  // const { values: formValues } = useFormikContext();
  const {
    commodity_id,
    location_id,
    maintenance_team_id,
    category_id,
  } = formValues;

  const [parentId, setParentId] = useState('');
  const [spaceIds, setSpaceIds] = useState(false);
  const [childLoad, setChildLoad] = useState(false);

  const [extraModal, setExtraModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [placeholderName, setPlaceholder] = useState('');
  const [columns, setColumns] = useState(['id', 'name']);

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const {
    spaceCascader,
  } = useSelector((state) => state.ticket);
  const {
    categoriesInfo, teamsInfo, unspscCodes, unspscOtherCodes, buildingsInfo, buildingSpaces,
  } = useSelector((state) => state.equipment);

  useEffect(() => {
    setRefresh(refresh);
  }, [refresh]);

  useEffect(() => {
    (async () => {
      if (userInfo.data && typeof categoryOpen === 'number') {
        await dispatch(getCategoryList(companies, appModels.EQUIPMENTCATEGORY, categoryKeyword));
      }
    })();
  }, [categoryOpen, categoryKeyword]);

  useEffect(() => {
    (async () => {
      if (userInfo.data && typeof teamOpen === 'number') {
        await dispatch(getTeamList(companies, appModels.TEAM, teamKeyword, false, ['name']));
      }
    })();
  }, [teamOpen, teamKeyword]);

  useEffect(() => {
    if (userInfo && userInfo.data && unspscOpen) {
      if (unspscKeyword && unspscKeyword.length > 2) {
        dispatch(getUNSPSCCodes(companies, appModels.UNSPSC, unspscKeyword));
      } else {
        dispatch(getUNSPSCCodes(companies, appModels.UNSPSC, unspscKeyword));
      }
    }
  }, [unspscOpen, unspscKeyword]);

  useEffect(() => {
    if (userInfo && userInfo.data && commodity_id && commodity_id.id) {
      dispatch(getUNSPSCOtherCodes(companies, appModels.UNSPSC, commodity_id.id));
    }
  }, [userInfo, commodity_id]);

  useEffect(() => {
    if (unspscOtherCodes && unspscOtherCodes.data && commodity_id && commodity_id.id) {
      setFieldValue(familyId.name, unspscOtherCodes.data[0].family_id);
      setFieldValue(classId.name, unspscOtherCodes.data[0].class_id);
      setFieldValue(segmentId.name, unspscOtherCodes.data[0].segment_id);
    } else {
      setFieldValue('family_id', '');
      setFieldValue('class_id', '');
      setFieldValue('segment_id', '');
      setUnspscKeyword('');
    }
  }, [unspscOtherCodes, commodity_id]);

  const onFieldClear = (field) => {
    const newData = partsData;
    newData[index][field] = '';
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  const onCategoryKeywordChange = (event) => {
    setCategoryKeyword(event.target.value);
  };

  const onTeamKeywordChange = (event) => {
    setTeamKeyword(event.target.value);
  };

  const onUnspscKeywordChange = (event) => {
    setUnspscKeyword(event.target.value);
  };

  const showCategoryModal = () => {
    setModelValue(appModels.EQUIPMENTCATEGORY);
    setColumns(['id', 'name', 'path_name']);
    setFieldName('category_id');
    setModalName('Category List');
    setPlaceholder('Categories');
    setCompanyValue(companies);
    setExtraModal(true);
  };

  const onCategoryClear = () => {
    setCategoryKeyword(null);
    onFieldClear('category_id');
    setCategoryOpen(false);
  };

  const showCommodityModal = () => {
    setModelValue(appModels.UNSPSC);
    setColumns(['id', 'name']);
    setFieldName('commodity_id');
    setModalName('UNSPSC List');
    setPlaceholder('Commodities');
    setCompanyValue(companies);
    setExtraModal(true);
  };

  const onCommodityClear = () => {
    setUnspscKeyword(null);
    setFieldValue('commodity_id', '');
    setFieldValue('family_id', '');
    setFieldValue('class_id', '');
    setFieldValue('segment_id', '');
    setFieldValue('commodity_id', '');
    setUnspscOpen(false);
  };

  const showTeamModal = () => {
    setModelValue(appModels.TEAM);
    setColumns(['id', 'name']);
    setFieldName('maintenance_team_id');
    setModalName('Team List');
    setPlaceholder('Maintenance Teams');
    setCompanyValue(companies);
    setExtraModal(true);
  };

  const onTeamClear = () => {
    setTeamKeyword(null);
    onFieldClear('maintenance_team_id');
    setTeamOpen(false);
  };

  let categoryOptions = [];
  let teamOptions = [];
  const unspscOptions = [];

  if (categoriesInfo && categoriesInfo.loading) {
    categoryOptions = [{ path_name: 'Loading..' }];
  }
  if (categoriesInfo && categoriesInfo.data) {
    categoryOptions = categoriesInfo.data;
  }

  if (teamsInfo && teamsInfo.loading) {
    teamOptions = [{ name: 'Loading..' }];
  }
  if (teamsInfo && teamsInfo.data) {
    teamOptions = teamsInfo.data;
  }

  const removeData = (e, index) => {
    const newData = partsData;
    const { id } = newData[index];
    if (id) {
      newData[index].isRemove = true;
      setPartsData(newData);
      setPartsAdd(Math.random());
    } else {
      newData.splice(index, 1);
      setPartsData(newData);
      setPartsAdd(Math.random());
    }
  };

  const onDropdownChange = (e, indexV, field, name) => {
    const newData = partsData;
    newData[indexV][field] = { id: e.id, [name]: name ? e[name] : e.name };
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

  const onTextFieldChange = (e, indexV, field) => {
    const newData = partsData;
    newData[indexV][field] = e.target.value;
    setPartsData(newData);
    setPartsAdd(Math.random());
  };

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
          <TextField
            variant="standard"
            size="small"
            type="text"
            sx={{
              width: '30%',
              marginBottom: '20px',
            }}
            name={Name.name}
            label={(
              <>
                Name
                <span className="text-danger ml-1">*</span>
                {infoValue('assetName')}
              </>
                )}
            className="bg-white"
           // value={formData.name}
            value={`${customData?.facilityData?.manage_equipment?.prefix || ''}${formData?.name || ''}`}
            InputLabelProps={{ shrink: true }}
            //onChange={(e) => onTextFieldChange(e, index, 'name')}
            onChange={(e) => {
              const prefix = customData?.facilityData?.manage_equipment?.prefix || '';
              const newValue = e.target.value;
              if (!newValue.startsWith(prefix)) return;
              const updatedSpaceName = newValue.slice(prefix.length);
              onTextFieldChange({ target: { value: updatedSpaceName } }, index, 'name');
            }}
            onKeyDown={formData && formData.name ? '' : avoidSpaceOnFirstCharacter}
            inputProps={{ maxLength: 150 }}
          />
          <Autocomplete
            sx={{
              width: '30%',
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            size="small"
            name={categoryId.name}
            label={categoryId.label}
            value={formData.category_id && formData.category_id.path_name ? formData.category_id.path_name : ''}
            open={categoryOpen === index}
            onOpen={() => {
              setCategoryOpen(index);
              setCategoryKeyword('');
            }}
            onClose={() => {
              setCategoryOpen(false);
              setCategoryKeyword('');
            }}
            loading={categoriesInfo && categoriesInfo.loading}
            isOptionEqualToValue={(option, value) => option.path_name === value.path_name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.path_name)}
            options={categoryOptions}
            onChange={(e, data) => { onDropdownChange(data, index, 'category_id', 'path_name'); }}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onCategoryKeywordChange}
                variant="standard"
                InputLabelProps={{ shrink: true }}
                className={formData.category_id && formData.category_id.id ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                label={(
                  <>
                    Category
                    <span className="text-danger ml-1">*</span>
                    {infoValue('category_id')}
                  </>
                    )}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {categoriesInfo && categoriesInfo.loading && categoryOpen === index ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {formData.category_id && formData.category_id.id && (

                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={onCategoryClear}
                        >
                          <IoCloseOutline size={22} fontSize="small" />
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
          <Autocomplete
            size="small"
            sx={{
              width: '28%',
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            name={maintenanceTeamId.name}
            label={maintenanceTeamId.label}
            value={formData.maintenance_team_id && formData.maintenance_team_id.name ? formData.maintenance_team_id.name : ''}
            open={teamOpen === index}
            onOpen={() => {
              setTeamOpen(index);
              setTeamKeyword('');
            }}
            onClose={() => {
              setTeamOpen(false);
              setTeamKeyword('');
            }}
            loading={teamsInfo && teamsInfo.loading}
            isOptionEqualToValue={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={teamOptions}
            onChange={(e, data) => { onDropdownChange(data, index, 'maintenance_team_id', 'name'); }}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onTeamKeywordChange}
                variant="standard"
                InputLabelProps={{ shrink: true }}
                className={formData.maintenance_team_id && formData.maintenance_team_id.id ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                label={(
                  <>
                    Maintenance Team
                    <span className="text-danger ml-1">*</span>
                    {infoValue('assetteam')}
                  </>
                    )}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {teamsInfo && teamsInfo.loading && teamOpen === index ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {formData.maintenance_team_id && formData.maintenance_team_id.id && (

                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={onTeamClear}
                        >
                          <IoCloseOutline size={22} fontSize="small" />
                        </IconButton>
                        )}
                        <IconButton
                          aria-label="toggle search visibility"
                          onClick={showTeamModal}
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
          <Box
            sx={{
              marginBottom: '20px',
            }}
          >
            <FontAwesomeIcon className="mr-1 ml-1 cursor-pointer" size="lg" icon={faTrashAlt} onClick={(e) => { removeData(e, index); }} />
          </Box>
        </Box>
      </Box>
      <Dialog maxWidth="lg" open={extraModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraModal(false); }} sx={{ width: '1000px' }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <AdvancedSearchModal
              modelName={modelValue}
              afterReset={() => { setExtraModal(false); }}
              fieldName={fieldName}
              fields={columns}
              company={companyValue}
              placeholderName={placeholderName}
              setFieldValue={setFieldValue}
              setPartsData={setPartsData}
              partsData={partsData}
              index={index}
              setPartsAdd={setPartsAdd}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
};

CreateBasicForm.defaultProps = {
  spaceId: false,
  pathName: false,
  isGlobalITAsset: false,
};

CreateBasicForm.propTypes = {
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  reloadSpace: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  spaceId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]),
  pathName: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
  isGlobalITAsset: PropTypes.bool,
};

export default CreateBasicForm;
