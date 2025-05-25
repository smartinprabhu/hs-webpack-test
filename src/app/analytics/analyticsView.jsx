/* eslint-disable radix */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import {
  Button, Card, CardImg, CardBody,
  CardTitle, CardHeader, Col, Collapse, Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem, Input, Popover, PopoverBody, Row,
} from 'reactstrap';
import Switch from '@material-ui/core/Switch';
import { useSelector, useDispatch } from 'react-redux';
import { PowerBIEmbed } from 'powerbi-client-react';
import { models } from 'powerbi-client';

import {
  faAngleDown, faAngleUp, faInfoCircle, faExclamationCircle, faSearch, faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import analyticsBlue from '@images/icons/analytics.svg';
import Loading from '@shared/loading';
import ErrorContent from '@shared/errorContent';
import rightArrow from '@images/icons/rightArrow.svg';
import { groupByMultiple } from '../util/staticFunctions';
import { getTokenFromPortal, getAnalytics } from './analytics.service';
import {
  generateErrorMessage, getModuleDisplayName,
} from '../util/appUtils';
import NativeDashboard from './nativeDashboard/nativeDashboard';
import {
  getActiveTab, getHeaderTabs, getTabs,
} from '../util/appUtils';
import { updateHeaderData } from '../core/header/actions';

const appConfig = require('../config/appConfig').default;

const appModels = require('../util/appModels').default;

const AnalyticsView = () => {
  const dispatch = useDispatch();
  const [embedUrl, setEmbedUrl] = useState('');
  const [powerBiToken, setPowerBiToken] = useState('');
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [powerBiName, setPowerBiName] = useState(false);
  const [powerBiIcon, setPowerBiIcon] = useState(false);
  const [reportTrue, setReportTrue] = useState(false);
  const [reportBycategory, setReportBycategory] = useState([]);
  const [errorMsg, setErrorMsg] = useState(false);
  const [switchValue, setSwitchValue] = useState(false);
  const [accordion, setAccordian] = useState([]);
  const [icon, setIcon] = useState(faAngleDown);
  const [searchTerm, setSearchTerm] = useState('');
  const { userInfo } = useSelector((state) => state.user);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [popoverOpen1, setPopoverOpen1] = useState(false);
  const [currentSection, setCurrentSection] = useState('');
  const [popoverId, setPopoverId] = useState('');
  const [powerBiInfo, setPowerBiInfo] = useState('');
  const { analyticsInfo } = useSelector((state) => state.analytics);
  const [categories, setCategories] = useState([]);
  const [source, setSource] = useState('');
  const [dashboardId, setDashboardId] = useState('');
  const [reportId, setReportId] = useState('');
  const [groupId, setGroupId] = useState('');
  const [datasetId, setDatasetId] = useState(false);
  const { userRoles } = useSelector((state) => state.user);

  const email = userInfo && userInfo.data && userInfo.data.email ? userInfo.data.email.email : false;
  const companyId = userInfo && userInfo.data && userInfo.data.company ? userInfo.data.company.id : false;
  const isParent = userInfo && userInfo.data && userInfo.data.is_parent ? userInfo.data.is_parent : false;
  const title = getModuleDisplayName(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'Analytics', 'display');
  const togglePopover = (id) => {
    setPopoverOpen(!popoverOpen);
    setPopoverId(id);
  };

  const togglePopover1 = () => {
    setPopoverOpen1(!popoverOpen1);
  };

  const [changeReportDropdownOpen, setReportDropdownOpen] = useState(false);
  const changeReportDropdownToggle = () => setReportDropdownOpen(!changeReportDropdownOpen);

  useEffect(() => {
    if (userInfo && userInfo.data) {
      dispatch(getAnalytics(userInfo.data.company.id, appModels.ANALYTICS, userInfo.data.user_role_id));
      sessionStorage.clear();
    }
  }, [userInfo]);

  const sections = analyticsInfo && analyticsInfo.data && analyticsInfo.data.length > 0 ? groupByMultiple(analyticsInfo.data, (obj) => obj.section_id) : [];

  const getinitial = () => {
    if ((sections && sections.length > 0)) {
      const accordn = [];
      for (let i = 0; i < sections.length; i += 1) {
        if (i === 0) {
          accordn.push(true);
        } else {
          accordn.push(false);
        }
      }
      setAccordian(accordn);
    }
  };

  useEffect(() => {
    if (analyticsInfo && analyticsInfo.data) {
      getinitial();
      const categoryList = analyticsInfo && analyticsInfo.data && analyticsInfo.data.length > 0 ? analyticsInfo.data : [];
      setCategories(categoryList);
    }
  }, [analyticsInfo]);

  useEffect(() => {
    if (searchTerm && searchTerm !== '') {
      const searchText = searchTerm.toLowerCase();
      const results = categories && categories.length > 0 && categories.filter(
        (obj) => obj.display_name.toLowerCase().includes(searchText),
      );
      setCategories(results);
    } else {
      const categoryList = analyticsInfo && analyticsInfo.data && analyticsInfo.data.length > 0 ? analyticsInfo.data : [];
      setCategories(categoryList);
    }
  }, [searchTerm]);

  useEffect(() => {
    // const cookiesToken = cookies.get(`power_bi_token(${reportId})`);
    const sesstionToken = window.sessionStorage.getItem(`power_bi_token(${reportId})`);
    if (!sesstionToken) {
      if (reportTrue && reportId && groupId) {
        const datas = {
          power_bi_reportId: reportId,
          power_bi_groupId: groupId,
          power_bi_datasetId: datasetId || false,
          email,
          company: companyId,
          companyType: isParent,
        };
        const WEBAPPAPIURL = `${window.location.origin}`;
        const azurePortalConfig = {
          method: 'get',
          url: `${WEBAPPAPIURL}/oauth2/token`,
          params: datas,
        };
        getTokenFromPortal(azurePortalConfig).then((reportResponse) => {
          setEmbedUrl(`https://app.powerbi.com/reportEmbed?reportId=${reportId}`);
          const now = new Date();
          const time = now.getTime();
          const expireTime = time + parseInt(appConfig.POWERBI_EXPIRY);
          now.setTime(expireTime);
          // cookies.set(`power_bi_token(${reportId})`, reportResponse.data.token, {
          //   path: '/',
          //   expires: now,
          // });
          window.sessionStorage.setItem(`power_bi_token(${reportId})`, reportResponse.data.token);
          setPowerBiToken(reportResponse.data.token);
          setAnalyticsLoading(false);
          setErrorMsg(false);
          setReportTrue(false);
        }).catch(
          () => {
            setErrorMsg(true);
            setAnalyticsLoading(false);
            setReportTrue(false);
          },
        );
      }
    } else {
      setReportTrue(false);
      setPowerBiToken(sesstionToken);
      setEmbedUrl(`https://app.powerbi.com/reportEmbed?reportId=${reportId}`);
      setAnalyticsLoading(false);
    }
  }, [reportTrue]);

  const switchCategoryReport = (selectedReport, categoriesList) => {
    setAnalyticsLoading(true);
    if (selectedReport.source && selectedReport.source === 'Powerbi') {
      setPowerBiName(selectedReport.name);
      setPowerBiIcon(selectedReport.icon);
      setReportBycategory(categoriesList);
      setPowerBiInfo(selectedReport.info);
      const categGroupId = JSON.parse(selectedReport.properties.replaceAll("'", '"')).groupId
        ? JSON.parse(selectedReport.properties.replaceAll("'", '"')).groupId : JSON.parse(selectedReport.properties.replaceAll("'", '"')).groupid;
      const categReportId = JSON.parse(selectedReport.properties.replaceAll("'", '"')).reportId
        ? JSON.parse(selectedReport.properties.replaceAll("'", '"')).reportId : JSON.parse(selectedReport.properties.replaceAll("'", '"')).reportid;
      const categDatasetId = JSON.parse(selectedReport.properties.replaceAll("'", '"')).datasetId
        ? JSON.parse(selectedReport.properties.replaceAll("'", '"')).datasetId : JSON.parse(selectedReport.properties.replaceAll("'", '"')).datasetid;
      setGroupId(categGroupId);
      setReportId(categReportId);
      setDatasetId(categDatasetId || false);
      setSource(selectedReport.source);
      setReportTrue(Math.random());
      setDashboardId('');
      setPopoverId('');
      setPopoverOpen('');
    } else {
      setPowerBiName(selectedReport.name);
      setPowerBiIcon(selectedReport.icon);
      setReportBycategory(categoriesList);
      setPowerBiInfo(selectedReport.info);
      setSource(selectedReport.source);
      setGroupId('');
      setReportId('');
      setDatasetId(false);
      setReportTrue(false);
      setDashboardId(selectedReport.dashboard_id);
      setPopoverId('');
      setPopoverOpen('');
    }
  };

  const switchReport = (report) => {
    setAnalyticsLoading(true);
    if (report.source && report.source === 'Powerbi') {
      const categGroupId = JSON.parse(report.properties.replaceAll("'", '"')).groupId
        ? JSON.parse(report.properties.replaceAll("'", '"')).groupId : JSON.parse(report.properties.replaceAll("'", '"')).groupid;
      const categReportId = JSON.parse(report.properties.replaceAll("'", '"')).reportId
        ? JSON.parse(report.properties.replaceAll("'", '"')).reportId : JSON.parse(report.properties.replaceAll("'", '"')).reportid;
      const categDatasetId = JSON.parse(report.properties.replaceAll("'", '"')).datasetId
        ? JSON.parse(report.properties.replaceAll("'", '"')).datasetId : JSON.parse(report.properties.replaceAll("'", '"')).datasetid;
      setGroupId(categGroupId);
      setReportId(categReportId);
      setDatasetId(categDatasetId || false);
      setPowerBiName(report.name);
      setPowerBiIcon(report.icon);
      setPowerBiInfo(report.info);
      setReportTrue(Math.random());
      setPopoverId('');
      setPopoverOpen('');
    } else {
      setPowerBiName(report.name);
      setPowerBiIcon(report.icon);
      setPowerBiInfo(report.info);
      setSource(report.source);
      setDashboardId(report.dashboard_id);
      setPopoverId('');
      setPopoverOpen('');
    }
  };

  const switchToAnalytics = () => {
    setReportBycategory([]);
    setPowerBiName(false);
    setPowerBiIcon(false);
    setPowerBiInfo('');
    setSource('');
    setDashboardId('');
  };

  const onMouseEnter = () => {
    setReportDropdownOpen(true);
  };
  const onMouseLeave = () => {
    setReportDropdownOpen(false);
  };

  const toggle = () => {
    setReportDropdownOpen(true);
  };

  const checkActionAllowed = (reportName) => {
    let allowed = true;
    if (reportName === powerBiName) {
      allowed = false;
    }
    return allowed;
  };

  // eslint-disable-next-line no-unused-vars
  const toggleAccordion = (tab, sec) => {
    const prevState = accordion;
    const state = prevState.map((x, index) => (tab === index ? !x : false));
    for (let i = 0; i < state.length; i += 1) {
      if (state[i] === false) {
        setIcon(faAngleDown);
      } else {
        setIcon(faAngleUp);
      }
    }
    setAccordian(state);
  };

  const noInfoFound = (
    <Col md="12" sm="12" lg="12" xs="12">
      <div className="text-danger text-center">
        <FontAwesomeIcon className="mr-2 font-size20 mb-n2px" size="lg" icon={faExclamationCircle} />
        No information found.
      </div>
    </Col>
  );

  const noCategoryFound = (
    <Col md="12" sm="12" lg="12" xs="12">
      <div className="text-danger text-center mb-2">
        <FontAwesomeIcon className="mr-2 font-size20 mb-n2px" size="lg" icon={faExclamationCircle} />
        No data found.
      </div>
    </Col>
  );
  const getCategoriesCard = (report, i, section) => (
    <Col sm="3" md="3" lg="3" className="pb-3" key={report.id} onClick={() => { switchCategoryReport(report, categories); setCurrentSection(section); }}>
      <Card className="cursor-pointer h-100">
        <CardImg top width="100%" height="130px" src={report.logo ? `data:image/png;base64,${report.logo}` : ''} alt="analytics" />
        <CardBody className="pt-3 pb-3 pl-1 pr-1">
          <div
            aria-hidden="true"
            onMouseOver={() => togglePopover(report.id)}
            onFocus={() => togglePopover(report.id)}
            onMouseLeave={() => { setPopoverOpen(false); setPopoverId(''); }}
            id={`popover-${i}`}
            className="cursor-pointer"
          >
            <CardTitle tag="h6" className="mb-0 font-12">
              <span className="font-medium float-left">
                <img src={report.icon ? `data:image/png;base64,${report.icon}` : ''} alt="icon" width="16" height="16" className="mr-2 mr-2 mb-1" />
                {report.display_name}
              </span>
            </CardTitle>
            <span className="float-right">
              <FontAwesomeIcon
                color="skyblue"
                type="button"
                className="font-weight-300"
                size="sm"
                icon={faInfoCircle}
              />
            </span>
          </div>
          <Popover placement="bottom" isOpen={!!(popoverId === report.id && popoverOpen)} target={`popover-${i}`}>
            <PopoverBody>
              {!report.info || report.info === ''
                ? noInfoFound
                : report.info}
            </PopoverBody>
          </Popover>
        </CardBody>
      </Card>
    </Col>
  );

  const getCategoriesBySection = (section) => {
    const cardAnalytics = [];
    if (categories.length > 0) {
      for (let i = 0; i < categories.length; i += 1) {
        const report = categories[i];
        if (report.section_id[0] === section) {
          cardAnalytics.push(
            getCategoriesCard(report, i, section),
          );
        }
      }
    } else { cardAnalytics.push(noCategoryFound); }
    return cardAnalytics;
  };

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
    if ((event.target.value && event.target.value.length > 0) && (sections && sections.length > 0)) {
      const accordn = [];
      for (let i = 0; i < sections.length; i += 1) {
        if (i === 0) {
          accordn.push(true);
        } else {
          accordn.push(false);
        }
      }
      setAccordian(accordn);
    } else {
      getinitial();
    }
  };

  const removeSearchTerm = () => {
    setSearchTerm('');
    getinitial();
  };

  const handleChangeSwitch = (event) => {
    setSwitchValue(event.target.checked);
    if (event.target.checked) {
      if ((sections && sections.length > 0)) {
        const accordn = [];
        for (let i = 0; i < sections.length; i += 1) {
          if (i === 0) {
            accordn.push(true);
          } else {
            accordn.push(false);
          }
        }
        setAccordian(accordn);
      }
    } else {
      getinitial();
    }
  };

  const getReportCount = (reportCategory) => {
    let report = false;

    const results = reportCategory && reportCategory.length && reportCategory.length > 0 && reportCategory.filter(
      (obj) => obj.section_id[0] === currentSection,
    );
    if (results && results.length > 1) {
      report = true;
    }
    return report;
  };
  const headerTabs = getHeaderTabs(
    userRoles?.data?.allowed_modules,
    "Analytics"
  );

  let activeTab;
  let tabs;

  if (headerTabs) {
    tabs = getTabs(headerTabs[0].menu, {});
    activeTab = getActiveTab(
      tabs.filter((e) => e),
      " "
    );
  }
  useEffect(() => {
    dispatch(
      updateHeaderData({
        module: "Analytics",
        moduleName: "Analytics",
        menuName: " ",
        link: "/analytics",
        headerTabs: tabs.filter((e) => e),
        activeTab,
      })
    );
  }, [activeTab]);

  return (
    <>
      <Row className="ml-1 mr-1 mt-2 mb-2 p-2 analytics-view border">
        <Col sm="12" md="12" lg="12" xs="12">
          <div>
            <Row className="pl-2 m-0">
              <Col md="9" sm="9" lg="9" xs="12" className="p-0">
                <div className="d-inline-flex">
                  <h3 className="mt-1">
                    <img src={analyticsBlue} alt="analytics" width="25" height="25" className="mr-3 mb-1" />
                    <span className="cursor-pointer" aria-hidden="true" onClick={() => { setCurrentSection(''); switchToAnalytics(); }}>{title ? title : 'Analytics Dashboard'}</span>
                    {' '}
                    {powerBiName && (
                      <>
                        <img src={rightArrow} alt="analytics" width="18" height="18" className="mb-1" />
                        <Dropdown
                          className="d-inline-block"
                          onMouseOver={onMouseEnter}
                          onMouseLeave={onMouseLeave}
                          isOpen={changeReportDropdownOpen}
                          onClick={toggle}
                          toggle={changeReportDropdownToggle}
                        >
                          <DropdownToggle nav className="pl-2">
                            <span>
                              <img src={powerBiIcon ? `data:image/png;base64,${powerBiIcon}` : ''} alt="icon" width="16" height="16" className="mr-2 mr-2 mb-1" />
                              {powerBiName}
                            </span>
                          </DropdownToggle>
                          {getReportCount(reportBycategory)
                            ? (
                              <DropdownMenu>
                                {reportBycategory && reportBycategory.length && reportBycategory.length > 0 && reportBycategory.map((report) => (
                                  (checkActionAllowed(report.name) && report.section_id && report.section_id[0] === currentSection) && (
                                    <DropdownItem
                                      id="switchLocation"
                                      key={report.name}
                                      onClick={() => switchReport(report)}
                                    >
                                      <img src={report.icon ? `data:image/png;base64,${report.icon}` : ''} alt="icon" width="16" height="16" className="mr-2 mr-2 mb-1" />
                                      {report.name}
                                    </DropdownItem>
                                  )
                                ))}
                              </DropdownMenu>
                            )
                            : ''}
                        </Dropdown>
                      </>
                    )}
                  </h3>
                </div>
              </Col>
              {!powerBiName ? (
                <Col sm="3" md="3" lg="3" xs="12" className="p-0 d-flex content-center">
                  <Switch
                    checked={switchValue}
                    onChange={handleChangeSwitch}
                    color="primary"
                    name="expandSwitch"
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                  />
                  <div className="w-100">
                    <Input className="rounded-pill" id="company-search-text" autoComplete="off" bsSize="sm" placeholder="Type to search.." value={searchTerm} onChange={handleChange} />
                    {searchTerm !== ''
                      ? <FontAwesomeIcon color="lightgrey" onClick={removeSearchTerm} className="search-icon bg-white cursor-pointer" icon={faTimesCircle} />
                      : <FontAwesomeIcon color="lightgrey" className="search-icon bg-white" icon={faSearch} />}
                  </div>
                </Col>
              )
                : (
                  <Col sm="3" md="3" lg="3" xs="12">
                    <div
                      aria-hidden="true"
                      onMouseOver={() => togglePopover1()}
                      onFocus={() => togglePopover1()}
                      onMouseLeave={() => { setPopoverOpen1(false); }}
                      id="deatails_report_id"
                      className="mr-1 mt-3 float-right cursor-pointer"
                    >
                      <FontAwesomeIcon
                        color="skyblue"
                        type="button"
                        className="font-weight-300"
                        size="lg"
                        icon={faInfoCircle}
                      />
                      <Popover placement="bottom" isOpen={popoverOpen1} target="deatails_report_id">
                        <PopoverBody>{powerBiInfo && powerBiInfo !== '' ? powerBiInfo : noInfoFound}</PopoverBody>
                      </Popover>
                    </div>
                  </Col>
                )}
            </Row>
            <hr className="mt-1" />
            {!powerBiName && (accordion.length > 0) && (sections && sections.length > 0) && sections.map((section, index) => (
              <div
                id="accordion"
                className="accordion-wrapper mb-3 border-0"
                key={section[0].id}
              >
                <Card>
                  <CardHeader id={`heading${index}`} className="p-2 bg-sky border-0">
                    <Button
                      block
                      color="text-dark"
                      id={`heading${index}`}
                      className="text-left m-0 p-0 border-0 box-shadow-none"
                      onClick={() => toggleAccordion(index, section[0].id)}
                      aria-expanded={accordion[index]}
                      aria-controls={`collapse${index}`}
                    >
                      <span className="collapse-heading font-weight-800">
                        {section && section[0].section_id && section[0].section_id[1] ? section[0].section_id[1] : ''}
                        {' '}
                      </span>
                      {accordion[index]
                        ? <FontAwesomeIcon className="float-right font-weight-300" size="lg" icon={faAngleUp} />
                        : <FontAwesomeIcon className="float-right font-weight-300" size="lg" icon={icon} />}
                    </Button>
                  </CardHeader>

                  <Collapse
                    isOpen={accordion[index]}
                    data-parent="#accordion"
                    id={`collapse${index}`}
                    className="border-top bw-3 comments-list thin-scrollbar"
                    aria-labelledby={`heading${index}`}
                  >
                    <Row className="mr-2 ml-2 mt-3 mb-0">
                      {getCategoriesBySection(section[0].section_id[0])}
                    </Row>
                  </Collapse>
                </Card>
              </div>
            ))}
          </div>
          {analyticsInfo && analyticsInfo.loading && (
            <div className="mb-3 mt-3">
              <Loading />
            </div>
          )}
          {(analyticsInfo && analyticsInfo.err) && (
            <Row>
              <Col sm="12" md="12" lg="3" xs="12" />
              <Col sm="12" md="12" lg="6" xs="12">
                <ErrorContent errorTxt={generateErrorMessage(analyticsInfo)} />
              </Col>
              <Col sm="12" md="12" lg="3" xs="12" />
            </Row>
          )}
          {source === 'Powerbi' && powerBiName && (
            <div>
              {analyticsLoading && !errorMsg
                ? (
                  <div className="text-center m-2">
                    <Loading />
                  </div>
                ) : (
                  <Row className="mt-1 p-0 col-sm-12 col-md-12 col-lg-12 height-100 m-0">
                    {errorMsg
                      ? (
                        <div className="text-center col-lg-12">
                          No analytics found
                        </div>
                      )
                      : (
                        <>
                          {/* <Report
                            tokenType="Embed" // or, "Aad"
                            accessToken={powerBiToken} // accessToken goes here
                            embedUrl={embedUrl} // embedUrl goes here
                            embedId={reportId} // report or dashboard Id goes here
                            pageName="current" // set as current page of the report
                            reportMode="view" // options: view/edit/create
                            style={{ width: '100%' }}
                            extraSettings={extraSettings}
                          /> */}
                          <PowerBIEmbed
                            embedConfig={{
                              type: 'report',
                              id: reportId,
                              accessToken: powerBiToken,
                              tokenType: models.TokenType.Embed,
                              embedUrl,
                              settings: {
                                panes: {
                                  filters: {
                                    expanded: false,
                                    visible: false,
                                  },
                                },
                                background: models.BackgroundType.Transparent,
                              },
                            }}
                            cssClassName="powerbi-report-width"
                          />
                        </>
                      )}
                  </Row>
                )}
            </div>
          )}
          {source === 'Native' && (
            <NativeDashboard dashboardId={dashboardId} />
          )}
        </Col>
      </Row>
    </>
  );
};

export default AnalyticsView;
