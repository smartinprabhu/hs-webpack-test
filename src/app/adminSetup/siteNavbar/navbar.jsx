/* eslint-disable import/no-unresolved */
import React, { useEffect } from 'react';
import * as PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  Col,
  Nav,
  NavItem,
  NavLink,
  Row,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';

import siteConfig from '@images/icons/companyConfig.png';
import siteConfigActive from '@images/icons/companyConfigActive.png';
import assetConfig from '@images/icons/assetConfig.png';
import assetConfigActive from '@images/icons/assetConfigActive.png';
import maintenance from '@images/icons/maintenance.png';
import maintenanceActive from '@images/icons/maintenanceActive.png';
import adminSetup from '@images/icons/adminSetup.svg';
import { setInitialValues } from '../../purchase/purchaseService';
import sideNav from './navlist.json';
import { getMenuItemsForSite } from '../../util/appUtils';

const faIcons = {
  SITE_CONFIGURATION: siteConfig,
  ASSET_CONFIGURATION: assetConfig,
  MAINTENANCE: maintenance,
};

const faActiveIcons = {
  SITE_CONFIGURATION: siteConfigActive,
  ASSET_CONFIGURATION: assetConfigActive,
  MAINTENANCE: maintenanceActive,
};

const Navbar = (props) => {
  const { id } = props;
  const dispatch = useDispatch();
  const listItems = ['Site Configuration', 'Asset Configuration', 'Maintenance'];
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const menuList = getMenuItemsForSite(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Admin Setup', listItems, 'name');

  useEffect(() => {
    dispatch(setInitialValues(false, false, false, false));
  }, []);

  return (
    <Row className="border-bottom">
      <Col md="6" sm="6" lg="3">
        <h3 className="mt-1">
          <img src={adminSetup} alt="assets" width="25" height="25" className="mr-3 mb-1" />
          {sideNav.title}
        </h3>
      </Col>
      <Col md="6" sm="6" lg="9">
        <Nav>
          {menuList && menuList.map((menu, index) => (
            sideNav && sideNav.data && sideNav.data[menu] && (
              <NavItem key={menu} onClick={() => (index)}>
                <NavLink className={sideNav.data[menu].compareName === id ? 'navbar-link active p-1 mr-4' : 'navbar-link p-1 mr-4'} tag={Link} to={`${sideNav.data[menu].pathName}`}>
                  <img
                    src={sideNav.data[menu].compareName === id ? faActiveIcons[sideNav.data[menu].name] : faIcons[sideNav.data[menu].name]}
                    className="mr-2"
                    alt={sideNav.data[menu].displayname}
                    width="20"
                    height="20"
                  />
                  {userInfo && userInfo.data && userInfo.data.is_parent && sideNav.data[menu].displayname === 'Site Configuration' ? 'Company Configuration' : sideNav.data[menu].displayname}
                </NavLink>
              </NavItem>
            )
          ))}
        </Nav>
      </Col>
    </Row>
  );
};

Navbar.propTypes = {
  id: PropTypes.string.isRequired,
};

export default Navbar;
