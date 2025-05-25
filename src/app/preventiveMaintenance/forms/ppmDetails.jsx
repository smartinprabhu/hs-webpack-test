/* eslint-disable import/no-unresolved */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Row, Col, Label, FormFeedback,
} from 'reactstrap';
import {
  TextField, CircularProgress, FormHelperText, FormControl,
} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { ThemeProvider, makeStyles } from '@material-ui/core/styles';
import { useFormikContext } from 'formik';
import { Autocomplete } from '@material-ui/lab';
import { InputField, DateTimeField, CheckboxField } from '@shared/formFields';

import { getHourlyConfiguration } from '../ppmService';
import {
  decimalKeyPress, getDateTimeSeconds, getAllowedCompanies, isArrayColumnExists, getColumnArrayById, getArrayFromValuesById, generateErrorMessage,
} from '../../util/appUtils';
import {
  getVendorTags, resetVendorTags,
} from '../../purchase/purchaseService';
import theme from '../../util/materialTheme';

const appModels = require('../../util/appModels').default;

const useStyles = makeStyles((themeStyle) => ({
  margin: {
    marginBottom: themeStyle.spacing(1.25),
    width: '100%',
  },
}));

const PpmDetails = (props) => {
  const {
    setFieldValue,
    setFieldTouched,
    type,
    editId,
    formField: {
      startingDate,
      endDate,
      Duration,
      Hourly,
      HourlyConfiguration,
    },
  } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const { values: formValues } = useFormikContext();
  const {
    start_datetime, duration, stop_datetime, hours_ids, is_hourly,
  } = formValues;

  const [spaceOpen, setSpaceOpen] = useState(false);
  const [showError, setShowError] = useState(false);

  const { userInfo } = useSelector((state) => state.user);
  const { hourlyList } = useSelector((state) => state.ppm);
  const companies = getAllowedCompanies(userInfo);
  const { vendorTags } = useSelector((state) => state.purchase);

  const isInspection = !!(type && type === 'Inspection');

  useEffect(() => {
    if (userInfo && userInfo.data) {
      dispatch(resetVendorTags());
    }
  }, [userInfo]);

  useEffect(() => {
    if (editId && hours_ids && hours_ids.length && hours_ids.length > 0) {
      const hourlyId = hours_ids;
      if (hourlyId) {
        dispatch(getVendorTags(hourlyId, appModels.PPMCALENDARHOURS));
      }
    }
  }, [editId]);

  useEffect(() => {
    if (vendorTags && vendorTags.data && vendorTags.data.length > 0) {
      setFieldValue('hours_ids', vendorTags.data);
    }
  }, [vendorTags]);

  useEffect(() => {
    (async () => {
      if (userInfo && userInfo.data && spaceOpen) {
        await dispatch(getHourlyConfiguration(companies, appModels.PPMCALENDARHOURS));
      }
    })();
  }, [userInfo, spaceOpen]);

  useEffect(() => {
    if (start_datetime && duration) {
      const dt = new Date(start_datetime);
      const endDateAdd = dt.setTime(dt.getTime() + (duration * 60 * 60 * 1000));
      setFieldValue('stop_datetime', new Date(endDateAdd));
    }
  }, [start_datetime, duration]);

  function getDifferece(date2) {
    const date1 = new Date();
    const Difference_In_Time = date2.getTime() - date1.getTime();
    const Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    return Difference_In_Days;
  }

  let hourlyOptions = [];

  if (hourlyList && hourlyList.loading) {
    hourlyOptions = [{ name: 'Loading..' }];
  }
  if (hourlyList && hourlyList.data) {
    hourlyOptions = hourlyList.data;
  }

  function isAssociativeArray(arr) {
    let result = arr;
    if (isArrayColumnExists(arr, 'id')) {
      result = getColumnArrayById(arr, 'id');
    }
    return result;
  }

  return (
    <>
      <h5 className="mb-2 mt-2">{isInspection ? 'Inspection Details' : 'PPM Details'}</h5>
      <ThemeProvider theme={theme}>
        <Row>
          <Col xs={12} sm={6} md={6} lg={6}>
            <DateTimeField
              name={startingDate.name}
              label={startingDate.label}
              isRequired={startingDate.required}
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              placeholder={startingDate.label}
              disablePastDate
              defaultValue={start_datetime ? new Date(getDateTimeSeconds(start_datetime)) : ''}
            />
          </Col>
          <Col xs={12} sm={6} md={6} lg={6}>
            <InputField name={Duration.name} label={Duration.label} type="text" onKeyPress={decimalKeyPress} />
          </Col>
          <Col xs={12} sm={6} md={6} lg={6}>
            <DateTimeField
              name={endDate.name}
              label={endDate.label}
              isRequired={endDate.required}
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              placeholder={endDate.label}
              disablePastDate
              disableCustom
              subnoofdays={start_datetime ? getDifferece(new Date(start_datetime)) : 0}
              defaultValue={stop_datetime ? new Date(stop_datetime) : ''}
            />
          </Col>
          {isInspection && (
            <>
              <Col xs={12} sm={6} md={6} lg={6}>
                <br />
                <CheckboxField
                  name={Hourly.name}
                  label={Hourly.label}
                />
              </Col>
              <Col xs={12} sm={6} md={6} lg={6} />
              {is_hourly && (
                <Col xs={12} sm={6} md={6} lg={6}>
                  <FormControl className={classes.margin}>
                    <Label for={HourlyConfiguration.name}>
                      {HourlyConfiguration.label}
                      {' '}
                      <span className="ml-1 text-danger">*</span>
                    </Label>
                    <Autocomplete
                      multiple
                      filterSelectedOptions
                      limitTags={3}
                      id="tags-filled"
                      className="bg-white"
                      name={HourlyConfiguration.name}
                      label={HourlyConfiguration.label}
                      open={spaceOpen}
                      value={hours_ids && hours_ids.length > 0 ? hours_ids : []}
                      defaultValue={vendorTags && vendorTags.data ? vendorTags.data : []}
                      size="small"
                      onOpen={() => {
                        setSpaceOpen(true);
                      }}
                      onClose={() => {
                        setSpaceOpen(false);
                      }}
                      loading={(hourlyList && hourlyList.loading)}
                      options={hourlyOptions ? getArrayFromValuesById(hourlyOptions, isAssociativeArray(hours_ids || []), 'id') : []}
                      getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                      onChange={(e, data) => { setFieldValue('hours_ids', data); setShowError(false); }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          className="without-padding"
                          placeholder="Select"
                          onBlur={() => setShowError(true)}
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {((hourlyList && hourlyList.loading) || (vendorTags && vendorTags.loading)) ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                    />
                  </FormControl>
                  {(is_hourly && showError && ((hours_ids && hours_ids.length <= 0) || hours_ids === '')
                    && hourlyList && !hourlyList.err) && (<FormFeedback className="display-block m-0">{HourlyConfiguration.requiredErrorMsg}</FormFeedback>)}
                  {(hourlyList && hourlyList.err) && (<FormHelperText className="m-0"><span className="text-danger">{generateErrorMessage(hourlyList)}</span></FormHelperText>)}
                </Col>
              )}
            </>
          )}
        </Row>
      </ThemeProvider>
    </>
  );
};

PpmDetails.propTypes = {
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  setFieldTouched: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  type: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  editId: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),
};

PpmDetails.defaultProps = {
  type: false,
  editId: undefined,
};

export default PpmDetails;
