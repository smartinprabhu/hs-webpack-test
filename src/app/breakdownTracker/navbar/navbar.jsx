/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
import * as PropTypes from 'prop-types';
import { Link, useHistory } from 'react-router-dom';
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
// import complianceIcon from '@images/icons/complianceBlack.svg';

import TrackerIcon from '@images/icons/breakTrackerBlack.svg';
import searchActiveIcon from '@images/icons/searchGrey.svg';
import buildingTrackerIcon from '@images/icons/breakTrackerBlue.svg';
import plusCircleMiniIcon from '@images/icons/plusCircleWhite.svg';
import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import reportsIcon from '@images/icons/reports.svg';
import DrawerHeader from '@shared/drawerHeader';

import sideNav from './navlist.json';
import {
  getMenuItems, getAllCompanies, generateErrorMessage, getPagesCountV2, getDefaultNoValue,
  getListOfModuleOperations, extractTextObject,
} from '../../util/appUtils';
import {
  getTrackerList, getTrackerCount, getTrackerFilters, resetAddTrackerInfo,
} from '../breakdownService';
import { setInitialValues } from '../../purchase/purchaseService';
import AddTracker from '../addBreakdown';
import actionCodes from '../data/actionCodes.json';
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
  BREAKDOWNTRACKERS: TrackerIcon,
  REPORTS: reportsIcon,
};

const faIcons = {
  INSIGHTS: searchIcon,
  BREAKDOWNTRACKERS: TrackerIcon,
  REPORTS: reportsIcon,
};

const Navbar = (props) => {
  const { id } = props;
  const limit = 10;
  const dispatch = useDispatch();
  const classes = useStyles();
  const history = useHistory();
  const module = 'Breakdown Tracker'
  const [keyword, setKeyword] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [currentTab, setActive] = useState('Breakdown Tracker');
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);
  const [totalDataCount, setTotalCount] = useState(0);
  const [complianceList, setTrackerList] = useState(false);
  const [addTrackerModal, showAddTrackerModal] = useState(false);

  const { userRoles } = useSelector((state) => state.user);
  const { userInfo } = useSelector((state) => state.user);
  const menuList = getMenuItems(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Breakdown Tracker', 'name');
  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Breakdown Tracker', 'code');
  const isCreatable = allowedOperations.includes(actionCodes['Add Breakdown Tracker']);

  const [logoUrl, setLogoUrl] = useState(null);

  const handleLogoUrlChange = (url) => {
      setLogoUrl(url);
  };
  
  const { trackerInfo, trackerCount, addTrackerInfo } = useSelector((state) => state.breakdowntracker);
  const companies = getAllCompanies(userInfo, userRoles);
  useEffect(() => {
    dispatch(setInitialValues(false, false, false, false));
  }, []);

  useEffect(() => {
    if (complianceList) {
      const filters = [{
        key: 'id', value: complianceList.id, label: 'ID', type: 'id',
      }];

      dispatch(getTrackerFilters(filters));
      history.push({ pathname: '/breakdown-tracker', state: { id: complianceList.id } });
    }
  }, [complianceList]);

  useEffect(() => {
    if (searchOpen) {
      dispatch(getTrackerList(companies, appModels.BREAKDOWNTRACKER, limit, offset, false, 'DESC', 'create_date', keyword));
      dispatch(getTrackerCount(companies, appModels.BREAKDOWNTRACKER, [], keyword));
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

  const loading = (trackerCount && trackerCount.loading) || (trackerInfo && trackerInfo.loading);
  const error = (trackerInfo && trackerInfo.err) || (trackerCount && trackerCount.err);

  useEffect(() => {
    if ((trackerInfo && trackerInfo.err) || (trackerCount && trackerCount.err)) {
      setTotalCount(0);
    }
  }, [trackerInfo, trackerCount]);

  useEffect(() => {
    if (trackerCount && trackerCount.length) {
      setTotalCount(trackerCount.length);
    } else {
      setTotalCount(0);
    }
  }, [trackerCount]);

  const onReset = () => {
    dispatch(resetAddTrackerInfo());
  };
  return (
    <>
      <Row className="m-0">
        <Col md="3" sm="3" lg="3" xs="12" className="p-0">
          <h3 className="mt-1">
            <img src={buildingTrackerIcon} alt="assets" width="25" height="25" className="mb-1 mr-2" />
            {sideNav.data.title}
          </h3>
        </Col>
        <Col  md={logoUrl === 'Insights' ? '4': '5'} lg={logoUrl === 'Insights' ? '4': '5'} sm='12' xs='12' className="mt-1">
          <Nav>
            <>
              {menuList && menuList.map((menu) => (
                sideNav && sideNav.data && sideNav.data[menu] && (
                  <NavItem key={menu} onClick={() => { dispatch(getTrackerFilters([], [], [], [])); }}>
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
            <Row className="margin-negative-left-90px margin-negative-right-27px">
              <Col md="6" sm="12" lg="6" className="pr-4">
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
                        <NavLink className="insights-nav-link" onClick={() => setActive('Breakdown Tracker')} href="#">Breakdown Tracker</NavLink>
                      </Nav>
                    </Row>
                    <hr className="mb-2 mt-1" />
                    {currentTab === 'Breakdown Tracker' ? (
                      <>
                        {trackerInfo && trackerInfo.loading && (
                          <Loader />
                        )}
                        {trackerInfo && trackerInfo.err && (
                          <ErrorContent errorTxt={generateErrorMessage(trackerInfo)} />
                        )}
                        {trackerInfo && trackerInfo.data && trackerInfo.data.length && trackerInfo.data.map((sv) => (
                          <div key={sv.id} aria-hidden className="cursor-pointer" onClick={() => setTrackerList(sv)}>
                            <Row sm="12" md="12" lg="12" className="font-size-10px my-2">
                              <Col sm="6" md="6" lg="6" className="px-0 pl-3">
                                <img
                                  aria-hidden="true"
                                  id="Add"
                                  alt="Add"
                                  width="10px"
                                  className="cursor-pointer mr-1"
                                  src={faIcons.BREAKDOWNTRACKERS}
                                />
                                {getDefaultNoValue(sv.name)}
                              </Col>
                              <Col sm="3" md="3" lg="3" className="font-size-10px light-text p-0">
                                {getDefaultNoValue(extractTextObject(sv.service_category_id))}
                              </Col>
                              <Col sm="3" md="3" lg="3" className="font-size-10px light-text p-0">
                                {getDefaultNoValue(extractTextObject(sv.raised_by_id))}
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
              <Col sm="12" lg="4" md="4">
                {isCreatable && (
                  <Button className="float-right insights-add-icon mt-2 min-width-160" onClick={() => showAddTrackerModal(!addTrackerModal)}>
                    <img
                      aria-hidden="true"
                      id="Add"
                      alt="Add"
                      width="15px"
                      className="cursor-pointer ml-0 mr-1 mb-1"
                      src={plusCircleMiniIcon}
                    />
                    <span>
                      Create Tracker
                    </span>
                  </Button>
                )}
              </Col>
            </Row>
            <Drawer
              title=""
              closable={false}
              className="drawer-bg-lightblue create-building-compliance"
              width={1250}
              visible={addTrackerModal}
            >

              <DrawerHeader
                title="Create Breakdown Tracker"
                imagePath={false}
                closeDrawer={() => { showAddTrackerModal(false); }}
              />
              <AddTracker
                isShow={addTrackerModal}
                closeModal={() => { showAddTrackerModal(false); }}
                afterReset={() => { onReset(); }}
              />
            </Drawer>
            {/* <Modal size={(addTrackerInfo && addTrackerInfo.data) ? 'sm' : 'xl'} className="border-radius-50px modal-dialog-centered" isOpen={addTrackerModal}>
              <ModalHeaderComponent title="Add Tracker" imagePath={false} closeModalWindow={() => { showAddTrackerModal(false); onReset(); }} response={addTrackerInfo} />
              <ModalBody className="mt-0 pt-0">
                <AddTracker
                  editId={false}
                  afterReset={() => { showAddTrackerModal(false); onReset(); }}
                />
                <ModalFormAlert alertResponse={addTrackerInfo} alertText="Tracker added successfully.." />
                {trackerInfo && trackerInfo.loading && !addTrackerInfo.loading && (
                <Loader />
                )}
                {addTrackerInfo && addTrackerInfo.data && (<hr />)}
                <div className="float-right">
                  {addTrackerInfo && addTrackerInfo.data && (
                  <Button
                    size="sm"
                    type="button"
                     variant="contained"
                    onClick={() => { showAddTrackerModal(false); onReset(); }}
                    disabled={addTrackerInfo && addTrackerInfo.loading}
                  >
                    OK
                  </Button>
                  )}
                </div>
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
