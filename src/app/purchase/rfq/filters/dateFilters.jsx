/* eslint-disable radix */
import React, { useState } from 'react';
import {
  Input,
  Col,
  Row,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import {
  getVendorFilters,
} from '../../purchaseService';
import filtersFields from './filtersFields.json';

const DateFilters = (props) => {
  const {
    afterReset,
  } = props;
  const dispatch = useDispatch();
  const [customFiltersList, setCustomFilters] = useState([]);

  const {
    vendorFilters,
  } = useSelector((state) => state.purchase);

  const handleRadioboxChange = (event) => {
    const { checked, value } = event.target;
    const filters = [{
      key: value, value, label: value, type: 'date',
    }];
    if (checked) {
      setCustomFilters(filters);
      const oldCustomFilters = vendorFilters && vendorFilters.customFilters ? vendorFilters.customFilters : [];
      const states = vendorFilters && vendorFilters.statuses ? vendorFilters.statuses : [];
      const languages = vendorFilters && vendorFilters.languages ? vendorFilters.languages : [];
      const customFilters = [...oldCustomFilters, ...filters];
      dispatch(getVendorFilters(states, languages, customFilters));
      if (afterReset) afterReset();
    } else {
      setCustomFilters(customFiltersList.filter((item) => item !== value));
      const oldCustomFilters = vendorFilters && vendorFilters.customFilters ? vendorFilters.customFilters : [];
      const states = vendorFilters && vendorFilters.statuses ? vendorFilters.statuses : [];
      const languages = vendorFilters && vendorFilters.languages ? vendorFilters.languages : [];
      const customFilters = [...oldCustomFilters, ...customFiltersList.filter((item) => item !== value)];
      dispatch(getVendorFilters(states, languages, customFilters));
      if (afterReset) afterReset();
    }
  };

  const dateFilters = (vendorFilters && vendorFilters.customFilters && vendorFilters.customFilters.length > 0) ? vendorFilters.customFilters : [];

  return (
    <Row>
      <Col md="12" sm="12" lg="12">
        <div className="p-3 ml-2">
          {filtersFields && filtersFields.dateFilters.map((df) => (
            <div className="mb-2 font-weight-800" key={df.label}>
              <Input
                type="radio"
                value={df.label}
                name="datefilter"
                className="mt-3px"
                checked={dateFilters.some((selectedValue) => selectedValue.label === df.label)}
                onChange={handleRadioboxChange}
              />
              <span>{df.label}</span>
            </div>
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
