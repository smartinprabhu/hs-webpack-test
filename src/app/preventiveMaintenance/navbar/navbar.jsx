/* eslint-disable react/jsx-no-useless-fragment */
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

import reports from '@images/icons/reports.svg';
import ppmView from '@images/icons/ppmView.svg';
import ppmSchedule from '@images/icons/ppmSchedule.svg';
import searchActiveIcon from '@images/icons/search.svg';
import preventiveMaintenance from '@images/icons/preventiveMaintenance.svg';
import sideNav from './navlist.json';
import { setInitialValues } from '../../purchase/purchaseService';
import { getMenuItems, getModuleDisplayName } from '../../util/appUtils';
import {
  getPreventiveFilter,
} from '../ppmService';
import { useHistory } from 'react-router';
import DocumentViewer from '../../shared/documentViewer';

const faIcons = {
  PPMInsights: searchActiveIcon,
  PPMInsightsACTIVE: searchActiveIcon,
  PPMViewer: ppmView,
  PPMViewerACTIVE: ppmView,
  PPMOldViewer: ppmView,
  PPMOldViewerACTIVE: ppmView,
  PPMScheduler: ppmSchedule,
  PPMSchedulerACTIVE: ppmSchedule,
  Reports: reports,
  ReportsACTIVE: reports,
};

const Navbar = (props) => {
  const { id } = props;
  const history = useHistory();
  const { userRoles } = useSelector((state) => state.user);
  const [menuItem, setMenuItem] = useState();
  const dispatch = useDispatch();
  const module = '52 Week PPM';
  const menuList = getMenuItems(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], module, 'name');
  const title = getModuleDisplayName(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], module, 'display');
  const foundIdx = menuList.findIndex(el => el == 'Insights');
  if (foundIdx > 0) {
    menuList.splice(foundIdx, 1);
    menuList.unshift('Insights');
  }
  const [logoUrl, setLogoUrl] = useState(null);

  const handleLogoUrlChange = (url) => {
      setLogoUrl(url);
  };

  useEffect(() => {
    dispatch(setInitialValues(false, false, false, false));
  }, []);

  useEffect(() => {
    const data = []
    if (menuList && menuList.length && menuItem === undefined && !menuList.includes('Insights') && id === 'Insights') {
      menuList.map((menu) => {
        if (sideNav && sideNav.data && sideNav.data[menu] && sideNav.data[menu].displayname !== undefined) {
          data.push(menu);
        }
      })
      setMenuItem(data);
    }
  }, [menuList, menuItem])

  useEffect(() => {
    if (menuItem !== undefined && menuItem.length) {
      history.push({
        pathname: `${sideNav && sideNav.data && sideNav.data[menuItem && menuItem.length && menuItem[0]].pathName}`,
      });
    }
  }, [menuItem])

  const onLoadPreventive = () => {
    const payload = {
      states: [],
      preventiveBy: [],
      categories: [],
      priorities: [],
      teams: [],
      types: [],
      customFilters: [],
    };
    dispatch(getPreventiveFilter(payload));
  };

  return (
    <>
      <Row className="m-0">
        <Col md="4" sm="4" lg="4" xs="12" className="pl-0">
          <h3 className="mt-1 d-flex align-items-center text-break letter-spacing2">
            <img src={preventiveMaintenance} alt="actions" className="mr-3 mb-1" width="30" height="30" />
            {title ? title : sideNav.data.title}
          </h3>
        </Col>
        <Col md="7" sm="7" lg="7" xs="12" className="p-0">
          <Nav>
            <>
              {menuList && menuList.map((menu) => (
                sideNav && sideNav.data && sideNav.data[menu] && (
                <NavItem key={menu} onClick={onLoadPreventive}>
                  <NavLink className={sideNav.data[menu].displayname === id ? 'navbar-link active p-1 mr-3' : 'navbar-link p-1 mr-3'} tag={Link} to={`${sideNav.data[menu].pathName}`}>
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
       <DocumentViewer module={module}  setLogoUrl={setLogoUrl}/>
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
