/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable import/no-unresolved */
import React, { useEffect,useState } from 'react';
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
import operationBlackActive from '@images/icons/gatePassBlack.svg';
import tankerBlueIcon from '@images/icons/gatepass.svg';
import searchActiveIcon from '@images/icons/searchGrey.svg';
import reportsIcon from '@images/icons/reports.svg';

import sideNav from './navlist.json';
import { setInitialValues } from '../../purchase/purchaseService';
import {
  getMenuItems, getModuleDisplayName,
} from '../../util/appUtils';
import {
  getGatePassFilters,
} from '../gatePassService';
import DocumentViewer from '../../shared/documentViewer';

const faIcons = {
  INSIGHTS: searchActiveIcon,
  GATEPASSES: operationBlackActive,
  REPORTS: reportsIcon,
};

const faActiveIcons = {
  INSIGHTS: searchIcon,
  GATEPASSES: operationBlackActive,
  REPORTS: reportsIcon,
};

const Navbar = (props) => {
  const { id } = props;
  const dispatch = useDispatch();
  const module = "Gate Pass"

  const { userRoles } = useSelector((state) => state.user);
  const menuList = getMenuItems(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], "Gate Pass", 'name');
  const title = getModuleDisplayName(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], "Gate Pass", 'display');
  const [logoUrl, setLogoUrl] = useState(null);

  const handleLogoUrlChange = (url) => {
      setLogoUrl(url);
  };
  useEffect(() => {
    dispatch(setInitialValues(false, false, false, false));
  }, []);

  const resetFilters = () => {
    dispatch(getGatePassFilters([]));
  };

  return (
    <>
      <Row className="m-0">
        <Col md="4" sm="12" lg="4" xs="4" className="pl-0">
          <h3 className="mt-1 d-flex align-items-center text-break">
            <img src={tankerBlueIcon} alt="assets" width="25" height="25" className="mr-3 mb-1" />
            {title ? title : sideNav.data.title}
          </h3>
        </Col>
        <Col md="7" sm="12" lg="7" xs="7" className="mt-1 p-0">
          <Nav>
            <>
              {menuList && menuList.map((menu) => (
                sideNav && sideNav.data && sideNav.data[menu] && (
                  <NavItem key={menu} onClick={() => resetFilters()}>
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
  id: PropTypes.number.isRequired,
};

export default Navbar;
