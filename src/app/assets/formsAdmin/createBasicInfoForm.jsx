/* eslint-disable camelcase */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import envelopeIcon from '@images/icons/envelope.svg';
import telephoneIcon from '@images/icons/telephone.svg';
import {
  CircularProgress,
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import {
  Autocomplete,
  Dialog, DialogContent, DialogContentText,
  TextField, Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import 'antd/dist/antd.css';
import { useFormikContext } from 'formik';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import assetActionData from '../data/assetsActions.json';

import DialogHeader from '../../commonComponents/dialogHeader';

import { infoValue } from '../../adminSetup/utils/utils';
import { AddThemeColor } from '../../themes/theme';
import { getAllowedCompanies, getOldData } from '../../util/appUtils';
import {
  getCategoryList,
  getPartners,
  getTeamList, getUNSPSCCodes, getUNSPSCOtherCodes,
} from '../equipmentService';
import AdvancedSearchModal from './advancedSearchModal';
import SearchModalMultiple from './searchModalMultiple';

const appModels = require('../../util/appModels').default;

const CreateBasicForm = (props) => {
  const {
    setFieldValue,
    reloadSpace,
    spaceId,
    setPartsData,
    partsData,
    setPartsAdd,
    index,
    formData,
    formField: {
      Name,
      categoryId,
      maintenanceTeamId,
      locationId,
      manufacturerId,
      equipmentNumber,
      commodityId,
      familyId,
      classId,
      segmentId,
      serial,
      capacity,
      model,
      criticality,
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
  const [extraMultipleModal, setExtraMultipleModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [placeholderName, setPlaceholder] = useState('');
  const [columns, setColumns] = useState(['id', 'name']);

  const [manufacturerOpen, setManufacturerOpen] = useState(false);
  const [manufacturerKeyword, setManufacturerKeyword] = useState('');
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [open, setOpen] = useState(false);

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const {
    spaceCascader,
  } = useSelector((state) => state.ticket);
  const {
    categoriesInfo, teamsInfo, unspscCodes, unspscOtherCodes, partnersInfo, buildingSpaces,
  } = useSelector((state) => state.equipment);

  useEffect(() => {
    setRefresh(refresh);
  }, [refresh]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && typeof manufacturerOpen === 'number') {
        await dispatch(getPartners(companies, appModels.PARTNER, 'supplier', manufacturerKeyword, false, 'yes'));
      }
    })();
  }, [userInfo, manufacturerKeyword, manufacturerOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo.data && categoryOpen) {
        await dispatch(getCategoryList(companies, appModels.EQUIPMENTCATEGORY, categoryKeyword));
      }
    })();
  }, [categoryOpen, categoryKeyword]);

  useEffect(() => {
    (async () => {
      if (userInfo.data && teamOpen) {
        await dispatch(getTeamList(companies, appModels.TEAM, teamKeyword));
      }
    })();
  }, [teamOpen, teamKeyword]);

  useEffect(() => {
    if (userInfo && userInfo.data && typeof unspscOpen === 'number') {
      if (unspscKeyword && unspscKeyword.length > 2) {
        dispatch(getUNSPSCCodes(companies, appModels.UNSPSC, unspscKeyword));
      } else {
        dispatch(getUNSPSCCodes(companies, appModels.UNSPSC, unspscKeyword));
      }
    }
  }, [unspscOpen, unspscKeyword]);

  useEffect(() => {
    if (userInfo && userInfo.data && formData.commodity_id && formData.commodity_id.id) {
      dispatch(getUNSPSCOtherCodes(companies, appModels.UNSPSC, formData.commodity_id.id));
    }
  }, [userInfo, formData.commodity_id]);

  useEffect(() => {
    if (unspscOtherCodes && unspscOtherCodes.data && formData.commodity_id && formData.commodity_id.id) {
      const newData = partsData;
      newData[index].family_id = unspscOtherCodes.data[0].family_id;
      newData[index].class_id = unspscOtherCodes.data[0].class_id;
      newData[index].segment_id = unspscOtherCodes.data[0].segment_id;
      setPartsData(newData);
      setPartsAdd(Math.random());
    } else {
      const newData = partsData;
      newData[index].family_id = '';
      newData[index].class_id = '';
      newData[index].segment_id = '';
      setPartsData(newData);
      setPartsAdd(Math.random());
    }
  }, [unspscOtherCodes, formData.commodity_id]);

  const onCategoryKeywordChange = (event) => {
    setCategoryKeyword(event.target.value);
  };

  const onTeamKeywordChange = (event) => {
    setTeamKeyword(event.target.value);
  };

  const onUnspscKeywordChange = (event) => {
    setUnspscKeyword(event.target.value);
  };

  const onFieldClear = (field) => {
    const newData = partsData;
    newData[index][field] = '';
    setPartsData(newData);
    setPartsAdd(Math.random());
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
    setFieldValue('category_id', '');
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
    onFieldClear('commodity_id');
    onFieldClear('family_id');
    onFieldClear('class_id');
    onFieldClear('segment_id');
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
    setFieldValue('maintenance_team_id', '');
    setTeamOpen(false);
  };

  const onManufacturerKeywordChange = (event) => {
    setManufacturerKeyword(event.target.value);
  };

  const onManufacturerKeywordClear = () => {
    setManufacturerKeyword(null);
    onFieldClear('manufacturer_id');
    setManufacturerOpen(false);
  };

  const showManufactureModal = () => {
    setModelValue(appModels.PARTNER);
    setFieldName('manufacturer_id');
    setModalName('Manufacturer List');
    setOtherFieldName('manufacturer_id');
    setOtherFieldValue(true);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setColumns(['id', 'display_name', 'email', 'mobile']);
    setExtraMultipleModal(true);
  };

  let unspscOptions = [];
  let manufacturerOptions = [];

  if (unspscCodes && unspscCodes.loading) {
    unspscOptions = [{ name: 'Loading..' }];
  }
  if (unspscCodes && unspscCodes.data) {
    unspscOptions = unspscCodes.data;
  }
  if (partnersInfo && partnersInfo.loading) {
    if (manufacturerOpen === index) {
      manufacturerOptions = [{ display_name: 'Loading..' }];
    }
  }
  if (partnersInfo && partnersInfo.data) {
    if (manufacturerOpen === index) {
      manufacturerOptions = partnersInfo.data;
    }
  }

  const onDropdownChange = (e, indexV, field, name) => {
    const newData = partsData;
    newData[indexV][field] = { id: e.id, name: name ? e[name] : e.name };
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
        <Typography
          sx={AddThemeColor({
            font: 'normal normal medium 20px/24px Suisse Intl',
            letterSpacing: '0.7px',
            fontWeight: 500,
            marginBottom: '20px',
          })}
        >
          General Info
        </Typography>
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
            className="bg-white"
            variant="standard"
            onChange={(e) => onTextFieldChange(e, index, model.name)}
            value={formData[model.name]}
            InputLabelProps={{ shrink: true }}
            sx={{
              width: '30%',
              marginBottom: '20px',
            }}
            name={model.name}
            label={(
              <>
                {model.label}
                {infoValue('model')}
              </>
            )}
          />
          <TextField
            className="bg-white"
            variant="standard"
            onChange={(e) => onTextFieldChange(e, index, serial.name)}
            value={formData[serial.name]}
            InputLabelProps={{ shrink: true }}
            sx={{
              width: '30%',
              marginBottom: '20px',
            }}
            type="text"
            name={serial.name}
            label={(
              <>
                {serial.label}
                {infoValue('serial')}
              </>
            )}
          />

          <TextField
            className="bg-white"
            variant="standard"
            onChange={(e) => onTextFieldChange(e, index, capacity.name)}
            value={formData[capacity.name]}
            sx={{
              width: '30%',
              marginBottom: '20px',
            }}
            name={capacity.name}
            label={(
              <>
                {capacity.label}
                {infoValue('capacity')}
              </>
            )}
            setFieldValue={setFieldValue}
            type="text"
            InputLabelProps={{ shrink: true }}
          />
          <Autocomplete
            sx={{
              width: '30%',
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            name={criticality.name}
            label={criticality.label}
            className="bg-white"
            open={open === index}
            size="small"
            onOpen={() => {
              setOpen(index);
            }}
            onClose={() => {
              setOpen(false);
            }}
            onChange={(e, data) => { onDropdownChange(data, index, criticality.name); }}
            getOptionSelected={(option, value) => option.label === value.label}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
            options={assetActionData.criticalities}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                InputLabelProps={{ shrink: true }}
                label={(
                  <>
                    {criticality.label}
                    {infoValue('criticality')}
                  </>
                )}
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
          <Autocomplete
            sx={{
              width: '30%',
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            name={manufacturerId.name + index}
            label={manufacturerId.label}
            index={index}
            className="bg-white"
            value={formData.manufacturer_id && formData.manufacturer_id.display_name ? formData.manufacturer_id.display_name : getOldData(formData.manufacturer_id)}
            open={manufacturerOpen === index}
            size="small"
            onOpen={() => {
              setManufacturerOpen(index);
              setManufacturerKeyword('');
            }}
            onClose={() => {
              setManufacturerOpen(false);
              setManufacturerKeyword('');
            }}
            isOptionEqualToValue={(option, value) => option.display_name === value.display_name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.display_name)}
            renderOption={(props, option) => (
              <Box
                component="li"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  '& > img': {
                    mr: 2,
                    flexShrink: 0,
                  },
                }}
                {...props}
              >
                <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <h6>{option.display_name}</h6>
                  <span>
                    {option.email && (
                    <>
                      <img src={envelopeIcon} alt="mail" height="13" width="13" className="mr-2" />
                      {option.email}
                    </>
                    )}
                  </span>
                </div>
                {option.mobile && (
                <div style={{ marginLeft: 'auto' }}>
                  <img src={telephoneIcon} alt="telephone" height="13" width="13" className="mr-2" />
                  {option.mobile}
                </div>
                )}
              </Box>
            )}
            onChange={(e, data) => { onDropdownChange(data, index, 'manufacturer_id', 'display_name'); }}
            options={manufacturerOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onManufacturerKeywordChange}
                variant="standard"
                label={(
                  <>
                    {manufacturerId.label}
                    {infoValue('manufacturer_id')}
                  </>
                )}
                value={manufacturerKeyword}
                InputLabelProps={{ shrink: true }}
                className={((formData.manufacturer_id && formData.manufacturer_id.id) || (manufacturerKeyword && manufacturerKeyword.length > 0) || (formData.manufacturer_id && formData.manufacturer_id.length))
                  ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {partnersInfo && partnersInfo.loading && manufacturerOpen === index ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {((formData.manufacturer_id && formData.manufacturer_id.id) || (manufacturerKeyword && manufacturerKeyword.length > 0) || (formData.manufacturer_id && formData.manufacturer_id.length)) && (
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={onManufacturerKeywordClear}
                        >
                          <IoCloseOutline size={22} fontSize="small" />
                        </IconButton>
                        )}
                        <IconButton
                          aria-label="toggle search visibility"
                          onClick={showManufactureModal}
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
            sx={{
              width: '30%',
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            className="bg-white"
            name={commodityId.name}
            label={commodityId.label}
            value={formData.commodity_id && formData.commodity_id.name ? formData.commodity_id.name : getOldData(formData.commodity_id)}
            open={unspscOpen === index}
            size="small"
            onOpen={() => {
              setUnspscOpen(index);
              setUnspscKeyword('');
            }}
            onClose={() => {
              setUnspscOpen(false);
              setUnspscKeyword('');
            }}
            onChange={(e, data) => { onDropdownChange(data, index, 'commodity_id'); }}
            isOptionEqualToValue={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={unspscOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onUnspscKeywordChange}
                variant="standard"
                InputLabelProps={{ shrink: true }}
                label={(
                  <>
                    {commodityId.label}
                    {infoValue('commodity_id')}
                  </>
                )}
                className={formData.commodity_id && formData.commodity_id.id ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {unspscCodes && unspscCodes.loading ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {formData.commodity_id && formData.commodity_id.id && (
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={onCommodityClear}
                          >
                            <IoCloseOutline size={22} fontSize="small" />
                          </IconButton>
                        )}
                        <IconButton
                          aria-label="toggle search visibility"
                          onClick={showCommodityModal}
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
          {(formData.commodity_id && formData.commodity_id.id) && (
            <>
              <TextField
                sx={{
                  width: '30%',
                  marginBottom: '20px',
                }}
                className="bg-white"
                name={classId.name}
                variant="standard"
                label={(
                  <>
                    {classId.label}
                    {infoValue('class_id')}
                  </>
                )}
                value={formData[classId.name]}
                onChange={(e) => onTextFieldChange(e, index, classId.name)}
              />
              <TextField
                className="bg-white"
                variant="standard"
                onChange={(e) => onTextFieldChange(e, index, familyId.name)}
                value={formData[familyId.name]}
                sx={{
                  width: '30%',
                  marginBottom: '20px',
                }}
                name={familyId.name}
                label={(
                  <>
                    {familyId.label}
                    {infoValue('family_id')}
                  </>
                )}
              />
              <TextField
                sx={{
                  width: '30%',
                  marginBottom: '20px',
                }}
                className="bg-white"
                name={segmentId.name}
                variant="standard"
                label={(
                  <>
                    {segmentId.label}
                    {infoValue('segment_id')}
                  </>
                )}
                value={formData[segmentId.name]}
                onChange={(e) => onTextFieldChange(e, index, segmentId.name)}
              />
            </>
          )}
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
      <Dialog maxWidth="lg" open={extraMultipleModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraMultipleModal(false); }} sx={{ width: '1000px' }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <SearchModalMultiple
              modelName={modelValue}
              modalName={modalName}
              afterReset={() => { setExtraMultipleModal(false); }}
              fieldName={fieldName}
              fields={columns}
              company={companyValue}
              otherFieldName={otherFieldName}
              otherFieldValue={otherFieldValue}
              setFieldValue={setFieldValue}
              setPartsData={setPartsData}
              partsData={partsData}
              setPartsAdd={setPartsAdd}
              index={index}
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
