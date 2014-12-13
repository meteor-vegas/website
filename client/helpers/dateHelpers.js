Template.registerHelper('longDate', function(date) {
  return moment(date).format(TAPi18n.__('meetup_date_format'));
});

Template.registerHelper('calendarDay', function(date) {
  return moment(date).format('dddd');
});

Template.registerHelper('calendarDate', function(date) {
  return moment(date).format('Do');
});

Template.registerHelper('calendarMonth', function(date) {
  return moment(date).format('MMMM');
});
