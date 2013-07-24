$(document).ready(function () {

  var create_boxes = function () {
    $('.color_box').each(function () {
      var color = $(this).text();
      $(this).css('background-color', color);
      $(this).text('').removeClass('invisible');
    });
  };

  var display_priority = function (priority) {
    $('#priority_' + priority.id).remove();

    var $li = $('<li/>').attr('id', 'priority_' + priority.id);
    var $span0 = $('<span/>').addClass('priority');
    $span0.html('<img src="/assets/famfamfam/add.png" class="up"><img src="/assets/famfamfam/delete.png" class="down">');
    var $span1 = $('<span/>').addClass('color_box');
    var $span2 = $('<span/>').addClass('name');
    var $span3 = $('<span/>').addClass('value invisible');
    var $span4 = $('<span/>').addClass('id invisible');

    $span1.css('background-color', priority.color);
    $span2.text(priority.name);
    $span3.text(priority.value);
    $span4.text(priority.id);

    $li.append([$span0, $span1, $span2, $span3, $span4]);
    $li.hide();
    $('#priorities').append($li);
    $li.fadeIn();

    toggle_form();

  };

  var add_priority_everywhere = function (priority) {
    // This might be an update, so remove the old priority if it's in the array.
    priorities = _.reject(priorities, function (p) {
      return p.id === priority.id;
    });
    // Now add/re-add.
    priorities.push(priority);
    // Sort by value, high to low.
    priorities = _.sortBy(priorities, function (p) {
      return p.value;
    }).reverse();
    // Redraw all the entries.
    $('#priorities').empty();
    _.each(priorities, display_priority);
  };

  var create_priority = function () {
    var color = $('input.minicolors').minicolors('value');
    var name = $('#name').val();
    var value = $('#value').val();
    var priority_id = $('#priority_id').val();
    var token = $('input[name="authenticity_token"]').val();

    $.ajax({
      dataType: 'json',
      type: 'POST',
      url: '/priorities',
      data: {'authenticity_token': token, 'id': priority_id, 'color': color, 'name': name, 'value': value}
    }).done(add_priority_everywhere).error(function (message) {
    });

    return false;
  };

  var update_priority = function () {
    var color = $('input.minicolors').minicolors('value');
    var name = $('#name').val();
    var value = $('#value').val();
    var priority_id = $('#priority_id').val();
    var token = $('input[name="authenticity_token"]').val();

    $.ajax({
      dataType: 'json',
      type: 'POST',
      url: '/priorities/' + priority_id,
      data: {
        '_method': 'put',
        'authenticity_token': token,
        'priority[color]': color,
        'priority[name]': name,
        'priority[value]': value
      }
    }).done(add_priority_everywhere).error(function (message) {
    });

    return false;
  };

  var edit_priority = function () {
    if ($('.form').is(':hidden'))
      toggle_form();

    $('#create_priority').hide();
    $('#update_priority').show();

    $('#title').focus();

    var color = $(this).css('background-color');
    color = rgb2hex(color);
    var name = $(this).siblings('.name').text();
    var value = $(this).siblings('.value').text();
    var id = $(this).siblings('.id').text();

    $('input.minicolors').minicolors('value', color);
    $('#name').val(name);
    $('#value').val(value);
    $('#priority_id').val(id);
  };

  var new_priority = function () {
    if ($('.form').is(':hidden'))
      toggle_form();

    $('#create_priority').show();
    $('#update_priority').hide();
  }

  var rgb2hex = function (rgb) {
    var match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    var r = match[1];
    var g = match[2];
    var b = match[3];

    var hex = '#' + ('0' + parseInt(r, 10).toString(16)).slice(-2) +
                    ('0' + parseInt(g, 10).toString(16)).slice(-2) +
                    ('0' + parseInt(b, 10).toString(16)).slice(-2);
    return hex;
  };

  var toggle_form = function () {
    $('#new_priority').toggle();
    $('.form').toggleClass('invisible');

    clear_form();

    return false;
  }

  var clear_form = function () {
    // Clear out the form values.
    $('input.minicolors').minicolors('value', '#ffffff');
    $('#name').val('');
    $('#value').val('');
    $('#priority_id').val('');
  }

  $('input.minicolors').minicolors({
    animationSpeed: 100,
    animationEasing: 'swing',
    change: null,
    changeDelay: 0,
    control: 'hue',
    defaultValue: '#ffffff',
    hide: null,
    hideSpeed: 100,
    inline: false,
    letterCase: 'lowercase',
    opacity: false,
    position: 'default',
    show: null,
    showSpeed: 100,
    swatchPosition: 'left',
    textfield: false,
    theme: 'default'
  });

  var up_priority = function () {
    var id = $(this).closest('li').find('.id').text();
    var token = $('input[name="authenticity_token"]').val();

    $.ajax({
      dataType: 'json',
      type: 'POST',
      url: '/priorities/' + id + '/up',
      data: {authenticity_token: token}
    }).done(process_priority);
  };

  var down_priority = function () {
    var id = $(this).closest('li').find('.id').text();
    var token = $('input[name="authenticity_token"]').val();

    $.ajax({
      dataType: 'json',
      type: 'POST',
      url: '/priorities/' + id + '/down',
      data: {authenticity_token: token}
    }).done(process_priority);
  };

  var process_priority = function (result) {
    _.each(result, add_priority_everywhere);
  };

  create_boxes();
  $('#priorities').on('click', '.color_box', edit_priority);
  $('#new_priority').click(new_priority);
  $('#cancel_priority').click(toggle_form);
  $('#create_priority').click(create_priority);
  $('#update_priority').click(update_priority);

  // We use delegation here because these elements may be added after $(document).ready(), via AJAX.
  $('#priorities').on('click', '.up', up_priority);
  $('#priorities').on('click', '.down', down_priority);
});

