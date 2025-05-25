/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable max-len */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable camelcase */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import {
  CircularProgress, FormHelperText,
  TextField,
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import { CallOutlined, MailOutline } from '@mui/icons-material';
import {
  Box, Dialog, DialogContent, DialogContentText, ListItemText, Typography,
} from '@mui/material';
import { useFormikContext } from 'formik';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';

import {
  getDepartments,
} from '../../../../../../adminSetup/setupService';
import AddCustomer from '../../../../../../adminSetup/siteConfiguration/addTenant/addCustomer';
import {
  getEmployeeDataList,
  getPartners,
} from '../../../../../../assets/equipmentService';
import { getEquipmentList, getSpaceAllSearchList } from '../../../../../../helpdesk/ticketService';
import {
  extractOptionsObject,
  extractOptionsObjectWithName,
  extractTextObject,
  extractValueObjects,
  generateErrorMessage,
  getAllowedCompanies,
} from '../../../../../../util/appUtils';
import { getTrimmedArray } from '../../../../../../workorders/utils/utils';
import {
  getStockLocations,
  getStockPickingTypes,
} from '../../../../../purchaseService';
import SearchModal from './searchModal';
import SearchModalAdvanced from './searchModalAdvanced';

import DialogHeader from '../../../../../../commonComponents/dialogHeader';
import MuiAutoComplete from '../../../../../../commonComponents/formFields/muiAutocomplete';

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

const appModels = require('../../../../../../util/appModels').default;

const BasicFormNew = (props) => {
  const {
    editId,
    id,
    typeDisabled,
    setFieldValue,
    reload,
    code,
    isMultiLocation,
    pickingData,
    formField: {
      partnerId,
      locationDestId,
      locationId,
      scheduledDate,
      origin,
      useIn,
      spaceId,
      assetId,
      employeeId,
      departmentId,
    },
  } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const { values: formValues } = useFormikContext();
  const {
    partner_id,
    picking_type_id,
    location_dest_id,
    location_id,
    scheduled_date,
    employee_id,
    space_id,
    use_in,
    asset_id,
    department_id,
  } = formValues;
  const [customerOpen, setCustomerOpen] = useState(false);
  const [customerKeyword, setCustomerKeyword] = useState('');
  const [typeOpen, setTypeOpen] = useState(false);
  const [typeKeyword, setTypeKeyword] = useState('');
  const [destLocOpen, setDestLocOpen] = useState(false);
  const [destLocKeyword, setDestLocKeyword] = useState('');
  const [locOpen, setLocOpen] = useState(false);
  const [locKeyword, setLocKeyword] = useState('');
  const [extraModal, setExtraModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [columns, setColumns] = useState(['id', 'name', 'email', 'mobile']);
  const [refresh, setRefresh] = useState(reload);
  const [addCustomerModal, setAddCustomerModal] = useState(false);

  const [extraModal1, setExtraModal1] = useState(false);
  const [useOpen, setUseOpen] = useState(false);
  const [placeholderName, setPlaceholder] = useState('');

  const [employeeOpen, setEmployeeOpen] = useState(false);
  const [employeeKeyword, setEmployeeKeyword] = useState('');

  const [spaceOpen, setSpaceOpen] = useState(false);
  const [spaceKeyword, setSpaceKeyword] = useState('');

  const [assetOpen, setAssetOpen] = useState(false);
  const [assetKeyword, setAssetKeyword] = useState('');

  const [departmentOpen, setDepartmentOpen] = useState(false);
  const [departmentKeyword, setDepartmentKeyword] = useState('');

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const {
    partnersInfo,
    employeeListInfo,
  } = useSelector((state) => state.equipment);
  const {
    createTenantinfo,
    departmentsInfo,
  } = useSelector((state) => state.setup);
  const {
    transferDetails, quotationDetails, pickingTypes, stockLocations,
    transferFilters,
  } = useSelector((state) => state.purchase);

  const { spaceInfoList, equipmentInfo } = useSelector((state) => state.ticket);

  useEffect(() => {
    setRefresh(refresh);
  }, [reload]);

  useEffect(() => {
    if (use_in && !editId) {
      setFieldValue('space_id', '');
      setFieldValue('asset_id', '');
      setFieldValue('employee_id', '');
      setFieldValue('department_id', '');
    }
  }, [use_in, editId]);

  useEffect(() => {
    if (userInfo && userInfo.data && assetOpen) {
      const keywordTrim = assetKeyword ? encodeURIComponent(assetKeyword.trim()) : '';
      dispatch(getEquipmentList(companies, appModels.EQUIPMENT, keywordTrim));
    }
  }, [userInfo, assetKeyword, assetOpen]);

  useEffect(() => {
    if (userInfo && userInfo.data && departmentOpen) {
      const keywordTrim = departmentKeyword ? encodeURIComponent(departmentKeyword.trim()) : '';
      dispatch(getDepartments(companies, appModels.DEPARTMENT, keywordTrim));
    }
  }, [userInfo, departmentKeyword, departmentOpen]);

  useEffect(() => {
    if (userInfo && userInfo.data && employeeOpen) {
      dispatch(getEmployeeDataList(companies, appModels.EMPLOYEE, employeeKeyword));
    }
  }, [userInfo, employeeKeyword, employeeOpen]);

  useEffect(() => {
    if (userInfo && userInfo.data && spaceOpen) {
      const keywordTrim = spaceKeyword ? encodeURIComponent(spaceKeyword.trim()) : '';
      dispatch(getSpaceAllSearchList(companies, appModels.SPACE, keywordTrim));
    }
  }, [userInfo, spaceKeyword, spaceOpen]);

  /* useEffect(() => {
    if (refresh === '1' && !editId) {
      if (picking_type_id) {
        if (picking_type_id.default_location_src_id) {
          setFieldValue('location_id', { id: picking_type_id.default_location_src_id[0], name: picking_type_id.default_location_src_id[1] });
        } else {
          setFieldValue('location_id', '');
        }
        if (picking_type_id.default_location_dest_id) {
          setFieldValue('location_dest_id', { id: picking_type_id.default_location_dest_id[0], name: picking_type_id.default_location_dest_id[1] });
        } else {
          setFieldValue('location_dest_id', '');
        }
      } else {
        setFieldValue('location_id', '');
        setFieldValue('location_dest_id', '');
      }
    }
  }, [refresh, picking_type_id, editId]);

  useEffect(() => {
    if (refresh === '1' && !editId) {
      if (!location_id) {
        setFieldValue('location_dest_id', '');
      }
      if (location_id && location_id.location_id) {
        setFieldValue('location_dest_id', '');
      }
    }
  }, [refresh, location_id]); */

  useEffect(() => {
    if (refresh === '1' && !editId) {
      setFieldValue('scheduled_date', moment(new Date()).format('YYYY-MM-DD HH:mm:ss'));
    }
  }, [refresh, location_id, code]);

  /* useEffect(() => {
    if (refresh === '1' && editId) {
      if (picking_type_id) {
        if (picking_type_id.default_location_src_id) {
          setFieldValue('location_id', { id: picking_type_id.default_location_src_id[0], name: picking_type_id.default_location_src_id[1] });
        }
        if (picking_type_id.default_location_dest_id) {
          setFieldValue('location_dest_id', { id: picking_type_id.default_location_dest_id[0], name: picking_type_id.default_location_dest_id[1] });
        }
      } else {
        setFieldValue('location_id', '');
        setFieldValue('location_dest_id', '');
      }
    }
  }, [refresh, picking_type_id, editId]); */

  /* useEffect(() => {
    if (refresh === '1' && !editId) {
      if (transferFilters && transferFilters.types) {
        const data = transferFilters.types.filter((item) => (item.id));
        if (data && data.length) {
          setFieldValue('picking_type_id', {
            id: data[0].id, name: data[0].name, default_location_src_id: data[0].source_id ? data[0].source_id : false, default_location_dest_id: data[0].destination_id ? data[0].destination_id : false,
          });
        }
      }
    }
  }, [refresh, transferFilters, editId]); */

  useEffect(() => {
    if (pickingData && pickingData.id) {
      setFieldValue('picking_type_id', {
        id: pickingData.id, name: pickingData.name,
      });
    }
  }, [pickingData]);

  useEffect(() => {
    if (!editId && quotationDetails && quotationDetails.data) {
      if (quotationDetails.data[0].name) {
        setFieldValue('origin', quotationDetails.data[0].name);
      }
    }
  }, [editId, quotationDetails]);

  useEffect(() => {
    if (userInfo && userInfo.data && customerOpen) {
      dispatch(getPartners(companies, appModels.PARTNER, 'supplier', customerKeyword, false, true));
    }
  }, [userInfo, customerKeyword, customerOpen]);

  useEffect(() => {
    if (userInfo && userInfo.data && typeOpen) {
      dispatch(getStockPickingTypes(companies, appModels.STOCKPICKINGTYPES, typeKeyword, id ? '' : 'all'));
    }
  }, [userInfo, typeKeyword, typeOpen]);

  useEffect(() => {
    if (userInfo && userInfo.data && destLocOpen) {
      dispatch(getStockLocations(companies, appModels.STOCKLOCATION, destLocKeyword, code !== 'outgoing' && isMultiLocation ? 'scrap' : false));
    }
  }, [userInfo, destLocKeyword, destLocOpen]);

  useEffect(() => {
    if (userInfo && userInfo.data && locOpen) {
      dispatch(getStockLocations(companies, appModels.STOCKLOCATION, locKeyword, code !== 'incoming' && isMultiLocation ? 'scrap' : false));
    }
  }, [userInfo, locKeyword, locOpen]);

  const noData = partnersInfo && partnersInfo.err ? partnersInfo.err.data : false;

  useEffect(() => {
    if (((userInfo && userInfo.data) && (noData && (noData.status_code && noData.status_code === 404)) && (customerKeyword && customerKeyword.length) && !extraModal)) {
      setCustomerOpen(false);
    }
  }, [customerKeyword, partnersInfo]);

  const onDestLocKeywordChange = (event) => {
    setDestLocKeyword(event.target.value);
  };

  const onSourceLocKeywordChange = (event) => {
    setLocKeyword(event.target.value);
  };

  const onEmployeeKeyWordChange = (event) => {
    setEmployeeKeyword(event.target.value);
  };

  const onSpaceKeyWordChange = (event) => {
    setSpaceKeyword(event.target.value);
  };

  const onAssetKeyWordChange = (event) => {
    setAssetKeyword(event.target.value);
  };

  const onDepKeyWordChange = (event) => {
    setSpaceKeyword(event.target.value);
  };

  const onEmployeeClear = () => {
    setEmployeeKeyword(null);
    setFieldValue('employee_id', '');
    setEmployeeOpen(false);
  };

  const showEmployeeModal = () => {
    setModelValue(appModels.EMPLOYEE);
    setColumns(['id', 'name', 'work_phone', 'work_email']);
    setFieldName('employee_id');
    setModalName('Employee List');
    setPlaceholder('Employees');
    setCompanyValue(companies);
    setExtraModal1(true);
  };

  const onAssetClear = () => {
    setEmployeeKeyword(null);
    setFieldValue('asset_id', '');
    setEmployeeOpen(false);
  };

  const showAssetModal = () => {
    setModelValue(appModels.EQUIPMENT);
    setColumns(['id', 'name', 'category_id']);
    setFieldName('asset_id');
    setModalName('Equipments List');
    setPlaceholder('Equipments');
    setCompanyValue(companies);
    setExtraModal1(true);
  };

  const onDepClear = () => {
    setEmployeeKeyword(null);
    setFieldValue('department_id', '');
    setEmployeeOpen(false);
  };

  const showDepModal = () => {
    setModelValue(appModels.DEPARTMENT);
    setColumns(['id', 'name']);
    setFieldName('department_id');
    setModalName('Departments List');
    setPlaceholder('Departments');
    setCompanyValue(companies);
    setExtraModal1(true);
  };

  const onSpaceClear = () => {
    setSpaceKeyword(null);
    setFieldValue('space_id', '');
    setEmployeeOpen(false);
  };

  const showSpaceModal = () => {
    setModelValue(appModels.SPACE);
    setColumns(['id', 'name', 'path_name', 'space_name', 'asset_category_id']);
    setFieldName('space_id');
    setModalName('Space List');
    setPlaceholder('Spaces');
    setCompanyValue(companies);
    setExtraModal1(true);
  };

  const showDestLocModal = () => {
    setModelValue(appModels.STOCKLOCATION);
    setFieldName('location_dest_id');
    setModalName('Destination Locations');
    setOtherFieldName(code !== 'outgoing' && isMultiLocation ? 'usage' : false);
    setOtherFieldValue(code !== 'outgoing' && isMultiLocation ? 'internal' : false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraModal(true);
    setColumns(['id', 'name']);
  };

  const onDestLocKeywordClear = () => {
    setCustomerKeyword(null);
    setFieldValue('location_dest_id', '');
    setCustomerOpen(false);
  };

  const showLocModal = () => {
    setModelValue(appModels.STOCKLOCATION);
    setFieldName('location_id');
    setModalName('Source Locations');
    setOtherFieldName(code !== 'incoming' && isMultiLocation ? 'usage' : false);
    setOtherFieldValue(code !== 'incoming' && isMultiLocation ? 'internal' : false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraModal(true);
    setColumns(['id', 'name']);
  };

  const onLocKeywordClear = () => {
    setCustomerKeyword(null);
    setFieldValue('location_id', '');
    setCustomerOpen(false);
  };

  const showRequestorModal = () => {
    setModelValue(appModels.PARTNER);
    setFieldName('partner_id');
    setModalName('Vendors');
    setOtherFieldName('supplier');
    setOtherFieldValue(true);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraModal(true);
    setColumns(['id', 'name', 'email', 'mobile']);
  };

  const onCustomerKeywordChange = (event) => {
    setCustomerKeyword(event.target.value);
  };

  const onKeywordClear = () => {
    setCustomerKeyword(null);
    setFieldValue('partner_id', '');
    setCustomerOpen(false);
  };

  const showTypeModal = () => {
    setModelValue(appModels.STOCKPICKINGTYPES);
    setFieldName('picking_type_id');
    setModalName('Operation Types');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(false);
    setExtraModal(true);
    setColumns(['id', 'name', 'warehouse_id', 'default_location_src_id', 'default_location_dest_id']);
  };

  const onTypeKeywordChange = (event) => {
    setTypeKeyword(event.target.value);
  };

  const onTypeKeywordClear = () => {
    setCustomerKeyword(null);
    setFieldValue('picking_type_id', '');
    setCustomerOpen(false);
  };

  const employeeOptions = extractOptionsObject(employeeListInfo, employee_id);
  const assetOptions = extractOptionsObject(equipmentInfo, asset_id);
  const depOptions = extractOptionsObject(departmentsInfo, department_id);
  const spaceOptions = extractOptionsObjectWithName(spaceInfoList, space_id, 'path_name');

  let customerOptions = [];
  let typeOptions = [];
  let destLocOptions = [];
  let locOptions = [];

  if (stockLocations && stockLocations.loading) {
    if (destLocOpen) {
      destLocOptions = [{ name: 'Loading..' }];
    }
    if (locOpen) {
      locOptions = [{ name: 'Loading..' }];
    }
  }

  if (stockLocations && stockLocations.err) {
    if (destLocOpen) {
      destLocOptions = [];
    }
    if (locOpen) {
      locOptions = [];
    }
  }

  if (location_dest_id && location_dest_id.length && location_dest_id.length > 0) {
    const oldId = [{ id: location_dest_id[0], name: location_dest_id[1] }];
    const newArr = [...destLocOptions, ...oldId];
    destLocOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }

  if (location_id && location_id.length && location_id.length > 0) {
    const oldId = [{ id: location_id[0], name: location_id[1] }];
    const newArr = [...locOptions, ...oldId];
    locOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }

  if (stockLocations && stockLocations.data) {
    if (destLocOpen) {
      const sid = extractValueObjects(location_id);
      const data = getTrimmedArray(stockLocations.data, 'id', sid);
      const arr = [...destLocOptions, ...data];
      destLocOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
    }
    if (locOpen) {
      const sid = extractValueObjects(location_dest_id);
      const data = getTrimmedArray(stockLocations.data, 'id', sid);
      const arr = [...locOptions, ...data];
      locOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
    }
  }

  if (partnersInfo && partnersInfo.loading) {
    customerOptions = [{ name: 'Loading..' }];
  }

  if (partner_id && partner_id.length && partner_id.length > 0) {
    const oldPartId = [{ id: partner_id[0], name: partner_id[1] }];
    const newArr = [...customerOptions, ...oldPartId];
    customerOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }

  if (partnersInfo && partnersInfo.data) {
    const arr = [...customerOptions, ...partnersInfo.data];
    customerOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }

  if (partnersInfo && partnersInfo.err) {
    customerOptions = [];
  }

  if (pickingTypes && pickingTypes.loading) {
    typeOptions = [{ name: 'Loading..' }];
  }

  if (picking_type_id && picking_type_id.length && picking_type_id.length > 0) {
    const oldPartId = [{ id: picking_type_id[0], name: picking_type_id[1] }];
    const newArr = [...typeOptions, ...oldPartId];
    typeOptions = [...new Map(newArr.map((item) => [item.id, item])).values()];
  }

  if (pickingTypes && pickingTypes.data) {
    const arr = [...typeOptions, ...pickingTypes.data];
    typeOptions = [...new Map(arr.map((item) => [item.id, item])).values()];
  }

  if (pickingTypes && pickingTypes.err) {
    typeOptions = [];
  }

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

  const useTypes = [{ value: 'Asset', label: 'Asset' }, { value: 'Location', label: 'Location' }, { value: 'Employee', label: 'Employee' }];

  const states = editId && transferDetails && transferDetails.data && transferDetails.data.length > 0 ? transferDetails.data[0].state : false;
  const tranferData = editId && transferDetails && transferDetails.data && transferDetails.data.length ? transferDetails.data[0] : '';
  const isEditable = (tranferData && tranferData.picking_type_code !== 'outgoing' && (tranferData.request_state === 'Requested' || tranferData.state === 'Approved')) || !editId;

  return (
    <>
      <Box
        sx={{
          marginTop: '20px',
          display: 'flex',
          gap: '35px',
          width: '100%',
        }}
      >
        <Box sx={{ width: '50%' }}>
          {code === 'internal' && (
            <>
              <MuiAutoComplete
                sx={{
                  marginTop: 'auto',
                  marginBottom: '10px',
                  width: '100%',
                }}
                name={useIn.name}
                isRequired
                label={useIn.label}
                formGroupClassName="m-1"
                className="bg-white"
                open={useOpen}
                disableClearable
                oldValue={use_in}
                value={use_in && use_in.label ? use_in.label : use_in}
                size="small"
                onOpen={() => {
                  setUseOpen(true);
                }}
                onClose={() => {
                  setUseOpen(false);
                }}
                getOptionSelected={(option, value) => option.label === value.label}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                options={useTypes}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    label={`${useIn.label}`}
                    required
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
              {(use_in === 'Employee' || (use_in && use_in.label === 'Employee')) && (
                <MuiAutoComplete
                  sx={{
                    marginTop: 'auto',
                    marginBottom: '10px',
                    width: '100%',
                  }}
                  name={employeeId.name}
                  label={employeeId.label}
                  isRequired
                  formGroupClassName="m-1"
                  oldValue={getOldData(employee_id)}
                  value={employee_id && employee_id.name ? employee_id.name : getOldData(employee_id)}
                  apiError={(employeeListInfo && employeeListInfo.err) ? generateErrorMessage(employeeListInfo) : false}
                  open={employeeOpen}
                  size="small"
                  onOpen={() => {
                    setEmployeeOpen(true);
                    setEmployeeKeyword('');
                  }}
                  onClose={() => {
                    setEmployeeOpen(false);
                    setEmployeeKeyword('');
                  }}
                  loading={employeeListInfo && employeeListInfo.loading}
                  getOptionSelected={(option, value) => option.name === value.name}
                  getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                  options={employeeOptions}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      onChange={onEmployeeKeyWordChange}
                      variant="standard"
                      label={`${employeeId.label}`}
                      required
                      value={employeeKeyword}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {employeeListInfo && employeeListInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                            <InputAdornment position="end">
                              {((getOldData(employee_id)) || (employee_id && employee_id.id) || (employeeKeyword && employeeKeyword.length > 0)) && (
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={onEmployeeClear}
                                >
                                  <IoCloseOutline size={22} fontSize="small" />
                                </IconButton>
                              )}
                              <IconButton
                                aria-label="toggle search visibility"
                                onClick={showEmployeeModal}
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
              )}
              {(use_in === 'Asset' || (use_in && use_in.label === 'Asset')) && (
                <MuiAutoComplete
                  sx={{
                    marginTop: 'auto',
                    marginBottom: '10px',
                    width: '100%',
                  }}
                  name={assetId.name}
                  label={assetId.label}
                  isRequired
                  formGroupClassName="m-1"
                  oldValue={getOldData(asset_id)}
                  value={asset_id && asset_id.name ? asset_id.name : getOldData(asset_id)}
                  apiError={(equipmentInfo && equipmentInfo.err) ? generateErrorMessage(equipmentInfo) : false}
                  open={assetOpen}
                  size="small"
                  onOpen={() => {
                    setAssetOpen(true);
                    setAssetKeyword('');
                  }}
                  onClose={() => {
                    setAssetOpen(false);
                    setAssetKeyword('');
                  }}
                  getOptionDisabled={() => equipmentInfo && equipmentInfo.loading}
                  getOptionSelected={(option, value) => option.name === value.name}
                  getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                  options={assetOptions}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      onChange={onAssetKeyWordChange}
                      value={assetKeyword}
                      label={`${assetId.label}`}
                      required
                      variant="standard"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {equipmentInfo && equipmentInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                            <InputAdornment position="end">
                              {((getOldData(asset_id)) || (asset_id && asset_id.id) || (assetKeyword && assetKeyword.length > 0)) && (
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={onAssetClear}
                                >
                                  <IoCloseOutline size={22} fontSize="small" />
                                </IconButton>
                              )}
                              <IconButton
                                aria-label="toggle search visibility"
                                onClick={showAssetModal}
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
              )}
              {/* (use_in === 'Department' || (use_in && use_in.label === 'Department')) && (
                <MuiAutoComplete
                  sx={{
                    marginTop: "auto",
                    marginBottom: "10px",
                    width: '100%'
                  }}
                  name={departmentId.name}
                  label={departmentId.label}
                  isRequired
                  formGroupClassName="m-1"
                  oldValue={getOldData(department_id)}
                  value={department_id && department_id.name ? department_id.name : getOldData(department_id)}
                  apiError={(departmentsInfo && departmentsInfo.err) ? generateErrorMessage(departmentsInfo) : false}
                  open={departmentOpen}
                  size="small"
                  onOpen={() => {
                    setDepartmentOpen(true);
                    setDepartmentKeyword('');
                  }}
                  onClose={() => {
                    setDepartmentOpen(false);
                    setDepartmentKeyword('');
                  }}
                  loading={departmentsInfo && departmentsInfo.loading}
                  getOptionSelected={(option, value) => option.name === value.name}
                  getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                  options={depOptions}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      onChange={onDepKeyWordChange}
                      variant="standard"
                      label={departmentId.label}
                      value={departmentKeyword}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {departmentsInfo && departmentsInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                            <InputAdornment position="end">
                              {((getOldData(department_id)) || (department_id && department_id.id) || (departmentKeyword && departmentKeyword.length > 0)) && (
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={onDepClear}
                                >
                                  <IoCloseOutline size={22} fontSize="small" />
                                </IconButton>
                              )}
                              <IconButton
                                aria-label="toggle search visibility"
                                onClick={showDepModal}
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
                    ) */}
              {(use_in === 'Location' || (use_in && use_in.label === 'Location')) && (
                <MuiAutoComplete
                  sx={{
                    marginTop: 'auto',
                    marginBottom: '10px',
                    width: '100%',
                  }}
                  name={spaceId.name}
                  label={spaceId.label}
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
                          {option?.path_name && (
                            <Box>
                              <Typography
                                sx={{
                                  font: 'Suisse Intl',
                                  fontSize: '12px',
                                }}
                              >
                                {option?.path_name}
                              </Typography>
                            </Box>
                          )}
                          {option?.mobile && (
                            <Box>
                              <Typography
                                sx={{
                                  font: 'Suisse Intl',
                                  fontSize: '12px',
                                }}
                              >
                                <span>
                                  {' '}
                                  {option.asset_category_id && (
                                  <>
                                    {extractTextObject(option.asset_category_id)}
                                  </>
                                  )}
                                </span>
                              </Typography>
                            </Box>
                          )}
                        </>
                      )}
                    />
                  )}
                  options={spaceOptions}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      onChange={onSpaceKeyWordChange}
                      value={spaceKeyword}
                      variant="standard"
                      label={spaceId.label}
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
              )}
            </>
          )}
          {code !== 'internal' && (
            <>
              <MuiAutoComplete
                sx={{
                  marginTop: 'auto',
                  marginBottom: '10px',
                  width: '100%',
                }}
                name={partnerId.name}
                label={partnerId.label}
                isRequired
                oldValue={getOldData(partner_id)}
                value={partner_id && partner_id.name ? partner_id.name : getOldData(partner_id) ? getOldData(partner_id) : customerKeyword}
                open={customerOpen}
                size="small"
                onOpen={() => {
                  setCustomerOpen(true);
                }}
                onClose={() => {
                  setCustomerOpen(false);
                }}
                classes={{
                  option: classes.option,
                }}
                getOptionDisabled={() => partnersInfo && partnersInfo.loading}
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
                        {option?.email && (
                          <Box>
                            <Typography
                              sx={{
                                font: 'Suisse Intl',
                                fontSize: '12px',
                              }}
                            >
                              <MailOutline
                                style={{ height: '15px' }}
                                cursor="pointer"
                              />
                              {option?.email}
                            </Typography>
                          </Box>
                        )}
                        {option?.mobile && (
                          <Box>
                            <Typography
                              sx={{
                                font: 'Suisse Intl',
                                fontSize: '12px',
                              }}
                            >
                              <CallOutlined
                                style={{ height: '15px' }}
                                cursor="pointer"
                              />
                              <span>{option.mobile}</span>
                            </Typography>
                          </Box>
                        )}
                      </>
                    )}
                  />
                )}
                options={customerOptions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    onChange={onCustomerKeywordChange}
                    value={customerKeyword}
                    variant="standard"
                    label={`${partnerId.label}`}
                    required
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {partnersInfo && partnersInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                          <InputAdornment position="end">
                            {(((partner_id && partner_id.id) || (customerKeyword && customerKeyword.length > 0) || (partner_id && partner_id.length))) && (
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
              {((partnersInfo && partnersInfo.err && customerOpen) && !(noData.status_code && noData.status_code === 404)) && (
                <FormHelperText><span className="text-danger">{generateErrorMessage(partnersInfo)}</span></FormHelperText>
              )}
              {(noData && noData.status_code && noData.status_code === 404 && customerKeyword && customerKeyword.length) && (
                <FormHelperText>
                  <span>{`New Vendor "${customerKeyword}" will be created. Do you want to create..? Click`}</span>
                  <span aria-hidden="true" onClick={() => setAddCustomerModal(true)} className="text-info ml-2 cursor-pointer">YES</span>
                </FormHelperText>
              )}
            </>
          )}
        </Box>
        <Box sx={{ width: '50%' }}>
          {code !== 'incoming' && (
            <>
              <MuiAutoComplete
                sx={{
                  marginTop: 'auto',
                  marginBottom: '10px',
                  width: '100%',
                }}
                name={locationId.name}
                label={locationId.label}
                isRequired
                disabled={editId}
                formGroupClassName="m-1"
                oldValue={getOldData(location_id)}
                value={location_id && location_id.name ? location_id.name : getOldData(location_id)}
                open={locOpen}
                size="small"
                onOpen={() => {
                  setLocOpen(true);
                  setLocKeyword('');
                }}
                onClose={() => {
                  setLocOpen(false);
                  setLocKeyword('');
                }}
                getOptionDisabled={() => stockLocations && stockLocations.loading}
                getOptionSelected={(option, value) => option.name === value.name}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                options={locOptions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    onChange={onSourceLocKeywordChange}
                    value={locKeyword}
                    variant="standard"
                    label={`${locationId.label}`}
                    required
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {stockLocations && stockLocations.loading && locOpen ? <CircularProgress color="inherit" size={20} /> : null}
                          <InputAdornment position="end">
                            {((!editId) && ((location_id && location_id.id) || (locKeyword && locKeyword.length > 0) || (location_id && location_id.length))) && (
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={onLocKeywordClear}
                              >
                                <IoCloseOutline size={22} fontSize="small" />
                              </IconButton>
                            )}
                            {(!editId) && (
                              <IconButton
                                aria-label="toggle search visibility"
                                onClick={showLocModal}
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
              {(stockLocations && stockLocations.err && locOpen) && (
                <FormHelperText><span className="text-danger">{generateErrorMessage(stockLocations)}</span></FormHelperText>
              )}
            </>
          )}
          {code === 'incoming' && isMultiLocation && (
            <>
              <MuiAutoComplete
                sx={{
                  marginTop: 'auto',
                  marginBottom: '10px',
                  width: '100%',
                }}
                name={locationDestId.name}
                label={locationDestId.label}
                isRequired
                disabled={editId}
                formGroupClassName="m-1"
                oldValue={getOldData(location_dest_id)}
                value={location_dest_id && location_dest_id.name ? location_dest_id.name : getOldData(location_dest_id)}
                open={destLocOpen}
                size="small"
                onOpen={() => {
                  setDestLocOpen(true);
                  setDestLocKeyword('');
                }}
                onClose={() => {
                  setDestLocOpen(false);
                  setDestLocKeyword('');
                }}
                getOptionDisabled={() => stockLocations && stockLocations.loading}
                getOptionSelected={(option, value) => option.name === value.name}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                options={destLocOptions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    onChange={onDestLocKeywordChange}
                    variant="standard"
                    label={`${locationDestId.label}`}
                    required
                    value={destLocKeyword}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {stockLocations && stockLocations.loading && destLocOpen ? <CircularProgress color="inherit" size={20} /> : null}
                          <InputAdornment position="end">
                            {((!editId) && ((location_dest_id && location_dest_id.id)
                              || (destLocKeyword && destLocKeyword.length > 0) || (location_dest_id && location_dest_id.length))) && (
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={onDestLocKeywordClear}
                                >
                                  <IoCloseOutline size={22} fontSize="small" />
                                </IconButton>
                            )}
                            {(!editId) && (
                              <IconButton
                                aria-label="toggle search visibility"
                                onClick={showDestLocModal}
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
              {(stockLocations && stockLocations.err && destLocOpen) && (
                <FormHelperText><span className="text-danger">{generateErrorMessage(stockLocations)}</span></FormHelperText>
              )}
            </>
          )}
        </Box>
      </Box>

      <Dialog size="lg" fullWidth open={extraModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraModal(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <SearchModal
              modelName={modelValue}
              afterReset={() => { setExtraModal(false); }}
              fieldName={fieldName}
              fields={columns}
              company={companyValue}
              otherFieldName={otherFieldName}
              otherFieldValue={otherFieldValue}
              srcLocation={location_id}
              destLocation={location_dest_id}
              setFieldValue={setFieldValue}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>

      <Dialog size={(createTenantinfo && createTenantinfo.data) ? 'sm' : 'xl'} fullWidth open={addCustomerModal}>
        <DialogHeader title="Add Vendor" imagePath={false} onClose={() => { setAddCustomerModal(false); }} response={createTenantinfo} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <AddCustomer
              afterReset={() => { setAddCustomerModal(false); setCustomerKeyword(''); }}
              setFieldValue={setFieldValue}
              requestorName={customerKeyword}
              type="vendor"
              updateField="partner_id"
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>

      <Dialog size="lg" fullWidth open={extraModal1}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraModal1(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <SearchModalAdvanced
              modelName={modelValue}
              afterReset={() => { setExtraModal1(false); }}
              fieldName={fieldName}
              fields={columns}
              company={companyValue}
              placeholderName={placeholderName}
              setFieldValue={setFieldValue}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
};

BasicFormNew.propTypes = {
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  id: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  typeDisabled: PropTypes.oneOfType([
    PropTypes.bool,
  ]),
  code: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
  isMultiLocation: PropTypes.bool,
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  setFieldTouched: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  reload: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]).isRequired,
  pickingData: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};
BasicFormNew.defaultProps = {
  typeDisabled: false,
  code: false,
  isMultiLocation: false,
  pickingData: {},
};

export default BasicFormNew;
