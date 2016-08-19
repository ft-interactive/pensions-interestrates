/* global $ */

import * as _ from 'underscore';

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ', ');
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
  const multiplier = result.replace(/,/g, '').match(/\d+/)[0];

  let unit = '';
  if (['Afghanistan', 'Angola', 'Albania', 'Arab World', 'United Arab Emirates', 'Armenia', 'Antigua and Barbuda', 'Australia', 'Austria', 'Azerbaijan', 'Burundi', 'Belgium', 'Benin', 'Burkina Faso', 'Bangladesh', 'Bulgaria', 'Bahrain', 'Bahamas, The', 'Bosnia and Herzegovina', 'Belarus', 'Belize', 'Bolivia', 'Brazil', 'Barbados', 'Brunei Darussalam', 'Bhutan', 'Botswana', 'Central African Republic', 'Canada', 'Central Europe and the Baltics', 'Switzerland', 'Chile', 'China', 'Cote d\'Ivoire', 'Cameroon', 'Congo, Rep.', 'Colombia', 'Cabo Verde', 'Costa Rica', 'Caribbean small states', 'Cyprus', 'Czech Republic', 'Germany', 'Dominica', 'Denmark', 'Dominican Republic', 'Algeria', 'East Asia & Pacific (excluding high income)', 'Early-demographic dividend', 'East Asia & Pacific', 'Europe & Central Asia (excluding high income)', 'Europe & Central Asia', 'Ecuador', 'Egypt, Arab Rep.', 'Euro area', 'Spain', 'Estonia', 'Ethiopia', 'European Union', 'Fragile and conflict affected situations', 'Finland', 'Fiji', 'France', 'Gabon', 'United Kingdom', 'Georgia', 'Ghana', 'Guinea', 'Guinea-Bissau', 'Equatorial Guinea', 'Greece', 'Grenada', 'Guatemala', 'Guyana', 'High income', 'Hong Kong SAR, China', 'Honduras', 'Heavily indebted poor countries (HIPC)', 'Croatia', 'Haiti', 'Hungary', 'IBRD only', 'IDA & IBRD total', 'IDA total', 'IDA blend', 'Indonesia', 'IDA only', 'India', 'Ireland', 'Iraq', 'Iceland', 'Israel', 'Italy', 'Jamaica', 'Jordan', 'Japan', 'Kazakhstan', 'Kenya', 'Kyrgyz Republic', 'Cambodia', 'Kiribati', 'St. Kitts and Nevis', 'Korea, Rep.', 'Kosovo', 'Kuwait', 'Latin America & Caribbean (excluding high income)', 'Lao PDR', 'Lebanon', 'Liberia', 'Libya', 'St. Lucia', 'Latin America & Caribbean', 'Least developed countries: UN classification', 'Low income', 'Sri Lanka', 'Lower middle income', 'Low & middle income', 'Late-demographic dividend', 'Lithuania', 'Luxembourg', 'Latvia', 'Macao SAR, China', 'Morocco', 'Moldova', 'Madagascar', 'Maldives', 'Middle East & North Africa', 'Mexico', 'Middle income', 'Macedonia, FYR', 'Mali', 'Myanmar', 'Montenegro', 'Mongolia', 'Mozambique', 'Mauritius', 'Malawi', 'Malaysia', 'North America', 'Namibia', 'Niger', 'Nigeria', 'Nicaragua', 'Netherlands', 'Norway', 'Nepal', 'New Zealand', 'OECD members', 'Oman', 'Other small states', 'Pakistan', 'Panama', 'Peru', 'Philippines', 'Palau', 'Poland', 'Pre-demographic dividend', 'Portugal', 'Paraguay', 'Pacific island small states', 'Post-demographic dividend', 'Qatar', 'Romania', 'Russian Federation', 'Rwanda', 'South Asia', 'Saudi Arabia', 'Sudan', 'Senegal', 'Singapore', 'Solomon Islands', 'Sierra Leone', 'El Salvador', 'Somalia', 'Serbia', 'Sub-Saharan Africa (excluding high income)', 'South Sudan', 'Sub-Saharan Africa', 'Small states', 'Suriname', 'Slovak Republic', 'Slovenia', 'Sweden', 'Swaziland', 'Seychelles', 'Chad', 'East Asia & Pacific (IDA & IBRD countries)', 'Europe & Central Asia (IDA & IBRD countries)', 'Togo', 'Thailand', 'Tajikistan', 'Turkmenistan', 'Latin America & the Caribbean (IDA & IBRD countries)', 'Timor-Leste', 'South Asia (IDA & IBRD)', 'Sub-Saharan Africa (IDA & IBRD countries)', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Tanzania', 'Uganda', 'Ukraine', 'Upper middle income', 'Uruguay', 'United States', 'Uzbekistan', 'St. Vincent and the Grenadines', 'Vietnam', 'West Bank and Gaza', 'World', 'Samoa', 'South Africa', 'Congo, Dem. Rep.', 'Zambia', 'Zimbabwe'].indexOf(companyCountry) > -1) {
    unit = '\'s GDP';
  }

  let deficitVal;
  if (usUk === 'UK') {
    if (publicPrivate === 'public') {
      deficitVal = '$984bn';
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
