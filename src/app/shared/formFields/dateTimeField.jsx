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

const DateTimeField = (props) => {
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
    startDate,
    dateFormat,
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

  function disabledTime(current) {
    if (disableCustomEqual && startDate && moment(current).format('YYYY-MM-DD') === moment(startDate).format('YYYY-MM-DD')) {
      return {
        disabledHours: () => {
          const hours = [];
          for (let i = 0; i < 24; i++) {
            hours.push(i);
          }
          return hours.filter((hour) => hour < moment(startDate).hour());
        },
        disabledMinutes: (selectedHour) => {
          const minutes = [];
          for (let i = 0; i < 60; i++) {
            minutes.push(i);
          }
          if (selectedHour === moment(startDate).hour()) {
            return minutes.filter((minute) => minute < moment(startDate).minute());
          }
          return [];
        },
        disabledSeconds: (selectedHour, selectedMinute) => {
          const seconds = [];
          for (let i = 0; i < 60; i++) {
            seconds.push(i);
          }
          if (selectedHour === moment(startDate).hour() && selectedMinute === moment(startDate).minute()) {
            return seconds.filter((second) => second < moment(startDate).second());
          }
          return [];
        },
      };
    } if (moment().isSame(current, 'day') && !startDate) {
      return {
        disabledHours: () => {
          const hours = [];
          for (let i = 0; i < 24; i++) {
            hours.push(i);
          }
          return hours.filter((hour) => hour > moment().hour());
        },
        disabledMinutes: (selectedHour) => {
          const minutes = [];
          for (let i = 0; i < 60; i++) {
            minutes.push(i);
          }
          if (selectedHour === moment().hour()) {
            return minutes.filter((minute) => minute > moment().minute());
          }
          return [];
        },
        disabledSeconds: (selectedHour, selectedMinute) => {
          const seconds = [];
          for (let i = 0; i < 60; i++) {
            seconds.push(i);
          }
          if (selectedHour === moment().hour() && selectedMinute === moment().minute()) {
            return seconds.filter((second) => second > moment().second());
          }
          return [];
        },
      };
    }
  }

  function disableDateday(current) {
    let disable = false;
    if (!disableCustom && !disableCustomEqual) {
      disable = current && current < moment().subtract(1, 'day').endOf('day');
      if (disableFuture) {
        disable = current && current > moment().endOf('day');
      }
      if (endDate) {
        disable = current && (current < moment().subtract(1, 'day').endOf('day') || current > moment(endDate));
      }
      if (startDate) {
        disable = current && (current < moment(startDate).endOf('day'));
      }
      if (startDate && endDate) {
        disable = current && (current < moment(startDate).subtract(1, 'day').endOf('day') || current > moment(endDate));
      }
    } else if (disableCustom && noofdays) {
      disable = current && (current > moment().add(noofdays, 'days').endOf('day') || current < moment().subtract(1, 'day').endOf('day'));
    } else if (disableCustom && subnoofdays) {
      const days = Math.abs(subnoofdays);
      if (Math.sign(subnoofdays) === -1) {
        disable = current && (current < moment().subtract(days, 'days').endOf('day'));
      } else if (Math.sign(subnoofdays) === 1 || Math.sign(subnoofdays) === 0) {
        disable = current && (current < moment().add(days, 'days').endOf('day'));
      }
    } else if (disableCustomEqual && subnoofdays) {
      const days = Math.abs(subnoofdays);
      if (Math.sign(subnoofdays) === -1) {
        disable = current && (current < moment().subtract(days + 1, 'days').endOf('day'));
      } else if (Math.sign(subnoofdays) === 0) {
        disable = current && (current < moment().add(days, 'days').endOf('day'));
      }
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
        disabledDate={disablePastDate ? disableDateday : ''}
        disabledTime={disabledDateTime ? disabledTime : ''}
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

DateTimeField.defaultProps = {
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

DateTimeField.propTypes = {
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

export default DateTimeField;
