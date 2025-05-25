/* eslint-disable react/jsx-indent */
/* eslint-disable import/no-unresolved */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Row, Col,
} from 'reactstrap';
import { ThemeProvider } from '@material-ui/core/styles';
import { useFormikContext } from 'formik';

import {
  InputField, DateTimeField,
} from '@shared/formFields';
import theme from '../../../util/materialTheme';
import {
  decimalKeyPress, getDateTimeSeconds,
} from '../../../util/appUtils';

const ExpenseForm = (props) => {
  const {
    // editId,
    setFieldValue,
    setFieldTouched,
    formField: {
      consumptionCost,
      unitCost,
      totalCost,
      fromDate,
      toDate,
    },
  } = props;
  const { values: formValues } = useFormikContext();
  const {
    from_date, to_date, consumption, unit_cost, total_cost,
  } = formValues;

  const [consumptionValue, setConsumptionValue] = useState(consumptionCost.name);
  const [unit, setUnit] = useState(unitCost.name);
  const [total, setTotal] = useState(totalCost.name);

  useEffect(() => {
    const totalValue = Number(consumption) * Number(unit_cost);
    if (consumption) {
      setFieldValue('total_cost', totalValue);
    }
    if (unit_cost) {
      setFieldValue('total_cost', totalValue);
    }
    // setTotal(Number(consumptionValue) + Number(unit));
  }, [consumption, unit_cost]);

  function getDifferece(date2) {
    const date1 = new Date();
    const d = date2; // today!
    const x = 1; // go back 5 days!
    d.setDate(d.getDate() - x);
    const Difference_In_Time = d.getTime() - date1.getTime();
    const Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    return Difference_In_Days;
  }
  return (
    <>
    <span className="d-inline-block pb-1 font-17 mb-2 pl-0 font-weight-800">Expenses</span>
      <ThemeProvider theme={theme}>
      <Row className="mb-3 mr-2 ">
      <Col xs={12} sm={6} md={6} lg={6} className="pl-3 m-0">
         <DateTimeField
           name={fromDate.name}
           label={fromDate.label}
           isRequired
           size="small"
           formGroupClassName="mb-1"
           labelClassName="mb-1"
           customClassName="bg-input-blue-small"
           setFieldValue={setFieldValue}
           setFieldTouched={setFieldTouched}
           placeholder={fromDate.label}
           disablePastDate
           defaultValue={from_date ? new Date(getDateTimeSeconds(from_date)) : ''}
         />
      </Col>
         <Col xs={12} sm={6} md={6} lg={6} className="pl-2">
         <DateTimeField
           name={toDate.name}
           label={toDate.label}
           isRequired
           size="small"
           formGroupClassName="mb-1"
           labelClassName="mb-1"
           customClassName="bg-input-blue-small"
           setFieldValue={setFieldValue}
           setFieldTouched={setFieldTouched}
           placeholder={toDate.label}
           disablePastDate
           disableCustom
           subnoofdays={from_date ? getDifferece(new Date(from_date)) : 0}
           defaultValue={to_date ? new Date(getDateTimeSeconds(to_date)) : ''}
         />
         </Col>
          <Col xs={12} sm={6} md={6} lg={6}>
                <InputField
                  name={consumptionCost.name}
                  label={consumptionCost.label}
                  onKeyPress={decimalKeyPress}
                 // onChange={(e) => onConsumptionChange(e)}
                  customClassName="bg-input-blue-small"
                  labelClassName="mb-1"
                  formGroupClassName="mb-1"
                  type="text"
                />
          </Col>
          <Col xs={12} sm={6} md={6} lg={6}>
                <InputField
                  name={unitCost.name}
                  label={unitCost.label}
                  onKeyPress={decimalKeyPress}
                  customClassName="bg-input-blue-small"
                  labelClassName="mb-1"
                  formGroupClassName="mb-1"
                  type="text"
                />
          </Col>
          <Col xs={12} sm={6} md={6} lg={6}>
                <InputField
                  name={total}
                  label={totalCost.label}
                  onKeyPress={decimalKeyPress}
                  defaultValue={total}
                  customClassName="bg-input-blue-small"
                  labelClassName="mb-1"
                  formGroupClassName="mb-1"
                  type="text"
                />
          </Col>
      </Row>
        {/* <Row>
        <Col xs={12} sm={6} md={6} lg={6} />
        <Col xs={12} sm={6} md={6} lg={6}>
            <InputField name={startsAt.name} isRequired label={startsAt.label} type="text" onKeyPress={decimalKeyPress} maxLength="6" placeHolder="0.00" />
        </Col>
        </Row>
        <Row>
        <Col xs={12} sm={6} md={6} lg={6} />
        <Col xs={12} sm={6} md={6} lg={6}>
            <InputField name={durationAt.name} isRequired label={durationAt.label} type="text" onKeyPress={decimalKeyPress} maxLength="6" placeHolder="0.00" />
        </Col>
        </Row>

        <Row>
          <Col xs={12} sm={6} md={6} lg={6}>
            <InputField
              name={descriptionValue.name}
              label={descriptionValue.label}
              isRequired
              formGroupClassName="m-1"
              type="textarea"
              rows="4"
            />
          </Col>
                </Row> */}
      </ThemeProvider>
    </>
  );
};

ExpenseForm.defaultProps = {
  // editId: undefined,
};

ExpenseForm.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  formField: PropTypes.objectOf(PropTypes.object).isRequired,
  setFieldValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  // editId: PropTypes.oneOfType([
  //  PropTypes.object,
  //  PropTypes.string,
  //  PropTypes.number,
  //  PropTypes.bool,
  // ]),
  setFieldTouched: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
};

export default ExpenseForm;
