/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import {
  Col, Row, UncontrolledTooltip,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import * as PropTypes from 'prop-types';

import filterIcon from '@images/filter.png';
import {
  getPreventiveFilter,
} from './ppmService';
import SideFilters from './sidebar/sideFiltersViewer';
import Calendar from './calendarSchedule';
import { updateHeaderData } from '../core/header/actions';
import { getActiveTab, getHeaderTabs, getTabs, getDynamicTabs } from '../util/appUtils';
import PPMSideNav from "./navbar/navlist.json";

const PreventiveViewer = (props) => {
  const { type } = props;
  const subMenu = 'Viewer';
  const dispatch = useDispatch();
  const [statusValue] = useState(0);
  const [categoryValue] = useState(0);
  const [preventiveByValue] = useState(0);
  const [priorityValue] = useState(0);
  const [collapse, setCollapse] = useState(false);
  const { userInfo ,userRoles} = useSelector((state) => state.user);

  useEffect(() => {
    const scheduleValues = [];
    const ppmByValue = [];
    const categoryValues = [];
    const priorityValues = [];
    const teamValues = [];
    const typeValues = [];
    const filterList = [];
    const payload = {
      states: scheduleValues, preventiveBy: ppmByValue, categories: categoryValues, priorities: priorityValues, types: typeValues, teams: teamValues, customFilters: filterList,
    };
    dispatch(getPreventiveFilter(payload));
  }, []);

  const isInspection = !!(type && type === 'Inspection');

  const headerTabs = getHeaderTabs(
    userRoles?.data?.allowed_modules,
    "52 Week PPM"
  );

  let activeTab;
  let tabs;

  if (headerTabs) {
    const tabsDef = getTabs(headerTabs[0].menu, PPMSideNav.data);
    let dynamicList = headerTabs[0].menu.filter((item) => !(PPMSideNav && PPMSideNav.data && PPMSideNav.data[item.name]) && item.name !== 'Help');
    dynamicList = getDynamicTabs(dynamicList, '/preventive-overview/dynamic-report');
    const tabsList = [...tabsDef, ...dynamicList];
    tabs = [...new Map(tabsList.map((item) => [item.name, item])).values()];
    activeTab = getActiveTab(
      tabs.filter((e) => e),
      "PPM Viewer"
    );
  }
  useEffect(() => {
    dispatch(
      updateHeaderData({
        module: "52 Week PPM",
        moduleName: "52 Week PPM",
        menuName: "PPM Viewer",
        link: "/preventive-overview/preventive-calendar",
        headerTabs: tabs.filter((e) => e),
        activeTab,
      })
    );
  }, [activeTab]);

  return (
    <Row className="ml-1 mr-1 mt-2 mb-2 p-3 border">
      <Col sm="12" md="12" lg="12" xs="12">
        <Row>
          <Col md="12" sm="12" lg={collapse ? 1 : 3} xs="12" className="mt-2">
            {collapse ? (
              <>
                <img src={filterIcon} height="30px" aria-hidden="true" width="30px" alt="filters" onClick={() => setCollapse(!collapse)} className="cursor-pointer" id="filters" />
                <UncontrolledTooltip target="filters" placement="right">
                  Filters
                </UncontrolledTooltip>
              </>
            ) : (
              <SideFilters
                scheduleValue={statusValue}
                preventiveByValue={preventiveByValue}
                categoryValue={categoryValue}
                priorityValue={priorityValue}
                setCollapse={setCollapse}
                collapse={collapse}
                isInspection={isInspection}
              />
            )}
          </Col>
          <Col md="12" sm="12" lg={collapse ? 11 : 9} xs="12" className={collapse ? 'filter-margin-left mt-2 calender-page' : 'calender-page mt-2'}>
            <Calendar isInspection={isInspection} collapse={collapse} userInfo={userInfo} />
          </Col>
        </Row>
      </Col>
    </Row>

  );
};

PreventiveViewer.propTypes = {
  type: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
};
PreventiveViewer.defaultProps = {
  type: false,
};

export default PreventiveViewer;
