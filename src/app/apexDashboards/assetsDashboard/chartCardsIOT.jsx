/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable max-len */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable radix */
/* eslint-disable camelcase */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { WidthProvider, Responsive } from 'react-grid-layout';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useSelector } from 'react-redux';

import '../dashboard.scss';
import { getDataArryIn } from '../utils/utils';
import BarChart from './barChart';
import PieChart from './pieChart';
import TableView from './tableView';
import DataCard from './dataCard';
import { groupByMultiple } from '../../util/staticFunctions';
import TabPanel from './tabPanel';
import SectionHeader from './sectionHeader';
import SectionImage from './sectionImage';


const ResponsiveReactGridLayout = WidthProvider(Responsive);

const ChartCardsIOT = React.memo(
  ({
    data,
    dataList,
    editMode,
    selectedDateTag,
    customDateValue,
    code,
    setCustomLayouts,
    dashboardLayouts,
    dashboardColors,
    customLayouts,
    isIot,
    dashboardUuid,
    dashboardCode,
    advanceFilter,
    setDashboardCode,
    expandMode,
    isIAQ,
    hideExpand,
    isDrill,
  }) => {
    const arrGrids = dataList ? JSON.parse(dataList) : [];
    const dataIds = Object.keys(data);
    const dataArray = getDataArryIn(data || [], dataIds);
    // const dataArray = dataArray1.sort((a, b) => a.sequence - b.sequence);

    const { ninjaDashboard, ninjaDashboardDrill } = useSelector((state) => state.analytics);

    const [layouts, setLayouts] = useState(customLayouts);

    const [value, setValue] = useState(0);

    useMemo(() => {
      if (customLayouts) {
        setLayouts(customLayouts);
      }
    }, [customLayouts]);

    const tabLayout = dataArray && dataArray.length
      ? dataArray.filter(
        (item) => item.ks_hx_group_id
              && item.ks_hx_group_id.id
              && item.code !== 'HIDDEN',
      )
      : false;

    const sortSections = (dataSections) => {
      const dataSectionsNew = dataSections.sort(
        (a, b) => a.sequence - b.sequence,
      );
      return dataSectionsNew;
    };

    useEffect(() => {
      if (tabLayout && tabLayout.length && !value) {
        setValue(sortSections(tabLayout)[0].id);
      }
    }, [data]);

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    function a11yProps(index) {
      return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
      };
    }

    const onLayoutChange = (layout, layoutss) => {
      setLayouts(layout);
      setCustomLayouts(layout);
    };

    function isJsonString(str) {
      try {
        JSON.parse(str);
      } catch (e) {
        return false;
      }
      return true;
    }

    function defaultLayout(id, seq, type) {
      let res = {
        x: 0,
        y: 0,
        w: 3,
        h: type === 'ks_header' ? 1.5 : 3,
        minW: 1,
        minH: 1,
      };
      let dashboardLayoutsNew = dashboardLayouts;
      if (isIot && !isDrill) {
        dashboardLayoutsNew = ninjaDashboard.data.dashboard_json
          && isJsonString(ninjaDashboard.data.dashboard_json)
          ? JSON.parse(ninjaDashboard.data.dashboard_json)
          : [];
      } else if (isIot && isDrill) {
        dashboardLayoutsNew = ninjaDashboardDrill.data.dashboard_json
        && isJsonString(ninjaDashboardDrill.data.dashboard_json)
          ? JSON.parse(ninjaDashboardDrill.data.dashboard_json)
          : [];
      }

      const dataLayout = dashboardLayoutsNew && dashboardLayoutsNew.length
        ? dashboardLayoutsNew.filter(
          (item) => parseInt(item.i) === parseInt(id),
        )
        : false;
      const dataLayout1 = dashboardLayouts && dashboardLayouts.length
        ? dashboardLayouts.filter(
          (item) => parseInt(`${item.w}${item.x}${item.y}`) === parseInt(seq),
        )
        : false;
      if (dataLayout && dataLayout.length) {
        res = {
          x: dataLayout[0].x,
          y: dataLayout[0].y,
          w: dataLayout[0].w,
          h: dataLayout[0].h,
          minW: 1,
          minH: 1,
        };
      } else if (dataLayout1 && dataLayout1.length) {
        res = {
          x: dataLayout1[0].x,
          y: dataLayout1[0].y,
          w: dataLayout1[0].w,
          h: dataLayout1[0].h,
          minW: 1,
          minH: 1,
        };
      }
      if (type === 'ks_header') {
        res.maxH = 1.5;
      }
      return res;
    }

    function getDimension(ids) {
      let res = {
        w: 400,
        h: 400,
      };
      const id = `id${ids}`;
      const targetDiv = document.getElementById(id);
      if (targetDiv && targetDiv.clientHeight && targetDiv.clientWidth) {
        res = {
          w: targetDiv.clientWidth,
          h: targetDiv.clientHeight,
        };
      }
      return res;
    }

    function getAreas(id, seq) {
      let res = {
        w: 4,
        h: 4,
      };
      const dataLayout = layouts && layouts.length
        ? layouts.filter((item) => parseInt(item.i) === parseInt(id))
        : false;
      const dataLayout1 = layouts && layouts.length
        ? layouts.filter(
          (item) => parseInt(`${item.w}${item.x}${item.y}`) === parseInt(seq),
        )
        : false;
      if (dataLayout && dataLayout.length) {
        res = {
          w: dataLayout[0].w,
          h: dataLayout[0].h,
        };
      } else if (dataLayout1 && dataLayout1.length) {
        res = {
          w: dataLayout1[0].w,
          h: dataLayout1[0].h,
        };
      }
      return res;
    }

    const tabLayoutCharts = tabLayout && tabLayout.length > 0
      ? groupByMultiple(tabLayout, (obj) => (obj.ks_hx_group_id && obj.ks_hx_group_id.id
        ? obj.ks_hx_group_id.id
        : ''))
      : [];

    const getGroupedTabs = (id) => {
      let res = [];
      if (tabLayout && tabLayout.length) {
        res = tabLayout.filter(
          (item) => item.ks_hx_group_id && item.ks_hx_group_id.id === id,
        );
      }
      return res;
    };

    const handleLayoutChange = useCallback((layout, layoutss) => {
      onLayoutChange(layout, layoutss);
    }, []);

    return (
      <ResponsiveReactGridLayout
        margin={[5, 5]}
        className={dataArray && dataArray.length > 0 ? 'min-height-100vh' : ''}
        containerPadding={[0, 0]}
        layouts={layouts}
        breakpoints={{
          lg: 1200,
          md: 996,
          sm: 768,
          xs: 480,
          xxs: 0,
        }}
        cols={{
          lg: 12,
          md: 10,
          sm: 6,
          xs: 4,
          xxs: 2,
        }}
        rowHeight={30}
        isDraggable={editMode}
        isResizable={editMode}
        isBounded={false}
        onLayoutChange={(layout, layoutss) => {
          onLayoutChange(layout, layoutss);
        }}
      >
        {dataArray
          && dataArray.length > 0
          && dataArray.map(
            (dl) => (!dl.ks_hx_group_id || !dl.ks_hx_group_id.id)
              && dl.code !== 'HIDDEN' && (
                <div
                  key={dl.id}
                  data-grid={defaultLayout(
                    dl.id,
                    dl.web_sequence,
                    dl.ks_dashboard_item_type,
                  )}
                  id={`id${dl.id}`}
                  className={
                    dl.ks_dashboard_item_type !== 'ks_kpi' && dl.ks_dashboard_item_type !== 'ks_header'
                      ? 'circle-graph-box'
                      : 'chart-box'
                  }
                                  >
                    {(dl.ks_dashboard_item_type === 'ks_header') && (
                    <SectionHeader chartData={dl} height={getDimension(dl.id).h} width={getDimension(dl.id).w} />
                    )}
                  {(dl.ks_dashboard_item_type === 'ks_image') && (
                  <SectionImage chartData={dl} height={getDimension(dl.id).h} width={getDimension(dl.id).w} />
                  )}
                  {(dl.ks_dashboard_item_type === 'ks_tile'
                    || dl.ks_dashboard_item_type === 'ks_kpi') && (
                    <DataCard
                      dataItem={dl}
                      height={getDimension(dl.id).h}
                      width={getAreas(dl.id, dl.web_sequence).w}
                      isIot={!!dashboardUuid}
                      selectedDateTag={selectedDateTag}
                      dashboardColors={dashboardColors}
                      code={code}
                      dashboardUuid={dashboardUuid}
                      dashboardCode={dashboardCode}
                      editMode={editMode}
                      isIAQ={isIAQ}
                    />
                  )}
                  {(dl.ks_dashboard_item_type === 'ks_pie_chart'
                    || dl.ks_dashboard_item_type === 'ks_doughnut_chart') && (
                    <PieChart
                      dashboardColors={dashboardColors}
                      chartData={dl}
                      height={getAreas(dl.id, dl.web_sequence).h}
                      width={getDimension(dl.id).w}
                      dashboardUuid={dashboardUuid}
                      divHeight={getDimension(dl.id).h}
                      dashboardCode={dashboardCode}
                      chartCode={dl.id}
                      id={`id${dl.id}`}
                    />
                  )}
                  {(dl.ks_dashboard_item_type === 'ks_area_chart'
                    || dl.ks_dashboard_item_type === 'ks_line_chart'
                    || dl.ks_dashboard_item_type === 'ks_bar_multi_chart'
                    || dl.ks_dashboard_item_type === 'ks_bar_advance_chart'
                    || dl.ks_dashboard_item_type === 'ks_bar_chart'
                    || dl.ks_dashboard_item_type === 'ks_horizontalBar_chart') && (
                    <BarChart
                      code={code}
                      selectedDateTag={selectedDateTag}
                      customDateValue={customDateValue}
                      dashboardColors={dashboardColors}
                      chartData={dl}
                      height={getAreas(dl.id, dl.web_sequence).h}
                      width={getDimension(dl.id).w}
                      divHeight={getDimension(dl.id).h}
                      dashboardUuid={dashboardUuid}
                      dashboardCode={dashboardCode}
                      advanceFilter={advanceFilter}
                      setDashboardCode={setDashboardCode}
                      id={`id${dl.id}`}
                      chartCode={dl.id}
                      isIot={isIot}
                      editMode={editMode}
                    />
                  )}
                  {dl.ks_dashboard_item_type === 'ks_list_view' && (
                    <TableView
                      chartData={dl}
                      isIot={isIot}
                      dashboardUuid={dashboardUuid}
                      dashboardCode={dashboardCode}
                      height={getDimension(dl.id).h}
                      fontHeight={getAreas(dl.id, dl.web_sequence).h}
                      width={getDimension(dl.id).w}
                      fontWidth={getAreas(dl.id, dl.web_sequence).w}
                    />
                  )}
                </div>
            ),
          )}
        {tabLayout
          && tabLayout.length > 0
          && tabLayoutCharts
          && tabLayoutCharts.length > 0
          && tabLayoutCharts.map((tc) => (
            <div
              key={tc[0].id}
              data-grid={defaultLayout(
                tc[0].id,
                tc[0].web_sequence,
                tc[0].ks_dashboard_item_type,
              )}
              id={`id${tc[0].id}`}
              className={
                tc[0].ks_dashboard_item_type !== 'ks_kpi' && tc[0].ks_dashboard_item_type !== 'ks_header'
                  ? 'circle-graph-box'
                  : ''
              }
                          >
              <Tabs
                value={value}
                onChange={handleChange}
                textColor="primary"
                variant="scrollable"
                indicatorColor="primary"
                className="hidden-scrollbar"
                aria-label="secondary tabs example"
                sx={{
                  borderBottom: '1px solid #efefef',
                  overflowX: 'auto',
                }}
              >
                {getGroupedTabs(
                  tc[0].ks_hx_group_id && tc[0].ks_hx_group_id.id
                    ? tc[0].ks_hx_group_id.id
                    : false,
                )
                  && getGroupedTabs(
                    tc[0].ks_hx_group_id && tc[0].ks_hx_group_id.id
                      ? tc[0].ks_hx_group_id.id
                      : false,
                  ).length > 0
                  && sortSections(
                    getGroupedTabs(
                      tc[0].ks_hx_group_id && tc[0].ks_hx_group_id.id
                        ? tc[0].ks_hx_group_id.id
                        : false,
                    ),
                  ).map((dl, index) => (
                    <Tab
                      sx={{
                        textTransform: 'capitalize',
                        fontFamily: 'Suisse Intl',
                        fontWeight: '600',
                      }}
                      label={dl.name}
                      value={dl.id}
                      {...a11yProps(dl.id)}
                    />
                  ))}
              </Tabs>
              {getGroupedTabs(
                tc[0].ks_hx_group_id && tc[0].ks_hx_group_id.id
                  ? tc[0].ks_hx_group_id.id
                  : false,
              )
                && getGroupedTabs(
                  tc[0].ks_hx_group_id && tc[0].ks_hx_group_id.id
                    ? tc[0].ks_hx_group_id.id
                    : false,
                ).length > 0
                && sortSections(
                  getGroupedTabs(
                    tc[0].ks_hx_group_id && tc[0].ks_hx_group_id.id
                      ? tc[0].ks_hx_group_id.id
                      : false,
                  ),
                ).map((dl1, index1) => (
                  <TabPanel
                    dataValue={value}
                    index={dl1.id}
                    groupId={dl1.ks_hx_group_id.id}
                  >
                    {(dl1.ks_dashboard_item_type === 'ks_pie_chart'
                      || dl1.ks_dashboard_item_type === 'ks_doughnut_chart') && (
                      <PieChart
                        dashboardColors={dashboardColors}
                        chartData={dl1}
                        chartCode={dl1.id}
                        height={
                          getAreas(
                            getGroupedTabs(
                              tc[0].ks_hx_group_id && tc[0].ks_hx_group_id.id
                                ? tc[0].ks_hx_group_id.id
                                : false,
                            )[0].id,
                            getGroupedTabs(
                              tc[0].ks_hx_group_id && tc[0].ks_hx_group_id.id
                                ? tc[0].ks_hx_group_id.id
                                : false,
                            )[0].web_sequence,
                          ).h - 0.1
                        }
                        width={getDimension(dl1.id).w}
                        dashboardUuid={dashboardUuid}
                        dashboardCode={dashboardCode}
                        isIot={isIot}
                        id={`id${dl1.id}`}
                      />
                    )}
                    {(dl1.ks_dashboard_item_type === 'ks_area_chart'
                      || dl1.ks_dashboard_item_type === 'ks_line_chart'
                      || dl1.ks_dashboard_item_type === 'ks_bar_multi_chart'
                      || dl1.ks_dashboard_item_type === 'ks_bar_advance_chart'
                      || dl1.ks_dashboard_item_type === 'ks_bar_chart'
                      || dl1.ks_dashboard_item_type
                        === 'ks_horizontalBar_chart') && (
                        <BarChart
                          code={code}
                          selectedDateTag={selectedDateTag}
                          customDateValue={customDateValue}
                          dashboardColors={dashboardColors}
                          chartData={dl1}
                          height={
                          getAreas(
                            getGroupedTabs(
                              tc[0].ks_hx_group_id && tc[0].ks_hx_group_id.id
                                ? tc[0].ks_hx_group_id.id
                                : false,
                            )[0].id,
                            getGroupedTabs(
                              tc[0].ks_hx_group_id && tc[0].ks_hx_group_id.id
                                ? tc[0].ks_hx_group_id.id
                                : false,
                            )[0].web_sequence,
                          ).h - 0.1
                        }
                          width={getDimension(dl1.id).w}
                          chartCode={dl1.id}
                          dashboardUuid={dashboardUuid}
                          dashboardCode={dashboardCode}
                          advanceFilter={advanceFilter}
                          isIAQ={isIAQ}
                          isIot={isIot}
                          setDashboardCode={setDashboardCode}
                          id={`id${dl1.id}`}
                          editMode={editMode}
                        />
                    )}
                    {dl1.ks_dashboard_item_type === 'ks_list_view' && (
                      <TableView
                        chartData={dl1}
                        isIot={isIot}
                        dashboardUuid={dashboardUuid}
                        dashboardCode={dashboardCode}
                        height={
                          getDimension(
                            getGroupedTabs(
                              tc[0].ks_hx_group_id && tc[0].ks_hx_group_id.id
                                ? tc[0].ks_hx_group_id.id
                                : false,
                            )[0].id,
                          ).h
                        }
                        fontHeight={
                          getAreas(
                            getGroupedTabs(
                              tc[0].ks_hx_group_id && tc[0].ks_hx_group_id.id
                                ? tc[0].ks_hx_group_id.id
                                : false,
                            )[0].id,
                            getGroupedTabs(
                              tc[0].ks_hx_group_id && tc[0].ks_hx_group_id.id
                                ? tc[0].ks_hx_group_id.id
                                : false,
                            )[0].web_sequence,
                          ).h
                        }
                        width={
                          getDimension(
                            getGroupedTabs(
                              tc[0].ks_hx_group_id && tc[0].ks_hx_group_id.id
                                ? tc[0].ks_hx_group_id.id
                                : false,
                            )[0].id,
                          ).w
                        }
                      />
                    )}
                  </TabPanel>
                ))}
            </div>
          ))}
        <div className="graphs-box" />
      </ResponsiveReactGridLayout>
    );
  },
);

export default ChartCardsIOT;
