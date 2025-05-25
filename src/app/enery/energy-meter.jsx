import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';

import './style.css';
import {
  getSequencedMenuItems, getActiveTab, getHeaderTabs, getTabs, getDynamicTabs,
} from '../util/appUtils';
import { getAssetDetail } from '../assets/equipmentService';
import DashboardIOTView from '../apexDashboards/assetsDashboard/dashboardIOTView';
import upsNav from './navbar/navlist.json';
import { updateHeaderData } from '../core/header/actions';
import {
  resetDefaultFilterInfo,
  resetNinjaDashboard,
} from '../analytics/analytics.service';

const appModels = require('../util/appModels').default;

const EnergyMeter = () => {
  const [menu, setMenu] = useState('');
  const [code, setCode] = useState('');
  const {
    equipmentsDetails,
  } = useSelector((state) => state.equipment);

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const moduleId = userRoles?.data?.allowed_modules?.filter(
    (each) => each.name === 'Energy',
  )[0]?.id;

  const location = useLocation();
  // const id = location
  //   && location.search
  //   && location.search.split('?')
  //   && location.search.split('?')[1];
  const params = new URLSearchParams(location.search);
  const text = params.get('text');
  const id = params.get('sid');
  useEffect(() => {
    const getmenus = getSequencedMenuItems(
      userRoles && userRoles.data ? userRoles.data.allowed_modules : [],
      'Energy',
      'name',
    );
    dispatch(resetDefaultFilterInfo());
    dispatch(resetNinjaDashboard());
    let sld = '';
    if (getmenus && getmenus.length) {
      sld = getmenus.find((menu) => menu.name.toLowerCase() === 'sld');
    }
    setMenu(sld || '');
  }, [userRoles]);

  /* useEffect(() => {
    if (menu && menu.is_dashboard) {
      dispatch(resetNinjaCode());
      dispatch(getNinjaCode(menu.dashboard_code, appModels.NINJABOARD));
    }
  }, [menu]);

  useEffect(() => {
    if (menu && ninjaDashboardCode && ninjaDashboardCode.data && ninjaDashboardCode.data.length && ninjaDashboardCode.data[0].code === menu.dashboard_code) {
      setCode(ninjaDashboardCode.data[0].id);
    }
  }, [ninjaDashboardCode, menu]); */

  useEffect(() => {
    if (id) {
      dispatch(getAssetDetail(id, appModels.EQUIPMENT));
    }
  }, [id]);

  const uuid = menu && menu.uuid ? menu.uuid : '12345';

  const headerTabs = getHeaderTabs(userRoles?.data?.allowed_modules, 'Energy');
  let activeTab;
  let tabs;

  if (headerTabs) {
    const tabsDef = getTabs(headerTabs[0].menu, upsNav.data);
    let dynamicList = headerTabs[0].menu.filter((item) => !(upsNav && upsNav.data && upsNav.data[item.name]) && item.name !== 'Help');
    dynamicList = getDynamicTabs(dynamicList, '/energy-overview/dynamic-report');
    const tabsList = [...tabsDef, ...dynamicList];
    tabs = [...new Map(tabsList.map((item) => [item.name, item])).values()];
    activeTab = getActiveTab(
      tabs.filter((e) => e),
      'SLD',
    );
  }

  useEffect(() => {
    dispatch(
      updateHeaderData({
        module: 'Energy',
        moduleName: 'Energy',
        menuName: 'SLD',
        link: `/energy-sld-overview#${moduleId}`,
        headerTabs: tabs.filter((e) => e),
        activeTab,
      }),
    );
  }, [activeTab]);

  return (
    <div>
      {/* code && ninjaDashboardCode && ninjaDashboardCode.data && ninjaDashboardCode.data.length > 0 && !ninjaDashboardCode.loading && (
                    <DashboardView
                        code={ninjaDashboardCode.data[0].id}
                        defaultDate={ninjaDashboardCode.data[0].ks_date_filter_selection}
                        dashboardInterval={ninjaDashboardCode.data[0].ks_set_interval}
                        dashboardLayouts={ninjaDashboardCode.data[0].dashboard_json}
                        dashboardColors={ninjaDashboardCode.data[0].ks_dashboard_items_ids}
                        advanceFilter={id ? `[('equipment_id.id','=',${id})]` : false}
                    />
                ) */}
      {menu && (menu.dashboard_code || menu.company_dashboard_code) && (
        <DashboardIOTView
          dashboardCode={userInfo && userInfo.data && userInfo.data.main_company && userInfo.data.main_company.category && userInfo.data.main_company.category.name && userInfo.data.main_company.category.name.toLowerCase() === 'company' && menu.company_dashboard_code ? menu.company_dashboard_code : menu.dashboard_code}
          dashboardUuid={uuid}
          meterName={text}
          isSLD
          advanceFilter={id ? `[('device_id','=','${id}')]` : false}
        />
      )}
      {/* ninjaDashboardCode && ninjaDashboardCode.loading && (
                    <PageLoader type="max" />
                ) */}
    </div>
  );
};
export default EnergyMeter;
