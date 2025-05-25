/* eslint-disable consistent-return */
/* eslint-disable no-plusplus */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { at } from 'lodash';
import { DatePicker } from 'antd';
import { Label, FormFeedback, FormGroup } from 'reactstrap';
import { useField } from 'formik';
import moment from 'moment';

const DateTimeFieldSingle = (props) => {
  const {
    label,
    name,
    labelClassName,
    setFieldValue,
    setFieldTouched,
    readOnly,
    defaultValue,
    formGroupClassName,
    isRequired,
    isRequiredSymbol,
    isShowError,
    disablePastDate,
    disabledDateTime,
    disableCustom,
    disableFuture,
    disableCustomEqual,
    noofdays,
    subnoofdays,
    endDate,
    isNoEnd,
    startDate,
    dateFormat,
    isTwoDays,
    disabledStartTime,
    disabledEndTime,
    customClassName,
    ...rest
  } = props;
  const [meta] = useField(props);
  const [touched, error] = at(meta, 'touched', 'error', 'value');
  const isError = touched && error && true;

  function renderHelperText() {
    let errorValue = '';
    if (touched && !defaultValue && isRequired) {
      errorValue = `${label} is required`;
    }
    return errorValue;
  }

  function onChange(date) {
    if (date) {
      setFieldValue(name, date);
    } else {
      setFieldValue(name, '');
    }
  }

  const disabledTime = (current) => {
    if (disabledStartTime && disabledEndTime) {
      return {
        disabledHours: () => {
          const hours = [];
          for (let i = 0; i < 24; i++) {
            hours.push(i);
          }
          return hours.filter((hour) => hour < moment(disabledStartTime).hour() || hour >= moment(disabledEndTime).hour());
        },
        disabledMinutes: (selectedHour) => {
          const minutes = [];
          for (let i = 0; i < 60; i++) {
            minutes.push(i);
          }
          if (selectedHour === moment(disabledStartTime).hour()) {
            return minutes.filter((minute) => minute < moment(disabledStartTime).minute());
          }
          if (selectedHour === moment(disabledEndTime).hour()) {
            return minutes.filter((minute) => minute > moment(disabledEndTime).minute());
          }
          return [];
        },
      };
    }
  };

  const disabledTime1 = (current) => {
    if (disabledStartTime && disabledEndTime && (moment(current).format('YYYY-MM-DD') === moment(disabledStartTime).format('YYYY-MM-DD')) && !(moment(current).format('YYYY-MM-DD') === moment(disabledEndTime).format('YYYY-MM-DD'))) {
      return {
        disabledHours: () => {
          const hours = [];
          for (let i = 0; i < 24; i++) {
            hours.push(i);
          }
          return hours.filter((hour) => hour < moment(disabledStartTime).hour());
        },
        disabledMinutes: (selectedHour) => {
          const minutes = [];
          for (let i = 0; i < 60; i++) {
            minutes.push(i);
          }
          if (selectedHour === moment(disabledStartTime).hour()) {
            return minutes.filter((minute) => minute < moment(disabledStartTime).minute());
          }
          return [];
        },
      };
    } if (disabledEndTime && !(moment(current).format('YYYY-MM-DD') === moment(disabledStartTime).format('YYYY-MM-DD')) && moment(current).format('YYYY-MM-DD') === moment(disabledEndTime).format('YYYY-MM-DD')) {
      return {
        disabledHours: () => {
          const hours = [];
          for (let i = 0; i < 24; i++) {
            hours.push(i);
          }
          return hours.filter((hour) => hour >= moment(disabledEndTime).hour());
        },
        disabledMinutes: (selectedHour) => {
          const minutes = [];
          for (let i = 0; i < 60; i++) {
            minutes.push(i);
          }
          if (selectedHour === moment(disabledEndTime).hour()) {
            return minutes.filter((minute) => minute > moment(disabledEndTime).minute());
          }
          return [];
        },
      };
    } if (disabledStartTime && disabledEndTime && !(moment(current).format('YYYY-MM-DD') === moment(disabledEndTime).format('YYYY-MM-DD')) && !(moment(current).format('YYYY-MM-DD') === moment(disabledStartTime).format('YYYY-MM-DD'))) {
      return {
        disabledHours: () => {
          const hours = [];
          for (let i = 0; i < 24; i++) {
            hours.push(i);
          }
          return [];
        },
        disabledMinutes: (selectedHour) => {
          const minutes = [];
          for (let i = 0; i < 60; i++) {
            minutes.push(i);
          }
          return [];
        },
      };
    }
  };

  function disableDateday(current) {
    let disable = false;
    if (startDate && endDate && !isNoEnd) {
      let endCalDate = moment(current).format('YYYY-MM-DD') > moment(endDate).format('YYYY-MM-DD');
      if (isTwoDays) {
        endCalDate = moment(current).format('YYYY-MM-DD') > moment(endDate).format('YYYY-MM-DD');
      }
      disable = current && (moment(current).format('YYYY-MM-DD') < moment(startDate).format('YYYY-MM-DD') || endCalDate);
    } else if (isNoEnd) {
      disable = current && moment(current).format('YYYY-MM-DD') < moment(startDate).format('YYYY-MM-DD');
    }
    return disable;
  }

  return (
    <FormGroup className={formGroupClassName || ''} error={isError} onBlur={() => setFieldTouched(name, true)}>
      <Label className={labelClassName || ''} for={name}>
        {label}
        {(isRequired || isRequiredSymbol) && (<span className="ml-1 text-danger">*</span>)}
      </Label>
      <br />
      <DatePicker
        format={dateFormat || 'DD/MM/YYYY HH:mm:ss'}
        value={defaultValue ? moment(defaultValue, dateFormat || 'DD/MM/YYYY HH:mm:ss') : ''}
        className={customClassName ? `${customClassName} w-100` : 'w-100'}
        onChange={onChange}
        disabledDate={disableDateday}
        disabledTime={isTwoDays ? disabledTime1 : disabledTime}
        disabled={readOnly}
        showTime={{
          hideDisabledOptions: true,
        }}
        {...rest}
      />
      <FormFeedback className="display-block">{renderHelperText()}</FormFeedback>
    </FormGroup>
  );
};

DateTimeFieldSingle.defaultProps = {
  labelClassName: false,
  formGroupClassName: false,
  isRequired: false,
  defaultValue: false,
  disablePastDate: false,
  disabledDateTime: false,
  disableCustom: false,
  disableCustomEqual: false,
  noofdays: 0,
  subnoofdays: 0,
  endDate: false,
  startDate: false,
  disableFuture: false,
  customClassName: false,
  dateFormat: '',
};

DateTimeFieldSingle.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  setFieldTouched: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  labelClassName: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
  formGroupClassName: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
  defaultValue: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
    PropTypes.instanceOf(Date),
  ]),
  disablePastDate: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
    PropTypes.instanceOf(Date),
  ]),
  disabledDateTime: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
    PropTypes.instanceOf(Date),
  ]),
  disableCustom: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
    PropTypes.instanceOf(Date),
  ]),
  disableCustomEqual: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
    PropTypes.instanceOf(Date),
  ]),
  noofdays: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
    PropTypes.number,
  ]),
  subnoofdays: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
    PropTypes.number,
  ]),
  isRequired: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
  endDate: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
  startDate: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
  customClassName: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
  disableFuture: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
  dateFormat: PropTypes.string,
};

export default DateTimeFieldSingle;