console.log(d3);

d3.queue()
  .defer(d3.tsv, 'data/bonddata.tsv')
  .await(drawCharts);

var windowWidth = window.innerWidth;

function drawCharts(error, bondData) {
  drawBondData(bondData)

  d3.select(window).on('resize',function(){
    if (Math.abs(window.innerWidth-windowWidth) > 10) {
      windowWidth = window.innerWidth;

      drawBondData(bondData)
    }
  });
}

function drawBondData(bondData) {
	console.log(bondData);
}