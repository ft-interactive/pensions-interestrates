import * as d3 from 'd3';
import { drawLineChart } from './drawLineChart';
import { loadComparisonInteractive } from './loadComparisonInteractive';

let windowWidth = window.innerWidth;

const config = {
  bondYields: {
    dateFormat: '%d-%b-%Y',
    selectorId: 'interest-rates-chart',
    yAxisLabel: '%',
    yScale: [-1, 16],
    xDomain: ['01-Jan-1980', '31-Dec-2016'],
    columns: [
      {
        columnName: 'GUKG10 Index',
        color: '#76acb8',
        label: 'UK 10-year gilt yield',
        labelPlacement: { x: '01-Jan-1991', y: 12.5 },
        strokeWeight: 1,
      },
      {
        columnName: 'GDBR10 Index',
        color: '#3d7ab3',
        label: 'German bund yield',
        labelPlacement: { x: '01-Jan-1986', y: 4.2 },
        strokeWeight: 1,
      },
      {
        columnName: 'USGG10YR Index',
        color: '#af516c',
        label: 'US 10-year Treasury yield',
        labelPlacement: { x: '01-Jan-1980', y: 16.7 },
        strokeWeight: 2,
      },
    ],
  },
  lifeExpectancy: {
    dateFormat: '%Y',
    selectorId: 'life-expectancies-chart',
    yAxisLabel: 'years',
    yScale: [68, 80],
    xDomain: [1960, 2013],
    columns: [
      {
        columnName: 'United Kingdom',
        color: '#76acb8',
        label: 'UK',
        labelPlacement: { x: 2009, y: 81 },
        strokeWeight: 1,
      },
      {
        columnName: 'Germany',
        color: '#3d7ab3',
        label: 'Germany',
        labelPlacement: { x: 2008, y: 79.2 },
        strokeWeight: 1,
      },
      {
        columnName: 'United States',
        color: '#af516c',
        label: 'US',
        labelPlacement: { x: 2011, y: 77.8 },
        strokeWeight: 2,
      },
    ],
  },
  assetsLiabilities: {
    dateFormat: '%d-%b-%Y',
    selectorId: 'assets-liabilities-chart',
    yAxisLabel: '%',
    yScale: [0, 450],
    xDomain: ['01-Dec-1999', '01-Jul-2016'],
    columns: [
      {
        columnName: 'Liabilities',
        color: '#af516c',
        label: 'Liabilities',
        labelPlacement: { x: '01-Jan-2001', y: 170 },
        strokeWeight: 2,
      },
      {
        columnName: 'Assets',
        color: '#ecafaf',
        label: 'Assets',
        labelPlacement: { x: '01-Jan-2004', y: 70 },
        strokeWeight: 2,
      },
    ],
  },
};

export function drawCharts(error, bondData, lifeExpectancyData, assetsLiabilitiesData, comparisonData) {
  drawLineChart(bondData, config.bondYields, windowWidth);
  drawLineChart(lifeExpectancyData, config.lifeExpectancy, windowWidth);
  drawLineChart(assetsLiabilitiesData, config.assetsLiabilities, windowWidth);
  loadComparisonInteractive(comparisonData);

  d3.select(window).on('resize', () => {
    if (Math.abs(window.innerWidth - windowWidth) > 10) {
      windowWidth = window.innerWidth;

      drawLineChart(bondData, config.bondYields, windowWidth);
      drawLineChart(lifeExpectancyData, config.lifeExpectancy, windowWidth);
      drawLineChart(assetsLiabilitiesData, config.assetsLiabilities, windowWidth);
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
  const related = '&related=ft';
  const counterURL = `&counturl=${window.location.hostname + window.location.pathname}`;

  const twitterURL = percentEncode(baseURL + tweetText + related + counterURL);

  const settings = 'width=500,height=400,scrollbars=no,location=0,statusbars=0,' +
                    'menubars=0,toolbars=0,resizable=0';

  window.open(twitterURL, 'Tweet', settings);
});
