/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
import * as PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import Pagination from '@material-ui/lab/Pagination';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Col,
  Nav,
  NavItem,
  NavLink,
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
import VisitRequest from '@images/icons/visitRequest.svg';
import VisitRequestGrey from '@images/icons/visitRequestGrey.svg';
import searchActiveIcon from '@images/icons/searchGrey.svg';
import visitorLogo from '@images/icons/visitorpassBlue.svg';
import plusCircleMiniIcon from '@images/icons/plusCircleWhite.svg';
import VisitRequestBlue from '@images/icons/visitorPassCheckBlue.svg';
import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import DrawerHeader from '@shared/drawerHeader';

import sideNav from './navlist.json';
import {
  getMenuItems, getAllowedCompanies, generateErrorMessage, getPagesCountV2, getListOfModuleOperations, getModuleDisplayName,
} from '../../util/appUtils';
import {
  getVisitorRequestList, getVisitorRequestCount, getVisitorRequestFilters, resetAddVisitRequest,
} from '../visitorManagementService';
import { setInitialValues } from '../../purchase/purchaseService';
import AddVisitRequest from '../addVisitRequest';
import actionCodes from '../data/actionCodes.json';
import {
  resetUpdateTenant,
} from '../../adminSetup/setupService';
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
  VISITREQUEST: VisitRequest,
};

const faIcons = {
  INSIGHTS: searchIcon,
  VISITREQUEST: VisitRequestGrey,
};

const Navbar = (props) => {
  const { id } = props;
  const limit = 10;
  const dispatch = useDispatch();
  const classes = useStyles();
  const module = 'Visitor Management'
  const [keyword, setKeyword] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [visitRequest, setVisitRequest] = useState(false);
  const [currentTab, setActive] = useState('Visit Request');
  const [offset, setOffset] = useState(0);
  const [nameKeyword, setNameKeyword] = useState('');
  const [change, setChange] = useState(false);
  const [page, setPage] = useState(1);
  const [partsData, setPartsData] = useState([]);

  const [totalDataCount, setTotalCount] = useState(0);
  const [addVisitRequestModal, showAddVisitRequestModal] = useState(false);

  const [logoUrl, setLogoUrl] = useState(null);

    const handleLogoUrlChange = (url) => {
        setLogoUrl(url);
    };

  const { userInfo, userRoles } = useSelector((state) => state.user);

  const {
    visitorRequestListInfo, visitorRequestCount, addVisitRequestInfo, visitorConfiguration,
  } = useSelector((state) => state.visitorManagement);

  const menuList = getMenuItems(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Visitor Management', 'name');
  const title = getModuleDisplayName(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Visitor Management', 'display');
  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Visitor Management', 'code');
  const isCreatable = allowedOperations.includes(actionCodes['Create New Visit Request']);

  const companies = getAllowedCompanies(userInfo);
  useEffect(() => {
    dispatch(setInitialValues(false, false, false, false));
    dispatch(resetUpdateTenant());
  }, []);

  useEffect(() => {
    if (searchOpen) {
      dispatch(getVisitorRequestList(companies, appModels.VISITREQUEST, limit, offset, false, 'DESC', 'create_date', keyword));
      dispatch(getVisitorRequestCount(companies, appModels.VISITREQUEST, [], keyword));
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

  const loading = (visitorRequestCount && visitorRequestCount.loading) || (visitorRequestListInfo && visitorRequestListInfo.loading);
  const error = (visitorRequestListInfo && visitorRequestListInfo.err) || (visitorRequestCount && visitorRequestCount.err);

  useEffect(() => {
    if ((visitorRequestListInfo && visitorRequestListInfo.err) || (visitorRequestCount && visitorRequestCount.err)) {
      setTotalCount(0);
    }
  }, [visitorRequestListInfo, visitorRequestCount]);

  useEffect(() => {
    if (visitorRequestCount && visitorRequestCount.length) {
      setTotalCount(visitorRequestCount.length);
    } else {
      setTotalCount(0);
    }
  }, [visitorRequestCount]);

  const onLoadRequest = (eid, ename) => {
    setVisitRequest(eid);
    if (eid) {
      const customFilters = [{
        key: 'id',
        value: eid,
        label: ename,
        type: 'id',
      }];
      dispatch(getVisitorRequestFilters(customFilters));
    }
  };

  if (visitRequest) {
    return (<Redirect to="/visitormanagement/visitrequest" />);
  }

  const onReset = () => {
    if (document.getElementById('visitormanagementForm')) {
      document.getElementById('visitormanagementForm').reset();
    }
    dispatch(resetAddVisitRequest());
  };

  return (
    <>
      <Row className="m-0 visitorOverview-header ">
        <Col md="3" sm="3" lg="3" xs="12" className="pl-0">
          <h3 className="mt-1 d-flex align-items-center text-break">
            <img src={visitorLogo} alt="assets" width="25" height="25" className="mb-1 mr-3" />
            {title || sideNav.data.title}
          </h3>
        </Col>
        <Col  md={logoUrl === 'Insights' ? '4': '5'} lg={logoUrl === 'Insights' ? '4': '5'} sm='12' xs='12' className="mt-1">
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
          <Col md="4" sm="4" lg="4" xs="12">
            <Row className="margin-negative-left-155px margin-negative-right-27px">
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
                <Popover trigger="legacy" className="search-popover" placement="bottom" isOpen={searchOpen} target="asset-search" toggle={() => setSearchOpen(!searchOpen)}>
                  <PopoverBody>
                    <Row>
                      <Nav>
                        <NavLink className="insights-nav-link" onClick={() => setActive('Visit Request')} href="#">Visit Request</NavLink>
                      </Nav>
                    </Row>
                    <hr className="mb-2 mt-1" />
                    {currentTab === 'Visit Request' ? (
                      <>
                        {visitorRequestListInfo && visitorRequestListInfo.loading && (
                          <Loader />
                        )}
                        {visitorRequestListInfo && visitorRequestListInfo.err && (
                          <ErrorContent errorTxt={generateErrorMessage(visitorRequestListInfo)} />
                        )}
                        {visitorRequestListInfo && visitorRequestListInfo.data && visitorRequestListInfo.data.length && visitorRequestListInfo.data.map((visitrequest) => (
                          <div key={visitrequest.id} aria-hidden className="cursor-pointer" onClick={() => onLoadRequest(visitrequest.id, visitrequest.visitor_name)}>
                            <Row sm="12" md="12" lg="12" className="font-size-10px my-2">
                              <Col sm="4" md="4" lg="4" className="px-0 pl-3">
                                <img
                                  aria-hidden="true"
                                  id="Add"
                                  alt="Add"
                                  width="10px"
                                  className="cursor-pointer mr-1"
                                  src={faIcons.VISITREQUEST}
                                />
                                {visitrequest.visitor_name}
                              </Col>
                              <Col sm="5" md="5" lg="5" className="font-size-10px light-text p-0">
                                {visitrequest.type_of_visitor ? visitrequest.type_of_visitor : ''}
                              </Col>
                              <Col sm="3" md="3" lg="3" className="font-size-10px light-text p-0">
                                {visitrequest.company_id ? visitrequest.company_id[1] : ''}
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
              <Col sm="12" lg="4" md="4" className="">
                {isCreatable && (
                  <Button className="float-right insights-add-icon mt-2 min-width-160" onClick={() => { showAddVisitRequestModal(!addVisitRequestModal); dispatch(resetUpdateTenant()); }}>
                    <img
                      aria-hidden="true"
                      id="Add"
                      alt="Add"
                      width="15px"
                      className="cursor-pointer ml-0 mr-1 mb-1"
                      src={plusCircleMiniIcon}
                    />
                    <span>
                      Create Visit Request
                    </span>
                  </Button>
                )}
              </Col>
            </Row>
            <Drawer
              title=""
              closable={false}
              className="drawer-bg-lightblue"
              width={1250}
              visible={addVisitRequestModal}
            >

              <DrawerHeader
                title="Create Visit request"
                imagePath={VisitRequestBlue}
                closeDrawer={() => {
                  showAddVisitRequestModal(false); onReset(); setChange(false); setNameKeyword(null);
                  setPartsData([]);
                }}
              />
              <AddVisitRequest
                editId={false}
                afterReset={() => { showAddVisitRequestModal(false); onReset(); }}
                change={change}
                setChange={setChange}
                nameKeyword={nameKeyword}
                setNameKeyword={setNameKeyword}
                visitorConfiguration={visitorConfiguration}
                partsData={partsData}
                isShow={addVisitRequestModal}
                setPartsData={setPartsData}
              />
            </Drawer>
            {/* <Modal size={(addVisitRequestInfo && addVisitRequestInfo.data) ? 'sm' : 'xl'} className="border-radius-50px modal-dialog-centered" isOpen={addVisitRequestModal}>
              <ModalHeaderComponent title="Add Visit Request" imagePath={false} closeModalWindow={() => { showAddVisitRequestModal(false); onReset(); }} response={addVisitRequestInfo} />
              <ModalBody className="mt-0 pt-0">
                <AddVisitRequest
                  editId={false}
                  afterReset={() => { showAddVisitRequestModal(false); onReset(); }}
                />
              </ModalBody>
                </Modal> */}
          </Col>
        ) : ''}
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
