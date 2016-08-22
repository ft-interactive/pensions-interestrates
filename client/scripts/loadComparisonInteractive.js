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
  const companyCountryStripped = companyCountry.replace(/ \(.*\)/, '');
  const result = $('#interactive-result').text();
  let multiplier;
  if (result.indexOf('smaller') >= 0) {
    multiplier = Math.round(100 / (100 - (result.replace(/,/g, '').match(/\d+/)[0])));
  } else {
    multiplier = result.replace(/,/g, '').match(/\d+/)[0];
  }

  let unit = '\'s GDP';
  if (companyCountry.indexOf('market cap') >= 0) {
    unit = ' (market cap)';
  }

  let deficitVal;
  if (usUk === 'UK') {
    if (publicPrivate === 'public') {
      deficitVal = '$1.97tn';
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

  let sentence = `The ${usUk} ${publicPrivate} pension deficit (${deficitVal}) is ${result} than ${companyCountryStripped}${unit}`;

  sentence = sentence.replace(/%/g, '%25');

  if (multiplier <= 7 && multiplier >= 2) { // if too long, will overflow into two lines.
    let barChart = '%0D%0A';
    for (let i = 0; i < multiplier; i++) {
      barChart += '▇';
    }
    if (result.indexOf('bigger') > 0) {
      barChart += `%20${usUk} deficit`;
    } else {
      barChart += `%20${companyCountryStripped}`;
    }
    barChart += '%0D%0A▇';
    if (result.indexOf('bigger') > 0) {
      barChart += `%20${companyCountryStripped}`;
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
        pensionDeficit = 1.97; // UK public
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

    const originalName = document.getElementById('interactive-compare').value;
    const name = originalName.replace(/ \(.*\)/, '');
    const value = _.findWhere(data, { name }).value;

    let multiplyFactor = pensionDeficit / value;
    let interactiveText;
    if (multiplyFactor < 1) {
      if (Math.round(1 / multiplyFactor) !== 1) {
        multiplyFactor = Math.round(1 / multiplyFactor);
      } else {
        multiplyFactor = Math.round(100 / multiplyFactor) / 100;
      }
      multiplyFactor = numberWithCommas(multiplyFactor);
      const percentNum = 100 - Math.round(100 / multiplyFactor);
      interactiveText = `${percentNum}% smaller`;
    } else {
      if (Math.round(1 / multiplyFactor) !== 1) {
        multiplyFactor = numberWithCommas(Math.round(multiplyFactor));
      } else {
        multiplyFactor = Math.round(multiplyFactor * 100) / 100;
      }
      interactiveText = `${multiplyFactor} times bigger`;
    }

    document.getElementById('interactive-compare').value = originalName;
    document.getElementById('interactive-result').innerHTML = interactiveText;

    changeTweetText();
  }

  document.getElementById('random').addEventListener('click', () => {
    const randomId = Math.floor(Math.random() * data.length);
    let unit = '(GDP)';
    if (data[randomId].category === 'company') {
      unit = '(market cap)';
    }

    const name = `${data[randomId].name} ${unit}`;

    document.getElementById('interactive-compare').value = name;
    getResult();
  });


  $('.interactive-option').on('click', function toggleButtons() {
    $(this).parent().find('.interactive-option')
      .attr('aria-pressed', false);
    $(this).attr('aria-pressed', true);

    getResult();
  });

  let formattedAutocompleteData = [];
  formattedAutocompleteData = _.map(data, (v) => {
    let unit = 'market cap';
    if (v.category === 'country') {
      unit = 'GDP';
    }
    return {
      value: v.value,
      label: v.name,
      desc: `${v.name} (${unit})`,
    };
  });

  $('#interactive-compare').autocomplete({
    source: formattedAutocompleteData,
    focus: (event, ui) => {
      $('#interactive-compare').val(ui.item.desc);
      return false;
    },
    minLength: 2,
    delay: 500,
    select: function select(e, ui) {
      $('#project').val(ui.item.desc);
      $('#project-id').val(ui.item.value);
      $('#project-description').html(ui.item.desc);

      if (ui.item) {
        $(e.target).val(ui.item.desc);
      }
      const name = $(this).val();
      getResult(name);

      return false;
    },
  });

  $('#interactive-compare').autocomplete('instance')._renderItem = function (ul, item) {
    return $('<li>')
      .append(`<div>${item.desc}</div>`)
      .appendTo(ul);
  };

  document.getElementById('interactive-compare').value = 'Apple (market cap)';
  getResult(); // start page with this
}
