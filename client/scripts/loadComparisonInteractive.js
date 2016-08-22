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
  let multiplier;
  if (result.indexOf('smaller') >= 0) {
    multiplier = Math.round(100 / (100 - (result.replace(/,/g, '').match(/\d+/)[0])));
  } else {
    multiplier = result.replace(/,/g, '').match(/\d+/)[0];
  }

  let unit = '';
  if (['Afghanistan', 'Angola', 'Albania', 'Arab World', 'United Arab Emirates', 'Armenia', 'Antigua and Barbuda', 'Australia', 'Austria', 'Azerbaijan', 'Burundi', 'Belgium', 'Benin', 'Burkina Faso', 'Bangladesh', 'Bulgaria', 'Bahrain', 'Bahamas, The', 'Bosnia and Herzegovina', 'Belarus', 'Belize', 'Bolivia', 'Brazil', 'Barbados', 'Brunei Darussalam', 'Bhutan', 'Botswana', 'Central African Republic', 'Canada', 'Central Europe and the Baltics', 'Switzerland', 'Chile', 'China', 'Cote d\'Ivoire', 'Cameroon', 'Congo, Rep.', 'Colombia', 'Cabo Verde', 'Costa Rica', 'Caribbean small states', 'Cyprus', 'Czech Republic', 'Germany', 'Dominica', 'Denmark', 'Dominican Republic', 'Algeria', 'East Asia & Pacific (excluding high income)', 'Early-demographic dividend', 'East Asia & Pacific', 'Europe & Central Asia (excluding high income)', 'Europe & Central Asia', 'Ecuador', 'Egypt, Arab Rep.', 'the Euro area', 'Spain', 'Estonia', 'Ethiopia', 'the European Union', 'Fragile and conflict affected situations', 'Finland', 'Fiji', 'France', 'Gabon', 'the United Kingdom', 'Georgia', 'Ghana', 'Guinea', 'Guinea-Bissau', 'Equatorial Guinea', 'Greece', 'Grenada', 'Guatemala', 'Guyana', 'High income', 'Hong Kong SAR, China', 'Honduras', 'Heavily indebted poor countries (HIPC)', 'Croatia', 'Haiti', 'Hungary', 'IBRD only', 'IDA & IBRD total', 'IDA total', 'IDA blend', 'Indonesia', 'IDA only', 'India', 'Ireland', 'Iraq', 'Iceland', 'Israel', 'Italy', 'Jamaica', 'Jordan', 'Japan', 'Kazakhstan', 'Kenya', 'Kyrgyz Republic', 'Cambodia', 'Kiribati', 'St. Kitts and Nevis', 'Korea, Rep.', 'Kosovo', 'Kuwait', 'Latin America & Caribbean (excluding high income)', 'Lao PDR', 'Lebanon', 'Liberia', 'Libya', 'St. Lucia', 'Latin America & Caribbean', 'Least developed countries: UN classification', 'Low income', 'Sri Lanka', 'Lower middle income', 'Low & middle income', 'Late-demographic dividend', 'Lithuania', 'Luxembourg', 'Latvia', 'Macao SAR, China', 'Morocco', 'Moldova', 'Madagascar', 'Maldives', 'the Middle East & North Africa', 'Mexico', 'Middle income', 'Macedonia, FYR', 'Mali', 'Myanmar', 'Montenegro', 'Mongolia', 'Mozambique', 'Mauritius', 'Malawi', 'Malaysia', 'North America', 'Namibia', 'Niger', 'Nigeria', 'Nicaragua', 'Netherlands', 'Norway', 'Nepal', 'New Zealand', 'OECD members', 'Oman', 'Other small states', 'Pakistan', 'Panama', 'Peru', 'Philippines', 'Palau', 'Poland', 'Pre-demographic dividend', 'Portugal', 'Paraguay', 'Pacific island small states', 'Post-demographic dividend', 'Qatar', 'Romania', 'the Russian Federation', 'Rwanda', 'South Asia', 'Saudi Arabia', 'Sudan', 'Senegal', 'Singapore', 'the Solomon Islands', 'Sierra Leone', 'El Salvador', 'Somalia', 'Serbia', 'Sub-Saharan Africa (excluding high income)', 'South Sudan', 'Sub-Saharan Africa', 'Small states', 'Suriname', 'the Slovak Republic', 'Slovenia', 'Sweden', 'Swaziland', 'Seychelles', 'Chad', 'East Asia & Pacific (IDA & IBRD countries)', 'Europe & Central Asia (IDA & IBRD countries)', 'Togo', 'Thailand', 'Tajikistan', 'Turkmenistan', 'Latin America & the Caribbean (IDA & IBRD countries)', 'Timor-Leste', 'South Asia (IDA & IBRD)', 'Sub-Saharan Africa (IDA & IBRD countries)', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Tanzania', 'Uganda', 'Ukraine', 'Upper middle income', 'Uruguay', 'the United States', 'Uzbekistan', 'St. Vincent and the Grenadines', 'Vietnam', 'West Bank and Gaza', 'World', 'Samoa', 'South Africa', 'Congo, Dem. Rep.', 'Zambia', 'Zimbabwe'].indexOf(companyCountry) > -1) {
    unit = '\'s GDP';
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

  document.getElementById('interactive-compare').value = 'Apple Inc (market cap)';
  getResult(); // start page with this
}
