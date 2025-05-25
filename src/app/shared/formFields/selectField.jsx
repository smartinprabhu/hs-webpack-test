/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import { at } from 'lodash';
import { useField } from 'formik';
import InputBase from '@material-ui/core/InputBase';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Label } from 'reactstrap';
import {
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
} from '@material-ui/core';

const BootstrapInput = withStyles((theme) => ({
  root: {

  },
  input: {
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #ced4da',
    fontSize: 14,
    padding: '0.375rem 0.75rem',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '&:focus': {
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
}))(InputBase);

const useStyles = makeStyles((theme) => ({
  margin: {
    marginBottom: theme.spacing(1.25),
  },
}));

const SelectField = (props) => {
  const {
    label, name, value, data, ...rest
  } = props;
  const [field, meta] = useField(props);
  const classes = useStyles();
  const { value: selectedValue } = field;
  const [touched, error] = at(meta, 'touched', 'error');
  const isError = touched && error && true;
  function renderHelperText() {
    let errorText;
    if (isError) {
      errorText = <FormHelperText>{error}</FormHelperText>;
    }
    return errorText;
  }

  return (
    <FormControl className={classes.margin} {...rest} error={isError}>
      <Label for={name}>{label}</Label>
      <Select {...field} value={selectedValue || value || ''} input={<BootstrapInput />}>
        {data.map((item) => (
          <MenuItem key={item.label} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
      {renderHelperText()}
    </FormControl>
  );
};

SelectField.defaultProps = {
  value: '',
};

SelectField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.array.isRequired,
};

export default SelectField;
