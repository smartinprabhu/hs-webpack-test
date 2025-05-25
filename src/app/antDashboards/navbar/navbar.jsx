/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
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
import windyBlue from '@images/airquality/windyBlue.svg';
import searchActiveIcon from '@images/icons/searchGrey.svg';

import sideNav from './navlist.json';
import {
  getMenuItems,
  translateText,
} from '../../util/appUtils';
import { setInitialValues } from '../../purchase/purchaseService';
import DocumentViewer from '../../shared/documentViewer';

const faActiveIcons = {
  INSIGHTS: searchActiveIcon,
};

const faIcons = {
  INSIGHTS: searchIcon,
};

const Navbar = (props) => {
  const { id } = props;
  const dispatch = useDispatch();

  const { userRoles } = useSelector((state) => state.user);
  const { userInfo } = useSelector((state) => state.user);
  const menuList = ['Insights']; // getMenuItems(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Audit System', 'name');

  const [logoUrl, setLogoUrl] = useState(null);

    const handleLogoUrlChange = (url) => {
        setLogoUrl(url);
    };

  useEffect(() => {
    dispatch(setInitialValues(false, false, false, false));
  }, []);

  return (
    <>
      <Row className="m-0">
        <Col md="4" sm="4" lg="4" xs="12" className="p-0">
          <h3 className="mt-1">
            <img src={windyBlue} alt="assets" width="25" height="25" className="mb-1 mr-1" />
            {translateText(sideNav.data.title, userInfo)}
          </h3>
        </Col>
        <Col md="7" sm="7" lg="7" xs="12" className="mt-1">
          <Nav>
            {menuList && menuList.map((menu) => (
              sideNav && sideNav.data && sideNav.data[menu] && (
              <NavItem
                key={menu}
                onClick={() => {
                  dispatch(setInitialValues(false, false, false, false));
                }}
              >
                <NavLink className={sideNav.data[menu].displayname === id ? 'navbar-link active p-1 mr-4' : 'navbar-link p-1 mr-4'} tag={Link} to={`${sideNav.data[menu].pathName}`}>
                  <img
                    src={sideNav.data[menu].displayname === id ? faActiveIcons[sideNav.data[menu].name] : faIcons[sideNav.data[menu].name]}
                    className="mr-2"
                    alt={sideNav.data[menu].displayname}
                    width="20"
                    height="20"
                  />
                  {translateText(sideNav.data[menu].displayname, userInfo)}
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
