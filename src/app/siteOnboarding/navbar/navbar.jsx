/* eslint-disable import/no-unresolved */
import complianceIcon from '@images/icons/site.svg';
import configIcon from '@images/icons/siteOnBoardBlue.svg';
import reportsIcon from '@images/icons/reports.svg';
import searchIcon from '@images/icons/search.svg';
import searchActiveIcon from '@images/icons/searchGrey.svg';
import * as PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Col,
  Nav,
  NavItem,
  NavLink,
  Row,
} from 'reactstrap';
import { setInitialValues } from '../../purchase/purchaseService';
import {
  getMenuItems, getModuleDisplayName,
} from '../../util/appUtils';
import sideNav from './navlist.json';
import { setSorting } from '../../assets/equipmentService';
import DocumentViewer from '../../shared/documentViewer';


const faActiveIcons = {
  INSIGHTS: searchActiveIcon,
  SITES: complianceIcon,
  REPORTS: reportsIcon,
};

const faIcons = {
  INSIGHTS: searchIcon,
  SITES: complianceIcon,
  REPORTS: reportsIcon,
};

const Navbar = (props) => {
  const { id } = props;
  const dispatch = useDispatch();
  const module = 'Configuration';
  const { userRoles } = useSelector((state) => state.user);
  const menuList = getMenuItems(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Configuration', 'name');
  const title = getModuleDisplayName(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Configuration', 'display');

  const [logoUrl, setLogoUrl] = useState(null);

    const handleLogoUrlChange = (url) => {
        setLogoUrl(url);
    };


  useEffect(() => {
    dispatch(setInitialValues(false, false, false, false));
  }, []);


  useEffect(() => {
    dispatch(setSorting({ sortBy: 'DESC', sortField: 'create_date' }));
  }, [id]);

  return (
    <>
      <Row className="m-0">
        <Col md="4" sm="4" lg="4" xs="12" className="pl-0">
          <h3 className="mt-1 d-flex align-items-center text-break">
            <img src={configIcon} alt="assets" width="25" height="25" className="mb-1 mr-2" />
            {title ? title : sideNav.data.title}
          </h3>
        </Col>
        <Col md="7" sm="7" lg="7" xs="12" className="mt-1">
          <Nav>
            {menuList && menuList.map((menu) => (
              sideNav && sideNav.data && sideNav.data[menu] && (
                <NavItem key={menu} >
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
        <div className='pt-1 top-right-col'>
          <DocumentViewer module={module} setLogoUrl={setLogoUrl} />
        </div>
      </Row>
      <hr className="m-0 mt-1" />
    </>
  );
};

Navbar.propTypes = {
  id: PropTypes.number.isRequired,
};

export default Navbar;
