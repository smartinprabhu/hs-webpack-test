/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable camelcase */
/* eslint-disable no-restricted-globals */
/* eslint-disable react/prop-types */
/* eslint-disable no-nested-ternary */
/* eslint-disable import/no-unresolved */
/* eslint-disable react/no-danger */
/* eslint-disable array-callback-return */
import moment from 'moment-timezone';
import React, { useEffect, useMemo, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useIdleTimer } from 'react-idle-timer';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';

import { TextField } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CloseIcon from '@mui/icons-material/Close';
import {
  Badge,
  Box,
  Button,
  ClickAwayListener,
  Divider,
  Paper,
  Popper,
  Snackbar,
  Typography,
} from '@mui/material';
import FormControl from '@mui/material/FormControl';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import ModalHeaderComponent from '@shared/modalHeaderComponent';
import { IoMdNotificationsOutline } from 'react-icons/io';
import {
  Col,
  Modal,
  ModalBody,
  Row
} from 'reactstrap';
import HeaderSegments from './headerSegments';

import { useTheme } from '../../ThemeContext';
import ThemeToggleButton from '../../ThemeToggleButton';
import {
  updateUser,
} from '../../adminSetup/setupService';
import { logout } from '../../auth/auth';
import { savePinEnable } from '../../auth/authActions';
import InsightsGlobalSearch from '../../commonComponents/insightsGlobalSearch';
import appsList from '../../data/apps.json';
import actionCodes from '../../helpdesk/data/helpdeskActionCodes.json';
import { AddThemeColor } from '../../themes/theme';
import { getUserDetails } from '../../user/userService';
import applicationDetails from '../../util/ClientDetails.json';
import {
  detectMob,
  getAllCompanies,
  getAllowedCompanies,
  getBaseDomain,
  getJsonString,
  getListOfOperations,
  getLocalDateCustom, getLocalTimeOnly,
  isJsonString,
  getModuleDisplayName,
} from '../../util/appUtils';
import AuthService from '../../util/authService';
import './header.scss';
import HeaderProfile from './headerProfile';
import userSwitchCompany, {
  getAnnouncementById, markAsReadAnnouncements,
  saveTnC,
  saveViewer,
  setMenuExpand,
} from './headerService';
import './styles.css';
import SwitchLcationConfirmationComponent from './switchLocationConfirmationWindow';
import getIcon from './utils/utils';


const appConfig = require('../../config/appConfig').default;

const appModels = require('../../util/appModels').default;

const restApi = require('../../../middleware/api');

const authService = AuthService();

const Header = (props) => {
  const { themes } = useTheme();
  const {
    headerPath,
    nextPath,
    pathLink,
    extraPath,
    headerTabs,
    activeTab,
    TagsComponent,
  } = props;
  const { headerData } = useSelector((state) => state.header);

  const [value, setValue] = React.useState(activeTab || headerData?.activeTab);

  const dispatch = useDispatch();
  const history = useHistory();

  const [isOpen, setIsOpen] = useState(false);
  const [changeLocationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const changeLocationDropdownToggle = () => setLocationDropdownOpen(!changeLocationDropdownOpen);
  const [switchLocationModalWindowopen, switchLocationModalWindowSet] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [modalAlert, setModalAlert] = useState(false);
  const [modalAlarms, setModalAlarms] = useState(false);
  const [selectedDefaultOption, setSelectedDefaultOption] = useState([]);
  const [allowedCompanyList, setAllowedCompanyList] = useState([]);
  const [switchCompanyDetails, setswitchCompanyDetails] = useState();
  const [popAnnouncemnt, setPopAnnouncemnt] = useState(false);
  const [isModal, setModalOpen] = useState(false);
  const [isPrivacyModal, setPrivacyModalOpen] = useState(false);
  const [isHelpModal, setHelpModalOpen] = useState(false);
  const [isCookieModal, setCookieModalOpen] = useState(false);
  const [cookies, setCookie] = useCookies(['condition']);
  const [themeUrl, setThemeUrl] = useState('');
  const [isChecked, setIsChecked] = useState(false);
   const { notificationCountDR } = useSelector((state) => state.setup);
  const {
    popoverInfo,
    announcementsInfo,
    announcementInfo,
    menuExpand,
    switchCompanyInfo,
  } = useSelector((state) => state.header);
  const sortByValue = 'DESC';
  const sortFieldValue = 'create_date';

  const isMob = detectMob();
  const WEBAPPAPIURL = `${window.location.origin}/`;
  const ISAPIGATEWAY = appConfig.IS_USE_APIGATEWAY;

  const [addMarkAsReadModal, showMarkAsReadModal] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [logoutInfo, setLogoutInfo] = useState({
    loading: false,
    data: null,
    err: null,
  });

  const isBasePath = !!(appConfig.BASE_PATH && appConfig.BASE_PATH.includes('/v3'));
  const url = window.location.href;
  const { userInfo, userRoles } = useSelector((state) => state.user);


  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getWebsiteURL = (fullUrl) => {
    try {
      const urlCurrent = new URL(fullUrl);
      return urlCurrent.origin; // This gives you the protocol + domain, e.g., "https://example.com"
    } catch (error) {
      console.error('Invalid URL:', error);
      return null; // Handle invalid URL
    }
  };

  const handleSwitchBack = () => {
    const isWebUserJson = userInfo && userInfo.data && userInfo.data.user_preference
    && isJsonString(userInfo.data.user_preference) && isJsonString(userInfo.data.user_preference) && getJsonString(userInfo.data.user_preference) ? getJsonString(userInfo.data.user_preference) : false;
    let obj = {
      theme_version: 'v2',
    };
    if (isWebUserJson) {
      const exObj = { ...isWebUserJson };
      exObj.theme_version = 'v2';
      obj = exObj;
    }
    const postDataValues = {
      user_preference: JSON.stringify(obj),
    };
    dispatch(updateUser(userInfo && userInfo.data && userInfo.data.tenant_id, postDataValues, appModels.TEAMMEMEBERS));
    window.localStorage.setItem('user_theme', 'v2');
    setOpen(false);
    setTimeout(() => {
      window.location.href = getWebsiteURL(url);
    }, 2000);
  };

  const handleStay = () => {
    window.localStorage.setItem('user_theme', 'v3');
    setOpen(false);
  };

  const isV3Theme = (window.localStorage.getItem('user_theme') && window.localStorage.getItem('user_theme') === 'v3');

  useEffect(() => {
    if (isV3Theme) {
      setOpen(false);
    }
  }, [window.localStorage.getItem('user_theme')]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (headerData.dispatchFunc) { dispatch(headerData.dispatchFunc()); }
  };

  const openPopAnnouncemnt = () => setPopAnnouncemnt(true);
  const openPopover = () => setPopoverOpen(!popoverOpen);
  const toggleAlert = () => setModalAlert(!modalAlert);
  const toggle = () => {
    setIsOpen(!isOpen);
    if (isMob) {
      dispatch(setMenuExpand(!menuExpand));
    }
  };

  const { updateImage } = useSelector((state) => state.userProfile);
  const { allowedCompanies } = useSelector((state) => state.setup);

  const { pinEnableData } = useSelector((state) => state.auth);

  const companies = getAllowedCompanies(userInfo);

  const allowedOperations = getListOfOperations(
    userRoles && userRoles.data ? userRoles.data.allowed_modules : [],
    'code',
  );
  const isShowAll = !!(
    allowedOperations && allowedOperations.includes(actionCodes['All Commpany'])
  );

  const handleOnIdle = () => {
    history.push({ pathname: '/' });
    dispatch(logout());
    window.localStorage.setItem('isAllCompany', 'no');
  };
  let idle_expiry_time = 500;

  if (userInfo && userInfo.data && userInfo.data.maintenance_setting && userInfo.data.maintenance_setting.inactive_timeout_web && parseInt(userInfo.data.maintenance_setting.inactive_timeout_web) > 0) {
    idle_expiry_time = parseInt(userInfo.data.maintenance_setting.inactive_timeout_web);
  }

  if (idle_expiry_time && idle_expiry_time > 0) {
    const idleTimer = useIdleTimer({
      timeout: 1000 * 60 * idle_expiry_time,
      onIdle: handleOnIdle,
    });
  }

  useEffect(() => {
    const favicon = document.getElementById('favicon');
    applicationDetails.map((details) => {
      if (details.client === appConfig.CLIENTNAME) {
        document.title = details.title;
        favicon.setAttribute('href', details.favicon);
      }
    });
  }, []);

  useEffect(() => {
    if (userInfo && !userInfo.data) {
      // dispatch(getUserDetails(authService.getAccessToken()));
    }
  }, []);

  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    if (userInfo && userInfo.data) {
      const isCompany = userInfo && userInfo.data && userInfo.data.is_parent;
      if (isCompany && currentPath && (currentPath === '/setup-facility' || currentPath === '/setup-team-management' || currentPath === '/setup-maintenance-configuration')) {
        history.push('/setup-overview');
        window.location.reload();
      } else if (!isCompany && currentPath && (currentPath === '/setup-users' || currentPath === '/setup-site')) {
        history.push('/setup-overview');
        window.location.reload();
      }
      // dispatch(getGatePassConfig(companies, appModels.GATEPASSCONFIGURATION));
    }
  }, [userInfo]);

  useEffect(() => {
    if (popoverInfo && Object.keys(popoverInfo).length > 0) {
      setPopAnnouncemnt(false);
      setModalAlarms(true);
    }
  }, [popoverInfo]);

  const openNotificationsPopover = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    dispatch(getAnnouncementById());
    dispatch(markAsReadAnnouncements());
  };

  useEffect(() => {
    if (announcementsInfo && announcementsInfo.length > 0) {
      setPopAnnouncemnt(false);
      showMarkAsReadModal(true);
    }
  }, [announcementsInfo]);

  useEffect(() => {
    if (
      userInfo
      && userInfo.data
      && userInfo.data.company
      && userInfo.data.company.id
    ) {
      // dispatch(getAnnouncementList(companies, appModels.ANNOUNCEMENT, sortByValue, sortFieldValue));
      const payload = {
        user_id: userInfo.data.id,
        beare_token: authService.getAccessToken(),
      };
    }
  }, [userInfo && userInfo.data]);

  useEffect(() => {
    if (updateImage && updateImage.data) {
      dispatch(getUserDetails(authService.getAccessToken()));
    }
  }, [updateImage]);

  const userInformation = userInfo;
  const { viewerInfo } = useSelector((state) => state.header);

  const isAll = !!(
    window.localStorage.getItem('isAllCompany')
    && window.localStorage.getItem('isAllCompany') === 'yes'
  );

  useEffect(() => {
    if (userInfo?.data?.timezone && userInfo?.data?.lang?.date_format) {
      window.localStorage.setItem(
        'TimeZone',
        `${userInfo.data.timezone} ${userInfo.data.lang.date_format}`,
      );
    }
  }, [userInfo]);

  useEffect(() => {
    if (
      userInformation
      && userInformation.data
      && userInformation.data.allowed_companies
      && userInformation.data.allowed_companies.length > 0
    ) {
      const allowedCompanyItems = [];
      userInformation.data.allowed_companies.forEach((site) => {
        if (site) {
          allowedCompanyItems.push({
            label: site.name,
            value: site.name,
            name: site.name,
            id: site.id,
          });
        }
      });
      if (userRoles && userRoles.data && !isShowAll) {
        window.localStorage.setItem('isAllCompany', 'no');
      }

      // const newAllowedCompanyItems = allowedCompanyItems && allowedCompanyItems.length && allowedCompanyItems.length > 1 && isShowAll
      //   ? allowedCompanyItems.concat({
      //     label: 'All', value: 'All', id: 'All', name: 'All',
      //   }) : allowedCompanyItems;

      setAllowedCompanyList(allowedCompanyItems);
    }
  }, [userInfo, userRoles]);

  useEffect(() => {
    if (userRoles && userRoles.data) {
      if (userInfo && userInfo.data && userInfo.data.is_parent && isShowAll) {
        window.localStorage.setItem('isAllCompany', 'yes');
      } else {
        window.localStorage.setItem('isAllCompany', 'no');
      }
    }
  }, [userInfo, userRoles]);

  const convertToBase64 = async (url, headers) => {
    try {
      const response = await fetch(url, { headers });
      if (!response.ok) {
        throw new Error(`Failed to fetch image, status ${response.status}`);
      }
      const blob = await response.blob();

      // Ensure reader is properly awaited
      const base64Data = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      // Store base64 data in local storage
      window.localStorage.setItem('vendor_logo', base64Data);
    } catch (error) {
      console.error('Error converting image to base64:', error);
    }
  };

  const isWebUserJson = userInfo && userInfo.data && userInfo.data.user_preference
  && isJsonString(userInfo.data.user_preference) && getJsonString(userInfo.data.user_preference) ? getJsonString(userInfo.data.user_preference) : false;
  const isThemeSwitch = appConfig.IS_SWITCH_THEME && appConfig.IS_SWITCH_THEME.toLowerCase() === 'yes';
  const userTheme = isWebUserJson && isWebUserJson.theme ? isWebUserJson.theme : '';

  useMemo(() => {
    if (userInfo && userInfo.data && userInfo.data.company && userInfo.data.company.file_path) {
      const clogo = userInfo.data.company.file_path;
      /* if (!window.localStorage.getItem('vendor_logo_url') || (window.localStorage.getItem('vendor_logo_url') && window.localStorage.getItem('vendor_logo_url') !== clogo)) {
        window.localStorage.setItem('vendor_logo_url', clogo);
        convertToBase64(getBaseDomain(clogo));
      } */
      window.localStorage.setItem('vendor_logo_url', clogo);
      const headers = {
        portalDomain: window.location.origin === 'http://localhost:3010' ? 'https://portal-dev.helixsense.com' : window.location.origin,
      };
      convertToBase64(getBaseDomain(clogo), headers);
    } else {
      window.localStorage.setItem('vendor_logo_url', false);
      window.localStorage.setItem('vendor_logo', false);
    }
    if (userInfo && userInfo.data && userInfo.data.email_validation_regex) {
      window.localStorage.setItem('email_regex', userInfo.data.email_validation_regex);
    } else {
      window.localStorage.setItem('email_regex', false);
    }
    if (userInfo && userInfo.data && userInfo.data.maintenance_setting && userInfo.data.maintenance_setting.warehouse_url) {
      window.localStorage.setItem('iot_url', userInfo.data.maintenance_setting.warehouse_url);
    } else {
      window.localStorage.setItem('iot_url', false);
    }
    if (userTheme) {
      window.localStorage.setItem('user_theme_mode', userTheme);
    } else {
      window.localStorage.setItem('user_theme_mode', '');
    }
  }, [userInfo]);

  useEffect(() => {
    // eslint-disable-next-line array-callback-return
    allowedCompanyList.filter((item) => {
      if (
        userInformation.data.company.id === item.id
        || (isAll && item.id === 'All')
      ) {
        setSelectedDefaultOption({
          label: item.name,
          value: item.name,
          name: item.name,
          id: item.id,
          isDisabled: true,
        });
      }
    });
  }, [allowedCompanyList]);

  useEffect(() => {
    if (
      viewerInfo.data
      && userInfo
      && userInfo.data
      && userInfo.data.company
      && userInfo.data.company.id
    ) {
      // dispatch(getAnnouncementList(companies, appModels.ANNOUNCEMENT, sortByValue, sortFieldValue));
      if (modalAlarms === true) setModalAlarms(!modalAlarms);
      if (addMarkAsReadModal === true) showMarkAsReadModal(!addMarkAsReadModal);
    }
  }, [viewerInfo]);

  const reactUrl = window.location.origin;

  const [theme, setTheme] = useState(
    localStorage.getItem('theme') === 'dark-style.css'
      ? 'dark-theme'
      : 'light-theme',
  );
  const toggleTheme = (data) => {
    if (data === 'dark-theme') {
      localStorage.setItem('theme', 'dark-style.css');
      setTheme('dark-theme');
    } else {
      localStorage.setItem('theme', 'light-style.css');
      setTheme('light-theme');
    }
  };

  /* useEffect(() => {
    if (appConfig.CLIENTNAME === 'sfx') {
      const themeClass = localStorage.getItem('theme') === 'dark-style.css' ? localStorage.getItem('theme') : 'light-style.css';
      if (themeClass === 'dark-style.css') {
        setThemeUrl('dark-theme.css');
        localStorage.setItem('theme', 'dark-style.css');
      } else {
        setThemeUrl('light-theme.css');
        localStorage.setItem('theme', 'light-style.css');
      }
    } else {
      setThemeUrl('default-theme.css');
      localStorage.setItem('theme', 'default-style.css');
    }
  }, [theme]); */

  useEffect(() => {
    if (themeUrl) {
      const { head } = document;
      const link = document.createElement('link');
      link.type = 'text/css';
      link.rel = 'stylesheet';
      link.href = `${reactUrl}/${themeUrl}`;
      head.appendChild(link);

      return () => {
        head.removeChild(link);
      };
    }
  }, [themeUrl]);

  useEffect(() => {
    if (cookies.condition === undefined) {
      setCookieModalOpen(true);
    }
  }, []);

  function handleSetCookie() {
    setCookie('condition', 'Local_storage', {
      path: '/',
      secure: true,
      sameSite: 'strict',
    });
    setCookieModalOpen(false);
    if (
      userInfo
      && userInfo.data
      && !userInfo.data.is_terms_and_conditions_agreed
    ) {
      const postData = {
        is_terms_and_conditions_agreed: isChecked,
      };
      dispatch(
        saveTnC(appModels.TEAMMEMEBERS, userInfo.data.tenant_id, postData),
      );
    }
  }

  useEffect(() => {
    if (headerData?.activeTab !== undefined) {
      setValue(headerData?.activeTab);
    }
  }, [headerData]);

  const saveViewersModel = () => {
    setModalAlarms(!modalAlarms);
  };

  const closeMarkAsReadModel = () => {
    showMarkAsReadModal(!addMarkAsReadModal);
  };

  const markAllRead = (announcementData) => {
    let viewedArr = [];
    viewedArr = _.filter(announcementData, { viewed_on: '' });
    const postData = [];

    const todayDate = new Date();
    if (viewedArr.length) {
      viewedArr.map((data) => {
        postData.push({
          model: appModels.ANNOUNCEMENT,
          employee_id: userInfo.data.employee.id,
          viewer_on: moment.utc(todayDate).format('YYYY-MM-DD HH:mm:ss'),
          hr_announcement_id: data.id,
        });
      });
      dispatch(saveViewer(appModels.ANNOUNCEMENTLINE, {
        values: postData,
      }));
    } else {
      showMarkAsReadModal(!addMarkAsReadModal);
    }
  };
  const latestNotificationLength = _.filter(announcementInfo.data, { viewed_on: '' });

  const saveViewersData = (values) => {
    if (values.viewed_on === '') {
      const postData = {};
      postData.model = appModels.ANNOUNCEMENT;
      postData.employee_id = userInfo.data.employee.id;
      const todayDate = (new Date());
      postData.viewer_on = moment.utc(todayDate).format('YYYY-MM-DD HH:mm:ss');
      postData.hr_announcement_id = values.id;
      const payload = {
        values: [postData],
      };
      dispatch(saveViewer(appModels.ANNOUNCEMENTLINE, payload));
    } else {
      setModalAlarms(!modalAlarms);
    }
  };

  const handleCheckboxChange = () => {
    if (isChecked === false) {
      setIsChecked(true);
    } else if (isChecked === true) {
      setIsChecked(false);
    }
  };

  useEffect(() => {
    if (userInfo && userInfo.err) {
      history.push({ pathname: '/' });
      dispatch(logout());
    }
    if (userInfo && userInfo.data && userInfo.data.home_web_model_id && userInfo.data.home_web_model_id.name) {
      const menuData = appsList.filter((item) => item.name === userInfo.data.home_web_model_id.name);
      if (menuData && menuData.length && (!window.localStorage.getItem('isDefaultRedirect') || window.localStorage.getItem('isDefaultRedirect') !== 'yes')) {
        window.localStorage.setItem(('isDefaultRedirect'), 'yes');
        history.push({ pathname: menuData[0].url });
      }
    }
  }, [userInfo]);

  /* const handleLogout = () => {
 try {
      if (appConfig.ONESIGNALAPPID && appConfig.ENV && window.location.origin) {
        window.OneSignal = window.OneSignal || [];
        OneSignal.push(() => {
          OneSignal.getTags((tags) => {
            const oneSignalTags = Object.keys(tags);
            if (oneSignalTags && oneSignalTags.length > 0) {
              OneSignal.deleteTags(oneSignalTags, () => {
                dispatchLogout();
              }).then(() => {
                dispatchLogout();
              }).catch(() => {
                dispatchLogout();
              });
            } else {
              dispatchLogout();
            }
          }).then(() => {
            dispatchLogout();
          }).catch(() => {
            dispatchLogout();
          });
        });
      } else {
        dispatchLogout();
      }
      dispatchLogout();
    } catch (e) {
      dispatchLogout();
      console.log(e);
    }
    dispatchLogout();
  }; */

  const setSwitchLocationModalOpen = () => {
    switchLocationModalWindowSet(!switchLocationModalWindowopen);
  };

  const successSwitchLocation = () => {
    window.location.reload();
  };

  const openSidebar = () => {
    dispatch(savePinEnable(false));
  };

  useEffect(() => {
    if (
      !switchLocationModalWindowopen
      && switchCompanyInfo
      && switchCompanyInfo.data
      && (switchCompanyInfo.data.data || switchCompanyInfo.data.status)
    ) {
      successSwitchLocation();
    }
  }, [switchCompanyInfo]);

  const switchCompany = (event, companyInfo) => {
    if (companyInfo.id !== selectedDefaultOption.id) {
      if (companyInfo.id === 'All') {
        const parCompany = userInfo.data.is_parent;
        const parId = !parCompany
          && userInfo.data
          && userInfo.data.company
          && userInfo.data.company.parent_id
          && userInfo.data.company.parent_id.id
          ? userInfo.data.company.parent_id.id
          : false;
        if (parId) {
          const switchLocationObj = {
            user_id: userInfo.data.id,
            company_id: parId,
          };
          dispatch(userSwitchCompany(switchLocationObj));
          window.localStorage.setItem('isAllCompany', 'yes');
        } else {
          window.localStorage.setItem('isAllCompany', 'yes');
          window.location.reload();
        }
      } else {
        window.localStorage.setItem('isAllCompany', 'no');
        setswitchCompanyDetails(companyInfo);
        setSwitchLocationModalOpen();
      }
    }
  };
  let switchCompanyConfirmationModal;

  if (switchCompanyDetails) {
    switchCompanyConfirmationModal = (
      <SwitchLcationConfirmationComponent
        switchLocationModalWindowopen={switchLocationModalWindowopen}
        setSwitchLocationModalOpen={setSwitchLocationModalOpen}
        switchCompanyDetails={switchCompanyDetails}
      />
    );
  }

  /* function sortArray(arr) {
    let res = [];
    if (arr) {
      const res1 = arr.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase());
      res = res1 && res1.length && isShowAll ? res1.concat({ id: 'All', name: 'All' }) : res1;
      if (!isShowAll) {
        window.localStorage.setItem(('isAllCompany'), 'no');
      }
    }
    return res;
  } */

  const showLogout = () => {
    setAnchorEl(null);
    setModalAlert(true);
  };

  const isAuthUser = userInformation
    && userInformation.data
    && userInformation.data.is_oauth_user_login;

  const handleHideHeader = () => {
    setIsHeaderVisible(false);
  };

  const HeaderProfileComponent = useMemo(() => <HeaderProfile handleHideHeader={handleHideHeader} />, []);

  const globalSearchEnable = headerData && headerData.moduleName && headerData.menuName && headerData.menuName === 'Insights';

  return (
    <>
      {userRoles && userRoles.data && isAuthUser && (
        <>
          <header
            className="header-box"
            id="mainHeader"
          >
            <div
              className="insights-filter-box header-text text-capitalize"
              style={themes === 'light' ? { color: '#FFFFFF' } : AddThemeColor({}, themes)}
            >
              {' '}
              {userInformation?.data?.company?.parent_id?.name}
              {' '}
              |
              {' '}
              {userInformation?.data?.company?.name}
            </div>
            {userInformation && userInformation.data && isAuthUser && (
              <div className="insights-filter-box">
                {isBasePath && url.includes('/v3') && (
                <Snackbar
                  open={open}
                  message="Prefer the old theme? Switch back easily!"
                  action={(
                    <>
                      <Button
                        color="secondary"
                        size="small"
                        onClick={() => handleSwitchBack()}
                      >
                        Switch Back
                      </Button>
                      <Button
                        color="secondary"
                        size="small"
                        onClick={() => handleStay()}
                      >
                        Stay
                      </Button>
                    </>
      )}
                  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                />
                )}

                {isThemeSwitch && (<ThemeToggleButton />)}
                <FormControl
                  sx={{
                    minWidth: 250,
                    marginRight: '10px',
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: themes === 'light' ? '#556471' : '#767676', // Border color
                      },
                      '&:hover fieldset': {
                        borderColor: themes === 'light' ? '#FFFFFF' : '#767676', // Hover border color
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: themes === 'light' ? '#FFFFFF' : '#000000', // Focused border color
                      },
                      color: themes === 'light' ? '#FFFFFF' : '#000000', // Text color
                    },
                    '& .MuiInputBase-input': {
                      color: themes === 'light' ? '#FFFFFF' : '#000000', // Input text color
                      backgroundColor: `${themes === 'light' ? '#1E1F1E' : '#FFFFFF'} !important`, // Input background color
                    },
                    '& .MuiAutocomplete-endAdornment .MuiSvgIcon-root': {
                      color: themes === 'light' ? '#556471' : '#000000', // Dropdown icon color
                      '&:hover': {
                        color: themes === 'light' ? '#FFFFFF' : '#FF0000', // Hover color for the dropdown icon
                      },
                    },
                  }}
                />
                <FormControl sx={{ minWidth: 250, marginRight: '10px' }}>

                  <Autocomplete
                    placeholder="Search & Select Site"
                    size="small"
                    value={selectedDefaultOption}
                    onChange={switchCompany}
                    disableClearable
                    getOptionDisabled={(option) => option.id === selectedDefaultOption.id}
                    options={allowedCompanyList}
                    getOptionLabel={(option) => (option.label ? option.label : '')}
                    getOptionSelected={(option, value) => option.id === value.id}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        placeholder="Search & Select Site"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: `${themes === 'light' ? '#1E1F1E' : '#FFFFFF'} !important`, // Input background color
                            color: themes === 'light' ? '#FFFFFF' : '#000000', // Text color
                          },
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: themes === 'light' ? '#FFFFFF' : '#767676',
                          },
                          '& .MuiInputBase-input': {
                            color: themes === 'light' ? '#FFFFFF' : '#000000',
                          },
                        }}
                      />
                    )}
                    PaperComponent={({ children }) => (
                      <div
                        style={{
                          backgroundColor: themes === 'light' ? '#3F3D3C' : '#FFFFFF', // Dropdown background color
                          color: themes === 'light' ? '#FFFFFF' : '#000000', // Dropdown text color
                        }}
                      >
                        {children}
                      </div>
                    )}
                  />
                </FormControl>               
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton
                    onClick={openNotificationsPopover}
                    id="announcements"
                  >
                    <Badge
                      badgeContent={latestNotificationLength.length+notificationCountDR}
                      color="error"
                      sx={{
                        '& .MuiBadge-badge': {
                          fontSize: 10,
                          minWidth: 18, 
                          height: 18, 
                          top: 5,
                          right: 3,
                        },
                      }}
                    >
                      <IoMdNotificationsOutline
                        color={AddThemeColor({}).color}
                        size={26}
                      />
                    </Badge>

                  </IconButton>
                  <Popper
                    open={Boolean(anchorEl)}
                    anchorEl={anchorEl}
                    placement="bottom-start"
                    disablePortal
                    modifiers={[
                      {
                        name: 'offset',
                        options: {
                          offset: [110, 5],
                        },
                      },
                    ]}
                  >
                    <ClickAwayListener onClickAway={handleClose}>
                      <Paper elevation={3} sx={{ width: 500, borderRadius: 2 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between', // Space between heading and close button
                            alignItems: 'center',
                            p: 1,
                            bgcolor: '#f5f5f5',
                            borderBottom: '1px solid #ddd',
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <IoMdNotificationsOutline size={22} style={{ color: '#333' }} />
                            <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: 17 }}>
                              Notifications
                            </Typography>
                          </Box>
                          <IconButton size="small" onClick={handleClose}>
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </Box>
                        <HeaderSegments />
                      </Paper>
                    </ClickAwayListener>
                  </Popper>
                  <Modal size="lg" isOpen={modalAlarms} className="border-radius-50px modal-dialog-centered">
                    <ModalBody className="pt-0">
                      {popoverInfo && Object.keys(popoverInfo).length > 0 && (
                      <>
                        <ModalHeaderComponent title={popoverInfo.name} imagePath={getIcon(popoverInfo.priority)} response={announcementInfo} closeModalWindow={() => { setModalAlarms(false); }} />
                        <Row className="ml-3 mr-3" />
                        <Row className="ml-3 mr-3">
                          <Col sm="12" md="12" lg="9" xs="12">
                            <small className="text-blue">{popoverInfo.publisher}</small>
                            {' '}
                            <small>on</small>
                            <br />
                            <small>{getLocalDateCustom(popoverInfo.commences_on, 'DD MMM YYYY')}</small>
                            {' '}
                            <small>{getLocalTimeOnly(popoverInfo.commences_on)}</small>
                          </Col>
                          {popoverInfo.viewed_on
                            ? (
                              <Col sm="12" md="12" lg="3" xs="12">
                                <span className="float-right">
                                  <small className="text-green">You Viewed</small>
                                  {' '}
                                  <small>on</small>
                                  <br />
                                  <small>{getLocalDateCustom(popoverInfo.viewed_on, 'DD MMM YYYY')}</small>
                                  {' '}
                                  <small>{getLocalTimeOnly(popoverInfo.viewed_on)}</small>
                                </span>
                              </Col>
                            ) : ''}
                        </Row>
                        <hr className="ml-3 mr-3" />
                        <Row className="ml-3 mr-3">
                          <Col sm="12" md="12" lg="12" xs="12">
                            <span className="content font-weight-400" dangerouslySetInnerHTML={{ __html: popoverInfo.description }} />
                          </Col>
                        </Row>
                        <hr className="ml-3 mr-3" />
                        {viewerInfo && viewerInfo.err && viewerInfo.err.data
                                            && viewerInfo.err.data.error && viewerInfo.err.data.error.message ? (
                                              <div className="text-danger text-center p-3">
                                                {viewerInfo.err.data.error.message}
                                                <div className="text-right mt-4 mr-4">
                                                  <Button className="pr-3 pl-3" size="sm" onClick={() => { saveViewersModel(); }}>Cancel</Button>
                                                </div>
                                              </div>
                          ) : (
                            <div className="text-right mt-4 mr-4">
                              <Button className="pr-3 pl-3" size="sm" onClick={() => { saveViewersData(popoverInfo); }}>Ok</Button>
                            </div>
                          )}
                      </>
                      )}
                    </ModalBody>
                  </Modal>
                  <Modal size="md" className="border-radius-50px" isOpen={addMarkAsReadModal}>
                    <ModalHeaderComponent title="Notifications" imagePath={false} response={announcementInfo} closeModalWindow={() => { closeMarkAsReadModel(false); }} />
                    <ModalBody className="mt-0 pt-0">
                      <div className="text-center">
                        Are you sure you want to mark as all read
                      </div>
                      <hr className="ml-3 mr-3" />
                      {viewerInfo && viewerInfo.err && viewerInfo.err.data
                                        && viewerInfo.err.data.error && viewerInfo.err.data.error.message ? (
                                          <div className="text-danger text-center p-3">
                                            {viewerInfo.err.data.error.message}
                                            <div className="text-center mt-4">
                                              <Button className="pr-3 pl-3" size="sm" onClick={() => { closeMarkAsReadModel(); }}>Cancel</Button>
                                            </div>
                                          </div>
                        ) : (
                          <div className="text-right mt-4">
                            <Button className="pr-3 pl-3" size="sm" onClick={() => { markAllRead(announcementsInfo); }}>Ok</Button>
                          </div>
                        )}
                    </ModalBody>
                  </Modal>
                </div>
                {/* <MuiTooltip title={<Typography>Settings</Typography>}>
                  <IconButton
                    onClick={() => history.push({ pathname: "/settings" })}
                  >
                    <FiSettings color="#000000" size={20} />
                  </IconButton>
                </MuiTooltip> */}
                {HeaderProfileComponent}
                {switchCompanyConfirmationModal}
              </div>
            )}
          </header>

          {isHeaderVisible && headerData?.moduleName && (
            <>
              <Divider />
              <header
                className="header-box2"
                id="mainHeader2"
              >
                <div className="header-drop-icon-box w-100">
                  <div className="header-drop-icon-box-search">
                    <h1
                      className="header-text2"
                      aria-hidden
                      style={AddThemeColor({})}
                    >
                      {headerPath || getModuleDisplayName(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], headerData?.moduleName, 'display') !== '' ? getModuleDisplayName(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], headerData?.moduleName, 'display') : headerData?.moduleName}
                    </h1>
                  </div>
                  <Box
                    sx={{
                      width: '80%',
                    }}
                  >
                    {TagsComponent ? (
                      <TagsComponent />
                    ) : (
                      <Tabs
                        value={value}
                        onChange={handleChange}
                        variant="scrollable"
                        scrollButtons={headerData && headerData.headerTabs && headerData.headerTabs.length > 5 ? 'auto' : false}
                        className={`${themes === 'light' ? 'light-mode' : ''}`}
                      >
                        {(headerTabs || headerData?.headerTabs)?.map((eachItem, index) => (
                          <Tab
                            key={index}
                            label={eachItem.displayName || eachItem.name}
                            onClick={
            headerData?.onClickNavLink
              ? () => headerData?.onClickNavLink(eachItem, index)
              : () => history.push(`${eachItem?.link}#${eachItem?.module?.id}`)
          }
                            className={`${themes === 'light' ? 'light-mode' : ''}`}
                            // sx={{
                            //   '&.Mui-selected': {
                            //     color: themes === 'light' ? '#FFFFFF' : '#28a745', // White for selected in light mode, Green for selected in dark mode
                            //   },
                            //   '&:not(.Mui-selected)': {
                            //     color: themes === 'light' ? '#808080' : 'black', // Gray for unselected in light mode, White for unselected in dark mode
                            //   },
                            // }}
                          />
                        ))}
                      </Tabs>
                    )}
                  </Box>
                  {globalSearchEnable && (
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                    <InsightsGlobalSearch headerData={headerData} />
                  </Box>
                  )}
                </div>
              </header>
            </>
          )}
        </>
      )}
    </>
  );
};

export default Header;
