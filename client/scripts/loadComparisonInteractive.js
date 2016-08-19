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

function changeTweetText() {
  const maxChars = 140;

  const usUk = $('#usuk .interactive-option[aria-pressed=true]').text();
  const publicPrivate = $('#publicprivate .interactive-option[aria-pressed=true]').text();
  const companyCountry = $('#interactive-compare').val();
  const result = $('#interactive-result').text();
  const multiplier = result.replace(/,/, '').match(/\d+/)[0];

  let sentence = `The ${usUk} ${publicPrivate} pension deficit is ${result} than ${companyCountry}`;

  let barChart = '%0D%0A';
  for (let i = 0; i < multiplier; i++) {
    barChart += '▇';
  }
  if (result.indexOf('bigger') > 0) {
    barChart += ` ${usUk} deficit`;
  } else {
    barChart += ` ${companyCountry}`;
  }
  barChart += '%0D%0A▇';
  if (result.indexOf('bigger') > 0) {
    barChart += ` ${companyCountry}`;
  } else {
    barChart += ` ${usUk} deficit`;
  }
  barChart += '%0D%0A';
  const barChartLength = barChart.length;

  const availableSpace = maxChars - sentence.length - barChartLength - 16; // minus 16 for link
  if (availableSpace >= 0) {
    sentence += barChart;
  }

  document.getElementById('tweetable').innerText = sentence;

  console.log(sentence, availableSpace, multiplier);
}

export function loadComparisonInteractive(data) {
  // Pension deficit notes:
  // US public pension deficit: 3.41 trillion USD (http://www.ft.com/cms/s/0/c9966bea-fcd8-11e5-b5f5-070dca6d0a0d.html)
  // US corporate pension deficits: 0.638 trillion USD (http://www.mercer.com/newsroom/june-2016-pension-funding.html)
  // UK public pension deficit: 1.18 trillion USD (http://www.ft.com/cms/s/0/bb94f4b8-3a1c-11e6-a780-b48ed7b6126f.html#axzz4HilVkHt9, 900bn pounds)
  // UK corporate pension deficit: 0.196 trillion USD (Mercer report, 149bn pounds on 8/4/2016)

  function getResult() {
    let pensionDeficit; // in US trillions
    if (document.getElementById('interactive-option--uk').getAttribute('aria-pressed') === 'true') {
      if (document.getElementById('interactive-option--public').getAttribute('aria-pressed') === 'true') {
        pensionDeficit = 0.984; // UK public
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
    const category = document.getElementById('interactive-compare').category;

    let value;
    if (category === 'country') {
      value = _.findWhere(data, { name }).value; // original country data in trillions
    } else {
      value = _.findWhere(data, { name }).value; // original company data in trillions
    }

    let multiplyFactor = pensionDeficit / value;
    let interactiveText;
    if (multiplyFactor < 1) {
      if (Math.round(1 / multiplyFactor) !== 1) {
        multiplyFactor = Math.round(1 / multiplyFactor);
      } else {
        multiplyFactor = Math.round(100 / multiplyFactor) / 100;
      }
      multiplyFactor = numberWithCommas(multiplyFactor);
      interactiveText = `${multiplyFactor} times smaller`;
    } else {
      if (Math.round(1 / multiplyFactor) !== 1) {
        multiplyFactor = numberWithCommas(Math.round(multiplyFactor));
      } else {
        multiplyFactor = Math.round(multiplyFactor * 100) / 100;
      }
      interactiveText = `${multiplyFactor} times bigger`;
    }

    document.getElementById('interactive-compare').value = name;
    document.getElementById('interactive-result').innerHTML = interactiveText;

    changeTweetText();
  }

  document.getElementById('random').addEventListener('click', () => {
    const randomId = Math.floor(Math.random() * data.length);
    const name = data[randomId].name;

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
    minLength: 2,
    delay: 500,
    select: function select(e, ui) {
      if (ui.item) {
        $(e.target).val(ui.item.value);
      }
      const name = $(this).val();
      getResult(name);
    },
  });

  document.getElementById('interactive-compare').value = 'Apple Inc';
  getResult(); // start page with this
}
