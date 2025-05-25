/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable import/no-unresolved */
import React, {useState} from 'react';
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

import searchActiveIcon from '@images/icons/search.svg';
import cleanWhite from '@images/icons/assetBlue.svg';
import sideNav from './navlist.json';
import { getModuleDisplayName } from '../../util/appUtils';
import DocumentViewer from '../../shared/documentViewer';

const faIcons = {
  Insights: searchActiveIcon,
  InsightssACTIVE: searchActiveIcon,
};

const Navbar = (props) => {
  const { id } = props;
  const { userRoles } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const menuList = ['Insights']; // getMenuItems(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Maintenance Scheduler', 'name');
  const module ='Smart Washroom'
  const title = getModuleDisplayName(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], module, 'display');

  const [logoUrl, setLogoUrl] = useState(null);

    const handleLogoUrlChange = (url) => {
        setLogoUrl(url);
    };

  return (
    <>
      <Row className="m-0">
        <Col md="4" sm="4" lg="4" xs="12" className="pl-0">
          <h3 className="mt-1 letter-spacing2 d-flex align-items-center text-break">
            <img src={cleanWhite} alt="actions" className="mr-3 mb-1" width="30" height="30" />
            {title ? title : sideNav.data.title}
          </h3>
        </Col>
        <Col md="7" sm="7" lg="7" xs="12" className="p-0">
          <Nav>
            <>
              {menuList && menuList.map((menu) => (
                sideNav && sideNav.data && sideNav.data[menu] && (
                  <NavItem key={menu}>
                    <NavLink className={sideNav.data[menu].displayname === id ? 'navbar-link active p-1 mr-4' : 'navbar-link p-1 mr-4'} tag={Link} to={`${sideNav.data[menu].pathName}`}>
                      <img
                        src={faIcons[sideNav.data[menu].name]}
                        className="mr-2"
                        alt={sideNav.data[menu].displayname}
                        width="20"
                        height="20"
                      />
                      {sideNav.data[menu].viewName}
                    </NavLink>
                  </NavItem>
                )
              ))}
            </>
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
