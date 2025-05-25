/* eslint-disable no-underscore-dangle */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/heading-has-content */
/* eslint-disable consistent-return */
/* eslint-disable camelcase */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import {
  CircularProgress,
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import {
  Dialog, DialogContent, DialogContentText,
  FormControl,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import ErrorContent from '@shared/errorContent';
import { Cascader, Divider } from 'antd';
import { useFormikContext } from 'formik';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import {
  Spinner,
} from 'reactstrap';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';

import {
  getAllSpaces,
  getBuildings,
} from '../../assets/equipmentService';
import DialogHeader from '../../commonComponents/dialogHeader';
import MuiAutoComplete from '../../commonComponents/formFields/muiAutocomplete';
import MuiFormLabel from '../../commonComponents/formFields/muiFormLabel';
import { last } from '../../util/staticFunctions';
import {
  getCascader,
} from '../../helpdesk/ticketService';
import { addChildrens, addParents } from '../../helpdesk/utils/utils';
import {
  getProductCompany, getSpaceList,
  getPPMSettingsDetails,
} from '../../siteOnboarding/siteService';
import { AddThemeColor } from '../../themes/theme';
import { getParentSchdules, getAssetPPMSchdules, getInspectionCommenceDate } from '../../inspectionSchedule/inspectionService';
import {
  extractOptionsObject,
  extractOptionsObjectWithName,
  generateErrorMessage,
  getAllCompanies,
  preprocessData,
  getDateTimeUtcMuI,
} from '../../util/appUtils';
import {
  getEquipmentList,
  getRaisedList,
} from '../breakdownService';
import customData from '../data/customData.json';
import AdvancedSearchModal from './advancedSearchModal';

dayjs.extend(isoWeek);

const appModels = require('../../util/appModels').default;

const useStyles = makeStyles((themeStyle) => ({
  margin: {
    marginBottom: themeStyle.spacing(1.25),
    width: '100%',
  },
  option: {
    padding: 5,
    margin: 5,
    display: 'flow-root',
    '& > span': {
      marginRight: 10,
    },
  },
}));

const TrackerRequestorForm = React.memo((props) => {
  const {
    editId,
    setFieldValue,
    setFieldTouched,
    reloadData,
    addModal,
    values,
    formField: {
      raisedBy,
      raisedOn,
      companyId,
      spaceId,
      types,
      equipmentId,
      amcStatus,
      title,
      descriptionOfBreakdown,
      remark,
    },
  } = props;
  const classes = useStyles();
  const { values: formValues } = useFormikContext();
  const {
    raised_by_id, company_id, raised_on, type, space_id, equipment_id, amc_status,
    expexted_closure_date, incident_date,
  } = formValues;
  const dispatch = useDispatch();

  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [columns, setColumns] = useState(['id', 'name', 'title']);
  const [extraModal, setExtraModal] = useState(false);
  const [extraMultipleModal, setExtraMultipleModal] = useState(false);

  const [companyOpen, setCompanyOpen] = useState(false);
  const [companyKeyword, setCompanyKeyword] = useState('');

  const [raisedOpen, setRaisedOpen] = useState(false);
  const [raisedKeyword, setRaisedKeyword] = useState('');

  const [spaceOpen, setSpaceOpen] = useState(false);
  const [spaceKeyword, setSpaceKeyword] = useState('');

  const [equipmentOpen, setEquipmentOpen] = useState(false);
  const [equipmentKeyword, setEquipmentKeyword] = useState('');

  const [typeOpen, setTypeOpen] = useState(false);
  const [amcOpen, setAmcOpen] = useState(false);

  const [parentId, setParentId] = useState('');
  const [spaceIds, setSpaceIds] = useState(false);
  const [spaceCategoryId, setSpaceCategoryId] = useState('');

  const [initialLoad, setInitialLoad] = useState(false);

  const [cascaderValues, setCascaderValues] = useState([]);
  const [childLoad, setChildLoad] = useState(false);
  const [refresh, setRefresh] = useState(reloadData);
  const [childValues, setChildValues] = useState([]);
  const { userInfo } = useSelector((state) => state.user);
  const [selectedDate, setDateChange] = useState(null);

  const {
    raisedInfoList, equInfoList, btConfigInfo,
  } = useSelector((state) => state.breakdowntracker);
  const {
    buildingsInfo, buildingSpaces,
  } = useSelector((state) => state.equipment);
  const {
    productCompanyInfo, spaceInfo,
  } = useSelector((state) => state.site);
  const {
    spaceCascader,
  } = useSelector((state) => state.ticket);

  const configData = btConfigInfo && btConfigInfo.data && btConfigInfo.data.length ? btConfigInfo.data[0] : false;

  const companies = getAllCompanies(userInfo);

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

  useEffect(() => {
    setRefresh(refresh);
  }, [refresh]);

  useEffect(() => {
    setInitialLoad(false);
  }, [addModal]);

  useEffect(() => {
    if (type === 'Space') {
      setFieldValue('equipment_id', '');
    } else {
      setFieldValue('space_id', '');
    }
  }, [type]);

  useEffect(() => {
    if (userInfo && userInfo.data && !editId && !raised_by_id && !initialLoad) {
      // eslint-disable-next-line no-nested-ternary
      const companyIdValue = userInfo.data.company ? userInfo.data.company : '';
      const userId = { id: userInfo.data.id, name: userInfo.data.name };
      setFieldValue('company_id', companyIdValue);
      setFieldValue('raised_by_id', userId);
      setInitialLoad(false);
    }
  }, [editId, raised_by_id, initialLoad]);

  const resetEquipment = () => {
    if (editId) {
      setFieldValue('equipment_id', '');
    }
  };

  const resetSpaceCheck = () => {
    setFieldValue('space_id', '');
  };

  const handleDateChange = (date) => {
    setDateChange(date);
    setFieldValue('raised_on', date);
  };

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
  }, [buildingSpaces, parentId]);

  useEffect(() => {
    if (childValues) {
      setCascaderValues(childValues);
    }
  }, [childValues]);

  useEffect(() => {
    if (cascaderValues && (refresh === '1' || childLoad)) {
      dispatch(getCascader(cascaderValues));
    }
  }, [cascaderValues, buildingSpaces, childLoad]);

  useEffect(() => {
    if ((company_id && company_id.id) || (company_id && company_id.length > 0)) {
      dispatch(getBuildings(companies, appModels.SPACE));
    }
  }, [company_id]);

  useEffect(() => {
    if (!editId && configData && (configData.is_cancel_inspection || configData.is_cancel_inspection_space) && userInfo && userInfo.data && userInfo.data.company && userInfo.data.company.id) {
      dispatch(getInspectionCommenceDate(userInfo.data.company.id, appModels.INSPECTIONCONFIG));
    }
    if (!editId && configData && (configData.is_cancel_ppm || configData.is_cancel_ppm_space) && userInfo && userInfo.data && userInfo.data.company && userInfo.data.company.id) {
      dispatch(getPPMSettingsDetails(userInfo.data.company.id, appModels.PPMWEEKCONFIG));
    }
  }, []);

  function getDateTimeUtcMuICheck(input) {
    let local = false;
    if (input && input.$d) {
      local = input.$d;
    } else if (input && input._d) {
      local = input._d;
    } else if (input) {
      local = input;
    }
    return local;
  }

  useEffect(() => {
    if (!editId && configData && type && ((configData.is_cancel_inspection && equipment_id && equipment_id.id) || (configData.is_cancel_inspection_space && last(space_id)))) {
      const startDate = getDateTimeUtcMuI(incident_date);
      const endDate = getDateTimeUtcMuI(expexted_closure_date);
      dispatch(getParentSchdules(companies, appModels.INSPECTIONCHECKLIST, type, (equipment_id && equipment_id.id) || last(space_id), false, false, false, startDate, endDate));
    }
  }, [type, equipment_id, space_id]);

  useEffect(() => {
    if (!editId && expexted_closure_date && incident_date && configData && type && ((configData.is_cancel_ppm && equipment_id && equipment_id.id) || (configData.is_cancel_ppm_space && last(space_id)))) {
      const startWeek = dayjs(getDateTimeUtcMuICheck(incident_date)).startOf('isoWeek').format('YYYY-MM-DD');
      const endWeek = dayjs(getDateTimeUtcMuICheck(expexted_closure_date)).startOf('isoWeek').format('YYYY-MM-DD');
      dispatch(getAssetPPMSchdules(companies, 'ppm.scheduler_week', type, (equipment_id && equipment_id.id) || last(space_id), false, startWeek, endWeek));
    }
  }, [type, equipment_id, space_id, expexted_closure_date, incident_date]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && companyOpen) {
        await dispatch(getProductCompany(companies, appModels.COMPANY, companyKeyword));
      }
    })();
  }, [companyOpen, companyKeyword]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && raisedOpen) {
        await dispatch(getRaisedList(companies, appModels.USER, raisedKeyword));
      }
    })();
  }, [raisedOpen, raisedKeyword]);

  useEffect(() => {
    if (equipment_id && equipment_id.amc_end_date && equipment_id.amc_end_date !== '') {
      const d = moment.utc(equipment_id.amc_end_date).local().format();
      const dateAmcEndDate = new Date(d);
      const today = new Date();
      let amcStatusValue = '';
      if (today < dateAmcEndDate) {
        amcStatusValue = 'Valid';
      } else if (today > dateAmcEndDate) {
        amcStatusValue = 'Expired';
      }
      setFieldValue('amc_status', amcStatusValue);
    } else {
      let amcStatusValue = '';
      if ((equipment_id && (!equipment_id.amc_end_date || equipment_id.amc_end_date !== '')) || (equipment_id && (!equipment_id.amc_start_date || equipment_id.amc_start_date !== ''))) {
        amcStatusValue = 'Not Available';
      }
      setFieldValue('amc_status', amcStatusValue);
    }
  }, [equipment_id]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && spaceOpen) {
        await dispatch(getSpaceList(companies, appModels.SPACE, spaceKeyword));
      }
    })();
  }, [spaceOpen, spaceKeyword]);

  /* useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && spaceOpen) {
        await dispatch(getBuildings(companies, appModels.SPACE, spaceKeyword));
      }
    })();
  }, [spaceOpen, spaceKeyword]); */

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && equipmentOpen) {
        await dispatch(getEquipmentList(companies, appModels.EQUIPMENT, equipmentKeyword));
      }
    })();
  }, [equipmentOpen, equipmentKeyword]);

  useEffect(() => {
    if (!editId && !raised_on) {
      setFieldValue('raised_on', new Date());
    }
  }, [editId, raised_on]);

  const onCompanyKeyWordChange = (event) => {
    setCompanyKeyword(event.target.value);
  };

  const onRaisedKeyWordChange = (event) => {
    setRaisedKeyword(event.target.value);
  };

  const onSpaceKeyWordChange = (event) => {
    setSpaceKeyword(event.target.value);
  };

  const onEquipmentKeyWordChange = (event) => {
    setEquipmentKeyword(event.target.value);
  };

  const onKeywordCompanyClear = () => {
    setCompanyKeyword(null);
    setFieldValue('company_id', '');
    setCompanyOpen(false);
  };

  const onKeywordClear = () => {
    setRaisedKeyword(null);
    if (!editId) {
      setInitialLoad(true);
    }
    setFieldValue('raised_by_id', '');
    setRaisedOpen(false);
  };

  const onSpaceClear = () => {
    setSpaceKeyword(null);
    setFieldValue('space_id', '');
    setSpaceOpen(false);
  };

  const onEquipmentClear = () => {
    setEquipmentKeyword(null);
    setFieldValue('equipment_id', '');
    setEquipmentOpen(false);
  };

  const showCompanyModal = () => {
    setModelValue(appModels.COMPANY);
    setFieldName('company_id');
    setModalName('Company List');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue('');
    setColumns(['id', 'name']);
    setExtraModal(true);
  };

  const showRaisedRequestorModal = () => {
    setModelValue(appModels.USER);
    setFieldName('raised_by_id');
    setModalName('Raised List');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setColumns(['id', 'name']);
    setExtraModal(true);
  };

  const showSpaceModal = () => {
    setModelValue(appModels.SPACE);
    setFieldName('space_id');
    setModalName('Space List');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setColumns(['id', 'path_name']);
    setExtraModal(true);
  };

  const showEquipmentModal = () => {
    setModelValue(appModels.EQUIPMENT);
    setFieldName('equipment_id');
    setModalName('Equipment List');
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setColumns(['id', 'name', 'amc_start_date', 'amc_end_date', 'location_id', 'equipment_seq', 'category_id']);
    setExtraModal(true);
  };

  const companyOptions = extractOptionsObject(productCompanyInfo, company_id);
  const raisedOptions = extractOptionsObject(raisedInfoList, raised_by_id);
  const spaceOptions = extractOptionsObjectWithName(spaceInfo, space_id, 'path_name');
  const equipmentOptions = extractOptionsObjectWithName(equInfoList, equipment_id, 'name');

  function getTypeLabel(data) {
    if (customData && customData.typeTextForm[data]) {
      const s = customData.typeTextForm[data].label;
      return s;
    }
    return '';
  }

  function getAmcLabel(data) {
    if (customData && customData.amcTextForm[data]) {
      const s = customData.amcTextForm[data].label;
      return s;
    }
    return '';
  }

  const isUserError = userInfo && userInfo.err;
  const loading = (userInfo && userInfo.loading) || (buildingsInfo && buildingsInfo.loading) || (buildingSpaces && buildingSpaces.loading);
  const userErrorMsg = generateErrorMessage(userInfo);
  const errorMsg = (buildingsInfo && buildingsInfo.err) ? generateErrorMessage(buildingsInfo) : userErrorMsg;
  const errorMsg1 = (buildingSpaces && buildingSpaces.err) ? generateErrorMessage(buildingSpaces) : userErrorMsg;

  const loadData = () => { };

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

  const onChange = (value, selectedOptions) => {
    setParentId('');
    if (selectedOptions && selectedOptions.length) {
      if (!selectedOptions[0].parent_id) {
        setParentId(selectedOptions[0].id);
        setSpaceIds(selectedOptions[0].id);
        if (spaceIds !== selectedOptions[0].id) {
          dispatch(getAllSpaces(selectedOptions[0].id, companies));
        }
      }
    }
    setFieldValue('space_id', value);
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
          })}
        >
          Requestor Information
        </Typography>
        <Box
          sx={{
            width: '100%',
            alignItems: 'center',
            gap: '3%',
            flexWrap: 'wrap',
          }}
        >
          <MuiAutoComplete
            sx={{
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            name={raisedBy.name}
            label={raisedBy.label}
            oldValue={getOldData(raised_by_id)}
            value={raised_by_id && raised_by_id.name ? raised_by_id.name : getOldData(raised_by_id)}
            open={raisedOpen}
            onOpen={() => {
              setRaisedOpen(true);
              setRaisedKeyword('');
            }}
            onClose={() => {
              setRaisedOpen(false);
              setRaisedKeyword('');
            }}
            loading={raisedInfoList && raisedInfoList.loading}
            getOptionSelected={(option, value) => (value.length > 0 ? option.name === value.name : '')}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={raisedOptions}
            apiError={(raisedInfoList && raisedInfoList.err) ? generateErrorMessage(raisedInfoList) : false}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={(e) => { onRaisedKeyWordChange(e.target.value); }}
                variant="standard"
                label={raisedBy.label}
                // className={((getOldData(raised_by_id)) || (raised_by_id && raised_by_id.id) || (raisedKeyword && raisedKeyword.length > 0))
                //   ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                // placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {raisedInfoList && raisedInfoList.loading ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {((raised_by_id && raised_by_id.id) || (raisedKeyword && raisedKeyword.length > 0) || (raised_by_id && raised_by_id.length)) && (
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={onKeywordClear}
                          >
                            <IoCloseOutline size={22} fontSize="small" />
                          </IconButton>
                        )}
                        <IconButton aria-label="toggle search visibility" onClick={showRaisedRequestorModal}>
                          <SearchIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    </>
                  ),
                }}
              />
            )}
          />
          {/* <FormControl
            sx={{
              marginTop: "auto",
              marginBottom: "20px",
            }}
            variant="standard"
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DateTimePicker']}>
                <DateTimePicker
                  sx={{ width: '95%' }}
                  slotProps={{ textField: { variant: 'standard' } }}
                  name={raisedOn.name}
                  label={raisedOn.label}
                  value={selectedDate}
                  onChange={handleDateChange}
                  ampm={false}
                  disablePast
                />
              </DemoContainer>
            </LocalizationProvider>
          </FormControl> */}
          {/* <FormControl
            sx={{
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            variant="standard"
          >
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DateTimePicker
                name={raisedOn.name}
                label={raisedOn.label}
                value={selectedDate}
                onChange={handleDateChange}
                maxDate={moment(new Date(), 'dd/MM/yyyy HH:mm:ss')}
                defaultValue={raised_on ? new Date(getDateTimeSeconds(raised_on)) : null}
                ampm={false}
                format="dd/MM/yyyy HH:mm:ss"
              />
            </MuiPickersUtilsProvider>
          </FormControl> */}
        </Box>
        <Typography
          sx={AddThemeColor({
            font: 'normal normal medium 20px/24px Suisse Intl',
            letterSpacing: '0.7px',
            fontWeight: 500,
          })}
        >
          Asset Information
        </Typography>
        <Box
          sx={{
            width: '100%',
            alignItems: 'center',
            gap: '3%',
            flexWrap: 'wrap',
          }}
        >
          <MuiAutoComplete
            sx={{
              marginTop: 'auto',
              marginBottom: '20px',
            }}
            name={companyId.name}
            label={companyId.label}
            oldValue={getOldData(company_id)}
            value={company_id && company_id.name ? company_id.name : getOldData(company_id)}
            apiError={(productCompanyInfo && productCompanyInfo.err) ? generateErrorMessage(productCompanyInfo) : false}
            open={companyOpen}
            size="small"
            onOpen={() => {
              setCompanyOpen(true);
              setCompanyKeyword('');
            }}
            onClose={() => {
              setCompanyOpen(false);
              setCompanyKeyword('');
            }}
            loading={companyOpen && productCompanyInfo && productCompanyInfo.loading}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={companyOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={(e) => { onCompanyKeyWordChange(e.target.value); }}
                variant="standard"
                label={companyId.label}
                className={((getOldData(company_id)) || (company_id && company_id.id) || (companyKeyword && companyKeyword.length > 0))
                  ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {productCompanyInfo && productCompanyInfo.loading && companyOpen ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {((company_id && company_id.id) || (companyKeyword && companyKeyword.length > 0) || (company_id && company_id.length)) && (
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={onKeywordCompanyClear}
                          >
                            <IoCloseOutline size={22} fontSize="small" />
                          </IconButton>
                        )}
                        <IconButton
                          aria-label="toggle search visibility"
                          onClick={showCompanyModal}
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
          <Box>
            <Typography
              sx={{
                font: 'normal normal normal 14px Suisse Intl',
                letterSpacing: '0.63px',
                color: '#000000',
              }}
            >
              Type
              <span className="text-danger ml-2px">*</span>
            </Typography>
            <RadioGroup
              row
              aria-labelledby="demo-form-control-label-placement"
              name="position"
              defaultValue="top"
            >
              <MuiFormLabel
                name={types.name}
                checkedvalue="Space"
                id="Space"
                onClick={() => resetSpaceCheck()}
                label={types.label}
              />
              <MuiFormLabel
                name={types.name}
                checkedvalue="Equipment"
                id="Equipment"
                onClick={() => resetEquipment()}
                label={types.label1}
              />
            </RadioGroup>
          </Box>
          {type === 'Space' && editId ? (
            <MuiAutoComplete
              sx={{
                marginTop: 'auto',
                marginBottom: '20px',
              }}
              name={spaceId.name}
              label={spaceId.label}
              open={spaceOpen}
              isRequired
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
              loading={spaceInfo && spaceInfo.loading}
              getOptionSelected={(option, value) => (value ? option.path_name === value.path_name : '')}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.path_name)}
              options={spaceOptions}
              apiError={(spaceInfo && spaceInfo.err) ? generateErrorMessage(spaceInfo) : false}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={onSpaceKeyWordChange}
                  variant="standard"
                  value={spaceKeyword}
                  label={spaceId.label}
                  className={((getOldData(space_id)) || (space_id && space_id.id) || (spaceKeyword && spaceKeyword.length > 0))
                    ? 'input-small-custom without-padding custom-icons' : 'input-small-custom without-padding custom-icons2'}
                  placeholder="Search & Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {spaceInfo && spaceInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        <InputAdornment position="end">
                          {((space_id && space_id.id) || (spaceKeyword && spaceKeyword.length > 0)) && (
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={onSpaceClear}
                            >
                              <IoCloseOutline size={22} fontSize="small" />
                            </IconButton>
                          )}
                          <IconButton onClick={showSpaceModal}>
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

          {type === 'Space' && !editId
            && (
              <FormControl
                sx={{
                  marginTop: 'auto',
                  marginBottom: '20px',
                  width: '100%',
                }}
                variant="standard"
              >
                <span className="pb-1">
                  {spaceId.label}
                  <span className="text-danger ml-2px">*</span>
                </span>
                <br />
                <Cascader
                  options={preprocessData(spaceCascader && spaceCascader.length > 0 ? spaceCascader : [])}
                  dropdownClassName="custom-cascader-popup"
                  value={spaceCascader && spaceCascader.length > 0 ? space_id : []}
                  fieldNames={{ label: 'name', value: 'id', children: 'children' }}
                  onChange={onChange}
                  placeholder="Select Space"
                  dropdownRender={dropdownRender}
                  notFoundContent="No options"
                  className="thin-scrollbar bg-white mb-1 w-100"
                  // loadData={loadData}
                  changeOnSelect
                />
              </FormControl>
            )}
          {type === 'Equipment' ? (
            <>
              <MuiAutoComplete
                sx={{
                  marginTop: 'auto',
                  marginBottom: '20px',
                }}
                name={equipmentId.name}
                label={equipmentId.label}
                oldValue={getOldData(equipment_id)}
                value={equipment_id && equipment_id.name ? equipment_id.name : getOldData(equipment_id)}
                apiError={(equInfoList && equInfoList.err) ? generateErrorMessage(equInfoList) : false}
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
                loading={equipmentOpen && equInfoList && equInfoList.loading}
                getOptionSelected={(option, value) => option.name === value.name}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                options={equipmentOptions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    onChange={onEquipmentKeyWordChange}
                    variant="standard"
                    label={equipmentId.label}
                    value={equipmentKeyword}
                    required
                    placeholder="Search & Select"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {equInfoList && equInfoList.loading && equipmentOpen ? <CircularProgress color="inherit" size={20} /> : null}
                          <InputAdornment position="end">
                            {((equipment_id && equipment_id.id) || (equipment_id && equipmentKeyword.length > 0) || (equipment_id && equipment_id.length)) && (
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={onEquipmentClear}
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
              <MuiAutoComplete
                sx={{
                  marginTop: 'auto',
                  marginBottom: '20px',
                }}
                name={amcStatus.name}
                label={amcStatus.label}
                open={amcOpen}
                disableClearable
                oldValue={getAmcLabel(amc_status)}
                value={amc_status && amc_status.label ? amc_status.label : getAmcLabel(amc_status)}
                size="small"
                onOpen={() => {
                  setAmcOpen(true);
                }}
                onClose={() => {
                  setAmcOpen(false);
                }}
                getOptionSelected={(option, value) => option.label === value.label}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                options={customData.amcStatus}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    label={amcStatus.label}
                    required
                    // className="input-small-custom without-padding"
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
            </>
          )
            : ''}
          {/* <Box
            sx={{
              width: '50%',
            }}
          >
            {!editId
              ?
              <UploadDocuments
                saveData={addTrackerInfo}
                limit='3'
                model={appModels.BREAKDOWNTRACKER}
                uploadFileType='images'
              />
              : ''}

          </Box> */}
          <Dialog maxWidth="lg" open={extraModal}>
            <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraModal(false); }} sx={{ width: '1200px' }} />
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
        </Box>
      </Box>
    </>
  );
});

TrackerRequestorForm.defaultProps = {
  addModal: false,
};

TrackerRequestorForm.propTypes = {
  editId: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  reloadData: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  formField: PropTypes.objectOf([PropTypes.object, PropTypes.string]).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  setFieldTouched: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  addModal: PropTypes.bool,
};

export default TrackerRequestorForm;
