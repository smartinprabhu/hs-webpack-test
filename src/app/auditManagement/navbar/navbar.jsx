/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
import * as PropTypes from 'prop-types';
import { Link, useHistory } from 'react-router-dom';
import Pagination from '@material-ui/lab/Pagination';
import { useDispatch, useSelector } from 'react-redux';
import {
  Col,
  Nav,
  NavItem,
  NavLink,
  Row,
  Input,
  Popover,
  PopoverBody,
  Button,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import { makeStyles } from '@material-ui/core/styles';

import searchIcon from '@images/icons/search.svg';
import pantryOrderBlackIcon from '@images/icons/pantry/pantryOrderBlack.svg';
import auditBlueIcon from '@images/icons/auditBlue.svg';
import searchActiveIcon from '@images/icons/searchGrey.svg';
import configurationBlack from '@images/icons/configurationBlack.svg';
import reportsIcon from '@images/icons/reports.svg';
import DrawerHeader from '@shared/drawerHeader';
import plusCircleMiniIcon from '@images/icons/plusCircleWhite.svg';
import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';

import {
  Drawer,
} from 'antd';
import sideNav from './navlist.json';
import AddAudit from '../operations/addAudit';
import {
  getMenuItems, getListOfModuleOperations, generateErrorMessage, getDefaultNoValue, getPagesCountV2, getAllowedCompanies, getModuleDisplayName,
} from '../../util/appUtils';
import { setInitialValues } from '../../purchase/purchaseService';
import actionCodes from '../data/actionCodes.json';
import {
  resetCreateProductCategory,
} from '../../pantryManagement/pantryService';
import {
  getStateLabel,
} from '../utils/utils';
import {
  getAudits, getAuditCount, getNonConformitieFilters,
  getAuditFilters,
} from '../auditService';
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
  OPERATIONS: pantryOrderBlackIcon,
  CONFIGURATION: configurationBlack,
  REPORTS: reportsIcon,
};

const faIcons = {
  INSIGHTS: searchIcon,
  OPERATIONS: pantryOrderBlackIcon,
  CONFIGURATION: configurationBlack,
  REPORTS: reportsIcon,
};

const Navbar = (props) => {
  const { id, module } = props;
  const limit = 10;
  const dispatch = useDispatch();
  const classes = useStyles();
  const history = useHistory();
  const [addModal, showAddModal] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [currentTab, setActive] = useState('Audits');
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);
  const [totalDataCount, setTotalCount] = useState(0);
  const [auditList, setAuditList] = useState(false);

  const { userRoles } = useSelector((state) => state.user);
  const { userInfo } = useSelector((state) => state.user);
  const menuList = getMenuItems(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Audit System', 'name');
  const title = getModuleDisplayName(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Audit System', 'display');
  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Audit System', 'code');
  // const isCreatable = allowedOperations.includes(actionCodes['Create Work Permit']);

  const {
    auditsInfo, auditsCount,
  } = useSelector((state) => state.audit);

  const loading = (auditsCount && auditsCount.loading) || (auditsCount && auditsCount.loading);
  const error = (auditsCount && auditsCount.err) || (auditsCount && auditsCount.err);

  const pages = getPagesCountV2(totalDataCount, limit);
  const companies = getAllowedCompanies(userInfo);
  const [logoUrl, setLogoUrl] = useState(null);

    const handleLogoUrlChange = (url) => {
        setLogoUrl(url);
    };

  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsetValue = (index - 1) * limit;
    setPage(index);
    setOffset(offsetValue);
  };

  useEffect(() => {
    dispatch(setInitialValues(false, false, false, false));
  }, []);

  useEffect(() => {
    if (auditList) {
      const filters = [{
        key: 'id', value: auditList.id, label: 'ID', type: 'id',
      }];

      dispatch(getAuditFilters(filters));
      history.push({ pathname: '/audit-operations', state: { id: auditList.id } });
    }
  }, [auditList]);

  useEffect(() => {
    if (searchOpen) {
      dispatch(getAudits(companies, appModels.SYSTEMAUDIT, limit, offset, false, 'DESC', 'create_date', keyword));
      dispatch(getAuditCount(companies, appModels.SYSTEMAUDIT, [], keyword));
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
    if ((auditsInfo && auditsInfo.err) || (auditsCount && auditsCount.err)) {
      setTotalCount(0);
    }
  }, [auditsInfo, auditsCount]);

  useEffect(() => {
    if (auditsCount && auditsCount.length) {
      setTotalCount(auditsCount.length);
    } else {
      setTotalCount(0);
    }
  }, [auditsCount]);

  const closeAddAudit = () => {
    if (document.getElementById('auditSystemform')) {
      document.getElementById('auditSystemform').reset();
    }
    showAddModal(false);
    dispatch(resetCreateProductCategory());
  };

  return (
    <>
      <Row className="m-0">
        <Col md="3" sm="3" lg="3" xs="12" className="p-0">
          <h3 className="mt-1 d-flex align-items-center text-break">
            <img src={auditBlueIcon} alt="assets" width="25" height="25" className="mb-1 mr-1" />
            {title ? title : sideNav.data.title}
          </h3>
        </Col>
        <Col  md={logoUrl === 'Insights' ? '4': '5'} lg={logoUrl === 'Insights' ? '4': '5'} sm='12' xs='12' className="mt-1">
          <Nav>
            <>
              {menuList && menuList.map((menu) => (
                sideNav && sideNav.data && sideNav.data[menu] && (
                  <NavItem
                    key={menu}
                    onClick={() => {
                      dispatch(setInitialValues(false, false, false, false));
                      dispatch(getNonConformitieFilters([]));
                      dispatch(getAuditFilters([]));
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
              <Col md="6" sm="12" lg="6" className="pr-0">
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
                        <NavLink className="insights-nav-link" onClick={() => setActive('Audits')} href="#">Audits</NavLink>
                      </Nav>
                    </Row>
                    <hr className="mb-2 mt-1" />
                    {currentTab === 'Audits' ? (
                      <>
                        {auditsInfo && auditsInfo.loading && (
                          <Loader />
                        )}
                        {auditsInfo && auditsInfo.err && (
                          <ErrorContent errorTxt={generateErrorMessage(auditsInfo)} />
                        )}
                        {auditsInfo && auditsInfo.data && auditsInfo.data.length && auditsInfo.data.map((sv) => (
                          <div key={sv.id} aria-hidden className="cursor-pointer" onClick={() => setAuditList(sv)}>
                            <Row sm="12" md="12" lg="12" className="font-size-10px my-2">
                              <Col sm="9" md="9" lg="9" className="px-0 pl-3">
                                <img
                                  aria-hidden="true"
                                  id="Add"
                                  alt="Add"
                                  width="10px"
                                  className="cursor-pointer mr-1"
                                  src={faIcons.INSIGHTS}
                                />
                                {getDefaultNoValue(sv.name)}
                              </Col>
                              <Col sm="3" md="3" lg="3" className="font-size-10px light-text p-0">
                                {getDefaultNoValue(getStateLabel(sv.state))}
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
              <Col md="5" sm="5" lg="5" xs="12">
                <Button className="insights-add-icon mt-2 min-width-100" onClick={() => showAddModal(!addModal)}>
                  <img
                    aria-hidden="true"
                    id="Add"
                    alt="Add"
                    width="15px"
                    className="cursor-pointer ml-0 mr-1 mb-1"
                    src={plusCircleMiniIcon}
                  />
                  <span>
                    Create Audit
                  </span>
                </Button>
              </Col>
            </Row>
            <Drawer
              title=""
              closable={false}
              className="drawer-bg-lightblue"
              width={1250}
              visible={addModal}
            >

              <DrawerHeader
                title="Create Audit"
                imagePath={auditBlueIcon}
                closeDrawer={closeAddAudit}
              />
              <AddAudit closeModal={closeAddAudit} />
            </Drawer>
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
  id: PropTypes.string.isRequired,
};

export default Navbar;
