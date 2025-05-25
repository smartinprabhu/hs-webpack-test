/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable max-len */
/* eslint-disable no-nested-ternary */
/* eslint-disable quote-props */
/* eslint-disable import/no-unresolved */
import React, { useMemo, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { MdKeyboardArrowLeft } from 'react-icons/md';
import settingsCompanyLogo from '@images/companyLoginLogo.png';
import { IoMdArrowDropright } from 'react-icons/io';
import IconButton from '@mui/material/IconButton';
import ListItemButton from '@mui/material/ListItemButton';
import { RxDotFilled } from 'react-icons/rx';
import Divider from '@mui/material/Divider';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

import { Box } from '@mui/system';
import MuiTooltip from '@shared/muiTooltip';

import './styles.css';

import Home from '@images/sideNavImages/home_black.svg';
import Assets from '@images/sideNavImages/assets_black.svg';
import Attendance from '@images/sideNavImages/attendence_black.svg';
import Audit from '@images/sideNavImages/auditSystem_black.svg';
import BreakdownTracker from '@images/sideNavImages/breakdownTracker_black.svg';
import BuildingCompliance from '@images/sideNavImages/buildingCompliance_black.svg';
import Commodity from '@images/sideNavImages/commodityTransactions_black.svg';
import Consumption from '@images/sideNavImages/consumption_black.svg';
import Energy from '@images/sideNavImages/energy_black.svg';
import ESG from '@images/sideNavImages/esg_black.svg';
import Gatepass from '@images/sideNavImages/gatepass_black.svg';
import Helpdesk from '@images/sideNavImages/helpdesk_black.svg';
import IAQ from '@images/sideNavImages/iaq_black.svg';
import Incident from '@images/sideNavImages/incident_black.svg';
import Inspection from '@images/sideNavImages/inspection_black.svg';
import Inventory from '@images/sideNavImages/inventory_black.svg';
import Mailroom from '@images/sideNavImages/mailroomManagement_black.svg';
import Occupancy from '@images/sideNavImages/occupancy_black.svg';
import Pantry from '@images/sideNavImages/pantry_black.svg';
import PPM from '@images/sideNavImages/ppm_black.svg';
import SmartWashroom from '@images/sideNavImages/smartWashroom_black.svg';
import SpaceManagement from '@images/sideNavImages/spacemanagement_black.svg';
import Survey from '@images/sideNavImages/survey_black.svg';
import UPS from '@images/sideNavImages/ups_black.svg';
import VMS from '@images/sideNavImages/vms_black.svg';
import Users from '@images/sideNavImages/users_black.svg';
import Workorder from '@images/sideNavImages/workorder_black.svg';
import WorkPermit from '@images/sideNavImages/workpermit_black.svg';
import AdminSetup from '@images/sideNavImages/adminSetup_black.svg';
import IOT from '@images/sideNavImages/iot_black.svg';
import AirQuality from '@images/sideNavImages/airQuality_black.svg';
import Analytics from '@images/sideNavImages/analytics_black.svg';
import Configuration from '@images/sideNavImages/configuration_black.svg';
import ITAsset from '@images/sideNavImages/itAsset_black.svg';
import FitTracker from '@images/sideNavImages/fitTracker_black.svg';
import RestRooms from '@images/sideNavImages/restRooms_black.svg';
import BMS from '@images/sideNavImages/alarms_black.svg';

import { getTabName } from '../../util/getDynamicClientData';
import AuthService from '../../util/authService';
import { getUserRoles, getUserDetails } from '../../user/userService';
import { savePinEnable } from '../../auth/authActions';
import {
  detectMob,
  getColumnArrayByIdCase,
  getSequencedMenuItems,
  getModuleGroups,
  detectMimeType,
} from '../../util/appUtils';
import appMenus from '../../util/appAccess.json';
import { setSorting } from '../../assets/equipmentService';
import MuiPopOver from '../../shared/muiSubOptionPop';

import helpdeskSideNav from '../../helpdesk/navbar/navlist.json';
import esgSidenav from '../../esg/navbar/navlist.json';
import assetSideNav from '../../assets/navbar/navlist.json';
import breakDownTrackerSideNav from '../../breakdownTracker/navbar/navlist.json';
import woSideNav from '../../workorders/navbar/navlist.json';
import purchaseSideNav from '../../purchase/purchaseNavbar/navlist.json';
import inventorySideNav from '../../inventory/inventoryNavbar/navlist.json';
import pantrySideNav from '../../pantryManagement/navbar/navlist.json';
import auditSideNav from '../../auditSystem/navbar/navlist.json';
import auditMgmtSideNav from '../../auditManagement/navbar/navlist.json';
import wpSideNav from '../../workPermit/navbar/navlist.json';
import vmSideNav from '../../visitorManagement/navbar/navlist.json';
import bcSideNav from '../../buildingCompliance/navbar/navlist.json';
import surveySideNav from '../../survey/navbar/navlist.json';
import incidentSideNav from '../../incidentManagement/navbar/navlist.json';
import ppmSideNav from '../../preventiveMaintenance/navbar/navlist.json';
import inspectionSideNav from '../../inspectionSchedule/navbar/navlist.json';
import energySideNav from '../../enery/navbar/navlist.json';
import iaqSideNav from '../../iaq-dashboard/navbar/navlist.json';
import restroomsSideNav from '../../restrooms/navbar/navlist.json';
import consumptionSideNav from '../../consumptionDashboards/navbar/navlist.json';
import ConsumptionTrackerSideNav from '../../consumptionTracker/navbar/navlist.json';
import SlaKpiAuditSideNav from '../../slaAudit/navbar/navlist.json';
import fitTrackerSideNav from '../../fitTracker/navbar/navlist.json';
import UsersSideNav from '../../hrUsers/navbar/navlist.json';
import HxIncidentSideNav from '../../incidentBooking/navbar/navlist.json';
import OccupancySideNav from '../../occupancy/navbar/navlist.json';
import SmartWashroomSideNav from '../../staticPages/navbar/navlist.json';
import AdminSetUpCompanySideNav from '../../adminSetup/navbar/navlistCompany.json';
import AdminSetUpSiteSideNav from '../../adminSetup/navbar/navlistSite.json';
import { sideNavList } from './sidenavData';
import { HightlightIcons, AddThemeColor, AddThemeBackgroundColor } from '../../themes/theme';
import siteNav from '../../siteOnboarding/navbar/navlist.json';
import attendenceNav from '../../attendanceLogs/navbar/navList.json';
import airQualityNav from '../../antDashboards/navbar/navlist.json';
import sideNav from '../../hspacedashboard/navbar/navlist.json';
import wasteSideNav from '../../waste/navbar/navlist.json';
import cxoSideNav from '../../cxoAnalytics/navbar/navlist.json';
import hazardSideNav from '../../hazards/navbar/navlist.json';
import gatePassSideNav from '../../gatePass/navbar/navlist.json';
import mailRoomSideNav from '../../mailroomManagement/navbar/navlist.json';
import commoditySideNav from '../../commodityTransactions/navbar/navlist.json';
import BMSSideNav from '../../bmsAlarms/navbar/navlist.json';
import SustainabilityNav from '../../sustanablity/navlist.json';

import { groupByMultiple } from '../../util/staticFunctions';
import { useTheme } from '../../ThemeContext';

const defaultIcon = {
  HOME: Home,
  HELPDESK: Helpdesk,
  ASSETS: Assets,
  'WORK ORDERS': Workorder,
  'SPACE MANAGEMENT': SpaceManagement,
  '52 WEEK PPM': PPM,
  'HR SETTINGS': Attendance,
  'NOC Dashboard': Analytics,
  'ADMIN SETUP': AdminSetup,
  PURCHASE: Inventory,
  INVENTORY: Inventory,
  'BUILDING COMPLIANCE': BuildingCompliance,
  'VISITOR MANAGEMENT': VMS,
  'IOT SYSTEM': IOT,
  'ENERGY MANAGEMENT': Energy,
  'SMART WASHROOM': SmartWashroom,
  INCIDENT: Incident,
  'INSPECTION MAINTENANCE': Inspection,
  SURVEY: Survey,
  'PANTRY MANAGEMENT': Pantry,
  MAILROOM: Mailroom,
  COMMODITYTRANSACTIONS: Commodity,
  'IT ASSET MANAGEMENT': ITAsset,
  WORKPERMIT: WorkPermit,
  AUDITSYSTEM: Audit,
  GATEPASS: Gatepass,
  'CONSUMPTION DASHBOARDS': Consumption,
  CONFIGURATION: Configuration,
  'CONSUMPTION DASHBOARDS': Consumption,
  AIRQUALITY: AirQuality,
  'IAQ DASHBOARD': IAQ,
  'Attendance Logs': Attendance,
  BREAKDOWNTRACKER: BreakdownTracker,
  Users,
  FITTRACKER: FitTracker,
  SLAAUDIT: Audit,
  CONSUMPTIONTRACKER: Consumption,
  Energy,
  UPS,
  ESG,
  OCCUPANCY: Occupancy,
  Restrooms: RestRooms,
  'ANALYTICS': Analytics,
  'Waste Tracker': BuildingCompliance,
  'CXO ANALYTICS': Analytics,
  HAZARDS: Incident,
  BMSALARMS: BMS,
  AUDITMANAGEMENT: Audit,
  'ESGTRACKER': Energy,

};

const authService = AuthService();

const Sidenav = () => {
  const { themes } = useTheme();

  const dispatch = useDispatch();
  const [sideNavItem, setNavItem] = useState();
  const [activeIndex, setActiveIndex] = useState(0);

  const [isMenuName, showMenuName] = useState(false);
  const [isScroll, showScroll] = useState(false);

  const [mobileMenu, showMobileMenu] = useState(false);

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const { pinEnableData } = useSelector((state) => state.auth);

  const [navPin, saveNavPin] = useState(pinEnableData);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorId, setAnchorId] = React.useState(null);

  const isMob = detectMob();

  const { menuExpand } = useSelector((state) => state.header);

  const activeSubOptionPath = window.location.pathname;

  useEffect(() => {
    showMobileMenu(menuExpand);
  }, [menuExpand]);

  useEffect(() => {
    if (userInfo && !userInfo.data) {
      dispatch(getUserDetails(authService.getAccessToken()));
    }
  }, []);

  useEffect(() => {
    dispatch(getUserRoles(authService.getAccessToken()));
  }, []);

  const onScroll = (e) => {
    e.preventDefault();
    if (!isScroll) {
      showScroll(true);
    }
  };

  const location = useLocation();
  const currentPath = location.pathname;

  const toTitleCase = (phrase) => phrase
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  useEffect(() => {
    if (currentPath) setNavItem(currentPath.replace('/', ''));
    if (currentPath && currentPath === '/asset-configuration') setNavItem(currentPath.replace('/asset', ''));
    if (currentPath && currentPath === '/itasset-overview') setNavItem(currentPath.replace('sset', ''));
    if (currentPath && currentPath === '/itasset/equipments') setNavItem(currentPath.replace('sset', ''));
    if (currentPath && currentPath === '/sla-audit-overview') setNavItem(currentPath.replace('audit', ''));
    if (currentPath && currentPath === '/sla-audits') setNavItem(currentPath.replace('audit', ''));
    if (currentPath && currentPath === '/consumption-tracker-overview') setNavItem(currentPath.replace('consumption', ''));
    if (currentPath && currentPath === '/consumption-trackers') setNavItem(currentPath.replace('consumption', ''));
    if (currentPath && currentPath === '/consumption-tracker-reports') setNavItem(currentPath.replace('consumption', ''));
    if (currentPath && currentPath === '/breakdown-tracker') setNavItem(currentPath.replace('-tracker', ''));
    if (currentPath && currentPath === '/waste-trackers') setNavItem(currentPath.replace('-trackers', ''));
    if (currentPath && currentPath === '/hx-incident-overview') setNavItem(currentPath.replace('incident', ''));
    if (currentPath && currentPath === '/hx-incidents') setNavItem(currentPath.replace('incident', ''));
    if (currentPath && currentPath === '/site-config') setNavItem(currentPath.replace('config', ''));
    if (currentPath && currentPath === '/audit-management-overview') setNavItem(currentPath.replace('audit', 'amanage'));
    if (currentPath && currentPath === '/audits') setNavItem(currentPath.replace('audit', 'amanage'));
    if (currentPath && currentPath === '/audits/actions') setNavItem(currentPath.replace('audit', 'amanage'));
    if (currentPath && currentPath === '/audits/configuration') setNavItem(currentPath.replace('audits/configuration', 'amanage'));
    if (currentPath && currentPath === '/audit/reports') setNavItem(currentPath.replace('audit', 'amanage'));
    let windowUrl = currentPath.replace('/', '| ');
    if (windowUrl !== '| ') {
      windowUrl = windowUrl.replace('-', ' ');
      windowUrl = windowUrl.replace('/', ' ');
      windowUrl = toTitleCase(windowUrl);
      document.title = `${getTabName()} ${windowUrl}`;
    } else {
      document.title = 'HELIX SENSE';
    }
  }, [currentPath]);

  const sideNavMenus = userRoles
    && userRoles.data
    && (Object.keys(userRoles.data.allowed_modules).length !== 0
      || userRoles.data.allowed_modules.length > 0)
    ? userRoles.data.allowed_modules
    : [];

  const newNavList = [];
  sideNavMenus?.map((eachItem) => {
    sideNavList.map((each) => {
      if (each.itemName === eachItem.name && !eachItem.is_hide) {
        newNavList.push({ ...eachItem, path: each.path });
      }
    });
  });

  function getClassName(isItem, mname, isHome) {
    let res = '';
    if (!isHome) {
      if (mname) {
        if (!isItem) {
          res = 'rect-expand';
        } else {
          res = 'highlight-expand';
        }
      } else if (!isItem) {
        res = 'rect';
      } else {
        res = 'highlight';
      }
    } else {
      const isHomeLink = !isItem || isItem === '/';
      if (mname) {
        if (!isHomeLink) {
          res = 'rect-expand';
        } else {
          res = 'highlight-expand';
        }
      } else if (!isHomeLink) {
        res = 'rect';
      } else {
        res = 'highlight';
      }
    }
    return res;
  }

  const isHome = !sideNavItem || sideNavItem === '/';

  useEffect(() => {
    if (navPin) {
      showMenuName(true);
      dispatch(savePinEnable(true));
    } else {
      showMenuName(false);
      dispatch(savePinEnable(false));
    }
  }, [navPin]);

  useEffect(() => {
    if (pinEnableData) {
      showMenuName(true);
      saveNavPin(true);
    } else {
      showMenuName(false);
      saveNavPin(false);
    }
  }, [pinEnableData]);

  useEffect(() => {
    dispatch(setSorting({ sortBy: 'DESC', sortField: 'create_date' }));
  }, [sideNavItem]);

  const sidePin = pinEnableData;

  const subOptions = [
    {
      dashboard_code: '',
      is_dashboard: false,
      logo: '',
      logo_url: '',
      module: { name: 'Helpdesk' },
      name: 'Insights',
    },
  ];
  const subOptions1 = [{ to: '/energy', displayName: 'Energy' }];

  const isAuthUser = userInfo && userInfo.data && userInfo.data.is_oauth_user_login;

  const menuNames = getColumnArrayByIdCase(
    userRoles && userRoles.data ? userRoles.data.allowed_modules : [],
    'name',
  );

  const menuList = (menu) => {
    const menus = getSequencedMenuItems(
      userRoles && userRoles.data ? userRoles.data.allowed_modules : [],
      menu,
      'name',
    );
    return menus;
  };

  const subOption = {
    Helpdesk: helpdeskSideNav,
    'Asset Registry': assetSideNav,
    'Work Orders': woSideNav,
    Purchase: purchaseSideNav,
    Inventory: inventorySideNav,
    'Pantry Management': pantrySideNav,
    'Audit System': auditSideNav,
    'Work Permit': wpSideNav,
    'Visitor Management': vmSideNav,
    'Building Compliance': bcSideNav,
    Survey: surveySideNav,
    'Incident Management': incidentSideNav,
    '52 Week PPM': ppmSideNav,
    'Inspection Schedule': inspectionSideNav,
    Energy: energySideNav,
    Restrooms: restroomsSideNav,
    UPS: consumptionSideNav,
    'Breakdown Tracker': breakDownTrackerSideNav,
    'Smart Washroom': SmartWashroomSideNav,
    'IAQ Dashboard': iaqSideNav,
    'Consumption Tracker': ConsumptionTrackerSideNav,
    Users: UsersSideNav,
    'FIT Tracker': fitTrackerSideNav,
    'SLA-KPI Audit': SlaKpiAuditSideNav,
    'HX Incident Report': HxIncidentSideNav,
    ESG: esgSidenav,
    'Admin Setup': userInfo && userInfo.data && userInfo.data.is_parent ? AdminSetUpCompanySideNav : AdminSetUpSiteSideNav,
    Configuration: siteNav,
    'Attendance Logs': attendenceNav,
    AIRQUALITY: airQualityNav,
    'SPACE MANAGEMENT': sideNav,
    'Waste Tracker': wasteSideNav,
    'CXO Analytics': cxoSideNav,
    'Hazards': hazardSideNav,
    'Gate Pass': gatePassSideNav,
    'Space Management': sideNav,
    'HSpace - Space Management': sideNav,
    'Mail Room Management': mailRoomSideNav,
    'Commodity Transactions': commoditySideNav,
    'BMS Alarms': BMSSideNav,
    'Audit Management': auditMgmtSideNav,
    'ESG Tracker': SustainabilityNav,
  };

  const getLink = (menuItem) => {
    const moduleSubMenuPaths = menuItem
      && menuItem.module
      && menuItem.module.name
      && subOption[menuItem.module.name]
      ? subOption[menuItem.module.name]
      : false;
    const link = moduleSubMenuPaths
      && moduleSubMenuPaths.data
      && moduleSubMenuPaths.data[menuItem.name]
      ? moduleSubMenuPaths.data[menuItem.name].pathName
      : '/';
    return link;
  };

  const getDisplayName = (menuItem) => {
    const moduleSubMenuPaths = menuItem
      && menuItem.module
      && menuItem.module.name
      && subOption[menuItem.module.name]
      ? subOption[menuItem.module.name]
      : false;
    const link = moduleSubMenuPaths
      && moduleSubMenuPaths.data
      && moduleSubMenuPaths.data[menuItem.name]
      ? moduleSubMenuPaths.data[menuItem.name].displayname
      : menuItem.name;
    return link;
  };

  const checkSubMenuExists = (menuItem) => {
    const moduleSubMenuPaths = menuItem
      && menuItem.module
      && menuItem.module.name
      && subOption[menuItem.module.name]
      ? subOption[menuItem.module.name]
      : false;
    const link = !!(
      moduleSubMenuPaths
      && moduleSubMenuPaths.data
      && moduleSubMenuPaths.data[menuItem.name]
    );
    return link;
  };

  const headLogo = userInfo
    && userInfo.data
    && userInfo.data.company
    && userInfo.data.company.vendor_logo
    ? `data:${detectMimeType(userInfo.data.company.vendor_logo)};base64,${userInfo.data.company.vendor_logo}`
    : settingsCompanyLogo;

  useEffect(() => {
    const curPath = parseInt(window.location.hash.split('#')[1]);
    const activeItem = newNavList.findIndex((each) => each.id === curPath);

    setActiveIndex(
      activeItem === -1
        ? newNavList.findIndex((each) => each.path === '/')
        : activeItem,
    );
  }, [location, newNavList]);

  const [hoverEnable, setHoverEnable] = useState(false);

  useEffect(() => {
    const element = document.getElementById('component-header');
    if (element) {
      const baseClass = pinEnableData && !hoverEnable
        ? 'content-box-expand'
        : pinEnableData && hoverEnable
          ? 'content-box-hover'
          : 'content-box';

      const themeClass = themes === 'light' ? 'light-mode' : '';
      element.className = `${baseClass} ${themeClass}`.trim();
    }
  }, [pinEnableData, hoverEnable, themes]);

  const onMenuOpen = (event, item) => {
    if (anchorEl !== event.currentTarget) {
      setAnchorEl(event.currentTarget);
      setAnchorId(item.id);
    }
  };

  const onMenuOpenClick = (event, item) => {
    const anchorElement = document.getElementById(`${item.id}-id`);
    if (anchorEl !== anchorElement) {
      setAnchorEl(anchorElement);
      setAnchorId(item.id);
    }
  };

  const onMenuClose = () => {
    setAnchorEl(null);
    setAnchorId(null);
  };

  const onMenuCloseFull = () => {
    setAnchorEl(null);
    setAnchorId(null);
    setHoverEnable(false);
  };

  const appendStyles = (obj) => {
    if (hoverEnable && pinEnableData) {
      obj.position = 'absolute';
      obj.zIndex = 1200;
      obj.height = '100vh';
      return obj;
    }
    return obj;
  };

  function getGroupModules(groupId) {
    let res = [];
    const uModules = userRoles && userRoles.data ? userRoles.data.allowed_modules : [];
    const data = uModules.filter((p) => p.groups.some((s) => s.id === groupId));
    if (data && data.length) {
      res = data;
    }
    return res;
  }

  const onSubMenuClose = () => {
    setAnchorEl(null);
    setAnchorId(null);
    setHoverEnable(false);
  };

  const allGroups = useMemo(() => (getModuleGroups(userRoles && userRoles.data ? userRoles.data.allowed_modules : [])), [userRoles]);
  const groupedModules = useMemo(() => (allGroups.length > 0 ? groupByMultiple(allGroups, (obj) => (obj.name)) : []), [userRoles]);

  return (
    <>
      {userRoles && userRoles.data && isAuthUser && (
        <Box
          sx={appendStyles({
            width: `${!hoverEnable ? sidePin ? '5%' : '16%' : '16%'}`,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: '16%',
              padding: '10px',
              overflow: 'hidden',
            },
            '&::-webkit-scrollbar': {
              width: '3px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'transparent',
              borderRadius: '10px',
            },
            '&:hover::-webkit-scrollbar-thumb': {
              background: AddThemeBackgroundColor({}).backgroundColor,
            },
            backgroundColor: themes === 'dark' ? '#ffffff' : '#2D2E2D',
            padding: '0px 10px 10px 10px',
            overflow: 'auto',
            borderRight: '1px solid #0000001f',
            // position: "absolute",
            // zIndex: 99,
            // height: "100vh",
          })}
          onMouseLeave={() => {
            setHoverEnable(false);
          }}
          onMouseEnter={() => {
            setHoverEnable(true);
          }}
          onMouseHover={() => {
            setHoverEnable(true);
          }}
          id="collapse-sidebar"
        >
          <Box className="sidebar__logo">
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
              }}
            >
              <img
                src={headLogo}
                className={`sidebar-company-logo ${pinEnableData && !hoverEnable ? 'd-none' : ''}`}
                alt="company logo"
              />
            </Box>
            <MuiTooltip
              title={<Typography>{sidePin ? 'Open' : 'Close'}</Typography>}
            >
              <IconButton
                onClick={() => {
                  saveNavPin(!navPin);
                  dispatch(savePinEnable(false));
                }}
              >
                <MdKeyboardArrowLeft
                  size={25}
                  className={`${sidePin ? 'sidebar-icon-close' : 'sidebar-icon-open'
                  }`}
                />
              </IconButton>
            </MuiTooltip>
          </Box>
          <Box className="sidebar__menu" id="main-sidebar">
            {groupedModules && groupedModules.length > 0 && sideNavMenus
              && newNavList.map(
                (item, index) => appMenus
                  && appMenus.menus
                  && appMenus.menus.Home && item.name === 'Home' && (
                    <React.Fragment key={index}>
                      <Link
                        to={`${appMenus.menus[item.name].path}#${item?.id}`}
                      >
                        <ListItemButton
                          sx={{
                            display: 'flex',
                            justifyContent: sidePin ? 'center' : '',
                          }}
                          className={`sidebar__menu__item ${(item.name !== 'Home' && sideNavItem && sideNavItem.includes(appMenus.menus[item.name].pathString)
                            || (item.name === 'Home' && window.location.pathname === '/'))
                            ? 'active'
                            : ''} ${anchorId === item.id ? 'selected-menu-sidebar' : ''}`}
                          style={(item.name !== 'Home' && sideNavItem && sideNavItem.includes(appMenus.menus[item.name].pathString)
                            || (item.name === 'Home' && window.location.pathname === '/'))
                            ? { color: AddThemeColor({}).color, background: '#0000001f 0% 0% no-repeat padding-box' }
                            : {}}
                          onClick={(event) => {
                            // setNavItem(appMenus.menus[item.name].path);
                            onMenuOpenClick(event, item);
                          }}
                          onMouseLeave={() => onMenuClose()}
                        >
                          {sidePin && !hoverEnable && !menuList(item.name)?.length > 0 ? (
                            <MuiTooltip
                              placement="right"
                              title={(
                                <Typography>
                                  {item.display ? item.display : appMenus.menus[item.name].displayName}
                                </Typography>
                              )}
                            >
                              <Box
                                className="sidebar__menu__item__icon"
                                sx={activeIndex === index ? AddThemeColor({}) : {}}
                              >
                                <img
                                  src={
                                    sideNavItem
                                      && sideNavItem.includes(
                                        appMenus.menus[item.name].pathString,
                                      )
                                      ? HightlightIcons()[
                                        appMenus.menus[item.name].name
                                      ]
                                      : defaultIcon[
                                        appMenus.menus[item.name].name
                                      ]
                                  }
                                  width="20"
                                  height="20"
                                  alt="highLight"
                                  id="Tooltip"
                                />
                              </Box>
                            </MuiTooltip>
                          ) : navPin && !hoverEnable && menuList(item.name)?.length > 0 ? (
                            <MuiPopOver
                              placement="right"
                              title={(
                                <Box
                                  sx={{
                                    paddingLeft: '0',
                                  }}
                                  component="ul"
                                >
                                  <Typography
                                    sx={{
                                      display: 'flex',
                                      justifyContent: 'center',
                                    }}
                                    className="sub-option-item-header"
                                    style={sideNavItem
                                      && sideNavItem.includes(
                                        appMenus.menus[item.name].pathString,
                                      ) ? { color: AddThemeColor({}).color, fontWeight: 900 } : {}}
                                  >
                                    {item.display ? item.display : appMenus.menus[item.name].displayName}
                                  </Typography>
                                  <Divider sx={{ my: 0.5 }} />
                                  {menuList(item.name).length > 0
                                    && menuList(item.name).map(
                                      (menuItem) => checkSubMenuExists(menuItem) && (
                                        <Link
                                          to={`${getLink(menuItem)}#${item?.id
                                          }`}
                                        >
                                          <li
                                            className="sub-option-item"
                                            style={activeSubOptionPath === getLink(menuItem) ? { color: AddThemeColor({}).color, fontWeight: 900 } : {}}
                                          >
                                            <RxDotFilled size={20} />
                                            {getDisplayName(menuItem)}
                                          </li>
                                        </Link>
                                      ),
                                    )}
                                </Box>
                              )}
                            >
                              <Box
                                className={`sidebar__menu__item__icon ${activeIndex === index
                                  ? 'active-sidebar-icon'
                                  : ''
                                }`}
                              >
                                <img
                                  src={
                                    sideNavItem
                                      && sideNavItem.includes(
                                        appMenus.menus[item.name].pathString,
                                      )
                                      ? HightlightIcons()[
                                        appMenus.menus[item.name].name
                                      ]
                                      : defaultIcon[
                                        appMenus.menus[item.name].name
                                      ]
                                  }
                                  width="20"
                                  height="20"
                                  alt="highLight"
                                  id="Tooltip"
                                />
                              </Box>
                            </MuiPopOver>
                          ) : (
                            <Box
                              className={`sidebar__menu__item__icon ${activeIndex === index
                                ? 'active-sidebar-icon'
                                : ''
                              }`}
                            >
                              <img
                                src={
                                  sideNavItem
                                    && sideNavItem.includes(
                                      appMenus.menus[item.name].pathString,
                                    )
                                    ? HightlightIcons()[
                                      appMenus.menus[item.name].name
                                    ]
                                    : defaultIcon[
                                      appMenus.menus[item.name].name
                                    ]
                                }
                                width="20"
                                height="20"
                                alt="highLight"
                                id="Tooltip"
                              />
                            </Box>
                          )}
                          {!sidePin || hoverEnable ? (
                            <Box
                              sx={{
                                transition: 'all 0.3s',
                                visibility: sidePin && !hoverEnable ? 'hidden' : '',
                                width: '100%',
                                // height: "18px",
                                overflow: 'scroll',
                              }}
                              className="sidebar__menu__item__text"
                            >
                              {item.display ? item.display : appMenus.menus[item.name].displayName}
                            </Box>
                          ) : null}

                        </ListItemButton>
                      </Link>
                      {!sidePin || hoverEnable ? (
                        <>
                          {sideNavItem
                            && sideNavItem.includes(
                              appMenus.menus[item.name].pathString,
                            ) ? (
                              <Box
                                component="ul"
                                sx={{
                                  margin: 0,
                                }}
                              />
                            ) : null}
                        </>
                      ) : null}
                    </React.Fragment>
                ),
              )}
            {groupedModules && groupedModules.map((tl) => (
              <>
                {(!sidePin || hoverEnable) && (
                  <Typography
                    className="font-family-tab sidebar-group-text"
                    sx={{
                      opacity: 0.7, marginTop: '5px', marginBottom: '5px', textTransform: 'uppercase',
                    }}
                  >
                    {tl[0].name}
                  </Typography>
                )}
                {sideNavMenus
                  && getGroupModules(tl[0].id).map(
                    (item, index) => appMenus
                      && appMenus.menus
                      && appMenus.menus[item.name] && !item.is_hide && (
                        <React.Fragment key={index}>
                          {menuList(item.name)?.length > 0 && item.name !== 'Occupancy' ? (
                            <ListItemButton
                              sx={{
                                display: 'flex',
                                justifyContent: sidePin ? 'center' : '',
                              }}
                              className={`sidebar__menu__item ${(item.name !== 'Home' && sideNavItem && sideNavItem.includes(appMenus.menus[item.name].pathString)
                                || (item.name === 'Home' && window.location.pathname === '/'))
                                ? 'active'
                                : ''} ${anchorId === item.id ? 'selected-menu-sidebar' : ''}`}
                              style={(item.name !== 'Home' && sideNavItem && sideNavItem.includes(appMenus.menus[item.name].pathString)
                                || (item.name === 'Home' && window.location.pathname === '/'))
                                ? { color: AddThemeColor({}).color, background: '#0000001f 0% 0% no-repeat padding-box' }
                                : {}}
                              onClick={(event) => {
                                // setNavItem(appMenus.menus[item.name].path);
                                onMenuOpenClick(event, item);
                              }}
                              onMouseLeave={() => onMenuClose()}
                            >
                              {sidePin && !hoverEnable && !menuList(item.name)?.length > 0 ? (
                                <MuiTooltip
                                  placement="right"
                                  title={(
                                    <Typography>
                                      {item.display ? item.display : appMenus.menus[item.name].displayName}
                                    </Typography>
                                  )}
                                >
                                  <Box
                                    className="sidebar__menu__item__icon"
                                    sx={activeIndex === index ? AddThemeColor({}) : {}}
                                  >
                                    <img
                                      src={
                                        sideNavItem
                                          && sideNavItem.includes(
                                            appMenus.menus[item.name].pathString,
                                          )
                                          ? HightlightIcons()[
                                            appMenus.menus[item.name].name
                                          ]
                                          : defaultIcon[
                                            appMenus.menus[item.name].name
                                          ]
                                      }
                                      width="20"
                                      height="20"
                                      alt="highLight"
                                      id="Tooltip"
                                    />
                                  </Box>
                                </MuiTooltip>
                              ) : navPin && !hoverEnable && menuList(item.name)?.length > 0 ? (
                                <MuiPopOver
                                  placement="right"
                                  title={(
                                    <Box
                                      sx={{
                                        paddingLeft: '0',
                                      }}
                                      component="ul"
                                    >
                                      <Typography
                                        sx={{
                                          display: 'flex',
                                          justifyContent: 'center',
                                        }}
                                        className="sub-option-item-header"
                                        style={sideNavItem
                                          && sideNavItem.includes(
                                            appMenus.menus[item.name].pathString,
                                          ) ? { color: AddThemeColor({}).color, fontWeight: 900 } : {}}
                                      >
                                        {item.display ? item.display : appMenus.menus[item.name].displayName}
                                      </Typography>
                                      <Divider sx={{ my: 0.5 }} />
                                      {menuList(item.name).length > 0
                                        && menuList(item.name).map(
                                          (menuItem) => checkSubMenuExists(menuItem) && (
                                            <Link
                                              to={`${getLink(menuItem)}#${item?.id
                                              }`}
                                            >
                                              <li
                                                className="sub-option-item"
                                                style={activeSubOptionPath === getLink(menuItem) ? { color: AddThemeColor({}).color, fontWeight: 900 } : {}}
                                              >
                                                <RxDotFilled size={20} />
                                                {getDisplayName(menuItem)}
                                              </li>
                                            </Link>
                                          ),
                                        )}
                                    </Box>
                                  )}
                                >
                                  <Box
                                    className={`sidebar__menu__item__icon ${activeIndex === index
                                      ? 'active-sidebar-icon'
                                      : ''
                                    }`}
                                  >
                                    <img
                                      src={
                                        sideNavItem
                                          && sideNavItem.includes(
                                            appMenus.menus[item.name].pathString,
                                          )
                                          ? HightlightIcons()[
                                            appMenus.menus[item.name].name
                                          ]
                                          : defaultIcon[
                                            appMenus.menus[item.name].name
                                          ]
                                      }
                                      width="20"
                                      height="20"
                                      alt="highLight"
                                      id="Tooltip"
                                    />
                                  </Box>
                                </MuiPopOver>
                              ) : (
                                <Box
                                  className={`sidebar__menu__item__icon ${activeIndex === index
                                    ? 'active-sidebar-icon'
                                    : ''
                                  }`}
                                >
                                  <img
                                    src={
                                      sideNavItem
                                        && sideNavItem.includes(
                                          appMenus.menus[item.name].pathString,
                                        )
                                        ? HightlightIcons()[
                                          appMenus.menus[item.name].name
                                        ]
                                        : defaultIcon[
                                          appMenus.menus[item.name].name
                                        ]
                                    }
                                    width="20"
                                    height="20"
                                    alt="highLight"
                                    id="Tooltip"
                                  />
                                </Box>
                              )}
                              {!sidePin || hoverEnable ? (
                                <Box
                                  sx={{
                                    transition: 'all 0.3s',
                                    visibility: sidePin && !hoverEnable ? 'hidden' : '',
                                    width: '100%',
                                    // height: "18px",
                                    overflow: 'scroll',
                                  }}
                                  className="sidebar__menu__item__text"
                                >
                                  {item.display ? item.display : appMenus.menus[item.name].displayName}
                                </Box>
                              ) : null}
                              {(!sidePin || hoverEnable) && menuList(item.name).length > 0 ? (
                                <>
                                  <IoMdArrowDropright
                                    size={25}
                                    className={
                                      sideNavItem
                                        && sideNavItem.includes(
                                          appMenus.menus[item.name].pathString,
                                        )
                                        ? 'sub-option-icon'
                                        : 'sub-option-icon'
                                    }
                                    id={`${item.id}-id`}
                                    // className="float-right"
                                    aria-controls={anchorId === item.id ? 'basic-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={anchorId === item.id ? 'true' : undefined}
                                    onMouseOver={(event) => onMenuOpen(event, item)}
                                  />
                                  <Menu
                                    id="basic-menu"
                                    anchorEl={anchorEl}
                                    open={anchorId === item.id}
                                    MenuListProps={{
                                      'aria-labelledby': `basic-button-${item.id}`,
                                      onMouseLeave: () => onMenuCloseFull(),
                                    }}
                                    onClose={() => onMenuCloseFull()}
                                    onMouseLeave={() => onMenuCloseFull()}
                                    BackdropProps={{ invisible: true }}
                                  // ModalProps={{ hideBackdrop: true, disableScrollLock: true }}
                                  >
                                    {menuList(item.name).length > 0
                                      && menuList(item.name).map(
                                        (menuItem) => checkSubMenuExists(menuItem) && (
                                          <Link
                                            to={`${getLink(menuItem)}#${item?.id}`}
                                          >
                                            <MenuItem className="font-family-tab menu-item-text" onClick={() => onSubMenuClose()} selected={activeSubOptionPath === getLink(menuItem)}>

                                              {getDisplayName(menuItem)}

                                            </MenuItem>
                                          </Link>
                                        ),
                                      )}
                                  </Menu>

                                </>
                              ) : null}
                            </ListItemButton>
                          ) : (
                            <Link
                              to={`${appMenus.menus[item.name].path}#${item?.id}`}
                            >
                              <ListItemButton
                                sx={{
                                  display: 'flex',
                                  justifyContent: sidePin ? 'center' : '',
                                }}
                                className={`sidebar__menu__item ${(item.name !== 'Home' && sideNavItem && sideNavItem.includes(appMenus.menus[item.name].pathString)
                                  || (item.name === 'Home' && window.location.pathname === '/'))
                                  ? 'active'
                                  : ''} ${anchorId === item.id ? 'selected-menu-sidebar' : ''}`}
                                style={(item.name !== 'Home' && sideNavItem && sideNavItem.includes(appMenus.menus[item.name].pathString)
                                  || (item.name === 'Home' && window.location.pathname === '/'))
                                  ? { color: AddThemeColor({}).color, background: '#0000001f 0% 0% no-repeat padding-box' }
                                  : {}}
                                onClick={(event) => {
                                  // setNavItem(appMenus.menus[item.name].path);
                                  onMenuOpenClick(event, item);
                                }}
                                onMouseLeave={() => onMenuClose()}
                              >
                                {sidePin && !hoverEnable && !menuList(item.name)?.length > 0 ? (
                                  <MuiTooltip
                                    placement="right"
                                    title={(
                                      <Typography>
                                        {item.display ? item.display : appMenus.menus[item.name].displayName}
                                      </Typography>
                                    )}
                                  >
                                    <Box
                                      className="sidebar__menu__item__icon"
                                      sx={activeIndex === index ? AddThemeColor({}) : {}}
                                    >
                                      <img
                                        src={
                                          sideNavItem
                                            && sideNavItem.includes(
                                              appMenus.menus[item.name].pathString,
                                            )
                                            ? HightlightIcons()[
                                              appMenus.menus[item.name].name
                                            ]
                                            : defaultIcon[
                                              appMenus.menus[item.name].name
                                            ]
                                        }
                                        width="20"
                                        height="20"
                                        alt="highLight"
                                        id="Tooltip"
                                      />
                                    </Box>
                                  </MuiTooltip>
                                ) : navPin && !hoverEnable && menuList(item.name)?.length > 0 ? (
                                  <MuiPopOver
                                    placement="right"
                                    title={(
                                      <Box
                                        sx={{
                                          paddingLeft: '0',
                                        }}
                                        component="ul"
                                      >
                                        <Typography
                                          sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                          }}
                                          className="sub-option-item-header"
                                          style={sideNavItem
                                            && sideNavItem.includes(
                                              appMenus.menus[item.name].pathString,
                                            ) ? { color: AddThemeColor({}).color, fontWeight: 900 } : {}}
                                        >
                                          {item.display ? item.display : appMenus.menus[item.name].displayName}
                                        </Typography>
                                        <Divider sx={{ my: 0.5 }} />
                                        {menuList(item.name).length > 0
                                          && menuList(item.name).map(
                                            (menuItem) => checkSubMenuExists(menuItem) && (
                                              <Link
                                                to={`${getLink(menuItem)}#${item?.id
                                                }`}
                                              >
                                                <li
                                                  className="sub-option-item"
                                                  style={activeSubOptionPath === getLink(menuItem) ? { color: AddThemeColor({}).color, fontWeight: 900 } : {}}
                                                >
                                                  <RxDotFilled size={20} />
                                                  {getDisplayName(menuItem)}
                                                </li>
                                              </Link>
                                            ),
                                          )}
                                      </Box>
                                    )}
                                  >
                                    <Box
                                      className={`sidebar__menu__item__icon ${activeIndex === index
                                        ? 'active-sidebar-icon'
                                        : ''
                                      }`}
                                    >
                                      <img
                                        src={
                                          sideNavItem
                                            && sideNavItem.includes(
                                              appMenus.menus[item.name].pathString,
                                            )
                                            ? HightlightIcons()[
                                              appMenus.menus[item.name].name
                                            ]
                                            : defaultIcon[
                                              appMenus.menus[item.name].name
                                            ]
                                        }
                                        width="20"
                                        height="20"
                                        alt="highLight"
                                        id="Tooltip"
                                      />
                                    </Box>
                                  </MuiPopOver>
                                ) : (
                                  <Box
                                    className={`sidebar__menu__item__icon ${activeIndex === index
                                      ? 'active-sidebar-icon'
                                      : ''
                                    }`}
                                  >
                                    <img
                                      src={
                                        sideNavItem
                                          && sideNavItem.includes(
                                            appMenus.menus[item.name].pathString,
                                          )
                                          ? HightlightIcons()[
                                            appMenus.menus[item.name].name
                                          ]
                                          : defaultIcon[
                                            appMenus.menus[item.name].name
                                          ]
                                      }
                                      width="20"
                                      height="20"
                                      alt="highLight"
                                      id="Tooltip"
                                    />
                                  </Box>
                                )}
                                {!sidePin || hoverEnable ? (
                                  <Box
                                    sx={{
                                      transition: 'all 0.3s',
                                      visibility: sidePin && !hoverEnable ? 'hidden' : '',
                                      width: '100%',
                                      // height: "18px",
                                      overflow: 'scroll',
                                    }}
                                    className="sidebar__menu__item__text"
                                  >
                                    {item.display ? item.display : appMenus.menus[item.name].displayName}
                                  </Box>
                                ) : null}
                                {(!sidePin || hoverEnable) && menuList(item.name).length > 0 && item.name !== 'Occupancy' ? (
                                  <>
                                    <IoMdArrowDropright
                                      size={25}
                                      className={
                                        sideNavItem
                                          && sideNavItem.includes(
                                            appMenus.menus[item.name].pathString,
                                          )
                                          ? 'sub-option-icon'
                                          : 'sub-option-icon'
                                      }
                                      id={`${item.id}-id`}
                                      // className="float-right"
                                      aria-controls={anchorId === item.id ? 'basic-menu' : undefined}
                                      aria-haspopup="true"
                                      aria-expanded={anchorId === item.id ? 'true' : undefined}
                                      onMouseOver={(event) => onMenuOpen(event, item)}
                                    />
                                    <Menu
                                      id="basic-menu"
                                      anchorEl={anchorEl}
                                      open={anchorId === item.id}
                                      MenuListProps={{
                                        'aria-labelledby': `basic-button-${item.id}`,
                                        onMouseLeave: () => onMenuCloseFull(),
                                      }}
                                      onClose={() => onMenuCloseFull()}
                                      onMouseLeave={() => onMenuCloseFull()}
                                      BackdropProps={{ invisible: true }}
                                    // ModalProps={{ hideBackdrop: true, disableScrollLock: true }}
                                    >
                                      {menuList(item.name).length > 0
                                        && menuList(item.name).map(
                                          (menuItem) => checkSubMenuExists(menuItem) && (
                                            <Link
                                              to={`${getLink(menuItem)}#${item?.id}`}
                                            >
                                              <MenuItem className="font-family-tab menu-item-text" onClick={() => onSubMenuClose()} selected={activeSubOptionPath === getLink(menuItem)}>

                                                {getDisplayName(menuItem)}

                                              </MenuItem>
                                            </Link>
                                          ),
                                        )}
                                    </Menu>

                                  </>
                                ) : null}
                              </ListItemButton>
                            </Link>
                          )}
                          {!sidePin || hoverEnable ? (
                            <>
                              {sideNavItem
                                && sideNavItem.includes(
                                  appMenus.menus[item.name].pathString,
                                ) ? (
                                  <Box
                                    component="ul"
                                    sx={{
                                      margin: 0,
                                    }}
                                  />
                                ) : null}
                            </>
                          ) : null}
                        </React.Fragment>
                    ),
                  )}
              </>
            ))}
            {!(allGroups && allGroups.length > 0) && (
              <>

                {sideNavMenus
                  && newNavList.map(
                    (item, index) => appMenus
                      && appMenus.menus
                      && appMenus.menus[item.name] && !item.is_hide && (
                        <React.Fragment key={index}>
                          {menuList(item.name)?.length > 0 && item.name !== 'Occupancy' ? (
                            <ListItemButton
                              sx={{
                                display: 'flex',
                                justifyContent: sidePin ? 'center' : '',
                              }}
                              className={`sidebar__menu__item ${(item.name !== 'Home' && sideNavItem && sideNavItem.includes(appMenus.menus[item.name].pathString)
                                || (item.name === 'Home' && window.location.pathname === '/'))
                                ? 'active'
                                : ''} ${anchorId === item.id ? 'selected-menu-sidebar' : ''}`}
                              style={(item.name !== 'Home' && sideNavItem && sideNavItem.includes(appMenus.menus[item.name].pathString)
                                || (item.name === 'Home' && window.location.pathname === '/'))
                                ? { color: AddThemeColor({}).color, background: '#0000001f 0% 0% no-repeat padding-box' }
                                : {}}
                              onClick={(event) => {
                                // setNavItem(appMenus.menus[item.name].path);
                                onMenuOpenClick(event, item);
                              }}
                              onMouseLeave={() => onMenuClose()}
                            >
                              {sidePin && !hoverEnable && !menuList(item.name)?.length > 0 ? (
                                <MuiTooltip
                                  placement="right"
                                  title={(
                                    <Typography>
                                      {item.display ? item.display : appMenus.menus[item.name].displayName}
                                    </Typography>
                                  )}
                                >
                                  <Box
                                    className="sidebar__menu__item__icon"
                                    sx={activeIndex === index ? AddThemeColor({}) : {}}
                                  >
                                    <img
                                      src={
                                        sideNavItem
                                          && sideNavItem.includes(
                                            appMenus.menus[item.name].pathString,
                                          )
                                          ? HightlightIcons()[
                                            appMenus.menus[item.name].name
                                          ]
                                          : defaultIcon[
                                            appMenus.menus[item.name].name
                                          ]
                                      }
                                      width="20"
                                      height="20"
                                      alt="highLight"
                                      id="Tooltip"
                                    />
                                  </Box>
                                </MuiTooltip>
                              ) : navPin && !hoverEnable && menuList(item.name)?.length > 0 ? (
                                <MuiPopOver
                                  placement="right"
                                  title={(
                                    <Box
                                      sx={{
                                        paddingLeft: '0',
                                      }}
                                      component="ul"
                                    >
                                      <Typography
                                        sx={{
                                          display: 'flex',
                                          justifyContent: 'center',
                                        }}
                                        className="sub-option-item-header"
                                        style={sideNavItem
                                          && sideNavItem.includes(
                                            appMenus.menus[item.name].pathString,
                                          ) ? { color: AddThemeColor({}).color, fontWeight: 900 } : {}}
                                      >
                                        {item.display ? item.display : appMenus.menus[item.name].displayName}
                                      </Typography>
                                      <Divider sx={{ my: 0.5 }} />
                                      {menuList(item.name).length > 0
                                        && menuList(item.name).map(
                                          (menuItem) => checkSubMenuExists(menuItem) && (
                                            <Link
                                              to={`${getLink(menuItem)}#${item?.id
                                              }`}
                                            >
                                              <li
                                                className="sub-option-item"
                                                style={activeSubOptionPath === getLink(menuItem) ? { color: AddThemeColor({}).color, fontWeight: 900 } : {}}
                                              >
                                                <RxDotFilled size={20} />
                                                {getDisplayName(menuItem)}
                                              </li>
                                            </Link>
                                          ),
                                        )}
                                    </Box>
                                  )}
                                >
                                  <Box
                                    className={`sidebar__menu__item__icon ${activeIndex === index
                                      ? 'active-sidebar-icon'
                                      : ''
                                    }`}
                                  >
                                    <img
                                      src={
                                        sideNavItem
                                          && sideNavItem.includes(
                                            appMenus.menus[item.name].pathString,
                                          )
                                          ? HightlightIcons()[
                                            appMenus.menus[item.name].name
                                          ]
                                          : defaultIcon[
                                            appMenus.menus[item.name].name
                                          ]
                                      }
                                      width="20"
                                      height="20"
                                      alt="highLight"
                                      id="Tooltip"
                                    />
                                  </Box>
                                </MuiPopOver>
                              ) : (
                                <Box
                                  className={`sidebar__menu__item__icon ${activeIndex === index
                                    ? 'active-sidebar-icon'
                                    : ''
                                  }`}
                                >
                                  <img
                                    src={
                                      sideNavItem
                                        && sideNavItem.includes(
                                          appMenus.menus[item.name].pathString,
                                        )
                                        ? HightlightIcons()[
                                          appMenus.menus[item.name].name
                                        ]
                                        : defaultIcon[
                                          appMenus.menus[item.name].name
                                        ]
                                    }
                                    width="20"
                                    height="20"
                                    alt="highLight"
                                    id="Tooltip"
                                    className="img1"
                                  />
                                </Box>
                              )}
                              {!sidePin || hoverEnable ? (
                                <Box
                                  sx={{
                                    transition: 'all 0.3s',
                                    visibility: sidePin && !hoverEnable ? 'hidden' : '',
                                    width: '100%',
                                    // height: "18px",
                                    overflow: 'scroll',
                                  }}
                                  className="sidebar__menu__item__text"
                                >
                                  {item.display ? item.display : appMenus.menus[item.name].displayName}
                                </Box>
                              ) : null}
                              {(!sidePin || hoverEnable) && menuList(item.name).length > 0 && item.name !== 'Occupancy' ? (
                                <>
                                  <IoMdArrowDropright
                                    size={25}
                                    className={
                                      sideNavItem
                                        && sideNavItem.includes(
                                          appMenus.menus[item.name].pathString,
                                        )
                                        ? 'sub-option-icon'
                                        : 'sub-option-icon'
                                    }
                                    id={`${item.id}-id`}
                                    // className="float-right"
                                    aria-controls={anchorId === item.id ? 'basic-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={anchorId === item.id ? 'true' : undefined}
                                    onMouseOver={(event) => onMenuOpen(event, item)}
                                  />
                                  <Menu
                                    id="basic-menu"
                                    anchorEl={anchorEl}
                                    open={anchorId === item.id}
                                    MenuListProps={{
                                      'aria-labelledby': `basic-button-${item.id}`,
                                      onMouseLeave: () => onMenuCloseFull(),
                                    }}
                                    onClose={() => onMenuCloseFull()}
                                    onMouseLeave={() => onMenuCloseFull()}
                                    BackdropProps={{ invisible: true }}
                                  // ModalProps={{ hideBackdrop: true, disableScrollLock: true }}
                                  >
                                    {menuList(item.name).length > 0
                                      && menuList(item.name).map(
                                        (menuItem) => checkSubMenuExists(menuItem) && (
                                          <Link
                                            to={`${getLink(menuItem)}#${item?.id}`}
                                          >
                                            <MenuItem className="font-family-tab menu-item-text" onClick={() => onSubMenuClose()} selected={activeSubOptionPath === getLink(menuItem)}>

                                              {getDisplayName(menuItem)}

                                            </MenuItem>
                                          </Link>
                                        ),
                                      )}
                                  </Menu>

                                </>
                              ) : null}
                            </ListItemButton>
                          ) : (
                            <Link
                              to={`${appMenus.menus[item.name].path}#${item?.id}`}
                            >
                              <ListItemButton
                                sx={{
                                  display: 'flex',
                                  justifyContent: sidePin ? 'center' : '',
                                }}
                                className={`sidebar__menu__item ${(item.name !== 'Home' && sideNavItem && sideNavItem.includes(appMenus.menus[item.name].pathString)
                                  || (item.name === 'Home' && window.location.pathname === '/'))
                                  ? 'active'
                                  : ''} ${anchorId === item.id ? 'selected-menu-sidebar' : ''}`}
                                style={(item.name !== 'Home' && sideNavItem && sideNavItem.includes(appMenus.menus[item.name].pathString)
                                  || (item.name === 'Home' && window.location.pathname === '/'))
                                  ? { color: AddThemeColor({}).color, background: '#0000001f 0% 0% no-repeat padding-box' }
                                  : {}}
                                onClick={(event) => {
                                  // setNavItem(appMenus.menus[item.name].path);
                                  onMenuOpenClick(event, item);
                                }}
                                onMouseLeave={() => onMenuClose()}
                              >
                                {sidePin && !hoverEnable && !menuList(item.name)?.length > 0 ? (
                                  <MuiTooltip
                                    placement="right"
                                    title={(
                                      <Typography>
                                        {item.display ? item.display : appMenus.menus[item.name].displayName}
                                      </Typography>
                                    )}
                                  >
                                    <Box
                                      className="sidebar__menu__item__icon"
                                      sx={activeIndex === index ? AddThemeColor({}) : {}}
                                    >
                                      <img
                                        src={
                                          sideNavItem
                                            && sideNavItem.includes(
                                              appMenus.menus[item.name].pathString,
                                            )
                                            ? HightlightIcons()[
                                              appMenus.menus[item.name].name
                                            ]
                                            : defaultIcon[
                                              appMenus.menus[item.name].name
                                            ]
                                        }
                                        width="20"
                                        height="20"
                                        alt="highLight"
                                        id="Tooltip"
                                      />
                                    </Box>
                                  </MuiTooltip>
                                ) : navPin && !hoverEnable && menuList(item.name)?.length > 0 ? (
                                  <MuiPopOver
                                    placement="right"
                                    title={(
                                      <Box
                                        sx={{
                                          paddingLeft: '0',
                                        }}
                                        component="ul"
                                      >
                                        <Typography
                                          sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                          }}
                                          className="sub-option-item-header"
                                          style={sideNavItem
                                            && sideNavItem.includes(
                                              appMenus.menus[item.name].pathString,
                                            ) ? { color: AddThemeColor({}).color, fontWeight: 900 } : {}}
                                        >
                                          {item.display ? item.display : appMenus.menus[item.name].displayName}
                                        </Typography>
                                        <Divider sx={{ my: 0.5 }} />
                                        {menuList(item.name).length > 0
                                          && menuList(item.name).map(
                                            (menuItem) => checkSubMenuExists(menuItem) && (
                                              <Link
                                                to={`${getLink(menuItem)}#${item?.id
                                                }`}
                                              >
                                                <li
                                                  className="sub-option-item"
                                                  style={activeSubOptionPath === getLink(menuItem) ? { color: AddThemeColor({}).color, fontWeight: 900 } : {}}
                                                >
                                                  <RxDotFilled size={20} />
                                                  {getDisplayName(menuItem)}
                                                </li>
                                              </Link>
                                            ),
                                          )}
                                      </Box>
                                    )}
                                  >
                                    <Box
                                      className={`sidebar__menu__item__icon ${activeIndex === index
                                        ? 'active-sidebar-icon'
                                        : ''
                                      }`}
                                    >
                                      <img
                                        src={
                                          sideNavItem
                                            && sideNavItem.includes(
                                              appMenus.menus[item.name].pathString,
                                            )
                                            ? HightlightIcons()[
                                              appMenus.menus[item.name].name
                                            ]
                                            : defaultIcon[
                                              appMenus.menus[item.name].name
                                            ]
                                        }
                                        width="20"
                                        height="20"
                                        alt="highLight"
                                        id="Tooltip"
                                      />
                                    </Box>
                                  </MuiPopOver>
                                ) : (
                                  <Box
                                    className={`sidebar__menu__item__icon ${activeIndex === index
                                      ? 'active-sidebar-icon'
                                      : ''
                                    }`}
                                  >
                                    <img
                                      src={
                                        sideNavItem
                                          && sideNavItem.includes(
                                            appMenus.menus[item.name].pathString,
                                          )
                                          ? HightlightIcons()[
                                            appMenus.menus[item.name].name
                                          ]
                                          : defaultIcon[
                                            appMenus.menus[item.name].name
                                          ]
                                      }
                                      width="20"
                                      height="20"
                                      alt="highLight"
                                      id="Tooltip"
                                    />
                                  </Box>
                                )}
                                {!sidePin || hoverEnable ? (
                                  <Box
                                    sx={{
                                      transition: 'all 0.3s',
                                      visibility: sidePin && !hoverEnable ? 'hidden' : '',
                                      width: '100%',
                                      // height: "18px",
                                      overflow: 'scroll',
                                    }}
                                    className="sidebar__menu__item__text"
                                  >
                                    {item.display ? item.display : appMenus.menus[item.name].displayName}
                                  </Box>
                                ) : null}
                                {(!sidePin || hoverEnable) && menuList(item.name).length > 0 && item.name !== 'Occupancy' ? (
                                  <>
                                    <IoMdArrowDropright
                                      size={25}
                                      className={
                                        sideNavItem
                                          && sideNavItem.includes(
                                            appMenus.menus[item.name].pathString,
                                          )
                                          ? 'sub-option-icon'
                                          : 'sub-option-icon'
                                      }
                                      id={`${item.id}-id`}
                                      // className="float-right"
                                      aria-controls={anchorId === item.id ? 'basic-menu' : undefined}
                                      aria-haspopup="true"
                                      aria-expanded={anchorId === item.id ? 'true' : undefined}
                                      onMouseOver={(event) => onMenuOpen(event, item)}
                                    />
                                    <Menu
                                      id="basic-menu"
                                      anchorEl={anchorEl}
                                      open={anchorId === item.id}
                                      MenuListProps={{
                                        'aria-labelledby': `basic-button-${item.id}`,
                                        onMouseLeave: () => onMenuCloseFull(),
                                      }}
                                      onClose={() => onMenuCloseFull()}
                                      onMouseLeave={() => onMenuCloseFull()}
                                      BackdropProps={{ invisible: true }}
                                    // ModalProps={{ hideBackdrop: true, disableScrollLock: true }}
                                    >
                                      {menuList(item.name).length > 0
                                        && menuList(item.name).map(
                                          (menuItem) => checkSubMenuExists(menuItem) && (
                                            <Link
                                              to={`${getLink(menuItem)}#${item?.id}`}
                                            >
                                              <MenuItem className="font-family-tab menu-item-text" onClick={() => onSubMenuClose()} selected={activeSubOptionPath === getLink(menuItem)}>

                                                {getDisplayName(menuItem)}

                                              </MenuItem>
                                            </Link>
                                          ),
                                        )}
                                    </Menu>

                                  </>
                                ) : null}
                              </ListItemButton>
                            </Link>
                          )}
                          {!sidePin || hoverEnable ? (
                            <>
                              {sideNavItem
                                && sideNavItem.includes(
                                  appMenus.menus[item.name].pathString,
                                ) ? (
                                  <Box
                                    component="ul"
                                    sx={{
                                      margin: 0,
                                    }}
                                  />
                                ) : null}
                            </>
                          ) : null}
                        </React.Fragment>
                    ),
                  )}
              </>
            )}
          </Box>
        </Box>
      )}
    </>
  );
};

export default Sidenav;
