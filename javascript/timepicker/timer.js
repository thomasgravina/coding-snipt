(function( timer, $, undefined ) {

  var defaultTime = '9:00am',
    saved = {}; // Useful to restore previous value in case wrong value is typed.

  function generateTimes(increment) {
    var times = [];
    var startDay = 26;
    //var increment = 30; // minutes
    var date = new Date(2013, 6, startDay, 0, 0, 0, 0);
    while (date.getDate() === startDay) {
      times.push(date);
      date = new Date(date.getTime() + increment * 60000);
    }
    return formatTimes(times);
  }

  function generateTimes(increment) {
    var times = [];
    var startDay = 26;
    //var increment = 30; // minutes
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
  }

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
    $(this).next().width($(this).width());
    $(this).next().offset({ left: $(this).position().left });
    $(this).next().show();
  });

  $(document).on('click', '.time-picker', function(event) {
    event.stopPropagation();
  });

  $(document).on('click', function() {
    $('.list-abs:visible').hide();
  });

  $('.list-abs').on('click', 'div', function() {
    var time = $(this).data('time');
    $(this).parent().prev().val(time);
  });


}( window.timer = window.timer || {}, jQuery ));