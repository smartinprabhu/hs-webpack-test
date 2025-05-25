/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
import * as PropTypes from 'prop-types';
import { Link, useHistory } from 'react-router-dom';
import Pagination from '@material-ui/lab/Pagination';
import {
  Col,
  Nav,
  NavItem,
  NavLink,
  Row,
  Input,
  Popover,
  PopoverBody,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import { makeStyles } from '@material-ui/core/styles';

import workorderLogo from '@images/icons/workOrders.svg';
import searchActiveIcon from '@images/icons/search.svg';
import ordersIcon from '@images/icons/orders.svg';
import searchIcon from '@images/icons/searchGrey.svg';
import ordersActiveIcon from '@images/icons/ordersGrey.svg';
import reportsIcon from '@images/icons/reports.svg';
import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import { getMTName } from '../utils/utils';
import { setInitialValues } from '../../purchase/purchaseService';

import sideNav from './navlist.json';
import {
  getMenuItems, getAllowedCompanies, generateErrorMessage, getPagesCountV2, getModuleDisplayName,
} from '../../util/appUtils';
import { getWorkorders, getWorkorderCount, getWorkorderFilter } from '../workorderService';
import DocumentViewer from '../../shared/documentViewer';

const appModels = require('../../util/appModels').default;

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const faIcons = {
  INSIGHTS: searchIcon,
  WORKORDER: ordersIcon,
  REPORTS: reportsIcon,
};

const faActiveIcons = {
  INSIGHTS: searchActiveIcon,
  WORKORDER: ordersActiveIcon,
  REPORTS: reportsIcon,
};

const Navbar = (props) => {
  const { id } = props;
  const limit = 10;
  const dispatch = useDispatch();
  const classes = useStyles();
  const history = useHistory();
  const module = 'Work Orders';
  const { userRoles } = useSelector((state) => state.user);
  const { userInfo } = useSelector((state) => state.user);
  const { workordersInfo, workorderCount } = useSelector((state) => state.workorder);
  const menuList = getMenuItems(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Work Orders', 'name');
  const title = getModuleDisplayName(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Work Orders', 'display');

  const [keyword, setKeyword] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [workOrder, setWorkOrder] = useState(false);
  const [currentTab, setActive] = useState('Work Order');
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);
  const [totalDataCount, setTotalCount] = useState(0);
  const [logoUrl, setLogoUrl] = useState(null);

  const handleLogoUrlChange = (url) => {
      setLogoUrl(url);
  };

  const companies = getAllowedCompanies(userInfo);
  useEffect(() => {
    dispatch(setInitialValues(false, false, false, false));
  }, []);
  const columns = [
    'equip_asset_common', 'sequence', 'asset_id', 'equipment_id', 'name', 'type_category', 'state', 'equipment_location_id', 'priority', 'date_scheduled', 'maintenance_type', 'cause',
  ];
  useEffect(() => {
    if (searchOpen) {
      dispatch(getWorkorders(companies, appModels.ORDER, limit, 0, columns, offset, false, false, false, false, false, 'DESC', 'create_date', keyword));
      dispatch(getWorkorderCount(companies, appModels.ORDER, [], [], [], [], [], [], keyword));
      setTotalCount(0);
    }
  }, [searchOpen, offset, keyword]);

  useEffect(() => {
    if (!searchOpen) {
      setKeyword('');
      setPage(1);
      setOffset(0);
    }
  }, [searchOpen]);

  useEffect(() => {
    if (workOrder) {
      const filters = [{
        key: 'id', value: workOrder.id, label: 'ID', type: 'id',
      }];
      const filterValues = {
        statusValues: [],
        teams: [],
        priorities: [],
        customFilters: filters,
      };
      dispatch(getWorkorderFilter(filterValues));
      history.push({ pathname: '/maintenance/workorders' });
      // dispatch(getOrderDetail(workOrder.id, appModels.ORDER));
    }
  }, [workOrder]);

  const pages = getPagesCountV2(totalDataCount, limit);

  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsetValue = (index - 1) * limit;
    setPage(index);
    setOffset(offsetValue);
  };

  const loading = (workorderCount && workorderCount.loading) || (workordersInfo && workordersInfo.loading);
  const error = (workordersInfo && workordersInfo.err) || (workorderCount && workorderCount.err);

  useEffect(() => {
    if ((workordersInfo && workordersInfo.err) || (workorderCount && workorderCount.err)) {
      setTotalCount(0);
    }
  }, [workordersInfo, workorderCount]);

  useEffect(() => {
    if (workorderCount && workorderCount.length) {
      setTotalCount(workorderCount.length);
    } else {
      setTotalCount(0);
    }
  }, [workorderCount]);

  return (
    <>
      <Row className="m-0">
        <Col md="3" sm="3" lg="3" xs="12" className="pl-0">
          <h3 className="mt-1 d-flex align-items-center text-break">
            <img src={workorderLogo} className="mr-3 mb-1" alt="workorders" height="30" width="30" />
            {title ? title : sideNav.data.title}
          </h3>
        </Col>
        <Col  md={logoUrl === 'Insights' ? '4': '5'} lg={logoUrl === 'Insights' ? '4': '5'} sm='12' xs='12' className="mt-1 margin-negative-left-50px">
          <Nav>
            {menuList && menuList.map((menu, index) => (
              sideNav && sideNav.data && sideNav.data[menu] && (
                <NavItem key={menu} onClick={() => (index)}>
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
        {id === 'Insights' ? (
          <Col md="4" sm="4" lg="4" xs="12">
            <Row className="margin-negative-left-90px margin-negative-right-50px">
              <Col md="6" sm="6" lg="6" xs="12">
                <Input
                  className="rounded-pill mt-2 padding-left-30px"
                  id="asset-search"
                  bsSize="sm"
                  autoComplete="off"
                  placeholder="Search Here"
                  onClick={() => setSearchOpen(!searchOpen)}
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
                <FontAwesomeIcon color="lightgrey" className="insights-search-icon bg-white" icon={faSearch} />
                <Popover trigger="legacy" className="search-popover" placement="bottom" isOpen={searchOpen} target="asset-search" toggle={() => setSearchOpen(!searchOpen)}>
                  <PopoverBody>
                    <Row>
                      <Nav>
                        <NavLink className="insights-nav-link" onClick={() => setActive('Work Order')} href="#">Work Orders</NavLink>
                      </Nav>
                    </Row>
                    <hr className="mb-2 mt-1" />
                    {currentTab === 'Work Order' ? (
                      <>
                        {workordersInfo && workordersInfo.loading && (
                          <Loader />
                        )}
                        {workordersInfo && workordersInfo.err && (
                          <ErrorContent errorTxt={generateErrorMessage(workordersInfo)} />
                        )}
                        {workordersInfo && workordersInfo.data && workordersInfo.data.length && workordersInfo.data.map((workorder) => (
                          <div key={workorder.id} aria-hidden className="cursor-pointer" onClick={() => setWorkOrder(workorder)}>
                            <Row sm="12" md="12" lg="12" className="font-size-10px my-2">
                              <Col sm="4" md="4" lg="4" className="px-0 pl-3">
                                <img
                                  aria-hidden="true"
                                  id="Add"
                                  alt="Add"
                                  width="10px"
                                  className="cursor-pointer mr-1"
                                  src={faIcons.WORKORDER}
                                />
                                {workorder.name}
                              </Col>
                              <Col sm="5" md="5" lg="5" className="font-size-10px light-text p-0">
                                {workorder.cause}
                              </Col>
                              <Col sm="3" md="3" lg="3" className="font-size-10px light-text p-0">
                                {getMTName(workorder.maintenance_type)}
                              </Col>
                            </Row>
                          </div>
                        ))}
                        {keyword === '' || error || loading || pages === 0 ? (<span />) : (
                          <div className={`${classes.root} float-right`}>
                            <Pagination count={pages} page={page} size="small" color="primary" onChange={handlePageClick} className="font-11" showFirstButton showLastButton />
                          </div>
                        )}
                      </>
                    ) : ''}
                  </PopoverBody>
                </Popover>
              </Col>
            </Row>
          </Col>
        ) : ''}
        <div className='pt-1 top-right-col'>
          <DocumentViewer module={module} setLogoUrl={setLogoUrl}/>
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
