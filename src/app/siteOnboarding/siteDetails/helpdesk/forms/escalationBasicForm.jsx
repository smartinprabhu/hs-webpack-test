/* eslint-disable max-len */
/* eslint-disable jsx-a11y/heading-has-content */
/* eslint-disable consistent-return */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import {
  CircularProgress,
  TextField,
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import { makeStyles } from '@material-ui/core/styles';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent, DialogContentText,
  Grid,
} from '@mui/material';
import { useFormikContext } from 'formik';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DialogHeader from '../../../../commonComponents/dialogHeader';
import MuiAutoComplete from '../../../../commonComponents/formFields/muiAutocomplete';
import MuiTextField from '../../../../commonComponents/formFields/muiTextField';

import {
  extractOptionsObject, getAllCompanies, getArrayFromValuesById,
  getColumnArrayById,
  isArrayColumnExists,
} from '../../../../util/appUtils';
import {
  getEqipmentCategory,
  getEscalationRecipientList,
  getSpaceCategory,
  getSpaceList,
  setEquipmentId,
  setRecipientsLocationId,
  setSpaceCategoryId,
  setSpaceId,
} from '../../../siteService';
import customData from '../data/customData.json';
import AdvancedSearchModal from './advancedSearchModal';
import SearchModalMultiple from './searchModalMultiple';
// import { getTypeFormLabel } from '../../../utils/utils';

const appModels = require('../../../../util/appModels').default;

const useStyles = makeStyles((themeStyle) => ({
  margin: {
    marginBottom: themeStyle.spacing(1.25),
    width: '100%',
  },
}));

const AddEscalationLevel = React.memo((props) => {
  const {
    editId,
    setFieldValue,
    setFieldTouched,
    formField: {
      title,
      space,
      recipients,
      equipmentCategory,
      spaceCategory,
      types,
      levels,
      incidentCategory,
      accessGroupIds,
    },
  } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const { values: formValues } = useFormikContext();
  const {
    name, location_ids, recipients_ids, category_id, type_category, level, space_category_id, type,
  } = formValues;
  const [spaceOpen, setSpaceOpen] = useState(false);
  const [spaceKeyword, setSpaceKeyword] = useState('');
  const [spaceOptions, setSpaceOptions] = useState([]);
  // const [spaceId, setSpaceId] = useState(location_ids);

  // const [equipmentId, setEquipmentId] = useState(category_id);
  const [equipmentOpen, setEquipmentOpen] = useState(false);
  const [equipmentKeyword, setEquipmentKeyword] = useState('');
  const [equipmentOptions, setEquipmentOptions] = useState([]);

  // const [spaceCategoryId, setSpaceCategoryId] = useState(space_category_id);
  const [spaceCategoryOpen, setSpaceCategoryOpen] = useState(false);
  const [spaceCategoryKeyword, setSpaceCategoryKeyword] = useState('');
  const [spaceCategoryOptions, setSpaceCategoryOptions] = useState([]);

  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [columns, setColumns] = useState(['id', 'name', 'display_name']);
  const [extraModal, setExtraModal] = useState(false);
  const [extraMultipleModal, setExtraMultipleModal] = useState(false);

  // const [recipientsLocationId, setRecipientsLocationId] = useState(recipients_ids);
  const [userOptions, setUserOptions] = useState([]);
  const [userKeyword, setUserKeyword] = useState('');
  const [userOpen, setUserOpen] = useState(false);
  const [checkedRows, setCheckRows] = useState([]);

  const [typeOpen, setTypeOpen] = useState(false);
  const [levelOpen, setLevelOpen] = useState(false);

  const [tempRecipient, setTempRecipient] = useState([]);
  const [tempSpaceId, setTempSpaceId] = useState([]);
  const [tempEquipmentId, setTempEquipmentId] = useState([]);
  const [tempSpaceCategoryId, setTempSpaceCategoryId] = useState([]);

  const { userInfo } = useSelector((state) => state.user);
  const {
    spaceInfo, accessGroupInfo, escalationRecipientsInfo, equipmentInfo, spaceCategoryInfo, recipientsLocationId, spaceId, equipmentId, spaceCategoryId,
  } = useSelector((state) => state.site);

  const companies = getAllCompanies(userInfo);

  useEffect(() => {
    if (editId) {
      dispatch(setRecipientsLocationId(recipients_ids));
      dispatch(setSpaceId(location_ids));
      dispatch(setEquipmentId(category_id));
      dispatch(setSpaceCategoryId(space_category_id));
    }
  }, [editId]);

  useEffect(() => {
    if (recipientsLocationId) {
      setFieldValue('recipients_ids', recipientsLocationId);
    }
  }, [recipientsLocationId]);

  useEffect(() => {
    if (spaceId) {
      setFieldValue('location_ids', spaceId);
    }
  }, [spaceId]);

  useEffect(() => {
    if (equipmentId) {
      setFieldValue('category_id', equipmentId);
    }
  }, [equipmentId]);

  useEffect(() => {
    if (spaceCategoryId) {
      setFieldValue('space_category_id', spaceCategoryId);
    }
  }, [spaceCategoryId]);

  useEffect(() => {
    if (userInfo && userInfo.data && spaceOpen) {
      dispatch(getSpaceList(companies, appModels.SPACE, spaceKeyword));
    }
  }, [userInfo, spaceOpen, spaceKeyword]);

  useEffect(() => {
    if (userInfo && userInfo.data && userOpen) {
      dispatch(getEscalationRecipientList(companies, appModels.PARTNER, userKeyword));
    }
  }, [userInfo, userOpen, userKeyword]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && equipmentOpen) {
        dispatch(getEqipmentCategory(companies, appModels.EQUIPMENTCATEGORY, spaceKeyword));
      }
    })();
  }, [userInfo, equipmentKeyword, equipmentOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && spaceCategoryOpen) {
        dispatch(getSpaceCategory(companies, appModels.ASSETCATEGORY, spaceCategoryKeyword));
      }
    })();
  }, [userInfo, spaceCategoryKeyword, spaceCategoryOpen]);

  const onUserKeywordClear = () => {
    setUserKeyword(null);
    dispatch(setRecipientsLocationId([]));
    setCheckRows([]);
    setUserOpen(false);
  };
  const onSpaceKeywordClear = () => {
    setSpaceKeyword(null);
    dispatch(setSpaceId([]));
    setCheckRows([]);
    setSpaceOpen(false);
  };
  const onEquipmentKeywordClear = () => {
    setEquipmentKeyword(null);
    dispatch(setEquipmentId([]));
    setCheckRows([]);
    setEquipmentOpen(false);
  };

  const onSpaceCategoryKeywordClear = () => {
    setSpaceCategoryKeyword(null);
    setSpaceCategoryId([]);
    setCheckRows([]);
    setSpaceCategoryOpen(false);
  };

  function isAssociativeArray(arr) {
    let result = arr;
    if (isArrayColumnExists(arr, 'id')) {
      result = getColumnArrayById(arr, 'id');
    }
    return result;
  }

  const showUserModal = () => {
    setModelValue(appModels.PARTNER);
    setFieldName('recipients_ids');
    setModalName('Recipient List');
    setColumns(['id', 'name']);
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraMultipleModal(true);
  };

  const showEquipmentModal = () => {
    setModelValue(appModels.EQUIPMENTCATEGORY);
    setFieldName('category_id');
    setModalName('Equipment Category List');
    setColumns(['id', 'name']);
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraMultipleModal(true);
  };

  const showSpaceCategoryModal = () => {
    setModelValue(appModels.ASSETCATEGORY);
    setFieldName('space_category_id');
    setModalName('Space Category List');
    setColumns(['id', 'name']);
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraMultipleModal(true);
  };

  const showSpaceModal = () => {
    setModelValue(appModels.SPACE);
    setFieldName('location_ids');
    setModalName('Space List');
    setColumns(['id', 'name', 'path_name']);
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraMultipleModal(true);
  };

  useEffect(() => {
    if (escalationRecipientsInfo && escalationRecipientsInfo.data && escalationRecipientsInfo.data.length && userOpen) {
      setUserOptions(getArrayFromValuesById(escalationRecipientsInfo.data, isAssociativeArray(recipientsLocationId || []), 'id'));
    } else if (escalationRecipientsInfo && escalationRecipientsInfo.loading) {
      setUserOptions([{ name: 'Loading...' }]);
    } else {
      setUserOptions([]);
    }
  }, [escalationRecipientsInfo, userOpen]);

  useEffect(() => {
    if (equipmentInfo && equipmentInfo.data && equipmentInfo.data.length && equipmentOpen) {
      setEquipmentOptions(getArrayFromValuesById(equipmentInfo.data, isAssociativeArray(equipmentId || []), 'id'));
    } else if (equipmentInfo && equipmentInfo.loading) {
      setEquipmentOptions([{ name: 'Loading...' }]);
    } else {
      setEquipmentOptions([]);
    }
  }, [equipmentInfo, equipmentOpen]);

  useEffect(() => {
    if (spaceCategoryInfo && spaceCategoryInfo.data && spaceCategoryInfo.data.length && spaceCategoryOpen) {
      setSpaceCategoryOptions(getArrayFromValuesById(spaceCategoryInfo.data, isAssociativeArray(spaceCategoryId || []), 'id'));
    } else if (spaceCategoryInfo && spaceCategoryInfo.loading) {
      setSpaceCategoryOptions([{ name: 'Loading...' }]);
    } else {
      setSpaceCategoryOptions([]);
    }
  }, [spaceCategoryInfo, spaceCategoryOpen]);

  useEffect(() => {
    if (spaceInfo && spaceInfo.data && spaceInfo.data.length && spaceOpen) {
      setSpaceOptions(getArrayFromValuesById(spaceInfo.data, isAssociativeArray(spaceId || []), 'id'));
    } else if (spaceInfo && spaceInfo.loading) {
      setSpaceOptions([{ name: 'Loading...' }]);
    } else {
      setSpaceOptions([]);
    }
  }, [spaceInfo, spaceOpen]);

  const handleResipients = (options) => {
    if (options && options.length && options.find((option) => option.name === 'Loading...')) {
      return false;
    }
    dispatch(setRecipientsLocationId(options));
    setCheckRows(options);
  };

  const handleSpace = (options) => {
    if (options && options.length && options.find((option) => option.name === 'Loading...')) {
      return false;
    }
    dispatch(setSpaceId(options));
    setCheckRows(options);
  };

  const handleEquipment = (options) => {
    if (options && options.length && options.find((option) => option.name === 'Loading...')) {
      return false;
    }
    dispatch(setEquipmentId(options));
    setCheckRows(options);
  };

  const handleSpaceCategory = (options) => {
    if (options && options.length && options.find((option) => option.name === 'Loading...')) {
      return false;
    }
    dispatch(setSpaceCategoryId(options));
    setCheckRows(options);
  };

  const showAccessModal = () => {
    setModelValue(appModels.ACCESSGROUPS);
    setFieldName('access_group_ids');
    setModalName('Access Group List');
    setColumns(['id', 'name']);
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraMultipleModal(true);
  };

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

  const showSearchModal = () => {
    setModelValue(appModels.SPACE);
    setFieldName('location_ids');
    setModalName('Space');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraModal(true);
  };

  const onSpaceKeywordChange = (event) => {
    setSpaceKeyword(event.target.value);
  };

  const onCategoryKeywordClear = () => {
    setSpaceKeyword(null);
    setFieldValue('location_ids', '');
    setSpaceOpen(false);
  };

  const showSearchModalIncident = () => {
    setModelValue(appModels.EQUIPMENTCATEGORY);
    setFieldName('category_id');
    setModalName('Incident Type');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraModal(true);
  };

  const onEquipmentKeywordChange = (event) => {
    setEquipmentKeyword(event.target.value);
  };

  // const setLocationIds = (data) => {
  //   const Location = ([...locationId, ...checkedRows]);
  //   const uniqueObjArray = [...new Map(Location.map((item) => [item.id, item])).values()];
  //   dispatch(setLocationId(uniqueObjArray));
  //   setExtraMultipleModal(false);
  //   setCheckRows([]);
  // };

  useEffect(() => {
    dispatch(setRecipientsLocationId(tempRecipient));
  }, [tempRecipient]);

  useEffect(() => {
    dispatch(setSpaceId(tempSpaceId));
  }, [tempSpaceId]);

  useEffect(() => {
    dispatch(setEquipmentId(tempEquipmentId));
  }, [tempEquipmentId]);

  useEffect(() => {
    dispatch(setSpaceCategoryId(tempSpaceCategoryId));
  }, [tempSpaceCategoryId]);

  const setFieldId = () => {
    setExtraMultipleModal(false);
    if (fieldName === 'recipients_ids') {
      const temp = checkedRows.filter((item) => item.fieldName === fieldName);
      setTempRecipient([...recipients_ids, ...temp]);
      setCheckRows([]);
    }
    if (fieldName === 'location_ids') {
      const temp = (checkedRows.filter((item) => item.fieldName === fieldName));
      setTempSpaceId([...location_ids, ...temp]);
      setCheckRows([]);
    }
    if (fieldName === 'category_id') {
      const temp = (checkedRows.filter((item) => item.fieldName === fieldName));
      setTempEquipmentId([...category_id, ...temp]);
      setCheckRows([]);
    }
    if (fieldName === 'space_category_id') {
      const temp = (checkedRows.filter((item) => item.fieldName === fieldName));
      setTempSpaceCategoryId([...space_category_id, ...temp]);
      setCheckRows([]);
    }
  };

  const onUserKeywordSearch = (event) => {
    setUserKeyword(event.target.value);
  };

  const setSpaceKeywordSearch = (event) => {
    setSpaceKeyword(event.target.value);
  };

  const setEquipmentKeywordSearch = (event) => {
    setEquipmentKeyword(event.target.value);
  };

  const setSpaceCategoryKeywordSearch = (event) => {
    setSpaceCategoryKeyword(event.target.value);
  };

  function getInspectionForLabel(data) {
    if (customData && customData.categoryTypeTextForm[data]) {
      const s = customData.categoryTypeTextForm[data].label;
      return s;
    }
    return '';
  }

  function levelLable(staten) {
    if (customData && customData.levelLableText[staten]) {
      const s = customData.levelLableText[staten].label;
      return s;
    }
    return '';
  }

  const oldType = type_category && getInspectionForLabel(type_category)
    ? getInspectionForLabel(type_category) : '';

  const oldLevel = level && levelLable(level)
    ? levelLable(level) : '';

  const categoryOptions = extractOptionsObject(spaceInfo, location_ids);
  const incidentOptions = extractOptionsObject(equipmentInfo, category_id);
  return (
    <>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 4 }}>
        <Grid item xs={12} sm={6} md={6}>
          <MuiTextField
            sx={{
              marginBottom: '20px',
            }}
            name={title.name}
            label={title.label}
            autoComplete="off"
            isRequired
            type="text"
            inputProps={{
              maxLength: 30,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <MuiAutoComplete
            sx={{
              marginBottom: '20px',
            }}
            name={types.name}
            label={types.label}
            className="bg-white"
            open={typeOpen}
            disableClearable
            oldValue={getInspectionForLabel(type_category)}
            value={type_category && type_category.label ? type_category.label : getInspectionForLabel(type_category)}
            size="small"
            onOpen={() => {
              setTypeOpen(true);
            }}
            onClose={() => {
              setTypeOpen(false);
            }}
            getOptionSelected={(option, value) => option.label === value.label}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
            options={customData.type}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                className="without-padding"
                placeholder="Select"
                label={types.label}
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
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <MuiAutoComplete
            sx={{
              marginBottom: '20px',
            }}
            multiple
            filterSelectedOptions
            name="space"
            isRequired
            open={spaceOpen}
            size="small"
            className="bg-white"
            onOpen={() => {
              setSpaceOpen(true);
              setSpaceKeyword('');
            }}
            onClose={() => {
              setSpaceOpen(false);
              setSpaceKeyword('');
            }}
            value={location_ids && location_ids.length > 0 ? location_ids : []}
            defaultValue={spaceId}
            onChange={(e, options) => handleSpace(options)}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={spaceOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label={space.label + '*'}
                className={((getOldData(spaceId)) || (spaceKeyword && spaceKeyword.length > 0))
                  ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                placeholder="Search & Select"
                onChange={(e) => setSpaceKeywordSearch(e.target.value)}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {(spaceInfo && spaceInfo.loading) ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {((spaceKeyword && spaceKeyword.length > 0) || (location_ids && location_ids.length > 0)) && (
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={onSpaceKeywordClear}
                          >
                            <BackspaceIcon fontSize="small" />
                          </IconButton>
                        )}
                        <IconButton
                          aria-label="toggle search visibility"
                          onClick={showSpaceModal}
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
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <MuiAutoComplete
            sx={{
              marginBottom: '20px',
            }}
            multiple
            isRequired
            filterSelectedOptions
            name="categoryuser"
            open={userOpen}
            size="small"
            className="bg-white"
            onOpen={() => {
              setUserOpen(true);
              setUserKeyword('');
            }}
            onClose={() => {
              setUserOpen(false);
              setUserKeyword('');
            }}
            value={recipients_ids && recipients_ids.length > 0 ? recipients_ids : []}
            defaultValue={recipientsLocationId}
            onChange={(e, options) => handleResipients(options)}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={userOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                label={recipients.label + '*'}
                variant="standard"
                className={((getOldData(recipientsLocationId)) || (userKeyword && userKeyword.length > 0))
                  ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                placeholder="Search & Select"
                onChange={(e) => onUserKeywordSearch(e.target.value)}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {(escalationRecipientsInfo && escalationRecipientsInfo.loading) ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {((userKeyword && userKeyword.length > 0) || (recipients_ids && recipients_ids.length > 0)) && (
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={onUserKeywordClear}
                          >
                            <BackspaceIcon fontSize="small" />
                          </IconButton>
                        )}
                        <IconButton
                          aria-label="toggle search visibility"
                          onClick={showUserModal}
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
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <MuiAutoComplete
            sx={{
              marginBottom: '20px',
            }}
            name={levels.name}
            label={levels.label}
            className="bg-white"
            open={levelOpen}
            disableClearable
            oldValue={levelLable(level)}
            value={level && level.label ? level.label : levelLable(level)}
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
                label={levels.label}
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
        </Grid>
        {((type_category.value || type_category) !== 'space' || (type_category.value || type_category) === 'equipment_space')
          ? (
            <Grid item xs={12} sm={6} md={6}>
              <MuiAutoComplete
                sx={{
                  marginBottom: '20px',
                }}
                multiple
                filterSelectedOptions
                name="equipmentCategory"
                open={equipmentOpen}
                size="small"
                className="bg-white"
                onOpen={() => {
                  setEquipmentOpen(true);
                  setEquipmentKeyword('');
                }}
                onClose={() => {
                  setEquipmentOpen(false);
                  setEquipmentKeyword('');
                }}
                value={category_id && category_id.length > 0 ? category_id : []}
                defaultValue={equipmentId}
                onChange={(e, options) => handleEquipment(options)}
                getOptionSelected={(option, value) => option.name === value.name}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                options={equipmentOptions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    label={equipmentCategory.label+'*'}
                    className={((getOldData(category_id)) || (equipmentKeyword && equipmentKeyword.length > 0))
                      ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                    placeholder="Search & Select"
                    onChange={(e) => setEquipmentKeywordSearch(e.target.value)}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {(equipmentInfo && equipmentInfo.loading) ? <CircularProgress color="inherit" size={20} /> : null}
                          <InputAdornment position="end">
                              {((equipmentKeyword && equipmentKeyword.length > 0) || (category_id && category_id.length > 0)) && (
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={onEquipmentKeywordClear}
                              >
                                <BackspaceIcon fontSize="small" />
                              </IconButton>
                              )}
                              <IconButton
                                aria-label="toggle search visibility"
                                onClick={showEquipmentModal}
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
            </Grid>
          ) : '' }
        {(((type_category.value || type_category) !== 'equipment' && (type_category.value || type_category) === 'space') || (type_category.value || type_category) === 'equipment_space')
          ? (
            <Grid item xs={12} sm={6} md={6}>
              <MuiAutoComplete
                sx={{
                  marginBottom: '20px',
                }}
                multiple
                filterSelectedOptions
                name="spaceCategory"
                open={spaceCategoryOpen}
                size="small"
                className="bg-white"
                onOpen={() => {
                  setSpaceCategoryOpen(true);
                  setSpaceCategoryKeyword('');
                }}
                onClose={() => {
                  setSpaceCategoryOpen(false);
                  setSpaceCategoryKeyword('');
                }}
                value={space_category_id && space_category_id.length > 0 ? space_category_id : []}
                defaultValue={spaceCategoryId}
                onChange={(e, options) => handleSpaceCategory(options)}
                getOptionSelected={(option, value) => option.name === value.name}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                options={spaceCategoryOptions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    label={spaceCategory.label+'*'}
                    className={((getOldData(spaceCategoryId)) || (spaceCategoryKeyword && spaceCategoryKeyword.length > 0))
                      ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                    placeholder="Search & Select"
                    onChange={(e) => setSpaceCategoryKeywordSearch(e.target.value)}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {(spaceCategoryInfo && spaceCategoryInfo.loading) ? <CircularProgress color="inherit" size={20} /> : null}
                          <InputAdornment position="end">
                              {((spaceCategoryKeyword && spaceCategoryKeyword.length > 0) || (space_category_id && space_category_id.length > 0)) && (
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={onSpaceCategoryKeywordClear}
                              >
                                <BackspaceIcon fontSize="small" />
                              </IconButton>
                              )}
                              <IconButton
                                aria-label="toggle search visibility"
                                onClick={showSpaceCategoryModal}
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
            </Grid>
          ) : ''}
      </Grid>
      <Dialog size="xl" fullWidth open={extraModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraModal(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <AdvancedSearchModal
              modelName={modelValue}
              afterReset={() => { setExtraModal(false); }}
              fieldName={fieldName}
              fields={columns}
              company={companyValue}
              otherFieldName={otherFieldName}
              otherFieldValue={otherFieldValue}
              setFieldValue={setFieldValue}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Dialog size="xl" fullWidth open={extraMultipleModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraMultipleModal(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <SearchModalMultiple
              modelName={modelValue}
              afterReset={() => { setExtraMultipleModal(false); }}
              fieldName={fieldName}
              fields={columns}
              company={companyValue}
              otherFieldName={otherFieldName}
              otherFieldValue={otherFieldValue}
              setCheckedRows={setCheckRows}
              olCheckedRows={checkedRows && checkedRows.length ? checkedRows : []}
              oldLocationData={recipientsLocationId && recipientsLocationId.length ? recipientsLocationId : []}
              oldSpaceData={spaceId && spaceId.length ? spaceId : []}
              oldEqipmentData={equipmentId && equipmentId.length ? equipmentId : []}
              oldCatData={spaceCategoryId && spaceCategoryId.length ? spaceCategoryId : []}
            />

          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {(checkedRows && checkedRows.length && checkedRows.length > 0)
            ? (
              <Button
                type="button"
                size="sm"
               // onClick={() => { setExtraMultipleModal(false); if (fieldName === 'recipients_ids') { setRecipientsLocationId(checkedRows); } if (fieldName === 'location_ids') { setSpaceId(checkedRows); } if (fieldName === 'category_id') { setEquipmentId(checkedRows); } if (fieldName === 'space_category_id') { setSpaceCategoryId(checkedRows); } }}
                onClick={() => setFieldId()}
                variant="contained"
              >
                {' '}
                Add
              </Button>
            ) : ''}
        </DialogActions>
      </Dialog>
    </>
  );
});

AddEscalationLevel.propTypes = {
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  formField: PropTypes.objectOf([PropTypes.object, PropTypes.string]).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  setFieldTouched: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default AddEscalationLevel;
