/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable camelcase */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Col, Row, Label,
} from 'reactstrap';
import { useSelector } from 'react-redux';
import { useFormikContext } from 'formik';
import { Autocomplete } from '@material-ui/lab';
import {
  TextField, CircularProgress, FormHelperText, FormControl,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { CheckboxField, InputField, FormikAutocomplete } from '@shared/formFields';
import {
  integerKeyPress, generateErrorMessage, getArrayFromValuesById, isArrayColumnExists,
  getColumnArrayById,
} from '../../../../util/appUtils';
import siteConfigureData from '../../data/siteConfigureData.json';

const useStyles = makeStyles((theme) => ({
  margin: {
    marginBottom: theme.spacing(1.25),
    width: '100%',
  },
}));

const EmployeeConfiguration = (props) => {
  const {
    setFieldValue,
    formField: {
      requireAttendance,
      attendanceWithFaceDetection,
      attendanceSource,
      otpValidityPeriod,
      validDomains,
      allowUserRegistrationWithValidDomain,
      spaceNeighbourIds,
    },
  } = props;
  const classes = useStyles();
  const [asOpen, setAsOpen] = useState(false);
  const [open, setOpen] = useState(false);

  const { values: formValues } = useFormikContext();
  const {
    attendance_source, space_neighbour_ids,
  } = formValues;

  const {
    employeeNeighbours, neighbourSpacesInfo,
  } = useSelector((state) => state.setup);

  function isAssociativeArray(arr) {
    let result = arr;
    if (isArrayColumnExists(arr, 'id')) {
      result = getColumnArrayById(arr, 'id');
    }
    return result;
  }

  const attendSourceLabel = attendance_source && siteConfigureData && siteConfigureData.customAttendanceSources
  && siteConfigureData.customAttendanceSources[attendance_source] ? siteConfigureData.customAttendanceSources[attendance_source].label : '';

  return (
    <Row>
      <Col xs={12} sm={6} lg={6} md={6}>
        <h6>Employee Registration</h6>
        <Col xs={12} sm={12} lg={12} md={12}>
          <CheckboxField
            name={requireAttendance.name}
            label={requireAttendance.label}
          />
        </Col>
        <Col xs={12} sm={12} lg={12} md={12}>
          <CheckboxField
            name={attendanceWithFaceDetection.name}
            label={attendanceWithFaceDetection.label}
          />
        </Col>
        <Col sm="12" md="12" xs="12" lg="12">
          <FormikAutocomplete
            name={attendanceSource.name}
            label={attendanceSource.label}
            labelClassName="font-weight-500"
            oldValue={attendSourceLabel || ''}
            value={attendance_source && attendance_source.label ? attendance_source.label : attendSourceLabel}
            open={asOpen}
            size="small"
            onOpen={() => {
              setAsOpen(true);
            }}
            onClose={() => {
              setAsOpen(false);
            }}
            getOptionSelected={(option, value) => option.label === value.label}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
            options={siteConfigureData.attendanceSources}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                className="bg-white without-padding"
                placeholder="Search & Select"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </Col>
      </Col>
      <Col xs={12} sm={6} lg={6} md={6}>
        <h6>More Info</h6>
        <Col xs={12} sm={12} lg={12} md={12}>
          <InputField
            name={otpValidityPeriod.name}
            label={otpValidityPeriod.label}
            labelClassName="font-weight-500"
            onKeyPress={integerKeyPress}
            type="text"
            maxLength="3"
          />
        </Col>
        <Col xs={12} sm={12} lg={12} md={12}>
          <InputField
            name={validDomains.name}
            label={validDomains.label}
            labelClassName="font-weight-500"
            type="url"
            maxLength="50"
          />
        </Col>
        <Col sm="12" md="12" xs="12" lg="12">
          <FormControl className={classes.margin}>
            <Label for={spaceNeighbourIds.name}>
              {spaceNeighbourIds.label}
            </Label>
            <Autocomplete
              multiple
              filterSelectedOptions
              limitTags={3}
              id="tags-filled"
              name={spaceNeighbourIds.name}
              label={spaceNeighbourIds.label}
              open={open}
              size="small"
              onOpen={() => {
                setOpen(true);
              }}
              onClose={() => {
                setOpen(false);
              }}
              loading={(neighbourSpacesInfo && neighbourSpacesInfo.loading) || (employeeNeighbours && employeeNeighbours.loading)}
              options={neighbourSpacesInfo && neighbourSpacesInfo.data ? getArrayFromValuesById(neighbourSpacesInfo.data, isAssociativeArray(space_neighbour_ids), 'id') : []}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.path_name)}
              defaultValue={employeeNeighbours && employeeNeighbours.data ? employeeNeighbours.data : []}
              onChange={(e, data) => setFieldValue('space_neighbour_ids', data)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  placeholder="Search & Select"
                  className="bg-white without-padding"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {(neighbourSpacesInfo && neighbourSpacesInfo.loading) || (employeeNeighbours && employeeNeighbours.loading) ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
            {(neighbourSpacesInfo && neighbourSpacesInfo.err && !neighbourSpacesInfo.loading && !neighbourSpacesInfo.data) && (
            <FormHelperText><span className="text-danger">{generateErrorMessage(neighbourSpacesInfo)}</span></FormHelperText>
            )}
          </FormControl>
        </Col>
        <Col xs={12} sm={12} lg={12} md={12}>
          <CheckboxField
            name={allowUserRegistrationWithValidDomain.name}
            label={allowUserRegistrationWithValidDomain.label}
          />
        </Col>
      </Col>
    </Row>
  );
};

EmployeeConfiguration.propTypes = {
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default EmployeeConfiguration;
