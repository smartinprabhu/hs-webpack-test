/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-unresolved */
import React, { Suspense, lazy, useEffect } from 'react';
import {
  Col,
  Row,
} from 'reactstrap';
import { ThemeProvider } from '@material-ui/core/styles';
import {
  Skeleton,
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import theme from '../util/materialTheme';
import {
  detectMob, getActiveTab, getHeaderTabs, getTabs,
} from '../util/appUtils';
import Navbar from './navbar/navbar';
import { updateHeaderData } from '../core/header/actions';
import airQualityNav from './navbar/navlist.json';

const MapLocations = lazy(() => import('./mapLocations'));
const Notifications = lazy(() => import('../dashboard/schoolNotifications'));
const GroupCharts = lazy(() => import('./groupCharts'));

const DetailSchoolView = () => {
  const subMenu = 'Insights';

  const isMob = detectMob();

  const {
    getFloorsInfo, spaceEquipments, getSpaceInfo,
  } = useSelector((state) => state.equipment);
  const dispatch = useDispatch();

  const loading = (getSpaceInfo && getSpaceInfo.loading) || (getFloorsInfo && getFloorsInfo.loading) || (spaceEquipments && spaceEquipments.loading);
  const { userRoles } = useSelector((state) => state.user);
  const headerTabs = getHeaderTabs(
    userRoles?.data?.allowed_modules,
    'Air Quality Monitoring',
  );

  let activeTab;
  let tabs;

  if (headerTabs && headerTabs.length) {
    tabs = getTabs(headerTabs[0].menu, airQualityNav.data);
    activeTab = getActiveTab(
      tabs.filter((e) => e),
      'Insights',
    );
  }
  useEffect(() => {
    if (tabs && tabs.length) {
      dispatch(
        updateHeaderData({
          module: 'Air Quality Monitoring',
          moduleName: 'Air Quality Monitoring',
          menuName: 'Insights',
          link: '/airquality-overview',
          headerTabs: tabs.filter((e) => e),
          activeTab,
        }),
      );
    }
  }, [activeTab]);

  return (
    <Row className="ml-1 mr-1 mt-2 mb-2 p-2 border">
      <Col sm="12" md="12" lg="12" xs="12" className="p-2">
        <ThemeProvider theme={theme}>
          <Suspense fallback={(
            <Skeleton
              active
              size="large"
              paragraph={{
                rows: 12,
              }}
            />
          )}
          >
            <MapLocations />
            {!loading && spaceEquipments && spaceEquipments.data && (
              <Row className={isMob ? '' : 'pl-1 pr-1'}>
                <Col sm="12" md="12" lg="6" xs="12" className={isMob ? 'mb-2' : 'pr-1 pl-1'}>
                  <Notifications modelName={false} />
                </Col>
                <GroupCharts />
              </Row>
            )}
          </Suspense>
        </ThemeProvider>
      </Col>
    </Row>
  );
};

export default DetailSchoolView;
