/* eslint-disable max-len */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable consistent-return */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
/* eslint-disable radix */
import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import {
  FormGroup,
  FormFeedback,
} from 'reactstrap';
import {
  TextField, CircularProgress,
} from '@material-ui/core';
import {
  Box,
  Drawer,
  Dialog, DialogContent, DialogContentText,
} from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import { Autocomplete } from '@material-ui/lab';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import ReportsFilterDrawer from '../../../commonComponents/reportsFilterDrawer';
import DialogHeader from '../../../commonComponents/dialogHeader';

import customData from '../data/customData.json';

import {
  generateErrorMessage,
  getAllowedCompanies,
  getArrayFromValuesById,
  isArrayColumnExists,
  getColumnArrayById,
} from '../../../util/appUtils';
import {
  getPartners,
} from '../../../assets/equipmentService';
import {
  createExport, resetCteateExport, getExportLink, resetExportLink, attendanceReportFilters,
} from '../../attendanceService';
import {
  getDepartments,
} from '../../../adminSetup/setupService';

import SearchModal from './searchSingle';
import SearchModalMultiple from './searchModalMultiple';

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

const MonthlyAttendance = (props) => {
  const {
    selectedDate,
    filterOpen, setFilterOpen, resetFilters, setResetFilters,
    setSelectedDate,
    reportName,
  } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [date, changeDate] = useState(dayjs());
  const [typeOpen, setTypeOpen] = useState(false);
  const [typeData, setTypeData] = useState(false);

  const [globalType, setGlobalType] = useState('');
  const [globalVendor, setGlobalVendor] = useState('');

  const [vendorOpen, setVendorOpen] = useState(false);
  const [vendorKeyword, setVendorKeyword] = useState('');
  const [vendorId, setVendorId] = useState(false);
  const [vendorOptions, setVendorOptions] = useState([]);

  const [extraModal, setExtraModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [columns, setColumns] = useState([]);
  const [customFilters, setCustomFilters] = useState([]);

  const [extraModal1, setExtraModal1] = useState(false);

  const [depOpen, setDepOpen] = useState(false);
  const [depKeyword, setDepKeyword] = useState('');
  const [depId, setDepId] = useState([]);
  const [depOptions, setDepOptions] = useState([]);

  const { userInfo } = useSelector((state) => state.user);

  const { partnersInfo } = useSelector((state) => state.equipment);
  const {
    createExportInfo, attendanceReportFiltersInfo,
  } = useSelector((state) => state.attendance);
  const {
    departmentsInfo,
  } = useSelector((state) => state.setup);

  const companies = getAllowedCompanies(userInfo);

  const getFindDataIn = (field) => {
    const result = customFilters && customFilters.length && customFilters.find((cFilter) => cFilter.title === field);
    return result && result.value ? result.value : '';
  };

  const getFindDataInArray = (field) => {
    const result = customFilters && customFilters.length && customFilters.find((cFilter) => cFilter.title === field);
    return result && result.value ? result.value : [];
  };

  useEffect(() => {
    if (attendanceReportFiltersInfo && attendanceReportFiltersInfo.customFilters) {
      setCustomFilters(attendanceReportFiltersInfo.customFilters);
    }
  }, [attendanceReportFiltersInfo]);

  function isAssociativeArray(arr) {
    let result = arr;
    if (isArrayColumnExists(arr, 'id')) {
      result = getColumnArrayById(arr, 'id');
    }
    return result;
  }

  function getTypes(rep) {
    let res = [];
    if (rep === 'Monthly Attendance Details') {
      res = customData.types;
    } else if (rep === 'Form XXVI') {
      res = customData.formtypes;
    } else {
      res = customData.atttypes;
    }
    return res;
  }

  function getRepModel(rep) {
    let res = '';
    if (rep === 'Monthly Attendance Details') {
      res = 'monthly.attendance.details';
    } else if (rep === 'Form XXVI') {
      res = 'hr.formsixteen.report';
    } else if (rep === 'Monthly Biometric') {
      res = 'biometric.checkin_report';
    } else {
      res = 'daily.attendance.details';
    }
    return res;
  }

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && vendorOpen) {
        await dispatch(getPartners(companies, appModels.PARTNER, 'is_man_power_agency', vendorKeyword, false, true));
      }
    })();
  }, [userInfo, vendorKeyword, vendorOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && depOpen) {
        const keywordTrim = depKeyword ? encodeURIComponent(depKeyword.trim()) : '';
        await dispatch(getDepartments(companies, appModels.DEPARTMENT, keywordTrim));
      }
    })();
  }, [userInfo, depKeyword, depOpen]);

  useEffect(() => {
    setSelectedDate(new Date());
  }, []);

  useEffect(() => {
    if (attendanceReportFiltersInfo && attendanceReportFiltersInfo.customFilters && attendanceReportFiltersInfo.customFilters.length && attendanceReportFiltersInfo.customFilters.length > 0 && date && getFindDataIn('By Type') && getFindDataIn('By Type').value && getFindDataIn('By Vendor') && getFindDataIn('By Vendor').id && reportName === 'Monthly Attendance Details') {
      const rDate = new Date(date);
      const postData = {
        report_type: typeData.value,
        month: rDate.getMonth() + 1,
        year: rDate.getFullYear().toString(),
        partner_id: getFindDataIn('By Vendor').id,
      };
      const conetxt = { lang: userInfo && userInfo.data ? userInfo.data.locale : 'en_US', tz: userInfo && userInfo.data ? userInfo.data.timezone : 'Asia/Kolkata', uid: userInfo && userInfo.data ? userInfo.data.id : '' };
      dispatch(createExport('monthly.attendance.details', postData, conetxt));
    }
  }, [attendanceReportFiltersInfo]);

  useEffect(() => {
    if (attendanceReportFiltersInfo && attendanceReportFiltersInfo.customFilters && attendanceReportFiltersInfo.customFilters.length && attendanceReportFiltersInfo.customFilters.length > 0 && date && getFindDataIn('By Vendor') && getFindDataIn('By Vendor').id && reportName === 'Monthly Biometric') {
      const rDate = new Date(date);
      const postData = {
        report_type: 1,
        month: rDate.getMonth() + 1,
        year: rDate.getFullYear().toString(),
        partner_id: getFindDataIn('By Vendor').id,
        company_id: userInfo && userInfo.data && userInfo.data.company && userInfo.data.company.id,
      };
      const conetxt = { lang: userInfo && userInfo.data ? userInfo.data.locale : 'en_US', tz: userInfo && userInfo.data ? userInfo.data.timezone : 'Asia/Kolkata', uid: userInfo && userInfo.data ? userInfo.data.id : '' };
      dispatch(createExport('biometric.checkin_report', postData, conetxt));
    }
  }, [attendanceReportFiltersInfo]);

  useEffect(() => {
    if (attendanceReportFiltersInfo && attendanceReportFiltersInfo.customFilters && attendanceReportFiltersInfo.customFilters.length && attendanceReportFiltersInfo.customFilters.length > 0 && date && getFindDataIn('By Type') && getFindDataIn('By Type').value && getFindDataIn('By Vendor') && getFindDataIn('By Vendor').id && reportName === 'Daily Attendance Details') {
      const postData = {
        type: typeData.value,
        date: moment(date).format('YYYY-MM-DD'),
        is_all: false,
        partner_id: getFindDataIn('By Vendor').id,
      };
      const conetxt = { lang: userInfo && userInfo.data ? userInfo.data.locale : 'en_US', tz: userInfo && userInfo.data ? userInfo.data.timezone : 'Asia/Kolkata', uid: userInfo && userInfo.data ? userInfo.data.id : '' };
      const payload = { model: 'daily.attendance.details', values: postData, conetxt };
      dispatch(createExport('daily.attendance.details', postData, conetxt));
    }
  }, [attendanceReportFiltersInfo]);

  useEffect(() => {
    if (attendanceReportFiltersInfo && attendanceReportFiltersInfo.customFilters && attendanceReportFiltersInfo.customFilters.length && attendanceReportFiltersInfo.customFilters.length > 0 && date && getFindDataIn('By Type') && getFindDataIn('By Type').value && getFindDataIn('By Vendor') && getFindDataIn('By Vendor').id && reportName === 'Form XXVI') {
      const rDate = new Date(date);
      const postData = {
        type: typeData.value,
        month: rDate.getMonth() + 1,
        year: rDate.getFullYear().toString(),
        partner_id: getFindDataIn('By Vendor').id,
        department_ids: [[6, false, getColumnArrayById(depId, 'id')]],
      };
      const conetxt = { lang: userInfo && userInfo.data ? userInfo.data.locale : 'en_US', tz: userInfo && userInfo.data ? userInfo.data.timezone : 'Asia/Kolkata', uid: userInfo && userInfo.data ? userInfo.data.id : '' };
      dispatch(createExport('hr.formsixteen.report', postData, conetxt));
    }
  }, [attendanceReportFiltersInfo]);

  useEffect(() => {
    if (createExportInfo && createExportInfo.data && createExportInfo.data.length) {
      const conetxt = { lang: userInfo && userInfo.data ? userInfo.data.locale : 'en_US', tz: userInfo && userInfo.data ? userInfo.data.timezone : 'Asia/Kolkata', uid: userInfo && userInfo.data ? userInfo.data.id : '' };
      if (reportName === 'Daily Attendance Details') {
        dispatch(getExportLink(createExportInfo.data[0], 'update_go', getRepModel(reportName), false, conetxt));
        setTimeout(() => {
          dispatch(getExportLink(createExportInfo.data[0], 'export_in_excel', getRepModel(reportName), false, conetxt));
        }, 1000);
      } else {
        dispatch(getExportLink(createExportInfo.data[0], 'export_in_excel', getRepModel(reportName), false, conetxt));
      }
    }
  }, [createExportInfo]);

  useEffect(() => {
    if (partnersInfo && partnersInfo.data && partnersInfo.data.length && vendorOpen) {
      setVendorOptions(partnersInfo.data);
    } else if (partnersInfo && partnersInfo.loading) {
      setVendorOptions([{ name: 'Loading...' }]);
    } else {
      setVendorOptions([]);
    }
  }, [partnersInfo, vendorOpen]);

  useEffect(() => {
    if (departmentsInfo && departmentsInfo.data && departmentsInfo.data.length && depOpen) {
      setDepOptions(getArrayFromValuesById(departmentsInfo.data, isAssociativeArray(getFindDataInArray('By Department') || []), 'id'));
    } else if (departmentsInfo && departmentsInfo.loading) {
      setDepOptions([{ name: 'Loading...' }]);
    } else {
      setDepOptions([]);
    }
  }, [departmentsInfo, depOpen]);

  const disabledDate = (current) => {
    if (!current) {
      return false;
    }
    const disable = current && current > moment().endOf('day');
    return disable;
  };

  const onTypeClear = () => {
    setTypeData(false);
    setTypeOpen(false);
    setGlobalType(false);
    const customFiltersOthers = customFilters && customFilters.length && customFilters.filter((item) => item.key !== 'type');
    setCustomFilters(customFiltersOthers || []);
  };

  const onVendorKeywordChange = (event) => {
    setVendorKeyword(event.target.value);
  };

  const onTypeChange = (data) => {
    const filters = [{
      key: 'type', value: data, label: 'By Type', type: 'text', id: data, name: data, title: 'By Type',
    }];
    const customFiltersOthers = customFilters && customFilters.length && customFilters.filter((item) => item.key !== 'type');
    const customFiltersList = [...customFiltersOthers || [], ...filters];
    setCustomFilters(customFiltersList);
  };

  const onVendorChange = (data) => {
    if (data && data.length && data.find((option) => option.name === 'Loading...')) {
      return false;
    }
    const filters = [{
      key: 'vendor', value: data, label: 'By Vendor', type: 'text', id: data, name: data, title: 'By Vendor',
    }];
    const customFiltersOthers = customFilters && customFilters.length && customFilters.filter((item) => item.key !== 'vendor');
    const customFiltersList = [...customFiltersOthers || [], ...filters];
    setCustomFilters(customFiltersList);
  };

  const onVendorClear = () => {
    setVendorId(false);
    setVendorOpen(false);
    setGlobalVendor(false);
    setVendorKeyword('');
    const customFiltersOthers = customFilters && customFilters.length && customFilters.filter((item) => item.key !== 'vendor');
    console.log(customFiltersOthers);
    setCustomFilters(customFiltersOthers || []);
  };

  const onVendorChangeModal = (data) => {
    setVendorId(data);
    const filters = [{
      key: 'vendor', value: data, label: 'By Vendor', type: 'text', id: data, name: data, title: 'By Vendor',
    }];
    const customFiltersOthers = customFilters && customFilters.length && customFilters.filter((item) => item.key !== 'vendor');
    const customFiltersList = [...customFiltersOthers || [], ...filters];
    setCustomFilters(customFiltersList);
  };

  const handleResetClick = (e) => {
    e.preventDefault();
    dispatch(resetCteateExport());
    dispatch(resetExportLink());
    setSelectedDate(false);
    setGlobalType('');
    setGlobalVendor('');
    changeDate(new Date());
    setVendorId(false);
    setVendorOpen(false);
    setTypeData(false);
    setTypeOpen(false);
    setDepId([]);
    setDepOpen(false);
  };

  const onDepChange = (data) => {
    if (data && data.length && data.find((option) => option.name === 'Loading...')) {
      return false;
    }
    setDepId(data);
    const filters = [{
      key: 'department', value: data, label: 'By Department', type: 'text', id: data, name: data, title: 'By Department',
    }];
    const customFiltersOthers = customFilters && customFilters.length && customFilters.filter((item) => item.key !== 'department');
    const customFiltersList = [...customFiltersOthers || [], ...filters];
    setCustomFilters(customFiltersList);
  };

  const onDepChangeModal = (data) => {
    setDepId(data);
    const filters = [{
      key: 'department', value: data, label: 'By Department', type: 'text', id: data, name: data, title: 'By Department',
    }];
    const customFiltersOthers = customFilters && customFilters.length && customFilters.filter((item) => item.key !== 'department');
    const customFiltersList = [...customFiltersOthers || [], ...filters];
    setCustomFilters(customFiltersList);
  };

  const showVendorModal = () => {
    setModelValue(appModels.PARTNER);
    setFieldName('vendor_id');
    setModalName('Vendor List');
    setOtherFieldName('is_man_power_agency');
    setOtherFieldValue(true);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setColumns(['id', 'display_name', 'email', 'mobile', 'name']);
    setExtraModal(true);
  };

  const onDepClear = () => {
    setDepId([]);
    setDepOpen(false);
    const customFiltersOthers = customFilters && customFilters.length && customFilters.filter((item) => item.key !== 'department');
    setCustomFilters(customFiltersOthers || []);
  };

  const showDepModal = () => {
    setModelValue(appModels.DEPARTMENT);
    setFieldName('department_id');
    setModalName('Departments');
    setColumns(['id', 'name']);
    setOtherFieldValue(false);
    setOtherFieldName(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraModal1(true);
  };

  const onDateRangeChange = (dates) => {
    changeDate(dates);
    if (dates !== null) {
      const customFiltersOthers = customFilters && customFilters.length && customFilters.filter((item) => item.key !== 'date');
      const filters = [{
        key: 'date', value: dates, label: 'By Date', type: 'customdate', id: 'date', name: 'date', title: 'By Date',
      }];
      const customFiltersList = [...customFiltersOthers || [], ...filters];
      setCustomFilters(customFiltersList);
    } else {
      const customFiltersList = customFilters && customFilters.filter((item) => item.title !== 'By Date');
      setCustomFilters(customFiltersList);
    }
  };

  const getFindDateRange = (field) => {
    const result = customFilters && customFilters.length && customFilters.find((cFilter) => cFilter.key === field);
    return result ? result.value : null;
  };

  const filtersComponentsArray = [
    {
      title: reportName === 'Daily Attendance Details' ? 'BY DATE *' : 'BY MONTH *',
      component:
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <DemoContainer components={['DatePicker']}>
      <DatePicker
        format={reportName === 'Daily Attendance Details' ? 'DD/MM/YYYY' : 'MMM-YY'}
        value={getFindDateRange('date') ? getFindDateRange('date') : date}
        onChange={(newValue) => onDateRangeChange(newValue)}
        sx={{
          width: '400px',
        }}
        views={reportName !== 'Daily Attendance Details' ? ['month'] : ['day']}
        slotProps={{
          actionBar: {
            actions: reportName === 'Daily Attendance Details' ? ['today', 'clear'] : ['clear'],
          },
        }}
      />

    </DemoContainer>
  </LocalizationProvider>,
    },
    reportName !== 'Monthly Biometric' && ({
      title: 'BY TYPE *',
      component:
  <FormGroup className="mb-1">
    <Autocomplete
      name="category_id"
      className="bg-white"
      open={typeOpen}
      size="small"
      onOpen={() => {
        setTypeOpen(true);
      }}
      onClose={() => {
        setTypeOpen(false);
      }}
      value={getFindDataIn('By Type') && getFindDataIn('By Type').label ? getFindDataIn('By Type').label : ''}
      getOptionSelected={(option, value) => (value.length > 0 ? option.label === value.label : '')}
      getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
      options={getTypes(reportName)}
      onChange={(e, data) => onTypeChange(data)}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          className="without-padding custom-icons"
          placeholder="Select Type"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                <InputAdornment position="end">
                  {getFindDataIn('By Type') && getFindDataIn('By Type').value && (
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={onTypeClear}
                  >
                    <BackspaceIcon fontSize="small" />
                  </IconButton>
                  )}
                </InputAdornment>
              </>
            ),
          }}
        />
      )}
    />
  </FormGroup>,
    }),
    {
      title: 'BY VENDOR *',
      component:
  <FormGroup>
    <Autocomplete
      name="Vendor"
      label="Vendor"
      open={vendorOpen}
      size="small"
      onOpen={() => {
        setVendorOpen(true);
        setVendorKeyword('');
      }}
      onClose={() => {
        setVendorOpen(false);
        setVendorKeyword('');
      }}
      classes={{
        option: classes.option,
      }}
      value={getFindDataIn('By Vendor') && getFindDataIn('By Vendor').name ? getFindDataIn('By Vendor').name : ''}
      loading={partnersInfo && partnersInfo.loading}
      getOptionSelected={(option, value) => option.name === value.name}
      getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
      onChange={(e, data) => onVendorChange(data)}
      options={vendorOptions}
      renderInput={(params) => (
        <TextField
          {...params}
          onChange={onVendorKeywordChange}
          variant="outlined"
          value={vendorKeyword}
          className={((vendorKeyword && vendorKeyword.length > 0) || (vendorId && vendorId.length > 0))
            ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
          placeholder="Search & Select"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {partnersInfo && partnersInfo.loading && vendorOpen ? <CircularProgress color="inherit" size={20} /> : null}
                <InputAdornment position="end">
                  {((vendorKeyword && vendorKeyword.length > 0) || (getFindDataIn('By Vendor') && getFindDataIn('By Vendor').id)) && (
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={onVendorClear}
                  >
                    <BackspaceIcon fontSize="small" />
                  </IconButton>
                  )}
                  <IconButton
                    aria-label="toggle search visibility"
                    onClick={showVendorModal}
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
    {(partnersInfo && partnersInfo.err) && (
    <FormFeedback className="display-block">{generateErrorMessage(partnersInfo)}</FormFeedback>
    )}
  </FormGroup>,
    },
    reportName === 'Form XXVI' && ({
      title: 'BY DEPARTMENT',
      component:
  <FormGroup>
    <Autocomplete
      multiple
      filterSelectedOptions
      limitTags={3}
      id="tags-filled"
      size="small"
      name="block"
      open={depOpen}
      onOpen={() => {
        setDepOpen(true);
        setDepKeyword('');
      }}
      onClose={() => {
        setDepOpen(false);
        setDepKeyword('');
      }}
      value={getFindDataInArray('By Department')}
      disableClearable={!(getFindDataInArray('By Department').length)}
      onChange={(e, options) => onDepChange(options)}
      getOptionSelected={(option, value) => option.name === value.name}
      getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
      options={depOptions}
      // renderOption={(option) => (
      //   <div>
      //     <h6>{option.name}</h6>
      //     <p className="float-left font-tiny">
      //       {option.name && (
      //       <>
      //         {option.name}
      //       </>
      //       )}
      //     </p>
      //   </div>
      // )}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          className={(((getFindDataInArray('By Department') && getFindDataInArray('By Department').length > 0)) || (depKeyword && depKeyword.length > 0))
            ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
          placeholder="Search & Select"
          onChange={(e) => setDepKeyword(e.target.value)}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {(departmentsInfo && departmentsInfo.loading) ? <CircularProgress color="inherit" size={20} /> : null}
                <InputAdornment position="end">
                  {((depKeyword && depKeyword.length > 0) || (getFindDataInArray('By Department') && getFindDataInArray('By Department').length > 0)) && (
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={onDepClear}
                  >
                    <BackspaceIcon fontSize="small" />
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
  </FormGroup>,
    }),
  ];

  useEffect(() => {
    if (resetFilters) {
      changeDate(dayjs());
      dispatch(resetCteateExport());
      dispatch(resetExportLink());
      dispatch(attendanceReportFilters([]));
      setResetFilters(false);
    }
  }, [resetFilters]);

  const onApplyFilters = () => {
    setFilterOpen(false);
    dispatch(resetCteateExport());
    dispatch(resetExportLink());
    dispatch(attendanceReportFilters(customFilters));
  };

  const onCloseFilters = () => {
    setFilterOpen(false);
    setCustomFilters(attendanceReportFiltersInfo.customFilters);
  };

  const getDisabledApplyButton = () => {
    let res = false;
    if (reportName === 'Monthly Attendance Details') {
      res = getFindDataIn('By Type') && getFindDataIn('By Type').value && (getFindDataIn('By Vendor') && getFindDataIn('By Vendor').id);
    } else if (reportName === 'Form XXVI') {
      res = getFindDataIn('By Type') && getFindDataIn('By Type').value && (getFindDataIn('By Vendor') && getFindDataIn('By Vendor').id);
    } else if (reportName === 'Monthly Biometric') {
      res = (getFindDataIn('By Vendor') && getFindDataIn('By Vendor').id);
    } else {
      res = getFindDataIn('By Type') && getFindDataIn('By Type').value && (getFindDataIn('By Vendor') && getFindDataIn('By Vendor').id);
    }
    return res;
  };

  return (
    <>
      <Drawer anchor="right" open={filterOpen} PaperProps={{ sx: { width: '30%' } }}>
        <ReportsFilterDrawer
          filtersComponentsArray={filtersComponentsArray}
          onApplyFilters={onApplyFilters}
          onCloseFilters={onCloseFilters}
          isDisabled={!getDisabledApplyButton()}
        />
      </Drawer>
      <Dialog size="lg" open={extraModal} fullWidth>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraModal(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Box
              sx={{
                width: '100%',
                height: '100%',
                backgroundColor: '#F6F8FA',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10%',
                fontFamily: 'Suisse Intl',
              }}
            >
              <SearchModal
                modelName={modelValue}
                afterReset={() => { setExtraModal(false); }}
                fieldName={fieldName}
                fields={columns}
                company={companyValue}
                placeholderName="Vendor"
                onCategoryChange={onVendorChangeModal}
              />
            </Box>
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Dialog size="lg" open={extraModal1} fullWidth>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraModal1(false); }} />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Box
              sx={{
                width: '100%',
                height: '100%',
                backgroundColor: '#F6F8FA',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10%',
                fontFamily: 'Suisse Intl',
              }}
            >
              <SearchModalMultiple
                modelName={modelValue}
                afterReset={() => { setExtraModal1(false); }}
                fieldName={fieldName}
                fields={columns}
                company={companyValue}
                otherFieldName={otherFieldName}
                otherFieldValue={otherFieldValue}
                onDepChange={onDepChangeModal}
                oldDepValues={depId}
              />
            </Box>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MonthlyAttendance;
