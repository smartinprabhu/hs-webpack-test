/* eslint-disable import/no-unresolved */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { TextField, CircularProgress, FormHelperText } from '@material-ui/core';
import {
  Row, Col,
} from 'reactstrap';
import { ThemeProvider } from '@material-ui/core/styles';
import { useFormikContext } from 'formik';

import InputAdornment from '@material-ui/core/InputAdornment';
import BackspaceIcon from '@material-ui/icons/Backspace';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';

import {
  Dialog, DialogContent, DialogContentText,
  Typography,
} from '@mui/material';
import { AddThemeColor } from '../../../themes/theme';
import MuiAutoComplete from '../../../commonComponents/formFields/muiAutocomplete';
import MuiTextField from '../../../commonComponents/formFields/muiTextField';
import DialogHeader from '../../../commonComponents/dialogHeader';
import { getAssetCategoryList } from '../../ppmService';
import preventiveActions from '../../data/preventiveActions.json';
import theme from '../../../util/materialTheme';
import { getCategoryList } from '../../../assets/equipmentService';
import { decimalKeyPress, generateErrorMessage, getAllowedCompanies } from '../../../util/appUtils';
import SearchModal from './searchModal';

const appModels = require('../../../util/appModels').default;

const RequestorForm = (props) => {
  const {
    reloadData,
    setFieldValue,
    formField: {
      title,
      categoryType,
      assetCategoryId,
      equipmentCategoryId,
      maintenanceType,
      duration,
    },
  } = props;
  const { values: formValues } = useFormikContext();
  const {
    maintenance_type, type_category, asset_category_id, category_id,
  } = formValues;
  const dispatch = useDispatch();
  const [assetOpen, setAssetOpen] = useState(false);
  const [equipmentOpen, setEquipmentOpen] = useState(false);
  const [ppmForOpen, setPpmForOpen] = useState(false);
  const [ppmForValue, setPpmForValue] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [assetkeyword, setAssetKeyword] = useState('');
  const [equipmentkeyword, setEquipmentkeyword] = useState('');
  const [fieldName, setFieldName] = useState('');
  const [openEquipmentSearchModal, setOpenEquipmentSearchModal] = useState(false);
  const [modalName, setModalName] = useState('');
  const [serchFieldValue, setSearchFieldValue] = useState('');
  const [refresh, setRefresh] = useState(reloadData);

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const { assetCategoriesInfo } = useSelector((state) => state.ppm);
  const {
    categoriesInfo,
  } = useSelector((state) => state.equipment);

  useEffect(() => {
    setRefresh(reloadData);
  }, [reloadData]);

  useEffect(() => {
    (async () => {
      if (type_category && type_category.value) {
        setPpmForValue(type_category.value);
        if (refresh === '1') {
          setFieldValue('category_id', '');
          setFieldValue('asset_category_id', '');
        }
      } else if (type_category) {
        setPpmForValue(type_category);
      }
    })();
  }, [type_category, refresh]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && assetOpen) {
        await dispatch(getAssetCategoryList(companies, appModels.ASSETCATEGORY, assetkeyword));
      }
    })();
  }, [assetOpen, assetkeyword]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && equipmentOpen) {
        await dispatch(getCategoryList(companies, appModels.EQUIPMENTCATEGORY, equipmentkeyword));
      }
    })();
  }, [equipmentOpen, equipmentkeyword]);

  const onEquipemntSearch = () => {
    setOpenEquipmentSearchModal(true);
    setFieldName('category_id');
    setModalName('Equipment Categories');
    setSearchFieldValue('path_name');
  };

  const onAssetSearch = () => {
    setOpenEquipmentSearchModal(true);
    setFieldName('asset_category_id');
    setModalName('Space Categories');
    setSearchFieldValue('name');
  };

  const onAssetClear = () => {
    setAssetOpen(false);
    setAssetKeyword(null);
    setFieldValue('asset_category_id', '');
  };
  const onEquipmentClear = () => {
    setEquipmentkeyword(null);
    setEquipmentOpen(false);
    setFieldValue('category_id', '');
  };

  const onAssetKeywordChange = (event) => {
    setAssetKeyword(event.target.value);
  };

  const onEquipmentKeywordChange = (event) => {
    setEquipmentkeyword(event.target.value);
  };

  let categoryOptions = [];
  let assetCategoryOptions = [];

  if (categoriesInfo && categoriesInfo.loading) {
    categoryOptions = [{ path_name: 'Loading..' }];
  }
  if (category_id && category_id.length && category_id.length > 0) {
    const oldId = [{ id: category_id[0], path_name: category_id[1] }];
    const newArr = [...categoryOptions, ...oldId];
    categoryOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  if (categoriesInfo && categoriesInfo.data) {
    categoryOptions = categoriesInfo.data;
  }
  if (categoriesInfo && categoriesInfo.err) {
    categoryOptions = [];
  }

  if (assetCategoriesInfo && assetCategoriesInfo.loading) {
    assetCategoryOptions = [{ name: 'Loading..' }];
  }
  if (asset_category_id && asset_category_id.length && asset_category_id.length > 0) {
    const oldId = [{ id: asset_category_id[0], name: asset_category_id[1] }];
    const newArr = [...assetCategoryOptions, ...oldId];
    assetCategoryOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }
  if (assetCategoriesInfo && assetCategoriesInfo.data) {
    assetCategoryOptions = assetCategoriesInfo.data;
  }
  if (assetCategoriesInfo && assetCategoriesInfo.err) {
    assetCategoryOptions = [];
  }

  const oldCatId = category_id && category_id.length && category_id.length > 0 ? category_id[1] : '';
  const oldAssetCatId = asset_category_id && asset_category_id.length && asset_category_id.length > 0 ? asset_category_id[1] : '';
  const oldTc = type_category && preventiveActions && preventiveActions.typeCategoryText && preventiveActions.typeCategoryText[type_category]
    ? preventiveActions.typeCategoryText[type_category].label : '';
  const oldMt = maintenance_type && preventiveActions && preventiveActions.maintenanceTypeText && preventiveActions.maintenanceTypeText[maintenance_type]
    ? preventiveActions.maintenanceTypeText[maintenance_type].label : '';

  return (
    <>
      <Typography
        sx={AddThemeColor({
          font: 'normal normal medium 20px/24px Suisse Intl',
          letterSpacing: '0.7px',
          fontWeight: 500,
          marginBottom: '10px',
          marginTop: '10px',
          paddingBottom: '4px',
        })}
      >
        Maintenance Information
      </Typography>
      <ThemeProvider theme={theme}>
        <Row className="ml-2">
          <Col xs={12} sm={12} md={6} lg={6}>
            <MuiTextField
              sx={{
                marginBottom: '20px',
              }}
              name={title.name}
              placeholder="Enter Title"
              label={title.label}
              isRequired={title.required}
              type="text"
            />
          </Col>
        </Row>
        <Row className="ml-2">
          <Col xs={12} sm={6} md={6} lg={6}>
            <MuiAutoComplete
              sx={{
                marginBottom: '20px',
              }}
              name={categoryType.name}
              isRequired={categoryType.required}
              label={categoryType.label}
              className="bg-white"
              oldValue={oldTc}
              value={type_category && type_category.label ? type_category.label : oldTc}
              open={ppmForOpen}
              size="small"
              onOpen={() => {
                setPpmForOpen(true);
              }}
              onClose={() => {
                setPpmForOpen(false);
              }}
              getOptionSelected={(option, value) => option.label === value.label}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
              options={preventiveActions.typeCategory}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label={categoryType.label}
                  required
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
          </Col>
          {ppmForValue === 'asset'
            ? (
              <Col xs={12} sm={6} md={6} lg={6}>
                <MuiAutoComplete
                  sx={{
                    marginBottom: '20px',
                  }}
                  name={assetCategoryId.name}
                  label={assetCategoryId.label}
                  className="bg-white"
                  open={assetOpen}
                  size="small"
                  oldValue={oldAssetCatId}
                  value={asset_category_id && asset_category_id.name ? asset_category_id.name : oldAssetCatId}
                  onOpen={() => {
                    setAssetOpen(true);
                    setAssetKeyword('');
                  }}
                  onClose={() => {
                    setAssetOpen(false);
                    setAssetKeyword('');
                  }}
                  loading={assetCategoriesInfo && assetCategoriesInfo.loading}
                  getOptionSelected={(option, value) => (value.length > 0 ? option.name === value.name : '')}
                  getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                  options={assetCategoryOptions}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      value={assetkeyword}
                      label={assetCategoryId.label}
                      onChange={onAssetKeywordChange}
                      variant="standard"
                      className={((oldAssetCatId) || (asset_category_id && asset_category_id.id) || (assetkeyword && assetkeyword.length > 0))
                        ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                      placeholder="Search & Select"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {assetCategoriesInfo && assetCategoriesInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                            <InputAdornment position="end">
                              {((oldAssetCatId) || (asset_category_id && asset_category_id.id) || (assetkeyword && assetkeyword.length > 0)) && (
                              <IconButton onClick={onAssetClear}>
                                <BackspaceIcon fontSize="small" />
                              </IconButton>
                              )}
                              <IconButton onClick={onAssetSearch}>
                                <SearchIcon fontSize="small" />
                              </IconButton>
                            </InputAdornment>
                          </>
                        ),
                      }}
                    />
                  )}
                />
                <Dialog size="xl" fullWidth open={openEquipmentSearchModal}>
                  <DialogHeader title={modalName} imagePath={false} onClose={() => { setOpenEquipmentSearchModal(false); }} />
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      <SearchModal
                        modelName={appModels.ASSETCATEGORY}
                        afterReset={() => { setOpenEquipmentSearchModal(false); }}
                        fieldName={fieldName}
                        fields={['name']}
                        company={userInfo && userInfo.data ? companies : ''}
                        otherFieldName={asset_category_id && asset_category_id.id ? asset_category_id.id : ''}
                        modalName={modalName}
                        setFieldValue={setFieldValue}
                        serchFieldValue={serchFieldValue}
                      />
                    </DialogContentText>
                  </DialogContent>
                </Dialog>
                {(assetCategoriesInfo && assetCategoriesInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(assetCategoriesInfo)}</span></FormHelperText>)}
              </Col>
            )
            : (
              <Col xs={12} sm={6} md={6} lg={6}>
                <MuiAutoComplete
                  sx={{
                    marginBottom: '20px',
                  }}
                  name={equipmentCategoryId.name}
                  label={equipmentCategoryId.label}
                  className="bg-white"
                  open={equipmentOpen}
                  size="small"
                  oldValue={oldCatId}
                  value={category_id && category_id.path_name ? category_id.path_name : oldCatId}
                  onOpen={() => {
                    setEquipmentOpen(true);
                    setEquipmentkeyword('');
                  }}
                  onClose={() => {
                    setEquipmentOpen(false);
                    setEquipmentkeyword('');
                  }}
                  loading={categoriesInfo && categoriesInfo.loading}
                  getOptionSelected={(option, value) => (value.length > 0 ? option.path_name === value.path_name : '')}
                  getOptionLabel={(option) => (typeof option === 'string' ? option : option.path_name)}
                  options={categoryOptions}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      value={equipmentkeyword}
                      onChange={onEquipmentKeywordChange}
                      variant="standard"
                      label={equipmentCategoryId.label}
                      className={((oldCatId) || (category_id && category_id.id) || (equipmentkeyword && equipmentkeyword.length > 0))
                        ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                      placeholder="Search & Select"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {categoriesInfo && categoriesInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                            <InputAdornment position="end">
                              {((oldCatId) || (category_id && category_id.id) || (equipmentkeyword && equipmentkeyword.length > 0)) && (
                              <IconButton onClick={onEquipmentClear}>
                                <BackspaceIcon fontSize="small" />
                              </IconButton>
                              )}
                              <IconButton onClick={onEquipemntSearch}>
                                <SearchIcon fontSize="small" />
                              </IconButton>
                            </InputAdornment>
                          </>
                        ),
                      }}
                    />
                  )}
                />
                <Dialog size="xl" fullWidth open={openEquipmentSearchModal}>
                  <DialogHeader title={modalName} imagePath={false} onClose={() => { setOpenEquipmentSearchModal(false); }} />
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      <SearchModal
                        modelName={appModels.EQUIPMENTCATEGORY}
                        afterReset={() => { setOpenEquipmentSearchModal(false); }}
                        fieldName={fieldName}
                        fields={['path_name']}
                        company=""
                        otherFieldName={category_id && category_id.id ? category_id.id : ''}
                        modalName={modalName}
                        setFieldValue={setFieldValue}
                        serchFieldValue={serchFieldValue}
                      />
                    </DialogContentText>
                  </DialogContent>
                </Dialog>
                {(categoriesInfo && categoriesInfo.err) && (<FormHelperText><span className="text-danger">{generateErrorMessage(categoriesInfo)}</span></FormHelperText>)}
              </Col>
            )}
        </Row>
        <Row className="ml-2">
          <Col xs={12} sm={6} md={6} lg={6}>
            <MuiAutoComplete
              sx={{
                marginBottom: '20px',
              }}
              name={maintenanceType.name}
              label={maintenanceType.label}
              isRequired={maintenanceType.required}
              className="bg-white"
              oldValue={oldMt}
              value={maintenance_type && maintenance_type.label ? maintenance_type.label : oldMt}
              open={scheduleOpen}
              size="small"
              onOpen={() => {
                setScheduleOpen(true);
              }}
              onClose={() => {
                setScheduleOpen(false);
              }}
              getOptionSelected={(option, value) => option.label === value.label}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
              options={preventiveActions.maintenanceType}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  required
                  label={maintenanceType.label}
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
          </Col>
          <Col xs={12} sm={6} md={6} lg={6}>
            <MuiTextField name={duration.name} label={duration.label} type="text" onKeyPress={decimalKeyPress} />
          </Col>
        </Row>
      </ThemeProvider>
    </>
  );
};

RequestorForm.propTypes = {
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
  setFieldValue: PropTypes.func.isRequired,
  reloadData: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

export default RequestorForm;
