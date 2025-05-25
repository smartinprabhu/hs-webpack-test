/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Loader from '@shared/loading';
import ErrorContent from './errorContent';
import { getSequencedMenuItems } from '../util/appUtils';
import DashboardView from '../apexDashboards/assetsDashboard/dashboardView';

import {
  getNinjaCode, resetNinjaCode, resetDefaultFilterInfo, resetNinjaDashboard,
} from '../analytics/analytics.service';
import DashboardIOTView from '../apexDashboards/assetsDashboard/dashboardIOTView';

const appModels = require('../util/appModels').default;

const DashboardComponent = ({
  module,
  menuName,
  moduleName,
  setOldDashboard,
  isOldDashboard,
  dashboardCode,
}) => {
  const [menu, setMenu] = useState('');
  const [code, setCode] = useState('');
  const [code16, setCode16] = useState(false);

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const { pinEnableData } = useSelector((state) => state.auth);
  const { ninjaDashboardCode } = useSelector((state) => state.analytics);

  const [isShow, setIsShow] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const getmenus = getSequencedMenuItems(
      userRoles && userRoles.data ? userRoles.data.allowed_modules : [],
      moduleName,
      'name',
    );
    let insights = '';
    if (getmenus && getmenus.length) {
      insights = getmenus.find(
        (menu) => menu.name.toLowerCase() === menuName.toLowerCase(),
      );
    }
    setMenu(insights || '');
  }, [menuName, module]);

  useEffect(() => {
    if (menu && menu.is_dashboard && !menu.is_dashboard_v16) {
      dispatch(resetNinjaCode());
      if (userInfo && userInfo.data && userInfo.data.main_company.category && userInfo.data.main_company.category.name && userInfo.data.main_company.category.name.toLowerCase() === 'company' && menu.company_dashboard_code) {
        dispatch(getNinjaCode(menu.company_dashboard_code, appModels.NINJABOARD));
        setIsShow(true);
        setCode16(false);
      } else if (userInfo && userInfo.data && userInfo.data.main_company.category && userInfo.data.main_company.category.name && userInfo.data.main_company.category.name.toLowerCase() === 'site' && menu.dashboard_code) {
        dispatch(getNinjaCode(menu.dashboard_code, appModels.NINJABOARD));
        setIsShow(true);
        setCode16(false);
      } else {
        dispatch(getNinjaCode(menu.dashboard_code, appModels.NINJABOARD));
        setIsShow(true);
        setCode16(false);
      }
    } else if (menu && menu.is_dashboard_v16 && !menu.is_dashboard) {
      dispatch(resetDefaultFilterInfo());
      dispatch(resetNinjaDashboard());
      if (userInfo && userInfo.data && userInfo.data.main_company.category && userInfo.data.main_company.category.name) {
        if (userInfo.data.main_company.category.name.toLowerCase() === 'company' && menu.company_dashboard_code) {
          setCode16(menu.company_dashboard_code);
        } else if (userInfo.data.main_company.category.name.toLowerCase() === 'site' && menu.dashboard_code) {
          setCode16(menu.dashboard_code);
        } else {
          setCode16(menu.dashboard_code);
        }
      } else {
        setCode16(menu.dashboard_code);
      }
    } else if (menu && !menu.is_dashboard && !menu.is_dashboard_v16) {
      if (setOldDashboard) { setOldDashboard(true); }
    }
  }, [menu]);

  const uuid = menu && menu.uuid ? menu.uuid : '12345';
  const isOdoo16 = menu.is_dashboard_v16;

  useEffect(() => {
    if (menu && !menu.is_dashboard_v16 && ninjaDashboardCode && ninjaDashboardCode.data && ninjaDashboardCode.data.length) {
      const compareCode = userInfo && userInfo.data && userInfo.data.main_company.category && userInfo.data.main_company.category.name && userInfo.data.main_company.category.name.toLowerCase() === 'company' ? menu.company_dashboard_code : menu.dashboard_code;
      if (menu.is_dashboard && ninjaDashboardCode.data[0].code === `${compareCode}V3`) {
        setCode(ninjaDashboardCode.data[0].id);
      }
    }
  }, [ninjaDashboardCode, menu]);

  return (
    <div>
      {menu && menu.is_dashboard && !isOdoo16 && !isOldDashboard ? (
        <>
          {isShow
            && code
            && menu
            && ninjaDashboardCode
            && ninjaDashboardCode.data
            && ninjaDashboardCode.data.length > 0 && (
              <DashboardView
                code={code}
                moduleCode={dashboardCode}
                defaultDate={
                  ninjaDashboardCode.data[0].ks_date_filter_selection
                }
                dashboardInterval={ninjaDashboardCode.data[0].ks_set_interval}
                dashboardLayouts={ninjaDashboardCode.data[0].dashboard_json}
                dashboardColors={
                  ninjaDashboardCode.data[0].ks_dashboard_items_ids
                }
                moduleName={moduleName}
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
          {menu && menu.dashboard_code && isOdoo16 && code16 && !isOldDashboard && (
            <DashboardIOTView
              dashboardCode={code16}
              dashboardUuid={uuid}
              defaultFilter={menu.logo_url}
              moduleName={moduleName}
            />
          )}
        </>
      )}
    </div>
  );
};

export default DashboardComponent;
