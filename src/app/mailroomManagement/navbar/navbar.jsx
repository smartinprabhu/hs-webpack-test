/* eslint-disable import/no-unresolved */
import React, { useEffect } from 'react';
import * as PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Col,
  Nav,
  NavItem,
  NavLink,
  Row,
} from 'reactstrap';

import searchIcon from '@images/icons/search.svg';
import operationBlackActive from '@images/icons/operationsBlack.svg';
import mailroomIcon from '@images/icons/mailroomInnerBlue.svg';
import searchActiveIcon from '@images/icons/searchGrey.svg';
import reportsIcon from '@images/icons/reports.svg';

import sideNav from './navlist.json';
import { setInitialValues } from '../../purchase/purchaseService';
import { getMenuItems, getModuleDisplayName } from '../../util/appUtils';
import { getInBoundFilters } from '../mailService';

const faIcons = {
  INSIGHTS: searchActiveIcon,
  OPERATIONS: operationBlackActive,
  REPORTS: reportsIcon,
};

const faActiveIcons = {
  INSIGHTS: searchIcon,
  OPERATIONS: operationBlackActive,
  REPORTS: reportsIcon,
};

const Navbar = (props) => {
  const { id } = props;
  const dispatch = useDispatch();

  const { userRoles } = useSelector((state) => state.user);
  const menuList = getMenuItems(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Mail Room Management', 'name');
  const title = getModuleDisplayName(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Mail Room Management', 'display');

  useEffect(() => {
    dispatch(setInitialValues(false, false, false, false));
  }, []);

  const resetFilters = () => {
    dispatch(getInBoundFilters([]));
  };

  return (
    <>
      <Row className="m-0 mailRoomManagement-header">
        <Col md="4" sm="12" lg="4" xs="12" className="pl-0">
          <h3 className="mt-1 d-flex align-items-center text-break">
            <img src={mailroomIcon} alt="assets" width="25" height="25" className="mb-1 mr-3" />
            {title ? title : sideNav.data.title}
          </h3>
        </Col>
        <Col md="5" sm="12" lg="5" xs="12" className="mt-1">
          <Nav>
            <>
              {menuList && menuList.map((menu) => (
                sideNav && sideNav.data && sideNav.data[menu] && (
                  <NavItem key={menu} onClick={() => resetFilters()}>
                    <NavLink className={sideNav.data[menu].displayname === id ? 'navbar-link active p-1 mr-4' : 'navbar-link p-1 mr-4'} tag={Link} to={`${sideNav.data[menu].pathName}`}>
                      <img
                        src={sideNav.data[menu].displayname === id ? faActiveIcons[sideNav.data[menu].name] : faIcons[sideNav.data[menu].name]}
                        className="mr-2"
                        alt={sideNav.data[menu].displayname}
                        width="20"
                        height="20"
                      />
                      {sideNav.data[menu].displayname}
                    </NavLink>
                  </NavItem>
                )
              ))}
            </>
          </Nav>
        </Col>
        {id === 'Insights' ? (
          <Col md="3" sm="3" lg="3" xs="12">
            <Row className="margin-negative-left-90px margin-negative-right-27px">
              <Col md="8" sm="8" lg="8" />
              <Col sm="12" lg="4" md="4" className="p-0" />
            </Row>
          </Col>
        ) : ''}
      </Row>
      <hr className="m-0 mt-1" />
    </>
  );
};

Navbar.propTypes = {
  id: PropTypes.string.isRequired,
};

export default Navbar;
