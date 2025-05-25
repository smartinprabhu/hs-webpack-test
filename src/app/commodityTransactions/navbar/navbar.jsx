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
import { Drawer } from 'antd';
import Pagination from '@material-ui/lab/Pagination';
import { makeStyles } from '@material-ui/core/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
} from '@fortawesome/free-solid-svg-icons';

import searchIcon from '@images/icons/search.svg';
import operationBlackActive from '@images/icons/operationsBlack.svg';
import tankerBlueIcon from '@images/icons/tankerBlue.svg';
import searchActiveIcon from '@images/icons/searchGrey.svg';
import reportsIcon from '@images/icons/reports.svg';
import plusCircleMiniIcon from '@images/icons/plusCircleWhite.svg';
import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import DrawerHeader from '@shared/drawerHeader';

import sideNav from './navlist.json';
import { setInitialValues } from '../../purchase/purchaseService';
import {
  getMenuItems, getListOfModuleOperations, getAllowedCompanies, getPagesCountV2, generateErrorMessage, getDefaultNoValue, extractTextObject,
  getModuleDisplayName,
} from '../../util/appUtils';
import { getTankerFilters, getTanker, getTankerCount } from '../tankerService';
import {
  resetCreateProductCategory,
} from '../../pantryManagement/pantryService';
import actionCodes from '../data/actionCodes.json';
import AddTransaction from '../operations/addTransaction';
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
  OPERATIONS: operationBlackActive,
  REPORTS: reportsIcon,
};

const faActiveIcons = {
  INSIGHTS: searchIcon,
  OPERATIONS: operationBlackActive,
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
  const [transactionList, setTransactionList] = useState(false);
  const [currentTab, setActive] = useState('Transaction');
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);
  const [totalDataCount, setTotalCount] = useState(0);
  const [addModal, showAddModal] = useState(false);
  const [logoUrl, setLogoUrl] = useState(null);
  const handleLogoUrlChange = (url) => {
      setLogoUrl(url);
  };

  const {
    tankerTransactionsCount, tankerTransactions,
  } = useSelector((state) => state.tanker);
  const {
    addProductCategoryInfo,
  } = useSelector((state) => state.pantry);
  const module = 'Commodity Transactions';
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const menuList = getMenuItems(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Commodity Transactions', 'name');
  const title = getModuleDisplayName(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Commodity Transactions', 'display');
  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Commodity Transactions', 'code');
  const isCreatable = allowedOperations.includes(actionCodes['Create Transaction']);
  const companies = getAllowedCompanies(userInfo);

  useEffect(() => {
    dispatch(setInitialValues(false, false, false, false));
  }, []);

  const resetFilters = () => {
    dispatch(getTankerFilters([]));
  };

  useEffect(() => {
    if (searchOpen) {
      dispatch(getTanker(companies, appModels.TANKERTRANSACTIONS, limit, offset, false, 'DESC', 'create_date', keyword));
      dispatch(getTankerCount(companies, appModels.TANKERTRANSACTIONS, [], keyword));
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

  const loading = (tankerTransactionsCount && tankerTransactionsCount.loading) || (tankerTransactions && tankerTransactions.loading);
  const error = (tankerTransactions && tankerTransactions.err) || (tankerTransactionsCount && tankerTransactionsCount.err);

  useEffect(() => {
    if ((tankerTransactions && tankerTransactions.err) || (tankerTransactionsCount && tankerTransactionsCount.err)) {
      setTotalCount(0);
    }
  }, [tankerTransactions, tankerTransactionsCount]);

  useEffect(() => {
    if (tankerTransactionsCount && tankerTransactionsCount.length) {
      setTotalCount(tankerTransactionsCount.length);
    } else {
      setTotalCount(0);
    }
  }, [tankerTransactionsCount]);

  useEffect(() => {
    if (transactionList) {
      const filters = [{
        key: 'id', value: transactionList.id, label: 'ID', type: 'id',
      }];

      dispatch(getTankerFilters(filters));
      history.push({ pathname: '/commodity/operations', state: { id: transactionList.id } });
    }
  }, [transactionList]);

  const onReset = () => {
    if (document.getElementById('configTransactionForm')) {
      document.getElementById('configTransactionForm').reset();
    }
    showAddModal(false);
    dispatch(resetCreateProductCategory());
  };

  const closeModal = () => {
    showAddModal(false);
    dispatch(resetCreateProductCategory());
  };


  return (
    <>
      <Row className="m-0">
        <Col md="4" sm="12" lg="4" xs="12" className="p-0">
          <h3 className="mt-1 d-flex align-items-center">
            <img src={tankerBlueIcon} alt="assets" width="25" height="25" className="mb-1 mr-1" />
            {title ? title : sideNav.data.title}
          </h3>
        </Col>
        <Col md="4" sm="12" lg="4" xs="12" className="mt-1 p-0">
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
              <Col md="7" sm="7" lg="7">
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
                        <NavLink className="insights-nav-link" onClick={() => setActive('Transaction')} href="#">Transaction</NavLink>
                      </Nav>
                    </Row>
                    <hr className="mb-2 mt-1" />
                    {currentTab === 'Transaction' ? (
                      <>
                        {tankerTransactions && tankerTransactions.loading && (
                          <Loader />
                        )}
                        {tankerTransactions && tankerTransactions.err && (
                          <ErrorContent errorTxt={generateErrorMessage(tankerTransactions)} />
                        )}
                        {tankerTransactions && tankerTransactions.data && tankerTransactions.data.length && tankerTransactions.data.map((transaction) => (
                          <div key={transaction.id} aria-hidden className="cursor-pointer" onClick={() => setTransactionList(transaction)}>
                            <Row sm="12" md="12" lg="12" className="font-size-10px my-2">
                              <Col sm="4" md="4" lg="4" className="px-0 pl-3">
                                <img
                                  aria-hidden="true"
                                  id="Add"
                                  alt="Add"
                                  width="10px"
                                  className="cursor-pointer mr-1"
                                  src={faIcons.OPERATIONS}
                                />
                                {getDefaultNoValue(extractTextObject(transaction.commodity))}
                              </Col>
                              <Col sm="5" md="5" lg="5" className="font-size-10px light-text p-0">
                                {getDefaultNoValue(transaction.capacity)}
                              </Col>
                              <Col sm="3" md="3" lg="3" className="font-size-10px light-text p-0">
                                {getDefaultNoValue(extractTextObject(transaction.vendor_id))}
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
              <Col sm="5" lg="5" md="5" className="">
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
                      Create Transaction
                    </span>
                  </Button>
                )}
              </Col>
            </Row>
            <Drawer
              title=""
              closable={false}
              width={736}
              className="drawer-bg-lightblue"
              visible={addModal}
            >
              <DrawerHeader
                title="Add Transaction"
                imagePath={tankerBlueIcon}
                closeDrawer={() => { showAddModal(false); onReset(); }}
              />
              <AddTransaction closeModal={() => { showAddModal(false); onReset(); }} />
            </Drawer>
            {/* <Modal size={(addProductCategoryInfo && addProductCategoryInfo.data) ? 'sm' : 'xl'} className="border-radius-50px modal-dialog-centered" isOpen={addModal}>
              <ModalHeaderComponent title="Add Transaction" imagePath={false} closeModalWindow={() => { showAddModal(false); onReset(); }} response={addProductCategoryInfo} />
              <ModalBody className="mt-0 pt-0">
                <AddTransaction
                  closeModal={closeModal}
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
  id: PropTypes.string.isRequired,
};

export default Navbar;
