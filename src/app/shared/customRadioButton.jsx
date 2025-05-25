import React from 'react';
import Radio from '@material-ui/core/Radio';
import PropTypes from 'prop-types';

const { useStyles2 } = require('../util/formClasses');

const CustomRadio = (props) => {
  const classes = useStyles2();
  const {
    value, onChange, name, checked, color, disabled,
  } = props;
  return (
    <Radio disabled={disabled} className={classes.root} value={value} onChange={onChange} name={name} checked={checked} color={color} />
  );
};

CustomRadio.defaultProps = {
  value: undefined,
  onChange: undefined,
  name: undefined,
  disabled: undefined,
  checked: undefined,
  color: undefined,
};

CustomRadio.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  name: PropTypes.string,
  disabled: PropTypes.bool,
  checked: PropTypes.bool,
  color: PropTypes.string,
};

export default CustomRadio;
