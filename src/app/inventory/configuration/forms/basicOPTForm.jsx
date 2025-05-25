/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {
  CircularProgress,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import { IoCloseOutline } from 'react-icons/io5';
import SearchIcon from '@material-ui/icons/Search';
import { Dialog, DialogContent, DialogActions, Typography, Button, TextField, Box, } from "@mui/material";

import { useFormikContext } from 'formik';
import {
  getStockLocations, getStockPickingTypes,
} from '../../../purchase/purchaseService';
import {
  getSequence, getWarehouses, getRole, setRoleId,
} from '../../inventoryService';
import {
  generateErrorMessage,
  getAllowedCompanies,
  extractOptionsObject,
  getArrayFromValuesById, isArrayColumnExists, getColumnArrayById,
} from '../../../util/appUtils';
import AdvancedSearchModal from './searchModal';
import SearchModalMultiple from './searchModalMultiple';

import MuiAutoComplete from "../../../commonComponents/formFields/muiAutocomplete";
import DialogHeader from '../../../commonComponents/dialogHeader';
import MuiTextField from '../../../commonComponents/formFields/muiTextField';
import { AddThemeColor } from '../../../themes/theme'
import AdvanceForm from '../forms/advanceOptForm';
import locationFormModel from '../formModel/optFormModel';
import MuiCheckboxField from '../../../commonComponents/formFields/muiCheckbox';

const appModels = require('../../../util/appModels').default;

const BasicOPTForm = React.memo((props) => {
  const {
    setFieldValue,
    reload,
    formField: {
      name,
      sequenceId,
      warehouseId,
      barcode,
      operationType,
      defaultSource,
      defaultDestination,
      pickingId,
      isApprovalRequired,
      role,
      isRequestExpiry,
      expiryDuration,
      isExpiryEmail,
      isReminderEmail,
      ReminderDuration,
      Requested,
      Approved,
      Rejected,
      Delivered,
      bnRequested,
      bnApproved,
      bnRejected,
      bnDelivered,
    },
  } = props;
  const useStyles = makeStyles((themeStyle) => ({
    margin: {
      marginBottom: themeStyle.spacing(1.25),
      width: '100%',
    },
  }));
  const dispatch = useDispatch();
  const classes = useStyles();
  const { values: formValues } = useFormikContext();
  const {
    sequence_id,
    warehouse_id,
    default_location_src_id,
    default_location_dest_id,
    return_picking_type_id,
    code,
    is_confirmed,
    approval_user_role_ids,
    is_request_expiry,
    is_reminder_email,
  } = formValues;

  const [sequenceOpen, setSequenceOpen] = useState(false);
  const [seqKeyword, setSequenceKeyword] = useState('');
  const [whOpen, setWHOpen] = useState(false);
  const [whKeyword, setWHKeyword] = useState('');
  const [openUsage, setOpenUsage] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [locKeyword, setLocKeyword] = useState('');
  const [destLocationOpen, setDestLocationOpen] = useState(false);
  const [destLocKeyword, setDestLocKeyword] = useState('');
  const [typeOpen, setTypeOpen] = useState(false);
  const [typeKeyword, setTypeKeyword] = useState('');
  const [extraMultipleModal, setExtraMultipleModal] = useState(false);
  const [extraModal, setExtraModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [columns, setColumns] = useState(['id', 'name', 'email', 'mobile']);

  const [roleOpen, setRoleOpen] = useState(false);
  const [roleKeyword, setRoleKeyword] = useState('');
  const [checkedRows, setCheckRows] = useState([]);
  const [roleOptions, setRoleOptions] = useState([]);

  const { userInfo } = useSelector((state) => state.user);
  const { stockLocations, pickingTypes } = useSelector((state) => state.purchase);
  const {
    referenceSequence, warehouseList, roleInfoList, roleId,
  } = useSelector((state) => state.inventory);
  // const companies = getAllowedCompanies(userInfo);
  const {
    siteDetails,
  } = useSelector((state) => state.site);
  const { formField } = locationFormModel;

  const companies = siteDetails && siteDetails.data && siteDetails.data.length && siteDetails.data[0].id ? siteDetails.data[0].id : getAllowedCompanies(userInfo);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const userCompanyId = userInfo && userInfo.data && userInfo.data.company ? userInfo.data.company : '';
      const companyIds = siteDetails && siteDetails.data && siteDetails.data.length && siteDetails.data[0].id ? { id: siteDetails.data[0].id, name: siteDetails.data[0].name } : userCompanyId;
      setFieldValue('companies', companyIds);
    }
  }, [userInfo]);

  useEffect(() => {
    if (userInfo && userInfo.data && sequenceOpen) {
      dispatch(getSequence(companies, appModels.SEQUENCE, seqKeyword));
    }
  }, [userInfo, seqKeyword, sequenceOpen]);

  useEffect(() => {
    if (userInfo && userInfo.data && whOpen) {
      dispatch(getWarehouses(companies, appModels.WAREHOUSE, whKeyword));
    }
  }, [userInfo, whKeyword, whOpen]);

  useEffect(() => {
    if (userInfo && userInfo.data && locationOpen) {
      dispatch(getStockLocations(companies, appModels.STOCKLOCATION, locKeyword));
    }
  }, [userInfo, locKeyword, locationOpen]);

  useEffect(() => {
    if (userInfo && userInfo.data && destLocationOpen) {
      dispatch(getStockLocations(companies, appModels.STOCKLOCATION, destLocKeyword));
    }
  }, [userInfo, destLocKeyword, destLocationOpen]);

  useEffect(() => {
    if (userInfo && userInfo.data && typeOpen) {
      dispatch(getStockPickingTypes(companies, appModels.STOCKPICKINGTYPES, typeKeyword, 'inventory'));
    }
  }, [userInfo, typeKeyword, typeOpen]);

  useEffect(() => {
    if (userInfo && userInfo.data && roleOpen) {
      dispatch(getRole(companies, appModels.ALARMRECIPIENTS, roleKeyword));
    }
  }, [userInfo, roleOpen, roleKeyword]);

  useEffect(() => {
    if (roleId) {
      setFieldValue('approval_user_role_ids', roleId);
    }
  }, [roleId]);

  useEffect(() => {
    if (!is_confirmed) {
      dispatch(setRoleId([]));
      setFieldValue('approval_user_role_ids', '');
    }
  }, [is_confirmed]);

  function isAssociativeArray(arr) {
    let result = arr;
    if (isArrayColumnExists(arr, 'id')) {
      result = getColumnArrayById(arr, 'id');
    }
    return result;
  }

  useEffect(() => {
    if (roleInfoList && roleInfoList.data && roleInfoList.data.length && roleOpen) {
      setRoleOptions(getArrayFromValuesById(roleInfoList.data, isAssociativeArray(roleId || []), 'id'));
    } else if (roleInfoList && roleInfoList.loading) {
      setRoleOptions([{ name: 'Loading...' }]);
    } else {
      setRoleOptions([]);
    }
  }, [roleInfoList, roleOpen]);

  const handleServiceImpacted = (options) => {
    if (options && options.length && options.find((option) => option.name === 'Loading...')) {
      return false;
    }
    dispatch(setRoleId(options));
    setCheckRows(options);
  };

  const onServiceImpactKeywordClear = () => {
    setRoleKeyword(null);
    dispatch(setRoleId([]));
    setCheckRows([]);
    setRoleOpen(false);
  };

  const onSeqKeyWordChange = (event) => {
    setSequenceKeyword(event.target.value);
  };

  const onWHKeyWordChange = (event) => {
    setWHKeyword(event.target.value);
  };

  const onLocationKeyWordChange = (event) => {
    setLocKeyword(event.target.value);
  };

  const onDestLocationKeyWordChange = (event) => {
    setDestLocKeyword(event.target.value);
  };

  const onTypeKeywordChange = (event) => {
    setTypeKeyword(event.target.value);
  };
  const onServiceImpactKeyWordChange = (event) => {
    setRoleKeyword(event.target.value);
  };

  const onKeywordClear = () => {
    setWHKeyword(null);
    setFieldValue('warehouse_id', '');
    setWHOpen(false);
  };

  const showRequestorModal = () => {
    setModelValue(appModels.WAREHOUSE);
    setFieldName('warehouse_id');
    setModalName('Warehouse');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setColumns([]);
    setExtraMultipleModal(true);
  };

  const setLocationIds = (data) => {
    const Location = ([...roleId, ...data]);
    const uniqueObjArray = [...new Map(Location.map((item) => [item.id, item])).values()];
    dispatch(setRoleId(uniqueObjArray));
    setExtraModal(false);
    setCheckRows([]);
  };

  const onSeqKeywordClear = () => {
    setSequenceKeyword(null);
    setFieldValue('sequence_id', '');
    setSequenceOpen(false);
  };

  const showSeqRequestorModal = () => {
    setModelValue(appModels.SEQUENCE);
    setFieldName('sequence_id');
    setModalName('Reference Sequence');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setColumns([]);
    setExtraMultipleModal(true);
  };

  const onSourceKeywordClear = () => {
    setSequenceKeyword(null);
    setFieldValue('default_location_src_id', '');
    setSequenceOpen(false);
  };

  const showSourceRequestorModal = () => {
    setModelValue(appModels.STOCKLOCATION);
    setFieldName('default_location_src_id');
    setModalName('Default Source Location');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setColumns(['name', 'location_id', 'display_name']);
    setExtraMultipleModal(true);
  };

  const onDestKeywordClear = () => {
    setSequenceKeyword(null);
    setFieldValue('default_location_dest_id', '');
    setSequenceOpen(false);
  };

  const showDestRequestorModal = () => {
    setModelValue(appModels.STOCKLOCATION);
    setFieldName('default_location_dest_id');
    setModalName('Default Destination Location');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setColumns(['name', 'location_id', 'display_name']);
    setExtraMultipleModal(true);
  };

  const showServiceImpactModal = () => {
    setModelValue(appModels.ALARMRECIPIENTS);
    setFieldName('approval_user_role_ids');
    setModalName('Role List');
    setColumns(['id', 'name']);
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraModal(true);
  };

  const sequenceOptions = extractOptionsObject(referenceSequence, sequence_id);
  const warehouseOptions = extractOptionsObject(warehouseList, warehouse_id);
  const locationOptions = extractOptionsObject(stockLocations, default_location_src_id);
  const destLocationOptions = extractOptionsObject(stockLocations, default_location_dest_id);
  const typeOptions = extractOptionsObject(pickingTypes, return_picking_type_id);

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

  const operationTypes = [
    { name: 'Inward', value: 'incoming' },
    { name: 'Outward', value: 'outgoing' },
    { name: 'Consumption', value: 'internal' },
  ];

  const getOpType = (opType) => {
    const filteredType = operationTypes.filter((data) => data.value === opType);
    if (filteredType && filteredType.length) {
      return filteredType[0].name;
    }
    return '';
  };

  return (
    <>

      <>
        <Box sx={{ display: 'flex', width: '100%', gap: '35px' }}>
          <Box sx={{ width: '50%' }}>
            <MuiTextField
              sx={{
                marginBottom: "10px",
              }}
              name={name.name}
              label={name.label}
              autoComplete="off"
              isRequired
              type="text"
              formGroupClassName="m-1"
              maxLength="30"
            />

            <MuiAutoComplete
              sx={{
                marginBottom: "10px",
              }}
              name={sequenceId.name}
              label={sequenceId.label}
              isRequired
              formGroupClassName="m-1"
              oldValue={getOldData(sequence_id)}
              value={sequence_id && sequence_id.name ? sequence_id.name : getOldData(sequence_id)}
              apiError={(referenceSequence && referenceSequence.err && sequenceOpen) ? generateErrorMessage(referenceSequence) : false}
              open={sequenceOpen}
              size="small"
              onOpen={() => {
                setSequenceOpen(true);
                setSequenceKeyword('');
              }}
              onClose={() => {
                setSequenceOpen(false);
                setSequenceKeyword('');
              }}
              loading={referenceSequence && referenceSequence.loading && sequenceOpen}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={sequenceOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={onSeqKeyWordChange}
                  variant="standard"
                  label={`${sequenceId.label}`}
                  required
                  value={seqKeyword}
                  placeholder="Search & Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {referenceSequence && referenceSequence.loading && sequenceOpen ? <CircularProgress color="inherit" size={20} /> : null}
                        <InputAdornment position="end">
                          {((sequence_id && sequence_id.id) || (seqKeyword && seqKeyword.length > 0) || (sequence_id && sequence_id.length)) && (
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={onSeqKeywordClear}
                            >
                              <IoCloseOutline size={22} fontSize="small" />
                            </IconButton>
                          )}
                          <IconButton
                            aria-label="toggle search visibility"
                            onClick={showSeqRequestorModal}
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

            <MuiAutoComplete
              sx={{
                marginBottom: "10px",
              }}
              name={warehouseId.name}
              label={warehouseId.label}
              formGroupClassName="m-1"
              oldValue={getOldData(warehouse_id)}
              value={warehouse_id && warehouse_id.name ? warehouse_id.name : getOldData(warehouse_id)}
              apiError={(warehouseList && warehouseList.err && whOpen) ? generateErrorMessage(warehouseList) : false}
              open={whOpen}
              size="small"
              onOpen={() => {
                setWHOpen(true);
                setWHKeyword('');
              }}
              onClose={() => {
                setWHOpen(false);
                setWHKeyword('');
              }}
              loading={warehouseList && warehouseList.loading && whOpen}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={warehouseOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={onWHKeyWordChange}
                  variant="standard"
                  label={warehouseId.label}
                  value={whKeyword}
                  placeholder="Search & Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {warehouseList && warehouseList.loading && whOpen ? <CircularProgress color="inherit" size={20} /> : null}
                        <InputAdornment position="end">
                          {((warehouse_id && warehouse_id.id) || (whKeyword && whKeyword.length > 0) || (warehouse_id && warehouse_id.length)) && (
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={onKeywordClear}
                            >
                              <IoCloseOutline size={22} fontSize="small" />
                            </IconButton>
                          )}
                          <IconButton
                            aria-label="toggle search visibility"
                            onClick={showRequestorModal}
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
          </Box>
          <Box sx={{ width: '50%' }}>

            <MuiTextField
              sx={{
                marginBottom: "10px",
              }}
              name={barcode.name}
              label={barcode.label}
              autoComplete="off"
              type="text"
              formGroupClassName="m-1"
              maxLength="30"
            />
            <MuiAutoComplete
              sx={{
                marginBottom: "10px",
              }}
              name={operationType.name}
              label={operationType.label}
              formGroupClassName="mb-2"
              isRequired
              labelClassName="mb-2"
              size="small"
              open={openUsage}
              onOpen={() => {
                setOpenUsage(true);
              }}
              onClose={() => {
                setOpenUsage(false);
              }}
              value={code && code.name ? code.name : getOpType(code)}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={operationTypes}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label={`${operationType.label}`}
                  required
                  className="without-padding"
                  placeholder="Type"
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
            <AdvanceForm formField={formField} setFieldValue={setFieldValue} reload={reload} />
          </Box>
        </Box>

        <Typography
          sx={AddThemeColor({
            font: 'normal normal medium 20px/24px Suisse Intl',
            letterSpacing: '0.7px',
            fontWeight: 500,
          })}
        >
          Locations
        </Typography>
        <Box sx={{ display: 'flex', width: '100%', gap: '35px' }}>
          <Box sx={{ width: '50%' }}>
            <MuiAutoComplete
              sx={{
                marginBottom: "10px",
              }}
              name={defaultSource.name}
              label={defaultSource.label}
              formGroupClassName="m-1"
              oldValue={getOldData(default_location_src_id)}
              value={default_location_src_id && default_location_src_id.name ? default_location_src_id.name : getOldData(default_location_src_id)}
              apiError={(stockLocations && stockLocations.err && locationOpen) ? generateErrorMessage(stockLocations) : false}
              open={locationOpen}
              size="small"
              onOpen={() => {
                setLocationOpen(true);
                setLocKeyword('');
              }}
              onClose={() => {
                setLocationOpen(false);
                setLocKeyword('');
              }}
              loading={stockLocations && stockLocations.loading && locationOpen}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={locationOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={onLocationKeyWordChange}
                  variant="standard"
                  label={defaultSource.label}
                  value={locKeyword}
                  placeholder="Search & Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {stockLocations && stockLocations.loading && locationOpen ? <CircularProgress color="inherit" size={20} /> : null}
                        <InputAdornment position="end">
                          {((default_location_src_id && default_location_src_id.id) || (locKeyword && locKeyword.length > 0) || (default_location_src_id && default_location_src_id.length)) && (
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={onSourceKeywordClear}
                            >
                              <IoCloseOutline size={22} fontSize="small" />
                            </IconButton>
                          )}
                          <IconButton
                            aria-label="toggle search visibility"
                            onClick={showSourceRequestorModal}
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

            <MuiTextField
              sx={{
                marginBottom: "10px",
              }}
              name={Requested.name}
              label={Requested.label}
              formGroupClassName="mb-1"
              type="text"
              maxLength="12"
            />

            <MuiTextField
              sx={{
                marginBottom: "10px",
              }}
              name={Approved.name}
              label={Approved.label}
              formGroupClassName="mb-1"
              type="text"
              maxLength="12"
            />
          </Box>
          <Box sx={{ width: '50%' }}>
            <MuiAutoComplete
              sx={{
                marginBottom: "10px",
              }}
              name={defaultDestination.name}
              label={defaultDestination.label}
              formGroupClassName="m-1"
              oldValue={getOldData(default_location_dest_id)}
              value={default_location_dest_id && default_location_dest_id.name ? default_location_dest_id.name : getOldData(default_location_dest_id)}
              apiError={(stockLocations && stockLocations.err && destLocationOpen) ? generateErrorMessage(stockLocations) : false}
              open={destLocationOpen}
              size="small"
              onOpen={() => {
                setDestLocationOpen(true);
                setDestLocKeyword('');
              }}
              onClose={() => {
                setDestLocationOpen(false);
                setDestLocKeyword('');
              }}
              loading={stockLocations && stockLocations.loading && destLocationOpen}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={destLocationOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={onDestLocationKeyWordChange}
                  variant="standard"
                  label={defaultDestination.label}
                  value={destLocKeyword}
                  placeholder="Search & Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {stockLocations && stockLocations.loading && destLocationOpen ? <CircularProgress color="inherit" size={20} /> : null}
                        <InputAdornment position="end">
                          {((default_location_dest_id && default_location_dest_id.id)
                            || (destLocKeyword && destLocKeyword.length > 0) || (default_location_dest_id && default_location_dest_id.length)) && (
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={onDestKeywordClear}
                              >
                                <IoCloseOutline size={22} fontSize="small" />
                              </IconButton>
                            )}
                          <IconButton
                            aria-label="toggle search visibility"
                            onClick={showDestRequestorModal}
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
            <MuiTextField
              sx={{
                marginBottom: "10px",
              }}
              name={Rejected.name}
              label={Rejected.label}
              formGroupClassName="mb-1"
              type="text"
              maxLength="12"
            />
            <MuiTextField
              sx={{
                marginBottom: "10px",
              }}
              name={Delivered.name}
              label={Delivered.label}
              formGroupClassName="mb-1"
              type="text"
              maxLength="12"
            />
          </Box>
        </Box>
        {code === '' ? ''
          : (
            <MuiAutoComplete
              sx={{
                marginBottom: "10px",
              }}
              name={pickingId.name}
              label={pickingId.label}
              formGroupClassName="m-1"
              oldValue={getOldData(return_picking_type_id)}
              value={return_picking_type_id && return_picking_type_id.name ? return_picking_type_id.name : getOldData(return_picking_type_id)}
              apiError={(pickingTypes && pickingTypes.err && typeOpen) ? generateErrorMessage(pickingTypes) : false}
              open={typeOpen}
              size="small"
              onOpen={() => {
                setTypeOpen(true);
                setTypeKeyword('');
              }}
              onClose={() => {
                setTypeOpen(false);
                setTypeKeyword('');
              }}
              loading={pickingTypes && pickingTypes.loading && typeOpen}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={typeOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={onTypeKeywordChange}
                  variant="standard"
                  label={pickingId.label}
                  className="without-padding"
                  placeholder="Search & Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {pickingTypes && pickingTypes.loading && typeOpen ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          )}
        <Box sx={{ display: 'flex', width: '100%', gap: '35px' }}>
          <Box sx={{ width: '50%' }}>
            <Typography
              sx={AddThemeColor({
                font: 'normal normal medium 20px/24px Suisse Intl',
                letterSpacing: '0.7px',
                fontWeight: 500,
              })}
            >
              Request Status Button
            </Typography>

            <MuiTextField
              sx={{
                marginBottom: "10px",
              }}
              name={bnRequested.name}
              label={bnRequested.label}
              formGroupClassName="mb-1"
              type="text"
              maxLength="12"
            />

            <MuiTextField
              sx={{
                marginBottom: "10px",
              }}
              name={bnApproved.name}
              label={bnApproved.label}
              formGroupClassName="mb-1"
              type="text"
              maxLength="12"
            />
            <MuiTextField
              sx={{
                marginBottom: "10px",
              }}
              name={bnRejected.name}
              label={bnRejected.label}
              formGroupClassName="mb-1"
              type="text"
              maxLength="12"
            />
            <MuiTextField
              sx={{
                marginBottom: "10px",
              }}
              name={bnDelivered.name}
              label={bnDelivered.label}
              formGroupClassName="mb-1"
              type="text"
              maxLength="12"
            />
          </Box>
          <Box sx={{ width: '50%' }}>
            <Typography
              sx={AddThemeColor({
                font: 'normal normal medium 20px/24px Suisse Intl',
                letterSpacing: '0.7px',
                fontWeight: 500,
              })}
            >
              Inventory Request
            </Typography>
            <MuiCheckboxField
              name={isApprovalRequired.name}
              label={isApprovalRequired.label}
            />
            <MuiCheckboxField
              name={isRequestExpiry.name}
              label={isRequestExpiry.label}
            />
            {is_confirmed
              ? (

                <MuiAutoComplete
                  sx={{
                    marginBottom: "10px",
                  }}
                  multiple
                  filterSelectedOptions
                  name="categoryuser"
                  open={roleOpen}
                  label={role.label}
                  size="small"
                  className="bg-white serviceImpact"
                  onOpen={() => {
                    setRoleOpen(true);
                    setRoleKeyword('');
                  }}
                  onClose={() => {
                    setRoleOpen(false);
                    setRoleKeyword('');
                  }}
                  value={approval_user_role_ids && approval_user_role_ids.length > 0 ? approval_user_role_ids : []}
                  defaultValue={roleId}
                  onChange={(e, options) => handleServiceImpacted(options)}
                  getOptionSelected={(option, value) => option.name === value.name}
                  getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                  options={roleOptions}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      label={role.label}
                      placeholder="Search & Select"
                      onChange={(e) => onServiceImpactKeyWordChange(e.target.value)}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {(roleInfoList && roleInfoList.loading) ? <CircularProgress color="inherit" size={20} /> : null}
                            <InputAdornment position="end">
                              {((roleKeyword && roleKeyword.length > 0) || (approval_user_role_ids && approval_user_role_ids.length > 0)) && (
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={onServiceImpactKeywordClear}
                                >
                                  <IoCloseOutline size={22} fontSize="small" />
                                </IconButton>
                              )}
                              <IconButton
                                aria-label="toggle search visibility"
                                onClick={showServiceImpactModal}
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
              )
              : ''}
            {is_request_expiry
              ? (
                <>
                  <MuiTextField
                    sx={{
                      marginBottom: "10px",
                    }}
                    name={expiryDuration.name}
                    label={expiryDuration.label}
                    formGroupClassName="mb-1"
                    type="text"
                    maxLength="12"
                  />
                  <MuiCheckboxField
                    name={isExpiryEmail.name}
                    label={isExpiryEmail.label}
                  />
                  <MuiCheckboxField
                    name={isReminderEmail.name}
                    label={isReminderEmail.label}
                  />
                </>
              )
              : ''}
            {is_reminder_email
              ? (
                <MuiTextField
                  sx={{
                    marginBottom: "10px",
                  }}
                  name={ReminderDuration.name}
                  label={ReminderDuration.label}
                  formGroupClassName="mb-1"
                  type="text"
                  maxLength="12"
                />
              )
              : ''}
          </Box>
        </Box>
      </>

      <Dialog size="xl" fullWidth open={extraMultipleModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraMultipleModal(false); }} />
        <DialogContent>
          <AdvancedSearchModal
            modelName={modelValue}
            afterReset={() => { setExtraMultipleModal(false); }}
            fieldName={fieldName}
            fields={columns}
            company={companyValue}
            otherFieldName={otherFieldName}
            otherFieldValue={otherFieldValue}
            setFieldValue={setFieldValue}
          />
        </DialogContent>
      </Dialog>

      <Dialog size="xl" fullWidth open={extraModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraModal(false); }} />
        <DialogContent>
          <SearchModalMultiple
            modelName={modelValue}
            afterReset={() => { setExtraModal(false); }}
            fieldName={fieldName}
            fields={columns}
            company={companyValue}
            otherFieldName={otherFieldName}
            otherFieldValue={otherFieldValue}
            setCheckedRows={setCheckRows}
            olCheckedRows={checkedRows && checkedRows.length ? checkedRows : []}
            oldServiceData={roleId && roleId.length ? roleId : []}
          />
        </DialogContent>
        <DialogActions>
          {(checkedRows && checkedRows.length && checkedRows.length > 0)
            ? (
              <Button
                type="button"
                variant="contained"
                onClick={() => { if (fieldName === 'approval_user_role_ids') { setLocationIds(checkedRows); } }}
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

BasicOPTForm.propTypes = {
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default BasicOPTForm;