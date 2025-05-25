/* eslint-disable import/no-unresolved */
// src/Flow.js
/* eslint-disable react/prop-types */
import React, {
  useState, useEffect, useMemo, useCallback,
} from 'react';
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
import CustomNode from './CustomNode';
import RenderGroupNode from './groupNodes';
import GroupNode from './groupNode';

import { getSldData, storeSldData } from '../../analytics/analytics.service';
import { getEnergyMeters } from '../../helpdesk/ticketService';
import DashboardIOTView from '../../apexDashboards/assetsDashboard/dashboardIOTView';
import Energy from '../Energy/Energy';
import Water from '../Water/water';

const nodeTypes = {
  custom: CustomNode,
  energyMeters: GroupNode,
};

const SldDynamic = ({
  uuid, code, label, isExternal, type,
}) => {
  const { userInfo } = useSelector((state) => state.user);
  const { pinEnableData } = useSelector((state) => state.auth);
  const { sldInfo, sldRouteData } = useSelector((state) => state.analytics);

  // Helper Functions
  const filterLines = (lines, key) => lines
    && lines.length
    && lines.filter((line) => line.key === key.toString());

  const getNodeEdgeData = (nodes, edges, index) => ({
    finalNodes: nodes[index]?.value || [],
    finalEdges: edges[index]?.value || [],
  });

  const dispatch = useDispatch();

  const path = window.location.search.split('?')[1];

  useEffect(() => {
    dispatch(storeSldData({}));
  }, []);

  useEffect(() => {
    if (code && userInfo && userInfo.data) {
      if (
        userInfo.data.main_company
        && userInfo.data.main_company.category
        && userInfo.data.main_company.category.name
        && userInfo.data.main_company.category.name.toLowerCase() === 'company'
      ) {
        dispatch(getSldData(code));
      } else {
        dispatch(getSldData(code));
      }
    }
  }, [code, userInfo]);

  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  useMemo(() => {
    if (uuid && sldInfo?.data?.length) {
      const energyMeterIds = [];
      const energyMetersIds = [];
      const mainMeterIds = [];

      const nodes1 = filterLines(sldInfo.data[0].lines, 'Nodes');
      const edges1 = filterLines(sldInfo.data[0].lines, 'Edges');
      let { finalNodes, finalEdges } = getNodeEdgeData(nodes1, edges1, 0);

      // Define path-based logic to set specific nodes/edges
      if (path) {
        const pathIndex = {
          4: 0,
          5: 1,
          6: 2,
          m4: 0,
          m5: 1,
          f2: 0,
        }[path.toString()];
        ({ finalNodes, finalEdges } = getNodeEdgeData(
          nodes1,
          edges1,
          pathIndex,
        ));
      }

      const dataNodes = JSON.parse(finalNodes || '[]');

      // Loop through nodes and extract IDs
      dataNodes.forEach((node) => {
        if (node.data.energyMeter?.id) {
          energyMeterIds.push(node.data.energyMeter.id);
        }
        if (node.data.energyMeters) {
          energyMetersIds.push(
            ...node.data.energyMeters.map((meter) => meter.id),
          );
        }
        if (node.data.mainEnergyMeter) {
          mainMeterIds.push(
            ...node.data.mainEnergyMeter.map((meter) => meter.id),
          );
        }
      });

      // Combine both arrays and remove duplicates
      const allUniqueIds = [
        ...new Set([...energyMeterIds, ...energyMetersIds, ...mainMeterIds]),
      ];

      dispatch(
        getEnergyMeters('dw.inactive_reading_report', uuid, allUniqueIds),
      );
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
    if (!sldInfo?.data?.length) return;

    const nodes1 = filterLines(sldInfo.data[0].lines, 'Nodes');
    const edges1 = filterLines(sldInfo.data[0].lines, 'Edges');

    let index = 0;
    if (path) {
      const pathMap = {
        4: 0,
        5: 1,
        6: 2,
        m4: 0,
        m5: 1,
        f2: 0,
      };
      index = pathMap[path.toString()] ?? 0;
    }

    const { finalNodes, finalEdges } = getNodeEdgeData(nodes1, edges1, index);

    try {
      let parsedNodes = JSON.parse(finalNodes || '[]');
      let parsedEdges = JSON.parse(finalEdges || '[]');

      parsedNodes = parsedNodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          buttonMode: true, // or your own logic here
        },
      }));

      parsedEdges = parsedEdges.map((edge) => ({
        ...edge,
        markerEnd: {
          ...(edge.markerEnd || {}),
          type: MarkerType.ArrowClosed,
        },
      }));

      console.log(parsedNodes);

      setNodes(parsedNodes);
      setEdges(parsedEdges);
    } catch (err) {
      console.error('Error parsing nodes or edges:', err);
      setNodes([]);
      setEdges([]);
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
      {label && !(sldRouteData && sldRouteData.id && sldRouteData.name) && (
      <p className="p-2 font-family-tab font-weight-800">{label}</p>
      )}
      {!(sldRouteData && sldRouteData.id && sldRouteData.name) && sldInfo && !sldInfo.loading && (
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

            {nodes
              .filter((node) => node.type === 'group')
              .map((node) => (
                <RenderGroupNode key={node.id} node={node} nodes={nodes} />
              ))}
          </ReactFlowProvider>
          )}

          {sldInfo
          && !sldInfo.loading
          && (!(sldInfo && sldInfo.data && sldInfo.data.length > 0)
            || (sldInfo && sldInfo.err)) && (
            <ErrorContent errorTxt="Please Contact Admin" />
          )}
        </div>
      )}
      {!isExternal && (sldRouteData && sldRouteData.id && sldRouteData.name) && code && uuid && (
      <DashboardIOTView
        dashboardCode={code.replace(/v3/i, '')}
        dashboardUuid={uuid}
        meterName={sldRouteData.name}
        isSLD
        isSLDButton
        advanceFilter={sldRouteData.id ? `[('device_id','=','${sldRouteData.id}')]` : false}
      />
      )}
      {isExternal && (sldRouteData && sldRouteData.id && sldRouteData.name) && code && uuid && type && type === 'energy' && (
      <Energy headerText={label} showBackButton onBackButtonClick={() => dispatch(storeSldData({}))} uuid={uuid} code="ENERGYV3" equipmentId={sldRouteData.id} />
      )}
      {isExternal && (sldRouteData && sldRouteData.id && sldRouteData.name) && code && uuid && type && type === 'water' && (
        <Water headerText={label} showBackButton onBackButtonClick={() => dispatch(storeSldData({}))} uuid={uuid} code="WATERV3" equipmentId={sldRouteData.id} />
      )}
    </div>
  );
};

export default SldDynamic;
