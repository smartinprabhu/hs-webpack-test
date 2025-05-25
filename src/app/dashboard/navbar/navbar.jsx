/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import * as PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';

import Loader from '@shared/loading';
import {
  getSequencedMenuItems,
  getModuleDisplayName,
} from '../../util/appUtils';
import {
  resetNinjaCode,
  resetDefaultFilterInfo,
  resetNinjaDashboard,
  getNinjaCode,
} from '../../analytics/analytics.service';
import Header from '../../core/header/header';

import ErrorContent from '../../shared/errorContent';
import DashboardView from '../../apexDashboards/assetsDashboard/dashboardView';
import DashboardIOTView from '../../apexDashboards/assetsDashboard/dashboardIOTView';
import TreeDashboard from '../../treeDashboards/dashboard';
import DcDashboards from '../../dcDashboards/dashboard';
import { updateHeaderData } from '../../core/header/actions';

const appModels = require('../../util/appModels').default;

const Navbar = (props) => {
  const {
    setCurrentDashboard, setActive, currentTab, currentDashboard,
  } = props;
  const dispatch = useDispatch();
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const menus = getSequencedMenuItems(
    userRoles && userRoles.data ? userRoles.data.allowed_modules : [],
    'Dashboards',
    'name',
  );
  const title = getModuleDisplayName(
    userRoles && userRoles.data ? userRoles.data.allowed_modules : [],
    'Home',
    'display',
  );

  const onClickNavLink = (menu, index) => {
    setCurrentDashboard(menu);
    setActive(index);
    sessionStorage.setItem('homeActiveItem', index);
    sessionStorage.setItem('homeActiveDashboard', JSON.stringify(menu));
  };

  const [menu, setMenu] = useState('');
  const [code, setCode] = useState('');
  const [v16Code, setV16Code] = useState('');
  const [v12Code, setV12Code] = useState('');
  const { ninjaDashboardCode } = useSelector((state) => state.analytics);

  const [isShow, setIsShow] = useState(false);
  useEffect(() => {
    const getmenus = getSequencedMenuItems(
      userRoles && userRoles.data ? userRoles.data.allowed_modules : [],
      'Dashboards',
      'name',
    );
    let insights = '';
    if (
      getmenus
      && getmenus.length
      && currentDashboard
      && currentDashboard.name
    ) {
      insights = getmenus.find(
        (menu) => menu.name.toLowerCase() === currentDashboard.name.toLowerCase(),
      );
    }
    setCode(false);
    setV16Code(false);
    setMenu(insights || '');
  }, [currentDashboard, currentTab]);

  useEffect(() => {
    if (menu && menu.is_dashboard && !menu.is_dashboard_v16 && !menu.is_dashboard_tree && !menu.is_analytic_dashboard) {
      setV12Code(false);
      dispatch(resetNinjaCode());
      if (userInfo && userInfo.data && userInfo.data.main_company.category && userInfo.data.main_company.category.name) {
        if (userInfo.data.main_company.category.name.toLowerCase() === 'company' && menu.company_dashboard_code) {
          dispatch(getNinjaCode(menu.company_dashboard_code, appModels.NINJABOARD));
          setIsShow(true);
          setCode(false);
          setV16Code(false);
          setV12Code(menu.company_dashboard_code);
        } else if (userInfo.data.main_company.category.name.toLowerCase() === 'site' && menu.dashboard_code) {
          dispatch(getNinjaCode(menu.dashboard_code, appModels.NINJABOARD));
          setIsShow(true);
          setCode(false);
          setV16Code(false);
          setV12Code(menu.dashboard_code);
        }
      } else {
        dispatch(getNinjaCode(menu.dashboard_code, appModels.NINJABOARD));
        setIsShow(true);
        setCode(false);
        setV16Code(false);
        setV12Code(menu.dashboard_code);
      }
    } else if (menu && (menu.is_dashboard_v16 || menu.is_dashboard_tree)) {
      dispatch(resetNinjaCode());
      dispatch(resetDefaultFilterInfo());
      dispatch(resetNinjaDashboard());
      setIsShow(false);
      setCode(false);
      setV12Code(false);
    }
  }, [menu]);

  const uuid = menu && menu.uuid ? menu.uuid : '12345';
  const isOdoo16 = menu.is_dashboard_v16 && !menu.is_dashboard_tree && !menu.is_analytic_dashboard;

  useEffect(() => {
    if (menu && !menu.is_dashboard_v16 && !menu.is_dashboard_tree && !menu.is_analytic_dashboard && ninjaDashboardCode && ninjaDashboardCode.data && ninjaDashboardCode.data.length) {
      const compareCode = userInfo && userInfo.data && userInfo.data.main_company.category && userInfo.data.main_company.category.name && userInfo.data.main_company.category.name.toLowerCase() === 'company' ? menu.company_dashboard_code : menu.dashboard_code;
      if (menu.is_dashboard && ninjaDashboardCode.data[0].code === `${compareCode}V3`) {
        setCode(ninjaDashboardCode.data[0].id);
        setV16Code(false);
      }
    }
  }, [ninjaDashboardCode]);

  useEffect(() => {
    if (menu && menu.is_dashboard_v16 && !menu.is_dashboard_tree && !menu.is_analytic_dashboard) {
      dispatch(resetDefaultFilterInfo());
      dispatch(resetNinjaDashboard());
      if (userInfo && userInfo.data && userInfo.data.main_company.category && userInfo.data.main_company.category.name) {
        if (userInfo.data.main_company.category.name.toLowerCase() === 'company' && menu.company_dashboard_code) {
          setV16Code(menu.company_dashboard_code);
        } else if (userInfo.data.main_company.category.name.toLowerCase() === 'site' && menu.dashboard_code) {
          setV16Code(menu.dashboard_code);
        }
      } else {
        setV16Code(menu.dashboard_code);
      }
    }
  }, [menu, currentDashboard, currentTab]);

  useEffect(() => {
    dispatch(
      updateHeaderData({
        module: 'Dashboards',
        moduleName: 'Home',
        menuName: 'Home',
        link: '/',
        headerTabs: menus || [],
        activeTab: parseInt(currentTab),
        onClickNavLink,
      }),
    );
  }, [currentTab]);

  return (
    <>
      {!isOdoo16 && !isShow && !menu.is_dashboard_tree && !menu.is_analytic_dashboard && <ErrorContent errorTxt="Please Contact Admin" showRetry />}
      {!menu.is_dashboard_tree && !menu.is_analytic_dashboard && (
        <>
          {!isOdoo16 ? (
            <>
              {isShow
            && code
            && menu
            && ninjaDashboardCode
            && ninjaDashboardCode.data
            && ninjaDashboardCode.data.length > 0 && (
              <DashboardView
                code={code}
                moduleCode={v12Code}
                defaultDate={
                  ninjaDashboardCode.data[0].ks_date_filter_selection
                }
                dashboardInterval={ninjaDashboardCode.data[0].ks_set_interval}
                dashboardLayouts={ninjaDashboardCode.data[0].dashboard_json}
                dashboardColors={
                  ninjaDashboardCode.data[0].ks_dashboard_items_ids
                }
              />
              )}
              {ninjaDashboardCode && ninjaDashboardCode.loading && (
              <div className="margin-top-250px">
                <Loader />
              </div>
              )}
              {ninjaDashboardCode
            && ((ninjaDashboardCode.data
              && ninjaDashboardCode.data.length === 0)
              || ninjaDashboardCode.err) && (
              <ErrorContent errorTxt="No Data Found" showRetry />
              )}
            </>
          ) : (
            <>
              {menu && v16Code && (
              <DashboardIOTView
                dashboardCode={v16Code}
                dashboardUuid={uuid}
                defaultFilter={menu.logo_url}
              />
              )}
            </>
          )}
        </>
      )}
      {menu.is_dashboard_tree && !menu.is_analytic_dashboard && (
      <TreeDashboard
        dashboardUuid={uuid}
      />
      )}
      {menu.is_analytic_dashboard && (
      <DcDashboards
        uuid={menu.uuid}
        dashboardCode={menu.dashboard_code}
      />
      )}
    </>
  );
};

Navbar.propTypes = {
  id: PropTypes.string.isRequired,
};

export default Navbar;
