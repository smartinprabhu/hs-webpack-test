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
import { useSelector, useDispatch } from 'react-redux';

import inventoryBlue from '@images/icons/inventoryBlue.svg';
import configurationBlack from '@images/icons/configurationBlack.svg';
import operationBlackActive from '@images/icons/operationsBlack.svg';
import siteConfig from '@images/icons/companyConfig.png';
import searchIcon from '@images/icons/search.svg';
import searchGrey from '@images/icons/searchGrey.svg';
import reportsIcon from '@images/icons/reports.svg';
import purchaseBlack from '@images/icons/purchaseBlack.svg';
import {
  getMenuItems, getModuleDisplayName,
} from '../../util/appUtils';
import {
  resetDetailSiteInfo, resetWarehouseId,
} from '../../siteOnboarding/siteService';
import sideNav from './navlist.json';
import DocumentViewer from '../../shared/documentViewer';

const faIcons = {
  INSIGHTS: searchGrey,
  OPERATIONS: siteConfig,
  REPORTS: reportsIcon,
  CONFIGURATIONS: configurationBlack,
  PRODUCTS: purchaseBlack,
};

const faActiveIcons = {
  INSIGHTS: searchIcon,
  OPERATIONS: operationBlackActive,
  REPORTS: reportsIcon,
  CONFIGURATIONS: configurationBlack,
  PRODUCTS: purchaseBlack,
};

const Navbar = (props) => {
  const { id } = props;
  const dispatch = useDispatch();
  // const menuList = ['Insights', 'Operations', 'Reports', 'Configurations'];
  const { userRoles } = useSelector((state) => state.user);
  const menuList = getMenuItems(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Inventory', 'name');
  const title = getModuleDisplayName(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Inventory', 'display');
  const module = 'Inventory'
  const [logoUrl, setLogoUrl] = useState(null);

    const handleLogoUrlChange = (url) => {
        setLogoUrl(url);
    };
  useEffect(() => {
    dispatch(resetDetailSiteInfo());
    dispatch(resetWarehouseId());
  }, [id]);

  return (
    <>
      <Row className="border-bottom">
        <Col md="3"  lg="3" sm="12" className="pl-0">
          <h3 className="mt-1 d-flex align-items-center text-break">
            <img src={inventoryBlue} alt="assets" width="25" height="25" className="mr-3 mb-1" />
            {title ? title : sideNav.title}
          </h3>
        </Col>
        <Col md="7" lg="7" sm="12">
          <Nav>
            {menuList && menuList.map((menu, index) => (
              sideNav && sideNav.data && sideNav.data[menu] && (
                <NavItem key={menu} onClick={() => (index)}>
                  <NavLink
                    className={sideNav.data[menu].displayname === id ? 'navbar-link active p-1 mr-4' : 'navbar-link p-1 mr-4'}
                    tag={Link}
                    to={`${sideNav.data[menu].pathName}`}
                  >
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
        <div className='pt-1 top-right-col'>
          <DocumentViewer module={module} setLogoUrl={setLogoUrl} />
        </div>
      </Row>
    </>
  );
};

Navbar.propTypes = {
  id: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
};

export default Navbar;
