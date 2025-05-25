/* eslint-disable consistent-return */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
/* eslint-disable radix */
import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import { DatePicker } from 'antd';
import {
  Collapse, Col, Row, FormGroup,
  FormFeedback,
  Modal,
  ModalBody,
} from 'reactstrap';
import {
  TextField, CircularProgress,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import BackspaceIcon from '@material-ui/icons/Backspace';
import SearchIcon from '@material-ui/icons/Search';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown, faChevronUp,
} from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux';

import ModalHeaderComponent from '@shared/modalHeaderComponent';

import {
  getTypeId,
  getEmployeeWiseChecklists, resetEmployeeChecklists,
} from '../../../ppmService';
import {
  getEmployeeDataList,
} from '../../../../assets/equipmentService';
import {
  generateErrorMessage,
  getAllowedCompanies,
  getArrayFromValuesById,
  isArrayColumnExists,
  getColumnArrayById,
} from '../../../../util/appUtils';
import SearchModalEmployee from './searchModalEmployee';

const appModels = require('../../../../util/appModels').default;

const { RangePicker } = DatePicker;

const SideFilterEmployee = () => {
  const dispatch = useDispatch();
  const [statusCollapse, setStatusCollapse] = useState(true);
  const [date, changeDate] = useState(false);
  const [datesValue, setDatesValue] = useState([]);

  const [employeeCollapse, setEmployeeCollapse] = useState(true);
  const [employeeOpen, setEmployeeOpen] = useState(false);
  const [employeeKeyword, setEmployeeKeyword] = useState('');

  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [empValue, setEmpValue] = useState([]);

  const [extraMultipleModal, setExtraMultipleModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [columns, setColumns] = useState([]);

  const { userInfo } = useSelector((state) => state.user);

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
    dispatch(getTypeId({
      date, empValue,
    }));
  }, []);

  useEffect(() => {
    if (employeeListInfo && employeeListInfo.data && employeeListInfo.data.length && employeeOpen) {
      setEmployeeOptions(getArrayFromValuesById(employeeListInfo.data, isAssociativeArray(empValue || []), 'id'));
    } else if (employeeListInfo && employeeListInfo.loading) {
      setEmployeeOptions([{ name: 'Loading...' }]);
    } else {
      setEmployeeOptions([]);
    }
  }, [employeeListInfo, employeeOpen]);

  useEffect(() => {
    if (userInfo.data && employeeOpen) {
      const keywordTrim = employeeKeyword ? encodeURIComponent(employeeKeyword.trim()) : '';
      dispatch(getEmployeeDataList(companies, appModels.EMPLOYEE, keywordTrim));
    }
  }, [userInfo, employeeKeyword, employeeOpen]);

  useEffect(() => {
    if (userInfo && userInfo.data && userInfo.data.company && date === undefined) {
      if (userInfo.data.timezone) {
        const timeZoneDate = moment().tz(userInfo.data.timezone).format('YYYY-MM-DD HH:mm:ss');
        const todayDate = (new Date(timeZoneDate));
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
    if ((userInfo && userInfo.data && userInfo.data.company) && (date && date.length)) {
      let start = '';
      let end = '';
      const assetId = getColumnArrayById(empValue, 'id');

      if (date && date[0] && date[0] !== null) {
        start = moment(getStartTime(date[0])).utc().format('YYYY-MM-DD HH:mm:ss');
        end = moment(getEndTime(date[1])).utc().format('YYYY-MM-DD HH:mm:ss');
      }

      dispatch(getEmployeeWiseChecklists(companies, appModels.INSPECTIONCHECKLISTLOGS, start, end, assetId));
    }
  }, [userInfo, date, empValue]);

  const disabledDate = (current) => {
    if (!datesValue || datesValue.length === 0) {
      return false;
    }
    const tooLate = datesValue[0] && current.diff(datesValue[0], 'days') > 30;
    const tooEarly = datesValue[1] && datesValue[1].diff(current, 'days') > 30;
    return tooEarly || tooLate;
  };

  const onDateRangeChange = (dates) => {
    changeDate(dates);
    dispatch(resetEmployeeChecklists());
    dispatch(getTypeId({
      date: dates, empValue,
    }));
  };

  const onEmployeeChange = (data) => {
    if (data && data.length && data.find((option) => option.name === 'Loading...')) {
      return false;
    }
    setEmpValue(data);
    dispatch(resetEmployeeChecklists());
    dispatch(getTypeId({
      date, equipValue: data,
    }));
  };

  const onEmployeeChangeModal = (data) => {
    setEmpValue(data);
    dispatch(resetEmployeeChecklists());
    dispatch(getTypeId({
      date, equipValue: data,
    }));
  };

  const onEmployeeClear = () => {
    setEmployeeKeyword('');
    setEmpValue([]);
    dispatch(resetEmployeeChecklists());
    dispatch(getTypeId({
      date, equipValue: [],
    }));
    setEmployeeOpen(false);
  };

  const showEmployeeModal = () => {
    setModelValue(appModels.EMPLOYEE);
    setFieldName('employee');
    setModalName('Employees');
    setOtherFieldValue(false);
    setCompanyValue(companies);
    setExtraMultipleModal(true);
    setColumns(['id', 'name', 'work_email', 'mobile_phone']);
  };

  const handleResetClick = (e) => {
    e.preventDefault();
    setEmployeeOptions([]);
    setEmpValue([]);
    changeDate(false);
    dispatch(resetEmployeeChecklists());
    dispatch(getTypeId({
      date: false, equipValue: [],
    }));
  };

  return (
    <>
      <Row className="m-0">
        <Col md="8" className="p-0">
          <p className="m-0 font-weight-800 collapse-heading">BY TIME FILTER</p>
        </Col>
        <Col md="4" className="text-right p-0">
          <FontAwesomeIcon className="mr-2 cursor-pointer" onClick={() => { setStatusCollapse(!statusCollapse); }} size="sm" icon={statusCollapse ? faChevronUp : faChevronDown} />
        </Col>
      </Row>
      <Collapse isOpen={statusCollapse}>
        <div>
          <RangePicker
            onCalendarChange={(val) => { setDatesValue(val); changeDate(val) }}
            onChange={onDateRangeChange}
            disabledDate={disabledDate}
            value={date}
            format="DD-MM-y"
            size="small"
            className="mt-1 mx-wd-220"
          />
          {!date && (
          <FormFeedback className="text-info m-1 text-info font-tiny display-block">Maximum Date Range upto 30 days</FormFeedback>
          )}
        </div>
      </Collapse>
      <hr className="mt-2" />

      <Row className="m-0">
        <Col md="8" className="p-0">
          <p className="m-0 font-weight-800 collapse-heading">BY EMPLOYEE</p>
        </Col>
        <Col md="4" className="text-right p-0">
          <FontAwesomeIcon className="mr-2 cursor-pointer" onClick={() => { setEmployeeCollapse(!employeeCollapse); }} size="sm" icon={employeeCollapse ? faChevronUp : faChevronDown} />
        </Col>
      </Row>
      <Collapse isOpen={employeeCollapse}>
        <div>
          <FormGroup>
            <Autocomplete
              multiple
              filterSelectedOptions
              limitTags={3}
              id="tags-filled"
              size="small"
              name="employee"
              open={employeeOpen}
              value={empValue}
              onOpen={() => {
                setEmployeeOpen(true);
                setEmployeeKeyword('');
              }}
              onClose={() => {
                setEmployeeOpen(false);
                setEmployeeKeyword('');
              }}
              disableClearable={!(empValue.length)}
              onChange={(e, options) => onEmployeeChange(options)}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={employeeOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  value={employeeKeyword}
                  className={((empValue && empValue.length > 0) || (employeeKeyword && employeeKeyword.length > 0))
                    ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                  placeholder="Search & Select"
                  onChange={(e) => setEmployeeKeyword(e.target.value)}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {employeeListInfo && employeeListInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        <InputAdornment position="end">
                          {((empValue && empValue.length > 0) || (employeeKeyword && employeeKeyword.length > 0)) && (
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
            {(date && date.length) && (employeeListInfo && employeeListInfo.err) && (
            <FormFeedback className="display-block">{generateErrorMessage(employeeListInfo)}</FormFeedback>
            )}
          </FormGroup>
        </div>
      </Collapse>
      <hr className="mt-2" />
      {((empValue && empValue.length) || (date && date.length)) && (
      <div aria-hidden="true" className="float-right cursor-pointer mb-4 mr-2 text-info font-weight-800" onClick={handleResetClick} onKeyDown={handleResetClick}>Reset Filters</div>
      )}
      <Modal size="xl" className="border-radius-50px modal-dialog-centered" isOpen={extraMultipleModal}>
        <ModalHeaderComponent title={modalName} imagePath={false} closeModalWindow={() => { setExtraMultipleModal(false); }} />
        <ModalBody className="mt-0 pt-0">
          <SearchModalEmployee
            modelName={modelValue}
            modalName={modalName}
            afterReset={() => { setExtraMultipleModal(false); }}
            onEmployeeChange={onEmployeeChangeModal}
            fieldName={fieldName}
            fields={columns}
            company={companyValue}
            otherFieldValue={otherFieldValue}
            oldEmpValues={empValue}
          />
        </ModalBody>
      </Modal>
    </>
  );
};

export default SideFilterEmployee;
