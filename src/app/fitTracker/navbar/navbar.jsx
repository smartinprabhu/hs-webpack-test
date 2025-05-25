/* eslint-disable import/no-cycle */
/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
import Pagination from '@material-ui/lab/Pagination';
import { useDispatch, useSelector } from 'react-redux';
import * as PropTypes from 'prop-types';
import { Link, useHistory } from 'react-router-dom';
import {
  Col,
  Nav,
  NavItem,
  NavLink,
  Row,
  Button,
  Input,
  Popover,
  PopoverBody,
} from 'reactstrap';
import { makeStyles } from '@material-ui/core/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import { Drawer } from 'antd';

import searchIcon from '@images/icons/search.svg';
import searchGrey from '@images/icons/searchGrey.svg';
import ticketBlack from '@images/icons/ticketBlack.svg';
import ticketGrey from '@images/icons/ticketGrey.svg';
import raiseTicket from '@images/icons/raiseTicketNav.svg';
import reportsIcon from '@images/icons/reports.svg';
import ticketIcon from '@images/icons/fitTrackerBlue.svg';
import plusCircleMiniIcon from '@images/icons/plusCircleWhite.svg';

import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import DrawerHeader from '@shared/drawerHeader';

import sideNav from './navlist.json';
import {
  getMenuItems, getAllowedCompanies, generateErrorMessage, getLocalTime, getPagesCountV2,
  getListOfOperations, getModuleDisplayName,
} from '../../util/appUtils';
import { setInitialValues } from '../../purchase/purchaseService';
import {
  getHelpdeskFilter, getMaintenanceConfigurationData, getExtraSelectionMultiple, resetImage, resetAddTicket, getExtraSelectionMultipleCount, activeStepInfo,
} from '../../helpdesk/ticketService';
import actionCodes from '../../helpdesk/data/helpdeskActionCodes.json';
import AddTicket from '../../helpdesk/addTicket';
import DocumentViewer from '../../shared/documentViewer';

const faIcons = {
  INSIGHTS: searchGrey,
  INSIGHTSACTIVE: searchIcon,
  TICKETS: ticketGrey,
  REPORT: reportsIcon,
  TICKETSACTIVE: ticketBlack,
  ADD_TICKET: raiseTicket,
  ADD_TICKETACTIVE: raiseTicket,
  REPORTS_ACTIVE: reportsIcon,
};
const appModels = require('../../util/appModels').default;

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const Navbar = (props) => {
  const { id } = props;
  const limit = 10;
  const classes = useStyles();
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const history = useHistory();
  const module = 'FIT Tracker'
  const { userRoles, userInfo } = useSelector((state) => state.user);
  const menuList = getMenuItems(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'FIT Tracker', 'name');
  const title = getModuleDisplayName(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'FIT Tracker', 'display');
  const [logoUrl, setLogoUrl] = useState(null);

  const handleLogoUrlChange = (url) => {
      setLogoUrl(url);
  };
  const {
    listDataMultipleInfo, listDataMultipleCountInfo, listDataMultipleCountLoading, listDataMultipleCountErr,
  } = useSelector((state) => state.ticket);

  const allowedOperations = getListOfOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'code');

  useEffect(() => {
    dispatch(setInitialValues(false, false, false, false));
  }, []);

  const [addTicketModal, showAddTicketModal] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [ticket, setTicket] = useState(false);
  const [offset, setOffset] = useState(0);

  const columns = ['ticket_number', 'category_id', 'subject', 'create_date'];

  const companies = getAllowedCompanies(userInfo);

  const [totalDataCount, setTotalCount] = useState(0);

  useEffect(() => {
    if (searchOpen) {
      const searchValueMultiple = `["&",["company_id","in",[${companies}]],["unattended_ppm", "!=", true],["maintenance_type","=","bm"],["issue_type","!=","incident"],["help_problem_id","!=","incident"],"|",["ticket_number", "ilike", "${keyword}"],["subject", "ilike", "${keyword}"]]`;
      dispatch(getExtraSelectionMultipleCount(companies, appModels.HELPDESK, columns, searchValueMultiple));
      dispatch(getExtraSelectionMultiple(companies, appModels.HELPDESK, limit, offset, columns, searchValueMultiple, true));
      setTotalCount(0);
    }
  }, [searchOpen, offset, keyword]);

  useEffect(() => {
    if (listDataMultipleCountInfo && listDataMultipleCountInfo.length) {
      setTotalCount(listDataMultipleCountInfo.length);
    } else if (listDataMultipleCountInfo && (listDataMultipleCountInfo.loading || listDataMultipleCountInfo.err)) {
      setTotalCount(0);
    }
  }, [listDataMultipleCountInfo]);

  useEffect(() => {
    if ((listDataMultipleInfo && listDataMultipleInfo.err) || (listDataMultipleCountErr)) {
      setTotalCount(0);
    }
  }, [listDataMultipleInfo, listDataMultipleCountErr]);

  const pages = getPagesCountV2(totalDataCount, limit);

  useEffect(() => {
    if (ticket) {
      const filters = [{
        key: 'id', value: ticket.id, label: 'ID', type: 'id',
      }];
      const filterValues = {
        statusValues: [],
        categories: [],
        priorities: [],
        customFilters: filters,
      };
      dispatch(getHelpdeskFilter(filterValues));
      history.push({ pathname: '/fitTracker/tickets', state: { id: ticket.id } });
    }
  }, [ticket]);

  /* useEffect(() => {
    if (addTicketModal) {
      history.push({ pathname: '/helpdesk/add-ticket', state: { insights: true } });
    }
  }, [addTicketModal]); */

  const onAddReset = () => {
    if (document.getElementById('checkoutForm')) {
      document.getElementById('checkoutForm').reset();
    }
    dispatch(activeStepInfo(0));
    showAddTicketModal(false);
    dispatch(resetImage());
    dispatch(resetAddTicket());
  };

  useEffect(() => {
    if (!searchOpen) {
      setKeyword('');
      setPage(1);
      setOffset(0);
    }
  }, [searchOpen]);

  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsetValue = (index - 1) * limit;
    setPage(index);
    setOffset(offsetValue);
  };

  const loading = (listDataMultipleInfo && listDataMultipleInfo.loading) || (listDataMultipleCountLoading);

  return (
    <>
      <Row className="m-0 helpDesk-header">
        <Col md="3" sm="3" lg="3" xs="12" className="pl-0">
          <h3 className="mt-1 d-flex align-items-center text-break">
            <img src={ticketIcon} alt="actions" className="mr-3 mb-1" width="30" height="30" />
            {sideNav.data.title}
          </h3>
        </Col>
        <Col  md={logoUrl === 'Insights' ? '4': '5'} lg={logoUrl === 'Insights' ? '4': '5'} sm='12' xs='12' className="mt-1 margin-negative-left-30px">
          <Nav>
            {menuList && menuList.map((menu, index) => (
              sideNav && sideNav.data && sideNav.data[menu] && (
                <NavItem key={menu} onClick={() => (index)}>
                  <NavLink className={sideNav.data[menu].displayname === id ? 'navbar-link active p-1 mr-4' : 'navbar-link p-1 mr-4'} tag={Link} to={`${sideNav.data[menu].pathName}`}>
                    <img
                      src={faIcons[sideNav.data[menu].name]}
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
            <Row className="margin-negative-left-90px margin-negative-right-55px">
              <Col md="6" sm="12" lg="6">
                <Input
                  className="rounded-pill mt-2 padding-left-30px"
                  id="asset-search"
                  value={keyword}
                  bsSize="sm"
                  placeholder="Search Here"
                  autoComplete="off"
                  onClick={() => { setSearchOpen(!searchOpen); setPage(1); setOffset(0); }}
                  onChange={(e) => setKeyword(e.target.value)}
                />
                <FontAwesomeIcon color="lightgrey" className="insights-search-icon bg-white" icon={faSearch} />
                <Popover trigger="legacy" className="search-width-popover search-popover" placement="bottom" isOpen={searchOpen} target="asset-search" toggle={() => setSearchOpen(!searchOpen)}>
                  <PopoverBody>
                    <Row>
                      <Nav>
                        <NavLink className="insights-nav-link">Tickets</NavLink>
                      </Nav>
                    </Row>
                    <hr className="mb-2 mt-1" />
                    <>
                      {loading && (
                        <Loader />
                      )}
                      {listDataMultipleInfo && listDataMultipleInfo.err && (
                        <ErrorContent errorTxt={generateErrorMessage(listDataMultipleInfo)} />
                      )}
                      {!loading && listDataMultipleInfo && listDataMultipleInfo.data && listDataMultipleInfo.data.length && listDataMultipleInfo.data.map((tickets) => (
                        <div key={tickets.ticket_number} aria-hidden className="cursor-pointer" onClick={() => setTicket(tickets)}>
                          <Row sm="12" md="12" lg="12" className="font-size-10px my-2">
                            <Col sm="4" md="4" lg="4" className="px-0 pl-3">
                              <img
                                aria-hidden="true"
                                id="Add"
                                alt="Add"
                                width="10px"
                                className="cursor-pointer mr-1"
                                src={faIcons.TICKETS}
                              />
                              {tickets.ticket_number}
                            </Col>
                            <Col sm="4" md="4" lg="4" className="font-size-10px">
                              {tickets.subject}
                            </Col>
                            <Col sm="4" md="4" lg="4" className="font-size-10px light-text p-0">
                              {getLocalTime(tickets.create_date)}
                            </Col>
                          </Row>
                        </div>
                      ))}
                      {keyword === '' || loading || pages === 0 ? (<span />) : (
                        <div className={`${classes.root} float-right`}>
                          <Pagination count={pages} page={page} size="small" color="primary" onChange={handlePageClick} className="font-11" showFirstButton showLastButton />
                        </div>
                      )}
                    </>
                  </PopoverBody>
                </Popover>
              </Col>
              <Col sm="12" lg="4" md="4">
                {allowedOperations.includes(actionCodes['Raise a ticket']) && (
                  <Button className="float-right insights-add-icon mt-2" onClick={() => showAddTicketModal(!addTicketModal)}>
                    <img
                      aria-hidden="true"
                      id="Add"
                      alt="Add"
                      width="15px"
                      className="cursor-pointer ml-0 mb-1"
                      src={plusCircleMiniIcon}
                    />
                    <span className="float-right pr-1">
                      Raise a Ticket
                    </span>
                  </Button>
                )}
              </Col>
            </Row>
          </Col>
        ) : ''}
        <div className='pt-1 top-right-col'>
          <DocumentViewer module={module} setLogoUrl={setLogoUrl} />
        </div>
      </Row>
      <Drawer
        title=""
        closable={false}
        className="drawer-bg-lightblue"
        width={1250}
        visible={addTicketModal}
      >

        <DrawerHeader
          title="Raise a Ticket"
          imagePath={ticketIcon}
          closeDrawer={() => onAddReset()}
        />
        <AddTicket editLink={addTicketModal} isFITTracker randomProp={false} editIds={false} closeModal={() => showAddTicketModal(false)} afterReset={onAddReset} isDrawer />
      </Drawer>
      <hr className="m-0 mt-1" />
    </>
  );
};

Navbar.propTypes = {
  id: PropTypes.string.isRequired,
};

export default Navbar;
