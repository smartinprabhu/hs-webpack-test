/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
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

import companyConfig from '@images/icons/companyConfigActive.png';
import adminSetup from '@images/icons/adminSetup.svg';

import assetConfig from '@images/icons/assetConfig.png';
import assetConfigActive from '@images/icons/assetConfigActive.png';
import maintenance from '@images/icons/maintenance.png';
import maintenanceActive from '@images/icons/maintenanceActive.png';

import sideNav from './navlist.json';
import { getMenuItemsForSite, getModuleDisplayName } from '../../util/appUtils';
import { setInitialValues } from '../../purchase/purchaseService';
import DocumentViewer from '../../shared/documentViewer';

const faIcons = {
  COMPANY_CONFIGURATION: companyConfig,
  ASSET_CONFIGURATION: assetConfig,
  MAINTENANCE: maintenance,
};

const faActiveIcons = {
  COMPANY_CONFIGURATION: companyConfig,
  ASSET_CONFIGURATION: assetConfigActive,
  MAINTENANCE: maintenanceActive,
};

const Navbar = (props) => {
  const { id } = props;
  const module = 'Admin Setup';
  const dispatch = useDispatch();
  const listItems = ['Company Configuration', 'Asset Configuration', 'Maintenance'];
  const { userRoles } = useSelector((state) => state.user);
  const menuList = getMenuItemsForSite(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Admin Setup', listItems, 'name');
  const title = getModuleDisplayName(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Admin Setup', 'display');
  // const menuList = allowedMenuList.concat(listSiteItems);
  
    const [logoUrl, setLogoUrl] = useState(null);

      const handleLogoUrlChange = (url) => {
          setLogoUrl(url);
      };

  useEffect(() => {
    dispatch(setInitialValues(false, false, false, false));
  }, []);

  return (
    <>
      <Row className="border-bottom">
        <Col md="4" sm="12" lg="4">
          <h3 className="mt-1 d-flex align-items-center text-break">
            <img src={adminSetup} alt="assets" width="25" height="25" className="mr-3 mb-1" />
            {title ? title : sideNav.title}
          </h3>
        </Col>
        <Col md="7" sm="12" lg="7">
          <Nav>
            {menuList && menuList.map((menu, index) => (
              sideNav && sideNav.data && sideNav.data[menu] && (
                <NavItem key={menu} onClick={() => (index)}>
                  <NavLink className={sideNav.data[menu].displayname === id ? 'navbar-link active p-1 mr-4' : 'navbar-link p-1 mr-4'} tag={Link} to={`${sideNav.data[menu].pathName}`}>
                    <img
                      src={sideNav.data[menu].displayname === id ? faActiveIcons[sideNav.data[menu].name] : faIcons[sideNav.data[menu].name]}
                      className="mr-2"
                      alt={sideNav.data[menu].name}
                      width="17"
                      height="17"
                    />
                    {sideNav.data[menu].displayname}
                  </NavLink>
                </NavItem>
              )
            ))}
          </Nav>
        </Col>
        <div className='pt-1 top-right-col'>
          <DocumentViewer module={module} setLogoUrl={setLogoUrl} />
        </div>
      </Row>
      <hr className="m-0 mt-1" />
    </>
  );
};

Navbar.propTypes = {
  id: PropTypes.string.isRequired,
};

export default Navbar;
