/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable max-len */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-nested-ternary */
/* eslint-disable camelcase */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Label,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
  TextField, CircularProgress,
  FormHelperText,
} from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';
import { useFormikContext } from 'formik';
import { Box } from '@mui/system';
import {
  Typography,
  Dialog, DialogContent, DialogContentText,
  ListItemText, Divider,
} from '@mui/material';
import dayjs from 'dayjs';
import { IoCloseOutline } from 'react-icons/io5';
import { Autocomplete } from '@material-ui/lab';
import { CallOutlined, MailOutline } from '@mui/icons-material';
import { makeStyles } from '@material-ui/core/styles';

import {
  CheckboxFieldGroup,
} from '@shared/formFields';

import moment from 'moment-timezone';
import {
  generateErrorMessage, getAllowedCompanies, extractOptionsObject, extractOptionsObjectWithName, usMobile, getListOfModuleOperations,
  getColumnArrayById,
} from '../../util/appUtils';
import {
  getEmployeeList, getPartners,
} from '../../assets/equipmentService';
import { getEquipmentList, getSpaceAllSearchList } from '../../helpdesk/ticketService';
import { getGatePassPartsData } from '../gatePassService';
import AdvancedSearchModal from './advancedSearchModal';
import SearchModalMultiple from './searchModalMultiple';

import MuiAutoComplete from '../../commonComponents/formFields/muiAutocomplete';
import MuiTextField from '../../commonComponents/formFields/muiTextField';
import MuiTextarea from '../../commonComponents/formFields/muiTextarea';
import MuiDateTimeField from '../../commonComponents/formFields/muiDateTimeField';
import DialogHeader from '../../commonComponents/dialogHeader';
import { AddThemeColor } from '../../themes/theme';
import actionCodes from '../data/actionCodes.json';
import AddCustomer from '../../adminSetup/siteConfiguration/addTenant/addCustomer';
import SearchModalMultipleSelect from '../../helpdesk/reports/reportsSetup/searchModalMultiple';

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
  root: {
    // input label when focused
    '& label.Mui-focused': {
      color: AddThemeColor({}).color,
    },
    // focused color for input with variant='standard'
    '& .MuiInput-underline:after': {
      borderBottomColor: AddThemeColor({}).color,
    },
    // focused color for input with variant='filled'
    '& .MuiFilledInput-underline:after': {
      borderBottomColor: AddThemeColor({}).color,
    },
    // focused color for input with variant='outlined'
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': {
        borderColor: AddThemeColor({}).color,
      },
    },
  },
});

const BasicForm = (props) => {
  const dispatch = useDispatch();
  const {
    setFieldValue,
    setFieldTouched,
    editId,
    addModal,
    formField: {
      purpose,
      Reference,
      requestor,
      typeValue,
      gatePassType,
      RequestedOn,
      space,
      vendorId,
      bearerName,
      bearerReturnOn,
      bearerToReturnOn,
      bearerMobile,
      bearerEmail,
    },
  } = props;
  const { values: formValues } = useFormikContext();
  const {
    requestor_id, type, space_id, requested_on, gatepass_type, bearer_return_on, to_be_returned_on, vendor_id,
  } = formValues;
  const [atOpen, setAtOpen] = useState(false);
  const [atKeyword, setAtKeyword] = useState('');
  const [spaceOpen, setSpaceOpen] = useState(false);
  const [spacekeyword, setSpaceKeyword] = useState('');

  const [placeholderName, setPlaceholder] = useState('');
  const [extraModal, setExtraModal] = useState(false);
  const [extraMultipleModal, setExtraMultipleModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [columns, setColumns] = useState(['id', 'name']);
  const [customerOpen, setCustomerOpen] = useState(false);
  const [customerKeyword, setCustomerKeyword] = useState('');
  const [addCustomerModal, setAddCustomerModal] = useState(false);
  const [equipmentOpen, setEquipmentOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);
  const [equipmentKeyword, setEquipmentKeyword] = useState('');

  const [multipleModal, setMultipleModal] = useState(false);
  const [equipmentOptions, setEquipmentOptions] = useState([]);

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const classes = useStyles();
  const companies = getAllowedCompanies(userInfo);
  const {
    employeesInfo, partnersInfo,
  } = useSelector((state) => state.equipment);
  const { spaceInfoList, equipmentInfo } = useSelector((state) => state.ticket);
  const {
    gatePassConfig,
    gatePassDetails,
  } = useSelector((state) => state.gatepass);
  const {
    createTenantinfo,
  } = useSelector((state) => state.setup);

  const detailedData = gatePassDetails && gatePassDetails.data && gatePassDetails.data.length ? gatePassDetails.data[0] : '';

  const gpConfig = gatePassConfig && gatePassConfig.data && gatePassConfig.data.length ? gatePassConfig.data[0] : false;

  const noData = partnersInfo && partnersInfo.err ? partnersInfo.err.data : false;

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Gate Pass', 'code');

  const isCreatable = allowedOperations.includes(actionCodes['Add Vendors']);

  let types = [{ value: 'Item', label: 'Item' }, { value: 'Asset', label: 'Asset' }];

  if (gpConfig && gpConfig.show_items && gpConfig && !gpConfig.show_assets) {
    types = [{ value: 'Item', label: 'Item' }];
  } else if (gpConfig && !gpConfig.show_items && gpConfig && gpConfig.show_assets) {
    types = [{ value: 'Asset', label: 'Asset' }];
  } else {
    types = [{ value: 'Item', label: 'Item' }, { value: 'Asset', label: 'Asset' }];
  }

  const gType = gatepass_type && gatepass_type.value ? gatepass_type.value : gatepass_type;

  console.log(gatepass_type);

 /* useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data) {
        await dispatch(getEquipmentList(companies, appModels.EQUIPMENT, equipmentKeyword, false, false, false, false, false, getColumnArrayById(asset_ids, 'id')));
      }
    })();
  }, [userInfo]); */

  useEffect(() => {
    if (gType) {
      if (gType === 'Item') {
        dispatch(getGatePassPartsData([]));
        setFieldValue('asset_ids', []);
      } else if (gType === 'Asset') {
        setFieldValue('order_lines', []);
        dispatch(getGatePassPartsData([]));
      }
    }
  }, [gatepass_type]);

  useEffect(() => {
    if (!editId && gpConfig && !(gpConfig.show_items && gpConfig.show_assets)) {
      if (gpConfig.show_items) {
        setFieldValue('gatepass_type', 'Item');
      } else if (gpConfig.show_assets) {
        setFieldValue('gatepass_type', 'Asset');
      }
    }
  }, [editId, gatePassConfig]);

  useEffect(() => {
    if (userInfo && userInfo.data && customerOpen) {
      dispatch(getPartners(companies, appModels.PARTNER, 'supplier', customerKeyword, false, true));
    }
  }, [userInfo, customerKeyword, customerOpen]);

  useEffect(() => {
    if (((userInfo && userInfo.data) && isCreatable && (noData && (noData.status_code && noData.status_code === 404)) && (customerKeyword && customerKeyword.length > 3) && !extraModal)) {
      setCustomerOpen(false);
    }
  }, [userInfo, customerKeyword, partnersInfo]);

  useEffect(() => {
    if (requested_on && !(editId && detailedData && detailedData.state === 'Returned')) {
      const duration = '24';
      const dt = new Date(requested_on);
      const endDateAdd = dt.setTime(dt.getTime() + (duration * 60 * 60 * 1000));
      if (!to_be_returned_on) {
        // setFieldValue('bearer_return_on', new Date(endDateAdd));
        setFieldValue('to_be_returned_on', new Date(endDateAdd));
      } else if (new Date(requested_on) >= new Date(to_be_returned_on)) {
        setFieldValue('to_be_returned_on', new Date(endDateAdd));
      }
    }
  }, [requested_on]);

  useEffect(() => {
    if (requested_on && editId && detailedData && detailedData.state === 'Returned') {
      const duration = '24';
      const dt = new Date(requested_on);
      const endDateAdd = dt.setTime(dt.getTime() + (duration * 60 * 60 * 1000));
      if (!bearer_return_on) {
        setFieldValue('bearer_return_on', new Date(endDateAdd));
        setFieldValue('to_be_returned_on', new Date(endDateAdd));
      } else if (new Date(requested_on) >= new Date(bearer_return_on) && new Date(requested_on) >= new Date(to_be_returned_on)) {
        setFieldValue('bearer_return_on', new Date(endDateAdd));
        setFieldValue('to_be_returned_on', new Date(endDateAdd));
      } else if (new Date(requested_on) >= new Date(bearer_return_on)) {
        setFieldValue('bearer_return_on', new Date(endDateAdd));
      } else if (new Date(requested_on) >= new Date(to_be_returned_on)) {
        setFieldValue('to_be_returned_on', new Date(endDateAdd));
      }
    }
  }, [requested_on]);

  useEffect(() => {
    if (equipmentInfo && equipmentInfo.data && equipmentInfo.data.length && equipmentOpen) {
      setEquipmentOptions(equipmentInfo.data);
    } else if (equipmentInfo && equipmentInfo.loading) {
      setEquipmentOptions([{ name: 'Loading...' }]);
    } else {
      setEquipmentOptions([]);
    }
  }, [equipmentInfo, equipmentOpen]);

  useEffect(() => {
    if (editId) {
      setFieldValue('date_valid', 'yes');
    }
  }, [editId]);

  useEffect(() => {
    if (requested_on && to_be_returned_on) {
      if (bearer_return_on && editId && detailedData && detailedData.state === 'Returned' && (new Date(requested_on) >= new Date(bearer_return_on))) {
        setFieldValue('date_valid', '');
      } else {
        setFieldValue('date_valid', 'yes');
      }
      if (new Date(requested_on) >= new Date(to_be_returned_on)) {
        setFieldValue('date_valid', '');
      } else {
        setFieldValue('date_valid', 'yes');
      }
    }
  }, [to_be_returned_on, bearer_return_on]);

  function getDifferece(date2) {
    const date1 = new Date();
    const Difference_In_Time = date2.getTime() - date1.getTime();
    const Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    return Difference_In_Days;
  }

  useEffect(() => {
    if (gpConfig) {
      setFieldValue('has_bearer_mobile', gpConfig.bearer_mobile);
      setFieldValue('has_bearer_email', gpConfig.bearer_email);
      setFieldValue('has_space', gpConfig.space);
      setFieldValue('has_reference', gpConfig.reference);
      setFieldValue('has_vendor', gpConfig.vendor);
    }
  }, [gatePassConfig]);

  useEffect(() => {
    if (type) {
      setFieldValue('has_bearer_return', type === 'Returnable' ? 'Required' : 'Optional');
    }
  }, [type]);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const empId = userInfo && userInfo.data && userInfo.data.id ? userInfo.data.id : '';
      const empName = userInfo && userInfo.data && userInfo.data.name ? userInfo.data.name : '';
      if (!editId) {
        setFieldValue('requestor_id', { id: empId, name: empName });
      }
    }
  }, [userInfo, editId]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && atOpen) {
        await dispatch(getEmployeeList(companies, appModels.USER, atKeyword));
      }
    })();
  }, [userInfo, atKeyword, atOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && spaceOpen) {
        await dispatch(getSpaceAllSearchList(companies, appModels.SPACE, spacekeyword));
      }
    })();
  }, [spaceOpen, spacekeyword]);

  const onAtKeywordChange = (event) => {
    setAtKeyword(event.target.value);
  };

  const onSpaceKeywordChange = (event) => {
    setSpaceKeyword(event.target.value);
  };

  const onSpaceSearch = () => {
    setModelValue(appModels.SPACE);
    setFieldName('space_id');
    setModalName('Space');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setColumns(['id', 'space_name', 'path_name']);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraMultipleModal(true);
  };

  const onSpaceClear = () => {
    setSpaceKeyword('');
    setSpaceOpen(false);
    setFieldValue('space_id', '');
  };

  const onGatePassTypeClear = () => {
    setTypeOpen(false);
    setFieldValue('gatepass_type', '');
    setFieldValue('order_lines', []);
    setFieldValue('asset_ids', []);
    dispatch(getGatePassPartsData([]));
  };

  const onRequestorClear = () => {
    setAtKeyword('');
    setFieldValue('requestor_id', '');
    setAtOpen(false);
  };

  const onRequestorSearch = () => {
    setModelValue(appModels.USER);
    setColumns(['id', 'name']);
    setFieldName('requestor_id');
    setModalName('Requestor');
    setPlaceholder('Requestor');
    setCompanyValue(companies);
    setExtraModal(true);
  };

  const showRequestorModal = () => {
    setModelValue(appModels.PARTNER);
    setFieldName('vendor_id');
    setModalName('Vendors');
    setPlaceholder('Vendors');
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setColumns(['id', 'name', 'email', 'mobile']);
    setExtraModal(true);
  };

  const showAssetModal = () => {
    setModelValue(appModels.EQUIPMENT);
    setFieldName('asset_ids');
    setModalName('Assets');
    setPlaceholder('Assets');
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setColumns(['id', 'name', 'location_id', 'category_id', 'serial', 'brand']);
    setMultipleModal(true);
  };

  const onAssetModalChange = (data) => {
    setFieldValue('asset_ids', data);
    setMultipleModal(false);
  };

  const onCustomerKeywordChange = (event) => {
    setCustomerKeyword(event.target.value);
  };

  const onAssetKeywordChange = (event) => {
    setEquipmentKeyword(event.target.value);
  };

  const onAssetKeywordClear = () => {
    setEquipmentKeyword(null);
    setFieldValue('asset_ids', []);
    setEquipmentOpen(false);
  };

  const onCustomerKeywordClear = () => {
    setCustomerKeyword(null);
    setFieldValue('vendor_id', '');
    setCustomerOpen(false);
  };

  const resetReturnCheck = () => {
    // setFieldValue('bearer_return_on', '');
    // setFieldValue('to_be_returned_on', '');

    if (requested_on && !(editId && detailedData && detailedData.state === 'Returned')) {
      const duration = '24';
      const dt = new Date(requested_on);
      const endDateAdd = dt.setTime(dt.getTime() + (duration * 60 * 60 * 1000));
      if (!to_be_returned_on) {
      // setFieldValue('bearer_return_on', new Date(endDateAdd));
        setFieldValue('to_be_returned_on', new Date(endDateAdd));
      } else if (new Date(requested_on) >= new Date(to_be_returned_on)) {
        setFieldValue('to_be_returned_on', new Date(endDateAdd));
      }
    }

    if (requested_on && editId && detailedData && detailedData.state === 'Returned') {
      const duration = '24';
      const dt = new Date(requested_on);
      const endDateAdd = dt.setTime(dt.getTime() + (duration * 60 * 60 * 1000));
      if (!bearer_return_on) {
        setFieldValue('bearer_return_on', new Date(endDateAdd));
        setFieldValue('to_be_returned_on', new Date(endDateAdd));
      } else if (new Date(requested_on) >= new Date(bearer_return_on) && new Date(requested_on) >= new Date(to_be_returned_on)) {
        setFieldValue('bearer_return_on', new Date(endDateAdd));
        setFieldValue('to_be_returned_on', new Date(endDateAdd));
      } else if (new Date(requested_on) >= new Date(bearer_return_on)) {
        setFieldValue('bearer_return_on', new Date(endDateAdd));
      } else if (new Date(requested_on) >= new Date(to_be_returned_on)) {
        setFieldValue('to_be_returned_on', new Date(endDateAdd));
      }
    }
  };

  const resetNonReturn = () => {
    setFieldValue('bearer_return_on', '');
    setFieldValue('to_be_returned_on', '');
  };

  const employeeListOptions = extractOptionsObject(employeesInfo, requestor_id);
  const spaceOptions = extractOptionsObjectWithName(spaceInfoList, space_id, 'path_name');
  const customerOptions = extractOptionsObject(partnersInfo, vendor_id);

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

  useEffect(() => {
    if (addModal && !editId) {
      setFieldValue('requested_on', dayjs(new Date()));
    }
  }, [addModal]);

  const handleServiceImpacted = (options) => {
    if (options && options.length && options.find((option) => option.name === 'Loading...')) {
      return false;
    }
    setFieldValue('asset_ids', options);
  };

  return (
    <>

      <MuiTextarea
        sx={{
          marginTop: 'auto',
          marginBottom: '20px',
        }}
        name={purpose.name}
        label={purpose.label}
        isRequired
        formGroupClassName="m-1"
        //   multiline={true}
        inputProps={{ maxLength: 250 }}
      />
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          gap: '3%',
        }}
      >
        <Box
          sx={{
            width: '50%',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Typography
            sx={AddThemeColor({
              font: 'normal normal medium 20px/24px Suisse Intl',
              letterSpacing: '0.7px',
              fontWeight: 500,
              marginBottom: '10px',
              paddingBottom: '4px',
            })}
          >
            Requestor Info
          </Typography>
          <Label for={typeValue.name} className="m-0">
            Type
            <span className="text-danger ml-2px">*</span>
          </Label>
          <br />
          <div className="ml-2">
            <CheckboxFieldGroup
              name={typeValue.name}
              checkedvalue="Returnable"
              id="Returnable"
              onClick={() => resetReturnCheck()}
              label={typeValue.label}
            />
            <CheckboxFieldGroup
              name={typeValue.name}
              checkedvalue="Non-Returnable"
              id="Non-Returnable"
              onClick={() => resetNonReturn()}
              label={typeValue.label1}
            />
          </div>
          <Autocomplete
            sx={{
              marginTop: 'auto',
              marginBottom: '25px',
            }}
            name={requestor.name}
            label={requestor.label}
            formGroupClassName="m-1"
            open={atOpen}
            isRequired
            oldValue={getOldData(requestor_id)}
            value={requestor_id && requestor_id.name ? requestor_id.name : ''}
            size="small"
            onOpen={() => {
              setAtOpen(true);
              setAtKeyword('');
            }}
            onClose={() => {
              setAtOpen(false);
              setAtKeyword('');
            }}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            getOptionDisabled={() => { employeesInfo && employeesInfo.loading; }}
            options={employeeListOptions}
            apiError={(employeesInfo && employeesInfo.err) ? generateErrorMessage(employeesInfo) : false}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={onAtKeywordChange}
                variant="standard"
                label={`${requestor.label}`}
                required
                value={atKeyword}
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {employeesInfo && employeesInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {((requestor_id && requestor_id.id) || (atKeyword && atKeyword.length > 0)) && (
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={onRequestorClear}
                          >
                            <IoCloseOutline size={22} fontSize="small" />
                          </IconButton>
                        )}
                        <IconButton
                          aria-label="toggle search visibility"
                          onClick={onRequestorSearch}
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
          <MuiDateTimeField
            sx={{
              marginTop: '10px',
              marginBottom: '20px',
            }}
            name={RequestedOn.name}
            label={RequestedOn.label}
            isRequired
            formGroupClassName="m-1"
            setFieldValue={setFieldValue}
            setFieldTouched={setFieldTouched}
            placeholder={RequestedOn.label}
            disablePastDate
            value={requested_on ? dayjs(editId ? moment.utc(requested_on).local().tz(userInfo?.data?.timezone).format('YYYY-MM-DD HH:mm:ss') : requested_on) : null}
            // value={requested_on ? dayjs(new Date()) : null}
            localeText={{ todayButtonLabel: 'Now' }}
            slotProps={{
              actionBar: {
                actions: ['today', 'accept'],
              },
              textField: {
                variant: 'standard', error: false,
              },
            }}
          />
          {gpConfig && gpConfig.space && gpConfig.space !== 'None' && (
            <MuiAutoComplete
              sx={{
                marginTop: 'auto',
                marginBottom: '20px',
              }}
              name={space.name}
              label={space.label}
              open={spaceOpen}
              formGroupClassName="m-1"
              isRequired={gpConfig && gpConfig.space && gpConfig.space === 'Required'}
              size="small"
              onOpen={() => {
                setSpaceOpen(true);
                setSpaceKeyword('');
              }}
              onClose={() => {
                setSpaceOpen(false);
                setSpaceKeyword('');
              }}
              oldValue={getOldData(space_id)}
              value={space_id && space_id.path_name ? space_id.path_name : getOldData(space_id)}
              getOptionDisabled={() => spaceInfoList && spaceInfoList.loading}
              getOptionSelected={(option, value) => (value.length > 0 ? option.path_name === value.path_name : '')}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.path_name)}
              options={spaceOptions}
              apiError={(spaceInfoList && spaceInfoList.err) ? generateErrorMessage(spaceInfoList) : false}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={onSpaceKeywordChange}
                  variant="standard"
                  label={`${space.label}${gpConfig && gpConfig.space && gpConfig.space === 'Required' ? '*' : ''}`}
                  placeholder="Search & Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {spaceInfoList && spaceInfoList.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        <InputAdornment position="end">
                          {((getOldData(space_id)) || (space_id && space_id.id) || (spacekeyword && spacekeyword.length > 0)) && (
                            <IconButton onClick={onSpaceClear}>
                              <IoCloseOutline size={22} fontSize="small" />
                            </IconButton>
                          )}
                          <IconButton onClick={onSpaceSearch}>
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
          {gpConfig && gpConfig.reference && gpConfig.reference !== 'None' && (
            <MuiTextField
              sx={{
                marginTop: 'auto',
                marginBottom: '20px',
              }}
              name={Reference.name}
              label={gpConfig && gpConfig.reference_display ? gpConfig.reference_display : Reference.label}
              isRequired={gpConfig && gpConfig.reference && gpConfig.reference === 'Required'}
              formGroupClassName="m-1"
              type="text"
              inputProps={{ maxLength: 50 }}
            />
          )}
        </Box>

        <Box
          sx={{
            width: '50%',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Typography
            sx={AddThemeColor({
              font: 'normal normal medium 20px/24px Suisse Intl',
              letterSpacing: '0.7px',
              fontWeight: 500,
              marginBottom: '10px',
              paddingBottom: '4px',
            })}
          >
            Bearer Info
          </Typography>
          <MuiTextField
            sx={{
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            name={bearerName.name}
            label={bearerName.label}
            formGroupClassName="m-1"
            isRequired
            type="text"
            inputProps={{ maxLength: 50 }}
          />
          {gpConfig && gpConfig.bearer_email && gpConfig.bearer_email !== 'None' && (
            <MuiTextField
              sx={{
                marginTop: 'auto',
                marginBottom: gpConfig && gpConfig.bearer_mobile && gpConfig.bearer_mobile === 'None' ? '10px' : '20px',
              }}
              name={bearerEmail.name}
              type="email"
              label={bearerEmail.label}
              isRequired={gpConfig && gpConfig.bearer_email && gpConfig.bearer_email === 'Required'}
              formGroupClassName="m-1"
              inputProps={{ maxLength: 35 }}
            />
          )}
          {gpConfig && gpConfig.bearer_mobile && gpConfig.bearer_mobile !== 'None' && (
            <MuiTextField
              sx={{
                marginTop: 'auto',
                marginBottom: '10px',
              }}
              name={bearerMobile.name}
              type="text"
              label={bearerMobile.label}
              isRequired={gpConfig && gpConfig.bearer_mobile && gpConfig.bearer_mobile === 'Required'}
              onKeyPress={usMobile}
              formGroupClassName="m-1"
              inputProps={{ maxLength: 15 }}
            />
          )}
          {type && type === 'Returnable' && (
            <>
              <MuiDateTimeField
                sx={{
                  marginTop: 'auto',
                  marginBottom: '15px',
                }}
                minDateTime={editId ? dayjs(moment.utc(requested_on).local().tz(userInfo?.data?.timezone).format('YYYY-MM-DD HH:mm:ss')) : dayjs(requested_on)}
                name={bearerToReturnOn.name}
                label={bearerToReturnOn.label}
                isRequired={type && type === 'Returnable'}
                formGroupClassName="m-1"
                setFieldValue={setFieldValue}
                setFieldTouched={setFieldTouched}
                placeholder={bearerToReturnOn.label}
                disablePastDate={!editId}
                disableCustom
                isErrorHandle
                errorField="date_valid"
              // value={dayjs(bearer_return_on)}
                value={to_be_returned_on ? dayjs(editId ? moment.utc(to_be_returned_on).local().tz(userInfo?.data?.timezone).format('YYYY-MM-DD HH:mm:ss') : to_be_returned_on) : null}
                localeText={{ todayButtonLabel: 'Now' }}
              />
              {editId && detailedData && detailedData.state === 'Returned' && (
              <MuiDateTimeField
                sx={{
                  marginTop: 'auto',
                  marginBottom: '10px',
                }}
                name={bearerReturnOn.name}
                label={bearerReturnOn.label}
                isRequired={type && type === 'Returnable'}
                formGroupClassName="m-1"
                minDateTime={editId ? dayjs(moment.utc(requested_on).local().tz(userInfo?.data?.timezone).format('YYYY-MM-DD HH:mm:ss')) : dayjs(requested_on)}
                setFieldValue={setFieldValue}
                setFieldTouched={setFieldTouched}
                placeholder={bearerReturnOn.label}
                disablePastDate={!editId}
                disableCustom
              // value={dayjs(bearer_return_on)}
                value={bearer_return_on ? dayjs(editId ? moment.utc(bearer_return_on).local().tz(userInfo?.data?.timezone).format('YYYY-MM-DD HH:mm:ss') : bearer_return_on) : null}
                localeText={{ todayButtonLabel: 'Now' }}
                isErrorHandle
                errorField="date_valid"
              />
              )}
            </>
          )}
          {gpConfig && gpConfig.vendor && gpConfig.vendor !== 'None' && (
          <>
            <MuiAutoComplete
              sx={{
                marginTop: 'auto',
                marginBottom: '20px',
              }}
              name={vendorId.name}
              label={vendorId.label}
              isRequired={gpConfig && gpConfig.vendor && gpConfig.vendor === 'Required'}
              formGroupClassName="m-1"
              oldValue={getOldData(vendor_id)}
              value={vendor_id && vendor_id.name ? vendor_id.name : getOldData(vendor_id)}
              apiError={(partnersInfo && partnersInfo.err) ? generateErrorMessage(partnersInfo) : false}
              open={customerOpen}
              size="small"
              onOpen={() => {
                setCustomerOpen(true);
                setCustomerKeyword('');
              }}
              onClose={() => {
                setCustomerOpen(false);
                setCustomerKeyword('');
              }}
              classes={{
                root: classes.root,
              }}
              loading={partnersInfo && partnersInfo.loading}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              renderOption={(props, option) => (
                <>
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
                            <span className="">{option.mobile}</span>
                          </Typography>
                        </Box>
                        )}
                      </>
                )}
                  />
                  <Divider />
                </>
              )}
              options={customerOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={onCustomerKeywordChange}
                  variant="standard"
                  label={`${vendorId.label}`}
                  required={gpConfig && gpConfig.vendor && gpConfig.vendor === 'Required' ? '*' : ''}
                // value={customerKeyword}
                  placeholder="Search & Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {partnersInfo && partnersInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        <InputAdornment position="end">
                          {((vendor_id && vendor_id.id) || (customerKeyword && customerKeyword.length > 0) || (vendor_id && vendor_id.length)) && (
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={onCustomerKeywordClear}
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
            {(noData && isCreatable && (noData.status_code && noData.status_code === 404) && (customerKeyword && customerKeyword.length > 3)
                && (createTenantinfo && !createTenantinfo.err) && (createTenantinfo && !createTenantinfo.data)) && (
                <FormHelperText>
                  <span>{`New Vendor "${customerKeyword}" will be created. Do you want to create..? Click`}</span>
                  <span aria-hidden="true" onClick={() => setAddCustomerModal(true)} className="text-info ml-2 cursor-pointer">YES</span>
                </FormHelperText>
            )}
          </>
          )}
        </Box>
      </Box>

      <Box
        sx={{
          width: '100%',
          display: 'flex',
          gap: '3%',
        }}
      >
        {gpConfig && (gpConfig.show_items && gpConfig.show_assets) && (
        <Box
          sx={{
            width: ' 50%',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <MuiAutoComplete
            sx={{
              marginTop: 'auto',
              marginBottom: '25px',
            }}
            name={gatePassType.name}
            label={gatePassType.label}
            open={typeOpen}
            formGroupClassName="m-1"
            isRequired
            size="small"
            onOpen={() => {
              setTypeOpen(true);
            }}
            onClose={() => {
              setTypeOpen(false);
            }}
            oldValue={gatepass_type}
            value={gatepass_type && gatepass_type.value ? gatepass_type.value : gatepass_type}
            getOptionSelected={(option, value) => (value.length > 0 ? option.label === value.label : '')}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
            options={types}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label={`${gatePassType.label}`}
                required
                placeholder="Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      <InputAdornment position="end">
                        {((gatepass_type && gatepass_type.value) || (gatepass_type)) && (
                        <IconButton onClick={onGatePassTypeClear}>
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
        </Box>
        )}
      </Box>

      <Dialog size="xl" fullWidth open={addCustomerModal}>
        <DialogHeader title="Add Vendor" imagePath={false} onClose={() => { setAddCustomerModal(false); }} response={createTenantinfo} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <AddCustomer
              afterReset={() => { setAddCustomerModal(false); }}
              setFieldValue={setFieldValue}
              requestorName={customerKeyword}
              updateField="vendor_id"
              type="vendor"
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Dialog maxWidth="md" open={extraModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraModal(false); }} sx={{ width: '800px' }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <AdvancedSearchModal
              modelName={modelValue}
              afterReset={() => { setExtraModal(false); }}
              fieldName={fieldName}
              fields={columns}
              company={companyValue}
              setFieldValue={setFieldValue}
              placeholderName={placeholderName}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Dialog maxWidth="md" open={extraMultipleModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraMultipleModal(false); }} sx={{ width: '800px' }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <SearchModalMultiple
              modelName={modelValue}
              afterReset={() => { setExtraMultipleModal(false); }}
              fieldName={fieldName}
              fields={columns}
              company={companyValue}
              modalName={modalName}
              otherFieldName={otherFieldName}
              otherFieldValue={otherFieldValue}
              setFieldValue={setFieldValue}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
};

BasicForm.propTypes = {
  formField: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  editId: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]).isRequired,
  setFieldTouched: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default BasicForm;
