import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as PropTypes from 'prop-types';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';

import { Tooltip } from 'antd';

import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import TreeItem from '@material-ui/lab/TreeItem';
import Avatar from '@mui/material/Avatar';

import {
  Col,
  Row,
} from 'reactstrap';

import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@mui/material/Drawer';

import Loader from '@shared/loading';
import ErrorContent from '@shared/errorContent';

import { returnThemeColor } from '../themes/theme';

import DrawerHeader from '../commonComponents/drawerHeader';

import DashboardDrillView from '../apexDashboards/assetsDashboard/dashboardDrillView';
// import DashboardIOTView from '../apexDashboards/assetsDashboard/dashboardIOTView';

import {
  getAssetDetail,
  getSpaceData,
} from '../assets/equipmentService';

import AssetDetails from '../assets/assetDetailsView/assetDetails';
import LocationDetail from '../assets/locationDetails/locationDetail';

import {
  getJsonString,
  isJsonString,
} from '../util/appUtils';
import {
  resetNinjaExpandCode,
  getNinjaCodeExpand,
  getNinjaDashboardDrill,
  getTreeDashboard,
} from '../analytics/analytics.service';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  root1: {
    '&:checked': {
      backGround: '#3a4354',
    },
  },
  label: {
    fontSize: '13px',
    // borderTopRightRadius: theme.spacing(2),
    // borderBottomRightRadius: theme.spacing(2),
    width: 'auto',
    fontFamily: 'Suisse Intl',
  },
  selectedLabel: {
    height: '35px',
    fontSize: '13px',
    fontFamily: 'Suisse Intl',
    // borderTopRightRadius: theme.spacing(2),
    // borderBottomRightRadius: theme.spacing(2),
  },
  labelRoot: {
    // display: 'flex',
    alignItems: 'center',
    height: 'inherit',
    padding: theme.spacing(1),
    // backgroundColor: '#fff',
  },
  selectedLabelRoot: {
    alignItems: 'center',
    padding: theme.spacing(1),
    backgroundColor: returnThemeColor(),
    color: 'white',
    // borderLeft: '3px solid #979ca6',
    // borderTopRightRadius: theme.spacing(2),
    // borderBottomRightRadius: theme.spacing(2),
  },
  expanded: {
    display: 'block',
  },
  expandedHide: {
    display: 'none',
  },
  statusMsg: {
    fontSize: '10px',
  },
}));

const appModels = require('../util/appModels').default;

const DashboardDrill = React.memo((props) => {
  const {
    dashboardUuid, code,
  } = props;
  const dispatch = useDispatch();
  const classes = useStyles();

  const { ninjaDashboardExpandCode, treeDashboardInfo } = useSelector((state) => state.analytics);
  const { userInfo } = useSelector((state) => state.user);

  const [expanded, setExpanded] = useState(['root']);
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [selectedTreeChild, setSelectedTreeChild] = useState({});
  const [selectedData, setSelectedData] = useState(false);
  const [selectedInlineData, setSelectedInlineData] = useState(false);
  const [viewLink, setViewLink] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [treeData, setTreeData] = useState([]);
  const [treeConfig, setTreeConfig] = useState(false);

  const timeZone = userInfo.data
  && userInfo.data.timezone ? userInfo.data.timezone : false;

  const userCompany = userInfo.data
  && userInfo.data.company ? userInfo.data.company : false;

  useEffect(() => {
    if (userInfo && userInfo.data && userInfo.data.company && userInfo.data.company.id) {
      dispatch(getTreeDashboard(userInfo.data.company.id, code));
    }
  }, [userInfo, code]);

  useEffect(() => {
    if (treeDashboardInfo && treeDashboardInfo.data && treeDashboardInfo.data.length && treeDashboardInfo.data[0].dashboard_json && isJsonString(treeDashboardInfo.data[0].dashboard_json) && getJsonString(treeDashboardInfo.data[0].dashboard_json)) {
      setTreeData(getJsonString(treeDashboardInfo.data[0].dashboard_json));
    }
    if (treeDashboardInfo && treeDashboardInfo.data && treeDashboardInfo.data.length && treeDashboardInfo.data[0].config_json && isJsonString(treeDashboardInfo.data[0].config_json) && getJsonString(treeDashboardInfo.data[0].config_json)) {
      setTreeConfig(getJsonString(treeDashboardInfo.data[0].config_json));
    }
  }, [treeDashboardInfo]);

  const fetchChildObjects = (node) => {
    if (node.source === '12' && node.dashboard_code && node.show === 'dashboard') {
      dispatch(resetNinjaExpandCode());
      dispatch(getNinjaCodeExpand(node.dashboard_code, appModels.NINJABOARD));
    } else if (node.source === '16' && node.dashboard_code && node.show === 'dashboard') {
      const context = { tz: timeZone };
      if (node.domain) {
        context.ksDomain = node.domain;
      }

      dispatch(
        getNinjaDashboardDrill(
          'ks_fetch_dashboard_data',
          appModels.NINJABOARD,
          node.dashboard_code,
          context,
          'IOT',
          node.dashboard_code,
          dashboardUuid,
          userCompany,
        ),
      );
    }
    if (node.target === 'drawer') {
      setSelectedData(node);
      setViewLink(true);
    } else {
      setSelectedInlineData(node);
    }

    if (node.show === 'equipment' && node.equipment_id) {
      dispatch(getAssetDetail(node.equipment_id, appModels.EQUIPMENT, false, node.target, node.equipment_id));
    } else if (node.show === 'space' && node.space_id) {
      dispatch(getSpaceData(appModels.SPACE, node.space_id, false, node.target, node.space_id));
    }
    setSelectedTreeChild(node.id);
    setSelectedNodes([node.id]);
    if (node.children && !node.children.length) {
      setExpanded(expanded.filter((item) => item !== node.id));
    }
  };

  const fetchChildObjectsData = (node) => {
    setTimeout(() => {
      setExpanded(expanded.filter((item) => item !== node.id));
    }, 40);
    if (node.source === '12' && node.dashboard_code && node.show === 'dashboard') {
      dispatch(resetNinjaExpandCode());
      dispatch(getNinjaCodeExpand(node.dashboard_code, appModels.NINJABOARD));
    } else if (node.source === '16' && node.dashboard_code && node.show === 'dashboard') {
      const context = { tz: timeZone };
      if (node.domain) {
        context.ksDomain = node.domain;
      }

      dispatch(
        getNinjaDashboardDrill(
          'ks_fetch_dashboard_data',
          appModels.NINJABOARD,
          node.dashboard_code,
          context,
          'IOT',
          node.dashboard_code,
          dashboardUuid,
          userCompany,
        ),
      );
    }
    if (node.target === 'drawer') {
      setSelectedData(node);
      setViewLink(true);
    } else {
      setSelectedInlineData(node);
    }

    if (node.show === 'equipment' && node.equipment_id) {
      dispatch(getAssetDetail(node.equipment_id, appModels.EQUIPMENT, false, node.target, node.equipment_id));
    } else if (node.show === 'space' && node.space_id) {
      dispatch(getSpaceData(appModels.SPACE, node.space_id, false, node.target, node.space_id));
    }
    setSelectedTreeChild(node.id);
    setSelectedNodes([node.id]);
  };

  useMemo(() => {
    if (treeData && treeData.length) {
      fetchChildObjects(treeData[0]);
      setExpanded(['root', `${treeData[0].id}`]);
    }
  }, [treeData]);

  const closeDrawer = () => {
    if (selectedInlineData && selectedInlineData.id) {
      if (selectedInlineData.source === '12' && selectedInlineData.dashboard_code && selectedInlineData.show === 'dashboard') {
        dispatch(resetNinjaExpandCode());
        dispatch(getNinjaCodeExpand(selectedInlineData.dashboard_code, appModels.NINJABOARD));
      } else if (selectedInlineData.source === '16' && selectedInlineData.dashboard_code && selectedInlineData.show === 'dashboard') {
        const context = { tz: timeZone };
        if (selectedInlineData.domain) {
          context.ksDomain = selectedInlineData.domain;
        }

        dispatch(
          getNinjaDashboardDrill(
            'ks_fetch_dashboard_data',
            appModels.NINJABOARD,
            selectedInlineData.dashboard_code,
            context,
            'IOT',
            selectedInlineData.dashboard_code,
            dashboardUuid,
            userCompany,
          ),
        );
      }

      if (selectedInlineData.show === 'equipment' && selectedInlineData.equipment_id) {
        dispatch(getAssetDetail(selectedInlineData.equipment_id, appModels.EQUIPMENT, false, selectedInlineData.target, selectedInlineData.equipment_id));
      } else if (selectedInlineData.show === 'space' && selectedInlineData.space_id) {
        dispatch(getSpaceData(appModels.SPACE, selectedInlineData.space_id, false, selectedInlineData.target, selectedInlineData.space_id));
      }
    }
    setViewLink(false);
  };

  const fetchChildObjectsSave = (node) => {
    setSelectedTreeChild(node.id);
    setSelectedNodes([node.id]);
    if (node.children && !node.children.length) {
      setExpanded(expanded.filter((item) => item !== node.id));
    }
  };

  const label = (node) => (
    <div
      className={
        (node && selectedTreeChild === node.id)
          ? classes.selectedLabelRoot : classes.labelRoot
      }
    >
      <Row className="content-base" style={{ flexWrap: 'nowrap', whiteSpace: 'nowrap' }}>
        {node.avatar && (
        <Col
          sm={1}
          xs={1}
          md={1}
          lg={1}
          className="pl-3"
          onClick={() => (node.show !== 'none' && node.children && node.children.length ? fetchChildObjectsSave(node) : fetchChildObjects(node))}
        >
          {node.avatar_information ? (
            <Tooltip placement="left" title={node.avatar_information}>
              <Avatar
                sx={(theme) => ({
                  background: node && selectedTreeChild === node.id ? 'white' : theme.palette.primary.main,
                  color: node && selectedTreeChild === node.id ? 'black' : 'white',
                  width: 24,
                  height: 24,
                  fontSize: '0.8rem',
                })}
              >
                {node.avatar}
              </Avatar>
            </Tooltip>
          ) : (
            <Avatar
              sx={(theme) => ({
                background: node && selectedTreeChild === node.id ? 'white' : theme.palette.primary.main,
                color: node && selectedTreeChild === node.id ? 'black' : 'white',
                width: 24,
                height: 24,
                fontSize: '0.8rem',
              })}
            >
              {node.avatar}
            </Avatar>
          )}
        </Col>
        )}
        {node.show !== 'none' ? (

          <Col
            sm={node.avatar ? 11 : 12}
            xs={node.avatar ? 11 : 12}
            md={node.avatar ? 11 : 12}
            lg={node.avatar ? 11 : 12}
            className={node.label && node.label.length > 25 ? 'pl-09-left' : ''}
          >
            {node.children && node.children.length ? (
              <>
                <Tooltip placement="top" title={node.label}>
                  <span aria-hidden className="font-weight-700" onClick={() => fetchChildObjectsSave(node)}>
                    {node.label}
                    {' '}
                  </span>
                </Tooltip>
                <Tooltip placement="right" title={`Click the icon to view the ${node.show}`}>
                  <span aria-hidden className="ml-2" onClick={() => fetchChildObjectsData(node)}>
                    {node.show && node.show === 'dashboard' && (
                    <LeaderboardIcon
                      sx={(theme) => ({
                        color: node && selectedTreeChild === node.id ? 'white' : theme.palette.primary.main,
                      })}
                      fontSize="small"
                    />
                    )}
                    {node.show && node.show === 'equipment' && (
                    <InventoryIcon
                      sx={(theme) => ({
                        color: node && selectedTreeChild === node.id ? 'white' : theme.palette.primary.main,
                      })}
                      fontSize="small"
                    />
                    )}
                    {node.show && node.show === 'space' && (
                    <MeetingRoomIcon
                      sx={(theme) => ({
                        color: node && selectedTreeChild === node.id ? 'white' : theme.palette.primary.main,
                      })}
                      fontSize="small"
                    />
                    )}
                  </span>
                </Tooltip>

              </>
            ) : (
              <>
                <Tooltip placement="top" title={node.label}>
                  <span aria-hidden className="font-weight-700" onClick={() => fetchChildObjects(node)}>
                    {node.label}
                    {' '}
                  </span>
                </Tooltip>
                <Tooltip placement="right" title={`Click the icon to view the ${node.show}`}>
                  <span aria-hidden className="ml-2" onClick={() => fetchChildObjectsData(node)}>
                    {node.show && node.show === 'dashboard' && (
                    <LeaderboardIcon
                      sx={(theme) => ({
                        color: node && selectedTreeChild === node.id ? 'white' : theme.palette.primary.main,
                      })}
                      fontSize="small"
                    />
                    )}
                    {node.show && node.show === 'equipment' && (
                    <InventoryIcon
                      sx={(theme) => ({
                        color: node && selectedTreeChild === node.id ? 'white' : theme.palette.primary.main,
                      })}
                      fontSize="small"
                    />
                    )}
                    {node.show && node.show === 'space' && (
                    <MeetingRoomIcon
                      sx={(theme) => ({
                        color: node && selectedTreeChild === node.id ? 'white' : theme.palette.primary.main,
                      })}
                      fontSize="small"
                    />
                    )}
                  </span>
                </Tooltip>
              </>
            )}
          </Col>

        ) : (
          <Col
            sm={node.avatar ? 10 : 12}
            xs={node.avatar ? 10 : 12}
            md={node.avatar ? 10 : 12}
            lg={node.avatar ? 10 : 12}
            className="occupancy"
            onClick={() => fetchChildObjects(node)}
          >
            <Tooltip placement="right" title={node.label}>
              <span className="font-weight-700">
                {node.label}
                {' '}
              </span>
            </Tooltip>
          </Col>
        )}
      </Row>
    </div>
  );

  const handleChange = (event, nodes) => {
    setExpanded(nodes);
  };

  const renderTreeChild = (nodes) => (
    nodes && nodes.map((node) => (
      <TreeItem
        classes={{
          label: selectedNodes.includes(node.id)
          && node.children && !node.children.length
            ? classes.selectedLabel
            : classes.label,
          expanded: node.children && node.children.length ? classes.expanded : classes.expandedHide,
        }}
        key={node.id}
        nodeId={`${node.id}`}
        label={label(node)}
        expandIcon={node.children && node.children.length ? <ChevronRightIcon /> : <span />}
        // onClick={!node.err ? () => fetchChildObjects(node) : undefined}
      >
        {node.children && (
          <>
            {Array.isArray(node.children) && node.children && node.children.length ? renderTreeChild(node.children) : null}
          </>
        )}
      </TreeItem>
    ))
  );

  return (
    <>
      <Divider />
      <div className="insights-box">
        {treeDashboardInfo && treeDashboardInfo.data && !treeDashboardInfo.loading && (
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            marginBottom: '10px',
            padding: '7px',
            fontFamily: 'Suisse Intl',
          }}
        >

          <div
            style={{ width: '20%', overflow: 'auto' }}
            className="hv-80 tree-card"

          >
            <Box sx={{ p: 1 }}>
              <h6
                className="line-chart-text mb-2 font-family-tab"
              >
                {treeConfig && treeConfig.title ? treeConfig.title : ''}
              </h6>
              {' '}
              <TreeView
                className={classes.root}
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpanded={['root']}
                defaultExpandIcon={<ChevronRightIcon />}
                onNodeToggle={handleChange}
                expanded={expanded}
              >
                {renderTreeChild(treeData)}
              </TreeView>
            </Box>
          </div>
          <div
            style={{ width: '0.5%' }}
          />
          <div
            style={{ width: '79.5%', overflow: 'auto' }}
            className="hv-80 tree-card"
          >
            {selectedInlineData && selectedInlineData.target === 'inline' && (
              <Box sx={{ p: 1 }}>
                {selectedInlineData && selectedInlineData.id && selectedInlineData.show === 'dashboard' && (
                <>
                  {!selectedInlineData.dashboard_code && <ErrorContent errorTxt="Please Contact Admin" showRetry />}
                  {selectedInlineData.source === '12' && selectedInlineData.dashboard_code && (
                  <>
                    {ninjaDashboardExpandCode
                       && ninjaDashboardExpandCode.data
                       && ninjaDashboardExpandCode.data.length > 0 && (
                         <DashboardDrillView
                           code={ninjaDashboardExpandCode.data[0].id}
                           defaultDate={
                            ninjaDashboardExpandCode.data[0].ks_date_filter_selection
                           }
                           dashboardInterval={ninjaDashboardExpandCode.data[0].ks_set_interval}
                           dashboardLayouts={ninjaDashboardExpandCode.data[0].dashboard_json}
                           dashboardColors={
                            ninjaDashboardExpandCode.data[0].ks_dashboard_items_ids
                           }
                           advanceFilter={selectedInlineData.domain ? selectedInlineData.domain : false}
                           hideExpand
                         />
                    )}
                    {ninjaDashboardExpandCode && ninjaDashboardExpandCode.loading && (
                    <div className="margin-top-250px text-center">
                      <Loader />
                    </div>
                    )}
                    {ninjaDashboardExpandCode
                       && ((ninjaDashboardExpandCode.data
                         && ninjaDashboardExpandCode.data.length === 0)
                         || ninjaDashboardExpandCode.err) && (
                         <ErrorContent errorTxt="No Data Found" showRetry />
                    )}
                  </>
                  )}
                  {selectedInlineData.source === '16' && selectedInlineData.dashboard_code && (
                  <DashboardDrillView
                    dashboardCode={selectedInlineData.dashboard_code}
                    dashboardUuid={dashboardUuid}
                    meterName={selectedInlineData && selectedInlineData.label ? selectedInlineData.label : ''}
                    advanceFilter={selectedInlineData.domain ? selectedInlineData.domain : false}
                    hideExpand
                    isIot
                  />
                  )}
                </>
                )}
                {selectedInlineData && selectedInlineData.id && selectedInlineData.show === 'equipment' && (
                <AssetDetails isEdit={false} afterUpdate={false} setViewModal={setViewModal} viewModal={viewModal} isITAsset={false} categoryType={false} />
                )}
                {selectedInlineData && selectedInlineData.id && selectedInlineData.show === 'space' && (
                <LocationDetail />
                )}
                {selectedInlineData && selectedInlineData.id && selectedInlineData.show === 'none' && (
                <div className="font-family-tab second-div-center">
                  {selectedInlineData.no_information ? selectedInlineData.no_information : ''}
                </div>
                )}
              </Box>
            )}
            {!selectedInlineData && treeConfig && treeConfig.default_text && (
            <Box sx={{ p: 1 }}>
              <div className="font-family-tab second-div-center">
                {treeConfig.default_text}
              </div>
            </Box>
            )}
          </div>
        </Box>
        )}
        {treeDashboardInfo && treeDashboardInfo.loading && (
          <div className="p-5 text-center">
            <Loader />
          </div>
        )}
        {treeDashboardInfo && treeDashboardInfo.err && (
        <div className="text-center">
          <ErrorContent errorTxt="No Data Found" showRetry />
        </div>
        )}
        <Drawer
          PaperProps={{
            sx: { width: '95%' },
          }}
          anchor="right"
          open={viewLink}
        >
          <DrawerHeader
            headerName={selectedData && selectedData.name ? selectedData.name : ''}
            onClose={() => closeDrawer()}
          />
          {selectedData && selectedData.id && selectedData.show === 'dashboard' && (
          <>
            {!selectedData.dashboard_code && <ErrorContent errorTxt="Please Contact Admin" showRetry />}
            {selectedData.source === '12' && selectedData.dashboard_code && (
            <>
              {ninjaDashboardExpandCode
                       && ninjaDashboardExpandCode.data
                       && ninjaDashboardExpandCode.data.length > 0 && (
                         <DashboardDrillView
                           code={ninjaDashboardExpandCode.data[0].id}
                           defaultDate={
                            ninjaDashboardExpandCode.data[0].ks_date_filter_selection
                           }
                           dashboardInterval={ninjaDashboardExpandCode.data[0].ks_set_interval}
                           dashboardLayouts={ninjaDashboardExpandCode.data[0].dashboard_json}
                           dashboardColors={
                            ninjaDashboardExpandCode.data[0].ks_dashboard_items_ids
                           }
                           advanceFilter={selectedData.domain ? selectedData.domain : false}
                           hideExpand
                         />
              )}
              {ninjaDashboardExpandCode && ninjaDashboardExpandCode.loading && (
              <div className="margin-top-250px">
                <Loader />
              </div>
              )}
              {ninjaDashboardExpandCode
                       && ((ninjaDashboardExpandCode.data
                         && ninjaDashboardExpandCode.data.length === 0)
                         || ninjaDashboardExpandCode.err) && (
                         <ErrorContent errorTxt="No Data Found" showRetry />
              )}
            </>
            )}
            {selectedData.source === '16' && selectedData.dashboard_code && (
            <DashboardDrillView
              dashboardCode={selectedData.dashboard_code}
              dashboardUuid={dashboardUuid}
              advanceFilter={selectedData.domain ? selectedData.domain : false}
              hideExpand
              isIot
            />
            )}
          </>
          )}
          {selectedData && selectedData.id && selectedData.show === 'equipment' && (
          <AssetDetails isEdit={false} afterUpdate={false} setViewModal={setViewModal} viewModal={viewModal} isITAsset={false} categoryType={false} />
          )}
          {selectedData && selectedData.id && selectedData.show === 'space' && (
          <LocationDetail />
          )}
        </Drawer>
      </div>
    </>
  );
});

DashboardDrill.propTypes = {
  dashboardUuid: PropTypes.string.isRequired,
};
export default DashboardDrill;
