import React, { useEffect } from 'react';
import {
  Col, Row,
} from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import * as PropTypes from 'prop-types';

import {
  getPreventiveFilter, getReportId, getLocationId,
} from '../../preventiveMaintenance/ppmService';

import Navbar from '../navbar/navbar';
import ReportList from './reportList';

const reports = () => {
  const subMenu = 'Reports';
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const filterValues = {
        dates: null, locations: null,
      };
      dispatch(getPreventiveFilter(filterValues));
      dispatch(getReportId());
      dispatch(getLocationId());
    }
  }, [userInfo]);

  return (
    <ReportList />
  );
};

reports.propTypes = {
  type: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
};
reports.defaultProps = {
  type: false,
};

export default reports;
