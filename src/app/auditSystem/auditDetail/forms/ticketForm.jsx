/* eslint-disable prefer-destructuring */
/* eslint-disable no-nested-ternary */
/* eslint-disable camelcase */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import { CircularProgress, FormHelperText, TextField } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import { Box } from '@mui/system';
import {
  Dialog, DialogContent, DialogContentText,
  Grid, ListItemText, Typography,
} from '@mui/material';
import {
  CheckboxFieldGroup,
} from '@shared/formFields';
import { useFormikContext } from 'formik';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import {
  Label,
} from 'reactstrap';
import DialogHeader from '../../../commonComponents/dialogHeader';
import MuiAutoComplete from '../../../commonComponents/formFields/muiAutocomplete';

import SearchModal1 from '../../../helpdesk/forms/searchModal';
import {
  getEquipmentList,
  getSiteBasedCategory, getSpaceAllSearchList,
} from '../../../helpdesk/ticketService';
import SearchModal from '../../../pantryManagement/forms/searchModal';
import {
  arraySortByString,
  extractOptionsObjectWithName, extractTextObject,
  generateArrayFromValue,
  generateErrorMessage,
  getAllowedCompanies,
} from '../../../util/appUtils';

const appModels = require('../../../util/appModels').default;

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
  const {
    setFieldValue,
    formField: {
      typeCategory,
      equipmentId,
      categoryId,
      subCategorId,
      assetId,
    },
  } = props;
  const { values: formValues } = useFormikContext();
  const {
    category_id, sub_category_id, space_id,
    equipment_id, type_category,
  } = formValues;
  const classes = useStyles();

  const [subCategoryKeyword, setSubCategoryKeyword] = useState('');
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categoryKeyword, setCategoryKeyword] = useState('');
  const [subCategoryOpen, setSubCategoryOpen] = useState(false);
  const [ticketType, setTicketType] = useState('equipment');

  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);

  const [spaceOpen, setSpaceOpen] = useState(false);
  const [spaceKeyword, setSpaceKeyword] = useState('');

  const [extraModal, setExtraModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [placeholderName, setPlaceholder] = useState('');
  const [columns, setColumns] = useState(['id', 'name', 'work_phone', 'work_email']);

  const [extraModal1, setExtraModal1] = useState(false);

  const [equipmentOpen, setEquipmentOpen] = useState(false);
  const [equipmentKeyword, setEquipmentKeyword] = useState('');

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);

  const { equipmentInfo, spaceInfoList, siteCategoriesInfo } = useSelector((state) => state.ticket);

  const type = false;

  useEffect(() => {
    (async () => {
      if (type_category) {
        setTicketType(type_category);
      }
    })();
  }, [type_category]);

  const onSpaceKeyWordChange = (event) => {
    setSpaceKeyword(event.target.value);
  };

  function getSpaceCatId() {
    let res = false;
    if (space_id.asset_category_id && space_id.asset_category_id.length && ticketType === 'asset') {
      res = space_id.asset_category_id[0];
    } else if (space_id.asset_category_id && space_id.asset_category_id.id && ticketType === 'asset') {
      res = space_id.asset_category_id.id;
    } else if (ticketType === 'equipment' && equipment_id && equipment_id.category_id && equipment_id.category_id.length && equipment_id.category_id.length > 0) {
      res = equipment_id.category_id[0];
    }
    return res;
  }

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && categoryOpen && getSpaceCatId()) {
        const catId = getSpaceCatId();
        await dispatch(getSiteBasedCategory(ticketType, catId, type, companies));
      }
    })();
  }, [userInfo, space_id, equipment_id, categoryOpen]);

  useEffect(() => {
    if (userInfo && userInfo.data && spaceOpen) {
      const keywordTrim = spaceKeyword ? encodeURIComponent(spaceKeyword.trim()) : '';
      dispatch(getSpaceAllSearchList(companies, appModels.SPACE, keywordTrim));
    }
  }, [userInfo, spaceKeyword, spaceOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && equipmentOpen) {
        await dispatch(getEquipmentList(companies, appModels.EQUIPMENT, equipmentKeyword));
      }
    })();
  }, [userInfo, equipmentKeyword, equipmentOpen]);

  const onKeywordChange = (event) => {
    setCategoryKeyword(event.target.value);
  };

  const onSubKeywordChange = (event) => {
    setSubCategoryKeyword(event.target.value);
  };

  const onSubCategoryKeywordClear = () => {
    setSubCategoryKeyword(null);
    setFieldValue('sub_category_id', '');
    setSubCategoryOpen(false);
  };

  const onCategoryKeywordClear = () => {
    setCategoryKeyword(null);
    setFieldValue('category_id', '');
    setFieldValue('sub_category_id', '');
    setCategoryOpen(false);
  };

  const onSpaceClear = () => {
    setSpaceKeyword(null);
    setFieldValue('space_id', '');
    setFieldValue('category_id', '');
    setFieldValue('sub_category_id', '');
    setSpaceOpen(false);
  };

  const showSpaceModal = () => {
    setModelValue(appModels.SPACE);
    setColumns(['id', 'name', 'path_name', 'space_name', 'asset_category_id']);
    setFieldName('space_id');
    setModalName('Space List');
    setPlaceholder('Spaces');
    setCompanyValue(companies);
    setExtraModal(true);
  };

  const showEquipmentModal = () => {
    setModelValue(appModels.EQUIPMENT);
    setFieldName('equipment_id');
    setModalName('Equipments');
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setColumns(['id', 'name', 'location_id', 'category_id']);
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setExtraModal1(true);
  };

  const onEquipmentKeywordClear = () => {
    setEquipmentKeyword(null);
    setFieldValue('equipment_id', '');
    setFieldValue('category_id', '');
    setFieldValue('sub_category_id', '');
    setEquipmentOpen(false);
  };

  const onEquipmentKeywordChange = (event) => {
    setEquipmentKeyword(event.target.value);
  };

  let equipmentOptions = [];

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

  let categoryOptions = [];
  let subCategoryOptions = [];

  if (siteCategoriesInfo && siteCategoriesInfo.loading) {
    categoryOptions = [{ name: 'Loading..' }];
  }
  if (category_id && category_id.length && category_id.length > 0) {
    const oldId = [{ id: category_id[0], name: category_id[1] }];
    const newArr = [...categoryOptions, ...oldId];
    categoryOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
    categoryOptions = arraySortByString(categoryOptions, 'name');
  }
  if (siteCategoriesInfo && siteCategoriesInfo.data) {
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
  if (siteCategoriesInfo && siteCategoriesInfo.data && category_id && category_id.id) {
    const subData = generateArrayFromValue(siteCategoriesInfo.data, 'id', category_id.id);
    let loadedSubData = [];
    if (!type) {
      loadedSubData = subData && subData.length ? subData[0].sub_category_id : [];
    } else {
      loadedSubData = subData && subData.length ? subData[0].subcategory_ids : [];
    }
    const arr = [...subCategoryOptions, ...loadedSubData];
    subCategoryOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
    subCategoryOptions = arraySortByString(subCategoryOptions, 'name');
  }
  if (siteCategoriesInfo && siteCategoriesInfo.err) {
    subCategoryOptions = [];
  }

  const spaceOptions = extractOptionsObjectWithName(spaceInfoList, space_id, 'path_name');

  function getOldData(oldData) {
    return oldData && oldData.path_name ? oldData.path_name : '';
  }

  const resetEquipment = () => {
    setFieldValue('equipment_id', '');
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

  return (
    <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 4 }}>
      <Grid item xs={12} sm={6} md={6}>
        <Label for={typeCategory.name} className="m-1">
          Type
          <span className="ml-1 text-danger">*</span>
        </Label>
        <br />
        <div className="ml-2">
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
            label={typeCategory.label1}
          />
        </div>
      </Grid>
      {ticketType === 'equipment'
        ? (
          <Grid item xs={12} sm={6} md={6}>
            <MuiAutoComplete
              name={equipmentId.name}
              label={equipmentId.label}
              formGroupClassName="m-1"
              isRequired
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
              options={equipmentOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={onEquipmentKeywordChange}
                  variant="standard"
                  label={equipmentId.label}
                  placeholder="Search & Select"
                  value={equipmentKeyword}
                  className={((oldEquipId) || (equipment_id && equipment_id.id) || (equipmentKeyword && equipmentKeyword.length > 0))
                    ? 'without-padding custom-icons bg-white' : 'bg-white without-padding custom-icons2'}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {equipmentInfo && equipmentInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        <InputAdornment position="end">
                          {((oldEquipId) || (equipment_id && equipment_id.id) || (equipmentKeyword && equipmentKeyword.length > 0)) && (
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={onEquipmentKeywordClear}
                            >
                              <IoCloseOutline size={22} fontSize="small" />
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
            {(equipmentInfo && equipmentInfo.err && equipmentOpen) && (<FormHelperText><span className="text-danger">{generateErrorMessage(equipmentInfo)}</span></FormHelperText>)}
          </Grid>
        )
        : (
          <Grid item xs={12} sm={6} md={6}>
            <MuiAutoComplete
              name={assetId.name}
              label={assetId.label}
              isRequired
              formGroupClassName="m-1"
              oldValue={getOldData(space_id)}
              value={space_id && space_id.path_name ? space_id.path_name : getOldData(space_id)}
              apiError={(spaceInfoList && spaceInfoList.err) ? generateErrorMessage(spaceInfoList) : false}
              open={spaceOpen}
              size="small"
              onOpen={() => {
                setSpaceOpen(true);
                setSpaceKeyword('');
              }}
              onClose={() => {
                setSpaceOpen(false);
                setSpaceKeyword('');
              }}
              classes={{
                option: classes.option,
              }}
              loading={spaceInfoList && spaceInfoList.loading}
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
                          {option.name || option.space_name}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography
                          sx={{
                            font: 'Suisse Intl',
                            fontSize: '12px',
                          }}
                        >
                          {option.path_name && (
                          <>
                            {option.path_name}
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
                          {option.asset_category_id && (
                          <>
                            {extractTextObject(option.asset_category_id)}
                          </>
                          )}
                        </Typography>
                      </Box>
                    </>
                                  )}
                />
              )}
              options={spaceOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={onSpaceKeyWordChange}
                  variant="standard"
                  label={assetId.label}
                  value={spaceKeyword}
                  className={((getOldData(space_id)) || (space_id && space_id.id) || (spaceKeyword && spaceKeyword.length > 0))
                    ? 'without-padding custom-icons bg-white' : 'without-padding custom-icons2 bg-white'}
                  placeholder="Search & Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {spaceInfoList && spaceInfoList.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        <InputAdornment position="end">
                          {((getOldData(space_id)) || (space_id && space_id.id) || (spaceKeyword && spaceKeyword.length > 0)) && (
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={onSpaceClear}
                            >
                              <IoCloseOutline size={22} fontSize="small" />
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
        )}
      <Grid item xs={12} sm={6} md={6}>
        <MuiAutoComplete
          name={categoryId.name}
          label={categoryId.label}
          isRequired
          formGroupClassName="m-1"
          open={categoryOpen}
          size="small"
          oldvalue={oldCatId}
          value={category_id && category_id.name ? category_id.name : oldCatId}
          onOpen={() => {
            setCategoryOpen(true);
            setCategoryKeyword('');
          }}
          onClose={() => {
            setCategoryOpen(false);
            setCategoryKeyword('');
          }}
          loading={siteCategoriesInfo && siteCategoriesInfo.loading}
          getOptionSelected={(option, value) => option.name === value.name}
          getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
          options={categoryOptions}
          renderInput={(params) => (
            <TextField
              {...params}
              onChange={onKeywordChange}
              variant="standard"
              label={categoryId.label}
              value={categoryKeyword}
              className={((oldCatId) || (category_id && category_id.id) || (categoryKeyword && categoryKeyword.length > 0))
                ? 'without-padding custom-icons bg-white' : 'bg-white without-padding custom-icons2'}
              placeholder="Select"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {siteCategoriesInfo && siteCategoriesInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                    <InputAdornment position="end">
                      {((oldCatId) || (category_id && category_id.id) || (categoryKeyword && categoryKeyword.length > 0)) && (
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={onCategoryKeywordClear}
                        >
                          <IoCloseOutline size={22} fontSize="small" />
                        </IconButton>
                      )}
                    </InputAdornment>
                  </>
                ),
              }}
            />
          )}
        />
        {(siteCategoriesInfo && siteCategoriesInfo.err && categoryOpen) && (<FormHelperText><span className="text-danger">{generateErrorMessage(siteCategoriesInfo)}</span></FormHelperText>)}
      </Grid>
      <Grid item xs={12} sm={6} md={6}>
        <MuiAutoComplete
          name={subCategorId.name}
          label={subCategorId.label}
          isRequired
          disabled={!((category_id && category_id.id) || (oldCatId))}
          formGroupClassName="m-1"
          open={subCategoryOpen}
          size="small"
          oldvalue={oldSubCatId}
          value={sub_category_id && sub_category_id.name ? sub_category_id.name : oldSubCatId}
          onOpen={() => {
            setSubCategoryOpen(true);
            setSubCategoryKeyword('');
          }}
          onClose={() => {
            setSubCategoryOpen(false);
            setSubCategoryKeyword('');
          }}
          loading={siteCategoriesInfo && siteCategoriesInfo.loading}
          getOptionSelected={(option, value) => option.name === value.name}
          getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
          options={subCategoryOptions}
          renderInput={(params) => (
            <TextField
              {...params}
              onChange={onSubKeywordChange}
              variant="standard"
              label={subCategorId.label}
              className={((oldSubCatId) || (sub_category_id && sub_category_id.id) || (subCategoryKeyword && subCategoryKeyword.length > 0))
                ? 'without-padding custom-icons bg-white' : 'bg-white without-padding custom-icons2'}
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
                          <IoCloseOutline size={22} fontSize="small" />
                        </IconButton>
                      )}
                    </InputAdornment>
                  </>
                ),
              }}
            />
          )}
        />
        {(siteCategoriesInfo && siteCategoriesInfo.err && subCategoryOpen) && (<FormHelperText><span className="text-danger">{generateErrorMessage(siteCategoriesInfo)}</span></FormHelperText>)}
      </Grid>
      <Dialog size="xl" fullWidth open={extraModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraModal(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <SearchModal
              modelName={modelValue}
              afterReset={() => { setExtraModal(false); }}
              fieldName={fieldName}
              fields={columns}
              company={companyValue}
              placeholderName={placeholderName}
              setFieldValue={setFieldValue}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Dialog size="xl" fullWidth open={extraModal1}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraModal1(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <SearchModal1
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
    </Grid>
  );
};

BasicForm.propTypes = {
  formField: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  editId: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]).isRequired,
  spaceCategoryId: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]).isRequired,
  setFieldTouched: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default BasicForm;
