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
import AttendanceIcon from '@images/attendanceIcon.svg';
import sideNav from './navList.json';
import { getMenuItems, getModuleDisplayName } from '../../util/appUtils';
import searchActiveIcon from '@images/icons/searchGrey.svg';
import searchIcon from '@images/icons/search.svg';
import { useState } from 'react';
import reportsIcon from '@images/icons/reports.svg';
import DocumentViewer from '../../shared/documentViewer';

const Navbar = (props) => {
  const { id } = props;
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const module = 'Attendance Logs'
  const menuList = getMenuItems(userRoles && userRoles.data && userRoles.data.allowed_modules ? userRoles.data.allowed_modules : [], module, 'name');
  const title = getModuleDisplayName(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], module, 'display');

  const [currentTab, setCurrentTab] = useState(id);
  const windowPath = window.location.pathname;

  // const menuList = new Array("My Bookings", "Space Management Operations", "Booking Maintenance", "Hr Settings");

  const isParentSite = userInfo && userInfo.data && userInfo.data.company && userInfo.data.company.is_parent;
  const faActiveIcons = {
    Insights: searchActiveIcon,
    "Attendace": AttendanceIcon,
    Reports: reportsIcon,
  };

  const faIcons = {
    Insights: searchIcon,
    "Attendace": AttendanceIcon,
    Reports: reportsIcon,

  };

  const [logoUrl, setLogoUrl] = useState(null);

    const handleLogoUrlChange = (url) => {
        setLogoUrl(url);
    };

  return (
    <>
      <Row className="border-bottom m-0">
        <Col md="4" sm="4" lg="4" xs="12" className="pr-0">
          <h3 className="mr-4 d-flex align-items-center text-break">
            <img src={AttendanceIcon} alt="spaceMangement" className="mr-3 mb-1" size="sm" height="35" width="35" />
            {title ? title : sideNav.data.title}
          </h3>
        </Col>
        <Col md="7" sm="7" lg="7" xs="12">
          <Nav>
            {menuList && menuList.map((menu, index) => (
              sideNav && sideNav.data && sideNav.data[menu] && (
                <NavItem key={menu} onClick={() => (index)}>
                  <NavLink className={sideNav.data[menu].displayname === id ? 'navbar-link active p-1 mr-4' : 'navbar-link p-1 mr-4'} tag={Link} to={`${sideNav.data[menu].pathName}`}>
                    <img
                      src={sideNav.data[menu].displayname ? faActiveIcons[sideNav.data[menu].name] : faIcons[sideNav.data[menu].name]}
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
  id: PropTypes.number.isRequired,
};

export default Navbar;
