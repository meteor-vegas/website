Template.registerHelper('urlEncode', function(string) {
  return _.words(string).join('+');
});

Template.registerHelper('truncate', function(string, length) {
  var cleanString = _(string).stripTags();
  return _(cleanString).truncate(length);
});
