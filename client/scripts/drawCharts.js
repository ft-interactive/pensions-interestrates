/* global document, drawBondData, drawLifeExpectancies, loadComparisonInteractive */

import * as d3 from 'd3';
import { drawBondData } from './drawBondData';
import { drawLifeExpectancies } from './drawLifeExpectancies';
import { loadComparisonInteractive } from './loadComparisonInteractive';

let windowWidth = window.innerWidth;

export function drawCharts(error, bondData, lifeExpectancyData, comparisonData) {
  drawBondData(bondData);
  drawLifeExpectancies(lifeExpectancyData);
  loadComparisonInteractive(comparisonData);

  d3.select(window).on('resize', () => {
    if (Math.abs(window.innerWidth - windowWidth) > 10) {
      windowWidth = window.innerWidth;

      drawBondData(bondData, windowWidth);
      drawLifeExpectancies(lifeExpectancyData, windowWidth);
    }
  });
}

function percentEncode(string) {
  return string.replace(/#/g, '%23').replace(/,/g, '%2c').replace(/ /g, '%20');
}

document.getElementById('tweet').addEventListener('click', () => {
  const baseURL = `https://twitter.com/intent/tweet?url=http://${window.location.hostname + window.location.pathname}`;
  const text = document.getElementById('tweetable').innerText;
  console.log(document.getElementById('tweetable').innerText);
  console.log(text);

  const tweetText = `&text=${text}`;
  const related = '&related=ajam';
  const counterURL = `&counturl=${window.location.hostname + window.location.pathname}`;

  const twitterURL = percentEncode(baseURL + tweetText + related + counterURL);

  const settings = 'width=500,height=400,scrollbars=no,location=0,statusbars=0,' +
                    'menubars=0,toolbars=0,resizable=0';

  window.open(twitterURL, 'Tweet', settings);
});
