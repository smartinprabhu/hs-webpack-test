/* eslint-disable camelcase */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable import/no-unresolved */
import React from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';
import {
  Row, Col, FormGroup, Label, Input,
} from 'reactstrap';
import { ThemeProvider } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import { DateTimeField } from '@shared/formFields';
import { useFormikContext } from 'formik';
import { getDateTimeSeconds } from '../../util/appUtils';
import theme from '../../util/materialTheme';

const ResolutionForm = (props) => {
  const {
    setFieldValue,
    setFieldTouched,
    editId,
    formField: {
      expectedClosureDate,
      attendedOn,
      actionTaken,
      closedOn,
    },
  } = props;
  const { values: formValues } = useFormikContext();
  const {
    closed_on, expexted_closure_date, attended_on, action_taken, incident_date,
  } = formValues;
  const { trackerDetails } = useSelector((state) => state.breakdowntracker);
  const onActionChange = (data) => {
    setFieldValue('action_taken', DOMPurify.sanitize(data.target.value));
  };

  const closeDateDisable = trackerDetails && trackerDetails.data && trackerDetails.data[0] && trackerDetails.data[0].state_id && trackerDetails.data[0].state_id.name === 'Closed';

  function getDifferece(date2) {
    const date1 = new Date();
    const Difference_In_Time = date2.getTime() - date1.getTime();
    const Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    return Difference_In_Days;
  }

  return (
    <>
      <span className="d-inline-block pb-1 font-17 mb-2 font-weight-800 requestorForm-title">Resolution Information</span>
      <ThemeProvider theme={theme}>
        <Row className="mb-3 requestorForm-input">
          <Col xs={12} sm={12} md={12} lg={12}>
            <DateTimeField
              name={expectedClosureDate.name}
              label={expectedClosureDate.label}
              isRequired={expectedClosureDate.required}
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              placeholder={expectedClosureDate.label}
              customClassName="bg-input-blue-small"
              labelClassName="mb-1"
              formGroupClassName="mb-1"
              disablePastDate
              disableCustomEqual
              disabledDateTime
              startDate={incident_date}
              subnoofdays={incident_date ? getDifferece(new Date(incident_date)) : ''}
              defaultValue={expexted_closure_date ? new Date(getDateTimeSeconds(expexted_closure_date)) : ''}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12}>
            <DateTimeField
              name={attendedOn.name}
              label={attendedOn.label}
              isRequired={attendedOn.required}
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              placeholder={attendedOn.label}
              customClassName="bg-input-blue-small"
              labelClassName="mb-1"
              formGroupClassName="mb-1"
              disablePastDate
              defaultValue={attended_on ? new Date(getDateTimeSeconds(attended_on)) : ''}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12}>
            <FormGroup className="mb-1">
              <>
                <Label for={actionTaken.name} className="mb-1">
                  {actionTaken.label}
                </Label>
                <Input
                  name={actionTaken.name}
                  label={actionTaken.label}
                  value={action_taken}
                  onChange={onActionChange}
                  onBlur={onActionChange}
                  type="textarea"
                  rows="1"
                />
              </>
            </FormGroup>
          </Col>
          { /* editId && (
          <Col xs={12} sm={12} md={12} lg={12}>
            <DateTimeField
              name={closedOn.name}
              label={closedOn.label}
              isRequired={closedOn.required}
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              placeholder={closedOn.label}
              customClassName="bg-input-blue-small"
              labelClassName="mb-1"
              disabled={closeDateDisable}
              formGroupClassName="mb-1"
              disablePastDate
              defaultValue={closed_on ? new Date(getDateTimeSeconds(closed_on)) : ''}
            />
          </Col>
          ) */ }
        </Row>
      </ThemeProvider>
    </>
  );
};

ResolutionForm.propTypes = {
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  setFieldTouched: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default ResolutionForm;
