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
} from 'reactstrap';
import {
  TextField, CircularProgress,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown, faChevronUp,
} from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux';

import {
  getTypeId,
  getInspectionParentSchedulers, getInspectionOrders, resetInspectionOrders,
} from '../../../ppmService';
import {
  generateErrorMessage,
  generateArrayFromInner, defaultTimeZone, getDateAndTimeForDifferentTimeZones
} from '../../../../util/appUtils';
import preventiveActions from '../../../data/preventiveActions.json';

const { RangePicker } = DatePicker;

const SideFilterInspectionNew = () => {
  const dispatch = useDispatch();
  const [statusCollapse, setStatusCollapse] = useState(true);
  const [preventiveCollapse, setPreventiveCollapse] = useState(true);
  const [date, changeDate] = useState(undefined);
  const [datesValue, setDatesValue] = useState([]);
  const [preventiveFor, setPreventiveFor] = useState('e');

  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [setScheduleKeyword] = useState('');
  const [scheduleValue, setScheduleValue] = useState('');
  const [schedulerOptions, setSchedulerOptions] = useState([]);

  const { userInfo } = useSelector((state) => state.user);
  const { ppmParentSchdulers } = useSelector((state) => state.ppm);

  useEffect(() => {
    dispatch(getTypeId({
      preventiveFor, scheduleValue, date,
    }));
  }, []);

  useEffect(() => {
    if (userInfo && userInfo.data && userInfo.data.company && date === undefined) {
      if (userInfo.data.timezone) {
        const timeZoneDate = moment().tz(userInfo.data.timezone).format('YYYY-MM-DD HH:mm:ss');
        const todayDate = (new Date(timeZoneDate));
        changeDate(todayDate);
      }
    }
  }, [userInfo, date]);

  useEffect(() => {
    if (userInfo && userInfo.data && userInfo.data.company && date && date.length) {
      let start = '';
      let end = '';
      const timeZone = userInfo.data.timezone ? userInfo.data.timezone : defaultTimeZone;

      if (date && date[0] && date[0] !== null) {
        const dateRangeObj = getDateAndTimeForDifferentTimeZones(userInfo, date[0],date[1] )
        start = dateRangeObj[0];
        end = dateRangeObj[1];
        dispatch(getInspectionParentSchedulers(start, end));

      }
    }
  }, [userInfo, date]);

  useEffect(() => {
    if (userInfo && userInfo.data && userInfo.data.company && date && date.length && scheduleValue && scheduleValue.id) {
      let start = '';
      let end = '';
      const timeZone = userInfo.data.timezone ? userInfo.data.timezone : defaultTimeZone;

      if (date && date[0] && date[0] !== null) {
        const dateRangeObj = getDateAndTimeForDifferentTimeZones(userInfo, date[0],date[1] )
        start = dateRangeObj[0];
        end = dateRangeObj[1];
      }
      dispatch(getInspectionOrders(start, end, scheduleValue.id));
    }
  }, [userInfo, date, scheduleValue]);

  useEffect(() => {
    if (ppmParentSchdulers && ppmParentSchdulers.data && ppmParentSchdulers.data.maintenance_team && ppmParentSchdulers.data.maintenance_team.length && scheduleOpen) {
      setSchedulerOptions(generateArrayFromInner(ppmParentSchdulers.data.maintenance_team, 'ppm_schedule'));
    } else if (ppmParentSchdulers && ppmParentSchdulers.loading) {
      setSchedulerOptions([{ name: 'Loading...' }]);
    } else {
      setSchedulerOptions([]);
    }
  }, [ppmParentSchdulers, scheduleOpen]);

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
    setSchedulerOptions([]);
    setScheduleValue();
    dispatch(getTypeId({
      preventiveFor, scheduleValue, date: dates,
    }));
  };

  const handleTimeCheckboxChange = (event) => {
    setPreventiveFor(event.target.value);
    dispatch(getTypeId({
      preventiveFor: event.target.value, scheduleValue, date,
    }));
  };

  const onScheduleKeywordChange = (event) => {
    setScheduleKeyword(event.target.value);
  };

  const onScheduleChange = (e, data) => {
    setScheduleValue(data);
    dispatch(getTypeId({
      preventiveFor, scheduleValue: data, date,
    }));
  };

  const handleResetClick = (e) => {
    e.preventDefault();
    setSchedulerOptions([]);
    setScheduleValue();
    setPreventiveFor('e');
    changeDate(undefined);
    dispatch(resetInspectionOrders());
    dispatch(getTypeId({
      preventiveFor: 'e', scheduleValue: '', date: undefined,
    }));
  };

  return (
    <>
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
        </div>
      </Collapse>
      <hr className="mt-2" />
      <Row className="m-0">
        <Col md="8" className="p-0">
          <p className="m-0 font-weight-800 collapse-heading">BY SCHEDULER</p>
        </Col>
        <Col md="4" className="text-right p-0">
          <FontAwesomeIcon className="mr-2 cursor-pointer" onClick={() => { setPreventiveCollapse(!preventiveCollapse); }} size="sm" icon={preventiveCollapse ? faChevronUp : faChevronDown} />
        </Col>
      </Row>
      <Collapse isOpen={preventiveCollapse}>
        <div>
          <FormGroup>
            <Autocomplete
              name="scheduler_id"
              placeholder="Scheduler"
              open={scheduleOpen}
              size="small"
              onOpen={() => {
                setScheduleOpen(true);
                setScheduleKeyword('');
              }}
              onClose={() => {
                setScheduleOpen(false);
                setScheduleKeyword('');
              }}
              value={scheduleValue && scheduleValue.name ? scheduleValue.name : ''}
              disableClearable={!(scheduleValue)}
              onChange={onScheduleChange}
              getOptionSelected={(option, value) => option.name === value.name}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              options={schedulerOptions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={onScheduleKeywordChange}
                  variant="outlined"
                  className="without-padding"
                  placeholder="Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {ppmParentSchdulers && ppmParentSchdulers.loading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
            {(ppmParentSchdulers && ppmParentSchdulers.err) && (
            <FormFeedback className="display-block">{generateErrorMessage(ppmParentSchdulers)}</FormFeedback>
            )}
          </FormGroup>
        </div>
      </Collapse>
      {(preventiveFor !== 'e' || scheduleValue || (date && date.length)) && (
      <div aria-hidden="true" className="float-right cursor-pointer mb-4 mr-2 text-info font-weight-800" onClick={handleResetClick} onKeyDown={handleResetClick}>Reset Filters</div>
      )}
    </>
  );
};

export default SideFilterInspectionNew;
