/* eslint-disable import/no-unresolved */
import React, { useEffect } from 'react';
import {
  Col, Row,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from './navbar/navbar';
import {
  getHelpdeskFilter,
} from './ticketService';

const Reports = () => {
  const subMenu = 4;
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const filterValues = {
        states: null, categories: null, priorities: null, customFilters: null,
      };
      dispatch(getHelpdeskFilter(filterValues));
    }
  }, [userInfo]);

  return (
    <Row className="ml-1 mr-1 mt-2 mb-2 p-3 border">
      <Col sm="12" md="12" lg="12" xs="12">
        <Row className="pt-2">
          <Col md="12" sm="12" lg="12" xs="12" />
        </Row>
      </Col>
    </Row>

  );
};

export default Reports;
