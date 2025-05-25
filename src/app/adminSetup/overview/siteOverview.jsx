import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { updateHeaderData } from '../../core/header/actions';
import {
  getActiveTab,
  getHeaderTabs,
  getTabs,
} from '../../util/appUtils';
import {
  getCopyAllowedModule, getHelpdeskSettingDetails, getInspectionSettingDetails, getPPMSettingsDetails, getWorkpermitSettingDetails, getInventorySettingDetails, getParentSiteGroups,
  getMailRoomSettingDetails, getPantrySettingDetails, getAuditSettingDetails, getWarehousesIds, getSiteDetail, getVMSSettingDetails,
} from '../../siteOnboarding/siteService';
import {
  getSLAConfig,
} from '../../slaAudit/auditService';
import { getCompanyDetail } from '../setupService';
import AdminSideNavSite from '../navbar/navlistSite.json';
import AdminSideNavCompany from '../navbar/navlistCompany.json';
// import SiteConfiguration from '../../siteOnboarding/siteDetails/siteBasicDetails';
import SiteOverviewDashboard from '../../siteOnboarding/overview/overview';

const appModels = require('../../util/appModels').default;

const SiteOverview = () => {
  const { userRoles, userInfo } = useSelector((state) => state.user);
  const {
    siteDetails, onBoardCopyInfo,
  } = useSelector((state) => state.site);
  const dispatch = useDispatch();
  const headerTabs = getHeaderTabs(
    userRoles?.data?.allowed_modules,
    'Admin Setup',
  );

  let activeTab;
  let tabs;

  if (headerTabs) {
    tabs = getTabs(headerTabs[0].menu, userInfo && userInfo.data && userInfo.data.is_parent ? AdminSideNavCompany.data : AdminSideNavSite.data);
    activeTab = getActiveTab(
      tabs.filter((e) => e),
      'Overview',
    );
  }

  useEffect(() => {
    if (userInfo) {
      dispatch(getSiteDetail(userInfo.data.company.id, appModels.COMPANY));
    }
  }, [userInfo]);

  useEffect(() => {
    dispatch(
      updateHeaderData({
        module: 'Admin Setup',
        moduleName: 'Admin Setup',
        menuName: 'Overview',
        link: '/setup-overview',
        headerTabs: tabs.filter((e) => e),
        activeTab,
      }),
    );
  }, [activeTab]);

 /* const isCompany = userInfo && userInfo.data && userInfo.data.is_parent;

  useEffect(() => {
    if (userInfo && userInfo.data) {
      dispatch(getCompanyDetail(userInfo.data.company.id, appModels.COMPANY));
      dispatch(getParentSiteGroups(userInfo.data.company.id, appModels.COMPANY));
      dispatch(getWarehousesIds(userInfo.data.company.id, appModels.WAREHOUSE));
      dispatch(getHelpdeskSettingDetails(userInfo.data.company.id, appModels.MAINTENANCECONFIG));
      dispatch(getCopyAllowedModule(userInfo.data.company.id, appModels.ONBOARDCOPYMODULE));
      dispatch(getWorkpermitSettingDetails(userInfo.data.company.id, appModels.WPCONFIGURATION));
      dispatch(getInspectionSettingDetails(userInfo.data.company.id, appModels.INSPECTIONCONFIG));
      dispatch(getInventorySettingDetails(userInfo.data.company.id, appModels.INVENTORYCONFIG));
      dispatch(getPPMSettingsDetails(userInfo.data.company.id, appModels.PPMWEEKCONFIG));
      dispatch(getMailRoomSettingDetails(userInfo.data.company.id, appModels.MAILROOMCONFIG));
      dispatch(getVMSSettingDetails(userInfo.data.company.id, appModels.VMSCONFIGURATION));
      dispatch(getPantrySettingDetails(userInfo.data.company.id, appModels.PANTRYCONFIG));
      dispatch(getAuditSettingDetails(userInfo.data.company.id, appModels.AUDITCONFIG));
      dispatch(getSLAConfig(userInfo.data.company.id, appModels.SLAAUDITCONFIG));
    }
  }, [userInfo]); */

  return (
    <SiteOverviewDashboard />
  );
};

export default SiteOverview;
