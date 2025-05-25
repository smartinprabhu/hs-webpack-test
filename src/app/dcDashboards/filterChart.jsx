/* eslint-disable camelcase */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-underscore-dangle */
import React, { useState, useRef, useEffect } from 'react';
import * as dc from 'dc';
import * as d3 from 'd3';
import 'd3-transition';
import * as crossfilter from 'crossfilter2/crossfilter';
// import { timeYear, schemeRdYlGn, scaleLinear } from "d3";
import { Row, Col } from 'reactstrap';
import {
  Box, Typography,
  IconButton,
} from '@mui/material';
import { RestartAlt } from '@mui/icons-material';

import MuiTooltip from '@shared/muiTooltip';

export const Display = ({ datas, setupData }) => {

  const [count, setCount] = useState([]);

  const [data, setData] = useState([]);
  const [chart1, setChart1] = useState({});
  const [crossData, setcrossData] = useState(false);
  const chartRef = useRef(null);
  const xaxislabelRotation = 'transform: translate(-15px, 2px) rotate(-45deg)';
  const pieWidth = 300;
  const pieHeight = 300;
  const donutround = 0;
  const transduration = 800;
  const chartContainerRef = useRef(null);

  const [chartDimensions, setChartDimensions] = useState([]);
  const [appliedFilters, setAppliedFilters] = useState([]);
  const chartRefs = useRef([]);
  const [selectedKeys, setSelectedKeys] = useState([]);

  useEffect(() => {
    setData(datas);
    setcrossData(crossfilter(datas));
  }, [datas]);

  function createPieChart(id, dimension, group, type, i) {
    const pieChart = dc.pieChart(id);

    pieChart
      .width(250)
      .height(250)
      .innerRadius(type === 'donut' ? 50 : donutround)
      .dimension(dimension)
      .group(group);

    // Render the pie chart
    pieChart.render();
  }

  function createBarChart(id, dimension, group, type, fullwidth) {
    const barChart = dc.barChart(id);

    barChart
      .width(fullwidth ? 1300 : 250)
      .height(fullwidth ? 300 : 200)
      .dimension(dimension)
      .margins({
        top: 10, right: 10, bottom: 50, left: 30,
      })
      .group(group)
      .x(d3.scaleBand())
      .brushOn(false)
      .xUnits(dc.units.ordinal)
      .centerBar(true);
    // Render the bar chart
    barChart.render();

    barChart.on('renderlet', (chart) => {
      // Remove existing click handlers
      chart.selectAll('g.x text')
        .attr('transform', 'rotate(45)')
        .style('text-anchor', 'start');
    });
  }

  function createHbarChart(id, dimension, group, type, fullwidth) {
    const rowChart = dc.rowChart(id);

    rowChart
      .width(fullwidth ? 1300 : 250)
      .height(fullwidth ? 300 : 200)
      .dimension(dimension)
      .group(group)
      .elasticX(false)
      .controlsUseVisibility(true)
      .transitionDuration(transduration)
      .renderLabel(true); // Enable rendering of labels

    // Hide y-axis labels
    rowChart.on('renderlet', (chart) => {
      chart.selectAll('.g text').style('display', 'none');
    });

    // Render the bar chart
    rowChart.render();
  }

  // use odd page size to show the effect better
  let ofs = 0; const pag = 10;

  function update_offset(chart) {
    const totFilteredRecs = crossData.groupAll().value();
    const end = ofs + pag > totFilteredRecs ? totFilteredRecs : ofs + pag;
    ofs = ofs >= totFilteredRecs ? Math.floor((totFilteredRecs - 1) / pag) * pag : ofs;
    ofs = ofs < 0 ? 0 : ofs;
    chart.beginSlice(ofs);
    chart.endSlice(ofs + pag);
  }

  function display() {
    const totFilteredRecs = crossData.groupAll().value();
    const end = ofs + pag > totFilteredRecs ? totFilteredRecs : ofs + pag;
    d3.select('#begin')
      .text(end === 0 ? ofs : ofs + 1);
    d3.select('#end')
      .text(end);
    d3.select('#last')
      .attr('disabled', ofs - pag < 0 ? 'true' : null);
    d3.select('#next')
      .attr('disabled', ofs + pag >= totFilteredRecs ? 'true' : null);
    d3.select('#size').text(totFilteredRecs);
    if (totFilteredRecs !== crossData.size()) {
      d3.select('#totalsize').text(`(filtered Total: ${crossData.size()} )`);
    } else {
      d3.select('#totalsize').text('');
    }
  }

  function getTableDataValue(str) {
    let res = str;
    if (str && typeof str === 'object') {
      if (str.name) {
        res = str.name;
      } else if (str.display_name) {
        res = str.display_name;
      } else if (str.path_name) {
        res = str.path_name;
      }
    }
    return res;
  }

  function createColumnsFromJson(jsonData, columnsData) {
    // Ensure the JSON data is an array and has at least one object
    if (!Array.isArray(jsonData) || jsonData.length === 0) {
      throw new Error('Invalid JSON data');
    }

    // Extract keys from the first object to create columns
    const keys = Object.keys(jsonData[0]);

    // Create column configuration based on the keys
    const columns = columnsData.map((key) => ({
      label: key.label, // Capitalize the key for the label
      format: (d) => getTableDataValue(d[key.field]),
    }));

    return columns;
  }

  function getTableChart(id, dimension, columns) {
    const tableChart = dc.dataTable(id);

    tableChart
      .width(700)
      .height(400)
      .dimension(dimension)
      .size(Infinity)
      .showSections(false)
      .columns(createColumnsFromJson(datas, columns))
      .order(d3.ascending)
      .on('preRender', (chart) => update_offset(chart))
      .on('preRedraw', (chart) => update_offset(chart))
      .on('pretransition', display);
    // Render the bar chart
    return tableChart;
  }

  const next = (id, field, columns) => {
    const dimension = crossData.dimension((d) => d[field]);
    const tableChart = getTableChart(id, dimension, columns);
    ofs += pag;
    update_offset(tableChart);
    tableChart.redraw();
    tableChart.filter();
    tableChart.render();
    dc.redrawAll();
  };

  const last = (id, field, columns) => {
    const dimension = crossData.dimension((d) => d[field]);
    const tableChart = getTableChart(id, dimension, columns);
    ofs -= pag;
    update_offset(tableChart);
    tableChart.redraw();
    tableChart.filter();
    tableChart.render();
    dc.redrawAll();
  };

  function createTableChart(id, dimension, columns) {
    const tableChart = dc.dataTable(id);

    tableChart
      .width(700)
      .height(400)
      .dimension(dimension)
      .size(Infinity)
      .showSections(false)
      .columns(createColumnsFromJson(datas, columns))
      .order(d3.ascending)
      .on('preRender', (chart) => update_offset(chart))
      .on('preRedraw', (chart) => update_offset(chart))
      .on('pretransition', display);
    // Render the bar chart
    tableChart.render();
  }

  function printdata() {
    setupData && setupData.length && setupData.forEach((state, index) => {
      const dimension = crossData.dimension((d) => d[state.group_field]);
      const group = dimension.group().reduceCount((d) => d[state.group_field]);

      // Create a unique div for each pie chart
      const divId = `#div_dc_chart${index + 1}`;

      // Make sure you have corresponding divs in your HTML with ids like divpie1, divpie2, etc.
      if (state.type === 'pie' || state.type === 'donut') {
        createPieChart(divId, dimension, group, state.type, state.fullwidth);
      } else if (state.type === 'bar') {
        createBarChart(divId, dimension, group, state.type, state.fullwidth);
      } else if (state.type === 'horizontal_bar') {
        createHbarChart(divId, dimension, group, state.type, state.fullwidth);
      } else if (state.type === 'table') {
        createTableChart(divId, dimension, state.columns);
      }
      dc.filterAll();
      dc.redrawAll();
    });
  }

  useEffect(() => {
    if (crossData && setupData && setupData.length) {
      printdata();
    }
  }, [crossData, setupData]);

  function reset(ch) {
    dc.filterAll();
    // dc.renderAll();
    dc.redrawAll();
    setSelectedKeys([]);
  }

  return (
    <div className="p-2" id="charts-container" ref={chartContainerRef}>

      <Row>
        {(setupData && setupData.length > 0 && setupData.map((pl, index) => (
          <Col md={pl.fullwidth ? 12 : 3} lg={pl.fullwidth ? 12 : 3} className={`${index === 0 || pl.fullwidth ? 'pl-3' : 'pl-2'} ${pl.fullwidth ? 'pr-3 pt-1' : 'pr-1'} mb-2`} id={`div_dc_chart_component${index}`}>
            <div className="pie-chart-box">
              <Box
                sx={{
                  padding: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              >
                <h1
                  style={{ fontSize: '17px' }}
                  className="pie-chart-text m-0"
                >
                  {pl.label}
                </h1>
                <div>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '2px',
                    }}
                  >

                    <MuiTooltip title={<Typography>Reset</Typography>}>
                      <IconButton
                        onClick={() => reset(index + 1)}
                      >
                        <RestartAlt
                          size={15}
                          cursor="pointer"
                          className="expand-icon"
                        />
                      </IconButton>
                    </MuiTooltip>

                  </Box>
                </div>
              </Box>
              {pl.type === 'table' && (
                <div id="paging">
                  Showing
                  {' '}
                  <span id="begin" />
                  -
                  <span id="end" />
                  {' '}
                  of
                  {' '}
                  <span id="size" />
                  {' '}
                  <span id="totalsize" />
                  <input id="last" className="btn" type="Button" value="Prev" onClick={() => last(`div_dc_chart${index + 1}`, pl.group_field, pl.columns)} />
                  <input id="next" className="btn" type="button" value="Next" onClick={() => next(`div_dc_chart${index + 1}`, pl.group_field, pl.columns)} />
                </div>
              )}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  marginLeft: 'auto',
                }}
              >
                <div id={`div_dc_chart${index + 1}`} className={pl.type === 'table' ? 'text-center table table-striped' : 'dc-pie-chart'} />
              </Box>
            </div>
          </Col>
        )))}
      </Row>
    </div>
  );
};

export default Display;
