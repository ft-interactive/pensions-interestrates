import * as d3 from 'd3';

export function drawLifeExpectancies(lifeExpectanciesData, windowWidth) {
  const parseDate = d3.timeParse('%Y');

  lifeExpectanciesData.forEach((d) => {
    d.date = parseDate(d.Date);
  });

  const chartContainer = d3.select('#life-expectancies-chart');
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
    .domain([68, 80])
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
    .domain([parseDate('1960'), parseDate('2013')])
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

  const xLabel = svg.append('g')
    .attr('class', 'xAxis')
    .attr('transform', `translate(0,${graphHeight - margins.bottom})`)
    .call(xAxis);

  const lineGroup = svg.append('g')
    .attr('class', 'lineGroup')
    .attr('transform', `translate(0,${margins.top})`);

  const usLineData = d3.line()
    .x((d) => xScale(d.date))
    .y((d) => yScale(+d['United States']))
    .defined((d) => d['United States'] !== '');

  const ukLineData = d3.line()
    .x((d) => xScale(d.date))
    .y((d) => yScale(+d['United Kingdom']))
    .defined((d) => d['United Kingdom'] !== '');

  const germanLineData = d3.line()
    .x((d) => xScale(d.date))
    .y((d) => yScale(+d['Germany']))
    .defined((d) => d['Germany'] !== '');

  const ukLifeExpect = lineGroup
    .datum(lifeExpectanciesData)
    .append('path')
    .attr('class', 'ukLifeExpect')
    .attr('d', (d) => ukLineData(d))
    .style('stroke', '#cec6b9')
    .style('stroke-width', '1')
    .style('fill', 'none');

  const germanLifeExpect = lineGroup
    .datum(lifeExpectanciesData)
    .append('path')
    .attr('class', 'germanLifeExpect')
    .attr('d', (d) => germanLineData(d))
    .style('stroke', '#cec6b9')
    .style('stroke-width', '1')
    .style('fill', 'none');

  const usLifeExpect = lineGroup
    .datum(lifeExpectanciesData)
    .append('path')
    .attr('class', 'usLifeExpect')
    .attr('d', (d) => usLineData(d))
    .style('stroke', '#BB6D82')
    .style('stroke-width', '2')
    .style('fill', 'none');

  const annotationGroup = svg.append('g')
    .attr('class', 'annotationGroup')
    .attr('transform', `translate(0,${margins.top})`);

  // // label us
  annotationGroup.append('text')
    .attr('class', 'annotationLabel')
    .attr('x', xScale(parseDate('2011')))
    .attr('y', yScale(77.8))
    .style('fill', '#BB6D82')
    .text('US');

  // label uk
  annotationGroup.append('text')
    .attr('class', 'annotationLabel')
    .attr('x', xScale(parseDate('2009')))
    .attr('y', yScale(81))
    .text('UK');

  // label german
  annotationGroup.append('text')
    .attr('class', 'annotationLabel')
    .attr('x', xScale(parseDate('2008')))
    .attr('y', yScale(79.2))
    .text('Germany');
}
