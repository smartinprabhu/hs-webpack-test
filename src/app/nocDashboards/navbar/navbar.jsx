/* eslint-disable import/no-unresolved */
import React, { useEffect } from 'react';
import * as PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Col,
  Nav,
  NavItem,
  NavLink,
  Row,
} from 'reactstrap';

import searchIcon from '@images/icons/configurationBlack.svg';
import assetsIcon from '@images/icons/assets.svg';
import assetsGreyIcon from '@images/icons/assetsGrey.svg';
import reportsIcon from '@images/icons/buildingBlack.svg';

// import analyticsBlue from '../../images/icons/analytics.svg';
import sideNav from './navlist.json';
import { setInitialValues } from '../../purchase/purchaseService';

const faActiveIcons = {
  ENGINEERING: searchIcon,
  ASSETS: assetsGreyIcon,
  WORKPLACE: reportsIcon,
};

const faIcons = {
  ENGINEERING: searchIcon,
  ASSETS: assetsIcon,
  WORKPLACE: reportsIcon,
};

const Navbar = (props) => {
  const { id } = props;
  const dispatch = useDispatch();

  // const { userRoles } = useSelector((state) => state.user);
  const menuList = ['Engineering', 'Assets', 'Workplace Management'];// getMenuItems(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Asset Registry', 'name');

  useEffect(() => {
    dispatch(setInitialValues(false, false, false, false));
  }, []);

  return (
    <>
      <Row className="m-0">
        <Col md="4" sm="4" lg="4" xs="12" className="p-0">
          <h3 className="mt-1">
          
            {sideNav.data.title}
          </h3>
        </Col>
        <Col md="8" sm="8" lg="8" xs="12" className="mt-1">
          <Nav>
            <>
              {menuList && menuList.map((menu, index) => (
                sideNav && sideNav.data && sideNav.data[menu] && (
                  <NavItem key={menu} onClick={() => (index)}>
                    <NavLink className={(index + 1) === id ? 'navbar-link active p-1 mr-4' : 'navbar-link p-1 mr-4'} tag={Link} to={`${sideNav.data[menu].pathName}`}>
                      <img
                        src={(index + 1) === id ? faActiveIcons[sideNav.data[menu].name] : faIcons[sideNav.data[menu].name]}
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

Navbar.propTypes = {
  id: PropTypes.number.isRequired,
};

export default Navbar;
