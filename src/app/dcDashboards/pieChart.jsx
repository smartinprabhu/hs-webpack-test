import React, { useState, useEffect } from 'react';
import * as dc from 'dc';
import 'd3-transition';
import * as crossfilter from 'crossfilter2/crossfilter';
import {
  Box,
} from '@mui/material';

const baseUrl = 'http://localhost/react-d3/apiurl.php';

export const PieChart = ({
  datas, name, id, filterField,
}) => {

  const [count, setCount] = useState([]);

  const [data, setData] = useState([]);
  const [chart1, setChart1] = useState({});
  const [crossData, setcrossData] = useState({});
  const div = React.useRef(null);
  const div2 = React.useRef(null);
  const xaxislabelRotation = 'transform: translate(-15px, 2px) rotate(-45deg)';
  const pieWidth = 320;
  const pieHeight = 450;
  const donutround = 50;
  const transduration = 800;

  useEffect(() => {
    setData(datas);
    setcrossData(crossfilter(datas));
  }, [datas]);

  const printdata = () => {
    const crossData = crossfilter(datas);
    const startValue1 = crossData.dimension(dc.pluck(filterField));
    const startValueGroup1 = startValue1.group().reduceCount(dc.pluck(filterField));

    const pieChart1 = dc.pieChart(`#${id}`);

    pieChart1
      .width(pieWidth)
      .height(pieHeight)
      .slicesCap(4)
      .innerRadius(donutround)
      .externalLabels(50)
      .externalRadiusPadding(50)
      .drawPaths(true)
      .dimension(startValue1)
      .group(startValueGroup1)
      .legend(dc.legend());

    pieChart1.on('pretransition', (chart) => {
      chart.selectAll('.dc-legend-item text')
        .text('')
        .append('tspan')
        .text((d) => d.name)
        .append('tspan')
        .attr('x', 100)
        .attr('text-anchor', 'end')
        .text((d) => d.data);
    });

    pieChart1.width(pieWidth)
      .height(pieHeight)
      .cx(200)
      .transitionDuration(transduration)
      .dimension(startValue1)
      .group(startValueGroup1)
      //	.colors(colorScale)
      //   .radius(donutround)
      .innerRadius(donutround)
      .externalLabels(20)
      .externalRadiusPadding(50)
      .drawPaths(true)
      //    .minAngleForLabel(0)
      .renderLabel(true)
      .title((d) => `${d.key} ` + ':' + ` ${d.value}`)
      .legend(dc.legend().x(20).y(10).itemWidth(15));

    dc.renderAll();
    dc.redrawAll();
  };

  useEffect(() => {
    printdata();
  }, [data]);

  function reset(ch) {
    dc.filterAll();
    dc.renderAll();
    dc.redrawAll();
  }

  return (

    <div className="pie-chart-box">
      <Box
        sx={{
          padding: '4px 4px 4px 4px',
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
          {name}
        </h1>

      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '80%',
        }}
      >
        <Box
          sx={{
            height: '90%',
            width: '90%',
          }}
        >
          <div id={id} />
        </Box>
      </Box>
    </div>
  );
};

export default PieChart;
