/* eslint-disable no-shadow */
/* eslint-disable space-in-parens */
/* eslint-disable consistent-return */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import { DatePicker } from 'antd';
import {
  Collapse, Col, Row, FormGroup,
  FormFeedback, Modal,
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
import { getTypeId } from '../../../../preventiveMaintenance/ppmService';
import {
  getTeamList,
} from '../../../../assets/equipmentService';
import {
  generateErrorMessage,
  getAllowedCompanies,
  getColumnArrayById,
  getArrayFromValuesById,
  isAssociativeArray,
  defaultTimeZone, getDateAndTimeForDifferentTimeZones
} from '../../../../util/appUtils';
import SearchModalSingle from './searchModalSingle';
import AdvancedSearchModal from './advancedSearchModal';
import { getEmployee } from '../../../../spaceManagement/spaceService';
import { getEmployeeData, resetEmployeeReport } from '../../../workorderService';
import { getSpaceAllSearchList } from '../../../../helpdesk/ticketService';

const appModels = require('../../../../util/appModels').default;

const { RangePicker } = DatePicker;

const SideFilterEmployeePerformance = () => {
  const dispatch = useDispatch();
  const [statusCollapse, setStatusCollapse] = useState(true);
  const [date, changeDate] = useState(false);
  const [datesValue, setDatesValue] = useState([]);

  const [employeeCollapse, setEmployeeCollapse] = useState(true);
  const [employeeOpen, setEmployeeOpen] = useState(false);
  const [employeeKeyword, setEmployeeKeyword] = useState('');
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [employeeValue, setEmployeeValue] = useState('');

  const [teamCollapse, setTeamCollapse] = useState(true);
  const [teamOpen, setTeamOpen] = useState(false);
  const [teamKeyword, setTeamKeyword] = useState('');
  const [teamOptions, setTeamOptions] = useState([]);
  const [teamValue, setTeamValue] = useState('');
  const [extraModal, setExtraModal] = useState(false);

  const [spaceCollapse, setSpaceCollapse] = useState(true);
  const [spaceOpen, setSpaceOpen] = useState(false);
  const [spaceKeyword, setSpaceKeyword] = useState('');
  const [spaceOptions, setSpaceOptions] = useState([]);
  const [spaceValue, setSpaceValue] = useState([]);

  const [extraMultipleModal, setExtraMultipleModal] = useState(false);
  const [modalName, setModalName] = useState('');
  const [otherFieldValue, setOtherFieldValue] = useState(false);
  const [columns, setColumns] = useState([]);
  const [companyValue, setCompanyValue] = useState(false);
  const [modelValue, setModelValue] = useState('');
  const [fieldName, setFieldName] = useState('');

  const { userInfo } = useSelector((state) => state.user);
  const { spaceInfoList } = useSelector((state) => state.ticket);
  const { employeeList } = useSelector((state) => state.space);
  const {
    teamsInfo,
  } = useSelector((state) => state.equipment);

  const companies = getAllowedCompanies(userInfo);

  useEffect(() => {
    dispatch(resetEmployeeReport());
    dispatch(getTypeId({
      date, employeeValue, teamValue, spaceValue,
    }));
  }, []);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && employeeOpen) {
        await dispatch(getEmployee(companies, appModels.EMPLOYEE, employeeKeyword));
      }
    })();
  }, [userInfo, employeeKeyword, employeeOpen]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && teamOpen) {
        await dispatch(getTeamList(companies, appModels.TEAM, teamKeyword));
      }
    })();
  }, [userInfo, teamOpen, teamKeyword]);

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
    if (teamsInfo && teamsInfo.data && teamsInfo.data.length && teamOpen) {
      setTeamOptions(getArrayFromValuesById(teamsInfo.data, isAssociativeArray(teamValue || []), 'id'));
    } else if (teamsInfo && teamsInfo.loading) {
      setTeamOptions([{ name: 'Loading...' }]);
    } else {
      setTeamOptions([]);
    }
  }, [teamsInfo, teamOpen]);

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
    if (userInfo && userInfo.data && spaceOpen) {
      const keywordTrim = spaceKeyword ? encodeURIComponent(spaceKeyword.trim()) : '';
      dispatch(getSpaceAllSearchList(companies, appModels.SPACE, keywordTrim));
    }
  }, [userInfo, spaceKeyword, spaceOpen]);
  useEffect(() => {
    if ((userInfo && userInfo.data && userInfo.data.company)
      && (date && date.length) && (employeeValue === '') && (spaceValue && spaceValue.length <= 0) && (teamValue === '')) {
      let start = '';
      let end = '';
      const timeZone = userInfo.data.timezone ? userInfo.data.timezone : defaultTimeZone;
      const appModel = 'mro.order';

      if (date && date[0] && date[0] !== null) {
        const dateRangeObj = getDateAndTimeForDifferentTimeZones(userInfo,date[0],date[1] )
        start = dateRangeObj[0];
        end = dateRangeObj[1];
      }
      dispatch(getEmployeeData(companies, appModel, start, end, false, false, false));
    }
  }, [userInfo, date, employeeValue, spaceValue, teamValue]);

  useEffect(() => {
    if ((userInfo && userInfo.data && userInfo.data.company)
      && (date && date.length) && ((employeeValue && employeeValue.id) || (spaceValue && spaceValue.length > 0) || (teamValue && teamValue.id))) {
      const appModel = 'mro.order';
      let start = '';
      let end = '';
      const timeZone = userInfo.data.timezone ? userInfo.data.timezone : defaultTimeZone;
      const employeeValues = (employeeValue);
      const spaceValues = getColumnArrayById(spaceValue, 'id');
      const teamValues = (teamValue);
      if (date && date[0] && date[0] !== null) {
        const dateRangeObj = getDateAndTimeForDifferentTimeZones(userInfo,date[0],date[1] )
        start = dateRangeObj[0];
        end = dateRangeObj[1];
      }
      dispatch(getEmployeeData(companies, appModel, start, end, employeeValues, spaceValues, teamValues));
    }
  }, [userInfo, date, employeeValue, spaceValue, teamValue]);

  const disabledDate = (current) => {
    const tooLate = datesValue && datesValue.length && datesValue[0] && current.diff(datesValue[0], 'days') > 365;
    const tooEarly = datesValue && datesValue.length && datesValue[1] && datesValue[1].diff(current, 'days') > 365;
    const overall = tooLate || (tooEarly || (current && current > moment().endOf('day')));
    return datesValue && datesValue.length ? overall : (current && current > moment().endOf('day'));
  };

  const onDateRangeChange = (dates) => {
    changeDate(dates);
    dispatch(resetEmployeeReport());
    dispatch(getTypeId({
      date: dates, employeeValue, teamValue, spaceValue,
    }));
  };

  const onEmployeeChange = (data) => {
    dispatch(resetEmployeeReport());
    if (data && data.length && data.find((option) => option.name === 'Loading...')) {
      return false;
    }
    setEmployeeValue(data);
    dispatch(getTypeId({
      date, employeeValue: data, teamValue, spaceValue,
    }));
  };

  const onSpaceChange = (data) => {
    if (data && data.length && data.find((option) => option.path_name === 'Loading...')) {
      return false;
    }
    setSpaceValue(data);
    dispatch(getTypeId({
      date, employeeValue, teamValue, spaceValue: data,
    }));
  };

  const onTeamChange = (data) => {
    dispatch(resetEmployeeReport());
    if (data && data.length && data.find((option) => option.name === 'Loading...')) {
      return false;
    }
    setTeamValue(data);
    dispatch(getTypeId({
      date, employeeValue, teamValue: data, spaceValue,
    }));
  };

  const handleResetClick = (e) => {
    e.preventDefault();
    setEmployeeValue('');
    setTeamValue('');
    setSpaceValue([]);
    changeDate(false);
    dispatch(resetEmployeeReport());
    dispatch(getTypeId({
      date: false, employeeValue: '', teamValue: '', spaceValue: [],
    }));
  };

  const showEmployeeModal = () => {
    setModelValue(appModels.EMPLOYEE);
    setFieldName('employees_id');
    setModalName('Employees');
    setOtherFieldValue(false);
    setCompanyValue(companies);
    setExtraModal(true);
    setColumns(['id', 'name', 'work_email']);
  };

  const showTeamModal = () => {
    setModelValue(appModels.TEAM);
    setFieldName('maintenance_team_id');
    setOtherFieldValue(false);
    setModalName('Team List');
    setCompanyValue(companies);
    setExtraModal(true);
    setColumns(['id', 'name']);
  };

  const showSpaceModal = () => {
    setModelValue(appModels.SPACE);
    setFieldName('space_block_id');
    setModalName('Spaces');
    setOtherFieldValue(false);
    setCompanyValue(companies);
    setExtraMultipleModal(true);
    setColumns(['id', 'path_name', 'space_name', 'asset_category_id']);
  };

  const onEmployeeClear = () => {
    setEmployeeKeyword('');
    setEmployeeValue('');
    dispatch(getTypeId({
      date, employeeValue: '', teamValue, spaceValue,
    }));
    setEmployeeOpen(false);
  };

  const onTeamClear = () => {
    setTeamKeyword('');
    setTeamOpen(false);
    setTeamValue('');
    dispatch(getTypeId({
      date, employeeValue, teamValue: '', spaceValue,
    }));
  };

  const onSpaceClear = () => {
    setSpaceKeyword('');
    setSpaceValue([]);
    dispatch(getTypeId({
      date, employeeValue, teamValue, spaceValue: [],
    }));
    setSpaceOpen(false);
  };

  const onEmployeeChangeModal = (data) => {
    dispatch(resetEmployeeReport());
    setEmployeeValue(data);
    dispatch(getTypeId({
      date, employeeValue: data, teamValue, spaceValue,
    }));
  };

  const onTeamChangeModal = (data) => {
    dispatch(resetEmployeeReport());
    setTeamValue(data);
    dispatch(getTypeId({
      date, employeeValue, teamValue: data, spaceValue,
    }));
  };

  const onSpaceChangeModal = (data) => {
    setSpaceValue(data);
    dispatch(getTypeId({
      date, employeeValue, teamValue, spaceValue: data,
    }));
  };

  const onTeamKeywordChange = (event) => {
    setTeamKeyword(event.target.value);
  };
  return (
    <>
      <Row className="m-0">
        <Col md="8" className="p-0">
          <p className="m-0 font-weight-800 collapse-heading">BY DATE FILTER</p>
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
          {!date && (
            <FormFeedback className="text-info m-1 text-info font-tiny display-block">Maximum Date Range upto 365 days</FormFeedback>
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
              onChange={(e, options) => onEmployeeChange(options)}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={employeeOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  value={employeeKeyword}
                  className={((employeeValue && employeeValue.id) || (employeeKeyword && employeeKeyword.length > 0))
                    ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                  placeholder="Search & Select"
                  onChange={(e) => setEmployeeKeyword(e.target.value)}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {employeeList && employeeList.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        <InputAdornment position="end">
                          {((employeeValue && employeeValue.id > 0) || (employeeKeyword && employeeKeyword.length > 0)) && (
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
          </FormGroup>
        </div>
      </Collapse>
      <hr className="mt-2" />
      <Row className="m-0">
        <Col md="8" className="p-0">
          <p className="m-0 font-weight-800 collapse-heading">BY TEAM</p>
        </Col>
        <Col md="4" className="text-right p-0">
          <FontAwesomeIcon className="mr-2 cursor-pointer" onClick={() => { setTeamCollapse(!teamCollapse); }} size="sm" icon={teamCollapse ? faChevronUp : faChevronDown} />
        </Col>
      </Row>
      <Collapse isOpen={teamCollapse}>
        <div>
          <FormGroup>
            <Autocomplete
              filterSelectedOptions
              limitTags={3}
              id="tags-filledteam"
              name="team"
              open={teamOpen}
              size="small"
              onOpen={() => {
                setTeamOpen(true);
                setTeamKeyword('');
              }}
              onClose={() => {
                setTeamOpen(false);
                setTeamKeyword('');
              }}
              value={teamValue}
              loading={teamsInfo && teamsInfo.loading}
              onChange={(e, options) => onTeamChange(options)}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={teamOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={onTeamKeywordChange}
                  value={teamKeyword}
                  className={((teamValue && teamValue.id) || (teamKeyword && teamKeyword.length > 0))
                    ? 'without-padding custom-icons' : 'without-padding custom-icons2'}
                  variant="outlined"
                  placeholder="Search & Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {teamsInfo && teamsInfo.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        <InputAdornment position="end">
                          {((teamValue && teamValue.id) || (teamKeyword && teamKeyword.length > 0)) && (
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={onTeamClear}
                            >
                              <BackspaceIcon fontSize="small" />
                            </IconButton>
                          )}
                          <IconButton
                            aria-label="toggle search visibility"
                            onClick={showTeamModal}
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
          </FormGroup>
        </div>
      </Collapse>
      <hr className="mt-2" />
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
            {(date && date.length) && (spaceInfoList && spaceInfoList.err) && (
              <FormFeedback className="display-block">{generateErrorMessage(spaceInfoList)}</FormFeedback>
            )}
          </FormGroup>
        </div>
      </Collapse>
      <hr className="mt-2" />
      {((date && date.length) || (employeeValue && employeeValue.id) || (teamValue && teamValue.id) || (spaceValue && spaceValue.length)) ? (
        <div aria-hidden="true" className="float-right cursor-pointer mb-4 mr-2 text-info font-weight-800" onClick={handleResetClick} onKeyDown={handleResetClick}>Reset Filters</div>
      ) : ''}
      <Modal size="xl" className="border-radius-50px modal-dialog-centered" isOpen={extraMultipleModal}>
        <ModalHeaderComponent title={modalName} imagePath={false} closeModalWindow={() => { setExtraMultipleModal(false); }} />
        <ModalBody className="mt-0 pt-0">
          <SearchModalSingle
            modelName={modelValue}
            modalName={modalName}
            afterReset={() => { setExtraMultipleModal(false); }}
            onTeamChange={onTeamChangeModal}
            onSpaceChange={onSpaceChangeModal}
            fieldName={fieldName}
            fields={columns}
            company={companyValue}
            otherFieldValue={otherFieldValue}
            oldTeamValues={teamValue}
            oldSpaceValues={spaceValue}
          />
        </ModalBody>
      </Modal>
      <Modal size="xl" className="border-radius-50px modal-dialog-centered" isOpen={extraModal}>
        <ModalHeaderComponent title={modalName} imagePath={false} closeModalWindow={() => { setExtraModal(false); }} />
        <ModalBody className="mt-0 pt-0">
          <AdvancedSearchModal
            modelName={modelValue}
            afterReset={() => { setExtraModal(false); }}
            fieldName={fieldName}
            fields={columns}
            company={companyValue}
            setTeamValue={setTeamValue}
            setEmployeeValue={setEmployeeValue}
          />
        </ModalBody>
      </Modal>
    </>
  );
};

export default SideFilterEmployeePerformance;
