import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Plot from 'react-plotly.js';
import { parseApiData, aggregateData } from './diagnostic_may1';

const EnergyPlot = ({ plotType, currentData, lastUpdated }) => {
  const getUpdatedPlotData = useCallback(() => {
    const { traces } = parseApiData(currentData);
    const allowedTraces = ['Actual_Consumption', 'Actual_Temp'];
    const uniqueTraces = [];
    const seenNames = new Set();

    traces.forEach((trace) => {
      if (allowedTraces.includes(trace.name) && !seenNames.has(trace.name)) {
        seenNames.add(trace.name);
        let updatedTrace = { ...trace };

        if (trace.name === 'Actual_Consumption' || trace.name === 'Actual_Temp') {
          updatedTrace = aggregateData(trace, plotType, lastUpdated);
        }

        uniqueTraces.push({
          ...updatedTrace,
          visible: true,
          line: {
            ...updatedTrace.line,
            color: updatedTrace.line?.color || '#2275e0',
          },
          marker: {
            ...updatedTrace.marker,
            color: updatedTrace.marker?.color || '#2275e0',
          },
          ...(trace.name === 'Actual_Temp' && { yaxis: 'y2' }),
        });
      }
    });

    return uniqueTraces;
  }, [currentData, plotType, lastUpdated]);

  const customLayout = useMemo(() => {
    const baseLayout = {
      paper_bgcolor: '#FEFDFE',
      plot_bgcolor: '#FEFDFE',
      font: { color: 'black' },
      xaxis: { showgrid: false, type: 'category' },
      yaxis: { title: 'Consumption (kWh)', side: 'left', position: -0.05, showgrid: false },
      yaxis2: { title: 'Temperature (°C)', side: 'right', overlaying: 'y', position: 0.99, showgrid: false },
      showlegend: true,
      hovermode: 'x unified',
      barmode: 'group',
      bargap: 0.15,
      bargroupgap: 0.1,
    };

    return baseLayout;
  }, []);

  return (
    <div>
      <Plot
        data={getUpdatedPlotData()}
        layout={customLayout}
        style={{ width: '100%', height: 600 }}
        config={{ displaylogo: false }}
        useResizeHandler
      />
    </div>
  );
};

export default EnergyPlot;
