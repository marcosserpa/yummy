// This is a manifest file that'll be compiled into including all the files listed below.
// Add new JavaScript/Coffee code in separate files in this directory and they'll automatically
// be included in the compiled file accessible from http://example.com/assets/application.js
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
//= require jquery
//= require jquery_ujs
//= require jquery-ui
//= require autocomplete-rails
//= require turbolinks
//= require clipboard
//= require_tree .

$(document).ready(function() {
  $('#search_submit').bind('railsAutocomplete.select', function(event, data) {
    $('#main-search').submit();
  });
});


// ========= Quantity multiplicator

var ORIGINAL_VALUES = []

$('#gemfile_text').keyup(function() {
  var quantity = parseFloat($(this).val());

  if (quantity) {
    var factor = quantity / 100.0;

    updatesNutrientsQuantities(factor);
  } else {
    updatesNutrientsQuantities(1);
  }
});

function updatesNutrientsQuantities(quantity) {
  $('body').each(function(td) {
  	$('td').map(function(index, td) {
      var unity = '';

      if ($(td).text().split(/ (.+)/).length == 5) {
        var content = $(td).text().split(/ (.+)/)[1];
      } else if ($(td).text().split(/ (.+)/).length == 3) {
        var content = $(td).text().split(/ (.+)/)[0];

        if ($(td).text().split(/ (.+)/)[1] == '%')
          unity = '%';
      }

  		if (content) {
  			var string = content.trim();

  			if (string) {
  				var only_number = parseFloat(string.trim().split(/ (.+)/)[0]);

          if (!unity)
            unity = string.trim().split(/ (.+)/)[1];

  				if (only_number) {
            if (!ORIGINAL_VALUES[index])
              ORIGINAL_VALUES[index] = [only_number, unity];

  					result = ORIGINAL_VALUES[index][0] * quantity;

  					$(td).text(result.toFixed(2) + ' ' + ORIGINAL_VALUES[index][1]);
  				}
  			}
  		}
  	});
  });
}
