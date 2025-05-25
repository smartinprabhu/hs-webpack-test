/* eslint-disable import/no-unresolved */
// src/Flow.js
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  MarkerType,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  Controls,
} from 'react-flow-renderer';

import './style.css';

import ErrorContent from '@shared/errorContent';

import CustomNode from './customNode';
import RenderGroupNode from './groupNodes';
import GroupNode from './groupNode';

import {
  getSequencedMenuItems, getActiveTab, getHeaderTabs, getTabs, getDynamicTabs,
} from '../util/appUtils';
import {
  getSldData,
} from '../analytics/analytics.service';
import {
  getEnergyMeters,
} from '../helpdesk/ticketService';

import upsNav from './navbar/navlist.json';
import { updateHeaderData } from '../core/header/actions';
// import './Flow.css';

const nodeTypes = {
  custom: CustomNode,
  energyMeters: GroupNode,
};

const SldOverView = () => {
  const [menu, setMenu] = useState('');

  const { userInfo, userRoles } = useSelector((state) => state.user);
  const { pinEnableData } = useSelector((state) => state.auth);
  const { sldInfo } = useSelector(
    (state) => state.analytics,
  );

  // Helper Functions
  const filterLines = (lines, key) => lines && lines.length && lines.filter((line) => line.key === key.toString());

  const getNodeEdgeData = (nodes, edges, index) => ({
    finalNodes: nodes[index]?.value || [],
    finalEdges: edges[index]?.value || [],
  });

  const dispatch = useDispatch();

  const moduleId = userRoles?.data?.allowed_modules?.filter(
    (each) => each.name === 'Energy',
  )[0]?.id;

  useEffect(() => {
    const getmenus = getSequencedMenuItems(
      userRoles && userRoles.data ? userRoles.data.allowed_modules : [],
      'Energy',
      'name',
    );
    let sld = '';
    if (getmenus && getmenus.length) {
      sld = getmenus.find((menu) => menu.name.toLowerCase() === 'sld');
    }
    setMenu(sld || '');
  }, [userRoles]);

  const path = window.location.search.split('?')[1];

  useEffect(() => {
    if (menu && menu.is_sld && userInfo && userInfo.data) {
      if (userInfo.data.main_company && userInfo.data.main_company.category && userInfo.data.main_company.category.name && userInfo.data.main_company.category.name.toLowerCase() === 'company' && menu.company_dashboard_code) {
        dispatch(getSldData(menu.company_dashboard_code));
      } else {
        dispatch(getSldData(menu.dashboard_code));
      }
    }
  }, [menu, userInfo]);

  const headerTabs = getHeaderTabs(userRoles?.data?.allowed_modules, 'Energy');
  let activeTab;
  let tabs;

  if (headerTabs) {
    const tabsDef = getTabs(headerTabs[0].menu, upsNav.data);
    let dynamicList = headerTabs[0].menu.filter((item) => !(upsNav && upsNav.data && upsNav.data[item.name]) && item.name !== 'Help');
    dynamicList = getDynamicTabs(dynamicList, '/energy-overview/dynamic-report');
    const tabsList = [...tabsDef, ...dynamicList];
    tabs = [...new Map(tabsList.map((item) => [item.name, item])).values()];
    activeTab = getActiveTab(
      tabs.filter((e) => e),
      'SLD',
    );
  }

  useEffect(() => {
    dispatch(
      updateHeaderData({
        module: 'Energy',
        moduleName: 'Energy',
        menuName: 'SLD',
        link: `/energy-sld-overview#${moduleId}`,
        headerTabs: tabs.filter((e) => e),
        activeTab,
      }),
    );
  }, [activeTab]);

  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  useMemo(() => {
    if (menu && menu.is_sld && menu.uuid && sldInfo?.data?.length) {
      const energyMeterIds = [];
      const energyMetersIds = [];
      const mainMeterIds = [];

      const nodes1 = filterLines(sldInfo.data[0].lines, 'Nodes');
      const edges1 = filterLines(sldInfo.data[0].lines, 'Edges');
      let { finalNodes, finalEdges } = getNodeEdgeData(nodes1, edges1, 0);

      // Define path-based logic to set specific nodes/edges
      if (path) {
        const pathIndex = {
          4: 0, 5: 1, 6: 2, m4: 0, m5: 1, f2: 0,
        }[path.toString()];
        ({ finalNodes, finalEdges } = getNodeEdgeData(nodes1, edges1, pathIndex));
      }

      const dataNodes = JSON.parse(finalNodes || '[]');

      // Loop through nodes and extract IDs
      dataNodes.forEach((node) => {
        if (node.data.energyMeter?.id) {
          energyMeterIds.push(node.data.energyMeter.id);
        }
        if (node.data.energyMeters) {
          energyMetersIds.push(...node.data.energyMeters.map((meter) => meter.id));
        }
        if (node.data.mainEnergyMeter) {
          mainMeterIds.push(...node.data.mainEnergyMeter.map((meter) => meter.id));
        }
      });

      // Combine both arrays and remove duplicates
      const allUniqueIds = [...new Set([...energyMeterIds, ...energyMetersIds, ...mainMeterIds])];

      dispatch(getEnergyMeters('dw.inactive_reading_report', menu.uuid, allUniqueIds));
    }
  }, [JSON.stringify(sldInfo)]);


  const getFilteredValue = (value) => {
    const data = sldInfo.data
      && sldInfo.data.length
      && sldInfo.data[0].lines
      && sldInfo.data[0].lines.length
      && sldInfo.data[0].lines.filter((line) => line.key === value.toString());
    return data;
  };

  // Fetch and Set Nodes and Edges based on sldInfo
  useEffect(() => {
    if (sldInfo?.data?.length) {
      const nodes1 = filterLines(sldInfo.data[0].lines, 'Nodes');
      const edges1 = filterLines(sldInfo.data[0].lines, 'Edges');
      let { finalNodes, finalEdges } = getNodeEdgeData(nodes1, edges1, 0);

      // Define path-based logic to set specific nodes/edges
      if (path) {
        const pathIndex = {
          4: 0, 5: 1, 6: 2, m4: 0, m5: 1, f2: 0,
        }[path.toString()];
        ({ finalNodes, finalEdges } = getNodeEdgeData(nodes1, edges1, pathIndex));
      }

      if (finalEdges && finalEdges.length) {
        finalEdges = JSON.parse(finalEdges);
        finalEdges.map((edge) => {
          if (edge && edge.markerEnd && edge.markerEnd.type) {
            edge.markerEnd.type = MarkerType.ArrowClosed;
          }
        });
      }

      setNodes(JSON.parse(finalNodes || '[]'));
      setEdges(finalEdges);
    }
  }, [sldInfo, path]);

  // Reset Nodes and Edges on Path Change
  useEffect(() => {
    if (path) {
      setNodes([]);
      setEdges([]);
    }
  }, [path]);

  // React Flow Node/Edge Handlers
  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <div className={pinEnableData ? 'content-box-expand' : 'content-box'}>

      <div
        style={{
          height: '90vh',
          width: '90vw',
        }}
      >
        {nodes && nodes.length > 0 && (
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            className="bg-teal-50"
          >
            <Background />
            <Controls />
          </ReactFlow>

          {nodes.filter((node) => node.type === 'group').map((node) => (
            <RenderGroupNode key={node.id} node={node} nodes={nodes} />
          ))}
        </ReactFlowProvider>
        )}

        {(sldInfo && !sldInfo.loading) && (!(sldInfo && sldInfo.data && sldInfo.data.length > 0) || (sldInfo && sldInfo.err)) && (
        <ErrorContent errorTxt="Please Contact Admin" />
        )}
      </div>
    </div>
  );
};

export default SldOverView;
