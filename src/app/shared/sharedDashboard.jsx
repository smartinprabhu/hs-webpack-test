/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Spin } from 'antd';

import ErrorContent from '@shared/errorContent';

import { getNinjaCode, resetNinjaCode, resetDefaultFilterInfo, resetNinjaDashboard } from '../analytics/analytics.service';
import DashboardView from '../apexDashboards/assetsDashboard/dashboardView';
import DashboardIOTView from '../apexDashboards/assetsDashboard/dashboardIOTView';
import {
  getSequencedMenuItems, generateErrorMessage,
} from '../util/appUtils';
import TreeDashboard from '../treeDashboards/dashboard';

const appModels = require('../util/appModels').default;

const SharedDashboard = ({
  menuName, moduleName, setOldDashboard, isOldDashboard, advanceFilter, isHomeDashboards,
}) => {
  const [menu, setMenu] = useState('');
  const [code, setCode] = useState('');
  const [isShow, setIsShow] = useState(false);
  const [code16, setCode16] = useState(false);
  const [code12, setCode12] = useState(false);

  const { ninjaDashboardCode } = useSelector((state) => state.analytics);
  const { userInfo, userRoles } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    if (menuName) {
      setCode(false);
    }
  }, [menuName]);

  useEffect(() => {
    const getmenus = getSequencedMenuItems(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], moduleName, 'name');
    let insights = '';
    if (getmenus && getmenus.length) {
      insights = getmenus.find((menu) => menu.name.toLowerCase() === menuName.toLowerCase());
    }
    setCode(false);
    setCode16(false);
    setMenu(insights || '');
  }, [menuName, moduleName]);

  useEffect(() => {
    if (menu && menu.is_dashboard && !menu.is_dashboard_v16 && !menu.is_analytic_dashboard && userInfo && userInfo.data && userInfo.data.main_company.category && userInfo.data.main_company.category.name) {
      setCode12(false);
      dispatch(resetNinjaCode());
      if (userInfo.data.main_company.category.name.toLowerCase() === 'company' && menu.company_dashboard_code) {
        dispatch(getNinjaCode(menu.company_dashboard_code, appModels.NINJABOARD));
        setIsShow(true);
        setCode12(menu.company_dashboard_code);
      } else if (userInfo.data.main_company.category.name.toLowerCase() === 'site' && menu.dashboard_code) {
        dispatch(getNinjaCode(menu.dashboard_code, appModels.NINJABOARD));
        setIsShow(true);
        setCode12(menu.dashboard_code);
      } else {
        dispatch(getNinjaCode(menu.dashboard_code, appModels.NINJABOARD));
        setIsShow(true);
        setCode12(menu.dashboard_code);
      }
    } else if (menu && menu.is_dashboard_v16 && !menu.is_dashboard && !menu.is_analytic_dashboard) {
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
      setCode12(false);
      dispatch(resetNinjaCode());
    } else if (menu && !menu.is_dashboard && !menu.is_dashboard_v16 && !menu.is_analytic_dashboard && !isHomeDashboards) {
      setOldDashboard(true);
    }
  }, [menu]);

  useEffect(() => {
    if (menu && !menu.is_dashboard_v16 && !menu.is_dashboard_tree && !menu.is_analytic_dashboard && ninjaDashboardCode && ninjaDashboardCode.data && ninjaDashboardCode.data.length) {
      const compareCode = userInfo && userInfo.data && userInfo.data.main_company.category && userInfo.data.main_company.category.name && userInfo.data.main_company.category.name.toLowerCase() === 'company' ? menu.company_dashboard_code : menu.dashboard_code;
      if (menu.is_dashboard && ninjaDashboardCode.data[0].code === `${compareCode}V3`) {
        setCode(ninjaDashboardCode.data[0].id);
        setCode16(false);
      }
    }
  }, [ninjaDashboardCode]);

  const uuid = menu && menu.uuid ? menu.uuid : '12345';
  const isOdoo16 = menu.is_dashboard_v16 && !menu.is_dashboard_tree && !menu.is_analytic_dashboard;


  return (
    <div>
      {!isOdoo16 && !isShow && !menu.is_dashboard_tree && !menu.is_analytic_dashboard && <ErrorContent errorTxt="Please Contact Admin" showRetry />}
      {!menu.is_dashboard_tree && !menu.is_analytic_dashboard && (
        <>
          {!isOdoo16 && (!isOldDashboard) ? (
            <>
              {isShow && code && menu && ninjaDashboardCode && ninjaDashboardCode.data && ninjaDashboardCode.data.length > 0 && (
              <DashboardView
                code={code}
                moduleCode={code12}
                defaultDate={ninjaDashboardCode.data[0].ks_date_filter_selection}
                dashboardInterval={ninjaDashboardCode.data[0].ks_set_interval}
                dashboardLayouts={ninjaDashboardCode.data[0].dashboard_json}
                dashboardColors={ninjaDashboardCode.data[0].ks_dashboard_items_ids}
                advanceFilter={advanceFilter}
              />
              )}
              {isShow && (ninjaDashboardCode && ((ninjaDashboardCode.data && ninjaDashboardCode.data.length === 0) || ninjaDashboardCode.err)) && (
              <ErrorContent errorTxt={ninjaDashboardCode.err ? generateErrorMessage(ninjaDashboardCode) : 'No Data Found'} />
              )}
              {(isShow && ninjaDashboardCode && ninjaDashboardCode.loading) && (
              <div className="text-center mt-2 mb-2">
                <Spin />
              </div>
              )}
              {(!isShow || (isHomeDashboards && menu && !menu.is_dashboard)) && ninjaDashboardCode && ninjaDashboardCode.loading && (
              <ErrorContent errorTxt="Please Contact Admin" />
              )}
            </>
          ) : ''}
          {menu && isOdoo16 && code16 && (
          <DashboardIOTView
            dashboardCode={`${code16}`}
            dashboardUuid={uuid}
            defaultFilter={menu.logo_url}
          />
          )}
        </>
      )}
      {menu.is_dashboard_tree && !menu.is_analytic_dashboard && (
      <TreeDashboard
        dashboardUuid={uuid}
      />
      )}
    </div>
  );
};

export default SharedDashboard;
