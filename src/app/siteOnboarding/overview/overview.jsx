import React, { useEffect, useMemo, useState } from 'react';
import Box from '@mui/system/Box';
import { useDispatch, useSelector } from 'react-redux';
import {
  Grid, Card, CardContent, Typography,
} from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import { useHistory } from 'react-router-dom';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';

import DetailViewFormat from '@shared/detailViewFormat';
import ErrorContent from '@shared/errorContent';

import {
  getActiveTab, getHeaderTabs, getMenuItems, getTabs,
} from '../../util/appUtils';
import { getConfigurationSummary } from '../siteService';

import PieSummary from './pieSummary';
import PerformanceCards from './performanceCards';
import ModelsScroll from './modelsScroll';

const appModels = require('../../util/appModels').default;

const Overview = () => {
  const subMenu = 'Overview';
  const moduleName = 'Configuration';
  const dispatch = useDispatch();
  const history = useHistory();
  const { userInfo, userRoles } = useSelector((state) => state.user);
  const { onboardingSummary } = useSelector((state) => state.site);
  const menuList = getMenuItems(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], moduleName, 'name');

  const menuData = menuList.filter((item) => item === subMenu);
  const isMenu = !!(menuData && menuData.length);

  const [taskModel, setTaskModel] = useState(false);
  const [groupView, setGroupView] = useState(false);

  /* const headerTabs = getHeaderTabs(
    userRoles?.data?.allowed_modules,
    moduleName,
  );

  let activeTab;
  let tabs;

  if (headerTabs) {
    tabs = getTabs(headerTabs[0].menu, siteNav.data);
    activeTab = getActiveTab(
      tabs.filter((e) => e),
      subMenu,
    );
  }
  useEffect(() => {
    dispatch(
      updateHeaderData({
        module: moduleName,
        moduleName,
        menuName: subMenu,
        link: '/configuration/overview',
        headerTabs: tabs.filter((e) => e),
        activeTab,
      }),
    );
  }, [activeTab]); */

  useEffect(() => {
    if (userInfo && userInfo.data && userInfo.data.company) {
      dispatch(getConfigurationSummary(userInfo.data.company.id, appModels.HXONBOARDING));
    }
  }, [userInfo]);

  useEffect(() => {
    if (onboardingSummary && onboardingSummary.data && history.location && history.location.state && history.location.state.moduleId) {
      setTaskModel(history.location.state.moduleId);
      history.replace({
        ...history.location,
        state: null, // Clear the state
      });
    }
  }, [history, onboardingSummary]);

  const detailData = useMemo(() => (onboardingSummary && onboardingSummary.data && onboardingSummary.data.length ? onboardingSummary.data : ''), [onboardingSummary]);

  function getStatusCount(status) {
    let res = 0;
    if (detailData) {
      const statusDatas = detailData.filter((item) => item.state === status);
      res = statusDatas.length;
    }
    return res;
  }

  /* if (!isMenu) {
    return (<Redirect to="/configuration/sites" />);
  } */

  const cardData = Array.from({ length: 8 }, (_, index) => ({
    id: index,
    title: `Card Title ${index + 1}`,
    content: `This is card content for card ${index + 1}.`,
  }));

  return (
    <Box
      className="p-0 bg-white h-100"
    >
      {!(onboardingSummary && onboardingSummary.loading) && !taskModel && detailData && (
        <>
          <PieSummary detailData={detailData} />

          <div className="p-3 h-100 bg-white">
            <div className={`display-flex content-center${groupView ? 'mb-2' : ''}`}>
              <p className="font-family-tab font-weight-800 mt-0 mb-0">
                Setup Workflow by Module
                {' '}
                {groupView ? '(Stage Wise)' : ''}
              </p>
              <div className="ml-auto">
                <ButtonGroup
                  variant="contained"
                  size="small"
                  aria-label="Basic button group"
                >
                  <Button
                    onClick={() => setGroupView(false)}
                    variant={!groupView ? 'contained' : 'outlined'}
                    color={!groupView ? 'primary' : 'inherit'}
                  >
                    List
                  </Button>
                  <Button
                    onClick={() => setGroupView(true)}
                    variant={groupView ? 'contained' : 'outlined'}
                    color={groupView ? 'primary' : 'inherit'}
                  >
                    Group
                  </Button>
                </ButtonGroup>
              </div>
            </div>
            {groupView && (
              <>
                {getStatusCount('In Progress') > 0 && (
                <>
                  <h6 className="font-family-tab mb-2" style={{ color: '#ffa000' }}>
                    In Progress (
                    {getStatusCount('In Progress')}
                    )
                  </h6>
                  <PerformanceCards setTaskModel={setTaskModel} detailData={detailData} status="In Progress" color="#ffa000" />
                </>
                )}
                {getStatusCount('Open') > 0 && (
                <>
                  <h6 className="font-family-tab mb-2" style={{ color: '#6c757d' }}>
                    Not Started (
                    {getStatusCount('Open')}
                    )
                  </h6>
                  <PerformanceCards setTaskModel={setTaskModel} detailData={detailData} status="Open" color="#6c757d" />
                </>
                )}

                {getStatusCount('Done') > 0 && (
                <>
                  <h6 className="font-family-tab mb-2" style={{ color: '#70b652' }}>
                    Completed & Ready to use (
                    {getStatusCount('Done')}
                    )
                  </h6>
                  <PerformanceCards setTaskModel={setTaskModel} detailData={detailData} status="Done" color="#70b652" />
                </>
                )}
              </>
            )}
            {!groupView && (
            <PerformanceCards setTaskModel={setTaskModel} detailData={detailData} status="All" color="#ffa000" />
            )}
          </div>
        </>
      )}
      {!(onboardingSummary && onboardingSummary.loading) && taskModel && detailData && (
        <ModelsScroll setTaskModel={setTaskModel} detailData={detailData} taskModel={taskModel} />
      )}
      {onboardingSummary && onboardingSummary.loading && (
        <div className="p-4">
          <Skeleton
            variant="rectangular"
            width={450}
            height={200}
            animation="wave"
          />
          <Grid container className="vertical-horizontal-center p-5" spacing={2}>
            {cardData.map((card) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={card.id}>
                <Card>
                  <Skeleton variant="rectangular" height={140} />
                  <CardContent>
                    <Typography variant="h6">
                      <Skeleton width="60%" />
                    </Typography>
                    <Typography variant="body2">
                      <Skeleton width="90%" />
                      <Skeleton width="80%" />
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </div>
      )}
      {onboardingSummary && !onboardingSummary.loading && onboardingSummary.err && (
      <DetailViewFormat detailResponse={onboardingSummary} />
      )}
      {onboardingSummary && !(onboardingSummary.data && onboardingSummary.data.length > 0) && !onboardingSummary.loading && !onboardingSummary.err && (
      <ErrorContent errorTxt="No data found." />
      )}
    </Box>
  );
};
export default Overview;
