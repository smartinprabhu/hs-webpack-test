/* eslint-disable no-restricted-globals */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Col,
  Row,
} from 'reactstrap';
import Card from '@mui/material/Card';
import { Box } from '@mui/system';
import * as Icons from '@fortawesome/free-solid-svg-icons';
import * as Icons1 from '@fortawesome/free-regular-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import ErrorContent from '@shared/errorContent';
import Loader from '@shared/loading';

import DashboardIOTView from '../apexDashboards/assetsDashboard/dashboardIOTView';
import LoginBackground from '../commonComponents/loginBackground';

import {
  getSequencedMenuItems, getAllCompaniesCxo, generateErrorMessage, getHeaderTabs, getTabs, getDynamicTabs, getActiveTab, isJsonString, getJsonString,
} from '../util/appUtils';
import wasteSideNav from './navbar/navlist.json';
import { updateHeaderData } from '../core/header/actions';
import { LoginBackGroudClass } from '../themes/theme';
import {
  resetDefaultFilterInfo,
  resetNinjaDashboard,
} from '../analytics/analytics.service';

import { getCxoConfig, getCxoSections } from '../helpdesk/ticketService';
import { updateDashboardData } from '../helpdesk/actions';

const iconList = Object.keys(Icons)
  .filter((key) => key !== 'fas' && key !== 'prefix')
  .map((icon) => Icons[icon]);

const iconList1 = Object.keys(Icons1)
  .filter((key) => key !== 'far' && key !== 'prefix')
  .map((icon) => Icons1[icon]);

library.add(...iconList);
library.add(...iconList1);

const Summary = () => {
  const dispatch = useDispatch();

  const subMenu = 'Summary';
  const module = 'CXO Analytics';
  const { userRoles, userInfo } = useSelector((state) => state.user);

  const companies = getAllCompaniesCxo(userInfo);

  const { cxoConfig, cxoSections, cxoDashboardLevels } = useSelector((state) => state.ticket);

  const [dashboardCode, setDashboardCode] = useState('');

  const [dashboardName, setDashboardName] = useState('');

  const userCompanyId = userInfo && userInfo.data && userInfo.data.company ? userInfo.data.company.id : '';
  const userParentId = userInfo && userInfo.data && userInfo.data.company.parent_id ? userInfo.data.company.parent_id.id : '';

  const getmenus = getSequencedMenuItems(userRoles && userRoles.data ? userRoles.data.allowed_modules : [], module, 'name');
  let menuItem = '';
  if (getmenus && getmenus.length) {
    menuItem = getmenus.find((menu) => menu.name.toLowerCase() === subMenu.toLowerCase());
  }

  const headerTabs = getHeaderTabs(userRoles?.data?.allowed_modules, module);

  let activeTab;
  let tabs;

  if (headerTabs) {
    tabs = getTabs(headerTabs[0].menu, wasteSideNav.data);
    const tabsDef = getTabs(headerTabs[0].menu, wasteSideNav.data);
    let dynamicList = headerTabs[0].menu.filter((item) => !(wasteSideNav && wasteSideNav.data && wasteSideNav.data[item.name]) && item.name !== 'Help');
    dynamicList = getDynamicTabs(dynamicList, '/cxo/dynamic-report');
    const tabsList = [...tabsDef, ...dynamicList];
    tabs = [...new Map(tabsList.map((item) => [item.name, item])).values()];
    activeTab = getActiveTab(
      tabs.filter((e) => e),
      subMenu,
    );
  }

  useEffect(() => {
    dispatch(
      updateHeaderData({
        module,
        moduleName: module,
        menuName: '',
        link: '/cxo-summary',
        headerTabs: tabs.filter((e) => e),
        activeTab,
      }),
    );
  }, [activeTab]);

  useEffect(() => {
    if (menuItem && menuItem.uuid) {
      dispatch(getCxoConfig(userCompanyId, menuItem.uuid));
    }
  }, [userInfo, userRoles]);

  useEffect(() => {
    if (!dashboardCode) {
      dispatch(updateDashboardData([]));
    }
  }, [dashboardCode]);

  useEffect(() => {
    if (menuItem && menuItem.uuid) {
      const isParent = userInfo.data.company.is_parent;
      const domain = `["company_id.parent_id","=",${userCompanyId}]`;
      dispatch(getCxoSections(domain, menuItem.uuid));
    }
  }, [cxoConfig]);

  const headerText = cxoConfig && cxoConfig.data && cxoConfig.data.length && cxoConfig.data[0].options
  && isJsonString(cxoConfig.data[0].options) && getJsonString(cxoConfig.data[0].options) && getJsonString(cxoConfig.data[0].options).header_text ? getJsonString(cxoConfig.data[0].options).header_text : false;

  function isJsonValue(opt, field1, field2) {
    let res = false;
    if (opt && isJsonString(opt) && getJsonString(opt) && getJsonString(opt)[field1] && getJsonString(opt)[field1][field2]) {
      res = getJsonString(opt)[field1][field2];
    }
    return res;
  }

  console.log(cxoDashboardLevels);

  const onDashboardChange = (code, title) => {
    setDashboardName(title);
    dispatch(resetDefaultFilterInfo());
    dispatch(resetNinjaDashboard());
    setDashboardCode(code);
    dispatch(updateDashboardData([{ code, name: title }]));
  };

  const navigateLevel = (levels, code, isNavigate) => {
    if (isNavigate && isNavigate === 'Yes') {
      const res = [];
      for (let i = 0; i < levels; i += 1) {
        res.push(cxoDashboardLevels[i]);
      }
      dispatch(resetDefaultFilterInfo());
      dispatch(resetNinjaDashboard());
      setDashboardCode(code);
      dispatch(updateDashboardData(res));
    }
  };

  return (
    <>
      {!dashboardCode && !(cxoConfig && cxoConfig.err) && !((cxoConfig && cxoConfig.loading) || (cxoSections && cxoSections.loading)) && (

      <Box
        sx={LoginBackGroudClass({
          display: 'flex',
          top: '0px',
          left: '0px',
        })}
        className=""
      >
        <LoginBackground headerText={headerText} />
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              width: '100%',
            }}
          >
            <Row>
              <Col md={{ size: 8, offset: 3 }} sm="12" lg={{ size: 8, offset: 3 }} xs="12">
                <Row className="mt-3">
                  {cxoSections && cxoSections.data && cxoSections.data.map((tl) => (
                    <Col sm="12" md="6" xs="12" lg="6" className="mb-4">
                      <Card
                        style={isJsonValue(tl.options, 'card_style', 'bg-color') ? { background: `${isJsonValue(tl.options, 'card_style', 'bg-color')} 0% 0% no-repeat padding-box` } : {}}
                        className="ticket-card-mixed vertical-horizontal-center text-center p-4"
                        onClick={() => onDashboardChange(tl.dashboard_code, tl.name)}
                      >
                        <div style={isJsonValue(tl.options, 'card_style', 'border-color') ? {
                          border: `1px solid ${isJsonValue(tl.options, 'card_style', 'border-color')}`,
                          padding: '10px',
                          borderRadius: '10px',
                          backgroundColor: isJsonValue(tl.options, 'card_style', 'border-color'),
                        } : {}}
                        >
                          <FontAwesomeIcon
                            icon={tl.fav_icon}
                            className="fa-2x"
                            style={isJsonValue(tl.options, 'card_style', 'icon-color') ? { color: isJsonValue(tl.options, 'card_style', 'icon-color') } : {}}
                          />
                        </div>
                        <p
                          style={isJsonValue(tl.options, 'card_style', 'text_color') ? { color: isJsonValue(tl.options, 'card_style', 'text_color') } : {}}
                          className="mb-0 mt-3 font-weight-700"
                        >
                          {tl.name}
                        </p>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Col>
            </Row>
          </Box>
        </Box>
      </Box>
      )}
      {((cxoConfig && cxoConfig.loading) || (cxoSections && cxoSections.loading)) && (
        <div className="mt-4 text-center vertical-horizontal-center p-5" data-testid="loading-case">
          <Loader />
        </div>
      )}
      {(cxoConfig && cxoConfig.err) && (
        <div>
          <ErrorContent errorTxt={generateErrorMessage(cxoConfig)} />
        </div>
      )}
      {dashboardCode && menuItem && menuItem.uuid && (
      <DashboardIOTView
        dashboardCode={`${dashboardCode}`}
        dashboardUuid={menuItem.uuid}
        defaultFilter={false}
        setDashboardCode={setDashboardCode}
        navigateLevel={navigateLevel}
        dashboardTitle={dashboardName}
        isCxo
      />
      )}
    </>
  );
};
export default Summary;
