/* eslint-disable consistent-return */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
/* eslint-disable radix */
import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import { DatePicker } from 'antd';
import {
  Collapse, Col, Input, Label, Row, FormGroup,
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
  getPreventiveChecklistOrders, resetPreventiveChecklistOrders,
} from '../../../../preventiveMaintenance/ppmService';
import { getSpaceAllSearchList, getEquipmentList } from '../../../../helpdesk/ticketService';
import {
  generateErrorMessage,
  getAllowedCompanies,
  getArrayFromValuesById,
  isArrayColumnExists,
  getColumnArrayById,
  defaultTimeZone, getDateAndTimeForDifferentTimeZones
} from '../../../../util/appUtils';
import preventiveActions from '../../../../preventiveMaintenance/data/preventiveActions.json';
import SearchModalSingle from './searchModalSingle';

const appModels = require('../../../../util/appModels').default;

const { RangePicker } = DatePicker;

const SideFilterChecklist = () => {
  const dispatch = useDispatch();
  const [statusCollapse, setStatusCollapse] = useState(true);
  const [preventiveCollapse, setPreventiveCollapse] = useState(true);
  const [scheduleCollapse, setScheduleCollapse] = useState(true);
  const [date, changeDate] = useState(false);
  const [datesValue, setDatesValue] = useState([]);
  const [preventiveFor, setPreventiveFor] = useState('e');

  const [scheduleValue, setScheduleValue] = useState([]);

  const [spaceCollapse, setSpaceCollapse] = useState(true);
  const [spaceOpen, setSpaceOpen] = useState(false);
  const [spaceKeyword, setSpaceKeyword] = useState('');
  const [schedulekeyword, setSchedulekeyword] = useState('');

  const [equipmentCollapse, setEquipmentCollapse] = useState(true);
  const [equipmentOpen, setEquipmentOpen] = useState(false);
  const [equipmentKeyword, setEquipmentKeyword] = useState('');

  const [spaceOptions, setSpaceOptions] = useState([]);
  const [equipmentOptions, setEquipmentOptions] = useState([]);

  const [spaceValue, setSpaceValue] = useState([]);
  const [equipValue, setEquipValue] = useState([]);

  const [extraMultipleModal, setExtraMultipleModal] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [companyValue, setCompanyValue] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modelValue, setModelValue] = useState('');
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [columns, setColumns] = useState([]);
  const isDaily = getColumnArrayById(scheduleValue, 'value').includes('Daily');

  const { userInfo } = useSelector((state) => state.user);

  const { spaceInfoList, equipmentInfo } = useSelector((state) => state.ticket);

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
      preventiveFor, scheduleValue, date, spaceValue, equipValue,
    }));
  }, []);

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
    if (equipmentInfo && equipmentInfo.data && equipmentInfo.data.length && equipmentOpen) {
      setEquipmentOptions(getArrayFromValuesById(equipmentInfo.data, isAssociativeArray(equipValue || []), 'id'));
    } else if (equipmentInfo && equipmentInfo.loading) {
      setEquipmentOptions([{ name: 'Loading...' }]);
    } else {
      setEquipmentOptions([]);
    }
  }, [equipmentInfo, equipmentOpen]);

  useEffect(() => {
    if (userInfo && userInfo.data && spaceOpen) {
      const keywordTrim = spaceKeyword ? encodeURIComponent(spaceKeyword.trim()) : '';
      dispatch(getSpaceAllSearchList(companies, appModels.SPACE, keywordTrim));
    }
  }, [userInfo, spaceKeyword, spaceOpen]);

  useEffect(() => {
    if (userInfo.data && equipmentOpen) {
      const keywordTrim = equipmentKeyword ? encodeURIComponent(equipmentKeyword.trim()) : '';
      dispatch(getEquipmentList(companies, appModels.EQUIPMENT, keywordTrim));
    }
  }, [userInfo, equipmentKeyword, equipmentOpen]);

  useEffect(() => {
    if (userInfo && userInfo.data && userInfo.data.company && date === undefined) {
      if (userInfo.data.timezone) {
        const timeZoneDate = moment().tz(userInfo.data.timezone).format('YYYY-MM-DD HH:mm:ss');
        const todayDate = (new Date(timeZoneDate));
        changeDate(todayDate);
      }
    }
  }, [userInfo, date, preventiveFor]);

  useEffect(() => {
    if ((userInfo && userInfo.data && userInfo.data.company) && (date && date.length)
      && (preventiveFor) && (scheduleValue && scheduleValue.length > 0) && ((spaceValue && spaceValue.length > 0) || (equipValue && equipValue.length > 0))) {
      let start = '';
      let end = '';
      const timeZone = userInfo.data.timezone ? userInfo.data.timezone : defaultTimeZone;
      const assetId = preventiveFor === 'e' ? getColumnArrayById(equipValue, 'id') : getColumnArrayById(spaceValue, 'id');
      const schedule = getColumnArrayById(scheduleValue, 'value');

      if (date && date[0] && date[0] !== null) {
        const dateRangeObj = getDateAndTimeForDifferentTimeZones(userInfo, date[0], date[1] )
        start = dateRangeObj[0];
        end = dateRangeObj[1];
      }

      dispatch(getPreventiveChecklistOrders(start, end, preventiveFor, schedule, assetId));
    }
  }, [userInfo, date, preventiveFor, scheduleValue, spaceValue, equipValue]);

  const disabledDate = (current) => {
    let tooLate = datesValue && datesValue.length && datesValue[0] && current.diff(datesValue[0], 'days') > 90;
    let tooEarly = datesValue && datesValue.length && datesValue[1] && datesValue[1].diff(current, 'days') > 90;

    if (!isDaily) {
      tooLate = datesValue && datesValue.length && datesValue[0] && current.diff(datesValue[0], 'days') > 365;
      tooEarly = datesValue && datesValue.length && datesValue[1] && datesValue[1].diff(current, 'days') > 365;
    }
    const overall = tooLate || (tooEarly || (current && current > moment().endOf('day')));
    return datesValue && datesValue.length ? overall : (current && current > moment().endOf('day'));
  };

  const onDateRangeChange = (dates) => {
    changeDate(dates);
    dispatch(resetPreventiveChecklistOrders());
    dispatch(getTypeId({
      preventiveFor, scheduleValue, date: dates, spaceValue, equipValue,
    }));
  };

  const handleTimeCheckboxChange = (event) => {
    setEquipValue([]);
    setSpaceValue([]);
    dispatch(resetPreventiveChecklistOrders());
    setPreventiveFor(event.target.value);
    dispatch(getTypeId({
      preventiveFor: event.target.value, scheduleValue, date, spaceValue: [], equipValue: [],
    }));
  };

  const onEquipmentChange = (data) => {
    if (data && data.length && data.find((option) => option.name === 'Loading...')) {
      return false;
    }
    setEquipValue(data);
    setSpaceValue([]);
    dispatch(resetPreventiveChecklistOrders());
    dispatch(getTypeId({
      preventiveFor, scheduleValue, date, spaceValue, equipValue: data,
    }));
  };

  const onEquipmentChangeModal = (data) => {
    setEquipValue(data);
    setSpaceValue([]);
    dispatch(resetPreventiveChecklistOrders());
    dispatch(getTypeId({
      preventiveFor, scheduleValue, date, spaceValue, equipValue: data,
    }));
  };

  const onSpaceChangeModal = (data) => {
    setEquipValue([]);
    dispatch(resetPreventiveChecklistOrders());
    setSpaceValue(data);
    dispatch(getTypeId({
      preventiveFor, scheduleValue, date, spaceValue: data, equipValue,
    }));
  };

  const onSpaceChange = (data) => {
    if (data && data.length && data.find((option) => option.path_name === 'Loading...')) {
      return false;
    }
    setEquipValue([]);
    setSpaceValue(data);
    dispatch(resetPreventiveChecklistOrders());
    dispatch(getTypeId({
      preventiveFor, scheduleValue, date, spaceValue: data, equipValue,
    }));
  };

  const onScheduleChange = (data) => {
    changeDate(null);
    setDatesValue([]);
    if (data && data.length && data.find((option) => option.path_name === 'Loading...')) {
      return false;
    }
    setScheduleValue(data);
    dispatch(resetPreventiveChecklistOrders());
    dispatch(getTypeId({
      preventiveFor, scheduleValue: data, date, spaceValue, equipValue,
    }));
  };

  const onSpaceClear = () => {
    setSpaceKeyword('');
    setSpaceValue([]);
    dispatch(resetPreventiveChecklistOrders());
    dispatch(getTypeId({
      preventiveFor, scheduleValue, date, spaceValue: [], equipValue,
    }));
    setSpaceOpen(false);
  };

  const onScheduleClear = () => {
    setSchedulekeyword('');
    setScheduleValue([]);
    dispatch(resetPreventiveChecklistOrders());
    dispatch(getTypeId({
      preventiveFor, scheduleValue: [], date, spaceValue, equipValue,
    }));
  };

  const onEquipClear = () => {
    setEquipmentKeyword('');
    setEquipValue([]);
    dispatch(resetPreventiveChecklistOrders());
    dispatch(getTypeId({
      preventiveFor, scheduleValue, date, spaceValue, equipValue: [],
    }));
    setEquipmentOpen(false);
  };

  const showEquipmentModal = () => {
    setModelValue(appModels.EQUIPMENT);
    setFieldName('equipment');
    setModalName('Equipments');
    setOtherFieldValue(false);
    setCompanyValue(companies);
    setExtraMultipleModal(true);
    setColumns(['id', 'name', 'location_id', 'category_id']);
  };

  const showSpaceModal = () => {
    setModelValue(appModels.SPACE);
    setFieldName('space');
    setModalName('Spaces');
    setOtherFieldValue(false);
    setCompanyValue(companies);
    setExtraMultipleModal(true);
    setColumns(['id', 'path_name', 'space_name', 'asset_category_id']);
  };

  const handleResetClick = (e) => {
    e.preventDefault();
    setScheduleValue([]);
    setPreventiveFor('e');
    setSpaceValue([]);
    setEquipValue([]);
    changeDate(false);
    dispatch(resetPreventiveChecklistOrders());
    dispatch(getTypeId({
      preventiveFor: 'e', scheduleValue: [], date: false, spaceValue: [], equipValue: [],
    }));
  };

  return (
    <>
      <Row className="m-0">
        <Col md="8" className="p-0">
          <p className="m-0 font-weight-800 collapse-heading">BY SCHEDULE</p>
        </Col>
        <Col md="4" className="text-right p-0">
          <FontAwesomeIcon className="mr-2 cursor-pointer" onClick={() => { setScheduleCollapse(!scheduleCollapse); }} size="sm" icon={scheduleCollapse ? faChevronUp : faChevronDown} />
        </Col>
      </Row>
      <Collapse isOpen={scheduleCollapse}>
        <div>
          <FormGroup>
            <Autocomplete
              multiple
              filterSelectedOptions
              limitTags={3}
              id="tags-filledspace"
              name="schedule"
              size="small"
              onOpen={() => {
                setSchedulekeyword('');
              }}
              onClose={() => {
                setSchedulekeyword('');
              }}
              value={scheduleValue}
              disableClearable={!(scheduleValue.length)}
              onChange={(e, options) => onScheduleChange(options)}
              getOptionSelected={(option, value) => option.label === value.label}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
              options={preventiveActions.timeperiod}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  value={schedulekeyword}
                  className={((scheduleValue && scheduleValue.length > 0) || (schedulekeyword && schedulekeyword.length > 0))
                    ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                  placeholder="Search & Select"
                  onChange={(e) => setSchedulekeyword(e.target.value)}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        <InputAdornment position="end">
                          {((scheduleValue && scheduleValue.length > 0) || (schedulekeyword && schedulekeyword.length > 0)) && (
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={onScheduleClear}
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
          </FormGroup>
        </div>
      </Collapse>
      <hr className="mt-2" />
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
            onCalendarChange={(val) => { setDatesValue(val); changeDate(val)}}
            onChange={onDateRangeChange}
            disabledDate={disabledDate}
            value={date}
            format="DD-MM-y"
            size="small"
            className="mt-1 mx-wd-220"
          />
          {!date && scheduleValue && scheduleValue.length > 0 && (
            <FormFeedback className="text-info m-1 text-info font-tiny display-block">{!isDaily ? 'Maximum Date Range upto 365 days' : 'Maximum Date Range upto 90 days'}</FormFeedback>
          )}
        </div>
      </Collapse>
      <hr className="mt-2" />
      <Row className="m-0">
        <Col md="8" className="p-0">
          <p className="m-0 font-weight-800 collapse-heading">BY TYPE</p>
        </Col>
        <Col md="4" className="text-right p-0">
          <FontAwesomeIcon className="mr-2 cursor-pointer" onClick={() => { setPreventiveCollapse(!preventiveCollapse); }} size="sm" icon={preventiveCollapse ? faChevronUp : faChevronDown} />
        </Col>
      </Row>
      <Collapse isOpen={preventiveCollapse}>
        <div>
          {preventiveActions.ppmFor.map((tp, index) => (
            <span className="mb-1 d-block font-weight-500" key={tp.value}>
              <div className="checkbox">
                <Input
                  type="checkbox"
                  id={`checkboxslotaction${index}`}
                  value={tp.value}
                  name={tp.label}
                  checked={preventiveFor === tp.value}
                  onChange={handleTimeCheckboxChange}
                />
                <Label htmlFor={`checkboxslotaction${index}`}>
                  <span className="ml-2">{tp.label}</span>
                </Label>
                {' '}
              </div>
            </span>
          ))}
        </div>
      </Collapse>
      <hr className="mt-2" />
      {preventiveFor !== 'e'
        ? (
          <>
            <Row className="m-0">
              <Col md="8" className="p-0">
                <p className="m-0 font-weight-800 collapse-heading">BY SPACE</p>
              </Col>
              <Col md="4" className="text-right p-0">
                <FontAwesomeIcon className="mr-2 cursor-pointer" onClick={() => { setSpaceCollapse(!spaceCollapse); }} size="sm" icon={spaceCollapse ? faChevronUp : faChevronDown} />
              </Col>
            </Row>
            <Collapse isOpen={spaceCollapse}>
              <div>
                <FormGroup>
                  <Autocomplete
                    multiple
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
                    value={spaceValue}
                    disableClearable={!(spaceValue.length)}
                    onChange={(e, options) => onSpaceChange(options)}
                    getOptionSelected={(option, value) => option.name === value.path_name}
                    getOptionLabel={(option) => (typeof option === 'string' ? option : option.path_name)}
                    options={spaceOptions}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        value={spaceKeyword}
                        className={((spaceValue && spaceValue.length > 0) || (spaceKeyword && spaceKeyword.length > 0))
                          ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                        placeholder="Search & Select"
                        onChange={(e) => setSpaceKeyword(e.target.value)}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {spaceInfoList && spaceInfoList.loading ? <CircularProgress color="inherit" size={20} /> : null}
                              <InputAdornment position="end">
                                {((spaceValue && spaceValue.length > 0) || (spaceKeyword && spaceKeyword.length > 0)) && (
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
                  {(date && date.length) && (preventiveFor) && (spaceInfoList && spaceInfoList.err) && (
                  <FormFeedback className="display-block">{generateErrorMessage(spaceInfoList)}</FormFeedback>
                  )}
                </FormGroup>
              </div>
            </Collapse>
            <hr className="mt-2" />
          </>
        )
        : (
          <>
            <Row className="m-0">
              <Col md="8" className="p-0">
                <p className="m-0 font-weight-800 collapse-heading">BY EQUIPMENT</p>
              </Col>
              <Col md="4" className="text-right p-0">
                <FontAwesomeIcon className="mr-2 cursor-pointer" onClick={() => { setEquipmentCollapse(!equipmentCollapse); }} size="sm" icon={equipmentCollapse ? faChevronUp : faChevronDown} />
              </Col>
            </Row>
            <Collapse isOpen={equipmentCollapse}>
              <div>
                <FormGroup>
                  <Autocomplete
                    multiple
                    filterSelectedOptions
                    limitTags={3}
                    id="tags-filled"
                    size="small"
                    name="equipment"
                    open={equipmentOpen}
                    value={equipValue}
                    onOpen={() => {
                      setEquipmentOpen(true);
                      setEquipmentKeyword('');
                    }}
                    onClose={() => {
                      setEquipmentOpen(false);
                      setEquipmentKeyword('');
                    }}
                    disableClearable={!(equipValue.length)}
                    onChange={(e, options) => onEquipmentChange(options)}
                    getOptionSelected={(option, value) => option.name === value.name}
                    getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                    options={equipmentOptions}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        value={equipmentKeyword}
                        className={((equipValue && equipValue.length > 0) || (equipmentKeyword && equipmentKeyword.length > 0))
                          ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                        placeholder="Search & Select"
                        onChange={(e) => setEquipmentKeyword(e.target.value)}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {equipmentInfo && equipmentInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                              <InputAdornment position="end">
                                {((equipValue && equipValue.length > 0) || (equipmentKeyword && equipmentKeyword.length > 0)) && (
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
                  {(date && date.length) && (preventiveFor) && (equipmentInfo && equipmentInfo.err) && (
                  <FormFeedback className="display-block">{generateErrorMessage(equipmentInfo)}</FormFeedback>
                  )}
                </FormGroup>
              </div>
            </Collapse>
            <hr className="mt-2" />
          </>
        )}
      {(preventiveFor !== 'e' || scheduleValue || (date && date.length)) && (
      <div aria-hidden="true" className="float-right cursor-pointer mb-4 mr-2 text-info font-weight-800" onClick={handleResetClick} onKeyDown={handleResetClick}>Reset Filters</div>
      )}
      <Modal size="xl" className="border-radius-50px modal-dialog-centered" isOpen={extraMultipleModal}>
        <ModalHeaderComponent title={modalName} imagePath={false} closeModalWindow={() => { setExtraMultipleModal(false); }} />
        <ModalBody className="mt-0 pt-0">
          <SearchModalSingle
            modelName={modelValue}
            modalName={modalName}
            afterReset={() => { setExtraMultipleModal(false); }}
            onEquipmentChange={onEquipmentChangeModal}
            onSpaceChange={onSpaceChangeModal}
            fieldName={fieldName}
            fields={columns}
            company={companyValue}
            otherFieldValue={otherFieldValue}
            oldEquipValues={equipValue}
            oldSpaceValues={spaceValue}
          />
        </ModalBody>
      </Modal>
    </>
  );
};

export default SideFilterChecklist;
