/* eslint-disable import/no-cycle */
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
import helpdesk from '@images/icons/incidentManagement.svg';
import plusCircleMiniIcon from '@images/icons/plusCircleWhite.svg';
import ticketIcon from '@images/icons/ticketBlue.svg';

import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import DrawerHeader from '@shared/drawerHeader';

import sideNav from './navlist.json';
import {
  getAllowedCompanies, generateErrorMessage, getLocalTime, getPagesCountV2, getModuleDisplayName,
} from '../../util/appUtils';
import AddIncident from '../reportIncident';
import { setInitialValues } from '../../purchase/purchaseService';
import {
  resetImage, resetAddTicket, getMaintenanceConfigurationData, getHelpdeskFilter, getExtraSelectionMultiple, getExtraSelectionMultipleCount, activeStepInfo,
} from '../../helpdesk/ticketService';
import { IncidentModule } from '../../util/field';
import DocumentViewer from '../../shared/documentViewer';

const faIcons = {
  INSIGHTS: searchGrey,
  INSIGHTSACTIVE: searchIcon,
  INCIDENTS: ticketGrey,
  REPORTS: reportsIcon,
  INCIDENTSACTIVE: ticketBlack,
  ADD_INCIDENT: raiseTicket,
  ADD_INCIDENTACTIVE: raiseTicket,
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
  const { userRoles } = useSelector((state) => state.user);

  const menuList = ['Insights', 'Incidents']; // getMenuItems(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Helpdesk', 'name');
  const module = 'Incident Management'
  const title = getModuleDisplayName(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], module, 'display');
  const {
    listDataMultipleInfo, listDataMultipleCountInfo, listDataMultipleCountLoading, listDataMultipleCountErr,
  } = useSelector((state) => state.ticket);
  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(setInitialValues(false, false, false, false));
  }, []);

  const [addTicketModal, showAddTicketModal] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [ticket, setTicket] = useState(false);
  const [currentTab, setActive] = useState('Incidents');
  const [offset, setOffset] = useState(0);
  const [logoUrl, setLogoUrl] = useState(null);

  const handleLogoUrlChange = (url) => {
    setLogoUrl(url);
  };


  const columns = IncidentModule.incidentColumns;

  const companies = getAllowedCompanies(userInfo);

  const [totalDataCount, setTotalCount] = useState(0);

  useEffect(() => {
    if (searchOpen) {
      const searchValueMultiple = `["&",["company_id","in",[${companies}]],["issue_type","=","incident"],"|",["ticket_number", "ilike", "${keyword}"],["subject", "ilike", "${keyword}"]]`;
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
      history.push({ pathname: '/incident/incidents', state: { id: ticket.id } });
    }
  }, [ticket]);

  useEffect(() => {
    if (!searchOpen) {
      setKeyword('');
      setPage(1);
      setOffset(0);
    }
  }, [searchOpen]);

  const onAddReset = () => {
    if (document.getElementById('checkoutForm')) {
      document.getElementById('checkoutForm').reset();
    }
    dispatch(activeStepInfo(0));
    showAddTicketModal(false);
    dispatch(resetImage());
    dispatch(resetAddTicket());
  };

  const handlePageClick = (e, index) => {
    e.preventDefault();
    const offsetValue = (index - 1) * limit;
    setPage(index);
    setOffset(offsetValue);
  };

  const loading = (listDataMultipleInfo && listDataMultipleInfo.loading) || (listDataMultipleCountLoading);

  return (
    <>
      <Row className="m-0">
        <Col md="3" sm="3" lg="3" xs="12" className="p-0">
          <h3 className="mt-1 d-flex align-items-center text-break">
            <img src={helpdesk} alt="actions" className="mb-1 mr-3" width="25" height="25" />
            {title ? title : sideNav.data.title}
          </h3>
        </Col>
        <Col md={logoUrl === 'Insights' ? '4' : '5'} lg={logoUrl === 'Insights' ? '4' : '5'} sm='12' xs='12' className="mt-1">
          <Nav>
            {menuList && menuList.map((menu, index) => (
              sideNav && sideNav.data && sideNav.data[menu] && (
                <NavItem key={menu} onClick={() => (index)}>
                  <NavLink className={(index + 1) === id ? 'navbar-link active p-1 mr-4' : 'navbar-link p-1 mr-4'} tag={Link} to={`${sideNav.data[menu].pathName}`}>
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
        {id === 1 ? (
          <Col md="4" sm="4" lg="4" xs="12">
            <Row className="margin-negative-left-90px margin-negative-right-17px">
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
                <Popover trigger="legacy" className="search-popover" placement="bottom" isOpen={searchOpen} target="asset-search" toggle={() => setSearchOpen(!searchOpen)}>
                  <PopoverBody>
                    <Row>
                      <Nav>
                        <NavLink className="insights-nav-link" onClick={() => setActive('Incidents')} href="#">Incidents</NavLink>
                      </Nav>
                    </Row>
                    <hr className="mb-2 mt-1" />
                    {currentTab === 'Incidents' ? (
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
                                  src={faIcons.INSIGHTS}
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
                    ) : ''}
                  </PopoverBody>
                </Popover>
              </Col>
              <Col sm="12" lg="4" md="4">
                <Button className="float-right insights-add-icon width-150px mt-2" onClick={() => showAddTicketModal(!addTicketModal)}>
                  <img
                    aria-hidden="true"
                    id="Add"
                    alt="Add"
                    width="15px"
                    className="cursor-pointer ml-0 mb-1"
                    src={plusCircleMiniIcon}
                  />
                  <span className="float-right pr-1">
                    Report a Incident
                  </span>
                </Button>
              </Col>
            </Row>
          </Col>
        ) : ''}
        <Drawer
          title=""
          closable={false}
          className="drawer-bg-lightblue"
          width={1250}
          visible={addTicketModal}
        >
          <DrawerHeader
            title="Report a Incident"
            imagePath={ticketIcon}
            closeDrawer={() => onAddReset()}
          />
          <AddIncident editIds={false} closeModal={() => showAddTicketModal(false)} setEditLink={false} afterReset={onAddReset} isDrawer />
        </Drawer>
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
