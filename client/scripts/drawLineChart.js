import * as d3 from 'd3';

export function drawLineChart(data, config, windowWidth) {
  const parseDate = d3.timeParse(config.dateFormat);

  data.forEach((d) => {
    d.date = parseDate(d.Date);
  });

  const chartContainer = d3.select(`#${config.selectorId}`);
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
    .domain(config.yScale)
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

  // append y axis label (units)
  yLabel.append('text')
    .text(config.yAxisLabel)
    .style('text-anchor', 'right')
    .attr('class', 'axisLabel')
    .attr('x', graphWidth - margins.left - margins.right + 12)
    .attr('y', -32);

  const xScale = d3.scaleTime()
    .domain([parseDate(config.xDomain[0]), parseDate(config.xDomain[1])])
    .range([0, graphWidth - margins.left - margins.right]);

  let numXTicks = 10;
  if (windowWidth < 400) {
    numXTicks = 2;
  }

  const xAxis = d3.axisBottom()
    .scale(xScale)
    .tickSizeOuter(5)
    .ticks(numXTicks)
    .tickFormat(d => d3.timeFormat('%Y')(d));

  // append x axis
  svg.append('g')
    .attr('class', 'xAxis')
    .attr('transform', `translate(0,${graphHeight - margins.bottom})`)
    .call(xAxis);

  const lineGroup = svg.append('g')
    .attr('class', 'lineGroup')
    .attr('transform', `translate(0,${margins.top})`);

  const annotationGroup = svg.append('g')
    .attr('class', 'annotationGroup')
    .attr('transform', `translate(0,${margins.top})`);

  for (let i = 0; i < config.columns.length; i++) {
    const columnConfig = config.columns[i];

    const lineData = d3.line()
      .x((d) => xScale(d.date))
      .y((d) => yScale(+d[columnConfig.columnName]))
      .defined((d) => d[columnConfig.columnName] !== '');

    // append the actual line
    lineGroup
      .datum(data)
      .append('path')
      .attr('class', `${columnConfig.columnName}-line`)
      .attr('d', (d) => lineData(d))
      .style('stroke', columnConfig.color)
      .style('stroke-width', columnConfig.strokeWeight)
      .style('fill', 'none');

    annotationGroup.append('text')
      .attr('class', 'annotationLabel')
      .attr('x', xScale(parseDate(columnConfig.labelPlacement.x)))
      .attr('y', yScale(columnConfig.labelPlacement.y))
      .style('fill', columnConfig.color)
      .text(columnConfig.label);
  }
}
