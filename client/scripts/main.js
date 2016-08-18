import { drawCharts } from './drawCharts';
import { queue } from 'd3-queue';
import { tsv } from 'd3';

queue()
  .defer(tsv, 'data/bonddata2.tsv')
  .defer(tsv, 'data/lifeExpectancies.tsv')
  .defer(tsv, 'data/assetsLiabilities.tsv')
  .defer(tsv, 'data/comparisonData.tsv')
  .await(drawCharts);

// YOUR CODE HERE
document.dispatchEvent(new CustomEvent('ig.Loaded'));
