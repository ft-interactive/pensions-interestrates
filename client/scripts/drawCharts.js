/* global d3, queue, drawBondData, drawLifeExpectancies */

let windowWidth = window.innerWidth;

function drawCharts(error, bondData, lifeExpectancyData) {
  drawBondData(bondData);
  drawLifeExpectancies(lifeExpectancyData);

  d3.select(window).on('resize', () => {
    if (Math.abs(window.innerWidth - windowWidth) > 10) {
      windowWidth = window.innerWidth;

      drawBondData(bondData, windowWidth);
      drawLifeExpectancies(lifeExpectancyData, windowWidth);
    }
  });
}

queue()
  .defer(d3.tsv, 'data/bonddata.tsv')
  .defer(d3.tsv, 'data/lifeExpectancies.tsv')
  .await(drawCharts);
