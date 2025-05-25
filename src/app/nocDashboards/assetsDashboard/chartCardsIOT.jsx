/* eslint-disable max-len */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable radix */
/* eslint-disable camelcase */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { WidthProvider, Responsive } from 'react-grid-layout';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useSelector } from 'react-redux';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import '../dashboard.scss';
import { getDataArryIn, getColorCode } from '../utils/utils';
import { groupByMultiple } from '../../util/staticFunctions';
import { getJsonString } from '../../util/appUtils';
import BarChart from './barChart';
import PieChart from './pieChart';
import HorizontalBarChart from './horizontalBarChart';
import LineAreaChart from './lineAreaChart';
import TableView from './tableView';
import DataCard from './dataCard';
import TabPanel from './tabPanel';
import SectionHeader from './sectionHeader';
import SectionImage from './sectionImage';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const ChartCardsIOT = React.memo(({
  data, dataList, editMode, selectedDateTag, code, setCustomLayouts, dashboardLayouts,
  dashboardColors, customLayouts, dateFilters, isIot,
  dashboardUuid,
  dashboardCode,
  advanceFilter,
  isPublic,
  isIAQ,
}) => {
  const arrGrids = dataList ? JSON.parse(dataList) : [];
  const dataIds = Object.keys(arrGrids);
  const dataArray = getDataArryIn(data || [], dataIds);
  // const dataArray = dataArray1.sort((a, b) => a.sequence - b.sequence);

  const [layouts, setLayouts] = useState({});
  const [layouts1, setLayouts1] = useState(customLayouts);

  const [value, setValue] = useState(0);

  const { ninjaDashboard } = useSelector((state) => state.analytics);

  useEffect(() => {
    if (customLayouts) {
      setLayouts1(customLayouts);
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

  const onLayoutChange = (layout, layoutss) => {
    setLayouts1(layout);
    setCustomLayouts(layout);
    setLayouts(layouts);
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
      minW: 2,
      minH: 1,
    };
    let dashboardLayoutsNew = dashboardLayouts;
    if (isIot && !isPublic) {
      dashboardLayoutsNew = ninjaDashboard.data.dashboard_json
          && isJsonString(ninjaDashboard.data.dashboard_json)
        ? JSON.parse(ninjaDashboard.data.dashboard_json)
        : [];
    }
    const dataLayout = dashboardLayoutsNew && dashboardLayoutsNew.length ? dashboardLayoutsNew.filter((item) => parseInt(item.i) === parseInt(id)) : false;
    const dataLayout1 = dashboardLayouts && dashboardLayouts.length ? dashboardLayouts.filter((item) => parseInt(`${item.w}${item.x}${item.y}`) === parseInt(seq)) : false;
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

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
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

  function isKpiLayout(it) {
    const isLayout = ((it.ks_info && isJsonString(it.ks_info) && getJsonString(it.ks_info).layout) || (it.ks_description && isJsonString(it.ks_description) && getJsonString(it.ks_description).layout));
    return isLayout;
  }

  return (
    <ResponsiveReactGridLayout
      className="row row-cols-sm-12"
      cols={{
        lg: 12, md: 10, sm: 6, xs: 4, xxs: 2,
      }}
      breakpoints={{
        lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0,
      }}
      rowHeight={30}
      layouts={layouts1}
      isDraggable={editMode}
      isResizable={editMode}
      isBounded
      onLayoutChange={(layout, layoutss) => {
        onLayoutChange(layout, layoutss);
      }}
    >
      {dataArray && dataArray.length > 0 && dataArray.map((dl) => (
        (!dl.ks_hx_group_id || !dl.ks_hx_group_id.id)
         && dl.code !== 'HIDDEN' && (
         <div
           key={dl.id}
           data-grid={defaultLayout(dl.id, dl.web_sequence, dl.ks_dashboard_item_type)}
           id={`id${dl.id}`}
           style={(dl.ks_layout === 'layout5' || isKpiLayout(dl)) && (dl.ks_dashboard_item_type === 'ks_tile' || dl.ks_dashboard_item_type === 'ks_kpi') ? { backgroundColor: getColorCode(dl.ks_background_color), color: 'white' } : {}}
           className={`${dl.ks_dashboard_item_type === 'ks_tile' || dl.ks_dashboard_item_type === 'ks_kpi' ? 'p-2' : 'p-0'} grid-layout-custom-card ${(dl.ks_model_name === 'mgmtsystem.action' && dl.ks_dashboard_item_type === 'ks_list_view') || (dl.ks_dashboard_item_type === 'ks_header') || (dl.ks_dashboard_item_type === 'ks_image') ? '' : `shadow-card-dashboard ${(dl.ks_layout === 'layout5' || isKpiLayout(dl)) && (dl.ks_dashboard_item_type === 'ks_tile' || dl.ks_dashboard_item_type === 'ks_kpi') ? '' : 'bg-white'}`}`}
         >
           {(dl.ks_dashboard_item_type === 'ks_tile' || dl.ks_dashboard_item_type === 'ks_kpi') && (
           <DataCard
             isIot={isIot}
             dashboardUuid={dashboardUuid}
             dashboardCode={dashboardCode}
             advanceFilter={advanceFilter}
             dashboardColors={dashboardColors}
             code={code}
             dateFilters={dateFilters}
             editMode={editMode}
             selectedDateTag={selectedDateTag}
             dataItem={dl}
             isPublic={isPublic}
             height={getDimension(dl.id).h}
             width={getDimension(dl.id).w}
           />
           )}
             {(dl.ks_dashboard_item_type === 'ks_header') && (
             <SectionHeader dashboardColors={dashboardColors} code={code} dateFilters={dateFilters} editMode={editMode} selectedDateTag={selectedDateTag} chartData={dl} height={getDimension(dl.id).h} width={getDimension(dl.id).w} />
             )}
           {(dl.ks_dashboard_item_type === 'ks_image') && (
           <SectionImage dashboardColors={dashboardColors} code={code} dateFilters={dateFilters} editMode={editMode} selectedDateTag={selectedDateTag} chartData={dl} height={getDimension(dl.id).h} width={getDimension(dl.id).w} />
           )}
           {(dl.ks_dashboard_item_type === 'ks_polarArea_chart' || dl.ks_dashboard_item_type === 'ks_bar_multi_chart' || dl.ks_dashboard_item_type === 'ks_bar_advance_chart' || dl.ks_dashboard_item_type === 'ks_bar_chart') && (
           <BarChart
             isIot={isIot}
             dashboardUuid={dashboardUuid}
             dashboardCode={dashboardCode}
             advanceFilter={advanceFilter}
             code={code}
             selectedDateTag={selectedDateTag}
             dashboardColors={dashboardColors}
             chartData={dl}
             isPublic={isPublic}
             height={getDimension(dl.id).h}
             width={getDimension(dl.id).w}
             dateFilters={dateFilters}
           />
           )}
           {(dl.ks_dashboard_item_type === 'ks_pie_chart' || dl.ks_dashboard_item_type === 'ks_doughnut_chart') && (
           <PieChart
             isIot={isIot}
             dashboardUuid={dashboardUuid}
             dashboardCode={dashboardCode}
             advanceFilter={advanceFilter}
             dashboardColors={dashboardColors}
             chartData={dl}
             isPublic={isPublic}
             height={getDimension(dl.id).h}
             width={getDimension(dl.id).w}
             dateFilters={dateFilters}
           />
           )}
           {dl.ks_dashboard_item_type === 'ks_horizontalBar_chart' && (
           <HorizontalBarChart
             isIot={isIot}
             dashboardUuid={dashboardUuid}
             dashboardCode={dashboardCode}
             advanceFilter={advanceFilter}
             dashboardColors={dashboardColors}
             chartData={dl}
             isPublic={isPublic}
             height={getDimension(dl.id).h}
             width={getDimension(dl.id).w}
             dateFilters={dateFilters}
           />
           )}
           {dl.ks_dashboard_item_type === 'ks_list_view' && (
           <TableView
             isIot={isIot}
             dashboardUuid={dashboardUuid}
             dashboardCode={dashboardCode}
             advanceFilter={advanceFilter}
             chartData={dl}
             isPublic={isPublic}
             height={getDimension(dl.id).h}
             width={getDimension(dl.id).w}
             dateFilters={dateFilters}
           />
           )}
           {(dl.ks_dashboard_item_type === 'ks_line_chart' || dl.ks_dashboard_item_type === 'ks_area_chart') && (
           <LineAreaChart
             isIot={isIot}
             dashboardUuid={dashboardUuid}
             dashboardCode={dashboardCode}
             advanceFilter={advanceFilter}
             code={code}
             selectedDateTag={selectedDateTag}
             dashboardColors={dashboardColors}
             chartData={dl}
             isPublic={isPublic}
             height={getDimension(dl.id).h}
             width={getDimension(dl.id).w}
             dateFilters={dateFilters}
           />
           )}
         </div>
        )))}
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
              )}
              id={`id${tc[0].id}`}
              className={`${tc[0].ks_dashboard_item_type === 'ks_tile' || tc[0].ks_dashboard_item_type === 'ks_kpi' ? 'p-2' : 'p-0'} grid-layout-custom-card ${tc[0].ks_model_name === 'mgmtsystem.action' && tc[0].ks_dashboard_item_type === 'ks_list_view' ? '' : 'shadow-card-dashboard bg-white'}`}
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
                    {(dl1.ks_dashboard_item_type === 'ks_polarArea_chart' || dl1.ks_dashboard_item_type === 'ks_bar_multi_chart' || dl1.ks_dashboard_item_type === 'ks_bar_advance_chart' || dl1.ks_dashboard_item_type === 'ks_bar_chart') && (
                    <BarChart
                      code={code}
                      selectedDateTag={selectedDateTag}
                      dashboardColors={dashboardColors}
                      chartData={dl1}
                      height={getDimension(getGroupedTabs(
                        tc[0].ks_hx_group_id && tc[0].ks_hx_group_id.id
                          ? tc[0].ks_hx_group_id.id
                          : false,
                      )[0].id).h - 60}
                      width={getDimension(getGroupedTabs(
                        tc[0].ks_hx_group_id && tc[0].ks_hx_group_id.id
                          ? tc[0].ks_hx_group_id.id
                          : false,
                      )[0].id).w}
                      isIot={isIot}
                      dashboardUuid={dashboardUuid}
                      dashboardCode={dashboardCode}
                      advanceFilter={advanceFilter}
                      dateFilters={dateFilters}
                    />
                    )}
                    {(dl1.ks_dashboard_item_type === 'ks_pie_chart' || dl1.ks_dashboard_item_type === 'ks_doughnut_chart') && (
                    <PieChart
                      dashboardColors={dashboardColors}
                      chartData={dl1}
                      height={getDimension(getGroupedTabs(
                        tc[0].ks_hx_group_id && tc[0].ks_hx_group_id.id
                          ? tc[0].ks_hx_group_id.id
                          : false,
                      )[0].id).h - 60}
                      width={getDimension(getGroupedTabs(
                        tc[0].ks_hx_group_id && tc[0].ks_hx_group_id.id
                          ? tc[0].ks_hx_group_id.id
                          : false,
                      )[0].id).w}
                      isIot={isIot}
                      dashboardUuid={dashboardUuid}
                      dashboardCode={dashboardCode}
                      advanceFilter={advanceFilter}
                      dateFilters={dateFilters}
                    />
                    )}
                    {dl1.ks_dashboard_item_type === 'ks_horizontalBar_chart' && (
                    <HorizontalBarChart
                      dashboardColors={dashboardColors}
                      chartData={dl1}
                      height={getDimension(getGroupedTabs(
                        tc[0].ks_hx_group_id && tc[0].ks_hx_group_id.id
                          ? tc[0].ks_hx_group_id.id
                          : false,
                      )[0].id).h - 60}
                      width={getDimension(getGroupedTabs(
                        tc[0].ks_hx_group_id && tc[0].ks_hx_group_id.id
                          ? tc[0].ks_hx_group_id.id
                          : false,
                      )[0].id).w}
                      isIot={isIot}
                      dashboardUuid={dashboardUuid}
                      dashboardCode={dashboardCode}
                      advanceFilter={advanceFilter}
                      dateFilters={dateFilters}
                    />
                    )}
                    {dl1.ks_dashboard_item_type === 'ks_list_view' && (
                    <TableView
                      chartData={dl1}
                      height={getDimension(getGroupedTabs(
                        tc[0].ks_hx_group_id && tc[0].ks_hx_group_id.id
                          ? tc[0].ks_hx_group_id.id
                          : false,
                      )[0].id).h - 60}
                      width={getDimension(getGroupedTabs(
                        tc[0].ks_hx_group_id && tc[0].ks_hx_group_id.id
                          ? tc[0].ks_hx_group_id.id
                          : false,
                      )[0].id).w}
                      isIot={isIot}
                      dashboardUuid={dashboardUuid}
                      dashboardCode={dashboardCode}
                      advanceFilter={advanceFilter}
                      dateFilters={dateFilters}
                    />
                    )}
                    {(dl1.ks_dashboard_item_type === 'ks_line_chart' || dl1.ks_dashboard_item_type === 'ks_area_chart') && (
                    <LineAreaChart
                      code={code}
                      selectedDateTag={selectedDateTag}
                      dashboardColors={dashboardColors}
                      chartData={dl1}
                      height={getDimension(getGroupedTabs(
                        tc[0].ks_hx_group_id && tc[0].ks_hx_group_id.id
                          ? tc[0].ks_hx_group_id.id
                          : false,
                      )[0].id).h - 60}
                      width={getDimension(getGroupedTabs(
                        tc[0].ks_hx_group_id && tc[0].ks_hx_group_id.id
                          ? tc[0].ks_hx_group_id.id
                          : false,
                      )[0].id).w}
                      isIot={isIot}
                      dashboardUuid={dashboardUuid}
                      dashboardCode={dashboardCode}
                      advanceFilter={advanceFilter}
                      dateFilters={dateFilters}
                    />
                    )}
                  </TabPanel>
                ))}
            </div>
          ))}
    </ResponsiveReactGridLayout>
  );
});

export default ChartCardsIOT;