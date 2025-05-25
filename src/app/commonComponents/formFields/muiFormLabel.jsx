import React from 'react';
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import { useField } from 'formik';
import { at } from 'lodash';
import { Box } from "@mui/system";

const MuiFormLabel = (props) => {
    const {
        sx, label, checkedvalue, name, control, customvalue, ...rest
    } = props;
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
        setValue(e.target.id);
    }

    let chkValue = false;

    if (field.value === checkedvalue) {
        chkValue = true;
    }
    if (customvalue && customvalue === checkedvalue) {
        chkValue = true;
    }

    return (
        <Box
            sx={sx}
        >
            <FormControlLabel
                value={field.value}
                control={
                    <Radio
                        id={checkedvalue}
                        checked={chkValue}
                        onChange={onChange}
                        {...props}
                    />
                }
                label={label}
            />
            {renderHelperText()}
        </Box>
    )
}
export default MuiFormLabel