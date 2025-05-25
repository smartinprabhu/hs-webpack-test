/* eslint-disable consistent-return */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
/* eslint-disable radix */
import { CircularProgress } from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';
import moment from 'moment-timezone';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  FormFeedback
  ,
} from 'reactstrap';
import { Dialog, DialogContent, DialogContentText } from '@mui/material'
import {
  Autocomplete,
  Box,
  Drawer,
  FormGroup,
  IconButton,
  TextField,
} from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { getEquipmentListReport, getSpaceAllSearchList } from '../../../../helpdesk/ticketService';
import {
  generateErrorMessage,
  getAllCompanies,
  getArrayFromValuesById, getColumnArrayById, isArrayColumnExists,
} from '../../../../util/appUtils';
import {
  getAssetMisplaced, resetAssetMisplaced, misplacedReportFilters
} from '../../../equipmentService';
import SearchModalSingle from './searchModalSingle';
import ReportsFilterDrawer from '../../../../commonComponents/reportsFilterDrawer';
import DialogHeader from '../../../../commonComponents/dialogHeader';

const appModels = require('../../../../util/appModels').default;

const SideFilterChecklist = ({ filterOpen, setFilterOpen, resetFilters, setResetFilters }) => {
  const dispatch = useDispatch();
  const [statusCollapse, setStatusCollapse] = useState(true);
  const [date, changeDate] = useState(null);

  const [spaceCollapse, setSpaceCollapse] = useState(true);
  const [spaceOpen, setSpaceOpen] = useState(false);
  const [spaceKeyword, setSpaceKeyword] = useState('');

  const [equipmentCollapse, setEquipmentCollapse] = useState(true);
  const [equipmentOpen, setEquipmentOpen] = useState(false);
  const [equipmentKeyword, setEquipmentKeyword] = useState('');

  const [spaceOptions, setSpaceOptions] = useState([]);
  const [equipmentOptions, setEquipmentOptions] = useState([]);

  const [spaceValue, setSpaceValue] = useState('');
  const [equipValue, setEquipValue] = useState('');

  const [extraMultipleModal, setExtraMultipleModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [columns, setColumns] = useState([]);
  const [defaultSpace, setDefaultSpace] = useState([]);
  const [customFilters, setCustomFilters] = useState([]);

  const { spaceInfoList, equipmentInfoReport } = useSelector((state) => state.ticket);
  const { misplacedFiltersInfo } = useSelector((state) => state.equipment);

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const companies = getAllCompanies(userInfo, userRoles);

  function isAssociativeArray(arr) {
    let result = arr;
    if (isArrayColumnExists(arr, 'id')) {
      result = getColumnArrayById(arr, 'id');
    }
    return result;
  }

  useEffect(() => {
    setSpaceValue([]);
    setEquipValue([]);
    changeDate(null);
    setResetFilters(false)
    dispatch(resetAssetMisplaced());
    dispatch(misplacedReportFilters([]))
  }, [])

  useEffect(() => {
    if (spaceInfoList && spaceInfoList.data && spaceInfoList.data.length && spaceOpen) {
      setSpaceOptions(getArrayFromValuesById(spaceInfoList.data, isAssociativeArray(spaceValue || []), 'id'));
    } else if (spaceInfoList && spaceInfoList.loading) {
      setSpaceOptions([{ path_name: 'Loading...' }]);
    } else {
      setSpaceOptions([]);
    }
  }, [spaceInfoList, spaceOpen]);

  useEffect(() => {
    if (equipmentInfoReport && equipmentInfoReport.data && equipmentInfoReport.data.length && equipmentOpen) {
      setEquipmentOptions(getArrayFromValuesById(equipmentInfoReport.data, isAssociativeArray(equipValue || []), 'id'));
    } else if (equipmentInfoReport && equipmentInfoReport.loading) {
      setEquipmentOptions([{ name: 'Loading...' }]);
    } else {
      setEquipmentOptions([]);
    }
  }, [equipmentInfoReport, equipmentOpen]);

  useEffect(() => {
    if (userInfo && userInfo.data && spaceOpen) {
      const keywordTrim = spaceKeyword ? encodeURIComponent(spaceKeyword.trim()) : '';
      dispatch(getSpaceAllSearchList(companies, appModels.SPACE, keywordTrim));
    }
  }, [userInfo, spaceKeyword, spaceOpen]);

  useEffect(() => {
    setDefaultSpace(spaceValue && spaceValue.path_name);
  }, [spaceValue]);

  useEffect(() => {
    if (userInfo.data && equipmentOpen) {
      const keywordTrim = equipmentKeyword ? encodeURIComponent(equipmentKeyword.trim()) : '';
      dispatch(getEquipmentListReport(companies, appModels.EQUIPMENT, keywordTrim, defaultSpace));
    }
  }, [userInfo, equipmentKeyword, equipmentOpen, spaceValue]);

  useEffect(() => {
    if (userInfo && userInfo.data && userInfo.data.company && date === undefined) {
      if (userInfo.data.timezone) {
        const timeZoneDate = moment().tz(userInfo.data.timezone).format('YYYY-MM-DD HH:mm:ss');
        const todayDate = (new Date(timeZoneDate));
        changeDate(todayDate);
      }
    }
  }, [userInfo, date]);

  const getFindData = (field) => {
    const result = customFilters && customFilters.length && customFilters.find((cFilter) => cFilter.title === field)
    return result ? result : ''
  }
  const getFindDateRange = (field) => {
    const result = customFilters && customFilters.length && customFilters.find((cFilter) => cFilter.key === field)
    return result ? result.value : null
  }

  useEffect(() => {
    if ((userInfo && userInfo.data && userInfo.data.company)) {
      const assetId = equipValue.id;
      const spaceId = spaceValue.id;
      console.log(getFindDateRange('date'));
      console.log(date);
      const companyTimezoneDate = moment(getFindDateRange('date')).format('YYYY-MM-DD');
      if (getFindDateRange('date')) {
        dispatch(getAssetMisplaced(companyTimezoneDate, assetId, spaceId));
      }
    }
  }, [misplacedFiltersInfo]);

  useEffect(() => {
    if (misplacedFiltersInfo && misplacedFiltersInfo.customFilters) {
      setCustomFilters(misplacedFiltersInfo.customFilters);
    }
  }, [misplacedFiltersInfo]);

  const onDateRangeChange = (dates) => {
    changeDate(dates);
    if (dates !== null) {
      const customFiltersOthers = customFilters && customFilters.length && customFilters.filter((item) => item.key !== 'date');
      const filters = [{
        key: 'date', value: dates, label: 'By Date', type: 'customdate', id: 'date', name: 'date', title: 'By Date'
      }];
      const customFiltersList = [...customFiltersOthers ? customFiltersOthers : [], ...filters];
      setCustomFilters(customFiltersList)
    } else {
      const customFiltersList = customFilters && customFilters.filter((item) => item.title !== 'By Date');
      setCustomFilters(customFiltersList)
    }
  };

  const onEquipmentChange = (data) => {
    if (data && data.length && data.find((option) => option.name === 'Loading...')) {
      return false;
    }
    setEquipValue(data);
    if (data.name) {
      const filters = [{
        key: 'equipment_id', value: data.name, label: 'By Asset', type: 'text', id: data.id, name: data.name, title: 'By Asset'
      }];
      const customFiltersOthers = customFilters && customFilters.length && customFilters.filter((item) => item.key !== 'equipment_id');
      const customFiltersList = [...customFiltersOthers ? customFiltersOthers : [], ...filters];
      setCustomFilters(customFiltersList)
    }
  };

  const onSpaceChange = (data) => {
    if (data && data.length && data.find((option) => option.path_name === 'Loading...')) {
      return false;
    }
    setSpaceValue(data);
    dispatch(resetAssetMisplaced());
    if (data.path_name) {
      const filters = [{
        key: 'space_id', value: data.path_name, label: 'By Location', type: 'text', id: data.id, name: data.name, title: 'By Location', path_name: data.path_name || data.name
      }];
      const customFiltersOthers = customFilters && customFilters.length && customFilters.filter((item) => item.key !== 'space_id');
      const customFiltersList = [...customFiltersOthers ? customFiltersOthers : [], ...filters];
      setCustomFilters(customFiltersList)
    }
  };

  const onSpaceClear = () => {
    setSpaceKeyword('');
    setSpaceValue([]);
    setSpaceOpen(false);
    const customFiltersOthers = customFilters && customFilters.length && customFilters.filter((item) => item.key !== 'space_id');
    setCustomFilters(customFiltersOthers ? customFiltersOthers : [])
  };

  const onEquipClear = () => {
    setEquipmentKeyword('');
    setEquipValue([]);
    setEquipmentOpen(false);
    const customFiltersOthers = customFilters && customFilters.length && customFilters.filter((item) => item.key !== 'equipment_id');
    setCustomFilters(customFiltersOthers ? customFiltersOthers : [])
  };

  const showEquipmentModal = () => {
    setModelValue(appModels.EQUIPMENT);
    setFieldName('equipment_id');
    setModalName('Assets');
    setOtherFieldValue(false);
    setCompanyValue(companies);
    setExtraMultipleModal(true);
    setColumns(['id', 'name', 'location_id', 'category_id']);
  };

  const showSpaceModal = () => {
    setModelValue(appModels.SPACE);
    setFieldName('space_id');
    setModalName('Locations');
    setOtherFieldValue(false);
    setCompanyValue(companies);
    setExtraMultipleModal(true);
    setColumns(['id', 'path_name', 'space_name', 'asset_category_id']);
  };

  useEffect(() => {
    if (resetFilters) {
      setSpaceValue([]);
      setEquipValue([]);
      changeDate(null);
      setResetFilters(false)
      dispatch(resetAssetMisplaced());
      dispatch(misplacedReportFilters([]))
    }
  }, [resetFilters])

  const onApplyFilters = () => {
    setFilterOpen(false)
    dispatch(resetAssetMisplaced());
    dispatch(misplacedReportFilters(customFilters))
  }

  const onCloseFilters = () => {
    setCustomFilters(misplacedFiltersInfo.customFilters)
    setFilterOpen(false)
  }

  const filtersComponentsArray = [
    {
      title: 'BY DATE',
      component:
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DatePicker']}>
            <DatePicker
              format="MM/DD/YYYY"
              value={getFindDateRange('date') ? getFindDateRange('date') : date}
              onChange={(newValue) => onDateRangeChange(newValue)}
              sx={{
                width: '400px'
              }}
              slotProps={{
                actionBar: {
                  actions: ['today', 'clear'],
                },
              }}
            />

          </DemoContainer>
        </LocalizationProvider>
    },
    {
      title: 'BY LOCATION',
      component:
        <FormGroup>
          <Autocomplete
            // multiple
            filterSelectedOptions
            limitTags={3}
            id="tags-filledspace"
            name="space"
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
            value={getFindData('By Location')}
            disableClearable={!(getFindData('By Location') && getFindData('By Location').id)}
            onChange={(e, options) => onSpaceChange(options)}
            getOptionSelected={(option, value) => option.name === value.path_name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.path_name)}
            options={spaceOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                value={spaceKeyword}
                className={(getFindData('By Location') && getFindData('By Location').id)
                  ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                placeholder="Search & Select"
                onChange={(e) => setSpaceKeyword(e.target.value)}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {spaceInfoList && spaceInfoList.loading ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {(getFindData('By Location') && getFindData('By Location').id) && (
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={onSpaceClear}
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
          {(date && date.length) && (spaceInfoList && spaceInfoList.err) && (
            <FormFeedback className="display-block">{generateErrorMessage(spaceInfoList)}</FormFeedback>
          )}
        </FormGroup>
    },
    {
      title: 'BY ASSET',
      component:
        <FormGroup>
          <Autocomplete
            // multiple
            filterSelectedOptions
            limitTags={3}
            id="tags-filled"
            size="small"
            name="equipment"
            disabled={!(spaceValue && spaceValue.id)}
            open={equipmentOpen}
            value={getFindData('By Asset')}
            onOpen={() => {
              setEquipmentOpen(true);
              setEquipmentKeyword('');
            }}
            onClose={() => {
              setEquipmentOpen(false);
              setEquipmentKeyword('');
            }}
            // disableClearable={!(equipValue.id)}
            onChange={(e, options) => onEquipmentChange(options)}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
            options={equipmentOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                value={equipmentKeyword}
                className={(getFindData('By Asset') && getFindData('By Asset').id)
                  ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                placeholder="Search & Select"
                onChange={(e) => setEquipmentKeyword(e.target.value)}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {equipmentInfoReport && equipmentInfoReport.loading ? <CircularProgress color="inherit" size={20} /> : null}
                      <InputAdornment position="end">
                        {(getFindData('By Asset') && getFindData('By Asset').id) && (
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={onEquipClear}
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
          {(date && date.length) && (equipmentInfoReport && equipmentInfoReport.err) && (
            <FormFeedback className="display-block">{generateErrorMessage(equipmentInfoReport)}</FormFeedback>
          )}
        </FormGroup>
    }
  ]
  return (
    <>
      {((date && date.length)) && (
        <div aria-hidden="true" className="float-right cursor-pointer mb-4 mr-2 text-info font-weight-800" onClick={handleResetClick} onKeyDown={handleResetClick}>Reset Filters</div>
      )}
      <Drawer anchor="right" open={filterOpen} PaperProps={{ sx: { width: "30%" } }} >
        <ReportsFilterDrawer
          filtersComponentsArray={filtersComponentsArray}
          onApplyFilters={onApplyFilters}
          onCloseFilters={onCloseFilters}
        />
      </Drawer>
      <Dialog size="lg" open={extraMultipleModal} fullWidth>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraMultipleModal(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Box
              sx={{
                width: "100%",
                height: "100%",
                backgroundColor: "#F6F8FA",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "10%",
                fontFamily: "Suisse Intl",
              }}
            >
              <SearchModalSingle
                modelName={modelValue}
                modalName={modalName}
                afterReset={() => { setExtraMultipleModal(false); }}
                fieldName={fieldName}
                fields={columns}
                company={companyValue}
                otherFieldValue={otherFieldValue}
                setEquipValue={(data) => onEquipmentChange(data)}
                setSpaceValue={(data) => onSpaceChange(data)}
                defaultSpace={defaultSpace}
              />
            </Box>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SideFilterChecklist;
