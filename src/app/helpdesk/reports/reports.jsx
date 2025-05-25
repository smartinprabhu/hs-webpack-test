import React, { useEffect } from 'react';
import {
  Col, Row,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';

import Navbar from '../navbar/navbar';
import ReportsList from './reportsSetup/reportList';
import {
  getHelpdeskFilter,
  resetHelpdeskReport,
} from '../ticketService';
import FITTrackerNavbar from '../../fitTracker/navbar/navbar';

const reports = (props) => {
  const { type } = props;
  const subMenu = 'Report';
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  const isFITTracker = !!(type && type === 'FITTracker');

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const filterValues = {
        states: null, categories: null, priorities: null, customFilters: null,
      };
      dispatch(getHelpdeskFilter(filterValues));
      dispatch(resetHelpdeskReport());
    }
  }, [userInfo]);

  const getNavbar = () => {
    let nav = <Navbar id={subMenu} />;
    if (isFITTracker) {
      nav = <FITTrackerNavbar id={subMenu} />;
    }
    return nav;
  };

  return (
    <Row className="ml-1 mr-1 mt-2 mb-2 p-3 border">
      <Col sm="12" md="12" lg="12">
        {/* {getNavbar()} */}
        <Row className="p-0">
          <Col sm="12" md="12" lg="12" className="p-0">
            <ReportsList />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default reports;
