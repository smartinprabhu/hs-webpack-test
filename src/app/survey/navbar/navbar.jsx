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
import { Drawer } from 'antd';
import {
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import { makeStyles } from '@material-ui/core/styles';

import searchIcon from '@images/icons/search.svg';
import VisitRequest from '@images/icons/visitRequest.svg';
import VisitRequestGrey from '@images/icons/visitRequestGrey.svg';
import searchActiveIcon from '@images/icons/searchGrey.svg';
import surveyBlack from '@images/icons/checklistSurveyBlue.svg';
import plusCircleMiniIcon from '@images/icons/plusCircleWhite.svg';
import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import DrawerHeader from '@shared/drawerHeader'

import sideNav from './navlist.json';
import {
  getMenuItems, getAllowedCompanies, generateErrorMessage, getPagesCountV2, getDefaultNoValue,
  extractTextObject, getCompanyTimezoneDate, getListOfModuleOperations, getModuleDisplayName,
} from '../../util/appUtils';
import {
  getSurveyList, getSurveyCount, getSurveyFilters, resetAddSurvey,
} from '../surveyService';
import {
  getSurveyState,
} from '../utils/utils';
import { setInitialValues } from '../../purchase/purchaseService';
import AddSurvey from '../addSurvey';
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
  SURVEY: VisitRequest,
};

const faIcons = {
  INSIGHTS: searchIcon,
  SURVEY: VisitRequestGrey,
};

const Navbar = (props) => {
  const { id } = props;
  const limit = 10;
  const dispatch = useDispatch();
  const classes = useStyles();

  const [keyword, setKeyword] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [surveyRequest, setSurveyRequest] = useState(false);
  const [currentTab, setActive] = useState('survey');
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);
  const [totalDataCount, setTotalCount] = useState(0);
  const [addSurveyRequestModal, showAddSurveyRequestModal] = useState(false);
  const module = 'Survey';
  const { userRoles } = useSelector((state) => state.user);
  const { userInfo } = useSelector((state) => state.user);
  const menuList = getMenuItems(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Survey', 'name');
  const allowedOperations = getListOfModuleOperations(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Survey', 'code');
  const title = getModuleDisplayName(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Survey', 'display');
  const isCreatable = allowedOperations.includes(actionCodes['Add Survey']);
  const [logoUrl, setLogoUrl] = useState(null);

    const handleLogoUrlChange = (url) => {
        setLogoUrl(url);
    };

  const { surveyListInfo, surveyCount, addSurveyInfo } = useSelector((state) => state.survey);
  const companies = getAllowedCompanies(userInfo);
  useEffect(() => {
    dispatch(setInitialValues(false, false, false, false));
  }, []);

  useEffect(() => {
    if (searchOpen) {
      dispatch(getSurveyList(companies, appModels.SURVEY, limit, offset, false, 'DESC', 'create_date', keyword));
      dispatch(getSurveyCount(companies, appModels.SURVEY, [], keyword));
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

  const loading = (surveyCount && surveyCount.loading) || (surveyListInfo && surveyListInfo.loading);
  const error = (surveyListInfo && surveyListInfo.err) || (surveyCount && surveyCount.err);

  useEffect(() => {
    if ((surveyListInfo && surveyListInfo.err) || (surveyCount && surveyCount.err)) {
      setTotalCount(0);
    }
  }, [surveyListInfo, surveyCount]);

  useEffect(() => {
    if (surveyCount && surveyCount.length) {
      setTotalCount(surveyCount.length);
    } else {
      setTotalCount(0);
    }
  }, [surveyCount]);

  const onLoadRequest = (eid, ename) => {
    setSurveyRequest(eid);
    if (eid) {
      const customFilters = [{
        key: 'id',
        value: eid,
        label: ename,
        type: 'id',
      }];
      dispatch(getSurveyFilters(customFilters));
    }
  };

  if (surveyRequest) {
    return (<Redirect to="/survey" />);
  }

  const onReset = () => {
    dispatch(resetAddSurvey());
  };

  return (
    <>
      <Row className="m-0 surveyOverview-header">
        <Col md="3" sm="3" lg="3" xs="12" className="p-0">
          <h3 className="mt-1 d-flex align-items-center text-break">
            <img src={surveyBlack} alt="assets" width="25" height="25" className="mb-1 mr-2" />
            {title ? title : sideNav.data.title}
          </h3>
        </Col>
        <Col  md={logoUrl === 'Insights' ? '4': '5'} lg={logoUrl === 'Insights' ? '4': '5'} sm='12' xs='12' className="mt-1 margin-negative-left-30px ">
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
            <Row className="margin-negative-left-90px margin-negative-right-55px">
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
                        <NavLink className="insights-nav-link" onClick={() => setActive('survey')} href="#">Survey</NavLink>
                      </Nav>
                    </Row>
                    <hr className="mb-2 mt-1" />
                    {currentTab === 'survey' ? (
                      <>
                        {surveyListInfo && surveyListInfo.loading && (
                          <Loader />
                        )}
                        {surveyListInfo && surveyListInfo.err && (
                          <ErrorContent errorTxt={generateErrorMessage(surveyListInfo)} />
                        )}
                        {surveyListInfo && surveyListInfo.data && surveyListInfo.data.length && surveyListInfo.data.map((sv) => (
                          <div key={sv.id} aria-hidden className="cursor-pointer" onClick={() => onLoadRequest(sv.id, sv.title)}>
                            <Row sm="12" md="12" lg="12" className="font-size-10px my-2">
                              <Col sm="4" md="4" lg="4" className="px-0 pl-3">
                                <img
                                  aria-hidden="true"
                                  id="Add"
                                  alt="Add"
                                  width="10px"
                                  className="cursor-pointer mr-1"
                                  src={faIcons.SURVEY}
                                />
                                {getDefaultNoValue(sv.title)}
                              </Col>
                              <Col sm="3" md="3" lg="3" className="font-size-10px light-text p-0">
                                {getDefaultNoValue(getSurveyState(extractTextObject(sv.stage_id)))}
                              </Col>
                              <Col sm="5" md="5" lg="5" className="font-size-10px light-text p-0">
                                {getDefaultNoValue(getCompanyTimezoneDate(sv.create_date, userInfo, 'datetime'))}
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
                  <Button className="float-right insights-add-icon mt-2" onClick={() => showAddSurveyRequestModal(!addSurveyRequestModal)}>
                    <img
                      aria-hidden="true"
                      id="Add"
                      alt="Add"
                      width="15px"
                      className="cursor-pointer ml-0 mr-1 mb-1"
                      src={plusCircleMiniIcon}
                    />
                    <span>
                      Create Survey
                    </span>
                  </Button>
                )}
              </Col>
            </Row>
            {/* <Modal size={(addSurveyInfo && addSurveyInfo.data) ? 'sm' : 'xl'} className="border-radius-50px modal-dialog-centered" isOpen={addSurveyRequestModal}>
              <ModalHeaderComponent title="Add Survey" imagePath={false} closeModalWindow={() => { showAddSurveyRequestModal(false); onReset(); }} response={addSurveyInfo} />
              <ModalBody className="mt-0 pt-0">
                <AddSurvey
                  editId={false}
                  afterReset={() => { showAddSurveyRequestModal(false); onReset(); }}
                />
              </ModalBody>
            </Modal> */}
            <Drawer
              title=""
              closable={false}
              className="drawer-bg-lightblue"
              width={1250}
              visible={addSurveyRequestModal}
            >
              <DrawerHeader
                title="Add Survey"
                imagePath={surveyBlack}
                closeDrawer={() => { showAddSurveyRequestModal(false); onReset(); }}
              />
              <br />
              <AddSurvey
                editId={false}
                afterReset={() => { showAddSurveyRequestModal(false); onReset(); }}
                response={addSurveyInfo}
              />
            </Drawer>
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
