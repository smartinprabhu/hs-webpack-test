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

const DateTimeFieldDefault = (props) => {
  const {
    label,
    name,
    labelClassName,
    setFieldValue,
    setFieldTouched,
    readOnly,
    formGroupClassName,
    isRequired,
    isRequiredSymbol,
    isShowError,
    disablePastDate,
    disableCustom,
    disableCustomEqual,
    noofdays,
    subnoofdays,
    currentValue,
    customClassName,
    disableFuture,
    ...rest
  } = props;
  // eslint-disable-next-line no-unused-vars
  const [field, meta] = useField(props);
  const [touched, error] = at(meta, 'touched', 'error', 'value');
  const isError = touched && error && true;

  function renderHelperText() {
    let errorValue = '';
    if (touched && !currentValue && isRequired) {
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

  function disableDateday(current) {
    let disable = false;
    if (!disableCustom && !disableCustomEqual) {
      disable = current && current < moment().subtract(1, 'day').endOf('day');
      if (disableFuture) {
        disable = current && current > moment().endOf('day');
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
        format="DD/MM/YYYY HH:mm:ss"
        // value={defaultValue ? moment(defaultValue, 'DD/MM/YYYY HH:mm:ss') : ''}
        className={customClassName ? `${customClassName} w-100` : 'w-100'}
        onChange={onChange}
        disabledDate={disablePastDate ? disableDateday : ''}
        disabled={readOnly}
        showTime
        {...rest}
      />
      <FormFeedback className="display-block">{renderHelperText()}</FormFeedback>
    </FormGroup>
  );
};

DateTimeFieldDefault.defaultProps = {
  labelClassName: false,
  formGroupClassName: false,
  isRequired: false,
  disablePastDate: false,
  currentValue: false,
  disableCustom: false,
  disableCustomEqual: false,
  noofdays: 0,
  subnoofdays: 0,
  customClassName: false,
  disableFuture: false,
};

DateTimeFieldDefault.propTypes = {
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
  currentValue: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
    PropTypes.instanceOf(Date),
  ]),
  disablePastDate: PropTypes.oneOfType([
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
  customClassName: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
  disableFuture: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
};

export default DateTimeFieldDefault;
