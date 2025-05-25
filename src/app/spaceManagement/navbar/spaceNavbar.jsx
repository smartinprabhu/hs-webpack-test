/* eslint-disable import/no-unresolved */
import React from 'react';
import * as PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Col,
  Nav,
  NavItem,
  NavLink,
  Row,
} from 'reactstrap';
import spaceManagement from '@images/icons/spaceManagement.svg';
import location from '@images/icons//spaceManagement.svg';
import sideNav from './navlist.json';
import { getMenuItems, getModuleDisplayName } from '../../util/appUtils';
import searchActiveIcon from '@images/icons/searchGrey.svg';
import searchIcon from '@images/icons/search.svg';
import { useState, useEffect } from 'react';
import myBookingsBlue from '@images/myBookingsBlue.ico';
import maintenanceBlue from '@images/hspacemaintenanceBlue.svg';
import hrSettingsBlue from '@images/workordersBlue.svg';
import homeIconBlue from '@images/icons/homeBlue.svg';
import DocumentViewer from '../../shared/documentViewer';

const SpaceNavbar = (props) => {
  const { id } = props;
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const module = 'HSpace - Space Management'
  const menuList = getMenuItems(userRoles && userRoles.data && userRoles.data.allowed_modules ? userRoles.data.allowed_modules : [], 'HSpace - Space Management', 'name');
  const title = getModuleDisplayName(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'HSpace - Space Management', 'display');
  const [currentTab, setCurrentTab] = useState(id);
  const windowPath = window.location.pathname;
  const [logoUrl, setLogoUrl] = useState(null);
    const handleLogoUrlChange = (url) => {
        setLogoUrl(url);
    };


  // const menuList = new Array("My Bookings", "Space Management Operations", "Booking Maintenance", "Hr Settings");

  const isParentSite = userInfo && userInfo.data && userInfo.data.company && userInfo.data.company.is_parent;
  const faActiveIcons = {
    'Hspace Home': homeIconBlue,
    'Insights': searchActiveIcon,
    'Space Management Operations': location,
    'My Bookings': myBookingsBlue,
    'booking maintenance': maintenanceBlue,
    'hr settings': hrSettingsBlue,
  };

  const faIcons = {
    'Hspace Home': homeIconBlue,
    'Insights' : searchIcon,
    "Space Management Operations": location,
    'My Bookings': myBookingsBlue,
    'booking maintenance': maintenanceBlue,
    'hr settings': hrSettingsBlue,
  };

  return (
    <Row className="border-bottom m-0">
      <Col md="3" sm="3" lg="3" xs="12" className="pl-0">
        <h3 className="mt-1 d-flex align-items-center text-break letter-spacing2">
          <img src={spaceManagement} alt="spaceMangement" className="mr-3 mb-1" size="sm" height="35" width="35" />
          {title ? title : sideNav.isParent.title}
        </h3>
      </Col>
      <Col md="6" sm="6" lg="6" xs="12">
        <Nav>
          {menuList && menuList.map((menu, index) => (
            <>{isParentSite ? (
              <>
                {sideNav && sideNav.isParent && sideNav.isParent[menu] && (
                  <NavItem key={menu} onClick={() => (index)}>
                    <NavLink className={sideNav.isParent[menu].displayname === id ? 'navbar-link active p-1 mr-4' : 'navbar-link p-1 mr-4'} tag={Link} to={`${sideNav.isParent[menu].pathName}`}>
                      <img
                        src={sideNav.isParent[menu].displayname ? faActiveIcons[sideNav.isParent[menu].name] : faIcons[sideNav.isParent[menu].name]}
                        className="mr-2"
                        alt={sideNav.isParent[menu].displayname}
                        width="20"
                        height="20"
                      />
                      {sideNav.isParent[menu].displayname}
                    </NavLink>
                  </NavItem>
                )}
              </>
            ) : (
              <>
                {sideNav && sideNav.notParent && sideNav.notParent[menu] && (
                  <NavItem key={menu} onClick={() => (index)}>
                    <NavLink className={sideNav.notParent[menu].displayname === id ? 'navbar-link active p-1 mr-4' : 'navbar-link p-1 mr-4'} tag={Link} to={`${sideNav.notParent[menu].pathName}`}>
                      <img
                        src={sideNav.notParent[menu].displayname ? faActiveIcons[sideNav.notParent[menu].name] : faIcons[sideNav.notParent[menu].name]}
                        className="mr-2"
                        alt={sideNav.notParent[menu].displayname}
                        width="20"
                        height="20"
                      />
                      {sideNav.notParent[menu].displayname}
                    </NavLink>
                  </NavItem>
                )}
              </>
            )}
            </>
          ))}
        </Nav>
      </Col>
      <div className='pt-1 top-right-col'>
          <DocumentViewer module={module} setLogoUrl={setLogoUrl} />
        </div>
    </Row>
  );
};

SpaceNavbar.propTypes = {
  id: PropTypes.number.isRequired,
};

export default SpaceNavbar;
