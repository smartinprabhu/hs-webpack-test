/* eslint-disable no-unused-expressions */
/* eslint-disable react/jsx-props-no-spreading */
import { TextBoxComponent, FormValidator } from '@syncfusion/ej2-react-inputs';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { ComboBoxComponent } from '@syncfusion/ej2-react-dropdowns';
import React, { useState } from 'react';
import {
  Col,
  Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
  getEmployeeFilters,
} from '../employeeService';
import filtersFields from './filtersFields.json';

const Filters = (props) => {
  const {
    afterReset, setOffset, setPage,
  } = props;
  const dispatch = useDispatch();
  const [initialState, setInitialState] = useState({
    fieldName: '',
    fieldValue: '',
  });
  const [customFiltersList, setCustomFilters] = useState([]);

  const {
    employeeFilters,
  } = useSelector((state) => state.employee);

  const formObject = new FormValidator('#form1');
  const fields = { text: 'label', value: 'value' };

  const onSubmit = () => {
    formObject.validate();
    if (setOffset) {
      setOffset(0);
    }
    if (setPage) {
      setPage(1);
    }
    const filters = [{
      key: initialState.fieldName, value: encodeURIComponent(initialState.fieldValue), type: 'text',
    }];
    setCustomFilters([...customFiltersList, ...filters]);
    const states = employeeFilters && employeeFilters.statuses ? employeeFilters.statuses : [];
    const customFilters = [...customFiltersList, ...filters];
    setTimeout(() => {
      dispatch(getEmployeeFilters(states, customFilters));
    }, 500);
    if (afterReset) afterReset();
  };
  const HtmlAttributes ={maxlength:'50'}
  return (
    <Row>
      <div className="inputForm">
        <form id="form1">
          <div className="form-group">
            <div className="inputs">
              <Col md="12" sm="12" lg="12" xs="12">
                <ComboBoxComponent
                  className="p-2 iconChange"
                  dataSource={filtersFields.fields}
                  fields={fields}
                  name="fieldName"
                  value={initialState.fieldName}
                  htmlAttributes={HtmlAttributes}
                  placeholder="Select Feild"
                  label="Field"
                  onChange={(event) => setInitialState({ ...initialState, fieldName: event.value })}
                  popupHeight="220px"
                  floatLabelType="Auto"
                />
              </Col>
            </div>
            <div>
              <Col md="12" sm="12" lg="12" xs="12">
                <TextBoxComponent
                  className="p-2"
                  type="text"
                  name="fieldValue"
                  label="Value"
                  value={initialState.fieldValue}
                  placeholder="value"
                  htmlAttributes={HtmlAttributes}
                  floatLabelType="Auto"
                  onChange={(event) => setInitialState({ ...initialState, fieldValue: event.value })}
                  onKeyPress={(event) => { event.charCode === 37 ? event.preventDefault() : true; }}
                />
              </Col>
            </div>
          </div>
        </form>
        <hr />
        <ButtonComponent className="float-right" cssClass="e-danger" disabled={!initialState.fieldName || !initialState.fieldValue} onClick={onSubmit} type="submit">Search</ButtonComponent>
      </div>
    </Row>
  );
};

Filters.propTypes = {
  afterReset: PropTypes.func.isRequired,
  setOffset: PropTypes.func.isRequired,
  setPage: PropTypes.func,
};

Filters.defaultProps = {
  setPage: undefined,
};

export default Filters;
