(function( timer, $, undefined ) {

  var defaultTime = '9:00am',
    saved = {}; // Useful to restore previous value in case wrong value is typed.

  function generateTimes(increment) {
    var times = [];
    var startDay = 26;
    var date = new Date(2013, 6, startDay, 0, 0, 0, 0);
    while (date.getDate() === startDay) {
      times.push(date);
      date = new Date(date.getTime() + increment * 60000);
    }
    return formatTimes(times);
  }

  function formatTimes(dates) {
    var formattedTimes = [];
    var am = true;
    for (var i = 0; i < dates.length; i++) {
      var hours = dates[i].getHours();
      am = hours < 12;
      hours = hours % 12 + (hours % 12 === 0 ? 12 : 0);
      minutes = dates[i].getMinutes() + '';
      minutes = (minutes.length === 1 ? '0' : '') + minutes;
      var s  = hours + ':' + minutes + (am ? 'am' : 'pm');
      formattedTimes.push(s);
    }
    return formattedTimes;
  }

  function computeEscape() {
    $(':focus').blur();
    $('.list-abs:visible').hide();
  }

  function computeEnter(this_) {
    if ($('.list-abs:visible').length === 0)
      return;
    $(this_).val($('.list-abs:visible div.selected').data('time'));
    $(this_).next().hide();
  }

  function computeKeyDown() {
    if ($('.list-abs:visible').length === 0) {
      $(':focus').focus();
    }
    if ($('.list-abs div.selected').data('time') == '11:30pm') {
      return;
    }
    if ($('.list-abs div.selected').length === 0) {
      console.log('zeeerooooooo');
      $('.list-abs div:first-child').addClass('selected');
      return;
    }
    var next = $('.list-abs div.selected').next();
    $('.list-abs div.selected').removeClass('selected');
    next.addClass('selected');
    $('.list-abs:visible').scrollTop(($('.list-abs:visible div.selected').index() - 2) * $('.list-abs:visible div.selected').height());
  }

  function computeKeyUp() {
    if ($('.list-abs:visible').length === 0) {
      $(':focus').focus();
    }
    if ($('.list-abs div.selected').data('time') == '12:00am') {
      return;
    }
    if ($('.list-abs div.selected').length === 0) {
      console.log('zeeerooooooo');
      $('.list-abs div:first-child').addClass('selected');
      return;
    }
    var prev = $('.list-abs div.selected').prev();
    $('.list-abs div.selected').removeClass('selected');
    prev.addClass('selected');
    $('.list-abs:visible').scrollTop(($('.list-abs:visible div.selected').index() - 2) * $('.list-abs:visible div.selected').height());
  }

  var validTime = function(value) {
    var regex = /^\d{1,2}:\d{2}\s?[ap]m$/i;
    if (!$.trim(value).match(regex))
      return false;
    var data = value.split(':');
    var hours = parseInt(data[0]);
    var minutes = parseInt(data[1].substring(0, 2));
    if (hours < 0 || hours > 12 || minutes < 0 || minutes > 59) {
      return false;
    }
    return true;
  };

  $('.time-picker').each(function() {
    if (!validTime($(this).val())) {
      $(this).val(defaultTime);
    }
    var times = generateTimes($(this).data('increment') != undefined ? $(this).data('increment') : 30);
    var html = '<div class="list-abs">';
    for (var i = 0; i < times.length; i++) {
      html += '<div data-time="' + times[i] + '">' + times[i] + '</div>';
    }
    html += '</div>';
    $(this).after(html);
  });

  $(document).on('change', '.time-picker', function() {
    var value = $(this).val();
    if (!validTime(value)) {
      $(this).val(saved[this.id]);
    }
  });

  $(document).on('focus', '.time-picker', function() {
    saved[this.id] = $(this).val();
    $('.list-abs:visible').hide();
    $('.list-abs div.selected').removeClass('selected');
    var next = $(this).next();
    next.width($(this).outerWidth());
    next.css({
      position: "absolute",
      top: $(this).position().top + $(this).outerHeight(),
      left: $(this).position().left
    });
    $(next).children().filter('div[data-time="' + $(this).val() + '"]').addClass('selected'); // select current element.
    next.show();
    next.scrollTop($(next).children().filter('div[data-time="' + $(this).val() + '"]').index() * $($('.list-abs:visible').children()[0]).height());
  });

  $(document).on('click', '.time-picker', function(event) {
    event.stopPropagation();
  });

  $(document).on('click', function() {
    $('.list-abs:visible').hide();
  });

  $(document).on('keydown', '.time-picker', function(event) {
    var keyCode = event.keyCode || event.which;
    switch (keyCode) {
      case 9: // Tab key
        computeEnter(this);
        break;
      case 13: // Enter key
        event.preventDefault();
        computeEnter(this);
        break;
      case 27: // Escape key
        computeEscape();
        break;
      case 38: // Up key
        event.preventDefault();
        computeKeyUp();
        break;
      case 40: // Down key
        event.preventDefault();
        computeKeyDown();
        break;
    }
  });

  $('.list-abs').on('click', 'div', function() {
    var time = $(this).data('time');
    $(this).parent().prev().val(time);
  });

}( window.timer = window.timer || {}, jQuery ));