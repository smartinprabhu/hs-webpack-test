/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import Header from '../core/header/header';
import {
  getSequencedMenuItems,
} from '../util/appUtils';
import DashboardIOTView from '../apexDashboards/assetsDashboard/dashboardIOTView';

const Ups2OverView = () => {
  const [menu, setMenu] = useState('');

  const { userRoles } = useSelector((state) => state.user);
  const { pinEnableData } = useSelector((state) => state.auth);

  useEffect(() => {
    const getmenus = getSequencedMenuItems(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], 'UPS', 'name');
    let insights = '';
    if (getmenus && getmenus.length) {
      insights = getmenus.find((menu) => menu.name.toLowerCase() === '20 kva ups#2');
    }
    setMenu(insights || '');
  }, [userRoles]);

  const uuid = menu && menu.uuid ? menu.uuid : '12345';

  return (
    <div className={pinEnableData ? 'content-box-expand' : 'content-box'}>
      {menu && menu.name && (
        <Header
          headerPath={`${menu.module.name}`}
          nextPath={`${menu.name}`}
          pathLink="/ups1-20kva-overview"
        />
      )}
      {menu && menu.dashboard_code && (
      <DashboardIOTView dashboardCode={menu.dashboard_code} dashboardUuid={uuid} />
      )}
    </div>
  );
};

export default Ups2OverView;
