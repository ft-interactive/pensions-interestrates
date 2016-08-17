/* global d3, queue */

console.log('hi');

let windowWidth = window.innerWidth;

function drawBondData(bondData) {
  console.log(bondData);
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
