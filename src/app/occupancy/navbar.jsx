/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import * as PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';

import PageLoader from '@shared/pageLoader';
import { getSequencedMenuItems, getModuleDisplayName } from '../util/appUtils';
import { resetNinjaCode, getNinjaCode, resetDefaultFilterInfo, resetNinjaDashboard } from '../analytics/analytics.service';
import Header from '../core/header/header';

import ErrorContent from '../shared/errorContent';
import DashboardView from '../apexDashboards/assetsDashboard/dashboardView';
import DashboardIOTView from '../apexDashboards/assetsDashboard/dashboardIOTView';
import { updateHeaderData } from '../core/header/actions';

const appModels = require('../util/appModels').default;

const Navbar = (props) => {
  const {
    setCurrentDashboard, setActive, currentTab, currentDashboard,
  } = props;
  const dispatch = useDispatch();
  const { userRoles } = useSelector((state) => state.user);
  const menus = getSequencedMenuItems(
    userRoles && userRoles.data ? userRoles.data.allowed_modules : [],
    'Occupancy',
    'name',
  );
  const title = getModuleDisplayName(
    userRoles && userRoles.data ? userRoles.data.allowed_modules : [],
    'Occupancy',
    'display',
  );

  const onClickNavLink = (menu, index) => {
    setCurrentDashboard(menu);
    setActive(index);
  };

  const [menu, setMenu] = useState('');
  const [code, setCode] = useState('');
  const { ninjaDashboardCode } = useSelector((state) => state.analytics);

  const [isShow, setIsShow] = useState(false);  

  useEffect(() => {
    dispatch(resetNinjaCode());
    dispatch(resetDefaultFilterInfo());
    dispatch(resetNinjaDashboard());
    const getmenus = getSequencedMenuItems(
      userRoles && userRoles.data ? userRoles.data.allowed_modules : [],
      'Occupancy',
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
    setMenu(insights || '');
  }, [currentDashboard]);

  useEffect(() => {
    if (menu && menu.is_dashboard && !menu.is_dashboard_v16) {
      dispatch(resetNinjaCode());
      dispatch(getNinjaCode(menu.dashboard_code, appModels.NINJABOARD));
      setIsShow(true);
    } else if (menu && !menu.is_dashboard && menu.is_dashboard_v16) {
      dispatch(resetDefaultFilterInfo());
      dispatch(resetNinjaDashboard());
    }
  }, [menu]);

  useEffect(() => {
    if (
      menu
      && !menu.is_dashboard_v16
      && ninjaDashboardCode
      && ninjaDashboardCode.data
      && ninjaDashboardCode.data.length
    ) {
      if (
        menu.is_dashboard
        && ninjaDashboardCode.data[0].code === `${menu.dashboard_code}V3`
      ) {
        setCode(ninjaDashboardCode.data[0].id);
      }
    }
  }, [ninjaDashboardCode, menu]);

  const uuid = menu && menu.uuid ? menu.uuid : '12345';
  const isOdoo16 = menu.is_dashboard_v16;

  useEffect(() => {
    dispatch(
      updateHeaderData({
        module: 'Occupancy',
        moduleName: 'Occupancy',
        menuName: currentDashboard.name,
        link: '/',
        headerTabs: menus || [],
        activeTab: parseInt(currentTab),
        onClickNavLink,
      }),
    );
  }, [currentTab]);

  return (
    <>
      {/* <Header
        headerPath="Occupancy"
        nextPath={currentDashboard.name}
        pathLink="/"
        TagsComponent={() => (
          <Tabs value={currentTab}>
            {menus
              ? menus?.map((eachItem, index) => (
                  <Tab
                    sx={{
                      textTransform: "capitalize",
                      fontFamily: "Suisse Intl",
                      fontWeight: "600",
                      fontSize: "15px",
                    }}
                    label={eachItem?.name}
                    onClick={() => onClickNavLink(eachItem, index)}
                  />
                ))
              : null}
          </Tabs>
        )}
      /> */}
      {!isOdoo16 && !isShow && <ErrorContent errorTxt="Please Contact Admin" />}
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
            <PageLoader type="max" />
          )}
          {ninjaDashboardCode
            && ((ninjaDashboardCode.data
              && ninjaDashboardCode.data.length === 0)
              || ninjaDashboardCode.err) && (
              <ErrorContent errorTxt="No Data Found" />
          )}
        </>
      ) : (
        <>
          {isOdoo16 && menu && menu.dashboard_code && (
            <DashboardIOTView
              dashboardCode={menu.dashboard_code}
              dashboardUuid={uuid}
              defaultFilter={menu.logo_url}
            />
          )}
        </>
      )}
    </>
  );
};

Navbar.propTypes = {
  id: PropTypes.string.isRequired,
};

export default Navbar;
