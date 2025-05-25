/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { at } from 'lodash';
import { Radio } from 'antd';
import { Label, FormFeedback, FormGroup } from 'reactstrap';
import { useField } from 'formik';
import { AddThemeColor } from '../../themes/theme';


const BooleanField = (props) => {
  const {
    label, name, labelClassName, formGroupClassName, setFieldValue,
    setFieldTouched, isRequired, disabled, color, isShowError, ...rest
  } = props;
  const [field, meta] = useField(props);
  const [touched, error, value] = at(meta, 'touched', 'error', 'value');
  const isError = touched && error && true;

  function renderHelperText() {
    let errorValue = '';
    if (touched && error) {
      errorValue = error;
    }
    return errorValue;
  }

  function onChange(e) {
    if (e.target.value) {
      setFieldValue(name, e.target.value);
    } else {
      setFieldValue(name, '');
    }
  }
  
  return (
    <FormGroup className={formGroupClassName || ''} error={isError ? '1' : '0'} onBlur={() => setFieldTouched(name, true)}>
      <Label style={{ fontSize: '11px', color: 'rgba(0, 0, 0, 0.6)' }} className={labelClassName || ''} for={name}>
        {label}
        {isRequired && (<span className="ml-1 text-danger">*</span>)}
      </Label>
      <br />
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Radio.Group
          onChange={(e) => onChange(e)}
          defaultValue={value}
          disabled={disabled}
          buttonStyle="solid"
          {...rest}
        >
          <Radio.Button
            value="Yes"
            style={{
              background: value === 'Yes' ? `${AddThemeColor({}).color}` : '',
              //color: value === 'Yes' ? `${AddThemeColor({}).color} !important` : '',
            }}
          >
            Yes
          </Radio.Button>

          <Radio.Button
            value="No"
            style={{
              background: value === 'No' ? `${AddThemeColor({}).color}` : '',
              //color: value === 'No' ? `${AddThemeColor({}).color} !important` : '',
            }}
          >
            No
          </Radio.Button>
        </Radio.Group>
      </div>
      {!isShowError && (
        <FormFeedback className="display-block">{renderHelperText()}</FormFeedback>
      )}
    </FormGroup>
  );
};

BooleanField.defaultProps = {
  labelClassName: false,
  formGroupClassName: false,
  isRequired: false,
  isShowError: false,
};

BooleanField.propTypes = {
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
  isRequired: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
  isShowError: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
    PropTypes.number,
  ]),
};

export default BooleanField;
