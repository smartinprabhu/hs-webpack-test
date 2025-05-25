/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable prefer-destructuring */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
import React, { useEffect } from 'react';
import {
  Col,
  Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useFormikContext } from 'formik';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';

import {
  InputField,
  DateTimeFieldDefault,
} from '../shared/formFields';
import {
  noSpecialChars, integerKeyPress,
  getDateTimeSeconds,
} from '../util/appUtils';

const VisitorCreate = React.memo((props) => {
  const {
    onNext,
    detailData,
    setFieldValue,
    setFieldTouched,
    formField: {
      nameValue,
      plannedIn,
      mobile,
      email,
    },
  } = props;
  const { values: formValues } = useFormikContext();
  const {
    planned_in,
  } = formValues;

  useEffect(() => {
    setFieldValue('planned_in', new Date());
  }, []);

  useEffect(() => {
    if (detailData) {
      setFieldValue('has_visitor_email', detailData.has_visitor_email);
      setFieldValue('has_visitor_mobile', detailData.has_visitor_mobile);
    }
  }, [detailData]);

  return (
    <>
      <p className="text-center mt-2 mb-0 text-info">
        <FontAwesomeIcon
          color="info"
          className="mr-2"
          size="sm"
          icon={faInfoCircle}
        />
        Enter Visitor Details
      </p>
      <Row>
        <Col md="12" sm="12" lg="12" xs="12">
          <InputField
            name={nameValue.name}
            label={nameValue.label}
            isRequired={nameValue.required}
            type="text"
            customClassName="bg-lightblue"
            labelClassName="m-0"
            formGroupClassName="m-1"
            maxLength="50"
            onKeyPress={noSpecialChars}
          />
        </Col>
        {detailData.has_visitor_mobile && detailData.has_visitor_mobile !== 'None' && (
        <Col md="12" sm="12" lg="12" xs="12">
          <InputField
            name={mobile.name}
            label={mobile.label}
            isRequired={detailData.has_visitor_mobile && detailData.has_visitor_mobile === 'Required'}
            type="text"
            customClassName="bg-lightblue"
            labelClassName="m-0"
            formGroupClassName="m-1"
            maxLength="13"
            onKeyPress={integerKeyPress}
          />
        </Col>
        )}
        {detailData.has_visitor_email && detailData.has_visitor_email !== 'None' && (
        <Col md="12" sm="12" lg="12" xs="12">
          <InputField
            name={email.name}
            label={email.label}
            isRequired={detailData.has_visitor_email && detailData.has_visitor_email === 'Required'}
            type="email"
            customClassName="bg-lightblue"
            labelClassName="m-0"
            formGroupClassName="m-1"
            maxLength="50"
          />
        </Col>
        )}
        <Col md="12" sm="12" lg="12" xs="12">
          <DateTimeFieldDefault
            name={plannedIn.name}
            label={plannedIn.label}
            setFieldValue={setFieldValue}
            setFieldTouched={setFieldTouched}
            placeholder={plannedIn.label}
            disablePastDate
            disableCustom
            noofdays={detailData.close_visit_request_by ? detailData.close_visit_request_by : 0}
            isRequired={plannedIn.required}
            className="m-1 w-100 bg-lightblue"
            labelClassName="m-0"
            formGroupClassName="m-1"
            defaultValue={planned_in ? moment(new Date(getDateTimeSeconds(planned_in)), 'DD/MM/YYYY HH:mm:ss') : moment(new Date(), 'DD/MM/YYYY HH:mm:ss')}
            currentValue={planned_in ? moment(new Date(getDateTimeSeconds(planned_in)), 'DD/MM/YYYY HH:mm:ss') : moment(new Date(), 'DD/MM/YYYY HH:mm:ss')}
          />
        </Col>
      </Row>
    </>
  );
});

VisitorCreate.propTypes = {
  onNext: PropTypes.func.isRequired,
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  setFieldTouched: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  detailData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
};

export default VisitorCreate;
