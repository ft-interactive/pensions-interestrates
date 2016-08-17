/* global d3, queue */

let windowWidth = window.innerWidth;

function drawBondData(bondData) {
  const parseDate = d3.timeParse('%-m/%-d/%y');

  bondData.forEach((d) => {
    d.date = parseDate(d.date);
  });

  console.log(bondData);

  const chartContainer = d3.select('#interest-rates-chart');
  chartContainer.html('');

  const graphWidth = chartContainer.node().offsetWidth;
  const graphHeight = 400;
  const margins = { top: 50, bottom: 50, left: 25, right: 5 };

  chartContainer.append('svg');

  const svg = chartContainer.select('svg');

  svg
    .attr('width', graphWidth)
    .attr('height', graphHeight);

  const yScale = d3.scaleLinear()
    .domain([-1, 16])
    .range([graphHeight - margins.top - margins.bottom, 0]);

  const yAxis = d3.axisRight()
    .scale(yScale)
    .tickSizeInner(graphWidth)
    .tickSizeOuter(0);

  const yLabel = svg.append('g')
    .attr('class', 'yAxis')
    .attr('transform', `translate(0,${margins.top})`)
    .call(yAxis);

  yLabel.selectAll('.tick text')
    .attr('x', graphWidth - margins.right - 12)
    .attr('y', -10);

  const yAxisLabel = yLabel.append('text')
    .text('%')
    .style('text-anchor', 'right')
    .attr('class', 'axisLabel')
    .attr('x', graphWidth - margins.left - margins.right + 12)
    .attr('y', -32);

  const xScale = d3.scaleTime()
    .domain([parseDate('1/2/80'), parseDate('12/31/16')])
    .range([0, graphWidth - margins.left - margins.right]);

  const xAxis = d3.axisBottom()
    .scale(xScale)
    .tickSizeOuter(5)
    .tickFormat(d => d3.timeFormat('%Y')(d));

  const xLabel = svg.append('g')
    .attr('class', 'xAxis')
    .attr('transform', `translate(0,${graphHeight - margins.bottom})`)
    .call(xAxis);

  const lineGroup = svg.append('g')
    .attr('class', 'lineGroup')
    .attr('transform', `translate(0,${margins.top})`);

  const usLineData = d3.line()
    .x((d) => xScale(d.date))
    .y((d) => yScale(+d['USGG10YR Index']))
    .defined((d) => d['USGG10YR Index'] !== '');

  const ukLineData = d3.line()
    .x((d) => xScale(d.date))
    .y((d) => yScale(+d['GUKG10 Index']))
    .defined((d) => d['GUKG10 Index'] !== '');

  const germanLineData = d3.line()
    .x((d) => xScale(d.date))
    .y((d) => yScale(+d['GDBR10 Index']))
    .defined((d) => d['GDBR10 Index'] !== '');

  const ukBonds = lineGroup
    .datum(bondData)
    .append('path')
    .attr('class', 'ukBonds')
    .attr('d', (d) => ukLineData(d))
    .style('stroke', '#cec6b9')
    .style('stroke-width', '1')
    .style('fill', 'none');

  const germanBonds = lineGroup
    .datum(bondData)
    .append('path')
    .attr('class', 'germanBonds')
    .attr('d', (d) => germanLineData(d))
    .style('stroke', '#cec6b9')
    .style('stroke-width', '1')
    .style('fill', 'none');

  const usBonds = lineGroup
    .datum(bondData)
    .append('path')
    .attr('class', 'usBonds')
    .attr('d', (d) => usLineData(d))
    .style('stroke', '#BB6D82')
    .style('stroke-width', '2')
    .style('fill', 'none');
}

function drawCharts(error, bondData) {
  drawBondData(bondData);

  d3.select(window).on('resize', () => {
    if (Math.abs(window.innerWidth - windowWidth) > 10) {
      windowWidth = window.innerWidth;

      drawBondData(bondData);
    }
  });
}

queue()
  .defer(d3.tsv, 'data/bonddata.tsv')
  .await(drawCharts);
