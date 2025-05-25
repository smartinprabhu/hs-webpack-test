/* eslint-disable react/jsx-no-useless-fragment */
import React, { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import DashboardComponent from '@shared/dashboardComponent';
import ErrorContent from '@shared/errorContent';
import { InsightsJson } from '../data/insightsViews';
import {
  getActiveTab, getHeaderTabs, getTabs, getDynamicTabs,
  getAllowedCompanies,
} from './appUtils';
import {
  getGatePassConfig,
} from '../gatePass/gatePassService';
import { updateHeaderData } from '../core/header/actions';

const appModels = require('./appModels').default;

const Insightsoverview = ({ module, moduleDisplay, moduleDynamicPath }) => {
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isOldDashboard, setOldDashboard] = useState(false);

  const updateHeaderItems = (module, menuName, link, tabs, activeTab) => {
    dispatch(
      updateHeaderData({
        module: moduleDisplay || module,
        moduleName: moduleDisplay || module,
        menuName,
        link,
        headerTabs: tabs?.filter((e) => e),
        activeTab,
      }),
    );
  };

  const companies = getAllowedCompanies(userInfo);

  useMemo(() => {
    if (module && module === 'Gate Pass') {
      dispatch(getGatePassConfig(companies, appModels.GATEPASSCONFIGURATION));
    }
  }, [module]);

  return (
    <>
      {InsightsJson
        && InsightsJson.map((insight) => {
          const headerTabs = getHeaderTabs(
            userRoles?.data?.allowed_modules,
            insight.moduleName,
          );
          let activeTab;
          let tabs;
          if (headerTabs[0]?.menu) {
            const tabsDef = getTabs(
              headerTabs[0].menu,
              InsightsJson.filter(
                (each) => each.moduleName === insight.moduleName,
              )[0]?.subOptions,
            );
            let moduleSubmenus = InsightsJson.filter((each) => each.moduleName === insight.moduleName);
            moduleSubmenus = moduleSubmenus && moduleSubmenus.length && moduleSubmenus[0].subOptions ? moduleSubmenus[0].subOptions : false;
            let dynamicList = headerTabs[0].menu.filter((item) => moduleSubmenus && !moduleSubmenus[item.name] && item.name !== 'Help');

            dynamicList = getDynamicTabs(dynamicList, moduleDynamicPath);
            const tabsList = [...tabsDef, ...dynamicList];
            tabs = [...new Map(tabsList.map((item) => [item.name, item])).values()];
            activeTab = getActiveTab(
              tabs.filter((e) => e),
              'Insights',
            );
          }

          return (
            module.toLowerCase() === insight.module.toLowerCase() && (
              <>
                {updateHeaderItems(
                  insight.module,
                  insight.menuName,
                  insight.link,
                  tabs?.filter((e) => e),
                  activeTab,
                )}
                <DashboardComponent
                  module={insight.module}
                  menuName={insight.menuName}
                  link={insight.link}
                  dashboardCode={insight.dashboardCode}
                  moduleName={insight.moduleName}
                  headerTabs={tabs?.filter((e) => e)}
                  activeTab={activeTab}
                  setOldDashboard={setOldDashboard}
                  isOldDashboard={isOldDashboard}
                />
                {(isOldDashboard) && (
                  <ErrorContent errorTxt="Please Contact Admin" />
                )}
              </>
            )
          );
        })}
    </>
  );
};
export default Insightsoverview;
