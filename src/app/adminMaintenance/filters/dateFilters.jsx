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
  getWorkorderFilter,
} from '../adminMaintenanceService';

const DateFilters = (props) => {
  const {
    afterReset,
  } = props;
  const dispatch = useDispatch();
  const [customFiltersList, setCustomFilters] = useState([]);

  const {
    workorderFilters,
  } = useSelector((state) => state.bookingWorkorder);

  const handleRadioboxChange = (event) => {
    const { checked, value } = event.target;
    const filters = [{
      key: value, value, label: value, type: 'date',
    }];
    if (checked) {
      setCustomFilters(filters);
      const filterValues = {
        states: workorderFilters && workorderFilters.states ? workorderFilters.states : [],
        teams: workorderFilters && workorderFilters.teams ? workorderFilters.teams : [],
        priorities: workorderFilters && workorderFilters.priorities ? workorderFilters.priorities : [],
        customFilters: filters,
      };
      dispatch(getWorkorderFilter(filterValues));
      if (afterReset) afterReset();
    } else {
      setCustomFilters(customFiltersList.filter((item) => item !== value));
      const filterValues = {
        states: workorderFilters && workorderFilters.states ? workorderFilters.states : [],
        teams: workorderFilters && workorderFilters.teams ? workorderFilters.teams : [],
        priorities: workorderFilters && workorderFilters.priorities ? workorderFilters.priorities : [],
        customFilters: customFiltersList.filter((item) => item !== value),
      };
      dispatch(getWorkorderFilter(filterValues));
      if (afterReset) afterReset();
    }
  };

  const dateFilters = (workorderFilters && workorderFilters.customFilters && workorderFilters.customFilters.length > 0) ? workorderFilters.customFilters : [];

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
