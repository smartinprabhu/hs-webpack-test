/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
import * as PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import Pagination from '@material-ui/lab/Pagination';
import { useDispatch, useSelector } from 'react-redux';
import {
  Col,
  Nav,
  NavItem,
  NavLink,
  Button,
  Row,
  Input,
  Popover,
  PopoverBody,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import { Drawer } from 'antd';
import { makeStyles } from '@material-ui/core/styles';

import searchIcon from '@images/icons/search.svg';
import pantryOrderBlackIcon from '@images/icons/pantry/pantryOrderBlack.svg';
import pantryBlueIcon from '@images/icons/pantry/pantryBlue.svg';
import searchActiveIcon from '@images/icons/searchGrey.svg';
import configurationBlack from '@images/icons/configurationBlack.svg';
import reportsIcon from '@images/icons/reports.svg';

import DrawerHeader from '@shared/drawerHeader'

import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';

import plusCircleMiniIcon from '@images/icons/plusCircleWhite.svg';

import sideNav from './navlist.json';
import {
  getAllowedCompanies, generateErrorMessage, getPagesCountV2,
  getMenuItems, getModuleDisplayName,
} from '../../util/appUtils';
import {
  getPantryList, getPantryCount, getPantryFilters,
  resetCreateOrder, resetUpdateOrder,
} from '../pantryService';
import { setInitialValues } from '../../purchase/purchaseService';
import AddOrder from '../addOrder';
import DocumentViewer from '../../shared/documentViewer';

const appModels = require('../../util/appModels').default;

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const faActiveIcons = {
  INSIGHTS: searchActiveIcon,
  ORDERS: pantryOrderBlackIcon,
  CONFIGURATION: configurationBlack,
  REPORTS: reportsIcon,
};

const faIcons = {
  INSIGHTS: searchIcon,
  ORDERS: pantryOrderBlackIcon,
  CONFIGURATION: configurationBlack,
  REPORTS: reportsIcon,
};

const Navbar = (props) => {
  const { id } = props;
  const limit = 10;
  const dispatch = useDispatch();
  const classes = useStyles();

  const [keyword, setKeyword] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [pantryId, setPantry] = useState(false);
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);
  const [totalDataCount, setTotalCount] = useState(0);

  const [addModal, setAddModal] = useState(false);
  const [partsData, setPartsData] = useState([]);
  const [logoUrl, setLogoUrl] = useState(null);

  const handleLogoUrlChange = (url) => {
      setLogoUrl(url);
  };
  const module = 'Pantry Management';
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const menuList = getMenuItems(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Pantry Management', 'name');
  const title = getModuleDisplayName(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Pantry Management', 'display');

  const {
    pantryCount, pantryListInfo, pantryCountLoading,
    pantryCountErr, addOrderInfo,
  } = useSelector((state) => state.pantry);

  const companies = getAllowedCompanies(userInfo);
  useEffect(() => {
    dispatch(setInitialValues(false, false, false, false));
  }, []);

  useEffect(() => {
    if (searchOpen) {
      dispatch(getPantryList(companies, appModels.PANTRYORDER, limit, offset, false, 'DESC', 'create_date', keyword));
      dispatch(getPantryCount(companies, appModels.PANTRYORDER, [], keyword));
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

  const pages = getPagesCountV2(totalDataCount, limit);

  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsetValue = (index - 1) * limit;
    setPage(index);
    setOffset(offsetValue);
  };

  const loading = (pantryCountLoading) || (pantryListInfo && pantryListInfo.loading);
  const error = (pantryListInfo && pantryListInfo.err) || (pantryCountErr);

  useEffect(() => {
    if ((pantryListInfo && pantryListInfo.err) || (pantryCountErr)) {
      setTotalCount(0);
    }
  }, [pantryListInfo, pantryCount]);

  useEffect(() => {
    if (pantryCount && pantryCount.length) {
      setTotalCount(pantryCount.length);
    } else {
      setTotalCount(0);
    }
  }, [pantryCount]);

  const onAddReset = () => {
    setAddModal(false);
    dispatch(resetCreateOrder());
    dispatch(resetUpdateOrder());
  };

  const onLoadRequest = (eid, ename) => {
    setPantry(eid);
    if (eid) {
      const customFilters = [{
        key: 'id',
        value: eid,
        label: ename,
        type: 'id',
      }];
      dispatch(getPantryFilters(customFilters));
    }
  };

  if (pantryId) {
    return (<Redirect to="/pantry/orders" />);
  }

  return (
    <>
      <Row className="m-0">
        <Col md="3" sm="3" lg="3" xs="12" className="p-0">
          <h3 className="mt-1 d-flex align-items-center text-break">
            <img src={pantryBlueIcon} alt="assets" width="25" height="25" className="mb-1 mr-1" />
            {title ? title : sideNav.data.title}
          </h3>
        </Col>
        <Col  md={logoUrl === 'Insights' ? '5': '6'} lg={logoUrl === 'Insights' ? '5': '6'} sm='12' xs='12' className="mt-1">
          <Nav>
            <>
              {menuList && menuList.map((menu) => (
                sideNav && sideNav.data && sideNav.data[menu] && (
                  <NavItem key={menu}>
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
        {id === 'Insights' ? (
          <Col md="3" sm="3" lg="3" xs="12">
            <Row className="margin-negative-left-90px margin-negative-right-27px">
              <Col md="6" sm="12" lg="6">
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
                <Popover trigger="legacy" className="search-width-popover" placement="bottom" isOpen={searchOpen} target="asset-search" toggle={() => setSearchOpen(!searchOpen)}>
                  <PopoverBody>
                    <Row>
                      <Nav>
                        <NavLink className="insights-nav-link">Pantry Orders</NavLink>
                      </Nav>
                    </Row>
                    <hr className="mb-2 mt-1" />
                    <>
                      {pantryListInfo && pantryListInfo.loading && (
                        <Loader />
                      )}
                      {pantryListInfo && pantryListInfo.err && (
                        <ErrorContent errorTxt={generateErrorMessage(pantryListInfo)} />
                      )}
                      {pantryListInfo && pantryListInfo.data && pantryListInfo.data.length && pantryListInfo.data.map((pt) => (
                        <div key={pt.id} aria-hidden className="cursor-pointer" onClick={() => onLoadRequest(pt.id, pt.name)}>
                          <Row sm="12" md="12" lg="12" className="font-size-10px my-2">
                            <Col sm="4" md="4" lg="4" className="px-0 pl-3">
                              <img
                                aria-hidden="true"
                                id="Add"
                                alt="Add"
                                width="10px"
                                className="cursor-pointer mr-1"
                                src={faIcons.ORDERS}
                              />
                              <span className="font-weight-700">
                                {pt.name}
                              </span>
                            </Col>
                            <Col sm="3" md="3" lg="3" className="font-size-10px light-text text-info p-0">
                              {pt.state ? pt.state : ''}
                            </Col>
                            <Col sm="5" md="5" lg="5" className="font-size-10px light-text p-0">
                              {pt.employee_id ? pt.employee_id[1] : ''}
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
                  </PopoverBody>
                </Popover>
              </Col>
              <Col sm="12" lg="4" md="4" className="p-0">
                <Button className="insights-add-icon mt-2" onClick={() => setAddModal(true)}>
                  <img
                    aria-hidden="true"
                    id="Add"
                    alt="Add"
                    width="15px"
                    className="cursor-pointer ml-0 mb-1"
                    src={plusCircleMiniIcon}
                  />
                  <span className="float-right pr-1">
                    Add an Order
                  </span>
                </Button>
              </Col>
            </Row>
          </Col>
        ) : ''}
        <div className="pt-1 top-right-col">
          <DocumentViewer module={module} setLogoUrl={setLogoUrl} />
        </div>
      </Row>
      <hr className="m-0 mt-1" />
      <Drawer
        title=""
        className="drawer-bg-lightblue"
        closable={false}
        width={1250}
        visible={addModal}
      >
        <DrawerHeader
          title="Add Order"
          imagePath={pantryBlueIcon}
          closeDrawer={() => { onAddReset; setPartsData([]); setAddModal(false); }}
        />
        <AddOrder
          editId={false}
          setAddModal={() => onAddReset()}
          closeAddModal={() => setAddModal(false)}
          partsData={partsData}
          setPartsData={setPartsData}
        // onLoadPantry={() => onLoadPantry()}
        />
      </Drawer>
      {/* <Modal size={(addOrderInfo && addOrderInfo.data) ? 'sm' : 'xl'} className="border-radius-50px modal-dialog-centered purchase-modal" isOpen={addModal}>
        <ModalHeaderComponent title="Add Order" imagePath={false} closeModalWindow={() => onAddReset()} response={addOrderInfo} />
        <ModalBody className="mt-0 pt-0">
          <AddOrder editId={false} />
          <ModalFormAlert alertResponse={addOrderInfo} alertText="Order added successfully.." />
          {addOrderInfo && addOrderInfo.data && (<hr />)}
          <div className="float-right">
            {addOrderInfo && addOrderInfo.data && (
            <Button
              size="sm"
              type="button"
               variant="contained"
              onClick={() => onAddReset()}
              disabled={addOrderInfo && addOrderInfo.loading}
            >
              OK
            </Button>
            )}
          </div>
        </ModalBody>
            </Modal> */}
    </>
  );
};

Navbar.propTypes = {
  id: PropTypes.string.isRequired,
};

export default Navbar;
