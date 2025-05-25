/* eslint-disable radix */
import React, { useState } from 'react';
import {
  Input,
  Col,
  Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import filtersFields from './filtersFields.json';
import {
  getEquipmentFilters,
} from '../../assets/equipmentService';

const DateFilters = (props) => {
  const {
    afterReset,
  } = props;
  const dispatch = useDispatch();
  const [customFiltersList, setCustomFilters] = useState([]);

  const {
    equipmentFilters,
  } = useSelector((state) => state.equipment);

  const handleRadioboxChange = (event) => {
    const { checked, value } = event.target;
    const filters = [{
      key: value, value, label: value, type: 'date',
    }];
    if (checked) {
      setCustomFilters(filters);
      const states = equipmentFilters && equipmentFilters.statuses ? equipmentFilters.statuses : [];
      const categories = equipmentFilters
        && equipmentFilters.categories
        ? equipmentFilters.categories : [];
      const customFilters = filters;
      dispatch(getEquipmentFilters(states, categories, customFilters));
      if (afterReset) afterReset();
    } else {
      setCustomFilters(customFiltersList.filter((item) => item !== value));
      const states = equipmentFilters && equipmentFilters.statuses ? equipmentFilters.statuses : [];
      const categories = equipmentFilters
        && equipmentFilters.categories
        ? equipmentFilters.categories : [];
      const customFilters = customFiltersList.filter((item) => item !== value);
      dispatch(getEquipmentFilters(states, categories, customFilters));
      if (afterReset) afterReset();
    }
  };

  const dateFilters = (equipmentFilters
    && equipmentFilters.customFilters
    && equipmentFilters.customFilters.length > 0)
    ? equipmentFilters.customFilters : [];

  return (
    <Row>
      <Col md="12" sm="12" lg="12" xs="12">
        <div className="p-3 ml-2">
          {filtersFields && filtersFields.dateFilters.map((df) => (
            <p className="mb-2 font-weight-800" key={df.label}>
              <Input
                type="radio"
                value={df.label}
                name="datefilter"
                checked={dateFilters.some((selectedValue) => selectedValue.label === df.label)}
                onChange={handleRadioboxChange}
              />
              {' '}
              {df.label}
            </p>
          ))}
        </div>
      </Col>
    </Row>
  );
};

DateFilters.propTypes = {
  afterReset: PropTypes.func.isRequired,
};

export default DateFilters;
