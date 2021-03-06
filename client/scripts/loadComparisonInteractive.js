/* global $ */

import * as _ from 'underscore';

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function htmlEncode(s) {
  const el = document.createElement('div');
  el.innerText = el.textContent = s;
  s = el.innerHTML;
  return s;
}

export function loadComparisonInteractive(data) {
  function changeTweetText() {
    const maxChars = 140;

    const usUk = $('#usuk .interactive-option[aria-pressed=true]').text();
    const publicPrivate = $('#publicprivate .interactive-option[aria-pressed=true]').text();
    const companyCountry = $('#interactive-compare').val();
    const result = $('#interactive-result').text();
    let multiplier;
    if (result.indexOf('smaller') >= 0) {
      multiplier = Math.round(100 / (100 - (result.replace(/,/g, '').match(/\d+/)[0])));
    } else {
      multiplier = result.replace(/,/g, '').match(/\d+/)[0];
    }

    let unit = '\'s GDP';
    const category = _.findWhere(data, { name: companyCountry }).category;
    if (category === 'company') {
      unit = ' (market cap)';
    }

    let deficitVal;
    if (usUk === 'UK') {
      if (publicPrivate === 'public') {
        deficitVal = '$61.7bn';
      } else {
        deficitVal = '$196bn';
      }
    } else {
      if (publicPrivate === 'public') {
        deficitVal = '$3.4tn';
      } else {
        deficitVal = '$638bn';
      }
    }
    let availableSpace;

    let sentence = `The ${usUk} ${publicPrivate} pension deficit (${deficitVal}) is ${result} than ${companyCountry}${unit}`;

    sentence = sentence.replace(/%/g, '%25');

    if (multiplier <= 7 && multiplier >= 2) { // if too long, will overflow into two lines.
      let barChart = '%0D%0A';
      for (let i = 0; i < multiplier; i++) {
        barChart += '▇';
      }
      if (result.indexOf('bigger') > 0) {
        barChart += `%20${usUk} deficit`;
      } else {
        barChart += `%20${companyCountry}`;
      }
      barChart += '%0D%0A▇';
      if (result.indexOf('bigger') > 0) {
        barChart += `%20${companyCountry}`;
      } else {
        barChart += `%20${usUk} deficit`;
      }
      barChart += '%0D%0A';

      availableSpace = maxChars - sentence.length - barChart.length - 23 + 20; // minus 23 for link, add 20 because %0D%0A doesn't count
      if (availableSpace >= 0) {
        sentence += barChart;
      }

      sentence = sentence.replace(/&/g, '%26');
    }

    document.getElementById('tweetable').innerText = sentence;

    // console.log(sentence, availableSpace, multiplier);
  }


  function colorCode() {
    const companyCountry = $('#interactive-compare').val();
    const category = _.findWhere(data, { name: companyCountry }).category;

    $('#interactive-compare-text').removeClass('item-country');
    $('#interactive-compare-text').removeClass('item-company');

    $('#interactive-compare-text').addClass(`item-${category}`);
    return true;
  }

  // Pension deficit notes:
  // US public pension deficit: 3.41 trillion USD (http://www.ft.com/cms/s/0/c9966bea-fcd8-11e5-b5f5-070dca6d0a0d.html)
  // US corporate pension deficits: 0.638 trillion USD (http://www.mercer.com/newsroom/june-2016-pension-funding.html)
  // UK public pension deficit: 1.18 trillion USD (http://www.ft.com/cms/s/0/bb94f4b8-3a1c-11e6-a780-b48ed7b6126f.html#axzz4HilVkHt9, 900bn pounds)
  // UK corporate pension deficit: 0.196 trillion USD (Mercer report, 149bn pounds on 8/4/2016)

  function getResult() {
    let pensionDeficit; // in US trillions
    if (document.getElementById('interactive-option--uk').getAttribute('aria-pressed') === 'true') {
      if (document.getElementById('interactive-option--public').getAttribute('aria-pressed') === 'true') {
        pensionDeficit = 0.06172; // UK public
      } else {
        pensionDeficit = 0.196; // UK private
      }
    } else {
      if (document.getElementById('interactive-option--public').getAttribute('aria-pressed') === 'true') {
        pensionDeficit = 3.41; // US public
      } else {
        pensionDeficit = 0.638; // US private
      }
    }

    const name = document.getElementById('interactive-compare').value;
    const category = _.findWhere(data, { name }).category;
    const value = _.findWhere(data, { name }).value;

    let unit = '(market cap)';
    if (category === 'country') {
      unit = '(GDP)';
    }

    let thanOf = ' than ';

    let multiplyFactor = pensionDeficit / value;
    let interactiveText;

    if (multiplyFactor < 1) {
      // if (Math.round(1 / multiplyFactor) !== 1) {
      //   multiplyFactor = Math.round(1 / multiplyFactor);
      // } else {
      //   multiplyFactor = Math.round(1000 / multiplyFactor) / 1000;
      // }
      // multiplyFactor = numberWithCommas(multiplyFactor);
      // let percentNum = 100 - Math.round(100 / multiplyFactor);
      // if (percentNum === 100) {
      //   percentNum = 100 - Math.round(1000 / multiplyFactor) / 10;
      // }
      const percentNum = Math.round(multiplyFactor * 100);
      interactiveText = `<div class='multiplier'>${percentNum}% </div><br />the size`;
      thanOf = ' of ';
    } else {
      if (Math.round(1 / multiplyFactor) !== 1) {
        multiplyFactor = numberWithCommas(Math.round(multiplyFactor));
      } else {
        multiplyFactor = Math.round(multiplyFactor * 100) / 100;
      }
      interactiveText = `<div class='multiplier'>${multiplyFactor} </div><br />times bigger`;
    }

    document.getElementById('interactive-compare-text').innerHTML = name;
    document.getElementById('thanhack').innerHTML = thanOf;
    document.getElementById('interactive-unit').innerHTML = unit;
    document.getElementById('interactive-result').innerHTML = interactiveText;

    changeTweetText();
    colorCode();
  }

  document.getElementById('random').addEventListener('click', () => {
    const randomId = Math.floor(Math.random() * data.length);
    const name = `${data[randomId].name}`;

    document.getElementById('interactive-compare').value = name;
    getResult();
  });


  $('.interactive-option').on('click', function toggleButtons() {
    $(this).parent().find('.interactive-option')
      .attr('aria-pressed', false);
    $(this).attr('aria-pressed', true);

    getResult();
  });

  const list = _.pluck(data, 'name');
  $('#interactive-compare').autocomplete({
    source: list,
    minLength: 1,
    delay: 500,
    select: function select(e, ui) {
      if (ui.item) {
        $(e.target).val(ui.item.value);
      }
      const name = $(this).val();
      getResult(name);
    },
  });

  document.getElementById('interactive-compare').value = 'Apple';
  getResult(); // start page with this
}
