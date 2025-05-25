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
import complianceIcon from '@images/icons/complianceBlack.svg';
import searchActiveIcon from '@images/icons/searchGrey.svg';
import buildingComplianceIcon from '@images/icons/complianceBlue.svg';
import plusCircleMiniIcon from '@images/icons/plusCircleWhite.svg';
import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import reportsIcon from '@images/icons/reports.svg';
import DrawerHeader from '@shared/drawerHeader';

import sideNav from './navlist.json';
import {
  getMenuItems, getAllowedCompanies, generateErrorMessage, getPagesCountV2, getDefaultNoValue,
  getListOfModuleOperations, getModuleDisplayName,
} from '../../util/appUtils';
import {
  getComplianceList, getComplianceCount, getComplianceFilters, resetAddComplianceInfo,
} from '../complianceService';
import {
  getComplianceStateLabel,
} from '../utils/utils';
import { setInitialValues } from '../../purchase/purchaseService';
import AddCompliance from '../addCompliance';
import actionCodes from '../data/complianceActionCodes.json';
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
  COMPLIANCE: complianceIcon,
  REPORTS: reportsIcon,
};

const faIcons = {
  INSIGHTS: searchIcon,
  COMPLIANCE: complianceIcon,
  REPORTS: reportsIcon,
};

const Navbar = (props) => {
  const { id } = props;
  const limit = 10;
  const dispatch = useDispatch();
  const classes = useStyles();
  const history = useHistory();

  const [keyword, setKeyword] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [currentTab, setActive] = useState('Compliance Obligation');
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);
  const [totalDataCount, setTotalCount] = useState(0);
  const [complianceList, setComplianceList] = useState(false);
  const [addComplianceModal, showAddComplianceModal] = useState(false);
  const [logoUrl, setLogoUrl] = useState(null);

    const handleLogoUrlChange = (url) => {
        setLogoUrl(url);
    };

  const module = 'Building Compliance';
  const { userRoles } = useSelector((state) => state.user);
  const { userInfo } = useSelector((state) => state.user);
  const menuList = getMenuItems(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Building Compliance', 'name');
  const title = getModuleDisplayName(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Building Compliance', 'display');

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Building Compliance', 'code');
  const isCreatable = allowedOperations.includes(actionCodes['Add Compliance Obligation']);

  const { complianceInfo, complianceCount, addComplianceInfo } = useSelector((state) => state.compliance);
  const companies = getAllowedCompanies(userInfo);
  useEffect(() => {
    dispatch(setInitialValues(false, false, false, false));
  }, []);

  useEffect(() => {
    if (complianceList) {
      const filters = [{
        key: 'id', value: complianceList.id, label: 'ID', type: 'id',
      }];

      dispatch(getComplianceFilters(filters));
      history.push({ pathname: '/buildingcompliance', state: { id: complianceList.id } });
    }
  }, [complianceList]);

  useEffect(() => {
    if (searchOpen) {
      dispatch(getComplianceList(companies, appModels.BULIDINGCOMPLIANCE, limit, offset, false, false, false, false, 'DESC', 'create_date', keyword));
      dispatch(getComplianceCount(companies, appModels.BULIDINGCOMPLIANCE, false, false, false, false, keyword));
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

  const loading = (complianceCount && complianceCount.loading) || (complianceInfo && complianceInfo.loading);
  const error = (complianceInfo && complianceInfo.err) || (complianceCount && complianceCount.err);

  useEffect(() => {
    if ((complianceInfo && complianceInfo.err) || (complianceCount && complianceCount.err)) {
      setTotalCount(0);
    }
  }, [complianceInfo, complianceCount]);

  useEffect(() => {
    if (complianceCount && complianceCount.length) {
      setTotalCount(complianceCount.length);
    } else {
      setTotalCount(0);
    }
  }, [complianceCount]);

  const onReset = () => {
    dispatch(resetAddComplianceInfo());
  };

  return (
    <>
      <Row className="m-0">
        <Col md="3" sm="3" lg="3" xs="12" className="p-0">
          <h3 className="mt-1 d-flex align-items-center text-break">
            <img src={buildingComplianceIcon} alt="assets" width="25" height="25" className="mb-1 mr-2" />
            {title ? title : sideNav.data.title}
          </h3>
        </Col>
        <Col  md={logoUrl === 'Insights' ? '4': '5'} lg={logoUrl === 'Insights' ? '4': '5'} sm='12' xs='12' className="mt-1">
          <Nav>
            <>
              {menuList && menuList.map((menu) => (
                sideNav && sideNav.data && sideNav.data[menu] && (
                  <NavItem key={menu} onClick={() => { dispatch(getComplianceFilters([], [], [], [])); }}>
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
                        <NavLink className="insights-nav-link" onClick={() => setActive('Compliance Obligation')} href="#">Compliance Obligation</NavLink>
                      </Nav>
                    </Row>
                    <hr className="mb-2 mt-1" />
                    {currentTab === 'Compliance Obligation' ? (
                      <>
                        {complianceInfo && complianceInfo.loading && (
                          <Loader />
                        )}
                        {complianceInfo && complianceInfo.err && (
                          <ErrorContent errorTxt={generateErrorMessage(complianceInfo)} />
                        )}
                        {complianceInfo && complianceInfo.data && complianceInfo.data.length && complianceInfo.data.map((sv) => (
                          <div key={sv.id} aria-hidden className="cursor-pointer" onClick={() => setComplianceList(sv)}>
                            <Row sm="12" md="12" lg="12" className="font-size-10px my-2">
                              <Col sm="9" md="9" lg="9" className="px-0 pl-3">
                                <img
                                  aria-hidden="true"
                                  id="Add"
                                  alt="Add"
                                  width="10px"
                                  className="cursor-pointer mr-1"
                                  src={faIcons.COMPLIANCE}
                                />
                                {getDefaultNoValue(sv.name)}
                              </Col>
                              <Col sm="3" md="3" lg="3" className="font-size-10px light-text p-0">
                                {getDefaultNoValue(getComplianceStateLabel(sv.state))}
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
                  <Button className="float-right insights-add-icon mt-2 min-width-160" onClick={() => showAddComplianceModal(!addComplianceModal)}>
                    <img
                      aria-hidden="true"
                      id="Add"
                      alt="Add"
                      width="15px"
                      className="cursor-pointer ml-0 mr-1 mb-1"
                      src={plusCircleMiniIcon}
                    />
                    <span>
                      Create Compliance
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
              visible={addComplianceModal}
            >

              <DrawerHeader
                title="Create Building Compliance"
                imagePath={false}
                closeDrawer={() => { showAddComplianceModal(false); }}
              />
              <AddCompliance
                closeModal={() => { showAddComplianceModal(false); }}
                afterReset={() => { onReset(); }}
              />
            </Drawer>
            {/*  <Modal size={(addComplianceInfo && addComplianceInfo.data) ? 'sm' : 'xl'} className="border-radius-50px modal-dialog-centered" isOpen={addComplianceModal}>
              <ModalHeaderComponent title="Add Compliance" imagePath={false} closeModalWindow={() => { showAddComplianceModal(false); onReset(); }} response={addComplianceInfo} />
              <ModalBody className="mt-0 pt-0">
                <AddCompliance
                  editId={false}
                  afterReset={() => { showAddComplianceModal(false); onReset(); }}
                />
                <ModalFormAlert alertResponse={addComplianceInfo} alertText="Compliance added successfully.." />
                {complianceInfo && complianceInfo.loading && !addComplianceInfo.loading && (
                <Loader />
                )}
                {addComplianceInfo && addComplianceInfo.data && (<hr />)}
                <div className="float-right">
                  {addComplianceInfo && addComplianceInfo.data && (
                  <Button
                    size="sm"
                    type="button"
                     variant="contained"
                    onClick={() => { showAddComplianceModal(false); onReset(); }}
                    disabled={addComplianceInfo && addComplianceInfo.loading}
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
