/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable consistent-return */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
/* eslint-disable radix */
import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import {
  FormGroup
  ,
} from 'reactstrap';
import { DatePicker } from 'antd';
import {
  TextField, CircularProgress,
} from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import 'react-calendar/dist/Calendar.css';
import { Autocomplete } from '@material-ui/lab';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';
import {
  Checkbox,
  Drawer,
  FormControlLabel,
  Dialog, DialogContent, DialogContentText
} from "@mui/material";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';

import {
  getBuildings, getGlobalCategories,
} from '../../../../assets/equipmentService';
import {
  getPPMReport, getSelectedReportDate, getTypeId, resetPPMReport,
} from '../../../ppmService';
import {
  getColumnArrayByIdType, arraySortByString, getAllowedCompanies, isArrayColumnExists, getDatesOfQueryReport, getArrayFromValuesById, getCompanyTimezoneDate, getDateAndTimeForDifferentTimeZones} from '../../../../util/appUtils';
import preventiveActions from '../../../data/preventiveActions.json';
import SearchModalMultiple from './searchModalMultiple';
import ReportsFilterDrawer from '../../../../commonComponents/reportsFilterDrawer';
import DialogHeader from '../../../../commonComponents/dialogHeader';

const appModels = require('../../../../util/appModels').default;

const { RangePicker } = DatePicker;

const sideFiltersSmartLogger = (props) => {
  const {
    apiReportName,
    filterOpen,
    setFilterOpen,
    resetFilters,
    setResetFilters,
    setShowResetOption } = props;
  const dispatch = useDispatch();
  const [customFilters, setCustomFilters] = useState({
    date: [null, null], locationId: [], categoryId: [], slot: '5',

  })
  const [statusCollapse, setStatusCollapse] = useState(true);
  const [slotCollapse, setSlotCollapse] = useState(true);
  const [spaceCollapse, setSpaceCollapse] = useState(true);
  const [spaceOpen, setSpaceOpen] = useState(false);
  const [spaceKeyword, setSpaceKeyword] = useState('');
  const [categoryCollapse, setCategoryCollapse] = useState(true);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categoryKeyword, setCategoryKeyword] = useState('');
  const [selectedDate, setSelectedDate] = useState('%(today)s');
  const [date, changeDate] = useState(customFilters.date);
  const [datesValue, setDatesValue] = useState([]);
  const [categoryId, setCategoryId] = useState(customFilters.categoryId);
  const [locationId, setLocationId] = useState(customFilters.locationId);
  const [slot, setSlot] = useState(customFilters.slot);
  const [slotSelect, showSlotSelect] = useState(false);

  const [extraModal, setExtraModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [columns, setColumns] = useState(['id', 'name', 'space_name', 'path_name']);
  const [spaceOptions, setSpaceOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [categoryData, setCategoryData] = useState([]);


  const { userInfo } = useSelector((state) => state.user);
  const {
    buildingsInfo, globalCategories,
  } = useSelector((state) => state.equipment);
  const companies = getAllowedCompanies(userInfo);

  function isAssociativeArray(arr) {
    let result = arr;
    if (isArrayColumnExists(arr, 'id')) {
      result = getColumnArrayByIdType(arr, 'id');
    }
    return result;
  }

  useEffect(() => {
    dispatch(resetPPMReport());
    showSlotSelect(false);
    dispatch(getTypeId({
      date, locationId: [], categoryId: [], slot,
    }));
  }, []);

  useEffect(() => {
    if (buildingsInfo && buildingsInfo.data && buildingsInfo.data.length && spaceOpen) {
      setSpaceOptions(getArrayFromValuesById(buildingsInfo.data, isAssociativeArray(locationId || []), 'id'));
    } else if (buildingsInfo && buildingsInfo.loading) {
      setSpaceOptions([{ path_name: 'Loading...' }]);
    } else {
      setSpaceOptions([]);
    }
  }, [buildingsInfo, spaceOpen]);

  const getCategories = (data) => {
    let categ_array = []
    if (data && data.length) {
      categ_array = data.map((categ) => ({
        id: categ,
        name: categ,
      }));
    }
    return categ_array
  }

  useEffect(() => {
    if (globalCategories && globalCategories.data && globalCategories.data.length && categoryOpen) {

      const equip_categ = getCategories(globalCategories.data[0].category)
      const space_categ = getCategories(globalCategories.data[0].space_category)

      setCategoryOptions(getArrayFromValuesById(arraySortByString([...space_categ, ...equip_categ], 'name'), isAssociativeArray(categoryId || []), 'id'));
    } else if (globalCategories && globalCategories.loading) {
      setCategoryOptions([{ name: 'Loading...' }]);
    } else {
      setCategoryOptions([]);
    }
  }, [globalCategories, categoryOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && spaceOpen) {
        await dispatch(getBuildings(companies, appModels.SPACE, spaceKeyword));
      }
    })();
  }, [userInfo, spaceKeyword, spaceOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo.data && categoryOpen) {
        await dispatch(getGlobalCategories(companies));
      }
    })();
  }, [userInfo, categoryOpen]);

  useEffect(() => {
    if (userInfo && userInfo.data && userInfo.data.company && date === undefined) {
      if (userInfo.data.timezone) {
        const todayDate = getCompanyTimezoneDate(new Date(), userInfo, 'datetimesecs');
        changeDate(todayDate);
      }
    }
  }, [userInfo, date]);

  function getStartTime(startDate) {
    let res = new Date();
    if (startDate) {
      res = new Date(startDate);
      res.setHours(0);
      res.setMinutes(0);
      res.setSeconds(0);
    }
    return res;
  }

  function getEndTime(endDate) {
    let res = new Date();
    if (endDate) {
      res = new Date(endDate);
      res.setHours(23);
      res.setMinutes(59);
      res.setSeconds(59);
    }
    return res;
  }

  useEffect(() => {
    if (userInfo && userInfo.data && userInfo.data.company && selectedDate && selectedDate !== '%(custom)s' && selectedDate !== 'Custom' && locationId && locationId.length > 0 && categoryId && categoryId.length > 0) {
      const locationIds = isAssociativeArray(locationId);
      const categoryIds = isAssociativeArray(categoryId);
      const values = {
        company_id: companies, location_ids: `[${locationIds}]`, category_ids: `[${categoryIds}]`, slot_limit: slot, domain_type: selectedDate, type: 'pdf',
      };
      showSlotSelect(true);
      dispatch(getSelectedReportDate(getDatesOfQueryReport(selectedDate, userInfo)));
      dispatch(getPPMReport(values, apiReportName));
    }
  }, [userInfo, customFilters]);

  useEffect(() => {
    if (userInfo && userInfo.data && userInfo.data.company && selectedDate && (selectedDate === '%(custom)s' || selectedDate === 'Custom')) {
      let start = '';
      let end = '';
      let selectedReportDate = '';
      let apiName = apiReportName;
      const locationIds = isAssociativeArray(locationId);
      const categoryIds = isAssociativeArray(categoryId);
      let values = {
        company_id: companies, location_ids: `[${locationIds}]`, category_ids: `[${categoryIds}]`, domain_type: selectedDate, start_date: '',
      };
      const multiDaysApi = 'smart_reading/multi_days';
      if (date && date[0] && date[0] !== null && date[1] && date[1] !== null) {
        if (moment((date[0])).utc().format('YYYY-MM-DD') === moment((date[1])).utc().format('YYYY-MM-DD')) {
          const dateObj = getDateAndTimeForDifferentTimeZones(userInfo, date[0], date[1])
          start = dateObj[0];
          end = dateObj[1];
          apiName = apiReportName;
          selectedReportDate = `${getCompanyTimezoneDate(date[0], userInfo, 'date')}`;
          values = {
            company_id: companies, location_ids: `[${locationIds}]`, category_ids: `[${categoryIds}]`, slot_limit: slot, domain_type: selectedDate, start_date: start, end_date: end
          };
          showSlotSelect(true);

        } else {
          const dateObj = getDateAndTimeForDifferentTimeZones(userInfo, date[0], date[1])
          start = dateObj[0];
          end = dateObj[1];
          selectedReportDate = `${getCompanyTimezoneDate(date[0], userInfo, 'date')} - ${getCompanyTimezoneDate(date[1], userInfo, 'date')}`;
          apiName = multiDaysApi;
          values = {
            company_id: companies, location_ids: `[${locationIds}]`, category_ids: `[${categoryIds}]`, domain_type: selectedDate, start_date: start, end_date: end, type: 'pdf',
          };
          showSlotSelect(false);
        }
        dispatch(getSelectedReportDate(selectedReportDate));
        dispatch(getPPMReport(values, apiName));

      }
    }
  }, [userInfo, customFilters]);

  const handleCheckboxChange = (event) => {
    changeDate([null, null]);
    setSelectedDate(event.target.value);
    dispatch(getTypeId({
      date: event.target.value, locationId, categoryId, slot,
    }));
    setDatesValue([]);
  };

  const handleSlotCheckboxChange = (event) => {
    setSlot(event.target.value);
    dispatch(getTypeId({
      date, locationId, categoryId, slot: event.target.value,
    }));
  };

  const onDateRangeChange = (dates) => {
    changeDate(dates);
    dispatch(getTypeId({
      date, locationId, categoryId, slot,
    }));
  };

  const disabledDate = (current) => {
    if (!datesValue || datesValue.length === 0) {
      return false;
    }
    const tooLate = datesValue && datesValue.length && datesValue[0] && current.diff(datesValue[0], 'days') > 30;
    const tooEarly = datesValue && datesValue.length && datesValue[1] && datesValue[1].diff(current, 'days') > 30;
    return tooEarly || tooLate;
  };

  const handleResetClick = () => {
    dispatch(getTypeId({
      date: '%(today)s', locationId: [], categoryId: [], slot: '5',
    }));
    showSlotSelect(false);
    setSelectedDate('%(today)s');
    setLocationId([]);
    setCategoryId([]);
    setDatesValue([]);
    setSlot('5');
    changeDate(undefined);
  };

  const onCategoryKeywordChange = (event) => {
    setCategoryKeyword(event.target.value);
  };

  const onKeywordClear = () => {
    setSpaceKeyword(null);
    setLocationId([]);
    setSpaceOpen(false);
    dispatch(getTypeId({
      date, locationId: [], categoryId: [], slot,
    }));
  };

  const onCategoryKeywordClear = () => {
    setCategoryKeyword(null);
    setCategoryId([]);
    setCategoryOpen(false);
    dispatch(getTypeId({
      date, locationId, categoryId: [], slot,
    }));
  };

  const showSpaceModal = () => {
    setModelValue(appModels.SPACE);
    setFieldName('location_ids');
    setModalName('Space List');
    setColumns(['id', 'name', 'space_name', 'path_name', 'asset_category_id']);
    setOtherFieldName(false);
    setOtherFieldValue(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraModal(true);
  };

  const showCategoryModal = () => {
    setExtraModal(true);
    dispatch(getGlobalCategories(companies));
    setFieldName('category_ids');
    setModalName('Category List');
    setColumns(['name']);
    setOtherFieldName(false);
    setOtherFieldValue(false);
  };

  function getOldData(oldData) {
    return oldData && oldData.length && oldData.length > 0 ? oldData[1] : '';
  }

  const onSpaceChangeModal = (data) => {
    setCategoryId([]);
    setLocationId(data);
    dispatch(getTypeId({
      date, locationId: data, categoryId: [], slot,
    }));
  };

  const onSpaceChange = (data) => {
    if (data && data.length && data.find((option) => option.path_name === 'Loading...')) {
      return false;
    }
    setLocationId(data);
    setCategoryId([]);
    dispatch(getTypeId({
      date, locationId: data, categoryId: [], slot,
    }));
  };

  const onCategoryChangeModal = (data) => {
    setCategoryId(data);
    dispatch(getTypeId({
      date, locationId, categoryId: data, slot,
    }));
  };

  const onCategoryChange = (data) => {
    if (data && data.length && data.find((option) => option.path_name === 'Loading...')) {
      return false;
    }
    setCategoryId(data);
    dispatch(getTypeId({
      date, locationId, categoryId: data, slot,
    }));
  };

  const onApplyFilters = () => {
    dispatch(resetPPMReport());
    setCustomFilters({
      date, locationId, categoryId, slot,
    })
    setFilterOpen(false)
  }

  const onCloseFilters = () => {
    changeDate(customFilters.date)
    setLocationId(customFilters.locationId)
    setCategoryId(customFilters.categoryId)
    setSlot(customFilters.slot)
    setFilterOpen(false)
  }
  useEffect(() => {
    if (resetFilters) {
      setResetFilters(false)
      setShowResetOption(false)
      dispatch(resetPPMReport());
      handleResetClick()
    }
  }, [resetFilters])

  useEffect(() => {
    if (customFilters && ((customFilters.categoryId)
      || (customFilters.date)
      || (customFilters.slot)
      || (customFilters.locationId)
      || (selectedDate))) {
      setShowResetOption(true)
    }
  }, [customFilters])

  const filtersComponentsArray = [
    {
      title: 'BY SPACE',
      component:
        <>
          <FormGroup>
            <Autocomplete
              multiple
              filterSelectedOptions
              limitTags={3}
              id="tags-filled"
              size="small"
              name="space"
              open={spaceOpen}
              onOpen={() => {
                setSpaceOpen(true);
                setSpaceKeyword('');
              }}
              onClose={() => {
                setSpaceOpen(false);
                setSpaceKeyword('');
              }}
              value={locationId}
              disableClearable={!(locationId.length)}
              onChange={(e, options) => onSpaceChange(options)}
              getOptionSelected={(option, value) => option.name === value.path_name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : `${option.path_name}(${option.space_name})`)}
              options={spaceOptions}
              renderOption={(option) => (
                <div>
                  <h6>{option.name || option.space_name}</h6>
                  <p className="float-left font-tiny">
                    {option.path_name && (
                      <>
                        {option.path_name}
                      </>
                    )}
                  </p>
                </div>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  className={((getOldData(locationId)) || (spaceKeyword && spaceKeyword.length > 0))
                    ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                  placeholder="Search & Select"
                  onChange={(e) => setSpaceKeyword(e.target.value)}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {(buildingsInfo && buildingsInfo.loading) ? <CircularProgress color="inherit" size={20} /> : null}
                        <InputAdornment position="end">
                          {((spaceKeyword && spaceKeyword.length > 0) || (locationId && locationId.length > 0)) && (
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={onKeywordClear}
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
          </FormGroup>
        </>
    },
    {
      title: locationId && locationId.length > 0 ? 'BY CATEGORY' : false,
      component:
        <>
          {locationId && locationId.length > 0
            && (

              <FormGroup>
                <Autocomplete
                  multiple
                  filterSelectedOptions
                  limitTags={3}
                  id="tags-filled"
                  size="small"
                  name="category"
                  open={categoryOpen}
                  onOpen={() => {
                    setCategoryOpen(true);
                    setCategoryKeyword('');
                  }}
                  onClose={() => {
                    setCategoryOpen(false);
                    setCategoryKeyword('');
                  }}
                  value={categoryId}
                  onChange={(e, options) => onCategoryChange(options)}
                  getOptionSelected={(option, value) => option.name === value.name}
                  getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                  getOptionDisabled={() => globalCategories && globalCategories.loading}
                  options={categoryOptions}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      onChange={onCategoryKeywordChange}
                      variant="outlined"
                      className={((getOldData(categoryId)) || (categoryKeyword && categoryKeyword.length > 0))
                        ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                      placeholder="Search & Select"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {(globalCategories && globalCategories.loading) ? <CircularProgress color="inherit" size={20} /> : null}
                            <InputAdornment position="end">
                              {((categoryKeyword && categoryKeyword.length > 0) || (categoryId && categoryId.length > 0)) && (
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={onCategoryKeywordClear}
                                >
                                  <BackspaceIcon fontSize="small" />
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
              </FormGroup>
            )}
        </>
    },
    {
      title: 'BY DATE FILTER',
      component:
        <>
          {preventiveActions.reportFilterSmart.map((tp, index) => (
            <FormControlLabel
              control={<Checkbox
                id={`checkboxstateaction${index}`}
                value={tp.label}
                name={tp.label}
                checked={selectedDate === tp.label}
                onChange={handleCheckboxChange}
              />}
              label={tp.label}
            />
          ))}
          {selectedDate === '%(custom)s' || selectedDate === 'Custom' ? (
            <div>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DateRangePicker']}>
                  <DateRangePicker
                    localeText={{ start: 'Start Date', end: 'End Date' }}
                    onChange={onDateRangeChange}
                    value={date}
                    format="DD-MM-YYYY"
                    slotProps={{
                      actionBar: {
                        actions: ['clear'],
                      },
                      textField: { variant: 'filled' },
                      field: {
                        readOnly: true
                      }
                    }}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </div>
          ) : ''}
        </>
    }
  ]
  return (
    <>
      <Drawer anchor="right" open={filterOpen} PaperProps={{ sx: { width: "30%" } }} >
        <ReportsFilterDrawer
          filtersComponentsArray={filtersComponentsArray}
          onApplyFilters={onApplyFilters}
          onCloseFilters={onCloseFilters}
        />
      </Drawer>
      <Dialog maxWidth={'xl'} open={extraModal} >
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraModal(false); }} />
        <DialogContent sx={{ width: '1000px' }}>
          <DialogContentText id="alert-dialog-description">
            <SearchModalMultiple
              modelName={modelValue}
              afterReset={() => { setExtraModal(false); }}
              fieldName={fieldName}
              fields={columns}
              company={companyValue}
              otherFieldName={otherFieldName}
              otherFieldValue={otherFieldValue}
              onSpaceChange={onSpaceChangeModal}
              onCategoryChange={onCategoryChangeModal}
              oldSpaceValues={locationId}
              oldCategoryValues={categoryId}
              globalCategories={fieldName === 'category_ids' ? globalCategories : ''}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
};

sideFiltersSmartLogger.propTypes = {
  apiReportName: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
};

export default sideFiltersSmartLogger;
