/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable consistent-return */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
/* eslint-disable radix */
import React, { useState, useEffect } from 'react';
import { DatePicker } from 'antd';
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
import dayjs from 'dayjs';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import { Autocomplete } from '@material-ui/lab';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import ReportsFilterDrawer from '../../../commonComponents/reportsFilterDrawer';
import DialogHeader from '../../../commonComponents/dialogHeader';


import {
  getAllowedCompanies,
  getArrayFromValuesById,
  isArrayColumnExists,
  getColumnArrayById,
} from '../../../util/appUtils';
import {
  getEmployeeDataList,
} from '../../../assets/equipmentService';
import {
  createExport, resetCteateExport, getExportLink, resetExportLink, attendanceReportFilters,
} from '../../attendanceService';

import SearchModalMultiple from './searchModalMultiple';

const appModels = require('../../../util/appModels').default;

const { RangePicker } = DatePicker;

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

const EmployeeBioMetric = (props) => {
  const {
    empDates, employees, setEmpdates, setEmployees, filterOpen, setFilterOpen, resetFilters, setResetFilters, reportName,
  } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [date, changeDate] = useState();

  const [datesValue, setDatesValue] = useState([]);

  const [extraModal, setExtraModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [otherFieldName, setOtherFieldName] = useState(false);
  const [columns, setColumns] = useState([]);

  const [empOpen, setEmpOpen] = useState(false);
  const [empKeyword, setEmpKeyword] = useState('');
  const [empId, setEmpId] = useState([]);
  const [empOptions, setEmpOptions] = useState([]);
  const [customFilters, setCustomFilters] = useState([]);

  const { userInfo } = useSelector((state) => state.user);

  const {
    createExportInfo, attendanceReportFiltersInfo,
  } = useSelector((state) => state.attendance);
  const { employeeListInfo } = useSelector((state) => state.equipment);

  const companies = getAllowedCompanies(userInfo);

  function isAssociativeArray(arr) {
    let result = arr;
    if (isArrayColumnExists(arr, 'id')) {
      result = getColumnArrayById(arr, 'id');
    }
    return result;
  }

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && empOpen) {
        const keywordTrim = empKeyword ? encodeURIComponent(empKeyword.trim()) : '';
        await dispatch(getEmployeeDataList(companies, appModels.EMPLOYEE, keywordTrim));
      }
    })();
  }, [userInfo, empKeyword, empOpen]);

  useEffect(() => {
    setEmpdates();
  }, []);

  const getFindDataInArray = (field) => {
    const result = customFilters && customFilters.length && customFilters.find((cFilter) => cFilter.title === field);
    return result && result.value ? result.value : [];
  };


  console.log(customFilters);

  const getFindDateRange = (field) => {
    const result = customFilters && customFilters.length && customFilters.find((cFilter) => cFilter.key === field);
    return result ? result.value : [null, null];
  };

  useEffect(() => {
    if (attendanceReportFiltersInfo && attendanceReportFiltersInfo.customFilters && attendanceReportFiltersInfo.customFilters.length && attendanceReportFiltersInfo.customFilters.length > 0 && date && date.length > 1 && getFindDataInArray('By Employee') && getFindDataInArray('By Employee').length) {


const fromDate = dayjs(getFindDateRange('date')[0]).format('YYYY-MM-DD');
const toDate = dayjs(getFindDateRange('date')[1]).format('YYYY-MM-DD');
console.log(fromDate);
console.log(toDate);
      const postData = {
        from_date: fromDate,
        to_date: toDate,
        employee_id: [[6, false, getColumnArrayById(getFindDataInArray('By Employee'), 'id')]],
      };
      const payload = { model: 'daily.attendance.report', values: postData };
      const conetxt = { lang: userInfo && userInfo.data ? userInfo.data.locale : 'en_US', tz: userInfo && userInfo.data ? userInfo.data.timezone : 'Asia/Kolkata', uid: userInfo && userInfo.data ? userInfo.data.id : '' };
      dispatch(createExport('daily.attendance.report', postData, conetxt));
    }
  }, [attendanceReportFiltersInfo]);

  useEffect(() => {
    if (createExportInfo && createExportInfo.data && createExportInfo.data.length) {
      const conetxt = { lang: userInfo && userInfo.data ? userInfo.data.locale : 'en_US', tz: userInfo && userInfo.data ? userInfo.data.timezone : 'Asia/Kolkata', uid: userInfo && userInfo.data ? userInfo.data.id : '' };
      dispatch(getExportLink(createExportInfo.data[0], 'print_report', 'daily.attendance.report', false, conetxt));
    }
  }, [createExportInfo]);

  useEffect(() => {
    if (employeeListInfo && employeeListInfo.data && employeeListInfo.data.length && empOpen) {
      setEmpOptions(getArrayFromValuesById(employeeListInfo.data, isAssociativeArray(getFindDataInArray('By Employee') || []), 'id'));
    } else if (employeeListInfo && employeeListInfo.loading) {
      setEmpOptions([{ name: 'Loading...' }]);
    } else {
      setEmpOptions([]);
    }
  }, [employeeListInfo, empOpen]);

  const disabledDate = (current) => {
    if (!datesValue || datesValue.length === 0) {
      return false;
    }
    let disable = false;
    const tooLate = datesValue && datesValue.length && datesValue[0] && current.diff(datesValue[0], 'days') > 30;
    const tooEarly = datesValue && datesValue.length && datesValue[1] && datesValue[1].diff(current, 'days') > 30;
    disable = tooEarly || tooLate;
    return disable;
  };
  const onDateChange = (dates) => {
    console.log(dates);
    changeDate(dates);
    setEmpdates(dates);
  };

  const handleResetClick = (e) => {
    e.preventDefault();
    dispatch(resetCteateExport());
    dispatch(resetExportLink());
    setEmpdates([]);
    changeDate(false);
    setEmpId([]);
    setEmpOpen(false);
  };

  const onDepChange = (data) => {
    if (data && data.length && data.find((option) => option.name === 'Loading...')) {
      return false;
    }
    const filters = [{
      key: 'employee', value: data, label: 'By Employee', type: 'text', id: data, name: data, title: 'By Employee',
    }];
    const customFiltersOthers = customFilters && customFilters.length && customFilters.filter((item) => item.key !== 'employee');
    const customFiltersList = [...customFiltersOthers || [], ...filters];
    setCustomFilters(customFiltersList);
    setEmpId(data);
    setEmployees(data);
  };

  const onEmpChangeModal = (data) => {
    const filters = [{
      key: 'employee', value: data, label: 'By Employee', type: 'text', id: data, name: data, title: 'By Employee',
    }];
    const customFiltersOthers = customFilters && customFilters.length && customFilters.filter((item) => item.key !== 'employee');
    const customFiltersList = [...customFiltersOthers || [], ...filters];
    setCustomFilters(customFiltersList);
    setEmpId(data);
    setEmployees(data);
  };

  const onDepClear = () => {
    setEmpId([]);
    setEmpOpen(false);
    const customFiltersOthers = customFilters && customFilters.length && customFilters.filter((item) => item.key !== 'employee');
    setCustomFilters(customFiltersOthers || []);
    setEmployees([]);
  };

  const showEmpModal = () => {
    setModelValue(appModels.EMPLOYEE);
    setFieldName('employee_id');
    setModalName('Employees');
    setColumns(['id', 'name', 'mobile', 'email']);
    setOtherFieldValue(false);
    setOtherFieldName(false);
    setCompanyValue(userInfo && userInfo.data ? companies : '');
    setExtraModal(true);
  };

  const onDateRangeChange = (dates) => {
    changeDate(dates);
    setDatesValue(dates);
  
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

  const filtersComponentsArray = [
    {
      title: 'BY DATE FILTER *',
      component:
  <>
    <div>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={['DateRangePicker']}>
          <DateRangePicker
            localeText={{ start: 'Start Date', end: 'End Date' }}
            onChange={onDateRangeChange}
            value={getFindDateRange('date') ? getFindDateRange('date') : date}
            shouldDisableDate={disabledDate}
            format="DD-MM-YYYY"
            slotProps={{
              actionBar: {
                actions: ['clear'],
              },
              textField: { variant: 'filled' },
              field: {
                readOnly: true,
              },
            }}
          />
        </DemoContainer>
      </LocalizationProvider>
      {!date || date && date.length && date[0] === null && date[1] === null && (
      <FormFeedback className="text-info m-1 text-info font-tiny display-block">Maximum Date Range upto 30 days</FormFeedback>
      )}
    </div>
  </>,
    },
    {
      title: 'BY EMPLOYEE *',
      component:
  <FormGroup>
    <Autocomplete
      multiple
      filterSelectedOptions
      limitTags={3}
      id="tags-filled"
      size="small"
      name="block"
      open={empOpen}
      onOpen={() => {
        setEmpOpen(true);
        setEmpKeyword('');
      }}
      onClose={() => {
        setEmpOpen(false);
        setEmpKeyword('');
      }}
      value={getFindDataInArray('By Employee')}
      disableClearable={!(getFindDataInArray('By Employee').length)}
      onChange={(e, options) => onDepChange(options)}
      getOptionSelected={(option, value) => option.name === value.name}
      getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
      options={empOptions}
      renderOption={(option) => (
        <div>
          <h6>{option.name}</h6>
        </div>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          className={(((getFindDataInArray('By Employee') && getFindDataInArray('By Employee').length > 0)) || (empKeyword && empKeyword.length > 0))
            ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
          placeholder="Search & Select"
          onChange={(e) => setEmpKeyword(e.target.value)}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {(employeeListInfo && employeeListInfo.loading) ? <CircularProgress color="inherit" size={20} /> : null}
                <InputAdornment position="end">
                  {((empKeyword && empKeyword.length > 0) || (getFindDataInArray('By Employee') && getFindDataInArray('By Employee').length > 0)) && (
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={onDepClear}
                  >
                    <BackspaceIcon fontSize="small" />
                  </IconButton>
                  )}
                  <IconButton
                    aria-label="toggle search visibility"
                    onClick={showEmpModal}
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
    },

  ];

  useEffect(() => {
    if (resetFilters) {
      changeDate([null, null]);
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
    setCustomFilters(attendanceReportFiltersInfo.customFilters);
    setFilterOpen(false);
  };

  const getDisabledApplyButton = () => {
    let res = false;
    res = (empId && empId.length) && ((date && date.length && date[0] !== null && date[1] !== null));
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
              <SearchModalMultiple
                modelName={modelValue}
                afterReset={() => { setExtraModal(false); }}
                fieldName={fieldName}
                fields={columns}
                company={companyValue}
                otherFieldName={otherFieldName}
                otherFieldValue={otherFieldValue}
                onEmpChange={onEmpChangeModal}
                oldEmpValues={empId}
              />
            </Box>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EmployeeBioMetric;
