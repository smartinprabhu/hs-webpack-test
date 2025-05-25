/* eslint-disable react/prop-types */
/* eslint-disable consistent-return */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
/* eslint-disable radix */
import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import { DatePicker } from 'antd';
import {
  FormFeedback,
} from 'reactstrap';
import {
  Drawer,
  Dialog, DialogContent,
} from '@mui/material';
import * as PropTypes from 'prop-types';
import {
  TextField, CircularProgress,
} from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { Autocomplete } from '@material-ui/lab';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';

import ReportsFilterDrawer from '../../../../commonComponents/reportsFilterDrawer';
import {
  getTypeId,
} from '../../../../preventiveMaintenance/ppmService';
import {
  getDepartments,
} from '../../../../adminSetup/setupService';
import { resetAuditReport } from '../../../../assets/equipmentService';
import { getMailRoomData, resetMailRoomReport, getCourier } from '../../../mailService';
import { resetExtraMultipleList } from '../../../../helpdesk/ticketService';
import {
  getAllowedCompanies, getDatePickerFormat, getArrayFromValuesById, isArrayColumnExists, getColumnArrayById, generateErrorMessage, getDateAndTimeForDifferentTimeZones, defaultTimeZone,
} from '../../../../util/appUtils';
import { getEmployee } from '../../../../spaceManagement/spaceService';
import MailRoomActions from '../../../data/customData.json';
import SearchModalSingle from './searchModalSingle';
import DialogHeader from '../../../../commonComponents/dialogHeader';

const appModels = require('../../../../util/appModels').default;

const { RangePicker } = DatePicker;

const MailRoomSideFilters = (props) => {
  const {
    isOutbound,
    filterOpen,
    setFilterOpen,
    resetFilters,
    setResetFilters,
    setShowResetOption,
    selectedDate,
    setSelectedDate,
  } = props;
  const dispatch = useDispatch();
  const [validDateCollapse, setValidDateCollapse] = useState(true);
  const [date, changeDate] = useState(false);

  const [statusCollapse, setStatusCollapse] = useState(true);
  const [datesValue, setDatesValue] = useState([]);
  const [statusValue, setStatusValue] = useState([]);
  const [statuskeyword, setStatuskeyword] = useState('');

  const [employeeCollapse, setEmployeeCollapse] = useState(true);
  const [employeeOpen, setEmployeeOpen] = useState(false);
  const [employeeKeyword, setEmployeeKeyword] = useState('');
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [employeeValue, setEmployeeValue] = useState([]);

  const [courierCollapse, setCourierCollapse] = useState(true);
  const [courierOpen, setCourierOpen] = useState(false);
  const [courierKeyword, setCourierKeyword] = useState('');
  const [courierOptions, setCourierOptions] = useState([]);
  const [courierValue, setCourierValue] = useState([]);

  const [departmentCollapse, setDepartmentCollapse] = useState(true);
  const [departmentOpen, setDepartmentOpen] = useState(false);
  const [departmentKeyword, setDepartmentKeyword] = useState('');
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [departmentValue, setDepartmentValue] = useState([]);

  const [extraMultipleModal, setExtraMultipleModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [columns, setColumns] = useState([]);

  const [customFilters, setCustomFilters] = useState({
    date: [null, null], statusValue: [], employeeValue: [], courierValue: [], departmentValue: [],
  });

  const { userInfo } = useSelector((state) => state.user);
  const companies = getAllowedCompanies(userInfo);
  const { employeeList } = useSelector((state) => state.space);
  const {
    courierInfo,
  } = useSelector((state) => state.mailroom);

  const {
    departmentsInfo,
  } = useSelector((state) => state.setup);

  useEffect(() => {
    setCustomFilters({
      date: [null, null], statusValue: [], employeeValue: [], courierValue: [], departmentValue: [],
    });
    dispatch(getTypeId({
      date, statusValue, employeeValue, courierValue, departmentValue,
    }));
    dispatch(resetMailRoomReport());
    setSelectedDate('');
  }, []);

  function isAssociativeArray(arr) {
    let result = arr;
    if (isArrayColumnExists(arr, 'id')) {
      result = getColumnArrayById(arr, 'id');
    }
    return result;
  }

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && employeeOpen) {
        await dispatch(getEmployee(companies, appModels.EMPLOYEE, employeeKeyword));
      }
    })();
  }, [userInfo, employeeKeyword, employeeOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && courierOpen) {
        await dispatch(getCourier(companies, appModels.MAILCOURIER, courierKeyword));
      }
    })();
  }, [userInfo, courierKeyword, courierOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && departmentOpen) {
        await dispatch(getDepartments(companies, appModels.DEPARTMENT, departmentKeyword));
      }
    })();
  }, [userInfo, departmentKeyword, departmentOpen]);

  useEffect(() => {
    if (employeeList && employeeList.data && employeeList.data.length && employeeOpen) {
      setEmployeeOptions(getArrayFromValuesById(employeeList.data, isAssociativeArray(employeeValue || []), 'id'));
    } else if (employeeList && employeeList.loading) {
      setEmployeeOptions([{ name: 'Loading...' }]);
    } else {
      setEmployeeOptions([]);
    }
  }, [employeeList, employeeOpen]);

  useEffect(() => {
    if (courierInfo && courierInfo.data && courierInfo.data.length && courierOpen) {
      setCourierOptions(getArrayFromValuesById(courierInfo.data, isAssociativeArray(courierValue || []), 'id'));
    } else if (courierInfo && courierInfo.loading) {
      setCourierOptions([{ name: 'Loading...' }]);
    } else {
      setCourierOptions([]);
    }
  }, [courierInfo, courierOpen]);

  useEffect(() => {
    if (departmentsInfo && departmentsInfo.data && departmentsInfo.data.length && departmentOpen) {
      setDepartmentOptions(getArrayFromValuesById(departmentsInfo.data, isAssociativeArray(departmentValue || []), 'id'));
    } else if (departmentsInfo && departmentsInfo.loading) {
      setDepartmentOptions([{ display_name: 'Loading...' }]);
    } else {
      setDepartmentOptions([]);
    }
  }, [departmentsInfo, departmentOpen]);

  /* useEffect(() => {
    if ((userInfo && userInfo.data && userInfo.data.company)
      && (date && date.length)
      && (statusValue && statusValue.length <= 0)
      && ((employeeValue && employeeValue.length <= 0) && (courierValue && courierValue.length <= 0) && (departmentValue && departmentValue.length <= 0))) {
      let start = '';
      let end = '';
      const timeZone = userInfo.data.timezone ? userInfo.data.timezone : defaultTimeZone;
      const appModel = isOutbound ? 'mro.mailroom_outbound' : 'mro.mailroom_inbound';

      if (date && date[0] && date[0] !== null) {
        const dateRangeObj = getDateAndTimeForDifferentTimeZones(userInfo, date[0], date[1]);
        start = dateRangeObj[0];
        end = dateRangeObj[1];
      }
      dispatch(getMailRoomData(companies, appModel, start, end, false, false, false, false, isOutbound));
    }
  }, [userInfo, date, statusValue, employeeValue, courierValue, departmentValue]); */

  useEffect(() => {
    if ((userInfo && userInfo.data && userInfo.data.company)
      && (date && date.length)
      && ((statusValue && statusValue.length > 0)
      || ((employeeValue && employeeValue.length > 0) || (courierValue && courierValue.length > 0) || (departmentValue && departmentValue.length > 0)))) {
      const appModel = isOutbound ? 'mro.mailroom_outbound' : 'mro.mailroom_inbound';
      let start = '';
      let end = '';
      const timeZone = userInfo.data.timezone ? userInfo.data.timezone : defaultTimeZone;
      const employeeValues = getColumnArrayById(employeeValue, 'id');
      const courierValues = getColumnArrayById(courierValue, 'id');
      const departmentValues = getColumnArrayById(departmentValue, 'id');
      const status = getColumnArrayById(statusValue, 'value');

      if (date && date[0] && date[0] !== null) {
        const dateRangeObj = getDateAndTimeForDifferentTimeZones(userInfo, date[0], date[1]);
        start = dateRangeObj[0];
        end = dateRangeObj[1];
      }
      dispatch(getMailRoomData(companies, appModel, start, end, status, employeeValues, courierValues, departmentValues, isOutbound));
    }
  }, [userInfo, customFilters]);

  const onDateRangeChange = (dates) => {
    changeDate(dates);
    dispatch(resetMailRoomReport());
    dispatch(resetExtraMultipleList());
    dispatch(getTypeId({
      date: dates, statusValue, employeeValue, courierValue, departmentValue,
    }));
  };

  const disabledDate = (current) => {
    const tooLate = datesValue && datesValue.length && datesValue[0] && current.diff(datesValue[0], 'days') > 365;
    const tooEarly = datesValue && datesValue.length && datesValue[1] && datesValue[1].diff(current, 'days') > 365;
    const overall = tooLate || (tooEarly || (current && current > moment().endOf('day')));
    return datesValue && datesValue.length ? overall : (current && current > moment().endOf('day'));
  };

  const onStatusClear = () => {
    setStatuskeyword('');
    setStatusValue([]);
    dispatch(getTypeId({
      date, statusValue: [], employeeValue, courierValue, departmentValue,
    }));
  };

  const onStatusChange = (data) => {
    dispatch(resetMailRoomReport());
    if (data && data.length && data.find((option) => option.name === 'Loading...')) {
      return false;
    }
    setStatusValue(data);
    dispatch(getTypeId({
      date, statusValue: data, employeeValue, courierValue, departmentValue,
    }));
  };

  const onEmployeeChange = (data) => {
    dispatch(resetMailRoomReport());
    if (data && data.length && data.find((option) => option.name === 'Loading...')) {
      return false;
    }
    setEmployeeValue(data);
    dispatch(getTypeId({
      date, statusValue, employeeValue: data, courierValue, departmentValue,
    }));
  };

  const onEmployeeClear = () => {
    setEmployeeKeyword('');
    setEmployeeValue([]);
    dispatch(getTypeId({
      date, statusValue, employeeValue: [], courierValue, departmentValue,
    }));
    setEmployeeOpen(false);
  };

  const showEmployeeModal = () => {
    setModelValue(appModels.EMPLOYEE);
    setFieldName('employees_id');
    setModalName('Employees');
    setOtherFieldValue(false);
    setCompanyValue(companies);
    setExtraMultipleModal(true);
    setColumns(['id', 'name', 'work_email']);
  };

  const showCourierModal = () => {
    setModelValue(appModels.MAILCOURIER);
    setFieldName('courier_id');
    setModalName('Courier');
    setOtherFieldValue(false);
    setCompanyValue(companies);
    setExtraMultipleModal(true);
    setColumns(['id', 'name', 'phone', 'email']);
  };

  const onCourierChange = (data) => {
    dispatch(resetMailRoomReport());
    if (data && data.length && data.find((option) => option.name === 'Loading...')) {
      return false;
    }
    setCourierValue(data);
    dispatch(getTypeId({
      date, statusValue, employeeValue, courierValue: data, departmentValue,
    }));
  };

  const onCourierClear = () => {
    setCourierKeyword('');
    setCourierValue([]);
    dispatch(getTypeId({
      date, statusValue, employeeValue, courierValue: [], departmentValue,
    }));
    courierOpen(false);
  };

  const showDepartmentModal = () => {
    setModelValue(appModels.DEPARTMENT);
    setFieldName('department_id');
    setModalName('Department');
    setOtherFieldValue(false);
    setCompanyValue(companies);
    setExtraMultipleModal(true);
    setColumns(['id', 'display_name']);
  };

  const onDepartmentChange = (data) => {
    dispatch(resetMailRoomReport());
    if (data && data.length && data.find((option) => option.display_name === 'Loading...')) {
      return false;
    }
    setDepartmentValue(data);
    dispatch(getTypeId({
      date, statusValue, employeeValue, courierValue, departmentValue: data,
    }));
  };

  const onDepartmentClear = () => {
    setDepartmentKeyword('');
    setDepartmentValue([]);
    dispatch(getTypeId({
      date, statusValue, employeeValue, courierValue, departmentValue: [],
    }));
    departmentOpen(false);
  };

  const handleResetClick = () => {
    // e.preventDefault();
    changeDate(null);
    setDatesValue(null);
    setCourierValue([]);
    setEmployeeValue([]);
    setStatusValue([]);
    setDepartmentValue([]);
    dispatch(resetAuditReport());
    dispatch(resetExtraMultipleList());
    dispatch(getTypeId({
      date, statusValue: [], employeeValue: [], courierValue: [], departmentValue: [],
    }));
  };

  useEffect(() => {
    if (resetFilters) {
      setResetFilters(false);
      setShowResetOption(false);
      dispatch(resetMailRoomReport());
      handleResetClick();
      setSelectedDate('');
    }
  }, [resetFilters]);

  const onApplyFilters = () => {
    setFilterOpen(false);
    setCustomFilters({
      date, statusValue, employeeValue, courierValue, selectedDate, departmentValue,
    });
    dispatch(getTypeId({
      date, statusValue, employeeValue, courierValue, selectedDate, departmentValue,
    }));
  };

  const onCloseFilters = () => {
    changeDate(customFilters.date);
    setStatusValue(customFilters.statusValue);
    setEmployeeValue(customFilters.employeeValue);
    setDepartmentValue(customFilters.departmentValue);
    setCourierValue(customFilters.courierValue);
    setSelectedDate(customFilters.selectedDate);
    setFilterOpen(false);
  };

  useEffect(() => {
    if (customFilters && (
      (customFilters.departmentValue && customFilters.departmentValue.length > 0)
      || (customFilters.date && customFilters.date.length && customFilters.date[0] !== null && customFilters.date[1] !== null)
      || (customFilters.employeeValue && customFilters.employeeValue.length > 0)
      || (customFilters.statusValue && customFilters.statusValue.length > 0)
      || (customFilters.courierValue && customFilters.courierValue.length > 0)
      || selectedDate
    )) {
      setShowResetOption(true);
    }
  }, [customFilters]);

  const onEmployeeChangeModal = (data) => {
    dispatch(resetMailRoomReport());
    setEmployeeValue(data);
    dispatch(getTypeId({
      date, statusValue, employeeValue: data, courierValue, departmentValue,
    }));
  };

  const onCourierChangeModal = (data) => {
    dispatch(resetMailRoomReport());
    setCourierValue(data);
    dispatch(getTypeId({
      date, statusValue, employeeValue, courierValue: data, departmentValue,
    }));
  };

  const onDepartmentChangeModal = (data) => {
    dispatch(resetMailRoomReport());
    setDepartmentValue(data);
    dispatch(getTypeId({
      date, statusValue, employeeValue, courierValue, departmentValue: data,
    }));
  };

  const filtersComponentsArray = [
    {
      title: 'BY REGISTERED ON *',
      component:
  <div>
    <RangePicker
      onCalendarChange={(val) => { setDatesValue(val); changeDate(val); }}
      onChange={onDateRangeChange}
      disabledDate={disabledDate}
      value={date}
      format={getDatePickerFormat(userInfo, 'date')}
      size="small"
      className="mt-1 w-100"
    />
    {!date && (
      <FormFeedback className="text-info m-1 text-info font-tiny display-block">Maximum Date Range upto 365 days</FormFeedback>
    )}
  </div>,
    },
    {
      title: 'BY STATUS *',
      component:
  <Autocomplete
    multiple
    filterSelectedOptions
    limitTags={3}
    id="tags-filledspace"
    name="status"
    size="small"
    onOpen={() => {
      setStatuskeyword('');
    }}
    onClose={() => {
      setStatuskeyword('');
    }}
    value={statusValue}
    disableClearable={!(statusValue.length)}
    onChange={(e, options) => onStatusChange(options)}
    getOptionSelected={(option, value) => option.label === value.label}
    getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
    options={MailRoomActions.stateTypes}
    renderInput={(params) => (
      <TextField
        {...params}
        variant="outlined"
        value={statuskeyword}
        className={((statusValue && statusValue.length > 0) || (statuskeyword && statuskeyword.length > 0))
          ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
        placeholder="Search & Select"
        onChange={(e) => setStatuskeyword(e.target.value)}
        InputProps={{
          ...params.InputProps,
          endAdornment: (
            <InputAdornment position="end">
              {((statusValue && statusValue.length > 0) || (statuskeyword && statuskeyword.length > 0)) && (
              <IconButton
                aria-label="toggle password visibility"
                onClick={onStatusClear}
              >
                <BackspaceIcon fontSize="small" />
              </IconButton>
              )}
            </InputAdornment>
          ),
        }}
      />
    )}
  />,
    },
    {
      title: 'BY EMPLOYEE',
      component:
  <>
    <Autocomplete
      multiple
      filterSelectedOptions
      limitTags={3}
      id="tags-filledemployee"
      name="employee"
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
      value={employeeValue}
      disableClearable={!(employeeValue.length)}
      onChange={(e, options) => onEmployeeChange(options)}
      getOptionSelected={(option, value) => option.name === value.name}
      getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
      options={employeeOptions}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          value={employeeKeyword}
          className={((employeeValue && employeeValue.length > 0) || (employeeKeyword && employeeKeyword.length > 0))
            ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
          placeholder="Search & Select"
          onChange={(e) => setEmployeeKeyword(e.target.value)}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {employeeList && employeeList.loading ? <CircularProgress color="inherit" size={20} /> : null}
                <InputAdornment position="end">
                  {((employeeValue && employeeValue.length > 0) || (employeeKeyword && employeeKeyword.length > 0)) && (
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={onEmployeeClear}
                  >
                    <BackspaceIcon fontSize="small" />
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
    {(date && date.length) && (employeeList && employeeList.err) && (
    <FormFeedback className="display-block">{generateErrorMessage(employeeList)}</FormFeedback>
    )}
  </>,
    },

    {
      title: 'BY DEPARTMENT',
      component:
  <>
    <Autocomplete
      multiple
      filterSelectedOptions
      limitTags={3}
      id="tags-filleddepartment"
      name="department"
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
      value={departmentValue}
      disableClearable={!(departmentValue.length)}
      onChange={(e, options) => onDepartmentChange(options)}
      getOptionSelected={(option, value) => option.display_name === value.display_name}
      getOptionLabel={(option) => (typeof option === 'string' ? option : option.display_name)}
      options={departmentOptions}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          value={departmentKeyword}
          className={((departmentValue && departmentValue.length > 0) || (departmentKeyword && departmentKeyword.length > 0))
            ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
          placeholder="Search & Select"
          onChange={(e) => setDepartmentKeyword(e.target.value)}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {departmentsInfo && departmentsInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                <InputAdornment position="end">
                  {((departmentValue && departmentValue.length > 0) || (departmentKeyword && departmentKeyword.length > 0)) && (
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={onDepartmentClear}
                  >
                    <BackspaceIcon fontSize="small" />
                  </IconButton>
                  )}
                  <IconButton
                    aria-label="toggle search visibility"
                    onClick={showDepartmentModal}
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
    {(date && date.length) && (departmentsInfo && departmentsInfo.err) && (
    <FormFeedback className="display-block">{generateErrorMessage(departmentsInfo)}</FormFeedback>
    )}
  </>,
    },

    {
      title: 'BY COURIER',
      component:
  <>
    <Autocomplete
      multiple
      filterSelectedOptions
      limitTags={3}
      id="tags-filledcourier"
      name="courier"
      open={courierOpen}
      size="small"
      onOpen={() => {
        setCourierOpen(true);
        setCourierKeyword('');
      }}
      onClose={() => {
        setCourierOpen(false);
        setCourierKeyword('');
      }}
      value={courierValue}
      disableClearable={!(courierValue.length)}
      onChange={(e, options) => onCourierChange(options)}
      getOptionSelected={(option, value) => option.name === value.name}
      getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
      options={courierOptions}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          value={courierKeyword}
          className={((courierValue && courierValue.length > 0) || (courierKeyword && courierKeyword.length > 0))
            ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
          placeholder="Search & Select"
          onChange={(e) => setCourierKeyword(e.target.value)}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {courierInfo && courierInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                <InputAdornment position="end">
                  {((courierValue && courierValue.length > 0) || (courierKeyword && courierKeyword.length > 0)) && (
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={onCourierClear}
                  >
                    <BackspaceIcon fontSize="small" />
                  </IconButton>
                  )}
                  <IconButton
                    aria-label="toggle search visibility"
                    onClick={showCourierModal}
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
    {(date && date.length) && (courierInfo && courierInfo.err) && (
    <FormFeedback className="display-block">{generateErrorMessage(courierInfo)}</FormFeedback>
    )}
  </>,
    },
  ];

  return (
    <>
      <Drawer anchor="right" open={filterOpen} PaperProps={{ sx: { width: '30%' } }}>
        <ReportsFilterDrawer
          filtersComponentsArray={filtersComponentsArray}
          onApplyFilters={onApplyFilters}
          onCloseFilters={onCloseFilters}
          isDisabled={!((date && date.length && date[0] !== null && date[1] !== null) && (statusValue && statusValue.length > 0))}
        />
      </Drawer>

      <Dialog size="lg" fullWidth open={extraMultipleModal}>
        <DialogHeader title={modalName} imagePath={false} onClose={() => { setExtraMultipleModal(false); }} />
        <DialogContent>
          <SearchModalSingle
            modelName={modelValue}
            modalName={modalName}
            afterReset={() => { setExtraMultipleModal(false); }}
            onEmployeeChange={onEmployeeChangeModal}
            onCourierChange={onCourierChangeModal}
            onDepartmentChange={onDepartmentChangeModal}
            fieldName={fieldName}
            fields={columns}
            company={companyValue}
            otherFieldValue={otherFieldValue}
            oldEmployeeValues={employeeValue}
            oldCourierValues={courierValue}
            oldDepartmentValues={departmentValue}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

MailRoomSideFilters.propTypes = {
  isOutbound: PropTypes.bool,
};
MailRoomSideFilters.defaultProps = {
  isOutbound: false,
};

export default MailRoomSideFilters;
