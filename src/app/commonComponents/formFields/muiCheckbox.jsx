/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import { at } from 'lodash';
import { useField } from 'formik';
import {
    FormControl,
    FormControlLabel,
    FormHelperText,
} from '@material-ui/core';
import { Checkbox } from '@mui/material';


const MuiCheckboxField = (props) => {
    const { label, isDisabled, ...rest } = props;
    const [field, meta, helper] = useField(props);
    const { setValue } = helper;

    function renderHelperText() {
        const [touched, error] = at(meta, 'touched', 'error');
        let errorText = '';
        if (touched && error) {
            errorText = <FormHelperText>{error}</FormHelperText>;
        }
        return errorText;
    }

    function onChange(e) {
        setValue(e.target.checked);
    }

    return (
        <FormControl {...rest}>
            <FormControlLabel
                value={field.value}
                checked={field && field.value ? field.value : false}
                control={
                    <Checkbox
                        {...field}
                        onChange={onChange}
                        disabled={isDisabled}
                    />
                }
                label={label}
            />
            {renderHelperText()}
        </FormControl>
    );
};

MuiCheckboxField.defaultProps = {
    isDisabled: false,
};

MuiCheckboxField.propTypes = {
    label: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.string,
    ]).isRequired,
    isDisabled: PropTypes.bool,
};

export default MuiCheckboxField
