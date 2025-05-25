import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, Link } from 'react-router-dom'; // Import useLocation for pathname

import {
  Box, Tab, Tabs,
} from '@mui/material';

import { getTransferFilters } from '../purchase/purchaseService';
import { useTheme } from '../ThemeContext';

import {
  getMenuItems,
  getHeaderTabs,
  getTabs,
  getActiveTab,
  getSequencedMenuItems,
} from '../util/appUtils';

import inventoryNav from './navlist.json';
import { updateHeaderData } from '../core/header/actions';
import { resetTreeDashboard } from '../analytics/analytics.service';
import SldOverView from './Sld/SldOverview';
import Energy from './Energy/Energy';
import { ApiDataProvider } from './Energy/ApiDataContext';
import Sld from './waste/sld';
import Waste from './waste/waste';
import Water from './Water/water';
import Emissions from './Emissions/Emmision';

import TreeDashboard from '../treeDashboards/dashboard';

const OperationsSegments = () => {
  const { themes } = useTheme();
  const [currentTab, setCurrentTab] = useState('ENERGY'); // Default to WATER for Water SLD
  // Removed unused state variables
  const [menu, setMenu] = useState('');

  const menuList = [
    'ENERGY',
    'WATER',
    'WASTE',
    'EMISSIONS',
  ];

  const { userRoles } = useSelector((state) => state.user);

  const [value, setValue] = useState(0); // Default to WATER tab index (1, since ENERGY is 0)

  const dispatch = useDispatch();
  const location = useLocation(); // Get current pathname

  useEffect(() => {
    let tab = 'ENERGY'; // Default
    let tabIndex = 0;

    switch (location.pathname) {
      case '/water-sld':
        tab = 'WATER';
        tabIndex = 1;
        break;
      case '/waste-sld':
        tab = 'WASTE';
        tabIndex = 2;
        break;
      case '/emissions':
        tab = 'EMISSIONS';
        tabIndex = 3;
        break;
      case '/energy-sld':
      default:
        tab = 'ENERGY';
        tabIndex = 0;
    }
    setMenu('');

    setCurrentTab(tab);
    setValue(tabIndex);

    const getmenus = getSequencedMenuItems(
      userRoles?.data?.allowed_modules || [],
      'ESG Tracker',
      'name',
    );

    const insights = getmenus?.find((menu) => menu.name.toLowerCase() === tab.toLowerCase());
    setMenu(insights || '');
  }, [location.pathname, userRoles]);

  const menuListConfig = getMenuItems(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'ESG Tracker', 'name');

  const headerTabs = getHeaderTabs(
    userRoles?.data?.allowed_modules,
    'ESG Tracker',
  );

  let activeTab;
  let tabs;

  if (headerTabs) {
    tabs = getTabs(headerTabs[0].menu, inventoryNav.data);
    activeTab = getActiveTab(
      tabs.filter((e) => e),
      'Environment',
    );
  }

  useEffect(() => {
    dispatch(
      updateHeaderData({
        module: 'ESG Tracker',
        moduleName: 'ESG Monitoring',
        menuName: 'Environment',
        link: '/environment',
        headerTabs: tabs.filter((e) => e),
        activeTab,
      }),
    );
  }, [activeTab]);

  const handleTabChange = (event, newValue) => {
    setCurrentTab('');
    dispatch(resetTreeDashboard());
    setMenu('');
    const tabLabel = event.target.innerText;
    setCurrentTab(tabLabel);
    setValue(newValue);

    // // Toggle SLD and dashboard for WATER
    // if (tabLabel === 'WATER') {
    //   setShowSld((prev) => !prev); // Toggle between SLD and Water dashboard
    // }

    dispatch(getTransferFilters([]));
  };

  console.log(menu);

  return (
    <Box sx={{ width: '100%' }}>
      <div className="header-box2">
        <Tabs value={value} onChange={handleTabChange} aria-label="basic tabs example" sx={{ marginLeft: '-15px' }}>
          {menuListConfig && menuListConfig.length && menuListConfig.map((menu, idx) => {
            if (!menuList.includes(menu.toUpperCase())) return null;
            let to = '';
            if (menu.toUpperCase() === 'ENERGY') to = '/environment';
            else if (menu.toUpperCase() === 'WATER') to = '/water-sld';
            else if (menu.toUpperCase() === 'WASTE') to = '/waste-sld';
            else if (menu.toUpperCase() === 'EMISSIONS') to = '/emissions';
            // Add more routes as needed for other tabs
            return (
              <Tab
                key={menu}
                label={menu}
                component={Link}
                to={to}
                sx={{
                  '&.Mui-selected': {
                    color: themes === 'light' ? '#FFFFFF' : '#28a745',
                  },
                  '&:not(.Mui-selected)': {
                    color: themes === 'light' ? '#808080' : 'black',
                  },
                }}
              />
            );
          })}
        </Tabs>
      </div>
      {(() => {
        if (location.pathname === '/energy-sld') {
          return <ApiDataProvider><Energy showBackButton /></ApiDataProvider>;
        }
        if (location.pathname === '/water-sld') {
          // Extract sid from query string
          const params = new URLSearchParams(window.location.search);
          const sid = params.get('sid');
          if (sid) {
            // Show Water dashboard for selected meter
            const handleWaterBack = () => {
              window.location.pathname = '/water-sld';
            };
            return <Water meterId={sid} showBackButton onBackButtonClick={handleWaterBack} />;
          }
        }
        if (location.pathname === '/waste-sld') {
          return <Waste />;
        }
        switch (currentTab) {
          case 'ENERGY':
            if (menu.is_dashboard_tree && !menu.is_analytic_dashboard) {
              return <TreeDashboard dashboardUuid={menu.uuid} code={menu.dashboard_code} />;
            }
            return <SldOverView />;
          case 'WATER':
            if (menu.is_dashboard_tree && !menu.is_analytic_dashboard) {
              return <TreeDashboard dashboardUuid={menu.uuid} code={menu.dashboard_code} />;
            }
            return <Sld />;
          case 'WASTE':
            if (menu.is_dashboard_tree && !menu.is_analytic_dashboard) {
              return <TreeDashboard dashboardUuid={menu.uuid} code={menu.dashboard_code} />;
            }
            return <Waste />;
          case 'EMISSIONS':
            if (menu.is_dashboard_tree && !menu.is_analytic_dashboard) {
              return <TreeDashboard dashboardUuid={menu.uuid} code={menu.dashboard_code} />;
            }
            return <Emissions />;
          default:
            return null;
        }
      })()}
    </Box>
  );
};

export default OperationsSegments;
