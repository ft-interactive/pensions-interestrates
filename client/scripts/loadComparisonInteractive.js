function loadComparisonInteractive(data) {
  // console.log(data)

  var list = _.pluck(data, 'name');
  $('#interactive-compare').autocomplete({
    source: list,
    minLength: 2,
    delay: 500,
    select: function select(e, ui) {
      if (ui.item) {
        $(e.target).val(ui.item.value);
      }
      var name = $(this).val();
      getResult(name);
    }
  });

  document.getElementById('interactive-compare').value = 'Belgium';
  getResult(); // start page with this

  function getResult() {
    let pensionDeficit = 3.4; // in US trillions
    if ( document.getElementById("interactive-option--uk").getAttribute('aria-pressed') === "true" ) {
      pensionDeficit = 0.5 // in US trillions
    }

    const name = document.getElementById('interactive-compare').value;

    const value = _.findWhere(data, {name}).value / 1000000; // original data in millions

    let multiplyFactor = pensionDeficit / value;
    let interactiveText;
    if (multiplyFactor < 1) {
      multiplyFactor = Math.round(1 / multiplyFactor);
      interactiveText = `${multiplyFactor} times smaller`;
    } else {
      multiplyFactor = Math.round(multiplyFactor);
      interactiveText = `${multiplyFactor} times bigger`;
    }

    document.getElementById('interactive-compare').value = name;
    document.getElementById('interactive-result').innerHTML = interactiveText;
  }

  document.getElementById('random').addEventListener('click', () => {
    const randomId = Math.floor(Math.random()*data.length);
    const name = data[randomId].name;

    document.getElementById('interactive-compare').value = name;
    getResult();
  });


  $('.interactive-option').on('click', function() {
    $('.interactive-option').attr('aria-pressed', false);
    $(this).attr('aria-pressed', true);

    getResult();
  });
}
