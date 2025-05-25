/* eslint-disable import/no-unresolved */
import React, { useEffect } from 'react';
import * as PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Col,
  Nav,
  NavItem,
  NavLink,
  Row,
} from 'reactstrap';

import purchaseIcon from '@images/icons/purchase.svg';
import { setInitialValues } from '../purchaseService';
import {
  getMenuItems, getModuleDisplayName,
} from '../../util/appUtils';

import sideNav from './navlist.json';

const faIcons = {
  PURCHASE_INFO: purchaseIcon,
};

const faActiveIcons = {
  PURCHASE_INFO: purchaseIcon,
};

const Navbar = (props) => {
  const { id } = props;
  const dispatch = useDispatch();
  const { userRoles } = useSelector((state) => state.user);
  const menuList = getMenuItems(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Purchase', 'name');
  const title = getModuleDisplayName(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Purchase', 'display');

  useEffect(() => {
    dispatch(setInitialValues(false, false, false, false));
  }, []);

  return (
    <>
      <Row className="border-bottom">
        <Col md="6" sm="6" lg="3">
          <h3 className="mt-1 d-flex align-items-center text-break">
            <img src={purchaseIcon} alt="assets" width="25" height="25" className="mr-3 mb-1" />
            {title ? title : sideNav.title}
          </h3>
        </Col>
        <Col md="6" sm="6" lg="9">
          <Nav>
            {menuList && menuList.map((menu, index) => (
              sideNav && sideNav.data && sideNav.data[menu] && (
                <NavItem key={menu} onClick={() => (index)}>
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
          </Nav>
        </Col>
      </Row>
      <hr className="m-0 mt-1" />
    </>
  );
};

Navbar.propTypes = {
  id: PropTypes.number.isRequired,
};

export default Navbar;
