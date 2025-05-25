/* eslint-disable react/jsx-no-useless-fragment */
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Col,
  Nav,
  NavItem,
  NavLink,
  Row,
} from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';

import ordersIcon from '@images/orders.svg';
import ordersActiveIcon from '@images/helpdeskBlue.svg';

import sideNav from './navlist.json';
import { getMenuItems } from '../../util/appUtils';
import {
  getWorkorderFilter,
} from '../adminMaintenanceService';

const faIcons = {
  CLEANING: ordersIcon,
  BOOKING: ordersIcon,
};

const faActiveIcons = {
  CLEANING: ordersActiveIcon,
  BOOKING: ordersActiveIcon,
};

const Navbar = () => {
  const dispatch = useDispatch();
  const { userRoles } = useSelector((state) => state.user);
  const menuList = getMenuItems(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'HSpace - Space Management', 'name');
  const onClickNavItem = () => {
    if (window.location.pathname === '/booking-management') {
      dispatch(getWorkorderFilter({}));
    }
  };
  return (
    <>
      <Row className="pl-2 m-0">
        <Col md="6" sm="12" lg="9" xs="12" className="p-0">
          <Nav className="maintenance-nav">
            <>
              {menuList && menuList.map((menu) => (
                sideNav && sideNav.data && sideNav.data[menu] && (
                  <NavItem key={menu} onClick={() => onClickNavItem()}>
                    <NavLink className={window.location.pathname === sideNav.data[menu].pathName ? 'navbar-link active p-1 mr-0 mr-lg-4' : 'navbar-link p-1 mr-lg-4'} tag={Link} to={`${sideNav.data[menu].pathName}`}>
                      <img
                        src={window.location.pathname === sideNav.data[menu].pathName ? faActiveIcons[sideNav.data[menu].name] : faIcons[sideNav.data[menu].name]}
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
      </Row>
      <hr className="m-0 mt-1" />
    </>
  );
};

export default Navbar;
