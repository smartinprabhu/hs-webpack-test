import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getEquipmentFilters } from '../assets/equipmentService';
import { updateHeaderData } from '../core/header/actions';
import {
  getActiveTab,
  getHeaderTabs,
  getTabs,
} from '../util/appUtils';
import CompanySegments from './companyConfiguration/companySegments';
import AdminSideNavCompany from './navbar/navlistCompany.json';
import AdminSideNavSite from './navbar/navlistSite.json';
import SiteSegments from './siteConfiguration/siteSegments';

const CompanySetup = () => {
  const { userRoles, userInfo } = useSelector((state) => state.user);
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
      'Facility',
    );
  }

  useEffect(() => {
    dispatch(
      updateHeaderData({
        module: 'Admin Setup',
        moduleName: 'Admin Setup',
        menuName: 'Facility',
        link: '/setup-facility',
        headerTabs: tabs.filter((e) => e),
        activeTab,
        dispatchFunc: () => getEquipmentFilters([]),
      }),
    );
  }, [activeTab]);

  return (
    <>
      {userInfo && userInfo.data && userInfo.data.is_parent && (
        <CompanySegments />
      )}
      {
        userInfo && userInfo.data && !userInfo.data.is_parent && (
          <SiteSegments />
        )
      }
    </>
  );
};

export default CompanySetup;
