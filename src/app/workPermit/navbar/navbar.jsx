/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
import * as PropTypes from 'prop-types';
import { Link, useHistory } from 'react-router-dom';
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
import Pagination from '@material-ui/lab/Pagination';
import { makeStyles } from '@material-ui/core/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import { Drawer } from 'antd';

import searchIcon from '@images/icons/search.svg';
import operationBlackActive from '@images/icons/operationsBlack.svg';
import configurationBlack from '@images/icons/configurationBlack.svg';
import tankerBlueIcon from '@images/icons/workPermitBlue.svg';
import searchActiveIcon from '@images/icons/searchGrey.svg';
import reportsIcon from '@images/icons/reports.svg';
import plusCircleMiniIcon from '@images/icons/plusCircleWhite.svg';
import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import DrawerHeader from '@shared/drawerHeader';

import sideNav from './navlist.json';
import { setInitialValues } from '../../purchase/purchaseService';
import {
  getMenuItems, getListOfModuleOperations, getAllowedCompanies, getPagesCountV2, generateErrorMessage, getDefaultNoValue, extractTextObject, getModuleDisplayName,
} from '../../util/appUtils';
import {
  getWorkPermitFilters, getWorkPermit, getWorkPermitCount, getWpConfig,
} from '../workPermitService';
import { getPartsData } from '../../preventiveMaintenance/ppmService';
import {
  resetCreateProductCategory,
} from '../../pantryManagement/pantryService';
import actionCodes from '../data/actionCodes.json';
import AddWorkPermit from '../addWorkPermit';
import { setSorting } from '../../assets/equipmentService';
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
  INSIGHTS: searchActiveIcon,
  WORKPERMIT: operationBlackActive,
  CONFIGURATION: configurationBlack,
  REPORTS: reportsIcon,
};

const faActiveIcons = {
  INSIGHTS: searchIcon,
  WORKPERMIT: operationBlackActive,
  CONFIGURATION: configurationBlack,
  REPORTS: reportsIcon,
};

const Navbar = (props) => {
  const { id } = props;
  const limit = 10;
  const dispatch = useDispatch();
  const classes = useStyles();
  const history = useHistory();
  const module = 'Work Permit';
  const [keyword, setKeyword] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [workPermitList, setWorkPermitList] = useState(false);
  const [currentTab, setActive] = useState('Work Permit');
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);
  const [totalDataCount, setTotalCount] = useState(0);
  const [addModal, showAddModal] = useState(false);
  const {
    workPermitsCount, workPermits, workPermitDetail,
  } = useSelector((state) => state.workpermit);
  const {
    addProductCategoryInfo,
  } = useSelector((state) => state.pantry);

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const menuList = getMenuItems(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Work Permit', 'name');
  const title = getModuleDisplayName(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Work Permit', 'display');
  // menuList = menuList.concat(['Configuration']);

  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Work Permit', 'code');
  const isCreatable = allowedOperations.includes(actionCodes['Create Work Permit']);
  const companies = getAllowedCompanies(userInfo);
  const [logoUrl, setLogoUrl] = useState(null);

  const handleLogoUrlChange = (url) => {
    setLogoUrl(url);
  };

  useEffect(() => {
    dispatch(setInitialValues(false, false, false, false));
  }, []);

  const resetFilters = () => {
    dispatch(getWorkPermitFilters([]));
  };

  useEffect(() => {
    dispatch(setSorting({ sortBy: 'DESC', sortField: 'create_date' }));
  }, [id]);

  useEffect(() => {
    if (searchOpen) {
      dispatch(getWorkPermit(companies, appModels.WORKPERMIT, limit, offset, false, 'DESC', 'create_date', keyword));
      dispatch(getWorkPermitCount(companies, appModels.WORKPERMIT, [], keyword));
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

  const loading = (workPermitsCount && workPermitsCount.loading) || (workPermits && workPermits.loading);
  const error = (workPermits && workPermits.err) || (workPermitsCount && workPermitsCount.err);

  useEffect(() => {
    if ((workPermits && workPermits.err) || (workPermitsCount && workPermitsCount.err)) {
      setTotalCount(0);
    }
  }, [workPermits, workPermitsCount]);

  useEffect(() => {
    if (workPermitsCount && workPermitsCount.length) {
      setTotalCount(workPermitsCount.length);
    } else {
      setTotalCount(0);
    }
  }, [workPermitsCount]);

  useEffect(() => {
    if (workPermitList) {
      const filters = [{
        key: 'id', value: workPermitList.id, label: 'ID', type: 'id',
      }];

      dispatch(getWorkPermitFilters(filters));
      history.push({ pathname: '/workpermits', state: { id: workPermitList.id } });
    }
  }, [workPermitList]);

  const onReset = () => {
    dispatch(resetCreateProductCategory());
  };

  const onAddReset = () => {
    dispatch(resetCreateProductCategory());
    showAddModal(false);
  };

  const closeModal = () => {
    if (document.getElementById('workpermitform')) {
      document.getElementById('workpermitform').reset();
    }
    dispatch(getPartsData([]));
    showAddModal(false);
    dispatch(resetCreateProductCategory());
  };

  const onLoadPantry = (eid) => {
    const filters = [{
      key: 'id', value: eid, label: 'ID', type: 'id',
    }];
    dispatch(getWorkPermitFilters(filters));
    history.push({ pathname: '/workpermits', state: { id: workPermitList.id } });
  };

  useEffect(() => {
    if (addModal) {
      dispatch(getWpConfig(companies, appModels.WPCONFIGURATION));
    }
  }, [addModal]);

  return (
    <>
      <Row className="m-0">
        <Col md="3" sm="12" lg="3" xs="12" className="p-0">
          <h3 className="mt-1 d-flex align-items-center text-break">
            <img src={tankerBlueIcon} alt="assets" width="25" height="25" className="mb-1 mr-1" />
            {title || sideNav.data.title}
          </h3>
        </Col>
        <Col md={logoUrl === 'Insights' ? '4' : '5'} lg={logoUrl === 'Insights' ? '4' : '5'} sm="12" xs="12" className="mt-1">
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
        {id === 'Insights' ? (
          <Col md="4" sm="4" lg="4" xs="12">
            <Row className="margin-negative-left-50px margin-negative-right-27px">
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
                        <NavLink className="insights-nav-link" onClick={() => setActive('Work Permit')} href="#">Work Permit</NavLink>
                      </Nav>
                    </Row>
                    <hr className="mb-2 mt-1" />
                    {currentTab === 'Work Permit' ? (
                      <>
                        {workPermits && workPermits.loading && (
                          <Loader />
                        )}
                        {workPermits && workPermits.err && (
                          <ErrorContent errorTxt={generateErrorMessage(workPermits)} />
                        )}
                        {workPermits && workPermits.data && workPermits.data.length && workPermits.data.map((wp) => (
                          <div key={wp.id} aria-hidden className="cursor-pointer" onClick={() => setWorkPermitList(wp)}>
                            <Row sm="12" md="12" lg="12" className="font-size-10px my-2">
                              <Col sm="4" md="4" lg="4" className="px-0 pl-3">
                                <img
                                  aria-hidden="true"
                                  id="Add"
                                  alt="Add"
                                  width="10px"
                                  className="cursor-pointer mr-1"
                                  src={faIcons.WORKPERMIT}
                                />
                                {getDefaultNoValue(wp.name)}
                              </Col>
                              <Col sm="5" md="5" lg="5" className="font-size-10px light-text p-0">
                                {getDefaultNoValue(extractTextObject(wp.requestor_id))}
                              </Col>
                              <Col sm="3" md="3" lg="3" className="font-size-10px light-text p-0">
                                {getDefaultNoValue(extractTextObject(wp.vendor_id))}
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
                  <Button className="float-right insights-add-icon mt-2 min-width-160" onClick={() => showAddModal(!addModal)}>
                    <img
                      aria-hidden="true"
                      id="Add"
                      alt="Add"
                      width="15px"
                      className="cursor-pointer ml-0 mr-1 mb-1"
                      src={plusCircleMiniIcon}
                    />
                    <span>
                      Create Work Permit
                    </span>
                  </Button>
                )}
              </Col>
            </Row>
            {/* <Modal size={(addProductCategoryInfo && addProductCategoryInfo.data) ? 'sm' : 'xl'} className="border-radius-50px modal-dialog-centered" isOpen={addModal}>
              <ModalHeaderComponent title="Add Work Permit" imagePath={false} closeModalWindow={() => { showAddModal(false); onReset(); }} response={addProductCategoryInfo} />
              <ModalBody className="mt-0 pt-0">
                <AddWorkPermit
                  closeModal={closeModal}
                />
                <ModalFormAlert alertResponse={addProductCategoryInfo} alertText="Work Permit added successfully.." />
                {workPermits && workPermits.loading && !addProductCategoryInfo.loading && (
                  <Loader />
                )}
                {(addProductCategoryInfo && addProductCategoryInfo.data) && (
                  <>
                    {workPermitDetail && workPermitDetail.data && (
                    <p className="text-center mt-2 mb-0 tab_nav_link">
                      Click here to view
                      {' '}
                      Work Permit
                      :
                      <span aria-hidden="true" className="ml-2 cursor-pointer text-info" onClick={() => onLoadPantry(workPermitDetail.data[0].id)}>{workPermitDetail.data[0].name}</span>
                      {' '}
                      details
                    </p>
                    )}
                  </>
                )}
                {addProductCategoryInfo && addProductCategoryInfo.data && (<hr />)}
                <div className="float-right">
                  {addProductCategoryInfo && addProductCategoryInfo.data && (
                    <Button
                      size="sm"
                      type="button"
                       variant="contained"
                      onClick={() => onAddReset()}
                      disabled={addProductCategoryInfo && addProductCategoryInfo.loading}
                    >
                      OK
                    </Button>
                  )}
                </div>
              </ModalBody>
                  </Modal> */}
          </Col>
        ) : ''}
        <Drawer
          title=""
          closable={false}
          className="drawer-bg-lightblue"
          width={1250}
          visible={addModal}
        >

          <DrawerHeader
            title="Create Work Permit"
            imagePath={tankerBlueIcon}
            closeDrawer={closeModal}
          />
          <AddWorkPermit
            isShow={Math.random()}
            afterReset={() => { onReset(); }}
            closeModal={() => { showAddModal(false); }}
            visibility={addModal}
          />
        </Drawer>
        <div className="pt-1 top-right-col">
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
