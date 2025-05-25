/* eslint-disable import/no-unresolved */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Row, Col,
} from 'reactstrap';
import { useFormikContext } from 'formik';
import { ThemeProvider } from '@material-ui/core/styles';
import { TextField } from '@material-ui/core';

import { InputField, CheckboxField, FormikAutocomplete } from '@shared/formFields';
import preventiveActions from '../../data/preventiveActions.json';
import { integerKeyPress } from '../../../util/appUtils';
import theme from '../../../util/materialTheme';

const ScheduleForm = (props) => {
  const {
    formField: {
      mo,
      tu,
      we,
      th,
      fr,
      sa,
      su,
      atStart,
      atDone,
      atReview,
      Recurrency,
      interval,
      ruleType,
      monthBy,
      dayBy,
      Day,
      enforceTime,
      nfcScanStart,
      nfcScanDone,
      qrScanStart,
      qrScanDone,
    },
  } = props;
  const { values: formValues } = useFormikContext();
  const { recurrency, rrule_type, month_by } = formValues;
  const [rTypeOpen, setRtypeOpen] = useState(false);
  const [monthByOpen, setMonthByOpen] = useState(false);
  const [dayByOpen, setDayByOpen] = useState(false);

  return (
    <>
      <h5 className="mb-2 mt-2">PPM Options</h5>
      <ThemeProvider theme={theme}>
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <span className="font-weight-600 text-info">Recurrent</span>
            <br />
            <CheckboxField
              name={Recurrency.name}
              label={Recurrency.label}
            />
          </Col>
        </Row>
        {recurrency && (
        <Row>
          <Col xs={12} sm={3} md={3} lg={3}>
            <InputField name={interval.name} label={interval.label} type="text" labelClassName="text-info font-weight-600" />
          </Col>
          <Col xs={12} sm={3} md={3} lg={3}>
            <FormikAutocomplete
              name={ruleType.name}
              label={ruleType.label}
              labelClassName="text-info font-weight-600"
              className="bg-white"
              open={rTypeOpen}
              size="small"
              onOpen={() => {
                setRtypeOpen(true);
              }}
              onClose={() => {
                setRtypeOpen(false);
              }}
              getOptionSelected={(option, value) => option.label === value.label}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
              options={preventiveActions.ruleTypes}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  className="without-padding"
                  placeholder="Select"
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
            {(recurrency && rrule_type && rrule_type.value === 'weekly') && (
            <Col xs={12} sm={6} md={6} lg={6}>
              <span className="font-weight-600 text-info">Select Day</span>
              <br />
              <CheckboxField
                name={mo.name}
                label={mo.label}
              />
              <CheckboxField
                name={tu.name}
                label={tu.label}
              />
              <CheckboxField
                name={we.name}
                label={we.label}
              />
              <CheckboxField
                name={th.name}
                label={th.label}
              />
              <CheckboxField
                name={fr.name}
                label={fr.label}
              />
              <CheckboxField
                name={sa.name}
                label={sa.label}
              />
              <CheckboxField
                name={su.name}
                label={su.label}
              />
            </Col>
            )}
            {(recurrency && rrule_type && rrule_type.value === 'monthly') && (
            <Col xs={12} sm={4} md={4} lg={4}>
              <>
                <FormikAutocomplete
                  name={monthBy.name}
                  label={monthBy.label}
                  className="bg-white"
                  open={monthByOpen}
                  size="small"
                  onOpen={() => {
                    setMonthByOpen(true);
                  }}
                  onClose={() => {
                    setMonthByOpen(false);
                  }}
                  getOptionSelected={(option, value) => option.label === value.label}
                  getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                  options={preventiveActions.monthRule}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      className="without-padding"
                      placeholder="Select"
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
                <br />
                {(recurrency && rrule_type && rrule_type.value === 'monthly' && month_by && month_by.value === 'date') && (
                <InputField name={Day.name} label={Day.label} onKeyPress={integerKeyPress} placeholder="Date of month" type="text" />
                )}

                {(recurrency && rrule_type && rrule_type.value === 'monthly' && month_by && month_by.value === 'day') && (
                <FormikAutocomplete
                  name={dayBy.name}
                  label={dayBy.label}
                  className="bg-white"
                  open={dayByOpen}
                  size="small"
                  onOpen={() => {
                    setDayByOpen(true);
                  }}
                  onClose={() => {
                    setDayByOpen(false);
                  }}
                  getOptionSelected={(option, value) => option.label === value.label}
                  getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
                  options={preventiveActions.dayRule}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      className="without-padding"
                      placeholder="Select"
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
                )}

              </>
            </Col>
            )}
        </Row>
        )}
        <hr />
        <Row>
          <Col xs={4} sm={4} md={4} lg={4}>
            <span className="font-weight-600 text-info">Photo Required</span>
            <br />
            <CheckboxField
              name={atStart.name}
              label={atStart.label}
            />
            <CheckboxField
              name={atReview.name}
              label={atReview.label}
            />
            <CheckboxField
              name={atDone.name}
              label={atDone.label}
            />
          </Col>
          <Col xs={4} sm={4} md={4} lg={4}>
            <span className="font-weight-600 text-info">QR Scan</span>
            <br />
            <CheckboxField
              name={qrScanStart.name}
              label={qrScanStart.label}
            />
            <CheckboxField
              name={qrScanDone.name}
              label={qrScanDone.label}
            />
          </Col>
        </Row>
        <hr />
        <Row>
          <Col xs={4} sm={4} md={4} lg={4}>
            <span className="font-weight-600 text-info">Enforce Time</span>
            <br />
            <CheckboxField
              name={enforceTime.name}
              label={enforceTime.label}
            />
          </Col>
          <Col xs={4} sm={4} md={4} lg={4}>
            <span className="font-weight-600 text-info">NFC</span>
            <br />
            <CheckboxField
              name={nfcScanStart.name}
              label={nfcScanStart.label}
            />
            <CheckboxField
              name={nfcScanDone.name}
              label={nfcScanDone.label}
            />
          </Col>
        </Row>
      </ThemeProvider>
    </>
  );
};

ScheduleForm.propTypes = {
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default ScheduleForm;
